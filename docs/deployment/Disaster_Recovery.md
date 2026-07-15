# Disaster Recovery Plan for Otto

This document provides a high-level plan for recovering the Otto application in the event of a catastrophic failure (e.g., regional cloud outage, database loss, or severe security breach).

## 1. Recovery Time Objective (RTO) and Recovery Point Objective (RPO)
- **RTO (Target time to restore service)**: To be defined by business requirements (e.g., 4 hours).
- **RPO (Maximum acceptable data loss)**: Depends on database backup frequency. With continuous replication or Point-In-Time Recovery (PITR), the RPO is typically under 5 minutes.

## 2. Database Disaster Recovery

The PostgreSQL database is the most critical component as it stores all tenant data and agent state.

### Scenario: Database Instance Failure
1. **Managed Service Recovery**: If using a managed service like Supabase or AWS RDS, initiate an instance restore from the latest automated snapshot.
2. **Promote Replica**: If a Read Replica is configured in a different Availability Zone (AZ), promote the replica to the Primary instance and update the Next.js `DATABASE_URL` environment variable.

### Scenario: Accidental Data Deletion
1. Utilize Point-In-Time Recovery (PITR) to restore the database to the exact minute before the accidental deletion occurred.

## 3. Application Disaster Recovery

### Scenario: Hosting Region Outage (e.g., Vercel/AWS us-east-1 goes down)
1. Ensure the source code is hosted on a highly available Git provider (e.g., GitHub, GitLab).
2. Provision a new hosting environment in an unaffected region.
3. Configure the necessary environment variables (`DATABASE_URL`, `OPENROUTER_API_KEY`, etc.).
4. Trigger a new build and deployment (`pnpm build`, `pnpm start`) in the new region.
5. Update DNS records to point to the new application instance.

## 4. Third-Party Service Outages

Otto relies on external APIs (OpenRouter, Twilio). 
- **LLM Outage (OpenRouter)**: Otto uses OpenRouter which provides model fallbacks (e.g., GPT-4o primary, Gemini fallback). Ensure fallback models are correctly configured in the extraction logic.
- If OpenRouter itself goes down, the AI-driven agent core will pause. Human-gated actions can still be approved, but new extractions will fail gracefully until the API is restored.

## 5. Security Incident
In the event of compromised credentials:
1. Immediately rotate all compromised API keys (OpenRouter, Twilio) and database passwords.
2. Update the environment variables in the hosting platform.
3. Restart the application to ensure old connections are terminated and new credentials are used.
