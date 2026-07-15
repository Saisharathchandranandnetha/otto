# Dependency Analysis

## Overview
Otto is built on modern web technologies, prioritizing lightweight and strict integration points. The package manager used is **pnpm**.

## Core Dependencies

### Frontend & React
- **`next` (^14.2.15)**: The core framework for both the frontend UI (App Router) and backend API routes.
- **`react`, `react-dom` (^18.3.1)**: Underlying UI library.
- **`@xyflow/react` (^12.11.2)**: For rendering flow-based UI elements and node graphs.

### AI & LLM Integration
- **`ai` (^7.0.16)**: Vercel AI SDK for standardized streaming and tool execution.
- **`@ai-sdk/groq` (^4.0.5)**: Groq provider for Vercel AI SDK.
- *OpenRouter* is utilized heavily in code, handled likely via native fetch or OpenAI-compatible adapters within the AI SDK.

### Database & Background Jobs
- **`postgres` (^3.4.4)**: Lightweight, high-performance PostgreSQL client (no ORM used).
- **`pg-boss` (^12.25.1)**: PostgreSQL-backed background job queue for async processing.

### Data Validation
- **`zod` (^3.23.8)**: Used for runtime validation of LLM outputs and API endpoints.
- **`zod-to-json-schema` (^3.23.2)**: Converts Zod schemas to JSON Schemas for strict LLM generation.

### Integrations
- **`twilio` (^5.3.0)**: Used for WhatsApp messaging capabilities.

## Development Dependencies
- **TypeScript (`typescript` ^5.5.3, `tsx` ^4.16.0)**: Static typing and fast execution of TypeScript files.
- **Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`)**: Utility-first styling framework.

## Engine Requirements
- **Node.js**: `>=18.17.0` is required for compatibility with Next.js 14 and newer JS features.
