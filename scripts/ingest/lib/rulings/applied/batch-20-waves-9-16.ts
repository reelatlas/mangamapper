// Applied rulings — research batch 20, waves 9-16 + the sidecar + the
// recap re-kind (2026-09-02 … 2026-09-04). One RulingEntry per curated
// DECISION in the one-shot apply scripts, which moved to
// scripts/ingest/history/ under P34 (kept as the cited record, never run):
//   apply-wave9.ts    — the L-D pin lane (§12.99)
//   apply-wave10.ts   — fist-of-the-north-star 109-151 (§12.100)
//   apply-wave11.ts   — kingdom 104-128 / bleach 190-202 / shippuden 374-392 (§12.101)
//   apply-wave12.ts   — four-knights 1-23 (§12.102)
//   apply-wave13.ts   — dai 18-59, the PRINTED-space rebase (§12.103)
//   apply-wave14.ts   — dai 60-100, the gap lane closes (§12.104)
//   apply-sidecar.ts  — T28's sliver clause: reborn / d-gray-man 66 / tsugumomo 8 / Ranking of Kings scopes (§12.106)
//   rekind-recaps.ts  — deep consolidate: 13 annotations re-kinded to `recap` (§12.107)
//   apply-wave16.ts   — the mixed_fragment_only queue under T28 (§12.107)
// (There is no apply-wave15.ts — the wave numbering skips 15.)
// Maps covered, in script order per section below. What the scripts folded
// "as delivered" from the verdict files is NOT repeated here — the verdict
// JSONs are the record for those rows; only the curated overlays, holds,
// deletions, repairs, seeds, scopes and pointers are entries. Reasons are the
// script's inline why, verbatim or lightly trimmed; `ruledBy: 'Sean'` only
// where the script or its comments say so. Types (T6), dates (G53), chapter
// spaces (N35 sourceShifts) and position-less rows (A44) that the scripts
// name as "MAP entries asserted by the healers" live in their own ruling
// maps — recorded here as POINTERS only, never as the ruled value.

import type { RulingEntry } from '../types';

const H = 'scripts/ingest/history';
const OUT = 'scripts/ingest/research/batch20/out';
const VER = 'scripts/ingest/research/batch20/verify';
const S9 = `${H}/apply-wave9.ts`;
const S10 = `${H}/apply-wave10.ts`;
const S11 = `${H}/apply-wave11.ts`;
const S12 = `${H}/apply-wave12.ts`;
const S13 = `${H}/apply-wave13.ts`;
const S14 = `${H}/apply-wave14.ts`;
const S16 = `${H}/apply-wave16.ts`;
const SSC = `${H}/apply-sidecar.ts`;
const SRK = `${H}/rekind-recaps.ts`;
const D2 = '2026-09-02';
const D3 = '2026-09-03';
const D4 = '2026-09-04';

type AnchorDeletion = { episode: number };
type ContinueMove = { episode: number; toEpisode: number };
type AnchorValue = { episode: number; end_chapter: number; start_chapter: number | null; chapters_adapted: string | null; volume?: number | null; note?: string; sources?: string[] };
type AnchorNoteOverride = { episode: number; chapters_adapted?: string; note: string };
type ContinueNoteOverride = { episode: number; note: string };
type AnnotationNoteOverride = { episode: number; kind: string; note: string };
type AnnotationValue = { episode: number; kind: string; chapters: string | null; note: string };
type FlagDismissal = { flagId: number; why: string };
type ContinueOverride = { episode: number; continue_chapter: number; delivered?: number | null };
type NoteFix = { episodes: number[]; field: 'anchor' | 'continue'; text: string };
type UpperFence = { fence: number | null; how: string };
type Pointer = { map: string; episodes?: number[]; note?: string };
type FenceRepair = { episode: number; set: Record<string, unknown>; continue?: number };
type CaOverride = { episode: number; chapters_adapted: string };
type BoundarySeed = { rows: { volume: number; chapter_start: number; chapter_end: number | null }[] };
type EndOverride = { episode: number; end_chapter: number; delivered: number | null };
type StartOverride = { episode: number; start_chapter: number; delivered: number | null };
type AnnotationChaptersOverride = { episode: number; kind: string; chapters: string };
type PrintedRebase = { listFrom: number; shift: number; volumeTable: string; ep100Pin: string; textRule: string };
type AnnotationRewrite = { episode: number; from: { kind: string; chapters: string }; to: { kind: string; chapters: string; note: string } };
type AnnotationNoteSuffix = { episode: number; kind: string; suffix: string };
type AnnotationDeletion = { episode: number; kind: string };
type RowHold = { episode: number };
type KindOverride = { episode: number; from: string; to: string; chapters: string; note: string; deleteFrom?: boolean };
type ScopeValue = { afl_slug: string | null; start_volume: number | null; start_chapter: number | null; end_volume: number | null; end_chapter: number | null; note: string };
type RecapMove = { episode: number; from: string; chapters: string | null; keepFrom: boolean };

// ===========================================================================
// apply-wave9.ts — the L-D pin lane closed 29/29 (2026-09-02; Sean ruled,
// WAVE9-RECOVERY §THE DECISIONS: "everything else is good", the erased ep-12
// type reconsidered → the T6 map entry is the ruling record). Nine verdicts
// folded as delivered; the overlays below are the curated decisions.
// ===========================================================================

// ANCHOR_DROP — erased's ep-12 mu anchor deleted (A1, the studio ending)
const W9_ANCHOR_DROP: RulingEntry<AnchorDeletion>[] = [
  { seriesId: 'erased', ruleId: 'A1', value: { episode: 12 }, reason: 'A1: the studio ending; the mu pin sat on the wrong row (the chapter is reached in ep 11)', ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/erased.json`, `${VER}/erased.md`, S9, '§12.99'] },
];

// CONTINUE_MOVE — the wave-6 trap: a continue on a deleted row lands nothing
const W9_CONTINUE_MOVE: RulingEntry<ContinueMove>[] = [
  { seriesId: 'erased', ruleId: 'C1', value: { episode: 12, toEpisode: 11 }, reason: "the continue lands on the surviving terminal row (C1 IN 35) — a continue on a deleted row lands nothing (the wave-6 trap); the verdict's ep-12 continue moved to ep 11", ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/erased.json`, S9, '§12.99'] },
];

// ANCHOR_ADD — cells-at-work-code-black: the verified 13-row map landed as a
// ZONE (rows do not exist yet, A42) because the display interpolates a
// row-less entry between anchors and a lone frontier rendered a false
// back-jump (P5; the 2026-09-02 apply) — plus the G56 frontier at ep 8.
const CB = 'cells-at-work-code-black';
const CB_SRC = ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', `${VER}/${CB}.md`];
const CB_ZONE = "the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42)";
const cbZone = (episode: number, end_chapter: number, start_chapter: number, chapters_adapted: string, volume: number, rowNote: string): RulingEntry<AnchorValue> => ({
  seriesId: CB, ruleId: 'A42', value: { episode, end_chapter, start_chapter, chapters_adapted, volume, note: `${rowNote}; ${CB_ZONE}.`, sources: CB_SRC }, reason: `${rowNote}; ${CB_ZONE}`, ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${CB}.json`, `${VER}/${CB}.md`, S9, '§12.99'],
});
const W9_ANCHOR_ADD: RulingEntry<AnchorValue>[] = [
  cbZone(1, 1, 1, '出張版 (the unnumbered prequel extra), 1', 1, 'ep 1 = ch 1 + the 出張版 prequel (unnumbered tankōbon extra — side_story)'),
  cbZone(2, 2, 2, '2 (+ 出張版後編 per the fandom)', 1, "ep 2 = ch 2 (+ the 出張版's second half)"),
  cbZone(3, 3, 3, '3', 1, 'ep 3 = ch 3'),
  cbZone(4, 4, 4, '4', 1, 'ep 4 = ch 4'),
  cbZone(5, 5, 5, '5', 1, 'ep 5 = ch 5'),
  cbZone(6, 14, 13, '13, 14', 3, "ep 6 = ch 13 + 14 (the anime pulls part two's opening chapters into the first body)"),
  cbZone(7, 15, 15, '15, 12 (a back-reach — rearranged)', 3, 'ep 7 = ch 15 + 12 (ch 12 played after 14 — a back-reach, END stays 15 in running order, A4)'),
  cbZone(9, 6, 6, '6', 2, 'ep 9 = ch 6 — the run returns to part one after eps 6-8 (a settled reorder zone 9-13 = ch 6-10, A42 rearranged)'),
  cbZone(10, 7, 7, '7', 2, "ep 10 = ch 7 (AC1677's death)"),
  cbZone(11, 8, 8, '8', 2, 'ep 11 = ch 8'),
  cbZone(12, 9, 9, '9', 2, 'ep 12 = ch 9'),
  {
    seriesId: CB, ruleId: 'G56',
    value: { episode: 8, end_chapter: 17, start_chapter: 16, chapters_adapted: '16, 17', volume: 3, note: "G56: the series' furthest first-time coverage is ch 17, reached in ep 8, not the finale — ep 8's title takes 肺血栓 and 機転 from ch 17 肺血栓、機転、再会 and ja-WP footnotes the thrombus deaths 原作第17話に基づく; the fandom's episode field lists 16 + 17. Delivered from the wave-9 verdict's per-episode map (verified 13/13); the row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_Episode_8'] },
    reason: "G56: the honest frontier is ch 17 at ep 8, not the finale — ep 8's title takes 肺血栓 and 機転 from ch 17 and ja-WP footnotes the thrombus deaths 原作第17話に基づく; the fandom's episode field lists 16 + 17. Added from the verdict's per-episode map (verified 13/13); row does not exist yet (A42)",
    ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${CB}.json`, `${VER}/${CB}.md`, S9, '§12.99'],
  },
];

// ANCHOR_NOTE_OVERRIDE — verifier correction A on code-black's finale
const W9_ANCHOR_NOTE_OVERRIDE: RulingEntry<AnchorNoteOverride>[] = [
  { seriesId: CB, ruleId: 'A47', value: { episode: 13, chapters_adapted: '10; 11 (the syringe-and-waking beat only — ch 11 runs on past it, unadapted)', note: "ep 13 = ch 10 心筋梗塞、蘇生、変化 verbatim + a post-credits tail from ch 11 (ja-WP 原作第11話): the syringe and the waking in the second body ONLY — ch 11 continues into the second body's cast and the 顆粒球輸血 reveal, none animated (verifier correction A). A47's finale clause: the tail stands, END 11, C1 IN 11." }, reason: "the ch-11 tail re-worded (verifier correction A): only the syringe-and-waking beat is animated, ch 11 runs on unadapted — A47's finale clause: the tail stands, END 11, C1 IN 11", ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${CB}.json`, `${VER}/${CB}.md`, S9, '§12.99'] },
];

// CONTINUE_NOTE_OVERRIDE — the finale's continue note (C1 + the C3 skip)
const W9_CONTINUE_NOTE_OVERRIDE: RulingEntry<ContinueNoteOverride>[] = [
  { seriesId: CB, ruleId: 'C3', value: { episode: 13, note: 'C1: the finale ends INSIDE ch 11 — only its syringe-and-waking beat is animated; read ch 11 whole, then SKIP ch 12-17 (C3: eps 6-8 played 13+14 / 15+12 / 16+17 out of order, relocated into the first body), then ch 18-48 were never adapted.' }, reason: 'C1: the finale ends inside ch 11; C3: the reader skips ch 12-17 on arrival (eps 6-8 played them out of order, relocated into the first body); ch 18-48 were never adapted', ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${CB}.json`, `${VER}/${CB}.md`, S9, '§12.99'] },
];

