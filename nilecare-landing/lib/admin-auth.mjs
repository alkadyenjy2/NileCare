import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_FUTURE_SKEW_MS = 60 * 1000;

function safeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string" || !left || !right) return false;
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function allowedEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdmin(email) {
  if (typeof email !== "string" || !email.trim()) return false;
  const normalized = email.trim().toLowerCase();
  return allowedEmails().includes(normalized);
}

export function loginTokenMatches(candidate) {
  const expected = process.env.NILECARE_ADMIN_LOGIN_TOKEN;
  return typeof candidate === "string" && typeof expected === "string" && expected.length >= 32 && safeEqual(candidate, expected);
}

function sessionSecret() {
  const secret = process.env.NILECARE_ADMIN_SESSION_SECRET;
  return typeof secret === "string" && secret.length >= 32 ? secret : null;
}

function signature(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(email, now = Date.now()) {
  const secret = sessionSecret();
  if (!secret || !isAllowedAdmin(email) || !Number.isFinite(now)) return null;
  const payload = Buffer.from(JSON.stringify({ email: email.trim().toLowerCase(), issuedAt: now })).toString("base64url");
  return payload + "." + signature(payload, secret);
}

export function verifySessionToken(token, now = Date.now()) {
  const secret = sessionSecret();
  if (!secret || typeof token !== "string" || token.length > 2048 || !Number.isFinite(now)) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  if (!safeEqual(signature(parts[0], secret), parts[1])) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (typeof payload.email !== "string" || !Number.isFinite(payload.issuedAt)) return null;
    if (now - payload.issuedAt > SESSION_TTL_MS || payload.issuedAt - now > MAX_FUTURE_SKEW_MS) return null;
    if (!isAllowedAdmin(payload.email)) return null;
    return { email: payload.email, issuedAt: payload.issuedAt };
  } catch {
    return null;
  }
}
