# Product Vision

## 1. Vision Statement

**Otto** is the AI operator for small businesses, designed to bridge the gap between chaotic, offline, paper-based operations and intelligent, autonomous digital workflows.

Our vision is a world where small business owners spend zero time on manual data entry, routine reordering, and administrative approvals. Otto empowers entrepreneurs by instantly digitizing their historical context ("The Resurrection") and seamlessly earning their trust to run autonomous operations ("The Autonomy Ladder"). We envision Otto not just as a software tool, but as a trusted, reliable digital employee who installs itself in 3 minutes and scales to handle industry-specific workflows across Retail, Healthcare, HR, Education, Legal, Manufacturing, Sales, and Customer Support.

## 2. Mission

To liberate small business owners from the terminal velocity of paperwork, giving them back the time and mental bandwidth to focus on growth, strategy, and customer relationships.

## 3. The Problem: The Paper-Based Reality of SMBs

Millions of small-to-medium businesses (SMBs) in India and globally operate entirely on paper:
- **Handwritten Invoices:** Supplier bills are scribbled on carbon-copy pads.
- **Physical Ledgers:** Customer dues are tracked in red diaries.
- **Unstructured Communication:** Orders and payment promises happen informally over WhatsApp.

This analog reality results in severe inefficiencies:
- **Zero Visibility:** Owners don't know their real-time stock levels until a customer asks for a product that is out of stock.
- **Lost Revenue:** Chasing customer dues is manual, leading to forgotten receivables and strained cash flow.
- **Lack of Automation:** Every reorder, every follow-up, every document requires manual intervention.

Existing ERP solutions (like Tally, ERPNext, Zoho) demand a massive upfront investment in time and data entry. The business owner must manually input their entire catalog, supplier list, and customer history before the software provides any value. For a busy boutique owner or clinic coordinator, this friction is a non-starter.

## 4. Our Approach: Flipping the Paradigm

Otto solves the adoption problem by turning it upside down. Instead of asking the owner to type, Otto reads the owner's existing paper trail and builds the digital business for them.

### Pillar 1: The Resurrection (Zero-Typing Onboarding)
The owner uploads a "shoebox" of 15-20 photos of their handwritten invoices, supplier bills, ledger pages, and WhatsApp exports. Otto utilizes strict, schema-locked Vision LLMs to extract the data, resolve entities (merging "Sharma Fab" with "Sharma Fabrics"), and infer stock levels and reorder points. The entire digital backend is built in under 3 minutes, with zero typing required.

### Pillar 2: The Autonomy Ladder (Earned Trust)
No business owner trusts an AI to spend money on day one. Otto operates on an earned-trust model:
- **Human-Gated:** Otto stages actions (like reordering low stock) and waits for human approval.
- **Graduation:** After the owner approves a specific type of action 3 times, Otto asks for a "promotion" to handle it autonomously.
- **Capped Autonomy:** Once granted autonomy, Otto executes the actions within an owner-defined financial cap, maintaining a perfect audit log and offering a 1-hour undo window.

## 5. Target Users

Our primary beachhead market is Indian SMB owners who handle physical goods or manage complex scheduling.

**Primary Persona:** The Boutique / Retail Owner
- **Example:** Priya, owner of "Priya's Fashion" in Jaipur.
- **Pain Points:** Stockouts on fast-moving items, forgotten supplier payments, chaotic WhatsApp orders.
- **Otto's Value:** Automatically detects low stock, drafts purchase orders, and messages suppliers via WhatsApp.

**Secondary Personas (via Domain Engine):**
- **Clinic Coordinators (Healthcare):** Triaging follow-up queues and scheduling.
- **HR Managers:** Automating new-hire onboarding checklists.
- **Sales Leads:** Personalizing stalled-deal follow-ups.

## 6. Long-Term Vision: The Universal Domain Engine

While the MVP focuses on retail and inventory (Flow A & B), Otto's architecture is designed as a universal state machine. The **Domain Engine** currently contains 8 MVP playbooks across diverse industries. The long-term vision is for Otto to serve as the underlying operating system for any domain-specific AI agent, utilizing the same core mechanics of schema-locked extraction, idempotent approvals, and earned autonomy.

## 7. Competitive Moat

- **Zero-Typing Onboarding:** We eliminate the highest barrier to entry for SMB software (data entry).
- **The Trust Engine:** We solve the AI trust gap by requiring the AI to earn autonomy through a transparent, gamified ladder.
- **Schema-Locked Extraction:** By enforcing Zod JSON schemas at the LLM boundary, we physically prevent hallucinated fields and prompt injections, making the system enterprise-grade safe for financial operations.
- **Cost of Delay Analytics:** Otto doesn't just present actions; it calculates and presents the financial cost of doing nothing (Theme 7), driving urgent user engagement.

## 8. Success Metrics

- **Time to Value:** < 3 minutes from first upload to a live digital backend.
- **Extraction Confidence:** > 90% of extracted fields score above the 0.75 confidence review threshold.
- **Graduation Rate:** > 60% of active users grant at least one autonomous trust grant within the first 30 days.
- **Auto-Execution Rate:** > 80% of routine tasks (reorders, follow-ups) handled autonomously by month 3.
- **Zero Hallucination Guarantee:** 100% adherence to defined Zod schemas on committed database records.
