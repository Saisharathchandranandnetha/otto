# AI System Overview

## Introduction
Otto is an AI operator for small businesses, designed to automate complex multi-step workflows like invoice processing, inventory management, and customer support with zero typing. It operates on an "Autonomy Ladder," initially gating all actions behind human approval and gradually earning autonomy as it builds trust.

## Core Architecture
Otto relies on a minimalist, hand-rolled agent core (~200 lines) that uses PostgreSQL as its state machine rather than heavy orchestration frameworks like Temporal or LangGraph. 

### Key Components:
1. **The Resurrection Engine**: A batch vision extraction and entity resolution pipeline that transforms raw photos of paper invoices, handwritten ledgers, and WhatsApp chats into structured business state.
2. **Autonomous Workflow Engine**: A database-driven state machine managing action lifecycle (`perceived` → `planned` → `drafted` → `awaiting_approval` / `approved` → `executing` → `executed`).
3. **The Trust Engine**: A sophisticated gating system where Otto asks for capped, reversible autonomy after observing human approval patterns (e.g., 3 human approvals trigger a "graduation offer").

## AI Stack
- **Primary Model Routing**: OpenRouter (GPT-4o as primary, Gemini 2.0 Flash as fallback).
- **Extraction & Validation**: Zod-locked schemas ensure the LLM outputs strictly typed JSON.
- **Caching**: SHA-256 input-hash caching ensures deterministic, offline-capable demos and robust execution.
- **Data Persistence**: PostgreSQL 16 (or Supabase) tracks state, audit trails, and trust grants.
