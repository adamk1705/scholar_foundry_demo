// ============================================================
// FILE: navigation.js
// JOB: The traffic controller. Decides which single screen is
// visible at any moment, and what "back" means from wherever
// the student currently is. See navigation_js_rosetta_stone.md
// for the full breakdown of what each piece actually does.
//
// READS FROM: state.js (currentScreen, NO_BACK, BACK_MAP)
// CALLS INTO: whatever function BACK_MAP[currentScreen] points
//             to -- could be go() again, or a Pillar-specific
//             undo function like backP1() (scoring.js, not
//             built yet)
// MUST LOAD: after state.js, questions.js, utils.js
// ============================================================

// --- goBack: doesn't decide anything itself. Looks up the
// current screen's rule in BACK_MAP (state.js) and runs
// whatever it finds -- could be a real screen switch, or a
// surgical undo that stays on the same screen. ---
function goBack(){if(BACK_MAP[currentScreen])BACK_MAP[currentScreen]();}

// --- go: the one heavy DOM function in this file. Hides every
// screen in the entire app, shows exactly one, updates
// currentScreen, and toggles the global back button. ---
function go(id){
  document.querySelectorAll('.s,.bs,.rs,.cs,.bps,.ss,.os,.ts,.tr,.vps').forEach(function(e){e.classList.remove('on');});
  document.getElementById(id).classList.add('on');
  currentScreen=id;
  var btn=document.getElementById('gback');
  if(btn)btn.classList.toggle('on',NO_BACK.indexOf(id)===-1);
}

// --- Empty stubs. Named placeholders for a planned "new vs.
// returning student" welcome flow that was never built. Calling
// any of these currently does nothing. ---
function showWNew(){}
function showWReturn(){}
function submitNew(){}
function submitReturn(){}
