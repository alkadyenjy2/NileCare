import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "./admin-auth.mjs";

export const ADMIN_SESSION_COOKIE = "nilecare_admin_session";

function tokenFromCookieHeader(header: string | null) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === ADMIN_SESSION_COOKIE) {
      try { return decodeURIComponent(part.slice(separator + 1).trim()); } catch { return null; }
    }
  }
  return null;
}

export function guardAdminApi(request: Request) {
  const token = tokenFromCookieHeader(request.headers.get("cookie"));
  return token ? verifySessionToken(token) : null;
}

export async function guardAdminPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session) redirect("/admin/login");
  return session;
}
