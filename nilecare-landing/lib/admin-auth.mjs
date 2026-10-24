import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "nilecare_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;

function signature(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminConfigReady(env = process.env) {
  return Boolean(
    typeof env.AUTH_SECRET === "string" && env.AUTH_SECRET.length >= 32 &&
    typeof env.ADMIN_PASSWORD === "string" && env.ADMIN_PASSWORD.length >= 16 &&
    parseAdminEmails(env.ADMIN_EMAILS).length > 0
  );
}

export function parseAdminEmails(value) {
  return typeof value === "string"
    ? [...new Set(value.split(",").map((email) => email.trim().toLowerCase()).filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))]
    : [];
}

export function verifyAdminCredentials(email, password, env = process.env) {
  if (!adminConfigReady(env) || typeof email !== "string" || typeof password !== "string") return false;
  const normalized = email.trim().toLowerCase();
  if (!parseAdminEmails(env.ADMIN_EMAILS).includes(normalized)) return false;
  return safeEqual(password, env.ADMIN_PASSWORD);
}

export function createAdminSession(email, secret, now = Date.now()) {
  const expiresAt = Math.floor(now / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ email: email.trim().toLowerCase(), exp: expiresAt })).toString("base64url");
  return payload + "." + signature(payload, secret);
}

export function verifyAdminSession(token, secret, allowedEmails, now = Date.now()) {
  if (typeof token !== "string" || typeof secret !== "string" || secret.length < 32) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, suppliedSignature] = parts;
  if (!safeEqual(signature(payload, secret), suppliedSignature)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const email = typeof data.email === "string" ? data.email : "";
    const expiry = Number(data.exp);
    if (!Number.isFinite(expiry) || expiry <= Math.floor(now / 1000)) return null;
    if (!Array.isArray(allowedEmails) || !allowedEmails.includes(email)) return null;
    return { email, expiresAt: expiry };
  } catch {
    return null;
  }
}
