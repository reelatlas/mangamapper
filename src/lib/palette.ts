// Palette math for the theming work — pure, unit-tested, no DOM.
//
// WHY THIS EXISTS. The five `--type-*` colours carry episode type on an 18px
// strip with 1px gaps. If two of them collapse — for anyone, under any vision
// type — the strip silently lies about the data, which is the one thing the
// product promises never to do. `syntax_v1` was already validator-tuned for
// exactly this reason ("the original syntax hues failed as-is"), but the check
// lived outside the repo and had to be re-argued every time. Now it's a gate.
//
// THE BAR IS RELATIVE, NOT ABSOLUTE. `syntax_v1` ships and is accepted, so its
// own worst pair separation IS the passing mark. That keeps the check valid no
// matter which ΔE metric or dichromat model you prefer — swap either and the
// control moves with the candidates. (DESIGN_SYSTEM.md records a worst CVD ΔE
// of 9.6 from an earlier external pipeline; that number is NOT reproducible
// here and should not be used as a threshold — see `SYNTAX_V1` below.)

export type Rgb = readonly [number, number, number];
export type Lab = readonly [number, number, number];

/** Normal vision plus the three dichromacies. */
export type Vision = 'normal' | 'protan' | 'deutan' | 'tritan';

export const VISIONS: readonly Vision[] = ['normal', 'protan', 'deutan', 'tritan'];

/** The five episode types the strip encodes, in token order. */
export const TYPE_ROLES = ['canon', 'mixed', 'filler', 'anime', 'manga'] as const;
export type TypeRole = (typeof TYPE_ROLES)[number];

// ── conversion ────────────────────────────────────────────────────────────

/** HSL in the same units the CSS tokens use: h 0-360, s/l 0-100. */
export function hslToRgb(h: number, s: number, l: number): Rgb {
  const sat = s / 100;
  const lig = l / 100;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number): number => {
    const k = (n + h / 30) % 12;
    return 255 * (lig - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
  };
  return [f(0), f(8), f(4)];
}

/** Parses `#rgb` and `#rrggbb`. Throws on anything else — a silent 0,0,0 here
 *  would turn a typo into a passing score. */
