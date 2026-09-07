// Applied rulings — research batch 20, waves 1-8 + the A47 backlog migration
// (2026-08-27 → 2026-09-02). One RulingEntry per curated DECISION in the nine
// one-shot scripts now under scripts/ingest/history/ (P34: reasoning
// extracted, the scripts kept as the cited record, never run again):
//   apply-wave1.ts  (2026-08-27, §12.78 — the seven G36 refusals closed)
//   apply-wave2.ts  (2026-08-27, §12.80 — the eight gap blocks + the seiya re-migration)
//   apply-wave3.ts  (2026-08-27, §12.82 — narrow follow-ups, the shugo-chara resort)
//   apply-wave4.ts  (2026-08-28, §12.84 — the standing lies wave 3 left)
//   apply-wave5.ts  (2026-08-28, §12.88 — dragon-ball-super under T30 / I40)
//   apply-wave6.ts  (2026-08-28, §12.91 — FotNS 29-56 + the L-D pins ×7)
//   apply-wave7.ts  (2026-08-28, §12.93 — L-D ×7 + the regenesis-S2 class)
//   apply-wave8.ts  (2026-09-02, §12.96 — L-D / A1 ×8 + A47 the END-side sliver)
//   a47-migrate.ts  (2026-09-02, §12.97-§12.98 — the A47 block over standing manual anchors)
// Every wave is file-driven (the verdict JSON is the evidence) with a curated
// OVERLAY (P10: the map decides). The sections below carry, per script, the
// overlay maps in script order: the anchors a script authors inline, anchor
// overrides / rejections / deletions, continue overrides / additions / moves,
// annotation overrides / drops / additions, boundary seeds, space migrations
// and re-keys, holds, flag dispositions, and one R21 "folded as delivered"
// record per verdict file so the ruled set is complete. Reasons are the
// scripts' inline why, verbatim or lightly trimmed; `ruledBy: 'Sean'` only
// where the script or its header names his ruling. Types (T6), dates / titles
// (G53), retirements (A45), zone acks (A7), totals (N35) and the N11 resort
// are MAP edits the scripts only LOG — they live in their standing maps and
// are not duplicated here (each wave's comment names them).

import type { RulingEntry } from '../types';

const W1 = 'scripts/ingest/history/apply-wave1.ts';
const W2 = 'scripts/ingest/history/apply-wave2.ts';
const W3 = 'scripts/ingest/history/apply-wave3.ts';
const W4 = 'scripts/ingest/history/apply-wave4.ts';
const W5 = 'scripts/ingest/history/apply-wave5.ts';
const W6 = 'scripts/ingest/history/apply-wave6.ts';
const W7 = 'scripts/ingest/history/apply-wave7.ts';
const W8 = 'scripts/ingest/history/apply-wave8.ts';
const A47S = 'scripts/ingest/history/a47-migrate.ts';
const OUT = 'scripts/ingest/research/batch20/out';
const VER = 'scripts/ingest/research/batch20/verify';
const REC = 'scripts/ingest/research/batch20';
const D1 = '2026-08-27'; // waves 1-3
const D2 = '2026-08-28'; // waves 4-7
const D3 = '2026-09-02'; // wave 8 + the A47 block

type By = RulingEntry['ruledBy'];
type AnchorValue = { episode: number; end_chapter: number; start_chapter: number | null; chapters_adapted: string; volume: number | null; note: string };
type AnchorOverlay = { episode: number; start_chapter?: number; end_chapter?: number; chapters_adapted?: string; confidence?: string; note?: string };
type ContinueValue = { episode: number; continue_chapter: number; kind: 'parity' | 'post_series'; note: string };
type ContinueMove = { episode: number; moved_to: number };
type AnnotationValue = { episodes: number[]; kind: string; chapters?: string | null; note: string };
type AnnotationOverlay = { episode: number; kind: string; chapters?: string | null; note?: string };
type AnnotationDrop = { episode: number; kind: string };
type Deletion = { episode: number };
type Rejection = { episode: number; proposed: string };
type NoteRepair = { episode: number; field: string; value: string };
type FlagDismissal = { flag: number; resolution: string };
type VerdictFold = { file: string; report?: string };
type BoundarySeed = { mangaId: number; rows: { volume: number; chapter_start: number; chapter_end: number }[] };
type SpaceMigration = { shift: number; from_chapter: number; marker: string };
type AnnotationShift = { episode: number; kind: string; from: string; to: string };
type Rekey = Record<number, number>;
type Hold = { held: string };
type RowlessAnchors = { episodes: string; why: string };
type A47Block = { marker: string; scope: string; continue: string; partial: string };

// helpers — one shape per repeated decision class
const fold = (seriesId: string, file: string, ruledOn: string, script: string, log: string, report?: string, extra?: string): RulingEntry<VerdictFold> => ({
  seriesId, ruleId: 'R21', value: { file: `${OUT}/${file}`, ...(report ? { report: `${VER}/${report}` } : {}) },
  reason: `verdict folded as delivered${extra ? ` — ${extra}` : ''}: anchors re-land at the MANUAL tier (P8: the mu/afg pins they replace would re-derive), continues through writeCuratedContinue (C7), annotations origin 'research'; the curated deviations are the sibling entries of this wave`,
  ruledBy: 'Sean', ruledOn, cite: [`${OUT}/${file}`, ...(report ? [`${VER}/${report}`] : []), script, log],
});
const flag = (seriesId: string, id: number, resolution: string, ruledOn: string, script: string, log: string): RulingEntry<FlagDismissal> => ({
  seriesId, ruleId: 'G3', value: { flag: id, resolution }, reason: `ingest_flags #${id} dismissed with the verdict's finding (G3: only Sean dismisses): ${resolution}`, ruledBy: 'Sean', ruledOn, cite: [script, log],
});

// ===========================================================================
// WAVE 1 (2026-08-27, §12.78) — the seven G36 refusals closed. Sean ruled
// (WAVE1-RECOVERY §THE DECISIONS + his diffs): the seven honest terminals;
// toriko 146 → 254; zatch-bell 139 → MIXED and ANCHORED 212 [212]; hellsing
// continue 12 (C1); gantz continue 91 (C5); kinnikuman 116 START 264;
// slam-dunk ep 101 → loose_parallel{197}. This wave's anchors are INLINE (the
// script is the map). MAP edits logged, not written: types (T6), dates (G53),
// the three G37 suppressions.
// ===========================================================================
const W1C = (sid: string) => [`${OUT}/${sid}.json`, `${VER}/${sid === 'gto-great-teacher-onizuka' ? 'gto' : sid}.md`, W1, '§12.78'];
const anchor1 = (seriesId: string, ruleId: string, value: AnchorValue, ruledBy: By): RulingEntry<AnchorValue> => ({ seriesId, ruleId, value, reason: value.note, ruledBy, ruledOn: D1, cite: W1C(seriesId) });

const W1_ANCHORS: RulingEntry<AnchorValue>[] = [
  anchor1('slam-dunk', 'G56', { episode: 96, end_chapter: 197, start_chapter: 197, chapters_adapted: '197', volume: 22, note: "THE HONEST TERMINAL (G56) — the last canon row: Toei's official ep-96 synopsis is ch 197 バッシュ (brand-new) beat for beat (worn shoes → Haruko → the Chieko Sports owner from ch 49 / ep 20 gifts the premium pair); AFG chart row 96 = 197; MU's TV segment 'Vol 22, Chap 197 (TV)'. The verifier read the pages: the file's first page is the ch-196 farewell tail (a sliver, A10) → START 197. Eps 97-101 are the anime-original mixed-team game (ja-WP アニメオリジナル; AFG *Filler; Toei's synopses) — filler, A1. Was afg-continua 197 [null]; manual now (P8). [high]" }, 'Sean'),
  anchor1('hellsing', 'A4', { episode: 10, end_chapter: 2, start_chapter: 2, chapters_adapted: '2 (Order 02 relocated: the succession flashback inside anime-original surgery framing)', volume: 1, note: "The LAST canon/mixed row (A1 terminal) — Integra's flashback is Order 02 'Master of Monster' (title = title; fandom chapter reverse map; en-WP ep-10 summary), relocated far behind the run's FRONTIER ep 7 → 12 (A4: coverage is the max-chapter anchor, never the run-end row — the G56 lib now reads it that way, hellsing the witness). Confirms stored. [high]" }, 'Sean'),
  anchor1('gantz', 'G56', { episode: 21, end_chapter: 90, start_chapter: 80, chapters_adapted: '80 (all but its opening page or two — ch 80 split with ep 20) - 90, heavily compressed: eleven chapters in one episode; ch 90 is carried to its final page (Kurono alone in the Gantz room, 8 pts / 46 total, then leaving)', volume: 8, note: "THE HONEST TERMINAL (G56): gantz.fandom's ep-21 infobox 'Adopted Chapter 080 – Chapter 090' + AFG's 80…90 list + the chapter pages 80-90 read against the episode summary; ch 91 (the news report, school, the original Kishimoto) is in no episode. START 80 under A10 (the verifier: most of the chapter, not a tail). Eps 22-26 = the anime-original 玄野星人篇 (ja-WP アニメ版オリジナル; fandom arc 'chapters: None'; AFL/AFG filler) — A1. [high]" }, 'Sean'),
  anchor1('gto-great-teacher-onizuka', 'A4', { episode: 38, end_chapter: 98, start_chapter: 97, chapters_adapted: '97-98', volume: 13, note: "CONFIRMS STORED: Lesson38 突撃! 宝探しでGo! = Lessons 97-98 (fandom per-episode field; title match on 98 'Making It A Go with the Treasure!'; en-WP vol 13 = 98-106). One chapter-level witness + the title match (verifier). [high]" }, 'session'),
  anchor1('gto-great-teacher-onizuka', 'A4', { episode: 39, end_chapter: 102, start_chapter: 99, chapters_adapted: '99-102', volume: 13, note: 'CONFIRMS STORED: Lesson39 二人の冒険!! 秘密の洞窟 = Lessons 99-102 (fandom field), ending mid-102 (the stored C1 straddle to ep 40). [high]' }, 'session'),
  anchor1('gto-great-teacher-onizuka', 'A4', { episode: 40, end_chapter: 102, start_chapter: 102, chapters_adapted: '102 + 107 (graft)', volume: 13, note: "CONFIRMS STORED: fandom field '102, 107' — an Uchiyamada strand from vol-14 Lesson 107 transplanted into the Okinawa plot (a fragment; END stays 102, A4/A12). [high]" }, 'session'),
  anchor1('gto-great-teacher-onizuka', 'G56', { episode: 41, end_chapter: 105, start_chapter: 102, chapters_adapted: '102-105', volume: 13, note: "THE HONEST TERMINAL (G56), CONFIRMS STORED: Lesson41 青春少女!! 初めての告白 = Lessons 102-105 (fandom field; the Anko Uehara page 'Episodes 37 through 41 (chapters 96 through 105)'; WDTALO 'start the manga at Chapter 106'); Kodansha Comic DAYS: Lesson105 LOVE LOVE LOVE, Lesson106 グレートティーチャー冬月‥‥!? (the vol-13 closer, never animated). MU's 106 is the volume boundary (G37). Eps 42-43 adapt nothing (batch 18, re-verified). [high]" }, 'Sean'),
  anchor1('zatch-bell', 'A8', { episode: 136, end_chapter: 207, start_chapter: 206, chapters_adapted: '206, 207 (207 partial — its opening pages only: the return-device room and the 28-character keypad; finished at ep 137)', volume: 22, note: "REPAIR END 206 → 207: ep 136's closing scene animates ch 207 pp. 1-2 + the top of p. 3 (konjikinogash's last ep-136 paragraph; the MangaDex scan; ep 137 restarts at the p.-3 line). One wiki + the scan → medium. [medium]" }, 'session'),
  anchor1('zatch-bell', 'A4', { episode: 137, end_chapter: 208, start_chapter: 207, chapters_adapted: '207-208 (207 opens at ep 136 and is completed here; 208 ends on the double-page spread of Faudo rising)', volume: 22, note: "CONFIRMS STORED: Kiyomaro masters the device's writing and sets the 90-minute timer (207), Riou's demons destroy Faudo's seal (208); Toei's synopsis ends on the key destroyed. [high]" }, 'session'),
  anchor1('zatch-bell', 'A4', { episode: 138, end_chapter: 211, start_chapter: 209, chapters_adapted: '209-211', volume: 22, note: "The last row every source calls manga canon — ends on ch 211's final page (Riou: Faudo's target is Japan, 'about an hour'; the anime says six hours — verifier: the scan p. 17 is the exact closing beat). Ch 212 is NOT entered — no C1 straddle. Confirms stored. [high]" }, 'session'),
  anchor1('zatch-bell', 'T28', { episode: 139, end_chapter: 212, start_chapter: 212, chapters_adapted: "212 (pp. 2-10 of 18 — first-time pages: Riou's order, Kiyomaro's re-entry resolve, the chase, the family/classmates montage, Riou/Zaruchim, Dikaporuku, the gulp of water; the schism is at p. 10 — the scanlators printed it on the page)", volume: 22, note: "Sean 2026-08-27 (T28 materiality; Cursor concurring): ep 139's first act is ch 212 pp. 2-10 of 18 — about a third of the episode, first-time pages (not a rewind, not a sliver) — before the anime leaves the manga for its ending; a substantial share of canon in an episode that then diverges = MIXED, and the pages carry a position: 212 [212]. NOT the Claymore-24 shape (a few pages of Scene 60, ruled filler): degree decides. THE HONEST TERMINAL moves here from ep 138 — MU's 'Chap 212' is now REACHED (G56 redundant). Resume IN 212 (C1: pp. 11-18 never animated). konjikinogash 'Chapter 212 (Partially)'; Toei's ep-139 synopsis; MangaDex ch 212 read page by page (verifier). [high]" }, 'Sean'),
  anchor1('kinnikuman', 'A10', { episode: 116, end_chapter: 265, start_chapter: 264, chapters_adapted: '264-265', volume: 23, note: "116A 見た!キン肉マンの素顔の巻 = ch 264 覆面狩り予告達成!?の巻 (the Muscle Brothers swap places and masks under the ring; Toei's synopsis); 116B ネプチューンキング出現の巻 = ch 265 完璧の秘密!!の巻. START 264 per the verifier: ja-WP ネプチューンマン cites the apple-peel imagery to 第23巻 9頁 = ch 264, so the peeling that opens ep 116 is ch 264 content and ch 263's share is the stored 115B's (A10). Interior split ±1 → medium. [medium]" }, 'Sean'),
  anchor1('kinnikuman', 'A4', { episode: 117, end_chapter: 267, start_chapter: 266, chapters_adapted: '266-267', volume: 23, note: "117A くし刺し!テリーマンの巻 = ch 266 孤独の戦士!!の巻 (fandom arc chain + Toei: Terryman knocked onto the spikes); 117B the 1000-disciple plan. The verifier: no source places 267 in ep 117 (ja-WP cites ch 266 as 第23巻 47-65頁) — the 266/267 line is ±1 like the others; END 267 medium. [medium]" }, 'session'),
  anchor1('kinnikuman', 'A4', { episode: 118, end_chapter: 270, start_chapter: 268, chapters_adapted: "268-270 (270 straddled with ep 119A, which carries the keyhole's secret)", volume: 23, note: "118A 火事場の段違い平行棒の巻 + 118B アポロンウィンドウの謎の巻 = chs 268 完璧なる友情!! / 269 地獄の三重刑!! / 270 鍵穴の秘密!! (Toei: Terryman revived by the Thunder Sabre; the Justice Chojin's spirits shake Neptuneman; the Apollon Window marks surface). ±1 at 269/270 → medium. [medium]" }, 'session'),
  anchor1('kinnikuman', 'G56', { episode: 119, end_chapter: 273, start_chapter: 270, chapters_adapted: '270 (finished from ep 118B), 271-273', volume: 23, note: "THE HONEST TERMINAL (G56) — the Dream Chojin Tag arc's end: ja-WP 夢の超人タッグ編 = 第209話-第273話 with the anime-original header before 第120話; fandom 119B 光り輝くトロフィー!の巻 ↔ ch 273 栄光のトロフィー!!の巻 (arc infobox 209-273 / eps 87-119); MU's own segment 'Vol 23, Chap 273 (1983 EP 119)'. Vol 23 = 264-273 (fandom + Shueisha). Was a null-START manual row; rebuilt. [high]" }, 'Sean'),
  anchor1('toriko', 'A4', { episode: 141, end_chapter: 236, start_chapter: 233, chapters_adapted: '233-236', volume: 27, note: "RE-AFFIRMED: Komatsu's cry reviving Toriko (233 'Call!!'), Aimaru's Ultimate Routine (234-235), Starjun drawing the Burner Knife (236) — Toei's synopsis in order; fandom field. [high]" }, 'session'),
  anchor1('toriko', 'A4', { episode: 142, end_chapter: 242, start_chapter: 237, chapters_adapted: '237-242', volume: 27, note: "RE-AFFIRMED: Toriko vs Starjun's climax (237-239), Joie's entrance and the Nitro (241), Setsuno recognising the Cinderella knife and Jiro arriving (242) — Toei's synopsis ends on Jiro's arrival. [high]" }, 'session'),
  anchor1('toriko', 'A4', { episode: 143, end_chapter: 247, start_chapter: 243, chapters_adapted: '243-244, 246-247', volume: 28, note: "243 (Jiro's finger-flick, Grand Knocking, Joie unmasked as Froese's double) and 244 (the Rising Wolf Guinness Punch erased by Satan Mince) visible; the 246-247 tail from the fandom field, backed by the episode page's content rosters (the 0th Biotope montage = 246; Octopard / Ripper the Fox / Goron Beast = 247's list — verifier). [medium]" }, 'session'),
  anchor1('toriko', 'A4', { episode: 144, end_chapter: 253, start_chapter: 248, chapters_adapted: '248-253 (248-250 heavily compressed; the Hungry Space wound is replayed after the 251-253 flashback)', volume: 28, note: "The canon spine is the Acacia/Froese/Midora flashback = Gourmet 251-253 exactly (Toei's ep-144 synopsis; ch 253 'The Tiger's Tears!!' = Froese's death); START 248 (Hungry Tongue 248, Single Chopstick 249, Hungry Space 249-250 all in this episode — 251 is NOT available as a tighter START, verifier). Mixed under T28 (the Toriko/Starjun-vs-Joie half is anime-original). [medium]" }, 'session'),
  anchor1('toriko', 'G56', { episode: 146, end_chapter: 254, start_chapter: 254, chapters_adapted: '254 (abridged; the Ichiryu-Midora conclusion and the Meteor Spice launch)', volume: 29, note: "THE HONEST TERMINAL (G56) — REPAIR 253 → 254 (Sean 2026-08-27, against the 2026-08-24 stored value): Toei's official ep-146 synopsis para 2 is Gourmet 254 'A Sad End!!' beat for beat (the secret technique failing, both brothers' tears, the final blow, Meteor Spice fired at the Human World); ch 253 is the Froese flashback that Toei's ep-144 synopsis carries. The fandom's '253' on 145/146 sits on empty stub pages (a plateaued header); AFG restates it. Vol 29 = 254-263. Medium: a content derivation against two secondary sources printing 253. [medium]" }, 'Sean'),
];

