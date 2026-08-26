// Applied rulings — research batch 11 (item-4 batch 6, 2026-08-23; §12.30).
// Extracted from scripts/ingest/apply-research-batch-11.ts (the cited record;
// NOT modified). One entry per curated decision. Verdict JSONs lived in the
// session scratchpad (batch11/<sid>.json) and are not on disk.
//
// ruledBy: "agent-verified 2+ sources"; no decision is attributed to Sean in
// the script, so every entry is 'session'.
//
// The generic aired-count healer (the YYH class) is recorded ONCE with
// seriesId '*' — its mechanism lives only in this script and belongs in lib
// (T2 dedupe target).

import type { RulingEntry } from '../types';

const RULED_ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-research-batch-11.ts';
const LOG = 'docs/changelog.md §12.30';
const B = 'research-tier batch 11 (2026-08-23, agent-verified 2+ sources, full-record)';
const cite = (sid: string, ...extra: string[]) => [SCRIPT, `scratchpad batch11/${sid}.json (session scratchpad, not on disk)`, LOG, ...extra];

type AnchorRow = [string, number, number, number | null, string | null, number | null, string];
type ContinueRow = [string, number, number, string];
type AnnotationRow = [string, number[], string, string | null, string];

// [sid, ep, endCh, startCh|null, chaptersAdapted|null, vol|null, note] — verbatim from the script
const ANCHORS: AnchorRow[] = [
  // bleach — Lost Agent / Fullbring
  ['bleach', 343, 425, 424, '424-425', 49, 'Lost Agent opener, 17-month timeskip. animestoryguide + animefillerguide + fandom'],
  ['bleach', 348, 436, 434, '434-436', 50, "Ichigo's resolve/badge. animestoryguide + animefillerguide"],
  ['bleach', 354, 448, 447, '447-448', 51, 'Ichigo vs Ginjo in game space; last canon before filler 355. 2 sources'],
  ['bleach', 356, 451, 449, '449-451', 52, 'canon resumes after ep 355; 451 opens vol 52. 2 sources'],
  ['bleach', 360, 458, 456, '456-458', 52, 'Ichigo vs Uryu. 2 sources'],
  ['bleach', 365, 476, 473, '470, 473-476', 54, 'pulls ch-470 flashback out of order; 476 finishes in the finale (→479). 2 sources'],
  // naruto-shippuden — Itachi Pursuit / Jiraiya / Sasuke vs Itachi
  ['naruto-shippuden', 118, 352, 351, '351-352', 39, 'Hebi/Taka formed. narutopedia + listfist'],
  ['naruto-shippuden', 126, 367, 365, '365-367', 40, 'Itachi Pursuit Mission arc end. narutopedia + listfist'],
  ['naruto-shippuden', 133, 383, 381, '381-383 (narutopedia adds 380)', 42, "Jiraiya's death; END 383 agreed. narutopedia + listfist"],
  ['naruto-shippuden', 138, 393, 391, '391-393', 43, "Itachi's death. narutopedia + listfist"],
  ['naruto-shippuden', 141, 402, 400, '400-402', 43, 'Itachi-truth complete; lands on vol-43 end (390-402). narutopedia + listfist'],
  // cells-at-work — ep 21 REPAIR
  ['cells-at-work', 1, 1, 1, '1', 1, '1:1 title match. cellsatwork.fandom + Wikipedia'],
  ['cells-at-work', 6, 8, 7, '7, 8', 2, 'only S1 double-chapter ep. fandom + Wikipedia title match'],
  ['cells-at-work', 13, 18, 18, '18', 4, 'S1 END (S1 map: 1,4,3,5,2,7-8,9,10,12,15,6,17,18). fandom + Wikipedia'],
  ['cells-at-work', 14, 26, 26, '26', 6, 'S2 opener JUMPS to vol-6 ch 26 then returns to vols 3-5 (non-monotonic by ruling). fandom + Chapter_26'],
  ['cells-at-work', 17, 21, 20, '20, 21 (start)', 5, 'double-chapter; 21 spans 17-18. fandom Chapter_20/21 + Wikipedia'],
  ['cells-at-work', 21, 25, 25, '25', 5, "REPAIR: replaces MU ch-30 pin (counted the Special; vol 6 unanimated except ch 26 = ep 14). Series end = ch 25 'Cancer Cell II'. fandom Chapter_25 + WDTALO"],
  // shangri-la-frontier — pin verified + interiors
  ['shangri-la-frontier', 25, 58, 57, '57-58', 7, 'S1 finale; S1 = 1-58 (not ~70). fandom + animefillerguide + mangashed'],
  ['shangri-la-frontier', 30, 70, 67, '67-70', 8, 'Nephilim Hollow climax. fandom + animefillerguide'],
  ['shangri-la-frontier', 35, 82, 81, '81-82', 9, 'before the Wethermon-rematch 5-parter. fandom + animefillerguide'],
  ['shangri-la-frontier', 40, 96, 94, '94-96', 11, 'Lamplight of Ambition Part 5 — Wethermon/Setsuna concludes. both exact'],
  ['shangri-la-frontier', 45, 110, 107, '107-110', 12, "'Time to Fillet a Dragon Fish'. both exact"],
  ['shangri-la-frontier', 50, 126, 124, '124-126', 14, 'VERIFIED continua pin promoted; S2 finale, continue 127; S3 Jan 2027. 3 sources'],
  // my-hero-academia — Season 5 (the MVA reversal)
  ['my-hero-academia', 90, 193, 191, '191 (p1-8, 11-15), 192, 193', 21, "Pro Hero epilogue ends ch 193 'Vestiges' = ep title. fandom + Wikipedia"],
  ['my-hero-academia', 96, 206, 204, '204 (p4-15), 205, 206', 22, "ch 206 'Match 3 Conclusion' = ep title. fandom + Wikipedia"],
  ['my-hero-academia', 100, 219, 217, '216 (p11-13), 217, 218+219 fragments', 23, 'Joint Training ends 217 (title match); MVA fragments grafted. fandom + Wikipedia'],
  ['my-hero-academia', 101, 242, 241, '241, 242', 25, 'Endeavor Agency opens at 241, aired BEFORE MVA; ch 242 title = ep title. fandom + Wikipedia S5'],
  ['my-hero-academia', 106, 252, 250, '250, 251, 252', 26, "Endeavor Agency ends ch 252 'The Unforgiven' = ep title. fandom + Wikipedia"],
  ['my-hero-academia', 112, 240, 237, '237, 238, 239, 240 (p1-11, 14-15)', 25, 'MVA ends 240 (aired after 241-255 — non-monotonic by ruling); ch 237 title = ep title. fandom + Wikipedia'],
  // blood-blockade-battlefront — pin verified + loose
  ['blood-blockade-battlefront', 12, 14, 1, 'S1 out of order: 1 (+2-3 elem.), 4, 5, 6, 8, 11, 9, 12, 13, 14; 11-12 anime-original', 6, 'S1 soft ceiling. WDTALO + Wikipedia title matches'],
  ['blood-blockade-battlefront', 22, 25, 25, '25', 9, 'first honest monotone point in S2. fandom Episode_22 + Wikipedia'],
  ['blood-blockade-battlefront', 23, 28, 26, '26-28', 10, 'final arc part 1; re-covers ch 26 first half from ep 18. fandom + Wikipedia'],
  ['blood-blockade-battlefront', 24, 30, 29, '29-30', 10, 'VERIFIED pin promoted: series end = ch 30/v10. fandom + Wikipedia + WDTALO'],
  // gto — ep 42 REPAIR
  ['gto-great-teacher-onizuka', 2, 11, 7, '7-11 (eps 1-2 = 1-11)', 2, 'Nanako arc end; hired. fandom Lesson_2 + Wikipedia'],
  ['gto-great-teacher-onizuka', 11, 36, 34, '34-36', 5, 'Tomoko pageant end. fandom + Wikipedia'],
  ['gto-great-teacher-onizuka', 19, 66, 64, '64-66', 8, 'Urumi arc resolved (ch 66 title match). fandom + Wikipedia'],
  ['gto-great-teacher-onizuka', 33, 92, 87, '87-92', 11, "trip/kidnapping block closes vol 11 ('Sayonara Onizuka!') — MEDIUM (vols 9-11 sanitized). fandom + Wikipedia"],
  ['gto-great-teacher-onizuka', 41, 105, 102, '102-105', 13, "REPAIR: true endpoint (mu@42 deleted — ep 42 adapts NO manga). Confession = 103-105 'LOVE LOVE LOVE'. fandom Lesson_41 + WDTALO + mangashed"],
  // welcome-to-demon-school-iruma-kun — S2 interiors
  ['welcome-to-demon-school-iruma-kun', 25, 48, 46, '46-48', 6, "Ameri's Decision. fandom + animefillerguide"],
  ['welcome-to-demon-school-iruma-kun', 27, 53, 51, '51 (p.4-19) + 52-53', 7, 'Ameri thread closes; 53 opens vol 7. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 31, 60, 59, '59-60', 7, 'Royal One payoff. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 34, 67, 66, '66-67', 8, 'double-segment broadcast ep. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 40, 85, 82, '82 (p.3-20) + 83-85', 10, 'Walter Park climax. fandom + animefillerguide'],
  ['welcome-to-demon-school-iruma-kun', 42, 89, 89, '89 (p.4-20, one chapter expanded)', 11, "Clara's House; 90-91 skipped, ep 43 jumps to 94. fandom + animefillerguide"],
  // yu-yu-hakusho — ep 112 REPAIR (pin off the phantom Picture Drama row)
  ['yu-yu-hakusho-ghostfiles', 25, 50, 49, '49 (2nd half)-50', 6, 'Spirit Detective TV end; ch 51 slides into ep 26. fandom + Wikipedia + saga page'],
  ['yu-yu-hakusho-ghostfiles', 44, 78, 77, '77-78', 9, 'mid-Dark Tournament clean boundary — MEDIUM. fandom + Wikipedia'],
  ['yu-yu-hakusho-ghostfiles', 66, 112, 112, '112', 13, 'Dark Tournament end (52-112). fandom + saga + Wikipedia'],
  ['yu-yu-hakusho-ghostfiles', 94, 153, 153, '153', 17, 'Chapter Black end (113-153). fandom + saga + Wikipedia'],
  ['yu-yu-hakusho-ghostfiles', 105, 168, 166, '166-168', 19, 'Demon World Tournament prelims — last tight correspondence — MEDIUM. fandom + Wikipedia'],
  ['yu-yu-hakusho-ghostfiles', 112, 175, 170, '170 + 172 + 175 (graft; 171/173-174 not on TV)', 19, "REPAIR: re-pins MU end from phantom ep 113. Finale reaches ch 175 'And So...'. fandom Episode_112 + Wikipedia"],
  // inuyasha — pin verified + Final Act interiors
  ['inuyasha', 167, 356, 351, '351-356', 36, "original-series finale = ch 356 (not 355). fandom + WDTALO + Chapter_356"],
  ['inuyasha', 172, 438, 425, '409, 438-439, 416, 418-420, 403, 401, 399, 425-431 (non-linear)', 44, 'closes the rearranged FA-opening zone — MEDIUM. fandom + chapter crosslink'],
  ['inuyasha', 173, 448, 439, '439-448', 45, 'Moryomaru concludes. fandom + Chapter_448'],
  ['inuyasha', 175, 465, 459, '459-465', 47, "Kikyo's final death = ch 465 'Light'. fandom + tumblr explicit match + Chapter_465"],
  ['inuyasha', 180, 493, 488, '488-493', 50, 'Mount Meidou payoff; 494 deferred (straight reading still correct). fandom + Chapter_493'],
  ['inuyasha', 187, 529, 525, '525-529', 54, "ch 529 'The Jewel Completed'. fandom + Chapter_529"],
  ['inuyasha', 190, 544, 540, '540-544', 55, "inside-Naraku ends ch 544 'Core'. fandom + Chapter_544"],
  ['inuyasha', 192, 555, 550, '550-555', 56, "Naraku's end + well closes = ch 555. fandom + Chapter_555"],
  ['inuyasha', 193, 558, 556, '556-558', 56, "VERIFIED pin promoted: finale = ch 558 'Tomorrow'. fandom + Chapter_558 + Wikipedia"],
  // boruto — Code's Assault full record (replaces the bare 293 anchor)
  ['boruto-naruto-next-generations', 287, 56, 56, '56 (+start of 57; ch-55 recap; ch-60 bit)', 15, "Code's Assault opens. narutopedia + animefillerguide + arc page"],
  ['boruto-naruto-next-generations', 288, 58, 57, '57-58', 15, "'Captives' — Eida. both sources"],
  ['boruto-naruto-next-generations', 289, 60, 59, '59-60', 16, 'v15 ends 59; 60 opens v16. both sources'],
  ['boruto-naruto-next-generations', 290, 62, 61, '61-63 (63 partial)', 16, "'Presence'. both sources"],
  ['boruto-naruto-next-generations', 291, 64, 63, '63-65 (65 partial)', 17, "'Control' = ch 64 title (v17 opener). both sources"],
  ['boruto-naruto-next-generations', 292, 66, 65, '65-66', 17, "Kawaki kills Boruto (ch 66 'Do or Die'). both sources"],
  ['boruto-naruto-next-generations', 293, 67, 67, '67 (+grafted scenes from 68, 70)', 17, "Part 1 finale = ch 67 'Rift' (reconfirms anchor); grafts = epilogue hook, continue 68. narutopedia + animefillerguide"],
  // ranking-of-kings — pin verified + interiors
  ['ranking-of-kings', 1, 5, 1, '1-5 (start of 5) + grafted Bebin/Kage from 8-9; Domas 3-4 cut', 1, 'fandom Episode_1 trivia explicit + Chapter_8 match'],
  ['ranking-of-kings', 2, 13, 6, '~6-13 (Kage backstory 11-13; deathbed ch 8 rearranged)', 1, 'END = vol-1 boundary — MEDIUM. fandom + Volume_1'],
  ['ranking-of-kings', 11, 68, 63, '~63-68', 5, 'training complete, coups erupt; ±2 — MEDIUM. Volume_5/6 blurbs + review'],
  ['ranking-of-kings', 18, 117, 106, '~106-117', 9, 'Bojji vs Ouken + Bosse/Miranjo past = vol 9; ±2 — MEDIUM. Volume_9 + sportskeeda'],
  ['ranking-of-kings', 20, 143, 131, '~131-143', 11, 'Miranjo backstory + Bosse vs Ouken; ±2 — MEDIUM. Volume_11 + sportskeeda'],
  ['ranking-of-kings', 23, 155, 150, '~150-155', 12, 'VERIFIED continua pin promoted: finale = end of Part 1 (ja.wikipedia: vol 12 ch 155); single numbering, no ch-121 variant. ja.wikipedia + WDTALO + Volume_13'],
  // bleach-thousand-year-blood-war — Part 3 interiors
  ['bleach-thousand-year-blood-war', 27, 611, 610, '608 (pp.14-17 overlap), 609-611 + Kubo-original Royal Guard material', 67, 'ends vol 67 exactly. fandom + sportskeeda + ANN'],
  ['bleach-thousand-year-blood-war', 30, 620, 617, '617 (pp.8-9), 618-620 + 625 p.17', 68, "Uryu's betrayal; 613-614 backfill in ep 31. fandom + reviews"],
  ['bleach-thousand-year-blood-war', 31, 624, 621, '612-614 flashback pages + 621-624', 69, 'Aizen freed; everything through 624 covered. fandom + sportskeeda + oricon'],
  ['bleach-thousand-year-blood-war', 32, 628, 625, '625-628 + fragments', 69, 'Wahrwelt created. fandom + sportskeeda'],
  ['bleach-thousand-year-blood-war', 34, 639, 635, '635 (pp.13-17), 636-639', 70, 'Mayuri vs Pernida begins; Friend block 630-634 deferred. fandom + sportskeeda'],
  ['bleach-thousand-year-blood-war', 37, 654, 649, '649 (pp.15-17), 650-654 (pp.1-5)', 72, 'Kyoraku+Nanao defeat Lille. fandom + fandompost + thegeekiary'],
  // summer-time-rendering — pin verified + vol-exact interiors
  ['summer-time-rendering', 1, 1, 1, '1', 1, 'premiere = the 72-page ch 1 near-1:1. fandom + JP page table'],
  ['summer-time-rendering', 5, 20, 16, '16-20', 2, 'exact vol-2 boundary. fandom + JP table'],
  ['summer-time-rendering', 7, 31, 27, '27-31', 3, 'exact vol-3 boundary. fandom + JP table'],
  ['summer-time-rendering', 12, 63, 58, '58-63', 6, "'Bloody Night' climax; exact vol-6 boundary. fandom + JP table"],
  ['summer-time-rendering', 19, 106, 100, '100-106', 10, 'exact vol-10 boundary. fandom + JP table'],
  ['summer-time-rendering', 25, 139, 138, '138 (final pages) + 139 + original epilogue', 13, 'VERIFIED pin promoted: complete adaptation, finale = final chapter. fandom + JP table + Wikipedia + MAL'],
  // kamisama-kiss — pin verified (KEEP) + boundaries
  ['kamisama-kiss', 13, 30, 1, '1-30 (vols 1-5) reordered; finale = 26-30', 5, 'S1 end; ch 31 opens the S2 Izumo arc. mangashed + fandom content match'],
  ['kamisama-kiss', 25, 64, 31, '31-64 (vols 6-11) compressed', 11, 'S2 end; both leave-off sites give 64. WDTALO + mangashed'],
  ['kamisama-kiss', 26, 85, 80, '80-85 (vol 14)', 14, 'Kako-hen OAD 1 — first time-leap — MEDIUM. fandom beat-match + Wikipedia'],
  ['kamisama-kiss', 29, 101, 96, '96-101 (vol 17)', 17, 'Kako-hen OAD 4 — past arc resolved — MEDIUM. Wikipedia + mangashed + fandom'],
  ['kamisama-kiss', 30, 149, 146, '146-149 (vol 25, timeskip)', 25, 'VERIFIED pin promoted (KEEP verdict): finale OVA adapts the manga ending. fandom + ANN + Chapter_149'],
  // berserk — numbered-scheme interiors
  ['berserk', 6, 5, 2, '2-5 (Nosferatu Zodd 1-4)', 5, 'Zodd encounter = ch 5 verbatim. fandom + Wikipedia ch list'],
  ['berserk', 12, 17, 15, '15-17 (Casca 1-3) + opening of 18', 7, 'Casca backstory. fandom + Wikipedia'],
  ['berserk', 16, 28, 24, '24 (2nd half)-28 + first pages of 29', 8, 'Doldrey; ep 17 re-covers 29-31. fandom + Wikipedia'],
  ['berserk', 19, 38, 33, '33-38', 9, 'duel/departure/arrest; ch 39 never adapted. fandom + Wikipedia'],
  ['berserk', 22, 58, 49, '49-56, 58 (57 skipped)', 10, 'Griffith rescue; 58 = tunnel escape. fandom + Wikipedia'],
  ['berserk', 23, 70, 67, '67-68, 70 + opening of 73 (69, 71-72 skipped)', 12, 'pre-Eclipse; non-contiguous — MEDIUM. fandom + Wikipedia'],
];

// [sid, episode, continue_chapter, why] — verbatim from the script
const CONTINUE: ContinueRow[] = [
  ['bleach', 354, 449, 'across the filler-355 gap (batch 11)'],
  ['bleach', 365, 476, 'ends mid-476; finale adapts 476-479 (batch 11)'],
  ['cells-at-work', 13, 11, 'S1 skipped 11/13/14/16 — S1-only viewers backfill from 11 (batch 11)'],
  ['cells-at-work', 21, 27, 'last adapted = 25 but 26 aired as ep 14 — resume vol 6 ch 27 (batch 11)'],
  ['my-hero-academia', 100, 241, 'anime jumps to Endeavor Agency; 220-240 held for eps 108-112 (batch 11)'],
  ['my-hero-academia', 112, 256, 'MVA ends 240 but 241-255 already adapted — ep 113 resumes 256 (batch 11)'],
  ['blood-blockade-battlefront', 12, 14, 'ep 10 covered 14 partially; WDTALO recommends restarting from ch 1 after S1 (batch 11)'],
  ['gto-great-teacher-onizuka', 41, 106, 'ch 106 (vol-13 closer) never adapted — continue 106, not 107 (batch 11)'],
  ['yu-yu-hakusho-ghostfiles', 112, 171, 'TV skips epilogue 171/173-174 (2018 OVAs) — back up to 171 (batch 11)'],
  ['kamisama-kiss', 25, 65, 'chs 65-79 never animated — the pre-Kako-hen gap (batch 11)'],
  ['kamisama-kiss', 30, 102, 'ending adapted — completionists go BACK to 102 (chs 102-145 never animated) (batch 11)'],
  ['bleach-thousand-year-blood-war', 34, 630, 'Friend block 630-634 deferred to eps 36/38 — read before 640 (batch 11)'],
  ['bleach-thousand-year-blood-war', 37, 630, 'Friend block still pending until ep 38 (batch 11)'],
  ['summer-time-rendering', 5, 21, 'clean vol boundary (recorded; interiors elsewhere split mid-chapter) (batch 11)'],
  ['berserk', 25, 88, 'ep 25 grafts 93-94 but 88-92 (Skull Knight rescue) entirely unadapted — resume at 88 (batch 11)'],
];

// [sid, episodes, kind, chapters|null, note] — verbatim from the script
const ANNOTATIONS: AnnotationRow[] = [
  ['bleach', [364, 365], 'rearranged', '468-476', 'ep 365 re-uses ch 470 (Ginjo backstory) out of order'],
  ['bleach', [355], 'graft', null, 'anime-original New Year special between 448 and 449'],
  ['naruto-shippuden', [89, 90], 'partial', '342-347 (fragments)', 'mixed intro to the Three-Tails filler; beats re-adapted properly in 113-115'],
  ['naruto-shippuden', [119, 120], 'graft', '239-244', 'Kakashi Gaiden (Part I chapters) inserted mid-arc'],
  ['naruto-shippuden', [127, 128], 'rearranged', '369, 372-373, 376, 381-382 (fragments)', "Jiraiya's-past two-parter from flashback panels + original expansion"],
  ['naruto-shippuden', [129, 134], 'rearranged', '366-383 interleaved', 'Jiraiya vs Pain block reshuffles'],
  ['naruto-shippuden', [142], 'rearranged', '403-404 + 408, 410-411 pulled forward', 'Battle of Unraikyō'],
  ['cells-at-work', [2, 3, 5, 9, 10, 11], 'rearranged', '4, 3, 2, 12, 15, 6', 'S1 airs chapters out of book order (Heat Stress ch 6 → ep 11)'],
  ['cells-at-work', [14], 'rearranged', '26', 'S2 opens with vol-6 material then returns to vols 3-5'],
  ['cells-at-work', [15, 16], 'rearranged', '13+19, 16+14', 'double-chapter eps pairing the S1-skipped chapters'],
  ['shangri-la-frontier', [36, 37, 38, 39, 40], 'partial', '83-96', 'Lamplight 1-5 — continuous, mid-chapter boundaries'],
  ['shangri-la-frontier', [42, 43, 44, 45, 46, 47, 48, 49, 50], 'partial', '99-126', 'Ctarnidd arc runs to S2 end unresolved — S3 picks up at 127'],
  ['my-hero-academia', [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112], 'rearranged', '241-252 aired before 218-240', "S5's famous reorder; interpolation 106-113 meaningless (per-ep runs in research)"],
  ['my-hero-academia', [104], 'divergence', null, "100% anime-original ('Long Time No See, Selkie') — movie prologue"],
  ['my-hero-academia', [113], 'graft', '240 fragments + 246 (p4-8) + 256-257 + 258 fragments', 'finale stitches MVA close + Agency-era scene; 113→257 stands'],
  ['blood-blockade-battlefront', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 'divergence', null, 'White/Black storyline = anime-original, woven through every S1 episode'],
  ['blood-blockade-battlefront', [13], 'graft', 'Back 2 Back ch 1', "S2 opener adapts the SEQUEL manga's ch 1"],
  ['blood-blockade-battlefront', [14, 15, 16, 17, 18, 19, 20, 21, 22], 'rearranged', '21-22, 7, 15, 10, 26a+B2B 2-3, 23-24, 17, 18, 25', 'faithful but heavily shuffled'],
  ['blood-blockade-battlefront', [18], 'graft', '26 (first half) + Back 2 Back 2-3', 'splices main + sequel; 26 re-adapted in ep 23'],
  ['gto-great-teacher-onizuka', [42, 43], 'divergence', null, 'anime-original ending (caught the manga): Saitou stabbing — none in the manga'],
  ['gto-great-teacher-onizuka', [20, 21, 35], 'rearranged', '73-74 / 70 / 72', 'ep 20 airs 73-74 before 70; ch 72 deferred to ep 35'],
  ['gto-great-teacher-onizuka', [40], 'graft', '102 + 107', 'mixes vol-14 ch-107 material — do not advance past 106'],
  ['welcome-to-demon-school-iruma-kun', [35], 'graft', 'Kalego Gaiden 1', 'spin-off chapter woven in'],
  ['welcome-to-demon-school-iruma-kun', [36, 37], 'rearranged', '69-74', 'ch 73 pulled ahead of 71-72'],
  ['welcome-to-demon-school-iruma-kun', [38, 39], 'rearranged', '75-82', '76/77 split to interleave three battles'],
  ['welcome-to-demon-school-iruma-kun', [42], 'divergence', '90-91', "ch 90 'Sabbath' + 91 unadapted in S2"],
  ['welcome-to-demon-school-iruma-kun', [43, 44], 'rearranged', '92-95', 'finale order swapped (43 = 94; 44 = 92+93+95 partial)'],
  ['yu-yu-hakusho-ghostfiles', [26], 'rearranged', '51-52 (first half)', 'saga-final ch 51 opens the next season'],
  ['yu-yu-hakusho-ghostfiles', [106, 107, 108, 109, 110, 111], 'divergence', '168-170', 'modified ending: ~2 chs expanded into ~6 eps of original fights'],
  ['yu-yu-hakusho-ghostfiles', [112], 'graft', '170, 172, 175', 'three non-contiguous epilogue chapters stitched'],
  ['inuyasha', [168, 169, 170, 171, 172], 'rearranged', '356-448 non-linear', 'FA opening heavily rearranged; read-along = continue 357+ after 167'],
  ['inuyasha', [168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193], 'abridged', '356-558', '~203 chs in 26 eps; anchors mark position, not full coverage'],
  ['inuyasha', [174], 'partial', '448-449, 452-458', 'skips 450-451'],
  ['inuyasha', [184, 185], 'graft', '494, 512 + 513-520', 're-insert deferred material'],
  ['inuyasha', [186], 'graft', '392 + 521-525', "Kohaku's-shard flashback"],
  ['boruto-naruto-next-generations', [287, 288, 289, 290, 291, 292, 293], 'rearranged', '56-67', '12 chs in 7 weekly eps; ENDs = last fully-completed chapter'],
  ['boruto-naruto-next-generations', [293], 'graft', '68, 70', 'v18 Omnipotence scenes grafted forward; re-adapted in Part 2'],
  ['ranking-of-kings', [1], 'graft', '8-9 (partial)', 'Bebin-catches-Kage pulled forward; Domas 3-4 cut'],
  ['ranking-of-kings', [2, 3], 'rearranged', '8-13', 'deathbed/succession flashback linearized'],
  ['ranking-of-kings', [18, 19], 'rearranged', '~110-117 + ~131-138', 'Miranjo/Bosse backstory interleaved as one flashback block'],
  ['ranking-of-kings', [23], 'divergence', '150-155', 'finale has original epilogue expansion; TCoC specials → post-TCoC continue = 165'],
  ['bleach-thousand-year-blood-war', [27], 'graft', '608-611', 'Royal Guard vs Schutzstaffel largely Kubo-original around brief manga material'],
  ['bleach-thousand-year-blood-war', [30], 'graft', '620', '~12 min original Uryu-vs-Ichigo footage'],
  ['bleach-thousand-year-blood-war', [33, 34, 35, 36, 37, 38], 'rearranged', '630-654', 'three blocks interleaved (Friend deferred; Pernida + Lille split); manga 630-634→635-644→645-654 vs anime 635-639→645-649→640-644+630a→650-654→630b-634'],
  ['bleach-thousand-year-blood-war', [39], 'partial', '655-659', 'titled after ch 660 but stops at 659; 660-661 open ep 40'],
  ['summer-time-rendering', [6], 'partial', '21-22', 'post-loop-reset recap condensed'],
  ['summer-time-rendering', [8, 9], 'partial', '33-47', 'heaviest condensation (page trims)'],
  ['summer-time-rendering', [25], 'graft', '139', 'anime-original epilogue scenes around the final chapter'],
  ['kamisama-kiss', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'rearranged', '1-30', 'S1 out of manga order; boundary ch 30 clean'],
  ['kamisama-kiss', [26, 27, 28, 29], 'partial', '80-101', 'past arc (22 chs) in 4 OADs; OAD2≈86-89, OAD3≈90-95 inferred'],
  ['kamisama-kiss', [30], 'divergence', '146-149', 'manga shows the shrine return with their son; OVA only a glimpse'],
  ['berserk', [1], 'rearranged', 'unnumbered 0-1..0-8 (Black Swordsman prologue)', 'SCHEME FIX: ep 1 adapts the UNNUMBERED prologue, not numbered 1-3 (those are vol-5 Zodd material, ep 5+) — supersedes the batch-6 note'],
  ['berserk', [2, 3, 4], 'rearranged', 'unnumbered 0-08..0-16 (vols 3-5)', 'pre-serialization Golden Age chapters outside the numbered range; ep 4 flashes back internally'],
  ['berserk', [20, 21], 'rearranged', '40-48 (39 dropped)', 'post-timeskip shuffle — no hard anchor inside'],
  ['berserk', [22, 23], 'divergence', '57, 59-66, 69 skipped (vol 11 nearly whole)', 'Wyald/Black Dog Knights cut entirely; continuity resumes at 67'],
];

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
  if (sid === 'boruto-naruto-next-generations' && ep === 293) e.supersedes = 'the bare boruto ep-293 → 67 anchor (pre-batch-11; no full record)';
  return e;
};

