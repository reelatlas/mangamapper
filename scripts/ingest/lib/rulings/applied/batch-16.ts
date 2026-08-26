// Applied rulings — research batch 16 (reorder-hole closure: all 38 remaining reorder holes across 10 series, Sean-approved after save point 8977c04). Extracted for the rulings
// index (restructure T2.1, 2026-08-26) from scripts/ingest/apply-research-batch-16.ts,
// which stays the cited record and is NOT modified. One entry per CURATED
// decision in the script's maps + one entry per verdict FILE applied (the
// verdict JSON is its own cited record; its rows are not enumerated here).
// ruledOn = the script's batch date (2026-08-24).

import type { RulingEntry } from '../types';

const date = '2026-08-24';
const P8_VERIFIED = "P8 check 2026-08-26: row verified at source=manual (research-tier); no promotion was needed";

export const ENTRIES: RulingEntry[] = [
  // ---- REPAIRS_APPROVED: agent repairs on NON-target episodes, applied only
  // via this curated list (never silent). Every one is P8-flagged: batch 16
  // did not promote a repaired derivation-tier row to manual (DRIFT-LIST §E.6).
  { seriesId: 'kamisama-kiss', ruleId: 'A4', value: { episode: 25, field: "end_chapter" }, reason: "finale anchors to what it adapts (Sean A4 rule): ep 25 = chs 62-63; ch 64 is consumed by ep 24's opening graft (whose lifted END keeps position/coverage at 64)", ruledBy: 'session', ruledOn: date, cite: ['scripts/ingest/research/batch16/out/kamisama-kiss.json', 'scripts/ingest/apply-research-batch-16.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: 'kamisama-kiss', ruleId: 'R12', value: { episode: 25, field: "start_chapter" }, reason: "season-envelope start 31 replaced by the per-episode record now that eps 14-24 are exact; ep 25 opens at ch 62", ruledBy: 'session', ruledOn: date, cite: ['scripts/ingest/research/batch16/out/kamisama-kiss.json', 'scripts/ingest/apply-research-batch-16.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: 'kamisama-kiss', ruleId: 'R12', value: { episode: 25, field: "chapters_adapted" }, reason: "envelope list replaced; the envelope's factual content now lives in the S2 zone annotation (eps 14-25)", ruledBy: 'session', ruledOn: date, cite: ['scripts/ingest/research/batch16/out/kamisama-kiss.json', 'scripts/ingest/apply-research-batch-16.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: 'kamisama-kiss', ruleId: 'R12', value: { episode: 10, field: "chapters_adapted" }, reason: "batch-15 error corrected: mixer boy is Kohiruimaki, a named ch-50 character — the goukon merges ch 50's group date with ch 25's beats (UA fandom ch-50 char list + completed-manga-review)", ruledBy: 'session', ruledOn: date, cite: ['scripts/ingest/research/batch16/out/kamisama-kiss.json', 'scripts/ingest/apply-research-batch-16.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },

  // ---- HELD repair (agent asked for a ruling)
  {
    seriesId: 'kamisama-kiss', ruleId: 'P10',
    value: { episode: 10, field: ['end_chapter', 'volume'], held: true },
    reason: 'HELD for Sean: if the mixer segment closes the episode, running-order END is arguably 50 (v9) not 25 (v5); segment order not verified frame-level → DECISIONS-FOR-SEAN',
    ruledBy: 'session', ruledOn: date,
    cite: ['scripts/ingest/research/batch16/out/kamisama-kiss.json', 'scripts/ingest/apply-research-batch-16.ts#REPAIRS_APPROVED'],
    retiresWhen: 'Sean rules the ep 10 segment order (END 25 vs 50)',
  },

  // ---- CURATED_ANNOTATIONS: zone facts the verdicts evidence but did not file
  // (EXCLUDED_ANCHORS and SERIES_UPDATES were empty in batch 16)
  {
    seriesId: 'food-wars', ruleId: 'A41',
    value: { episodes: [17, 18], kind: 'rearranged', chapters: '34-39 after 40-44' },
    reason: 'the Karaage Wars block (chs 34-39) airs AFTER the swapped-forward father-son cookoff (40-44) — eps 17-18 are the displaced side of the batch-9 arc-swap zone, whose annotation previously tagged only eps 15-16; evidence in research/batch16/out/food-wars.json (fandom two-sided map, exact JP title identity, ANN ep-17 review)',
    ruledBy: 'session', ruledOn: date,
    cite: ['scripts/ingest/research/batch16/out/food-wars.json', 'scripts/ingest/apply-research-batch-16.ts#CURATED_ANNOTATIONS'],
  },

  // ---- verdict FILES applied (10 files; anchors upserted at source 'manual'; no zone_level_only verdicts landed, so no batch-16 zone-ack marker was written)
  { seriesId: "black-butler", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch16/out/black-butler.json","anchors":2,"zoneAcks":0}, reason: 'batch-16 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch16/out/black-butler.json"] },
  { seriesId: "bleach-thousand-year-blood-war", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch16/out/bleach-thousand-year-blood-war.json","anchors":1,"zoneAcks":0}, reason: 'batch-16 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch16/out/bleach-thousand-year-blood-war.json"] },
  { seriesId: "cells-at-work", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch16/out/cells-at-work.json","anchors":3,"zoneAcks":0}, reason: 'batch-16 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch16/out/cells-at-work.json"] },
  { seriesId: "food-wars", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch16/out/food-wars.json","anchors":2,"zoneAcks":0}, reason: 'batch-16 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch16/out/food-wars.json"] },
  { seriesId: "kamisama-kiss", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch16/out/kamisama-kiss.json","anchors":11,"zoneAcks":0}, reason: 'batch-16 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch16/out/kamisama-kiss.json"] },
  { seriesId: "miss-kobayashis-dragon-maid", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch16/out/miss-kobayashis-dragon-maid.json","anchors":4,"zoneAcks":0}, reason: 'batch-16 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch16/out/miss-kobayashis-dragon-maid.json"] },
  { seriesId: "naruto-shippuden", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch16/out/naruto-shippuden.json","anchors":8,"zoneAcks":0}, reason: 'batch-16 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch16/out/naruto-shippuden.json"] },
  { seriesId: "naruto", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch16/out/naruto.json","anchors":2,"zoneAcks":0}, reason: 'batch-16 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch16/out/naruto.json"] },
  { seriesId: "nisekoi", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch16/out/nisekoi.json","anchors":1,"zoneAcks":0}, reason: 'batch-16 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch16/out/nisekoi.json"] },
  { seriesId: "tokyo-ghoul-re", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch16/out/tokyo-ghoul-re.json","anchors":4,"zoneAcks":0}, reason: 'batch-16 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch16/out/tokyo-ghoul-re.json"] },
];
