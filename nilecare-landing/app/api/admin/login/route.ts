import { NextResponse } from "next/server";
import { createSessionToken, isAllowedAdmin, loginTokenMatches } from "../../../../lib/admin-auth.mjs";
import { ADMIN_SESSION_COOKIE } from "../../../../lib/admin-guard";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ ok: false, status: "INVALID_REQUEST" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, status: "INVALID_REQUEST" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const input = body as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const token = typeof input.token === "string" ? input.token : "";
  if (!isAllowedAdmin(email) || !loginTokenMatches(token)) {
    return NextResponse.json({ ok: false, status: "INVALID_CREDENTIALS" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const session = createSessionToken(email);
  if (!session) {
    return NextResponse.json({ ok: false, status: "ADMIN_AUTH_NOT_CONFIGURED" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(ADMIN_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return response;
}
