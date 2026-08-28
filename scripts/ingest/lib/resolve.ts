// Staging → canonical. Staging writes are hash-gated; anything suspicious
// files a flag and HOLDS (the previous data stands until Sean rules on it).
// Resolution rules live in docs/data-pipeline.md §2.

import { db, fileFlag, fileFlagOnce, selectAll } from './db';
import { contentHash } from './hash';
import { slugify } from './slug';
import type { AflShowPage } from './afl';
import type { AniListMedia } from './anilist';
// Standing per-series rulings (T2.1): the records live in rulings/, each
// file exports the consumer lookup; re-exported below at the old names.
import { EXTRAS_ADOPTED } from './rulings/extras-adopted';
import { COMMUNITY_COUNT_OVERRIDES } from './rulings/community-counts';
import { SOURCE_NUMBERING_SHIFTS, applyNumberingShift } from './rulings/numbering-shifts';
import { EPISODE_TYPE_OVERRIDES } from './rulings/episode-types';

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

// Volatile-field refresh for STITCHED series (the daily AniList sweep):
// aggregates recompute from the components' freshly staged media without
// touching the stitcher's structure. Single-season series use resolveSeries.
// Episode-floor invariant (Sean 2026-08-24: displayed totals can NEVER be
// lower than our own episode numbering). Small overshoots (≤2: recap/ep-0
// numbering) floor automatically — a lumped multi-season page overshoots by
// a whole cour, so they can't be confused. Larger overshoots floor only once
// RULED (Sean's confirm loop via reconcile-structure flags); until then the
// flag is the research trigger. Every totals writer applies this.
export { EXTRAS_ADOPTED } from './rulings/extras-adopted';
export { AIR_DATE_OVERRIDES } from './rulings/air-dates';
import { AIR_DATE_OVERRIDES } from './rulings/air-dates';
import { EPISODE_TITLE_OVERRIDES } from './rulings/episode-titles';
import { aflAnimeCanonStanding, deriveSourceKind, mangaStatusOf } from './rulings/source-kinds';
import { withholdAirdateRegressions, type AirdateWithheld } from './airdate-order';

// Community-count rulings (Sean 2026-08-24: the community-consensus episode
// count is the truth — specials/ep-0s the community numbers are IN; large
// events it does not number are order-only components). Per-series caps for
// cases where a source numbers content the community consensus does not:
//   psycho-pass: AFL numbers First Inspector as 42-44, but community treats
//   it + the films as watch-order events → 41 episodes (Sean's ruling).
//   monogatari-series: AniList's Second Season count includes 3 recaps the
//   community numbering excludes → 100.
// Enforced at every episode-row write (rows above the cap are dropped) and
// as a totals clamp after the floor.
export { COMMUNITY_COUNT_OVERRIDES } from './rulings/community-counts';

export function applyCommunityCap(
  seriesId: string,
  row: { aired_episodes?: number | null; total_episodes?: number | null },
) {
  const o = COMMUNITY_COUNT_OVERRIDES[seriesId];
  if (!o) return;
  if (row.aired_episodes != null) row.aired_episodes = Math.min(row.aired_episodes, o.cap);
  if (row.total_episodes != null) row.total_episodes = Math.min(row.total_episodes, o.cap);
}

// Research-ruled per-episode TYPE corrections (Sean 2026-08-23): where a
// source site misclasses episodes against community consensus, the ruling
// lives here and re-applies on every episode write — a bare DB update would
// be clobbered by the next AFL page refresh. Each entry carries citations —
// the records live in rulings/episode-types.ts (T2.1).
export { EPISODE_TYPE_OVERRIDES } from './rulings/episode-types';

// Research-ruled SOURCE SUPPRESSIONS (2026-08-23, the Claymore/Kimi lesson):
// same-episode precedence cannot stop a ruled-WRONG source value landing on
// a DIFFERENT episode — when research proves a source's frontier wrong for a
// series, that source is suppressed there entirely. Applied by the source's
// writer; verified outcome-side by the ruling_violation audit.
export { CONTINUA_SUPPRESSED } from './rulings/continua-suppressed';

