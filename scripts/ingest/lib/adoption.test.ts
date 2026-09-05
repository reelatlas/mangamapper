// I44 — the adoption gate, pure
import { describe, expect, it } from 'vitest';
import { adoptionVerdict } from './adoption';

describe('adoptionVerdict (I44)', () => {
  it('a series with no rows yet adopts on identity alone', () => {
    expect(adoptionVerdict(12, 0, []).ok).toBe(true);
  });
  it('AFL within ±2 of our max adopts', () => {
    expect(adoptionVerdict(12, 12, [12]).ok).toBe(true);
    expect(adoptionVerdict(11, 13, [13]).ok).toBe(true);
  });
  it('AFL ending on a component boundary adopts — AFL charting S1 of an S1+S2 series is lag (I26)', () => {
    const v = adoptionVerdict(12, 24, [12, 24]);
    expect(v.ok).toBe(true);
    expect(v.ok === true ? v.basis : '').toMatch(/component boundary/);
  });
  it('a span that matches neither is HELD — never overwritten on a title match alone', () => {
    const v = adoptionVerdict(50, 24, [12, 24]);
    expect(v.ok).toBe(false);
    expect(v.ok === false ? v.problem : '').toMatch(/held for a ruling/);
  });
});
