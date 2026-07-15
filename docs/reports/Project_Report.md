# Project Management Report

## 1. Project Context
**Project Name**: Otto
**Version**: 0.1.0
**Target Event**: TakeOver'26 Hackathon
**Team Composition**: 3-person team consisting of Frontend, Backend, and AI specialists.

## 2. Project Goals
- **Theme 2**: Autonomous Workflow Agents.
- **Theme 7**: Analytics & Decision Intelligence (demonstrating the cost of inaction).
- **Core Objective**: Deliver an AI operator for small businesses that requires zero typing for initial setup and earns user trust over time.

## 3. Delivery & Milestones
- **MVP Completion**: Delivered a functional Next.js application with a PostgreSQL database.
- **Demo Readiness**: Implemented deterministic caching (`pnpm cache:warm`) to ensure demo stability even in poor network conditions.
- **Quality Assurance**: Created an evaluation suite (`pnpm eval`) to measure extraction accuracy against ground truth data (`.expected.json` fixtures).

## 4. Workflow Orchestration Strategy
- **Local Fallback**: Implemented a deterministic local playbook fallback for the hackathon MVP.
- **Production Path**: Built integration points for the Otto Workflow Engine via `OTTO_ENGINE_URL` and `OTTO_ENGINE_KEY`.

## 5. Risk Management
- **Demo Failure Risk**: Mitigated via offline filesystem caching of LLM requests.
- **AI Hallucination Risk**: Mitigated via Zod schema enforcement and strict input/output separation.
- **User Trust Risk**: Mitigated via the "Autonomy Ladder" concept (human-gated first, autonomous later).
