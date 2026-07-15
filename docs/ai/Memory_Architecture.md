# Memory Architecture

## Relational Memory
Otto leverages PostgreSQL as its primary memory store, intentionally avoiding in-memory state or complex external memory stores for its core workflow logic.

### Core Tables:
1. **`actions`**: Represents the episodic memory of tasks the agent is performing or has performed. It stores the payload, reasoning, and status.
2. **`agent_events`**: An append-only audit log of state transitions. This acts as the agent's short-term and long-term trace memory, accessible for UI rendering and debugging.
3. **`trust_grants`**: Stores semantic memory regarding the agent's autonomy levels. It tracks how many times a user has approved a specific action type, the autonomy level (`gated` vs `autonomous`), and financial caps.

## Entity Resolution
When processing raw data (like batch invoices or ledgers), Otto extracts entities (suppliers, customers) and runs an `EntityResolutionResult` step. This step merges aliases into canonical names, allowing the system to build a unified memory of business entities over time.