export function hexToRgb(hex: string): Rgb {
  const raw = hex.trim().replace(/^#/, '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`not a hex colour: ${hex}`);
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

const clamp255 = (v: number): number => Math.max(0, Math.min(255, v));

export function rgbToHex(rgb: Rgb): string {
  return (
    '#' +
    rgb
      .map((v) => Math.round(clamp255(v)).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

const toLinear = (c: number): number => {
  const v = clamp255(c) / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const fromLinear = (c: number): number =>
  255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

// ── contrast (WCAG) ───────────────────────────────────────────────────────

export function relativeLuminance(rgb: Rgb): number {
  return 0.2126 * toLinear(rgb[0]) + 0.7152 * toLinear(rgb[1]) + 0.0722 * toLinear(rgb[2]);
}

/** WCAG contrast ratio, 1..21. Order-independent. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
}

// ── dichromat simulation (Viénot–Brettel–Mollon, in LMS) ──────────────────

type Matrix = readonly (readonly [number, number, number])[];

const RGB_TO_LMS: Matrix = [
  [0.31399, 0.63951, 0.04649],
  [0.15537, 0.75789, 0.0867],
  [0.01775, 0.10945, 0.87259],
];
const LMS_TO_RGB: Matrix = [
  [5.47221, -4.6419, 0.16963],
  [-1.1252, 2.29317, -0.1678],
  [0.0298, -0.19318, 1.16364],
];
const DICHROMAT: Record<Exclude<Vision, 'normal'>, Matrix> = {
  protan: [
    [0, 1.05118294, -0.05116099],
    [0, 1, 0],
    [0, 0, 1],
  ],
  deutan: [
    [1, 0, 0],
    [0.9513092, 0, 0.04866992],
    [0, 0, 1],
  ],
  tritan: [
    [1, 0, 0],
    [0, 1, 0],
    [-0.86744736, 1.86727089, 0],
  ],
};

const apply = (m: Matrix, v: Rgb): Rgb =>
  [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ] as const;

/** How `rgb` appears to a viewer with the given vision type. */
export function simulateVision(rgb: Rgb, vision: Vision): Rgb {
  if (vision === 'normal') return rgb;
  const linear = [toLinear(rgb[0]), toLinear(rgb[1]), toLinear(rgb[2])] as const;
  const simulated = apply(DICHROMAT[vision], apply(RGB_TO_LMS, linear));
  const back = apply(LMS_TO_RGB, simulated);
  return [clamp255(fromLinear(back[0])), clamp255(fromLinear(back[1])), clamp255(fromLinear(back[2]))];
}

// ── perceptual difference ─────────────────────────────────────────────────

/** sRGB → CIE L*a*b* (D65). */
export function rgbToLab(rgb: Rgb): Lab {
  const r = toLinear(rgb[0]);
  const g = toLinear(rgb[1]);
  const b = toLinear(rgb[2]);
  const f = (t: number): number => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047);
  const y = f(0.2126 * r + 0.7152 * g + 0.0722 * b);
  const z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

/** CIE76 — plain euclidean distance in Lab. Cheap, and over-reports
 *  differences in saturated colours. Kept because it is easy to reason about. */
export function deltaE76(a: Rgb, b: Rgb): number {
  const p = rgbToLab(a);
  const q = rgbToLab(b);
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

/** CIEDE2000 — the modern perceptual metric, and the one to prefer.
 *  Reports smaller numbers than CIE76 for the same pair. */
export function deltaE2000(a: Rgb, b: Rgb): number {
  const [L1, a1, b1] = rgbToLab(a);
  const [L2, a2, b2] = rgbToLab(b);
  const RAD = Math.PI / 180;
  const DEG = 180 / Math.PI;

  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cbar = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7)));
  const ap1 = (1 + G) * a1;
  const ap2 = (1 + G) * a2;
  const Cp1 = Math.hypot(ap1, b1);
  const Cp2 = Math.hypot(ap2, b2);

  const hue = (bb: number, aa: number): number => {
    if (bb === 0 && aa === 0) return 0;
    const h = Math.atan2(bb, aa) * DEG;
    return h < 0 ? h + 360 : h;
  };
  const hp1 = hue(b1, ap1);
  const hp2 = hue(b2, ap2);

  const dLp = L2 - L1;
  const dCp = Cp2 - Cp1;
  let dhp = 0;
  if (Cp1 * Cp2 !== 0) {
    dhp = hp2 - hp1;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin((dhp / 2) * RAD);

  const Lbar = (L1 + L2) / 2;
  const Cbarp = (Cp1 + Cp2) / 2;
  let hbarp: number;
  if (Cp1 * Cp2 === 0) {
    hbarp = hp1 + hp2;
  } else {
    hbarp = (hp1 + hp2) / 2;
    if (Math.abs(hp1 - hp2) > 180) hbarp += hp1 + hp2 < 360 ? 180 : -180;
  }

  const T =
    1 -
    0.17 * Math.cos((hbarp - 30) * RAD) +
    0.24 * Math.cos(2 * hbarp * RAD) +
    0.32 * Math.cos((3 * hbarp + 6) * RAD) -
    0.2 * Math.cos((4 * hbarp - 63) * RAD);

  const dTheta = 30 * Math.exp(-(((hbarp - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cbarp ** 7 / (Cbarp ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lbar - 50) ** 2) / Math.sqrt(20 + (Lbar - 50) ** 2);
  const Sc = 1 + 0.045 * Cbarp;
  const Sh = 1 + 0.015 * Cbarp * T;
  const Rt = -Math.sin(2 * dTheta * RAD) * Rc;

  return Math.sqrt(
    (dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh),
  );
}

// ── the strip test ────────────────────────────────────────────────────────

export interface VisionResult {
  vision: Vision;
  /** Smallest separation found between any two of the five types. */
  deltaE: number;
  /** The two roles that were closest, e.g. `['canon', 'mixed']`. */
  pair: readonly [TypeRole, TypeRole];
}

export interface PaletteReport {
  byVision: readonly VisionResult[];
  /** The single worst result across all vision types — the score that matters. */
  worst: VisionResult;
}

export type Metric = (a: Rgb, b: Rgb) => number;

/**
 * Score a five-colour type palette by its WORST pair separation across normal
 * vision and all three dichromacies. Worst-case is the right objective: a
 * palette is only as honest as its most confusable pair.
 */
export function scorePalette(colors: readonly Rgb[], metric: Metric = deltaE2000): PaletteReport {
  if (colors.length !== TYPE_ROLES.length) {
    throw new Error(`expected ${TYPE_ROLES.length} colours, got ${colors.length}`);
  }
  const byVision = VISIONS.map((vision): VisionResult => {
    const seen = colors.map((c) => simulateVision(c, vision));
    let deltaE = Infinity;
    let pair: readonly [TypeRole, TypeRole] = [TYPE_ROLES[0], TYPE_ROLES[1]];
    for (let i = 0; i < seen.length; i++) {
      for (let j = i + 1; j < seen.length; j++) {
        const d = metric(seen[i], seen[j]);
        if (d < deltaE) {
          deltaE = d;
          pair = [TYPE_ROLES[i], TYPE_ROLES[j]];
        }
      }
    }
    return { vision, deltaE, pair };
  });
  const worst = byVision.reduce((a, b) => (b.deltaE < a.deltaE ? b : a));
  return { byVision, worst };
}

/**
 * The shipping palette (`src/index.css`, syntax_v1, 2026-08-21). It is the
 * control: whatever it scores is by definition passable, because it is live.
 * Any candidate is judged as a percentage of this, never against a constant.
 */
export const SYNTAX_V1: readonly Rgb[] = [
  hslToRgb(199, 72, 62), // canon
  hslToRgb(38, 80, 62), // mixed
  hslToRgb(330, 62, 64), // filler
  hslToRgb(256, 62, 64), // anime
  hslToRgb(147, 55, 36), // manga
];

/** The bar a candidate palette has to reach, under the given metric. */
export function controlBar(metric: Metric = deltaE2000): number {
  return scorePalette(SYNTAX_V1, metric).worst.deltaE;
}

export type Verdict = 'pass' | 'marginal' | 'fail';

export interface Judgement extends PaletteReport {
  bar: number;
  /** Candidate's worst as a fraction of the control's worst. 1 = parity. */
  ratio: number;
  verdict: Verdict;
}

/**
 * Full judgement of a candidate against the shipping palette.
 * `pass` at parity or better; `marginal` down to 70% of the control; `fail`
 * below that — a palette at half the control's separation is not a tuning
 * problem, it is the wrong palette.
 */
export function judgePalette(colors: readonly Rgb[], metric: Metric = deltaE2000): Judgement {
  const report = scorePalette(colors, metric);
  const bar = controlBar(metric);
  const ratio = report.worst.deltaE / bar;
  const verdict: Verdict = ratio >= 1 ? 'pass' : ratio >= 0.7 ? 'marginal' : 'fail';
  return { ...report, bar, ratio, verdict };
}
