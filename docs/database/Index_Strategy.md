# Index Strategy

Indexes in the Otto schema are designed specifically around hot paths, live feeds, and background processing.

## 1. Agent Event Feeds and SSE
- **`idx_agent_events_id`** on `agent_events(id)`: Crucial for SSE cursors. The UI polls or streams using queries like `WHERE id > $last`. Since `id` is a sequential `bigint`, this provides ordered, fast tailing.
- **`idx_agent_events_action`** on `agent_events(action_id)`: Used for querying the full audit history of a specific action.

## 2. Workflow and Polling Queries
- **`idx_actions_status`** on `actions(status)`: Optimizes state machine transitions, polling for 'pending' or 'awaiting_approval' tasks, and job orchestrators.
- **`idx_actions_created`** on `actions(created_at desc)`: Supports chronological dashboards and action feeds.

## 3. Application Domain specific
- **`idx_products_reorder`** on `products(id) WHERE reorder_point IS NOT NULL`: A partial index that drastically speeds up queries scanning for products that need restocking.
- **`idx_ledger_entity`** on `ledger_entries(entity_type, entity_id)`: Accelerates ledger lookups for specific suppliers or customers since relationships are polymorphic.

## 4. Vector Search (Education Module)
- While a specific index (like HNSW or IVFFlat) isn't explicitly defined in the provided `003_education.sql` schema migration, the `embedding vector(1536)` column on the `knowledge_documents` table implies usage of vector-based similarity search using `<->` operators. An index should ideally be added in production for performance at scale.
