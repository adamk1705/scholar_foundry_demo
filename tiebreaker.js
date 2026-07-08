// ============================================================
// FILE: tiebreaker.js
// JOB: The tie-breaking referee. Only ever runs when Pillar I
// or Pillar II ends in an exact score tie -- most students
// never see this. See tiebreaker_js_rosetta_stone.md for the
// full breakdown of the TB1[key]||TB1[b+'-'+a] fallback trick.
//
// READS FROM: state.js (tie1A/B/Sel, tie2A/B/Sel, p1s, p2s)
//             questions.js (TB1, TB2)
//             utils.js (setAsm)
// CALLS INTO: navigation.js (go)
//             scoring.js (calcConf -- not built yet)
//             ui.js (fireReveal1, fireReveal2 -- not built yet)
// MUST LOAD: after state.js, questions.js, utils.js, navigation.js
// ============================================================

// --- Pillar I tiebreaker: showTie1 builds the question and
// options screen; resolveTie1 adds the winning point and hands
// off to fireReveal1 to display the final result. ---
function showTie1(a,b){tie1A=a;tie1B=b;tie1Sel=null;setAsm('asm1t',0,[]);var key=a+'-'+b;var tb=TB1[key]||TB1[b+'-'+a];document.getElementById('tie1-head').textContent=tb.q;var opts=document.getElementById('tie1-opts');opts.innerHTML='';document.getElementById('tie1-btn').classList.remove('on');tb.a.forEach(function(a){var btn=document.createElement('button');btn.className='tie-opt';btn.innerHTML='<span class="tie-opt-label">'+a.l+'</span><span class="tie-opt-sub">'+a.sub+'</span>';btn.onclick=function(){opts.querySelectorAll('.tie-opt').forEach(function(x){x.classList.remove('sel');});btn.classList.add('sel');tie1Sel=a.win;document.getElementById('tie1-btn').classList.add('on');};opts.appendChild(btn);});go('p1tie');}
function resolveTie1(){if(!tie1Sel)return;p1s[tie1Sel]+=1;var res=calcConf(p1s);if(res.gap===0)res.confidence='low';fireReveal1(res);}

// --- Pillar II tiebreaker: same shape as above, mirrored. ---
function showTie2(a,b){tie2A=a;tie2B=b;tie2Sel=null;setAsm('asm2t',1,[0]);var key=a+'-'+b;var tb=TB2[key]||TB2[b+'-'+a];document.getElementById('tie2-head').textContent=tb.q;var opts=document.getElementById('tie2-opts');opts.innerHTML='';document.getElementById('tie2-btn').classList.remove('on');tb.a.forEach(function(a){var btn=document.createElement('button');btn.className='tie-opt';btn.innerHTML='<span class="tie-opt-label">'+a.l+'</span><span class="tie-opt-sub">'+a.sub+'</span>';btn.onclick=function(){opts.querySelectorAll('.tie-opt').forEach(function(x){x.classList.remove('sel');});btn.classList.add('sel');tie2Sel=a.win;document.getElementById('tie2-btn').classList.add('on');};opts.appendChild(btn);});go('p2tie');}
function resolveTie2(){if(!tie2Sel)return;p2s[tie2Sel]+=1;var res=calcConf(p2s);if(res.gap===0)res.confidence='low';fireReveal2(res);}
