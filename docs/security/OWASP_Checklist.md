# OWASP Top 10 Security Checklist

- [x] **A01: Broken Access Control:** Enforce `tenant_id` on all queries. Implement Role-Based Access Control for trust grants.
- [x] **A02: Cryptographic Failures:** Use HTTPS everywhere. Enforce DB volume encryption. Keep API keys out of client-side code.
- [x] **A03: Injection:** Use parameterized queries via `postgres.js` to prevent SQL Injection. Use Zod schemas to mitigate Prompt Injection.
- [x] **A04: Insecure Design:** The Autonomy Ladder explicitly gates AI actions before trusting it. Undo/revoke workflows are built into the design.
- [x] **A05: Security Misconfiguration:** Ensure `.env` is ignored. Ensure Docker/Supabase default passwords are changed.
- [x] **A06: Vulnerable and Outdated Components:** Run `pnpm audit` regularly to check for vulnerable dependencies.
- [x] **A07: Identification and Authentication Failures:** Use robust session management. Enforce Twilio webhook signature verification.
- [x] **A08: Software and Data Integrity Failures:** CI/CD pipeline should verify package integrity.
- [x] **A09: Security Logging and Monitoring Failures:** Log all state changes in `actions` and `agent_events`. Keep audit trails of all autonomous executions.
- [x] **A10: Server-Side Request Forgery (SSRF):** Ensure URLs fetched by the agent (if any) are validated and scoped to an allowlist.
