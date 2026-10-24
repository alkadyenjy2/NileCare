import { randomBytes, createHash } from "node:crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function cookieOptions(maxAge: number) {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge };
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const publicUrl = process.env.NILECARE_PUBLIC_URL?.replace(/\/$/, "");
  const secret = process.env.AUTH_SECRET || "";
  if (!clientId || !publicUrl || secret.length < 32 || !process.env.ADMIN_EMAILS?.trim()) {
    return NextResponse.json({ ok: false, error: "ADMIN_AUTH_NOT_CONFIGURED" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const redirectUri = publicUrl + "/api/admin/auth/callback";
  const target = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  target.searchParams.set("client_id", clientId);
  target.searchParams.set("redirect_uri", redirectUri);
  target.searchParams.set("response_type", "code");
  target.searchParams.set("scope", "openid email profile");
  target.searchParams.set("state", state);
  target.searchParams.set("code_challenge", challenge);
  target.searchParams.set("code_challenge_method", "S256");
  target.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(target);
  response.cookies.set("nilecare_admin_oauth_state", state, cookieOptions(600));
  response.cookies.set("nilecare_admin_oauth_verifier", verifier, cookieOptions(600));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
