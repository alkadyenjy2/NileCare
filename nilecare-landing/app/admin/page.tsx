import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, parseAdminEmails, verifyAdminSession } from "../../lib/admin-auth.mjs";
import AdminDashboard from "./dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const jar = await cookies();
  const session = verifyAdminSession(jar.get(ADMIN_SESSION_COOKIE)?.value, process.env.AUTH_SECRET || "", parseAdminEmails(process.env.ADMIN_EMAILS));
  if (!session) redirect("/admin/login");
  return <AdminDashboard adminEmail={session.email} />;
}
