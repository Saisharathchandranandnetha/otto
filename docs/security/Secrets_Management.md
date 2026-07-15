# Secrets Management

## 1. Environment Variables
Otto relies on sensitive environment variables to operate:
- `DATABASE_URL`: Postgres connection string.
- `OPENROUTER_API_KEY`: Key for LLM extraction (GPT-4o, Gemini).
- `TWILIO_ACCOUNT_SID` & `TWILIO_AUTH_TOKEN`: WhatsApp integration credentials.
- `OTTO_ENGINE_KEY`: Core engine API key.

## 2. Storage & Injection
- **Local Development:** Secrets are stored in a local `.env` file (which is git-ignored). A `.env.example` file is provided for developer onboarding without exposing real secrets.
- **Production:** Secrets should be managed by the deployment platform's secure vault (e.g., Vercel Environment Variables, AWS Secrets Manager, or Doppler).

## 3. Access Control
- Next.js ensures that variables not prefixed with `NEXT_PUBLIC_` are kept securely on the server and are never exposed to the browser bundle.

## 4. Secret Rotation
- Twilio and OpenRouter API keys should be rotated every 90 days.
- Database passwords should be regularly rotated, especially if team members offboard.
