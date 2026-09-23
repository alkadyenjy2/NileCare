# NileCare

NileCare is an independent clinic-coordination platform.

Repository: https://github.com/alkadyenjy2/NileCare

## Current engineering state

The internal implementation boundary includes:
- Next.js landing page and lead intake.
- Deterministic CRM stages with evidence-gated `paid` and reason-gated `closed_lost`.
- Commercial Offer Gate with approved real-offer requirement.
- Supabase persistence boundary plus production hardening migration.
- Paymob HMAC verification and idempotent payment-event boundary.
- WhatsApp webhook verification/signature validation and idempotent event boundary.
- Meta identity contamination guard; legacy Page ID `179969831856298` is blocked.
- AI provider abstraction with Hugging Face adapter and deterministic fallback.
- Content-bank schema/import gate for exactly 80 approved posts with unique images.
- Brand asset gate using explicit placeholders until official assets are supplied.
- GitHub Actions verification for typecheck, test suite, build, and self-check.

## External production gates

These cannot be truthfully fabricated:
1. Real Supabase project and production credentials.
2. Real clinic offer and commercial approval.
3. Real Paymob merchant credentials.
4. Real WhatsApp Cloud API credentials and verified number.
5. Verified NileCare Meta Page/Instagram identity and credentials.
6. Official NileCare brand kit.
7. Approved 80-post/image content bank.
8. Production deployment access.

## Verification rule

No provider integration is marked connected without real behavioral evidence from that provider. No fake clinic, patient, payment, testimonial, pricing, Meta identity, or approved content is committed.
