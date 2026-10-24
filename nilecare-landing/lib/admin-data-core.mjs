export function buildNeonSqlEndpoint(connectionString) {
  const parsed = new URL(connectionString);
  if (!["postgres:", "postgresql:"].includes(parsed.protocol) || !parsed.hostname.endsWith(".neon.tech") || !parsed.username || !parsed.pathname || parsed.pathname === "/") {
    throw new Error("Expected a Neon PostgreSQL connection string");
  }
  // Neon SQL over HTTPS uses the hostname's HTTPS endpoint, not PostgreSQL's :5432 port.
  return "https://" + parsed.hostname + "/sql";
}

function normalizeConsent(value) {
  if (value === true || value === 1) return true;
  if (value === false || value === 0 || value === null) return false;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["t", "true", "1", "yes"].includes(normalized)) return true;
    if (["f", "false", "0", "no", ""].includes(normalized)) return false;
  }
  throw new Error("ADMIN_DATABASE_INVALID_CONSENT_VALUE");
}

export function mapNeonLeadRows(result) {
  if (!result || !Array.isArray(result.fields) || !Array.isArray(result.rows)) {
    throw new Error("ADMIN_DATABASE_INVALID_RESPONSE");
  }
  const names = result.fields.map((field) => field && typeof field.name === "string" ? field.name : "");
  if (!names.includes("consent")) throw new Error("ADMIN_DATABASE_MISSING_CONSENT_FIELD");
  return result.rows.map((row) => {
    if (!Array.isArray(row) || row.length !== names.length) throw new Error("ADMIN_DATABASE_INVALID_ROW");
    const item = Object.fromEntries(row.map((value, index) => [names[index] || String(index), value]));
    item.consent = normalizeConsent(item.consent);
    return item;
  });
}