const W1_DELETIONS: RulingEntry<Deletion>[] = [
  { seriesId: 'toriko', ruleId: 'A1', value: { episode: 145 }, reason: "the stored 253 [253] anchor was the fandom field's plateau — no page of the manga plays (A1/A44); the row is filler by T6. Deleted (the honest terminal is ep 146 → 254)", ruledBy: 'session', ruledOn: D1, cite: W1C('toriko') },
];

const cont1 = (seriesId: string, ruleId: string, value: ContinueValue, ruledBy: By): RulingEntry<ContinueValue> => ({ seriesId, ruleId, value, reason: value.note, ruledBy, ruledOn: D1, cite: W1C(seriesId) });
const W1_CONTINUES: RulingEntry<ContinueValue>[] = [
  cont1('slam-dunk', 'C5', { episode: 96, continue_chapter: 198, kind: 'post_series', note: "C5 post-series: coverage is ch 197 (ep 96), so resume at ch 198 '新幹線' (vol 23 = 198-206). Chs 198-276 — vols 23-31, the whole Nationals arc — are never adapted by this TV series; the 2022 film THE FIRST SLAM DUNK (a separate entry) covers ch 223-276, so 198-222 has no animation anywhere. Ep 101's coda is an original send-off echoing ch 197's last splash page; ch 198 opens after the team has left." }, 'session'),
  cont1('hellsing', 'C1', { episode: 10, continue_chapter: 12, kind: 'post_series', note: "C1 in the straddled chapter (Sean 2026-08-27): ep 7 animates only the Imperial War Museum standoff of Order 12 and swaps the rest — Seras' tour-guide defusal, Anderson's exit, the café where Maxwell briefs Integra on MILLENNIUM, the Major/Doctor coda — for an anime-original duel; Millennium never enters the TV series. Resume at Order 12 from the standoff. Orders 13-89 never adapted (the Incognito ending of eps 8-13 is anime-original). Replaces the stored strict-C5 13." }, 'Sean'),
  cont1('gantz', 'C5', { episode: 21, continue_chapter: 91, kind: 'post_series', note: "C5 post-series (Sean 2026-08-27): ep 21 carries ch 90 to its last page (Kurono alone in the Gantz room, 8 pts / 46 total, the demand to Gantz, leaving) — no straddle, so resume at ch 91 'Sexual Harassment?' (vol 8). Chs 91-383 (the Shorty Alien arc onward) are never animated; eps 22-26 are the anime-original 玄野星人篇. The content farms' 'start at 90' is the re-read convention, not coverage." }, 'Sean'),
  cont1('gto-great-teacher-onizuka', 'C5', { episode: 41, continue_chapter: 106, kind: 'post_series', note: "C5 (coverage 105 + 1), CONFIRMS STORED: resume at Lesson 106 グレートティーチャー冬月‥‥!? — the closing chapter of vol 13, the one Okinawa-arc chapter the anime never animated. Lessons 106-200 (95 of the 200 mainline Lessons) were never adapted; eps 42-43 are the anime-original ending. 107 is content-farm rounding." }, 'session'),
  cont1('zatch-bell', 'C1', { episode: 136, continue_chapter: 207, kind: 'parity', note: 'C1: ep 136 stops two pages into ch 207 and ep 137 finishes it — resume IN 207.' }, 'session'),
  cont1('zatch-bell', 'C2', { episode: 138, continue_chapter: 212, kind: 'parity', note: 'C2 parity: ep 139 opens on ch 212 (its pp. 2-10 air there first-time — Sean 2026-08-27, mixed + anchored); resume at 212.' }, 'Sean'),
  cont1('zatch-bell', 'C5', { episode: 139, continue_chapter: 212, kind: 'post_series', note: "C1 / C5 post-series (Sean 2026-08-27): ep 139 animates ch 212 pp. 2-10 and then the anime leaves the manga for good (eps 140-150 are the studio ending). Resume IN Level 212 'The Worst-case Scenario' from p. 10 (Riou's Fanon Doron): ch 212's second half and chs 213-323 — the real Faudo conclusion, Zeon/Dufort, Clear Note, the ending — are never animated. The stored batch-17 note ('the anime stops adapting at ch 211') overstated the cut." }, 'Sean'),
  cont1('kinnikuman', 'C1', { episode: 118, continue_chapter: 270, kind: 'parity', note: "C1 straddle: ep 118B stops as the Apollon Window marks surface on the Hell Missionaries' chests; ep 119A carries the rest of ch 270 (the keyhole's secret). Resume inside 270; ep 119 starts there." }, 'session'),
  cont1('kinnikuman', 'C5', { episode: 119, continue_chapter: 274, kind: 'post_series', note: "C5: the anime's furthest first-time coverage is ch 273 (栄光のトロフィー!!の巻, vol 23, the Dream Chojin Tag arc's last chapter). Start reading at ch 274: chs 274-387 (キン肉星王位争奪編 / Scramble for the Throne, vols 24-36) are NEVER adapted by this series — the 1991 anime (not a catalog entry) starts there, which is MU's own next segment. Eps 120-137 are the two anime-original arcs (filler, T6). Matches series.continue_from_chapter 274." }, 'session'),
  cont1('toriko', 'C2', { episode: 144, continue_chapter: 254, kind: 'parity', note: "C2 parity: after ep 144 the reader has seen through Gourmet 253 (Froese's death); ep 145 carries no manga position (A44 — the Kings' anime-only attacks) and the next manga on screen is ch 254 in ep 146 — resume at 254." }, 'session'),
  cont1('toriko', 'C5', { episode: 146, continue_chapter: 255, kind: 'post_series', note: "C5 (coverage 254 + 1): ep 146 is the last episode with manga in it and ends on ch 254's final beat (Meteor Spice fired) — read on from Gourmet 255 'Awakening!!'. 255-396 are never animated (Midora sparing Ichiryu, Ichiryu's death, the food collapse, and the entire Gourmet World half from ch 264); ch 245 was skipped outright; ep 147's studio ending restages 255/257/264 beats without their pages." }, 'session'),
];

