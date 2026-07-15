// Input-hash LLM cache. Key = SHA-256(model + task + input bytes). A warmed cache
// makes the stage demo instant, deterministic, and immune to dead wifi/API outages.
// Warm it with `pnpm cache:warm` against the exact demo inputs.
import { createHash } from 'node:crypto';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getEnv } from '@/lib/env';

const env = getEnv();

export function cacheKey(parts: (string | Buffer)[]): string {
  const h = createHash('sha256');
  for (const p of parts) h.update(p);
  return h.digest('hex');
}

export function cacheGet<T>(key: string): T | null {
  const dir = env.LLM_CACHE_DIR ?? './data/llm-cache';
  const file = join(dir, `${key}.json`);
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as T;
  } catch {
    return null;
  }
}

export function cacheSet(key: string, value: unknown): void {
  const dir = env.LLM_CACHE_DIR ?? './data/llm-cache';
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${key}.json`), JSON.stringify(value, null, 2));
}
