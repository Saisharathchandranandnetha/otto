// Deterministic mock extractor. Routes by fixture sidecar: for an uploaded file
// named X.svg/X.jpg/X.txt, the expected output lives at fixtures/**/X.expected.json.
// Enables keyless development, the `pnpm flow` gate runners, and CI.
import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { ExtractInput } from './extractor';

const FIXTURE_DIRS = ['fixtures/shoebox', 'fixtures/demo'];

export async function mockExtract(input: ExtractInput): Promise<unknown> {
  // entity resolution: single canonical fixture (input is dynamic, output is stable)
  if (input.task === 'entity_resolution') {
    return readJson(join('fixtures/shoebox', 'entity-resolution.expected.json'));
  }

  if (!input.hint) throw new Error(`mock extractor needs a filename hint for task "${input.task}"`);
  const base = basename(input.hint).replace(/\.(svg|jpg|jpeg|png|txt)$/i, '');

  for (const dir of FIXTURE_DIRS) {
    const candidate = join(dir, `${base}.expected.json`);
    if (existsSync(candidate)) return readJson(candidate);
  }
  throw new Error(
    `no mock fixture for "${base}" (task ${input.task}) — add ${base}.expected.json to fixtures/, or set EXTRACTOR_MODE=live`,
  );
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'));
}
