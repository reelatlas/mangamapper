// Staging → canonical. Staging writes are hash-gated; anything suspicious
// files a flag and HOLDS (the previous data stands until Sean rules on it).
// Resolution rules live in docs/data-pipeline.md §2.

import { db, fileFlag, fileFlagOnce } from './db';
import { contentHash } from './hash';
import { slugify } from './slug';
import type { AflShowPage } from './afl';
import type { AniListMedia } from './anilist';

export type StageOutcome = 'unchanged' | 'changed' | 'held';

// >20% of previously known episode types changing in one pull is not how
// filler lists evolve — it's how parsers break. Hold for confirmation.
const LARGE_DIFF_RATIO = 0.2;

const decodeSlug = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

// Every name a series answers to, for search (english/romaji/native + synonyms).
export const searchTextFor = (parts: (string | null | undefined)[], synonyms: string[]): string =>
  [...new Set([...parts, ...synonyms].filter(Boolean).map((s) => String(s).toLowerCase()))].join(' ');

// Source-scope enforcement (DESIGN_SYSTEM §6): curated series_scopes rows
// override manga-wide totals with the entry's OWN range. Applied by every
// writer AND runnable standalone (scopes-apply) after curated edits.
export async function applyScope(
  aflSlug: string,
  fields: {
    total_volumes: number | null;
    total_chapters: number | null;
    manga_start_volume: number | null;
    manga_start_chapter: number | null;
  },
) {
  const { data: scope } = await db.from('series_scopes').select('*').eq('afl_slug', aflSlug).maybeSingle();
  if (!scope) return fields;
  return {
    total_volumes: scope.end_volume ?? fields.total_volumes,
    total_chapters: scope.end_chapter ?? fields.total_chapters,
    manga_start_volume: scope.start_volume ?? fields.manga_start_volume,
    manga_start_chapter: scope.start_chapter ?? fields.manga_start_chapter,
  };
}

// The identity registry (data-pipeline.md): external ids map INTO our id.
// A different series already holding the id is a hard error — the exact
// cross-source mixup the registry exists to prevent.
export async function registerIds(
  seriesId: string,
  ids: Record<string, string | number | null | undefined>,
) {
  for (const [source, val] of Object.entries(ids)) {
    if (val == null) continue;
    const external_id = String(val);
    const { error } = await db.from('series_external_ids').insert({ series_id: seriesId, source, external_id });
    if (!error) continue;
    if (error.code !== '23505') throw new Error(`registerIds(${seriesId}/${source}): ${error.message}`);
    const { data: existing } = await db
      .from('series_external_ids')
      .select('series_id, external_id')
      .eq('source', source)
      .eq('external_id', external_id)
      .maybeSingle();
    if (existing && existing.series_id !== seriesId) {
      throw new Error(
        `ID COLLISION: ${source}:${external_id} already maps to "${existing.series_id}", refused for "${seriesId}"`,
      );
    }
    if (!existing) {
      // (series_id, source) unique hit: this series' id for the source changed
      await db
        .from('series_external_ids')
        .update({ external_id })
        .eq('series_id', seriesId)
        .eq('source', source);
    }
  }
}

const STOP = new Set(['the', 'a', 'an', 'of', 'on', 'in', 'to', 'and', 'no', 'wa', 'ga']);
const titleTokens = (s: string) =>
  new Set(
    decodeSlug(s)
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter((w) => w && !STOP.has(w)),
  );

// Loose match: enough shared tokens that this is plausibly the same show.
export function titlesAgree(a: string, b: string): boolean {
  const ta = titleTokens(a);
  const tb = titleTokens(b);
  if (!ta.size || !tb.size) return true;
  let hit = 0;
  for (const w of ta) if (tb.has(w)) hit++;
  return hit / Math.min(ta.size, tb.size) >= 0.5;
}

