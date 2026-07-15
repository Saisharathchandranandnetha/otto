# Request and Response Examples

Below are common examples of how to interact with the Otto API.

## 1. Trigger Reorder Scan
**POST** `/api/agent`

**Request:**
```json
{
  "scan": "reorder"
}
```

**Response (200 OK):**
```json
{
  "triggered": 2,
  "actions": [
    { "id": "act_123", "type": "reorder" }
  ]
}
```

## 2. Simulate Sale
**POST** `/api/agent`

**Request:**
```json
{
  "simulate_sale": {
    "sku": "ITEM-001",
    "qty": 5
  }
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "product": "Widget A",
  "stockNow": 15,
  "triggered": 1
}
```

## 3. Approve an Action
**POST** `/api/approve`

**Request:**
```json
{
  "actionId": "act_abc123",
  "decision": "approve"
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "status": "executed",
  "offeredGraduation": false
}
```

**Response (already approved/raced):**
```json
{
  "raced": true,
  "_note": "Idempotent no-op — already approved"
}
```

## 4. Fetch Feed Snapshot
**GET** `/api/feed`

**Response (200 OK):**
```json
{
  "actions": [
    {
      "id": "act_abc123",
      "type": "reorder",
      "status": "awaiting_approval",
      "created_at": "2026-07-08T00:00:00.000Z"
    }
  ],
  "grants": [
    {
      "id": "grt_1",
      "action_type": "reorder",
      "autonomy_level": "fully_autonomous"
    }
  ],
  "counts": {
    "products": 150,
    "suppliers": 12,
    "customers": 300,
    "dues": 45000.5,
    "low_stock": 3
  },
  "lastEventId": 452
}
```

## 5. Revoke Trust
**POST** `/api/trust`

**Request:**
```json
{
  "revoke": "reorder"
}
```

**Response (200 OK):**
```json
{
  "ok": true
}
```
