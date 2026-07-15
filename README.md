<div align="center">
  <img src="logo.png" alt="Otto Logo" width="180" />

  # Otto — The Autonomous AI Operator for Small Businesses

  *Software that installs itself in 3 minutes, then earns your trust like a real employee.*

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![Postgres 16](https://img.shields.io/badge/Postgres-16+pgvector-blue)](https://www.postgresql.org/)
  [![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter-purple)](https://openrouter.ai/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
  [![Zod](https://img.shields.io/badge/Schema-Zod-orange)](https://zod.dev/)

  **Theme 2: AI Automation & Intelligent Agents** · **Theme 7: Analytics & Decision Intelligence**
  
  Built for the **TakeOver'26 Hackathon** by a 3-person team (FE + BE + AI).
</div>

---

## Table of Contents

- [The Problem We Solve](#-the-problem-we-solve)
- [How Otto Works](#-how-otto-works)
- [Application Walkthrough](#%EF%B8%8F-application-walkthrough)
- [System Architecture](#-deep-system-architecture)
- [The Agent Core](#-the-agent-core-the-brain-of-otto)
- [The Extraction Engine](#-the-extraction-engine)
- [The Domain Engine](#-the-domain-engine-theme-2)
- [Database Design](#%EF%B8%8F-database-design)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Demo & Evaluation](#-demo--evaluation)
- [Enterprise Documentation Suite](#-enterprise-documentation-suite)
- [Contributing & License](#-contributing--license)

---

## 🎯 The Problem We Solve

Small businesses in India — fashion boutiques, kirana shops, clinics — run on paper. Invoices are handwritten. Ledgers are in diaries. Supplier orders happen over WhatsApp. This means:

- **No visibility into stock levels** until something runs out and a customer walks away.
- **No way to track who owes money** without manually flipping through pages.
- **No automation** — every reorder, every follow-up, every document is manual.

Existing solutions (Tally, ERPNext, Zoho) require weeks of data entry to get started. By then, the business owner has given up.

**Otto solves this by turning the problem upside down.** Instead of asking the owner to type data into software, Otto reads the owner's existing paper trail — photos of invoices, handwritten ledger pages, WhatsApp chat exports — and builds the entire digital business in 3 minutes, with zero typing. Then it starts working: reordering stock, reminding customers about dues, generating purchase orders, and sending them via WhatsApp. And it does all of this *safely*, through a trust model that lets the owner stay in control.

---

## 🧠 How Otto Works

Otto has two foundational innovations that set it apart from every other AI product in this space:

### 1. The Resurrection — Zero-Typing Digital Onboarding

The owner uploads a "shoebox" of 15–20 photos: handwritten invoices, supplier bills, ledger pages, and a WhatsApp chat export. Otto then:

1. **Batch Vision Extraction** — Each document is sent to a vision LLM (GPT-4o via OpenRouter) with a strict Zod JSON Schema. The model *physically cannot* return fields outside the schema. Every extracted field carries a self-scored confidence value (0–1). Fields below 0.75 confidence are flagged for human review.

2. **Entity Resolution** — Names like "Sharma Fab.", "Sharma Fabrics", and "Sharma Textiles" are recognized as the same supplier. Otto runs a dedicated entity-resolution LLM pass across all extracted names, merging duplicates with evidence-backed reasoning.

3. **Inference Pass** — Pure TypeScript (no LLM) computes reorder points (based on purchase frequency and a 14-day coverage target), stock estimates, customer dues, and price history from the extracted data.

4. **Narrated Build** — Every step is streamed to the UI via Server-Sent Events (SSE). The owner watches Otto think in real time: *"📄 Sharma Fabrics invoice — 5 items, ₹12,400"*, *"🔗 'Sharma Fab.' = 'Sharma Fabrics'"*, *"📉 3 items below safe stock — flagged"*.

5. **One-Tap Confirmation** — Nothing touches the database until the owner taps "This is my business ✅". The entire reconstructed business (products, suppliers, customers, ledger entries) is staged in the action payload. Only then does the `resurrection_commit` executor atomically insert everything inside a single Postgres transaction.

```mermaid
sequenceDiagram
    participant Owner as 👤 Business Owner
    participant UI as 🖥️ Otto UI (Next.js)
    participant Extractor as 🔬 Vision Extractor
    participant LLM as 🤖 OpenRouter (GPT-4o)
    participant ER as 🔗 Entity Resolver
    participant Inference as 📊 Inference Engine (TypeScript)
    participant DB as 🗄️ Postgres 16

    Owner->>UI: Uploads 15-20 photos (invoices, ledgers, WhatsApp export)
    UI->>Extractor: Stream documents one by one

    loop For each document
        Extractor->>LLM: Image + Zod JSON Schema (strict mode)
        LLM-->>Extractor: Structured JSON with per-field confidence
        Note right of Extractor: SHA-256 cache hit? Skip LLM call entirely.
        Extractor-->>UI: SSE narration: "📄 Sharma Fabrics invoice — 5 items, ₹12,400"
    end

    Extractor->>ER: All extracted entity names
    ER->>LLM: Entity resolution prompt
    LLM-->>ER: Canonical names + merge evidence
    ER-->>UI: SSE narration: "🔗 'Sharma Fab.' = 'Sharma Fabrics'"

    ER->>Inference: Resolved entities + extracted data
    Note right of Inference: Pure TypeScript — no LLM. Computes reorder points, stock estimates, dues.
    Inference-->>UI: SSE narration: "📉 3 items below safe stock"

    Inference->>DB: Stage everything on action payload (NOT committed yet)
    UI-->>Owner: "Review your business. Tap to confirm."
    Owner->>UI: "This is my business ✅"
    UI->>DB: Atomic INSERT (products, suppliers, customers, ledger) in one transaction
```

### 2. The Autonomy Ladder — Earned Trust

No business owner trusts an AI to spend money on day one. Otto's trust model works like promoting a real employee:

1. **Human-Gated (Default)** — Every action Otto wants to take (reordering stock, sending a reminder) appears as a card in the approval feed. The owner reviews the reasoning, the evidence, and the cost-of-delay analysis, then taps Approve or Reject.

2. **Graduation** — After 3 human approvals of the same action type (e.g., "reorder"), Otto surfaces a 🎓 Graduation Card: *"You've approved 3 reorders like this one. Otto is ready to handle them itself — capped at ₹10,000, logged, reversible for 1 hour, revocable anytime."* This card is itself an action that goes through the approval gate.

3. **Autonomous Execution** — Once graduated, Otto auto-approves and executes matching actions under the cap. Every autonomous action has a 1-hour undo window. The owner can revoke autonomy for any action type with a single toggle — the next action goes back to human-gated.

```mermaid
stateDiagram-v2
    [*] --> HumanGated

    state HumanGated {
        [*] --> Staged
        Staged --> AwaitApproval: Action card appears in feed
        AwaitApproval --> Approved: Owner taps "Approve"
        AwaitApproval --> Rejected: Owner taps "Reject"
        Approved --> Executed: Side-effects run (PO, WhatsApp, stock update)
        Executed --> TrustIncrement: approvals_count += 1
    }

    TrustIncrement --> GraduationCheck: Is approvals_count >= 3?
    GraduationCheck --> HumanGated: No
    GraduationCheck --> GraduationOffer: Yes — 🎓 card appears
    GraduationOffer --> Autonomous: Owner taps "Earn it, Otto"
    GraduationOffer --> HumanGated: Owner declines

    state Autonomous {
        [*] --> AutoDraft
        AutoDraft --> AutoApprove: trust_grant covers amount
        AutoApprove --> AutoExecute: Side-effects run silently
        AutoExecute --> Logged: Full audit trail in agent_events
    }

    Autonomous --> Undone: Owner taps "Undo" (within 1 hour)
    Autonomous --> HumanGated: Owner taps "Revoke" (one toggle)
```

---

## 🖼️ Application Walkthrough

### The Main Dashboard — The Autonomous Workflow Console
<div align="center">
  <img src="screenshot1.png" alt="Otto Dashboard — Approval Feed with Trust Meter" width="800" />
</div>

The home screen is the **Autonomous Workflow Agents console**. Every action Otto takes — whether staged for approval or executed autonomously — appears here as a card. Each card shows:
- **The reasoning** — why Otto is recommending this action
- **The evidence** — which documents or data points support it
- **The cost of delay** — what happens if the owner does nothing (Theme 7)
- **The trust status** — whether this was human-approved or auto-executed under a grant

The dark theme with amber accent ensures that pending approvals (the actions that need the owner's attention) visually stand out from executed actions.

### Workflow Execution & PO Generation
<div align="center">
  <img src="screenshot2.png" alt="Otto Workflow — Purchase Order and WhatsApp" width="800" />
</div>

When a reorder action is approved (by human or autonomy grant), Otto's executor:
1. Generates a dynamic HTML purchase order with a unique PO number (`PO-2026-0003`)
2. Sends the order to the supplier via **Twilio WhatsApp** (or simulated in-app fallback)
3. Updates stock levels and appends to the audit trail

The PO is viewable at `/api/po/:poNumber` and is stored on disk for records.

### Domain Engine — Multi-Industry Playbooks
<div align="center">
  <img src="screenshot3.png" alt="Otto Domain Engine — 8 Industry Playbooks" width="800" />
</div>

Otto's Theme 2 Domain Engine extends the same approval-and-trust core to **8 target industries**. Each industry has a hardcoded MVP playbook that stages a realistic, domain-specific action card. For example:
- **Education**: Generate admission decision packs from form OCR + fee policy + seat capacity
- **Healthcare**: Triage follow-up queues by classifying non-clinical administrative tasks
- **Legal**: Draft contract risk memos by comparing vendor MSA clauses against a playbook
- **Manufacturing**: Open preventive maintenance orders when vibration thresholds are exceeded

Each playbook includes workflow steps, approval chains, draft output, evidence sources, cost-of-delay analysis, and Otto Engine metadata — all flowing through the same earned-autonomy safety model.

---

## 🏗 Deep System Architecture

```mermaid
graph TD
    subgraph "Client Layer"
        UI["Next.js 14 App Router<br/>Dark theme · Amber accent · JetBrains Mono"]
        Pages["Pages: Feed · Resurrection · Inventory · Ledger · Settings"]
    end

    subgraph "API Layer"
        Feed["/api/feed — Action cards + pagination"]
        Ingest["/api/ingest — Document upload + extraction trigger"]
        Approve["/api/approve — Human approval endpoint"]
        Events["/api/events — SSE stream (live narration)"]
        Trust["/api/trust — Grant listing + revoke toggle"]
        Agent["/api/agent — Domain engine trigger"]
        PO["/api/po/:id — PO PDF viewer"]
    end

    subgraph "Agent Core (~200 lines)"
        Machine["machine.ts — State machine + transitions"]
        Gate["gate.ts — Approval routing (human vs. autonomy)"]
        TrustEngine["trust.ts — Graduation logic + cap enforcement"]
        Triggers["triggers.ts — Event-driven reorder detection"]
        Executors["executors.ts — Side-effect dispatch"]
        Resurrection["resurrection.ts — Flow 0 pipeline"]
        DomainEng["domain-engine.ts — Theme 2 playbook runner"]
        Inference["inference.ts — Stock/dues computation (pure TS)"]
    end

    subgraph "Extraction Engine"
        Extractor["extractor.ts — Single LLM entry point"]
        Schemas["schemas.ts — Zod schema lock"]
        Cache["cache.ts — SHA-256 input-hash cache"]
        Mock["mock.ts — Fixture fallback (keyless dev)"]
        Prompts["prompts.ts — Instruction/data separation"]
    end

    subgraph "Integrations"
        Twilio["whatsapp.ts — Twilio API + simulated fallback"]
        POPDF["po-pdf.tsx — Dynamic HTML PO generation"]
        OttoEng["otto-engine.ts — External workflow API connector"]
    end

    subgraph "Data Layer"
        DB[("PostgreSQL 16 + pgvector<br/>9 tables · postgres.js (no ORM)")]
    end

    UI --> Pages
    Pages --> Feed & Ingest & Approve & Events & Trust & Agent & PO
    Feed --> Machine
    Ingest --> Resurrection
    Approve --> Gate
    Events --> Machine
    Trust --> TrustEngine
    Agent --> DomainEng

    Machine --> DB
    Gate --> TrustEngine
    Gate --> Machine
    Triggers --> Machine & Gate & Executors
    Executors --> Twilio & POPDF & DB
    Resurrection --> Extractor & Inference & Machine
    DomainEng --> Machine & Gate & Executors & OttoEng

    Extractor --> Schemas & Cache & Mock & Prompts
```

### Key Engineering Properties

| Property | How It Works | Why It Matters |
|---|---|---|
| **Idempotent Approvals** | `UPDATE actions SET status = $to WHERE id = $id AND status = $from` inside a transaction. If 0 rows match, someone else already advanced the state → clean no-op. | Double-taps, SSE replays, and re-fired webhooks can never double-execute a financial action. |
| **Schema-Locked Extraction** | The Zod schema is sent to OpenRouter as a `json_schema` response format with `strict: true`. The model physically cannot return fields outside it. | Prompt injection defense: injected text inside a scanned document has no field to land in. Every field is typed and validated at runtime. |
| **Deterministic Demo** | Every LLM call is cached by the SHA-256 hash of its input. `pnpm cache:warm` pre-runs the demo inputs. | Demo survives dead WiFi. Stage presentation is instant. `pnpm eval` measures real accuracy, not invented metrics. |
| **Durable State Machine** | State lives in Postgres rows, not in-memory. Transitions are atomic DB operations. | The agent loop survives server restarts. No lost actions, no orphaned workflows. |
| **Per-Field Confidence** | Every extracted leaf field carries a `{ value, confidence }` pair. Fields below 0.75 are highlighted for review. | The owner sees exactly which numbers Otto is uncertain about. No silent commits of bad data. |
| **1-Hour Undo Window** | Autonomously executed actions set `undo_deadline = now() + 1h`. The owner can reverse within that window. | Safety net for autonomous execution. Compensating actions (WhatsApp cancellation to supplier) run automatically on undo. |

---

## ⚙️ The Agent Core — The Brain of Otto

The agent core is a hand-rolled, ~200-line state machine. No LangChain. No LangGraph. No Temporal. The entire agent is 8 TypeScript files that judges can read end-to-end:

### [`machine.ts`](src/agent/machine.ts) — The State Machine

Defines the action lifecycle and the only legal state transitions:

```
perceived → planned → drafted → awaiting_approval → approved → executing → executed → undone
                                     ↘ approved (via autonomy grant, skipping human)
```

Every transition is a single SQL `UPDATE ... WHERE status = $from` inside a transaction that also appends an `agent_events` row. This is the concurrency lock: if two callers race, one matches 0 rows and exits cleanly.

### [`gate.ts`](src/agent/gate.ts) — The Approval Gate

The safety property of the entire system. A drafted action reaches `approved` in exactly two ways:
1. A human tap (`POST /api/approve`), or
2. An active, non-revoked trust grant for this action type whose `amount_cap` covers the action amount.

There is no third path. Side-effects only run from `approved`.

### [`trust.ts`](src/agent/trust.ts) — The Trust Engine

Implements the graduation logic:
- `GRADUATION_THRESHOLD = 3` — number of human approvals before Otto offers autonomy
- `DEFAULT_CAP_INR = 10,000` — maximum amount Otto can auto-approve
- Tracks approvals per action type in `trust_grants` table
- Surfaces graduation cards as actions (they go through the same approval gate)
- One-toggle revoke: `revoke()` sets `autonomy_level = 'gated'`, `offered_at = null`

### [`triggers.ts`](src/agent/triggers.ts) — Event-Driven Perception

Otto "notices" things. After any stock mutation (invoice commit, manual adjustment), the trigger engine scans for products at or below their reorder point with no open reorder action. For each, it:
1. Creates a reorder action with full reasoning and consequence analysis
2. Routes it through the approval gate (human or autonomy)
3. If auto-approved, executes immediately

### [`executors.ts`](src/agent/executors.ts) — Side-Effect Dispatch

The only code that touches stock, money, or the outside world. Executors handle:
- **Invoice Commit** — Stock mutations (purchase → stock IN, sale → stock OUT), ledger entries, counterparty creation
- **Reorder** — PO PDF generation, WhatsApp message to supplier, payload update with PO number
- **Graduation** — Promotes the trust grant to autonomous
- **Resurrection Commit** — Atomic insert of the entire staged business
- **Domain Actions** — Theme 2 playbook execution with connector-ready packets

### [`resurrection.ts`](src/agent/resurrection.ts) — The Resurrection Pipeline

The most complex module (214 lines). Orchestrates the entire zero-typing onboarding:
1. Batch extraction with per-document error handling (failures are logged, never fatal)
2. Entity resolution across all extracted names
3. Deterministic inference pass for stock levels and dues
4. Theme 7 intelligence insights (stock alerts, receivables, spend analysis)
5. Staged business payload on the action (nothing live until confirmation)

---

## 🔬 The Extraction Engine

### [`extractor.ts`](src/extract/extractor.ts) — Single LLM Entry Point

Every LLM call in Otto goes through one function: `extract()`. It provides:
- **Model Fallback** — Primary model (GPT-4o) with automatic fallback to Gemini 2.0 Flash
- **SHA-256 Caching** — Input hash → filesystem cache. Cache hits skip the LLM entirely.
- **Mock Mode** — `EXTRACTOR_MODE=mock` uses fixture data. Zero API keys needed for development.
- **Zod Validation** — Every LLM response is parsed through the Zod schema at runtime. Invalid responses throw.

### [`schemas.ts`](src/extract/schemas.ts) — The Schema Lock

The single source of truth for every LLM boundary. Defines:
- `InvoiceExtraction` — direction (purchase/sale), counterparty, line items with per-field confidence
- `LedgerPageExtraction` — party names, debits, credits, dates
- `WhatsAppExtraction` — contacts with role guesses and business signals (orders, payment promises)
- `EntityResolutionResult` — canonical names, merged aliases, confidence, evidence

Every leaf field uses the `cf()` helper: `{ value: T, confidence: number }`. The `fieldConfidences()` function recursively extracts all confidence scores for review highlighting. `needsReview()` returns true if any field is below the 0.75 threshold.

---

## 🌐 The Domain Engine (Theme 2)

The [`domain-engine.ts`](src/agent/domain-engine.ts) and [`theme2.ts`](src/lib/theme2.ts) modules extend Otto's approval-and-trust core to 8 industries via hardcoded MVP playbooks:

| Industry | Action Type | Example Playbook | Key Signals |
|---|---|---|---|
| **Education** | `document_generation` | Generate admission decision packs | 42 parent queries, 11 incomplete applications |
| **Healthcare** | `workflow_approval` | Triage follow-up queue | 27 missed follow-ups, doctor calendar |
| **HR** | `workflow_approval` | Run new-hire onboarding | 3 offer acceptances, laptop inventory |
| **Legal** | `document_generation` | Draft contract risk memo | Vendor MSA, clause library, redline history |
| **Manufacturing** | `workflow_approval` | Open preventive maintenance order | Machine vibration log, spare-parts stock |
| **Sales** | `personalization_plan` | Personalize stalled-deal follow-ups | CRM stages, call notes, buyer objections |
| **Customer Support** | `support_response` | Resolve delayed-order tickets | 18 open tickets, order status, refund policy |
| **Retail** | `personalization_plan` | Launch replenishment + loyalty campaign | Low stock, WhatsApp buyers, purchase history |

Each playbook defines: workflow steps, approval chains, draft output (format + recipient + body), impact analysis (primary, secondary, cost-of-delay), evidence sources, and Otto Engine connector metadata.

The Domain Engine optionally connects to an external Otto Workflow Orchestration API (`OTTO_ENGINE_URL`). Without it, the deterministic local playbook fallback runs — same safety model, same approval gate.

---

## 🗄️ Database Design

9 tables in PostgreSQL 16 with pgvector:

```mermaid
erDiagram
    suppliers ||--o{ products : "supplies"
    suppliers ||--o{ invoices : "bills"
    products ||--o{ actions : "triggers reorders"
    customers ||--o{ ledger_entries : "owes/pays"
    suppliers ||--o{ ledger_entries : "we owe"
    actions ||--o{ agent_events : "audit trail"
    actions ||--o{ trust_grants : "autonomy linked"
    documents ||--o{ actions : "source evidence"

    suppliers {
        uuid id PK
        text name
        text phone
        text[] aliases
    }
    customers {
        uuid id PK
        text name
        text phone
        numeric dues_amount
    }
    products {
        uuid id PK
        text name
        text sku
        numeric unit_price
        int stock_qty
        int reorder_point
        int reorder_qty
        uuid supplier_id FK
    }
    invoices {
        uuid id PK
        uuid supplier_id FK
        text invoice_no
        date invoice_date
        date due_date
        numeric total
        text status
    }
    ledger_entries {
        uuid id PK
        text entity_type
        uuid entity_id
        text direction
        numeric amount
    }
    actions {
        uuid id PK
        text type
        text status
        text approved_by
        uuid trust_grant_id FK
        timestamp undo_deadline
        jsonb payload
        text reasoning
        numeric amount
    }
    agent_events {
        uuid id PK
        uuid action_id FK
        text from_state
        text to_state
        jsonb detail
    }
    trust_grants {
        uuid id PK
        text action_type UK
        int approvals_count
        text autonomy_level
        numeric amount_cap
    }
    documents {
        uuid id PK
        text kind
        text file_name
        text storage_path
        text status
        jsonb extraction
        jsonb field_confidence
    }
```

---

## 🔧 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router, TypeScript strict) | Full-stack in one process. API routes and SSR pages. |
| **Database** | PostgreSQL 16 via `postgres.js` (no ORM) | Same SQL runs on Docker and Supabase. `pgvector` for future embedding search. |
| **LLM** | OpenRouter (GPT-4o primary, Gemini 2.0 Flash fallback) | Multi-model failover behind one API. |
| **Schema Validation** | Zod + `zod-to-json-schema` | Runtime type safety at every LLM boundary. |
| **Job Queue** | pg-boss | PostgreSQL-backed job queue for background tasks. |
| **WhatsApp** | Twilio API + simulated in-app fallback | Real supplier communication. Simulated mode for keyless dev. |
| **Styling** | Tailwind CSS, dark theme, amber accent, JetBrains Mono | Professional, readable, high-contrast UI. |
| **State Management** | Server-Sent Events (SSE) via in-process event bus | Real-time narration without WebSocket complexity. |

---

## 🗺️ Project Structure

```text
otto/
├── db/
│   ├── migrations/001_init.sql       # Full schema (9 tables, indexes, constraints)
│   └── seed.ts                       # "Priya's Fashion, Jaipur" — 30 products, 2 suppliers,
│                                     #   8 customers (Rahul owes ₹8,000), 3 pending invoices,
│                                     #   trust history primed with 2 approved reorders
├── docs/                             # 120+ enterprise documentation files (see below)
├── fixtures/
│   ├── shoebox/                      # 27 files with .expected.json ground truth
│   └── demo/                         # Sale invoice, poisoned invoice, blurry invoice
├── scripts/
│   ├── migrate.ts                    # Run SQL migrations
│   ├── demo-reset.ts                 # Wipe to blank + 2 pre-seeded approvals
│   ├── cache-warm.ts                 # Pre-run LLM calls against demo fixtures
│   ├── eval.ts                       # Measure extraction field accuracy
│   ├── health.ts                     # DB, OpenRouter, cache, Node version check
│   └── run-flow.ts                   # End-to-end flow verification (0, A, B, all)
├── src/
│   ├── agent/                        # THE CORE (~200 lines total)
│   │   ├── machine.ts                # State machine: transitions, create, draft
│   │   ├── gate.ts                   # Approval gate: human vs. autonomy routing
│   │   ├── trust.ts                  # Trust engine: graduation, revoke, caps
│   │   ├── triggers.ts               # Event-driven reorder detection
│   │   ├── executors.ts              # Side-effect dispatch (PO, WhatsApp, stock)
│   │   ├── resurrection.ts           # Flow 0: batch extract → entity resolve → infer → stage
│   │   ├── inference.ts              # Pure TS: reorder points, stock estimates, dues
│   │   └── domain-engine.ts          # Theme 2: multi-industry playbook runner
│   ├── extract/
│   │   ├── extractor.ts              # Single LLM entry point (cache, fallback, mock)
│   │   ├── schemas.ts                # Zod schema lock (Invoice, Ledger, WhatsApp, Entity)
│   │   ├── cache.ts                  # SHA-256 input-hash filesystem cache
│   │   ├── mock.ts                   # Fixture responses for keyless development
│   │   └── prompts.ts                # Instruction/data separation prompts
│   ├── components/                   # React: ApprovalCard, TrustMeter, ResurrectionProgress
│   ├── integrations/
│   │   ├── whatsapp.ts               # Twilio API + simulated fallback
│   │   ├── po-pdf.tsx                # Dynamic HTML purchase order generator
│   │   └── otto-engine.ts            # External workflow API connector
│   ├── lib/
│   │   ├── db.ts                     # postgres.js client
│   │   ├── sse.ts                    # Server-Sent Events bus
│   │   ├── env.ts                    # Runtime env validation
│   │   ├── theme2.ts                 # 8 industry playbooks (369 lines of domain config)
│   │   ├── i18n.ts                   # Multi-language support
│   │   └── auth.tsx                  # Auth context
│   └── app/
│       ├── page.tsx                  # Home: Approval Feed + Domain Console
│       ├── resurrection/             # Upload flow
│       ├── inventory/                # Stock view
│       ├── ledger/                   # Financial view
│       ├── settings/                 # Trust grants + revoke toggles
│       └── api/                      # All API routes
├── docker-compose.yml                # pgvector/pgvector:pg16
├── package.json                      # pnpm, Next.js 14, postgres.js, Zod, Twilio
└── tailwind.config.ts                # Dark theme, amber accent, JetBrains Mono
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** ≥ 18.17.0
- **Docker** (for local Postgres) or a **Supabase** project
- **pnpm** package manager

### Quick Start

```bash
# 1. Clone and install
git clone https://github.com/Saisharathchandranandnetha/otto.git
cd otto
pnpm approve-builds esbuild   # first time only
pnpm install

# 2. Start database, migrate, and seed
pnpm db:up                    # Starts pgvector:pg16 in Docker
pnpm db:migrate               # Runs db/migrations/001_init.sql
pnpm db:seed                  # Seeds "Priya's Fashion, Jaipur"

# 3. Start development server
pnpm dev                      # http://localhost:3000
```

### Without Docker
Set `DATABASE_URL` in `.env` to a Supabase project URL, then run the migration SQL manually in the Supabase SQL editor.

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | No | `postgres://otto:otto@localhost:5432/otto` | Postgres connection string |
| `EXTRACTOR_MODE` | No | `mock` | `mock` for fixture data, `live` for real LLM calls |
| `OPENROUTER_API_KEY` | Only if `live` | — | OpenRouter API key for vision extraction |
| `EXTRACTOR_MODEL` | No | `openai/gpt-4o` | Primary extraction model |
| `EXTRACTOR_FALLBACK_MODEL` | No | `google/gemini-2.0-flash-001` | Fallback model |
| `WHATSAPP_MODE` | No | `simulated` | `simulated` for in-app, `sandbox` for real Twilio |
| `TWILIO_ACCOUNT_SID` | Only if `sandbox` | — | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Only if `sandbox` | — | Twilio auth token |
| `TWILIO_WHATSAPP_FROM` | Only if `sandbox` | — | Twilio WhatsApp sender number |
| `OTTO_ENGINE_URL` | No | — | External workflow orchestration API |
| `OTTO_ENGINE_KEY` | No | — | API key for Otto Engine |
| `LLM_CACHE_DIR` | No | `./data/cache` | Directory for SHA-256 LLM response cache |

---

## 🧪 Demo & Evaluation

```bash
pnpm demo:reset     # Wipes to blank state + 2 pre-seeded reorder approvals
pnpm cache:warm     # Pre-warm LLM cache against demo fixtures (needs OpenRouter key)
pnpm eval           # Measure extraction field accuracy against all fixtures
pnpm flow 0         # Verify Flow 0 end-to-end (Resurrection)
pnpm flow A         # Verify Flow A end-to-end (Invoice Commit + Reorder Trigger)
pnpm flow B         # Verify Flow B (Graduation + Auto-Execute + Undo + Revoke)
pnpm flow all       # Run all three flows
pnpm health         # Health check: DB, OpenRouter, cache, Node version
```

---

## 📚 Enterprise Documentation Suite

We have generated a comprehensive enterprise documentation system with **120+ professional Markdown files** across 15 categories, with matching PDFs for every document. This documentation covers the full software development lifecycle — from product vision to incident response runbooks.

<details>
<summary><strong>📦 Product Documentation</strong> (16 documents)</summary>

- [Product Vision](docs/product/Product_Vision.md) · [Product Strategy](docs/product/Product_Strategy.md) · [Problem Statement](docs/product/Problem_Statement.md)
- [Value Proposition](docs/product/Value_Proposition.md) · [Product Goals](docs/product/Product_Goals.md) · [Success Metrics](docs/product/Success_Metrics.md)
- [Business Requirements](docs/product/Business_Requirements.md) · [Product Requirements](docs/product/Product_Requirements.md)
- [Functional Requirements](docs/product/Functional_Requirements.md) · [Non-functional Requirements](docs/product/Non_functional_Requirements.md)
- [Feature Specifications](docs/product/Feature_Specifications.md) · [User Personas](docs/product/User_Personas.md)
- [User Story Map](docs/product/User_Story_Map.md) · [Customer Journey Map](docs/product/Customer_Journey_Map.md)
- [Product Roadmap](docs/product/Product_Roadmap.md) · [Release Planning](docs/product/Release_Planning.md)
</details>

<details>
<summary><strong>💼 Business Documentation</strong> (10 documents)</summary>

- [Market Research](docs/business/Market_Research.md) · [Competitor Analysis](docs/business/Competitor_Analysis.md) · [SWOT Analysis](docs/business/SWOT_Analysis.md)
- [Business Model Canvas](docs/business/Business_Model_Canvas.md) · [Lean Canvas](docs/business/Lean_Canvas.md)
- [Revenue Model](docs/business/Revenue_Model.md) · [Pricing Strategy](docs/business/Pricing_Strategy.md)
- [Risk Analysis](docs/business/Risk_Analysis.md) · [Executive Summary](docs/business/Executive_Summary.md) · [Go-To-Market Strategy](docs/business/Go_To_Market_Strategy.md)
</details>

<details>
<summary><strong>🏛️ Architecture Documentation</strong> (7 documents)</summary>

- [Software Architecture](docs/architecture/Software_Architecture_Document.md) · [High-Level Design](docs/architecture/High_Level_Design.md) · [Low-Level Design](docs/architecture/Low_Level_Design.md)
- [C4 Context Diagram](docs/architecture/C4_Context_Diagram.md) · [C4 Container Diagram](docs/architecture/C4_Container_Diagram.md)
- [C4 Component Diagram](docs/architecture/C4_Component_Diagram.md) · [C4 Code Diagram](docs/architecture/C4_Code_Diagram.md)
</details>

<details>
<summary><strong>🔧 Engineering Documentation</strong> (9 documents)</summary>

- [Technical Design](docs/engineering/Technical_Design.md) · [Folder Structure](docs/engineering/Folder_Structure.md) · [Dependency Analysis](docs/engineering/Dependency_Analysis.md)
- [Coding Standards](docs/engineering/Coding_Standards.md) · [Git Workflow](docs/engineering/Git_Workflow.md) · [Branching Strategy](docs/engineering/Branching_Strategy.md)
- [Environment Variables Guide](docs/engineering/Environment_Variables_Guide.md) · [Build Process](docs/engineering/Build_Process.md) · [Configuration Guide](docs/engineering/Configuration_Guide.md)
</details>

<details>
<summary><strong>🔌 API Documentation</strong> (8 documents)</summary>

- [Complete API Reference](docs/api/Complete_API_Reference.md) · [Authentication Flow](docs/api/Authentication_Flow.md)
- [Request/Response Examples](docs/api/Request_Response_Examples.md) · [Error Codes](docs/api/Error_Codes.md)
- [API Sequence Diagrams](docs/api/API_Sequence_Diagrams.md) · [OpenAPI Specification](docs/api/OpenAPI_Specification.md)
- [Swagger JSON](docs/api/Swagger_JSON.md) · [Postman Collection](docs/api/Postman_Collection.md)
</details>

<details>
<summary><strong>🗄️ Database Documentation</strong> (7 documents)</summary>

- [ER Diagram](docs/database/ER_Diagram.md) · [Schema Documentation](docs/database/Schema_Documentation.md) · [Relationships](docs/database/Relationships.md)
- [Constraints](docs/database/Constraints.md) · [Index Strategy](docs/database/Index_Strategy.md)
- [Migration Documentation](docs/database/Migration_Documentation.md) · [Query Optimization Notes](docs/database/Query_Optimization_Notes.md)
</details>

<details>
<summary><strong>🛡️ Security Documentation</strong> (8 documents)</summary>

- [Threat Model](docs/security/Threat_Model.md) · [Authentication Design](docs/security/Authentication_Design.md) · [Authorization Design](docs/security/Authorization_Design.md)
- [Secrets Management](docs/security/Secrets_Management.md) · [Encryption](docs/security/Encryption.md)
- [Data Privacy](docs/security/Data_Privacy.md) · [OWASP Checklist](docs/security/OWASP_Checklist.md) · [Security Recommendations](docs/security/Security_Recommendations.md)
</details>

<details>
<summary><strong>🧪 Testing Documentation</strong> (9 documents)</summary>

- [Test Strategy](docs/testing/Test_Strategy.md) · [Unit Testing Guide](docs/testing/Unit_Testing_Guide.md) · [Integration Testing Guide](docs/testing/Integration_Testing_Guide.md)
- [API Testing](docs/testing/API_Testing.md) · [UI Testing](docs/testing/UI_Testing.md) · [End-to-End Testing](docs/testing/End_to_End_Testing.md)
- [Performance Testing](docs/testing/Performance_Testing.md) · [Security Testing](docs/testing/Security_Testing.md) · [AI Evaluation Strategy](docs/testing/AI_Evaluation_Strategy.md)
</details>

<details>
<summary><strong>🚀 Deployment Documentation</strong> (8 documents)</summary>

- [Local Setup](docs/deployment/Local_Setup.md) · [Docker Guide](docs/deployment/Docker_Guide.md) · [CI/CD](docs/deployment/CI_CD.md)
- [Infrastructure Overview](docs/deployment/Infrastructure_Overview.md) · [Deployment Workflow](docs/deployment/Deployment_Workflow.md)
- [Production Checklist](docs/deployment/Production_Checklist.md) · [Rollback Strategy](docs/deployment/Rollback_Strategy.md) · [Disaster Recovery](docs/deployment/Disaster_Recovery.md)
</details>

<details>
<summary><strong>📡 Operations Documentation</strong> (7 documents)</summary>

- [Monitoring](docs/operations/Monitoring.md) · [Logging](docs/operations/Logging.md) · [Alerting](docs/operations/Alerting.md)
- [Incident Response](docs/operations/Incident_Response.md) · [Runbook](docs/operations/Runbook.md)
- [Troubleshooting Guide](docs/operations/Troubleshooting_Guide.md) · [Maintenance Guide](docs/operations/Maintenance_Guide.md)
</details>

<details>
<summary><strong>🤖 AI Documentation</strong> (11 documents)</summary>

- [AI System Overview](docs/ai/AI_System_Overview.md) · [Model Architecture](docs/ai/Model_Architecture.md) · [Prompt Engineering Guide](docs/ai/Prompt_Engineering_Guide.md)
- [Agent Workflow](docs/ai/Agent_Workflow.md) · [Tool Calling Flow](docs/ai/Tool_Calling_Flow.md) · [Memory Architecture](docs/ai/Memory_Architecture.md)
- [RAG Pipeline](docs/ai/RAG_Pipeline.md) · [Vector Database Design](docs/ai/Vector_Database_Design.md)
- [AI Safety Guardrails](docs/ai/AI_Safety_Guardrails.md) · [Evaluation Metrics](docs/ai/Evaluation_Metrics.md) · [Hallucination Mitigation Strategy](docs/ai/Hallucination_Mitigation_Strategy.md)
</details>

<details>
<summary><strong>🎨 UX Documentation</strong> (5 documents)</summary>

- [User Flows](docs/ux/User_Flows.md) · [Information Architecture](docs/ux/Information_Architecture.md) · [Screen Flow](docs/ux/Screen_Flow.md)
- [Accessibility Guidelines](docs/ux/Accessibility_Guidelines.md) · [Design Principles](docs/ux/Design_Principles.md)
</details>

<details>
<summary><strong>👩‍💻 Developer Documentation</strong> (5 documents)</summary>

- [Developer Guide](docs/developer/Developer_Guide.md) · [Contribution Guide](docs/developer/Contribution_Guide.md)
- [Architecture Decision Records](docs/developer/Architecture_Decision_Records.md) · [Glossary](docs/developer/Glossary.md) · [FAQ](docs/developer/FAQ.md)
</details>

<details>
<summary><strong>👤 User Documentation</strong> (5 documents)</summary>

- [User Guide](docs/user/User_Guide.md) · [Administrator Guide](docs/user/Administrator_Guide.md) · [Installation Guide](docs/user/Installation_Guide.md)
- [Troubleshooting](docs/user/Troubleshooting.md) · [Frequently Asked Questions](docs/user/Frequently_Asked_Questions.md)
</details>

<details>
<summary><strong>📊 Reports</strong> (5 documents)</summary>

- [Software Engineering Report](docs/reports/Complete_Software_Engineering_Report.md) · [Technical Report](docs/reports/Technical_Report.md)
- [Project Report](docs/reports/Project_Report.md) · [Changelog](docs/reports/Changelog.md) · [Release Notes](docs/reports/Release_Notes.md)
</details>

---

## 🤝 Contributing & License

We welcome contributions! Please review:
- [Contribution Guide](docs/developer/Contribution_Guide.md) — Setup, PR process, commit conventions
- [Coding Standards](docs/engineering/Coding_Standards.md) — TypeScript strict, no ORM, Zod boundaries
- [Branching Strategy](docs/engineering/Branching_Strategy.md) — Git workflow

This project is licensed under the **MIT License**.

---

<div align="center">
  <br>
  <strong>Otto doesn't replace the business owner. Otto replaces the paperwork.</strong>
  <br>
  <sub>Built with conviction for TakeOver'26.</sub>
</div>
