// Applied rulings — research batch 12 (item-4 batch 7, 2026-08-23; §12.31).
// Extracted from scripts/ingest/apply-research-batch-12.ts (the cited record;
// NOT modified). One entry per curated decision. Verdict JSONs lived in the
// session scratchpad (batch12/<sid>.json) and are not on disk.
//
// ruledBy: "agent-verified 2+ sources"; no decision is attributed to Sean in
// the script, so every entry is 'session'.
//
// CAVEAT — "as-stored" confirmation-laundering (§12.45, DRIFT-LIST): the
// verifier found that railgun ep 14 (script line ~110, 'as-stored') blessed
// an inherited stored value with an invented rationale — the ep-12/14 graft
// claim is factually false. The batch-12 as-stored sweep re-checked the 7
// other 'as-stored' rows: 6 confirmed, rosario ep 11 REPAIRED 9→8/v2 (wiki
// off-by-one from ep 11 — a source trap). Those entries carry the caveat in
// `reason` and `retiresWhen`. Also OPEN: iruma-kun ep 63 END convention
// (142 stored vs 145 = max adapted) and rosario 12/13 medium-confidence
// repairs HELD for Sean.

import type { RulingEntry } from '../types';

const RULED_ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-research-batch-12.ts';
const LOG = 'docs/changelog.md §12.31';
const SWEEP = 'docs/changelog.md §12.45 (Batch-12 as-stored sweep)';
const B = 'research-tier batch 12 (2026-08-23, agent-verified 2+ sources, full-record)';
const cite = (sid: string, ...extra: string[]) => [SCRIPT, `scratchpad batch12/${sid}.json (session scratchpad, not on disk)`, LOG, ...extra];

type AnchorRow = [string, number, number, number | null, string | null, number | null, string];
type ContinueRow = [string, number, number, string];
type AnnotationRow = [string, number[], string, string | null, string];

