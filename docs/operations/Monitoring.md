# Monitoring Otto

## Overview
Monitoring Otto requires observing the three core pillars of the application:
1. **Next.js Web Application** (API routes, Frontend, Agent Core)
2. **Postgres Database** (State, pgvector, pg-boss jobs)
3. **External Services** (OpenRouter LLMs, Twilio WhatsApp)

## Health Checks
Otto includes a built-in health check script that verifies the database, OpenRouter, LLM cache, and Node version:
```bash
pnpm health
```

### Database Monitoring (Postgres 16)
- **Container Health:** The Docker container `otto-db` has a built-in health check using `pg_isready -U otto`.
- **Metrics to Track:**
  - Active connections.
  - Query latency (especially for `agent_events`, `actions`, and `trust_grants`).
  - `pg-boss` job queue depth and execution times.

### Application Monitoring (Next.js)
- Monitor Next.js application metrics:
  - Request volume and response times for API routes (`/api/ingest`, `/approve`, `/events`).
  - Server-Sent Events (SSE) connection drops.
  - Trust level progression metrics (Human-gated -> Autonomous).

### LLM Integration Monitoring
- **Cache Hit Rates:** Track filesystem SHA-256 cache hits vs. OpenRouter API calls.
- **Extraction Accuracy:** Run `pnpm eval` periodically against baseline fixtures to measure extraction field accuracy.
- **Token Usage & Latency:** Monitor time taken by GPT-4o / Gemini models and OpenRouter error rates.
