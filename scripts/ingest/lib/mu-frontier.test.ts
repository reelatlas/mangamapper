// G32 gate 0 — MU's labelled coverage segments, proven on the seven batch-20
// wave-1 refusals (2026-08-27) and on season-split controls that must keep
// today's behaviour. Pure; no DB.
import { describe, expect, it } from 'vitest';
import { parseCoverageAll, parseCoverageSegments, pickEntrySegments, segmentIsEntry } from './mu-coverage';

const pick = (text: string, w: { airedEpisodes: number; startYear?: number | null; endYear?: number | null }) => {
  const p = pickEntrySegments(parseCoverageSegments(text), w);
  return { chosen: p.chosen.map((x) => x.chapter), foreign: p.foreign.map((x) => x.chapter), ep: p.chosen.find((x) => x.explicitEp != null)?.explicitEp ?? null };
};

describe('parseCoverageSegments', () => {
  it('splits on " / " and keeps the label and an explicit EP per segment', () => {
    const s = parseCoverageSegments('Vol 23, Chap 273 (1983 EP 119) Some differences / Vol 36, Chap 387 (Scramble for the Throne) / Vol 45, Chap 465 (Perfect Origin S2)');
    expect(s.map((x) => [x.chapter, x.label, x.explicitEp])).toEqual([[273, '1983 EP 119', 119], [387, 'Scramble for the Throne', null], [465, 'Perfect Origin S2', null]]);
  });
  it('drops a segment without a pair (TBA) and reads "Vol 36 Chap 315" without the comma', () => {
    expect(parseCoverageSegments('Vol 4, Chap 25 (S1) / Vol 5, Chap 38 (Movie 3) / TBA').length).toBe(2);
    expect(parseCoverageSegments('Vol 31, Chap 264 (S4) / Vol 36 Chap 315 (S5)').map((x) => x.chapter)).toEqual([264, 315]);
  });
});

describe('pickEntrySegments — the seven refusals', () => {
  it('slam-dunk: the TV segment wins over the film', () => {
    expect(pick('Vol 22, Chap 197 (TV) / Vol 31, Chap 276 (The First Slam Dunk) Abridged and different with an original epilogue', { airedEpisodes: 101, startYear: 1993, endYear: 1996 }).chosen).toEqual([197]);
  });
  it('kinnikuman: the explicit EP 119 segment wins; the unlisted sequels are foreign', () => {
    const k = pick('Vol 23, Chap 273 (1983 EP 119) Some differences / Vol 36, Chap 387 (Scramble for the Throne) / Vol 45, Chap 465 (Perfect Origin S2)', { airedEpisodes: 137, startYear: 1983, endYear: 1986 });
    expect(k.chosen).toEqual([273]); expect(k.ep).toBe(119);
  });
  it('hellsing: the (2001) segment is the TV series; (Ultimate) is foreign', () => {
    expect(pick('Vol 2, Chap 12 (2001) / Vol 10, Chap 95 (Ultimate) Skips most of Chap 2', { airedEpisodes: 13, startYear: 2001, endYear: 2002 })).toEqual({ chosen: [12], foreign: [95], ep: null });
  });
  it('gantz: (TV) wins; (Gantz:O) is a named other work', () => {
    const g = pick('Vol 8, Chap 91 (TV) Original Ending Ep 22-26 / Vol 25, Chap 280 (Gantz:O) Some differences', { airedEpisodes: 26, startYear: 2004, endYear: 2004 });
    expect(g.chosen).toEqual([91]); expect(g.ep).toBeNull();
  });
  it('single-segment strings (gto, zatch-bell, toriko) are untouched', () => {
    for (const t of ['Vol 13, Chap 106 Original Ending in EP 42-43, Skips chapters', 'Vol 22, Chap 212 (Original Ending EP 139-150)', 'Vol 29, Chap 263 (with some differences)']) {
      const p = pickEntrySegments(parseCoverageSegments(t), { airedEpisodes: 150 });
      expect(p.chosen.length).toBe(1); expect(p.reason).toBe('single segment');
    }
  });
});

