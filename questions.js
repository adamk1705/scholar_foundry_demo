// ============================================================
// FILE: questions.js
// JOB: The full data layer. Every question, description, and
// selectable option in the app lives here as plain data --
// nothing in this file DOES anything, it's all read by
// functions defined elsewhere.
//
// Two different shapes live in here:
//   - Arrays [ ]  = ordered lists (Q1, Q2, CATS, PATHS, PARTS)
//   - Objects { } = labeled lookups (M, W, C, TB1, TB2)
//
// READS FROM: nothing (pure data, no dependencies)
// CALLS INTO: nothing
// MUST LOAD: after state.js, before every file that reads
//            this data (scoring.js, ui.js, sectors.js, etc.)
// ============================================================

// --- M: Machine Type descriptions (Pillar I). Looked up by
// key after scoring, e.g. M['builder']. ---
var M={
  // CHANGE 2: Builder archetype clarification added to type label
  builder:{icon:'🏗️',type:'Builder',shortType:'Builder',desc:"Builders make things that didn't exist before: systems, processes, products, solutions. When you see a gap, your instinct isn't to wait for someone else to close it.",soc:'Founders, engineers, operators, and systems thinkers are all Builders. The world runs on what your type produces.'},
  provider:{icon:'🤝',type:'Provider',shortType:'Provider',desc:'You enjoy helping others and getting them to be their best selves.',soc:'Society needs people like you to make others feel supported, dignified, and whole.'},
  communicator:{icon:'🎙️',type:'Communicator',shortType:'Communicator',desc:'You have a natural ability to connect with people and make ideas land.',soc:'Society needs people like you to bridge divides and move the world through the power of words.'}
};
// --- W: Wiring descriptions (Pillar II). Looked up by key,
// e.g. W['experimenter']. ---
var W={
  experimenter:{icon:'🧪',type:'Experimenter',desc:'You learn by jumping in and figuring it out as you go.',soc:"Society needs people like you who aren't afraid to try, fail, and try again until something works."},
  collaborator:{icon:'🤝',type:'Collaborator',desc:"You think best when you're thinking with other people.",soc:'Society needs people like you to bring minds together and turn individual ideas into collective breakthroughs.'},
  narrator:{icon:'📖',type:'Narrator',desc:'You make sense of the world by turning it into a story.',soc:'Society needs people like you to give meaning to complexity and move people through the power of how you frame things.'}
};
// --- C: the nine Designations. Looked up by a combined key,
// e.g. C['Builder+Experimenter']. This is the final combo
// name shown on the reveal screen. ---
var C={
  'Builder+Experimenter':{designation:'Operator',sub:'Builder + Experimenter',desc:"You don't wait for permission or a perfect plan. You build something, break it, and build it better. The world doesn't intimidate you. It's just something to improve.",blind:"You can move so fast that you skip structure, which leads to rework or missed patterns."},
  'Builder+Collaborator':{designation:'Architect',sub:'Builder + Collaborator',desc:"You build things that last because you build them with people. Your best work has other people's fingerprints all over it. That's the point.",blind:"You can get so focused on the group that you lose your own voice in the process."},
  'Builder+Narrator':{designation:'Designer',sub:'Builder + Narrator',desc:"You don't just make things work. You make them make sense. Every project you touch has intention behind it, even if other people can't fully explain why it works.",blind:"You can spend so long on the meaning that you delay the making."},
  'Provider+Experimenter':{designation:'Responder',sub:'Provider + Experimenter',desc:"You help by doing. You don't wait to have all the answers. You show up, try something, and adjust until it lands. People trust you because you don't just care. You act.",blind:"You can move to solutions so fast that people feel unheard before they actually feel helped."},
  'Provider+Collaborator':{designation:'Anchor',sub:'Provider + Collaborator',desc:"People don't just come to you for help. They come to you because you make them feel like everything is going to be okay. You're the reason things don't fall apart.",blind:"You can absorb so much for other people that there's nothing left for yourself."},
  'Provider+Narrator':{designation:'Guide',sub:'Provider + Narrator',desc:"You help people understand themselves. You take what someone is going through and give it shape: a frame, a story, a way forward. People leave conversations with you seeing things more clearly than they did before.",blind:"You can be so good at framing other people's problems that you avoid sitting with your own problems."},
  'Communicator+Experimenter':{designation:'Persuader',sub:'Communicator + Experimenter',desc:"You test everything. You try a message, read the room, and try again until something lands. Your instincts aren't magic. They're built. You just never stopped running experiments.",blind:"You can be so focused on what lands that you lose sight of what's actually true."},
  'Communicator+Collaborator':{designation:'Connector',sub:'Communicator + Collaborator',desc:"You don't broadcast. You build conversations. You know that the best ideas come from the right people talking to each other, and you're the one who makes that happen.",blind:"You can be so focused on bringing people together that you never take a position of your own."},
  'Communicator+Narrator':{designation:'Storyteller',sub:'Communicator + Narrator',desc:"You move people. Not with data, not with arguments. With story. You make people feel something before they think something. That changes what they do next.",blind:"You can be so drawn to the narrative that you smooth over the parts that don't fit the story."}
};
// --- TB1: Pillar I tiebreaker questions, keyed by which two
// Machine Types tied (e.g. 'builder-communicator'). Each
// choice declares a flat 'win' instead of accumulating points. ---
var TB1={
  'builder-communicator':{q:"Which feels more like you?",a:[{l:"Make something useful and real",sub:"Build it, fix it, ship it.",win:'builder'},{l:"Make an idea land with people",sub:"Say it in a way that moves them.",win:'communicator'}]},
  'builder-provider':{q:"Which feels more natural to you?",a:[{l:"Fix the problem itself",sub:"Get in and solve it directly.",win:'builder'},{l:"Make sure the person is okay",sub:"Check in, support, be there.",win:'provider'}]},
  'provider-communicator':{q:"What matters more in the moment?",a:[{l:"Helping someone feel supported",sub:"Being present, steady, there.",win:'provider'},{l:"Helping someone understand clearly",sub:"Giving them the words or the framework.",win:'communicator'}]}
};
// --- TB2: same idea as TB1, for Pillar II Wiring ties. ---
var TB2={
  'experimenter-collaborator':{q:"How do you prefer to figure things out?",a:[{l:"Work through it on your own",sub:"Try things until something clicks.",win:'experimenter'},{l:"Work through it with someone else",sub:"Talk it out until it lands.",win:'collaborator'}]},
  'experimenter-narrator':{q:"What helps you make sense of something new?",a:[{l:"Trying it until something clicks",sub:"Action first, understanding follows.",win:'experimenter'},{l:"Finding the story behind it",sub:"Frame it, then you own it.",win:'narrator'}]},
  'collaborator-narrator':{q:"Where do your best ideas come from?",a:[{l:"A good conversation with the right person",sub:"Two minds are better than one.",win:'collaborator'},{l:"Sitting with it until it makes sense",sub:"The meaning comes from within.",win:'narrator'}]}
};
// --- Q1: the 9 Pillar I questions. Each question has text
// (t) and choices (c); each choice has a label (l) and points
// (p) awarded toward one or more Machine Types. ---
var Q1=[
  {t:"You join a group project halfway through and things feel disorganized. What grabs your attention first?",c:[
    {l:"The workflow itself feels inefficient or unclear.",p:{builder:3}},
    {l:"Some people seem disconnected or left out of the process.",p:{provider:3}},
    {l:"People seem confused about what everyone is trying to say.",p:{communicator:3}},
    {l:"Nobody has connected the bigger picture together yet.",p:{communicator:2,narrator:1}}
  ]},
  {t:"When people around you are unsure what to do, what role do you naturally drift toward?",c:[
    {l:"Organizing what needs to happen next.",p:{builder:3}},
    {l:"Making sure everyone feels included and supported.",p:{provider:3}},
    {l:"Helping people align around the same understanding.",p:{communicator:3}},
    {l:"Helping different people work together more smoothly.",p:{provider:2,collaborator:1}}
  ]},
  {t:"When working on something independently, what tends to throw you off most?",c:[
    {l:"The process feels inefficient or poorly structured.",p:{builder:3}},
    {l:"You can't tell if what you're producing could actually be useful to anyone else.",p:{provider:3}},
    {l:"The ideas feel unclear or difficult to express.",p:{communicator:3}},
    {l:"The work feels repetitive without a larger purpose or direction.",p:{communicator:2,narrator:1}}
  ]},
  {t:"When starting something new or open-ended, what do you naturally focus on first?",c:[
    {l:"Creating structure or figuring out how to approach it.",p:{builder:3}},
    {l:"Thinking about who it could help or impact.",p:{provider:3}},
    {l:"Exploring ideas and trying to understand the concept clearly.",p:{communicator:3}},
    {l:"Figuring out how different ideas or pieces connect together.",p:{communicator:2,narrator:1}}
  ]},
  {t:"When something feels uncertain or stuck, what do you instinctively start doing?",c:[
    {l:"Breaking the problem into clearer steps.",p:{builder:3}},
    {l:"Checking in with people to see where everyone's at.",p:{provider:3}},
    {l:"Talking through ideas until things start making more sense.",p:{communicator:3}},
    {l:"Testing something quickly to see what actually works.",p:{builder:2,experimenter:1}}
  ]}
];
// --- Q2: same shape as Q1, scoring toward Wiring instead
// of Machine Type. ---
var Q2=[
  {t:"When something finally \"clicks\" for you, what usually causes it?",c:[
    {l:"I've tested it enough to trust it.",p:{experimenter:3}},
    {l:"I can finally see how all the pieces connect together.",p:{narrator:3}},
    {l:"Talking it through helps me understand it better.",p:{collaborator:3}},
    {l:"I can explain it clearly in my own words.",p:{narrator:2,collaborator:1}}
  ]},
  {t:"When your mind keeps returning to a problem, what is it usually trying to resolve?",c:[
    {l:"Whether the idea actually works in reality.",p:{experimenter:3}},
    {l:"Whether everything fits together coherently.",p:{narrator:3}},
    {l:"Whether it makes sense to other people too.",p:{collaborator:3}},
    {l:"Whether I've fully understood WHY it works, not just that it does.",p:{narrator:2,experimenter:1}}
  ]},
  {t:"What kind of realization tends to feel most satisfying to you?",c:[
    {l:"Discovering something works through direct testing.",p:{experimenter:3}},
    {l:"Seeing how multiple ideas connect into one larger pattern.",p:{narrator:3}},
    {l:"Reaching understanding together with someone else.",p:{collaborator:3}},
    {l:"Realizing a pattern you've seen before applies somewhere completely new.",p:{narrator:3}}
  ]},
  {t:"What usually helps your thinking reset when something isn't clicking?",c:[
    {l:"Trying something different immediately.",p:{experimenter:3}},
    {l:"Stepping back until the larger picture becomes clearer.",p:{narrator:3}},
    {l:"Talking with someone I trust about it.",p:{collaborator:3}},
    {l:"Coming back later after my brain has had time to sit with it.",p:{narrator:2}}
  ]}
];
// --- CATS: the 7 sector categories for Pillar III, each
// holding a nested list of specific issues a student can
// multi-select. ---
var CATS=[
{icon:'👥',name:'People & Society',sub:'How do we improve the way people live together?',issues:[
  {icon:'📚',name:'Education Inequality',desc:"The gap between who gets access to great schools and who gets left behind."},
  {icon:'🧠',name:'Mental Health',desc:"The space between who needs support and who actually gets it."},
  {icon:'🏠',name:'Housing & Homelessness',desc:"Why some neighborhoods get everything and others get nothing."},
  {icon:'✊',name:'Social Justice',desc:"The systems that decide who gets treated fairly and who doesn't."},
  {icon:'🤝',name:'Loneliness & Connection',desc:"Why more people feel more alone than ever, and what that costs us."},
  {icon:'🩺',name:'Healthcare Access',desc:"Why getting healthy shouldn't depend on how much money you have."}
]},
{icon:'🔬',name:'Science & Innovation',sub:'How do we discover, invent, and build the future?',issues:[
  {icon:'🤖',name:'AI & Humanity',desc:"How artificial intelligence is changing work, creativity, relationships, and everyday life."},
  {icon:'⚙️',name:'AI & Automation',desc:"What happens to people when machines start doing the jobs humans used to do."},
  {icon:'🧬',name:'Biotechnology',desc:"The collision of biology and technology, and what it means for what it means to be human."},
  {icon:'🚀',name:'Space Exploration',desc:"Why reaching beyond Earth still matters for everything that happens on it."},
  {icon:'🦾',name:'Robotics & Automation',desc:"Building machines that extend what humans can do, and raising questions about what we should."},
  {icon:'⚡',name:'Clean Energy',desc:"What happens when we stop burning the world to keep the lights on."},
  {icon:'🔭',name:'Scientific Research',desc:"How discoveries become solutions, and how slowly that usually happens."}
]},
{icon:'🏥',name:'Public Health',sub:'How do we protect and stabilize human life at scale?',issues:[
  {icon:'🦠',name:'Disease Prevention & Cure',desc:"The race between illness and the science trying to stop it."},
  {icon:'🌐',name:'Pandemic Response',desc:"What it takes to protect everyone when a crisis has no borders."},
  {icon:'🏗️',name:'Public Health Infrastructure',desc:"The systems keeping populations healthy that most people never notice until they break."},
  {icon:'💧',name:'Clean Water & Sanitation',desc:"The resource wars nobody's talking about yet."},
  {icon:'🚨',name:'Disaster Response',desc:"What it takes to show up when everything falls apart at once."},
  {icon:'💊',name:'Addiction & Substance Abuse',desc:"The crisis hiding in plain sight in every kind of community."},
  {icon:'🥗',name:'Food & Nutrition Systems',desc:"How we grow, distribute, and waste the food that keeps us alive."}
]},
{icon:'🎬',name:'Culture & Entertainment',sub:'How do stories, media, and culture shape the way people think, feel, and connect?',issues:[
  {icon:'🎥',name:'Storytelling & Film',desc:"The way narrative shapes how people see themselves and each other."},
  {icon:'📡',name:'Media & Information',desc:"Who controls the story and why it matters more than ever."},
  {icon:'📖',name:'Misinformation',desc:"The epidemic of false narratives making it harder to agree on reality."},
  {icon:'🎵',name:'Music & Creative Expression',desc:"What art does to people that nothing else can."},
  {icon:'🎮',name:'Gaming & Digital Communities',desc:"The worlds people build online and what happens inside them."},
  {icon:'📲',name:'Online Identity & Influence',desc:"How people construct themselves in public and what that does to them."},
  {icon:'🏆',name:'Sports & Performance Culture',desc:"What competition reveals about who we are and what we value."},
  {icon:'🎨',name:'Arts Access & Creativity',desc:"What gets lost when creativity is treated as a luxury."}
]},
{icon:'💸',name:'Economy & Systems',sub:'How do people gain stability, opportunity, and economic mobility?',issues:[
  {icon:'💰',name:'Economic Opportunity',desc:"Why your zip code still determines how far you can go."},
  {icon:'💡',name:'Entrepreneurship',desc:"What it takes to build something from nothing, and who gets that chance."},
  {icon:'👷',name:'Labor & Workers Rights',desc:"What people deserve in exchange for their time and effort."},
  {icon:'📊',name:'Financial Literacy',desc:"The tools most people were never taught to use."},
  {icon:'🏷️',name:'Cost of Living',desc:"Why keeping up is getting harder even when you're doing everything right."},
  {icon:'📉',name:'Wealth Inequality',desc:"The widening gap between who has everything and who has almost nothing."}
]},
{icon:'🏙️',name:'Infrastructure & Development',sub:'How do we build environments and systems that people can actually live in and rely on?',issues:[
  {icon:'🚌',name:'Transportation & Mobility',desc:"How where you can go shapes what you can become."},
  {icon:'🏛️',name:'Sustainable Architecture & Urban Design',desc:"Building spaces that work for people and don't cost the planet."},
  {icon:'🌆',name:'Smart Cities',desc:"What cities look like when technology and design actually work together."},
  {icon:'🔋',name:'Renewable Infrastructure',desc:"Rebuilding the systems that power everything, from scratch."},
  {icon:'🏘️',name:'Community Development',desc:"What it takes to build a place people actually want to live."},
  {icon:'💻',name:'Digital Access',desc:"The divide between people who have the tools of the future and people who don't."},
  {icon:'🏠',name:'Housing Design',desc:"How the way we build homes shapes the lives lived inside them."}
]},
{icon:'⚖️',name:'Law & Systems',sub:'How should systems, rules, and institutions actually work?',issues:[
  {icon:'🔏',name:'Criminal Justice',desc:"The gap between what the justice system promises and what it delivers."},
  {icon:'🏛️',name:'Politics & Policy',desc:"How the rules get made and who gets to make them."},
  {icon:'🗳️',name:'Civic Participation',desc:"Why so many people have stopped believing their voice matters."},
  {icon:'🎖️',name:'Military & Veterans',desc:"The people who serve and what happens when they come home."},
  {icon:'🤝',name:'Institutional Trust',desc:"Why faith in systems is collapsing and what it costs everyone."},
  {icon:'🌐',name:'Immigration Systems',desc:"The machinery that decides who belongs and who doesn't."},
  {icon:'✊',name:'Human Rights',desc:"The floor below which no person should ever fall, and who's fighting to hold it."},
  {icon:'🔧',name:'Government Reform',desc:"What it would actually take to make the institutions work."}
]}
];// --- PATHS: parked for Phase 1 (old pathway-selection screen). ---
var PATHS=[{icon:'🎓',title:'4-Year University',sub:'Degree program, campus life'},{icon:'🏫',title:'Community College',sub:'Flexible, affordable, local'},{icon:'🔧',title:'Trade / Vocational',sub:'Certification, hands-on skills'},{icon:'🎖️',title:'Military Service',sub:'Service, structure, benefits'},{icon:'💼',title:'Workforce Direct',sub:'Employment, apprenticeship'},{icon:'🚀',title:'Entrepreneurship',sub:'Start something of my own'},{icon:'🧭',title:'Still Figuring It Out',sub:"That's okay too"}];
// --- PARTS: labels for the CORE/WIRING/FUEL/OUTPUT assembly
// tracker shown near the top of most screens. ---
var PARTS=[{icon:'⚙',lbl:'CORE'},{icon:'⚡',lbl:'WIRING'},{icon:'⛽',lbl:'FUEL'},{icon:'◧',lbl:'OUTPUT'}];
