import { NextResponse } from "next/server";
import { validateLead } from "../../../lib/domain";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validateLead(body);
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  return NextResponse.json({ ok: false, status: "BLOCKED_PERSISTENCE_NOT_CONFIGURED", message: "Lead accepted by contract but not persisted until a real Supabase project is configured." }, { status: 503 });
}
