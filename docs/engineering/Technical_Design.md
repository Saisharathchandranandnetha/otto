# Technical Design

## Overview
Otto is a production-grade AI operator and autonomous workflow engine built for small businesses. It digitizes operations by extracting structured data from documents (invoices, ledgers) and running workflow agents with configurable human-in-the-loop approvals.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  UI (React/Next.js 14 — dark feed, amber accent)        │
│  Approval Feed · Resurrection Progress · Trust Meter    │
│  Activity Trace · Simulated WhatsApp · Inventory/Ledger │
├─────────────────────────────────────────────────────────┤
│  API routes: /api/ingest /approve /events(SSE) /feed    │
│              /trust /agent /po/:id                      │
├─────────────────────────────────────────────────────────┤
│  AGENT CORE                                             │
│  machine.ts · gate.ts · trust.ts · triggers.ts          │
│  executors.ts · inference.ts · resurrection.ts          │
├─────────────────────────────────────────────────────────┤
│  EXTRACTION: OpenRouter (GPT-4o → Gemini)               │
│  Zod-locked output · per-field confidence               │
├─────────────────────────────────────────────────────────┤
│  Postgres 16 (docker) / Supabase (backup)               │
│  products · suppliers · customers · invoices · ledger   │
│  actions · agent_events · trust_grants · documents      │
├─────────────────────────────────────────────────────────┤
│  Integrations: Twilio WhatsApp · PO HTML generator      │
└─────────────────────────────────────────────────────────┘
```

## Key Engineering Principles
- **Schema-locked extraction**: Zod schemas are used alongside LLM requests to guarantee structured and validated outputs.
- **Idempotency**: Critical operations like approvals are handled transactionally to prevent double-execution.
- **Deterministic AI**: LLM calls are cached locally via SHA-256 hashes for fast, reliable, offline demonstrations and tests.
- **Progressive Autonomy**: System gradually shifts from human-gated approvals to autonomous execution as trust is established.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js (>= 18.17.0)
- **Database**: PostgreSQL 16 via `postgres` (no heavy ORM)
- **AI/LLM**: `ai` (Vercel AI SDK), `@ai-sdk/groq`, OpenRouter API
- **Tooling**: TypeScript, pnpm, Docker, Zod
