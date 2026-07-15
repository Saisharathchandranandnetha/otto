# RAG Pipeline

## Context Injection & Inference
While the MVP of Otto relies heavily on deterministic batch extraction and relational data for context, its "inference pass" operates similarly to a RAG (Retrieval-Augmented Generation) pipeline.

1. **Information Extraction**: Raw unstructured documents (invoices, ledgers, WhatsApp chats) are first extracted into structured JSON.
2. **Context Retrieval**: When staging an action (e.g., `reorder` or `support_response`), the agent queries PostgreSQL to retrieve relevant historical data (e.g., price history, past invoices, related entities).
3. **Prompt Augmentation**: The retrieved relational data and the new structured extraction are fed into the context window for final reasoning. 

This hybrid approach guarantees that the LLM's decisions are grounded in the concrete, relational history of the business rather than relying on fuzzy semantic search alone.
