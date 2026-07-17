-- Migration 008: Multi-Tenancy & SSO (Otto Core)

-- Organizations (tenants)
CREATE TABLE IF NOT EXISTS orgs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,        -- URL-safe identifier
  plan        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','starter','pro','enterprise')),
  settings    JSONB NOT NULL DEFAULT '{}', -- org-level config
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Default Org for existing users
INSERT INTO orgs (id, name, slug) VALUES ('00000000-0000-0000-0000-000000000000', 'Default Org', 'default') ON CONFLICT DO NOTHING;

-- Users table
CREATE TABLE IF NOT EXISTS otto_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_super_admin BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  default_org_id UUID REFERENCES orgs(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Org membership with roles
CREATE TABLE IF NOT EXISTS org_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES otto_users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member'
                CHECK (role IN ('owner','admin','manager','member','viewer')),
  invited_by  UUID REFERENCES otto_users(id),
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- Domains registry
CREATE TABLE IF NOT EXISTS otto_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  route VARCHAR(255) NOT NULL,
  color VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles per domain per user
CREATE TABLE IF NOT EXISTS otto_user_domain_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES otto_users(id) ON DELETE CASCADE,
  domain_id UUID REFERENCES otto_domains(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  granted_by UUID REFERENCES otto_users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, domain_id)
);

-- Session tokens
CREATE TABLE IF NOT EXISTS otto_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES otto_users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log
CREATE TABLE IF NOT EXISTS otto_auth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES otto_users(id),
  event VARCHAR(100) NOT NULL,
  ip_address VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON otto_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON otto_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_domain_roles_user ON otto_user_domain_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_user ON otto_auth_logs(user_id);

-- Add org_id to ALL existing entity tables
ALTER TABLE documents       ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES orgs(id);
ALTER TABLE suppliers       ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES orgs(id);
ALTER TABLE customers       ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES orgs(id);
ALTER TABLE products        ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES orgs(id);
ALTER TABLE invoices        ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES orgs(id);
ALTER TABLE ledger_entries  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES orgs(id);
ALTER TABLE actions         ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES orgs(id);
ALTER TABLE agent_events    ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES orgs(id);
ALTER TABLE trust_grants    ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES orgs(id);

-- Enable RLS (Placeholder, actual RLS applied later or adjusted based on setting)
-- ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY actions_org_isolation ON actions USING (org_id = current_setting('app.current_org_id', true)::uuid);
