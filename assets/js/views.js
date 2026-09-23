// One function per screen. Each returns an HTML string that app.js renders.

// ---------- views
const V={};
V.welcome=()=>`
  <div class="top"><div class="brand"><span class="tallyLogo"><i></i><i></i><i></i><i></i></span>Counts</div></div>
  <h1>Everything you do Counts.</h1>
  <p class="muted">Your classes, your job, your life. Counts asks one short question right after it happens, keeps your answer in your own words, and shows you the skills inside it. When a skill is missing for your major, it points you to the ASU resource that builds it.</p>
  <div class="chips" aria-label="What counts"><span class="skillTag">Learning</span><span class="skillTag">Work</span><span class="skillTag">Life</span></div>
  ${journeyHTML()}
  <div class="panel">
    <label for="pc">Class code from your intro class</label><input id="pc" placeholder="e.g. ASU101-FALL" value="ASU101-FALL">
    <p class="small muted">Any first year intro course, in person or online. Your instructor only ever sees class totals, never your stories.</p>
    <label for="pn">First name</label><input id="pn" autocomplete="given-name" placeholder="e.g. Sam">
    <label>Do you work right now?</label>
    <div class="seg" id="pw">
      <button class="btn ghost" data-work="none" aria-pressed="false">Not yet</button>
      <button class="btn ghost" data-work="campus" aria-pressed="false">ASU job</button>
      <button class="btn ghost" data-work="off" aria-pressed="false">Off campus job</button>
    </div>
    <div id="jobWrap" hidden><label for="pj">Where?</label><input id="pj" placeholder="e.g. Library front desk, Target, family restaurant"></div>
    <label for="pm">Your major</label><input id="pm" placeholder="e.g. Biomedical Engineering, or undecided">
    <label for="pf">Career interests</label>
    <select id="pf">${Object.keys(FIELD_NEEDS).map(f=>`<option>${f}</option>`).join("")}</select>
    <input id="pi" placeholder="Anything else you're curious about, optional" style="margin-top:8px">
    <p class="small muted">Counts uses your major as a starting point, not a box. Pick "I'm still exploring" and it still works.</p>
    <div class="toggle"><input type="checkbox" id="share" checked><label for="share" style="margin:0;font-weight:400">Add my skill counts to my class totals. Counts only, never my words.</label></div>
    <div style="margin-top:18px" class="row">
      <button class="btn gold" data-act="start">Start counting</button>
      <button class="btn ghost" data-act="demo">Load a sample semester</button>
    </div>
    <p class="small muted" style="margin-top:10px">The sample semester fills the app with a made up student so you can see it grown in. Your data stays in this browser.</p>
  </div>`;

