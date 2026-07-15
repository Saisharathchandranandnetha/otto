# Release Planning

## Release v1.0 (The TakeOver'26 MVP)
**Target:** Hackathon Demo
**Features:**
- Next.js 14 frontend with Approval Feed and simulated WhatsApp UI.
- `pnpm db:seed` with "Priya's Fashion" demo tenant.
- Vision extraction pipeline with mock fallback (`EXTRACTOR_MODE=mock`).
- Basic Autonomy Ladder: 3 approvals trigger promotion prompt.
- 1-hour undo queue (simulated).
- Hardcoded domain playbook staging.

## Release v1.1 (The Connectivity Update)
**Target:** First Beta Testers
**Features:**
- Live Twilio WhatsApp integration (replacing the simulated UI).
- Real `OTTO_ENGINE_URL` integration replacing deterministic local fallbacks.
- Supabase native migration support for easy cloud deployment.
- Improved Zod schemas for edge-case invoice formats (e.g., blurry photos, international currencies).

## Release v1.2 (The Multi-Domain Update)
**Target:** General Availability (SMB Market)
**Features:**
- Full launch of 8 Domain Playbooks (Education, Healthcare, HR, Legal, Manufacturing, Sales, Customer Support, Retail).
- Advanced Trust Meter with granular, per-domain revocation toggles.
- End-to-end evaluation suite (`pnpm eval`) running continuously against a growing dataset of real-world SMB artifacts.
