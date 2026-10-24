import { guardAdminPage } from "../../lib/admin-guard";
import { neonListAdminLeads } from "../../lib/neon";
import AdminLogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

function display(value: string | null | undefined) {
  return value && value.trim() ? value : "—";
}

export default async function AdminPage() {
  const session = await guardAdminPage();
  let leads: Awaited<ReturnType<typeof neonListAdminLeads>> = [];
  let unavailable = "";
  try {
    leads = await neonListAdminLeads();
  } catch {
    unavailable = process.env.DATABASE_URL
      ? "The lead database could not be reached. No lead data is shown."
      : "The database connection is not configured for this deployment.";
  }

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif", maxWidth: 1400, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div><h1>NileCare Admin</h1><p>Signed in as {session.email}. Showing at most 100 most recent leads.</p></div>
        <AdminLogoutButton />
      </header>
      {unavailable ? <p role="status">{unavailable}</p> : (
        <>
          <p>{leads.length} lead{leads.length === 1 ? "" : "s"} loaded.</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead><tr>
                {["Created","Name","Email","Phone","Country","Service","Contact preference","Stage"].map((heading) =>
                  <th key={heading} scope="col" style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #ddd", whiteSpace: "nowrap" }}>{heading}</th>
                )}
              </tr></thead>
              <tbody>
                {leads.map((lead) => <tr key={lead.id}>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>{display(lead.created_at ? new Date(lead.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) : null)}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{display(lead.full_name)}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{display(lead.email)}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{display(lead.phone)}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{display(lead.country)}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{display(lead.service_category)}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{display(lead.preferred_contact_method)}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{display(lead.stage)}</td>
                </tr>)}
                {leads.length === 0 ? <tr><td colSpan={8} style={{ padding: 16 }}>No leads found.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
