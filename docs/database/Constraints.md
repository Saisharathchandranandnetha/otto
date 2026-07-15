# Database Constraints

The Otto schema relies heavily on constraints to enforce data integrity and domain rules at the database level.

## 1. Check Constraints (Enums)
Instead of custom enum types, the schema uses `CHECK` constraints on `TEXT` columns:
- `documents.kind`: IN ('invoice','ledger_page','receipt','whatsapp_export')
- `documents.status`: IN ('pending','extracting','extracted','review','confirmed','failed')
- `invoices.status`: IN ('recorded','due','paid')
- `ledger_entries.entity_type`: IN ('supplier','customer')
- `ledger_entries.direction`: IN ('debit','credit')
- `ledger_entries.amount`: Must be `>= 0`
- `actions.status`: IN ('perceived','planned','drafted','awaiting_approval','approved','rejected','executing','executed','undone','failed')
- `actions.approved_by`: IN ('human','autonomy_grant')
- `trust_grants.autonomy_level`: IN ('gated','autonomous')
- `knowledge_documents.category`: IN ('fees','admissions','schedule','policy')
- `knowledge_documents.audience`: IN ('student','parent','staff')

**Dynamic Action Types:**
The `actions.type` constraint has evolved across migrations to support multiple domains:
IN ('invoice_commit', 'reorder', 'payment_reminder', 'graduation_offer', 'resurrection_commit', 'admission_processing', 'attendance_report', 'workflow_approval', 'document_generation', 'support_response', 'knowledge_answer', 'personalization_plan')

## 2. Unique Constraints
- `documents.file_hash`: Ensures identical files are not re-processed.
- `products.sku`: Enforces unique Stock Keeping Units.
- `trust_grants.action_type`: Only one trust policy per action type.

## 3. Default Values
- Identity generation uses `gen_random_uuid()` for primary keys, except `agent_events.id` which is `bigint generated always as identity` for sequence ordering.
- JSONB columns (`products.price_history`, `invoices.line_items`, `agent_events.detail`, `conversations.messages`, `actions.payload`) default to `'[]'` or `'{}'`.
- Status defaults often start at a pending state (e.g., `documents.status = 'pending'`, `actions.status = 'perceived'`).
