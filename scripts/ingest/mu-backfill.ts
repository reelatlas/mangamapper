// MangaUpdates backfill — UNIVERSAL targeting (Sean 2026-08-24: MU applies
// to ALL series as check + validation). Every manga behind a canonical
// series stages MU's payload; inline upkeep applies what MU knows:
//   - latest_chapter → latest_known_chapters (chapter-NUMBER space, all
//     manga — the publishing frontier AND the number-space end for finished
//     ones, since AniList's total is a COUNT including mid-run specials)
//   - anime-coverage field → frontier anchors via lib/mu-frontier (only
//     where anchors are absent/stale; scope-segment + progress guards)
//   - status/completed → manga_status cross-check (conflicts flag)
// Identity strictly via the MangaDex bridge (no title-guessing);
// unbridgeable manga flag for review. Freshness: refresh-mu edge cron
// (daily, ≤20 stalest, ~weekly cycle); this script = event trigger for new
// series and full re-syncs.
//   npx tsx --env-file=.env.ingest scripts/ingest/mu-backfill.ts

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { bridgeViaMangaDex, fetchMuSeries, muHash } from './lib/mangaupdates';
import { contentHash } from './lib/hash';
import { applyMuFrontier, crossCheckMangaStatus } from './lib/mu-frontier';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];
  try {
    // UNIVERSAL: every manga behind a canonical series (the DBZ 520-vs-519
    // display needed MU's number for a manga whose anchors were fresh, which
    // the old absent-or-stale filter skipped)
    const { data: linked } = await db
      .from('series')
      .select('id, title, manga_anilist_id, manga_status, total_chapters, popularity, aired_episodes')
      .not('manga_anilist_id', 'is', null)
      .order('popularity', { ascending: false });

    const byManga = new Map<number, { title: string; seriesIds: string[]; statuses: Map<string, string> }>();
    for (const s of linked ?? []) {
      const e = byManga.get(s.manga_anilist_id!) ?? { title: s.title, seriesIds: [], statuses: new Map() };
      if (!e.seriesIds.includes(s.id)) {
        e.seriesIds.push(s.id);
        e.statuses.set(s.id, s.manga_status);
      }
      byManga.set(s.manga_anilist_id!, e);
    }
    console.log(`[mu] ${byManga.size} manga targets (universal)`);

    for (const [mangaId, t] of byManga) {
      try {
        const { data: staged } = await db
          .from('ingest_mangaupdates')
          .select('mu_series_id, content_hash')
          .eq('manga_anilist_id', mangaId)
          .maybeSingle();

        let muId = staged?.mu_series_id as number | undefined;
        let bridge = null;
        if (!muId) {
          bridge = await bridgeViaMangaDex(mangaId, t.title);
          await sleep(1200);
          if (!bridge) {
            await fileFlagOnce(runId, `manga:${mangaId}`, 'mangaupdates', 'match_ambiguous', {
              title: t.title,
              note: 'no MangaDex bridge entry carrying both AniList and MU ids — MU denominator unavailable',
            });
            counters.flagged++;
            actions.push(`${t.title}: no bridge — flagged`);
            continue;
          }
          muId = bridge.muSeriesId;
        }

        const mu = await fetchMuSeries(muId);
        counters.fetched++;
        if (!mu) {
          actions.push(`${t.title}: MU fetch failed`);
          continue;
        }
        const hash = contentHash(muHash(mu));
        if (staged?.content_hash === hash) {
          counters.unchanged++;
          await db.from('ingest_mangaupdates').update({ fetched_at: new Date().toISOString() }).eq('manga_anilist_id', mangaId);
        } else {
          await db.from('ingest_mangaupdates').upsert({
            manga_anilist_id: mangaId,
            mu_series_id: muId,
            mu_slug: bridge?.muSlug ?? null,
            mangadex_uuid: bridge?.mangadexUuid ?? null,
            raw: mu,
            content_hash: hash,
            fetched_at: new Date().toISOString(),
            changed_at: new Date().toISOString(),
          });
          counters.changed++;
        }

        if (mu.latest_chapter && mu.latest_chapter > 0 && mu.latest_chapter < 10000) {
          // MU's last chapter NUMBER: the publishing frontier for ongoing
          // manga AND the number-space end for finished ones (AniList totals
          // are a COUNT that includes mid-run specials — AoT 141 vs 139)
          for (const sid of t.seriesIds) {
            await db.from('series').update({ latest_known_chapters: mu.latest_chapter, updated_at: new Date().toISOString() }).eq('id', sid);
          }
          actions.push(`${t.title}: latest ch ${mu.latest_chapter} ("${mu.status}")`);
        } else {
          actions.push(`${t.title}: MU has no usable latest_chapter`);
        }

        // inline upkeep (new-source checklist): frontier + status cross-check
        // land WITH the pull, never in a separate step someone must remember
        for (const sid of t.seriesIds) {
          const { data: srow } = await db
            .from('series')
            .select('id, aired_episodes, total_chapters, manga_start_chapter, manga_status')
            .eq('id', sid)
            .single();
          if (!srow) continue;
          const { data: epTop } = await db.from('chapter_anchors').select('episode').eq('series_id', sid).neq('source', 'mu').order('episode', { ascending: false }).limit(1);
          const { data: chTop } = await db.from('chapter_anchors').select('chapter').eq('series_id', sid).neq('source', 'mu').order('chapter', { ascending: false }).limit(1);
          await crossCheckMangaStatus(runId, sid, srow.manga_status, mu);
          await applyMuFrontier(srow, mu.anime?.end ?? null, epTop?.[0]?.episode, chTop?.[0]?.chapter);
        }
      } catch (e) {
        actions.push(`${t.title}: ERROR ${String(e).slice(0, 100)}`);
      }
    }

    await finishRun(runId, 'ok', counters, 'mangaupdates denominators');
    console.log('\n=== MU BACKFILL COMPLETE ===');
    for (const a of actions) console.log('  -', a);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
