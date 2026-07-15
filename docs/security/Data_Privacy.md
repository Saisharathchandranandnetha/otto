# Data Privacy

## 1. Data Collection & Usage
- Otto ingests sensitive business data: ledger pages, WhatsApp chats, invoices, and customer lists.
- This data is exclusively used for entity resolution, inference, and workflow automation.

## 2. LLM Data Privacy
- **Zero Retention Policies:** When interfacing with OpenRouter (GPT-4o, Gemini), Otto relies on provider agreements that ensure business data passed via API is **not** used to train the provider's foundational models.

## 3. Data Retention & Deletion
- **Ephemeral Processing:** Uploaded artifacts (like the Shoebox Kit images) should ideally be retained only as long as necessary for verification, unless explicitly archived by the user.
- **Tenant Deletion:** The system must support hard deletion of a tenant's data (products, customers, actions, invoices) upon request to comply with GDPR/CCPA.

## 4. PII Handling
- Personally Identifiable Information (PII) from WhatsApp exports and invoices is processed purely for workflow execution. PII logging in application logs must be strictly avoided.
