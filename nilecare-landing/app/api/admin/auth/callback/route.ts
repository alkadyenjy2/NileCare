import { createAdminSession, isAllowedAdminEmail } from "../../../../../lib/admin-session.mjs";
import { ADMIN_SESSION_COOKIE } from "../../../../../lib/admin-guard";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function clearOAuthCookies(response: NextResponse) {
  response.cookies.set("nilecare_admin_oauth_state", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  response.cookies.set("nilecare_admin_oauth_verifier", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const publicUrl = process.env.NILECARE_PUBLIC_URL?.replace(/\/$/, "");
  const authSecret = process.env.AUTH_SECRET || "";
  const allowlist = process.env.ADMIN_EMAILS || "";
  const cookieHeader = request.headers.get("cookie") || "";
  const readCookie = (name: string) => cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(name + "="))?.slice(name.length + 1) || "";
  const expectedState = decodeURIComponent(readCookie("nilecare_admin_oauth_state"));
  const verifier = decodeURIComponent(readCookie("nilecare_admin_oauth_verifier"));
  const fail = () => clearOAuthCookies(NextResponse.redirect(new URL("/admin/login?error=access_denied", publicUrl || url.origin)));

  if (oauthError || !code || !state || !expectedState || state !== expectedState || !verifier ||
      !clientId || !clientSecret || !publicUrl || authSecret.length < 32 || !allowlist.trim()) return fail();

  const redirectUri = publicUrl + "/api/admin/auth/callback";
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri,
        grant_type: "authorization_code", code_verifier: verifier,
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) return fail();
    const tokenData = await tokenResponse.json() as { access_token?: string; token_type?: string };
    if (!tokenData.access_token || tokenData.token_type?.toLowerCase() !== "bearer") return fail();

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: "Bearer " + tokenData.access_token },
      cache: "no-store",
    });
    if (!profileResponse.ok) return fail();
    const profile = await profileResponse.json() as { email?: string; email_verified?: boolean };
    const email = profile.email?.trim().toLowerCase() || "";
    if (profile.email_verified !== true || !isAllowedAdminEmail(email, allowlist)) return fail();

    const session = createAdminSession(email, authSecret);
    const response = NextResponse.redirect(new URL("/admin", publicUrl));
    clearOAuthCookies(response);
    response.cookies.set(ADMIN_SESSION_COOKIE, session, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return fail();
  }
}
