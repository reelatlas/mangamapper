# Batch 19 — wave 1 recovery record (2026-08-26)

Lane A3 (frontier tails) + lane B1 (batch-18 follow-ups) as ONE list, per Sean's
sizing. PROTOCOL pinned: `batch19/PROTOCOL.md` (batch 17's anchoring shape,
rules by id). Contexts from `context.ts` (scratchpad `b19ctx/`). Landing gate:
`validate.ts` — 8 verdicts, 0 failing. Usage: **~973k research tokens**
(5 agents: claymore 120k · ajin 155k · chrono+trigun 185k · soul-eater+gto
237k · railgun+DBS 277k).

## Landed (8 verdicts in `out/`)

| series | rows | delivered | weight-bearing |
|---|---|---|---|
| claymore | 21-24 | anchors 21→57, 22→58, 23→59 (START=END, v10/v11, 6 sources each incl. Shueisha's volume tables); continues ep 20 → 57 parity, ep 23 → 60 post_series (60-vs-61 argued); 6 repairs (C8 57→60; frontier text; delete 3 stale loose_parallel{57-59}; "outran" reason text refuted with publisher dates) | FRONTIER moves ep 20 → ep 23 |
| ajin-demi-human | 13-23 | anchors 14→24[23], 15→25, 16→26 (+28 opening graft), 17→28, 19→27.5[27]; continues 14→25, 15→26, 16→28, 17→27 parity (C3 note), 19→29 post_series; ep 22 ANCHOR-HOSTILE (A44 shape); ep 13 repairs: continue 22→23 parity, END 21→22.5 | non-monotone run (26, 28, 27.5) = needs a ruled reorder at apply; fractional ENDs 22.5 / 27.5; post-series 29 |
| chrono-crusade | 15-16, 21 | 0 anchors: eps 15-16 → FILLER (T28; Fuji TV synopses + ja-WP + tropedia) with loose_parallel{22-26}; ep 21 anchor-hostile (zone-only 36-41, would leap 31-35); continue ep 20 → 31 post_series | contradicts Sean's T6 block (14-21 mixed) — Sean rules; my brief INVERTED the verifier's flag, agent corrected from sources |
| trigun | 16, 18 | anchor 16→20[20] {16 re-staged, 20 climax} v3 (C1; ch 20 is the space's last chapter → continue 20 post_series, not 21); ep 18 anchor-hostile (Trigun Maximum ch 1-2, side_source proposed); repair ep 15 continue kind → parity | closes flag #943 |
| soul-eater | 36-40 | continue = **37** (AFG's page-level continua: ep 36 = ch 36 p.24-41 + ch 37 p.1-30; Joe's manga debut unadapted): anchor REPAIR ep 36 END 36→37 [36] (afg-continua row → manual at apply, P8); ep 38 → 39 confirmed; continues ep 36 → 37 parity/C1, ep 38 → 37 post_series; ep 37 filler confirmed; batch 18's 40 refuted (ch 39's climax = Joe's murder, unadapted) | refutes batch 18's continue 40; repairs a derivation-tier row |
| gto-great-teacher-onizuka | 25-26 | SJG DOES contain the race: vol 27 ch 234-242 "Last Signal" (239 challenge, 240-241 race, 242 crash flashback; same ¥30,000,000) → type 25-26 → CANON + side_source{SJG ch 234-242} + divergence; both anchor-hostile; delete stored loose_parallel | carves two rows out of Sean's A-7 block ruling — Sean rules |
| a-certain-scientific-railgun | 14, 25, 49 | ep 14 stays filler (backlinks index: no manga/LN page cites it; incorporation does NOT reach it); ep 25 partial{~18} → graft{41 library scene}, filler stands; ep 49: END 43 stands, chapters_adapted → "43", delete graft{41} (ch 41 is COVER-only on T#1) and the contradictory partial{40-42}; bonus repair ep 12 continue 17→18 (ch 17 animated at ep 2) | ep 25 "joins the adopted block?" (AFL anime-canon run is 20-25) — Sean |
| dragon-ball-super | 18-27 | the work is the FILM 復活の「F」 (Toriyama 原作+脚本; ja-WP in both directions); DBS-manga silence ×3; 9 rows anchor-hostile (no position in the DBS space); Reading A canon + side_source{film} (recommended, zero repairs) vs Reading B filler — moves no position either way; ep 18 loose_parallel{4} | the standing ruling is Sean's; whether it should govern eps 1-14 too |

## Not research (pulled from the wave, decisions for Sean)
- **prisma-illya**, **magic-knight-rayearth** — rulings retire when **D2 lands** (Clear-Card-style scoped entries; batch 17 holds the structure verdicts). A structure decision.
- **the-apothecary-diaries** — NO manga link (I38 found no ADAPTATION edge; two manga exist); LN instrument = T24. A manga-link ruling, then T24.
- **akame-ga-kill** — A44 rows are not a tail: `frontier_tail_null` now exempts ANCHOR_SUPPRESSED (8 → 7).

## Traps learned this wave (→ research-agent.md at capture)
- A curator's brief can INVERT a verifier's flag (chrono 15-16) — agents go to the primary sources, never the brief's paraphrase; briefs should quote the flag verbatim.
- AFG's continua panel is PAGE-LEVEL and can be right where the chart's derived row is wrong (soul-eater: "Chapter 37 (p. 1-30) … start reading from p. 31").
- Both Trigun wikis publish CONTINUOUS overall chapter numbers across Trigun → Trigun Maximum (trigunwiki `ch_number_all=21`) — 21/22 must never enter the Trigun space.
- Railgun T #1's ch-41 "adaptation" is a COVER illustration (the chapter page says so) — cover-only ties are not grafts.
- Fandom's ajin Episode 22 page carries a wrong air date — join on title/content.
- Content farms answer ajin's "where to continue" with ch 22 on the premise batch 18 overturned; expect user pushback on 29.

## Apply-layer notes (for the curate step)
- Fractional END values (ajin 13 → 22.5, 19 → 27.5): the census class `anchor_fractional_chapter` exists — Sean decides whether a .5 chapter is a legal END here (Ajin numbers 22.5 / 27.5 as real chapters).
- Ajin 16 → 26, 17 → 28, 19 → 27.5 is a documented reorder: needs the rearranged fact acknowledged (`REORDER_REGIMES` / ruled set) or `anchor_nonmonotonic` fires.
- Soul-eater ep 36 is an `afg-continua` row: the repair flips it to `manual` (P8) or the next continua apply re-derives it.
- Two verdicts contradict Sean's own T6 rulings (chrono 15-16 mixed → filler; gto 25-26 filler → canon): repairs are filed, applied only on his ruling.

## Next
Verify (R23/R24, `verdict-verifier` on a different model) over ALL EIGHT — lane A always, B1 always per the plan. Then Sean rules; apply through the maps (`EPISODE_TYPE_OVERRIDES`, standing annotations, `ANCHOR_SUPPRESSED`, continue map, C8) + `npm run heal`.

## Verification (R24, Fable verifiers, 2026-08-26) — 8/8 in `verify/`, ~986k tokens

Nothing REFUTED. Two SOUND (soul-eater, claymore's and chrono's values), six SOUND WITH CORRECTIONS — the corrections are apply mechanics, rule ids and note text, not positions. Wave-1 total ≈ 1.96M (973k research + 986k verify).

| series | verdict | corrections that change what is applied |
|---|---|---|
| claymore | SOUND w/ corr | cite C5 not C4; the three loose_parallel deletions are research-origin rows and NO delete path exists (a typed deletion shape is needed — process); flag #945 will NOT close mechanically (MU pin at "EP 24" on a filler row → G37 suppression or extend the redundancy skip, P30); "in print" sentence: tankōbon through 69, magazine through 73 |
| ajin | SOUND w/ corr | ADD a third ep-13 repair (continue_note → C1 language, else "continue at 23; skip 23"); 22.5 / 27.5 are the fandom/scanlation unit, NOT Kodansha's (FILE:27 (1)/(2)) — state the conversion, Sean picks .5 or whole; ep 19 chapters_adapted → "27 (hospital opening scene only), 27.5 (abridged)", START medium |
| chrono | SOUND w/ corr | carve 15/16 OUT of the T6 `range(14, 21, 'mixed')`; ADD the A44 entry for ep 21 (the stored ruling is only an A7 bound — no writer refuses the row today); continue note: "never adapted except the ep-22 Satella/Fiore scene (partial, v7)"; C5 not C4 |
| trigun | SOUND w/ corr | ep-16 continue 20 is a C5 DEVIATION filed as C1 — Sean rules (a) 20, (b) 21 with "continue in Trigun Maximum ch 1", (c) latest_known_chapters = 20 at the manual tier so 21 = displayTotal + 1; ADD the A44 entry for ep 18; add the trigunwiki GOODBYE FOR NOW citation; batch 20: ep 19 → TM 3-6 direct (dates), ep 20 one-directional |
| soul-eater | SOUND | ep 36 repair on an afg-continua row → manual (P8); continue 37 vs 38 is a rule-reading fork (C1 straddle vs "coverage + 1" on a one-scene END) — Sean rules it explicitly, it recurs; two note fixes |
| gto | SOUND w/ corr | REMOVE 25, 26 from the A-7 divergence span (standing-annotations.ts:489) or the healer re-stamps "RULED FILLER" on canon rows; remove the loose_parallel from the map; episode-types `range(22, 26, 'filler')` → 22-24; SJG chapters go in the NOTE, not `chapters`; "beat for beat" → "the arc's spine"; the 25/26 split is derived, not sourced |
| railgun | SOUND w/ corr | ep 49: do NOT delete graft{41} as written — T#1's own prose says the Tokiwadai scene is a redone ch-41 library scene; keep graft{41} with a corrected note (or loose_parallel{41}), delete partial{40-42}; ep 12 continue 18 must resolve parity against ep 26 (the next row with a KNOWN start), not ep 15 |
| DBS | SOUND w/ corr | side_source{film} is a valid T26 kind (no medium restriction); Reading A is STRONGER than presented — Toriyama wrote the film's 脚本 alone and the DBS manga incorporates the events (ch 5, ch 32): record the author basis?; ep 18 loose_parallel vs the series' own partial precedent (91/94/95); RF-manga ch 3 came out 3 days AFTER the film; animation comic 2015-12-04, 360 pp |

Cross-cutting, fixed between waves (R31 amendment, dated): the PROTOCOL cited `C4` for the post-series regime — it is `C5` (`C4` = single-source-final); the example anchor's volume was 11 (Scene 57 is vol 10). Capture items: lib/annotations.ts glosses `loose_parallel` as "(anime outran the manga)" — the refuted Claymore premise in the vocabulary text; a durable ANNOTATION DELETION shape (no delete path for research-origin rows); the MU "EP N" pin on studio-ending series (P30 candidate: redundancy skip when a non-MU anchor on the last canon/mixed row already covers the pin's chapter).

## Applied (2026-08-26, `apply-wave1.ts` — 42 decisions; Sean "as recommended" + four diffs)

Standing maps: T6 carve-outs (chrono 15-16 → filler; gto 25-26 → canon), T26 entries (gto side_source + divergence; trigun 18 side_source; DBS 18-27 side_source + divergence — screenplay + incorporation in the note, no adopted{author}, 1-14 untouched), A44 entries (ajin 22, chrono 21, trigun 18), the claymore "Madhouse outran" reason texts corrected. Script: 12 manual anchors (claymore 21-23; ajin 13 repair + 14/15/16/17/19; trigun 16; soul-eater 36 afg-continua → manual + 38 text), 15 curated continues (claymore 20 → 57, 23 → 60; ajin 13 → 23 with the rewritten note, 14 → 25, 15 → 26, 16 → 28, 17 → 27 + C3, 19 → 29; chrono 20 → 31; trigun 16 → 20 "space ends; next is Maximum ch 1"; soul-eater 36 → 37 C1, 38 → 37; railgun 12 → 18, 49 → 44), 12 research-origin annotations (railgun 49 graft{41} CORRECTED, not deleted), 2 deletions (railgun 25 partial{~18}, 49 partial{40-42}), railgun 49 chapters_adapted → "43", claymore C8 57 → 60. Ajin keeps the .5 unit with the Kodansha conversion (FILE:22 / FILE:27 (2)) stated in the notes.

Healer: the parity healer gained a **C1 guard** (a continue at or below its own END is a straddle — value kept, kind stamped; it would otherwise have flipped soul-eater 36 → 38). Ledger C1 enforcement site added. `npm run heal`: chrono 15/16 asserted, gto's stale loose_parallel rows removed, trigun 15 stamped parity by the guard; one unrelated conversion — my-hero-academia ep 60 → 117 parity (E3's sliver move put ep 61's START at 117; the healer followed).

Census deltas (all explained): ruling_violation 0 · frontier_tail_null 7 → **3** (claymore, ajin, chrono, trigun closed; prisma / rayearth / apothecary remain — the parked decisions) · rearranged_zone_unanchored 11 → 10 (ajin 15-19 anchored) · anchor_nonmonotonic 0 (ajin's 26 → 28 → 27.5 run is covered by its rearranged annotations) · anchor_fractional_chapter 0 · verify-series-display 220 / 0 failing.

Left as ruled: claymore's three stale loose_parallel{57-59} rows (wait for an annotation-delete shape); claymore flag #945 (MU "EP 24" pin on a filler row — G37 / P30 item); the `loose_parallel` gloss in lib/annotations.ts; trigun's durable space ruling (display total 20) so C5's 21 can become the sentinel.
