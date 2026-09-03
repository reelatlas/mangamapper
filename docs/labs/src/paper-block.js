// ─────────────────────────────────────────────────────────────────────────
// PAPER THEATRE — rolled from a 128-char seed, not designed:
//   impossible stair · drift · cut paper · warped mono · void · 4px/9px/41%/2°
//
// The other three themes are one-dimensional — a list you travel along. This
// one is a STAGE you track sideways through. Flats are cut paper at different
// depths, and each plane eases toward your position at its OWN rate, so they
// never quite agree and the composition is always still settling. That is
// "drift" as a mechanic rather than a decoration.
//
// THE GUARDRAIL: surrealism lives in the chrome, never in the values. So the
// impossible stair is in the BACKDROP — the far plane loops forever — while
// the content plane is finite, ordered, and tells you exactly where you are.
// ─────────────────────────────────────────────────────────────────────────
THEMES.paper = {
  variants: {
    glasshouse: { label:'glasshouse', tok:{
      '--m-ground':'#171A14','--m-card':'#21251D','--m-line':'#383B35','--m-ink':'#D6DAD2',
      '--m-dim':'#808C73','--m-title':'#B1D45E','--m-sep':'0 0',
      '--c1':'#5EA3D4','--c2':'#5CCC6F','--c3':'#DEAC73','--c4':'#B581DA','--c5':'#B1D45E' } },
    fairground: { label:'fairground', tok:{
      '--m-ground':'#141A16','--m-card':'#1C2620','--m-line':'#3E4741','--m-ink':'#CDD5D0',
      '--m-dim':'#7B8E82','--m-title':'#6DCAE3','--m-sep':'0 0',
      '--c1':'#6DCAE3','--c2':'#C96BE1','--c3':'#E2658E','--c4':'#8585E0','--c5':'#B0E24B' } },
    // the roll dealt this one two identical hues; fixing it by the anaglyph's
    // own logic put `mixed` on the magenta that red and cyan actually make
    anaglyph: { label:'anaglyph', tok:{
      '--m-ground':'#0E0C0B','--m-card':'#191514','--m-line':'#544240','--m-ink':'#D5CECD',
      '--m-dim':'#8E7D7B','--m-title':'#E75064','--m-sep':'1.5px 0',
      '--c1':'#E75064','--c2':'#DC6ADC','--c3':'#A67EDD','--c4':'#5CC6E0','--c5':'#4DCB97' } }
  },
  mount: function (stage, list) {
    var root = el('div', 't-paper');
    var cv = document.createElement('canvas'); cv.className = 'backdrop';
    var mid = el('div', 'plane mid');
    var content = el('div', 'plane content');
    var near = el('div', 'plane near');
    root.appendChild(cv); root.appendChild(mid); root.appendChild(content); root.appendChild(near);

    var rail = el('div', 'prail');
    var readout = el('div', 'pread');
    var track = el('div', 'ptrack'); var thumb = el('div', 'pthumb'); track.appendChild(thumb);
    var hint = el('div', 'phint', 'drag or scroll to track across the stage');
    rail.appendChild(readout); rail.appendChild(track); rail.appendChild(hint);
    root.appendChild(rail);
    stage.appendChild(root);

    var PITCH = 250, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var maxX = Math.max(1, (list.length - 1) * PITCH);
    var target = 0;
    // each plane has its own damping — this is why they never agree
    var planes = [
      { el:mid,     rate:0.34, k:0.055, x:0 },
      { el:content, rate:1.00, k:0.115, x:0 },
      { el:near,    rate:1.55, k:0.170, x:0 }
    ];

    // ── the flats ──
    var flats = [];
    list.forEach(function (s, i) {
      var f = el('button', 'flat'); f.type = 'button';
      // no two cuts are identical: height, lift and skew vary per flat
      var tall = 168 + ((i * 37) % 74);
      var lift = ((i * 53) % 120) - 60;
      var tilt = (((i * 29) % 40) - 20) / 10;          // ±2.0deg, the rolled skew
      f.style.left = (i * PITCH) + 'px';
      f.style.height = tall + 'px';
      f.style.transform = 'translateY(' + lift + 'px) rotate(' + tilt + 'deg)';
      f.appendChild(el('div', 'fnum', String(i + 1).padStart(3, '0')));
      f.appendChild(el('div', 'fnm', s.nm));
      f.appendChild(el('div', 'fjp', s.jp));
      f.appendChild(el('div', 'fspace'));
      f.appendChild(stripEl(s.seq, '10px'));
      f.appendChild(el('div', 'ffig', 'ep:' + s.ep + '  ' + pos(s)));
      f.addEventListener('click', function () { bring(i); });
      content.appendChild(f); flats.push(f);
    });
    // a few foreground cuts that occlude — pure material, no data
    for (var n = 0; n < 26; n++) {
      var g = el('div', 'cut');
      g.style.left = (n * 1180 + (n * 311) % 500) + 'px';
      g.style.height = (90 + (n * 47) % 150) + 'px';
      g.style.width = (40 + (n * 23) % 90) + 'px';
      g.style.transform = 'translateY(' + (((n * 71) % 200) - 100) + 'px) rotate(' + ((((n * 13) % 30) - 15) / 5) + 'deg)';
      near.appendChild(g);
    }
    for (var m = 0; m < 22; m++) {
      var h = el('div', 'cut soft');
      h.style.left = (m * 1420 + (m * 197) % 700) + 'px';
      h.style.height = (180 + (m * 61) % 220) + 'px';
      h.style.width = (150 + (m * 89) % 260) + 'px';
      h.style.transform = 'translateY(' + (((m * 43) % 260) - 130) + 'px)';
      mid.appendChild(h);
    }

    // ── the backdrop: an impossible stair that never resolves and never ends.
    //    It loops because it carries no information — the honest part is the
    //    readout below, which counts a finite catalog.
    var ctx = cv.getContext('2d');
    function size() {
      var r = Math.min(2, devicePixelRatio || 1);
      cv.width = stage.clientWidth * r; cv.height = stage.clientHeight * r;
      cv.style.width = stage.clientWidth + 'px'; cv.style.height = stage.clientHeight + 'px';
      ctx.setTransform(r, 0, 0, r, 0, 0);
    }
    size(); addEventListener('resize', size);

    function backdrop(off) {
      var W = cv.clientWidth, H = cv.clientHeight;
      ctx.clearRect(0, 0, W, H);
      if (!state.gfx) return;
      var cs = getComputedStyle(document.documentElement);
      var line = cs.getPropertyValue('--m-line').trim() || '#333';
      var SW = 96, SH = 30, o = -(off * 0.07) % (SW * 2);
      for (var pass = 0; pass < 2; pass++) {
        // two runs, one ascending and one descending, meeting in the middle —
        // read either way and the staircase never arrives anywhere
        ctx.globalAlpha = pass ? 0.30 : 0.16;
        ctx.fillStyle = line;
        var base = H * (pass ? 0.72 : 0.58);
        var dir = pass ? 1 : -1;
        for (var i = -2; i < Math.ceil(W / SW) + 3; i++) {
          var x = i * SW + o * (pass ? 1 : 0.62);
          var step = ((i % 8) + 8) % 8;
          var y = base + dir * (step - 4) * (SH * 0.34);
          ctx.fillRect(x, y, SW - 3, H - y);
        }
      }
      ctx.globalAlpha = 1;
    }

    // ── drift ──
    var raf = 0, dead = false;
    function tick() {
      if (dead) return;
      planes.forEach(function (p) {
        var want = -target * p.rate;
        p.x += (want - p.x) * (reduce ? 1 : p.k);
        p.el.style.transform = 'translate3d(' + p.x.toFixed(2) + 'px,0,0)';
      });
      backdrop(target);
      var i = Math.round(target / PITCH);
      readout.textContent = String(Math.min(list.length, i + 1)).padStart(3, '0') + ' / ' + list.length;
      thumb.style.left = (target / maxX * 100).toFixed(2) + '%';
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    function moveTo(x) { target = Math.max(0, Math.min(maxX, x)); }
    function onWheel(e) { moveTo(target + (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 1.6); }
    root.addEventListener('wheel', onWheel, { passive:true });

    var drag = null;
    root.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.flat') || e.target.closest('.prail')) return;
      drag = { x:e.clientX, t:target }; root.setPointerCapture(e.pointerId); root.classList.add('grabbing');
    });
    root.addEventListener('pointermove', function (e) { if (drag) moveTo(drag.t - (e.clientX - drag.x) * 1.5); });
    root.addEventListener('pointerup', function () { drag = null; root.classList.remove('grabbing'); });
    track.addEventListener('pointerdown', function (e) {
      var r = track.getBoundingClientRect();
      moveTo((e.clientX - r.left) / r.width * maxX);
    });
    function onKey(e) {
      if (e.target === document.getElementById('q')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); moveTo(target + PITCH); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); moveTo(target - PITCH); }
      if (e.key === 'Escape') dismiss();
    }
    addEventListener('keydown', onKey);

    // ── bringing a flat downstage: the theatre move. It comes forward, the
    //    rest of the stage recedes. No overlay, no modal — same space.
    var front = null;
    function bring(i) {
      if (front != null) { dismiss(); return; }
      front = i;
      moveTo(i * PITCH);
      root.classList.add('downstage');
      flats[i].classList.add('front');
      var s = list[i];
      var d = el('div', 'dossier');
      d.appendChild(el('div', 'dnum', String(i + 1).padStart(3, '0') + ' / ' + list.length));
      d.appendChild(el('div', 'dnm', s.nm));
      d.appendChild(el('div', 'djp', s.jp));
      var fig = el('div', 'dfig');
      fig.innerHTML = s.hasManga
        ? 'ep:<b>' + s.ep + '</b><span class="d">/—</span>  vol:<b>' + s.vol + '</b><span class="d">/' + s.tvol +
          '</span>  ch:<b>' + s.ch + '</b><span class="d">/' + s.tch + '</span>'
        : 'ep:<b>' + s.ep + '</b><span class="d">/—</span>  <span class="d">// no_source</span>';
      d.appendChild(fig);
      d.appendChild(stripEl(s.seq, '20px'));
      var leg = el('div', 'dleg');
      TYPES.forEach(function (t, k) {
        var sp = el('span', null, t);
        sp.style.color = 'var(' + CVAR[k] + ')';
        sp.style.background = 'color-mix(in srgb,var(' + CVAR[k] + ') 12%,transparent)';
        leg.appendChild(sp);
      });
      d.appendChild(leg);
      if (s.tail > 0) d.appendChild(el('div', 'dgap',
        'ch:' + (s.ch + 1) + '–' + s.tch + ' exists and has never been animated  (' + s.tail + ')'));
      var b = el('button', 'dback', 'back to the stage'); b.type = 'button';
      b.addEventListener('click', dismiss); d.appendChild(b);
      root.appendChild(d);
      requestAnimationFrame(function () { d.classList.add('on'); });
    }
    function dismiss() {
      if (front == null) return;
      flats[front].classList.remove('front');
      root.classList.remove('downstage');
      front = null;
      var d = root.querySelector('.dossier');
      if (d) { d.classList.remove('on'); setTimeout(function () { d.remove(); }, 420); }
    }

    return {
      unmount: function () {
        dead = true; cancelAnimationFrame(raf);
        removeEventListener('resize', size); removeEventListener('keydown', onKey);
      }
    };
  }
};
