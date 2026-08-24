import { supabase } from '@/integrations/supabase/client';
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
import {
  SERIES_COLS,
  toAnimeSeries,
  toEpisodes,
  volumeFor,
  type AnchorRow,
  type Boundary,
  type EpisodeRow,
  type SeriesRow,
  buildMapping,
  buildSpans,
} from './assemble';
import type { CatalogSource, ListOptions } from './source';

// The real catalog: canonical tables filled by scripts/ingest/ (AFL episode
// types + AniList metadata + AFG chapter anchors — docs/data-pipeline.md).
// The app reads ONLY this database; external APIs never appear on a user path.

// PostgREST caps selects at 1000 rows; long runs (One Piece) need paging.
async function allEpisodes(seriesId: string): Promise<EpisodeRow[]> {
  const out: EpisodeRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('episodes')
      .select('number, title, type, air_date')
      .eq('series_id', seriesId)
      .order('number')
      .range(from, from + 999);
    if (error) throw error;
    out.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return out;
}

async function allAnchors(seriesId: string): Promise<AnchorRow[]> {
  const out: AnchorRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('chapter_anchors')
      .select('episode, volume, chapter, start_chapter')
      .eq('series_id', seriesId)
      .order('episode')
      .range(from, from + 999);
    if (error) throw error;
    out.push(...((data ?? []) as AnchorRow[]));
    if (!data || data.length < 1000) break;
  }
  return out;
}

async function fetchSeriesRow(id: string): Promise<SeriesRow | null> {
  const { data, error } = await supabase.from('series').select(SERIES_COLS).eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as SeriesRow | null) ?? null;
}

// Same-manga continuation (segment model, Sean 2026-08-24): a sibling entry
// whose scope starts at/inside this entry's scope end continues the story
// (Naruto→Shippuden, Berserk 1997→2016) — the residue between our frontier
// and our scope end is adapted THERE, so it is a handoff, not a manga-only
// tail. Returns the continuation's first chapter, or null.
async function continuationStart(row: SeriesRow): Promise<number | null> {
  if (!row.manga_anilist_id || !row.total_chapters) return null;
  const { data } = await supabase
    .from('series')
    .select('manga_start_chapter')
    .eq('manga_anilist_id', row.manga_anilist_id)
    .neq('id', row.id)
    .not('manga_start_chapter', 'is', null);
  const ourStart = row.manga_start_chapter ?? 1;
  const starts = (data ?? [])
    .map((s) => s.manga_start_chapter as number)
    .filter((st) => st > ourStart && st <= row.total_chapters! + 1);
  return starts.length ? Math.min(...starts) : null;
}

export const supabaseCatalogSource: CatalogSource = {
  async list(options: ListOptions = {}) {
    let q = supabase.from('series').select(SERIES_COLS);
    if (options.status && options.status !== 'all') q = q.eq('status', options.status);
    q =
      options.sortBy === 'release_date'
        ? q.order('start_date', { ascending: false, nullsFirst: false })
        : q.order('popularity', { ascending: false });
    if (options.limit) q = q.limit(options.limit);
    const { data, error } = await q;
    if (error) throw error;
    // list stays shallow: episodes load when a card opens (getById/getMapping)
    return ((data ?? []) as SeriesRow[]).map((row, i) => toAnimeSeries(row, i + 1, []));
  },

  async search(query: string) {
    const term = query.trim();
    if (!term) return [];
    const pattern = `%${term.replace(/[%_]/g, '')}%`;
    const { data, error } = await supabase
      .from('series')
      .select(SERIES_COLS)
      .ilike('search_text', pattern)
      .order('popularity', { ascending: false })
      .limit(50);
    if (error) throw error;
    return ((data ?? []) as SeriesRow[]).map((row, i) => toAnimeSeries(row, i + 1, []));
  },

  async getById(id: string) {
    const row = await fetchSeriesRow(id);
    if (!row) return null;
    const [eps, anchors, boundaries] = await Promise.all([
      allEpisodes(id),
      allAnchors(id),
      allBoundaries(row.manga_anilist_id),
    ]);
    const { count } = await supabase
      .from('series')
      .select('*', { count: 'exact', head: true })
      .gt('popularity', row.popularity);
    return toAnimeSeries(row, (count ?? 0) + 1, toEpisodes(row, eps, anchors, boundaries), boundaries.length, boundaries);
  },

  async getMapping(id: string) {
    const row = await fetchSeriesRow(id);
    if (!row) return null;
    const [eps, anchors, boundaries, continuationStartCh] = await Promise.all([
      allEpisodes(id),
      allAnchors(id),
      allBoundaries(row.manga_anilist_id),
      continuationStart(row),
    ]);
    return buildMapping(row, eps, anchors, boundaries, continuationStartCh);
  },
};
