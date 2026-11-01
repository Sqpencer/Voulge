/* ================= intro (click to enter) ================= */
(function(){
  var h=document.documentElement,it=document.getElementById('intro'),ready=false,done=false;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){h.classList.add('go','entered');return}
  setTimeout(function(){ready=true;h.classList.add('ready')},2000);
  function enter(){if(!ready||done)return;done=true;h.classList.add('go');setTimeout(function(){h.classList.add('entered')},600)}
  it.addEventListener('click',enter);
  addEventListener('keydown',function(e){if(!done&&(e.key==='Enter'||e.key===' ')){e.preventDefault();enter()}});
  it.addEventListener('pointermove',function(e){
    it.style.setProperty('--mx',(e.clientX/innerWidth-.5).toFixed(3));it.style.setProperty('--my',(e.clientY/innerHeight-.5).toFixed(3));
    it.style.setProperty('--gx',e.clientX+'px');it.style.setProperty('--gy',e.clientY+'px');
  });
})();

/* ================= main site ================= */
(function(){
  var root0=document.documentElement;
  try{history.scrollRestoration='manual'}catch(e){}
  if(!location.hash)scrollTo(0,0);
  addEventListener('pageshow',function(e){if(e.persisted&&!location.hash)scrollTo(0,0)});
  var rm=matchMedia('(prefers-reduced-motion: reduce)').matches,hov=matchMedia('(hover:hover)').matches;
  // ======== SETTINGS: fill these in ========
  // (the YouTube key lives on the server: add YOUTUBE_API_KEY in Vercel, see api/youtube.js)
  var YT_CHANNEL_ID="UClC8ramdKXZXUwQqTjuDRzw";
  var YT_HANDLE="@Voulge";
  var YOUTUBE_URL="https://www.youtube.com/@Voulge";
  var DISCORD_URL="https://discord.gg/CkDYG5kFyK";
  var PFP_URL="https://i.imgur.com/8Pq3GWh.jpeg";
  var ABOUT_PHOTO_URL="https://i.imgur.com/UA6CNMK.png";
  var BANNER_URL="https://i.imgur.com/RYqcCav.png";
  var DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/1565175240445923429/wqEuc7zNtvDxQxM_xpN9lSb_I2OhGqEd-Qm_2MWdBbrf0VWb6MoAly9NBOv_tXNtGxw7";
  var CONTACT_EMAIL="";
  var POSTS_API="/api/posts";
  var STATIC_POSTS=[];
  // =========================================
  YT_CHANNEL_ID=((YT_CHANNEL_ID||'').match(/UC[\w-]{22}/)||[''])[0];
  YT_HANDLE=((YT_HANDLE||'').match(/@[\w.\-]+/)||[''])[0];
  document.getElementById('tg').addEventListener('click',function(){var t=root0.dataset.theme==='light'?'dark':'light';root0.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}});
  var bar=document.getElementById('bar'),root=document.documentElement;
  var $=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
  var byId=function(id){return document.getElementById(id)};
  var fxEl=document.querySelector('.fx'),topEl=byId('top');
  // hero particles
  var parts=document.getElementById('parts');
  for(var i=0;i<24;i++){var d=document.createElement('i'),s=2+Math.random()*3;d.style.cssText='width:'+s+'px;height:'+s+'px;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;--dur:'+(3+Math.random()*4).toFixed(1)+'s;--dl:'+(-Math.random()*5).toFixed(1)+'s';parts.appendChild(d)}parts.dataset.speed='.12';
  // reveal (IntersectionObserver + a scroll check, so nothing can stay hidden)
  var pending=$('.rv');
  function showEl(el){if(el.classList.contains('in'))return;el.classList.add('in');setTimeout(function(){el.classList.add('rdy')},900)}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){showEl(e.target);io.unobserve(e.target)}})},{rootMargin:'0px 0px -4% 0px',threshold:0});
  pending.forEach(function(el){if(rm)el.classList.add('in','rdy');else io.observe(el)});
  // words
  var wp=document.getElementById('words'),pin=document.getElementById('pin');
  wp.innerHTML=wp.textContent.split(' ').map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');
  var ws=$('.w',wp);
  var par=$('[data-speed]'),rots=$('[data-rot]');
  var secs=$('[data-sec]'),navs=$('[data-n]');
  var ind=document.getElementById('ind'),cur='';
  function setNav(id){
    if(id===cur)return;cur=id;
    navs.forEach(function(a){a.classList.toggle('on',a.dataset.n===id)});
    var a=document.querySelector('#links a[data-n="'+id+'"]');
    if(a){ind.style.left=a.offsetLeft+'px';ind.style.width=a.offsetWidth+'px'}
  }
  function tick(){
    var y=window.scrollY,h=innerHeight,max=Math.max(1,document.documentElement.scrollHeight-h);
    bar.style.transform='scaleX('+(y/max)+')';
    var sp=(y/max).toFixed(3);fxEl.style.setProperty('--sp',sp);topEl.style.setProperty('--sp',sp);
    // ---- read phase (no writes in between, so the browser lays out once) ----
    var id='home';secs.forEach(function(s){if(s.getBoundingClientRect().top<h*.42)id=s.dataset.sec});
    var due=[];
    if(pending.length)pending=pending.filter(function(el){if(el.getBoundingClientRect().top<h*.96){due.push(el);return false}return true});
    var pr=[],rr=[],p=0;
    if(!rm){
      par.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-300||r.top>h+300)return;pr.push([el,-(r.top+r.height/2-h/2)*parseFloat(el.dataset.speed)])});
      rots.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-100||r.top>h+100)return;rr.push([el,((r.top+r.height/2-h/2)/h)*parseFloat(el.dataset.rot)])});
      if(innerWidth>860){var r=pin.getBoundingClientRect();p=(h*.05-r.top)/(r.height-h*.75)}
      else{var r2=wp.getBoundingClientRect();p=(h*.85-r2.top)/(h*.6+r2.height*.5)}
    }
    // ---- write phase ----
    due.forEach(function(el){showEl(el);io.unobserve(el)});
    setNav(id);
    if(rm){ws.forEach(function(w){w.classList.add('on')});return}
    pr.forEach(function(a){a[0].style.setProperty('--py',a[1].toFixed(1)+'px')});
    rr.forEach(function(a){a[0].style.setProperty('--rt',a[1].toFixed(2)+'deg')});
    var n=Math.round(Math.max(0,Math.min(1,p))*ws.length);ws.forEach(function(w,i){w.classList.toggle('on',i<n)});
  }
  var q=false;addEventListener('scroll',function(){if(!q){q=true;requestAnimationFrame(function(){tick();q=false})}},{passive:true});
  addEventListener('resize',function(){cur='';tick()});

  // ================= silky smooth scrolling =================
  var S={t:scrollY,c:scrollY,self:scrollY,on:false,k:11,last:0,tw:null};
  function maxY(){return Math.max(0,root.scrollHeight-innerHeight)}
  function clamp(v){return Math.max(0,Math.min(maxY(),v))}
  function ease(p){return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2}
  function jump(y){scrollTo({top:y,left:0,behavior:'instant'})}
  function frame(now){
    if(!S.on)return;
    var dt=Math.min(.064,(now-S.last)/1000);S.last=now;
    if(S.tw){var p=Math.min(1,(now-S.tw.t0)/S.tw.dur);S.c=S.tw.a+(S.tw.b-S.tw.a)*ease(p);S.t=S.c;if(p>=1){S.tw=null;S.on=false}}
    else{S.c+=(S.t-S.c)*(1-Math.exp(-dt*S.k));if(Math.abs(S.t-S.c)<.2){S.c=S.t;S.on=false}}
    S.self=S.c;jump(S.c);
    if(S.on)requestAnimationFrame(frame);
  }
  function kick(){if(!S.on){S.on=true;S.last=performance.now();requestAnimationFrame(frame)}}
  function halt(){S.on=false;S.tw=null;S.t=S.c=S.self=scrollY}
  function glide(y,instant){
    y=clamp(y);
    if(rm||instant||Math.abs(y-scrollY)<2){S.tw=null;S.on=false;jump(y);S.t=S.c=S.self=y;return}
    S.tw={a:S.c,b:y,t0:performance.now(),dur:Math.min(1100,420+Math.abs(y-S.c)*.22)};kick();
  }
  function go(id,instant){
    var el=document.getElementById(id);if(!el)return;
    glide(id==='home'?0:el.getBoundingClientRect().top+scrollY-(id==='latest'?40:30),instant);
  }
  function inScroller(el,dy){
    while(el&&el!==document.body&&el!==root){
      var cs=getComputedStyle(el);
      if(/(auto|scroll)/.test(cs.overflowY)&&el.scrollHeight>el.clientHeight+1){if(dy>0?el.scrollTop+el.clientHeight<el.scrollHeight-1:el.scrollTop>0)return true}
      el=el.parentElement;
    }
    return false;
  }
  function locked(){return !!document.querySelector('.cm-md.on')||!root.classList.contains('entered')}
  if(!rm){
    addEventListener('wheel',function(e){
      if(e.ctrlKey)return;
      if(locked()){e.preventDefault();return}
      if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
      if(e.deltaMode===0&&Math.abs(e.deltaY)<40){if(S.on)halt();return}
      if(inScroller(e.target,e.deltaY))return;
      e.preventDefault();
      var dd=e.deltaY*(e.deltaMode===1?34:e.deltaMode===2?innerHeight:1);dd=Math.max(-700,Math.min(700,dd));
      S.tw=null;S.k=11;S.t=clamp(S.t+dd);kick();
    },{passive:false});
    addEventListener('keydown',function(e){
      if(!root.classList.contains('entered')||e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;
      var t=e.target,tag=t&&t.tagName;
      if(/INPUT|TEXTAREA|SELECT|BUTTON/.test(tag||'')||(t&&t.isContentEditable))return;
      var k=e.key,v=null,h=innerHeight;
      if(k==='ArrowDown')v=S.t+70;else if(k==='ArrowUp')v=S.t-70;
      else if(k==='PageDown'||(k===' '&&!e.shiftKey))v=S.t+h*.88;
      else if(k==='PageUp'||(k===' '&&e.shiftKey))v=S.t-h*.88;
      else if(k==='Home')v=0;else if(k==='End')v=maxY();
      if(v===null)return;
      e.preventDefault();S.tw=null;S.k=9;S.t=clamp(v);kick();
    });
  }
  addEventListener('scroll',function(){if(!S.on&&Math.abs(scrollY-S.self)>1)S.t=S.c=S.self=scrollY},{passive:true});
  addEventListener('touchstart',function(){if(S.on)halt()},{passive:true});
  addEventListener('mousedown',function(e){if(e.clientX>=root.clientWidth)halt()});
  addEventListener('resize',function(){if(!S.on)S.t=S.c=S.self=scrollY});
  document.addEventListener('click',function(e){var a=e.target.closest('[data-go]');if(!a)return;e.preventDefault();go(a.dataset.go)});
  addEventListener('hashchange',function(){var id=location.hash.slice(1);if(document.getElementById(id)){go(id);try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}});
  addEventListener('load',function(){var id=location.hash.slice(1);if(id&&document.getElementById(id))setTimeout(function(){go(id,true);try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}},50);else scrollTo(0,0);cur='';tick()});
  tick();

  // pointer effects: cursor glow, hero parallax, tilt, magnetic buttons, spotlight
  if(!rm&&hov){
    var cu=document.getElementById('cur'),tx=0,ty=0,cx=0,cy=0,mx=0,my=0,tmx=0,tmy=0,hero=document.getElementById('home');
    addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;cu.classList.add('on');tmx=e.clientX/innerWidth-.5;tmy=e.clientY/innerHeight-.5});
    document.addEventListener('pointerleave',function(){cu.classList.remove('on')});
    (function loop(){cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;cu.style.transform='translate('+cx+'px,'+cy+'px)';mx+=(tmx-mx)*.08;my+=(tmy-my)*.08;hero.style.setProperty('--mx',mx.toFixed(3));hero.style.setProperty('--my',my.toFixed(3));requestAnimationFrame(loop)})();
    var lt=null;
    document.addEventListener('pointermove',function(e){
      var t=e.target.closest&&e.target.closest('.tl');
      if(lt&&lt!==t){lt.style.transform=''}
      if(t){var r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        if(t.classList.contains('rdy'))t.style.transform='perspective(900px) rotateX('+((.5-y)*9).toFixed(2)+'deg) rotateY('+((x-.5)*9).toFixed(2)+'deg) translateY(-4px)';
        t.style.setProperty('--mx2',(x*r.width)+'px');t.style.setProperty('--my2',(y*r.height)+'px')}
      lt=t;
      var b=e.target.closest&&e.target.closest('.btn');
      $('.btn').forEach(function(x){if(x!==b)x.style.translate=''});
      if(b){var br=b.getBoundingClientRect();b.style.translate=((e.clientX-br.left-br.width/2)*.22).toFixed(1)+'px '+((e.clientY-br.top-br.height/2)*.35).toFixed(1)+'px'}
    });
    document.addEventListener('pointerleave',function(){if(lt)lt.style.transform='';$('.btn').forEach(function(x){x.style.translate=''})});
  }
  // ---- banner + pfp ----
  function setArt(pfp,banner){
    var b=document.querySelector('.banner'),p=document.querySelector('.pfp div');
    if(banner&&b){b.style.backgroundImage='url("'+banner+'")';var s=b.querySelector('span');if(s)s.remove()}
    if(pfp&&p){p.style.backgroundImage='url("'+pfp+'")';p.textContent='';root.style.setProperty('--pfp','url("'+pfp+'")')}
  }
  setArt(PFP_URL,BANNER_URL);
  (function(){var u=ABOUT_PHOTO_URL||PFP_URL,f=document.querySelector('.ab .frame');if(!u||!f)return;f.style.backgroundImage='url("'+u+'")';f.style.backgroundSize='cover';f.style.backgroundPosition='center';f.classList.add('has');var sp=f.querySelector('span');if(sp)sp.remove()})();
  // ---- YouTube stats (loaded through your own /api/youtube, so the key stays secret) ----
  var fmt=function(n){return new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(n)};
  function set(id,t){document.getElementById(id).textContent=t}
  function thumb(th,src){if(!th||!src)return;var im=document.createElement('img');im.src=src;im.alt='';im.loading='lazy';im.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover';th.insertBefore(im,th.querySelector('u'))}
  function paint(d){
    setArt(PFP_URL||d.pfp,BANNER_URL||d.banner);
    var s=d.s,v=d.v.slice().sort(function(a,b){return new Date(b.at)-new Date(a.at)});
    if(!s.hiddenSubscriberCount)set('s-subs',fmt(+s.subscriberCount));
    set('s-views',fmt(+s.viewCount));set('s-views-l','Total views');
    if(v.length){var tv=0,te=0;v.forEach(function(x){tv+=x.views;te+=x.likes+x.com});set('s-avg',fmt(Math.round(tv/v.length)));if(tv)set('s-eng',(te/tv*100).toFixed(1)+'%')}
    if(!s.hiddenSubscriberCount)set('h-subs',fmt(+s.subscriberCount));
    set('h-views',fmt(+s.viewCount));if(s.videoCount)set('h-vids',fmt(+s.videoCount));
    if(v[0]){var h=document.getElementById('h-lv');h.href='https://www.youtube.com/watch?v='+v[0].id;h.target='_blank';h.rel='noopener';set('h-lt',v[0].t);thumb(h.querySelector('.th'),v[0].th)}
    if(v[0]){var a=document.getElementById('lv');a.href='https://www.youtube.com/watch?v='+v[0].id;a.target='_blank';a.rel='noopener';set('lv-t',v[0].t);thumb(a.querySelector('.th'),v[0].th)}
    var top=v.slice().sort(function(a,b){return b.views-a.views});
    if(s.videoCount)set('k-vids',fmt(+s.videoCount));
    if(d.joined)set('k-since',new Date(d.joined).getFullYear());
    if(v.length){var tl=0,tc=0;v.forEach(function(x){tl+=x.likes;tc+=x.com});set('k-likes',fmt(Math.round(tl/v.length)));set('k-coms',fmt(Math.round(tc/v.length)))}
    function fill(id,arr){var el=document.getElementById(id);if(!arr.length)return;el.innerHTML='';arr.slice(0,3).forEach(function(x){var a=document.createElement('a'),t=document.createElement('span'),e=document.createElement('em');a.href='https://www.youtube.com/watch?v='+x.id;a.target='_blank';a.rel='noopener';t.textContent=x.t;e.textContent=fmt(x.views)+' views';a.appendChild(t);a.appendChild(e);el.appendChild(a)})}
    fill('top-list',top);fill('new-list',v);u_spark(v);
    $('.wc[data-c="video"]').forEach(function(c,i){var x=top[i];if(!x)return;c.href='https://www.youtube.com/watch?v='+x.id;c.target='_blank';c.rel='noopener';c.querySelector('b').textContent=x.t;c.querySelector('.tx span').textContent=fmt(x.views)+' views';thumb(c.querySelector('.th'),x.th)});
  }
  function loadYT(){
    var c=null;try{c=JSON.parse(sessionStorage.getItem('yt_v5'))}catch(e){}
    if(c&&c.d&&Date.now()-c.t<9e5)return paint(c.d);
    fetch('/api/youtube').then(function(r){
      if(!r.ok)return r.json().catch(function(){return {}}).then(function(j){throw new Error(j.error||('http '+r.status))});
      return r.json();
    }).then(function(d){
      try{sessionStorage.setItem('yt_v5',JSON.stringify({t:Date.now(),d:d}))}catch(e){}
      paint(d);
    }).catch(function(e){console.warn('YouTube stats unavailable:',e.message)});
  }
  loadYT();
  if(YOUTUBE_URL)$('a').forEach(function(a){if(/^\s*Subscribe/.test(a.textContent)){a.href=YOUTUBE_URL;a.target='_blank';a.rel='noopener'}});
  $('[data-soc]').forEach(function(a){var t=a.dataset.soc,y=YOUTUBE_URL.replace(/\/$/,''),u=t==='discord'?DISCORD_URL:t==='shorts'?(y?y+'/shorts':''):YOUTUBE_URL;if(u){a.href=u;a.target='_blank';a.rel='noopener'}});

  // ================= Posts (owner-only community feed) =================
  var cmFeed=byId('cm-feed'),cmTa=byId('cm-t'),cmFile=byId('cm-file'),cmPv=byId('cm-pv'),cmPimg=byId('cm-pimg'),imgData='';
  var cmCnt=byId('cm-n'),cmSay=byId('cm-s'),cmPost=byId('cm-post');
  var cmMd=byId('cm-md'),cmPw=byId('cm-pw'),cmMs=byId('cm-ms'),cmLb=byId('cm-lb'),ownBtn=byId('own');
  var posts=[],ownPw='',idx=0,sx=0;
  try{ownPw=sessionStorage.getItem('own_pw')||''}catch(e){}
  function ago(iso){
    var dt=new Date(iso),sec=(Date.now()-dt)/1000;
    if(isNaN(sec))return '';
    if(sec<60)return 'just now';
    if(sec<3600)return Math.floor(sec/60)+'m ago';
    if(sec<86400)return Math.floor(sec/3600)+'h ago';
    if(sec<604800)return Math.floor(sec/86400)+'d ago';
    return dt.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
  }
  function linkify(el,text){
    var re=/(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"])/g,last=0,m;
    while((m=re.exec(text))){
      if(m.index>last)el.appendChild(document.createTextNode(text.slice(last,m.index)));
      var a=document.createElement('a');a.href=m[0];a.target='_blank';a.rel='noopener noreferrer';a.textContent=m[0];
      el.appendChild(a);last=m.index+m[0].length;
    }
    if(last<text.length)el.appendChild(document.createTextNode(text.slice(last)));
  }
  function openLb(src){cmLb.querySelector('img').src=src;cmLb.classList.add('on')}
  function card(p){
    var a=document.createElement('article');a.className='cp';
    var h=document.createElement('div');h.className='cp-h';
    h.innerHTML='<span class="cm-av"></span><div><b>Voulge</b><span class="cp-tm"></span></div><button type="button" class="own-btn cp-d">Delete</button>';
    var tm=h.querySelector('.cp-tm');tm.textContent=ago(p.at);
    try{tm.title=new Date(p.at).toLocaleString()}catch(e){}
    var dl=h.querySelector('.cp-d');
    if(p.st)dl.remove();else dl.addEventListener('click',function(){delPost(p.id,a)});
    a.appendChild(h);
    if(p.text){var t=document.createElement('p');t.className='cp-t';linkify(t,p.text);a.appendChild(t)}
    if(p.image&&(/^https:\/\//.test(p.image)||/^\/api\/posts\?img=[a-f0-9-]+$/.test(p.image))){
      var im=new Image();im.className='cp-i';im.loading='lazy';im.alt='';im.referrerPolicy='no-referrer';
      im.onerror=function(){im.remove()};
      im.addEventListener('click',function(){openLb(p.image)});
      im.src=p.image;a.appendChild(im);
    }
    return a;
  }
  // one post at a time, with arrows (newest first)
  function renderPosts(){
    var nav=byId('cm-nav'),c;
    cmFeed.innerHTML='';
    if(!posts.length){
      c=document.createElement('div');c.className='cm-empty';c.textContent='No posts yet. Check back soon.';
      cmFeed.appendChild(c);nav.style.display='none';return;
    }
    idx=Math.max(0,Math.min(posts.length-1,idx));
    c=card(posts[idx]);cmFeed.appendChild(c);
    if(rm)c.classList.add('show');else setTimeout(function(){c.classList.add('show')},20);
    nav.style.display=posts.length>1?'':'none';
    byId('cm-cnt').textContent=(idx+1)+' / '+posts.length;
    byId('cm-prev').disabled=idx===0;
    byId('cm-next').disabled=idx===posts.length-1;
  }
  function stepPost(d){var n=idx+d;if(n>=0&&n<posts.length){idx=n;renderPosts()}}
  byId('cm-prev').addEventListener('click',function(){stepPost(-1)});
  byId('cm-next').addEventListener('click',function(){stepPost(1)});
  cmFeed.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  cmFeed.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>60)stepPost(dx<0?1:-1)});
  addEventListener('keydown',function(e){
    if(/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||''))return;
    var r=byId('posts').getBoundingClientRect();
    if(r.top>innerHeight*.6||r.bottom<innerHeight*.4)return;
    if(e.key==='ArrowLeft')stepPost(-1);else if(e.key==='ArrowRight')stepPost(1);
  });
  function loadPosts(){
    cmFeed.innerHTML='<div class="cp-sk"></div>';
    return fetch(POSTS_API,{headers:{Accept:'application/json'}})
      .then(function(r){if(!r.ok)throw 0;return r.json()})
      .then(function(j){if(!j||!Array.isArray(j.posts))throw 0;posts=j.posts})
      .catch(function(){
        posts=STATIC_POSTS.map(function(p){return{id:'',text:p.text||'',image:p.image||'',at:p.at||new Date().toISOString(),st:1}})
          .sort(function(a,b){return new Date(b.at)-new Date(a.at)});
      })
      .then(function(){idx=0;renderPosts()});
  }
  function postApi(body,pass){
    return fetch(POSTS_API,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+pass},body:JSON.stringify(body)})
      .then(function(r){
        return r.json().catch(function(){return {}}).then(function(j){
          if(r.ok)return j;
          var e=new Error(j.error||'http '+r.status);e.status=r.status;e.code=j.error;throw e;
        });
      });
  }
  function setOwner(on){root.classList.toggle('is-owner',on);ownBtn.textContent=on?'Sign out':'Owner'}
  function signOut(){ownPw='';try{sessionStorage.removeItem('own_pw')}catch(e){}setOwner(false)}
  function openMd(){cmMd.classList.add('on');cmMs.textContent='';setTimeout(function(){cmPw.focus()},50)}
  function closeMd(){cmMd.classList.remove('on')}
  function signIn(){
    var v=cmPw.value;if(!v)return;
    cmMs.textContent='Checking\u2026';
    postApi({op:'check'},v).then(function(){
      ownPw=v;try{sessionStorage.setItem('own_pw',ownPw)}catch(e){}
      setOwner(true);closeMd();cmPw.value='';cmMs.textContent='';
    }).catch(function(e){
      cmMs.textContent=e.status===401?'Wrong password.':
        (e.code==='admin_not_configured'||e.code==='storage_not_configured')?'Server isn\u2019t set up yet (see the setup steps).':
        'Posting isn\u2019t available right now.';
    });
  }
  ownBtn.addEventListener('click',function(){if(root.classList.contains('is-owner'))signOut();else openMd()});
  byId('cm-out').addEventListener('click',signOut);
  byId('cm-go').addEventListener('click',signIn);
  cmPw.addEventListener('keydown',function(e){if(e.key==='Enter')signIn()});
  cmMd.addEventListener('click',function(e){if(e.target===cmMd)closeMd()});
  cmLb.addEventListener('click',function(){cmLb.classList.remove('on')});
  addEventListener('keydown',function(e){if(e.key==='Escape'){closeMd();cmLb.classList.remove('on')}});
  if(ownPw)postApi({op:'check'},ownPw).then(function(){setOwner(true)}).catch(function(e){if(e.status===401)signOut()});
  function countChars(){cmCnt.textContent=cmTa.value.length+' / 2000'}
  cmTa.addEventListener('input',countChars);
  cmTa.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key==='Enter')cmPost.click()});
  // ---- image upload: shrink in the browser, then send with the post ----
  function shrink(file){
    return new Promise(function(res,rej){
      if(!/^image\//.test(file.type))return rej(new Error('type'));
      var u=URL.createObjectURL(file),im=new Image();
      im.onload=function(){
        URL.revokeObjectURL(u);
        var sc=Math.min(1,1600/Math.max(im.width,im.height)),q=.85,out='';
        for(var i=0;i<8;i++){
          var c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*sc));c.height=Math.max(1,Math.round(im.height*sc));
          var g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0,c.width,c.height);
          out=c.toDataURL('image/jpeg',q);
          if(out.length<=680000)return res(out);
          q=Math.max(.5,q-.1);sc*=.85;
        }
        rej(new Error('big'));
      };
      im.onerror=function(){URL.revokeObjectURL(u);rej(new Error('read'))};
      im.src=u;
    });
  }
  function clearImg(){imgData='';cmFile.value='';cmPimg.removeAttribute('src');cmPv.style.display='none'}
  function setImg(file){
    if(!file)return;
    cmSay.textContent='Preparing image\u2026';
    shrink(file).then(function(d){imgData=d;cmPimg.src=d;cmPv.style.display='flex';cmSay.textContent=''})
      .catch(function(){clearImg();cmSay.textContent='Couldn\u2019t use that image. Try a different one.'});
  }
  byId('cm-pick').addEventListener('click',function(){cmFile.click()});
  cmFile.addEventListener('change',function(){setImg(cmFile.files[0])});
  byId('cm-prm').addEventListener('click',clearImg);
  cmTa.addEventListener('paste',function(e){
    var it=[].slice.call((e.clipboardData&&e.clipboardData.items)||[]).filter(function(x){return x.kind==='file'&&/^image\//.test(x.type)})[0];
    if(it){e.preventDefault();setImg(it.getAsFile())}
  });
  cmPost.addEventListener('click',function(){
    var t=cmTa.value.trim();
    if(!t&&!imgData){cmSay.textContent='Write something or add an image first.';return}
    cmPost.disabled=true;cmSay.textContent='Posting\u2026';
    postApi({op:'create',text:t,imageData:imgData},ownPw).then(function(j){
      posts.unshift(j.post);idx=0;renderPosts();
      cmTa.value='';clearImg();countChars();cmSay.textContent='Posted!';
    }).catch(function(e){
      if(e.status===401){signOut();cmSay.textContent='Session expired. Sign in again.'}
      else if(e.code==='image_too_large'||e.status===413)cmSay.textContent='That image is too big. Try a smaller one.';
      else cmSay.textContent='Couldn\u2019t post. Try again.';
    }).then(function(){cmPost.disabled=false});
  });
  // site-styled confirm / message box (replaces the browser popup)
  function ask(title,text,ok,cancel,danger){
    return new Promise(function(done){
      var m=byId('dlg'),b=byId('dlg-ok'),n=byId('dlg-no'),pr=document.activeElement;
      byId('dlg-t').textContent=title;byId('dlg-p').textContent=text;
      b.textContent=ok||'OK';b.className='btn '+(danger?'btn-d':'btn-p');
      n.style.display=cancel===false?'none':'';n.textContent=cancel||'Cancel';
      m.classList.add('on');b.focus();
      function end(v){m.classList.remove('on');b.onclick=n.onclick=m.onclick=null;removeEventListener('keydown',key,true);if(pr&&pr.focus)pr.focus();done(v)}
      function key(e){if(e.key==='Escape'){e.stopPropagation();end(false)}else if(e.key==='Enter'){e.preventDefault();end(true)}}
      b.onclick=function(){end(true)};n.onclick=function(){end(false)};
      m.onclick=function(e){if(e.target===m)end(false)};
      addEventListener('keydown',key,true);
    });
  }
  function delPost(id,el){
    if(!id)return;
    ask('Delete this post?','This can\u2019t be undone.','Delete','Cancel',true).then(function(yes){
      if(!yes)return;
      postApi({op:'delete',id:id},ownPw).then(function(){
        posts=posts.filter(function(p){return p.id!==id});
        el.style.opacity='0';el.style.transform='scale(.96)';
        setTimeout(function(){renderPosts()},400);
      }).catch(function(){ask('Couldn\u2019t delete','Please try again.','OK',false)});
    });
  }
  loadPosts();

  // ---- contact form -> Discord webhook ----
  var f=document.getElementById('cf'),st=document.getElementById('st');
  function say(t){st.textContent=t}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(f.website.value)return say('Message sent. Thank you!');
    var n=f.n.value.trim(),em=f.e.value.trim(),m=f.m.value.trim();
    if(!n||!/^\S+@\S+\.\S+$/.test(em)||!m)return say('Please fill in your name, a valid email, and a message.');
    var last=0;try{last=+localStorage.getItem('cf_last')||0}catch(x){}
    if(Date.now()-last<60000)return say('Please wait a minute before sending another message.');
    var btn=f.querySelector('button');
    if(DISCORD_WEBHOOK_URL){
      btn.disabled=true;say('Sending\u2026');
      fetch(DISCORD_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'Voulge Inquiries',allowed_mentions:{parse:[]},embeds:[{title:'New inquiry: '+f.k.value,color:0x5A5A5A,description:m.slice(0,3500),fields:[{name:'Name',value:n.slice(0,200),inline:true},{name:'Email',value:em.slice(0,200),inline:true},{name:'Type',value:f.k.value,inline:true}],timestamp:new Date().toISOString()}]})})
        .then(function(r){if(!r.ok)throw 0;try{localStorage.setItem('cf_last',Date.now())}catch(x){}say('Message sent. Thank you!');f.reset()})
        .catch(function(){say('Couldn\u2019t send. Please try again later.')})
        .then(function(){btn.disabled=false});
    }else if(CONTACT_EMAIL){
      say('Opening your email app\u2026');
      location.href='mailto:'+CONTACT_EMAIL+'?subject='+encodeURIComponent(f.k.value+' - '+n)+'&body='+encodeURIComponent('Name: '+n+'\nEmail: '+em+'\nType: '+f.k.value+'\n\n'+m);
    }else say('Thanks! The inbox isn\u2019t connected yet.');
  });

  // ================= upgrades =================
  // accessibility: dialogs, nav labels, live status text
  $('.cm-md').forEach(function(m){if(!m.classList.contains('cm-lb')){m.setAttribute('role','dialog');m.setAttribute('aria-modal','true')}});
  byId('links').setAttribute('aria-label','Sections');byId('dots2').setAttribute('aria-label','Section dots');
  st.setAttribute('aria-live','polite');cmSay.setAttribute('aria-live','polite');
  // back to top
  var topBtn=byId('top');
  addEventListener('scroll',function(){topBtn.classList.toggle('on',scrollY>innerHeight*.8)},{passive:true});
  topBtn.addEventListener('click',function(){go('home')});
  // footer socials from the URLs above
  (function(){
    var w=document.querySelector('footer .wrap'),d=document.createElement('div');d.className='fsoc';
    [['YouTube',YOUTUBE_URL],['Discord',DISCORD_URL]].forEach(function(x){
      if(!x[1])return;var a=document.createElement('a');a.href=x[1];a.target='_blank';a.rel='noopener';a.textContent=x[0];d.appendChild(a);
    });
    if(d.children.length)w.insertBefore(d,w.children[1]);
  })();
  // ---- scroll animation engine (reads first, writes after: no layout thrashing) ----
  if(!rm){
    $('h2.t').forEach(function(h){h.innerHTML=h.textContent.trim().split(/\s+/).map(function(w,k){return '<span class="hw"><span style="--w:'+k+'">'+w+'</span></span>'}).join(' ')});
    var u_hg=document.querySelector('.hg'),u_sc=$('[data-sc]'),u_hx=$('[data-hx]'),u_h2=$('h2.t'),u_q=false;
    function u_fx(){
      var h=innerHeight,y=scrollY,w=innerWidth;
      // read
      var hp=Math.min(1,Math.max(0,y/(h*.75))),scs=[],hxs=[],h2s=[];
      u_sc.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<0||r.top>h)return;scs.push([el,Math.min(1,Math.max(0,(h-r.top)/(h*.65)))])});
      u_hx.forEach(function(el){var b=el.parentNode.getBoundingClientRect();if(b.bottom<0||b.top>h)return;hxs.push([el,Math.min(1,Math.max(0,(h-b.top)/(h+b.height))),Math.max(0,el.offsetWidth-w),+el.dataset.hx])});
      u_h2.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>h+200)return;h2s.push([el,-(r.top+r.height/2-h/2)*.04])});
      // write
      if(u_hg){u_hg.style.translate='0 '+(-hp*90).toFixed(1)+'px';u_hg.style.scale=(1-hp*.08).toFixed(4)}
      scs.forEach(function(a){var e=1-Math.pow(1-a[1],3);a[0].style.scale=(.88+.12*e).toFixed(4)});
      hxs.forEach(function(a){a[0].style.translate=(-(a[3]>0?a[1]:1-a[1])*a[2]).toFixed(1)+'px 0'});
      h2s.forEach(function(a){a[0].style.translate='0 '+a[1].toFixed(1)+'px'});
    }
    addEventListener('scroll',function(){if(!u_q){u_q=true;requestAnimationFrame(function(){u_fx();u_q=false})}},{passive:true});
    addEventListener('resize',u_fx);u_fx();
    // ticker speeds up with scroll speed, reverses when you scroll up
    var u_mq=document.querySelector('.mq div'),u_y=scrollY,u_v=0,u_r=1,u_an=null;
    (function lp(){
      var y=scrollY;u_v+=((y-u_y)-u_v)*.12;u_y=y;
      var tg=u_v>=0?1+Math.min(8,u_v*.4):-(1+Math.min(8,-u_v*.4));u_r+=(tg-u_r)*.1;
      if(u_mq){if(!u_an){var a=u_mq.getAnimations();u_an=a[0]||null}if(u_an&&Math.abs(u_an.playbackRate-u_r)>.01)u_an.playbackRate=u_r}
      requestAnimationFrame(lp);
    })();
  }
  // section labels decode when they scroll into view
  if(!rm)$('.sh .kick').forEach(function(k){
    var t=k.textContent,ob=new IntersectionObserver(function(es){
      if(!es[0].isIntersecting)return;ob.disconnect();
      var n=0,iv=setInterval(function(){
        n+=.5;
        k.textContent=t.split('').map(function(c,i){return (i<n||c===' ')?c:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random()*26))}).join('');
        if(n>=t.length){clearInterval(iv);k.textContent=t}
      },40);
    },{threshold:1});
    ob.observe(k);
  });
  // ---- recent-upload bar chart in the live stats card ----
  function u_spark(v){
    var box=byId('h-spark');if(!box||!v||!v.length)return;
    var a=v.slice(0,12).reverse(),mx=Math.max.apply(null,a.map(function(x){return x.views}))||1;
    box.innerHTML='';
    a.forEach(function(x,k){var b=document.createElement('i');b.style.setProperty('--h',Math.max(8,Math.round(x.views/mx*100))+'%');b.style.setProperty('--i',k);b.title=x.t+' \u00b7 '+fmt(x.views)+' views';box.appendChild(b)});
    box.parentNode.classList.add('has');
  }
  // ---- stat count-up: plays when the numbers are actually on screen (after the intro) ----
  var u_ids=['h-subs','h-views','h-vids','s-subs','s-avg','s-eng','s-views','k-vids','k-likes','k-coms'],u_st={};
  function u_play(id){
    var o=u_st[id],el=byId(id);
    if(!o||o.done||!o.t||!o.vis||!root.classList.contains('entered'))return;
    o.done=true;o.busy=true;
    var m=o.t.match(/^([\d.,]+)(.*)$/);
    if(!m){el.textContent=o.t;o.busy=false;return}
    var to=parseFloat(m[1].replace(/,/g,'')),suf=m[2],dec=(m[1].split('.')[1]||'').length,t0=performance.now(),dur=id.charAt(0)==='h'?2200:1700;
    (function stp(n){
      var p=Math.min(1,(n-t0)/dur),e=1-Math.pow(1-p,4);
      if(p<1){el.textContent=(to*e).toFixed(dec)+suf;requestAnimationFrame(stp)}
      else{el.textContent=o.t;el.classList.remove('num-pop');void el.offsetWidth;el.classList.add('num-pop');setTimeout(function(){o.busy=false},0)}
    })(t0);
  }
  if(!rm){
    u_ids.forEach(function(id){
      var el=byId(id);if(!el)return;
      var o=u_st[id]={t:'',done:false,vis:false,busy:false};
      new MutationObserver(function(){
        if(o.busy)return;
        var t=(el.textContent||'').trim();
        if(!/^\d/.test(t)||t===o.t)return;
        o.t=t;o.done=false;o.busy=true;el.textContent='0'+t.replace(/^[\d.,]+/,'');
        setTimeout(function(){o.busy=false},0);u_play(id);
      }).observe(el,{childList:true,characterData:true,subtree:true});
      new IntersectionObserver(function(es){o.vis=es[0].isIntersecting;u_play(id)},{threshold:.4}).observe(el);
    });
    new MutationObserver(function(){u_ids.forEach(u_play)}).observe(root,{attributes:true,attributeFilter:['class']});
  }
  // ---- Discord members online ----
  (function(){
    var m=(DISCORD_URL||'').match(/discord\.(?:gg|com\/invite)\/([\w-]+)/);if(!m)return;
    fetch('https://discord.com/api/v9/invites/'+m[1]+'?with_counts=true').then(function(r){return r.ok?r.json():null}).then(function(j){
      if(!j||!j.approximate_presence_count)return;
      var card=document.querySelector('[data-soc="discord"]'),go=card&&card.querySelector('.go');if(!go)return;
      var c=document.createElement('span');c.className='dcp';c.innerHTML='<i></i>'+fmt(j.approximate_presence_count)+' online';
      go.parentNode.insertBefore(c,go);
    }).catch(function(){});
  })();
  // ---- custom cursor ----
  if(!rm&&hov&&matchMedia('(pointer:fine)').matches){
    root.classList.add('cc');
    var ccd=document.createElement('div');
    ccd.className='ccd';document.body.appendChild(ccd);
    var H=root.classList;
    function ccState(t){
      var link=false,txt=false;
      if(t&&t.closest){
        if(t.closest('input,textarea,select'))txt=true;
        else if(t.closest('a,button,[data-go]'))link=true;
      }
      H.toggle('cc-txt',txt);H.toggle('cc-link',link);
    }
    addEventListener('pointermove',function(e){
      H.add('cc-on');ccState(e.target);
      ccd.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)';
    },{passive:true});
    document.addEventListener('mouseleave',function(){H.remove('cc-on')});
    document.addEventListener('mouseenter',function(){H.add('cc-on')});
    addEventListener('mousedown',function(){H.add('cc-down')});
    addEventListener('mouseup',function(){H.remove('cc-down')});
    document.addEventListener('click',function(e){
      var r=document.createElement('div');r.className='ccp';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';
      document.body.appendChild(r);setTimeout(function(){r.remove()},800);
    });
  }
})();
