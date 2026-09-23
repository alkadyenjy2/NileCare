import {NextResponse} from "next/server";
import {verifyWhatsAppChallenge,verifyWhatsAppSignature} from "../../../../lib/whatsapp";
import {recordLeadEvent} from "../../../../lib/supabase";
export async function GET(request:Request){
 const u=new URL(request.url),c=verifyWhatsAppChallenge(u.searchParams.get("hub.mode"),u.searchParams.get("hub.verify_token"),u.searchParams.get("hub.challenge"));
 return c?new Response(c,{status:200}):NextResponse.json({ok:false,status:"INVALID_WEBHOOK_VERIFICATION"},{status:403});
}
export async function POST(request:Request){
 const raw=await request.text(),sig=request.headers.get("x-hub-signature-256")??"";
 if(!verifyWhatsAppSignature(raw,sig))return NextResponse.json({ok:false,status:"INVALID_WHATSAPP_SIGNATURE"},{status:401});
 const body=JSON.parse(raw) as Record<string,unknown>,entry=(body.entry as any)?.[0],eventId=String(entry?.changes?.[0]?.value?.messages?.[0]?.id??"");
 if(!eventId)return NextResponse.json({ok:true,ignored:true,status:"NO_MESSAGE_EVENT"});
 const result=await recordLeadEvent({event_type:"whatsapp_message",external_id:eventId,payload:body});
 if(!result.ok)return NextResponse.json(result,{status:result.status==="BLOCKED_PERSISTENCE_NOT_CONFIGURED"?503:502});
 return NextResponse.json({ok:true,duplicate:result.duplicate});
}
