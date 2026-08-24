import type {
  AnimeSeries,
  AnimeStatus,
  Episode,
  EpisodeSpan,
  EpisodeType,
  MangaStatus,
  MappingSummary,
  SourceType,
  StreamingService,
} from '@/types/anime';
import { lastChapterNumber } from '@/lib/mapping';

// Pure row→model assembly, split from supabaseSource so the ingest-side
// verifier (scripts/ingest/verify-series-display.ts) can run the EXACT app
// code path against service-role data — the display the user sees is the
// display the verifier checks, never a re-implementation that can drift
// (the Oshi stale-harness lesson, Sean 2026-08-23). No client imports here.

export type SeriesRow = {
  id: string;
  title: string;
  title_native: string | null;
  cover_url: string | null;
  status: string;
  source_type: string;
  manga_status: string | null;
  manga_anilist_id: number | null;
  aired_episodes: number;
  total_episodes: number | null;
  total_volumes: number | null;
  total_chapters: number | null;
  manga_start_volume: number | null;
  manga_start_chapter: number | null;
  popularity: number;
  genres: string[];
  synopsis_html: string | null;
  external_links: { site: string; type: string | null }[];
  search_text: string;
  latest_known_chapters: number | null;
  mapping_mode: 'chapter' | 'loose';
};

export const SERIES_COLS =
  'id, title, title_native, cover_url, status, source_type, manga_status, manga_anilist_id, aired_episodes, total_episodes, total_volumes, total_chapters, manga_start_volume, manga_start_chapter, popularity, genres, synopsis_html, external_links, search_text, latest_known_chapters, mapping_mode';

export type EpisodeRow = { number: number; title: string; type: string; air_date: string | null };
export type AnchorRow = { episode: number; volume: number | null; chapter: number; start_chapter: number | null };

const STREAM_TOKENS: [RegExp, StreamingService][] = [
  [/crunchyroll/i, 'crunchyroll'],
  [/netflix/i, 'netflix'],
  [/amazon|prime video/i, 'amazon'],
  [/hulu|disney/i, 'disney-hulu'],
  [/bilibili/i, 'bilibili'],
  [/hidive/i, 'hidive'],
];

export const streamingOn = (links: SeriesRow['external_links']): StreamingService[] => {
  const out = new Set<StreamingService>();
  for (const link of links ?? []) {
    if (link.type !== 'STREAMING') continue;
    for (const [re, token] of STREAM_TOKENS) if (re.test(link.site)) out.add(token);
  }
  return [...out];
};

export type Boundary = { volume: number; chapter_start: number; chapter_end: number | null };

// Volume from chapter: real published boundaries first (Wikipedia-derived,
// volume_boundaries table), ratio estimate as fallback when totals are known,
// null otherwise (the UI omits vol: for those rows).
export const volumeFor = (row: SeriesRow, chapter: number, boundaries: Boundary[]): number | null => {
  for (const b of boundaries) {
    if (chapter >= b.chapter_start && (b.chapter_end === null || chapter <= b.chapter_end)) return b.volume;
  }
  if (!row.total_volumes || !row.total_chapters) return null;
  return Math.min(row.total_volumes, Math.max(1, Math.ceil((chapter * row.total_volumes) / row.total_chapters)));
};

