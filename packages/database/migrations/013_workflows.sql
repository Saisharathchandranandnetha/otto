-- Migration 013: Workflows
CREATE TABLE IF NOT EXISTS workflows (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL REFERENCES orgs(id),
  name          TEXT NOT NULL,
  description   TEXT,
  otto_json     JSONB NOT NULL,
  n8n_id        TEXT,
  n8n_version   INT DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','published','active','paused','archived')),
  created_by    UUID REFERENCES otto_users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workflow_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id     UUID NOT NULL REFERENCES workflows(id),
  org_id          UUID NOT NULL REFERENCES orgs(id),
  n8n_execution_id TEXT,
  status          TEXT NOT NULL DEFAULT 'running'
                    CHECK (status IN ('running','success','failed','waiting')),
  input_data      JSONB,
  output_data     JSONB,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at     TIMESTAMPTZ,
  error           TEXT
);
