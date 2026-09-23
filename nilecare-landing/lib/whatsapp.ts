import {createHmac,timingSafeEqual} from "node:crypto";
export function verifyWhatsAppSignature(rawBody:string,signature:string){
 const secret=process.env.WHATSAPP_APP_SECRET;if(!secret||!signature.startsWith("sha256="))return false;
 const expected="sha256="+createHmac("sha256",secret).update(rawBody).digest("hex"),a=Buffer.from(expected),b=Buffer.from(signature);
 return a.length===b.length&&timingSafeEqual(a,b);
}
export function verifyWhatsAppChallenge(mode:string|null,token:string|null,challenge:string|null){
 const expected=process.env.WEBHOOK_VERIFY_TOKEN;
 return mode==="subscribe"&&token&&challenge&&expected&&token===expected?challenge:null;
}
export function isWhatsAppConfigured(){return Boolean(process.env.WABA_ID&&process.env.PHONE_NUMBER_ID&&process.env.WHATSAPP_ACCESS_TOKEN&&process.env.WEBHOOK_VERIFY_TOKEN&&process.env.WHATSAPP_APP_SECRET)}
