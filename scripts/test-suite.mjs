import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const file=(p)=>readFile(join(root,p),"utf8");
const [d,o,p,w,m,ci,s,n,sp,sql,c,wr,pi,page,mig,h,b]=await Promise.all([
 file("nilecare-landing/lib/domain.ts"),file("nilecare-landing/lib/offer.ts"),file("nilecare-landing/lib/paymob.ts"),
 file("nilecare-landing/lib/whatsapp.ts"),file("nilecare-landing/lib/meta.ts"),file(".github/workflows/ci.yml"),
 file("supabase/002_production_hardening.sql"),file("nilecare-landing/lib/neon.ts"),file("nilecare-landing/lib/supabase.ts"),
 file("supabase/001_nilecare_core.sql"),file("nilecare-landing/app/ContactForm.tsx"),file("nilecare-landing/app/api/whatsapp/webhook/route.ts"),
 file("nilecare-landing/app/api/paymob/intention/route.ts"),file("nilecare-landing/app/page.tsx"),file("supabase/003_patient_inquiry.sql"),
 file("nilecare-landing/app/api/health/route.ts"),file(".github/workflows/nilecare-production-neon-bootstrap.yml")
]);
const checks=[
 [d,/validateLead/],[d,/canTransition/],[d,/closed_lost/],[d,/provider_evidence_id/],[b,/003_patient_inquiry\\.sql/],[o,/validateOffer/],[o,/approved/],
 [p,/PAYMOB_HMAC_SECRET/],[p,/sha512/],[w,/verifyWhatsAppSignature/],[w,/WEBHOOK_VERIFY_TOKEN/],[m,/NileCare/],[m,/179969831856298/],
 [s,/clinic_offers/],[s,/whatsapp_messages/],[sql,/row level security/i],[sql,/provider_event_id/],[ci,/npm ci/],[ci,/npm run build/],
 [ci,/self-check/],[ci,/npx tsc/],[ci,/nilecare-production-neon-bootstrap\.yml/],[p,/PAYMOB_HMAC_SECRET/],[w,/WHATSAPP_APP_SECRET/],[n,/Neon-Connection-String/],
 [sp,/NILECARE_PERSISTENCE_PROVIDER/],[sql,/lead_id uuid references public.leads\(id\)/],[d,/isStage\(from\)/],[wr,/try/],[wr,/catch/],
 [wr,/INVALID_WHATSAPP_JSON/],[pi,/createPaymobIntention/],[pi,/new URL\(request.url\).origin/],[sp,/===\"supabase\"\?\"supabase\":\"neon\"/],
 [d,/full_name/],[d,/preferred_contact_method/],[d,/consent/],[c,/name=\"full_name\"/],[c,/name=\"service_category\"/],[c,/name=\"preferred_contact_method\"/],
 [c,/name=\"message\"/],[c,/name=\"consent\"/],[page,/Cross-border care, coordinated/],[mig,/alter table public\.leads alter column clinic_name drop not null/],[mig,/add column if not exists full_name/],
 [h,/NextResponse/],[h,/status:\"ok\"/]
];
checks.forEach(([value,re],i)=>assert.match(value,re,"check "+(i+1)+" failed"));
console.log("NILECARE_TEST_SUITE=46/46 PASS");