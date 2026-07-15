# Contribution Guide

Thank you for your interest in contributing to Otto!

## Getting Started
1. Fork and clone the repository.
2. Ensure you have Node.js 18+ and Docker installed.
3. Install dependencies via `pnpm install`.

## Commit Guidelines
- Provide clear and concise commit messages.
- Ensure your commits reflect single, logical changes.

## Testing
- Ensure that extraction field accuracy is maintained. Run `pnpm eval` to verify.
- Check end-to-end flows with `pnpm flow all`.
- `pnpm cache:warm` must be run prior to committing to ensure the offline demo works flawlessly.
