# Risk Analysis: Otto

## 1. Technical & AI Risks

**Risk: LLM Hallucinations causing destructive business actions.**
- *Impact:* High. Ordering wrong inventory or sending incorrect POs can financially damage an SMB.
- *Mitigation:* Otto utilizes strict Schema-Locked Extraction via Zod. The LLM is forced to output structured JSON that aligns with the database schema. Furthermore, the "Autonomy Ladder" restricts automated spending to user-defined caps, and all actions have a 1-hour "undo" window with compensating transactions.

**Risk: Prompt Injection from malicious documents.**
- *Impact:* Medium. An uploaded invoice could contain hidden text instructing the AI to alter data.
- *Mitigation:* Strict separation of instructions and data in prompts. The schema lock ensures that injected instructions have no valid fields to map to, neutralizing the attack.

**Risk: Third-Party API Dependency (OpenRouter, OpenAI, Twilio).**
- *Impact:* High. Outages or price hikes directly impact Otto's margin and uptime.
- *Mitigation:* The architecture supports model fallbacks (e.g., GPT-4o primary, Gemini 2.x fallback). The deterministic agent state machine ensures that if an API fails, the action remains in a safe `planned` or `drafted` state, ready to retry without double-executing.

## 2. Market & Adoption Risks

**Risk: SMB Reluctance to Trust AI.**
- *Impact:* High. Business owners are notoriously protective of their operations.
- *Mitigation:* This is Otto's core differentiator. The product is designed around "Earned Autonomy." Nothing executes without human approval initially. Trust is quantified and visualized, bridging the psychological gap.

**Risk: Poor Data Input (Illegible handwriting, blurry photos).**
- *Impact:* Medium. Limits the effectiveness of "The Resurrection" onboarding.
- *Mitigation:* The extraction layer includes confidence scores per field. Any field scored <0.75 is highlighted in yellow for manual human review, preventing bad data from silently entering the system.

## 3. Legal & Compliance Risks

**Risk: Regulatory breaches in specialized domains (e.g., Healthcare, Legal).**
- *Impact:* High. 
- *Mitigation:* The Theme 2 domain playbooks currently operate as MVPs. Before scaling into strict regulatory environments, Otto will require HIPAA/GDPR compliance audits. The transparent audit trail (`agent_events` table) provides a foundational compliance mechanism.

**Risk: Liability for automated financial actions.**
- *Impact:* Medium. 
- *Mitigation:* Clear Terms of Service outlining that the user assumes responsibility for actions taken under "Autonomy Grants." The revokable nature and financial caps provide a technical shield against catastrophic errors.
