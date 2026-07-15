# Evaluation Metrics

## Deterministic Evaluation
Otto rejects vanity metrics in favor of strict, deterministic evaluation against ground-truth data. 

### The `pnpm eval` Suite
The project includes an evaluation script (`pnpm eval`) that measures the AI's extraction accuracy.

1. **Fixture Data**: The system contains a "Shoebox Kit" (`fixtures/shoebox/`) consisting of invoices, ledgers, and chats.
2. **Ground Truth**: Each file has a corresponding `.expected.json` file representing perfect extraction.
3. **Evaluation Process**: The eval script runs the models against the fixtures and strictly diffs the extracted JSON against the expected JSON. 

This approach ensures that any prompt tweak or model swap can be quantitatively evaluated for regressions across the entire test suite.
