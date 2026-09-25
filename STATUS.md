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

## Fresh execution evidence
- main head: 7886a11.
- Local verification after the latest SQL hardening changes: NILECARE_TEST_SUITE=29/29 PASS, NILECARE_SELF_CHECK=PASS, NO_FAKE_POSTS=PASS, IDEMPOTENCY_CONSTRAINT=PASS, DOMAIN_VALIDATION_SOURCE_PRESENT=PASS, NEON_PROVIDER_SOURCE_PRESENT=PASS, PROVIDER_SELECTION_SOURCE_PRESENT=PASS, and git diff --check.
- GitHub Actions Neon bootstrap run 36083378041 completed successfully.
- That run verified the existing Neon credentials/project, resolved the production connection without exposing the URI, verified database connectivity, applied both NileCare schema migrations, and verified the expected production tables.
- The Neon provider is now the selected production PostgreSQL path. Supabase is not required for production.
- Vercel project nilecare was created and a fresh Next.js deployment completed successfully as a technical/staging deployment: https://nilecare-psi.vercel.app.
- The Vercel deployment is not being treated as commercial production because the current Vercel Hobby terms restrict that plan to personal/non-commercial use.
- Vercel Neon marketplace installation was attempted but requires authenticated browser terms acceptance; no Vercel integration or billing change was made.

## External gates still BLOCKED
- Real clinic commercial offer: verified price, terms, delivery scope and refund policy.
- WhatsApp: provider account, verified sending number and credentials.
- Paymob: merchant/payment configuration and credentials.
- Meta: verified NileCare Page/Instagram identity and credentials.
- Official brand assets.
- Approved 80 production posts/images.
- Commercial production hosting/database binding. The technical Neon database exists and is schema-verified; the remaining binding step must use a hosting path whose terms permit commercial production.
- Vercel Neon marketplace terms acceptance is an optional route, not a requirement if another compliant hosting path is selected.

## Decision
The current lowest-friction technical path is:
1. Keep Neon as the PostgreSQL provider.
2. Keep Vercel deployment as staging only unless the account/plan is changed to a commercial-eligible plan.
3. Do not fabricate the clinic offer, provider credentials, Meta identity, brand assets, or approved content.
4. Use a commercial-eligible production host once its account/access is available; do not substitute a free tier that explicitly prohibits production use.

## Evidence rule
Build/test/deployment claims require fresh execution evidence. Repository presence or static review is not runtime success. Production activation remains blocked until the real external inputs above are provisioned.
