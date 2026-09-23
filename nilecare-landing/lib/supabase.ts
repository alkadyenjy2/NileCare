type SupabaseLead={clinic_name:string;contact_name:string|null;phone:string|null;whatsapp:string|null;email:string|null;source:string};
type Offer={clinic_name:string;service:string;price:number;currency:string;included:string[];excluded:string[];delivery_time:string;refund_policy:string;approved:boolean};
type EventResult={ok:true;duplicate:boolean;data?:unknown}|{ok:false;status:string;provider_status?:number;detail?:string};
export function isSupabaseConfigured(){return Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY)}
async function post(table:string,data:unknown):Promise<EventResult>{
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return{ok:false,status:"BLOCKED_PERSISTENCE_NOT_CONFIGURED"};
 const r=await fetch(url.replace(/\/$/,"")+"/rest/v1/"+table,{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(data),cache:"no-store"});
 if(!r.ok)return{ok:false,status:"PERSISTENCE_PROVIDER_ERROR",provider_status:r.status,detail:(await r.text().catch(()=>"")).slice(0,500)};
 return{ok:true,duplicate:false,data:await r.json().catch(()=>null)};
}
export async function persistLead(lead:SupabaseLead){return post("leads",lead)}
export async function persistOffer(offer:Offer){return post("clinic_offers",offer)}
export async function recordPaymentEvent(event:{provider:string;provider_event_id:string;status:string;payload:unknown}):Promise<EventResult>{
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return{ok:false,status:"BLOCKED_PERSISTENCE_NOT_CONFIGURED"};
 const r=await fetch(url.replace(/\/$/,"")+"/rest/v1/payment_events",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(event),cache:"no-store"});
 if(r.status===409)return{ok:true,duplicate:true};
 if(!r.ok)return{ok:false,status:"PERSISTENCE_PROVIDER_ERROR",provider_status:r.status,detail:(await r.text().catch(()=> "")).slice(0,500)};
 return{ok:true,duplicate:false,data:await r.json().catch(()=>null)};
}
export async function recordLeadEvent(event:{event_type:string;external_id:string;payload:unknown}):Promise<EventResult>{
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return{ok:false,status:"BLOCKED_PERSISTENCE_NOT_CONFIGURED"};
 const r=await fetch(url.replace(/\/$/,"")+"/rest/v1/lead_events",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(event),cache:"no-store"});
 if(r.status===409)return{ok:true,duplicate:true};
 if(!r.ok)return{ok:false,status:"PERSISTENCE_PROVIDER_ERROR",provider_status:r.status,detail:(await r.text().catch(()=> "")).slice(0,500)};
 return{ok:true,duplicate:false,data:await r.json().catch(()=>null)};
}
