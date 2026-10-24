"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign-in failed");
      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "10vh auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <p style={{ color: "#0f766e", fontWeight: 700 }}>NILECARE</p>
      <h1>Admin sign in</h1>
      <p>Authorized staff only. Patient inquiries are confidential.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
        <label>Email<input autoComplete="username" type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ display: "block", boxSizing: "border-box", width: "100%", padding: 12, marginTop: 5 }} /></label>
        <label>Password<input autoComplete="current-password" type="password" required minLength={16} value={password} onChange={e => setPassword(e.target.value)} style={{ display: "block", boxSizing: "border-box", width: "100%", padding: 12, marginTop: 5 }} /></label>
        <button disabled={busy} type="submit" style={{ padding: 12, background: "#0f766e", color: "white", border: 0, borderRadius: 8 }}>{busy ? "Signing in…" : "Sign in"}</button>
        {error ? <p role="alert" style={{ color: "#b91c1c" }}>{error}</p> : null}
      </form>
    </main>
  );
}
