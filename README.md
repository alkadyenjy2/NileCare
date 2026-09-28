# NileCare

NileCare is an independent clinic-coordination platform for organizing real clinic-service inquiries and operational handoffs.

Repository: https://github.com/alkadyenjy2/NileCare

## Current engineering state

The implementation boundary includes:
- Next.js landing page and lead intake.
- Deterministic CRM stages with evidence-gated `paid` and reason-gated `closed_lost`.
- Clinic-specific Commercial Offer Gate with approved real-offer requirement.
- Neon PostgreSQL as the default production persistence provider; Supabase is supported only when explicitly selected.
- Paymob HMAC verification and idempotent payment-event boundary as an optional Phase 2 provider.
- MVP manual-payment architecture for clinic-approved bank transfer/Vodafone Cash-style flows, with evidence required before `paid`.
- WhatsApp webhook verification/signature validation and idempotent event boundary.
- Meta identity contamination guard; legacy Page ID `179969831856298` is blocked.
- AI provider abstraction with Hugging Face adapter and deterministic fallback.
- Content-bank schema/import gate for exactly 80 approved posts with unique images.
- Brand asset gate using explicit placeholders until official assets are supplied.
- GitHub Actions verification for typecheck, test suite, build, and self-check.

## Service model

NileCare's internal service definition is:
1. Intake and normalize a real inquiry.
2. Qualify and route the inquiry to a participating clinic/service.
3. Coordinate clinic-approved service and appointment information.
4. Keep communication and operational events traceable.
5. Present only clinic-approved commercial terms.
6. Track payment evidence and hand off the case operationally.

NileCare does not diagnose, prescribe, guarantee outcomes, or invent clinic data, prices, availability, testimonials, or credentials.

See `docs/SERVICE_MODEL.md` for the internal service definition and `docs/OFFLINE_PAYMENT_FLOW.md` for the MVP payment fallback.

## Persistence provider

NileCare production defaults to Neon. The provider can be overridden only when explicitly required:

- `NILECARE_PERSISTENCE_PROVIDER=neon` (recommended/default)
- `NILECARE_PERSISTENCE_PROVIDER=supabase` (legacy-compatible explicit override)
- `DATABASE_URL=<Neon PostgreSQL connection string>` for Neon

The Neon adapter uses Neon's SQL-over-HTTP endpoint directly with `fetch`; it does not add an npm dependency. The PostgreSQL schema is defined by the repository migrations under `supabase/` and has been applied to the real Neon production database through the existing GitHub Actions bootstrap workflow.

## External production gates

These cannot be truthfully fabricated:
1. Real participating clinic + clinic-approved commercial package.
2. Real WhatsApp Cloud API credentials and verified sending number, if automated WhatsApp is required.
3. Verified NileCare Meta Page/Instagram identity and credentials, if Meta automation is required.
4. Official NileCare brand kit for official publishing.
5. Approved 80-post/image content bank for publishing.
6. Final legal/commercial scope and applicable account/domain configuration.

Paymob is **optional for the MVP**. It can be enabled later as a payment-provider adapter. Manual payment is only valid when the clinic supplies real payment details/terms and an authorized operator verifies payment evidence.

## Verification rule

No provider integration is marked connected without real behavioral evidence from that provider. No fake clinic, patient, payment, testimonial, pricing, Meta identity, or approved content is committed.

CI/build success proves repository integrity; it does not prove that external provider accounts are provisioned.

## Closure boundary

The internal engineering track is closed only when all safe repository-side work is complete and verified. Production activation remains a separate provisioning step for real clinic approvals, provider identities/credentials, official assets, and legal/commercial inputs.
