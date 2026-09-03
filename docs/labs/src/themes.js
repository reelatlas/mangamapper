// ══ THEMES — each owns an interaction model (layer 1) and hosts variants
//    (layer 2). Same catalog, same rows, radically different experience.
var THEMES = {};

// ─────────────────────────────────────────────────────────────────────────
// TERMINAL — the list scrolls; nothing travels. Dense, keyboard-first.
// ─────────────────────────────────────────────────────────────────────────
THEMES.terminal = {
  variants: {
    current:   { label:'current', tok:{ '--m-ground':'#12141A','--m-card':'#171A20','--m-line':'#3A3E45','--m-ink':'#C9D1D9','--m-dim':'#7E8894','--m-title':'#58E08A',
                 '--c1':'#58B8E4','--c2':'#ECB351','--c3':'#DC6AA3','--c4':'#896ADC','--c5':'#298E57' } },
    phosphor:  { label:'phosphor', tok:{ '--m-ground':'#0B0A07','--m-card':'#100D08','--m-line':'#2B2110','--m-ink':'#FFCE73','--m-dim':'#8A6A22','--m-title':'#FFB000',
                 '--c1':'#FFBE3D','--c2':'#EB9C14','--c3':'#A36E1F','--c4':'#E5D29E','--c5':'#6B4F1F' } },
    duotone:   { label:'duotone', tok:{ '--m-ground':'#0B0A07','--m-card':'#100D08','--m-line':'#2B2110','--m-ink':'#FFCE73','--m-dim':'#8A6A22','--m-title':'#FFB000',
                 '--c1':'#FFC247','--c2':'#C38418','--c3':'#B9CCD5','--c4':'#EBE0C2','--c5':'#527B98' } },
    blueprint: { label:'blueprint', tok:{ '--m-ground':'#0A2740','--m-card':'#0C2E4A','--m-line':'#21587C','--m-ink':'#CDE7F5','--m-dim':'#5E8FAD','--m-title':'#89E8F0',
                 '--c1':'#89E8F0','--c2':'#E6D94C','--c3':'#E64F37','--c4':'#8D68C0','--c5':'#50A589' } },
    daylight:  { label:'daylight', tok:{ '--m-ground':'#F6F1E4','--m-card':'#FBF8F0','--m-line':'#CFC5AC','--m-ink':'#3A3527','--m-dim':'#8A8069','--m-title':'#244260',
                 '--c1':'#244260','--c2':'#906713','--c3':'#8E153F','--c4':'#7523C7','--c5':'#0D7D6E' } }
  },
  mount: function (stage, list) {
    var root = el('div', 't-terminal');
    var head = el('div', 'head');
    head.appendChild(el('span', null, '~/catalog'));
    head.appendChild(el('span', null, list.length + ' series'));
    root.appendChild(head);
    var frag = document.createDocumentFragment();
    list.forEach(function (s, i) {
      var b = el('button', 'row'); b.type = 'button';
      b.appendChild(el('span', 'ix', i + 1));
      var nm = el('span', 'nm', s.nm);
      nm.appendChild(el('i', null, s.jp));
      b.appendChild(nm);
      b.appendChild(stripEl(s.seq));
      b.appendChild(el('span', 'num', 'ep:' + s.ep + ' · ' + pos(s)));
      b.addEventListener('click', function () { openDetail(s); });
      frag.appendChild(b);
    });
    root.appendChild(frag);
    stage.appendChild(root);
    return {};
  }
};

