# Otto — Requirements

## 1. Project Goal
Finalize the integration of a finalized n8n SSO authentication flow (where the Otto dashboard mediates authentication into the headless n8n instance), verify the complete SSO/RBAC flow across all 7 domains, and set up Telegram Bot + Dify AI data pipelines into the Education domain dashboard.

## 2. User Roles
- **Viewer (gray):** Can view data in their assigned domain but cannot execute actions.
- **Operator (blue):** Can execute standard workflows within their assigned domain (human-gated).
- **Manager (amber):** Can oversee domain-level analytics, grant/revoke autonomy thresholds, and approve edge-case actions.
- **Admin (red):** Super Admin access across all 7 domains. Manages users, domain assignments, and global n8n API configuration.

## 3. Functional Requirements
### Authentication & Authorization
- Implement a robust JWT-based SSO with database-backed sessions.
- Sessions expire in 8 hours and utilize `bcryptjs` (12 rounds) for password hashing.
- Middleware must intercept ALL requests to protected routes and enforce domain-level RBAC via Base64 decoded JWT payloads.
- Otto dashboard must act as an Identity Provider (IdP) or mediator to authenticate users into the headless n8n instance via API.

### Domain Access
- A central domain selector that only displays permitted domains to the logged-in user.
- 7 distinct Domain Dashboards: Manufacturing, Healthcare, Customer Support, Retail, Sales, Legal, Education.
- Premium UI aesthetics, dark theme, amber accents.

### Integration (n8n + Dify + Telegram)
- n8n must run via Docker as a self-hosted instance.
- Telegram Bot must be connected to n8n workflows.
- Dify AI must be integrated for external automation and response generation.
- Data from these workflows must feed live into the relevant domain dashboards (starting with Education).

## 4. Technical Requirements
- **Framework:** Next.js 14 App Router, TypeScript (strict mode)
- **Database:** PostgreSQL 16 (pgvector supported)
- **State/Auth:** HTTP-only cookies for session tokens
- **Infrastructure:** Docker-compose required for n8n/Postgres execution.
- **Error Handling:** Strict null checks for session retrieval and robust payload mappings.
