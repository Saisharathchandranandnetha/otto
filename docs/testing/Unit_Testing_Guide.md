# Unit Testing Guide

## Scope
Unit tests in Otto focus on isolated pieces of code:
- **Agent Core (`src/agent/`):** State machine transitions, gate logic, trust calculation.
- **Extraction Schemas (`src/extract/`):** Zod validation parsing.
- **React Components (`src/components/`):** Rendering and client-side interactions.

## Tooling
- **Test Runner:** Vitest (compatible with Vite/Next.js).
- **Component Testing:** React Testing Library (RTL).
- **Mocking:** Vitest's built-in mocking capabilities.

## Best Practices
1. **Agent Logic:** Test `machine.ts` and `gate.ts` extensively. Ensure state transitions are strictly governed by trust levels.
2. **Zod Schemas:** Pass both valid and maliciously malformed JSON to Zod schemas to ensure failures are gracefully caught.
3. **React Components:**
   - Test `ApprovalCard` to ensure it correctly renders trust levels and action requirements.
   - Use mock data that matches the exact shape of Postgres query returns.
4. **Mocking External APIs:** Never hit Twilio or OpenRouter in unit tests. Mock these integrations out completely.
