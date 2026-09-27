# NileCare

NileCare is an independent clinic-coordination platform.

Repository: https://github.com/alkadyenjy2/NileCare

## Current engineering state

The implementation boundary includes:
- Next.js landing page and lead intake.
- Deterministic CRM stages with evidence-gated `paid` and reason-gated `closed_lost`.
- Commercial Offer Gate with approved real-offer requirement.
- Neon PostgreSQL as the default production persistence provider; Supabase is supported only when explicitly selected.
- Paymob HMAC verification and idempotent payment-event boundary.
- WhatsApp webhook verification/signature validation and idempotent event boundary.
- Meta identity contamination guard; legacy Page ID `179969831856298` is blocked.
- AI provider abstraction with Hugging Face adapter and deterministic fallback.
- Content-bank schema/import gate for exactly 80 approved posts with unique images.
- Brand asset gate using explicit placeholders until official assets are supplied.
- GitHub Actions verification for typecheck, test suite, build, and self-check.

## Persistence provider

NileCare production defaults to Neon. The provider can be overridden only when explicitly required:

- `NILECARE_PERSISTENCE_PROVIDER=neon` (recommended/default)
- `NILECARE_PERSISTENCE_PROVIDER=supabase` (legacy-compatible explicit override)
- `DATABASE_URL=<Neon PostgreSQL connection string>` for Neon

The Neon adapter uses Neon's SQL-over-HTTP endpoint directly with `fetch`; it does not add an npm dependency. The PostgreSQL schema is defined by the repository migrations under `supabase/` and has been applied to the real Neon production database through the existing GitHub Actions bootstrap workflow.

## External production gates

These cannot be truthfully fabricated:
1. Real clinic offer and commercial approval.
2. Real Paymob merchant credentials and configuration.
3. Real WhatsApp Cloud API credentials and verified sending number.
4. Verified NileCare Meta Page/Instagram identity and credentials.
5. Official NileCare brand kit.
6. Approved 80-post/image content bank.
7. Commercial production hosting/account access.
8. Production environment secrets and final domain binding.

## Verification rule

No provider integration is marked connected without real behavioral evidence from that provider. No fake clinic, patient, payment, testimonial, pricing, Meta identity, or approved content is committed.

CI/build success proves repository integrity; it does not prove that external provider accounts are provisioned.

## Closure boundary

The internal engineering track is considered closed when all safe repository-side work is complete and verified. Production activation remains a separate provisioning step because external account credentials, commercial approvals, and official assets cannot be invented or bypassed.
