import assert from "node:assert/strict";
import {createHmac} from "node:crypto";
import {verifyPaymobHmac} from "../nilecare-landing/lib/paymob-hmac.mjs";
import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
import {hasJsonContentType, MAX_LEAD_BODY_BYTES, readJsonBody} from "../nilecare-landing/lib/request-body.mjs";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const file=(p)=>readFile(join(root,p),"utf8");
const [d,o,p,ph,w,m,ci,s,n,sp,sql,c,wr,pw,pi,page,mig,h,b,r]=await Promise.all([
 file("nilecare-landing/lib/domain.ts"),file("nilecare-landing/lib/offer.ts"),file("nilecare-landing/lib/paymob.ts"),file("nilecare-landing/lib/paymob-hmac.mjs"),
 file("nilecare-landing/lib/whatsapp.ts"),file("nilecare-landing/lib/meta.ts"),file(".github/workflows/ci.yml"),
 file("supabase/002_production_hardening.sql"),file("nilecare-landing/lib/neon.ts"),file("nilecare-landing/lib/supabase.ts"),
 file("supabase/001_nilecare_core.sql"),file("nilecare-landing/app/ContactForm.tsx"),file("nilecare-landing/app/api/whatsapp/webhook/route.ts"),file("nilecare-landing/app/api/paymob/webhook/route.ts"),
 file("nilecare-landing/app/api/paymob/intention/route.ts"),file("nilecare-landing/app/page.tsx"),file("supabase/003_patient_inquiry.sql"),
 file("nilecare-landing/app/api/health/route.ts"),file(".github/workflows/nilecare-production-neon-bootstrap.yml"),file("nilecare-landing/lib/readiness.ts")
]);
const originalPaymobSecret=process.env.PAYMOB_HMAC_SECRET;
process.env.PAYMOB_HMAC_SECRET="nilecare-test-secret";
const paymobObj={
 amount_cents:12500,created_at:"2026-10-14T00:00:00Z",currency:"EGP",error_occured:false,
 has_parent_transaction:false,id:12345,integration_id:678,is_3d_secure:true,is_auth:false,is_capture:false,
 is_refunded:false,is_standalone_payment:true,is_voided:false,order:{id:98765},owner:678,pending:false,
 source_data:{pan:"1234",sub_type:"card",type:"card"},success:true
};
const paymobHmacFields=["amount_cents","created_at","currency","error_occured","has_parent_transaction","id","integration_id","is_3d_secure","is_auth","is_capture","is_refunded","is_standalone_payment","is_voided","order.id","owner","pending","source_data.pan","source_data.sub_type","source_data.type","success"];
const paymobValueAt=(payload,path)=>path.split(".").reduce((value,key)=>value&&typeof value==="object"?value[key]:undefined,payload);
const expectedPaymobHmac=createHmac("sha512","nilecare-test-secret").update(paymobHmacFields.map(field=>{const value=paymobValueAt(paymobObj,field);return value==null?"":String(value)}).join("")).digest("hex");
assert.equal(verifyPaymobHmac(paymobObj,expectedPaymobHmac),true,"Paymob HMAC must validate the nested obj payload");
assert.equal(verifyPaymobHmac({obj:paymobObj},expectedPaymobHmac),false,"outer webhook envelope must not be used as the HMAC payload");
assert.equal(verifyPaymobHmac(paymobObj,expectedPaymobHmac.toUpperCase()),true,"hex HMAC comparison should be case-insensitive");
if(originalPaymobSecret===undefined)delete process.env.PAYMOB_HMAC_SECRET;else process.env.PAYMOB_HMAC_SECRET=originalPaymobSecret;
\nconst validBody=await readJsonBody(new Request("https://nilecare.test/api/lead",{method:"POST",body:'{"lead":true}'}));
assert.deepEqual(validBody,{ok:true,value:{lead:true}},"valid JSON request body should parse");
assert.equal(hasJsonContentType(new Request("https://nilecare.test/api/lead",{method:"POST",headers:{"content-type":"application/json; charset=utf-8"},body:"{}"})),true,"JSON with charset should be accepted");
assert.equal(hasJsonContentType(new Request("https://nilecare.test/api/lead",{method:"POST",headers:{"content-type":"text/plain"},body:"{}"})),false,"non-JSON content type should be rejected");
assert.equal(hasJsonContentType(new Request("https://nilecare.test/api/lead",{method:"POST",body:"{}"})),false,"missing content type should be rejected");
const malformedBody=await readJsonBody(new Request("https://nilecare.test/api/lead",{method:"POST",body:"{invalid"}));
assert.deepEqual(malformedBody,{ok:false,status:400},"malformed JSON should be rejected");
const oversizedRequest=new Request("https://nilecare.test/api/lead",{
 method:"POST",duplex:"half",body:new ReadableStream({start(controller){controller.enqueue(new Uint8Array(MAX_LEAD_BODY_BYTES+1));controller.close();}})
});
const oversizedBody=await readJsonBody(oversizedRequest);
assert.deepEqual(oversizedBody,{ok:false,status:413},"oversized streamed body should be rejected");
const leadRoute=await file("nilecare-landing/app/api/lead/route.ts");
const checks=[
 [d,/validateLead/],[d,/canTransition/],[d,/closed_lost/],[d,/provider_evidence_id/],[b,/003_patient_inquiry\.sql/],[o,/validateOffer/],[o,/approved/],
 [ph,/PAYMOB_HMAC_SECRET/],[ph,/sha512/],[w,/verifyWhatsAppSignature/],[w,/WEBHOOK_VERIFY_TOKEN/],[m,/NileCare/],[m,/179969831856298/],
 [s,/clinic_offers/],[s,/whatsapp_messages/],[sql,/row level security/i],[sql,/provider_event_id/],[ci,/npm ci/],[ci,/npm run build/],
 [ci,/self-check/],[ci,/npx tsc/],[ph,/PAYMOB_HMAC_SECRET/],[w,/WHATSAPP_APP_SECRET/],[n,/Neon-Connection-String/],
 [sp,/NILECARE_PERSISTENCE_PROVIDER/],[sql,/lead_id uuid references public.leads\(id\)/],[d,/isStage\(from\)/],[wr,/try/],[wr,/catch/],
 [wr,/INVALID_WHATSAPP_JSON/],[pw,/verifyPaymobHmac\(tx,\s*hmac\)/],[pw,/event\.obj/],[pw,/INVALID_PAYMOB_SUCCESS_FLAG/],[pi,/createPaymobIntention/],[pi,/new URL\(request.url\).origin/],[sp,/===\"supabase\"\?\"supabase\":\"neon\"/],
 [d,/full_name/],[d,/preferred_contact_method/],[d,/consent/],[c,/name=\"full_name\"/],[c,/name=\"service_category\"/],[c,/name=\"preferred_contact_method\"/],
 [c,/name=\"message\"/],[c,/name=\"consent\"/],[page,/Cross-border care, coordinated/],[mig,/alter table public\.leads alter column clinic_name drop not null/],[mig,/add column if not exists full_name/],
 [h,/NextResponse/],[h,/status:persistence\.ready/],[h,/persistence/],[r,/mvp_launch_ready/],[r,/OPTIONAL_FOR_MVP/],
 [leadRoute,/readJsonBody\(request\)/],[leadRoute,/parsed\.status === 413/],[leadRoute,/validateLead\(parsed\.value\)/]
];
checks.forEach(([value,re],i)=>assert.match(value,re,"check "+(i+1)+" failed"));
console.log(`NILECARE_TEST_SUITE=${checks.length}/${checks.length} PASS; request-body tests=3/3 PASS`);
