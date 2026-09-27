# NileCare — Current Execution Status

## Repository
Canonical repository: https://github.com/alkadyenjy2/NileCare

## Engineering gates implemented
- Lead validation and persistence boundary.
- Evidence-gated CRM transitions.
- Commercial Offer Gate.
- PostgreSQL production hardening.
- Paymob HMAC verification and idempotent events.
- WhatsApp verification/signature validation and idempotent events.
- Meta contamination guard.
- AI provider abstraction.
- Content and brand gates.
- CI verification suite.
- Runtime hardening: invalid stage values are rejected safely; lead-form network failures become actionable errors; malformed WhatsApp JSON returns a controlled 400.
- Paymob checkout callback routing is derived from the request origin, preventing a staging-domain callback from being hard-coded into production checkout flows.

## Fresh execution evidence
- Current main head: aa9e47cee189779a975ee562709f49ebf2646868.
- GitHub Actions NileCare CI run 36287531502 (#63) completed successfully on the current head.
- The CI run verified dependency installation, TypeScript compilation, Next.js build, test suite, and self-check.
- The test suite was extended to cover the Paymob callback-origin routing change before the CI run.
- Neon remains the selected production PostgreSQL provider. Prior successful Neon bootstrap evidence verified the existing Neon credentials/project, production connection resolution without exposing the URI, database connectivity, both NileCare schema migrations, and expected production tables.
- Vercel project nilecare has a successful technical/staging deployment at https://nilecare-psi.vercel.app.
- The Vercel deployment remains staging only because the current Hobby plan is not being used as commercial production.
- Cloudflare Workers was re-evaluated as a free-first candidate. Current Cloudflare documentation says the Free Workers plan provides 100,000 requests/day and 10ms CPU/invocation, but Cloudflare recommends custom-domain/route Workers for production and describes workers.dev as intended for personal/hobby projects that are not business-critical. Therefore Cloudflare Free is not being treated as a compliant NileCare commercial-production substitute.

## External gates still BLOCKED
- Real clinic commercial offer: verified price, terms, delivery scope and refund policy.
- WhatsApp: provider account, verified sending number and credentials.
- Paymob: merchant/payment configuration and credentials.
- Meta: verified NileCare Page/Instagram identity and credentials.
- Official brand assets.
- Approved 80 production posts/images.
- Commercial production hosting/account access.
- Production environment secrets/database binding.

## Decision
1. Keep Neon as the PostgreSQL provider.
2. Keep Vercel deployment as staging only unless the account/plan is changed to a commercial-eligible plan.
3. Do not fabricate the clinic offer, provider credentials, Meta identity, brand assets, or approved content.
4. Do not promote a free hosting tier whose documented positioning is personal/hobby or non-business-critical to commercial production.
5. Continue completing all code-side work and evidence gates that do not require the blocked external credentials.

## Evidence rule
Build/test/deployment claims require fresh execution evidence. Repository presence or static review is not runtime success. Production activation remains blocked until the real external inputs above are provisioned.
