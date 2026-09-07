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
90. ✅ **DBS 16/17 → MIXED (Sean 2026-08-28, overriding the w5d verdict's
   medium-confidence canon).** The E reading: the node (Goku and Vegeta as
   Whis's students; Pan's birth) is B and real, but a significant share of
   each episode is anime-only padding outside the outline and the manga
   (Bulma courting Whis in 16; the domestic slice-of-life in 17) — a
   self-contained D block beside the story = mixed under T28. T6 map
   amended with the override reason; ep 50 stays canon as ruled. Types
   110/3/18 → 108/5/18; ruling_violation 0; edges redeployed (the map is
   lib). The medium-confidence rows were flagged as exactly the ones where
   Sean's judgment overrides cleanly — this is that, on the record.
91. ✅ **BATCH 20 WAVE 6 APPLIED (2026-08-28; FotNS 29-56 + L-D ×7; two
   verifier reports, both sound; Sean ruled incl. TWO NEW RULE MOTIONS).**
   (1) **The T28 SOLE-ADAPTATION EXCEPTION** (a universal rule, not a FotNS
   ruling): a fragment flips an otherwise-filler episode to MIXED when it is
   the SOLE adaptation of a LOAD-BEARING source beat — both halves required;
   a duplicate graft or trivial first-time beat stays filler. Keeps both
   promises true (skip advice AND the position record — filler would falsely
   mark the pages never-adapted). First witness fist-of-the-north-star 57
   (mixed + partial{82} + anchor repaired 83 → 82); the mixed_fragment_only
   census message now states the criterion (its 16 rows = the triage queue);
   ledger statement + research-agent.md amended. (2) **N35 ruled chapter
   spaces** (lib/rulings/chapter-spaces.ts → resolve + chain + the healer +
   ruling_violation): regenesis 260 → 255 (Coamix's complete index; the five
   a propagated scalar), sacred-beasts 120 → 87/15 (flag #681). (3) **The
   G32 season-segment fix** (the mf-ghost lesson): a season-numbered label
   beyond the entry's OWN season count (series_components) is another
   entry's segment — an S1-only entry no longer inherits S3's endpoint;
   soft default keeps whole-run behaviour; 4 new tests (18/18). (4) Applied:
   34 manual anchors (FotNS 29-56 complete, ch 36-82, incl. the ep-57 fence
   repair and ep 58 → 80 + rearranged{80} A42 ack; the seven L-D finales),
   1 anchor DELETED (regenesis 12 — the 2006 series' pin, G37/A1), 14
   curated continues (regenesis's moved to the ep-9 terminal — the
   verifier's apply-blocking catch), 26 annotations (the verifier's
   ≈246-254 text fix folded), 4 T6 retypes (FotNS 53 filler / 54 mixed /
   57 mixed; regenesis 12 filler), 3 flags resolved (771 / 681 / 541).
   Census deltas all explained: mu_pin_unverified 29 → 23 (six verified;
   regenesis's deleted; four-knights-of-apocalypse is NEW cron drift, also
   +1 anchor_gap_research — queued); frontier_tail_null +1 = regenesis
   10-11 (flagged anime-original, follow-up typing); annotation_without_row
   +1 = shy 24 (the known AFL-lag synthesized row, same as its
   anchor_without_row); asterisk_unreviewed +6 (sign-off queue);
   ruling_violation 0, anchor_nonmonotonic 0, display 219/0 after the A42
   ack. Traps: the four MU string pathologies (season labels; 'Abridged' =
   last COMPLETE chapter; '(Including OVA)' mixes adaptations; an unlabelled
   1→N on a sequel entry = the predecessor's run) → recovery file +
   research-agent already carries the shapes. L-D remainder: 22 pins.
92. ✅ **CONSOLIDATE DEEP after wave 6 (2026-08-28; the T28 exception, N35
   and the G32 season fix changed enforcement sites — P21).** Steps 0-8
   satisfied by §12.91's save point (system census OK, edges current at
   d4665adaf335, 156 tests, ruling_violation 0, display 219/0). Deep:
   (a) **the T28 sole-adaptation probe** — all 703 graft/partial annotations
   scanned mechanically for the SOLE half of the new exception (chapters
   covered by no other row's span): **21 candidates on filler rows**, of
   which the honest queue for Sean's load-bearing judgment is ~17 —
   excluding dragon-ball-super 4 (a false positive by construction: a
   parallel series has no anchors, correspondence is its instrument) and
   noting that claymore 24/26 and soul-eater 39/40 are T28's own FOUNDING
   filler rulings (re-open only deliberately: Jean's sacrifice in claymore
   26 is the sharpest load-bearing case). The full list is in this entry's
   commit; candidates: bleach 147/148 {247}, fma 24/40/41, clear-card
   12/14, shugo-chara 127 {42}, chrono-crusade 22 (volume-space), dbz
   39-43 {246}, zatch-bell 99 {163}, railgun 25 {41}, TBATE 24 {86} (ruled
   this batch — not load-bearing). A `sole_graft_candidate` audit class is
   the natural /add-rule when Sean wants the queue standing (needs the
   parallel-series and volume-space exclusions). (b) apply-batch gains the
   continue-on-deleted-row trap (the regenesis catch). (c) Permanence: 0
   locked, permanence_violation 0; no stale rulings; no retiresWhen
   touched. Cycle position: step 1 — Sean picks wave 7 (recommend L-D ×8
   of the 22 remaining pins; then FotNS 109-151 / kingdom / bleach /
   shippuden / four-knights; dai 18-99 ×3 LAST; regenesis S2 = the
   parallel-candidate research).
93. ✅ **BATCH 20 WAVE 7 APPLIED (2026-08-28; L-D ×7 + the regenesis-S2
   identity; Sean ruled with Cursor).** THE S2 RULING: regenesis S2 is the
   OUTLAW STAR class (anime-first, Hara's spine, 「マンガとアニメは別物です」),
   NOT parallel — parallel requires a comparison instrument and author
   credit does not mint correspondence (the I40 record and research-agent
   now say so; the parallel relation keeps ONE witness). S2 stays out of
   the catalog; if ever added it is its own original-class series. Rows:
   regenesis 9 → mixed (the Nahash half is a real share; anchor 254 v22
   stays), 10/11 → filler + divergence, 12 re-confirmed. Applied: 6 manual
   anchors (shaman-king-flowers 26-29 v6 whole-run-true; prison-school
   76-82 v9 + graft{88}; killing-bites 29-30 v6; soul-eater-not 40-42 v5;
   drifters 40-45 v4 — the stored 56 was the OVA block's; orange 21-22
   v5), 1 DELETED (cobra ep 13 — the 1983 series' pin in a story-level
   numbering; closes #701; NO continue, six out-of-order stories from
   three magazines; arc-level treatment queued), 6 continues, 10
   annotations; N35 ×2 (soul-eater-not 42; orange 22/5 — AniList's
   whole-line unit count reproduced by nobody); G53: orange rows 10-13
   one atomic +1-day block + the LAST LETTER title; soul-eater-not 07-01
   (AFL's naive grid missed a skip week). THE SECOND G32 GATE FIX (the
   cobra lesson): a SINGLE foreign-labelled segment now yields nothing —
   19/19 tests. HELD: the killing-bites date (the slot check surfaced an
   ep-11/12 collision — both rows need sourced dates, a lane-B two-row
   follow-up); the T28 six stay PARKED (unruled; claymore 26 its own
   decision). Census: mu_pin_unverified 23 → 17 (all seven out),
   frontier_tail_null −1 (regenesis 10/11 now filler), asterisk +6,
   ruling_violation 0, display 219/0. L-D: 14/29 checked → 8 confirmed /
   4 part-wrong / 3 another work's; six MU pathologies documented.
94. ✅ **CONSOLIDATE DEEP after wave 7 (2026-08-28; the G32 single-segment
   gate changed — P21).** THE DEEP EARNED ITS KEEP TWICE. (a) The
   single-foreign-segment probe (202 MU strings): 5 refusal candidates,
   each triaged — one-piece-log ('As of EP 1168' = the FRANCHISE frontier
   on a 21-ep Log entry: correctly refused), cardcaptor-sakura ('Movie 2'
   endpoint on the TV entry: correct), sailor-moon-crystal ('Cosmos Movie
   2' — the '(1996)' text has no chapter pair and never was a segment; 39
   manual anchors govern: correct), d-frag / prison-school (the label is
   an ASIDE mentioning the OVA, but both rows hold wave-6/7 MANUAL
   anchors: zero data effect; the fail-closed refusal is acceptable
   G-family behaviour for future cases). (b) **The P5 catch: the wave-7
   gate fix was BYPASSED at the call site** — applyMuFrontier consulted
   pickEntrySegments only for multi-segment strings, so a single foreign
   label still pinned. Outcome-verified (one-piece-log's pin survived the
   heal), the caller patched (usePick when the single segment is foreign),
   re-healed: the pin is deleted, the series moved to
   pending_finished_unknown_coverage (honest; stays on the L-D queue),
   mu_pin_unverified 17 → 16. Verifying OUTCOMES, not intentions, is the
   whole point of the deep. Post-patch deltas, each named:
   mu_pin_unverified 17 → 15 (one-piece-log AND sgt-frog — its foreign
   pin cleared the same way, now pending); anchor_without_row −1
   (one-piece-log's row-less pin); frontier_tail_null +1 = sailor-moon
   (its MU tail pin past ep 199 was also foreign-labelled and refused —
   a 1-row research crumb, queued); ok_full −1 /
   pending_finished_no_totals +1 (the reclassifications). Edges redeployed; 157 tests; ruling_violation
   0. Permanence 0 locked / 0 violations; no stale rulings. Cycle: step 1
   — Sean picks wave 8 (L-D ×8 of ~16, or a gap block; dai LAST; the T28
   six + claymore 26 still parked for his ruling).
110. ✅ **BATCH 21 WAVE 1 APPLIED — the STRONG AFL-vs-AFG contradictions; THE AFG
   PARSER FIX; the chart-lane suppression (2026-09-04; Sean ruled).** The new
   T4 class's first wave (38 rows / 8 series, 7 agents, 2 verifiers-worth of
   checks in one Fable pass over the Opus verdicts). THE FINDING THAT OUTRANKED
   THE WAVE: the shippuden agent proved lib/afg.ts misread AFG's newer row
   format — the type class sits on a <span> INSIDE the number cell (every row
   typed canon), the '(04).' start cell failed hasStart (the TITLE cell was read
   as chapters), and viewing-guide timestamps parsed as chapter ranges ('0:00
   to 4:05' → ch 1-4). Fixed with a test from the real staged rows; afg-restage
   re-parsed 65 / 266 pages (G44); edges deployed; the class now reads the
   true picture (17 series STRONG — wave 2's list). RULED: **six flips filler →
   MIXED + anchor** under the sole-adaptation exception, each verified at page
   level — dragon-ball-z 43 → 246 (ch 246 p.10-end, Kanzenshuu's splits),
   one-piece 93 → 158 (p.2-3, 14-16), 203 → 303 (p.16-18; reverses the
   2026-08-25 A6 deletion, ruled before the exception existed), 418 / 419 / 420
   → 523-524 (the 417-422 block page-partitions both chapters), fairy-tail 246
   → 380 (Mard Geer's debut, p.22-end; overlap with ep 245's END is the honest
   record — Sean: 'we can have overlap chapters through episodes'), naruto-
   shippuden 179 → 450 (the Hokage appointment, newly drawn); **one-piece 50
   stays FILLER + side_source{the Loguetown novelization}** (Sean: an add-on in
   the universe, not the chain and not adopted canon — T26; graft{98} deleted);
   26 rows CONFIRMED as stored (AFL right). **ranma-1-2: THE CHART LANE
   SUPPRESSED** (G26 extended: AFG_CHART_SUPPRESSED + the syncAnchors gate +
   assert-overrides deleting the standing afg anchors — 42 removed; AFG's page
   prints its chapter column in Digital-Remaster production order, our index
   join mis-aligned 41 rows; a title join REFUTED by the verifier: it would
   re-mint the deleted ep-14 anchor). NEW CLASS from the sitting:
   side_source_unadopted (a canon / mixed row tied only to a work outside the
   chain with no adopted{basis} — 57 rows / 8 series, the verifier's catch; a
   sitting, never a retype). CENSUS, every delta named: anchor_gap_research 1
   → **2** (ranma 31-87 exposed by the suppression — honest; shy stands);
   unverified_share 0 → **3** (one-piece 214 / 216 / 319 — the kind's first
   rows, the verdicts could not size ch 313 / 435); type_source_disagreement
   17 (wave 2); type_default_unclassified 28; side_source_unadopted 8;
   ruling_violation 0; anchor_on_noncanon_row 0; display 218 / 0. T6 asserted
   8 rows (+ the op-50 pin); apply: 9 anchors, 9 continues, 37 annotations, 5
   annotation replacements. Traps → research-agent: AFG's class is a viewing
   guide (its minute ranges are the first real T28 sizing instrument), its
   chapter column a reading-position plateau; AFL's 'Anime Canon' bucket; the
   ranma column order (never title-join); ja-WP's 一部原作 marker, the fandom's
   explicit `chapter = Filler`, OPwiki's page map, ja-WP's InuYasha 原作 column,
   TV Tokyo's archived synopses, Kanzenshuu's page splits; a novelization is
   not canon by the author's credit. Apply-batch: A47 normalization needs the
   TRUE next episode (one-piece 195 was moved against ep 203 by the file
   order). Landing gate: flags_for_sean must be a list. Riding along: dbz 125's
   date (AFL's block a week late — lane B), shippuden 176 / 178 / 181, one-piece
   49 unanchored, ranma 158 (stored mixed, three sources say original).

111. ✅ **BATCH 21 WAVE 2 APPLIED + BEHIND IS NOT A BASIS — A44 amended, C5 the
   back-jump continue, the outcome class (2026-09-03; Sean ruled).** THE RULING:
   "it doesn't matter if the order is all skipped around — orient the reader
   truthfully to the episode": END is THIS episode's last manga chapter (A8),
   the continue is where the reader goes next (C5: the coverage / parity value,
   never END + 1, never a re-read), and a first-time significant block anchors
   at its own END wherever the frontier stands. Shippuden 112 = the witness:
   END 318 [317] behind ep 90's 343, continue 343 curated (eps 74-90 already
   read 319-343). A44's 2026-08-26 clause 'acts that sit behind an earlier
   anchor' RETIRED from the statement (the one entry that rested on it —
   sailor-moon 167-168 — was already superseded 08-27 under 'pages, not
   numbers'; the wave-2 verdict, the verifier and the session's own
   recommendation had all leaned on the stale text). DEEP RESCAN of the 29
   ANCHOR_SUPPRESSED rows under the amended predicate: every entry stands on a
   surviving basis (no chapter number / another chapter space / a cover serial
   running ahead / re-shown pages / a restaging / a sliver / a gag special);
   akame 20-21's 'would skip never-adapted chapters' leg is no longer a basis
   but its 'outline' (restaging) leg is — reason unchanged, noted here. Ledger:
   A44 statement + witnesses; A8 gains the aliases 'pages, not numbers' /
   'behind is not a basis' and the frontier-is-not-a-ceiling sentence; C5 gains
   the backward-first-time-pass paragraph. NEW CLASS `backjump_continue_unruled`
   (audit-ui-truth): a canon/mixed row that EXITS a jumped-back block (the next
   anchored row is back on the frontier, or none) with no continue — END + 1
   would re-read adapted chapters; 17 standing (bleach 158, shippuden 154 / 301,
   conan 887 / 1193, naruto 108, hxh 43 / 55, ranma 30, kamisama 18, arms 47,
   dagashi 21, hayate 21 / 49, sket 31, kowloon 13 + ayakashi 12 as finales) =
   a curation queue for writeCuratedContinue (C7); the first draft flagged 177
   because rows INSIDE an advancing block are fine (END + 1 = the next start).
   The parity healer already refuses a row whose next canon/mixed neighbour is
   unanchored, so 112's continue went through writeCuratedContinue in the apply
   (apply-batch trap). The display cost accepted as the honest one: 113-117
   render holes (A18, `verify:hole` 263 → 268) until the next narrow ask.
   WAVE 2 APPLIED (19 anchors, 12 continues, 68 annotations, 3 deletions; 34
   T6 rows across 9 series, confirmations pinned): shippuden 112 → mixed +
   318 [317] + cont 343 + partial + rearranged; 417 → mixed + 666; 460 / 461 →
   filler, the batch-15 manual 681 anchors DELETED (the ch-681 narration frame
   is a sliver; ch 681 stays on 459 / 462 / 463; the batch-12 rearranged rows
   for 460 / 461 deleted, 459's continue note rewritten); 469 → filler;
   black-clover 85 / 88 → mixed (anchors confirmed at the manual tier), 86 →
   filler with its afg anchor deleted; dragon-ball 34, dbz 118, TPN 21 / 22 →
   mixed (the seam-episode standing ruled ONCE: a page-verified source share
   beside a story-carrying original act is mixed); inuyasha 147 / 148 → filler;
   fairy-tail 69 → mixed + 165; one-piece 209 START 307; mha 39's partial →
   graft{49.5} sliver. Google's AI overview (Sean's cross-check, R3
   instant-answer tier) agreed with 460 / 461's CONTENT split and disagreed only
   on the label — the community 'any source frames = mixed' convention the
   sliver clause was built against; on black-clover 88 it repeated AFL's
   block-typed 'Manga Canon'. Post-apply: the four hostile-but-canon rows got
   their A44 entries (beelzebub 49, soul-eater 32, bleach 109 / 227 — unnumbered
   chapters; `ANCHOR_SUPPRESSED` now UNIONS entries per series via
   `toMergedList`, since toRecord's last-wins would have dropped bleach 46) and
   T6 confirmation pins (beelzebub 49, soul-eater 32 / 36 / 38, bleach 109 /
   227); beelzebub 49's side_source chapters re-written with the I41 work label
   through upsertAnnotation (the apply had landed it unlabelled — a write gate
   is queued behind the 55-row backfill, since STANDING_ANNOTATIONS carries
   unlabelled side_source entries the T26 healer re-inserts). CENSUS DELTAS:
   type_source_disagreement 15 → 4 (beelzebub 17 / 34 / 39 and boruto 1 / 24 /
   127 / 157 unresearched — the wave-3 list or close the lane; rurouni 95 = an
   identity artefact: our row is an OVA, AFG's TV ep 95 never aired);
   side_source_unadopted 8 → 9 / permanence_candidate 53 → 52 (beelzebub 49's
   novel tie joins the T26 sitting); asterisk_unreviewed 175 → 177 (TPN's new
   kinds await sign-off); verify holes 263 → 268 (shippuden 113-117);
   ruling_violation 0; anchor_on_noncanon_row 0; display 0 failing; A44 33
   ruled rows; 176 tests; edges deployed twice (ledger + maps). Cycle: step 6
   done (this entry = the deep consolidate); step 7 capture in the traps
   (research-agent: behind is not a basis + the 112 witness; apply-batch: a
   back-jump anchor lands WITH its curated continue). Next: wave 3 = shippuden
   113-117 (the five holes) + the 4 remaining STRONG rows, or close the lane.
112. ✅ **DEEP CONSOLIDATE after §12.111 — the leftover 'relocate' sentence,
   C5 back to covered-or-not, the C3 twin, A12's scope, sailor-moon 167/168
   (2026-09-04; Sean ruled, Cursor's catches).** Cursor read §12.111 and found
   the contradiction the amendment left standing: A44 still said "a significant
   beat anchors unless anchoring it would relocate the reader" — the retired
   clause in other words — and T28 carried the same sentence ("Relocation is a
   separate axis…"). Both rewritten: position and weight are separate axes; a
   significant beat is withheld from the position only when it has NO position
   at all (no chapter number, another chapter space, re-shown pages, a
   restaging), never because it sits behind the frontier. Three code comments
   (anchors.ts, anchor-suppressed.ts, audit-ui-truth.ts) and the sailor-moon
   167/168 STANDING notes ("no anchor by design: Acts 38/44 sit behind ep
   166's Act 49") — stale since the 2026-08-27 superseding entry anchored both
   rows (167 → 44 [38], 168 → 49 [44]) and re-asserted by the T26 healer every
   pass — rewritten to match the stored rows; a mechanical sweep (notes with
   no-anchor language on ANCHORED rows) found no other. THE CONTINUE FORK,
   resolved the way the ledger already said on 08-25: the sentence §12.111 had
   added to C5 ("continue at the first unadapted chapter after the contiguous
   run") contradicted C5's own unseen regime and is replaced by THE TEST — is
   the stretch between this END and the frontier already covered? yes → the
   frontier (112 → 343), the note says where it was adapted; no → END + 1 or
   the next known START (C2 wins), the note NAMES the never-adapted range
   (kind unseen); the continue is never the hole itself unless the next
   episode starts there (sending a viewer back to fill a hole is a manga-order
   catch-up, a different product). END + 1 IS NOT A LOCK (Sean): it means only
   'this episode closed that chapter'; an unfinished END continues in that
   chapter (C1), and a known next START outranks both. THE C3 TWIN: C3 sees
   only a continue BELOW the row's own chapters; a block EXIT has the opposite
   shape (continue above END) and nothing checked its note. lib/c3.ts gains
   `backjumpRange` + `backjumpNoteOk` (5 unit tests; the 112 and Gaiden-120
   shapes) and audit-ui-truth the sibling class `backjump_continue_unnoted`:
   49 standing exits whose continue is right-shaped but whose note says
   neither already nor never (conan ×12, reborn ×4, detective-school-q ×4,
   zatch-bell ×3, fotns ×3, shippuden 120, mha 112, ippo 127 …) — with the 17
   `backjump_continue_unruled` rows this is the C5 curation queue; AUDIT NOW,
   HEALER LATER (Sean): the covered branch is computable from the union of
   prior anchor spans, so the healer can fill it once the queue proves the
   shape. A12 gains its scope sentence (an opener that PRECEDES on-trend
   content; a row whose whole share is the block takes START = its first
   chapter). research-agent carries the continue test. Deep rescan: the map,
   the standing notes and the batch-21 protocol hold nothing else on the
   retired clause. Edges redeployed (ledger + lib); heal: 373 standing rows
   asserted, 33 A44 rows, 0 removed; ruling_violation 0; 181 tests. Cycle:
   step 1 — plan wave 3 (shippuden 113-117 + the 4 STRONG rows) or close the
   T4 lane; the C5 queue (17 + 49) is a curation sitting, not research.
113. ✅ **BATCH 21 WAVE 3 APPLIED — the ep-112 holes closed, the last STRONG
   type rows, THE BORUTO CHAIN (2026-09-04; Sean ruled).** Three agents (Opus),
   3/3 landed, verified (w3-flips.md, Fable). SHIPPUDEN 113-117: five anchors
   344 [343] / 346 [345] / 347 [346] / 348 [348] / 350 [349], monotonic between
   ep 90's 343 and ep 118's 351 — the A18 holes the ep-112 anchor opened all
   close (verify:hole 268 → 263) and every stored pointer the block touches (ep
   90, 112, 118) was confirmed, no repair; 113 mixed → canon under the recap
   clause (the Part-I recap is already-animated material; the remainder is chs
   343-344); 114's START ruled 345 by A10 as written (the verifier refuted the
   agent's 'first-time exempts it' — a two-page flashback lead is a scrap;
   partial{344 pp 16-17} carries the tie); 117's END held at 350 on A47's
   teaser clause (the R3 single-lineage leg was refuted — en-WP credits 351 —
   but the hold survives). Continues 113 → 344 (C1), 114 → 346 (C1), 117 → 351
   (C2 = ep 118's START), all curated (C7). THE SLIVER-END WORDING TRAP: the
   delivered chapters_adapted tails said 'flashback pages open ep 114' (113)
   and 'replays the reversal' (114) — SCRAPPY words that made sliverEnd return
   343 / 345, and the staged dry run had PRINTED those wrong values without the
   stage catching it; the records are reworded at write (CHAPTERS_ADAPTED_FIX)
   rather than value-overridden, so end_sliver_mismatch cannot re-list them.
   BEELZEBUB 17 / 39 → filler (the ch 12 / 23 and 82-83 shares are slivers
   restaging pages ep 6 / eps 15, 18 / eps 38-41 carry), their afg-tier anchors
   + continues DELETED at the manual tier (P8; lossless; the T6 pins hold the
   AFG writer's A1 gate); 34 → mixed (a continuous first-time ch-69 maid-cafe
   scene inside a mostly original episode — the seam-episode standing ruled
   with bc 85 / 88 and db 34), anchor 69 kept. AFG's Beelzebub page is the OLD
   format (no class on these rows, '*Filler' in the title cell, chapters
   printed = the fandom infobox copied). BORUTO 1 / 127 / 157 → filler, 24
   mixed confirmed. Sean's two questions answered on the evidence: ep 1's
   Kawaki flash-forward cold open is ch 1's first page-set, first-time, but a
   tease never returned to — a sliver (graft{1}; ch 1 proper is eps 53-54's;
   black-clover 3 the precedent; being episode 1 is not a rule factor); ep
   157's Katasuke-report coda is ch 11's B-plot restaged with Ino for Ibiki, a
   status report ep 148 skipped — a sliver (graft{11}); both filler by ruling.
   THE BORUTO CHAIN (I41, Cursor's framing, verifier's reading): one continuity,
   three instruments — Naruto (30011, ch 1-700) → Naruto Gaiden (86171, its own
   tankōbon, 700+1…+10) → Boruto (87178, the instrument, 1-80); Naruto TV and
   Shippuden share one manga and need no chain; ep 24 adapting ch 700 is the
   Rosario-14 shape (chain_source, position-less in Boruto's space — A44 entry
   [24], basis another chapter space); the annotation table's key is (series,
   episode, kind), so ep 24's one chain_source names both works
   ('Naruto: ch 700; Naruto Gaiden: ch 700+5'), first label checked;
   chain_source_unmapped 0. Follow-ups queued: boruto eps 19-23 / 39 (stored
   canon on Gaiden chapters, want chain_source), boruto 18 / 93-95 (AFL's loose
   Mixed bucket), beelzebub 15 / 26-28 / 51. THE T4 LANE CLOSES:
   type_source_disagreement's STRONG tier is EMPTY (only the weak / parked line
   remains). PROCESS TRAP captured (research-batch skill): both wave-3 asks
   stated a wrong premise ('AFG prints FILLER, red, no chapter') because the
   plan step translated OUR parsed label into a page colour — quote the census
   line verbatim. Census: ruling_violation 0; display 0 failing; A44 34 ruled
   rows; T6 776 rows / 7 asserted; end_sliver_mismatch 1 / start_sliver_mismatch
   1 = the standing signing rows (one-piece 195, tmm 38), unchanged. Edges
   redeployed. Cycle: step 6 standard (no enforcement site moved) → step 1:
   close batch 21 (P34 extraction) and plan the next block — the C5 curation
   queue (17 + 49), the boruto chain follow-up, the standing sittings.
114. ✅ **P38 — RETIRED WORDING IS A LEDGER FIELD THE GATE GREPS; the note-vs-row
   class; the amendment protocol (2026-09-04; Sean ruled, Cursor's three
   tightenings).** Sean's question: when we add-rule / consolidate, do we
   check for conflicting or stale rules and prune them? Honest split: the
   scripted checks (ledger ids / aliases / citations, one-hop, system census,
   healers asserting the maps, outcome classes, P23 / P24 in deep) hold; PROSE
   contradictions between statements did not — this week's leftover 'relocate
   the reader' sentence (A44 and T28), the sailor-moon 167/168 notes, and the
   C5 same-record clash were all caught by reading. Built, as ruled: (1)
   `retiredPhrases` on the Rule type — the EXACT replaced strings, listed at
   amendment time, never in aliases (aliases keep old citations resolving);
   ledger-check's `checkRetiredPhrases` reads rule titles + statements from
   the loaded records and greps the live text scopes (.claude skills + agents,
   CLAUDE.md, runbook / architecture / STATE / franchise-rulings,
   scripts/ingest, scripts/restructure, src/lib) — red while one survives;
   excluded on purpose: changelog, research outputs + pinned protocols,
   history/, generated docs, the stale .claude/worktrees checkout. A44 / T28 /
   C5 carry their retired strings (the A44 statement reworded so it no longer
   quotes its own retired clause); first run found the phrase alive only in the
   worktree copy. (2) `annotation_contradicts_row` (audit-ui-truth): a standing
   note asserting no-anchor language from a SMALL banned set ('no anchor by
   design', 'this row takes no anchor', 'position-less by ruling',
   'anchor_hostile', 'never anchors') on a row that carries an anchor — 0
   standing; SAME DAY (Cursor's two lines): the set narrowed to phrases that
   say THE ROW has no anchor ('no anchor by design', 'this row takes no
   anchor', 'no anchor by ruling', 'never anchors') — 'position-less' and
   'anchor_hostile' dropped, mixed rows use them about a sliver while holding
   an END; and the retired-phrase scope stated explicitly to include
   lib/rulings/ string values (reasons, standing notes), live prose; 'takes no anchor' alone matched notes about the NEXT row (fotns
   108, shippuden 179) and stays out: an outcome class, not note parsing. (3)
   Protocol, not a second grep: add-rule step 7 says fill retiredPhrases before
   the commit; consolidate deep says ledger-check is the gate and P23's
   read-list for an amended rule is the rulings maps that cite its id. Meaning-
   equivalence between two statements stays judgment by design. Record P38;
   rules.md renders 'retired wording'; one-hop case 42. Edges redeployed
   (ledger types in lib); 181 tests; system census OK.
115. ✅ **BATCH 21 CLOSED (P34, 2026-09-04).** The T4 lane — the STRONG tier of
   `type_source_disagreement` — ran three waves (§12.110 / 111 / 113): 84 T6
   rows across 17 series, two AFG parser fixes, the chart-lane suppression
   (ranma), the sliver clause on standing rows, behind-is-not-a-basis, the
   Boruto chain. Extracted: `lib/rulings/applied/batch-21.ts` — 27 entries, one
   per curated overlay (kind replacements, anchor deletions, skips, the A10
   START override, the sliver-end rewordings, nulled prose chapters, the chain
   chapters) plus map pointers (T6 / A44 / G26); the three apply scripts moved
   to history/ as batch21-apply-wave1/2/3.ts (batch 20's history already owns
   the bare apply-waveN names), imports re-pointed, never run. docs/rulings.md
   2334. The batch's tooling (context / validate / scan / baseline) stays in
   research/batch21/ as the template for batch 22. Open from the batch, queued:
   the C5 curation queue (17 exits without a continue + 49 unnoted), boruto eps
   19-23 / 39 (chain_source) and 18 / 93-95 (AFL's loose Mixed bucket),
   beelzebub 15 / 26-28 / 51, rurouni TV ep 95 (identity). Batch 22 opens on
   the boruto follow-up (lanes I + C) with the batch-21 tooling copied.
157. ✅ **BATCH 24 WAVE 2 — THE RE-ZERO GAP BLOCK APPLIED (2026-09-07; Sean ruled with Cursor: 'Yes on the block. Overlay only.').**
    THE WAVE: two research-agents (Opus) on lane A2 in LN VOLUME space (T24, live since §12.155) — the 50 AFL-typed rows wave 1
    exposed as never anchored: S1 rows 1-25 = volumes 1 → 9 (Arcs 1-3; two A10 seam rows 19 → 7 [6] and 22 → 8 [7]; v7's Wilhelm
    chapter un-cross-cut across 20-21), S2 rows 26-50 = 9 → 15 (ep 26 FINISHES v9 — Arc 3's last row; Arc 4 = 27-50; ep 30's relocated
    scenes; the five-episode cross-cut of v14 ch 2) — both agents verified the arc brackets on ja-WP's 章構成 / 既刊一覧, KADOKAWA's own
    volume labels and the PRINTED CONTENTS of all fifteen books, and the 25 / 26 seam agrees EXACTLY across the two files (ep 25 stops
    inside v9 at 第五章's end, ep 26 opens on its 幕間 and finishes it); ep 50 → 15 closes one below the stored ep 51 → 16 fence. One
    Fable verifier by the COUNT (Sean's lever — the S2 verdict; S1 unverified, no structure surprise): SOUND WITH FIXES — the instrument
    and both seams sound on the contents scans, the two reorders real, scope clean; FINDING: the S2 verdict's 'four independent
    lineages' on ep 34 are ONE wiki family (es / zh / ru translate en) — but the v12 share EXISTS on independent lineages (en-WP's ep-34
    plot; Kadokawa's v12 blurb 「影に呑まれる集落、敵であるはずのガーフィールの助力」), so END 12 [11] medium stands as on ep 77. SEAN'S
    SEVEN DECISIONS (with Cursor): (1) the 50 anchors; (2) eps 24-25 on v9 although v9 printed four days after the finale — 'T24 is the
    printed book, not the print date'; (3) ep 34 END 12 [11] — the second lineage is en-WP's plot + Kadokawa's blurb, the fandom's
    book-side arc page is the same wiki family (R3 is editorship), the web novel's break a cross-check never a position; (4) ep 50's
    continue → 16 STORED (it differs from END 15) — 'C5 unseen, landed as parity with the 蛇足 named; not C3' (v15's closing
    蛇足『――再臨』 is never animated through ep 79; the reader reads it before v16); (5) ep 45 side_story (a Melonbooks purchase-bonus
    story bundled with v14 of the SAME novel — the series' own source), the false 'a side_source would flip this canon row to filler'
    clause struck; (6) NO T6 pins — AFL already types these rows, the confirmation entries are no-ops; (7) the wording + the capture:
    translated wikis are one lineage under R3 (research-agent trap), and an ask names the fact WANTED, never one remembered (the
    'double-length premiere' premise I wrote into the S2 ask was false — syobocal: 30-minute slots; research-batch skill line). THE APPLY
    (apply-w2.ts, file-driven + overlay, dry-run → apply → dry-run idempotent): 50 anchors (manual; volume = END; A47 / A10 through
    lib/sliver.ts's vocabulary — nothing moved), 53 annotations, ONE stored continue, 5 overlay entries, the one-lineage correction
    appended to 32 notes; the heal: parity converted 110 (re-zero's C1 rows and the afg-rebuilt series), c3-skip-notes 4,
    heal-anchor-volumes 0. CENSUS (vs §12.156, every delta explained — P17): anchor_gap_research 4 → 3 (re-zero gone: 79 of 79 rows
    anchored); run_stuck 2 → 0 (healed); **verify-series-display 222 verified, 1 FAILING — record-of-ragnarok**: eps 22 / 27 / 33 / 38
    'start below the previous anchor with no rearranged / graft ruling' — NOT this wave's: the §12.156 afg run rebuilt RoK's afg tier
    (20 / 21 / 23 / 26 / 32 / 37 created 09:22 UTC) and the batch-12 ROUND-GRAIN manual STARTs (22 [31], 27 [43], 33 [55], 38 [66] —
    'the round's first chapter', the phantom back-reach batch 22's verifier named and repaired on ep 17) now render as four false
    back-jumps; the roster stopped at the verifier (P32), so the discovery census was run standalone — UNCHANGED in every class; every
    violation class 0. THE INTERIM PROPOSED TO SEAN (not applied): null the four round-grain STARTs under A13 (a START that is not the
    row's first chapter is a breach; the ENDs are the verified round finales and render monotone alone) until batch 23 wave 1's RoK ask
    refines the map on pages. THE SYOBOI EVALUATION (Sean's question, with Cursor's read — recorded as the process decision): cal.syoboi.jp
    is the JP TV broadcast record (per-TID airings, channels, slot lengths, rerun flags) and it already works where it matters — a
    research CITE for first JP air dates, slot lengths and reruns (batch 19 lane B's G53 repairs; this wave's 'double-length' refutation);
    Wikipedia and AFL write air_date; a second writer would fight the first, so NO syoboi puller. An automatic wiki-vs-syoboi date checker
    is an engineering sitting, deferred with its trigger (a date census class showing Wikipedia wrong at a rate that matters, or the
    extras seats needing day-accurate dates), and its two known traps recorded now: the TID ↔ series join belongs on COMPONENTS (one
    TID per season; series_external_ids holds one id per source), and syoboi's times run past 24:00 on the programming day (25:05 =
    01:05 next day — the rezero.fandom one-day-early shape), so a naive diff would flag every late-night show. Made explicit today: the
    research-agent definition names syoboi as the broadcast instrument with the normalization trap. LEDGER / MAPS: lib/rulings/applied/
    batch-24.ts +7 wave-2 entries; no rule or map moved (the block lands as data under T24 / N35 already live). USAGE: research 382k +
    372k, the verifier 383k ≈ 1.14M (the 0.95M estimate under-called the verifier's floor again). Edges rebuilt + deployed ×5 (the applied
    map is lib) — off the cron minute; 305 tests; lint 463; system census green.
156. ✅ **THE EVENT WIKI RUN AFTER THE TWO-PART-TITLE PARSER FIX + the AniList check (2026-09-07).** THE TRIGGER: §12.155's parser fix
    (lib/wikipedia.ts#multiPartTitle) made the ~140 empty-title wiki rows the S4 verifier counted fillable; title_incomplete is the event
    run's trigger. THE DRY RUN FIRST (P40; 33 target series, every lock line read): three series fill — kinnikuman 134 (its 1983 run
    is two segments per episode), welcome-to-demon-school-iruma-kun 9 (12 title conflicts kept stored — fill-only), cells-at-work 3;
    the fills PREVIEWED row by row before the live run (number AND date match on every one: 'Messenger From Planet Kinniku / The Man
    From America' …); nothing created anywhere (re-zero 80-81 and gits ep 10 stay off, as ruled); the companion-table guard refused
    re-zero's shorts table again; 15 series read 'no page could be offset-locked' (dan-da-dan, wind-breaker, ranma1-2-2024, the
    beginning-after-the-end, digimon-adventure, one-piece-log … — their empty titles are NOT the two-part shape; a lock question for a
    later reading); G55 refused one-piece 1 and girls-last-tour 10 namesake rows. THE LIVE RUN on the three: filled 146, created 0. THE
    ANILIST CHECK (Sean's question): still 403 — the body is BYTE-FOR-BYTE the documented 'API unavailable' example (docs.anilist.co
    'API Stability': 'The AniList API has been temporarily disabled due to severe stability issues.'), the GLOBAL suspension, not a block
    of us: a manual IP block carries 'a custom message letting you know that you have been blocked and why'; our client paces at 30
    req/min against the documented degraded limit (90 normally), one daily cron plus budgeted stagings — far under; the rate-limiting page
    reads 'We are not currently accepting requests for increased rate limits' — nothing to email now; the ask would be
    contact@anilist.co ('Rate Limit Raise {app}': username, the limit wanted, a description, links, evidence) only if a restage or a
    catalog-wide refresh ever needs more than 90/min, which today's cadence does not. CENSUS (UI-truth vs §12.155, every delta explained
    — P17): title_incomplete 19 → 17 (iruma-kun and cells-at-work complete; kinnikuman keeps 3/137 its page does not carry); run_stuck 0 →
    2 → 0 — afl #1391 (06:40 UTC) was killed by the §12.155 edge deploy landing in the same minute as the hourly refresh-afl (a TRAP: deploy
    edges off the cron minutes) and afg #1407 (09:20 UTC) by the edge wall clock mid-rotation (G58); the standard healer heal-stuck-runs
    marked both; THREE MOVERS THE KILLED AFG RUN LEFT before it died (it had rebuilt the afg tier on ~11 series, 09:20-09:23): (1)
    anchor_start_offtrend 0 → 4 — record-of-ragnarok's afg anchors at 20 / 21 / 23 / 26 were re-created, so the batch-12 ROUND-GRAIN
    manual STARTs (22 [31], 27 [43], 33 [55], 38 [66]) now sit below a preceding afg END: the exact rows of batch 23 wave 1's first ask
    (the round-grain map refined to pages; an OPEN class, queued, not a violation); (2) ok_full 255 → 254 / ok_no_volume 9 → 10 —
    a-couple-of-cuckoos' 36 afg anchors were rebuilt under V11 (the volume at write from the boundary table; manga 114383 has NO table →
    null, the legacy volumes gone — honest under P6; the fix is a volume_boundaries ingest for 114383, the V11 event trigger); (3)
    asterisk_unreviewed 180 → 181 — spy-x-family gained one afg-derived annotation and the census set its review to pending; every
    violation class 0. NOT a spend: the whole pass is script work.
155. ✅ **BATCH 24 WAVE 1 — THE TYPING WAVE APPLIED (2026-09-07; Sean ruled with Cursor: all eleven decisions as recommended, the two
    forks as the verifiers read the rules).** THE WAVE: four research-agents (Opus) on lane T — a wiki-minted default-canon block typed
    under T25-T28 AND anchored from zero, the instrument stated PER ASK ('one protocol shape will lie') — and four Fable reports (R23 ON:
    gits-2026 the FULL sweep, the other three SCOPED), every one SOUND WITH FIXES, no END refuted. RE-ZERO 51-79 (S3 = LN Arc 5, volumes
    16 → 20; S4 = Arc 6, 20 → 24): the catalog's FIRST NOVEL-OWNER ANCHOR SET — T24 LANDED (planned → live): end_chapter / start_chapter /
    volume carry the LN VOLUME number, chapters_adapted names 'vN ch M', the space is an N35 entry {chapters: 45 volumes}; 29 anchors, all
    29 confirmed canon (every title is verbatim a printed LN chapter title). GITS-2026 1-9: THE FORK → an ADAPTATION, proven on the
    licensor's own STORY page (every title is the manga's chapter title in printed order, i/ii/iii the cuts; I40 needs an uncitable
    outline and the source is the published book; T21 needs no episode ↔ chapter map and the titles are one); 9 anchors in the PRINTED
    1-12 space (N35: Kodansha's own 目次 numbers 「12　EPILOGUE」 — the stored 11 was AniList's; this series only); ep 8 canon → MIXED (the
    'INTERMISSION' half is the anime-original Project 2501 prequel, Science SARU's own 「オリジナル要素が含まれた話数」). ACE ACT II 53-65:
    ch 170-259 in the act II space — the season opens on 189-197 (the Norikane game) and only then returns to 170-187 (Ichidaisan vs
    Yakushi, the manga's first): an un-cross-cut, `rearranged` on 54-55, two C2 parity continues (53 → 170, 55 → 198); 13 anchors, all 13
    confirmed canon on the title-chain instrument; ch 188 UNPLACED (flagged, no seat invented); 259 = vol 29 (MU chapter-right,
    volume-wrong). THE DECISIONS (WAVE1-RECOVERY.md § THE DECISIONS): (1) T24 as delivered, 45 seeded; (2) re-zero ep 54 END 17 held, the
    two thread labels corrected (the Emilia / Regulus stinger closes v17 and continues in v18's opening; the rooftop / Capella thread is
    what leaves ch 5 unfinished); (3) ep 77 END 24 [23] — A47's hold needs a ≤ 5-page or teaser-worded scrap and the closing beat is v24
    ch 1's opening scene on three lineages; (4) a continue equal to the END is DERIVED, never stored (seven skipped: gits's five C1s,
    re-zero 77 / 79; the parity healer's own C2 conversions — 29 on the three series — are that derived tier, continue_source healer);
    (5) row 67's title PARSER FIRST: lib/wikipedia.ts#multiPartTitle joins a two-part entry's Title_1..N with ' / ' (NumParts — the row
    minted title-less because parseEpisodeList read `| Title =` only; ~140 empty-title wiki rows catalog-wide are the shape to re-check),
    the wiki event run then FILLED the row itself (dry run 'would fill 1, create 0'; live 'filled 1') — no manual repair; (6) the 51
    confirmed defaults as T6 PINS (a confirmed default is a pin, never a no-op: type_default_unclassified retires only on a pin or an AFL
    number and deriveVisibility publishes on it — the S3 verifier); (7) gits ep 2 START 3 (A10 inclusive at five pages; 「ラスト5ページ目前後」
    on the line; the lead rewritten '2 (final 5 pp, pp.45-49 …)' so sliverStart agrees); (8) ep 8 mixed + anchor 10 [9] + unverified{9};
    (9) space 12; (10) Ace as delivered, flag #927 closed (the ep-52 graft{189} corroborated; MU's S2P1 line now has rows), MU's volume
    ignored; (11) the captures. THE APPLY (apply-w1.ts, file-driven + overlay, dry-run → apply → dry-run idempotent): 51 anchors (manual;
    A47 / A10 normalized through lib/sliver.ts which now reads the VOLUME vocabulary — the first dry run refused re-zero 59 because a
    scrap-worded tail named the END volume while the body carried it, a clause chapter space never needs; fixed + tested), 42
    annotations, 2 continues stored, 9 overlay entries, 8 anchor notes DEDUPED (the batch-17 append loop — ace 52's REPAIR sentence
    ×5; hikaru-no-go 75, mashle 23, rosario-vampire 11, bleach 146, x 20, sailor-moon-crystal 39, yowamushi-pedal 38), flag #927 dismissed
    with its resolution. THE HEAL: assert-overrides — totals gits 11/1 → 12/1 and re-zero null → 45/45 (N35), gits ep 8 canon → mixed (T6),
    **ghost-in-the-shell-2026 visibility staged → PUBLIC (P39 — the T6 pin publishes a seeded series, by design)**; heal-anchor-volumes 0
    (no boundary table on any of the three); parity converted 29. CENSUS (vs §12.154, every delta explained — P17): type_default_unclassified
    87 → 84 (the three series retired — a per-series class); frontier_tail_null 14 → 13 (Ace's tail anchored); pending_airing_no_anchor 4 → 2
    (re-zero, gits — airing and now anchored); title_incomplete 20 → 19 (row 67); unverified_share 3 → 4 (gits ep 8, the queued share);
    anchor_gap_research 3 → 4 (re-zero 1-50 — the AFL-typed, never-anchored block the wave exposed: a gap-block ask of its own, off this
    wave by ruling); asterisk_unreviewed 178 → 180 (the apply's standing asterisk_review = pending on re-zero and gits); series_staged 35 →
    34 (gits public); ok_full 253 → 255 (Ace and gits complete); anchor_note_repeated (NEW, violation) 0 after the dedupe; start / end
    sliver mismatch 1 / 1 UNCHANGED — the 29 volume-space rows are silent under the vocabulary and no chapter-space verdict moved (the
    deep trigger fired on lib/sliver.ts, an A10 / A47 enforcement site: the two sliver classes over every standing anchor ARE the rescan
    and read the same; 22 unit tests hold); every violation class 0; 222 verified (220 + gits public + re-zero now anchored), 0 failing;
    discovery classes unchanged. LEDGER: T24 live (enforcement lib/sliver.ts#volumeUnit / sliverStart / sliverEnd + chapter-spaces + the
    applied map; auditClass start_sliver_mismatch / end_sliver_mismatch; witnesses + re-zero-starting-life-in-another-world); N35 ×2; T6
    ×3 (51 rows + the retype); lib/rulings/applied/batch-24.ts (13 entries, registered); lib/note-text.ts (repeatedSegment / dedupeSegments)
    + the census class; the research-batch skill ('an ask names the FACT, never the column' — both re-zero asks named a 原作 column that
    does not exist) and the apply-batch skill (the T6-pin landing; the derived-continue rule). USAGE: research ≈ 1.44M (≈ 360k per lane-T
    work), verification ≈ 0.90M (three scoped 203-231k, the full 248k — the scope lever saved almost nothing: a verifier's floor is the
    instrument pages; the lever is the COUNT of verifiers, recorded in memory), wave ≈ 2.34M. Off this apply by ruling: re-zero 80-81 and
    gits ep 10 (not rows; the wiki run created 0), slime / tennis / beyblade, Ace 188. Lint 463 (437 + the 26 warnings of batch 24's
    copied helpers — the same as batch 23's); 305 tests; edges deployed ×5; system census green.
154. ✅ **THE ANNECY CLAUSE — I46 amended: a shared external id registers to NEITHER (2026-09-07; Sean with Cursor: 'register to
    neither, never pick a winner, never a row repair').** THE SHAPE (§12.151's census, related_work_identity_conflict 1): AniList gives
    ONE MAL id (59832) to two distinct one-minute Annecy Festival 60th Anniversary shorts — One Piece 143293 (one-piece @978.5) and
    Dragon Ball 147996 (dragon-ball-super @131.53) — because MAL lists the pair as one entry: a GRANULARITY difference between sources,
    not a mix-up in our data; the registry had attached the id to the first work it met and refused the second, the collision it
    exists to catch. THE CLAUSE: an external id a source assigns to two or more DISTINCT works is not an identity of any of them — it
    registers to neither; both AniList identities stay; no winner, no row repair. THE GATE (P2, one derivation): lib/related-work-ids.ts#
    sharedExternalIds / sharedMalIds — a pure read of the staged (anilist, idMal) pairs — read by the writer (sync-related-works: malOf
    withholds a shared id at every registration; a shared id an earlier run registered is un-registered, printed by id and counted)
    and by the census (identityProblems takes the shared map: a withheld shared id is never a gap; one the registry holds for anyone
    is ONE conflict line, by the id, never an orphan). THE RUN: dry run first (P40) — 'un-register mal:59832 (held for work 143293)',
    3 shared MAL ids withheld, 1 un-registered, nothing else moved; live the same; the second dry run 0 un-registered (idempotent).
    THE OTHER TWO shared ids are owned COMPONENT pairs — JoJo's Steel Ball Run 1st / 2nd-3rd STAGE (190327 / 210482 on MAL 61469,
    C2's I24 components) and Knights of the Zodiac parts 1 / 2 (102427 / 114448 on MAL 36040, series-shaped candidates) — where a
    component's mal_id is an ATTRIBUTE and only a head registers (I44): never in the related-work registry, nothing to un-register;
    the clause lives where a MAL id is a KEY. NOT widened: the series registry (I44, registerIds) keeps its hard collision error — two
    of OUR series sharing a MAL id would be a question for Sean, not a granularity fact. CENSUS (vs §12.153, every delta explained —
    P17): related_work_identity_conflict 1 → 0, the only class this change moves; identity_gap 0, identity_orphan 0; every violation
    class 0; discovery unchanged (halo_series_unclaimed 94, unruled 428, cluster_disorder 52, short_unlisted 0, new_since_sitting 2);
    UI-truth identical (title_incomplete 20, airdate_incomplete 21, type_default_unclassified 87, frontier_tail_null 14,
    fractional_unmodeled 5; 220 verified, 0 failing) — except permanence_candidate 52 → 53, which moved at §12.153 and was not
    recorded there: revolutionary-girl-utena's two date fills were its last open item, so it joined Sean's signing queue (P25, never
    signed for him). LEDGER: I46 amended (the shared-id clause in the statement, the fork in the why; amendedOn 2026-09-07; aliases
    'registers to neither' / 'the Annecy clause' / 'shared MAL id' / 'sharedExternalIds'; enforcement + sharedExternalIds / sharedMalIds;
    witnesses + one-piece / dragon-ball-super); one-hop case added (50/50); 2 unit tests (301). Edges rebuilt + deployed ×5; lint 437
    (baseline); system census green.
153. ✅ **THE EVENT WIKI RUN — the five catalog readings applied (2026-09-07).** §12.152's catalog-wide dry run named five
    series; each was dry-run on its own lock lines and read: that-time-i-got-reincarnated-as-a-slime creates 92-93 (the airing
    S4's newest rows, 2026-08-28 / 09-04; the main list page's own rows REJECTED as a namesake — the season sub-pages locked,
    five fractional separators aligned); kakegurui fills 24 titles / dates from "Kakegurui (2017 TV series)" (the main-
    article path); revolutionary-girl-utena fills 2; the-prince-of-tennis creates 105 (2003-10-22, inside the 2001-05 run —
    the row AFL lagged; the 24 OVA rows dated 2006-09 G55-REFUSED as the namesake pages they are — the National Tournament
    chain's own series); beyblade-x creates 133 (2026-09-04, the airing tail). Every one a standing lag fill under G55's date
    gate — the event run's own job (title_incomplete is its trigger), applied: 4 created, 26 filled; heal-format 2. CENSUS
    (vs §12.152): title_incomplete 23 → 20 (slime's 2, tennis's 1, beyblade-x's 1 rowless eps filled); airdate_incomplete
    23 → 21 (kakegurui / utena); integrity_total_beyond_eps 10 → 9 (tennis 178 vs rows 177 → 178); frontier_tail_null 13 → 14
    (slime's 92-93 past anchor 91 — honest, P6); type_default_unclassified 85 → 87 (slime's and tennis's wiki-minted rows;
    beyblade-x's 92 → 93); format_missing 2 → 3 and episode_without_component 2 → 3 — slime's 92-93 sit past its S4
    component's span (73-91: the span is AniList's aired count at the last RESOLVE, and AniList has been 403 since 2026-09-06;
    aired_episodes already reads 93 from the daily refresh) — the catch-up's resolve re-plans the component (planComponents)
    and both classes return to 2; queued by name, never silent; every violation class 0; 220 verified, 0 failing.
152. ✅ **THE WIKI WRITER'S LOCKS — G59 amended (2026-09-07; the C1 / C2 owed rows landed: re-zero 51-79, Ace act II 53-65,
    gits-2026 1-9 = 51 rows).** THE DRY RUN FIRST (P40): wiki-episodes-backfill.ts has `--dry-run` — every lock line and every
    planned row printed, no insert / update / fractional / flag / run — and it paid for itself on the first witness: re-zero's
    list page DATE-LOCKED AT +14 with 34 title conflicts, a wrong lock a live run would have written over rows 51-79. Each
    witness failed for a DIFFERENT reason, found by watching, not inferring: (1) re-zero never reached the lock — the finder's
    search fallback tried only its first two title variants and the two year-disambiguated forms held both slots while the
    native title (the one the search resolves) sat fifth → every variant is searched (lib/wikipedia.ts#findEpisodePages);
    (2) the page it then found, "List of Re:Zero episodes", holds only the OVA / shorts table itself and links its season
    tables as {{Main|Re:Zero season 3{{!}}…}} sub-articles and {{#Section-h:…}} section transclusions → walked like
    transclusions (extractMainArticles; 2 unit tests); (3) the shorts table's weekly rows aired the SAME DAYS as season 2 —
    50 exact date votes for +14 → the COMPANION-TABLE GUARD on the date-vote lock, its measure MEASURED on the catalog dry
    run, not assumed: a true table under a different titling system still shares a distinctive word on a quarter of its
    rows (One Piece's AniFiller titles vs Wikipedia's 4Kids titles 3 of 13 / 5 of 19; Cuckoos' translation variants 17 of
    23), a companion table on almost none (re-zero 1 of 51) — at least ten compared rows and a shared distinctive word on at
    most one in twenty refuses the page (the first cut, ≥ 0.75 token similarity with disagree > agree, had refused One
    Piece's true season pages — the catalog dry run caught it); (4) Ace act II's "season 2" sub-page numbers 179-191 in the
    FRANCHISE space while our act II tops at 52, and "Second Season" is a word ordinal the label parser did not read → the
    FAMILY-OFFSET CARRY (a skipped page whose numbering continues a locked sibling's, pmin = its top + 1, takes the sibling's
    PROVEN offset and must still land where our rows end, fit our count and continue the dates; no locked sibling, no carry)
    + word ordinals in seasonOfLabel; (5) gits-2026's article is "The Ghost in the Shell (2026 TV series)" and MediaWiki titles
    are case-sensitive past the first letter — an ALL-CAPS AniList title also tries Wikipedia's casing (lib/wiki-identity.ts#
    titleCased; 2 unit tests). Evidence, never a guess: every lock still runs under G55's date gate; the three earlier
    lock kinds are unchanged. THE APPLY: the three witnesses only (their trigger is the ruled extensions and the mint; each
    dry-run clean) — re-zero 29 created (51-79; the S3 / S4 sub-pages component-locked in overall numbering), gits-2026 9
    (1-9, its own article), ace 13 (53-65, family-offset-locked); heal-format 51. THE CATALOG-WIDE DRY RUN (41 target
    series, nothing written) is the event run's next reading, NOT applied: kakegurui would fill 24 titles from its 2017
    article, utena 2, slime create 2, and two creates ride on many conflicts (the-prince-of-tennis 1 with 14 conflicts beside
    24 G55-refused OVA rows; beyblade-x 1 with 16) — read one by one before any live run. CENSUS (vs §12.151, every delta
    explained — P17): title_incomplete 25 → 23 (ace's 13 and gits' 9 rowless eps filled; re-zero's "29 aired eps have no
    rows" became "1/79 rows missing titles" — the S4 page's newest row is title-less); type_default_unclassified 82 → 85
    (the three series' wiki-minted rows owe their typing: re-zero 29, ace 13, gits 9); frontier_tail_null 12 → 13 (ace: 13
    canon eps past anchor 52 render null — honest, P6); pending_airing_no_anchor 4 unchanged; every violation class 0;
    220 verified, 0 failing; discovery unchanged. LEDGER: G59 amended (amendedOn 2026-09-07; witnesses + re-zero / ace /
    gits-2026; enforcement + findEpisodePages / extractMainArticles / titleCased; aliases); the discover skill's step 5 says
    dry-run first and its trap line is corrected; the consolidate skill's P40 line notes the writer now has a dry run.
    Edges rebuilt + deployed ×5 (lib/wikipedia + lib/wiki-identity); 299 tests; lint 437; system census green.
151. ✅ **I48 — SHORT-FORM SPIN-OFFS ARE RELATED WORKS, NEVER SERIES (the shorts gate; /add-rule, 2026-09-07; Sean with Cursor:
    'rulings now, gate queued' at C2).** THE PREDICATE: a TV_SHORT or ONA whose STAGED per-episode length is at most five minutes,
    reached from an owned series by any in-run relation other than SEQUEL, routes to the related-works ledger as an EXTRA of that
    owner (I45 layer 1); its bucket and standing then derive as for any extra; a SEQUEL keeps its bucket; an unstaged or
    duration-less ONA keeps the series-shaped route (fail closed); a disposition ruling beats the route. THE BOUND CAME FROM THE
    CENSUS, not the ruling: Cursor's 'TV_SHORT, or an ONA ≤ 5 min' would have routed Bungo Stray Dogs WAN! (TV_SHORT, 12 minutes,
    its own manga — a real run) — the format alone is no signal, the length is. THE GATE: lib/discovery.ts#isShortForm +
    SHORT_FORM_MAX_MINUTES (5, inclusive — Haruhi-chan and Kagaijugyou-hen sit on it) read by bucketOf, which every consumer shares
    (the recap, the census, the ledger writer — P2); MediaLike / Candidate carry `duration` from staging (relation nodes carry
    none); 11 unit tests (the witnesses, WAN!, Desert Pasta, the null-duration fail-closed, the SEQUEL carve-out, a 3-min TV
    entry is not the shape). THE OUTCOME CLASS: related_work_short_unlisted (violation) — a staged short the route sends to the
    ledger with no row of any origin; its first run read 4, all PV / CM shorts the promo rule never rows (I45) — the class now
    excludes the promo proposal, 0. THE APPLY: sync-related-works 66 inserted / 0 removed (68 candidates, two carry two owners
    — Nisekoimonogatari, Puella Magi Sonico Magica), the second dry run 0. MY PREDICTION HAD SAID 11: the census prints at most 60
    lines per class and the scratch read the printed lines — count from the class header, never the listing (a trap, noted
    here). CENSUS (vs §12.150, every delta explained — P17): UI-truth IDENTICAL in every class (the new rows take kind 'special'
    from extraKind; 220 verified, 0 failing); discovery: halo_series_unclaimed 162 → 94 (the 68 routed); ledger rows 736 → 802,
    listed 816 → 884; extra_same_instrument 127 → 136, other_instrument 33 → 36, unknown 269 → 310, original 156 → 165,
    alternative 70 → 72 (the routed shorts by derived bucket: most carry no ADAPTATION edge — 'unknown', the sitting's), promo
    7 → 11 (four PV / CM shorts the route reached and the promo rule refused); related_work_unruled 371 → 428 (the pending
    ones); related_work_cluster_disorder 44 → 52 (date-order seats behind existing rows — listings); related_work_short_unlisted
    0; related_work_identity_conflict 0 → 1 — SEAN'S: AniList gives ONE MAL id (59832) to two different one-minute Annecy
    Festival 60th Anniversary shorts (One Piece 143293 → one-piece @978.5, Dragon Ball 147996 → dragon-ball-super @131.53); the
    registry holds the MAL id for the first and refused the second (I46: a mix-up is refused, ruled by Sean) — the fork: an I46
    clause 'a MAL id AniList assigns to two distinct works registers to neither (the anilist id is the identity)' (a gate
    amendment, the general fix) or a per-row MAL repair; every other violation class 0. THE TEN C1 / C2 SHORTS RULINGS STAY as
    bucket DECLARATIONS (the shorts carry no ADAPTATION edge — the derivation reads 'unknown'); their retiresWhen now names the
    real condition (the extras programme researches the short) and credits I48 with the routing. LEDGER: I48 (I family, witnesses
    frieren / re-zero / tanya / apothecary / bungo-stray-dogs; auditClass related_work_short_unlisted); census-kinds marks the
    class a violation; one-hop case added; the discover-skill trap now cites I48. Edges rebuilt + deployed ×5; 295 tests; lint
    437 (baseline); system census green.
150. ✅ **CONSOLIDATE (standard) after C2 + the Pasta seat (2026-09-07; Sean: 'if a deep makes sense do it first').** STEP 0: the
    deep trigger FIRED mechanically — all five lib files changed since the pre-C2 save point (4f651fe6) are ruling maps
    (discovery / franchises / override-chains / related-works / source-relations) that ledger records name as enforcement
    sites — and the diffs were READ: 248 lines of ruling ENTRIES, no gate code moved, no prior per-series decision invalidated
    (P21 is about gate code). Ruled standard, said so; the trigger's blind spot captured in the consolidate skill (read the
    diff before declaring deep — entries are rulings, not a gate change). System census green at entry. STEP 1: no new writer;
    the two writers that produced owed work this cycle are limitations, not bypasses — the related-works date seat is a
    proposal by design (now stated in I45), the wiki lock's franchise-numbering miss is queued engineering (§12.148).
    STEP 2: edges rebuilt + deployed ×5 (the ledger is lib). STEP 3: no parser change. STEP 4: heal ran to zero — one stuck
    AFL run (afl#1265, 2026-09-06) marked killed. STEP 5 CENSUS (vs §12.148 / §12.149): EVERY class identical — series_staged
    35, title_incomplete 25, type_default_unclassified 82, fractional_unmodeled 5, pending_airing_no_anchor 4, frontier_tail_null
    12, asterisk_unreviewed 178, permanence_candidate 52; discovery halo_airing 44, halo_sequel_unclaimed 93, halo_series_
    unclaimed 162, discovery_new_since_sitting 2 (the Tennis pair), related_work_cluster_disorder 44; ruling_violation 0,
    every violation-kind class 0; 220 verified, 0 failing. Every standing non-zero class is one §12.147 / §12.148 named and
    queued (integrity_total_beyond_eps 10 AFL-lag rows, anchor_without_row 8 + annotation_without_row 3 the Tennis / gits
    rowless tails, watch_order_kind_missing 3, format_missing 2 / episode_without_component 2 fist-of-the-blue-sky + conan
    1212, the mu_* listings). STEP 6 LEDGER: I45 AMENDED (2026-09-07, amendedOn stamped) — POSITION IS WATCH ORDER, air_date
    IS RELEASE, two keys never a third; .5 is the FIRST seat in watch order in a gap then .51 / .52, never the earlier release,
    never a .49; the writer's air-date seat is a proposal and a sourced watch slot beats it through a position ruling on the
    pair (planRuledMoves); chronology is information on the row, never a sort (a story_position is the deferred shape); a
    sitting reads the owner's existing ledger notes before accepting a derived seat — witnesses + aliases added; no clause
    replaced (retiredPhrases unchanged). docs/rules.md regenerated. STEP 7: tsc / lint 0 errors / 294 tests / build green.
    CAPTURE HOMES this cycle: I45 (the sentence), the discover skill (six C2 traps + the Pasta correction), the consolidate
    skill (the deep-trigger note), STATE (the chronology sidecar, the owed list). QUEUED BY NAME, next: the SHORTS GATE as an
    /add-rule (ten I13 rulings carry its retiresWhen — the first mechanical retirement of a whole cluster); the wiki lock's
    family-offset carry (Ace act II 53-65, re-zero 51-79, gits-2026); the AniList catch-up + restage when the API answers.
149. ✅ **THE PASTA SEAT — position IS watch order (Sean 2026-09-07 with Cursor, the C2 follow-up).** The C2 apply had parked
    Operation Desert Pasta (135866, a 17-minute original, first shown 2021-06-19) at 12.51 by its release date, AFTER the 2019
    film at 12.5 — release order on the watch-order key. The sourced order was already on file: the film's own wave-1 note
    (ruled 2026-09-05) says the short is the film's 前日譚; the verdict cites ja-WP's episode table (閑話 with 劇場版の前日譚
    between ep 12 and the 第2期 header) and Comic Natalie (「第1期と劇場版をつなぐストーリー」), and the verifier reproduced both,
    predicted the 12.51 outcome and named the missing mechanism (a ruled position on the pair). RULED: a related-works position
    ruling — Pasta 12.5 (a new I45 entry, standing filler by rule), the film 12.51 (its existing entry amended — the map refuses
    a second entry per work) — one apply through planRuledMoves: 2 removed / 2 inserted, identities kept every field, the
    second dry run 0; every related_work_* violation 0; cluster_disorder 44 unchanged (a ruled pair is not disorder). THE
    PRINCIPLE, stated for the next consolidate's I45 / N31 sentence: two keys, never three — `air_date` is release (a fact,
    never rewritten), `position` / episode `number` is watch order ('where do I go next'); in a gap `.5` is the FIRST seat in
    watch order, then `.51`, `.52` — never the earlier release; the writer's date-derived seat is a proposal; a sourced watch
    slot beats release (Made in Abyss 13.5 / .51 / .52, Kinnikuman's licensor settings, now Pasta); a `.49` is never written.
    Chronology (the in-story timeline) is INFORMATION ON THE ROW, not a sort: where it splits from watch order it splits one
    way (a work set earlier, made to be seen later — Kizumonogatari, Fate/Zero, No Regrets) and `position` carries the viewing
    order; a `story_position` beside `position` is the right SHAPE if a franchise page ever needs a chronological sort and the
    wrong thing to add now (empty on almost every series, its own sourced rulings for a handful of IPs) — a STATE sidecar for
    the franchise UI pass. The UI wish it serves: default sort by release, a toggle to watch order, filters on kind (T29) and
    standing (T27) — two sorts and filters on rows that exist (N31 surfacing parked), no third key, no skippable flag.
    CAPTURED: the discover-skill trap corrected (read the owner's existing ledger notes before accepting a derived seat; the
    tool is a related-works position ruling, never N7 — N7 is a source numbering a work INTO the run); §12.148's and STATE's
    'N7' wording fixed. Edges rebuilt + deployed ×5; 294 tests.
148. ✅ **C2 — THE SECOND AIRING /discover SITTING (Sean ruled 2026-09-07 with Cursor: 'C2 as proposed, with four flips').**
    The recap (recap.ts --scope sequel,series --airing: 57 candidates over 54 owners) was derived from disk — AniList's API
    was still 403, so the halo could not be restaged (the last staging: the weekly refresh-discovery of 2026-09-06 10:30 UTC).
    THE SIZING RULE: only rows dated inside the coming cour join now (the standing practice — an announced season joins when
    dated / airs, Kingdom S6 Part 2 via retiresWhen); the 2027 and undated rows wait for C3. RULED AND APPLIED — eight I27
    RULED EXTENSIONS: the-apothecary-diaries S3 (195516, 2026-10-02; S3 Part 2 200927 on retiresWhen — Cursor's flip 1: the
    precedent is wait, never include-now), blue-box S2 (189123), aoashi S2 (191788, 24 eps), ranma1-2-2024 S3 (209872),
    black-clover S2 (195604, October), ace-diamond-act-ii — act II Second Season (177634, 13 eps, 2026-04 → 06, an AIRED HOLE the
    catalog had missed, our 53-65) THEN Second Season Part 2 (213658) in one extension, tougen-anki — Nikko Kegon Falls Arc
    (204650) as a COMPONENT (Cursor's flip 2: an arc-titled continuation on the same manga with the same staff; the recap had
    read it ambiguous — the precedent for Golden Kamuy's and Kaiju No. 8's arc-titled final seasons), and JoJo's I24 entry
    amended — Steel Ball Run 1st STAGE (190327, ONA, 1 ep, aired 2026-03-19, our 191) THEN 2nd - 3rd STAGE (210482, 11 eps
    from 2026-09-25) as parts 8-9 under the declared open-ended I15, the stray Monogatari sentence removed from its reason.
    Every extended series flips to 'upcoming' (chain.ts). TWO SERIES minted STAGED (P39): magic-knight-rayearth-2026 (178868,
    TV, 2026-10-07, E&H production / TMS) — alternative to the 1994 base, a NEW 'magic-knight-rayearth' franchise with the
    1994 series ruled base; toaru-anbu-no-item (186742, TV, 2026-10-09 JST, J.C.Staff) — spin_off of Index in the Toaru
    franchise, the novel-owner shape (its LN 159459 is the instrument; a manga 162615 exists, listed ALTERNATIVE), the slug per
    I1 (Cursor's flip 3: English else romaji, never a synonym). The seed dry run read Rayearth's 'manga none': AniList labels
    the CLAMP manga (30119) ALTERNATIVE, not ADAPTATION — settled by an I38 `mangaAnilistId` ruling in source-relations.ts
    (the No Regrets shape; I47: the tag routes, the edge is the fact), the plan then read manga 30119. TEN related_work
    rulings (bucket original): the nine chibi shorts — Re:Zero Break Time S1-S4 (21780, 120700, 182417, 210687) + Re:PETIT
    (21891), Youjo Shenki (98186) + Youjo Shenki 2 (213961), Maomao no Hitorigoto S1-S2 (170508, 186148) — proposed `series`
    only because ONA / TV_SHORT is TV-shaped (the Frieren precedent, four owners now: THE SHORTS GATE is queued as an
    /add-rule — format TV_SHORT, or an ONA of at most five minutes, on a SPIN_OFF / SIDE_STORY edge → the extras bucket; each
    ruling's retiresWhen names it); Operation Desert Pasta (135866, ONA, ONE 17-minute original) is NOT that shape (Cursor's
    flip 4) — its own extra of Tanya, the writer derived @12.51 from its 2021 release (after the film's 12.5 — corrected the same morning by a
    related-works position ruling, §12.149). Three ruled shorts are unstaged (182417, 210687, 213961) — their rows land when
    the halo restages. DEFERRED, named: every 2027 / undated row (Dandadan S3, Frieren S3, Delicious in Dungeon S2, Shangri-La
    S3, Sakamoto Days S2, KonoSuba 4, Shield Hero S5, Oshi no Ko Final, THE ONE PIECE 2027-02 — an alternative like GitS 2026,
    a C3 series mint when firm — Gundam, Evangelion, NARUTO 2026, the rest); DIGIMON BEATBREAK stays deferred to B; the two
    New Prince of Tennis works (165810, 123476) to their owner-scoped sitting. THE WRITERS: seed 2 CREATE / 0 HELD; stitch
    --only per key 8 EXTENDED (Ace 65 eps vs AFL 52; JoJo 191 vs AFL 190; the six unaired seasons add 0 rows); sync-related-
    works 7 inserted (the heal's second pass then updated 3), 0 removed; the wiki writer (G59 A, no dry run — the C1 precedent)
    created JoJo's row 191 from the 'Steel Ball Run' page (continuity-locked — the JoJo wiki numbers OVERALL) and created
    NOTHING for Ace act II: 'Ace of Diamond Act II season 2' numbers 179-191 in the FRANCHISE space while our act II tops at 52,
    so the continuity lock (pmin === top + 1) fails and the sibling page's proven offset (-126) does not carry across pages —
    rows 53-65 OWED (the re-zero S3 / S4 class; the general fix is a family-offset carry in the lock, queued as engineering — a
    ruled page key alone would not lock it). heal: franchise_id asserted on magic-knight-rayearth; relations 182 → 186 (the
    rayearth alternative pair; ITEM spin_off + parent); heal-format 1 (row 191); afg#1250 marked killed. Edges rebuilt +
    deployed ×5; 294 tests; system census green (rulings.md regenerated: 2783 rulings, 119 with a retire condition).
    CENSUS (vs §12.147, every delta explained — P17): series_staged 33 → 35 (the two mints); title_incomplete 24 → 25
    (ace-of-the-diamond-act-ii: 13 aired eps with no rows — the owed 53-65); type_default_unclassified 81 → 82 (JoJo's wiki-
    minted 191); fractional_unmodeled 2 → 5 (the JoJo page's 126.5 'The Beginning of Golden Wind', 134.5 'Determination', 141.5
    'Destiny' — Sean's review class, with Tanya's two); pending_airing_no_anchor 3 → 4 (jojos-bizarre-adventure: an aired tail
    row with no anchor, now 'upcoming'); pending_no_canon lists the two mints (no rows yet); frontier_tail_null 12, asterisk_
    unreviewed 178, permanence_candidate 52 unchanged; ruling_violation 0; every violation-kind class 0; 220 series verified,
    0 failing. DISCOVERY: halo_sequel_unclaimed 103 → 93 (the ten season ids); halo_series_unclaimed 174 → 162 (two series +
    ten related_work rulings); halo_airing 56 → 44; extra_original 146 → 156 (the ten rulings); extra_unstaged 1 → 2 (the
    Apothecary film 'Bouhi no Hihou' 200929, an OTHER edge of the newly owned S3 — the apply's own ownership widens the halo,
    the C1 trap); discovery_new_since_sitting 5 → 2 (the Tennis pair); discovery_ruled_unbuilt 2 → 0; series_relation_missing
    0; anilist_resolve_debt 0; related works listed 814 → 816 (the mints' own halos). CAPTURED: six traps in the discover
    skill (the ALTERNATIVE-labelled manga; the franchise-numbered sub-page lock; the wait precedent; the arc-titled
    continuation; the I1 slug; the shorts gate); the sitting logged in SITTINGS (2026-09-07T01:32:04Z).
147. ✅ **CONSOLIDATE DEEP after §12.146 (2026-09-06; P21 — enforcement sites changed: G58, G52, G60, I13, I27, I42, I45,
    T31).** THE WRITER SWEEP found one real churn: the AFG / continua anchor writers left `volume` NULL and heal-anchor-volumes
    re-filled 1385 rows in a day (one-piece's 1029 alone) after every AFG refresh — every anchor writer now derives the volume
    at write through the one derivation (lib/anchors.ts#volumeAtWrite → lib/volumes.ts#volumeForChapter; V11 amended); the
    healer converges. THE HELD HEALERS ran with the roster: heal-anchor-volumes (the one-time 1385) and sync-watch-order (safe
    — the No Regrets namesake fractional 13.5 'Since That Day', my own pre-fix wiki write, deleted from staging; the finder
    now refuses namesake pages by air-date votes). STALE CLEANUP (P24): the three PoT chain rulings (995 / 2752 / 4053 under
    the-prince-of-tennis) pointed at rows the Tennis sitting retired — retired, their facts are that series' 26 anchors from
    the same verdicts; a census class for the shape, related_work_ruling_orphan (0); the STATE sidecar 'candidate media are
    never re-fetched' corrected (they are); apply-tennis-anchors.ts moved to history/ (P34). THE retiresWhen WORKLIST walked
    (23 conditions): none met mechanically except DIGIMON BEATBREAK's ('phase B lands' — it did; re-ruled at B's first
    sitting); Shield Hero S5 is 2027 undated; Kingdom Zoku-hen and Golden Kamuy's finale undated; re-zero's AFL page still
    stops at 50; the three no-AFL owners still have no AFL page. THE AMENDED-RULE READ-LIST (P23): the rulings citing G52 /
    G58 / G60 / I13 / I27 / I42 / I45 / P39 / T26 / T31 re-read — no reason encodes a retired clause (ledger-check green on
    every retiredPhrase). CAPTURES ROUTED (P29): research-agent traps (an interview's own publish date; the wiki API's 50-item
    cap; the licensor-quote grep; a comicalization is downstream; a bundle is one row; read the stored row whole);
    verdict-verifier (the grep test; a ruling must LAND — adopted rows, clusters, in-place edits; the context prints less than
    the row holds); research-batch (stagger the verifiers, recover from disk, the AniList-outage clause); discover (--only per
    key, the no-AFL owner keyed by series id, the finder's component lock, the mint's hangers-on, the apply's own staging);
    apply-batch (adopted rows, one-package clusters, in-place edits, the parallel-owner shape, the recap flag); the validator
    (a parallel-owner clause warns instead of refusing; null chapter fields proposed; a CLUSTER marker on a conditional
    seat); I45 amended (rulings apply to adopted rows; the orphan class), I27 amended (the no-AFL owner keyed by series id);
    architecture.md §4b (the airing lanes and the source partition). NOT DONE HERE, by design: the catalog-wide re-evaluation
    of old rulings under every live rule (the lock pass, an amendedOn-vs-ruledOn worklist); Sean's queues untouched
    (permanence_candidate 52, asterisk_unreviewed 178 incl. the Tennis annotation, Tanya's two fractionals, the Berserk
    count_mismatch flag); the open-flag backlog (count_mismatch 210 · match_ambiguous 90 · parse_integrity 31 ·
    taxonomy_conflict 26 · large_diff 2, oldest 2026-08-22) is Sean's triage class, listed, not farmed. CENSUS (vs the post-wave-6 capture, every delta explained — P17): fractional_unmodeled 3 → 2 (the No Regrets namesake
    fractional deleted from staging; Tanya's two remain — Sean's); run_stuck 1 → 0 (heal-stuck-runs marked afg#1227 killed);
    related_work_ruling_orphan 0 (new); anchor_volume_mismatch 0 and heal-anchor-volumes --dry-run 0 after the roster (1379
    re-derived once; the writer fix proves itself at the next AFG refresh); ruling_violation 0; every violation-kind class 0;
    220 series verified, 0 failing; 294 tests. THE ROSTER: heal-source-kinds 0 changed · scopes / continua / coverage as before
    · heal-boundaries 0 · heal-anchor-volumes 1379 (once) · parity 0 · wiki --ruled 0 targets · mint-grids 0 · assert-overrides
    0 asserted everywhere (393 standing annotations, 821 T6 rows, 199 dates, 139 memberships — all current) · sync-watch-order
    39 synced, 0 dropped (the namesake row NOT re-added) · sync-related-works 1 routine update · relations 182 rows (28 ruled
    pairs) · cleanup-flags 1 duplicate dismissed, 359 open (Sean's triage class: count_mismatch 210 · match_ambiguous 90 ·
    parse_integrity 31 · taxonomy_conflict 26 · large_diff 2) · heal-structure 0 · heal-format 0 (the 5 null formats are
    fist-of-the-blue-sky 23-26 and detective-conan 1212 — rows no component covers, N7 kind components owed). THE STANDING
    NON-ZERO CLASSES, read whole and each queued by name (unchanged this pass): integrity_eps_beyond_total 1
    (fist-of-the-blue-sky 26 vs 22), integrity_total_beyond_eps 10 (yu-gi-oh-zexal, fish-man island saga, digimon-adventure,
    the-prince-of-tennis 178 vs 177, cells-at-work, hayate, to-love-ru, durarara, bokuben, arslan — AFL lag / row-less
    series), anchor_gap_research 3 (ranma 31-87, trigun-stampede 1-18, shy 1-23 — the research work-list),
    start/end_sliver_mismatch 1/1 (tokyo-mew-mew 38, one-piece 195 — Sean signs), anchor_beyond_display_total 2 (soul-eater-not
    ep 12 → ch 42 / continue 43 vs the display total 41 — a count-space value, N22 / N23: convert at the next batch, never
    left silent), mu_pin_unverified 1 (trigun-stampede), anchor_without_row 8 and annotation_without_row 3 (the row-less
    entries by ruling A42 — fish-man island saga, to-love-ru, bokuben, cells-at-work — plus one-piece's AFG anchor at 1176 past
    aired 1175), afl_anime_canon_unruled 1 (assassination-classroom), format_missing 2 / episode_without_component 2 (the
    same five rows), watch_order_kind_missing 3, mixed_fragment_only 3 (naruto ×6 rows, chrono-crusade 21, tokyo-mew-mew 21 —
    T28 sole-adaptation checks), unverified_share 3 (one-piece 214 / 216 / 319), type_source_disagreement 1 (weak, parked),
    correspondence_incomplete 1 (dragon-ball-super's 66 rows — Sean's row-by-row pass), pending_no_canon 2 (excel-saga,
    dragon-ball-gt), pending_airing_no_anchor 3 (the C1 seasons + gits-2026), frontier_tail_null 12, title_incomplete 24,
    airdate_incomplete 23, asterisk_unreviewed 178, permanence_candidate 52, series_staged 33, type_default_unclassified 81,
    no_source 39 / no_instrument 13 (T31's full members), the halo / extras listings and the queues (halo_airing 56,
    seed_airing 209, related_work_unruled 371, seed_candidate 528).

146. ✅ **EXTRAS WAVE 6 APPLIED (Sean ruled 2026-09-06 with Cursor: all eleven as recommended — DBS Resurrection 'F' canon
    at 14.5, the DBZ 288.5x cluster as one package, Blue Exorcist pinned, no Kai row for Yo! Son Goku).** Seven works + the
    narrow Dragon Ball slot ask (Golden Age Arc III dropped: the Memorial Edition is a series and berserk-golden-age-arc an
    I11 exclusion awaiting the watch-order pass), all verified SOUND WITH NOTES on the values — the wave survived a
    SESSION-LIMIT KILL mid-flight (the account switched; every verdict and report was recovered from disk, the Dragon Ball
    research and all six verifiers re-dispatched staggered, P11 / P12). RULED: food-wars 98702 MIXED, ch 118-119 vol 15 (ep 2
    「遠月十傑」 entire — the TV run's hole between ep 37 → 117 and ep 38 → 120; ep 1 the licensor's original) @37.5, airDate
    2017-05-02 (the verifier found the repair the author declined) · bungo-stray-dogs 21791 CANON, ch 40 vol 10 in full (the
    run's sole adaptation; S3 reorders around it), 24.5 kept — the row is WIKI-origin and the verifier found the ruling
    would land nowhere: sync-related-works now applies a ruling's FACTS to adopted rows (standing, chapters, note, repairs;
    never the position) and the census covers them — related_work_unruled gained the 11 adopted rows with no standing
    (c9420183) · danmachi 21660 FILLER (the licensor's 完全監修 line grep-verified in four places; Ōmori twice), the 13.5 entry
    edited IN PLACE (a replaced entry would have dropped the cluster ruling) · kaguya-sama 194884 CANON, END 267 vol 27, the
    string a SELECTION (163, 170, 191, 218-221, 266-267; 162 a flashback sliver, never coverage; 268 refuted) @41.5 — the
    author died seconds after writing, the verifier read the file cold · fruits-basket-2019 136192 CANON, ch 90-93 vol 16
    (the Kyoko / Katsuya story, the last hour; the 30-min clip show weightless under T28's recap clause, in the string, recap
    false on the row) @63.5 · blue-exorcist 11737 FILLER (a film-original story; the vol-6 番外編 「幽霊列車」 restaged as the
    opening, a sliver; Kato's drawn tie-in art dismissed on T26's source-line test) @25.5 PINNED (the 2011 OVA beside it is a
    mis-dated ~11.5, its own ruling later) · one-punch-man 108945 FILLER (six originals, the licensor's line six for six; the
    member windows corrected by the verifier, #04 17.5-19.5 / #05 9.5+; the position's basis written as the protocol's form,
    never a convention) @24.5 · Resurrection 'F' 20778: DBZ FILLER @288.52, Kai FILLER @165.51, DBS CANON @14.5 with chapter
    NULL and a 'no correspondence' string (the manga skipped the arc — ja-WP 漫画：未登場, Kanzenshuu, the wiki; the ruled
    parallel model I40 / T30 — the verifier REFUTED filler: rows 18-27 are canon on Sean's own adopted{author}; 'keep 16-17
    if you take the film'; no adopted record on the film — that act is on the rows) · Yo! Son Goku 5152 FILLER @288.5, the
    first seat (Age 776 / 2008; the 2009 manga a comicalization, disposed — never a mint; no Kai row, the halo cannot keep
    one) · Battle of Gods 14837 RE-SEATED DBZ 288.5 → 288.51 in the same map (the cluster Yo! → BoG → RoF in story and
    release order — one package: planRuledMoves refuses a half-applied cluster). The ledger writer: 5 inserted, 7 updated, 5
    moved, 0 refusals, idempotent after; audit: every related_work_* violation 0, related_work_unruled 379 → 371,
    related_work_cluster_disorder 45 → 44 (Blue Exorcist pinned). Also landed: the DBS arc note's stale '(filler)' for the
    bridges 16-17 (T6 mixed pins) corrected in arcs.ts; extras-context.ts prints the stored row's air_date (the Food Wars
    verifier — the second sighting after Noragami). Edges rebuilt + deployed ×5; generated docs; ledger-check + system-census
    green. QUEUED (never silent): a parallel-owner clause in validate-extras (canon with no chapters on a parallel owner) and
    explicit null chapter fields from the proposer; the --entries proposer printing cluster-conditional seats
    unconditionally; Kaguya ep 40 / 41's partial vs rearranged (the film's END 160 sits on ep 40); the Kaguya special's MAL
    id 61903 unregistered; Blue Exorcist's 2011 OVA 11266 (mis-dated 2011-10-26 → its slot ~11.5, ja-WP 第11.5話); the Fruits
    Basket 'prelude - Special Comics' node unverified; two research traps — date an interview by the page's own datePublished,
    never the ja-WP citation date; the wiki category API's 50-item cap silently truncates a coverage dump; Tanya's two
    fractionals and the Berserk count_mismatch flag stay Sean's. Usage: eight research agents + eight verifiers ≈ 4.2M
    tokens across two accounts, plus the runs the limit killed (Opus research ≈ 1.9M, Fable verification ≈ 2.3M).
    CENSUS (vs the post-C1 capture, every delta explained — P17): the UI-truth classes are UNCHANGED (the apply
    touched only the related-works ledger; 220 series verified, 0 failing; ruling_violation 0); discovery:
    related_work_unruled 368 → 379 → 371 (+11 the adopted rows with an AniList id and no standing now on the work-list;
    −8 the seven pending works ruled + Yo! Son Goku), related_work_cluster_disorder 45 → 44 (the Blue Exorcist 25.5x
    cluster pinned), every violation-kind class 0, anilist_resolve_debt 0; 294 tests.

145. ✅ **PHASE B — THE NO-INSTRUMENT SHAPE, THE NEW-IP PATH, THE SOURCE PARTITION (T31 new; G52 + G60 amended; Sean's plan
    2026-09-06 with Cursor).** THE RECORD (T31): a series whose source has no instrument to map — a studio original, a
    visual novel, a game, any AniList source outside the manga and novel families — is a full catalog member: source_type
    as AniList states it (T25), rows typed as the story's own, NO chapter strip (the card's honest dash; the studio-original
    label is the UI pass's), and it PUBLISHES ONLY BY AN EXPLICIT RULING (P39 — the eight-grid lesson). THE SEED QUEUE
    keeps every no-instrument title its lists return and MARKS it ('NO INSTRUMENT (T31 …)' in the queue line) — the
    `source === 'ORIGINAL'` skip is gone: twelve such titles surfaced from the existing snapshots at once (Cyberpunk:
    Edgerunners via trending; Sparks of Tomorrow and four other airing 'OTHER'-sourced ONA), seed_candidate 525 → 528.
    THE LISTS are now a PARTITION of AniList's MediaSource enum — MANGA (the mapping census, untouched: 2 / 2 / 10 pages),
    NOVEL (untouched: 1 / 1 / 4) and OTHER = the exact complement (ORIGINAL, VISUAL_NOVEL, VIDEO_GAME, GAME, OTHER,
    DOUJINSHI, COMIC, ANIME, LIVE_ACTION, MULTIMEDIA_PROJECT, PICTURE_BOOK): airing-other / upcoming-other (2 pages each)
    / popular-other (4) — eleven lists, ~36 requests a week; the test asserts the families are disjoint and exhaustive
    against MEDIA_SOURCE_ENUM (re-verify at the first other snapshot); never a general top 500, never originals-only
    (Cursor: an unscoped airing list is no longer a census). THE NEW-IP PATH: the seed writer's relation gate is now a
    pure, tested function (lib/rulings/discovery.ts#seedRelationHold): an explicit `newIp: true` declaration passes with
    no relation and franchise null; a newIp WITH a relation or a franchise is refused (fail closed); a series with
    neither declaration is held and the hold names newIp as the way in; `restoration` is never reused — before this,
    planSeed refused every series with no relation, so the seed engine's own 'new IP, series' proposals could never mint.
    G52 amended (retiredPhrases 'Anime-original holds have no manga side and are deferred'), G60 amended (the eleven-list
    partition; retiredPhrases the eight-list clause). THE FIRST OTHER SNAPSHOT waits on AniList (the API is still disabled
    site-wide): Sunday's refresh-discovery cron takes it automatically (LISTS is in the deployed bundle), or
    `discovery-stage.ts --rankings` by hand when the API answers; B's first new-IP sitting waits on that snapshot (never
    sit an empty queue). No catalog data moved; audit: every violation class 0; anilist_resolve_debt 0; 294 tests;
    edges rebuilt + deployed ×5; ledger-check + system-census green.

144. ✅ **C1 — THE FIRST AIRING /discover SITTING (Sean ruled 2026-09-06 with Cursor: 'C1 as proposed, except Frieren shorts').**
    The airing candidates of held series (halo_airing, RELEASING first — the recap generated by recap.ts --scope
    sequel,series --airing; the halo could not be restaged because AniList's API was disabled site-wide, and all eight
    were already staged). RULED AND APPLIED: five season ordinals as I27 RULED EXTENSIONS — re-zero gains S3 (163134,
    16 eps, 2024-25) THEN S4 (189046, airing since 2026-04-08) in one extension ('never S4 over an S3 hole' — Cursor):
    5 seasons, 79 aired of 85; Saga of Tanya the Evil S2 (135865): 2 seasons, the 2019 film stays the ledger's extra
    between them (never a component); You and I Are Polar Opposites S2 (210031), Welcome to Demon School! Iruma-kun
    S4 (184492) and 100 Girlfriends S3 (200637) — three owners with NO AFL page, which the stitcher could not extend
    until today: stitch.ts now takes a RULED extension keyed by the SERIES ID when the owner has no AFL page (the
    chain is the ruling, nothing of AFL's merges, the rows come from the wiki writer / AFG; the walked path keeps
    its guards; the map's key doc amended). THE GHOST IN THE SHELL (177699, Science SARU, 10 eps, 2026-07-07 →
    09-08) minted as `ghost-in-the-shell-2026` — a SERIES alternative to the franchise base (Stand Alone Complex),
    the same manga 31023, never a component (the 1995 film's shape): seed.ts → 1 component, 9 aired, STAGED (P39);
    relations.ts wrote the alternative pair; the franchise membership ruled with the seed. The Frieren ●● no Mahou
    comedy shorts (three ONA parts, source ORIGINAL: 170068, 189513, 206425) — proposed `series` only because ONA is
    TV-shaped in the halo — ruled EXTRAS of Frieren by disposition `related_work` (Cursor's correction: the work is
    I13; revisited with the extras programme, never phase B): lib/discovery.ts now lets a related_work RULING beat
    the format (bucket → extra) and a ruling's declared bucket beat the derivation (Part 1 had read 'unknown'; the
    Sailor Moon S film's row, ruled same_instrument in the picks pass, took its ruled bucket too) — three ledger
    rows at 5.5 / 28.5 / 29.5, filler by rule (original); one unit test. DIGIMON BEATBREAK (188388, TV, airing since
    2025-10-05, source ORIGINAL) DEFERRED — the relation exists and the writer would take it; the wait is phase B's
    no-instrument shape, never the gate. THE ROWS: the wiki writer (G59 A, event trigger = a ruled extension)
    created 47 rows — Tanya 9, Iruma-kun 20, 100 Girlfriends 9 (its 'season 3' page component-locked on overall
    numbering), Polar Opposites 9 (a 'List of Ghosts (American TV series)' namesake was refused, offset unprovable)
    — and could lock NO page for re-zero (S3 / S4 rows 51-79 are OWED: the page's season tables against components
    labelled without a season ordinal — a RULED page key, G59 B, is the next step) nor for ghost-in-the-shell-2026
    (the Arise list page REJECTED as a namesake — air dates belong to another show; its rows wait for a list page,
    AFL / AFG adoption, or a ruled key); heal-format set the 47 formats. AUDIT: discovery_ruled_unbuilt 0;
    halo_airing 62 → 56 (the eight left; two NEW ONA spin-offs appeared behind the newly owned seasons — Re:ZERO
    Break Time S4 210687 and Youjo Shenki 2 213961, the Frieren-shorts shape for the next sitting);
    halo_sequel_unclaimed 109 → 103 (the five + re-zero S3); halo_series_unclaimed 176 → 174 (four ruled, two new);
    extra_original 143 → 146 (the shorts); related_work_unruled 368 (filler by rule needs no standing); every
    violation class 0; anilist_resolve_debt 0. The stitcher's dry run also listed a PRE-EXISTING Berserk Golden Age
    count_mismatch flag (1 season, 13 vs AFL 6) — applied with --only so it stays Sean's triage. Edges rebuilt +
    deployed ×5; 289 tests; the stale next-episode pointers on the extended series (staging from Sep 5 / 6) correct
    themselves on the first daily refresh after AniList returns (the phase A queue puts them first).
    CENSUS (vs the post-Tennis capture, every delta explained — P17): series_staged 32 → 33
    (ghost-in-the-shell-2026); pending_finished_no_totals 45 → 43 (Polar Opposites and 100 Girlfriends are airing
    now); pending_airing_no_anchor 0 → 3 (gits-2026, re-zero, Tanya — airing tails with no AFG / MU anchor yet, the
    standing shape); frontier_tail_null 9 → 12 (the new season rows of 100 Girlfriends, Iruma-kun and Polar
    Opposites render null past their last anchor — honest, P6); title_incomplete 22 → 24 (gits-2026's 9 aired eps
    with no rows; re-zero's 29 aired eps with no rows; Iruma-kun's 9 wiki rows without titles); fractional_unmodeled
    1 → 3 (Tanya's wiki page lists 6.5 'War Report' and 12.5 'Operation Desert Pasta' — Sean's review class: the
    film is already the ledger's ruled extra, the 6.5 is a recap special); type_default_unclassified 78 → 81 (the
    wiki-minted seasons owe their typing); discovery: halo_sequel_unclaimed 109 → 103, halo_series_unclaimed 176 →
    174, halo_airing 62 → 56, extra_original 143 → 146, extra_same_instrument 126 → 127 / other 34 → 33 (the Sailor
    Moon S film's ruled bucket), extra_crossover 86 → 87 (Dominion, a CHARACTER crossover reached via the new
    series), discovery_new_since_sitting 10 → 5 (Re:ZERO Break Time S3 + S4, Youjo Shenki 2 and two more — hop-1
    relations the walk found only once the seasons were owned: the next sitting's extras-shaped items),
    seed_candidate 525 → 523 and seed_airing 207 → 205 (the two ONA spin-offs moved from the seed queue into the
    halo); ruling_violation 0; every violation-kind class 0; 220 series verified, 0 failing.

143. ✅ **PHASE A — THE AIRING WRITER FIX (G58 amended; Sean's go 2026-09-06, 'plan as saved, start A').**
    THE DIAGNOSIS (measured 2026-09-06 with Cursor): airing is captured in STAGING (the weekly lists + the halo)
    but the catalog holds 5 airing + 3 upcoming of 372 — AniFiller seeded finished shows and no /discover sitting
    has minted the TV-shaped halo (285 unruled, 62 airing / announced) — and three defects hit OWNED airing
    series: (1) anilist-restage refetched + staged WITHOUT resolving while the daily gate compared fresh data
    with STAGING's hash, so a change between a series' last resolve and a restage was swallowed until the next
    flip — one-piece's row read aired 1175 / next 2026-08-30 while its staging said ep 1177 on 09-06
    (changed_at = the Sep 3 restage; a finished series would never self-correct); (2) the queue sorted
    'stalest-first' by series.updated_at, which the healers bump daily, so airing series looked fresh and went
    LAST; (3) the Sep 5 query-shape change (relation-node startDate for G60, 44a5873e) flipped every structural
    hash and the restage event healer was not run — the 09-06 daily run saw 367 changed, resolved 40, deferred
    327 (Bleach's 09-05 episode uncounted); and (4) 53 seeded series with no AFL page and one component were
    skipped by the loop outright (`else if (slug)`). THE FIX, one lib loop: migration 20260906230000 adds
    ingest_anilist_media.resolved_hash + resolved_at — stamped ONLY by the resolvers for the media they read
    (lib/resolve.ts#stampResolved at resolveSeries' two success returns and refreshStitchedVolatile's end;
    aniListChanged deleted), baselined resolved_hash := content_hash; lib/anilist-refresh.ts#refreshAniList
    fetches everything, decides against resolved_hash (never staging), stages every payload, resolves AIRING /
    UPCOMING first then the oldest resolve (resolveOrder — never updated_at) under optional budgets;
    resolveInputsOf names exactly what each resolver reads (an AFL series its head; a stitched or seeded series
    its ranged components — the 53 skipped series now take the volatile refresh); the edge is a thin caller
    (40 / 110 s; a manual call may pass resolveBudget) and scripts/ingest/refresh-anilist.ts the local form
    (--dry-run, --all = the catch-up, --budget; PULL roster, event); anilist-restage's note now says 'then run
    refresh-anilist.ts the same day'. CLASSES: anilist_resolve_debt (violation — a resolve input whose
    content_hash ≠ resolved_hash for more than a day; 0 at landing), halo_airing (queue — the 62 airing /
    announced TV-shaped candidates of held series, airing first: Re:ZERO S4, Tanya S2, Iruma S4, 100 Girlfriends
    S3…), seed_airing (queue — the airing / upcoming lists' unowned rows in list order, 207). Ledger: G58 amended
    (the gate, the order, the debt, the two callers; retiredPhrases 'leaves what it could not reach UNSTAGED so
    it leads the next run'); 7 unit tests (288 total); tsc / lint / build / ledger-check / system-census green;
    edges rebuilt + deployed ×5. THE CATCH-UP (refresh-anilist.ts --all) COULD NOT RUN: AniList's API is
    disabled site-wide ('temporarily disabled due to severe stability issues' — 403 on every scripted call
    today; the edge got through at 08:10 UTC) — it runs the moment AniList answers (STATE carries it); until
    then the daily edge digests the debt airing-first at 40 a day whenever the API is up. No catalog data moved
    in this landing (the migration's baseline only); the classes read 0 / 62 / 207.

142. ✅ **THE TENNIS OWN-SERIES SITTING (Sean's go 2026-09-06, Cursor's numbering note: never TV 179-204).**
    The Prince of Tennis National Tournament chain (AniList 995 → 2752 → 4053, three OVA releases the sources number
    1-13 / 1-6 / 0-6 — never as TV 179-204, which no source prints; I42 (ii): the KEY is what the sources print, a
    component when they number it into the run (HxH 63-92), else an OWN SERIES with the sources' numbering — the
    Lost Canvas shape) minted from /discover as `the-prince-of-tennis-national-tournament`: seed.ts (the declaration
    anilist:995 disposition series, chain [995, 2752, 4053], relation sequel → the-prince-of-tennis, franchise
    the-prince-of-tennis; 3 components, 26 eps, source manga 30049, STAGED) → mint-grids.ts (the 26-row ruled grid
    from grid__the-prince-of-tennis-national-tournament.json: the run's own 1-26, first-release dates 2006-03-24 →
    2009-01-23, minted_by manual, format at mint time; idempotent — a second dry run: 0) → relations.ts (the sequel
    relation; series_relation_missing 0) → sync-related-works (the parent's three rows 178.5 / .51 / .52 RETIRE —
    entries of a 3-entry run elsewhere are not another series' extras, I13 (d); the walk now attributes the works
    hanging off the chain to the new series: ANOTHER STORY 5751 @26.5, ANOTHER STORY II @26.51, the II OVA vs Genius
    10 @26.52 (other_instrument — the New Prince of Tennis manga), Ryoma! 2021 @26.53, the Final's chibi flash
    special @24.5 — five inserts, seven removes, idempotent) → apply-tennis-anchors.ts (26 anchors FROM THE THREE
    VERIFIED VERDICTS — the verdict JSON is the anchor source: START / END per row with A47's sliverEnd against the
    next row's START, interludes and slivers in chapters_adapted, the verdict's volume, source manual: rows 1-13
    ch 248-305 vols 28-35 (row 7 = 237-239, the Kikumaru interlude block; 245 / 240 / 242 / 247-248 first-time
    interludes ride in the strings), rows 14-19 ch 306-340 vols 36-38, rows 20-26 ch 341-379 vols 39-42 — to the
    manga's last chapter). The series stays STAGED with the canon-tier default types until the standing programme
    types it (P39 typesRuled). CENSUS (vs the wave-5 capture, every delta explained — P17): series_staged
    31 → 32 and ok_full 253 → 254 (the new series renders fully anchored); anchor_nonmonotonic, anchor_start_offtrend
    and backjump_continue_unruled 0 → 1 each on row 7's verdict-described back-jump (the beach-volleyball block, ch
    237-239 adapted first-time out of serialised order) and the census's verify-series-display FAILED the series
    ('ep 7 starts ch 237 below ep 6's 269 with no rearranged/graft ruling', which stopped the roster before
    audit-discovery) — closed the ruled way: a `rearranged` STANDING ANNOTATION on row 7
    (lib/rulings/standing-annotations.ts; R29 — the verdict names the reorder in its own words), asserted by
    assert-overrides, then heal-parity-continues stamped the continues (ep 6 → 237, the jump; ep 7 → 272; seventeen
    straddle continues; three C3 skip notes) — all three classes 0 and the series verifies (220 verified, 0 failing);
    asterisk_unreviewed 177 → 178 (the new series joins Sean's annotation sign-off queue). audit-discovery (run
    standalone): discovery_ruled_unbuilt 1 → 0 (the seed ran), extra_same_instrument 128 → 126 (the chain's two
    hangers-on re-bucketed under the new owner), every related_work_* violation 0, related_work_unruled 368 (three
    pending rows moved owner, none added or ruled), series_relation_missing 0. FINDINGS surfaced, not this
    sitting's writes (the consolidate's items): heal-anchor-volumes --dry-run reports 1385 re-derivable volumes —
    one-piece 1029 (its AFG anchors carry NULL volumes after today's refresh; the table would fill them; the
    healer's last run at 07:34 re-derived 41) — run it at the next heal and check whether the AFG writer nulls
    volumes on every refresh (churn, P8's shape); the parity healer converted 117 continues (Tennis's 19 + the
    straddle parity on thirteen AFG-refreshed series — the standard post-cron churn); no volume_boundaries exist for
    manga 30049 (the PoT manga — the display estimates volumes while the anchors carry the verdicts' en-WP Shogakukan
    volumes; a volumes-backfill for 30049 queued, V5 / V6). Edges rebuilt + all five deployed for the annotation
    ruling (P3); generated docs; 281 tests.

141. ✅ **EXTRAS WAVE 5 APPLIED (Sean ruled 2026-09-06 with Cursor: as recommended, Magus' Bride → 9.5, DBS canon).**
    Eight works, ten owner rows, all verified SOUND WITH NOTES (research-agent Opus → verdict-verifier Fable, the
    structure Sean keeps; out/ + verify/ committed): one-punch-man OVA 21416 FILLER @12.5 (six ONE-原案 originals;
    the slot on the bundle's LAST member, #06 after the Boros invasion) · DanMachi Arrow of the Orion 101166 FILLER,
    the 13.x CLUSTER ruled whole in date order (the hot-springs OVA 21660 → 13.5, the film → 13.51; the author's own
    「1期と2期の間」; the verdict's STORY-page quote struck — the line is not on the licensor's page) · 7DS Prisoners
    of the Sky 99540 FILLER @52.5 (the giveaway manga separated by DIRECTION — the film's 前日譚 drawn FOR it — never
    by 'uncollected', the verifier's correction; the Kaguya shape decided the other way for a reason) · Gintama THE
    VERY FINAL 114129 CANON 699-704 vol 77 @369.5 (rows 368-369 ARE THE SEMI-FINAL, component 126819 — the task's
    121097 was wrong; nothing minted) with the 369.5x cluster ruled in date order (Baragaki 369.51, Ikkoku 369.52,
    Kintama 369.53, Yoshiwara 369.54 — the four rows had stood in insertion order) · Overlord The Sacred Kingdom
    133845 CANON @46.5, a midquel between S4 eps 7 / 8 — chapter NULL, volume 13, 'LN vols 12-13 ch 1-7 + エピローグ'
    (the proposer's chapter 7 was a number in a space the novel owner does not have) · Noragami OVA 20494 CANON
    ch 25 vol 7 @19.5 with the PARTS string (ch 24's body + ch 25's possession half + 拾遺集 ch 2 as a side_story
    fact — row 19 carries the other halves) and the Aragoto OVA 119941 → 19.51 · Magus' Bride Those Awaiting a
    Star 21688 FILLER @9.5 — SEAN'S FORK (Cursor's line): the OAD's frame (Chise at 15 with Ruth, contracted TV
    ep 8) collides with the release slot 0.5 and 8.5 is refuted (ep 9 opens on Elias' two-week seclusion); 9.5 is
    the first slot the run does not contradict — the Kinnikuman date-slot class; the frame is in the note and
    'earliest the frame permits' is NOT minted as a convention (P9) · Battle of Gods 14837 under three owners: DBZ
    FILLER @288.5 and Kai FILLER @165.5 (one story point — the ch 517 / 518 gap; ja-WP's 改 slot converted by TITLE,
    R20; the task's 'Kai ends at 98' refuted), DBS CANON @0.5 — SEAN'S FORK: the parallel owner (I40 / T30), chapter 4
    vol 1 with the string saying CORRESPONDENCE (the film adapts no page; the manga digests the film; a bare 'vol 1 ·
    ch 4' would render as adaptation). The ledger writer: 12 moves + 4 in-place updates, 0 refusals — every cluster
    ruled whole, because without the sibling moves planRuledMoves refuses Noragami 19.5 and Gintama 369.5 (E14);
    idempotent after (a second dry run: 0). audit-discovery: every related_work_* violation class 0;
    related_work_unruled 378 → 368; related_work_cluster_disorder 47 → 45 (the danmachi and gintama clusters). Edges
    rebuilt + all five deployed (P3). CAPTURES: PROTOCOL-extras.md's stale Battle-of-Gods sentence rewritten (the
    parallel-owner case — T30 standing, A46 correspondence fields that say so, no adopted record; the 脚本 credit a
    credit); apply-tennis-anchors.ts' episode read routed through selectAll (P32 — system:census caught it). QUEUED
    (never silent): Noragami's 拾遺集 as a SHELF ruling (Kodansha files it as 『ノラガミ』の番外編 by the same author —
    touches TV ep 4); Gintama Lesson 691 (skipped by the SEMI-FINAL) + ep 367's ch 687 half; DanMachi ep 1's date
    (stored 2015-04-03 vs ja-WP 4月4日 土曜 1:05); Magus' Bride's second trilogy wiki row @24.1 (two AniList ids —
    identity); the 7DS shelf (Cursed by Light 128740, Grudge of Edinburgh); the same-class Dragon Ball rows
    (Resurrection 'F' 20778 under all three owners; Yo! Son Goku 5152, Age 776, at DBZ 291.53); a parallel-owner
    clause for related works + the writer / census gap for chapter fields on a parallel owner; the wiki's Noragami
    OVA 4 volume label; Overlord's 「カッツェ平野の幽霊船」 (I41 if the chain wants it); a research-agent trap — a line
    attributed to a licensor page must be grep-verifiable in the fetched page (the DanMachi STORY-page quote).
    CENSUS (vs the rows-pass capture, every delta explained — P17): related_work_unruled 378 → 368 (the ten
    rows ruled); related_work_cluster_disorder 47 → 45 (danmachi 13.x, gintama 369.5x); extra_same_instrument 129 → 128
    and discovery_ruled_unbuilt 0 → 1 — both the Tennis declaration (anilist 995, disposition 'series', committed after
    that capture): the candidate leaves the extras bucket and waits for the seed — the next sitting; ruling_violation 0;
    219 series verified, 0 failing; every violation-kind class 0; 281 tests.

140. ✅ **THE ROWS PASS — eight ruled grids for the seeded OVA runs (G59 path C; Sean signed 2026-09-06).**
    The seven seeded runs the wiki finder could not serve (Unicorn's list page holds the OVA and the TV
    re-cut together; Lost Girls and No Regrets carry the franchise's fractional OVA ordinals; Thunderbolt's
    table reads dateless to our parser; Rohan, Tokyo Babylon and Houkago have no episode template) plus
    Weekend Hero's mis-numbered row got RULED GRIDS: a narrow research wave of eight asks under a new
    contract (PROTOCOL-grids.md — the run's OWN numbering, ISO first-release dates, two source tiers
    incl. the licensor, the AniList count check; no standings, no anchors), validated by
    validate-grids.ts (0 problems; --entries proposed the MINTED_GRIDS entries) and read as the
    stored-first recap in chat. 33 rows minted by the manual writer (mint-grids.ts, which gained
    --dry-run for the /discover stop): Lost Girls 3 (Kodansha's 限定版 ship dates), No Regrets 2, Weekend
    Hero 2 (bundled with MANGA vols 19 / 20 — not the Kyoto Saga discs; the pair adapts the 2nd and 4th
    j-BOOKS novels, not Weekend Hero — an instrument question for the standing programme), Houkago 5
    (one 4-koma block per vs Genius10 disc; the licensor numbers and titles nothing — constructed disc
    labels), Thunderbolt 8 (the licensor's own continuous Episode 1-8; general-premiere dates over the
    fan-club early window — Sean's call), Unicorn 7 (first-release dates; the SP / EX shorts and the
    RE:0096 rows on the same page excluded), Rohan 4 (release order with the manga episode labels; row
    1's day NULL — the community's 2017-09-20 is one lineage, ja-WP's date is another disc's — P6),
    Tokyo Babylon 2 (アニメ大全 + the product pages; the VISION music clip is not a row). Weekend Hero's
    wiki row 2 ("Snake and Poison", this sitting's namesake-table write under the franchise ordinal)
    removed on Sean's sign — it is the run's row 1. Every grid's types are the canon-tier DEFAULT,
    signed as such: the standing programme (per-episode type + anchors) is the next research shape for
    all 26 seeded series; the research work-list is `series_staged`. Traps recorded: our wiki parser
    reads only the Start-date template / ISO date forms (en-WP's Thunderbolt table carries prose dates
    — queued); AniList's API was 403 again for the whole wave (every count rests on the licensor + the
    wikis). Idempotent (a second dry run: 0 minted); 281 tests; the manual writer's --dry-run added.
    THE CENSUS AFTER THE PASS surfaced three things, each closed: (1) the 33 fresh rows had no FORMAT
    (T29 derives it from the component kind; the healer set it) — both writers now set the format AT
    MINT TIME (`deriveFormat` in mint-grids.ts and the seed's row path; a fresh mint never fires
    ruling_violation again); (2) Unicorn's own three extras re-derived their slots (0.5x → 1.5 / 7.5x)
    now that the series has rows — the writer moved them; (3) the discovery CRON had run during the
    pass and staged the fifteen unstaged related works plus new candidates (extra_unstaged 16 → 1,
    halo_sequel +5, discovery_new_since_sitting +5): the ledger writer inserted 26 rule-derived rows
    (Ranma ½ SUPER and the 2008 OVA — the queued restage, done by the cron; GitS 2.0; Tennis's ANOTHER
    STORY I / II and the 2021 film; Gundam Narrative / Hathaway / Perfectibility under Unicorn;
    Evangelion 3.0 / 3.0+1.0 and the Digimon tri chapters as originals; Bandit Flower under
    Thunderbolt; the NG-shuu under Last Game; Additional Time under Nagi) — related_work_unruled 365
    → 378. P39 AMENDED: a ruled grid (G59 path C) publishes the series only when the grid declares
    its TYPES ruled (`typesRuled` — the Shonan grid's researched types); the eight grids carry the
    canon-tier default signed as a default, so their series stay STAGED until the standing programme
    types them (the derivation had said 'public' for all eight — a default is a plausible guess, never
    a shown truth, P6; Sean's to reverse). Also by the cron: one-piece's AFG anchor at ep 1176 past
    aired 1175 (`anchor_without_row` +1, a numbering fault listed), a killed AFL run (`run_stuck`).

139. ✅ **STEP 2 — THE FILM MINT SITTING APPLIED (Sean's go 2026-09-06: "walk"; the first /discover
    sitting to mint from the (d) declarations).** THE PICKS PASS (Sean with Cursor's three corrections):
    26 series minted — 12 one-row films / specials (JJK 0, Episode of Bardock, Tokyo Ghoul Jack / Pinto,
    Kuroko's Last Game, Spare Bike, Koro-sensei Q, Colourful Bleach, Episode Nagi, Wild Police Story, the
    two One Piece novel specials), 3 two-entry film / special series (the Oshii films 1995 + Innocence —
    Sean: walk; SAO Progressive's two films; the two Durarara Gaiden specials), 11 episodic OVA runs (Lost
    Canvas 26 eps, Unicorn 7, The Origin 6, Thunderbolt 4 + 4, Rohan 4, Tokyo Babylon 2, Lost Girls 3,
    Weekend Hero 2, Houkago 5, Magic Kaito 12, No Regrets 2). Two re-targeted to the HEAD work (I13 f):
    Thunderbolt from the ONA 21458 (December Sky is its compilation), Magic Kaito from the 2010 specials
    8310 (the Conan OVA 2514 is a cameo). Not mints, ruled as extras: the Sailor Moon S film (the
    instrument's own short story), the Kekkai Sensen & BEYOND OVA (Back 2 Back registered as the
    owner's chain work, I41), Arise Border:1 (attributed to Arise with its siblings — a label accident),
    FMP's TSR special (Sigma is the manga edition of the owner's own novels), Dead Apple (a
    comicalization). Deferred: Fate/strange Fake's prologue special (the TV is the head, 2026), the Oz
    picture drama, Twilight Axis (a compilation on a disputed instrument). THE WRITER (lib/seed.ts):
    holds a mint without a declared relation (I13 d); passes its RULED slug to the aggregate so the I38 /
    T25 rulings are found (the aggregate had slugified the head title); a NOVEL-kind source registers no
    manga id (Weekend Hero's pick had taken the parent's manga); ensures its FRANCHISE ROW from the map
    before the series row (the first mint failed on the FK — the healer had been the only writer of
    franchise rows); mints ONE ROW PER SINGLE-ENTRY FILM / SPECIAL from AniList (lineage `anilist` — the
    named G59 path of I13 b; 15 series, 18 rows). Chains pinned where the SEQUEL walk over-reached
    (Unicorn had pulled in Twilight Axis; The Origin had walked into the 1979 compilation films). The
    wiki backfill (path A) served Lost Canvas 26, Magic Kaito 12, The Origin 6, Weekend Hero 1 (row 2
    — mis-numbered by the parent list's OVA ordinal) and REFUSED every namesake page for Lost Girls / No
    Regrets / Weekend Hero (G55); it minted 8 dateless, title-less rows for Thunderbolt from the main
    article's table — removed (this sitting's own writes) and the writer now REFUSES a dateless table at
    its one choke point (G55 cannot lock it). A namesake fractional (AoT's "Since That Day" @13.5 on the
    No Regrets series) came through the watch-order writer — removed; its namesake gate is queued.
    RELATIONS: `series_relation_missing` (the E9 outcome class) caught that RULED pairs never landed for
    a series without an AFL slug — the healer keyed them by AFL slug; now by series id (three pairs
    landed, one pre-existing); Unicorn → Gundam and Magic Kaito → Conan ruled (I17). THE SKIP-SPLIT
    RAN: five parent rows retired by the rule Sean set (the 1995 film on SAC, Progressive on SAO, Lost
    Canvas on Saint Seiya, the two Gaiden specials on Durarara — entries of multi-entry runs elsewhere;
    `retiredByOwnership` now covers that case); Unicorn's row on Gundam KEPT (a one-row series) after two
    fixes — the audit dropped a minted work from the parents' buckets because it carries a series
    ruling, and the SEQUEL chain walk skipped it because Unicorn is also an owner of the chain candidate
    (Char's Counterattack): the skip is per owner now. `special_numbered_unreviewed` exempts runs that are
    non-TV by construction (0 from 29). CENSUS (vs sitting C): series_staged 5 → 31,
    discovery_ruled_unbuilt 27 → 0, type_default_unclassified 34 → 79 (+45 default-typed rows owed
    typing: Lost Canvas, Kaito, The Origin, Weekend Hero), title_incomplete 22 → 30 (+8: seven seeded
    series with no rows yet + Weekend Hero's missing row 1 — the path B / C queue), ok_full +14,
    pending_finished_no_totals +12, integrity_total_beyond_eps +1 (Weekend Hero), fractional_unmodeled 1
    (the No Regrets namesake page still staged — the finder), halo_series_unclaimed +2 (Magic Kaito 1412,
    the strange Fake TV — the minted series' own halos), extra_unstaged +8 (their unstaged related works
    — the restage), extra_other_instrument 16 → 33 (+17: the 26 new owners' own related works that adapt
    another run — Unicorn's Char's Counterattack and the like — the picks read's next input),
    related_work_unruled 368 → 365, cluster_disorder 47 → 45; every violation-kind
    class 0; 281 tests; five edges deployed. NEXT: G59 path B / C rows for the seven rowless OVA runs
    (Unicorn, Thunderbolt, Rohan, Tokyo Babylon, Lost Girls, No Regrets, Houkago) and Weekend Hero's
    numbering; the seeded series enter the research work-list (types + anchors); the /discover sitting
    for the Prince of Tennis OVA component + E12's queue class; waves 5+ of the extras programme.

138. ✅ **SITTING C — E9 AS RULED, THE SKIP-SPLIT, E12's CLAUSE (Sean's go 2026-09-05 evening, the row list
    shown first; Cursor's objection to E12's queue class taken).** I13 AMENDED: (d) a SERIES mint keeps the
    parent's ledger row — position and standing to the parent's manga live there, a relation carries neither
    — and the mint writer ALWAYS writes series_relations + franchise membership (the outcome class for a
    minted series with a declared parent and no relation row lands with the writer at step 2); (e) a
    COMPONENT mint RETIRES the row (`retiredByOwnership`, the ledger writer removes its own-origin row and the
    registry entries, the identity lives in the component); no link kind. THE SKIP-SPLIT in the halo walk
    (`oneRowExtraElsewhere`): an entry owned by THIS owner (I21 — its own id and components) is never its
    extra; an entry owned by ANOTHER series is an extra here only when that series is ONE-ROW (the film-mint
    shape) and the format is extras-shaped — marked `ownedElsewhere`, never a series / component / mint
    proposal (the picks read says 'already a series'); any entry of another multi-entry run (its first
    entry or a component) is not — the franchise page orders runs. THE LIST BEFORE THE DEPLOY: one work
    appears (gto-great-teacher-onizuka ← the Shonan Junai Gumi OVA 1913, owned by the one-row series
    shounan-junai-gumi; it adapts GTO's chain work 30445 registered today → same_instrument, standing
    pending, the research queue), none leaves, 189 stay off (176 TV entries of other runs; 13 non-TV
    entries of multi-entry runs — the Clear Card prologue OVA, the three Greed Island OVAs (components of
    the 1999 run, episodes 63-92 there — untouched), the Clannad side OVAs, Yu-Gi-Oh's DSOD film). Using
    'one-row series' rather than 'another series' own id' avoids an asymmetry the list exposed (a two-film
    series' first film listing on a parent page while its sequel does not). I42 AMENDED: (i) the
    owned-elsewhere candidate clause; (ii) E12's clause naming the FACT — a non-TV work that continues the
    instrument AND joins the numbered run (a counted extra, N4: episodic, canon, contiguous with the run;
    a film that continues the manga is still an extra) is a COMPONENT ruled at /discover, whatever relation
    reached it (I47) — the Prince of Tennis block the witness; its QUEUE CLASS DEFERRED to that sitting
    with its list first: Cursor showed the drafted predicate ('past the frontier') would have re-opened
    Dumpster Battle, Infinity Castle, Reze Arc, First Slam Dunk and the Ranma cluster against their
    rulings. Tests 278 (the walk, the retire helper); the sync inserted the one row; census
    extra_same_instrument 125 → 126, related_work_unruled 367 → 368, nothing else; every violation-kind
    class 0; five edges redeployed. THE EVALUATION IS CLOSED as ruled: E1 / E5 / E8 queued by name; E9 / E12
    / E13's re-walk have their homes. NEXT: step 2's film mint writer — the I13 (d) invariants (the row
    stays; the relation and the membership written atomically; the outcome class), the 27 declarations +
    the five live MINT proposals + the (d) queue; then the /discover sitting (the PoT OVA component with
    its own numbering, the queue class with its list); waves 5+ between.

137. ✅ **SITTING B, STEP 2 — the chain ids as I41 entries (Sean's go 2026-09-05 evening).** Three
    SOURCE_CHAINS works gain their AniList manga id, identity confirmed on AniList + MAL with the chain
    notes' years and counts: Rosario+Vampire Season II 33403 (MAL 3403, 2007-14, 67 ch / 14 vols),
    Trigun Maximum 30704 (MAL 704, 1997-2007, 104 ch / 14 vols), Shonan Junai Gumi 30445 (MAL 445,
    1990-96, 267 ch / 31 vols). Cobra's Galaxy Knights (Super Jump 1996) has NO AniList node — three
    searches (ギャラクシーナイツ / Cobra Galaxy Knights / Galaxy Knights) return nothing; its id stays null
    and the note says so (P6: an honest gap, not a task). The audit's bucket delta for the three owners
    is EMPTY (the only Trigun extra, Badlands Rumble, is an original and stays held); the sync changed
    no row; every census class unchanged; five edges redeployed. Sitting B closed. NEXT: sitting C
    (E9 as ruled — a series mint keeps the parent's row and the mint writer always writes
    series_relations + franchise membership, a component mint retires the row; the skip-split with its
    row list — 'owned by this owner' = I21, a one-row film series elsewhere stays an extra, a component
    of another multi-row series does not; E12's clause naming the fact, never an edge type) before
    step 2's mint writer.

136. ✅ **SITTING B, STEP 1 — I47, A TAG ROUTES; ONLY RESEARCH OR A RULING ASSERTS THE FACT (E15;
    Sean's go 2026-09-05 evening, the census list shown first).** The new record I47 (family I): AniList's
    relation type and `source` tag decide WHERE a candidate goes — bucket, proposal, research queue —
    never WHAT is true of it; a fact (standing, chapters, ownership, whether a block continues the run)
    is asserted only by research or a ruling. Consequences landed: `adaptedNodes(media, own)` accepts an
    ADAPTATION edge to one of the OWNER'S OWN instrument ids (the registered manga, a chain work — I41, a
    novel owner's NOVEL nodes — T25; `ownerInstrumentSet`) whatever the tag says, while the tag still
    gates edges to OTHER nodes (a novelization never becomes a source); every call site passes the owner
    set (extraBucket, both discovery branches, the writer's note); I45 amended to cite it; three tests
    (273). THE LIST BEFORE THE DEPLOY: exactly two works change bucket — the-prince-of-tennis 995
    (Zenkoku Taikai-hen, tag null, already ruled canon: only its note changes from 'held' to 'adapts the
    series' own instrument') and toriko 11787 (Barbarian Ivy wo Hokaku Seyo!, a SIDE_STORY special, tag
    null) which enters the research queue as same_instrument (standing pending). The sync updated six
    rows: those two plus four NOTE refreshes on rows whose bucket did not change (the alternative rows
    Fist of the North Star Movie, Dai 1991 and Drifters OVA now name the base's instrument they adapt; the
    Blue Exorcist Kyoto OVA's note names an instrument node the tag-gated filter had hidden); second dry
    run 0 / 0 / 708. Census: extra_unknown 261 → 259, extra_same_instrument 123 → 125, nothing else
    moved; every violation-kind class 0; five edges redeployed (lib-hash fe021049). The E12 clause will
    name the fact (continues the instrument past the run's last chapter), never an edge type — the same
    rule. NEXT (step 2, the separate step): the chain ids as I41 entries — Rosario+Vampire Season II
    33403 (MAL 3403), Trigun Maximum 30704 (MAL 704), Shonan Junai Gumi 30445 (MAL 445); Cobra's Galaxy
    Knights has NO AniList node (three searches) — its id stays null with the note saying so (P6).

135. ✅ **THE RULE-LOGIC EVALUATION, SITTING A — inert hygiene (Sean ruled 2026-09-05 evening after
    two agent reviews; E2 / E3 / E4 / E11 / E13-class / E16).** The evaluation (EXTRAS-SITTING §6,
    E1-E16, the generated inventory) went to Sean as one table; Cursor's and an Opus agent's reviews
    were weighed against the code: adopted — the second root (a source's relation or tag ROUTES a
    candidate, only research or a ruling asserts the fact; E12 and E15 are one rule shape), inert
    and data-moving changes land separately with attributable deltas, E13 as a class NOW and the
    re-walk only after E1 (a re-walk on the position key is the E14 shape), E15 as its own add-rule
    with the census list first, E4 is a dead RULE not a dead export (the writer re-implemented the
    ledger predicate inline), E5 is not a UI item, E9 per Cursor (a series mint KEEPS the parent's
    ledger row — I13 — and the mint writer ALWAYS writes series_relations + franchise membership; a
    component mint RETIRES the row; no link kind; 'owned by this owner' = I21 for that series, its
    own id and components, never franchise-mates — Stampede stays off Trigun's extras, JJK 0 stays
    on JJK's; the skip-split moves rows → the E15 bar, its own step in sitting C), E16 in sitting A;
    corrected — Opus's 're-proposed forever' (the halo skips owned ids; a minted work's row would
    sit in the stale listing, never re-propose), Opus's E15 residue (the chains are registered; the
    true residue is FOUR chain works without an id: Rosario+Vampire Season II, Trigun Maximum, Shonan
    Junai Gumi, Cobra's Galaxy Knights — I41 entries in sitting B, a separate step), Opus's E2 field
    (episode rows have no identity beyond their number — the mechanism is the N11 renumber sweep,
    now a listed apply-batch trap covering ledger positions and ruled positions), Opus's E8 urgency
    (three bundles; defer), Opus's E3 (the census already carries listing classes — what was missing
    is a KIND per class: E16). LANDED: `ledgerWorthy` is now the writer's and the audit's predicate
    (E4); `IN_RUN_RELATIONS` deleted (0 uses); I45's enforcement names relatedWorkOwners /
    ledgerWorthy / freePosition / extraKind / isoDate and the new helpers, I46's names pickAdoption /
    wikiKey / lookupRelatedWork; a PROMO title table test (E11); `ledgerBaseProblems` (E2 — a
    positioned row whose base episode has no row; a RULED position is a fixed point: my-hero-academia
    171 / 171.5 are Sean's '170+1' counted specials, the first run's only two hits) →
    `related_work_base_missing` 0; `related_work_unruled` (E3, the R27 work-list: 367 = the pending
    standings); `clusterDisorder` (E13 — inside one slot the UNRULED rows must sit in air-date order
    among themselves, ruled rows are fixed points) → `related_work_cluster_disorder` 47 clusters of
    insertion history (gundam, fate, code geass, AoT, cobra, rayearth, FotNS, toriko, evangelion,
    conan, PoT, DBZ, haikyu…) — a LISTING until the re-walk after E1, then a violation;
    `lib/census-kinds.ts` (E16: violation | queue | listing per class, printed beside every discovery
    class count — a permanently non-zero work-list never reads as red). Tests 270; five edges
    redeployed; no existing census class moved (the three new classes only). NEXT: sitting B — E15's
    add-rule (the routing-vs-truth rule; an ADAPTATION edge to the owner's registered instrument
    accepted whatever the tag says; the census list of works that change bucket shown BEFORE the
    deploy), then the four chain ids as I41 entries; then sitting C (E9 as ruled, the skip-split with
    its row list, E12's clause without the edge-type condition) before step 2's writer.

134. ✅ **WAVES 4a + 4b APPLIED (Sean ruled 2026-09-05 evening, Cursor's notes evaluated;
    eleven works, thirteen rulings) · THE WRITER'S PRE-PASS PLANS BEFORE IT TOUCHES A ROW ·
    THE RULE-LOGIC EVALUATION DRAFTED (E1-E15).** Eleven per-work verdicts (research-agent,
    Opus) + eleven adversarial reviews (verdict-verifier, Fable): all SOUND WITH NOTES, no
    value refuted; four agents died at a session limit (two had written their files; two
    re-dispatched on the new account). Sean kept the model structure as built (Opus research,
    Fable verification) after the cost diagnosis (memory research-cost-structure: ≈450k tokens
    per work, the verifier tier as heavy as the research). RULINGS — Kinnikuman: Movie 2 MIXED
    (ch 82-83, vol 7; the pages' sole adaptation beside an original half; title repaired to
    Ooabare! Seigi Choujin per MAL / Toei), the TV special MIXED (ch 86-89, vol 7; the spine
    is the chapters', ja-WP catalogues the replaced half), Movie 4 MIXED (the UNNUMBERED Robin
    Memo one-shot — no volume, no number; 1985-07-13, the task's 'Movie 3, 1984' refuted) —
    all three ruled to their WATCH SLOTS on the licensor-stated settings (65.51 with Movie 1
    ruled 65.5; 47.5 with Toei Video's VOL.5 listing; 119.5 with the PSA ruled 119.51), the
    broadcast slots in the notes. Ranma: the six-OVA bundle MIXED (230-233 / 241 / 259-265,
    END 265 vol 25; one id, one standing), the two-part Special CANON (266-278, END 278 vol
    26; a fabricated 'ja-WP 原作 column' citation struck by the verifier), the third film MIXED
    at the borderline (301-302, vol 29; ~36-43% studio-made; 配給 東映) with the English title
    repaired 'Flew' → 'Grew' (Viz's jacket) — Cursor's 'keep the Japanese on-screen name'
    evaluated and DEFERRED to the display-label pass as a rule (a one-row language swap is a
    one-off, P9); the cluster ruled 161.5 / 161.51 / 161.52 explicitly (E13: the stored order
    was insertion history — the rows predate the writer's air-date sort). One Piece: Episode
    of Luffy FILLER (re-shown ch 1-2 pages + a two-page first-time sliver, the wiki's Qref
    index reproduced over 693 pages) and 3D2Y FILLER (re-told bookends, zero first-time
    coverage; the recap share wider than the verdict said) — both at their broadcast slots,
    in-universe placements noted only. Prince of Tennis: the National Tournament chain CANON
    ×3 (995: 237-305 with the interludes, END 305 vol 35; 2752: 306-340, END 340 vol 38;
    4053: 341-379 to the manga's last chapter, vol 42), seams clean at 305/306 and 340/341,
    positions 178.5 / .51 / .52 confirmed — the STRUCTURE fork ruled: three ledger rows NOW,
    an OVA COMPONENT at the next /discover sitting with its OWN numbering (1-26 or three sets,
    never TV 179-204; the verdict JSON the anchor source — Cursor's note, adopted). THE WRITER:
    `planRuledMoves` (lib, pure, 5 tests) — the pre-pass plans every ruled move before any row
    is touched; a slot held by a non-moving row REFUSES the move and keeps the row (the old
    pre-pass removed first and refused after: the row would have been deleted — the Movie 4
    verifier's paper find, E14); a swap and a chain still land (the PSA vacating 119.5 for
    Movie 4 in one run); I45's enforcement names it; five edges redeployed. The rulings map now
    THROWS on a duplicate (series, work) key instead of overriding silently (three entries
    were MERGED: 3273 / 147810 / 3280). LEDGER: 697 halo rows (12 canon · 9 mixed · 309 filler
    · 367 pending) + 39 wiki; every related_work_* class 0; no other census class moved.
    FINDINGS captured for the evaluation (EXTRAS-SITTING §6, E1-E15): identity vs PK · ruled
    decimals with no base · bucket = claim vs standing = fact · unnamed mechanisms + dead
    exports · the writer at script tier · the AniList-entry grain · the two-map overlap a mint
    must resolve · intra-slot order as insertion history · format routing a manga-continuing
    OVA block to extras · the pre-pass hazard (fixed) · adaptedNodes drops every edge when the
    source tag is null (E15: PoT 995 was held with its ADAPTATION → 30049 edge staged all
    along). QUEUED (never silent): a wiki title parser gate (kinnikuman eps 47 / 86 / 137
    store `|airdate= |episodes=` as their title — the only three rows catalog-wide); ranma ep
    161's stale anchor note (AFG ch 227 vs the value 229); PoT ep 177's date (03-23 vs ja-WP
    03-30, a one-hour special with 178) and eps 177-178's types; SP9 Episode of Sabo (staged
    recap / filler by rule, may front-run chs 786 / 792 / 794); Ranma ½ SUPER (1011) and the
    2008 OVA unstaged; the five live MINT proposals not among the 27 declarations (appendix B,
    regenerated with live AniList facts — the API answered again this evening; two date traps
    in the comicalization test captured). NEXT: the rule-logic evaluation as one table in chat
    (Sean's ask), then step 2's film mint writer.

133. ✅ **WAVE 3 APPLIED — THE FIRST SAME-INSTRUMENT WAVE (Sean ruled 2026-09-05
    with Cursor; eight works).** Eight per-work verdicts (research-agent, Opus) +
    eight adversarial reviews (verdict-verifier, Fable): all SOUND WITH NOTES, no
    value refuted — but three of the eight TASK PREMISES were (the KonoSuba OVAs
    and Road to Hero are author-written ORIGINALS, not LN adaptations; the AoT
    OADs shipped with manga volumes 12-14, not on a 2013 date). RULINGS (eight
    hand-written `RelatedWorkRuling` entries, E56): Haruhi's Disappearance CANON
    (LN vol 4 whole; 28.5) · the Attack on Titan OVA MIXED (one AniList id for
    three OADs — 「イルゼの手帳」 adapted in full by #3.5 inside an original frame,
    #3.25 / #3.75 originals; `volume: 5` by hand — the proposer would emit 4; RULED
    to position 3.5 where the licensor numbers it, from the air-date 25.51) ·
    KonoSuba OVA 1 / 2 FILLER (10.5 / 20.51; KADOKAWA: 原作者書きおろし, TVアニメでは
    放送されないオリジナル — Akatsuki's credit is a credit) · Haikyu's Dumpster Battle
    CANON (293-325 in full, END 326 partial — the post-credit Daishō scene is ch
    327's, a sliver, never the END; volume 37; 87.5) · Road to Hero FILLER (原案
    ONE credit; 9.5) · the Kaguya OVA CANON (ch 96 + the two uncollected Darkness
    番外編 by the author — the instrument's own specials, I41; NOT the GTO rule,
    whose extras were in the run; volume 10; 24.5) · the Slime OAD FILLER (five
    publisher-stated originals; Fuse's 描き下ろし a credit; RULED to 24.05, before
    the Coleus wiki row at 24.1 — every sourced order puts the OADs first).
    T26 AMENDED (the related-works clause): an author's screen-only credit on a
    film / OVA that exists only as that film / OVA is a CREDIT in the note, never
    an adoption — adoption puts material INTO the source line (Slam Dunk, Road to
    Hero, KonoSuba, Slime). The writer moved the two ruled rows through the
    pre-pass (identity kept), 2 inserted / 6 updated / 700 unchanged, the second
    dry run 0 / 0 / 708. LEDGER: 697 halo rows (8 canon · 4 mixed · 307 filler ·
    378 pending) + 39 wiki rows; every related_work_* class 0. QUEUED, never a
    silent edit: kaguya ep 24's stored END 102 → 101 as a SUPERSEDING curated
    anchor (a batch-5 manual value; three sources agree; the episode-row pass
    with its own dry run); the Coleus wiki row's note carries a retired
    "anime-only-canon" string (a T27 sweep item). SEAN'S STANDING REQUEST: ONE
    RULE-LOGIC EVALUATION of the related-works structure (buckets · owner
    precedence · instrument sets · the ruling layer · the identity registry · the
    seed) — is it sound, strong and best practice going forward — recommended
    AFTER wave 4 lands and BEFORE step 2's mint writer is built, as a generated
    table in chat (mechanism · gate · audit class · witnesses · verdict).
    WAVE 4 = the nine triage yeses + the Prince of Tennis Semifinal / Final OVAs
    (eleven contexts in the scratchpad), dispatched in two P12-sized waves.

132. ✅ **WAVE 2 APPLIED — THE OWNER TRIAGE (Sean ruled 2026-09-05 with Cursor; ten
    owners, 111 held works).** Ten triage verdicts (research-agent, Opus) + seven
    adversarial reviews (verdict-verifier, Fable; the three all-original shelves
    with explicit structural evidence — Gundam, Naruto, Railgun — reviewed in
    session): every yes / no reproduced from primary sources, none refuted; the
    nine chapter claims exact at every boundary (Ranma's on a third instrument,
    en-WP's Shogakukan volume contents). RULINGS: the 100 originals are FILLER BY
    RULING — 99 entries (the note = the researcher's first sentence; the verdict
    cited), six of them naming ANOTHER run rather than "original" (No Regrets =
    悔いなき選択 and Houkago no Ouji-sama = the 4-koma spin-off → decision (d);
    Twilight Axis → (d) with the direction disputed — ja-WP dates the web novel
    from 2016-11-07, the ONA from 2017-06, the Gundam Wiki says the reverse — the
    picks read decides on dates; Conan OVA 1 → the existing magic-kaito
    declaration; Conan OVA 12 = the えくすかりばあ one-shot and Kinnikuman Movie 7 =
    the デスゲーム one-shot are tie-ins, never a series, riding with the per-work
    programme); the nine yeses stay PENDING and join the per-work programme
    (Kinnikuman 82-83 / 86-89 / the unnumbered ロビン・メモ special; Ranma 230-233 +
    241 + 259-265 / 266-278 / 301-302; Prince of Tennis Genius 248-305 with
    237-240, 242, 245, 247 as interludes; One Piece's Episode of Luffy and 3D2Y
    as recap-boundary cases); God Valley / Baad stay held (unreleased). REPAIRS
    (P8, on the ruling entries — `RelatedWorkRuling` now carries title / airDate /
    kind; the writer applies them, the position re-derives from the ruled date,
    the census lists a row that disagrees): Lord Slug 1991-03-09 · the Kinnikuman
    TV special 1984-04-07 (a month/day swap; on a pending row) · Attack on
    Skytree 2017-04-10 · Railgun's #EX 2010-10-29 and the bathhouse short
    2014-03-27 · Tongari Island 2018-04-21 with its own title (AniList carried
    the treasure-hunt EVENT's) · Conan's "Magic File 6" = BONUS FILE ファンタジスタの花
    · AoT's "Picture Drama" = the S1 chibi theatre (MAL 19391 / Kitsu 7889 / the
    licensor's line-up) · Hagiota → Hagoita · Gundam's Impression of First
    GUNDAM and Ranma's 29-opponent clip video = kind recap. Bardock's ch 307
    cameo = a note, not an adoption (Sean: two panels are not material). THE
    PROMO TEST now catches a music video by title (music video / uta gassen /
    歌合戦 / ミュージックビデオ — AniList files Ranma's two as OVAs): extra_promo 7,
    their rows and registry entries removed (a promo's identity leaves with its
    row). Held, not ruled: Cry heart's date (three uploads), the Conan
    application-window OVAs (five positions would move under DCW's dates).
    Findings for the shelf: the Prince of Tennis Semifinal / Final OVAs (Genius
    306-379) are held same_instrument rows — wave-3+ targets; Ranma ½ SUPER
    (1011) and the 2008 OVA (5493) adapt the instrument but are UNSTAGED (a
    discovery-stage run reaches them); Made in Abyss S2 and KonoSuba 3 are
    unclaimed sequels waiting for `/discover`. validate-extras: a triage note is
    the first sentence, cut visibly when over the cap, never a silent slice. LEDGER:
    697 rows · 386 standings pending (from 486) · every related_work_* class 0.
    WAVE 3 DISPATCHED: the next eight same-instrument works by popularity —
    Haruhi's Disappearance (vol 4 of the owner's novel — the chain registered
    today), the Attack on Titan OVA, KonoSuba's two OVAs, Haikyu's Dumpster
    Battle, Road to Hero, the Kaguya OVA, the Slime OAD; the nine yeses queue
    behind them.

131. ✅ **WAVE 1 APPLIED · THE IDENTITY REGISTRY FOR RELATED WORKS · WAVE 2
    DISPATCHED (2026-09-05, afternoon — Sean's identity concern).** WAVE 1: eight
    verdicts (research-agent, Opus) + eight adversarial reviews (verdict-verifier,
    Fable; `research/discovery/verify/`), all SOUND WITH NOTES, no value refuted;
    Sean ruled: Mugen Train canon 54-66 (this work IS our rows 28-33) · Infinity
    Castle Part 1 canon 140-157 (no Part 1 row; a label question) · Reze Arc canon
    39-52 (the cold open plays ch 38's last pages as A10 scraps, START 39) ·
    Legend of Crimson MIXED (the post-Railgun act is an original climax — T28's
    recap boundary) LN vol 5 ch 1-6 @20.52 behind the S2 OVA · Dawn of the Deep
    Soul canon 26-38 @13.52 behind the two compilations (13.5 / 13.51 ruled) ·
    Tanya MIXED (the Commonwealth thread and the Tiegenhoff act are anime-only per
    ja-WP's timeline; ch 5 NOT adapted — no source states a relocation) ·
    Goblin's Crown canon LN vol 5 ch 1-7 (volume + a chapter string, never a bare
    chapter 1) · The First Slam Dunk MIXED 223-276 with Inoue 原作・脚本・監督 as a
    CREDIT in the note, never an adoption (T26's adoptions put material into the
    source line; a screenplay that exists only as the film does not — now in
    PROTOCOL-extras.md). Ten `RelatedWorkRuling` entries (`lib/rulings/
    related-works.ts`); 486 standings still pending. THE WRITER: ruled moves run
    in a PRE-PASS so a cluster swap never overwrites an identity (the key is
    series + position); an occupied ruled slot is refused and listed; a derived
    position re-derives every run (identity is the AniList id, position an
    attribute); the dry run frees slots. THE REGISTRY (I46 amended; Sean: "build
    it now if it is best practice"): `related_work_external_ids` (migrations
    20260905200000 / 201000) — an external id maps INTO the WORK (its AniList
    id) once; a different work already holding it is a collision, refused and
    listed, never overwritten; ownership is what the ledger rows say (a work
    sits under several owners — Battle of Gods under DBZ and Super — the first
    schema keyed the owner pair and 39 false collisions taught the lesson in
    minutes); `lib/related-work-ids.ts` (registerRelatedWorkIds mirrors
    registerIds; identityProblems is the pure outcome check, 3 tests);
    sync-related-works registers anilist + mal for every row and the WIKI KEY
    (series@position) for every adoption, so the join survives the wiki writer
    re-creating its row; sync-watch-order restores a row's AniList id from the
    registry (11 today), guarded against a halo row still holding it; census
    classes related_work_identity_gap / _conflict / _orphan (0 / 0 / 0). The
    identity-first adoption also caught six duplicates the titles had hidden
    (Shin Kyoto-hen = New Kyoto Arc; Ishin Shishi e no Requiem = Rurouni
    Kenshin The Movie; Bonds Beyond Time; The Sealed Card; Vampire Shahal;
    Walking Alone): adoption keys on the label map's ruled id before any title.
    Ledger 699 rows. WAVE 2 DISPATCHED: the owner triage, ten research-agent
    tasks (detective-conan 22 · one-piece 20 · dragon-ball-z 18 · kinnikuman 9
    · the-prince-of-tennis 8 · ranma-1-2 8 · mobile-suit-gundam 8 ·
    attack-on-titan 6 · naruto 6 · a-certain-scientific-railgun 6 = 111 of the
    263 held works), the TRIAGE shape, one JSON per owner. Queued: KonoSuba's S1
    date lineage; Goblin Slayer ep 10; Made in Abyss S2 (an unclaimed sequel — a
    second ruling entry under it when minted); the 63.5 / 13.5 clusters re-order
    by chapter once their rulings land.

130. ✅ **THE EXTRAS RULINGS, SECOND PASS (Sean 2026-09-05 afternoon, with Cursor) —
    THE ALTERNATIVE BUCKET, THE CHAINS, THE (d) DECLARATIONS, WAVE 1 LAUNCHED.**
    Sean's corrections: pull the 1995 Ghost in the Shell from wave 1 (an I16
    alternative of Shirow, not in-flow of SAC — a mint candidate, step 2); Prisma
    Illya 2wei / 3rei are seasons of the owned series, register the chain ids;
    Heaven's Feel belongs to Fate, never to a Prisma Illya extras verdict; wave 1
    only this go (eight films), the owner triage a SEPARATE wave the same day
    (a wave is one task shape, P12 — "another week" was pacing, not a rule);
    no mint this sitting, signed picks are declarations; re-run the picks when
    AniList is up, never guess years; Infinity Castle Part 1 is dated, Part 2
    stays listed. THE MECHANISM (P9: both corrections had one root): a work NO
    owner reached by an in-run relation (SEQUEL / PREQUEL / SIDE_STORY /
    SPIN_OFF / PARENT / OTHER / SUMMARY / COMPILATION — OTHER is AniList's label
    for an entry's own specials, Shippuden's Sunny Side Battle) is an
    ALTERNATIVE ADAPTATION: `extraBucket` 'alternative', attributed ONCE to the
    franchise base (I43, `franchiseBase` in the input; Candidate.ownerRelations
    per owner), never in a run, a series candidate when it adapts an instrument
    (the picks read), held when the source has none; the writer removes its own
    rows the rule re-attributed (the Heaven's Feel films sat under five Fate
    owners → one row under fate-stay-night); `extra_alternative` 66; I45 amended
    (the clause). A promotional title stays promo whatever reached it. CHAINS
    (I41): `chainWorks` had read `anilistId` where the field is `anilistMangaId`
    — every chain looked empty since the extras sitting began (fixed); Prisma
    Illya (Sean: 33526 → 2wei 85136 → 3rei 66131), JoJo (source-derived: the six
    part nodes; Steel Ball Run stays a halo candidate) and Haruhi (the six volume
    nodes) registered — Vow in the Snow / Licht, the 1993 / 2000 OVAs and the
    Disappearance film read as the owner's own instrument now. DECLARATIONS —
    decision (d), Sean signed: 27 `CANDIDATE_ENTRIES` under I13 (the 26
    run-shaped other-instrument works after the caveats — Haruhi, Dead Apple,
    GitS Arise, FMA 20th, FMP Sigma, Bardock, Yo! Son Goku held — plus GitS 1995
    with Sean's reason; slugs per I1 from the English title; one series per run:
    Durarara Gaiden and Sailor Moon Short Stories reach us through two works
    each); `discovery_ruled_unbuilt` 27 until step 2's one-row film mint exists
    (the mint runs from `/discover`, never here). `other-instrument-picks.ts
    --declare` prints the entries; an alternative telling of the OWNER's own
    instrument (Hellsing Ultimate, the Madoka / AoT / JJK compilation films) is
    research, never a mechanical mint. RESEARCH: `PROTOCOL-extras.md` (PER WORK
    + TRIAGE shapes) · `extras-context.ts` (contexts by ids / films / ovas /
    triage) · `validate-extras.ts` (the landing: shape checks, the stored-first
    recap table, `--entries` proposes the RelatedWorkRuling entries — Sean rules,
    the map decides, P10). WAVE 1 DISPATCHED (eight research-agent tasks on
    Opus, films first, popularity order, GitS swapped for THE FIRST SLAM DUNK):
    Mugen Train · Legend of Crimson · Reze Arc · Infinity Castle (Part 1) · Dawn
    of the Deep Soul · Tanya the Movie · Goblin's Crown · The First Slam Dunk;
    AniList's API disabled, the agents work from fandom / ja.wikipedia /
    official sources. CENSUS after the pass: ledger rows 728 (523 pending) ·
    same 124 · other 15 (26 of the 49 are ruled) · alternative 66 · held 266 ·
    recap 63 · original 133 · crossover 87 · promo 5 · duplicate / violation /
    stale 0 · every UI-truth class unchanged · verify-series-display 219 / 0 ·
    five bundles deployed · 241 tests · 289 rules. NEXT: wave 1 lands → validate
    → verifier → Sean rules → entries → sync → census; then wave 2 = the owner
    triage (`--targets triage --limit 10`, 128 of 266 held works); step 2's film
    mint writer after the two waves.

129. ✅ **THE EXTRAS RULINGS (Sean 2026-09-05 — all six as recommended, Cursor's
    build order) — I46 + THE PROMO BUCKET + THE RULING LAYER BUILT AND APPLIED.**
    (a) Surfacing: the filler-by-rule buckets stay LEDGER-ONLY; the wiki-list
    label rule opens with N31 at the STATUS design pass; the wiki↔halo adoption
    landed NOW as **I46 — ONE ROW PER WORK**: a wiki / ruled row that names a
    staged related work ADOPTS its AniList identity (lib/related-works.ts
    `titleMatch` / `matchRelatedTitle` / `pickAdoption`: equal cores after a
    trailing parenthetical, or containment of a name-length core; FAILS CLOSED
    — two rows fitting one work, or two works fitting one row with nothing to
    separate them, stay listed; an EXACT title beats containing ones, then the
    row's year), the halo writer removes its own duplicate (G57), census
    `related_work_duplicate` (4 → 0). Five adoptions: MHA World Heroes'
    Mission @113.1, To LOVE-Ru Darkness OVA @12.2, Cardcaptor Sakura: The
    Movie @35.1 (exactness over The Sealed Card), Yu Yu Hakusho All or Nothing
    @112.8, Golden Kamuy Sapporo Beer @49.4 — each wiki row keeps its position,
    label and note; identity is the only field written. (e) PROMO: a trailer /
    PV / teaser / commercial is never a related work — I45 AMENDED (P38, the
    music-video-only clause retired): `extraBucket` → 'promo' by title (the edge
    title reaches the bucket, so an unfetched CHARACTER-only PV is promo too),
    never fetched by stageHalo, listed as `extra_promo` (5: Bleach 20th trailer,
    Bakemonogatari PV, Evangelion x KATE CM, Jongtama PV, Jongtama x Gintama
    promo); the writer removed its three stored rows. (b)/(c) THE RULING LAYER:
    `lib/rulings/related-works.ts` (RelatedWorkRuling — anilistId, standing,
    chapter / volume / chaptersAdapted, position, note; RELATED_WORK_RULINGS;
    `relatedWorkStanding`: a ruling beats the rule) read by the writer (the
    standing, the adaptation fields, a ruled position MOVES the row) and the
    census (`related_work_violation` checks the ruled chapter too); empty until
    verdicts land (R1). `lib/anilist.ts#mangaByIds` (MANGA nodes by id) and
    MEDIA_FIELDS now stage a relation node's start year (the direction test:
    a run that began after the work is a comicalization, never a source — the
    next staging carries it). (d) `research/discovery/other-instrument-picks.ts`
    — the input list for step 2 with the run's facts (format / status /
    chapters / volumes / popularity from the staged edges; AniList's API was
    DISABLED for stability during the sitting, so the read degrades to the
    staged facts and says so, P6) and a proposed pick under Sean's threshold (a
    run of a volume / 8+ chapters / releasing → MINT; a one-shot → tie-in; 2
    chapters → hold): MINT 41 · tie-in 9 · hold 3. Two derivation gaps found and
    queued: SOURCE_CHAINS works carry no AniList ids, so a chain work
    (Prisma Illya 2wei / 3rei, JoJo Stardust Crusaders, Haruhi's per-volume
    novel nodes) reads as ANOTHER run — register chain-work ids before those
    mint; a comicalization of the film (GitS Arise, BSD Dead Apple) reads as a
    run the film adapts until node start years are staged. (f) confirmed —
    undated pairs listed, never slotted; the weekly candidate restage queued;
    UI NOTE for the design pass: the undated / announced works are the page's
    UPCOMING SCHEDULE — surfacing them is that pass's call. CENSUS:
    related_work_duplicate 0 · related_work_violation 0 · related_work_stale 0 ·
    extra_promo 5 · ledger rows 741 → 733 (518 pending) · same 149 · other 49 ·
    crossover 87 · every other class unchanged · verify-series-display 219 / 0.
    Five bundles deployed; 240 tests; 289 rules. NEXT: the extras research
    protocol + context generator → wave 1 (films-first, (b)) on Sean's go; the
    owner triage (c) another week; step 2 (films as entries) fed by the signed
    (d) picks; batch 23 wave 1 parked.

128. ✅ **THE EXTRAS SITTING, STEP 1 — I45, THE RELATED-WORKS LEDGER (2026-09-05;
    Sean ruled with Cursor: watch-order is the LEDGER of every related work;
    the three layers; the films ruling on I13). The ledger is data now —
    unsurfaced — and the sitting STOPS for Sean.** Migration 20260905170000:
    `watch_order_entries` + anilist_id / relation / origin ('wiki' | 'ruling' |
    'halo') / standing (canon | mixed | filler), unique (series_id, anilist_id).
    lib/related-works.ts (pure, 11 tests): `extraBucket` — recap (SUMMARY /
    COMPILATION or a recap title) · crossover (CHARACTER-only) · original
    (source ORIGINAL — filler by T25) · same_instrument / other_instrument by
    INSTRUMENT SETS: `adaptedNodes` = the ADAPTATION edges whose node format
    the extra's OWN source names (a novelization is never a source — MHA's
    films carry NOVEL edges and stay held), `ownerInstrumentIds` = the
    registered manga + chain works, and for a novel owner (T25 light_novel /
    novel / web_novel — a series row registers no manga id for them) the NOVEL
    nodes its own anime adapts · unknown (a source naming no instrument node:
    AniList's franchise tag with no chapters behind it, a novel film without
    its edge, a visual-novel / game source — HELD, never called filler);
    `extraStanding` (a rule decides only recap / original / crossover = filler;
    the rest pending); `extraKind` (T29's format axis); `deriveWatchPosition`
    (after the last episode aired before the work; 0.5 before ep 1; null
    without a date) + `freePosition`. lib/discovery.ts: recap + crossover
    buckets, extras proposals via extraBucket with an 'adapts …' signal,
    stageHalo fetches extras + recaps, loadDiscoveryInput carries
    ownerInstruments. `sync-related-works.ts` (HEAL standard, after
    sync-watch-order): origin-'halo' rows keyed (series, anilist_id) — kind,
    standing by rule, position ruled (RULED_POSITION_BY_ANILIST) or derived,
    note naming the bucket and the adapted work (compared on every run, no
    date stamp); never touches display_label; never deletes; skips rows owned
    by another origin. `sync-watch-order.ts` writes origin 'wiki' and deletes
    ONLY its own origin (Cursor's must-fix: it deleted every non-fractional row
    before). supabaseSource.allWatchOrder: display_label not null (N31 —
    surfacing is parked since 2026-08-24; zero labeled rows before and after,
    the page renders exactly what it did). audit-discovery: the extra_*
    classes + related_work_stale / _violation with a bucket header; recap.ts
    --scope extras (default --limit 400; the sitting runs 2000). Ledger: I45
    added (retired phrase 'an instrument source with no manga edge'); I13
    AMENDED — the films ruling (retired 're-evaluate with the watch-order
    concept'; the Kizumonogatari exclusion reworded); I19 / I42 / N31 amended.
    THE NUMBERS: extras staged 696 media (641 extras); 794 related works over
    180 owners / 877 owner pairs → 741 ledger rows (127 pairs without a
    derivable air date: listed, never a guessed slot); standing 215 filler by
    rule / 526 pending; kinds movie 296 · ova 181 · special 197 · recap 67;
    buckets same_instrument 150 · other_instrument 50 · held 291 (207 of them
    AniList's manga franchise tag or no source, with no edge — the DBZ / One
    Piece / Conan film shelves; research, not a rule) · recap 64 · original 141
    · crossover 90 · unstaged 8; 4 pairs already on a wiki watch-order list.
    The instrument sets moved 18 works out of held: KonoSuba Legend of Crimson
    + its two OVAs, Tanya the Movie, Goblin's Crown, DanMachi Arrow of the Orion
    + the hot-spring OVA, Overlord Sacred Kingdom + Ple Ple Pleiades, the
    Villainess movie + OVA, DxD NEW OVA → same_instrument; SAO Progressive,
    Fate/strange Fake, Durarara Gaiden ×2, Haruhi's Disappearance, AoT Lost
    Girls, Tokyo Ghoul Hibi, Gundam UC → other_instrument (series candidates).
    CENSUS: related_work_violation 0 · related_work_stale 0 · ruling_violation 0
    · watch_order_kind_missing 3 (the three pre-existing wiki rows, unchanged)
    · verify-series-display 219 / 0 failing · every UI-truth class unchanged.
    Explained deltas: halo_sequel_unclaimed 88 → 104 and
    discovery_new_since_sitting 20 — staged films now carry SEQUEL chains
    (KonoSuba 3 / 4 via Legend of Crimson, Made in Abyss S2 via Dawn of the
    Deep Soul, Goblin Slayer II, Tanya S2, DanMachi V / VI, Undead Unluck S2,
    the Kinnikuman and Yowamushi chains); seed_candidate 534 → 527 (those IPs
    are the halo's rows now — by design, a relation to the catalog makes a
    seed the halo's row); run_stuck 1 (afl #1044, killed 03:40 — heal-stuck-
    runs marked it). Edges: all FIVE bundles deployed (lib-hash aafcffcf).
    Research reads (research/discovery/, not rostered): count-ledger.ts,
    extras-breakdown.ts, extras-novel-detail.ts. FINDING for Sean: PV /
    trailer specials reach the ledger (BLEACH 20th Anime Anniversary Official
    Trailer, Bakemonogatari PV) — rule them out like music videos, or leave
    them ledger-only. STOP: Sean rules surfacing per bucket, the research plan
    for the 150 same-instrument works and the 291 held, the 50 other-
    instrument series candidates, and the PV question — then step 2 (films as
    entries) and step 3 (the manga watch table). Batch 23 wave 1 stays parked.
    EVENING ADDENDUM (the pause): `recap.ts --scope extras --summary` prints the
    sitting's load tables (bucket totals, the load per owner, the same- and
    other-instrument lists, PV / trailer suspects — the ad-hoc script that first
    produced them is gone, P9); the decision record
    research/discovery/EXTRAS-SITTING.md carries facts, a proposal and a capture
    path per decision (a)-(f) plus the resume sequence; 5 promotional entries
    named (Bleach 20th trailer, Bakemonogatari PV, Evangelion x KATE CM, Jongtama
    PV, Jongtama x Gintama promo); the candidate-media freshness gap (staged
    candidates are never re-fetched) logged as a sidecar in STATE.

127. ✅ **DISCOVERY BUILD, STEP 4 — G60, THE RANKINGS READER (2026-09-05; go-list
    row 6; PROPOSAL.md v2.2 §3). The seed engine: which IPs should exist at
    all.** Migration 20260905160000: `ingest_anilist_rankings` (list, snapshot,
    rank, anilist_id, raw — greedy staging kept as history, G51; service-role
    only) + the weekly pg_cron row for the FIFTH BUNDLE `refresh-discovery` (Sun
    10:30 UTC: the eight ranked lists, then the halo staging, budgeted, G58).
    lib/rankings.ts: LISTS (airing / upcoming manga-sourced TV / ONA, airing /
    upcoming novel-sourced, all-time popularity top 500 manga + top 200 novel,
    trending, MANGA-FIRST top 300 via their ADAPTATION edges — ~28 requests a
    week, adult excluded at the query), snapshotRankings, productFitScore
    (popularity × still-publishing source 1.5 × far-more-to-read 1.25 × airing
    1.2 / announced 1.1 — documented, re-tunable), seedCandidates (the latest
    snapshot per list → unowned, un-haloed, series-shaped, not ORIGINAL,
    collapsed to chain heads, scored; every seed is a new IP — a relation to the
    catalog makes it the halo's row); lib/anilist.ts#pageMedia (the one page
    query; manga lists carry their adaptation edges); lib/discovery.ts#stageHalo
    (the halo loop lifted from discovery-stage.ts so the script and the bundle
    share it); discovery-stage.ts --rankings; 5 tests. audit-discovery:
    `seed_candidate` (capped listing; a per-list header: rows / owned / halo);
    recap.ts --scope seed (the franchise-shaped sitting table). system-census
    derives the bundle list from `_src` (never a magic four); P3 AMENDED (P38:
    'all four, never a subset' retired — every bundle, five today) with
    CLAUDE.md invariant 2, the add-rule / consolidate / apply-batch skills and
    the runbook updated; the runbook's freshness map + cadence table carry the
    new row; architecture §1's AniList row names the reader; a one-hop case.
    FIRST SNAPSHOT (discovery-stage --rankings): 8 lists · 1356 rows · 28
    requests; the halo staging picked up its last 4 stragglers (263 / 263
    TV-shaped staged). seed_candidate 534: airing-manga 56 rows (owned 3, halo
    5) · upcoming-manga 100 (4 / 25) · popular-manga 500 (294 / 11) ·
    popular-novel 200 (66 / 10) · airing-novel 50 (1 / 1) · upcoming-novel 50 (0
    / 6) · trending 100 (39 / 8) · manga-first 300 (its candidates arrive
    through edges). Top of the queue: Horimiya (popular #31, trending #73),
    Bunny Girl Senpai, Violet Evergarden, Tower of God (source still
    publishing), Mushoku Tensei, Wotakoi, Quintuplets, Bocchi, Banana Fish.
    Nothing minted, nothing ruled: the queue is the sitting's input (/discover);
    a seed lands STAGED (P39). Edges: five bundles deployed (lib-hash current in
    every bundle); 225 tests; system census OK. NEXT = step 6, the
    research-batch variant (TYPE + anchors in one ask) when the first seeded
    wave is planned; the first full /discover sitting on Sean's go; batch 23
    wave 1 stays parked.
126. ✅ **P40 — NO SCRIPT DELETES A SERIES; A DELETION IS A LEDGER ENTRY (the
    durable fix after INCIDENT-2026-09-05; Sean 2026-09-05, Cursor's five-point
    list).** Migration 20260905150000_series_ledger.sql: `series_ledger` (id,
    created_at, deleted_at, note) kept by AFTER INSERT / AFTER DELETE triggers
    on `series` (security definer, so no writer can skip them), backfilled with
    the 345 living series; the census class `series_deleted_unruled` lists any
    ledger deletion no ruling names (lib/rulings/deleted-series.ts, empty today
    — the incident's six predate the ledger and were re-created).
    audit-titles.ts RETIRED to history/audit-titles-RETIRED-2026-09-05.ts and
    off the roster: its exclude() deleted canonical series against a STALE
    fixture index; its two jobs moved — the manual exclusions
    (lib/rulings/title-exclusions.ts, now carrying Shounan's ruling too: 5
    entries) are asserted by the standard healer
    assert-overrides#assertDispositions (a disposition and its note, never a
    delete; 0 asserted on the first run — all already excluded), and
    alias-corrupt pages are refused at the writer (G8, stageAfl's title / alias
    mismatch → parse_integrity: the flag IS the listing). CLAUDE.md hard
    invariant 9; the event-script trap in apply-batch, discover and consolidate
    (read it, dry-run it, or do not run it; a script with no dry-run —
    afg-expansion — is never assumed to have one); the runbook and architecture
    mentions updated; a one-hop case; I14's enforcement re-pointed. Census:
    series_deleted_unruled 0 · ledger 345 = series 345 · ruling_violation 0 ·
    identity_registry_gap 0 · edges deployed · 220 tests.
125. ⚠✅ **THE FIRST DISCOVERY MINT (Sean's go) — then INCIDENT 2026-09-05
    (audit-titles.ts deleted six series) — RECOVERED the same day (option A,
    Sean's decision; scripts/ingest/research/discovery/INCIDENT-2026-09-05.md is
    the record).** MINTED, intact throughout: trigun-stampede (151040 + Stargaze
    163144, staged, franchise trigun) and
    konosuba-an-explosion-on-this-wonderful-world (150075, staged, franchise
    konosuba) through the seed writer; the-rising-of-the-shield-hero S2-S4
    through `stitch --only rising-shield-hero` (62 eps vs AFL 25; S5 when
    dated); rows 24 + 12 via two G59-B ruled wiki pages ('Trigun Stampede' holds
    all 24 in overall numbering; the KonoSuba spin-off's own article — the
    finder had returned the franchise list) and 37 via Shield Hero's season
    pages; the 39 / 97 franchise table SIGNED (ruledBy Sean); Shounan's afl_slug
    nulled and its percent-encoded slug excluded (Sean). THE INCIDENT: to apply
    that exclusion the session ran `audit-titles.ts` (an EVENT roster entry;
    NOTE: reads a STALE fixture index) without reading it — its exclude()
    deletes the `series` row whose id equals any slug it judges corrupt, and all
    27 verdicts were false: six series deleted with cascades (chrono-crusade,
    kinnikuman, orient, kakegurui, city-hunter, elemental-gelade), four living
    series' AFL pages excluded + unstaged, 31 source_map rows flipped, 24 flags
    dismissed. No PITR (daily physical backups only, the last before batch 22's
    waves); staging, rulings maps and research files intact. RECOVERY (every
    step dry-run, then census-checked): source_map restored BY RULE
    (history/restore-source-map-2026-09-05.ts: active 303 · excluded 44 — the
    pre-incident counts); kakegurui recreated by `afg-expansion --only
    kakegurui` (AFG-typed rows, 17 AFG anchors, public); the five others by the
    seed writer under RESTORATION `series` rulings pinning old ids + chains;
    rows from Wikipedia (orient's ruled page; the finder — kinnikuman's
    franchise list component-locked on the first 137); `npm run heal`
    re-attached T6 (821 ruled rows), G53, A44 / A45, standing annotations,
    franchises, visibility (chrono + kinnikuman public by pins; orient /
    city-hunter / elemental-gelade staged); the research tier replayed from the
    verdict files in batch order with the applied overlays
    (history/restore-anchors-2026-09-05.ts: 85 anchors, 0 A47-moved, 0 refused;
    12 curated continues with C5's covered-or-not wording; 103 annotations, zone
    kinds expanded to spans as batch 17 did — verify's kinnikuman refusal caught
    the list reading); AFL pages re-fetched (`backfill --only`, new; `refix`)
    and held on parse_integrity as before — AFL's live index is alias-corrupt
    for those slugs. New tooling that stays: `backfill --only slug,…`,
    `afg-expansion --only <slug>` (note: it has NO dry-run; the session learned
    that by running it), the I2 class exempts alias-held pages (the flag is
    their listing). CENSUS after: ruling_violation 0 · 219 verified / 0 failing
    · identity_registry_gap 1 → 0 · discovery_ruled_unbuilt 2 → 0 ·
    series_staged 5 · type_default_unclassified 28 → 34 (the six default-typed
    grids) · halo_sequel_unclaimed 91 → 88 · anchor_gap_research 2 → 4,
    mu_pin_unverified 0 → 2, frontier_tail_null 7 → 9 (the seeds' and restored
    series' queues) · title_incomplete 21 → 20 (kakegurui's titles from AFG) ·
    pending_finished_no_totals +1 (a novel source). RESIDUES for Sean (DB-only
    values no map records): city-hunter + elemental-gelade were mapping_mode
    'loose' (both staged; restore by ruling and give mapping_mode a map);
    elemental-gelade's asterisk_review note; kakegurui's AFG end-frontier anchor
    (frontier_tail_null lists it); the four alias-held pages until AFL fixes its
    index. THE DURABLE FIX follows as /add-rule: no script deletes a series row
    (exclude() flips dispositions only); the fixture index is not an authority;
    a tombstone ledger + `series_deleted_unruled`; the event-script trap in
    every skill. Batch 23 and go-list step 4 waited for ruling_violation 0 and a
    completed heal — both hold now. (Commit 221b099 carried the code; this entry
    and the history move landed in the follow-up commit.)
124. ✅ **DISCOVERY BUILD, STEP 3 — I44 ADOPTION, THE SEED WRITER (G52 rostered),
    P39 VISIBILITY, THE /discover SKILL (2026-09-05; go-list rows 2, 4, 5).
    MECHANISM BUILT; THE FIRST MINT AWAITS SEAN'S GO ON THE DRY-RUN RECAP.** I44
    — identity first: resolveSeries looks the page's AniList id up in the
    registry before minting a slug; a series that owns it with no afl_slug
    (seeded / AFG-only) is ADOPTED behind the span gate (lib/adoption.ts: AFL's
    classified max within ±2 of our max or of a component boundary; a series
    with no rows adopts on identity alone), else HELD (flag kind
    `adoption_held`, its census class); a second page for a registered series is
    I12's duplicate question. Before this an AFL page for a seeded series threw
    ID COLLISION. Migration 20260905130000: the ingest_flags kind check widened
    (it still listed the five original kinds — airdate_withheld and
    source_kind_unknown could never insert), `series.visibility` (public |
    staged, default public), types regenerated. The SEED WRITER — lib/seed.ts
    (planSeed = the dry run: the walk under I21, the slug under I1, aggregate,
    the franchise membership check — a held plan is a ruling question;
    seedSeries = the write: a STAGED series row, identity, components through
    the planner; no rows, no anchors; relations from relations.ts on the next
    heal) + scripts/ingest/seed.ts (HEAL roster, EVENT: from /discover only,
    after the dry-run recap); G52 amended (the seed writer is canon-tier's
    rostered form; P38 retired its 'enforcement uncertain' clause); I42 gains
    the writer as an enforcement site; `DiscoveryRuling.chain` pins a walk. P39
    — visibility derived (lib/rulings/visibility.ts): PUBLIC when a classifier
    typed the rows (an afl / afg registration, a T6 pin, a ruled grid) or a
    PUBLISHED ruling; else STAGED — reachable by id, absent from list and search
    (supabaseSource filters); assert-overrides#assertVisibility mirrors it;
    series_staged lists what is hidden. The first live run staged six existing
    entries: four typed by ruling (clear-card, treasure-chest, kinnikuman — T6
    pins; shounan-junai-gumi — a ruled grid) were the reason pins and grids
    count; elemental-gelade and city-hunter (all-canon defaults, AFL index slugs
    whose pages never staged) stay STAGED — the honest outcome, and Sean's to
    publish by ruling. I2 gains its outcome class identity_registry_gap (1:
    shounan-junai-gumi's row carries the percent-encoded afl_slug the registry
    never held — listed for a ruling). The /discover skill
    (.claude/skills/discover/SKILL.md; CLAUDE.md workflows): stage → the
    generated recap in chat → Sean rules → maps → the dry-run recap → STOP →
    seed.ts / stitch.ts --only <slug> (new: one ruled extension at a time, the
    open count_mismatch candidates untouched) → wiki rows → heal → census → save
    point. The first sitting's rulings written (SITTINGS logged;
    discovery_new_since_sitting 267 → 3): the-rising-of-the-shield-hero's
    OVERRIDE_CHAINS extension S2 → S4 (S5 joins when dated — the standing
    practice: an undated member flips the series to upcoming); `series` rulings
    for TRIGUN STAMPEDE (151040 + Stargaze 163144, alternative → trigun,
    franchise trigun) and KONOSUBA Explosion (150075, spin_off → konosuba,
    franchise konosuba); the trigun and konosuba franchises (39 franchises / 97
    memberships). DRY RUNS (nothing minted): seed.ts — CREATE trigun-stampede
    (chain Stampede → Stargaze, 24 eps, manga 30703, staged) and
    konosuba-an-explosion-on-this-wonderful-world (12 eps, light_novel, staged);
    stitch.ts --only rising-shield-hero — EXTEND 4 seasons, 62 eps vs AFL 25.
    Census: discovery_ruled_unbuilt 2 (the two seeds, expected until the mint),
    halo_series_unclaimed 176 → 174, series_staged 2, identity_registry_gap 1,
    ruling_violation 0, no other class moved; verify 218 / 0; 217 tests; edges
    deployed; system census OK. NEXT = Sean's go on the dry-run recap → apply
    (seed, stitch --only, wiki rows, heal, census); then go-list step 4
    (rankings + refresh-discovery).
123. ✅ **DISCOVERY BUILD, STEP 2 — I43, THE FRANCHISE UMBRELLA (2026-09-05;
    go-list row 7; PROPOSAL.md v2.2 §2).** The top of the hierarchy, for IA (a
    browse page can list by IP) and for discovery (a candidate is proposed into
    its owner's IP) — never a merge: I15 / I16 stand, no chapter number, no
    standing, no totals, no lock. Migration 20260905120000_franchises.sql
    (`franchises`: id = OUR slug, title, title_native, note, base_series_id;
    `series.franchise_id` nullable — NULL is a franchise of one; public read)
    pushed, types regenerated. `lib/rulings/franchises.ts`: membership is a
    RULING — 93 entries over 37 franchises from the bootstrap (connected
    components of series_relations ∪ AniList story / PARENT / SAME_UNIVERSE
    edges between owned entries: 38 groups / 96 series), one title and one base
    per franchise, `franchise: null` for two OTHER-edge pairs ruled their OWN IP
    (fire-force beside soul-eater, witch-watch beside sket-dance — a
    shared-universe cameo is not the IP by name); Burn the Witch is the one
    membership resting on universe rather than story; `franchiseMapProblems()`
    fails the map closed. All 2026-09-05 entries are session-ruled until Sean
    signs the table (research/discovery/franchise-recap.ts, generated; --compact
    = one row per franchise). `assert-overrides#assertFranchises` mirrors the
    map (rows upserted, memberships asserted, unstated values nulled, unstated
    rows removed) — 93 asserted on the first run, 0 on the second (converges).
    Census: `series_without_franchise` (a series with a series_relations row and
    no ruling) = 0; ruling_violation (stored ≠ map; a stored franchise row the
    map lacks) = 0; every other class unchanged; verify 218 / 0. The app reads
    `franchise_id` (assemble.ts SERIES_COLS → AnimeSeries.franchiseId; the
    grouping UI is the UI pass); the discovery recap groups by franchise. I16
    amended (P38: 'IA-phase work' retired; the umbrella is I43); I43 witnesses
    yu-gi-oh (nine entries under one IP), dragon-ball, fate-stay-night,
    digimon-digital-monsters (2 of 5 owned), bleach, fire-force (ruled out),
    tokyo-ghoul (the :re umbrella Sean foresaw 2026-08-24). Edges rebuilt +
    deployed; 214 tests; system census OK. Sub-groupings stay DERIVED (a
    continuity = sequel + side_story components inside the franchise, as a DAG —
    GT and Super both sequel Z). NEXT = step 3 (identity-first resolveSeries +
    the adoption gate + `lib/seed.ts` + the I2 class + the three witnesses).
122. ✅ **DISCOVERY BUILD, STEP 1 — I42, THE CANDIDATE RULE (2026-09-05; Sean's
    go on PROPOSAL.md v2.2 §9; the design commit 73cb597).** The catalog no
    longer waits for AFL to say a season exists: every unowned AniList entry a
    story relation reaches from an owned entry is a LISTED candidate, derived
    from staging and the discovery ruling map, with a PROPOSAL that never
    writes. Built through /add-rule: `lib/discovery.ts` (pure — buckets sequel /
    series / extra / ignored; proposal precedence = a ruling for the id > a
    DECLARED open-ended I15 owner > title continuity (an ordinal → component) /
    a different manga (→ series) / else ambiguous; same manga is no signal;
    OVERRIDE_CHAINS presence means nothing) + 15 tests;
    `lib/rulings/discovery.ts` (OPEN_ENDED declarations for
    jojos-bizarre-adventure / monogatari-series / gintama; candidate rulings
    keyed `anilist:<id>` — none yet; the SITTINGS log); `discovery-stage.ts`
    (PULL roster, event: stages the halo under a budget, SEQUEL chains walked
    transitively — 242 media staged in 3 rounds); `audit-discovery.ts` (CENSUS
    roster, standard; ledger-check's auditClasses() scans it);
    `research/discovery/recap.ts` (the sitting recap, generated: stored →
    proposed → decision, a table per owner). I15 amended (the declared
    open-ended property; amendedOn). One-hop case added. Edges rebuilt +
    deployed twice (the ledger sits under the lib hash). First census on the
    staged halo: candidates 1090 (276 staged) — sequel 91 · series 176 · extra
    667 · ignored 156; TV-shaped unruled 267, of which 56 RELEASING /
    NOT_YET_RELEASED; proposals component 61 · series 179 · ambiguous 27;
    `discovery_new_since_sitting` 267 (no sitting logged yet);
    `discovery_ruled_unbuilt` 0; `discovery_ruling_stale` 0; every pre-existing
    class unchanged (ruling_violation 0; verify 218 / 0 failing); 209 tests.
    Build-time corrections: a bare number is an ordinal only as the whole short
    remainder (the first live run read '100 Years Quest' as a season count — the
    counter-witness caught the bug in its own rule); owner titles compare with
    and without AniList's '(TV)' / '(2024)' suffix; 100YQ's id is 139095. NOT
    done on purpose: no series or component minted — the mint is an event step
    from /discover after the dry-run recap, and /discover + the seed writer are
    go-list steps 3 and 6; the first sitting waits for the franchise layer (step
    2) so its recap can group by IP.
121. ✅ **BATCH 22 CLOSED (P34, 2026-09-05) + CONSOLIDATE after §12.120.** The
   batch that opened on the Boruto chain follow-up (§12.116) and became the
   T26 ADOPTION SITTING (§12.117 — a licence is not adoption; the standing
   gate, the tie loader, the label backfill) and its two follow-up waves (the
   narrow wave §12.118 — the A18 START clause; the hole wave §12.120 — the
   seven holes closed). Extracted: `lib/rulings/applied/batch-22.ts` — 25
   RulingEntries, one per curated decision across the four one-shot scripts
   (wave 1's kind override + skips + nulls + note fixes; the sitting's
   research-origin label / note pass; wave 2's deletion, the reworded
   partial, the clean chapters_adapted, the dbs-6 confirmation on the pages;
   wave 3's 46 / 47 repair, the A45 on 51, the dropped 48 rearranged, the
   48 / 50 END choice, RoK 17's round-level START, the verdict-volume
   fallback, eyeshield 53's skipped continue, ep 54's queued refutation) —
   ruleId'd and cited to the verify files; the scripts moved to
   `scripts/ingest/history/batch22-apply-{wave1,t26,wave2,wave3}.ts` with
   imports re-pointed (never run). The ledger-check refused the extraction's
   first draft for quoting a retired phrase as 'the old wording' — P38 is
   right: the register holds no exceptions for quotation. CAPTURE (P29):
   research-agent.md ×6 (a round-level anchor is provenance, not position;
   a graft promoted to a position — A13 from the other side; THE FORK IS NOT
   A PREMISE; thetv.jp's off-by-one synopsis; the fandom adapted= closure
   check; Sailor Moon's renewal space), research-batch skill ×1 (the fork
   clause in the ask rule), memory (a rule-satisfier written under a wrong
   diagnosis is still wrong). BATCH 23 SCAFFOLDED (tooling copied under P34;
   PROTOCOL + wave-1 TARGETS written, NOT dispatched — Sean's go): RoK's
   round-grain map (12, 18-41), eyeshield 54-57 (the refuted END + ep 57),
   sailor-moon 73-77 (Act 18's home + the N35 shape for the 60-act renewal
   space), beelzebub 59 (the stale finale note). Standard pass, no
   enforcement site moved; every non-zero class unchanged since the deep of
   §12.119; edges deployed (the applied file is in the lib hash); 194 tests.
120. ✅ **BATCH 22 WAVE 3 — THE HOLE WAVE, APPLIED (2026-09-05; Sean ruled
   decisions 1-5 as verified; 48 / 50 as delivered; eyeshield 54 queued).**
   The seven verify:hole rows the A18 START clause surfaced (§12.118) each
   asked for their OWN exact START with THE FORK left open — and it resolved
   three different ways, which is why it was never a premise. RECORD OF
   RAGNAROK (the far endpoint was the error): 14 → 24 [22] + rearranged +
   partial{25 pp 1-3} (A47 held the 3-page tail), 15 → 26 [25], 16 → 29 [27]
   on a page-exhaustive instrument (the fandom's page-partitioned adapted=
   fields union to each chapter's page count over chs 20-34 — the verifier
   re-derived the closure and found a 6-page gap at ch 36: not a blanket
   trust; programming-cafe's 対応表 the independent lineage, its 'ep 14 =
   ch 21' an asserted claim REFUTED on content); ep 17's stored START 20 →
   29: a batch-12 ROUND-LEVEL anchor ('{20-30 (Round 4 complete)}') never
   refined to pages — ep 17 opens on ch 29 p.25, the frame ep 16 stops on;
   continue 31 with skip language (c3Ahead = [32, 33]). RoK's boundary table
   has no rows for chs 24-30 — the verdict's two-sourced volumes landed with
   the fallback printed. BEELZEBUB (the NEAR endpoint was the error): 48 →
   110 [106], 50 → 113 [110], 58 → 118 [116] (ch 123 a forward graft, END
   stands; MU ends the entry at 121) — 102 → 115 runs forward, and the
   hole's cause was eps 46 / 47's stored END 115: the ch-115 GRAFT (the
   Koma-origin flashback, pp 8-19) promoted to a position on AFG-tier rows
   (ep 47 START 115 with {102-105, 115} — an A13 breach), CONFIRMED ON CH
   115's PAGES by the verifier (its present frame pp 2-5 is post-ch-114; ep
   47's cast list opens Kunieda / Isafuyu before ch 102 p2) → 46 → 101 [98]
   + graft{115, one-lineage}, 47 → 105 [102] + graft{115}, continues 102 /
   106 (manual tier, P8); the run is now monotonic, so 48's delivered
   rearranged was DROPPED (its own note said 'not a back-jump') and WAVE 2's
   RULED ep-51 rearranged{114-115} RETIRED (A45 — its wording 'ch 115's
   OPENING pages aired in 46/47' was backwards; the reorder lives on 46 / 47
   as graft). Sean took 48's END 110 / 50's START 110 as delivered (the
   ch-110 split is one-source; parity 111 would skip ch 110 for the reader).
   EYESHIELD 21 (a third horn): 53 canon → FILLER + graft{109 + the
   habit-reading mechanic} + divergence — anime-original (Sena sabotaged,
   Hiruma abducted, a 14-0 lead the fandom's 2008-09 pages record as '14-42
   anime / 0-42 manga'); ch 109 'Sting' is the whole Dokubari game in one
   chapter and its beats are ep 54's; 52's END 110 and 54's START 109
   confirmed on the pages. AND ep 54's END 111 REFUTED (batch 17's
   arc-boundary pin; ch 111 pp 6-19 = EPISODE 57 on three witnesses) —
   QUEUED with ep 57's own anchor, not repaired blind. SAILOR MOON (a
   negative): 72 canon → FILLER + loose_parallel{17-18} (the Spectre Sisters
   redemption; the fandom's own 'changes' line inverts the manga, where Petz
   and Calaveras die); the parity healer stamped ep 71's continue 15 with a
   C3 note (the ruled 15-17 re-tread). THE ASK'S SPACE LABEL WAS WRONG: every
   stored sailor-moon record is the 60-act RENEWAL numbering (offset vs the
   original: 1 for Acts 14-20, 2 for 23-24, 3 for 25-26); the Act-18
   observation got STRONGER (ja-WP ちびうさ dates the brooch theft to R 27 =
   our ep 73) — queued as a sized ask, with an N35 entry for the space. FMA
   13: CONFIRMED MIXED ON AN INSTRUMENT — two independently timed subtitle
   files (kitsunekko JA Netflix CC bound by its own next-episode cue; an EN
   fansub) agree within 4.5 s over 26 blocks: Arakawa extras 56.6 % / the
   2003-original act 43.4 %; AFG has no 2003 FMA page (its URL serves
   Brotherhood); the stored note's Hughes-coffee coda is NOT in the episode
   (no Armstrong cue in 751 cues) → note repairs + abridged. CENSUS: every
   class count unchanged; display 218 / 0 with ALL SEVEN HOLES CLOSED
   (beelzebub 2, eyeshield 1, RoK 3, sailor-moon 1 → 0); ruling_violation 0;
   T6 821 rows, 2 asserted (53, 72); A45 22 keys, 1 removed (51's
   rearranged); heal-anchor-volumes filled RoK 42 (ch 85 → v21, the table's
   one row); edges deployed; 194 tests. TRAPS: a round-level anchor is a
   provenance, not a position; a graft promoted to a position (A13 from the
   other side); thetv.jp's page prints the previous episode's synopsis;
   dual-language subtitle archives as a T28 instrument; MangaDex decimals
   are not stable ids; the fandom's adapted= closure is the check. THE
   QUEUE this wave opened (research): RoK's round-grain map (12 / 22 → 41
   and likely END 43 / 27 → 52 / 33 / 38; eps 18-41 unanchored); eyeshield
   54 → 109 + ep 57 (111 + ?115) + rearranged; sailor-moon 73 → Act 18 (+
   N35); beelzebub 59's stale note / START 119.
119. ✅ **DEEP CONSOLIDATE after §12.118 (2026-09-05; P21 — two enforcement
   sites had moved).** THE DEEP PROOF: the full display sweep under the A18
   START clause is exactly the seven named holes and nothing else (218 / 0
   failing; every census class unchanged); the P23 read-list for A18 is one
   batch-17 regime map (the clause only adds holes, no reason invalidated);
   for T26's parallel clause the only I40 series is DBS and its only
   side_source rows are 6 (corresponded) and 18-27 (adopted). retiresWhen
   worklist read: nothing came due (design passes, D2, AFG fixes, MU
   anime.end). Every non-zero class read by name: all pre-existing queues
   (asterisk_unreviewed 177 / permanence_candidate 52 — Sean's; no_source 39;
   pending_finished_no_totals 32; type_default_unclassified 28;
   airdate_incomplete 22; title_incomplete 21; no_instrument 13;
   integrity_total_beyond_eps 10; anchor_without_row 7 + annotation_without_row
   3 — the A42 row-less entries; frontier_tail_null 7; rearranged_zone_
   acknowledged 4; unverified_share 3; mixed_fragment_only 3;
   correspondence_incomplete 1 — DBS's standing instrument queue; anchor_
   beyond_display_total 2 — soul-eater-not N22; integrity_eps_beyond_total 1
   — fist-of-the-blue-sky; the singles). CLOSED IN THE PASS: (1) THE I41
   LABEL GATE — queued since §12.111 'behind the 55-row backfill'; the
   backfill read 0 at §12.117, so upsertAnnotation now refuses a side_source /
   chain_source whose chapters does not start with '<work label>:' (the
   trigun-18 contradiction had hidden behind a null label for a day);
   annotation_invalid 0 — after fixing the sweep's own select, which had
   omitted `chapters` and made the new gate refuse 68 labelled rows (P5: the
   audit is what proved the audit wrong). I41 record + enforcement updated;
   the fourth edge deploy of the day. (2) architecture.md gains the T26
   standing gate + the one tie derivation, the I41 label gate, and the
   display's point model with the START clause (an architecture fact had no
   home). (3) One stale live comment (gto 25-26 'CANON + side_source' →
   chain_source). Permanence: LOCKED empty, permanence_violation 0. Batch 22
   stays OPEN — the narrow queue (the seven holes: beelzebub 48 / 50,
   eyeshield-21 53, record-of-ragnarok 14-16, sailor-moon 72; beelzebub 58;
   fma 13's share sizing) is its wave 3. Gates: 194 tests, tsc, lint 0
   errors, build, ledger-check, system-census OK; pushed.
118. ✅ **BATCH 22 WAVE 2 — THE NARROW WAVE, APPLIED (2026-09-05; Sean ruled
   decisions 1-4 as verified, beelzebub 15 filler).** Five research agents
   (Opus), four verifiers (fable, R24), every value held. THE ROWS: beelzebub
   49 canon → MIXED (Tamura's vol-10 extra = the first act, five pages read on
   two uploads, sole adaptation; the novel confers no standing — T26 — and its
   documented plot never airs: the stored 'the novel supplies the plot' note
   REFUTED on three independent accounts; the pin UPDATED, never lifted);
   beelzebub 15 mixed → FILLER + graft{23} with its afg anchor DELETED at the
   manual tier (the beach tableau is ep 15's own staging, the reveal is ep
   18's — Sean took filler over the mixed + rearranged fork; the run stays
   monotonic); 16 NEW anchor 22 [21] {21-22} v3 + continue 23; 26 canon → MIXED
   + divergence + partial{51 — the Kido summons; NO page numbers: the verdict's
   'pp 1-12' was the MANGA's split and Bandai 029 contradicted half of it,
   END 51 stands on A47's unproven-tail convention}; 51 canon → MIXED, START
   115 → 114 (manual) + continue 116 + divergence + partial{115}; 27 / 28
   confirmed. fma 13 / 37 canon → MIXED (the novel segment stripped, T26; the
   Arakawa extras whole beside a story-carrying 2003-original share) — and the
   stored ep-37 side_story had named EP 13's extras: the transposition entered
   at the BATCH-18 APPLY (8f94d90), a verdict's comparison clause transcribed
   as the row's fact, then copied forward by the sitting as 'verified' — a
   curation trap now in the apply-batch skill; both records repaired in
   standing-annotations.ts, ep 13's side_story{The Military Festival vol 3,
   Dog of the Military? vol 4, the Ambitious Alchemist omake (placement
   unverified)} + divergence NEW. dbs 6 filler → CANON (T30 timeline B) — the
   verifier reached ch 3's OWN pages (Viz's free chapter, descrambled) and
   confirmed the stored note wrong / Cursor's claim right: the party visit is
   NARRATED in caption and dialogue (p2 'BULMA'S BIRTHDAY PARTY VENUE', p3
   'Boo ate all of it', p6 the slap) and the King Vegeta flashback STAGED (p5);
   the later beats depend on the visit, not the arrival; NO adopted{author};
   correspondence rows {6 ↔ 3 divergent; 6 anime_only}; the side_source note
   repaired (research tier); arcs.ts's 'ep 6 is film-only' edited; pinned
   (T30 — a parallel canon row re-derives to filler unpinned). boruto 106
   CONFIRMED filler (the SMW 'Naruto ch 700' field = one unsummarised edit
   three days after broadcast). TWO RULE ENFORCEMENT SITES CHANGED: (1) T26's
   PARALLEL CLAUSE — lib/side-source.ts: on an I40 series a correspondence
   row of ANY alignment is the T30 record and stands in for the weight-bearing
   tie (the precondition check showed alignment cannot separate B from D:
   10 canon + 4 mixed rows carry anime_only, five ruled-D rows carry
   correspondence rows — the TYPE does, T30's ruling); the tie loader
   (loadEpisodeTies / loadAllEpisodeTies) is now the ONE derivation the
   writer, the healer and the census share. (2) A18's START CLAUSE —
   src/lib/mapping.ts: the point model was END-only, so ep 51 (114-115 after
   ep 47 reached 115) hid its interior and the display painted 48 / 50 at the
   envelope and let the successor cap drag 50 to 114 (the display sweep
   FAILED); a point whose own START reaches back past the previous END is
   now a regime boundary — the rows between are honest holes (P6, A18), a
   START equal to the previous END still bridges (shared chapters). The
   clause surfaced SEVEN holes that had been interpolations: beelzebub 48 /
   50 (52 END 110 → 54 START 109-shape on this series; AFG says 50 = 110-113 —
   a back-jump block, research), eyeshield-21 53 (52 END 110 → 54 START 109),
   record-of-ragnarok 14-16 (13 END 22 → 17 START 20), sailor-moon 72 (71 END
   16 → 73 START 15 — Sean's 2026-08-24 ep-72 report, which the floor guard
   had only stopped from being dragged down); each is a verify:hole
   work-list line, none a failure. beelzebub 51 carries the A42 `rearranged`
   naming the seam. CENSUS: every class count unchanged (ruling_violation 0,
   side_source_unadopted 0, source_work_unlabelled 0, anchor_on_noncanon_row
   0); display 218 / 0 failing (holes 265 → 272 lines, the seven above);
   T6 / T30 pins 808 rows, 7 asserted, converged 0 on pass 2; edges deployed
   three times (lib, then the ledger — the hash covers both); 194 tests.
   TRAPS captured (P29): research-agent.md ×6 (a sibling adaptation's chapter
   titles = our episode titles; a wiki field's provenance from page history;
   MangaDex x.5 = sort keys, cite the UUID; Bandai Channel's HTML synopses;
   Viz's free chapters as a page route; Google's overview misattaching chapter
   ranges), apply-batch ×3 (a comparison clause is not the row's fact; a
   superseded pin is updated, never lifted; a parallel retype lands with its
   correspondence rows + pin and the arc note edited). NEXT: /consolidate deep
   (two enforcement sites moved, P21); the seven holes + beelzebub 48 / 50 /
   58 + fma 13's T28 call stand as the narrow queue.
117. ✅ **THE T26 ADOPTION SITTING — RULED + APPLIED (2026-09-05; Sean ruled
   Line B, Cursor's review sharpened the mechanism three times).** THE FORK: two
   rulings collided on one shape — a canon / mixed row whose only source tie is
   a work OUTSIDE the reading chain with no adopted{basis} (57 rows / 9 series,
   the side_source_unadopted class). Line A (batch 18 → 20: 'a licence confers
   standing') vs Line B (one-piece 50, 09-04: 'only an adoption act does').
   T26's own text already read to B while the Itachi rows carried no adopted —
   the ledger described a state the data did not hold. RULED: A LICENCE IS NOT
   ADOPTION. episodes.type measures the identified source (T25 / T27); a
   licence names a different work, which is already what side_source records;
   the standing is filler unless a specific act is cited (Kodachi's blanket
   credit and an illustrator's name are the same rejected shape). Measured
   cost: 0 anchors on all 57; mapping.ts:434 / :563 treat filler and offSource
   identically and assemble.ts:95 already sets offSource on every side_source
   row — position, coverage, frontier, continues do not move; only the badge
   changes, and the badge was the claim that lied. THE MECHANISM (/add-rule):
   lib/side-source.ts#sideSourceStandingProblem — canon / mixed + side_source
   + no adopted + NO WEIGHT-BEARING TIE (a chapter anchor / chain_source /
   side_story / unverified) → filler. WEIGHT, NOT KIND (Cursor's first
   predicate exempted graft / partial — the Itachi rows carry graft +
   side_source and would have been carved out of their own rule; T28 slivers
   weigh nothing). A44's ANCHOR_SUPPRESSED is a POSITION ruling and is NOT a
   signal (Cursor: the map holds two-page slivers beside plot-carrying side
   stories; boruto 18 fires until adopted{author} lands, as the table said).
   GATE THE STANDING, NOT THE ANNOTATION: research must be able to land
   side_source on a row Sean has not retyped (boruto 93) — so the default
   derives in the episode writer (filterEpisodeRows, ties loaded by every
   writer, BEFORE the T6 pins so a pin wins), the healer asserts it
   (assert-overrides#assertSideSourceStandings — AFTER the annotation maps and
   the pins; the dry run showed the earlier order flipping DBS 18-27 before
   their adopted existed; converged 0/0/0 on pass 2), and the census lists a
   stored row that disagrees (side_source_unadopted → ruling_violation, P30).
   8 unit tests on the sitting's own shapes. THE RULINGS: G1 → 40 prose-novel
   rows FILLER + side_source by T6 pin (shippuden 452-454/456-457 Itachi
   Shinden, 484-500 Sasuke Shinden / Shikamaru Hiden / Konoha Hiden; boruto
   93-95 親子の日, 106-111 湯煙忍法帖, 282-286 Sasuke Retsuden; black-clover
   55-56 Abareushi no Sho; fma 11-12 The Land of Sand). G2 → DBS 18-21/23-27
   Resurrection 'F' adopted{author} (原作 AND 脚本 鳥山明 — the act, not the
   licence), canon; ep 6 Battle of Gods: the 脚本 check FAILED (渡辺雄介;
   Toriyama 原作・ストーリー — Toei staff page + ja-WP) → no stamp, the default
   makes it filler + side_source, Sean's T30 load-bearing call on the shared
   arc is QUEUED. G3 → the author's own other MANGA is a chain question (I41),
   never adoption: Shonan Junai Gumi (gto 25-26) and Galaxy Knights (cobra
   10-13 — the verdict's own rowspan-4 flag, not 13 alone) onto the chain,
   side_source → chain_source with labels, the old keys retired (A45). G4 →
   boruto 18 adopted{author} (Kishimoto wrote and drew the omake), stays mixed.
   G5 → trigun 18's leftover ruling-origin side_source (re-asserted by the
   healer every pass since the 09-04 chain re-kind, invisible to
   side_source_on_chain because its label was null) retired; the standing
   entry re-kinded chain_source{Trigun Maximum: ch 1-2}. D7 → fma 37
   side_story{the two Arakawa bonus chapters} transcribed from its own note (a
   weight-bearing tie the kinds-only class could not see), type held for the
   T28 look with ep 13. APPLY-TIME CORRECTION: beelzebub 49 is the FMA-37
   shape, not G1 — its side_story is Tamura's vol-10 extra chapter (sole
   adaptation, significant); held out, canon stands on the manga share; the
   ja-WP 【小説版が原作。】 footnote proves the side_source, not adoption.
   LEDGER: T26 amended (retiredPhrases: 'an Itachi-novel row is canon +
   adopted + side_source, and that is correct'; I41's 'which is the correct
   Itachi-novel pattern'; 'canon relative to a licensed side source' — every
   standing-annotation note rewritten), 9 aliases, 4 enforcement sites, 2
   audit classes; I41 Why amended; research-agent.md ×4 + verdict-verifier.md
   updated (the 'Itachi rows have one' claim was false). LABELS: every
   side_source / chain_source row in the set starts with its work label
   (ruling entries edited; research rows via research/batch22/apply-t26.ts).
   CENSUS: side_source_unadopted 9 → 0; source_work_unlabelled 52 → 0;
   frontier_tail_null 8 → 7 (shippuden's '17 canon eps past ep 479 render
   null' were 484-500 — filler now, off the class); ruling_violation 0;
   anchor_on_noncanon_row 0; afl_anime_canon_unruled 1 (unchanged — every
   retype is a pin); display 218 / 0; edges rebuilt + deployed twice (a
   comment edit in a rulings map moves the lib hash — P3 every time); 191
   tests. NEXT: the narrow wave — beelzebub 15 / 26-28 / 51, boruto 106, fma
   37 / 13 (T28 on the manga share), DBS ep 6 (T30).
116. ✅ **THE C5 CURATION QUEUE APPLIED + BATCH 22 WAVE 1 APPLIED (2026-09-05;
   Sean ruled, Cursor's lines).** (A) THE C5 QUEUE — 17 block exits with no
   continue + 49 unnoted continues, proposed mechanically from stored spans
   (lib/c3.ts backjumpCoverage / backjumpNote; research/batch22/c5-queue.ts;
   the dry run in C5-QUEUE.md). Sean's correction, via Cursor: the thirteen
   'frontier + 1' values were the +1 habit — covered → resume AT the frontier
   chapter (112 → 343 is that shape), C1 by default because stored data cannot
   prove the chapter was closed and a few repeated pages are expected; frontier
   + 1 only when the frontier row's own forward continue says so. Overlap is
   normal: two episodes can share a chapter, a continue can land on pages the
   viewer has seen — 'never a re-read' is retired wording (P38). Applied:
   13 frontier values (bleach 158 → 267, shippuden 154 → 415 / 301 → 556,
   naruto 108 → 180, hxh 43 → 63 / 55 → 83, kamisama 18 → 50, arms 47 → 190,
   dagashi 21 → 121, hayate 21 → 68 / 49 → 129, sket 31 → 102), 3 uncovered
   END + 1 rows with the unplaced range named (conan 887 → 966, 1193 → 1121;
   ranma 30 → 56), 2 finales post_series (kowloon 13 → 83, ayakashi 12 → 28),
   all through writeCuratedContinue (C7); 49 notes stamped (already adapted
   at eps X-Y / adapted later — skip on arrival / not adapted by any anchored
   row). C5's statement gains the frontier-chapter sentence. Census:
   backjump_continue_unruled 17 → 0, backjump_continue_unnoted 49 → 0. The
   healer's covered-branch fill stays deferred — the queue is empty, the
   class is the guard. (B) BATCH 22 WAVE 1 — the Boruto follow-up (2 agents,
   verified w1-boruto.md): eps 19-23 canon confirmed + chain_source in the
   ruled Naruto Gaiden 700+N space (19 = 700+1, 700+2 … 23 = 700+9, 700+10;
   partial{700+2} shared by 19/20; three divergences); THE CHAIN STAYS THREE
   WORKS (Sean: AniList ids do not make one-shots instruments — the verifier's
   fourth/fifth-node recommendation declined): ep 39 = side_story + A44 (the
   unnumbered one-shot 満ちた月が照らす道 printed in THIS tankōbon), ep 18 =
   side_source + A44 (the 在の書 omake) beside an original half → mixed
   confirmed; 93-95 canon confirmed — the per-episode novel map (93 =
   prologue + ch 1, 94 = ch 3, 95 = ch 4 + ch 1's kunai coda; ch 2, the
   interludes and the Epilogue unadapted → abridged) landed by EDITING the
   standing-annotations entry (ruling-tier rows; an apply write would have
   been reverted by the T26 healer — the verifier's catch), label 'Naruto
   Shinden' (source_work_unlabelled 55 → 52). A44 [24] → [18-24, 39] (AFG's
   live column prints 701-710 on 19-23). T6: 10 confirmation pins.
   chain_source_unmapped 0; side_source_unadopted unchanged at 9 series (the
   T26 adoption sitting — canon + side_source on 15 Boruto rows vs the
   one-piece-50 filler + side_source line — is a BLOCK ruling, queued). Crumb:
   ep 106 carries a real Naruto ch-700 tie (chain_source or nothing). Process
   trap captured: the ask guessed 93-95 into the Mitsuki arc — quote the class
   line, add no arc guesses. ruling_violation 0; display 0 failing; A44 41
   ruled rows; 183 tests; edges redeployed.
109. ✅ **G59 THE MINT RULE (an /add-rule end to end, 2026-09-04; Sean ruled the
   lane, Cursor's naming fix: who may CREATE the grid, not an amendment of G57's
   who may DELETE).** When AFL has nothing for an entry, the grid is minted by
   exactly one ruled writer, never a research apply script, never the display:
   (A) the wiki writer from the list its finder locates — the standing path:
   **shy minted 24 rows** the moment it ran; (B) the wiki writer from a RULED
   page (lib/rulings/wiki-pages.ts) when the finder fails — **orient** (the
   finder returned the 1987 TMNT seasons; G55 refused all 18 rows) → 24 rows
   from 'Orient (manga)', **cells-at-work-code-black** (the franchise list won
   over the show's own table) → 13 rows; (C) the manual writer from a RULED
   grid (lib/rulings/minted-grids.ts + the mint-grids healer, standard roster)
   when no page exists — **shounan-junai-gumi** (a 1994-97 OVA; AFL's five rows
   held sparse by the source_map, anilist_id null) → 5 rows minted_by manual.
   G57 governs deletion; G55 + filterEpisodeRows gate every path; A42's
   synthesized row stays the display's LAG fallback only. Census class
   grid_unminted (anchors + zero rows + no ruled minter) = 0; anchor_without_row
   11 → **7** (the residue is AFL LAG — to-love-ru 39-44, cells-at-work 12/13/
   20/21, one-piece-log 7-21, bokuben 26, three single mu/afg rows — which is
   A42's case and title_incomplete's event fill, NOT this rule; corrected
   2026-09-04 per Cursor's read of the record). The minting EXPOSED a gap the census could
   not see before: **shy 1-23 unanchored** (anchor_gap_research 0 → 1, an
   honest work-list item). AND A STANDING FAULT READ AT LAST: episode_date_off_
   window had been 1 since at least 09-02 and never read (the grep covered only
   the classes a wave was expected to move) — fist-of-the-blue-sky's end_date
   was 1987-03-05, the 1984 Fist of the North Star's, written once at stitch
   time by a chain whose tail was the parent series (before ownedAnilistIds
   fenced it) and never re-derived: no writer owned a stitched series' window.
   FIXED AS A RULE: lib/window.ts#windowedEnd (P6: an end before the start is
   another media's date → null, never stored) in chain.ts#aggregate and
   resolveSeries; refreshStitchedVolatile now re-derives start / end from the
   components' head and tail (season-ordered) on every daily sweep — fotbs
   2006-10-05 → 2007-03-15; the class reads 0; 174 tests. Process capture: the
   consolidate skill now says READ EVERY NON-ZERO CLASS, not only the watched
   ones. Edges rebuilt + deployed; system census OK; ruling_violation 0;
   display 218 / 0. Next: the standing list (label backfill 55; shy 1-23 +
   tsugumomo 1-11 + the AFL-lag row-mints; identity pass; UI pass).

108. ✅ **BATCH 20 CLOSED (P34) — the apply scripts' reasoning extracted, the
   scripts retired (2026-09-04).** Two extraction agents mirrored batch-17's
   shape: `lib/rulings/applied/batch-20-waves-1-8.ts` (190 RulingEntry records
   across 54 sections — waves 1-8 + the A47 block; 126 ruledBy Sean) and
   `batch-20-waves-9-16.ts` (150 records — waves 9-16, the sidecar, the recap
   re-kind; 62 Sean), one entry per curated decision with the script's reasoning
   verbatim, rule ids resolved against the ledger (29 + distinct ids; folds →
   R21, flag dismissals → G3, holds → P16 / R3, the printed-space rebase → N35,
   the chain → T26 / I41). Eighteen one-shot scripts (`apply-wave1..14`,
   `apply-wave16`, `apply-sidecar`, `rekind-recaps`, `a47-migrate`) moved to
   `scripts/ingest/history/` (imports re-pointed; the A47 record's enforcement
   paths follow; README rows added) — never run again, never deleted (P34).
   The live gates stay in research/batch20/ (context, validate, baseline, scan,
   validate-airdates). docs/rulings.md: 1926 → **2266 rulings** over 252
   series; rulings index 57/57 imported; rosters 40 scripts / 0 history files
   rostered; edges rebuilt + deployed (the applied files are part of the lib
   hash); 173 tests; system census OK. Agent caveats recorded in the files'
   headers: method-level conventions (merge sub-blocks, derived volumes) as one
   entry each; a47-migrate's per-row moves live in the anchors' marker notes;
   the T28 six named only in WAVE7-RECOVERY.md. BATCH 20 = 16 waves + a sidecar,
   113 verdicts, §12.78-§12.108.

107. ✅ **DEEP CONSOLIDATE UNDER THE SLIVER CLAUSE — WAVE 16 APPLIED; T26 THE CHAIN
   + I41 THE SOURCE CHAIN (2026-09-04; Sean ruled).** The deep pass's rescan
   work-list was the catalog's own queue: mixed_fragment_only (16 rows / 15
   series typed mixed on fragment ties alone, no anchor). Seven agents delivered
   per-segment weights; two Fable verifiers over the Opus verdicts (w16-types.md,
   w16-anchors.md — all nine anchors verified at page level, one type move
   REFUTED). THE OUTCOME sorted the "fragments" three ways: **11 → filler**
   (chrono-crusade 8 / 14 / 17, trigun 6, hajime-no-ippo 76, black-butler 37,
   zatch-bell 122, detective-school-q 1, eyeshield-21 39 / 66, sailor-moon 36,
   tokyo-mew-mew 19 / 37 — shape-only parallels, duplicates, teases);
   **9 new anchors on significant first-time / sole-adaptation material the
   record had understated** (bleach 32 → 98, 284 → 376; naruto-shippuden 89 →
   342, 90 → 343, 213 → 482 — a THREAD SPLIT, the Konoha half of chs 342-347
   adapted nowhere else; saint-seiya 64 → 38 + ep 65 START 39 → 38; fire-force
   25 → 92 [91]; heavens-lost-property 18 → 23 AND → CANON, 23 → 32);
   **3 mixed rows position-less (A44)**: chrono 21 (the Magdalene backstory,
   load-bearing, extent unproven), bleach 46 (the whole bonus ch -17 as
   side_story), HLP 24 (two unnumbered extras); **tokyo-mew-mew 21 HELD as
   mixed** (the verifier: the only animation of ch 9's closing mew-aqua
   briefing, which launches the rest of the manga). RULED ON THE WAY: **T26 THE
   CHAIN + I41** — rosario-vampire 14 adapts the SEQUEL manga (Season II ch 1 +
   3) and came out filler under T26's single 'other work' label; Sean: the
   sequel is the same cohesive canon, told out of order (an original-Naruto
   episode adapting Shippuden chapters is never filler). Cursor named the pair:
   `chain_source` (a work on the series' READING CHAIN = the ordered sequence of
   named MANGA works; canon, out of order, POSITION-LESS; no extra rearranged
   kind — chain material is out of order by definition) vs `side_source` (a work
   OUTSIDE the chain — novels, games, parallel tellings; canon only by
   adoption); the chain is a ruling map (lib/rulings/source-chains.ts: rosario
   Season I → Season II; Trigun → Trigun Maximum) and the census checks the pair
   as MISMATCHES against it (chain_source_unmapped / side_source_on_chain —
   never 'side_source on a canon row', which is the correct Itachi-novel
   pattern) + source_work_unlabelled (the '<work label>:' convention; 55
   standing side_source rows to backfill). Applied: rosario 14 → mixed (T6 pin),
   position-less (A44), chain_source{Season II: ch 1, 3}; trigun 18 side_source
   → chain_source{Trigun Maximum: ch 1, 2}. Migration 20260904120000. ALSO this
   pass: rekind-recaps (13 rows → the `recap` kind); the G38 record amended for
   the coverage floor; four + one one-hop cases; the retire conditions reviewed
   (gantz / GTO / toriko G37 still overstated by MU — suppressions stand); the
   validate gate ignores quoted phrases. CENSUS: mixed_fragment_only 16 → **3**
   (the A44-ruled residue); sliver_only_anchor 0; unverified_share 0;
   ruling_violation 0; anchor_on_noncanon_row 0; anchor_nonmonotonic 0;
   chain_source_unmapped 0; side_source_on_chain 0; source_work_unlabelled 55
   (a new backlog class, honest); display 218 / 0; T6 asserted 14 rows; edges
   rebuilt + deployed; 173 tests. Traps → research-agent: loose_parallel adapts
   nothing unless a scene is shown; a fragment record can hide a thread split;
   the fandom's per-chapter reverse index is the sole-adaptation witness;
   zatchbell.fandom's chaps field lies; fireforce.fandom = fire-force.fandom.
   Next: P34 (the batch-20 extraction).

106. ✅ **T28 THE SLIVER CLAUSE + THE UNVERIFIED SHARE; the sidecar list APPLIED
   (2026-09-04; Sean ruled after a two-day exploration).** THE RULING, in Sean's
   words: source material carries a WEIGHT — significant (it progresses the story
   in a meaningful way; size is not the test) earns the type and the anchor, and
   the note says why when it is small; a sliver / fragment / graft / tease / page
   tie is CANON MATERIAL, never called filler, but carries NO weight: neither
   type nor anchor; it is NOTED and the note names the episode that adapts the
   chapter properly; the remainder decides the type (as for recaps); shared
   chapters across episodes are normal and documented; the sole-adaptation
   exception and relocation (A44) stand as separate axes; A47 is the clause at
   the seam. THE UNVERIFIED SHARE: a chapter certainly present whose share cannot
   be sized lands as an anchor + `unverified` annotation — a census queue
   (unverified_share), the UI can say 'cited, share unverified', revisited when
   better information lands. The road there: Cursor's chapter-number test
   ('beyond the previous anchored END') was replaced by Sean's content test
   (new material, weighed on significance) — recorded so the reasoning is not
   re-derived. NEW DATA VOCABULARY: annotation kinds `recap` (the batch-14
   reborn rows had filed recaps as `abridged`) and `unverified` (migration
   20260904100000); census classes unverified_share (the queue) and
   sliver_only_anchor (canon / mixed rows anchored on a sliver-only record — a
   significance call, never an auto-delete); the research-agent contract: every
   segment delivered with `weight: significant | sliver` and its reason, the
   adapting episode named; apply-batch: weights decide. THE RESEARCH (R1 before
   the ruling, verified R24): reborn 178's 'ch-257 bookends' were PHANTOM — no
   ch-257 material in 178 or 189, none of ch 232 in 159 (TV Tokyo's synopses,
   ja-WP's 未来編 line excludes 178-189, Marvelous' DVD copy); the fandom's
   per-episode chapter field restates animefillerlist's typing (22/22 sampled —
   ONE lineage, a trap now); ch 257 opens in ep 176 (END 256 → 257, the fence)
   and closes in ep 190; ep 177 is a wholesale recap (the recap clause). APPLIED
   (apply-sidecar.ts, 30 changes): reborn 159 / 177 / 178 / 189 → filler (T6),
   anchors deleted (A1), phantom partial / side_story / abridged rows deleted,
   `recap`{240-256} on 177 and {256-257} on 189 (the kind's first rows),
   graft{232} weight sliver on 158, partial{257 opening} on 176 + partial{257
   closing, 258} on 190; **d-gray-man 66 → filler, anchor deleted** (the sliver
   clause's first witness: one page of ch 78; ep 65 ends inside 78, ep 67
   adapts it); **tsugumomo 8 → anchor 19 + side_story** (the unnumbered vol-5
   extra — not A44: a numbered chapter is adapted; 1-11 = a next-batch gap
   target under the class threshold); **Ranking of Kings scopes** (series_id-
   keyed): main entry ends vol 12 / ch 155, The Treasure Chest of Courage
   starts vol 13 / ch 156 open-ended (four witnesses for the part-one/two seam;
   the Naruto shape), ep 10's continue 162 stands (C5 from the proven END; the
   batch-11 '165' was an uncited note), ep 23's note is the handoff pointer,
   ep 9A = the vol-11 描き下ろし (side_story), ep 1's extra re-worded; **the G38
   coverage floor**: latest_known never sits below a chapter MU's own anime-
   coverage field names, nor the volume table's last bounded chapter
   (lib/mu-latest.ts — the pure derivation split out for tests; four-knights
   103 → 120 = the witness). CENSUS: ruling_violation 0; anchor_on_noncanon_row
   0; anchor_nonmonotonic 0; sliver_only_anchor 0 (after tightening the class
   to ONE chapter token — three range rows were false positives);
   unverified_share 0; anchor_volume_mismatch 0; display 218 / 0. Edges rebuilt
   + deployed; 173 tests; system census OK. Next: P34 (the batch-20 extraction).

105. ✅ **G58 — BUDGETED EDGES: the refresh-anilist outage FIXED as a rule
   (2026-09-03; Sean asked 'did we ever address the edge function?').**
   DIAGNOSIS from ingest_runs: every daily refresh-anilist run from 08-24 to
   09-03 sat 'running' forever with fetched 0 — the edge hashed the WHOLE
   media object (averageScore / meanScore / popularity / favourites /
   trending / tag ranks / relation-node popularity move daily), so ~all 679
   media read as changed and it re-resolved ~100 series until the platform
   wall clock killed it; the 08-26 local restage (no time limit) proved the
   code itself worked. No census class read ingest_runs, so the outage was
   invisible to the cycle for ten days. THE RULE (G58, a G-family
   /add-rule end to end): (1) the change decision hashes the STRUCTURAL
   subset (`lib/anilist.ts#aniListStructural`, `resolve.ts#aniListHash`;
   2 unit tests) — the raw still refreshes on every fetch; (2) the edge
   decides BEFORE writing, resolves changed series stalest-first under
   RESOLVE_BUDGET 40 + TIME_BUDGET 110 s, and leaves a series it cannot
   reach UNSTAGED so it leads the next run (deferred, never skipped); the
   run row always closes; (3) refresh-afl gets the same wall-clock budget
   (230 s) — the healer found it killed on 08-29 ×3, 08-30 and 09-01 too;
   (4) `heal-stuck-runs.ts` (standard roster) marks runs 'running' > 6 h as
   killed; (5) census class `run_stuck` reads what is still open. PROOF:
   anilist-restage seeded the structural hashes (679 restaged), then the
   edge invoked through the cron's own `invoke_edge_refresh` path closed in
   2 min — 679 fetched, 0 changed, 0 re-resolved, status ok (the first
   closed daily run since 08-24); 16 stuck runs marked (11 anilist, 4 afl,
   1 afg). Edges rebuilt + deployed twice; system census OK; 172 tests.
   Census otherwise unchanged (ruling_violation 0, display 218 / 0).
   One-hop case 31. Watch: tomorrow's 08:10 UTC run must close on its own.

104. ✅ **BATCH 20 WAVE 14 APPLIED — dai 60-100 CLOSED; THE GAP LANE CLOSES
   (anchor_gap_research 1 → 0); A47'S EXISTENCE CLAUSE (2026-09-03; Sean
   ruled).** Seven sub-blocks landed 7/7, verified 2/2 (Fable over Opus).
   THE FINDING: wave 13's fandom window ('numbers vol 22's extra as its 207,
   so ≥ 208 = printed + 1') was an ARITHMETIC inference — five agents refuted
   it independently on chapter titles (the fandom's field is printed through
   its 335; from its 336 it is list-space inside ep 97's field, a source
   switch, not an extra — the fandom's own volumes page and the Jump+ feed
   are 348 contiguous). The N35 entry, the wave protocol and the trap were
   amended MID-WAVE and the six running agents messaged (five had already
   found it). Consequence: wave 13's eps 57-59 sat one low → repaired
   (57 → 208 [204] c209 + partial{209}; 58 → 213 [209] c213; 59 → 217 [213]
   c217 — A's START 214 refused on coco13's 途中から = A10's leading
   partial); notes replaced (they quoted list-space titles). RULED: (1) the
   seven applied with the verifier corrections — **A47 AS WRITTEN on the
   licensor's own teaser closes**: 83 → 289, 86 → 300, 92 → 320 (Toei
   「――？」/「――」; three agents had advanced past it); ep 96's '335 sliver'
   re-kinded rearranged{335} (a forward pull, not a tail); ep 75 → high;
   (2) **THE EXISTENCE CLAUSE — R3 before A47**: a trailing share credited
   by ONE source's straddle mark alone (the fandom's '281 (partial)', coco13
   / Toei stop at 280) HOLDS the END at the two-source chapter; the share
   stays in chapters_adapted, the partial says single-source — dai 80 → 280
   (delivered 281), 70 / 87 stand (249 / 303); Sean: 'HOLD makes the most
   sense given the available information'. In the A47 record + both traps.
   (3) ep 61 = A44 position-less + `side_story` (the unnumbered 番外編「勇者
   アバン」 in full, out of order — the map entry is the ruling; the reader's
   position carries over from ep 60, continue IN 220). (4) ep 100 = the
   finale 348 [345] v37 — the MU pin VERIFIED (Toei ep 100; the Jump+ feed
   第1話…第348話; en-WP list 349 = さらば!!!愛する地上よ), flipped mu →
   manual, NO continue (the manga ends where the anime does). (5) the 85-87
   reorder real and bidirectional (three simultaneous battles interleaved)
   — rearranged on all three. APPLIED: **40 manual anchors 220 → 348** (4
   A47-normalized), 29 continues, 91 annotations, 3 fence repairs, 1 A44
   row; volumes derived (0 disagreements). CENSUS: anchor_gap_research
   **1 → 0** (the LAST gap block — lane A2 CLOSED); ruling_violation 0;
   anchor_beyond_chapter_space 0; end_sliver_mismatch 0; anchor_nonmonotonic
   0; mu_pin_unverified 0; anchor_volume_mismatch 20 / frontier_tail_null 8
   / anchor_without_row 11 unchanged; display 218 / 0. Two lib RULINGS changed
   (the withdrawn fandom shift, the ep-61 A44 entry) → edges rebuilt +
   deployed (P3; the system census caught the stale hash first). Traps
   → research-agent: the existence clause; Toei's close IS teaser wording;
   an arithmetic slot inference is a hypothesis until the title test; coco13
   = the printed-space title witness; morisan3rd = per-chapter summaries
   (Wayback). → apply-batch: reconcile repairs by field across files; the
   single-source partial stamp. BATCH 20 = 14 waves, 96 verdicts; the
   pin lane (29/29) and the gap lane are both closed.

103. ✅ **BATCH 20 WAVE 13 APPLIED — dai 18-59 CLOSED IN THE PRINTED
   CHAPTER SPACE; N35 SOURCE SHIFTS BUILT; A47'S UNPROVEN-TAIL CONVENTION
   (2026-09-02; Sean ruled).** Seven sub-blocks landed 7/7, verified 2/2.
   SEAN RULED (WAVE13-RECOVERY §THE DECISIONS): (1) apply with the
   corrections — ep 28's graft → 196 printed (pp 10, 12), ep 17 → 59 + the
   relocated ch-60 beat as `rearranged`, ep 39 START on the running-order
   chapter (137 printed; the ch-134 remainder stays a `rearranged` note —
   ep 42's rule, one rule for the block); (2) **the unproven-tail
   convention**: A47's exception needs EVIDENCE of size (≤ 5 pages or
   teaser wording); position language ('the opening of ch 90') proves
   nothing, so the END advances to the furthest chapter played with a
   `partial` and the continue lands in it — dai 23 / 25 / 28 / 29 advanced
   (two agents had held, five had advanced); Sean's reasoning ('a cited
   chapter usually carries a real share; a true sliver comes with an
   explanation') recorded as an ASSUMPTION, not confirmed logic — in the
   A47 record, the research-agent and apply-batch traps; (3) **the chapter
   space is the PRINTED 348, not the lists' 349** — the session's first
   recommendation (keep 349) was expediency and was withdrawn: en-WP's
   volume list gave the unnumbered 番外編「勇者アバン」 (back of vol 13) its
   own slot and AniList / MangaUpdates / MangaDex inherited it; ja-WP and
   the tankōbon number 1-348 (verified: Viz's digital release stops at 101
   so cannot settle an English edition; the fandom's side-story page
   navigates 'previous: ch 121 (tankōbon), next: ch 122 (tankōbon)'). Same
   class as orange 39 → 22 and regenesis 260 → 255 (N35). Sean: 'the
   catalog's job is follow-along in the source'; unnumbered extras and
   one-shots are NOTED as `side_story` wherever adapted, never numbered.
   BUILT (the general mechanism, not a one-off): `sourceShifts` on the
   chapter-space ruling (`{source, from, delta}` per source; dai: en-WP /
   MU / AFG −1 from 123, the fandom −1 from 208) + `toRuledChapter(series,
   source, n, role)` — a list number ON a removed slot resolves by ROLE
   (END → the last printed chapter, START → the next), the one boundary a
   pure shift cannot express (v13's end 122 → 121); consumed by the
   wikipedia volumes backfill, applyMuFrontier, syncAnchors (chapter +
   start), applyContinua (end + continue) and `bestLatestKnown` (MU's
   349 → 348, capped at the ruled count — the coverage healer, the MU
   backfill and the refresh-mu edge now write what assert-overrides
   re-clamped on EVERY heal before: two writers fought over one column;
   the healer converges now). assert-overrides also clamps latest_known
   to the ruled space. 4 unit tests; the N35 record's SOURCE SHIFTS
   paragraph names every site; one-hop case 30. APPLIED (converted at
   write from the verdicts' list space, the note stamps `list N → printed
   M`): **42 manual anchors 63 → 216**, 27 continues, 47 annotations, the
   ep-17 fence repair; the stored volume table re-based in place (v13 =
   114-121, v14-v37 −1), the ep-100 MU pin 349 → 348 v37, ep 1's graft
   183 already printed (skipped), totals 349/37 → 348/37, latest_known
   348; ep 35's divergence on 'list 122' rewritten as `side_story` (the
   番外編 sits there, not adapted; ep 61 adapts it — wave 14 notes it).
   CENSUS, every delta named: anchor_beyond_chapter_space 0 (the guard
   held through the switch); ruling_violation 0; end_sliver_mismatch 0;
   continue_skip_unnoted 0; anchor_volume_mismatch 20 (UNCHANGED — the
   wave-9 standing set, none dai); frontier_tail_null 8 (unchanged);
   anchor_gap_research 1 (dai 60-99 — the last block); display 218 / 0;
   system census OK (the rulings-index check now skips `*.test.ts`); edges
   rebuilt + deployed three times (each lib change a deploy, P3). WAVE 14
   contract pinned in PROTOCOL.md: deliver in the PRINTED space; ep 61 →
   `side_story`; 85-87 `rearranged`; the 96-100 agent verifies the pin.

102. ✅ **BATCH 20 WAVE 12 APPLIED — four-knights 1-23 CLOSED; ONE GAP BLOCK
   LEFT (2026-09-02; Sean: "yes to all and go").** Four sub-blocks landed
   4/4, verified SOUND by one Fable verifier over the block (23 anchors, 13
   continues, 23 volumes on refetched sources; the lib moves nothing; both
   un-cross-cuts REAL — 18/19 inside ch 58, 22/23 inside ch 69 —
   programming-cafe's ch-69 dissent REFUTED on the chapter's own cast order;
   the v1-v9 volume table publisher-confirmed against Kodansha's 初出).
   APPLIED: **23 manual anchors 2 → 75** under the wave-9 fence ep 24 →
   77 [75], 13 continues, 40 annotations (+ the verifier's ep-5
   `partial`{14} — the C-part is a ch-14 tag on two sources); **the EMPTY
   volume table SEEDED v1-v9 as research-tier rows** (source 'research',
   provenance = the verdict files; the volumes backfill deletes only its
   own wikipedia rows — P8-safe) and every anchor's volume derived from it
   (0 disagreements). No retypes, no repairs, no dates (ja-WP confirms
   every stored date; the fandom's ep-23 date is the wrong one). CENSUS:
   anchor_gap_research 2 → **1** (dragon-quest-the-adventure-of-dai 18-99,
   82 rows — the LAST gap block); the seeded boundaries pass the boundary
   healer (0 dropped) and boundaries_wrong_page 0; ruling_violation 0;
   display 218 / 0. No lib change (no deploy). Traps → research-agent: two
   un-cross-cuts a few episodes apart, witnessed on the chapter's own cast
   order; a title can be the NEXT chapter's (ep 9); the licensor host moved
   (7sins-4knights.net). Next: dai 18-99 in two waves of seven sub-blocks
   (18-59, 60-99).
101. ✅ **BATCH 20 WAVE 11 APPLIED — kingdom 104-128, bleach 190-202,
   naruto-shippuden 374-392 CLOSED; THE RECAP BOUNDARY (2026-09-02; Sean
   ruled).** Eight sub-blocks landed 8/8, verified 3/3 (Fable over Opus —
   kingdom, bleach, shippuden: every chapter value sound; the lib reproduced
   all STARTs and ENDs with 0 mismatches on kingdom). APPLIED: **53 manual
   anchors** (kingdom 25 → 366-438, bleach 13 → 287-312, shippuden 15 →
   635-660), 21 continues, 31 annotations, volumes derived (two copied
   volumes wrong on kingdom); **four fence-row repairs**: kingdom 103 END
   364 → 363 [360] + span (A47 — the lib's own output; the wave-2 flag
   closed), bleach 203 START 313 + span, bleach 167 enriched (START 284,
   '284, 285, 286 (p.1-8)') with its continue 286 in front of the Amagai
   arc (Sean ruled the fence-row addition in scope; precedented at 127 /
   146), **shippuden 393 END 661 → 662 [660] v69** (the verifier confirmed
   the flag: ep 393 adapts 660-662 in full; its own continue 663 was the
   tell). REFUTED before apply: kingdom's ep-111 date "repair" + ep-110
   flag (the fandom's US labels misread as stored values — the stored
   Sunday dates were right; no G53 this wave). RULED (T6): bleach 190 →
   canon (a 15:08 clip-show recap; the recap clause), bleach 193 → canon
   (extended banter around a faithful 292-293 — the faithfulness clause;
   "no source names an original block" recorded as silence, not evidence),
   **shippuden 388 filler → MIXED under THE RECAP BOUNDARY, ruled on this
   row**: a recap is re-shown or plainly retold material that progresses
   nothing and counts for nothing; a NEWLY ANIMATED sequence of significant
   length is anime production that shapes the episode, and with scenes the
   source lacks it is original material however familiar its subject — it
   weighs toward filler, and with a real canon share (ch 656's opening
   third, sole) the row is mixed. Recorded in the T28 record, the T6 entry
   and the research-agent vocabulary (with the recycled-vs-new-drawn test).
   CENSUS, every delta named: anchor_gap_research 5 → **2** (four-knights
   1-23, dai 18-99 remain); continue_skip_unnoted 1 → 0 (FotNS 115, fixed
   §12.100); ruling_violation 0; display 218 / 0; end_sliver_mismatch 0.
   Edges rebuilt + deployed; system census OK. Mid-wave gate fix: the
   landing gates' task picker now takes the sub-block covering the MOST
   touched rows (a legitimate fence-row repair outside every range threw
   the every-row pick). CAPTURE: five wave-11 traps → research-agent (the
   kingdom fandom drops + somanystars' ±1 wobble; a repair's `old` is the
   CONTEXT's value; silence is not a finding; Narutopedia's split-share
   omission + ja-WP's 通算話 column + title ≠ content; the fence-row
   continue in front of a filler block); two → apply-batch (volume
   derivation; merge sub-blocks before A47). Next: four-knights 1-23 (the
   last mid-size block; its fence ep 24 → 77 manual, the S1 arc table in
   the wave-9 verdict), then dai 18-99 ×3.
100. ✅ **BATCH 20 WAVE 10 APPLIED — FotNS 109-151, THE LARGEST GAP BLOCK,
   CLOSED (2026-09-02; Sean ruled).** Seven sub-blocks (-w10a … -w10g)
   landed 7/7, verified 3/3 (Fable over Opus: a+b, d+e, f+g — all sound
   with corrections; nothing refuted on a chapter value). APPLIED: **40
   manual anchors 137 → 209 across all 39 canon/mixed rows**, 18 continues
   (C7), 56 annotations; the seven files merged into one episode-sorted
   list so A47 sees the next START across seams; **VOLUME DERIVED from the
   boundary table for every anchor** — the a+b verifier refuted two copied
   volumes and the derivation caught FOUR (117, 119, 123, 126; the END's
   volume is the convention) — the standing apply shape from here; seam
   overlays from the verifiers (114 → 145 = B's START; 131 → 179, C1 — ep
   133 finishes ch 179; 144 → 195 — the no-skip choice; graft{196} on 144;
   partial{154} on 119; the C3 skip note on 115's continue for its ch-151
   graft — the census's continue_skip_unnoted 0 → 1 → 0 caught the
   omission). RULED: five retypes (T6: 131 / 133 / 139 / 140 → mixed, 132
   → filler — AFL's 'Manga Canon' on 129-140 the only dissent); **ep 130
   stays canon + divergence under THE RECAP CLAUSE, a T28 amendment Sean
   ruled on this row: a recap segment does not progress the story and
   counts for NOTHING in the standing — the remainder decides (pure source
   → canon with the recap noted; source + original → mixed; nothing else →
   filler)** — recorded in the T28 record, the T6 entry and the
   research-agent vocabulary. CENSUS, every delta named: anchor_gap_research
   6 → 5 (FotNS out; 41 rows); frontier_tail_null 9 → 8 (erased's A44
   entry, §12.99); continue_skip_unnoted 0 → 1 → 0 (ep 115, fixed at
   apply); ruling_violation 0; display 218 / 0; anchor_nonmonotonic 0
   (five rearranged rows carry their rulings). Edges rebuilt + deployed;
   166 tests; system census OK. CAPTURE: the recap clause (T28 + agent);
   `chapters_adapted` as a comma list, never prose (the A47 parser reads a
   prose record as one segment — a no-op on this block; agent trap); the
   two-digit wave regex in the three landing gates. Remaining gap blocks:
   kingdom 104-128, bleach 168-202, shippuden 374-392, four-knights 1-23;
   dai 18-99 ×3 LAST.
99. ✅ **BATCH 20 WAVE 9 APPLIED + CONSOLIDATED — THE L-D PIN LANE CLOSED
   (2026-09-02; Sean: "great use of the rule and learnings … ready to go").**
   Landed 9/9, verified 4/4 (Fable over Opus; all sound, corrections at
   apply). RULED: (1) the nine as delivered — 20 manual anchors, 1 deleted
   (erased ep 12's mu pin, A1), 8 continues (erased's MOVED to ep 11 — the
   wave-6 trap), 22 annotations; (2) **erased ep 12 = MIXED** under T28's
   sole-adaptation exception, reconsidered on the rule text at Sean's ask:
   the anime's final line is ch 44's verbatim in the same setting, adapted
   nowhere else, and the manga's arc close is the rule's own example —
   `partial`{44}; the direction question (the page went on sale after
   production) is a note on the tie; the row is A44 position-less by
   ruling (an END of 44 would retire nine unseen chapters), continue 35 on
   ep 11 (C1); ep 11 → mixed; (3) code-black END 11 (A47's finale clause)
   + the ep-8 frontier (ch 17, G56) — and, OUTCOME-FORCED (P5): the display
   interpolates a row-less entry between its anchors, so two anchors across
   the reorder rendered a false back-jump (verify-series-display FAIL) →
   the whole verified 13-row map landed as a zone with `rearranged` on eps
   7 / 9, `graft` on 8 (ch 6's scene), `side_story` on 1-2 (the 出張版) —
   decision 3's "the rest with the rows" overridden by the outcome check;
   (4) G53 ×5 rows (killing-bites 11 / 12; gangsta 10-12 — the verifier's
   three, not the verdict's eight); (5) N35 ×2 (nagatoro 189 → 154;
   code-black 50 → 48; four-knights' stale 103 → a re-derive, queued);
   (6) six flags dismissed (#729 #664 #675 #782 #823 #786 — three G55
   namesake contaminations). CENSUS, every delta named: mu_pin_unverified
   8 → **0**; annotation_without_row 6 → 7 + asterisk 168 → 175 (the
   newly annotated); frontier_tail_null 8 → 9 → 8 (erased ep 12 past the
   terminal until its A44 entry landed in the same pass); ruling_violation
   0; display 218 / 0; end_sliver_mismatch 0; anchor_without_row 11
   (code-black's 13 replace its one). Edges rebuilt + deployed (the
   rulings maps); 166 tests; system census OK. **THE L-D LANE: 29/29 —
   17 confirmed / 9 wrong-in-part / 3 another work's.** Twelve MU-string
   pathologies documented across waves 6-9. CAPTURE (P29): seven wave-9
   traps → research-agent (the frontier-estimate pin, right-chapter-wrong-
   row, the sole-adaptation page-tie precedent, alias/copy wikis, G55
   namesake counts, mixed domestic date lineages + the earliest-airing
   rule, row-less reorder zones); three → apply-batch (row-less
   interpolation, CONTINUE_MOVE, the A44 entry for a retyped tail); T28's
   witnesses + erased / ranking-tcoc. Queue: five A44 candidates
   (tsugumomo 8, d-gray-man 66, reborn 159 / 178 / 189); four-knights 1-23
   (fence now manual); gangsta done. Cycle: step 1 — the next block is
   FotNS 109-151 (lane A2), awaiting Sean's go.
98. ✅ **THE A47 BLOCK SIGNED + APPLIED; WAVE 9 DISPATCHED (2026-09-02;
   Sean: "yes sign it then wave 9 go").** `a47-migrate.ts --apply`: 62
   ENDs moved off owned tails, per-row N22 marker, partial{tail} added
   where none stood, continues untouched. The outcome census then earned
   its keep twice (P5): (a) anchor_volume_mismatch 20 → 24 — four moved
   ENDs stepped back across a volume boundary with a stale volume
   (oshi-no-ko 21, saint-seiya 112, dbz-kai 93 / 132): the migration gained
   a boundary-table re-derive pass over every marked row → 20; (b)
   anchor_nonmonotonic 0 → 1 — d-gray-man 66's ONLY record is one page of
   ch 78 ('78 (approx. p13 only)'), so "X-1" moved it to 77, a chapter the
   episode never adapts: a FABRICATION the rule's mechanization allowed.
   Refined: `sliverEnd` returns `sole-segment` and never moves a row whose
   tail is its only segment (test pinned); the migration's revert pass
   restored the four such rows (d-gray-man 66, reborn 159 / 178 / 189 —
   original-plot rows quoting a sliver; A44 judgment candidates, queued for
   Sean); edges rebuilt + deployed (the third lib change today); A47's
   record amended (statement, witnesses + d-gray-man / reborn / dbz-kai,
   see + A44 / N22). Net: 58 moved, 4 reverted, 4 volumes re-derived;
   end_sliver_mismatch 0, anchor_nonmonotonic 0, anchor_volume_mismatch 20,
   ruling_violation 0, display 218/0. WAVE 9 DISPATCHED (8 agents): the 8
   remaining pins — tsugumomo, girls-last-tour + erased (bundled, one JSON
   each), four-knights (the fence of the queued 1-23 block), code-black
   (row-less, identity preface), sinbad, gangsta, nagatoro — + the
   killing-bites ep 11/12 date pair (lane B); PROTOCOL amendment
   2026-09-02b pinned (A47 in force).
97. ✅ **CONSOLIDATE DEEP after wave 8 (2026-09-02; P21 — A47 changed an
   enforcement site, and §12.95's resolve fix changed I39's).** System
   census green (ledger 277 rules + citations, one-hop 29/29, rosters,
   rulings index, generated docs, edge hash current in all four, component
   writers). Deep rescan: (a) the A47 backlog re-derived over every standing
   manual anchor through the one lib function — **62 rows, every one the
   rule's shape** (page-marked 1-5-page tails, or sliver / opening /
   flashback wording; dragon-ball-z-kai 19, d-gray-man 9, kingdom 5, reborn
   4, world-trigger / edens-zero / bleach 3, and 15 singles); the migration
   is WRITTEN (`batch20/a47-migrate.ts`: dry-run prints the block; --apply
   moves END, stamps the per-row N22 marker, adds partial{tail} where none
   stands; continues untouched — they already sit on the next START) and
   NOT run: Sean signs it as one block (the A47 record: a listing class).
   The two false positives the first run exposed (chapter ranges in note
   text) are fixed in the parser and pinned by tests. (b) I39 after the
   resolve fix: heal-structure re-planned 1 (outlaw-star), 15 current;
   ruling_violation 0. (c) `retiresWhen` worklist: 0 entries. (d)
   Permanence: 0 locked, 0 violations, 53 candidates (handa-kun new).
   (e) Standing item re-surfaced by the scopes healer, NOT a delta:
   ranking-of-kings (afl `ranking-kings`) and the-treasure-chest share
   manga 114388 with no `series_scopes` row (printed every heal since the
   entry landed; flag #432 on the main entry is a different, older
   count_mismatch — AFL classified 1 of 23) — a scope ruling for Sean (part
   one 1-155 for the main entry?). (f) Cron-borne between saves, A42-listed:
   deadman-wonderland afg-continua 13 and assassination-classroom mu 48 on
   rows AFL has not staged. CAPTURE (P29): A47 → the research-agent
   anchoring vocabulary; nine wave-8 traps → research-agent (MU
   segment-boundary convention, magazine-move count, the anthology pin, the
   volume-only error, onepiece.fandom's empty parent chapter fields, AFL's
   mixed simulcast date lineage, title-lag joins, PLUTO's 原作 trap, pixiv
   via a fetch proxy); three apply-batch traps (ranges in note text are not
   pages; the END normalizer in the apply; row-less landings by A42).
   Rules without an audit class: 83 (A47 shipped with one). Cycle: step 1
   — wave 9 awaits Sean's go (the 8 remaining pins + the killing-bites date
   pair; PROTOCOL amendment to cite A47 at dispatch).
96. ✅ **BATCH 20 WAVE 8 APPLIED + A47 THE END-SIDE SLIVER (2026-09-02;
   Sean ruled "full set, ready to proceed").** Landed 8/8 (§12.95), verified
   4/4 by Fable verifiers over the Opus verdicts (made-in-abyss, orient,
   one-piece-log, ranking-tcoc — all SOUND, no value moves; corrections
   citation-level). RULED: (1) the eight fold as delivered — every anchor at
   the MANUAL tier (P8), 29 anchors / 12 continues (C7) / 39 annotations;
   repairs ride the anchor write (made-in-abyss 25 → 26 with C1 IN 26;
   orient 113 → 115 v13; handa-kun v7 → v6; ranking-tcoc 155 v12 → 161 v13
   as a labelled floor); one-piece-log's 21-row terminal chain 598 → 653
   with C5 → 654. (2) **A47, the END-side sliver — A10's twin** (the Fable
   verifier found the ledger had no END-side rule; the same fork had been
   called 46 on orient ep 12 and 618 on one-piece-log ep 10): an END never
   advances on a ≤5-page (or teaser-worded) tail of the chapter the NEXT
   anchored episode starts on — the tail is that episode's; the position
   stays on X-1, chapters_adapted keeps the tail and a `partial` names it;
   a finale's tail stands (no owner; C1). Built as gate → edges → audit →
   ledger (/add-rule, P31): lib/sliver.ts#sliverEnd (pure; 8 tests incl.
   the two false positives the first census run exposed — chapter ranges
   in note text are not page counts; a range counts only behind a page
   marker); the apply layer normalizes through it (one-piece-log ep 10
   618 → 617 mechanically, orient ep 12 stays 46 — the dry run printed the
   move); census class `end_sliver_mismatch` (listing, Sean signs; A6);
   ledger A47 with witnesses orient + one-piece-log; one-hop case 29/29.
   (3) ranking-tcoc typing — the verifier read dic.pixiv.net's segment
   table in full: eps 3 + 5 → filler (both wholly original; ja-WP's
   ドドン / フレン), eps 1 / 7 / 8 → mixed (a confirmed tankōbon 描き下ろし
   half + an original half), 2 / 6 / 9 stay canon by default with their
   flags (one source), 4 + 10 stand; the F2/F3 chapter-map edits ride the
   annotation overlay. (4) Row-less landings by ruling: orient (AFL page
   EMPTY) and one-piece-log 7-21 (AFL lag) land as A42 anchor_without_row —
   research ahead of rows; the sourced identity tables sit in the verdicts.
   (5) G53: one-piece-log dates 2-6 (+1 day; AFL's simulcast-era column is a
   MIXED lineage — row 1 JP, 2-6 Crunchyroll US) and ranking-tcoc's 10
   titles + 10 dates (bare rows). (6) Flags #687 / #698 / #769 dismissed
   with their "no edition" answers. Edges rebuilt + deployed twice (the
   parser refinement). CENSUS, every delta named: mu_pin_unverified 15 → 8
   (the seven pins verified); anchor_without_row 8 → 11 (orient ×2,
   one-piece-log ×15 by ruling; deadman-wonderland afg-continua 13 and
   assassination-classroom mu 48 are CRON-borne between saves, A42-listed);
   annotation_without_row 4 → 6 (the same two series); title_incomplete
   26 → 25 / airdate_incomplete 23 → 22 (ranking-tcoc); asterisk_unreviewed
   161 → 168 (seven series newly annotated); ok_full 237 → 238 +
   permanence_candidate 52 → 53 (handa-kun); pending_finished_no_totals
   33 → 32 (one-piece-log now anchored); **end_sliver_mismatch NEW = 62**
   (the A47 backlog: dragon-ball-z-kai 19, d-gray-man 9, kingdom 5, reborn
   4, world-trigger / edens-zero / bleach 3 … — every one the rule's shape;
   Sean's signing queue, recommend a one-shot per-row migration in the
   batch-14 A10 style, marker-stamped per N22); ruling_violation 0; display
   218 verified / 0 failing (+1). 164 tests. The L-D lane: 22/29 checked —
   11 confirmed / 8 wrong-in-part / 3 another work's; 8 pins remain
   (wave 9 with the killing-bites date pair).
95. ✅ **WAVE 8 DISPATCHED + THE RESOLVE CALL-SITE CATCH (2026-09-02;
   Sean's post-compact go).** Census recomputed from disk before planning
   (P11 / R27): ruling_violation 1 — outlaw-star [400] span 1-24 ≠ ruled
   1-26 (I39) — where the 08-28 save recorded 0. Cause traced, not guessed:
   `resolveSeries`'s baseline component upsert wrote AniList's raw episode
   count (`media.episodes ?? anilistAired`) straight into series_components,
   bypassing `planComponents` — the SAME P5 class as the §12.94 G32
   call-site bypass (the planner's own outlaw-star test passed all along;
   the bug was the caller). The daily AniList edge re-resolved outlaw-star
   on 08-29 08:12 (series.updated_at; count_mismatch flags #1055-1056
   minted the same minute) and again today. FIX: the baseline row's span
   now comes from the planner (P2); four edges rebuilt + deployed (P3);
   heal-structure re-planned 1-24 → 1-26 (1 series, 15 current); census
   ruling_violation 1 → 0, episode_without_component 3 → 2 (rows 25-26
   back inside a component), no other class moved; 157 tests, build green.
   GATE ADDED (P30): system-census check 8 "component writers" —
   series_components may be written only by lib/chain.ts and lib/resolve.ts,
   and both must call planComponents; any other writer is red.
   FINDING FOR SEAN (not acted on — a design decision): the daily
   `refresh-anilist` edge has NOT completed a run since 08-24 — every 08:10
   run sits `running` forever (killed mid-invocation; the 08-26 restage was
   a manual run). Today's run reached staging and flipped 675 / 719 hashes
   (contentHash covers popularity / favourites / trending / averageScore —
   volatile fields, so nearly every media "changes" whenever the run gets
   that far) and re-resolved 100 series before dying. Two decisions: hash
   the STRUCTURAL subset only (G-family staging), and batch the edge the
   way refresh-afl / refresh-mu already run ("batch of 20"). Until then the
   catalog's AniList-derived fields are as of the last completed sweep.
   WAVE 8 dispatched (8 research-agents): L-D ×7 = the mu_pin_unverified
   census head (handa-kun, uq-holder, orient, made-in-abyss,
   masamune-kun-s-revenge, ranking-of-kings-the-treasure-chest-of-courage,
   pluto) + one-piece-log-fish-man-island-saga's true terminal (lane A1;
   its franchise-frontier pin was refused §12.94). PROTOCOL amendment
   2026-09-02 pinned (R31); two asks carry the identity preface (bare or
   missing rows). The killing-bites ep 11/12 date pair is deferred to wave
   9 under the 8-agent cap (P12). Wave 9 queue = the 8 remaining pins
   (tsugumomo, girls-last-tour, four-knights, cells-at-work-code-black,
   magi-sinbad, gangsta, erased, nagatoro) + killing-bites.
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
