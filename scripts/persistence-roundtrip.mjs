// NileCare isolated persistence + API permission tests.
// Runs the REAL route handlers and the REAL Neon adapter (lib/neon.ts) against a disposable
// in-process PostgreSQL (PGlite) loaded with the repo migrations. Neon's SQL-over-HTTP endpoint
// is replaced by a local fetch stub that forwards the query to PGlite.
// No network, no secrets, no production database. The DATABASE_URL below is a fake placeholder.
// Setup once: (cd nilecare-landing && npm ci) && (cd scripts && npm install)
// Run from the repo root: node scripts/persistence-roundtrip.mjs
import assert from "node:assert/strict";
import {createHmac} from "node:crypto";
import {createRequire} from "node:module";
import {mkdtempSync, mkdirSync, readFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const landing = join(root, "nilecare-landing");
const req = createRequire(join(landing, "package.json"));
const toolReq = createRequire(join(root, "scripts", "package.json"));
const {PGlite} = toolReq("@electric-sql/pglite");
const esbuild = toolReq("esbuild");

let passed = 0;
const ok = (name) => { passed++; console.log("  PASS " + name); };

const outdir = join(landing, "node_modules", ".cache", "nilecare-tests");
rmSync(outdir, {recursive: true, force: true});
mkdirSync(outdir, {recursive: true});
esbuild.buildSync({
  entryPoints: {
    lead: join(landing, "app/api/lead/route.ts"),
    offer: join(landing, "app/api/offer/route.ts"),
    paymob: join(landing, "app/api/paymob/webhook/route.ts"),
    wa: join(landing, "app/api/whatsapp/webhook/route.ts"),
    readiness: join(landing, "app/api/readiness/route.ts"),
    health: join(landing, "app/api/health/route.ts"),
    domain: join(landing, "lib/domain.ts"),
  },
  bundle: true, platform: "node", format: "cjs", outdir, outExtension: {".js": ".cjs"},
  external: ["next/server"], logLevel: "silent",
});
const load = (n) => req(join(outdir, n + ".cjs"));
const leadRoute = load("lead"), offerRoute = load("offer"), paymobRoute = load("paymob");
const waRoute = load("wa"), readinessRoute = load("readiness"), healthRoute = load("health");
const domain = load("domain");

// Disposable database with the repo migrations (pgcrypto line stripped: PGlite has gen_random_uuid built in).
const dataDir = mkdtempSync(join(tmpdir(), "nilecare-pg-"));
let db;
async function openDb(fresh) {
  db = new PGlite(dataDir);
  await db.waitReady;
  if (fresh) {
    await db.exec("create role anon; create role authenticated;");
    for (const f of ["001_nilecare_core.sql", "002_production_hardening.sql", "003_patient_inquiry.sql"]) {
      const sql = readFileSync(join(root, "supabase", f), "utf8").replace(/create extension if not exists pgcrypto;/i, "");
      await db.exec(sql);
    }
  }
}
await openDb(true);

// Neon SQL-over-HTTP stub (same request/response shape neon.ts expects).
const FAKE_URL = "postgresql://tester:placeholder@nilecare-test.invalid/testdb";
let failWrites = false, calls = 0;
globalThis.fetch = async (url, init) => {
  calls++;
  assert.equal(String(url), "https://nilecare-test.invalid:443/sql", "adapter must only talk to the stubbed endpoint");
  assert.equal(init.headers["Neon-Connection-String"], FAKE_URL);
  if (failWrites) return new Response(JSON.stringify({message: "simulated outage"}), {status: 500});
  const {query, params} = JSON.parse(init.body);
  try {
    const r = await db.query(query, params, {rowMode: "array"});
    return new Response(JSON.stringify({fields: r.fields.map(f => ({name: f.name})), rows: r.rows}), {status: 200});
  } catch (e) {
    return new Response(JSON.stringify({message: e.message, code: e.code}), {status: 400});
  }
};

const SECRET = "test-internal-secret";
const PAYMOB = "test-paymob-hmac-secret";
const env = (o) => {
  for (const k of ["DATABASE_URL", "NILECARE_PERSISTENCE_PROVIDER", "NILECARE_WEBHOOK_SECRET", "PAYMOB_HMAC_SECRET", "WHATSAPP_APP_SECRET", "WEBHOOK_VERIFY_TOKEN", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]) delete process.env[k];
  Object.assign(process.env, o);
};
const baseEnv = {DATABASE_URL: FAKE_URL, NILECARE_WEBHOOK_SECRET: SECRET, PAYMOB_HMAC_SECRET: PAYMOB, WHATSAPP_APP_SECRET: "wa-secret"};
const post = (path, body, headers = {"content-type": "application/json"}) =>
  new Request("https://nilecare.test" + path, {method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body)});
