# Authentication Flow

The Otto API is currently designed for a controlled demonstration and hackathon environment. As such, the authentication flow favors a frictionless client-side gate rather than strict server-side authorization.

## Current Implementation

1. **Client-Side Login:**
   - The user interacts with the `LoginScreen` component (`src/components/LoginScreen.tsx`).
   - Hardcoded credentials (`admin` / `otto2026`) are validated locally in the browser (`src/lib/auth.tsx`).
   - Upon successful login, a flag `otto_auth=true` is saved to the browser's `localStorage`.

2. **API Access:**
   - **No Server-Side Validation:** The API routes (`/api/*`) currently do NOT validate any session cookies, JWTs, or Authorization headers.
   - **Open Endpoints:** Requests sent directly to the API endpoints without `localStorage` state will still execute successfully.

## Security Warning
This implementation is **NOT suitable for production**. 
Before deploying this application in a real-world scenario, you must implement a robust authentication strategy:
- Add a session management library (e.g., NextAuth.js).
- Protect all API endpoints by verifying server-side sessions before processing requests.
- Secure SSE streams (`/api/events`) by passing and validating authentication tokens during the connection handshake.
