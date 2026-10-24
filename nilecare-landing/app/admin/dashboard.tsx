"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = {
  id: string; full_name: string; email: string; phone: string | null; whatsapp: string | null;
  country: string; service_category: string; preferred_contact_method: string; source: string;
  stage: string; created_at: string; updated_at: string;
};

const stages = ["all", "new", "qualified", "offer_sent", "payment_pending", "paid", "case_active", "closed_lost"];

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/leads", { cache: "no-store" })
      .then(async response => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Could not load inquiries");
        return body.leads as Lead[];
      })
      .then(data => { if (active) setLeads(data); })
      .catch(e => { if (active) setError(e instanceof Error ? e.message : "Could not load inquiries"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return leads.filter(lead => (stage === "all" || lead.stage === stage) &&
      (!needle || [lead.full_name, lead.email, lead.country, lead.service_category, lead.phone || "", lead.whatsapp || ""].some(value => value.toLowerCase().includes(needle))));
  }, [leads, search, stage]);

  function exportCsv() {
    const columns: (keyof Lead)[] = ["id", "full_name", "email", "phone", "whatsapp", "country", "service_category", "preferred_contact_method", "source", "stage", "created_at"];
    const quote = (value: unknown) => '"' + String(value ?? "").replace(/"/g, '""') + '"';
    const csv = [columns.join(","), ...filtered.map(lead => columns.map(column => quote(lead[column])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "nilecare-inquiries.csv"; a.click(); URL.revokeObjectURL(url);
  }

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif", color: "#17202a" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div><p style={{ color: "#0f766e", fontWeight: 700, marginBottom: 4 }}>NILECARE</p><h1 style={{ marginTop: 0 }}>Patient inquiries</h1><p style={{ color: "#64748b" }}>Signed in as {adminEmail}. Read-only view of the latest 250 inquiries.</p></div>
        <button onClick={signOut} style={{ padding: "10px 14px" }}>Sign out</button>
      </header>
      <section style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "24px 0" }}>
        <input aria-label="Search inquiries" placeholder="Search name, email, country, service…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: "1 1 280px", padding: 12 }} />
        <select aria-label="Filter by stage" value={stage} onChange={e => setStage(e.target.value)} style={{ padding: 12 }}>
          {stages.map(value => <option key={value} value={value}>{value === "all" ? "All stages" : value.replaceAll("_", " ")}</option>)}
        </select>
        <button onClick={exportCsv} disabled={!filtered.length} style={{ padding: "10px 14px" }}>Export CSV ({filtered.length})</button>
      </section>
      {loading ? <p>Loading inquiries…</p> : null}
      {error ? <p role="alert" style={{ color: "#b91c1c" }}>{error}</p> : null}
      {!loading && !error ? <p>{filtered.length} inquiries shown · {leads.length} loaded</p> : null}
      <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 850 }}>
          <thead><tr>{["Name", "Email", "Country", "Service", "Stage", "Source", "Received"].map(label => <th key={label} style={{ textAlign: "left", padding: 12, background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>{label}</th>)}</tr></thead>
          <tbody>
            {filtered.map(lead => <tr key={lead.id}>{[lead.full_name, lead.email, lead.country, lead.service_category, lead.stage.replaceAll("_", " "), lead.source, lead.created_at ? new Date(lead.created_at).toLocaleString() : "—"].map((value, i) => <td key={i} style={{ padding: 12, borderBottom: "1px solid #e2e8f0" }}>{value || "—"}</td>)}</tr>)}
            {!loading && !error && filtered.length === 0 ? <tr><td colSpan={7} style={{ padding: 24, textAlign: "center" }}>No inquiries match this search.</td></tr> : null}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 20, color: "#64748b", fontSize: 13 }}>This dashboard is read-only. Lead stage changes and patient-message contents are intentionally not exposed here until their audit and permission flows are implemented.</p>
    </main>
  );
}