// ─────────────────────────────────────────────────────────────────────────
// DEPTH — one scalar, scroll-driven. Ascent eased slower than descent.
// The variant decides what the ramp ramps.
// ─────────────────────────────────────────────────────────────────────────
var DEPTH_KEYS = ['--m-ground','--m-fog','--m-card','--m-ink','--m-dim','--m-line','--m-title'];
function hx(h) { h = h.replace('#',''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
function mixc(a,b,t) { var A=hx(a),B=hx(b); return 'rgb('+Math.round(A[0]+(B[0]-A[0])*t)+','+Math.round(A[1]+(B[1]-A[1])*t)+','+Math.round(A[2]+(B[2]-A[2])*t)+')'; }

THEMES.depth = {
  variants: {
    abyss: { label:'abyss', ramps:'luminance',
      tok:{ '--c1':'#4FE0C4','--c2':'#E0C86A','--c3':'#E86A9C','--c4':'#9B7BE8','--c5':'#3E9E7A' },
      strata:['surface','forest','fault','goblets','sea of corpses'],
      stops:[['#9FC2A6','#C3DCC2','#8FB69B','#16241C','#3D5648','#7BA189','#12301F'],
             ['#4E8A7C','#6BA592','#437A6E','#0E1F1C','#1E4038','#3B7266','#0B2620'],
             ['#1B4A50','#28626A','#173F45','#CBE7E2','#5E9A96','#2A5F64','#8FE0D2'],
             ['#0A2830','#123A44','#0A2029','#BFE6DE','#4E8A87','#164554','#4FE0C4'],
             ['#05121A','#08202C','#071A22','#BFE6DE','#3F726F','#123845','#4FE0C4']] },
    sounding: { label:'sounding', ramps:'contour density',
      tok:{ '--c1':'#17607F','--c2':'#9A6A12','--c3':'#B2445C','--c4':'#5B4BA0','--c5':'#1E7A5E' },
      strata:['0 m','shelf','slope','rise','abyssal plain'],
      stops:[['#F4F8FA','#FFFFFF','#EAF2F6','#17303D','#5C7E92','#C3D6E0','#17607F'],
             ['#E3EEF3','#F2F8FA','#D8E7EE','#16303E','#557A8E','#B3CADA','#155A78'],
             ['#CFE2EB','#E0EDF3','#C2DAE6','#142D3A','#4C7286','#9FBDD0','#12526E'],
             ['#B6D2E0','#C9E0EA','#A9C9DA','#122733','#446A7E','#8AAFC6','#0F4862'],
             ['#9CC0D4','#B0CFDF','#8FB6CC','#10222D','#3C6276','#79A2BC','#0C3E56']] },
    core: { label:'core', ramps:'strata banding',
      tok:{ '--c1':'#C9A227','--c2':'#B5651D','--c3':'#8C4A3F','--c4':'#6E7B8B','--c5':'#4E6B4A' },
      strata:['topsoil','subsoil','weathered','bedrock','basement'],
      stops:[['#CFC3AC','#E0D6C2','#C2B49A','#241C12','#5A4A34','#A8977C','#2E2314'],
             ['#8A7358','#A08A6C','#7C6549','#1E1710','#43341F','#6E5A42','#241A0E'],
             ['#4E3F30','#61503C','#453728','#D8C9AE','#9A8264','#5E4C39','#E0B93A'],
             ['#2A2119','#3A2E22','#241C15','#D8C9AE','#8A755A','#463726','#C9A227'],
             ['#14100D','#1F1811','#1A1512','#D8C9AE','#7A664E','#3E3226','#C9A227']] }
  },
  mount: function (stage, list) {
    var V = THEMES.depth.variants[state.variant];
    var root = el('div', 't-depth');
    var cv = document.createElement('canvas'); cv.id = 'colcanvas';
    var wrap = el('div', 'colwrap');

    var surf = el('div', 'surface');
    surf.appendChild(el('h1', null, 'You finished the episode. Where does the manga pick up?'));
    surf.appendChild(el('p', 'blurb', list.length + ' series, mapped episode to chapter. Filler marked, gaps shown honestly, nothing guessed. Scroll to descend.'));
    wrap.appendChild(surf);

    var cat = el('div', 'cat');
    var frag = document.createDocumentFragment();
    list.forEach(function (s, i) {
      var b = el('button', 'row'); b.type = 'button';
      b.appendChild(el('span', 'ix', i + 1));
      var c = el('span');
      c.appendChild(el('div', 'nm', s.nm));
      c.appendChild(el('div', 'jp', s.jp));
      b.appendChild(c);
      b.appendChild(stripEl(s.seq));
      b.appendChild(el('span', 'num', 'ep:' + s.ep + ' · ' + pos(s)));
      b.addEventListener('click', function () { openDetail(s); });
      frag.appendChild(b);
    });
    cat.appendChild(frag);
    wrap.appendChild(cat);
    root.appendChild(wrap);

    var g = el('div', 'gauge');
    var st = el('div', 'strata');
    V.strata.forEach(function (t) { st.appendChild(el('span', null, t)); });
    var rule = el('div', 'rule'); var needle = el('div', 'needle'); rule.appendChild(needle);
    g.appendChild(st); g.appendChild(rule);
    root.appendChild(g);
    stage.appendChild(cv); stage.appendChild(root);

    var ctx = cv.getContext('2d'), depth = 0, target = 0, raf = 0, dead = false;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var motes = [];
    function size() {
      var r = Math.min(2, devicePixelRatio || 1);
      cv.width = stage.clientWidth * r; cv.height = stage.clientHeight * r;
      cv.style.width = stage.clientWidth + 'px'; cv.style.height = stage.clientHeight + 'px';
      ctx.setTransform(r, 0, 0, r, 0, 0);
      motes = [];
      for (var i = 0; i < 130; i++) motes.push({ x:Math.random()*cv.clientWidth, y:Math.random()*cv.clientHeight,
        r:.4+Math.random()*1.8, v:.10+Math.random()*.4, s:Math.random()*6.28, a:.14+Math.random()*.44 });
    }
    size(); addEventListener('resize', size);

    function apply(d) {
      var SS = V.stops, seg = Math.min(SS.length - 2, Math.floor(d * (SS.length - 1)));
      var t = d * (SS.length - 1) - seg;
      DEPTH_KEYS.forEach(function (k, i) {
        document.documentElement.style.setProperty(k, mixc(SS[seg][i], SS[seg + 1][i], Math.max(0, Math.min(1, t))));
      });
      needle.style.top = (d * 148) + 'px';
      var band = Math.min(4, Math.floor(d * 5));
      st.childNodes.forEach(function (n, i) { n.className = i === band ? 'on' : ''; });
    }
    function paint(ts) {
      if (dead) return;
      var max = root.scrollHeight - root.clientHeight;
      target = max > 0 ? Math.min(1, root.scrollTop / max) : 0;
      var rising = target < depth;
      depth += (target - depth) * (reduce ? 1 : (rising ? .045 : .11));   // the curse of ascending
      apply(depth);
      ctx.clearRect(0, 0, cv.clientWidth, cv.clientHeight);
      if (state.gfx) V.atmos(ctx, cv.clientWidth, cv.clientHeight, depth, ts, motes, reduce);
      raf = requestAnimationFrame(paint);
    }
    raf = requestAnimationFrame(paint);
    return {
      unmount: function () { dead = true; cancelAnimationFrame(raf); removeEventListener('resize', size); },
      revariant: function () { V = THEMES.depth.variants[state.variant];
        st.textContent = ''; V.strata.forEach(function (t) { st.appendChild(el('span', null, t)); }); apply(depth); }
    };
  }
};

THEMES.depth.variants.abyss.atmos = function (ctx, W, H, d, ts, motes, reduce) {
  var shaft = Math.max(0, 1 - d * 2.1);
  if (shaft > .01) for (var s = 0; s < 4; s++) {
    var x = W * (.13 + s * .25) + Math.sin(ts / 5200 + s) * 26;
    var g = ctx.createLinearGradient(x, -60, x + 130, H);
    g.addColorStop(0, 'rgba(255,255,240,' + (.16 * shaft) + ')'); g.addColorStop(1, 'rgba(255,255,240,0)');
    ctx.fillStyle = g; ctx.beginPath();
    ctx.moveTo(x - 34, -60); ctx.lineTo(x + 40, -60); ctx.lineTo(x + 168, H); ctx.lineTo(x + 52, H);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#fff';
  for (var i = 0; i < motes.length; i++) {
    var m = motes[i];
    if (i / motes.length > .34 + d * .66) continue;
    if (!reduce) { m.y += m.v * (.5 + m.r * .5); m.s += .006; m.x += Math.sin(m.s) * .22; if (m.y > H + 6) { m.y = -6; m.x = Math.random() * W; } }
    ctx.globalAlpha = m.a * (.3 + d * .7);
    ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.284); ctx.fill();
  }
  ctx.globalAlpha = 1;
};
THEMES.depth.variants.sounding.atmos = function (ctx, W, H, d, ts) {
  var n = Math.round(4 + d * 26); ctx.lineWidth = 1; ctx.font = '9px "IBM Plex Mono", monospace';
  for (var i = 0; i < n; i++) {
    var t = i / n, y = H * (.06 + t * .92) + Math.sin(ts / 9000 + i) * 1.2;
    ctx.globalAlpha = .05 + .16 * (1 - Math.abs(t - d) * 1.6);
    if (ctx.globalAlpha <= .01) continue;
    ctx.strokeStyle = '#0C3E56'; ctx.beginPath();
    for (var x = 0; x <= W; x += 12) {
      var yy = y + Math.sin(x / 190 + i * .7) * (7 + i * .5) + Math.cos(x / 90 + i) * 2.5;
      x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
    }
    ctx.stroke();
    if (i % 5 === 0) { ctx.fillStyle = '#0C3E56'; ctx.globalAlpha *= 1.5; ctx.fillText(Math.round(t * 6000), 18 + (i % 3) * 190, y - 3); }
  }
  ctx.globalAlpha = 1;
};
THEMES.depth.variants.core.atmos = function (ctx, W, H, d) {
  var n = Math.round(3 + d * 22);
  for (var i = 0; i < n; i++) {
    var y = H * (i / n), h = H / n;
    ctx.globalAlpha = .05 + .09 * Math.abs(Math.sin(i * 2.7));
    ctx.fillStyle = i % 3 === 0 ? '#000' : '#C9A227';
    ctx.fillRect(0, y, W, h * (.35 + .5 * Math.abs(Math.cos(i * 1.9))));
    ctx.globalAlpha = .16; ctx.fillStyle = '#000'; ctx.fillRect(0, y, W, 1);
  }
  ctx.globalAlpha = .35 * d; ctx.fillStyle = '#000';
  for (var k = 0; k < 200; k++) ctx.fillRect(k * 3739 % W, k * 7919 % H, 1, 1);
  ctx.globalAlpha = 1;
};

// ─────────────────────────────────────────────────────────────────────────
// TANKŌBON — no scroll. Leaves turn on a right-hand spine, RTL.
// At 343 the contents becomes a real 目次: dense, columned, paginated.
// ─────────────────────────────────────────────────────────────────────────
var PER_LEAF = 44;
THEMES.tankobon = {
  variants: {
    shonen: { label:'shonen', tok:{ '--paper':'#F7F5F0','--paper-2':'#EFEDE6','--ink':'#1A1A1A','--ink-2':'#6E6E6E',
      '--tone':'#B0B0B0','--spot':'#E03A3A','--rule':'#1A1A1A','--tone-pitch':'4px','--tone-dot':'1.15px',
      '--skew':'0deg','--grain':'0.05','--gutter':'13px',
      '--c1':'#1A1A1A','--c2':'#6E6E6E','--c3':'#B0B0B0','--c4':'#E03A3A','--c5':'#2B4FA8' } },
    seinen: { label:'seinen', tok:{ '--paper':'#F1F0ED','--paper-2':'#E9E8E4','--ink':'#16181A','--ink-2':'#5A5F63',
      '--tone':'#A9AEB2','--spot':'#8C3A3A','--rule':'#16181A','--tone-pitch':'2.6px','--tone-dot':'.72px',
      '--skew':'0deg','--grain':'0.07','--gutter':'19px',
      '--c1':'#16181A','--c2':'#5A5F63','--c3':'#A9AEB2','--c4':'#8C3A3A','--c5':'#3A5566' } },
    scan: { label:'scan', tok:{ '--paper':'#EFE9DA','--paper-2':'#E8E1CF','--ink':'#262019','--ink-2':'#6B6154',
      '--tone':'#A99E8C','--spot':'#C4564A','--rule':'#3A3229','--tone-pitch':'3.3px','--tone-dot':'1.35px',
      '--skew':'-0.35deg','--grain':'0.13','--gutter':'12px',
      '--c1':'#262019','--c2':'#6B6154','--c3':'#A99E8C','--c4':'#C4564A','--c5':'#4A5F73' } }
  },
  mount: function (stage, list) {
    var root = el('div', 't-tankobon');
    var book = el('div', 'book');
    var leaves = [], page = 0;

    // cover
    var cover = el('div', 'leaf');
    var cp = el('div', 'page cover');
    var art = el('div', 'art');
    art.appendChild(el('div', 'lab', 'mangaMapper — 第1巻'));
    art.appendChild(el('h1', null, 'WHERE DOES\nTHE MANGA\nPICK UP?'));
    art.appendChild(el('div', null, list.length + ' series'));
    var obi = el('div', 'obi');
    obi.appendChild(el('span', null, 'Filler marked. Gaps shown honestly.'));
    obi.appendChild(el('span', null, '目次 →'));
    cp.appendChild(art); cp.appendChild(obi); cover.appendChild(cp); leaves.push(cover);

    // contents — paginated index leaves
    var nLeaves = Math.max(1, Math.ceil(list.length / PER_LEAF));
    for (var L = 0; L < nLeaves; L++) {
      var lf = el('div', 'leaf'), pg = el('div', 'page idx');
      var hd = el('div', 'panel plain');
      hd.appendChild(el('div', 'lab', '目次 — contents'));
      var ttl = el('div', null, 'The catalog  ' + (L * PER_LEAF + 1) + '–' + Math.min(list.length, (L + 1) * PER_LEAF));
      ttl.style.fontFamily = 'Archivo, sans-serif'; ttl.style.fontWeight = '700'; ttl.style.fontSize = '17px';
      hd.appendChild(ttl); pg.appendChild(hd);
      var body = el('div', 'panel plain');
      var grid = el('div', 'idxgrid');
      list.slice(L * PER_LEAF, (L + 1) * PER_LEAF).forEach(function (s, i) {
        var b = el('button', 'idxrow'); b.type = 'button';
        b.appendChild(el('span', 'n', L * PER_LEAF + i + 1));
        b.appendChild(el('span', 't', s.nm));
        b.appendChild(el('span', 'p', s.hasManga ? s.ch + '/' + s.tch : '—'));
        b.addEventListener('click', function () { openDetail(s); });
        grid.appendChild(b);
      });
      body.appendChild(grid); pg.appendChild(body); lf.appendChild(pg); leaves.push(lf);
    }

    for (var i = leaves.length - 1; i >= 0; i--) { leaves[i].style.zIndex = String(leaves.length - i); book.appendChild(leaves[i]); }
    root.appendChild(book);

    var rail = el('div', 'rail2');
    var prev = el('button', null, '→ back'), folio = el('span', 'folio'), next = el('button', null, 'next ←');
    prev.type = next.type = 'button';
    rail.appendChild(prev); rail.appendChild(folio); rail.appendChild(next);
    root.appendChild(rail);
    stage.appendChild(root);

    function paint() {
      leaves.forEach(function (l, i) { l.classList.toggle('turned', i < page); });
      folio.textContent = (page === 0 ? 'cover' : 'contents ' + page + '/' + (leaves.length - 1)) + '   ' + (page + 1) + '/' + leaves.length;
      prev.disabled = page === 0; next.disabled = page === leaves.length - 1;
    }
    function go(p) { page = Math.max(0, Math.min(leaves.length - 1, p)); paint(); }
    prev.addEventListener('click', function () { go(page - 1); });
    next.addEventListener('click', function () { go(page + 1); });

    var lock = 0;
    function onWheel(e) {
      var now = Date.now();
      if (now < lock || Math.abs(e.deltaY) < 8) return;
      lock = now + 560; go(page + (e.deltaY > 0 ? 1 : -1));
    }
    function onKey(e) {
      if (e.target === document.getElementById('q')) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); go(page + 1); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); go(page - 1); }
    }
    root.addEventListener('wheel', onWheel, { passive:true });
    addEventListener('keydown', onKey);
    paint();
    return { unmount: function () { removeEventListener('keydown', onKey); } };
  }
};

