# Batch 19 — plan (P11: work-list from disk, 2026-08-26) — FOR SEAN'S ASSESSMENT

Source of every target: the last census (`docs/STATE.md` save point §12.64),
`batch18/WAVE2-RECOVERY.md` + `WAVE3-RECOVERY.md`, `T4-GLOSSARY.md §7`.
Cycle: plan → research (waves of 6-8, P12) → verify (different model, R24)
→ Sean rules → apply through the standing maps + `npm run heal` (no apply
script) → consolidate → capture. PROTOCOL: batch 18's is the template
(task shape only; vocabulary lives in the research-agent definition).
LOCKED series: none (P25 — no locks until the UI pass), so nothing is
excluded on that ground.

## What is NOT research (engineering / design — no agents)

| item | kind | why it is not a wave |
|---|---|---|
| **E1** `mixed_fragment_only` census class (parked /add-rule) | add-rule | the T28 discrepancy queue for rows typed mixed BEFORE the bar; a class, then Sean confirms reversals — run FIRST so its output can join lane B |
| **E2** wiki-backfill contamination (§E.8): kenshin-2023 25-27 and beyblade-x 41-44 carry another series' 1996/2001 titles + dates; `WIKI_NUMBERING_SHIFTS` unification | bug fix + healer | a writer wrote the wrong page's rows; fix the gate, purge the rows, re-pull — research would only re-find it |
| **E3** A-6: the 27 START values seeded under the old majority rule, never re-normalized to the sliver rule (A10) | healer + verify | mechanical re-derivation from stored `chapters_adapted`; results listed for Sean |
| **E4** structure rows: `episode_without_component` 32 rows / 20 series (SAO 50 movie; angel-beats 14-16; the ep-0 specials; outlaw-star 25-26 span; durarara off-by-one; fotbs 23-26; conan 1211-1212 …) → N7 rulings + `kind` components / span fixes (I33) | structure | what each row IS is already known for most (batch-18 verdicts, format overrides); the rest is a lookup, not a verdict — one narrow agent at most (lane B4) |
| **E5** T24 the LN-side instrument: 33 LN series render PENDING (novel link + volume totals + volume-space anchors) | DESIGN + build | needs Sean's ruling on the instrument (AniList novel media? MU novel entries?) before any build — a T4-style piece, not a batch |
| **E6** `watch_order_kind_missing` 36 | rulings | kinds are readable from the titles/AniList formats but titles are not rulings — lane B4 bundles them (cheap, cited) |

## Research lanes (waves of 6-8; each wave stops for the usage report)

