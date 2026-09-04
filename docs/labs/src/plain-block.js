// ══ PLAIN — the UX-only theme (layer 1) ═══════════════════════════════════
//
// The control condition. Every other theme asks "what should this feel like";
// plain asks only "what is the fastest path from 343 rows to the one number
// the user came for", and spends nothing on anything else.
//
// The thesis: the product question is "I finished episode N — where do I pick
// up the manga?" So READ FROM is a column, not a detail-view field. You should
// never have to click to get the answer; clicking is for provenance.
//
// What it deliberately does NOT have: motion, atmosphere, texture-as-mood,
// hover reveals, decorative type, a modal. Those aren't stripped for taste —
// each one costs either a scan-stop or the user's place in the list.
//
// Rules it still obeys, because they are layer 0 and not taste:
//   · texture encodes ZONE, never type — source_only stays hatched
//   · P6: an unknown is a dash and a reason, never a fabricated number
//   · the 2px paint floor
//
// One layer-0 bug is fixed here rather than reproduced: the source_only tail
// gets a MINIMUM painted width (labs README "open" #2 — a 6px hatch period
// means a tail under ~12px renders as flat dim colour, i.e. the honest-gap
// marker vanishes exactly when the gap is smallest).

THEMES.plain = {
  // ── layer 2 — colour only. Derived by tools/plain-palette.mjs under a hard
  //    contrast floor, because in THIS theme legibility is the constraint and
  //    separation is the objective. All three clear the shipping control bar:
  //    light 152%, dark 150%, contrast 127%.
  variants: {
    light: { label: 'light', tok: {
      '--m-ground': '#F4F5F7', '--m-card': '#FFFFFF', '--m-line': '#D8DCE1',
      '--m-ink': '#15181C', '--m-dim': '#5C646E', '--m-title': '#15181C',
      '--m-accent': '#1B4F91', '--m-hover': 'rgba(21,24,28,.05)', '--m-sel': 'rgba(27,79,145,.10)',
      '--c1': '#223A59', '--c2': '#A16C17', '--c3': '#841531', '--c4': '#7E16DF', '--c5': '#188177' } },
    dark: { label: 'dark', tok: {
      '--m-ground': '#0F1114', '--m-card': '#16181C', '--m-line': '#2C3138',
      '--m-ink': '#E7EAEE', '--m-dim': '#98A1AC', '--m-title': '#FFFFFF',
      '--m-accent': '#78B4F5', '--m-hover': 'rgba(231,234,238,.06)', '--m-sel': 'rgba(120,180,245,.13)',
      '--c1': '#3982EF', '--c2': '#F4AF2F', '--c3': '#E44469', '--c4': '#C6B4E4', '--c5': '#7CDEBC' } },
    contrast: { label: 'contrast', tok: {
      '--m-ground': '#FFFFFF', '--m-card': '#FFFFFF', '--m-line': '#000000',
      '--m-ink': '#000000', '--m-dim': '#2E2E2E', '--m-title': '#000000',
      '--m-accent': '#00308F', '--m-hover': 'rgba(0,0,0,.10)', '--m-sel': 'rgba(0,48,143,.16)',
      '--c1': '#091649', '--c2': '#6F5706', '--c3': '#5F1125', '--c4': '#5F00B8', '--c5': '#006661' } }
  },

  // ── the third axis — density. Not theme (behaviour), not variant (colour).
  //    Comfortable is the default because the product is read, not monitored.
  views: {
    comfortable: { label: 'comfortable', cls: '' },
    compact: { label: 'compact', cls: 'dense' }
  },

  mount: function (stage, list) {
    var UI = THEMES.plain.ui || (THEMES.plain.ui = { sort: 'ix', dir: 1, filter: 'all', open: null });

    // ── the answer. Three honest states, never a guessed number (P6) ──────
    function answer(s) {
      if (!s.hasManga) return { kind: 'none', head: '—', sub: 'no manga source' };
      if (s.tail > 0) return { kind: 'read', head: 'ch ' + (s.ch + 1), sub: s.tail + ' ahead' };
      return { kind: 'caught', head: '—', sub: 'fully adapted' };
    }

    // ── filters state what they DO, in words, and are never hidden ────────
    var FILTERS = [
      ['all', 'all', function () { return true; }],
      ['ahead', 'manga ahead', function (s) { return s.hasManga && s.tail > 0; }],
      ['caught', 'fully adapted', function (s) { return s.hasManga && s.tail === 0; }],
      ['none', 'no source', function (s) { return !s.hasManga; }]
    ];
    var COLS = [
      { k: 'ix', label: '#', cls: 'c-ix', sortable: true, num: true },
      { k: 'nm', label: 'Series', cls: 'c-nm', sortable: true },
      { k: 'ep', label: 'Episodes', cls: 'c-ep', sortable: true, num: true },
      { k: 'read', label: 'Read from', cls: 'c-read', sortable: true, num: true },
      { k: 'seq', label: 'Adaptation', cls: 'c-seq', sortable: false },
      { k: 'prog', label: 'Chapters', cls: 'c-prog', sortable: true, num: true }
    ];

    function sortVal(s, k, i) {
      if (k === 'ix') return i;
      if (k === 'nm') return s.nm.toLowerCase();
      if (k === 'ep') return s.ep;
      if (k === 'read') return s.hasManga ? s.tail : -1;    // "how much is waiting"
      if (k === 'prog') return s.hasManga ? s.tch : -1;
      return i;
    }

    function visible() {
      var f = FILTERS.filter(function (x) { return x[0] === UI.filter; })[0];
      var out = list.map(function (s, i) { return { s: s, i: i }; }).filter(function (r) { return f[2](r.s); });
      if (UI.sort !== 'ix' || UI.dir !== 1) {
        out.sort(function (a, b) {
          var x = sortVal(a.s, UI.sort, a.i), y = sortVal(b.s, UI.sort, b.i);
          return (x < y ? -1 : x > y ? 1 : 0) * UI.dir;
        });
      }
      return out;
    }

    var root = el('div', 't-plain' + (THEMES.plain.views[state.view] ? ' ' + THEMES.plain.views[state.view].cls : ''));

    // ── control bar: filters + a legend that is always on ─────────────────
    var ctl = el('div', 'ctl');
    var fset = el('div', 'filters');
    fset.setAttribute('role', 'group');
    fset.setAttribute('aria-label', 'Filter series');
    FILTERS.forEach(function (f) {
      var b = el('button', 'chip', f[1]); b.type = 'button';
      b.setAttribute('aria-pressed', String(UI.filter === f[0]));
      b.appendChild(el('span', 'cnt', list.filter(f[2]).length));
      b.addEventListener('click', function () { UI.filter = f[0]; UI.open = null; mount(); });
      fset.appendChild(b);
    });
    ctl.appendChild(fset);

    // the legend carries TEXT, not hue alone — colour is never the only channel
    var leg = el('div', 'legend');
    leg.setAttribute('aria-label', 'Episode types');
    TYPES.forEach(function (n, i) {
      var sp = el('span', 'lg');
      var sw = el('i', 'sw'); sw.style.background = fill(i);
      sp.appendChild(sw); sp.appendChild(document.createTextNode(n === 'manga' ? 'manga only' : n));
      leg.appendChild(sp);
    });
    ctl.appendChild(leg);
    root.appendChild(ctl);

    // ── the table. Real semantics: a screen reader gets a table, sorted ────
    var scroll = el('div', 'scroll');
    var tbl = el('table', 'tbl');
    var thead = el('thead'), htr = el('tr');
    COLS.forEach(function (c) {
      var th = el('th', c.cls);
      th.scope = 'col';
      if (!c.sortable) { th.textContent = c.label; htr.appendChild(th); return; }
      var on = UI.sort === c.k;
      th.setAttribute('aria-sort', on ? (UI.dir === 1 ? 'ascending' : 'descending') : 'none');
      var b = el('button', 'sortbtn'); b.type = 'button';
      b.appendChild(el('span', null, c.label));
      b.appendChild(el('span', 'arw', on ? (UI.dir === 1 ? '▲' : '▼') : ''));
      b.addEventListener('click', function () {
        if (UI.sort === c.k) UI.dir = -UI.dir; else { UI.sort = c.k; UI.dir = c.k === 'nm' ? 1 : -1; }
        UI.open = null; mount();
      });
      th.appendChild(b); htr.appendChild(th);
    });
    thead.appendChild(htr); tbl.appendChild(thead);

    var tbody = el('tbody');
    var rowsV = visible();
    var frag = document.createDocumentFragment();

    rowsV.forEach(function (r) {
      var s = r.s, a = answer(s);
      var tr = el('tr', 'r');
      tr.tabIndex = -1;
      tr.dataset.id = s.id;
      tr.setAttribute('aria-expanded', String(UI.open === s.id));

      tr.appendChild(el('td', 'c-ix', r.i + 1));

      var td = el('td', 'c-nm');
      td.appendChild(el('span', 'nm', s.nm));
      td.appendChild(el('span', 'jp', s.jp));
      if (s.status === 'airing') td.appendChild(el('span', 'tag', 'airing'));
      tr.appendChild(td);

      tr.appendChild(el('td', 'c-ep', s.ep));

      // THE ANSWER — the largest thing in the row, and the only accented one
      var rd = el('td', 'c-read ' + a.kind);
      rd.appendChild(el('span', 'big', a.head));
      rd.appendChild(el('span', 'sub', a.sub));
      tr.appendChild(rd);

      var sq = el('td', 'c-seq');
      sq.appendChild(plainStrip(s));
      tr.appendChild(sq);

      var pg = el('td', 'c-prog');
      if (s.hasManga) {
        pg.appendChild(el('span', 'big', String(s.ch)));
        pg.appendChild(el('span', 'sub', 'of ' + s.tch));
      } else {
        pg.appendChild(el('span', 'big dash', '—'));
        pg.appendChild(el('span', 'sub', 'anime-original'));
      }
      tr.appendChild(pg);

      tr.addEventListener('click', function () { toggle(s.id); });
      frag.appendChild(tr);

      // ── detail expands IN PLACE. A modal would cost the user their place
      //    in a 343-row list, which is the one thing browsing depends on.
      if (UI.open === s.id) frag.appendChild(detailRow(s, a));
    });

    tbody.appendChild(frag); tbl.appendChild(tbody);
    scroll.appendChild(tbl);
    root.appendChild(scroll);

    // ── status line: says what is on screen and why, in words ─────────────
    var foot = el('div', 'foot');
    foot.appendChild(el('span', null,
      rowsV.length === list.length
        ? rowsV.length + ' series'
        : 'showing ' + rowsV.length + ' of ' + list.length + ' series'));
    foot.appendChild(el('span', 'keys', '↑ ↓ move · enter open · esc close · / search'));
    root.appendChild(foot);

    stage.appendChild(root);

    // ── the strip, with the layer-0 tail bug fixed ────────────────────────
    function plainStrip(s) {
      var d = el('div', 'strip');
      var total = s.seq.reduce(function (a, x) { return a + x[1]; }, 0);
      s.seq.forEach(function (seg) {
        var i = el('i');
        i.style.flex = seg[1] + ' 1 0';
        i.style.background = fill(seg[0]);
        // zone is stated, not inferred from a background string — so an audit
        // can check the rule mechanically instead of parsing CSS (P5)
        i.dataset.zone = seg[0] === SOURCE_ONLY ? 'out' : 'run';
        i.dataset.type = TYPES[seg[0]];
        // a hatch needs two periods to READ as a hatch; below that the honest
        // gap silently becomes flat colour. Floor it instead.
        if (seg[0] === SOURCE_ONLY) i.style.minWidth = '14px';
        d.appendChild(i);
      });
      d.setAttribute('role', 'img');
      d.setAttribute('aria-label',
        s.hasManga
          ? s.ep + ' episodes, ' + s.filler + ' filler' + (s.tail > 0 ? ', ' + s.tail + ' chapters not yet animated' : '')
          : s.ep + ' episodes, anime-original');
      void total;
      return d;
    }

    function detailRow(s, a) {
      var tr = el('tr', 'det');
      var td = el('td'); td.colSpan = COLS.length;
      var box = el('div', 'detbox');

      var g = el('div', 'facts');
      function fact(k, v, cls) {
        var f = el('div', 'fact' + (cls ? ' ' + cls : ''));
        f.appendChild(el('dt', null, k)); f.appendChild(el('dd', null, v));
        return f;
      }
      g.appendChild(fact('Episodes', String(s.ep)));
      g.appendChild(fact('Filler', s.filler > 0 ? s.filler + ' episodes' : 'none'));
      g.appendChild(fact('Volumes', s.hasManga ? s.vol + ' of ' + s.tvol : '—'));
      g.appendChild(fact('Chapters', s.hasManga ? s.ch + ' of ' + s.tch : '—'));
      g.appendChild(fact('Status', s.status));
      g.appendChild(fact('Read from', a.head + (a.kind === 'read' ? '' : ' · ' + a.sub), 'hero'));
      box.appendChild(g);

      // the honest gap, stated rather than drawn
      if (s.hasManga && s.tail > 0) {
        box.appendChild(el('p', 'note',
          'Chapters ' + (s.ch + 1) + '–' + s.tch + ' have not been animated. ' +
          'Start at chapter ' + (s.ch + 1) + '.'));
      } else if (s.hasManga) {
        box.appendChild(el('p', 'note', 'The anime has adapted every published chapter. Nothing to read ahead.'));
      } else {
        box.appendChild(el('p', 'note', 'This series has no manga source — it is anime-original. There is no chapter to map to.'));
      }
      td.appendChild(box); tr.appendChild(td);
      return tr;
    }

    // ── keyboard: the whole point of a 343-row list ───────────────────────
    var cursor = -1;
    var trs = function () { return Array.prototype.slice.call(tbody.querySelectorAll('tr.r')); };
    function focusRow(n) {
      var all = trs();
      if (!all.length) return;
      cursor = Math.max(0, Math.min(all.length - 1, n));
      all.forEach(function (t, i) { t.classList.toggle('on', i === cursor); });
      all[cursor].focus({ preventScroll: true });
      all[cursor].scrollIntoView({ block: 'nearest' });
    }
    function toggle(id) {
      UI.open = UI.open === id ? null : id;
      var keep = cursor;
      mount();
      if (keep >= 0) setTimeout(function () {
        var m = document.querySelector('.t-plain tbody tr.r');
        if (m) focusRow(keep);
      }, 0);
    }
    function onKey(e) {
      var q = document.getElementById('q');
      if (e.key === '/' && e.target !== q) { e.preventDefault(); q.focus(); q.select(); return; }
      if (e.target === q) { if (e.key === 'Escape') { q.blur(); } return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); focusRow(cursor + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusRow(cursor - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusRow(0); }
      else if (e.key === 'End') { e.preventDefault(); focusRow(trs().length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') {
        var all = trs();
        if (cursor >= 0 && all[cursor]) { e.preventDefault(); toggle(all[cursor].dataset.id); }
      } else if (e.key === 'Escape' && UI.open) { e.preventDefault(); UI.open = null; mount(); }
    }
    addEventListener('keydown', onKey);

    return {
      unmount: function () { removeEventListener('keydown', onKey); }
    };
  }
};
