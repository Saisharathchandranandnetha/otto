# Components — build contracts

The hero surface of the entire demo. Each component's state contract is fixed here;
implementations land in their gates.

| Component | Gate | Contract |
|---|---|---|
| `ApprovalCard` | 2/4 | Renders an action. States: `pending / approved / rejected / executing / executed / auto-executed (quiet notification variant) / undone`. Extraction fields with confidence < 0.75 get `.field-review` styling and become editable. Approve button = the demo's money moment — generous hit area, satisfying press. |
| `ActivityTrace` | 2 | Live tail of `agent_events` via `/api/events` SSE (EventSource with cursor resume). Monospace, timestamped, auto-scroll with pin. The "not a wrapper" proof. |
| `GraduationCard` | 6 | The 🎓 moment. Shows approvals count, editable cap (default ₹10,000), \[Not yet] / \[✅ Earn it, Otto]. Must feel like a moment: distinct accent border, slight delay before slide-in. |
| `TrustMeter` | 6 | Per action-type ladder chip: `Gated → Autonomous ≤ ₹cap`. Levels up with animation on graduation. Contains the revoke toggle (one flip, instant). |
| `ResurrectionProgress` | 5 | Streamed narration log ("Found 23 products…") + entity counters ticking up (`animate-tick-up`). Ends with the summary card → "This is my business ✅". |
| `SimulatedWhatsAppPane` | 6 | Chat-bubble mirror of outgoing WhatsApp sends. ALWAYS labeled "Simulated view — real send via Twilio sandbox". |
