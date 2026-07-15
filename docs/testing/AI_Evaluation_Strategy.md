# AI Evaluation Strategy

## Scope
Otto relies heavily on LLM extraction (GPT-4o / Gemini). To ensure high reliability, we treat AI prompts and extraction logic like standard code, measuring it against ground truth.

## Evaluation Mechanism (`pnpm eval`)
Otto uses a custom evaluation script (`scripts/eval.ts`) to measure extraction accuracy.

1. **Fixtures:** 
   - Located in `fixtures/shoebox/`.
   - Contains raw inputs (invoices, ledgers) and `.expected.json` files representing perfect extraction data.
2. **Execution:**
   - Running `pnpm eval` processes the fixtures through the LLM pipeline and compares the output strictly to `.expected.json`.
3. **Metrics:**
   - Field-level accuracy: What percentage of Zod schema fields matched exactly?
   - Hallucination rate: Did the model return keys or data not present in the document?
4. **Cache Integrity:**
   - The SHA-256 cache ensures that evaluation can be re-run instantly against previous outputs without incurring LLM costs, isolating extraction logic changes from prompt changes.

## CI Integration
`pnpm eval` must pass above a defined threshold (e.g., 95% accuracy) before any prompt changes are merged into the main branch.
