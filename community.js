/* Voulge: silky smooth scrolling + owner-only Posts feed.
   Add <script src="community.js"></script> directly ABOVE your main <script> block. */
(function () {
  'use strict';
  var API = '/api/posts';
  // Used only if the /api/posts function isn't set up yet. Example:
  // {text:'Hello!', image:'https://i.imgur.com/xxxx.png', at:'2026-10-30'}
  var STATIC_POSTS = [];

  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var $ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var byId = function (id) { return document.getElementById(id); };

  /* ================= styles ================= */
  var st = document.createElement('style');
  st.textContent = [
    '.cm{max-width:760px;margin-top:44px}',
    '.cm-own{display:none;margin-bottom:22px;padding:22px;border:1px solid transparent;border-radius:24px;background:linear-gradient(var(--card),var(--card)) padding-box,conic-gradient(from var(--ang,0deg),transparent 55%,var(--p),var(--pink),transparent) border-box;animation:fs 6s linear infinite}',
    '.is-owner .cm-own{display:block}',
    '.cm-top{display:flex;align-items:center;gap:12px;margin-bottom:14px;font-size:.82rem;color:var(--muted)}.cm-top b{color:var(--text);font-weight:600}',
    '.cm-ta,.cm-in{width:100%;padding:13px 15px;border-radius:14px;border:1px solid var(--line);background:var(--soft);color:var(--text);font:400 .98rem Inter,sans-serif;transition:border-color .2s,box-shadow .2s}',
    '.cm-ta{min-height:110px;resize:vertical;line-height:1.55}',
    '.cm-ta:focus,.cm-in:focus{outline:none;border-color:var(--p2);box-shadow:0 0 0 3px var(--glow)}',
    '.cm-row{display:flex;align-items:center;gap:12px;margin-top:12px;flex-wrap:wrap}.cm-row .cm-in{flex:1;min-width:200px}',
    '.cm-n{font-size:.76rem;color:var(--muted);font-variant-numeric:tabular-nums}.cm-s{font-size:.84rem;color:var(--muted)}',
    '.cm-feed{display:flex;flex-direction:column;gap:16px}',
    '.cp{padding:22px 24px;border:1px solid var(--line);border-radius:24px;background:var(--card);opacity:0;transform:translateY(34px) scale(.98);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1),border-color .3s,box-shadow .3s}',
    '.cp.show{opacity:1;transform:none}',
    '.cp:hover{border-color:rgba(200,200,200,.35);box-shadow:0 30px 80px -40px var(--glow)}',
    '.cp-h{display:flex;align-items:center;gap:12px}',
    '.cm-av{flex:none;width:44px;height:44px;border-radius:50%;border:2px solid var(--line);background:var(--pfp,none) center/cover,linear-gradient(135deg,var(--p2),var(--pink))}',
    '.cp-h b{display:block;font-size:.95rem;letter-spacing:-.02em;line-height:1.3}.cp-h div span{font-size:.78rem;color:var(--muted)}',
    '.cp-d{display:none;margin-left:auto}.is-owner .cp-d{display:inline-block}',
    '.cp-t{margin:14px 0 0;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--text);font-size:1.02rem;line-height:1.6}',
    '.cp-t a{color:var(--p2);text-decoration:underline;text-underline-offset:3px}',
    '.cp-i{display:block;margin-top:16px;width:100%;max-height:520px;object-fit:cover;border-radius:16px;border:1px solid var(--line);cursor:zoom-in}',
    '.cp-sk{height:120px;border-radius:24px;border:1px solid var(--line);background:linear-gradient(100deg,var(--card) 30%,var(--soft) 50%,var(--card) 70%);background-size:200% 100%;animation:cmsk 1.4s linear infinite}',
    '@keyframes cmsk{to{background-position:-200% 0}}',
    '.cm-empty{padding:44px 24px;border:1px dashed var(--line);border-radius:24px;text-align:center;color:var(--muted)}',
    '.cm-more{margin-top:18px}',
    '.cm-md{position:fixed;inset:0;z-index:120;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}',
    '.cm-md.on{display:flex;animation:fade .3s both}',
    '.cm-card{width:min(380px,100%);padding:26px;border:1px solid var(--line);border-radius:24px;background:var(--card)}',
    '.cm-card h3{margin:0 0 6px;font-size:1.2rem;letter-spacing:-.03em}.cm-card p{margin:0 0 16px;color:var(--muted);font-size:.86rem}',
    '.cm-lb{cursor:zoom-out;padding:24px}.cm-lb img{max-width:100%;max-height:100%;border-radius:14px;box-shadow:0 40px 120px rgba(0,0,0,.6)}',
    '.own-btn{background:none;border:0;color:var(--muted);font:500 .8rem Inter,sans-serif;cursor:pointer;padding:0;opacity:.75;transition:opacity .2s,color .2s}.own-btn:hover{opacity:1;color:var(--text)}',
    '@media(max-width:760px){.links a{padding:8px 8px;font-size:.66rem}}'
  ].join('\n');
  document.head.appendChild(st);

  /* ================= Posts section + nav ================= */
  var sec = document.createElement('section');
  sec.id = 'posts'; sec.dataset.sec = 'posts';
  sec.innerHTML =
    '<div class="wrap">' +
      '<div class="sh rv"><span class="num">03</span><span class="kick">Posts</span><span class="ln"></span></div>' +
      '<h2 class="t rv" data-a="blur" style="--d:.06s">Community.</h2>' +
      '<p class="lead rv" style="--d:.12s">Updates, thoughts, and random stuff, straight from me.</p>' +
      '<div class="cm rv" style="--d:.18s">' +
        '<div class="cm-own" id="cm-own">' +
          '<div class="cm-top"><span class="cm-av" style="width:36px;height:36px"></span><span>Posting as <b>Voulge</b></span><button class="own-btn" id="cm-out" type="button" style="margin-left:auto">Sign out</button></div>' +
          '<textarea class="cm-ta" id="cm-t" maxlength="2000" placeholder="What\u2019s on your mind?"></textarea>' +
          '<div class="cm-row"><input class="cm-in" id="cm-img" type="url" placeholder="Image link (optional, https://\u2026)" autocomplete="off"><span class="cm-n" id="cm-n">0 / 2000</span></div>' +
          '<div class="cm-row"><button class="btn btn-p" id="cm-post" type="button">Post</button><span class="cm-s" id="cm-s"></span></div>' +
        '</div>' +
        '<div class="cm-feed" id="cm-feed"></div>' +
        '<button class="btn btn-g cm-more" id="cm-more" type="button" style="display:none">Show more</button>' +
      '</div>' +
    '</div>';
  var soc = byId('socials');
  if (soc && soc.parentNode) soc.parentNode.insertBefore(sec, soc);
  else (document.querySelector('main') || document.body).appendChild(sec);
  $('.sh .num').forEach(function (n, i) { n.textContent = ('0' + (i + 1)).slice(-2); });

  function addNav(c, label) {
    if (!c) return;
    var ref = c.querySelector('[data-n="socials"]'), a = document.createElement('a');
    a.href = '#posts'; a.dataset.go = 'posts'; a.dataset.n = 'posts';
    if (label) a.textContent = label; else a.setAttribute('aria-label', 'Posts');
    c.insertBefore(a, ref || null);
  }
  addNav(byId('links'), 'Posts'); addNav(byId('dots2'), '');

  // owner sign-in + lightbox overlays
  var ov = document.createElement('div');
  ov.innerHTML =
    '<div class="cm-md" id="cm-md"><div class="cm-card"><h3>Owner sign-in</h3><p>Only the owner can post here.</p>' +
    '<input class="cm-in" id="cm-pw" type="password" placeholder="Password" autocomplete="current-password">' +
    '<div class="cm-row"><button class="btn btn-p" id="cm-go" type="button">Sign in</button><span class="cm-s" id="cm-ms"></span></div></div></div>' +
    '<div class="cm-md cm-lb" id="cm-lb"><img alt=""></div>';
  while (ov.firstChild) document.body.appendChild(ov.firstChild);
  var fw = document.querySelector('footer .wrap'), own = document.createElement('button');
  own.type = 'button'; own.className = 'own-btn'; own.textContent = 'Owner';
  if (fw) fw.appendChild(own);

  // keep post avatars in sync with the profile picture on the page
  var pf = document.querySelector('.pfp div');
  function syncPfp() { var bg = pf && pf.style.backgroundImage; if (bg) root.style.setProperty('--pfp', bg); }
  if (pf) { new MutationObserver(syncPfp).observe(pf, { attributes: true, attributeFilter: ['style'] }); syncPfp(); }

  /* ================= feed ================= */
  var feed = byId('cm-feed'), more = byId('cm-more'), ta = byId('cm-t'), img = byId('cm-img');
  var cnt = byId('cm-n'), say = byId('cm-s'), postBtn = byId('cm-post');
  var md = byId('cm-md'), pwIn = byId('cm-pw'), ms = byId('cm-ms'), lb = byId('cm-lb');
  var posts = [], shown = 6, pw = '';
  try { pw = sessionStorage.getItem('own_pw') || ''; } catch (e) {}

  function ago(iso) {
    var d = new Date(iso), s = (Date.now() - d) / 1000;
    if (isNaN(s)) return '';
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    if (s < 604800) return Math.floor(s / 86400) + 'd ago';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function linkify(el, text) {
    var re = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"])/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) el.appendChild(document.createTextNode(text.slice(last, m.index)));
      var a = document.createElement('a');
      a.href = m[0]; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = m[0];
      el.appendChild(a); last = m.index + m[0].length;
    }
    if (last < text.length) el.appendChild(document.createTextNode(text.slice(last)));
  }
  function openLb(src) { lb.querySelector('img').src = src; lb.classList.add('on'); }

  function card(p) {
    var a = document.createElement('article'); a.className = 'cp';
    var h = document.createElement('div'); h.className = 'cp-h';
    h.innerHTML = '<span class="cm-av"></span><div><b>Voulge</b><span></span></div><button type="button" class="own-btn cp-d">Delete</button>';
    var tm = h.querySelector('div span'); tm.textContent = ago(p.at);
    try { tm.title = new Date(p.at).toLocaleString(); } catch (e) {}
    var dl = h.querySelector('.cp-d');
    if (p.st) dl.remove(); else dl.addEventListener('click', function () { del(p.id, a); });
    a.appendChild(h);
    if (p.text) { var t = document.createElement('p'); t.className = 'cp-t'; linkify(t, p.text); a.appendChild(t); }
    if (p.image && /^https:\/\//.test(p.image)) {
      var im = new Image(); im.className = 'cp-i'; im.loading = 'lazy'; im.alt = ''; im.referrerPolicy = 'no-referrer';
      im.onerror = function () { im.remove(); };
      im.addEventListener('click', function () { openLb(p.image); });
      im.src = p.image; a.appendChild(im);
    }
    return a;
  }

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, i = +el.dataset.i || 0;
      setTimeout(function () { el.classList.add('show'); }, i * 90);
      io.unobserve(el);
    });
  }, { threshold: 0.1 }) : null;
  function reveal() {
    $('.cp:not(.show)', feed).forEach(function (el, i) {
      el.dataset.i = i % 6;
      if (rm || !io) el.classList.add('show'); else io.observe(el);
    });
  }
  function render() {
    feed.innerHTML = '';
    if (!posts.length) {
      var e = document.createElement('div'); e.className = 'cm-empty'; e.textContent = 'No posts yet. Check back soon.';
      feed.appendChild(e); more.style.display = 'none'; return;
    }
    posts.slice(0, shown).forEach(function (p) { feed.appendChild(card(p)); });
    more.style.display = posts.length > shown ? '' : 'none';
    reveal();
  }
  more.addEventListener('click', function () {
    posts.slice(shown, shown + 6).forEach(function (p) { feed.appendChild(card(p)); });
    shown += 6; more.style.display = posts.length > shown ? '' : 'none'; reveal();
  });
  function load() {
    feed.innerHTML = '<div class="cp-sk"></div><div class="cp-sk"></div>';
    return fetch(API, { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { if (!j || !Array.isArray(j.posts)) throw 0; posts = j.posts; })
      .catch(function () {
        posts = STATIC_POSTS.map(function (p) { return { id: '', text: p.text || '', image: p.image || '', at: p.at || new Date().toISOString(), st: 1 }; })
          .sort(function (a, b) { return new Date(b.at) - new Date(a.at); });
      })
      .then(render);
  }

  /* ================= owner mode ================= */
  function api(body, pass) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + pass }, body: JSON.stringify(body) })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.ok) return j;
          var e = new Error(j.error || 'http ' + r.status); e.status = r.status; e.code = j.error; throw e;
        });
      });
  }
  function setOwner(on) { root.classList.toggle('is-owner', on); own.textContent = on ? 'Sign out' : 'Owner'; }
  function signOut() { pw = ''; try { sessionStorage.removeItem('own_pw'); } catch (e) {} setOwner(false); }
  function openMd() { md.classList.add('on'); ms.textContent = ''; setTimeout(function () { pwIn.focus(); }, 50); }
  function closeMd() { md.classList.remove('on'); }
  function signIn() {
    var v = pwIn.value; if (!v) return;
    ms.textContent = 'Checking\u2026';
    api({ op: 'check' }, v).then(function () {
      pw = v; try { sessionStorage.setItem('own_pw', pw); } catch (e) {}
      setOwner(true); closeMd(); pwIn.value = ''; ms.textContent = '';
    }).catch(function (e) {
      ms.textContent = e.status === 401 ? 'Wrong password.' :
        (e.code === 'admin_not_configured' || e.code === 'storage_not_configured') ? 'Server isn\u2019t set up yet (see the setup steps).' :
        'Posting isn\u2019t available right now.';
    });
  }
  own.addEventListener('click', function () { if (root.classList.contains('is-owner')) signOut(); else openMd(); });
  byId('cm-out').addEventListener('click', signOut);
  byId('cm-go').addEventListener('click', signIn);
  pwIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') signIn(); });
  md.addEventListener('click', function (e) { if (e.target === md) closeMd(); });
  lb.addEventListener('click', function () { lb.classList.remove('on'); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMd(); lb.classList.remove('on'); } });
  if (pw) api({ op: 'check' }, pw).then(function () { setOwner(true); }).catch(function (e) { if (e.status === 401) signOut(); });

  function count() { cnt.textContent = ta.value.length + ' / 2000'; }
  ta.addEventListener('input', count);
  ta.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') postBtn.click(); });
  postBtn.addEventListener('click', function () {
    var t = ta.value.trim(), im = img.value.trim();
    if (!t && !im) { say.textContent = 'Write something first.'; return; }
    if (im && !/^https:\/\/\S+$/.test(im)) { say.textContent = 'Image link must start with https://'; return; }
    postBtn.disabled = true; say.textContent = 'Posting\u2026';
    api({ op: 'create', text: t, image: im }, pw).then(function (j) {
      posts.unshift(j.post);
      var em = feed.querySelector('.cm-empty'); if (em) em.remove();
      feed.insertBefore(card(j.post), feed.firstChild); reveal();
      ta.value = ''; img.value = ''; count(); say.textContent = 'Posted!';
    }).catch(function (e) {
      if (e.status === 401) { signOut(); say.textContent = 'Session expired. Sign in again.'; }
      else say.textContent = 'Couldn\u2019t post. Try again.';
    }).then(function () { postBtn.disabled = false; });
  });
  function del(id, el) {
    if (!id || !confirm('Delete this post?')) return;
    api({ op: 'delete', id: id }, pw).then(function () {
      posts = posts.filter(function (p) { return p.id !== id; });
      el.style.opacity = '0'; el.style.transform = 'scale(.96)';
      setTimeout(function () { el.remove(); if (!feed.children.length) render(); }, 400);
    }).catch(function () { alert('Couldn\u2019t delete. Try again.'); });
  }
  load();

  /* ================= silky smooth scrolling ================= */
  var S = { t: scrollY, c: scrollY, self: scrollY, on: false, k: 6, last: 0, tw: null };
  function maxY() { return Math.max(0, root.scrollHeight - innerHeight); }
  function clamp(v) { return Math.max(0, Math.min(maxY(), v)); }
  function ease(p) { return p < 0.5 ? 8 * p * p * p * p : 1 - Math.pow(-2 * p + 2, 4) / 2; }
  function jump(y) { scrollTo({ top: y, left: 0, behavior: 'instant' }); }
  function frame(now) {
    if (!S.on) return;
    var dt = Math.min(0.064, (now - S.last) / 1000); S.last = now;
    if (S.tw) {
      var p = Math.min(1, (now - S.tw.t0) / S.tw.dur);
      S.c = S.tw.a + (S.tw.b - S.tw.a) * ease(p); S.t = S.c;
      if (p >= 1) { S.tw = null; S.on = false; }
    } else {
      S.c += (S.t - S.c) * (1 - Math.exp(-dt * S.k));
      if (Math.abs(S.t - S.c) < 0.2) { S.c = S.t; S.on = false; }
    }
    S.self = S.c; jump(S.c);
    if (S.on) requestAnimationFrame(frame);
  }
  function kick() { if (!S.on) { S.on = true; S.last = performance.now(); requestAnimationFrame(frame); } }
  function halt() { S.on = false; S.tw = null; S.t = S.c = S.self = scrollY; }
  function glide(y) {
    y = clamp(y);
    if (rm || Math.abs(y - scrollY) < 2) { S.tw = null; S.on = false; jump(y); S.t = S.c = S.self = y; return; }
    S.tw = { a: S.c, b: y, t0: performance.now(), dur: Math.min(1600, 720 + Math.abs(y - S.c) * 0.38) };
    kick();
  }
  function glideTo(id) {
    var el = byId(id); if (!el) return;
    glide(id === 'home' ? 0 : el.getBoundingClientRect().top + scrollY - (id === 'latest' ? 40 : 30));
  }
  function inScroller(el, dy) {
    while (el && el !== document.body && el !== root) {
      var cs = getComputedStyle(el);
      if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1) {
        if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
      }
      el = el.parentElement;
    }
    return false;
  }
  if (!rm) {
    addEventListener('wheel', function (e) {
      if (e.ctrlKey) return;
      if (md.classList.contains('on') || lb.classList.contains('on')) { e.preventDefault(); return; }
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (inScroller(e.target, e.deltaY)) return;
      e.preventDefault();
      var d = e.deltaY * (e.deltaMode === 1 ? 34 : e.deltaMode === 2 ? innerHeight : 1);
      d = Math.max(-700, Math.min(700, d));
      S.tw = null; S.k = 6; S.t = clamp(S.t + d); kick();
    }, { passive: false });
    addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target, tag = t && t.tagName;
      if (/INPUT|TEXTAREA|SELECT|BUTTON/.test(tag || '') || (t && t.isContentEditable)) return;
      var k = e.key, v = null, h = innerHeight;
      if (k === 'ArrowDown') v = S.t + 70; else if (k === 'ArrowUp') v = S.t - 70;
      else if (k === 'PageDown' || (k === ' ' && !e.shiftKey)) v = S.t + h * 0.88;
      else if (k === 'PageUp' || (k === ' ' && e.shiftKey)) v = S.t - h * 0.88;
      else if (k === 'Home') v = 0; else if (k === 'End') v = maxY();
      if (v === null) return;
      e.preventDefault(); S.tw = null; S.k = 5; S.t = clamp(v); kick();
    });
  }
  addEventListener('scroll', function () { if (!S.on && Math.abs(scrollY - S.self) > 1) S.t = S.c = S.self = scrollY; }, { passive: true });
  addEventListener('touchstart', function () { if (S.on) halt(); }, { passive: true });
  addEventListener('mousedown', function (e) { if (e.clientX >= root.clientWidth) halt(); });
  addEventListener('resize', function () { if (!S.on) S.t = S.c = S.self = scrollY; });
  // nav / button clicks glide instead of jumping (runs before the page's own handler)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-go]');
    if (!a || !byId(a.dataset.go)) return;
    e.preventDefault(); e.stopPropagation(); glideTo(a.dataset.go);
  }, true);
  addEventListener('hashchange', function (e) {
    var id = location.hash.slice(1);
    if (id && byId(id)) {
      e.stopImmediatePropagation(); glideTo(id);
      try { history.replaceState(null, '', location.pathname + location.search); } catch (x) {}
    }
  }, true);
})();
