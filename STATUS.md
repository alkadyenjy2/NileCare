# NileCare — Current Execution Status

## Repository
Canonical repository: https://github.com/alkadyenjy2/NileCare
Current main: 6032160235be5ff6d8ecbb8addc95d93af655fc9.

## Fresh engineering evidence — 2026-10-05
- GitHub Actions run #122 for the current main commit completed successfully.
- Run ID: 37251179921.
- The CI workflow includes npm install, TypeScript, Next.js production build, the repository test suite, and self-check.
- The production health endpoint was added at `/api/health`.
- The test contract now also verifies the Neon production bootstrap applies the patient inquiry migration; fresh CI reports 46/46 checks and self-check PASS.
- The latest main commit is linked to the Vercel project created for NileCare.

## Runtime/deployment state
- Vercel project: `nilecare`
- Project ID: `prj_DBOBAsIt61tjCGb2dji913TMdYvu`
- Repository: `alkadyenjy2/NileCare`
- Production branch: `main`
- Initial deployment: `dpl_4kmr22z4dAPUqE9VTys5LhHV9WL8`
- Deployment automation is triggered from `main`; the latest engineering commit is `6032160235be5ff6d8ecbb8addc95d93af655fc9`.
- Vercel environment-variable list is currently empty, so production persistence/provider activation is not claimed.

## Persistence truth
- The canonical runtime defaults to Neon.
- `NILECARE_PERSISTENCE_PROVIDER=supabase` is an explicit legacy override; otherwise the provider is Neon.
- No dedicated NileCare Supabase production project currently exists in the connected Supabase account.
- Therefore the earlier instruction to “open a new Supabase project” is stale unless the product decision is changed back to Supabase.

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
- Neon bootstrap now applies `supabase/003_patient_inquiry.sql`, closing the patient-schema bootstrap mismatch.
- Production health endpoint.

## External production gates still blocked
1. Verified clinic commercial offer: price, terms, scope, delivery time and refund policy.
2. WhatsApp provider account, verified sending number and credentials.
3. Verified NileCare Meta Page/Instagram identity and credentials.
4. Official brand assets.
5. Approval/finalization of production posts and images.
6. Production environment secrets, especially the real database connection and webhook secret.
7. Final domain binding.
8. Paymob merchant configuration remains optional for the current manual-payment MVP and is not required to claim code/CI closure.

## Definition of closed
Repository-side engineering is closed for the currently available inputs. Vercel project linkage is now created, but production activation is not claimed until environment secrets and the remaining external business/provider gates are provisioned and behaviorally verified.

## Evidence rule
No provider or production state is marked successful without fresh evidence from the relevant system.
