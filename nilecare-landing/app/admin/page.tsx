import { redirect } from "next/navigation";
import { getAdminSession } from "../../lib/admin-guard";
import { listAdminLeads } from "../../lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  let leads;
  try {
    leads = await listAdminLeads();
  } catch {
    return (
      <main style={{ maxWidth: 1000, margin: "3rem auto", padding: "1.5rem", fontFamily: "system-ui, sans-serif" }}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
          <div><p>NileCare Admin</p><h1>Coordination inquiries</h1><p>Signed in as {session.email}</p></div>
          <form action="/api/admin/auth/logout" method="post"><button type="submit">Sign out</button></form>
        </header>
        <p role="alert">Lead records are unavailable. Check Preview database configuration. No data was changed.</p>
      </main>
    );
  }
  return (
    <main style={{ maxWidth: 1200, margin: "2rem auto", padding: "1.25rem", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <div><p style={{ letterSpacing: ".12em", textTransform: "uppercase", color: "#64748b" }}>NileCare</p><h1>Coordination inquiries</h1><p>Signed in as {session.email}. Showing the latest {leads.length} records.</p></div>
        <form action="/api/admin/auth/logout" method="post"><button type="submit">Sign out</button></form>
      </header>
      <p>Read-only dashboard. Status changes and CSV export are not enabled in this recovery version.</p>
      <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: ".9rem" }}>
          <thead><tr>{["Created","Name","Email","Country","Service","Contact","Stage","Consent"].map((label) => <th key={label} scope="col" style={{ textAlign: "left", padding: ".7rem", borderBottom: "2px solid #cbd5e1" }}>{label}</th>)}</tr></thead>
          <tbody>{leads.map((lead) => <tr key={lead.id}>{[
            new Date(lead.created_at).toLocaleString("en-GB"),
            lead.full_name || "—", lead.email || "—", lead.country || "—", lead.service_category || "—",
            lead.preferred_contact_method || lead.phone || lead.whatsapp || "—", lead.stage || "new", lead.consent ? "Yes" : "No",
          ].map((value, index) => <td key={index} style={{ padding: ".7rem", borderBottom: "1px solid #e2e8f0", verticalAlign: "top" }}>{value}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {leads.length === 0 ? <p>No coordination inquiries have been recorded yet.</p> : null}
    </main>
  );
}
