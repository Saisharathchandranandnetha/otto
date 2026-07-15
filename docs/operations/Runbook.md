# Runbook

## Environment Setup
Follow these steps to bring up Otto from scratch:

1. **Install Dependencies:**
   ```bash
   pnpm approve-builds esbuild # Required first time
   pnpm install
   ```

2. **Start Database & Migrate:**
   ```bash
   pnpm db:up
   pnpm db:migrate
   ```

3. **Seed Database:**
   ```bash
   pnpm db:seed
   ```

4. **Start Application:**
   ```bash
   pnpm dev
   ```
   *Note: Works keyless if `EXTRACTOR_MODE=mock` in `.env`.*

## Routine Operations

### Running E2E Flows
Validate core functionality using built-in flows:
```bash
pnpm flow 0   # Basic end-to-end
pnpm flow A   # Standard Flow A
pnpm flow B   # Graduation, auto-execute, undo, and revoke
pnpm flow all # Run all flows
```

### Pre-warming the Cache
If preparing for an offline demo or ensuring zero latency for predefined data:
```bash
pnpm cache:warm
```

### Resetting Demo Data
```bash
pnpm demo:reset
```
