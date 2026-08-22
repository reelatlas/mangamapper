// AFG expansion (Sean's YES, franchise-rulings + data-pipeline §12): AFG-only
// shows (Frieren, Solo Leveling…) become canonical series. AFL stays the type
// authority wherever it exists; here AFG's own 3-way taxonomy (red=filler,
// blue=mixed, plain=canon; no anime-canon) classifies episodes, with
// provenance via the identity registry (source 'afg'). All standard guards
// apply: exact-match-or-flag, sparse guard, alignment, scopes, registry.
// NOTE: staged AFG raw predating the type-parser lacks `type` — those pages
// re-parse on the next --force AFG sweep; this script re-fetches its targets
// live so types are always present.
//   npx tsx --env-file=.env.ingest scripts/ingest/afg-expansion.ts

import { AFG_BASE, parseAfgPage } from './lib/afg';
import { politeFetch } from './lib/http';
import { contentHash } from './lib/hash';
import { mediaByIds, searchAnime } from './lib/anilist';
import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import {
  stageAniList,
  registerIds,
  searchTextFor,
  applyScope,
  STATUS_MAP,
  MANGA_STATUS_MAP,
  sourceType,
  fuzzyDate,
  pickManga,
} from './lib/resolve';
import { syncAnchors } from './lib/anchors';
import { slugify } from './lib/slug';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const normalize = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();

