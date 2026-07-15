# Prompt Engineering Guide

## Instruction & Data Separation
To prevent prompt injection and ensure clear boundaries, Otto strictly separates system instructions from untrusted user data (like WhatsApp messages or OCR text).
- **System Prompt**: Defines the persona, task, and rules.
- **User Prompt**: Contains the untrusted data, wrapped in distinct delimiters (e.g., `UNTRUSTED_OPEN` and `UNTRUSTED_CLOSE`).

## Leaf-Level Confidence Scoring
Prompts instruct the model to self-score its confidence for **every single leaf field** in the extraction schema. 
- Schema fields are wrapped in a generic `ConfidentField` structure: `{ value: T, confidence: number }`.
- The model must assign a float between 0 and 1 representing its confidence in the extracted value.

## Deterministic JSON Schema Prompting
Instead of relying on prompt engineering alone to format JSON, Otto relies on OpenRouter's `response_format` with `type: 'json_schema'`.
- The Zod schema dictates the shape.
- The prompt simply sets the context and provides the domain-specific extraction rules, leaving structural enforcement to the API layer.
