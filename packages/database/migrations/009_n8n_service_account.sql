-- Migration 009: Service account for n8n
INSERT INTO otto.users (id, email, password_hash, role)
VALUES ('n8n_service_account', 'n8n@otto.local', 'n/a', 'system_service')
ON CONFLICT (id) DO NOTHING;
