// I46 (amended) — the related-work identity registry, the pure outcome checks
import { describe, expect, it } from 'vitest';
import { identityProblems, lookupRelatedWork, wikiKey } from './related-work-ids';

const reg = (entries: [string, number][]) => new Map(entries.map(([k, a]) => [k, { anilist_id: a }]));

describe('the related-work identity registry (I46)', () => {
  it('a wiki key is the series and the numbered position, normalised', () => {
    expect(wikiKey('rurouni-kenshin', 94.2)).toBe('rurouni-kenshin@94.2');
    expect(wikiKey('rurouni-kenshin', '94.20')).toBe('rurouni-kenshin@94.2');
    expect(lookupRelatedWork(reg([['wiki:rurouni-kenshin@94.2', 11441]]), 'wiki', 'rurouni-kenshin@94.2')).toEqual({ anilist_id: 11441 });
  });
  it('a registered ledger is silent; an unregistered halo id, mal id or adopted wiki key is a gap', () => {
    const rows = [
      { series_id: 'chainsaw-man', position: 12.5, anilist_id: 171627, origin: 'halo', title: 'Reze Arc' },
      { series_id: 'rurouni-kenshin', position: 94.2, anilist_id: 11441, origin: 'wiki', title: 'Shin Kyoto-hen' },
    ];
    const mal = new Map([[171627, 59027]]);
    const full = reg([['anilist:171627', 171627], ['mal:59027', 171627], ['anilist:11441', 11441], ['wiki:rurouni-kenshin@94.2', 11441]]);
    expect(identityProblems(rows, full, mal)).toEqual({ gap: [], conflict: [], orphan: [] });
    const p = identityProblems(rows, reg([['anilist:171627', 171627]]), mal);
    expect(p.gap).toHaveLength(3); // the mal id, the adopted row's anilist id and its wiki key
    expect(p.gap.join(' ')).toMatch(/mal 59027 unregistered/); expect(p.gap.join(' ')).toMatch(/wiki key unregistered/);
  });
  it('an id registered to another work is a conflict, never overwritten; a registry entry with no row is an orphan listing', () => {
    const rows = [{ series_id: 'chainsaw-man', position: 12.5, anilist_id: 171627, origin: 'halo', title: 'Reze Arc' }];
    const p = identityProblems(rows, reg([['anilist:171627', 999], ['wiki:gone@1.5', 998]]), new Map());
    expect(p.conflict).toHaveLength(1); expect(p.conflict[0]).toMatch(/registered to some-other-series/);
    expect(p.orphan).toHaveLength(1); expect(p.orphan[0]).toMatch(/no stored row/);
  });
});
