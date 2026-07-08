// ============================================================
// FILE: state.js
// JOB: The Lobby -- every piece of shared data that has to
// survive across screens for the length of a session. Nothing
// in here does anything by itself; it's just the whiteboard
// every other file reads from and writes to.
//
// READS FROM: nothing (pure state, no dependencies)
// CALLS INTO: nothing
// MUST LOAD: first, before every other script tag
// ============================================================

// --- S: the master student profile. Starts empty, fills in
// as the student moves through each Pillar. ---
var S={type:'',ti:'',wire:'',wi:'',fuel:'',fi:'',path:'',pi2:'',p1conf:'',p1sec:'',p2conf:'',p2sec:'',designation:'',sectors:[],issues:[],hypothesis:'',action:'',problemWhat:'',problemCause:'',problemWho:'',problemSolutions:''};

// --- Pillar I live scoreboard, question counter, current
// selection, and answer history (for undo/back). ---
var p1s={builder:0,provider:0,communicator:0},p1q=0,p1sel=null;

// --- Pillar II: same idea as above, different machine axis. ---
var p2s={experimenter:0,collaborator:0,narrator:0},p2q=0,p2sel=null;

// --- Tiebreaker memory: which two options tied, and which
// one the student picked to break the tie. Pillar I (tie1)
// and Pillar II (tie2) each get their own set. ---
var tie1A=null,tie1B=null,tie1Sel=null,tie2A=null,tie2B=null,tie2Sel=null;

// --- pathSel/sbh: parked for Phase 1 (old pathway selection +
// chatbot history, not used in the live flow right now).
// p1history/p2history: the undo trail for Pillar I/II answers. ---
var pathSel=null,sbh=[],p1history=[],p2history=[];

// --- Back-button rulebook: which screens hide the back button,
// and where "back" goes from every other screen. ---
var NO_BACK=['p0','p1b','p2b','p4b'];
var BACK_MAP={
  'p0':function(){},
  'tr1':function(){go('p0');},
  'p1':function(){backP1();},
  'p1tie':function(){backP1();},
  'p1r':function(){resetP1();go('tr1');},
  'vp1':function(){go('p1r');},
  'tr2':function(){go('vp1');},
  'p2':function(){backP2();},
  'p2tie':function(){backP2();},
  'p2r':function(){resetP2();go('tr2');},
  'combo':function(){go('p2r');},
  'vp2':function(){go('combo');},
  's-p3intro':function(){go('vp2');},
  's-sectors':function(){go('s-p3intro');},
  's-issues':function(){go('s-sectors');},
  's-p4intro':function(){go('s-issues');},
  's-problem':function(){go('s-p4intro');},
  's-hypothesis':function(){go('s-problem');},
  's-vp':function(){go('s-hypothesis');},
  's-final':function(){go('s-vp');},
  // PARKED FOR PHASE 1 -- reconnect when pathway-select + AI blueprint go live:
  'p4':function(){go('s-final');},
  'bp':function(){go('p4');},
  'sb':function(){go('bp');}
};

// --- Which screen is currently on display. ---
var currentScreen='p0';
