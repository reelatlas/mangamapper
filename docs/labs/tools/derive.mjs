// Chance operation → design parameters.
// The seed picks HUES and RELATIONSHIPS freely. The lightness/saturation
// BANDS are designer-set, so the roll can never produce mud or an
// unreadable pair — the same discipline as the --type-* validator.
// Documented slices, so the whole theme is reproducible from the string.

import { readFileSync } from 'node:fs';
const SEED = readFileSync(new URL('./seed.txt', import.meta.url), 'utf8').trim();
if (SEED.length !== 128) throw new Error(`seed must be 128 chars, got ${SEED.length}`);

const n = (i, len = 2) => parseInt(SEED.slice(i, i + len), 36);
const pick = (i, arr) => arr[n(i) % arr.length];

// ── theme level (shared by all three variants) — chars 0..15 ──────────
const SPATIAL = ['impossible stair', 'infinite regress', 'displaced scale', 'soft collapse'];
const MOTION  = ['persistence', 'drift', 'inversion', 'delay'];
const MATTER  = ['chalk', 'enamel', 'vapour', 'cut paper'];
const TYPEAX  = ['wide grotesque', 'display serif', 'warped mono', 'condensed'];
const HORIZON = ['void (dark)', 'bleached (light)'];
const ACCENT  = ['single spot', 'complementary pair', 'split triad'];

const law = {
  spatial:  pick(0, SPATIAL),
  motion:   pick(2, MOTION),
  matter:   pick(4, MATTER),
  type:     pick(6, TYPEAX),
  horizon:  pick(8, HORIZON),
  accent:   pick(10, ACCENT),
  // tuning constants from the tail
  radius:   n(112) % 5,
  gutter:   8 + (n(114) % 17),
  tone:     20 + (n(116) % 45),
  skew:     ((n(118) % 9) - 4) / 2,
};

// ── hsl→hex ───────────────────────────────────────────────────────────
function hex(h, s, l) {
  s /= 100; l /= 100;
  const k = m => (m + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = m => Math.round(255 * (l - a * Math.max(-1, Math.min(k(m) - 3, 9 - k(m), 1))));
  return '#' + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}
const rel = c => { const v = parseInt(c, 16) / 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
const lum = h => .2126 * rel(h.slice(1, 3)) + .7152 * rel(h.slice(3, 5)) + .0722 * rel(h.slice(5, 7));
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };

// ── variant blocks: 32 chars each ─────────────────────────────────────
const NAMES = ['A', 'B', 'C'];
const ROLES = ['canon', 'mixed', 'filler', 'anime', 'manga'];

const dark = law.horizon.startsWith('void');
const variants = NAMES.map((name, vi) => {
  const b = 16 + vi * 32;
  const groundH = n(b) % 360;
  const ground = hex(groundH, 8 + n(b + 2) % 14, dark ? 5 + n(b + 4) % 5 : 92 + n(b + 4) % 5);
  const card   = hex(groundH, 8 + n(b + 2) % 14, dark ? 9 + n(b + 4) % 5 : 96 + n(b + 4) % 4);
  const line   = hex(groundH, 6 + n(b + 2) % 12, dark ? 22 + n(b + 6) % 8 : 78 + n(b + 6) % 8);
  const ink    = hex(groundH, 6 + n(b + 8) % 10, dark ? 80 + n(b + 8) % 10 : 14 + n(b + 8) % 8);
  const dim    = hex(groundH, 6 + n(b + 8) % 10, dark ? 48 + n(b + 10) % 10 : 44 + n(b + 10) % 10);

  // five type hues — seed sets the hue wheel positions, bands keep them legible
  const types = ROLES.map((role, ri) => {
    const h = n(b + 12 + ri * 2) % 360;
    const s = dark ? 55 + n(b + 12 + ri * 2) % 30 : 58 + n(b + 12 + ri * 2) % 28;
    const l = dark ? 58 + n(b + 13 + ri * 2) % 12 : 34 + n(b + 13 + ri * 2) % 12;
    const c = hex(h, s, l);
    return { role, h, hex: c, cr: +ratio(c, ground).toFixed(2) };
  });

  // smallest hue separation across the five — the strip's real risk
  const hs = types.map(t => t.h).sort((a, z) => a - z);
  let minSep = 360;
  for (let i = 0; i < hs.length; i++) {
    const d = Math.abs(hs[(i + 1) % hs.length] - hs[i]);
    minSep = Math.min(minSep, Math.min(d, 360 - d));
  }

  return { name, slice: `${b}..${b + 31}`, ground, card, line, ink, dim, types, minSep };
});

// ── report ────────────────────────────────────────────────────────────
console.log('SEED', SEED, '\n');
console.log('── theme law (chars 0..15, shared by all variants) ──');
for (const [k, v] of Object.entries(law)) console.log(`  ${k.padEnd(9)} ${v}`);
console.log();
for (const v of variants) {
  console.log(`── variant ${v.name}  (chars ${v.slice}) ──`);
  console.log(`  ground ${v.ground}   card ${v.card}   line ${v.line}   ink ${v.ink}   dim ${v.dim}`);
  console.log(`  min hue separation: ${v.minSep}°  ${v.minSep < 25 ? '⚠ TOO CLOSE — needs a nudge' : 'ok'}`);
  for (const t of v.types) {
    console.log(`   ${t.role.padEnd(7)} ${t.hex}  h${String(t.h).padStart(3)}°  contrast ${String(t.cr).padStart(5)}${t.cr < 3 ? '  ⚠ under 3:1' : ''}`);
  }
  console.log();
}
