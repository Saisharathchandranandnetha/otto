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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  -- roles: 'viewer' | 'operator' | 'manager' | 'admin'
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
  -- events: 'login_success' | 'login_failed' | 
  --         'logout' | 'domain_access' | 'permission_denied'
  ip_address VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON otto_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON otto_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_domain_roles_user ON otto_user_domain_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_user ON otto_auth_logs(user_id);
