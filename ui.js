// ============================================================
// FILE: ui.js
// JOB: The display layer -- everything that builds or updates
// what the student actually sees. Renders questions, fires the
// Pillar I/II reveal screens, shows the Designation combo, and
// builds the progressive value-prop sentences.
//
// READS FROM: state.js (S, p1q/p2q, p1sel/p2sel)
//             questions.js (Q1, Q2, M, W, C, PATHS)
// CALLS INTO: navigation.js (go)
//             utils.js (setAsm, startInstall, animReveal)
// MUST LOAD: after state.js, questions.js, utils.js, navigation.js
// ============================================================

// --- mkGrid: builds a button grid for any question's choices.
// Returns a div full of wired-up buttons; doesn't touch the
// page directly itself -- the caller appends it. ---
function mkGrid(qs,nbtn,onsel){var g=document.createElement('div');g.className='qg';qs.forEach(function(q){var b=document.createElement('button');b.className='qc';b.textContent=q.l;b.onclick=function(){g.querySelectorAll('.qc').forEach(function(x){x.classList.remove('sel');x.style.color='#4A9FD4';});b.classList.add('sel');b.style.color='#fff';onsel(q);document.getElementById(nbtn).classList.add('on');};g.appendChild(b);});return g;}

// --- rp1/rp2: render the current Pillar I/II question. Reads
// the current question by index from Q1/Q2, updates progress
// dots, builds the answer grid via mkGrid. ---
function rp1(){var q=Q1[p1q];document.getElementById('p1q').textContent=q.t;document.querySelectorAll('#p1p .qd').forEach(function(d,i){d.classList.toggle('on',i<=p1q);});var c=document.getElementById('p1c');c.innerHTML='';p1sel=null;document.getElementById('p1n').classList.remove('on');c.appendChild(mkGrid(q.c,'p1n',function(q){p1sel=q;}));}
function rp2(){setAsm('asm2',1,[0]);var q=Q2[p2q];document.getElementById('p2q').textContent=q.t;document.querySelectorAll('#p2p .qd').forEach(function(d,i){d.classList.toggle('on',i<=p2q);});var c=document.getElementById('p2c');c.innerHTML='';p2sel=null;document.getElementById('p2n').classList.remove('on');c.appendChild(mkGrid(q.c,'p2n',function(q){p2sel=q;}));}

// --- fireReveal1/fireReveal2: take the final confidence result,
// populate the reveal screen, trigger the reveal animation. ---
function fireReveal1(res){
  var m=M[res.primary];S.type=m.shortType||m.type;S.ti=m.icon;S.p1sec=res.secondary;S.p1conf=res.confidence;
  go('p1b');startInstall('ib1','im1',['Analyzing input...','Identifying core type...','Component found...','Locking in...']);
  setTimeout(function(){
    document.getElementById('r1i').textContent=m.icon;
    document.getElementById('r1n').textContent=m.type;
    document.getElementById('r1d').textContent=m.desc;
    document.getElementById('r1s').textContent=m.soc;
    document.getElementById('re1').textContent='Core Component · '+(m.shortType||m.type)+' Identified';
    document.getElementById('b1t').textContent=m.icon+' '+(m.shortType||m.type);
    var cb=document.getElementById('cb1');
    cb.textContent='◉ '+res.confidence.charAt(0).toUpperCase()+res.confidence.slice(1)+' Confidence';
    cb.className='conf-badge conf-'+res.confidence;
    if(res.confidence!=='high'){var sec=M[res.secondary];document.getElementById('rl1').textContent='Your primary machine is a (strong '+sec.type+' influence)';}
    else{document.getElementById('rl1').textContent='Your machine is a';}
    go('p1r');
    ['pb1','lb1','cb1','r1i','re1','r1n','r1d','r1s','r1ca','rb1'].forEach(function(id){animReveal([id]);});
  },2300);
}
function fireReveal2(res){
  var ww=W[res.primary];S.wire=ww.type;S.wi=ww.icon;S.p2sec=res.secondary;S.p2conf=res.confidence;
  go('p2b');startInstall('ib2','im2',['Mapping cognitive pathways...','Analyzing operating style...','Wiring pattern found...','Locking in...']);
  setTimeout(function(){
    document.getElementById('r2i').textContent=ww.icon;
    document.getElementById('r2n').textContent=ww.type;
    document.getElementById('r2d').textContent=ww.desc;
    document.getElementById('r2s').textContent=ww.soc;
    document.getElementById('re2').textContent='Wiring · '+ww.type+' Mapped';
    document.getElementById('b2t').textContent=S.ti+' '+S.type;
    document.getElementById('b2w').textContent=ww.icon+' '+ww.type;
    var cb=document.getElementById('cb2');
    cb.textContent='◉ '+res.confidence.charAt(0).toUpperCase()+res.confidence.slice(1)+' Confidence';
    cb.className='conf-badge conf-'+res.confidence;
    if(res.confidence!=='high'){var sec=W[res.secondary];document.getElementById('rl2').textContent='Your primary wiring is (strong '+sec.type+' influence)';}
    else{document.getElementById('rl2').textContent='Your wiring is';}
    go('p2r');
    ['pb2','lb2','cb2','r2i','re2','r2n','r2d','r2s','r2ca','rb2'].forEach(function(id){animReveal([id]);});
  },2300);
}

