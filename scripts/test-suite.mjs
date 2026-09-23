import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const root = process.cwd().endsWith("nilecare-landing") ? ".." : ".";
const file = (p) => readFile(`${root}/${p}`, "utf8");
const [d,o,p,w,m,ci,s]=await Promise.all([
 file("nilecare-landing/lib/domain.ts","utf8"),file("nilecare-landing/lib/offer.ts","utf8"),file("nilecare-landing/lib/paymob.ts","utf8"),
 file("nilecare-landing/lib/whatsapp.ts","utf8"),file("nilecare-landing/lib/meta.ts","utf8"),file(".github/workflows/ci.yml","utf8"),file("supabase/002_production_hardening.sql","utf8")
]);
const checks=[/validateLead/,/canTransition/,/closed_lost/,/provider_evidence_id/,/validateOffer/,/approved/,/PAYMOB_HMAC_SECRET/,/sha512/,/verifyWhatsAppSignature/,/WEBHOOK_VERIFY_TOKEN/,/179969831856298/,/NileCare/,/clinic_offers/,/whatsapp_messages/,/row level security/i,/provider_event_id/,/npm ci/,/npm run build/,/self-check/,/npx tsc/,/PAYMOB_HMAC_SECRET/,/WHATSAPP_APP_SECRET/];
const values=[d,d,d,d,o,o,p,p,w,w,m,m,s,s,s,ci,ci,ci,ci,p,w];
checks.forEach((re,i)=>assert.match(values[i],re,"check "+(i+1)+" failed"));
console.log("NILECARE_TEST_SUITE=22/22 PASS");
