# Incident Response

## Severity Levels

### Sev-1: Critical Outage
**Definition:** The database is down, or the LLM provider (OpenRouter) is completely unavailable.
**Response:**
1. Check Docker status for the DB: `docker compose ps` and `docker logs otto-db`.
2. Check `pnpm health` to verify OpenRouter connectivity.
3. If LLM provider is down, switch to fallback (Gemini) or wait for provider resolution. The app has local cache for deterministic flows.

### Sev-2: Agent Degradation
**Definition:** Zod validation errors spike, or Otto makes incorrect extraction inferences on new document types.
**Response:**
1. Review the rejected extractions.
2. Run `pnpm eval` against the `fixtures/` directory to check if the issue is a regression.
3. If autonomous actions misbehave, users have a **1-hour reversible window** and can revoke trust with one toggle in the UI.

### Sev-3: Integration Failure
**Definition:** WhatsApp Twilio integration fails.
**Response:**
1. Verify Twilio credentials in `.env`.
2. Fallback to simulated in-app WhatsApp UI.

## Rollback & Reset
For staging and demo environments, if state becomes corrupted, you can fully reset the environment:
```bash
pnpm demo:reset
```
This wipes everything and returns to a blank state with pre-seeded demo data.
