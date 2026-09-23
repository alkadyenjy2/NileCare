const BLOCKED_PAGE_IDS=new Set(["179969831856298"]);
export function assertNileCarePageIdentity(pageId:string,pageName:string){if(BLOCKED_PAGE_IDS.has(pageId))return{ok:false as const,status:"BLOCKED_META_IDENTITY"};if(!pageName||!/nilecare/i.test(pageName))return{ok:false as const,status:"META_PAGE_NAME_MISMATCH"};return{ok:true as const}}
export function isMetaConfigured(){return Boolean(process.env.META_PAGE_ID&&process.env.META_PAGE_ACCESS_TOKEN)}
export async function verifyNileCarePage(){
 const id=process.env.META_PAGE_ID,token=process.env.META_PAGE_ACCESS_TOKEN,version=process.env.META_GRAPH_VERSION;
 if(!id||!token||!version)return{ok:false as const,status:"META_CREDENTIALS_MISSING"};
 if(BLOCKED_PAGE_IDS.has(id))return{ok:false as const,status:"BLOCKED_META_IDENTITY"};
 const r=await fetch("https://graph.facebook.com/"+version+"/"+encodeURIComponent(id)+"?fields=id,name,instagram_business_account&access_token="+encodeURIComponent(token),{cache:"no-store"});
 if(!r.ok)return{ok:false as const,status:"META_PROVIDER_ERROR",provider_status:r.status};
 const data=await r.json() as {id?:string;name?:string;instagram_business_account?:unknown};
 if(data.id!==id)return{ok:false as const,status:"META_IDENTITY_MISMATCH"};
 return{ok:true as const,data};
}
