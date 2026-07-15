# Information Architecture

Otto is built using the Next.js 14 App Router. The information architecture is designed to be flat, focusing on a central feed of actionable items, supplemented by specific domain views.

## Site Map

- **`/` (Home / Approval Feed)**
  - The central hub of the application.
  - Displays a chronological feed of staged actions and notifications.
  - Features the "Autonomous Workflow Agents" console to stage new actions.
  - Integrates the Trust Meter and Activity Trace.

- **`/resurrection` (Onboarding)**
  - Dedicated space for the initial data ingestion process.
  - File upload interface for invoices, ledgers, and chats.
  - Real-time extraction progress view.

- **`/inventory`**
  - Read-only or managed view of current products, stock levels, and reorder points.
  - Populated automatically via The Resurrection and updated by agent actions.

- **`/ledger`**
  - Financial overview showing dues, historical prices, and customer/supplier balances.

- **`/settings`**
  - Application configuration.
  - **Trust Management**: Toggles to review, adjust, or revoke Otto's autonomous permissions.
  - System connections (e.g., database, integrations).

- **`/vas` (Value Added Services)**
  - Domain-specific extensions and integrations.

## Data Entities (Underlying Structure)
- Products
- Suppliers
- Customers
- Invoices
- Ledger Entries
- Actions (Staged and Executed)
- Agent Events
- Trust Grants
- Documents
