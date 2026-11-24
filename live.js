/* Live subscriber count page (/live). Settings come from config.js. */
(function(){
var $=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var CFG=window.VOULGE_CONFIG||{};

/* image protection, same as the main page */
document.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('img,canvas'))e.preventDefault()});

/* reveal on scroll */
var io=new IntersectionObserver(function(es){es.forEach(function(e){var t=e.target;
  if(e.isIntersecting){t.classList.remove('up','dn');t.classList.add('in')}
  else{t.classList.remove('in');t.classList.add(e.boundingClientRect.top<0?'up':'dn')}})},{threshold:.1,rootMargin:'0px 0px 8% 0px'});
$('.rv').forEach(function(el){el.classList.add('dn');io.observe(el)});

/* header, progress bar, cursor glow */
var glow=document.getElementById('glow'),prog=document.getElementById('prog'),hd=document.getElementById('hd');
var mx=innerWidth/2,my=innerHeight/2,gx=mx,gy=my;
addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY},{passive:true});
(function loop(){
  var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  prog.style.transform='scaleX('+(h>0?y/h:0)+')';hd.classList.toggle('sc',y>20);
  gx+=(mx-gx)*.14;gy+=(my-gy)*.14;glow.style.transform='translate('+gx+'px,'+gy+'px)';
  requestAnimationFrame(loop)})();

/* magnetic buttons */
$('.mag').forEach(function(b){
  b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.25).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.35).toFixed(1)+'px)'});
  b.addEventListener('mouseleave',function(){b.style.transform=''})});

/* ===== YouTube ===== */
function api(path,q){q.key=CFG.apiKey;return fetch('https://www.googleapis.com/youtube/v3/'+path+'?'+new URLSearchParams(q),{cache:'no-store'}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error&&j.error.message||r.status);return j})})}
function kf(n){n=+n;return n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(n)}

/* ===== Live subscriber count + milestone celebrations ===== */
var MS=[25,50,100,250,500,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,20000,30000,40000,50000,60000,70000,80000,90000,100000,500000,1000000,2000000,3000000,4000000,5000000,6000000,7000000,8000000,9000000,10000000,50000000,100000000];
function msl(n){return n>=1e6?n/1e6+'M':n>=1e3?n/1e3+'K':String(n)}
function com(n){return Number(n).toLocaleString('en-US')}
var lv={n:null,start:0,digits:0,odo:document.getElementById('odo')},msEl=document.getElementById('ms');
msEl.innerHTML=MS.map(function(m){return '<div class="m" data-m="'+m+'">'+msl(m)+'<small>subs</small></div>'}).join('');
function odoSet(n){
  var s=com(n),d=s.replace(/\D/g,''),el=lv.odo;
  if(d.length!==lv.digits||!el.querySelector('.dg')){
    lv.digits=d.length;el.innerHTML=s.split('').map(function(ch){return ch===','?'<span class="cm">,</span>':'<span class="dg"><span class="col" style="--d:0">'+'0123456789'.split('').map(function(x){return '<i>'+x+'</i>'}).join('')+'</span></span>'}).join('');
    requestAnimationFrame(function(){requestAnimationFrame(function(){$('.col',el).forEach(function(c,i){c.style.setProperty('--d',d[i])})})})
  }else $('.col',el).forEach(function(c,i){c.style.setProperty('--d',d[i])})}
function liveUI(n){
  odoSet(n);
  var nx=MS.filter(function(m){return m>n})[0],pv=MS.filter(function(m){return m<=n}).pop()||0;
  document.getElementById('lvnext').textContent=nx?com(nx):'All reached';
  document.getElementById('lvtogo').textContent=nx?com(nx-n)+' to go':'';
  document.getElementById('lvbar').style.width=(nx?Math.max(2,(n-pv)/(nx-pv)*100):100)+'%';
  var g=n-lv.start;document.getElementById('lvgain').textContent=(g>=0?'+':'')+com(g)+' since you opened this page';
  document.getElementById('lvup').textContent='Updated '+new Date().toLocaleTimeString();
  $('.m',msEl).forEach(function(e){var v=+e.dataset.m;e.classList.toggle('on',v<=n);e.classList.toggle('nx',v===nx)})}
function seenGet(){try{return+localStorage.getItem('voulgeCel')||0}catch(e){return 0}}
function seenSet(m){try{localStorage.setItem('voulgeCel',m)}catch(e){}}
function liveCount(n){
  if(isNaN(n))return;
  if(lv.n===null){lv.n=n;lv.start=n;liveUI(n);
    var top=MS.filter(function(m){return m<=n}).pop();
    if(top&&top>seenGet()&&CFG.celebrateOnLoad!==false){seenSet(top);setTimeout(function(){celebrate(top)},1500)}
    return}
  if(n===lv.n)return;
  var old=lv.n;lv.n=n;liveUI(n);
  var hit=MS.filter(function(m){return old<m&&n>=m});
  if(hit.length){var t=hit[hit.length-1];seenSet(Math.max(seenGet(),t));celebrate(t)}}
function liveHidden(){document.getElementById('lvup').textContent='Subscriber count is hidden on YouTube.'}
function fetchCount(){
  return api('channels',Object.assign({part:'statistics',fields:'items/statistics(subscriberCount,hiddenSubscriberCount)'},CFG.channelId?{id:CFG.channelId}:{forHandle:CFG.handle})).then(function(j){
    var s=j.items&&j.items[0]&&j.items[0].statistics;
    if(!s)throw new Error('channel not found');
    if(s.hiddenSubscriberCount)liveHidden();else liveCount(+s.subscriberCount)})}
