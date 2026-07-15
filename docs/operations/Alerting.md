# Alerting

## Overview
Alerts for Otto should trigger based on infrastructure failures or degradation of the autonomous agent's capabilities.

## High Severity Alerts
1. **Database Unreachable:**
   - **Condition:** Next.js application cannot connect to Postgres, or Docker healthcheck (`pg_isready`) fails.
   - **Impact:** Entire platform down; Otto cannot process approvals or save state.
2. **LLM Provider Outage:**
   - **Condition:** OpenRouter (GPT-4o) fails to respond, or API key is rejected.
   - **Impact:** Otto cannot perform extractions or infer workflows.
3. **pg-boss Queue Stagnation:**
   - **Condition:** Background jobs (e.g., automated execution tasks) accumulate without being processed.
   - **Impact:** Approved autonomous actions are delayed.

## Medium Severity Alerts
1. **Extraction Validation Failures:**
   - **Condition:** High rate of Zod schema validation errors from the LLM outputs.
   - **Impact:** Degraded performance; Otto asks for retries or manual intervention.
2. **Twilio Delivery Failures:**
   - **Condition:** WhatsApp notifications fail to send.
   - **Impact:** Simulated in-app fallback works, but external notifications are delayed.
3. **Application Exceptions:**
   - **Condition:** Increased 5xx errors on API routes (e.g., `/api/ingest`).
