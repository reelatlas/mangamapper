// Applied rulings — research batch 15 (exact-record promotion: 5 reorder holes + every rearranged_zone_unanchored row + batch-14 bookmark items). Extracted for the rulings
// index (restructure T2.1, 2026-08-26) from scripts/ingest/apply-research-batch-15.ts,
// which stays the cited record and is NOT modified. One entry per CURATED
// decision in the script's maps + one entry per verdict FILE applied (the
// verdict JSON is its own cited record; its rows are not enumerated here).
// ruledOn = the script's batch date (2026-08-24).

import type { RulingEntry } from '../types';

const date = '2026-08-24';
const P8_VERIFIED = "P8 check 2026-08-26: row verified at source=manual (research-tier); no promotion was needed";

export const ENTRIES: RulingEntry[] = [
  // ---- REPAIRS_APPROVED: agent repairs on NON-target episodes, applied only
  // via this curated list (never silent). Every one is P8-flagged: batch 15
  // did not promote a repaired derivation-tier row to manual (DRIFT-LIST §E.6).
  { seriesId: "ajin-demi-human", ruleId: 'R12', value: { episode: 13, field: "start_chapter" }, reason: "chs 13-21 proven covered by eps 7-12 (allyouranime per-episode series + fandom); ep 13 = 22-22.5+23 opening beat", ruledBy: 'session', ruledOn: date, cite: ["scripts/ingest/research/batch15/out/ajin-demi-human.json", 'scripts/ingest/apply-research-batch-15.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: "ajin-demi-human", ruleId: 'R12', value: { episode: 13, field: "chapters_adapted" }, reason: "paired with the start repair — the \"13-21 compressed\" framing is stale", ruledBy: 'session', ruledOn: date, cite: ["scripts/ingest/research/batch15/out/ajin-demi-human.json", 'scripts/ingest/apply-research-batch-15.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: "bleach", ruleId: 'R12', value: { episode: 146, field: "chapters_adapted" }, reason: "precision: ep 146 stops at 247 p.15; p.16-end airs in ep 149 (fandom page-level + AFG); END unchanged", ruledBy: 'session', ruledOn: date, cite: ["scripts/ingest/research/batch15/out/bleach.json", 'scripts/ingest/apply-research-batch-15.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: "cells-at-work", ruleId: 'R12', value: { episode: 10, field: "volume" }, reason: "ch 15 is vol 4 (fandom ch page + Wikipedia vol list agree; v3=10-14, v4=15-19)", ruledBy: 'session', ruledOn: date, cite: ["scripts/ingest/research/batch15/out/cells-at-work.json", 'scripts/ingest/apply-research-batch-15.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: "dagashi-kashi", ruleId: 'R12', value: { episode: 11, field: "chapters_adapted" }, reason: "batch-15 settlement: 52 adapted (title + caprico-log + en-WP), 56 not (bastek66 + no candy-apple scene)", ruledBy: 'session', ruledOn: date, cite: ["scripts/ingest/research/batch15/out/dagashi-kashi.json", 'scripts/ingest/apply-research-batch-15.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: "dagashi-kashi", ruleId: 'R12', value: { episode: 24, field: "chapters_adapted" }, reason: "127-partial retracted: ch 127 is the potato-fry correction gag (ja-WP), absent from the finale", ruledBy: 'session', ruledOn: date, cite: ["scripts/ingest/research/batch15/out/dagashi-kashi.json", 'scripts/ingest/apply-research-batch-15.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: "golden-kamuy", ruleId: 'R12', value: { episode: 21, field: "chapters_adapted" }, reason: "precision: opens finishing 118 p.16-18 + 119 fragments before 120-124; end/start/vol unchanged", ruledBy: 'session', ruledOn: date, cite: ["scripts/ingest/research/batch15/out/golden-kamuy.json", 'scripts/ingest/apply-research-batch-15.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: "jujutsu-kaisen", ruleId: 'R12', value: { episode: 29, field: "end_chapter" }, reason: "ep 29 adapts 79 p.2-8 (fandom fwd + ch-79 reverse map + AFG) — END = last chapter adapted, 7 pages is substantive", ruledBy: 'session', ruledOn: date, cite: ["scripts/ingest/research/batch15/out/jujutsu-kaisen.json", 'scripts/ingest/apply-research-batch-15.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: "my-hero-academia", ruleId: 'R12', value: { episode: 103, field: "continue_chapter" }, reason: "omission fix: ends mid-248 (p.13 opens ep 105) — batch-14 convention", ruledBy: 'session', ruledOn: date, cite: ["scripts/ingest/research/batch15/out/my-hero-academia.json", 'scripts/ingest/apply-research-batch-15.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },
  { seriesId: "welcome-to-demon-school-iruma-kun", ruleId: 'R12', value: { episode: 44, field: "end_chapter" }, reason: "ep 44 never adapts 94 (that is ep 43); adapts 92-93+95 p.1-4,8-13 (fandom + AFG + TV Tropes)", ruledBy: 'session', ruledOn: date, cite: ["scripts/ingest/research/batch15/out/welcome-to-demon-school-iruma-kun.json", 'scripts/ingest/apply-research-batch-15.ts#REPAIRS_APPROVED'], supersedes: P8_VERIFIED },

  // ---- HELD repairs (convention-sensitive; agents themselves said confirm first)
  {
    seriesId: 'hajime-no-ippo-the-fighting', ruleId: 'A4',
    value: { episode: 127, field: ['end_chapter', 'volume'], held: false, continue_chapter: 558 },
    reason: "ippo#127 UNHELD (Sean's A4 ruling 2026-08-24): the finale anchors to what it adapts (410-414, display start per sliver rule), continue→558 = coverage+1; assemble.ts now derives coverage from the MAX-chapter anchor so the honest record no longer flattens the run",
    ruledBy: 'Sean', ruledOn: date,
    cite: ['scripts/ingest/research/batch15/out/hajime-no-ippo-the-fighting.json', 'scripts/ingest/apply-research-batch-15.ts#EXCLUDED_ANCHORS'],
    supersedes: 'batch-15 HELD ippo#127 end_chapter/volume — stored 558 encodes the post-series continue point (mu-endpoint convention)',
  },
  {
    seriesId: 'miss-kobayashis-dragon-maid', ruleId: 'P10',
    value: { episode: 25, field: ['end_chapter', 'volume'], held: true },
    reason: 'HELD for Sean (convention-sensitive): stored 64 is the manual endpoint ruling; ch 64 now exactly ep 22\'s (double-claim) — the agent asked to confirm before repairing',
    ruledBy: 'session', ruledOn: date,
    cite: ['scripts/ingest/research/batch15/out/miss-kobayashis-dragon-maid.json', 'scripts/ingest/apply-research-batch-15.ts#REPAIRS_APPROVED'],
    retiresWhen: 'Sean rules the ep 25 endpoint vs ep 22 double-claim',
  },

  // ---- EXCLUDED_ANCHORS: verdict anchors NOT applied
  {
    seriesId: 'my-hero-academia', ruleId: 'A1',
    value: { episode: 104, excluded: true },
    reason: 'RULED (Sean 2026-08-24): rejected permanently — filler rows never take anchors; the audit now skips filler/anime-only rows in rearranged_zone_unanchored instead',
    ruledBy: 'Sean', ruledOn: date,
    cite: ['scripts/ingest/research/batch15/out/my-hero-academia.json', 'scripts/ingest/apply-research-batch-15.ts#EXCLUDED_ANCHORS'],
  },
  {
    seriesId: 'cardcaptor-sakura-clear-card', ruleId: 'A2',
    value: { episode: 12, excluded: true },
    reason: 'ep typed anime-only-canon; the ch-39 "graft" is a cards-circling cameo — anchoring END 39 would poison the position curve (mainline ~12-13); annotation carries the fact — encoding decision for Sean',
    ruledBy: 'session', ruledOn: date,
    cite: ['scripts/ingest/research/batch15/out/cardcaptor-sakura-clear-card.json', 'scripts/ingest/apply-research-batch-15.ts#EXCLUDED_ANCHORS'],
    retiresWhen: 'Sean rules the anime-only-canon graft encoding',
  },
  {
    seriesId: 'cardcaptor-sakura-clear-card', ruleId: 'A2',
    value: { episode: 14, excluded: true },
    reason: 'same class as ep 12: anime-only-canon ep; ch 46 = Mirage debut graft, not the mainline position — annotation carries it',
    ruledBy: 'session', ruledOn: date,
    cite: ['scripts/ingest/research/batch15/out/cardcaptor-sakura-clear-card.json', 'scripts/ingest/apply-research-batch-15.ts#EXCLUDED_ANCHORS'],
    retiresWhen: 'Sean rules the anime-only-canon graft encoding',
  },
  {
    seriesId: 'hajime-no-ippo-the-fighting', ruleId: 'A2',
    value: { episode: 76, excluded: true },
    reason: "Boxer's Fist DVD special adapts only ch 383 p.4-5 (2-page gag) — anchoring END 383 at run position ~270 breaks the curve (sliver-rule spirit: scraps never set position); annotation carries the sliver — encoding decision for Sean",
    ruledBy: 'session', ruledOn: date,
    cite: ['scripts/ingest/research/batch15/out/hajime-no-ippo-the-fighting.json', 'scripts/ingest/apply-research-batch-15.ts#EXCLUDED_ANCHORS'],
    retiresWhen: 'Sean rules the sliver-special encoding',
  },

  // ---- SERIES_UPDATES: entry-level updates ratified by the batch
  {
    seriesId: 'world-trigger', ruleId: 'C1',
    value: { continue_from_chapter: 196 },
    reason: 'batch-14 flag confirmed by batch 15 with 4 sources (fandom p.1-4 split, Sportskeeda, WDTALO, programming-cafe): ep 99 adapts only ch 196 p.1-4 of 23 — honest resume is 196, not 197',
    ruledBy: 'session', ruledOn: date,
    cite: ['scripts/ingest/research/batch15/out/world-trigger.json', 'scripts/ingest/apply-research-batch-15.ts#SERIES_UPDATES'],
  },

  // ---- zone-ack marker: zone_level_only verdicts acknowledge the zone on
  // their annotation rows instead of leaving the episode open
  {
    seriesId: '*', ruleId: 'A7',
    value: { marker: 'zone-acknowledged (batch 15)', episodes: 18 },
    reason: 'a zone_level_only verdict means the target episode legitimately stays zone-level — the matching episode_annotations row gets the marker appended so audit-ui-truth splits acknowledged rows into rearranged_zone_acknowledged and the open work-list shrinks honestly, never silently',
    ruledBy: 'session', ruledOn: date,
    cite: ['scripts/ingest/apply-research-batch-15.ts#ZMARK'],
  },

  // ---- verdict FILES applied (49 files; anchors upserted at source 'manual')
  { seriesId: "a-certain-scientific-railgun", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/a-certain-scientific-railgun.json","anchors":8,"zoneAcks":3}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/a-certain-scientific-railgun.json"] },
  { seriesId: "ajin-demi-human", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/ajin-demi-human.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/ajin-demi-human.json"] },
  { seriesId: "attack-on-titan", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/attack-on-titan.json","anchors":3,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/attack-on-titan.json"] },
  { seriesId: "ayakashi-triangle", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/ayakashi-triangle.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/ayakashi-triangle.json"] },
  { seriesId: "beastars", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/beastars-ep44-followup.json","anchors":1,"zoneAcks":1}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/beastars-ep44-followup.json"] },
  { seriesId: "beastars", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/beastars.json","anchors":1,"zoneAcks":2}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/beastars.json"] },
  { seriesId: "berserk", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/berserk.json","anchors":2,"zoneAcks":4}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/berserk.json"] },
  { seriesId: "black-butler", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/black-butler.json","anchors":3,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/black-butler.json"] },
  { seriesId: "bleach-thousand-year-blood-war", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/bleach-thousand-year-blood-war.json","anchors":4,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/bleach-thousand-year-blood-war.json"] },
  { seriesId: "bleach", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/bleach.json","anchors":3,"zoneAcks":2}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/bleach.json"] },
  { seriesId: "blue-exorcist", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/blue-exorcist.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/blue-exorcist.json"] },
  { seriesId: "cardcaptor-sakura-clear-card", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/cardcaptor-sakura-clear-card.json","anchors":2,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/cardcaptor-sakura-clear-card.json"] },
  { seriesId: "cardcaptor-sakura", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/cardcaptor-sakura.json","anchors":5,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/cardcaptor-sakura.json"] },
  { seriesId: "cells-at-work", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/cells-at-work.json","anchors":3,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/cells-at-work.json"] },
  { seriesId: "dagashi-kashi", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/dagashi-kashi.json","anchors":6,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/dagashi-kashi.json"] },
  { seriesId: "dragon-ball-z-kai", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/dragon-ball-z-kai.json","anchors":6,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/dragon-ball-z-kai.json"] },
  { seriesId: "edens-zero", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/edens-zero.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/edens-zero.json"] },
  { seriesId: "fire-force", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/fire-force.json","anchors":2,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/fire-force.json"] },
  { seriesId: "food-wars", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/food-wars.json","anchors":12,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/food-wars.json"] },
  { seriesId: "golden-kamuy", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/golden-kamuy.json","anchors":7,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/golden-kamuy.json"] },
  { seriesId: "haikyu", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/haikyu.json","anchors":9,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/haikyu.json"] },
  { seriesId: "hajime-no-ippo-the-fighting", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/hajime-no-ippo-the-fighting.json","anchors":6,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/hajime-no-ippo-the-fighting.json"] },
  { seriesId: "hunter-x-hunter-2011", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/hunter-x-hunter-2011.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/hunter-x-hunter-2011.json"] },
  { seriesId: "hunter-x-hunter", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/hunter-x-hunter.json","anchors":5,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/hunter-x-hunter.json"] },
  { seriesId: "inuyasha", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/inuyasha.json","anchors":7,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/inuyasha.json"] },
  { seriesId: "jujutsu-kaisen", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/jujutsu-kaisen.json","anchors":6,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/jujutsu-kaisen.json"] },
  { seriesId: "kamisama-kiss", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/kamisama-kiss.json","anchors":12,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/kamisama-kiss.json"] },
  { seriesId: "komi-cant-communicate", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/komi-cant-communicate.json","anchors":14,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/komi-cant-communicate.json"] },
  { seriesId: "kowloon-generic-romance", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/kowloon-generic-romance.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/kowloon-generic-romance.json"] },
  { seriesId: "kurokos-basketball", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/kurokos-basketball.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/kurokos-basketball.json"] },
  { seriesId: "miss-kobayashis-dragon-maid", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/miss-kobayashis-dragon-maid.json","anchors":12,"zoneAcks":1}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/miss-kobayashis-dragon-maid.json"] },
  { seriesId: "my-hero-academia", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/my-hero-academia.json","anchors":7,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/my-hero-academia.json"] },
  { seriesId: "naruto-shippuden", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/naruto-shippuden.json","anchors":22,"zoneAcks":5}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/naruto-shippuden.json"] },
  { seriesId: "naruto", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/naruto.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/naruto.json"] },
  { seriesId: "nisekoi", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/nisekoi.json","anchors":4,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/nisekoi.json"] },
  { seriesId: "ranking-of-kings", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/ranking-of-kings.json","anchors":2,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/ranking-of-kings.json"] },
  { seriesId: "record-of-ragnarok", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/record-of-ragnarok.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/record-of-ragnarok.json"] },
  { seriesId: "relife", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/relife.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/relife.json"] },
  { seriesId: "rent-a-girlfriend", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/rent-a-girlfriend.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/rent-a-girlfriend.json"] },
  { seriesId: "seraph-of-the-end-vampire-reign", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/seraph-of-the-end-vampire-reign.json","anchors":5,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/seraph-of-the-end-vampire-reign.json"] },
  { seriesId: "silver-spoon", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/silver-spoon.json","anchors":2,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/silver-spoon.json"] },
  { seriesId: "the-ancient-magus-bride", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/the-ancient-magus-bride.json","anchors":2,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/the-ancient-magus-bride.json"] },
  { seriesId: "the-seven-deadly-sins", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/the-seven-deadly-sins.json","anchors":24,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/the-seven-deadly-sins.json"] },
  { seriesId: "to-your-eternity", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/to-your-eternity.json","anchors":2,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/to-your-eternity.json"] },
  { seriesId: "tokyo-ghoul-re", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/tokyo-ghoul-re.json","anchors":6,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/tokyo-ghoul-re.json"] },
  { seriesId: "tokyo-revengers", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/tokyo-revengers.json","anchors":2,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/tokyo-revengers.json"] },
  { seriesId: "welcome-to-demon-school-iruma-kun", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/welcome-to-demon-school-iruma-kun.json","anchors":6,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/welcome-to-demon-school-iruma-kun.json"] },
  { seriesId: "world-trigger", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/world-trigger.json","anchors":3,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/world-trigger.json"] },
  { seriesId: "yu-yu-hakusho-ghostfiles", ruleId: 'R21', value: {"file":"scripts/ingest/research/batch15/out/yu-yu-hakusho-ghostfiles.json","anchors":1,"zoneAcks":0}, reason: 'batch-15 verdict applied as-curated', ruledBy: 'session', ruledOn: '2026-08-24', cite: ["scripts/ingest/research/batch15/out/yu-yu-hakusho-ghostfiles.json"] },
];