// NOTE_OVERRIDE — erased ep 12: the ja-WP citation softened (divergence) and
// the T28 mandatory tie worded (loose_parallel)
const W9_NOTE_OVERRIDE: RulingEntry<AnnotationNoteOverride>[] = [
  { seriesId: 'erased', ruleId: 'A43', value: { episode: 12, kind: 'divergence', note: "The whole finale is the studio's own realization of an ending the author described but did not draw for it (ja-WP's own sentence 「第十一話の途中から」 marks the departure; the cited 三部けい × 伊藤智彦 interview says 着地点は同じ / 尺がない / 新しいシチュエーション without an episode number — the mid-ep-11 cut-over is proven by the synopsis-vs-ch-35 comparison). Setting, mechanism and timeframe all differ from ch 36-44 (the rooftop and a sabotaged IV in 2010 vs the camping trap, the burning bridge and 2012.01)." }, reason: "the ja-WP citation softened (verifier): the interview says 着地点は同じ / 尺がない / 新しいシチュエーション without an episode number — the mid-ep-11 cut-over is proven by the synopsis-vs-ch-35 comparison, not by the citation; setting, mechanism and timeframe all differ from ch 36-44", ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/erased.json`, `${VER}/erased.md`, S9, '§12.99'] },
  { seriesId: 'erased', ruleId: 'T28', value: { episode: 12, kind: 'loose_parallel', note: "Mandatory tie (T28). The finale restages, without adapting, the beats the manga carries in ch 42-44: Yashiro using Kumi as bait (ch 42: lured and drugged, not a sabotaged IV), Yashiro's admission that Satoru is what makes him feel alive, and the reunion under the overpass — whose final line 「一緒に雪やどりしてもいいですか？」 is ch 44's verbatim (see the partial{44})." }, reason: "the T28 mandatory tie worded: the finale restages, without adapting, the beats of ch 42-44 (Kumi as bait; Yashiro's admission; the reunion under the overpass whose final line is ch 44's verbatim — see the partial{44})", ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/erased.json`, `${VER}/erased.md`, S9, '§12.99'] },
];

// ANNOTATION_ADD — code-black's zone facts from the wave-9 map + erased's
// partial{44} (the sole-adaptation tie, T28)
const W9_ANNOTATION_ADD: RulingEntry<AnnotationValue>[] = [
  { seriesId: CB, ruleId: 'N35', value: { episode: 1, kind: 'side_story', chapters: '出張版 (prequel)', note: 'The unnumbered 出張版 tankōbon extra (collected in vols 4/5) opens the anime — part of the SOURCE with no mainline number (the GTO/Toroko rule); position rests on ch 1. {wave 9 map}' }, reason: 'the unnumbered 出張版 tankōbon extra (collected in vols 4/5) opens the anime — part of the SOURCE with no mainline number (the GTO/Toroko rule); position rests on ch 1', ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${CB}.json`, S9, '§12.99'] },
  { seriesId: CB, ruleId: 'N35', value: { episode: 2, kind: 'side_story', chapters: '出張版後編', note: "The 出張版 extra's second half per the fandom; position rests on ch 2. {wave 9 map}" }, reason: "the 出張版 extra's second half per the fandom; position rests on ch 2", ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${CB}.json`, S9, '§12.99'] },
  { seriesId: CB, ruleId: 'A4', value: { episode: 7, kind: 'rearranged', chapters: '12', note: "Ch 12 is played after ch 13-15 (eps 6-7 pull part two's chapters into the first body in the order 13, 14, 15, 12); the END stays 15 in running order (A4). {wave 9 map}" }, reason: "ch 12 is played after ch 13-15 (eps 6-7 pull part two's chapters into the first body in the order 13, 14, 15, 12); the END stays 15 in running order (A4)", ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${CB}.json`, S9, '§12.99'] },
  { seriesId: CB, ruleId: 'A43', value: { episode: 8, kind: 'graft', chapters: '6 (the fatty-liver scene)', note: 'ja-WP: 原作第6話の脂肪肝の場面がアニメ版第8話に取り込まれている — one scene of ch 6 grafted into ep 8; ch 6 proper is ep 9. {wave 9 map}' }, reason: 'ja-WP: 原作第6話の脂肪肝の場面がアニメ版第8話に取り込まれている — one scene of ch 6 grafted into ep 8; ch 6 proper is ep 9', ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${CB}.json`, S9, '§12.99'] },
  { seriesId: CB, ruleId: 'A42', value: { episode: 9, kind: 'rearranged', chapters: '6-10 (the zone, eps 9-13)', note: "A42 settled reorder: after eps 6-8 played ch 12-17 in the first body, eps 9-13 return to part one's ch 6-10 (ja-WP: アニメ版第9話からは原作第6話以降の各話に基づく); the frontier stays ch 17 at ep 8 (G56). {wave 9 map}" }, reason: "A42 settled reorder: after eps 6-8 played ch 12-17 in the first body, eps 9-13 return to part one's ch 6-10 (ja-WP verbatim); the frontier stays ch 17 at ep 8 (G56)", ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${CB}.json`, S9, '§12.99'] },
  { seriesId: 'erased', ruleId: 'T28', value: { episode: 12, kind: 'partial', chapters: '44 (the closing scene)', note: "T28 sole-adaptation exception (Sean 2026-09-02): the anime's closing scene is ch 44's arc close — the final line 「一緒に雪やどりしてもいいですか？」 verbatim, the same 高架下 in the same snow (the 相合傘 footprints / Sachiko's umbrella / the Re:Re: mail / 2012.01 are the manga's alone) — adapted in no other episode; the row is mixed on this tie and stays A44 position-less (a far-forward beat is never an END; the continue is 35 on ep 11)." }, reason: "T28 sole-adaptation exception: the anime's closing scene is ch 44's arc close (the final line verbatim, the same 高架下 in the same snow) — adapted in no other episode; the row is mixed on this tie and stays A44 position-less (a far-forward beat is never an END; the continue is 35 on ep 11)", ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/erased.json`, `${VER}/erased.md`, S9, '§12.99'] },
];

// FLAGS_DISMISS — six flags dismissed with their answers (only Sean dismisses, G3)
const W9_FLAGS_DISMISS: RulingEntry<FlagDismissal>[] = [
  { seriesId: 'the-seven-deadly-sins-four-knights-of-the-apocalypse', ruleId: 'G3', value: { flagId: 729, why: "four-knights: MU's 120 is the S2 segment; the S1 pin 77 confirmed (wave 9)." }, reason: "MU's 120 is the S2 segment; the S1 pin 77 confirmed", ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/the-seven-deadly-sins-four-knights-of-the-apocalypse.json`, S9, '§12.99'] },
  { seriesId: 'gangsta', ruleId: 'G3', value: { flagId: 664, why: 'gangsta: MU and AniList now agree the manga is publishing — it resumed in Comic Bunch Kai 2026-07-03 (wave 9).' }, reason: 'MU and AniList now agree the manga is publishing — it resumed in Comic Bunch Kai 2026-07-03', ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/gangsta.json`, S9, '§12.99'] },
  { seriesId: 'erased', ruleId: 'G3', value: { flagId: 675, why: 'erased: MU latest_chapter 29 is the release-record field; the space is 44 + 5 Re chapters = 49 (wave 9, verified).' }, reason: 'MU latest_chapter 29 is the release-record field; the space is 44 + 5 Re chapters = 49 (verified)', ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/erased.json`, S9, '§12.99'] },
  { seriesId: 'girls-last-tour', ruleId: 'G3', value: { flagId: 782, why: 'girls-last-tour: G55 namesake contamination — "List of Girls episodes" is HBO\'s Girls (wave 9).' }, reason: 'G55 namesake contamination — "List of Girls episodes" is HBO\'s Girls', ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/girls-last-tour.json`, S9, '§12.99'] },
  { seriesId: 'girls-last-tour', ruleId: 'G3', value: { flagId: 823, why: 'girls-last-tour: the same HBO namesake page bleeding titles (wave 9).' }, reason: 'the same HBO namesake page bleeding titles (G55)', ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/girls-last-tour.json`, S9, '§12.99'] },
  { seriesId: CB, ruleId: 'G3', value: { flagId: 786, why: 'cells-at-work-code-black: G55 namesake contamination — "List of Orphan Black episodes" (wave 9, verified).' }, reason: 'G55 namesake contamination — "List of Orphan Black episodes" (verified)', ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/${CB}.json`, S9, '§12.99'] },
];

// Pointers — types (T6), dates (G53) and chapter spaces (N35) for wave 9 are
// MAP entries asserted by the healers; erased's ep-12 type reconsidered is
// the T6 map entry (the ruling record).
const W9_POINTERS: RulingEntry<Pointer>[] = [
  { seriesId: 'erased', ruleId: 'T6', value: { map: 'lib/rulings/episode-types.ts', episodes: [12], note: 'the erased ep-12 type reconsidered (WAVE9-RECOVERY §THE DECISIONS) — the T6 map entry is the ruling record; dates (G53) and chapter spaces (N35) for the wave likewise live in their maps' }, reason: 'pointer only: the value lives in the ruling map, asserted by the healer', ruledBy: 'Sean', ruledOn: D2, cite: [S9, 'scripts/ingest/research/batch20/WAVE9-RECOVERY.md', '§12.99'] },
];

// ===========================================================================
// apply-wave10.ts — fist-of-the-north-star 109-151, seven sub-block verdicts
// (-w10a … -w10g) folded as delivered (2026-09-02; Sean ruled). Every VOLUME
// derived from the boundary table (V10, the P2 answer); the block's upper
// fence = ep 152 → 210.
// ===========================================================================
const FN = 'fist-of-the-north-star';
const FN_OUT = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((x) => `${OUT}/${FN}-w10${x}.json`);

// the merge + fence + volume conventions (the "wave-10 shape" later waves reuse)
const W10_CONVENTIONS: RulingEntry<UpperFence>[] = [
  { seriesId: FN, ruleId: 'A47', value: { fence: 210, how: 'one merged, episode-sorted anchor list across the seven files (A47 needs the NEXT anchored row\'s START across sub-block seams); the last row\'s next START = the block\'s upper fence: ep 152 → 210' }, reason: "the seven sub-blocks merged into one episode-sorted list so A47 sees the next START across seams; the block's upper fence is the stored ep 152 → 210", ruledBy: 'session', ruledOn: D2, cite: [...FN_OUT, S10, '§12.100'] },
  { seriesId: FN, ruleId: 'V10', value: { fence: null, how: 'the VOLUME is DERIVED from the boundary table for every anchor; the agent\'s field is printed beside it when they differ' }, reason: "the a+b verifier refuted two copied volumes — the catalog convention is the END's volume; deriving it is the P2 answer, the agent's field is printed beside it when they differ", ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${FN}-w10ab.md`, S10, '§12.100'] },
];

// CONTINUE_OVERRIDE — seam / C1 corrections from the verifiers
const W10_CONTINUE_OVERRIDE: RulingEntry<ContinueOverride>[] = [
  { seriesId: FN, ruleId: 'C2', value: { episode: 114, continue_chapter: 145, delivered: 146 }, reason: "C2 parity = ep 115's START (B read the seam on Falco's {1st} cast entry: ch 145; the verifier agreed) — the delivered 146 was A's guess at the handoff", ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${FN}-w10ab.md`, S10, '§12.100'] },
  { seriesId: FN, ruleId: 'C2', value: { episode: 144, continue_chapter: 195, delivered: 196 }, reason: "C2 parity = ep 145's START 195: F's 196 would skip ch 195's remaining fight pages that ep 145 shows (the f+g verifier: the no-skip choice)", ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${FN}-w10fg.md`, S10, '§12.100'] },
  { seriesId: FN, ruleId: 'C1', value: { episode: 131, continue_chapter: 179, delivered: 180 }, reason: 'C1: ep 131 ends MID-ch 179 (the Hyoh debut) and ep 133 finishes the chapter (the Jūkei revelation) — parity with 133\'s START; the delivered 180 contradicted the ch-179 cast (verifier F1)', ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${FN}-w10de.md`, S10, '§12.100'] },
];

