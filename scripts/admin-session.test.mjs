import assert from "node:assert/strict";
import { createAdminSession, verifyAdminSession, isAllowedAdminEmail, ADMIN_SESSION_TTL_SECONDS } from "../nilecare-landing/lib/admin-session.mjs";

const secret = "test-only-auth-secret-with-at-least-32-characters";
const allowlist = "owner@example.test, ADMIN@example.test";
const now = Date.parse("2026-10-24T00:00:00.000Z");
const token = createAdminSession("Admin@Example.Test", secret, now);

assert.equal(isAllowedAdminEmail("admin@example.test", allowlist), true);
assert.equal(isAllowedAdminEmail("attacker@example.test", allowlist), false);
assert.equal(verifyAdminSession(token, secret, allowlist, now)?.email, "admin@example.test");
assert.equal(verifyAdminSession(token, secret, "owner@example.test", now), null, "a valid token must still respect the current allowlist");
assert.equal(verifyAdminSession(token + "x", secret, allowlist, now), null, "tampered signatures must be rejected");
assert.equal(verifyAdminSession(token, secret, allowlist, now + (ADMIN_SESSION_TTL_SECONDS + 1) * 1000), null, "expired sessions must be rejected");
assert.equal(verifyAdminSession(token, "short", allowlist, now), null, "short/missing secrets must fail closed");
assert.throws(() => createAdminSession("admin@example.test", "short", now), /AUTH_SECRET/);
assert.equal(verifyAdminSession("not-a-token", secret, allowlist, now), null);
console.log("NILECARE_ADMIN_SESSION_TESTS=8/8 PASS");
