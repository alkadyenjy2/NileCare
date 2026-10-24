import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_TTL_SECONDS = 8 * 60 * 60;
const MIN_SECRET_LENGTH = 32;

function signature(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function isAllowedAdminEmail(email, allowlist) {
  if (typeof email !== "string" || typeof allowlist !== "string") return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return allowlist.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean).includes(normalized);
}

export function createAdminSession(email, secret, now = Date.now()) {
  if (typeof secret !== "string" || secret.length < MIN_SECRET_LENGTH) {
    throw new Error("AUTH_SECRET must contain at least 32 characters");
  }
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) throw new Error("Admin email is required");
  const payload = Buffer.from(JSON.stringify({
    email: normalized,
    exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS,
  })).toString("base64url");
  return payload + "." + signature(payload, secret);
}

export function verifyAdminSession(token, secret, allowlist, now = Date.now()) {
  if (typeof secret !== "string" || secret.length < MIN_SECRET_LENGTH) return null;
  if (typeof token !== "string" || token.length > 2048) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const expected = Buffer.from(signature(parts[0], secret));
  const supplied = Buffer.from(parts[1]);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (!payload || typeof payload.email !== "string" || !Number.isInteger(payload.exp)) return null;
    if (payload.exp <= Math.floor(now / 1000)) return null;
    if (!isAllowedAdminEmail(payload.email, allowlist)) return null;
    return { email: payload.email, exp: payload.exp };
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_TTL_SECONDS = SESSION_TTL_SECONDS;