const ann1 = (seriesId: string, ruleId: string, value: AnnotationValue, ruledBy: By): RulingEntry<AnnotationValue> => ({ seriesId, ruleId, value, reason: value.note, ruledBy, ruledOn: D1, cite: W1C(seriesId) });
const W1_ANNOTATIONS: RulingEntry<AnnotationValue>[] = [
  ann1('slam-dunk', 'T28', { episodes: [101], kind: 'loose_parallel', chapters: '197 (closing splash page)', note: "T28 tie on a filler row (verifier-corrected): ep 101's closing tag — Shohoku boarding the shinkansen for Hiroshima WITH Kainan (Bandai Channel: 海南大付属高校と共に…広島へと乗りこむ) — is an original send-off echoing ch 197's last page (a single 'Sakuragi invades the nationals' splash, '3 days later'); ch 198 '新幹線' opens in the empty Shohoku gym after the team has left and has no station, no boarding, no Kainan. Position-less (A1/A44); the continue 198 stands." }, 'Sean'),
  ann1('hellsing', 'A12', { episodes: [10], kind: 'graft', chapters: '19 (prologue)', note: "Arthur Hellsing teaching a young Integra the nature of vampires — the 1-2 page prologue of Order 19 'Elevator Action (6)' — is transplanted into ep 10's flashback (the anime adds Integra's mother's photo on the desk). Position-less (A12/A4): fandom Order 19 synopsis + 'Integra's Mother' page (medium — content-level corroboration, one wiki family)." }, 'session'),
  ann1('hellsing', 'A43', { episodes: [11], kind: 'divergence', chapters: '13-19', note: "Extends the stored eps 8,13 divergence fact to the rows it did not cover: eps 11-13 are wholly the anime-original Incognito ending (the Round Table / the Queen, the Tower of London, the SAS converted to FREAKs, Incognito fused with Set, Alucard beheaded and restored) — fandom mangavol/mangachap = N/A, AFL + AFG filler; the manga's Orders 13-19 (the Rio arc, Millennium) never enter the TV series." }, 'session'),
  ann1('hellsing', 'A43', { episodes: [12], kind: 'divergence', chapters: '13-19', note: "Extends the stored eps 8,13 divergence fact: ep 12 is wholly the anime-original Incognito ending (fandom mangavol/mangachap = N/A; AFL + AFG filler); the manga's Orders 13-19 never enter the TV series." }, 'session'),
  ann1('gantz', 'A43', { episodes: [21], kind: 'abridged', chapters: '80-90', note: "Eleven chapters compressed into one episode (the deaths of Tomashiro/Yuta, Sakuraoka, Togo and Kato in ~22 minutes). Refines the stored wording: the MISSION's ending is faithful — Kato kills the Kannon and is run through by its tail (chs 88-89), Kurono returns alone (90); the ALTERATION begins after ch 90, with the anime-original 玄野星人篇." }, 'session'),
  ann1('gantz', 'A43', { episodes: [26], kind: 'divergence', chapters: 'n/a', note: "The finale's train-station scene is an anime-original re-staging (verifier: Kurono 'seemingly sent back in time', dead friends cheering, the 'Bang!') in the ch 1-2 location already animated at ep 1 — never a position; ep 26 is filler (A1) with the whole 玄野星人篇 (eps 22-26: ja-WP アニメ版オリジナル, fandom arc 'chapters: None')." }, 'session'),
  ann1('gantz', 'A43', { episodes: [22, 23, 24, 25], kind: 'divergence', chapters: 'n/a', note: "The anime-original 玄野星人篇 / Kill Kei Kurono Mission (ja-WP: アニメ版オリジナル; fandom arc page: 'chapters: None'): seven hunters, six of them wiki 'Filler characters', with Gantz targeting Kurono himself — never in the manga. Filler (A1); no page of chs 91+ plays." }, 'session'),
  ann1('gto-great-teacher-onizuka', 'A12', { episodes: [40], kind: 'graft', chapters: '102 + 107', note: "CONFIRMS STORED: the fandom's per-episode field is explicit ('102, 107') — an Uchiyamada strand from vol-14 Lesson 107 'White Collar Blues' transplanted into the Okinawa plot. Fragment only; position stays at 102/105, the post-series continue 106." }, 'session'),
  ann1('zatch-bell', 'A43', { episodes: [136], kind: 'partial', chapters: '207', note: "Ch 207 'Offense and Defense' is split across the episode boundary: ep 136's closing scene animates its opening pages (the return-device room, the 28-character keypad), ep 137 carries the rest (Kiyomaro mastering the writing, the 90-minute timer). Listed in both rows' chapters_adapted." }, 'session'),
  ann1('zatch-bell', 'A43', { episodes: [137], kind: 'partial', chapters: '207', note: "Ch 207 'Offense and Defense' is split: ep 136's closing scene animates pp. 1-2, ep 137 carries the rest. Listed in both rows' chapters_adapted." }, 'session'),
  ann1('zatch-bell', 'T28', { episodes: [139], kind: 'partial', chapters: '212 (pp. 2-10 of 18)', note: "Sean 2026-08-27 (mixed + anchored): ep 139's first act restages ch 212 pp. 2-10 for the first time — Riou's 'destroy Japan' order, Kiyomaro's re-entry resolve, the chase, the family/classmates montage, Riou/Zaruchim's unease, Dikaporuku, the entry and the gulp of seawater — and leaves the manga at p. 10 (Riou's Fanon Doron; the scanlators printed 'BETWEEN THESE TWO PANELS IS THE MAIN SCHISM' on the page). pp. 11-18 (the cough, Riou vs Kiyomaro, Zeon/Dufort outside) are never animated; eps 140-150 are the studio ending." }, 'Sean'),
  ann1('zatch-bell', 'A43', { episodes: [139], kind: 'divergence', chapters: '212-323', note: "REWRITTEN (batch 20): the anime's last full adaptation is ch 211 (ep 138); ep 139 animates ch 212 pp. 2-10 (the re-entry into Faudo) before diverging permanently at p. 10; ch 212's second half and chs 213-323 are never animated — the studio ending (eps 140-150) is Toei's own. Verified against the chapter itself (MangaDex), konjikinogash's per-episode field ('Chapter 212 (Partially)') and Toei's ep-139 synopsis." }, 'session'),
  ann1('zatch-bell', 'A43', { episodes: [150], kind: 'divergence', chapters: '212-323', note: "REWRITTEN (batch 20): the anime's last full adaptation is ch 211 (ep 138); ep 139 animates ch 212 pp. 2-10 before diverging permanently; ch 212's second half and chs 213-323 are never animated — eps 140-150 are Toei's own ending." }, 'session'),
  ann1('kinnikuman', 'A43', { episodes: [116], kind: 'divergence', chapters: '264-273', note: "Dream-Tag PART 2 (eps 107-119) re-stages the manga's final match inside an anime-original frame: the competitors and crowd warp from Tournament Mountain to a Pyramid Ring that appears in Hokkaido, which then flies into space (kinnikuman.fandom/ja verbatim; ja-WP's 107B title and セメントス / 天の女王 entries); MU's own note reads 'Some differences'. The chapters underneath are adapted in order." }, 'session'),
  ann1('kinnikuman', 'A43', { episodes: [117, 118, 119], kind: 'divergence', chapters: '264-273', note: "Dream-Tag PART 2 (eps 107-119) re-stages the manga's final match inside an anime-original frame (the Pyramid Ring in Hokkaido that flies into space — kinnikuman.fandom/ja; ja-WP セメントス / 天の女王); the chapters underneath are adapted in order." }, 'session'),
  ann1('kinnikuman', 'A43', { episodes: [118], kind: 'partial', chapters: '270', note: "Ch 270 鍵穴の秘密!!の巻 straddles: ep 118B shows the Apollon Window surfacing on the Hell Missionaries' chests, ep 119A gives its secret (the 前方後円墳 keyhole that shuts off Magnet Power). Listed in both rows' chapters_adapted; ep 118's continue sits inside 270 (C1)." }, 'session'),
  ann1('kinnikuman', 'A43', { episodes: [119], kind: 'partial', chapters: '270', note: "Ch 270 鍵穴の秘密!!の巻 straddles 118/119: ep 119A gives the keyhole's secret. Listed in both rows' chapters_adapted." }, 'session'),
  ann1('toriko', 'A43', { episodes: [144], kind: 'abridged', chapters: '248-250', note: "The present-day Ichiryu vs Midora duel (Hungry Tongue, Minority World, the Emperor's Ring) is compressed almost out of the episode in favour of the 251-253 flashback (toriko.fandom's Ichiryu page: the anime's version of the fight 'were significantly shortened')." }, 'session'),
  ann1('toriko', 'A43', { episodes: [146], kind: 'divergence', chapters: '254', note: "REPLACES the stored eps 142,146 divergence {243-253} on this row (146 now ends at 254): Gourmet 254 is adapted with its outcome changed — in the anime Ichiryu's secret technique lands (dodged in the manga) and Midora does not kill him (toriko.fandom's Ichiryu page: 'the most important change… Ichiryu still lives'); ep 147's studio ending follows from that." }, 'session'),
  ann1('toriko', 'T28', { episodes: [147], kind: 'loose_parallel', chapters: '255, 257, 264 (and the skipped 245)', note: "T28 tie on a filler row: the studio ending restages three manga beats without adapting their pages — Midora sparing Ichiryu (255), the Meteor Spice fallout and the IGO's emergency food relief (255/257), Toriko and Komatsu setting out for the Gourmet World (264 opens the Billion Bird arc). Ch 245 (Starjun's Bloom, Meteor Spice with Toriko collapsed) was never animated at all." }, 'session'),
];

// total_chapters NOT written by the script (series.total_chapters is re-derived
// from AniList by chain.ts#aggregate — a bare update reverts); held for the
// chapter-count ruling map that later landed as CHAPTER_SPACE_OVERRIDES (N35).
const W1_HOLDS: RulingEntry<Hold>[] = [
  { seriesId: 'gto-great-teacher-onizuka', ruleId: 'N35', value: { held: 'total_chapters 208 → 200' }, reason: "gto's total_chapters 208 → 200 is NOT written here: series.total_chapters is re-derived from AniList by chain.ts#aggregate (a bare update reverts) — a chapter-count ruling map is the queued /add-rule. The reading edition is Fujisawa's Lesson numbering, 1-200 mainline + 7 numberless Scenes + the vol-25 supplement = AniList's 208 unit count", ruledBy: 'Sean', ruledOn: D1, cite: W1C('gto-great-teacher-onizuka'), retiresWhen: 'RETIRED 2026-09-07 (deep) — LANDED as the N35 entry in chapter-spaces.ts (gto-great-teacher-onizuka {chapters: 200}); assert-overrides asserts it over the series row' },
  { seriesId: 'zatch-bell', ruleId: 'N35', value: { held: 'total_chapters 324 → 323' }, reason: "zatch-bell's total_chapters 324 → 323 is NOT written here for the same reason (chain.ts#aggregate re-derives); queued for the chapter-count ruling map", ruledBy: 'Sean', ruledOn: D1, cite: W1C('zatch-bell'), retiresWhen: 'landed as the N35 chapter-space ruling (chapter-spaces.ts) — check the standing map' },
];

const W1_FLAGS: RulingEntry<FlagDismissal>[] = [
  flag('gto-great-teacher-onizuka', 691, "RESOLVED (batch 20 wave 1, verified R24): MU's latest_chapter 13 is not an edition — it is the chapter of MU's latest-DATED release records (AnimeRev ch 11-13, Aug 2012); the reading edition is Fujisawa's Lesson numbering, 1-200 mainline + 7 numberless Scenes + the vol-25 supplement = AniList's 208 unit count. total_chapters as a NUMBER ceiling (200) is a queued chapter-count ruling.", D1, W1, '§12.78'),
  flag('toriko', 695, "RESOLVED (batch 20 wave 1, verified R24): ONE reading edition (Gourmet 1-396, 43 vols) shared by AniList, toriko.fandom, MU ('43 Volumes (Complete)', coverage in the same space) and our anchors; MU's latest_chapter 2 is the chapter of its latest-DATED release rows (a colored re-release of ch 1-2), not an edition and not a purge (595 release rows exist).", D1, W1, '§12.78'),
  flag('gantz', 932, "RESOLVED (batch 20 wave 1, verified R24): ep 21's exact END is 90 [80] (gantz.fandom infobox + AFG + the chapter pages read against the episode; ch 91 is in no episode); continue 91 (C5). The batch-17 notes are answered.", D1, W1, '§12.78'),
];

// ===========================================================================
// WAVE 2 (2026-08-27, §12.80) — the eight gap blocks, FILE-DRIVEN with the
// curated overlay. Sean ruled (WAVE2-RECOVERY §THE DECISIONS + his three
// fork closures, Cursor concurring). STEP 0 is the saint-seiya N22
// re-migration. MAP edits logged, not written: types (T6), the hxh dates
// (G53), the yyh title.
// ===========================================================================
const SS = 'saint-seiya-knights-of-the-zodiac';
const W2C = (sid: string, ...more: string[]) => [`${OUT}/${sid}.json`, `${VER}/${sid}.md`, ...more, W2, '§12.80'];

const W2_FOLDS: RulingEntry<VerdictFold>[] = ['hunter-x-hunter', SS, 'yu-yu-hakusho-ghostfiles', 'bleach', 'eyeshield-21', 'kingdom', 'd-gray-man', 'naruto-shippuden']
  .map((sid) => fold(sid, `${sid}.json`, D1, W2, '§12.80', `${sid}.md`, sid === SS ? 'the wave-2 rows 100-113 are delivered in OUR space and stamped with the migration marker, not shifted' : undefined));

// STEP 0 — the saint-seiya marker-keyed re-migration (N22): every anchor row
// lacking the "space migration −1" marker shifts chapter / start / continue
// values ≥ 30 by −1 and is stamped; the batch-17 rows 43-72 were applied in
// Wikipedia's phantom +1 space and the one-shot migration, guarded on v8's
// end, never saw them. The `anchor_volume_mismatch` census class (P5) is the
// outcome proof: seiya 7 → 0.
const W2_MIGRATION: RulingEntry<SpaceMigration | AnnotationShift>[] = [
  { seriesId: SS, ruleId: 'N22', value: { shift: -1, from_chapter: 30, marker: 'space migration −1 (phantom ch 30 removed, Sean 2026-08-25)' }, reason: "MARKER-KEYED re-migration: every saint-seiya anchor row that lacks the marker shifts its chapter / start / continue values ≥ 30 by −1 and is stamped (the batch-17 rows 43-72 were applied in Wikipedia's phantom +1 space; the one-shot migration, guarded on v8's end, never saw them); rows below 30 are stamped only. Outcome proof (P5): anchor_volume_mismatch seiya 7 → 0", ruledBy: 'Sean', ruledOn: D1, cite: W2C(SS) },
  { seriesId: SS, ruleId: 'N22', value: { episode: 43, kind: 'abridged', from: '30', to: '29' }, reason: 'batch-17 annotation in the +1 space shifted with the rows (marker stamped)', ruledBy: 'Sean', ruledOn: D1, cite: W2C(SS) },
  { seriesId: SS, ruleId: 'N22', value: { episode: 47, kind: 'divergence', from: '32', to: '31' }, reason: 'batch-17 annotation in the +1 space shifted with the rows (marker stamped)', ruledBy: 'Sean', ruledOn: D1, cite: W2C(SS) },
  { seriesId: SS, ruleId: 'N22', value: { episode: 64, kind: 'partial', from: '39', to: '38' }, reason: 'batch-17 annotation in the +1 space shifted with the rows (marker stamped)', ruledBy: 'Sean', ruledOn: D1, cite: W2C(SS) },
];

