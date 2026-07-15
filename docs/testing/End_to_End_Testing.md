# End-to-End (E2E) Testing

## Scope
E2E tests validate complete user journeys across the frontend and backend, interacting with a real database.

## Custom Backend Flow Tester
Otto includes custom flow scripts designed to execute the backend state machine end-to-end:
- `pnpm flow 0`: Verifies Flow 0 end-to-end.
- `pnpm flow A`: Verifies Flow A.
- `pnpm flow B`: Verifies graduation, auto-execute, undo, and revoke.
These scripts should run continuously in CI to guarantee core business logic.

## Frontend E2E Tooling
- **Tool:** Playwright.

## Key User Journeys
1. **The Resurrection:** 
   - Upload 15-20 photos -> verify batch extraction -> verify entity resolution -> confirm one-tap setup.
2. **The Autonomy Ladder:**
   - Approve 3 manual reorders.
   - Verify Otto asks for a promotion.
   - Accept promotion.
   - Verify auto-execution.
   - Trigger the "undo" toggle within 1 hour.
3. **Simulated WhatsApp Fallback:** Test the in-app chat simulator for integration continuity.
