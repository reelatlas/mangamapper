// A10 — the sliver rule, proven on the records that ruled it (2026-08-26,
// batch 19 E3). Pure; no DB.
import { describe, expect, it } from 'vitest';
import { sliverStart, statedPages } from './sliver';

describe('sliverStart (A10)', () => {
  it('MHA ep 170: an 8-page leading partial of the preceding chapter IS the start', () => {
    const v = sliverStart('429 (p.3-4, 14-19), 430-432', 430);
    expect(v.start).toBe(429);
    expect(v.reason).toBe('substantive');
    expect(v.pages).toBe(8);
  });
  it('a ≤5-page tail is scraps — the start stands (oshi-no-ko 26: 84 p.17-18)', () => {
    const v = sliverStart('84 (p.17-18), 85-88', 85);
    expect(v.start).toBe(85);
    expect(v.reason).toBe('scraps');
    expect(v.pages).toBe(2);
  });
  it('sliver / flashback wording is scraps whatever the page count', () => {
    expect(sliverStart('61 (tail: recap of the fight, 12 pages), 62-64', 62).start).toBe(62);
  });
  it('wordy shares count without a page count (bokuben 6: "16 (2nd half)")', () => {
    const v = sliverStart('16 (2nd half), 18, 19', 17);
    expect(v.start).toBe(16);
    expect(v.reason).toBe('substantive');
  });
  it('exactly 6 stated pages crosses the bar (MHA 61: 117 p10-15)', () => {
    expect(sliverStart('117 (p10-15), 118, 119, 120, 121 (p1-9)', 118).start).toBe(117);
  });
  it('AoT ep 87: a far-earlier relocated opener is never the position', () => {
    const v = sliverStart('123 (first half, relocated flashback), 130 (remainder)', 130);
    expect(v.start).toBe(130);
    expect(v.reason).toBe('not-preceding');
  });
  it('an unquantified "tail" / "part" is scraps (kingdom 51: "191 (tail)")', () => {
    expect(sliverStart('191 (tail), 192-193', 192).reason).toBe('scraps');
  });
  it('a record that opens on the start itself is simply proven', () => {
    expect(sliverStart('65-67', 65).reason).toBe('lead-is-start');
  });
  it('no leading number → nothing to judge', () => {
    expect(sliverStart(null, 65).reason).toBe('no-lead');
    expect(sliverStart('vol-34 extended ending pages', 135).reason).toBe('no-lead');
  });
});

describe('statedPages', () => {
  it('sums ranges; counts singles only when no range is given', () => {
    expect(statedPages('429 (p.3-4, 14-19)')).toBe(8);
    expect(statedPages('120 (p.7-19)')).toBe(13);
    expect(statedPages('99 (opens on the tail of 98)')).toBe(0);
  });
});