V.home=()=>{
  const p=state.profile,c=skillCounts(),total=state.stories.length,sorted=Object.keys(c).sort((a,b)=>c[b]-c[a]),g=gaps();
  const mode=tmp.homeMode||"class";
  const pushText=mode==="shift"?"Shift done?":"Class done?";
  const hero=`
  <div class="seg" style="margin-bottom:10px"><button class="btn ghost" data-home="class" aria-pressed="${mode==="class"}">After class</button><button class="btn ghost" data-home="shift" aria-pressed="${mode==="shift"}">After a shift</button></div>
  ${mode==="shift"&&!works()?`<section class="hero">
    <p class="muted small">No job yet, ${esc(p.name)}? That's fine.</p>
    <p class="prompt">When you start working, you'll get one question after every shift.</p>
    <button class="btn gold" data-act="gotjob">I have a job now</button>
  </section>`:`<section class="hero">
    <p class="muted small">${mode==="shift"?`Shift just ended, ${esc(p.name)}?`:`Just got out of class, ${esc(p.name)}?`}</p>
    <p class="prompt">${esc(todayPrompt(mode))}</p>
    <button class="btn gold" data-catch="${mode}">Answer in 60 seconds</button>
  </section>`}
  <p class="small muted" style="margin:10px 2px">${mode==="shift"?`You'll get this question after each shift at ${esc(p.job)}.`:`You'll get one question after class, a lab, or a project deadline.`} <button class="switch" data-act="push">Preview the reminder</button></p>
  ${tmp.push?`<button class="pushcard" data-catch="${mode}"><span class="pushicon"><span class="tallyLogo" style="height:16px"><i style="background:#fff"></i><i style="background:#fff"></i><i style="background:#fff"></i></span></span><span><b>Counts</b><br><span class="small">${pushText} ${esc(todayPrompt(mode))} Tap to answer out loud.</span></span></button>`:""}
  ${works()?"":`<p class="small muted" style="margin:10px 2px">Start a job later? <button class="switch" data-act="gotjob">Turn on shift questions</button></p>`}`;
  return `
  <div class="top"><div class="brand"><span class="tallyLogo"><i></i><i></i><i></i><i></i></span>Counts</div><span class="muted small">${esc(p.major||p.cls||"")}</span></div>
  ${hero}
  ${journeyHTML(total?"Evidence":"Experience")}
  <section class="panel">
    <h3>${total?`${total} ${total===1?"story":"stories"} counted`:"Nothing counted yet"}</h3>
    ${total?sorted.map(k=>`<div class="tallyRow"><span>${esc(k)}</span>${tallyHTML(c[k])}</div>`).join(""):`<p class="muted">Your first answer starts the tally.</p>`}
  </section>
  ${g.length?`<section class="panel">
    <h3>Skills you want to grow</h3>
    <p class="muted small">Based on ${esc(majorLabel())}${state.profile.interests?" and "+esc(state.profile.interests):""}. Nothing here says you lack anything.</p>
    ${g.slice(0,2).map(k=>{const r=resourcesFor(k)[0];return `<div class="story"><span class="skillTag gap">${esc(k)}</span><p class="small">You haven't captured many experiences using ${esc(k.toLowerCase())} yet.</p>${r?`<p class="small muted"><b>Why Counts recommends this.</b> ${esc(r.name)}. ${esc(r.what)}</p>`:""}</div>`;}).join("")}
    <button class="btn ghost" data-go="resources">See all my ASU resources</button>
  </section>`:""}
  <section class="panel">
    <h3>More ways to count</h3>
    ${works()?`<div class="story"><p><b>Manager writes one line.</b> Your manager writes one sentence about something you handled well. No account needed.</p><button class="btn ghost" data-go="manager">Ask my manager</button></div>`:""}
    <div class="story"><p><b>Unpaid work counts too.</b> Caregiving, translating for family, the family shop, high school jobs.</p><button class="btn ghost" data-go="unpaid">Does this count?</button></div>
    <div class="story"><p><b>Swap with a classmate.</b> Trade one story. They write down the skills they hear.</p><button class="btn ghost" data-go="bank">Pick a story to swap</button></div>
  </section>
  <button class="switch" data-go="insights">Instructor and ASU view</button>`;
};

