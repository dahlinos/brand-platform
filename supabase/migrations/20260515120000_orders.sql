-- ============================================================
-- ORDRAR: orders, order_lines, returns, order_events
-- ============================================================

-- Ordrar
CREATE TABLE orders (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        text NOT NULL UNIQUE,
  customer_id         uuid NOT NULL REFERENCES customers(id),
  shipping_address_id uuid REFERENCES customer_addresses(id),
  status              text NOT NULL DEFAULT 'draft',
  payment_method      text NOT NULL,
  payment_status      text DEFAULT 'unpaid',
  stripe_payment_id   text,
  stripe_invoice_id   text,
  subtotal_sek        numeric(12,2) NOT NULL DEFAULT 0,
  shipping_sek        numeric(12,2) DEFAULT 0, -- TODO: [OPEN DECISION #6]
  vat_sek             numeric(12,2) DEFAULT 0,
  total_sek           numeric(12,2) NOT NULL DEFAULT 0,
  notes               text,
  placed_at           timestamptz,
  approved_at         timestamptz,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now(),

  -- Validera status-värden
  CONSTRAINT orders_status_check CHECK (
    status IN ('draft','pending_approval','approved','processing','shipped','delivered','cancelled')
  ),
  CONSTRAINT orders_payment_method_check CHECK (
    payment_method IN ('invoice','card')
  ),
  CONSTRAINT orders_payment_status_check CHECK (
    payment_status IN ('unpaid','paid','refunded')
  )
);

-- Orderrader
CREATE TABLE order_lines (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        uuid NOT NULL REFERENCES products(id),
  variant_id        uuid REFERENCES product_variants(id),
  print_method_id   uuid REFERENCES print_methods(id),
  quantity          int NOT NULL,
  print_colors      int DEFAULT 0,
  print_positions   text[] DEFAULT '{}',
  artwork_url       text,
  unit_price_sek    numeric(10,2) NOT NULL,
  print_price_sek   numeric(10,2) DEFAULT 0,
  setup_fee_sek     numeric(10,2) DEFAULT 0,
  line_total_sek    numeric(10,2) NOT NULL,
  print_notes       text,

  CONSTRAINT order_lines_quantity_check CHECK (quantity > 0)
);

-- Returer och reklamationer
CREATE TABLE returns (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          uuid NOT NULL REFERENCES orders(id),
  order_line_id     uuid REFERENCES order_lines(id),
  reason            text NOT NULL,
  description       text,
  status            text DEFAULT 'open',
  resolution        text,
  refund_amount_sek numeric(10,2),
  evidence_urls     text[] DEFAULT '{}',
  created_at        timestamptz DEFAULT now(),
  resolved_at       timestamptz,

  CONSTRAINT returns_reason_check CHECK (
    reason IN ('defective','wrong_product','wrong_print','qty_error','other')
  ),
  CONSTRAINT returns_status_check CHECK (
    status IN ('open','reviewing','approved','rejected','resolved')
  ),
  CONSTRAINT returns_resolution_check CHECK (
    resolution IS NULL OR
    resolution IN ('refund','reprint','credit','replacement')
  )
);

-- Immutable händelselogg — append-only, aldrig UPDATE eller DELETE
CREATE TABLE order_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid NOT NULL REFERENCES orders(id),
  event_type  text NOT NULL,
  description text,
  actor       text,
  metadata    jsonb DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

-- Index
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_lines_order ON order_lines(order_id);
CREATE INDEX idx_returns_order ON returns(order_id);
CREATE INDEX idx_order_events_order ON order_events(order_id);
CREATE INDEX idx_order_events_created ON order_events(created_at);

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

-- Kunder ser bara sina egna ordrar
CREATE POLICY "customers read own orders" ON orders
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "customers insert own orders" ON orders
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  );

-- Orderrader: samma logik via order
CREATE POLICY "customers read own order_lines" ON order_lines
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON c.id = o.customer_id
      WHERE c.auth_user_id = auth.uid()
    )
  );

-- Returer: kunder kan läsa och skapa egna
CREATE POLICY "customers read own returns" ON returns
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON c.id = o.customer_id
      WHERE c.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "customers insert own returns" ON returns
  FOR INSERT WITH CHECK (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON c.id = o.customer_id
      WHERE c.auth_user_id = auth.uid()
    )
  );

-- order_events: kunder kan läsa sina egna händelser
-- INGEN kan UPDATE eller DELETE — enforcement via policy
CREATE POLICY "customers read own order_events" ON order_events
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON c.id = o.customer_id
      WHERE c.auth_user_id = auth.uid()
    )
  );

-- Trigger: automatisk updated_at på orders
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
