export const STAGES=["new","qualified","offer_sent","payment_pending","paid","case_active","closed_lost"] as const;
export type Stage=(typeof STAGES)[number];
const ALLOWED:Record<Stage,readonly Stage[]>={new:["qualified","closed_lost"],qualified:["offer_sent","closed_lost"],offer_sent:["payment_pending","closed_lost"],payment_pending:["paid","closed_lost"],paid:["case_active","closed_lost"],case_active:["closed_lost"],closed_lost:[]};
export function isStage(value:unknown):value is Stage{return typeof value==="string"&&(STAGES as readonly string[]).includes(value)}
export function canTransition(from:Stage,to:Stage,context?:{provider_evidence_id?:string|null;loss_reason?:string|null}):boolean{
 if(from===to)return true;if(!ALLOWED[from].includes(to))return false;
 if(to==="paid"&&!context?.provider_evidence_id)return false;
 if(to==="closed_lost"&&!context?.loss_reason?.trim())return false;
 return true;
}
export type LeadInput={clinic_name:string;contact_name:string|null;phone:string|null;whatsapp:string|null;email:string|null;source:"landing"|"whatsapp"|"meta"|"referral"|"manual"};
export function validateLead(input:unknown):{ok:true;value:LeadInput}|{ok:false;errors:string[]}{
 if(!input||typeof input!=="object")return{ok:false,errors:["body must be an object"]};
 const x=input as Record<string,unknown>,errors:string[]=[];
 if(typeof x.clinic_name!=="string"||x.clinic_name.trim().length<2)errors.push("clinic_name is required");
 if(!["landing","whatsapp","meta","referral","manual"].includes(String(x.source)))errors.push("source is invalid");
 for(const key of ["contact_name","phone","whatsapp","email"])if(x[key]!==undefined&&x[key]!==null&&typeof x[key]!=="string")errors.push(key+" must be a string or null");
 if(errors.length)return{ok:false,errors};
 return{ok:true,value:{clinic_name:String(x.clinic_name).trim(),contact_name:x.contact_name==null?null:String(x.contact_name).trim(),phone:x.phone==null?null:String(x.phone).trim(),whatsapp:x.whatsapp==null?null:String(x.whatsapp).trim(),email:x.email==null?null:String(x.email).trim(),source:x.source as LeadInput["source"]}};
}