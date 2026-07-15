# Production Checklist for Otto

Before going live with the Otto application in a production environment, ensure all items on this checklist are completed.

## 1. Database Configuration
- [ ] **Managed Database**: Use a robust managed PostgreSQL 16 service (e.g., Supabase, RDS) instead of local Docker.
- [ ] **Connection Pooling**: Configure a connection pooler (like PgBouncer or Supabase's built-in pooler) if you expect high concurrent connections.
- [ ] **Backups**: Ensure automated daily backups and Point-In-Time Recovery (PITR) are enabled on the database.
- [ ] **Migrations**: All migrations (`scripts/migrate.ts`) have been applied to the production database successfully.

## 2. Environment Variables & Security
- [ ] **Secret Management**: All sensitive keys (`DATABASE_URL`, `OPENROUTER_API_KEY`, `TWILIO_*`) are securely stored in the production environment's secret manager (e.g., Vercel Environment Variables).
- [ ] **Production Flags**: Ensure `NODE_ENV` is set to `production`.
- [ ] **Extractor Mode**: Ensure `EXTRACTOR_MODE` is **not** set to `mock` so the app uses real LLM calls instead of local fixtures.

## 3. Application Build
- [ ] **Clean Build**: The application builds successfully without critical warnings using `pnpm build`.
- [ ] **Type Safety**: The `pnpm typecheck` script passes locally or in CI without errors.

## 4. External Dependencies
- [ ] **OpenRouter Account**: The OpenRouter account is funded, and rate limits are sufficient for expected traffic.
- [ ] **Twilio Account**: Twilio is correctly configured for production use (if WhatsApp integrations are active).

## 5. Operations & Monitoring
- [ ] **Logging**: Application logs are being captured and aggregated (e.g., Vercel Logs, Datadog, or similar).
- [ ] **Error Tracking**: Tools like Sentry are configured to catch frontend and backend exceptions.
- [ ] **Health Checks**: The `pnpm health` script or an equivalent health endpoint is monitored by an uptime service.

## 6. Performance
- [ ] **Caching**: The SHA-256 caching mechanism for LLM responses is behaving correctly under production load.
- [ ] **Next.js Optimizations**: Images and static assets are properly optimized by Next.js.