const W2_ANCHOR_OVERRIDES: RulingEntry<AnchorOverlay>[] = [
  { seriesId: 'hunter-x-hunter', ruleId: 'A10', value: { episode: 80, start_chapter: 143, note: "START 143 (the verifier, A10): ep 80 opens on ch 142's closing pages (Jispa / Little Flower / the explosion) — by the verdict's own estimate ≤ 5 pages of a 15-page chapter whose Bomber reveal ep 79 already carried, so the remnant is a sliver and START is the first full chapter, 143. END 148 on hunterpedia's forward `Adapted` field + the chapter pages' reverse `Anime` field + en-WP's OVA synopsis. [high]" }, reason: "the verifier's correction: the ch-142 remnant is a sliver (≤ 5 pages, its reveal already carried by ep 79), so START is the first full chapter, 143", ruledBy: 'session', ruledOn: D1, cite: W2C('hunter-x-hunter') },
  { seriesId: 'bleach', ruleId: 'A4', value: { episode: 153, end_chapter: 263, note: "END 263 (the verifier): ch 263 pp. 1-2 — the Kaien unmasking, the episode's closing scene — are contiguous FIRST-TIME mainline pages, not the ep-124 flash-forward shape; bleach's own stored line moves END on a trailing partial (ep 112 → 190). bleach.fandom's page-level field '254 (p.10-19), 255, 256 (p.1-4), 262 (p.15-19), 263 (p.1-2)' + AFG's chapter set; the 256 p.5 → 262 p.15 jump is the un-cross-cut (rearranged). Medium: the two-page share. [medium]" }, reason: "the verifier's correction: ch 263 pp. 1-2 are contiguous first-time mainline pages (the Kaien unmasking), so END moves to 263 as the stored line already does on a trailing partial (ep 112 → 190)", ruledBy: 'session', ruledOn: D1, cite: W2C('bleach') },
  { seriesId: 'kingdom', ruleId: 'R3', value: { episode: 78, note: "ep 78 = ch 261 (p.15-17), 262-264: Duke Hyou's charge opens the Coalition arc (kingdom.fandom Episode 78 — its 'adapted from' field carries Episode 129's line verbatim, a copy-paste defect; the broadcast record shows the charge); pcafe's chapter→episode index; the licensor synopsis. The cold open is a flash-forward to the Kankoku Pass charge (ch 271-272), not a position. [high]" }, reason: 'note overlay only (values as delivered): the ep-78 cold-open wording — the flash-forward to the Kankoku Pass charge is not a position — and the fandom copy-paste defect named', ruledBy: 'session', ruledOn: D1, cite: W2C('kingdom') },
  { seriesId: 'kingdom', ruleId: 'R3', value: { episode: 81, note: "ep 81 = ch 272 (p.16-18), 273-275, 276 (to the tower reaching the wall): kingdom.fandom's field DROPS ch 274 — restored on pcafe (274 → S3 ep 4) + the kingdom-anime.com synopsis (Kei Sha's trap) + a timestamped broadcast-reaction archive that ends the episode inside ch 276, not 275. [high]" }, reason: "note overlay only: one of kingdom's two false pcafe citation strings replaced with the sources that actually carry the claim", ruledBy: 'session', ruledOn: D1, cite: W2C('kingdom') },
  { seriesId: 'kingdom', ruleId: 'R3', value: { episode: 82, note: "ep 82 = ch 276 (tail, re-entered after the 13-month COVID hiatus), 277-280: pcafe (280 → S3 ep 5) + the licensor synopsis + ja-WP's 第3シリーズ table (the 2020 → 2021 date jump at this row is the real hiatus). Medium: the 276 re-entry split. [medium]" }, reason: "note overlay only: the second false pcafe citation string replaced; the 276 re-entry split named", ruledBy: 'session', ruledOn: D1, cite: W2C('kingdom') },
];

// ANCHOR_REJECT — EMPTY this wave: no delivered anchor was rejected.

const W2_REPAIR_REJECTS: RulingEntry<Rejection>[] = [
  { seriesId: 'eyeshield-21', ruleId: 'P10', value: { episode: 21, proposed: 'fence repair 21 → 48 (both fields)' }, reason: "REFUTED on the pages (R24): ch 49 pp 1-12 ARE the Taiyo draw — AFG's 47-49 stands; the verdict's repair is reported, not applied", ruledBy: 'Sean', ruledOn: D1, cite: W2C('eyeshield-21') },
];

const W2_CONTINUE_OVERRIDES: RulingEntry<ContinueValue>[] = [
  { seriesId: 'd-gray-man', ruleId: 'C2', value: { episode: 5, continue_chapter: 2, kind: 'parity', note: "C2 parity (the verifier's correction; the bobobo 3 → 3 [2] precedent): the anime plays chs 2-4 NEXT, in eps 6-7 (the Introduction arc's second half moved behind the Mater arc), so the reader resumes at ch 2 — not at 17. Chs 5-16 are already read; ep 8 restarts at 17 (C3: skip 5-16 on arrival)." }, reason: "the verifier's correction of the delivered 17: C2 is the NEXT canon row's START (the bobobo precedent) — the anime plays chs 2-4 next, so resume at 2", ruledBy: 'Sean', ruledOn: D1, cite: W2C('d-gray-man') },
  { seriesId: 'd-gray-man', ruleId: 'C2', value: { episode: 6, continue_chapter: 3, kind: 'parity', note: "C2 parity (the verifier's correction): ep 6 ends inside ch 3 (p. 14) and ep 7 carries the rest of 3 and ch 4 — resume in ch 3. Chs 5-16 are already read; ep 8 restarts at 17 (C3)." }, reason: 'the verifier\'s correction of the delivered value: ep 6 ends inside ch 3 and ep 7 carries the rest — resume in 3', ruledBy: 'Sean', ruledOn: D1, cite: W2C('d-gray-man') },
  { seriesId: 'd-gray-man', ruleId: 'C2', value: { episode: 24, continue_chapter: 29, kind: 'parity', note: "C2 parity (the verifier's correction): ep 25 is filler and ep 26 adapts ch 29 (the General Yeegar arc, moved behind the Krory arc) — resume at ch 29 (its pp 12-13 are what ep 26 pins; ch 30 'Missing in Action' is never adapted straight by either series). Chs 31-42 are already read; ep 38 restarts at 43 (C3)." }, reason: "the verifier's correction: ep 26 (the next canon row) adapts ch 29 — resume at 29, not the delivered value", ruledBy: 'Sean', ruledOn: D1, cite: W2C('d-gray-man') },
  { seriesId: 'eyeshield-21', ruleId: 'C2', value: { episode: 21, continue_chapter: 53, kind: 'parity', note: "C2 parity (the verifier's reading of the pages): ep 21 carries ch 49 to the Taiyo draw (pp 1-12); ch 49's tail (pp 13-20, Ojo vs Shinryuji) and chs 50-52 are never adapted in running order (the result is reported at ep 37; 50-51 surface only as ep 106's flashback); ep 22 is anime-original and ep 23 restarts at ch 53." }, reason: "pairs with the rejected fence repair: ep 21 carries ch 49 to the Taiyo draw; ch 49's tail and 50-52 are never adapted in running order; ep 23 restarts at 53", ruledBy: 'Sean', ruledOn: D1, cite: W2C('eyeshield-21') },
];

const W2_ANNOTATION_OVERRIDES: RulingEntry<AnnotationOverlay>[] = [
  { seriesId: 'd-gray-man', ruleId: 'T28', value: { episode: 40, kind: 'loose_parallel', chapters: '30, 44', note: "T28 tie on a filler row (T6 2026-08-27): 'Requiem Rose' opens the anime-original Lulu Bell arc; its manga content is a spoken recap of ch 44 already animated in ep 39 and — the verifier — a balcony flashback that may be ch 30's Lenalee exchange (not found animated elsewhere). Position-less (A1/A44)." }, reason: "the verifier's addition: the balcony flashback may be ch 30's Lenalee exchange — the tie names {30, 44}, the row stays position-less", ruledBy: 'session', ruledOn: D1, cite: W2C('d-gray-man') },
  { seriesId: 'bleach', ruleId: 'N22', value: { episode: 164, kind: 'side_story', chapters: '(Colorful Bleach omake Part 21)', note: "Ep 164 also animates 'Tedious Everyday Tales Colorful Bleach' Part 21 — Kubo's V Jump side series (KaraBuri+), not a mainline chapter: labelled, never converted to a mainline number; END stays 277. Parenthesised so no parser reads its '21' as a chapter." }, reason: "a side-series part is labelled, never converted to a mainline number (END stays 277); parenthesised so no parser reads its '21' as a chapter", ruledBy: 'session', ruledOn: D1, cite: W2C('bleach') },
];

const W2_ANNOTATION_DROPS: RulingEntry<AnnotationDrop>[] = [
  { seriesId: 'hunter-x-hunter', ruleId: 'R3', value: { episode: 80, kind: 'abridged' }, reason: "single-source colour (hunterpedia's synopsis alone) — the verifier: droppable; dropped (R3)", ruledBy: 'session', ruledOn: D1, cite: W2C('hunter-x-hunter') },
];

const W2_NOTE_REPAIRS: RulingEntry<NoteRepair>[] = [
  { seriesId: 'd-gray-man', ruleId: 'A8', value: { episode: 51, field: 'chapters_adapted', value: '44 (last page), 45 (p1-10), 46 (p2-10)' }, reason: "the fence repair's page string travels with END 46 (the verdict's flag; the verifier: ch 44's share is its last page); the row flips to manual (P8)", ruledBy: 'session', ruledOn: D1, cite: W2C('d-gray-man') },
  { seriesId: 'naruto-shippuden', ruleId: 'A8', value: { episode: 478, field: 'note', value: '479 finishes ch 699 — ch 700 is never adapted by Shippuden (batch 20 wave 2, verified: Narutopedia + ja-WP 原作の第699話まで; Boruto ep 24 carries 700)' }, reason: 'the same stale "479 re-covers → 700" pointer the verifier found on ep 478: ch 700 is never adapted by Shippuden (Boruto ep 24 carries it); the note is corrected in place', ruledBy: 'session', ruledOn: D1, cite: W2C('naruto-shippuden') },
];

const W2_DELETIONS: RulingEntry<Deletion>[] = [
  { seriesId: 'eyeshield-21', ruleId: 'A1', value: { episode: 15 }, reason: 'the afg anchor 15 → 34 on a row now filler by T6 (A1) — ch 34 is ep 17\'s material (the verifier, page-checked); 15/16 filler by T6', ruledBy: 'Sean', ruledOn: D1, cite: W2C('eyeshield-21') },
];

// boundary rows the wave found missing (insert where the volume is absent; never replace)
const W2_BOUNDARIES: RulingEntry<BoundarySeed>[] = [
  { seriesId: 'yu-yu-hakusho-ghostfiles', ruleId: 'V6', value: { mangaId: 30053, rows: [{ volume: 6, chapter_start: 46, chapter_end: 55 }, { volume: 7, chapter_start: 56, chapter_end: 63 }, { volume: 8, chapter_start: 64, chapter_end: 72 }, { volume: 9, chapter_start: 73, chapter_end: 81 }] }, reason: 'batch20 wave 2 (verified): yuyuhakusho.fandom chapter pages Chapter_46…Chapter_82 volume field + en-WP chapter list (shifted +1 from vol 8 = Viz numbering); inserted where absent, never replaced', ruledBy: 'session', ruledOn: D1, cite: W2C('yu-yu-hakusho-ghostfiles') },
  { seriesId: 'bleach', ruleId: 'V6', value: { mangaId: 30012, rows: [{ volume: 28, chapter_start: 243, chapter_end: 251 }, { volume: 29, chapter_start: 252, chapter_end: 260 }, { volume: 30, chapter_start: 261, chapter_end: 269 }, { volume: 31, chapter_start: 270, chapter_end: 278 }, { volume: 32, chapter_start: 279, chapter_end: 286 }] }, reason: 'batch20 wave 2 (verified): bleach.fandom volume pages 28-32 (reverse episodes fields) + en-WP Bleach season 8 (252-286 = vols 29-32); inserted where absent, never replaced', ruledBy: 'session', ruledOn: D1, cite: W2C('bleach') },
];

// the shippuden display question is a UI-pass note, NOT a map
const W2_HOLDS: RulingEntry<Hold>[] = [
  { seriesId: 'naruto-shippuden', ruleId: 'T26', value: { held: 'novel rows stay a dash (no display map)' }, reason: 'Sean: the shippuden display question is a UI-pass note, NOT a map — novel rows stay a dash (T26 / P6: an override is an annotation, never a fourth episode type; incomplete data is an honest dash)', ruledBy: 'Sean', ruledOn: D1, cite: [W2, '§12.80', `${REC}/WAVE2-RECOVERY.md`] },
];

