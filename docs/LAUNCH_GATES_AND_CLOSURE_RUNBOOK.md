# NileCare — Launch Gates and Closure Runbook

**Status:** operational guide only. No production deployment, database writes, real patient submissions, social posts, or provider calls were performed.

## Executive decision

Use a **private, non-production verification path first**. Do not call NileCare launch-ready until persistence, access control, legal review, and clinic-partner evidence are proven.

### Facts verified in the repository

- Current main commit audited: `010d87c55b2e11172957ab00e0dfebdc55d2e7f4`; CI run: https://github.com/alkadyenjy2/NileCare/actions/runs/39896168222
- The public lead handler exists at `nilecare-landing/app/api/lead/route.ts`; persistence is implemented in `nilecare-landing/lib/supabase.ts` and defaults to Neon unless `NILECARE_PERSISTENCE_PROVIDER=supabase`.
- The current schema alignment file is **`supabase/003_patient_inquiry.sql`**. It alters `public.leads`; it does **not** create a `patient_inquiries` table. Do not run a command copied from an old handover that points to `supabase/migrations/003_patient_inquiry.sql` or test `patient_inquiries` until the actual schema is deliberately changed and reviewed.
- The current main branch does not contain the reported new Admin/Auth files at their expected paths (`app/admin/page.tsx`, `auth.ts`, `middleware.ts`, `lib/admin-guard.ts`, `app/api/admin/leads/route.ts`). Do not treat the Admin dashboard or login as deployed functionality.
- PR #17 adds isolated persistence/permission tests and prevents the public lead endpoint from returning database error details. Its reported PGlite tests are not proof against the real Neon database or deployed Vercel app, and the PR's test is not yet part of CI: https://github.com/alkadyenjy2/NileCare/pull/17

## Gate 1 — Neon database (non-production first)

1. Sign in to Neon using the project owner's account and create a **separate test project** for NileCare. Choose the region closest to the intended application deployment.
2. In the Neon dashboard, open **Connect** and copy the pooled connection string for the application. Store it locally as `DATABASE_URL`. Copy the direct/unpooled connection string as `DIRECT_URL` only if an administrative migration workflow actually uses it. Keep both values secret; never paste them into chat, issues, or commits.
3. Confirm the schema in the test project before applying anything. The checked-in migrations are under `supabase/`, not `supabase/migrations/`. Review `supabase/001_nilecare_core.sql`, `supabase/002_production_hardening.sql`, and `supabase/003_patient_inquiry.sql` in order against the test database.
4. Only after confirming the target is the **test** database and the SQL matches that schema, run the repository's actual migration path, for example:
   ```bash
   psql "$DIRECT_URL" -v ON_ERROR_STOP=1 -f supabase/003_patient_inquiry.sql
   ```
   Do not execute this on production as a shortcut. The migration is currently designed around `public.leads`, not `patient_inquiries`.
5. Verify table and column names first, then run a synthetic test lead through the actual route and read it back using the same test database. Confirm a second fresh connection can read the row, and that a failed write is never reported as success. Use only synthetic data—no real patient details.
6. Record the migration result, schema version, and test evidence without recording credentials or patient data.

**Pass condition:** a test-only lead persists and can be read after reconnect; invalid/failed requests write no row; no public response reveals database internals. This is not production proof.

## Gate 2 — Vercel environment and protection

1. Open Vercel Dashboard → the NileCare project → **Settings → Environment Variables**.
2. Add values only after their corresponding implementation exists. Use **Preview** first. Never enter placeholder or invented credentials.
3. Database variables:
   - `DATABASE_URL`: pooled Neon connection string for the matching environment.
   - `DATABASE_URL_UNPOOLED` / `DIRECT_URL`: only if the code or migration workflow actually consumes them; they are not substitutes for `DATABASE_URL`.
4. Authentication variables:
   - `AUTH_SECRET`: generate locally with `openssl rand -base64 32`; do not send the output to chat or commit it.
   - `ADMIN_EMAILS`: comma-separated, explicitly authorized admin email addresses.
   - `AUTH_URL`: the canonical app URL only if the chosen Auth.js setup requires it.
5. Important: the current main branch does not yet contain the expected Auth.js implementation and does not declare `next-auth` in `nilecare-landing/package.json`. Adding these variables alone will **not** create secure admin authentication. Do not expose an admin route until authentication and server-side authorization tests exist.
6. Leave Vercel Deployment Protection / SSO enabled during Preview verification. This may prevent public external testers from opening Preview; do not disable it just to make a test pass. Public launch requires an explicit protection plan and approved domain.
7. After a Preview deployment, verify build logs, the readiness endpoint with its required internal secret (never expose that secret in a browser URL), and the lead flow in the isolated test environment. Do not deploy to Production as part of this runbook.

## Gate 3 — Email notification (Resend; optional until configured)

