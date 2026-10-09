import { NextResponse } from "next/server";
import { validateLead } from "../../../lib/domain";
import { hasJsonContentType, readJsonBody } from "../../../lib/request-body.mjs";
import { persistLead } from "../../../lib/supabase";

export async function POST(request: Request) {
  if (!hasJsonContentType(request)) {
    return NextResponse.json({ ok: false, errors: ["content-type must be application/json"] }, { status: 415 });
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    const message = parsed.status === 413 ? "request body too large" : "invalid JSON body";
    return NextResponse.json({ ok: false, errors: [message] }, { status: parsed.status });
  }

  const result = validateLead(parsed.value);
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });

  const persisted = await persistLead(result.value);
  if (!persisted.ok) {
    const status = persisted.status === "BLOCKED_PERSISTENCE_NOT_CONFIGURED" ? 503 : 502;
    return NextResponse.json(persisted, { status });
  }
  return NextResponse.json({ ok: true, lead: persisted.data }, { status: 201 });
}
