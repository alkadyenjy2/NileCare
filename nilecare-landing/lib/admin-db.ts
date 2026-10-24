type LeadRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  country: string;
  service_category: string;
  preferred_contact_method: string;
  source: string;
  stage: string;
  created_at: string;
  updated_at: string;
};

export async function readRecentLeads(): Promise<LeadRow[]> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("ADMIN_DATABASE_NOT_CONFIGURED");
  let parsed: URL;
  try {
    parsed = new URL(connectionString);
  } catch {
    throw new Error("ADMIN_DATABASE_NOT_CONFIGURED");
  }
  if (!parsed.hostname || !parsed.username || !parsed.pathname) throw new Error("ADMIN_DATABASE_NOT_CONFIGURED");
  const endpoint = `https://${parsed.hostname}:${parsed.port ? Number(parsed.port) : 443}/sql`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Neon-Connection-String": connectionString,
      "Neon-Raw-Text-Output": "true",
      "Neon-Array-Mode": "true"
    },
    body: JSON.stringify({
      query: "select id, full_name, email, phone, whatsapp, country, service_category, preferred_contact_method, source, stage, created_at, updated_at from public.leads order by created_at desc limit 250",
      params: []
    }),
    cache: "no-store"
  });
  if (!response.ok) throw new Error("ADMIN_DATABASE_QUERY_FAILED");
  const result = await response.json() as { fields?: { name: string }[]; rows?: unknown[][] };
  const fields = result.fields || [];
  return (result.rows || []).map((row) => {
    const record = Object.fromEntries(row.map((value, index) => [fields[index]?.name || String(index), value]));
    return {
      id: String(record.id || ""),
      full_name: String(record.full_name || ""),
      email: String(record.email || ""),
      phone: record.phone == null ? null : String(record.phone),
      whatsapp: record.whatsapp == null ? null : String(record.whatsapp),
      country: String(record.country || ""),
      service_category: String(record.service_category || ""),
      preferred_contact_method: String(record.preferred_contact_method || ""),
      source: String(record.source || ""),
      stage: String(record.stage || "new"),
      created_at: String(record.created_at || ""),
      updated_at: String(record.updated_at || "")
    };
  });
}
