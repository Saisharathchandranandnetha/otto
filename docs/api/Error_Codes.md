# API Error Codes

The Otto API utilizes standard HTTP status codes to indicate the success or failure of an API request. In general:
- `2xx` codes indicate success.
- `4xx` codes indicate client-side errors (invalid parameters, missing data).
- `5xx` codes indicate server-side errors.

## 400 Bad Request
The request was malformed or missing required parameters.
- `/api/agent`: Unknown command or missing parameters for `simulate_sale`.
- `/api/approve`: Missing `actionId` or `decision`, or unknown decision string.
- `/api/ingest`: No files uploaded in the multipart form data.
- `/api/trust`: Missing `revoke` action type in the payload.

## 404 Not Found
The requested resource does not exist.
- `/api/approve`: The specified `actionId` was not found in the database.
- `/api/agent`: The `sku` provided in `simulate_sale` does not exist.
- `/api/po/[poNumber]`: The specified Purchase Order HTML file does not exist on disk.

## 409 Conflict
The request conflicts with the current state of the server.
- `/api/approve`: Attempted to `undo` an action that cannot be undone.
- `/api/ingest`: Attempted single extraction but no new documents were found (e.g., duplicated hash).

## 413 Payload Too Large
- `/api/ingest`: One or more uploaded files exceed the 10MB size limit.

## 422 Unprocessable Entity
- `/api/ingest`: File upload succeeded, but the AI extraction process failed. Response will include `{ "retry": true }`.

## 500 Internal Server Error
An unexpected error occurred on the server.
- All endpoints catch unhandled exceptions and return a generic or detailed error message.
- Example body: `{ "error": "Internal server error message" }`
