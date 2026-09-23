// Static data for Counts: skills, prompts, ASU resources, interview questions.
// Nothing here depends on the DOM, so it is safe to load first.

const KEY="counts.v3";
const CATEGORIES=["Class","Work","Club","Volunteer","Caregiving","Life"];
const JOURNEY=["Experience","Reflection","Skill","Evidence","Growth","Next step"];
const SKILLS=["Communication","Problem solving","Conflict resolution","Teamwork","Leadership","Time management","Customer service","Attention to detail","Adaptability","Training others","Technical skills","Responsibility"];
const FIELD_NEEDS={
  "Engineering":["Problem solving","Technical skills","Teamwork","Attention to detail","Communication"],
  "Business":["Communication","Leadership","Customer service","Problem solving","Time management"],
  "Healthcare":["Communication","Attention to detail","Responsibility","Adaptability","Teamwork"],
  "Education":["Communication","Training others","Adaptability","Leadership","Conflict resolution"],
  "Tech and software":["Technical skills","Problem solving","Teamwork","Adaptability","Communication"],
  "Sustainability and policy":["Communication","Problem solving","Teamwork","Leadership","Adaptability"],
  "I'm still exploring":["Communication","Problem solving","Teamwork","Responsibility","Adaptability"]
};
// Resources checked against ASU web pages, Sept 2026. requires: "campus" = ASU student employees only.
const RESOURCES=[
  {id:"cds",name:"Career Development Specialist appointment",org:"ASU Career Services",who:"All ASU students",what:"One-on-one help with your resume and internship search.",skills:["Communication","Leadership","Problem solving","Customer service"],url:"https://career.eoss.asu.edu/channels/resume-application-materials/"},
  {id:"sdcp",name:"Sun Devil Career Prep",org:"ASU Career Services",who:"All ASU students",what:"AI tool for resume help and practice interviews.",skills:["Communication","Conflict resolution"],url:"https://career.eoss.asu.edu/channels/ai/"},
  {id:"careerlink",name:"ASU CareerLink",org:"ASU Career Services",who:"All ASU students",what:"Find jobs, internships and career events to build experience.",skills:["Customer service","Responsibility","Teamwork","Time management"],url:"https://career.eoss.asu.edu/resources/handshake/"},
  {id:"lil",name:"LinkedIn Learning",org:"Work+",who:"ASU student employees on ASU payroll",what:"Free courses on tools and workplace skills.",skills:["Technical skills","Time management","Attention to detail","Leadership"],url:"https://workplus.asu.edu/resources-students",requires:"campus"},
  {id:"workplus",name:"Work+ Student Employee Hub",org:"Work+",who:"ASU student employees",what:"Career competency training and events for working learners.",skills:["Leadership","Teamwork","Adaptability","Training others"],url:"https://workplus.asu.edu/resources-students",requires:"campus"},
  {id:"orgs",name:"Student organizations",org:"Sun Devil Central",who:"All ASU students",what:"Take a role in a club or team project.",skills:["Teamwork","Leadership","Conflict resolution","Training others","Adaptability"],url:null},
  {id:"changemaker",name:"Changemaker Central",org:"ASU",who:"All ASU students",what:"Community service and social impact projects you can join or lead.",skills:["Leadership","Responsibility","Adaptability","Teamwork"],url:null}
];
const CLASS_PROMPTS=["What was the hardest part of a class, lab, or project this week?","You worked in a group. What did you do when it got stuck?","What did you explain to a classmate, or figure out on your own?","What did you learn in class that you could use outside it?","What part of an assignment are you proud of? What exactly did you do?","What did you have to redo or fix, and how?"];
const PROMPTS=["What was the hardest moment of this shift?","Did anyone need help today that only you could give?","What went wrong, and what did you do about it?","What did you do today that a new hire couldn't?","Who did you have to calm down, convince, or explain something to?","What did you juggle today?"];
const UNPAID=[
  {id:"care",q:"Do you take care of someone? A sibling, parent, grandparent.",hint:"What does a normal week of that look like?"},
  {id:"translate",q:"Do you translate or handle paperwork for your family?",hint:"Think forms, doctor visits, phone calls, school meetings."},
  {id:"shop",q:"Do you help with a family business?",hint:"The register, inventory, orders, customers."},
  {id:"community",q:"Do you volunteer or help run anything? A club, team, place of worship, community group.",hint:"What are you trusted with?"},
  {id:"school",q:"Did you have a job or big responsibility in high school?",hint:"A part time job, team captain, running an event."}
];
const QUESTIONS=[
  {q:"Tell me about a time you dealt with a difficult person.",skill:"Conflict resolution"},
  {q:"Tell me about a time you solved a problem on the spot.",skill:"Problem solving"},
  {q:"Describe a time you worked with a team to get something done.",skill:"Teamwork"},
  {q:"Tell me about a time you had to juggle a lot at once.",skill:"Time management"},
  {q:"Tell me about a time you took the lead.",skill:"Leadership"},
  {q:"Tell me about a time plans changed at the last minute.",skill:"Adaptability"},
  {q:"Tell me about a time you taught someone something.",skill:"Training others"},
  {q:"Tell me about a time someone depended on you.",skill:"Responsibility"}
];
