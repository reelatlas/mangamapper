// Research batch 8 — item-4 batch 3 (2026-08-23): top-16 anchor-gap tier by
// popularity, agent-verified (2+ sources each, URLs in notes; full verdicts in
// session scratchpad batch8/*.json). Ruling record; re-runnable.
// Three REPAIRS of existing data (clear-cut supersessions under established
// rules — reported, per the deep-rescan note principle):
//   hunter-x-hunter-2011 ep80: afg ch-204 anchor was a GRAFT artifact ("Gyro's
//     Story" pulled forward); linear position ~ch 190 — manual replaces it.
//   food-wars ep86: MU end-pin ch 264 is the SEASON-4 boundary (our ep 73);
//     real terminus ~ch 315 (S5 anime-original-heavy).
//   bungo-stray-dogs: AFL counts the 2017 OVA "Hitori Ayumu" as ep 25 —
//     rows renumber to the community's 60-ep TV space (Dr. Stone rule;
//     SOURCE_NUMBERING_SHIFTS entry keeps refreshes translated).
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-8.ts

import { db, startRun, finishRun, fileFlagOnce } from '../lib/db';
import { refreshStitchedVolatile, EPISODE_TYPE_OVERRIDES } from '../lib/resolve';

const now = () => new Date().toISOString();
const B = 'research-tier batch 8 (2026-08-23, agent-verified 2+ sources)';

