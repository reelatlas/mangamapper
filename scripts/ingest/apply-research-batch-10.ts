// Research batch 10 — item-4 batch 5 (2026-08-23): 16 series, FIRST batch on
// the full-record protocol — every anchor carries chapter (end) +
// start_chapter + chapters_adapted (in adaptation order) + volume; continue
// exceptions land in continue_chapter. Agent-verified 2+ sources; full
// verdicts in session scratchpad batch10/*.json. Re-runnable.
// REPAIRS (clear-cut supersessions, reported):
//   black-butler ep46: MU ch-108 pin folds in OVAs/film/2024-25 TV seasons
//     absent from our 46-ep entry → ch 36/v8, continue 37. + structure flag.
//   beastars ep24: MU ch-196 = whole-manga pin → ch 99/v12, continue 100.
//     Final Season (24 eps, adapts 100-196) missing → structure flag.
//   the-ancient-magus-bride ep24: continua ch-95 = the S2 endpoint bleeding
//     into our S1-only entry → ch 45/v9. S2 (2023) missing → structure flag.
//   nisekoi ep32: MU stored the CONTINUE pointer (ch 107, never adapted) as
//     an end anchor → ch 106/v12, continue_chapter 107.
//   kimi-ni-todoke: trailing ep 44 = a ~14-min Netflix recap special (recap
//     rule: dropped + SOURCE_NUMBERING_SHIFTS); frontier re-pins to ep 43.
//   ouran: pervasive volume-jumping from ep 10 + anime-original finale →
//     mapping_mode 'loose' (sgt-frog class); MU pin becomes continue point.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-10.ts

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { refreshStitchedVolatile } from './lib/resolve';

const now = () => new Date().toISOString();
const B = 'research-tier batch 10 (2026-08-23, agent-verified 2+ sources, full-record)';

