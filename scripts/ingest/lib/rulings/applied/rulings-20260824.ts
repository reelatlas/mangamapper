// Applied rulings — Sean's rulings 2026-08-24 (session 2 follow-up), applied
// as DATA by scripts/ingest/apply-rulings-20260824.ts (the cited, runnable
// record; NOT modified). One RulingEntry per migration step:
//   1. Cardcaptor Sakura: CLEAR CARD = SEPARATE SERIES (the Naruto→Shippuden
//      pattern — it adapts a different manga, AniList 87296): create the entry,
//      move + renumber rows 72-93 → 1-22, apply the batch-14 clear_card anchor
//      block in the new numbering, shrink cardcaptor-sakura to 71, delete the
//      wrong mu ep93→50 pin, write the sequel relation.
//   2. MHA post-finale specials as order-only watch-order entries with Sean's
//      surface positions 170+1 and 170+1.5.
// Changelog record: docs/changelog.md §12.35.

import type { RulingEntry } from '../types';

const SCRIPT = 'scripts/ingest/apply-rulings-20260824.ts';
const B14 = 'scripts/ingest/research/batch14/out/cardcaptor-sakura.json';
const D = '2026-08-24';
const NEW_ID = 'cardcaptor-sakura-clear-card';
const OLD_ID = 'cardcaptor-sakura';

export const ENTRIES: RulingEntry[] = [
  // ---- 1a. the new series row + identity registration + one season component
  {
    seriesId: NEW_ID, ruleId: 'I16',
    value: { anilist: 97881, mal: 'from AniList media', manga_anilist_id: 87296, manga_status: 'publishing', component: { anilist_id: 97881, season_order: 1, episode_start: 1, episode_end: 22, kind: 'season' } },
    reason: 'Clear Card is a SEPARATE SERIES (the Naruto→Shippuden pattern): it adapts a different manga (AniList 87296), so it gets its own entry (AniList 97881, 22 eps in its OWN 1-22 numbering) with its own registered ids and a single season component 1-22; the ADAPTATION edge must point at the Clear Card manga (asserted at apply)',
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, '§12.35', 'docs/franchise-rulings.md'],
  },
  // ---- 1b. episodes: the old entry's rows 72-93, renumbered into 1-22 (−71)
  {
    seriesId: NEW_ID, ruleId: 'N13',
    value: { from: OLD_ID, rows: '72-93', offset: -71, into: '1-22', source: 'afl' },
    reason: "the new entry is built from the old entry's rows 72-93 (titles/types/air dates travel with the rows), renumbered −71 into Clear Card's own 1-22 through filterEpisodeRows so the per-series episode rulings apply in the new numbering",
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, '§12.35'],
  },
  // ---- 1c. anchors + continue points + annotations from the batch-14 clear_card block
  {
    seriesId: NEW_ID, ruleId: 'N14',
    value: { verdictBlock: 'clear_card', anchors: 16, offset: -71, source: 'manual', continue_points: 'applied at episode −71', annotations: 'applied at episode −71 (asterisk_review → pending)' },
    reason: "the batch-14 clear_card block (16 full records vs the Clear Card manga, delivered in the OLD 72-93 numbering) converts to OUR numbering at apply (episode −71) — research anchors, continue points and annotations all translate like the episode rows they sit on; the previous host entry's chapter space was the wrong instrument for them",
    ruledBy: 'Sean', ruledOn: D, cite: [B14, SCRIPT, '§12.35'],
  },
  // ---- 1d. shrink the original: 1998 TV (1-70) + Prologue OVA (71)
  {
    seriesId: OLD_ID, ruleId: 'N3',
    value: { aired_episodes: 71, total_episodes: 71 },
    reason: 'cardcaptor-sakura is the 1998 TV run (1-70) + the Prologue OVA (71); the community cap 71 (COMMUNITY_COUNT_OVERRIDES in lib/resolve) keeps the shared AFL page\'s Clear Card tail out on every refresh',
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, '§12.35'],
  },
  {
    seriesId: OLD_ID, ruleId: 'I36',
    value: { delete: { chapter_anchors: 'episode ≥ 72', episode_annotations: 'episode ≥ 72', episodes: 'number ≥ 72', series_components: 'anilist_id 97881' } },
    reason: "an entry shows ONLY its own range: every row ≥ 72 (anchors, annotations, episodes, the 97881 component) belongs to Clear Card and leaves the old entry — including the wrong mu ep93→50 pin (ch 50's adaptation is ep 71, and ch 50 is in the Clear Card manga's space anyway)",
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, '§12.35'],
  },
  // ---- 1e. the sequel relation (also RULED in relations.ts)
  {
    seriesId: NEW_ID, ruleId: 'I17',
    value: { from_series: NEW_ID, to_series: OLD_ID, kind: 'sequel' },
    reason: 'Clear Card is the sequel of cardcaptor-sakura (relation written from the new entry to the old; also RULED in lib relations.ts so the stitcher agrees)',
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, '§12.35', 'docs/franchise-rulings.md'],
  },
  // ---- 2. MHA post-finale specials (order-only, Sean's surface positions)
  {
    seriesId: 'my-hero-academia', ruleId: 'N31',
    value: { position: 171, surface: '170+1', title: 'No. 170+1: More', air_date: '2026-05-02', anilist: 204356, adapts: 'ch 431', source: 'ruling', disposition: 'order_only' },
    reason: "adapts ch 431 'More' (vol 42 bonus). Community numbering '170+1' — essential canon the community groups with the series; SURFACE as 170+1 (not ep 171). Order-only after the FINAL SEASON (component via stitch OVERRIDE_CHAINS extras); counts stay 170. Stored at ingest_fractionals position 171 so it sorts after the run",
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, '§12.35'],
  },
  {
    seriesId: 'my-hero-academia', ruleId: 'N31',
    value: { position: 171.5, surface: '170+1.5', title: 'I am a hero too (Eri special)', air_date: '2026-08-03', anilist: 211711, adapts: 'ch 431.5', source: 'ruling', disposition: 'order_only' },
    reason: "adapts ch 431.5 (Ultra Age fan-book Eri one-shot). SURFACE as 170+1.5 — mangaMapper's own convention (no settled community number): the .5 matches the manga's bonus-chapter format and the special's shorter length. Order-only; counts stay 170. Per-series surface formats are a DATA fact (the note carries the label) — other series get their own rulings as they come up",
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, '§12.35'],
  },
];