V.catch=()=>{
  const sr=window.SpeechRecognition||window.webkitSpeechRecognition;
  return `
  <h2>Catch it</h2>
  <div class="seg" style="margin-top:10px"><button class="btn ghost" data-mode="class" aria-pressed="${tmp.mode==="class"}">After class</button><button class="btn ghost" data-mode="shift" aria-pressed="${tmp.mode==="shift"}">After a shift</button><button class="btn ghost" data-go="unpaid">Life</button></div>
  <p class="prompt">${esc(tmp.prompt||(tmp.prompt=todayPrompt(tmp.mode)))}</p>
  ${sr?`<button class="mic ${tmp.listening?"live":""}" data-act="mic" aria-label="${tmp.listening?"Stop recording":"Start recording"}" aria-pressed="${!!tmp.listening}">
     <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
   </button><p class="muted small" style="text-align:center">${tmp.listening?"Listening. Tap to stop.":"Tap and talk, or type below."}</p>`:`<p class="notice">Voice isn't available in this browser, so type it for now.</p>`}
  <label for="said">Your words</label>
  <textarea id="said" placeholder="Just say what happened. Messy is fine.">${esc(tmp.text||"")}</textarea>
  <div class="chips" style="margin-top:8px">${CATEGORIES.map(c=>`<button class="chip" data-cat="${esc(c)}" aria-pressed="${tmp.cat===c}">${esc(c)}</button>`).join("")}</div>
  <p class="small muted" style="margin-top:6px">Optional tag. Big or small, if you learned something from it, it counts.</p>
  <div class="row" style="margin-top:14px">
    <button class="btn gold" data-act="translate" ${tmp.busy?"disabled":""}>${tmp.busy?'<span class="spinner"></span> Naming skills':"Name the skills"}</button>
    <button class="btn ghost" data-act="newprompt">Different question</button>
    ${tmp.text?"":`<button class="btn ghost" data-act="example">See an example</button>`}
  </div>
  ${tmp.result?resultHTML(tmp.result,tmp.text):""}`;
};
function resultHTML(r,text){
  const editing=!!tmp.editing;
  const unused=SKILLS.filter(k=>!r.skills.some(s=>s.name===k));
  return `<section class="panel">
    <h3>What you said</h3><div class="said">${esc(text)}</div>
    <h3 style="margin-top:16px">Counts noticed</h3>
    <p class="small muted">Counts suggests. You decide what stays.</p>
    <div class="pair">${r.skills.map((s,i)=>`<div class="noticed"><div class="row" style="justify-content:space-between;align-items:center;gap:6px"><span class="skillTag">${esc(s.name)}</span>${editing?`<button class="btn ghost small" style="padding:4px 10px" data-drop="${i}">Remove</button>`:""}</div><div class="small">${esc(s.why||("it showed up when you said \""+(s.quote||"")+"\""))}</div></div>`).join("")}</div>
    ${editing?`<div style="margin-top:10px"><label for="addsk" class="small">Add a skill you think belongs</label><select id="addsk"><option value="">Pick one</option>${unused.map(k=>`<option>${esc(k)}</option>`).join("")}</select></div>`:""}
    ${r.skills.length?"":`<p class="notice">No skills left. Add one back, or start over.</p>`}
    ${(r.terms&&r.terms.length)?`<h3 style="margin-top:16px">Named in your words</h3><div>${r.terms.map(t=>`<span class="skillTag gap">${esc(t)}</span>`).join("")}</div><p class="small muted">Specific techniques and tools you said. These go on your resume exactly as you named them.</p>`:""}
    <h3 style="margin-top:16px">Resume line draft</h3><p class="resumeLine">${esc(r.resumeLine)}</p>
    <h3 style="margin-top:16px">Interview story draft</h3><p>${esc(r.interviewStory)}</p>
    <p class="small muted">${r.engine==="claude"?"Drafted by Claude from your words only. Nothing added that you didn't say.":"Offline draft. Skills matched to your own sentences."}</p>
    <div class="row" style="margin-top:12px">
      <button class="btn gold" data-act="keep" ${r.skills.length?"":"disabled"}>${editing?"Save and count it":"This sounds right"}</button>
      <button class="btn ghost" data-act="edit">${editing?"Done editing":"Edit"}</button>
      <button class="btn ghost" data-act="discard">Start over</button>
    </div>
  </section>`;
}

V.bank=()=>{
  const c=skillCounts(),keys=Object.keys(c).sort(),f=tmp.filter||"";
  const list=state.stories.filter(s=>!f||(s.skills||[]).some(k=>k.name===f)).slice().sort((a,b)=>b.date-a.date);
  const label=s=>s.source==="manager"?"From "+esc(s.from||"manager"):s.source==="unpaid"?"Life and unpaid work":s.source==="class"?"After class":"After a shift";
  return `<h2>Story bank</h2>
  <p class="muted">Every story keeps your original words next to the skill language.</p>
  ${journeyHTML("Evidence")}
  ${keys.length?`<label for="flt">Show stories for</label><select id="flt"><option value="">All skills</option>${keys.map(k=>`<option ${k===f?"selected":""}>${esc(k)}</option>`).join("")}</select>`:""}
  <section class="panel">
  ${list.length?list.map(s=>{const sar=tmp.sar===s.id?sarFor(s):null;return `<article class="story">
      <h3>${esc(s.title||titleFrom(s.original))}</h3>
      <div class="src">${esc(catOf(s))} &middot; ${label(s)} on ${fmtDate(s.date)}</div>
      <p class="small muted" style="margin-top:8px"><b>What happened</b></p>
      <div class="said" style="margin:4px 0 8px">${esc(s.original)}</div>
      <p class="small muted"><b>Skills demonstrated</b></p>
      <div>${(s.skills||[]).map(k=>`<span class="skillTag">${esc(k.name)}</span>`).join("")}${(s.terms||[]).map(t=>`<span class="skillTag gap">${esc(t)}</span>`).join("")}</div>
      <p class="small" style="margin-top:8px"><b>Your evidence.</b> ${esc(s.resumeLine||"")}</p>
      ${s.peer?`<div class="peer"><b>A classmate heard</b> ${s.peer.skills.map(esc).join(", ")}${s.peer.note?`. "${esc(s.peer.note)}"`:""}</div>`:""}
      ${sar?`<div class="sar"><b class="small">Practice telling this story</b>
        <p class="small"><b>Situation.</b> ${esc(sar.situation)}</p>
        <p class="small"><b>Action.</b> ${esc(sar.action)}</p>
        <p class="small"><b>Result.</b> ${esc(sar.result)}</p>
        <p class="small muted">Your own words, put in interview order. Anything in brackets is yours to fill in.</p></div>`:""}
      <div class="row" style="margin-top:8px">
        <button class="btn ghost small" data-sar="${s.id}" style="padding:6px 12px">${sar?"Hide":"Use for an interview"}</button>
        ${s.peer?"":`<button class="btn ghost small" data-swap="${s.id}" style="padding:6px 12px">Swap with a classmate</button>`}
        <button class="btn ghost small" data-del="${s.id}" style="padding:6px 12px">Remove</button>
      </div>
    </article>`;}).join(""):`<div class="empty"><p>No stories yet.</p><button class="btn gold" data-go="catch">Count your first one</button></div>`}
  </section>`;
};

V.swap=()=>{
  const s=state.stories.find(x=>x.id===tmp.swapId);if(!s)return V.bank();
  const picked=tmp.swapSkills||(tmp.swapSkills=[]);
  return `<p class="notice">Your classmate's side. In the full version they get this from a class pairing. Here, hand them your phone.</p>
  <div class="manager" style="margin-top:14px">
    <h2>What skills do you hear?</h2>
    <p class="muted small">A classmate shared this story. Pick what you hear. There are no wrong answers.</p>
    <div class="said" style="margin:10px 0">${esc(s.original)}</div>
    <div class="chips">${SKILLS.map(k=>`<button class="chip" data-chip="${esc(k)}" aria-pressed="${picked.includes(k)}">${esc(k)}</button>`).join("")}</div>
    <label for="pnote">One sentence for them, optional</label><input id="pnote" placeholder="e.g. You stayed way calmer than I would have.">
    <div class="row" style="margin-top:14px"><button class="btn gold" data-act="swapsend">Send to my classmate</button><button class="btn ghost" data-go="bank">Cancel</button></div>
  </div>`;
};

V.resources=()=>{
  const g=gaps(),shown=new Set();
  const gapCards=g.map(k=>{const rs=resourcesFor(k).filter(r=>!shown.has(r.id));rs.forEach(r=>shown.add(r.id));return rs.length?`<p class="grow"><b>${esc(k)}.</b> You haven't captured many experiences using ${esc(k.toLowerCase())} yet.</p>`+rs.map(r=>resCard(r,k)).join(""):"";}).join("");
  const rest=RESOURCES.filter(r=>!shown.has(r.id));
  const locked=rest.filter(r=>!eligible(r));
  const open=rest.filter(eligible);
  const bring=state.stories.slice().sort((a,b)=>(b.skills||[]).length-(a.skills||[]).length).slice(0,3);
  return `<h2>Your ASU resources</h2>
  <p class="muted">Matched to the skills you want to grow for ${esc(majorLabel())}. Tap "I went" after you go.</p>
  ${journeyHTML("Next step")}
  ${gapCards?`<section class="panel"><h3>Skills you want to grow</h3>${gapCards}</section>`:`<section class="panel"><p>Your stories already cover the core skills for ${esc(majorLabel())}. Nice. Everything else is below.</p></section>`}
  ${bring.length?`<section class="panel"><h3>Bring these to your appointment</h3><p class="small muted">Walk in with real stories instead of starting from zero.</p>${bring.map(s=>`<div class="said" style="margin:8px 0">${esc(s.original)}</div>`).join("")}</section>`:""}
  ${open.length?`<section class="panel"><h3>Also open to you</h3>${open.map(r=>resCard(r)).join("")}</section>`:""}
  ${locked.length?`<section class="panel"><h3>Unlocks with an ASU job</h3>${locked.map(r=>`<div class="res"><b>${esc(r.name)}</b><div class="who">For ${esc(r.who)}.</div></div>`).join("")}</section>`:""}
  <p class="small muted">Resource list checked against ASU web pages in September 2026. Confirm details with each office.</p>`;
};

