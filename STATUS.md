# NileCare — Current Execution Status

## Repository
Canonical repository: https://github.com/alkadyenjy2/NileCare
Current main: 204060c90d10165e2c53b7a4ac2ed80cdc7ad812.
Branch: main.

## Fresh engineering evidence — 2026-10-05
- GitHub Actions verification for the security-hardening commits completed successfully.
- The CI workflow runs npm install, critical npm audit, TypeScript, Next.js production build, the repository test suite, and self-check.
- The repository test contract verifies the Neon production bootstrap applies the patient inquiry migration; fresh suite evidence is 46/46 PASS and self-check PASS.
- Next.js is pinned to 16.3.8 with the lockfile aligned; npm audit --audit-level=critical passed.
- The latest main commit is linked to the NileCare Vercel project.

## Runtime/deployment state
- Vercel project: nilecare
- Project ID: prj_DBOBAsIt61tjCGb2dji913TMdYvu
- Repository: alkadyenjy2/NileCare
- Production branch: main
- Latest observed production deployment: dpl_EjdCLqEzjbZBZNebY6ovq4ERgni5, READY, target production.
- Latest observed deployment URL: https://nilecare-lr5e2ll9x-enjy2026.vercel.app
- Production health was externally verified at this deployment: HTTP 200 with service=nilecare and status=ok.
- Current Vercel project metadata shows password protection disabled, SSO protection disabled, and trusted IP protection disabled.

## Persistence truth
- Canonical runtime defaults to Neon.
- NILECARE_PERSISTENCE_PROVIDER=supabase is an explicit legacy override; otherwise the provider is Neon.
- Vercel currently contains production secrets named DATABASE_URL and NILECARE_PERSISTENCE_PROVIDER. Secret values are intentionally not exposed by the provider, so valid Neon connectivity is not claimed until behaviorally verified.
- No dedicated NileCare Supabase production project is required for the current architecture.

## Internal gates implemented
- Lead validation and persistence boundary.
- Evidence-gated CRM transitions.
- Commercial Offer Gate.
- PostgreSQL production hardening and deny-by-default access.
- Paymob HMAC verification and idempotent events.
- WhatsApp verification/signature validation and idempotent events.
- Meta identity contamination guard and returned Page identity check.
- AI provider abstraction.
- Content and brand gates.
- CI verification suite.
- Runtime hardening.
- Paymob callback origin routing.
- Neon fail-closed persistence default.
- Neon bootstrap applies supabase/003_patient_inquiry.sql.
- Production health endpoint.

## External production gates still blocked
1. Real Neon connection must be behaviorally verified in production; the secret exists but its value is not exposed for inspection.
2. Verified clinic commercial offer: price, terms, scope, delivery time and refund policy.
3. WhatsApp provider account, verified sending number and credentials, if automated WhatsApp is required.
4. Verified NileCare Meta Page/Instagram identity and credentials, if Meta intake is required.
5. Official brand assets or explicit approval of the current brand treatment.
6. Approval/finalization of production posts and images.
7. Final domain binding/ownership.
8. Paymob merchant configuration is optional for the current manual-payment MVP.

## Zero-cost launch alternative
The current architecture can launch without Paymob by keeping payment manual and evidence-gated. WhatsApp can remain a direct contact channel until a verified WhatsApp Cloud API account exists. No fake clinic, payment, provider identity, patient, webhook, or social data may be introduced.

## Definition of closed
Repository-side engineering is closed for the currently available inputs. Full production activation is not claimed until the external gates above are provisioned and behaviorally verified.

## Evidence rule
No provider or production state is marked successful without fresh evidence from the relevant system.
