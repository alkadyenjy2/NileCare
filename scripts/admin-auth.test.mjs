import assert from "node:assert/strict";
import { createSessionToken, isAllowedAdmin, loginTokenMatches, verifySessionToken } from "../nilecare-landing/lib/admin-auth.mjs";

const original = {
  emails: process.env.ADMIN_EMAILS,
  login: process.env.NILECARE_ADMIN_LOGIN_TOKEN,
  secret: process.env.NILECARE_ADMIN_SESSION_SECRET,
};
process.env.ADMIN_EMAILS = "owner@example.test, ops@example.test";
process.env.NILECARE_ADMIN_LOGIN_TOKEN = "test-login-token-that-is-long-enough";
process.env.NILECARE_ADMIN_SESSION_SECRET = "test-session-secret-at-least-32-characters-long";

try {
  assert.equal(isAllowedAdmin("OWNER@example.test"), true, "allowlist matching is case-insensitive");
  assert.equal(isAllowedAdmin("intruder@example.test"), false, "non-allowlisted emails are denied");
  assert.equal(isAllowedAdmin(""), false, "empty email is denied");
  assert.equal(loginTokenMatches("test-login-token-that-is-long-enough"), true, "valid login token matches");
  assert.equal(loginTokenMatches("wrong-token"), false, "wrong login token is rejected");
  assert.equal(loginTokenMatches(""), false, "empty login token is rejected");

  const now = 1_800_000_000_000;
  const token = createSessionToken("owner@example.test", now);
  assert.equal(verifySessionToken(token, now)?.email, "owner@example.test", "valid signed session is accepted");
  assert.equal(verifySessionToken(token + "x", now), null, "tampered session is rejected");
  assert.equal(verifySessionToken(token, now + 8 * 60 * 60 * 1000 + 1), null, "expired session is rejected");
  assert.equal(verifySessionToken(token, now - 120_000), null, "future-dated session is rejected");
  assert.equal(verifySessionToken("not-a-session", now), null, "malformed session is rejected");

  process.env.ADMIN_EMAILS = "";
  assert.equal(isAllowedAdmin("owner@example.test"), false, "missing allowlist fails closed");
  process.env.NILECARE_ADMIN_SESSION_SECRET = "too-short";
  assert.equal(createSessionToken("owner@example.test", now), null, "weak session secret disables session creation");
  console.log("NileCare admin auth: 13 checks passed");
} finally {
  for (const [key, value] of Object.entries(original)) {
    const name = ({ emails: "ADMIN_EMAILS", login: "NILECARE_ADMIN_LOGIN_TOKEN", secret: "NILECARE_ADMIN_SESSION_SECRET" })[key];
    if (value === undefined) delete process.env[name]; else process.env[name] = value;
  }
}
