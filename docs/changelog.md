# Changelog — numbered build log (append-only)

> Moved verbatim from `docs/data-pipeline.md` §12 on 2026-08-26 (restructure phase T1.1). New entries append at the end with the next §12.N number — the numbering continues so every existing citation ("§12.45") still resolves. Rules ratified in an entry MUST also become a ledger record (`/add-rule`); an entry is history, never the only home of a rule.

## 12. Build order & status

1. ✅ This document.
2. ✅ Schema migrations (staging + canonical + ops + franchise structure + own-slug identity).
3. ✅ AFL fetcher/parser (fixture regressions: naruto, ep-0, dup-row) + matcher (AniFiller seed → exact/synonym w/ format preference).
4. ✅ AniList puller (30/min paced).
5. ✅ Backfill + repair passes: **289 series / ~16.9k episodes in canonical**; alias corruption quarantined; exclusions/duplicates/empties applied.
6. ⏳ Franchise evaluation (research → docs/franchise-rulings.md → Sean confirms) + the stitcher (multi-season chains → series_components) + manual-mapping batch for the last ambiguous slugs.
7. ✅ AFG parser + backfill: **dense per-episode chapter anchors** (their pages
   are episode→chapter conversion tables) — 23 series / ~2.8k anchors incl.
   One Piece's full 1,077. Strict episode-cell parsing (summary rows must not
   digit-mash) + alignment gate (±12) withholds scope-mismatched pages (AFG's
   Bleach page spans TYBW; their Tokyo Ghoul spans all series). Learnings:
   staging should keep raw HTML so parser fixes don't need re-fetches; AFG
   also chapter-maps ~80 shows OUTSIDE the AFL spine (Frieren, Solo
   Leveling…) — a ready catalog-expansion source later.
8. ✅ `SupabaseCatalogSource` swap (2026-08-22): the app reads canonical via
   the anon key (RLS verified: staging/source_map blocked). `list()` stays
   shallow; episodes+anchors page in on card-open; `getMapping` mirrors the
   mock's exact span/continue-point/manga-ahead semantics.
   `MangaMapping.volume` is nullable (AFG gives chapters, not volumes;
   ratio-estimated when totals known). `DEV_FILLER` retired.
9. ✅ Volume boundaries (2026-08-23): Wikipedia-derived, 25/29 anchored manga,
   888 rows — One Piece ep 1000 → ch 990 → vol 98 of 115, all from our data.
