export const SUPPORTED_CURRENCIES = ["EGP","USD","EUR","GBP","SAR","AED"] as const;
export type Currency=(typeof SUPPORTED_CURRENCIES)[number];
export type ClinicOffer={clinic_name:string;service:string;price:number;currency:Currency;included:string[];excluded:string[];delivery_time:string;refund_policy:string;approved:boolean};
export function validateOffer(input:unknown):{ok:true;value:ClinicOffer}|{ok:false;errors:string[]}{
 if(!input||typeof input!=="object")return{ok:false,errors:["body must be an object"]};
 const x=input as Record<string,unknown>,e:string[]=[];
 if(typeof x.clinic_name!=="string"||x.clinic_name.trim().length<2)e.push("clinic_name is required");
 if(typeof x.service!=="string"||x.service.trim().length<2)e.push("service is required");
 if(typeof x.price!=="number"||!Number.isFinite(x.price)||x.price<=0)e.push("price must be greater than 0");
 if(!SUPPORTED_CURRENCIES.includes(x.currency as Currency))e.push("currency is invalid");
 if(!Array.isArray(x.included)||x.included.length===0||x.included.some(v=>typeof v!=="string"||!v.trim()))e.push("included must contain at least one item");
 if(x.excluded!==undefined&&(!Array.isArray(x.excluded)||x.excluded.some(v=>typeof v!=="string")))e.push("excluded must be an array of strings");
 if(typeof x.delivery_time!=="string"||!x.delivery_time.trim())e.push("delivery_time is required");
 if(typeof x.refund_policy!=="string"||!x.refund_policy.trim())e.push("refund_policy is required");
 if(x.approved!==true)e.push("offer must be approved");
 if(e.length)return{ok:false,errors:e};
 return{ok:true,value:{clinic_name:x.clinic_name as string,service:x.service as string,price:x.price as number,currency:x.currency as Currency,included:(x.included as string[]).map(v=>v.trim()),excluded:Array.isArray(x.excluded)?(x.excluded as string[]).map(v=>v.trim()):[],delivery_time:x.delivery_time as string,refund_policy:x.refund_policy as string,approved:true}};
}
