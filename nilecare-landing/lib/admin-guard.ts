import { cookies } from "next/headers";
import { verifyAdminSession } from "./admin-session.mjs";

export const ADMIN_SESSION_COOKIE = "nilecare_admin_session";

export async function getAdminSession() {
  const secret = process.env.AUTH_SECRET || "";
  const allowlist = process.env.ADMIN_EMAILS || "";
  if (secret.length < 32 || !allowlist.trim()) return null;
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value, secret, allowlist);
}