// --- showCombo: computes the Designation from S.type+S.wire,
// populates the combination screen. ---
function showCombo(){
  setAsm('asm3',2,[0,1]);
  var key=S.type+'+'+S.wire;
  var co=C[key]||{designation:'The '+S.wire+' '+S.type,sub:S.type+' + '+S.wire,desc:'A unique combination.',blind:'Stay aware of where your strengths can become limitations.'};
  S.designation=co.designation;
  document.getElementById('combo-sub').textContent=co.sub;
  document.getElementById('con').textContent=co.designation;
  document.getElementById('cod').textContent=co.desc;
  document.getElementById('coblind').textContent=co.blind;
  go('combo');
}

// ============================================================
// PARKED FOR PHASE 1 -- pathway selection UI. Not called from
// the live flow above.
// ============================================================
function initP4(){setAsm('asm7',3,[0,1,2]);var g=document.getElementById('p4pw');g.innerHTML='';pathSel=null;document.getElementById('p4n').classList.remove('on');PATHS.forEach(function(pw){var b=document.createElement('button');b.className='pw';b.innerHTML='<span class="pwi">'+pw.icon+'</span><span class="pwn">'+pw.title+'</span><span class="pws">'+pw.sub+'</span>';b.onclick=function(){g.querySelectorAll('.pw').forEach(function(x){x.classList.remove('sel');});b.classList.add('sel');pathSel=pw;S.path=pw.title;S.pi2=pw.icon;document.getElementById('p4n').classList.add('on');};g.appendChild(b);});go('p4');}

// --- setBP: parked for Phase 1. Takes the parsed Blueprint
// object from genBP() (api.js) and populates the Blueprint
// screen. ---
function setBP(p){
  document.getElementById('bpt').textContent=S.designation;
  document.getElementById('bps3').textContent='Powered by '+S.fuel+' · '+S.pi2+' '+S.path;
  document.getElementById('bc1').textContent=S.ti;document.getElementById('bc2').textContent=S.wi;document.getElementById('bc3').textContent=S.fi;
  document.getElementById('bpm').innerHTML='<span class="btg">'+S.ti+' '+S.type+'</span><span class="bbtg">'+S.wi+' '+S.wire+'</span><span class="btg">'+S.fi+' '+S.fuel+'</span><span class="bmtg">'+S.pi2+' '+S.path+'</span>';
  document.getElementById('bpvo').textContent=p.voice;document.getElementById('bppr').textContent=p.project;document.getElementById('bppa').textContent=p.path;document.getElementById('bped').textContent=p.edge;
  go('bp');
}

// --- buildVP1/buildVP2: build the progressively-revealed value
// prop sentence shown after the Pillar I/II results. ---
function buildVP1(){
  document.getElementById('vp1-type').textContent=S.type||'Builder';
}
function buildVP2(){
  var t=S.type||'Builder';var w=S.wire||'Experimenter';var d=S.designation||'Operator';
  document.getElementById('vp2-type').textContent=t;
  document.getElementById('vp2-wire').textContent=w;
  document.getElementById('vp2-desig').textContent=d;
  // pre-populate vp3 stable fields too
  ['vp3-type','vp3-wire','vp3-desig'].forEach(function(id,i){
    var el=document.getElementById(id);if(el)el.textContent=[t,w,d][i];
  });
}

// ============================================================
// FINAL WIRING -- connects a few buttons directly to their
// handlers. These aren't function definitions like everything
// else above; they're one-time "hook this button up" statements
// that need to run once the buttons they reference already
// exist in the DOM (hence landing at the bottom of the file).
// ============================================================
document.getElementById('r1btn').onclick=function(){buildVP1();go('vp1');};
document.getElementById('tr2btn').onclick=function(){rp2();go('p2');};
document.getElementById('combo-next').onclick=function(){buildVP2();go('vp2');};
