/* ===== SETUP: fill these in (YouTube API lives here) =====
   pfp       : profile picture link from Imgur. Leave '' to show a placeholder "V".
   banner    : banner link from Imgur. Leave '' to show a placeholder gradient.
               Use the direct image link, e.g. https://i.imgur.com/AbC123.png
               (a plain https://imgur.com/AbC123 link also works; album links do not)
   pfpVideos, bannerVideos, pfpVoulge, pfpVoulg3, bannerVoulge, bannerVoulg3 : optional. Give each channel page its own
               profile picture / banner. Left out, they reuse pfp and banner above.
   apiKey    : YouTube Data API v3 key (Google Cloud Console). Restrict it to your site's domain.
   channelId : starts with UC...   OR   handle: '@yourhandle'
   maxVideos : how many videos + shorts to load (max 50)
   shortMax  : anything this many seconds or shorter counts as a Short (default 180) */
window.VOULGE_CONFIG={
  pfp:'https://i.imgur.com/EGyqxIA.png',      // home + about
  banner:'https://i.imgur.com/6BrcY8p.png',   // home hero
  pfpVideos:'',                               // Videos page pfp (empty = reuses pfp above)
  bannerVideos:'',                            // Videos page banner (empty = reuses banner above)
  pfpVoulge:'',                               // Voulge page pfp (empty = reuses pfp above)
  pfpVoulg3:'https://i.imgur.com/Ibm57Y2.jpeg', // Voulg3 page pfp
  bannerVoulge:'https://i.imgur.com/n2FUeC0.png', // Voulge page banner
  bannerVoulg3:'https://i.imgur.com/1izYxwh.png', // Voulg3 page banner
  apiKey:'AIzaSyAWB2EWdQg147KeW37M-HAiPEa4XZ2tMgY',channelId:'UClC8ramdKXZXUwQqTjuDRzw',handle:'@Voulge',maxVideos:12,shortMax:180
};

(function(){
var $=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var CFG=window.VOULGE_CONFIG||{};
/* Imgur links: turn page links into direct image links */
function imgur(u){u=String(u||'').trim();if(!u)return'';
  var m=/^(?:https?:\/\/)?(?:www\.|m\.)?imgur\.com\/(?:gallery\/)?([A-Za-z0-9]{5,8})(?:\.\w+)?$/.exec(u);
  if(m)return'https://i.imgur.com/'+m[1]+'.jpg';
  return /^https:\/\//i.test(u)?u:''}
/* image protection: no right-click menu, no dragging, no long-press save */
document.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('img,canvas,.pfp,.chb,.th,.bn,.hero'))e.preventDefault()});
document.addEventListener('dragstart',function(e){if(e.target.tagName==='IMG'||e.target.tagName==='CANVAS')e.preventDefault()});
new MutationObserver(function(m){m.forEach(function(r){r.addedNodes.forEach(function(n){if(n.querySelectorAll)n.querySelectorAll('img').forEach(function(i){i.draggable=false})})})}).observe(document.body,{childList:true,subtree:true});
$('img').forEach(function(i){i.draggable=false});
/* profile picture (home + about) */
(function(){
  $('.pfp').forEach(function(box){var src=imgur(CFG[box.dataset.k]||CFG.pfp);if(!src)return;var im=box.querySelector('img');im.onload=function(){box.classList.add('on')};im.onerror=function(){box.classList.remove('on')};im.src=src});
  $('.chb').forEach(function(box){var src=imgur(CFG[box.dataset.k]||CFG.banner);if(!src)return;var im=box.querySelector('img');im.onload=function(){box.classList.add('on')};im.onerror=function(){box.classList.remove('on')};im.src=src})})();
