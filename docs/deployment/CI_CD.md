# CI/CD Pipeline for Otto

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) strategy for Otto. While specific platform configurations (like GitHub Actions or GitLab CI) depend on your hosting provider, these are the recommended steps and practices.

## Continuous Integration (CI)

The CI pipeline should run on every pull request to ensure code quality and prevent regressions.

### Recommended CI Steps

1. **Install Dependencies**
   ```bash
   pnpm install --frozen-lockfile
   ```
2. **Type Checking**
   Ensure all TypeScript code is valid.
   ```bash
   pnpm typecheck
   ```
3. **Database Health and Migrations (Integration Testing)**
   Start a temporary PostgreSQL database using Docker, run migrations, and execute the health check.
   ```bash
   pnpm db:up
   pnpm db:migrate
   pnpm health
   ```
4. **Build the Application**
   Verify that the Next.js application builds successfully.
   ```bash
   pnpm build
   ```
5. **Run Evaluations (Optional but recommended)**
   Run LLM extraction evaluations to ensure AI capabilities have not regressed.
   ```bash
   pnpm eval
   ```

## Continuous Deployment (CD)

The CD pipeline should trigger automatically when code is merged into the `main` or `production` branch.

### Standard Next.js Deployment

Otto is a Next.js 14 (App Router) application. It can be deployed to platforms like Vercel, AWS Amplify, or a custom Node.js server.

#### Vercel Example
If deploying to Vercel, the platform handles the build and deployment automatically. Ensure the following:
- Build Command: `next build` or `pnpm build`
- Install Command: `pnpm install`
- Environment Variables: Configure all necessary secrets (e.g., `DATABASE_URL`, `OPENROUTER_API_KEY`) in the Vercel dashboard.

#### Custom Node.js Server Deployment
If deploying to a custom server or container orchestration platform:
1. **Build the app**:
   ```bash
   pnpm build
   ```
2. **Start the server**:
   ```bash
   pnpm start
   ```

### Database Migrations in Production

Database migrations should be carefully managed during deployment.
- **Before Application Start**: Ensure `pnpm db:migrate` runs before the new version of the Next.js application starts receiving traffic to ensure schema compatibility.
- **Managed Database**: In production, it is highly recommended to use a managed PostgreSQL service (like Supabase, AWS RDS, or Render) instead of deploying the database yourself via Docker. Connect the Next.js app to the managed DB via the `DATABASE_URL` environment variable.
