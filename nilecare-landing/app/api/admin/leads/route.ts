import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, parseAdminEmails, verifyAdminSession } from "../../../../lib/admin-auth.mjs";
import { readRecentLeads } from "../../../../lib/admin-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const jar = await cookies();
  const session = verifyAdminSession(jar.get(ADMIN_SESSION_COOKIE)?.value, process.env.AUTH_SECRET || "", parseAdminEmails(process.env.ADMIN_EMAILS));
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  try {
    const leads = await readRecentLeads();
    return NextResponse.json({ ok: true, leads }, { headers: { "Cache-Control": "no-store, private" } });
  } catch {
    return NextResponse.json({ ok: false, error: "Lead storage is not ready. Check the database migration and connection." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
