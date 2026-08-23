// Research batch 9 — item-4 batch 4 (2026-08-23): 16 series, agent-verified
// (2+ sources each, URLs in notes; full verdicts in session scratchpad
// batch9/*.json). Ruling record; re-runnable.
// FOUR REPAIRS (clear-cut supersessions under established rules — reported):
//   rent-a-girlfriend ep36: MU pin ch 255/v29 wrong — S3 ends ch 167 (first
//     ch of vol 20); the 255 pin is S5-era curation. Entry also structurally
//     STALE (S4 aired 2025 = our 37-48; S5 airing) → flag; stitch queued on
//     AniList recovery (Kingdom-class).
//   miss-kobayashis-dragon-maid ep25: MU pin ch 78/v8 wrong — nothing in
//     vol 8 is adapted; endpoint = ch 64/v7 (resume 65).
//   oshi-no-ko ep35: afg-continua ch 120 undercounts — the 1-hr S3 finale
//     ends MID-ch 127 (S3 = chs 81-127).
//   seraph-of-the-end ep25: only 24 TV eps exist; row 25 = the anime-original
//     OVA 'Vampire Shahal' (Group-C rule: drop, order-only @24.5); the MU
//     ch-41 pin re-pins to the real finale ep 24.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-9.ts

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { refreshStitchedVolatile } from './lib/resolve';

const now = () => new Date().toISOString();
const B = 'research-tier batch 9 (2026-08-23, agent-verified 2+ sources)';