const count = async (table, where = "true") => (await db.query(`select count(*)::int as n from public.${table} where ${where}`)).rows[0].n;
const lead = {full_name: "Synthetic Patient", email: "synthetic@example.test", phone: "+200000000000", whatsapp: null, country: "Testland", service_category: "consultation", preferred_contact_method: "email", message: "Synthetic coordination request.", consent: true, source: "landing"};

console.log("== A. Lead intake: save, read back, restart, read again ==");
env(baseEnv);
let res = await leadRoute.POST(post("/api/lead", lead));
assert.equal(res.status, 201); ok("POST /api/lead returns 201 for a valid lead");
const created = (await res.json()).lead;
assert.ok(created.id, "created lead should carry its id"); ok("response returns the stored row with an id");
let row = (await db.query("select * from public.leads where id=$1", [created.id])).rows[0];
assert.equal(row.email, lead.email); assert.equal(row.full_name, lead.full_name);
assert.equal(row.consent, true); assert.equal(row.stage, "new"); assert.equal(row.source, "landing"); ok("row read back with same values, consent=true, stage=new");
await db.close(); await openDb(false);
row = (await db.query("select * from public.leads where id=$1", [created.id])).rows[0];
assert.equal(row.email, lead.email); assert.equal(row.message, lead.message); ok("row survives closing and reopening the database (fresh connection)");

console.log("== B. Validation and request limits write nothing ==");
const before = await count("leads");
assert.equal((await leadRoute.POST(post("/api/lead", {...lead, consent: false}))).status, 400);
assert.equal((await leadRoute.POST(post("/api/lead", {...lead, email: "nope"}))).status, 400);
assert.equal((await leadRoute.POST(post("/api/lead", {...lead, source: "hacker"}))).status, 400); ok("missing consent / bad email / bad source rejected with 400");
assert.equal((await leadRoute.POST(post("/api/lead", "{bad", {"content-type": "application/json"}))).status, 400);
assert.equal((await leadRoute.POST(post("/api/lead", lead, {"content-type": "text/plain"}))).status, 415);
assert.equal((await leadRoute.POST(post("/api/lead", {...lead, message: "x".repeat(20000)}))).status, 413); ok("malformed JSON 400, wrong content type 415, oversized body 413");
assert.equal(await count("leads"), before); ok("none of the rejected requests created a row");

console.log("== C. A failed write is never acknowledged as saved ==");
failWrites = true;
res = await leadRoute.POST(post("/api/lead", {...lead, email: "outage@example.test"}));
failWrites = false;
assert.equal(res.status, 502);
const failBody = await res.json();
assert.equal(failBody.ok, false); ok("provider outage returns 502, not 201");
assert.equal(JSON.stringify(failBody).includes("simulated outage"), false);
assert.equal(failBody.detail, undefined); ok("502 response does not leak the database error text to the public caller");
assert.equal(await count("leads", "email='outage@example.test'"), 0); ok("no row exists for the failed request");
env({...baseEnv, DATABASE_URL: ""});
res = await leadRoute.POST(post("/api/lead", lead));
assert.equal(res.status, 503); assert.equal((await res.json()).status, "BLOCKED_PERSISTENCE_NOT_CONFIGURED"); ok("no DATABASE_URL returns 503 BLOCKED_PERSISTENCE_NOT_CONFIGURED");
env(baseEnv);

