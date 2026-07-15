# Local Setup Guide for Otto

This guide provides instructions on how to set up the Otto application locally for development and testing.

## Prerequisites
- Node.js >= 18.17.0
- pnpm
- Docker and Docker Compose (for the local PostgreSQL database)

## Steps

1. **Install Dependencies**
   First, ensure you have the required dependencies installed:
   ```bash
   pnpm approve-builds esbuild # Only required the first time
   pnpm install
   ```

2. **Database Setup**
   Otto uses a PostgreSQL database. We use Docker to run this locally.
   Start the database container:
   ```bash
   pnpm db:up
   ```

   Once the database is running, apply the schema migrations:
   ```bash
   pnpm db:migrate
   ```

3. **Seed the Database**
   To populate the database with demo data (e.g., "Priya's Fashion, Jaipur" demo tenant), run the seed script:
   ```bash
   pnpm db:seed
   ```
   *Alternatively, you can run `pnpm setup` which will run both migrations and seed.*

4. **Environment Variables**
   Ensure your `.env` file is set up. Copy `.env.example` to `.env` if you haven't already.
   ```bash
   cp .env.example .env
   ```
   For local development without external LLM calls, you can use mock extraction by ensuring `EXTRACTOR_MODE=mock` is set in your `.env`.

5. **Start the Development Server**
   Now you can start the Next.js development server:
   ```bash
   pnpm dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## Useful Commands
- `pnpm demo:reset` - Wipes everything and sets a blank state with pre-seeded data.
- `pnpm health` - Health check for DB, cache, and Node version.
- `pnpm db:down` - Stop the local database container.
