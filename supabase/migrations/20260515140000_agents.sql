-- ============================================================
-- AGENTER: agent_tasks, personalization_profiles,
--          ai_chat_sessions, agent_run_log
-- ============================================================

-- Alla agentuppdrag (kö + historik)
CREATE TABLE agent_tasks (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type         text NOT NULL,
  status            text DEFAULT 'queued',
  priority          int DEFAULT 5,
  payload           jsonb NOT NULL DEFAULT '{}',
  assigned_agent    text DEFAULT 'felix',
  order_id          uuid REFERENCES orders(id),
  requires_approval bool DEFAULT false,
  approved_by       text,
  approved_at       timestamptz,
  rejection_reason  text,
  result            jsonb,
  error             text,
  retry_count       int DEFAULT 0,
  created_at        timestamptz DEFAULT now(),
  started_at        timestamptz,
  completed_at      timestamptz,

  CONSTRAINT agent_tasks_type_check CHECK (
    task_type IN (
      'submit_purchase_order',
      'personalize_catalog',
      'update_product_tags',
      'send_order_notification',
      'process_return',
      'sync_supplier_products',
      'generate_product_descriptions'
    )
  ),
  CONSTRAINT agent_tasks_status_check CHECK (
    status IN (
      'queued','running','awaiting_approval',
      'approved','rejected','completed','failed'
    )
  ),
  CONSTRAINT agent_tasks_priority_check CHECK (
    priority BETWEEN 1 AND 10
  )
);

-- Personaliseringsprofiler (anonym + inloggad)
CREATE TABLE personalization_profiles (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id       uuid UNIQUE REFERENCES customers(id),
  anon_session_id   uuid REFERENCES anonymous_sessions(id),
  segment           text,
  top_categories    jsonb DEFAULT '[]',
  price_sensitivity text DEFAULT 'medium',
  avg_order_qty     numeric DEFAULT 0,
  preferred_methods text[] DEFAULT '{}',
  embedding         vector(1536),
  updated_at        timestamptz DEFAULT now(),

  CONSTRAINT pp_segment_check CHECK (
    segment IS NULL OR
    segment IN ('enterprise','smb','startup','agency')
  ),
  CONSTRAINT pp_price_sensitivity_check CHECK (
    price_sensitivity IN ('low','medium','high')
  ),
  CONSTRAINT pp_must_have_owner CHECK (
    customer_id IS NOT NULL OR anon_session_id IS NOT NULL
  )
);

-- AI-chatt-sessioner
CREATE TABLE ai_chat_sessions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id       uuid REFERENCES customers(id),
  anon_session_id   uuid REFERENCES anonymous_sessions(id),
  messages          jsonb DEFAULT '[]',
  products_shown    uuid[] DEFAULT '{}',
  outcome           text,
  satisfaction_score int,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),

  CONSTRAINT chat_outcome_check CHECK (
    outcome IS NULL OR
    outcome IN ('converted','abandoned','support_resolved','escalated')
  ),
  CONSTRAINT chat_satisfaction_check CHECK (
    satisfaction_score IS NULL OR
    satisfaction_score BETWEEN 1 AND 5
  )
);

-- Agentkörsessioner (debugging + kostnadsövervakning)
-- OBS: Aldrig logga PII här — använd customer_id, aldrig namn/e-post
CREATE TABLE agent_run_log (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id           uuid REFERENCES agent_tasks(id),
  agent_name        text NOT NULL,
  model_used        text,
  prompt_tokens     int,
  completion_tokens int,
  latency_ms        int,
  cost_sek          numeric(8,4),
  created_at        timestamptz DEFAULT now()
);

-- Index
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_tasks_type ON agent_tasks(task_type);
CREATE INDEX idx_agent_tasks_order ON agent_tasks(order_id);
CREATE INDEX idx_agent_tasks_created ON agent_tasks(created_at);
CREATE INDEX idx_agent_tasks_priority ON agent_tasks(priority, created_at);
CREATE INDEX idx_pp_customer ON personalization_profiles(customer_id);
CREATE INDEX idx_pp_anon ON personalization_profiles(anon_session_id);
CREATE INDEX idx_chat_customer ON ai_chat_sessions(customer_id);
CREATE INDEX idx_run_log_task ON agent_run_log(task_id);

-- RLS
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_run_log ENABLE ROW LEVEL SECURITY;

-- agent_tasks: ingen direkt klientåtkomst — Felix och admin via service role
CREATE POLICY "no direct client access agent_tasks" ON agent_tasks
  USING (false);

-- Personaliseringsprofiler: service role hanterar
CREATE POLICY "no direct client access pp" ON personalization_profiles
  USING (false);

-- Chattsessioner: kunder kan läsa sina egna
CREATE POLICY "customers read own chat sessions" ON ai_chat_sessions
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  );

-- agent_run_log: ingen klientåtkomst
CREATE POLICY "no direct client access run_log" ON agent_run_log
  USING (false);

-- Trigger: updated_at på ai_chat_sessions
CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON ai_chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
