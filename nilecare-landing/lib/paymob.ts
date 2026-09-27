import {createHmac,timingSafeEqual} from "node:crypto";

const HMAC_FIELDS=["amount_cents","created_at","currency","error_occured","has_parent_transaction","id","integration_id","is_3d_secure","is_auth","is_capture","is_refunded","is_standalone_payment","is_voided","order.id","owner","pending","source_data.pan","source_data.sub_type","source_data.type","success"] as const;

function valueAt(payload:Record<string,unknown>,path:string){
 let v:unknown=payload;
 for(const p of path.split("."))v=v&&typeof v==="object"?(v as Record<string,unknown>)[p]:undefined;
 return v==null?"":String(v);
}

export function verifyPaymobHmac(payload:unknown,providedHmac:string){
 const secret=process.env.PAYMOB_HMAC_SECRET;
 if(!secret||!providedHmac||!payload||typeof payload!=="object")return false;
 const source=HMAC_FIELDS.map(f=>valueAt(payload as Record<string,unknown>,f)).join("");
 const expected=createHmac("sha512",secret).update(source).digest("hex"),a=Buffer.from(expected),b=Buffer.from(providedHmac);
 return a.length===b.length&&timingSafeEqual(a,b);
}

export function isPaymobConfigured(){
 return Boolean(process.env.PAYMOB_HMAC_SECRET&&process.env.PAYMOB_INTEGRATION_ID&&process.env.PAYMOB_SECRET_KEY);
}

type IntentionInput={
 amount_cents:number; currency:string; item_name:string; item_description?:string;
 first_name:string; last_name:string; phone_number:string; email:string;
 special_reference:string; notification_url:string; redirection_url:string;
};

export async function createPaymobIntention(input:IntentionInput){
 const secret=process.env.PAYMOB_SECRET_KEY;
 const integration=Number(process.env.PAYMOB_INTEGRATION_ID);
 if(!secret||!Number.isInteger(integration))return{ok:false as const,status:"PAYMOB_NOT_CONFIGURED"};
 const response=await fetch("https://accept.paymob.com/v1/intention/",{
  method:"POST",headers:{"Authorization":"Token "+secret,"Content-Type":"application/json"},
  body:JSON.stringify({
   amount:input.amount_cents,currency:input.currency,payment_methods:[integration],
   items:[{name:input.item_name,amount:input.amount_cents,description:input.item_description||input.item_name,quantity:1}],
   billing_data:{apartment:"N/A",first_name:input.first_name,last_name:input.last_name,street:"N/A",building:"N/A",phone_number:input.phone_number,city:"Cairo",country:"EG",state:"Cairo",email:input.email,floor:"N/A"},
   special_reference:input.special_reference,expiration:3600,notification_url:input.notification_url,redirection_url:input.redirection_url
  }),cache:"no-store"
 });
 const data=await response.json().catch(()=>null);
 if(!response.ok)return{ok:false as const,status:"PAYMOB_PROVIDER_ERROR",provider_status:response.status,detail:JSON.stringify(data).slice(0,500)};
 return{ok:true as const,id:data?.id,order_id:data?.intention_order_id,client_secret:data?.client_secret,status:data?.status};
}