/* banner that falls apart */
var bn=document.getElementById('bn'),cv=document.getElementById('bnc'),cx=cv.getContext('2d'),bsrc=null;
function fallback(){var c=document.createElement('canvas');c.width=1400;c.height=800;var g=c.getContext('2d'),l=g.createLinearGradient(0,0,1400,800);
  l.addColorStop(0,'#2a2018');l.addColorStop(.5,'#8a5c32');l.addColorStop(1,'#1a1c20');g.fillStyle=l;g.fillRect(0,0,1400,800);
  g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=2;for(var i=-800;i<1400;i+=70){g.beginPath();g.moveTo(i,800);g.lineTo(i+800,0);g.stroke()}return c}
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function draw(){
  var W=bn.clientWidth,H=bn.clientHeight;if(!W||!H)return;var d=Math.min(2,devicePixelRatio||1);
  cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);cx.clearRect(0,0,W,H);
  var s=bsrc||fallback(),sw=s.naturalWidth||s.width,sh=s.naturalHeight||s.height,k=Math.max(W/sw,H/sh),iw=sw*k,ih=sh*k,ix=(W-iw)/2,iy=(H-ih)/2;
  cx.save();cx.beginPath();cx.rect(0,0,W,H*.3);cx.clip();cx.drawImage(s,ix,iy,iw,ih);cx.restore();
  var cell=Math.max(40,Math.round(W/20)),cols=Math.ceil(W/cell),rows=Math.ceil(H/cell),R=rng(11);
  for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){
    var x=c*cell,y=r*cell,t=(y+cell/2)/H;if(t<.18)continue;
    var tris=R()<.5?[[x,y,x+cell+1,y,x+cell+1,y+cell+1],[x,y,x+cell+1,y+cell+1,x,y+cell+1]]:[[x,y,x+cell+1,y,x,y+cell+1],[x+cell+1,y,x+cell+1,y+cell+1,x,y+cell+1]];
    for(var q=0;q<2;q++){
      var p=tris[q],dec=Math.max(0,(t-.18)/.82),gone=R();
      if(gone<dec*.5)continue;
      var a=Math.pow(dec,1.5),mx=(p[0]+p[2]+p[4])/3,my=(p[1]+p[3]+p[5])/3;
      cx.save();cx.globalAlpha=Math.max(.05,1-a*(.5+R()*.5));
      cx.translate(mx+(R()-.5)*cell*2.4*a,my+a*cell*(.6+R()*3.2));cx.rotate((R()-.5)*1.4*a);cx.translate(-mx,-my);
      cx.beginPath();cx.moveTo(p[0],p[1]);cx.lineTo(p[2],p[3]);cx.lineTo(p[4],p[5]);cx.closePath();cx.clip();
      cx.drawImage(s,ix,iy,iw,ih);cx.restore();
      if(a>.12){cx.save();cx.globalAlpha=.25*(1-a);cx.strokeStyle='#d1a06a';cx.lineWidth=1;cx.beginPath();cx.moveTo(p[0],p[1]);cx.lineTo(p[2],p[3]);cx.lineTo(p[4],p[5]);cx.closePath();cx.stroke();cx.restore()}
    }
  }
}
(function(){var u=imgur(CFG.banner);if(u){var im=new Image();im.onload=function(){bsrc=im;draw()};im.src=u}})();
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(draw,150)});
/* reveal in both scroll directions */
var io=new IntersectionObserver(function(es){es.forEach(function(e){var t=e.target;
  if(e.isIntersecting){t.classList.remove('up','dn');t.classList.add('in')}
  else{t.classList.remove('in');t.classList.add(e.boundingClientRect.top<0?'up':'dn')}})},{threshold:.1,rootMargin:'0px 0px 8% 0px'});
$('.rv').forEach(function(el){el.classList.add('dn');io.observe(el)});
/* counters */
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;
  $('[data-count]',e.target).forEach(function(b){var to=+b.dataset.count,t0=performance.now();(function s(n){var p=Math.min(1,(n-t0)/1200);b.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(s)})(t0)})})},{threshold:.5});