// NOTE_FIX — verifier wording fixes prepended to the stored notes
const W10_NOTE_FIX: RulingEntry<NoteFix>[] = [
  { seriesId: FN, ruleId: 'C3', value: { episodes: [115], field: 'continue', text: "C3: SKIP ch 151 on arrival — this episode already grafted ch 151 (Falco's Hokuto-Army beat) ahead of the running order; resume at 147 and skip 151 when you reach it." }, reason: "C3: ep 115 already grafted ch 151 (Falco's Hokuto-Army beat) ahead of the running order — resume at 147 and skip 151 on arrival", ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${FN}-w10ab.md`, S10, '§12.100'] },
  { seriesId: FN, ruleId: 'C1', value: { episodes: [148], field: 'continue', text: "ch 202's Hyoh/Kuroyasha opening is ep 149's (verifier note)." }, reason: "ch 202's Hyoh/Kuroyasha opening is ep 149's (verifier note)", ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${FN}-w10fg.md`, S10, '§12.100'] },
  { seriesId: FN, ruleId: 'C1', value: { episodes: [151], field: 'continue', text: "MEDIUM: whether ep 152 finishes ch 209 is unwitnessed — ch 210's cast opens on the duel and Bat's arrival follows the final blow (verifier note)." }, reason: "MEDIUM: whether ep 152 finishes ch 209 is unwitnessed — ch 210's cast opens on the duel and Bat's arrival follows the final blow", ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${FN}-w10fg.md`, S10, '§12.100'] },
  { seriesId: FN, ruleId: 'A31', value: { episodes: [113], field: 'anchor', text: "ch 142's tail is RESTAGED at ep 117 (not animated first-time there) — verifier wording fix." }, reason: "ch 142's tail is RESTAGED at ep 117 (not animated first-time there) — verifier wording fix", ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${FN}-w10ab.md`, S10, '§12.100'] },
];

// ANNOTATION_ADD — added at curation (the verdicts applied the rule but omitted the tie)
const W10_ANNOTATION_ADD: RulingEntry<AnnotationValue>[] = [
  { seriesId: FN, ruleId: 'A4', value: { episode: 144, kind: 'graft', chapters: '196 (the Jūkei flashback)', note: "The Jūkei flashback sits LAST in ch 196's cast (at the reunion) and RQ87 states the relocation on both episode pages — ep 144 grafts it forward; END stays 195 (Kaioh's \"Raoh was a fool\" speech is ch 195's title beat). Added at curation (the f+g verifier)." }, reason: "the Jūkei flashback sits LAST in ch 196's cast and RQ87 states the relocation on both episode pages — ep 144 grafts it forward; END stays 195 (Kaioh's speech is ch 195's title beat). Added at curation (the f+g verifier)", ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${FN}-w10fg.md`, S10, '§12.100'] },
  { seriesId: FN, ruleId: 'A47', value: { episode: 119, kind: 'partial', chapters: "154 (the duel's opening pages)", note: "A47: ep 119's closing pages are ch 154's opening, which ep 120 starts on and replays — the tail is ep 120's; END stays 153 (Rihaku absent from ch 153's cast; ch 154 opens with the observers). Added at curation — the verdict applied A47 but omitted the tie annotation." }, reason: "A47: ep 119's closing pages are ch 154's opening, which ep 120 starts on and replays — the tail is ep 120's; END stays 153. Added at curation — the verdict applied A47 but omitted the tie annotation", ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${FN}-w10de.md`, S10, '§12.100'] },
];

// Pointer — types (T6) are MAP entries asserted by the healers (Sean rules)
const W10_POINTERS: RulingEntry<Pointer>[] = [
  { seriesId: FN, ruleId: 'T6', value: { map: 'lib/rulings/episode-types.ts', episodes: [131, 132, 133, 139, 140], note: '131 / 133 / 139 / 140 → mixed, 132 → filler — the verdicts\' type_corrections, asserted by the healer' }, reason: 'pointer only: the ruled types live in EPISODE_TYPE_OVERRIDES', ruledBy: 'Sean', ruledOn: D2, cite: [S10, '§12.100'] },
];

// ===========================================================================
// apply-wave11.ts — kingdom 104-128 (-w11a…d), bleach 190-202 (-w11a/b),
// naruto-shippuden 374-392 (-w11a/b) folded as delivered (2026-09-02; Sean
// ruled). Per series the sub-block files merged (the wave-10 shape).
// ===========================================================================

// SERIES upper fences — the next stored START above each block
const W11_FENCES: RulingEntry<UpperFence>[] = [
  { seriesId: 'kingdom', ruleId: 'A47', value: { fence: 441, how: 'the block\'s upper fence for A47 (the next anchored START above ep 128)' }, reason: 'the merged 104-128 list ends against the stored fence START 441', ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/kingdom-w11a.json`, `${OUT}/kingdom-w11d.json`, S11, '§12.101'] },
  { seriesId: 'bleach', ruleId: 'A47', value: { fence: 315, how: 'the block\'s upper fence for A47 (ep 203 → 315)' }, reason: 'the merged 190-202 list ends against the stored fence START 315 (ep 203)', ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/bleach-w11a.json`, `${OUT}/bleach-w11b.json`, S11, '§12.101'] },
  { seriesId: 'naruto-shippuden', ruleId: 'A47', value: { fence: 661, how: 'the block\'s upper fence for A47 (ep 393\'s stored START region)' }, reason: 'the merged 374-392 list ends against the stored fence 661 (ep 393, repaired below)', ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/naruto-shippuden-w11a.json`, `${OUT}/naruto-shippuden-w11b.json`, S11, '§12.101'] },
];

// FENCE_REPAIR — repairs delivered by the verdicts on stored MANUAL rows
// outside the target ranges (old → new)
const W11_FENCE_REPAIR: RulingEntry<FenceRepair>[] = [
  { seriesId: 'kingdom', ruleId: 'A47', value: { episode: 103, set: { chapter: 363, start_chapter: 360, chapters_adapted: '359 (p.14-18), 360-363, 364 (p.1-5)' } }, reason: "A47 (kingdom-w11a): the S3 finale ends on ch 364's first pages (Kyou Kai rejoining the unit, 364 p.1-5 — the fandom's Episode 103 page contradicts its own infobox; pcafe assigns 364 to S4 ep 1; ep 104 opens on 364 p.6) — the tail is ep 104's; END 364 → 363 (closes the wave-2 flag)", ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/kingdom-w11a.json`, `${VER}/kingdom-w11.md`, S11, '§12.101'] },
  { seriesId: 'bleach', ruleId: 'A10', value: { episode: 203, set: { start_chapter: 313, chapters_adapted: '313, 314, 315' } }, reason: 'Enrichment (bleach-w11b, three sources; the verifier: carry the span so start_without_span cannot list it): ep 203 opens on ch 313 — the 202 → 203 seam is no longer interpolated', ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/bleach-w11b.json`, `${VER}/bleach-w11.md`, S11, '§12.101'] },
  { seriesId: 'naruto-shippuden', ruleId: 'A8', value: { episode: 393, set: { chapter: 662, start_chapter: 660, chapters_adapted: '660 (tail), 661, 662', volume: 69 } }, reason: "The wave-11 shippuden verifier CONFIRMED the flag: ep 393 adapts ch 660's tail + 661 + 662 in full (its last line = ch 662's last sentence verbatim; Narutopedia infobox 660, 661, 662; AFG; en-WP) — the stored END 661 was one short and contradicted its own continue 663. 661 → 662 [660] v69", ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/naruto-shippuden-w11b.json`, `${VER}/naruto-shippuden-w11.md`, S11, '§12.101'] },
  { seriesId: 'bleach', ruleId: 'A47', value: { episode: 167, set: { start_chapter: 284, chapters_adapted: '284, 285, 286 (p.1-8)' } }, reason: 'Enrichment (bleach-w11a + the verifier): ep 167 = ch 284-286 p.8 in front of the 22-episode Amagai arc (A47: an 8-page share is substantive — END 286 stands); its continue 286 is precedented (127 → 229, 146 → 247 across filler blocks). Sean ruled the fence-row addition in scope', ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/bleach-w11a.json`, `${VER}/bleach-w11.md`, S11, '§12.101'] },
];

// CONTINUE_SKIP — EMPTY this wave (every fence-row continue ruled in scope;
// the bleach#167 example was not exercised). NOTE_FIX — EMPTY this wave.

// CA_OVERRIDE — chapters_adapted corrections from the verifiers (the value
// stands; the record's wording is fixed)
const W11_CA_OVERRIDE: RulingEntry<CaOverride>[] = [
  { seriesId: 'naruto-shippuden', ruleId: 'A43', value: { episode: 388, chapters_adapted: '656 (opening third: the Big Ball Rasenshuriken lands and Hashirama pins Madara with the Wood Dragon, Sai escorts Naruto, Gaara asks Shukaku for help and the tanuki agrees, the other beasts join to repay Naruto)' }, reason: "the Gate of the Great God torii beat is ep 391's (verifier) — the ch-656 share re-worded to the opening third; END stands", ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/naruto-shippuden-w11b.json`, `${VER}/naruto-shippuden-w11.md`, S11, '§12.101'] },
];

// Pointer — types (T6) and dates (G53) are MAP entries asserted by the
// healers (Sean rules); shippuden 392's stale batch-8 annotation note was
// replaced by the same-kind upsert of the delivered annotation (no overlay).
const W11_POINTERS: RulingEntry<Pointer>[] = [
  { seriesId: 'naruto-shippuden', ruleId: 'T6', value: { map: 'lib/rulings/episode-types.ts', note: "the verdicts' type_corrections (388 NOT filler on four witnesses — the retrospective is newly animated) asserted by the healer; dates in AIR_DATE_OVERRIDES (G53)" }, reason: 'pointer only: the ruled types and dates live in their maps', ruledBy: 'Sean', ruledOn: D2, cite: [S11, `${VER}/naruto-shippuden-w11.md`, '§12.101'] },
];

// ===========================================================================
// apply-wave12.ts — the-seven-deadly-sins-four-knights-of-the-apocalypse
// 1-23 (-w12a…d) folded as delivered (2026-09-02; Sean ruled). The boundary
// table was EMPTY for this manga (AniList 129117): seeded first.
// ===========================================================================
const FK = 'the-seven-deadly-sins-four-knights-of-the-apocalypse';
const FK_OUT = ['a', 'b', 'c', 'd'].map((x) => `${OUT}/${FK}-w12${x}.json`);

// UPPER_FENCE_START — the wave-9 manual anchor ep 24 → 77 [75]
const W12_FENCE: RulingEntry<UpperFence>[] = [
  { seriesId: FK, ruleId: 'A47', value: { fence: 75, how: "the block's upper fence = the wave-9 manual anchor ep 24 → 77 [75]" }, reason: 'the four sub-block files merged into one episode-sorted list so A47 sees the next START across seams; the last row ends against the stored ep-24 START 75', ruledBy: 'session', ruledOn: D2, cite: [...FK_OUT, S12, '§12.102'] },
];

