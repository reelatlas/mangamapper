import { describe, expect, it } from 'vitest';
import { streamingOn, toEpisodes, volumeFor, type AnchorRow, type Boundary, type EpisodeRow, type SeriesRow } from './assemble';

// Fixture-based tests over the pure assembly step that turns DB rows into
// the UI's Episode shape. Every rule exercised here is cited by its ledger
// id in assemble.ts; the assertions are the outcomes those rules promise.

const row = (over: Partial<SeriesRow> = {}): SeriesRow => ({
  id: 'test',
  title: 'Test',
  title_native: null,
  cover_url: null,
  status: 'finished',
  source_type: 'manga',
  source_relation: 'adaptation',
  manga_status: 'finished',
  manga_anilist_id: null,
  aired_episodes: 6,
  total_episodes: 6,
  total_volumes: 4,
  total_chapters: 40,
  manga_start_volume: null,
  manga_start_chapter: null,
  popularity: 1,
  genres: [],
  synopsis_html: null,
  external_links: [],
  search_text: 'test',
  latest_known_chapters: null,
  mapping_mode: 'chapter',
  ...over,
});

const ep = (number: number, type: string, title = `Ep ${number}`): EpisodeRow => ({ number, title, type, air_date: '2020-01-01' });

describe('volumeFor', () => {
  const boundaries: Boundary[] = [
    { volume: 1, chapter_start: 1, chapter_end: 9 },
    { volume: 2, chapter_start: 10, chapter_end: null },
  ];
  it('prefers real boundaries, including an open-ended last volume', () => {
    expect(volumeFor(row(), 5, boundaries)).toBe(1);
    expect(volumeFor(row(), 99, boundaries)).toBe(2);
  });
  it('falls back to the ratio estimate, clamped to the scope', () => {
    expect(volumeFor(row(), 11, [])).toBe(2); // ceil(11 * 4 / 40)
    expect(volumeFor(row(), 400, [])).toBe(4);
  });
  it('is null without totals and without a boundary hit', () => {
    expect(volumeFor(row({ total_volumes: null }), 5, [])).toBeNull();
  });
});

describe('toEpisodes', () => {
  const anchors: AnchorRow[] = [
    { episode: 1, volume: null, chapter: 3, start_chapter: 1 },
    { episode: 2, volume: 1, chapter: 6, start_chapter: null },
    { episode: 3, volume: null, chapter: 8, start_chapter: 8 },
  ];

  it('maps canon and mixed rows with their anchors; filler never maps', () => {
    const out = toEpisodes(row(), [ep(1, 'canon'), ep(2, 'mixed'), ep(3, 'filler')], anchors, []);
    expect(out.map((e) => e.mangaMapping)).toEqual([
      { volume: 1, chapters: '1-3', start: 1 },
      { volume: 1, chapters: '6', start: null },
      null,
    ]);
  });

  it('writes a bare end chapter when start equals end, a span otherwise', () => {
    const [a, , c] = toEpisodes(row(), [ep(1, 'canon'), ep(2, 'canon'), ep(3, 'canon')], anchors, []);
    expect(a.mangaMapping?.chapters).toBe('1-3');
    expect(c.mangaMapping?.chapters).toBe('8');
  });

  it('turns an empty DB title into null (the title_pending signal)', () => {
    const [a] = toEpisodes(row(), [ep(1, 'canon', '  ')], [], []);
    expect(a.title).toBeNull();
  });

  it('T26: an adopted or side_source episode is canon with no mapping', () => {
    const out = toEpisodes(row(), [ep(1, 'canon')], anchors, [], [{ episode: 1, kind: 'adopted' }]);
    expect(out[0].mangaMapping).toBeNull();
    expect(out[0].offSource).toBe(true);
  });

  it('synthesises a title-pending canon row for an anchored episode with no row, inside the aired range', () => {
    const out = toEpisodes(row({ aired_episodes: 3 }), [ep(1, 'canon')], anchors, []);
    expect(out.map((e) => e.number)).toEqual([1, 2, 3]);
    expect(out[1]).toMatchObject({ title: null, type: 'canon', airDate: '', mangaMapping: { chapters: '6' } });
  });

  it('never synthesises beyond aired_episodes or for non-integer anchors', () => {
    const out = toEpisodes(row({ aired_episodes: 1 }), [ep(1, 'canon')], [...anchors, { episode: 2.5, volume: null, chapter: 7, start_chapter: null }], []);
    expect(out.map((e) => e.number)).toEqual([1]);
  });

  it('carries the format axis only when present', () => {
    const out = toEpisodes(row(), [{ ...ep(1, 'canon'), format: 'ova' }, ep(2, 'canon')], [], []);
    expect(out[0].format).toBe('ova');
    expect('format' in out[1]).toBe(false);
  });
});

describe('streamingOn', () => {
  it('maps streaming links to the service tokens and ignores other link types', () => {
    const links = [
      { site: 'Crunchyroll', type: 'STREAMING' },
      { site: 'Disney Plus', type: 'STREAMING' },
      { site: 'Netflix', type: 'INFO' },
    ];
    expect(streamingOn(links)).toEqual(['crunchyroll', 'disney-hulu']);
  });
});
