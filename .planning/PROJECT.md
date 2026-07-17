# Project: Otto — The Autonomous AI Operator

## Overview
Otto is an autonomous AI operator designed for small businesses in India (boutiques, kirana shops, clinics) that currently run on paper. It eliminates manual data entry by extracting information from photos of handwritten invoices, ledgers, and WhatsApp chats. It then acts autonomously (based on an earned-trust model) to manage inventory, track dues, reorder stock, and communicate with suppliers. 

The platform has recently expanded to include an Education Dashboard and is scaling out to 7 total industry domains (Manufacturing, Healthcare, Customer Support, Retail, Sales, Legal, Education) with a unified SSO Authentication System, Multi-Domain RBAC, and integration with a headless n8n + Telegram + Dify architecture.

## Target Audience
Small business owners who lack the time or digital literacy to manually enter data into traditional ERP software (e.g., Tally, Zoho), but need automated inventory management, financial tracking, and supplier communications.

## Core Features
- **Zero-Typing Digital Onboarding:** Batch Vision Extraction (via GPT-4o) from photos of documents and WhatsApp exports to build the business digital footprint.
- **Entity Resolution & Inference:** Automatically merges duplicate supplier/customer names and computes reorder points, stock estimates, and dues purely in TypeScript.
- **The Autonomy Ladder (Earned Trust):** Actions start as human-gated (requiring explicit approval). After sufficient human approvals, Otto graduates to autonomous execution with a configurable cap and a 1-hour undo window.
- **Multi-Domain RBAC & SSO:** Centralized JWT-based SSO authentication with Role-Based Access Control mapping users to specific industry domains (Viewer, Operator, Manager, Admin).
- **Headless Workflow Orchestration:** Deep integration with a self-hosted n8n instance and Dify AI for handling complex external automations and Telegram bot communications.

## Technical Stack
- **Frontend & API:** Next.js 14 (App Router), TypeScript (strict), Tailwind CSS
- **Backend Services:** n8n (Dockerized, headless workflow orchestration), Dify AI, Twilio (WhatsApp API)
- **Database:** PostgreSQL 16 (with pgvector) via `postgres.js` (no ORM)
- **LLM Layer:** OpenRouter (GPT-4o primary, Gemini 2.0 Flash fallback), Zod (schema validation)

## Success Criteria
- Seamless, zero-typing onboarding of a business from unstructured images in under 3 minutes.
- Successful autonomous execution of routine actions (e.g., PO generation, WhatsApp messaging) without human intervention after the trust threshold is met.
- Secure, token-based SSO mediation between the Otto dashboard and the headless n8n instance.
- Fully functional multi-domain RBAC allowing cross-industry operations from a unified admin center.