// [sid, episode, chapter, volume|null, note]
const ANCHORS: [string, number, number, number | null, string][] = [
  // attack-on-titan — Final Season part 1 interior (thiswriteguy per-episode + reviews)
  ['attack-on-titan', 64, 100, 25, "S4E5 'Declaration of War' = 99-100, Eren's Liberio transformation. thiswriteguy + hanasblog"],
  ['attack-on-titan', 67, 105, 26, "S4E8 'Assassin's Bullet' = ch 105 (airship escape, Sasha shot). thiswriteguy + epicstream"],
  ['attack-on-titan', 68, 106, 26, "S4E9 'Brave Volunteers' = ch 106 — end of vol 26 / Marley block 91-106. thiswriteguy + denofgeek"],
  ['attack-on-titan', 73, 113, 28, "S4E14 'Savagery' ends ch 113 (title match), Levi defeats Zeke. thiswriteguy + epicstream"],
  ['attack-on-titan', 74, 114, 28, "S4E15 'Sole Salvation' = Zeke backstory ch 114 (vol 28 close); may dip into 115 — MEDIUM. thiswriteguy + thereviewmonster"],
  // jujutsu-kaisen — Shibuya interior (fandom infoboxes + animefillerguide + third sources)
  ['jujutsu-kaisen', 34, 93, 11, "S2E10 'Pandemonium' ends ch 93 — Gojo sealed; first clean boundary in Shibuya. jjk fandom Episode_34 + animefillerguide"],
  ['jujutsu-kaisen', 35, 97, 11, 'S2E11 ends ch 97 (= vol 11 end) — Toji reappears via seance. fandom Episode_35 + animefillerguide'],
  ['jujutsu-kaisen', 40, 116, 14, "S2E16 'Thunderclap' ends ch 116 — Toji's end, Sukuna vs Jogo. fandom Episode_40 + animefillerguide + recaps"],
  ['jujutsu-kaisen', 42, 122, 14, "S2E18 ends ch 122 — Nanami's death (120). fandom Episode_42 + animefillerguide + sportskeeda"],
  ['jujutsu-kaisen', 45, 132, 15, "S2E21 'Transformation' ends ch 132 — Todo loses his arm. fandom Episode_45 + yahoo (129-132) + animefillerguide"],
  // my-hero-academia — Season 2 (fandom infoboxes + animefillerguide agree on all 25 eps)
  ['my-hero-academia', 18, 30, 4, 'Cavalry Battle ends; ep 19 starts ch 31. mha fandom Episode_18 + animefillerguide'],
  ['my-hero-academia', 21, 35, 4, 'Tournament round 1 midpoint; exact vol 4 end. fandom Episode_21 + animefillerguide + Wikipedia ch list'],
  ['my-hero-academia', 25, 44, 5, 'U.A. Sports Festival arc ends (22-44 = eps 14-25); exact vol 5 end. fandom Episode_25 + animefillerguide + Wikipedia'],
  ['my-hero-academia', 29, 53, 6, 'Mid-Stain fight, ep = 51-53 exact; vol 6 end. fandom Episode_29 + animefillerguide'],
  ['my-hero-academia', 33, 59, 7, 'Hero Killer arc ends (45-59); ep 34 starts Final Exams at 60. fandom Episode_33 + animefillerguide + tvtropes'],
  ['my-hero-academia', 37, 67, 8, 'Final Exams practicals conclude; ep 38 starts clean at 68. fandom Episode_37 + animefillerguide'],
  // hunter-x-hunter-2011 — Chimera Ant interior; ep 80 REPAIR (graft artifact)
  ['hunter-x-hunter-2011', 80, 190, 19, "REPAIR: replaces afg ch-204 graft artifact ('Gyro's Story' pulled forward; hunterpedia Chapter_204 Anime=Ep 80); linear position ~190 — eps 81-87 adapt 191-204. MEDIUM. hunterpedia episode pages + animefillerguide"],
  ['hunter-x-hunter-2011', 87, 204, 20, 'Knuckle duel/escape end — story reaches 204 HERE; ep 88 starts 205. hunterpedia Episode_87 + animefillerguide'],
  ['hunter-x-hunter-2011', 90, 212, 21, 'Knuckle/Shoot training battles; ep 91 starts 213. hunterpedia Episode_90 + Chapter_212 (Anime=90)'],
  ['hunter-x-hunter-2011', 94, 220, 21, 'Kite reunion resolution; ep 95 starts 221. hunterpedia Episode_94 + Chapter_220'],
  ['hunter-x-hunter-2011', 95, 223, 21, 'Vol-21 end anchor (223 = last of vol 21). hunterpedia Episode_95 + Wikipedia vol bounds'],
  ['hunter-x-hunter-2011', 97, 229, 22, 'Zazan side-story block end; interior 96-97 rearranged — MEDIUM. hunterpedia Episode_97 + Chapter_229'],
  ['hunter-x-hunter-2011', 98, 231, 22, 'East Gorteau infiltration; ep 99 starts 232 (locks vs ep99→234). hunterpedia Episode_98 + Chapter_231'],
  // naruto — Chunin Exams → Konoha Crush (listfist + animestoryguide charts agree throughout)
  ['naruto', 37, 65, 8, "Forest of Death ends, Hokage's address. listfist + animestoryguide (both ep37=63-65)"],
  ['naruto', 47, 81, 10, "Neji vs Hinata concludes; ends slightly INTO ch 81 — MEDIUM. listfist + animestoryguide"],
  ['naruto', 51, 89, 10, 'Prelims wrapped (formal end 87), bracket drawn; vol 10 ends 89. listfist + animestoryguide + Wikipedia'],
  ['naruto', 57, 96, 11, 'Naruto summons Gamabunta. listfist + animestoryguide + fandom snippet'],
  ['naruto', 62, 105, 12, 'Naruto defeats Neji — finals opener ends. listfist + animestoryguide + animeoshi'],
  ['naruto', 67, 114, 13, "Chidori pierces Gaara; Kabuto's genjutsu signals the Crush. listfist + animestoryguide"],
  ['naruto', 73, 124, 14, 'Hiruzen vs Orochimaru: Reaper Death Seal. listfist + animestoryguide'],
  // assassination-classroom — Season 2 (fandom infoboxes via API + Wikipedia event/title corroboration)
  ['assassination-classroom', 25, 87, 10, 'Itona/Shiro tentacle arc ends — Itona enrolls in 3-E. ansatsukyoshitsu fandom Episode_25 (84-87) + Wikipedia S2 + ch list'],
  ['assassination-classroom', 30, 110, 13, 'Reaper arc ends — Karasuma defeats the Reaper. fandom Episode_30 (105-110) + Wikipedia'],
  ['assassination-classroom', 33, 121, 14, 'Second-term finals end; ep title = ch 119 title pins start; endpoint mainly fandom — MEDIUM. fandom Episode_33 + Wikipedia'],
  ['assassination-classroom', 38, 142, 16, 'Korosensei past-reveal arc end AND vol 16 end; ch 143 opens ep 39. fandom Episode_38 + Wikipedia ch list + S2'],
  ['assassination-classroom', 41, 153, 18, "Space-station ep end — Okuda's <1%% announcement. fandom Episode_41 (150b-153) + Wikipedia"],
  ['assassination-classroom', 43, 167, 19, "Endgame start — laser barrier; ch 167 'Trust Time' = ep title. fandom Episode_43 (162-167) + Wikipedia"],
  // naruto-shippuden — war-arc canon milestones (narutopedia infoboxes + Wikipedia seasons)
  ['naruto-shippuden', 299, 552, 58, 'Itachi seals Nagato; ends mid-552. narutopedia The_Acknowledged_One + Wikipedia S14'],
  ['naruto-shippuden', 301, 555, 58, "Third Raikage sealed; ep title 'Paradox' = ch 555 title. narutopedia + Wikipedia S14 + ch list"],
  ['naruto-shippuden', 322, 561, 59, 'Edo Madara revealed, Wood Release (560-561). narutopedia Madara_Uchiha_(episode) + Wikipedia S15'],
  ['naruto-shippuden', 329, 572, 60, "Kurama partnership; 'Nine Names' (572). narutopedia Two-Man_Team + Wikipedia S15"],
  ['naruto-shippuden', 339, 590, 62, "Izanami ends Kabuto fight; ep title = ch 590 'I Will Love You Always'. narutopedia + Wikipedia S15"],
  ['naruto-shippuden', 343, 600, 63, 'Obito unmasked (599); ends with Madara arriving = end ch 600 (reveal ep ENDS at 600, not 599). narutopedia Who_Are_You? + Wikipedia S15'],
  ['naruto-shippuden', 362, 609, 64, "Ten-Tails emerges = end ch 609 'The End'. narutopedia Kakashi's_Resolve + Wikipedia S17"],
  ['naruto-shippuden', 373, 633, 66, "Team 7 reunited; triple summon = ch 633 'Onward'. narutopedia Team_7,_Assemble! + Wikipedia S18"],
  // haikyu — Season 2 (fandom anime-to-chapter list + AFG; Wikipedia vol bounds independent)
  ['haikyu', 36, 98, 11, "S2E11 'Up Above' — camp end + BBQ, ends ch 98 (vol 11 end); prelims at 99. haikyuu fandom list + animefillerguide"],
  ['haikyu', 39, 108, 13, 'Prelim day 1 complete, ends 108; Johzenji at 109. fandom list + animefillerguide'],
  ['haikyu', 41, 117, 13, 'Johzenji ends (115), Wakutani begins (116) mid-ep; ends 117 = vol 13 end. fandom list + animefillerguide'],
  ['haikyu', 43, 125, 14, "S2E18 'The Losers' — Wakutani end + aftermath 125 (title match), vol 14 end. fandom list + animefillerguide"],
  ['haikyu', 44, 128, 15, 'Date Tech vs Aoba Johsai semifinal (126-128); Seijoh rematch starts 129. fandom list + animefillerguide'],
  ['haikyu', 47, 139, 16, "Mid Seijoh rematch, ends ch 139 'Archnemesis'. fandom list + animefillerguide"],
  // the-seven-deadly-sins — Revival of the Commandments interior (fandom + AFG; vol-end triangulation)
  ['the-seven-deadly-sins', 32, 119, 15, 'S2E4 ends ch 119; Galand attacks Camelot at 120. nanatsu fandom Episode_4 + animefillerguide'],
  ['the-seven-deadly-sins', 42, 150, 19, "S2E14 — Ravens arc end; ch 150 titled 'Master of the Sun' (Escanor reveal). fandom Episode_14 + animefillerguide + arc page"],
  ['the-seven-deadly-sins', 44, 160, 20, "S2E16 'Death-Trap Maze' ends 160; 43-52 sequential from here. fandom Episode_16 + animefillerguide"],
  ['the-seven-deadly-sins', 47, 175, 22, 'S2E19 ends 175, eve of the death scene; ep 48 starts 176. fandom Episode_19 + animefillerguide'],
  ['the-seven-deadly-sins', 48, 179, 22, 'Meliodas killed ch 177; Defense of Liones begins; ends 179 = exact vol 22 end. fandom Episode_20 + animefillerguide + yibada'],
  ['the-seven-deadly-sins', 50, 188, 23, 'Sins reassemble; ends 188 = exact vol 23 end. fandom Episode_22 + animefillerguide'],
  // bleach — Hueco Mundo → Deicide canon milestones (AFG conversion + independent boundary sources)
  ['bleach', 203, 315, 35, "S10 finale: Nnoitra dead, Karakura swap, ch 315 'MARCH OF THE DEATH'. Wikipedia S10 (286-315) + animefillerguide"],
  ['bleach', 226, 339, null, 'Last canon ep before Zanpakuto Rebellion; ch 340 straddles the break (re-adapted ep 267) — MEDIUM. animefillerguide + Wikipedia S12'],
  ['bleach', 272, 354, null, "Ichigo vs Ulquiorra conclusion (353 'The Ash' + 354). animefillerguide + Wikipedia S14 + mangahelpers"],
  ['bleach', 283, 375, null, 'Kyoraku cuts Starrk down (374-375). animefillerguide + Wikipedia S14 + neonstar review'],
  ['bleach', 293, 392, null, "Kyoka Suigetsu reveal — Hinamori stabbed (392 'The Breaking Glaciers'). animefillerguide + review blogs"],
  ['bleach', 300, 404, null, 'Urahara vs Hogyoku-Aizen (402-404). animefillerguide + anidb + fandom'],
  ['bleach', 309, 421, null, "Final Getsuga Tensho, Aizen sealed (421 'DEICIDE 23'); AFG ep310=422-423 locks vs confirmed ep310→423. animefillerguide + lurei review"],
  // fire-force — S2/S3 boundaries (AFG cumulative + Wikipedia title matches)
  ['fire-force', 30, 111, 13, 'Fifth Pillar/Inca arc end (S2E6 = ch 110 title); 112 spills into ep 31. animefillerguide + fandom arc page + Wikipedia S2'],
  ['fire-force', 34, 122, 14, "Chinese Peninsula end ('The Woman in Black' = ch 122 title); 123 spills — MEDIUM. animefillerguide + Wikipedia"],
  ['fire-force', 36, 128, 15, 'Joker/Holy Sol two-parter end; ep 37 starts 129 (title match both sides). animefillerguide + Wikipedia'],
  ['fire-force', 41, 147, 17, "Haijima/Nataku end; ends 147 'Oath', ep 42 starts 148 (title match). animefillerguide + Wikipedia"],
  ['fire-force', 48, 174, 20, 'S2 finale — vol 20 ch 174. wheredoestheanimeleaveoff + animefillerguide + playbite'],
  ['fire-force', 54, 195, 22, 'Obi rescue/prison arc end (Burns dies); ep 55 starts 196 — MEDIUM. animefillerguide + Wikipedia S3'],
  ['fire-force', 60, 216, 25, "S3p1 finale (216 'Ancient Madness' title match); p1 = 175-216, read from 217. animefillerguide + sportskeeda + WDTALO"],
  // blue-exorcist — season finales in OUR numbering (WDTALO continue-froms + corroboration)
  ['blue-exorcist', 37, 34, 9, 'Kyoto Saga finale — season = ch 14 + 16-34, Impure King concludes 34. WDTALO + hive.blog + collider'],
  ['blue-exorcist', 49, 68, 16, 'Shimane Illuminati finale — season = 38-68 (skips 35-37/40/42). WDTALO + discussion corroboration'],
  ['blue-exorcist', 61, 99, 22, "Yuki no Hate finale — ch 99 'Beyond the Snow Part 8'. WDTALO + gamerant + fandom Chapter_99"],
  // tokyo-revengers — Season 1 (fandom per-episode lists + grokipedia arcs + Wikipedia vols)
  ['tokyo-revengers', 5, 12, 2, 'Toman intro arc end; ep 6 starts Moebius. fandom Episode_5 (9-12) + grokipedia'],
  ['tokyo-revengers', 9, 23, 3, '8/3 conflict peak (Hanma revealed); exact vol 3/4 boundary — MEDIUM. fandom Episode_9 + grokipedia + Wikipedia vols'],
  ['tokyo-revengers', 12, 33, 4, 'Moebius arc end — Draken saved; exact vol 4/5 boundary; ep 13 starts Valhalla. fandom Episode_12 + grokipedia'],
  ['tokyo-revengers', 21, 62, 8, "Bloody Halloween climax — Baji's death (62 'Last wishes') — MEDIUM. fandom Episode_21 + cbr/ibtimes synopses"],
  ['tokyo-revengers', 23, 68, 8, 'Bloody Halloween end; ep 24 = 69-73 so ep 23 ends 68. fandom Episode_23 + animecorner + fictionhorizon'],
  // bungo-stray-dogs — TV numbering (valid AFTER the OVA-row renumber below)
  ['bungo-stray-dogs', 11, 14, null, "End of S1's manga-canon Port Mafia content (chs 1-14). bungo fandom Season_1 + MAL stack 21256"],
  ['bungo-stray-dogs', 12, 16, null, 'S1 finale = 15-16 (Guild opening); manga resumes ch 17 at ep 17. fandom Episode_12 + MAL stack'],
  ['bungo-stray-dogs', 24, 37, null, 'S2 finale, Guild arc end (36-37). fandom Episode_24 + MAL stack'],
  ['bungo-stray-dogs', 31, 45, null, 'Interior S3: eps 28-31 = 38-45; eps 32-36 pick up at 46. fandom Season_3 + MAL stack'],
  ['bungo-stray-dogs', 36, 53, null, "S3 finale 'Echo', Cannibalism arc end (52-53). fandom + MAL stack"],
  ['bungo-stray-dogs', 49, 77, null, "S4 finale 'Skyfall', Sky Casino end (75-77); continue at 78. fandom + dualshockers + MAL stack"],
  ['bungo-stray-dogs', 60, 113, null, "S5 finale 'Twilight Goodbye' (fandom/MU 'ep 61'); ch 110-113 retrospective (finale outpaced monthly manga) — MEDIUM. fandom + dualshockers + WDTALO"],
  // the-case-study-of-vanitas — ep 5 REPAIR (Sean's report: afg ch 15.5 is the
  // Entracte bonus, not a mainline position) + the 6-8 hole
  ['the-case-study-of-vanitas', 5, 10, 2, "REPAIR: replaces afg ch-15.5 (Entracte 'Chambre d'enfants' bonus folded into the flashback; AFG row = '8, 9, 10, 15.5', parser took max). Ep 5 'Friends' ends partway into Mémoire 10. mochijun fandom Friends + animefillerguide"],
  ['the-case-study-of-vanitas', 6, 11, 3, "Ep 6 'Questions' = rest of 10 + Mémoire 11. mochijun fandom + animefillerguide"],
  ['the-case-study-of-vanitas', 7, 12, 3, "Ep 7 'Love' = Mémoire 12 'Pause' only. mochijun fandom + animefillerguide"],
  ['the-case-study-of-vanitas', 8, 14, 3, "Ep 8 'Where Death Slumbers' = Mémoires 13-14 (title ≈ ch 14 'Where the Dead Sleep'). mochijun fandom + animefillerguide"],
  // food-wars — season boundaries; ep 86 REPAIR (MU pin was the S4 boundary)
  ['food-wars', 24, 60, 8, "S1 end; ep title = ch 60 'Warriors' Feast' (identical JP). Wikipedia S1 (chs 1-60) + WDTALO"],
  ['food-wars', 34, 104, 13, 'Autumn Election tournament ends (finals 101, aftermath -104); Stagiaire = 105 (title match) — MEDIUM ±1. Wikipedia S2 + ch list'],
  ['food-wars', 37, 117, 14, 'S2 end (Stagiaire complete); continue vol 14 ch 118 (120 if Elite Ten OVA watched). WDTALO + mangashed + Wikipedia S2'],
  ['food-wars', 61, 217, 25, 'S3 end — swallows Régiment FIRST BOUT (210-217, vol 25 end); continue 218. Wikipedia S3 + WDTALO'],
  ['food-wars', 73, 264, 31, 'S4 end (new Elite Ten 263 + Megumi 264); continue 265. This is where the old MU ep-86 pin belongs. Wikipedia S4 + WDTALO + mangashed'],
  ['food-wars', 86, 315, 36, 'REPAIR: replaces MU pin ch 264 (that was the S4 boundary). Series terminus ~315 via anime-original S5 route; Le Dessert (316-318) unadapted — MEDIUM (soft equivalence). mangashed + WDTALO + Wikipedia S5'],
];

