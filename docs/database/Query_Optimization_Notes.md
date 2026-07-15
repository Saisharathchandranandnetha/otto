# Query Optimization Notes

These notes outline considerations and techniques for interacting efficiently with the Otto Postgres database.

## 1. Append-Only Event Trailing
The `agent_events` table acts as a ledger of AI actions and is strictly append-only.
- The `id` column is a `bigint generated always as identity`.
- **Optimization**: Server-Sent Events (SSE) should query using `WHERE id > $last_seen_id`. Thanks to the `idx_agent_events_id` b-tree index, this is extremely fast and avoids table scans.

## 2. Idempotent State Transitions
The actions table lifecycle relies on explicit `status` changes.
- **Optimization**: Use `UPDATE actions SET status = $new WHERE id = $id AND status = $expected`. This relies on Postgres row-level locks and `WHERE` clauses to guarantee atomicity and idempotency without requiring complex application-level lock coordination.

## 3. JSONB Handling
Extensive use of `JSONB` is made for payloads, confidence scores, and historical data (e.g. `price_history`, `line_items`).
- **Optimization**: For deep querying inside `JSONB` structures in hot paths, consider adding GIN indexes on specific JSON paths if those keys are frequently filtered on. However, currently, the schema keeps indexes focused on relational data and state tracking to avoid write bloat.

## 4. Partial Indexes
- **Optimization**: The `idx_products_reorder` index (`WHERE reorder_point IS NOT NULL`) ensures that cron jobs or polling mechanisms looking for low stock do not need to scan products that don't have autonomous reordering enabled, reducing heap reads significantly.

## 5. Embeddings (Vector Search)
For the `knowledge_documents.embedding` column added in the Education module:
- **Optimization**: Standard `pgvector` operators (like `<->` for L2 distance, or `<#>` for inner product) perform exact nearest neighbor search, which requires sequential scans. If the number of knowledge documents grows large, you must add an `HNSW` or `ivfflat` index on the embedding column to maintain low latency for AI queries.
