// Derive the PLAIN theme's three variants. Plain is the UX-only theme: the
// constraint that drives it is READABILITY, so the contrast floor is a hard
// constraint and separation is the objective — the same hill-climb as
// optimize.mjs, re-pointed at three new grounds.
//
//   light    ground #FFFFFF, floor 4.5  (AA text on white)
//   dark     ground #16181C, floor 4.5  (AA text on near-black)
//   contrast ground #FFFFFF, floor 7.0  (AAA — the accessibility ceiling)
//
// Hand-picked candidates all failed: five hand-chosen hues collapse on
// tritan canon/manga (blue vs teal) or protan canon/anime (blue vs purple).
// The search finds the spread; the bounds keep the semantics.

import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./striptest.mjs', import.meta.url), 'utf8');
const mod = await import('data:text/javascript,' + encodeURIComponent(
  src.replace(/const ROLES[\s\S]*$/, '') +
  '\nexport { hsl, hex, cvd, dE00, lab, toLin };'
));
const { hsl, hex, cvd, dE00, toLin } = mod;

const ROLES = ['canon', 'mixed', 'filler', 'anime', 'manga'];
const KINDS = ['normal', 'protan', 'deutan', 'tritan'];
const BAR = 13.8;

const lum = rgb => .2126 * toLin(rgb[0]) + .7152 * toLin(rgb[1]) + .0722 * toLin(rgb[2]);
const contrast = (rgb, g) => {
  const [a, b] = [lum(rgb), lum(g)].sort((p, q) => q - p);
  return (a + .05) / (b + .05);
};

function score(defs, ground, floor) {
  const rgb = defs.map(d => hsl(...d));
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

const VARIANTS = {
  light: {
    ground: [255, 255, 255], floor: 4.5,
    note: 'ink on white; AA floor, the default',
    bounds: [
      { h: [198, 224], s: [40, 90], l: [24, 40] }, // canon  — blue
      { h: [28, 48],   s: [55, 95], l: [26, 38] }, // mixed  — amber/olive
      { h: [340, 366], s: [50, 90], l: [30, 44] }, // filler — crimson
      { h: [262, 292], s: [45, 85], l: [32, 48] }, // anime  — purple
      { h: [150, 178], s: [50, 95], l: [22, 34] }, // manga  — teal
    ],
  },
  dark: {
    ground: [22, 24, 28], floor: 4.5,
    note: 'the same hierarchy inverted; AA floor on near-black',
    bounds: [
      { h: [190, 216], s: [45, 85], l: [58, 76] },
      { h: [30, 50],   s: [50, 90], l: [56, 74] },
      { h: [346, 372], s: [55, 90], l: [58, 74] },
      { h: [262, 292], s: [45, 85], l: [62, 80] },
      { h: [148, 175], s: [45, 85], l: [50, 68] },
    ],
  },
  contrast: {
    ground: [255, 255, 255], floor: 7.0,
    note: 'AAA on white — the accessibility ceiling, not a style',
    bounds: [
      { h: [196, 228], s: [45, 100], l: [16, 30] },
      { h: [24, 48],   s: [60, 100], l: [18, 28] },
      { h: [338, 366], s: [55, 100], l: [22, 34] },
      { h: [260, 296], s: [50, 100], l: [22, 36] },
      { h: [148, 180], s: [55, 100], l: [16, 26] },
    ],
  },
};

const clamp = (v, [lo, hi]) => Math.max(lo, Math.min(hi, v));
const rnd = ([lo, hi]) => lo + Math.random() * (hi - lo);
const wrapHue = h => ((h % 360) + 360) % 360;

for (const [name, cfg] of Object.entries(VARIANTS)) {
  let best = null, bestScore = -1;
  for (let restart = 0; restart < 80; restart++) {
    let cur = cfg.bounds.map(b => [rnd(b.h), rnd(b.s), rnd(b.l)]);
    let curScore = score(cur.map(c => [wrapHue(c[0]), c[1], c[2]]), cfg.ground, cfg.floor);
    let step = 22;
    for (let iter = 0; iter < 3500; iter++) {
      const i = Math.floor(Math.random() * 5);
      const cand = cur.map(c => c.slice());
      const b = cfg.bounds[i];
      cand[i][0] = clamp(cand[i][0] + (Math.random() - .5) * step * 2, b.h);
      cand[i][1] = clamp(cand[i][1] + (Math.random() - .5) * step, b.s);
      cand[i][2] = clamp(cand[i][2] + (Math.random() - .5) * step, b.l);
      const s = score(cand.map(c => [wrapHue(c[0]), c[1], c[2]]), cfg.ground, cfg.floor);
      if (s > curScore) { cur = cand; curScore = s; }
      step = Math.max(1.5, step * 0.9993);
    }
    if (curScore > bestScore) { bestScore = curScore; best = cur; }
  }

  const defs = best.map(c => [wrapHue(c[0]), c[1], c[2]]);
  const rgb = defs.map(d => hsl(...d));
  console.log(`\n=== plain / ${name} ===`);
  console.log(`  (${cfg.note})`);
  for (let i = 0; i < 5; i++) {
    const [h, s, l] = defs[i];
    console.log(`   ${ROLES[i].padEnd(7)} ${hex(rgb[i])}  hsl(${h.toFixed(0)} ${s.toFixed(0)}% ${l.toFixed(0)}%)  contrast ${contrast(rgb[i], cfg.ground).toFixed(2)}`);
  }
  const pct = (bestScore / BAR * 100).toFixed(0);
  console.log(`  -> worst ΔE2000 ${bestScore.toFixed(1)} = ${pct}% of control  ::  ${bestScore >= BAR ? 'PASS' : 'SHORT'}`);
  console.log(`     hex: ${ROLES.map((r, i) => `'${hex(rgb[i])}'`).join(',')}`);
}
