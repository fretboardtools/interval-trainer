import './style.css';
(function(){
// ---------- theory ----------
const LET='CDEFGAB', NAT=[0,2,4,5,7,9,11];
const ROOTS=[['C',0],['D',-1],['D',0],['E',-1],['E',0],['F',0],['F',1],['G',0],['A',-1],['A',0],['B',-1],['B',0]];
const ACC={'-2':'♭♭','-1':'♭','0':'','1':'♯','2':'♯♯'};
const nm=r=>r[0]+ACC[r[1]];
const pcOf=r=>(((NAT[LET.indexOf(r[0])]+r[1])%12)+12)%12;
function parseDeg(d){const m=/^(bb|b|#)?(\d+)$/.exec(d);const a=m[1]==='bb'?-2:m[1]==='b'?-1:m[1]==='#'?1:0;const n=+m[2];return{n,s:NAT[(n-1)%7]+12*Math.floor((n-1)/7)+a};}
function spell(r,d){const {n,s}=parseDeg(d);const li=LET.indexOf(r[0]);const t=(pcOf(r)+s)%12;const ni=(li+n-1)%7;let diff=((t-NAT[ni])%12+12)%12;if(diff>6)diff-=12;return[LET[ni],diff];}
const fmt=d=>d.replace('bb','♭♭').replace('b','♭').replace('#','♯');
const degHTML=d=>'<span class="'+(d==='1'?'d1':'')+'">'+fmt(d)+'</span>';
function adj(r,minor){if(!minor||r[1]!==-1)return r;if(r[0]==='D')return['C',1];if(r[0]==='A')return['G',1];if(r[0]==='G')return['F',1];return r;}

const CH={
 maj:{sym:'',t:['1','3','5'],sc:['1','2','3','4','5','6','7'],req:['3']},
 min:{sym:'m',t:['1','b3','5'],sc:['1','2','b3','4','5','b6','b7'],req:['b3'],minor:1},
 sus4:{sym:'sus4',t:['1','4','5'],sc:['1','2','4','5','6','b7'],req:['4']},
 aug:{sym:'+',t:['1','3','#5'],sc:['1','2','3','#4','#5','b7'],req:['3','#5']},
 dom7:{sym:'7',t:['1','3','5','b7'],sc:['1','2','3','4','5','6','b7'],req:['3','b7']},
 maj7:{sym:'maj7',t:['1','3','5','7'],sc:['1','2','3','4','5','6','7'],req:['3','7']},
 m7:{sym:'m7',t:['1','b3','5','b7'],sc:['1','2','b3','4','5','6','b7'],req:['b3','b7'],minor:1},
 m7b5:{sym:'m7♭5',t:['1','b3','b5','b7'],sc:['1','b2','b3','4','b5','b6','b7'],req:['b3','b5','b7'],minor:1},
 dim7:{sym:'°7',t:['1','b3','b5','bb7'],sc:['1','2','b3','4','b5','b6','bb7','7'],req:['b3','bb7'],minor:1},
 six:{sym:'6',t:['1','3','5','6'],sc:['1','2','3','5','6'],req:['3','6']},
 m6:{sym:'m6',t:['1','b3','5','6'],sc:['1','2','b3','4','5','6','7'],req:['b3','6'],minor:1},
 sus7:{sym:'7sus4',t:['1','4','5','b7'],sc:['1','2','4','5','6','b7'],req:['4','b7']},
 mmaj7:{sym:'m(maj7)',t:['1','b3','5','7'],sc:['1','2','b3','4','5','6','7'],req:['b3','7'],minor:1}
};
const SETS={triads:['maj','min','sus4','aug'],sevenths:['dom7','maj7','m7','m7b5','dim7'],all:Object.keys(CH)};
const STR=[{n:'low E',pc:4},{n:'A',pc:9},{n:'D',pc:2},{n:'G',pc:7},{n:'B',pc:11},{n:'high E',pc:4}];
const IV={tones:['3','b3','5','b7','7','6'],all:['b2','2','b3','3','4','b5','5','b6','6','b7','7']};
const PROGS={
 iiVI:{name:'ii–V–I',minor:0,ch:[['2','m7'],['5','dom7'],['1','maj7'],['1','maj7']]},
 miiVi:{name:'Minor ii–V–i',minor:1,ch:[['2','m7b5'],['5','dom7'],['1','m6'],['1','m6']]},
 turn:{name:'I–vi–ii–V',minor:0,ch:[['1','maj7'],['6','m7'],['2','m7'],['5','dom7']]},
 blues:{name:'12-bar blues',minor:0,ch:[['1','dom7'],['4','dom7'],['1','dom7'],['1','dom7'],['4','dom7'],['4','dom7'],['1','dom7'],['1','dom7'],['5','dom7'],['4','dom7'],['1','dom7'],['5','dom7']]},
 mblues:{name:'Minor blues',minor:1,ch:[['1','m7'],['4','m7'],['1','m7'],['1','m7'],['4','m7'],['4','m7'],['1','m7'],['1','m7'],['b6','dom7'],['5','dom7'],['1','m7'],['5','dom7']]},
 vamp:{name:'Dorian vamp',minor:1,ch:[['1','m7'],['4','dom7'],['1','m7'],['4','dom7']]}
};
const TGN={r:'roots',f:'5ths',t:'3rds',s:'7ths',ts:'3rds and 7ths',all:'all chord tones'};
function targets(ch,k){const t=ch.t;const f=(re)=>t.filter(x=>re.test(x));
 const r=['1'],fi=f(/^(b|#)?5$/),th=f(/^(b)?3$/).length?f(/^(b)?3$/):f(/^4$/),se=f(/7$/).length?f(/7$/):f(/^6$/);
 return k==='r'?r:k==='f'?fi:k==='t'?th:k==='s'?se:k==='ts'?th.concat(se):t;}

// ---------- helpers ----------
const rnd=n=>Math.floor(Math.random()*n), pick=a=>a[rnd(a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
const $=s=>document.querySelector(s);

// ---------- state ----------
const DEF={mode:'cells',root:'rand',set:'sevenths',src:'formula',count:'4',iv:'tones',str:'any',timer:'on',prog:'iiVI',key:'rand',tg:'ts',bpm:90,bpc:'4',chordSound:'on'};
let S=Object.assign({},DEF);
try{const s=JSON.parse(localStorage.getItem('utg-interval-trainer')||'null');if(s)S=Object.assign(S,s);}catch(e){}
const save=()=>{try{localStorage.setItem('utg-interval-trainer',JSON.stringify(S));}catch(e){}};
let cur=null, revealed=false, lastSig='';
const stats={n:0,total:0,best:null};
let tStart=0, tRAF=0;

// ---------- audio (Karplus-Strong) ----------
let ctx=null, master=null; const cache=new Map();
function ac(){if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();master=ctx.createGain();master.gain.value=.8;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=4500;master.connect(lp);lp.connect(ctx.destination);}
 if(ctx.state==='suspended')ctx.resume();return ctx;}
function ks(midi){if(cache.has(midi))return cache.get(midi);const sr=ctx.sampleRate,f=440*Math.pow(2,(midi-69)/12),N=Math.max(2,Math.round(sr/f)),len=Math.floor(sr*2.4),d=new Float32Array(len);
 let p=0;for(let i=0;i<N;i++){p=.5*((Math.random()*2-1)+p);d[i]=p*1.6;}
 const dec=.996-Math.max(0,midi-60)*.0005;for(let i=N;i<len;i++)d[i]=dec*.5*(d[i-N]+d[i-N+1]);
 const b=ctx.createBuffer(1,len,sr);b.getChannelData(0).set(d);cache.set(midi,b);return b;}
function pluck(midi,t,g){const s=ctx.createBufferSource();s.buffer=ks(midi);const gn=ctx.createGain();gn.gain.setValueAtTime(g,t);gn.gain.setTargetAtTime(0,t+1.5,.25);s.connect(gn);gn.connect(master);s.start(t);s.stop(t+2.4);}
function click(t,acc){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=acc?1500:1000;g.gain.setValueAtTime(acc?.22:.1,t);g.gain.exponentialRampToValueAtTime(.001,t+.05);o.connect(g);g.connect(master);o.start(t);o.stop(t+.06);}
const anchor=r=>40+((pcOf(r)-4+12)%12);
function playDegs(r,degs){if(!ac())return;let prev=anchor(r)+12,t=ctx.currentTime+.05;
 degs.forEach((d,i)=>{const pc=(anchor(r)+parseDeg(d).s)%12;let best=null;for(let m=45;m<=81;m++){if(m%12!==pc)continue;if(best===null||Math.abs(m-prev)<Math.abs(best-prev)||(Math.abs(m-prev)===Math.abs(best-prev)&&Math.random()<.5))best=m;}
  if(i===0)best=anchor(r)+12+(parseDeg(d).s%12);pluck(best,t+i*.34,.55);prev=best;});}
function strum(r,ch,t,g){const b=anchor(r);pluck(b,t,g);let k=1;ch.t.filter(x=>x!=='1').forEach(d=>{pluck(b+12+(parseDeg(d).s%12),t+k*.018,g*.7);k++;});}

// ---------- generators ----------
function chooseRoot(minor){const r=S.root==='rand'?pick(ROOTS):ROOTS[+S.root];return adj(r,minor);}
function makeCell(){let c,tries=0;
 do{const key=pick(SETS[S.set]),ch=CH[key],r=chooseRoot(ch.minor),pool=S.src==='formula'?ch.t:ch.sc,n=+S.count;
  const req=shuffle(ch.req.filter(x=>pool.indexOf(x)>-1));const k=Math.min(req.length,Math.max(1,n-2));
  let sel=req.slice(0,k);let rest=shuffle(pool.filter(x=>sel.indexOf(x)<0));
  while(sel.length<n&&rest.length)sel.push(rest.shift());while(sel.length<n)sel.push(pick(pool));
  let o=shuffle(sel),g=0;while(g++<40&&o.some((x,i)=>i&&x===o[i-1]))o=shuffle(sel);
  c={r,ch,degs:o};tries++;
 }while(tries<25&&sig(c)===lastSig);
 lastSig=sig(c);return c;}
const sig=c=>nm(c.r)+c.ch.sym+c.degs.join();
function makeRule(){const s=shuffle([0,1,2,3,4,5]);const a=pick([1,3,5,7,9,12]);const adjS=rnd(5);
 return pick([
  'One string only: the '+STR[s[0]].n+' string.',
  'Two strings only: the '+STR[adjS].n+' and '+STR[adjS+1].n+' strings.',
  'Stay between frets '+a+' and '+(a+4)+'.',
  'Each note higher up the neck than the last.',
  'Every note on a different string.',
  'Start the cell on the '+STR[s[0]].n+' string.',
  'No open strings, and no fret used twice.',
  'Play it, then play it again an octave higher.',
  'Play it in two different places on the neck.',
  'Play it descending the neck: each note at a lower fret than the last.'
 ]);}
function makeLocate(){let r,d,s,tries=0;do{r=chooseRoot(false);d=pick(IV[S.iv]);s=S.str==='any'?rnd(6):+S.str;tries++;}while(tries<20&&cur&&cur.d===d&&nm(cur.r)===nm(r));
 const note=spell(r,d);const fret=(pcOf(note)-STR[s].pc+12)%12;return{r,d,s,note,fret};}
function makeChanges(){const P=PROGS[S.prog];let k=S.key==='rand'?pick(ROOTS):ROOTS[+S.key];k=adj(k,P.minor);
 return{P,k,chords:P.ch.map(([deg,q])=>{const r=adj(spell(k,deg),CH[q].minor&&false);return{r,ch:CH[q]};})};}

// ---------- rendering ----------
const stage=$('#stage'), actions=$('#actions'), keys=$('#keys');
function btn(id,label,k,primary){return '<button class="btn'+(primary?' primary':'')+'" id="'+id+'">'+label+(k?' <kbd>'+k+'</kbd>':'')+'</button>';}
function render(){stopTimer();
 if(S.mode==='cells'||S.mode==='constraints'){
  const c=cur, notes=c.degs.map(d=>nm(spell(c.r,d)));
  stage.innerHTML='<div class="st-head"><div class="eyebrow">'+(S.mode==='cells'?'Cells':'Constraints')+'</div><p class="st-note">Find these intervals from the root, in this order, anywhere on the neck. Then play them back to check.</p></div>'+
   '<div class="chordline"><span class="chordname">'+nm(c.r)+c.ch.sym+'</span><span class="formula">'+c.ch.t.map(fmt).join(' ')+'</span></div>'+
   '<div class="cell" aria-label="Cell">'+c.degs.map(degHTML).join('<span class="sep">–</span>')+'</div>'+
   '<div class="notes'+(revealed?'':' hidden')+'">'+(revealed?notes.join('  ·  '):'Note names hidden. Press R to check.')+'</div>'+
   (S.mode==='constraints'?'<div class="rule"><span class="lbl">Rule</span><p>'+c.rule+'</p></div>':'');
  actions.innerHTML=btn('next','New cell','Space',1)+btn('play','Play','P')+btn('rev',revealed?'Hide notes':'Reveal notes','R');
  keys.textContent='Play it on the guitar first. Use Play and Reveal to check, not to find.';
 }else if(S.mode==='locate'){
  const c=cur;
  stage.innerHTML='<div class="st-head"><div class="eyebrow">Locate</div>'+(S.timer==='on'?'<span class="timer" id="tm">0.0s</span>':'')+'</div>'+
   '<p class="big">Find the <span class="m">'+fmt(c.d)+'</span> of '+nm(c.r)+'</p><p class="sub">on the '+STR[c.s].n+' string</p>'+
   '<div class="notes'+(revealed?'':' hidden')+'">'+(revealed?nm(c.note)+'  ·  '+(c.fret===0?'open string or fret 12':'fret '+c.fret+(c.fret+12<=17?' or '+(c.fret+12):'')):'Answer hidden. Press R to check.')+'</div>'+
   '<div class="stats">'+(stats.n?'Found '+stats.n+(stats.best!==null?'  ·  average '+(stats.total/stats.n).toFixed(1)+'s  ·  best '+stats.best.toFixed(1)+'s':''):'Press Got it once your finger is on the note.')+'</div>';
  actions.innerHTML=btn('got','Got it','Space',1)+btn('rev',revealed?'Hide answer':'Reveal','R')+btn('play','Play','P')+btn('skip','Skip','S');
  keys.textContent='Find it from the root, not from memory of the fret. Play sounds the root, then the target.';
  if(S.timer==='on'&&!revealed)startTimer();
 }else{
  const c=cur;
  stage.innerHTML='<div class="st-head"><div class="eyebrow">Changes · '+c.P.name+' in '+nm(c.k)+(c.P.minor?' minor':'')+'</div><div class="beats" id="beats">'+'<i></i>'.repeat(+S.bpc>4?4:+S.bpc)+'</div></div>'+
   '<p class="st-note">Land on the '+TGN[S.tg]+' of each chord as it arrives. Everything else is up to you.</p>'+
   '<div class="prog">'+c.chords.map((x,i)=>{const tg=targets(x.ch,S.tg);return '<div class="pc" data-i="'+i+'"><span class="cn">'+nm(x.r)+x.ch.sym+'</span><span class="tg">'+tg.map(degHTML).join(' · ')+'</span><span class="nn">'+(revealed?tg.map(d=>nm(spell(x.r,d))).join(' · '):'')+'</span></div>';}).join('')+'</div>';
  actions.innerHTML=btn('go',playing?'Stop':'Start','Space',1)+btn('rev',revealed?'Hide notes':'Show notes','R')+btn('newkey','New key','N');
  keys.textContent='The click accents each chord change. Turn notes off once you can keep up without them.';
  if(playing)highlight(curIdx,curBeat);
 }
 bind();}
function bind(){const on=(id,f)=>{const e=document.getElementById(id);if(e)e.onclick=f;};
 on('next',next);on('play',play);on('rev',toggleReveal);on('got',got);on('skip',next);on('go',togglePlay);on('newkey',()=>{stopPlay();next();});}

function next(){revealed=false;
 if(S.mode==='cells')cur=makeCell();
 else if(S.mode==='constraints'){cur=makeCell();cur.rule=makeRule();}
 else if(S.mode==='locate')cur=makeLocate();
 else cur=makeChanges();
 render();}
function toggleReveal(){revealed=!revealed;if(S.mode==='locate'&&revealed)stopTimer();render();}
function play(){if(!cur)return;if(S.mode==='locate')playDegs(cur.r,['1',cur.d]);else if(S.mode!=='changes')playDegs(cur.r,cur.degs);}
function got(){const t=(performance.now()-tStart)/1000;if(!revealed&&S.timer==='on'){stats.n++;stats.total+=t;stats.best=stats.best===null?t:Math.min(stats.best,t);}else if(!revealed){stats.n++;}next();}
function startTimer(){tStart=performance.now();const tick=()=>{const e=document.getElementById('tm');if(e)e.textContent=((performance.now()-tStart)/1000).toFixed(1)+'s';tRAF=requestAnimationFrame(tick);};tRAF=requestAnimationFrame(tick);}
function stopTimer(){cancelAnimationFrame(tRAF);}

// ---------- changes scheduler ----------
let playing=false,timerId=0,nextT=0,beat=0,curIdx=-1,curBeat=0;
function highlight(i,b){document.querySelectorAll('.pc').forEach(e=>e.classList.toggle('on',+e.dataset.i===i));
 const bs=document.querySelectorAll('#beats i');const per=+S.bpc;const shown=bs.length;const step=per/shown;bs.forEach((e,k)=>e.classList.toggle('on',Math.floor(b/step)===k));}
function togglePlay(){playing?stopPlay():startPlay();render();}
function startPlay(){if(!ac())return;playing=true;beat=0;nextT=ctx.currentTime+.1;timerId=setInterval(sched,25);}
function stopPlay(){playing=false;clearInterval(timerId);curIdx=-1;document.querySelectorAll('.pc').forEach(e=>e.classList.remove('on'));}
function sched(){const spb=60/S.bpm,per=+S.bpc,n=cur.chords.length;
 while(nextT<ctx.currentTime+.12){const ci=Math.floor(beat/per)%n,b=beat%per;click(nextT,b===0);
  if(b===0&&S.chordSound==='on')strum(cur.chords[ci].r,cur.chords[ci].ch,nextT,.32);
  const at=nextT;setTimeout(()=>{if(!playing)return;curIdx=ci;curBeat=b;highlight(ci,b);},Math.max(0,(at-ctx.currentTime)*1000));
  nextT+=spb;beat++;}}

// ---------- controls ----------
function fillSelects(){
 $('#root').innerHTML='<option value="rand">Random</option>'+ROOTS.map((r,i)=>'<option value="'+i+'">'+nm(r)+'</option>').join('');
 $('#key').innerHTML='<option value="rand">Random</option>'+ROOTS.map((r,i)=>'<option value="'+i+'">'+nm(r)+'</option>').join('');
 $('#str').innerHTML='<option value="any">Any string</option>'+STR.map((s,i)=>'<option value="'+i+'">'+s.n+'</option>').join('');
 $('#prog').innerHTML=Object.keys(PROGS).map(k=>'<option value="'+k+'">'+PROGS[k].name+'</option>').join('');
 ['root','set','str','prog','key','tg'].forEach(id=>{const e=$('#'+id);e.value=S[id];e.onchange=()=>{S[id]=e.value;save();if(S.mode==='changes'&&id==='tg'){render();}else{stopPlay();next();}};});
 const bpm=$('#bpm');bpm.value=S.bpm;bpm.onchange=()=>{S.bpm=Math.min(200,Math.max(40,+bpm.value||90));bpm.value=S.bpm;save();};
 document.querySelectorAll('.seg').forEach(g=>{const k=g.dataset.key;g.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-pressed',String(S[k]===b.dataset.v));b.onclick=()=>{S[k]=b.dataset.v;save();g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
   if(k==='chordSound')return; if(k==='bpc'){render();return;} if(k==='timer'){render();return;} stopPlay();next();};});});
 document.querySelectorAll('.modes button').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));}
function setMode(m){stopPlay();S.mode=m;save();
 document.querySelectorAll('.modes button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.mode===m)));
 document.querySelectorAll('#controls .ctl').forEach(c=>c.hidden=c.dataset.modes.split(' ').indexOf(m)<0);
 next();}

document.addEventListener('keydown',e=>{if(e.target.matches('select,input'))return;const k=e.key.toLowerCase();
 if(k===' '){e.preventDefault();S.mode==='locate'?got():S.mode==='changes'?togglePlay():next();}
 else if(k==='r')toggleReveal();else if(k==='p')play();else if(k==='s'&&S.mode==='locate')next();else if(k==='n'&&S.mode==='changes'){stopPlay();next();}});

fillSelects();setMode(S.mode);
})();
