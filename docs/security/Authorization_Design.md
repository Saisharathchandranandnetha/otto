# Authorization Design

## 1. Multi-Tenant Architecture
Otto is a multi-tenant application. Every resource (products, suppliers, customers, invoices, actions, trust_grants) belongs to a specific tenant.

## 2. Tenant Isolation
- **Query Scoping:** Because Otto uses `postgres.js` (no ORM), **every** query MUST include a `WHERE tenant_id = $1` clause. 
- **Row-Level Security (RLS):** If migrated fully to Supabase, Postgres RLS policies should be enforced to guarantee at the database level that users can only query rows where `tenant_id` matches their verified session token.

## 3. Role-Based Access Control (RBAC)
- **Owners vs. Employees:** 
  - Only Owners can configure "Trust Grants" (the Autonomy Ladder) or revoke Otto's autonomous execution.
  - Employees can stage actions and provide basic approvals (e.g., confirming draft output), but cannot elevate the AI's autonomy.

## 4. Autonomous Agent Authorization
- **Capped Execution:** Otto's autonomous actions are strictly capped and scoped by the `trust_grants` table. 
- **Time-bound Reversibility:** Auto-executed actions have a 1-hour reversal window.