### Lane A — the gap tier (batch-17 shape; full agents; verify whole-series claims)
- **A1 `mu_pin_unverified` (30 series)** — every one has ONLY an MU frontier pin; batch 17 found 5 of 10 wrong. One agent per series, batch-17 PROTOCOL shape (anchors, continue points): tsugumomo, mf-ghost, gangsta, cobra-the-animation, fotbs-regenesis, orange, one-piece-log-fish-man-island-saga, to-the-abandoned-sacred-beasts, btooom, prison-school, cells-at-work-code-black, made-in-abyss, soul-eater-not, d-frag, girls-last-tour, darwin-s-game, shy, uq-holder, killing-bites, ranking-of-kings-tcoc, burn-the-witch, drifters, pluto, erased, orient, masamune-kun-s-revenge, magi-sinbad, nagatoro, shaman-king-flowers, handa-kun. Short series (11-24 eps) → ~120-160k each. **4 waves.**
- **A2 `anchor_gap_research` (10)** — DBS 1-130 (102 canon eps unanchored; Toyotarou's manga is the instrument, a checkpoint lattice), d-gray-man 1-50, shippuden 480-499, hxh 79-91, bleach 152-165, saint-seiya 74-113, fotns 1-56, eyeshield 22-36, yyh 27-43, kingdom 78-102. **2 waves**, verifier on each.
- **A3 `frontier_tail_null` (8)** — akame/ajin/claymore/chrono (batch-18 follow-ups: anchors + continues on the newly canon/mixed rows), trigun, prisma-illya (structure question, batch-17 flag), rayearth 21-49 (D2 tail), apothecary-diaries (24 eps past anchor — an airing S2 tail). **1 wave.**

### Lane B — narrow bundles (3-4 agents, several series each)
- **B1 batch-18 C/A follow-ups**: claymore 21-23 → Scene 57/58/59 anchors + frontier (ep 23 → 59, continue 60); ajin anchors 14-22 + continue (ep 13 → 23; series → 29); soul-eater continue 37 vs 40; chrono 15-16 (mixed → filler?); gto 25-26 (does SJG contain an Eikichi-vs-Kadena race?); railgun 14 (same cour as the adopted arcs) and 25 (S#1 = ch 41's library scene; stored partial{~18} wrong; ep-49 graft note); DBS Resurrection 'F' 18-27 (the manga skips it → side_source to the film, which Toriyama wrote?).
- **B2 source-kind rulings (T25)**: solo-leveling, the-beginning-after-the-end (`other` → manhwa? the anime adapts the KR webtoon of a web novel), ghost-in-the-shell-arise-alternative-architecture (`other` → original? a re-cut).
- **B3 air dates (G53)**: `airdate_regression` 67 rows / 46 series + `airdate_withheld` 10 (the withheld ten and the six 351-359 d yearly typos first; kinnikuman 90-119/38/87 + railgun 14; bebop 23; ep 23 of outlaw-star = unaired, may G53 carry NULL? — Sean) — cheap per row (Wikipedia/ja-WP episode tables), 2 agents.
- **B4 structure + watch-order kinds**: the 32 `episode_without_component` rows (what IS each; N7) + the 36 order-only entries' kinds — 1-2 agents, cited from AniList/Wikipedia formats.
- **B5 `rearranged_zone_unanchored` (11)** — annotated rows with chapter data and no anchor: ajin 15-19 (B1), kinnikuman 32/46, x 9-19, tokyo-mew-mew 25-28, eyeshield 38/43/62, conan 510/511/524/585, saint-seiya 29+, bobobo 3, ranma 130, project-arms 44, emma 2 — anchor or acknowledge, per row.

### Sean-only queues (no research; his sign-off)
- `asterisk_unreviewed` 146 — the annotation sign-off queue (the UI pass will want it).
- `title_incomplete` 28 / `integrity_total_beyond_eps` 12 — mostly AFL lag on airing series (dragon-quest-dai 83 rows missing, digimon 44, hayate 47, beyblade-x 30) → a `wiki-episodes-backfill` event run after E2 is fixed, not research.
- `permanence_candidate` 34 — after the UI pass.

## Sizing
- Lane A ≈ 48 full agents ≈ 6-7 waves ≈ **7-9M research + ~2M verify** — the whole batch-17 again. Recommend splitting: **batch 19 = E1-E4 + lane B (all five bundles, ~1.2M) + A3 (1 wave, ~1M) + A1 wave 1 (the 8 shortest, ~1M)**; the remaining A1/A2 waves become batch 20 with their own usage checkpoints. E5 (T24) is its own design session with Sean first.
- Order: E1 (the class feeds B5) → E2/E3 (engineering) → B1-B5 → A3 → A1 wave 1 → verify → Sean rules → apply → consolidate (plain unless a rule changed).

## Conformance check (the structure this plan must fit)
- Work-list from disk (P11) ✓ — every target is a census line or a recovery-record entry; none from memory.
- Waves ≤ 8, stop for usage (P12/P13) ✓.
- Verify on weight-bearing claims, different model (R23/R24) ✓ — lane A always; B1/B2 always; B3/B4 only on contradiction.
- Apply through standing maps, never a script (P10/P15) ✓ — T6 / T26 / G53 / T25 overrides / A44 / format / N7 reviewed-specials / continue points (C2 map) + `npm run heal`.
- No lock skips (P25 ruled none) ✓; no chip work (Sean's UI pass) ✓; T24 is a design ruling, not smuggled in ✓.
- Every learning has a home before the batch closes (P29): rule → /add-rule; trap → research-agent.md; ruling → a map entry; class → audit-ui-truth.
