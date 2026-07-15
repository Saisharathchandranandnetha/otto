# Non-functional Requirements

1. **Performance & Latency:**
   - The UI must remain responsive during the file upload and extraction phase.
   - LLM extraction must be aggressively cached (SHA-256 input hash) to ensure deterministic offline demos and fast reload times.
   - The Approval Feed must load in under 1 second.

2. **Security & Data Integrity:**
   - LLM outputs must be strictly validated against Zod schemas; any hallucinated fields or structural deviations must be rejected or retried.
   - Database operations (approvals) must be idempotent to prevent duplicate executions resulting from network retries or double-clicks.
   - Sensitive data (invoices, ledgers) must be stored securely.

3. **Reliability:**
   - The system must gracefully degrade if the primary LLM (GPT-4o) fails, falling back to a secondary provider (Gemini 2.x).
   - The offline deterministic fallback must function perfectly for demonstrations without an internet connection.

4. **Usability & Design:**
   - The application must utilize a dark theme with amber accents (Tailwind CSS) and JetBrains Mono typography for a distinct, terminal-like but modern aesthetic.
   - The interface must be simple enough for a non-technical small business owner to navigate without a manual.