const W2_FLAGS: RulingEntry<FlagDismissal>[] = [
  flag('bleach', 677, "RESOLVED (batch 20 wave 2, verified R24): not an edition divergence — MU's anime coverage for this work is the labelled segment 'Vol 54, Chap 479 (Bleach)' (= our scope and the ep-366 anchor); its latest_chapter 250 is the chapter of the latest-DATED release records (a weekly re-release run ending 2023-09-30); 'Vol 74, Chap 705 (TYBW P4)' belongs to the I20 split entry. NOTE for capture: pickEntrySegments picks 479 only because MU's ') /Vol' defeats the splitter — normalised, both labels are undecidable (the per-series MU segment rulings queue).", D1, W2, '§12.80'),
  flag(SS, 702, "RESOLVED (batch 20 wave 2, verified R24): AniList's 249 is the Weekly Shōnen Jump INSTALLMENT count (246 WSJ installments + the V Jump #247 + 2 specials; the Poseidon arc = #113-157), not a chapter count; MU's latest_chapter 33 is a release artefact; the reading edition is the 109-chapter tankōbon (V6/N22), and the batch-20 re-migration put every stored value in it.", D1, W2, '§12.80'),
];

// ===========================================================================
// WAVE 3 (2026-08-27, §12.82) — narrow follow-ups. Sean ruled all eleven
// decisions as written (WAVE3-RECOVERY §THE DECISIONS). STEP 0 is the
// shugo-chara re-fetch / N11 resort / re-key; STEP 2 the rosario S1 curated
// continues. MAP edits logged, not written: types (T6: TBATE 24 and FotNS 5
// → filler), the A44 entries, the golden-kamuy 25-46 atomic G53 block, the
// N11 `resort` form itself (numbering-shifts.ts), the FotNS ep-5 hostile row.
// ===========================================================================
const W3C = (file: string, report: string, ...more: string[]) => [`${OUT}/${file}`, `${VER}/${report}`, ...more, W3, '§12.82'];

const W3_FOLDS: RulingEntry<VerdictFold>[] = ([
  ['solo-leveling.json', 'solo-leveling', 'solo-leveling.md'],
  ['the-beginning-after-the-end.json', 'the-beginning-after-the-end', 'the-beginning-after-the-end.md'],
  ['kinnikuman-w3.json', 'kinnikuman', 'kinnikuman-w3.md'],
  ['x.json', 'x', 'x.md'],
  ['fist-of-the-north-star.json', 'fist-of-the-north-star', 'fist-of-the-north-star.md'],
  ['eyeshield-21-w3.json', 'eyeshield-21', 'eyeshield-tmm-w3.md'],
  ['tokyo-mew-mew.json', 'tokyo-mew-mew', 'eyeshield-tmm-w3.md'],
] as [string, string, string][]).map(([file, sid, report]) => fold(sid, file, D1, W3, '§12.82', report, sid === 'tokyo-mew-mew' ? 'TMM as delivered' : undefined));

// STEP 0 — shugo-chara: AFL skips no. 73, transposes 75/76, 83/84, 90/91 and
// prints 96 twice; the rows' dates and titles are true, the NUMBERS were wrong
// as a sequence. The resort (N11, numbering-shifts.ts: rows 74-96 by date →
// 73-96, the doubled 96 = true 95 + 96) is a MAP entry; the script re-fetched
// and re-staged the AFL page (the parser keeps the doubled 96), resolved under
// the resort, then RE-KEYED the stored anchors / annotations old row → true
// row (the verified identity table; rows not listed keep their number).
const W3_REKEY: RulingEntry<Rekey>[] = [
  { seriesId: 'shugo-chara', ruleId: 'N11', value: { 74: 73, 75: 75, 76: 74, 77: 76, 78: 77, 79: 78, 80: 79, 81: 80, 82: 81, 83: 83, 84: 82, 85: 84, 86: 85, 87: 86, 88: 87, 89: 88, 90: 90, 91: 89, 92: 91, 93: 92, 94: 93, 95: 94, 96: 96 }, reason: 'old stored row → true row (the verified identity table, rows 74-96), applied ascending so every target is vacated first (each move is downward or a stay); anchors and annotations both re-keyed; the N11 resort is the standing map entry', ruledBy: 'Sean', ruledOn: D1, cite: [`${VER}/shugo-chara.md`, W3, '§12.82', 'scripts/ingest/lib/rulings/numbering-shifts.ts'] },
];
const W3_REKEY_ANNOTATION: RulingEntry<AnnotationValue>[] = [
  { seriesId: 'shugo-chara', ruleId: 'A43', value: { episodes: [95], kind: 'divergence', note: "the restored true-95 row (りまとやや、真珠の絆！ 2009-08-08) sits inside the stored divergence block 86-96 (\"between 32 and 33\") — the stored ep-96 divergence fact is carried onto it: the true ep 95, restored by the N11 resort 2026-08-27 (AFL printed it as a second '96')" }, reason: 'the restored true-95 row joins the 86-96 divergence block it sits inside (the fact copied from the stored ep-96 annotation)', ruledBy: 'session', ruledOn: D1, cite: [`${VER}/shugo-chara.md`, W3, '§12.82'] },
];

const W3_ANCHOR_OVERRIDES: RulingEntry<AnchorOverlay>[] = [
  { seriesId: 'kinnikuman', ruleId: 'A4', value: { episode: 44, end_chapter: 116, chapters_adapted: '116-117 (ch 117 only its opening beat)', note: "END 116 (the verifier): the ch-117 plea the verdict placed in 44B is Toei's ep-45 synopsis text (ナツコが懇願); fandom 44B's plea is Laura Mackintosh, an anime-only tie — 44 carries ch 116 (the Warsman final's opening rounds, Toei's synopsis) and at most 117's first beat; ep 45 → 118 [117] unchanged. Medium. [medium]" }, reason: "the verifier's correction of the delivered END: the ch-117 plea belongs to ep 45's synopsis; ep 44 carries 116 and at most 117's first beat", ruledBy: 'session', ruledOn: D1, cite: W3C('kinnikuman-w3.json', 'kinnikuman-w3.md') },
  { seriesId: 'solo-leveling', ruleId: 'A8', value: { episode: 25, chapters_adapted: '104-110', note: "REPAIR 108 → 110 (the verifier): fandom Episode 25 `adaptedFrom` = Chapter 104-110 {{WB}}, the Recruitment Arc page (webtoon 108-110 / Episode 25), Chapter 110's summary IS the finale's close (Go Gunhee's B-rank dungeon → the red gate → the shadow army → 'ready for the next hunt'); AFG's 108 is its continua cell repeated. Was afg 108; manual now (P8). [high]" }, reason: "REPAIR 108 → 110 carried by the anchor upsert: the finale runs through ch 110 (fandom adaptedFrom 104-110; AFG's 108 is its continua cell repeated); was afg, manual now (P8)", ruledBy: 'session', ruledOn: D1, cite: W3C('solo-leveling.json', 'solo-leveling.md') },
  { seriesId: 'eyeshield-21', ruleId: 'A4', value: { episode: 60, confidence: 'high', note: "END 123 [122] (the verifier closed the fork): ep 60's body is ch 122 page-verified (Kakei's one-on-one counter p10, the Devil Bat Ghost crushed p17-19 = Bandai's モビィディック・アンカー) and it ends on Deimon's go-ahead touchdown after Kyoshin's field goal — ch 123's exact skeleton (MangaDex p3 FG, p21 TD, p22 '12-10, seven minutes left'), a third witness (a 2009 per-episode viewing log) narrating 18-17 at the cut; Bandai's ep-61 synopsis opens with the lead already taken. [high]" }, reason: 'confidence lifted to high: the verifier closed the fork on the pages (ch 122 page-verified + ch 123\'s skeleton at the cut, a third witness)', ruledBy: 'session', ruledOn: D1, cite: W3C('eyeshield-21-w3.json', 'eyeshield-tmm-w3.md') },
  { seriesId: 'eyeshield-21', ruleId: 'A41', value: { episode: 61, confidence: 'high', note: "123 [123] (the verifier): ep 61 opens at 18-17 with 7:08 left and its payload is ch 123's そして一年後 flashback (Mizumachi's swim team, p15) played AFTER the comeback the manga puts it before → rearranged {123}; ch 124 opens (pp 2-5) directly on the Poseidon call — the anime's stalemate is padding, so END stays 123 and ep 62 → 124 [124] holds. [high]" }, reason: "confidence lifted to high: ep 61's payload is ch 123's flashback played after the comeback (rearranged {123}); the anime's stalemate is padding, END stays 123", ruledBy: 'session', ruledOn: D1, cite: W3C('eyeshield-21-w3.json', 'eyeshield-tmm-w3.md') },
];

const W3_ANCHOR_REJECTS: RulingEntry<Rejection>[] = [
  { seriesId: 'the-beginning-after-the-end', ruleId: 'A1', value: { episode: 24, proposed: 'the delivered ep-24 anchor' }, reason: "filler by T6 (Sean: the verifier's T28 reading) — A1, no anchor; the delivered anchor is rejected and any stored anchor on the row deleted", ruledBy: 'Sean', ruledOn: D1, cite: W3C('the-beginning-after-the-end.json', 'the-beginning-after-the-end.md') },
];
const W3_DELETIONS: RulingEntry<Deletion>[] = [
  { seriesId: 'the-beginning-after-the-end', ruleId: 'A1', value: { episode: 24 }, reason: 'any stored anchor on the now-filler row goes (A1)', ruledBy: 'Sean', ruledOn: D1, cite: W3C('the-beginning-after-the-end.json', 'the-beginning-after-the-end.md') },
];

const W3_CONTINUE_OVERRIDES: RulingEntry<ContinueValue>[] = [
  { seriesId: 'the-beginning-after-the-end', ruleId: 'C5', value: { episode: 23, continue_chapter: 85, kind: 'post_series', note: "C5 post-series (Sean 2026-08-27): ep 23 is the anime's last row with source pages — ch 81-84 (81 Different, 82 The Announcement, 83 A Ball, 84 A Gentleman's Agreement — the Gideon deal, its last beat; three witnesses). Ep 24 is filler (a coda of ch 86's opening ceremony + a restaged reunion, T28) and takes no anchor. Resume at ch 85 'Anticipation': 85-88 (the uniforms; the Xyrus opening ceremony; Nicolas Dreyl / Lilia / Clive; the source's real reunion) are unseen — the anime ends inside webcomic season 4 (86-125) having skipped season 3's finale." }, reason: "ep 23 is the anime's last row with source pages; ep 24 is filler and takes no anchor — the post-series continue 85 lives on ep 23", ruledBy: 'Sean', ruledOn: D1, cite: W3C('the-beginning-after-the-end.json', 'the-beginning-after-the-end.md') },
];
const W3_CONTINUE_DROPS: RulingEntry<Deletion>[] = [
  { seriesId: 'the-beginning-after-the-end', ruleId: 'A1', value: { episode: 24 }, reason: 'the delivered ep-24 continue dropped: the row is filler; its continue lives on ep 23', ruledBy: 'Sean', ruledOn: D1, cite: W3C('the-beginning-after-the-end.json', 'the-beginning-after-the-end.md') },
];

const W3_ANNOTATION_OVERRIDES: RulingEntry<AnnotationOverlay>[] = [
  { seriesId: 'x', ruleId: 'A44', value: { episode: 17, kind: 'rearranged', chapters: '54-62, 63', note: "Batch 20 wave 3 (the verifier's version): ep 17 'Wish' is a recap of vols 14 (54-62) with its own first-time vol-14 material (Kakyō enters Kamui's dream; the Sacred Sword answer) and ch 63's sea dream — the entry's FIRST showing of that scene (the OVA prologue 'An Omen' is ep 0, outside the entry's 24 rows); 70.5 dropped (no source places the shooting in ep 17). Position-less (A44)." }, reason: "the verifier's version: chapters {54-62, 63}; 70.5 dropped (no source places the shooting in ep 17); the row stays position-less", ruledBy: 'session', ruledOn: D1, cite: W3C('x.json', 'x.md') },
];
const W3_ANNOTATION_DROPS: RulingEntry<AnnotationDrop>[] = [
  { seriesId: 'kinnikuman', ruleId: 'P10', value: { episode: 44, kind: 'partial' }, reason: 'the 117 straddle — refuted with END 116 (the verifier); the delivered partial{117} is reported, not applied', ruledBy: 'session', ruledOn: D1, cite: W3C('kinnikuman-w3.json', 'kinnikuman-w3.md') },
  { seriesId: 'kinnikuman', ruleId: 'P10', value: { episode: 45, kind: 'partial' }, reason: 'the 117 straddle — refuted with END 116 (the verifier); the delivered partial{117} is reported, not applied', ruledBy: 'session', ruledOn: D1, cite: W3C('kinnikuman-w3.json', 'kinnikuman-w3.md') },
];
const W3_ANNOTATION_ADDS: RulingEntry<AnnotationValue>[] = [
  { seriesId: 'the-beginning-after-the-end', ruleId: 'T28', value: { episodes: [24], kind: 'graft', chapters: '86', note: "T28 tie on a filler row (Sean 2026-08-27): the finale's closing act quotes ch 86's Xyrus opening ceremony (Tessia on the student-council stage) as a half-sentence coda, and its night reunion is a restaging of ch 88's beat, not its pages ('completely rewrote how Tessia and Arthur reunite'); the rest — Shiun, the church duel, the city rampage — is anime-original. Position-less (A1/A44); the continue 85 lives on ep 23." }, reason: "the T28 tie that replaces the rejected ep-24 anchor: a half-sentence coda of ch 86 and a restaging of ch 88's beat, not its pages — position-less", ruledBy: 'Sean', ruledOn: D1, cite: W3C('the-beginning-after-the-end.json', 'the-beginning-after-the-end.md') },
];

