# NileCare

NileCare is an independent clinic-coordination project. The repository contains the complete implementation boundary that can be safely completed without real third-party credentials, approved brand assets, or a verified clinic offer.

Repository: https://github.com/alkadyenjy2/NileCare

## Implemented and verified
- Responsive Next.js landing page.
- Lead domain validation and deterministic CRM stage-transition rules.
- `/api/lead` contract endpoint: invalid input returns 400; valid input is explicitly blocked with 503 until real Supabase persistence is configured.
- Supabase core schema with idempotent event constraints and deny-by-default RLS.
- WhatsApp, payment, pipeline and legal boundaries documented without pretending external systems are connected.
- `.env.example` contains configuration names only; no secrets.
- GitHub Actions CI builds the landing app and runs the repository self-check.
- No fake posts, testimonials, clinic pricing, payment links, patient data, or Meta identities are included.

## Production blockers — external inputs only
1. Approved NileCare brand kit and original 80-post/image bank.
2. Real clinic pricing/offer.
3. Real WhatsApp Cloud API credentials and verified number.
4. Real Paymob merchant/payment configuration.
5. Verified NileCare Meta Page/Instagram identity and credentials.
6. A real Supabase project to apply the migration and bind production authentication/policies.

These are intentionally not fabricated. Once supplied, they can be connected to the existing boundaries without redesigning the core.

## Verification rule
No external integration is reported as connected unless a real behavioral check produces evidence from that provider.
