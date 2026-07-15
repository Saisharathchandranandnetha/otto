# Troubleshooting Guide

## Issue: Database Connection Refused
**Symptoms:** `pnpm dev` fails to connect, or `pnpm health` shows DB error.
**Resolution:**
1. Ensure Docker is running.
2. Check container status: `docker compose ps`
3. Restart container: `docker compose up -d db`
4. Confirm `POSTGRES_USER` and `POSTGRES_PASSWORD` in `.env` match `docker-compose.yml`.

## Issue: Extractions Failing (Zod Validation)
**Symptoms:** The LLM returns data that fails Zod schema validation.
**Resolution:**
1. Check `EXTRACTOR_MODE` in `.env`. If `mock`, ensure fixtures exist.
2. If using real LLMs, check `pnpm eval` to see baseline accuracy.
3. The LLM might be ignoring the JSON Schema. Check OpenRouter logs for model-specific degradation (GPT-4o vs Gemini).

## Issue: UI Not Updating / SSE Disconnected
**Symptoms:** The Activity Trace or Approval Feed isn't updating live.
**Resolution:**
1. Verify the `/events` Server-Sent Events endpoint is active in network tools.
2. Ensure no reverse proxy (like Nginx) is buffering the SSE connections (needs `proxy_buffering off`).

## Issue: Cannot Install Next.js esbuild
**Symptoms:** `pnpm install` fails on `esbuild`.
**Resolution:**
1. Run `pnpm approve-builds esbuild` first as per the `package.json` pnpm config.
