// Research-tier batch 3 — Sean's sign-off 2026-08-23 ("apply all A").
// Six frontier verdicts from web research (2+ sources each, URLs in notes)
// plus the first population of the asterisk model (episode_annotations) and
// the three-numbers columns. Kenshin 95-98 side_story rows land here too —
// the annotations table IS agenda 19b's data model. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-3.ts

import { db, startRun, finishRun } from '../lib/db';

const now = () => new Date().toISOString();

async function main() {
  const runId = await startRun('resolve');
  try {
    const anchor = async (sid: string, ep: number, ch: number, note: string) => {
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: sid, episode: ep, chapter: ch, volume: null, source: 'manual',
        note: `research-tier (Sean sign-off 2026-08-23): ${note}`,
      });
      if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
      console.log(`  anchor: ${sid} ep ${ep} → ch ${ch}`);
    };
    const annotate = async (sid: string, ep: number, kind: string, chapters: string | null, note: string) => {
      const { error } = await db.from('episode_annotations').upsert({ series_id: sid, episode: ep, kind, chapters, note });
      if (error) throw new Error(`annotate ${sid} ep${ep}: ${error.message}`);
    };
    const seriesUpdate = async (sid: string, fields: Record<string, unknown>) => {
      const { error } = await db.from('series').update({ ...fields, updated_at: now() }).eq('id', sid);
      if (error) throw new Error(`${sid}: ${error.message}`);
    };

    // ── 1. Claymore: original ending from ep 21; faithful through ep 20 ──
    await anchor('claymore', 20, 56, 'last faithful episode → ch 54-56; eps 21-23 loose parallels of 57-59, 24-26 fully anime-original. animefillerguide.com/anime/claymore + wheredoestheanimeleaveoff.com + sportskeeda');
    await db.from('chapter_anchors').delete().eq('series_id', 'claymore').eq('episode', 24).neq('source', 'manual');
    await db.from('chapter_anchors').delete().eq('series_id', 'claymore').eq('episode', 26).neq('source', 'manual');
    await db.from('episodes').update({ type: 'anime-only-canon' }).eq('series_id', 'claymore').in('number', [24, 25, 26]);
    for (const ep of [21, 22, 23]) await annotate('claymore', ep, 'loose_parallel', 'ch 57-59', 'loosely parallels the Northern Campaign / Pieta battle with growing variations — anime outran the ongoing manga');
    await seriesUpdate('claymore', { continue_from_chapter: 57 });

    // ── 2. Dorohedoro: ep 12 ends inside ch 41 (tail of vol 7) ──────────
    await anchor('dorohedoro', 12, 41, 'S1 ends near end of vol 7, final Kaiman/Nikaido scene from ch 41 (partial); minor skips en route. wheredoestheanimeleaveoff.com + mangashed.com + Wikipedia vol list');
    await annotate('dorohedoro', 12, 'partial', 'ch 41', 'finale ends mid-chapter-41; end-of-episode teaser images pull from later vol-7 chapters');
    await seriesUpdate('dorohedoro', { continue_from_chapter: 42 });

    // ── 3. Kimi ni Todoke: ch 86 unsupported; S3 finale → ch 75 ─────────
    {
      const sid = 'kimi-ni-todoke-from-me-to-you';
      const { data: s } = await db.from('series').select('aired_episodes').eq('id', sid).single();
      await db.from('chapter_anchors').delete().eq('series_id', sid).gte('episode', 40); // the ch-86 error + stale finale rows
      await anchor(sid, s!.aired_episodes, 75, `S3 finale ends at ch 75 / end of vol 18 (S3 skips chs 50-51); ch 86 was a data error (mid-vol 21, unadapted). mangashed.com + wheredoestheanimeleaveoff.com + animefillerguide.com`);
      await seriesUpdate(sid, { continue_from_chapter: 76 });
      console.log(`  kimi finale = our ep ${s!.aired_episodes}`);
    }

    // ── 4. Ayakashi Triangle: real reorder; finale ends ch 24 + graft ───
    await annotate('ayakashi-triangle', 9, 'rearranged', 'ch 26-27', 'anime plays chs 26-27 material early — genuine timeline reorder (displays as stored per the non-monotonic ruling)');
    await annotate('ayakashi-triangle', 12, 'graft', 'ch 34 scene', 'finale ends sequential coverage at ch 24 and grafts one scene from ch 34. animefillerguide.com + wheredoestheanimeleaveoff.com + ayakashi-triangle.fandom.com');
    await seriesUpdate('ayakashi-triangle', { continue_from_chapter: 25, max_adapted_chapter: 34 });

    // ── 5. The Summer Hikaru Died: finale ends inside ch 26 ─────────────
    await anchor('the-summer-hikaru-died', 12, 26, 'finale is mostly ch 26 with re-spliced ch-24 pages; small trim off ch 26 end. animefillerguide.com + wheredoestheanimeleaveoff.com');
    await annotate('the-summer-hikaru-died', 12, 'rearranged', 'ch 24 pages + ch 26', 'non-linear finale re-splices earlier chapter pages; ends inside ch 26');
    await seriesUpdate('the-summer-hikaru-died', { continue_from_chapter: 27 });

    // ── 6. Kowloon Generic Romance: anime-original rearranged ending ────
    await annotate('kowloon-generic-romance', 11, 'rearranged', 'ch 77-78, 80, 82', 'highest chapter the anime touches (82) lands here, out of order');
    await annotate('kowloon-generic-romance', 12, 'divergence', 'ch 81', 'from ep 12 the anime diverges into its own "definitive ending" (ANN finale review: borrows then-unreleased chapter elements)');
    await annotate('kowloon-generic-romance', 13, 'divergence', 'ch 79 (rearranged)', 'anime-original framing over rearranged ch-79 material. animefillerguide.com + animenewsnetwork.com finale review + lostinanime.com');
    await seriesUpdate('kowloon-generic-romance', { continue_from_chapter: 83, max_adapted_chapter: 82 });

    // ── Kenshin 95-98: agenda 19b lands in the same model ───────────────
    for (const ep of [95, 96, 97, 98]) {
      await annotate('rurouni-kenshin', ep, 'side_story', 'pilot one-shots', 'adapts the pre-serialization pilot one-shots — real content outside mainline chapter numbering (episode titles matched the one-shots by name, 2026-08-24 research)');
    }

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: 6, flagged: 0 }, 'research batch 3 (Sean sign-off): six frontier verdicts + asterisk model first population');
    console.log('=== BATCH 3 APPLIED ===');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
