// The extractor: one entry point for every LLM call in Otto.
//   * OpenRouter — primary model with fallback behind the same interface.
//   * Zod-locked structured output (json_schema derived from the Zod schema).
//   * Instruction/data separation (see prompts.ts).
//   * Input-hash cache in front of every call → deterministic, offline-safe demo.
//   * EXTRACTOR_MODE=mock → fixture responses (keyless dev + CI + last-resort fallback).
import type { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { getEnv } from '@/lib/env';
import { cacheGet, cacheKey, cacheSet } from './cache';
import { PROMPTS, UNTRUSTED_OPEN, UNTRUSTED_CLOSE } from './prompts';

export interface ExtractInput {
  task: 'invoice' | 'ledger_page' | 'whatsapp_export' | 'entity_resolution';
  image?: Buffer;
  text?: string;
  hint?: string;
}

export interface ExtractResult<T> {
  data: T;
  fromCache: boolean;
  model: string;
}

const TIMEOUT_MS = 30_000;

export async function extract<S extends z.ZodTypeAny>(
  input: ExtractInput,
  schema: S,
): Promise<ExtractResult<z.infer<S>>> {
  const env = getEnv();
  const mode = env.EXTRACTOR_MODE;
  const primary = env.EXTRACTOR_MODEL ?? 'openai/gpt-4o';
  const fallback = env.EXTRACTOR_FALLBACK_MODEL ?? 'google/gemini-2.0-flash-001';

  const key = cacheKey([
    mode === 'mock' ? 'mock' : primary,
    input.task,
    input.image ?? '',
    input.text ?? '',
  ]);

  const cached = cacheGet<unknown>(key);
  if (cached !== null) {
    return { data: schema.parse(cached), fromCache: true, model: 'cache' };
  }

  if (mode === 'mock') {
    const { mockExtract } = await import('./mock');
    const data = schema.parse(await mockExtract(input));
    cacheSet(key, data);
    return { data, fromCache: false, model: 'mock' };
  }

  let lastErr: unknown;
  for (const model of [primary, fallback]) {
    try {
      const raw = await callOpenRouter(model, input);
      const data = schema.parse(raw);
      cacheSet(key, data);
      return { data, fromCache: false, model };
    } catch (err) {
      lastErr = err;
    }
  }
  throw new Error(
    `Extraction failed on both models: ${
      lastErr instanceof Error ? lastErr.message : String(lastErr)
    }`,
  );

  async function callOpenRouter(model: string, inp: ExtractInput): Promise<unknown> {
    const env = getEnv();
    const content: unknown[] = [];
    if (inp.text) {
      content.push({
        type: 'text',
        text: `${UNTRUSTED_OPEN}\n${inp.text}\n${UNTRUSTED_CLOSE}`,
      });
    }
    if (inp.image) {
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${inp.image.toString('base64')}`,
        },
      });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0,
          messages: [
            { role: 'system', content: PROMPTS[inp.task] },
            { role: 'user', content },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: `otto_${inp.task}`,
              strict: true,
              schema: zodToJsonSchema(schema, { $refStrategy: 'none' }),
            },
          },
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`${model} → HTTP ${res.status}: ${body.slice(0, 300)}`);
      }
      const body = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      return JSON.parse(body.choices[0]!.message.content);
    } finally {
      clearTimeout(timer);
    }
  }
}