// [sid, episodes, kind, chapters|null, note]
const ANNOTATIONS: [string, number[], string, string | null, string][] = [
  ['attack-on-titan', [61, 62, 63], 'rearranged', '92-98', 'S4E2-4 interleave Liberio present with Reiner flashbacks non-linearly; no single-chapter anchor inside'],
  ['jujutsu-kaisen', [30], 'graft', '64, 79-80', 'grafts the skipped S1-era ch 64 before the return-to-present; ends mid-80'],
  ['jujutsu-kaisen', [31, 32, 33], 'partial', '80-91', 'Shibuya onset boundaries page-split; nearest safe anchor = ep 34'],
  ['jujutsu-kaisen', [36, 37, 38, 39], 'rearranged', '98-112', 'heavy page-level reordering (ch 111 spliced between 107/108); only ep 39 ends clean (112)'],
  ['jujutsu-kaisen', [44], 'rearranged', '126-128 + 133 p.1-3', 'grafts first pages of ch 133 between 126/127; ends at 128'],
  ['my-hero-academia', [32], 'graft', null, "'Everyone's Internships' anime-original between ch 57 and 58 — not a manga anchor"],
  ['my-hero-academia', [34, 35, 36, 37], 'rearranged', '60-67 (+34.5)', 'Final Exams told concurrently in manga, consecutively in anime — pages interleaved; only ep37|38 boundary clean'],
  ['my-hero-academia', [27, 28], 'rearranged', '46-50 (+57 p.4)', 'minor reorder; interpolation fine to ~1 chapter'],
  ['hunter-x-hunter-2011', [80], 'graft', '204', "ch 204 'Gyro's Story' grafted forward into ep 80; linear position ~190 (anchor repaired this batch)"],
  ['hunter-x-hunter-2011', [83], 'graft', '288', 'flash-forward material from late Chimera Ant alongside linear 194-196'],
  ['hunter-x-hunter-2011', [87], 'partial', '197', 're-adapts ch 197 pp.12-13 as flashback; linear adaptation is ep 84'],
  ['hunter-x-hunter-2011', [96, 97], 'rearranged', '224-229', 'Zazan side story: 225-227 in both eps; anchor at block end only'],
  ['naruto', [52, 53, 54, 55], 'partial', '89-93', 'training-month eps ~1 ch each with anime-original padding; position maps loosely'],
  ['naruto', [38], 'partial', '65-67', 'sources disagree on endpoint (66 vs 67) — not anchored'],
  ['naruto-shippuden', [299, 300, 301, 302], 'rearranged', '551-557', 'anime rotates battlefields differently; adjacent eps share boundary chapters'],
  ['naruto-shippuden', [364, 365, 366, 367, 368, 369, 370, 371, 372], 'partial', '610-631', 'post-Ten-Tails stretch heavily padded; interpolation soft'],
  ['naruto-shippuden', [376, 377], 'graft', null, "'Mecha-Naruto' anime-original two-parter mid-war"],
  ['naruto-shippuden', [389, 390], 'graft', null, 'Hinata/Hanabi backstory anime-original pair'],
  ['naruto-shippuden', [391, 392], 'partial', '656-660', 'ep 391 = 656-657; ep 392 largely anime-original; 658-660 compressed around the boundary'],
  ['assassination-classroom', [23, 24], 'divergence', '77-79', 'TV skips vol 9 chs 77-79 (ep 23 ends 76, ep 24 starts 80); chs 78-79 adapted in the Kagaijugyou-hen ONA shorts instead — interpolation must not assume them in the TV timeline'],
  ['assassination-classroom', [28, 29], 'partial', '98', 'ch 98 split: ep 28 ends partway in, ep 29 re-covers as Reaper arc opener'],
  ['assassination-classroom', [42], 'divergence', '156-158, 161', "Valentine's ep adapts 154-155 then 159-160, skipping 156-158; ch 161 also unadapted (ep 43 starts 162)"],
  ['assassination-classroom', [46, 47], 'partial', '178', 'ch 178 split across eps 46/47; consistent with ep47→180'],
  ['haikyu', [26, 27, 28], 'rearranged', '71-77', 'S2E1 pulls 76-77 forward (Nekoma cold open); do not interpolate inside 26-28'],
  ['haikyu', [29, 30], 'rearranged', '78-82', "ch 80 'Desire' deferred: ep 29 = 78,79,81; ep 30 = 80,81,82"],
  ['haikyu', [41], 'partial', '114-117', 'match boundary (115/116) falls mid-episode; anchor is an episode-end point'],
  ['haikyu', [56], 'graft', '149', 'ch 149 partially re-adapted in S3E6; ep50→149 remains the S2 endpoint'],
  ['the-seven-deadly-sins', [29, 30], 'rearranged', '102-112', 'season opener shuffles 102-112; ch 101 in neither episode'],
  ['the-seven-deadly-sins', [33, 34, 35, 36, 37, 38, 39, 40, 41], 'rearranged', '120-146', 'Istar arc interleaved with Ravens arc out of manga order; resolves at ep 42'],
  ['the-seven-deadly-sins', [35], 'graft', '126 + Side Story 3', 'pairs ch 126 with Gowther Side Story 3 (non-main chapter)'],
  ['the-seven-deadly-sins', [52], 'graft', '195-197 + Extras 11-12', 'finale adds Extra Chapters 11-12; consistent with ep52→197'],
  ['bleach', [206, 207, 208, 209, 210, 211, 212], 'side_story', '-108 to -97', 'Turn Back the Pendulum gaiden — CANON but negative chapter numbering outside the 1-479 line; treat eps 205→215 as the mainline gap'],
  ['bleach', [284], 'partial', '376-377', 'roughly half anime-original: Harribel Vasto Lorde backstory grafted around Starrk\'s fall'],
  ['bleach', [266], 'partial', null, 'recap bridge; new canon footage begins ep 267 (chs 340-341)'],
  ['fire-force', [25], 'partial', '91-92', 'first ~17 min of S2E1 anime-original; back half adapts 91-92'],
  ['fire-force', [59, 60], 'rearranged', '211-216', 'ep 59 = 211-214, ep 60 = 213-216 — finale re-treads 213-214'],
  ['fire-force', [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73], 'divergence', '217-305', 'S3p2 compresses ~88 chs into 13 eps with skips + non-linear ordering; no interior anchors 61-72'],
  ['blue-exorcist', [18, 19, 20, 21, 22, 23, 24, 25], 'divergence', 'branches after ch 15-16', "S1's 2011 anime-original ending (non-canon); Kyoto Saga rewinds and resumes from vol 5 ch 16"],
  ['blue-exorcist', [26], 'rearranged', 'ch 14 + 16', 'Kyoto Saga opener grabs skipped ch 14 before resuming from 16'],
  ['blue-exorcist', [38], 'partial', 'ch 35-37 skipped', 'Shimane opens at 38, skipping 35-37 (also 40, 42 later)'],
  ['tokyo-revengers', [6], 'graft', 'Extra: Zero + ch 13-14', "opens with bonus chapter 'Extra: Zero' (Draken backstory) outside the main numbering"],
  ['tokyo-revengers', [10, 11], 'partial', 'ch 27', 'ch 27 spans both; ep 10 ends mid-chapter'],
  ['tokyo-revengers', [22, 23], 'rearranged', '63-68', 'ep 22 pulls ch 67 forward; ep 23 = rest of 64-66 + 68'],
  ['bungo-stray-dogs', [6, 7], 'graft', null, "'Osamu Dazai's Entrance Exam' LIGHT NOVEL inserted mid-S1 between ch 6 and 7 content"],
  ['bungo-stray-dogs', [13, 14, 15, 16], 'side_story', null, "S2 eps 1-4 = 'Dazai and the Dark Era' LIGHT NOVEL, not the manga"],
  ['bungo-stray-dogs', [25, 26, 27], 'side_story', null, "S3 eps 1-3 = 'Dazai, Chuya, Age Fifteen' LIGHT NOVEL prequel; manga resumes ch 38 at ep 28"],
  ['bungo-stray-dogs', [37, 38, 39], 'side_story', null, "S4 eps 1-3 = 'Untold Origins of the Detective Agency' LIGHT NOVEL prequel; manga resumes ch 54 at ep 40"],
  ['bungo-stray-dogs', [60], 'partial', '110-113', 'S5 finale mostly anime-original at broadcast (caught up to monthly manga); 111-113 mapping retrospective'],
  ['the-case-study-of-vanitas', [5], 'graft', 'Entracte 15.5', "bonus intermission 'Chambre d'enfants' (childhood flashback vignette, collected in vol 5) woven into ep 5's flashback — not a mainline position"],
  ['food-wars', [73], 'graft', '265-276', 'S4 finale credits montage super-condenses Hot Springs Case Files + Asahi teaser; readers continue from 265'],
  ['food-wars', [74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86], 'divergence', '265-315', 'S5 anime-original-heavy (BLUE restructured; Erina wins vs manga structure); only the 315 terminus holds'],
];

