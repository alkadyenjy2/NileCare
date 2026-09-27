# Deep Audit — NileCare

## Audit scope
Canonical repository: alkadyenjy2/NileCare.
Audit refreshed against main head `ea73d13cf2b608768ffe082e701b421a275fc355`.

## Verified repository state
- Canonical branch: `main`.
- Repository is public, unarchived, and the linked GitHub integration has push/admin permissions.
- No open GitHub issues.
- No open GitHub pull requests.
- Repository tree contains the Next.js landing app, deterministic CRM/domain layer, Neon/Supabase persistence adapters, Paymob and WhatsApp webhook boundaries, Meta identity guard, content/brand gates, legal templates, CI and Neon bootstrap workflows.
- Latest CI for the current head is run #76 (`36337458468`) and completed successfully.
- CI executed dependency installation, TypeScript compilation, Next.js build, repository test suite and self-check.
- Repository test suite remains 32/32; self-check passes in CI.
- The latest security changes harden Meta identity verification, Paymob configuration detection and lead input length bounds.

## Static/spec findings
- Neon is the default persistence provider; Supabase is only selected explicitly.
- Database access is deny-by-default for `anon` and `authenticated` roles in the repository migrations.
- Payment state requires provider evidence; `closed_lost` requires a reason.
- Paymob HMAC and WhatsApp signature verification use timing-safe comparisons.
- Paymob checkout callback URLs derive from the incoming request origin.
- Meta blocks the legacy ZE/ZA Page ID and now also requires the returned Page name to match the NileCare identity rule.
- Production content remains blocked unless exactly 80 approved posts with unique images are supplied.
- Official brand assets remain blocked; provisional assets are explicitly non-publishable.
- No production credentials are committed to the repository.

## Behavioral evidence
- GitHub Actions repository execution is verified through CI runs.
- Neon production connectivity/schema application was previously verified through the dedicated production bootstrap workflow; this is provider-side evidence recorded in the project documentation.
- Current public runtime is NOT VERIFIED from the connected Vercel/browser surfaces: the known staging URL is not accessible through the currently authorized Vercel connection and public web fetch.
- Paymob, WhatsApp and Meta provider behavior are NOT VERIFIED because real provider credentials/identities are not currently available to the connected tools.

## External blockers
- Verified clinic commercial offer and legal/commercial approval.
- Paymob merchant configuration and credentials.
- WhatsApp Business account, verified number and credentials.
- Verified NileCare Meta Page/Instagram identity and credentials.
- Official brand kit.
- Approved 80-post/image content bank.
- Commercial production hosting/account access, production secrets and final domain binding.

## Integrity rule
No external provider is marked connected without provider evidence. Missing inputs remain blocked; placeholders are never treated as production data.