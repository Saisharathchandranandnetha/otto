# Coding Standards

## 1. Core Principles
- **Clarity over cleverness**: Code should be readable and easily understandable by new team members.
- **Strict Typing**: Leverage TypeScript's strict mode. Avoid `any` wherever possible.
- **Fail Fast**: Validate inputs at the boundaries (using Zod) and error out early rather than passing invalid state deeper.

## 2. TypeScript & Zod
- All API inputs, LLM outputs, and DB results should be typed and validated using `zod`.
- Use interfaces for object shapes and types for unions/intersections.
- File names for React components should use PascalCase (e.g., `ApprovalCard.tsx`), whereas utilities and logic files should use kebab-case (e.g., `agent-machine.ts`).

## 3. Database Interactions
- Otto avoids heavy ORMs. Use the `postgres` library with tagged template literals (e.g., `sql\`SELECT * FROM users\``).
- Ensure all queries are protected against SQL injection by using the tagged template literal system correctly.
- Put data access logic in designated files (e.g., inside `src/lib/db.ts` or repository classes), not inline in API routes.

## 4. UI & React
- Use **Next.js App Router** conventions. Server Components by default, Client Components (`"use client"`) only when interactivity or hooks are required.
- **Styling**: Use Tailwind CSS exclusively. Avoid inline styles or custom CSS files unless strictly necessary for complex animations.
- Maintain a consistent dark theme with the established amber accent colors.

## 5. Agent & LLM Logic
- Isolate LLM logic in `src/agent/` and `src/extract/`.
- Ensure all prompts are separate from the execution logic where possible.
- Implement idempotency and safe retries for all agent tasks.

## 6. Formatting & Linting
- Use ESLint and Prettier for code formatting. (Configurations to be respected as per standard Next.js setups).
- Ensure `pnpm typecheck` passes without errors before committing.