// SOURCE NUMBERING TRANSLATION (Sean's ruling 2026-08-23, the Dr. Stone /
// Ryuusui lesson): a source that NUMBERS an entry our community count holds
// order-only lives in a different numbering space — its rows past the
// insert must shift into ours, and the insert's own row drops (it exists as
// a watch-order component, never an episode). Without this, titles AND
// types downstream of the insert are silently off by the insert's length.
//   drop: source-space numbers whose rows are the order-only entry itself
//   shifts: source number n ≥ from maps to our number n + offset
//   spaces (optional, 2026-08-25 the mashle lesson): the SOURCE SPACES the
//   shift applies to ('afl' | 'afg' | 'wiki'). Absent = every space (the
//   historical entries: AFL and AFG both number the dropped entry). Sources
//   can genuinely disagree about one series' numbering — mashle's recap is
//   integer ep 7 on AFL but "6.5" (excluded) on AFG/fandom/Wikipedia — so a
//   blanket shift would corrupt the already-aligned source. Every caller
//   states its space; the shift skips spaces it does not name.
export { SOURCE_NUMBERING_SHIFTS } from './rulings/numbering-shifts';

// Translate ONE source-space episode number into ours (null = the number IS
// a dropped order-only entry). Anchor/annotation writers use this so a
// shift-ruled series (Bungo's OVA row, Dr. Stone's Ryuusui) can never
// receive per-episode data at untranslated numbers — the same rule
// filterEpisodeRows applies to episode rows (gap closed 2026-08-23,
// Sean's bake-into-sources directive).
export const translateEpisodeNumber = (seriesId: string, n: number, space: string): number | null => {
  const t = SOURCE_NUMBERING_SHIFTS[seriesId];
  if (!t || (t.spaces && !t.spaces.includes(space))) return n;
  if (t.drop.includes(n)) return null;
  // a resort span is translated by payload POSITION, which a bare number cannot carry — refuse (the caller treats null as "no claim")
  if (t.resort && n >= t.resort.from && n <= t.resort.to) return null;
  return n + t.shifts.reduce((s, x) => (n >= x.from ? s + x.offset : s), 0);
};

// Per-series episode-row rulings, applied by EVERY episode writer:
// source-numbering translation first, then community caps, then type
// overrides.
export const filterEpisodeRows = <T extends { number: number; type?: string; air_date?: string | null }>(
  seriesId: string,
  rows: T[],
  space: string,
  opts?: { onAirdateWithheld?: (withheld: AirdateWithheld[]) => void; sourceType?: string | null },
): T[] => {
  const t0 = SOURCE_NUMBERING_SHIFTS[seriesId];
  const t = t0 && (!t0.spaces || t0.spaces.includes(space)) ? t0 : undefined;
  // N11: resort (payload order) → collapse exact duplicates → drop → shifts (lib/rulings/numbering-shifts.ts, pure)
  const translated = t ? applyNumberingShift(t, rows) : applyNumberingShift({ drop: [], shifts: [] }, rows);
  const o = COMMUNITY_COUNT_OVERRIDES[seriesId];
  const capped = o ? translated.filter((r) => r.number <= o.cap) : translated;
  // T27 (T4.3): AFL's `anime_canon` class ('anime-only-canon' in staging, kept
  // there — G51) is not a stored standing; it maps by the series' source kind
  // (original / game → canon, sourced series → filler) BEFORE the T6 rulings,
  // which then win row by row. No sourceType → filler (fail closed).
  const standing = aflAnimeCanonStanding(opts?.sourceType);
  const stood = capped.map((r) => ('type' in r && r.type === 'anime-only-canon' ? { ...r, type: standing } : r));
  const types = EPISODE_TYPE_OVERRIDES[seriesId];
  const dates = AIR_DATE_OVERRIDES[seriesId]; // G53: ruled air dates re-applied at every write (a ruled NULL is a value)
  const titles = EPISODE_TITLE_OVERRIDES[seriesId]; // G53: a transposition carries the title with the date
  const ruled = !types && !dates && !titles ? stood : stood.map((r) => {
    let out = r;
    if (types?.[r.number] && 'type' in r) out = { ...out, type: types[r.number] };
    if (dates && Object.prototype.hasOwnProperty.call(dates, r.number) && 'air_date' in r) out = { ...out, air_date: dates[r.number] };
    if (titles?.[r.number] && 'title' in r) out = { ...out, title: titles[r.number] };
    return out;
  });
  // G54: after the ruled dates land, a date a year or more out of order
  // against its neighbours is withheld (NULL), never stored (P6)
  const gated = withholdAirdateRegressions(seriesId, ruled);
  if (gated.withheld.length) opts?.onAirdateWithheld?.(gated.withheld);
  return gated.rows;
};

// G54 write-side flag: the withheld dates, filed once per series so the
// confirm queue holds the proposed (wrong) value without a re-scrape.
export async function flagAirdateWithheld(runId: number, seriesKey: string, source: string, withheld: AirdateWithheld[]) {
  await fileFlagOnce(runId, seriesKey, source, 'airdate_withheld', {
    rule: 'G54',
    rows: withheld.map((w) => ({ episode: w.number, withheld: w.date, against: w.against, againstDate: w.againstDate, days: w.days })),
  });
}

