// Research batch 13 — Oshi no Ko interior episodes (Sean's 20-29 report,
// 2026-08-23) + GTO 13/14 annotation gap from the first anchor_start_offtrend
// audit run. Oshi eps 15-27 interiors had NO anchors (interpolation between
// season boundaries); agent-verified per-episode records now anchor every
// episode. NOTE: the r/OshiNoKo ratio thread (the one Google's AI summary
// serves) was cross-checked and is systematically WRONG for eps 15-22 and all
// of S3 — fandom episode pages + fandom chapter pages (reverse mapping) +
// Wikipedia season bounds + external reviews (CBR, ButWhyTho, TheReviewGeek,
// leisurebyte) agree S3 is LINEAR 81→92 across eps 25-27 (no 82-87 skip), and
// ep 20 = 65-67 as we had it. Exact-title matches: ep16='The Curtain
// Rises'=ch55, ep17='Growth'=ch58, ep19='Trigger'=ch64, ep23='Reunion'=ch77,
// ep26 first full chapter 85='Calculations'=ep title. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-13.ts

import { db, startRun, finishRun } from './lib/db';

const B = 'research batch 13 (2026-08-23, oshi interiors — fandom ep+ch pages, Wikipedia, CBR/ButWhyTho/TheReviewGeek/leisurebyte; reddit ratio thread REFUTED)';

// [ep, endCh, startCh, chaptersAdapted, vol, note]
const OSHI: [number, number, number, string, number, string][] = [
  [15, 51, 49, '49 (p.2-18), 50-51', 6, 'opens finishing ch 49 but ep 14 took only p.1 — ep 15 carries the bulk, start=49 is real (fandom Chapter_49 states the split both ways)'],
  [16, 55, 52, '52-55', 6, "ep title 'The Curtain Rises' = ch 55 exact title (CBR S2E5 review corroborates)"],
  [17, 58, 56, '56-58', 6, "ep title 'Growth' = ch 58 exact title"],
  [18, 61, 59, '59-61', 7, 'chapter pages 59/61 point back to Episode 18; pinned by corroborated neighbors'],
  [19, 64, 62, '62-64', 7, "ep title 'Trigger' = ch 64 exact title; ch 64 entirely in ep 19 (no split with ep 20)"],
  [21, 71, 68, '68-70, 71 (p.1-3)', 8, "ends on a 3-page cliffhanger sliver into ch 71 'Pedestrian Bridge'; last full ch 70. ep title 'Liberation' ~ ch 68 'Release'"],
  [22, 73, 71, '71 (p.3-18), 72-73', 8, 'carries the bulk of ch 71 (split mid-p.3 with ep 21) — start=71 is real'],
  [23, 77, 74, '74-77', 8, "ep title 'Reunion' = ch 77 exact title"],
  [25, 84, 81, '81-83, 84 (p.1-16)', 9, "S3E1 = B-Komachi second concert (ch 82) + Mem-cho/Aqua confrontation; LINEAR — reddit's '81, 88-89' skip is wrong (ButWhyTho + TheReviewGeek)"],
  [26, 88, 85, '84 (p.17-18), 85-88', 9, "opens with 2-page sliver finishing ch 84 → start=85 per sliver rule; 85 'Calculations' = ep title; ends 88 'Offer'"],
  [27, 92, 89, '89-92', 10, "cosplay shoot + Meiya scandal = chs 89 'Cosplay'→92 'Purification'; ch 93 opens ep 28 (no reorder). reddit's '94-95' wrong"],
];

// mid-chapter endings → continue point stays IN the chapter, not end+1
const OSHI_CONTINUE: [number, number, string][] = [
  [21, 71, 'ep ends p.3 of ch 71 — continue from ch 71'],
  [25, 84, 'ep ends p.16 of ch 84 — continue from ch 84'],
];

const OSHI_PARTIAL: [number, string, string][] = [
  [21, '71 (p.1-3)', 'ends mid-ch 71 (3-page cliffhanger); ep 22 carries p.3-18'],
  [25, '84 (p.1-16)', 'ends mid-ch 84; ep 26 opens with p.17-18'],
];

// GTO 13/14: real interleave (13 jumps ahead to 46-47, 14 backfills 44-45)
// promoted in the rearranged pass WITHOUT the annotations that mark it ruled —
// surfaced by anchor_start_offtrend's first run.
const GTO_REARRANGED: [number, string, string][] = [
  [13, '41-43, 46-47', 'jumps ahead to 46-47; ep 14 backfills 44-45 (batch-11 verdict)'],
  [14, '44-47', 'backfills 44-45 behind ep 13 then re-covers to 47 (batch-11 verdict)'],
];

async function main() {
  const runId = await startRun('resolve');
  try {
    let n = 0;
    for (const [ep, ch, start, adapted, vol, note] of OSHI) {
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: 'oshi-no-ko', episode: ep, chapter: ch, start_chapter: start,
        chapters_adapted: adapted, volume: vol, source: 'manual', note: `${B}: ${note}`,
      });
      if (error) throw new Error(`oshi ep${ep}: ${error.message}`);
      n++;
    }
    for (const [ep, cont, note] of OSHI_CONTINUE) {
      const { error } = await db.from('chapter_anchors')
        .update({ continue_chapter: cont, note: `${B}: ${note}` })
        .eq('series_id', 'oshi-no-ko').eq('episode', ep);
      if (error) throw new Error(`oshi continue ep${ep}: ${error.message}`);
    }
    for (const [ep, chapters, note] of OSHI_PARTIAL) {
      const { error } = await db.from('episode_annotations').upsert(
        { series_id: 'oshi-no-ko', episode: ep, kind: 'partial', chapters, note: `${B}: ${note}` },
        { onConflict: 'series_id,episode,kind' },
      );
      if (error) throw new Error(`oshi annotation ep${ep}: ${error.message}`);
    }
    for (const [ep, chapters, note] of GTO_REARRANGED) {
      const { error } = await db.from('episode_annotations').upsert(
        { series_id: 'gto-great-teacher-onizuka', episode: ep, kind: 'rearranged', chapters, note: `${B}: ${note}` },
        { onConflict: 'series_id,episode,kind' },
      );
      if (error) throw new Error(`gto annotation ep${ep}: ${error.message}`);
    }
    console.log(`batch-13: ${n} oshi anchors, ${OSHI_CONTINUE.length} continue points, ${OSHI_PARTIAL.length + GTO_REARRANGED.length} annotations`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: n, flagged: 0 }, 'batch 13: oshi-no-ko full per-episode map (interiors) + GTO 13/14 rearranged annotations');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
