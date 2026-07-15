# Feature Specifications

## 1. Vision Extraction Engine

### 1.1 Overview
The Vision Extraction Engine is the single entry point for all LLM calls in Otto (`extractor.ts`). It translates unstructured physical documents (images) and text into strictly typed JSON.

### 1.2 Component Specifications
- **Model Routing:**
  - **Primary:** OpenRouter (GPT-4o)
  - **Fallback:** Gemini 2.0 Flash (automatically triggered on primary failure).
  - **Mock Mode:** `EXTRACTOR_MODE=mock` returns deterministic fixture data, bypassing the network entirely for keyless CI/CD and offline development.
- **Zod Schema Lock:**
  - The engine uses `zod-to-json-schema` to convert TypeScript Zod definitions (`InvoiceExtraction`, `LedgerPageExtraction`, `WhatsAppExtraction`) into strict JSON schemas.
  - The schema is passed to the LLM via `response_format = { type: 'json_schema', strict: true }`.
  - The response is parsed at runtime via `schema.parse()`. If the LLM hallucinates an invalid field, the transaction is rejected.
- **Per-Field Confidence Scoring:**
  - Every leaf field uses the `cf()` helper: `{ value: T, confidence: number }`.
  - The model is instructed to self-score its certainty for every single extraction.
  - `CONFIDENCE_REVIEW_THRESHOLD = 0.75`. The `needsReview()` function traverses the JSON; if any field falls below the threshold, the UI highlights it in yellow and forces human review, preventing silent commits of bad OCR reads.
- **Deterministic Caching:**
  - Every extraction input (image bytes + text + schema name) is hashed using SHA-256.
  - Responses are cached to the filesystem (`LLM_CACHE_DIR`).
  - Cache hits skip the LLM call entirely, ensuring rapid, offline-safe demo presentations.

## 2. The Agent Core & State Machine

### 2.1 Overview
Otto forgoes bloated orchestration frameworks (LangGraph, Temporal) in favor of a hand-rolled, strictly controlled state machine stored durably in PostgreSQL (`machine.ts`).

### 2.2 State Transitions
An action can only exist in one of 10 states: `perceived`, `planned`, `drafted`, `awaiting_approval`, `approved`, `rejected`, `executing`, `executed`, `undone`, `failed`.

**The Transition Invariant:**
```sql
UPDATE actions SET status = $to WHERE id = $id AND status = $from
```
If 0 rows are updated, it means a concurrent actor (or a double-click) already advanced the state. This single property guarantees idempotent approvals.

### 2.3 The Audit Trail
Every transition atomically inserts a row into `agent_events` within the same transaction. This provides a perfect, event-sourced audit trail of the agent's live trace.

## 3. The Approval Gate

### 3.1 Overview
The Approval Gate (`gate.ts`) is the ultimate safety property of the system. It enforces that no drafted action can execute without authorization.

### 3.2 Routing Logic
A drafted action reaches `approved` in exactly two ways. There is no third path:
1. **Human Gated:** The action transitions to `awaiting_approval` and waits for a `POST /api/approve` request triggered by the owner tapping the UI.
2. **Autonomy Grant:** The gate queries the `trust_grants` table for the action type. If `autonomy_level === 'autonomous'` AND `revoked_at IS NULL` AND `(amount_cap IS NULL OR amount_cap >= action.amount)`, the action automatically transitions to `approved`.

## 4. The Trust Engine

### 4.1 Overview
The Trust Engine (`trust.ts`) manages the lifecycle of earned autonomy.

### 4.2 The Autonomy Ladder
- **Trust Increment:** Every human approval increments `approvals_count` for that action type.
- **Graduation Offer:** When `approvals_count >= 3`, a `graduation_offer` action is drafted and routed to the feed.
- **Acceptance:** If the owner accepts, the grant is promoted to `autonomous` with a `DEFAULT_CAP_INR = 10_000` (configurable by the user).
- **Revocation:** A single function `revoke(actionType)` sets `autonomy_level = 'gated'` and `offered_at = null`, immediately forcing the next action of that type back to human approval.

## 5. Event-Driven Triggers & Executors

### 5.1 Reorder Triggers
- `triggers.ts` runs after any stock mutation.
- It scans the `products` table for items where `stock_qty <= reorder_point`.
- It ensures deduplication by checking for existing open reorder actions.
- **Consequence Analysis:** Calculates the daily sale rate and divides current stock to estimate `days_until_stockout`. Calculates the remaining monthly budget. This data populates the action's reasoning payload.

### 5.2 The Executor Dispatch
- `executors.ts` only runs on `approved` actions.
- Dispatches based on action type (`invoice_commit`, `reorder`, `resurrection_commit`, etc.).
- **Reorder Execution:** Generates an HTML PO via `po-pdf.tsx`, saves it to disk, and triggers the `whatsapp.ts` integration to send a Twilio message to the supplier.
- **Undo Mechanism:** Auto-executed actions set an `undo_deadline` of +1 hour. The `undoAction` executor reverses the DB state and sends a compensating WhatsApp message ("Please ignore purchase order...").

## 6. The Domain Engine (Theme 2)

### 6.1 Overview
Extends the core state machine to 8 diverse industries (`theme2.ts`).

### 6.2 Specifications
- Defines 8 MVP playbooks with specific `ActionType`s (e.g., `document_generation`, `workflow_approval`, `personalization_plan`).
- Each playbook includes static metadata: problem statement, confidence score, impact analysis (primary, secondary, cost of delay), and a predefined workflow array.
- The `domain-engine.ts` runner drafts actions based on these playbooks. The output is a "connector-ready" payload staged for execution, proving the architecture scales beyond retail inventory.