// VOLUME_SEED — v1-v9, identical in the a / b / c verdicts' structure.notes
// (source 'research', provenance = the verdict files); inserted only where
// no row exists (P8: research-tier rows the volumes backfill never overwrites)
const W12_VOLUME_SEED: RulingEntry<BoundarySeed>[] = [
  { seriesId: FK, ruleId: 'V6', value: { rows: [[1, 1, 5], [2, 6, 14], [3, 15, 23], [4, 24, 32], [5, 33, 41], [6, 42, 50], [7, 51, 59], [8, 60, 68], [9, 69, 77]].map(([volume, chapter_start, chapter_end]) => ({ volume, chapter_start, chapter_end })) }, reason: 'the boundary table was EMPTY for this manga (AniList 129117), so the apply first SEEDS v1-v9 from the table all three landed verdicts agree on (fandom Volume pages + programming-cafe\'s 単行本 column + Kodansha\'s own product records / 初出); source research, inserting only rows that do not exist (P8)', ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${FK}-w12a.json`, `${OUT}/${FK}-w12b.json`, `${OUT}/${FK}-w12c.json`, `${VER}/${FK}-w12.md`, S12, '§12.102'] },
];

// CONTINUE_OVERRIDE, NOTE_FIX, CA_OVERRIDE — EMPTY this wave (the verifier
// found the block SOUND; the lib moved nothing).

// ANNOTATION_ADD — the verifier's one addition
const W12_ANNOTATION_ADD: RulingEntry<AnnotationValue>[] = [
  { seriesId: FK, ruleId: 'A47', value: { episode: 5, kind: 'partial', chapters: '14 (the C-part tag)', note: "The verifier (wave 12): ep 5's C-part is ch 14's opening (nissi0725 ep 5 \"そこそこの長さ\" Sistana/Calden/Anne C-part; ep 6 \"冒頭 … 原作14話の冒頭部分\" cold open) — two sources; a tail ep 6 starts on (A47: END 13 unchanged)." }, reason: "ep 5's C-part is ch 14's opening (nissi0725 ep 5 + ep 6 cold open — two sources); a tail ep 6 starts on (A47: END 13 unchanged)", ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${FK}-w12.md`, S12, '§12.102'] },
];

// ===========================================================================
// apply-wave13.ts — dragon-quest-the-adventure-of-dai 18-59 (-w13a…g; the
// LAST gap block, wave 1 of 2) folded as delivered (2026-09-02; Sean ruled)
// — and the PRINTED-SPACE rebase (N35). No anchored fence above within the
// wave (rows 60-99 = wave 14): sliverEnd 'no-next', the wave's last END stands.
// ===========================================================================
const DAI = 'dragon-quest-the-adventure-of-dai';
const DAI13_OUT = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((x) => `${OUT}/${DAI}-w13${x}.json`);
const DAI13_VER = [`${VER}/${DAI}-w13abc.md`, `${VER}/${DAI}-w13defg.md`];

// THE PRINTED SPACE (N35, Sean 2026-09-02) — one decision: the rebase
const W13_PRINTED_REBASE: RulingEntry<PrintedRebase>[] = [
  {
    seriesId: DAI, ruleId: 'N35',
    value: { listFrom: 123, shift: -1, volumeTable: 'wikipedia rows in the list space → printed (v13 end 122 → 121; v14-v37 − 1); idempotent via the v13 end marker — v13\'s last entry WAS the extra\'s slot (list 122): printed v13 ends at 121, the only boundary the shift cannot express', ep100Pin: 'the ep-100 MU pin (349 = MU\'s unit count) → 348 printed, v37; the mu cron re-derives the same through the ruled shift from now on', textRule: 'numbers ≥ 123 inside chapters_adapted / annotation chapters are chapter numbers (page numbers never reach 123) — converted at write; a note carrying list numbers is suffixed "[chapter numbers in this note are the 349-slot LIST space; printed = list − 1 from 123 (N35)]"' },
    reason: 'every wave-13 verdict delivered in the 349-slot list space (en-WP = AniList = MU); the catalog now stores the PRINTED 348 space — list N ≥ 123 = printed N − 1. Converted at write (the ruled shift, applied to the list-space verdict values; the END/START overrides are stated in the list space too), with the stored volume table and the ep-100 MU row re-based first so the volume derivation reads the printed space. Wave 13 was the last converter — wave 14 delivered in the printed space (N35 sourceShifts)',
    ruledBy: 'Sean', ruledOn: D2, cite: [...DAI13_VER, S13, 'scripts/ingest/research/batch20/WAVE13-RECOVERY.md', '§12.103'],
  },
];

// FENCE_REPAIR — the stored ep-17 row (old → new)
const W13_FENCE_REPAIR: RulingEntry<FenceRepair>[] = [
  { seriesId: DAI, ruleId: 'A47', value: { episode: 17, set: { chapter: 59, chapters_adapted: '57 (bulk), 58, 59, 60 (the relocated Crocodine-sends-Dai beat — a scrap; ep 18 owns ch 60)' } }, reason: 'A47 (w13a + the a-c verifier on three instruments: coco13 17 = ch 57-59 with no ch 60; Toei 17 ends on the reveal; the fandom ch-59 cast ends Hyunckel): the ch-60 share is a relocated beat, not first-time coverage — END 60 → 59; ep 18 → 63 [60]', ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${DAI}-w13a.json`, `${VER}/${DAI}-w13abc.md`, S13, '§12.103'] },
];

// ANNOTATION_CHAPTERS_OVERRIDE — the a-c verifier: w13b ep 28 graft{196} is
// the fandom's number — OUR 197 (さらば我が子よ = en-WP 197)
const W13_ANNOTATION_CHAPTERS_OVERRIDE: RulingEntry<AnnotationChaptersOverride>[] = [
  { seriesId: DAI, ruleId: 'N35', value: { episode: 28, kind: 'graft', chapters: '197 (pp 10, 12)' }, reason: "w13b's graft{196} is the fandom's number — OUR 197 (さらば我が子よ = en-WP 197), stated in the list space and converted at write like every other number", ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${DAI}-w13b.json`, `${VER}/${DAI}-w13abc.md`, S13, '§12.103'] },
];

// ANNOTATION_ADD — the verifier's relocation note on ep 17
const W13_ANNOTATION_ADD: RulingEntry<AnnotationValue>[] = [
  { seriesId: DAI, ruleId: 'A47', value: { episode: 17, kind: 'rearranged', chapters: '60', note: "The a-c verifier: ep 17's ch-60 share is the relocated Crocodine-sends-Dai beat (the fandom ep-17 差分 verbatim) — a relocation, not first-time coverage; END 59 (A47)." }, reason: "ep 17's ch-60 share is the relocated Crocodine-sends-Dai beat (the fandom ep-17 差分 verbatim) — a relocation, not first-time coverage; END 59 (A47)", ruledBy: 'session', ruledOn: D2, cite: [`${VER}/${DAI}-w13abc.md`, S13, '§12.103'] },
];

// THE A47 CONVENTION FOR THIS SERIES (Sean rules, WAVE13-RECOVERY §THE
// DECISIONS): A47 as written is an EXCEPTION that needs evidence — a ≤5-page
// tail or scrappy wording; an unquantified 最初/序盤 share is a real share of
// unknown size → the END ADVANCES (A4), the tail named as `partial`. C/D/E/F/G
// delivered that way (holds only on quantified tails: 46, 47, 56, 57); A/B
// held on position language. Under the ruled convention A/B's four
// position-language holds ADVANCE (their continues already sit there); ep 17
// → 59 stands on the relocation evidence. HOLD_C = false leaves C as
// delivered (the alternative — 30 → 107, 31 → 110, 32 → 113 + partials — was
// NOT taken; HOLD_PARTIALS is therefore EMPTY).
const W13_A47_CONVENTION = 'A47 as written is an EXCEPTION that needs evidence (a ≤5-page tail or scrappy wording); an unquantified 最初/序盤 share is a real share of unknown size → the END ADVANCES (A4), the tail named as partial. A/B held on position language; under the ruled convention the hold ADVANCES — the continue already sits there';
const W13_END_OVERRIDE: RulingEntry<EndOverride>[] = [
  { seriesId: DAI, ruleId: 'A47', value: { episode: 23, end_chapter: 82, delivered: 81 }, reason: `${W13_A47_CONVENTION} (23 → 82, list space)`, ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/${DAI}-w13a.json`, `${VER}/${DAI}-w13abc.md`, S13, 'scripts/ingest/research/batch20/WAVE13-RECOVERY.md', '§12.103'] },
  { seriesId: DAI, ruleId: 'A47', value: { episode: 25, end_chapter: 90, delivered: 89 }, reason: `${W13_A47_CONVENTION} (25 → 90, list space)`, ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/${DAI}-w13a.json`, `${VER}/${DAI}-w13abc.md`, S13, 'scripts/ingest/research/batch20/WAVE13-RECOVERY.md', '§12.103'] },
  { seriesId: DAI, ruleId: 'A47', value: { episode: 28, end_chapter: 101, delivered: 100 }, reason: `${W13_A47_CONVENTION} (28 → 101, list space)`, ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/${DAI}-w13b.json`, `${VER}/${DAI}-w13abc.md`, S13, 'scripts/ingest/research/batch20/WAVE13-RECOVERY.md', '§12.103'] },
  { seriesId: DAI, ruleId: 'A47', value: { episode: 29, end_chapter: 104, delivered: 103 }, reason: `${W13_A47_CONVENTION} (29 → 104, list space)`, ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/${DAI}-w13b.json`, `${VER}/${DAI}-w13abc.md`, S13, 'scripts/ingest/research/batch20/WAVE13-RECOVERY.md', '§12.103'] },
];

// START_OVERRIDE — the d-g verifier: D's ep 39 START 135 and E's ep 42 START
// 150 applied opposite rules to the same shape (a first-time remainder of a
// chapter three back) — one rule: E's (the stored ep-7 shape)
const W13_START_OVERRIDE: RulingEntry<StartOverride>[] = [
  { seriesId: DAI, ruleId: 'A10', value: { episode: 39, start_chapter: 138, delivered: 135 }, reason: "D's ep 39 START 135 and E's ep 42 START 150 applied opposite rules to the same shape (a first-time remainder of a chapter three back) — one rule: E's (the stored ep-7 shape): START = the running-order chapter, the back-jump stays rearranged (list space)", ruledBy: 'session', ruledOn: D2, cite: [`${OUT}/${DAI}-w13d.json`, `${VER}/${DAI}-w13defg.md`, S13, '§12.103'] },
];

// CONTINUE_SKIP, NOTE_FIX, CA_OVERRIDE — EMPTY this wave.

