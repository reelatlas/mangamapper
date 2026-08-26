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
