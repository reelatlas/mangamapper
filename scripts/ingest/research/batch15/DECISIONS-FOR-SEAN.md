# Batch 15 — decisions (UPDATED 2026-08-24 after Sean's rulings; original list preserved in git history)

## RULED + APPLIED (Sean 2026-08-24, same day)

- **A2 Clear Card 12/14 + A3 Ippo 76 — REJECTED as anchors, kept as data.** Cameo/sliver borrowings never factor into position or the episode's chapter association; the facts live in annotations + verdict JSONs for a future "any manga content involved" UI surface.
- **A4 run-end reorders — RULED**: the finale anchors to what it actually adapts (Ippo 127 = 410-414, displays start 411 per the sliver rule — the 410 tail is 4 pages), and COVERAGE = the furthest mainline chapter adapted anywhere in the run (Ippo: 557 via ep 123 → continue-read 558, stored as continue_chapter kind 'post_series' with the why noted). Implemented in assemble.ts (coverageAnchor = max-chapter anchor; the run-end anchor stays the frontier EPISODE). Section headers show the true adapted envelope (…-557); nothing shows the continue point as if adapted.
- **B dragon-maid 25 — APPLIED**: ep 25 = 40 (flower viewing) + 48 (summer festival) + Elma OL 6 → end 48 [start 40] v5, continue 65. Ch 64 verified as ep 22's (fandom Episode_26 chapters field = "40, 48, E6"; Rory Muses). Coverage stays 64 via ep 22.
- **C1 mid-chapter END — RATIFIED** (continue = same chapter; re-reading a few pages is fine; no page-level precision hunting).
- **C2 continue-read = ANIME PARITY — RULED + CONVERTED CATALOG-WIDE**: where the next canon/mixed episode's start is known, continue = that start (even across skips/back-jumps), with the chronological next-unseen value and skip facts preserved in the new `continue_note`; `continue_kind` ∈ parity | unseen | post_series (migration 20260825200000). Conversion: 1838 rows converted, 317 stamped, 20 post-series (apply-parity-continues.ts = the record). Nothing UI-surfaced yet by design.
- **C3 out-of-order zones — RATIFIED**: represent the true episode↔chapter pairings as stored, wide section ranges are fine, divergences logged as data; 'loose' classification reserved for genuinely untrackable adaptations; cameo-grade borrowings are never chapter data points.
- **C4 single-source-final — RATIFIED.**
- **D — APPLIED**: 16 old bookmarks closed (871-878, 880, 888-889, 892-896 — research-settled or covered by C1/C2/C4 ratification). HxH 1999 ep 7 → mixed + anchored (7 [start 7] {7 p.3-9,12-19 + 8 p.2-4 sliver}). To Love-Ru Darkness → chapter math on 77 (series_scopes row documents AniList's 100 = +prologue +22 bonus chapters for future surfacing).
- **E1 shounan — REVIEWED-set entry added** (the series IS the 5-ep OVA run). **E2 cardcaptor — APPLIED**: Prologue OVA (98554) stays numbered ep 71 (REVIEWED-set entry; the bridge to Clear Card); Sealed Card = order-only @70.1 noted as the DIRECT FINALE; Movie 1 moved to its true watch position @35.1; the duplicate 70.3 prologue fractional deleted.

## STILL OPEN

1. **A1 — MHA ep 104 position-carry anchor** (Sean's clarifying question answered in chat: yes it is FILLER, not anime-only-canon; "anchor" definition + what agreeing means explained). Recommendation on the table: reject the anchor (consistent with A2/A3) and instead stop counting filler rows in rearranged_zone_unanchored — filler can't take anchors by convention, so the census line is asking for something the rules forbid. Await Sean.
2. **beastars ep 44** (anime-original ep inside the stitched Final Season): type anime-only-canon vs filler — the one bookmark item not yet ruled (flag 887 stays open).

## Post-ruling fixes shipped the same day (Sean's live reports)
- Ippo volumes all rendering v1: TWO causes — the coverage anchor (ep 123) lacked a volume (fixed: v60/v61 from fandom volume lists), and a lone stale boundary row (v61: 552-561) made `publishedVolumes=1` masquerade as "1 volume total", clamping every readout. Rule fix in assemble.ts: the published-volume stand-in only applies when the boundary table is complete from the manga's start.
- Cardcaptor 65-70 checked against batch-14 evidence: data correct (rows display each episode's START; ep 70 = 47-50 shows 47; ep 71 OVA re-adapts 46-50 → shows 46).
- HxH 1999 eps 4-6 confirmed: chs 3/4/5 respectively (padded into full episodes → mixed), ep 7 renders start ch 7.
- Dragon-maid ep 25 ch-40 question: confirmed at source (wiki chapters field "40, 48, E6").
