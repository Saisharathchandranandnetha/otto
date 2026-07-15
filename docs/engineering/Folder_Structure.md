# Folder Structure

This document outlines the standard folder structure used in the Otto project.

## Root Directory

```
otto/
├── db/                   # Database migrations and seeds
├── docs/                 # Project documentation (architecture, engineering)
├── fixtures/             # Test data, demo assets, LLM cache fixtures
├── public/               # Static assets (images, icons)
├── scripts/              # Utility scripts (eval, test, reset, setup)
├── src/                  # Application source code
├── package.json          # Dependency definitions and scripts
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── tailwind.config.ts    # Tailwind CSS configuration
```

## `src/` Directory Breakdown

```
src/
├── agent/                # Core AI logic (machine, gate, trust, triggers, executors)
├── app/                  # Next.js App Router pages, layouts, API routes
├── components/           # Reusable React components (ApprovalCard, TrustMeter, etc.)
├── extract/              # Zod schemas, LLM extractors, prompt templates
├── integrations/         # External service logic (Twilio/WhatsApp, PDF generation)
├── lib/                  # Shared utilities (DB client, SSE, env config)
└── locales/              # i18n localization files
```

## `db/` Directory
Contains all direct database interactions outside the application source:
- `migrations/`: Raw SQL migration files (e.g., `001_init.sql`).
- `seed.ts`: Seeds for initial tenant generation.

## `scripts/` Directory
CLI tools for developers:
- `cache-warm.ts`: Pre-runs demo inputs to cache LLM outputs.
- `demo-reset.ts`: Resets DB state for a clean demo.
- `eval.ts`: Validates data extraction accuracy.
- `run-flow.ts`: End-to-end flow testing scripts.
