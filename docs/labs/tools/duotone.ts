// If texture belongs to zone, phosphor cannot borrow it. So: is relaxing
// "one hue" to "two phosphors" enough? Real CRTs shipped as P1 green, P3
// amber, P4 white — a duotone is MORE historically honest than the
// single-hue constraint that broke the palette in the first place.
import {
  hslToRgb,
  judgePalette,
  rgbToHex,
  TYPE_ROLES,
  type Rgb,
} from '../../../src/lib/palette';

interface Candidate { name: string; hsl: [number, number, number][] }

const CANDIDATES: Candidate[] = [
  {
    // the failing baseline, for reference
    name: 'mono amber (current phosphor)',
    hsl: [[40, 100, 62], [38, 84, 50], [36, 68, 38], [44, 58, 76], [38, 55, 27]],
  },
  {
    // P3 amber + P1 green, the two commonest tube phosphors
    name: 'duotone amber + P1 green',
    hsl: [[40, 100, 66], [38, 80, 44], [140, 60, 62], [46, 55, 82], [138, 45, 33]],
  },
  {
    // amber + the colder P4-ish white-blue
    name: 'duotone amber + cold white',
    hsl: [[40, 100, 64], [38, 78, 43], [200, 25, 78], [44, 50, 84], [205, 30, 46]],
  },
  {
    // three phosphors — amber, green, and a rarer blue tube
    name: 'tritone amber + green + blue',
    hsl: [[40, 100, 66], [140, 58, 60], [200, 70, 62], [44, 52, 84], [138, 42, 32]],
  },
];

for (const c of CANDIDATES) {
  const colors: Rgb[] = c.hsl.map(([h, s, l]) => hslToRgb(h, s, l));
  const j = judgePalette(colors);
  console.log(`\n${c.name}`);
  console.log('  ' + TYPE_ROLES.map((r, i) => `${r}:${rgbToHex(colors[i])}`).join('  '));
  for (const v of j.byVision) {
    console.log(`    ${v.vision.padEnd(7)} ${v.pair.join('/').padEnd(14)} ΔE ${v.deltaE.toFixed(1).padStart(5)}`);
  }
  console.log(
    `  -> ΔE ${j.worst.deltaE.toFixed(1)} = ${Math.round(j.ratio * 100)}% of control :: ${j.verdict.toUpperCase()}`,
  );
}
