import { createHash, timingSafeEqual } from "node:crypto";

export function verifyAdminPassword(password, expectedHash) {
  if (typeof password !== "string" || password.length < 32 || password.length > 256) return false;
  if (typeof expectedHash !== "string" || !/^[a-f0-9]{64}$/i.test(expectedHash)) return false;
  const supplied = createHash("sha256").update(password, "utf8").digest();
  const expected = Buffer.from(expectedHash, "hex");
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