// [sid, ep, endCh, startCh|null, chaptersAdapted|null, vol|null, note] — verbatim from the script
const ANCHORS: AnchorRow[] = [
  // bleach — Fake Karakura opening
  ['bleach', 215, 317, 316, '316-317', 37, 'canon resumes after Karakuraizer filler. animefillerguide + animestoryguide'],
  ['bleach', 218, 324, 322, '322-324', 37, 'Kira vs Avirama; ends mid-324. both sources'],
  ['bleach', 221, 330, 328, '328-330', 38, 'Fraccion battles conclude. both sources'],
  ['bleach', 224, 335, 333, '333-335', 38, 'Rangiku vs Fracciones; closes vol 38. both sources'],
  ['bleach', 226, 339, 338, '338-339', 39, 'full record added to the confirmed anchor. both sources'],
  // my-hero-academia — Season 3
  ['my-hero-academia', 42, 76, 74, '74, 75, 76', 9, "'My Hero' — Kota rescue. fandom + Wikipedia S3"],
  ['my-hero-academia', 45, 83, 82, '82, 83', 10, 'Forest Training Camp ends; 46 opens Hideout Raid at 84. fandom + Wikipedia'],
  ['my-hero-academia', 50, 97, 95, '94 (p18-22), 95, 96, 97 (p1-15)', 11, 'All Might vs AFO climax. fandom + Wikipedia'],
  ['my-hero-academia', 53, 103, 102, '102, 103', 12, "'The Test' = ch 103 title. fandom + Wikipedia"],
  ['my-hero-academia', 57, 110, 109, '109, 110', 13, 'last manga ep before the movie tie-in. fandom + Wikipedia'],
  ['my-hero-academia', 61, 120, 118, '117 (p10-15), 118, 119, 120, 121 (p1-9)', 14, "'Deku vs. Kacchan 2' — majority holds END at 120. fandom + Wikipedia"],
  // welcome-to-demon-school-iruma-kun — Season 3
  ['welcome-to-demon-school-iruma-kun', 47, 101, 99, '99 (p.17-20), 100, 101', 12, 'Special Tutor Training ends; 48 opens Harvest Festival. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 51, 110, 109, '109, 110', 13, 'clean 2-chapter ep. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 53, 115, 112, '112 (p.18-19), 113, 114, 115', 13, 'ends exactly at vol-13 end. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 56, 124, 122, '122, 123, 124', 14, 'ends at vol-14 end. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 58, 130, 128, '128, 129, 130', 15, 'clean boundary. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 60, 135, 134, '134, 135', 16, 'Harvest Festival tournament concludes. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 61, 138, 136, '136, 137, 138 (p.1-15)', 16, 'ends mid-138. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 62, 140, 138, '138 (p.14-22), 139, 140', 16, 'last monotonic anchor; 141 deferred to ep 65. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 63, 142, 142, '142, 145 (out of order)', 16, 'rearranged — as-stored. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 64, 144, 143, '143, 144', 17, 'rearranged zone — as-stored. fandom + animefillerguide'],
  // yu-yu-hakusho — Chapter Black interiors
  ['yu-yu-hakusho-ghostfiles', 69, 116, 115, '115 (2nd half)-116', 13, 'Kaito taboo game concludes. fandom + Chapter_116 + Wikipedia S3'],
  ['yu-yu-hakusho-ghostfiles', 73, 122, 121, '121 (2nd half)-122', 14, 'Doctor identified. fandom + Wikipedia'],
  ['yu-yu-hakusho-ghostfiles', 78, 129, 128, '128 (2nd half)-129', 15, 'street brawl vs Sensui. fandom + Wikipedia'],
  ['yu-yu-hakusho-ghostfiles', 82, 135, 134, '134 (2nd half)-135', 15, 'territory games. fandom + Wikipedia'],
  ['yu-yu-hakusho-ghostfiles', 86, 141, 140, '140 (2nd half)-141', 16, "Sensui's seven personalities. fandom + Wikipedia"],
  ['yu-yu-hakusho-ghostfiles', 90, 147, 146, '146 (2nd half)-147', 16, 'Yoko Kurama/dragon/barrier. fandom + Wikipedia'],
  // golden-kamuy — ep 24 REPAIR
  ['golden-kamuy', 5, 21, 18, '18-21', 3, 'Escape King arc end — MEDIUM (arc-span interpolation). fandom Story_Arcs + Chapter_21/22'],
  ['golden-kamuy', 10, 49, 44, '44-49', 6, "Kazuo Henmi arc end; ep title = ch 49 'Companion'. fandom + Chapter_49/50"],
  ['golden-kamuy', 12, 62, 55, '55-62 rearranged (56-59 → OVA 1; 63-69 → OVA 3)', 7, 'S1 finale — S1 = vols 1-7 chs 1-62. Wikipedia S1 + fandom'],
  ['golden-kamuy', 21, 124, 120, '~120-124', 13, 'Blind Bandits arc end — MEDIUM. fandom + Chapter_124/125'],
  ['golden-kamuy', 24, 139, 135, "~135-139 (through 138 'Loss' + 139 as cliffhanger)", 14, 'REPAIR: replaces MU ch-302 (Season-5 pin). S2 = vols 8-14 chs 70-139; continue 140. Wikipedia S2 + fandom + Chapter_139'],
  // naruto-shippuden — endgame per-episode map (20 of 24; no-progress eps skipped)
  ['naruto-shippuden', 414, 664, 663, '663-664', 69, 'canon resumes; Yin-Kurama sealing. listfist + narutopedia'],
  ['naruto-shippuden', 415, 666, 665, '665-666', 69, 'mixed but agreed. listfist + narutopedia'],
  ['naruto-shippuden', 418, 668, 667, '667-668', 69, 'Gai vs Six Paths Madara. listfist + narutopedia'],
  ['naruto-shippuden', 420, 670, 669, '669-670', 70, 'Eight Inner Gates. listfist + narutopedia'],
  ['naruto-shippuden', 421, 672, 671, '671-672', 70, 'Hagoromo grants power. listfist + narutopedia'],
  ['naruto-shippuden', 424, 674, 673, '673-674', 70, 'Six-Paths duo vs Madara. listfist + narutopedia'],
  ['naruto-shippuden', 425, 676, 675, '675-676', 70, 'listfist + narutopedia'],
  ['naruto-shippuden', 426, 677, 677, '677', 70, 'Infinite Tsukuyomi cast; 427-450 dream filler follows — MEDIUM. listfist + narutopedia'],
  ['naruto-shippuden', 451, 678, 677, '677-678 + Itachi Shinden novel v1', 70, 'graft: manga frame around novel — MEDIUM. listfist + narutopedia'],
  ['naruto-shippuden', 458, 679, 678, '678-679 + Itachi Shinden novel v2', 70, 'Kaguya emerges — MEDIUM. listfist + narutopedia'],
  ['naruto-shippuden', 459, 681, 679, '679-681', 71, "Kaguya's emergence; 681 stretches through 462. listfist + narutopedia"],
  ['naruto-shippuden', 463, 683, 681, '681-683', 71, 'forward motion resumes. listfist + narutopedia'],
  ['naruto-shippuden', 470, 685, 684, '684-685', 71, 'canon resumes after 464-469. listfist + narutopedia'],
  ['naruto-shippuden', 471, 686, 686, '686', 71, "Obito's death — MEDIUM. listfist + narutopedia"],
  ['naruto-shippuden', 473, 689, 688, '688-689', 71, "Kakashi's double Mangekyo. listfist + narutopedia"],
  ['naruto-shippuden', 474, 691, 690, '690-691', 72, 'Kaguya sealed; v72 opens 691. listfist + narutopedia'],
  ['naruto-shippuden', 475, 693, 692, '692-693', 72, 'Valley of the End. listfist + narutopedia'],
  ['naruto-shippuden', 476, 696, 694, '694-696 (696 partial)', 72, 'final battle part 1. listfist + narutopedia'],
  ['naruto-shippuden', 477, 698, 696, '696-698', 72, 'final battle conclusion. listfist + narutopedia'],
  ['naruto-shippuden', 478, 699, 698, '698-699 (699 partial)', 72, 'ends mid-699; 479 re-covers → 700 — MEDIUM. listfist + narutopedia'],
  // to-love-ru — verified pin + segment maps (loose display; data stored)
  ['to-love-ru', 1, 1, 1, '1', 1, 'only cleanly mappable 2008 ep — MEDIUM. fandom + Wikipedia'],
  ['to-love-ru', 27, 102, 100, '100-102 (Riko arc)', 12, 'OVA 1. fandom + Wikipedia'],
  ['to-love-ru', 28, 104, 73, '73 + 104 (merged)', 12, 'OVA 2. fandom Siblings + Wikipedia'],
  ['to-love-ru', 30, 98, 93, '93-98 (Trouble Quest)', 12, 'OVA 4. fandom + Wikipedia'],
  ['to-love-ru', 32, 143, 121, '121, 142, 143', 17, 'OVA 6; 143 = furthest pre-Motto point. fandom + Wikipedia'],
  ['to-love-ru', 33, 107, 49, '49; 87-88; 74+107 (merged)', 13, 'Motto e1 (segment titles = chapter titles). fandom + Wikipedia'],
  ['to-love-ru', 34, 146, 54, '146; 54; 76', 17, 'Motto e2. fandom + Wikipedia'],
  ['to-love-ru', 35, 120, 106, '120; 109; 106', 14, 'Motto e3. fandom + Wikipedia'],
  ['to-love-ru', 36, 108, 61, '61; 105; 108', 13, 'Motto e4. fandom + Wikipedia'],
  ['to-love-ru', 37, 137, 81, '81 (+59 scenes); 85; 136-137', 16, 'Motto e5. fandom + Wikipedia'],
  ['to-love-ru', 38, 114, 70, '113-114; 70; 80', 13, 'Motto e6. fandom + Wikipedia'],
  ['to-love-ru', 39, 123, 45, '45; 123; 64 + 65 (partial)', 14, 'Motto e7. fandom + Wikipedia'],
  ['to-love-ru', 40, 156, 43, '115a+156 (merged); 43-44; 139', 18, 'Motto e8. fandom + Wikipedia'],
  ['to-love-ru', 41, 154, 130, '130; 152-153; 154', 18, 'Motto e9. fandom + Wikipedia'],
  ['to-love-ru', 42, 155, 129, '129; 147; 155', 18, 'Motto e10. fandom + Wikipedia'],
  ['to-love-ru', 43, 158, 116, '157; 158; 116-117 + 118 (last part)', 18, 'Motto e11. fandom + Wikipedia'],
  ['to-love-ru', 44, 162, 159, '119+122 (merged opening); 159-162', 18, "VERIFIED pin promoted: Motto finale = ch 162 'Love You!♡' = manga end. fandom I_Love_You + Wikipedia"],
  // we-never-learn-bokuben — verified pin + high-water anchors (loose)
  ['we-never-learn-bokuben', 6, 19, 17, '16 (2nd half), 18, 19', 3, 'ep title = ch 18 title; S1 cumulative 1-19 minus 3/5/17. fandom + Wikipedia title matches'],
  ['we-never-learn-bokuben', 9, 28, 27, '27, 28', 4, 'ep title = ch 28 title. fandom + Wikipedia'],
  ['we-never-learn-bokuben', 12, 43, 35, '35, 42, 43', 6, 'S1 high-water mark. fandom + Wikipedia'],
  ['we-never-learn-bokuben', 15, 56, 44, '54, 56 (heavy skipping)', 7, 'loose high-water — MEDIUM. fandom + Wikipedia'],
  ['we-never-learn-bokuben', 26, 69, 68, "68 + ch-149 graft; carries ch 69's title, resolution anime-original", 8, 'VERIFIED pin promoted: S2 end boundary. fandom + WDTALO + title match'],
  // a-certain-scientific-railgun — arc anchors + graft exception
  ['a-certain-scientific-railgun', 12, 16, 1, '1-16 (Level Upper main story)', 3, "'AIM Burst' ends the Level Upper climax. fandom Level_Upper_Arc + animefillerlist"],
  ['a-certain-scientific-railgun', 14, 17, 17, '17', 3, "ch 17 'Special Workshop' grafted into the original stretch — as-stored. fandom + animefillerlist"],
  ['a-certain-scientific-railgun', 40, 39, 18, '18-39 (Sisters arc complete)', 7, "'Siblings' ends the Sisters arc. fandom Sisters_Arc + Wikipedia + animefillerlist"],
  ['a-certain-scientific-railgun', 63, 70, 43, '43-70 (Daihasei proper)', 10, "'Promise' closes Daihasei (T eps 1-15). fandom + Wikipedia S3"],
  ['a-certain-scientific-railgun', 73, 96, 71, '71-96 (Dream Ranker incl. 73.5)', 13, 'full record on the confirmed anchor; ch 97 = Jailbreaker prologue. fandom + Wikipedia S3'],
  // rosario-vampire — borrow map (loose; pin deleted)
  ['rosario-vampire', 1, 1, 1, '1', 1, 'Moka intro. fandom + Wikipedia'],
  ['rosario-vampire', 2, 2, 2, '2', 1, 'Kurumu. fandom + Wikipedia'],
  ['rosario-vampire', 3, 5, 5, '5', 2, 'Yukari pulled AHEAD of 3-4 — as-stored. fandom + Wikipedia'],
  ['rosario-vampire', 5, 3, 3, '3', 1, 'swim club, aired after ch 5 — as-stored. fandom + Wikipedia'],
  ['rosario-vampire', 6, 4, 4, '4', 1, 'Gin/newspaper club. fandom + Wikipedia'],
  ['rosario-vampire', 7, 19, 18, '18-19', 5, "Mizore pulled forward ~11 chapters (the old pin's ch 19 belongs HERE) — as-stored. fandom Episode_07 + Episode_11 trivia"],
  ['rosario-vampire', 8, 12, 12, '12', 3, 'Ririko — as-stored. fandom + Wikipedia'],
  ['rosario-vampire', 9, 13, 13, '13', 4, 'beach/Ruby. fandom + Wikipedia'],
  ['rosario-vampire', 10, 16, 14, '14-16', 4, "Witch's Knoll 3-into-1, ending altered. fandom + Wikipedia"],
  ['rosario-vampire', 11, 9, 9, '9', 3, 'jumps BACK to v3 — as-stored. fandom + Wikipedia'],
  ['rosario-vampire', 12, 10, 10, '10', 3, 'Keito, roles reversed. fandom + Wikipedia'],
  ['rosario-vampire', 13, 11, 10, '10-11 (loose)', 3, 'Kuyo finale heavily altered — MEDIUM. fandom Kuyō + Chapter_011'],
  ['rosario-vampire', 20, 39, 39, '39 (with Kokoa inserted)', 10, "Capu2 grafts Season I's penultimate chapter — MEDIUM. fandom Capu2_Episode_07"],
  ['rosario-vampire', 24, 38, 37, '37-38 (very loose)', 10, "Lilith's Mirror, instigator plot replaced — MEDIUM. fandom Capu2_Episode_11 + Volume_10"],
  // hunter-x-hunter (1999) — full arc set
  ['hunter-x-hunter', 31, 38, 38, '38', 5, 'Hunter Exam conclusion. hunterpedia + Wikipedia'],
  ['hunter-x-hunter', 36, 43, 43, '43 + 44 p.1-9', 5, 'Zoldyck arc end. hunterpedia + Wikipedia arc split'],
  ['hunter-x-hunter', 44, 63, 59, '59 + 63 (60-62 in eps 41-42)', 7, 'Heavens Arena end, exact vol-7 boundary. hunterpedia + Wikipedia'],
  ['hunter-x-hunter', 62, 101, 98, '98 p.13-19, 99-101 + graft 102 p.16-18', 11, 'TV broadcast finale. hunterpedia + Wikipedia'],
  ['hunter-x-hunter', 70, 119, 118, '118 p.10-15, 119', 13, 'Yorknew OVA end = arc end; 120 opens at 71. hunterpedia + Wikipedia OVA list'],
  ['hunter-x-hunter', 78, 139, 138, '138 (part) + 139', 14, 'GI OVA end, exact vol-14 boundary. hunterpedia + Wikipedia'],
  ['hunter-x-hunter', 92, 185, 183, '183 (part), 184, 185 p.1-11', 18, 'full record on the confirmed continua anchor: GI Final end; ch 186 never adapted. hunterpedia + WDTALO + beebom'],
  // record-of-ragnarok — round boundaries
  ['record-of-ragnarok', 12, 19, 1, '1-19 + ch 20 partial as R4 cold-open', 5, 'S1 finale / Round 3 ends (Kojiro). fandom + WDTALO + mangashed'],
  ['record-of-ragnarok', 17, 30, 20, '20-30 (Round 4 complete)', 8, 'R4 ends (Jack). fandom + List_of_Rounds + Wikipedia'],
  ['record-of-ragnarok', 22, 42, 31, '31-42 + ch 43 partial', 11, 'S2P1 finale / R5 ends (Shiva). fandom + mangashed + Wikipedia'],
  ['record-of-ragnarok', 27, 54, 43, '43-54 + ch 55 tease', 14, 'S2P2 finale / R6 ends (Buddha, 3-3). fandom + WDTALO + Wikipedia'],
  ['record-of-ragnarok', 33, 65, 55, '55-65 + ch 66 partial', 16, 'R7 ends (Qin); ep 28 = recap prologue. fandom + Wikipedia'],
  ['record-of-ragnarok', 38, 77, 66, '66-77 (Round 8 complete)', 19, 'R8 ends (Beelzebub, 4-4). fandom + Wikipedia'],
  // ajin — honest S1 map (S2 typed anime-only-canon; mu@26 deleted)
  ['ajin-demi-human', 1, 1, 1, '1 (minus torture panels)', 1, 'clean pilot. per-ep breakdown + fandom'],
  ['ajin-demi-human', 3, 4, 3, '3, 4 (most) + minor ch-5 pulls', 1, 'manhunt, shuffled — MEDIUM. breakdown + fandom'],
  ['ajin-demi-human', 5, 9, 7, '6 (final scenes), 7, 8 (one scene), 9', 2, 'experiments; assault begins. breakdown + fandom Chapter_9'],
  ['ajin-demi-human', 6, 12, 10, '10-12 + partial 14 pulled forward', 3, 'escape + IBM duel — MEDIUM. breakdown + fandom'],
  ['ajin-demi-human', 13, 21, 13, '≈13-21 compressed + village beats (22-24) + Kō Nakano grafted early', 5, 'REPAIR: honest coverage endpoint (mu@26 was a continue-point misread; S2 anime-original). WDTALO + mangashed + fandom'],
  // platinum-end — verified pin + interiors
  ['platinum-end', 5, 7, 6, '6-7', 3, 'Mukaido joins. fandom + Wikipedia'],
  ['platinum-end', 8, 12, 11, '11-12', 4, 'Saki arc closes vol 4 — MEDIUM. fandom + Viz blurb + Wikipedia'],
  ['platinum-end', 13, 23, 22, '22-23', 7, 'walking duel + Kanade backstory — MEDIUM. fandom + Viz + Wikipedia'],
  ['platinum-end', 14, 27, 24, '24-27', 8, "Metropoliman arc END = '1st Series' boundary (1-27). fandom Story_arcs + Viz + Wikipedia"],
  ['platinum-end', 17, 33, 31, '31 (pp.33-39), 32, 33, 34 (pp.2-9)', 10, 'Shuji/Ogaro reveal (page-level field). fandom + Wikipedia'],
  ['platinum-end', 23, 55, 53, '53-55', 14, "vote resolved (ch 55 'Birth of a God'). fandom + Wikipedia"],
  ['platinum-end', 24, 58, 56, '56-58', 14, 'VERIFIED pin promoted: series end, complete adaptation. fandom + Wikipedia'],
  // hajime-no-ippo — middle-season arc ends
  ['hajime-no-ippo-the-fighting', 84, 340, 337, '337 (p.9)-340', 38, 'Revenge Arc end (Date vs Ricardo II). ippo.fandom + arc page'],
  ['hajime-no-ippo-the-fighting', 88, 354, 351, '351 (p.8)-354', 40, 'Proof of Power end; 89 starts the Hawk arc at 355. fandom + arc page'],
  ['hajime-no-ippo-the-fighting', 102, 420, 416, '416-420 (page-split)', 47, 'NC finale mid-vol 47; NC jumps over 399-414. fandom + forum + WDTALO'],
  ['hajime-no-ippo-the-fighting', 104, 439, 431, '431-439', 49, 'Shimabukuro concludes. fandom + Submarine_Wars_Arc'],
  ['hajime-no-ippo-the-fighting', 115, 502, 497, '497 (p.6)-502', 55, 'Sawamura concludes; 502 = exact vol-55 end. fandom + Dragon_Slayer_Arc'],
  ['hajime-no-ippo-the-fighting', 122, 551, 542, '542 (p.6)-551', 60, 'exact vol-60 end mid-Eagle match; chains into 123→557 — MEDIUM. fandom + Manga_Guide'],
];

// [sid, episode, continue_chapter, why] — verbatim from the script
const CONTINUE: ContinueRow[] = [
  ['bleach', 218, 324, '324 split with ep 219 (batch 12)'],
  ['my-hero-academia', 61, 121, 'ends inside 121 p1-9; 62-63 finish 121-124 (batch 12)'],
  ['welcome-to-demon-school-iruma-kun', 61, 138, 'ends mid-138 (batch 12)'],
  ['welcome-to-demon-school-iruma-kun', 62, 141, '141 deferred to ep 65 — read before 142 for manga order (batch 12)'],
  ['golden-kamuy', 12, 56, 'TV skipped Barato (56-59, OVA 1) + Monster (63-69, OVA 3) before S2 — non-OVA watchers back up to 56 (batch 12)'],
  ['golden-kamuy', 24, 140, 'S2 boundary against the missing seasons (batch 12)'],
  ['naruto-shippuden', 426, 678, '427-450 dream filler — hold at 678 (batch 12)'],
  ['naruto-shippuden', 451, 678, '452-457 novel-only; holds until 458 (batch 12)'],
  ['naruto-shippuden', 463, 684, '464-469 filler between 683 and 684 (batch 12)'],
  ['naruto-shippuden', 476, 696, '696 split across the finale pair (batch 12)'],
  ['naruto-shippuden', 478, 699, 'ends mid-699 (batch 12)'],
  ['to-love-ru', 32, 44, 'OVA coverage = scattered pickup; Motto restarts at 43+ (batch 12)'],
  ['we-never-learn-bokuben', 26, 69, 'read ch 69 ITSELF (anime replaced its resolution) (batch 12)'],
  ['a-certain-scientific-railgun', 12, 17, 'ch 17 aftermath comes as ep 14 graft (batch 12)'],
  ['a-certain-scientific-railgun', 73, 97, '96 confirmed end; 97 = Jailbreaker prologue (batch 12)'],
  ['hunter-x-hunter', 44, 64, 'ep 45 = graft; timeline at 63/64 (batch 12)'],
  ['hunter-x-hunter', 92, 185, 'only 185 p.1-11 adapted — start at 185, not 186 (batch 12)'],
  ['record-of-ragnarok', 12, 20, 'ends mid-20; p.17-31 backfilled in ep 13 (batch 12)'],
  ['record-of-ragnarok', 22, 43, 'ends mid-43 (batch 12)'],
  ['record-of-ragnarok', 27, 55, 'only the 55 tease (batch 12)'],
  ['record-of-ragnarok', 33, 66, '66 partial; rest in ep 34 (batch 12)'],
  ['ajin-demi-human', 13, 22, 'canon resumes at 22 where the split begins (batch 12)'],
  ['platinum-end', 17, 34, 'only pp.2-9 of 34 (batch 12)'],
  ['hajime-no-ippo-the-fighting', 102, 421, 'NC resume = 421; skipped 399-414 still behind (batch 12)'],
];

// [sid, episodes, kind, chapters|null, note] — verbatim from the script
const ANNOTATIONS: AnnotationRow[] = [
  ['bleach', [218, 219], 'partial', '324', 'split across the boundary'],
  ['my-hero-academia', [39], 'partial', '49.5 (partial) + recap', 'recap ep with anime-original pool scene'],
  ['my-hero-academia', [58], 'graft', null, "'Save the World with Love!' — Two Heroes tie-in; adapts nothing"],
  ['my-hero-academia', [60, 62], 'rearranged', '113-122', 'ch 115 aired out of order (60 pulls p15-17 forward; 62 goes back for p1-14)'],
  ['welcome-to-demon-school-iruma-kun', [50], 'graft', '90', 'grafts ch 90 (skipped in S2) before 106-108'],
  ['welcome-to-demon-school-iruma-kun', [63, 64, 65], 'rearranged', '141-147', 'tail out of order (63 = 142+145; 65 = 141+146+147 partial)'],
  ['yu-yu-hakusho-ghostfiles', [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91], 'partial', '113-149', '~1.5 ch/ep — nearly every ep ends mid-chapter; anchors sit at clean completions'],
  ['golden-kamuy', [12], 'graft', '55-62 (+partial 56)', 'finale stitches three arc openings; bulk offloaded to OVAs'],
  ['golden-kamuy', [13, 14, 15, 16, 17, 18, 19], 'rearranged', '70-114', 'S2 front reordered/compressed; arcs split with OVAs 2/4/5 — anchor at 21'],
  ['naruto-shippuden', [451, 452, 453, 454, 455, 456, 457, 458], 'graft', '677-679 + Itachi Shinden novels', 'novel adaptation grafted; 452-457 novel-only'],
  ['naruto-shippuden', [459, 460, 461, 462], 'rearranged', '679-681', 'ch 681 stretched across four eps'],
  ['to-love-ru', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], 'divergence', '~1-42 motifs only', '2008 series heavily anime-original with reordering'],
  ['to-love-ru', [29], 'divergence', null, 'OVA 3 anime-original resort story'],
  ['to-love-ru', [31], 'graft', '141 (first scene only)', 'OVA 5 uses only the opening; different plot'],
  ['to-love-ru', [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43], 'rearranged', '43-158 scattered', 'Motto = 3 segments/ep in mostly random order; anchor = max touched'],
  ['we-never-learn-bokuben', [18, 19, 20, 21, 22, 23], 'rearranged', '61, 63, 75-76, 78-81, 83, 85-89', 'vol 9-11 material aired before the festival arc'],
  ['we-never-learn-bokuben', [24, 25, 26], 'rearranged', '64-68', 'festival arc moved to close the season'],
  ['we-never-learn-bokuben', [26], 'graft', '149', 'vol-17 route scene grafted into the ending'],
  ['a-certain-scientific-railgun', [25], 'partial', '~18 setup', 'S e1 mostly original re-intro; arc proper begins ep 26'],
  ['a-certain-scientific-railgun', [32, 33, 34, 35, 36, 37, 38, 39], 'rearranged', '27-39 + Index-side material', 'Sisters climax retold from Mikoto side'],
  ['a-certain-scientific-railgun', [49], 'partial', '40-42', 'vol-7 intermission compressed into Daihasei setup'],
  ['rosario-vampire', [4], 'divergence', null, 'anime-only (Moka fan club)'],
  ['rosario-vampire', [14], 'graft', 'Season II vol 1 (S2 chs 1-4, SEPARATE numbering)', "Kokoa's intro = only S2 material; cross-scheme, annotation-only"],
  ['rosario-vampire', [15, 16, 17, 18, 19], 'divergence', null, 'anime-original block'],
  ['rosario-vampire', [21, 23, 26], 'divergence', null, 'anime-exclusive eps incl. the original finale'],
  ['rosario-vampire', [22], 'divergence', 'premise ≈ S2 chs 10-12 only', 'shares only the destination with the Snow Oracle arc'],
  ['hunter-x-hunter', [1, 31], 'divergence', '1-38', '1999 stretches 38 chs across 31 eps with substantial original Exam content'],
  ['hunter-x-hunter', [41, 42, 43, 44], 'rearranged', '53-63', 'Arena climax reordered'],
  ['hunter-x-hunter', [45], 'graft', '83 p.4-11, 16-18', 'Kurapika flashback grafted forward with original training'],
  ['record-of-ragnarok', [12, 13], 'rearranged', '20, 24', 'ch 20 split across the season boundary; ch-24 backstory pulled forward'],
  ['record-of-ragnarok', [28], 'partial', '54-55', 'S3 opener largely recap; ep 29 re-covers'],
  ['record-of-ragnarok', [42], 'graft', 'B5, 84-85', 'Bonus ch 5 grafted; R10 setup deferred to S4'],
  ['ajin-demi-human', [12, 13], 'graft', '22-24 + later-manga material', 'village arc compressed into S1 end; Kō Nakano introduced early'],
  ['ajin-demi-human', [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], 'divergence', '~25-38 loosely, then none', 'S2 anime-original with non-canon ending; manga runs Third Wave through vol 17'],
  ['platinum-end', [15, 16, 17, 18, 19, 20, 21, 22, 23, 24], 'partial', '28-58', 'second half condensed (~3.1 ch/ep)'],
  ['hajime-no-ippo-the-fighting', [101, 102], 'rearranged', '400-414', 'Post-War Arc skipped; adapted out of order as the final eps 124-127'],
  ['hajime-no-ippo-the-fighting', [103], 'graft', '418-419 + 425-430 + 503-504', 'Rising opener stitches recap + restart + flash-forward'],
  ['hajime-no-ippo-the-fighting', [124, 125, 126, 127], 'rearranged', '400-414', 'series-ending block = the earlier Post-War Arc — resume after 127 = 558'],
  ['hajime-no-ippo-the-fighting', [76], 'graft', '383 (2-page gag only)', "'Boxer's Fist' DVD special adapts only a gag — no anchor"],
];