// ANNOTATION_REWRITE — the one record the shift cannot express: ep 35's
// divergence names the LIST's slot 122 = the unnumbered 番外編「勇者アバン」
const W13_ANNOTATION_REWRITE: RulingEntry<AnnotationRewrite>[] = [
  {
    seriesId: DAI, ruleId: 'N35',
    value: { episode: 35, from: { kind: 'divergence', chapters: '122 (not adapted)' }, to: { kind: 'side_story', chapters: 'the unnumbered 番外編「勇者アバン」 (vol 13 back matter, between printed ch 121 and 122; NOT adapted here)', note: 'N35 (Sean 2026-09-02): the 番外編 "The Hero Avan" (V Jump, Nov 1991) is printed as unnumbered bonus matter at the end of tankobon vol 13 — the catalog\'s chapter space is the PRINTED 348, so it carries no number (en-WP / AniList / MU / MangaDex count it as their 122 and run +1 from there). The 2020 series skips it at this point (ep 35 runs printed 121 → 122 with no story gap); it is adapted out of order later (queued for the 60-99 block — ep 61) and will be noted there.' } },
    reason: "ep 35's divergence names the LIST's slot 122 = the unnumbered 番外編「勇者アバン」 (printed at the back of vol 13, no mainline number); in the printed space '122' is a real chapter ep 35 adapts. Sean (2026-09-02): the unnumbered chapter and every one-shot are NOTED as side_story wherever they sit or are adapted, never numbered",
    ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/${DAI}-w13c.json`, `${VER}/${DAI}-w13abc.md`, S13, '§12.103'],
  },
];

// Pointer — types (T6) and dates (G53) are MAP entries asserted by the healers
const W13_POINTERS: RulingEntry<Pointer>[] = [
  { seriesId: DAI, ruleId: 'T6', value: { map: 'lib/rulings/episode-types.ts', note: "the wave-13 verdicts' type_corrections asserted by the healer; dates in AIR_DATE_OVERRIDES (G53)" }, reason: 'pointer only: the ruled types and dates live in their maps', ruledBy: 'Sean', ruledOn: D2, cite: [...DAI13_OUT, S13, '§12.103'] },
];

// ===========================================================================
// apply-wave14.ts — dai 60-100, seven sub-block verdicts (-w14a…g) DELIVERED
// IN THE PRINTED SPACE (2026-09-03; Sean ruled). The finale (ep 100) has no
// next row, so its tail stands (C1). CONTINUE_OVERRIDE, START_OVERRIDE,
// CA_OVERRIDE and ANNOTATION_ADD — EMPTY this wave.
// ===========================================================================
const DAI14_OUT = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((x) => `${OUT}/${DAI}-w14${x}.json`);
const V14ABD = `${VER}/${DAI}-w14abd.md`;
const V14CEFG = `${VER}/${DAI}-w14cefg.md`;

// END_OVERRIDE — two forks ruled one way each
const W14_END_OVERRIDE: RulingEntry<EndOverride>[] = [
  // A47 AS WRITTEN (verifier w14cefg items 1-3): Toei's own episode close
  // carries TEASER wording — the trailing share is a scrap the next episode
  // owns; the continues already point at the next START (290 / 301 / 321)
  // and the partial annotations name the tie.
  { seriesId: DAI, ruleId: 'A47', value: { episode: 83, end_chapter: 289, delivered: 290 }, reason: "A47 as written: Toei's close = the creeping shadow 「……」; morisan3rd 289 ends on the tentacle attack; Toei ep 84 re-narrates the seizure (E's fence note was right) — the trailing share is a scrap the next episode owns; the continue already points at 290", ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w14d.json`, V14CEFG, S14, '§12.104'] },
  { seriesId: DAI, ruleId: 'A47', value: { episode: 86, end_chapter: 300, delivered: 301 }, reason: "A47 as written: Toei's close 「はたして、三局の戦いの決着はいかに――？」; morisan3rd 300 holds 闘魔滅砕陣, Toei ep 87 opens on it breaking; the 301 share is fandom-only — the continue already points at 301", ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w14e.json`, V14CEFG, S14, '§12.104'] },
  { seriesId: DAI, ruleId: 'A47', value: { episode: 92, end_chapter: 320, delivered: 321 }, reason: "A47 as written: Toei's close 「ある提案を持ちかける――」 (the teaser F itself cited); morisan3rd puts the proposal in 321; coco13 bounds at 320 — the continue already points at 321", ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w14f.json`, V14CEFG, S14, '§12.104'] },
  // THE FANDOM-ONLY FORK (both verifiers): a trailing share asserted by the
  // fandom's straddle mark ALONE (coco13 / Toei stop one short, no teaser
  // wording). B held ep 70 (249), E held ep 87 (303), D advanced ep 80 (281).
  // The alternative — ADVANCE under the unproven-tail convention, { 70: 250,
  // 96: 335 } — was NOT taken.
  { seriesId: DAI, ruleId: 'R3', value: { episode: 80, end_chapter: 280, delivered: 281 }, reason: "HOLD — Sean ruled 2026-09-03: a tail's existence needs two sources before its size is a question (R3 before A47); hold, keep the share in chapters_adapted, the partial notes it single-source. 70 (249) and 87 (303) stand as delivered under the same ruling", ruledBy: 'Sean', ruledOn: D3, cite: [`${OUT}/${DAI}-w14d.json`, V14ABD, V14CEFG, S14, '§12.104'] },
];

// ANNOTATION_NOTE_SUFFIX — the single-source partials (the fandom's straddle
// mark alone) carry the ruling in their note
const w14SingleSource = (episode: number, share: number, stop: number, extra: string): RulingEntry<AnnotationNoteSuffix> => ({
  seriesId: DAI, ruleId: 'R3', value: { episode, kind: 'partial', suffix: `SINGLE-SOURCE (Sean ruled HOLD 2026-09-03, R3 before A47): only the fandom's straddle mark credits a share of ch ${share}; coco13 and Toei stop at ${stop} — ${extra}, the continue is ${share} either way.` }, reason: `only the fandom's straddle mark credits a share of ch ${share}; coco13 and Toei stop at ${stop} — ${extra} (R3 before A47), the continue is ${share} either way`, ruledBy: 'Sean', ruledOn: D3, cite: [V14ABD, V14CEFG, S14, '§12.104'],
});
const W14_ANNOTATION_NOTE_SUFFIX: RulingEntry<AnnotationNoteSuffix>[] = [
  w14SingleSource(70, 250, 249, 'END holds at 249'),
  w14SingleSource(80, 281, 280, 'END held at 280 (delivered 281)'),
  w14SingleSource(87, 304, 303, 'END holds at 303'),
];

// NOTE_FIX — anchor-note additions at curation
const W14_NOTE_FIX: RulingEntry<NoteFix>[] = [
  { seriesId: DAI, ruleId: 'R3', value: { episodes: [78, 79, 80, 81, 82, 83], field: 'anchor', text: "Toei's synopsis (added at curation; the verifier read it live): https://www.toei-anim.co.jp/tv/dq-dai/episode/summary/<ep>/" }, reason: "the verifier read Toei's own per-episode synopsis live for eps 78-83 — the citation added at curation so each anchor names the second independent source", ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w14d.json`, V14ABD, V14CEFG, S14, '§12.104'] },
  { seriesId: DAI, ruleId: 'A4', value: { episodes: [96], field: 'anchor', text: 'Verifier (w14cefg): the closing 335 scenes are a FORWARD PULL (rearranged{335}), not a tail — END 334 stands on two sources.' }, reason: 'the closing 335 scenes are a FORWARD PULL (rearranged{335}), not a tail — END 334 stands on two sources', ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w14g.json`, V14CEFG, S14, '§12.104'] },
  { seriesId: DAI, ruleId: 'R3', value: { episodes: [75], field: 'anchor', text: 'Verifier (w14cefg): morisan3rd 265 opens on exactly the relocated Barn/Mistbarn scene — confidence high.' }, reason: 'morisan3rd 265 opens on exactly the relocated Barn/Mistbarn scene — confidence raised to high', ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w14c.json`, V14CEFG, S14, '§12.104'] },
];

// EP59_START — held at the stored 213
const W14_EP59_START: RulingEntry<StartOverride>[] = [
  { seriesId: DAI, ruleId: 'A10', value: { episode: 59, start_chapter: 213, delivered: 214 }, reason: "ep 59's START: A and E repair 213 → 214 (Toei's synopsis opens at Carl = ch 214); B, C, D and F keep 213 (coco13: ep 58 '213話…の途中まで', ep 59 '213話の途中から' — a real split, 'from midway'). Held at the stored 213 until the verifier rules", ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w14a.json`, `${OUT}/${DAI}-w14e.json`, V14ABD, S14, '§12.104'] },
];

// FENCE_REPAIR — wave 13's three fence rows, one chapter low (the phantom
// fandom shift): five agents independently found the fandom's field is
// printed (wave 13's inferred 'from 208' window was phantom) — each +1 with
// its chapters_adapted and continue (kind parity); wave 13's note REPLACED
// outright, not appended (it quoted list-space titles — a self-refuting note
// is worse than none)
const W14_FENCE_REPAIR: RulingEntry<FenceRepair>[] = [
  { seriesId: DAI, ruleId: 'N35', value: { episode: 57, set: { chapter: 208, start_chapter: 204, chapters_adapted: '204 (bulk), 205, 206, 207, 208, 209 (1 panel)' }, continue: 209 }, reason: "Wave 14 (B, C, D, F agree): the fandom's ep-57 field is PRINTED (six consecutive numbers 204-209; the ruled from-208 shift collided 207/208 and wave 13 dropped one); coco13 bounds ep 57 at 原作23巻208話 不屈の勇者・ダイ; the 1-panel shot is ch 209 恐怖の切り札's first panel. END 207 → 208, continue 208 → 209", ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w13d.json`, V14ABD, S14, '§12.104'] },
  { seriesId: DAI, ruleId: 'N35', value: { episode: 58, set: { chapter: 213, start_chapter: 209, chapters_adapted: '209, 210, 211, 212, 213 (partial)' }, continue: 213 }, reason: "Wave 14 (B, C, D, E, F agree): coco13 opens ep 58 at 原作23巻209話 恐怖の切り札 (en-WP list 210 − 1) and Toei's synopsis ends with the Mother Dragon carrying Dai away = ch 213 世界破滅への序曲!!!. START 208 → 209, END 212 → 213, continue 212 → 213 (C1: ep 59 resumes in 213)", ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w13d.json`, V14ABD, S14, '§12.104'] },
  { seriesId: DAI, ruleId: 'A47', value: { episode: 59, set: { chapter: 217, start_chapter: 213, chapters_adapted: '213 (from midway), 214, 215, 216, 217 (opening)' }, continue: 217 }, reason: "Wave 14 (A, B, C, D, F agree on the END): the stored note was self-refuting — \"ch 217 最後の希望\" while printed 217 is 処刑宣告の罠!!! and 216 is 最後の希望; Toei ep 59 ends on the Demon Army's notice arriving (217's opening), ep 60 opens on its contents. END 216 → 217 (A47: an unproven opening advances with a partial), continue 216 → 217", ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w13d.json`, V14ABD, S14, '§12.104'] },
];

// ANNOTATION_CHAPTERS_OVERRIDE — the ep-57 partial re-keyed with the repair
// (explicitly, since the same-kind upsert replaces it only if the verdicts
// carry one); ep 96's fandom "335 sliver" re-read as a forward pull
const W14_ANNOTATION_CHAPTERS_OVERRIDE: RulingEntry<AnnotationChaptersOverride>[] = [
  { seriesId: DAI, ruleId: 'A47', value: { episode: 57, kind: 'partial', chapters: '209 (1 panel)' }, reason: "re-keyed with the repair: the closing panel is ch 209 恐怖の切り札's first panel, which ep 58 opens on — END stays 208 (re-keyed from {208}: the phantom fandom shift)", ruledBy: 'session', ruledOn: D3, cite: [V14ABD, S14, '§12.104'] },
  { seriesId: DAI, ruleId: 'A4', value: { episode: 96, kind: 'rearranged', chapters: '335 (the Gomez-at-Romos / Nova-to-Ozam scenes, pulled forward)' }, reason: "ep 96 (verifier w14cefg item 4): the fandom's '335 sliver' is the Gomez-at-Romos / Nova-to-Ozam scenes morisan3rd places in 335 and coco13 says the anime MOVED before Dai stands — a forward-pulled fragment (rearranged, A4), not an A47 tail; END 334 stands", ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w14g.json`, V14CEFG, S14, '§12.104'] },
  { seriesId: DAI, ruleId: 'A47', value: { episode: 96, kind: 'partial', chapters: '332' }, reason: "the partial on ep 96 names 332 (the genuine tail), not the fandom's 335 — see the rearranged{335} above", ruledBy: 'session', ruledOn: D3, cite: [`${OUT}/${DAI}-w14g.json`, V14CEFG, S14, '§12.104'] },
];

// The ep-100 MU pin → manual (P8): the stored pin (348 v37, verified by G) is
// enriched with START 345 + the span and flips mu → manual by the upsert
const W14_MU_PIN: RulingEntry<Pointer>[] = [
  { seriesId: DAI, ruleId: 'P8', value: { map: 'chapter_anchors', episodes: [100], note: "ep 100's stored MU pin (348 v37, verified by G) enriched with START 345 + the span and flipped mu → manual; the finale has no next row, so its tail stands (C1)" }, reason: 'a verified MU pin enriched at the manual tier so the next mu re-derive cannot strip the START and span (P8); the finale tail stands (C1)', ruledBy: 'Sean', ruledOn: D3, cite: [`${OUT}/${DAI}-w14g.json`, V14CEFG, S14, '§12.104'] },
];

