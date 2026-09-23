import {createHmac,timingSafeEqual} from "node:crypto";
const HMAC_FIELDS=["amount_cents","created_at","currency","error_occured","has_parent_transaction","id","integration_id","is_3d_secure","is_auth","is_capture","is_refunded","is_standalone_payment","is_voided","order.id","owner","pending","source_data.pan","source_data.sub_type","source_data.type","success"] as const;
function valueAt(payload:Record<string,unknown>,path:string){let v:unknown=payload;for(const p of path.split("."))v=v&&typeof v==="object"?(v as Record<string,unknown>)[p]:undefined;return v==null?"":String(v)}
export function verifyPaymobHmac(payload:unknown,providedHmac:string){
 const secret=process.env.PAYMOB_HMAC_SECRET;if(!secret||!providedHmac||!payload||typeof payload!=="object")return false;
 const source=HMAC_FIELDS.map(f=>valueAt(payload as Record<string,unknown>,f)).join(""),expected=createHmac("sha512",secret).update(source).digest("hex"),a=Buffer.from(expected),b=Buffer.from(providedHmac);
 return a.length===b.length&&timingSafeEqual(a,b);
}
export function isPaymobConfigured(){return Boolean(process.env.PAYMOB_API_KEY&&process.env.PAYMOB_INTEGRATION_ID&&process.env.PAYMOB_IFRAME_ID&&process.env.PAYMOB_HMAC_SECRET)}
