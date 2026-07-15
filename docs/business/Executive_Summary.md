# Executive Summary: Otto

## The Vision
Otto is the AI operator for small businesses. Our core thesis is simple: *"Software that installs itself in 3 minutes, then earns your trust like a real employee."* 

While enterprise SaaS focuses on adding features, Otto focuses on removing friction. We are targeting the millions of traditional Small and Medium Businesses (SMBs) that still rely on paper invoices, handwritten ledgers, and chaotic WhatsApp chats because traditional ERPs require too much time and technical expertise to set up.

## Core Innovations
Otto solves the two fundamental barriers to SMB digitization: **Data Entry** and **Trust**.

1. **The Resurrection (Zero-Typing Onboarding):**
   Users upload photos of their messy paper records (invoices, ledgers) and a WhatsApp export. Otto utilizes batch vision extraction and entity resolution to instantly build a complete, running digital business database. Time to value is reduced from days to under 3 minutes.

2. **The Autonomy Ladder (Earned Trust):**
   Business owners don't trust AI with their money. Otto starts as a conservative assistant: it drafts actions (e.g., reordering inventory) and waits for a single-tap human approval. After consistent approvals, Otto proposes a promotion. Upon acceptance, it executes actions autonomously—but with strict spending caps, a 1-hour undo window, and instant revocability. 

## Technology & Safety
Under the hood, Otto is a production-grade application (Next.js, Postgres) powered by a hand-rolled, transaction-safe agent state machine. Safety is guaranteed via **Schema-Locked Extraction** (Zod), which prevents LLM hallucinations and prompt injections. Every action is idempotent and logged in an auditable trace.

## Market Potential
Otto is built as a horizontal platform. Its "Theme 2 Domain Engine" demonstrates applicability across Retail, Healthcare, HR, Legal, Manufacturing, and Support. By digitizing the offline SMB economy, Otto establishes a beachhead to become the central operational and eventually financial hub for small businesses globally.
