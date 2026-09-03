// Re-derive blueprint and daylight to clear the control's bar, while holding
// each variant's identity. Hill-climb on the objective the strip actually
// cares about: MAXIMISE THE WORST pair separation across normal + all three
// dichromacies. Identity is enforced as hard constraints, not as a penalty.

import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./striptest.mjs', import.meta.url), 'utf8');
// reuse the validated colour machinery verbatim rather than re-typing it
const mod = await import('data:text/javascript,' + encodeURIComponent(
  src.replace(/const ROLES[\s\S]*$/, '') +
  '\nexport { hsl, hex, cvd, dE00, lab, toLin };'
));
const { hsl, hex, cvd, dE00, toLin } = mod;

const ROLES = ['canon', 'mixed', 'filler', 'anime', 'manga'];
const KINDS = ['normal', 'protan', 'deutan', 'tritan'];
const BAR = 13.8; // syntax_v1's own worst, CIEDE2000

const relL = c => { const v = toLin(Math.max(0, Math.min(255, c))); return v; };
const lum = rgb => .2126 * relL(rgb[0]) + .7152 * relL(rgb[1]) + .0722 * relL(rgb[2]);
const contrast = (rgb, groundRgb) => {
  const [a, b] = [lum(rgb), lum(groundRgb)].sort((p, q) => q - p);
  return (a + .05) / (b + .05);
};

function score(defs, ground, floor) {
  const rgb = defs.map(d => hsl(...d));
  // hard floor: every type must stay readable on its own ground
  for (const c of rgb) if (contrast(c, ground) < floor) return -1;
  let worst = Infinity;
  for (const kind of KINDS) {
    const sim = rgb.map(c => cvd(c, kind));
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
      const d = dE00(sim[i], sim[j]);
      if (d < worst) worst = d;
    }
  }
  return worst;
}

// identity constraints per variant: [hueRanges, satRange, lightRange] per role
// Tightened after the first run over-optimised: saturation capped so nothing
// screams, lightness kept off the extremes so nothing goes near-white, and
// daylight's floor raised to 4.5 — ink on paper, not a dark theme's 3.5.
const VARIANTS = {
  blueprint: {
    ground: [10, 39, 64], // #0A2740
    floor: 3.5,
    note: 'cyan-dominant on Prussian; canon locked to the cyan family',
    bounds: [
      { h: [185, 200], s: [50, 78], l: [62, 74] }, // canon — identity-locked
      { h: [35, 55],   s: [55, 80], l: [58, 72] }, // mixed
      { h: [8, 24],    s: [55, 78], l: [56, 70] }, // filler — orange-red, not pure red
      { h: [265, 300], s: [40, 72], l: [58, 74] }, // anime — pushed off blue
      { h: [120, 160], s: [35, 68], l: [42, 58] }, // manga
    ],
  },
  daylight: {
    ground: [246, 241, 228], // #F6F1E4
    floor: 4.5,
    note: 'ink on warm paper; 4.5:1 floor, saturation held back',
    bounds: [
      { h: [190, 212], s: [45, 80], l: [26, 38] }, // canon
      { h: [28, 46],   s: [60, 88], l: [28, 38] }, // mixed
      { h: [335, 358], s: [45, 78], l: [32, 44] }, // filler
      { h: [258, 288], s: [38, 70], l: [34, 46] }, // anime
      { h: [145, 172], s: [45, 82], l: [24, 34] }, // manga
    ],
  },
};

const clamp = (v, [lo, hi]) => Math.max(lo, Math.min(hi, v));
const rnd = ([lo, hi]) => lo + Math.random() * (hi - lo);

for (const [name, cfg] of Object.entries(VARIANTS)) {
  let best = null, bestScore = -1;
  for (let restart = 0; restart < 60; restart++) {
    let cur = cfg.bounds.map(b => [rnd(b.h), rnd(b.s), rnd(b.l)]);
    let curScore = score(cur, cfg.ground, cfg.floor);
    let step = 22;
    for (let iter = 0; iter < 3000; iter++) {
      const i = Math.floor(Math.random() * 5);
      const cand = cur.map(c => c.slice());
      const b = cfg.bounds[i];
      cand[i][0] = clamp(cand[i][0] + (Math.random() - .5) * step * 2, b.h);
      cand[i][1] = clamp(cand[i][1] + (Math.random() - .5) * step, b.s);
      cand[i][2] = clamp(cand[i][2] + (Math.random() - .5) * step, b.l);
      const s = score(cand, cfg.ground, cfg.floor);
      if (s > curScore) { cur = cand; curScore = s; }
      step = Math.max(1.5, step * 0.9993);
    }
    if (curScore > bestScore) { bestScore = curScore; best = cur; }
  }

  const rgb = best.map(d => hsl(...d));
  console.log(`\n=== ${name} — re-derived ===`);
  console.log(`  (${cfg.note})`);
  for (let i = 0; i < 5; i++) {
    const [h, s, l] = best[i];
    console.log(`   ${ROLES[i].padEnd(7)} ${hex(rgb[i])}  hsl(${h.toFixed(0)} ${s.toFixed(0)}% ${l.toFixed(0)}%)  contrast ${contrast(rgb[i], cfg.ground).toFixed(2)}`);
  }
  const pct = (bestScore / BAR * 100).toFixed(0);
  console.log(`  -> worst ΔE2000 ${bestScore.toFixed(1)} = ${pct}% of control  ::  ${bestScore >= BAR ? 'PASS' : 'still short'}`);
  console.log(`     css: ${ROLES.map((r, i) => `--type-${r}: ${best[i][0].toFixed(0)} ${best[i][1].toFixed(0)}% ${best[i][2].toFixed(0)}%`).join('; ')};`);
}
