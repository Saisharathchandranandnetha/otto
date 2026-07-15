# Hallucination Mitigation Strategy

## Multi-Layered Defense
Otto employs several strategies to mitigate LLM hallucinations and ensure data integrity.

1. **Schema Locking (Zod)**
   By forcing the model to adhere to a strict JSON Schema generated from Zod, structural hallucinations (inventing new fields, returning invalid types) are eradicated at the API boundary.

2. **Instruction & Data Separation**
   Untrusted input data is wrapped in delimiters (`UNTRUSTED_OPEN`, `UNTRUSTED_CLOSE`). The model is instructed to only extract information explicitly present within these bounds, reducing the chance of it blending external knowledge with the input data.

3. **Self-Reported Confidence Scores**
   The model evaluates its own certainty for every leaf node in the schema (e.g., `{ value: "₹500", confidence: 0.9 }`).
   The `needsReview()` function scans these scores. If any single field drops below a conservative threshold (0.75), the entire document is flagged, requiring human intervention.

4. **Deterministic Fallbacks**
   If the primary model fails or produces invalid JSON despite the strict schema, the request falls back to a secondary model. The SHA-256 caching layer ensures that once a valid, accurate response is generated, it is permanently locked in for identical inputs.
