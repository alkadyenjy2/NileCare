import { NextResponse } from "next/server";
import { productionReadiness } from "../../../lib/readiness";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const result = productionReadiness(request);
  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
