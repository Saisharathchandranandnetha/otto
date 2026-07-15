# Deployment Workflow for Otto

This document outlines the standard deployment workflow for releasing new versions of the Otto application. 

## 1. Pre-Deployment Preparation
- **Code Freeze**: Ensure the `main` branch is stable and all desired features/fixes are merged.
- **Testing**: Confirm that all CI checks (type checking, local DB migrations, and basic build tests) have passed successfully.
- **Environment Variables**: Review the `.env.example` file and ensure that any new environment variables introduced in this release are configured in the target production environment.

## 2. Database Migrations
Otto uses `postgres.js` and manages migrations via raw SQL.
- **Execution**: Database migrations MUST be run prior to switching traffic to the new version of the application. 
- **Command**: Depending on your deployment environment, run the migration script:
  ```bash
  pnpm db:migrate
  ```
  *(Note: This uses `tsx scripts/migrate.ts` as defined in `package.json`)*
- **Safety**: Migrations should be designed to be backwards compatible to allow the old version of the app to run against the new schema during the deployment transition.

## 3. Application Build & Deployment
Since Otto is a standard Next.js application, the build process is handled by the Next.js CLI.
- **Build**: 
  ```bash
  pnpm build
  ```
- **Deployment Platform**: If using Vercel, this step is handled automatically. The Vercel platform will build the application and deploy it to a new immutable URL. Once the build is verified, it will route production traffic to the new deployment.
- **Custom Server**: If deploying to a custom server, stop the old Node process, start the new one, or perform a rolling update if running multiple instances.

## 4. Post-Deployment Verification
- **Health Check**: Run the health check endpoint or script to ensure the system is operational.
  ```bash
  pnpm health
  ```
- **Smoke Testing**: Verify critical user flows (e.g., the Agent Core approval flow and OpenRouter connection) in the live environment.
- **Monitoring**: Check application logs for any unexpected errors or warnings following the release.
