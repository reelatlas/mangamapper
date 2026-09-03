// The strip test. Five episode types must stay distinguishable at 18px —
// for normal vision AND under the three dichromacies. Same bar syntax_v1
// cleared (worst CVD ΔE 9.6), so syntax_v1 runs as the control.
//
// Viénot-Brettel-Mollon LMS dichromat simulation + CIE76 ΔE in Lab.

const hsl = (h, s, l) => {
  s /= 100; l /= 100;
  const k = m => (m + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = m => 255 * (l - a * Math.max(-1, Math.min(k(m) - 3, 9 - k(m), 1)));
  return [f(0), f(8), f(4)];
};
const hex = rgb => '#' + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();

const toLin = c => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
const toSrgb = c => 255 * (c <= .0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - .055);

// sRGB → LMS (Hunt-Pointer-Estevez, D65)
const RGB2LMS = [[.31399, .63951, .04649], [.15537, .75789, .08670], [.01775, .10945, .87259]];
const LMS2RGB = [[5.47221, -4.6419, .16963], [-1.1252, 2.29317, -.1678], [.02980, -.19318, 1.16364]];
const mul = (m, v) => m.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);

const SIM = {
  protan: [[0, 1.05118294, -.05116099], [0, 1, 0], [0, 0, 1]],
  deutan: [[1, 0, 0], [.9513092, 0, .04866992], [0, 0, 1]],
  tritan: [[1, 0, 0], [0, 1, 0], [-.86744736, 1.86727089, 0]],
};
function cvd(rgb, kind) {
  if (kind === 'normal') return rgb;
  const lin = rgb.map(toLin);
  const lms = mul(RGB2LMS, lin);
  const sim = mul(SIM[kind], lms);
  return mul(LMS2RGB, sim).map(toSrgb);
}

// sRGB → CIE Lab (D65)
function lab(rgb) {
  const [r, g, b] = rgb.map(v => toLin(Math.max(0, Math.min(255, v))));
  let x = (.4124 * r + .3576 * g + .1805 * b) / .95047;
  let y = (.2126 * r + .7152 * g + .0722 * b) / 1.0;
  let z = (.0193 * r + .1192 * g + .9505 * b) / 1.08883;
  const f = t => t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  [x, y, z] = [f(x), f(y), f(z)];
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
const dE76 = (a, b) => { const p = lab(a), q = lab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };

// CIEDE2000 — the modern perceptual metric; gives smaller numbers than CIE76.
function dE00(rgbA, rgbB) {
  const [L1, a1, b1] = lab(rgbA), [L2, a2, b2] = lab(rgbB);
  const rad = Math.PI / 180, deg = 180 / Math.PI;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2);
  const Cb = (C1 + C2) / 2;
  const G = .5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const ap1 = (1 + G) * a1, ap2 = (1 + G) * a2;
  const Cp1 = Math.hypot(ap1, b1), Cp2 = Math.hypot(ap2, b2);
  const hp = (b, ap) => { if (b === 0 && ap === 0) return 0; const h = Math.atan2(b, ap) * deg; return h < 0 ? h + 360 : h; };
  const hp1 = hp(b1, ap1), hp2 = hp(b2, ap2);
  const dLp = L2 - L1, dCp = Cp2 - Cp1;
  let dhp = 0;
  if (Cp1 * Cp2 !== 0) {
    dhp = hp2 - hp1;
    if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin(dhp / 2 * rad);
  const Lbp = (L1 + L2) / 2, Cbp = (Cp1 + Cp2) / 2;
  let hbp;
  if (Cp1 * Cp2 === 0) hbp = hp1 + hp2;
  else {
    hbp = (hp1 + hp2) / 2;
    if (Math.abs(hp1 - hp2) > 180) hbp += (hp1 + hp2 < 360) ? 180 : -180;
  }
  const T = 1 - .17 * Math.cos((hbp - 30) * rad) + .24 * Math.cos(2 * hbp * rad)
            + .32 * Math.cos((3 * hbp + 6) * rad) - .20 * Math.cos((4 * hbp - 63) * rad);
  const dTh = 30 * Math.exp(-(((hbp - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7));
  const Sl = 1 + (.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2);
  const Sc = 1 + .045 * Cbp, Sh = 1 + .015 * Cbp * T;
  const Rt = -Math.sin(2 * dTh * rad) * Rc;
  return Math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2
                   + Rt * (dCp / Sc) * (dHp / Sh));
}

const ROLES = ['canon', 'mixed', 'filler', 'anime', 'manga'];

const PALETTES = {
  'syntax_v1 (control)': [[199,72,62],[38,80,62],[330,62,64],[256,62,64],[147,55,36]],
  'phosphor  (1 hue)':   [[40,100,62],[38,84,50],[36,68,38],[44,58,76],[38,55,27]],
  'blueprint':           [[193,80,76],[45,84,68],[15,80,69],[228,68,80],[163,48,57]],
  'daylight':            [[196,64,33],[39,100,33],[344,51,46],[262,39,47],[147,47,33]],
};

function evaluate(defs, metric) {
  const rgb = defs.map(d => hsl(...d));
  let worst = { d: Infinity };
  const rows = [];
  for (const kind of ['normal', 'protan', 'deutan', 'tritan']) {
    const sim = rgb.map(c => cvd(c, kind));
    let min = Infinity, pair = '';
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
      const d = metric(sim[i], sim[j]);
      if (d < min) { min = d; pair = `${ROLES[i]}/${ROLES[j]}`; }
    }
    rows.push({ kind, min, pair });
    if (min < worst.d) worst = { d: min, kind, pair };
  }
  return { rgb, rows, worst };
}

for (const [label, metric] of [['CIE76', dE76], ['CIEDE2000', dE00]]) {
  // The bar is the CONTROL's own worst score, not a number carried in from
  // elsewhere — syntax_v1 ships, so whatever it scores is by definition passable.
  const bar = evaluate(PALETTES['syntax_v1 (control)'], metric).worst.d;
  console.log(`\n\n######## ${label} — bar = syntax_v1's own worst = ${bar.toFixed(1)} ########`);
  for (const [name, defs] of Object.entries(PALETTES)) {
    const { rgb, rows, worst } = evaluate(defs, metric);
    console.log(`\n=== ${name} ===`);
    console.log('  ' + ROLES.map((r, i) => `${r}:${hex(rgb[i])}`).join('  '));
    for (const r of rows) {
      console.log(`  ${r.kind.padEnd(7)} worst pair ${r.pair.padEnd(15)} ΔE ${r.min.toFixed(1).padStart(5)}`);
    }
    const pct = (worst.d / bar * 100).toFixed(0);
    const verdict = worst.d >= bar ? 'PASS — at or above the shipping palette'
      : worst.d >= bar * .7 ? 'MARGINAL — below the shipping palette'
      : 'FAIL — nowhere near the shipping palette';
    console.log(`  -> worst ΔE ${worst.d.toFixed(1)} (${worst.kind}, ${worst.pair}) = ${pct}% of control :: ${verdict}`);
  }
}
