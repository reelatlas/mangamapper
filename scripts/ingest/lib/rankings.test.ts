// G60 — the rankings reader, pure
import { describe, expect, it } from 'vitest';
import { LISTS, productFitScore, seedCandidates } from './rankings';

const anime = (id: number, title: string, o: Partial<{ status: string; episodes: number; popularity: number; source: string; format: string; edges: any[] }> = {}) => ({ id, type: 'ANIME', title: { romaji: title, english: null }, format: o.format ?? 'TV', status: o.status ?? 'FINISHED', source: o.source ?? 'MANGA', episodes: o.episodes ?? 12, popularity: o.popularity ?? 1000, startDate: { year: 2020 }, relations: { edges: o.edges ?? [] } });
const mangaEdge = (id: number, status = 'RELEASING', chapters = 300) => ({ relationType: 'ADAPTATION', node: { id, type: 'MANGA', format: 'MANGA', status, chapters, popularity: 5000, title: { romaji: `manga ${id}` } } });

describe('LISTS (G60)', () => {
  it('eight named lists, ~28 requests a week, airing first', () => {
    expect(LISTS[0].name).toBe('airing-manga');
    expect(LISTS.reduce((n, l) => n + l.pages, 0)).toBe(28);
    expect(LISTS.every((l) => l.args.includes('isAdult: false'))).toBe(true);
  });
});

describe('productFitScore', () => {
  it('a publishing source and a long read multiply; airing and announced add recency; a finished, fully adapted title is popularity alone', () => {
    expect(productFitScore(anime(1, 'x', { popularity: 1000, edges: [mangaEdge(9, 'RELEASING', 300)], status: 'RELEASING' })).score).toBe(Math.round(1000 * 1.5 * 1.25 * 1.2));
    expect(productFitScore(anime(2, 'y', { popularity: 1000, edges: [mangaEdge(9, 'FINISHED', 20)] })).score).toBe(1000);
    expect(productFitScore(anime(3, 'z', { popularity: 1000, status: 'NOT_YET_RELEASED' })).factors).toContain('announced ×1.1');
  });
});

describe('seedCandidates', () => {
  const rows = (ms: any[], list = 'popular-manga', snapshot = '2026-09-05') => ms.map((m, i) => ({ list, snapshot, rank: i + 1, anilist_id: m.id, raw: m }));
  it('an owned title is never a seed; a title one edge from the catalog is the halo\'s, not a seed; an original has no instrument', () => {
    const seeds = seedCandidates(rows([anime(10, 'Owned'), anime(11, 'Related', { edges: [{ relationType: 'SEQUEL', node: { id: 10, type: 'ANIME', format: 'TV', title: { romaji: 'Owned' } } }] }), anime(12, 'Original', { source: 'ORIGINAL' }), anime(13, 'New IP')]), new Set([10]), new Set([11]));
    expect(seeds.map((s) => s.anilistId)).toEqual([13]);
  });
  it('the latest snapshot per list wins; a title on several lists carries every rank; sorted by score', () => {
    const old = rows([anime(20, 'Old only')], 'popular-manga', '2026-08-01');
    const now = [...rows([anime(21, 'Big', { popularity: 5000 }), anime(22, 'Small', { popularity: 100 })]), ...rows([anime(22, 'Small', { popularity: 100, status: 'RELEASING' })], 'airing-manga')];
    const seeds = seedCandidates([...old, ...now], new Set(), new Set());
    expect(seeds.map((s) => s.anilistId)).toEqual([21, 22]);
    expect(seeds[1].lists.map((l) => l.list).sort()).toEqual(['airing-manga', 'popular-manga']);
  });
  it('a later season of an unowned chain names its prequel as the head; the manga-first list yields the ADAPTATION anime', () => {
    const s2 = anime(31, 'Show S2', { edges: [{ relationType: 'PREQUEL', node: { id: 30, type: 'ANIME', format: 'TV', title: { romaji: 'Show' } } }] });
    const manga = { id: 40, type: 'MANGA', title: { romaji: 'Big Manga' }, format: 'MANGA', status: 'RELEASING', chapters: 500, popularity: 9000, relations: { edges: [{ relationType: 'ADAPTATION', node: { id: 41, type: 'ANIME', format: 'TV', status: 'FINISHED', episodes: 12, popularity: 3000, title: { romaji: 'Big Manga (anime)' } } }] } };
    const seeds = seedCandidates([...rows([s2]), ...rows([manga], 'manga-first')], new Set(), new Set());
    expect(seeds.find((s) => s.anilistId === 31)?.headId).toBe(30);
    const via = seeds.find((s) => s.anilistId === 41)!;
    expect(via.viaManga).toBe(40);
    expect(via.factors.join(' ')).toMatch(/publishing/);
  });
});
