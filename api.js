// ============================================================
// FILE: api.js
// JOB: Everything that talks to the outside world -- Claude
// API calls and session persistence. Entirely parked for
// Phase 1 right now; nothing in this file is called from the
// live flow. genBP()/openSB()/sendSB() call the Anthropic API
// directly from the browser today -- this is exactly what
// moves to a backend route once the server is built.
//
// READS FROM: state.js (S, pathSel, sbh)
// CALLS INTO: navigation.js (go)
//             utils.js (startInstall, addMsg)
//             ui.js (setBP)
// MUST LOAD: after state.js, questions.js, utils.js,
//            navigation.js, utils.js, ui.js
// ============================================================

// --- saveProfile/loadSavedProfile: empty stubs, future feature. ---
async function saveProfile(){}
function loadSavedProfile(){}

// --- genBP: parked for Phase 1. Calls the Claude API directly
// (will move to a backend route -- see SF_Backend_Technical_Spec).
// Falls back to a hardcoded Blueprint if the API call fails. ---
async function genBP(){
  if(!pathSel)return;go('p4b');
  startInstall('ib4','im4',['Assembling machine output...','Writing voice statement...','Building first project...','Activating civic value...','Finalizing blueprint...']);
  var pr='You are Scholar Foundry by No Barriers Education.\nStudent machine: Core='+S.type+' (confidence:'+S.p1conf+', secondary:'+S.p1sec+'), Wiring='+S.wire+' (confidence:'+S.p2conf+', secondary:'+S.p2sec+'), Designation="'+S.designation+'", Fuel='+(S.issues.length>1?'['+S.fuel+'] (multiple fuel sources, weave them together naturally)':S.fuel)+', Pathway='+S.path+'\nJSON only. No markdown. {"voice":"One powerful I-statement using their designation and fuel.","project":"Concrete first project tied to their designation and fuel, pathway-appropriate, 2-3 sentences.","path":"2 sentences on where this leads given their designation and pathway.","edge":"1-2 sentences on what makes this machine uniquely hard to replicate."}';
  try{
    var res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:pr}]})});
    var data=await res.json();
    var parsed=JSON.parse(data.content.map(function(x){return x.text||'';}).join('').replace(/```json|```/g,'').trim());
    setBP(parsed);
  }catch(e){
    setBP({voice:'I am the '+S.designation+' powered by '+S.fuel+'. I build the things the world keeps waiting for someone else to make.',project:'Start by finding one person or community affected by '+S.fuel+'. Ask questions, listen, document what you find. That conversation becomes the foundation of everything you build next.',path:'Your path through '+S.path+' gives you the foundation to test your ideas. The students who change things start before they feel ready.',edge:'Your combination of '+S.type+' instincts, '+S.wire+' thinking, and investment in '+S.fuel+' is entirely yours. Nobody else has this machine.'});
  }
}

// --- openSB/sendSB: parked for Phase 1. The AI chatbot sandbox
// -- opens with a designation-aware greeting, then sends each
// student message to Claude with the running conversation
// history (sbh, from state.js) as context. ---
function openSB(){
  sbh=[];
  document.getElementById('sbm').textContent=S.designation+' · '+S.fi+' '+S.fuel;
  var msgs=document.getElementById('sbms');msgs.innerHTML='';
  var opener="Your machine is built. You're the "+S.designation+' powered by '+S.fuel+', heading toward '+S.path+'. This is your space. Brainstorm your first project, draft your college essay, plan your first real move, or just think out loud. What\'s on your mind?';
  sbh.push({role:'assistant',content:opener});addMsg('a',opener);go('sb');
}
async function sendSB(){
  var inp=document.getElementById('sbi');var txt=inp.value.trim();if(!txt)return;
  inp.value='';addMsg('u',txt);sbh.push({role:'user',content:txt});
  var tb=addMsg('a','...');tb.className='mb2 ty';
  var sys='You are Scholar Foundry, an AI coach for No Barriers Education. The student is the '+S.designation+' powered by '+S.fuel+', heading toward '+S.path+'. Help them brainstorm, develop ideas, draft essays, or plan their first move. Be direct, warm, and specific to their designation. Keep responses to 2-4 sentences unless asked for more.';
  try{
    var res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:500,system:sys,messages:sbh})});
    var data=await res.json();
    var reply=data.content.map(function(x){return x.text||'';}).join('');
    tb.className='mb2';tb.textContent=reply;sbh.push({role:'assistant',content:reply});
    document.getElementById('sbms').scrollTop=document.getElementById('sbms').scrollHeight;
  }catch(e){tb.className='mb2';tb.textContent='Something went wrong. Try again.';}
}