export const toEpisodes = (row: SeriesRow, eps: EpisodeRow[], anchors: AnchorRow[], boundaries: Boundary[]): Episode[] => {
  const anchorByEp = new Map(anchors.map((a) => [a.episode, a]));
  const out: Episode[] = eps.map((e) => {
    const anchor = anchorByEp.get(e.number);
    const type = e.type as EpisodeType;
    const mappable = type === 'canon' || type === 'mixed';
    return {
      number: e.number,
      // DB uses '' for pending titles (NOT NULL column); the UI's
      // title_pending render keys off null
      title: e.title?.trim() ? e.title : null,
      type,
      // chapters carries the REAL adapted span when the start is known
      // ("119-127"); a bare end value means only the end-position is known
      // and display derives the start (Sean's first-chapter ruling)
      mangaMapping:
        mappable && anchor
          ? {
              volume: anchor.volume ?? volumeFor(row, anchor.chapter, boundaries),
              chapters:
                anchor.start_chapter != null && anchor.start_chapter !== anchor.chapter
                  ? `${anchor.start_chapter}-${anchor.chapter}`
                  : String(anchor.chapter),
            }
          : null,
      airDate: e.air_date ?? '',
    };
  });
  // ANCHORED ROW-LESS EPISODES (cells-at-work 12/13, 2026-08-24): an exact
  // record proves the episode exists — AFL/wiki row sparseness must not hide
  // it from the mapping layer (anchor points read episodes[].mangaMapping),
  // or a fully-researched row inside a reorder crossing regresses to a
  // "no exact record" hole. Synthesize a canon title-pending row so every
  // consumer sees the record; real rows always win (only missing numbers).
  const have = new Set(eps.map((e) => e.number));
  for (const a of anchors) {
    if (have.has(a.episode) || !Number.isInteger(a.episode)) continue;
    if (a.episode < 1 || a.episode > (row.aired_episodes ?? 0)) continue;
    out.push({
      number: a.episode,
      title: null,
      type: 'canon',
      mangaMapping: {
        volume: a.volume ?? volumeFor(row, a.chapter, boundaries),
        chapters: a.start_chapter != null && a.start_chapter !== a.chapter ? `${a.start_chapter}-${a.chapter}` : String(a.chapter),
      },
      airDate: '',
    });
  }
  out.sort((x, y) => x.number - y.number);
  return out;
};

export type WatchOrderRow = {
  position: number;
  title: string;
  air_date: string | null;
  kind: string | null;
  display_label: string | null;
  chapter: number | null;
  volume: number | null;
  chapters_adapted: string | null;
};

export const toAnimeSeries = (
  row: SeriesRow,
  rank: number,
  episodes: Episode[],
  publishedVolumes = 0,
  boundaries: Boundary[] = [],
  watchOrder: WatchOrderRow[] = [],
): AnimeSeries => ({
  // only RULED (labeled) entries surface; the rest stay data-side
  watchOrderEntries: watchOrder
    .filter((w) => w.display_label != null)
    .map((w) => ({
      position: Number(w.position),
      label: w.display_label as string,
      title: w.title,
      airDate: w.air_date,
      kind: w.kind,
      chapter: w.chapter == null ? null : Number(w.chapter),
      volume: w.volume,
      chaptersAdapted: w.chapters_adapted,
    })),
  // real print boundaries ride along so EVERY chapter→volume readout
  // (including interpolated episode rows) uses them — the ratio estimate
  // must never contradict a curated neighbor (Sean 2026-08-23)
  volumeBoundaries: boundaries.map((b) => ({
    volume: b.volume,
    chapterStart: b.chapter_start,
    chapterEnd: b.chapter_end,
  })),
  id: row.id,
  title: row.title,
  japaneseTitle: row.title_native ?? row.title,
  coverImage: row.cover_url ?? '',
  currentEpisode: row.aired_episodes,
  totalEpisodes: row.total_episodes,
  status: row.status as AnimeStatus,
  mangaStatus: (row.manga_status ?? 'anime_only') as MangaStatus,
  hasManga: row.manga_status !== null && row.manga_status !== 'anime_only',
  // ongoing manga: AniList totals are null — published volume count (from
  // real boundaries) stands in as the latest-known denominator. ONLY when the
  // boundary table is complete from the manga's start: a lone research row
  // (Ippo's v61 552-561) must not masquerade as "1 volume total" and clamp
  // every volume readout to v1 (2026-08-24).
  totalVolumes:
    row.total_volumes ??
    (publishedVolumes && boundaries.some((b) => b.chapter_start <= (row.manga_start_chapter ?? 1)) ? publishedVolumes : null),
  // ongoing manga: AniList nulls chapter totals until completion — the
  // MangaUpdates-sourced latest published chapter stands in (semantically
  // LATEST KNOWN, not total; cross-check tier via the MangaDex id bridge)
  // DISPLAY total: null while the manga publishes (the card renders the em
  // dash — "no final chapter yet", Sean 2026-08-24). For finished manga,
  // AniList's value is a COUNT (mid-run specials included — AoT says 141);
  // the last chapter NUMBER is MU's latest (139) — show that, but only when
  // the two agree within a same-edition band (a divergent MU edition like
  // Space Cobra's 28-vs-156 must not hijack the display; those flag in the
  // audit). The EFFECTIVE total for tail math lives in buildMapping.
  mappingMode: row.mapping_mode,
  totalChapters:
    row.total_chapters != null &&
    row.latest_known_chapters != null &&
    row.latest_known_chapters < row.total_chapters &&
    row.latest_known_chapters >= row.total_chapters * 0.8
      ? row.latest_known_chapters
      : row.total_chapters,
  mangaStartVolume: row.manga_start_volume,
  mangaStartChapter: row.manga_start_chapter,
  episodes,
  searchText: row.search_text || undefined,
  ranking: { mal: rank, anilist: rank },
  streamingOn: streamingOn(row.external_links),
  genres: row.genres ?? [],
  synopsis: (row.synopsis_html ?? '').replace(/<[^>]+>/g, ''),
});

