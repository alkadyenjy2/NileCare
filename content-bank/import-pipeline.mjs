import {readFile} from "node:fs/promises";
const posts=JSON.parse(await readFile(new URL("./posts.json",import.meta.url),"utf8"));
if(posts.expected_count!==80)throw new Error("EXPECTED_COUNT_MUST_BE_80");
if(!Array.isArray(posts.approved_posts)||posts.approved_posts.length===0){console.log("IMPORT_BLOCKED=APPROVED_CONTENT_MISSING");process.exit(2)}
if(posts.approved_posts.length!==80)throw new Error("APPROVED_POST_COUNT_MUST_BE_80");
const ids=new Set(),images=new Set();
for(const p of posts.approved_posts){if(!p.approved||!p.id||!p.caption||!p.image)throw new Error("INVALID_APPROVED_POST");if(ids.has(p.id)||images.has(p.image))throw new Error("DUPLICATE_POST_OR_IMAGE");ids.add(p.id);images.add(p.image)}
console.log("CONTENT_IMPORT_VALID=PASS");