describe('pickEntrySegments — controls that keep today\'s behaviour', () => {
  it('season splits on a whole-run entry: every segment is this entry\'s → the caller still takes the max', () => {
    expect(pick('Vol 7, Chap 50 (S1) / Vol 12, Chap 102 (S2) / Vol 20, Chap 167 (S3) / Vol 25, Chap 214 (S4) / Vol 29, Chap 255 (S5)', { airedEpisodes: 120, startYear: 2016, endYear: 2024 }).chosen).toEqual([50, 102, 167, 214, 255]);
    expect(pick('Vol 6, Chap 46 (S1P1) / Vol 13, Chap 113 (S1P2)', { airedEpisodes: 24, startYear: 2020 }).chosen).toEqual([46, 113]);
  });
  it('a (Movie) / (OVA) segment among seasons is foreign; the seasons stay', () => {
    expect(pick('Vol 4, Chap 25 (S1) / Vol 5, Chap 38 (Movie 3) / Vol 10, Chap 60 (S2) / TBA', { airedEpisodes: 24, startYear: 2019 })).toEqual({ chosen: [25, 60], foreign: [38], ep: null });
    expect(pick('Vol 30, Chap 269 (S1) / Vol 35, Chap 314 (Film + OVA) / Vol 44, Chap 398 (S2)', { airedEpisodes: 50, startYear: 2013 }).foreign).toEqual([314]);
  });
  it('year labels: the 2011 hunter x hunter takes (2011), not the 1999 series\' segments; berserk 1997 takes (1997), not (Golden Age Arc) or (2017)', () => {
    expect(pick('Vol 1, Chap 2 (1998) / Vol 18, Chap 185 Page 11 (1999 Greed Island Final) / Vol 32, Chap 339 (2011) Phantom Rouge Movie includes Vol 0', { airedEpisodes: 148, startYear: 2011, endYear: 2014 })).toEqual({ chosen: [339], foreign: [2, 185], ep: null });
    const b = pick('Vol 13, Chap 87 Page 15 (1997) / Vol 13, Chap 91 (Golden Age Arc) / Vol 29, Chap 249 (2017) All change/skip material', { airedEpisodes: 25, startYear: 1997, endYear: 1998 });
    expect(b.chosen).toEqual([87]); expect(b.foreign).toEqual([249]); // the bare title 'Golden Age Arc' is undecidable, not foreign — it simply is not chosen
  });
  it('bleach: ") /Vol" (no space before the slash) still splits; "(Bleach)" and "(TYBW P4)" carry no entry marker → UNRESOLVED, today\'s pin kept (batch 20 wave 2 verifier)', () => {
    const segs = parseCoverageSegments('Vol 54, Chap 479 (Bleach) /Vol 74, Chap 705 (TYBW P4)');
    expect(segs.map((x) => x.chapter)).toEqual([479, 705]);
    const p = pickEntrySegments(segs, { airedEpisodes: 366, startYear: 2004, endYear: 2012 });
    expect(p.chosen.map((x) => x.chapter)).toEqual([479, 705]);
    expect(p.unresolved).toBe(true);
  });
  it('no entry marker anywhere → UNRESOLVED: every segment kept (today\'s max) and the series listed, never refused', () => {
    const p = pickEntrySegments(parseCoverageSegments('Vol 16, Chap 194 (Dragon Ball) / Vol 42, Chap 519 (DBZ/Kai)'), { airedEpisodes: 291, startYear: 1989, endYear: 1996 });
    expect(p.unresolved).toBe(true); expect(p.chosen.map((x) => x.chapter)).toEqual([194, 519]);
    expect(segmentIsEntry({ volume: 2, chapter: 12, label: '2001', explicitEp: null }, { airedEpisodes: 13 })).toBeNull();
  });
  it('markers anywhere in the label: "S1+OVA", "E13", "TV Special", a year off by one ("1983 S1" for a 1984 run)', () => {
    expect(pick('Vol 4, Chap 12 (S1+OVA) / Vol 11, Chap 41 (S2+OVA) Skip Chap 40', { airedEpisodes: 25, startYear: 2014, endYear: 2015 }).chosen).toEqual([12, 41]);
    expect(pick('Vol 7, Chap 108 (E13) / Vol 15 , Chap 222 (Kanketsu-hen OVA 4) Heavily abridged', { airedEpisodes: 17, startYear: 2016, endYear: 2018 })).toEqual({ chosen: [108], foreign: [222], ep: null });
    expect(pick('Vol 1, Chap 0 (TV Special) / Vol 1, Chap 4 (Movie)', { airedEpisodes: 3, startYear: 2020, endYear: 2020 })).toEqual({ chosen: [0], foreign: [4], ep: null });
    expect(pick('Vol 16, Chap 136 (1983 S1) / Vol 24, Chap 210 (1983 S2) / Vol 9, Chap 72 (1986 Movie) Heavily abridged', { airedEpisodes: 152, startYear: 1984, endYear: 1988 })).toEqual({ chosen: [136, 210, 72], foreign: [], ep: null });
  });
  it('parseCoverageAll still reads a single pair with its EP; a ranged "EP 42-43" (a filler block) is not a pin episode', () => {
    expect(parseCoverageAll('Vol 23, Chap 273 (1983 EP 119)')).toEqual({ pairs: [{ volume: 23, chapter: 273 }], explicitEp: 119 });
    expect(parseCoverageAll('Vol 13, Chap 106 Original Ending in EP 42-43, Skips chapters').explicitEp).toBeNull();
  });
});

