// Applied rulings — research batch 13 (2026-08-23; §12.32): Oshi no Ko
// interior episodes (Sean's 20-29 report) + the GTO 13/14 annotation gap
// surfaced by anchor_start_offtrend's first run. Extracted from
// scripts/ingest/apply-research-batch-13.ts (the cited record; NOT modified).
//
// ruledBy: Sean's report TRIGGERED the research; the values were agent-
// verified and applied by the session — no decision is attributed to Sean, so
// every entry is 'session'. Source trap recorded in the header: the
// r/OshiNoKo ratio thread (Google's AI summary) is systematically wrong for
// eps 15-22 and all of S3 (R4).

import type { RulingEntry } from '../types';

const RULED_ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-research-batch-13.ts';
const LOG = 'docs/changelog.md §12.32';
const B = 'research batch 13 (2026-08-23, oshi interiors — fandom ep+ch pages, Wikipedia, CBR/ButWhyTho/TheReviewGeek/leisurebyte; reddit ratio thread REFUTED)';
const OSHI_SID = 'oshi-no-ko';
const GTO_SID = 'gto-great-teacher-onizuka';
const CITE_OSHI = [SCRIPT, LOG, 'fandom Oshi no Ko episode + chapter pages (reverse mapping)', 'Wikipedia season bounds', 'CBR / ButWhyTho / TheReviewGeek / leisurebyte reviews'];
const CITE_GTO = [SCRIPT, LOG, 'scratchpad batch11/gto-great-teacher-onizuka.json (batch-11 verdict; session scratchpad, not on disk)'];

// [ep, endCh, startCh, chaptersAdapted, vol, note] — verbatim from the script
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

export const ENTRIES: RulingEntry[] = [
  // ---- oshi-no-ko interior anchors (11) — exact per-episode records replacing interpolation between season boundaries
  ...OSHI.map(([ep, ch, start, adapted, vol, note]): RulingEntry => ({
    seriesId: OSHI_SID,
    // ep 26's START is the sliver-rule call (2-page sliver of 84 → start 85) → A10; the rest are exact records → A3
    ruleId: ep === 26 ? 'A10' : 'A3',
    value: { episode: ep, chapter: ch, start_chapter: start, chapters_adapted: adapted, volume: vol, source: 'manual', note: `${B}: ${note}` },
    reason: note,
    ruledBy: 'session', ruledOn: RULED_ON, cite: CITE_OSHI,
  })),

  // ---- mid-chapter continue points (2): C1 — the continue stays IN the straddled chapter, not end+1
  ...OSHI_CONTINUE.map(([ep, cont, note]): RulingEntry => ({
    seriesId: OSHI_SID, ruleId: 'C1',
    value: { episode: ep, continue_chapter: cont, note: `${B}: ${note}` },
    reason: `${note} — a mid-chapter ending continues in the straddled chapter, not at end+1.`,
    ruledBy: 'session', ruledOn: RULED_ON, cite: CITE_OSHI,
  })),

  // ---- partial annotations (2) for the two mid-chapter endings
  ...OSHI_PARTIAL.map(([ep, chapters, note]): RulingEntry => ({
    seriesId: OSHI_SID, ruleId: 'A43',
    value: { episode: ep, kind: 'partial', chapters, note: `${B}: ${note}` },
    reason: note,
    ruledBy: 'session', ruledOn: RULED_ON, cite: CITE_OSHI,
  })),

  // ---- GTO 13/14 rearranged annotations (2): the annotation is what marks the reorder RULED for audits (A41)
  ...GTO_REARRANGED.map(([ep, chapters, note]): RulingEntry => ({
    seriesId: GTO_SID, ruleId: 'A41',
    value: { episode: ep, kind: 'rearranged', chapters, note: `${B}: ${note}` },
    reason: `${note}. The interleave was promoted in the rearranged pass WITHOUT the annotation that marks it ruled; anchor_start_offtrend's first run surfaced it.`,
    ruledBy: 'session', ruledOn: RULED_ON, cite: CITE_GTO,
  })),
];