const continueEntry = ([sid, ep, cont, why]: ContinueRow): RulingEntry => {
  const anchor = ANCHORS.find((a) => a[0] === sid && a[1] === ep);
  const end = anchor?.[2] ?? null;
  // continue = END (mid-chapter) → C1; continue below covered chapters (a skip note) → C3; else parity → C2
  const ruleId = end != null && cont === end ? 'C1' : end != null && cont < end ? 'C3' : 'C2';
  return { seriesId: sid, ruleId, value: { episode: ep, continue_chapter: cont }, reason: why, ruledBy: 'session', ruledOn: RULED_ON, cite: cite(sid) };
};

const annotationEntry = ([sid, eps, kind, chapters, note]: AnnotationRow): RulingEntry => {
  const e: RulingEntry = {
    seriesId: sid, ruleId: 'A43',
    value: { episodes: eps, kind, chapters, note: `${B}: ${note}` },
    reason: note,
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite(sid),
  };
  if (sid === 'berserk' && eps.length === 1 && eps[0] === 1) e.supersedes = 'batch-6 berserk ep-1 annotation (read ep 1 as numbered chs 1-3; those are vol-5 Zodd material)';
  return e;
};

const range = (a: number, b: number, t: string): Record<number, string> => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, t]));

export const ENTRIES: RulingEntry[] = [
  // ---- HEAL (the YYH class): generic aired-count healer, recorded once — mechanism belongs in lib
  {
    seriesId: '*', ruleId: 'N20',
    value: {
      scope: 'every series in SOURCE_NUMBERING_SHIFTS',
      mechanism: 'if series.aired_episodes > max(episodes.number): set aired_episodes = max, total_episodes = min(total, max); delete chapter_anchors where source=mu and episode > max; refreshStitchedVolatile',
    },
    reason: "HEAL: batch-7 Group-C demotions never updated aired counts — MU re-pinned at phantom episodes (the YYH class: the pin sat on the demoted Picture Drama row 113). Aired/total now clamp to the max episode row for every shift-ruled series. NOTE (T2 dedupe): this healer's mechanism lives only in apply-research-batch-11.ts and belongs in lib/ as a rostered healer (P20) — it is the enforcement site N20 currently lacks.",
    ruledBy: 'session', ruledOn: RULED_ON,
    cite: [SCRIPT, LOG, 'scripts/ingest/lib/resolve.ts SOURCE_NUMBERING_SHIFTS', 'scripts/ingest/lib/resolve.ts COMMUNITY_COUNT_OVERRIDES yu-yu-hakusho-ghostfiles (cap 112)'],
    retiresWhen: 'the mechanism is moved into lib/ and rostered (T2 dedupe); this record then cites that healer',
  },

  // ---- deletion: the wrong-episode MU pin (GTO ep 42 adapts no manga)
  {
    seriesId: 'gto-great-teacher-onizuka', ruleId: 'A6',
    value: { table: 'chapter_anchors', op: 'delete', episode: 42, source: 'mu' },
    reason: 'the MU pin sat on the anime-original ep 42 (adapts NO manga; typed anime-only-canon this batch) — an A1 hit triaged to deletion; the true endpoint is ep 41 → 105 (REPAIR anchor).',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite('gto-great-teacher-onizuka'),
  },

  // ---- anchors (95), continue points (15), annotation groups (55)
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
    seriesId: 'boruto-naruto-next-generations', ruleId: 'T6',
    value: { table: 'episodes', type: range(221, 286, 'anime-only-canon') },
    reason: 'Boruto 221-286 typed anime-only-canon: anime-original stretch with no Boruto chapter progress (narutopedia arc pages + animefillerguide + cbr); the Sasuke Retsuden spin-off trap documented. Applied once here; the standing ruling is the EPISODE_TYPE_OVERRIDES entry.',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite('boruto-naruto-next-generations', 'scripts/ingest/lib/resolve.ts EPISODE_TYPE_OVERRIDES boruto-naruto-next-generations'),
  },
  {
    seriesId: 'gto-great-teacher-onizuka', ruleId: 'T6',
    value: { table: 'episodes', type: { ...range(22, 28, 'anime-only-canon'), ...range(34, 34, 'anime-only-canon'), ...range(42, 43, 'anime-only-canon') } },
    reason: 'gto: anime-original mid-series block (22-28, 34) + the original ending 42-43 (caught up to the manga) — fandom infoboxes list Manga Chapter(s) = N/A; mangashed + WDTALO call 42-43 non-canon. Applied once here; the standing ruling is the EPISODE_TYPE_OVERRIDES entry.',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite('gto-great-teacher-onizuka', 'scripts/ingest/lib/resolve.ts EPISODE_TYPE_OVERRIDES gto-great-teacher-onizuka'),
    retiresWhen: 'T4.0 studio-original-endings class ruling (DRIFT-LIST A-7: gto 42-43 "caught up" is one of three competing types)',
  },

  // ---- series update
  {
    seriesId: 'blood-blockade-battlefront', ruleId: 'A40',
    value: { table: 'series', mapping_mode: 'loose' },
    reason: 'pervasive anime-original White/Black thread woven through every S1 episode + heavy S2 shuffle → loose (research-ruled); anchors stored regardless as borrow-maps.',
    ruledBy: 'session', ruledOn: RULED_ON, cite: cite('blood-blockade-battlefront'),
  },
];
