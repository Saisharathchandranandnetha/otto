# Technical Report

## 1. Introduction
This report outlines the technical implementation details for Otto, a Next.js 14 application providing AI automation capabilities for small businesses.

## 2. Tech Stack Overview
- **Framework**: Next.js 14 (App Router) with strict TypeScript.
- **Database**: Postgres 16 accessed via `postgres.js`. No ORM is used to maintain raw SQL control and performance.
- **AI Models**: OpenRouter API utilizing GPT-4o as the primary model and Gemini 2.x as a fallback.
- **Schema Validation**: Zod is used for runtime schema validation on all AI boundaries.
- **External Integrations**: Twilio API for WhatsApp communication, custom PO PDF generation.
- **State Management & Data Flow**: Server-Sent Events (SSE) for real-time feed updates.

## 3. Database Schema
The system relies on a relational model consisting of 9 primary tables:
- `products`, `suppliers`, `customers`, `invoices`, `ledger`
- `actions`, `agent_events`, `trust_grants`, `documents`
Database migrations are managed via custom scripts (`tsx scripts/migrate.ts`).

## 4. AI Integration & Extraction
- **Prompt Engineering**: Separates instruction from data.
- **Extraction Caching**: Implements a SHA-256 input-hash caching mechanism on the filesystem. This guarantees deterministic behavior for demos (`pnpm cache:warm`).
- **Data Integrity**: The AI model is strictly bound to return data matching a Zod schema passed as JSON Schema, ensuring structured and predictable outputs.

## 5. Security & Reliability
- **Idempotency**: Approval state changes are executed as idempotent transactions.
- **Fail-Safes**: All autonomous actions are capped, logged, and reversible within a 1-hour window. Actions can be revoked with a single toggle.