async function main() {
  const runId = await startRun('afg');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];
  let created = 0;

  try {
    // targets: staged AFG pages with real episode lists, not already serving a canonical series
    const { data: pages } = await db.from('ingest_afg_pages').select('slug, raw, etag, last_modified');
    const { data: series } = await db.from('series').select('id, afl_slug, title');
    const taken = new Set<string>();
    for (const s of series ?? []) {
      if (s.afl_slug) taken.add(s.afl_slug);
      taken.add(s.id);
      taken.add(slugify(s.title));
    }
    const { data: afgReg } = await db.from('series_external_ids').select('external_id').eq('source', 'afg');
    for (const r of afgReg ?? []) taken.add(r.external_id);

    const targets = (pages ?? []).filter((p) => {
      const raw = p.raw as { title: string; episodes: unknown[] };
      return raw.episodes.length >= 6 && !taken.has(p.slug) && !taken.has(slugify(raw.title));
    });
    console.log(`[expansion] ${targets.length} AFG-only candidates`);

    for (const t of targets) {
      try {
        // fresh fetch so the typed parser output is guaranteed
        const res = await politeFetch(`${AFG_BASE}/anime/${t.slug}/`);
        counters.fetched++;
        if (res.status !== 200 || !res.html) {
          actions.push(`${t.slug}: HTTP ${res.status}`);
          continue;
        }
        const page = parseAfgPage(res.html);
        if (page.episodes.length < 6) continue;
        await db.from('ingest_afg_pages').upsert({
          slug: t.slug,
          raw: { title: page.title, seasons: page.seasons, episodes: page.episodes },
          content_hash: contentHash({ title: page.title, seasons: page.seasons, episodes: page.episodes }),
          etag: res.etag,
          last_modified: res.lastModified,
          fetched_at: new Date().toISOString(),
          changed_at: new Date().toISOString(),
        });

        // exact-match-or-flag against AniList (series formats preferred)
        const hits = await searchAnime(page.title);
        await sleep(800);
        const want = normalize(page.title);
        const SERIES_FORMATS = new Set(['TV', 'TV_SHORT', 'ONA']);
        const sorted = [...hits].sort(
          (a, b) => Number(SERIES_FORMATS.has(b.format ?? '')) - Number(SERIES_FORMATS.has(a.format ?? '')),
        );
        const hit = sorted.find((h) =>
          [h.title.romaji, h.title.english, h.title.native, ...h.synonyms]
            .filter(Boolean)
            .some((x) => normalize(String(x)) === want),
        );
        if (!hit) {
          await fileFlagOnce(runId, `afg:${t.slug}`, 'afg', 'match_ambiguous', {
            title: page.title,
            candidates: hits.map((h) => ({ id: h.id, romaji: h.title.romaji })),
          });
          counters.flagged++;
          actions.push(`${t.slug}: no exact AniList match — flagged`);
          continue;
        }

        const [media] = await mediaByIds([hit.id]);
        if (!media) continue;
        await stageAniList(media);

        const aired = media.nextAiringEpisode ? media.nextAiringEpisode.episode - 1 : media.episodes ?? 0;
        const afgMax = page.episodes.reduce((m, e) => Math.max(m, e.number), 0);
        if (aired && Math.abs(afgMax - aired) > 12) {
          await fileFlagOnce(runId, `afg:${t.slug}`, 'afg', 'count_mismatch', {
            afgMax,
            anilistAired: aired,
            note: 'AFG page numbering misaligned with matched entry — expansion withheld',
          });
          counters.flagged++;
          continue;
        }
        // sparse guard (same rule as the resolver's)
        if (media.status !== 'RELEASING' && media.episodes != null && page.episodes.length < media.episodes * 0.6) {
          await fileFlagOnce(runId, `afg:${t.slug}`, 'afg', 'count_mismatch', {
            sparse: true,
            afgClassified: page.episodes.length,
            anilistTotal: media.episodes,
          });
          counters.flagged++;
          continue;
        }

        const mangaEdge = pickManga(media);
        const manga = media.source === 'ORIGINAL' ? null : mangaEdge;
        const base = slugify(media.title.english ?? media.title.romaji ?? page.title);
        let id: string | null = null;
        for (const candidate of [base, `${base}-${media.startDate.year ?? ''}`, `${base}-${media.id}`]) {
          const clean = candidate.replace(/-$/, '');
          const { data: clash } = await db.from('series').select('id').eq('id', clean).maybeSingle();
          if (!clash) {
            id = clean;
            break;
          }
        }
        if (!id) continue;

        const row = {
          id,
          afl_slug: null,
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
          source_type: sourceType(media, mangaEdge !== null),
          start_date: fuzzyDate(media.startDate),
          end_date: fuzzyDate(media.endDate),
          season: media.season,
          season_year: media.seasonYear,
          total_episodes: media.episodes,
          aired_episodes: aired || afgMax,
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
          ...(await applyScope(`afg:${t.slug}`, {
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
        const { error: sErr } = await db.from('series').upsert(row);
        if (sErr) throw new Error(sErr.message);
        await registerIds(id, { anilist: media.id, mal: media.idMal, afg: t.slug });

        await db.from('episodes').delete().eq('series_id', id);
        const epRows = page.episodes.map((e) => ({
          series_id: id!,
          number: e.number,
          title: e.title,
          type: e.type, // AFG's 3-way; no anime-canon in their vocabulary
          air_date: null,
        }));
        for (let i = 0; i < epRows.length; i += 500) {
          const { error } = await db.from('episodes').insert(epRows.slice(i, i + 500));
          if (error) throw new Error(error.message);
        }
        await db.from('series_components').upsert({
          series_id: id,
          anilist_id: media.id,
          season_order: 1,
          episode_start: 1,
          episode_end: media.episodes ?? (aired || null),
          afl_slug: null,
          afl_offset: 0,
        });
        await syncAnchors(runId, id, t.slug, page);

        created++;
        counters.changed++;
        actions.push(`CREATED ${id} (${epRows.length} eps, anilist ${media.id})`);
      } catch (e) {
        actions.push(`${t.slug}: ERROR ${String(e).slice(0, 100)}`);
      }
    }

    await finishRun(runId, 'ok', counters, `afg expansion: ${created} series created`);
    console.log('\n=== AFG EXPANSION COMPLETE ===');
    for (const a of actions) console.log('  -', a);
    const { count } = await db.from('series').select('*', { count: 'exact', head: true });
    console.log(`canonical series: ${count} (+${created})`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