V.apply=()=>{
  const q=QUESTIONS[tmp.qi||0],mine=storiesFor(q.skill),r=resourcesFor(q.skill)[0];
  return `<h2>Deadline mode</h2>
  <section class="panel">
    <h3>Practice a question</h3>
    <p class="prompt" style="font-size:22px">${esc(q.q)}</p>
    ${mine.length?`<p class="small muted">Answer with your own story. You already have ${mine.length}.</p>${mine.slice(0,2).map(s=>`<div class="said" style="margin:8px 0">${esc(s.original)}</div><p class="small">${esc(s.interviewStory||"")}</p>`).join("")}`:
      `<p class="notice">You don't have a ${esc(q.skill.toLowerCase())} story yet. ${r?`${esc(r.name)} can help you build one.`:""} Catch the next time it happens.</p>`}
    <div class="row" style="margin-top:12px"><button class="btn ghost" data-act="nextq">Next question</button></div>
  </section>
  <section class="panel">
    <h3>Match a posting</h3>
    <p class="muted small">Paste a job or internship posting. Counts picks your best stories for it.</p>
    <textarea id="post" placeholder="Paste the job description here">${esc(tmp.post||"")}</textarea>
    <div class="row" style="margin-top:14px"><button class="btn gold" data-act="match" ${(tmp.busy||!state.stories.length)?"disabled":""}>${tmp.busy?'<span class="spinner"></span> Matching':"Match my stories"}</button></div>
    ${!state.stories.length?`<p class="notice" style="margin-top:12px">Count a few stories first.</p>`:""}
    ${tmp.match?`<div style="margin-top:12px">${tmp.match}</div>`:""}
  </section>`;
};

V.manager=()=>{
  const p=state.profile;
  if(tmp.mview){
    return `<p class="notice">Preview of what your manager sees on their phone. No login, no app.</p>
    <div class="manager" style="margin-top:14px">
      <h2>One line for ${esc(p.name)}</h2>
      <p class="muted">${esc(p.name)} works with you at ${esc(p.job)} and is building a record of their skills. What's one thing they handled well recently?</p>
      <label for="mname">Your name and role</label><input id="mname" placeholder="e.g. Dana, shift supervisor">
      <label for="mline">One sentence</label><textarea id="mline" style="min-height:90px" placeholder="e.g. Sam stayed calm with an upset customer and fixed the refund without calling me."></textarea>
      <div class="row" style="margin-top:14px"><button class="btn gold" data-act="msend" ${tmp.busy?"disabled":""}>${tmp.busy?'<span class="spinner"></span> Sending':"Send"}</button><button class="btn ghost" data-act="mback">Back</button></div>
    </div>`;
  }
  const link="counts.app/line/"+(tmp.mcode||(tmp.mcode=uid()));
  return `<h2>Manager writes one line</h2>
  <p class="muted">Off campus jobs don't show up anywhere at ASU. This puts your work on record in under fifteen seconds.</p>
  <section class="panel">
    <h3>Your link</h3><div class="linkBox">${link}</div>
    <p class="small muted">In the full version this link texts your manager. In this prototype, preview their side below.</p>
    <div class="row" style="margin-top:12px"><button class="btn gold" data-act="mview">See what my manager sees</button></div>
  </section>`;
};

V.unpaid=()=>{
  const a=tmp.unpaid||(tmp.unpaid={});
  return `<h2>Does this count?</h2>
  <p class="muted">Yes. Answer what applies. Skip what doesn't.</p>
  <section class="panel">
  ${UNPAID.map(u=>`<div class="qa">
     <p><b>${esc(u.q)}</b></p>
     <div class="choice"><button class="btn ghost" data-yn="${u.id}:y" aria-pressed="${a[u.id]!==undefined}">Yes</button><button class="btn ghost" data-yn="${u.id}:n" aria-pressed="${a[u.id]===undefined&&!!tmp["n_"+u.id]}">No</button></div>
     ${a[u.id]!==undefined?`<label for="u_${u.id}" class="small">${esc(u.hint)}</label><textarea id="u_${u.id}" data-u="${u.id}" style="min-height:80px">${esc(a[u.id])}</textarea>`:""}
   </div>`).join("")}
  <div class="row" style="margin-top:14px"><button class="btn gold" data-act="usend" ${tmp.busy?"disabled":""}>${tmp.busy?'<span class="spinner"></span> Counting':"Count it"}</button></div>
  </section>
  ${tmp.uresults||""}`;
};

// Instructor and ASU view. Sample class numbers plus this student if they opted in.
V.insights=()=>{
  const base={students:27,stories:212,skills:{"Communication":61,"Customer service":44,"Responsibility":39,"Problem solving":33,"Teamwork":28,"Time management":24,"Adaptability":18,"Attention to detail":15,"Conflict resolution":11,"Training others":8,"Technical skills":7,"Leadership":6},visits:{cds:9,sdcp:14,careerlink:11,lil:5,workplus:4,orgs:7,changemaker:3},suggested:{cds:19,sdcp:22,careerlink:17,lil:12,workplus:10,orgs:15,changemaker:9},unpaidShare:31};
  const me=state.profile&&state.profile.share;
  const skills={...base.skills};let stories=base.stories,students=base.students;
  if(me){students+=1;stories+=state.stories.length;Object.entries(skillCounts()).forEach(([k,v])=>{skills[k]=(skills[k]||0)+v;});}
  const visits={...base.visits};if(me)Object.keys(state.visits).forEach(k=>{visits[k]=(visits[k]||0)+1;});
  const max=Math.max(...Object.values(skills));
  const visitsTotal=Object.values(visits).reduce((a,b)=>a+b,0),suggestedTotal=Object.values(base.suggested).reduce((a,b)=>a+b,0);
  const sortedSkills=Object.entries(skills).sort((a,b)=>b[1]-a[1]);
  const low=sortedSkills.slice(-3).map(x=>x[0]);
  return `<button class="switch" data-go="home">Back to my Counts</button>
  <h2>${esc((state.profile&&state.profile.cls)||"Intro class")} insights</h2>
  <p class="muted">What an instructor or ASU office sees. Totals only. No names, no stories.</p>
  <p class="notice">Sample class numbers for this demo${me?", plus your own counts":""}.</p>
  <div class="stats"><div class="stat"><b>${students}</b><span class="small">students</span></div><div class="stat"><b>${stories}</b><span class="small">stories</span></div><div class="stat"><b>${Math.round(visitsTotal/suggestedTotal*100)}%</b><span class="small">went to a resource</span></div></div>
  <section class="panel"><h3>Where stories come from</h3>
    ${[["Learning",46],["Work",31],["Life and unpaid work",23]].map(([k,v])=>`<div style="margin:8px 0"><div class="metric"><span>${k}</span><span class="muted">${v}%</span></div><div class="bar"><span style="width:${v}%"></span></div></div>`).join("")}
    <p class="small muted">Work, learning, and life, the three places the challenge asks us to look.</p>
  </section>
  <section class="panel"><h3>Skills this class is building</h3>
    ${sortedSkills.map(([k,v])=>`<div style="margin:8px 0"><div class="metric"><span>${esc(k)}</span><span class="muted">${v}</span></div><div class="bar"><span style="width:${Math.round(v/max*100)}%"></span></div></div>`).join("")}
  </section>
  <section class="panel"><h3>Where this class is thin</h3>
    <p>${low.map(esc).join(", ")}. A good topic for a class session, or a partner visit from ASU Career Services.</p>
  </section>
  <section class="panel"><h3>Resources students actually used</h3>
    <p class="small muted">Suggested by Counts, then marked "I went" by the student.</p>
    ${RESOURCES.map(r=>{const s=base.suggested[r.id],v=visits[r.id]||0;return `<div style="margin:10px 0"><div class="metric"><span>${esc(r.name)}</span><span class="muted">${v} of ${s}</span></div><div class="bar gold"><span style="width:${Math.min(100,Math.round(v/s*100))}%"></span></div></div>`;}).join("")}
  </section>`;
};
