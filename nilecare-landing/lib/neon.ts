type EventResult={ok:true;duplicate:boolean;data?:unknown}|{ok:false;status:string;provider_status?:number;detail?:string};

type NeonResult={fields:{name:string}[];rows:string[][]};

const base=()=>{
  const connectionString=process.env.DATABASE_URL;
  if(!connectionString)return null;
  let parsed:URL;
  try{parsed=new URL(connectionString)}catch{return null}
  if(!parsed.hostname||!parsed.username||!parsed.pathname)return null;
  const port=parsed.port?Number(parsed.port):443;
  const endpoint=`https://${parsed.hostname}:${port}/sql`;
  return {connectionString,endpoint};
};

function encodeValue(value:unknown){
  if(value===undefined)return null;
  if(value===null)return null;
  if(Array.isArray(value)||typeof value==="object")return JSON.stringify(value);
  return value;
}

async function query(sql:string,params:unknown[]):Promise<NeonResult>{
  const b=base();
  if(!b)throw Object.assign(new Error("DATABASE_URL is not configured"),{code:"CONFIG"});
  const response=await fetch(b.endpoint,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Neon-Connection-String":b.connectionString,
      "Neon-Raw-Text-Output":"true",
      "Neon-Array-Mode":"true"
    },
    body:JSON.stringify({query:sql,params:params.map(encodeValue)}),
    cache:"no-store"
  });
  if(response.ok)return await response.json() as NeonResult;
  let detail="";
  try{detail=await response.text()}catch{}
  let error:any=null;
  try{error=JSON.parse(detail)}catch{}
  const e=Object.assign(new Error(error?.message||detail||`Neon HTTP ${response.status}`),{code:error?.code,status:response.status,detail});
  throw e;
}

const allowedTables=new Set(["leads","clinic_offers","payment_events","lead_events","whatsapp_messages"]);

export async function neonInsert(table:string,data:Record<string,unknown>):Promise<EventResult>{
  if(!base())return{ok:false,status:"BLOCKED_PERSISTENCE_NOT_CONFIGURED"};
  if(!allowedTables.has(table))return{ok:false,status:"PERSISTENCE_PROVIDER_ERROR",detail:"Unsupported persistence table"};
  const entries=Object.entries(data);
  const columns=entries.map(([key])=>`"${key.replace(/"/g,'""')}"`).join(",");
  const placeholders=entries.map((_,i)=>`$${i+1}`).join(",");
  try{
    const result=await query(`insert into public."${table}" (${columns}) values (${placeholders}) returning *`,entries.map(([,value])=>value));
    const rows=result.rows||[];
    const fields=result.fields||[];
    const dataRow=rows[0]?Object.fromEntries(rows[0].map((value,index)=>[fields[index]?.name||String(index),value])):undefined;
    return{ok:true,duplicate:false,data:dataRow};
  }catch(error:any){
    if(error?.code==="23505")return{ok:true,duplicate:true};
    if(error?.code==="CONFIG")return{ok:false,status:"BLOCKED_PERSISTENCE_NOT_CONFIGURED"};
    return{ok:false,status:"PERSISTENCE_PROVIDER_ERROR",provider_status:error?.status,detail:String(error?.detail||error?.message||"Neon persistence error").slice(0,500)};
  }
}

export function isNeonConfigured(){return Boolean(base())}

export async function neonHealthCheck(){
  try{
    const result=await query("select current_database() as database,current_schema() as schema",[]);
    const row=result.rows?.[0]||[];
    const fields=result.fields||[];
    const values=Object.fromEntries(row.map((value,index)=>[fields[index]?.name||String(index),value]));
    return{ready:true as const,database:values.database||null,schema:values.schema||null};
  }catch(error:any){
    if(error?.code==="CONFIG")return{ready:false as const,status:"BLOCKED_PERSISTENCE_NOT_CONFIGURED"};
    return{ready:false as const,status:"PERSISTENCE_PROVIDER_ERROR",provider_status:error?.status};
  }
}


export type AdminLeadRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  service_category: string | null;
  preferred_contact_method: string | null;
  stage: string;
  created_at: string | null;
  updated_at: string | null;
};

export async function neonListAdminLeads(): Promise<AdminLeadRow[]> {
  if (!base()) throw Object.assign(new Error("Persistence is not configured"), { code: "CONFIG" });
  const result = await query(
    "select id, full_name, email, phone, country, service_category, preferred_contact_method, stage, created_at, updated_at from public.leads order by created_at desc limit 100",
    []
  );
  const fields = (result.fields || []).map((field) => field.name);
  return (result.rows || []).map((row) => {
    const record = Object.fromEntries(row.map((value, index) => [fields[index] || String(index), value]));
    return {
      id: String(record.id || ""),
      full_name: record.full_name == null ? null : String(record.full_name),
      email: record.email == null ? null : String(record.email),
      phone: record.phone == null ? null : String(record.phone),
      country: record.country == null ? null : String(record.country),
      service_category: record.service_category == null ? null : String(record.service_category),
      preferred_contact_method: record.preferred_contact_method == null ? null : String(record.preferred_contact_method),
      stage: String(record.stage || "new"),
      created_at: record.created_at == null ? null : String(record.created_at),
      updated_at: record.updated_at == null ? null : String(record.updated_at),
    };
  });
}
