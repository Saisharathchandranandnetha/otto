# Lean Canvas: Otto

## 1. Problem
- **High Friction Digitization:** Small businesses are stuck on paper because setting up ERP/accounting software requires days of manual data entry.
- **Lack of Trust in AI:** Business owners don't trust automated systems with their money, inventory, or customer relationships.
- **Operational Overwhelm:** SMB owners spend too much time on repetitive tasks (reordering, responding to support, reconciling ledgers) instead of growing the business.

## 2. Solution
- **The Resurrection:** Upload photos of paper invoices and ledgers. Otto uses vision LLMs to automatically extract, resolve entities, and build a running digital database in 3 minutes.
- **The Autonomy Ladder:** Otto proposes actions (e.g., "Reorder 50 shirts"). The owner approves them with one tap. After 3 approvals, Otto asks for autonomy.
- **Safe Execution:** Autonomous actions are capped by amount, logged, reversible for 1 hour, and revocable instantly.

## 3. Key Metrics
- **Time to Value (TTV):** Minutes from account creation to first digital entity generated.
- **Graduation Rate:** Percentage of users who grant Otto autonomy after the required manual approvals.
- **Action Execution Rate:** Number of approved/autonomous actions processed per week per user.
- **Extraction Accuracy:** Percentage of fields extracted with >0.75 confidence requiring no human edit.

## 4. Unique Value Proposition
*Software that installs itself in 3 minutes from your messy paper receipts, then acts as an AI employee that earns your trust over time to run your operations.*

## 5. Unfair Advantage
- **Proprietary Trust Engine:** The state-machine-backed "earned autonomy" workflow provides a psychological bridge that competitors lack.
- **Schema-Locked Extraction:** Hand-rolled Zod boundaries ensure absolute determinism and safety against prompt injections, making the system reliable enough for real business data.

## 6. Channels
- Viral loops via WhatsApp B2B interactions (e.g., auto-generated Purchase Orders sent to suppliers).
- Direct digital marketing showcasing the "photo-to-database" magic.
- SMB communities and local business networks.

## 7. Customer Segments
- **Early Adopters:** Tech-curious small business owners (retail, local manufacturing) who are overwhelmed by administrative work but haven't adopted heavy ERPs.
- **Broad Market:** Traditional brick-and-mortar stores, local healthcare clinics, legal practices, and HR agencies.

## 8. Cost Structure
- **Variable Costs:** OpenRouter (GPT-4o/Gemini) API usage for vision extraction and reasoning. Twilio API for WhatsApp integration.
- **Fixed Costs:** Hosting (Vercel, Postgres database), core team salaries, basic marketing.

## 9. Revenue Streams
- **Tiered SaaS Subscription:** Base monthly fee for access to the dashboard and manual approval workflows.
- **Volume Pricing:** Pay-per-usage beyond free tier limits for document extractions and automated AI agent actions.