// ---- the §12.45 as-stored sweep, keyed sid#ep → outcome
const RAILGUN = 'a-certain-scientific-railgun';
const ROSARIO = 'rosario-vampire';
const IRUMA = 'welcome-to-demon-school-iruma-kun';
const LAUNDERED = `CAVEAT (§12.45 / DRIFT-LIST): this row was marked 'as-stored' — confirmation-laundering: the verifier found the ep-12→14 ch-17 graft claim factually false; an inherited stored value was blessed with an invented rationale. Not researched data.`;
const AS_STORED_SWEEP: Record<string, { reason: string; retiresWhen: string }> = {
  [`${RAILGUN}#14`]: { reason: LAUNDERED, retiresWhen: 'OVERTAKEN — refuted §12.45 (railgun ep 14 confirmation-laundering; ep-12 continue note still repeats the refuted graft claim — cleanup pending)' },
  [`${ROSARIO}#11`]: { reason: "CAVEAT (§12.45 as-stored sweep): REPAIRED 9→8/v2 — the wiki is off-by-one from ep 11 (new source trap); the 'as-stored' 9 was a laundered inherited value.", retiresWhen: 'repaired §12.45 (rosario ep 11 9→8)' },
  [`${ROSARIO}#3`]: { reason: 'as-stored row re-checked in the §12.45 sweep: CONFIRMED.', retiresWhen: '' },
  [`${ROSARIO}#5`]: { reason: 'as-stored row re-checked in the §12.45 sweep: CONFIRMED.', retiresWhen: '' },
  [`${ROSARIO}#7`]: { reason: 'as-stored row re-checked in the §12.45 sweep: CONFIRMED.', retiresWhen: '' },
  [`${ROSARIO}#8`]: { reason: 'as-stored row re-checked in the §12.45 sweep: CONFIRMED.', retiresWhen: '' },
  [`${IRUMA}#63`]: { reason: 'as-stored row re-checked in the §12.45 sweep: CONFIRMED as stored; OPEN FOR SEAN — END convention (142 stored vs 145 = max adapted; A8 running-order vs A4 coverage).', retiresWhen: "Sean's iruma ep-63 END-convention ruling (§12.45 OPEN)" },
  [`${IRUMA}#64`]: { reason: 'as-stored row re-checked in the §12.45 sweep: CONFIRMED.', retiresWhen: '' },
  [`${ROSARIO}#12`]: { reason: 'medium-confidence repair HELD for Sean (§12.45).', retiresWhen: "Sean rules on the held rosario 12/13 repairs (§12.45 OPEN)" },
  [`${ROSARIO}#13`]: { reason: 'medium-confidence repair HELD for Sean (§12.45).', retiresWhen: "Sean rules on the held rosario 12/13 repairs (§12.45 OPEN)" },
  [`${RAILGUN}#63`]: { reason: 'start REPAIRED 43→68 in batch 14 (§12.34).', retiresWhen: 'OVERTAKEN — start repaired 43→68 (batch 14, §12.34)' },
  ['ajin-demi-human#13']: { reason: 'start/chapters_adapted REPAIRED in batch 15 (REPAIRS_APPROVED).', retiresWhen: 'OVERTAKEN — start/chapters_adapted repaired in batch 15' },
};

