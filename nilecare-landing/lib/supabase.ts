import {neonInsert} from "./neon";

type SupabaseLead={clinic_name:string;contact_name:string|null;phone:string|null;whatsapp:string|null;email:string|null;source:string};
type Offer={clinic_name:string;service:string;price:number;currency:string;included:string[];excluded:string[];delivery_time:string;refund_policy:string;approved:boolean};
type EventResult={ok:true;duplicate:boolean;data?:unknown}|{ok:false;status:string;provider_status?:number;detail?:string};

const base=()=>{const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;return url&&key?{url:url.replace(/\/$/,""),key}:null};

async function supabaseInsert(table:string,data:unknown):Promise<EventResult>{
  const b=base();
  if(!b)return{ok:false,status:"BLOCKED_PERSISTENCE_NOT_CONFIGURED"};
  const r=await fetch(b.url+"/rest/v1/"+table,{method:"POST",headers:{apikey:b.key,Authorization:"Bearer "+b.key,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(data),cache:"no-store"});
  if(r.status===409)return{ok:true,duplicate:true};
  if(!r.ok)return{ok:false,status:"PERSISTENCE_PROVIDER_ERROR",provider_status:r.status,detail:(await r.text().catch(()=> "")).slice(0,500)};
  return{ok:true,duplicate:false,data:await r.json().catch(()=>null)};
}

function provider(){return process.env.NILECARE_PERSISTENCE_PROVIDER?.toLowerCase()==="neon"?"neon":"supabase"}

async function insert(table:string,data:Record<string,unknown>):Promise<EventResult>{
  return provider()==="neon"?neonInsert(table,data):supabaseInsert(table,data);
}

export function isSupabaseConfigured(){return Boolean(base())}
export function isPersistenceConfigured(){return provider()==="neon"?Boolean(process.env.DATABASE_URL):Boolean(base())}

export async function persistLead(lead:SupabaseLead){return insert("leads",lead)}
export async function persistOffer(offer:Offer){return insert("clinic_offers",offer)}
export async function recordPaymentEvent(event:{provider:string;provider_event_id:string;status:string;payload:unknown}){return insert("payment_events",event)}
export async function recordLeadEvent(event:{event_type:string;external_id:string;payload:unknown}){return insert("lead_events",event)}
export async function recordWhatsAppMessage(event:{provider_message_id:string;direction:"inbound"|"outbound";phone?:string|null;payload:unknown}){return insert("whatsapp_messages",event)}
