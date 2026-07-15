# Installation Guide

Follow these steps to deploy Otto.

## Prerequisites
- Node.js (v18 or higher)
- Docker (for a local database) OR a Supabase account

## Local Installation
1. Install dependencies:
   ```bash
   pnpm approve-builds esbuild # first time only
   pnpm install
   ```
2. Start the database and run migrations:
   ```bash
   pnpm db:up
   pnpm db:migrate
   ```
3. Seed demo data:
   ```bash
   pnpm db:seed
   ```
4. Start the server:
   ```bash
   pnpm dev
   ```
   *Note: Operates keyless if `EXTRACTOR_MODE=mock` in `.env`.*
