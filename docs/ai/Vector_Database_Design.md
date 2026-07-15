# Vector Database Design

## Semantic Search & Entity Resolution
In the MVP architecture, Otto utilizes PostgreSQL (and Supabase) for all state management. While a dedicated Vector Database (like Pinecone or Milvus) is not strictly required for the core deterministic workflows, the architecture is designed to accommodate vector extensions (e.g., `pgvector`) in the future for specific use cases.

### Intended Use Cases for Vectors
1. **Fuzzy Entity Resolution**: Matching unstructured names ("Priya's Fashion" vs "Priya Fashion Store") currently uses LLM-based entity resolution. As the dataset scales, this can be optimized by generating embeddings for entity names and using vector cosine similarity to pre-filter candidates.
2. **Knowledge Base Q&A**: For the `knowledge_answer` workflow (policy-backed answers), documents can be chunked, embedded, and stored in a `pgvector` enabled table to power standard semantic search.
