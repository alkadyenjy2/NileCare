# Deep Audit — NileCare

## Audit scope
Canonical repository: alkadyenjy2/NileCare.
Last code-bearing verified head: `1faf0ae8e146bfe493ee368ce3312514dc3abdb0`.
The branch now contains documentation-only refreshes after that verified code state.

## Verified repository state
- Canonical branch: `main`.
- Repository is public and unarchived.
- No open GitHub issues.
- No open GitHub pull requests.
- Repository contains the Next.js landing app, deterministic CRM/domain layer, Neon/Supabase persistence adapters, Paymob and WhatsApp webhook boundaries, Meta identity guard, content/brand gates, legal templates, CI and Neon bootstrap workflows.
- CI #79 (`36337572058`) completed successfully on the last code-bearing head.
- CI executed dependency installation, TypeScript compilation, Next.js build, repository test suite and self-check.
- Repository test suite: 32/32; self-check passed.
- Security hardening covers Meta identity verification, Paymob configuration detection and lead input length bounds.

## Static/spec findings
- Neon is the default persistence provider; Supabase is selected only explicitly.
- Database access is deny-by-default for `anon` and `authenticated` roles in repository migrations.
- Payment state requires provider evidence; `closed_lost` requires a reason.
- Paymob HMAC and WhatsApp signature verification use timing-safe comparisons.
- Paymob checkout callback URLs derive from the incoming request origin.
- Meta blocks the legacy ZE/ZA Page ID and validates the returned NileCare Page identity.
- Production content remains blocked unless exactly 80 approved posts with unique images are supplied.
- Official brand assets remain blocked; provisional assets are explicitly non-publishable.
- No production credentials are committed.

## Behavioral evidence
- GitHub Actions repository execution is verified through CI #79.
- Neon connectivity/schema application was previously verified through the dedicated production bootstrap workflow.
- Vercel production deployment dpl_5sMdJ6UiVp6HpmEcisktmmApAs3W is VERIFIED READY with the production alias nilecare-psi.vercel.app.
- Public smoke tests are VERIFIED: home 200; invalid lead 400; protected offer 401; protected Paymob intention 401; WhatsApp webhook GET 403.
- Production Neon connectivity is VERIFIED with a read-only select 1 query; no application data was written.
- Paymob, WhatsApp and Meta provider behavior are NOT VERIFIED because real provider credentials/identities are unavailable to the connected tools.

## External blockers
- Verified clinic commercial offer and commercial/legal approval.
- Paymob merchant configuration and credentials.
- WhatsApp Business account, verified number and credentials.
- Verified NileCare Meta Page/Instagram identity and credentials.
- Official brand kit.
- Approved 80-post/image content bank.
- Final custom domain binding.
- Paymob merchant configuration/credentials, WhatsApp Business credentials, Meta identity/credentials, clinic commercial offer, official brand kit, and approved 80-post/image content bank.

## Integrity rule
No external provider is marked connected without provider evidence. Missing inputs remain blocked; placeholders are never treated as production data.