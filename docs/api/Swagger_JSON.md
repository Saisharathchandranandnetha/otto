```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Otto Platform API",
    "description": "API for Otto's autonomous workflow agents and approval gates.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "/api"
    }
  ],
  "paths": {
    "/agent": {
      "post": {
        "summary": "Agent controls",
        "description": "Controls for demo scripts and the stage runbook.",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "scan": { "type": "string", "enum": ["reorder"] },
                  "simulate_sale": {
                    "type": "object",
                    "properties": {
                      "sku": { "type": "string" },
                      "qty": { "type": "number" }
                    }
                  },
                  "run_domain": { "type": "string" },
                  "run_theme2_all": { "type": "boolean" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Command executed successfully" },
          "400": { "description": "Unknown command or invalid parameters" }
        }
      }
    },
    "/approve": {
      "post": {
        "summary": "Human Approval Gate",
        "description": "Process human decisions on pending agent actions.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["actionId", "decision"],
                "properties": {
                  "actionId": { "type": "string" },
                  "decision": { "type": "string", "enum": ["approve", "reject", "undo"] },
                  "capInr": { "type": "number" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Action state transitioned successfully" },
          "400": { "description": "Missing parameters" },
          "404": { "description": "Action not found" }
        }
      }
    },
    "/events": {
      "get": {
        "summary": "Agent Events Stream",
        "description": "SSE endpoint for live event updates.",
        "parameters": [
          {
            "name": "cursor",
            "in": "query",
            "schema": { "type": "integer" },
            "description": "Last seen event ID for backlog replay"
          }
        ],
        "responses": {
          "200": { "description": "text/event-stream connection" }
        }
      }
    },
    "/feed": {
      "get": {
        "summary": "Feed Snapshot",
        "description": "Returns initial snapshot of actions, grants, and entity counts.",
        "responses": {
          "200": {
            "description": "Snapshot payload",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "actions": { "type": "array", "items": { "type": "object" } },
                    "grants": { "type": "array", "items": { "type": "object" } },
                    "counts": { "type": "object" },
                    "lastEventId": { "type": "integer" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/ingest": {
      "post": {
        "summary": "Document Ingestion",
        "description": "Upload documents (e.g., invoices) for AI extraction.",
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "files": {
                    "type": "array",
                    "items": { "type": "string", "format": "binary" }
                  },
                  "mode": { "type": "string", "enum": ["single", "resurrection"], "default": "single" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Ingestion processed successfully" },
          "413": { "description": "File size exceeds 10MB" },
          "422": { "description": "AI extraction failed" }
        }
      }
    },
    "/trust": {
      "get": {
        "summary": "List Trust Grants",
        "description": "Retrieve the current trust ladder state.",
        "responses": {
          "200": { "description": "List of grants" }
        }
      },
      "post": {
        "summary": "Revoke Trust",
        "description": "Instantly revoke autonomy for a specific action type.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["revoke"],
                "properties": {
                  "revoke": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Revoked successfully" }
        }
      }
    },
    "/assistant": {
      "post": {
        "summary": "Chat Assistant",
        "description": "Talk to the Otto Groq-powered AI.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "messages": {
                    "type": "array",
                    "items": { "type": "object" }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "AI reply" }
        }
      }
    },
    "/po/{poNumber}": {
      "get": {
        "summary": "Purchase Order HTML",
        "description": "Serves generated PO HTML file.",
        "parameters": [
          {
            "name": "poNumber",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": { "description": "HTML document" },
          "404": { "description": "File not found" }
        }
      }
    }
  }
}
```
