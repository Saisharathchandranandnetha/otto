# Complete API Reference

Welcome to the Otto API Reference. The Otto API provides endpoints to interact with autonomous workflow agents, approval gates, document ingestion, and server-sent events (SSE).

## Base URL
All API requests are relative to `/api` (e.g., `http://localhost:3000/api`).

## Endpoints

### 1. Agent Controls
**POST** `/api/agent`
Agent controls used by demo scripts and the stage runbook.
- **Request Body (JSON):**
  - `scan` (string): Set to `"reorder"` to run the trigger engine.
  - `simulate_sale` (object): `{ sku: string, qty: number }` - Records a counter sale to move stock.
  - `run_domain` (string): Run a specific Theme 2 domain playbook.
  - `run_theme2_all` (boolean): Run all Theme 2 domain playbooks.
- **Responses:**
  - `200 OK`: Returns execution results depending on the command.
  - `400 Bad Request`: Unknown command or missing required fields.

### 2. Approval Gate
**POST** `/api/approve`
The human side of the Approval Gate. Idempotent by construction.
- **Request Body (JSON):**
  - `actionId` (string, required): The ID of the action to approve/reject/undo.
  - `decision` (string, required): One of `"approve"`, `"reject"`, `"undo"`.
  - `capInr` (number, optional): For `graduation_offer`, adjusts the autonomy cap.
- **Responses:**
  - `200 OK`: `ok: true`, with status (`executed`, `rejected`, `undone`, or `raced: true`).
  - `400 Bad Request`: Missing `actionId` or `decision`.
  - `404 Not Found`: Action not found.
  - `409 Conflict`: Undo not possible.

### 3. AI Assistant
**POST** `/api/assistant`
Communicates with the Otto AI Assistant (powered by Groq).
- **Request Body (JSON):**
  - `messages` (array): Array of message objects (role, content) for the AI.
- **Responses:**
  - `200 OK`: `{ "text": "AI response..." }`
  - `500 Internal Server Error`: AI communication failed.

### 4. Event Stream
**GET** `/api/events`
SSE stream of `agent_events`. Reconnects cleanly with backlog replay.
- **Query Parameters:**
  - `cursor` (number, optional): Last seen event ID. Default `0`.
- **Responses:**
  - `200 OK`: `text/event-stream` returning JSON data strings.

### 5. Feed Snapshot
**GET** `/api/feed`
Initial feed snapshot returning recent actions, trust grants, entity counts, and latest event ID.
- **Responses:**
  - `200 OK`: `{ actions: [], grants: [], counts: {}, lastEventId: 0 }`

### 6. Document Ingest
**POST** `/api/ingest`
Upload documents for processing.
- **Request Body (Multipart Form-Data):**
  - `files` (File[]): Array of files (max 10MB each).
  - `mode` (string, optional): `"single"` (default) or `"resurrection"`.
- **Responses:**
  - `200 OK`: Returns action details or resurrection summary.
  - `400/413`: No files or exceeds limit.
  - `422`: Extraction failed.

### 7. Purchase Orders
**GET** `/api/po/[poNumber]`
Serves generated PO HTML files.
- **Responses:**
  - `200 OK`: HTML string of the PO.
  - `404 Not Found`: PO not found.

### 8. Trust Grants
**GET** `/api/trust`
List current trust grants driving the TrustMeter.
- **Responses:**
  - `200 OK`: `{ grants: [...] }`

**POST** `/api/trust`
Revoke autonomy for an action type.
- **Request Body (JSON):**
  - `revoke` (string, required): Action type to revoke.
- **Responses:**
  - `200 OK`: `{ ok: true }`
