import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { verifyAdminPassword } from "../nilecare-landing/lib/admin-password.mjs";

const password = "a".repeat(64);
const hash = createHash("sha256").update(password, "utf8").digest("hex");
assert.equal(verifyAdminPassword(password, hash), true, "correct high-entropy password is accepted");
assert.equal(verifyAdminPassword("b".repeat(64), hash), false, "wrong password is rejected");
assert.equal(verifyAdminPassword("short", hash), false, "short passwords fail closed");
assert.equal(verifyAdminPassword(password, "not-a-hash"), false, "missing or malformed hash fails closed");
assert.equal(verifyAdminPassword(null, hash), false, "non-string password is rejected");
console.log("NILECARE_ADMIN_PASSWORD_TESTS=5/5 PASS");
