// AoT S4 Part 2 per-episode map — Sean's eps 85/86/87 report (2026-08-23).
// Eps 76-86 had NO anchors (interpolation between 75→116 and the end-only
// 87→130 painted plausible-but-off values); ep 87 was end-only. Sources:
// attackontitan.fandom episode+chapter pages (bidirectional), animefillerguide
// conversion chart, doublesama manga-reader reviews (mid-chapter boundaries),
// Wikipedia S4 plot summaries. THE ONE TRUE REORDER: ch 123 'Island Devils'
// — second half in ep 80, first half relocated to open ep 87 (the finale's
// cold open), so ep 87 = "123 (first half) + 130 (remainder)" as-stored.
// Boundaries at 117/119/120/121/124/130 are mid-chapter splits (page-exact
// points undocumented); starts follow the sliver/majority rule. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-aot-s4p2.ts

import { db, startRun, finishRun } from '../lib/db';

const B = 'research: AoT S4P2 map (2026-08-23, Sean report — fandom ep+ch pages, animefillerguide, doublesama reviews)';

// [ep, endCh, startCh, chaptersAdapted, vol, note]
const ANCHORS: [number, number, number, string, number, string][] = [
  [76, 118, 117, '115 (paths flashback), 117-118', 29, "begins mid-117 (ep 75 animated 117's opening pages); ch-115 fragment = Zeke paths-revival flashback"],
  [77, 119, 118, '117 (tail sliver), 118, 119 (part)', 29, 'majority 118, ends partway into 119; start=118 per sliver rule'],
  [78, 120, 119, '119, 120 (first half), 115 (fragment)', 30, "ends halfway through 120 (doublesama), not at 119's cliffhanger"],
  [79, 121, 120, '120 (second half), 121 (most)', 30, 'Grisha memories; ep 80 finishes 121'],
  [80, 124, 121, '121 (end), 122, 123 (second half), 124 (opening)', 30, "REORDER: skips 123's first half (relocated to ep 87); ends on 124's opening panels (walls crumble)"],
  [81, 124, 124, '124', 31, "single chapter 'Thaw'; its opening panels were ep 80's ending"],
  [82, 125, 125, '125', 31, "single chapter 'Sunset'"],
  [83, 126, 126, '126', 31, "single chapter 'Pride'"],
  [84, 127, 127, '127', 32, "single chapter 'Night of the End' — visually restructured (anime-original memory-vista framing), content faithful"],
  [85, 128, 128, '128', 32, "single chapter 'Traitor'"],
  [86, 130, 129, '129, 130 (first part)', 32, 'all of 129 + beginning of 130; ep 87 resumes 130'],
  [87, 130, 123, '123 (first half, relocated flashback), 130 (remainder)', 32, "REORDER: cold-opens with ch 123's first half (Marley survey trip) skipped back in ep 80, then finishes 130. Furthest point = 130 (linear instrument intact). REPAIR: was end-only 130"],
];

const REARRANGED: [number, string, string][] = [
  [80, '123 (second half only)', "adapts 123's second half; first half deferred to ep 87's cold open"],
  [87, '123 (first half) + 130 (remainder)', "finale opens with ch 123's relocated first half before finishing 130"],
];

async function main() {
  const runId = await startRun('resolve');
  try {
    let n = 0;
    for (const [ep, ch, start, adapted, vol, note] of ANCHORS) {
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: 'attack-on-titan', episode: ep, chapter: ch, start_chapter: start,
        chapters_adapted: adapted, volume: vol, source: 'manual', note: `${B}: ${note}`,
      });
      if (error) throw new Error(`ep${ep}: ${error.message}`);
      n++;
    }
    for (const [ep, chapters, note] of REARRANGED) {
      const { error } = await db.from('episode_annotations').upsert(
        { series_id: 'attack-on-titan', episode: ep, kind: 'rearranged', chapters, note: `${B}: ${note}` },
        { onConflict: 'series_id,episode,kind' },
      );
      if (error) throw new Error(`annotation ep${ep}: ${error.message}`);
    }
    console.log(`aot s4p2: ${n} anchors + ${REARRANGED.length} rearranged annotations`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: n, flagged: 0 }, 'AoT S4P2: eps 76-87 fully anchored (ch-123 split reorder ruled)');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
