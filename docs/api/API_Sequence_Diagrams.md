# API Sequence Diagrams

Below are the key sequence diagrams illustrating the data flow across Otto's core subsystems.

## 1. Document Ingestion Flow

The ingestion flow processes uploaded invoices and places the resulting draft action into the approval queue.

```mermaid
sequenceDiagram
    participant Client
    participant Ingest API (/api/ingest)
    participant DB
    participant AI Model

    Client->>Ingest API: POST /api/ingest (multipart/form-data)
    Ingest API->>Ingest API: Hash and save file to /data/uploads
    Ingest API->>DB: INSERT into documents (status='extracting')
    Ingest API->>AI Model: extract(task='invoice', image)
    AI Model-->>Ingest API: Extracted Data (JSON)
    Ingest API->>DB: UPDATE documents (status='extracted'/'review')
    Ingest API->>DB: createAction('invoice_commit')
    Ingest API->>DB: transition('drafted' -> 'awaiting_approval')
    Ingest API-->>Client: 200 OK (actionId, needsReview)
```

## 2. Approval Gate Flow

This diagram illustrates how a human approves an agent's drafted action.

```mermaid
sequenceDiagram
    participant Human (Client)
    participant Approve API (/api/approve)
    participant Machine
    participant Executor
    participant Event Bus (SSE)

    Human->>Approve API: POST /api/approve { actionId, decision: 'approve' }
    Approve API->>Machine: getAction(actionId)
    Machine-->>Approve API: Action Details
    Approve API->>Machine: transition('awaiting_approval' -> 'approved')
    Machine->>Event Bus: emit 'status_change'
    Approve API->>Executor: execute(actionId)
    Executor->>Event Bus: emit 'executed' (or other state change)
    Approve API-->>Human: 200 OK { status: 'executed', offeredGraduation }
```

## 3. Real-time Events Stream (SSE)

The events flow maintains client state synchronization.

```mermaid
sequenceDiagram
    participant Client
    participant Events API (/api/events)
    participant DB
    participant Event Bus (Memory)

    Client->>Events API: GET /api/events?cursor=X
    Events API->>DB: SELECT backlog > X
    DB-->>Events API: Past events
    Events API-->>Client: data: {past events}
    
    Events API->>Event Bus: Subscribe to 'agent_event'
    
    Note over Event Bus,Events API: New event occurs elsewhere
    Event Bus-->>Events API: onEvent(e)
    Events API-->>Client: data: {new event}
```
