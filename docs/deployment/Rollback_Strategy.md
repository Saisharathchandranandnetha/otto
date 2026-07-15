# Rollback Strategy for Otto

In the event of a failed deployment or critical bug introduced in production, this document outlines the steps to revert the Otto application to a previous stable state.

## 1. Application Rollback

Since Otto is a Next.js application, rolling back the application code is typically the fastest and easiest step.

### Vercel / Managed PaaS
If hosted on a modern PaaS like Vercel:
1. Navigate to the project deployments dashboard.
2. Identify the last known good deployment.
3. Click "Promote to Production" or "Rollback" to instantly switch routing to the stable build.

### Custom Hosting
If hosted manually:
1. Use `git revert` or checkout the previous stable commit tag.
2. Re-run `pnpm build`.
3. Restart the Node.js server (`pnpm start`).

## 2. Database Rollback

Rolling back database changes is significantly more complex and risky than rolling back code. 

**Core Principle**: Migrations should ideally be backwards compatible. Avoid destructive database changes (like dropping columns) until you are absolutely certain the code no longer needs them.

### Strategy A: Roll Forward (Preferred)
Instead of rolling back the database, deploy a hotfix to the code that is compatible with the new database schema.

### Strategy B: Restoring from Backup
If a migration caused irrecoverable data corruption:
1. Stop all application traffic to prevent further corrupted data entry.
2. Restore the database from the automated backup taken immediately before the deployment.
3. Roll back the application code to the version that matches the restored database schema.
4. Resume application traffic.

### Note on Idempotent Actions
Otto's Agent Core is designed with idempotent approvals (`UPDATE actions SET status = $to WHERE id = $id AND status = $from`). This reduces the risk of duplicate or erroneous actions during a rollback scenario where requests might be retried.
