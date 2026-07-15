# Logging

## Overview
Otto relies on both system-level logs (Docker, Next.js) and domain-level audit trails (Database).

## Database Audit Trail (Agent Core)
Otto is an autonomous agent. Its most critical logs are stored directly in the database to maintain trust and auditability:
- **`agent_events` table:** Logs all actions taken by the Otto Engine, including metadata and workflow steps.
- **`actions` table:** Idempotent state transitions.
- **`trust_grants` table:** Records of the user promoting Otto to autonomous execution.

## Application Logs
- **Next.js Server Logs:** All API requests and server-side errors are logged to `stdout`. Run `pnpm dev` or `pnpm start` to capture these.
- **LLM Logs:** LLM requests and outputs are heavily monitored through the Zod schema boundaries. Caching hashes the inputs (SHA-256) into the local filesystem.

## Container Logs
To view database logs, use Docker:
```bash
docker logs otto-db -f
```

## Log Retention
- **Audit Logs (`agent_events`):** Must be retained indefinitely as they serve as the business's operational history.
- **System Logs:** Standard log rotation can be applied to `stdout` streams.
