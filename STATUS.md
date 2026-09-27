# NileCare — Current Execution Status

## Repository
Canonical repository: https://github.com/alkadyenjy2/NileCare

## Fresh engineering evidence
- Current main head: 5f804be84623e57fec01f9914181a95f98cafbb1.
- GitHub Actions NileCare CI run #67 (36327014617) completed successfully on the current head.
- CI verified dependency installation, TypeScript compilation, Next.js build, test suite, and self-check.
- Repository test suite: 32/32.
- Neon is the default production persistence provider; Supabase is used only when explicitly selected.
- Real Neon credentials/project and NileCare schema migrations were previously verified through the production Neon bootstrap workflow.
- Paymob checkout callback URLs are derived from the incoming request origin; no staging callback is hard-coded into the production checkout route.
- Vercel remains staging-only. No commercial production promotion is asserted.
- Cloudflare Free/workers.dev is not used as a commercial-production substitute.
- Railway and unrelated projects are not used for NileCare.

## Internal gates implemented
- Lead validation and persistence boundary.
- Evidence-gated CRM transitions.
- Commercial Offer Gate.
- PostgreSQL production hardening and deny-by-default access.
- Paymob HMAC verification and idempotent events.
- WhatsApp verification/signature validation and idempotent events.
- Meta identity contamination guard.
- AI provider abstraction.
- Content and brand gates.
- CI verification suite.
- Runtime hardening.
- Paymob callback origin routing.
- Neon fail-closed persistence default.

## External production gates still blocked
1. Verified clinic commercial offer: price, terms, scope, delivery time and refund policy.
2. Paymob merchant configuration and credentials.
3. WhatsApp provider account, verified sending number and credentials.
4. Verified NileCare Meta Page/Instagram identity and credentials.
5. Official brand assets.
6. Approval and finalization of the 80 production posts/images.
7. Commercial production hosting/account access.
8. Production secrets and final domain binding.

## Decision
1. Keep Neon as production PostgreSQL.
2. Keep Vercel as staging unless the account/plan is explicitly eligible for commercial production.
3. Keep all external integrations fail-closed until real credentials and provider evidence exist.
4. Do not fabricate commercial terms, identities, credentials, brand assets, patient data, testimonials, pricing, or approved content.
5. Do not spend scarce/paid resources merely to bypass an external provisioning gate.

## Definition of closed
The repository-side engineering track is closed when no safe internal change remains that depends on unavailable external inputs. Production activation is not claimed until the external gates above are provisioned and behaviorally verified.

## Evidence rule
No “done”, “connected”, “deployed to production”, or provider “success” claim is valid without fresh execution evidence from the relevant system.
