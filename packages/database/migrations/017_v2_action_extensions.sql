-- 017_v2_action_extensions.sql
ALTER TABLE actions ADD COLUMN IF NOT EXISTS agent_id UUID;
ALTER TABLE actions ADD COLUMN IF NOT EXISTS action_class TEXT;
ALTER TABLE actions ADD COLUMN IF NOT EXISTS channel TEXT;
