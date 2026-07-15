# Security Recommendations

## 1. Immediate Priorities
- **Implement Row-Level Security (RLS):** Transition from explicit `WHERE tenant_id` application logic to Postgres RLS for an unbreakable data isolation layer.
- **Rate Limiting:** Implement rate limiting on API routes (`/api/ingest`, `/approve`, `/agent`) to prevent DoS attacks and runaway LLM costs.

## 2. Medium-Term Improvements
- **Audit Logging:** Export the `agent_events` and state transitions to a secure, immutable logging service (e.g., Datadog, AWS CloudTrail) for compliance.
- **WAF Deployment:** Place a Web Application Firewall (WAF) in front of the Next.js app to automatically block malicious payloads and basic bot traffic.
- **Secret Scanning:** Enable automated secret scanning in the GitHub repository to prevent accidental credential leakage.

## 3. Long-Term Strategy
- **SOC2 Compliance:** Begin aligning the platform with SOC2 Type II controls, particularly around change management and data access policies.
- **Penetration Testing:** Schedule a grey-box penetration test focusing on the multi-tenant isolation and the Twilio webhook ingestion vector.