// STEP 2 — rosario-vampire S1 (Sean 2026-08-27): the C2-backwards values
// derived from the stored rows; CURATED (C7), never the healer — the parity
// healer is NOT turned on for regime series.
const ROSARIO_C = [W3, '§12.82', `${REC}/WAVE3-RECOVERY.md`];
const rosario = (episode: number, ruleId: string, continue_chapter: number, kind: 'parity' | 'post_series', note: string): RulingEntry<ContinueValue> => ({ seriesId: 'rosario-vampire', ruleId, value: { episode, continue_chapter, kind, note }, reason: note, ruledBy: 'Sean', ruledOn: D1, cite: ROSARIO_C });
const W3_ROSARIO: RulingEntry<ContinueValue>[] = [
  rosario(1, 'C2', 2, 'parity', "C2 parity: ep 2 adapts ch 2 next. S1 never adapts chs 6, 7, 11 and 17 (Capu2 reaches back for some); the anime plays chs 3-5 in eps 5-6 after ep 3's ch 5."),
  rosario(2, 'C2', 5, 'parity', 'C2 parity: ep 3 adapts ch 5 next (the anime front-loads it); chs 3-4 follow in eps 5-6. S1 never adapts 6, 7, 11, 17.'),
  rosario(3, 'C2', 3, 'parity', 'C2 parity, BACKWARDS: ep 5 adapts ch 3 next (ep 4 is filler); C3: ch 5 is already read — skip on arrival. S1 never adapts 6, 7, 11, 17.'),
  rosario(5, 'C2', 4, 'parity', 'C2 parity: ep 6 adapts ch 4 next. S1 never adapts 6, 7, 11, 17.'),
  rosario(6, 'C2', 18, 'parity', "C2 parity: ep 7 jumps to ch 18-19 (S1's back half reorders 8-19); chs 6-7 are never adapted in S1; 8-17 follow out of order in eps 8-13. S1 never adapts 6, 7, 11, 17."),
  rosario(7, 'C2', 12, 'parity', 'C2 parity, BACKWARDS: ep 8 adapts ch 12 next; C3: chs 18-19 are already read — skip on arrival. S1 never adapts 6, 7, 11, 17.'),
  rosario(8, 'C2', 13, 'parity', 'C2 parity: ep 9 adapts ch 13 next. S1 never adapts 6, 7, 11, 17.'),
  rosario(9, 'C2', 14, 'parity', 'C2 parity: ep 10 adapts ch 14-16 next. S1 never adapts 6, 7, 11, 17.'),
  rosario(10, 'C2', 8, 'parity', 'C2 parity, BACKWARDS: ep 11 adapts ch 8 next; C3: chs 12-16 are already read — skip on arrival. S1 never adapts 6, 7, 11, 17.'),
  rosario(11, 'C2', 9, 'parity', 'C2 parity: ep 12 adapts ch 9 next. S1 never adapts 6, 7, 11, 17.'),
  rosario(12, 'C1', 9, 'parity', "C1: ep 13 opens on ch 9's second half (then ch 10, heavily altered) — resume in 9. S1 never adapts 6, 7, 11, 17."),
  rosario(13, 'C5', 20, 'post_series', "C5 post-series (S1's end): coverage reaches ch 19 (ep 7), so resume at ch 20; chs 6, 7, 11 and 17 were never adapted in S1 (Capu2, a separate entry, reaches back for some). Sean 2026-08-27: curated under the C2-backwards reading, not a healer flip."),
];

const W3_FLAGS: RulingEntry<FlagDismissal>[] = [
  flag('fist-of-the-north-star', 688, "RESOLVED (batch 20 wave 3, verified R24): no edition divergence — MU's own record says 27 tankōbon and its coverage segments for this entry read 'Vol 16, Chap 136 (1983 S1)' / 'Vol 24, Chap 210 (1983 S2)', exactly our stored terminals in AniList's 245-chapter space (hokuto.fandom Chapter 1-245 with our volume blocks; hokutosite 全245話); MU's latest_chapter 71 is the 2023-11-16 Deux83 release 'v8 c67-71' (v8 = 63-71, same space). NOTE for capture: MU's string now carries a 2026-remake segment; the picker keeps '(1986 Movie/Legend of Raoh 1)' because its year is in-window — a lib gap witness (no data effect: the chosen max is still 210).", D1, W3, '§12.82'),
  flag('golden-kamuy', 860, "RESOLVED (batch 20 wave 3, verified R24): no numbering offset — rows 25-46 held the Golden Dōga Gekijō web shorts' titles AND dates verbatim (AFL's title authority stops at row 24; en-WP's second {{Episode list}} block filled 25-46); the backfill's own compare showed 20 conflicts today = rows 25-44 (22 at flag time, before batch 19 fixed 45/46). Repaired as one atomic G53 title+date block (air-dates.ts + episode-titles.ts); rows 1-24 and 47-62 join 1:1.", D1, W3, '§12.82'),
  flag('shugo-chara', 937, "RESOLVED (batch 20 wave 3, verified R24): the episode-row audit is done — AFL skips no. 73, transposes 75/76, 83/84, 90/91 and prints 96 twice; the rows' dates and titles are true, the NUMBERS were wrong as a sequence. Ruled as an N11 `resort` (numbering-shifts.ts: rows 74-96 by date → 73-96, the doubled 96 = true 95 + 96, the true-95 row restored), the G53 date map re-keyed, the 107/108 transposition swapped (G53 title+date), 35/37/46 repaired; no G54 ack anywhere.", D1, W3, '§12.82'),
  flag('solo-leveling', 1029, "RESOLVED (batch 20 wave 3, verified R24): the afg-tier hole 13-24 is anchored on the webtoon's own numbering (sololeveling.fandom {{WB}} × AFG agree 10/12; the arc pages' event index), the fence 12 → 45 confirmed and 25 → 108 repaired to 110 (the finale runs through ch 110); continue 111 post_series. MU still has no anime coverage for this entry — the frontier is the manual terminal.", D1, W3, '§12.82'),
];

// ===========================================================================
// WAVE 4 (2026-08-28, §12.84) — the standing lies wave 3 left. Sean ruled
// (WAVE4-RECOVERY §THE DECISIONS; Cursor's one START call). MAP edits logged,
// not written: types (T6 — shugo 91 filler, 92 loose_parallel, the twelve
// retypes), dates + titles (G53 — FotNS 53 / 60 / 126, ep 29 stays 05-16),
// the four A45 retirements (TMM 38 partial + rearranged; shugo 91/92
// divergence; shugo 92 graft), the A7 re-key (ZONE_ACKS shugo-chara 93 → 91
// in batch-17.ts). ANNOTATION_DROP — EMPTY this wave.
// ===========================================================================
const W4C = (file: string, report: string) => [`${OUT}/${file}`, `${VER}/${report}`, W4, '§12.84'];

const W4_FOLDS: RulingEntry<VerdictFold>[] = ([
  ['the-beginning-after-the-end-w4.json', 'the-beginning-after-the-end', 'the-beginning-after-the-end-w4.md', 'TBATE 13-22 as delivered'],
  ['tokyo-mew-mew-w4.json', 'tokyo-mew-mew', 'tokyo-mew-mew-w4.md', 'the end_chapter / chapters_adapted repairs on ep 38 are carried by the anchor upsert (the overlay below)'],
  ['shugo-chara.json', 'shugo-chara', 'shugo-chara-w4.md', 'shugo 91 filler + graft {34}, 92 loose_parallel, the twelve retypes are T6 map edits'],
] as [string, string, string, string][]).map(([file, sid, report, extra]) => fold(sid, file, D2, W4, '§12.84', report, extra));

const W4_ANCHOR_OVERRIDES: RulingEntry<AnchorOverlay>[] = [
  { seriesId: 'tokyo-mew-mew', ruleId: 'A10', value: { episode: 38, start_chapter: 20, chapters_adapted: "19 (closing beats, pp 102-107: Kish carried off, 'He saw all of it', Masaya's 'I knew you were a Mew Mew'), 20 (pp 108-121: the title page, 'I'd play along' / 'I LOVE YOU' pp 118-119, 'our little secret' pp 120-121)", confidence: 'high', note: "REPAIR 19 → 20 [20] v5 (Sean 2026-08-28): ep 38's payload straddles the chapter boundary — ch 19 pp 102-107 + ch 20 pp 108-121 on the TokyoPop vol-5 scan read on the leaves (folios 77/109/112/125 + the TOC fix the page formula; the verifier re-checked every quoted line) and TV Aichi's archived synopsis + en-WP's ep-38 summary ('He pretended not to know' = ch 20 p 118 only). Ch 20's pages are FIRST-TIME here (ep 36 carries the chapter's tail, pp ~135-147; ep 37 nothing) → the anchor + rearranged {19-20} under 'pages, not numbers'. START 20 under A10: ch 19's counterpart pages are three (103, 106-107), a leading fragment — the hxh-80 shape; 19 stays in chapters_adapted and the tie. [high]" }, reason: "TMM 38 → 20 [20] (A10: ch 19's three counterpart pages are a leading fragment, the hxh-80 shape — 19 stays in chapters_adapted and the rearranged tie); Cursor's one START call, Sean ruled", ruledBy: 'Sean', ruledOn: D2, cite: W4C('tokyo-mew-mew-w4.json', 'tokyo-mew-mew-w4.md') },
];

const W4_CONTINUE_ADDS: RulingEntry<ContinueValue>[] = [
  { seriesId: 'shugo-chara', ruleId: 'C1', value: { episode: 80, continue_chapter: 32, kind: 'parity', note: "C1 (Sean 2026-08-28): ep 80 ends inside ch 32 (its first part; the anime-original Lulu ?-egg arc — rows 82-96, filler — sits inside the split) and ep 97 carries ch 32's remainder + ch 33; resume IN 32. Sixteen rows would otherwise carry no reader instruction." }, reason: 'the optional continue 80 → 32 added (curated, C7): ep 80 ends inside ch 32 and ep 97 carries its remainder — sixteen filler rows would otherwise carry no reader instruction', ruledBy: 'Sean', ruledOn: D2, cite: W4C('shugo-chara.json', 'shugo-chara-w4.md') },
  { seriesId: 'the-beginning-after-the-end', ruleId: 'C2', value: { episode: 12, continue_chapter: 58, kind: 'parity', note: "C2 parity (Sean 2026-08-28): ep 12 ends at ch 56; ch 57 (the Dragonspine Inn / Turman scene) is animated NOWHERE — rows 13-16 are anime-original (filler) — and ep 17 restarts at ch 58. Resume at 58; read 57 yourself if you want the inn scene." }, reason: 'row 12 → 58 parity with 57 named never-adapted (curated, C7): rows 13-16 are filler and ep 17 restarts at 58', ruledBy: 'Sean', ruledOn: D2, cite: W4C('the-beginning-after-the-end-w4.json', 'the-beginning-after-the-end-w4.md') },
];

const W4_ANNOTATION_OVERRIDES: RulingEntry<AnnotationOverlay>[] = [
  { seriesId: 'tokyo-mew-mew', ruleId: 'A41', value: { episode: 38, kind: 'rearranged', note: "REPLACES the stored rearranged {19} (batch 19). A41 settled reorder, 'pages, not numbers': ch 20 is split across two episodes in REVERSE order — ep 36 carries its TAIL (pp ~135-147: cat-Ichigo, Tart, Alto, 'Ryou?!'; pp 128-133, the parents' date, are in no episode) and ep 38 its opening (pp 108-121), first-time; ep 38 also closes ch 19 (pp 102-107). The anchor is 20 [20]." }, reason: "the verifier's text fix: replaces the stored rearranged {19} (batch 19) with the pages-not-numbers account of ch 20 split across eps 36/38 in reverse order", ruledBy: 'session', ruledOn: D2, cite: W4C('tokyo-mew-mew-w4.json', 'tokyo-mew-mew-w4.md') },
  { seriesId: 'tokyo-mew-mew', ruleId: 'A43', value: { episode: 38, kind: 'divergence', note: "The reveal is relocated wholesale: in ch 19 Masaya learns the truth because Kish attacks their lunch date and Ichigo is forced to transform in front of him; the anime moves the confession to a hospital bedside (TV Aichi's synopsis: 'Kish's attack … Ichigo hospitalised … Masaya's confession … the two promise to keep it their secret') — the beats are ch 19's and ch 20's, the staging is the anime's." }, reason: "the verifier's text fix: the reveal is relocated wholesale — the beats are ch 19's and 20's, the staging is the anime's", ruledBy: 'session', ruledOn: D2, cite: W4C('tokyo-mew-mew-w4.json', 'tokyo-mew-mew-w4.md') },
];

