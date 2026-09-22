import { NextResponse } from "next/server";
import { validateLead } from "../../../lib/domain";
import { persistLead } from "../../../lib/supabase";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validateLead(body);
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });

  const persisted = await persistLead(result.value);
  if (!persisted.ok) {
    const status = persisted.status === "BLOCKED_PERSISTENCE_NOT_CONFIGURED" ? 503 : 502;
    return NextResponse.json(persisted, { status });
  }
  return NextResponse.json({ ok: true, lead: persisted.data }, { status: 201 });
}