// Pointers — ep 61 is anchor_hostile (A44: it adapts ONLY the unnumbered
// 番外編「勇者アバン」) — the map entry in lib/rulings/anchor-suppressed.ts is
// the ruling; the script wrote its side_story annotation and no anchor (and
// refused any anchor_hostile row not ruled there first, P10). Types (T6) are
// map entries asserted by the healer.
const W14_POINTERS: RulingEntry<Pointer>[] = [
  { seriesId: DAI, ruleId: 'A44', value: { map: 'lib/rulings/anchor-suppressed.ts', episodes: [61], note: 'ep 61 adapts ONLY the unnumbered 番外編「勇者アバン」 — position-less; its side_story annotation was written by the apply, no anchor, its continue skipped (an A44 row carries no anchor to hold it)' }, reason: 'pointer only: the A44 ruling lives in ANCHOR_SUPPRESSED', ruledBy: 'Sean', ruledOn: D3, cite: [`${OUT}/${DAI}-w14a.json`, S14, '§12.104'] },
  { seriesId: DAI, ruleId: 'T6', value: { map: 'lib/rulings/episode-types.ts', note: "the wave-14 verdicts' type_corrections asserted by the healer" }, reason: 'pointer only: the ruled types live in EPISODE_TYPE_OVERRIDES', ruledBy: 'Sean', ruledOn: D3, cite: [...DAI14_OUT, S14, '§12.104'] },
];

// ===========================================================================
// apply-wave16.ts — the mixed_fragment_only queue under T28's sliver clause,
// 15 verdict files (-w16), file-driven (2026-09-04; Sean ruled). Anchors at
// the MANUAL tier with the volume derived (lib/volumes.ts); an annotation
// whose KIND changed is deleted by the explicit list (never auto — A6);
// anchor_hostile rows that stay mixed are A44 map entries. CONTINUE_OVERRIDE,
// START_OVERRIDE, END_OVERRIDE and ANCHOR_SKIP — EMPTY this wave.
// ===========================================================================
const W16 = (sid: string) => `${OUT}/${sid}-w16.json`;
const V16A = `${VER}/w16-anchors.md`;
const V16T = `${VER}/w16-types.md`;

// ANNOTATION_DELETE — annotations whose KIND the verdict replaced (old kind
// deleted; the new kind is in the verdict's annotations)
const W16_ANNOTATION_DELETE: RulingEntry<AnnotationDeletion>[] = [
  { seriesId: 'bleach', ruleId: 'P24', value: { episode: 46, kind: 'partial' }, reason: 'replaced by side_story{-17} (the bonus chapter carries no mainline number)', ruledBy: 'session', ruledOn: D4, cite: [W16('bleach'), S16, '§12.107'] },
  { seriesId: 'eyeshield-21', ruleId: 'P24', value: { episode: 66, kind: 'partial' }, reason: 'replaced by loose_parallel{132-133} (no page-level evidence; a framing line)', ruledBy: 'session', ruledOn: D4, cite: [W16('eyeshield-21'), S16, '§12.107'] },
  { seriesId: 'heavens-lost-property', ruleId: 'P24', value: { episode: 23, kind: 'partial' }, reason: 'replaced by rearranged{32} + side_story (the chapter identified)', ruledBy: 'session', ruledOn: D4, cite: [W16('heavens-lost-property'), S16, '§12.107'] },
  { seriesId: 'heavens-lost-property', ruleId: 'P24', value: { episode: 24, kind: 'partial' }, reason: 'replaced by side_story naming both 北風と太陽 extras', ruledBy: 'session', ruledOn: D4, cite: [W16('heavens-lost-property'), S16, '§12.107'] },
  { seriesId: 'naruto-shippuden', ruleId: 'P24', value: { episode: 90, kind: 'partial' }, reason: 'replaced by rearranged{343,346,347} + divergence (the thread split)', ruledBy: 'session', ruledOn: D4, cite: [W16('naruto-shippuden'), S16, '§12.107'] },
  { seriesId: 'naruto-shippuden', ruleId: 'P24', value: { episode: 213, kind: 'partial' }, reason: 'replaced by rearranged{482} + recap', ruledBy: 'session', ruledOn: D4, cite: [W16('naruto-shippuden'), S16, '§12.107'] },
  { seriesId: 'rosario-vampire', ruleId: 'P24', value: { episode: 14, kind: 'graft' }, reason: 'replaced by side_source{Season II ch 1 + 3} + recap + divergence (the side_source itself re-kinded chain_source at apply — see KIND_OVERRIDE)', ruledBy: 'session', ruledOn: D4, cite: [W16('rosario-vampire'), S16, '§12.107'] },
  { seriesId: 'tokyo-mew-mew', ruleId: 'P24', value: { episode: 37, kind: 'partial' }, reason: 'replaced by loose_parallel{19} (weight sliver)', ruledBy: 'session', ruledOn: D4, cite: [W16('tokyo-mew-mew'), S16, '§12.107'] },
];

// CONTINUE_SKIP — a delivered continue no anchor row can hold
const W16_CONTINUE_SKIP: RulingEntry<AnchorDeletion>[] = [
  { seriesId: 'bleach', ruleId: 'A44', value: { episode: 46 }, reason: 'verifier (w16-anchors): no anchor row can hold it (A44) — the display carries the previous position forward; the delivered continue not written', ruledBy: 'session', ruledOn: D4, cite: [W16('bleach'), V16A, S16, '§12.107'] },
];

// FENCE_REPAIR — fence repairs on stored rows outside the verdicts' asks (verifier-ruled)
const W16_FENCE_REPAIR: RulingEntry<FenceRepair>[] = [
  { seriesId: 'saint-seiya-knights-of-the-zodiac', ruleId: 'A10', value: { episode: 65, set: { start_chapter: 38 } }, reason: "Verifier (w16-anchors): ep 65 opens INSIDE ch 38 (the testament's aftermath) — the stored START 39 collided with ep 64's C1 continue 38; both the verdict's flag and the verifier's sources agree", ruledBy: 'session', ruledOn: D4, cite: [W16('saint-seiya-knights-of-the-zodiac'), V16A, S16, '§12.107'] },
];

// ROW_HOLD — rows the verifier HELD: the verdict's annotations and hostile
// rulings for them are not applied (the stored record stands)
const W16_ROW_HOLD: RulingEntry<RowHold>[] = [
  { seriesId: 'tokyo-mew-mew', ruleId: 'P16', value: { episode: 21 }, reason: "HELD by the verifier: the verdict's annotations and anchor_hostile entry for ep 21 are not applied — the stored record stands until re-researched", ruledBy: 'session', ruledOn: D4, cite: [W16('tokyo-mew-mew'), V16A, V16T, S16, '§12.107'] },
];

// KIND_OVERRIDE — T26 THE CHAIN (Sean 2026-09-04): a delivered kind rewritten
// at apply — the sequel manga is ON THE CHAIN (I41), so the row is canon
// material told out of order
const W16_KIND_OVERRIDE: RulingEntry<KindOverride>[] = [
  { seriesId: 'rosario-vampire', ruleId: 'T26', value: { episode: 14, from: 'side_source', to: 'chain_source', chapters: "Season II: ch 1 'A Brand-New Season', ch 3 'Superglue Girl'", note: "T26 THE CHAIN / I41 (Sean 2026-09-04): Rosario + Vampire Season II is the sequel manga on the series' reading chain — its ch 1 + 3 carry the episode's spine, so the material is CANON to the series told out of order: the row is MIXED (canon chapters inside Gonzo's original Kokoa plot), POSITION-LESS (A44: the anchor column is numeric in Season I's space; the display carries the previous position forward). weight: significant (in the chain work). Whether Capu2 should be its own entry with Season II as its instrument is queued for the identity pass." }, reason: "Rosario + Vampire Season II is the sequel manga on the series' reading chain (I41) — its ch 1 + 3 carry the episode's spine, so the material is CANON told out of order: the row is MIXED, POSITION-LESS (A44); weight significant (in the chain work). Whether Capu2 should be its own entry with Season II as its instrument is queued for the identity pass", ruledBy: 'Sean', ruledOn: D4, cite: [W16('rosario-vampire'), V16A, S16, '§12.107'] },
];

// EXTRA_ANNOTATIONS — the standing side_source re-kinded (the old kind deleted)
const W16_EXTRA_ANNOTATIONS: RulingEntry<KindOverride>[] = [
  { seriesId: 'trigun', ruleId: 'T26', value: { episode: 18, from: 'side_source', to: 'chain_source', chapters: "Trigun Maximum: ch 1 'HERO REBORN', ch 2 'LINA' (TM vol 1)", note: "T26 THE CHAIN / I41 (Sean 2026-09-04): Trigun Maximum is the continuation manga on the series' reading chain — its own numbering, never convertible into Trigun's; the standing side_source becomes chain_source (canon to the series told out of order; the row stays mixed, position-less). Re-kinded from the original side_source note.", deleteFrom: true }, reason: "Trigun Maximum is the continuation manga on the series' reading chain (I41) — its own numbering, never convertible into Trigun's; the standing side_source becomes chain_source (canon told out of order; the row stays mixed, position-less)", ruledBy: 'Sean', ruledOn: D4, cite: [W16('trigun'), S16, '§12.107'] },
];

// NOTE_FIX — verifier notes prepended to the annotation note of that row + kind
const W16_NOTE_FIX: RulingEntry<AnnotationNoteOverride>[] = [
  { seriesId: 'saint-seiya-knights-of-the-zodiac', ruleId: 'T28', value: { episode: 64, kind: 'partial', note: 'DISCLOSED (verifier): animefillerlist types ep 64 FILLER — the sole-adaptation exception overrules it (the Aiolos testament pages appear in no other episode: fandom ep 64 + ch 38, en-WP eps 63/65); the T6 map pins mixed (P8).' }, reason: 'animefillerlist types ep 64 FILLER — the sole-adaptation exception overrules it (the Aiolos testament pages appear in no other episode); the T6 map pins mixed (P8)', ruledBy: 'session', ruledOn: D4, cite: [W16('saint-seiya-knights-of-the-zodiac'), V16T, S16, '§12.107'] },
  { seriesId: 'bleach', ruleId: 'A47', value: { episode: 284, kind: 'partial', note: "Verifier: the fandom's Aizen page says ch 376 pp 1-7, its Harribel page pp 1-5 for the same scene — the share is 5-7 pages; END 376 holds either way (376 is the row's only record)." }, reason: "the fandom's Aizen page says ch 376 pp 1-7, its Harribel page pp 1-5 for the same scene — the share is 5-7 pages; END 376 holds either way (376 is the row's only record)", ruledBy: 'session', ruledOn: D4, cite: [W16('bleach'), V16A, S16, '§12.107'] },
  { seriesId: 'black-butler', ruleId: 'T28', value: { episode: 37, kind: 'graft', note: 'Verifier: ch 22 pp 30-34 are FIRST-TIME pages here (the 2008 series never reaches the circus), a tease — the assignment is adapted properly at ep 38 (ch 24-25); weight: sliver.' }, reason: 'ch 22 pp 30-34 are FIRST-TIME pages here (the 2008 series never reaches the circus), a tease — the assignment is adapted properly at ep 38 (ch 24-25); weight sliver', ruledBy: 'session', ruledOn: D4, cite: [W16('black-butler'), V16T, S16, '§12.107'] },
  { seriesId: 'trigun', ruleId: 'T28', value: { episode: 6, kind: 'partial', note: 'Verifier: the steamer-arrival / plant-supplies beat of ch 4 is shown only here (ep 7 restages the party); a trivial first-time beat — weight: sliver, filler stands.' }, reason: 'the steamer-arrival / plant-supplies beat of ch 4 is shown only here (ep 7 restages the party); a trivial first-time beat — weight sliver, filler stands', ruledBy: 'session', ruledOn: D4, cite: [W16('trigun'), V16T, S16, '§12.107'] },
  { seriesId: 'chrono-crusade', ruleId: 'R3', value: { episode: 21, kind: 'graft', note: 'Verifier: keep the extent-unverified qualifier — Act 22 "Sinner" was read by nobody (MangaDex node 404).' }, reason: 'keep the extent-unverified qualifier — Act 22 "Sinner" was read by nobody (MangaDex node 404)', ruledBy: 'session', ruledOn: D4, cite: [W16('chrono-crusade'), V16T, S16, '§12.107'] },
];

