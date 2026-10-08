import {NextResponse} from "next/server";
import {neonHealthCheck} from "../../../lib/neon";

export const dynamic = "force-dynamic";

export async function GET() {
  const provider = process.env.NILECARE_PERSISTENCE_PROVIDER?.toLowerCase()==="supabase" ? "supabase" : "neon";
  if(provider==="neon"){
    const persistence=await neonHealthCheck();
    return NextResponse.json(
      {status:persistence.ready?"ok":"degraded",service:"nilecare",persistence:{provider,ready:persistence.ready,database:persistence.database||null,schema:persistence.schema||null,status:persistence.status||null},timestamp:new Date().toISOString()},
      {status:persistence.ready?200:503}
    );
  }
  const configured=Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY);
  return NextResponse.json(
    {status:configured?"ok":"degraded",service:"nilecare",persistence:{provider,ready:configured,database:null,schema:null,status:configured?null:"BLOCKED_PERSISTENCE_NOT_CONFIGURED"},timestamp:new Date().toISOString()},
    {status:configured?200:503}
  );
}
