# Troubleshooting

## Next.js Build Errors
If you run into issues installing Next.js dependencies, run `pnpm approve-builds esbuild`.

## Database Connections
If you choose not to use Docker, ensure you have set `DATABASE_URL` to a valid Supabase endpoint in your `.env` file and manually executed `db/migrations/001_init.sql`.

## API or LLM Failures
If you are running in production mode, ensure your OpenRouter API keys are set up. To check system health, run:
```bash
pnpm health
```