// wave 6 (2026-08-28): the mf-ghost S3 lesson — season-numbered segments
// beyond the entry's own season count are another entry's; a stitched
// whole-run entry keeps its seasons (shy).
import { parseCoverageSegments as pcs, pickEntrySegments as pes } from './mu-coverage';
describe('G32 gate 0 — season-scoped entries (wave 6)', () => {
  const MF = 'Vol 5, Chap 56 (S1) / Vol 10, Chap 116 (S2) / Vol 17, Chap 194 (S3)';
  it('a single-season entry claims only its own season segment', () => {
    const picked = pes(pcs(MF), { airedEpisodes: 12, startYear: 2023, endYear: 2023, seasonCount: 1 });
    expect(picked.unresolved).toBe(false);
    expect(picked.chosen.map((x) => x.chapter)).toEqual([56]);
    expect(picked.foreign.map((x) => x.chapter).sort()).toEqual([116, 194]);
  });
  it('a stitched two-season entry keeps S1+S2 and takes the S2 endpoint', () => {
    const SHY = 'Vol 4, Chap 30 (S1) / Vol 9, Chap 74 (S2)';
    const picked = pes(pcs(SHY), { airedEpisodes: 24, startYear: 2023, endYear: 2024, seasonCount: 2 });
    expect(picked.chosen.map((x) => x.chapter)).toEqual([30, 74]);
    expect(picked.foreign).toEqual([]);
  });
  it('without an explicit seasonCount today\'s whole-run behaviour is kept (only applyMuFrontier restricts)', () => {
    const picked = pes(pcs(MF), { airedEpisodes: 12, startYear: 2023, endYear: 2023 });
    expect(picked.chosen.map((x) => x.chapter)).toEqual([56, 116, 194]);
  });
  it('the cobra lesson: a SINGLE foreign-labelled segment yields nothing (the frontier refuses)', () => {
    const picked = pes(pcs('Vol 8, Chap 14 (1983)'), { airedEpisodes: 13, startYear: 2010, endYear: 2010, seasonCount: 1 });
    expect(picked.chosen).toEqual([]);
    expect(picked.foreign.map((x) => x.chapter)).toEqual([14]);
    // a single UNLABELLED segment keeps today's behaviour
    expect(pes(pcs('Vol 8, Chap 74'), { airedEpisodes: 24, seasonCount: 2 }).chosen.map((x) => x.chapter)).toEqual([74]);
  });
  it('a TV label is unaffected', () => {
    const picked = pes(pcs('Vol 22, Chap 197 (TV) / Vol 31, Chap 276 (The First Slam Dunk)'), { airedEpisodes: 101, startYear: 1993, endYear: 1996, seasonCount: 1 });
    expect(picked.chosen.map((x) => x.chapter)).toEqual([197]);
  });
});
