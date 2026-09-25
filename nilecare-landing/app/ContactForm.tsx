"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [state, setState] = useState("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setState(response.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }
  return (
    <form className="lead-form" onSubmit={submit}>
      <input name="clinic_name" placeholder="Clinic name" required minLength={2} />
      <input name="contact_name" placeholder="Contact name" />
      <input name="whatsapp" placeholder="WhatsApp" />
      <input name="email" type="email" placeholder="Email" />
      <input type="hidden" name="source" value="landing" />
      <button type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Request coordination"}
      </button>
      {state === "sent" && <p>Request received.</p>}
      {state === "error" && <p>Service is not connected yet. Please try again later.</p>}
    </form>
  );
}
