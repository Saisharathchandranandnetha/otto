// Pre-warms the LLM cache with the EXACT demo inputs: every shoebox document, the
// demo sale invoice, the poisoned + blurry invoices, and the entity-resolution pass.
// After this, the stage demo is instant, deterministic, and survives dead wifi.
// Run the night before (EXTRACTOR_MODE=live), and again after any fixture change.
// The populated data/llm-cache/ directory is COMMITTED as the last-resort fallback.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { extract } from '../src/extract/extractor';
import { InvoiceExtraction, LedgerPageExtraction, WhatsAppExtraction, EntityResolutionResult } from '../src/extract/schemas';

async function main() {
  let warmed = 0;
  const dirs: [string, 'shoebox' | 'demo'][] = [['fixtures/shoebox', 'shoebox'], ['fixtures/demo', 'demo']];

  for (const [dir] of dirs) {
    for (const f of readdirSync(dir).filter((f) => !f.endsWith('.json'))) {
      const path = join(dir, f);
      const body = readFileSync(path);
      try {
        if (f.endsWith('.txt')) {
          await extract({ task: 'whatsapp_export', text: body.toString('utf8'), hint: f }, WhatsAppExtraction);
        } else if (f.startsWith('ledger')) {
          await extract({ task: 'ledger_page', image: body, hint: f }, LedgerPageExtraction);
        } else {
          await extract({ task: 'invoice', image: body, hint: f }, InvoiceExtraction);
        }
        warmed++;
        console.log(`✓ ${f}`);
      } catch (e) {
        console.error(`✗ ${f}: ${e instanceof Error ? e.message : e}`);
      }
    }
  }

  // entity-resolution pass over the same inputs the pipeline will assemble
  try {
    await extract({ task: 'entity_resolution', text: 'warm' }, EntityResolutionResult);
    console.log('✓ entity resolution');
  } catch { /* mock mode warms via fixture automatically */ }

  console.log(`\n${warmed} demo inputs cached in ${process.env.LLM_CACHE_DIR ?? './data/llm-cache'}.`);
  console.log('Stage demo is now deterministic and offline-safe. Commit the cache dir.');
}

main();