// [sid, ep, endCh, startCh|null, chaptersAdapted|null, vol|null, note]
const ANCHORS: [string, number, number, number | null, string | null, number | null, string][] = [
  // my-hero-academia — Season 4
  ['my-hero-academia', 66, 128, 127, '127-128', 14, "S4E3 'Boy Meets...' = ch 128 title, closes vol 14. fandom + Wikipedia"],
  ['my-hero-academia', 72, 145, 142, '142-145', 16, "S4E9 'Red Riot' = ch 145 title; Kirishima vs Rappa. fandom + Wikipedia"],
  ['my-hero-academia', 77, 161, 159, '159 (p.1-2, 5-17), 160-161', 18, "S4E14 'Bright Future' = ch 161 title; Nighteye's death. fandom + Wikipedia"],
  ['my-hero-academia', 80, 168, 166, '166 (p.1, 4-17), 167-168', 19, 'Remedial Course closes at Wikipedia arc bound 163-168. fandom + Wikipedia S4'],
  ['my-hero-academia', 83, 174, 173, '173 (p.1-8, 10-17), 174', 19, "S4E20 'Gold Tips Imperial' = ch 174 title. fandom + Wikipedia"],
  ['my-hero-academia', 86, 183, 181, '181-183', 20, 'School Festival closes at arc bound 169-183. fandom + Wikipedia S4'],
  // naruto — Tsunade Search
  ['naruto', 84, 146, 145, '145, 146', 16, 'Sasuke vs Itachi hotel fight; 3 sources identical. listfist + animefillerguide + narutopedia'],
  ['naruto', 87, 151, 151, '151', 17, 'single-chapter ep (water-balloon training). 3 sources'],
  ['naruto', 91, 160, 159, '159, 160', 18, "First Hokage's necklace bet. 3 sources"],
  ['naruto', 94, 167, 165, '165, 166, 167', 19, 'Rasengan vs Kabuto; majority of 165 here. 3 sources'],
  ['naruto', 96, 171, 170, '170, 171', 19, 'Sannin showdown climax; matches animestoryguide arc bound. 4 sources'],
  ['naruto', 98, 174, 172, '172, 173, 174', 19, "Tsunade's diagnosis of Lee; 174 tail uncertain — MEDIUM. 3 sources"],
  // assassination-classroom — Season 1
  ['assassination-classroom', 3, 6, 4, '4, 5, 6', 1, 'Karma intro arc (sandwiched by ep 2 end 3 / ep 4 open 8). fandom + Wikipedia'],
  ['assassination-classroom', 4, 10, 8, '8, 9, 10', 2, 'adapts 8-10 SKIPPING ch 7 (grafted into ep 5) — see continue exception. fandom infobox'],
  ['assassination-classroom', 6, 14, 12, '12, 13, 14', 2, "midterms end at ch 14 = ep title 'Test Time'. fandom + Wikipedia"],
  ['assassination-classroom', 8, 19, 18, '18, 19', 3, 'school-trip rescue; ep 9 opens 20 (title match). fandom + Wikipedia'],
  ['assassination-classroom', 11, 32, 29, '29, 30, 31, 32', 4, 'Itona arc; ch-32 page cross-credits ep 11. fandom + Wikipedia'],
  ['assassination-classroom', 16, 55, 53, '53, 54, 55', 7, 'semester close; ch 55 title = ep title. fandom + Wikipedia'],
  ['assassination-classroom', 19, 64, 61, '61 (majority), 62, 63, 64', 8, 'island hotel assault; ep 20 opens 65 (title match). fandom + Wikipedia'],
  // naruto-shippuden — Five Kage Summit region
  ['naruto-shippuden', 199, 457, 454, '454, 455, 456, 457', 49, 'Five Kage Summit convenes; 457 partial. narutopedia + listfist + animefillerguide'],
  ['naruto-shippuden', 211, 481, 480, '480, 481', 51, "Sasuke vs Danzo climax — Danzo's death. 3 sources"],
  ['naruto-shippuden', 222, 491, 489, '489, 490, 491', 52, 'last canon before the Paradise Life filler (223-242); 491 re-covered at 243. 3 sources'],
  ['naruto-shippuden', 243, 493, 491, '491, 492, 493', 52, 'canon resumes — Island of Paradise. 3 sources'],
  ['naruto-shippuden', 249, 504, 503, '503, 504', 53, "Kushina's story ends (504 = vol 53 finale). 3 sources"],
  ['naruto-shippuden', 255, 514, 513, '513, 514', 54, 'clean boundary; ep 256 = 515 = vol 55 opener. 3 sources'],
  // the-seven-deadly-sins — Dragon's Judgement
  ['the-seven-deadly-sins', 85, 296, 294, '292 (part), 294, 295, 296', 36, "threads re-sync after the Purgatory/Britannia interleave; Ludociel's sacrifice. fandom + Wikipedia"],
  ['the-seven-deadly-sins', 88, 305, 303, '303, 304, 305', 37, 'Demon King expelled; ep title = ch 303 title. fandom + Wikipedia'],
  ['the-seven-deadly-sins', 90, 310, 308, '308, 309, 310', 37, 'Meliodas departs; ep title = ch 310 title. fandom + Wikipedia'],
  ['the-seven-deadly-sins', 93, 326, 321, '321-326', 39, 'Zeldris freed; 6-ch episode (abridged). fandom + Wikipedia'],
  ['the-seven-deadly-sins', 96, 333, 331, '331, 332, 333', 40, "Demon King destroyed, Escanor's death; title = ch 331. fandom + Wikipedia"],
  ['the-seven-deadly-sins', 99, 343, 341, '341, 342, 343', 41, 'Arthur consumes Cath; ep title = ch 343 title. fandom + Wikipedia'],
  // bleach — Arrancar span
  ['bleach', 110, 186, 183, '183-186', 21, 'canon resumes after the 46-ep Bount block. animefillerguide + animestoryguide + Wikipedia S6'],
  ['bleach', 127, 229, 227, '227-229', 26, 'last canon before 128-137 filler; S6 ends 229. 3 sources'],
  ['bleach', 143, 241, 240, '240-241', 27, 'Grimmjow Revived / Hueco Mundo departure. 3 sources'],
  ['bleach', 146, 247, 246, '246-247', 28, 'last canon before 147-149 anime-original; ep 150 resumes 248. 2 sources'],
  ['bleach', 151, 251, 250, '250-251', 28, 'S7 end; S8 starts 252. 3 sources'],
  ['bleach', 166, 283, 281, '281-283', 32, 'Hollowfied Ichigo vs Grimmjow; pinned both sides (167 = 284-286). 3 sources'],
  // food-wars — Season 3
  ['food-wars', 42, 134, 131, '131, 132, 133, 134', 16, "Moon Banquet ends on Azami's coup (vol 16). fandom + Wikipedia"],
  ['food-wars', 45, 148, 143, '143-148', 18, 'Soma vs Eizan concluded, Polar Star saved. fandom + Wikipedia'],
  ['food-wars', 49, 166, 164, '164-166, then 149-151 backfilled', 20, 'cour-1 finale; backfills the survivor-hunt eps 46 skipped. fandom + Wikipedia'],
  ['food-wars', 51, 175, 172, '172-175', 21, "ep title = ch 175 'The Tōtsuki Train Departs'. fandom + Wikipedia"],
  ['food-wars', 55, 192, 188, '188-192', 23, 'Hayama rematch verdict + expulsion. fandom + Wikipedia'],
  ['food-wars', 59, 209, 206, '206-209', 25, 'Régiment first bout underway (vol 25 = 209-217). fandom + Wikipedia'],
  // to-your-eternity — S1 correction + Season 2
  ['to-your-eternity', 20, 54, 53, '53, 54', 6, "S1 CORRECTION: ep 20 'Echoes' = 53-54 (ch 54 title = ep title); S1 = chs 1-54/vols 1-6. fandom ch pages + animefillerguide + Wikipedia"],
  ['to-your-eternity', 22, 61, 58, '58, 59, 60, 61', 7, 'Uralis/Guardians setup; ep title = ch 59 title. fandom + animefillerguide + Wikipedia'],
  ['to-your-eternity', 24, 66, 64, '64, 66 (65 pulled into ep 23)', 8, 'ep title = ch 64 (last of vol 7). fandom + animefillerguide'],
  ['to-your-eternity', 27, 75, 73, '73, 74, 75', 9, "Bon's execution; ep title = ch 75 title — MEDIUM. doublesama + thecinemaholic + Wikipedia"],
  ['to-your-eternity', 30, 84, 82, '82, 83, 84', 9, "'Resonance' = ch 84 title (vol 9 final); before Renril. fandom + thecinemaholic"],
  ['to-your-eternity', 34, 94, 92, '92, 93, 94', 10, "'Morning of Rebirth' = ch 94 title; March resurrected. thecinemaholic + cbr"],
  ['to-your-eternity', 37, 105, 103, '103, 104, 105', 11, 'Kahaku-Nokker cliffhanger; ch 106 ruled into ep 38 by content evidence — MEDIUM. fandom + recaps'],
  // nisekoi — ep 32 REPAIR
  ['nisekoi', 10, 25, 24, '24-25', 3, "'Lottery' = ch 24 title; exact vol-3 boundary — MEDIUM. fandom + Wikipedia"],
  ['nisekoi', 15, 37, 36, '36-37', 5, "'Three Keys' = chs 36-37 titles — MEDIUM. fandom + Wikipedia"],
  ['nisekoi', 20, 50, 49, '49-50', 6, "S1 finale 'Showtime'; S1 = 1-50, continue 51. fandom + mangashed"],
  ['nisekoi', 24, 62, 61, '61-62 + part of 63', 7, "'Mother' — Hana/Chitoge reconciliation. fandom + Wikipedia"],
  ['nisekoi', 27, 76, 75, '75-76', 9, "Haru's introduction — MEDIUM. fandom + Wikipedia"],
  ['nisekoi', 32, 106, 106, '106, then 100 (aired in that order)', 12, 'REPAIR: replaces MU ch-107 (a continue-pointer; 107 never adapted). Finale = 106 then 100. fandom + mangashed + Wikipedia'],
  // black-butler — ep 46 REPAIR
  ['black-butler', 6, 14, 12, '12-14', 3, 'Jack the Ripper arc conclusion (eps 4-6 = chs 6-14) — MEDIUM. cbr + wiki.gg + screenrant'],
  ['black-butler', 15, 23, 15, '15-23', 5, "S1's faithful adaptation ends HERE (ch 23/vol 5); mid-ep already non-canon — MEDIUM. cbr + screenrant + wiki.gg"],
  ['black-butler', 38, 25, 24, '24-25', 6, 'Book of Circus manga content begins (ep 37 = original prologue) — MEDIUM. wiki.gg + cbr'],
  ['black-butler', 42, 29, 28, '28-29', 7, 'mid-arc checkpoint — MEDIUM (single per-ep source). wiki.gg + cbr arc-level'],
  ['black-butler', 46, 36, 35, '35-36', 8, 'REPAIR: replaces MU ch-108 pin (folds in OVAs/film/2024-25 seasons). Finale ends ch 36; ch 37 skipped. wiki.gg + fandom Circus_Arc + cbr'],
  // relife — pin verified
  ['relife', 13, 108, 100, '100-108 (aired 100-103, 105, 106, 104, 107, 108) + grafts 112, 123', 7, 'TV finale (fireworks confession); wiki lists exact coverage. fandom + WDTALO + mangashed'],
  ['relife', 14, 128, 109, '109-111, 116-128 (112-115 omitted/condensed)', 9, "Kanketsu-hen 1 'Seed' — beat-mapped — MEDIUM. Wikipedia + fandom + lostinanime"],
  ['relife', 15, 156, 129, '129-156', 10, "Kanketsu-hen 2 'Need' = culture-festival arc — MEDIUM. Wikipedia + lostinanime"],
  ['relife', 16, 198, 189, '189-198 (+condensed 184-186)', 13, "Kanketsu-hen 3 'Date'; 157-188 SKIPPED before this — MEDIUM. Wikipedia + lostinanime + fandom"],
  ['relife', 17, 222, 211, '211-222 (199-210 skipped)', 15, 'VERIFIED MU pin: finale = Report 222, story end. fandom Report_222 + Wikipedia + WDTALO'],
  // beastars — ep 24 REPAIR
  ['beastars', 6, 25, 21, '21, 22, 23, 24, 25', 3, 'Black Market visit; exact v3 boundary; SKIPS ch 20 (ep 7 has it). fandom + VIZ v3 + Wikipedia'],
  ['beastars', 9, 36, 33, '33, 34, 35, 36', 5, "Haru's abduction begins — MEDIUM. fandom + VIZ v5"],
  ['beastars', 12, 48, 44, '44 (2nd half), 45-48, + ending of 53 grafted', 6, 'S1 finale; ch 49 never animated. fandom + WDTALO'],
  ['beastars', 18, 69, 65, '65b, 66b, 67, 68a, 69b', 8, 'S2 interior — only safe anchor inside the jumble — MEDIUM. fandom + VIZ v8'],
  ['beastars', 24, 99, 91, '91-99 (91b/92a in ep 23)', 12, 'REPAIR: replaces MU ch-196 whole-manga pin. S2 finale = Tem-murderer arc end. fandom + WDTALO + fandom Episode_25 (Final Season opens 100)'],
  // ouran — loose + continue point
  ['ouran-high-school-host-club', 2, 2, 2, '2', 1, 'eps 1-2 adapt 1-2 in order (only pre-reorder stretch). fandom Chapter_02 + Series_Differences'],
  ['ouran-high-school-host-club', 8, 9, 8, '8-9', 3, 'beach arc end; coverage 1-9 contiguous despite the 3/4 swap. fandom + Series_Differences'],
  ['ouran-high-school-host-club', 9, 10, 10, '10', 3, 'last fully-contiguous point (1-10); reordering begins after. fandom + Series_Differences'],
  ['ouran-high-school-host-club', 16, 20, 19, '19 (part), 20', 5, 'Karuizawa arc end (vol 5) — loose terms; 11/17 skipped, 21 already used — MEDIUM. fandom'],
  ['ouran-high-school-host-club', 26, 36, 34, '34-36 + anime-original finale (parallels vol-6 chs 25-26)', 8, "coverage ~36; MU's ch-37 was the RESUME point (continue_chapter carries it). WDTALO + epicstream"],
  // black-lagoon — pin verified; reorders stored as adapted
  ['black-lagoon', 7, 10, 0, '0-1, 5-10', 2, 'S1 opening block end; 2-4 deferred. lagooncompany.fandom + Wikipedia'],
  ['black-lagoon', 10, 4, 2, '2-4', 1, 'Rasta Blasta — vol-1 material MOVED after the Nazi arc (non-monotonic by ruling). fandom + Wikipedia'],
  ['black-lagoon', 12, 21, 16, '16-21', 4, 'S1 finale = Goat Jihad complete; S1 skipped 11-15. fandom + Wikipedia'],
  ['black-lagoon', 15, 15, 11, '11-15', 3, 'Second Barrage backfills Bloodsport Fairy Tale. fandom + Wikipedia'],
  ['black-lagoon', 18, 43, 38, '38-43', 6, 'Greenback Jane pulled FORWARD of Fujiyama (largest reorder). fandom + Wikipedia'],
  ['black-lagoon', 24, 37, 22, '22-37', 5, 'Second Barrage finale = Fujiyama complete. fandom + WDTALO + Wikipedia'],
  ['black-lagoon', 29, 76, 44, '44-76', 9, 'VERIFIED pin: OVA = El Baile complete (33 chs); continue 77. fandom + volumes list + WDTALO'],
  // kimi-ni-todoke — recap drop + re-pin
  ['kimi-ni-todoke-from-me-to-you', 25, 27, 27, '27 (26 + front of 27 in ep 24)', 7, "S1 finale 'New Year'; continue 28. fandom + WDTALO + mangashed"],
  ['kimi-ni-todoke-from-me-to-you', 38, 46, 42, '42 (tail), 43, 46 — 44-45 skipped', 11, 'S2 finale. fandom + WDTALO + mangashed + Wikipedia vols'],
  ['kimi-ni-todoke-from-me-to-you', 39, 53, 46, '46 (reprise), 47-49, 52, 53 — 50-51 skipped', 13, 'S3e1 (1-hr) — MEDIUM. fandom + mangashed'],
  ['kimi-ni-todoke-from-me-to-you', 40, 59, 54, '54-59', 14, 'Okinawa trip; ends vol 14 — MEDIUM. fandom + thereviewgeek'],
  ['kimi-ni-todoke-from-me-to-you', 41, 64, 60, '60-64', 16, 'MEDIUM (single explicit source + arc consistency). fandom + thereviewgeek'],
  ['kimi-ni-todoke-from-me-to-you', 42, 70, 65, '65-70', 17, 'Christmas Party; bracketed by verified 59/71-75 — MEDIUM. fandom'],
  ['kimi-ni-todoke-from-me-to-you', 43, 75, 71, '71-75', 18, 'REPAIR: series finale carries the ch-75 frontier (was parked at the recap ep 44). Continue 76/v19; ep43→86 stays refuted. fandom + Wikipedia + WDTALO + mangashed'],
  // the-ancient-magus-bride — ep 24 REPAIR
  ['the-ancient-magus-bride', 3, 3, 3, '3', 1, 'early eps 1:1 with chapters (title match). fandom + Wikipedia ep list'],
  ['the-ancient-magus-bride', 7, 11, 9, '9-11', 3, 'ends partway into 11 — MEDIUM. fandom + ja.wikipedia envelope'],
  ['the-ancient-magus-bride', 12, 20, 18, '18-20', 4, "cour-1 boundary; carries ch 18's exact title; ends vol 4 — MEDIUM. fandom + Wikipedia"],
  ['the-ancient-magus-bride', 18, 32, 30, '30-32', 7, 'ends partway into 32 — MEDIUM. fandom + ja.wikipedia'],
  ['the-ancient-magus-bride', 24, 45, 44, '44-45', 9, 'REPAIR: replaces continua ch-95 (the S2 endpoint bleeding into our S1-only entry). S1 end = ch 45 = exact vol-9 end. fandom + ja.wikipedia (S1 = 1-45) + Volume_10 blurb'],
];

