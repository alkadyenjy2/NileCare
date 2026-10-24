import assert from "node:assert/strict";
import { createAdminSession, verifyAdminSession, verifyAdminCredentials, adminConfigReady, parseAdminEmails } from "../nilecare-landing/lib/admin-auth.mjs";

const env = {
  AUTH_SECRET: "test-only-secret-value-at-least-32-chars",
  ADMIN_PASSWORD: "test-only-password-long-enough",
  ADMIN_EMAILS: "owner@example.test, staff@example.test, OWNER@example.test"
};
assert.equal(adminConfigReady(env), true);
assert.deepEqual(parseAdminEmails(env.ADMIN_EMAILS), ["owner@example.test", "staff@example.test"]);
assert.equal(verifyAdminCredentials(" OWNER@example.test ", env.ADMIN_PASSWORD, env), true);
assert.equal(verifyAdminCredentials("intruder@example.test", env.ADMIN_PASSWORD, env), false);
assert.equal(verifyAdminCredentials("owner@example.test", "wrong-password", env), false);
assert.equal(adminConfigReady({ ...env, AUTH_SECRET: "short" }), false);
const now = 1_800_000_000_000;
const token = createAdminSession("OWNER@example.test", env.AUTH_SECRET, now);
assert.deepEqual(verifyAdminSession(token, env.AUTH_SECRET, ["owner@example.test"], now), { email: "owner@example.test", expiresAt: Math.floor(now / 1000) + 8 * 60 * 60 });
assert.equal(verifyAdminSession(token, env.AUTH_SECRET, ["staff@example.test"], now), null);
assert.equal(verifyAdminSession(token + "x", env.AUTH_SECRET, ["owner@example.test"], now), null);
assert.equal(verifyAdminSession(token, env.AUTH_SECRET, ["owner@example.test"], now + 8 * 60 * 60 * 1000), null);
assert.equal(verifyAdminSession("malformed", env.AUTH_SECRET, ["owner@example.test"], now), null);
console.log("admin auth checks: 10/10 passed");