const ANCHORS: [string, number, number, number | null, string][] = [
  // haikyu — To The Top part 1 (PrueShy fandom list + animefillerguide, endpoints locked)
  ['haikyu', 65, 215, 24, "ends ch 215 'Sound' (Shinzen camp). PrueShy list + animefillerguide"],
  ['haikyu', 68, 222, 25, "ends ch 222 'Enhancements' (camp ends). PrueShy + animefillerguide"],
  ['haikyu', 70, 228, 26, "ends ch 228 'Transformation' (pre-nationals). PrueShy + animefillerguide"],
  ['haikyu', 72, 234, 27, "ends ch 234 'Adjustments' (vs Tsubakihara; opens vol 27). PrueShy + animefillerguide"],
  ['haikyu', 74, 246, 28, "ends ch 246 'Evening' (Tsubakihara won). PrueShy + animefillerguide"],
  // naruto — Sasuke Retrieval (listfist + animestoryguide agree on every boundary)
  ['naruto', 110, 183, 21, 'Sasuke leaves; Retrieval Squad departs (182-183). listfist + animestoryguide'],
  ['naruto', 114, 191, 22, 'Choji defeats Jirobo (189-191). listfist + animestoryguide'],
  ['naruto', 117, 198, 22, 'Neji defeats Kidomaru (196-198). listfist + animestoryguide'],
  ['naruto', 124, 212, 24, 'Tayuya defeated by Temari (211-212). listfist + animestoryguide'],
  ['naruto', 127, 217, 25, 'Kimimaro dies vs Gaara/Lee (216-217). listfist + animestoryguide'],
  ['naruto', 132, 228, 26, 'Valley of the End escalation (226-228). listfist + animestoryguide'],
  // the-seven-deadly-sins — Wrath of the Gods (fandom + AFG row-for-row; vol triangulation)
  ['the-seven-deadly-sins', 60, 218, 27, 'Memories of the Holy War arc ends (their ep 8 = 217 + SS4 + 218). fandom WotG Episode_8 + animefillerguide'],
  ['the-seven-deadly-sins', 65, 234, 29, 'Corand arc ends; Prelude opens (231-234). fandom Episode_13 + animefillerguide'],
  ['the-seven-deadly-sins', 68, 243, 30, 'ends 243; next ep re-covers it — MEDIUM. fandom Episode_16 + animefillerguide'],
  ['the-seven-deadly-sins', 70, 249, 30, 'end of the rearranged 243-249 block — MEDIUM. fandom Episode_18 + animefillerguide'],
  ['the-seven-deadly-sins', 73, 258, 31, 'Prelude ends exactly at vol 31 boundary (256-258). fandom Episode_21 + animefillerguide + Wikipedia'],
  ['the-seven-deadly-sins', 75, 264, 32, 'linear end 264 (+part of 266 pulled forward) — MEDIUM. fandom Episode_23 + animefillerguide'],
  // my-hero-academia — Season 6 (fandom + AFG; Wikipedia arc/vol bounds independent)
  ['my-hero-academia', 122, 285, 29, "S6E9 'Katsuki Bakugo: Rising' ends ch 285 (exact vol 29 end). fandom Episode_122 + animefillerguide"],
  ['my-hero-academia', 124, 291, 30, "S6E11 'Dabi's Dance' (Toya reveal) ends 291. fandom Episode_124 + animefillerguide"],
  ['my-hero-academia', 126, 295, 30, "S6E13 'Final Performance' ends 295 (exact vol 30 end). fandom Episode_126 + animefillerguide"],
  ['my-hero-academia', 131, 306, 31, 'Deku leaves U.A.; PLW arc ends 306 (exact vol 31 end; Dark Hero = 307-328). fandom Episode_131 + animefillerguide + Wikipedia S6'],
  ['my-hero-academia', 133, 312, 32, "S6E20 'Hired Gun' (Lady Nagant) ends 312. fandom Episode_133 + animefillerguide"],
  ['my-hero-academia', 136, 322, 33, "S6E23 'Deku vs. Class A' ends 322. fandom Episode_136 + animefillerguide"],
  // bleach — early arcs (animefillerguide + Wikipedia seasons + fandom)
  ['bleach', 9, 25, 3, 'Memories in the Rain ends — Grand Fisher (20-25). animefillerguide + fandom Unbeatable_Enemy'],
  ['bleach', 17, 57, 7, 'Byakuya defeats Ichigo; Rukia taken (55-57). animefillerguide + fandom'],
  ['bleach', 20, 70, 8, 'Agent of the Shinigami arc end (65-70); Wikipedia S1 = chs 1-70. animefillerguide + Wikipedia'],
  ['bleach', 27, 89, 11, 'Ichigo vs Ikkaku done (88-89) — MEDIUM. animefillerguide + fandom'],
  ['bleach', 41, 117, 14, 'Kenpachi resolved; Wikipedia S2 = chs 71-117. animefillerguide + Wikipedia'],
  ['bleach', 54, 152, 18, 'Sokyoku scaffold destroyed (149-152). animefillerguide + fandom'],
  ['bleach', 59, 167, 19, 'Ichigo vs Byakuya bankai duel ends (164-167). animefillerguide + fandom'],
  // rent-a-girlfriend — full arc set; ep 36 REPAIR
  ['rent-a-girlfriend', 6, 22, 3, 'S1 interior — ends ch 22 — MEDIUM (single-site chain). kanokari fandom Episode_6 + Chapter_22'],
  ['rent-a-girlfriend', 12, 50, 7, 'S1 end (46-50); WDTALO resume vol 7 ch 52. fandom Episode_12 + Wikipedia S1 (chs 1-50)'],
  ['rent-a-girlfriend', 18, 73, 9, "S2 interior 'Booze and Girlfriend' ends 73 — MEDIUM. fandom Episode_18 + Chapter_73"],
  ['rent-a-girlfriend', 24, 102, 12, 'S2 end (100-102). fandom Episode_24 + Wikipedia S2 (51-102) + WDTALO'],
  ['rent-a-girlfriend', 30, 138, 16, 'S3 interior — ends 138 (+first pages of 139) — MEDIUM. fandom Episode_30 + Chapter_138'],
  ['rent-a-girlfriend', 36, 167, 20, 'REPAIR: replaces MU ch-255 pin (S5-era curation). S3 ends ch 167 = first ch of vol 20 (163-167). fandom Episode_36 + Wikipedia S3 (105-167) + WDTALO'],
  // tokyo-ghoul-re (fandom Trivia + AFG; S2 deliberately sparse — abridged zone)
  ['tokyo-ghoul-re', 2, 9, 1, 'Torso arc end (7-9, closes vol 1). fandom Re:_Episode_2 + animefillerguide'],
  ['tokyo-ghoul-re', 6, 31, 3, 'Nutcracker/Auction raid end (26-31). fandom Re:_Episode_6 + animefillerguide'],
  ['tokyo-ghoul-re', 12, 58, 6, 'S1 finale — Tsukiyama Extermination end (53-58). fandom Re:_Episode_12 + animefillerguide'],
  ['tokyo-ghoul-re', 13, 68, 7, 'S2 premiere, Cochlea Raid (60-68, skips 59) — MEDIUM. fandom Re:_Episode_13 + animefillerguide'],
  ['tokyo-ghoul-re', 23, 172, 16, 'near-linear 165-172 into confirmed 24→179 — MEDIUM. fandom Re:_Episode_23 + animefillerguide'],
  // naruto-shippuden — eps 33-87 (narutopedia + listfist + animefillerguide, triple-sourced)
  ['naruto-shippuden', 43, 296, 33, 'Tenchi Bridge mid-point (296). narutopedia + listfist + animefillerguide'],
  ['naruto-shippuden', 46, 300, 34, 'ends at vol-34 opener (299-300). narutopedia + listfist + animefillerguide'],
  ['naruto-shippuden', 53, 310, 35, 'Sai/Sasuke reunion arc end (309-310). narutopedia + listfist + animefillerguide'],
  ['naruto-shippuden', 80, 328, 36, "Asuma's death 'Last Words' (327-328). narutopedia + listfist + animefillerguide"],
  ['naruto-shippuden', 84, 334, 37, "Shikamaru's revenge (333-334). narutopedia + listfist + animefillerguide"],
  ['naruto-shippuden', 87, 339, 37, 'Shikamaru kills Hidan (338-339); meets 88→342. narutopedia + listfist + animefillerguide'],
  // komi-cant-communicate (fandom cumulative + independent recaps; validates the MU 24→129 pin)
  ['komi-cant-communicate', 6, 37, 3, "S1 midpoint — ends 'Summer Vacation' (29 backfilled + 33-37). komisan fandom Episode_6 + eng345anime"],
  ['komi-cant-communicate', 12, 73, 6, "S1 finale ends ch 73 'After-Party' (69-73). fandom Episode_12 + WDTALO + cbr"],
  ['komi-cant-communicate', 15, 85, 6, 'S2e3 completes the S1 backfill (ends vol 6) — MEDIUM. fandom Episode_15 + thecinemaholic'],
  ['komi-cant-communicate', 18, 99, 7, "S2e6 ends ch 99 'Having a Cold' (last of vol 7). fandom Episode_18 + sportskeeda + Wikipedia"],
  ['komi-cant-communicate', 21, 113, 8, 'Kyoto trip closes at 113 (last of vol 8). fandom Episode_21 + thecinemaholic + Wikipedia'],
  ['komi-cant-communicate', 24, 129, 10, "S2 finale ends ch 129 'One Year' — cements the MU pin as curated. fandom Episode_24 + WDTALO"],
  // food-wars — Season 1 (fandom infoboxes + Wikipedia plot/vol/title matches)
  ['food-wars', 2, 3, 1, 'Entrance exam ends (1-3). shokugekinosoma fandom Episode_2 + Wikipedia S1'],
  ['food-wars', 7, 13, 2, 'Soma vs Ikumi resolved = ch 13 (title match; vol 2 end). fandom Episode_7 + Wikipedia S1'],
  ['food-wars', 10, 21, 3, "camp midpoint — ep title = ch 21 'The Perfect Recette' (vol 3 end). fandom Episode_10 + Wikipedia ch list"],
  ['food-wars', 12, 27, 4, 'unofficial shokugeki vs Shinomiya ends (25-27). fandom Episode_12 + Wikipedia S1'],
  ['food-wars', 14, 33, 5, '200-egg challenge completed (31-33). fandom Episode_14 + Wikipedia S1'],
  ['food-wars', 18, 39, 5, 'Karaage Wars + election announcement = 39 (vol 5 end); eps 15-16 pre-adapted 40-44 — MEDIUM, kept for monotone 15-17. fandom Episode_18 + Wikipedia S1'],
  // blue-lock — Season 2 (fandom page-level chains gaplessly 95-149)
  ['blue-lock', 26, 100, 12, 'S2E2 ends ch 100 complete. bluelock fandom Episode_26 + Wikipedia ch list'],
  ['blue-lock', 30, 113, 14, "U-20 kickoff; 'The Big Stage' = ch 112 'Grand Stage' (ends 113). fandom Episode_30 + Wikipedia"],
  ['blue-lock', 32, 121, 14, "halftime 2-1 = end of ch 121 '1st Half'. fandom Episode_32 + gamerant + Wikipedia"],
  ['blue-lock', 35, 133, 16, "ends ch 133; ep 36 'Flowers' opens ch 134 'Flowers' — MEDIUM. fandom Episode_35 + Wikipedia"],
  ['blue-lock', 37, 143, 17, "Rin's flow state = ch 143 'Not Alone' (identical title). fandom Episode_37 + Wikipedia + gamerant"],
  // seraph-of-the-end — TV numbering; ep 24 REPAIR (re-pin from the OVA row)
  ['seraph-of-the-end-vampire-reign', 12, 15, 4, "S1 finale ends ch 15 (closes vol 4); ep 13 'Human World' opens ch 16 (same title). owarinoseraph fandom Episode_12 + Wikipedia ch/ep lists"],
  ['seraph-of-the-end-vampire-reign', 16, 26, 7, 'Nagoya opener (24-26) — MEDIUM. fandom Episode_16 + Wikipedia'],
  ['seraph-of-the-end-vampire-reign', 17, 28, 8, "Lucal Wesker assault; 'Livestock Revolt' = ch 28 title — MEDIUM. fandom + ANN ep-17"],
  ['seraph-of-the-end-vampire-reign', 18, 30, 8, "'Sword of Justice' = ch 30 title — MEDIUM. fandom + ANN ep-18"],
  ['seraph-of-the-end-vampire-reign', 20, 33, 9, "'Demon's Lullaby' = ch 33 title — MEDIUM. fandom Episode_20 + Wikipedia"],
  ['seraph-of-the-end-vampire-reign', 24, 41, 11, 'REPAIR: re-pins the MU ep-25 anchor to the real TV finale. Ends ch 41 (vol 11 = 39-43); resume 42. fandom Episode_24 + cbr + WDTALO'],
  // oshi-no-ko — S2 + S3; ep 35 REPAIR
  ['oshi-no-ko', 20, 67, 7, "S2E9 'Dream' — Tokyo Blade concludes 66, ends 67 — MEDIUM. oshinoko fandom Episode_20 + sportskeeda + thereviewgeek"],
  ['oshi-no-ko', 24, 80, 8, 'S2 finale ends exactly ch 80 (vol 8/Private arc end). sportskeeda + oneesports + Wikipedia + fandom Episode_24'],
  ['oshi-no-ko', 28, 96, 10, 'S3E4 — Akane IDs Hikaru Kamiki (93-96) — MEDIUM. fandom Episode_28 + ANN'],
  ['oshi-no-ko', 30, 103, 11, 'S3E6 (102-103; title match) — MEDIUM. fandom Episode_30 + thereviewgeek'],
  ['oshi-no-ko', 34, 118, 12, 'S3E10 — Ruby wins the Ai role (115-118) — MEDIUM. fandom Episode_34 + fandomwire + myanimeforlife'],
  ['oshi-no-ko', 35, 127, 13, 'REPAIR: replaces continua ch-120 (undercounts). 1-hr S3 finale ends MID-ch 127 p.1-12 (S3 = 81-127). Wikipedia ep list + fandom Episode_35 + dexerto + mystiqora'],
  // to-your-eternity — Season 3 (fandom infoboxes + independent recap matching)
  ['to-your-eternity', 41, 117, 13, 'S3 premiere = ch 117 only (stretched). fumetsunoanatae fandom Episode_41 + animefillerguide'],
  ['to-your-eternity', 46, 132, 14, 'ends at vol-14 boundary (130-132) — MEDIUM. fandom Episode_46 + butwhytho'],
  ['to-your-eternity', 49, 138, 15, 'Mimori resurrection = ch 138 (vol-15 boundary). fandom Episode_49 + thereviewgeek + butwhytho'],
  ['to-your-eternity', 53, 146, 16, 'ends ch 146 (vol 16 end) — MEDIUM. fandom Episode_53 + thereviewgeek'],
  ['to-your-eternity', 59, 158, 18, 'Nokkers defeated (156-158; vol-18 boundary) — MEDIUM. fandom Episode_59 + doublesama'],
  // kurokos-basketball (fandom per-episode fields complete 1-75; season ends via afteranime)
  ['kurokos-basketball', 13, 35, 5, 'Seirin vs Shutoku ends 82-81 (33-35). fandom I_Believed_in_You + Wikipedia S1'],
  ['kurokos-basketball', 25, 73, 9, 'S1 finale (Touou beats Kaijo); resume 74. fandom Our_Basketball + afteranime'],
  ['kurokos-basketball', 36, 108, 12, 'vs Kirisaki Daiichi ends, WC qualification (106-108). fandom + Wikipedia S2'],
  ['kurokos-basketball', 43, 139, 16, "WC vs Touou rematch ends (136-139 'Game Over!!'). fandom + Wikipedia"],
  ['kurokos-basketball', 50, 169, 19, 'S2 finale — vs Yosen end (166-169); resume 170. fandom Win! + afteranime'],
  ['kurokos-basketball', 62, 203, 23, 'WC vs Kaijo semifinal ends (200-203). fandom + Wikipedia S3'],
  ['kurokos-basketball', 66, 228, 26, 'Teiko flashback ends (223-228); final begins ep 67 at 229. fandom + Wikipedia S3'],
  // miss-kobayashis-dragon-maid — ep 25 REPAIR
  ['miss-kobayashis-dragon-maid', 1, 1, 1, 'premiere adapts 1-4. maid-dragon fandom Episode_1 + Wikipedia'],
  ['miss-kobayashis-dragon-maid', 8, 26, 3, 'Elma intro (23-26 contiguous) — MEDIUM. fandom Episode_8 + coolkyou-shinsha wiki'],
  ['miss-kobayashis-dragon-maid', 13, 34, 4, 'S1 end — forward progress ~34; finale remixes 19-20 — MEDIUM. WDTALO (resume vol 4 ch 35) + fandom'],
  ['miss-kobayashis-dragon-maid', 15, 39, 4, 'S2e2 (37-39, closes vol 4) — MEDIUM. fandom Episode_16 (their OVA-inclusive numbering) + WDTALO'],
  ['miss-kobayashis-dragon-maid', 25, 64, 7, 'REPAIR: replaces MU ch-78 pin (nothing in vol 8 adapted). Anime end = ch 64/v7; resume vol 7 ch 65. WDTALO + fandom Episode_23/26'],
];

