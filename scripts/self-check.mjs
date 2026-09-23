import assert from "node:assert/strict"; import {readFile} from "node:fs/promises";
const d=await readFile("nilecare-landing/lib/domain.ts","utf8"),m=await readFile("supabase/001_nilecare_core.sql","utf8"),p=JSON.parse(await readFile("content-bank/posts.json","utf8"));
const n=await readFile("nilecare-landing/lib/neon.ts","utf8"),sp=await readFile("nilecare-landing/lib/supabase.ts","utf8");
assert.match(d,/validateLead/); assert.match(d,/canTransition/); assert.match(m,/unique\(event_type, external_id\)/);
assert.equal(p.expected_count,80); assert.deepEqual(p.approved_posts,[]);
assert.match(n,/Neon-Connection-String/); assert.match(n,/23505/); assert.match(sp,/NILECARE_PERSISTENCE_PROVIDER/);
console.log("NILECARE_SELF_CHECK=PASS"); console.log("NO_FAKE_POSTS=PASS"); console.log("IDEMPOTENCY_CONSTRAINT=PASS"); console.log("DOMAIN_VALIDATION_SOURCE_PRESENT=PASS"); console.log("NEON_PROVIDER_SOURCE_PRESENT=PASS"); console.log("PROVIDER_SELECTION_SOURCE_PRESENT=PASS");