export async function stageAfl(
  runId: number,
  slug: string,
  page: AflShowPage,
  meta: { etag: string | null; lastModified: string | null; expectedTitle?: string },
): Promise<StageOutcome> {
  // AFL alias corruption, two forms (both real, 2026-08-22): the URL serves
  // another show's page. Episode links betray it when the node kept its true
  // alias; when Drupal swapped the primary alias the links lie too, and only
  // the index-anchor title exposes it. Never stage another show's data.
  const aliasMismatch = page.canonicalSlug && decodeSlug(page.canonicalSlug) !== decodeSlug(slug);
  const titleMismatch = meta.expectedTitle && !titlesAgree(meta.expectedTitle, page.title);
  if (aliasMismatch || titleMismatch) {
    await fileFlagOnce(runId, slug, 'afl', 'parse_integrity', {
      aliasServes: page.canonicalSlug,
      servedTitle: page.title,
      expectedTitle: meta.expectedTitle ?? null,
    });
    return 'held';
  }

  const raw = { title: page.title, episodes: page.episodes, quickList: page.quickList };
  const hash = contentHash(raw);

  const { data: prev, error: readErr } = await db
    .from('ingest_afl_shows')
    .select('raw, content_hash')
    .eq('slug', slug)
    .maybeSingle();
  if (readErr) throw new Error(`stageAfl read (${slug}): ${readErr.message}`);

  if (prev?.content_hash === hash) return 'unchanged';

  if (prev) {
    const oldTypes = new Map(
      (prev.raw as { episodes: { number: number; type: string }[] }).episodes.map((e) => [e.number, e.type]),
    );
    const changedTypes = page.episodes.filter(
      (e) => oldTypes.has(e.number) && oldTypes.get(e.number) !== e.type,
    ).length;
    if (oldTypes.size > 0 && changedTypes / oldTypes.size > LARGE_DIFF_RATIO) {
      await fileFlag(runId, slug, 'afl', 'large_diff', {
        changedTypes,
        previousCount: oldTypes.size,
        proposed: raw,
      });
      return 'held';
    }
  }

  const { error } = await db.from('ingest_afl_shows').upsert({
    slug,
    raw,
    content_hash: hash,
    etag: meta.etag,
    last_modified: meta.lastModified,
    fetched_at: new Date().toISOString(),
    changed_at: new Date().toISOString(),
  });
  if (error) throw new Error(`stageAfl write (${slug}): ${error.message}`);
  return 'changed';
}

export async function stageAniList(media: AniListMedia): Promise<StageOutcome> {
  const hash = contentHash(media);
  const { data: prev, error: readErr } = await db
    .from('ingest_anilist_media')
    .select('content_hash')
    .eq('anilist_id', media.id)
    .maybeSingle();
  if (readErr) throw new Error(`stageAniList read (${media.id}): ${readErr.message}`);
  if (prev?.content_hash === hash) {
    await db.from('ingest_anilist_media').update({ fetched_at: new Date().toISOString() }).eq('anilist_id', media.id);
    return 'unchanged';
  }
  const { error } = await db.from('ingest_anilist_media').upsert({
    anilist_id: media.id,
    raw: media,
    content_hash: hash,
    fetched_at: new Date().toISOString(),
    changed_at: new Date().toISOString(),
  });
  if (error) throw new Error(`stageAniList write (${media.id}): ${error.message}`);
  return 'changed';
}

const STATUS_MAP: Record<string, string> = {
  RELEASING: 'airing',
  FINISHED: 'finished',
  HIATUS: 'hiatus',
  NOT_YET_RELEASED: 'upcoming',
  CANCELLED: 'finished',
};

const MANGA_STATUS_MAP: Record<string, string> = {
  RELEASING: 'publishing',
  FINISHED: 'finished',
  HIATUS: 'hiatus',
  NOT_YET_RELEASED: 'publishing',
  CANCELLED: 'finished',
};

function sourceType(media: AniListMedia): string {
  const src = media.source ?? '';
  if (src === 'MANGA' || src === 'DOUJINSHI' || src === 'ONE_SHOT') {
    return media.countryOfOrigin === 'KR' || media.countryOfOrigin === 'CN' ? 'webtoon' : 'manga';
  }
  if (src === 'LIGHT_NOVEL' || src === 'NOVEL' || src === 'WEB_NOVEL') return 'light_novel';
  return 'original';
}

function fuzzyDate(d: { year: number | null; month: number | null; day: number | null }): string | null {
  // Display only uses years; month/day default to 1 when AniList omits them.
  if (!d.year) return null;
  return `${d.year}-${String(d.month ?? 1).padStart(2, '0')}-${String(d.day ?? 1).padStart(2, '0')}`;
}

