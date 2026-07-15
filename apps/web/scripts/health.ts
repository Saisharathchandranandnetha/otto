// Health check for production deployments.
// Usage: pnpm health   (or docker HEALTHCHECK CMD pnpm health)
import { sql } from '../src/lib/db';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

async function main() {
  const errors: string[] = [];

  // 1. Database reachable
  try {
    const [r] = await sql`select 1 as ok`;
    if (!r?.ok) errors.push('DB: no response');
  } catch (e) {
    errors.push(`DB: ${e instanceof Error ? e.message : e}`);
  }

  // 2. OpenRouter reachable (if live mode)
  if ((process.env.EXTRACTOR_MODE ?? 'mock') === 'live') {
    if (!process.env.OPENROUTER_API_KEY) errors.push('LLM: EXTRACTOR_MODE=live but no OPENROUTER_API_KEY');
    else {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/models', {
          headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) errors.push(`LLM: OpenRouter returned ${res.status}`);
      } catch {
        errors.push('LLM: OpenRouter unreachable');
      }
    }
  }

  // 3. Cache dir writable
  const cacheDir = process.env.LLM_CACHE_DIR ?? './data/llm-cache';
  try { require('node:fs').writeFileSync(cacheDir + '/.health', 'ok'); } catch {
    errors.push(`Cache: ${cacheDir} not writable`);
  }

  // 4. Node version
  const major = Number(process.version.slice(1).split('.')[0] ?? '0');
  if (major < 18) errors.push(`Node: ${process.version} (need >=18)`);

  await sql.end();

  if (errors.length > 0) {
    console.error('HEALTH FAIL:\n  ' + errors.join('\n  '));
    process.exit(1);
  }
  console.log('HEALTH OK');
}

main();
