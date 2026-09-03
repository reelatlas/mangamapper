import { describe, it, expect } from 'vitest';
import {
  hslToRgb,
  hexToRgb,
  rgbToHex,
  contrastRatio,
  simulateVision,
  deltaE76,
  deltaE2000,
  scorePalette,
  judgePalette,
  controlBar,
  SYNTAX_V1,
  TYPE_ROLES,
  type Rgb,
} from './palette';

const BLACK: Rgb = [0, 0, 0];
const WHITE: Rgb = [255, 255, 255];

describe('conversion', () => {
  it('round-trips hex through rgb', () => {
    expect(rgbToHex(hexToRgb('#58B8E4'))).toBe('#58B8E4');
  });

  it('expands three-digit hex', () => {
    expect(hexToRgb('#0AF')).toEqual([0, 170, 255]);
  });

  it('rejects malformed hex rather than defaulting to black', () => {
    // a silent [0,0,0] would turn a typo into a passing score
    expect(() => hexToRgb('#zzz')).toThrow();
    expect(() => hexToRgb('58B8E')).toThrow();
  });

  it('converts the CSS token form of a shipping colour', () => {
    // --type-canon: 199 72% 62%
    expect(rgbToHex(hslToRgb(199, 72, 62))).toBe('#58B8E4');
  });

  it('maps greys to zero saturation', () => {
    expect(rgbToHex(hslToRgb(210, 0, 50))).toBe('#808080');
  });
});

describe('contrast', () => {
  it('gives 21:1 for black on white', () => {
    expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(21, 5);
  });

  it('gives 1:1 for a colour against itself', () => {
    expect(contrastRatio(BLACK, BLACK)).toBeCloseTo(1, 10);
  });

  it('is order-independent', () => {
    const a: Rgb = [30, 110, 140];
    expect(contrastRatio(a, WHITE)).toBeCloseTo(contrastRatio(WHITE, a), 10);
  });
});

describe('vision simulation', () => {
  it('leaves colour untouched for normal vision', () => {
    const c: Rgb = [88, 184, 228];
    expect(simulateVision(c, 'normal')).toEqual(c);
  });

  it('leaves greys approximately grey under every dichromacy', () => {
    // achromatic input carries no hue information to lose
    for (const vision of ['protan', 'deutan', 'tritan'] as const) {
      const [r, g, b] = simulateVision([128, 128, 128], vision);
      expect(Math.abs(r - g)).toBeLessThan(6);
      expect(Math.abs(g - b)).toBeLessThan(6);
    }
  });

  it('collapses red and green toward each other for a deuteranope', () => {
    const red: Rgb = [220, 60, 60];
    const green: Rgb = [60, 180, 60];
    const before = deltaE2000(red, green);
    const after = deltaE2000(simulateVision(red, 'deutan'), simulateVision(green, 'deutan'));
    expect(after).toBeLessThan(before);
  });

  it('stays in gamut', () => {
    for (const vision of ['protan', 'deutan', 'tritan'] as const) {
      for (const c of SYNTAX_V1) {
        for (const channel of simulateVision(c, vision)) {
          expect(channel).toBeGreaterThanOrEqual(0);
          expect(channel).toBeLessThanOrEqual(255);
        }
      }
    }
  });
});

describe('perceptual difference', () => {
  it('reports zero for identical colours', () => {
    const c: Rgb = [88, 184, 228];
    expect(deltaE76(c, c)).toBeCloseTo(0, 10);
    expect(deltaE2000(c, c)).toBeCloseTo(0, 10);
  });

  it('is symmetric', () => {
    const a: Rgb = [88, 184, 228];
    const b: Rgb = [236, 179, 81];
    expect(deltaE2000(a, b)).toBeCloseTo(deltaE2000(b, a), 10);
  });

  it('puts black and white at the extreme of the L axis', () => {
    expect(deltaE76(BLACK, WHITE)).toBeCloseTo(100, 1);
  });

  it('reports CIEDE2000 below CIE76 for a saturated pair', () => {
    const a: Rgb = [88, 184, 228];
    const b: Rgb = [236, 179, 81];
    expect(deltaE2000(a, b)).toBeLessThan(deltaE76(a, b));
  });
});

describe('scorePalette', () => {
  it('requires exactly five colours — one per episode type', () => {
    expect(() => scorePalette([BLACK, WHITE])).toThrow();
    expect(TYPE_ROLES).toHaveLength(5);
  });

  it('reports a result for every vision type', () => {
    const report = scorePalette(SYNTAX_V1);
    expect(report.byVision.map((r) => r.vision)).toEqual([
      'normal',
      'protan',
      'deutan',
      'tritan',
    ]);
  });

  it('takes the worst across all vision types, not the average', () => {
    const report = scorePalette(SYNTAX_V1);
    const min = Math.min(...report.byVision.map((r) => r.deltaE));
    expect(report.worst.deltaE).toBeCloseTo(min, 10);
  });

  it('scores a palette with two identical colours at zero', () => {
    const collapsed: Rgb[] = [
      hslToRgb(199, 72, 62),
      hslToRgb(199, 72, 62), // duplicate — two types would be indistinguishable
      hslToRgb(330, 62, 64),
      hslToRgb(256, 62, 64),
      hslToRgb(147, 55, 36),
    ];
    const report = scorePalette(collapsed);
    expect(report.worst.deltaE).toBeCloseTo(0, 6);
    expect(report.worst.pair).toEqual(['canon', 'mixed']);
  });
});

describe('judging against the shipping palette', () => {
  it('scores the control at exactly parity', () => {
    const j = judgePalette(SYNTAX_V1);
    expect(j.ratio).toBeCloseTo(1, 10);
    expect(j.verdict).toBe('pass');
  });

  it('locks the control bar so a token edit cannot silently move it', () => {
    // If this fails, someone changed --type-* in index.css. That may be
    // correct — but it re-bases every candidate, so it must be deliberate.
    expect(controlBar(deltaE2000)).toBeCloseTo(13.8, 1);
    expect(controlBar(deltaE76)).toBeCloseTo(19.9, 1);
  });

  it('fails a one-hue palette — five intensities cannot carry five types', () => {
    // This is the phosphor finding: colour alone tops out near half the
    // control, so that variant needs pattern as a real encoding channel.
    const phosphor = [
      hslToRgb(40, 100, 62),
      hslToRgb(38, 84, 50),
      hslToRgb(36, 68, 38),
      hslToRgb(44, 58, 76),
      hslToRgb(38, 55, 27),
    ];
    const j = judgePalette(phosphor);
    expect(j.verdict).toBe('fail');
    expect(j.ratio).toBeLessThan(0.7);
  });

  it('passes the re-derived blueprint palette', () => {
    const blueprint = [
      hslToRgb(185, 78, 74),
      hslToRgb(55, 75, 60),
      hslToRgb(8, 78, 56),
      hslToRgb(265, 41, 58),
      hslToRgb(160, 35, 48),
    ];
    expect(judgePalette(blueprint).verdict).toBe('pass');
  });

  it('passes the re-derived daylight palette', () => {
    const daylight = [
      hslToRgb(210, 45, 26),
      hslToRgb(40, 77, 32),
      hslToRgb(339, 74, 32),
      hslToRgb(270, 70, 46),
      hslToRgb(172, 81, 27),
    ];
    expect(judgePalette(daylight).verdict).toBe('pass');
  });
});
