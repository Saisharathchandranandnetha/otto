# Build Process

## Overview
Otto is built on top of Next.js 14 and utilizes `pnpm` as the package manager. The build process packages the application for production deployment.

## Prerequisites
- **Node.js**: `>= 18.17.0`
- **pnpm**: Installed globally (`npm install -g pnpm`)

## Initial Setup
If it is the first time running the project, you may need to approve build scripts:
```bash
pnpm approve-builds esbuild
pnpm install
```

## Local Development Build
To start the Next.js development server with hot-reloading:
```bash
pnpm dev
```
*Note: Ensure your local database is running (`pnpm db:up`) and migrated (`pnpm db:migrate`) before starting the dev server.*

## Production Build
To create an optimized production build:
```bash
pnpm build
```
This command runs `next build`, which compiles the React application, optimizes assets, and builds server-side routes.

## Starting Production Server
After building, start the production server:
```bash
pnpm start
```

## Static Typing & Linting
Before building, it is recommended to ensure all typings are correct:
```bash
pnpm typecheck
```
