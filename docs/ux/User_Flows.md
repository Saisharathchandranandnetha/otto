# User Flows

This document outlines the primary user flows for Otto, the AI operator for small businesses. 

## 1. The Resurrection (Onboarding Flow)

The Resurrection is Otto's zero-friction onboarding process that transforms physical records into a running digital business in 3 minutes.

1. **Upload Phase**: User navigates to `/resurrection`.
2. **Document Capture**: User uploads or snaps photos of a "Shoebox Kit" (15–20 photos of paper invoices, handwritten ledger pages, WhatsApp chat exports).
3. **Processing**: Otto performs batch vision extraction, entity resolution, and inference (calculating reorder points, dues, price history).
4. **Live Build**: A live narrated build screen shows the extraction progress.
5. **Confirmation**: User reviews the extracted data and provides a single one-tap confirmation.
6. **Completion**: The digital business is instantiated, and the user is redirected to the home feed.

## 2. The Autonomy Ladder (Trust Building Flow)

Otto gradually earns trust to automate tasks like inventory reordering.

1. **Human-Gated Action**: Otto stages an action (e.g., a reorder for low inventory) in the home feed.
2. **Manual Approval**: User reviews the action and manually approves it.
3. **Repetition**: This manual approval process is repeated 3 times for a specific action type.
4. **Promotion Request**: After the 3rd approval, Otto proactively asks for a "promotion" to handle this task autonomously.
5. **Granting Trust**: User accepts the promotion.
6. **Autonomous Execution**: Future actions of this type are executed automatically by Otto.
7. **Safety Nets**: Autonomous actions remain capped, logged, reversible for 1 hour, and can be revoked with a single toggle in settings or directly from the feed.

## 3. Autonomous Workflow Agent Flow

1. **Staging**: From the home screen console, the user picks a targeted industry and clicks "Stage" (or "Stage all").
2. **Action Generation**: Otto populates the feed with domain-specific action cards (e.g., `workflow_approval`, `document_generation`, `support_response`).
3. **Review**: User reviews the action card, which includes workflow steps, draft output, evidence sources, and cost-of-delay.
4. **Execution/Approval**: Based on the current autonomy level, the user either approves the action or Otto auto-executes it (with the standard safety nets).
