# Product Requirements Document (PRD)

## 1. Executive Summary

**Product Name:** Otto  
**Target Launch:** TakeOver'26 Hackathon  
**Themes Addressed:** Theme 2 (AI Automation & Intelligent Agents) and Theme 7 (Analytics & Decision Intelligence)  

Otto is a production-grade backend and frontend platform designed to automate operations for small-to-medium businesses (SMBs). It solves the cold-start problem of SMB software adoption by utilizing Vision LLMs to reconstruct a digital business from a "shoebox" of physical documents (invoices, ledgers, WhatsApp exports). Once onboarded, Otto acts as an autonomous AI employee, detecting low stock, generating purchase orders, and communicating with suppliers via WhatsApp. All actions are strictly governed by an earned-trust model ("The Autonomy Ladder") that requires human approval before granting capped autonomous execution.

## 2. Product Overview

The core objective of Otto is to bridge the gap between chaotic, offline data and structured ERP systems without requiring the user to perform manual data entry.

### Core Value Pillars
1. **Zero-Typing Onboarding:** Installs the entire business backend from photos in 3 minutes.
2. **State-Aware & Transactional:** Uses a hand-rolled, durable state machine in PostgreSQL for execution.
3. **Safe Autonomy:** AI actions are human-gated until trust is earned, with strict idempotency and schema locks.

## 3. Detailed Functional Requirements

### 3.1 Flow 0: The Resurrection (Onboarding)
- **Document Ingestion:** The system must accept uploads of unstructured images (invoices, ledger pages) and text (WhatsApp exports).
- **Batch Extraction:** Each document must be processed through an LLM (OpenRouter/GPT-4o) bounded by a strict Zod JSON Schema (`InvoiceExtraction`, `LedgerPageExtraction`, `WhatsAppExtraction`).
- **Confidence Scoring:** The LLM must self-score confidence for every extracted leaf field. Fields scoring < 0.75 must be visually highlighted in the UI for review.
- **Entity Resolution:** The system must run a secondary LLM pass over all extracted names to merge aliases (e.g., "Sharma Fab" and "Sharma Fabrics") into canonical entities with supporting evidence.
- **Deterministic Inference:** The system must use pure TypeScript to calculate reorder points (based on a 14-day coverage target), stock estimates, and customer dues from the extracted history.
- **Live Narration (SSE):** The system must stream Server-Sent Events (SSE) to narrate the AI's thought process to the UI in real-time.
- **Atomic Commit:** The entire reconstructed business must be staged. No data touches the live tables until the user confirms. The final commit must be an atomic transaction across the products, suppliers, customers, and ledger tables.

### 3.2 Flow A: Invoice Commit & Triggers
- **Manual Adjustments:** Users can manually upload a new invoice.
- **Inventory Mutation:** Committing an invoice must update the stock quantities in the `products` table.
- **Event-Driven Triggers:** Any stock mutation must trigger a scan of the inventory.
- **Consequence Analysis (Theme 7):** If a product's stock falls at or below its reorder point, the trigger engine must calculate the days until stockout and the financial impact on the monthly budget.
- **Action Drafting:** The system must draft a `reorder` action and route it to the Approval Gate.

### 3.3 Flow B: The Autonomy Ladder & Execution
- **The Approval Gate:** A drafted action must only reach the `approved` state via (1) a human API call or (2) an active trust grant.
- **Human Gating:** Actions default to `awaiting_approval`, presenting a card in the feed with reasoning, evidence, and consequence analysis.
- **Trust Increments:** Human approvals must increment the `approvals_count` in the `trust_grants` table for that action type.
- **Graduation Offer:** At 3 approvals, the system must surface a `graduation_offer` card, allowing the user to set a financial cap (default ₹10,000) for autonomous execution.
- **Autonomous Execution:** If an active grant exists and the action amount is under the cap, the system must auto-approve and execute the side-effects.
- **Side-Effects (Executors):** The reorder executor must generate a dynamic HTML Purchase Order (PO), store it, and send a Twilio WhatsApp message to the supplier.
- **Revocation & Undo:** The user must be able to revoke a trust grant with a single toggle. Executed autonomous actions must provide a 1-hour undo window, triggering compensating actions (e.g., a WhatsApp cancellation message).

### 3.4 Domain Engine (Theme 2)
- **Multi-Industry Support:** The system must include 8 hardcoded MVP playbooks covering Education, Healthcare, HR, Legal, Manufacturing, Sales, Customer Support, and Retail.
- **Connector-Ready Packets:** Executing a domain action must stage a fully prepared data packet (workflow steps, draft output, impact analysis) ready for external execution, utilizing the same core machine and trust gate.

## 4. Non-Functional Requirements (NFRs)

- **Idempotency:** The core state machine transition (`UPDATE actions SET status = $to WHERE id = $id AND status = $from`) must guarantee that double-taps, SSE replays, and concurrent webhook fires cannot double-execute a financial action.
- **Prompt Injection Defense:** The LLM boundary must use Zod-to-JSON-Schema with `strict: true`. Instructions and untrusted data must be strictly separated.
- **Durability:** The agent loop must live entirely in PostgreSQL. No long-running orchestrators (LangGraph/Temporal) that can drop state on restart.
- **Reproducibility:** All LLM calls must be cached locally by the SHA-256 hash of their inputs, enabling a 100% deterministic, offline-safe demo.
- **Performance:** SSE must be used for real-time UI updates instead of WebSockets to simplify deployment and connection management.

## 5. User Stories & Acceptance Criteria

### US1: The Shoebox Upload
**As a** boutique owner, **I want to** upload a batch of my handwritten invoices and ledgers **so that** the software can build my inventory without me typing.
- **AC1:** System accepts multiple images and a text file.
- **AC2:** System extracts data with >90% adherence to schema.
- **AC3:** UI updates in real-time with narration.
- **AC4:** Data is only committed upon explicit user confirmation.

### US2: Earning Trust
**As a** business owner, **I want to** review and approve the AI's reorder suggestions **so that** I don't lose control of my cash flow.
- **AC1:** Low stock triggers a card in the feed.
- **AC2:** Card displays consequence analysis (days until stockout).
- **AC3:** Approving the card generates a PO and sends a WhatsApp message.
- **AC4:** Approving 3 identical actions triggers the graduation offer.

### US3: Safe Autonomy
**As a** business owner, **I want to** grant the AI a budget to handle routine reorders automatically, **but** be able to undo mistakes.
- **AC1:** Accepting the graduation offer sets a financial cap.
- **AC2:** Future reorders under the cap execute silently.
- **AC3:** A 1-hour undo window is available.
- **AC4:** Clicking Undo sends a cancellation WhatsApp message and reverses the action state.

## 6. Risks and Assumptions

- **Risk:** Vision LLM OCR accuracy on poor handwriting.
  - **Mitigation:** Fallback to Gemini 2.0 Flash; per-field confidence scoring forces human review on low-confidence reads.
- **Assumption:** Suppliers use WhatsApp for business orders in India.
  - **Validation:** Widespread industry standard; integration built via Twilio.
- **Risk:** LLM Hallucinations causing incorrect financial transactions.
  - **Mitigation:** Strict Zod schema enforcement; no generic text generation is permitted to mutate the database directly.
