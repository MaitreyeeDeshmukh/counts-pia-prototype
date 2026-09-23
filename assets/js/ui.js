// Small pieces of markup reused across screens.

function skillCounts(){const c={};state.stories.forEach(s=>(s.skills||[]).forEach(k=>{c[k.name]=(c[k.name]||0)+1;}));return c;}
function tallyHTML(n){let h="",left=n;while(left>0){const g=Math.min(5,left);h+=`<span class="group ${g===5?"full":""}">${"<i></i>".repeat(Math.min(g,4))}</span>`;left-=g;}return `<span class="tallies" aria-label="${n} stories">${h}</span>`;}
function gaps(){const need=FIELD_NEEDS[(state.profile&&state.profile.field)||"I'm still exploring"]||FIELD_NEEDS["I'm still exploring"];const c=skillCounts();return need.filter(n=>!c[n]);}
function resourcesFor(skill){return RESOURCES.filter(r=>r.skills.includes(skill)&&eligible(r));}
function storiesFor(skill){return state.stories.filter(s=>(s.skills||[]).some(k=>k.name===skill));}
function journeyHTML(active){
  return `<div class="journey" aria-label="How Counts works">${JOURNEY.map(j=>`<span class="${j===active?"on":""}">${j}</span>`).join('<i aria-hidden="true">\u203A</i>')}</div>`;
}
function catOf(s){return s.category||(s.source==="class"?"Class":s.source==="unpaid"?"Life":s.source==="manager"?"Work":"Work");}
function sarFor(s){
  let sent=(s.original||"").split(/(?<=[.!?])\s+|\n+/).map(x=>x.trim()).filter(Boolean);
  if(sent.length===1)sent=fragments(s.original||"");
  const situation=sent[0]||s.original||"";
  const action=sent.length>2?sent.slice(1,-1).join(" "):(sent[1]||"");
  const result=sent.length>1?sent[sent.length-1]:"";
  return{situation:situation,action:action||"[add what you did, step by step]",result:(sent.length>1&&result!==situation)?result:"[add how it turned out]"};
}
function resCard(r,skill){
  const went=state.visits[r.id];
  return `<div class="res">
    <h3>${esc(r.name)}</h3>
    <div class="who">${esc(r.org)}. For ${esc(r.who)}.</div>
    <p class="small">${esc(r.what)}</p>
    ${skill?`<div class="whyres"><b class="small">Why Counts recommends this</b><p class="small">You want to grow ${esc(skill.toLowerCase())}, and this is where at ASU you can practise it. Bring a story from your bank so you start with something real.</p></div>`:""}
    <div class="row">
      ${r.url?`<a href="${r.url}" target="_blank" rel="noopener" class="btn ghost small" style="padding:8px 14px;text-decoration:none">Explore resource</a>`:`<span class="small muted">Search ${esc(r.org)} on asu.edu</span>`}
      <button class="btn ${went?"ghost":"gold"} small" style="padding:8px 14px" data-visit="${r.id}">${went?"Went, thanks":"I went"}</button>
    </div>
  </div>`;
}
