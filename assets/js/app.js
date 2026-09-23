// Router, event handling, and the demo seed data.

// ---------- render
const TABS=[["home","Home"],["catch","Catch"],["bank","Bank"],["resources","ASU"],["apply","Deadline"]];
const PARENT={manager:"home",unpaid:"home",swap:"bank",insights:"home"};
function render(){
  document.getElementById("app").innerHTML=V[view]();
  document.querySelector(".tabs").style.display=state.profile?"":"none";
  const cur=PARENT[view]||view;
  document.getElementById("tabs").innerHTML=TABS.map(([k,l])=>`<button data-go="${k}" ${cur===k?'aria-current="page"':""}>${l}</button>`).join("");
}
function go(v,mode){stopMic();if(v!==view&&v!=="swap"){tmp={};}if(v==="catch"){tmp.mode=mode||tmp.mode||"class";if(mode)tmp.prompt=null;}view=v;render();window.scrollTo(0,0);}

let rec=null;
function stopMic(){if(rec){try{rec.stop();}catch(e){}rec=null;}tmp.listening=false;}
function toggleMic(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;
  if(tmp.listening){stopMic();render();return;}
  const base=(document.getElementById("said")||{}).value||"";
  try{
    rec=new SR();rec.continuous=true;rec.interimResults=true;rec.lang="en-US";
    rec.onresult=e=>{let t="";for(let i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;tmp.text=(base?base+" ":"")+t;const el=document.getElementById("said");if(el)el.value=tmp.text;};
    rec.onerror=()=>{stopMic();render();const el=document.getElementById("said");if(el){el.placeholder="Voice was blocked here. Type what happened instead.";el.focus();}};
    rec.onend=()=>{if(tmp.listening){tmp.listening=false;render();}};
    rec.start();tmp.listening=true;render();
  }catch(e){stopMic();render();}
}

document.addEventListener("input",e=>{
  if(e.target.id==="said")tmp.text=e.target.value;
  if(e.target.id==="post")tmp.post=e.target.value;
  if(e.target.dataset.u)tmp.unpaid[e.target.dataset.u]=e.target.value;
});
document.addEventListener("change",e=>{
  if(e.target.id==="flt"){tmp.filter=e.target.value;render();}
  if(e.target.id==="addsk"&&e.target.value&&tmp.result){
    const name=e.target.value;
    if(!tmp.result.skills.some(s=>s.name===name))tmp.result.skills.push({name,quote:"",why:"you added this one yourself"});
    render();
  }
});
document.addEventListener("click",async e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.go){go(b.dataset.go);return;}
  if(b.dataset.catch){go("catch",b.dataset.catch);return;}
  if(b.dataset.home){tmp.homeMode=b.dataset.home;tmp.push=false;render();return;}
  if(b.dataset.mode){tmp.mode=b.dataset.mode;tmp.prompt=null;tmp.result=null;render();return;}
  if(b.dataset.cat){tmp.cat=tmp.cat===b.dataset.cat?null:b.dataset.cat;render();return;}
  if(b.dataset.sar){tmp.sar=tmp.sar===b.dataset.sar?null:b.dataset.sar;render();return;}
  if(b.dataset.drop){tmp.result.skills.splice(Number(b.dataset.drop),1);render();return;}
  if(b.dataset.work){tmp.work=b.dataset.work;document.querySelectorAll("#pw button").forEach(x=>x.setAttribute("aria-pressed",x===b));document.getElementById("jobWrap").hidden=tmp.work==="none";return;}
  if(b.dataset.visit){state.visits[b.dataset.visit]=Date.now();save();render();return;}
  if(b.dataset.del){state.stories=state.stories.filter(s=>s.id!==b.dataset.del);save();render();return;}
  if(b.dataset.swap){tmp={swapId:b.dataset.swap};view="swap";render();window.scrollTo(0,0);return;}
  if(b.dataset.chip){const k=b.dataset.chip,a=tmp.swapSkills;const i=a.indexOf(k);i<0?a.push(k):a.splice(i,1);b.setAttribute("aria-pressed",i<0);return;}
  if(b.dataset.yn){const [id,v]=b.dataset.yn.split(":");if(v==="y"){if(tmp.unpaid[id]===undefined)tmp.unpaid[id]="";tmp["n_"+id]=false;}else{delete tmp.unpaid[id];tmp["n_"+id]=true;}render();return;}
  const act=b.dataset.act;
  if(act==="start"){
    const name=document.getElementById("pn").value.trim(),job=document.getElementById("pj").value.trim();
    if(!name){alert("Add your first name to start.");return;}
    if(!tmp.work){alert("Pick whether you work right now.");return;}
    if(tmp.work!=="none"&&!job){alert("Add where you work.");return;}
    state.profile={name,cls:document.getElementById("pc").value.trim()||"Intro class",work:tmp.work,job:tmp.work==="none"?"":job,major:document.getElementById("pm").value.trim(),interests:document.getElementById("pi").value.trim(),field:document.getElementById("pf").value,share:document.getElementById("share").checked};
    save();go("home");
  }
  if(act==="demo"){seedDemo();go("home");}
  if(act==="reset"){
    if(confirm("Log out and start fresh? Everything saved in this browser, including your stories, will be deleted.")){
      try{localStorage.removeItem(KEY);}catch(e){}
      state={profile:null,stories:[],visits:{}};tmp={};go("welcome");
    }
  }
  if(act==="push"){tmp.push=!tmp.push;render();}
  if(act==="gotjob"){const j=prompt("Where do you work?");if(j&&j.trim()){const campus=confirm("Is it an ASU job? OK for yes, Cancel for off campus.");state.profile.work=campus?"campus":"off";state.profile.job=j.trim();save();render();}}
  if(act==="mic")toggleMic();
  if(act==="newprompt"){const L=tmp.mode==="class"?CLASS_PROMPTS:PROMPTS;const i=L.indexOf(tmp.prompt);tmp.prompt=L[(i+1)%L.length];tmp.result=null;render();}
  if(act==="translate"){
    stopMic();const text=(tmp.text||"").trim();
    if(text.length<12){alert("Say or type a little more about what happened, at least a sentence.");return;}
    tmp.busy=true;tmp.result=null;render();tmp.result=await translate(text,tmp.mode==="class"?"class, lab, or project":"work shift");tmp.busy=false;render();
  }
  if(act==="keep"){addStory(tmp.mode==="class"?"class":"shift",tmp.text,tmp.result,null,tmp.cat);go("home");}
  if(act==="discard"){const m=tmp.mode;tmp={mode:m};render();}
  if(act==="edit"){tmp.editing=!tmp.editing;render();}
  if(act==="example"){tmp.text="Two of my teammates couldn't finish their sections of our class project, so I reorganized the tasks, checked in with everyone, and made sure we submitted on time.";tmp.cat="Class";tmp.result=null;render();}
  if(act==="mview"){tmp.mview=true;render();}
  if(act==="mback"){tmp.mview=false;render();}
  if(act==="msend"){
    const who=document.getElementById("mname").value.trim(),line=document.getElementById("mline").value.trim();
    if(!who||line.length<10){alert("Add a name and one full sentence.");return;}
    tmp.busy=true;render();const r=await translate(line,"manager endorsement");addStory("manager",line,r,who);go("bank");
  }
  if(act==="usend"){
    const entries=Object.entries(tmp.unpaid||{}).filter(([k,v])=>v.trim().length>=8);
    if(!entries.length){alert("Say yes to at least one and describe it in a sentence.");return;}
    tmp.busy=true;render();let out="";
    for(const [id,v] of entries){const r=await translate(v,"unpaid work: "+id);addStory("unpaid",v,r);
      out+=`<div class="story"><div class="said">${esc(v)}</div><div style="margin-top:8px">${r.skills.map(s=>`<span class="skillTag">${esc(s.name)}</span>`).join("")}</div><p class="resumeLine small">${esc(r.resumeLine)}</p></div>`;}
    tmp.busy=false;tmp.unpaid={};tmp.uresults=`<section class="panel"><h3>Counted</h3>${out}<button class="btn gold" data-go="bank">See my bank</button></section>`;render();
  }
  if(act==="swapsend"){
    const s=state.stories.find(x=>x.id===tmp.swapId);
    if(!tmp.swapSkills.length){alert("Pick at least one skill you heard.");return;}
    s.peer={skills:tmp.swapSkills.slice(),note:document.getElementById("pnote").value.trim()};save();go("bank");
  }
  if(act==="nextq"){tmp.qi=((tmp.qi||0)+1)%QUESTIONS.length;render();}
  if(act==="match"){
    const post=(tmp.post||"").trim();if(post.length<30){alert("Paste more of the posting, at least a few lines.");return;}
    tmp.busy=true;tmp.match=null;render();tmp.match=await matchStories(post);tmp.busy=false;render();
  }
});