async function renumberBungo() {
  // AFL counts the 2017 OVA 'Hitori Ayumu' as row 25 → drop it, shift 26+
  // down by 1 into the community's 60-ep TV numbering (mirrors the
  // SOURCE_NUMBERING_SHIFTS entry; ascending renumber is PK-safe).
  const sid = 'bungo-stray-dogs';
  const { data: probe } = await db.from('episodes').select('number, title').eq('series_id', sid).eq('number', 25);
  if (!probe?.length || probe[0].title !== 'Walking Alone') {
    console.log('bungo renumber: row 25 is not the OVA (already translated) — skip');
    return;
  }
  await db.from('episodes').delete().eq('series_id', sid).eq('number', 25);
  const { data: rows } = await db.from('episodes').select('number').eq('series_id', sid).gt('number', 25).order('number');
  for (const r of rows ?? []) {
    await db.from('episodes').update({ number: r.number - 1 }).eq('series_id', sid).eq('number', r.number);
  }
  const { data: an } = await db.from('chapter_anchors').select('episode').eq('series_id', sid).gt('episode', 25).order('episode');
  for (const a of an ?? []) {
    await db.from('chapter_anchors').update({ episode: a.episode - 1 }).eq('series_id', sid).eq('episode', a.episode);
  }
  await db.from('series').update({ aired_episodes: 60, total_episodes: 60, updated_at: now() }).eq('id', sid);
  await refreshStitchedVolatile(sid);
  await db.from('ingest_fractionals').upsert({
    series_id: sid, position: 24.5, source: 'ruling', title: 'Hitori Ayumu (Walking Alone)',
    note: 'OVA aired 2017-08-04 between S2 and S3; adapts ~ch 40 side material; AFL numbers it as ep 25 (SOURCE_NUMBERING_SHIFTS translates). Community TV count = 60. Research batch 8.',
    disposition: 'order_only',
  });
  console.log('bungo renumbered: OVA row dropped, 26-61 → 25-60');
}

