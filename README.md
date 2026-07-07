# Otto — the AI operator for small businesses

> *"Software that installs itself in 3 minutes, then earns your trust like a real employee."*

**Theme 2: AI Automation & Intelligent Agents** · PS: "Autonomous Workflow Agents"  
**+ Theme 7: Analytics & Decision Intelligence** — every card shows the cost of inaction  
**Built for TakeOver'26 Hackathon** by a 3-person team (FE + BE + AI).

---

Otto is a complete, production-grade backend + frontend application that:

1. **The Resurrection** — upload 15–20 photos of paper invoices, handwritten ledger pages, and a WhatsApp chat export → batch vision extraction → entity resolution → inference pass (reorder points, dues, price history) → live narrated build → one-tap confirmation → **a running digital business, in 3 minutes, zero typing.**
2. **The Autonomy Ladder** — every action starts human-gated. Approve reorders 3 times → Otto asks for a promotion → accept → Otto now executes reorders alone, **capped, logged, reversible for 1 hour, and revocable with one toggle.**

3. **Theme 2 Domain Engine** - one approval/trust core now drives hardcoded MVP playbooks for **Education, Healthcare, HR, Legal, Manufacturing, Sales, Customer Support, and Retail**. Each playbook stages a real approval-feed action with workflow steps, draft output, evidence sources, cost-of-delay, Otto Engine metadata, and the same earned-autonomy safety model.

## Theme 2 MVP engine

The home screen is now the **Autonomous Workflow Agents** console. Pick any targeted industry and click **Stage** to generate a domain-specific action card, or **Stage all** to populate the queue across all eight domains.

Core action families:
- `workflow_approval` for multi-department approvals.
- `document_generation` for letters, memos, reports, and contracts.
- `support_response` for ticket replies and escalations.
- `knowledge_answer` for policy-backed answers.
- `personalization_plan` for sales, retail, and customer growth.

Otto Workflow Engine integration: set `OTTO_ENGINE_URL` and `OTTO_ENGINE_KEY` to connect to Otto's workflow orchestration API, or leave them blank for the deterministic local playbook fallback used in the hackathon MVP. Otto keeps the safety moat: approval gate, trust grants, caps, undo, revoke, and audit trail.

## Quick start

```bash
# Prerequisites: Node.js >= 18, Docker (for local DB) or Supabase
pnpm approve-builds esbuild   # only first time, for Next.js esbuild dep
pnpm install

# Start Postgres (Docker) and run migrations
pnpm db:up
pnpm db:migrate

# Seed "Priya's Fashion, Jaipur" demo tenant
pnpm db:seed

# Start dev server (works keyless — EXTRACTOR_MODE=mock in .env)
pnpm dev
```

Open **http://localhost:3000** — you'll see the blank feed. Go to `/resurrection` to upload the Shoebox Kit, or snap an invoice photo from the feed page.

## Without Docker

Set `DATABASE_URL` in `.env` to a Supabase project URL, then run the migration SQL manually in the Supabase SQL editor (`db/migrations/001_init.sql`).

## Demo commands

```bash
pnpm demo:reset     # Wipes everything — blank state + 2 pre-seeded reorder approvals
pnpm cache:warm     # Pre-warm LLM cache against demo fixtures (needs OpenRouter key)
pnpm eval           # Measure extraction field accuracy against all fixtures
pnpm flow 0         # Verify Flow 0 end-to-end (needs dev server running)
pnpm flow A         # Verify Flow A end-to-end
pnpm flow B         # Verify Flow B end-to-end (graduation + auto-execute + undo + revoke)
pnpm flow all       # Run all three flows
pnpm health         # Health check (DB, OpenRouter, cache, Node version)
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  UI (React/Next.js 14 — dark feed, amber accent)        │
│  Approval Feed · Resurrection Progress · Trust Meter    │
│  Activity Trace · Simulated WhatsApp · Inventory/Ledger  │
├─────────────────────────────────────────────────────────┤
│  API routes: /api/ingest /approve /events(SSE) /feed    │
│              /trust /agent /po/:id                       │
├─────────────────────────────────────────────────────────┤
│  AGENT CORE (hand-rolled ~200 lines — judges read this)  │
│  machine.ts · gate.ts · trust.ts · triggers.ts          │
│  executors.ts · inference.ts · resurrection.ts           │
├─────────────────────────────────────────────────────────┤
│  EXTRACTION: OpenRouter (GPT-4o → Gemini)               │
│  Zod-locked output · per-field confidence · SHA-256 cache│
│  Instruction/data separation · mock fixture fallback     │
├─────────────────────────────────────────────────────────┤
│  Postgres 16 (docker) / Supabase (backup)               │
│  products · suppliers · customers · invoices · ledger     │
│  actions · agent_events · trust_grants · documents       │
├─────────────────────────────────────────────────────────┤
│  Integrations: Twilio WhatsApp · PO HTML generator       │
└─────────────────────────────────────────────────────────┘
```

Key engineering properties:
- **Idempotent approvals** — `UPDATE actions SET status = $to WHERE id = $id AND status = $from` inside a transaction. Double-tap is a clean no-op.
- **Deterministic demo** — all LLM calls cached by SHA-256 input hash. `pnpm cache:warm` pre-runs the exact demo inputs → stage demo is instant, survives dead wifi.
- **Schema-locked extraction** — Zod schema is sent to the model as a JSON Schema. The model physically cannot return fields outside it. Injection defense: injected text has no field to land in.
- **Honest numbers** — `pnpm eval` measures real field accuracy. No invented metrics.

## Tech stack

- **Framework:** Next.js 14 (App Router, TypeScript strict)
- **Database:** Postgres 16 (postgres.js — no ORM, same SQL on Docker and Supabase)
- **LLM:** OpenRouter (GPT-4o primary, Gemini 2.x fallback)
- **Cache:** SHA-256 input-hash on filesystem (committed for offline demo)
- **Validation:** Zod (runtime schema lock on every LLM boundary)
- **WhatsApp:** Twilio API + simulated in-app fallback
- **Design:** Tailwind CSS, dark theme, amber accent, JetBrains Mono

## Project structure

```
otto/
├── docs/ARCHITECTURE.md     ← Start here (judge-facing system design)
├── db/
│   ├── migrations/001_init.sql  ← Full schema (9 tables)
│   └── seed.ts                  ← "Priya's Fashion, Jaipur" demo tenant
├── src/
│   ├── agent/                   ← The core: machine, gate, trust, triggers, executors
│   ├── extract/                 ← Zod schemas, extractor, cache, prompts, mock fixtures
│   ├── components/              ← React components (ApprovalCard, TrustMeter, etc.)
│   ├── integrations/            ← WhatsApp, PO PDF
│   ├── lib/                     ← DB client, SSE bus, env validation
│   └── app/                     ← Pages + API routes
├── fixtures/                    ← Shoebox Kit (6 invoices, 3 ledgers, export, Q&A weapons)
│   ├── shoebox/                 ← 27 files with .expected.json ground truth
│   └── demo/                    ← sale invoice, poisoned invoice, blurry invoice
└── scripts/                     ← Migrate, seed, reset, eval, cache-warm, health, flow runner
```

## License

MIT — built for TakeOver'26 Hackathon.
