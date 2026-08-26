# The rules ledger

> GENERATED from `scripts/ingest/lib/ledger/*.ts` by `scripts/restructure/gen-docs.ts` — do not edit by hand. Edit the record, run `ledger-check`, regenerate. Rulings (per-series instances) are in `docs/rulings.md`.

## Where things go — the five kinds

| kind | what it is | home | direction of truth |
|---|---|---|---|
| **Rule** | a universal predicate (A1, sliver, ownership guard) | a ledger record → lib gate → audit class → this file | ledger → code → audit (spec first; never generated from code) |
| **Ruling** | an instance for one series/episode/franchise | a typed map in `scripts/ingest/lib/rulings/` → `docs/rulings.md` (generated, keyed by series) | code map → generated index |
| **Architecture fact** | how the system is built | `docs/architecture.md` | prose |
| **Process** | how a session works | the skill + `docs/changelog.md`; a P-row here only where an agent must cite it | skill text |
| **Trap** | a source or pipeline lie | `.claude/agents/research-agent.md` / `.claude/skills/apply-batch` traps | agent/skill text |

**Capture routing:** a rule → record + gate + audit class · a source trap → research-agent · a pipeline trap → apply-batch · a ruling → the map (with reason) · a process fix → the skill + changelog.

## Family strip — one line per rule

**A — Anchors & position** (41)
- `A1` Filler / anime-only rows never carry anchors — aka `invariant 6`, `hard invariant 6`, `A1 rule`, `filler rows never carry anchors`
- `A2` Cameo / sliver borrowings are never anchors — aka `A2/A3`, `cameo rule`, `cameo/sliver borrowings`, `A2/A3 rejected-as-anchors`
- `A3` Exact per-episode adaptation always becomes an anchor — aka `GTO lesson`, `GTO 20/21 lesson`, `rearranged-zone rule`, `rearranged zones`
- `A4` Series coverage = furthest chapter adapted in the run — aka `A4 rule`, `coverage = max`, `coverage = furthest adapted`, `Ippo finale lesson`, `A4 finale rule`, `A4 coverage=max`
- `A5` D4: the A1 gate at the AFG writers — aka `D4`, `A1/D4`, `A1 / D4 chart`, `A1 / D4 episode-type refusal`
- `A6` An A1 hit is a triage fork, never an auto-delete — aka `A1 triage`, `Toriko deletion`, `Toriko deletion precedent`, `A1 outcome verification`
- `A7` Proven zone-level-only knowledge is acknowledged, not open — aka `zone-acknowledged`, `zone-acknowledged marker`, `acknowledged approximation`
- `A8` END = last mainline chapter in running order (honest record) — aka `END = running order`, `honest record`, `anchor = honest record`, `finale anchors to what it adapts`, `END definition`
- `A9` An END below its START is lifted to the max adapted chapter — aka `running-order END normalization`, `running-order END convention`, `Dagashi S1 normalization`
- `A10` Sliver rule: START = first chapter animated — aka `sliver rule`, `START = first chapter animated`, `A1 + sliver rule`
- `A11` Majority rule for START (superseded by the sliver rule) *(superseded)* — aka `majority rule`, `START majority rule`, `first FULL chapter rule`
- `A12` Relocated openers are never the START — aka `AoT ep-87 rule`, `AoT-87 rule`, `relocated openers`, `relocated openers are never the START`
- `A13` An episode row displays the FIRST chapter it animates — aka `first-chapter ruling`, `first-chapter display`, `episode display = FIRST chapter animated`, `display shows START`, `display anchors at starts`, `display/continue split`
- `A14` An exact record outranks any derivation — aka `Gintama ep-35 rule`, `Gintama ep-35 report`, `exact record outranks derivation`, `exact-record-outranks-derivation`
- `A15` Derived start = prev end + 1, clamped, never across reorder — aka `derived start fallback`, `derive guard`, `prevEnd+1 derivation`
- `A16` Successor-span cap on derived starts — aka `successor-span cap`, `one-chapter-dip class`, `successor cap`
- `A17` A backwards-jumping successor never sets its predecessor — aka `AoT-87 extension`, `AoT-87 rule (extended)`, `predecessor floor`, `backwards-jumping successor`, `Sailor Moon ep-72 report`
- `A18` Reorder regime: formulas never bridge a reorder — aka `reorder regime`, `formulas never bridge a reorder`, `MHA 107/113 report`, `reorder hole`
- `A19` Research/manual anchors render AS STORED, even non-monotonic — aka `non-monotonic display ruling`, `as-stored rendering`, `render as stored`, `C3 out-of-order zones (b15)`
- `A20` Derived AFG anchors keep only the non-decreasing trend — aka `anchor monotonicity`, `LNDS`, `spike filter`, `derived-tier monotonicity`, `divider/LNDS derivation`
- `A21` Start-sanity guard on derived rows — aka `start-sanity guard`, `start sanity`, `Oshi ep-4 lesson`
- `A22` Block-end aggregate anchors are a deprecated shape — aka `block-end anchors deprecated`, `block-end aggregate anchors`, `arc-block anchors`
- `A24` Anchor tier precedence at the (series, episode) key — aka `continua precedence`, `curated precedence`, `anchor precedence`, `anchor tier precedence`, `HxH ep-140 lesson`, `one-anchor-per-episode PK`
- `A25` Curated-consistency: derived rows never contradict a ruling — aka `curated-consistency`, `curated-consistency precedence`, `Boruto ep-219 lesson`
- `A26` MU pin redundancy keys on the pin episode — aka `MU pin redundancy`, `pin-episode redundancy`, `MU-pin episode-keyed redundancy`, `AoT 88-89 lesson`, `AoT 88-89 report`
- `A27` Anchor freshness: a stale frontier stays truthful-but-old — aka `anchor freshness`, `stale frontier`, `stale-anchor class`, `anchor-freshness rule`, `MU class C`
- `A29` Bonus / fractional chapters: record, never drop — aka `Vanitas lesson`, `Vanitas amendment`, `bonus/fractional chapters: record, never drop`, `fractional anchors`
- `A30` Full adaptation record: chapters_adapted in adaptation order — aka `full adaptation record`, `full-record ruling`, `full-record protocol`, `chapters_adapted`
- `A31` Re-use never anchors; sharing never moves position — aka `re-use never anchors`, `shared chapters`, `re-use is true data`, `sharing never moves position`
- `A32` Anchors never encode resume positions — aka `anchors never encode resume positions`, `mu-558-as-anchor`, `MU resume pointer`
- `A33` Anchor-aware interpolation between confirmed points — aka `anchor-aware interpolation`, `anchored interpolation`, `piecewise interpolation`
- `A34` Beyond the frontier, the honest estimate is no estimate — aka `Kenshin rule`, `beyond-frontier rule`, `beyond-frontier null rendering`, `beyond-frontier honesty`
- `A35` Frontier-tail triage: three causes, never auto-fix — aka `frontier-tail triage`, `frontier_tail_null triage`
- `A36` Section envelope: a header shows the true span of its rows — aka `section envelope`, `section header envelope`, `partial knowledge renders as partial`
- `A37` Tail honesty: no manga_only tail without a reached frontier — aka `tail honesty`, `coverage gate`, `tail honesty / coverage gate`, `anchorsReachEnd`
- `A38` latestKnown synthesis for finished, anchor-less entries — aka `latestKnown synthesis`, `coverage synthesis`, `synthesized coverage`
- `A39` Canon gap >12 episodes between anchors = research target — aka `anchor_gap_research target`
- `A40` Loose series: anchors are borrow-maps, exempt from integrity — aka `loose exemption`, `loose ruling`, `borrow-maps render as stored`, `mapping_mode loose`
- `A41` A rearranged/graft annotation settles a reorder for audits — aka `ruled reorder exemption`, `rearranged/graft exemption`, `settled reorders`
- `A42` An exact anchor with no episode row synthesizes the row — aka `anchored row-less episodes`, `cells-at-work 12/13 lesson`, `cells-at-work 12/13`
- `A43` Annotations are first-class; asterisk review is a queue — aka `asterisk model`, `asterisk review workflow`, `annotations are first-class`, `episode_annotations`

**C — Continue-read regimes** (9)
- `C1` C1: a mid-chapter ending continues in the straddled chapter — aka `C1 rule`, `mid-chapter straddle`, `mid-chapter END`, `straddled chapter`
- `C2` C2: continue-read = anime parity — aka `C2 rule`, `anime parity`, `parity continue`, `continue-read = anime parity`, `C2 ANIME-PARITY continue rule`
- `C3` C3: a parity continue below covered chapters notes the skip — aka `C3 rule`, `skip notes`, `skip-on-arrival note`, `C3 skip-note predicate`, `C3 clarification`
- `C4` C4: single-source-final — aka `C4 rule`, `single-source-final`, `single-source final`, `do-not-demote`
- `C5` Continue-read is a regime choice governed by coverage — aka `continue-read regimes`, `regime choice`, `continue point (b17)`, `continue point`, `C1 C2 C3`, `continue-read = a regime choice`
- `C6` continue_kind vocabulary: parity \| unseen \| post_series — aka `continue_kind`, `continue_kind vocabulary`, `parity | unseen | post_series`
- `C7` Curated continue metadata survives writers and healers — aka `parity-continue preservation`, `continue fields survive re-derive`, `curated continues`, `CURATED_CONTINUES`
- `C8` AFG continue-from is reading guidance, not the frontier — aka `continue-from is guidance`, `continue-from-is-guidance`, `sanity band`, `40-chapter band`, `three-numbers model`
- `C9` Default continue = anchor end + 1 (superseded by C2) *(superseded)* — aka `continue-reading points`, `end+1 default`, `default continue = end + 1`, `apply-continue-points`

**T — Typing & taxonomy** (24)
- `T1` Episode-type vocabulary: four stored tokens — aka `four tokens`, `AFL class map`, `CLASS_TO_TYPE`, `episodes.type vocabulary`, `type_corrections allowed types`
- `T2` Episode-type semantics (Sean 2026-08-25) — aka `episode-type semantics`, `Sean's vocabulary`, `typing vocabulary`, `filler = zero canon`, `consensus-canon`, `mixed = canon AND non-canon`
- `T3` Filler = outside both canons (b17 D3 form) *(superseded)* — aka `b17 D3`, `outside both canons`, `b17 D3 form`
- `T4` Typing precedence: override > AFL > AFG (advisory) — aka `typing precedence`, `AFL/AFG advisory`, `AFL is the type authority`, `fandom + accounting beats AFL`, `AFL label past table stop`, `override > AFL > AFG`
- `T5` AFL wins, always (2026-08-22 form) *(superseded)* — aka `AFL wins`, `AFL wins, always`, `AFL owns episode types`
- `T6` Retypes are standing rulings in EPISODE_TYPE_OVERRIDES — aka `EPISODE_TYPE_OVERRIDES`, `episode-type overrides`, `eyeshield ep-74 lesson`, `retype stays research-tier`, `type corrections via overrides`, `assert-type-overrides`
- `T7` Chapter overlap never proves filler (zatch-bell lesson) — aka `zatch-bell lesson`, `overlap rule`, `overlap ≠ filler`, `chapter overlap never proves filler`
- `T8` Rehash with nothing new = filler; mixed needs new canon — aka `rehash rule`, `overlap discount clause`, `A-5`, `rehash = filler`, `rehash discount`
- `T9` Consensus-original class: declared canon side story — aka `Boruto/Black Clover precedent`, `consensus-original class`, `author-declaration discriminator`, `licensed canon side story`
- `T10` Only-ending class: filler + annotation + asterisk (X) — aka `only-ending class`, `only ending`, `X 21-24 class`, `X only-ending`
- `T11` Caught-up-padded-out class: padding is filler (DSQ) — aka `caught up, padded out`, `caught-up-padded-out class`, `DSQ class`, `padded finale`
- `T12` Contested-ending class: all canon, annotated (Evangelion) *(planned)* — aka `contested canonical ending`, `contested-ending class`, `Evangelion ending class`
- `T13` Any final-episode debate is annotated — aka `final-episode debate annotation`, `ending-debate annotation`, `ANY debate about final episodes`
- `T14` anime-only-canon ≠ anchor desert (Black Clover lesson) — aka `Black Clover lesson`, `anime-only-canon ≠ anchor desert`, `anime-only-canon has no chapter counterpart`
- `T15` AFG-expansion typing: the row flag must be mapped — aka `eyeshield lesson`, `AFG-expansion typing`, `flags must be mapped`, `AFG-expansion typing sweep`
- `T16` AFG '* Filler' title marker is annotation, not a name — aka `AFG title-marker rule`, `* Filler marker`, `eyeshield title report`, `AFG "* Filler" title-marker rule`
- `T17` Base-type padding: gaps take the series’ own base type — aka `base-type padding`, `canon-default typing`, `canon-tier spans`, `canon-default`
- `T18` Legend by count: badges from data, not source-type branches — aka `legend by count`, `legend-by-count`
- `T19` Type-badge vocabulary (display) — aka `type-badge vocabulary`, `TypeBadgeKind`, `sections never arcs`, `anime_only badge`, `manga_only badge`, `display vocabulary`
- `T20` source_type derivation (AniList source + country) — aka `source_type derivation`, `sourceType`, `source typing`, `source_type vocabulary`
- `T21` Derivative-manga rule (Evangelion class) — aka `derivative-manga rule`, `Evangelion class`, `Evangelion/Madoka class`
- `T22` manga_status vocabulary and the 'anime_only' homonym — aka `manga_status vocabulary`, `MANGA_STATUS_MAP`, `manga_status 'anime_only'`, `hasSource`, `anime_only homonym`
- `T23` Format is orthogonal to canon standing — aka `format ⟂ canon standing`, `format-is-orthogonal`, `format is orthogonal to standing`, `never overload episodes.type`
- `T24` LN instrument ruling: volume-space for light novels *(planned)* — aka `LN instrument ruling`, `LN class`, `light-novel instrument`, `Queue 3 LN ruling`, `LN volume-space instrument`

**N — Numbering, counts & chapter spaces** (31)
- `N1` Episode-floor invariant — aka `episode-floor invariant`, `episode floor`, `floor rule`, `EXTRAS_ADOPTED`
- `N2` Lone-row overshoot is a typo candidate — aka `floor-rule typo lesson`, `eyeshield-21 155 lesson`
- `N3` The community-consensus episode count is the truth — aka `community-count rulings`, `community-count rule`, `community count rule`, `numbered-vs-event rule`, `COMMUNITY_COUNT_OVERRIDES`
- `N4` Movies count only when numbered — aka `movies count only when numbered`, `movies rule`, `Initial D rule`, `order-only components never count`
- `N7` Numbered-specials research trigger — aka `numbered-specials research trigger`, `REVIEWED_NUMBERED_SPECIALS`, `numbered specials trigger`
- `N8` Recap rule — aka `recap rule`, `Monogatari precedent`, `excluded_recap`
- `N9` In-between entries live at fractional positions — aka `fractional ruling`, `mashle ruling`, `fractional in-between entries`, `fractional numbering convention`
- `N10` Fractional wiki labels prove a shared numbering space — aka `fractional wiki labels prove a shared space`, `fractional evidence`
- `N11` Source numbering translation (the Ryuusui lesson) — aka `source numbering translation`, `Ryuusui lesson`, `Dr. Stone / Ryuusui lesson`, `numbering-space translation`, `SOURCE_NUMBERING_SHIFTS`, `shift verification`
- `N12` A shift names the source spaces it applies to — aka `per-source numbering spaces`, `mashle lesson (spaces)`, `source spaces`
- `N13` Anchors and annotations translate like episode rows — aka `anchor numbering translation`
- `N14` Research anchors convert to OUR numbering at apply — aka `anchor numbering conversion`, `Haikyu ep-85 lesson`
- `N15` Continua episode conversion from MAL-style numbering — aka `AFG episode-numbering conversion`, `continua numbering conversion`
- `N16` AFG numbering alignment gate (±12) — aka `AFG numbering alignment gate`, `AFG alignment gate`, `alignment gate`, `±12 alignment`, `AFG numbering alignment`
- `N18` Per-series episode rulings apply in a fixed order — aka `episode-row ruling order`, `episodes writer gate`, `filterEpisodeRows`
- `N19` Merge within the TRANSLATED range; purge the stale zone — aka `stale-zone healing`, `translated-max merge boundary`
- `N20` Shift-ruled counts never include dropped rows — aka `YYH class`, `community-count restructure heal`
- `N21` Shifts are declared, never inferred — aka `declared shifts only`, `Sean's UY report`, `title-alignment verification`, `WIKI_NUMBERING_SHIFTS`
- `N22` Chapter-NUMBER space, not chapter-count space — aka `Tokyo Ghoul 144/143 rule`, `Tokyo Ghoul rule`, `count-space vs number-space`, `chapter-number vs chapter-count spaces`, `chapter-number space`, `one display, one space`
- `N23` Same-edition band (0.8) — aka `same-edition band`, `same-edition band (MU latest)`, `0.8 band`, `sameEditionLatest`
- `N24` Effective total: MU latest bounds the denominator — aka `effective total`, `effectiveTotalChapters`
- `N25` Manga totals from AniList, else latest (superseded) *(superseded)* — aka `manga totals (§2)`, `latest not total`
- `N26` Chapter-floor invariant — aka `chapter-floor`, `chapter-floor invariant`, `chapter floor`, `Kakegurui 9 lesson`
- `N27` Every latest_known writer uses bestLatestKnown — aka `latest_known writer gate`, `Sean's standing rule (use the best info available)`, `best-available latest_known`, `bestLatestKnown`
- `N28` Chapter-space gate (all anchor writers) — aka `D1 chapter-space`, `chapter-space gate`, `chapter-space gates`, `chapter-space gates (all anchor writers)`, `Boruto ch-710 class`, `Slime/4KOTA class`, `out_of_space`
- `N29` Chapter-string parsing: trailing chapter is the end — aka `chapter-string coverage end`, `lastChapterNumber`, `chapterInRange`
- `N30` Spinoff/bonus chapters are labeled, never mainline numbers — aka `spinoff/bonus labeling`, `bonus chapters never mainline`
- `N31` Watch-order entries: canonical, surfaced only by ruling — aka `watch-order entries: canonical + surfaced-by-ruling`, `watch-order entries`, `RULED_LABELS`, `surfacing parked`
- `N32` Watch-order v2: entries render and count as units *(planned)* — aka `watch-order v2 unit rendering`, `fractional watch-order positions`, `the reference point (watch order)`
- `N33` Every non-main entry carries its reasoning in data — aka `research-logged non-main entries`, `non-main entries carry the why`
- `N34` Episode totals derive, then floor, then cap — aka `episode totals derivation`

**I — Identity, franchise & structure** (38)
- `I1` Our slug is the identity — aka `identity`, `our slug is identity`, `canonical identity is ours`, `own-slug identity`
- `I2` Identity registry: every external id maps INTO our id — aka `identity registry`, `registerIds`, `ID COLLISION`, `series_external_ids`
- `I3` AFG↔canonical registration by evidence strength — aka `registration tiers`, `AFG match tiers`, `identity-first, flag-first`
- `I4` A title key two series claim never auto-matches — aka `ambiguity rule`, `the ambiguity rule`, `needs_ruling`
- `I5` One AFG id per series; a registration is never overwritten — aka `one afg id per series`, `registration never overwritten`
- `I6` MangaUpdates identity only via the MangaDex bridge — aka `MU identity bridge`, `MangaDex bridge`, `MangaDex-bridge-only identity`
- `I7` AniList is the naming authority — aka `naming authority`, `AniList naming authority`
- `I8` Match ladder: source_map → seed → title → synonym → flag — aka `match ladder`, `match confidence order`, `matching ladder`
- `I9` One AniList id per AFL slug — aka `one AniList id per AFL slug`, `match duplicate`
- `I10` AniFiller seed is a matcher fact, never shipped data — aka `AniFiller seed`, `seed is a fact only`
- `I11` Dispositions are durable rulings, not cache state — aka `titles:excluded`, `MANUAL_EXCLUDE`, `dispositions`, `source_map dispositions`
- `I12` Duplicate AFL pages: more classified episodes wins — aka `duplicate rule`, `more classified episodes wins`
- `I13` Standalone movies/OVAs are excluded by disposition — aka `movies/OVAs excluded`, `movies are OUT of v1`, `movie/OVA exclusion`
- `I14` Alias-corruption victims are excluded, not repaired — aka `alias-corruption exclusion`, `stolen slug`
- `I15` One continuous story = ONE series — aka `franchise baseline`, `one story = one series`, `one continuous story = ONE series`
- `I16` Narrative shifts, remakes and spin-offs are separate series — aka `Naruto→Shippuden pattern`, `Naruto/DragonBall baseline`, `major narrative shifts = separate series`, `remakes are separate`
- `I17` Relation kinds and direction — aka `relation kinds`, `relationship direction`, `series_relations vocabulary`
- `I18` AFL page boundaries are a hypothesis, not ground truth — aka `one AFL page = one series prior`, `franchise evaluation`, `AFL page boundaries are the starting hypothesis`
- `I19` In-flow movies/OVAs join their series as kind components — aka `in-flow extras stay in`, `in-flow movies/OVAs`, `bridge formats`, `component kind`
- `I20` AFG structuring is evidence, never mirrored — aka `AFG as story-flow reference`, `AFG structuring is evidence`, `ruled splits stay split`
- `I21` Ownership guard: a walk never enters another series' entry — aka `ownership guard`, `Sean's :re ruling`, `ownedAnilistIds`
- `I22` Early-stop: the walk halts once the target is covered — aka `early-stop`, `chain early-stop`, `walk refuses ambiguity`, `MAX_CHAIN`
- `I23` Prequel-hijack fallback — aka `prequel-hijack fallback`, `prequel side-story fallback`, `Berserk Memorial class`, `MONSTERS ONA`
- `I24` Stitch candidacy: AFL classifies MORE than aired — aka `stitch candidacy`, `scope-audit gate`, `lumped page`, `lumped-page signature`
- `I25` Finalize gate: the chain must cover AFL's numbering ±2 — aka `stitch finalize gate`, `finalize gate`, `±2 gate`, `±2/lag finalize gate`
- `I26` Lag rule: excess that fits the newest component is AFL lag — aka `lag rule`, `airing-lag allowance`
- `I27` Ruled extensions run beyond the AFL page — aka `ruled extensions`, `ruledExtent`, `AFL-lag class`, `Kingdom/Beastars/Black Butler class`
- `I28` An extension never re-keys or renames a series — aka `extension is structure only`, `id/title stable`, `id/title/afl_slug never change`
- `I29` AFG extension merges, never replaces — aka `AFG extension (merge, never replace)`, `afg-extend`, `merge-never-replace`, `extend candidacy by structure`
- `I30` Expansion identity: exact-match-or-flag — aka `expansion guards`, `exact-match-or-flag`, `dedup guard`
- `I31` Expansion is stitch-aware — aka `stitch-aware expansion`, `expansion is stitch-aware`
- `I32` AFL-range merge: refresh rewrites only AFL's own range — aka `AFL-range merge`, `AFL-range merge rule`, `AFL-range merge on refresh`
- `I33` Episodes outrunning the structure trigger reconciliation — aka `structure reconciliation`, `reconcile-structure`, `AoT Final Chapters finding`
- `I34` Stitched-series guard: refresh never touches structure — aka `stitched-series guard`, `stitcher ownership`, `refreshStitchedVolatile`
- `I35` No degenerate component spans — aka `no degenerate component spans`, `Santen Sensou-hen lesson`, `degenerate span`
- `I36` Source-scope: an entry shows ONLY its own range of the manga — aka `source-scope enforcement`, `source-scope rule`, `the Naruto bug`, `scope leakage`, `series_scopes`
- `I37` Continuation handoff: adjoining sibling scope = flow — aka `continuation handoff`, `claimed continuation → handoff`, `continues in X`
- `I38` The source manga is the ADAPTATION edge of type/format MANGA — aka `manga link selection`, `anime→manga linkage`, `pickManga`

**G — Gates & freshness (sources)** (44)
- `G1` The flag rule: nothing suspicious auto-applies — aka `flag rule`, `the flag rule`, `the confirm queue`, `nothing suspicious ever auto-applies`
- `G3` Recurring conditions flag once; only Sean dismisses — aka `fileFlagOnce`, `once-per-open-kind`
- `G4` Permanent conditions leave the open queue *(planned)* — aka `dismissed_permanent`, `permanent-flag disposition`, `A-8`
- `G5` Authority tiers: who writes canonical, who only flags — aka `reliability tiers`, `priority of authority`, `authoritative sources write canonical`
- `G6` AFL table and Quick List must agree, else held — aka `Table/QuickList integrity`, `parse_integrity (AFL)`
- `G7` AFL row parse: ep 0 real, conflicting types kept — aka `AFL row parse contract`, `episode 0 is real`
- `G8` Alias defense: never stage another show's page — aka `alias defense`, `alias-corruption defense`, `AFL alias corruption`
- `G9` Hash gate: identical content is never rewritten — aka `hash gate`, `content-hash gate`, `staging hashes make re-runs no-ops`
- `G10` Large-diff hold: >20% type churn is a parser break — aka `large-diff hold`, `large_diff`
- `G11` Empty hold: zero classified episodes is not published — aka `empty hold`
- `G12` Sparse guard: <60% classified is held, auto-returns — aka `sparse guard`, `sparse-classification hold`, `sparse hold`
- `G13` Count mismatch >12 is an informational flag — aka `count mismatch`, `count mismatch (informational)`, `COUNT_MISMATCH_THRESHOLD`
- `G15` Conditional GETs: a 304 costs the host nothing — aka `conditional GETs`, `change detection before download`
- `G16` Etiquette is non-negotiable: delay, UA, credit — aka `etiquette`, `scraping etiquette`, `crawl-delay`, `no randomized intervals`
- `G20` AFG parse guards: strict cells, dividers, placeholders — aka `strict episode-cell parse`, `AFG page parse guards`, `no digit-mashing`
- `G22` AFG continua: every page is a frontier source, gated — aka `AFG continua source`, `continua full-source ruling`, `full-source ruling`, `afg-continua`
- `G23` Continua identity guard: the heading must name us — aka `continua identity guard`, `identity guard`
- `G26` CONTINUA_SUPPRESSED: per-series source suppression — aka `CONTINUA_SUPPRESSED`, `source suppressions`, `Claymore precedent`
- `G27` Continua END must agree with the page's own chart *(planned)* — aka `continua-vs-chart cross-check`, `continua chart cross-check`
- `G28` After a parser change, restage from stored raw — aka `restage from raw`, `staging freshness`, `consolidate step-3 contract`
- `G29` Validation tier is event-driven, never scheduled — aka `validation tier is event-driven`
- `G30` AFG structural cross-check: ±2 aligned, else ruling material — aka `AFG structural cross-check`, `audit-afg-structure`
- `G31` MU frontier: coverage prose becomes a gated 'mu' anchor — aka `MU-frontier rule`, `MU frontier rule`, `mu frontier`
- `G32` D1: the MU pin writes only when every gate passes — aka `D1`, `D1 gate stack`, `MU gate stack`, `MU franchise-conflation gates`, `MU writer gates`
- `G33` Sibling-scope ceiling: a pin stays below the next sibling — aka `D1 sibling-scope ceiling`, `sibling-scope ceiling`, `refused_sibling_scope`
- `G34` Airing-pin rule: run-end pins apply to finished runs only — aka `airing-pin rule`, `D1 airing-pin`, `TYBW airing pin`
- `G35` Scope-consumed: research already reached the scope end — aka `D1 scope-consumed`, `scope-consumed`, `scope-consumed refusal`, `refused_scope_consumed`
- `G36` A1 at the MU writer: no pin on a filler/anime-only row — aka `D1 episode-type refusal`, `A1 at the MU writer`, `refused_episode_type`, `A1 / D1 episode-type refusal`
- `G37` MU_FRONTIER_SUPPRESSED: declarative per-entry suppression — aka `MU_FRONTIER_SUPPRESSED`, `MU suppression record`
- `G38` 'mu' anchors are wiped and re-derived every run — aka `mu anchors wiped and rebuilt`, `mu anchors are derivations`, `delete-at-entry`
- `G39` MU targets are universal: every manga-linked series — aka `MU targets: UNIVERSAL`, `MU targets universal`, `universal MU targeting`
- `G41` Manga-status cross-check flags, never auto-applies — aka `manga-status cross-check`, `cross-check tier`, `taxonomy_conflict (MU status)`
- `G42` MU change detection hashes only the acted-on fields — aka `muHash`, `hash-only-acted-on-fields`, `MU hash gate`
- `G43` Wikipedia page discovery: tokens must agree, not rank — aka `page discovery token agreement`, `Wikipedia page discovery`, `search ranking is not identity`
- `G44` Episode-list locks: an offset merges only when proven — aka `Wikipedia episode-list locks`, `episode-list locks`, `evidence-locked offsets`, `namesake guard`, `When They Cry case`, `Kingdom S6 lesson`
- `G45` Wikipedia episode fill is fill-only and bounded — aka `fill-only`, `Wikipedia fill is fill-only`, `wiki fill gates`
- `G46` Fractional rows are staged, then ruled, never dropped — aka `fractional staging`, `fractional staging + disposition`, `ingest_fractionals`
- `G47` Freshness map: one scheduled path per source, windowed — aka `freshness map`, `refresh cadence`, `the four crons`
- `G49` Inline upkeep: derived writes ride the puller — aka `inline upkeep`
- `G50` New-source checklist: repeatable mechanism or not at all — aka `new-source checklist`, `no one-offs (sources)`
- `G51` Staging keeps everything, raw HTML included — aka `staging is greedy`, `greedy staging`, `AFG re-fetch lesson`
- `G52` Canon-tier creation: chartless manga shows still enter — aka `canon-tier creation`, `canon-tier`, `A-9`
- `G53` Ruled air dates: AIR_DATE_OVERRIDES, applied at every write — aka `AIR_DATE_OVERRIDES`, `air-date overrides`, `air date override pass`, `ruled air dates`
- `G54` Air-date order: a date a year out of order is withheld — aka `A-11`, `air-date order gate`, `airdate regression`, `airdate_regression`, `AIRDATE_ORDER_ACK`, `365-day rule`, `air-date withheld`, `airdate_withheld`

**V — Volumes & boundaries** (10)
- `V1` Monotonic starts, or the row is not data — aka `monotonic-start gate`, `MONOTONIC-START rule`, `monotonic boundaries`, `monotonic starts`, `Sailor Moon v3 report`, `Sailor Moon "v3: chs 10-3"`
- `V2` Stored-boundary heal: max-weight increasing subsequence — aka `heal-volume-boundaries`, `boundary heal`, `Ippo v61 partial-boundary principle`, `Urusei Yatsura wipe`
- `V3` Boundary-aware volumes everywhere; ratio only as fallback — aka `boundary-aware volumes`, `boundary-aware volumes everywhere`, `volume ratio fallback`, `chToVol`, `Kenshin ep-29 wobble`
- `V4` Partial boundary tables never stand in as totals — aka `Ippo v61 lesson`, `partial boundary tables never stand in as totals`, `published-volume stand-in completeness`, `publishedVolumes`
- `V5` Boundaries come from the manga's OWN page — aka `volume-boundary identity`, `volume-boundary identity + numbering space`, `Slime ← Cells at Work class`, `Made in Abyss ← Claymore class`, `title-token overlap gate`
- `V6` Boundaries stay inside the manga's numbering space — aka `boundary numbering space`, `exceed-totals flag`, `finished-total trim`
- `V7` Continua boundaries write absent-only — aka `boundaries write absent-only`, `continua boundary write`
- `V8` Volumes-staleness event — aka `volumes-staleness event`, `VOLUME_STALE_MARGIN`, `event-driven validation tier`
- `V9` A volume spans its start to the next volume's start − 1 — aka `boundary span definition`, `volume span`
- `V10` A verdict's volume is the END chapter's volume — aka `volume = END's volume`, `verdict volume`

**R — Research protocol** (30)
- `R1` Research first — nothing reaches Sean unresearched — aka `invariant 5`, `hard invariant 5`, `research-first rule`, `RESEARCH-FIRST rule`, `Sean's accuracy directive`, `nothing reaches Sean unresearched`
- `R2` Ties and oddities escalate to research, never to precedence — aka `ties escalate to research`, `no blanket precedence rule`
- `R3` Two or more independent sources per anchor, with URLs — aka `2+ sources`, `≥2 sources`, `two-source rule`, `2+ independent sources per anchor`
- `R4` Instant answers, AI summaries, content farms: cross-check — aka `cross-check only`, `Oshi no Ko rule`, `discredited sources`
- `R5` Fan mapping threads are first-class, never alone — aka `fan mapping threads`, `fan threads first-class`
- `R6` Wikis are read through the MediaWiki API, never HTML — aka `MediaWiki API not HTML`, `api.php rule`, `fandom via API`
- `R7` Look for a second wiki and the reverse index — aka `second wiki`, `second-wiki habit`, `look for a second wiki`
- `R8` Every anchor delivered carries the FULL record — aka `full-record model`, `full adaptation record (agent contract)`, `agent contract`
- `R10` Non-linear facts: the annotation kind vocabulary — aka `annotation kind vocabulary`, `annotation kinds`
- `R11` type_corrections need 2+ sources and per-episode evidence — aka `type_corrections ≥2 sources`, `type corrections two sources`
- `R12` Repairs are explicit — old, new, evidence — never silent — aka `repairs never silent`, `never silently contradict stored data`, `repairs with old/new`
- `R13` An honest gap beats a plausible guess — aka `honest gap > guess`, `honest gap beats a plausible guess`, `zone_level_only`, `zone-level only`
- `R14` Density: every episode when cheap, else boundaries + 3–5 — aka `density rule`, `anchor density`, `checkpoint lattice`
- `R15` Season/arc boundary anchors are the most load-bearing — aka `boundary anchors`, `boundary anchors most load-bearing`
- `R16` Confidence vocabulary: high / medium, nothing else — aka `confidence vocabulary`, `high/medium`, `confidence high medium`
- `R17` Disagreements: resolve, else better-supported, medium, flag — aka `disagreement handling`, `flags_for_sean`, `unresolved disagreement`
- `R18` The agent converts into OUR cumulative episode space — aka `numbering conversion is the agent's job`, `our cumulative numbering`, `OVA-inclusive sources flagged`
- `R19` Row-count identity before trusting any per-episode source — aka `row-count identity first`, `row-count identity`
- `R20` Research never index-joins a chart — join on title or date — aka `A-4`, `never index-join`, `title-join rule`, `index-join rule`, `join on title`
- `R21` Verdict: one JSON per series, exact shape, data not prose — aka `verdict JSON shape`, `one JSON per series`, `verdict deliverable`, `protocol preamble`
- `R22` Agent scope: one target, read-only, own scratchpad — aka `research-agent contract`, `per-task scratchpad`, `agent is read-only`
- `R23` Weight-bearing verdicts get cross-model verification — aka `verification tier`, `verify pass`, `verifier on weight-bearing verdicts`, `cross-model verification`, `verify pool`
- `R24` Verifier: a skeptic who hunts by damage and reports evidence — aka `verdict-verifier contract`, `verifier hunt order`, `verifier report format`, `skeptic not second author`
- `R25` Every landed verdict gets a mechanical self-consistency scan — aka `contradiction scan`, `verdict self-consistency`, `summary-vs-rows scan`
- `R26` Orphaned verdicts get the scan plus one extra look — aka `orphaned-verdict review`, `verification debt`
- `R27` Audit-class hits run as a lightweight per-episode lane — aka `A1-triage lane`, `triage lane`
- `R28` A gate is never decided on a small sample — aka `D4 early signal`, `early D4 signal`, `small-sample rule`, `do not decide on 5 of 49`
- `R29` Reorder regimes rest on verdict-documented jumps — aka `REORDER_REGIMES listing rule`, `regime annotations from real jumps`, `REORDER_REGIMES laundering`
- `R30` Verdicts cite the rule ids they applied (planned) *(planned)* — aka `rules_applied`, `rules_applied[]`, `verdict cites rule ids`
- `R31` The PROTOCOL is pinned for an in-flight batch (planned) *(planned)* — aka `PROTOCOL pin`, `protocol pinned`, `pinned protocol`

**P — Process & pipeline** (33)
- `P1` The data cycle, seven steps run in order — aka `the data cycle`, `data cycle`, `the cycle`
- `P2` Rules live in shared lib code, never inline at a call site — aka `invariant 1`, `hard invariant 1`, `rules live in lib`, `every-writer rule`
- `P3` Any lib/ change → rebuild and deploy all four edge functions — aka `invariant 2`, `hard invariant 2`, `lib → four edges`, `lib → edges`, `missed edge deploy`
- `P4` Edge bundles carry the lib content hash — aka `edge hash`, `lib-hash stamp`, `T2.6`
- `P5` Audits verify OUTCOMES; mechanical checks are mandatory — aka `invariant 3`, `hard invariant 3`, `audits verify outcomes`, `outcome-check pattern`, `script before model`
- `P6` Incomplete data degrades gracefully — never NaN — aka `invariant 4`, `hard invariant 4`, `graceful degradation`
- `P8` Repairs live at the manual tier — aka `invariant 7`, `hard invariant 7`, `repairs live at the manual tier`, `hikaru ep-75 wipe`, `hikaru lesson`
- `P9` No one-offs, no hacks, no permanent escape hatches — aka `invariant 8`, `hard invariant 8`, `no one-offs`, `no one-offs, ever`
- `P10` Sean rules: the curated map decides, not the agent — aka `Sean rules`, `the curated map decides`, `curation principle`, `curated-first apply`, `report, don't apply uncurated`
- `P11` Artifacts are the handoff; batch state lives on disk — aka `artifacts are the handoff`, `the governing rule`, `work-list from disk`
- `P12` A wave is 6–8 agents, hard cap — the unit of loss — aka `wave cap`, `wave cap 6-8`, `6–8 wave cap`, `two-chunk rule`, `a wave is the unit of loss`
- `P13` Land and checkpoint after every wave — aka `checkpoint after every wave`, `land and checkpoint`, `checkpoint steps`, `held dispatch`
- `P15` The apply sequence: read, curate, dry-run, apply, verify — aka `apply-batch sequence`, `the apply discipline`, `read, don't skim`, `dry-run as proposal`
- `P16` Uncurated or renumbered verdict files are HELD by name — aka `HELD_FILES`, `mashle HELD`, `stale verdict HELD`, `held verdict files`
- `P17` Every census delta is explained — aka `census + delta explanation`, `explain every census delta`, `every census delta explained`
- `P18` ruling_violation MUST be 0 — fix the writer, not the data — aka `ruling_violation = 0 gate`, `ruling_violation MUST be 0`, `fix the writer, never the data`
- `P19` After any change, verify the whole series via the app path — aka `the verifier`, `whole-series verifier`, `verify-after-adjust ruling`, `Oshi stale-harness lesson`, `post-adjustment whole-series verification`
- `P20` Healers are idempotent and run from the roster — aka `healer roster`, `healers idempotent`, `healers idempotent + rostered`
- `P21` Deep runs when a rule change invalidates prior decisions — aka `deep trigger`, `consolidate deep trigger`, `two modes`
- `P22` Deep is REQUIRED when a ledger enforcement site changed — aka `sharper deep trigger`, `enforcement-site deep trigger`, `T3.3`
- `P23` Notes are precedence, not blindfolds — aka `notes are precedence, not blindfolds`, `deep rescan notes rule`
- `P24` Delete with evidence; every removal is listed — aka `delete with evidence`, `stale cleanup`, `every deletion listed`
- `P25` Permanence tiers: finished, Sean-signed series are LOCKED *(planned)* — aka `permanence tiers`, `permanence tier`, `LOCKED`, `locked series`, `permanence locks`
- `P27` Gates before commit: tsc -b (never -p .), lint, test, build — aka `tsc -b gate`, `frontend gate`, `gates before commit`, `gates before any commit`, `frontend gate is tsc -b`
- `P28` Every piece ends at a save point; the next step is offered — aka `save point`, `next-step offer`, `no silent TODO`, `offer it, don't assume it`
- `P29` Capture: every learning is routed to a durable, named home — aka `capture`, `capture routing`, `close the loop`, `the capture table`
- `P30` Judgment → gate → audit; an empty audit cell is the backlog — aka `judgment → gate → audit`, `judgment to gate to audit`, `the standing goal`, `direction of travel`, `check the gates are real`
- `P31` /add-rule: gate → edges → audit → heal → deltas → record *(planned)* — aka `/add-rule`, `add-rule`, `add-rule sequence`, `T3.1`
- `P32` Completeness is an outcome: walks prove processed = total — aka `completeness as an outcome`, `completeness sidecar`, `T2.3`, `healer-pagination trap`
- `P33` System census checks the reference structure mechanically — aka `system census`, `T2.7`, `three rosters`, `T2.4`
- `P34` Historical apply scripts are kept as records, non-runnable — aka `history/`, `historical apply scripts non-runnable`, `history non-runnable`, `T2.5`, `D-5`
- `P36` Cross-model check the frames, not just the data *(planned)* — aka `cross-model check the frames`, `frame check after T4.0`, `principle 8`
- `P37` Episode-level display reads only the hydrated series — aka `metadata contract`, `card-hydration rule`, `hydration contract`, `hydrated series only`

## A — Anchors & position

### A1 · Filler / anime-only rows never carry anchors

A chapter anchor attaches only to an episode typed canon or mixed. Filler and anime-only rows never carry a chapter anchor from ANY source: every anchor writer refuses or drops the row (allow-list canon/mixed; unknown types fail closed; a row-less episode cannot be typed, so it passes), and the client nulls the mapping of any noncanon row at assembly. An episode that looks anchorable but is typed filler has a type question, not an anchor question.

*Why:* MHA ep 104 (a filler position-carry anchor) and Toriko ep 147: the anchor a filler row would take is either junk or evidence the row is mistyped — never a position.

- ruled Sean 2026-08-24 (data-pipeline §12.38 (A1 RULED); CLAUDE.md hard invariant 6)
- layer **both**
- enforced: [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts) · [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts) · [src/data/catalog/assemble.ts#toEpisodes](../src/data/catalog/assemble.ts) · [src/lib/mapping.ts#chToEp](../src/lib/mapping.ts) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- audit: `anchor_on_noncanon_row`, `mu_refused_episode_type`
- witnesses: my-hero-academia, toriko, one-piece, dragon-ball-z
- aliases: invariant 6, hard invariant 6, A1 rule, filler rows never carry anchors
- see: A5, A6, A40, D1, T1

### A2 · Cameo / sliver borrowings are never anchors

A cameo-grade borrowing — a 2-page gag reference, a cameo chapter, a scene-level graft of a few pages — never becomes an anchor, a start_chapter, or a chapter number in position data. The fact lives as an episode annotation and in the verdict JSON only, for a future "any manga content involved" surface.

*Why:* Clear Card eps 12/14 (ch-39/46 cameos) and Ippo ep 76 (a 2-page ch-383 gag) were proposed as anchors in batch 15 and rejected as position data.

- ruled Sean 2026-08-24 (batch-15 DECISIONS-FOR-SEAN (A2 Clear Card 12/14 + A3 Ippo 76); data-pipeline §12.37)
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- **audit: none — automation backlog**
- witnesses: cardcaptor-sakura-clear-card, hajime-no-ippo-the-fighting, a-certain-scientific-railgun
- aliases: A2/A3, cameo rule, cameo/sliver borrowings, A2/A3 rejected-as-anchors
- see: A10, A29, A43

### A3 · Exact per-episode adaptation always becomes an anchor

Inside a rearranged zone, exact known per-episode adaptation ALWAYS becomes an anchor — even a non-monotonic one (as-stored rendering plus the rearranged annotation make it legal). Zone-level-only knowledge stays an annotation with acknowledged-approximate interpolation and is a research/promotion target until an exact record replaces it. Leaving exact values annotation-only lets interpolation paint plausible-but-wrong numbers across the zone.

*Why:* GTO ep 20 rendered ~68 while its annotation already knew 73-74 — the exact value sat in a note instead of an anchor.

- ruled Sean 2026-08-23 (data-pipeline §11 "Rearranged zones (the GTO 20/21 lesson)")
- layer **both**
- enforced: [audit-ui-truth.ts#classes.rearranged_zone_unanchored](../scripts/ingest/audit-ui-truth.ts) · [history/apply-rearranged-anchors.ts](../scripts/ingest/history/apply-rearranged-anchors.ts)
- audit: `rearranged_zone_unanchored`
- witnesses: gto-great-teacher-onizuka, black-lagoon, rosario-vampire
- aliases: GTO lesson, GTO 20/21 lesson, rearranged-zone rule, rearranged zones
- see: A7, A19, A18

### A4 · Series coverage = furthest chapter adapted in the run

A series' position (coverage) is the furthest first-time-adapted chapter across the whole run — the max-chapter anchor — never the run-end anchor, because an anime may end on a relocated earlier block. The run-end anchor remains the frontier EPISODE; a late flashback or backfill never drags coverage down. Continue-read after the finale is coverage + 1 (continue_kind post_series). Section headers show the true adapted envelope; nothing shows the continue point as if adapted.

*Why:* Ippo 124-127 aired the Post-War arc (chs 400-414) last; coverage is 557 via ep 123, continue 558 — the old frontier-only model showed 414.

- ruled Sean 2026-08-24 (batch-15 DECISIONS-FOR-SEAN A4; data-pipeline §11 "Coverage = furthest adapted, finale = honest record")
- layer **display**
- enforced: [src/data/catalog/assemble.ts#coverageAnchor](../src/data/catalog/assemble.ts) · [src/data/catalog/assemble.ts#buildMapping](../src/data/catalog/assemble.ts)
- **audit: none — automation backlog**
- witnesses: hajime-no-ippo-the-fighting, hellsing, kamisama-kiss, sailor-moon-crystal
- aliases: A4 rule, coverage = max, coverage = furthest adapted, Ippo finale lesson, A4 finale rule, A4 coverage=max
- see: A8, A31, A36, C5, C2

### A5 · D4: the A1 gate at the AFG writers

The AFG writers enforce A1 at write time: syncAnchors drops derived chart anchors whose episode row is typed anything other than canon/mixed (a chart value on a noncanon row is a reading-position conversion artifact, not an adaptation claim), and applyContinua refuses a continua frontier pin landing on such a row with a count_mismatch flag (refused_episode_type). The continue-from chapter is still written on refusal because it is reading guidance, not a position. Retype stays research-tier.

*Why:* One Piece eps 214/216 both printed ch 313 on rows AFG itself marks *Filler; of 49 audit hits adjudicated, 45 were junk and 4 mistyped rows.

- ruled Sean 2026-08-25 (batch-17 CHUNK1-RECOVERY §11; data-pipeline §12.45 (D4 RULED + BUILT))
- layer **writer**
- enforced: [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts)
- audit: `anchor_on_noncanon_row`
- witnesses: one-piece
- aliases: D4, A1/D4, A1 / D4 chart, A1 / D4 episode-type refusal
- see: A1, D1, C8

### A6 · An A1 hit is a triage fork, never an auto-delete

Every anchor_on_noncanon_row hit is exactly one of: a junk anchor (deleted via a curated deletion map, with the honest terminal recorded on the last canon/mixed episode) or a wrong row type (research anchored it deliberately — retype). Nothing auto-deletes. A verdict proposing a value repair on a filler row is answered with a deletion, because A1 forbids the anchor outright — the curated decision drives the deletion, not the agent's field shape.

*Why:* Toriko ep 147 proposed 263 → 253 on a filler row; A1 answers with removal and the honest terminal ep 146 → 253.

- ruled Sean 2026-08-24 (data-pipeline §10 "A1 outcome verification"; §12.42 DELETIONS_APPROVED; CLAUDE.md cycle step 4)
- layer **process**
- enforced: [audit-ui-truth.ts#classes.anchor_on_noncanon_row](../scripts/ingest/audit-ui-truth.ts) · [history/apply-research-batch-17.ts#DELETIONS_APPROVED](../scripts/ingest/history/apply-research-batch-17.ts) · [.claude/skills/apply-batch/SKILL.md](../.claude/skills/apply-batch/SKILL.md)
- audit: `anchor_on_noncanon_row`
- witnesses: toriko, my-hero-academia, cardcaptor-sakura
- aliases: A1 triage, Toriko deletion, Toriko deletion precedent, A1 outcome verification
- see: A1, A5, A40

### A7 · Proven zone-level-only knowledge is acknowledged, not open

Once research PROVES that only zone-level knowledge exists for a rearranged/graft episode, its annotation note gains a "zone-acknowledged (batch N)" marker, written after the annotation upserts. The row moves from rearranged_zone_unanchored (open research target) to rearranged_zone_acknowledged (an accepted approximate render, reviewed, not open). Loose series, series with fewer than two anchors, and filler/anime-only rows are never counted in either class.

*Why:* Batch 15 drained 42 rearranged zones; the ones with no per-episode source anywhere had to stop re-appearing as work without pretending to be exact.

- ruled session 2026-08-24 (data-pipeline §11 "Rearranged zones — AMENDED batch 15")
- layer **both**
- enforced: [history/apply-research-batch-15.ts#ZMARK](../scripts/ingest/history/apply-research-batch-15.ts) · [audit-ui-truth.ts#classes.rearranged_zone_acknowledged](../scripts/ingest/audit-ui-truth.ts)
- audit: `rearranged_zone_unanchored`, `rearranged_zone_acknowledged`
- witnesses: gto-great-teacher-onizuka
- aliases: zone-acknowledged, zone-acknowledged marker, acknowledged approximation
- see: A3, A1, A40, zone_level_only

### A8 · END = last mainline chapter in running order (honest record)

An anchor is an honest record of what ITS episode adapts. Its END (chapter_anchors.chapter) is the last mainline chapter the episode adapts in RUNNING ORDER — the last chapter it adapts as its main content, not the numerically largest chapter it touches. A finale anchors to what it adapts and is never inflated to the furthest chapter the series touched; a first-time out-of-order adaptation anchors truthfully at what it adapts, with the reorder annotated.

*Why:* kamisama-kiss ep 25 and sailor-moon-crystal ep 39 had finale anchors inflated to the series envelope; zatch-bell ep 51 legitimately anchors at ch 22 far below trend. The sket-dance "END = max(adapted)" note conflated this with A4 coverage.

- ruled Sean 2026-08-24 (batch-16/17 PROTOCOL "Rules that bind"; DRIFT-LIST A-2 (2026-08-25))
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- **audit: none — automation backlog**
- witnesses: kamisama-kiss, sailor-moon-crystal, zatch-bell, hajime-no-ippo-the-fighting
- aliases: END = running order, honest record, anchor = honest record, finale anchors to what it adapts, END definition
- see: A4, A9, A31, A19

### A9 · An END below its START is lifted to the max adapted chapter

When an agent's running-order END sits BELOW the episode's START (a scrambled sampler), the apply layer lifts END to the highest integer chapter in the adapted list so the anchor still works as a position instrument; chapters_adapted keeps the real order. The normalizer is mechanical and applies to every record identically.

*Why:* Dagashi Kashi S1 "58, 32, 15" delivered END 15 below START 58.

- ruled session 2026-08-23 (data-pipeline §10 "Running-order END normalization (2026-08-23 s2, Dagashi S1)")
- layer **writer**
- enforced: [history/apply-research-batch-14.ts#main](../scripts/ingest/history/apply-research-batch-14.ts) · [history/apply-research-batch-17.ts#main](../scripts/ingest/history/apply-research-batch-17.ts)
- **audit: none — automation backlog**
- witnesses: dagashi-kashi
- aliases: running-order END normalization, running-order END convention, Dagashi S1 normalization
- see: A8, A10, A30

### A10 · Sliver rule: START = first chapter animated

START (chapter_anchors.start_chapter) is the first chapter the episode animates. A leading PARTIAL of the immediately preceding chapter IS the start unless it is scraps — at most 5 pages, or sliver/teaser/cold-open/recap/flashback wording. Page splits a source states are recorded in chapters_adapted. The apply layer normalizes agent records mechanically from their page counts so one rule governs every record.

*Why:* MHA ep 170: 429 p.3-4,14-19 (8 pages) makes the start 429, not 430; batch 14 corrected 33 starts mechanically.

- ruled Sean 2026-08-23 (data-pipeline §10 "Sliver rule (Sean 2026-08-23 s2, MHA ep 170)")
- layer **writer**
- enforced: [history/apply-research-batch-14.ts#main](../scripts/ingest/history/apply-research-batch-14.ts) · [history/apply-research-batch-17.ts#main](../scripts/ingest/history/apply-research-batch-17.ts) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md)
- **audit: none — automation backlog**
- witnesses: my-hero-academia, hajime-no-ippo-the-fighting
- aliases: sliver rule, START = first chapter animated, A1 + sliver rule
- see: A11, A12, A13, A2
- supersedes: A11

### A11 · Majority rule for START (superseded by the sliver rule) *(superseded → A10)*

When an episode opens by finishing the tail pages of the previous chapter, START is the first FULL chapter unless the tail is the bulk of the episode. Superseded: the sliver rule counts any leading partial unless it is scraps (≤ 5 pages). The 27 starts seeded under this rule are healed under A10 (DRIFT-LIST A-6).

*Why:* Oshi ep 34 (114 p.18 tail + 115-118 → 115) and JJK ep 34 (90 p.21 tail → 91) were seeded under the majority threshold before batch 14 tightened it.

- ruled Sean 2026-08-23 (apply-start-chapters.ts header; batch-14/15/16 PROTOCOL "START chapter")
- layer **writer**
- enforced: [history/apply-start-chapters.ts#main](../scripts/ingest/history/apply-start-chapters.ts)
- **audit: none — automation backlog**
- witnesses: oshi-no-ko, attack-on-titan, jujutsu-kaisen, haikyu, naruto
- aliases: majority rule, START majority rule, first FULL chapter rule
- see: A10

### A12 · Relocated openers are never the START

START is the first ON-TREND chapter. A far-earlier relocation, flashback or graft that opens an episode stays leading in chapters_adapted with a graft/rearranged annotation and never becomes start_chapter or the position — otherwise it poisons the previous row's derived start through the successor-span cap.

*Why:* AoT ep 87 opens with a relocated ch-123 block; MHA ep 126 opens with the ch-220 graft. Batch 15 re-enforced it after JJK, Shippuden and Ippo records reintroduced relocated starts.

- ruled Sean 2026-08-24 (data-pipeline §11 "Relocated openers are never the START (AoT ep-87 rule, re-enforced batch 15)")
- layer **both**
- enforced: [history/apply-research-batch-17.ts#main](../scripts/ingest/history/apply-research-batch-17.ts) · [src/lib/mapping.ts#canonEpStartCh](../src/lib/mapping.ts)
- audit: `anchor_start_offtrend`
- witnesses: attack-on-titan, jujutsu-kaisen, naruto-shippuden, hajime-no-ippo-the-fighting, my-hero-academia
- aliases: AoT ep-87 rule, AoT-87 rule, relocated openers, relocated openers are never the START
- see: A10, A16, A17

### A13 · An episode row displays the FIRST chapter it animates

An episode row shows where it STARTS in the manga — its first animated chapter — never its end or midpoint. Starts are real source data: deriveAnchors captures the first mainline chapter of every chart row into chapter_anchors.start_chapter on every refresh, and research anchors carry start_chapter whenever a batch names the span. chapter_anchors.chapter stays the END-position instrument for interpolation, frontier and continue-from.

*Why:* Oshi no Ko ep 35 adapts 119-127 and must display 119, not 127.

- ruled Sean 2026-08-23 (data-pipeline §10 "Episode display = FIRST chapter animated (Sean 2026-08-23)"; §12.27)
- layer **both**
- enforced: [lib/afg.ts#deriveAnchors](../scripts/ingest/lib/afg.ts) · [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [src/lib/mapping.ts#buildEpisodeList](../src/lib/mapping.ts) · [src/lib/mapping.ts#solvePosition](../src/lib/mapping.ts)
- **audit: none — automation backlog**
- witnesses: oshi-no-ko, cardcaptor-sakura
- aliases: first-chapter ruling, first-chapter display, episode display = FIRST chapter animated, display shows START, display anchors at starts, display/continue split
- see: A10, A14, A15, C9

### A14 · An exact record outranks any derivation

MangaMapping carries the record's own `start` explicitly (set from chapter_anchors.start_chapter; null means genuinely unknown), and the chapters string carries the real adapted span ("119-127") when start and end differ. Every display site takes the record's own start first, a span's first number second, and formula derivation only when the start is genuinely unknown (a bare end value).

*Why:* Gintama ep 35: an exact ch-86 record rendered as ch 48 because a bare "86" was ambiguous and derivation walked backwards into a jumped block.

- ruled Sean 2026-08-24 (data-pipeline §11 "An exact record outranks any derivation (Sean's Gintama ep-35 report)")
- layer **display**
- enforced: [src/data/catalog/assemble.ts#toEpisodes](../src/data/catalog/assemble.ts) · [src/lib/mapping.ts#canonEpStartCh](../src/lib/mapping.ts) · [src/types/anime.ts#MangaMapping](../src/types/anime.ts)
- **audit: none — automation backlog**
- witnesses: gintama
- aliases: Gintama ep-35 rule, Gintama ep-35 report, exact record outranks derivation, exact-record-outranks-derivation
- see: A13, A15, A18

### A15 · Derived start = prev end + 1, clamped, never across reorder

For an end-only record the display derives the start as the previous canon/mixed episode's end + 1, clamped to this episode's own end (a shared split chapter shows as equal — legal; a derived start can never sit below the previous end because charts double-list split-boundary chapters). The first canon episode starts at the entry's scope start, not chapter 1. Across a reorder boundary (different regime, or prevEnd > end) no start is derived: the row shows its own end when known, else null.

*Why:* MU pins and unseeded research rows are end-only; the fallback implements the majority/sliver rule by construction.

- ruled Sean 2026-08-23 (data-pipeline §10 "Episode display = FIRST chapter animated" (fallback clause); §11 verification rule (1))
- layer **display**
- enforced: [src/lib/mapping.ts#canonEpStartCh](../src/lib/mapping.ts)
- audit: `verify:regression`
- witnesses: mapping.position.test.ts canonEpStartCh — display shows the FIRST chapter animated
- aliases: derived start fallback, derive guard, prevEnd+1 derivation
- see: A13, A14, A16, A17, A18

### A16 · Successor-span cap on derived starts

An episode can never start after its successor: the nearest following EXACT row's span start caps every derived start before it — within ONE regime only, and only when that row states a real span (a "-" or "," in its chapters string). Only the nearest following exact row bounds a derived start.

*Why:* Fairy Tail 277 / One Piece 510: interpolated rows adjacent to an exact row overshot past that row's real start.

- ruled Sean 2026-08-23 (data-pipeline §11 verification rule (2); §12.33 (c))
- layer **display**
- enforced: [src/lib/mapping.ts#canonEpStartCh](../src/lib/mapping.ts)
- **audit: none — automation backlog**
- witnesses: fairy-tail, one-piece
- aliases: successor-span cap, one-chapter-dip class, successor cap
- see: A17, A15, A18

### A17 · A backwards-jumping successor never sets its predecessor

The previous exact row's own stated start is a floor on the successor-span cap: a row may share or re-tread its predecessor's chapters but can never render as beginning BEFORE its predecessor did. A successor that reaches back past the predecessor's end is a reorder, and reorders never position their neighbours. The regime check is the coarser first line; the floor holds where regime detection is too coarse.

*Why:* Sailor Moon ep 73 re-treads chs 15-17 after ep 71 reached 16, and the cap dragged ep 72's derived start back to 15.

- ruled Sean 2026-08-24 (data-pipeline §11 "A backwards-jumping successor never sets its predecessor's position (the AoT-87 rule, extended)"; §12.42)
- layer **display**
- enforced: [src/lib/mapping.ts#canonEpStartCh](../src/lib/mapping.ts)
- **audit: none — automation backlog**
- witnesses: sailor-moon, attack-on-titan
- aliases: AoT-87 extension, AoT-87 rule (extended), predecessor floor, backwards-jumping successor, Sailor Moon ep-72 report
- see: A16, A12, A18

### A18 · Reorder regime: formulas never bridge a reorder

Every anchor point is on-trend (at or above the running chapter maximum) or inside a jumped-back block. Interpolation, the prevEnd+1 start derivation and the successor cap operate only BETWEEN points of one regime (both on the monotonic envelope, or both inside the same jumped-back block and still advancing). Across a regime boundary an estimate renders null — an honest hole — and an exact end-only row shows its END. The verifier lists such rows as `hole` work-list lines, never failures; the row needs its own exact anchor.

*Why:* MHA aired My Villain Academia (218-240) after Endeavor Agency (241-252); eps 107 → 221 and 113 → 241 were plausible-but-wrong formula output.

- ruled Sean 2026-08-23 (data-pipeline §10 "Reorder regime — formulas never bridge a reorder (Sean's MHA 107/113 report, 2026-08-23 s2)")
- layer **display**
- enforced: [src/lib/mapping.ts#inReorderCrossing](../src/lib/mapping.ts) · [src/lib/mapping.ts#bridgeable](../src/lib/mapping.ts) · [src/lib/mapping.ts#regimeAt](../src/lib/mapping.ts) · [verify-series-display.ts#holesFound](../scripts/ingest/verify-series-display.ts)
- audit: `verify:hole`
- witnesses: my-hero-academia, mapping.position.test.ts inReorderCrossing — jumped-back adaptation order
- aliases: reorder regime, formulas never bridge a reorder, MHA 107/113 report, reorder hole
- see: A19, A33, A34, A3

### A19 · Research/manual anchors render AS STORED, even non-monotonic

Adaptation order may legitimately jump back. Research-tier and manual anchors are rendered exactly as stored in every display — the curve keeps decreasing points, rows show the flow — and are never silently dropped, re-sorted or collapsed by the client. Junk protection for this tier lives at write time (chapter-space gates) and in audits that ask Sean per hit, never in a display-side filter.

*Why:* The old client monotonic filter hid Boruto's Naruto-space ch-710 anchors instead of surfacing them.

- ruled Sean 2026-08-23 (data-pipeline §10 "Non-monotonic display ruling (Sean 2026-08-23)"; DRIFT-LIST A-3)
- layer **display**
- enforced: [src/lib/mapping.ts#anchorPoints](../src/lib/mapping.ts) · [src/components/EpisodeList.tsx#coverageLabel](../src/components/EpisodeList.tsx)
- audit: `anchor_nonmonotonic`
- witnesses: boruto-naruto-next-generations, zatch-bell, ranma-1-2, sket-dance
- aliases: non-monotonic display ruling, as-stored rendering, render as stored, C3 out-of-order zones (b15)
- see: A20, N28, A41, A3, A18

### A20 · Derived AFG anchors keep only the non-decreasing trend

At the DERIVED tier (AFG chart rows) chapters never decrease as episodes advance: deriveAnchors keeps the longest non-decreasing chapter subsequence and drops the rest as junk (divider digits merged into a row, flash-forward grafts, stray highs). No arc-pattern guard — outliers are judged against the chart's own trend, never whole stretches.

*Why:* AFG Naruto ep 141 → "ch 21"; HxH ep 83 carried ch 288 mid-Chimera; the earlier arc-pattern guard nuked Naruto 6-27.

- ruled session 2026-08-23 (data-pipeline §10 "Anchor monotonicity"; §12.26; DRIFT-LIST A-3 (scoped to the derived tier))
- layer **writer**
- enforced: [lib/afg.ts#deriveAnchors](../scripts/ingest/lib/afg.ts)
- audit: `anchor_nonmonotonic`
- witnesses: naruto, one-piece, hunter-x-hunter
- aliases: anchor monotonicity, LNDS, spike filter, derived-tier monotonicity, divider/LNDS derivation
- see: A19, A21, N28

### A21 · Start-sanity guard on derived rows

A chart row's raw minimum is NOT its start. deriveAnchors recomputes each kept row's start as the lowest mainline chapter on the trend that is not below the previous kept row's end and not above its own end (a shared split chapter is equal and legal; a value below the previous end is chart double-listing noise). Off-trend values stay recorded in chapters_adapted as data, never as position. Research-tier starts are exempt. The audit flags any anchor whose start sits more than one below the previous anchor's end without a rearranged/graft annotation.

*Why:* Oshi no Ko ep 4 listed a stray 10 beside 17-19; the raw minimum poisoned the displayed start.

- ruled Sean 2026-08-23 (data-pipeline §11 "Start-sanity guard (the Oshi ep-4 lesson)"; §12.32)
- layer **both**
- enforced: [lib/afg.ts#deriveAnchors](../scripts/ingest/lib/afg.ts) · [audit-ui-truth.ts#classes.anchor_start_offtrend](../scripts/ingest/audit-ui-truth.ts)
- audit: `anchor_start_offtrend`
- witnesses: oshi-no-ko, fairy-tail, one-piece
- aliases: start-sanity guard, start sanity, Oshi ep-4 lesson
- see: A20, A22, A41, A10

### A22 · Block-end aggregate anchors are a deprecated shape

An anchor that aggregates several episodes into one block-end value is a deprecated shape. Per-episode records replace block anchors and never coexist with them: applying a per-episode map deletes the superseded block anchors.

*Why:* Black Lagoon's stale batch-10 arc-BLOCK anchors survived the pass-2 per-episode map and surfaced as anchor_start_offtrend on the class's first run.

- ruled session 2026-08-23 (data-pipeline §11 "Start-sanity guard" (last sentence); §12.32)
- layer **process**
- enforced: [.claude/skills/apply-batch/SKILL.md](../.claude/skills/apply-batch/SKILL.md)
- audit: `anchor_start_offtrend`
- witnesses: black-lagoon
- aliases: block-end anchors deprecated, block-end aggregate anchors, arc-block anchors
- see: A21, A30

### A24 · Anchor tier precedence at the (series, episode) key

One anchor per (series, episode). Tiers: manual/wiki (research) > afg-continua > afg chart / mu. A lower tier never overwrites a higher one on any refresh: derived chart rows at an episode holding a research-tier anchor are dropped; a continua pin at a manual/wiki episode is kept curated (continua cross-checks it — disagreement above 1 chapter files a count_mismatch flag); chart-afg or mu rows yield to continua (disagreement above 2 flags, then continua applies); any non-mu anchor already at the MU pin episode IS the frontier and the MU pin is skipped. Sources verify each other; none limits another.

*Why:* HxH ep 140: a derived chart row overwrote the research anchor on refresh until curated rows were made to win every time.

- ruled session 2026-08-23 (lib/anchors.ts syncAnchors + applyContinua comments; data-pipeline §10 "AFG continua source" precedence clause)
- layer **writer**
- enforced: [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts) · [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts)
- **audit: none — automation backlog**
- witnesses: hunter-x-hunter
- aliases: continua precedence, curated precedence, anchor precedence, anchor tier precedence, HxH ep-140 lesson, one-anchor-per-episode PK
- see: A25, A26, C7, invariant 7, D1

### A25 · Curated-consistency: derived rows never contradict a ruling

A derived chart row whose chapter contradicts the ordering around any research-tier anchor — a chapter above a later curated anchor, or below an earlier one — is chart imprecision: the ruling wins and the derived row drops (equal chapters at different episodes are allowed). An existing curated value is never overwritten by a batch anchor that contradicts it without a ruling. Ruled rearrangements live as annotations, never as derived rows.

*Why:* Boruto ep 219: a chart row contradicted the curated ordering around a research anchor and was written anyway.

- ruled session 2026-08-23 (data-pipeline §12.26 "curated-consistency precedence (Boruto ep-219 lesson)"; lib/anchors.ts syncAnchors)
- layer **writer**
- enforced: [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts)
- **audit: none — automation backlog**
- witnesses: boruto-naruto-next-generations
- aliases: curated-consistency, curated-consistency precedence, Boruto ep-219 lesson
- see: A24, A19

### A26 · MU pin redundancy keys on the pin episode

An MU frontier pin is redundant ONLY when a non-MU anchor already covers the pin episode itself (non-MU max episode ≥ pin episode). Neither a freshness window ("non-MU anchors within N episodes of the run end") nor chapter no-progress makes a pin redundant: episode-space knowledge counts even at zero chapter progress, because the display refuses to extrapolate past the last anchor.

*Why:* The old 12-episode window and no-progress skip deleted real run-end pins (AoT ep-89 → 139, Kuroko 75 → 275, Naruto 220 → 238) the moment research added interior anchors nearby, and frontier_tail_null nulled every trailing episode.

- ruled Sean 2026-08-23 (data-pipeline §10 "MU pin redundancy keys on the PIN EPISODE (2026-08-23, Sean's AoT 88-89 report)")
- layer **writer**
- enforced: [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts)
- audit: `frontier_tail_null`
- witnesses: attack-on-titan, kurokos-basketball, naruto
- aliases: MU pin redundancy, pin-episode redundancy, MU-pin episode-keyed redundancy, AoT 88-89 lesson, AoT 88-89 report
- see: A24, A27, A34, D1

### A27 · Anchor freshness: a stale frontier stays truthful-but-old

Anchors count as an active frontier only when they reach near the run's end. A stale set (anchors stop early in the run, e.g. a sparse AFG page) renders its truthful-but-old "as of ep N" and files a research flag; the MU anime-coverage pin is the real frontier where it exists. Synthesis from totals NEVER overrides a stale anchor — a diverged anime would otherwise claim full-manga coverage. Research closes a stale frontier; nothing guesses it.

*Why:* Soul Eater diverged from its manga; synthesizing its coverage from totals would have claimed the whole manga. MHA's AFG page stops at ep 13 of 170.

- ruled Sean 2026-08-24 (data-pipeline §10 "Anchor freshness"; §12.18)
- layer **both**
- enforced: [audit-manga-coverage.ts#stale_anchor_no_frontier](../scripts/ingest/audit-manga-coverage.ts) · [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts)
- audit: `active_anchored`, `stale_anchor_no_frontier`, `mu_frontier_applied`
- witnesses: soul-eater, my-hero-academia, naruto
- aliases: anchor freshness, stale frontier, stale-anchor class, anchor-freshness rule, MU class C
- see: A26, A38, A37, MU-frontier rule

### A29 · Bonus / fractional chapters: record, never drop

A non-integer chapter in a source chart is a bonus entry (Memoire, Entracte, x.5). The derived POSITION anchor uses the highest MAINLINE integer chapter and the first mainline chapter as start; a bonus-only row yields no anchor. The bonus association is never silently dropped: deriveBonusChapters records each one as a fill-only graft annotation (research-tier annotations at the same episode and kind are never clobbered) and sets asterisk_review to pending. A research-verified fractional anchor IS legal at the manual/wiki tier — sometimes the bonus is what the episode adapts; only DERIVED fractional anchors are audited.

*Why:* AFG listed Vanitas ep 5 as "8, 9, 10, 15.5" and a max-take scrape anchored 15.5.

- ruled Sean 2026-08-23 (data-pipeline §10 "Bonus/fractional chapters: record, never drop (Sean 2026-08-23, the Vanitas lesson + amendment)")
- layer **writer**
- enforced: [lib/afg.ts#deriveAnchors](../scripts/ingest/lib/afg.ts) · [lib/afg.ts#deriveBonusChapters](../scripts/ingest/lib/afg.ts) · [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts)
- audit: `anchor_fractional_chapter`
- witnesses: the-case-study-of-vanitas
- aliases: Vanitas lesson, Vanitas amendment, bonus/fractional chapters: record, never drop, fractional anchors
- see: A30, A2, A43, N9

### A30 · Full adaptation record: chapters_adapted in adaptation order

For EVERY episode, special and movie we store everything the sources know about what it adapts. chapter_anchors.chapters_adapted is the COMPLETE chapter list in ADAPTATION ORDER — canonical comma-separated serialization with consecutive integer runs compressed to ranges ("63-64, 67"), never sorted, non-contiguous and out-of-order allowed, bonus/x.5 values kept inline and labeled, page splits in parentheses. It sits alongside start_chapter / chapter (END) / continue_chapter, and every research anchor carries all four plus volume. Higher fidelity fills lower (full list > span > end-only), never the reverse.

*Why:* TokyoRev "63-64, 67" keeps the pulled-forward ch 67 visible; a sorted list would hide the adaptation order the UI will surface.

- ruled Sean 2026-08-23 (data-pipeline §10 "Full adaptation record (Sean 2026-08-23)"; §12.28)
- layer **writer**
- enforced: [lib/afg.ts#serializeChapters](../scripts/ingest/lib/afg.ts) · [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md)
- **audit: none — automation backlog**
- witnesses: the-case-study-of-vanitas, nisekoi, oshi-no-ko
- aliases: full adaptation record, full-record ruling, full-record protocol, chapters_adapted
- see: A29, A31, C3, A9

### A31 · Re-use never anchors; sharing never moves position

A chapter that appears in many episodes is listed as TRUE data in every row (chapters_adapted / annotations). Re-use of an already-adapted chapter by a later episode never anchors and never moves position — only furthest first-time coverage does. Episodes may legitimately share chapters; duplicate chapter positions are not an anchor-uniqueness problem, and continue metadata (C2) carries where-to-read-next.

*Why:* Ranma ep 130 and Shugo Chara ep 59 re-adapt earlier chapters; Gintama ep 227 shares chapters with its neighbour.

- ruled Sean 2026-08-25 (data-pipeline §10 "Continue-read regimes + re-use is true data (Sean's C3 clarification)" parts 3-4; §11 "AS ONE UNIT" item 1)
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- **audit: none — automation backlog**
- witnesses: ranma-1-2, shugo-chara, gintama
- aliases: re-use never anchors, shared chapters, re-use is true data, sharing never moves position
- see: A4, A8, C5, C3, chapter overlap never proves filler

### A32 · Anchors never encode resume positions

An anchor records a position, never where the reader resumes. A source value that is really a resume pointer (an MU "start reading from" number, a continue-from chapter) becomes continue_chapter, not the END anchor. The old shape that stored a resume value as an anchor is retired.

*Why:* Ippo's "558" was once stored as a mu anchor; nisekoi ep 32 is END 106 with continue 107.

- ruled Sean 2026-08-24 (data-pipeline §11 A4 bullet ("Anchors NEVER encode resume positions"); batch-10 full-record protocol)
- layer **both**
- enforced: [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md)
- **audit: none — automation backlog**
- witnesses: hajime-no-ippo-the-fighting, nisekoi
- aliases: anchors never encode resume positions, mu-558-as-anchor, MU resume pointer
- see: C2, C8, A4

### A33 · Anchor-aware interpolation between confirmed points

Confirmed points — every episode with a real mangaMapping (its last chapter = the frontier reached BY that episode) plus the latestKnown frontier — form a piecewise curve in canon-index space. An estimated chapter interpolates BETWEEN the surrounding points of the same regime and is clamped to [scope start, covered]. The global origin→frontier linear estimate survives only as the fallback when no interior anchor exists. Same-canon-index duplicates keep the max chapter.

*Why:* A single far-end frontier anchor (Boruto ep 293 → ch 67) made the old global linear estimate paint wrong values across the whole run.

- ruled Sean 2026-08-24 (src/lib/mapping.ts "anchor-aware interpolation (Sean 2026-08-24)")
- layer **display**
- enforced: [src/lib/mapping.ts#canonEpToCh](../src/lib/mapping.ts) · [src/lib/mapping.ts#anchorPoints](../src/lib/mapping.ts)
- audit: `anchor_gap_research`
- witnesses: boruto-naruto-next-generations, mapping.position.test.ts canonEpToCh — anchored interpolation
- aliases: anchor-aware interpolation, anchored interpolation, piecewise interpolation
- see: A18, A34, A39, A1

### A34 · Beyond the frontier, the honest estimate is no estimate

Past the last confirmed point no chapter is extrapolated: canon-typed episodes beyond the frontier may adapt side stories or nothing, so an extrapolated chapter there is a fabrication and renders null. Beyond the mapped frontier a null is the honest state and never a failure; inside the frontier, a null on a canon/mixed row is a failure unless the row sits in a reorder crossing.

*Why:* Kenshin's "lost episodes" 95-98 repeated ch 151 under the old clamp.

- ruled Sean 2026-08-23 (src/lib/mapping.ts canonEpToCh tail; verify-series-display header)
- layer **display**
- enforced: [src/lib/mapping.ts#canonEpToCh](../src/lib/mapping.ts) · [verify-series-display.ts#verifySeries](../scripts/ingest/verify-series-display.ts)
- audit: `frontier_tail_null`, `verify:hole`
- witnesses: rurouni-kenshin, mapping.position.test.ts refuses to extrapolate past the last confirmed point
- aliases: Kenshin rule, beyond-frontier rule, beyond-frontier null rendering, beyond-frontier honesty
- see: A35, A26, A33, A18, P6

### A35 · Frontier-tail triage: three causes, never auto-fix

Every frontier_tail_null hit (canon/mixed episodes numbered past the latest anchor) is exactly one of: a mis-numbered anchor → convert numbering; mistyped episodes → type override; real side-story or continuation content → research or the side-story notation. Each needs a ruling; nothing auto-fixes.

*Why:* Haikyu (OVA shift), X (anime-original ending, mistyped) and Kenshin 95-98 (side stories) were three different defects behind one symptom.

- ruled Sean 2026-08-23 (data-pipeline §10 "Frontier-tail triage (audit class frontier_tail_null)")
- layer **process**
- enforced: [audit-ui-truth.ts#classes.frontier_tail_null](../scripts/ingest/audit-ui-truth.ts)
- audit: `frontier_tail_null`
- witnesses: haikyu, x, rurouni-kenshin
- aliases: frontier-tail triage, frontier_tail_null triage
- see: A34, N13, A26, A43

### A36 · Section envelope: a header shows the true span of its rows

A section header's range is the TRUE envelope of the rows inside it — the lowest row start anywhere in the section to the highest coverage end anywhere in it — never first-row→last-row; volumes follow from those two chapters. Rows show the flow as stored; the header shows the span. A section straddling the frontier keeps its known start/end and marks the tail open-ended with a "+" on chapter and volume, never a bare dash while values exist inside.

*Why:* MHA 106-126 rendered "250-295" (first→last) and hid the My Villain Academia block; the true envelope is ch 221-295.

- ruled Sean 2026-08-23 (data-pipeline §10 "Section envelope (Sean 2026-08-23 s2)"; §12.22)
- layer **display**
- enforced: [src/lib/mapping.ts#buildEpisodeList](../src/lib/mapping.ts) · [src/components/EpisodeList.tsx#coverageLabel](../src/components/EpisodeList.tsx)
- **audit: none — automation backlog**
- witnesses: my-hero-academia
- aliases: section envelope, section header envelope, partial knowledge renders as partial
- see: A19, A4

### A37 · Tail honesty: no manga_only tail without a reached frontier

The manga_only tail (mangaAheadChapters / mangaAheadUnits) is computed only when anchors reach the end of the run — the latest anchor's episode at or above the last canon episode − 12 — and the source, effective total, coverage, adapted span and canon episode count are all positive with the effective total above coverage, and the residue is not handed off to a same-manga continuation. An unknown frontier shows NO tail: sparse coverage would fabricate a tail out of chapters the anime did adapt. The manga_only badge and hatch render only when the tail is positive.

*Why:* AFG's Naruto table stops early; computing a tail from it claimed the anime had not adapted chapters it had.

- ruled session 2026-08-23 (data-pipeline §10 "Tail honesty (coverage gate)")
- layer **display**
- enforced: [src/data/catalog/assemble.ts#anchorsReachEnd](../src/data/catalog/assemble.ts) · [src/data/catalog/assemble.ts#buildMapping](../src/data/catalog/assemble.ts)
- **audit: none — automation backlog**
- witnesses: naruto
- aliases: tail honesty, coverage gate, tail honesty / coverage gate, anchorsReachEnd
- see: A27, A38, continuation handoff, effective total, P6

### A38 · latestKnown synthesis for finished, anchor-less entries

With no anchors, a FINISHED entry that has a real total_chapters and at least one canon episode (and is not loose) takes its scope end as coverage — episode = last canon episode, chapters = total_chapters — because a finished adaptation's coverage IS its scope end by source-scope semantics. An airing entry without anchors stays honestly mapping_pending. Synthesis requires real totals and never overrides a stale anchor.

*Why:* Roughly 260 series had no anchors in the mock era; the position instrument had to be honest about which of them are actually finished.

- ruled session 2026-08-23 (data-pipeline §10 "latestKnown synthesis")
- layer **display**
- enforced: [src/data/catalog/assemble.ts#buildMapping](../src/data/catalog/assemble.ts)
- audit: `active_synthesized`, `pending_airing_no_anchor`, `pending_finished_no_totals`
- aliases: latestKnown synthesis, coverage synthesis, synthesized coverage
- see: A27, A37, A40, effective total

### A39 · Canon gap >12 episodes between anchors = research target

A series whose largest run of canon/mixed episodes strictly between consecutive anchors exceeds 12 has an interpolated middle resting on nothing and is a research-tier target for interior (arc-boundary) anchors. Filler and anime-only-canon episodes do not count toward the gap: anime-only-canon rows have no manga counterpart BY DESIGN, and position legitimately holds across them.

*Why:* Black Clover 130-157 adapts zero chapters across 28 episodes; position holds at ch 228 until ep 158, and counting those rows created a phantom desert.

- ruled Sean 2026-08-24 (data-pipeline §10 "anime-only-canon ≠ anchor desert (2026-08-23, the Black Clover lesson)"; audit-ui-truth anchor-density comment)
- layer **process**
- enforced: [audit-ui-truth.ts#classes.anchor_gap_research](../scripts/ingest/audit-ui-truth.ts)
- audit: `anchor_gap_research`
- witnesses: black-clover
- aliases: anchor_gap_research target
- see: A33, A1, density rule

### A40 · Loose series: anchors are borrow-maps, exempt from integrity

A series ruled mapping_mode = loose (volume-jumping, anime-original finale, genuinely untrackable borrow-maps) renders its anchors as stored and makes no monotonicity claim: it is excluded from every anchor-integrity check — non-monotonic, start-offtrend, chapter-space, A1 outcome, rearranged-zone, frontier holes. The classification is reserved for genuinely untrackable adaptations, never used to silence a fixable defect.

*Why:* Ouran and Blood Blockade Battlefront borrow chapters out of any order; their anchors are maps, not a curve.

- ruled Sean 2026-08-23 (data-pipeline §12.29-31 (ouran, blood-blockade, "LOOSE series skip monotonicity entirely"))
- layer **both**
- enforced: [audit-ui-truth.ts#classes.ok_loose](../scripts/ingest/audit-ui-truth.ts) · [verify-series-display.ts#verifySeries](../scripts/ingest/verify-series-display.ts)
- audit: `ok_loose`
- witnesses: ouran-high-school-host-club, blood-blockade-battlefront, to-love-ru, rosario-vampire
- aliases: loose exemption, loose ruling, borrow-maps render as stored, mapping_mode loose
- see: A19, A1, A7

### A41 · A rearranged/graft annotation settles a reorder for audits

An episode carrying a rearranged or graft annotation is a settled reorder: the non-monotonic, start-offtrend and start-regression checks skip a pair when either the episode or its predecessor is so annotated. Every other back-jump is either real flow to review once or numbering-space junk — the audit asks per hit. A documented out-of-order series derives its per-episode rearranged annotations from the anchors that ACTUALLY jump, never as a blanket claim over a season.

*Why:* Once a reorder is ruled the audits must stop asking; before it is ruled they must not stop.

- ruled session 2026-08-23 (audit-ui-truth anchor_nonmonotonic comment ("settled, stop asking"); §12.42 REORDER_REGIMES)
- layer **both**
- enforced: [audit-ui-truth.ts#classes.anchor_nonmonotonic](../scripts/ingest/audit-ui-truth.ts) · [verify-series-display.ts#verifySeries](../scripts/ingest/verify-series-display.ts) · [history/apply-research-batch-17.ts#REORDER_REGIMES](../scripts/ingest/history/apply-research-batch-17.ts)
- audit: `anchor_nonmonotonic`, `anchor_start_offtrend`, `verify:regression`
- witnesses: my-hero-academia, sket-dance, zatch-bell, ranma-1-2
- aliases: ruled reorder exemption, rearranged/graft exemption, settled reorders
- see: A19, A21, A3, A43

### A42 · An exact anchor with no episode row synthesizes the row

An exact anchor record proves its episode exists. For any integer-numbered anchor at or below aired_episodes that has no episode row, assembly synthesizes a canon, title-pending row so every consumer (anchor points, frontier, reorder detection) sees the record; a real row always wins. Source row sparseness never hides a researched record from the mapping layer.

*Why:* cells-at-work eps 12/13 had research anchors but no AFL/wiki rows; the anchors were invisible and re-flagged as holes.

- ruled session 2026-08-24 (data-pipeline §11 "Anchored row-less episodes (the cells-at-work 12/13 lesson, 2026-08-24)")
- layer **display**
- enforced: [src/data/catalog/assemble.ts#toEpisodes](../src/data/catalog/assemble.ts)
- **audit: none — automation backlog**
- witnesses: cells-at-work
- aliases: anchored row-less episodes, cells-at-work 12/13 lesson, cells-at-work 12/13
- see: A1, A33, episode-floor invariant

### A43 · Annotations are first-class; asterisk review is a queue

Non-linear facts about an episode (divergence, partial, graft, rearranged, side_story, loose_parallel, abridged) are first-class per-episode records in episode_annotations, never prose buried in a note. A research-landed annotation sets the series' asterisk_review pending; the asterisk_unreviewed census class is Sean's review queue and is cleared only by a ruling.

*Why:* Kenshin 95-98 and the GTO 20/21 zone were facts the display could not represent until annotations became data (migration 20260825100000_annotations_continue).

- ruled Sean 2026-08-23 (data-pipeline §10 "Asterisk review workflow"; migration annotations_continue)
- layer **writer**
- enforced: [supabase/migrations/20260825100000_annotations_continue.sql](../supabase/migrations/20260825100000_annotations_continue.sql) · [audit-ui-truth.ts#asterisk_unreviewed](../scripts/ingest/audit-ui-truth.ts)
- audit: `asterisk_unreviewed`
- witnesses: rurouni-kenshin, gto-great-teacher-onizuka
- aliases: asterisk model, asterisk review workflow, annotations are first-class, episode_annotations
- see: R10, A2

## C — Continue-read regimes

### C1 · C1: a mid-chapter ending continues in the straddled chapter

When an episode ends mid-chapter, continue-read is the straddled chapter itself — the reader re-reads a few pages, which is fine; no page-level precision hunting. A continue point equal to a chapter the episode already adapted is C1 by definition, never a "skip".

*Why:* Page-level resume positions cannot be verified from any source; re-reading a few pages is the honest cost.

- ruled Sean 2026-08-24 (batch-15 DECISIONS-FOR-SEAN "C1 mid-chapter END — RATIFIED"; data-pipeline §11 "AS ONE UNIT" item 3)
- layer **both**
- enforced: [lib/c3.ts#c3Ahead](../scripts/ingest/lib/c3.ts) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md)
- audit: `continue_skip_unnoted`
- aliases: C1 rule, mid-chapter straddle, mid-chapter END, straddled chapter
- see: C5, C3, C2

### C2 · C2: continue-read = anime parity

Where the next canon/mixed episode's start is KNOWN, continue_chapter = that start, so the reader stays in step with the anime even across skips and back-jumps. The chronological next-unseen value and any skip facts are preserved in continue_note; continue_kind records the regime (parity). Converted catalog-wide; nothing is UI-surfaced yet by design.

*Why:* End+1 sent readers ahead of or behind the anime whenever an adaptation skipped or reordered; parity is the only continue point a viewer can act on episode by episode.

- ruled Sean 2026-08-24 (batch-15 DECISIONS-FOR-SEAN "C2 continue-read = ANIME PARITY"; data-pipeline §12.37; migration 20260825200000)
- layer **writer**
- enforced: [heal-parity-continues.ts](../scripts/ingest/heal-parity-continues.ts) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md)
- **audit: none — automation backlog**
- aliases: C2 rule, anime parity, parity continue, continue-read = anime parity, C2 ANIME-PARITY continue rule
- see: C1, C3, C5, C6, C7, A4, A32
- supersedes: C9

### C3 · C3: a parity continue below covered chapters notes the skip

A continue point sitting STRICTLY below integer chapters listed in the same episode's chapters_adapted must carry a continue_note telling the reader which already-covered later chapters to skip on arrival. Parenthesized page/graft facts are stripped before number extraction so page spans never masquerade as chapters; fractional chapters are ignored. Skip language is any of skip / already / covered / re-read. The predicate is the single lib definition shared by the healer that stamps notes and the audit that verifies them.

*Why:* Iruma ep 63: END 142, continue 143, and ch 145 already covered — without the note the reader re-reads 145 without knowing why.

- ruled Sean 2026-08-25 (data-pipeline §10 "Continue-read regimes + re-use is true data (Sean's C3 clarification, 2026-08-25)"; §12.46)
- layer **both**
- enforced: [lib/c3.ts#c3Ahead](../scripts/ingest/lib/c3.ts) · [lib/c3.ts#hasSkipLanguage](../scripts/ingest/lib/c3.ts) · [lib/c3.ts#c3Note](../scripts/ingest/lib/c3.ts) · [heal-parity-continues.ts](../scripts/ingest/heal-parity-continues.ts)
- audit: `continue_skip_unnoted`
- witnesses: welcome-to-demon-school-iruma-kun, trigun, zatch-bell
- aliases: C3 rule, skip notes, skip-on-arrival note, C3 skip-note predicate, C3 clarification
- see: C2, C1, C5, A4, A31, A30

### C4 · C4: single-source-final

Where research proves that no second source exists for a position, a medium-confidence anchor stands as FINAL — with a do-not-demote note recording why — instead of staying open as a bookmark or research target.

*Why:* Silver Spoon boundaries, Rent-a-Girlfriend S4 interiors, Kowloon ep 12 and Beastars 46-47 had exactly one source each and were being re-queued forever.

- ruled Sean 2026-08-24 (batch-15 DECISIONS-FOR-SEAN item 4 "Single-source-final" (pre-collapse text, git fb349fa) — ratified as C4 in bbfd0c0)
- layer **process**
- enforced: [research/batch15/DECISIONS-FOR-SEAN.md](../scripts/ingest/research/batch15/DECISIONS-FOR-SEAN.md)
- **audit: none — automation backlog**
- witnesses: silver-spoon, rent-a-girlfriend, kowloon-generic-romance, beastars
- aliases: C4 rule, single-source-final, single-source final, do-not-demote
- see: 2+ sources, R16

### C5 · Continue-read is a regime choice governed by coverage

The continue point is governed by COVERAGE and KNOWN FUTURE anime coverage, never by which episode a chapter appears in. Mid-chapter ending → the straddled chapter (C1). Skipped or out-of-order material the anime WILL cover in known later episodes → PARITY: continue at the next episode's start (C2), with the already-covered later chapters noted to skip on arrival (C3). Skips never covered, or an unknown future → continue = furthest-covered + 1 with the skip range noted (kind unseen). After the finale → coverage + 1 (kind post_series), which may sit exactly one chapter past the display total and never further. The agent delivers this continue point; the apply layer stamps the regime metadata. Every jump records its why in annotations and continue_note.

*Why:* Three batches drifted on what "continue" meant until the regimes were written as one choice; the iruma ep-63 END-vs-max misread was the last casualty.

- ruled Sean 2026-08-25 (data-pipeline §11 "THE POSITION & CONTINUE-READ LOGIC, AS ONE UNIT" item 3; batch-17 PROTOCOL "Rules that bind" bullet 4; DRIFT-LIST A-1)
- layer **both**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [heal-parity-continues.ts](../scripts/ingest/heal-parity-continues.ts) · [audit-ui-truth.ts#classes.anchor_beyond_display_total](../scripts/ingest/audit-ui-truth.ts)
- audit: `continue_skip_unnoted`, `anchor_beyond_display_total`
- witnesses: welcome-to-demon-school-iruma-kun, zatch-bell, ranma-1-2, shugo-chara, hajime-no-ippo-the-fighting
- aliases: continue-read regimes, regime choice, continue point (b17), continue point, C1 C2 C3, continue-read = a regime choice
- see: C1, C2, C3, C6, A4, A31, A43

### C6 · continue_kind vocabulary: parity \| unseen \| post_series

chapter_anchors.continue_kind takes exactly one of: parity (continue = the next known canon/mixed episode's start), unseen (frontier or unknown future: furthest-covered + 1), post_series (finale: coverage + 1). continue_note carries the why. The columns exist from migration 20260825200000; a continue point outside the vocabulary is not a regime and is not written.

*Why:* Without a typed kind the healer could not tell a curated exception from a default and re-stamped both.

- ruled Sean 2026-08-24 (batch-15 DECISIONS-FOR-SEAN C2 (migration 20260825200000); data-pipeline §11 "CONTINUE-READ = ANIME PARITY")
- layer **writer**
- enforced: [heal-parity-continues.ts](../scripts/ingest/heal-parity-continues.ts)
- **audit: none — automation backlog**
- aliases: continue_kind, continue_kind vocabulary, parity | unseen | post_series
- see: C2, C5, C7

### C7 · Curated continue metadata survives writers and healers

continue_chapter / continue_kind / continue_note are curated data that may live on derived rows. Every delete+reinsert rebuild of afg or afg-continua anchors carries them over by episode (for continua only when the fresh pin lands on the same episode), so the hourly cron cannot erode the parity conversion one series at a time. The parity healer fills only ABSENT metadata; a curated continue with its kind and note is never overwritten by a healer.

*Why:* refresh-afg's rebuild dropped continue fields until preservation was added; batch-17 curated continues (trigun) had to survive the C3 pass.

- ruled session 2026-08-24 (data-pipeline §12.38 "CRON REVIEW" (preservation added to syncAnchors + applyContinua); apply-research-batch-17 CURATED_CONTINUES)
- layer **writer**
- enforced: [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts) · [history/apply-research-batch-17.ts#CURATED_CONTINUES](../scripts/ingest/history/apply-research-batch-17.ts) · [heal-parity-continues.ts](../scripts/ingest/heal-parity-continues.ts)
- **audit: none — automation backlog**
- witnesses: trigun
- aliases: parity-continue preservation, continue fields survive re-derive, curated continues, CURATED_CONTINUES
- see: C2, C6, A24, invariant 7

### C8 · AFG continue-from is reading guidance, not the frontier

The continua continue-from chapter is READING GUIDANCE, data of its own: it may legitimately say "skip ahead" (recap chapters) or "restart at" (rushed adaptation) and is never derived as frontier + 1. Only an absurd gap — |continue − 1 − END| above 40 — marks the parse suspect and withholds the table. The continua source owns series.continue_from_chapter only where it owns the frontier; where manual/wiki rule the frontier, research rules the continue point too. On an A1 refusal of the frontier pin the continue-from is still written, because guidance is not a position.

*Why:* Kowloon: ch 82 touched in ep 11, finale at 79, resume elsewhere — one number cannot carry frontier, max-adapted and resume. The afg.ts comment "continue-1 must agree" is the loser; the 40-chapter tolerance is the live rule.

- ruled session 2026-08-23 (data-pipeline §10 "Three-numbers model (research finding 2026-08-23)"; lib/anchors.ts applyContinua sanity band)
- layer **writer**
- enforced: [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts)
- **audit: none — automation backlog**
- witnesses: kowloon-generic-romance
- aliases: continue-from is guidance, continue-from-is-guidance, sanity band, 40-chapter band, three-numbers model
- see: A32, A5, A24, N28

### C9 · Default continue = anchor end + 1 (superseded by C2) *(superseded → C2)*

Where to resume reading after an episode is first-class data distinct from display: default = anchor END + 1 (the END chapter itself when a partial annotation marks a mid-chapter stop); research-named exceptions (skips, grafts, mid-chapter endings) live in chapter_anchors.continue_chapter with the why in the note; series.continue_from_chapter is the series-level lever. Superseded: the default is now anime parity (C2) chosen by regime (C5); the data-model half (continue_chapter as first-class data with a note) stands.

*Why:* The first nine seeded exceptions (JJK 47→138, Oshi 35→127, Dragon Maid 25→65, …) showed the default itself was wrong whenever the anime skipped.

- ruled Sean 2026-08-23 (data-pipeline §10 "Continue-reading points (Sean 2026-08-23; UI deferred)"; §12.27)
- layer **writer**
- enforced: [history/apply-continue-points.ts](../scripts/ingest/history/apply-continue-points.ts)
- **audit: none — automation backlog**
- witnesses: jujutsu-kaisen, oshi-no-ko, rent-a-girlfriend, miss-kobayashis-dragon-maid, seraph-of-the-end, blue-exorcist, food-wars, the-case-study-of-vanitas
- aliases: continue-reading points, end+1 default, default continue = end + 1, apply-continue-points
- see: C2, C5, A13

## T — Typing & taxonomy

### T1 · Episode-type vocabulary: four stored tokens

`episodes.type` takes exactly four values — canon, mixed, filler, anime-only-canon — check-constrained in the schema and typed as EpisodeType in the client; a type_corrections entry may name only these. AFL classes map 1:1 and fixed: manga_canon → canon, mixed_canon/filler → mixed, filler → filler, anime_canon → anime-only-canon. 'manga only' is a render concept for the unadapted source tail, never a stored type.

*Why:* T4.0 agenda: the four-way homonym (AFL anime_canon spans Madoka, where the anime IS the source, and Black Clover 130–157, a studio-original inside an adaptation; the badge reads as the wild 'anime only' = filler). Recorded as it stands — renames and new values (the candidate 'original-unruled' holding value for AFL anime-canon on adapted series) are T4.0 D-9/D-10/D-12; nothing renamed here.

- ruled source-derived 2026-08-22 (data-pipeline §1 roster (AFL) / §2 "Type taxonomy" / §6 schema; migration catalog_pipeline)
- layer **writer**
- enforced: [supabase/migrations/20260822000000_catalog_pipeline.sql](../supabase/migrations/20260822000000_catalog_pipeline.sql) · [lib/afl.ts#CLASS_TO_TYPE](../scripts/ingest/lib/afl.ts) · [src/types/anime.ts#EpisodeType](../src/types/anime.ts)
- **audit: none — automation backlog**
- aliases: four tokens, AFL class map, CLASS_TO_TYPE, episodes.type vocabulary, type_corrections allowed types
- see: T2, T4, T19, T23

### T2 · Episode-type semantics (Sean 2026-08-25)

`canon` = adapts the source's canon. `anime-only-canon` = made for the anime but CANON to the series — author / producers / community consensus treats it as canon. `filler` = ZERO canon content (anime-original with no canon standing; source-side filler is possible but unusual). `mixed` = canon AND non-canon in one episode; when the canon share is a single scene, whether it clears `mixed` is a judgment call — the verdict presents the facts. The tag is determined by OUR research of the episode's actual canon correspondence and recorded via EPISODE_TYPE_OVERRIDES (T6); source labels are starting principles only (T4).

*Why:* Ratified during batch-17 wave 1 when 'outside both canons' (T3) could not settle single-scene canon or zero-canon rehashes across a 100-retype wave. Parked for T4.0 D-10: whether anime-only-canon collapses into canon for original-source series, and 'canon TO WHAT source' once source typing is first-class — today these definitions are relative to the manga.

- ruled Sean 2026-08-25 (data-pipeline §10 "Episode-type semantics"; §12.45 NEW RULES; CHUNK1-RECOVERY §11)
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [lib/resolve.ts#EPISODE_TYPE_OVERRIDES](../scripts/ingest/lib/resolve.ts) · [.claude/skills/apply-batch/SKILL.md](../.claude/skills/apply-batch/SKILL.md)
- **audit: none — automation backlog**
- aliases: episode-type semantics, Sean's vocabulary, typing vocabulary, filler = zero canon, consensus-canon, mixed = canon AND non-canon
- see: T4, T6, T7, T8, T9
- supersedes: T3

### T3 · Filler = outside both canons (b17 D3 form) *(superseded → T2)*

anime-only-canon = made for the anime but standing as canon; filler = outside both canons (retconned or disposable).

*Why:* 'Outside both canons' left single-scene canon shares and zero-canon rehashes unresolved; refined on 2026-08-25 to 'ZERO canon content' plus explicit mixed semantics (T2). Kept so the batch-17 DECISIONS and the lib comment citations resolve.

- ruled Sean 2026-08-24 (batch17 DECISIONS-FOR-SEAN D3; lib/resolve.ts batch-17 comment)
- layer **writer**
- enforced: [lib/resolve.ts#EPISODE_TYPE_OVERRIDES](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- witnesses: world-trigger, twin-star-exorcists
- aliases: b17 D3, outside both canons, b17 D3 form

### T4 · Typing precedence: override > AFL > AFG (advisory)

An episode's type comes from, in precedence: a research-ruled EPISODE_TYPE_OVERRIDES entry; else AFL's classification wherever an AFL page classifies that episode; else AFG's row-class taxonomy (red = filler, blue = mixed, unstyled = canon — AFG has no anime-canon class), used only for expansion series with no AFL page and to fill episode numbers AFL lacks. AFL and AFG labels are advisory starting principles, never verdicts: a label past the point where a source's own table stops classifying is not a typing, and 2+ independent sources with chapter accounting outrank a source label alone.

*Why:* sket-dance 26/32 (AFL's table stops at ep 54 — its 'filler' beyond it is not a typing); fist-of-the-north-star's 8 corrections (hokuto.fandom + accounting over AFL alone); one-piece 737 (AFL anime-canon lost to an explicit chapter mapping). afg.ts's header still says 'AFL is the type authority' — the resolve.ts 2026-08-25 form stands (DRIFT-LIST §B).

- ruled Sean 2026-08-25 (lib/resolve.ts batch-17 chunk-1 comment; CHUNK1-RECOVERY §11; data-pipeline §10 semantics row)
- layer **writer**
- enforced: [lib/resolve.ts#filterEpisodeRows](../scripts/ingest/lib/resolve.ts) · [lib/afl.ts#CLASS_TO_TYPE](../scripts/ingest/lib/afl.ts) · [afg-expansion.ts#main](../scripts/ingest/afg-expansion.ts) · [afg-extend.ts#main](../scripts/ingest/afg-extend.ts)
- audit: `ruling_violation`
- witnesses: sket-dance, fist-of-the-north-star, one-piece
- aliases: typing precedence, AFL/AFG advisory, AFL is the type authority, fandom + accounting beats AFL, AFL label past table stop, override > AFL > AFG
- see: T1, T2, T6, T15
- supersedes: T5

### T5 · AFL wins, always (2026-08-22 form) *(superseded → T4)*

AFL is the filler/type authority: the episode-type taxonomy comes from AFL and AFL wins, always; AFG never overrides AFL on episode type — discrepancies file a flag.

*Why:* 'Always' became 'unless ruled via EPISODE_TYPE_OVERRIDES' on 2026-08-23, AFG's own taxonomy started classifying AFL-less expansion series on 2026-08-24, and AFL/AFG became advisory on 2026-08-25 (T4). Kept so §1/§2, the §10 preamble and the afg.ts header citations resolve.

- ruled Sean 2026-08-22 (data-pipeline §1 roster / §2 "Type taxonomy: AFL wins, always" / §10 preamble)
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- aliases: AFL wins, AFL wins, always, AFL owns episode types

### T6 · Retypes are standing rulings in EPISODE_TYPE_OVERRIDES

A research-ruled per-episode type correction lives ONLY in EPISODE_TYPE_OVERRIDES (lib/resolve.ts), with its citations, and re-applies inside filterEpisodeRows at EVERY episode write — a bare row update is clobbered by the next source refresh, and no writer gate derives a retype on its own (retype stays research-tier). After any addition, assert-type-overrides.ts asserts every standing row, because a ruling entered after a row's last write is otherwise stale until the next refresh. ruling_violation is the outcome check: a stored type must equal its ruled override.

*Why:* X 21–24 (2026-08-23) founded the map; eyeshield ep 74 (2026-08-25) sat stale after its ruling landed until the audit tripped — the healer closed that class forever. A verdict's type_corrections need 2+ sources (R family), and where a retype needs explaining its reasoning lands as annotations (rurouni-kenshin 99–100).

- ruled Sean 2026-08-23 (data-pipeline §10 "Episode-type overrides"; §12.47 NEW HEALER; CHUNK1-RECOVERY §11 D4 bullet)
- layer **writer**
- enforced: [lib/resolve.ts#EPISODE_TYPE_OVERRIDES](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#filterEpisodeRows](../scripts/ingest/lib/resolve.ts) · [assert-overrides.ts#main](../scripts/ingest/assert-overrides.ts) · [audit-ui-truth.ts#ruling_violation](../scripts/ingest/audit-ui-truth.ts)
- audit: `ruling_violation`
- witnesses: x, eyeshield-21, rurouni-kenshin
- aliases: EPISODE_TYPE_OVERRIDES, episode-type overrides, eyeshield ep-74 lesson, retype stays research-tier, type corrections via overrides, assert-type-overrides
- see: T2, T4, A1, type_corrections ≥2 sources

### T7 · Chapter overlap never proves filler (zatch-bell lesson)

Different episodes may legitimately adapt or revisit the SAME chapters. 'Every chapter is already claimed by another episode' is never evidence that an episode is filler — exhaustive chapter accounting is an anchoring aid, not a typing proof. Each episode is typed on its own content: any real canon in it → not filler. The overlap is discounted only under T8 (a rehash with nothing new).

*Why:* zatch-bell's 10-episode contested block was proposed 'all filler' on exhaustive accounting alone; re-research under this rule (konjikinogash.fandom per-episode manga_chapter fields + en-WP) split it 5 filler / 5 mixed — 51, 57, 103, 117, 122 carry real canon.

- ruled Sean 2026-08-25 (data-pipeline §10 "Chapter overlap never proves filler"; §12.45; research-agent "The bar")
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- **audit: none — automation backlog**
- witnesses: zatch-bell
- aliases: zatch-bell lesson, overlap rule, overlap ≠ filler, chapter overlap never proves filler
- see: T2, T8

### T8 · Rehash with nothing new = filler; mixed needs new canon

An episode that re-stages chapters already animated earlier and adds nothing new (a recap, a re-run, a rehash) adapts zero canon and is typed filler. It is mixed only when it ALSO contains new canon — re-staged canon content is never itself the canon share. Re-use never anchors and never moves position (C3).

*Why:* zatch-bell 119 (a re-staged ch 35–36 flashback already animated at eps 14–15) → filler, while the same-day detective-conan 128/1000/1001 'chapter re-runs → mixed' rulings pointed the other way. Sean's A-5 ruling (2026-08-25): re-staged content with nothing new = filler; mixed needs new canon; the conan rows are a named re-check task (a list, not a vibe).

- ruled Sean 2026-08-25 (DRIFT-LIST §A A-5; lib/resolve.ts zatch-bell comment)
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [lib/resolve.ts#EPISODE_TYPE_OVERRIDES](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- witnesses: zatch-bell, detective-conan
- aliases: rehash rule, overlap discount clause, A-5, rehash = filler, rehash discount
- see: T7, T2, C3

### T9 · Consensus-original class: declared canon side story

A licensed, author-supervised or author-declared canon side story adapted with zero source pages (a supervised novel or spin-off; studio content the author declares canon) is anime-only-canon. The discriminator is author DECLARATION or supervision, not commissioning: author-commissioned arcs never declared canon are filler.

*Why:* naruto-shippuden 452–457, black-clover 130–157 (Tabata-supervised), boruto 221–286 → anime-only-canon; kinnikuman 120–137 (commissioned, never declared canon, timeline overwritten by the 1991 sequel) → filler (wave 2, 2026-08-25). T4.0 D-10 keeps this class DISTINCT from the Madoka-style 'the anime is the source' meaning — do not merge them.

- ruled Sean 2026-08-24 (lib/resolve.ts naruto-shippuden / black-clover / boruto comments; §12.47 (kinnikuman))
- layer **writer**
- enforced: [lib/resolve.ts#EPISODE_TYPE_OVERRIDES](../scripts/ingest/lib/resolve.ts)
- audit: `ruling_violation`
- witnesses: naruto-shippuden, black-clover, boruto-naruto-next-generations, kinnikuman
- aliases: Boruto/Black Clover precedent, consensus-original class, author-declaration discriminator, licensed canon side story
- see: T2, T10, T11, T14

### T10 · Only-ending class: filler + annotation + asterisk (X)

A studio-original ending the community accepts only because no true ending exists (the source on indefinite hiatus) is typed filler — not canon, not anime-only-canon — carries an annotation stating why, and is marked for re-evaluation (the asterisk class) once the taxonomy rule lands.

*Why:* X 21–24: AFL says manga-canon, research says original; ruled anime-only-canon 2026-08-23, RE-RULED filler 2026-08-25 (§12.50) — the §10 overrides row still citing anime-only-canon is the DRIFT-LIST §B loser. The class ruling is parked under A-7 for T4.0; the asterisk-class mechanism is not built (the annotation stands in).

- ruled Sean 2026-08-25 (§12.50; system-evolution "Episode-type taxonomy v2"; lib/resolve.ts x comment)
- layer **writer**
- enforced: [lib/resolve.ts#EPISODE_TYPE_OVERRIDES](../scripts/ingest/lib/resolve.ts)
- audit: `ruling_violation`
- witnesses: x
- aliases: only-ending class, only ending, X 21-24 class, X only-ending
- see: T11, T12, T13, T2

### T11 · Caught-up-padded-out class: padding is filler (DSQ)

When the anime outran its source and the studio padded a finale, the padding is pure filler — no canon standing anywhere — annotated with why the real canon was never animated.

*Why:* detective-school-q 44–45: Sean overruled the verdict's anime-only-canon (2026-08-25). Standing CONTRARY per-series rulings for the same situation remain as stored — claymore 24–26 (Madhouse outran the manga, 2026-08-23), gto 42–43 (batch 11), ajin 14–26 — all anime-only-canon. A-7: parked to T4.0 with this evidence; nothing retyped, nothing unified here.

- ruled Sean 2026-08-25 (§12.50; system-evolution "Episode-type taxonomy v2"; lib/resolve.ts detective-school-q comment)
- layer **writer**
- enforced: [lib/resolve.ts#EPISODE_TYPE_OVERRIDES](../scripts/ingest/lib/resolve.ts)
- audit: `ruling_violation`
- witnesses: detective-school-q
- aliases: caught up, padded out, caught-up-padded-out class, DSQ class, padded finale
- see: T10, T12, T13, T9

### T12 · Contested-ending class: all canon, annotated (Evangelion) *(planned)*

When an alternative canon ending exists (a film that replaces or follows the broadcast ending), every episode stays canon and the affected final episodes carry an annotation explaining the controversy. No retype.

*Why:* neon-genesis-evangelion: End of Evangelion is ALSO canon and can replace/follow eps 25–26. Ruled 2026-08-25 as a class distinct from T10/T11; the annotation encoding is not built — T13 is the live sub-rule that requires it.

- ruled Sean 2026-08-25 (system-evolution "Episode-type taxonomy v2"; §12.50)
- layer **process**
- enforced: [docs/system-evolution.md](../docs/system-evolution.md)
- **audit: none — automation backlog**
- witnesses: neon-genesis-evangelion
- aliases: contested canonical ending, contested-ending class, Evangelion ending class
- see: T13, T10, T11

### T13 · Any final-episode debate is annotated

ANY debate about a series' final episodes — a contested, studio-original, padded or alternative ending — is annotated in the data (episode_annotations) so the UI can represent it, whatever the episodes' type.

*Why:* The one sub-rule inside the taxonomy-v2 notes Sean made effective immediately (2026-08-25); X 21–24 and DSQ 44–45 landed with rich annotations under it. No agent or skill text carries it yet — the enforcement is the ruling home, which is the capture gap.

- ruled Sean 2026-08-25 (system-evolution "Episode-type taxonomy v2" → "Standing sub-rule effective now")
- layer **process**
- enforced: [docs/system-evolution.md](../docs/system-evolution.md)
- **audit: none — automation backlog**
- witnesses: x, detective-school-q, neon-genesis-evangelion
- aliases: final-episode debate annotation, ending-debate annotation, ANY debate about final episodes
- see: T10, T11, T12, A43

### T14 · anime-only-canon ≠ anchor desert (Black Clover lesson)

Episodes typed anime-only-canon have no source counterpart BY DESIGN: they render truthfully with no chapter (never mapping-pending), never count toward anchor_gap_research, and position holds at the last anchor until the next canon/mixed episode.

*Why:* black-clover 130–157 adapts zero chapters across 28 episodes; position holds at ch 228 until ep 158. The typing itself is research-ruled per episode (T6); the anchor prohibition on such rows is A1.

- ruled session 2026-08-23 (data-pipeline §10 "anime-only-canon ≠ anchor desert (2026-08-23, the Black Clover lesson)")
- layer **both**
- enforced: [audit-ui-truth.ts#anchor_gap_research](../scripts/ingest/audit-ui-truth.ts) · [src/lib/mapping.ts#buildEpisodeList](../src/lib/mapping.ts) · [src/data/catalog/assemble.ts#toEpisodes](../src/data/catalog/assemble.ts)
- audit: `anchor_gap_research`
- witnesses: black-clover
- aliases: Black Clover lesson, anime-only-canon ≠ anchor desert, anime-only-canon has no chapter counterpart
- see: A1, T2, T9

### T15 · AFG-expansion typing: the row flag must be mapped

Wherever AFG is the type source (an expansion series with no AFL page, or AFG-filled episode numbers on extension), the row-class flag (red = filler, blue = mixed, unstyled = canon) MUST be mapped into episodes.type for every row written. Importing AFG titles without their flags is a defect: the rows default to canon and the series types wrong until research finds it.

*Why:* eyeshield-21 (AFL has no page): the import took AFG's title cells raw — typos and '* Filler' suffixes included — but never mapped the flag, so 19 filler/recap episodes stood canon for months (CHUNK1-RECOVERY wave 2; §12.47–48). The 'AFG-expansion typing sweep' (other expansion series typed the same way) is pre-18 backlog; no audit class asserts the mapping — the empty cell is the backlog.

- ruled session 2026-08-25 (CHUNK1-RECOVERY wave-2 verify table (eyeshield row); §12.47 backlog; §12.48)
- layer **writer**
- enforced: [lib/afg.ts#parseAfgPage](../scripts/ingest/lib/afg.ts) · [afg-expansion.ts#main](../scripts/ingest/afg-expansion.ts) · [afg-extend.ts#main](../scripts/ingest/afg-extend.ts)
- **audit: none — automation backlog**
- witnesses: eyeshield-21
- aliases: eyeshield lesson, AFG-expansion typing, flags must be mapped, AFG-expansion typing sweep
- see: T4, T16

### T16 · AFG '* Filler' title marker is annotation, not a name

AFG's '* Filler' marker inside a title cell is table annotation, never part of the episode's name: parseAfgPage strips it and the type signal comes from the row class. A stored title carrying the marker means an episode writer bypassed the parser gate — ruling_violation.

*Why:* 99 stored titles across eyeshield-21, twin-star-exorcists, world-trigger, kakegurui and tougen-anki carried it verbatim (Sean's eyeshield report 2026-08-25); fixed at the rule tier, all four edges redeployed, afg-restage.ts brought all 266 staged pages current.

- ruled Sean 2026-08-25 (data-pipeline §12.48 "AFG TITLE-MARKER CLEANUP")
- layer **writer**
- enforced: [lib/afg.ts#parseAfgPage](../scripts/ingest/lib/afg.ts) · [audit-ui-truth.ts#ruling_violation](../scripts/ingest/audit-ui-truth.ts)
- audit: `ruling_violation`
- witnesses: eyeshield-21, twin-star-exorcists, world-trigger, kakegurui, tougen-anki
- aliases: AFG title-marker rule, * Filler marker, eyeshield title report, AFG "* Filler" title-marker rule
- see: T15

### T17 · Base-type padding: gaps take the series’ own base type

Episode spans are contiguous same-type runs over 1..aired; classification gaps, the not-yet-classified tail and a row-less series pad with the series' OWN base type — canon when it has a source, anime-only-canon when source_type is original — never a hardcoded canon. A row-less series with a source therefore defaults to all-canon spans and its last canon episode is its last aired episode (canon-tier).

*Why:* Hardcoding canon fabricated 'canon' episodes on super-dragon-ball-heroes' unclassified tail. mapping.ts#episodeTypeAt still falls back to 'canon' off-range (DRIFT-LIST §C 'default episode type' — reachable only outside 1..aired today); wiki-backfill-created rows and toEpisodes' synthesized rows are also hardcoded canon, an original-source edge case.

- ruled session 2026-08-23 (data-pipeline §10 "Base-type padding"; §12.19c2 canon-tier (Sean 2026-08-23); assemble.ts buildSpans comment)
- layer **both**
- enforced: [src/data/catalog/assemble.ts#buildSpans](../src/data/catalog/assemble.ts) · [src/data/catalog/assemble.ts#buildMapping](../src/data/catalog/assemble.ts) · [src/lib/mapping.ts#episodeTypeAt](../src/lib/mapping.ts) · [wiki-episodes-backfill.ts#main](../scripts/ingest/wiki-episodes-backfill.ts)
- **audit: none — automation backlog**
- witnesses: super-dragon-ball-heroes, mapping.test.ts "defaults to canon outside every span"
- aliases: base-type padding, canon-default typing, canon-tier spans, canon-default
- see: T18, T22, canon-tier creation

### T18 · Legend by count: badges from data, not source-type branches

The type legend and its badges render purely from per-type counts in the data — no branching on source_type or series class; a badge with zero count does not render. Data decides which types exist: a manga series can carry anime-original canon and an original can carry filler.

*Why:* Mock-era source-type branches hid real tags twice (one-piece's 21 anime-original-canon eps; super-dragon-ball-heroes' filler). The client already treats type counts as data — the input T4.0 builds on.

- ruled session 2026-08-21 (data-pipeline §10 "Legend by count"; AnimeCard legend comment (date = the TypeBadge design-system note, the earliest the extract gives))
- layer **display**
- enforced: [src/components/AnimeCard.tsx#AnimeCard](../src/components/AnimeCard.tsx) · [src/components/TypeBadge.tsx#TypeBadge](../src/components/TypeBadge.tsx)
- **audit: none — automation backlog**
- witnesses: one-piece, super-dragon-ball-heroes
- aliases: legend by count, legend-by-count
- see: T17, T19

### T19 · Type-badge vocabulary (display)

The display vocabulary is exactly five badge kinds — canon, mixed, filler, manga_only, anime_only — rendered as their literal kind string. The episode type anime-only-canon maps to the badge kind anime_only; manga_only is a derived tail state (published chapters beyond coverage), not a stored episode type; the internal string 'anime-only-canon' never reaches the user. Contiguous same-type runs are 'sections', never 'arcs' (arcs are story arcs).

*Why:* T4.0 D-12: 'anime_only' reads as the wild phrase that usually means filler, and 'manga_only' must generalise beyond manga ('source only' candidate) — the rename surface is exactly these strings plus manga_status 'anime_only' (T22). Recorded as it stands; nothing renamed.

- ruled session 2026-08-21 (src/components/TypeBadge.tsx design-system header; system-evolution D-12)
- layer **display**
- enforced: [src/components/TypeBadge.tsx#TypeBadgeKind](../src/components/TypeBadge.tsx) · [src/components/MangaMappingDisplay.tsx#KIND](../src/components/MangaMappingDisplay.tsx) · [src/components/MappingStrip.tsx#SPAN_LABELS](../src/components/MappingStrip.tsx) · [src/components/AnimeCard.tsx#hiddenTypes](../src/components/AnimeCard.tsx)
- **audit: none — automation backlog**
- aliases: type-badge vocabulary, TypeBadgeKind, sections never arcs, anime_only badge, manga_only badge, display vocabulary
- see: T1, T18, T22

### T20 · source_type derivation (AniList source + country)

series.source_type is derived from AniList: source MANGA / DOUJINSHI / ONE_SHOT → 'manga', or 'webtoon' when countryOfOrigin is KR or CN; LIGHT_NOVEL / NOVEL / WEB_NOVEL → 'light_novel'; no declared source but a manga ADAPTATION edge → 'manga' (old entries omit source); otherwise 'original'. The vocabulary is check-constrained to manga / webtoon / light_novel / original and extends by value, never by overloading.

*Why:* chain.ts#aggregate re-implements this inline WITHOUT DOUJINSHI/ONE_SHOT and WITHOUT the no-source-but-edge fallback, so a stitched head lacking `source` becomes 'original' (DRIFT-LIST §C, §E-3). The T2 edge allows unifying with resolve.ts but forbids inventing values before T4.0 D-9 rules the source enum (KR/CN → manhwa/manhua, webtoon by format, further candidates; unmapped fails closed).

- ruled session 2026-08-22 (lib/resolve.ts sourceType; migration catalog_pipeline (check constraint); system-evolution "Type taxonomy — target state")
- layer **writer**
- enforced: [lib/resolve.ts#sourceType](../scripts/ingest/lib/resolve.ts) · [lib/chain.ts#aggregate](../scripts/ingest/lib/chain.ts) · [supabase/migrations/20260822000000_catalog_pipeline.sql](../supabase/migrations/20260822000000_catalog_pipeline.sql)
- **audit: none — automation backlog**
- aliases: source_type derivation, sourceType, source typing, source_type vocabulary
- see: T21, T22, T24

### T21 · Derivative-manga rule (Evangelion class)

AniList's ADAPTATION edge is directionless. A source=ORIGINAL anime never claims its linked manga as source material — that manga adapts the ANIME — so no manga is attached and manga_status is 'anime_only'. A manga edge on a source-less old entry counts as source evidence (→ source_type 'manga').

*Why:* Evangelion/Madoka (2026-08-23): the linked manga adaptations would otherwise have become fake source instruments with fabricated positions.

- ruled session 2026-08-23 (data-pipeline §10 "Derivative-manga rule"; lib/resolve.ts resolveSeries comment)
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#pickManga](../scripts/ingest/lib/resolve.ts) · [lib/chain.ts#aggregate](../scripts/ingest/lib/chain.ts)
- **audit: none — automation backlog**
- witnesses: neon-genesis-evangelion, puella-magi-madoka-magica
- aliases: derivative-manga rule, Evangelion class, Evangelion/Madoka class
- see: T20, T22

### T22 · manga_status vocabulary and the 'anime_only' homonym

series.manga_status maps the attached manga's AniList status — RELEASING → publishing, FINISHED → finished, HIATUS → hiatus, NOT_YET_RELEASED → publishing, CANCELLED → finished, unknown → publishing — and is 'anime_only' when no manga is attached. That 'anime_only' is a SERIES fact ('there is no manga'), unrelated to the episode type anime-only-canon. A series has a source instrument iff source_type ≠ 'original' AND manga_status ≠ 'anime_only'.

*Why:* The homonym is T4.0 D-12 (renamed in the same session as the badge strings). chain.ts#aggregate's inline map lacks CANCELLED → finished (DRIFT-LIST §C). The hasSource predicate is inlined in buildMapping and both audits (census bucket no_source, not an outcome check) and — with manga_status dropped — in AnimeCard/usePositionLookup: a series with source_type manga but manga_status anime_only renders differently in card and mapping (DRIFT-LIST §C 'hasSource').

- ruled session 2026-08-22 (lib/resolve.ts MANGA_STATUS_MAP / resolveSeries; assemble.ts buildMapping hasSource)
- layer **both**
- enforced: [lib/resolve.ts#MANGA_STATUS_MAP](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts) · [lib/chain.ts#aggregate](../scripts/ingest/lib/chain.ts) · [src/data/catalog/assemble.ts#buildMapping](../src/data/catalog/assemble.ts)
- **audit: none — automation backlog**
- aliases: manga_status vocabulary, MANGA_STATUS_MAP, manga_status 'anime_only', hasSource, anime_only homonym
- see: T19, T20, T21, T17

### T23 · Format is orthogonal to canon standing

Format (tv / ova / special / movie / recap) is orthogonal to canon standing: episodes.type never carries a format value, and series.source_type extends by value, never by overloading. A per-episode format dimension (column or first-class annotation kind) is chosen at the design pass; until then format facts land as annotations as research delivers them.

*Why:* rurouni-kenshin's Trust & Betrayal rows are canon AND OVAs; kenichi 51–61 likewise — overloading type would destroy the canon-standing filter. The prohibition is live today through T1's check constraint; the format dimension itself is T4.0 D-11 (watch_order_entries.kind vocabulary, asterisk classes as annotation kinds) — do not improvise before it.

- ruled Sean 2026-08-25 (system-evolution "Type taxonomy — target state (Sean, 2026-08-25)")
- layer **writer**
- enforced: [supabase/migrations/20260822000000_catalog_pipeline.sql](../supabase/migrations/20260822000000_catalog_pipeline.sql) · [docs/system-evolution.md](../docs/system-evolution.md)
- **audit: none — automation backlog**
- witnesses: rurouni-kenshin, kenichi-the-mightiest-disciple
- aliases: format ⟂ canon standing, format-is-orthogonal, format is orthogonal to standing, never overload episodes.type
- see: T1, T20

### T24 · LN instrument ruling: volume-space for light novels *(planned)*

Light-novel-sourced series (source_type light_novel — the 86 / Re:Zero class) get a VOLUME-space instrument — anchors, frontier and continue-from in LN volumes on the same machinery — never a fake manga position. Per-series behaviour research is logged as it lands; UI adaptation is decided in the UI pass.

*Why:* Their adaptation edge is format NOVEL, so no manga instrument exists (34 series; §12.16 said 38). Ruled 2026-08-23, build pending; system-evolution names it the sibling of T4.0 source-first typing — 'canon TO WHAT source', with D-12's per-source instrument unit (chapter / volume / episode).

- ruled Sean 2026-08-23 (data-pipeline §10 "LN instrument ruling"; §12.16 / §12.23 Q3; apply-research-batch-7.ts comment)
- layer **process**
- enforced: [docs/system-evolution.md](../docs/system-evolution.md)
- **audit: none — automation backlog**
- witnesses: 86-eighty-six, re-zero, sword-art-online, overlord
- aliases: LN instrument ruling, LN class, light-novel instrument, Queue 3 LN ruling, LN volume-space instrument
- see: T20, T22

## N — Numbering, counts & chapter spaces

### N1 · Episode-floor invariant

Displayed aired/total episode counts are never lower than our own highest episode number. An overshoot of at most 2 (recap / ep-0 numbering) floors automatically in EVERY totals writer; a larger overshoot floors only once RULED (an EXTRAS_ADOPTED entry) — otherwise the writer leaves the totals unchanged and the reconcile-structure flag is the research trigger. A refresh never reverts an adopted floor.

*Why:* Sean 2026-08-24: "how can the total ever be lower than the episode count?" — angel-beats 16 and rurouni-kenshin 100 are real broadcast content AniList does not count.

- ruled Sean 2026-08-24 (data-pipeline §10 'Episode-floor invariant')
- layer **writer**
- enforced: [lib/resolve.ts#applyEpisodeFloor](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#EXTRAS_ADOPTED](../scripts/ingest/lib/resolve.ts) · [reconcile-structure.ts#main](../scripts/ingest/reconcile-structure.ts)
- audit: `integrity_eps_beyond_total`
- witnesses: angel-beats, rurouni-kenshin
- aliases: episode-floor invariant, episode floor, floor rule, EXTRAS_ADOPTED
- see: N2, N3, N34, N26

### N2 · Lone-row overshoot is a typo candidate

An episode overshoot greater than 2 that is sourced from a SINGLE chart row with no corroborating content anywhere is a typo candidate, not an adoption candidate: it is never entered in EXTRAS_ADOPTED without independent evidence of the episode.

*Why:* eyeshield-21 'ep 155' was one AFG chart row; the adoption was reverted in §12.49. No gate exists yet — the extend path still materialises a row from a lone chart number.

- ruled session 2026-08-25 (data-pipeline §12.49 'Lesson for the floor rule')
- layer **process**
- enforced: [lib/resolve.ts#EXTRAS_ADOPTED](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- witnesses: eyeshield-21
- aliases: floor-rule typo lesson, eyeshield-21 155 lesson
- see: N1, N7

### N3 · The community-consensus episode count is the truth

The community-consensus episode count is the truth: specials and ep-0s the community numbers are IN (a count may start at 0); large events it does not number are order-only components. A per-series cap in COMMUNITY_COUNT_OVERRIDES clamps aired/total after the episode floor and drops episode rows above the cap at every episode write.

*Why:* AFL numbered Psycho-Pass's First Inspector and films (41 + events); UBW's ep 0 and Ippo's Boxer's Fist ep 76 are numbered by the community and count. The cap is the durable instrument (yu-yu-hakusho).

- ruled Sean 2026-08-24 (data-pipeline §10 'Community-count rulings (Sean 2026-08-24 refinement)')
- layer **writer**
- enforced: [lib/resolve.ts#COMMUNITY_COUNT_OVERRIDES](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#applyCommunityCap](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#filterEpisodeRows](../scripts/ingest/lib/resolve.ts)
- audit: `ruling_violation`
- witnesses: fate-stay-night-unlimited-blade-works, hajime-no-ippo, souten-no-ken, psycho-pass, k, hayate-no-gotoku, high-school-dxd, monogatari-series, yu-yu-hakusho
- aliases: community-count rulings, community-count rule, community count rule, numbered-vs-event rule, COMMUNITY_COUNT_OVERRIDES
- see: N1, N4, N7, N8, N18, N20

### N4 · Movies count only when numbered

A movie/OVA enters episode counts ONLY when the community numbering explicitly numbers it (then it is a kind-tagged component with a real episode range). Un-numbered in-flow content holds a season_order position with a NULL episode range — watch-order placement with zero effect on counts, aired or the strip; the stitched volatile refresh sums only components with a non-null episode_start.

*Why:* Initial D Third Stage = ep 40 (numbered, counts); the Kizu movies and the Psycho-Pass films are order-only (null range). The UI badge/divider treatment is planned, not built.

- ruled Sean 2026-08-23 (data-pipeline §10 'Movies count ONLY when numbered (Sean 2026-08-24)'; stitch.ts header (2026-08-23))
- layer **writer**
- enforced: [lib/chain.ts#writeComponents](../scripts/ingest/lib/chain.ts) · [lib/resolve.ts#refreshStitchedVolatile](../scripts/ingest/lib/resolve.ts) · [stitch.ts#OVERRIDE_CHAINS](../scripts/ingest/stitch.ts)
- audit: `special_numbered_unreviewed`
- witnesses: initial-d, attack-on-titan, monogatari-series, psycho-pass, black-butler, ghost-in-the-shell-stand-alone-complex, yu-gi-oh-2000
- aliases: movies count only when numbered, movies rule, Initial D rule, order-only components never count
- see: N3, I19, N7, N31

### N7 · Numbered-specials research trigger

ANY non-typical entry (special / OVA / movie / recap) that any source numbers into a run surfaces for evaluation against community consensus: ask Sean, then record the ruling in REVIEWED_NUMBERED_SPECIALS. An unreviewed numbered special is an open audit hit, never a silent count.

*Why:* First sweep 2026-08-24: 34 found, 8 session-ruled, 26 queued for Sean.

- ruled Sean 2026-08-24 (data-pipeline §10 'Numbered-specials research trigger (Sean 2026-08-24)')
- layer **process**
- enforced: [audit-ui-truth.ts#REVIEWED_NUMBERED_SPECIALS](../scripts/ingest/audit-ui-truth.ts)
- audit: `special_numbered_unreviewed`
- aliases: numbered-specials research trigger, REVIEWED_NUMBERED_SPECIALS, numbered specials trigger
- see: N3, N4, N8, N33

### N8 · Recap rule

A recap / rebroadcast entry is excluded from the numbered episode count AND from the watch order (disposition excluded_recap) even when MAL/AniList number it; when a source numbers it, the row drops and a SOURCE_NUMBERING_SHIFTS entry translates every later row. Real bonus content instead holds an order-only watch-order slot.

*Why:* Monogatari recaps were numbered by MAL; kimi-ni-todoke ep 44 is a Netflix recap; mashle ep 7 was an absorbed recap that shifted 8-25 one off from every other source.

- ruled Sean 2026-08-23 (apply-research-batch-7.ts header (2026-08-23); data-pipeline §12.29; §12.45 (mashle))
- layer **writer**
- enforced: [lib/resolve.ts#SOURCE_NUMBERING_SHIFTS](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#COMMUNITY_COUNT_OVERRIDES](../scripts/ingest/lib/resolve.ts) · [sync-watch-order.ts#main](../scripts/ingest/sync-watch-order.ts)
- audit: `ruling_violation`, `fractional_unmodeled`
- witnesses: monogatari-series, urusei-yatsura, kimi-ni-todoke-from-me-to-you, dr-stone, cells-at-work, mashle-magic-and-muscles
- aliases: recap rule, Monogatari precedent, excluded_recap
- see: N3, N9, N11, N33

### N9 · In-between entries live at fractional positions

In-between entries (specials / OVAs / recaps / movies) live at FRACTIONAL watch-order positions (6.5-style — the Crunchyroll/community convention), never absorbed as integer episode rows. When our rows have absorbed such an entry, the run is renumbered to the convention THROUGH THE SHARED LIB (resolveSeries with the shift declared), never by a hand UPDATE.

*Why:* mashle: an integer recap row at 7 put rows 8-25 one off from AFG/fandom/Wikipedia/AniList and made every derived anchor one row early.

- ruled Sean 2026-08-25 (batch-17 CHUNK1-RECOVERY §9 'SEAN'S RULING — mashle recap'; data-pipeline §12.45)
- layer **writer**
- enforced: [lib/resolve.ts#SOURCE_NUMBERING_SHIFTS](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts) · [sync-watch-order.ts#main](../scripts/ingest/sync-watch-order.ts)
- audit: `ruling_violation`, `fractional_unmodeled`
- witnesses: mashle-magic-and-muscles
- aliases: fractional ruling, mashle ruling, fractional in-between entries, fractional numbering convention
- see: N8, N10, N11, N12, N31

### N10 · Fractional wiki labels prove a shared numbering space

Wikipedia fractional episode numbers (35.5, 13.5, 0.5) are the community notation for entries slotted BETWEEN episodes without being counted — our order-only concept. Their presence proves the page shares our numbering space; a fractional row may describe an order-only component but is never an episode row, and every one is staged durably into ingest_fractionals.

*Why:* dr-stone: Wikipedia labels Ryuusui 35.5 (already our space) while AFL numbered it ep 36 — the fractional label is what told the two spaces apart.

- ruled Sean 2026-08-23 (data-pipeline §10 'Source numbering translation' (fractional evidence clause); lib/wikipedia.ts WikiEpisode comment)
- layer **writer**
- enforced: [lib/wikipedia.ts#parseEpisodeList](../scripts/ingest/lib/wikipedia.ts) · [wiki-episodes-backfill.ts#main](../scripts/ingest/wiki-episodes-backfill.ts)
- audit: `fractional_unmodeled`
- witnesses: dr-stone
- aliases: fractional wiki labels prove a shared space, fractional evidence
- see: N9, N11, N21

### N11 · Source numbering translation (the Ryuusui lesson)

Every per-episode source lives in its OWN numbering space. A watch-order entry a source NUMBERS but our community count holds order-only shifts every later row — titles AND types — so SOURCE_NUMBERING_SHIFTS declares drop + shift per series and filterEpisodeRows translates for EVERY episode writer: the insert's own row drops (it exists as a component, never an episode) and source n ≥ from maps to n + offset. A rule that moves numbering must prove nothing broke: outcome-side, no two adjacent rows share a non-empty title and the run is contiguous 1..max.

*Why:* AFL numbered Ryuusui as dr-stone ep 36; our eps 36-58 were +1 poisoned in title and type. Sean 2026-08-23: rules that move numbering must prove nothing broke.

- ruled Sean 2026-08-23 (data-pipeline §10 'Source numbering translation (Sean 2026-08-23, the Ryuusui lesson)')
- layer **writer**
- enforced: [lib/resolve.ts#SOURCE_NUMBERING_SHIFTS](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#filterEpisodeRows](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#translateEpisodeNumber](../scripts/ingest/lib/resolve.ts)
- audit: `ruling_violation`
- witnesses: dr-stone, mashle-magic-and-muscles, bungo-stray-dogs, k, hayate-no-gotoku, hajime-no-ippo, monogatari-series
- aliases: source numbering translation, Ryuusui lesson, Dr. Stone / Ryuusui lesson, numbering-space translation, SOURCE_NUMBERING_SHIFTS, shift verification
- see: N8, N9, N10, N12, N13, N16, N18, N19, N20

### N12 · A shift names the source spaces it applies to

A SOURCE_NUMBERING_SHIFTS ruling may name the SOURCE SPACES it applies to ('afl' | 'afg' | 'wiki'); absent means every space, present means only the named spaces translate. Every filterEpisodeRows / translateEpisodeNumber caller states its space.

*Why:* mashle: only AFL numbered the recap — AFG, fandom and Wikipedia already counted in our space, so an unscoped shift would have double-shifted them; the mashle shift names ['afl'].

- ruled Sean 2026-08-25 (data-pipeline §12.45; lib/resolve.ts SOURCE_NUMBERING_SHIFTS comment)
- layer **writer**
- enforced: [lib/resolve.ts#translateEpisodeNumber](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#filterEpisodeRows](../scripts/ingest/lib/resolve.ts) · [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts)
- audit: `ruling_violation`
- witnesses: mashle-magic-and-muscles
- aliases: per-source numbering spaces, mashle lesson (spaces), source spaces
- see: N9, N11, N13

### N13 · Anchors and annotations translate like episode rows

Per-episode data from a source — chart anchors AND bonus/graft annotations — translates through SOURCE_NUMBERING_SHIFTS exactly like episode rows (translateEpisodeNumber, space stated); dropped order-only entries never anchor.

*Why:* Closed the gap where a shift-ruled series with an AFG chart received anchors at untranslated numbers (2026-08-23, Sean's bake-into-sources directive).

- ruled session 2026-08-23 (data-pipeline §10 'Anchor numbering translation (2026-08-23)')
- layer **writer**
- enforced: [lib/resolve.ts#translateEpisodeNumber](../scripts/ingest/lib/resolve.ts) · [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts)
- **audit: none — automation backlog**
- witnesses: dr-stone, mashle-magic-and-muscles
- aliases: anchor numbering translation
- see: N11, N12, N14

### N14 · Research anchors convert to OUR numbering at apply

Research anchors arrive in EXTERNAL numbering (MAL / Wikipedia season counts); a mid-run numbered OVA/special shifts every later episode, so every anchor converts to OUR cumulative numbering (the context file's) at application time and the conversion is stated in the anchor note. A verdict is written in our numbering, never the source's per-season numbering.

*Why:* Haikyu: MAL ep 85 is our ep 87 (the Riku vs Kuu OVA = our eps 61-62); recorded unconverted, eps 86-87 were nulled — frontier_tail_null caught it.

- ruled Sean 2026-08-23 (data-pipeline §10 'Anchor numbering conversion (Sean 2026-08-23)'; batch PROTOCOL 'Read first')
- layer **process**
- enforced: [.claude/skills/apply-batch/SKILL.md](../.claude/skills/apply-batch/SKILL.md) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [audit-ui-truth.ts#frontier_tail_null](../scripts/ingest/audit-ui-truth.ts)
- audit: `frontier_tail_null`
- witnesses: haikyu
- aliases: anchor numbering conversion, Haikyu ep-85 lesson
- see: N13, N15, A4

### N15 · Continua episode conversion from MAL-style numbering

AFG counts in MAL-style numbering, so a continua frontier episode is shifted past every non-season numbered component (insert) that starts at or before it — unless the page's own chart max already reaches our aired count (already in our space). A converted episode above aired_episodes is discarded and the pin falls back to the run end; no episode at all is 'no_data'.

*Why:* Haikyu AFG ep 85 = our 87. you-and-i-are-polar-opposites recorded a case where the conversion landed one episode short of the chart rows — cross-checking the converted episode against chart rows is a gate candidate (§12, not ruled).

- ruled session 2026-08-23 (lib/anchors.ts applyContinua ('numbering conversion' §10 clause of the AFG continua source row))
- layer **writer**
- enforced: [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts)
- **audit: none — automation backlog**
- witnesses: haikyu, you-and-i-are-polar-opposites
- aliases: AFG episode-numbering conversion, continua numbering conversion
- see: N14, N16, AFG continua source

### N16 · AFG numbering alignment gate (±12)

When an AFG page's max episode differs from our max episode by more than 12, the whole page's anchors are withheld with a count_mismatch flag (only when we already hold episode rows). The comparison is source-space max against our max BEFORE translation — for a shift-ruled series the gap is the insert length.

*Why:* A season of lag is noise; a larger gap means the page is not counting what we count. ranma proved AFG row order can be inconsistent inside an aligned page — whether syncAnchors should title-join is /add-rule backlog (DRIFT A-4), not a rule here.

- ruled session 2026-08-23 (data-pipeline §10 'Alignment gate' (AFG); lib/anchors.ts syncAnchors)
- layer **writer**
- enforced: [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [afg-expansion.ts#main](../scripts/ingest/afg-expansion.ts)
- **audit: none — automation backlog**
- witnesses: ranma
- aliases: AFG numbering alignment gate, AFG alignment gate, alignment gate, ±12 alignment, AFG numbering alignment
- see: N11, G13, N28, title-join rule, Stitch finalize gate

### N18 · Per-series episode rulings apply in a fixed order

Every `episodes` insert passes filterEpisodeRows, which applies the per-series rulings in a fixed order: source-numbering translation first, then community caps, then type overrides. Caps and overrides are keyed in OUR numbering, so translation must precede them.

*Why:* A cap or override applied in source numbering lands on the wrong row after an insert.

- ruled session 2026-08-23 (lib/resolve.ts filterEpisodeRows; consolidate SKILL §1 writer sweep)
- layer **writer**
- enforced: [lib/resolve.ts#filterEpisodeRows](../scripts/ingest/lib/resolve.ts) · [.claude/skills/consolidate/SKILL.md](../.claude/skills/consolidate/SKILL.md)
- audit: `ruling_violation`
- aliases: episode-row ruling order, episodes writer gate, filterEpisodeRows
- see: N3, N11, EPISODE_TYPE_OVERRIDES

### N19 · Merge within the TRANSLATED range; purge the stale zone

Episode rows MERGE, never full-replace: AFL owns only its own numbering range, so the writer deletes rows ≤ the TRANSLATED page max and re-inserts, and rows beyond it (AFG-filled tails, curated specials) survive. When translation SHRINKS the range (our max < source max), rows stranded in (ourMax, sourceMax] are pre-translation leftovers wearing shifted titles and are purged; an AFG tail re-extends.

*Why:* Deleting to the source-space max would eat rows the translation does not refill (Ryuusui); stale wrong data never self-heals — dr-stone eps 57/58 wore the same title after a partial heal.

- ruled Sean 2026-08-23 (lib/resolve.ts resolveSeries (stale-zone healing comment))
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts)
- audit: `ruling_violation`
- witnesses: dr-stone
- aliases: stale-zone healing, translated-max merge boundary
- see: N11, AFL-range merge on refresh

### N20 · Shift-ruled counts never include dropped rows

For every shift-ruled series (each SOURCE_NUMBERING_SHIFTS key), aired/total counts that still include dropped rows are clamped to the max stored row, mu anchors above it are deleted and refreshStitchedVolatile is re-run — otherwise MU re-pins at phantom episodes.

*Why:* yu-yu-hakusho kept a total that counted its dropped rows; MU pinned the phantom episode. The healer lives only inside apply-research-batch-11.ts — not in lib, not on the consolidate roster (drift).

- ruled session 2026-08-23 (apply-research-batch-11.ts header)
- layer **writer**
- enforced: [history/apply-research-batch-11.ts#main](../scripts/ingest/history/apply-research-batch-11.ts)
- audit: `integrity_total_beyond_eps`, `ruling_violation`
- witnesses: yu-yu-hakusho-ghostfiles
- aliases: YYH class, community-count restructure heal
- see: N3, N11

### N21 · Shifts are declared, never inferred

A numbering shift is always DECLARED by ruling, never derived automatically: a series with a mid-run order-only component takes no fill past that position from a per-episode source until a shift is declared or alignment is proven (fractional separators on the page, or page top == our count). Title-alignment verification (stored titles vs the wiki list at offsets −1/0/+1 per quarter of the run) localizes the flip point and is read-only — its findings drive declared shifts.

*Why:* urusei-yatsura's flip point localized a segment-vs-broadcast count; the-ancient-magus-bride S2 aligned by page top == our count. WIKI_NUMBERING_SHIFTS is EMPTY — dr-stone's shifted source was AFL, handled by lib SOURCE_NUMBERING_SHIFTS (the wiki map duplicates that purpose for a source that never needed it: drift).

- ruled Sean 2026-08-23 (wiki-episodes-backfill.ts header; wiki-title-verify.ts header)
- layer **writer**
- enforced: [wiki-episodes-backfill.ts#shiftFor](../scripts/ingest/wiki-episodes-backfill.ts) · [wiki-title-verify.ts](../scripts/ingest/wiki-title-verify.ts) · [lib/resolve.ts#SOURCE_NUMBERING_SHIFTS](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- witnesses: dr-stone, the-ancient-magus-bride, urusei-yatsura
- aliases: declared shifts only, Sean's UY report, title-alignment verification, WIKI_NUMBERING_SHIFTS
- see: N10, N11, Wikipedia episode-list locks

### N22 · Chapter-NUMBER space, not chapter-count space

AniList `chapters` is a COUNT (mid-run specials included); MU `latest_chapter` is the last chapter NUMBER — the space anchors live in. Every position instrument (anchor END/START/CONTINUE, denominator) lives in number space: a value above the same-edition-band display total is a count-space value in a number-space instrument and is CONVERTED to the chapter number (MU pins at the writer by applyMuFrontier, conversion recorded in the note; other sources: fix the value and note the conversion) — never left standing. A verdict uses the numbering that matches the manga's last chapter NUMBER and states any conversion.

*Why:* Tokyo Ghoul rendered coverage 144 over a denominator of 143 (Sean 2026-08-24). Healed day one: tokyo-ghoul 144→143, fire-force 305→304, prisma-illya 14→13; cobra ep 31 "14" was a story count (→76).

- ruled Sean 2026-08-24 (data-pipeline §11 'Count-space vs number-space: one display, one space'; §10 'Chapter-number vs chapter-count spaces')
- layer **both**
- enforced: [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts) · [src/data/catalog/assemble.ts#totalChapters](../src/data/catalog/assemble.ts) · [audit-ui-truth.ts#displayTotalOf](../scripts/ingest/audit-ui-truth.ts) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- audit: `anchor_beyond_display_total`
- witnesses: tokyo-ghoul, fire-force, prisma-illya, space-cobra
- aliases: Tokyo Ghoul 144/143 rule, Tokyo Ghoul rule, count-space vs number-space, chapter-number vs chapter-count spaces, chapter-number space, one display, one space
- see: N23, N24, N26, N27, A4

### N23 · Same-edition band (0.8)

MU's latest_chapter is accepted only when 0 < latest < 10000 and, when an AniList count exists, latest ≥ 0.8 × that count; below the band the two sources track different editions, so every latest_known writer writes NULL (healing prior bad writes) and flags 'which is the reading edition' — never writes the value. On display, the denominator shows MU's last chapter NUMBER instead of AniList's COUNT only when latest < total and latest ≥ 0.8 × total; a divergent edition never hijacks the display.

*Why:* MU latest is release-record-derived: reliable for currently scanlated manga, garbage for old completed ones — Dragon Ball came back "149" of 519. The 0.8 constant is copied by hand in mu-frontier.ts, assemble.ts and audit-ui-truth.ts (three copies: drift).

- ruled Sean 2026-08-24 (data-pipeline §10 'Same-edition band (MU latest)')
- layer **both**
- enforced: [lib/mu-frontier.ts#sameEditionLatest](../scripts/ingest/lib/mu-frontier.ts) · [src/data/catalog/assemble.ts#totalChapters](../src/data/catalog/assemble.ts) · [audit-ui-truth.ts#displayTotalOf](../scripts/ingest/audit-ui-truth.ts)
- audit: `anchor_beyond_display_total`
- witnesses: dragon-ball, kakegurui, attack-on-titan, space-cobra
- aliases: same-edition band, same-edition band (MU latest), 0.8 band, sameEditionLatest
- see: N22, N24, N26, N27

### N24 · Effective total: MU latest bounds the denominator

For tail math and the bar cutoff the EFFECTIVE chapter total is min(AniList total_chapters, MU latest_known_chapters) when either exists: while a manga publishes, AniList totals are null and MU's latest_known bounds the series from below; for a finished manga the min keeps the tail from claiming count-space padding. The DISPLAYED total stays AniList's (the em dash while publishing — AnimeSeries.totalChapters carries no latest_known fallback); synthesis still requires real totals.

*Why:* AniList has no current-chapter field at all — the frontier can only come from MU or research. AoT: count 141, number 139. Note: mapping.ts#ratios still computes `published` from the DISPLAY total, so the solver bound and the tail can disagree by count-space padding (drift).

- ruled Sean 2026-08-24 (data-pipeline §10 'Effective total (Sean 2026-08-24)')
- layer **display**
- enforced: [src/data/catalog/assemble.ts#effectiveTotalChapters](../src/data/catalog/assemble.ts) · [src/data/catalog/assemble.ts#buildMapping](../src/data/catalog/assemble.ts)
- **audit: none — automation backlog**
- witnesses: attack-on-titan
- aliases: effective total, effectiveTotalChapters
- see: N22, N23, N26, tail honesty
- supersedes: N25

### N25 · Manga totals from AniList, else latest (superseded) *(superseded → N24)*

Manga totals come from AniList chapters/volumes when non-null (they are null while a manga is publishing); otherwise fall back to the latest known chapter from anchors, surfaced as 'latest', never 'total'.

*Why:* The 'latest, never total' honesty survives in N24; the anchor-derived fallback was replaced by MU latest_known behind the band and floor.

- ruled session 2026-08-22 (data-pipeline §2 'Manga totals')
- layer **both**
- enforced: [src/data/catalog/assemble.ts#buildMapping](../src/data/catalog/assemble.ts)
- **audit: none — automation backlog**
- aliases: manga totals (§2), latest not total
- see: N23, N24

### N26 · Chapter-floor invariant

Symmetric to the episode floor: the chapter space can never be SMALLER than what confirmed anchors reach. A latest_known write rejects an MU number below the non-MU anchor max — it is a different unit space (volumes), never a chapter number; failures null-heal and flag.

*Why:* Kakegurui came back "9" (a volume count) against confirmed ch-55+ anchors.

- ruled Sean 2026-08-23 (data-pipeline §10 'Chapter-floor invariant (Sean 2026-08-23, symmetric to the episode floor)')
- layer **writer**
- enforced: [lib/mu-frontier.ts#sameEditionLatest](../scripts/ingest/lib/mu-frontier.ts) · [lib/mu-frontier.ts#bestLatestKnown](../scripts/ingest/lib/mu-frontier.ts)
- **audit: none — automation backlog**
- witnesses: kakegurui
- aliases: chapter-floor, chapter-floor invariant, chapter floor, Kakegurui 9 lesson
- see: N1, N23, N28

### N27 · Every latest_known writer uses bestLatestKnown

Every `latest_known_chapters` writer derives the value through bestLatestKnown and nothing else: release-derived latest_chapter first, then the chapter count parsed from MU's status string ('67 Chapters (Ongoing)') as fallback — both behind the same-edition band AND the chapter floor. latest_known writes for ALL manga (the number-space end) and is rewritten every run, so a failed guard null-heals a prior bad write.

*Why:* Sean's standing rule: use the best information available — the status string often carries the real count when the release record does not.

- ruled Sean 2026-08-23 (data-pipeline §10 'Chapter-floor invariant' (bestLatestKnown clause); consolidate SKILL §1 bullet 2)
- layer **writer**
- enforced: [lib/mu-frontier.ts#bestLatestKnown](../scripts/ingest/lib/mu-frontier.ts) · [lib/mu-frontier.ts#muStatusChapterCount](../scripts/ingest/lib/mu-frontier.ts) · [audit-manga-coverage.ts](../scripts/ingest/audit-manga-coverage.ts) · [mu-backfill.ts](../scripts/ingest/mu-backfill.ts) · [.claude/skills/consolidate/SKILL.md](../.claude/skills/consolidate/SKILL.md)
- **audit: none — automation backlog**
- witnesses: kakegurui, dragon-ball-z
- aliases: latest_known writer gate, Sean's standing rule (use the best info available), best-available latest_known, bestLatestKnown
- see: N23, N24, N26

### N28 · Chapter-space gate (all anchor writers)

An anchor chapter must fit the series' own manga space: max(total_chapters, latest_known_chapters) + 10. AFG chart: one out-of-space anchor means the page is in franchise-continuous numbering — the WHOLE page is withheld with a parse_integrity flag, never partially written. MU: a coverage pin past the space is partial structure or an edition mismatch — withheld with a count_mismatch flag (out_of_space). Continua: a frontier above the space is withheld with a count_mismatch flag.

*Why:* Boruto's AFG page carried Naruto-space ch 702-710; Slime's MU prose described the whole franchise while we held only S1. The +10 margin is restated in three writers (drift).

- ruled Sean 2026-08-23 (data-pipeline §10 'Chapter-space gates (all anchor writers)')
- layer **writer**
- enforced: [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts) · [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts)
- audit: `anchor_beyond_chapter_space`
- witnesses: boruto, that-time-i-got-reincarnated-as-a-slime
- aliases: D1 chapter-space, chapter-space gate, chapter-space gates, chapter-space gates (all anchor writers), Boruto ch-710 class, Slime/4KOTA class, out_of_space
- see: N16, N22, N26, A1, non-monotonic display ruling, D1, AFG continua source

### N29 · Chapter-string parsing: trailing chapter is the end

The trailing chapter of a chapter string is its coverage end ('1088-1089' → 1089, '8-12,14' → 14); unparseable input yields null, never NaN. A chapter string contains a chapter when any comma-part's range includes it; a single-number part compares as equality.

*Why:* A plain isNaN(hi) check silently broke every single-chapter mapping (fixed 2026-08-19). Instance of hard invariant 4.

- ruled session 2026-08-19 (src/lib/mapping.ts lastChapterNumber / chapterInRange; mapping.test.ts)
- layer **display**
- enforced: [src/lib/mapping.ts#lastChapterNumber](../src/lib/mapping.ts) · [src/lib/mapping.ts#chapterInRange](../src/lib/mapping.ts)
- **audit: none — automation backlog**
- witnesses: mapping.test.ts 'takes the trailing chapter of a range', mapping.test.ts 'takes the last part of a comma list', mapping.test.ts 'returns null for unparseable input rather than NaN'
- aliases: chapter-string coverage end, lastChapterNumber, chapterInRange
- see: N30, invariant 4

### N30 · Spinoff/bonus chapters are labeled, never mainline numbers

Spinoff / bonus chapters are labeled inside chapters_adapted ('omake 85.5', 'Gaiden 3', 'Kanna ch 3') and never converted into mainline chapter numbers.

*Why:* A bonus chapter given a mainline number would shift the position instrument into a space no other source shares.

- ruled Sean 2026-08-24 (batch-16/17 PROTOCOL 'Rules that bind')
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- audit: `anchor_fractional_chapter`
- aliases: spinoff/bonus labeling, bonus chapters never mainline
- see: N22, Vanitas lesson

### N31 · Watch-order entries: canonical, surfaced only by ruling

Order-only specials / OVAs / movies live as app-readable rows in watch_order_entries (position, title, air date, kind, chapter/volume/chapters_adapted, note), mirrored idempotently from ingest_fractionals by sync-watch-order. An entry RENDERS in the episode table only when a per-series ruling sets display_label (RULED_LABELS); the +N label format is a PER-SERIES ruling, not a global convention. Surfacing is PARKED — every entry stays data-ready with display_label null.

*Why:* MHA's post-finale specials ran a brief live trial 2026-08-24; Sean parked surfacing until the specials/OVAs/movies STATUS design pass.

- ruled Sean 2026-08-24 (data-pipeline §10 'Watch-order entries: canonical + surfaced-by-ruling (Sean 2026-08-24)')
- layer **both**
- enforced: [sync-watch-order.ts#RULED_LABELS](../scripts/ingest/sync-watch-order.ts) · [src/components/EpisodeList.tsx](../src/components/EpisodeList.tsx)
- **audit: none — automation backlog**
- witnesses: my-hero-academia
- aliases: watch-order entries: canonical + surfaced-by-ruling, watch-order entries, RULED_LABELS, surfacing parked
- see: N4, N9, N32, N33

### N32 · Watch-order v2: entries render and count as units *(planned)*

Sean's intended v2 (the reference point): watch-order entries render as episode rows in the +N format at their community fractional positions and COUNT AS UNITS — the section envelope includes their chapters and volume, section counts include them, they appear on the manga strip, are selectable/steppable, and the series total reads '170+1.5'. The render path is built and dormant; the unit integration (spans/strip/lookup) is design-pass work.

*Why:* Data side already models order-only entries; the rendering decision is queued for the arcs / watch-order / IP-umbrella UI phase.

- ruled Sean 2026-08-24 (data-pipeline §10 'Watch-order entries' (v2 clause); §10 'Fractional watch-order positions (QUEUED)')
- layer **display**
- enforced: [sync-watch-order.ts#RULED_LABELS](../scripts/ingest/sync-watch-order.ts) · [src/components/EpisodeList.tsx](../src/components/EpisodeList.tsx) · [src/lib/mapping.ts#buildEpisodeList](../src/lib/mapping.ts)
- **audit: none — automation backlog**
- witnesses: my-hero-academia
- aliases: watch-order v2 unit rendering, fractional watch-order positions, the reference point (watch order)
- see: N31, section envelope

### N33 · Every non-main entry carries its reasoning in data

Every fractional / OVA / movie / special / recap ruling carries its REASONING in data — ingest_fractionals.note plus disposition (excluded_recap / order_only / modeled), component kind plus notes, REVIEWED_NUMBERED_SPECIALS comments with confidence. The UI pass decides surfacing from this record, never from memory.

*Why:* A ruling without its why is re-litigated at full price when the UI phase arrives.

- ruled Sean 2026-08-23 (data-pipeline §10 'Research-logged non-main entries (Sean 2026-08-23)')
- layer **writer**
- enforced: [sync-watch-order.ts#main](../scripts/ingest/sync-watch-order.ts) · [lib/chain.ts#writeComponents](../scripts/ingest/lib/chain.ts) · [audit-ui-truth.ts#REVIEWED_NUMBERED_SPECIALS](../scripts/ingest/audit-ui-truth.ts)
- audit: `fractional_unmodeled`
- witnesses: urusei-yatsura, dr-stone, cells-at-work
- aliases: research-logged non-main entries, non-main entries carry the why
- see: N7, N8, N31

### N34 · Episode totals derive, then floor, then cap

Single-season: aired = AniList nextAiringEpisode − 1 while airing, else AniList episodes, else AFL's max; total = AniList episodes. Stitched: aired = sum of components' aired; total = sum ONLY when every component's total is known, else null (graceful degrade). In both cases the episode floor applies, then the community cap.

*Why:* The derivation is duplicated between resolve.ts#refreshStitchedVolatile and chain.ts#aggregate (drift; DRIFT-LIST T2 edge allows unifying them).

- ruled session 2026-08-23 (lib/resolve.ts resolveSeries / refreshStitchedVolatile)
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#refreshStitchedVolatile](../scripts/ingest/lib/resolve.ts) · [lib/chain.ts#aggregate](../scripts/ingest/lib/chain.ts)
- audit: `integrity_eps_beyond_total`, `integrity_total_beyond_eps`
- aliases: episode totals derivation
- see: N1, N3, N4, invariant 4

## I — Identity, franchise & structure

### I1 · Our slug is the identity

series.id is OUR slug, stable once assigned: an id bound to an afl_slug never changes when the source renames. A new series slugifies its English (else romaji) title and resolves collisions with "-<year>", then "-<anilistId>"; if none is free the resolve refuses. afl_slug is provenance, never identity.

*Why:* AFL alias corruption and Drupal collision slugs (BLUE LOCK at blue-lock-0) leaked source identity into app URLs; the own-slug migration on 2026-08-22 made identity ours.

- ruled Sean 2026-08-22 (data-pipeline §8 "Canonical identity is OURS" / §10 row Identity)
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts) · [lib/slug.ts#slugify](../scripts/ingest/lib/slug.ts)
- **audit: none — automation backlog**
- witnesses: blue-lock
- aliases: identity, our slug is identity, canonical identity is ours, own-slug identity
- see: I2, I26

### I2 · Identity registry: every external id maps INTO our id

Every external id (anilist, mal, afl, afg, mu) maps into series.id through series_external_ids. Writers register ids inline at write time, never in a separate step. An id already held by a DIFFERENT series is a hard error (ID COLLISION, refused); a changed id for the same (series, source) updates in place.

*Why:* Cross-source mixups are made structurally impossible at the registry rather than caught downstream; the constraint pair (source, external_id) + (series_id, source) is the mechanism.

- ruled Sean 2026-08-22 (data-pipeline §6 Identity / §10 row Identity registry)
- layer **writer**
- enforced: [lib/resolve.ts#registerIds](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- aliases: identity registry, registerIds, ID COLLISION, series_external_ids
- see: I1, I3, I4, I5, inline upkeep

### I3 · AFG↔canonical registration by evidence strength

An AFG page enters the registry by tier, strongest first: registry (already registered) → RULED map → slug equality (AFG slug equals our id, afl_slug or slugified title) → whitespace-insensitive FULL title/synonym equality → subtitle-stripped prefix (≥5 chars), which registers ONLY when the episode span independently agrees (±2 of our max or a component boundary). Anything else is reported for ruling; nothing suspicious auto-applies.

*Why:* Two weak signals must agree: a prefix match alone registered wrong seasons before the span check existed.

- ruled Sean 2026-08-23 (data-pipeline §10 row Registration tiers; audit-afg-structure.ts header)
- layer **writer**
- enforced: [audit-afg-structure.ts#resolveTier](../scripts/ingest/audit-afg-structure.ts) · [lib/resolve.ts#registerIds](../scripts/ingest/lib/resolve.ts)
- audit: `afg:registered`, `afg:unregistered`
- aliases: registration tiers, AFG match tiers, identity-first, flag-first
- see: I2, I4, I5

### I4 · A title key two series claim never auto-matches

A slug, title or prefix key that more than one canonical series claims is ambiguous: it auto-matches only when the episode span singles one series out; otherwise it is reported for ruling and the exit is an entry in the RULED map. Never guessed.

*Why:* AFG bishoujo-senshi-sailor-moon collided with Crystal by synonym; the ambiguity rule held it for Sean instead of registering the wrong series.

- ruled Sean 2026-08-24 (docs/franchise-rulings.md "Rulings 2026-08-24"; data-pipeline §10 row Registration tiers)
- layer **process**
- enforced: [audit-afg-structure.ts#needsRuling](../scripts/ingest/audit-afg-structure.ts)
- audit: `afg:needs_ruling`
- witnesses: sailor-moon, digimon-adventure
- aliases: ambiguity rule, the ambiguity rule, needs_ruling
- see: I3

### I5 · One AFG id per series; a registration is never overwritten

A series holds at most one afg external id: when several pages match one series the strongest tier is registered and the rest are reported; an existing afg registration is never overwritten by a later match. Registering a page dismisses its open match_ambiguous flags.

- ruled session 2026-08-24 (audit-afg-structure.ts --register block (data-pipeline §12.14))
- layer **writer**
- enforced: [audit-afg-structure.ts#regSkipped](../scripts/ingest/audit-afg-structure.ts)
- audit: `afg:reg_skipped`
- aliases: one afg id per series, registration never overwritten
- see: I2, I3

### I6 · MangaUpdates identity only via the MangaDex bridge

A MangaUpdates id enters the registry only through the MangaDex bridge: a MangaDex entry whose links.al equals our AniList manga id AND carries links.mu (slug base36-decoded, legacy numeric ids verbatim). No verified bridge → no MU data; the manga is flagged, never title-guessed.

*Why:* MU has no stable title identity; the bridge is the only join that carries AniList + MU ids together (verified 2026-08-22).

- ruled Sean 2026-08-22 (data-pipeline §1 roster row MangaDex / §11 freshness map row MangaUpdates)
- layer **writer**
- enforced: [lib/mangaupdates.ts#bridgeViaMangaDex](../scripts/ingest/lib/mangaupdates.ts)
- **audit: none — automation backlog**
- aliases: MU identity bridge, MangaDex bridge, MangaDex-bridge-only identity
- see: I2, D1

### I7 · AniList is the naming authority

Series titles are AniList official titles used verbatim, punctuation included; no source rename, AFL page title or AFG heading overrides them.

*Why:* "Digimon Adventure:" keeps its colon — it is what distinguishes the 2020 reboot from the 1999 series by name.

- ruled Sean 2026-08-22 (data-pipeline §1 reliability tiers / §11 freshness map row AniList (naming authority))
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts)
- audit: `afg:naming_differs`
- witnesses: digimon-adventure
- aliases: naming authority, AniList naming authority
- see: I1

### I8 · Match ladder: source_map → seed → title → synonym → flag

An AFL slug resolves to an AniList id in confidence order: source_map (manual overrides live there and win) → AniFiller seed (confidence 1.0) → exact title match over romaji/english/native with series formats (TV/TV_SHORT/ONA) outranking on ties (0.95) → synonym match (0.85). Anything below that files a match_ambiguous flag and matches NOTHING.

*Why:* "Monster" the TV series must outrank "Monster" the music video; guessing is what the flag queue exists to prevent. §3 prose once listed the manual override LAST — code puts source_map FIRST (DRIFT-LIST §B).

- ruled session 2026-08-22 (data-pipeline §3 / §10 row Match ladder; lib/match.ts header)
- layer **writer**
- enforced: [lib/match.ts#matchSlug](../scripts/ingest/lib/match.ts)
- **audit: none — automation backlog**
- aliases: match ladder, match confidence order, matching ladder
- see: I9, I10, the flag rule

### I9 · One AniList id per AFL slug

Persisting a match whose AniList id another AFL slug already owns is refused; a match_ambiguous flag names the owning slug. Two AFL pages for one series need a duplicate/merge ruling, never a second mapping.

- ruled session 2026-08-22 (lib/match.ts persist / flagDuplicate)
- layer **writer**
- enforced: [lib/match.ts#persist](../scripts/ingest/lib/match.ts) · [lib/match.ts#flagDuplicate](../scripts/ingest/lib/match.ts)
- **audit: none — automation backlog**
- aliases: one AniList id per AFL slug, match duplicate
- see: I8, I12

### I10 · AniFiller seed is a matcher fact, never shipped data

The AniraTeam/AniFiller dataset is unlicensed: only its AFL-slug → AniList/MAL id pairs are used, as a match tier and as the matcher validation set; its episode data is never consumed or shipped — our own AFL scrape is the data source.

- ruled Sean 2026-08-22 (data-pipeline §1 roster row AniraTeam/AniFiller / §3 step 1)
- layer **writer**
- enforced: [lib/match.ts#fromAniFillerSeed](../scripts/ingest/lib/match.ts)
- **audit: none — automation backlog**
- aliases: AniFiller seed, seed is a fact only
- see: I8

### I11 · Dispositions are durable rulings, not cache state

source_map.disposition ∈ {active, excluded, duplicate, merged} is a durable ruling that survives every re-run: backfill and refresh sweeps skip non-active slugs until a disposition is deliberately flipped. Re-inclusion is a disposition flip, never a re-match.

- ruled Sean 2026-08-22 (data-pipeline §6 source_map / §8 / §10 row Dispositions)
- layer **writer**
- enforced: [backfill.ts#main](../scripts/ingest/backfill.ts)
- **audit: none — automation backlog**
- aliases: titles:excluded, MANUAL_EXCLUDE, dispositions, source_map dispositions
- see: I12, I13, I14

### I12 · Duplicate AFL pages: more classified episodes wins

When two AFL pages describe one series (Drupal "-0" collision slugs, flagged duplicates), the page with more classified episodes wins and the loser takes disposition "duplicate". A per-season AFL page whose content already sits inside a stitched series is likewise disposed "duplicate" of that series.

*Why:* promised-neverland surfaced as two AFL names for one series; Food Wars "plates" are per-season pages of one stitched run.

- ruled Sean 2026-08-22 (data-pipeline §8 "Duplicate AFL pages" / §10 row Duplicate rule)
- layer **writer**
- enforced: [history/cleanup.ts#main](../scripts/ingest/history/cleanup.ts) · [history/stabilize.ts#DUPLICATE_OF](../scripts/ingest/history/stabilize.ts)
- **audit: none — automation backlog**
- witnesses: promised-neverland, food-wars
- aliases: duplicate rule, more classified episodes wins
- see: I9, I11, I16

### I13 · Standalone movies/OVAs are excluded by disposition

A source entry whose AniList format is MOVIE/OVA/SPECIAL/MUSIC, or an unresolved slug matching /(movies?|films?|ovas?|oads?|oav|specials?|ovaoad)/, is not a catalog series: it takes disposition "excluded" with the note "re-evaluate with the watch-order concept". Content that is in-flow for a series joins that series instead (I19); the count question is a numbering rule.

*Why:* The 2026-08-22 format sweep mis-excluded jojo/monster/x on bad MATCHES rather than movie pages — the matcher became format-aware and the three were un-excluded; the exclusion itself stands.

- ruled Sean 2026-08-22 (data-pipeline §8 "Movies, films, and OVAs are OUT of v1"; cleanup.ts)
- layer **writer**
- enforced: [history/cleanup.ts#markExcluded](../scripts/ingest/history/cleanup.ts) · [lib/match.ts#SERIES_FORMATS](../scripts/ingest/lib/match.ts)
- **audit: none — automation backlog**
- aliases: movies/OVAs excluded, movies are OUT of v1, movie/OVA exclusion
- see: I11, I19, movies count only when numbered, recap rule

### I14 · Alias-corruption victims are excluded, not repaired

A staged AFL show whose served page title disagrees (titlesAgree) with the AFL shows-index title for its slug is an alias-corruption victim: its staging and canonical rows are purged and the slug is excluded in source_map with a note, so sweeps skip it until a deliberate re-audit restores it when AFL fixes the alias.

*Why:* chrono-crusade served another show under its slug (2026-08-22); publishing the wrong series under a stable id is worse than a gap.

- ruled session 2026-08-22 (data-pipeline §9 AFL alias corruption; audit-titles.ts)
- layer **writer**
- enforced: [audit-titles.ts#exclude](../scripts/ingest/audit-titles.ts) · [lib/resolve.ts#titlesAgree](../scripts/ingest/lib/resolve.ts)
- audit: `titles:corrupt`
- witnesses: chrono-crusade
- aliases: alias-corruption exclusion, stolen slug
- see: I11, alias defense

### I15 · One continuous story = ONE series

One continuous story is ONE canonical series even when AniList models it as several season entries. series_components records every AniList entry the series is built from, in season order with episode ranges in the series' continuous numbering; the aggregate is ours, the provenance explicit.

*Why:* Gintama, Fairy Tail, Sailor Moon 90s and JoJo are single stories that AniList and AFL split by run; the app must not.

- ruled Sean 2026-08-22 (data-pipeline §8 / docs/franchise-rulings.md intro)
- layer **writer**
- enforced: [stitch.ts#OVERRIDE_CHAINS](../scripts/ingest/stitch.ts) · [lib/chain.ts#writeComponents](../scripts/ingest/lib/chain.ts)
- **audit: none — automation backlog**
- witnesses: jojos-bizarre-adventure-tv, monogatari-series, sword-art-online
- aliases: franchise baseline, one story = one series, one continuous story = ONE series
- see: I16, I17, I18, I23

### I16 · Narrative shifts, remakes and spin-offs are separate series

A major narrative shift (Naruto → Shippuden, Dragon Ball → Z → GT), a remake or recut (DB Kai retells Z; HxH 2011) and a spin-off or side story are SEPARATE canonical series linked through series_relations — even when a source numbers the story continuously or markets it as one run. A franchise umbrella above series is IA-phase work, not a merge.

*Why:* Tokyo Ghoul :re, Bleach TYBW and Cardcaptor Sakura Clear Card stay separate (Sean 2026-08-24) although AFG runs each story as one continuous page — we do not mirror a source's presentation.

- ruled Sean 2026-08-22 (data-pipeline §8 "Major narrative shifts = separate series"; franchise-rulings.md 2026-08-24)
- layer **writer**
- enforced: [lib/chain.ts#ownedAnilistIds](../scripts/ingest/lib/chain.ts) · [afg-extend.ts#RULED_SPLITS](../scripts/ingest/afg-extend.ts) · [relations.ts#RULED](../scripts/ingest/relations.ts)
- audit: `integrity_double_claimed`
- witnesses: naruto, naruto-shippuden, dragon-ball-z-kai, tokyo-ghoul, tokyo-ghoul-re, bleach, bleach-thousand-year-blood-war, cardcaptor-sakura, cardcaptor-sakura-clear-card
- aliases: Naruto→Shippuden pattern, Naruto/DragonBall baseline, major narrative shifts = separate series, remakes are separate
- see: I15, I17, I21

### I17 · Relation kinds and direction

series_relations links canonical series newer/derived → base. Ruled kinds: sequel, side_story (same events, other POV), spin_off (own story, shared universe), remake (superseding re-adaptation), alternative (mutually divergent tellings). Auto rows keep AniList's vocabulary verbatim lowercase (sequel/prequel/side_story/spin_off/alternative/parent) between components of DIFFERENT series; a RULED pair replaces the auto rows for that pair.

*Why:* "remake" is not an AniList concept — Sword Oratoria, Railgun, HxH 2011 and FMA 2003 vs Brotherhood each needed a kind AniList cannot express.

- ruled Sean 2026-08-22 (docs/franchise-rulings.md intro "Relationship direction"; relations.ts)
- layer **writer**
- enforced: [relations.ts#RULED](../scripts/ingest/relations.ts) · [relations.ts#AUTO_KINDS](../scripts/ingest/relations.ts)
- **audit: none — automation backlog**
- witnesses: hunter-x-hunter, fullmetal-alchemist
- aliases: relation kinds, relationship direction, series_relations vocabulary
- see: I16

### I18 · AFL page boundaries are a hypothesis, not ground truth

The "one AFL page = one series" prior is strong but never final: every franchise with multiple AFL pages gets a community-consensus evaluation (MAL/AniList/Wikipedia structure, fan convention, cast/continuity breaks) against the Naruto/DragonBall baseline before its structure is finalized; unclear cases go to Sean; rulings are recorded in docs/franchise-rulings.md.

*Why:* The prior agreed with consensus in 17 of 18 franchises evaluated, but SAO was a true merge (two AFL pages, one story) and JoJo was contested — the evaluation step earns its keep.

- ruled Sean 2026-08-22 (data-pipeline §8 "AFL's page boundaries are the starting hypothesis"; franchise-rulings.md Meta-finding)
- layer **process**
- enforced: [docs/franchise-rulings.md](../docs/franchise-rulings.md)
- **audit: none — automation backlog**
- witnesses: sword-art-online, jojos-bizarre-adventure-tv
- aliases: one AFL page = one series prior, franchise evaluation, AFL page boundaries are the starting hypothesis
- see: I15, I16, I20

### I19 · In-flow movies/OVAs join their series as kind components

A movie/OVA/special that is strong canon in a series' order joins that series as a component carrying an explicit kind (season/movie/ova/special) so the UI can tag or section it. A chain walk follows a SEQUEL edge into a bridge format (MOVIE/OVA/SPECIAL) only when the TV path dead-ends before the target numbering is covered; ruled extras are declared on the override chain. Standalone collections stay excluded (I13). Whether an in-flow entry COUNTS is a numbering rule, not this one.

*Why:* Initial D Third Stage carries mainline plot mid-sequence; HxH 1999 Greed Island OVAs and Kizumonogatari belong inside their series (Sean 2026-08-22).

- ruled Sean 2026-08-22 (docs/franchise-rulings.md "Ruled by Sean 2026-08-22" item 4; data-pipeline §10 row In-flow extras stay in)
- layer **writer**
- enforced: [lib/chain.ts#BRIDGE_FORMATS](../scripts/ingest/lib/chain.ts) · [lib/chain.ts#KIND_BY_FORMAT](../scripts/ingest/lib/chain.ts) · [stitch.ts#OVERRIDE_CHAINS](../scripts/ingest/stitch.ts)
- audit: `special_numbered_unreviewed`
- witnesses: initial-d, hunter-x-hunter, monogatari-series, attack-on-titan
- aliases: in-flow extras stay in, in-flow movies/OVAs, bridge formats, component kind
- see: I13, movies count only when numbered, EXTRAS_ADOPTED, numbered-specials research trigger

### I20 · AFG structuring is evidence, never mirrored

AFG's series/season structuring is consulted as evidence for stitch and franchise decisions even where AFL exists; when unsure, confirm with Sean before choosing. Its data is captured to evaluate, its presentation is never mirrored: a ruled split stays split whatever AFG's continuous page suggests.

- ruled Sean 2026-08-23 (data-pipeline §1 roster row AFG; franchise-rulings.md "AFG as story-flow reference" (2026-08-24))
- layer **process**
- enforced: [afg-extend.ts#RULED_SPLITS](../scripts/ingest/afg-extend.ts) · [audit-afg-structure.ts#resolveTier](../scripts/ingest/audit-afg-structure.ts)
- audit: `afg:grouping_conflicts`, `afg:hierarchy_notes`
- witnesses: tokyo-ghoul, bleach
- aliases: AFG as story-flow reference, AFG structuring is evidence, ruled splits stay split
- see: I16, I18, I30

### I21 · Ownership guard: a walk never enters another series' entry

A chain walk (stitch, expansion, extension, canon-tier, reconciliation) never crosses into an AniList entry another canonical series already claims (series.anilist_id or series_components.anilist_id). Ruled splits are safe by construction, whatever a source's continuous numbering suggests; a caller may exclude only its own series to re-walk itself.

*Why:* AFG numbers Tokyo Ghoul 1–48 and Bleach through TYBW as one story; before the guard an extension walk would have re-merged what Sean ruled separate.

- ruled Sean 2026-08-24 (data-pipeline §10 row Ownership guard; §12.14; lib/chain.ts header)
- layer **writer**
- enforced: [lib/chain.ts#ownedAnilistIds](../scripts/ingest/lib/chain.ts) · [lib/chain.ts#walkChain](../scripts/ingest/lib/chain.ts)
- audit: `integrity_double_claimed`
- witnesses: bleach, bleach-thousand-year-blood-war, tokyo-ghoul, tokyo-ghoul-re, naruto, naruto-shippuden
- aliases: ownership guard, Sean's :re ruling, ownedAnilistIds
- see: I16, I22, I29, I30

### I22 · Early-stop: the walk halts once the target is covered

The forward walk stops the moment the chain's aired sum covers the target numbering, so a sequel that is a separate series by ruling is never swallowed. More than one candidate SEQUEL or PREQUEL edge is an ambiguity and the walk refuses rather than picks; a chain has at most 15 hops.

*Why:* Fairy Tail → 100 Years Quest is a ruled sequel; without the stop the walk would append it the moment AniList linked it.

- ruled session 2026-08-23 (data-pipeline §10 row Early-stop; lib/chain.ts walkForward)
- layer **writer**
- enforced: [lib/chain.ts#walkForward](../scripts/ingest/lib/chain.ts) · [lib/chain.ts#MAX_CHAIN](../scripts/ingest/lib/chain.ts)
- **audit: none — automation backlog**
- witnesses: fairy-tail
- aliases: early-stop, chain early-stop, walk refuses ambiguity, MAX_CHAIN
- see: I21, I25

### I23 · Prequel-hijack fallback

AniList PREQUEL edges can be chronological side stories rather than series heads. When the chain walked back from a prequel lands more than 2 episodes from the target (or is ambiguous), the walk retries forward-only from the matched entry itself and keeps whichever chain fits the numbering better.

*Why:* AniList marks the MONSTERS ONA as One Piece's prequel; the same class once forced a hand-written berserk-2016 override chain, which the fallback replaced.

- ruled session 2026-08-24 (data-pipeline §10 row Prequel-hijack fallback; §12.14)
- layer **writer**
- enforced: [lib/chain.ts#walkChain](../scripts/ingest/lib/chain.ts)
- **audit: none — automation backlog**
- witnesses: one-piece, berserk-2016
- aliases: prequel-hijack fallback, prequel side-story fallback, Berserk Memorial class, MONSTERS ONA
- see: I21, I22

### I24 · Stitch candidacy: AFL classifies MORE than aired

An open count_mismatch flag where AFL classified MORE episodes than the matched AniList entry aired, by more than 2, is the lumped-page signature (AFL cannot know unaired episodes): the series is a stitch candidate — stitch or flag. AFL having FEWER episodes is site lag and never a stitch trigger.

*Why:* Tokyo Ghoul √A sat exactly 12 over its matched entry — the single AFL page held two seasons.

- ruled session 2026-08-23 (data-pipeline §10 row Scope-audit gate; stitch.ts candidates)
- layer **writer**
- enforced: [stitch.ts#candidates](../scripts/ingest/stitch.ts)
- **audit: none — automation backlog**
- witnesses: tokyo-ghoul
- aliases: stitch candidacy, scope-audit gate, lumped page, lumped-page signature
- see: I25, I26, count mismatch

### I25 · Finalize gate: the chain must cover AFL's numbering ±2

An un-ruled chain auto-finalizes only when its aired sum matches AFL's continuous numbering within ±2 episodes (or the lag rule, I26, absorbs the excess); a ruled extension needs only to COVER AFL's numbering (chain ≥ AFL max − 2). Anything else — gap, overshoot, ambiguity — files count_mismatch for Sean and writes nothing. The same gate confirms AFG-driven extension, expansion and structure reconciliation.

*Why:* Four call sites carry this predicate by hand today (stitch, afg-extend, afg-expansion, reconcile-structure) — DRIFT-LIST §C names it for a lib predicate.

- ruled session 2026-08-23 (data-pipeline §10 row Stitch finalize gate; stitch.ts header)
- layer **writer**
- enforced: [stitch.ts#gateFails](../scripts/ingest/stitch.ts) · [afg-extend.ts](../scripts/ingest/afg-extend.ts) · [afg-expansion.ts](../scripts/ingest/afg-expansion.ts) · [reconcile-structure.ts](../scripts/ingest/reconcile-structure.ts)
- **audit: none — automation backlog**
- aliases: stitch finalize gate, finalize gate, ±2 gate, ±2/lag finalize gate
- see: I24, I26, I27, I29, I30, I33

### I26 · Lag rule: excess that fits the newest component is AFL lag

A chain may exceed AFL's count when the WHOLE excess fits inside the newest (airing) component: AFL trailing the latest cour is normal lag, not a mis-scope, and the chain finalizes.

- ruled session 2026-08-23 (data-pipeline §10 row Lag rule; stitch.ts lagOk)
- layer **writer**
- enforced: [stitch.ts#lagOk](../scripts/ingest/stitch.ts)
- **audit: none — automation backlog**
- witnesses: higurashi
- aliases: lag rule, airing-lag allowance
- see: I25

### I27 · Ruled extensions run beyond the AFL page

An override chain may be RULED to run beyond its AFL page (ruledExtent on OVERRIDE_CHAINS carries the ruling's reasoning). Ruled chains are standing candidates: every stitch run re-asserts the ruled structure when the stored structure drifts, flag or no flag. Their finalize gate is coverage only (I25); order-only extras hold null spans; episode rows merge within AFL's translated range (I32).

*Why:* AFL pages lag newer seasons by months to years (Kingdom S5/S6, Beastars Final, Black Butler Public School); waiting for AFL meant showing a finished story as unfinished.

- ruled session 2026-08-23 (data-pipeline §10 row Ruled extensions (2026-08-23 s2); stitch.ts header)
- layer **writer**
- enforced: [stitch.ts#OVERRIDE_CHAINS](../scripts/ingest/stitch.ts) · [stitch.ts#structureMatches](../scripts/ingest/stitch.ts)
- **audit: none — automation backlog**
- witnesses: black-butler, golden-kamuy, ancient-magus-bride, rent-girlfriend, cardcaptor-sakura, my-hero-academia
- aliases: ruled extensions, ruledExtent, AFL-lag class, Kingdom/Beastars/Black Butler class
- see: I15, I25, I28, I32

### I28 · An extension never re-keys or renames a series

A ruled extension, an AFG-driven extension or a structure reconciliation is structure only: the canonical id, title and afl_slug the series already carries are preserved through the rebuild. Only an un-ruled first stitch may assign a new id.

*Why:* App identity (URLs, user state) must survive a re-stitch; the stable-id rule (I1) would be hollow if an extension could re-key.

- ruled session 2026-08-23 (stitch.ts (ruled && old); afg-extend.ts header; reconcile-structure.ts)
- layer **writer**
- enforced: [stitch.ts#ruledExtent](../scripts/ingest/stitch.ts) · [afg-extend.ts](../scripts/ingest/afg-extend.ts) · [reconcile-structure.ts](../scripts/ingest/reconcile-structure.ts)
- **audit: none — automation backlog**
- aliases: extension is structure only, id/title stable, id/title/afl_slug never change
- see: I1, I27, I29, I33

### I29 · AFG extension merges, never replaces

For a REGISTERED AFG page whose max episode outruns our component STRUCTURE (component ends / totals / aired — not the episodes table) by more than 2, the AniList chain must independently confirm AFG's numbering (ownership-guarded walk + the I25 gate) before anything applies. On confirm the components rebuild and AFG fills ONLY the missing episode numbers — existing AFL rows stay the type authority. A chain that would shrink us is skipped; a page spanning a ruled split is skipped by name (RULED_SPLITS); unconfirmed pages flag count_mismatch.

*Why:* dan-da-dan held 3 of 24 episodes while AFL lagged; Frieren and Cuckoos were mis-componentized before candidacy compared against structure instead of rows.

- ruled Sean 2026-08-24 (data-pipeline §10 row AFG extension (merge, never replace); §12.14)
- layer **writer**
- enforced: [afg-extend.ts#RULED_SPLITS](../scripts/ingest/afg-extend.ts)
- audit: `afg:grouping_conflicts`
- witnesses: dan-da-dan, dr-stone, blue-exorcist, frieren
- aliases: AFG extension (merge, never replace), afg-extend, merge-never-replace, extend candidacy by structure
- see: I21, I25, I28, I32, AFL is the type authority

### I30 · Expansion identity: exact-match-or-flag

An AFG-only show becomes a canonical series only on whitespace-insensitive FULL title/synonym equality against AniList (series formats TV/TV_SHORT/ONA preferred; accented queries retry ASCII-folded; never a prefix match). An AFG page that matches an EXISTING series is flagged, never duplicated. Id clashes fall back to id-year, then id-anilistId. Zero-episode registration-tier pages remain candidates for unserved slugs.

*Why:* SHY sat invisible behind the ≥6-episode filter; a prefix match would have created second copies of series we already held.

- ruled Sean 2026-08-23 (data-pipeline §10 row Expansion guards; §12.13; afg-expansion.ts header)
- layer **writer**
- enforced: [afg-expansion.ts#main](../scripts/ingest/afg-expansion.ts)
- audit: `afg:unregistered`
- witnesses: frieren, solo-leveling, shy
- aliases: expansion guards, exact-match-or-flag, dedup guard
- see: I1, I31, sparse guard, AFG alignment gate

### I31 · Expansion is stitch-aware

AFG numbers a story continuously while AniList holds one entry per season, so on expansion the matched entry's SEQUEL chain is walked (ownership-guarded, early-stop) BEFORE the alignment gate; the sparse guard applies against the whole finished chain. Multi-season AFG-only shows create with proper season components.

*Why:* Solo Leveling and Oshi no Ko tripped the ±12 alignment gate as single entries until the walk ran first (Sean's go, 2026-08-24).

- ruled Sean 2026-08-24 (data-pipeline §10 row Expansion guards (STITCH-AWARE since 2026-08-24))
- layer **writer**
- enforced: [afg-expansion.ts#main](../scripts/ingest/afg-expansion.ts) · [lib/chain.ts#walkChain](../scripts/ingest/lib/chain.ts)
- **audit: none — automation backlog**
- witnesses: solo-leveling, oshi-no-ko
- aliases: stitch-aware expansion, expansion is stitch-aware
- see: I21, I22, I25, I30

### I32 · AFL-range merge: refresh rewrites only AFL's own range

An episode refresh or re-stitch deletes and rewrites ONLY within AFL's own numbering range (≤ the TRANSLATED AFL max); rows beyond it — AFG-filled tails, Wikipedia fills, curated rows on a ruled extension — survive every AFL page change. Rows stranded between the translated max and the source max are pre-translation leftovers and are purged.

*Why:* A full replace on refresh would erase every extension the moment AFL's page changed; deleting to the untranslated max ate rows past an order-only insert (Ryuusui).

- ruled session 2026-08-23 (data-pipeline §10 row AFL-range merge on refresh; lib/resolve.ts stitched guard)
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts) · [stitch.ts#aflTop](../scripts/ingest/stitch.ts)
- **audit: none — automation backlog**
- witnesses: dr-stone
- aliases: AFL-range merge, AFL-range merge rule, AFL-range merge on refresh
- see: I27, I29, I34, Ryuusui lesson

### I33 · Episodes outrunning the structure trigger reconciliation

Whenever a series' episode numbering outruns its component structure by ANY amount, the AniList chain is walked to the episodes' end (ownership-guarded, bridge formats included): if the chain confirms (I25) the structure rebuilds with id/title/afl_slug preserved; if not, the series flags as accepted-extras; ruled extras are skipped by name. Idempotent; runs after AFL refreshes land trailing episodes.

*Why:* AoT's Final Chapters aired after the stitch and a +2 overshoot sat inside every gate's tolerance — tolerance windows hide real structure changes.

- ruled Sean 2026-08-24 (data-pipeline §11 script list reconcile-structure.ts; §10 row Episode-floor invariant)
- layer **writer**
- enforced: [reconcile-structure.ts#main](../scripts/ingest/reconcile-structure.ts)
- audit: `integrity_eps_beyond_total`
- witnesses: attack-on-titan
- aliases: structure reconciliation, reconcile-structure, AoT Final Chapters finding
- see: I21, I25, I28, episode-floor invariant

### I34 · Stitched-series guard: refresh never touches structure

A series with more than one component is owned by the stitcher. A plain resolve refreshes only AFL's episode rows (within I32's range) and leaves the aggregate alone; the AniList refresh recomputes only volatile fields (aired, totals, status, scores) from the components. No refresh path may collapse a stitched series back to one season or rewrite its components.

*Why:* A refresh that re-resolved single-season would silently undo every stitch on the next cron tick.

- ruled session 2026-08-23 (data-pipeline §10 row Stitched-series guard; §11 refresh-anilist)
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#refreshStitchedVolatile](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- aliases: stitched-series guard, stitcher ownership, refreshStitchedVolatile
- see: I15, I32

### I35 · No degenerate component spans

A component with nothing aired holds a NULL episode span — never episode_start > episode_end. episode_end is set only when the component's total is known or it is airing.

*Why:* Tokyo Revengers' announced Santen Sensou-hen season was written 51–50 (2026-08-23).

- ruled session 2026-08-23 (data-pipeline §10 row No degenerate component spans; §12.25)
- layer **writer**
- enforced: [lib/chain.ts#writeComponents](../scripts/ingest/lib/chain.ts)
- audit: `integrity_degenerate_span`
- witnesses: tokyo-revengers
- aliases: no degenerate component spans, Santen Sensou-hen lesson, degenerate span
- see: I15, N4

### I36 · Source-scope: an entry shows ONLY its own range of the manga

A series entry adapts a RANGE of its source and shows only that range (Naruto = vol 1–27 / ch 1–244, never the franchise): curated series_scopes rows set the entry's start and end and are applied by every totals writer. Sequel-linked series sharing one manga_anilist_id without scope rows are auto-flagged. In research and gates the same predicate reads: a sequel never carries its predecessor's chapter numbers, and a scoped entry never carries a franchise-level value.

*Why:* Before scopes each Naruto entry showed the whole franchise (the Naruto bug); MU's franchise-level prose later landed Shippuden's numbers on Naruto until the sibling-scope ceiling (D1) read the same scope rows.

- ruled Sean 2026-08-22 (data-pipeline §3 source-scope rule (DESIGN_SYSTEM §6); built §12.10 (2026-08-23); §10 row Source-scope enforcement)
- layer **both**
- enforced: [lib/resolve.ts#applyScope](../scripts/ingest/lib/resolve.ts) · [scopes-apply.ts#main](../scripts/ingest/scopes-apply.ts) · [.claude/agents/verdict-verifier.md](../.claude/agents/verdict-verifier.md)
- audit: `mu_refused_sibling_scope`
- witnesses: naruto, naruto-shippuden, berserk, dragon-ball-z
- aliases: source-scope enforcement, source-scope rule, the Naruto bug, scope leakage, series_scopes
- see: I16, I37, D1, sibling-scope ceiling

### I37 · Continuation handoff: adjoining sibling scope = flow

When a same-manga sibling entry's scope starts strictly after this entry's scope start and at or before its scope end + 1, the sibling continues the story: the residue between this entry's frontier and its scope end is franchise flow, NOT a manga-only tail, and the display suppresses the tail. Inter-segment reading gaps surface in the universe view, not on the entry.

*Why:* Shippuden adapted Naruto's ch 239–244; showing Naruto with a "manga ahead" tail told users to read chapters the next series animates.

- ruled Sean 2026-08-24 (data-pipeline §10 row Continuation handoff; §11 coverage-segment model part 2)
- layer **display**
- enforced: [src/data/catalog/supabaseSource.ts#continuationStart](../src/data/catalog/supabaseSource.ts) · [src/data/catalog/assemble.ts#buildMapping](../src/data/catalog/assemble.ts)
- **audit: none — automation backlog**
- witnesses: naruto, naruto-shippuden, berserk, berserk-2016
- aliases: continuation handoff, claimed continuation → handoff, continues in X
- see: I36, A4, N24

### I38 · The source manga is the ADAPTATION edge of type/format MANGA

A series' manga is the AniList relation edge of type ADAPTATION whose node is type MANGA and format MANGA, the most popular on ties; edge cases are settled by a manual override, never by widening the filter. A manga-sourced series with no such edge is a data hole, flagged — never left silently unlinked.

- ruled session 2026-08-22 (data-pipeline §2 "Anime→manga linkage"; audit-manga-coverage data_hole_no_manga_link)
- layer **writer**
- enforced: [lib/resolve.ts#pickManga](../scripts/ingest/lib/resolve.ts)
- audit: `data_hole_no_manga_link`
- aliases: manga link selection, anime→manga linkage, pickManga
- see: T21, LN class, manga_status vocabulary

## G — Gates & freshness (sources)

### G1 · The flag rule: nothing suspicious auto-applies

Anything suspicious a writer meets — a parse-integrity failure, a taxonomy conflict, an ambiguous match, a suspiciously large diff, a refused frontier — is written to ingest_flags and the associated change is HELD; the previous data stands until Sean confirms or dismisses. A flag records the anomaly AND the proposed data (jsonb detail) so it can be ruled on later without re-scraping. Only a human closes a flag.

*Why:* Guessing is what the flag queue exists to prevent; every AFL/AFG/MU/Wikipedia hold below is an instance of this one rule.

- ruled Sean 2026-08-22 (data-pipeline §2 "The flag rule")
- layer **writer**
- enforced: [lib/db.ts#fileFlag](../scripts/ingest/lib/db.ts) · [lib/db.ts#FlagKind](../scripts/ingest/lib/db.ts)
- **audit: none — automation backlog**
- aliases: flag rule, the flag rule, the confirm queue, nothing suspicious ever auto-applies
- see: G3, G4, G6, G8, G10, G11, G12, G13, G32, G41

### G3 · Recurring conditions flag once; only Sean dismisses

A recurring condition files a flag only when no OPEN flag of the same kind already exists for the series key (fileFlagOnce keys on series_key + kind); fileFlag always inserts. Cleanup dedupes exact-duplicate open flags keeping the oldest and never dismisses a unique flag.

*Why:* An unclassified show stays unclassified every weekly run; without the once-gate the queue fills with copies of one condition. Note the key is (series_key, kind) only — two different count_mismatch conditions on one series collapse into one open flag.

- ruled session 2026-08-22 (lib/db.ts fileFlagOnce comment; data-pipeline §11 cleanup-flags.ts)
- layer **writer**
- enforced: [lib/db.ts#fileFlagOnce](../scripts/ingest/lib/db.ts) · [cleanup-flags.ts](../scripts/ingest/cleanup-flags.ts)
- **audit: none — automation backlog**
- aliases: fileFlagOnce, once-per-open-kind
- see: G1

### G4 · Permanent conditions leave the open queue *(planned)*

A flag whose condition is permanent (the source can never satisfy it) receives a dismissed_permanent disposition with the reason recorded, and stops counting in the open-flag census. It is neither confirmed nor silently dropped.

*Why:* Page-less manga on Wikipedia (Zom 100, Gachiakuta, Nagatoro, MF Ghost) sat in the open queue under a keep-open-vs-dismiss question (§12.21) with no rule; ruled 2026-08-25 (DRIFT-LIST A-8). Not built: the ingest_flags status check still allows only open/confirmed/dismissed.

- ruled Sean 2026-08-25 (docs/restructure/DRIFT-LIST.md §A A-8 (from data-pipeline §12.21))
- layer **writer**
- enforced: [lib/db.ts](../scripts/ingest/lib/db.ts) · [cleanup-flags.ts](../scripts/ingest/cleanup-flags.ts)
- **audit: none — automation backlog**
- aliases: dismissed_permanent, permanent-flag disposition, A-8
- see: G1, G3

### G5 · Authority tiers: who writes canonical, who only flags

Each source writes canonical only for what it is authoritative for, through its own gates: AFL owns episode types and per-episode rows; AniList owns series metadata and totals; AFG contributes chapter anchors, continua frontiers and volume boundaries; MangaUpdates writes frontier anchors and latest_known_chapters and cross-checks manga status; Wikipedia writes volume boundaries and fill-only episode titles/dates. Any source outside its authority only raises flags that need manual confirmation before influencing canonical. Research-ruled overrides outrank every source (override > AFL > AFG for types).

*Why:* The §1 tier sentence still lists MU as cross-check-only; MU has written frontier + latest_known since 2026-08-24 (DRIFT-LIST §B) — the tier principle survives, the placement is corrected here. Type authority order per the 2026-08-25 ruling.

- ruled Sean 2026-08-22 (data-pipeline §1 "Reliability tiers"; §10 preamble; §11 new-source checklist)
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts) · [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts)
- **audit: none — automation backlog**
- aliases: reliability tiers, priority of authority, authoritative sources write canonical
- see: G41, G45, G31, G22, episode-type overrides, invariant 7

### G6 · AFL table and Quick List must agree, else held

An AFL page states its data twice — the episode table and the Quick List ranges, both semantically classed. Per type the table's episode set must equal the Quick List's; any mismatch is a parse-integrity failure, the page is refused with a parse_integrity flag carrying the mismatches, and nothing from it is staged.

*Why:* The page's own redundancy is the cheapest parser-break detector. lib computes integrity.ok; the refusal is asserted in backfill.ts — the extract could not confirm the refresh-afl path checks it (automation backlog).

- ruled session 2026-08-22 (data-pipeline §1 AFL row; §10 "Table/QuickList integrity")
- layer **writer**
- enforced: [lib/afl.ts#parseShowPage](../scripts/ingest/lib/afl.ts) · [backfill.ts](../scripts/ingest/backfill.ts)
- **audit: none — automation backlog**
- aliases: Table/QuickList integrity, parse_integrity (AFL)
- see: G1, G7

### G7 · AFL row parse: ep 0 real, conflicting types kept

Episode 0 is a real episode (OVAs/prologues); only negative numbers are rejected. Duplicate rows with the same number AND type collapse to one; same-number rows with DIFFERING types are both kept so the integrity check flags the page instead of the parser silently picking a side. canonicalSlug is read from the first episode link for the alias check.

*Why:* Another (episode 0) and Boruto (ep 182 duplicated) are the fixture regressions in parser-check.ts.

- ruled session 2026-08-22 (lib/afl.ts parseShowPage)
- layer **writer**
- enforced: [lib/afl.ts#parseShowPage](../scripts/ingest/lib/afl.ts) · [parser-check.ts](../scripts/ingest/parser-check.ts)
- **audit: none — automation backlog**
- witnesses: another, boruto-naruto-next-generations
- aliases: AFL row parse contract, episode 0 is real
- see: G6, G8

### G8 · Alias defense: never stage another show's page

A fetched AFL page is staged only when its own episode links resolve to the requested slug AND the served title agrees with the index-anchor title (≥50% shared non-stop-word tokens over the smaller set). Either mismatch holds the page with a parse_integrity flag; another show's data is never staged.

*Why:* AFL's Drupal has been alias-corrupt since ~2023 in two forms: the node kept its true alias (links betray it) or the primary alias was swapped (only the index title exposes it) — chrono-crusade and digimon-adventure-02 were served other shows' pages.

- ruled session 2026-08-22 (data-pipeline §9; §10 "Alias defense")
- layer **writer**
- enforced: [lib/resolve.ts#stageAfl](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- witnesses: chrono-crusade, digimon-adventure-02
- aliases: alias defense, alias-corruption defense, AFL alias corruption
- see: G1, G7, I11

### G9 · Hash gate: identical content is never rewritten

Every staging write is gated on a key-order-stable content hash of the record: an identical hash is "unchanged" (no write; only fetched_at bumps), a changed hash updates that row only, and ingest_runs logs fetched/unchanged/changed/flagged per run. Re-running any puller is a no-op.

*Why:* Idempotent pulls are what make hourly/daily crons safe; diffs stay row-scoped so a changed page cannot clobber unrelated rows. MU refines this to hash only the acted-on fields (S42).

- ruled session 2026-08-22 (data-pipeline §4 "Change detection before writing"; §10 "Hash gate")
- layer **writer**
- enforced: [lib/hash.ts#contentHash](../scripts/ingest/lib/hash.ts) · [lib/resolve.ts#stageAfl](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#stageAniList](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- aliases: hash gate, content-hash gate, staging hashes make re-runs no-ops
- see: G42, G15

### G10 · Large-diff hold: >20% type churn is a parser break

An AFL pull in which more than 20% of previously known episode types change (LARGE_DIFF_RATIO over the episodes present in both old and new) is held with a large_diff flag carrying the proposed data instead of being staged.

*Why:* A filler list evolves a few episodes at a time; a fifth of it flipping in one pull is a parse or alias break, not new knowledge.

- ruled session 2026-08-22 (data-pipeline §2 flag rule; §10 "Large-diff hold")
- layer **writer**
- enforced: [lib/resolve.ts#LARGE_DIFF_RATIO](../scripts/ingest/lib/resolve.ts) · [lib/resolve.ts#stageAfl](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- aliases: large-diff hold, large_diff
- see: G1, G9

### G11 · Empty hold: zero classified episodes is not published

A show AFL has not classified at all (zero episode rows) is held with a parse_integrity {empty} flag rather than resolved as an empty instrument, unless its status is upcoming. It returns automatically when AFL classifies.

*Why:* An empty strip reads as "all canon"; an honest hold is the product promise. Sparse (G12) is the finished-show extension of the same idea.

- ruled Sean 2026-08-22 (data-pipeline §8; §10 "Empty hold")
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- aliases: empty hold
- see: G12, G52

### G12 · Sparse guard: <60% classified is held, auto-returns

A non-RELEASING show whose AFL page classifies fewer than 60% of AniList's episode total is held with a count_mismatch {sparse} flag rather than published as a misleading strip. The hold is not a disposition: it returns automatically once classification passes the bar. Sparse holds are actively closed through better sources (canon-tier, AFG); when AFL later returns it serves as validation, not as the replacement writer.

*Why:* Kinnikuman had 4 of 137 classified. Sparse AFL pages are real community-coverage gaps, not bugs. The 60% bar is also one of the AFG expansion guards.

- ruled session 2026-08-22 (data-pipeline §10 "Sparse guard"; §12.19c2)
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- witnesses: kinnikuman
- aliases: sparse guard, sparse-classification hold, sparse hold
- see: G11, G52, expansion guards

### G13 · Count mismatch >12 is an informational flag

A gap of more than 12 episodes between AniList's aired count and AFL's classified max files a count_mismatch flag and resolve PROCEEDS — this drift is information, never a hold.

*Why:* A season of natural site lag is noise, but a whole-cour gap is the lumped-page or mis-scope signature the stitcher reads. The §2 prose that listed count mismatches among HELD changes is stale (DRIFT-LIST §B); the code flags only.

- ruled session 2026-08-22 (data-pipeline §10 "Count mismatch")
- layer **writer**
- enforced: [lib/resolve.ts#resolveSeries](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- aliases: count mismatch, count mismatch (informational), COUNT_MISMATCH_THRESHOLD
- see: G1, scope-audit gate, stitch finalize gate

### G15 · Conditional GETs: a 304 costs the host nothing

Every scrape-host fetch (AFL, AFG) sends If-None-Match / If-Modified-Since from the staged etag and last_modified; a 304 is a skip that only bumps fetched_at. GraphQL (AniList) has no conditional fetch and the small batched sweep does not need one.

*Why:* Change detection before download is half of the etiquette bargain (G16): most hourly refresh-afl runs no-op instantly.

- ruled session 2026-08-22 (data-pipeline §4 (live text under a superseded banner); §11 refresh-afl bullet)
- layer **writer**
- enforced: [lib/http.ts#politeFetch](../scripts/ingest/lib/http.ts) · [supabase/functions/_src/refresh-afl.ts](../supabase/functions/_src/refresh-afl.ts)
- **audit: none — automation backlog**
- aliases: conditional GETs, change detection before download
- see: G16, G9, G47

### G16 · Etiquette is non-negotiable: delay, UA, credit

AFL's robots.txt Crawl-delay: 10 is honored exactly as a 10 s per-host floor, and AFG gets the same courtesy; every request carries the identifying User-Agent with a contact address; AniList is paced at 2200 ms under its degraded 30/min limit with retry-after on 429; MangaUpdates is paced ~1.5 s and cached per its AUP with credit in the footer; AFL and AFG get a credits line. Scraping happens only in ingestion, never on a user path. Intervals are FIXED and open — randomizing to obscure footprint is deliberately not done.

*Why:* Openly polite is what keeps scrapers welcome; a server log identifies us on every request anyway, so stealth would hide nothing and cost goodwill.

- ruled Sean 2026-08-22 (data-pipeline §4 "Etiquette (non-negotiable)"; §11 "On randomized intervals")
- layer **writer**
- enforced: [lib/http.ts#politeFetch](../scripts/ingest/lib/http.ts) · [lib/anilist.ts#gql](../scripts/ingest/lib/anilist.ts) · [lib/mangaupdates.ts](../scripts/ingest/lib/mangaupdates.ts)
- **audit: none — automation backlog**
- aliases: etiquette, scraping etiquette, crawl-delay, no randomized intervals
- see: G15, G47

### G20 · AFG parse guards: strict cells, dividers, placeholders

parseAfgPage admits an episode row only when the number cell is strictly "N." (1–4 digits), so summary/colspan rows never digit-concatenate into fake numbers; single-cell divider lines never become the running arc label; header rows are skipped; placeholder titles like "(01)." normalize to an empty (pending) title; AFG's "* Filler" marker inside the title cell is stripped; type comes from the number cell's class (red = filler, blue = mixed, else canon); an episode repeated across tables keeps its first occurrence.

*Why:* Naruto 6-27 regressed when a divider row became the arc label (2026-08-23); Dorohedoro stored "(01)." titles; eyeshield-21 titles carried the filler marker (2026-08-25).

- ruled Sean 2026-08-23 (lib/afg.ts parseAfgPage; data-pipeline §10 "Metadata contract" (title guard))
- layer **writer**
- enforced: [lib/afg.ts#parseAfgPage](../scripts/ingest/lib/afg.ts) · [parser-check.ts](../scripts/ingest/parser-check.ts)
- audit: `title_incomplete`
- witnesses: naruto, dorohedoro, eyeshield-21
- aliases: strict episode-cell parse, AFG page parse guards, no digit-mashing
- see: N16, G28, P37

### G22 · AFG continua: every page is a frontier source, gated

Every AFG page — chartless all-canon shows included — carries a continua-manga table (end-of-anime frontier, continue-from chapter, that volume's collected range). It is parsed by parseContinua, staged in ingest_afg_pages.raw.continua, and applied by applyContinua as a source 'afg-continua' anchor plus an absent-only volume boundary ONLY after the full gate stack: suppression, identity guard, sanity band, chapter-space, episode conversion + ≤ aired sanity, A1 episode type, precedence. afg-continua anchors are derivation-tier: wiped and rebuilt per series by the same function the refresh-afg edge runs inline. Wikipedia and manual research stay co-verifiers everywhere — AFG coverage never limits another source.

*Why:* Sean's full-source ruling 2026-08-23: the continua table is AFG's honest run-end statement for shows that have no filler chart at all.

- ruled Sean 2026-08-23 (data-pipeline §10 "AFG continua source (Sean's full-source ruling 2026-08-23)")
- layer **writer**
- enforced: [lib/afg.ts#parseContinua](../scripts/ingest/lib/afg.ts) · [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts) · [supabase/functions/_src/refresh-afg.ts](../supabase/functions/_src/refresh-afg.ts) · [afg-continua-apply.ts](../scripts/ingest/afg-continua-apply.ts) · [afg-continua-backfill.ts](../scripts/ingest/afg-continua-backfill.ts)
- **audit: none — automation backlog**
- aliases: AFG continua source, continua full-source ruling, full-source ruling, afg-continua
- see: G23, C8, A24, G26, G27, N28, D4, three-numbers model, invariant 7

### G23 · Continua identity guard: the heading must name us

The continua table's heading (entity-decoded, parenthetical year stripped, normalized) must appear within the series' own names — title, native, search_text or id — or the table is withheld with a parse_integrity flag. An AFG page can carry another series' table.

*Why:* AFG template bugs are real: A Couple of Cuckoos' page carried Dandadan's table; SHY's carried a Kamonohashi Ron heading.

- ruled Sean 2026-08-23 (data-pipeline §10 "AFG continua source"; lib/anchors.ts applyContinua)
- layer **writer**
- enforced: [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts)
- **audit: none — automation backlog**
- witnesses: a-couple-of-cuckoos, dandadan, shy
- aliases: continua identity guard, identity guard
- see: G22, C8

### G26 · CONTINUA_SUPPRESSED: per-series source suppression

Research may suppress the continua source for one series (a CONTINUA_SUPPRESSED entry with its reasoning) when same-episode precedence cannot stop a ruled-WRONG source value from landing on a DIFFERENT episode. The writer deletes the standing afg-continua anchor and stops; the suppression is outcome-checked by ruling_violation.

*Why:* Claymore's continua named a frontier research had ruled wrong on another episode; kimi-ni-todoke and polar-opposites followed the precedent.

- ruled session 2026-08-23 (data-pipeline §12.22 "NEW RULE — source suppressions"; §12.52)
- layer **writer**
- enforced: [lib/resolve.ts#CONTINUA_SUPPRESSED](../scripts/ingest/lib/resolve.ts) · [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts)
- audit: `ruling_violation`
- witnesses: claymore, kimi-ni-todoke-from-me-to-you, polar-opposites
- aliases: CONTINUA_SUPPRESSED, source suppressions, Claymore precedent
- see: G22, A24, G37

### G27 · Continua END must agree with the page's own chart *(planned)*

When an AFG page carries both a chart and a continua table, the continua END is cross-checked against the chart's last row; a disagreement marks the continua conversion suspect and it is withheld + flagged rather than applied.

*Why:* polar-opposites (2026-08-25): the continua END disagreed with the chart on the same page. Proposed as a restructure-phase gate; not built.

- ruled session 2026-08-25 (data-pipeline §12.52 "gate candidate for the restructuring phase")
- layer **writer**
- enforced: [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts)
- **audit: none — automation backlog**
- witnesses: polar-opposites
- aliases: continua-vs-chart cross-check, continua chart cross-check
- see: G22, C8

### G28 · After a parser change, restage from stored raw

Staging must never hold output the current parse would not produce: after any change to a parser (lib/afg.ts, lib/wikipedia.ts, lib/afl.ts) every staged page is re-parsed from its stored raw_html into raw (episodes + seasons + continua, preserving a previously staged continua when the re-parse finds none) with content_hash updated — no refetch. Fixture regressions (parser-check.ts) run before any live ingest.

*Why:* The AFG re-fetch lesson: a parser fix with no re-parse leaves stale derived rows that look current. afg-restage.ts made the consolidate step-3 contract an actual tool (2026-08-25).

- ruled session 2026-08-23 (data-pipeline §12.22; §12.48 (afg-restage.ts); consolidate skill §3)
- layer **process**
- enforced: [afg-restage.ts](../scripts/ingest/afg-restage.ts) · [parser-check.ts](../scripts/ingest/parser-check.ts) · [.claude/skills/consolidate/SKILL.md](../.claude/skills/consolidate/SKILL.md)
- **audit: none — automation backlog**
- aliases: restage from raw, staging freshness, consolidate step-3 contract
- see: G51, G20, invariant 2

### G29 · Validation tier is event-driven, never scheduled

Cross-check sources validate, they do not refresh: Wikipedia boundaries are ingested once (static once printed) and re-run only on flags; niche sources are invoked when a change or conflict warrants it. The volumes-staleness event supplies those flags — when a chart sync's highest anchor passes the last known volume boundary start by more than 20 chapters, a 'wikipedia' count_mismatch flag on manga:<id> requests a volumes-backfill re-run.

*Why:* Scheduling a static source wastes host goodwill and finds nothing; the event fires exactly when anchors outrun what boundaries can label. MU graduated OUT of this tier 2026-08-24 (S47).

- ruled Sean 2026-08-23 (data-pipeline §11 "Validation tier is EVENT-DRIVEN"; lib/anchors.ts VOLUME_STALE_MARGIN)
- layer **writer**
- enforced: [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [volumes-backfill.ts](../scripts/ingest/volumes-backfill.ts)
- **audit: none — automation backlog**
- aliases: validation tier is event-driven
- see: G47, G49, boundary-aware volumes

### G30 · AFG structural cross-check: ±2 aligned, else ruling material

Every staged AFG page matched to a canonical series is compared to our structure: with ≥6 episodes, AFG max within ±2 of ours is aligned; more than 2 below is a season-scoped page (a component boundary within ±2) or unexplained, more than 2 above is unstitched newer seasons / a ruled split / AFL lag (an afg-extend candidate); a season count that differs from our component count is informational. Sparse pages (<6 rows or max 0) carry no signal. Everything is reported as ruling material, nothing is auto-applied.

*Why:* AFG numbers franchise-continuously, so its page grouping is an independent statement of structure; reading it as a cross-check (not a writer) is the 2026-08-24 AFG structural session ruling.

- ruled session 2026-08-24 (scripts/ingest/audit-afg-structure.ts; franchise-rulings "AFG as story-flow reference")
- layer **process**
- enforced: [audit-afg-structure.ts](../scripts/ingest/audit-afg-structure.ts)
- audit: `afg:aligned`, `afg:grouping_conflicts`, `afg:hierarchy_notes`
- aliases: AFG structural cross-check, audit-afg-structure
- see: N16, registration tiers, I29, AFG as story-flow reference

### G31 · MU frontier: coverage prose becomes a gated 'mu' anchor

MangaUpdates' curated anime-coverage field is MULTI-SEGMENT prose: parse ALL "Vol N, Chap M" pairs, pick the largest inside THIS entry's scope segment, and trust an explicit "EP N" pin only when the text holds exactly one pair. The pin episode is the explicit EP when ≤ aired_episodes, else the run end. The pair is written as a source 'mu' anchor only behind the full gate stack (S32).

*Why:* MHA's field lists every season's endpoint; Naruto's covers three series with an EP number belonging to the Boruto clause. AniList has no current-chapter field at all — the frontier can only come from MU or research.

- ruled session 2026-08-23 (data-pipeline §10 "MU-frontier rule")
- layer **writer**
- enforced: [lib/mu-frontier.ts#parseCoverageAll](../scripts/ingest/lib/mu-frontier.ts) · [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts)
- audit: `mu_frontier_applied`, `active_anchored`
- witnesses: my-hero-academia, naruto
- aliases: MU-frontier rule, MU frontier rule, mu frontier
- see: G32, G38, G39, effective total, anchor-freshness rule

### G32 · D1: the MU pin writes only when every gate passes

applyMuFrontier writes a pin only when the whole stack passes, in order: suppression (G37) → sibling-scope filter (G33) → chapter-space / count-space (N28) → airing-pin (G34) → pin-episode redundancy and curated precedence (skips) → scope-consumed (G35) → A1 episode type (G36). Every refusal files a count_mismatch flag (the established withheld-frontier kind) naming its reason, and each refusal is its own census class so a refused frontier never masquerades as "no MU coverage".

*Why:* The batch-17 five-case class: MU's prose is franchise-level and a sequel's endpoint sits INSIDE the manga's chapter space where the chapter-space gate cannot see it (ace-ii ep52 → 259, yowamushi ep38 → 544, gantz ep26 → 280 on a filler row, toriko ep147, prisma-illya ep42). First run: mu pins 80→66, every removal triaged.

- ruled Sean 2026-08-24 (batch-17 DECISIONS-FOR-SEAN D1; data-pipeline §12.43; §10 "MU franchise-conflation gates")
- layer **writer**
- enforced: [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts)
- audit: `mu_refused_sibling_scope`, `mu_refused_scope_consumed`, `mu_refused_episode_type`, `mu_suppressed`, `anchor_on_noncanon_row`
- witnesses: ace-of-diamond-act-ii, yowamushi-pedal, gantz, toriko, fate-kaleid-liner-prisma-illya, dragon-ball, the-promised-neverland
- aliases: D1, D1 gate stack, MU gate stack, MU franchise-conflation gates, MU writer gates
- see: N28, G33, G34, G35, G36, G37, G31, A26, curated precedence, A1, D4

### G33 · Sibling-scope ceiling: a pin stays below the next sibling

Entries sharing a manga_anilist_id bound each other: the smallest sibling manga_start_chapter above this entry's own start is its ceiling, and MU pairs at or past it are out of scope. Implemented as a scope FILTER over the multi-segment parse so this entry's own labeled pair still wins; only when nothing survives is the frontier withheld with a count_mismatch flag (refused_sibling_scope). Remakes with equal starts do not constrain each other.

*Why:* Naruto's pin must stay below Shippuden's 245; ace-ii ep52 had received Season 2's ch 259 and yowamushi ep38 the season-5 end 544.

- ruled Sean 2026-08-24 (batch-17 DECISIONS-FOR-SEAN D1 (1); data-pipeline §10 "MU franchise-conflation gates")
- layer **writer**
- enforced: [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts)
- audit: `mu_refused_sibling_scope`
- witnesses: ace-of-diamond-act-ii, yowamushi-pedal, naruto, naruto-shippuden
- aliases: D1 sibling-scope ceiling, sibling-scope ceiling, refused_sibling_scope
- see: G32, G35, source-scope enforcement, continuation handoff

### G34 · Airing-pin rule: run-end pins apply to finished runs only

Without an explicit episode in MU's text the pin lands at the run end — a moving target while a series airs — so MU frontier pins apply to FINISHED runs only; an airing series needs the explicit episode or a research anchor. The refusal is a silent no_coverage, not a flag.

*Why:* Bleach TYBW: MU announced ch 705 while part 4 was mid-air; a run-end pin would have crept forward every week. The rule applies only when the caller passes status.

- ruled Sean 2026-08-23 (lib/mu-frontier.ts applyMuFrontier (FrontierSeries.status))
- layer **writer**
- enforced: [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts)
- audit: `pending_airing_no_frontier`
- witnesses: bleach-tybw
- aliases: airing-pin rule, D1 airing-pin, TYBW airing pin
- see: G32, G31

### G35 · Scope-consumed: research already reached the scope end

When non-MU anchors already reach the END of this entry's chapter scope — min(total_chapters, sibling ceiling − 1) — yet the MU pin episode extends beyond all research, the trailing episodes cannot adapt this scope: the frontier is withheld with a count_mismatch flag (refused_scope_consumed). It sits after the redundancy skips so a fully-researched series stays a silent skip.

*Why:* dragon-ball ep153: research's terminal afg ep148 → 194 = ceiling − 1, and MU wanted to pin later episodes. Misses prisma-illya by one chapter (ends stop at 13, 14 is the unadapted epilogue) — hence S37.

- ruled Sean 2026-08-24 (batch-17 DECISIONS-FOR-SEAN D1 (2); data-pipeline §10 "MU franchise-conflation gates")
- layer **writer**
- enforced: [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts)
- audit: `mu_refused_scope_consumed`
- witnesses: dragon-ball, fate-kaleid-liner-prisma-illya
- aliases: D1 scope-consumed, scope-consumed, scope-consumed refusal, refused_scope_consumed
- see: G32, G33, G37, A26

### G36 · A1 at the MU writer: no pin on a filler/anime-only row

A run-end MU pin landing on an episode whose type is not canon or mixed is refused with a count_mismatch flag (refused_episode_type). The check is an allow-list so unknown types fail closed; row-less episodes pass so synthesized-row entries keep their frontier. Research records the honest terminal on the last canon/mixed episode instead.

*Why:* gantz ep26 took the Gantz:O movie's 280 on a filler row; toriko ep147 a past-frontier volume on a filler row. First run: 14 series refused, 11 standing violations healed. D4 extended the same gate to both AFG writers (2026-08-25).

- ruled Sean 2026-08-24 (batch-17 DECISIONS-FOR-SEAN D1 (3); data-pipeline §10 "MU franchise-conflation gates")
- layer **writer**
- enforced: [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts)
- audit: `mu_refused_episode_type`, `anchor_on_noncanon_row`
- witnesses: gantz, toriko, my-hero-academia, the-promised-neverland
- aliases: D1 episode-type refusal, A1 at the MU writer, refused_episode_type, A1 / D1 episode-type refusal
- see: G32, A1, D4, invariant 6

### G37 · MU_FRONTIER_SUPPRESSED: declarative per-entry suppression

For an entry whose MU pin is wrong for a reason NO structural gate can derive, a curated MU_FRONTIER_SUPPRESSED entry in the lib blocks the rewrite; the delete-at-entry still heals the standing pin. Each entry carries its reasoning and its retiring condition, and surfaces as the mu_suppressed census class.

*Why:* Sole member prisma-illya: its seasons adapt THREE manga in one chapter space, so MU's "Vol 2, Chap 14" is S1's first-manga completion and the run-end assumption lands it on the 3rei!!-adapting movie ep 42. Retires when the D2 split lands.

- ruled Sean 2026-08-24 (data-pipeline §10 "MU_FRONTIER_SUPPRESSED (declarative suppression record, D1 2026-08-24)")
- layer **writer**
- enforced: [lib/mu-frontier.ts#MU_FRONTIER_SUPPRESSED](../scripts/ingest/lib/mu-frontier.ts)
- audit: `mu_suppressed`
- witnesses: fate-kaleid-liner-prisma-illya
- aliases: MU_FRONTIER_SUPPRESSED, MU suppression record
- see: G32, G26, G38, P20

### G38 · 'mu' anchors are wiped and re-derived every run

Applying the MU frontier first DELETES the series' existing 'mu' anchor and then re-derives it through the gate stack, on every run of every caller (audit-manga-coverage, mu-backfill, refresh-mu). A rule fix therefore heals every series on the next pass; a suppressed series stops after the delete. The same contract holds for afg-continua anchors.

*Why:* Derivation-tier rows are wipe-and-rebuild by contract — which is exactly why a repaired value on a mu row does not survive (hikaru ep-75 wipe → invariant 7: repairs live at the manual tier).

- ruled session 2026-08-23 (lib/mu-frontier.ts header; data-pipeline §10 "MU-frontier rule")
- layer **writer**
- enforced: [lib/mu-frontier.ts#applyMuFrontier](../scripts/ingest/lib/mu-frontier.ts) · [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts)
- **audit: none — automation backlog**
- aliases: mu anchors wiped and rebuilt, mu anchors are derivations, delete-at-entry
- see: G31, G22, G37, invariant 7, hikaru ep-75 wipe

### G39 · MU targets are universal: every manga-linked series

Every manga-linked series is an MU staging target — MU applies to ALL series as check and validation — while frontier anchors still apply only where anchors are absent or stale. The old absent-or-stale target FILTER is retired.

*Why:* The DBZ 520-vs-519 display needed MU's chapter number for a manga whose anchors were fresh, which the old filter skipped (Sean 2026-08-24).

- ruled Sean 2026-08-24 (data-pipeline §10 "MU targets: UNIVERSAL")
- layer **writer**
- enforced: [mu-backfill.ts](../scripts/ingest/mu-backfill.ts) · [supabase/functions/_src/refresh-mu.ts](../supabase/functions/_src/refresh-mu.ts)
- **audit: none — automation backlog**
- witnesses: dragon-ball-z
- aliases: MU targets: UNIVERSAL, MU targets universal, universal MU targeting
- see: G31, I6, G47, same-edition band, effective total

### G41 · Manga-status cross-check flags, never auto-applies

MU's publication status is an independent statement — the explicit completed flag wins, else the FIRST line of the status string (complete → finished, hiatus → hiatus, ongoing → publishing), else completed === false → publishing. Disagreement with our AniList-derived manga_status files a taxonomy_conflict flag for review and NEVER auto-applies; the check is skipped when ours is anime_only or MU has no status.

*Why:* Caught Frieren, Gangsta and Ahiru no Sora hiatuses that AniList lagged; Outlaw Star confirmed complete by Sean 2026-08-24 — the standing example of the rule working.

- ruled Sean 2026-08-24 (data-pipeline §10 "Manga-status cross-check")
- layer **writer**
- enforced: [lib/mu-frontier.ts#muPublicationStatus](../scripts/ingest/lib/mu-frontier.ts) · [lib/mu-frontier.ts#crossCheckMangaStatus](../scripts/ingest/lib/mu-frontier.ts)
- **audit: none — automation backlog**
- witnesses: frieren, gangsta, ahiru-no-sora, outlaw-star
- aliases: manga-status cross-check, cross-check tier, taxonomy_conflict (MU status)
- see: G1, G5, G39

### G42 · MU change detection hashes only the acted-on fields

MU change detection hashes only the fields our rules act on — latest_chapter, status, completed, type, anime — so rating/rank churn never fakes a change every fetch. The FULL MU payload is still staged (greedy staging, never a trim).

*Why:* AFL/AniList hash the whole payload; MU's ratings move daily and would make every weekly cycle a "change".

- ruled session 2026-08-24 (lib/mangaupdates.ts muHash; data-pipeline §11 refresh-mu bullet)
- layer **writer**
- enforced: [lib/mangaupdates.ts#muHash](../scripts/ingest/lib/mangaupdates.ts) · [supabase/functions/_src/refresh-mu.ts](../supabase/functions/_src/refresh-mu.ts)
- **audit: none — automation backlog**
- aliases: muHash, hash-only-acted-on-fields, MU hash gate
- see: G9, G51

### G43 · Wikipedia page discovery: tokens must agree, not rank

Page discovery prefix-searches the "List of X chapters|episodes" families first (disambiguated forms tried first); the full-text fallback accepts a hit only when its inner title shares at least 50% of its tokens with a candidate title. Search ranking alone is never identity. The manga's own title leads the search; a page whose parse repeats or backs up volume numbers is a franchise page and is skipped.

*Why:* My Dress-Up Darling's search once returned "List of Ranma ½ chapters"; ten manga carried boundaries from OTHER series' pages before the 2026-08-23 identity heal.

- ruled session 2026-08-23 (lib/wikipedia.ts findChapterPages / findEpisodePages; data-pipeline §10 "Volume-boundary identity + numbering space")
- layer **writer**
- enforced: [lib/wikipedia.ts#findChapterPages](../scripts/ingest/lib/wikipedia.ts) · [lib/wikipedia.ts#findEpisodePages](../scripts/ingest/lib/wikipedia.ts) · [volumes-backfill.ts](../scripts/ingest/volumes-backfill.ts)
- audit: `boundaries_wrong_page`
- aliases: page discovery token agreement, Wikipedia page discovery, search ranking is not identity
- see: G44, volume-boundary identity

### G44 · Episode-list locks: an offset merges only when proven

A Wikipedia episode-list page set merges only when its offset into OUR numbering is PROVEN, in fixed order: (1) date/title votes — exact air-date matches weigh 2, ≥75% title-token similarity weighs 1, the winner needs ≥3 votes and ≥3× the runner-up; (2) season-label component lock — "season N" is every numbered component whose label names season N, positional N-th fallback when labels are silent, an airing tail capped at the known total; (3) continuity lock — integer rows begin exactly at merged-max+1, fit our count, dates monotonic; (4) exact-name first-segment fallback ONLY when the page's earliest air date sits within a year of our start (the namesake guard). Unlockable pages skip per page. Mid-run order-only alignment needs fractional separators or page top == our count.

*Why:* "List of Kingdom episodes" is the 2007 British drama; Slime's main page carried the Tensura Nikki spin-off; a page that numbered an insert overshoots by the inserts (Magus Bride S2).

- ruled Sean 2026-08-23 (data-pipeline §10 "Wikipedia episode-list locks (2026-08-23 s2)")
- layer **writer**
- enforced: [wiki-episodes-backfill.ts#lockAndMerge](../scripts/ingest/wiki-episodes-backfill.ts) · [wiki-episodes-backfill.ts#datesCompatible](../scripts/ingest/wiki-episodes-backfill.ts) · [wiki-episodes-backfill.ts#countAligned](../scripts/ingest/wiki-episodes-backfill.ts)
- **audit: none — automation backlog**
- witnesses: when-they-cry, kingdom, that-time-i-got-reincarnated-as-a-slime, the-ancient-magus-bride, rurouni-kenshin-2023, kinnikuman
- aliases: Wikipedia episode-list locks, episode-list locks, evidence-locked offsets, namesake guard, When They Cry case, Kingdom S6 lesson
- see: G43, G45, G46, source numbering translation, Ryuusui lesson, A-4

### G45 · Wikipedia episode fill is fill-only and bounded

Wikipedia fills only what is missing: '' titles and null air dates, creating rows for numbers we lack (through filterEpisodeRows, default type canon). AFL remains the title authority where it has real titles — a wiki title that disagrees with a non-empty stored title is NOT written, and more than 3 such conflicts per series files taxonomy_conflict "numbering offset suspected". Only numbers 1..aired are written, and a page family's max must fit our aired count (+2 lag) or the family flags instead of writing.

*Why:* Fill-only is how a lower-authority source can contribute without ever overwriting a higher one; the conflict counter turns title disagreement into an offset detector.

- ruled Sean 2026-08-23 (wiki-episodes-backfill.ts header; data-pipeline §11 script list)
- layer **writer**
- enforced: [wiki-episodes-backfill.ts](../scripts/ingest/wiki-episodes-backfill.ts)
- audit: `title_incomplete`
- aliases: fill-only, Wikipedia fill is fill-only, wiki fill gates
- see: G44, G5, P37

### G46 · Fractional rows are staged, then ruled, never dropped

Every Wikipedia fractional episode row (35.5-style) is staged durably into ingest_fractionals; each carries a disposition (excluded_recap / order_only / modeled) with its reasoning in the note once ruled, and an undisposed row is the fractional_unmodeled queue. sync-watch-order mirrors order_only rows into watch_order_entries idempotently (labels fill-only; entries whose fractional vanished are dropped).

*Why:* Non-main entries are NOTED so the UI/watch-order phase decides from data, never from memory (Sean 2026-08-23); fractional labels also PROVE a page shares our numbering space.

- ruled Sean 2026-08-23 (wiki-episodes-backfill.ts; data-pipeline §10 "Research-logged non-main entries")
- layer **writer**
- enforced: [wiki-episodes-backfill.ts](../scripts/ingest/wiki-episodes-backfill.ts) · [sync-watch-order.ts](../scripts/ingest/sync-watch-order.ts)
- audit: `fractional_unmodeled`
- aliases: fractional staging, fractional staging + disposition, ingest_fractionals
- see: G44, fractional ruling, research-logged non-main entries, watch-order entries

### G47 · Freshness map: one scheduled path per source, windowed

Every writing source has exactly one scheduled freshness path — a pg_cron → invoke_edge_refresh → edge function — with a per-function staleness window and a batch cap, plus its named event pulls; the edge functions are generated bundles of lib and run the same code as the scripts. The knobs are one-line cron edits and the per-function windows, re-evaluable freely.

*Why:* Cadence as built (ratified 2026-08-23, MU promoted 2026-08-24): refresh-anilist daily 08:10 UTC full batched sweep; refresh-afl hourly at :40, ≤20 stalest pages older than 6 days; refresh-afg daily 09:20 UTC, ≤25 stalest older than 13 days; refresh-mu daily 09:50 UTC, ≤20 stalest staged rows older than 7 days (the §11 "≤15" is stale — BATCH = 20). Event pulls: backfill.ts (AFL), chain walks/match (AniList), afg-backfill / afg-expansion / afg-extend / afg-continua-backfill (AFG), mu-backfill (MU), volumes-backfill on flags (Wikipedia).

- ruled Sean 2026-08-23 (data-pipeline §11 "The freshness map"; "Refresh cadence — IMPLEMENTED 2026-08-23, RATIFIED by Sean")
- layer **writer**
- enforced: [supabase/functions/_src/refresh-afl.ts#BATCH](../supabase/functions/_src/refresh-afl.ts) · [supabase/functions/_src/refresh-afg.ts#BATCH](../supabase/functions/_src/refresh-afg.ts) · [supabase/functions/_src/refresh-mu.ts#BATCH](../supabase/functions/_src/refresh-mu.ts) · [supabase/functions/_src/refresh-anilist.ts](../supabase/functions/_src/refresh-anilist.ts) · [supabase/migrations/20260823150000_refresh_cron.sql](../supabase/migrations/20260823150000_refresh_cron.sql) · [build-functions.ts](../scripts/ingest/build-functions.ts)
- **audit: none — automation backlog**
- aliases: freshness map, refresh cadence, the four crons
- see: G29, I34, G49, G50, invariant 2

### G49 · Inline upkeep: derived writes ride the puller

A source's identity registration and derived writes happen INSIDE its regular puller (backfill + refresh) — never in a separate script someone must remember to run. A successful AFG chart sync registers the afg id and dismisses that slug's open 'afg' flags; refresh-mu recomputes latest_known, the frontier and the status cross-check on change; refresh-afg applies continua per page.

*Why:* A remembered script is a forgotten script; the cron must carry the whole rule (Sean 2026-08-22).

- ruled Sean 2026-08-22 (data-pipeline §11 new-source checklist step 4)
- layer **writer**
- enforced: [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [supabase/functions/_src/refresh-mu.ts](../supabase/functions/_src/refresh-mu.ts) · [supabase/functions/_src/refresh-afg.ts](../supabase/functions/_src/refresh-afg.ts)
- **audit: none — automation backlog**
- aliases: inline upkeep
- see: G50, G47, identity registry

### G50 · New-source checklist: repeatable mechanism or not at all

A new data source enters only through the same five steps: (1) a staging table ingest_<source>_* with raw payload jsonb + content hash + fetch metadata, service-role only, greedy; (2) identity registration FIRST into series_external_ids, collisions throw; (3) a rules layer — a ledger record naming what the source is authoritative for versus cross-check-only, with its gates; (4) inline upkeep inside the source's puller; (5) its row in the freshness map and the source roster. Anything else is a one-off and is refused.

*Why:* MangaUpdates and Wikipedia both entered this way; step 3's old "§10 table gets a row" is now a ledger record.

- ruled Sean 2026-08-22 (data-pipeline §11 "New-source checklist (Sean's ruling 2026-08-22: no one-offs, ever)")
- layer **process**
- enforced: [docs/data-pipeline.md](../docs/data-pipeline.md)
- **audit: none — automation backlog**
- aliases: new-source checklist, no one-offs (sources)
- see: G49, G51, G47, G5, identity registry, invariant 8

### G51 · Staging keeps everything, raw HTML included

A staging table stores every pull's complete raw payload — including raw HTML / source text where the source is scraped — plus content hash and fetch metadata; promotion to canonical is a re-parse or migration over raw we already own, never a re-fetch, and no writer trims what it stages.

*Why:* The AFG re-fetch lesson: AFG pages carry between-season reading guidance in prose reserved for the IA/arc phase, and a parser fix must be re-applied from disk (S28). Rule-form of the "staging is greedy; canonical is deliberate" architecture fact.

- ruled Sean 2026-08-22 (data-pipeline §2 "Staging"; §11 new-source checklist step 1)
- layer **writer**
- enforced: [lib/mangaupdates.ts#MuSeries](../scripts/ingest/lib/mangaupdates.ts) · [afg-restage.ts](../scripts/ingest/afg-restage.ts)
- **audit: none — automation backlog**
- aliases: staging is greedy, greedy staging, AFG re-fetch lesson
- see: G28, G42, G50

### G52 · Canon-tier creation: chartless manga shows still enter

A manga-sourced show with no per-episode chart anywhere (~0% filler, so AFL never built a page and AFG has no filler chart) still enters the catalog: AniList supplies structure and totals through the ownership-guarded chain walk, episode typing defaults to canon through the spans-gap rule (no episode rows are fabricated), AFG's continua table supplies the end-frontier anchor where present, and MU picks the series up on its universal cycle. Anime-original holds have no manga side and are deferred.

*Why:* Ruled YES 2026-08-23 (§12.19c2) for SHY, Cells at Work ×2, Ranking of Kings, Chrono Crusade, Orient, Shaman King 2001; confirmed a standing rule 2026-08-25 (DRIFT-LIST A-9). ENFORCEMENT UNCERTAIN: canon-tier.ts exists as a re-runnable ruling record with a fixed TARGETS list — whether it is the rostered creation path for NEW chartless shows is for the system census to find, never rebuilt from the log.

- ruled Sean 2026-08-23 (data-pipeline §12.19c2; docs/restructure/DRIFT-LIST.md §A A-9)
- layer **writer**
- enforced: [history/canon-tier.ts](../scripts/ingest/history/canon-tier.ts)
- audit: `pending_no_canon`, `title_incomplete`
- witnesses: shy, cells-at-work, ranking-of-kings, chrono-crusade, orient, shaman-king-2001
- aliases: canon-tier creation, canon-tier, A-9
- see: G11, G12, G22, G39, base-type padding, ownership guard

### G53 · Ruled air dates: AIR_DATE_OVERRIDES, applied at every write

A research-ruled episode air date (2+ cited sources) lives ONLY in AIR_DATE_OVERRIDES and is re-applied inside filterEpisodeRows at every episode write — a bare DB update is clobbered by the next AFL refresh. Standing rows are asserted by assert-overrides.ts; a stored date that disagrees with a ruled one is a ruling_violation. Claims without a cited date never enter the map.

*Why:* AFL inherits date errors: fist-of-the-north-star carried six wrong dates (ep 108 wore ep 112's) and ranma-1-2 ep 153 wore ep 158's, which faked an order deviation in the batch-17 re-anchor. First /add-rule exercise (2026-08-26): 7 cited rows; kinnikuman 90-119 / 38 / 87 and railgun ep 14 are dateless claims → batch-18 narrow task.

- ruled Sean 2026-08-25 (docs/system-evolution.md "Air-date override pass" (Sean's go); restructure T3.1)
- layer **writer**
- enforced: [lib/rulings/air-dates.ts#AIR_DATE_OVERRIDES](../scripts/ingest/lib/rulings/air-dates.ts) · [lib/resolve.ts#filterEpisodeRows](../scripts/ingest/lib/resolve.ts) · [assert-overrides.ts#main](../scripts/ingest/assert-overrides.ts)
- audit: `ruling_violation`
- witnesses: fist-of-the-north-star, ranma-1-2
- aliases: AIR_DATE_OVERRIDES, air-date overrides, air date override pass, ruled air dates
- see: T6, R3, R20, G54

### G54 · Air-date order: a date a year out of order is withheld

Every episode writer walks its rows in number order through the air-date order gate (lib/airdate-order.ts): a stored date more than 365 days EARLIER than its predecessor names an outlier — the predecessor when it also jumped a year off its own past and the run resumes from the regressing row, else the regressing row when nothing continues from it — and the outlier's date is withheld (stored NULL, flagged airdate_withheld), never stored. When neither side can be named (a whole block changes era, or JP and US dates alternate) nothing is withheld and the row is reported. Ruled broadcast-order deviations live in AIRDATE_ORDER_ACK (whole series or an episode list, reason + cite) and are neither withheld nor reported; every other regression, shallow or deep, is the airdate_regression review queue. Episode 0 rows are outside the walk (N7). Corrected dates enter through G53.

*Why:* AFL inherits date typos a year or more out: gto ep 31 wore 2014-02-07 between two May-2000 rows, black-butler ep 31 a 2017 date in a 2010 run, fruits-basket ep 8 a 2017 date in the 2001 series; 92 regressions across 50 series when A-11 was searched. An honest gap beats a wrong date (P6), but haruhi's 2006 broadcast and Cowboy Bebop's TX-first-run sessions regress for real — the ruled map keeps those out of the gate. Second /add-rule exercise (2026-08-26): 10 standing dates withheld at heal. Threshold CONFIRMED at 365 by Sean the same day (Cursor concurring): the six rows regressing 351-359 d are a G53 queue, not a reason to retune the gate; the withheld ten get cited dates via G53, never a second mechanism.

- ruled Sean 2026-08-26 (docs/restructure/DRIFT-LIST.md A-11 (Sean: "I think I agree the a-11 proposal is good"); T4-GLOSSARY.md §6 step 1)
- layer **writer**
- enforced: [lib/airdate-order.ts#airdateOrderWalk](../scripts/ingest/lib/airdate-order.ts) · [lib/rulings/air-date-order.ts#AIRDATE_ORDER_ACK](../scripts/ingest/lib/rulings/air-date-order.ts) · [lib/resolve.ts#filterEpisodeRows](../scripts/ingest/lib/resolve.ts) · [assert-overrides.ts#assertAirdateOrder](../scripts/ingest/assert-overrides.ts) · [audit-ui-truth.ts#airdate_regression](../scripts/ingest/audit-ui-truth.ts)
- audit: `airdate_regression`, `airdate_withheld`, `ruling_violation`
- witnesses: gto-great-teacher-onizuka, black-butler, fruits-basket, the-melancholy-of-haruhi-suzumiya, cowboy-bebop
- aliases: A-11, air-date order gate, airdate regression, airdate_regression, AIRDATE_ORDER_ACK, 365-day rule, air-date withheld, airdate_withheld
- see: G53, P6, N7, R1

## V — Volumes & boundaries

### V1 · Monotonic starts, or the row is not data

Volume-boundary chapter starts must strictly increase with volume number. At parse time a volume whose start is ≤ the previous kept start is a parse artifact: it is DROPPED, the remaining rows re-close around the gap, and the dropped rows are returned so the caller flags the manga for research. A slightly coarser self-consistent table beats a precise-looking contradictory one.

*Why:* Sailor Moon 'v3: chs 10-3' (Sean 2026-08-24): every boundary's end derives from the next start, so one mis-parsed start mislabels the volume of every later chapter. 29 rows across 11 manga were live.

- ruled Sean 2026-08-24 (data-pipeline §11 'Volume boundaries: monotonic starts, or the row is not data')
- layer **writer**
- enforced: [lib/wikipedia.ts#boundariesWithDrops](../scripts/ingest/lib/wikipedia.ts) · [volumes-backfill.ts#main](../scripts/ingest/volumes-backfill.ts)
- audit: `boundaries_degenerate`
- witnesses: sailor-moon, urusei-yatsura
- aliases: monotonic-start gate, MONOTONIC-START rule, monotonic boundaries, monotonic starts, Sailor Moon v3 report, Sailor Moon "v3: chs 10-3"
- see: V2, V3, V6

### V2 · Stored-boundary heal: max-weight increasing subsequence

Over stored boundary rows the healer keeps the maximum-weight strictly-increasing subsequence of chapter_start (research rows weigh 1000 and are never dropped; a self-degenerate row loses ties), re-closes ONLY broken ends (degenerate, overlapping, or null-with-successor — a valid end before a fractional neighbour is left alone), and nulls a degenerate FINAL volume. When the coherent run is a minority of the table and no research rows exist, the whole table is WIPED so the ratio fallback takes over (flag boundary_parse_unusable); otherwise flag boundary_parse_artifact so research can restore the true starts.

*Why:* A greedy scan picks the wrong row; Urusei Yatsura's 12-volume table was wholesale garbage and wiped; Tokyo Ghoul :re v3 ending at 31 before 31.5 is a valid end.

- ruled Sean 2026-08-24 (heal-volume-boundaries.ts header; data-pipeline §11 'Volume boundaries: monotonic starts' (healer clauses))
- layer **writer**
- enforced: [heal-volume-boundaries.ts#main](../scripts/ingest/heal-volume-boundaries.ts)
- audit: `boundaries_degenerate`
- witnesses: sailor-moon, fairy-tail, tokyo-ghoul-re, beelzebub, urusei-yatsura, hajime-no-ippo
- aliases: heal-volume-boundaries, boundary heal, Ippo v61 partial-boundary principle, Urusei Yatsura wipe
- see: V1, V3, V5, sliver rule

### V3 · Boundary-aware volumes everywhere; ratio only as fallback

EVERY chapter→volume readout prefers a real print boundary (the volume_boundaries row containing the chapter). The ratio estimate — clamp(ceil(chapter × total_volumes / total_chapters), 1, total_volumes) — applies only when no boundary covers the chapter and both totals exist; otherwise the volume is null (an honest no-volume readout). An estimated row must never contradict a curated neighbour's volume.

*Why:* Kenshin ep 29 showed ratio vol 6 beside the anchor's real vol 7 (Sean 2026-08-23). DRIFT: the ratio fallback has three implementations — mapping.ts#chToVol (startVol + floor((ch−startCh)/perVol), scope-aware), assemble.ts#volumeFor (ceil, not scope-aware) and a hand copy in audit-ui-truth.ts.

- ruled Sean 2026-08-23 (data-pipeline §10 'Boundary-aware volumes everywhere')
- layer **display**
- enforced: [src/lib/mapping.ts#chToVol](../src/lib/mapping.ts) · [src/data/catalog/assemble.ts#volumeFor](../src/data/catalog/assemble.ts) · [audit-ui-truth.ts#volumeFor](../scripts/ingest/audit-ui-truth.ts)
- audit: `ok_no_volume`
- witnesses: rurouni-kenshin
- aliases: boundary-aware volumes, boundary-aware volumes everywhere, volume ratio fallback, chToVol, Kenshin ep-29 wobble
- see: V1, V2, V4, V7, invariant 4

### V4 · Partial boundary tables never stand in as totals

publishedVolumes (the boundary count) substitutes for a null total_volumes ONLY when the boundary table is complete from the manga's scope start (some boundary has chapter_start ≤ manga_start_chapter ?? 1). A lone research row must never masquerade as '1 volume total' and clamp every readout to v1.

*Why:* hajime-no-ippo's single research row (v61: 552-561) collapsed every volume readout to v1 (2026-08-24).

- ruled session 2026-08-24 (data-pipeline §11 'Partial boundary tables never stand in as totals (the Ippo v61 lesson, 2026-08-24)'; §12.37)
- layer **display**
- enforced: [src/data/catalog/assemble.ts#toAnimeSeries](../src/data/catalog/assemble.ts)
- **audit: none — automation backlog**
- witnesses: hajime-no-ippo
- aliases: Ippo v61 lesson, partial boundary tables never stand in as totals, published-volume stand-in completeness, publishedVolumes
- see: V2, V3

### V5 · Boundaries come from the manga's OWN page

A manga's Wikipedia boundary rows must come from a page that names THAT manga: the manga's own title leads the page search (anime title as fallback) and a search hit requires title-token overlap with the manga's titles/synonyms; a page whose parse repeats or backs up volume numbers is a franchise/disambiguation page and is skipped; a manga whose page family no longer qualifies loses its stale wikipedia rows. Wikipedia rows are full-replaced per ingest; research rows are never touched.

*Why:* Sixteen manga carried boundaries from other series' pages (Slime ← Cells at Work!, Made in Abyss ← Claymore, …) and Dragon Ball's came from the Z list in Viz's restarted numbering — pre-08-24 search matches never healed.

- ruled session 2026-08-23 (data-pipeline §10 'Volume-boundary identity + numbering space (2026-08-23 s2)'; §12.17)
- layer **writer**
- enforced: [volumes-backfill.ts#main](../scripts/ingest/volumes-backfill.ts)
- audit: `boundaries_wrong_page`
- witnesses: that-time-i-got-reincarnated-as-a-slime, made-in-abyss, dragon-ball, my-dress-up-darling, relife
- aliases: volume-boundary identity, volume-boundary identity + numbering space, Slime ← Cells at Work class, Made in Abyss ← Claymore class, title-token overlap gate
- see: V6, V7, our slug is identity

### V6 · Boundaries stay inside the manga's numbering space

For a FINISHED manga with a known total, Wikipedia boundary rows past the total are TRIMMED and the last kept row closes at the total; a table with fewer than 2 volumes, or whose last start exceeds total + 50, flags instead of standing (the exceed-totals flag). Research-tier rows may carry volumes a page cannot and close the last wiki row at their first chapter − 1.

*Why:* Shared pages list sequels: Cardcaptor + Clear Card, Rosario Season II and Tokyo Ghoul :re ran past their manga's end; Dragon Ball's research rows (v17-42) carry what the Z list restarts.

- ruled session 2026-08-23 (data-pipeline §10 'Volume-boundary identity + numbering space (2026-08-23 s2)' (numbering-space clauses))
- layer **writer**
- enforced: [volumes-backfill.ts#main](../scripts/ingest/volumes-backfill.ts)
- audit: `boundaries_beyond_total`
- witnesses: cardcaptor-sakura, cardcaptor-sakura-clear-card, rosario-vampire, tokyo-ghoul, dragon-ball
- aliases: boundary numbering space, exceed-totals flag, finished-total trim
- see: V1, V5, V7, N22

### V7 · Continua boundaries write absent-only

A continua-derived volume boundary (continue-from volume's collected range) is written only when no boundary exists for that (manga, volume); an existing Wikipedia-staged boundary that disagrees is never overwritten — it files a count_mismatch flag ('verify which edition'). A continua pin with null volume writes no boundary.

*Why:* Wikipedia and manual research stay co-verifiers; AFG's volume range is a cross-check, not the volume source (§12.52: ok_full 234→231 was a class shuffle, not a regression).

- ruled Sean 2026-08-23 (data-pipeline §10 'AFG continua source (Sean's full-source ruling 2026-08-23)' (boundaries clause); §12.52)
- layer **writer**
- enforced: [lib/anchors.ts#applyContinua](../scripts/ingest/lib/anchors.ts)
- **audit: none — automation backlog**
- aliases: boundaries write absent-only, continua boundary write
- see: V5, V6, V8, AFG continua source, invariant 7

### V8 · Volumes-staleness event

When the highest derived anchor chapter passes the last known volume-boundary start by more than VOLUME_STALE_MARGIN (20 chapters), syncAnchors files a 'wikipedia' count_mismatch flag on manga:<id> asking for a volumes re-ingest. The validation tier is event-driven, never scheduled — this flag is how it gets its events. No flag is filed when nothing was written.

*Why:* Wikipedia chapter lists are static once printed; only anchor progress past the table tells us a new volume exists.

- ruled session 2026-08-23 (data-pipeline §11 refresh cadence 'refresh-afg' bullet; freshness map row 'Wikipedia')
- layer **writer**
- enforced: [lib/anchors.ts#VOLUME_STALE_MARGIN](../scripts/ingest/lib/anchors.ts) · [lib/anchors.ts#syncAnchors](../scripts/ingest/lib/anchors.ts) · [volumes-backfill.ts#main](../scripts/ingest/volumes-backfill.ts)
- **audit: none — automation backlog**
- aliases: volumes-staleness event, VOLUME_STALE_MARGIN, event-driven validation tier
- see: V5, V7

### V9 · A volume spans its start to the next volume's start − 1

A Wikipedia volume boundary N spans [its first chapter start .. the next volume's first start − 1]; the final volume stays open (null end). A boundary's end is therefore derived, never parsed — which is why a single bad start corrupts every later row (V1).

*Why:* The derived-end shape is what makes the monotonic-start gate necessary and what the heal re-closes.

- ruled session 2026-08-23 (lib/wikipedia.ts header / boundariesWithDrops)
- layer **writer**
- enforced: [lib/wikipedia.ts#boundariesWithDrops](../scripts/ingest/lib/wikipedia.ts)
- audit: `boundaries_degenerate`
- aliases: boundary span definition, volume span
- see: V1, V2

### V10 · A verdict's volume is the END chapter's volume

The volume on a research anchor is the volume of its END chapter, read from the boundaries in the context file; only when the context carries none does the agent read Wikipedia's chapter list. A verdict volume that disagrees with stored Wikipedia boundaries WARNs at apply.

*Why:* Consistent across the batch-14..17 protocols; the apply order guard cross-checks it.

- ruled session 2026-08-23 (batch-14 PROTOCOL 'What to research')
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [.claude/skills/apply-batch/SKILL.md](../.claude/skills/apply-batch/SKILL.md)
- **audit: none — automation backlog**
- aliases: volume = END's volume, verdict volume
- see: V3, full-record protocol, A18

## R — Research protocol

### R1 · Research first — nothing reaches Sean unresearched

Flags and source disagreements are never presented to Sean as raw numbers. Web research (search, wikis, community threads) runs FIRST; what reaches Sean is a cited verdict he can evaluate in one read — what the episode actually adapts, which source was right and why, links.

*Why:* Beelzebub's "disagreement" was a cancelled-ending rearrangement neither source captured; HxH's chart cell counted a one-scene gag reference as coverage. Both were decisive in one web pass.

- ruled Sean 2026-08-23 (data-pipeline §11 research tier; CLAUDE.md hard invariants #5)
- layer **process**
- enforced: [CLAUDE.md](../CLAUDE.md) · [.claude/skills/consolidate/SKILL.md](../.claude/skills/consolidate/SKILL.md) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- **audit: none — automation backlog**
- witnesses: beelzebub, hunter-x-hunter
- aliases: invariant 5, hard invariant 5, research-first rule, RESEARCH-FIRST rule, Sean's accuracy directive, nothing reaches Sean unresearched
- see: R2, R3, R5

### R2 · Ties and oddities escalate to research, never to precedence

Derived writers (AFG chart, AFG continua, MU) can be wrong in ways only prose knowledge catches — partial adaptations, timeline rearrangement, gag references. A tie or oddity between writers escalates to research; no blanket writer-precedence rule resolves it.

*Why:* Beelzebub and HxH: a precedence rule would have picked a wrong source confidently; research found neither source had the fact.

- ruled Sean 2026-08-23 (data-pipeline §11 "RESEARCH-FIRST rule" paragraph)
- layer **process**
- enforced: [docs/data-pipeline.md](../docs/data-pipeline.md) · [.claude/skills/research-batch/SKILL.md](../.claude/skills/research-batch/SKILL.md)
- **audit: none — automation backlog**
- witnesses: beelzebub, hunter-x-hunter
- aliases: ties escalate to research, no blanket precedence rule
- see: R1

### R3 · Two or more independent sources per anchor, with URLs

Every anchor a verdict delivers rests on 2+ INDEPENDENT sources, each cited by URL in the anchor. Sources that share lineage are one source: animefillerguide often mirrors fandom, so key boundaries are corroborated with a genuinely independent third — episode↔chapter TITLE matches and Wikipedia volume boundaries are strong independents.

*Why:* The research half of hard invariant 5; the lineage clause exists because AFG and fandom agreeing proved nothing on key boundaries.

- ruled Sean 2026-08-23 (data-pipeline §11 research tier + §12.19c; CLAUDE.md hard invariants #5)
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [.claude/agents/verdict-verifier.md](../.claude/agents/verdict-verifier.md)
- **audit: none — automation backlog**
- aliases: 2+ sources, ≥2 sources, two-source rule, 2+ independent sources per anchor
- see: R1, R5, R6, R17, G31

### R4 · Instant answers, AI summaries, content farms: cross-check

Instant-answer boxes, AI summaries and content-farm episode pages are cross-check inputs only — never primary, never a citation on their own, never one of the two sources R3 requires.

*Why:* The r/OshiNoKo ratio thread (= Google AI's instant answer) was systematically wrong for eps 15-22 and all of S3; animeoshi.com gave Beastars ep 44 S2 chapters. Both contradicted two-source records.

- ruled Sean 2026-08-23 (data-pipeline §12.32, §12.38; CLAUDE.md hard invariants #5)
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [.claude/agents/verdict-verifier.md](../.claude/agents/verdict-verifier.md)
- **audit: none — automation backlog**
- witnesses: oshi-no-ko, beastars
- aliases: cross-check only, Oshi no Ko rule, discredited sources
- see: R3, R5

### R5 · Fan mapping threads are first-class, never alone

Episode↔chapter fan threads ("where do I continue the manga after ep N") are a first-class verification source — cited, used for cross-checks — but never the sole basis of an anchor: they carry judgment calls at split chapters and go stale at finales. Two agreeing citations beat one instant answer.

*Why:* The r/OshiNoKo thread ended ep 35 at ch 122; Wikipedia, fandom, dexerto and mystiqora agree the 1-hr finale runs to mid-ch-127, which Sean confirmed.

- ruled session 2026-08-23 (data-pipeline §11 "Fan mapping threads are a first-class verification source")
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [docs/data-pipeline.md](../docs/data-pipeline.md)
- **audit: none — automation backlog**
- witnesses: oshi-no-ko
- aliases: fan mapping threads, fan threads first-class
- see: R3, R4

### R6 · Wikis are read through the MediaWiki API, never HTML

Fandom and Wikipedia pages are fetched through the MediaWiki API (api.php?action=parse|query, prop=wikitext) — never by scraping HTML. Episode pages carry the forward mapping; chapter pages carry the REVERSE mapping and are a standing cross-check.

*Why:* Fandom HTML is Cloudflare-blocked; scraped HTML also loses the infobox fields that carry the chapter data.

- ruled session 2026-08-23 (data-pipeline §11 apply-script contract ("Fandom wikis fetched via api.php"))
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md)
- **audit: none — automation backlog**
- aliases: MediaWiki API not HTML, api.php rule, fandom via API
- see: R7

### R7 · Look for a second wiki and the reverse index

Before concluding a per-episode source does not exist, look for a second wiki or a reverse index: franchises often have two fandom wikis of different quality, arc pages can carry page-level citations episode infoboxes lack, and character-page appearance fields form a usable reverse index.

*Why:* zatch-bell: konjikinogash.fandom carries per-episode manga_chapter fields the main wiki lacks; one-piece ARC pages carry {{Qref|chap|page|ep}} citations; hokuto.fandom has no episode pages but appearances fields index chapters.

- ruled session 2026-08-25 (research-agent definition "Look for a second wiki"; CHUNK1-RECOVERY new source traps)
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- **audit: none — automation backlog**
- witnesses: zatch-bell, one-piece, fist-of-the-north-star
- aliases: second wiki, second-wiki habit, look for a second wiki
- see: R6, R3

### R8 · Every anchor delivered carries the FULL record

For each anchored episode a verdict delivers the complete shape, never just an end: END (running order), START (sliver rule), chapters_adapted (R9), volume of the END chapter, a continue point where it differs from END+1 (C1/C2/C3), non-linear annotations (R10), and — where warranted — type_corrections (R11) and repairs (R12).

*Why:* Pre-full-record batches delivered ends only; interpolation then painted plausible-but-wrong starts and continue points across every span.

- ruled Sean 2026-08-23 (data-pipeline §10 "Full adaptation record" + §11 BATCH PROTOCOL agent contract)
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- **audit: none — automation backlog**
- aliases: full-record model, full adaptation record (agent contract), agent contract
- see: A30, R10, R11, R12, END = running order, sliver rule, C1, C2, C3, volume = END's volume

### R10 · Non-linear facts: the annotation kind vocabulary

A verdict records non-linear facts as annotations with kind ∈ rearranged | graft | partial | divergence | side_story | loose_parallel | abridged, the episodes and chapters involved, and a one-line why. A loose_parallel or divergence annotation is a better deliverable than a fabricated anchor for a range that proves anime-original.

*Why:* The asterisk model: what an asterisk entails derives from per-episode annotations by aggregation, so the kinds must be a closed vocabulary the display can aggregate.

- ruled session 2026-08-23 (batch14 PROTOCOL line 15; batch17 PROTOCOL "What to research")
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md)
- audit: `asterisk_unreviewed`
- aliases: annotation kind vocabulary, annotation kinds
- see: R8, R13, A43

### R11 · type_corrections need 2+ sources and per-episode evidence

A type correction (canon | mixed | filler | anime-only-canon) is delivered only with 2+ sources and POSITIVE per-episode evidence of what the episode contains. Exhaustive chapter accounting ("every chapter is already claimed elsewhere") is an anchoring aid, not a typing proof. AFL/AFG typings are starting principles, never verdicts.

*Why:* zatch-bell: ten episodes were typed filler by accounting alone; re-research under the overlap rule split them 5 filler / 5 mixed.

- ruled session 2026-08-23 (batch14 PROTOCOL line 16; lib/resolve.ts zatch-bell comment; batch17 PROTOCOL)
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [lib/resolve.ts#EPISODE_TYPE_OVERRIDES](../scripts/ingest/lib/resolve.ts)
- **audit: none — automation backlog**
- witnesses: zatch-bell
- aliases: type_corrections ≥2 sources, type corrections two sources
- see: R8, overlap rule, zatch-bell lesson, episode-type semantics, A1

### R12 · Repairs are explicit — old, new, evidence — never silent

If an existing stored value in the context file is wrong, the verdict says so as a `repairs` entry with episode, field, old, new, why and sources. A verdict never silently contradicts stored data, and never overwrites a prior applied record by restating it differently.

*Why:* Silent contradictions are invisible to curation; the apply layer can only call out a REPAIR it was told about. (The manual-tier landing of an applied repair is invariant 7, family S/P.)

- ruled session 2026-08-23 (batch14 PROTOCOL line 17; research-agent definition "The bar")
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [history/apply-research-batch-17.ts#REPAIRS_APPROVED](../scripts/ingest/history/apply-research-batch-17.ts)
- **audit: none — automation backlog**
- witnesses: hikaru-no-go
- aliases: repairs never silent, never silently contradict stored data, repairs with old/new
- see: R8, R24, invariant 7, curation principle

### R13 · An honest gap beats a plausible guess

If the evidence does not support an anchor, the verdict says so and states what was checked. `zone_level_only` — the best zone-level bound, what was tried, what source would settle it — is a legitimate deliverable; a fabricated chapter number is a defect that outlives the agent in the data.

*Why:* The product promise, agent-facing. magic-knight-rayearth delivered an honest 3-anchor record instead of an invented 5/5/5 split; GTO ep 20 showed ~68 while the annotation knew 73-74.

- ruled Sean 2026-08-24 (batch15 PROTOCOL mission item 2; research-agent definition "The bar")
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [history/apply-research-batch-15.ts](../scripts/ingest/history/apply-research-batch-15.ts)
- audit: `rearranged_zone_acknowledged`, `rearranged_zone_unanchored`
- witnesses: magic-knight-rayearth, gto-great-teacher-onizuka
- aliases: honest gap > guess, honest gap beats a plausible guess, zone_level_only, zone-level only
- see: R14, R16, A2

### R14 · Density: every episode when cheap, else boundaries + 3–5

Anchor every canon/mixed episode when a source states it cheaply (a wiki with per-episode chapter fields = take them all); otherwise at least every arc/season boundary and every 3–5 episodes, each with honest confidence. For 100+ episode targets a checkpoint lattice is acceptable: every arc boundary + every ~10 episodes, densest where the adaptation is non-linear.

*Why:* b14 said "every episode when sources allow"; b17 added the cheapness qualifier and the lattice after long-series agents burned budget on uniform coverage. b17 is the standing form.

- ruled session 2026-08-24 (batch17 PROTOCOL mission "Density rule" (supersedes batch14 line 46))
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md)
- audit: `anchor_gap_research`
- aliases: density rule, anchor density, checkpoint lattice
- see: R15, R13

### R15 · Season/arc boundary anchors are the most load-bearing

The first and last episode of every season/arc get exact anchors — END, START and volume — before interior density is pursued. Run-end endpoints are equally load-bearing: coverage, continue-read and the tail all derive from them.

*Why:* Replacing ippo's mu 558 pin with the honest ep-127 record flattened eps 105-123 via the coverage clamp — boundary values propagate across whole spans.

- ruled session 2026-08-24 (batch17 PROTOCOL mission; data-pipeline §11 "Relocated openers" bullet)
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md)
- audit: `frontier_tail_null`, `stale_anchor_no_frontier`
- witnesses: hajime-no-ippo-the-fighting
- aliases: boundary anchors, boundary anchors most load-bearing
- see: R14, A4

### R16 · Confidence vocabulary: high / medium, nothing else

Every anchor carries confidence `high` = 2+ independent sources agree on the exact chapter, or `medium` = a single strong source, or an arc-span derivation. Medium anchors are still delivered (interpolation is worse) and marked honestly. There is no `low`.

*Why:* DRIFT across protocols on what medium means: b14 "arc-span interpolation", b15/b16 "event-level derivation", b17 "arc-span derivation". b17 is the standing definition; the b15/b16 form is the same class by a different name.

- ruled session 2026-08-23 (batch14 PROTOCOL "Confidence"; batch17 PROTOCOL "Confidence")
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [history/apply-research-batch-17.ts](../scripts/ingest/history/apply-research-batch-17.ts)
- **audit: none — automation backlog**
- aliases: confidence vocabulary, high/medium, confidence high medium
- see: R3, R17

### R17 · Disagreements: resolve, else better-supported, medium, flag

When sources disagree the agent researches until resolved. If unresolved, the verdict carries the better-supported value at `medium` and a `flags_for_sean` entry describing the disagreement with links — never a silent pick, never a raw number.

*Why:* The verdict-side half of research-first: what Sean sees is the disagreement with evidence, in the flag, not two numbers.

- ruled session 2026-08-23 (batch14 PROTOCOL "Confidence"; batch17 PROTOCOL "Confidence")
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [history/apply-research-batch-14.ts](../scripts/ingest/history/apply-research-batch-14.ts)
- **audit: none — automation backlog**
- aliases: disagreement handling, flags_for_sean, unresolved disagreement
- see: R16, R1

### R18 · The agent converts into OUR cumulative episode space

Verdict episode numbers are OUR cumulative numbering (the context file's), never a source's per-season or OVA-inclusive count. Converting is the agent's job; every conversion is stated in the verdict, and a source whose count includes OVAs/specials is flagged. Chapter values likewise sit in the chapter-NUMBER space of the context file, with any conversion stated.

*Why:* Research anchors arrive in external numbering (MAL/Wikipedia season counts); a mid-run numbered OVA shifts every later episode. cobra ep 31 "14" was a story count → 76; rayearth ep 49 was count-space 15 in a 14-space.

- ruled Sean 2026-08-23 (data-pipeline §10 "Anchor numbering conversion (Sean 2026-08-23)"; batch17 PROTOCOL "Read first" + "Numbering")
- layer **process**
- enforced: [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [research/batch17/context.ts](../scripts/ingest/research/batch17/context.ts)
- audit: `anchor_beyond_display_total`, `frontier_tail_null`
- witnesses: space-adventure-cobra, magic-knight-rayearth
- aliases: numbering conversion is the agent's job, our cumulative numbering, OVA-inclusive sources flagged
- see: Anchor numbering conversion, Tokyo Ghoul rule, Ryuusui lesson, R19

### R19 · Row-count identity before trusting any per-episode source

Before any per-episode source is joined to our rows, the agent checks that it counts recaps/specials the way our rows do and that its table is complete — a one-row shift or a truncated table poisons every later join. An absent tail is not a typing claim.

*Why:* mashle's recap is AFL's integer ep 7 but fandom's "6.5" — every AFG anchor at eps 8-12 landed one row early; AFL's sket-dance table stops at ep 54; rurouni AFG counts 95 eps vs our 100 rows.

- ruled session 2026-08-24 (CHUNK1-RECOVERY "New source traps this wave"; research-agent definition)
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [research/batch17/CHUNK1-RECOVERY.md](../scripts/ingest/research/batch17/CHUNK1-RECOVERY.md)
- **audit: none — automation backlog**
- witnesses: mashle-magic-and-muscles, sket-dance, rurouni-kenshin
- aliases: row-count identity first, row-count identity
- see: R18, R20, fractional in-between entries

### R20 · Research never index-joins a chart — join on title or date

A verdict never keys a per-episode chart to our rows by position. Chart row order is inconsistent (production order in some zones, aired in others) and our rows are not always aired order either; join on normalized TITLE (or air date) per row, and expect zones where two errors cancel so a "correct" stored value is two wrongs.

*Why:* ranma: the wave-1 verdict's aired-number re-anchor would have corrupted eps 15-30 and 153 (caught by the cross-model verifier); ep 18 was accidentally correct. Writer side: `syncAnchors` is still an index join behind a ±12 alignment gate — a title-join (or refusing pages whose order ≠ ours) is `/add-rule` BACKLOG (DRIFT-LIST §A-4), not part of this rule.

- ruled Sean 2026-08-25 (data-pipeline §12.45; CHUNK1-RECOVERY "Amended source trap"; DRIFT-LIST §A-4)
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [research/batch17/CHUNK1-RECOVERY.md](../scripts/ingest/research/batch17/CHUNK1-RECOVERY.md)
- **audit: none — automation backlog**
- witnesses: ranma-1-2
- aliases: A-4, never index-join, title-join rule, index-join rule, join on title
- see: R19, R24, I30

### R21 · Verdict: one JSON per series, exact shape, data not prose

Research output is DATA a script applies: exact, everything cited, nothing guessed. The agent writes exactly ONE JSON per series at the path it is given — series_id, summary, anchors[], continue_points[], annotations[], type_corrections[], repairs[], structure, flags_for_sean[] — valid and complete before finishing. The final message is a 5–10 line summary for the curator (anchors count + range, confidence mix, repairs, structure findings, unresolved items); the JSON is the deliverable.

*Why:* Artifacts are the handoff: a verdict on disk survives model, account and limit events; a summary in conversation does not.

- ruled session 2026-08-23 (batch14 PROTOCOL preamble + "Output" + "Finish"; research-agent definition "Output")
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [.claude/skills/research-batch/SKILL.md](../.claude/skills/research-batch/SKILL.md)
- **audit: none — automation backlog**
- aliases: verdict JSON shape, one JSON per series, verdict deliverable, protocol preamble
- see: R8, R22, artifacts are the handoff

### R22 · Agent scope: one target, read-only, own scratchpad

A research agent researches ONE target and produces ONE verdict. It reads the batch protocol and its context file (CURRENT stored state, plus adjacent prior verdicts where named) in full before anything, never touches the database, never commits, edits no repo file except the verdict JSON, and keeps every scratch file in the per-task scratchpad subdirectory it is given — never a shared path.

*Why:* Parallel agents on a shared scratchpad have corrupted each other's work; an agent that has not read current state silently contradicts it.

- ruled session 2026-08-24 (research-agent definition; batch16/17 PROTOCOL "Operational")
- layer **process**
- enforced: [.claude/agents/research-agent.md](../.claude/agents/research-agent.md) · [research/batch17/PROTOCOL.md](../scripts/ingest/research/batch17/PROTOCOL.md) · [.claude/skills/research-batch/SKILL.md](../.claude/skills/research-batch/SKILL.md)
- **audit: none — automation backlog**
- aliases: research-agent contract, per-task scratchpad, agent is read-only
- see: R21, R12

### R23 · Weight-bearing verdicts get cross-model verification

A verdict that carries unusual weight — a whole-series structure claim, a reorder regime, a repair contradicting stored data, a re-anchor proposal — is run through `verdict-verifier` on a DIFFERENT model than authored it before it is applied. Same-model re-reading does not satisfy this.

*Why:* Models fail differently; the Fable-over-Opus pass caught ranma's aired-number re-anchor (R20) that a same-model second pass had not.

- ruled Sean 2026-08-24 (research-batch skill §5 "Verification tier"; CHUNK1-RECOVERY §7 verifier candidates; CLAUDE.md model policy)
- layer **process**
- enforced: [.claude/skills/research-batch/SKILL.md](../.claude/skills/research-batch/SKILL.md) · [.claude/agents/verdict-verifier.md](../.claude/agents/verdict-verifier.md)
- **audit: none — automation backlog**
- witnesses: ranma-1-2, sket-dance, a-certain-scientific-railgun, mashle-magic-and-muscles
- aliases: verification tier, verify pass, verifier on weight-bearing verdicts, cross-model verification, verify pool
- see: R24, R25, R20

### R24 · Verifier: a skeptic who hunts by damage and reports evidence

The verifier writes no verdicts and changes no files. It hunts in damage order: (1) internal contradiction — summary vs rows, chapters_adapted vs end_chapter; (2) anchors beyond their cited evidence, spot-checked by fetching; (3) monotonicity — real reorder vs transcription error; (4) A1 violations; (5) scope leakage; (6) citation quality. Each finding names the file, the claim, why it is unsupported and what evidence would settle it; a sound verdict is reported as sound — inventing a finding is worse than finding nothing.

*Why:* The worst shipped defect was a self-consistent episode block ten chapters off, caught only because one row's chapters_adapted disagreed with its end_chapter; railgun ep 14 was "as-stored" confirmation-laundering found by the verifier reading the apply script.

- ruled Sean 2026-08-24 (verdict-verifier definition)
- layer **process**
- enforced: [.claude/agents/verdict-verifier.md](../.claude/agents/verdict-verifier.md)
- **audit: none — automation backlog**
- witnesses: a-certain-scientific-railgun
- aliases: verdict-verifier contract, verifier hunt order, verifier report format, skeptic not second author
- see: R23, R25, A1, scope leakage

### R25 · Every landed verdict gets a mechanical self-consistency scan

Before curation, every verdict is scanned by script, not by eye: it parses, carries series_id, has no duplicate episodes, every row's chapters_adapted agrees with its end_chapter, its summary agrees with its rows, its anchors are A1-consistent with its own type_corrections, and END monotonicity is checked against declared reorders. Self-consistent-but-wrong is the failure mode that has actually shipped.

*Why:* Hard invariant 3 applied to verdicts: a model must never re-derive what a script can assert. The practiced scan (CHUNK1 §7) is wider than the skill text; this record carries the practiced form.

- ruled session 2026-08-24 (research-batch skill §4 step 2; CHUNK1-RECOVERY §7)
- layer **process**
- enforced: [.claude/skills/research-batch/SKILL.md](../.claude/skills/research-batch/SKILL.md) · [research/batch17/CHUNK1-RECOVERY.md](../scripts/ingest/research/batch17/CHUNK1-RECOVERY.md)
- **audit: none — automation backlog**
- aliases: contradiction scan, verdict self-consistency, summary-vs-rows scan
- see: R24, R26, checkpoint steps

### R26 · Orphaned verdicts get the scan plus one extra look

A verdict file from an agent that died before its final summary never received the agent's own closing self-check: it gets the standard mechanical scan (R25), a DB spot-check, and one extra review before it is curated into any apply map.

*Why:* Chunk 1 of batch 17: four A1 verdict files survived an agent killed by the spend limit mid-flight.

- ruled session 2026-08-24 (CHUNK1-RECOVERY §2 "Verification debt")
- layer **process**
- enforced: [research/batch17/CHUNK1-RECOVERY.md](../scripts/ingest/research/batch17/CHUNK1-RECOVERY.md) · [.claude/skills/research-batch/SKILL.md](../.claude/skills/research-batch/SKILL.md)
- **audit: none — automation backlog**
- witnesses: cardcaptor-sakura, inuyasha, slam-dunk, hunter-x-hunter
- aliases: orphaned-verdict review, verification debt
- see: R25, R23

### R27 · Audit-class hits run as a lightweight per-episode lane

An `anchor_on_noncanon_row` hit is researched as a per-episode triage question — is the row really filler/anime-only, or is the anchor junk? — with 2+ citations, never as full-series mapping. Gap/tail/mu-pin queues select for MISSING data, so an audit class must be its own work-list or well-anchored series never surface.

*Why:* The batch-17 A1 lane: 49 hits adjudicated 45 junk / 4 mistyped, which decided D4; none of those series would have entered a gap-tier queue.

- ruled Sean 2026-08-24 (data-pipeline §12.43 "A1-TRIAGE LANE")
- layer **process**
- enforced: [.claude/skills/research-batch/SKILL.md](../.claude/skills/research-batch/SKILL.md) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- audit: `anchor_on_noncanon_row`
- witnesses: one-piece, dragon-ball-z, ranma-1-2, fist-of-the-north-star, cardcaptor-sakura
- aliases: A1-triage lane, triage lane
- see: A1, D4, R28

### R28 · A gate is never decided on a small sample

A lane whose verdict distribution decides a rule or gate decides it only when the lane is complete. An early signal is noted with its count and re-read after the rest lands; it is never acted on, however one-directional it looks.

*Why:* D4: 5 of 5 early A1 hits were junk anchors — including cardcaptor ep 7, the case singled out as likeliest mistyped — while the one-piece agent was already finding filler-typed rows carrying sliver adaptations. The full 49 decided it.

- ruled session 2026-08-24 (CHUNK1-RECOVERY §3 "EARLY D4 SIGNAL"; data-pipeline §12.44)
- layer **process**
- enforced: [research/batch17/CHUNK1-RECOVERY.md](../scripts/ingest/research/batch17/CHUNK1-RECOVERY.md) · [.claude/skills/research-batch/SKILL.md](../.claude/skills/research-batch/SKILL.md)
- **audit: none — automation backlog**
- witnesses: cardcaptor-sakura, one-piece
- aliases: D4 early signal, early D4 signal, small-sample rule, do not decide on 5 of 49
- see: R27, D4

### R29 · Reorder regimes rest on verdict-documented jumps

A series is listed in REORDER_REGIMES only for pervasive reorder the verdict documents, and every regime annotation derives from an anchor that actually jumps — per episode, matching a jump the verdict describes — never a blanket claim over a season.

*Why:* REORDER_REGIMES is a WAIVER of the order guard; it once turned a corrupted verdict into a "ruled" annotation that looked legitimate.

- ruled session 2026-08-24 (batch17 DECISIONS-FOR-SEAN "Applied without needing you"; apply-batch skill trap "Regime maps launder bad data")
- layer **process**
- enforced: [history/apply-research-batch-17.ts#REORDER_REGIMES](../scripts/ingest/history/apply-research-batch-17.ts) · [.claude/skills/apply-batch/SKILL.md](../.claude/skills/apply-batch/SKILL.md)
- audit: `anchor_nonmonotonic`
- witnesses: detective-conan, hayate-the-combat-butler, sket-dance
- aliases: REORDER_REGIMES listing rule, regime annotations from real jumps, REORDER_REGIMES laundering
- see: R23, A20, A3

### R30 · Verdicts cite the rule ids they applied (planned) *(planned)*

Every verdict carries `rules_applied[]`: the ledger ids applied in its decidable situations (anchor on a filler/anime-only row → A1; mid-chapter continue → C1; parity continue → C2; skip note → C3; …). The apply layer fails closed only on those listed situations when the citation is missing or contradicts the row.

*Why:* Four PROTOCOLs restated the same rules with drift; a citation makes the rule the agent actually used checkable by script instead of re-read by a model. Built in T3.2 with the PROTOCOL collapse.

- ruled Sean 2026-08-25 (restructure-plan §3 T3.2)
- layer **process**
- enforced: [docs/restructure-plan.md#T3.2](../docs/restructure-plan.md) · [.claude/agents/research-agent.md](../.claude/agents/research-agent.md)
- **audit: none — automation backlog**
- aliases: rules_applied, rules_applied[], verdict cites rule ids
- see: R21, R31, A1, C1, C2, C3

### R31 · The PROTOCOL is pinned for an in-flight batch (planned) *(planned)*

An in-flight batch runs against ONE protocol version, pinned by hash at dispatch; a protocol edit mid-batch applies to the next batch, and every verdict names the pin it was produced under.

*Why:* Batch 16 and 17 both ran under text headed "Sean's rulings 2026-08-24" that said different things about the continue point. The plan (§1, §3 T3.2) files this as a P-rule; recorded here because a verdict must cite its pin — the merge decides the home.

- ruled Sean 2026-08-25 (restructure-plan §3 T3.2)
- layer **process**
- enforced: [docs/restructure-plan.md#T3.2](../docs/restructure-plan.md) · [.claude/skills/research-batch/SKILL.md](../.claude/skills/research-batch/SKILL.md)
- **audit: none — automation backlog**
- aliases: PROTOCOL pin, protocol pinned, pinned protocol
- see: R30, R21, artifacts are the handoff

## P — Process & pipeline

### P1 · The data cycle, seven steps run in order

All data work runs the seven steps in order — plan (work-list recomputed from disk, wave sized 6–8), research (research-agent subagents under the batch protocol), verify (a different model than authored), rule (Sean decides), apply (/apply-batch), consolidate (/consolidate, deep when a rule changed), capture (route every learning to a durable home). No step is skipped because the work seems small; each step ends by naming the next.

*Why:* The skipped step is where drift enters — batch 17 was recovered from a spend-limit kill only because its artifacts and checkpoints existed.

- ruled Sean 2026-08-24 (CLAUDE.md "The data cycle" (2026-08-24))
- layer **process**
- enforced: [CLAUDE.md#The data cycle](../CLAUDE.md) · [.claude/skills/research-batch/SKILL.md](../.claude/skills/research-batch/SKILL.md) · [.claude/skills/apply-batch/SKILL.md](../.claude/skills/apply-batch/SKILL.md) · [.claude/skills/consolidate/SKILL.md](../.claude/skills/consolidate/SKILL.md)
- **audit: none — automation backlog**
- aliases: the data cycle, data cycle, the cycle
- see: P10, P11, P12, P13, R23, P15, P20, P28, P29, P36

### P2 · Rules live in shared lib code, never inline at a call site

Every rule is implemented once in scripts/ingest/lib/ and consumed identically by scripts and edge functions. A predicate used by both a healer and an audit lives once. A writer found without the shared gate is wired through the lib, never patched inline.

*Why:* The c3 healer (§12.46): the first unpaged healer stamped 16 rows and 7 were wrong — the audit caught its own author because the predicate lived once. Several batch apply scripts still enforce §10 rules inline (sliver, running-order END) — the drift this invariant exists to end.

- ruled Sean 2026-08-23 (CLAUDE.md Hard invariants #1; consolidate skill principle (2026-08-23))
- layer **process**
- enforced: [CLAUDE.md#Hard invariants](../CLAUDE.md) · [.claude/skills/consolidate/SKILL.md#Writer-consistency sweep](../.claude/skills/consolidate/SKILL.md) · [lib/c3.ts](../scripts/ingest/lib/c3.ts)
- audit: `ruling_violation`
- aliases: invariant 1, hard invariant 1, rules live in lib, every-writer rule
- see: P3, P5, P17

### P3 · Any lib/ change → rebuild and deploy all four edge functions

If anything under scripts/ingest/lib/ changed since the last deploy, run build-functions.ts and deploy refresh-afl, refresh-afg, refresh-anilist and refresh-mu — all four, never a subset. The crons must run the same code as the scripts. The supabase/functions/*/index.ts bundles are generated and never hand-edited.

*Why:* Forgetting this has shipped silent drift: the crons kept running a lib the scripts had already moved past. CHUNK1-RECOVERY §12 records the D4 gate going live "in all four edges" as the closing check.

- ruled Sean 2026-08-23 (CLAUDE.md Hard invariants #2; consolidate skill §2 (2026-08-23))
- layer **process**
- enforced: [build-functions.ts](../scripts/ingest/build-functions.ts) · [.claude/skills/consolidate/SKILL.md#Lib → edges](../.claude/skills/consolidate/SKILL.md) · [.claude/skills/apply-batch/SKILL.md#A missed edge deploy ships silent drift](../.claude/skills/apply-batch/SKILL.md)
- **audit: none — automation backlog**
- aliases: invariant 2, hard invariant 2, lib → four edges, lib → edges, missed edge deploy
- see: P2, P4

### P4 · Edge bundles carry the lib content hash

build-functions.ts stamps the content hash of scripts/ingest/lib/ into each edge bundle; every refresh run logs the hash it ran under; the system census compares the deployed hash to the lib on disk and reports any edge running stale code. Invariant 2 becomes mechanically checkable.

*Why:* Invariant 2 is enforced only by memory today ("edge bundles ≠ lib hash: unchecked" on the restructure scoreboard).

- ruled Sean 2026-08-26 (docs/restructure-plan.md §3 T2.6)
- layer **process**
- enforced: [lib-hash.ts#libHash](../scripts/ingest/lib-hash.ts) · [build-functions.ts](../scripts/ingest/build-functions.ts) · [scripts/restructure/system-census.ts](../scripts/restructure/system-census.ts)
- **audit: none — automation backlog**
- aliases: edge hash, lib-hash stamp, T2.6
- see: P3, P32

### P5 · Audits verify OUTCOMES; mechanical checks are mandatory

A misbehaving writer must surface as data (audit-ui-truth.ts), whichever code path misbehaved. If a rule can be checked mechanically it MUST be — an audit class, a census delta or a verifier run settles it, and a model never re-derives what a script can assert. Research is for what only sources can answer.

*Why:* Model tokens spent re-deriving what audit-ui-truth.ts already asserts are wasted permanently; the ruling_violation class exists so a writer that forgets a shared gate is caught outcome-side.

- ruled Sean 2026-08-23 (CLAUDE.md Hard invariants #3; §12.21 consolidation pass 2 (ruling_violation))
- layer **process**
- enforced: [audit-ui-truth.ts#ruling_violation](../scripts/ingest/audit-ui-truth.ts) · [.claude/skills/research-batch/SKILL.md#When research is the wrong tool](../.claude/skills/research-batch/SKILL.md) · [.claude/skills/consolidate/SKILL.md#Census](../.claude/skills/consolidate/SKILL.md)
- audit: `ruling_violation`
- aliases: invariant 3, hard invariant 3, audits verify outcomes, outcome-check pattern, script before model
- see: P2, P17, P18, P29

### P6 · Incomplete data degrades gracefully — never NaN

Where data is incomplete the display shows pending, hides the element, or renders an honest dash or open band ("48-60+"). No position, count or tail is ever fabricated, and NaN never reaches the screen. An honest gap beats a plausible guess.

*Why:* The product promise is that a position shown to a user is TRUE; the tail-honesty and coverage gates in assemble.ts exist so sparse coverage never fabricates a manga-only tail.

- ruled Sean 2026-08-23 (CLAUDE.md Hard invariants #4; consolidate skill §7 (2026-08-23))
- layer **display**
- enforced: [src/lib/mapping.ts](../src/lib/mapping.ts) · [src/data/catalog/assemble.ts](../src/data/catalog/assemble.ts) · [.claude/skills/consolidate/SKILL.md#Frontend contract](../.claude/skills/consolidate/SKILL.md)
- audit: `verify:fail`
- aliases: invariant 4, hard invariant 4, graceful degradation
- see: P18, A4

### P8 · Repairs live at the manual tier

A repaired value is a RESEARCHED value. Derivation-tier rows (source mu, afg, afg-continua) are wipe-and-re-derive by contract, so an approved repair on such a row rewrites its source to manual on application; research-tier sources keep their provenance. A repair left on a derivation-tier row is deleted by that source's next re-derive.

*Why:* hikaru-no-go ep 75's 166→148 repair sat on a mu row and the first gated frontier pass wiped it back to 166 (2026-08-24). Batches 15/16 never promoted repaired rows — DRIFT-LIST §E.6 asks the census whether any still stand.

- ruled Sean 2026-08-24 (data-pipeline §10 "Curated repairs live at the MANUAL tier (2026-08-24, the hikaru ep-75 wipe)"; §12.43)
- layer **writer**
- enforced: [history/apply-research-batch-17.ts#REPAIRS_APPROVED](../scripts/ingest/history/apply-research-batch-17.ts) · [.claude/skills/apply-batch/SKILL.md#Repairs on derivation-tier rows get wiped](../.claude/skills/apply-batch/SKILL.md) · [.claude/skills/consolidate/SKILL.md#derivation-tier rows](../.claude/skills/consolidate/SKILL.md)
- audit: `repair_on_derivation_tier`
- witnesses: hikaru-no-go, mashle-magic-and-muscles
- aliases: invariant 7, hard invariant 7, repairs live at the manual tier, hikaru ep-75 wipe, hikaru lesson
- see: P10, P31

### P9 · No one-offs, no hacks, no permanent escape hatches

If a fix would only work for one series it is the wrong fix — prefer the rule. New pending classes get rules, never per-series patches; a new data source enters through the same repeatable mechanism or not at all. The sanctioned exception shape is a declarative per-series record carrying its reasoning and its retiring condition.

*Why:* The 2026-08-22 new-source checklist ("no one-offs, ever") and the coverage audit's "new pending classes get RULES, never per-series fixes" are the same directive; MU_FRONTIER_SUPPRESSED is the exception shape done right.

- ruled Sean 2026-08-22 (CLAUDE.md Hard invariants #8; data-pipeline §11 new-source checklist (2026-08-22))
- layer **process**
- enforced: [CLAUDE.md#No one-offs](../CLAUDE.md) · [.claude/skills/consolidate/SKILL.md#Writer-consistency sweep](../.claude/skills/consolidate/SKILL.md)
- **audit: none — automation backlog**
- aliases: invariant 8, hard invariant 8, no one-offs, no one-offs, ever
- see: P2, P29

### P10 · Sean rules: the curated map decides, not the agent

Step 4 is Sean's. The approval maps in the apply script (REPAIRS_APPROVED, DELETIONS_APPROVED, BOUNDARY_SEEDS, CURATED_ZONE_ACK, CURATED_ANNOTATIONS, CURATED_CONTINUES) are the ruling record, each entry carrying its reasoning inline. A verdict can be sound and still be answered with something other than what it proposed. Anything an agent proposes that is not in a curated map is REPORTED, not applied; the apply loop processes curated anchors FIRST so the map wins duplicate episodes over agent verdicts.

*Why:* Toriko ep 147 proposed 263→253 on a filler row — A1 forbids the anchor, so the answer was a DELETION with the honest terminal at ep 146. Rayearth's verifier-refuted END 14 was overridden by the curated ep-20 anchor at 15 (§12.51).

- ruled Sean 2026-08-24 (data-pipeline §12.42 (Toriko); apply-batch skill "The curation principle"; §12.51 (curated first))
- layer **process**
- enforced: [history/apply-research-batch-17.ts#DELETIONS_APPROVED](../scripts/ingest/history/apply-research-batch-17.ts) · [history/apply-research-batch-17.ts#curated anchors FIRST](../scripts/ingest/history/apply-research-batch-17.ts) · [.claude/skills/apply-batch/SKILL.md#The curation principle](../.claude/skills/apply-batch/SKILL.md)
- **audit: none — automation backlog**
- witnesses: toriko, magic-knight-rayearth
- aliases: Sean rules, the curated map decides, curation principle, curated-first apply, report, don't apply uncurated
- see: P1, P8, P25, A1, A6

### P11 · Artifacts are the handoff; batch state lives on disk

A verdict JSON, a context file, a protocol, a recovery record — these survive model switches, account switches and hard stops; conversation context does not. Batch state is never held only in a session: the work-list is recomputed from the filesystem every time (a prior session's list is a claim), contexts are regenerated per session because they capture CURRENT stored state, and a *-RECOVERY.md in the batch directory is read first.

*Why:* Batch 17's chunk 1 lost 17 of 19 agents to a spend limit; the 6 verdict files on disk and the recovery record were the only state that survived.

- ruled Sean 2026-08-24 (research-batch skill "The governing rule"; CLAUDE.md model policy (2026-08-24))
- layer **process**
- enforced: [.claude/skills/research-batch/SKILL.md#artifacts are the handoff](../.claude/skills/research-batch/SKILL.md) · [.claude/skills/research-batch/SKILL.md#Establish the work-list from disk](../.claude/skills/research-batch/SKILL.md) · [CLAUDE.md#Artifacts are the handoff](../CLAUDE.md)
- **audit: none — automation backlog**
- aliases: artifacts are the handoff, the governing rule, work-list from disk
- see: P12, P13, P28

### P12 · A wave is 6–8 agents, hard cap — the unit of loss

Dispatch 6 to 8 research-agents per wave, one agent per target, never more. Large passes run as weight-balanced chunks (by unanchored-episode load, not series count), each ending at a committed save point. The session's effort level is stated at dispatch. This is a loss-control number, not a performance number.

*Why:* 19 agents were dispatched once (batch 17 chunk 1, 2026-08-24) and a monthly spend limit killed 17 mid-flight.

- ruled Sean 2026-08-24 (data-pipeline §12.43/§12.44; research-batch skill §3; CLAUDE.md model policy)
- layer **process**
- enforced: [.claude/skills/research-batch/SKILL.md#Dispatch a wave — 6 to 8 agents, no more](../.claude/skills/research-batch/SKILL.md) · [CLAUDE.md#cap](../CLAUDE.md)
- **audit: none — automation backlog**
- witnesses: detective-conan
- aliases: wave cap, wave cap 6-8, 6–8 wave cap, two-chunk rule, a wave is the unit of loss
- see: P11, P13

### P13 · Land and checkpoint after every wave

After each wave and before the next: (1) validate every new verdict parses and carries series_id; (2) contradiction-scan each verdict's summary against its own rows mechanically; (3) commit the verdicts; (4) write or refresh the recovery record; (5) report usage and STOP for a decision — never roll into the next wave automatically, and hold dispatch while open forks await Sean. After an interruption, verify the database is untouched and the repo clean through a named commit before resuming.

*Why:* Uncommitted research is research at risk; self-consistent-but-wrong verdicts are the failure mode that has actually shipped (a ten-chapters-off block caught only by one row's chapters_adapted).

- ruled Sean 2026-08-24 (research-batch skill §4; CHUNK1-RECOVERY §1, §7, §11)
- layer **process**
- enforced: [.claude/skills/research-batch/SKILL.md#Land and checkpoint](../.claude/skills/research-batch/SKILL.md) · [research/batch17/CHUNK1-RECOVERY.md#STATE — nothing is half-applied](../scripts/ingest/research/batch17/CHUNK1-RECOVERY.md)
- **audit: none — automation backlog**
- aliases: checkpoint after every wave, land and checkpoint, checkpoint steps, held dispatch
- see: P11, P12, P15, P28

### P15 · The apply sequence: read, curate, dry-run, apply, verify

Apply runs in order: (1) READ the verdicts, do not skim — mechanically scan each summary against its own rows; (2) curate into the maps with reasoning (type corrections only through EPISODE_TYPE_OVERRIDES, never a direct row write); (3) --dry-run, read as a proposal — every line is a change being authorised; (4) apply, idempotent and file-driven, re-runnable as later verdicts arrive; (5) re-resolve any series whose types changed so stale-zone healing removes stranded rows; (6) healers; (7) verify-series-display --all (0 failing) and audit-ui-truth; (8) explain every census delta; (9) save point.

*Why:* A bad apply writes a wrong number that renders to users and outlives the session that made it — apply is the highest-stakes step in the pipeline.

- ruled session 2026-08-24 (apply-batch skill "Sequence"; CHUNK1-RECOVERY §6 closing sequence)
- layer **process**
- enforced: [.claude/skills/apply-batch/SKILL.md#Sequence](../.claude/skills/apply-batch/SKILL.md) · [history/apply-research-batch-17.ts#loadVerdicts](../scripts/ingest/history/apply-research-batch-17.ts)
- **audit: none — automation backlog**
- aliases: apply-batch sequence, the apply discipline, read, don't skim, dry-run as proposal
- see: P10, P16, P17, P18, P19, P28

### P16 · Uncurated or renumbered verdict files are HELD by name

A verdict file on disk that is not yet curated into the maps, or that was written against a numbering the catalog has since changed, is listed in HELD_FILES and loudly skipped on every run; it is released one file at a time once its decisions are ruled and mapped. Because apply scripts are re-runnable, an un-held stale verdict re-applies on every run.

*Why:* mashle-magic-and-muscles: after the recap renumbering a re-run resurrected an annotation on nonexistent row 25 from a pre-renumber verdict (§12.47).

- ruled session 2026-08-25 (data-pipeline §12.47 "Mashle verdict files HELD"; apply-research-batch-17.ts HELD_FILES)
- layer **writer**
- enforced: [history/apply-research-batch-17.ts#HELD_FILES](../scripts/ingest/history/apply-research-batch-17.ts)
- **audit: none — automation backlog**
- witnesses: mashle-magic-and-muscles
- aliases: HELD_FILES, mashle HELD, stale verdict HELD, held verdict files
- see: P10, P15

### P17 · Every census delta is explained

After any apply or consolidation the census (audit-ui-truth.ts) is compared class by class to the previous census and every delta is explained. A class that moved without explanation is an unshipped bug, not a rounding error. anchor_nonmonotonic / anchor_beyond_chapter_space hits are each triaged (real reorder → annotate; junk → gate + delete; ruled → suppression), never left unexplained.

*Why:* The census is the only place a misbehaving writer surfaces as data (invariant 3); an unexplained class shuffle hides exactly that.

- ruled session 2026-08-23 (consolidate skill §5; apply-batch skill step 8)
- layer **process**
- enforced: [.claude/skills/apply-batch/SKILL.md#Explain every census delta](../.claude/skills/apply-batch/SKILL.md) · [.claude/skills/consolidate/SKILL.md#Census](../.claude/skills/consolidate/SKILL.md) · [audit-ui-truth.ts](../scripts/ingest/audit-ui-truth.ts)
- audit: `anchor_nonmonotonic`, `anchor_beyond_chapter_space`
- aliases: census + delta explanation, explain every census delta, every census delta explained
- see: P5, P18, P15

### P18 · ruling_violation MUST be 0 — fix the writer, not the data

The ruling_violation census class verifies every standing ruling outcome-side in the database. It must be 0 at every save point; anything else means a writer bypassed a shared gate, and the fix is the writer (then the healer), never a data-only correction.

*Why:* eyeshield-21 ep 74: the class tripped once on a stale override, the gap was closed forever by assert-type-overrides.ts rather than by editing the row (§12.47).

- ruled Sean 2026-08-23 (consolidate skill §5 (2026-08-23); §12.21 consolidation pass 2 (class defined))
- layer **process**
- enforced: [audit-ui-truth.ts#ruling_violation](../scripts/ingest/audit-ui-truth.ts) · [.claude/skills/consolidate/SKILL.md#MUST be 0](../.claude/skills/consolidate/SKILL.md) · [.claude/skills/apply-batch/SKILL.md#Explain every census delta](../.claude/skills/apply-batch/SKILL.md)
- audit: `ruling_violation`
- witnesses: eyeshield-21
- aliases: ruling_violation = 0 gate, ruling_violation MUST be 0, fix the writer, never the data
- see: P5, P17, P2

### P19 · After any change, verify the whole series via the app path

After any anchor or episode adjustment to a series, run verify-series-display against it BEFORE reporting the change done. The verifier renders the series through the app's exact code path (assemble.ts + buildEpisodeList) and checks every row; it is never a re-implementation, because re-implementations drift. A reorder hole renders null by rule and is reported as a hole work-list line, never a failure.

*Why:* Sean, 2026-08-23: "data keeps getting broken every time we make adjustments." oshi-no-ko's stale test harness passed while the app was wrong; assemble.ts was split out of supabaseSource.ts so the verifier could import the real path.

- ruled Sean 2026-08-23 (data-pipeline §11 "Post-adjustment whole-series verification (Sean's ruling 2026-08-23)"; §12.33 (c))
- layer **process**
- enforced: [verify-series-display.ts#verifySeries](../scripts/ingest/verify-series-display.ts) · [.claude/skills/apply-batch/SKILL.md#verify-series-display --all](../.claude/skills/apply-batch/SKILL.md)
- audit: `verify:fail`, `verify:hole`, `verify:regression`
- witnesses: oshi-no-ko, my-hero-academia
- aliases: the verifier, whole-series verifier, verify-after-adjust ruling, Oshi stale-harness lesson, post-adjustment whole-series verification
- see: P15, P6, P28

### P20 · Healers are idempotent and run from the roster

Every healer is idempotent — a re-run on a clean catalog changes nothing — and every healer appears on the roster the passes run. A healer that exists but is never run is worse than none, because it looks like coverage. The same roster serves consolidate and apply-batch.

*Why:* The consolidate and apply-batch rosters drifted (afg-continua-apply missing from apply-batch — DRIFT-LIST §B); the c3 healer's first unpaged run silently under-processed (§12.46).

- ruled session 2026-08-23 (consolidate skill §4 "Healer rescans (all idempotent)"; data-pipeline §11 maintenance audits)
- layer **process**
- enforced: [rosters.ts#HEAL](../scripts/ingest/rosters.ts) · [run-roster.ts](../scripts/ingest/run-roster.ts) · [scripts/restructure/system-census.ts](../scripts/restructure/system-census.ts)
- **audit: none — automation backlog**
- aliases: healer roster, healers idempotent, healers idempotent + rostered
- see: P31, P32, P33

### P21 · Deep runs when a rule change invalidates prior decisions

/consolidate is steps 1–8; /consolidate deep adds the full-catalog rescan against current rules. Deep runs, unasked and said so, whenever a batch or session changed a RULE — a writer gate, a lib behaviour, a typing ruling — because a rule change plausibly invalidates prior per-series decisions. apply-batch offers deep, not plain, in that case. Expect deep often while the data logic is in flux, tapering as it stabilises.

*Why:* The 27 START values seeded under the majority rule were never re-normalised after batch 14 tightened it to the sliver rule (DRIFT-LIST A-6) — the case deep exists for.

- ruled Sean 2026-08-23 (consolidate skill "Two modes"; data-pipeline §10 "/consolidate skill (Sean 2026-08-23)")
- layer **process**
- enforced: [.claude/skills/consolidate/SKILL.md#Two modes](../.claude/skills/consolidate/SKILL.md) · [.claude/skills/apply-batch/SKILL.md#Next step — offer it](../.claude/skills/apply-batch/SKILL.md)
- **audit: none — automation backlog**
- aliases: deep trigger, consolidate deep trigger, two modes
- see: P22, P23, P25, sliver rule

### P22 · Deep is REQUIRED when a ledger enforcement site changed

/consolidate deep is mechanically required whenever any ledger record's enforcement site changed since the last pass; the cheap pass suffices otherwise. Two-level deep: a routine deep skips locked series, a rule-change deep never does.

*Why:* The live trigger ("plausibly invalidates prior decisions") is judgment-heavy; with enforcement sites in the ledger the trigger becomes derivable.

- ruled session 2026-08-26 (docs/system-evolution.md §5 "Sharper deep trigger"; docs/restructure-plan.md §3 T3.3)
- layer **process**
- enforced: [.claude/skills/consolidate/SKILL.md](../.claude/skills/consolidate/SKILL.md) · [scripts/restructure/system-census.ts](../scripts/restructure/system-census.ts)
- **audit: none — automation backlog**
- aliases: sharper deep trigger, enforcement-site deep trigger, T3.3
- see: P21, P25, P33

### P23 · Notes are precedence, not blindfolds

In a deep rescan, rulings, suppressions, overrides, closed flags and "don't touch" notes are still SCANNED and respected as the default, but re-checked under current rules: a note blocking something no longer valid goes to Sean with evidence; a clear-cut change under an established rule is applied, the note updated to record the supersession, and REPORTED — never silently; an ambiguous case is flagged, researched, and presented as a verdict.

*Why:* A note that is never re-read becomes a permanent escape hatch (invariant 8); a note silently overridden becomes an unexplained delta.

- ruled Sean 2026-08-23 (data-pipeline §12.24; consolidate skill §9)
- layer **process**
- enforced: [.claude/skills/consolidate/SKILL.md#Notes are precedence, not blindfolds](../.claude/skills/consolidate/SKILL.md)
- **audit: none — automation backlog**
- aliases: notes are precedence, not blindfolds, deep rescan notes rule
- see: P21, P24, P9

### P24 · Delete with evidence; every removal is listed

Logic, rulings, staging rows, flags and scripts are removed only when the inventory shows their effect is asserted elsewhere or their subject no longer exists; reasoning is extracted BEFORE a script becomes history; every deletion appears in the pass report. Batch apply scripts and verdict files stay in the repo as records by design — they are never "dead" cleanup.

*Why:* Consolidate §9 stale cleanup and restructure principle 7 say the same thing; §12.52 "nothing dead found" applied it.

- ruled Sean 2026-08-23 (consolidate skill §9 "Stale cleanup"; docs/restructure-plan.md §2 principle 7)
- layer **process**
- enforced: [.claude/skills/consolidate/SKILL.md#Stale cleanup](../.claude/skills/consolidate/SKILL.md) · [docs/restructure-plan.md#Delete with evidence](../docs/restructure-plan.md)
- **audit: none — automation backlog**
- aliases: delete with evidence, stale cleanup, every deletion listed
- see: P23, P34

### P25 · Permanence tiers: finished, Sean-signed series are LOCKED *(planned)*

A series that is FINISHED and FULLY PUBLISHED, with its mapping researched, cross-verified and Sean-signed, is LOCKED: its decisions are permanent and it drops out of routine deep rescans, revisited only when a rule change explicitly touches it. Airing, ongoing and unverified series stay in the active pool. The locked set grows until deep passes become rare.

*Why:* Designed 2026-08-23, never built — the consolidate skill states the clause as live (DRIFT-LIST §B loser). 15 candidates named by §12.46/§12.52; the lock mechanism lands after T4 (plan D-6).

- ruled Sean 2026-08-23 (data-pipeline §12.24; §12.52; docs/restructure-plan.md §7 D-6)
- layer **process**
- enforced: [docs/restructure-plan.md#D-6](../docs/restructure-plan.md) · [docs/system-evolution.md#permanence tiers](../docs/system-evolution.md)
- **audit: none — automation backlog**
- witnesses: sket-dance, bobobo-bo-bo-bobo, rurouni-kenshin, hellsing, noragami, rosario-vampire, d-gray-man, arms-alchemy, blade-of-the-immortal-ona, space-adventure-cobra, emma-a-victorian-romance, detective-school-q, fist-of-the-blue-sky, x, tokyo-mew-mew
- aliases: permanence tiers, permanence tier, LOCKED, locked series, permanence locks
- see: P21, P22

### P27 · Gates before commit: tsc -b (never -p .), lint, test, build

Before any save point: npx tsc -b --noEmit shows 0 errors, npm run lint, npm test and npm run build pass. `tsc -p .` on the solution tsconfig checks nothing. scripts/ingest/ is in the build graph through tsconfig.scripts.json so the gate covers the pipeline, and src/integrations/supabase/types.ts is regenerated after any migration so the gate stays real.

*Why:* The 2026-08-23 allBoundaries() regression: the helper vanished in a refactor and every card open threw while a vacuous `tsc -p .` pass, the verifier and the census all stayed green. Until T2.0, scripts/ was type-checked by nothing.

- ruled session 2026-08-23 (data-pipeline §12.34 (a); §10 "Frontend gate is tsc -b (2026-08-23 s2)"; CLAUDE.md "Gates before any commit"; restructure-plan T2.0)
- layer **process**
- enforced: [CLAUDE.md#Gates before any commit](../CLAUDE.md) · [tsconfig.scripts.json](../tsconfig.scripts.json) · [.claude/skills/consolidate/SKILL.md#Frontend contract](../.claude/skills/consolidate/SKILL.md)
- **audit: none — automation backlog**
- aliases: tsc -b gate, frontend gate, gates before commit, gates before any commit, frontend gate is tsc -b
- see: P28, P19

### P28 · Every piece ends at a save point; the next step is offered

Each piece of work — a wave, an apply, a consolidation, a restructure track item — ends at a save point: gates green, docs/changelog entry, memory refreshed as a refresh point, a commit whose message reads as the ruling record, push. The report states the census delta, the cycle position, and the recommended next step, and ASKS; anything awaiting Sean is an explicit open decision, never a silent TODO. A usage limit costs one piece.

*Why:* Restructure principle 5 / decision D-8 generalise what the skills already do: the batch-17 recovery worked because every chunk closed at a committed save point.

- ruled session 2026-08-23 (consolidate skill §8; apply-batch skill step 9 + "Next step"; research-batch "Next step"; restructure-plan §2 principle 5, §7 D-8)
- layer **process**
- enforced: [.claude/skills/consolidate/SKILL.md#Save point](../.claude/skills/consolidate/SKILL.md) · [.claude/skills/apply-batch/SKILL.md#Next step — offer it](../.claude/skills/apply-batch/SKILL.md) · [.claude/skills/research-batch/SKILL.md#Next step — offer it](../.claude/skills/research-batch/SKILL.md)
- **audit: none — automation backlog**
- aliases: save point, next-step offer, no silent TODO, offer it, don't assume it
- see: P27, P13, P29

### P29 · Capture: every learning is routed to a durable, named home

When something is learned it is routed and the route stated: a RULE → a ledger record with its enforcement site, then a writer gate in lib, then an audit class; a SOURCE TRAP → the research-agent definition; a PIPELINE TRAP → the apply-batch skill; a RULING from Sean → the curated map with reasoning inline (and the ledger if it generalises); a PROCESS FIX → the skill plus a changelog entry. If nothing was learned, say so. A learning with no durable home is re-learned at full price.

*Why:* Four CHUNK1 traps marked "capture to research-agent" were never captured (DRIFT-LIST §B); the mashle HELD trap lived only in the log.

- ruled Sean 2026-08-24 (CLAUDE.md "Capture — where a new learning goes"; consolidate skill §10; apply-batch "Next step" step 7)
- layer **process**
- enforced: [CLAUDE.md#Capture](../CLAUDE.md) · [.claude/skills/consolidate/SKILL.md#Close the loop](../.claude/skills/consolidate/SKILL.md) · [.claude/skills/apply-batch/SKILL.md#capture](../.claude/skills/apply-batch/SKILL.md)
- **audit: none — automation backlog**
- aliases: capture, capture routing, close the loop, the capture table
- see: P1, P30, P31

### P30 · Judgment → gate → audit; an empty audit cell is the backlog

Every rule should end up enforced by a writer gate and verified by an audit class; when that happens the rule stops costing model attention forever. Every ledger record has an enforcement site AND an outcome check; a live data rule with no audit class is visibly the automation backlog, and each pass says which rules still lack one.

*Why:* 69 of 88 §10 rows had no audit class at T0; each is a rule still costing a model on every pass.

- ruled Sean 2026-08-24 (apply-batch skill "The standing goal"; consolidate skill §10 "Check the gates are real"; docs/system-evolution.md §2)
- layer **process**
- enforced: [.claude/skills/apply-batch/SKILL.md#The standing goal](../.claude/skills/apply-batch/SKILL.md) · [.claude/skills/consolidate/SKILL.md#costing model attention](../.claude/skills/consolidate/SKILL.md) · [scripts/restructure/ledger-check.ts#noAudit](../scripts/restructure/ledger-check.ts)
- **audit: none — automation backlog**
- aliases: judgment → gate → audit, judgment to gate to audit, the standing goal, direction of travel, check the gates are real
- see: P5, P29, P31

### P31 · /add-rule: gate → edges → audit → heal → deltas → record *(planned)*

A new rule enters in one sequence: (1) the gate in scripts/ingest/lib/, never inline; (2) rebuild and deploy all four edges; (3) the outcome audit class; (4) heal the catalog and triage every row the gate refuses; (5) explain every census delta; (6) the ledger record with enforcement site, audit class and a witness; (7) commit as a ruling record, then /consolidate deep where the trigger applies. Proven on two exercises (AIR_DATE_OVERRIDES, then a second data rule) before it is trusted.

*Why:* The D1 MU-conflation gate followed this sequence exactly from judgment; the loop consolidate-detects → add-rule-builds → deep-verifies currently has a human-shaped hole.

- ruled session 2026-08-24 (docs/system-evolution.md §3 "Build /add-rule"; docs/restructure-plan.md §3 T3.1)
- layer **process**
- enforced: [docs/system-evolution.md#Build `/add-rule`](../docs/system-evolution.md) · [docs/restructure-plan.md#T3.1](../docs/restructure-plan.md)
- **audit: none — automation backlog**
- aliases: /add-rule, add-rule, add-rule sequence, T3.1
- see: P2, P3, P5, P17, P30

### P32 · Completeness is an outcome: walks prove processed = total

Every catalog walk reads through a paged selectAll with an exact count, reports processed/total, and FAILS if short; a walk that cannot prove completeness fails closed. Healers no-op on a clean catalog (the idempotency check). No unpaged select on a table that can exceed the 1000-row page.

*Why:* syncAnchors' unpaged per-series episode select lets one-piece and detective-conan rows past 1000 pass the A1 allow-list as row-less (DRIFT-LIST §E.2); the first c3 healer under-processed silently (§12.46).

- ruled Sean 2026-08-26 (docs/restructure-plan.md §3 T2.3; DRIFT-LIST §E.2)
- layer **writer**
- enforced: [lib/db.ts#selectAll](../scripts/ingest/lib/db.ts) · [scripts/restructure/unpaged-selects.ts](../scripts/restructure/unpaged-selects.ts)
- **audit: none — automation backlog**
- witnesses: one-piece, detective-conan
- aliases: completeness as an outcome, completeness sidecar, T2.3, healer-pagination trap
- see: P20, P33, A1

### P33 · System census checks the reference structure mechanically

`npm run census -- --system` asserts: every ledger enforcement path and symbol resolves; every audit class exists; every rule id cited in skills, agents, PROTOCOL and maps is live; PROTOCOL and skills contain ids, not rule prose; every scripts/ingest/*.ts is on a pull/heal/census roster, in history/, or lib-support; generated docs are not stale; edge bundles match the lib hash; the one-hop cases pass. It is consolidate step 0 and blocking while red during the restructure phase.

*Why:* Files existing is not a metric — broken citations, unrostered healers and stale generated docs are all invisible until something asserts them.

- ruled Sean 2026-08-26 (docs/restructure-plan.md §3 T2.4, T2.7; ledger-check.ts is the first piece)
- layer **process**
- enforced: [scripts/restructure/system-census.ts](../scripts/restructure/system-census.ts) · [package.json#system:census](../package.json)
- **audit: none — automation backlog**
- aliases: system census, T2.7, three rosters, T2.4
- see: P4, P20, P22, P30, P32

### P34 · Historical apply scripts are kept as records, non-runnable

One-shot apply scripts move to history/ with their reasoning extracted first; they are non-runnable by convention AND by the roster check, and are never deleted while they are the record of a ruling. A live script is on a roster; a historical one is not.

*Why:* Re-running apply-research-batch.ts recreates the fist-of-the-blue-sky 23–26 OVA span demoted 2026-08-25; apply-research-aot-s4p2.ts reverts ep 87 start 130→123; the dr-stone row-95 creation contradicts the later order-only ruling (DRIFT-LIST §E.5).

- ruled Sean 2026-08-26 (docs/restructure-plan.md §7 D-5; §3 T2.5; DRIFT-LIST §E.5)
- layer **process**
- enforced: [history/README.md](../scripts/ingest/history/README.md) · [scripts/restructure/system-census.ts](../scripts/restructure/system-census.ts) · [rosters.ts#ROSTERED](../scripts/ingest/rosters.ts)
- **audit: none — automation backlog**
- witnesses: fist-of-the-blue-sky, dr-stone
- aliases: history/, historical apply scripts non-runnable, history non-runnable, T2.5, D-5
- see: P24, P33, P16

### P36 · Cross-model check the frames, not just the data *(planned)*

The spec-writer cannot see their own bad frame: a pass by a different model over the plan and the rule framing (the one that produced restructure-plan v2) is repeated after the T4.0 glossary session, before the taxonomy build. Data verification (R23) covers verdicts; this covers the spec that pointed the agents.

*Why:* The residual blind spot the session cannot cover itself is a subtly wrong SPEC — agents pointed at the wrong chapter space, a mis-scoped target (CLAUDE.md "How steps 3–4 run in practice").

- ruled Sean 2026-08-25 (docs/restructure-plan.md §2 principle 8)
- layer **process**
- enforced: [docs/restructure-plan.md#Cross-model check the frames](../docs/restructure-plan.md) · [CLAUDE.md#Model policy](../CLAUDE.md)
- **audit: none — automation backlog**
- aliases: cross-model check the frames, frame check after T4.0, principle 8
- see: R23, R24, P1

### P37 · Episode-level display reads only the hydrated series

Any component that renders episode-level data consumes the HYDRATED series (getById: episode rows, anchor mappings, boundaries, watch-order); the shallow list item renders identity fields only and never derives episode facts.

*Why:* Sean's Kenshin card report (2026-08-23): the first diagnosis blamed a stale client until his screenshot disproved it — reproduce through the real modules before diagnosing.

- ruled Sean 2026-08-23 (data-pipeline §12.19a; §10 "Metadata contract")
- layer **display**
- enforced: [src/data/catalog/supabaseSource.ts#getById](../src/data/catalog/supabaseSource.ts) · [src/components/AnimeCard.tsx](../src/components/AnimeCard.tsx)
- **audit: none — automation backlog**
- aliases: metadata contract, card-hydration rule, hydration contract, hydrated series only
- see: P6

## Alias index

- * Filler marker → `T16`
- /add-rule → `P31`
- ±12 alignment → `N16`
- ±2 gate → `I25`
- ±2/lag finalize gate → `I25`
- ≥2 sources → `R3`
- 0.8 band → `N23`
- 2+ independent sources per anchor → `R3`
- 2+ sources → `R3`
- 365-day rule → `G54`
- 40-chapter band → `C8`
- 6–8 wave cap → `P12`
- a wave is the unit of loss → `P12`
- A-11 → `G54`
- A-4 → `R20`
- A-5 → `T8`
- A-8 → `G4`
- A-9 → `G52`
- A1 / D1 episode-type refusal → `G36`
- A1 / D4 chart → `A5`
- A1 / D4 episode-type refusal → `A5`
- A1 + sliver rule → `A10`
- A1 at the MU writer → `G36`
- A1 outcome verification → `A6`
- A1 rule → `A1`
- A1 triage → `A6`
- A1-triage lane → `R27`
- A1/D4 → `A5`
- A2/A3 → `A2`
- A2/A3 rejected-as-anchors → `A2`
- A4 coverage=max → `A4`
- A4 finale rule → `A4`
- A4 rule → `A4`
- acknowledged approximation → `A7`
- add-rule → `P31`
- add-rule sequence → `P31`
- AFG "* Filler" title-marker rule → `T16`
- AFG alignment gate → `N16`
- AFG as story-flow reference → `I20`
- AFG continua source → `G22`
- AFG episode-numbering conversion → `N15`
- AFG extension (merge, never replace) → `I29`
- AFG match tiers → `I3`
- AFG numbering alignment → `N16`
- AFG numbering alignment gate → `N16`
- AFG page parse guards → `G20`
- AFG re-fetch lesson → `G51`
- AFG structural cross-check → `G30`
- AFG structuring is evidence → `I20`
- AFG title-marker rule → `T16`
- afg-continua → `G22`
- AFG-expansion typing → `T15`
- AFG-expansion typing sweep → `T15`
- afg-extend → `I29`
- AFL alias corruption → `G8`
- AFL class map → `T1`
- AFL is the type authority → `T4`
- AFL label past table stop → `T4`
- AFL owns episode types → `T5`
- AFL page boundaries are the starting hypothesis → `I18`
- AFL row parse contract → `G7`
- AFL wins → `T5`
- AFL wins, always → `T5`
- AFL-lag class → `I27`
- AFL-range merge → `I32`
- AFL-range merge on refresh → `I32`
- AFL-range merge rule → `I32`
- AFL/AFG advisory → `T4`
- agent contract → `R8`
- agent is read-only → `R22`
- air date override pass → `G53`
- AIR_DATE_OVERRIDES → `G53`
- air-date order gate → `G54`
- air-date overrides → `G53`
- air-date withheld → `G54`
- airdate regression → `G54`
- AIRDATE_ORDER_ACK → `G54`
- airdate_regression → `G54`
- airdate_withheld → `G54`
- airing-lag allowance → `I26`
- airing-pin rule → `G34`
- alias defense → `G8`
- alias-corruption defense → `G8`
- alias-corruption exclusion → `I14`
- alignment gate → `N16`
- ambiguity rule → `I4`
- anchor = honest record → `A8`
- anchor density → `R14`
- anchor freshness → `A27`
- anchor monotonicity → `A20`
- anchor numbering conversion → `N14`
- anchor numbering translation → `N13`
- anchor precedence → `A24`
- anchor tier precedence → `A24`
- anchor_gap_research target → `A39`
- anchor-aware interpolation → `A33`
- anchor-freshness rule → `A27`
- anchored interpolation → `A33`
- anchored row-less episodes → `A42`
- anchors never encode resume positions → `A32`
- anchorsReachEnd → `A37`
- AniFiller seed → `I10`
- AniList naming authority → `I7`
- anime parity → `C2`
- anime_only badge → `T19`
- anime_only homonym → `T22`
- anime-only-canon ≠ anchor desert → `T14`
- anime-only-canon has no chapter counterpart → `T14`
- anime→manga linkage → `I38`
- annotation kind vocabulary → `R10`
- annotation kinds → `R10`
- annotations are first-class → `A43`
- ANY debate about final episodes → `T13`
- AoT 88-89 lesson → `A26`
- AoT 88-89 report → `A26`
- AoT ep-87 rule → `A12`
- AoT Final Chapters finding → `I33`
- AoT-87 extension → `A17`
- AoT-87 rule → `A12`
- AoT-87 rule (extended) → `A17`
- api.php rule → `R6`
- apply-batch sequence → `P15`
- apply-continue-points → `C9`
- arc-block anchors → `A22`
- artifacts are the handoff → `P11`
- as-stored rendering → `A19`
- assert-type-overrides → `T6`
- asterisk model → `A43`
- asterisk review workflow → `A43`
- audit-afg-structure → `G30`
- audits verify outcomes → `P5`
- author-declaration discriminator → `T9`
- authoritative sources write canonical → `G5`
- b17 D3 → `T3`
- b17 D3 form → `T3`
- backwards-jumping successor → `A17`
- base-type padding → `T17`
- Berserk Memorial class → `I23`
- best-available latest_known → `N27`
- bestLatestKnown → `N27`
- beyond-frontier honesty → `A34`
- beyond-frontier null rendering → `A34`
- beyond-frontier rule → `A34`
- Black Clover lesson → `T14`
- block-end aggregate anchors → `A22`
- block-end anchors deprecated → `A22`
- bonus chapters never mainline → `N30`
- bonus/fractional chapters: record, never drop → `A29`
- borrow-maps render as stored → `A40`
- Boruto ch-710 class → `N28`
- Boruto ep-219 lesson → `A25`
- Boruto/Black Clover precedent → `T9`
- boundaries write absent-only → `V7`
- boundary anchors → `R15`
- boundary anchors most load-bearing → `R15`
- boundary heal → `V2`
- boundary numbering space → `V6`
- boundary span definition → `V9`
- boundary-aware volumes → `V3`
- boundary-aware volumes everywhere → `V3`
- bridge formats → `I19`
- C1 C2 C3 → `C5`
- C1 rule → `C1`
- C2 ANIME-PARITY continue rule → `C2`
- C2 rule → `C2`
- C3 clarification → `C3`
- C3 out-of-order zones (b15) → `A19`
- C3 rule → `C3`
- C3 skip-note predicate → `C3`
- C4 rule → `C4`
- cameo rule → `A2`
- cameo/sliver borrowings → `A2`
- canon-default → `T17`
- canon-default typing → `T17`
- canon-tier → `G52`
- canon-tier creation → `G52`
- canon-tier spans → `T17`
- canonical identity is ours → `I1`
- capture → `P29`
- capture routing → `P29`
- card-hydration rule → `P37`
- caught up, padded out → `T11`
- caught-up-padded-out class → `T11`
- cells-at-work 12/13 → `A42`
- cells-at-work 12/13 lesson → `A42`
- census + delta explanation → `P17`
- chain early-stop → `I22`
- change detection before download → `G15`
- chapter floor → `N26`
- chapter overlap never proves filler → `T7`
- chapter-floor → `N26`
- chapter-floor invariant → `N26`
- chapter-number space → `N22`
- chapter-number vs chapter-count spaces → `N22`
- chapter-space gate → `N28`
- chapter-space gates → `N28`
- chapter-space gates (all anchor writers) → `N28`
- chapter-string coverage end → `N29`
- chapterInRange → `N29`
- chapters_adapted → `A30`
- check the gates are real → `P30`
- checkpoint after every wave → `P13`
- checkpoint lattice → `R14`
- checkpoint steps → `P13`
- chToVol → `V3`
- claimed continuation → handoff → `I37`
- CLASS_TO_TYPE → `T1`
- Claymore precedent → `G26`
- close the loop → `P29`
- community count rule → `N3`
- COMMUNITY_COUNT_OVERRIDES → `N3`
- community-count restructure heal → `N20`
- community-count rule → `N3`
- community-count rulings → `N3`
- completeness as an outcome → `P32`
- completeness sidecar → `P32`
- component kind → `I19`
- conditional GETs → `G15`
- confidence high medium → `R16`
- confidence vocabulary → `R16`
- consensus-canon → `T2`
- consensus-original class → `T9`
- consolidate deep trigger → `P21`
- consolidate step-3 contract → `G28`
- content-hash gate → `G9`
- contested canonical ending → `T12`
- contested-ending class → `T12`
- continua boundary write → `V7`
- continua chart cross-check → `G27`
- continua full-source ruling → `G22`
- continua identity guard → `G23`
- continua numbering conversion → `N15`
- continua precedence → `A24`
- CONTINUA_SUPPRESSED → `G26`
- continua-vs-chart cross-check → `G27`
- continuation handoff → `I37`
- continue fields survive re-derive → `C7`
- continue point → `C5`
- continue point (b17) → `C5`
- continue_kind → `C6`
- continue_kind vocabulary → `C6`
- continue-from is guidance → `C8`
- continue-from-is-guidance → `C8`
- continue-read = a regime choice → `C5`
- continue-read = anime parity → `C2`
- continue-read regimes → `C5`
- continue-reading points → `C9`
- continues in X → `I37`
- contradiction scan → `R25`
- count mismatch → `G13`
- count mismatch (informational) → `G13`
- COUNT_MISMATCH_THRESHOLD → `G13`
- count-space vs number-space → `N22`
- coverage = furthest adapted → `A4`
- coverage = max → `A4`
- coverage gate → `A37`
- coverage synthesis → `A38`
- crawl-delay → `G16`
- cross-check only → `R4`
- cross-check tier → `G41`
- cross-model check the frames → `P36`
- cross-model verification → `R23`
- curated continues → `C7`
- curated precedence → `A24`
- CURATED_CONTINUES → `C7`
- curated-consistency → `A25`
- curated-consistency precedence → `A25`
- curated-first apply → `P10`
- curation principle → `P10`
- D-5 → `P34`
- D1 → `G32`
- D1 airing-pin → `G34`
- D1 chapter-space → `N28`
- D1 episode-type refusal → `G36`
- D1 gate stack → `G32`
- D1 scope-consumed → `G35`
- D1 sibling-scope ceiling → `G33`
- D4 → `A5`
- D4 early signal → `R28`
- Dagashi S1 normalization → `A9`
- data cycle → `P1`
- declared shifts only → `N21`
- dedup guard → `I30`
- deep rescan notes rule → `P23`
- deep trigger → `P21`
- default continue = end + 1 → `C9`
- degenerate span → `I35`
- delete with evidence → `P24`
- delete-at-entry → `G38`
- density rule → `R14`
- derivative-manga rule → `T21`
- derive guard → `A15`
- derived start fallback → `A15`
- derived-tier monotonicity → `A20`
- direction of travel → `P30`
- disagreement handling → `R17`
- discredited sources → `R4`
- dismissed_permanent → `G4`
- display anchors at starts → `A13`
- display shows START → `A13`
- display vocabulary → `T19`
- display/continue split → `A13`
- dispositions → `I11`
- divider/LNDS derivation → `A20`
- do not decide on 5 of 49 → `R28`
- do-not-demote → `C4`
- Dr. Stone / Ryuusui lesson → `N11`
- dry-run as proposal → `P15`
- DSQ class → `T11`
- duplicate rule → `I12`
- early D4 signal → `R28`
- early-stop → `I22`
- edge hash → `P4`
- effective total → `N24`
- effectiveTotalChapters → `N24`
- empty hold → `G11`
- END = running order → `A8`
- END definition → `A8`
- end+1 default → `C9`
- ending-debate annotation → `T13`
- enforcement-site deep trigger → `P22`
- episode 0 is real → `G7`
- episode display = FIRST chapter animated → `A13`
- episode floor → `N1`
- episode totals derivation → `N34`
- episode_annotations → `A43`
- EPISODE_TYPE_OVERRIDES → `T6`
- episode-floor invariant → `N1`
- episode-list locks → `G44`
- episode-row ruling order → `N18`
- episode-type overrides → `T6`
- episode-type semantics → `T2`
- episodes writer gate → `N18`
- episodes.type vocabulary → `T1`
- etiquette → `G16`
- Evangelion class → `T21`
- Evangelion ending class → `T12`
- Evangelion/Madoka class → `T21`
- event-driven validation tier → `V8`
- every census delta explained → `P17`
- every deletion listed → `P24`
- every-writer rule → `P2`
- evidence-locked offsets → `G44`
- exact record outranks derivation → `A14`
- exact-match-or-flag → `I30`
- exact-record-outranks-derivation → `A14`
- exceed-totals flag → `V6`
- excluded_recap → `N8`
- expansion guards → `I30`
- expansion is stitch-aware → `I31`
- explain every census delta → `P17`
- extend candidacy by structure → `I29`
- extension is structure only → `I28`
- EXTRAS_ADOPTED → `N1`
- eyeshield ep-74 lesson → `T6`
- eyeshield lesson → `T15`
- eyeshield title report → `T16`
- eyeshield-21 155 lesson → `N2`
- fan mapping threads → `R5`
- fan threads first-class → `R5`
- fandom + accounting beats AFL → `T4`
- fandom via API → `R6`
- fileFlagOnce → `G3`
- fill-only → `G45`
- filler = zero canon → `T2`
- filler rows never carry anchors → `A1`
- filterEpisodeRows → `N18`
- final-episode debate annotation → `T13`
- finale anchors to what it adapts → `A8`
- finalize gate → `I25`
- finished-total trim → `V6`
- first FULL chapter rule → `A11`
- first-chapter display → `A13`
- first-chapter ruling → `A13`
- fix the writer, never the data → `P18`
- flag rule → `G1`
- flags must be mapped → `T15`
- flags_for_sean → `R17`
- floor rule → `N1`
- floor-rule typo lesson → `N2`
- format ⟂ canon standing → `T23`
- format is orthogonal to standing → `T23`
- format-is-orthogonal → `T23`
- formulas never bridge a reorder → `A18`
- four tokens → `T1`
- fractional anchors → `A29`
- fractional evidence → `N10`
- fractional in-between entries → `N9`
- fractional numbering convention → `N9`
- fractional ruling → `N9`
- fractional staging → `G46`
- fractional staging + disposition → `G46`
- fractional watch-order positions → `N32`
- fractional wiki labels prove a shared space → `N10`
- frame check after T4.0 → `P36`
- franchise baseline → `I15`
- franchise evaluation → `I18`
- freshness map → `G47`
- frontend gate → `P27`
- frontend gate is tsc -b → `P27`
- frontier_tail_null triage → `A35`
- frontier-tail triage → `A35`
- full adaptation record → `A30`
- full adaptation record (agent contract) → `R8`
- full-record model → `R8`
- full-record protocol → `A30`
- full-record ruling → `A30`
- full-source ruling → `G22`
- gates before any commit → `P27`
- gates before commit → `P27`
- Gintama ep-35 report → `A14`
- Gintama ep-35 rule → `A14`
- graceful degradation → `P6`
- greedy staging → `G51`
- GTO 20/21 lesson → `A3`
- GTO lesson → `A3`
- Haikyu ep-85 lesson → `N14`
- hard invariant 1 → `P2`
- hard invariant 2 → `P3`
- hard invariant 3 → `P5`
- hard invariant 4 → `P6`
- hard invariant 5 → `R1`
- hard invariant 6 → `A1`
- hard invariant 7 → `P8`
- hard invariant 8 → `P9`
- hash gate → `G9`
- hash-only-acted-on-fields → `G42`
- hasSource → `T22`
- heal-volume-boundaries → `V2`
- healer roster → `P20`
- healer-pagination trap → `P32`
- healers idempotent → `P20`
- healers idempotent + rostered → `P20`
- held dispatch → `P13`
- held verdict files → `P16`
- HELD_FILES → `P16`
- high/medium → `R16`
- hikaru ep-75 wipe → `P8`
- hikaru lesson → `P8`
- historical apply scripts non-runnable → `P34`
- history non-runnable → `P34`
- history/ → `P34`
- honest gap > guess → `R13`
- honest gap beats a plausible guess → `R13`
- honest record → `A8`
- HxH ep-140 lesson → `A24`
- hydrated series only → `P37`
- hydration contract → `P37`
- ID COLLISION → `I2`
- id/title stable → `I28`
- id/title/afl_slug never change → `I28`
- identity → `I1`
- identity guard → `G23`
- identity registry → `I2`
- identity-first, flag-first → `I3`
- in-flow extras stay in → `I19`
- in-flow movies/OVAs → `I19`
- index-join rule → `R20`
- ingest_fractionals → `G46`
- Initial D rule → `N4`
- inline upkeep → `G49`
- invariant 1 → `P2`
- invariant 2 → `P3`
- invariant 3 → `P5`
- invariant 4 → `P6`
- invariant 5 → `R1`
- invariant 6 → `A1`
- invariant 7 → `P8`
- invariant 8 → `P9`
- Ippo finale lesson → `A4`
- Ippo v61 lesson → `V4`
- Ippo v61 partial-boundary principle → `V2`
- join on title → `R20`
- judgment → gate → audit → `P30`
- judgment to gate to audit → `P30`
- Kakegurui 9 lesson → `N26`
- Kenshin ep-29 wobble → `V3`
- Kenshin rule → `A34`
- Kingdom S6 lesson → `G44`
- Kingdom/Beastars/Black Butler class → `I27`
- lag rule → `I26`
- land and checkpoint → `P13`
- large_diff → `G10`
- large-diff hold → `G10`
- lastChapterNumber → `N29`
- latest not total → `N25`
- latest_known writer gate → `N27`
- latestKnown synthesis → `A38`
- legend by count → `T18`
- legend-by-count → `T18`
- lib → edges → `P3`
- lib → four edges → `P3`
- lib-hash stamp → `P4`
- licensed canon side story → `T9`
- light-novel instrument → `T24`
- LN class → `T24`
- LN instrument ruling → `T24`
- LN volume-space instrument → `T24`
- LNDS → `A20`
- LOCKED → `P25`
- locked series → `P25`
- look for a second wiki → `R7`
- loose exemption → `A40`
- loose ruling → `A40`
- lumped page → `I24`
- lumped-page signature → `I24`
- Made in Abyss ← Claymore class → `V5`
- major narrative shifts = separate series → `I16`
- majority rule → `A11`
- manga link selection → `I38`
- manga totals (§2) → `N25`
- manga_only badge → `T19`
- manga_status 'anime_only' → `T22`
- manga_status vocabulary → `T22`
- MANGA_STATUS_MAP → `T22`
- manga-status cross-check → `G41`
- MangaDex bridge → `I6`
- MangaDex-bridge-only identity → `I6`
- MANUAL_EXCLUDE → `I11`
- mapping_mode loose → `A40`
- mashle HELD → `P16`
- mashle lesson (spaces) → `N12`
- mashle ruling → `N9`
- match confidence order → `I8`
- match duplicate → `I9`
- match ladder → `I8`
- matching ladder → `I8`
- MAX_CHAIN → `I22`
- MediaWiki API not HTML → `R6`
- merge-never-replace → `I29`
- metadata contract → `P37`
- MHA 107/113 report → `A18`
- mid-chapter END → `C1`
- mid-chapter straddle → `C1`
- missed edge deploy → `P3`
- mixed = canon AND non-canon → `T2`
- Monogatari precedent → `N8`
- monotonic boundaries → `V1`
- monotonic starts → `V1`
- monotonic-start gate → `V1`
- MONOTONIC-START rule → `V1`
- MONSTERS ONA → `I23`
- more classified episodes wins → `I12`
- movie/OVA exclusion → `I13`
- movies are OUT of v1 → `I13`
- movies count only when numbered → `N4`
- movies rule → `N4`
- movies/OVAs excluded → `I13`
- mu anchors are derivations → `G38`
- mu anchors wiped and rebuilt → `G38`
- MU class C → `A27`
- MU franchise-conflation gates → `G32`
- mu frontier → `G31`
- MU frontier rule → `G31`
- MU gate stack → `G32`
- MU hash gate → `G42`
- MU identity bridge → `I6`
- MU pin redundancy → `A26`
- MU resume pointer → `A32`
- MU suppression record → `G37`
- MU targets universal → `G39`
- MU targets: UNIVERSAL → `G39`
- MU writer gates → `G32`
- MU_FRONTIER_SUPPRESSED → `G37`
- mu-558-as-anchor → `A32`
- MU-frontier rule → `G31`
- MU-pin episode-keyed redundancy → `A26`
- muHash → `G42`
- namesake guard → `G44`
- naming authority → `I7`
- Naruto/DragonBall baseline → `I16`
- Naruto→Shippuden pattern → `I16`
- needs_ruling → `I4`
- never index-join → `R20`
- never overload episodes.type → `T23`
- never silently contradict stored data → `R12`
- new-source checklist → `G50`
- next-step offer → `P28`
- no blanket precedence rule → `R2`
- no degenerate component spans → `I35`
- no digit-mashing → `G20`
- no one-offs → `P9`
- no one-offs (sources) → `G50`
- no one-offs, ever → `P9`
- no randomized intervals → `G16`
- no silent TODO → `P28`
- non-main entries carry the why → `N33`
- non-monotonic display ruling → `A19`
- notes are precedence, not blindfolds → `P23`
- nothing reaches Sean unresearched → `R1`
- nothing suspicious ever auto-applies → `G1`
- numbered specials trigger → `N7`
- numbered-specials research trigger → `N7`
- numbered-vs-event rule → `N3`
- numbering conversion is the agent's job → `R18`
- numbering-space translation → `N11`
- offer it, don't assume it → `P28`
- once-per-open-kind → `G3`
- one afg id per series → `I5`
- one AFL page = one series prior → `I18`
- one AniList id per AFL slug → `I9`
- one continuous story = ONE series → `I15`
- one display, one space → `N22`
- one JSON per series → `R21`
- one story = one series → `I15`
- one-anchor-per-episode PK → `A24`
- one-chapter-dip class → `A16`
- only ending → `T10`
- only-ending class → `T10`
- order-only components never count → `N4`
- orphaned-verdict review → `R26`
- Oshi ep-4 lesson → `A21`
- Oshi no Ko rule → `R4`
- Oshi stale-harness lesson → `P19`
- our cumulative numbering → `R18`
- our slug is identity → `I1`
- out_of_space → `N28`
- outcome-check pattern → `P5`
- outside both canons → `T3`
- OVA-inclusive sources flagged → `R18`
- overlap ≠ filler → `T7`
- overlap discount clause → `T8`
- overlap rule → `T7`
- override > AFL > AFG → `T4`
- own-slug identity → `I1`
- ownedAnilistIds → `I21`
- ownership guard → `I21`
- padded finale → `T11`
- page discovery token agreement → `G43`
- parity \| unseen \| post_series → `C6`
- parity continue → `C2`
- parity-continue preservation → `C7`
- parse_integrity (AFL) → `G6`
- partial boundary tables never stand in as totals → `V4`
- partial knowledge renders as partial → `A36`
- per-source numbering spaces → `N12`
- per-task scratchpad → `R22`
- permanence locks → `P25`
- permanence tier → `P25`
- permanence tiers → `P25`
- permanent-flag disposition → `G4`
- pickManga → `I38`
- piecewise interpolation → `A33`
- pin-episode redundancy → `A26`
- pinned protocol → `R31`
- post-adjustment whole-series verification → `P19`
- predecessor floor → `A17`
- prequel side-story fallback → `I23`
- prequel-hijack fallback → `I23`
- prevEnd+1 derivation → `A15`
- principle 8 → `P36`
- priority of authority → `G5`
- PROTOCOL pin → `R31`
- protocol pinned → `R31`
- protocol preamble → `R21`
- published-volume stand-in completeness → `V4`
- publishedVolumes → `V4`
- Queue 3 LN ruling → `T24`
- re-use is true data → `A31`
- re-use never anchors → `A31`
- read, don't skim → `P15`
- rearranged zones → `A3`
- rearranged-zone rule → `A3`
- rearranged/graft exemption → `A41`
- recap rule → `N8`
- reconcile-structure → `I33`
- refresh cadence → `G47`
- refreshStitchedVolatile → `I34`
- refused_episode_type → `G36`
- refused_scope_consumed → `G35`
- refused_sibling_scope → `G33`
- regime annotations from real jumps → `R29`
- regime choice → `C5`
- registerIds → `I2`
- registration never overwritten → `I5`
- registration tiers → `I3`
- rehash = filler → `T8`
- rehash discount → `T8`
- rehash rule → `T8`
- relation kinds → `I17`
- relationship direction → `I17`
- reliability tiers → `G5`
- relocated openers → `A12`
- relocated openers are never the START → `A12`
- remakes are separate → `I16`
- render as stored → `A19`
- reorder hole → `A18`
- reorder regime → `A18`
- REORDER_REGIMES laundering → `R29`
- REORDER_REGIMES listing rule → `R29`
- repairs live at the manual tier → `P8`
- repairs never silent → `R12`
- repairs with old/new → `R12`
- report, don't apply uncurated → `P10`
- research-agent contract → `R22`
- research-first rule → `R1`
- RESEARCH-FIRST rule → `R1`
- research-logged non-main entries → `N33`
- restage from raw → `G28`
- retype stays research-tier → `T6`
- REVIEWED_NUMBERED_SPECIALS → `N7`
- row-count identity → `R19`
- row-count identity first → `R19`
- ruled air dates → `G53`
- ruled extensions → `I27`
- ruled reorder exemption → `A41`
- ruled splits stay split → `I20`
- RULED_LABELS → `N31`
- ruledExtent → `I27`
- rules live in lib → `P2`
- rules_applied → `R30`
- rules_applied[] → `R30`
- ruling_violation = 0 gate → `P18`
- ruling_violation MUST be 0 → `P18`
- running-order END convention → `A9`
- running-order END normalization → `A9`
- Ryuusui lesson → `N11`
- Sailor Moon "v3: chs 10-3" → `V1`
- Sailor Moon ep-72 report → `A17`
- Sailor Moon v3 report → `V1`
- same-edition band → `N23`
- same-edition band (MU latest) → `N23`
- sameEditionLatest → `N23`
- sanity band → `C8`
- Santen Sensou-hen lesson → `I35`
- save point → `P28`
- scope leakage → `I36`
- scope-audit gate → `I24`
- scope-consumed → `G35`
- scope-consumed refusal → `G35`
- scraping etiquette → `G16`
- script before model → `P5`
- Sean rules → `P10`
- Sean's :re ruling → `I21`
- Sean's accuracy directive → `R1`
- Sean's standing rule (use the best info available) → `N27`
- Sean's UY report → `N21`
- Sean's vocabulary → `T2`
- search ranking is not identity → `G43`
- second wiki → `R7`
- second-wiki habit → `R7`
- section envelope → `A36`
- section header envelope → `A36`
- sections never arcs → `T19`
- seed is a fact only → `I10`
- series_external_ids → `I2`
- series_relations vocabulary → `I17`
- series_scopes → `I36`
- settled reorders → `A41`
- shared chapters → `A31`
- sharing never moves position → `A31`
- sharper deep trigger → `P22`
- shift verification → `N11`
- sibling-scope ceiling → `G33`
- single-source final → `C4`
- single-source-final → `C4`
- skeptic not second author → `R24`
- skip notes → `C3`
- skip-on-arrival note → `C3`
- Slime ← Cells at Work class → `V5`
- Slime/4KOTA class → `N28`
- sliver rule → `A10`
- small-sample rule → `R28`
- source numbering translation → `N11`
- source spaces → `N12`
- source suppressions → `G26`
- source typing → `T20`
- source_map dispositions → `I11`
- SOURCE_NUMBERING_SHIFTS → `N11`
- source_type derivation → `T20`
- source_type vocabulary → `T20`
- source-scope enforcement → `I36`
- source-scope rule → `I36`
- sourceType → `T20`
- sparse guard → `G12`
- sparse hold → `G12`
- sparse-classification hold → `G12`
- spike filter → `A20`
- spinoff/bonus labeling → `N30`
- staging freshness → `G28`
- staging hashes make re-runs no-ops → `G9`
- staging is greedy → `G51`
- stale cleanup → `P24`
- stale frontier → `A27`
- stale verdict HELD → `P16`
- stale-anchor class → `A27`
- stale-zone healing → `N19`
- START = first chapter animated → `A10`
- START majority rule → `A11`
- start sanity → `A21`
- start-sanity guard → `A21`
- stitch candidacy → `I24`
- stitch finalize gate → `I25`
- stitch-aware expansion → `I31`
- stitched-series guard → `I34`
- stitcher ownership → `I34`
- stolen slug → `I14`
- straddled chapter → `C1`
- strict episode-cell parse → `G20`
- structure reconciliation → `I33`
- successor cap → `A16`
- successor-span cap → `A16`
- summary-vs-rows scan → `R25`
- surfacing parked → `N31`
- synthesized coverage → `A38`
- system census → `P33`
- T2.3 → `P32`
- T2.4 → `P33`
- T2.5 → `P34`
- T2.6 → `P4`
- T2.7 → `P33`
- T3.1 → `P31`
- T3.3 → `P22`
- Table/QuickList integrity → `G6`
- tail honesty → `A37`
- tail honesty / coverage gate → `A37`
- taxonomy_conflict (MU status) → `G41`
- the ambiguity rule → `I4`
- the apply discipline → `P15`
- the capture table → `P29`
- the confirm queue → `G1`
- the curated map decides → `P10`
- the cycle → `P1`
- the data cycle → `P1`
- the flag rule → `G1`
- the four crons → `G47`
- the governing rule → `P11`
- the Naruto bug → `I36`
- the reference point (watch order) → `N32`
- the standing goal → `P30`
- the verifier → `P19`
- three rosters → `P33`
- three-numbers model → `C8`
- ties escalate to research → `R2`
- title-alignment verification → `N21`
- title-join rule → `R20`
- title-token overlap gate → `V5`
- titles:excluded → `I11`
- Tokyo Ghoul 144/143 rule → `N22`
- Tokyo Ghoul rule → `N22`
- Toriko deletion → `A6`
- Toriko deletion precedent → `A6`
- translated-max merge boundary → `N19`
- triage lane → `R27`
- tsc -b gate → `P27`
- two modes → `P21`
- two-chunk rule → `P12`
- two-source rule → `R3`
- TYBW airing pin → `G34`
- type corrections two sources → `R11`
- type corrections via overrides → `T6`
- type_corrections ≥2 sources → `R11`
- type_corrections allowed types → `T1`
- type-badge vocabulary → `T19`
- TypeBadgeKind → `T19`
- typing precedence → `T4`
- typing vocabulary → `T2`
- universal MU targeting → `G39`
- unresolved disagreement → `R17`
- Urusei Yatsura wipe → `V2`
- validation tier is event-driven → `G29`
- Vanitas amendment → `A29`
- Vanitas lesson → `A29`
- verdict cites rule ids → `R30`
- verdict deliverable → `R21`
- verdict JSON shape → `R21`
- verdict self-consistency → `R25`
- verdict volume → `V10`
- verdict-verifier contract → `R24`
- verification debt → `R26`
- verification tier → `R23`
- verifier hunt order → `R24`
- verifier on weight-bearing verdicts → `R23`
- verifier report format → `R24`
- verify pass → `R23`
- verify pool → `R23`
- verify-after-adjust ruling → `P19`
- volume = END's volume → `V10`
- volume ratio fallback → `V3`
- volume span → `V9`
- VOLUME_STALE_MARGIN → `V8`
- volume-boundary identity → `V5`
- volume-boundary identity + numbering space → `V5`
- volumes-staleness event → `V8`
- walk refuses ambiguity → `I22`
- watch-order entries → `N31`
- watch-order entries: canonical + surfaced-by-ruling → `N31`
- watch-order v2 unit rendering → `N32`
- wave cap → `P12`
- wave cap 6-8 → `P12`
- When They Cry case → `G44`
- whole-series verifier → `P19`
- wiki fill gates → `G45`
- WIKI_NUMBERING_SHIFTS → `N21`
- Wikipedia episode-list locks → `G44`
- Wikipedia fill is fill-only → `G45`
- Wikipedia page discovery → `G43`
- work-list from disk → `P11`
- X 21-24 class → `T10`
- X only-ending → `T10`
- YYH class → `N20`
- zatch-bell lesson → `T7`
- zone_level_only → `R13`
- zone-acknowledged → `A7`
- zone-acknowledged marker → `A7`
- zone-level only → `R13`

## Scoreboard

- rules: 260 (live 245, planned 10, superseded 5)
- live data rules with no audit class (the automation backlog): 88
- by layer: writer 133 · display 23 · both 21 · process 83
