import { createAdminSession } from "../../../../../lib/admin-session.mjs";
import { verifyAdminPassword } from "../../../../../lib/admin-password.mjs";
import { ADMIN_SESSION_COOKIE } from "../../../../../lib/admin-guard";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/x-www-form-urlencoded") && !contentType.toLowerCase().startsWith("multipart/form-data")) {
    return NextResponse.json({ ok: false, error: "INVALID_REQUEST" }, { status: 415, headers: { "Cache-Control": "no-store" } });
  }

  const authSecret = process.env.AUTH_SECRET || "";
  const allowlist = process.env.ADMIN_EMAILS || "";
  const expectedHash = process.env.ADMIN_PASSWORD_SHA256 || "";
  const email = allowlist.split(",").map((value) => value.trim().toLowerCase()).find(Boolean) || "";
  if (authSecret.length < 32 || !email || !/^[a-f0-9]{64}$/i.test(expectedHash)) {
    return NextResponse.json({ ok: false, error: "ADMIN_AUTH_NOT_CONFIGURED" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  let password = "";
  try {
    const form = await request.formData();
    const value = form.get("password");
    if (typeof value === "string") password = value;
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_REQUEST" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  if (!verifyAdminPassword(password, expectedHash)) {
    return NextResponse.redirect(new URL("/admin/login?error=access_denied", request.url), { status: 303, headers: { "Cache-Control": "no-store" } });
  }

  const session = createAdminSession(email, authSecret);
  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  response.cookies.set(ADMIN_SESSION_COOKIE, session, {
    httpOnly: true, secure: new URL(request.url).protocol === "https:", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
