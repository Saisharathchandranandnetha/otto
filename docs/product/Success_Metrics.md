# Success Metrics

## 1. Onboarding Metrics
- **Time to Value (TTV):** Average time from first document upload to a fully populated inventory/ledger (Target: < 3 minutes).
- **Extraction Accuracy:** Percentage of data fields (price, quantity, supplier info) correctly extracted without manual correction (Target: 98%+ via Zod schema lock).
- **Onboarding Completion Rate:** Percentage of users who complete "The Resurrection" process versus drop-offs.

## 2. Engagement & Trust Metrics
- **Approval Conversion Rate:** The percentage of human-gated recommendations (like purchase orders) that are approved without modification.
- **Autonomy Promotion Rate:** The percentage of users who accept Otto's request for a "promotion" to autonomous execution after 3 manual approvals.
- **Intervention Rate:** How often a user manually overrides or revokes an autonomous action (Target: < 2%).

## 3. Safety & System Metrics
- **Undo Rate:** Percentage of autonomous actions reversed within the 1-hour grace period.
- **System Latency:** Speed of the offline/online LLM extraction and response times for the approval feed.
- **Playbook Adoption:** Number of active users utilizing non-retail domain playbooks (e.g., Legal, HR).
