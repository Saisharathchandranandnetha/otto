# Branching Strategy

## Core Branches

- **`main`**: The primary branch representing the current, stable, production-ready state of the application. All deployments to production happen from this branch.

## Supporting Branches

- **Feature Branches (`feat/*`)**: Used for developing new features.
  - Sourced from: `main`
  - Merged into: `main`
  - Example: `feat/document-generation-agent`

- **Bugfix Branches (`fix/*`)**: Used to fix issues found in development or production.
  - Sourced from: `main`
  - Merged into: `main`
  - Example: `fix/db-connection-timeout`

- **Hotfix Branches (`hotfix/*`)**: Used for urgent fixes required directly in production.
  - Sourced from: `main`
  - Merged into: `main`
  - Example: `hotfix/twilio-webhook-error`

- **Chore/Tooling Branches (`chore/*`)**: Used for updating dependencies, configuration, or structural changes not directly affecting application behavior.
  - Sourced from: `main`
  - Merged into: `main`
  - Example: `chore/update-nextjs`

## Naming Convention
Branches should be lowercase and hyphen-separated. Include ticket or issue numbers if a tracker is used.
`[type]/[issue-number]-[short-description]`

Example: `feat/OTTO-123-trust-meter-ui`
