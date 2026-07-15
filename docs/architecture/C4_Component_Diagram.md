# C4 Component Diagram

## Overview
This diagram zooms into the Next.js Application container to show its internal components, specifically highlighting the Agent Core and Extraction modules.

## Diagram
```mermaid
C4Component
    title Component diagram for Otto Next.js Application
    
    Container_Boundary(app, "Next.js Application") {
        Component(ui, "UI Components", "React", "Renders the Approval Feed, Trust Meter, and Resurrection Progress.")
        Component(api, "API Routes", "Next.js Route Handlers", "Handles /api/ingest, /api/approve, /api/events, etc.")
        
        Component(agent_core, "Agent Core", "TypeScript", "Orchestrates machine logic, gates, trust grants, and executors (machine.ts, gate.ts, trust.ts).")
        Component(extractor, "Extraction Engine", "TypeScript, Zod", "Manages SHA-256 caching, Zod validation, and communicates with LLMs.")
        
        Component(integrations, "Integrations Module", "TypeScript", "Handles external interactions like Twilio and PO PDF generation.")
    }
    
    ContainerDb(database, "PostgreSQL", "Relational Database")
    System_Ext(openrouter, "OpenRouter API", "LLM API")
    System_Ext(twilio, "Twilio API", "Messaging API")
    
    Rel(ui, api, "Makes API calls", "JSON/HTTPS")
    Rel(api, agent_core, "Invokes workflows")
    Rel(agent_core, extractor, "Delegates parsing/inference")
    Rel(agent_core, integrations, "Triggers side-effects")
    
    Rel(agent_core, database, "SQL queries (postgres.js)")
    Rel(extractor, openrouter, "API Calls")
    Rel(integrations, twilio, "API Calls")
```
