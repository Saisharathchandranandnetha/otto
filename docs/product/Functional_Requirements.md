# Functional Requirements

## 1. Data Ingestion & Extraction (The Resurrection)
- The system shall allow users to upload multiple image files (JPG, PNG) and text files (WhatsApp chat exports).
- The system shall process uploaded files through a vision LLM to extract entities (e.g., invoices, line items, supplier details, ledger entries).
- The system shall enforce data structure using Zod schemas before persisting to the database.
- The system shall present a unified "Live Narrated Build" UI showing the extraction progress and require a final user confirmation to save the state.

## 2. Approval Feed & Actions
- The system shall generate action cards (e.g., "Reorder 50x Shirts") in a dark-themed Approval Feed.
- The system shall allow the user to Approve or Reject action cards.
- The system shall track the number of consecutive approvals per action type.
- The system shall prompt the user to enable autonomous execution for an action type upon reaching 3 consecutive approvals.

## 3. Autonomous Execution & Safety
- The system shall execute approved autonomous actions without user intervention.
- The system shall provide a UI toggle to instantly revoke autonomy for any action type.
- The system shall implement a 1-hour delay on irreversible external actions (e.g., sending a purchase order via WhatsApp).
- The system shall allow users to "Undo" an action within the 1-hour window.
- The system shall allow users to set hard limits (caps) on autonomous actions (e.g., maximum spend).

## 4. Domain Playbooks
- The system shall provide a dashboard to select and stage workflows for domains: Education, Healthcare, HR, Legal, Manufacturing, Sales, Customer Support, Retail.
- The system shall support action families including `workflow_approval`, `document_generation`, `support_response`, `knowledge_answer`, and `personalization_plan`.
