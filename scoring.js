// ============================================================
// FILE: scoring.js
// JOB: The scoring engine. Everything that calculates, records,
// resets, and advances a student through Pillar I and Pillar II
// questions. See scoring_js_rosetta_stone.md for the full
// breakdown, including the startP1/no-startP2 asymmetry.
//
// READS FROM: state.js (p1s/p2s, p1q/p2q, p1sel/p2sel,
//             p1history/p2history, tie1/tie2 vars)
//             questions.js (Q1, Q2)
// CALLS INTO: utils.js (setAsm)
//             navigation.js (go)
//             ui.js (rp1, rp2, fireReveal1, fireReveal2 --
//             not built yet)
//             tiebreaker.js (showTie1, showTie2)
// MUST LOAD: after state.js, questions.js, utils.js,
//            navigation.js, tiebreaker.js
// ============================================================

// --- resetP1/resetP2: the sledgehammer. Wipes a Pillar's
// state completely back to zero -- used by "Retake this
// section" links. ---
function resetP1(){p1s={builder:0,provider:0,communicator:0};p1q=0;p1sel=null;p1history=[];tie1A=null;tie1B=null;tie1Sel=null;}
function resetP2(){p2s={experimenter:0,collaborator:0,narrator:0};p2q=0;p2sel=null;p2history=[];tie2A=null;tie2B=null;tie2Sel=null;}

// --- backP1/backP2: the surgeon. If there's no history yet,
// sends the student out to the transition screen. Otherwise
// pops the last answer, subtracts its points, and redraws the
// current question one step earlier -- same screen, no switch. ---
function backP1(){
  if(p1history.length===0){go('tr1');return;}
  var last=p1history.pop();
  Object.keys(last).forEach(function(k){p1s[k]-=last[k];});
  p1q--;p1sel=null;
  setAsm('asm1',0,[]);rp1();go('p1');
}
function backP2(){
  if(p2history.length===0){go('tr2');return;}
  var last=p2history.pop();
  Object.keys(last).forEach(function(k){p2s[k]-=last[k];});
  p2q--;p2sel=null;
  setAsm('asm2',1,[0]);rp2();go('p2');
}

// --- calcConf: the confidence calculator every other scoring
// function leans on. Sorts scores highest to lowest, measures
// the gap between 1st and 2nd, turns that gap into a plain
// confidence label. ---
function calcConf(scores){var sorted=Object.keys(scores).sort(function(a,b){return scores[b]-scores[a];});var gap=scores[sorted[0]]-scores[sorted[1]];return{primary:sorted[0],secondary:sorted[1],gap:gap,confidence:gap>=3?'high':gap>=1?'medium':'low'};}

// --- startP1: Pillar I's entry point. No matching startP2 --
// Pillar II starts from a raw click-handler assignment near
// the bottom of index.html instead (rp2() itself calls setAsm,
// so the tracker still gets set, just from a different spot). ---
function startP1(){setAsm('asm1',0,[]);rp1();go('p1');}

// --- p1x/p2x: the actual engine, fires every time "Next" is
// clicked. Records the answer to history, adds its points to
// the scoreboard, advances the question counter, then either
// renders the next question, routes to a tiebreaker on a dead
// tie, or fires the final reveal. ---
function p1x(){if(!p1sel)return;p1history.push(Object.assign({},p1sel.p));Object.keys(p1sel.p).forEach(function(k){p1s[k]=(p1s[k]||0)+p1sel.p[k];});p1q++;if(p1q<Q1.length){rp1();}else{var res=calcConf(p1s);if(res.gap===0){showTie1(res.primary,res.secondary);}else{fireReveal1(res);}}}
function p2x(){if(!p2sel)return;p2history.push(Object.assign({},p2sel.p));Object.keys(p2sel.p).forEach(function(k){p2s[k]=(p2s[k]||0)+p2sel.p[k];});p2q++;if(p2q<Q2.length){rp2();}else{var res=calcConf(p2s);if(res.gap===0){showTie2(res.primary,res.secondary);}else{fireReveal2(res);}}}
