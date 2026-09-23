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
