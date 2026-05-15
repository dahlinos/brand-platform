-- ============================================================
-- LEVERANTÖR: supplier_sync_log, supplier_purchase_orders,
--             shipment_tracking
-- ============================================================

-- Loggar för synkjobb
CREATE TABLE supplier_sync_log (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type         text NOT NULL,
  status            text NOT NULL,
  products_updated  int DEFAULT 0,
  prices_updated    int DEFAULT 0,
  stock_updated     int DEFAULT 0,
  errors            jsonb DEFAULT '[]',
  started_at        timestamptz DEFAULT now(),
  finished_at       timestamptz,

  CONSTRAINT sync_type_check CHECK (
    sync_type IN ('full','delta','prices_only','stock_only')
  ),
  CONSTRAINT sync_status_check CHECK (
    status IN ('running','success','partial','failed')
  )
);

-- Inköpsorder till leverantör
-- TODO: [OPEN DECISION #1] payload_sent anpassas när API-docs anländer
CREATE TABLE supplier_purchase_orders (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid NOT NULL REFERENCES orders(id),
  supplier_order_id   text,
  status              text DEFAULT 'pending',
  payload_sent        jsonb,
  response_raw        jsonb,
  submitted_by        text NOT NULL,
  submitted_at        timestamptz,
  confirmed_at        timestamptz,
  estimated_delivery  date,
  error_message       text,

  CONSTRAINT spo_status_check CHECK (
    status IN ('pending','submitted','confirmed','in_production','shipped','cancelled')
  ),
  -- submitted_by måste vara antingen 'agent:felix' eller 'admin:{uuid}'
  CONSTRAINT spo_submitted_by_check CHECK (
    submitted_by ~ '^(agent:felix|admin:[0-9a-f-]{36})$'
  )
);

-- Fraktstatus
CREATE TABLE shipment_tracking (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id   uuid REFERENCES supplier_purchase_orders(id),
  order_id            uuid NOT NULL REFERENCES orders(id),
  carrier             text,
  tracking_number     text,
  status              text,
  last_event          text,
  estimated_delivery  date,
  delivered_at        timestamptz,
  updated_at          timestamptz DEFAULT now()
);

-- Index
CREATE INDEX idx_sync_log_status ON supplier_sync_log(status);
CREATE INDEX idx_sync_log_started ON supplier_sync_log(started_at);
CREATE INDEX idx_spo_order ON supplier_purchase_orders(order_id);
CREATE INDEX idx_spo_status ON supplier_purchase_orders(status);
CREATE INDEX idx_tracking_order ON shipment_tracking(order_id);

-- RLS
ALTER TABLE supplier_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_tracking ENABLE ROW LEVEL SECURITY;

-- Sync-log: endast service role (admin-panel läser via service role)
CREATE POLICY "no direct client access sync_log" ON supplier_sync_log
  USING (false);

-- Inköpsorder: ingen direkt klientåtkomst — Felix och admin via service role
CREATE POLICY "no direct client access spo" ON supplier_purchase_orders
  USING (false);

-- Fraktstatus: kunder kan läsa spårning för sina egna ordrar
CREATE POLICY "customers read own tracking" ON shipment_tracking
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON c.id = o.customer_id
      WHERE c.auth_user_id = auth.uid()
    )
  );