// [sid, episode, continue_chapter, why] — only where an anchor row exists
const CONTINUE: [string, number, number, string][] = [
  ['naruto', 98, 175, 'ch 174 tail uncertain and ep 99 adapts only 177; 175-176 unanimated — read from 175 (batch 10)'],
  ['assassination-classroom', 4, 7, 'ep 4 skips ch 7 (grafted into ep 5) — resuming at end+1 (11) skips unseen content (batch 10)'],
  ['naruto-shippuden', 199, 457, '457 partially animated; ep 200 covers 457-459 (batch 10)'],
  ['naruto-shippuden', 211, 481, '481 straddles; ep 212 re-covers (batch 10)'],
  ['naruto-shippuden', 222, 491, '491 split across the 20-ep filler gap (batch 10)'],
  ['naruto-shippuden', 243, 493, '493 straddles into ep 244 (batch 10)'],
  ['the-seven-deadly-sins', 90, 311, 'standard, recorded for clarity after the 308-hold-back zone (batch 10)'],
  ['bleach', 110, 186, '186 split across 110-111 (batch 10)'],
  ['bleach', 127, 229, '229 spans the filler gap; ep 138 re-covers (batch 10)'],
  ['bleach', 143, 241, '241 split across 143-144 (batch 10)'],
  ['food-wars', 55, 193, 'standard, but 188 opening was pre-grafted to ep 53 — 193 correct (batch 10)'],
  ['to-your-eternity', 27, 75, "guillotine cliffhanger; 75's resolution only revealed in ep 28 — re-read 75 (batch 10)"],
  ['nisekoi', 32, 107, 'the community continue point — the old MU value belongs HERE, not as the end anchor (batch 10)'],
  ['black-butler', 15, 24, 'S1 16-24 anime-original; faithful content stopped at 23 — continue at 24 (batch 10)'],
  ['black-butler', 46, 37, 'ch 37 skipped — read before 38; OVA/film watchers (38-66) continue at 67 (batch 10)'],
  ['relife', 16, 157, 'OVA jumped 157-188 (Oga/Kariu arc etc.) — back up to 157, not 199 (batch 10)'],
  ['relife', 17, 109, 'story complete at 222 but the OVA compresses ~28 ch/ep — guides recommend re-reading the final arc from 109 (batch 10)'],
  ['beastars', 6, 20, 'ep 6 skips ch 20 (ep 7 animates it out of order) — manga switchers read 20 before 26 (batch 10)'],
  ['beastars', 24, 100, 'confirmed resume (Final Season opens at 100); note 49/73/86 never animated (batch 10)'],
  ['ouran-high-school-host-club', 26, 37, 'community resume point (WDTALO + epicstream); completionist backtrack to ch 22 (vol 6 never adapted) (batch 10)'],
  ['black-lagoon', 7, 2, 'viewer lacks 2-4 (deferred to eps 8-10) — read 2-4 first, then 11 (batch 10)'],
  ['black-lagoon', 12, 11, 'S1 skipped 11-15; 16-21 already covered — naive 22 misses five chapters (batch 10)'],
  ['black-lagoon', 15, 22, '16-21 already adapted in S1 — next unseen = 22 (batch 10)'],
  ['black-lagoon', 18, 22, 'Fujiyama (22-37) not yet adapted at this point — next unseen = 22, not 44 (batch 10)'],
  ['black-lagoon', 24, 44, 'Greenback (38-43) already adapted — pick up at 44 (batch 10)'],
  ['kimi-ni-todoke-from-me-to-you', 38, 44, '44-45 never animated — completionists start at 44, not 47 (batch 10)'],
  ['kimi-ni-todoke-from-me-to-you', 39, 50, '50-51 never animated — read before 54 (batch 10)'],
  ['the-ancient-magus-bride', 24, 45, 'finale outran serialization with an original resolution — re-read from 45, then 46 (batch 10)'],
];

