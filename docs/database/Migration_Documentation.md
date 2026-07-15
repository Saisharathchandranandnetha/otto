# Migration Documentation

The Otto schema has evolved through a series of incremental, domain-focused migrations.

## `001_init.sql`
- **Purpose**: Establishes the core foundations of the application, including Document Processing, Financial Entities (Ledger, Products, Invoices, Suppliers, Customers), and the Agent Architecture (Actions, Events, Trust Grants).
- **Key Features**:
  - Idempotent action approvals via state machine constraints.
  - Append-only audit trail via `agent_events`.
  - Provenance tracking via `source_doc_id` on entities.

## `002_i18n.sql`
- **Purpose**: Adds internationalization support to enhance communications.
- **Key Features**:
  - Adds `source_language` to `documents` to track document origin language.
  - Adds `preferred_language` to `customers` and `suppliers` to personalize automated communication (e.g. WhatsApp reminders).

## `003_education.sql`
- **Purpose**: Introduces the Education Module using `pgvector` for RAG implementations.
- **Key Features**:
  - Enables the `vector` extension.
  - Adds `knowledge_documents` with 1536-dimensional embeddings for semantic search.
  - Adds `conversations`, `generated_documents`, and `recommendations` tables.
  - Modifies `actions_type_check` to include education-specific capabilities (`admission_processing`, `attendance_report`).

## `004_theme2_domain_engine.sql`
- **Purpose**: Broadens the action capabilities for "Theme 2" cross-domain operations.
- **Key Features**:
  - Drops and recreates the `actions_type_check` constraint to support a large suite of generic AI tasks (e.g., `workflow_approval`, `document_generation`, `support_response`, `knowledge_answer`, `personalization_plan`).
