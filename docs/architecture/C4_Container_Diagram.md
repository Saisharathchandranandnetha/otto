# C4 Container Diagram

## Overview
This diagram shows the high-level containers that make up the Otto system. It illustrates how the Next.js application interacts with the database and external APIs.

## Diagram
```mermaid
C4Container
    title Container diagram for Otto AI Operator
    
    Person(user, "Small Business Owner", "Interacts with the application via web browser.")
    
    Container_Boundary(c1, "Otto Application") {
        Container(web_app, "Next.js Application", "React, Tailwind, App Router", "Provides the UI and exposes API routes for frontend actions and Server-Sent Events (SSE).")
        ContainerDb(database, "PostgreSQL Database", "PostgreSQL 16", "Stores products, suppliers, customers, invoices, ledger, actions, agent_events, and trust_grants.")
    }
    
    System_Ext(openrouter, "OpenRouter API", "Provides GPT-4o LLM capabilities.")
    System_Ext(twilio, "Twilio API", "Provides WhatsApp messaging capabilities.")
    
    Rel(user, web_app, "Uses", "HTTPS")
    Rel(web_app, database, "Reads from and writes to", "postgres.js / TCP")
    Rel(web_app, openrouter, "Requests LLM inferences", "JSON/HTTPS")
    Rel(web_app, twilio, "Dispatches messages", "JSON/HTTPS")
```
