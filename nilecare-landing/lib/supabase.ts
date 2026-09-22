type SupabaseLead = {
  clinic_name: string;
  contact_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  source: string;
};

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function persistLead(lead: SupabaseLead) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false as const, status: "BLOCKED_PERSISTENCE_NOT_CONFIGURED" };
  const response = await fetch(url.replace(/\/$/, "") + "/rest/v1/leads", {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(lead),
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return { ok: false as const, status: "PERSISTENCE_PROVIDER_ERROR", provider_status: response.status, detail: detail.slice(0, 500) };
  }
  const data = await response.json().catch(() => null);
  return { ok: true as const, data };
}