// Pointers — types are T6 MAP entries (generated from the verdicts'
// type_corrections, asserted by the healer); anchor_hostile rows that stay
// mixed are A44 map entries (a stored anchor on a hostile row was deleted by
// the apply, A1 / A44); the other hostile rows became filler by the T6 map.
const W16_FILES = ['black-butler', 'bleach', 'chrono-crusade', 'detective-school-q', 'eyeshield-21', 'fire-force', 'hajime-no-ippo-the-fighting', 'heavens-lost-property', 'naruto-shippuden', 'rosario-vampire', 'sailor-moon', 'saint-seiya-knights-of-the-zodiac', 'tokyo-mew-mew', 'trigun', 'zatch-bell'];
const W16_POINTERS: RulingEntry<Pointer>[] = [
  { seriesId: '*', ruleId: 'T6', value: { map: 'lib/rulings/episode-types.ts + lib/rulings/anchor-suppressed.ts', note: `the 15 -w16 verdicts (${W16_FILES.join(', ')}): 11 rows → filler and HLP 18 → canon by the T6 map; 3 mixed rows position-less by the A44 map (rosario 14, trigun 18, bleach 46) — asserted by the healer` }, reason: 'pointer only: the ruled types and position-less rows live in their maps; the apply deleted stored anchors on hostile rows (A1 / A44) and wrote nothing for them', ruledBy: 'Sean', ruledOn: D4, cite: [V16T, V16A, S16, '§12.107'] },
];

// ===========================================================================
// apply-sidecar.ts — Batch 20 SIDECAR (Sean ruled 2026-09-04 — T28's sliver
// clause + the standing list): reborn (the phantom ties + the recap rows +
// the ch-257 fence), d-gray-man 66 (the sliver clause's first witness),
// tsugumomo 8 (anchor 19 + the unnumbered extra as side_story), the Ranking
// of Kings scopes (part one / part two at 155 / 156, the Naruto shape) with
// the ep-23 handoff note. Types are T6 MAP entries asserted by the healer.
// ===========================================================================
const V_REBORN = [`${OUT}/reborn-slivers.json`, `${VER}/reborn-slivers.md`];
const ROK = 'ranking-of-kings';
const TCOC = 'ranking-of-kings-the-treasure-chest-of-courage';
const TCOC_SCOPE = `${OUT}/${TCOC}-scope.json`;

// ANCHOR_DELETE — anchors on rows the T6 map moves to filler (A1)
const SC_ANCHOR_DELETE: RulingEntry<AnchorDeletion>[] = [
  { seriesId: 'reborn', ruleId: 'A1', value: { episode: 159 }, reason: 'no ch-232 segment exists (the baseball episode is original end to end; ch 232 is in eps 158 / 160) — filler (T6), A1', ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'reborn', ruleId: 'T28', value: { episode: 177 }, reason: "a wholesale recap of the Choice arc on every source — the recap clause: weightless, filler (T6), no anchor; its 256 also sat below ep 176's corrected 257", ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'reborn', ruleId: 'A1', value: { episode: 178 }, reason: "no ch-257 segment exists (the frame is Irie's device, anime-original; ch 257 opens in ep 176 and closes in ep 190) — filler (T6), A1", ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'reborn', ruleId: 'A1', value: { episode: 189 }, reason: "no ch-257 segment exists (the frame is the anime's Lal Mirch device from ep 177; ch 257's cast has no Lal Mirch) — filler (T6), A1", ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'd-gray-man', ruleId: 'T28', value: { episode: 66 }, reason: "T28's sliver clause (first witness): one page of ch 78 inside an original training episode carries no weight — filler (T6), no position of its own (A44); ep 65 ends inside 78, ep 67 adapts it properly", ruledBy: 'Sean', ruledOn: D4, cite: ['scripts/ingest/research/batch17/out/d-gray-man.json', SSC, '§12.106'] },
];

