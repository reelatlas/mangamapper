import { describe, expect, it } from 'vitest';
import { aniListStructural, type AniListMedia } from './anilist';
import { contentHash } from './hash';

const base = (): AniListMedia => ({
  id: 1, idMal: null, title: { romaji: 'x', english: null, native: null }, synonyms: [], format: 'TV', status: 'RELEASING', source: 'MANGA', countryOfOrigin: 'JP',
  startDate: { year: 2026, month: 1, day: 1 }, endDate: { year: null, month: null, day: null }, season: null, seasonYear: null, episodes: 12, duration: 24,
  nextAiringEpisode: { episode: 5, airingAt: 1 }, averageScore: 80, meanScore: 81, popularity: 1000, favourites: 10, trending: 3, genres: [],
  tags: [{ name: 'Shounen', rank: 90, isMediaSpoiler: false }], coverImage: { extraLarge: null, color: null }, bannerImage: null, isAdult: false, description: null,
  studios: { nodes: [] }, externalLinks: [], relations: { edges: [{ relationType: 'SOURCE', node: { id: 2, type: 'MANGA', format: 'MANGA', status: 'RELEASING', popularity: 500, chapters: null, volumes: null } as any }] },
} as unknown as AniListMedia);

describe('aniListStructural (G58)', () => {
  it('ignores the metrics AniList recomputes continuously', () => {
    const a = base(); const b = { ...base(), averageScore: 70, meanScore: 60, popularity: 2000, favourites: 99, trending: 0 };
    b.tags = [{ name: 'Shounen', rank: 10, isMediaSpoiler: false }];
    b.relations = { edges: [{ ...b.relations.edges[0], node: { ...b.relations.edges[0].node, popularity: 9 } }] };
    expect(contentHash(aniListStructural(a))).toBe(contentHash(aniListStructural(b)));
  });
  it('still changes on structure: episodes, status, the next-airing pointer, a relation', () => {
    const h = contentHash(aniListStructural(base()));
    expect(contentHash(aniListStructural({ ...base(), episodes: 13 }))).not.toBe(h);
    expect(contentHash(aniListStructural({ ...base(), status: 'FINISHED' }))).not.toBe(h);
    expect(contentHash(aniListStructural({ ...base(), nextAiringEpisode: { episode: 6, airingAt: 2 } }))).not.toBe(h);
    expect(contentHash(aniListStructural({ ...base(), relations: { edges: [] } }))).not.toBe(h);
  });
});