var upEl=document.getElementById('lvup');
if(!CFG.apiKey||!(CFG.channelId||CFG.handle)){
  upEl.textContent='Add your YouTube API key in config.js to start the live count.'
}else{
  var every=Math.max(1,CFG.liveEvery||1)*1000,slow=false;
  /* one request at a time, then wait; no pile-up if YouTube is slow. Paused while the tab is hidden. */
  function tick(){
    if(document.hidden||lv.n===null){setTimeout(tick,every);return}
    fetchCount().then(function(){if(slow){slow=false}}).catch(function(e){
      if(/quota/i.test(e.message)){slow=true;upEl.textContent='YouTube daily limit reached, slowing down.'}
    }).then(function(){setTimeout(tick,slow?60000:every)})}
  fetchCount().catch(function(e){upEl.textContent='Could not load the count ('+e.message+').'}).then(function(){setTimeout(tick,every)})}

/* ===== fullscreen ===== */
var fsb=document.getElementById('lvfs'),de=document.documentElement,pseudo=false;
function inFs(){return !!(document.fullscreenElement||document.webkitFullscreenElement)||pseudo}
function fsSync(){de.classList.toggle('fs',inFs());fsb.setAttribute('aria-label',inFs()?'Exit fullscreen':'Fullscreen');fsb.title=inFs()?'Exit fullscreen':'Fullscreen'}
fsb.addEventListener('click',function(){
  if(inFs()){
    if(pseudo)pseudo=false;
    else{var x=document.exitFullscreen||document.webkitExitFullscreen;if(x)x.call(document)}
  }else{
    var r=de.requestFullscreen||de.webkitRequestFullscreen;
    if(r){try{var p=r.call(de);if(p&&p.catch)p.catch(function(){pseudo=true;fsSync()})}catch(e){pseudo=true}}
    else pseudo=true}
  fsSync()});
document.addEventListener('fullscreenchange',fsSync);document.addEventListener('webkitfullscreenchange',fsSync);
addEventListener('keydown',function(e){if(e.key==='Escape'&&pseudo){pseudo=false;fsSync()}});

/* ===== celebration ===== */
var cel=document.getElementById('cel'),cc=document.getElementById('celc'),cctx=cc.getContext('2d'),parts=[],raf=0,closeT=0,tms=[];
var COL=['#d1a06a','#f4f5f6','#c9ced4','#8a5c32','#ffd9a0','#ffffff'];
function celebrate(m){
  var tier=m>=1e6?3:m>=1e5?2:m>=1e3?1:0;
  document.getElementById('celn').textContent=com(m);
  document.getElementById('celm').textContent=['Every single one of you counts. Thank you!','The community keeps growing. Thank you all!','Six figures. Unreal. Thank you all!','Legendary. Thank you all so much!'][tier];
  cel.classList.add('on');
  if(!RM)confetti(tier);
  clearTimeout(closeT);closeT=setTimeout(closeCel,9000+tier*3000)}
function closeCel(){cel.classList.remove('on');cancelAnimationFrame(raf);parts=[];clearTimeout(closeT);tms.forEach(clearTimeout);tms=[]}
function spawn(x,y,n,base,spread,speed,grav){for(var i=0;i<n;i++){var a=base+(Math.random()-.5)*spread,v=speed*(.5+Math.random()*.7);parts.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:Math.random()*6.28,vr:(Math.random()-.5)*.35,s:5+Math.random()*9,c:COL[Math.random()*COL.length|0],g:grav||(.16+Math.random()*.1)})}}
function confetti(tier){
  cancelAnimationFrame(raf);tms.forEach(clearTimeout);tms=[];parts=[];
  var W=cc.width=innerWidth,H=cc.height=innerHeight,N=[70,120,200,320][tier],sp=Math.min(22,W/45);
  function cannons(){spawn(0,H,N,-Math.PI/3,.9,sp,0);spawn(W,H,N,-2*Math.PI/3,.9,sp,0)}
  cannons();
  for(var k=1;k<=tier+1;k++)tms.push(setTimeout(cannons,k*900));
  if(tier>=1)for(var r=0;r<14+tier*8;r++)tms.push(setTimeout(function(){spawn(Math.random()*W,-20,6,Math.PI/2,.6,3,.08)},r*260));
  if(tier>=2)for(var f=0;f<tier*3;f++)tms.push(setTimeout(function(){spawn(W*(.15+Math.random()*.7),H*(.15+Math.random()*.35),70,0,6.28,sp*.6,.12)},600+f*700));
  (function tick(){cctx.clearRect(0,0,W,H);
    parts.forEach(function(p){p.vy+=p.g;p.vx*=.992;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
      cctx.save();cctx.translate(p.x,p.y);cctx.rotate(p.r);cctx.fillStyle=p.c;cctx.beginPath();cctx.moveTo(0,-p.s);cctx.lineTo(p.s*.8,p.s*.6);cctx.lineTo(-p.s*.8,p.s*.6);cctx.closePath();cctx.fill();cctx.restore()});
    parts=parts.filter(function(p){return p.y<H+60});
    if(cel.classList.contains('on'))raf=requestAnimationFrame(tick)})()}
document.getElementById('celx').addEventListener('click',closeCel);
cel.addEventListener('click',function(e){if(e.target===cel)closeCel()});
addEventListener('keydown',function(e){if(e.key==='Escape')closeCel()});
document.getElementById('lvtest').addEventListener('click',function(){var n=lv.n||0,t=MS.filter(function(m){return m<=n}).pop();celebrate(t||MS[0])});
window.VOULGE_READY=true;
})();
