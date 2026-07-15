# API Testing

## Scope
Otto relies heavily on its Next.js API routes to process actions, stream events, and handle webhooks (e.g., WhatsApp).

## Key Endpoints to Test
1. **`/api/ingest`:**
   - Validates file uploads and payload limits.
   - Tests fallback behavior if extraction fails.
2. **`/api/approve`:**
   - Ensures trust level checks prevent unauthorized approvals.
   - Verifies the state change in Postgres.
3. **`/api/events` (SSE):**
   - Requires programmatic connection to verify event streaming.
4. **`/api/agent` & `/api/trust`:**
   - Verifies agent state and trust grant updates.

## Automation
- Use Postman or a programmatic HTTP client like `supertest` inside Vitest to assert against API responses.
- Ensure all endpoints validate input using Zod before processing. Test the 400 Bad Request responses by sending intentionally malformed data.