console.log("== D. Payment webhook: HMAC gate, save, idempotency ==");
const FIELDS = ["amount_cents","created_at","currency","error_occured","has_parent_transaction","id","integration_id","is_3d_secure","is_auth","is_capture","is_refunded","is_standalone_payment","is_voided","order.id","owner","pending","source_data.pan","source_data.sub_type","source_data.type","success"];
const at = (o, p) => p.split(".").reduce((v, k) => v && typeof v === "object" ? v[k] : undefined, o);
const tx = {amount_cents: 12500, created_at: "2026-10-14T00:00:00Z", currency: "EGP", error_occured: false, has_parent_transaction: false, id: 777001, integration_id: 1, is_3d_secure: true, is_auth: false, is_capture: false, is_refunded: false, is_standalone_payment: true, is_voided: false, order: {id: 5}, owner: 1, pending: false, source_data: {pan: "1234", sub_type: "card", type: "card"}, success: true};
const sign = (o, secret = PAYMOB) => createHmac("sha512", secret).update(FIELDS.map(f => { const v = at(o, f); return v == null ? "" : String(v); }).join("")).digest("hex");
const hook = (body, hmac) => post("/api/paymob/webhook?hmac=" + hmac, body);
res = await paymobRoute.POST(hook({obj: tx}, "0".repeat(128)));
assert.equal(res.status, 401); assert.equal(await count("payment_events"), 0); ok("wrong HMAC returns 401 and stores nothing");
res = await paymobRoute.POST(hook({obj: tx}, sign(tx, "other-secret")));
assert.equal(res.status, 401); ok("HMAC signed with another secret returns 401");
res = await paymobRoute.POST(hook({obj: tx}, sign(tx)));
assert.equal(res.status, 200); assert.equal((await res.json()).duplicate, false);
assert.equal(await count("payment_events", "provider_event_id='777001' and status='paid'"), 1); ok("valid signed event stored once with status=paid");
res = await paymobRoute.POST(hook({obj: tx}, sign(tx)));
assert.equal((await res.json()).duplicate, true); assert.equal(await count("payment_events"), 1); ok("replaying the same event is a duplicate and adds no row");
env({...baseEnv, PAYMOB_HMAC_SECRET: ""});
res = await paymobRoute.POST(hook({obj: tx}, sign(tx)));
assert.equal(res.status, 401); ok("no PAYMOB_HMAC_SECRET configured: every event is rejected (fails closed)");
env(baseEnv);

console.log("== E. WhatsApp webhook: signature gate, save, idempotency ==");
const waBody = JSON.stringify({entry: [{changes: [{value: {messages: [{id: "wamid.TEST1", from: "201000000000"}]}}]}]});
const waSig = "sha256=" + createHmac("sha256", "wa-secret").update(waBody).digest("hex");
res = await waRoute.POST(post("/api/whatsapp/webhook", waBody, {"x-hub-signature-256": "sha256=" + "0".repeat(64)}));
assert.equal(res.status, 401); assert.equal(await count("whatsapp_messages"), 0); ok("bad signature returns 401 and stores nothing");
res = await waRoute.POST(post("/api/whatsapp/webhook", waBody, {"x-hub-signature-256": waSig}));
assert.equal(res.status, 200); assert.equal(await count("whatsapp_messages"), 1); assert.equal(await count("lead_events"), 1); ok("valid signature stores the message and a lead event");
res = await waRoute.POST(post("/api/whatsapp/webhook", waBody, {"x-hub-signature-256": waSig}));
assert.equal((await res.json()).duplicate, true); assert.equal(await count("whatsapp_messages"), 1); assert.equal(await count("lead_events"), 1); ok("same message id again is a duplicate with no new rows");

