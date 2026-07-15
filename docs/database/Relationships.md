# Database Relationships

This document outlines the key relationships between entities in the Otto schema.

## 1. Provenance Tracking (Foreign Keys to `documents`)
To ensure that "every agent decision is inspectable", multiple entities contain a `source_doc_id` or `doc_id` that points to the `documents(id)` table.
- `suppliers.source_doc_id`
- `customers.source_doc_id`
- `products.source_doc_id`
- `invoices.doc_id`
- `ledger_entries.source_doc_id`

## 2. Business Entity Relationships
- **Supplier to Products:** One-to-Many (`products.supplier_id` -> `suppliers.id`).
- **Supplier to Invoices:** One-to-Many (`invoices.supplier_id` -> `suppliers.id`).

## 3. Agent and Trust Systems
- **Actions to Agent Events:** One-to-Many (`agent_events.action_id` -> `actions.id`). Used to record the transition state of an action.
- **Trust Grants to Actions:** One-to-Many (`actions.trust_grant_id` -> `trust_grants.id`). Used to determine if an action can be executed autonomously based on historical approvals.
- **Actions to Ledger Entries:** One-to-Many (`ledger_entries.action_id` -> `actions.id`). Links an automated financial action to its resulting ledger entry.

## 4. Polymorphic Associations
- **Ledger Entries:** Uses a combination of `entity_type` (TEXT) and `entity_id` (UUID) to point to either the `suppliers` or `customers` table.
