# Product Roadmap

## Q1: The Core MVP (Hackathon Phase)
- **Focus:** Prove "The Resurrection" and "The Autonomy Ladder" concepts.
- **Key Deliverables:**
  - Vision extraction for invoices/ledgers via OpenRouter (GPT-4o).
  - Idempotent database schema (Postgres 16).
  - UI: Dark theme, Approval Feed, Trust Meter.
  - Hardcoded MVP domain playbooks (Retail reordering focus).
  - Offline demo capability (SHA-256 caching).

## Q2: Extensibility & Engine Integration
- **Focus:** Connect to the broader Otto Workflow Engine.
- **Key Deliverables:**
  - Full integration with `OTTO_ENGINE_URL` for dynamic workflow orchestration.
  - Expansion of domain playbooks: fully functional HR, Legal, and Healthcare modules.
  - WhatsApp Twilio integration for real-time alerts and two-way approval via chat.

## Q3: Advanced Safety & Analytics
- **Focus:** Deepen trust and provide business insights.
- **Key Deliverables:**
  - Advanced limit setting (dynamic caps based on historical cash flow).
  - Analytics dashboard: Cost-of-inaction metrics, spending velocity, supplier performance.
  - Multi-user roles (Owner, Manager) with delegated approval rights.

## Q4: Ecosystem & Scale
- **Focus:** Connect Otto to external SMB tools.
- **Key Deliverables:**
  - Accounting software integrations (QuickBooks, Xero).
  - Supplier API integrations for direct B2B purchasing beyond WhatsApp.
  - Mobile app wrapper (React Native / PWA) for easier on-the-go invoice scanning.
