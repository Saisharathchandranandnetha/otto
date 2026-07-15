# Tool Calling Flow

## Action Execution (Side-Effects)
Otto abstracts tool calling as "Executors". Side effects are strictly forbidden until an action reaches the `approved` state. 

### The Flow:
1. **Trigger Phase**: Incoming events (e.g., a WhatsApp message, a new invoice upload) trigger the agent to create a `perceived` action.
2. **Drafting Phase**: The agent determines the required tool/action (e.g., `reorder`, `payment_reminder`) and prepares the payload.
3. **Gating Phase (`gate.ts`)**: 
   - If the action requires human approval, it halts at `awaiting_approval`.
   - If an active `trust_grant` exists for this action type and the amount is under the defined cap, the gate automatically pushes it to `approved`.
4. **Execution Phase**: The executor for the specific action type runs. Executors are responsible for integrating with external systems (Twilio API, PDF Generators, etc.).
5. **Undo/Revoke**: Many executed tools have a built-in "undo" window (e.g., 1 hour to cancel an order). If revoked, the executor runs the inverse operation and marks the action `undone`.
