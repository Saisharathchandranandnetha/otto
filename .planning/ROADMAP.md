# Project Roadmap: Otto AI Operator

## Phase 1: n8n SSO Integration
**Status:** Pending
**Context:** Integrate the finalized n8n SSO authentication flow where the Otto dashboard mediates authentication into the headless n8n instance.

- [ ] Configure n8n environment variables for external authentication
- [ ] Implement Otto API endpoints to issue and validate n8n-compatible tokens
- [ ] Connect Otto dashboard session state to the n8n UI / webhook endpoints

## Phase 2: Dify AI & Telegram Integration
**Status:** Pending
**Context:** Connect the n8n instance to a Telegram Bot and Dify AI to process live data streams and feed them into the Education dashboard.

- [ ] Set up Telegram Bot credentials and webhook in n8n
- [ ] Integrate Dify AI node/API within n8n workflows for processing
- [ ] Pipe output data from n8n to Otto's Postgres DB or via SSE to the Education dashboard

## Phase 3: Validation & QA
**Status:** Pending
**Context:** Final verification and testing of the entire SSO/RBAC flow across all 7 domains in a live Docker environment.

- [ ] Boot full infrastructure (Postgres, n8n, web) via docker-compose
- [ ] Run migration and seed scripts (`pnpm db:up`, `pnpm db:migrate`, `pnpm db:seed`)
- [ ] Verify RBAC restrictions manually across Viewer, Operator, Manager, and Admin roles
- [ ] End-to-end test the Telegram -> n8n -> Dify -> Dashboard data flow