10. ✅ Source-scope enforcement + data-honesty pass (2026-08-23, driven by
   Sean's visual QA): series_scopes curation + discovery guard; anchor
   monotonicity filter; tail coverage gate; base-type padding; count-driven
   legend. Every fix was a mock-era assumption exposed by real data.
11. Promote refreshers to Edge Function + Cron (backfill honors dispositions; weekly AFL tier + daily AniList tier; periodic audit-titles re-audit). Fixed-weekly ruling: §11. **← next build item.**
12. ✅ AniList recovered 2026-08-23; the recovery batch completed: ~28 scope
   stitches auto-ran + override chains (Tokyo Ghoul S1+√A, :re, UBW, Berserk
   2016+2017, Kenshin 2023+Kyoto, Blade of the Immortal). Berserk fully
   curated (scopes + wiki anchors, all three entries).
13. ✅ AFG expansion (2026-08-23): +36 AFG-only series (canonical: 326), AFG
   type encoding parsed, all guards applied; 6 candidates correctly flagged
   as probable-existing-series (triage list).
14. ✅ AFG structural cross-check + triage batch (2026-08-24, Sean's go on
   all three tracks): `audit-afg-structure.ts` built (repeatable scan:
   naming/grouping/hierarchy vs AFG) → **66 registered AFG identities**
   (tiers + RULED map), stitch-aware expansion (**+8 series: Solo Leveling,
   Oshi no Ko, Apothecary Diaries, Iruma-kun, Shangri-La Frontier, Kimi ni
   Todoke, World Trigger, Café Terrace** — canonical: 334), `afg-extend.ts`
   (**17 series extended** where AFL lagged: dan-da-dan 3→24, dr-stone
   58→94, blue-exorcist 37→73, One Piece current), ownership guard +
   prequel-hijack fallback in lib/chain.ts, MU class-B frontier targets,
   AFG raw_html greedy staging (reading-guidance prose for the IA phase).
   Old triage items 1 (register-to-existing + title-variants) fully
   absorbed; item 2 (airing-pendings) via MU class B.
15. ✅ Coverage close-out (2026-08-24 end): registry-first anchor sync +
   MU class B → **194 anchored / 36 synthesized / 89 mu-frontiered / 0
   airing-pendings / 0 data holes**. AoT 94v89 ruled (AFG interleaves the 5
   OADs — IA-phase chain-override material). AFL-extras flags ruled per-case
   (Angel Beats OVAs + Kenshin 95-100 real content kept; Conan = airing
   lag). Flag queue deduped (cleanup-flags.ts); tokyo-ghoul #578 stays open
   as the standing ruled-split marker.
16. ✅ UI-truth pass (2026-08-24, Sean's QA: Cuckoos "36/24", 86 blank):
   `audit-ui-truth.ts` replicates buildMapping's exact decisions per series.
   Structure-based extend candidacy fixed the pre-stitch-aware class (12
   re-componentized: Frieren 38, Cuckoos 36…); volumes-backfill rerun for
   the newly anchored manga (boundaries 888 → 3,345 rows). End census:
   **220 full vol+ch / 17 ch-only / 3 pending / 93 no-source** — of the 93,
   52 originals correct, **38 = the LIGHT-NOVEL CLASS (86, Re:Zero, SAO,
   Overlord…): no instrument because their ADAPTATION edge is format NOVEL.
   Proposed: LN-volume instrument (AniList NOVEL volumes + MU LN coverage),
   awaiting Sean's presentation ruling**; DB Super/GT deliberate.
17. ✅ Wiki flag triage (2026-08-24): search fallback now REQUIRES token
   overlap between the found page and the manga title (it had matched
   "Ranma ½ chapters" for Dress-Up Darling, "Delta Kappa Epsilon chapters"
   [a fraternity] for ReLIFE); 18 stale flags dismissed (their manga now
   have boundaries — the parser dialects were already fixed). NEW FINDING:
   the exceed-totals gate compares manga-GLOBAL wiki boundaries against a
   series' SCOPED totals, so scoped entries (Bleach 675v479, Berserk
   374v94) false-positive — fix belongs to the segment model (compare
   against the manga's own totals/family max).
18. ✅ RULED + BUILT (Sean 2026-08-24), pending his visual confirm — the
   D-Frag tail gap: latest_known is the EFFECTIVE total (tail math + bar
   cutoff) while displayed totals stay null to signal "ongoing" (§10
   effective-total rule). Same session, Sean's MHA report exposed the
   STALE-ANCHOR class (30 series: sparse AFG pages — MHA's anchors stop at
   ep 13/170, Naruto's at 27/220): fixed by MU class C (curated
   anime-coverage as the real frontier) + the anchor-freshness rule;
   MU-less stragglers carry research flags, never guesses. Sean's source
   strategy ratified: AniList has no current-chapter field, so frontiers
   come from MU (or research); every source contributes what it actually
   knows.
19. **POST-COMPACT AGENDA (Sean 2026-08-24, in order):**
   a. **Kenshin read-path debug — RESOLVED 2026-08-23 (for real): CARD
      HYDRATION GAP.** First diagnosis ("stale client") was WRONG — Sean's
      screenshot disproved it. Actual cause: AnimeCard received the SHALLOW
      catalog-list item (list() deliberately skips episode hydration —
      episodes:[]) and only fetched the mapping on expand, so
      buildEpisodeList + the position lookup ran with NO episode rows: no
      titles (title_pending everywhere), no anchor mangaMappings, no
      boundaries → pure origin→frontier linear (ep 28 = 52 exactly).
      getMapping reads anchors DB-side, which is why spans/latestKnown/151
      were right while every per-episode value was an estimate. FIX:
      AnimeCard hydrates via useCatalogSeries (getById) on open; shallow
      item renders identity fields until it lands. Reproduced+verified both
      paths through the real modules (shallow = Sean's screenshot exactly;
      hydrated = ep 28 vol 7 ch 48, header vol 7-18 · ch 48-151, titles
      present). LESSON (iron-clad): any component consuming episode-level
      data must consume the HYDRATED series — the shallow list item is for
      list rendering only. THEN:
   b. **Side-story notation — DATA MODEL SHIPPED 2026-08-23** (the asterisk
      model, §10): Kenshin 95-98 carry side_story annotations ('pilot
      one-shots'); Claymore 21-23 loose_parallel; Kowloon 12-13 divergence;
      etc. REMAINING: the UI representation pass (how the asterisk renders
      and expands) — designed with Sean during the loose-adaptation /
      annotation UI phase.
   c. **Anchor-gap research program (Sean approved; REFRAMED 2026-08-23 by
      the continua ruling)**: first pass = AFG continua extraction (rule-
      based, gated — see §10) supplies END-frontiers catalog-wide; Wikipedia
      + manual research remain CO-VERIFIERS on everything continua covers
      (Sean: never limited to what it doesn't cover) AND the source for what
      it can't (INTERIOR arc-boundary anchors — continua only gives the
      run's end). Then the manual batches (15-20 by popularity, ≥2 sources,
      re-audit per batch) work the remaining anchor_gap_research list.
      Kenshin was the pilot (Kyoto ep 28 → ch 48).
   c2. **source_map cleanup (Sean's rulings 2026-08-23, applied)**:
      kuroko recovered (75-row Wayback page → kurokos-basketball, 3 seasons
      stitched) · noragami-aragoto = merged (already inside noragami) ·
      digimon-tamers wrong-match cleared · miraculous + 3 pokemon excluded
      (out of scope) · shy AFL excluded (AFG is its source) · sparse holds
      KEPT (auto-return at 60%) + actively closed via better sources — AFL
      becomes validation when it returns · PENDING: canon-tier creation
      (Sean ruled YES) for manga-sourced shows with no episode chart
      anywhere (~0% filler): SHY, Cells at Work ×2, Ranking of Kings,
      Chrono Crusade, Orient, Shaman King 2001, + sparse-hold shows where
      sources allow (City Hunter, Kinnikuman, Elemental Gelade, Shonan) —
      canon-default typing (existing spans gap rule), AniList structure,
      AFG continua anchor, MU upkeep. Anime-original holds (Gundams,
      Digimons) have no manga side — watch-order value only, defer.
   d. **EPISODE DATA COMPLETENESS initiative (Sean's directive; scope
      WIDENED 2026-08-23 to titles + AIR DATES)**: titles and air dates
      become first-class across every fetch, freshness mechanism, and rule
      — never title_pending, never a hidden year line. Sources: AFL rows +
      AFG rows (already stored; junk-pattern titles now normalize to
      pending at parse), Wikipedia episode lists (parser addition — titles
      AND air dates on the same pages), AniList entry data (per-season
      start/end dates + special/movie labels, already staged). Audit
      classes title_incomplete (77) + airdate_incomplete (67) are the
      standing work-lists. Plan: populate by precedence → discrepancy →
      flag → research tier. Titles also power research correlation
      (matching specials by NAME — the Kenshin pilot-one-shot method).
   e. Standing queues: **Slime structure gap** (entry holds only S1's 24
      eps — stitch S2/S3, then MU coverage can pin correctly; found by the
      chapter-space gate 2026-08-23) · **4KOTA MU self-inconsistency**
      (coverage says ch 120, releases say 103 — research which is right) ·
      26 numbered-specials evaluations (ask-Sean loop) ·
      LN-instrument decision (38 series) · segment-model UI (universe view /
      handoff pointers) · Dororo eps 16-24 typing · wiki 4th dialect + MU
      unbridgeable (~29) · AFL-sparse keep-vs-dismiss ruling · ruled-split
      anchor routing · footer credits · Sean review bookmarks (6, incl.
      monogatari UI note) — query: detail->>'kind_of_note' =
      'sean_review_bookmark'.
22. ✅ **Consolidation pass 3 (2026-08-23 end — the pre-item-4/5 rescan)**:
   all 266 AFG staged pages RESTAGED from stored html with the current
   parser (45 carried junk titles — staging must never hold what a current
   parse wouldn't produce); all four edges rebuilt + redeployed; continua
   sweep re-run (72 applied / 8 kept_curated / 2 suppressed); coverage
   audit + cleanup-flags run. NEW RULE — source suppressions
   (CONTINUA_SUPPRESSED): same-episode precedence can't stop a ruled-WRONG
   source value landing on a DIFFERENT episode (Claymore/Kimi resurrection
   caught by the rescan) — research can now suppress a source per series,
   writer-enforced + ruling_violation-audited. Section headers render
   PARTIAL knowledge ("ch 48-60+", vol same) instead of a dash when the
   frontier sits inside a section. Research batch 4 (agent-verified):
   TYBW part boundaries eps 13/26/40 → chs 542/609/661 + scope end 686
   (AniList 706 = count space) + Part 3 = eps 27-40 correction; Railgun T
   ep 73 → ch 96 (magazine 96/97 merge noted, continue 98); Tokyo
   Revengers eps 24/37/50 → chs 73/121/185. pending_airing_no_anchor = 0.
   Census: ok_full 235 / 4 loose / all integrity classes 0. Shonan
   creation auto-retrying (AniList outage, their side).
23. ✅ **REVIEW-QUEUE RULINGS + Consolidation pass 4 (2026-08-23 end —
   SAVE POINT; Sean signed off all four queues)**: Q1 fractionals — all
   dispositioned with reasoning (UY 193.5 + Dr. Stone 24.5 =
   excluded_recap; Cells 11.5 Pocari collab = order_only; Ryuusui =
   modeled). Q2 — Groups A+B (19 entries) marked REVIEWED as episodic
   canon (kind stays on comps for UI differentiation; B = medium
   confidence); Group C (7) DEMOTED to order-only with full renumbering
   (comps, rows, anchors, annotations shifted; SOURCE_NUMBERING_SHIFTS
   entries added so AFL refreshes translate; watch positions re-swept —
   21 order-only comps tagged). Q3 — LN volume-space instrument ruled
   (build pending). Q4 — four bookmarks closed with resolution verdicts
   (kenshin, haikyu, boruto, x); kenshin-2023 + monogatari stay open.
   ALL review classes at 0 (special_numbered_unreviewed 26→0,
   fractional_unmodeled 0, ruling_violation 0). Item-4 batches 1-2 done
   (30 series, 93 anchors); item-5 curves: title_incomplete 77→27,
   airdate_incomplete 67→22. /consolidate SKILL created. NEXT: item-4
   batch 3 · Kingdom S5/S6 stitch · LN volume instrument build ·
   item-5 tail (SHY case-sensitivity, kenshin-2023 namesake, One Piece
   later seasons, WTC Gou rows) · TYBW Part 4 anchor (Sep 2026) ·
   asterisk queue (12) = UI phase.
24. ✅ **/consolidate `deep` mode (2026-08-23, post-compact; Sean
   directive)**: skill amended with an optional step 9 — full-catalog
   rescan against current rules. Notes/rulings/suppressions are
   precedence, not blindfolds: still scanned each deep pass; a note
   blocking something no longer valid goes to Sean with evidence; a
   clear-cut supersession under an established rule is applied with the
   note updated and reported (never silent). Stale cleanup (dead
   constants, orphaned staging, lingering flags) with every deletion
   listed. Permanence tiers: finished + fully published + Sean-signed
   series are LOCKED (decisions permanent, exempt from routine deep
   rescans unless a rule change explicitly touches them); the locked set
   grows over time until deep passes become rare — the goal state.
25. ✅ **ITEM-4 BATCH 3 = research batch 8 (2026-08-23, post-compact)**: top-16
   anchor-gap tier by popularity (AoT, JJK, MHA, HxH-2011, Naruto,
   Shippuden, Bleach, AssClass, Haikyu, Black Clover, 7DS, Fire Force,
   Blue Exorcist, TokyoRev, Bungo, Food Wars) — 16 parallel research
   agents, 2+ sources each, 89 anchors + 47 annotation groups applied
   (apply-research-batch-8.ts; full verdicts in session scratchpad).
   FOUR REPAIRS (clear-cut supersessions, reported): HxH ep80 afg ch-204
   was a GRAFT artifact (Gyro's Story pulled forward; manual ep80→190 +
   interior 87/90/94/95/97/98); Food Wars MU end-pin ep86→264 was the S4
   boundary (real: ep73→264, terminus ep86→315, S5 divergence
   annotated); Bungo AFL counts the 2017 OVA as ep 25 (renumbered to the
   60-ep TV space + SOURCE_NUMBERING_SHIFTS + fractional @24.5; fandom
   'ep 61' = TV ep 60 — the MU pin question resolved); Vanitas ep5
   ch-15.5 (Sean's catch) = Entracte bonus mis-scraped (manual ep5→10 +
   6-8 filled + graft annotation + the fractional-chapter gate). Black
   Clover 130-157 research-typed (anime-only-canon/filler per 2-of-3
   sources; zero chapters adapted — gap counter now excludes
   anime-only-canon). anchor_gap_research 108→100 (14/16 cleared;
   naruto 101-134 + haikyu 61-74 = new next-tier stretches).
   integrity_total_beyond_eps surfaced 11 AFL-sparse finished series
   (rows < aired — the documented backlog, now a visible work-list).
   asterisk_unreviewed 17→30 (13 new pending sign-offs). Also:
   /consolidate deep mode (entry 24), degenerate-span guard + audit,
   fractional-chapter gate + audit. Shonan retry expired (AniList still
   down). ruling_violation 0; census ok_full 234 / no_volume 11 /
   loose 5.
26. ✅ **ITEM-4 BATCH 4 = research batch 9 (2026-08-23)**: next 16-series
   gap tier (MHA S6, Naruto retrieval, Shippuden 33-87, early Bleach,
   Haikyu TTT, 7DS Wrath, Food Wars S1, Blue Lock S2, Komi, Oshi no Ko,
   To Your Eternity S3, Tokyo Ghoul:re, Kuroko, Dragon Maid, Seraph,
   Rent-a-Girlfriend) — 93 anchors + 53 annotation groups
   (apply-research-batch-9.ts). FOUR MU/continua pins REFUTED and
   repaired: RAG ep36 255→167/v20 (255 was S5-era curation), Dragon Maid
   ep25 78→64/v7 (nothing in vol 8 adapted), Oshi no Ko ep35 120→127
   (finale ends mid-127), Seraph ep25 = the anime-original OVA 'Vampire
   Shahal' (Group-C drop + shift entry; anchor re-pinned to TV ep 24 →
   41/v11). Dragon Maid OVA enriched: adapts EXACTLY gap chs 10+33.
   RAG structurally STALE (S4 2025 + S5 airing missing) → flagged,
   stitch queued with Kingdom on AniList recovery. Also this session:
   /consolidate deep mode ruling amendment (bonus chapters
   record-never-drop, §10), divider/LNDS derivation fix (Naruto 6-27
   regression healed; ok_full 234→237), curated-consistency precedence
   (Boruto ep-219 lesson), AssClass batch-8 transcription patch.
   anchor_gap 108→89 across both batches; asterisk pending 41;
   ruling_violation 0. Gintama (345-ep desert) deferred to a dedicated
   pass. Shonan watcher re-armed (24h, 30-min checks; AniList still
   down).
27. ✅ **DISPLAY/CONTINUE SPLIT (2026-08-23, Sean's first-chapter ruling —
   v2 after Sean's routing catch)**: episode rows display the FIRST
   chapter animated. v1 derived starts by formula and MISSED anchored
   rows (Oshi ep 35 still showed 127 — the exact-mapping branch
   bypassed the derivation). v2 = Sean's correction: starts are DATA —
   chapter_anchors.start_chapter (migration 20260825170000) captured
   from AFG chart rows by deriveAnchors on every refresh (edges
   redeployed; 3888 anchors backfilled via restage+rederive) + 27
   research-anchor starts seeded from batch-8/9 span verdicts
   (apply-start-chapters.ts). Source layer emits real spans
   ("119-127"); display takes the first number on BOTH anchored and
   estimated rows; formula = fallback for end-only anchors. Anchors
   stay end-position instruments (scan: all 4337 consistent).
   chapter_anchors.continue_chapter (migration 20260825160000) stores
   continue-reading exceptions (9 seeded; default end+1). UI surfacing
   of continue points deferred; display fix live. Future batches
   include start_chapter.
28. ✅ **FULL-RECORD RULING + CONSOLIDATE DEEP PASS 1 (2026-08-23 end)**:
   Sean's full-data directive → chapters_adapted (migration
   20260825180000; 3888 anchors carry the complete in-order adaptation
   list from chart rows, edges redeployed) + anchor numbering
   translation (translateEpisodeNumber closes the shift-series gap) +
   serializeChapters canonical form. DEEP PASS findings: (1) MU-pin
   regression CAUGHT + FIXED — the freshness/no-progress gates deleted
   run-end pins when batch-9 interior anchors landed nearby (Sean's AoT
   88-89 report = live symptom); redundancy now keys on the pin episode;
   frontier_tail_null 23→7, BETTER than the old 14 (the gate had been
   suppressing pins pre-existing). Remaining 7 tails = honest set
   (Kenshin side stories, Soul Eater/Twin Star anime-original endings —
   future type-override research, One Piece airing lag). (2) Naruto
   'mixed' report investigated: AFL's Mixed Canon/Filler classification,
   long-standing data matching animefillerlist; hydration made real
   types visible — data correct. (3) Note re-validation: flags on
   repaired series (bungo/seraph/rag/kingdom/food-wars) all still-valid
   forward-looking notes; ruling constants all reference live series;
   nothing stale to delete. (4) Permanence tier: LOCKED set empty until
   asterisk sign-offs begin (41 pending — Sean's queue). Census:
   ok_full 238, ruling_violation 0, all anchor-integrity classes 0.
29. ✅ **ITEM-4 BATCH 5 = research batch 10 (2026-08-23) — first
   FULL-RECORD batch**: 16 series, 95 anchors each carrying end +
   start_chapter + chapters_adapted + volume, 28 continue points, 63
   annotation groups (apply-research-batch-10.ts). SIX REPAIRS:
   black-butler ep46 108→36/v8 (MU folded in OVAs/film/2024-25 TV;
   those seasons = stitch flag), beastars ep24 196→99/v12 (whole-manga
   pin; Final Season 25-48 missing = stitch flag), magus-bride ep24
   95→45/v9 (S2 endpoint bleeding into S1-only entry; S2 missing =
   stitch flag), nisekoi ep32 107→106/v12 (MU stored the CONTINUE
   pointer as an end anchor — new failure mode), kimi-ni-todoke
   trailing ep 44 = Netflix recap special (recap rule: dropped + shift
   entry; frontier re-pinned 43→75/v18; 127-vs-123 chapter-count flag),
   ouran → mapping_mode loose (volume-jumping from ep 10 +
   anime-original finale; MU pin → continue point 37). Black Lagoon's
   pin VERIFIED (29→76/v9) with its arc reorders stored as adapted
   (5 load-bearing continue exceptions); ReLIFE pin verified (222 =
   story end; 238-vs-222 = unadapted x.5 extras); TYE S1 endpoint
   corrected (ep 20 = chs 53-54, new anchor). anchor_gap 89→76;
   asterisk pending 49; stitch queue now Kingdom + RAG + Black Butler +
   Beastars + Magus Bride (all AniList-gated). ruling_violation 0;
   ok_full 238; tails hold at 7.
30. ✅ **ITEM-4 BATCH 6 = research batch 11 (2026-08-23) + MU-pin rule**:
   mu_pin_unverified audit class created (5-of-10 wrong-pin rate made
   unverified solo pins a standing work-list; 84 at creation → 78 after
   this batch; short series below the gap threshold now stay visible).
   16 series, 95 full-record anchors, 15 continue points, 55 annotation
   groups (apply-research-batch-11.ts). PIN VERDICTS: WRONG ×3 —
   cells-at-work 30→25/v5 (MU counted the Special), gto pin sat on the
   anime-original ep 42 (true end 41→105; eps 22-28/34/42-43 typed
   anime-only-canon), yyh pin on a phantom row. VERIFIED+promoted ×7 —
   summer-time-rendering 25→139 (complete adaptation), blood-blockade
   24→30 (+ LOOSE ruling — anime-original White/Black thread),
   inuyasha 193→558 (+9 Final Act interiors), ranking-of-kings 23→155
   (single numbering proven), kamisama-kiss 30→149 (finale OVA really
   adapts the ending; unadapted gaps 65-79 + 102-145 recorded),
   shangri-la 50→126 (S3 Jan 2027), tybw part-3 interiors. YYH deep
   finding: AFL renumbered trailing extras after our drop — the 2018
   OVA re-entered as ep 113 → COMMUNITY cap 112 is the durable
   instrument (cap added; OVAs recorded order-only WITH their real
   adaptation data: Two Shot = vol-7 bonus, All or Nothing = 173-174).
   Boruto 221-286 typed anime-only-canon (Sasuke Retsuden spin-off trap
   documented) + Code's Assault 287-293 full records. Berserk ep-1-4
   scheme fix (unnumbered prologue chapters — old annotation
   superseded). anchor_gap 76→66; asterisk 61; ruling_violation 0.
31. ✅ **ITEM-4 BATCH 7 = research batch 12 (2026-08-23)**: 15 series,
   124 full-record anchors, 24 continue points, 39 annotation groups.
   PIN VERDICTS: WRONG ×3 — golden-kamuy 302→139/v14 (a SEASON-FIVE
   pin; S3-S5 = 38 eps finishing the manga → stitch flag #7), rosario
   ep26 ch-19 REJECTED (new failure mode: Wikipedia's series-summary
   line stamped onto the last episode — ch 19 aired as ep 7; loose),
   ajin ch-22 = continue-point misread (S2 anime-original → typed;
   honest end ep13→21/v5). VERIFIED+promoted ×5: to-love-ru 44→162
   (manga end; 2008 series loose; full Motto segment maps + never-
   adapted sweep), bokuben 26→69 (loose), platinum-end 24→58,
   hxh-1999 92→185 + railgun 73→96 (full records). Railgun typed
   (S1 back half + Silent Party anime-only; ep-14 ch-17 graft
   excepted); manga CONCLUDED 2026-03 (stale-ongoing flag). Shippuden
   endgame = 20-anchor per-episode map (chs 663-699). Ippo: comps
   verified (NC 77-102, Rising 103-127); Champion Road (291-313) +
   Mashiba/Kimura OVA (270-289) get order-only records WITH spans.
   Audit rule: LOOSE series skip monotonicity entirely (borrow-maps
   render as stored). anchor_gap 66→58; mu_pin 78→72; loose 10;
   ok_full 235; ruling_violation 0.
32. ✅ **START-SANITY + OSHI/BLACK-LAGOON FULL MAPS (2026-08-23, Sean's
   Oshi 20-29 + ep-4 reports)**: deriveAnchors START guard (raw row min
   ≠ start — stray low values poison it exactly as stray highs poisoned
   ends pre-LNDS; start = lowest mainline ch on the LNDS trend, off-trend
   values stay in chapters_adapted; Oshi ep 4 healed 10→17). All AFG
   rederived; edges redeployed. New OUTCOME class anchor_start_offtrend
   (audit select now fetches start_chapter — the missing-column trap,
   round 2). Its first run caught GTO 13/14's unannotated interleave
   (batch-13 annotations) and Black Lagoon's stale batch-10 arc-BLOCK
   anchors coexisting with the pass-2 per-episode map → pass-3 replaced
   all 7 blocks + mapped ep 21 + set S2-finale continue=44 (Greenback
   Jane aired out of order); ep 7 = standalone 'Calm down, two men'
   (9-10), NOT the Adler conclusion. BATCH 13: Oshi no Ko fully anchored
   1-35 (11 interior anchors, 2 mid-chapter continue points). The
   r/OshiNoKo ratio thread (= Google AI's instant answer) proved
   SYSTEMATICALLY WRONG for eps 15-22 + all S3 (claimed an 82-87 skip
   that doesn't exist; S3 is linear 81→92; ep 20 = 65-67 as we had it;
   finale = mid-127 not 122) — fan threads are cross-check inputs,
   never sole truth (§10). Sean's screenshot values matched NO version
   of code+data → stale browser tab (hard-refresh); interp starts for
   25/26/27 (81/85/89) matched research exactly. Census: all anchor
   classes 0; ruling_violation 0; ok_full 236; gap 58.
33. ✅ **AoT FINALE+S4P2 + THE VERIFIER (2026-08-23 end, Sean's ep 89 →
   85/86/87 reports + "check ALL episodes after every adjustment")**:
   (a) AoT ep 88 anchored (131-134, was MISSING), ep 89 promoted from
   unverified MU pin to full record (135-139 + vol-34 extended-ending
   pages, graft annotation; chapter-space 140-141 = unadapted omake,
   honest frontier). (b) Eps 76-87 fully per-episode anchored (fandom +
   animefillerguide + doublesama): mostly 1-2 ch/ep; ONE true reorder —
   ch 123 'Island Devils' second half in ep 80, first half relocated to
   the finale's cold open (ep 87 = '123 (first half) + 130 (remainder)',
   both eps rearranged-annotated). (c) THE VERIFIER built (§10 rule):
   assemble.ts split out of supabaseSource (pure row→model, no client
   import) so verify-series-display.ts renders series through the app's
   EXACT path; whole-catalog sweep (218 anchored series) surfaced two
   systematic display classes, both fixed centrally: canonEpStartCh now
   caps derived starts at the next exact row's span start (25-series
   one-chapter-dip class), and the derive start guard tightened to
   ≥ prevEnd (chart double-listed split boundaries; Fairy Tail 277 /
   One Piece 510). black-lagoon manga_start_chapter → 0 (kanzenban ch-0
   opener; scope-start floor had forced ep 1 to display ch 1). Full
   rederive + edges redeployed. Sweep result: ALL OK, 218/218. Census
   unchanged-clean: all anchor classes 0, ruling_violation 0, ok_full
   236.
34. ✅ **SESSION 2 (2026-08-23, secondary account): the regression hotfix,
   the stitch queue, batch 14, and the reorder/boundary rule classes.**
   (a) HOTFIX: d05e617's assemble.ts split dropped `allBoundaries()` from
   supabaseSource.ts — every card open threw on localhost and production
   while the verifier (assemble.ts only) and a vacuous `tsc -p .` stayed
   green; restored, types regenerated, gate = `tsc -b --noEmit` (§10).
   AoT ep 87 start 123→130 (majority/start-sanity: the relocated ch-123
   cold open is not the position). (b) STITCH QUEUE via the ruled-extension
   path (§10): Kingdom S5/S6 (155), Rent-a-Girlfriend S4/S5 (60), Black
   Butler Public School + Emerald Witch (70, + Book of Murder/Atlantic
   order-only), Beastars Final (48), Magus Bride S2 (48, + 2021 OVA
   order-only), Golden Kamuy S3-Final (62, + 3 OVA entries order-only; ep 62
   → 302, Bousou Ressha-hen 210073 pending for 303-314), Slime S2-S4 (91
   aired/96, + Coleus/Scarlet Bond/Azure Sea order-only), Arslan S2 (33, +
   OVA), Cardcaptor component 2 corrected (Clear Card Prologue OVA 98554,
   not the Sealed Card film), TLR Darkness specials order-only. Wikipedia
   rows created for every new season after four lock-rule fixes (season-
   label grouping, page-top count alignment, namesake air-date guard,
   continuity lock; §10). Fractionals: Book of Murder parts order_only,
   five Slime Tales/Digression recaps excluded_recap. (c) BATCH 14 = item-4
   batch 8: 24 series / 25 verdict files kept in-repo
   (research/batch14/out) — 1032 full-record anchors, 430 continue points,
   514 annotations, 19 type corrections (EPISODE_TYPE_OVERRIDES: hxh-1999
   ep 7, beastars 37/42/44, cardcaptor 4/5/7/39/76/82-87, dagashi 10,
   reborn 111-112, slime 30), 19 order-only records with spans, 25 review
   bookmarks. REPAIRS: railgun ep 63 start 43→68, shippuden ep 143
   412→415, world-trigger ep 73 adapted-list, tlr-darkness ep 24 55→42/v11,
   arslan ep 25 107→71 (the 107 was the S2 endpoint), dagashi ep 24
   127→126, cardcaptor ep 93 → removed (Clear Card adapts a SEPARATE manga
   87296 — split ruling pending Sean; eps 72-93 honest-null until then),
   kenshin ep 28 end 48→49. MHA 100-170 fully per-episode (ep 107 =
   253-255, ep 113 = 256-257, S6/S7/Final exact; post-finale specials
   204356/211711 pending). anchor_gap_research 62→48. (d) RULE CLASSES
   from Sean's reports: reorder regime (formulas never bridge a reorder;
   holes listed by the verifier — 5 catalog-wide: Cells at Work 4/12/13,
   Kowloon 12, Cardcaptor 39), section envelope, sliver rule (33 starts
   corrected mechanically), running-order END normalization, volume-
   boundary identity/trim/research rows (16 poisoned families healed;
   Dragon Ball 42-volume table rebuilt; audit classes 0). Verifier --all:
   219/219 ok. Edges rebuilt + redeployed (type overrides live in the
   refresh path). Remaining UI-phase gap: rearranged/graft rows carry
   annotations but no visible mark, so a correct reorder reads as a bug —
   Sean's call on a provisional glyph vs the full asterisk pass.
35. ✅ **Sean's rulings 2026-08-24 applied as data
   (apply-rulings-20260824.ts)**: (a) Clear Card SPLIT into
   `cardcaptor-sakura-clear-card` (97881, own 1-22 numbering, batch-14
   clear_card anchors, sequel relation, type overrides moved into the new
   numbering; cardcaptor-sakura → 71 with a community cap holding the
   shared AFL page's tail out; the wrong mu ep93→50 pin deleted). (b) MHA
   post-finale specials = order-only entries with ruled SURFACE positions
   170+1 (community) and 170+1.5 (Sean's convention, the Eri fan-book
   special) — ingest_fractionals 171/171.5 + OVERRIDE_CHAINS extras;
   counts stay 170. Standing principle (Sean, verbatim intent): every
   classification lands as REAL DATA VALUES keyed to series ids — the UI
   passes choose what to surface, never re-research. (c) Surfacing v1
   (2026-08-24): `watch_order_entries` (migration 20260825190000,
   anon-readable) + sync-watch-order.ts; MHA's two specials briefly
   rendered as list rows #170+1 / #170+1.5, then Sean PARKED surfacing
   for the specials/OVAs/movies status design pass — labels cleared, the
   render path stays built and dormant, and his intended unit-level logic
   (envelope, counts, strip, selectability, total reads "170+1.5") is
   recorded in §10 as the reference point. All 40 order-only entries are
   data-ready with display_label null; titles corrected ('More' / 'I am
   a hero too').
36. ✅ **RESEARCH BATCH 15 (2026-08-24): the exact-record promotion batch** —
   Sean's post-compact queue (5 reorder holes + 225 rearranged-zone rows /
   42 series + open-bookmark follow-ups) as one batch: 33 research-agent
   tasks over 48 series (protocol batch15/PROTOCOL.md — full record OR
   evidenced zone_level_only per target; verdicts in batch15/out = the
   cited record). Applied via apply-research-batch-15.ts: 233 anchors
   (4 in-verdict repairs), 17 zone-acks, 149 continues, 127 annotations,
   13 retypes, 10 curated repairs (2 held: ippo 127, dragon-maid 25),
   4 anchors EXCLUDED pending Sean's encoding rulings (= the whole
   remaining rearranged_zone_unanchored class), world-trigger
   continue_from 196, boundary seeds (TGR:re + Clear Card research
   tables; Kuroko re-pull; Kowloon stale row cleared). Rule closes: zone-
   acknowledged split, anchored-row-less synthesis, relocated-opener
   re-enforcement (all §10). End state: verify 220/220 clean; census
   ruling_violation 0, nonmonotonic 0, rearranged_zone 42→3(+5 ack),
   ok_full 235; NEW work-list = 35 next-tier reorder holes (verify --all)
   + 42 batch-15 bookmarks. Decisions queue:
   **batch15/DECISIONS-FOR-SEAN.md** (encoding rulings A1-A4, held repair
   B, conventions C1-C4, bookmark dispositions D, structure items E).
37. ✅ **SEAN'S BATCH-15 RULINGS APPLIED (2026-08-24, same day)**: A2/A3
   rejected-as-anchors (annotation-only, rules in §10); A4 coverage=max +
   honest-finale rule (§10; ippo 127 = 410-414/continue 558 post_series,
   coverage 557 via ep 123); B dragon-maid 25 = 40+48+E6 → 48 [40] v5;
   C1/C3/C4 ratified; C2 ANIME-PARITY continue rule (§10; migration
   20260825200000 continue_kind/continue_note; catalog conversion
   1838/317/20 via batch15/apply-parity-continues.ts); D 16 old bookmarks
   closed, hxh ep7 → mixed+anchored, TLR chapter math = 77 (scope row
   documents the 100 = +prologue+bonus); E1 shounan + E2 cardcaptor
   REVIEWED entries (prologue OVA = ep 71; Sealed Card order-only @70.1
   noted DIRECT FINALE; Movie 1 → @35.1; dup 70.3 fractional deleted).
   Same-day fixes from Sean's live reports: ippo volume collapse
   (coverage-anchor volume + the partial-boundary stand-in guard, §10);
   cardcaptor 65-70 / hxh 4-7 / dragon-maid 25 verified correct at source.
   STILL OPEN: A1 (MHA 104 anchor-on-filler — rec: reject + stop counting
   filler rows in rearranged_zone_unanchored) + beastars ep 44 type
   (flag 887). Verify 220/220 clean end-state.
38. ✅ **CONSOLIDATE DEEP (2026-08-24, post-rulings)**: writer sweep clean
   (parity/seed scripts = curated tier; live writers on gates); CRON
   REVIEW (Sean's ask): anilist/afl/mu unaffected by new rules (partial
   upserts merge — continue fields safe); refresh-afg's delete+reinsert
   WOULD have eroded parity continues hourly → PRESERVATION added to
   syncAnchors + applyContinua (lib/anchors.ts), all four edges
   redeployed; apply-parity-continues added to the consolidate healer
   roster (idempotent re-stamp for fresh pins; re-run confirmed 0-change).
   A1 RULED: filler/anime-only rows never anchor targets —
   rearranged_zone_unanchored skips them (audit) and MHA-104's proposed
   anchor is permanently rejected; ippo 76 zone-acknowledged (A3 trail).
   Cardcaptor 65-70 re-verified at source (chapter infoboxes confirm all
   volumes; serialization dates prove the finale ANTICIPATED chs 47-50 —
   Ohkawa wrote both; divergence annotations already carry it).
   Discredited-source additions: animeoshi.com (Beastars ep-44 "77-80" =
   S2 chapters, content-farm class) + Google-AI instant answer
   ("141-145") — both contradict two-source records; beastars ep 44
   under focused re-research (was "anime-original" from stub-era
   sources; Festival of Odd Souls = ch 166 evidence surfaced). ARC DATA
   noted as a designed-next modeling pass (arcs table: name ↔ chapter
   span ↔ episode span; AFG chart arc column = structured backfill
   source; pairs with the segment-model UI phase). CENSUS:
   ruling_violation 0, rearranged_zone_unanchored 0 (class CLOSED),
   acknowledged 2 (berserk 1-4 scheme, ippo 76 sliver),
   special_numbered 0, nonmonotonic 0, ok_full 235; verify 220/220;
   types regenerated post-migration; npm build green. Deep rescan:
   suppressions/overrides/REVIEWED sets re-validated, 2 dup flags
   cleaned, locked set still empty pending asterisk sign-offs (84).
39. 📍 **RESUME POINT 2026-08-24 (Sean compacting; THE ROADMAP — start here
   next session)**. State: batch 15 + all rulings + consolidate deep DONE
   and pushed (d708dfb); census ruling_violation 0, rearranged_zone_
   unanchored 0 (CLOSED), special_numbered 0, nonmonotonic 0, ok_full
   235; verify 220/220; all 21 pre-batch bookmarks dispositioned; parity
   continue-reads live + cron-safe; edges deployed; Vercel current.
   ROADMAP (Sean-agreed order):
   (1) ✅ DONE (§12.40, same day): BATCH 16 — all 38 reorder holes
       closed, hole list EMPTY. Still alongside: Sean's light sweep of
       the 42 batch-15 bookmarks + the 9 batch-16 bookmarks (D1 =
       kamisama ep10 END question in batch16/DECISIONS-FOR-SEAN.md).
   (2) ← NEXT: Gap tier (anchor_gap_research 46, by popularity: sailor-moon-
       crystal, skip-beat, gantz, ace-of-diamond-act-ii, kingdom 1-37,
       world-trigger 48-63, shippuden 262-298…).
   (3) mu_pin_unverified 65 (drains passively per batch; dedicated
       sweep finishes it).
   (4) Automation-reliability pass AFTER data logic closes (Sean's
       framing): Wikipedia as a 5th cron, parity-stamp inside
       refresh-mu, anilist backoff cap if the orphan-run recurs.
   (5) Arcs table modeling pass (name↔chapter-span↔episode-span; AFG
       arc column = backfill source).
   (6) The parked design pass: specials/OVAs/movies status + watch-order
       surfacing (MHA 170+1 reference logic in §10) + asterisk queue 84
       + kind badges.
   (7) Continue-reading UI surface (parity data ready, invisible by
       design).
   (8) Coverage-segment model (designed, NOT built — Sean's go
       required).
   Event-driven: Golden Kamuy Bousou Ressha-hen stitch (winter
   2026/27), TYBW Part 4 finale anchor (Sep 2026), Arslan S2 titles,
   9 cleared-boundary manga (main-article fallback gap), title/airdate
   classes (29/22) via wiki backfill.
40. ✅ **BATCH 16 (2026-08-24, same day post-compact): the reorder-hole
   work-list CLOSED — 38/38 holes promoted to full anchors, zero
   zone-level**. The list had grown 35→38 (cells-at-work S2 18-20
   surfaced); 10 series, 10 parallel agents, batch-15 playbook
   (research/batch16/: context.ts, PROTOCOL.md with the 2026-08-24
   rulings baked in as binding rules, out/*.json = the cited record,
   apply-research-batch-16.ts). All 38 anchors high confidence. Key
   findings: several "zones" dissolved on research (black-butler
   reorder ends at ep 3; cells S2 reorder confined to 14-16; shippuden
   121-125/130-132 are clean monotonic runs; tgre 19-22 decompose
   per-episode — batch-9 skip set confirmed exactly); genuine reorders
   now exact (dragon-maid ep6 29-before-27, kamisama ep24 ch-64 graft
   before 61, TYBW ep39 resumes 655 after deferred-Friend 634,
   shippuden 122/123 mid-chapter share of 356-357). Kamisama-kiss S2
   fully solved per-episode via NEW source classes (EN fandom is stubs
   there): completed-manga-review.blog chapter-by-chapter, UA sister
   wiki per-chapter character lists, first-appearance infobox pairs.
   4 curated repairs applied: kamisama ep25 envelope→own record (A4
   finale rule; END 64→63, start 31→62 — ep24's lifted END keeps
   coverage 64) + ep10 chapters_adapted (batch-15's "Kohiruimaki is
   anime-only" was WRONG — he's a named ch-50 character; goukon = ch 50
   pulled forward). Curated annotation: food-wars eps 17-18 added to
   the batch-9 arc-swap zone (displaced Karaage side was untagged).
   Parity healer: 14 converted/7 stamped (TYBW ep38 continue 654→655).
   OPEN for Sean: D1 kamisama ep10 END 25-vs-50 segment-order question
   + 9 informational bookmarks (research/batch16/DECISIONS-FOR-SEAN.md).
   END STATE: verify 220/220 with EMPTY hole list; census
   ruling_violation 0, rearranged_zone_unanchored 0, acknowledged 2,
   nonmonotonic 0, ok_full 235; tsc clean. NEXT (roadmap §12.39):
   (2) gap tier 46 → (3) mu_pin sweep 65 → (4) automation pass →
   (5) arcs table → (6) parked design pass → (7) continue-read UI →
   (8) segment model (Sean's go).
49. ✅ **EYESHIELD PHANTOM TAIL (2026-08-25, Sean's pending-rows report —
   SUPERSEDES an EXTRAS_ADOPTED ruling)**. Rows 146-154 rendered "pending"
   because totals said 155 — traced to a single AFG PAGE TYPO: its chart
   holds exactly 145 rows with the finale mis-numbered "155.". The extend
   path materialized a duplicate-finale row 155 (no air date), the MU
   anime-end pin landed on it, the episode floor adopted 155, and the
   EXTRAS_ADOPTED entry ("10 specials beyond 145") was a rationalization
   of the artifact — no source names ANY content for 146-154 (AniList/
   Wikipedia/fandom all 145; AFL absent). FIX: phantom row 155 + its mu
   anchor deleted (real finale row 145 already holds the manual ch-240
   anchor — the "ep155 mu artifact" flag from §12.47 is hereby resolved);
   totals 155 → 145; EXTRAS_ADOPTED eyeshield entry REMOVED with the
   supersession documented; COMMUNITY_COUNT_OVERRIDES cap 145 is the
   durable guard. Lesson for the floor rule: a >2 overshoot sourced from a
   SINGLE chart row with no corroborating content anywhere is a typo
   candidate, not an adoption candidate.
86. ✅ **G57 ROW PROVENANCE — built (2026-08-28; the /add-rule Sean sequenced
   before DBS; Cursor's three corrections: `minted_by` not `origin`,
   nullable → backfill → NOT NULL with no default, upsert + re-stamp never
   delete-then-insert).** The rule: every episodes row names the writer
   that minted it; a writer never deletes a numeric range — it UPSERTS its
   rows by (series_id, number), re-stamping `minted_by` in place when it
   takes over a number another writer minted (the source that carries a
   number owns it), and deletes ONLY its own rows inside its translated
   range whose number its payload no longer carries; a row nobody carries
   survives; an unstamped row is nobody's. Landed in the /add-rule order:
   (1) migration `20260828100000_episode_minted_by.sql` — nullable, no
   default, a check over afl | afg | wiki | stitch | anilist | manual (a
   default 'afl' would have let the five witnesses die on the first cron);
   (2) `lib/minted.ts` — the pure predicates `writerOwns` / `staleOwnRows`
   (4 tests: the 5D's shape) and the ONE shared write path `syncMintedRows`
   consumed by resolveSeries (both paths), stitch and afg-expansion (its
   unfiltered `delete().eq('series_id')` is gone); afg-extend and the wiki
   backfill stamp their fills; (3) `minted-by-backfill.ts` — every row's
   minter inferred from the writers' REACH (the translated AFL payload →
   afl 16,897; else the translated AFG page → afg; else a stitched series →
   stitch 1,358; else an AFL series → wiki 875; else anilist 846), the five
   witnesses non-afl (5D's 145 wiki, dbz-kai 139 stitch, detective-school-q
   19 wiki, kenichi 1-50 wiki, hayate 5-23 stitch), 0 nulls; (4) migration
   `20260828200000_…_not_null.sql` — the CLI had refused it while nulls
   existed (the intended fail-loud order) and applied it after the
   backfill; `types.ts` regenerated (P27); (5) census class
   `row_minted_by_missing` (0); (6) ledger record G57 (five witnesses;
   enforcement minted.ts / resolve.ts / stitch.ts / afg-expansion.ts /
   the audit); edges rebuilt + deployed (P3). **THE PROOF (the ruled
   path):** resolveSeries on yu-gi-oh-5d-s rewrote 153 AFL rows and row
   145 SURVIVED as `wiki`, aired/total 154/154 (translatedMax, §12.84).
   Census: row_minted_by_missing 0, ruling_violation 0, display 219/0,
   unchanged otherwise. Also landed this session: the RECAP BASELINE
   (Sean's standing process rule — every row named in a recap is
   `ep N — stored: type [+ annotations] → proposed: …`, stored first, a
   block is a table; generated by `research/batch20/baseline.ts` from the
   DB + the verdict; in PROTOCOL.md, research-agent.md, verdict-verifier.md,
   /apply-batch, /research-batch — a process, not a ledger standing). NEXT:
   Sean's go on wave 5 = DBS identity (dai last; shugo 67-81 whenever; MU
   segments a queue).
87. ✅ **PARALLEL TELLINGS — I40 / T30 / A46 built (2026-08-28; the DBS
   strategy session, Sean + Cursor + Claude; one /add-rule motion, three
   records).** The finding: dragon-ball-super's anime and Toyotarou's manga
   are two official realizations of Toriyama's unpublished outline (ja-WP
   同時進行; Kanzenshuu; AniList's edge ALTERNATIVE and correct) — the
   catalog carried `source_type manga` with NO manga linked and wave 5's
   content test would have typed 22 Tournament of Power rows filler. Sean's
   model — the timelines: A manga-only / B anime-only / C both / D studio
   padding / E mixed; type answers FROM THE OUTLINE OR NOT, the compare
   layer answers how the two tellings sit on it. Built: (1) `series.
   source_relation` adaptation | parallel | null (I40; derived by resolve,
   chain#aggregate and heal-source-kinds through `lib/rulings/source-
   relations.ts`; the value is `parallel`, not `alternative`, because
   series_relations already spends that word on FMA 2003 ↔ Brotherhood — two
   animes, a different object); (2) a RULED manga link for a parallel series
   (`pickMangaNode` honours `MANGA_LINK_OVERRIDES` from the STAGED relations
   whatever the edge type; every picker — resolve, chain, the healer, the
   census — calls it; the healer re-resolves a mismatched link rather than
   hand-writing it); (3) T30 standing on a parallel series: canon = the
   story in any telling, filler = D, mixed under the unchanged T28 bar; the
   outline made citable by proxy (in the manga / a load-bearing node of a
   shared arc / a whole anime-only arc = D unless adopted{author});
   (4) A46 positions are correspondence: `series_arcs` (arc grain; shared |
   anime_only | manga_only | side_source; must partition 1..N on a parallel
   series) + `episode_correspondence` (row grain; aligned | divergent |
   anime_only | manga_only; one episode may carry several rows) — both
   focused views (watching / reading) are projections of one structure;
   NO anchor or continue on a parallel series (syncAnchors / applyContinua /
   applyMuFrontier / writeCuratedContinue refuse; assert-overrides removes
   standing rows: DBS ep 131 → ch 42, today's AFG-continua pin, removed and
   listed); (5) six census classes: source_relation_missing (0),
   parallel_has_anchor (0), arcs_not_partition (0), arc_row_conflict (0),
   correspondence_invalid (0), correspondence_incomplete (1 = DBS's 94
   canon/mixed rows with no row yet — lane L-P's queue, an honest dash until
   researched); anchor_gap_research 6 → 5 and ok_no_volume 10 → 9 are DBS
   moving to `ok_parallel`; ruling_violation 0; (6) migration
   20260829100000, types regenerated, 6 unit tests (the witness's arcs
   partition 1..131; the split example 100-110 aligned / 111-120 divergent),
   four edges rebuilt + deployed; (7) DBS after the heal: relation parallel,
   link 86508 (manga_status publishing), 0 anchors, 8 arcs, types UNCHANGED
   99/4/28 — every episode-level change is HELD for Sean's row-by-row
   evaluation (WAVE5-RECOVERY §the full evaluation table: 5 proposed lifts
   79-81 / 94-95 → canon B, 6 rows pending the w5c research on 90 / 91 and
   the four stored-mixed rows, 120 no type change; the 22 wave-5 "→ filler"
   conversions withdrawn under T30). Outlaw Star stays T25 original (a
   sibling telling with no comparison instrument); Boruto is the candidate
   second witness, research first. Lane L-P (row-grain alignment, one arc
   per wave) is Sean's to fund.
88. ✅ **BATCH 20 WAVE 5 APPLIED — dragon-ball-super under T30 (2026-08-28;
   Sean's GO after the account switch; the series-wide re-pass, waves
   5c-5f).** Every one of the 131 rows judged under the parallel standing,
   none projected: 14 by the arc proxy (42-46, 68-76 = D), 9 by batch 19
   (the film arc), ~68 by manga pages, and 41 by the four re-pass verdicts
   (`out/dragon-ball-super-w5c..w5f.json`, all validated, 0 anchors).
   Applied: (1) **11 type flips, all upward** (T6, pinned canon because
   AFL's anime-canon re-derives to filler on a manga-kind series): 16/17
   (Whis's students — the node every telling states and none depicts;
   medium), 50 (installs the destroyed time machine + Black's Time Ring
   that 51/53 run on), 78 (ch 28 carries the whole episode), 79-81 (the
   Zeno Expo — ch 30 opens on its outcome), 90 (Gohan's power-up + team
   leadership → 97/124), 91 (the gathering; Buu's hibernation = ch 31's
   close; medium), 94/95 (ch 32: the revival, Frieza's power-up, the
   off-screen fight). Types 99/4/28 → **110/3/18**. Four holds with
   evidence: 4 (+ graft{2}), 15, 22 (+ loose_parallel{film}; the film
   throws Tagoma into space in its first act), 52 (the closest hold —
   nothing later depends on the Gohan visit). 1/2/89 stay mixed (E: story
   + a self-contained D block). (2) the A45 retirement of 78
   rearranged{28} (wrong KIND on a parallel telling — neither work
   re-orders the other; divergence{28-29} replaces it) with the
   standing-annotations entry re-noted to the T30 state (the first
   collision of a retirement with a standing T26 ruling — the gate refused
   the re-insert exactly as designed, and the standing map was updated
   rather than the gate bypassed). (3) 17 row annotations (re-noted or
   added: 6 side_source{Battle of Gods}, 105 divergence{38-39}, …; no
   blanket arc stamps). (4) **61 episode_correspondence rows** (aligned /
   divergent / anime_only) from the verdicts — correspondence_incomplete
   94 → **67 canon/mixed rows** and the chapter side now names its
   uncovered runs (4, 6-13, 14, 18-26, 27, 33, 41-42): lane L-P's queue.
   Census: ruling_violation 0, parallel_has_anchor 0, arc_row_conflict 0,
   annotation_invalid 0; display verify 0 failing; edges redeployed (the
   T6 map is lib). Traps for the record: ep 115's fandom `Manga =` field
   points two chapters early (never derive it mechanically); fandom's
   ep-95 air date is a Saturday (Kanzenshuu: the 18th); AFL's buckets are
   not a B/D oracle (its anime-canon held both the lifts and the holds).
89. ✅ **CONSOLIDATE DEEP after wave 5 (2026-08-28; §12.87-§12.88 changed
   enforcement sites — P21 required, not offered).** Steps 0-8 satisfied by
   §12.88's save point (system census OK, edges current, heal + census run,
   ruling_violation 0, display 218/0). Deep (step 9): (a) **the
   parallel-candidate probe** — every catalog series scanned for an
   ALTERNATIVE-edged manga with no (or a dwarfed) ADAPTATION pick: 19 hits,
   ALL the LN/VN media-mix shape (monogatari, SAO, apothecary, steins-gate,
   fate, konosuba, 86, dxd, danmachi, …) where the anime and the sibling
   manga both adapt a CITABLE work — none is the DBS shape. The boundary is
   now in the I40 record: `parallel` requires the common source to be
   uncitable; a citable common source keeps relation `adaptation` of that
   work. Zero new parallel witnesses; Boruto (an ADAPTATION edge — invisible
   to this probe by construction) stays the research-first candidate.
   (b) Every standing DBS ruling re-checked under T30: relations I17
   (sequel to Z) unaffected; the RoF side_source block (batch 19) stands;
   the batch-18 partial{32} entry's reason amended (SUPERSEDED ON STANDING,
   KEPT AS THE WHERE-fact — its rows are canon now); STANDING_ANNOTATIONS
   confirmed to CONCATENATE per series (no last-wins hazard).
   (c) Stale cleanup (P24): flag #1016 ('manga source_type but no manga
   link') DISMISSED with the I40 resolution note — the ALTERNATIVE edge was
   correct all along; no retiresWhen condition touches DBS; no orphaned
   rulings. (d) Permanence: 0 locked, permanence_violation 0. Capture
   (step 10): the probe boundary → the I40 record; two apply-batch traps
   (an A45 retirement colliding with a standing T26 ruling → update the
   standing map, never bypass the gate; canon rows on a parallel series
   must be T6-pinned or aflAnimeCanon re-derives them to filler); edges
   redeployed after the lib-tier record edits. I40/T30/A46 all carry audit
   classes — no empty cells added this batch. Cycle position: batch 20
   resumes at step 1 (plan) — dai 18-99 ×3 LAST, FotNS 29-56, L-D in
   eights; shugo 67-81 whenever; lane L-P and the queues await Sean.
85. ✅ **CONSOLIDATE DEEP after batch 20 wave 4 (2026-08-28; P21 —
   `applyEpisodeFloor`'s input changed: `translatedMax`).** Steps 0-8
   satisfied by §12.84's save point. Rescan (step 9): (a) the floor probe
   over every N11 series — none other is inflated by the raw max (dr-stone
   94 vs 57 and dragon-maid 25 vs 19 are AFL covering one season of a
   stitched chain, not the 5D's shape; 5D's 154/154, shugo 127/127 hold);
   (b) the re-resolve-risk probe over every AFL-backed series — FIVE carry
   rows the translated AFL payload lacks: yu-gi-oh-5d-s 145, dragon-ball-z-
   kai 139, detective-school-q 19, kenichi 1-50 and hayate 5-23 (stitched
   blocks) — the ROW-PROVENANCE /add-rule's witnesses (a re-resolve cannot
   tell a wiki-inserted or stitched row from a stale one; the contiguity
   check is the outcome guard meanwhile) — listed, not touched; (c) stale
   cleanup: nothing new (the wave's flags closed at apply; retiresWhen
   unchanged; permanence_violation 0). Census unchanged from §12.84 (display
   219/0, ruling_violation 0, airdate_regression 0, anchor_gap_research 6,
   anchor_volume_mismatch 20). CAPTURE (P29): seven wave-4 traps →
   research-agent.md (Wayback licensor archives + a site's Firestore as a
   primary; ☆ as a control that under-marks; title ≠ beat and Pony Canyon
   = Bandai Channel; AFL dates on pre-2000 series; wiki revision lineage,
   fabricating summarisers; game tie-ins that precede the game; a finale
   coda / an adventuring arc the source lacks); three → apply-batch (a
   renumber sweeps every rulings map incl. `applied/`; a same-kind upsert
   replaces a fact — no A45; a cron re-resolve can drop backfilled rows and
   re-floor counts); the N1 ledger statement gains the floor's input rule.
   QUEUED for Sean: the row-provenance /add-rule (five witnesses); the
   shugo 67-81 follow-up (☆ rows stored canon); MU segment rulings; the
   chapter-count ceiling; healer-on-regime; the day-of-week class; the
   anchor_volume_mismatch review (20). NEXT: Sean's choice — DBS identity
   first, dai last (waves 5-6), or a queue.
84. ✅ **BATCH 20 WAVE 4 APPLIED — the standing lies wave 3 left (2026-08-28;
   Sean's rulings, Cursor's START call).** Research (4 verdicts, ≈734k) →
   verify (4 reports, ≈518k; nothing refuted on a value; the FotNS ep-29
   lean refuted on wiki revision lineage) → rulings → apply
   (`apply-wave4.ts`, 88 decisions). DATA: **TBATE 13-22** — the identity
   table (20 G53 title + date repairs; the rows had been bare since the
   AniList component wrote them), **13-16 / 21 → filler** (T6, the
   anime-original adventuring arc with its ties), five anchors 17 → 62 …
   22 → 80 closing the hole (two C1 continues), and **row 12 → 58 parity**
   with ch 57 named never-adapted; **tokyo-mew-mew 38 → 20 [20] v5 high**
   (the page-mapped repair; Sean: ch 19's three counterpart pages are a
   leading fragment under A10 — the hxh-80 shape — 19 stays in the record's
   chapters_adapted and the rearranged {19-20} tie; the same-kind upserts
   replaced the stored partial/rearranged {19} facts, no A45 needed);
   **shugo-chara 83, 86-96 → filler** (T6, the Lulu ?-egg arc; ja-WP's ☆ +
   Pony Canyon's synopses — the resort's honest numbers), **91 = filler +
   graft {34}** (the Rhythm hatch, a transplanted beat), 92 loose_parallel
   {34} (A45 retired its title-keyed graft and the two rows' divergence),
   the divergence block re-spanned 82-96 minus 91/92 ("inside the ch 32
   split"), the optional continue 80 → 32 (C1), and **the ZONE_ACKS A7
   bound re-keyed 93 → 91** (the wave-3 resort had re-keyed G53 + A45 but
   missed that list — the verifier's find); **FotNS 53 / 60 / 126** (G53,
   the day-of-week sweep's three AFL dates no other source has), **ep 29
   stays 05-16** (ja-WP's 5/9 = one anonymous 2007 edit after both wikis'
   first lists read 5/16 — the lineage recorded in the entry's reason).
   Not this apply: shugo rows 67 / 69 / 70 / 71 / 73 / 78 / 81 (☆, stored
   canon) — a follow-up. **THE CENSUS CAUGHT A REVERSION (P5 → P9):**
   `ruling_violation` 1 = yu-gi-oh-5d-s "numbering hole 144/146": today's
   crons re-resolved 5D's, which (a) rebuilt its rows from AFL alone — the
   wiki-backfilled row 145 (batch 19) vanished — and (b) FLOORED aired/total
   back to **155**: `aflMax` was the RAW page max (AFL numbers the film as
   83), so `applyEpisodeFloor` undid the ruled 154 that batch 19 had set by
   a direct update. **LIB: `translatedMax`** (numbering-shifts.ts, pure,
   2 tests) — the source max in OUR space, N11 translation first — now
   feeds the floor, the count-mismatch flag and the stale-zone cut; the
   ruled path re-run (resolve → 154/154 → the wiki backfill restores 145 →
   heal-format) proves it. The dropped-row half is a known sidecar
   (episodes carry no per-row provenance; a re-resolve cannot tell a
   wiki-inserted row from a stale one) — queued as an /add-rule, the
   census's contiguity check being the outcome guard meanwhile. Edges
   rebuilt + deployed twice (P3). CENSUS: display 219/0; ruling_violation
   0; airdate_regression 0; anchor_gap_research 7 → 6 (shugo's block is
   filler now); title_incomplete / integrity_total_beyond_eps back to 25 /
   9 (the 5D's row); TBATE 12/24 → 2/24 rows missing titles. NEXT:
   /consolidate DEEP (P21 — `applyEpisodeFloor`'s input changed, an
   enforcement site), then Sean's choice: DBS identity first, dai last;
   the shugo 67-81 follow-up; MU segments a queue.
83. ✅ **CONSOLIDATE DEEP after batch 20 wave 3 (2026-08-27; P21 — three
   enforcement sites changed: the N11 `resort` form + `applyNumberingShift`
   on the AFL write path, the AFL parser keeping duplicate-number rows, and
   `toMergedRecord` for the title/date maps).** Steps 0-8 satisfied by
   §12.82's save point (system census green, edges current, heal + census
   run, gates green). Rescan (step 9): (a) shugo-chara after the renumber —
   the batch-17 `rearranged {28 after 29}` fact (now on row 74) was a
   NUMBERING artefact (74 → 28 precedes 75 → 29 in true numbering) → retired
   by ruling (A45, the healer removed 1 row); the batch-17 A18 reorder-regime
   reason amended — the rows-73-96 divergence was the AFL bug, the regime
   now rests on the genuine Doki-era revisits (97 rearranged {32}, 98 graft
   {34}); anchors 74-80 monotone; 127 rows = total. (b) Stale cleanup (P24):
   flags #1039 (solo-leveling continua vs the manual 110 — explained) and
   #1040 (FotNS edition — #688's twin) dismissed; #845 (x frontier), #1035
   (rosario frontier), #890 / #956 / #958 (batch 14/17 notes), #1028 (TBATE
   no manga link, a standing marker) stay open on their merits. (c)
   permanence_violation 0; the retiresWhen worklist unchanged. Census after
   the deep: display 219/0; ruling_violation 0; nonmonotonic 0; airdate_
   regression 0; anchor_gap_research 7; anchor_volume_mismatch 20 (the
   review queue). CAPTURE (P29, step 10): eight wave-3 traps → research-
   agent.md (mirror-wiki aliases via siteinfo; a task premise is a claim;
   web-short contamination is a block; the syobocal rule — earliest airing
   per Count without 再, the ghost-row trap struck; a renumber verdict is the
   identity table; a doubled AFL number is a swallowed episode; MU remake
   segments; a finale's source share can be a coda); two → apply-batch (the
   merge builder + the assert counts as the outcome check; re-key after a
   renumber, the resort on the write path); the ledger: N11's statement
   gains the third form (resort by date-ordered position; the parser stays
   faithful; translateEpisodeNumber refuses a resort span; the identity
   table + re-key), G53's statement gains the merge rule. QUEUED for Sean:
   the per-series MU segment rulings /add-rule (10 unresolved strings + the
   in-window-Movie gap, FotNS witness); healer-on-regime (a dry-run list
   first); the chapter-count ceiling map; the day-of-week class (49 series
   / 252 rows probed); the review queues (anchor_volume_mismatch 20; shugo
   82-96 typing — the canon-typed divergence block; TBATE 13-22; TMM 38 →
   20 [19]; FotNS 29-56 + ep 29's date; the two annotation-text refinements
   from kinnikuman / eyeshield). NEXT: Sean's choice — waves 4-5 (dai ×3,
   FotNS 29-56, DBS identity; L-D in eights), a review queue, or an
   /add-rule.
82. ✅ **BATCH 20 WAVE 3 APPLIED — narrow follow-ups, numbering & dates
   (2026-08-27; Sean's eleven rulings as written, Cursor concurring).**
   Research (8 verdicts, ≈1.53M) → verify (8 reports, ≈1.13M; nothing
   refuted on an anchor value) → rulings → apply (`apply-wave3.ts`, 168
   decisions, file-driven + overlay). LIB FIRST (P2 → P3): **the N11
   `resort` form** (`lib/rulings/numbering-shifts.ts` — a source's numbers
   inside a span are wrong AS A SEQUENCE, so the span's rows are renumbered
   by POSITION in a stable air-date order, never by number; `applyNumbering
   Shift` is pure: resort → collapse exact same-number+type duplicates
   keeping the first → drop → shifts; `translateEpisodeNumber` refuses a
   resort span), the AFL parser now KEEPS duplicate-number rows (G44: a
   faithful parse — the Boruto-182 collapse moved to the write path), and
   **`toMergedRecord`** for the title and date maps (`toRecord` was
   last-wins: a second entry for a series silently dropped the first —
   golden-kamuy's batch-19 45/46 vs batch-20 25-44 was the witness; the
   types map already merged). 140 tests (the shugo-chara identity table:
   the three transposed pairs, the doubled 96, the real staged payload with
   its year-off block and the 88/89 tie). **shugo-chara**: AFL's rows 74-96
   (two "96"s) re-fetched and re-staged (127 rows), resolved under `resort
   {74-96 → 73}` — rows 74-95 → 73-94 with 75/83/90 on their own numbers,
   the first "96" (りまとやや、真珠の絆！ 2009-08-08, the row the old dedup
   swallowed) → 95, the second → 96; anchors and annotations RE-KEYED old →
   true (76 → 74, 77 → 76, 78 → 77, 80 → 79, 81 → 80; the divergence block
   87-96 → 86-96 with the restored 95 joining it; 93's graft → 92); the G53
   date map re-keyed + 35/37/46 + 95; the 107/108 transposition a G53
   title+date swap outside the span; 126 → 127 rows = total; the four
   regression pairs close with NO G54 ack. **golden-kamuy** rows 25-44 as
   ONE atomic G53 title+date block (the Dōga Gekijō shorts' names and dates
   verbatim; 45/46 ruled in batch 19; row 37 above the new 38 was why 38-44
   alone could not apply); #860 = no offset. **Anchors 45**: solo-leveling
   13-25 → 46-110 (fence 25 → 108 REPAIRED to 110; continue 111), kinnikuman
   33-45 → 98-118 (44 → 116 per the verifier, the 117 straddle dropped; 41
   → filler T6 — the anime-original Gorota training; 47 stays canon +
   divergence), FotNS 1-28 → 1-36 over a reordered Part 1 (ch 6/8-10 only
   at ep 22; backwards parity 13 → 6; ep 5 → filler + graft{8} T6), TBATE
   12 → 56 / 23 → 84 [81] manual (**24 → filler T6 + graft{86} — the
   verifier's T28 reading; terminal 23, continue 85 post_series**),
   eyeshield 60 → 123 [122] / 61 → 123 (high — the ep-60 fork closed by a
   third witness; 39 A44), TMM 41 → 21 [21] (the TokyoPop vol-6 scan read
   page by page; 19/21/37/44 A44; 44 → filler T6). **x 17 → mixed** (T6;
   `rearranged {54-62, 63}` — ep 0 is outside the entry). 50 curated
   continues (C7) incl. **rosario-vampire S1's thirteen** (the C2-backwards
   values derived from the stored rows — 1 → 2, 2 → 5, 3 → 3, 5 → 4, 6 →
   18, 7 → 12, 8 → 13, 9 → 14, 10 → 8, 11 → 9, 12 → 9, 13 → 20 post_series
   — with 6/7/11/17 named; the parity healer is NOT turned on for regime
   series: Conan / Gintama / Hayate store parity by hand — a dry-run list
   then an /add-rule, not this wave). 43 annotations; flags 688 / 860 / 937
   / 1029 dismissed. Edges rebuilt + deployed twice (P3). CENSUS: display
   219/0; ruling_violation 0; nonmonotonic 0; provenance 0; **airdate_
   regression 5 → 0** (the four shugo pairs + golden-kamuy 44); frontier_
   tail_null 8 → 7 (TBATE 24 filler); integrity_total_beyond_eps 10 → 9
   (shugo 127 = total); anchor_gap_research 6 → 7 (FotNS 1-28 closed → its
   next-worst 109-151 surfaces; **shugo-chara 81-96 NEW at 13** — the
   restored row 95 tipped the anime-original-arc block (rows 82-96 typed
   canon with `divergence {none}`) over the threshold: a T28 typing lane,
   not an anchoring gap); anchor_volume_mismatch 20 unchanged. NOT written
   (recorded): kinnikuman's abridged-checkpoint note and eyeshield's
   abridged-split note (annotation text refinements); TBATE 13-22's types
   and row 24's date, TMM 38 → 20 [19], FotNS 29-56 + ep 29's date, the
   day-of-week queue — lanes. NEXT: /consolidate deep (P21 — the N11 form
   and the parser change are enforcement sites; the merge builder changed
   what two maps contain).
81. ✅ **CONSOLIDATE DEEP after batch 20 wave 2 (2026-08-27; P21 — the
   saint-seiya re-migration changed stored values, a census class was
   added).** Steps 0-8 satisfied by §12.80's save point (system census
   green, edges current, heal + census run, gates green; CI green again on
   main after the absolute-path import fix). Rescan (step 9): (a) the
   migrated series — every episode-keyed ruling points at a row (T6 / G53
   / A44 / T26 asserted by the healer roster); the healer re-derived the
   parity continues in OUR space; and **the batch-17 notes' PROSE still
   narrated chapters in the +1 space** ("(ch 30)" on ep 44, whose stored
   START is now 29) — re-spaced −1 on 27 rows (42-72), pre-marker text
   only, each row printed (P23, clear-cut under the live rule). (b) The
   verifier's lib finding on bleach #677: `parseCoverageSegments` split
   only on " / ", so MU's ") /Vol" string was ONE segment and the pick was
   right by luck — the splitter now takes `\s*\/\s*(?=Vol)` (1 test;
   134 pass); consequence, exactly as G32 gate 0 rules it: bleach and
   bleach-thousand-year-blood-war are UNRESOLVED ("(Bleach)" / "(TYBW
   P4)" carry no entry marker), today's pins kept, `mu_pin_multiwork_
   unresolved` 8 → 10 — both join the queued per-series segment rulings;
   edges rebuilt + deployed (P3). (c) Stale cleanup (P24): flag #830
   (eyeshield's suspected row offset) dismissed — two waves joined rows
   18-64 to four sources 1:1; the retiresWhen worklist (9 live G53
   entries) unchanged; permanence_violation 0, permanence_candidate 50
   listed, none signed. Census after the deep: display 219/0,
   ruling_violation 0, anchor_nonmonotonic 0, continue_skip_unnoted 0,
   anchor_volume_mismatch 20 (the review queue, seiya 0), anchor_gap_
   research 6, mu_pin_unverified 29. CAPTURE (P29, step 10): the C1 line
   in batch 20's PROTOCOL.md and the A2 mission text ("filler boundary" →
   ANY mid-chapter ending; the ledger's C1 wins — Sean); seven wave-2
   traps → research-agent.md (a finale gap block is an identity question;
   ja-WP's 通算話 column; read wiki fields in both directions / AFG's
   column can stop / AFL+AFG are one source for types; re-derive a
   derivation-tier fence on the PAGES; the stored volume as a chapter-
   space check; two-valued OVA date regimes; un-cross-cutting; C2 parity
   is the next canon row's START even backwards); two apply-batch traps
   (marker-keyed migrations with a census proof; file-driven apply + a
   curated overlay); the N22 record's reason amended (marker-keyed). Still
   QUEUED for Sean (never farmed): the `anchor_volume_mismatch` ledger
   record + its 20-row review (sailor-moon 3, black-lagoon 5, naruto 4,
   oshi-no-ko 2, AoT 2, beastars 2, mashle 1, skip-beat 1); the day-of-
   week audit class (six witnesses); a first-class "never adapted"
   instrument (seiya 47, eyeshield 49-52, d-gray-man 30, shippuden 700);
   the hxh OVA date regime; eyeshield 53/78/126/128 and bleach 156/160/161
   T28 cards; d-gray-man 29-30 / 33-34 as side_source; `anime-only-canon`
   in the stored 452-457 T6 reason text (history, not a type). NEXT: Sean's
   choice — wave 3 (L-C + L-B), the review queue, or the /add-rules.
80. ✅ **BATCH 20 WAVE 2 APPLIED — the eight small gap blocks + the
   saint-seiya re-migration (2026-08-27; Sean's rulings, Cursor
   concurring).** Research (8 verdicts, ≈1.43M) → verify (8 reports,
   ≈1.24M; Fable over Opus, R24) → rulings → apply (`apply-wave2.ts`, 334
   decisions, file-driven off the verdicts with a curated overlay — P10).
   STEP 0, THE SYSTEMIC FIX: batch 17's saint-seiya rows 43-72 had never
   received the N22 −1 space migration (the one-shot script was guarded on
   v8's end and retired to history/, P34; nothing compared an anchor's
   volume with its table) — seven rows sat outside their own volume range,
   ep 43 → 30 named "Gemini's Labyrinth" for the Taurus duel. The
   re-migration is MARKER-KEYED: every saint-seiya anchor row without the
   "space migration −1" marker shifted chapter / start / continue ≥ 30 by
   −1 and was stamped (30 rows moved, 30 stamped only), the three +1-space
   annotations (43 {30→29}, 47 {32→31}, 64 {39→38}) and the T6 text (ch 39
   → 38) with them; the wave's 100-113 rows arrived in OUR space and were
   stamped, not shifted. **`anchor_volume_mismatch` — a new census class
   (P5)**: an anchor whose stored volume is not the boundary table's for
   its chapter (table-derived only). First catalog run 27: seiya's 7 →
   **0** after step 0 (the proof), 20 remain across eight series
   (sailor-moon 3, black-lagoon 5, naruto 4, oshi-no-ko 2, AoT 2, beastars
   2, mashle 1, skip-beat 1 — ±1 in both directions, the stale hand-typed
   volume signature; a review queue, listed not blocking per Sean).
   DATA: **117 manual anchors** — hxh 79-91 → 145-183 (80 START 143, A10,
   the verifier), yyh 27-43 → 53-76 (six C1 continues on plain chapter
   straddles — Sean: the ledger's C1 wins over the protocol's "filler
   boundary" wording, fixed at capture), bleach 152-165 → 254-280 (153
   END 263 — first-time pages, the verifier; the un-cross-cut reorder
   `rearranged` 155-159), eyeshield 22-36 → 60-88 on 12 rows (**22/27/28
   → filler T6** on three sources; the delivered fence repair 21 → 48
   REFUTED on the pages — ch 49 pp 1-12 ARE the Taiyo draw, AFG's 47-49
   stands; a second never-adapted range: ch 49's tail + 50-52; the 31/32
   reorder real), kingdom 78-102 → 264-359 (six chapters the fandom's
   per-episode fields DROP restored on pcafe + licensor synopses; 103 =
   364 closes the 363/364 check), d-gray-man 1-50 → 22 anchors + 3
   hostile (**28/37/40 → filler T6**; fence 51 → 46 [45] v5; the two
   reorders 6-7 {2-4} / 26 {29}; **continues 5/6/24 → 2/3/29 — the
   verifier's refutation: C2 is the NEXT canon row's START, the bobobo
   precedent**), seiya 100-113 → 48-64 (a third V6 witness from
   SaintSeiyaPedia; ch 47 has NO animated counterpart; Aldebaran left for
   dead, not killed), naruto-shippuden 480-500 **0 anchors by design**:
   17 `side_source` novel rows in the ruled 452-457 shape (Sasuke Shinden
   484-488 / Shikamaru Hiden 489-493 / Konoha Hiden 494-500, four sources
   each, no `chapters=` on any of the 21 infoboxes), ep 479 → 699 [699]
   {699} v72 with the 478/479 notes repaired (the title-match reasoning
   was inverted) and **continue 700 post_series** (C5; Boruto ep 24
   carries ch 700). 50 curated continues (C7), 104 annotations, eyeshield
   15/16 → filler T6 (two sources; the afg anchor 15 → 34 DELETED, A1 — ch
   34 is ep 17's), hxh 83/84 → 2004-04-07 G53 (the Sunday witness), yyh 42
   "Master" → "Matter" G53, 9 boundary rows (yyh v6-v9, bleach v28-32),
   flags 677 / 702 dismissed (release-date artefact / WSJ installment
   count). RULED NOT DATA: the shippuden display question — novel rows
   stay a dash (T26 / P6), the continue lives on 479; a UI-pass note.
   Edges rebuilt + deployed (lib/rulings changed, P3). CENSUS: display
   219/0; ruling_violation 0; anchor_nonmonotonic 0 (all five END
   regressions annotated rearranged); continue_provenance_missing 0;
   continue_skip_unnoted 1 → 0 (eyeshield 31's C3 wording); anchor_gap_
   research 11 → 6 (the eight blocks closed; the class then surfaces each
   series' NEXT-worst run: kingdom 104-128, bleach 168-202, shippuden
   374-392 — new targets, not regressions); mu_pin_unverified 30 → 29;
   frontier_tail_null 8 unchanged (shippuden's tail is the ruled dash).
   CI: 15 red runs on main were TS2307 from five batch14-17 scripts
   importing lib/ by an absolute /Users/sean path (green locally, never on
   a runner) — relative imports, pushed. NEXT: /consolidate deep (P21 —
   the migration changed stored values on one series catalog-wide; a
   census class was added), then capture (the C1 protocol line; the ")
   /Vol" splitter finding on bleach #677; the "never adapted" instrument;
   the day-of-week class; the anchor_volume_mismatch ledger record).
79. ✅ **CONSOLIDATE DEEP after batch 20 wave 1 (2026-08-27; P21 — three
   enforcement sites changed: honest-terminal.ts, mu-frontier.ts' gate
   stack + mu-coverage.ts, mu-frontier-suppressed.ts).** Steps 0-8 satisfied
   by §12.78's save point (system census green, edges current, heal + census
   run, gates green). Rescan: every episode-keyed ruling points at an
   existing row (T6 / G53 dates + titles / T29 / A44 / T26 / A45 / G54);
   permanence_violation 0, permanence_candidate 50 listed, none signed;
   ruling_violation 0, mu_pin_flag_redundant 0, annotation_retired_standing
   0; the three G36 refusal flags (942 zatch-bell, 944 hellsing, 947
   slam-dunk) were closed by the writer's own G56 path — the gate proven end
   to end; the retiresWhen worklist gained only the three G37 entries (each
   retires when MU's field reads the terminal's chapter). Per-series
   consequences of the gate change, all explained in §12.78: frontier_tail_
   null 4 → 8 (honest: shippuden 480-499's old run-end pin was lending
   positions to un-researched rows; kaguya 41 / heavens 28 are "(Movie)"
   segments that ARE those entries' — queued as a per-series segment
   ruling), mu_skipped_terminal membership moved under A4-max semantics.
   Census unchanged otherwise. NEXT: Sean's go on wave 2 (PLAN.md L-A2).
78. ✅ **BATCH 20 WAVE 1 APPLIED — the seven G36 refusals closed (2026-08-27;
   Sean's rulings + Cursor's #8 sequence).** Research (7 verdicts, ≈909k)
   → verify (7 reports, ≈900k, nothing refuted on a terminal) → rulings →
   apply. LIB FIRST: (a) `honestTerminal` takes the MAX-chapter anchor (A4)
   — hellsing's relocated ep 10 → 2 had hidden the ep-7 → 12 frontier (G56
   amended, 5 tests); (b) the sibling-ceiling check came up empty (no film
   / sequel is a catalog entry), so **G32 gate 0 — labelled segments**
   (`lib/mu-coverage.ts`, pure, 13 tests): MU's per-work segments are read
   with their labels; an explicit EP dominates, TV / season / year-in-window
   markers pick this entry's, a Movie / OVA / foreign-year label never wins
   beside them, a ranged "EP 22-26" is a filler block, and a string with no
   entry marker is UNRESOLVED — today's pin kept, the series listed
   (`mu_pin_multiwork_unresolved`, 8) for a ruling, never a title guess;
   (c) a pin BELOW the researched max is `no_progress` (A4/A19; zero
   progress still writes — the Naruto rule); (d) three G37 suppressions for
   pins overstating a placed terminal by an arc / volume boundary (gantz 91,
   gto 106, toriko 263). DATA: 21 manual anchors incl. the honest terminals
   slam-dunk 96 → 197, hellsing 10 → 2 (frontier 7 → 12), gantz 21 → 90,
   gto 41 → 105, **zatch-bell 139 → 212 [212] MIXED** (Sean: a third of the
   episode of first-time pages is substantial — not the Claymore-24
   sliver), kinnikuman 119 → 273 (+116-118, 116 START 264 per the
   verifier's page cite), **toriko 146 → 254** (Toei's synopsis vs the
   fandom's plateaued "253"); toriko 145's anchor deleted (A1) + filler,
   144 mixed; 11 curated continues via `writeCuratedContinue` (C7 — the
   healer converted 0); 26 annotations (slam-dunk 101's graft refuted →
   loose_parallel{197}); G53 kinnikuman ×32 rows (exact vs all 137 ja-WP
   rows — the dateless claim since batch 18) + gantz {22, 25}; flags 691 /
   695 (MU's "editions" = the chapter of its latest-DATED release records,
   not editions) and 932 dismissed. OUTCOME: `mu_refused_episode_type` 7 →
   0; ruling_violation 0; anchor_nonmonotonic 0; display 7/7; frontier_
   tail_null 4 → 8, all honest (shippuden 480-499's old run-end pin had been
   lending positions to un-researched novel episodes; kaguya 41 /
   heavens 28 = "(Movie)" segments that ARE those entries' — a per-series
   segment ruling is queued). NOT written: gto total_chapters 208 → 200 /
   zatch 324 → 323 (re-derived from AniList; a chapter-count ruling map is
   the queued /add-rule). Edges deployed. Record: batch20/WAVE1-RECOVERY.md.
77. ✅ **C7 gets its gate — continue provenance (2026-08-27; /add-rule on
   Sean's go, from Cursor's process nit closing wave 2).** The parity healer
   had converted three JUST-APPLIED curated continues on the same pass
   (tokyo-mew-mew 28 → 20, eyeshield-21 43 → 101, project-arms 43 → 186):
   C7 said "fills only ABSENT metadata" but nothing on the row said curated
   — only the C1 guard (a value ≤ END) protected a value. Built per P31:
   **migration** 20260827100000 `chapter_anchors.continue_source`
   (manual | healer | source), backfilled from the writers' own note shapes
   (618 manual — every batch apply incl. batch 15's note-less rows; 2,492
   healer; 1 source); **lib** `lib/continues.ts` (pure: isCuratedContinue,
   curatedOverwritten, continueUnprovenanced, the healer-note prefixes; the
   DB helper `writeCuratedContinue` every apply uses from now on — the
   apply-batch skill says so), 4 tests; **healer** heal-parity-continues
   skips 'manual' rows (stamping an absent kind only) and marks its own
   writes 'healer'; the C3 skip-note pass skips curated notes too (a
   missing skip line on a curated row is the apply's to write —
   continue_skip_unnoted lists it); **writers** syncAnchors / applyContinua
   carry the marker through every rebuild; **audit** `ruling_violation`
   (a manual row wearing the healer's note = overwritten) +
   `continue_provenance_missing` (a continue with no marker); **ledger** C7
   amended (enforcement, classes, witnesses, aliases continue_source /
   continue provenance). Proof: the gated healer over the catalog —
   converted 0, stamped 67 absent kinds, nothing else touched; both classes
   0. The three values stay at C2 parity (C5: known future coverage) and are
   marked healer. Also this pass: Rosario 12/13 confirmed (card a — the
   strings corrected, HELD texts retired), Iruma 63 → 145 [142] rearranged
   (card a), Conan 513/514/584 (§12.76). Edges rebuilt + deployed; types
   regenerated. NEXT: batch 20 planning from disk.
76. ✅ **The wave-2 open pile RULED and applied (2026-08-27, Sean + Cursor).**
   (1) Sailor Moon 167-168 anchored under the pages line — 167 → 44 [38],
   168 → 49 [44], rearranged; the A44 entry superseded (value []); ep 166
   tightened to Act 49's outcome so the Eternal pages (48-49) are claimed
   once, at 168; continues 167 → 44, 168 → 50, healer 166 → 38 (C2). (2)
   hells-paradise 25 → 89 [86] v10 as a MANUAL anchor (A12: the four-page
   peek at ch 94 is a graft; P8: the next continua re-derive keeps manual
   precedence), continue 90 post_series = AFG's own resume. (5) The
   duplicate watch-order entries @24.5 / @112.5 dropped (one entry per
   AniList work; @24.1 / @112.1 carry the sign-off sentence); RULED_RECORDS
   pruned. (3)/(4) shugo-chara's reversed pairs and golden-kamuy 44 → batch
   20 (no G54 ack for a numbering bug; no date without a cite). Deep
   leftovers: kamisama ep 10 and dragon-maid ep 25 were already RULED AND
   APPLIED on 2026-08-24 — their HELD texts retired; the C7 gap (the parity
   healer overwrites curated continues) captured as an /add-rule candidate
   (system-evolution). Conan 513/584 strict-A4: a narrow research check
   (ytv / DCW / ja-WP) returned and is APPLIED: 513 → 629 [628] (file 630 is
   entirely ep 514's), 514 → 630 [629] as the companion anchor (the ep-525
   precedent), 584's END 708 CONFIRMED (file 708's opening plays in 584)
   with START 705 → 706; three straddle annotations (629 / 706 / 708); 513's
   613 continue stands (C1 guard). New source for the series: ConanWiki.org's
   per-CHAPTER plot summaries (German; Cloudflare-403 live — pre-2025
   Wayback snapshots). Two cards remain for Sean
   (WAVE2-RECOVERY §CARDS): rosario 12/13 (the stored values already equal
   the held repairs — confirm and fix the strings) and iruma 63 (145 [142]
   rearranged under the pages line, or the 142 ladder). Census: ruling
   _violation 0, nonmonotonic 0, watch_order 39 entries; display ok.
75. ✅ **CONSOLIDATE DEEP after batch 19 wave 2 (2026-08-27; the formal G56
   pass, P21).** Trigger: enforcement sites changed since d8f91f5 —
   lib/afg.ts#parseContinua (G22/G38/G44), filterEpisodeRows (G53 NULL +
   EPISODE_TITLE_OVERRIDES), annotations.ts (A45 gate), mu-frontier /
   honest-terminal (G56), row-presence (A42). Steps 0-8 were satisfied by
   the §12.74 save point (system census green, edges current, restage +
   heal + census run, gates green). The rescan: (a) **every episode-keyed
   ruling points at an existing row** (T6 / G53 dates + titles / T29 / A44
   / T26 / A45 / G54 checked mechanically — the 5D's renumber left no
   orphan; its three records are post-shift); (b) **retiresWhen sweep** (86
   conditions): the seven C9 "re-derive under C2/C3" records and x's T10
   "taxonomy-v2 lands" RETIRED in their applied files (the parity healer is
   the mechanism; T4.0 landed); kingdom / golden-kamuy I27 still unmet
   (Zoku-hen NOT_YET_RELEASED; 210073 unstaged); beastars T6, conan T6 (A-5),
   prisma G37 / rayearth I36 (D2), mashle P16, the I11 film collections and
   the MHA N31 labels stay parked on their conditions; kamisama-kiss P10,
   dragon-maid P10, rosario 12/13 and iruma 63 are SEAN'S open rulings and
   are now listed in STATE; (c) **G56 formal pass**: mu_skipped_terminal 7
   (beelzebub, chrono-crusade, ajin, detective-school-q, shugo-chara,
   claymore, rosario), mu_pin_flag_redundant 0, mu_refused_episode_type 7
   (slam-dunk, toriko, gantz, kinnikuman, hellsing, zatch-bell, gto — G36
   research items, unchanged); (d) **parser aftermath**: the continua now
   agrees with every manual / afg anchor it disagreed with (five flags
   closed in §12.74); dorohedoro's disagreement shrank to one chapter (964
   annotated); you-and-i-are-polar-opposites' flag 967 dismissed (the series
   is G26-suppressed); hells-paradise 25 → 94 is Sean's; (e) **Sailor Moon
   167-168 under the pages line (P23)**: the A44 record says "never-adapted
   Dream-arc material … behind ep 166's Act 49" — under "pages, not numbers"
   that is the saint-seiya 29-30 shape: 167 = Act 38's tail + Act 44's
   opening, 168 = Act 44's core + the Act 48-49 Eternal beat, all FIRST-TIME
   pages (batch 18, verified) → promotion candidates 167 → 44 [38] and 168 →
   49 [44], rearranged, with the A44 entry retiring — Sean's decision, listed
   with the evidence; (f) permanence: 0 locked, permanence_violation 0,
   permanence_candidate 50 listed, none signed. Census unchanged from §12.74.
74. ✅ **BATCH 19 WAVE 2 APPLIED (2026-08-27; Sean's rulings under the
   catalog line "pages, not numbers", Cursor concurring) — 27 series moved,
   one lib bug fixed, G53 extended, the 5D's space renumbered.** (1) **The
   afg.ts continua parser** (commit 4d2b9cc): "Chapter 104 (p. 23-36), 105 …
   108 (p. 1-19)" parsed to END 104 because the lazy capture stopped at "p.";
   fixed in lib (page parentheticals stripped; "." before digits is not a
   sentence end), 39 unit tests on the 36 staged sentences; afg-restage was
   skipping continua-only changes (fixed); 18 afg-continua frontiers moved
   (solo-leveling 104→108, one-punch-man 113→116, hells-paradise 71→94 …),
   manual anchors on oshi-no-ko / hikaru / hxh now agree with the source;
   five stale count_mismatch flags closed with the record. (2) **Kinds
   (T25):** solo-leveling manhwa, the-beginning-after-the-end webtoon (the
   `webtoon` record now says BY ORIGIN — OEL — never format), Arise AA
   original + T6 9-10 canon. (3) **B3 air dates (G53):** 36 series / 90
   ruled rows (82 verdict repairs − city-hunter 13/14, HELD by the verifier
   on thetv.jp's independent pairing → ORDER_ACK; + dbz-kai's five withheld
   NULLs and shugo-chara 94-98, DB-confirmed); **G53 now carries NULL**
   (dbz-kai's eight international-only rows: never broadcast in Japan; an
   honest gap, never a Toonami date) and **`EPISODE_TITLE_OVERRIDES`** (a
   row-content transposition carries the title with the date — tanya 5/6,
   to-love-ru 9/10, blue-lock 15/16, durarara 37/38, initial-d 46-48,
   golden-kamuy 45/46 (Dōga Gekijō web shorts), dbz-kai 128): same gate,
   assert, audit class; the G53 record amended. G54 acks: ranma 'all',
   when-they-cry, f-zero 'all', haikyu, michiko ties, GITS-SAC pairs,
   city-hunter, black-cat (the walk checks the regressing row — pairs name
   both). `airdate_withheld` 8 → 0 (the ruled NULLs are outcomes). (4)
   **Structure:** yu-gi-oh-5d-s N11 `drop [83] + shift −1 from 84, spaces
   ['afl']` — AFL had numbered the film Bonds Beyond Time as row 83 and
   omitted ep 145; film @82.5 order-only (movie, 6951); re-resolve → wiki
   backfill restored 145 → 1..154 contiguous, counts 154, title sweep @0 on
   every window, flag #1019 closed with the sweep (the 2026-08-23 #793
   dismissal was wrong). black-cat I39 span 68 → 1-24 (the community
   numbers 24; row 15 = the Animax-broadcast OVA, date 2006-05-23, tv).
   34 watch-order kinds → RULED_RECORDS (kind-only records allowed; the
   three uncitable listed). (5) **B5 anchors (the wave apply, 99
   decisions):** conan 510/511/**524→636 + 525→637 strict A4**/585;
   eyeshield 38/43/62→124 (NOT 120 — Bandai Channel synopses; the 120/121
   swap RETIRED, A45) + 59/63 START repairs; kinnikuman 32/46 (HIGH — dアニメ
   ストア + ja-WP found), ep 31 END 96, the "reordered Olympics" fact RETIRED
   (Warsman debuts ch 94, not 107) → abridged{95-120} minus 35=101; x 15→41,
   19→53, five A44 rows (the END-43 / END-49 options recorded), 20 → 95
   post-series, the "X/1999" strings parenthesised (no phantom ch 1999); TMM
   25-28 (vol 4's split pinned by chapter TITLES) + batch 17's parked 38→19
   / 40→18 as the A41 settled reorder (the zone partial RETIRED); **saint-
   seiya 29/30 → 24 ANCHORED, rearranged** (ch 24's back half airs there
   first-time — the pages line; 32 A44); project-arms 44→190 [186] + 43→161
   (A18); bobobo 3→3 [2] backwards with two parity continues; ranma 93→58
   [56] and **130 → mixed + graft, A44** (ch 58's ending is first-time —
   the verifier refuted "re-use"); emma 2 A44. The parity healer then
   overrode three curated continues (TMM 28, eyeshield 43, arms 43) to C2
   parity at the next START — C5 says so when future coverage is known;
   kept. Census: ruling_violation 0, anchor_nonmonotonic 0, display 220/0;
   the A18 hole work-list gained TMM 19/21/37/41/44 + eyeshield 39. Edges
   rebuilt + deployed twice. Open for Sean (WAVE2-RECOVERY §APPLIED):
   hells-paradise 25 → 94 (a pull-forward sliver as END), shugo-chara's
   four reversed pairs + the AFL 73-skip/double-96 renumber, golden-kamuy
   44's date, the two watch-order duplicate pairs. NEXT: the formal
   `/consolidate deep` (G56's + the parser + the G53 gate changed).
73. ✅ **A42 gets its outcome class — `anchor_without_row` /
   `annotation_without_row` (2026-08-26; the third post-wave-1 /add-rule).**
   Not a new rule: A42 ("an exact anchor with no episode row synthesizes the
   row", the cells-at-work 12/13 lesson) was a display-only record with an
   EMPTY audit-class cell. The consolidate-deep probe found what it was
   hiding: 21 anchors on 9 series and 20 annotations on 3 series standing on
   rows the sources never produced — visible only through the aired>rows
   queue. Built: `lib/row-presence.ts#orphanRecords` (pure, 4 tests; a
   record past aired_episodes is flagged as a NUMBERING FAULT, since
   assembly refuses to synthesize it) and two census classes that LIST,
   never delete (A6): `anchor_without_row` — cells-at-work 12-13 / 20-21
   (its AFL page staged 0 rows), to-love-ru 39-44 and bokuben 26 (AFL lag,
   research ahead of rows), shy 24 / orient 24 / cells-at-work-code-black 13
   / one-piece-log-fish-man-island-saga 21 (row-less series carrying one MU
   pin each), arslan 33, shounan-junai-gumi 1-5 (a row-less series with
   research anchors); `annotation_without_row` — to-love-ru, bokuben,
   shounan-junai-gumi. A42's record gains the lib + census enforcement
   sites, the aliases and the witnesses; its statement now says annotations
   ride only once the row exists. No writer changed (research ahead of rows
   is legitimate; the display synthesizes the row) — so no /consolidate
   deep for THIS one. Correction for the record: G56 (§12.72) DID change an
   enforcement site (applyMuFrontier is G36's), so P21 technically fired;
   the coverage healer's catalog pass (7 skips, 3 refusals, 4 flags closed)
   was the data pass, and the formal deep is the one after wave 2. Edges rebuilt and deployed (lib-hash). The three post-wave-1
   /add-rules are done (A45, G56, A42's class); next is Sean's go on wave 2.
72. ✅ **G56 — HONEST TERMINAL: a covered MU pin is redundant, not a flag
   (2026-08-26; the second post-wave-1 /add-rule).** MU's anime field names
   the LAST EPISODE of a studio ending ("Vol 11, Chap 59 (Original Ending
   EP 24-26)") — a filler row — so the G36 refusal re-filed claymore's flag
   #945 on every run even after batch 19 anchored ep 23 → 59, the very
   terminal MU points at. Built per P31: **lib** `lib/honest-terminal.ts`
   (pure, 4 tests): the honest terminal = the non-MU anchor on the last
   canon/mixed row at or before the pin episode; the pin is redundant when
   it already reaches MU's chapter. **Writer** `applyMuFrontier`: a pin on
   an A1 / A44 row that is covered returns the new `skipped_terminal`,
   writes nothing, and CLOSES its own open refusal flag of that shape; an
   uncovered pin still refuses under G36 (the research queue). **Audit**:
   `mu_skipped_terminal` in the coverage audit (7 today: claymore,
   rosario-vampire, beelzebub — whose flags #945 / #946 / #948 the writer
   dismissed — chrono-crusade (its fresh #1023 closed once the terminal
   learned to skip A44 position-less rows: ep 21 is mixed but can hold no
   position, ep 20 → 30 is the terminal), ajin-demi-human (ep 22 A44,
   terminal ep 19), plus detective-school-q and shugo-chara, which had been
   refusing silently without an open flag) and `mu_pin_flag_redundant` in
   the census (an open refusal flag the terminal already covers — 0 after
   the run). Three refusals stand as honest research items: zatch-bell 139
   (ep 138 → 211 is one chapter short of MU's 212), hellsing 13, slam-dunk
   101. Ledger G56 (aliases: honest terminal, covered pin, the claymore #945
   class; see A26 — the pin-EPISODE redundancy — and G36/G37). Edges
   rebuilt and deployed (refresh-mu carries the writer). Next /add-rule:
   `anchor_without_row`.
71. ✅ **A45 — RETIRED ANNOTATIONS: a refuted fact is retired by ruling
   (2026-08-26; the first post-wave-1 /add-rule, Sean's order: this, then
   the MU "EP N" skip, then `anchor_without_row`).** Research-origin
   annotation rows had no delete path (the T26 healer reconciles only
   ruling-origin rows; lib/annotations.ts exposed no delete; batch 17's
   ANNOTATION_DELETIONS were script one-shots a re-run could undo) — the
   batch-19 verifier named the gap on claymore's three batch-3
   loose_parallel{57-59} rows, refuted twice and still standing beside the
   divergence rulings that superseded them. Built per P31: **map**
   `lib/rulings/retired-annotations.ts` (RulingEntry: series, episodes,
   kind, reason, cite; witnesses claymore 21-23 loose_parallel, railgun 25
   partial{~18}, railgun 49 partial{40-42} — the two wave-1 script deletions
   now durable); **gate** `annotationProblem` / `upsertAnnotation` refuse a
   retired key (no apply can re-insert it); **healer** `assert-overrides
   → assertRetiredAnnotations` removes a standing row on a retired key
   whatever its origin (ran: 5 ruled keys, 3 standing rows removed — the
   claymore three); **census** `annotation_retired_standing` (→
   ruling_violation) plus a maps-contradiction check (retired ∩ standing
   T26 → ruling_violation). Ledger A45 (aliases: retired annotations,
   annotation-delete shape, annotation retirement). Also fixed the
   `loose_parallel` gloss in lib/annotations.ts — "(anime outran the manga)"
   was the refuted Claymore premise baked into the vocabulary text. Census:
   annotation_retired_standing 0, ruling_violation 0, no other delta. Edges
   rebuilt and deployed; 68 tests. Next /add-rule: the MU "EP N" pin skip.
70. ✅ **CONSOLIDATE DEEP — batch 19 wave 1 closing pass (2026-08-26; P21:
   C1's enforcement site changed).** Step 0 green. **The C1 guard,
   catalog-wide:** 2,342 stored continues sit at or below their own END (the
   C1 / C3 shapes — mostly AFG-derived parity rows); exactly ONE would have
   been converted by the old parity healer (soul-eater 36 → 38); the guard
   now protects all 2,342 from future neighbour changes. `npm run heal` was
   idempotent (0 changes). **Deep rescan (P23/P24):** (1) `retiresWhen`
   worklist — RETIRED the 27 A-6 seeded-start records (E3), claymore's T6
   "nothing retyped until T4.0" hold, railgun's three ep-12 / ep-14 notes
   (wave 1), two stitched I33 records; DROPPED the fotbs 3864 and dr-stone
   142876 N7 reviewed-specials entries on their own condition (both
   components are order-only). Still open by design: T24, D2 (prisma /
   rayearth), the Sean forks (rosario 12/13, kamisama ep 10, dragon-maid ep
   25, iruma ep 63), the airing-event chains (kingdom Zoku-hen, golden-kamuy).
   (2) Stale flags — seven dismissed with reasons (#817 / #787 kenshin-2023
   after E2; #943 trigun; #841 soul-eater; #849 railgun; #928 / #439 chrono).
   (3) Rulings on rows that do not exist: 29 hits, all explained — N8/N2
   drop rulings by design, and ANCHORS RESEARCHED AHEAD OF ROWS on
   cells-at-work 12-13 / 20-21, to-love-ru 39-44, bokuben 18-26 — the
   `integrity_total_beyond_eps` queue (AFL lag, and cells-at-work's AFL page
   staged 0 rows). Ran the `wiki-episodes-backfill` EVENT (the PLAN's
   post-E2 item) over the 12 queue series through the G55 gate: dai +83
   rows, 5D's row 155 and prince-of-tennis row 1 recreated; **G55 fired for
   real — prince-of-tennis's page family carried 24 rows dated 2006-2009 (a
   namesake) and refused every one** (flag #1017); cells-at-work /
   to-love-ru / bokuben found pages but could not offset-lock (queue stays).
   (4) A probe false positive worth recording: 28 I-family rulings look like
   "series that no longer exist" because I11/I15/I17/I24/I27 are keyed by
   AFL slug / franchise key by design. **Census deltas (all explained):**
   integrity_total_beyond_eps 12 → 9 and title_incomplete 28 → 25 (the
   backfill); anchor_gap_research 10 → 11 (dai's 83 new canon rows are
   unanchored past ep 17 — batch 20 A2 territory); ruling_violation 0;
   verify-series-display 220/0; permanence_violation 0 (no locks);
   permanence_candidate 38 = Sean's signing queue after the UI pass. Four
   edges rebuilt and deployed (lib-hash current). **Capture (P29):** rule →
   C1's healer site (done this wave); class candidate → `anchor_without_row`
   (an anchor whose episode row does not exist — today invisible except via
   the aired>rows queue); process items unchanged and queued for after this
   pass — the annotation-delete shape, the MU "EP N" pin skip / G37, the
   `loose_parallel` gloss, trigun's durable space ruling. Traps → the
   research-agent definition at the next batch close (WAVE1-RECOVERY §Traps).
   Cycle position: batch 19 wave 1 CLOSED; next is Sean's go on the three
   /add-rules or wave 2 (B2-B5), with D2 / apothecary parked.
69. ✅ **BATCH 19 WAVE 1 — research, verify, rule, apply (2026-08-26).** The
   first anchoring wave after the restructure: A3 frontier tails + B1
   batch-18 follow-ups as ONE list under `batch19/PROTOCOL.md` (batch 17's
   shape, rules by id; pinned R31, amended once between waves — C5 not C4;
   an example volume). Five research-agents (≈973k) → eight verdicts,
   landing gate 0 failing → eight `verdict-verifier` reports on the other
   model (≈986k): NOTHING REFUTED, six with corrections that were apply
   mechanics, rule ids and note text. Sean ruled "as recommended" with four
   diffs (Cursor concurring). **Applied (42 decisions):** claymore's frontier
   moves ep 20 → **ep 23 → Scene 59** (anchors 21→57, 22→58, 23→59; continue
   60 post-series; C8 57 → 60; "Madhouse outran the manga" refuted against
   Shueisha and rewritten in every ruling text); ajin S2 anchored 14→24,
   15→25, 16→26, 17→28, 19→27.5 (a documented 26 → 28 → 27.5 reorder; the
   .5 kept as the catalog's unit with the Kodansha FILE:27 (2) conversion
   stated), post-series **29**, ep 22 position-less (A44), ep 13's impossible
   END 21 → 22.5 and its continue 22 → 23 with the stale C3 note rewritten;
   chrono 15-16 → FILLER (the primary sources backed the batch-18 verifier;
   the curator's brief had inverted the flag), ep 21 A44, continue 20 → 31;
   trigun 16 → 20 (finishes ch 20; START 20 under A12), continue **20** with
   "the space ends — next is Trigun Maximum ch 1" (Sean: not 21, a chapter
   that does not exist; the durable space ruling is a follow-up), ep 18 A44
   + side_source{Trigun Maximum ch 1-2}; soul-eater ep 36 END 36 → **37**
   (afg-continua → manual; AFG's own page-level continua was right), continue
   **37** = C1 (batch 18's 40 refuted: ch 39's climax is unadapted); gto
   25-26 → **CANON + side_source{Shonan Junai Gumi! 'Last Signal' ch
   234-242}** (SJG contains the race — Kodansha's own vol-27 blurb among five
   sources; carved out of the A-7 divergence span and the 22-26 filler range;
   the SJG chapters live in the note); railgun 14 stays filler (no
   incorporation reaches it), 25 partial{~18} → graft{41}, **49 keeps
   graft{41} with a corrected note** (the verifier caught the verdict's
   "no source says ch 41" — T#1's own prose says it) and loses only the
   contradictory partial{40-42}, ep 12 continue 17 → 18 (ch 17 was animated
   at ep 2; parity resolves against ep 26, the next row with a KNOWN start);
   DBS 18-27 → **canon + side_source{the Resurrection 'F' film}** (Toriyama's
   sole screenplay + the manga's incorporation in the note, no
   adopted{author}; 1-14 untouched). **Healer:** the parity healer gained a
   C1 GUARD — a continue at or below its own END is a ruled straddle, value
   kept, kind stamped (it would have flipped soul-eater 36 → 38); C1's ledger
   record gains the enforcement site → `/consolidate deep` is required
   (P21). **Census:** ruling_violation 0; frontier_tail_null 7 → **3** (the
   three parked decisions: prisma-illya + rayearth = D2 scoped entries,
   apothecary = which of two manga is the source, then T24);
   rearranged_zone_unanchored 11 → 10; anchor_nonmonotonic 0;
   verify-series-display 220/0. Akame left the tail class by script (A44
   rows are not a tail). **Left as ruled / process items:** claymore's three
   stale loose_parallel{57-59} rows wait for an annotation-delete shape
   (batch 17's ANNOTATION_DELETIONS is the script-level precedent; no
   lib/heal path); claymore flag #945 (an MU "EP 24" pin on a filler row —
   G37 suppression or the P30 redundancy-skip extension); the
   `loose_parallel` gloss in lib/annotations.ts carries the refuted premise;
   trigun's display total. Traps captured in WAVE1-RECOVERY.md (a brief can
   invert a verifier's flag — quote it verbatim; AFG's continua panel is
   page-level; both Trigun wikis publish continuous numbers across Maximum;
   cover-only ties are not grafts; ajin's ep-22 fandom air date). Lib changed
   → four edges rebuilt and deployed. No wave 2 without Sean's go.
68. ✅ **BATCH 19 E4 — ruled structure (I39): the 32 component-less rows
   (2026-08-26).** `series_components` is rebuilt from the AniList chain by
   four writers, so a hand-inserted structure row is wiped on the next
   rebuild — the P8 lesson applied to structure. Built: **the map**
   `lib/rulings/structure.ts` (`RULED_STRUCTURE`: numbered extras — an OVA /
   special / movie with its own AniList id placed after a chain member, or
   first with `startAt: 0` for an episode-0 row, holding `rows` rows; span
   overrides on a member's start or end); **the planner**
   `lib/structure-plan.ts#planComponents` (pure, 7 tests) that
   `writeComponents` and the new standard-roster healer `heal-structure.ts`
   both call (P2); **census**: a ruled extra is its own N7 review, and every
   extra / override is asserted as an outcome (ruling_violation). Identity
   evidence is the exact air-date join (row date = AniList start date, the
   sync-watch-order rule) plus the batch-18 verdict where one exists.
   **Fifteen rulings landed** (session, cited; Sean signs at this stop):
   kenshin 95-98 [44] + 99-100 [401]; SAO 50 [21403]; clannad 24 [4059];
   after-story 25 [6351]; angel-beats 14 [10067] + 15-16 [9062]; bebop 27
   [5] (the E2 residual, now a movie component); durarara 25 [8408] — and
   the batch-18 finding that x2 Shou/Ten/Ketsu sat one row low is fixed by
   the shift (26-37 / 38-49 / 50-61, row 61 covered); kamisama-kiss 30
   [98033]; heavens-lost-property 14 [7858] — the OVA AFL numbers 14, which
   moves Forte to 15-26 and the films to 27 / 28 (their N7 reviews stand;
   the '26' / '27' wording in reviewed-specials was one row stale); the
   episode-0 specials assassination-classroom [21303], another [11701],
   deadman-wonderland [10418], no-game-no-life [21875, movie]; span
   overrides outlaw-star 400 → 1-26 (Sunrise; batch 18) and fate/UBW 19603
   → 0-12 (AniList's 13 counts the prologue; S2 13-25). Census:
   episode_without_component 20 → **5**, format_missing 14 → **5**,
   special_numbered_unreviewed 0, ruling_violation 0, verify-series-display
   --all passing. **Five forks stay listed for Sean, none touched:**
   black-cat 24 — the OVA [2589] by title (Toozakaru Neko = "The Carefree
   Cat") but our stored date 2006-03-30 is the TV finale's, AniList says
   2006-07-26 (identity + a G53 date, or a numbering question);
   high-school-dxd row 0 — Sean ruled HERO's Episode 0 ORDER-ONLY
   (COMMUNITY_COUNT_OVERRIDES, 2026-08-24) yet a numbered row 0 stands
   (2018-04-10 "Holy Behind the Gymnasium"): drop the row (N11) or rescind;
   yu-gi-oh-5d-s 155 — AniList / Wikipedia count 154, our rows 154 and 155
   both dated 2011-03-30 (a double-length finale split by AFL, or an
   off-by-one earlier in the run): lane B4; fist-of-the-blue-sky 23-26 — the
   four DVD episodes' span was demoted to order-only on 2026-08-25b while
   AFL's rows 23-26 still stand (plus the E2 series-row fault: end_date
   1987, aired 22): rows drop or the span returns, Sean's call;
   detective-conan 1211-1212 — future-dated AFL pre-listings ahead of
   AniList's aired count: the I33 airing lag, no ruling. Lib changed → four
   edges rebuilt and deployed. Next: B1-B5 + A3 waves per the plan, on
   Sean's go.
   **SIGNED by Sean the same day** (Cursor concurring): the 15 flip to
   `ruledBy: 'Sean'` — "components now follow the rows; the rows were not
   renumbered". Forks ruled, no structure invented: **dxd row 0 DROPPED**
   under N11 (`SOURCE_NUMBERING_SHIFTS` drop [0]; the standing row removed
   by re-resolving the series through filterEpisodeRows; the special
   recorded order-only at 36.5 in ingest_fractionals, the seraph precedent);
   conan = airing lag, no ruling; 5D's 155 and black-cat 24 → lane B4 (a
   same-date double row and an identity + G53 date question — not component
   patches); fotbs 23-26 left listed (the span was demoted order-only on
   08-25; not brought back here). Also logged for after batch 19, not in
   it: the ARC MODEL (source arcs by ch/vol, anime arcs by name, the
   mismatches) — `docs/system-evolution.md`; relations, components and
   annotations cover sequel/prequel, seasons and divergence until then.
67. ✅ **BATCH 19 E3 — drift item A-6: the sliver rule lifted into lib,
   the seeded starts made provable, deltas listed for Sean (2026-08-26).**
   A10 (START = first chapter animated; a leading partial of the preceding
   chapter counts unless ≤5 pages or sliver wording) lived only as
   duplicated code in the batch-14 and batch-17 apply scripts; the 27
   batch-8/9 starts seeded by `history/apply-start-chapters.ts` under the
   earlier MAJORITY rule were never re-normalized — and could not be: their
   rows carry NO `chapters_adapted`, and the batch-8/9 verdict files never
   reached git (the seeding script's inline comments are the only span
   record). Built: **lib** `lib/sliver.ts#sliverStart` (the batch-14/17
   logic verbatim, 10 tests: MHA 170, AoT 87's relocated opener, bokuben's
   wordy "2nd half", the 6-page bar, unquantified "tail" = scraps);
   **two listing classes** over every MANUAL anchor — `start_sliver_mismatch`
   (stored START ≠ what the rule derives from the row's own record) and
   `start_without_span` (a START with no record cannot be proven); **the
   sign sheet** `research/batch19/apply-e3.ts` (dry-run by default;
   `--apply` after Sean signs) — (1) START moves derived at run time, (2)
   the 27 spans transcribed verbatim from the seeding comments as
   `chapters_adapted` so the rows become provable. **The A-6 answer:** under
   A10 all 27 seeded starts STAND — 23 open on their own start chapter, the
   three that open on a tail are 1-page scraps (oshi-no-ko 34 `114 p.18`,
   jujutsu-kaisen 34 `90 p.21`) or already start on the partial (aot 73
   "half of 112"; jjk 42 `120 p.7-19`). The catalog-wide re-run found the
   drift elsewhere: 243 manual anchors open on a partial of start−1, 241
   stand as scraps, **2 move** — both batch 12, pre-rule: we-never-learn
   ep 6 `17 → 16` ("16 (2nd half)", wordy share) and my-hero-academia ep 61
   `118 → 117` (`117 p10-15`, exactly 6 pages). A10's ledger record now
   points at the lib, the sheet and the classes (was: two history scripts,
   no audit class). Nothing written to anchors: `start_sliver_mismatch` 2 /
   `start_without_span` 27 stay in the census until Sean signs
   (`apply-e3.ts --apply`), then both go to 0. ruling_violation 0. Lib
   changed → four edges rebuilt and deployed. **SIGNED by Sean the same
   day** (Cursor concurring: "both moves are A10 as already ruled"):
   `--apply` wrote the 2 START moves and the 27 span records;
   start_sliver_mismatch 0 / start_without_span 0 / ruling_violation 0.
   E4 next, as its own stop.
66. ✅ **BATCH 19 E2 — G55 series-window identity gate; the namesake
   contamination purged (2026-08-26).** The wiki backfill found episode
   lists by NAME and merged a namesake's page. A catalog probe (every row
   dated outside its own series' run) found the damage was three series,
   not two: rurouni-kenshin-2023 25-27 (the 1996 series), beyblade-x
   41-102 (sixty-two rows of 2001 Beyblade — the plan said 41-44), and
   ranking-of-kings-the-treasure-chest-of-courage 1-10 (the 2021 main
   series' first ten). The inline per-page year check had not held (the
   offset-lock and continuity paths never saw it) and G54 could not name an
   outlier (a whole block changed era). Built, in the P30 direction:
   **lib** `lib/wiki-identity.ts` — `dateFit` (a TV row > 45 d before
   start or > 400 d after a FINISHED end is not the series' row; ep 0 and
   non-tv formats exempt by structure; a series with end < start is a
   series-row fault, not windowed), `pageFitsSeries` (the old inline
   check, now shared), `disambiguatedTitles` (the series' own
   "(YYYY TV series)" forms tried BEFORE a plain namesake title);
   **ruling map** `AIR_DATE_WINDOW_ACK` (haruhi 'all' — the same fact as
   its G54 ack); **writer gate** in `wiki-episodes-backfill.ts` — refused
   rows write nothing (title included) and flag `match_ambiguous` once;
   **class** `episode_date_off_window` (lists, never flips); **purge**
   `research/batch19/apply-e2.ts` — a curated list with the evidence inline,
   each row re-proven against the predicate before wiping title + date
   (75 rows wiped, 0 refused). §E.8 unification landed in the same pass:
   the script-local `WIKI_NUMBERING_SHIFTS` (always empty) is gone — a wiki
   shift is declared in `SOURCE_NUMBERING_SHIFTS` with 'wiki' among its
   spaces and wiki numbers enter our space through
   `translateEpisodeNumber(…, 'wiki')` like every other source's (N21
   re-pointed). Re-fill through the gate: kenshin-2023 25-47 now carry the
   2024-25 Kyoto season (44-45 honest nulls), beyblade-x 41-132 the
   2024-26 BEYBLADE X run (30 rows created, format healed), the Treasure
   Chest article is a REDIRECT to the parent series' 2021 table — rejected
   by the gate, its ten rows stay an honest gap (title_incomplete /
   airdate_incomplete list it). Ledger G55 (aliases: series window,
   namesake lesson, E2). Census: ruling_violation 0;
   `episode_date_off_window` 6 = the residual queue for Sean — cowboy-bebop
   27 "The Movie" 2001 (a movie row with format null → a T29
   FORMAT_OVERRIDES entry, then exempt), dragon-ball-z-kai 101-103 dated
   2017 (the cut Great Saiyaman episodes' later broadcast → G55 ack
   candidate, needs a cite), three single-date typos — the-future-diary 13
   `2011-01-09` between 2011-12-26 and 2012-01-16, yu-gi-oh-gx 14
   `2004-01-05` between 2004-12-29 and 2005-01-12, yu-gi-oh-5d-s 35
   `2008-01-26` between 2008-11-19 and 2008-12-03 (G53 candidates: the
   pattern is a year/month slip, the cited date is the research step) —
   and fist-of-the-blue-sky's series row (end_date 1987-03-05 < start
   2006-10-05; its 26 rows are correctly 2006-07 — the 2006 series had 26
   episodes, our aired/total say 22: a series-row fault for the AniList
   refresh / reconcile-structure to look at). Lib changed → four edges
   rebuilt and deployed. Nothing else started (E3 next, on Sean's go).
65. ✅ **BATCH 19 E1 — `mixed_fragment_only`, the T28 discrepancy queue
   (2026-08-26; the parked /add-rule, landed as T28's audit class).** A
   row typed MIXED before the materiality bar whose only recorded source
   ties are fragment annotations (graft / partial / loose_parallel) and
   which carries no anchor — T28 would say filler + annotation. The class
   LISTS, never flips (P23): rows a T6 entry ruled on or after the bar's
   date are excluded (Sean judged them under it); anchored mixed rows are
   excluded (a real position is substantial by definition). Queue today:
   **17 series / 35 rows** — naruto 38/52-55/99, naruto-shippuden 89/90/213,
   chrono-crusade 8/14/17/21, bleach 32/46/284, tokyo-mew-mew 19/21/37,
   heavens-lost-property 18/23/24, eyeshield 39/66, and single rows on
   zatch-bell 122, saint-seiya 64, trigun 6, ippo 76, rosario 14, fire-force
   25, dsq 1, ranma 130, sailor-moon 36, black-butler 37. Caveat the class
   cannot judge: a `partial` written before T28 often means "adapts PART of
   its chapters" (a substantial share) — those stay mixed; the queue is
   for Sean's per-row call, not a verdict. No data changed. Nothing else
   started (E2 next, on Sean's go).
64. ✅ **P25 PERMANENCE TIERS — built (2026-08-26; the first post-restructure
   /add-rule; Sean's call #1).** The LOCKED ruling map
   (`lib/rulings/permanence.ts`, Sean-signed entries only — none yet),
   `series.permanence` mirrored by the healer (migration 20260826500000),
   and two outcome classes: **`permanence_candidate`** — the mechanical
   half of the criteria (anime finished; source finished where an
   instrument exists; mapping full; a research/manual-tier anchor; source
   kind ruled, never `other`; NO open census item on the series) = Sean's
   signing queue, 34 today (33 "no instrument" studio originals / VN / game
   series that pass trivially, and ONE full mapping: dr-stone); and
   **`permanence_violation`** — a locked series failing any criterion (data
   drifted under a lock) = 0 and MUST stay 0. Mechanics: routine deep skips
   LOCKED (consolidate skill step 9); a rule-change deep never does;
   research work-lists exclude LOCKED unless the batch exists because a
   rule changed (research-batch skill); every writer still runs. P25 marked
   live; one-hop case 24. Nothing signed — the census computes the queue,
   Sean signs. Edges deployed; ruling_violation 0; display 220/0.
63. ✅ **RESTRUCTURE PHASE CLOSED — P36 passed (2026-08-26).** The cross-model
   frame check ran live in the closing thread (Sean + Cursor): glossary §1
   matches what got built; the success test passes (no "anime only" type;
   Madoka is not Black Clover 130-157); T28, A44 and the incorporation basis
   are growth on the frame, not a second system. P36 marked live. Cleanup
   only: T4-GLOSSARY §7 rewritten as RULED / STILL OPEN (twin-star,
   claymore, gto and the rest were still listed as open). Nothing new
   started. The phase's record: T0 inventory → T1 ledger (258 → 267 rules,
   ids cited everywhere) → T2 typed rulings + rosters + history + system
   census → T3 skills rewritten, /add-rule proven twice (G53, G54) → T4.0
   glossary ruled → T4.1-T4.5 built (T25 source registry, T26 annotations,
   T27 three standings, T29 format, T19 words) with batch 18 in the middle
   (32 verdicts, 19 verifications, T28, A44, ~8M tokens) → consolidate deep
   (a fixed point). Next phase is Sean's: permanence (P25) as the first
   /add-rule, batch 19, the UI chip pass.
62. ✅ **CONSOLIDATE DEEP — the T4 build sealed (2026-08-26; P21 required it:
   T25-T29, T28, A44 changed enforcement sites catalog-wide).** Step 0:
   system census green. Steps 1-2: every writer through the shared gates
   (three new healers rostered; edges current). Step 4: `npm run heal` is a
   FIXED POINT — source kinds 0 changed, standings 0, types 0 asserted,
   annotations 356 asserted / 0 stale, dates 0, order gate 0 withheld,
   watch-order 39 synced, format 0 changed. Step 5: the census did not move
   a single class against the post-T4.4 run; ruling_violation 0; A1 0;
   display 220/0. **Step 9 (deep):** (i) `retiresWhen` worklist — four
   conditions met by batch 18 RETIRED on the standing T6 entries (x,
   claymore, gto, ajin: the A-7 "taxonomy-v2" parking → superseded text),
   four applied records marked OVERTAKEN (batch-11 gto, batch-12 ajin,
   batch-15 graft/sliver encodings → T26/T28); still pending, listed: the
   continua chart cross-check gate (G26 entry), the D2 split (mu-frontier
   suppression), fotbs/dr-stone order-only confirmations (reviewed-specials),
   the STATUS design pass labels (N32), film-collection exclusions, the
   conan A-5 re-check under T8, the kingdom step-stool line, two override
   chains awaiting airing, two batch-15/16 Sean items (ep-25 endpoint; ep-10
   segment order). (ii) Notes as precedence (P23): the A-7 spread note said
   "on Sean's batch-18 review list" — RULED (wave 2) → rewritten, re-asserted.
   (iii) Rulings pointing at rows that no longer exist: 0 (all six maps
   checked). (iv) Flags: 392 open → 358 after cleanup; the +34 were the
   coverage healer's "has a manga source_type but no manga link" fired on
   every LN series once hasInstrument came from the source KIND (T4.1) —
   the missing link on a volume-unit source is the NOVEL side (T24), not a
   manga hole → the healer now skips volume-unit kinds; the 34 dismissed,
   listed in the commit. The remaining today-flags (7 afg continua
   disagreements, 1 afg parse) are real review items. (v) Dead constants:
   `WIKI_NUMBERING_SHIFTS` (empty, still consulted) stays the §E.8
   unification sidecar. (vi) Runbook §5 rewritten: the rosters ARE the
   script list; the restructure-phase healers named; no apply script per
   batch any more. (vii) Permanence tiers (P25): designed, NOT built —
   proposed as the first post-phase /add-rule (a LOCKED map + a census
   class), not bolted onto this pass. (viii) User-visible string flagged,
   not fixed (Cursor): the detail header and strip tooltip render the tail
   badge with `replace(' ', '_')` ("manga_only") — the chip pass decides
   the token grammar. Capture (P29): every batch-18 learning is already a
   rule (T28, A44, T26's basis), a trap (research-agent.md), a ruling map
   entry or a census class; nothing left without a home. CYCLE POSITION:
   between batches; the restructure phase's last step is the P36
   cross-model frame check.
61. ✅ **T4.5 — THE WORDS (T19 rewritten; T3.2 + T3.5 landed; 2026-08-26).**
   Strings only, per Sean's T4.0 D-12 and Cursor's scoping. The display
   vocabulary is now exactly canon / mixed / filler + `{noun} only`: the
   `EpisodeType` union is the three standings; TypeBadge kinds are
   canon | mixed | filler | source_only, the last rendered from the
   SOURCE_KINDS registry's tailBadge (manga only / manhwa only / novel only;
   a VN or game series has no tail badge); `MappingSummary` carries
   `tailBadge` and `sourceLabel` (`studio original` for originals) for the
   UI pass; the anime_only badge, count, filter and detail-page stat are
   GONE (they had rendered nothing since T4.3); 'anime-only-canon' is out
   of every component map, the strip, the episode list, the mocks and the
   tests. AFL's staging value keeps its own type (`AflType`, G51 — the claim
   is stored, never typed). CLAUDE.md invariant 6 reads "Filler rows never
   carry chapter anchors; A44 position-less rows never do either"; A1's
   statement says the same; lib comments follow. T3.2 PROTOCOL collapse:
   the vocabulary lives ONLY in the research-agent definition (standings,
   annotation kinds + bases, T28, the traps); a batch PROTOCOL pins the task
   shape and cites rules by id (batch 18's is the template; batch 17's is
   history) — research-batch SKILL.md says so. T3.5: the agent definitions
   were rewritten incrementally through batch 18 (vocabulary passage, four
   batch-18 distinctions, nine traps) — done. No data changed; display
   220/0; tests 41/41. The glossary's §6 build order is complete except
   step 8. NEXT: `/consolidate deep` (P21 — T4 changed enforcement sites
   across the catalog), then the P36 cross-model frame check.
60. ✅ **T4.4 — THE FORMAT AXIS (`T29`; T23 amended; 2026-08-26).** Sean's
   T4.0 D-11 built: `episodes.format` ∈ tv | ova | special | movie | recap,
   nullable, DERIVED (never typed by a source, never a type): a
   `FORMAT_OVERRIDES` ruling wins, else the containing component's kind
   (season → tv; ova / special / movie carry their own), else NULL — the
   honest gap. `lib/format.ts#deriveFormat` is the one derivation;
   `heal-format.ts` (standard roster, batched writes) asserts it; the census
   checks stored = derived (ruling_violation) and lists `format_missing`
   (the queue) and `episode_without_component` (the structure cause behind
   most of it: 32 rows / 20 series — numbered specials, movies and OVAs
   with no component, or stale spans like outlaw-star's 1-24). Migration
   `20260826400000_episode_format.sql`. First heal over 19,863 rows: tv
   19,745 · ova 85 · special 10 · movie 4 · recap 1 · null 18 (14 series).
   Overrides (cited): kenshin 95-98 ova (Tsuioku-hen) + 99-100 ova
   (Seisou-hen); SAO 50 movie; clannad 24 ova; after-story 24 recap, 25
   ova; durarara 25 ova; outlaw-star 25-26 tv (a stale span, I33);
   angel-beats 14-16 special. `watch_order_entries.kind`: now derived at
   sync from a RULED_RECORDS ruling or an EXACT air-date join to the
   order-only component (never a title guess — a title match probe hit
   13/37 with wrong hits); the remainder is `watch_order_kind_missing`.
   Captured for the app: `Episode.format` rides the hydrated series
   (stored, unsurfaced until the UI pass). Defects caught by the mechanism
   itself: `FORMAT_OVERRIDES` was last-wins per series (kenshin's second
   entry hid the first — the healer's null count exposed it; merged, the
   same fix as T6 / T26); the first heal wrote row-by-row and timed out at
   ~3k rows (batched by series × format: 32 s). Census otherwise unchanged;
   ruling_violation 0; display 220/0; edges deployed. NEXT: T4.5 the words
   (badge strings, `{noun} only`, `studio original`, retire 'anime only' in
   agent/PROTOCOL text — T3.2/T3.5 land here) → `/consolidate deep` → P36.
59. ✅ **BATCH 18 WAVE 3 + BATCH CLOSE (2026-08-26): the narrow bundles;
   rule `A44` (position-less rows); `afl_anime_canon_unruled` drained.**
   Four bundled Opus agents (~0.82M) over 17 series / 24 rows; six Fable
   verifications (~0.56M) on the weight-bearing rows. Two verifier
   refutations, both in the rules' direction: **kenshin-2023 44** — the
   "named acts" dissolved in context (the 炸裂弾 line answers a question
   about ep 25, a prop redesign; the Rengoku line is block-level 相談), the
   脚本監修 credit is the Kodachi class → FILLER, ep 34's ネーム basis stands
   on its own; **akame** — the verdict's "no source" negative was FALSE:
   the director states the anime ending was Takahiro's own outline, him on
   site, and that the manga later changed it → 23-24 filler + RETCONNED
   (the world-trigger shape, never canon + adopted), 22 divergence, 20/21
   mixed + position-less. Finds: **black-clover 55-56** adapt a licensed
   light novel (暴牛の書) → canon + side_source (ep 56's ch-81/82 frame is a
   partial, not a mix — two licensed works are two standings); **86 ep 10**
   adapts LN vol 10 → canon + side_story (the LN IS the source; Asato
   supplied the material and supervised the script); **SAO row 50 is the
   Ordinal Scale MOVIE** → canon + adopted{author} by authorship (structure
   task: no component); **one-piece 453-456** animate Oda's cover-page
   serial → mixed + side_story; girls-last-tour 4 canon (AFL mislabel);
   beastars 44 basis RULED studio; noragami / sgt-frog / vinland / demon-
   slayer / durarara / FMAB / HOTD / shippuden 28 / steins-gate filler with
   their ties. **`A44` ANCHOR_SUPPRESSED** — the one-piece verifier showed
   that retyping the cover-serial rows mixed would silently re-create the
   ep-455 junk anchor Sean deleted in batch 17 (that deletion lived only in
   a history script; AFG prints the cover chapters): a per-episode
   position-less ruling map gated in syncAnchors / applyContinua /
   applyMuFrontier, healed, audited (ruling_violation); entries one-piece
   453-456, gto 27, sailor-moon 167-168, railgun 41, akame 20-21; the
   rearranged-zone class skips A44 rows. `EPISODE_TYPE_OVERRIDES` now
   MERGES per series (the annotation map's last-wins defect existed here
   too — fixed before it bit). Census: afl_anime_canon_unruled 16→1
   (assassination-classroom ep 0 — a format question for T4.4, dropped from
   the batch); asterisk_unreviewed 137→146 (nine series newly annotated);
   frontier_tail_null 7→8 (akame 20-21: mixed rows past the ep-19 anchor,
   position-less by A44 — the honest null render, not a gap to fill);
   rearranged_zone_unanchored 11→11 and _acknowledged 6→5 (the class now
   skips A44 rows before bucketing, so akame 20/21 never enter and
   sailor-moon 167/168 leave the ack bucket); ruling_violation 0; A1 0;
   display 220/0.
   Heal: 11 types, 356 annotation rows, 0 anchors removed (none stood on
   suppressed rows). Edges deployed. BATCH 18 CLOSED: 32 verdicts, ~5.9M
   research + ~2.1M verify; the standing maps ARE the ruling record (no
   apply script); narrow tasks queued in WAVE2/WAVE3-RECOVERY.md (claymore
   frontier, ajin anchors + continues, soul-eater continue, chrono 15-16,
   gto 25-26, railgun 14/25, DBS Resurrection 'F', SAO movie component +
   N7, durarara components, the "row covered by no component" audit
   class). NEXT: T4.4 format (glossary §6 step 6).
58. ✅ **BATCH 18 WAVE 2 — THE A-7 STUDIO-ENDING CLASS: researched, verified,
   ruled, applied; rule `T28` (the materiality bar) and the incorporation
   basis ruled (2026-08-26).** Eight Opus verdicts (~1.37M) + seven Fable
   verifications (~0.83M), all sound. **Not one A-7 ending is adopted by
   credit** — every author is 原作-only (Sukeno, Yagi, Fujisawa, Sakurai,
   Moriyama, Takeuchi); three mangas printed their own endings; Sukeno
   tweeted (2020) that he wants a from-episode-1 REMAKE. But "the ending is
   anime-original" was too coarse in five of eight: **Ajin** 14-22 adapt
   manga ch 23-42 (14 ja-WP 巻話↔第2期N話 pairs verbatim; the batch-12 premise
   was wrong) → 14/15/16 canon, 17/19/22 mixed, only 23-26 the studio
   ending; **Sailor Moon** 167-168 play never-adapted Acts 38/44 → mixed;
   **GTO** 27 adapts the Toroko Oppai side story serialized INSIDE GTO →
   mixed + side_story (never side_source). **Two rulings by Sean (with
   Cursor):** (1) **T28** — `mixed` needs a substantial, story-carrying share
   of the episode's own plot ("what is this episode's job?"); an original
   plot that quotes a fragment is FILLER and the tie is a mandatory
   annotation (graft / partial / loose_parallel with chapters); omake / side
   stories that ARE the plot count; consensus on a block is a strong prior.
   Applied to wave 2 (claymore 24/26, chrono 22, ajin 21/23 → filler + note)
   and as REPAIRS to wave 1 (soul-eater 37/39/40, DBS 91/94/95, FMA
   24/40/41 → filler + note; the Martel / Buu facts are on the rows as
   graft/partial, verified by direct query). Railgun 41 stays mixed (adapts a
   whole special chapter). (2) **The incorporation basis** — `adopted{author}`
   extends to the source's author INCORPORATING the anime material's EVENTS
   into the source line (Railgun: manga ch 32's ep-20 photo; Therestina in
   prison in Souyaku v7; Saten's "I never should have let them go" in the
   2022 novel — all Kamachi's prose) → 15-24 and 42-48 canon + adopted with
   an honest gradient; importing DESIGNS while refusing EVENTS does not
   adopt (Twin Star) and a blanket credit never did (Boruto B). T26's
   statement carries the sharpened basis. **Mechanisms:** annotation
   provenance column `origin` (ruling | research; migration 20260826300000 +
   backfill 310000) — the healer stamps map rows 'ruling' and reconciles
   stale ruling rows of ANY kind (removed: world-trigger 48's divergence,
   ajin's shrunken spread); `STANDING_ANNOTATIONS` now MERGES entries per
   series (last-wins had silently dropped railgun's adopted rows after the
   first heal — caught by a direct post-heal note query, fixed, re-healed);
   PROTOCOL pinned with T28 for wave 3; nine traps captured to
   research-agent.md. Heal: 36 types, 321 annotation rows asserted.
   Census: afl_anime_canon_unruled 16 (unchanged — wave-2 rows were already
   T6-ruled), ruling_violation 0, A1 spike 0, display 220/0. Moved:
   rearranged_zone_unanchored 11→11 after acks (ajin 15/16/17/19 ENTER the
   class — canon/mixed rows adapting ch 23-28 with no anchor: the honest
   anchoring queue for the narrow task; railgun 41 and sailor-moon 167/168
   are zone-acknowledged, no anchor by design; soul-eater 40 LEFT it →
   filler); DBS anchor_gap_research 105→102 (three rows → filler). Edges
   deployed.
   Batch-18 narrow tasks queued: claymore 21-23 frontier (Scene 57/58/59),
   ajin continue (ep-13 22→23; series 29 not 43), soul-eater continue
   (37 vs 40), chrono 15-16 re-look, gto 25-26 SJG race check, railgun ep 25
   / ep 14 knock-ons, DBS Resurrection 'F' side_source. Wave 3 parked.
57. ✅ **BATCH 18 WAVE 1 — RESEARCHED, VERIFIED, RULED, APPLIED (2026-08-26;
   the first batch under the three-standing model).** Seven Opus verdicts
   (~1.13M) on the big `afl_anime_canon_unruled` blocks, six Fable
   verifications (~0.71M; boruto A+B as one brief), Sean's rulings (with
   Cursor), applied as DECLARATIVE records only — T6 types in
   episode-types.ts, T26 annotations in standing-annotations.ts, G53 dates,
   one SOURCE_TYPE_OVERRIDES entry — then `npm run heal` asserted them (64
   types, 267 annotation rows, 5 stale override rows REMOVED, 2 dates).
   Rulings: **boruto** — Kodachi's blanket ストーリー監修 REJECTED as an
   adoption basis (arc-blind: it also covers undisputed filler; verifier
   refuted verdict B's 41 rows on the protocol's own test); adopted{author}
   on a specific author act only — Time Slip 128-136 (Kishimoto's story),
   8-9, 67-69 (repair); 93-95 / 106-111 / 282-286 adapt licensed novels →
   canon + side_source (282-286 moved OFF adopted{community}); 221-281 stay
   canon + adopted{community} with the basis sentence written into the entry
   (community + manga-era story, NOT a staff credit); the rest of 2-105 /
   120-209 → filler. **FMA 2003** — 4 canon / 8 mixed / 15 filler (AFL wrong
   on 12 of 27); 11-12 canon + side_source (Land of Sand novel); Bones'
   finale 42-51 FILLER for manga standing + a cited divergence carrying
   Arakawa's own words ("she asked for a different ending", Asahi 2005) —
   the provenance the type alone cannot hold; ep 37 canon (agrees with 13).
   **Outlaw Star** — ruled a STUDIO ORIGINAL via SOURCE_TYPE_OVERRIDES
   (Sunrise's official page: 原作 矢立肇・伊東岳彦 on the anime, Yatate in the
   manga's index — a co-primary media-mix, sibling by design, distinct from
   the Evangelion class); all 26 story rows canon (incl. AFL's plain filler
   13/14/16/18/19/20 — ep 19 is Ito's script); eps 1-2 keep a divergence
   note, no chapters (A40/G3); two G53 dates (ep 8's typo was a G54 queue
   row). **DBS** — no author adoption (commissioned outline ≠ declaration);
   78/91/94-95 mixed on one standard. **Soul Eater** — 39-40 mixed (ch 40
   opening; ch 44 tail + ch 45 graft), 41-51 filler + divergence (no Ohkubo
   credit), ep 37 canon → mixed. **Beyblade** — all 32 filler; ep 3 repair.
   Census deltas, all explained: afl_anime_canon_unruled 22→16 series
   (wave-1 series drained; the rest are wave-2/3 targets); no_source 37→38
   and ok_loose 10→9 (outlaw-star left the manga instrument); asterisk
   134→137 (FMA, DBS, outlaw-star newly annotated); airdate_regression
   68→67 (outlaw-star ep 8); frontier_tail_null 6→7 and
   rearranged_zone_unanchored 10→11 are BOTH soul-eater 39-40 — mixed rows
   past the ep-38 anchor with chapter data and no anchor: honest, and a
   narrow anchoring question (the verifier notes continue_from_chapter = 37
   from the ep-36 continua pin while the honest continue-read is ch 40 —
   C-family, batch 18 narrow). ruling_violation 0; A1 spike 0; display
   220/0. Mechanism finds: the T26 healer now RECONCILES override kinds
   (the map is their only writer; stale rows removed); context.ts now
   prints EVERY ruling on a series (the A40/G3 gap that let an agent
   propose a mapping Sean had ruled meaningless); validate.ts is the
   landing gate. Edges deployed. Waves 2-3 parked.
56. ✅ **T4.3 — THE STANDING MIGRATION: canon / mixed / filler, relative to
   the source (`T27`; T9 superseded by T26; T14 amended; 2026-08-26).**
   'anime-only-canon' left the canonical vocabulary (migration
   `20260826200000_three_standings.sql`, `episodes_type_check`). AFL's
   `anime_canon` class stays in staging (G51) and is mapped at every write
   by the series' source kind — a new registry field `aflAnimeCanon`
   (original, video_game → canon: the anime IS that source's story; manga /
   novel / VN / other → filler: adheres to no identified source) inside
   `filterEpisodeRows` (all three writers pass the series' source kind; no
   kind → filler, fail closed) — then the T6 rulings win row by row. The
   healer (`assert-overrides.ts`, two new passes) migrated the 977 rows:
   387 original + 131 game → canon; the T6 map's 17 anime-only-canon
   entries rewritten (shippuden 452-457, kenshin-2023 34, black-clover
   130-157's 21, boruto 221-286, beastars 44 → canon; kenshin-2023 44 and
   the A-7 endings → filler); the override facts landed as annotations from
   the new rulings map `lib/rulings/standing-annotations.ts` (190 rows /
   13 series: adopted{author} black-clover + kenshin 34, adopted{community,
   PROVISIONAL} boruto, adopted{studio, PROVISIONAL} beastars 44,
   side_source shippuden, retconned world-trigger 49-63, divergence on the
   A-7 class — claymore, gto, ajin, chrono, sailor-moon, railgun,
   world-trigger 48, twin-star 21-50 — all on the asterisk review list).
   Display: `Episode.offSource` (from adopted / side_source annotations,
   now loaded by the app's hydration and the verifier) keeps the honest
   dash and no interpolated position on those rows (T14 restated); every
   series pads `canon` (a studio original is its own source). Census
   class `afl_anime_canon_unruled` = the batch-18 review queue, derived
   from staging: 24 series / 257 rows (boruto 119, beyblade-metal-fusion
   32, FMA 2003 27, DBS 15, outlaw-star 13, soul-eater 13, one-piece 9 …).
   A1 SPIKE CHECK: `anchor_on_noncanon_row` 0 after the flip;
   ruling_violation 0; display 220/0 (the verifier and the rearranged-zone
   class learned that an off-source canon row is not a hole — 4 series /
   2 rows had tripped them). Every other class unchanged (asterisk queue
   134: the 13 series were already pending). Edges rebuilt + deployed.
   Open for Sean (T4-GLOSSARY §7): the two PROVISIONAL bases; kenshin-2023
   44; clannad 24 / clannad-after-story 23 (VN routes AFL calls anime-canon
   — filler in the queue, likely canon). FOLLOW-UP same day (Sean + Cursor
   concur): the VN default stays filler (Steins;Gate 25 = AFL 'anime canon'
   = the original OVA; Ace Attorney is the no-manga whole-show case) and the
   Clannad rows are three CITED T6 rulings — clannad 24 (Tomoyo route) and
   after-story 25 (Kyou route) canon, after-story 23 (anime-original extra)
   filler; the two inferred bases are marked ruledBy session + retiresWhen
   so they never read as signed; the public-API eventuality is parked in
   architecture.md (versioned view of canonical, staging never served,
   provenance kept; episodes.type provenance column = a later pass). Queue
   now 22 series / 254 rows. NEXT: batch-18 review of the big unruled blocks
   BEFORE T4.4 format (glossary §6 step 5).
55. ✅ **T4.2 — OVERRIDES ARE ANNOTATIONS, NEVER A FOURTH TYPE (`T26`;
   R10 / A43 extended; 2026-08-26).** Sean's T4.0 D-10 built: three kinds
   join the closed annotation vocabulary — `adopted` (REQUIRED `basis`
   author | studio | community: Black Clover = author-supervised, EoE =
   studio, X's only-ending = community), `retconned` (world-trigger
   49-63), `side_source` (Shippuden 452-457 → the Itachi Shinden novel; the
   work is named in note). The vocabulary now lives in ONE place,
   `lib/annotations.ts` (`ANNOTATION_KINDS`, `ADOPTED_BASES`,
   `annotationProblem`), written only through `upsertAnnotation` (the AFG
   graft writer in lib/anchors.ts routed through it; the T4.3 migration
   will use it); migration `20260826100000_annotation_kinds.sql` adds the
   `basis` column and mirrors the shape rules as constraints (adopted ⇔
   basis; side_source ⇒ note). Census class `annotation_invalid` (0) keeps
   lib and DB in lockstep. 5 unit tests. Edges rebuilt + deployed; types
   regenerated. Census otherwise unchanged (2,270 standing annotations all
   valid). Nothing retyped yet — the standing migration is T4.3. One-hop
   case 20. NEXT: T4.3 the standing migration (§3 of the glossary) with
   the A1 spike check and `afl_anime_canon_unruled`.
54. ✅ **T4.1 — SOURCE IS SERIES IDENTITY: THE SOURCE_KINDS REGISTRY (`T25`,
   2026-08-26; supersedes T20, amends T22).** Sean's T4.0 D-9 built: one
   declarative registry (`lib/rulings/source-kinds.ts` — value = AniList's
   word lower-cased, noun, unit chapter/volume/none, tailBadge, anilistSources,
   countries) and ONE derivation, `deriveSourceKind` = AniList `source` × the
   picked manga NODE's countryOfOrigin × `SOURCE_TYPE_OVERRIDES`, called by
   resolve.ts, chain.ts#aggregate (the DRIFT-LIST §C copy unified — no value
   invented outside the registry), the healer and the census. FAIL CLOSED:
   unregistered → `source_type` NULL + flag `source_kind_unknown`;
   `series_without_source_kind` = 0. The anime's countryOfOrigin is always
   JP, so KR/CN could never derive — T4.1 added `countryOfOrigin` to the
   relation node in the AniList query and `anilist-restage.ts` (event
   healer, G44 analogue: 664 media refetched, 661 restaged). Migration
   `20260826000000_source_kinds.sql`: source_type nullable, no default,
   check = registry values; manga_status 'anime_only' → 'none'. Healer
   `heal-source-kinds.ts` (standard roster) moved 17 rows: 9 → visual_novel,
   4 → video_game, 3 → other (the ruled 16) + the-god-of-high-school manga →
   manhwa (node country KR). hasSource ≠ hasInstrument split shipped in
   assemble.ts / MappingSummary and the three display sites; spans pad canon
   on hasSource, every manga position on hasInstrument. Census delta, all
   explained: no_source 88→37 (= the 37 studio originals exactly);
   no_instrument 0→16 (VN / game / other — hasSource, no units: honest dash);
   the other 35 are the LIGHT-NOVEL class (SAO, Re:Zero, Overlord, Konosuba,
   86, DanMachi, Toradora, Haruhi, Durarara…) plus a few link-less manga
   series: their manga_status was 'anime_only' because pickManga only links
   MANGA-format adaptations, and the old hasSource read manga_status — so a
   novel-sourced series rendered exactly like a studio original ("no
   source"). hasSource now derives from the KIND alone, so they render as
   PENDING on the source side (the honest state: the novel-side publication
   link and totals are the T24 volume-instrument build): pending_finished_
   no_totals 1→33, pending_no_canon 1→2, ok_no_volume 12→14 (+
   anchor_gap_research 9→10, frontier_tail_null 5→6 — the same series in
   overlapping classes). Not a regression: display 220/0; ruling_violation 0
   (stored source_type = derivation for all 343).
   Ruling candidates for Sean recorded in T4-GLOSSARY §7 (solo-leveling /
   TBATE → manhwa?; GitS Arise AA → original?). NEXT: T4.2 annotation kinds.
53. ✅ **A-11 EXECUTED AS `G54` — AIR-DATE ORDER GATE (2026-08-26, /add-rule
   exercise 2; the skill is now PROVEN, T3.1 closed).** Sean's ruling (the
   A-11 proposal: 365-day threshold, NULL-not-store) built as ONE lib
   mechanism, `lib/airdate-order.ts#airdateOrderWalk`, consumed by the
   write gate (`filterEpisodeRows`, so every AFL/wiki writer and all four
   edges), the standing-row healer (`assert-overrides.ts`, third pass) and
   the census. The walk runs to a FIXED POINT; an outlier must disagree
   with BOTH its neighbours (a predecessor spike with the run resuming →
   the predecessor goes; a lone early date with nothing continuing from it
   → it goes); when neither side can be named — a whole block changes era
   (rurouni-kenshin-2023 25-27 wear 1996 titles AND dates; beyblade-x
   41-44 are 2001 Beyblade rows: wiki-backfill contamination, batch 18) or
   JP/US dates alternate (dragon-ball-z-kai 101-104) — nothing is withheld
   and the row is reported (R1 decides). Ep-0 rows are outside the walk
   (N7). Ruled deviations: `AIRDATE_ORDER_ACK` (haruhi 'all' — 2006
   broadcast order; cowboy-bebop 2/7/18 — TX first-run sessions; bebop 24
   deliberately NOT acked: session 23's 1999-09-03 is the suspect). Outcome
   classes: `airdate_regression` (68 rows / 46 series — the batch-18
   queue; 6 sit at 351-359 d, yearly typos just under Sean's threshold)
   and `airdate_withheld` (stored NULL where AFL staging holds a date —
   derived from staging, G51, so ruling it needs no re-scrape). Heal: 10
   dates withheld (gto 31 = 2014 between two May-2000 rows; black-butler
   31; fruits-basket 8; michiko 6; devil-part-timer 9; dbz-kai 106/108/
   111/113/165 — Toonami dates in a JP run), each now a G53 candidate;
   write-side flag kind `airdate_withheld`. 12 unit tests on the ruling
   shapes (vitest now includes `scripts/ingest/lib/**/*.test.ts`). Census
   delta, all explained: airdate_incomplete 22→28 (+6 series, the 10
   withheld), airdate_regression 0→68 (91 raw regressions − 9 acked − 10
   withheld − 4 ep-0), airdate_withheld 0→10, ruling_violation 0, every
   other class unchanged; display 220/0. Edges rebuilt + deployed TWICE
   (the healer's first pass exposed the fixed-point need — a lib change
   is a redeploy, every time, P3). Side find: `npm run system:census` had
   been wired to only 3 of the 7 checks (ledger/unpaged/one-hop) while
   `system-census.ts` carried all 7 — package.json repointed (P33). One-hop
   case 18 added. NEXT: T4.1 SOURCE_KINDS (T4-GLOSSARY.md §6 step 2).
52. ✅ **CLOSING DEEP CONSOLIDATION (2026-08-25) — batch 17's cycle sealed.**
   Writer sweep: 5 new scripts since the last sweep, all principled (2
   declared migrations, 2 healers — assert-type-overrides + afg-restage —
   and lib/c3.ts, the shared predicate). Edges current. The deep pass's
   REAL find: the §12.48 restage had populated parsed continua for ~60
   pages that never had them staged; this pass's sweep was the first to
   consume them — 60 new afg-continua frontier pins through the full gate
   stack (4 withheld, 20 kept-curated cross-checks). Triage of the fallout:
   (1) polar-opposites got a WRONG-EPISODE pin (continua endEpisode → our
   ep 11 while AFG's own chart says ep 12) that overwrote chart data —
   CONTINUA_SUPPRESSED entry added (Claymore precedent), chart self-heals
   on the next refresh; gate candidate for the restructuring phase: the
   continua episode conversion should cross-check the page's own chart
   rows. (2) project-arms ep-52 mu pin re-derived onto the new last
   episode — gate-legal (episode-space knowledge, duplicates the honest
   205), heals via D1 if eps 51-52 ever retype; left standing, flagged.
   Notes revalidated (suppressions ×3 valid, EXTRAS_ADOPTED ×2 valid,
   regimes all verdict-documented). Stale cleanup: nothing dead found —
   the batch's apply scripts and verdicts stay as records by design; 358
   open flags are Sean's review queue (68 batch-17 bookmarks carry the
   resolutions inline). PERMANENCE-TIER CANDIDATES now 15 (chunk-2 adds
   d-gray-man, arms-alchemy, blade-ona, cobra, emma, dsq, fotbs, x, tmm) —
   lock mechanism lands with the restructuring phase. Census: every rule
   class 0, display 220/0 (ok_full 234→231 is a class shuffle from
   null-volume continua pins on 3 series — boundaries write absent-only,
   volumes-staleness events queue the backfill). CYCLE POSITION: batch 17
   fully closed; THE RESTRUCTURING PHASE IS NEXT.
51. ✅ **BATCH 17 COMPLETE (2026-08-25) — final wave verified, ruled,
   applied; the gap-tier batch closes end-to-end.** Final three (rayearth /
   fist-of-the-blue-sky / cobra) each verifier-checked; the rayearth
   verifier REFUTED the verdict's 14-chapter conclusion (Nakayoshi
   serialization record + date math + MU + pt-br MangaDex = 15; the
   storefront's "5b…14" labels are a re-cut artifact) — Sean ruled 15:
   curated ep-20 anchor END 15 OVERRIDES the verdict's 14 (the apply loop
   now processes curated anchors FIRST so the curated map wins duplicate
   episodes), boundaries seeded v1 1-5/v2 6-10/v3 11-15, total 15 stands,
   ep-49 deletion proceeds on the scope leg alone. Cobra: story-count
   mechanism confirmed (MU "chapters" = fr-WP's 28 Histoires), ep-31 repair
   14→76 applied, ep-2 elimination STRENGTHENED by independent French
   corroboration, reorder regime added. FotBS: MU pin confirmed 3-legged
   and promoted manual; the mislabeled "DVD episodes" component (really
   withheld TV eps 16-18/21) demoted to order-only. New agent traps:
   MangaDex web-UI language filter (check the API feed, never the filtered
   page) + digital-storefront re-cut numbering class. Census: all rule
   classes 0, display 220/0, gap 12→9, mu_pin_unverified 30; the +1
   frontier_tail_null is rayearth's D2 tail rendering honestly (annotated;
   specimen #3).
   **BATCH 17 TOTALS**: 26 gap/tail targets + 12 narrow/re-research tasks +
   16 verifier passes; ~5.1M research + ~1.1M verify Opus/Fable tokens;
   ~1,100 anchors landed, 88 retypes, 3 chapter-space migrations, 4 phantom
   entities removed, 5 volume tables recovered, 12 open flags resolved,
   A1 class closed with writer gates at MU + AFG, C3 healed catalog-wide.
   NEXT: the RESTRUCTURING PHASE (system-evolution.md scope + taxonomy v2)
   before batch 18.
50. ✅ **CHUNK 2 WAVE 1 VERIFIED + RULED + APPLIED (2026-08-25)**. 7 verdicts,
   7/7 formal verify (Sean-requested, ~424k; §recovery-17): zero value-level
   refutations; the DC Jp/Int column-label inversion caught and captured as
   an agent trap before it could poison a re-derive. Sean's rulings: x ep-20
   → 94/v18; tmm total 33→27 + bonus-story annotation; emma 19-23 mixed
   (span corrected 38-46); **X 21-24 AND dsq 44-45 both re-ruled FILLER**
   with rich annotations — the "only ending" (X, asterisked) and "caught up,
   padded out" (DSQ) classes, distinct from the Evangelion contested-ending
   class and the Madoka true-anime-original class; the full taxonomy-v2
   reference (incl. possible tag rename + first-class canon-source typing
   for LN/other roots) lives in system-evolution.md for the restructuring
   phase. arms finale 83 + ep-18 stays 61 with the 63-64 touch annotated.
   APPLIED: 329 anchors (dc 132 lattice under a new reorder regime + dsq
   regime), 17 boundary rows seeded (emma 7 full, arms 10 full, blade
   v31→v30 leak fix), dsq ep-45 MU deletion (self-contradictory record),
   tmm ep-52 repair, 11 retypes; assert-type-overrides asserted 6 standing
   rows (X 21-24, dsq 44-45); parity healer stamped 80 more C3 skip-notes
   (dc's back-jump lattice). Census: all rule classes 0, display 220/0,
   gap 19→12, mu_pin_unverified 39→33. REMAINING: final wave — fist-of-
   the-blue-sky, magic-knight-rayearth, space-adventure-cobra — then batch
   17 research is COMPLETE and the restructuring phase begins.
48. ✅ **AFG TITLE-MARKER CLEANUP (2026-08-25, Sean's eyeshield report)**.
   99 stored episode titles across 5 series (eyeshield 43, twin-star 38,
   world-trigger 16, kakegurui 1, tougen-anki 1) carried AFG's "* Filler"
   table annotation verbatim — the import took AFG's title cells raw (while,
   ironically, never mapping the filler flag itself — the same defect behind
   eyeshield's 19 wrong canon typings, §12.47). Fixed at the rule tier:
   (1) lib/afg.ts strips the marker at parse (all four edges redeployed);
   (2) NEW TOOL afg-restage.ts — the consolidate step-3 "re-parse staging
   from stored raw_html, no refetch" contract is now an actual script; ran
   it: all 266 staged pages brought current with today's parser;
   (3) the 99 stored titles healed (0 remaining); (4) outcome check added
   to ruling_violation (a reappearing marker = writer bypassed the parser
   gate). Census clean.
47. ✅ **CHUNK 1 CLOSED — wave 2 verified, ruled, applied (2026-08-25)**.
   Wave-2 verify pass (4 verifiers + 1 script check, ~297k): eyeshield /
   project-arms / kinnikuman CONFIRMED; saint-seiya PARTIALLY — phantom
   ch 30 proven (en-WP preserved the anime ruby gloss "Batoru") but
   phantom 53 REFUTED and the "+2 from 50" offset corrected to UNIFORM −1
   (true space 109; the verdict's ep114→65 advice would have shipped an
   off-by-one). Sean ruled everything as recommended, eyeshield after a
   per-episode eyeball + a 7-episode contested re-research (ja-WP's 備考
   column found — second independent typing source; eps 109/110 relocation
   hypothesis REFUTED on content; ep 74 canon→mixed surfaced late).
   APPLIED: 406 wave-2 anchors (incl. eyeshield 61 released last, trigun
   ep-9 per the first-time-adaptation precedent, curated C3 continues),
   49 retypes via overrides, project-arms 22-volume boundary rebuild +
   angel-heart v6/v7 split, d-gray-man ep-116 repair + continue-from 208.
   MIGRATIONS (apply-rulings-20260825b): saint-seiya → true 109 space
   (boundaries + all anchors −1 ≥ stored 30; series total 249 is AniList
   count-space, untouched); project-arms phantom "ep 53" (a PS2 game AFL
   absorbed) deleted with COMMUNITY_COUNT_OVERRIDES cap 52 as the durable
   guard, counts 53→52, total_chapters 242; trigun's wrong MU association
   (→ "Trigun Maximum", the flag-#943 root cause) deleted, latest_known
   nulled. Mashle verdict files HELD (stale pre-renumber numbering — a
   re-run resurrected an annotation on nonexistent row 25; cleaned).
   NEW HEALER: assert-type-overrides.ts (the eyeshield ep-74 lesson —
   ruling_violation tripped once, the gap class closed forever; 328 ruled
   rows verified). Census: ALL rule classes 0, display verify 220/0,
   ok_full 234. Chunk-1 final tally: 16/16 research tasks + 3 narrow
   re-research + 9 verifier passes; ~3.2M research + ~0.6M verify tokens.
   REMAINING IN BATCH 17: chunk 2 (detective-conan + 9 lighter). Then the
   pre-18 restructuring phase (scope in system-evolution.md + recovery
   §13-14: skills rework, air-date overrides ~40 rows, hayate row-ingest,
   iruma ep-65, konjikinogash sweep, AFG-expansion typing sweep, AFL
   non-episode-row audit class, permanence locks, D2 registry).
46. ✅ **DEEP CONSOLIDATION post wave-1 + C3 catalog heal (2026-08-25)**.
   Writer sweep: no ungated writers (mashle migration = declared one-time,
   durably guarded by its SOURCE_NUMBERING_SHIFTS entry). Edges current
   (3 deploys this session). C3 rulings session closed every open fork:
   zatch 51/103 anchored per the first-time-adaptation rule (regime-
   annotated, parity continues 100/164), zatch 122 kept mixed, iruma 63
   kept END 142 + parity continue 143 with the skip-145 note (Sean's
   correction of the session's own END=max misread), rosario 12/13
   repairs VERIFIER-CONFIRMED then applied (ch 11 "Blood" proven never
   adapted in S1), ranma 130 stays graft-only.
   **C3 CATALOG HEAL — the deep-rescan find**: the new continue_skip_unnoted
   audit class surfaced 351 continue points catalog-wide sitting below
   chapters their own episode covered, with no skip-on-arrival note. The
   predicate now lives ONCE in lib/c3.ts (healer + audit both consume it —
   the first unpaged healer run stamped only 16 of them and 7 of those
   were wrong (C1 straddles); the audit caught both defects, proving the
   outcome-check pattern on its own author). All 351 healed; healer
   idempotent at 0; class at 0. Also: mashle recap corroborated by
   en-Wikipedia filing it as a SPECIAL (Sean's find, noted in the
   watch-order entry). §10 gains the consolidated POSITION & CONTINUE-READ
   LOGIC unit (A4 + C1/C2/C3 + re-use rule composed, at Sean's direction).
   Census: ruling_violation 0, anchor_on_noncanon_row 0, nonmonotonic 0,
   continue_skip_unnoted 0, rearranged_zone_unanchored 2 (bobobo 3 +
   ranma 130, both ruled). Permanence-tier candidates (finished, researched,
   verified, Sean-ruled this batch): sket-dance, bobobo, rurouni-kenshin,
   hellsing, noragami, rosario-vampire S1 — lock mechanism lands with the
   pre-18 skill rework. NEXT: wave 2 on Sean's go.
45. ✅ **CHUNK 1 WAVE 1 + D4 GATE + A1 CLASS CLOSED (2026-08-25, resumed
   session; full record: CHUNK1-RECOVERY.md §7-§11)**. Wave 1 (8 Opus
   agents, ~1.46M tokens) landed 15 verdict files; a 4-verifier cross-model
   pass (Fable over Opus, ~207k) confirmed 3 claims and PARTIALLY confirmed
   ranma — catching that the recommended aired-number re-anchor would have
   corrupted eps 15-30/153 (the amended rule: never index-join any chart;
   join on TITLE). Three follow-up narrow agents (zatch contested re-research
   under the new overlap rule, ranma title-keyed re-anchor, batch-12
   as-stored spot-check) landed same-day and were curated in.
   APPLIED: 1466 anchors (fotns 42, sket 75, zatch 105+3, bobobo 74,
   rurouni T&B 4, ranma 27 title-keyed, hellsing 7, gintama holes 3,
   noragami curated terminal, +first-pass re-asserts), 44 A1 junk-anchor
   deletions + 4 annotation deletions, 100 retypes (all via
   EPISODE_TYPE_OVERRIDES), 9 curated repairs, 8 boundary seeds.
   **D4 RULED + BUILT (Sean): the A1 gate extends to the AFG writers** —
   syncAnchors drops chart anchors on noncanon rows (allow-list canon/mixed,
   unknown fails closed, row-less passes), applyContinua refuses the
   frontier pin on a noncanon row ('refused_episode_type', continue-from
   still applies as reading guidance); evidence: 49/49 audit hits
   adjudicated 45 junk / 4 mistyped, with AFG's chapter column PROVEN a
   reading-position conversion (its own duplicate values plateau across
   one-piece filler runs). All four edges redeployed (×3 as lib evolved).
   **anchor_on_noncanon_row 49 → 0**; ruling_violation 0;
   anchor_nonmonotonic 0 (sket/zatch/ranma reorder regimes ruled);
   verify-series-display 219/0.
   **NEW RULES (Sean 2026-08-25, all in §10)**: episode-type semantics
   (anime-only-canon = consensus-canon; filler = zero canon; mixed = both;
   AFL/AFG advisory only) · chapter overlap never proves filler (the
   zatch-bell lesson — 10 contested eps re-researched into 5 filler / 5
   mixed via konjikinogash.fandom) · in-between entries live at FRACTIONAL
   watch-order positions, never absorbed as integer rows (the mashle
   ruling: recap → watch_order_entries 6.5/excluded_recap, rows 8-25
   renumbered 7-24 via apply-rulings-20260825-mashle.ts, AFG anchors became
   correct IN PLACE, SOURCE_NUMBERING_SHIFTS gained per-SOURCE spaces —
   'afl'-only for mashle since AFG/fandom/Wikipedia already exclude the
   recap; every filterEpisodeRows/translateEpisodeNumber caller now states
   its space).
   Batch-12 as-stored sweep: railgun ep 14 was confirmation-laundering
   (verifier found the smoking gun in apply-research-batch-12.ts line 110
   "as-stored"); 6 of 7 remaining confirmed, rosario ep 11 repaired 9→8/v2
   (wiki off-by-one from ep 11 — new trap); rosario eps 12/13 medium-
   confidence repairs HELD for Sean. esbuild reinstalled as a direct dev
   dependency (the Vite-8/Rolldown modernization had silently broken
   build-functions.ts).
   OPEN FOR SEAN: iruma ep-63 END convention (142 stored vs 145 = max
   adapted); rosario 12/13 held repairs; zatch withheld anchors (51 backfill,
   103 reorder hole, 122 sliver); ranma ep-130 ch-58 re-use (graft only);
   air-date metadata backlog (fotns ×6, ranma ep 153, railgun ep 14 — small,
   mechanical). NEXT: wave 2 (8 gap series: kinnikuman, eyeshield-21,
   saint-seiya, project-arms, d-gray-man, angel-heart, hayate, trigun) on
   Sean's go, then chunk 2, then the §12.39 roadmap + system-evolution
   skill rework before batch 18.
44. ⏸️ **CHUNK 1 INTERRUPTED — monthly spend limit (2026-08-24; RESUME
   MARKER, full record: `scripts/ingest/research/batch17/CHUNK1-RECOVERY.md`)**.
   The batch-17 second pass was split into two weight-balanced chunks for
   usage control (§12.43 note); chunk 1 launched 19 agents and a monthly
   model spend limit killed 17 mid-flight. **Nothing is half-applied**: no
   apply script ran, DB verified unchanged (7085 anchors / 66 MU pins =
   the post-D1 state), repo clean through 07ed513.
   SURVIVED (6 verdict files, committed): hellsing (7 anchors + 2 type
   corrections + 3 continues), gintama's last 3 reorder holes (eps 111 →
   L172, 120 → L187 — both were MISSED SECOND INFOBOXES on two-part
   episodes, a trap that generalizes — and 227 → 360 v41, the Sket Dance
   crossover special), and 5 A1 verdicts (hxh 2/18, cardcaptor 7,
   inuyasha 79, slam-dunk 92). The four A1 files came from an agent that
   died before its closing self-check — give them extra review before
   curating.
   **EARLY D4 SIGNAL: 5 of 5 adjudicated A1 hits are JUNK ANCHORS, zero
   mistyped rows** — including cardcaptor ep 7, the case D4 had singled
   out as most likely mistyped. If the remaining 43 hold this ratio the
   answer leans toward gating the AFG writers; do not decide on 5 of 49.
   Counter-signal already visible: the one-piece agent found several
   filler-typed rows DO carry sliver adaptations (expect `mixed` there).
   TO REDO (16 tasks): 12 gap series (kinnikuman, eyeshield-21,
   zatch-bell, bobobo, sket-dance, saint-seiya, project-arms, d-gray-man,
   angel-heart, fist-of-the-north-star + its A1 ep-109 item, hayate,
   trigun), 3 A1-triage tasks (43 hits), rurouni 95-98 + eps 63-70.
   The recovery file carries the paid-for source traps and leads (the
   eyeshield-21 numbering-shift parse trap, saint-seiya's arc-not-filler
   row colors, project-arms' Kinokuniya TOC, the near-finished rurouni and
   fist-of-north-star skeletons) — read it before relaunching, and use a
   smaller concurrent fleet so one limit event can't cost 17 agents.
43. ✅ **D1 RULED + BUILT: the MU franchise-conflation gates (2026-08-24,
   post-compact — Sean: "lets follow your recommendation for D1 and build
   the gate")**. Three writer gates in applyMuFrontier (sibling-scope
   ceiling as a scope FILTER, scope-consumed refusal, A1 episode-type
   refusal — full §10 rows), the MU_FRONTIER_SUPPRESSED declarative record
   (prisma-illya until D2), and the anchor_on_noncanon_row audit class
   (A1 outcome verification, any source). Catalog healing run: mu pins
   80→66 — 11 standing A1 violations removed (ajin, beelzebub, claymore,
   gto, hellsing, kinnikuman, rosario, shugo-chara, slam-dunk, trigun,
   zatch-bell), dragon-ball ep153 consumed-refused (afg ep148→194 IS the
   honest terminal), elfen-lied's stale pin dropped by the pre-existing
   redundancy rule (manual ep13→71 covers it), gantz/toriko/prisma
   re-poisoning BLOCKED (all three were live risks: MU's text still holds
   the bad pairs and the cron would have rewritten them). TPN ep23
   (divergent anime-only ending) + chrono ep24 prevented as bonus catches.
   INCIDENT fixed en route: batch-17 repairs updated derivation-tier rows
   in place — hikaru ep75's 166→148 repair was WIPED by the first gated
   pass (mu rows are delete-and-re-derive by contract); restored at manual
   ch148/v17, mashle ep24 re-sourced afg-continua→manual, repair pass now
   flips derivation sources to manual (§10 "repairs live at the manual
   tier"), the other 14 repair rows verified already-manual. Census after:
   ruling_violation 0, anchor_beyond_display_total 0, boundaries_degenerate
   0, mu_pin_unverified 47→44 (3 gap-tier series lost their sole pin —
   honest pending, all in the batch-17 RESUME list), frontier_tail_null
   3→4 (claymore eps 21-23 surfaced from behind its removed anime-only
   pin → research target; prisma's 29-ep tail = the D2 state), ok_full
   235→234 (claymore), anchor_on_noncanon_row NEW at 49 (the A1 review
   queue → D4). Parity healer propagated 2 continue kinds to post_series
   (ajin ep13, gto ep41 — their trailing runs are anime-only). All four
   edges deployed; tsc + build green. NEW FOR SEAN: **D4** — extend the
   A1 type gate to the AFG writers? (would delete ~40 chart anchors on
   filler rows and thin interpolation on one-piece/dbz/ranma until
   research replaces them; audit class holds the line meanwhile).
   VERIFY-POOL DELTA 220→217, 0 failing: hellsing, trigun, zatch-bell each
   held ONLY the refused pin and left the anchor-bearing pool —
   **hellsing + trigun are NEWLY EXPOSED research targets** (their bad
   pins had masked them from anchor_gap_research all along; both diverge
   heavily from their manga, hence the filler-typed run-ends). Add both to
   the batch-17 second pass alongside the 21-series RESUME list.
   **A1-TRIAGE LANE (Sean 2026-08-24: the 49 must not wait for luck)** —
   the anchor_on_noncanon_row hits sit on 15 series, and only
   fist-of-the-north-star overlaps any existing queue: the gap/tail/mu-pin
   queues select for MISSING data, so well-anchored series (one-piece 19,
   dbz 7, ranma 6, black-clover, fairy-tail, inuyasha, hxh-1999, dbz-kai,
   cardcaptor, slam-dunk, noragami, mashle, railgun, TPN) would never
   surface. They join the batch-17 second pass as a SEPARATE LIGHTWEIGHT
   lane — per-EPISODE triage ("is the row really filler, or is the anchor
   junk?"; filler lists + content sources, 2+ citations), NOT full-series
   mapping. Outcomes use the existing machinery: retype via
   EPISODE_TYPE_OVERRIDES or delete via the curated map; TPN ep23's
   afg-continua row is the known ajin-class continue-value-as-anchor.
   The census class is the live work-list (re-derives every audit run);
   its triage verdict distribution DECIDES D4 (afg hits mostly junk →
   gate the AFG writers; mostly mistyped rows → audit-only stands).
   **SECOND PASS RUNS AS TWO CHUNKS (Sean 2026-08-24, usage control)** —
   balanced by research WEIGHT (unanchored-ep load), not series count,
   because detective-conan alone is ~1/3 of the pass; chunk 1 is the
   slightly heavier half so its cost upper-bounds chunk 2's. Each chunk
   ends apply-17 (idempotent) → parity healer → verify → census →
   committed save point, so the boundary is a safe indefinite stop.
   CHUNK 1 (~55%): kinnikuman, eyeshield-21, zatch-bell, bobobo,
   sket-dance, saint-seiya, project-arms, d-gray-man, angel-heart,
   fist-of-the-north-star, hayate, hellsing, trigun + ALL narrow lanes
   (A1-triage 49 → decides D4; rurouni 95-98; gintama 111/120/227).
   CHUNK 2 (~45%): detective-conan (split across ~2 agents by era),
   detective-school-q, tokyo-mew-mew, space-adventure-cobra,
   magic-knight-rayearth, fist-of-the-blue-sky, arms-alchemy,
   blade-of-the-immortal-ona, emma-a-victorian-romance, x + the
   batch-17 completion record.
42. 📍 **BATCH 17 — GAP TIER, PARTIALLY APPLIED (2026-08-24; RESUME MARKER)**.
   Roadmap item (2). Targets: the anchor_gap_research class (46) + the
   frontier_tail_null class (7) = 53 series, research/batch17/
   (PROTOCOL.md = batch-14 checkpoint-density lineage carrying the
   2026-08-24 rulings; context.ts = the TARGETS table; out/*.json = the
   cited record). **32 of 53 researched and APPLIED; 21 series still need
   research** (see the RESUME list below) — apply-research-batch-17.ts is
   re-runnable, so the rest slot in as a second pass.
   APPLIED: 1114 anchors, 261 continue points, 310 annotations, 73 type
   corrections (7 new EPISODE_TYPE_OVERRIDES entries: chrono-crusade,
   kenichi 51, rave-master 41, kenshin-2023 34/44, sailor-moon 167-172,
   twin-star 20 + 21-50, world-trigger 48 + 49-63), 6 curated repairs,
   4 anchor DELETIONS, 6 boundary seeds, 8 curated zone acknowledgements.
   Classes: anchor_gap_research 46→26, frontier_tail_null 7→3,
   mu_pin_unverified 65→47, rearranged_zone_unanchored 0, ok_full 235,
   ruling_violation 0, verify 220/220 0 failing.
   NEW APPLY-SCRIPT CAPABILITIES (batch-16 lineage + these):
   anchor DELETIONS via a curated map (the curated decision drives them,
   NOT the agent's field shape — Toriko proposed 263→253 but the row is
   filler, so A1 answers with removal); BOUNDARY_SEEDS (research-tier
   volume rows); REORDER_REGIMES (documented out-of-order series derive
   their per-episode `rearranged` annotations from the anchors that
   ACTUALLY jump — never a blanket claim over a season; it also exposed
   the shape trap that agents write regime spans as `episodes: [3, 201]`
   meaning 3 THROUGH 201 while the contract is a LIST); CURATED_ZONE_ACK.
   THREE RULE FIXES this batch forced, all in §10: monotonic volume-start
   boundaries (+ heal-volume-boundaries.ts, boundaries_degenerate audit
   class — 29 rows healed across 11 manga), exact-records-outrank-
   derivation (MangaMapping.start), and the AoT-87 extension.
   OPEN FOR SEAN (→ RULED same day, built as §12.43 / §10 D1 gates): the
   MU FRANCHISE-CONFLATION pattern — 5 cases where a MU
   coverage pin wrote a LATER entry's endpoint onto a scoped entry
   (ace-ii ep52 = Season 2's ch 259; yowamushi ep38 = the season-5
   franchise end 544 on an S1-only entry; gantz ep26 = the Gantz:O movie;
   toriko ep147 = a volume past the frontier; prisma-illya ep42 = a
   different manga entirely) — recommend a scope-aware gate in
   applyMuFrontier; plus prisma-illya's Clear-Card-style split
   recommendation and 30 informational bookmarks
   (research/batch17/DECISIONS-FOR-SEAN.md).
   RESUME — 21 series still to research (regenerate contexts with
   `npx tsx --env-file=.env.ingest scripts/ingest/research/batch17/context.ts <outdir>`,
   then one agent per series against batch17/PROTOCOL.md, writing
   out/<id>.json; `ls batch17/out/` vs context.ts TARGETS is the live
   diff): angel-heart, arms-alchemy, blade-of-the-immortal-ona,
   bobobo-bo-bo-bobo, d-gray-man, detective-conan, detective-school-q,
   emma-a-victorian-romance, eyeshield-21, fist-of-the-blue-sky,
   fist-of-the-north-star, hayate-the-combat-butler, kinnikuman,
   magic-knight-rayearth, project-arms, saint-seiya-knights-of-the-zodiac,
   sket-dance, space-adventure-cobra, tokyo-mew-mew, x, zatch-bell.
   Also open: 3 gintama reorder holes (eps 111, 120, 227) — its regime is
   heavy enough that three episodes still lack exact records.
41. ✅ **Consolidation pass (2026-08-24, post-batch-16 + count-space rule)**:
   Sean's Tokyo Ghoul 144/143 report became a catalog-wide rule (§10
   count-space vs number-space): applyMuFrontier converts band-crossing
   pins at the writer; audit class anchor_beyond_display_total guards
   END/START/CONTINUE outcome-side (in the consolidate skill's triage
   roster); healed tokyo-ghoul 144→143, fire-force 305→304,
   prisma-illya 14→13 — the only 3 in the catalog. Berserk 94-vs-87
   clarified as CORRECT segment-vs-coverage data (display treatment =
   the parked segment-model pass). D1 RULED (Sean): kamisama-kiss ep10
   END 25→50 / v9 (ja-wiki segment order; goukon = ch 50); anchor note
   carries the ruling. Pass results: writer sweep clean (no new
   ungated writers; batch-16 apply = research tier), all four edges
   rebuilt+redeployed, healers idempotent-clean (continua 0 new,
   coverage 3 known research cases, 0 dup flags, parity fully
   stamped), census ZERO delta vs batch-16 end state (ruling_violation
   0, beyond_display_total 0, ok_full 235), tsc + build green. NEXT =
   roadmap (2): gap tier 46.
21. ✅ **Consolidation pass 2 (2026-08-23, post-Kenshin)**: every write path
   swept against the day's rules — filterEpisodeRows (caps + type
   overrides) now in ALL five episode writers (resolve, stitched-guard,
   stitch, expansion, extend); all three latest_known writers on
   bestLatestKnown; anchor writers gated (AFG + MU chapter-space); all four
   edge functions rebuilt + redeployed. New `ruling_violation` audit class
   verifies every ruling OUTCOME-side in the DB — a future writer that
   forgets a shared gate surfaces as data, whichever code path misbehaved.
   Shared-id coherence verified: 0 orphaned child rows, 329/329 registry
   coverage, source_map dangling-actives = the documented AFL-sparse/
   Wayback backlog (not breakage). Frontend: catalog hard-wired to
   supabaseSource (no mock fallback); mock data only behind the deferred
   library phase; card-hydration rule enforced (the only two episode-level
   consumers, AnimeCard + AnimeDetail, both hydrate). Census:
   221 ok_full / 15 ok_no_volume / 2 loose / ruling_violation 0 /
   anchor integrity classes 0.
20. ✅ Consolidation pass (2026-08-24 end, Sean's reflection point): all
   mechanisms aligned to the session's rulings — episode-floor invariant in
   every totals writer (edges redeployed), MU targeting universal with the
   daily cron, shared rule logic exclusively in lib/ (chain, mu-frontier,
   anchors, resolve), stale class-A/B/C code and comments removed, the
   freshness map (§11 top) documents pull → fresh → canonical per source.
   Movies-count-only-when-numbered ruling recorded (Initial D ep 40 vs
   Kizu order-only components).
21. **Remaining triage** (all understood, none urgent): LN-instrument ruling
   (item 16) · segment-model rulings (handoff pointers, universe-view bar —
   sketch above, Sean's go needed) · 3
   unknown-coverage research cases (x, sgt-frog, outlaw-star) · genuinely
   page-less manga on Wikipedia (Zom 100, Gachiakuta, Nagatoro, MF Ghost…
   — permanent unless an alternative volume source lands; same keep-open vs
   dismiss-as-documented ruling as the ~30 AFL-sparse gap flags) ·
   exceed-totals gate scope fix + volumes rerun · ~29 MU-unbridgeable
   manga · corruption-era match_ambiguous review · ruled-split anchor
   routing · excel-saga (AFL types everything filler — parody edge case) ·
   footer credits (AFL+AFG+MU) at the design return.

### Coverage-segment model (designed with Sean 2026-08-24 — NOT built; do not act without his go)

Sean's D-Frag/Berserk tail questions converge on one model: **an entry's
manga coverage is a SEGMENT [start, end] of the manga**, and the tail
question is "what lies beyond my segment, and does another entry claim it?"

1. **Denominator rule gap (D-Frag class)**: the card's display denominator is
   `total_chapters ?? latest_known_chapters`, but buildMapping's manga-ahead
   tail only accepts `total_chapters` — null while a manga publishes — so
   every anchored series with a publishing manga (D-Frag: ep 12 → ch 36 of
   MU's 182) shows NO tail while displaying "of 182". Fix when ruled: tail
   denominator falls back to latest_known, labeled "ahead as of the latest
   published chapter".
2. **Claimed continuation → handoff, not tail**: when another entry's segment
   on the SAME manga starts at this entry's end+1 (Naruto→Shippuden,
   Bleach→TYBW, and — the data surprise — Berserk 1997 ends ch 94, Berserk
   2016 starts ch 95), the honest display is a "continues in X" pointer.
   Fully derivable: shared manga_anilist_id + adjacent scope boundaries.
3. **Unclaimed range → universe tail**: manga beyond the LAST segment of the
   family (Berserk ch 250–386 after 2016; D-Frag ch 37–182) belongs as a
   tail on the final covering entry.
4. **Two bar modes (Sean's toggle idea)**: *entry view* (today: bar spans the
   entry's scope) and *universe view* (bar spans the whole manga — this
   entry's segment lit, sibling segments ghosted+labeled, unclaimed ranges
   manga-only). Universe view = the franchise-IA visualization; ALL data
   already exists (series_scopes = segments, shared manga_anilist_id = the
   family, latest_known/totals = frontier). The episode-table visibility
   toggle already exists; the bar needs the same duality.

Sean's framing to preserve: Naruto's tail is wrong to show because Shippuden
*closes it continuously*; Berserk feels different because studios/eras split
the coverage — but the segment map expresses both without special cases.

Open items & backlog (triaged with Sean 2026-08-22 after the visual pass):
- **Volumes** (researched, plan set): MangaUpdates releases resolve only ~50%
  of chapters and die in the simulpub era — NOT the source. Plan: a
  `volume_boundaries` table from Wikipedia per-series chapter lists (static
  once printed → one-time ingest per series), MU releases + MU's curated
  `anime` coverage field as cross-checks, **MangaDex as the verified id
  bridge** (its entries carry AniList+MAL+MU ids together). Also retires the
  ongoing-manga denominator gap.
- **AFG expansion**: ingest the ~80 chapter-mapped AFG-only shows (Frieren,
  Solo Leveling…) as canonical series — needs rules for AFG's 3-way taxonomy
  (no anime-canon) + provenance marking.
- **Strip type-color brightness** + **source-type color tokens**
  (light_novel/webtoon zones à la manga_only): one design pass, validator
  re-checked, Sean picks.
- **Arc divisions** (strip + episode list): design lab; data ready — every
  AFG anchor already carries its arc name.
- **Franchise IA** (related series / watch order / chronological order — the
  Yu-Gi-Oh/Berserk/Spider-Man problem): needs a franchise/IP entity above
  series (own id per Sean's identity ruling) + IA design phase.
  `series_relations` already holds the typed link data to design around.
- Duotone cover treatment unblocks if covers are mirrored to Supabase Storage
  (`coverImage.color` already stored).
