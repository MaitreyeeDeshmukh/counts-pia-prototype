// Saved state, small helpers, and the optional Claude hook.
// Everything a student enters lives in their own browser, nowhere else.

let state=load();
let view=state.profile?"home":"welcome";
let tmp={};
let sampleFn=null;

function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.stories)){s.visits=s.visits||{};return s;}}catch(e){}return{profile:null,stories:[],visits:{}};}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function uid(){return Math.random().toString(36).slice(2,10);}
function todayPrompt(m){const L=(m||"shift")==="class"?CLASS_PROMPTS:PROMPTS;const d=new Date();return L[(d.getDate()+state.stories.length)%L.length];}
function majorLabel(){const p=state.profile||{};return p.major||p.field||"your major";}
function fmtDate(t){return new Date(t).toLocaleDateString(undefined,{month:"short",day:"numeric"});}
function works(){return state.profile&&state.profile.work!=="none";}
function eligible(r){return !r.requires||(state.profile&&state.profile.work==="campus");}

if(window.claude&&window.claude.use){window.claude.use("sample").then(s=>{sampleFn=s;}).catch(()=>{});}
