export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main style={{ maxWidth: 520, margin: "4rem auto", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ letterSpacing: ".12em", textTransform: "uppercase", color: "#64748b" }}>NileCare</p>
      <h1>Admin sign in</h1>
      <p>Sign in with an approved Google account to review coordination inquiries.</p>
      {params.error ? <p role="alert">Access denied or sign-in could not be completed. Check that your account is approved.</p> : null}
      <a href="/api/admin/auth/login" style={{ display: "inline-block", marginTop: "1rem", padding: ".8rem 1.1rem", borderRadius: 8, background: "#0f172a", color: "white", textDecoration: "none" }}>
        Continue with Google
      </a>
      <p style={{ marginTop: "2rem", fontSize: ".9rem", color: "#64748b" }}>Access is restricted to addresses listed in ADMIN_EMAILS.</p>
    </main>
  );
}
