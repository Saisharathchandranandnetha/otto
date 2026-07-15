# Performance Testing

## Scope
Performance testing in Otto focuses on database efficiency, UI responsiveness, and mitigating LLM latency.

## Key Metrics
1. **LLM Latency:** 
   - While OpenRouter handles inference, Otto must gracefully manage long-running extractions (e.g., batch vision tasks).
   - Test UI loading states for 5-second to 30-second response delays.
2. **Database Queries:**
   - Monitor `postgres.js` query execution times. Ensure proper indexing on `actions`, `agent_events`, and `trust_grants`.
3. **Offline Demo Capabilities:**
   - Otto features a SHA-256 caching layer for inputs (`pnpm cache:warm`). 
   - Performance tests should verify that cached LLM responses load within <100ms.
4. **SSE Connections:**
   - Test the `/api/events` Server-Sent Events bus for memory leaks or disconnected client handling under load.