function addStory(source,original,r,from,category){state.stories.push({id:uid(),date:Date.now(),source,from:from||null,category:category||null,title:r.title||titleFrom(original),original,skills:r.skills,terms:r.terms||[],resumeLine:r.resumeLine,interviewStory:r.interviewStory});save();}

async function matchStories(post){
  const bank=state.stories.map((s,i)=>({i,original:s.original,skills:(s.skills||[]).map(k=>k.name)}));
  if(sampleFn){
    try{
      const out=await sampleFn.json(
`A student is applying to this posting. Choose up to 3 stories from their bank that best fit it.
Rules. Never invent facts or numbers. Use only what is in the stories. Keep their phrasing where possible.
Return JSON only: {"picks":[{"i":0,"why":"one sentence on why it fits the posting","bullet":"one resume bullet from their words only"}],"missing":"one sentence naming a requirement in the posting none of the stories show, or empty string"}

Posting:
"""${post.slice(0,4000)}"""

Bank:
${JSON.stringify(bank).slice(0,8000)}`,{modelTier:"default"});
      if(out&&Array.isArray(out.picks)&&out.picks.length){
        return `<h3>Your best stories for this</h3>`+out.picks.filter(p=>state.stories[p.i]).map(p=>{const s=state.stories[p.i];return `<div class="story"><div class="said">${esc(s.original)}</div><p class="small muted" style="margin-top:8px">${esc(p.why)}</p><p class="resumeLine">${esc(p.bullet)}</p></div>`;}).join("")+(out.missing?`<p class="notice">${esc(out.missing)}</p>`:"")+`<p class="small muted">Picked by Claude from your own stories.</p>`;
      }
    }catch(e){}
  }
  const words=post.toLowerCase();
  const scored=state.stories.map(s=>({s,score:(s.skills||[]).reduce((a,k)=>a+(words.includes(k.name.toLowerCase().split(" ")[0])?2:0),0)})).sort((a,b)=>b.score-a.score).slice(0,3);
  return `<h3>Your best stories for this</h3>`+scored.map(({s})=>`<div class="story"><div class="said">${esc(s.original)}</div><div style="margin-top:8px">${(s.skills||[]).map(k=>`<span class="skillTag">${esc(k.name)}</span>`).join("")}</div><p class="resumeLine small">${esc(s.resumeLine)}</p></div>`).join("")+`<p class="small muted">Offline match by skill keywords.</p>`;
}

