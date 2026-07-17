-- Migration 012: Agents
CREATE TABLE IF NOT EXISTS agent_configs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES orgs(id),
  version     TEXT NOT NULL DEFAULT '2.0',
  name        TEXT NOT NULL,
  description TEXT,
  avatar      TEXT,
  model       TEXT NOT NULL DEFAULT 'otto:balanced',
  system_prompt TEXT NOT NULL,
  temperature NUMERIC(3,2) NOT NULL DEFAULT 0.7,
  max_tokens  INT NOT NULL DEFAULT 2048,
  tools       JSONB NOT NULL DEFAULT '[]',
  knowledge   JSONB NOT NULL DEFAULT '[]',
  trust_config JSONB NOT NULL DEFAULT '{}',
  deployments JSONB NOT NULL DEFAULT '[]',
  domain      TEXT,
  playbook    TEXT,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','active','paused','archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);
