# Security Testing

## Scope
Because Otto handles sensitive business documents and executes automated actions, strict security boundaries must be maintained.

## Key Vectors
1. **Prompt Injection:**
   - Test Zod-locked outputs against injection payloads. Injected text should fail Zod validation and be discarded because it lacks a valid JSON schema field to land in.
   - See `fixtures/demo/poisoned_invoice` for a reference injection test case.
2. **SQL Injection:**
   - Ensure `postgres.js` template literals are used strictly (e.g., `sql\`SELECT * FROM users WHERE id = ${id}\``).
   - Test API boundaries with malicious payload inputs.
3. **Authorization & Trust Boundaries:**
   - Ensure an agent cannot auto-execute an action if the `trust_grants` cap is exceeded or the time limit has expired.
   - Test the "undo" and "revoke" mechanics to verify they successfully revert state.
