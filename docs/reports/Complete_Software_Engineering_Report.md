# Complete Software Engineering Report

## 1. Executive Summary
Otto is an AI operator for small businesses, built as a production-grade backend and frontend application for the TakeOver'26 Hackathon. It focuses on Theme 2 (AI Automation & Intelligent Agents) and Theme 7 (Analytics & Decision Intelligence). The core value proposition is autonomous workflow execution that starts human-gated and transitions to autonomous execution after earning trust.

## 2. Core Features
- **The Resurrection**: A batch vision extraction system that processes photos of paper invoices and ledger pages to create a digital business in 3 minutes.
- **The Autonomy Ladder**: A trust-based execution model where Otto requires human approval for actions initially, and after a set number of approvals (e.g., 3), asks for autonomous execution rights.
- **Domain Engine**: Pre-built MVP playbooks for Education, Healthcare, HR, Legal, Manufacturing, Sales, Customer Support, and Retail.

## 3. System Architecture
The application follows a client-server architecture with an AI processing layer:
- **Frontend**: Next.js 14 App Router, built with Tailwind CSS, a dark theme, and an amber accent.
- **Backend/API**: Next.js API routes handling ingestion, approvals, SSE events, and trust management.
- **Database**: PostgreSQL 16 (dockerized or Supabase), interacted with via `postgres.js` (no ORM). Contains 9 core tables (products, suppliers, customers, invoices, ledger, actions, agent_events, trust_grants, documents).
- **AI/Extraction Layer**: OpenRouter (GPT-4o primary, Gemini fallback). Employs Zod for strict schema-locked JSON output.

## 4. Key Engineering Properties
- **Idempotent Approvals**: Database updates use strict `WHERE status = $from` checks inside transactions to handle double-taps cleanly.
- **Deterministic Demo**: SHA-256 caching of LLM inputs allows instant, offline-capable demos.
- **Schema-Locked Extraction**: AI outputs are strictly constrained to predefined Zod schemas, mitigating prompt injection risks.
- **Evaluation**: Built-in evaluation scripts (`pnpm eval`) measure real field accuracy instead of relying on subjective metrics.

## 5. Technology Stack
- Node.js (>=18.17.0)
- Next.js 14, React 18
- PostgreSQL 16
- OpenRouter, AI SDK
- Zod, Twilio, Tailwind CSS
