// ============================================================
// FILE: sectors.js
// JOB: The new Pillar III / IV flow, merged in from the Session
// 2 pilot -- multi-select sectors and issues, then the manual
// Problem Statement -> Hypothesis -> Value Prop -> Final
// sequence that replaced the old AI-generated Blueprint.
//
// asm indices: this file's PARTS = [CORE, WIRING, FUEL, OUTPUT],
// so "FUEL" stage = active 2, done [0,1]; "OUTPUT" stage =
// active 3, done [0,1,2].
//
// READS FROM: state.js (S)
//             questions.js (CATS)
//             utils.js (setAsm)
// CALLS INTO: navigation.js (go)
// MUST LOAD: after state.js, questions.js, utils.js, navigation.js
// ============================================================

// --- goToSectors: builds the multi-select sector grid from
// CATS. Each tile toggles in/out of S.sectors on click. ---
function goToSectors(){
  setAsm('asm4',2,[0,1]);
  S.sectors=[];
  var grid=document.getElementById('sect-grid');grid.innerHTML='';
  document.getElementById('sect-btn').classList.remove('on');
  CATS.forEach(function(cat){
    var tile=document.createElement('button');
    tile.className='sect-tile';
    tile.innerHTML='<span class="sect-tile-icon">'+cat.icon+'</span><span class="sect-tile-name">'+cat.name+'</span><span class="sect-tile-sub">'+cat.sub+'</span>';
    tile.onclick=function(){
      var idx=S.sectors.findIndex(function(c){return c.name===cat.name;});
      if(idx>-1){S.sectors.splice(idx,1);tile.classList.remove('sel');}
      else{S.sectors.push(cat);tile.classList.add('sel');}
      document.getElementById('sect-btn').classList.toggle('on',S.sectors.length>0);
    };
    grid.appendChild(tile);
  });
  go('s-sectors');
}
// --- goToIssues: guards against an empty sector selection,
// then combines every issue from every selected sector into
// one multi-select list. ---
function goToIssues(){
  if(!S.sectors.length){
    var btn=document.getElementById('sect-btn');
    btn.style.animation='shake .4s ease';
    setTimeout(function(){btn.style.animation='';},400);
    return;
  }
  setAsm('asm6',2,[0,1]);
  S.issues=[];
  var title=S.sectors.length===1?'Issues inside '+S.sectors[0].name:'Issues across your sectors';
  document.getElementById('iss-title').textContent=title;
  var grid=document.getElementById('iss-grid');grid.innerHTML='';
  document.getElementById('iss-btn').classList.remove('on');
  var all=[];
  S.sectors.forEach(function(c){all=all.concat(c.issues);});
  all.forEach(function(iss){
    var b=document.createElement('button');b.className='sc';
    b.innerHTML='<span class="si3">'+iss.icon+'</span><div><span class="sn">'+iss.name+'</span><span class="sd">'+iss.desc+'</span></div>';
    b.onclick=function(){
      var idx=S.issues.findIndex(function(x){return x.name===iss.name;});
      if(idx>-1){S.issues.splice(idx,1);b.classList.remove('sel');}
      else{S.issues.push(iss);b.classList.add('sel');}
      document.getElementById('iss-btn').classList.toggle('on',S.issues.length>0);
    };
    grid.appendChild(b);
  });
  go('s-issues');
}
// --- goToP4Intro: the bridge into Pillar IV. This is where
// S.fuel and S.fi actually get set from the selected issues --
// everything downstream assumes these are already filled in. ---
function goToP4Intro(){
  if(!S.issues.length)return;
  S.fuel=S.issues.map(function(i){return i.name;}).join(', ');
  S.fi=S.issues[0].icon;
  go('s-p4intro');
}
// --- goToProblemStatement: just a tracker update + screen
// switch, no data work. ---
function goToProblemStatement(){
  setAsm('asm-ps',3,[0,1,2]);
  go('s-problem');
}
// --- goToHypothesis: reads the four Problem Statement fields
// into S (checking each "not sure yet" box first), then moves
// to the Hypothesis screen. ---
function goToHypothesis(){
  S.problemWhat=document.getElementById('ps-what-unk').checked?'Not sure yet':document.getElementById('ps-what').value.trim();
  S.problemCause=document.getElementById('ps-cause-unk').checked?'Not sure yet':document.getElementById('ps-cause').value.trim();
  S.problemWho=document.getElementById('ps-who-unk').checked?'Not sure yet':document.getElementById('ps-who').value.trim();
  S.problemSolutions=document.getElementById('ps-sol-unk').checked?'Not sure yet':document.getElementById('ps-solutions').value.trim();
  setAsm('asm-hyp',3,[0,1,2]);
  go('s-hypothesis');
}
// --- goToVP: reads and validates the hypothesis, builds the
// Value Prop preview, and wires a LIVE oninput handler so the
// sentence updates in real time as the student types. ---
function goToVP(){
  S.hypothesis=document.getElementById('hyp-input').value.trim();
  if(!S.hypothesis){document.getElementById('hyp-input').focus();return;}
  setAsm('asm-vp',3,[0,1,2]);
  var issStr=S.issues.map(function(i){return i.name;}).join(', ');
  var sectorStr=S.sectors.map(function(s){return s.name;}).join(' & ');
  var hypPreview=S.hypothesis.length>60?S.hypothesis.substring(0,60)+'...':S.hypothesis;
  document.getElementById('vp-desig').textContent=S.designation||'—';
  document.getElementById('vp-sector').textContent=issStr||sectorStr||'—';
  document.getElementById('vp-hyp-preview').textContent=hypPreview||'—';
  var ai=document.getElementById('action-input');
  ai.value=S.action||'';
  ai.oninput=function(){
    document.getElementById('vp-action').textContent=ai.value||"[what you'll do next]";
    S.action=ai.value;
  };
  go('s-vp');
}
// --- goToFinal: reads the final action text and populates all
// four summary cards on the Final screen. ---
function goToFinal(){
  S.action=document.getElementById('action-input').value.trim();
  var issStr=S.issues.map(function(i){return i.name;}).join(', ');
  var sectorStr=S.sectors.map(function(s){return s.name;}).join(' & ');
  document.getElementById('final-desig').textContent=S.designation||'—';
  document.getElementById('final-fuel').textContent=(issStr||sectorStr)||'—';
  document.getElementById('final-hyp').textContent=S.hypothesis||'—';
  document.getElementById('final-action').textContent=S.action||'(not yet set)';
  go('s-final');
}
