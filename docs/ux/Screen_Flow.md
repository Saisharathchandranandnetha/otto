# Screen Flow

This document details the screen-to-screen navigation and interaction models within Otto.

## Onboarding Sequence
1. **Initial State**: User lands on `localhost:3000`. The feed is blank.
2. **Call to Action**: A prominent prompt directs the user to `/resurrection` to begin setup.
3. **Resurrection Screen (`/resurrection`)**:
   - UI: Drag-and-drop zone or camera button.
   - Action: User uploads photos.
   - Transition: UI shifts to a "Live Narrated Build" state, showing progress bars and extraction logs.
4. **Confirmation Screen**:
   - UI: Summary of extracted entities (Suppliers, Products, Ledger balance).
   - Action: User clicks "Confirm & Launch".
   - Transition: Redirects to `/` (Home Feed).

## Daily Operations (Home Feed)
1. **Home Feed (`/`)**:
   - UI: A vertical feed of "Action Cards" (Dark theme, Amber accents).
   - **Interaction - Stage Action**: User clicks a "Stage" button in the Autonomous Workflow console. New cards appear in the feed.
   - **Interaction - Manual Approval**: User reviews a pending action card (e.g., "Approve PO for 50 widgets"). Clicks "Approve". Card updates state to "Executing" then "Completed" (idempotent, double-tap is a no-op).
   - **Interaction - Promotion**: After 3 manual approvals, a special "Trust Request" card appears. User clicks "Grant Autonomy".
   - **Interaction - Undo**: For an autonomous action completed < 1 hour ago, user clicks "Undo" on the history card. The state reverts.

## Navigation Sidebar/Header
- Persistent links to `/inventory`, `/ledger`, and `/settings`.
- **Trust Meter**: A persistent UI element showing the current level of autonomy granted to the agent.
