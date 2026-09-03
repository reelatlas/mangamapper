// ─────────────────────────────────────────────────────────────────────────
// TERMINAL — a PAGER over a buffer, not a scrolling page.
// The frame is measured in COLUMNS (ch), because that is what a terminal is:
// 100×N, stated in the header, and it does not grow with the browser.
// Rows PRINT on arrival — stepped, no easing, the grammar already ruled in
// `card-print`. A block cursor holds the selection, j/k walk, space pages,
// g/G jump, and the status line is `less`.
// ATMOS (layer 3) = the glass: scanlines, bloom, vignette.
// ─────────────────────────────────────────────────────────────────────────
THEMES.terminal = {
  variants: {
    current:   { label:'current', tok:{ '--m-ground':'#12141A','--m-card':'#171A20','--m-line':'#3A3E45','--m-ink':'#C9D1D9','--m-dim':'#7E8894','--m-title':'#58E08A','--m-bloom':'0 0 6px',
                 '--c1':'#58B8E4','--c2':'#ECB351','--c3':'#DC6AA3','--c4':'#896ADC','--c5':'#298E57' } },
    phosphor:  { label:'phosphor', tok:{ '--m-ground':'#0B0A07','--m-card':'#100D08','--m-line':'#2B2110','--m-ink':'#FFCE73','--m-dim':'#8A6A22','--m-title':'#FFB000','--m-bloom':'0 0 8px',
                 '--c1':'#FFBE3D','--c2':'#EB9C14','--c3':'#A36E1F','--c4':'#E5D29E','--c5':'#6B4F1F' } },
    duotone:   { label:'duotone', tok:{ '--m-ground':'#0B0A07','--m-card':'#100D08','--m-line':'#2B2110','--m-ink':'#FFCE73','--m-dim':'#8A6A22','--m-title':'#FFB000','--m-bloom':'0 0 8px',
                 '--c1':'#FFC247','--c2':'#C38418','--c3':'#B9CCD5','--c4':'#EBE0C2','--c5':'#527B98' } },
    blueprint: { label:'blueprint', tok:{ '--m-ground':'#0A2740','--m-card':'#0C2E4A','--m-line':'#21587C','--m-ink':'#CDE7F5','--m-dim':'#5E8FAD','--m-title':'#89E8F0','--m-bloom':'0 0 7px',
                 '--c1':'#89E8F0','--c2':'#E6D94C','--c3':'#E64F37','--c4':'#8D68C0','--c5':'#50A589' } },
    daylight:  { label:'daylight', tok:{ '--m-ground':'#F6F1E4','--m-card':'#FBF8F0','--m-line':'#CFC5AC','--m-ink':'#3A3527','--m-dim':'#8A8069','--m-title':'#244260','--m-bloom':'0 0 0',
                 '--c1':'#244260','--c2':'#906713','--c3':'#8E153F','--c4':'#7523C7','--c5':'#0D7D6E' } }
  },
  mount: function (stage, list) {
    var root = el('div', 't-terminal');
    var term = el('div', 'term');
    var head = el('div', 'termhead');
    var body = el('div', 'termbody');
    var stat = el('div', 'termstatus');
    term.appendChild(head); term.appendChild(body); term.appendChild(stat);
    root.appendChild(term);
    root.appendChild(el('div', 'crt'));       // layer 3 — the glass
    stage.appendChild(root);

    var sel = 0, ROWH = 22;
    var rowEls = [];
    var frag = document.createDocumentFragment();
    list.forEach(function (s, i) {
      var b = el('button', 'row'); b.type = 'button';
      b.appendChild(el('span', 'cur', '\\u2588'));    // the block cursor
      b.appendChild(el('span', 'ix', i + 1));
      var nm = el('span', 'nm', s.nm);
      nm.appendChild(el('i', null, s.jp));
      b.appendChild(nm);
      b.appendChild(stripEl(s.seq));
      b.appendChild(el('span', 'num', 'ep:' + s.ep + ' ' + pos(s)));
      // PRINT: output arrives stepped, and only the first screenful staggers —
      // a terminal does not take four seconds to draw 343 lines
      if (i < 46) b.style.animationDelay = (i * 7) + 'ms';
      else b.classList.add('nodelay');
      b.addEventListener('click', function () { sel = i; paintSel(); overlayCard(s); });
      rowEls.push(b); frag.appendChild(b);
    });
    body.appendChild(frag);

    function cols() {
      var probe = el('span', null, '0'.repeat(10));
      probe.style.cssText = 'position:absolute;visibility:hidden;font:inherit';
      term.appendChild(probe);
      var w = probe.getBoundingClientRect().width / 10;
      probe.remove();
      return Math.max(1, Math.round(term.clientWidth / w));
    }
    function paintHead() {
      head.textContent = '';
      head.appendChild(el('span', null, '~/catalog'));
      head.appendChild(el('span', null, cols() + '\\u00d7' + Math.round(body.clientHeight / ROWH) +
        '  \\u00b7  ' + list.length + ' series'));
    }
    function paintSel() {
      rowEls.forEach(function (r, i) { r.classList.toggle('on', i === sel); });
      paintStatus();
    }
    function paintStatus() {
      var max = body.scrollHeight - body.clientHeight;
      var pct = max > 0 ? Math.round(body.scrollTop / max * 100) : 100;
      stat.textContent = '';
      stat.appendChild(el('span', null, ':' + (list.length ? (sel + 1) : 0) + '/' + list.length));
      stat.appendChild(el('span', 'keys', 'j/k walk   space page   g/G ends   / search'));
      stat.appendChild(el('span', null, (max <= 0 ? 'ALL' : pct + '%')));
    }
    function reveal() {
      var r = rowEls[sel];
      if (r) r.scrollIntoView({ block:'nearest' });
    }
    function move(d) {
      if (!rowEls.length) return;
      sel = Math.max(0, Math.min(rowEls.length - 1, sel + d));
      paintSel(); reveal();
    }
    function onKey(e) {
      var q = document.getElementById('q');
      if (e.key === '/' && e.target !== q) { e.preventDefault(); q.focus(); q.select(); return; }
      if (e.target === q) { if (e.key === 'Escape') q.blur(); return; }
      var page = Math.max(1, Math.floor(body.clientHeight / ROWH) - 2);
      if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); move(page); }
      else if (e.key === 'b' || e.key === 'PageUp') { e.preventDefault(); move(-page); }
      else if (e.key === 'G') { e.preventDefault(); sel = rowEls.length - 1; paintSel(); reveal(); }
      else if (e.key === 'g') { e.preventDefault(); sel = 0; paintSel(); reveal(); }
      else if (e.key === 'Enter' && rowEls[sel]) { e.preventDefault(); overlayCard(list[sel]); }
    }
    addEventListener('keydown', onKey);
    body.addEventListener('scroll', paintStatus, { passive:true });
    addEventListener('resize', paintHead);
    requestAnimationFrame(function () { paintHead(); paintSel(); });
    return {
      unmount: function () { removeEventListener('keydown', onKey); removeEventListener('resize', paintHead); }
    };
  }
};