// reborn 176: END 256 → 257 (the fence repair, verified medium; volume 27
// unchanged — v27 = 249-258)
const SC_FENCE_REPAIR: RulingEntry<FenceRepair>[] = [
  { seriesId: 'reborn', ruleId: 'A4', value: { episode: 176, set: { chapter: 257, chapters_adapted: '254, 255, 256, 257 (opening block)' } }, reason: "ch 257's opening block ends the episode (verified R24, medium: two content witnesses + TV Tokyo 190's tell); the closing block is ep 190's — END 256 → 257 [254], volume 27 unchanged (v27 = 249-258)", ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
];

// ANCHOR_UPSERT — tsugumomo ep 8 (the S1 map, wave 9)
const SC_ANCHOR_UPSERT: RulingEntry<AnchorValue>[] = [
  { seriesId: 'tsugumomo', ruleId: 'A44', value: { episode: 8, end_chapter: 19, start_chapter: 19, chapters_adapted: '19; + the unnumbered vol-5 extra (side_story)', note: 'Ep 8 = ch 19 (the first segment; the real 8/9 reorder: ep 9 = ch 16-18) + the unnumbered extra モテモテフレグランス (side_story). Sean ruled 2026-09-04: not A44 — a numbered chapter is adapted, so the row has a position.' }, reason: "ruled NOT position-less: a numbered chapter (19, the first segment) is adapted, so the row has a position; the second segment is the unnumbered vol-5 extra (side_story). The S1 map: the fandom's straddle-aware chapters field corroborated by the wiki's arc table and matching titles", ruledBy: 'Sean', ruledOn: D4, cite: [`${OUT}/tsugumomo.json`, SSC, '§12.106'] },
];

// CONTINUE_UPSERT
const SC_CONTINUE_UPSERT: RulingEntry<ContinueOverride & { kind: string }>[] = [
  { seriesId: 'reborn', ruleId: 'C1', value: { episode: 176, continue_chapter: 257, kind: 'parity' }, reason: "C1: ep 176 ends inside ch 257's opening block; ch 257 resumes properly at ep 190 (eps 177-189 are a recap + the anime-original Primo arc)", ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'tsugumomo', ruleId: 'C2', value: { episode: 8, continue_chapter: 20, kind: 'parity' }, reason: "C2: ep 8 completes ch 19; ep 9 back-jumps to 16-18 (rearranged) and ep 10 resumes at 20 — resume at 20, ch 16-18 are ep 9's", ruledBy: 'Sean', ruledOn: D4, cite: [`${OUT}/tsugumomo.json`, SSC, '§12.106'] },
];

// ANNOTATION_DELETE — the phantom ties and the mis-kinded rows
const SC_ANNOTATION_DELETE: RulingEntry<AnnotationDeletion>[] = [
  { seriesId: 'reborn', ruleId: 'P24', value: { episode: 159, kind: 'partial' }, reason: 'the sliver never existed', ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'reborn', ruleId: 'P24', value: { episode: 178, kind: 'partial' }, reason: 'the sliver never existed', ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'reborn', ruleId: 'P24', value: { episode: 189, kind: 'partial' }, reason: 'the sliver never existed', ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'reborn', ruleId: 'P24', value: { episode: 177, kind: 'abridged' }, reason: 'replaced by recap{240-256} — abridged means a condensed adaptation, this row is a recap', ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'reborn', ruleId: 'P24', value: { episode: 189, kind: 'abridged' }, reason: 'replaced by recap{256-257}', ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  ...[178, 179, 188, 189].map((episode): RulingEntry<AnnotationDeletion> => ({ seriesId: 'reborn', ruleId: 'P24', value: { episode, kind: 'side_story' }, reason: 'an anime-original arc is filler rows, not a side story of the source; the "257 bookends" were phantom', ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] })),
];

// ANNOTATION_UPSERT
const SC_ANNOTATION_UPSERT: RulingEntry<AnnotationValue>[] = [
  { seriesId: 'reborn', ruleId: 'T28', value: { episode: 158, kind: 'graft', chapters: '232 (the Chrome / I-Pin baozi scene)', note: 'weight: sliver — one scene of ch 232 inside an otherwise original episode (three sources place the scene here); ch 232 is adapted properly by ep 160 (Choice rules, the Airbike reveal). Filler stands; the scene is noted, never weighed (T28).' }, reason: 'weight sliver — one scene of ch 232 inside an otherwise original episode (three sources place the scene here); ch 232 is adapted properly by ep 160. Filler stands; the scene is noted, never weighed (T28)', ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'reborn', ruleId: 'A4', value: { episode: 176, kind: 'partial', chapters: '254, 255, 256, 257 (opening block)', note: "Ep 176 runs past ch 256 into ch 257's opening block (the shrine arrival, Shoichi's order, Gokudera's Flame Missile, Byakuran recalling the system, Hibari peeling off, the group reaching the base) and stops there — END 256 → 257 (verified medium: two content witnesses + TV Tokyo 190's tell; the fandom Choice_Arc box 240-257 / 154-177). Ch 257's closing block is ep 190's." }, reason: "ep 176 runs past ch 256 into ch 257's opening block and stops there — END 256 → 257 (verified medium: two content witnesses + TV Tokyo 190's tell); ch 257's closing block is ep 190's", ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'reborn', ruleId: 'T28', value: { episode: 177, kind: 'recap', chapters: '240-256 (the Choice arc, retold to Lal Mirch)', note: 'THE RECAP CLAUSE (T28): a wholesale recap on every source (TV Tokyo, fandom, ja-WP) — weightless; nothing else in the row → filler, no anchor. Its "return to Namimori" is ep 176\'s pages retold. The first row to carry the `recap` kind (2026-09-04).' }, reason: 'THE RECAP CLAUSE (T28): a wholesale recap on every source (TV Tokyo, fandom, ja-WP) — weightless; nothing else in the row → filler, no anchor. The first row to carry the recap kind', ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'reborn', ruleId: 'T28', value: { episode: 189, kind: 'recap', chapters: "256-257 (retold inside the anime's Lal Mirch frame)", note: "THE RECAP CLAUSE (T28): the arc's closing episode retells 256-257 around an anime-original frame (the Lal Mirch emergency-room device from ep 177); no new ch-257 material — the fandom's \"257 (mostly filler)\" restated animefillerlist's typing. Ch 257 is adapted properly by eps 176 (opening) and 190 (closing)." }, reason: "THE RECAP CLAUSE (T28): the arc's closing episode retells 256-257 around an anime-original frame; no new ch-257 material — the fandom's \"257 (mostly filler)\" restated animefillerlist's typing. Ch 257 is adapted properly by eps 176 and 190", ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'reborn', ruleId: 'C1', value: { episode: 190, kind: 'partial', chapters: '257 (closing block), 258', note: "Ep 190 adapts the remainder of ch 257 (Squalo's call to Lussuria, the system's return and crash, six lights, the wall, Zakuro) and ch 258; ch 257's opening block is ep 176's." }, reason: "ep 190 adapts the remainder of ch 257 and ch 258; ch 257's opening block is ep 176's", ruledBy: 'Sean', ruledOn: D4, cite: [...V_REBORN, SSC, '§12.106'] },
  { seriesId: 'd-gray-man', ruleId: 'T28', value: { episode: 66, kind: 'partial', chapters: '78 (approx. p13 only)', note: "weight: sliver — ep 66 is built out of roughly one page of ch 78 (batch 17, agent-verified; both wiki families); ep 65 ends inside 78 and ep 67 adapts ch 78 properly. T28's sliver clause (Sean 2026-09-04): canon material with no weight — no anchor, the remainder decides (filler); noted here so the tie stays visible." }, reason: "weight sliver — ep 66 is built out of roughly one page of ch 78 (batch 17, agent-verified; both wiki families). T28's sliver clause: canon material with no weight — no anchor, the remainder decides (filler); noted so the tie stays visible", ruledBy: 'Sean', ruledOn: D4, cite: ['scripts/ingest/research/batch17/out/d-gray-man.json', SSC, '§12.106'] },
  { seriesId: 'tsugumomo', ruleId: 'N35', value: { episode: 8, kind: 'side_story', chapters: 'the unnumbered extra 「コミックハイ！出張版 モテモテフレグランス」 (printed in vol 5 between ch 29 and ch 30)', note: "Ep 8's second segment adapts the unnumbered extra (a side story serialized inside the source, printed as bonus matter in vol 5) — noted, never numbered (N35 / the Dai 61 convention); its first segment adapts ch 19 (the anchor)." }, reason: "ep 8's second segment adapts the unnumbered extra (a side story serialized inside the source, printed as bonus matter in vol 5) — noted, never numbered (N35 / the Dai 61 convention)", ruledBy: 'Sean', ruledOn: D4, cite: [`${OUT}/tsugumomo.json`, SSC, '§12.106'] },
  { seriesId: ROK, ruleId: 'I37', value: { episode: 23, kind: 'divergence', chapters: '150-155', note: "The finale has an original epilogue expansion. HANDOFF: the manga's part one ends here (vol 12 / ch 155 — ja-WP 「第一部（1巻1話〜12巻155話）」); part two (vol 13 / ch 156 →) is adapted by Ranking of Kings: The Treasure Chest of Courage, whose finale (ep 10) covers 156-161 and continues at 162 (C5 from a proven END — the earlier \"post-TCoC continue = 165\" was a single uncited research note)." }, reason: "the handoff note: the manga's part one ends at the finale (vol 12 / ch 155 — ja-WP verbatim); part two (vol 13 / ch 156 →) is adapted by The Treasure Chest of Courage, whose finale covers 156-161 and continues at 162 (C5 from a proven END — the earlier \"post-TCoC continue = 165\" was a single uncited research note)", ruledBy: 'Sean', ruledOn: D4, cite: [TCOC_SCOPE, SSC, '§12.106'] },
  { seriesId: TCOC, ruleId: 'N35', value: { episode: 9, kind: 'side_story', chapters: "vol 11 描き下ろし bonus chapter (MangaDex 141.5) — Miranjo and the demon's first meeting", note: "The publisher's own vol-11 e-book copy: 「ミランジョと魔神の出会いを描く単行本描き下ろしエピソードも収録!!」 — ep 9A 「ミランジョと魔神」 adapts it (closes the wave-8 open item). Unnumbered → noted, never numbered." }, reason: "the publisher's own vol-11 e-book copy names the 描き下ろし episode — ep 9A adapts it (closes the wave-8 open item). Unnumbered → noted, never numbered", ruledBy: 'Sean', ruledOn: D4, cite: [TCOC_SCOPE, SSC, '§12.106'] },
  { seriesId: TCOC, ruleId: 'N35', value: { episode: 1, kind: 'side_story', chapters: 'the extra printed at the back of vol 8 (MangaDex 104.5) — a 読切番外篇 first published in 月刊コミックビーム 2019年7月号', note: "Wording refinement (the publisher's vol-8 copy): the vol-8 extra is a 読切番外篇 from Comic Beam 2019/7, not a 描き下ろし. Unnumbered → noted, never numbered." }, reason: "wording refinement (the publisher's vol-8 copy): the vol-8 extra is a 読切番外篇 from Comic Beam 2019/7, not a 描き下ろし. Unnumbered → noted, never numbered", ruledBy: 'Sean', ruledOn: D4, cite: [TCOC_SCOPE, SSC, '§12.106'] },
];

// SCOPES — series_scopes (series_id-keyed): part one / part two at 155 / 156,
// the Naruto → Shippuden shape
const SC_SCOPES: RulingEntry<ScopeValue>[] = [
  { seriesId: ROK, ruleId: 'I36', value: { afl_slug: 'ranking-of-kings', start_volume: null, start_chapter: null, end_volume: 12, end_chapter: 155, note: 'Part one (vol 1 / ch 1 → vol 12 / ch 155 — ja-WP 「原作の第一部（1巻1話〜12巻155話）が映像化された」; KADOKAWA vol 13 「第二部開幕!!」); part two continues in the-treasure-chest-of-courage (the Naruto → Shippuden shape). Sean ruled 2026-09-04.' }, reason: 'Part one (vol 1 / ch 1 → vol 12 / ch 155 — ja-WP verbatim; KADOKAWA vol 13 「第二部開幕!!」); part two continues in the-treasure-chest-of-courage (the Naruto → Shippuden shape)', ruledBy: 'Sean', ruledOn: D4, cite: [TCOC_SCOPE, SSC, '§12.106'] },
  { seriesId: TCOC, ruleId: 'I36', value: { afl_slug: null, start_volume: 13, start_chapter: 156, end_volume: null, end_chapter: null, note: "Part two from vol 13 / ch 156 (its finale ep 10 = 156-161; the ch 162 → tail belongs here as the family's last covering entry); eps 1-9 are extras + originals owning no range. Sean ruled 2026-09-04." }, reason: "Part two from vol 13 / ch 156 (its finale ep 10 = 156-161; the ch 162 → tail belongs here as the family's last covering entry); eps 1-9 are extras + originals owning no range", ruledBy: 'Sean', ruledOn: D4, cite: [TCOC_SCOPE, SSC, '§12.106'] },
];

// Pointer — the T6 map asserts the four reborn rows + d-gray-man 66 → filler
const SC_POINTERS: RulingEntry<Pointer>[] = [
  { seriesId: 'reborn', ruleId: 'T6', value: { map: 'lib/rulings/episode-types.ts', episodes: [159, 177, 178, 189], note: 'the four reborn rows → filler, asserted by the healer' }, reason: 'pointer only: the ruled types live in EPISODE_TYPE_OVERRIDES', ruledBy: 'Sean', ruledOn: D4, cite: [SSC, '§12.106'] },
  { seriesId: 'd-gray-man', ruleId: 'T6', value: { map: 'lib/rulings/episode-types.ts', episodes: [66], note: 'd-gray-man 66 → filler (the sliver clause\'s first witness), asserted by the healer' }, reason: 'pointer only: the ruled type lives in EPISODE_TYPE_OVERRIDES', ruledBy: 'Sean', ruledOn: D4, cite: [SSC, '§12.106'] },
];

// ===========================================================================
// rekind-recaps.ts — deep consolidate after T28's sliver clause (2026-09-04):
// annotations that DESCRIBE a recap but were filed under another kind
// (abridged / partial / divergence) re-kinded to `recap` — a vocabulary fix
// on facts the batch-8…17 verdicts already established (their notes are the
// evidence); no type moves (every pure-recap row was already filler). The
// old row is deleted unless keepFrom (a mixed row where the other kind still
// names real content).
// ===========================================================================
const recap = (seriesId: string, episode: number, from: string, chapters: string | null, keepFrom: boolean, why: string, verdict: string): RulingEntry<RecapMove> => ({
  seriesId, ruleId: 'T28', value: { episode, from, chapters, keepFrom }, reason: `${why}. THE RECAP CLAUSE (T28): weightless in the standing; the remainder decides the type`, ruledBy: 'session', ruledOn: D4, cite: [verdict, SRK, '§12.107'],
});
const RK_MOVES: RulingEntry<RecapMove>[] = [
  recap('bleach', 266, 'partial', 'the arc so far (a recap bridge; new canon footage begins ep 267)', false, 'batch 8: "recap bridge" filed as an empty partial', 'scripts/ingest/history/apply-research-batch-8.ts'),
  recap('my-hero-academia', 64, 'divergence', 'the series so far (an anime-original recap framed as a news feature)', false, 'batch 10: "anime-original recap" filed as an empty divergence', 'scripts/ingest/history/apply-research-batch-10.ts'),
  recap('my-hero-academia', 39, 'partial', 'the series so far', true, 'batch 12: "recap ep with an anime-original pool scene + ch 49.5 partial" — the partial{49.5} stays, the recap becomes its own kind', 'scripts/ingest/history/apply-research-batch-12.ts'),
  recap('my-hero-academia', 160, 'abridged', '396-398', true, 'batch 14: "396-398 (recap) + 399-400" — the recap half becomes recap{396-398}; the abridged note stays for 399-400 (condensed adaptation)', 'scripts/ingest/history/apply-research-batch-14.ts'),
  recap('reborn', 119, 'abridged', null, false, 'batch 14: a blanket "recap-heavy episodes" note copied onto 119 / 154 / 177 / 189 — 119 is recap-heavy (mixed, anchor 197 stands); the retold chapters were not itemized', 'scripts/ingest/history/apply-research-batch-14.ts'),
  recap('reborn', 154, 'abridged', null, false, 'batch 14: the same blanket note — 154 is a recap (filler); the retold chapters were not itemized', 'scripts/ingest/history/apply-research-batch-14.ts'),
  ...[78, 79, 80, 81, 82].map((ep) => recap('fist-of-the-north-star', ep, 'divergence', 'the run so far (a five-episode retrospective block between ch 109 and ch 110)', false, 'batch 17: "five-episode retrospective block" filed as divergence{none} — a retrospective is a recap', 'scripts/ingest/history/apply-research-batch-17.ts')),
  recap('mashle-magic-and-muscles', 7, 'abridged', '1-16', false, 'batch 17: "recap special: Regro and Brad read ch 1-16" — a recap, not a condensed adaptation; the canon 17-20 anchor stands', 'scripts/ingest/history/apply-research-batch-17.ts'),
  recap('project-arms', 27, 'partial', 'the series so far (the first half is an anime-original clip show)', true, 'batch 17: mixed — a clip-show half (recap) + a canon half (partial{78} stays)', 'scripts/ingest/history/apply-research-batch-17.ts'),
];

export const ENTRIES: RulingEntry[] = [
  // wave 9
  ...W9_ANCHOR_DROP,
  ...W9_CONTINUE_MOVE,
  ...W9_ANCHOR_ADD,
  ...W9_ANCHOR_NOTE_OVERRIDE,
  ...W9_CONTINUE_NOTE_OVERRIDE,
  ...W9_NOTE_OVERRIDE,
  ...W9_ANNOTATION_ADD,
  ...W9_FLAGS_DISMISS,
  ...W9_POINTERS,
  // wave 10
  ...W10_CONVENTIONS,
  ...W10_CONTINUE_OVERRIDE,
  ...W10_NOTE_FIX,
  ...W10_ANNOTATION_ADD,
  ...W10_POINTERS,
  // wave 11
  ...W11_FENCES,
  ...W11_FENCE_REPAIR,
  ...W11_CA_OVERRIDE,
  ...W11_POINTERS,
  // wave 12
  ...W12_FENCE,
  ...W12_VOLUME_SEED,
  ...W12_ANNOTATION_ADD,
  // wave 13
  ...W13_PRINTED_REBASE,
  ...W13_FENCE_REPAIR,
  ...W13_ANNOTATION_CHAPTERS_OVERRIDE,
  ...W13_ANNOTATION_ADD,
  ...W13_END_OVERRIDE,
  ...W13_START_OVERRIDE,
  ...W13_ANNOTATION_REWRITE,
  ...W13_POINTERS,
  // wave 14
  ...W14_END_OVERRIDE,
  ...W14_ANNOTATION_NOTE_SUFFIX,
  ...W14_NOTE_FIX,
  ...W14_EP59_START,
  ...W14_FENCE_REPAIR,
  ...W14_ANNOTATION_CHAPTERS_OVERRIDE,
  ...W14_MU_PIN,
  ...W14_POINTERS,
  // wave 16
  ...W16_ANNOTATION_DELETE,
  ...W16_CONTINUE_SKIP,
  ...W16_FENCE_REPAIR,
  ...W16_ROW_HOLD,
  ...W16_KIND_OVERRIDE,
  ...W16_EXTRA_ANNOTATIONS,
  ...W16_NOTE_FIX,
  ...W16_POINTERS,
  // sidecar
  ...SC_ANCHOR_DELETE,
  ...SC_FENCE_REPAIR,
  ...SC_ANCHOR_UPSERT,
  ...SC_CONTINUE_UPSERT,
  ...SC_ANNOTATION_DELETE,
  ...SC_ANNOTATION_UPSERT,
  ...SC_SCOPES,
  ...SC_POINTERS,
  // rekind-recaps
  ...RK_MOVES,
];
