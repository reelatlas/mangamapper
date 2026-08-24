# Batch 15 — decisions for Sean (2026-08-24)

Batch 15 (exact-record promotion: 5 reorder holes + 225 rearranged-zone rows / 42 series + bookmark follow-ups) is APPLIED: 233 anchors (incl. 4 in-verdict repairs of stored values + 3 recovered-series anchors), 17 zone-level acknowledgments, 149 continue points, 127 annotations, 13 retypes, 10 curated repairs, boundary seeds (TGR:re + Clear Card research tables, Kuroko wiki re-pull, Kowloon stale row cleared), world-trigger continue_from 197→196. Census: ruling_violation 0, boundaries 0, nonmonotonic 0, verify 220/220 ok. Everything below is what needs YOUR ruling — nothing here was applied.

## A. Encoding rulings — the 4 anchors I held back (they ARE the remaining rearranged_zone_unanchored census class)

All four share one question: **may an anchor sit on a row that adapts nothing (or whose only manga content is a relocation/sliver)?** Verdict data is complete in `out/<id>.json`; applying any of these is a 1-line unhold + re-run.

1. **my-hero-academia ep 104** — pure anime-original (film prologue). Agent proposed a *position-carry* anchor (end 248, adapts nothing, continue 248) so the S5 reorder crossing is anchored end-to-end. New pattern: anchor on a filler row.
2. **cardcaptor-sakura-clear-card eps 12, 14** — typed anime-only-canon; the "grafts" are a cards-cameo (CC ch 39) and Mirage's debut (CC ch 46). Anchoring END 39/46 would poison the position curve (mainline ~12-17); annotations carry the facts today.
3. **hajime-no-ippo ep 76** — Boxer's Fist DVD special adapts only ch 383 p.4-5 (2-page gag) at run position ~270. Sliver-rule spirit says scraps never set position.
4. **hajime-no-ippo ep 127** — the agent's exact record (adapts 410-414, v46, continue→558) initially REPLACED your mu endpoint pin 558 — and eps 105-123 instantly flattened to 414 (the coverage clamp keys on the run-end anchor). I restored the 558 pin; verify is green. Real question: how should a series whose FINALE is a relocated earlier block encode its endpoint? (Options: keep mu-pin convention; or teach coverage to use max-chapter-across-anchors, then the honest ep-127 record can land.)

## B. Held repair
- **miss-kobayashis-dragon-maid ep 25** end 64→48 (+vol 7→5): your manual endpoint anchor double-claims ch 64, which is now exactly ep 22's (2 sources). Agent + I both defer to you — it's a ruled endpoint.

## C. Cross-batch conventions worth ONE ruling each (asked repeatedly by agents)
1. **Mid-chapter END**: episode ends mid-chapter → END = that chapter, continue = same chapter (stored convention everywhere). Ratify.
2. **Continue point = reader's next UNSEEN chapter** (MHA 220-style), incl. repeated targets in backfill zones (komi eps 10-14 all →56 while the S2 backfill is open). Ratify.
3. **Sampler-season END** = last chapter in running order, non-monotonic as stored (dagashi/komi/kamisama S1) — already your RUNNING-ORDER END rule; confirm it covers all three.
4. **Single-source-final**: where research proves no second source exists (silver-spoon boundaries, RAG S4 interiors, kowloon ep 12, beastars 46-47), medium anchors stand as FINAL (with do-not-demote note) instead of staying open. Ratify.

## D. Old bookmark dispositions (21 open going in; per-flag list in BOOKMARK-TRIAGE.md)
- **Closable now (research settled them)**: 873 dagashi (all 6 items settled, 4 medium→high), 874 edens-zero (contradiction-free independence sweep; ch 48 stays ep 18), 875 world-trigger (75/95→high; continue 196 applied), 876 yyh (eps 22-23 = medium-stands, documented), 880 silver-spoon (medium-stands + the one substantiated ep 19/20 shift, applied), 889 dbz-kai (recut zone →high; eps 101/165 = pure filler, ch-517-tail refuted), 878 arslan + 871 items 1-3 (verified handled by the split/stitch/heal), 893 RAG (ep 35 zone was misplaced — corrected + detached).
- **Still need you** (fold into the decision list): 872 claymore (accept derivation-grade anchors + convention C1), 891 hxh ep 7 filler→mixed (AFL dissents), 892 kingdom continue 539 ratify, 895 magus ep 29 END 56 ratify, 896 TLR total_chapters 77-vs-100, 894 slime re-verify 82-91 defer, 871 item 6 cardcaptor type downgrades (eps 4/7/5/39 — applied earlier via overrides; AFL dissents on record), 719 kenshin-2023 (gap tier), 720 monogatari (UI phase).
- **42 NEW batch-15 bookmarks** were filed (one per series with flags; full text in `out/<id>.json`). Mostly informational — sweep at leisure.

## E. special_numbered_unreviewed (2) — standing research triggers
- **shounan-junai-gumi**: the 5-ep OVA numbered 1-5 (it IS the series; likely just needs a REVIEWED-set entry).
- **cardcaptor-sakura**: Clear Card Prologue OVA (AniList 98554) numbered 71 — batch-14's recommendation to re-point component 2 (currently AniList 372 = Sealed Card film) to 98554 is still open. Structure call.

## F. New work-lists born from this batch (the program working, not breakage)
- **35 reorder holes** (was 5): interior rows of the newly-precise crossings — kamisama S2 14-24, shippuden 121-125/130-132, dragon-maid 4-7, tgre 19-22, black-butler 4-5, food-wars 17/57, naruto 108-109, tybw 39, nisekoi 26. = the natural batch-16 target list (verify --all prints it).
- **railgun ep 40** rollup {18-39} needs narrowing to {38-39} — but only after eps 26-31 (chs 18-25) get records (gap tier).
- **kowloon** volume boundaries cleared (no qualifying Wikipedia page) → ratio fallback; fandom claims v9=71-78/v10=79-87 — a research seed if you want exact vols.
- **golden-kamuy Bousou Ressha-hen** (AniList 210073, winter 2026/27) stitch still pending release.

## G. Rule/logic changes shipped this session (for the next /consolidate)
1. `audit-ui-truth`: rearranged_zone class split — `zone-acknowledged` annotations (research proved only zone-level knowledge exists) now count as `rearranged_zone_acknowledged`, not open work.
2. `apply-research-batch-15.ts`: batch-14 lineage + zone-ack write-back (ordered AFTER annotation upserts), curated repair application, EXCLUDED_ANCHORS holds, SERIES_UPDATES.
3. `assemble.ts toEpisodes`: **anchored row-less episodes synthesize canon title-pending model rows** (cells-at-work 12/13 were fully researched yet rendered as holes because AFL/wiki has no rows for them — anchor points read episodes[].mangaMapping). Central fix; full sweep green.
4. `EPISODE_TYPE_OVERRIDES`: batch-15 block (black-butler 3, bleach 149, dagashi 11, kamisama 10, dragon-maid 19-21/23, shippuden 452-457 anime-only-canon).
5. Post-verify START repairs per your AoT-87 rule (relocated openers never the position): jjk ep 30 start 64→79, shippuden ep 204 start 419→465.