// ── detail overlay — shared shell, themed by the active tokens ──────────
function openDetail(s) {
  var ov = document.getElementById('ov') || (function () {
    var o = el('div'); o.id = 'ov';
    var bg = el('div'); bg.id = 'ovbg';
    var c = el('div'); c.id = 'ovcard';
    o.appendChild(bg); o.appendChild(c);
    document.getElementById('stage').appendChild(o);
    bg.addEventListener('click', close);
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    return o;
  })();
  var card = document.getElementById('ovcard');
  document.getElementById('ovbg').style.background = 'color-mix(in srgb, var(--m-ground, #08202C) 82%, transparent)';
  card.style.cssText = 'position:relative;width:min(660px,100%);max-height:100%;overflow:auto;' +
    'background:var(--m-card,var(--paper,#111));color:var(--m-ink,var(--ink,#eee));' +
    'border:1px solid var(--m-line,var(--rule,#333));border-radius:2px;padding:0;';
  card.textContent = '';
  var hd = el('div'); hd.style.cssText = 'display:flex;justify-content:space-between;padding:7px 13px;font-size:10.5px;opacity:.7;border-bottom:1px dashed currentColor';
  hd.appendChild(el('span', null, '~/catalog/' + s.id));
  var x = el('button', null, 'close'); x.type = 'button';
  x.style.cssText = 'background:none;border:0;color:inherit;font:inherit;cursor:pointer';
  x.addEventListener('click', close); hd.appendChild(x); card.appendChild(hd);
  var b = el('div'); b.style.padding = '16px 13px';
  var t = el('div', null, s.nm);
  t.style.cssText = 'font-size:21px;color:var(--m-title,var(--ink,#fff));line-height:1.15';
  b.appendChild(t);
  b.appendChild(el('div', null, s.jp)).style.cssText = 'font-size:11px;opacity:.6;margin:4px 0 14px';
  var p = el('div', null, 'ep:' + s.ep + '   ' + (s.hasManga ? 'vol:' + s.vol + '/' + s.tvol + ' · ch:' + s.ch + '/' + s.tch : '// no_source'));
  p.style.cssText = 'font-size:14px;font-variant-numeric:tabular-nums;margin-bottom:14px';
  b.appendChild(p);
  b.appendChild(stripEl(s.seq, '18px'));
  var leg = el('div');
  leg.style.cssText = 'display:flex;gap:5px;justify-content:flex-end;margin-top:8px;flex-wrap:wrap';
  TYPES.forEach(function (n, i) {
    var sp = el('span', null, n);
    sp.style.cssText = 'font-size:9.5px;padding:2px 6px;border-radius:2px;color:var(' + CVAR[i] + ');background:color-mix(in srgb,var(' + CVAR[i] + ') 13%,transparent)';
    leg.appendChild(sp);
  });
  b.appendChild(leg);
  if (s.tail > 0) {
    var g = el('div', null, 'not yet animated — ch:' + (s.ch + 1) + '–' + s.tch + '  (' + s.tail + ')');
    g.style.cssText = 'margin-top:14px;padding:8px 11px;border:1px dashed currentColor;opacity:.75;font-size:10.5px';
    b.appendChild(g);
  }
  card.appendChild(b);
  ov.classList.add('on');
  function close() { ov.classList.remove('on'); }
}
