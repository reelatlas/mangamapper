// I46 (amended) — the related-work identity registry, the pure outcome checks
import { describe, expect, it } from 'vitest';
import { identityProblems, lookupRelatedWork, sharedExternalIds, sharedMalIds, wikiKey } from './related-work-ids';

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
    expect(p.conflict).toHaveLength(1); expect(p.conflict[0]).toMatch(/registered to work 999/);
    expect(p.orphan).toHaveLength(1); expect(p.orphan[0]).toMatch(/no stored row/);
  });
  // I46 amended 2026-09-07 — the Annecy clause: AniList gives MAL 59832 to two one-minute festival shorts (One Piece 143293, Dragon Ball 147996)
  it('an external id a source assigns to two distinct works is shared; a unique or missing id is not', () => {
    const shared = sharedExternalIds([[143293, 59832], [147996, 59832], [171627, 59027], [11441, null], [999, '']]);
    expect([...shared]).toEqual([['59832', [143293, 147996]]]);
    expect(sharedMalIds(new Map([[143293, { idMal: 59832 }], [147996, { idMal: 59832 }], [171627, { idMal: 59027 }], [5, {}]]))).toEqual(shared);
    expect(sharedExternalIds([[143293, 59832], [143293, 59832]]).size).toBe(0); // the same work twice is one holder
  });
  it('a shared mal id registers to neither: withheld, it is never a gap; held by the registry for either work, it is one conflict, never an orphan', () => {
    const rows = [
      { series_id: 'one-piece', position: 978.5, anilist_id: 143293, origin: 'halo', title: 'One Piece: Annecy Festival 60th Anniversary' },
      { series_id: 'dragon-ball-super', position: 131.53, anilist_id: 147996, origin: 'halo', title: 'Dragon Ball: Annecy Festival 60th Anniversary' },
    ];
    const mal = new Map([[143293, 59832], [147996, 59832]]);
    const shared = sharedExternalIds([[143293, 59832], [147996, 59832]]);
    const neither = reg([['anilist:143293', 143293], ['anilist:147996', 147996]]);
    expect(identityProblems(rows, neither, mal, shared)).toEqual({ gap: [], conflict: [], orphan: [] });
    // without the clause the same registry reads two mal gaps — the clause is what makes the withheld id silent
    expect(identityProblems(rows, neither, mal).gap).toHaveLength(2);
    const winner = reg([['anilist:143293', 143293], ['anilist:147996', 147996], ['mal:59832', 143293]]);
    const p = identityProblems(rows, winner, mal, shared);
    expect(p.gap).toEqual([]); expect(p.orphan).toEqual([]);
    expect(p.conflict).toHaveLength(1); expect(p.conflict[0]).toMatch(/mal 59832: AniList assigns it to 2 distinct works \(143293, 147996\) — it registers to NEITHER/);
    expect(p.conflict[0]).toMatch(/holds it for work 143293/);
  });
});