// [sid, episodes, kind, chapters|null, note]
const ANNOTATIONS: [string, number[], string, string | null, string][] = [
  ['my-hero-academia', [64], 'divergence', null, 'anime-original recap (journalist visits U.A.)'],
  ['my-hero-academia', [76, 77], 'rearranged', '159', 'ch 159 p.3-4 pulled forward to close ep 76'],
  ['my-hero-academia', [88], 'graft', '187-190 + 192 (p.16-19) + 193 (p.11-15)', 'finale grafts Hawks/Dabi High-End scenes; end stays 190 (title match); S5 re-covers'],
  ['naruto', [92, 93], 'partial', '163', 'split across boundary; 164/165 seam soft'],
  ['naruto', [97], 'graft', null, 'all-filler hot-spring ep between chs 171 and 172'],
  ['naruto', [99], 'partial', '177 (175, 176, 178 skipped)', 'mixed ep adapts only 177; skipped chapters are canon — readers should read them'],
  ['assassination-classroom', [4, 5], 'rearranged', '7-11', 'ch 7 held back, adapted out of order in ep 5 with ch 11'],
  ['assassination-classroom', [9, 10], 'divergence', '23-24', 'rainy-season/revenge chapters never adapted in TV — manga-only'],
  ['assassination-classroom', [12, 13], 'divergence', '37', "ch 37 skipped in TV — adapted in the 'Our Time' special"],
  ['assassination-classroom', [14], 'partial', '43-49', 'seven chapters compressed'],
  ['naruto-shippuden', [204], 'graft', '419, 465, 466, 470', 'ch-419 flashback + ch-470 grafted forward'],
  ['naruto-shippuden', [213], 'partial', '482', 'mixed — only part canon'],
  ['naruto-shippuden', [216], 'rearranged', '482, 486, 487', 'reaches back to 482'],
  ['naruto-shippuden', [218, 219, 220], 'partial', '488-489', 'three eps stretch two chapters with original expansion'],
  ['naruto-shippuden', [221], 'rearranged', '487, 489, 490', 'mixes leftover 487 with 489-490'],
  ['the-seven-deadly-sins', [77, 78, 79, 80, 81, 82, 83, 84, 85], 'rearranged', '268-296', 'Purgatory (268-284) interleaved scene-by-scene with Britannia/Mael (285-293); no anchor inside 77-84'],
  ['the-seven-deadly-sins', [94], 'graft', '327 + Side Story 5', 'one chapter padded with Escanor side story'],
  ['the-seven-deadly-sins', [97, 98], 'partial', '334-340', '337 spans both; 98 skips ahead through 338-340'],
  ['bleach', [127, 138], 'rearranged', '229', 'straddles the 128-137 filler; ep 138 reopens with it'],
  ['bleach', [119, 120], 'partial', '206-209', '206 stretched with padding'],
  ['bleach', [147, 148, 149], 'graft', 'between 247 and 248', 'anime-original Forest of Menos/Ashido arc; 149 mixed'],
  ['food-wars', [46, 49], 'rearranged', '149-151', 'survivor-hunt matches skipped then backfilled in ep 49'],
  ['food-wars', [50], 'partial', '169', "ch 169 'Revenge' NEVER animated"],
  ['food-wars', [56, 58], 'rearranged', '195-199', "Joichiro backstory lifted out of order as ep 58 after 56-57 covered 200-205"],
  ['food-wars', [60, 61], 'rearranged', '211-217', 'ep 60 jumps to 215-216; ep 61 returns to 211-214, closes 217'],
  ['to-your-eternity', [23, 24], 'rearranged', '62-66', 'order shuffled around the Uralis arrival'],
  ['to-your-eternity', [37, 38], 'divergence', '105-106', "ch 106 'Death of the Immortal' ruled into ep 38 by content evidence"],
  ['nisekoi', [21], 'graft', '51 + 57', '57 pulled forward; 52-53 never adapted'],
  ['nisekoi', [23], 'rearranged', '59-60', 'before ch 56 (deferred to ep 25); 58 → OVA'],
  ['nisekoi', [25], 'graft', '56 + 104', '104 grafted mid-season, anachronistic'],
  ['nisekoi', [28], 'graft', '107.5/116.5 + spinoff v1 + 77', 'Magical Patissiere spinoff = half the episode'],
  ['nisekoi', [29, 30, 31], 'rearranged', '82+86 / 83-85 / 93+98', 'title-match mapping — medium'],
  ['nisekoi', [32], 'rearranged', '106, 100', 'airs 106 before 100'],
  ['black-butler', [1, 2, 3], 'rearranged', '1-4 (partial)', 'openers shuffle early chapters with filler interwoven'],
  ['black-butler', [7, 8, 9, 10, 11, 12], 'divergence', null, 'anime-original interlude between Ripper and Indian Butler arcs'],
  ['black-butler', [16, 17, 18, 19, 20, 21, 22, 23, 24], 'divergence', null, "S1's anime-original Angela/Ash ending"],
  ['black-butler', [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], 'divergence', null, 'Kuroshitsuji II entirely non-canonical'],
  ['black-butler', [37], 'graft', null, 'Book of Circus premiere = original canon-compatible prologue by Toboso'],
  ['relife', [1], 'rearranged', '2,1,3-13,16,12,13,19', 'opens with ch 2, grafts 16/19 forward, skips 14-15/17-18'],
  ['relife', [13], 'rearranged', '100-108 + 112, 123', "swaps 104 after 106; grafts 112/123 — wiki flags 'heavily modified'"],
  ['relife', [15, 16], 'divergence', '157-188', 'whole arcs skipped between the OVA episodes'],
  ['relife', [17], 'partial', '199-210', 'shrine visit/third term/graduation trip skipped'],
  ['beastars', [10], 'rearranged', '37, 39, 40, 38', 'ch 38 played after 39-40'],
  ['beastars', [12], 'graft', 'ending of 53', 'S1 finale grafts ch-53 ending as an S2 tease'],
  ['beastars', [13, 14, 15, 16, 17], 'rearranged', '50-64 (49 skipped)', 'S2 opening heavily reorders v6-v7; bracket with eps 12/18'],
  ['beastars', [19, 20, 21, 22, 23], 'rearranged', '65-93 (73, 86 skipped)', 'second half of S2 jumbled; only 18 and 24 safe'],
  ['ouran-high-school-host-club', [3, 4], 'rearranged', 'ep 3 = ch 4, ep 4 = ch 3', 'physical-exam and Renge stories swapped'],
  ['ouran-high-school-host-club', [11], 'rearranged', '21', 'Kirimi/Nekozawa pulled forward from vol 5'],
  ['ouran-high-school-host-club', [17, 18, 19], 'rearranged', '28, 29-30, 31', 'jumps over all of vol 6 (22-27) straight to vol 7'],
  ['ouran-high-school-host-club', [20], 'graft', '37 + vol-7 extra', "twins' backstory reaches forward into vol 9"],
  ['ouran-high-school-host-club', [24], 'rearranged', '33', 'aired after the Kasanoda chapters it precedes'],
  ['ouran-high-school-host-club', [25, 26], 'divergence', 'anime-original (parallels 25-26)', 'Ouran Fair + Éclair are anime-only; Éclair does not exist in the manga'],
  ['black-lagoon', [8, 9, 10], 'rearranged', '2-4', 'vol-1 material moved after the Nazi and Calm Down arcs'],
  ['black-lagoon', [11, 12], 'rearranged', '16-21', 'S1 jumps over Bloodsport Fairy Tale'],
  ['black-lagoon', [16, 17, 18], 'rearranged', '38-43', 'Greenback Jane aired before Fujiyama (vol 6 before vols 4-5)'],
  ['black-lagoon', [28, 29], 'rearranged', '64-76', 'OVA interleaves late El Baile chapters out of order'],
  ['black-lagoon', [25, 26, 27, 28, 29], 'divergence', '44-76', "Roberta's Blood Trail ending differs from the manga's"],
  ['kimi-ni-todoke-from-me-to-you', [38], 'partial', '42-46', 'compresses; 44-45 dropped'],
  ['kimi-ni-todoke-from-me-to-you', [39], 'graft', '46 + 47-49 + 52-53', 're-adapts 46 as a bridge; grafts 52-53 onto 49'],
  ['kimi-ni-todoke-from-me-to-you', [39, 40, 41, 42, 43], 'rearranged', '46-75 (minus 50-51)', 'five 1-hr Netflix eps at 5-6 ch/ep'],
  ['the-ancient-magus-bride', [11, 12], 'partial', '16-20', "Lindel's tale (ch 18) compressed"],
  ['the-ancient-magus-bride', [22, 23], 'rearranged', '41-44', 'ep 23 adapts 41/43/44 out of order'],
  ['the-ancient-magus-bride', [23, 24], 'divergence', '44-45', 'anime overtook serialization; execution differs'],
];

