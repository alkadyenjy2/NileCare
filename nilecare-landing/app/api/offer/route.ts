import {NextResponse} from "next/server";
import {timingSafeEqual} from "node:crypto";
import {validateOffer} from "../../../lib/offer";
import {persistOffer} from "../../../lib/supabase";
function authorized(request:Request){
 const expected=process.env.NILECARE_WEBHOOK_SECRET,provided=request.headers.get("x-nilecare-internal-secret");
 if(!expected||!provided)return false;
 const a=Buffer.from(expected),b=Buffer.from(provided); return a.length===b.length&&timingSafeEqual(a,b);
}
export async function POST(request:Request){
 if(!authorized(request))return NextResponse.json({ok:false,status:"UNAUTHORIZED"},{status:401});
 const body=await request.json().catch(()=>null),result=validateOffer(body);
 if(!result.ok)return NextResponse.json({ok:false,errors:result.errors},{status:400});
 const persisted=await persistOffer(result.value);
 if(!persisted.ok)return NextResponse.json(persisted,{status:persisted.status==="BLOCKED_PERSISTENCE_NOT_CONFIGURED"?503:502});
 return NextResponse.json({ok:true,offer:persisted.data},{status:201});
}
