-- ============================================================
-- ADMIN, GDPR & ANALYTICS: admin_users, audit_log,
--                          gdpr_consents, site_analytics
-- ============================================================

-- Admin-användare
CREATE TABLE admin_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  role          text DEFAULT 'staff',
  permissions   text[] DEFAULT '{}',
  is_active     bool DEFAULT true,
  created_at    timestamptz DEFAULT now(),

  CONSTRAINT admin_role_check CHECK (
    role IN ('owner','manager','staff')
  )
);

-- Immutable audit trail för känsliga operationer
-- OBS: Aldrig logga PII — använd customer_id, aldrig namn/e-post
CREATE TABLE audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid,
  actor_type  text,
  action      text NOT NULL,
  table_name  text,
  record_id   uuid,
  before      jsonb,
  after       jsonb,
  ip_address  text,
  created_at  timestamptz DEFAULT now(),

  CONSTRAINT audit_actor_type_check CHECK (
    actor_type IS NULL OR
    actor_type IN ('admin','customer','agent','system')
  )
);

-- GDPR consent-logg
CREATE TABLE gdpr_consents (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id       uuid REFERENCES customers(id),
  anon_session_id   uuid REFERENCES anonymous_sessions(id),
  consent_type      text NOT NULL,
  granted           bool NOT NULL,
  ip_address        text,
  user_agent        text,
  created_at        timestamptz DEFAULT now(),

  CONSTRAINT gdpr_consent_type_check CHECK (
    consent_type IN ('analytics','marketing','functional','necessary')
  ),
  CONSTRAINT gdpr_must_have_owner CHECK (
    customer_id IS NOT NULL OR anon_session_id IS NOT NULL
  )
);

-- Beteendeanalytik
CREATE TABLE site_analytics (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_session_id uuid REFERENCES anonymous_sessions(id),
  customer_id     uuid REFERENCES customers(id),
  product_id      uuid REFERENCES products(id),
  event_type      text NOT NULL,
  page_url        text,
  referrer        text,
  search_query    text,
  duration_s      int,
  metadata        jsonb DEFAULT '{}',
  created_at      timestamptz DEFAULT now(),

  CONSTRAINT analytics_event_type_check CHECK (
    event_type IN (
      'page_view','product_view','search',
      'add_to_cart','checkout_start','purchase'
    )
  )
);

-- Index
CREATE INDEX idx_admin_users_auth ON admin_users(auth_user_id);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_id, actor_type);
CREATE INDEX idx_audit_log_table ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
CREATE INDEX idx_gdpr_customer ON gdpr_consents(customer_id);
CREATE INDEX idx_gdpr_anon ON gdpr_consents(anon_session_id);
CREATE INDEX idx_analytics_session ON site_analytics(anon_session_id);
CREATE INDEX idx_analytics_customer ON site_analytics(customer_id);
CREATE INDEX idx_analytics_product ON site_analytics(product_id);
CREATE INDEX idx_analytics_event ON site_analytics(event_type, created_at);

-- RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

-- admin_users: admins kan bara se sin egen rad
CREATE POLICY "admins read own record" ON admin_users
  FOR SELECT USING (auth_user_id = auth.uid());

-- audit_log: ingen direkt klientåtkomst — system-only via service role
CREATE POLICY "no direct client access audit_log" ON audit_log
  USING (false);

-- gdpr_consents: kunder kan läsa och skapa sina egna
CREATE POLICY "customers read own consents" ON gdpr_consents
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "anyone insert consents" ON gdpr_consents
  FOR INSERT WITH CHECK (true);

-- site_analytics: ingen direkt klientåtkomst
CREATE POLICY "no direct client access analytics" ON site_analytics
  USING (false);

-- Trigger: updated_at på customers
CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