1. Create or access the owner's Resend account.
2. Verify a sending domain in Resend before production sending. Create an API key with the narrowest available permissions.
3. Store it as `RESEND_API_KEY` in Vercel Preview and set `LEADS_TO_EMAIL` to the approved recipient address. Do not commit either value.
4. Add the official `resend` package only as part of a reviewed code change, then send notifications server-side after a lead is successfully persisted. Do not send the full patient message or sensitive medical information in email; send only the minimum necessary reference and a link to an authenticated dashboard.
5. Add tests for provider errors, no-secret fail-closed behavior, and ensuring an email failure does not falsely claim the lead was not saved. Test with a verified test recipient before any real recipient.

Illustrative server-side pattern (not integrated into the current app):
```ts
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const recipient = process.env.LEADS_TO_EMAIL;
if (!apiKey || !recipient) {
  // Mark notification as not configured; do not fabricate a successful send.
} else {
  const resend = new Resend(apiKey);
  // Send only a minimal notification after persistence succeeds.
  // Keep message content free of sensitive health details.
}
```

## Gate 4 — WhatsApp and Meta (Phase 2, not required for initial email-only intake)

When ready, use the official Meta Business/Developers accounts owned by the business:
- WhatsApp Business Account ID (`WABA_ID`)
- Phone Number ID (`PHONE_NUMBER_ID`)
- WhatsApp access token (`WHATSAPP_ACCESS_TOKEN`) with the minimum required permissions
- Webhook app secret / verification token, stored as server-side secrets
- Approved Facebook Page ID and Page access token, plus the supported Graph API version

Do not assume an old Page ID is correct, and do not create a replacement Page or connect Instagram without the owner's explicit brand/account decision. Verify Page ownership, Instagram account ownership, required business verification, webhook signature validation, duplicate event handling, and opt-out/consent behavior in a test setup first. Never commit permanent tokens.

**Initial release decision:** Meta/WhatsApp can remain deferred if the approved initial product is an email-notified lead intake. This does not waive database, access-control, privacy, legal, or clinic-partner gates.

## Gate 5 — Clinic offer data

Only use a real, current clinic offer document approved by the clinic. A human reviewer should transcribe, then verify:
- Clinic legal/display name and evidence of authorization
- Included services and explicit exclusions
- Price, currency, taxes/fees, and validity dates
- Delivery/appointment timing and geographic eligibility
- Cancellation/refund policy
- Any required disclaimers and contact details

Keep unknown fields empty and mark them blocked. Do not invent a clinic, price, medical outcome, credential, or offer. Do not represent a clinic-specific offer or accept clinic-linked commercial payment until partner approval and legal review are documented.

## Gate 6 — Brand and content approvals

The provisional brand remains **PROVISIONAL**, not approved final identity. Keep all 80 drafts as drafts until review. For each of the 30 posts in the approval sheet, record reviewer, date, and decision; check:
1. Does it state a price or discount?
2. Does it name or imply a specific clinic?
3. Does it promise a medical result?
4. Does it diagnose or recommend treatment?
5. Does it use before/after imagery or claims?
6. Is it clearly described as coordination/information rather than a medical provider?
7. Is the call to action neutral, accurate, and consent-aware?

Reject or escalate any unsupported medical claim, unapproved offer, misleading result, or identifiable patient content without documented consent. No posts are published by this runbook.

## Gate 7 — Final closure report

### A. Proven by repository evidence
- Latest main commit and successful CI run linked above.
- Lead API and persistence adapter exist.
- Current readiness logic explicitly gates MVP on persistence, webhook secret, legal review, and clinic-partner approval.
- PR #17 contains a proposed public error-detail fix and isolated database/permission tests.

### B. Written but not proven live
- PGlite persistence round-trip tests described by PR #17.
- Any Admin UI/Auth bundle described in prior handovers but absent from the audited main paths.
- Email/Meta/WhatsApp integrations until credentials and provider-side test evidence exist.

### C. Configuration still needed
- Owner-controlled Neon test database and verified schema.
- Matching Vercel Preview environment variables, added only when code consumes them.
- Auth implementation and allowlist tests before any admin data route is exposed.
- Resend domain/key/recipient if email notifications are selected.
- Official Meta/WhatsApp account configuration only for Phase 2.

### D. Blocks launch
- No verified end-to-end deployed save → reconnect → read-back against the intended database.
- Admin/Auth implementation is not present at the expected paths on main.
- Legal review and clinic partner approval must be evidenced before launch under the current readiness logic.
- A green CI or HTTP 200 homepage alone does not prove the lead journey is safe.

### E. Closure order
1. Verify the current PR #17 changes against latest main and bring the isolated persistence test into CI after confirming it is deterministic.
2. Run tests in a clean environment and fix any failures before opening/updating a review PR.
3. Implement and test server-side Admin/Auth and lead-read authorization; do not ship a mock dashboard or fake leads.
4. Prove save/read/reconnect in a separate Neon test project.
5. Configure Vercel Preview and verify the complete flow behind existing protection.
6. Obtain documented legal and clinic-partner approval.
7. Only then request an explicit production launch decision. Email and Meta/WhatsApp can be phased according to the approved product scope.

## Safety record

No production deploy, merge to main, production DB write, credential creation, real patient submission, email send, WhatsApp send, Meta post, or clinic offer publication was performed while preparing this guide.
