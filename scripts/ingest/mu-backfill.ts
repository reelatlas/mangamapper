// MangaUpdates backfill (cross-check tier), two target classes:
//   A. ONGOING manga behind series whose total_chapters is null — the
//      position-row denominator AniList cannot provide.
//   B. (Sean 2026-08-24) ANY series with a manga link but NO chapter anchors —
//      staging MU's curated anime-coverage field gives audit-manga-coverage
//      a frontier ('mu' anchors) for airing series with finished manga (TYBW
//      class) and finished series with unknown coverage alike.
// Identity strictly via the MangaDex bridge (no title-guessing);
// unbridgeable manga flag for review. Refresh policy: event/manual
// (validation-tier ruling), re-run when anchors approach latest_known or on
// demand. latest_known_chapters only ever writes for PUBLISHING manga.
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
    // class A: ongoing manga needing a denominator
    const { data: classA } = await db
      .from('series')
      .select('id, title, manga_anilist_id, manga_status, total_chapters, popularity')
      .eq('manga_status', 'publishing')
      .is('total_chapters', null)
      .not('manga_anilist_id', 'is', null)
      .order('popularity', { ascending: false });

    // class B: any manga-linked series without anchors — MU's anime-coverage
    // field is their only frontier candidate.
    // class C (Sean 2026-08-24, the MHA finding): series whose anchors are
    // STALE — max anchor episode far behind the run (sparse AFG pages chart
    // only early seasons; MHA's stops at ep 13 of 170) — need MU's curated
    // frontier just as much as unanchored ones.
    const anchorMax = new Map<string, number>();
    for (let from = 0; ; from += 1000) {
      const { data } = await db.from('chapter_anchors').select('series_id, episode').range(from, from + 999);
      for (const r of data ?? []) anchorMax.set(r.series_id, Math.max(anchorMax.get(r.series_id) ?? 0, r.episode));
      if (!data || data.length < 1000) break;
    }
    const { data: linked } = await db
      .from('series')
      .select('id, title, manga_anilist_id, manga_status, total_chapters, popularity, aired_episodes')
      .not('manga_anilist_id', 'is', null)
      .order('popularity', { ascending: false });
    const classB = (linked ?? []).filter((s) => {
      const ma = anchorMax.get(s.id);
      return ma === undefined || ma < (s.aired_episodes ?? 0) - 12;
    });

    const byManga = new Map<number, { title: string; seriesIds: string[]; statuses: Map<string, string> }>();
    for (const s of [...(classA ?? []), ...classB]) {
      const e = byManga.get(s.manga_anilist_id!) ?? { title: s.title, seriesIds: [], statuses: new Map() };
      if (!e.seriesIds.includes(s.id)) {
        e.seriesIds.push(s.id);
        e.statuses.set(s.id, s.manga_status);
      }
      byManga.set(s.manga_anilist_id!, e);
    }
    console.log(`[mu] ${byManga.size} manga targets (A: denominators, B: frontier candidates)`);

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
          // denominator semantics: only meaningful while the manga publishes
          for (const sid of t.seriesIds) {
            if (t.statuses.get(sid) !== 'publishing') continue;
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
