# Developer Guide

Welcome to the Otto Developer Guide! Otto is an AI operator built for small businesses that starts human-gated and slowly earns autonomy.

## Project Structure
- `db/` - Database migrations and seed scripts.
- `src/agent/` - Agent core (machine, gate, trust, triggers, executors).
- `src/extract/` - Zod schemas, extractor logic, cache, prompts, mock fixtures.
- `src/components/` - React components.
- `src/integrations/` - Third-party integrations (WhatsApp, PO HTML generator).
- `src/lib/` - Utilities like DB client, SSE bus, environment validation.
- `src/app/` - Next.js pages and API routes.
- `fixtures/` - Test data (Shoebox Kit).
- `scripts/` - Assorted helper scripts.

## Tech Stack
- Next.js 14
- Postgres 16
- OpenRouter (GPT-4o, Gemini 2.x)
- Zod for Validation
- Tailwind CSS

## Development Workflow
1. `pnpm install`
2. `pnpm db:up` and `pnpm db:migrate`
3. `pnpm dev`
