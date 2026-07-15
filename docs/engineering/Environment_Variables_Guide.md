# Environment Variables Guide

> **Source of truth**: [`src/lib/env.ts`](file:///c:/Users/gunde/Desktop/otto/src/lib/env.ts) — the `EnvVars` interface and `getEnv()` / `validateEnv()` functions.
> All variables are also documented in `.env.example`.

---

## How It Works

Environment variables are loaded at module level via `getEnv()` and validated at startup via `validateEnv()`. The validation runs once during Next.js serverless cold-start. If a critical variable is missing in the current mode, the app logs a warning (or crashes in production).

The system is designed for **zero-config local development** — with no `.env` file at all, Otto runs against local Docker Postgres with mock extraction and simulated WhatsApp. You only need env vars when enabling real LLM extraction or real WhatsApp messaging.

---

## Variable Reference

### Database

| Variable | Type | Required | Default | Description |
|---|---|---|---|---|
| `DATABASE_URL` | `string` | **No** (auto-defaults in dev) | `postgres://otto:otto@localhost:5432/otto` | PostgreSQL connection string. In development, if unset and `CI` is not set, the app auto-defaults to the local Docker Postgres defined in [`docker-compose.yml`](file:///c:/Users/gunde/Desktop/otto/docker-compose.yml). In production/CI, this must be explicitly set. |

**Connection pool** (hardcoded in [`src/lib/db.ts`](file:///c:/Users/gunde/Desktop/otto/src/lib/db.ts)):
- `max: 10` connections
- `idle_timeout: 30` seconds
- `max_lifetime: 1800` seconds (30 min)
- `transform: postgres.camel` — automatic `snake_case` ↔ `camelCase` conversion

---

### LLM / Extraction

| Variable | Type | Required | Default | Description |
|---|---|---|---|---|
| `EXTRACTOR_MODE` | `'mock' \| 'live'` | No | `'mock'` | Controls whether document extraction uses real LLM vision or returns fixture/mock data. Set to `'live'` for real extraction; `'mock'` for offline development without API keys. |
| `OPENROUTER_API_KEY` | `string` | **Yes** if `EXTRACTOR_MODE=live` | — | API key for [OpenRouter](https://openrouter.ai/). Required only when `EXTRACTOR_MODE=live`. If missing in live mode, the app logs a warning and falls back to mock extraction. |
| `EXTRACTOR_MODEL` | `string` | No | `'openai/gpt-4o'` | Primary LLM model for document extraction (vision tasks). Uses OpenRouter model naming convention. |
| `EXTRACTOR_FALLBACK_MODEL` | `string` | No | `'google/gemini-2.0-flash-001'` | Fallback model used when the primary model fails or is rate-limited. |
| `OPENAI_API_KEY` | `string` | No | — | OpenAI API key. Used for embedding generation (`vector(1536)` in `knowledge_documents`) and other OpenAI-specific features. Not required for core Otto functionality. |
| `LLM_CACHE_DIR` | `string` | No | — | Directory path for caching LLM responses. When set, extraction results are cached by `file_hash` (the SHA-256 of the uploaded document). Dramatically reduces API costs during development. |

**Mode interactions**:
- `EXTRACTOR_MODE=mock` → no API keys needed at all, extraction returns fixture data
- `EXTRACTOR_MODE=live` + `OPENROUTER_API_KEY` set → real LLM vision extraction
- `EXTRACTOR_MODE=live` + `OPENROUTER_API_KEY` missing → warning logged, falls back to mock

---

### WhatsApp / Twilio

| Variable | Type | Required | Default | Description |
|---|---|---|---|---|
| `WHATSAPP_MODE` | `'simulated' \| 'sandbox'` | No | `'simulated'` | Controls WhatsApp message delivery. `'simulated'` logs messages to console without sending. `'sandbox'` sends real messages via Twilio WhatsApp sandbox. |
| `TWILIO_ACCOUNT_SID` | `string` | **Yes** if `WHATSAPP_MODE=sandbox` | — | Twilio account SID. Get this from your [Twilio Console](https://console.twilio.com/). |
| `TWILIO_AUTH_TOKEN` | `string` | **Yes** if `WHATSAPP_MODE=sandbox` | — | Twilio auth token. Keep this secret — never commit to version control. |
| `TWILIO_WHATSAPP_FROM` | `string` | **Yes** if `WHATSAPP_MODE=sandbox` | — | The Twilio WhatsApp sender number, e.g. `whatsapp:+14155238886`. This is assigned by Twilio when you set up the WhatsApp sandbox. |
| `DEMO_SUPPLIER_WHATSAPP_TO` | `string` | No | — | A real WhatsApp number to receive supplier messages during demos, e.g. `whatsapp:+919876543210`. Only used in sandbox mode for live demo scenarios. |

---

### Otto Engine

| Variable | Type | Required | Default | Description |
|---|---|---|---|---|
| `OTTO_ENGINE_URL` | `string` | No | — | URL of an external Otto engine service. When set, the app delegates agent reasoning to this endpoint instead of running it in-process. Used for distributed deployments. |
| `OTTO_ENGINE_KEY` | `string` | No | — | API key for authenticating with the Otto engine service. Required if `OTTO_ENGINE_URL` is set. |

---

### Application

| Variable | Type | Required | Default | Description |
|---|---|---|---|---|
| `PORT` | `string` | No | Next.js default (`3000`) | Port for the Next.js server. Typically only set in production or container deployments. |
| `OTTO_URL` | `string` | No | — | The public URL of the Otto instance. Used for generating absolute URLs in WhatsApp messages, webhooks, and callbacks. |

---

## Scenario Examples

### 1. Local Development (Zero Config)

No `.env` file needed. Just start Docker and run:

```bash
pnpm db:up        # starts pgvector/pgvector:pg16 on port 5432
pnpm db:migrate   # runs all SQL migrations
pnpm db:seed      # seeds "Priya's Fashion, Jaipur"
pnpm dev          # starts Next.js on localhost:3000
```

**Effective configuration**:
- `DATABASE_URL` = `postgres://otto:otto@localhost:5432/otto` (auto-defaulted)
- `EXTRACTOR_MODE` = `mock` (fixture data, no API calls)
- `WHATSAPP_MODE` = `simulated` (console logs, no real messages)

### 2. Development with Real LLM Extraction

```env
# .env
EXTRACTOR_MODE=live
OPENROUTER_API_KEY=sk-or-v1-abc123...
LLM_CACHE_DIR=./data/llm-cache
```

This enables real vision extraction with response caching. The cache directory prevents repeat API calls when uploading the same document multiple times.

### 3. Live Demo with WhatsApp

```env
# .env
EXTRACTOR_MODE=live
OPENROUTER_API_KEY=sk-or-v1-abc123...

WHATSAPP_MODE=sandbox
TWILIO_ACCOUNT_SID=ACxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
DEMO_SUPPLIER_WHATSAPP_TO=whatsapp:+919876543210
```

This configuration sends real WhatsApp messages to `DEMO_SUPPLIER_WHATSAPP_TO` during reorder flows. Use the [Twilio WhatsApp Sandbox](https://www.twilio.com/docs/whatsapp/sandbox) — recipients must join the sandbox first by sending a join code.

### 4. Production Deployment

```env
# .env.production
DATABASE_URL=postgres://user:pass@prod-host:5432/otto_prod

EXTRACTOR_MODE=live
OPENROUTER_API_KEY=sk-or-v1-prod-key...

WHATSAPP_MODE=sandbox
TWILIO_ACCOUNT_SID=ACxxxxxxxxx
TWILIO_AUTH_TOKEN=prod_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+1234567890

OTTO_URL=https://otto.example.com
PORT=8080
```

### 5. CI / Testing

```env
# .env.test
DATABASE_URL=postgres://otto:otto@localhost:5432/otto_test
EXTRACTOR_MODE=mock
WHATSAPP_MODE=simulated
```

In CI, `DATABASE_URL` must be explicitly set (the auto-default is disabled when `process.env.CI` is set).

---

## Validation Behavior

The [`validateEnv()`](file:///c:/Users/gunde/Desktop/otto/src/lib/env.ts#L54-L64) function runs at module load time. Current validation rules:

| Condition | Behavior |
|---|---|
| `EXTRACTOR_MODE=live` and `OPENROUTER_API_KEY` missing | **Warning** logged to console. App continues with mock extraction fallback. |
| `DATABASE_URL` unset and `CI` unset | Auto-defaults to `postgres://otto:otto@localhost:5432/otto`. No warning. |
| `DATABASE_URL` unset and `CI` set | No auto-default. Will fail at first database query. |

The validation is intentionally lenient — it warns rather than crashes — because the app should always be runnable for frontend development even without external service credentials.

---

## Quick Reference Table

| Variable | Category | Required | Default | Needed When |
|---|---|---|---|---|
| `DATABASE_URL` | Database | Auto-defaults | `postgres://otto:otto@localhost:5432/otto` | Always (auto-configured in dev) |
| `EXTRACTOR_MODE` | LLM | No | `mock` | Set to `live` for real extraction |
| `OPENROUTER_API_KEY` | LLM | If live mode | — | Using real document extraction |
| `EXTRACTOR_MODEL` | LLM | No | `openai/gpt-4o` | Overriding the default vision model |
| `EXTRACTOR_FALLBACK_MODEL` | LLM | No | `google/gemini-2.0-flash-001` | Overriding the fallback model |
| `OPENAI_API_KEY` | LLM | No | — | Embedding generation (education module) |
| `LLM_CACHE_DIR` | LLM | No | — | Reducing API costs in development |
| `WHATSAPP_MODE` | WhatsApp | No | `simulated` | Set to `sandbox` for real messages |
| `TWILIO_ACCOUNT_SID` | WhatsApp | If sandbox mode | — | Sending real WhatsApp messages |
| `TWILIO_AUTH_TOKEN` | WhatsApp | If sandbox mode | — | Sending real WhatsApp messages |
| `TWILIO_WHATSAPP_FROM` | WhatsApp | If sandbox mode | — | Sending real WhatsApp messages |
| `DEMO_SUPPLIER_WHATSAPP_TO` | WhatsApp | No | — | Live demo supplier messages |
| `OTTO_ENGINE_URL` | Otto Engine | No | — | Distributed engine deployment |
| `OTTO_ENGINE_KEY` | Otto Engine | No | — | Authenticating with engine |
| `PORT` | Application | No | `3000` | Custom port binding |
| `OTTO_URL` | Application | No | — | Absolute URLs in messages/webhooks |
