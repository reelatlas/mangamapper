// A42 outcome — orphan records, proven on the deep-pass witnesses (2026-08-26).
import { describe, expect, it } from 'vitest';
import { orphanRecords } from './row-presence';

describe('orphanRecords (A42)', () => {
  const rows = [{ series_id: 'cells-at-work', number: 11 }, { series_id: 'cells-at-work', number: 14 }];
  const aired = new Map([['cells-at-work', 21], ['shy', 24]]);
  it('lists an anchor whose row is missing, inside the aired count (a staging fault / AFL lag)', () => {
    const o = orphanRecords(rows, [{ series_id: 'cells-at-work', episode: 13 }, { series_id: 'cells-at-work', episode: 14 }], aired);
    expect(o).toEqual([{ record: { series_id: 'cells-at-work', episode: 13 }, beyondAired: false }]);
  });
  it('marks a record past aired_episodes as a numbering fault', () => {
    const o = orphanRecords(rows, [{ series_id: 'cells-at-work', episode: 25 }], aired);
    expect(o[0].beyondAired).toBe(true);
  });
  it('a row-less series with only an MU pin is an orphan inside its aired count (shy 24)', () => {
    expect(orphanRecords(rows, [{ series_id: 'shy', episode: 24 }], aired)).toEqual([{ record: { series_id: 'shy', episode: 24 }, beyondAired: false }]);
  });
  it('fractional records are not rows and are never listed', () => {
    expect(orphanRecords(rows, [{ series_id: 'cells-at-work', episode: 11.5 }], aired)).toEqual([]);
  });
});
