// ─────────────────────────────────────────────────────────────────────────
// TANKŌBON — no scroll. Sheets turn on a right-hand spine, RTL.
// VIEWS (layer 1, a third axis — not colour, not material): how dense a
// leaf is. index = a real 目次; visual = preview panels you flip through.
// ─────────────────────────────────────────────────────────────────────────
THEMES.tankobon = {
  views: { index:{ label:'index', per:44 }, visual:{ label:'visual', per:6 } },
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
    var VIEW = THEMES.tankobon.views[state.view] || THEMES.tankobon.views.index;
    var PER = VIEW.per;
    var root = el('div', 't-tankobon');
    var book = el('div', 'book');
    var leaves = [], page = 0;

    function sheet(pageEl) {                 // a real two-sided sheet
      var lf = el('div', 'leaf');
      var front = el('div', 'face front');
      front.appendChild(pageEl);
      lf.appendChild(front);
      lf.appendChild(el('div', 'face back'));
      return lf;
    }

    // ── cover ──
    var cp = el('div', 'page cover');
    var art = el('div', 'art');
    art.appendChild(el('div', 'lab', 'mangaMapper — 第1巻'));
    art.appendChild(el('h1', null, 'WHERE DOES\nTHE MANGA\nPICK UP?'));
    art.appendChild(el('div', null, list.length + ' series'));
    var obi = el('div', 'obi');
    obi.appendChild(el('span', null, 'Filler marked. Gaps shown honestly.'));
    obi.appendChild(el('span', null, '目次 →'));
    cp.appendChild(art); cp.appendChild(obi);
    leaves.push(sheet(cp));

    // ── contents leaves ──
    var nLeaves = Math.max(1, Math.ceil(list.length / PER));
    for (var L = 0; L < nLeaves; L++) {
      var slice = list.slice(L * PER, (L + 1) * PER);
      leaves.push(sheet(state.view === 'visual' ? visualPage(slice, L) : indexPage(slice, L)));
    }

    function pageHead(L, slice) {
      var hd = el('div', 'panel plain');
      hd.appendChild(el('div', 'lab', '目次 — contents'));
      var t = el('div', null, 'The catalog  ' + (L * PER + 1) + '–' + (L * PER + slice.length));
      t.style.cssText = 'font-family:Archivo,sans-serif;font-weight:700;font-size:17px';
      hd.appendChild(t);
      return hd;
    }

    function indexPage(slice, L) {
      var pg = el('div', 'page idx');
      pg.appendChild(pageHead(L, slice));
      var body = el('div', 'panel plain');
      var grid = el('div', 'idxgrid');
      slice.forEach(function (s, i) {
        var b = el('button', 'idxrow'); b.type = 'button';
        b.appendChild(el('span', 'n', L * PER + i + 1));
        b.appendChild(el('span', 't', s.nm));
        b.appendChild(el('span', 'p', s.hasManga ? s.ch + '/' + s.tch : '—'));
        b.addEventListener('click', function () { openSpread(s); });
        grid.appendChild(b);
      });
      body.appendChild(grid); pg.appendChild(body);
      return pg;
    }

    // preview panels — big title, strip, figures. Panel grammar, not a grid.
    function visualPage(slice, L) {
      var pg = el('div', 'page vis');
      slice.forEach(function (s, i) {
        var b = el('button', 'panel vispanel' + (i === 0 ? ' hero' : '')); b.type = 'button';
        b.appendChild(el('div', 'lab', String(L * PER + i + 1).padStart(3, '0') + (s.status === 'airing' ? ' · airing' : '')));
        b.appendChild(el('div', 'vnm', s.nm));
        b.appendChild(el('div', 'vjp', s.jp));
        var sp = el('div', 'vspacer'); b.appendChild(sp);
        b.appendChild(stripEl(s.seq, i === 0 ? '16px' : '11px'));
        b.appendChild(el('div', 'vnum', 'ep:' + s.ep + '   ' + pos(s)));
        b.addEventListener('click', function () { openSpread(s); });
        pg.appendChild(b);
      });
      return pg;
    }

    // ── the detail SPREAD — a page of the book, never a modal ──
    var spread = null;
    function buildSpread(s) {
      var pg = el('div', 'page full');
      var top = el('div', 'panel plain');
      top.appendChild(el('div', 'lab', 'series'));
      var t = el('div', 'fulltitle', s.nm); top.appendChild(t);
      top.appendChild(el('div', 'vjp', s.jp));
      pg.appendChild(top);

      var fig = el('div', 'panel figpanel');
      fig.appendChild(el('div', 'lab', 'position'));
      var f = el('div', 'figs');
      f.innerHTML = s.hasManga
        ? 'ep:' + s.ep + '<span class="d">/—</span><br>vol:' + s.vol + '<span class="d">/' + s.tvol +
          '</span><br>ch:' + s.ch + '<span class="d">/' + s.tch + '</span>'
        : 'ep:' + s.ep + '<span class="d">/—</span><br><span class="d">// no_source</span>';
      fig.appendChild(f);
      pg.appendChild(fig);

      var st = el('div', 'panel');
      st.appendChild(el('div', 'lab', 'episode types'));
      st.appendChild(stripEl(s.seq, '20px'));
      var leg = el('div', 'leg');
      TYPES.forEach(function (n, i) {
        var sp2 = el('span', null, n); sp2.style.color = 'var(' + CVAR[i] + ')'; leg.appendChild(sp2);
      });
      st.appendChild(leg);
      pg.appendChild(st);

      var foot = el('div', 'panel plain footpanel');
      if (s.tail > 0) {
        var g = el('div', 'gapnote');
        g.appendChild(el('span', null, 'not yet animated'));
        g.appendChild(el('span', null, 'ch:' + (s.ch + 1) + '–' + s.tch + '  (' + s.tail + ')'));
        foot.appendChild(g);
      } else {
        foot.appendChild(el('div', 'gapnote', s.hasManga ? 'fully adapted' : 'no source material'));
      }
      var back = el('button', 'back', '→ back to contents'); back.type = 'button';
      back.addEventListener('click', closeSpread);
      foot.appendChild(back);
      pg.appendChild(foot);
      return pg;
    }

    function openSpread(s) {
      if (spread) { spread.remove(); leaves.splice(leaves.indexOf(spread), 1); }
      spread = sheet(buildSpread(s));
      leaves.splice(page + 1, 0, spread);      // one turn away — physical
      book.appendChild(spread);
      restack(); paint();
      requestAnimationFrame(function () { go(page + 1); });
    }
    function closeSpread() {
      var at = leaves.indexOf(spread);
      if (at < 0) return;
      go(at - 1);
      var s2 = spread; spread = null;
      setTimeout(function () {
        var j = leaves.indexOf(s2);
        if (j >= 0) leaves.splice(j, 1);
        s2.remove(); restack(); paint();
      }, 820);
    }

    for (var i = leaves.length - 1; i >= 0; i--) book.appendChild(leaves[i]);
    root.appendChild(book);

    var rail = el('div', 'rail2');
    var prev = el('button', null, '→ back'), folio = el('span', 'folio'), next = el('button', null, 'next ←');
    prev.type = next.type = 'button';
    rail.appendChild(prev); rail.appendChild(folio); rail.appendChild(next);
    root.appendChild(rail);
    stage.appendChild(root);

    function restack() { leaves.forEach(function (l, i) { l.style.zIndex = String(leaves.length - i); }); }
    function paint() {
      leaves.forEach(function (l, i) { l.classList.toggle('turned', i < page); });
      folio.textContent = (page === 0 ? 'cover' : (spread && leaves.indexOf(spread) === page ? 'entry' : 'contents ' + page)) +
        '   ' + (page + 1) + '/' + leaves.length;
      prev.disabled = page === 0; next.disabled = page === leaves.length - 1;
    }
    var settle = 0;
    function go(p) {
      p = Math.max(0, Math.min(leaves.length - 1, p));
      if (p === page) return;
      var moving = leaves[Math.min(page, p)];
      restack();
      moving.style.zIndex = String(leaves.length + 4);
      page = p; paint();
      clearTimeout(settle);
      settle = setTimeout(restack, 820);
    }
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
      if (e.key === 'Escape' && spread) closeSpread();
    }
    root.addEventListener('wheel', onWheel, { passive:true });
    addEventListener('keydown', onKey);
    restack(); paint();
    return { unmount: function () { removeEventListener('keydown', onKey); clearTimeout(settle); } };
  }
};