cio.observe(document.getElementById('stats'));
/* scrolling sections: the menu scrolls to each one */
var names=['home','about','videos','voulge','voulg3','community'],links=$('#nv a'),nv=document.getElementById('nv'),pgs=names.map(function(n){return document.getElementById(n)});
links.forEach(function(a){a.addEventListener('click',function(){nv.classList.remove('open')})});
draw();
document.getElementById('mn').addEventListener('click',function(){nv.classList.toggle('open')});
/* motion */
var glow=document.getElementById('glow'),prog=document.getElementById('prog'),hd=document.getElementById('hd'),hc=document.getElementById('hc'),b3=document.getElementById('b3');
var mx=innerWidth/2,my=innerHeight/2,gx=mx,gy=my,nx=0,ny=0;
addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;nx=e.clientX/innerWidth-.5;ny=e.clientY/innerHeight-.5},{passive:true});
var par=$('[data-p]').map(function(el){return{el:el,p:+el.dataset.p,s:el.closest('section')}});
var ms=$('[data-m]');
function loop(){
  var y=scrollY,h=document.documentElement.scrollHeight-innerHeight,vh=innerHeight;
  prog.style.transform='scaleX('+(h>0?y/h:0)+')';hd.classList.toggle('sc',y>20);
  gx+=(mx-gx)*.14;gy+=(my-gy)*.14;glow.style.transform='translate('+gx+'px,'+gy+'px)';
  if(!RM){
    par.forEach(function(o){var r=o.s.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var d=r.top+r.height/2-vh/2;o.el.style.translate='0 '+(d*o.p).toFixed(1)+'px'});
    ms.forEach(function(el){el.style.transform='translate('+(nx*el.dataset.m).toFixed(1)+'px,'+(ny*el.dataset.m).toFixed(1)+'px)'});
    hc.style.translate='0 '+(y*.3)+'px';hc.style.opacity=Math.max(0,1-y/(vh*.75));
    var r3=b3.parentNode.getBoundingClientRect();if(r3.height)b3.style.transform='translateX('+((r3.top+r3.height/2-vh/2)*-.35).toFixed(0)+'px)';
  }
  var cur=0;pgs.forEach(function(p,i){if(p.getBoundingClientRect().top<vh*.4)cur=i});links.forEach(function(a,i){a.classList.toggle('on',i===cur)});
  requestAnimationFrame(loop)}
loop();
/* keep the URL clean (no #about etc.) and always start at the top on refresh */
if('scrollRestoration' in history)history.scrollRestoration='manual';
function clean(){try{if(location.hash)history.replaceState(null,'',location.pathname+location.search)}catch(e){}}
clean();
function toTop(){scrollTo({top:0,left:0,behavior:'instant'})}
toTop();addEventListener('load',function(){toTop();setTimeout(toTop,60)});
addEventListener('pageshow',function(){clean();toTop()});
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;
  var id=a.getAttribute('href').slice(1);if(!id)return;
  var t=document.getElementById(id);if(!t)return;
  e.preventDefault();
  var bh=RM?'instant':'smooth';
  if(id==='home')scrollTo({top:0,behavior:bh});
  else if(id==='videos'){ /* land on the videos heading, not the banner (offsetTop ignores the reveal animation's shift) */
    var h=t.querySelector('.eb')||t,y=0,n=h;while(n){y+=n.offsetTop;n=n.offsetParent}
    scrollTo({top:Math.max(0,y-100),behavior:bh})}
  else t.scrollIntoView({behavior:bh,block:'start'})});
/* magnetic buttons */
$('.mag').forEach(function(b){
  b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.25).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.35).toFixed(1)+'px)'});
  b.addEventListener('mouseleave',function(){b.style.transform=''})});
