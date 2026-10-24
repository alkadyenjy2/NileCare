"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email, token }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setError(result.status === "ADMIN_AUTH_NOT_CONFIGURED"
          ? "Admin login is not configured yet."
          : "The email or access token is not valid.");
        return;
      }
      setToken("");
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "10vh auto", padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>NileCare Admin</h1>
      <p>Sign in with an approved admin email and the private access token.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <label>Email
          <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }} />
        </label>
        <label>Admin access token
          <input type="password" autoComplete="current-password" required minLength={32} value={token} onChange={(event) => setToken(event.target.value)} style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }} />
        </label>
        {error ? <p role="alert" style={{ color: "#b42318" }}>{error}</p> : null}
        <button type="submit" disabled={busy} style={{ padding: 12 }}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
