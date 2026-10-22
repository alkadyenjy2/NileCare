import { NextResponse } from "next/server";
import { POST as submitLead } from "../lead/route";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const token = process.env.NILECARE_E2E_TEST_TOKEN;
  if (!token || new URL(request.url).searchParams.get("token") !== token) return NextResponse.json({ ok: false }, { status: 404 });
  const email = "nilecare-e2e-test@example.com";
  const payload = { full_name: "NileCare Synthetic Test", email, phone: null, whatsapp: null, country: "Test", service_category: "consultation", preferred_contact_method: "email", message: "Synthetic end-to-end verification only. No medical information.", consent: true, source: "landing" };
  const response = await submitLead(new Request(new URL("/api/lead", request.url), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }));
  return NextResponse.json({ status: response.status, result: await response.json() }, { status: response.status });
}
