// The strip test as a runnable gate.
//
//   npx tsx scripts/design/check-palette.ts
//
// P5 — audits verify OUTCOMES, not intentions. So the shipping palette is read
// out of src/index.css at run time rather than copied here: if someone retunes
// a --type-* token and breaks a pair, this fails, and no one has to remember
// to update a duplicate. Candidate palettes for themes not yet shipped are
// reported but never block — they are exploration, not regressions.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  hslToRgb,
  judgePalette,
  deltaE2000,
  TYPE_ROLES,
  rgbToHex,
  type Rgb,
  type Judgement,
} from '../../src/lib/palette';

const HERE = dirname(fileURLToPath(import.meta.url));
const CSS = resolve(HERE, '../../src/index.css');

/** Pull the five `--type-*` tokens out of the stylesheet's `:root` block. */
function readShippingPalette(): Rgb[] {
  const css = readFileSync(CSS, 'utf8');
  return TYPE_ROLES.map((role) => {
    const match = css.match(
      new RegExp(`--type-${role}\\s*:\\s*([\\d.]+)\\s+([\\d.]+)%\\s+([\\d.]+)%`),
    );
    if (!match) throw new Error(`--type-${role} not found in ${CSS}`);
    return hslToRgb(Number(match[1]), Number(match[2]), Number(match[3]));
  });
}

interface Candidate {
  name: string;
  note: string;
  colors: Rgb[];
  /**
   * A variant Sean has ruled ships despite scoring below the bar. The score is
   * still reported in full — a deviation is a cost accepted in the open, not a
   * check switched off.
   */
  deviation?: string;
}

// Theme variants under exploration. Reported, never blocking.
const CANDIDATES: Candidate[] = [
  {
    name: 'terminal / phosphor',
    note: 'strict monochrome — one hue, five intensities',
    deviation:
      'RULED 2026-09-02: ships as a deliberate monochrome aesthetic. canon/mixed is ' +
      'not separable in one hue and texture cannot substitute — that channel encodes ' +
      'zone (run/hatch/out), which changes behaviour and outranks type.',
    colors: [
      hslToRgb(40, 100, 62),
      hslToRgb(38, 84, 50),
      hslToRgb(36, 68, 38),
      hslToRgb(44, 58, 76),
      hslToRgb(38, 55, 27),
    ],
  },
  {
    name: 'terminal / phosphor duotone',
    note:
      'amber + cold blue-white. The second hue MUST be cold: blue-yellow is the axis ' +
      'dichromats retain. Amber+green scores 56%, three phosphors 40% — worse than mono.',
    colors: [
      hslToRgb(40, 100, 64),
      hslToRgb(38, 78, 43),
      hslToRgb(200, 25, 78),
      hslToRgb(44, 50, 84),
      hslToRgb(205, 30, 46),
    ],
  },
  {
    name: 'terminal / blueprint',
    note: 're-derived 2026-09-02',
    colors: [
      hslToRgb(185, 78, 74),
      hslToRgb(55, 75, 60),
      hslToRgb(8, 78, 56),
      hslToRgb(265, 41, 58),
      hslToRgb(160, 35, 48),
    ],
  },
  {
    name: 'plain / light',
    note:
      'The UX-only theme. Derived by docs/labs/tools/plain-palette.mjs, which ' +
      'inverts the usual objective: the contrast floor is a HARD constraint ' +
      '(4.5:1 on white, AA) and separation is what the search maximises, ' +
      'because in plain every colour is also used as label text. Nine ' +
      'hand-picked five-hue sets were tried first and all failed — they ' +
      'collapse on tritan canon/manga (blue vs teal) or protan canon/anime ' +
      '(blue vs purple).',
    colors: [
      hslToRgb(213, 45, 24),
      hslToRgb(37, 75, 36),
      hslToRgb(345, 73, 30),
      hslToRgb(271, 82, 48),
      hslToRgb(174, 69, 30),
    ],
  },
  {
    name: 'plain / dark',
    note: 'same hierarchy inverted; 4.5:1 floor against #16181C',
    colors: [
      hslToRgb(216, 85, 58),
      hslToRgb(39, 90, 57),
      hslToRgb(346, 75, 58),
      hslToRgb(262, 47, 80),
      hslToRgb(159, 60, 68),
    ],
  },
  {
    name: 'plain / contrast',
    note:
      'AAA on white — a 7:1 floor on all five. This is the accessibility ' +
      'ceiling variant, not a style: it exists to prove the theme survives ' +
      'the strictest legibility constraint without dropping to monochrome.',
    colors: [
      hslToRgb(228, 78, 16),
      hslToRgb(46, 90, 23),
      hslToRgb(345, 69, 22),
      hslToRgb(271, 100, 36),
      hslToRgb(177, 100, 20),
    ],
  },
  {
    name: 'terminal / daylight',
    note: 're-derived 2026-09-02',
    colors: [
      hslToRgb(210, 45, 26),
      hslToRgb(40, 77, 32),
      hslToRgb(339, 74, 32),
      hslToRgb(270, 70, 46),
      hslToRgb(172, 81, 27),
    ],
  },
];

const pct = (n: number): string => `${Math.round(n * 100)}%`;
const MARK: Record<Judgement['verdict'], string> = {
  pass: 'PASS',
  marginal: 'MARGINAL',
  fail: 'FAIL',
};

function wrap(text: string, indent: string, width = 76): string {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && line.length + word.length + 1 > width) {
      out.push(indent + line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) out.push(indent + line);
  return out.join('\n');
}

function report(c: Candidate): Judgement {
  const j = judgePalette(c.colors, deltaE2000);
  console.log(`\n${c.name}`);
  console.log(wrap(c.note, '  '));
  console.log(`  ${TYPE_ROLES.map((r, i) => `${r}:${rgbToHex(c.colors[i])}`).join('  ')}`);
  for (const v of j.byVision) {
    console.log(
      `    ${v.vision.padEnd(7)} worst ${v.pair.join('/').padEnd(14)} ΔE ${v.deltaE.toFixed(1).padStart(5)}`,
    );
  }
  const mark = c.deviation ? 'DOCUMENTED DEVIATION' : MARK[j.verdict];
  console.log(
    `  → ΔE ${j.worst.deltaE.toFixed(1)} (${j.worst.vision}, ${j.worst.pair.join('/')}) ` +
      `= ${pct(j.ratio)} of control :: ${mark}`,
  );
  if (c.deviation) console.log(wrap(c.deviation, '    '));
  return j;
}

const shipping = readShippingPalette();
console.log('Strip test — five episode types, normal vision + three dichromacies.');
console.log(`Bar = the shipping palette's own worst pair (ΔE2000 ${judgePalette(shipping).bar.toFixed(1)}).`);

const live = report({
  name: 'SHIPPING (src/index.css :root)',
  note: 'the control — read live, not copied',
  colors: shipping,
});

for (const c of CANDIDATES) report({ ...c, name: `CANDIDATE ${c.name}` });

// Only the live palette can fail the build. Candidates are exploration.
if (live.verdict === 'fail') {
  console.error('\nFAIL: the shipping --type-* palette has two confusable episode types.');
  process.exit(1);
}
console.log('\nOK: the shipping palette holds.');