// ===========================================================================
// WAVE 5 (2026-08-28, §12.88) — dragon-ball-super under I40 / T30 / A46.
// Sean ruled the parallel model (the timelines A/B/C canon, D filler, E mixed
// under T28); wave 5c (90 / 91 / 78 → canon; 1 / 2 / 89 mixed stand); wave
// 5d-5f the series-wide re-pass (every row judged under T30, none projected).
// Types are a T6 MAP edit (the lifted rows MUST be pinned canon: AFL's
// 'anime canon' re-derives to filler on a manga-kind series, T27); the ep-78
// rearranged{28} is an A45 retirement. The script wrote what the maps cannot:
// row-level annotations and the episode_correspondence rows from the four
// verdicts (origin 'research'); NO anchors, NO continues, NO blanket arc
// annotations (A46) — the isParallelSeries guard and the "anchors on a
// parallel series" throw enforce it. ANNOTATION_OVERRIDE / ANNOTATION_DROP —
// EMPTY this wave.
// ===========================================================================
const DBS = 'dragon-ball-super';
const W5_FOLDS: RulingEntry<VerdictFold>[] = ['dragon-ball-super-w5c.json', 'dragon-ball-super-w5d.json', 'dragon-ball-super-w5e.json', 'dragon-ball-super-w5f.json']
  .map((file) => ({ ...fold(DBS, file, D2, W5, '§12.88'), reason: `verdict folded as delivered on the CORRESPONDENCE instrument (I40 / A46): row annotations upserted (origin 'research') and every correspondence row written through upsertCorrespondence (duplicates across the four verdicts: first wins); no anchors, no continues — the file is refused if it carries an anchor` }));

const W5_ANNOTATION_ADDS: RulingEntry<AnnotationValue>[] = [
  // SUPERSEDED 2026-09-05 (batch 22 wave 2, §12.118): the note's 'the digest has nothing here' was REFUTED on ch 3's own pages (the party visit is narrated, the King Vegeta flashback staged); the live research row's note was repaired by apply-wave2.ts and ep 6 is canon (T30 B, pinned). Kept verbatim as the record of what wave 5 ruled.
  { seriesId: DBS, ruleId: 'I40', value: { episodes: [6], kind: 'side_source', note: "Battle of Gods (the 2013 film 『ドラゴンボールZ 神と神』): the birthday-party sequence is the film's, not the manga's — the manga's four-chapter digest has nothing here (ch 3's episode index omits ep 6 and its summary carries none of it). The batch-19 film precedent (Resurrection 'F' rows 18-27)." }, reason: "the one row fact lifted from the wave-5a verdict that the re-pass keeps (the blanket arc stamps are the arc's note, A46): ep 6 is the film's, not the manga's — the batch-19 film precedent", ruledBy: 'Sean', ruledOn: D2, cite: [`${OUT}/dragon-ball-super-w5a.json`, `${VER}/dragon-ball-super-w5a.md`, W5, '§12.88'] },
];

// ===========================================================================
// WAVE 6 (2026-08-28, §12.91) — FotNS 29-56 + the seven L-D pins. Sean ruled
// (WAVE6-RECOVERY + the verify reports + the chat rulings): FotNS 29-56
// anchors as delivered; 53 → filler / 54 → mixed / 57 → MIXED under the T28
// sole-adaptation exception (its first ruling); the seven L-D pins land at
// the manual tier. MAP edits logged, not written: types (T6), totals (N35),
// the A45 retirement.
// ===========================================================================
const W6C = (file: string, ...more: string[]) => [`${OUT}/${file}`, ...more, W6, '§12.91'];
const W6_FOLDS: RulingEntry<VerdictFold>[] = ([
  ['fist-of-the-north-star-w6.json', 'fist-of-the-north-star', 'fist-of-the-north-star-w6.md', 'FotNS 29-56 anchors as delivered'],
  ['mf-ghost.json', 'mf-ghost', undefined, undefined],
  ['shy.json', 'shy', undefined, undefined],
  ['to-the-abandoned-sacred-beasts.json', 'to-the-abandoned-sacred-beasts', undefined, undefined],
  ['d-frag.json', 'd-frag', undefined, undefined],
  ['darwin-s-game.json', 'darwin-s-game', undefined, undefined],
  ['fist-of-the-blue-sky-regenesis.json', 'fist-of-the-blue-sky-regenesis', 'fist-of-the-blue-sky-regenesis.md', "ep 12's anchor DROPPED and its continue MOVED to ep 9 (the entries below)"],
  ['btooom.json', 'btooom', undefined, undefined],
] as [string, string, string | undefined, string | undefined][]).map(([file, sid, report, extra]) => fold(sid, file, D2, W6, '§12.91', report, extra));

const W6_DELETIONS: RulingEntry<Deletion>[] = [
  { seriesId: 'fist-of-the-blue-sky-regenesis', ruleId: 'G37', value: { episode: 12 }, reason: "G37/A1: the 2006 series' pin — another adaptation's pin on this entry; deleted, never repaired (the delivered ep-12 anchor is dropped and the stored row deleted)", ruledBy: 'Sean', ruledOn: D2, cite: W6C('fist-of-the-blue-sky-regenesis.json', `${VER}/fist-of-the-blue-sky-regenesis.md`) },
];
const W6_CONTINUE_MOVES: RulingEntry<ContinueMove>[] = [
  { seriesId: 'fist-of-the-blue-sky-regenesis', ruleId: 'C5', value: { episode: 12, moved_to: 9 }, reason: "the verifier's apply-blocking catch: a continue on a deleted-anchor row lands nothing — the delivered ep-12 continue is written on the ep-9 terminal instead (its note stamped 'moved to the terminal row at curation')", ruledBy: 'Sean', ruledOn: D2, cite: W6C('fist-of-the-blue-sky-regenesis.json', `${VER}/fist-of-the-blue-sky-regenesis.md`) },
];

const W6_ANCHORS: RulingEntry<AnchorValue>[] = [
  { seriesId: 'fist-of-the-north-star', ruleId: 'T28', value: { episode: 57, end_chapter: 82, start_chapter: null, chapters_adapted: "82 (closing pages only — Rei's death)", volume: 10, note: "Fence repair 83 → 82 (the clip show's one manga beat is Rei's death = ch 82's last pages; ch 83 opens the Souther arc — Rei ch 26-82 / ep 23-57 per the fandom index; hokutosite + RQ87 agree). The row is MIXED under the T28 sole-adaptation exception (its first ruling): these pages are adapted NOWHERE else and are load-bearing, so the anchor stands rather than deleting (A1 does not bite on mixed)." }, reason: "fence repair 83 → 82 and ep 57 → MIXED under the T28 sole-adaptation exception (its first ruling): ch 82's closing pages are adapted nowhere else and are load-bearing, so the anchor stands rather than deleting", ruledBy: 'Sean', ruledOn: D2, cite: W6C('fist-of-the-north-star-w6.json', `${VER}/fist-of-the-north-star-w6.md`) },
  { seriesId: 'fist-of-the-north-star', ruleId: 'A8', value: { episode: 58, end_chapter: 80, start_chapter: null, chapters_adapted: '80 (the betrayal passage, partial)', volume: 9, note: "Curated repair 83 → 80: ep 58's one manga sequence is ch 80's betrayal passage, not ch 83 (hokuto.fandom appearances + RQ87 + hokutosite, all three; the wave-6 verifier confirmed the flag; Souther = ch 85-97 / eps 58-68 — the next block must not read ep 58 as ch-83/85 coverage)." }, reason: "ep 58's curated repair 83 → 80: its one manga sequence is ch 80's betrayal passage, not ch 83 — the next block must not read ep 58 as ch-83/85 coverage", ruledBy: 'Sean', ruledOn: D2, cite: W6C('fist-of-the-north-star-w6.json', `${VER}/fist-of-the-north-star-w6.md`) },
];

const W6_ANNOTATION_ADDS: RulingEntry<AnnotationValue>[] = [
  { seriesId: 'fist-of-the-north-star', ruleId: 'A41', value: { episodes: [58], kind: 'rearranged', chapters: '80', note: "Reorder ack: ep 58 revisits ch 80's betrayal passage (earlier material — its anchor 80 sits below ep 57's 82 by design, a flashback, not junk; hokuto.fandom appearances + RQ87 + hokutosite). Settles the nonmonotonic audit for this seam." }, reason: "the rearranged fact that settles the nonmonotonic audit for the 57/58 seam (A41): ep 58's anchor 80 sits below ep 57's 82 by design — a flashback, not junk", ruledBy: 'Sean', ruledOn: D2, cite: W6C('fist-of-the-north-star-w6.json', `${VER}/fist-of-the-north-star-w6.md`) },
  { seriesId: 'fist-of-the-north-star', ruleId: 'T28', value: { episodes: [57], kind: 'partial', chapters: '82', note: "Clip show until Rei's death at the end (the fandom Filler page's own phrase): only ch 82's closing pages are adapted — the sole adaptation of a load-bearing beat, which is what makes the row mixed (T28 sole-adaptation exception, first witness). Skip advice: everything before the tail is recap." }, reason: 'the partial that names what makes ep 57 mixed: the sole adaptation of a load-bearing beat (T28 sole-adaptation exception, first witness); everything before the tail is recap', ruledBy: 'Sean', ruledOn: D2, cite: W6C('fist-of-the-north-star-w6.json', `${VER}/fist-of-the-north-star-w6.md`) },
];
const W6_ANNOTATION_OVERRIDES: RulingEntry<AnnotationOverlay>[] = [
  { seriesId: 'fist-of-the-blue-sky-regenesis', ruleId: 'R24', value: { episode: 9, kind: 'rearranged', chapters: '≈246-254 reached over the never-adapted 190-243' }, reason: "the verifier's text fix (R24): the restaged range ends at the END (254), not 255 — the delivered chapters string replaced at apply", ruledBy: 'session', ruledOn: D2, cite: W6C('fist-of-the-blue-sky-regenesis.json', `${VER}/fist-of-the-blue-sky-regenesis.md`) },
];

const W6_FLAGS: RulingEntry<FlagDismissal>[] = [
  flag('mf-ghost', 771, 'DISMISSED (wave 6): no edition divergence — MU latest_chapter 211 is a latest-DATED-release artifact against a 293-ch / 33-vol space MU itself calls complete; the ep-24 pin verified 72-74 v9.', D2, W6, '§12.91'),
  flag('shy', 681, "RESOLVED (wave 6, N35): the reading edition is the manga's own 1-87 / 15 volumes (ja-WP 全87話, en-WP, MangaDex 87.5, Magazine Pocket 第N話); stored 120 was an unsourceable AniList scalar — re-based by CHAPTER_SPACE_OVERRIDES.", D2, W6, '§12.91'),
  flag('to-the-abandoned-sacred-beasts', 541, 'RESOLVED (wave 6): the frontier exists — ep 12 → ch 35-36 vol 5 at the manual tier; C5 continue 37 with the skip list named (chs 8/10/11 skipped; 26 OAD-only).', D2, W6, '§12.91'),
];

// ===========================================================================
// WAVE 7 (2026-08-28, §12.93) — L-D ×7 + the regenesis-S2 class. Sean ruled
// (with Cursor; WAVE7-RECOVERY §Open for Sean): the seven L-D verdicts fold
// as delivered (cobra's bad pin DELETED, no fabricated continue). MAP edits
// logged, not written: regenesis 9 → mixed / 10-11 → filler (T6), N35 ×2,
// the G53 date/title blocks.
// ===========================================================================
const W7C = (file: string) => [`${OUT}/${file}`, W7, '§12.93', `${REC}/WAVE7-RECOVERY.md`];
const W7_FOLDS: RulingEntry<VerdictFold>[] = ([
  ['shaman-king-flowers.json', 'shaman-king-flowers', undefined],
  ['prison-school.json', 'prison-school', undefined],
  ['killing-bites.json', 'killing-bites', 'the ep-11/12 air date is HELD (the entry below)'],
  ['soul-eater-not.json', 'soul-eater-not', 'N35 42 is a chapter-space map edit'],
  ['drifters.json', 'drifters', undefined],
  ['cobra-the-animation.json', 'cobra-the-animation', "the ep-13 pin DELETED, no fabricated continue (the entry below)"],
  ['orange.json', 'orange', 'N35 22/5 + the G53 atomic block are map edits'],
  ['fist-of-the-blue-sky-regenesis-w7.json', 'fist-of-the-blue-sky-regenesis', '9 → mixed / 10-11 → filler are T6 map edits; S2 stays OUT (the entry below)'],
] as [string, string, string | undefined][]).map(([file, sid, extra]) => fold(sid, file, D2, W7, '§12.93', undefined, extra));

const W7_DELETIONS: RulingEntry<Deletion>[] = [
  { seriesId: 'cobra-the-animation', ruleId: 'G37', value: { episode: 13 }, reason: "G37/A44: the 1983 series' pin in another numbering — three-way wrong; deleted, never repaired, and no continue fabricated for it (closes #701; arc-level queued)", ruledBy: 'Sean', ruledOn: D2, cite: W7C('cobra-the-animation.json') },
];

const W7_HOLDS: RulingEntry<Hold>[] = [
  { seriesId: 'fist-of-the-blue-sky-regenesis', ruleId: 'I40', value: { held: 'S2 stays OUT of the catalog — NOT parallel' }, reason: 'S2 = the Outlaw Star class, NOT parallel: no comparison instrument — author credit does not mint correspondence (the comparison-instrument boundary recorded in I40 and research-agent; one parallel witness stands)', ruledBy: 'Sean', ruledOn: D2, cite: W7C('fist-of-the-blue-sky-regenesis-w7.json') },
  { seriesId: 'killing-bites', ruleId: 'G53', value: { held: 'the ep-11/12 air-date pair' }, reason: 'the killing-bites date is HELD: the slot check surfaced an ep-11/12 collision — a sourced two-row lane-B follow-up, not a one-row write', ruledBy: 'Sean', ruledOn: D2, cite: W7C('killing-bites.json'), retiresWhen: 'RETIRED 2026-09-07 (deep) — the pair LANDED 2026-09-02 (batch 20 wave 9, verified R24): air-dates.ts killing-bites {11: 2018-03-24, 12: 2018-03-31} on syobocal TID 4796' },
  { seriesId: '*', ruleId: 'T28', value: { held: 'the T28 six — PARKED, not ruled' }, reason: 'the T28 six stay PARKED (not ruled) this wave — carried on the Sean bar in WAVE7-RECOVERY, not bundled with the L-D folds', ruledBy: 'Sean', ruledOn: D2, cite: [W7, '§12.93', `${REC}/WAVE7-RECOVERY.md`], retiresWhen: 'RETIRED 2026-09-07 (deep) — the sliver clause was ruled at §12.106 (2026-09-04) and the six carry their rulings in their own maps today: dbz 43 mixed + partial{246 p.10-14} with a manual anchor 246; zatch 99, soul-eater 40 (+ divergence) and claymore 26 (+ divergence) filler + graft; shugo 127 filler + partial{42}; fma 40 canon with no fragment annotation — nothing parked remains' },
];

