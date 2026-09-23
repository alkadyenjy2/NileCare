import {NextResponse} from "next/server";
import {validateOffer} from "../../../lib/offer";
import {persistOffer} from "../../../lib/supabase";
export async function POST(request:Request){
 const body=await request.json().catch(()=>null),result=validateOffer(body);
 if(!result.ok)return NextResponse.json({ok:false,errors:result.errors},{status:400});
 const persisted=await persistOffer(result.value);
 if(!persisted.ok)return NextResponse.json(persisted,{status:persisted.status==="BLOCKED_PERSISTENCE_NOT_CONFIGURED"?503:502});
 return NextResponse.json({ok:true,offer:persisted.data},{status:201});
}
