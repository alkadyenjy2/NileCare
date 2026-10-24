import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../lib/admin-guard";
import { listAdminLeads } from "../../../../lib/admin-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  try {
    const leads = await listAdminLeads();
    return NextResponse.json({ ok: true, leads }, { headers: { "Cache-Control": "no-store", "Vary": "Cookie" } });
  } catch {
    return NextResponse.json({ ok: false, error: "ADMIN_LEADS_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
