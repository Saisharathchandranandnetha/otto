```json
{
  "info": {
    "name": "Otto API",
    "description": "Postman Collection for the Otto Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Agent Controls",
      "item": [
        {
          "name": "Scan Reorders",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/agent",
              "host": ["{{baseUrl}}"],
              "path": ["api", "agent"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"scan\": \"reorder\"\n}"
            }
          }
        },
        {
          "name": "Simulate Sale",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/agent",
              "host": ["{{baseUrl}}"],
              "path": ["api", "agent"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"simulate_sale\": {\n    \"sku\": \"ITEM-001\",\n    \"qty\": 5\n  }\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Approvals",
      "item": [
        {
          "name": "Approve Action",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/approve",
              "host": ["{{baseUrl}}"],
              "path": ["api", "approve"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"actionId\": \"act_12345\",\n  \"decision\": \"approve\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Data Fetching",
      "item": [
        {
          "name": "Get Feed",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/feed",
              "host": ["{{baseUrl}}"],
              "path": ["api", "feed"]
            }
          }
        },
        {
          "name": "Get Events (SSE)",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/events?cursor=0",
              "host": ["{{baseUrl}}"],
              "path": ["api", "events"],
              "query": [
                { "key": "cursor", "value": "0" }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Trust",
      "item": [
        {
          "name": "Get Trust Grants",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/trust",
              "host": ["{{baseUrl}}"],
              "path": ["api", "trust"]
            }
          }
        },
        {
          "name": "Revoke Trust",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/trust",
              "host": ["{{baseUrl}}"],
              "path": ["api", "trust"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"revoke\": \"reorder\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Ingestion",
      "item": [
        {
          "name": "Upload Document",
          "request": {
            "method": "POST",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/ingest",
              "host": ["{{baseUrl}}"],
              "path": ["api", "ingest"]
            },
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "files",
                  "type": "file",
                  "src": []
                },
                {
                  "key": "mode",
                  "value": "single",
                  "type": "text"
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "string"
    }
  ]
}
```
