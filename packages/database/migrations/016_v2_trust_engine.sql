-- 016_v2_trust_engine.sql
CREATE TABLE autonomy_certificates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL REFERENCES orgs(id),
  agent_id      UUID NOT NULL,
  issued_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL,  -- issued_at + 90 days
  issued_by     UUID REFERENCES otto_users(id),
  scope         JSONB NOT NULL,        -- { actionClasses: [], capOverrides: {} }
  revoked_at    TIMESTAMPTZ,
  revoked_by    UUID REFERENCES otto_users(id),
  revoke_reason TEXT
);

CREATE TABLE trust_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL REFERENCES orgs(id),
  agent_id      UUID NOT NULL,
  action_class  TEXT NOT NULL,
  event_type    TEXT NOT NULL,         -- 'graduated', 'decayed', 'revoked', 'action_undone'
  previous_level INT,
  new_level      INT,
  reason        TEXT,
  triggered_by  UUID REFERENCES otto_users(id), -- If manual
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adding agent_id to trust_grants (as specified in 4.3 and 7.4 of the spec)
ALTER TABLE trust_grants ADD COLUMN agent_id UUID;
ALTER TABLE trust_grants ADD COLUMN action_class TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE trust_grants ADD COLUMN level INT NOT NULL DEFAULT 0 CHECK (level BETWEEN 0 AND 4);
ALTER TABLE trust_grants ADD COLUMN approval_streak INT NOT NULL DEFAULT 0;
ALTER TABLE trust_grants ADD COLUMN rejection_count INT NOT NULL DEFAULT 0;
ALTER TABLE trust_grants ADD COLUMN undo_count INT NOT NULL DEFAULT 0;
ALTER TABLE trust_grants ADD COLUMN last_approval TIMESTAMPTZ;
ALTER TABLE trust_grants ADD COLUMN last_rejection TIMESTAMPTZ;
ALTER TABLE trust_grants ADD COLUMN last_decay TIMESTAMPTZ;
ALTER TABLE trust_grants ADD COLUMN certificate_id UUID REFERENCES autonomy_certificates(id);
ALTER TABLE trust_grants ADD COLUMN cap_amount NUMERIC(12,2);
ALTER TABLE trust_grants ADD COLUMN cap_currency TEXT DEFAULT 'INR';
ALTER TABLE trust_grants ADD COLUMN undo_window_sec INT DEFAULT 3600;

-- Drop constraints if necessary and add unique constraint
-- We might need to handle existing data if any, but since this is dev let's just add the constraint
ALTER TABLE trust_grants ADD CONSTRAINT unique_org_agent_action UNIQUE(org_id, agent_id, action_class);

-- Adding undo fields to actions table
ALTER TABLE actions ADD COLUMN undo_payload JSONB;
ALTER TABLE actions ADD COLUMN undone_at TIMESTAMPTZ;
ALTER TABLE actions ADD COLUMN undone_by UUID REFERENCES otto_users(id);

-- Adding an audit table for quorum approvals
CREATE TABLE approval_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL REFERENCES orgs(id),
  action_id     UUID NOT NULL REFERENCES actions(id),
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  required_approvals INT NOT NULL DEFAULT 2,
  current_approvals INT NOT NULL DEFAULT 0,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE approval_votes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id    UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES otto_users(id),
  decision      TEXT NOT NULL CHECK (decision IN ('approve', 'reject')),
  reason        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(request_id, user_id)
);
