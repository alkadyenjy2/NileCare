import {NextResponse} from "next/server";
import {timingSafeEqual} from "node:crypto";
import {createPaymobIntention} from "../../../../lib/paymob";

function authorized(request:Request){
 const expected=process.env.NILECARE_WEBHOOK_SECRET,provided=request.headers.get("x-nilecare-internal-secret");
 if(!expected||!provided)return false;
 const a=Buffer.from(expected),b=Buffer.from(provided);
 return a.length===b.length&&timingSafeEqual(a,b);
}

export async function POST(request:Request){
 if(!authorized(request))return NextResponse.json({ok:false,status:"UNAUTHORIZED"},{status:401});
 const body=await request.json().catch(()=>null);
 if(!body||typeof body!=="object")return NextResponse.json({ok:false,status:"INVALID_BODY"},{status:400});
 const x=body as Record<string,unknown>,amount=Number(x.amount_cents);
 if(!Number.isInteger(amount)||amount<=0)return NextResponse.json({ok:false,status:"INVALID_AMOUNT"},{status:400});
 for(const key of ["item_name","first_name","last_name","phone_number","email","special_reference"])
  if(typeof x[key]!=="string"||!String(x[key]).trim())return NextResponse.json({ok:false,status:"INVALID_"+key.toUpperCase()},{status:400});
 const origin=new URL(request.url).origin;
 const result=await createPaymobIntention({
  amount_cents:amount,currency:String(x.currency||"EGP"),item_name:String(x.item_name),
  item_description:typeof x.item_description==="string"?x.item_description:undefined,
  first_name:String(x.first_name),last_name:String(x.last_name),phone_number:String(x.phone_number),email:String(x.email),
  special_reference:String(x.special_reference),notification_url:origin+"/api/paymob/webhook",
  redirection_url:origin+"/"
 });
 if(!result.ok)return NextResponse.json(result,{status:result.status==="PAYMOB_NOT_CONFIGURED"?503:502});
 return NextResponse.json({ok:true,id:result.id,order_id:result.order_id,client_secret:result.client_secret,status:result.status},{status:201});
}