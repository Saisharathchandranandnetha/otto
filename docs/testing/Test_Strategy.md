# Otto Test Strategy

## Overview
Otto is a Next.js 14-based AI operator designed for small businesses. Because Otto operates autonomously on business data, correctness, security, and predictability are paramount.

Our testing strategy follows a modified testing pyramid that includes a dedicated **AI Evaluation** layer alongside traditional testing methodologies.

## Testing Layers
1. **Unit Testing:** Core logic (e.g., `agent/` folder: `machine.ts`, `gate.ts`), utilities, and React components.
2. **Integration Testing:** Database interactions (Postgres), API routes (`/api/ingest`, `/approve`), and Next.js backend logic.
3. **UI Testing:** Validating React components, ensuring Tailwind CSS consistency (dark theme, amber accents).
4. **End-to-End (E2E) Testing:** Full user journeys (e.g., "The Resurrection" onboarding) using Playwright.
5. **AI Evaluation:** Specialized testing for LLM extraction accuracy using ground-truth fixtures via `pnpm eval`.

## Key Principles
- **Deterministic AI:** LLM outputs must be schema-locked via Zod.
- **Idempotency:** Core actions (e.g., approvals) must be idempotent. Tests will verify double-execution safely no-ops.
- **Data Integrity:** Postgres queries (via `postgres.js`) must be tested against a real, seeded database instance.
