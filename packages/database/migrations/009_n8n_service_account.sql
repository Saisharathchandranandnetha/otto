-- Migration 009: Service account for n8n
INSERT INTO otto_users (id, email, password_hash, full_name, is_super_admin)
VALUES ('11111111-1111-1111-1111-111111111111', 'n8n@otto.local', 'n/a', 'system_service', false)
ON CONFLICT (email) DO NOTHING;
