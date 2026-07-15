# Authentication Design

## 1. Overview
Authentication in Otto is designed to ensure that business owners and employees can securely access their workspace and approve AI-generated workflows.

## 2. User Authentication (Next.js)
- **Session Management:** Secure HTTP-only cookies should be used to maintain sessions, standard in Next.js applications (e.g., using Auth.js).
- **Passwordless / MFA:** Given the sensitive nature of business data and autonomous approvals, passwordless login (magic links) or mandatory Multi-Factor Authentication (MFA) is highly recommended.

## 3. Webhook Authentication
- **Twilio Webhooks:** All incoming WhatsApp messages must be verified using the `X-Twilio-Signature`.
- **Otto Engine Validation:** If `OTTO_ENGINE_URL` is used, interactions between the core and the engine should be authenticated via `OTTO_ENGINE_KEY`.

## 4. API Authentication
- **Server-to-Server:** Any server-to-server calls should use robust Bearer tokens.
- **Frontend-to-Backend:** Next.js App Router utilizes secure server actions and route handlers, where the session is validated server-side before execution.
