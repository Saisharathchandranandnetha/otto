# Developer FAQ

**Q: How do I run Otto without Docker?**
A: Set `DATABASE_URL` in `.env` to a Supabase project URL and run migrations manually via Supabase SQL editor (`db/migrations/001_init.sql`).

**Q: How does the AI caching work?**
A: Inputs to LLM calls are hashed with SHA-256. If a matching hash exists on the filesystem, the cached output is returned. Run `pnpm cache:warm` to pre-generate these.

**Q: Which LLMs does Otto use?**
A: Otto connects via OpenRouter, primarily using GPT-4o with Gemini 2.x as a fallback.
