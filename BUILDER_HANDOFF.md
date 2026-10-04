# Builder Handoff — NileCare
Canonical repo: alkadyenjy2/NileCare, main.
Product: medical-travel coordination only. Workflow NEW -> PAID/CLOSED_LOST. No diagnosis, prescriptions, or invented medical/clinic pricing.
Known architecture/context: Neon; prior 29/29 tests; staging previously nilecare-psi.vercel.app.
Known external blockers from prior audit: clinic/package approval, WhatsApp Cloud, Meta/Page activation, brand/legal. Paymob is not required now.
Rules: preserve architecture; do not fabricate clinics, packages, patients, prices, WhatsApp/Meta events, credentials, or production success.
Before builder credits: inspect current repo/tests/config and repair code-level issues locally.
Closure: tests/typecheck/build pass, deployment health verified where accessible, integrations fail closed when credentials are absent, exact blockers documented.
When credits return: pull latest main, run checks first, spend credits only on confirmed remaining defects, commit/push, verify CI/deploy.