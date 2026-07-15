# Git Workflow

## Overview
Otto uses a standard feature-branch workflow prioritizing clean history and code reviews.

## Workflow Steps

1. **Sync with Main**
   Ensure your local repository is up to date:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a Feature Branch**
   Branch off from `main` using the naming conventions defined in the Branching Strategy document.
   ```bash
   git checkout -b feat/add-whatsapp-integration
   ```

3. **Develop and Commit**
   - Write code and write tests where applicable.
   - Commit often in logical chunks.
   - Use conventional commit messages:
     - `feat:` for new features
     - `fix:` for bug fixes
     - `docs:` for documentation changes
     - `refactor:` for code refactoring
     - `chore:` for tooling and dependency updates

4. **Rebase or Merge with Main**
   Keep your branch updated with the latest changes from `main`.
   ```bash
   git fetch origin
   git rebase origin/main
   ```

5. **Pull Request (PR)**
   - Push your branch to the remote repository.
   - Open a PR against `main`.
   - Ensure CI checks (`pnpm typecheck`, `pnpm eval`, etc.) pass.
   - Obtain at least one review from a team member.

6. **Merge**
   - Once approved, merge using "Squash and Merge" to maintain a clean history on the `main` branch.