async function main() {
  const runId = await startRun('resolve');
  try {
    await renumberBungo();

    for (const [sid, ep, ch, vol, note] of ANCHORS) {
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: sid, episode: ep, chapter: ch, volume: vol, source: 'manual',
        note: `${B}: ${note}`,
      });
      if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
    }
    console.log(`anchors: ${ANCHORS.length}`);

    // black-clover 130-157: one-time retype of existing rows (the
    // EPISODE_TYPE_OVERRIDES entry keeps every future write consistent)
    const bcTypes = EPISODE_TYPE_OVERRIDES['black-clover'];
    for (const [ep, type] of Object.entries(bcTypes)) {
      await db.from('episodes').update({ type }).eq('series_id', 'black-clover').eq('number', Number(ep));
    }
    console.log(`black-clover retyped: ${Object.keys(bcTypes).length} eps (anime-only-canon/filler per 2-of-3 sources)`);

    for (const [sid, eps, kind, chapters, note] of ANNOTATIONS) {
      for (const ep of eps) {
        const { error } = await db.from('episode_annotations').upsert({ series_id: sid, episode: ep, kind, chapters, note: `${B}: ${note}` });
        if (error) throw new Error(`annotate ${sid} ep${ep}: ${error.message}`);
      }
      await db.from('series').update({ asterisk_review: 'pending', updated_at: now() }).eq('id', sid).is('asterisk_review', null);
    }
    console.log(`annotations: ${ANNOTATIONS.length} groups`);

    // open questions the research surfaced (research-first: verdicts, not raw numbers)
    await fileFlagOnce(runId, 'food-wars', 'resolve', 'count_mismatch', {
      note: 'our total_chapters=324 vs Wikipedia 318 (315 numbered + Le Dessert 316-318) — verify our numbering above 315 before any scope conclusion; ep86→315 anchor is within either space',
    });
    await fileFlagOnce(runId, 'bungo-stray-dogs', 'resolve', 'count_mismatch', {
      note: 'manga Part 1 concluded at ch 130 on 2026-03-04 (ANN); vol 28 March 2026; Part 2 unannounced — expect MU/AniList totals to land, then status flip to finished-part-1',
    });

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: ANCHORS.length, flagged: 2 }, 'research batch 8: item-4 batch 3 (16 series, 3 repairs)');
    console.log('=== BATCH 8 APPLIED ===');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
