export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main style={{ maxWidth: 520, margin: "4rem auto", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ letterSpacing: ".12em", textTransform: "uppercase", color: "#64748b" }}>NileCare</p>
      <h1>Admin sign in</h1>
      <p>Use Google sign-in, or the temporary password configured only for this Preview deployment.</p>
      {params.error ? <p role="alert">Access denied or sign-in could not be completed. Check your access and try again.</p> : null}
      <a href="/api/admin/auth/login" style={{ display: "inline-block", marginTop: "1rem", padding: ".8rem 1.1rem", borderRadius: 8, background: "#0f172a", color: "white", textDecoration: "none" }}>
        Continue with Google
      </a>
      <hr style={{ margin: "1.5rem 0", border: 0, borderTop: "1px solid #e2e8f0" }} />
      <form action="/api/admin/auth/password" method="post" style={{ display: "grid", gap: ".75rem" }}>
        <label htmlFor="password">Preview-only admin password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" minLength={32} maxLength={256} required style={{ padding: ".75rem", border: "1px solid #cbd5e1", borderRadius: 8 }} />
        <button type="submit" style={{ padding: ".8rem 1.1rem", border: 0, borderRadius: 8, background: "#334155", color: "white", cursor: "pointer" }}>Sign in to Preview</button>
      </form>
      <p style={{ marginTop: "2rem", fontSize: ".9rem", color: "#64748b" }}>Access is restricted to the configured admin account. The password fallback is intended for this isolated Preview only; Production has no password configured.</p>
    </main>
  );
}