// ---- entry builders
const anchorEntry = ([sid, ep, ch, start, adapted, vol, note]: AnchorRow): RulingEntry => {
  const e: RulingEntry = {
    seriesId: sid,
    // a REPAIR replaces an MU derivation with an exact record → A14; otherwise a full-record anchor → A3
    ruleId: note.startsWith('REPAIR') ? 'A14' : 'A3',
    value: { episode: ep, chapter: ch, start_chapter: start, chapters_adapted: adapted, volume: vol, source: 'manual', note: `${B}: ${note}` },
    reason: note,
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite(sid),
  };
  const sweep = AS_STORED_SWEEP[`${sid}#${ep}`];
  if (sweep) {
    e.reason = `${note} — ${sweep.reason}`;
    e.cite = cite(sid, SWEEP);
    if (sweep.retiresWhen) e.retiresWhen = sweep.retiresWhen;
  }
  return e;
};

const continueEntry = ([sid, ep, cont, why]: ContinueRow): RulingEntry => {
  const anchor = ANCHORS.find((a) => a[0] === sid && a[1] === ep);
  const end = anchor?.[2] ?? null;
  // continue = END (mid-chapter) → C1; continue below covered chapters (a skip note) → C3; else parity → C2
  const ruleId = end != null && cont === end ? 'C1' : end != null && cont < end ? 'C3' : 'C2';
  const e: RulingEntry = { seriesId: sid, ruleId, value: { episode: ep, continue_chapter: cont }, reason: why, ruledBy: 'session', ruledOn: RULED_ON, cite: cite(sid) };
  if (sid === RAILGUN && ep === 12) {
    e.reason = `${why} — CAVEAT (§12.45): this note repeats the REFUTED ep-14 ch-17 graft claim (confirmation-laundering); cleanup pending.`;
    e.cite = cite(sid, SWEEP);
    e.retiresWhen = 'OVERTAKEN — the ep-14 graft claim was refuted §12.45; this continue note must be re-reasoned';
  }
  return e;
};

