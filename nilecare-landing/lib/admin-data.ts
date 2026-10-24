import { buildNeonSqlEndpoint, mapNeonLeadRows } from "./admin-data-core.mjs";

export type AdminLead = {
  id: string; full_name: string | null; email: string | null; phone: string | null;
  whatsapp: string | null; country: string | null; service_category: string | null;
  preferred_contact_method: string | null; message: string | null; consent: boolean;
  source: string; stage: string; created_at: string;
};

export async function listAdminLeads(): Promise<AdminLead[]> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("ADMIN_DATABASE_NOT_CONFIGURED");
  let endpoint: string;
  try { endpoint = buildNeonSqlEndpoint(connectionString); }
  catch { throw new Error("ADMIN_DATABASE_NOT_CONFIGURED"); }
  const sql = "select id, full_name, email, phone, whatsapp, country, service_category, preferred_contact_method, message, consent, source, stage, created_at from public.leads order by created_at desc limit 200";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Neon-Connection-String": connectionString, "Neon-Raw-Text-Output": "true", "Neon-Array-Mode": "true" },
    body: JSON.stringify({ query: sql, params: [] }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("ADMIN_DATABASE_QUERY_FAILED");
  const result = await response.json() as { fields?: { name: string }[]; rows?: unknown[][] };
  return mapNeonLeadRows(result) as AdminLead[];
}
