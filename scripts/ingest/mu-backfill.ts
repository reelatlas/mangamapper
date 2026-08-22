// MangaUpdates backfill (cross-check tier): latest published chapter for
// ONGOING manga behind canonical series whose total_chapters is null — the
// position-row denominator AniList cannot provide. Identity strictly via the
// MangaDex bridge (no title-guessing); unbridgeable manga flag for review.
// Refresh policy: event/manual (validation-tier ruling), re-run when anchors
// approach latest_known or on demand.
//   npx tsx --env-file=.env.ingest scripts/ingest/mu-backfill.ts

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { bridgeViaMangaDex, fetchMuSeries } from './lib/mangaupdates';
import { contentHash } from './lib/hash';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];
  try {
    const { data: series } = await db
      .from('series')
      .select('id, title, manga_anilist_id, manga_status, total_chapters, popularity')
      .eq('manga_status', 'publishing')
      .is('total_chapters', null)
      .not('manga_anilist_id', 'is', null)
      .order('popularity', { ascending: false });

    const byManga = new Map<number, { title: string; seriesIds: string[] }>();
    for (const s of series ?? []) {
      const e = byManga.get(s.manga_anilist_id!) ?? { title: s.title, seriesIds: [] };
      e.seriesIds.push(s.id);
      byManga.set(s.manga_anilist_id!, e);
    }
    console.log(`[mu] ${byManga.size} ongoing manga targets`);

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
        const hash = contentHash(mu);
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
          for (const sid of t.seriesIds) {
            await db.from('series').update({ latest_known_chapters: mu.latest_chapter, updated_at: new Date().toISOString() }).eq('id', sid);
          }
          actions.push(`${t.title}: latest ch ${mu.latest_chapter} ("${mu.status}")`);
        } else {
          actions.push(`${t.title}: MU has no usable latest_chapter`);
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