async function dropKntRecap() {
  // trailing ep 44 = the ~14-min Netflix recap special ('S3 Episode 00');
  // recap rule (Monogatari precedent) — mirrors SOURCE_NUMBERING_SHIFTS
  const sid = 'kimi-ni-todoke-from-me-to-you';
  const { data: probe } = await db.from('episodes').select('number, title').eq('series_id', sid).eq('number', 44);
  if (probe?.length) {
    await db.from('episodes').delete().eq('series_id', sid).eq('number', 44);
    console.log(`knt: dropped recap row 44 (${probe[0].title || 'untitled'})`);
  }
  await db.from('chapter_anchors').delete().eq('series_id', sid).eq('episode', 44);
  await db.from('series').update({ aired_episodes: 43, total_episodes: 43, updated_at: now() }).eq('id', sid);
  await refreshStitchedVolatile(sid);
  await db.from('ingest_fractionals').upsert({
    series_id: sid, position: 43.5, source: 'ruling', title: 'From Me to You S3 recap special',
    note: '~14-min Netflix recap (fandom "S3 Episode 00", 2024-08-01, in-continuity BEFORE S3e1); adapts zero chapters; AFL/our data numbered it as trailing ep 44 — recap rule excludes. Research batch 10.',
    disposition: 'excluded_recap',
  });
}

