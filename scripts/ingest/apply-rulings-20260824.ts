// Sean's rulings 2026-08-24 (session 2 follow-up), applied as DATA:
//
// 1. CARDCAPTOR SAKURA: CLEAR CARD = SEPARATE SERIES (the Naruto→Shippuden
//    pattern — it adapts a different manga, AniList 87296). Creates
//    `cardcaptor-sakura-clear-card` (AniList 97881, 22 eps in its OWN 1-22
//    numbering) from the old entry's rows 72-93 (−71), applies the batch-14
//    clear_card anchor block (16 full records vs the Clear Card manga),
//    shrinks cardcaptor-sakura to 71 (1998 TV + Prologue OVA; community cap
//    71 in lib/resolve keeps the shared AFL page's tail out), deletes the
//    wrong mu ep93→50 pin (ch 50's adaptation is ep 71), and writes the
//    sequel relation (also RULED in relations.ts).
//
// 2. MHA POST-FINALE SPECIALS as order-only watch-order entries with Sean's
//    surface positions: "No. 170+1: More" at 170+1 (community numbering;
//    adapts ch 431) and the Eri special "I am a hero too" at 170+1.5
//    (mangaMapper's own convention — matches the manga's .5 bonus format and
//    the special's shorter length; adapts ch 431.5, the Ultra Age fan-book
//    one-shot). Stored at ingest_fractionals positions 171 / 171.5 so they
//    sort after the run; counts stay 170; the order-only components ride the
//    stitcher's OVERRIDE_CHAINS extras. Per-series surface formats are a
//    DATA fact (the note carries the label) — other series get their own
//    rulings as they come up.
//
// Idempotent. Run stitch.ts afterwards (comps re-assert from the overrides),
// then verify-series-display for all three series.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-rulings-20260824.ts

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, startRun, finishRun } from './lib/db';
import { registerIds, filterEpisodeRows, stageAniList } from './lib/resolve';
import { aggregate, getMedia } from './lib/chain';

const NEW_ID = 'cardcaptor-sakura-clear-card';
const OLD_ID = 'cardcaptor-sakura';
const OFFSET = 71; // old entry's ep 72 = Clear Card ep 1
const B = "Sean's rulings 2026-08-24 (Clear Card split + MHA post-finale specials)";

