const BLOCKED_PAGE_IDS=new Set(["179969831856298"]);
export function assertNileCarePageIdentity(pageId:string,pageName:string){
 if(BLOCKED_PAGE_IDS.has(pageId))return{ok:false as const,status:"BLOCKED_META_IDENTITY"};
 if(!pageName||!/nilecare/i.test(pageName))return{ok:false as const,status:"META_PAGE_NAME_MISMATCH"};
 return{ok:true as const};
}
export function isMetaConfigured(){return Boolean(process.env.META_PAGE_ID&&process.env.META_PAGE_ACCESS_TOKEN)}
