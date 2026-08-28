// I40 / T30 / A46 — parallel tellings: the relation derivation and the ruled
// manga link (pickMangaNode), the arc partition check on the first witness
// (dragon-ball-super), and the correspondence shape + coverage math.
import { describe, expect, it } from 'vitest';
import { arcProblem, arcsPartitionProblems, arcOfEpisode, RULED_ARCS, type Arc } from './rulings/arcs';
import { correspondenceCoverage, correspondenceProblem } from './rulings/correspondence';
import { deriveSourceRelation, isParallelSeries, pickMangaNode } from './rulings/source-relations';

const node = (id: number, relationType: string, format = 'MANGA', popularity = 0) => ({ relationType, node: { id, type: 'MANGA', format, popularity, countryOfOrigin: 'JP' } });

describe('I40 source relation', () => {
  it('dragon-ball-super is the parallel witness; everything else with a source is an adaptation; no source → null', () => {
    expect(deriveSourceRelation('dragon-ball-super', true)).toBe('parallel');
    expect(deriveSourceRelation('naruto', true)).toBe('adaptation');
    expect(deriveSourceRelation('outlaw-star', false)).toBeNull();
    expect(isParallelSeries('dragon-ball-super')).toBe(true);
    expect(isParallelSeries('boruto-naruto-next-generations')).toBe(false);
  });
  it('pickMangaNode: ADAPTATION-only by default; a ruled link picks the named node whatever its relationType, and never invents one', () => {
    const edges = [node(86508, 'ALTERNATIVE'), node(14837, 'ALTERNATIVE'), node(999, 'ADAPTATION', 'ONE_SHOT')];
    expect(pickMangaNode(edges)).toBeNull(); // no ADAPTATION edge of format MANGA
    expect(pickMangaNode(edges, 'dragon-ball-super')?.id).toBe(86508);
    expect(pickMangaNode([node(1, 'ADAPTATION')], 'dragon-ball-super')).toBeNull(); // the ruled id is absent from staging → null (ruling_violation), not the ADAPTATION fallback
    expect(pickMangaNode([node(5, 'ADAPTATION', 'MANGA', 10), node(6, 'ADAPTATION', 'MANGA', 90)], 'naruto')?.id).toBe(6);
  });
});

describe('A46 arcs', () => {
  it("the witness's arcs partition 1..131 and tile the chapter space without overlap", () => {
    const arcs = RULED_ARCS['dragon-ball-super'];
    expect(arcs.map(arcProblem).filter(Boolean)).toEqual([]);
    expect(arcsPartitionProblems(arcs, 131)).toEqual([]);
    expect(arcOfEpisode(arcs, 44)?.kind).toBe('anime_only');
    expect(arcOfEpisode(arcs, 98)?.label).toBe('Universe Survival');
    expect(arcOfEpisode(arcs, 20)?.kind).toBe('side_source');
  });
  it('gaps, overlaps and wrong shapes are named', () => {
    const arcs: Arc[] = [
      { label: 'a', kind: 'shared', epStart: 1, epEnd: 10, chStart: 1, chEnd: 5, note: '' },
      { label: 'b', kind: 'anime_only', epStart: 9, epEnd: 12, note: '' },
      { label: 'c', kind: 'shared', epStart: 15, epEnd: 20, chStart: 4, chEnd: 9, note: '' },
      { label: 'd', kind: 'manga_only', epStart: 21, chStart: 10, note: '' },
    ];
    const p = arcsPartitionProblems(arcs, 22);
    expect(p).toContain('b overlaps the previous arc at episodes 9-10');
    expect(p).toContain('episodes 13-14 are in no arc');
    expect(p).toContain('episodes 21-22 are in no arc');
    expect(p).toContain("c overlaps the previous arc's chapters from 4");
    expect(p).toContain('d: manga_only takes chapters only');
  });
});

describe('A46 correspondence', () => {
  it('shapes: aligned/divergent need both sides, anime_only an episode, manga_only chapters', () => {
    expect(correspondenceProblem({ episode: 98, chStart: 34, chEnd: 34, alignment: 'divergent' })).toBeNull();
    expect(correspondenceProblem({ episode: 98, alignment: 'divergent' })).toMatch(/needs an episode and a chapter range/);
    expect(correspondenceProblem({ episode: 79, alignment: 'anime_only' })).toBeNull();
    expect(correspondenceProblem({ episode: 79, chStart: 28, chEnd: 28, alignment: 'anime_only' })).toMatch(/episode only/);
    expect(correspondenceProblem({ chStart: 43, chEnd: 104, alignment: 'manga_only' })).toBeNull();
    expect(correspondenceProblem({ episode: 1, chStart: 5, chEnd: 4, alignment: 'aligned' })).toMatch(/backwards/);
  });
  it('coverage: canon/mixed episodes and chapters of a SHARED arc owe rows; filler owes nothing; the split example covers both ranges', () => {
    const arcs: Arc[] = [
      { label: 's', kind: 'shared', epStart: 1, epEnd: 4, chStart: 100, chEnd: 120, note: '' },
      { label: 'd', kind: 'anime_only', epStart: 5, epEnd: 6, note: '' },
    ];
    const eps = [1, 2, 3, 4, 5, 6].map((n) => ({ number: n, type: n === 3 || n >= 5 ? 'filler' : 'canon' }));
    const empty = correspondenceCoverage(arcs, [], eps);
    expect(empty.episodesUncovered).toEqual([1, 2, 4]);
    expect(empty.chaptersUncovered).toEqual([[100, 120]]);
    const rows = [
      { episode: 1, chStart: 100, chEnd: 110, alignment: 'aligned' as const },
      { episode: 1, chStart: 111, chEnd: 115, alignment: 'divergent' as const },
      { episode: 2, alignment: 'anime_only' as const },
      { chStart: 116, chEnd: 119, alignment: 'manga_only' as const },
    ];
    const c = correspondenceCoverage(arcs, rows, eps);
    expect(c.episodesUncovered).toEqual([4]);
    expect(c.chaptersUncovered).toEqual([[120, 120]]);
  });
});
