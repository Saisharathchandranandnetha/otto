# Configuration Guide

## Overview
This document covers the high-level configuration of the Otto application outside of environment variables, specifically focusing on framework and tooling setups.

## Next.js Configuration (`next.config.mjs`)
The `next.config.mjs` file handles Next.js specific overrides. It should be kept minimal.
- **Server Components**: App router is enabled by default in Next.js 14.
- **Image Domains**: Ensure external domains for avatars or uploaded documents are whitelisted if `next/image` is utilized.

## Tailwind CSS (`tailwind.config.ts`)
The styling configuration defines the design system:
- **Theme**: Dark theme configuration.
- **Colors**: Amber accent colors utilized throughout the UI to indicate action and status.
- **Fonts**: Integration of `JetBrains Mono` and other sans-serif stacks.
- **Content Paths**: Scans `src/app`, `src/components`, and other relevant directories for class names.

## TypeScript Configuration (`tsconfig.json`)
- **Strict Mode**: Enabled to enforce strong typing.
- **Paths**: Path aliases (e.g., `@/*` mapping to `src/*`) should be defined here for cleaner imports.

## Database Migrations
Migrations are handled via custom TypeScript scripts rather than an ORM CLI.
- Run migrations using: `pnpm db:migrate`
- Schema changes should be saved as sequential SQL files in `db/migrations/` (e.g., `002_add_users.sql`).

## Dependency Manager (`package.json` & `pnpm-workspace.yaml`)
- The project strictly uses `pnpm`. Avoid `npm` or `yarn` to prevent lockfile conflicts.
- `esbuild` is required as a build-time dependency and is approved in `pnpm` configurations.