const annotationEntry = ([sid, eps, kind, chapters, note]: AnnotationRow): RulingEntry => ({
  seriesId: sid, ruleId: 'A43',
  value: { episodes: eps, kind, chapters, note: `${B}: ${note}` },
  reason: note,
  ruledBy: 'session', ruledOn: RULED_ON, cite: cite(sid),
});

const range = (a: number, b: number, t: string): Record<number, string> => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, t]));

export const ENTRIES: RulingEntry[] = [
  // ---- deletions: misattached MU pins being replaced by rulings (not upserts)
  {
    seriesId: ROSARIO, ruleId: 'A14',
    value: { table: 'chapter_anchors', op: 'delete', episode: 26, source: 'mu' },
    reason: "rosario ep 26 ch-19 REJECTED — Wikipedia's series-summary line was stamped onto the last episode (new failure mode); ch 19 actually aired as ep 7 (exact record outranks the derivation). Series ruled loose; ep 26 is anime-exclusive (divergence annotation).",
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite(ROSARIO),
  },
  {
    seriesId: 'ajin-demi-human', ruleId: 'A6',
    value: { table: 'chapter_anchors', op: 'delete', episode: 26, source: 'mu' },
    reason: 'ajin ep 26 ch-22 was a CONTINUE point misread as an endpoint; S2 (14-26) is anime-original and typed anime-only-canon this batch — an A1 hit triaged to deletion; the honest end is ep 13 → 21/v5 (REPAIR anchor).',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite('ajin-demi-human'),
  },

  // ---- anchors (124), continue points (24), annotation groups (39)
  ...ANCHORS.map(anchorEntry),
  ...CONTINUE.map(continueEntry),
  ...ANNOTATIONS.map(annotationEntry),
  {
    seriesId: '*', ruleId: 'A43',
    value: { table: 'series', asterisk_review: 'pending', where: 'asterisk_review IS NULL', on: 'every series that received an annotation in this batch' },
    reason: 'annotations are first-class and asterisk review is a queue — each annotated series enters the review queue (absent-only).',
    ruledBy: 'session', ruledOn: RULED_ON, cite: [SCRIPT, LOG],
  },

  // ---- one-time retypes for the EPISODE_TYPE_OVERRIDES entries added this batch (the standing ruling lives in the override map)
  {
    seriesId: RAILGUN, ruleId: 'T6',
    value: { table: 'episodes', type: { ...range(13, 13, 'anime-only-canon'), ...range(15, 24, 'anime-only-canon'), ...range(41, 48, 'anime-only-canon') } },
    reason: "railgun: S1 back half (Big Spider/Poltergeist) + S's Silent Party are anime-original (director-confirmed; animefillerlist + fandom arc pages + Wikipedia). Ep 14 EXCEPTED from the retype because it 'grafts manga ch 17' — CAVEAT (§12.45): that graft claim is the refuted as-stored laundering; the ep-14 exception rests on it. Applied once here; the standing ruling is the EPISODE_TYPE_OVERRIDES entry.",
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite(RAILGUN, 'scripts/ingest/lib/resolve.ts EPISODE_TYPE_OVERRIDES a-certain-scientific-railgun', SWEEP),
    retiresWhen: 'the ep-14 exception is re-ruled after the §12.45 refutation (railgun ep 14 confirmation-laundering)',
  },
  {
    seriesId: 'ajin-demi-human', ruleId: 'T6',
    value: { table: 'episodes', type: range(14, 26, 'anime-only-canon') },
    reason: 'ajin S2 (14-26) is anime-original from the start with a non-canon ending (WDTALO + mangashed + per-episode breakdown); canon resumes at manga ch 22. Applied once here; the standing ruling is the EPISODE_TYPE_OVERRIDES entry.',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite('ajin-demi-human', 'scripts/ingest/lib/resolve.ts EPISODE_TYPE_OVERRIDES ajin-demi-human'),
    retiresWhen: 'OVERTAKEN 2026-08-26 — batch 18 wave 2: ajin S2 14-22 adapt ch 23-42 (canon/mixed), only 23-26 are the studio ending (filler + divergence); the season-level premise was wrong (DRIFT-LIST A-7: ajin "non-canon ending" → anime-only-canon was one of three competing types)',
  },

  // ---- loose rulings (research-recommended; anchors stored regardless as borrow-maps)
  {
    seriesId: 'to-love-ru', ruleId: 'A40',
    value: { table: 'series', mapping_mode: 'loose' },
    reason: 'the 2008 series is heavily anime-original with reordering and Motto airs 3 segments/ep in mostly random order — anchors are borrow-maps (anchor = max touched), so loose.',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite('to-love-ru'),
  },
  {
    seriesId: 'we-never-learn-bokuben', ruleId: 'A40',
    value: { table: 'series', mapping_mode: 'loose' },
    reason: 'heavy skipping and vol 9-11 material aired before the festival arc; anchors are high-water marks, not a monotone map — loose.',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite('we-never-learn-bokuben'),
  },
  {
    seriesId: ROSARIO, ruleId: 'A40',
    value: { table: 'series', mapping_mode: 'loose' },
    reason: 'S1 is a chapter borrow-map (5 before 3-4, Mizore pulled forward ~11 chapters, back-jump to v3) and Capu2 is mostly anime-exclusive — loose; the rejected ch-19 pin deleted.',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite(ROSARIO),
  },

  // ---- ippo order-only records WITH adaptation spans (full-record rule on non-numbered components)
  {
    seriesId: 'hajime-no-ippo-the-fighting', ruleId: 'N4',
    value: { table: 'ingest_fractionals', position: 76.3, source: 'ruling', title: 'Mashiba vs Kimura (OVA)', disposition: 'order_only', note: 'Adapts chs 270-289 (vols 31-33, Kimura vs Mashiba JBC Jr. lightweight). Manga order = OVA then Champion Road. Research batch 12.' },
    reason: 'the OVA is not community-numbered → order-only at fractional position 76.3, but it adapts chs 270-289 so the record carries its span (full-record rule, N33).',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite('hajime-no-ippo-the-fighting'),
  },
  {
    seriesId: 'hajime-no-ippo-the-fighting', ruleId: 'N4',
    value: { table: 'ingest_fractionals', position: 76.6, source: 'ruling', title: 'Champion Road (TV film)', disposition: 'order_only', note: 'Adapts chs 291-313 (vols 33-35, Ippo vs Sanada); NC ep 77 resumes at ch 315. Research batch 12.' },
    reason: 'the TV film is not community-numbered → order-only at 76.6 (after the OVA, manga order), carrying its adapted span 291-313; NC ep 77 resumes at 315.',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite('hajime-no-ippo-the-fighting'),
  },

  // ---- flags (fileFlagOnce)
  {
    seriesId: 'golden-kamuy', ruleId: 'I24',
    value: { flag: 'count_mismatch', source: 'resolve', note: 'S3 (eps 25-36, ch ~140-200), S4 (37-49, ~201-273), S5 (50-62, Jan-Mar 2026, FINISHES the manga at 314) missing from our 24-ep entry; the old MU ch-302 pin was Season-5 material. Five OVAs carry TV-skipped canon (spans in batch-12 record). Stitch on AniList recovery.' },
    reason: 'the MU ch-302 pin was a SEASON-FIVE pin on our 24-ep entry; S3-S5 (38 eps finishing the manga) are missing → stitch candidacy (stitch flag #7).',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite('golden-kamuy'),
  },
  {
    seriesId: RAILGUN, ruleId: 'G41',
    value: { flag: 'count_mismatch', source: 'resolve', note: 'Railgun manga CONCLUDED 2026-03-27 (19-year run) — our ongoing/180-ch data is stale; expect source totals to land. 4th Season announced, unaired (null-span comp correct).' },
    reason: 'manga status cross-check: the manga concluded 2026-03 while our data says ongoing — flagged as a stale-ongoing watch, never auto-applied.',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite(RAILGUN),
  },
];
