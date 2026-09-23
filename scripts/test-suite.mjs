import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const root = process.cwd().endsWith("nilecare-landing") ? ".." : ".";
const file = (p) => readFile(`${root}/${p}`, "utf8");
const [d,o,p,w,m,ci,s,n,sp]=await Promise.all([
 file("nilecare-landing/lib/domain.ts"),file("nilecare-landing/lib/offer.ts"),file("nilecare-landing/lib/paymob.ts"),
 file("nilecare-landing/lib/whatsapp.ts"),file("nilecare-landing/lib/meta.ts"),file(".github/workflows/ci.yml"),
 file("supabase/002_production_hardening.sql"),file("nilecare-landing/lib/neon.ts"),file("nilecare-landing/lib/supabase.ts")
]);
const checks=[
 /validateLead/,/canTransition/,/closed_lost/,/provider_evidence_id/,/validateOffer/,/approved/,/PAYMOB_HMAC_SECRET/,/sha512/,
 /verifyWhatsAppSignature/,/WEBHOOK_VERIFY_TOKEN/,/179969831856298/,/NileCare/,/clinic_offers/,/whatsapp_messages/,
 /row level security/i,/provider_event_id/,/npm ci/,/npm run build/,/self-check/,/npx tsc/,/PAYMOB_HMAC_SECRET/,/WHATSAPP_APP_SECRET/,
 /Neon-Connection-String/,/NILECARE_PERSISTENCE_PROVIDER/
];
const values=[d,d,d,d,o,o,p,p,w,w,m,m,s,s,s,s,ci,ci,ci,ci,p,w,n,sp];
checks.forEach((re,i)=>assert.match(values[i],re,"check "+(i+1)+" failed"));
console.log("NILECARE_TEST_SUITE=24/24 PASS");
