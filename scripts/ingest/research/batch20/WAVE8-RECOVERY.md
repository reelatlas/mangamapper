# Batch 20 — wave 8 recovery (L-D ×7 + one-piece-log's terminal; dispatched and landed 2026-09-02)

Sean's post-compact go ("just reset and ready to go"). Work-list recomputed
FROM DISK (`npm run census`, mu_pin_unverified 15 — the head seven) + the
one-piece-log entry (its franchise-frontier pin refused §12.94). PROTOCOL
amendment 2026-09-02 pinned before dispatch (R31). The killing-bites ep 11/12
date pair DEFERRED to wave 9 under the 8-agent cap (P12).

Pre-wave P5 catch (§12.95, fixed before dispatch): ruling_violation 1 —
outlaw-star's component span 1-24 ≠ ruled 1-26 — `resolveSeries`'s baseline
component upsert wrote AniList's raw count, bypassing `planComponents`.
Planner-routed, four edges redeployed, healed, system-census check 8
"component writers" added. FINDING FOR SEAN: the daily refresh-anilist edge
has not completed a run since 08-24 (volatile fields in the staging hash + one
unbatched invocation) — recorded in STATE.

## Landed (8/8, validated, committed one by one; 55 verdicts 0 failing)
| verdict | result |
|---|---|
| uq-holder | CONFIRMED: ep 12 → 134 [132] v14 (4 witnesses; 132→133→134 in running order, ch 96 relocated as the coda = `rearranged`); C5 → 135; ~52 of 134 chapters animated, holes named (43-69, 72-94, 112-125 …); flag #687 = no edition fork; ep-12 date = a late-night regime note, not a repair |
| pluto | CONFIRMED on the pages: ep 8 → 65 [56] v8 (the licensor's own act index: v8 = 56-65; the Roosevelt finale animated); Act 14 relocated to the cold open = `rearranged` (medium); C5 → 66 = nothing left; no original material |
| made-in-abyss | WRONG by one partial chapter: ep 13 → **26** [23] v4 (11 of ch 26's 16 pages animated, publisher page counts); MU's segment boundary hands the straddled chapter to the film — a convention (G37 named); repair 25 → 26; **C1 continue IN 26** (the tail is Dawn of the Deep Soul's); `divergence` (the balloon epilogue coda) + `rearranged` (ch 24 pp 15-16 post-credits); canon stands (T28) |
| orient | SPLIT: S1P1 "ch 46" CONFIRMED (ep 12 → 46 [43] v6, C2 → 47); S1P2 "ch 113" WRONG (ep 24 → **115** [112] v13 — 113 is vol 12's / the WSM serialization's last chapter; vol 13 = 114-117 per Kodansha's 初出; MU counted the magazine move, G37); repair 113 → 115; C5 → 116; flag #769 = no edition split (MU's 121 is its release ceiling); flag #438 = the **24-row identity table** in structure.notes (ja-WP + en-WP + syobocal; ep 11/12 aired back-to-back 2022-03-24); fork: ep 12 END 46 vs 47 (a 5-page sliver at the A10 threshold) |
| one-piece-log-fish-man-island-saga | THE TERMINAL: **21 anchors 598 → 653 unbroken**, all high (onepiece.fandom's Log table + opwiki.org's page ranges agree; our parent afg anchors cross-check); ep 21 → 653 [649] v66 (parent 574 / ch 654-655 never re-cut; the Toriko crossover 542 dropped); C5 → 654 (no second Log entry — parent ep 574 then 579+); C1 parity on 10 / 11 / 17; all 21 canon + one `abridged` (T28: remaster/re-dub = presentation); **5 air_date repairs rows 2-6** (Crunchyroll US dates one day early vs the Fuji TV Sunday slot — rows 7-21 will arrive with the same seeder defect); G37: "As of EP 1168" was the parent franchise frontier — the §12.94 refusal was right |
| masamune-kun-s-revenge | CONFIRMED: ep 12 → 29 [26] {26-27, 29} v6 (the S1 segment; no S2 leak; Ichijinsha's ch-29 title = the episode title); the finding is a **SKIP: ch 28 never animated** and MU's S2 starts at 30 — franchise-skipped, flagged for the R entry; `abridged`; C5 → 30 with the hole named; the "original mid-chapter close" premise FAILED; N35: stored 54 = a unit count, ceiling 49 = latest_known — no repair |
| handa-kun | chapter CONFIRMED, **volume WRONG**: ep 12 → 31 [30] {30-31} **v6** (the main story ends in vol 6 per the publisher's copy; vol 7 = four post-completion extras 32-35, never animated); repair volume 7 → 6; no back-reach; C5 → 32; flag #698 = no second edition; out-of-ask: **ep 9's filler typing suspect** (ch 19 title + TBS synopsis → mixed candidate), flagged not proposed |
| ranking-of-kings-the-treasure-chest-of-courage | **G37 twice**: MU's "Vol 12, Chap 155 (S1)" = the main TV series' endpoint AND part one's last chapter; ep 10 adapts the OPENING of part two → **161 [156] v13** (medium — a verified floor; 162+ unsummarised anywhere readable); **eps 1-9 anchor_hostile** (A44: an anthology of tankōbon 描き下ろし bonus chapters + gap-filling originals; `side_story` per identified chapter, `divergence` 4/5); `rearranged` (ch 157 to the close); C5 → 162; **20 identity repairs** (10 titles + 10 air dates); the canon/original split of 11 of 17 segments unsettled (ja-WP names four anime-original characters) — no retypes proposed, flagged |

## The L-D lane, 22/29 checked
Across waves 6-8: **11 confirmed, 8 wrong-in-part (made-in-abyss +1 partial; orient S1P2 −2; handa-kun's volume; ranking-tcoc's space; + wave 6/7's four), 3 another work's entirely** (regenesis-S1, drifters, cobra). New pathologies this wave: the SEGMENT-BOUNDARY convention (MU hands a straddled chapter to the next segment — made-in-abyss), the MAGAZINE-MOVE count (orient), the ANTHOLOGY pin (the main series' frontier on a side-story entry — ranking-tcoc), the VOLUME error with a correct chapter (handa-kun). 8 pins remain (wave 9).

## Recap baseline (generated by baseline.ts from the DB + each verdict)

### uq-holder
| ep | stored | → proposed |
|---|---|---|
| 12 | canon · anchor 134 | anchor 134 [132] (was 134); + rearranged{96}, divergence{133-134} |

### pluto
| ep | stored | → proposed |
|---|---|---|
| 8 | canon · anchor 65 | anchor 65 [56] (was 65); + rearranged{14} |

### made-in-abyss
| ep | stored | → proposed |
|---|---|---|
| 13 | canon · anchor 25 | anchor 26 [23] (was 25); + divergence{26}, rearranged{24}; repair end_chapter |

### orient (the entry holds ZERO rows — A42)
| ep | stored | → proposed |
|---|---|---|
| 12 | NO ROW | anchor 46 [43]; + partial{47 (pp. 1-5)}, divergence{43-46} |
| 24 | NO ROW · anchor 113 | anchor 115 [112] (was 113); + partial{111 (pp. 17-18)}; repair end_chapter |

### one-piece-log-fish-man-island-saga (rows 7-21 do not exist yet — AFL lag)
| ep | stored | → proposed |
|---|---|---|
| 1 | canon | anchor 599 [598]; + abridged{598-653} |
| 2 | canon | anchor 601 [600]; + abridged; repair air_date 11-09 → 11-10 |
| 3 | canon | anchor 603 [602]; + abridged; repair air_date 11-16 → 11-17 |
| 4 | canon | anchor 605 [604]; + abridged; repair air_date 11-23 → 11-24 |
| 5 | canon | anchor 607 [606]; + abridged; repair air_date 11-30 → 12-01 |
| 6 | canon | anchor 609 [608]; + abridged; repair air_date 12-07 → 12-08 |
| 7 | NO ROW | anchor 611 [610]; + abridged |
| 8 | NO ROW | anchor 613 [612]; + abridged |
| 9 | NO ROW | anchor 615 [614]; + abridged |
| 10 | NO ROW | anchor 618 [616]; + abridged; C1 → 618 |
| 11 | NO ROW | anchor 620 [618]; + abridged; C1 → 620 |
| 12 | NO ROW | anchor 622 [621]; + abridged |
| 13 | NO ROW | anchor 625 [623]; + abridged |
| 14 | NO ROW | anchor 628 [626]; + abridged |
| 15 | NO ROW | anchor 631 [629]; + abridged |
| 16 | NO ROW | anchor 633 [632]; + abridged |
| 17 | NO ROW | anchor 636 [634]; + abridged; C1 → 636 |
| 18 | NO ROW | anchor 640 [637]; + abridged |
| 19 | NO ROW | anchor 644 [641]; + abridged |
| 20 | NO ROW | anchor 648 [645]; + abridged |
| 21 | NO ROW | anchor 653 [649]; + abridged; C5 → 654 (TERMINAL) |

### masamune-kun-s-revenge
| ep | stored | → proposed |
|---|---|---|
| 12 | canon · anchor 29 | anchor 29 [26] (was 29); + abridged{26-29} |

### handa-kun
| ep | stored | → proposed |
|---|---|---|
| 12 | canon · anchor 31 | anchor 31 [30] (was 31); repair volume 7 → 6 |

### ranking-of-kings-the-treasure-chest-of-courage
| ep | stored | → proposed |
|---|---|---|
| 1 | canon | anchor_hostile; + side_story{vol 8 描き下ろし 104.5}; repair title/air_date |
| 2 | canon | anchor_hostile; + side_story{vol 6 描き下ろし 80.5}; repair title/air_date |
| 3 | canon | anchor_hostile; repair title/air_date |
| 4 | canon | anchor_hostile; + side_story{vol 9 描き下ろし 117.5}, divergence; repair title/air_date |
| 5 | canon | anchor_hostile; + divergence; repair title/air_date |
| 6 | canon | anchor_hostile; repair title/air_date |
| 7 | canon | anchor_hostile; + side_story{vol 3 描き下ろし 41.5}; repair title/air_date |
| 8 | canon | anchor_hostile; + side_story{vol 1 描き下ろし 13.5; vol 10 129.5 candidate}; repair title/air_date |
| 9 | canon | anchor_hostile; repair title/air_date |
| 10 | canon · anchor 155 | anchor 161 [156] (was 155); + rearranged{156-157}; repair title/air_date/end_chapter/volume |

## Traps learned this wave (route to research-agent at capture)
- MU segment boundaries are a CONVENTION: a chapter straddled by a season finale is assigned to the NEXT segment (made-in-abyss 26 → "Movie 3"). The pin names the last chapter adapted in full, not the furthest page reached.
- MU counts the MAGAZINE serialization's end when a manga moves magazines mid-run (orient 113 = the WSM end; vol 13 continues in Bessatsu).
- A side-story / anthology entry inherits the MAIN series' pin verbatim ("(S1) … covers skipped content") — always G37 on such an entry (ranking-tcoc).
- A correct chapter can carry the wrong VOLUME when the main story ends before the last tankōbon (handa-kun v6 vs v7 extras).
- Crunchyroll US dates seed one day EARLY against a Japanese Sunday-morning slot (one-piece-log rows 2-6); the seeder will repeat it on later rows.
- This anime borrows chapter titles one to two chapters BEHIND the content (orient) — never join on title alone.
- ja-WP "原作" comparison threads for PLUTO mean Tezuka's 1964 story, not Urasawa's manga.

## Open for Sean (rule at curation)
1. **Verification tier** (R23/R24): the weight-bearing four — one-piece-log (21-row structure), ranking-tcoc (whole-series identity + 22 repairs), orient (repair + 24-row identity), made-in-abyss (a page-count repair) — verdict-verifier reports in verify/ (dispatched at landing).
2. **Row-less landings**: orient (0 rows) and one-piece-log 7-21 — anchors land as `anchor_without_row` (A42-listed; the display synthesizes) until AFL stages the rows; the identity tables are in the verdicts if Sean wants rows MINTED from research instead (a G57 provenance question — decide).
3. **Forks**: orient ep 12 END 46 vs 47 (sliver at the A10 threshold; the agent ruled 46); ranking-tcoc ep 10 END 161 = a floor (medium); one-piece-log ep 10's END on two first-time pages of 618.
4. **Out-of-ask flags**: handa-kun ep 9 filler → mixed candidate (T28; a later pass); masamune ch 28 franchise-skipped (a note for the R entry); ranking-tcoc's four anime-original characters (segment-level split unsettled).
5. **The refresh-anilist edge** (§12.95): hash the structural subset + batch the edge — a G-family /add-rule, Sean's call.
6. Standing: the T28 six, claymore 26, lane L-P, the killing-bites date pair (wave 9).

## Next
Verify the four → Sean rules the bar → apply-wave8.ts (8 verdicts: anchors to manual tier, repairs, continues, annotations, the one-piece-log + ranking-tcoc identity repairs) → consolidate (deep only if a gate changes) → wave 9 = the 8 remaining pins + killing-bites.
