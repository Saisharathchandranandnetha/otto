-- Migration 008: Multi-Tenancy (Otto Core)
CREATE TABLE IF NOT EXISTS otto.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure users have org_id if we want strict multi-tenancy
ALTER TABLE otto.users ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES otto.organizations(id);

-- Add default org and assign admin
INSERT INTO otto.organizations (id, name) VALUES ('00000000-0000-0000-0000-000000000000', 'Default Org') ON CONFLICT DO NOTHING;
UPDATE otto.users SET org_id = '00000000-0000-0000-0000-000000000000' WHERE org_id IS NULL;