export function applyEpisodeFloor(
  seriesId: string,
  row: { aired_episodes?: number | null; total_episodes?: number | null },
  epMax: number,
) {
  if (!epMax) return;
  const aired = row.aired_episodes ?? 0;
  const overshoot = epMax - Math.max(aired, row.total_episodes ?? 0);
  if (overshoot <= 0) return;
  if (overshoot > 2 && !EXTRAS_ADOPTED.has(seriesId)) return; // flag-first: research before adopting
  row.aired_episodes = Math.max(aired, epMax);
  if (row.total_episodes != null) row.total_episodes = Math.max(row.total_episodes, epMax);
}

export async function refreshStitchedVolatile(seriesId: string) {
  // order-only components (null episode range — Kizu movies, Psycho-Pass
  // films) hold watch-order positions and NEVER count toward aired/totals
  const comps = await selectAll<{ anilist_id: number }>('series_components', 'anilist_id', (q) =>
    q.eq('series_id', seriesId).not('episode_start', 'is', null),
  );
  if (!comps.length) return;
  const media: AniListMedia[] = [];
  for (const c of comps) {
    const { data } = await db.from('ingest_anilist_media').select('raw').eq('anilist_id', c.anilist_id).maybeSingle();
    if (data) media.push(data.raw as AniListMedia);
  }
  if (!media.length) return;
  const aired = (m: AniListMedia) => (m.nextAiringEpisode ? m.nextAiringEpisode.episode - 1 : m.episodes ?? 0);
  const statuses = new Set(media.map((m) => m.status));
  const releasing = media.find((m) => m.status === 'RELEASING');
  const weightSum = media.reduce((s, m) => s + m.popularity, 0) || 1;
  const { data: topEp } = await db
    .from('episodes')
    .select('number')
    .eq('series_id', seriesId)
    .order('number', { ascending: false })
    .limit(1);
  const volatile = {
    aired_episodes: media.reduce((s, m) => s + aired(m), 0),
    total_episodes: media.every((m) => m.episodes != null) ? media.reduce((s, m) => s + (m.episodes ?? 0), 0) : null,
  };
  applyEpisodeFloor(seriesId, volatile, topEp?.[0]?.number ?? 0);
  applyCommunityCap(seriesId, volatile);
  await db
    .from('series')
    .update({
      ...volatile,
      status: statuses.has('RELEASING')
        ? 'airing'
        : statuses.has('NOT_YET_RELEASED')
          ? 'upcoming'
          : statuses.has('HIATUS')
            ? 'hiatus'
            : 'finished',
      next_airing_at: releasing?.nextAiringEpisode
        ? new Date(releasing.nextAiringEpisode.airingAt * 1000).toISOString()
        : null,
      popularity: Math.max(...media.map((m) => m.popularity)),
      average_score: Math.round(media.reduce((s, m) => s + (m.averageScore ?? 0) * m.popularity, 0) / weightSum) || null,
      trending: Math.max(...media.map((m) => m.trending ?? 0)) || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', seriesId);
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

export const STATUS_MAP: Record<string, string> = {
  RELEASING: 'airing',
  FINISHED: 'finished',
  HIATUS: 'hiatus',
  NOT_YET_RELEASED: 'upcoming',
  CANCELLED: 'finished',
};

// T22 vocabulary lives with the source registry (pure, shared with the app);
// re-exported here so existing writers keep their import.
export { MANGA_STATUS_MAP, mangaStatusOf } from './rulings/source-kinds';

// T25 (T4.1): source_type is DERIVED by the registry — AniList source × the
// picked manga node's country × SOURCE_TYPE_OVERRIDES — and fails closed
// (null + flag) on anything unregistered. chain.ts#aggregate calls the same
// function (the T2 unification, no values invented outside the registry).
export function sourceType(seriesId: string, media: AniListMedia, mangaNode: AniListMedia['relations']['edges'][number]['node'] | null | undefined) {
  return deriveSourceKind(seriesId, {
    source: media.source,
    mangaCountry: mangaNode ? mangaNode.countryOfOrigin : null,
    hasMangaEdge: !!mangaNode,
  });
}

export function fuzzyDate(d: { year: number | null; month: number | null; day: number | null }): string | null {
  // Display only uses years; month/day default to 1 when AniList omits them.
  if (!d.year) return null;
  return `${d.year}-${String(d.month ?? 1).padStart(2, '0')}-${String(d.day ?? 1).padStart(2, '0')}`;
}

// The source manga: ADAPTATION edge, format MANGA, most popular on ties.
export function pickManga(media: AniListMedia) {
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

  // AniList's ADAPTATION edge is DIRECTIONLESS: on an anime-original show
  // (source=ORIGINAL) the linked manga is an adaptation OF the anime, not
  // source material — never attach it (Evangelion/Madoka class, 2026-08-23).
  const mangaEdge = pickManga(media);
  const manga = media.source === 'ORIGINAL' ? null : mangaEdge;

  // A STITCHED series (multiple components) is owned by the stitcher — a
  // plain resolve would collapse it back to one season. Refresh only the
  // episode rows (AFL's data) and leave the aggregate to the next stitch run.
  const { data: existing } = await db.from('series').select('id, source_type').eq('afl_slug', slug).maybeSingle();
  if (existing) {
    const { count: compCount } = await db
      .from('series_components')
      .select('*', { count: 'exact', head: true })
      .eq('series_id', existing.id);
    if ((compCount ?? 0) > 1) {
      // MERGE, not full replace: AFL owns only its own numbering range —
      // rows beyond it (AFG-filled tails, curated specials) must survive a
      // page refresh. The boundary uses the TRANSLATED max: AFL's numbering
      // can sit +N of ours past an order-only insert (Ryuusui), and
      // deleting to the source-space max would eat rows the translation
      // doesn't refill.
      let stitchedWithheld: AirdateWithheld[] = [];
      const stitchedRows = filterEpisodeRows(
        existing.id,
        page.episodes.map((e) => ({
          series_id: existing.id,
          number: e.number,
          title: e.title,
          type: e.type,
          air_date: e.airDate,
        })),
        'afl',
        { onAirdateWithheld: (w) => (stitchedWithheld = w), sourceType: existing.source_type },
      );
      if (stitchedWithheld.length) await flagAirdateWithheld(runId, slug, 'afl', stitchedWithheld);
      const ourPageMax = stitchedRows.reduce((m, e) => Math.max(m, e.number), 0);
      await db.from('episodes').delete().eq('series_id', existing.id).lte('number', ourPageMax);
      // STALE-ZONE healing (Sean 2026-08-23): when translation SHRINKS the
      // range (ourMax < source max), rows stranded in (ourMax, sourceMax]
      // are pre-translation leftovers wearing shifted titles — purge them
      // (an AFG tail re-extends; stale wrong data never self-heals)
      const srcMax = page.episodes.reduce((m, e) => Math.max(m, e.number), 0);
      if (srcMax > ourPageMax) {
        await db.from('episodes').delete().eq('series_id', existing.id).gt('number', ourPageMax).lte('number', srcMax);
      }
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

  // T25: source kind from the registry; fail closed — an unregistered
  // AniList source / country is a ruling (flag), never a default
  const derived = sourceType(id, media, mangaEdge);
  if (!derived.value) {
    await fileFlagOnce(runId, slug, 'resolve', 'source_kind_unknown', { anilistSource: media.source, mangaCountry: mangaEdge?.countryOfOrigin ?? null, reason: derived.reason });
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
    source_type: derived.value,
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
    manga_status: mangaStatusOf(manga),
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
  applyEpisodeFloor(id, series, aflMax);
  applyCommunityCap(id, series);

  const { error: e4 } = await db.from('series').upsert(series);
  if (e4) throw new Error(`series upsert (${slug}): ${e4.message}`);
  await registerIds(id, { anilist: media.id, mal: media.idMal, afl: slug });

  // MERGE within AFL's own numbering range (staging writes already passed
  // the hash/large-diff gates); rows beyond aflMax — AFG tails, curated
  // specials — survive. Community-count caps drop rows the consensus does
  // not number (Psycho-Pass 42-44).
  let withheld: AirdateWithheld[] = [];
  const rows = filterEpisodeRows(id, page.episodes.map((e) => ({
    series_id: id,
    number: e.number,
    title: e.title,
    type: e.type,
    air_date: e.airDate,
  })), 'afl', { onAirdateWithheld: (w) => (withheld = w), sourceType: derived.value });
  if (withheld.length) await flagAirdateWithheld(runId, slug, 'afl', withheld);
  // translated-max boundary (see the stitched-guard note): never delete past
  // what the translated rows refill
  const ourMax = rows.reduce((m, e) => Math.max(m, e.number), 0) || aflMax;
  const { error: e5 } = await db.from('episodes').delete().eq('series_id', id).lte('number', ourMax);
  if (e5) throw new Error(`episodes clear (${slug}): ${e5.message}`);
  // stale-zone healing (see the stitched-guard note)
  if (aflMax > ourMax) {
    await db.from('episodes').delete().eq('series_id', id).gt('number', ourMax).lte('number', aflMax);
  }
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
