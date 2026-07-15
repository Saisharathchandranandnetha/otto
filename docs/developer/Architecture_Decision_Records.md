# Architecture Decision Records (ADR)

## ADR 1: Use of Zod for Schema-Locked Extraction
**Context:** Need high reliability and security from LLM outputs.
**Decision:** We use Zod schemas passed as JSON Schema to the model.
**Consequences:** Ensures physical constraint on output fields. Excellent defense against prompt injection.

## ADR 2: Idempotent Approvals
**Context:** Real-world operations can suffer from double taps or unreliable networks.
**Decision:** Approvals use `UPDATE actions SET status = $to WHERE id = $id AND status = $from` inside a transaction.
**Consequences:** Makes approvals safe and naturally idempotent.

## ADR 3: SHA-256 Caching for LLM Calls
**Context:** Need a fast, deterministic demo environment that survives offline settings.
**Decision:** All LLM calls are cached by SHA-256 hash of inputs on the filesystem.
**Consequences:** `pnpm cache:warm` makes the demo instant and offline-ready.
