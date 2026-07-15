# Release Notes - Otto v0.1.0

We are thrilled to release Otto v0.1.0 for the TakeOver'26 Hackathon!

Otto is an AI operator for small businesses that installs itself in 3 minutes and earns your trust like a real employee.

## Highlighted Features
- **The Resurrection**: Simply upload photos of paper invoices or ledgers. Otto extracts the data, resolves entities, and builds a digital business instance for you instantly.
- **The Autonomy Ladder**: Otto doesn't take over blindly. Every action is human-gated at first. After you approve an action type 3 times, Otto asks for autonomous permission.
- **Reversible Actions**: Autonomous actions are capped, logged, and fully reversible for 1 hour.
- **8 Industry Playbooks**: Try out specialized workflows across Education, Healthcare, HR, Legal, Manufacturing, Sales, Support, and Retail.

## Quick Start
1. Install dependencies: `pnpm install`
2. Start the database: `pnpm db:up` and `pnpm db:migrate`
3. Seed the demo tenant: `pnpm db:seed`
4. Start the app: `pnpm dev`

Access the feed at `http://localhost:3000`.

## Developer Tools
- Run `pnpm cache:warm` to pre-fetch and cache LLM responses for a flawless offline demo.
- Run `pnpm flow all` to verify all end-to-end operational flows.

*Built with Next.js 14, Postgres, and OpenRouter.*
