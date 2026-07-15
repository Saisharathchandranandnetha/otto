# Otto Threat Model

## 1. System Overview
Otto is a multi-tenant AI operator for small businesses built on Next.js 14, Postgres 16, and integrates with Twilio (WhatsApp) and OpenRouter (LLMs).

## 2. Threat Actors
- **External Attackers:** Attempting to steal data, perform prompt injection, or disrupt the service.
- **Malicious Tenants:** Attempting to access data of other tenants (Cross-Tenant Data Leakage) or exploit the system.
- **Compromised Integrations:** Potential compromise via Twilio Webhooks or third-party LLM providers.

## 3. Key Threats & Mitigations

### 3.1 Prompt Injection & LLM Abuse
- **Threat:** Attackers upload poisoned invoices or send malicious WhatsApp messages to manipulate the AI agent.
- **Mitigation:** Otto utilizes strict schema-locked extraction (Zod validation). The LLM is forced to return a predefined JSON schema, rendering injected payloads inert since they have no field to land in.

### 3.2 Cross-Tenant Data Leakage
- **Threat:** A tenant accessing another tenant's ledger, customers, or actions.
- **Mitigation:** Every SQL query must strictly include a `tenant_id` filter. (Multi-tenant data isolation).

### 3.3 Idempotency & Replay Attacks
- **Threat:** An attacker capturing and replaying an approval request to trigger multiple orders.
- **Mitigation:** Idempotent DB updates (`UPDATE ... WHERE status = $from`) inside transactions ensure actions are strictly single-execution.

### 3.4 Webhook Spoofing (Twilio)
- **Threat:** An attacker forging requests to the WhatsApp Twilio webhook to execute actions.
- **Mitigation:** Strict validation of the `X-Twilio-Signature` header using the Twilio Auth Token.