console.log("== F. Who may do what: internal endpoints need the secret ==");
const offer = {clinic_name: "Synthetic Clinic", service: "Consultation", price: 100, currency: "EGP", included: ["visit"], excluded: [], delivery_time: "2 days", refund_policy: "Per clinic terms", approved: true};
res = await offerRoute.POST(post("/api/offer", offer)); assert.equal(res.status, 401);
res = await offerRoute.POST(post("/api/offer", offer, {"content-type": "application/json", "x-nilecare-internal-secret": "wrong"})); assert.equal(res.status, 401);
assert.equal(await count("clinic_offers"), 0); ok("offer endpoint: no secret / wrong secret returns 401 and stores nothing");
const internal = {"content-type": "application/json", "x-nilecare-internal-secret": SECRET};
res = await offerRoute.POST(post("/api/offer", {...offer, approved: false}, internal)); assert.equal(res.status, 400);
res = await offerRoute.POST(post("/api/offer", {...offer, price: 0}, internal)); assert.equal(res.status, 400);
assert.equal(await count("clinic_offers"), 0); ok("offer endpoint: unapproved offer or price 0 returns 400 even with the secret");
res = await offerRoute.POST(post("/api/offer", offer, internal)); assert.equal(res.status, 201);
assert.equal(await count("clinic_offers", "approved=true and clinic_name='Synthetic Clinic'"), 1); ok("offer endpoint: approved offer with the secret is stored");
env({...baseEnv, NILECARE_WEBHOOK_SECRET: ""});
res = await offerRoute.POST(post("/api/offer", offer, {"content-type": "application/json", "x-nilecare-internal-secret": ""})); assert.equal(res.status, 401);
res = await readinessRoute.GET(new Request("https://nilecare.test/api/readiness")); assert.equal(res.status, 401); ok("secret not configured: internal endpoints stay closed (fail closed)");
env(baseEnv);
res = await readinessRoute.GET(new Request("https://nilecare.test/api/readiness")); assert.equal(res.status, 401);
res = await readinessRoute.GET(new Request("https://nilecare.test/api/readiness", {headers: {"x-nilecare-internal-secret": SECRET}}));
assert.equal(res.status, 200); assert.equal((await res.json()).persistence.ready, true); ok("readiness: 401 without secret, 200 with it");
res = await healthRoute.GET(); assert.equal(res.status, 200); assert.equal((await res.json()).persistence.ready, true); ok("health endpoint reaches the database (select current_database())");
env({...baseEnv, DATABASE_URL: ""});
res = await healthRoute.GET(); assert.equal(res.status, 503); ok("health reports 503 when the database is not configured");
env(baseEnv);

console.log("== G. Database-level isolation (migrations 001 and 002) ==");
for (const t of ["leads", "lead_events", "payment_events", "clinic_offers", "whatsapp_messages"]) {
  const r = (await db.query("select relrowsecurity as rls from pg_class where oid=$1::regclass", ["public." + t])).rows[0];
  assert.equal(r.rls, true, t + " must have row level security on");
  for (const role of ["anon", "authenticated"]) {
    for (const priv of ["select", "insert", "update", "delete"]) {
      const p = (await db.query("select has_table_privilege($1,$2,$3) as p", [role, "public." + t, priv])).rows[0].p;
      assert.equal(p, false, `${role} must not have ${priv} on ${t}`);
    }
  }
}
ok("all 5 tables: row level security on, anon and authenticated hold no select/insert/update/delete");

console.log("== H. CRM stage rules (lib/domain.ts) ==");
const T = domain.canTransition;
assert.equal(T("new", "qualified"), true);
assert.equal(T("new", "paid", {provider_evidence_id: "ev"}), false); ok("cannot jump new -> paid");
assert.equal(T("payment_pending", "paid"), false);
assert.equal(T("payment_pending", "paid", {provider_evidence_id: "ev1"}), true); ok("paid needs a provider evidence id");
assert.equal(T("qualified", "closed_lost"), false);
assert.equal(T("offer_sent", "closed_lost", {loss_reason: "  "}), false);
assert.equal(T("offer_sent", "closed_lost", {loss_reason: "no response"}), true); ok("closed_lost needs a non-empty reason");
assert.equal(T("closed_lost", "new"), false); assert.equal(T("bogus", "new"), false); ok("closed_lost is final, unknown stages rejected");

assert.ok(calls > 0);
await db.close();
rmSync(dataDir, {recursive: true, force: true});
rmSync(outdir, {recursive: true, force: true});
console.log(`NILECARE_PERSISTENCE_ROUNDTRIP=${passed}/${passed} PASS (isolated PGlite database, no network, no secrets)`);
