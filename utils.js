// ============================================================
// FILE: utils.js
// JOB: Small, generic helper functions that don't belong to
// any one Pillar or screen -- same mechanics every time,
// different context each call. See utils_js_rosetta_stone.md
// for the full explanation of what makes something belong here.
//
// READS FROM: questions.js (PARTS, in getAsm)
//             state.js (p1s/p2s/tie vars/S, in restart)
// CALLS INTO: navigation.js (go, in restart -- not built yet)
// MUST LOAD: after state.js and questions.js
// ============================================================

// --- getAsm/setAsm: the assembly tracker pair. getAsm drafts
// the HTML string from scratch (never touches the page).
// setAsm calls getAsm, then pastes the result into one real
// element by ID (this is the only one of the pair that
// actually touches the DOM). ---
function getAsm(active,done){var h='<div class="asm">';PARTS.forEach(function(p,i){var cl=done.indexOf(i)>-1?'done':active===i?'active':'pending';var st=cl==='done'?'INSTALLED':cl==='active'?'ACTIVE':'PENDING';var icon=cl==='done'?'✓':p.icon;h+='<div class="ast '+cl+'"><div class="abox">'+icon+'</div><div class="albl">'+p.lbl+'</div><div class="astat">'+st+'</div></div>';if(i<3){var bon=cl==='done'||cl==='active';h+='<div class="ablt'+(bon?' on':'')+'"><div class="adot"></div><div class="adot"></div><div class="adot"></div></div>';}});return h+'</div>';}
function setAsm(id,active,done){var el=document.getElementById(id);if(el)el.innerHTML=getAsm(active,done);}

// --- animReveal: restarts a CSS fade-in animation on a list
// of elements by removing and re-adding the .go class. ---
function animReveal(ids){ids.forEach(function(id){var el=document.getElementById(id);if(!el)return;el.classList.remove('go');void el.offsetWidth;el.classList.add('go');});}

// --- startInstall: drives the "Installing: X" loading screens
// -- fills a progress bar over ~2 seconds, cycles through a
// list of status messages every 700ms. ---
function startInstall(barId,msgId,msgs){var el=document.getElementById(barId);if(el){el.style.width='0';void el.offsetWidth;el.style.transition='width 2.15s ease';el.style.width='100%';}var i=0;setInterval(function(){i=(i+1)%msgs.length;var m=document.getElementById(msgId);if(m)m.textContent=msgs[i];},700);}

// --- addMsg: parked for Phase 1. Builds one chat bubble
// (student or AI), appends it to the chat window, scrolls
// to the bottom. ---
function addMsg(role,text){var msgs=document.getElementById('sbms');var d=document.createElement('div');d.className='msg '+role;var b=document.createElement('div');b.className='mb2';b.textContent=text;d.appendChild(b);msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return b;}

// --- restart: the reset button for the entire app. Touches
// zero HTML directly -- just wipes shared state back to
// empty, then hands off to go('p0') to actually change screens. ---
function restart(){
  p1s={builder:0,provider:0,communicator:0};p1q=0;p1sel=null;p1history=[];
  p2s={experimenter:0,collaborator:0,narrator:0};p2q=0;p2sel=null;p2history=[];
  tie1A=null;tie1B=null;tie1Sel=null;tie2A=null;tie2B=null;tie2Sel=null;
  pathSel=null;sbh=[];
  S={type:'',ti:'',wire:'',wi:'',fuel:'',fi:'',path:'',pi2:'',p1conf:'',p1sec:'',p2conf:'',p2sec:'',designation:'',sectors:[],issues:[],hypothesis:'',action:'',problemWhat:'',problemCause:'',problemWho:'',problemSolutions:''};
  go('p0');
}