// Contiguous same-type runs; classification gaps and the not-yet-classified
// tail default to the series' OWN base type (canon for manga series,
// anime-only for originals — hardcoding canon fabricated "canon" episodes on
// Super Dragon Ball Heroes' unclassified tail).
export const buildSpans = (eps: EpisodeRow[], aired: number, fallback: EpisodeType): EpisodeSpan[] => {
  if (!eps.length) return aired > 0 ? [{ start: 1, end: aired, type: fallback }] : [];
  const spans: EpisodeSpan[] = [];
  for (const e of eps) {
    if (e.number < 1) continue; // episode 0 stays visible in lists, not in strip math
    const type = e.type as EpisodeType;
    const prev = spans[spans.length - 1];
    if (prev && prev.type === type && e.number === prev.end + 1) prev.end = e.number;
    else if (prev && e.number <= prev.end) continue;
    else if (prev && prev.type === fallback && type === fallback) prev.end = e.number; // gap folds into base type
    else spans.push({ start: e.number, end: e.number, type });
  }
  const last = spans[spans.length - 1];
  if (last && aired > last.end) {
    if (last.type === fallback) last.end = aired;
    else spans.push({ start: last.end + 1, end: aired, type: fallback });
  }
  return spans;
};


export const buildMapping = (
  row: SeriesRow,
  eps: EpisodeRow[],
  anchors: AnchorRow[],
  boundaries: Boundary[],
  continuationStartCh: number | null = null,
): MappingSummary => {
  const sourceType = row.source_type as SourceType;
  const hasSource = sourceType !== 'original' && row.manga_status !== 'anime_only';
  const aired = Math.max(row.aired_episodes, eps.reduce((m, e) => Math.max(m, e.number), 0));

  const spans = buildSpans(eps, aired, hasSource ? 'canon' : 'anime-only-canon');
  const counts = { canon: 0, mixed: 0, filler: 0, 'anime-only-canon': 0 };
  for (const s of spans) counts[s.type] += s.end - s.start + 1;
  const total = counts.canon + counts.mixed + counts.filler + counts['anime-only-canon'];

  const latestAnchor = anchors.length ? anchors[anchors.length - 1] : null;
  // COVERAGE ≠ run-end (Sean's ruling 2026-08-24, the Ippo finale lesson): an
  // anime may END on a relocated earlier block (Ippo 124-127 = the Post-War
  // arc, chs 400-414, aired last). The run-end anchor is the frontier
  // EPISODE; coverage — and therefore continue-reading = coverage+1 — is the
  // FURTHEST mainline chapter adapted anywhere in the run (Ippo: ch 557 via
  // ep 123 → continue 558). Keying coverage off the last-episode anchor
  // flattened eps 105-123 to the finale's low value through the clamp.
  const coverageAnchor = anchors.reduce<AnchorRow | null>((m, a) => (m === null || a.chapter > m.chapter ? a : m), null);
  // canon-tier series (Sean 2026-08-23) carry NO episode rows — their spans
  // default to canon (buildSpans fallback), so the last canon episode IS the
  // last aired one; without this the finished-series latestKnown fallback
  // never fires and a fully-mappable series renders mapping_pending
  const lastCanonEpisode = eps.length
    ? eps.reduce((m, e) => (e.type !== 'filler' ? Math.max(m, e.number) : m), 0)
    : hasSource
      ? aired
      : 0;

  const loose = row.mapping_mode === 'loose';
  let latestKnown =
    hasSource && !loose && latestAnchor && coverageAnchor
      ? {
          episode: latestAnchor.episode,
          volume: coverageAnchor.volume ?? volumeFor(row, coverageAnchor.chapter, boundaries),
          chapters: String(coverageAnchor.chapter),
        }
      : null;
  // No anchors (most of the catalog): a FINISHED entry's coverage IS its
  // scope end — that's what the source-scope semantics mean — so the
  // position instrument works from totals instead of rendering
  // mapping_pending across ~260 series (mock-era assumption: anchors always
  // existed). Airing series without anchors stay pending (frontier unknown).
  if (!latestKnown && hasSource && !loose && row.total_chapters && row.status === 'finished' && lastCanonEpisode > 0) {
    latestKnown = {
      episode: lastCanonEpisode,
      volume: row.total_volumes ?? volumeFor(row, row.total_chapters, boundaries),
      chapters: String(row.total_chapters),
    };
  }
  const continueFrom =
    hasSource && latestKnown
      ? {
          episode: latestKnown.episode,
          volume: volumeFor(row, Number(latestKnown.chapters) + 1, boundaries) ?? latestKnown.volume,
          chapters: String(Number(latestKnown.chapters) + 1),
        }
      : null;

  const coveredChapter = latestKnown ? lastChapterNumber(latestKnown.chapters) : null;
  const scopeStartCh = row.manga_start_chapter ?? 1;
  const adaptedSpan = coveredChapter !== null ? coveredChapter - scopeStartCh + 1 : null;
  const canonEpisodes = counts.canon + counts.mixed;
  // Sean's rulings 2026-08-24: while a manga publishes, AniList totals are
  // null — latest_known (MU) bounds the series from below and is the
  // EFFECTIVE total for tail math. For finished manga BOTH exist in
  // different spaces: AniList totals is a COUNT (mid-run specials included —
  // AoT says 141), MU latest is the last chapter NUMBER (139, matching the
  // anchor space) — take the min so the tail never claims chapters that
  // exist only as count-space padding. Displayed totals stay AniList's
  // (= null while ongoing); synthesis still requires real totals.
  const effectiveTotalChapters =
    row.total_chapters != null || row.latest_known_chapters != null
      ? Math.min(row.total_chapters ?? Infinity, row.latest_known_chapters ?? Infinity)
      : null;
  // The manga_only tail is only knowable when anchors reach the end of the
  // run. Sparse coverage (AFG's Naruto table stops early) would fabricate a
  // giant tail out of chapters the anime DID adapt — an unknown frontier
  // shows no tail (first-class empty state beats a false claim).
  const anchorsReachEnd =
    latestAnchor !== null && lastCanonEpisode > 0 && latestAnchor.episode >= lastCanonEpisode - 12;
  let mangaAheadChapters: number | null = null;
  let mangaAheadUnits = 0;
  // continuation handoff: a same-manga sibling whose scope adjoins our scope
  // end continues the story — the residue between our frontier and scope end
  // is franchise flow (Shippuden adapted Naruto's ch 239-244), not a
  // "manga only" tail. Inter-segment reading gaps (Berserk 1997 ch 88-94
  // before 2016) surface in the universe view, not here.
  const residueHandedOff = continuationStartCh !== null;
  if (
    hasSource &&
    anchorsReachEnd &&
    !residueHandedOff &&
    effectiveTotalChapters &&
    coveredChapter &&
    adaptedSpan &&
    adaptedSpan > 0 &&
    canonEpisodes > 0 &&
    effectiveTotalChapters > coveredChapter
  ) {
    mangaAheadChapters = effectiveTotalChapters - coveredChapter;
    mangaAheadUnits = Math.round(mangaAheadChapters * (canonEpisodes / adaptedSpan));
  }

  return {
    airedEpisodes: aired,
    sourceType,
    spans,
    canonCount: counts.canon,
    mixedCount: counts.mixed,
    fillerCount: counts.filler,
    animeOnlyCount: counts['anime-only-canon'],
    fillerPercent: total > 0 ? Math.round((counts.filler / total) * 100) : 0,
    continueFrom,
    latestKnown,
    mangaAheadChapters,
    mangaAheadUnits,
  };

};