async function main() {
  const runId = await startRun('resolve');
  try {
    await dropKntRecap();

    for (const [sid, ep, ch, start, adapted, vol, note] of ANCHORS) {
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: sid, episode: ep, chapter: ch, start_chapter: start,
        chapters_adapted: adapted, volume: vol, source: 'manual',
        note: `${B}: ${note}`,
      });
      if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
    }
    console.log(`anchors: ${ANCHORS.length}`);

    for (const [sid, ep, cont, why] of CONTINUE) {
      const { error } = await db.from('chapter_anchors').update({ continue_chapter: cont })
        .eq('series_id', sid).eq('episode', ep);
      if (error) throw new Error(`continue ${sid} ep${ep}: ${error.message}`);
    }
    console.log(`continue points: ${CONTINUE.length}`);

    for (const [sid, eps, kind, chapters, note] of ANNOTATIONS) {
      for (const ep of eps) {
        const { error } = await db.from('episode_annotations').upsert({ series_id: sid, episode: ep, kind, chapters, note: `${B}: ${note}` });
        if (error) throw new Error(`annotate ${sid} ep${ep}: ${error.message}`);
      }
      await db.from('series').update({ asterisk_review: 'pending', updated_at: now() }).eq('id', sid).is('asterisk_review', null);
    }
    console.log(`annotations: ${ANNOTATIONS.length} groups`);

    // ouran: pervasive reorder + anime-original finale → loose (sgt-frog class)
    await db.from('series').update({ mapping_mode: 'loose', updated_at: now() }).eq('id', 'ouran-high-school-host-club');
    console.log('ouran → mapping_mode loose (research-ruled: volume-jumping from ep 10 + original finale)');

    // structure gaps found by pin verification — Kingdom-class stitch queue
    await fileFlagOnce(runId, 'black-butler', 'resolve', 'count_mismatch', {
      note: 'Public School Arc TV (2024, chs 67-85, own eps 47-57) + Emerald Witch Arc TV (2025, chs 86-107) exist beyond our 46-ep entry; Book of Murder OVAs (38-50) + Atlantic film (51-66) are watch-order events. Stitch decision on AniList recovery; the old MU ch-108 pin belongs at the Emerald Witch end.',
    });
    await fileFlagOnce(runId, 'beastars', 'resolve', 'count_mismatch', {
      note: 'BEASTARS Final Season (24 eps, fandom cumulative 25-48; P1 2024-12, P2 2026-03) adapts chs 100-196 completing the manga — missing from our 24-ep entry. Stitch on AniList recovery; ep48→196/v22 is where the old MU pin belongs.',
    });
    await fileFlagOnce(runId, 'the-ancient-magus-bride', 'resolve', 'count_mismatch', {
      note: "S2 (2023, 24 eps, two cours) missing from our S1-only entry. For the stitch: S2e1 re-adapts ch 45+47; S2 ends ch 95 (mid-v19); continue after S2 = 96. Stitch on AniList recovery.",
    });
    await fileFlagOnce(runId, 'kimi-ni-todoke-from-me-to-you', 'resolve', 'count_mismatch', {
      note: 'our total_chapters=127 vs sources 123 (manga ended 2018, 30 vols) — extras likely counted as numbered; verify before scope math.',
    });

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: ANCHORS.length, flagged: 4 }, 'research batch 10: item-4 batch 5 (16 series, full-record protocol)');
    console.log('=== BATCH 10 APPLIED ===');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