// ── terminal's detail: an overlay card, which is what a terminal does ────
function overlayCard(s) {
  var stage = document.getElementById('stage');
  var ov = el('div'); ov.id = 'ov'; ov.className = 'on';
  var bg = el('div'); bg.id = 'ovbg';
  bg.style.background = 'color-mix(in srgb, var(--m-ground,#000) 82%, transparent)';
  var card = el('div'); card.id = 'ovcard';
  card.style.cssText = 'background:var(--m-card);color:var(--m-ink);border:1px solid var(--m-line);border-radius:2px';
  var hd = el('div');
  hd.style.cssText = 'display:flex;justify-content:space-between;padding:7px 13px;font-size:10.5px;color:var(--m-dim);border-bottom:1px dashed var(--m-line)';
  hd.appendChild(el('span', null, '~/catalog/' + s.id));
  var x = el('button', null, 'x'); x.type = 'button';
  x.style.cssText = 'background:none;border:0;color:inherit;font:inherit;cursor:pointer';
  hd.appendChild(x); card.appendChild(hd);
  var b = el('div'); b.style.padding = '15px 13px';
  var t = el('div', null, s.nm); t.style.cssText = 'font-size:20px;color:var(--m-title);line-height:1.15';
  b.appendChild(t);
  var j = el('div', null, s.jp); j.style.cssText = 'font-size:11px;color:var(--m-dim);margin:4px 0 13px';
  b.appendChild(j);
  var p = el('div', null, 'ep:' + s.ep + '   ' + (s.hasManga ? 'vol:' + s.vol + '/' + s.tvol + ' · ch:' + s.ch + '/' + s.tch : '// no_source'));
  p.style.cssText = 'font-size:14px;font-variant-numeric:tabular-nums;margin-bottom:13px';
  b.appendChild(p);
  b.appendChild(stripEl(s.seq, '18px'));
  var leg = el('div');
  leg.style.cssText = 'display:flex;gap:5px;justify-content:flex-end;margin-top:8px;flex-wrap:wrap';
  TYPES.forEach(function (n, i) {
    var sp = el('span', null, n);
    sp.style.cssText = 'font-size:9.5px;padding:2px 6px;border-radius:2px;color:var(' + CVAR[i] +
      ');background:color-mix(in srgb,var(' + CVAR[i] + ') 13%,transparent)';
    leg.appendChild(sp);
  });
  b.appendChild(leg);
  if (s.tail > 0) {
    var g = el('div', null, '// not_yet_animated  ch:' + (s.ch + 1) + '–' + s.tch + '  (' + s.tail + ')');
    g.style.cssText = 'margin-top:13px;padding:7px 10px;border:1px dashed var(--m-line);color:var(--m-dim);font-size:10.5px';
    b.appendChild(g);
  }
  card.appendChild(b);
  ov.appendChild(bg); ov.appendChild(card);
  stage.appendChild(ov);
  function close() { ov.remove(); removeEventListener('keydown', esc); }
  function esc(e) { if (e.key === 'Escape') close(); }
  bg.addEventListener('click', close); x.addEventListener('click', close);
  addEventListener('keydown', esc);
}