// The source manga: ADAPTATION edge, format MANGA, most popular on ties.
function pickManga(media: AniListMedia) {
  const candidates = media.relations.edges
    .filter((e) => e.relationType === 'ADAPTATION' && e.node.type === 'MANGA' && e.node.format === 'MANGA')
    .sort((a, b) => (b.node.popularity ?? 0) - (a.node.popularity ?? 0));
  return candidates[0]?.node ?? null;
}

// A season of natural lag between AFL's classified count and AniList's aired
// count is noise; more than that deserves eyes. Informational — resolve proceeds.
const COUNT_MISMATCH_THRESHOLD = 12;

export async function resolveSeries(runId: number, slug: string): Promise<{ episodes: number; flagged: boolean }> {
  const [{ data: afl, error: e1 }, { data: map, error: e2 }] = await Promise.all([
    db.from('ingest_afl_shows').select('raw').eq('slug', slug).maybeSingle(),
    db.from('source_map').select('anilist_id, mal_id').eq('afl_slug', slug).maybeSingle(),
  ]);
  if (e1 || e2) throw new Error(`resolve read (${slug}): ${(e1 ?? e2)!.message}`);
  if (!afl || !map?.anilist_id) throw new Error(`resolve (${slug}): missing staging or mapping`);

  const { data: alRow, error: e3 } = await db
    .from('ingest_anilist_media')
    .select('raw')
    .eq('anilist_id', map.anilist_id)
    .maybeSingle();
  if (e3) throw new Error(`resolve read anilist (${slug}): ${e3.message}`);
  if (!alRow) throw new Error(`resolve (${slug}): AniList ${map.anilist_id} not staged`);

  const media = alRow.raw as AniListMedia;
  const page = afl.raw as AflShowPage;

  // A show AFL hasn't classified yet has nothing for us to map — hold rather
  // than publish an empty instrument.
  if (page.episodes.length === 0) {
    await fileFlagOnce(runId, slug, 'resolve', 'parse_integrity', { empty: true });
    return { episodes: 0, flagged: true };
  }

  const manga = pickManga(media);

  // A STITCHED series (multiple components) is owned by the stitcher — a
  // plain resolve would collapse it back to one season. Refresh only the
  // episode rows (AFL's data) and leave the aggregate to the next stitch run.
  const { data: existing } = await db.from('series').select('id').eq('afl_slug', slug).maybeSingle();
  if (existing) {
    const { count: compCount } = await db
      .from('series_components')
      .select('*', { count: 'exact', head: true })
      .eq('series_id', existing.id);
    if ((compCount ?? 0) > 1) {
      await db.from('episodes').delete().eq('series_id', existing.id);
      const stitchedRows = page.episodes.map((e) => ({
        series_id: existing.id,
        number: e.number,
        title: e.title,
        type: e.type,
        air_date: e.airDate,
      }));
      for (let i = 0; i < stitchedRows.length; i += 500) {
        const { error } = await db.from('episodes').insert(stitchedRows.slice(i, i + 500));
        if (error) throw new Error(`episodes refresh (${slug}): ${error.message}`);
      }
      await db.from('series').update({ updated_at: new Date().toISOString() }).eq('id', existing.id);
      return { episodes: stitchedRows.length, flagged: false };
    }
  }

  // Canonical id is OUR slug: once assigned to this afl_slug it is stable
  // (app identity survives AFL renames); new series slugify their title, with
  // year → anilist id as collision tiebreakers.
  const { data: prior } = await db.from('series').select('id').eq('afl_slug', slug).maybeSingle();
  let id = prior?.id ?? null;
  if (!id) {
    const base = slugify(media.title.english ?? media.title.romaji ?? page.title);
    for (const candidate of [base, `${base}-${media.startDate.year ?? ''}`, `${base}-${media.id}`]) {
      const clean = candidate.replace(/-$/, '');
      const { data: clash } = await db.from('series').select('afl_slug').eq('id', clean).maybeSingle();
      if (!clash || clash.afl_slug === slug) {
        id = clean;
        break;
      }
    }
    if (!id) throw new Error(`resolve (${slug}): could not assign id`);
  }

  const aflMax = page.episodes.reduce((m, e) => Math.max(m, e.number), 0);
  const anilistAired = media.nextAiringEpisode
    ? media.nextAiringEpisode.episode - 1
    : media.episodes ?? aflMax;

  // Sparse-classification hold (2026-08-22): some AFL pages were never fully
  // classified by the community (Kinnikuman: 4 of 137). A FINISHED show with
  // under 60% coverage publishes a misleading strip — hold it; it returns
  // automatically once AFL classification grows past the bar.
  if (
    media.status !== 'RELEASING' &&
    media.episodes != null &&
    page.episodes.length < media.episodes * 0.6
  ) {
    await fileFlagOnce(runId, slug, 'resolve', 'count_mismatch', {
      sparse: true,
      aflClassified: page.episodes.length,
      anilistTotal: media.episodes,
    });
    return { episodes: 0, flagged: true };
  }

  let flagged = false;
  if (Math.abs(anilistAired - aflMax) > COUNT_MISMATCH_THRESHOLD) {
    await fileFlag(runId, slug, 'resolve', 'count_mismatch', {
      aflClassified: aflMax,
      anilistAired,
    });
    flagged = true;
  }

  const series = {
    id,
    afl_slug: slug,
    anilist_id: media.id,
    mal_id: media.idMal,
    title: media.title.english ?? media.title.romaji ?? page.title,
    title_english: media.title.english,
    title_native: media.title.native,
    synonyms: media.synonyms,
    cover_url: media.coverImage.extraLarge,
    cover_color: media.coverImage.color,
    banner_url: media.bannerImage,
    format: media.format,
    status: STATUS_MAP[media.status] ?? 'finished',
    source_type: sourceType(media),
    start_date: fuzzyDate(media.startDate),
    end_date: fuzzyDate(media.endDate),
    season: media.season,
    season_year: media.seasonYear,
    total_episodes: media.episodes,
    aired_episodes: anilistAired,
    next_airing_at: media.nextAiringEpisode
      ? new Date(media.nextAiringEpisode.airingAt * 1000).toISOString()
      : null,
    duration_min: media.duration,
    average_score: media.averageScore,
    mean_score: media.meanScore,
    popularity: media.popularity,
    favourites: media.favourites,
    trending: media.trending,
    genres: media.genres,
    tags: media.tags,
    studios: media.studios.nodes.map((s) => s.name),
    is_adult: media.isAdult,
    synopsis_html: media.description,
    external_links: media.externalLinks,
    manga_anilist_id: manga?.id ?? null,
    manga_status: manga ? MANGA_STATUS_MAP[manga.status ?? ''] ?? 'publishing' : 'anime_only',
    ...(await applyScope(slug, {
      total_volumes: manga?.volumes ?? null,
      total_chapters: manga?.chapters ?? null,
      manga_start_volume: null,
      manga_start_chapter: null,
    })),
    search_text: searchTextFor(
      [media.title.english, media.title.romaji, media.title.native, page.title],
      media.synonyms,
    ),
    updated_at: new Date().toISOString(),
  };

  const { error: e4 } = await db.from('series').upsert(series);
  if (e4) throw new Error(`series upsert (${slug}): ${e4.message}`);
  await registerIds(id, { anilist: media.id, mal: media.idMal, afl: slug });

  // Full replace: episode sets only ever change via a staging write that
  // already passed the hash/large-diff gates.
  const { error: e5 } = await db.from('episodes').delete().eq('series_id', id);
  if (e5) throw new Error(`episodes clear (${slug}): ${e5.message}`);
  const rows = page.episodes.map((e) => ({
    series_id: id,
    number: e.number,
    title: e.title,
    type: e.type,
    air_date: e.airDate,
  }));
  for (let i = 0; i < rows.length; i += 500) {
    const { error: e6 } = await db.from('episodes').insert(rows.slice(i, i + 500));
    if (e6) throw new Error(`episodes insert (${slug}): ${e6.message}`);
  }

  // Baseline component row — kept in step by every resolve; the stitcher
  // replaces these with full chains for multi-season series.
  const { error: e7 } = await db.from('series_components').upsert({
    series_id: id,
    anilist_id: media.id,
    season_order: 1,
    episode_start: 1,
    episode_end: media.episodes ?? anilistAired ?? null,
    afl_slug: slug,
    afl_offset: 0,
  });
  if (e7) throw new Error(`component (${slug}): ${e7.message}`);

  return { episodes: rows.length, flagged };
}
