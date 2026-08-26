// Applied rulings — research batch 14 (item-4 batch 8: ruled-extension new seasons + top-16 anchor-gap tier). Extracted for the rulings
// index (restructure T2.1, 2026-08-26) from scripts/ingest/apply-research-batch-14.ts,
// which stays the cited record and is NOT modified. One entry per CURATED
// decision in the script's maps + one entry per verdict FILE applied (the
// verdict JSON is its own cited record; its rows are not enumerated here).
// ruledOn = the script's batch date (2026-08-23).

import type { RulingEntry } from '../types';

const date = '2026-08-23';

export const ENTRIES: RulingEntry[] = [
  // ---- SESSION_REPAIRS (standing repair recorded in the script for the ledger)
  {
    seriesId: 'attack-on-titan', ruleId: 'A12',
    value: { episode: 87, patch: { start_chapter: 130 } },
    reason: "AoT ep 87 start 123→130 (Sean's out-of-order report 2026-08-23): the ch-123 first-half cold open is a relocated flashback sliver — majority rule + start-sanity: off-trend openers stay in chapters_adapted (kept: '123 (first half, relocated flashback), 130 (remainder)') with the rearranged annotation; the position is 130",
    ruledBy: 'Sean', ruledOn: date,
    cite: ['scripts/ingest/apply-research-batch-14.ts#SESSION_REPAIRS'],
  },

  // ---- verdict FILES applied (25 files; anchors upserted at source 'manual')
  { seriesId: "a-certain-scientific-railgun", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/a-certain-scientific-railgun.json","anchors":15}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/a-certain-scientific-railgun.json"] },
  { seriesId: "beastars", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/beastars.json","anchors":23}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/beastars.json"] },
  { seriesId: "black-butler", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/black-butler.json","anchors":24}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/black-butler.json"] },
  { seriesId: "cardcaptor-sakura", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/cardcaptor-sakura.json","anchors":35}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/cardcaptor-sakura.json"] },
  { seriesId: "claymore", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/claymore.json","anchors":20}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/claymore.json"] },
  { seriesId: "dagashi-kashi", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/dagashi-kashi.json","anchors":24}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/dagashi-kashi.json"] },
  { seriesId: "dragon-ball-z-kai", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/dragon-ball-z-kai.json","anchors":165}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/dragon-ball-z-kai.json"] },
  { seriesId: "edens-zero", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/edens-zero.json","anchors":50}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/edens-zero.json"] },
  { seriesId: "golden-kamuy", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/golden-kamuy.json","anchors":38}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/golden-kamuy.json"] },
  { seriesId: "hajime-no-ippo-the-fighting", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/hajime-no-ippo-the-fighting.json","anchors":13}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/hajime-no-ippo-the-fighting.json"] },
  { seriesId: "hunter-x-hunter", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/hunter-x-hunter.json","anchors":26}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/hunter-x-hunter.json"] },
  { seriesId: "kingdom", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/kingdom.json","anchors":64}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/kingdom.json"] },
  { seriesId: "my-hero-academia", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/my-hero-academia-a.json","anchors":38}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/my-hero-academia-a.json"] },
  { seriesId: "my-hero-academia", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/my-hero-academia-b.json","anchors":32}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/my-hero-academia-b.json"] },
  { seriesId: "naruto-shippuden", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/naruto-shippuden.json","anchors":23}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/naruto-shippuden.json"] },
  { seriesId: "reborn", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/reborn.json","anchors":173}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/reborn.json"] },
  { seriesId: "rent-a-girlfriend", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/rent-a-girlfriend.json","anchors":24}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/rent-a-girlfriend.json"] },
  { seriesId: "rurouni-kenshin", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/rurouni-kenshin.json","anchors":33}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/rurouni-kenshin.json"] },
  { seriesId: "silver-spoon", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/silver-spoon.json","anchors":22}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/silver-spoon.json"] },
  { seriesId: "that-time-i-got-reincarnated-as-a-slime", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/that-time-i-got-reincarnated-as-a-slime.json","anchors":67}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/that-time-i-got-reincarnated-as-a-slime.json"] },
  { seriesId: "the-ancient-magus-bride", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/the-ancient-magus-bride.json","anchors":24}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/the-ancient-magus-bride.json"] },
  { seriesId: "the-heroic-legend-of-arslan", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/the-heroic-legend-of-arslan.json","anchors":25}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/the-heroic-legend-of-arslan.json"] },
  { seriesId: "to-love-ru-darkness", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/to-love-ru-darkness.json","anchors":24}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/to-love-ru-darkness.json"] },
  { seriesId: "world-trigger", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/world-trigger.json","anchors":26}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/world-trigger.json"] },
  { seriesId: "yu-yu-hakusho-ghostfiles", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch14/out/yu-yu-hakusho-ghostfiles.json","anchors":24}, reason: 'batch-14 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-23', cite: ["scripts/ingest/research/batch14/out/yu-yu-hakusho-ghostfiles.json"] },
];