/* YouTube featured videos + shorts */
var grid=document.getElementById('vg'),note=document.getElementById('vn'),vids=[],st={s:'latest',t:'all'};
var PH=['one','two','three','four','five','six'].map(function(n,i){var sh=i%3===1;return{title:(sh?'Short title ':'Video title ')+n,desc:'Add your API key and channel ID to load your latest videos.',meta:'Orion Drift',url:'#',views:0,t:0,short:sh,dur:sh?'0:45':'8:12'}});
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function kf(n){n=+n;return n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(n)}
function secs(s){var m=/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(s)||[];return(+m[1]||0)*3600+(+m[2]||0)*60+(+m[3]||0)}
function fmt(t){var h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return(h?h+':'+('0'+m).slice(-2):m)+':'+('0'+s).slice(-2)}
function tilt(c){c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');c.style.transform='perspective(800px) rotateY('+((x-.5)*10).toFixed(2)+'deg) rotateX('+((.5-y)*10).toFixed(2)+'deg) translateY(-6px)'});c.addEventListener('mouseleave',function(){c.style.transform=''})}
function render(){
  var list=vids.filter(function(v){return st.t==='all'||(st.t==='short')===!!v.short}).sort(function(a,b){return st.s==='popular'?b.views-a.views:b.t-a.t});
  if(vids!==PH){note.textContent=list.length?'':'Nothing here yet.'}
  grid.innerHTML=list.map(function(v,i){return '<div class="cw rv" style="--d:'+(i%3)+'"><a class="card tilt'+(v.short?' sh':'')+'" href="'+esc(v.url)+'" target="_blank" rel="noopener"><span class="rk">0'+(i+1)+'</span><div class="th">'+(v.img?'<img src="'+esc(v.img)+'" alt="" loading="lazy">':'')+'<span class="tp '+(v.short?'s">Short':'v">Video')+'</span><span class="pl2"></span>'+(v.dur?'<span class="du">'+v.dur+'</span>':'')+'</div><div class="cb"><span class="nt">'+esc(v.meta)+'</span><h3>'+esc(v.title)+'</h3><p>'+esc(v.desc)+'</p></div></a></div>'}).join('');
  $('.rv',grid).forEach(function(el){el.classList.add('dn');io.observe(el)});$('.tilt',grid).forEach(tilt)}
function api(path,q){q.key=CFG.apiKey;return fetch('https://www.googleapis.com/youtube/v3/'+path+'?'+new URLSearchParams(q)).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error&&j.error.message||r.status);return j})})}
function chan(){return api('channels',Object.assign({part:'statistics,contentDetails'},CFG.channelId?{id:CFG.channelId}:{forHandle:CFG.handle})).then(function(j){if(!j.items||!j.items.length)throw new Error('channel not found');return j.items[0]})}
function setStat(id,v){var el=document.getElementById(id);if(!el)return;if(v==null||isNaN(v)){el.textContent='—';return}
  if(RM){el.textContent=kf(v);return}var t0=performance.now();(function s(n){var p=Math.min(1,(n-t0)/1200);el.textContent=kf(Math.round(v*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(s)})(t0)}
function load(){
  if(!CFG.apiKey||!(CFG.channelId||CFG.handle)){vids=PH;render();note.textContent='Preview mode: add your YouTube API key and channel ID in VOULGE_CONFIG (top of the script) to load real videos.';return}
  var max=Math.min(50,CFG.maxVideos||12),smax=CFG.shortMax||180;
  chan().then(function(c){var s=c.statistics||{};setStat('st1',s.hiddenSubscriberCount?null:+s.subscriberCount);setStat('st3',+s.viewCount);return api('playlistItems',{part:'snippet',playlistId:c.contentDetails.relatedPlaylists.uploads,maxResults:max})})
  .then(function(j){return api('videos',{part:'snippet,contentDetails,statistics',id:j.items.map(function(i){return i.snippet.resourceId.videoId}).join(',')})})
  .then(function(j){vids=j.items.map(function(v){var t=v.snippet.thumbnails,b=t.maxres||t.high||t.medium||t.default,d=new Date(v.snippet.publishedAt),n=secs(v.contentDetails.duration),sh=n>0&&(n<=smax||/#shorts?\b/i.test(v.snippet.title+' '+(v.snippet.description||'')));return{title:v.snippet.title,desc:(v.snippet.description||v.snippet.channelTitle).replace(/\s+/g,' ').slice(0,90),meta:kf(v.statistics.viewCount||0)+' views · '+d.toLocaleDateString(undefined,{month:'short',year:'numeric'}),url:sh?'https://www.youtube.com/shorts/'+v.id:'https://www.youtube.com/watch?v='+v.id,img:b.url,dur:fmt(n),short:sh,views:+v.statistics.viewCount||0,t:+d}});note.textContent='';render();setStat('st2',vids.length?Math.round(vids.reduce(function(a,v){return a+v.views},0)/vids.length):null)})
  .catch(function(e){vids=PH;render();note.textContent='Could not load videos from YouTube ('+e.message+'). Showing placeholders.'})}
$('.chip').forEach(function(ch){ch.addEventListener('click',function(){
  Array.prototype.forEach.call(ch.parentNode.children,function(c){c.classList.toggle('on',c===ch)});
  if(ch.dataset.s)st.s=ch.dataset.s;if(ch.dataset.t)st.t=ch.dataset.t;render()})});
load();
window.VOULGE_READY=true;
})();
