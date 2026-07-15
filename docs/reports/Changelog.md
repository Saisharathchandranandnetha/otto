# Changelog

## [0.1.0] - 2026-07-08 (Hackathon MVP Release)

### Added
- **Next.js 14 Foundation**: Set up the core App Router structure with Tailwind CSS (dark theme, amber accent).
- **Postgres DB**: Implemented a 9-table schema using `postgres.js` and custom migration scripts.
- **The Resurrection Module**: Added batch vision extraction to process invoices and ledger photos into structured DB records.
- **The Autonomy Ladder**: Introduced a trust system requiring 3 manual approvals before unlocking autonomous agent actions.
- **Domain Engine**: Shipped 8 hardcoded industry playbooks (Education, Healthcare, HR, Legal, Manufacturing, Sales, Customer Support, Retail).
- **LLM Integration**: Integrated OpenRouter with GPT-4o and Gemini fallbacks.
- **Deterministic Testing**: Added SHA-256 based filesystem cache for LLM requests (`pnpm cache:warm`).
- **Evaluation Suite**: Created `pnpm eval` to test extraction accuracy against `.expected.json` fixtures.
- **Twilio Integration**: Added simulated WhatsApp messaging and real Twilio API support.
- **Idempotency**: Implemented strict transactional safety for state updates.

### Changed
- Configured Zod schemas to lock LLM outputs directly to required JSON structures.

### Fixed
- Addressed potential prompt injection by enforcing structured outputs and separating instructions from data.
