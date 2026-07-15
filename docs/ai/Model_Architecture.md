# Model Architecture

## Multi-Model Routing Strategy
Otto avoids dependency on a single model provider by using **OpenRouter** as a unified API.

- **Primary Model**: `openai/gpt-4o` handles complex multimodal tasks, batch vision extraction (invoices, ledgers), and entity resolution.
- **Fallback Model**: `google/gemini-2.0-flash-001` provides a resilient fallback for API outages or rate limits.

## Zod-Locked Structured Output
To guarantee schema adherence, Otto utilizes **Zod** to define expected output structures. These schemas are converted to JSON Schema (`zod-to-json-schema`) and sent to the model with `strict: true`. The model is physically constrained to return fields within this schema, practically eliminating output parsing errors and injection vulnerabilities.

## Deterministic Execution & Caching
Every LLM call in Otto is fronted by a robust caching layer:
- **SHA-256 Input Hash**: The cache key is derived from the model, task type, image buffer, and text.
- **Offline Reliability**: The cache ensures that once an extraction is run, subsequent executions are instant and fully deterministic, which is critical for resilient demonstrations and idempotent workflows.
- **Mock Mode**: A development feature (`EXTRACTOR_MODE=mock`) allows the system to run keyless using pre-defined fixture responses.
