import {NextResponse} from "next/server";
import {verifyWhatsAppChallenge,verifyWhatsAppSignature} from "../../../../lib/whatsapp";
import {recordLeadEvent,recordWhatsAppMessage} from "../../../../lib/supabase";
export async function GET(request:Request){
 const u=new URL(request.url),c=verifyWhatsAppChallenge(u.searchParams.get("hub.mode"),u.searchParams.get("hub.verify_token"),u.searchParams.get("hub.challenge"));
 return c?new Response(c,{status:200}):NextResponse.json({ok:false,status:"INVALID_WEBHOOK_VERIFICATION"},{status:403});
}
export async function POST(request:Request){
 const raw=await request.text(),sig=request.headers.get("x-hub-signature-256")??"";
 if(!verifyWhatsAppSignature(raw,sig))return NextResponse.json({ok:false,status:"INVALID_WHATSAPP_SIGNATURE"},{status:401});
 const body=JSON.parse(raw) as Record<string,unknown>,message=(body.entry as any)?.[0]?.changes?.[0]?.value?.messages?.[0],eventId=String(message?.id??"");
 if(!eventId)return NextResponse.json({ok:true,ignored:true,status:"NO_MESSAGE_EVENT"});
 const phone=message?.from?String(message.from):null;
 const stored=await recordWhatsAppMessage({provider_message_id:eventId,direction:"inbound",phone,payload:body});
 if(!stored.ok)return NextResponse.json(stored,{status:stored.status==="BLOCKED_PERSISTENCE_NOT_CONFIGURED"?503:502});
 const event=await recordLeadEvent({event_type:"whatsapp_message",external_id:eventId,payload:body});
 if(!event.ok)return NextResponse.json(event,{status:event.status==="BLOCKED_PERSISTENCE_NOT_CONFIGURED"?503:502});
 return NextResponse.json({ok:true,duplicate:stored.duplicate||event.duplicate});
}