// ===========================================================================
// WAVE 8 (2026-09-02, §12.96) — L-D / A1 ×8 + A47 the END-side sliver. Sean
// ruled (WAVE8-RECOVERY §THE DECISIONS, "full set, ready to proceed"): the
// eight verdicts fold as delivered — every anchor re-lands at the MANUAL tier
// (P8), the repairs ride the anchor write (made-in-abyss 25 → 26, orient 113
// → 115, handa-kun vol 7 → 6, ranking-tcoc 155 v12 → 161 v13). ENDs are
// normalized through lib/sliver.ts#sliverEnd (A47) — the gate does the
// ruling. MAP edits logged, not written: types (T6), dates and titles (G53).
// ===========================================================================
const W8C = (sid: string, report?: boolean) => [`${OUT}/${sid}.json`, ...(report ? [`${VER}/${sid}.md`] : []), W8, '§12.96'];
const W8_FOLDS: RulingEntry<VerdictFold>[] = ([
  ['uq-holder', false, undefined],
  ['pluto', false, undefined],
  ['made-in-abyss', true, 'the repair 25 → 26 rides the anchor write'],
  ['orient', true, 'the repair 113 → 115 rides the anchor write; zero rows exist — anchors land as A42 anchor_without_row (the entry below); ep 12 stays 46 (sliverEnd refused to move it)'],
  ['one-piece-log-fish-man-island-saga', true, 'rows 7-21 are AFL lag — anchors land as A42 anchor_without_row (the entry below); ep 10 END normalized 618 → 617 by the A47 gate (the entry below)'],
  ['masamune-kun-s-revenge', false, undefined],
  ['handa-kun', false, 'the repair vol 7 → 6 rides the anchor write'],
  ['ranking-of-kings-the-treasure-chest-of-courage', true, "the repair 155 v12 → 161 v13 rides the anchor write; the verifier's F2/F3 note edits are the overlay below"],
] as [string, boolean, string | undefined][]).map(([sid, report, extra]) => fold(sid, `${sid}.json`, D3, W8, '§12.96', report ? `${sid}.md` : undefined, extra));

// A42 by ruling: research runs ahead of rows — row-less targets land as anchor_without_row
const W8_ROWLESS: RulingEntry<RowlessAnchors>[] = [
  { seriesId: 'orient', ruleId: 'A42', value: { episodes: 'every delivered anchor (zero rows)', why: 'zero episode rows exist for the entry' }, reason: 'row-less target: orient has zero rows; the anchors land as A42 anchor_without_row by ruling (research runs ahead of rows)', ruledBy: 'Sean', ruledOn: D3, cite: W8C('orient', true) },
  { seriesId: 'one-piece-log-fish-man-island-saga', ruleId: 'A42', value: { episodes: '7-21', why: 'AFL lag' }, reason: 'row-less targets 7-21 (AFL lag) land as A42 anchor_without_row by ruling (research runs ahead of rows)', ruledBy: 'Sean', ruledOn: D3, cite: W8C('one-piece-log-fish-man-island-saga', true) },
];

// A47 at apply — the gate's one move this wave (the witness)
const W8_A47: RulingEntry<AnchorOverlay>[] = [
  { seriesId: 'one-piece-log-fish-man-island-saga', ruleId: 'A47', value: { episode: 10, end_chapter: 617, note: "A47: END normalized 618 → 617 (the 2-page tail of ch 618 is ep 11's, which starts on it)" }, reason: 'the END-side sliver rule Sean ruled this wave, applied by lib/sliver.ts#sliverEnd at the write: ep 10 holds only ch 618 pp 3-4 and ep 11 starts on 618, so END stays 617 (the continue is IN 618, C1); orient ep 12 stays 46 as delivered — the gate does the ruling', ruledBy: 'Sean', ruledOn: D3, cite: W8C('one-piece-log-fish-man-island-saga', true) },
];
const W8_ANNOTATION_ADDS: RulingEntry<AnnotationValue>[] = [
  { seriesId: 'one-piece-log-fish-man-island-saga', ruleId: 'A47', value: { episodes: [10], kind: 'partial', chapters: '618 (pp. 3-4)', note: "A47 (Sean 2026-09-02): the episode's last two pages are ch 618 pp 3-4; ep 11 starts on 618 and re-shows them — the tail is ep 11's chapter, END stays 617 (the continue is IN 618, C1)." }, reason: 'the tail the normalizer moved off the END is named on the row as a partial (the orient ep-12 shape) so it stays visible', ruledBy: 'Sean', ruledOn: D3, cite: W8C('one-piece-log-fish-man-island-saga', true) },
];

// The verifier's chapter-map corrections (verify/ranking-….md F2/F3): the stored fact keeps the confirmed pairing and drops the contradicted candidate.
const RTCOC = 'ranking-of-kings-the-treasure-chest-of-courage';
const W8_NOTE_OVERRIDES: RulingEntry<AnnotationOverlay>[] = [
  { seriesId: RTCOC, ruleId: 'R24', value: { episode: 1, kind: 'side_story', chapters: "vol 8 描き下ろし bonus chapter (MangaDex 104.5, 'Despa's investment') for segment B 王子とお金", note: "Segment B adapts the vol-8 tankōbon bonus chapter (pixiv 「原作は単行本8巻の書き下ろし」; MangaDex 104.5 in vol 8). Segment A カゲのおつかい is anime-original (pixiv オリジナルエピソード — the vol-5 'A Safe Haven' candidate was refuted by the verifier). A tankōbon bonus chapter is part of the SOURCE but carries no mainline number — side_story, never side_source; the row is mixed (T27)." }, reason: "the verifier's F2 edit: strike the 1A 'A Safe Haven' candidate (refuted); segment B's vol-8 bonus chapter is the confirmed pairing — side_story, never side_source; the row is mixed (T27)", ruledBy: 'session', ruledOn: D3, cite: W8C(RTCOC, true) },
  { seriesId: RTCOC, ruleId: 'R24', value: { episode: 8, kind: 'side_story', chapters: "vol 10 描き下ろし (MangaDex 129.5, 'Aspiracion') for segment A カゲのあこがれ", note: "Segment A adapts the vol-10 tankōbon bonus chapter (pixiv 「単行本10巻書き下ろし」; es-la 129.5 'aspiracion') — confirmed by the verifier. Segment B 偉大な母 is anime-original (pixiv オリジナルエピソード); at most its opening beat is shared with the vol-1 bonus (a remake of Bosse and Sheena's first meeting) — the vol-1 bonus is NOT the segment's source. The row is mixed (T27)." }, reason: "the verifier's F3 edit: 8A confirmed (the vol-10 bonus), 8B is anime-original with at most an opening beat shared with the vol-1 bonus (not its source); the 5C candidate struck; the row is mixed (T27)", ruledBy: 'session', ruledOn: D3, cite: W8C(RTCOC, true) },
];

const W8_FLAGS: RulingEntry<FlagDismissal>[] = [
  flag('uq-holder', 687, "uq-holder: no edition fork — MU says 28 volumes complete and its Vol 14 / Chap 134 matches Kodansha's vol-14 TOC; latest_chapter 130 is a release-record artifact (wave 8 verdict).", D3, W8, '§12.96'),
  flag('handa-kun', 698, "handa-kun: no second edition — MU's 20 = the English scanlation's stopping point; AniList's 35 = 31 mainline + 4 vol-7 post-completion extras, our stored space (wave 8 verdict).", D3, W8, '§12.96'),
  flag('orient', 769, "orient: no edition split — one continuous space 1-156 / 22 vols across the WSM → Bessatsu move (Kodansha 初出 per volume, ja-WP 全156話, MangaDex); MU's 121 is its scanlation release ceiling (wave 8 verdict, verified).", D3, W8, '§12.96'),
];

// ===========================================================================
// A47 BACKLOG MIGRATION (2026-09-02, §12.97-§12.98) — the END-side sliver
// over STANDING manual anchors (the batch-14 A10 shape). The script listed
// every manual anchor whose END lib/sliver.ts#sliverEnd moves (the ONE
// derivation, P2) with its continue and whether a `partial` already names
// the tail; SEAN SIGNED THE LIST AS ONE BLOCK before --apply (the ledger
// record: a listing class, Sean signs each move; the script is how "each"
// became one decision with the full list in front of him). The per-row list
// was computed from the database, not written in the script — it lives in
// the rows' notes (the marker) and §12.98.
// ===========================================================================
const A47C = [A47S, '§12.97', '§12.98', 'scripts/ingest/lib/sliver.ts'];
const A47_BLOCK: RulingEntry<A47Block | { revert: string; witness: string } | { rederive: string; stale: string[] }>[] = [
  { seriesId: '*', ruleId: 'A47', value: { marker: '[A47 migrated 2026-09-02]', scope: 'every standing manual anchor (source manual, chapters_adapted set) whose END sliverEnd moves, computed against the NEXT manual row\'s START', continue: 'untouched (it already points at the next episode\'s START)', partial: 'upserted {tail} where no partial names it, so the tail stays visible' }, reason: 'END := derived and the row\'s note stamped with the A47 marker (N22: a per-row marker, never a sentinel value — re-runs select on its ABSENCE through the derivation itself, which is idempotent); Sean signed the full list as ONE block before --apply', ruledBy: 'Sean', ruledOn: D3, cite: A47C },
  { seriesId: '*', ruleId: 'A44', value: { revert: 'sole-segment rows: END restored from the marker text', witness: 'd-gray-man#66' }, reason: 'REVERT pass (the d-gray-man 66 catch): a marked row whose tail is its ONLY segment was moved to a chapter it never adapts — the refined rule (sole-segment) no longer moves it; END restored from the marker text and the note prefixed "(A47 revert)" — the tail is the row\'s only record: an A44 judgment, not a derivation', ruledBy: 'Sean', ruledOn: D3, cite: A47C },
  { seriesId: '*', ruleId: 'V10', value: { rederive: 'volume re-derived from the boundary table for every marked or reverted row', stale: ['oshi-no-ko#21', 'saint-seiya-knights-of-the-zodiac#112', 'dragon-ball-z-kai#93', 'dragon-ball-z-kai#132'] }, reason: 'a moved END can step back across a volume boundary — the volume is re-derived from volume_boundaries for every marked row (the first run left four stale: oshi-no-ko 21, saint-seiya 112, dbz-kai 93 / 132)', ruledBy: 'session', ruledOn: D3, cite: A47C },
];

export const ENTRIES: RulingEntry[] = [
  // wave 1
  ...W1_ANCHORS, ...W1_DELETIONS, ...W1_CONTINUES, ...W1_ANNOTATIONS, ...W1_HOLDS, ...W1_FLAGS,
  // wave 2
  ...W2_FOLDS, ...W2_MIGRATION, ...W2_ANCHOR_OVERRIDES, ...W2_REPAIR_REJECTS, ...W2_CONTINUE_OVERRIDES, ...W2_ANNOTATION_OVERRIDES, ...W2_ANNOTATION_DROPS, ...W2_NOTE_REPAIRS, ...W2_DELETIONS, ...W2_BOUNDARIES, ...W2_HOLDS, ...W2_FLAGS,
  // wave 3
  ...W3_FOLDS, ...W3_REKEY, ...W3_REKEY_ANNOTATION, ...W3_ANCHOR_OVERRIDES, ...W3_ANCHOR_REJECTS, ...W3_DELETIONS, ...W3_CONTINUE_OVERRIDES, ...W3_CONTINUE_DROPS, ...W3_ANNOTATION_OVERRIDES, ...W3_ANNOTATION_DROPS, ...W3_ANNOTATION_ADDS, ...W3_ROSARIO, ...W3_FLAGS,
  // wave 4
  ...W4_FOLDS, ...W4_ANCHOR_OVERRIDES, ...W4_CONTINUE_ADDS, ...W4_ANNOTATION_OVERRIDES,
  // wave 5
  ...W5_FOLDS, ...W5_ANNOTATION_ADDS,
  // wave 6
  ...W6_FOLDS, ...W6_DELETIONS, ...W6_CONTINUE_MOVES, ...W6_ANCHORS, ...W6_ANNOTATION_ADDS, ...W6_ANNOTATION_OVERRIDES, ...W6_FLAGS,
  // wave 7
  ...W7_FOLDS, ...W7_DELETIONS, ...W7_HOLDS,
  // wave 8
  ...W8_FOLDS, ...W8_ROWLESS, ...W8_A47, ...W8_ANNOTATION_ADDS, ...W8_NOTE_OVERRIDES, ...W8_FLAGS,
  // the A47 block
  ...A47_BLOCK,
];
