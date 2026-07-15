# Integration Testing Guide

## Scope
Integration tests ensure that Otto's internal systems work correctly together. Specifically:
- **API Routes:** `/api/approve`, `/api/ingest`, `/api/feed`.
- **Database Access:** Interactions with Postgres 16 using `postgres.js`.
- **Server-Sent Events (SSE):** Verifying the event bus broadcasts correctly.

## Tooling
- **Test Runner:** Vitest.
- **Database:** Local Dockerized Postgres instance.

## Best Practices
1. **Test Database:** Spin up a dedicated test database container. Run migrations (`pnpm db:migrate`) and seed initial data before the test suite.
2. **Transaction Rollbacks:** If possible, wrap tests in a SQL transaction and roll back at the end to keep tests fast and isolated.
3. **Idempotency Checks:** For routes like `/api/approve`, call the endpoint twice in a row. The first should succeed, the second should be a no-op, simulating front-end double-taps.
4. **Mocking External APIs:** Mock Twilio and OpenRouter during standard integration tests, unless running specific third-party integration suites.
