# Maintenance Guide

## Database Backups
Otto runs Postgres 16 (with pgvector). Standard Postgres backup procedures apply.
**Manual Backup (Docker):**
```bash
docker exec -t otto-db pg_dumpall -c -U otto > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
```
**Restore:**
```bash
cat dump_*.sql | docker exec -i otto-db psql -U otto
```
If using Supabase, use Supabase's automated daily backups.

## Schema Migrations
Migrations are written in SQL and stored in `db/migrations/`.
To apply new migrations:
```bash
pnpm db:migrate
```
*Note: Otto does not use an ORM (uses `postgres.js`). Ensure raw SQL migrations are carefully tested.*

## LLM Cache Maintenance
The SHA-256 filesystem cache is located in the project directory (used for idempotent offline demos).
- To clear the cache, delete the cache files.
- To re-warm the cache: `pnpm cache:warm`.
- Periodically evaluate model changes against ground truth using `pnpm eval`.

## Dependency Updates
Update dependencies periodically:
```bash
pnpm update
```
Test thoroughly after updates, especially `@ai-sdk/groq`, `ai`, and `zod` as they form the extraction boundary.
