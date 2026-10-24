import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_SECONDS, adminConfigReady, createAdminSession, verifyAdminCredentials } from "../../../../lib/admin-auth.mjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 415 });
  }
  const raw = await request.text();
  if (raw.length > 4096) return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 }); }

  if (!adminConfigReady()) return NextResponse.json({ ok: false, error: "Admin sign-in is not configured" }, { status: 503 });
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  if (!verifyAdminCredentials(input.email, input.password)) {
    return NextResponse.json({ ok: false, error: "Email or password is incorrect" }, { status: 401 });
  }

  const email = String(input.email).trim().toLowerCase();
  const token = createAdminSession(email, process.env.AUTH_SECRET!);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