async function main() {
  const runId = await startRun('resolve');
  try {
    // ---- 1a. the new series row from AniList 97881
    const media = await getMedia(97881);
    if (!media) throw new Error('AniList 97881 unavailable');
    await stageAniList(media);
    const row = aggregate([media], null, 'Cardcaptor Sakura: Clear Card');
    row.id = NEW_ID;
    if (!row.manga_anilist_id) {
      // safety: the ADAPTATION edge should point at the Clear Card manga
      row.manga_anilist_id = 87296;
      row.manga_status = 'publishing';
    }
    if (row.manga_anilist_id !== 87296) throw new Error(`unexpected manga edge ${row.manga_anilist_id}`);
    const { error: sErr } = await db.from('series').upsert(row);
    if (sErr) throw new Error(`series: ${sErr.message}`);
    await registerIds(NEW_ID, { anilist: media.id, mal: media.idMal });

    await db.from('series_components').delete().eq('series_id', NEW_ID);
    const { error: cErr } = await db.from('series_components').insert({
      series_id: NEW_ID, anilist_id: 97881, season_order: 1,
      episode_start: 1, episode_end: 22, label: media.title.romaji, kind: 'season', afl_slug: null, afl_offset: 0,
    });
    if (cErr) throw new Error(`component: ${cErr.message}`);

    // ---- 1b. episodes: the old entry's 72-93, renumbered into 1-22
    const { data: oldEps } = await db.from('episodes').select('number, title, type, air_date').eq('series_id', OLD_ID).gte('number', OFFSET + 1).order('number');
    let moved = 0;
    if (oldEps?.length) {
      const rows = filterEpisodeRows(NEW_ID, oldEps.map((e) => ({
        series_id: NEW_ID, number: e.number - OFFSET, title: e.title, type: e.type, air_date: e.air_date,
      })), 'afl');
      await db.from('episodes').delete().eq('series_id', NEW_ID);
      const { error } = await db.from('episodes').insert(rows);
      if (error) throw new Error(`episodes: ${error.message}`);
      moved = rows.length;
    } else {
      const { count } = await db.from('episodes').select('*', { count: 'exact', head: true }).eq('series_id', NEW_ID);
      if (!count) throw new Error('no rows to move and none present — nothing to build the entry from');
    }

    // ---- 1c. anchors + continue points + annotations from the batch-14
    // clear_card block (kept in-repo; episodes arrive in OLD 72-93 numbering)
    const verdict = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'research/batch14/out/cardcaptor-sakura.json'), 'utf8'));
    const cc = verdict.clear_card ?? {};
    let anchors = 0;
    for (const a of cc.anchors ?? []) {
      const ep = Number(a.episode) - OFFSET;
      const note = `${B}: ${a.note ?? ''}${a.confidence ? ` [${a.confidence}]` : ''}${a.sources?.length ? ` <${a.sources.slice(0, 3).join(' ; ')}>` : ''}`.slice(0, 900);
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: NEW_ID, episode: ep, chapter: Number(a.end_chapter),
        start_chapter: a.start_chapter == null ? null : Number(a.start_chapter),
        chapters_adapted: a.chapters_adapted ?? null, volume: a.volume ?? null, source: 'manual', note,
      });
      if (error) throw new Error(`anchor ep${ep}: ${error.message}`);
      anchors++;
    }
    for (const c of cc.continue_points ?? []) {
      await db.from('chapter_anchors').update({ continue_chapter: Number(c.continue_chapter) })
        .eq('series_id', NEW_ID).eq('episode', Number(c.episode) - OFFSET);
    }
    let anns = 0;
    for (const g of cc.annotations ?? []) {
      for (const ep of g.episodes ?? []) {
        const { error } = await db.from('episode_annotations').upsert(
          { series_id: NEW_ID, episode: Number(ep) - OFFSET, kind: g.kind, chapters: g.chapters ?? null, note: `${B}: ${g.note ?? ''}`.slice(0, 600) },
          { onConflict: 'series_id,episode,kind' },
        );
        if (error) throw new Error(`annotation: ${error.message}`);
        anns++;
      }
    }
    if (anns) await db.from('series').update({ asterisk_review: 'pending' }).eq('id', NEW_ID).is('asterisk_review', null);

    // ---- 1d. shrink the original: 1998 TV (1-70) + Prologue OVA (71)
    await db.from('chapter_anchors').delete().eq('series_id', OLD_ID).gte('episode', OFFSET + 1); // incl. the wrong mu ep93→50 pin
    await db.from('episode_annotations').delete().eq('series_id', OLD_ID).gte('episode', OFFSET + 1);
    await db.from('episodes').delete().eq('series_id', OLD_ID).gte('number', OFFSET + 1);
    await db.from('series_components').delete().eq('series_id', OLD_ID).eq('anilist_id', 97881);
    await db.from('series').update({ aired_episodes: 71, total_episodes: 71, updated_at: new Date().toISOString() }).eq('id', OLD_ID);

    // ---- 1e. the sequel relation (also in relations.ts RULED)
    await db.from('series_relations').upsert({ from_series: NEW_ID, to_series: OLD_ID, kind: 'sequel' });

    console.log(`Clear Card split: ${moved} episodes moved (1-22), ${anchors} anchors, ${anns} annotations; ${OLD_ID} → 71 eps`);

    // ---- 2. MHA post-finale specials (order-only, Sean's surface positions)
    const SPECIALS: [number, string, string, string][] = [
      [171, 'No. 170+1: More', '2026-05-02',
        "Adapts ch 431 'More' (vol 42 bonus). Community numbering '170+1' — Sean 2026-08-24: essential canon the community groups with the series; SURFACE as 170+1 (not ep 171). AniList 204356, order-only after the FINAL SEASON (component via stitch OVERRIDE_CHAINS extras); counts stay 170."],
      [171.5, 'I am a hero too (Eri special)', '2026-08-03',
        "Adapts ch 431.5 (Ultra Age fan-book Eri one-shot). SURFACE as 170+1.5 — Sean's ruling 2026-08-24: mangaMapper's own convention (no settled community number): the .5 matches the manga's bonus-chapter format and the special's shorter length. AniList 211711, order-only; counts stay 170."],
    ];
    for (const [position, title, air, note] of SPECIALS) {
      const { error } = await db.from('ingest_fractionals').upsert({
        series_id: 'my-hero-academia', position, title, air_date: air,
        source: 'ruling', disposition: 'order_only', note: `${note} (${B})`,
      });
      if (error) throw new Error(`mha special @${position}: ${error.message}`);
    }
    console.log('MHA specials recorded @171 (170+1) and @171.5 (170+1.5), order_only');

    await finishRun(runId, 'ok', { fetched: 1, unchanged: 0, changed: anchors + moved + 2, flagged: 0 }, B);
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
