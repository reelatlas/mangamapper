// Applied rulings — Sean's wave-2 structural rulings, 2026-08-25
// (verifier-confirmed; records: CHUNK1-RECOVERY.md §13-§14, changelog
// §12.47 / §12.49), applied by scripts/ingest/apply-rulings-20260825b.ts (the
// cited, runnable record; NOT modified). One RulingEntry per one-time
// migration step; each step's DURABLE guard is named in its reason (the
// guards themselves are standing maps / research-tagged rows, not this file).

import type { RulingEntry } from '../types';

const SCRIPT = 'scripts/ingest/apply-rulings-20260825b.ts';
const OUT = 'scripts/ingest/research/batch17/out';
const RECOVERY = 'scripts/ingest/research/batch17/CHUNK1-RECOVERY.md';
const D = '2026-08-25';
const SS = 'saint-seiya-knights-of-the-zodiac';

export const ENTRIES: RulingEntry[] = [
  // ---- 1. saint-seiya chapter-space migration: volume_boundaries (manga 31045)
  {
    seriesId: SS, ruleId: 'V6',
    value: { manga_anilist_id: 31045, shift: -1, applies_to: 'chapter_start / chapter_end ≥ 30', source: 'research', idempotence_marker: 'v8 chapter_end 31 → 30' },
    reason: "the stored space (Wikipedia's 110) contains ONE phantom chapter: \"ch 30\" 金牛宮の戦闘, which is anime episode 43's title (en-WP even preserved the anime's ruby gloss \"Batoru\"). True tankōbon space = 109 chapters per Shueisha's own TOCs — UNIFORM −1 for stored values ≥ 30. The verifier REFUTED the verdict's second phantom at ch 53 and its \"+2 from 50\" leg (Shueisha's vol-15 TOC has 4 chapters); ruling on the verdict as written would have shipped an off-by-one across vols 15-28. Durable guard: the corrected boundaries carry source='research' — Wikipedia re-ingest disagreement FLAGS, never overwrites research rows",
    ruledBy: 'Sean', ruledOn: D, cite: [`${OUT}/saint-seiya-knights-of-the-zodiac.json`, SCRIPT, `${RECOVERY} §14`, '§12.47'],
  },
  // ---- 1. saint-seiya chapter-space migration: ALL anchors
  {
    seriesId: SS, ruleId: 'N22',
    value: { shift: -1, applies_to: 'chapter / start_chapter / continue_chapter ≥ 30', note_suffix: 'space migration −1 (phantom ch 30 removed, Sean 2026-08-25)' },
    reason: 'every saint-seiya anchor value ≥ 30 (chapter, start, continue) shifts −1 into the true 109-chapter NUMBER space — run AFTER the batch apply so the fresh wave-2 anchors (delivered in stored space; all ≤46, where only the −1 applies) convert too. series.total_chapters (249) is AniList count-space and is untouched (one display, one space)',
    ruledBy: 'Sean', ruledOn: D, cite: [`${OUT}/saint-seiya-knights-of-the-zodiac.json`, SCRIPT, `${RECOVERY} §14`, '§12.47'],
  },
  // ---- 1. saint-seiya ep-31 verdict row defect
  {
    seriesId: SS, ruleId: 'A10',
    value: { episode: 31, start_chapter: 24, was: 25 },
    reason: 'the verdict\'s ep-31 row is self-inconsistent (start 25 vs chapters_adapted "24-25"): START is the first chapter animated, so start → 24 (post-migration values). Caught by the verifier, fixed at curation',
    ruledBy: 'Sean', ruledOn: D, cite: [`${OUT}/saint-seiya-knights-of-the-zodiac.json`, SCRIPT, `${RECOVERY} §14`],
  },
  // ---- 2. project-arms phantom row 53
  {
    seriesId: 'project-arms', ruleId: 'N2',
    value: { delete_episode: 53, title: 'PS2 Video Game' },
    reason: 'episode row 53 "PS2 Video Game" is an animefillerlist artifact (a Bandai PS2 game, air date 2002-03-28 — BEFORE ep 52\'s 03-30, the giveaway; proven 5 ways). The row is deleted here; its mu anchor is deleted by batch 17\'s DELETIONS_APPROVED; counts 53→52 via SERIES_UPDATES. Deleting the anchor alone would be resurrected (row typed mixed, mu re-derives) — hence the row. Durable guard: COMMUNITY_COUNT_OVERRIDES cap 52 (lib/resolve.ts) so the next AFL refresh cannot resurrect it',
    ruledBy: 'Sean', ruledOn: D, cite: [`${OUT}/project-arms.json`, SCRIPT, 'scripts/ingest/apply-research-batch-17.ts (DELETIONS_APPROVED, SERIES_UPDATES)', `${RECOVERY} §14`, '§12.47'],
  },
  // ---- 3. trigun MU cross-association
  {
    seriesId: 'trigun', ruleId: 'I6',
    value: { delete_ingest_mangaupdates: { manga_anilist_id: 30703, mu_series_id: 30005048940 }, series_patch: { latest_known_chapters: null } },
    reason: 'ingest_mangaupdates mapped our AniList 30703 (Trigun, 3 vols/20 ch) to mu_series 30005048940 "Trigun Maximum" (latest 102) — a wrong auto-match (script-confirmed). The association row is deleted and latest_known_chapters nulled: total_chapters=23 governs a finished manga; bestLatestKnown re-derives only from a correct row',
    ruledBy: 'Sean', ruledOn: D, cite: [`${OUT}/trigun.json`, SCRIPT, `${RECOVERY} §14`, '§12.47'],
  },
  // ---- 4. eyeshield phantom row 155 (added same day, Sean's pending-rows report)
  {
    seriesId: 'eyeshield-21', ruleId: 'N2',
    value: { delete_episode: 155, delete_anchor: 155, series_patch: { aired_episodes: 145, total_episodes: 145 } },
    reason: 'AFG\'s chart numbers its 145th row "155." — the extend path materialized it as a duplicate finale (no air date), the mu anime-end pin landed on it, totals floored to 155 and the UI synthesized 146-154 as pending. A lone-row overshoot is a typo: the real finale = row 145 (manual anchor ch 240 already stands). Durable guards: COMMUNITY_COUNT_OVERRIDES cap 145 + the EXTRAS_ADOPTED entry ("10 specials beyond 145") removed — its premise was this typo',
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, '§12.49', '§12.47'],
    supersedes: 'EXTRAS_ADOPTED eyeshield-21 (10 specials beyond 145)',
  },
  // ---- 5. blade-of-the-immortal boundary mislabel
  {
    seriesId: 'blade-of-the-immortal-ona', ruleId: 'V6',
    value: { delete_volume: 31, upsert: { volume: 30, chapter_start: 198, chapter_end: 206, source: 'research' } },
    reason: 'stored table had v31: 198-? and NO v30 — Dark Horse\'s 31-volume count leaked into the JP 30-volume table; the manga\'s own numbering space has 30 volumes and true JP v30 = acts 198-206 (Wikipedia chapter list; verifier-confirmed). Research-tagged so a re-ingest flags rather than overwrites',
    ruledBy: 'session', ruledOn: D, cite: [`${OUT}/blade-of-the-immortal-ona.json`, SCRIPT, '§12.47'],
  },
  // ---- 6. fist-of-the-blue-sky mislabeled component → order-only
  {
    seriesId: 'fist-of-the-blue-sky', ruleId: 'N4',
    value: { anilist_id: 3864, episode_start: null, episode_end: null, was: { episode_start: 23, episode_end: 26, kind: 'ova' }, label: 'DVD-only release of withheld TV eps 16-18, 21 (not OVAs; not a trailing block — Sean 2026-08-25, verifier-confirmed vs AniList/ja-WP/en-WP/fandom)' },
    reason: 'AniList 3864 "DVD episodes" was stored spanning eps 23-26 (kind ova) but the four DVD-only episodes are WITHHELD TV eps (production 16/17/18/21) inside the one continuous 26-episode numbering — not OVAs, not a trailing block. A wrong non-season span can mis-shift AFG numbering conversion, so the component is demoted to ORDER-ONLY (null span; it never counts), facts kept in the label',
    ruledBy: 'Sean', ruledOn: D, cite: [`${OUT}/fist-of-the-blue-sky.json`, SCRIPT, '§12.51'],
  },
];
