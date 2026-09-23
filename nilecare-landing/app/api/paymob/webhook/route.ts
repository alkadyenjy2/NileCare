import {NextResponse} from "next/server";
import {verifyPaymobHmac} from "../../../../lib/paymob";
import {recordPaymentEvent} from "../../../../lib/supabase";
export async function POST(request:Request){
 const body=await request.json().catch(()=>null);
 const hmac=request.headers.get("x-paymob-hmac")??(body&&typeof body==="object"?String((body as Record<string,unknown>).hmac??""):"");
 if(!verifyPaymobHmac(body,hmac))return NextResponse.json({ok:false,status:"INVALID_PAYMOB_HMAC"},{status:401});
 const event=body as Record<string,unknown>,tx=event.obj&&typeof event.obj==="object"?event.obj as Record<string,unknown>:event,id=String(tx.id??event.id??"");
 if(!id)return NextResponse.json({ok:false,status:"PAYMOB_EVENT_ID_MISSING"},{status:400});
 const result=await recordPaymentEvent({provider:"paymob",provider_event_id:id,status:Boolean(tx.success)?"paid":"failed",payload:event});
 if(!result.ok)return NextResponse.json(result,{status:result.status==="BLOCKED_PERSISTENCE_NOT_CONFIGURED"?503:502});
 return NextResponse.json({ok:true,duplicate:result.duplicate});
}
