-- ============================================================
-- KUNDER: customers, customer_addresses,
--         anonymous_sessions, customer_price_lists
-- ============================================================

-- Kundprofiler (extends Supabase auth.users)
CREATE TABLE customers (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id        uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name        text NOT NULL,
  org_number          text,
  vat_number          text,
  contact_name        text NOT NULL,
  contact_email       text NOT NULL,
  contact_phone       text,
  invoice_email       text,
  credit_approved     bool DEFAULT false,
  credit_limit_sek    numeric(12,2) DEFAULT 0, -- TODO: [OPEN DECISION #5]
  payment_terms_days  int DEFAULT 30,
  industry            text,
  ai_segment          text,
  preferred_categories text[],
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- Adresser per kund
CREATE TABLE customer_addresses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type        text DEFAULT 'shipping',
  street      text NOT NULL,
  city        text NOT NULL,
  postal_code text NOT NULL,
  country     text DEFAULT 'SE',
  is_default  bool DEFAULT false
);

-- Anonyma sessioner (personalisering innan inloggning)
CREATE TABLE anonymous_sessions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint           text NOT NULL,
  inferred_industry     text,
  inferred_company      text,
  viewed_categories     jsonb DEFAULT '{}',
  viewed_products       uuid[] DEFAULT '{}',
  search_queries        text[] DEFAULT '{}',
  time_on_site_s        int DEFAULT 0,
  utm_source            text,
  utm_campaign          text,
  converted_to_customer uuid REFERENCES customers(id),
  gdpr_consent          bool DEFAULT false,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- Kundspecifika prislistor (aktiveras fas 3+)
CREATE TABLE customer_price_lists (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name          text NOT NULL,
  discount_pct  numeric(5,2) NOT NULL,
  valid_from    date,
  valid_to      date,
  is_active     bool DEFAULT false
);

-- Index
CREATE INDEX idx_customers_auth_user ON customers(auth_user_id);
CREATE INDEX idx_customers_email ON customers(contact_email);
CREATE INDEX idx_addresses_customer ON customer_addresses(customer_id);
CREATE INDEX idx_anon_sessions_fingerprint ON anonymous_sessions(fingerprint);
CREATE INDEX idx_price_lists_customer ON customer_price_lists(customer_id);

-- RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_price_lists ENABLE ROW LEVEL SECURITY;

-- Kunder ser bara sin egen profil
CREATE POLICY "customers read own" ON customers
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "customers update own" ON customers
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Kunder ser bara sina egna adresser
CREATE POLICY "customers read own addresses" ON customer_addresses
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "customers insert own addresses" ON customer_addresses
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "customers update own addresses" ON customer_addresses
  FOR UPDATE USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  );

-- Anonyma sessioner: service role hanterar, ingen direkt klientåtkomst
CREATE POLICY "service role only anon_sessions" ON anonymous_sessions
  USING (false);

-- Prislistor: kunder kan bara läsa sina egna
CREATE POLICY "customers read own price lists" ON customer_price_lists
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  );
