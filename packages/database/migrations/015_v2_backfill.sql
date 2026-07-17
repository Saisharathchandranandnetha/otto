-- Migration 015: Backfill Users to Default Org

-- Update users who don't have a default org
UPDATE otto_users 
SET default_org_id = '00000000-0000-0000-0000-000000000000' 
WHERE default_org_id IS NULL;

-- Insert them into org_members if they are not already there
INSERT INTO org_members (org_id, user_id, role)
SELECT '00000000-0000-0000-0000-000000000000', id, 'owner'
FROM otto_users
ON CONFLICT (org_id, user_id) DO NOTHING;

-- Update other tables where org_id might be null (if applicable)
UPDATE documents SET org_id = '00000000-0000-0000-0000-000000000000' WHERE org_id IS NULL;
UPDATE suppliers SET org_id = '00000000-0000-0000-0000-000000000000' WHERE org_id IS NULL;
UPDATE customers SET org_id = '00000000-0000-0000-0000-000000000000' WHERE org_id IS NULL;
UPDATE products SET org_id = '00000000-0000-0000-0000-000000000000' WHERE org_id IS NULL;
UPDATE invoices SET org_id = '00000000-0000-0000-0000-000000000000' WHERE org_id IS NULL;
UPDATE ledger_entries SET org_id = '00000000-0000-0000-0000-000000000000' WHERE org_id IS NULL;
UPDATE actions SET org_id = '00000000-0000-0000-0000-000000000000' WHERE org_id IS NULL;
UPDATE agent_events SET org_id = '00000000-0000-0000-0000-000000000000' WHERE org_id IS NULL;
UPDATE trust_grants SET org_id = '00000000-0000-0000-0000-000000000000' WHERE org_id IS NULL;
