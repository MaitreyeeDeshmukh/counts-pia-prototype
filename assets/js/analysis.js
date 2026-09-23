// Turning a student's own words into named skills.
// Two paths: Claude when it is available, and an offline keyword pass that
// always quotes the student instead of inventing anything.

const RULES=[
  [/(led|lead|in charge|decid|organiz|captain|reassign|redistribut|took over|took charge)/i,"Leadership"],
  [/(angry|upset|yell|complain|calm|argu)/i,"Conflict resolution"],
  [/(customer|guest|patron|client|visitor)/i,"Customer service"],
  [/(explain|told|convinc|talk|call|email|translat|checked in|check in|kept everyone|let them know|updated)/i,"Communication"],
  [/(fix|figur|solv|broke|problem|wrong|issue|jam|couldn't finish|could not finish|behind|stepped in|made sure)/i,"Problem solving"],
  [/(train|showed (her|him|them)|new hire|taught|teach)/i,"Training others"],
  [/(team|cowork|together|covered|shift lead|group|partner)/i,"Teamwork"],
  [/(rush|busy|juggl|same time|deadline|multiple)/i,"Time management"],
  [/(count|check|inventory|cash|register|accura|detail|form)/i,"Attention to detail"],
  [/(changed|last minute|short.?staffed|instead|adapt|called out)/i,"Adaptability"],
  [/(software|system|computer|excel|code|machine|pos|printer|lab|pipette|data|analy)/i,"Technical skills"],
  [/(open|clos|trusted|responsib|keys|alone|take care|bills)/i,"Responsibility"]
];
const COMMON=new Set("assignment teammates teammate classmate classmates sections everybody everyone project projects semester yesterday something somebody afternoon about actually already another anything because been before being better between called classes coming complete completely consider could couldn customer customers decided details different doing during either enough especially even every everyone everything explain explained figure figured finally finished first following friend getting going group happened having helped helping himself however instead into itself little looked making manager managers maybe might morning mostly myself needed never nothing number often other others people person pretty probably problem problems really right same section semester should shouldn showed since someone something sometimes started still students supposed sure their themselves there they thing things think though through together tomorrow tonight took toward trying turned until using usually wanted watched week weekend weren what when where whether which while whole without working would wouldn yesterday your".split(" "));
function findTerms(text){
  const out=[];
  (text.match(/\b[A-Za-z][A-Za-z0-9-]*\b/g)||[]).forEach(w=>{
    const low=w.toLowerCase();
    const acronym=/^[A-Z0-9]{2,6}$/.test(w)&&!["I","A","OK","AM","PM","TV"].includes(w);
    const longword=low.length>=9&&!COMMON.has(low)&&/^[a-z][a-z-]+$/.test(low)&&!/(ed|ing|ly|ness|ment|ers|ions?al)$/.test(low);
    if((acronym||longword)&&!out.some(t=>t.toLowerCase()===low)&&out.length<4)out.push(acronym?w:low);
  });
  return out;
}
const WHY={
  "Communication":"you kept other people in the loop when you said",
  "Problem solving":"you worked out what to do next when you said",
  "Conflict resolution":"you handled tension between people when you said",
  "Teamwork":"you worked alongside other people when you said",
  "Leadership":"you took the lead on what happened next when you said",
  "Time management":"you handled more than one thing at once when you said",
  "Customer service":"you looked after someone who needed help when you said",
  "Attention to detail":"you caught something that could have been missed when you said",
  "Adaptability":"plans changed and you adjusted when you said",
  "Training others":"you brought someone else up to speed when you said",
  "Technical skills":"you used a specific method or tool when you said",
  "Responsibility":"people counted on you when you said"
};
function whyLine(name,quote){
  const q=(quote||"").replace(/^[\s"']+|[\s"']+$/g,"");
  return (WHY[name]||"it showed up when you said")+' "'+(q.length>120?q.slice(0,117)+"...":q)+'"';
}
function titleFrom(text){
  const w=(text||"").replace(/^i /i,"").split(/\s+/).filter(Boolean).slice(0,6).join(" ").replace(/[.,;:]+$/,"");
  return w?w.charAt(0).toUpperCase()+w.slice(1):"An experience";
}
function fragments(text){
  return text.split(/(?<=[.!?])\s+|\n+|,\s*|\s+(?:so|but|then)\s+/i).map(x=>x.replace(/^(?:and|so|but|then)\s+/i,"").trim()).filter(x=>x.length>3);
}
function fallbackTranslate(text){
  const sentences=text.split(/(?<=[.!?])\s+|\n+/).map(s=>s.trim()).filter(Boolean);
  const frags=fragments(text);
  const found=[];
  for(const [re,name] of RULES){
    if(found.length>=3)break;
    const hit=frags.find(s=>re.test(s))||sentences.find(s=>re.test(s));
    if(hit&&!found.some(f=>f.name===name))found.push({name,quote:hit.length>140?hit.slice(0,137)+"...":hit,why:whyLine(name,hit)});
  }
  const terms=findTerms(text);
  if(!found.length)found.push({name:terms.length?"Technical skills":"Responsibility",quote:sentences[0]||text,why:whyLine(terms.length?"Technical skills":"Responsibility",sentences[0]||text)});
  const first=(sentences[0]||text).replace(/^i /i,"").trim();
  const line=first.charAt(0).toUpperCase()+first.slice(1).replace(/[.]+$/,"")+".";
  return{skills:found,terms,title:titleFrom(sentences[0]||text),resumeLine:line,interviewStory:"Say what you said, \""+(sentences[0]||text)+"\" Then add what you did step by step and how it turned out.",engine:"offline"};
}
async function translate(text,source){
  const field=(state.profile&&state.profile.field)||"I'm still exploring";
  if(sampleFn){
    try{
      const out=await sampleFn.json(
`You help a college student name the skills in their own words. Source type is "${source}". Their major is "${(state.profile&&state.profile.major)||"undeclared"}" and their target career area is "${field}".
Rules you must follow.
1. Never invent facts, numbers, outcomes, or job titles that are not in their words.
2. Pick 1 to 3 skills ONLY from this list: ${SKILLS.join(", ")}.
3. For each skill give an exact quote copied from their words that shows it (max 25 words), and a "why" line of at most 20 words in second person explaining what they actually did that shows the skill. Never praise, never add facts.
3b. title is a 3 to 6 word plain label for this experience, built from their words.
4. resumeLine is one line in plain professional English built only from what they said. No numbers unless they said them. If they named a specific technique, tool, method, software, lab procedure or system, keep that exact term in the line.
4b. terms is a list of the specific techniques, tools, methods, software, lab procedures, systems or equipment they named, copied exactly, up to 4. Empty list if they named none. Never add one they did not say.
5. interviewStory is 3 to 4 sentences in first person, using their phrasing where possible, situation then action then result. If they did not say a result, end with "[add how it turned out]".
Return JSON only: {"title":"","skills":[{"name":"","quote":"","why":""}],"terms":[],"resumeLine":"","interviewStory":""}

Their words:
"""${text}"""`,{modelTier:"quick"});
      if(out&&Array.isArray(out.skills)){
        out.skills=out.skills.filter(s=>SKILLS.includes(s.name)).slice(0,3).map(s=>({name:s.name,quote:s.quote||"",why:s.why||whyLine(s.name,s.quote)}));
        out.title=(typeof out.title==="string"&&out.title.trim())?out.title.trim():titleFrom(text);
        out.terms=(Array.isArray(out.terms)?out.terms:[]).filter(t=>typeof t==="string"&&text.toLowerCase().includes(t.toLowerCase().split(" ")[0])).slice(0,4);
        if(out.terms.length&&!out.skills.some(s=>s.name==="Technical skills")&&out.skills.length<3)out.skills.push({name:"Technical skills",quote:out.terms.join(", "),why:"you named specific tools or methods, "+out.terms.join(", ")});
        if(out.skills.length){out.engine="claude";return out;}
      }
    }catch(e){if(e&&e.code==="not_granted")sampleFn=null;}
  }
  return fallbackTranslate(text);
}
