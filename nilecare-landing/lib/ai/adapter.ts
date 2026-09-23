export type AIResult={ok:true;text:string;provider:string}|{ok:false;status:string;provider:string};
export interface AIProvider{generate(input:string):Promise<AIResult>}
export class DeterministicRuleProvider implements AIProvider{async generate(input:string):Promise<AIResult>{const t=input.trim();return{ok:true,provider:"deterministic",text:t?"NileCare intake: "+t:"NileCare intake received."}}}
export class HuggingFaceProvider implements AIProvider{
 constructor(private token:string,private model:string,private timeoutMs=4000){}
 async generate(input:string):Promise<AIResult>{
  const c=new AbortController(),timer=setTimeout(()=>c.abort(),this.timeoutMs);
  try{
   const r=await fetch("https://api-inference.huggingface.co/models/"+encodeURIComponent(this.model),{method:"POST",headers:{Authorization:"Bearer "+this.token,"Content-Type":"application/json"},body:JSON.stringify({inputs:input}),signal:c.signal});
   if(!r.ok)return{ok:false,provider:"huggingface",status:"PROVIDER_"+r.status};
   const d=await r.json(),t=Array.isArray(d)&&d[0]?.generated_text?String(d[0].generated_text):typeof d?.generated_text==="string"?d.generated_text:JSON.stringify(d);
   return{ok:true,provider:"huggingface",text:t};
  }catch{return{ok:false,provider:"huggingface",status:"AI_PROVIDER_UNAVAILABLE"}}finally{clearTimeout(timer)}
 }
}
export function getAIProvider():AIProvider{return process.env.HF_API_TOKEN&&process.env.HF_MODEL?new HuggingFaceProvider(process.env.HF_API_TOKEN,process.env.HF_MODEL):new DeterministicRuleProvider()}