const ANNOTATIONS: [string, number[], string, string | null, string][] = [
  ['haikyu', [64], 'graft', '196 + 210-212', 'ch 196 (Land vs Air material) grafted as flashback'],
  ['haikyu', [66, 67], 'rearranged', '215-220', 'ch 216 split across both; 216/217 order swapped'],
  ['haikyu', [73], 'partial', '235-242', 'compresses 8 chapters — interpolation inside inaccurate'],
  ['haikyu', [61], 'side_story', '190-199', 'OVA Land VS Air: Nekoma vs Fukurodani → Nohebi start (vols 22-23)'],
  ['haikyu', [62], 'side_story', '198-206', 'OVA The Volleyball Way: Nekoma vs Nohebi conclusion; overlaps ep 61 on 198-199'],
  ['naruto', [107], 'rearranged', '173-175, 184', 'hospital-rooftop fight adapts pre-108 chapters + ch 184 graft; non-monotonic 107-111'],
  ['naruto', [134, 135], 'partial', '231-238', 'ep 134 ends mid-235; ep 135 re-opens in 235 → 238'],
  ['the-seven-deadly-sins', [53], 'graft', '197 + 219 + 225', 'season opener re-adapts Revival ending + flash-forwards (properly covered eps 61-62)'],
  ['the-seven-deadly-sins', [69, 70], 'rearranged', '243-249', 'chapter order shuffled across both eps'],
  ['the-seven-deadly-sins', [76], 'abridged', '265-285', 'finale covers 265-268 then jumps to 272/285 material — ep76→267 soft; season ends mid-arc'],
  ['my-hero-academia', [117, 118], 'rearranged', '267-273', 'split nonlinearly; no anchors inside the pair'],
  ['my-hero-academia', [126], 'graft', '220 + 294-295', 'ch 220 p.1-11 (Twice backstory) grafted into the war climax'],
  ['my-hero-academia', [127, 128, 129], 'rearranged', '296-300', 'war aftermath told out of order; restored by end of ep 129'],
  ['my-hero-academia', [134, 135], 'partial', '316', 'ch 316 split mid-chapter'],
  ['bleach', [46], 'partial', 'gaiden -17', 'Shinigami Academy flashback adapts gaiden ch -17 — near-zero forward progress'],
  ['bleach', [31, 32], 'partial', '96-98', 'ep 32 stretches ch 98 (Renji flashback) into a full episode'],
  ['rent-a-girlfriend', [24, 25], 'divergence', '103-104', 'chs 103-104 never adapted (S2 ends 102, S3 opens 105); readers resume at 103'],
  ['rent-a-girlfriend', [35, 36], 'rearranged', '165-166', 'page-level interleaving at the climax; chapter-level still monotonic'],
  ['tokyo-ghoul-re', [7], 'graft', '16, 31-32, 31.5, 37', 'transition ep grafts aftermath/flashback incl. omake 31.5 — not anchorable'],
  ['tokyo-ghoul-re', [13], 'abridged', '59-68', 'ch 59 skipped at the S2 jump'],
  ['tokyo-ghoul-re', [14, 15, 16], 'rearranged', '63, 69-98', 'Rushima/Rose interleaved; 78-79 largely skipped'],
  ['tokyo-ghoul-re', [17, 18], 'rearranged', '99-120', 'both eps jump across ~20 chapters (104, 115 skipped)'],
  ['tokyo-ghoul-re', [19, 20, 21, 22], 'abridged', '121-164', 'whole chapters cut inside linear runs (127, 140-142, 145, 147, 154, 161)'],
  ['naruto-shippuden', [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], 'divergence', null, 'Twelve Guardian Ninja anime-original block (54-56 carry real manga; 71 mixed)'],
  ['naruto-shippuden', [54, 55, 56], 'rearranged', '311-318', 'wind-nature training chapters adapted early, interleaved with filler framing'],
  ['naruto-shippuden', [72, 73, 74], 'rearranged', '312-319', 're-covers 54-56 chapters; non-monotonic 54-74; ep 75 first clean point'],
  ['komi-cant-communicate', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 'rearranged', '1-73 with gaps', 'S1 shuffles short chapters; never adapted: 15, 49, 61, 63, 74; 56/59-60/75-85 deferred to S2'],
  ['komi-cant-communicate', [13, 14, 15], 'rearranged', '56, 59-60, 75-85', 'S2 openers = non-linear backfill (+omake 85.5) — never interpolate linearly'],
  ['komi-cant-communicate', [22, 23, 24], 'rearranged', '114-129 with gaps', 'ch 115 deferred to ep 24; 123/125 skipped; omake 128.5 in ep 23'],
  ['food-wars', [3], 'graft', '9, 17', 'grafts Ice Queen (ch 9) + ch 17 material pulled far forward'],
  ['food-wars', [15, 16], 'rearranged', '34, 40-44 (+102 graft)', 'anime swaps arc order: father-son cookoff (40-44) airs BEFORE Karaage Wars; eps 17-18 step back to 35-39'],
  ['food-wars', [19, 20, 21, 22, 23], 'rearranged', '44-58 interleaved', 'Autumn Election prelims non-linear (presentations reordered); converges at ep 24 = 58-60'],
  ['blue-lock', [29], 'abridged', '108-109', '5 chapters with page skips — densest ep of the season'],
  ['blue-lock', [30], 'graft', '~112-113', 'anime-original pre-match buildup scenes added'],
  ['seraph-of-the-end-vampire-reign', [6], 'graft', '6-7 + fragment of 21', 'Kiseki-o Box fragment pulled forward into the S1 training arc'],
  ['seraph-of-the-end-vampire-reign', [13, 14, 15], 'rearranged', '16-23 (+37 fragment)', 'early S2 reorders vols 5-6; ep 15 grafts a ch-37 fragment'],
  ['seraph-of-the-end-vampire-reign', [21], 'graft', '34-35 + ch-12 flashback', 'inserts a ch 12 flashback'],
  ['seraph-of-the-end-vampire-reign', [22, 23, 24], 'divergence', '36-41 + anime-original', 'author-drafted original content for unserialized material; positions approximate'],
  ['oshi-no-ko', [12, 13, 14], 'rearranged', '41-46', 'S2 opener told nonlinearly from multiple perspectives; linear from ep 15'],
  ['oshi-no-ko', [24], 'graft', '109 p.13-18', 'S2 finale grafts a ch-109 flash-forward; 109 proper re-adapted in ep 32'],
  ['oshi-no-ko', [29, 31], 'rearranged', '97-101, 104-106', 'ep 29 skips ch 98; ep 31 backfills it — non-monotonic between'],
  ['oshi-no-ko', [32, 33], 'rearranged', '106-114', 'scandal→movie transition interleaved (109 after 110); chapter granularity only'],
  ['oshi-no-ko', [35], 'partial', '119-127 (ends mid-127)', 'finale ends p.12 of ch 127; ch 120 partial; readers continue from mid-127'],
  ['to-your-eternity', [41, 42, 43, 44, 45], 'partial', '117-129', 'ep 41 stretches one chapter; 42-45 compress ~12 — no reliable interior boundary'],
  ['to-your-eternity', [46, 48], 'rearranged', '132', "ch 132's opening cut from ep 46, grafted into ep 48 as flashback"],
  ['to-your-eternity', [56, 57, 58, 59], 'partial', '151-158', 'chained half-chapter boundaries; interior ±half chapter'],
  ['kurokos-basketball', [14], 'rearranged', '37', "ch 37 skipped (adapted as the 'Idiots Can't Win!' BD OVA)"],
  ['kurokos-basketball', [63, 64, 65, 66], 'divergence', '204-228', 'Teiko flashback adapts 6-8 ch/ep vs ~3 elsewhere — interpolation drifts inside'],
  ['kurokos-basketball', [75], 'graft', '272-275 + epilogues', "finale adds epilogue chapters (MU's '276th')"],
  ['miss-kobayashis-dragon-maid', [3, 11, 12], 'rearranged', '8,11,22,40 / 48,K3 / 12,28,32', 'S1 pulls later chapters + Kanna spinoff forward — no tight interpolation'],
  ['miss-kobayashis-dragon-maid', [10], 'divergence', null, "'Troupe Dragon, On Stage!' — no source chapters; effectively anime-original"],
  ['miss-kobayashis-dragon-maid', [14], 'rearranged', '30,31,36,47', 'S2 premiere backfills 30-31 (Ilulu debut, skipped by S1) — non-monotonic vs ep13→34'],
  ['miss-kobayashis-dragon-maid', [16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 'rearranged', 'vols 4-7 shuffled + spinoff grafts', 'S2 interleaves non-sequentially (Kanna/Elma spinoff chapters); only season endpoints reliable'],
];

async function demoteSeraphOva() {
  // Group-C rule: only 24 TV episodes exist; row 25 = the anime-original OVA
  // 'Vampire Shahal' (trailing — no shift). Mirrors SOURCE_NUMBERING_SHIFTS.
  const sid = 'seraph-of-the-end-vampire-reign';
  const { data: probe } = await db.from('episodes').select('number, title').eq('series_id', sid).eq('number', 25);
  if (!probe?.length) {
    console.log('seraph: row 25 already gone — skip');
  } else {
    await db.from('episodes').delete().eq('series_id', sid).eq('number', 25);
    console.log(`seraph: dropped OVA row 25 (${probe[0].title})`);
  }
  await db.from('chapter_anchors').delete().eq('series_id', sid).eq('episode', 25);
  await db.from('series').update({ aired_episodes: 24, total_episodes: 24, updated_at: now() }).eq('id', sid);
  await refreshStitchedVolatile(sid);
  await db.from('ingest_fractionals').upsert({
    series_id: sid, position: 24.5, source: 'ruling', title: 'Vampire Shahal',
    note: 'Anime-original OVA (2016-05-02) released after the finale; adapts NO manga chapter; AFL numbers it as ep 25 (SOURCE_NUMBERING_SHIFTS drops). Community TV count = 24. Research batch 9.',
    disposition: 'order_only',
  });
}

async function main() {
  const runId = await startRun('resolve');
  try {
    await demoteSeraphOva();

    for (const [sid, ep, ch, vol, note] of ANCHORS) {
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: sid, episode: ep, chapter: ch, volume: vol, source: 'manual',
        note: `${B}: ${note}`,
      });
      if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
    }
    console.log(`anchors: ${ANCHORS.length}`);

    for (const [sid, eps, kind, chapters, note] of ANNOTATIONS) {
      for (const ep of eps) {
        const { error } = await db.from('episode_annotations').upsert({ series_id: sid, episode: ep, kind, chapters, note: `${B}: ${note}` });
        if (error) throw new Error(`annotate ${sid} ep${ep}: ${error.message}`);
      }
      await db.from('series').update({ asterisk_review: 'pending', updated_at: now() }).eq('id', sid).is('asterisk_review', null);
    }
    console.log(`annotations: ${ANNOTATIONS.length} groups`);

    // dragon-maid OVA fractional: research found it adapts EXACTLY the two
    // gap chapters — enrich the batch-7 record
    await db.from('ingest_fractionals').upsert({
      series_id: 'miss-kobayashis-dragon-maid', position: 13.5, source: 'ruling',
      title: 'Valentine, and Then Hot Springs!',
      note: 'Order-only OVA (batch-7 ruling) — research batch 9: adapts EXACTLY the two main-series gap chapters ch 10 (vol 1) and ch 33 (vol 4); S1+S2 = chs 1-64 minus these two.',
      disposition: 'order_only',
    });

    // rent-a-girlfriend structure gap: S4 (2025) + S5 (airing) missing —
    // Kingdom-class stitch, queued on AniList recovery
    await fileFlagOnce(runId, 'rent-a-girlfriend', 'resolve', 'count_mismatch', {
      aired: 36,
      note: 'S4 (our eps 37-48, 2025; ends ~ch 214/vol 25 per WDTALO — single source, verify) and S5 (airing 2026) are not stitched; the old MU ch-255 pin was S5-era curation. Stitch on AniList recovery, then anchor research.',
    });

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: ANCHORS.length, flagged: 1 }, 'research batch 9: item-4 batch 4 (16 series, 4 repairs)');
    console.log('=== BATCH 9 APPLIED ===');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
