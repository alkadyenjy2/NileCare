import assert from "node:assert/strict";
import { buildNeonSqlEndpoint, mapNeonLeadRows } from "../nilecare-landing/lib/admin-data-core.mjs";

assert.equal(buildNeonSqlEndpoint("postgresql://user:pass@ep-example.us-east-2.aws.neon.tech:5432/nilecare?sslmode=require"), "https://ep-example.us-east-2.aws.neon.tech/sql");
assert.throws(() => buildNeonSqlEndpoint("postgresql://user:pass@localhost:5432/nilecare"), /Neon PostgreSQL/);
assert.throws(() => buildNeonSqlEndpoint("https://example.com/nilecare"), /Neon PostgreSQL/);
const fields = ["id", "consent", "email"] .map(name => ({ name }));
const rows = mapNeonLeadRows({ fields, rows: [["1", "f", "false@example.test"], ["2", "t", "true@example.test"], ["3", false, "native-false@example.test"], ["4", true, "native-true@example.test"], ["5", "0", "zero@example.test"], ["6", "yes", "yes@example.test"]] });
assert.deepEqual(rows.map(row => row.consent), [false, true, false, true, false, true]);
assert.throws(() => mapNeonLeadRows({ fields: [{name:"id"}], rows:[["1"]] }), /MISSING_CONSENT/);
assert.throws(() => mapNeonLeadRows({ fields, rows:[["1"]] }), /INVALID_ROW/);
assert.throws(() => mapNeonLeadRows({ fields, rows:[["1", "maybe", "x"]] }), /INVALID_CONSENT/);
console.log("NILECARE_ADMIN_DATA_TESTS=8/8 PASS");