function seedDemo(){
  const d=n=>Date.now()-n*86400000;
  state.profile={name:"Sam",cls:"ASU101-FALL",work:"campus",job:"Campus library front desk",major:"Business Administration",interests:"marketing",field:"Business",share:true};
  state.visits={};
  state.stories=[
    {id:uid(),date:d(50),title:"Group project that stalled",category:"Class",source:"class",original:"Our group project for my marketing class fell apart because nobody agreed on the survey. I set up a quick vote, split the questions between us, and we turned it in on time.",skills:[{name:"Leadership",quote:"I set up a quick vote"},{name:"Teamwork",quote:"split the questions between us"},{name:"Conflict resolution",quote:"nobody agreed on the survey"}],resumeLine:"Organized a stalled class project team by running a vote and dividing the survey work, meeting the deadline.",interviewStory:"In my marketing class our group couldn't agree on the survey. I set up a quick vote and split the questions between us. We turned it in on time."},
    {id:uid(),date:d(9),title:"Fixed a broken spreadsheet",category:"Class",source:"class",original:"I had to redo my whole spreadsheet for accounting because the formulas broke. I figured out which cells were wrong and explained the fix to two people in my section.",skills:[{name:"Problem solving",quote:"I figured out which cells were wrong"},{name:"Technical skills",quote:"redo my whole spreadsheet"},{name:"Communication",quote:"explained the fix to two people in my section"}],terms:["spreadsheet formulas"],resumeLine:"Rebuilt a broken accounting spreadsheet and explained the fix to classmates.",interviewStory:"My accounting spreadsheet broke and I had to redo it. I tracked down which cells were wrong and fixed them, then showed two classmates the fix. [add how it turned out]"},
    {id:uid(),date:d(60),title:"Translating for my family",category:"Caregiving",source:"unpaid",original:"I translate for my mom at the doctor and fill out all the insurance forms for my family.",skills:[{name:"Communication",quote:"I translate for my mom at the doctor"},{name:"Responsibility",quote:"fill out all the insurance forms for my family"}],resumeLine:"Serve as family interpreter in medical settings and manage household insurance paperwork.",interviewStory:"I translate for my mom at doctor visits and I handle our family's insurance forms. [add how it turned out]"},
    {id:uid(),date:d(40),title:"Upset patron at the desk",category:"Work",source:"shift",original:"A student was really upset because his hold had expired and he needed the book for an exam tomorrow. I calmed him down, checked the other campus, and got it transferred for the morning.",skills:[{name:"Conflict resolution",quote:"I calmed him down"},{name:"Problem solving",quote:"checked the other campus, and got it transferred for the morning"}],resumeLine:"Resolved an upset patron's expired hold by locating the item at another campus and arranging a next morning transfer.",interviewStory:"A student came to the desk upset because his hold expired before an exam. I calmed him down and checked the other campus. I got the book transferred for the morning so he had it in time.",peer:{skills:["Conflict resolution","Customer service"],note:"You stayed way calmer than I would have."}},
    {id:uid(),date:d(32),title:"Short staffed in finals week",category:"Work",source:"shift",original:"Two people called out so it was just me and one new person during finals week. I showed her how to do checkouts while I handled the line.",skills:[{name:"Training others",quote:"I showed her how to do checkouts"},{name:"Adaptability",quote:"Two people called out"},{name:"Time management",quote:"while I handled the line"}],resumeLine:"Trained a new coworker on checkouts while managing the service line during a short staffed finals week shift.",interviewStory:"During finals week two people called out, leaving me with one new hire. I showed her checkouts while I kept the line moving. [add how it turned out]"},
    {id:uid(),date:d(21),title:"My supervisor on closing alone",category:"Work",source:"manager",from:"Dana, desk supervisor",original:"Sam is the person I trust to close alone. The drawer is always right and nothing gets left undone.",skills:[{name:"Responsibility",quote:"the person I trust to close alone"},{name:"Attention to detail",quote:"The drawer is always right"}],resumeLine:"Trusted by supervisor to close the desk independently with accurate cash drawer reconciliation.",interviewStory:"My supervisor trusts me to close alone. I make sure the drawer is right and nothing is left undone."},
    {id:uid(),date:d(4),title:"Printer system went down",category:"Work",source:"shift",original:"The printer system went down and a line formed. I figured out it was the queue, restarted it, and told everyone waiting what was happening.",skills:[{name:"Problem solving",quote:"I figured out it was the queue, restarted it"},{name:"Communication",quote:"told everyone waiting what was happening"},{name:"Technical skills",quote:"restarted it"}],terms:["print queue"],resumeLine:"Diagnosed and restarted a failed print queue while keeping waiting patrons informed.",interviewStory:"The printer system went down and a line formed. I figured out it was the queue and restarted it, and I told everyone waiting what was going on. [add how it turned out]"}
  ];
  save();
}
render();
