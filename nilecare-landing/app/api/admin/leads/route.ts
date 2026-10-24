import { NextResponse } from "next/server";
import { guardAdminApi } from "../../../../lib/admin-guard";
import { neonListAdminLeads } from "../../../../lib/neon";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = guardAdminApi(request);
  if (!session) {
    return NextResponse.json({ ok: false, status: "UNAUTHORIZED" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const leads = await neonListAdminLeads();
    return NextResponse.json({ ok: true, leads }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    const configured = Boolean(process.env.DATABASE_URL);
    return NextResponse.json(
      { ok: false, status: configured ? "PERSISTENCE_PROVIDER_ERROR" : "BLOCKED_PERSISTENCE_NOT_CONFIGURED" },
      { status: configured ? 502 : 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
