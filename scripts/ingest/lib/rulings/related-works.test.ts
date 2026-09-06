// E56 — the related-works ruling layer: one ruling per (series, work); the map refuses a duplicate key instead of overriding.
import { describe, expect, it } from 'vitest';
import { ENTRIES, RELATED_WORK_RULINGS, relatedWorkRuling } from './related-works';

describe('related-works rulings (E56)', () => {
  it('every entry lands once — the map holds exactly ENTRIES.length rulings (a duplicate key throws at load)', () => {
    const n = Object.values(RELATED_WORK_RULINGS).reduce((a, m) => a + Object.keys(m).length, 0);
    expect(n).toBe(ENTRIES.length);
  });
  it('wave 4a: a merged entry keeps its earlier fields (kinnikuman 3280 — the date repair AND the standing)', () => {
    const r = relatedWorkRuling('kinnikuman', 3280);
    expect(r?.airDate).toBe('1984-04-07'); expect(r?.standing).toBe('mixed'); expect(r?.position).toBe(47.5); expect(r?.chapter).toBe(89);
  });
  it('wave 4a: the Ranma cluster is ruled explicitly (E13) and the Kinnikuman watch slots never collide (E14)', () => {
    expect([1007, 1008, 1010].map((id) => relatedWorkRuling('ranma-1-2', id)?.position)).toEqual([161.5, 161.51, 161.52]);
    const slots = [3273, 3274, 3280, 3276, 147810].map((id) => relatedWorkRuling('kinnikuman', id)?.position);
    expect(slots).toEqual([65.5, 65.51, 47.5, 119.5, 119.51]); expect(new Set(slots).size).toBe(slots.length);
  });
});
