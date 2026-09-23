# NileCare

NileCare is an independent clinic-coordination platform.

Repository: https://github.com/alkadyenjy2/NileCare

## Current engineering state

The internal implementation boundary includes:
- Next.js landing page and lead intake.
- Deterministic CRM stages with evidence-gated `paid` and reason-gated `closed_lost`.
- Commercial Offer Gate with approved real-offer requirement.
- Provider-selectable persistence: Supabase remains supported; Neon PostgreSQL is now available as a dependency-free serverless HTTP adapter.
- Paymob HMAC verification and idempotent payment-event boundary.
- WhatsApp webhook verification/signature validation and idempotent event boundary.
- Meta identity contamination guard; legacy Page ID `179969831856298` is blocked.
- AI provider abstraction with Hugging Face adapter and deterministic fallback.
- Content-bank schema/import gate for exactly 80 approved posts with unique images.
- Brand asset gate using explicit placeholders until official assets are supplied.
- GitHub Actions verification for typecheck, test suite, build, and self-check.

## Persistence provider switch

Default behavior remains Supabase for backward compatibility.

To use Neon PostgreSQL instead, configure:
- `NILECARE_PERSISTENCE_PROVIDER=neon`
- `DATABASE_URL=<Neon PostgreSQL connection string>`

The Neon adapter uses Neon's SQL-over-HTTP endpoint directly with `fetch`; it does not add an npm dependency. Neon documents SQL-over-HTTP for serverless/edge environments and the `https://<host>/sql` endpoint pattern. citeturn2search0turn0search0

The database schema remains PostgreSQL-compatible, so the existing `supabase/001_nilecare_core.sql` and `supabase/002_production_hardening.sql` migrations are the schema source and must be applied to the real Neon database before production use.

## External production gates

These cannot be truthfully fabricated:
1. Real PostgreSQL production project and credentials (Supabase or Neon).
2. Real clinic offer and commercial approval.
3. Real Paymob merchant credentials.
4. Real WhatsApp Cloud API credentials and verified number.
5. Verified NileCare Meta Page/Instagram identity and credentials.
6. Official NileCare brand kit.
7. Approved 80-post/image content bank.
8. Production deployment access.

## Verification rule

No provider integration is marked connected without real behavioral evidence from that provider. No fake clinic, patient, payment, testimonial, pricing, Meta identity, or approved content is committed.
