# Discovery + seed creation + the franchise layer — design proposal v2 (2026-09-05, NOT YET RULED)

v2 re-evaluates v1 at full effort with three things VERIFIED rather than assumed:
the AniList schema (introspected), the seed gap (measured against live rankings),
and the path by which an AFL page attaches to a series that already exists
(read in resolve.ts — it does not exist today). Cursor's relayed notes remain
the reference point; where v2 differs from Cursor or from v1 it says so.

Sean's ask: (0) a franchise / IP umbrella as the top of the hierarchy, for IA
(list by franchise in the UI) and as a discovery scope; (1) the HALO — for every
series we hold, find every other work of that IP on AniList (seasons, OVAs,
movies, specials, other adaptations) and build it ourselves; (2) SEEDS — AniList
metrics on a cron (top 500 popular, top 100 airing, …) to find IPs we do not hold.
Seeded series then run through the same research / verify / apply cycle.

## 0. Measured state (2026-09-05; probes in the session scratchpad, read-only)

| what | number |
|---|---|
| series / components / relations / watch-order rows | 343 / 679 (604 season · 38 ova · 17 special · 20 movie) / 118 / 39 |
| identity registry | anilist 343 · mal 342 · **afl 293** · afg 143 |
| how a SERIES enters today | AFL `/shows` (backfill.ts) · AFG-only expansion (afg-expansion.ts) · G52 canon-tier (a FIXED list in history/, "enforcement uncertain" per its own record) |
| how a SEASON enters today | stitch (fires only on AFL's count_mismatch) · afg-extend (only when AFG's page runs further) · OVERRIDE_CHAINS ruled extensions |
| **HALO** — unowned ANIME entries one hop from an owned entry, from staging, ZERO fetches | **1058** |
| ↳ TV-shaped story relations (SEQUEL / PREQUEL / SIDE_STORY / SPIN_OFF / ALTERNATIVE / PARENT × TV / ONA) | **178** (Shield Hero S2 pop 245k FINISHED; Re:Zero S3; DanMachi III; Devil is a Part-Timer!!; Konosuba Explosion; Classroom of the Elite S4; Trigun Stampede; Urusei Yatsura 2022; JoJo Steel Ball Run) |
| ↳ RELEASING / NOT_YET_RELEASED | **55** (Apothecary Diaries S3, Black Clover S2, Dandadan S3, Dungeon Meshi S2, Frieren S3, Oshi no Ko final, Blue Box S2, Gachiakuta S2, Shangri-La S3) |
| ↳ SIDE_STORY / SUMMARY / OTHER × MOVIE / OVA / SPECIAL | ~600 — I13's standalone bucket |
| ↳ CHARACTER / MUSIC | ~180 — noise by rule |
| **SEED GAP** — AniList top 500 by popularity, TV/ONA, source MANGA | **207 unowned of 500** = 12 halo + **195 new IPs** (177 chain heads). Horimiya is #31; Tower of God #70; Quintuplets #78; Banana Fish #85; K-ON! #102; Bocchi #110; Nichijou; Hanako-kun; Grand Blue; Nozaki-kun; Witch Hat Atelier; March comes in like a lion; NANA |
| ↳ CURRENTLY AIRING, TV/ONA, source MANGA | **56 shows: 3 owned, 53 unowned** (5 halo + 48 new IPs) |
| ↳ FALL 2026, TV/ONA, source MANGA | 29 shows: 1 owned, 28 unowned (6 halo + 22 new) |
| ↳ top 200 by popularity, novel-sourced (LN / WN / novel) | 137 unowned of 200 (Bunny Girl Senpai, Violet Evergarden, Mushoku Tensei, Oregairu, Hyouka, Eminence in Shadow…) |
| charts that EXIST but are not in the catalog ("engine zero") | 11 AFL slugs active with no series (digimon-frontier / -tamers / -02, city-hunter, kakegurui, gundam zz / zeta, kinnikuman, elemental-gelade, magia-record, shonan) held by flags; 123 of 266 staged AFG pages unregistered (some ruled excluded) |
| franchise bootstrap (connected components of series_relations ∪ AniList story / PARENT / SAME_UNIVERSE edges between OWNED entries) | **38 multi-series groups covering 96 series**; 247 singletons. Largest: Yu-Gi-Oh 9, Dragon Ball 6, Fate 5, Naruto 3, Berserk 3, Bleach 3 (with Burn the Witch), Shaman King 3, Hokuto 3, Soul Eater + Fire Force 3 |
| CHARACTER-only edges between owned series (crossovers, shared cast) | 20 (DBZ ~ One Piece, Gintama ~ Sket Dance, Bobobo ~ Assassination Classroom) — must NEVER merge |

Two readings. (a) The catalog stops where AFL's page stops: 55 announced or
airing seasons of series we already hold are invisible. (b) The catalog is a
legacy catalog: it holds 3 of the 56 manga-sourced shows airing right now.
The halo is the integrity problem; the airing list is the product edge; the
top-500 gap is the growth problem. All three are real; they are not the same
size, and (b) is the one that makes "we become the source of truth" true.

## 1. What v2 changes from v1 (after verification)

1. **AFL cannot attach to a seeded series today — a blocker, fixed in the seed
   phase.** `resolveSeries` looks a series up by `afl_slug` ONLY (resolve.ts:543)
   and otherwise mints a new slug and calls `registerIds`, which throws
   `ID COLLISION` when the AniList id already belongs to a seeded series. Every
   seeded show that AFL later charts would break the hourly cron for that slug.
   Fix: an IDENTITY-FIRST lookup (I2's own statement: every external id maps
   INTO our id) — `series_external_ids` (anilist → series_id) before the slug
   path; the AFL page then ADOPTS the series: `afl_slug` set, `afl` registered,
   AFL's rows upserted with `minted_by = 'afl'` re-stamping the wiki rows in
   place (G57: the source that carries a number owns it), AFL's types take over
   under T4 precedence, everything AFL does not carry survives. AFG already
   adopts through `audit-afg-structure --register` (I3). This is the mechanism
   that makes "seed first, AFL attaches later" TRUE; both Cursor's notes and v1
   assumed it. THE ADOPTION GATE (Cursor's closing note, v2.1): an id match is
   not proof the page is the same show — the ladder's title tiers have matched
   namesakes before (G55). Adoption of a series that already carries rows
   requires TWO signals (I3's rule): the identity match through the ladder AND
   span agreement (AFL's classified count within ±2 of our rows or a component
   boundary, I25 / I26 lag allowed); anything else is held as `adoption_held`
   for a ruling, and a seeded series' rows are never overwritten on a title
   match alone.
2. **No candidate table.** v1 proposed `discovery_candidates`. Dropped: the
   evidence is already staged (relations in `ingest_anilist_media`; rankings in
   one new staging table), the derivation is pure, the ruling is a map, and the
   census lists the queue — the P5 / P30 pattern every other queue follows.
3. **The seed engine is not "a second product to do later".** Its first list is
   CURRENTLY AIRING (56 rows, complete, 53 unowned), not top 500. Build order
   still puts it after the halo class, the franchise and the seed writer, because
   those are what promotion needs; priority-wise it is the edge.
4. **Rank by product fit, not raw popularity.** The manga node's status /
   chapters / volumes ride on the ADAPTATION edge we already fetch, so a
   continuation signal is free: Tower of God (600+ chapters, S1 adapted 78)
   outranks Horimiya (finished at 122, mostly adapted) for THIS product although
   Horimiya is more popular. Rankings persist RAW in staging; the score is
   derived and re-tunable without a refetch.
5. **Component-vs-series: a PROPOSAL with the right signals (corrected in
   v2.1 — Cursor's hold #1, confirmed in data).** "Same manga → component" is
   WRONG: naruto / naruto-shippuden share manga 30011 (scopes 1-244 / 245-700),
   bleach / thousand-year-blood-war share 30012, ranking-of-kings / treasure-chest
   share 114388, dragon-ball-z / kai share 30042 — four ruled I16 splits on one
   manga each. Only the other direction holds: a DIFFERENT manga → `series`
   (the Clear Card precedent, 30106 → 87296). The component signal is TITLE
   CONTINUITY — AniList's title is the base title plus a season ordinal ("2nd
   Season", "Season 3", "Part 2", "Final Season") with no new subtitle; a new
   title (Shippuden, TYBW, Stampede, Brotherhood) proposes `series`; a
   scope handoff (the manga continues past the owner's end) is evidence, not a
   decision. The census prints the proposal beside the row with its signals;
   Sean rules (I15 / I16 are rulings, I18 says even a source's page boundary is
   a hypothesis). The heuristic never writes.
6. **Announced seasons — corrected at build time (step 3).** An announced, UNDATED
   season does NOT join as a component: aggregate would flip the series to
   'upcoming', and the standing practice (Kingdom S6 Part 2, Rent-a-Girlfriend
   S6) is that a season joins when it has dates. The honest "Season 5 announced"
   signal is the halo listing itself (`halo_sequel_unclaimed`, status
   NOT_YET_RELEASED) — the first product use of the halo, with no new table; a
   dated season lands as a component and its rows arrive when the wiki list
   exists.
7. **Type provenance becomes a precondition for PUBLISHING seeded series.**
   Wiki-minted grids default to canon (G59) and sit in `type_default_unclassified`;
   at 200+ seeded series that default renders as a claim. The queued per-row
   provenance sidecar (docs/STATE.md) moves up: build the queue without it,
   publish nothing seeded until a default row renders as an honest dash (P6).
8. **A fifth bundle, chosen deliberately (corrected in v2.1 — Cursor's hold
   #3).** `invoke_edge_refresh(fn)` concatenates `fn` into the URL and posts an
   empty body: there is no mode knob, and inventing one is a SQL change that
   makes one function do two jobs under two budgets. The discovery run is its
   own function, `refresh-discovery`, with its own pg_cron row, run source,
   budget (G58) and freshness-map row — which is exactly G50 step 5 for a new
   reader of a source. Cost, stated: build-functions already bundles every file
   under `_src`; system-census hardcodes the four names (line 70) and must
   derive the list from the directory instead; P3's record and CLAUDE.md
   invariant 2 say "all four" and are amended to "every bundle under
   `supabase/functions/_src`" (P38 retires the four-count clause). A magic
   number in a rule was a smell anyway.

## 2. THE FRANCHISE LAYER — the top of the hierarchy (the IA answer)

**Why a column and not a derivation.** The relation graph already groups 96
series into 38 franchises correctly (Yu-Gi-Oh's nine came out as one group).
It fails exactly where Cursor said: Digimon (only 2 of 5 owned; the other three
are AFL slugs held by flags), Fate / Type-Moon (Prisma Illya is a spin-off of a
spin-off), Gundam (universes), and every crossover (20 CHARACTER edges that
must not merge). So the graph is the BOOTSTRAP PROPOSAL and membership is a
RULING — exactly the permanence pattern (a map Sean signs, a column the healer
mirrors, a class that catches drift).

**Shape (thin, one FK).**
- `franchises` (id = OUR slug per I1: `naruto`, `dragon-ball`, `fate`,
  `yu-gi-oh`, `gundam`; title; title_native; note; base_series_id nullable).
  Public read. A franchise carries NO chapter number, NO standing, NO totals.
- `series.franchise_id` nullable FK. NULL = a franchise of one (the series is
  its own IP; the UI renders it as a single card). Only multi-member franchises
  are ruled, so the map stays ~40–80 franchises / ~100–200 memberships.
- One series → one franchise. Crossovers (Isekai Quartet, the Jump specials)
  are ruled to a host or to NULL; a join table is not needed until a real case
  needs two, and none does today.

**The ruling map `lib/rulings/franchises.ts`** — `RulingEntry<{ franchise: string;
title?: string; base?: true }>` keyed by seriesId (one entry per member, reason
+ cite: "Burn the Witch: Kubo's same-universe spin-off, AniList SAME_UNIVERSE"),
ruledBy Sean. The first entry naming a `title` names the row; `base: true` marks
the entry point (else derived: the member with no outgoing relation). Healer
`assertFranchises` (assert-overrides roster) mirrors map → `franchises` rows +
`series.franchise_id`; a stored franchise_id the map does not state is a
`ruling_violation`; `series_without_franchise` lists a series with any relation
row or any TV-shaped halo hit and no umbrella; the bootstrap script prints the
proposal (connected components, CHARACTER edges excluded) for one sitting.

**Sub-groupings are DERIVED, never stored (the "then from there" layers).**

| layer | what it is | where it comes from |
|---|---|---|
| franchise | the IP: "this is Naruto" | `franchises` + `series.franchise_id` (ruled) |
| continuity | one story line inside the IP: DB → Z → {GT, Super}; DM → GX → 5D's; Zexal on its own | connected components of `series_relations` over `sequel` + `side_story` inside the franchise, kept as a DAG: GT and Super are BOTH `sequel` of Z (stored today), so a fork renders as branches and is never linearized into one strip (Cursor's hold #2); `remake` / `alternative` are cross-links between continuities (Kai ↔ Z, FMA 2003 ↔ Brotherhood), not members. Derived only — no continuity table until a sitting needs one |
| series | one catalog entry the user maps | `series` (I15 / I16 unchanged) |
| seasons + in-flow extras | same story, same numbering; movies / OVAs with a kind | `series_components.kind` (I19 / I39), order-only null spans + `watch_order_entries` (N7) |
| standalone extras | the ~600 halo movies / OVAs / specials | I13 disposition by default; a franchise "watch order" view is their intended re-entry frame (docs/architecture.md §2 already says so) |
| manga instruments | the countable books of one reading story | I41 source chains per series; a franchise reading order = the union of members' chains ordered by continuity (derived, later) |
| episode ties | this episode adapts that other work | `chain_source` / `side_source` (T26) — per row, not the IP |

**What the column buys the UI (the IA use is first-class).** Browse "by
franchise": group by franchise_id (null → own card); a franchise card = the base
series' cover, member count, "3 series · 12 seasons", sorted by the max member
popularity. Series page: "Part of Naruto" chip + the continuity strip (previous
/ next series, the handoff chapter from `series_scopes`). Search: the franchise
title appended to members' `search_text`. Discovery: the halo and seed listings
group by franchise ("naruto: 2 unclaimed TV, 11 movies unruled"), and a seed
card is franchise-shaped ("Tower of God: new IP" / "Trigun Stampede: franchise
trigun, alternative"). Seed rulings and membership rulings are written in the
same sitting; membership has ONE home (the franchises map), never a second
copy on the seed entry.

**Guardrails (rules, not preferences).** Never a merge (I15 / I16 stand; the
:re ruling is the reason the umbrella was parked). Never auto-membership from
AniList — PARENT / SAME_UNIVERSE / CHARACTER are proposal evidence only.
Never a chapter number or a standing on the franchise. Never a lock at
franchise level (§7). Amending I16 retires its clause "a franchise umbrella
above series is IA-phase work, not a merge" (P38 retiredPhrases) and lands
the new I-family record with the healer, the class and the witnesses
(yu-gi-oh, dragon-ball, fate, digimon, the crossover pairs).

## 3. Engines, in the order they pay

| # | engine | finds | cost | status |
|---|---|---|---|---|
| 0 | charts that exist, identity failed (AFL active-no-series, AFG unregistered) | series WITH types | 0 fetches; flags exist | already listed; rank them with the rest |
| 1 | HALO — story relations of owned entries, walked transitively through SEQUEL / PREQUEL (fetch + stage each hop, batched 50 per request) | 178 TV-shaped + 55 announced / airing; ~600 extras (deferred by I13) | ~22 requests once; free thereafter (the daily sweep re-stages owned entries' edges) | build first |
| 2 | AIRING NOW + NEXT SEASON (status RELEASING; season + seasonYear) TV / ONA source_in [MANGA] then [LIGHT_NOVEL, WEB_NOVEL, NOVEL] | the 53 + 28 | 4 requests / week | the product edge |
| 3 | POPULARITY top 500 (manga) + top 200 (novel) + `countryOfOrigin_in [KR, CN]` top 100 (manhwa / manhua skew) | the 195 + 137 legacy holes | ~16 requests / week | growth |
| 4 | TRENDING top 100, any source | breakouts before they rank | 2 requests / week | cheap |
| 5 | MANGA-FIRST: `Page.media(type: MANGA, sort: POPULARITY_DESC)` → ADAPTATION anime we lack | big manga with a thin or new anime (G52 shape); manga with NO anime = a watch list | 6 requests / week | later |
| 6 | same-author (`Media.staff`, Original Creator) from owned series' manga | Arakawa → Yomi no Tsugai class | optional | later |
| — | MAL / other rank lists | AniList-blind titles | a fifth source | NO (G50) until a queue proves it |

Every hit: subtract `series.anilist_id` AND `series_components.anilist_id`
(I21); if one hop from an owned entry it is a HALO row (same derivation, both
evidences); else walk PREQUEL to the chain HEAD and list the head with the best
metric of any member; propose component / series (§1.5) and a franchise (§2).
Rank is the queue's SORT KEY: never standing, never a mint, never authority.

**Score (derived, re-tunable):** popularity × continuation, where continuation
reads the manga node — RELEASING, or chapters / volumes well past what the
anime's episode count could have adapted — and airing status boosts the
current season. Stored per snapshot in staging so a riser is visible.

**AniList facets (introspected 2026-09-05 — the vocabulary the lists use).**
- `MediaSort`: POPULARITY_DESC · TRENDING_DESC · FAVOURITES_DESC · SCORE_DESC · START_DATE_DESC · UPDATED_AT_DESC (+ their ascending forms, TITLE_*, EPISODES, ID…)
- `MediaSource`: ORIGINAL MANGA LIGHT_NOVEL VISUAL_NOVEL VIDEO_GAME GAME OTHER NOVEL DOUJINSHI ANIME WEB_NOVEL LIVE_ACTION COMIC MULTIMEDIA_PROJECT PICTURE_BOOK — T25's registry already maps MANGA / ONE_SHOT / DOUJINSHI / LIGHT_NOVEL / WEB_NOVEL / NOVEL / VISUAL_NOVEL / VIDEO_GAME / GAME / ORIGINAL; COMIC and the rest fail closed (source_kind_unknown), correctly
- `MediaRelation`: ADAPTATION PREQUEL SEQUEL PARENT SIDE_STORY CHARACTER SUMMARY ALTERNATIVE SPIN_OFF OTHER SOURCE COMPILATION CONTAINS **SAME_UNIVERSE** (a franchise-proposal signal)
- `Page.media` filters: season + seasonYear · format_in · status_in · source_in · countryOfOrigin_in · genre_in / tag_in · isAdult · popularity_greater · averageScore_greater · startDate_greater / lesser · id_not_in · licensedBy_in · isLicensed · sort
- `Media.rankings { rank type(RATED | POPULAR) format year season allTime context }` — "#3 most popular of Fall 2026" is a row
- `Page.airingSchedules(airingAt_greater / lesser, notYetAired)` — everything airing this week, popularity-blind (the complete airing list)
- `Page.mediaTrends(mediaId_in, date_greater, sort)` — daily popularity / trending history (risers; optional)
- `Media.staff` (Original Creator) — the same-author engine; `Media.recommendations` — user-submitted, not for structure

## 4. Promotion — one writer, existing rulings

- **`component`** (a sequel of an owned series, same manga) = an `OVERRIDE_CHAINS`
  ruled extension + stitch's ruled-extension path (the finalize gate needs no AFL
  count: I25's ruled clause). Unaired → null-span component now (§1.6). Rows via
  G59 (wiki A / ruled page B / ruled grid C) when a list exists; else
  `grid_unminted`, honest.
- **`series`** (spin-off, alternative, a narrative shift, a new IP) =
  `lib/seed.ts#seedSeries` — history/canon-tier.ts lifted into lib and rostered
  (closes G52's "enforcement uncertain"): identity FIRST (I2) → chain walk under
  the ownership guard (I21, walk to the head, all seasons at once) → aggregate →
  series row with OUR slug (I1) → components via the planner (I39) → relations
  auto + ruled (I17) → pickManga (I38) + deriveSourceKind (T25) + scope (I36) →
  franchise (the membership ruling from the same sitting) → G59 rows → MU's
  universal cycle → AFL / AFG ADOPT later (§1.1). Types default + queue; no
  anchor, ever (A1 / A44); positions wait for research (P6).
- **`extra`** = RULED_STRUCTURE (I39) or watch_order_entries (N7) — existing.
- **`excluded` / `deferred`** = entries in `lib/rulings/discovery.ts` with reason
  + retiresWhen; DEFAULTS by rule keep the map small: CHARACTER / MUSIC →
  ignored; standalone MOVIE / OVA / SPECIAL → I13.
- The ruling map `lib/rulings/discovery.ts` therefore holds only: `series`
  promotions (the durable provenance of a seeded series, as canon-tier's TARGETS
  was), `excluded`, `deferred`. Component and extra promotions are the existing
  maps.
- Census classes: `halo_sequel_unclaimed` · `halo_series_unclaimed` ·
  `halo_extra_standing` (capped) · `seed_candidate` (ranked, capped) ·
  `discovery_ruled_unbuilt` (a `series` ruling whose id is still unowned — the
  writer did not run) · `series_without_franchise` · plus the existing
  `type_default_unclassified` / `grid_unminted` on what lands.

## 5. Research for seeded series — a protocol variant, not a rule

A seeded series has no AFL types (some have AFG's). The first ask on it is
per-episode TYPE + anchors together; the research-agent vocabulary already
carries the three standings and the annotation kinds, so this is a
`research-batch` PROTOCOL note when the first such wave is planned, and the
work-list ranks by the same product score (R27: a class is its own work-list).
The queue WILL outrun research by an order of magnitude; that is the design —
the honest shell IS the edge (P6), and §1.7 keeps a shell from lying.

## 6. Build order (each a /add-rule or a skill; never a one-off)

1. **Halo class — BUILT 2026-09-05 (I42, §12.122):** `lib/discovery.ts` (pure derivation + the transitive walk
   under a fetch budget), three classes, the discovery ruling map + defaults,
   the component / series proposal. No new source, no cron. The census lists
   178 + 55 the day it lands. Rule: "an unowned story relation of an owned entry
   is a listed candidate, never silently absent." Witnesses:
   the-rising-of-the-shield-hero (S2), re-zero, the-apothecary-diaries (S3).
2. **Franchise layer — BUILT 2026-09-05 (I43, §12.123):** migration (`franchises`, `series.franchise_id`, types
   regen), the ruling map seeded from the bootstrap proposal + franchise-rulings.md
   in one sitting, the healer, `series_without_franchise`, assemble.ts exposes
   it (the grouping UI itself is the UI pass). I16 amended.
3. **Adoption + the seed writer — BUILT 2026-09-05 (I44, G52 rostered, P39, /discover; §12.124; the first mint awaits Sean's go on the dry-run recap):** identity-first `resolveSeries` (§1.1),
   `lib/seed.ts`, the first three promotions Sean picks as witnesses (a component:
   Shield Hero S2; an alternative series: Trigun Stampede; a spin-off: Konosuba
   Explosion), edges deployed (lib changed).
4. **Rankings — BUILT 2026-09-05 (G60, §12.127):** `ingest_anilist_rankings` staging, the `refresh-discovery`
   bundle on a weekly pg_cron row (P3 / census amended to "every bundle"),
   engines 2–4, `seed_candidate`, the score.
5. **Type provenance** before any seeded series is public (§1.7).
6. **The research variant** when the first seeded wave is planned.
7. Engines 5–6 when 1–4 are classes Sean rules routinely.

Steps 2 and 3 can swap if Sean wants seeds before grouping; 1 stays first
because it is free and it is the integrity problem.

## 7. Constraints already ruled — and the lock note for later

I21 binds the seed writer (no walk into a ruled split) · I15 / I16 are rulings,
never AniList's PARENT · A1 / A44 no positions from discovery · G59 rows come
from a page or a ruled grid or the series is `grid_unminted` · I13 standalone
extras stay out by default · G50 no fifth source · P8 seeded rows carry their
writer's tier (wiki / manual / seed), never AFL's.

**Sean's lock note (a P25 amendment, later).** Today a lock is series-wide and
binary; `permanence_violation` fires on ANYTHING open. The refinement: a lock
covers the RULED DATA SET; new data enters OPEN and earns its own lock. The
natural extent is the COMPONENT: a lock names the components it covers (and so
the episode range and the chapter frontier at signing); rows inside are never
rescanned or reopened unless a rule change names them; a halo sequel promoted
onto a locked series is a new, unlocked component; the deep skips only the
locked extent; `permanence_violation` reads only inside it. The franchise is
never locked (a new sequel is a new, unlocked series). Design constraint NOW:
component promotion onto a locked series must be legal and must not count as
a violation.

## 8. Sean's premise (2026-09-05): every source's id becomes OUR id — true as a rule, with two holes

- The rule: I1 (series.id is OUR slug; a source slug is provenance) · I2 (every
  external id maps INTO series.id through series_external_ids; a collision
  THROWS; writers register inline) · I3 / I4 (AFG registers by evidence tier;
  a key two series claim never auto-matches) · I11 / I12 (dispositions are
  durable; duplicate pages are ruled) · G55 (a row dated outside its series is
  not its row) · I21 (a walk never enters another series' entry). Conflicts are
  REFUSED AND QUEUED, never guessed: 13 open afl match_ambiguous, 35 MU, 48
  Wikipedia today. That is the mechanism that makes a wrong mapping structurally
  impossible; it does not make matching automatic, and it should not.
- Hole 1: the AFL CREATE path is not identity-first (§1.1) — the one writer that
  mints by slug. Closed in the seed phase.
- Hole 2: I2 has NO outcome audit ("automation backlog" in its record). The seed
  phase adds the class: every series holds an anilist + mal registration; every
  owned AniList id appears once; every registered afl / afg slug exists in its
  staging (P5).
- A registry gap to name, not a bug: I2 lists `mu` as a registry source, but
  series_external_ids holds anilist / mal / afl / afg only. MU's id lives in
  `ingest_mangaupdates.mu_series_id` (resolved through the MangaDex bridge) and
  Wikipedia's identity in the ruled page map + the finder + G55 — both keyed by
  OUR id, so the premise holds by construction; registering `mu` (and the wiki
  page title) in the registry would make it hold by the same mechanism as the
  rest. Queue it with hole 2.
- The value proposition Sean stated — no cohesive single source of truth exists
  for anime ↔ manga correspondence; mangaMapper sources from one or many,
  verifies from one or many, tunes into a shape it alone holds, permanently
  and consistently — is what P1 (the cycle), R1 / R3 (two sources), P30
  (judgment → gate → audit) and P25 (permanence) already encode. Discovery is
  the missing first step of that chain: today existence itself is borrowed
  from AFL.

## 9. Process integration — how this becomes one more seamless function of the cycle (v2.1, Sean's ask 2026-09-05)

Every piece lands in a home the cycle already has. Nothing here is a new kind
of thing; it is new instances of the five kinds (rule / ruling / architecture
fact / process / trap) wired into the same triggers.

| cycle piece | discovery instance | the existing mechanism it rides |
|---|---|---|
| lib (P2) | `lib/discovery.ts` (pure derivation + tests) · `lib/seed.ts` (the writer) · `lib/rulings/discovery.ts` · `lib/rulings/franchises.ts` | every writer reads the lib; edges rebuilt (P3, now "every bundle") |
| healers (P20) — MINT vs ASSERT split (v2.2, Cursor) | MINT is an EVENT step, never a standard heal: `seed.ts` (a `series` ruling → a new series) and `stitch.ts` (an OVERRIDE_CHAINS component) run ONLY from `/discover`, after the dry-run recap has been seen — `npm run heal` must never create a series or a component that Sean has not seen proposed. ASSERT is standard: `assertFranchises` (map → column; creating a `franchises` row is the ruling itself), the discovery ruling-vs-state checks, all idempotent, converge in one run. `discovery_ruled_unbuilt` is the class that keeps a ruled-but-unminted seed visible between the ruling and the apply | `npm run heal` (assert only); `/discover` (mint, dry-run first); system-census refuses an unrostered healer and reads the roster's `when: 'event'` triggers |
| census (P5 / P17) | `halo_sequel_unclaimed` · `halo_series_unclaimed` · `halo_extra_standing` (capped) · `seed_candidate` (ranked, capped, with Δ since the last snapshot) · `discovery_new_since_sitting` (THE TRIGGER TO SIT) · `discovery_ruled_unbuilt` · `discovery_ruling_stale` (a ruling for an id now owned or gone — P24) · `adoption_held` · `series_without_franchise` · the I2 registry class | `npm run census`; /consolidate reads every non-zero class and explains every delta IN CHAT |
| crons (G47 / G58) | `refresh-discovery` weekly: ranking snapshots → staging; halo hops → staging; budgeted, deferral is data | the freshness map row; heal-stuck-runs; run_stuck |
| the sitting (step 4, Sean rules) | `/discover` — a skill: read STATE → derive the classes FROM DISK (P11) → print the RECAP BASELINE in chat → STOP for rulings → write the maps → dry-run → apply → heal → census → deltas → save point | the same shape as /apply-batch; rulings go to maps, never rows |
| research (step 2) | seeded series enter the research work-list ranked by the product score; the protocol variant asks TYPE + anchors together | /research-batch, R27 (a class is its own work-list) |
| capture (P29) | three /add-rule records (the candidate rule; the franchise rule amending I16; the reader rule for rankings) + the P3 amendment + the I2 audit class + the /discover skill + a changelog § | the ledger; gen-docs; one-hop cases |

**The chat checkpoints (Sean's standing rule from 2026-08-28, extended).** A
recap never sends Sean to a file or a table in the database. Each checkpoint is
a GENERATED table (a `research/discovery/baseline.ts` analogue: DB + derivation,
P5 — it cannot drift), stored state first, then the proposal, then his decision
column, grouped by franchise:

1. **The sitting recap** — one line per candidate:
   `anilist id · title [format · status] · evidence (← owner, edge | rank #N list, Δ) · stored: {unowned | excluded | deferred} · proposed: {component of X (title continuity) | series (new title | different manga 87296) | extra | standalone} · franchise: {existing X | new Y | none} → decision`.
   A block is a table titled by its franchise; unchanged / default-disposed
   rows are one summary line after it. Cap per sitting like a wave (P12): the
   55 announced-and-airing halo rows first, then the 178 by popularity, then
   the airing seeds.
2. **The dry-run recap** (the second checkpoint — the WRITER's reading of the
   ruling, which Sean has not seen at ruling time: the chain walk's result, the
   slug, the manga pick) — `seed.ts --dry-run` and `stitch.ts --dry-run` print,
   per ruling: `CREATE series <slug> ← anilist N · chain [ids] · eps · manga M · source kind · scope · franchise · relations · rows: wiki finder → K | grid_unminted` or `ADD component <label> to <series> (order N+1, null span until it airs)`. Every line is a change Sean authorises, exactly as an apply dry-run today.
3. **The post-apply census delta** — every class that moved, explained (P17):
   `type_default_unclassified`, `grid_unminted`, `series_without_franchise`,
   `discovery_ruled_unbuilt` → 0, the I2 class, `ruling_violation` = 0 (P18).
4. **The weekly trigger** — at the next /consolidate, `discovery_new_since_sitting`
   names what the cron found ("+3 halo: Frieren S4 announced; +2 airing seeds"),
   and `adoption_held` names any AFL page the gate refused to attach. Silent
   adoption (a page that passed the gate) shows as a registry delta and a
   `type_default_unclassified` decrement, explained like every other delta.
5. **Pruning** — `discovery_ruling_stale` and `halo_extra_standing`'s cap keep
   the maps and the listing from growing without a decision; a stale ruling is
   a listing for Sean, never an auto-delete (A6's spirit).

**Decisions Sean rules before code (the go-list).**

| # | decision | recommendation |
|---|---|---|
| 1 | build order | halo class → franchise → adoption gate + seed writer → rankings bundle → type provenance → research variant |
| 2 | the sitting skill | a new `/discover` skill (not a /consolidate mode): derive → recap → rule → apply → verify, one file, invoked on the trigger class |
| 3 | proposal precedence (v2.2 — Cursor's row-3 fix, confirmed in data) | (1) a ruling naming the candidate id itself is not a proposal; (2) an owner whose I15 ruling is DECLARED OPEN-ENDED (`partsAreComponents: true` on that ruling — JoJo, Monogatari, Gintama, the Pokémon Ash era: "every new part joins, whatever its title") proposes `component`; (3) otherwise the signals — a season ordinal on the base title → `component`; a new subtitle or a DIFFERENT manga → `series`; same manga = no signal. Presence in OVERRIDE_CHAINS means NOTHING here: that map is the declared CURRENT chain and holds tokyo-ghoul, cardcaptor-sakura, bleach-thousand-year-blood-war, kingdom, beastars — every one a ruled split or an extension, whose next sequel is a fork. The two witnesses define the rule: JoJo Steel Ball Run (190327 — every JoJo component carries a new subtitle, so only the declared property gets it right) and Fairy Tail 100 Years Quest (139095 — Fairy Tail's three seasons are one story with no open-ended property, and 100YQ is a ruled separate sequel; the signals say `series`, correctly). No blanket from any map presence. |
| 4 | first witnesses | Shield Hero S2 → component (order-only until rows); Trigun Stampede → alternative series, franchise `trigun`; Konosuba Explosion → spin-off series, franchise `konosuba` |
| 5 | visibility of seeded series | add `series.visibility` (`public` \| `staged`), default public for the 343, `staged` on seed; the app's list reads public only; flipped per series by ruling when types are classified (AFL / AFG adoption, T6, research) or when the provenance column renders a default row as an honest dash (P6's "hidden" is a sanctioned degrade) |
| 6 | the fifth bundle | `refresh-discovery`, weekly; P3 + CLAUDE.md invariant 2 → "every bundle under `supabase/functions/_src`"; system-census derives the list from the directory |
| 7 | franchise ids | OUR slugs (I1), ruled in the bootstrap sitting from the 38-group proposal + franchise-rulings.md; Digimon's three AFL-held slugs and the 20 CHARACTER crossovers ruled explicitly |
| 8 | G50's scope | a new READER of AniList: staging table + rule record + inline upkeep + freshness row apply; identity registration does not (no new website) |

On his go: `/add-rule` for the candidate rule (the halo class, the ruling map,
the proposal signals, the trigger class), witnesses the-rising-of-the-shield-hero
/ re-zero / the-apothecary-diaries; then the franchise record; then the seed
writer with the adoption gate. Batch 23 wave 1 stays parked behind all of it.

## 10. Build log

- **Step 1 BUILT 2026-09-05 — I42 (the candidate rule), changelog §12.122.** `lib/discovery.ts` + 15 tests · `lib/rulings/discovery.ts` (3 declared open-ended I15 rulings: JoJo, Monogatari, Gintama; no candidate rulings yet; the SITTINGS log) · `discovery-stage.ts` (PULL, event) staged 242 candidate media in 3 rounds · `audit-discovery.ts` (CENSUS, standard; ledger-check scans it) · `research/discovery/recap.ts` (the sitting recap). First census on the staged halo: candidates 1090 (276 staged) — sequel 91 · series 176 · extra 667 · ignored 156; TV-shaped unruled 267, of which 56 RELEASING / NOT_YET_RELEASED; proposals component 61 · series 179 · ambiguous 27; discovery_new_since_sitting 267 (no sitting logged yet); ruled_unbuilt 0; ruling_stale 0. Two build-time corrections: a bare number is an ordinal only as the whole, short remainder ("100 Years Quest" had read as a season count); owner titles compare with and without AniList's "(TV)" / "(2024)" disambiguator. The real 100 Years Quest id is 139095 (139274 is Gundam: Suisei no Majo).
- **Step 2 BUILT 2026-09-05 — I43 (the franchise umbrella), changelog §12.123.** Migration pushed + types regenerated · `lib/rulings/franchises.ts` (93 memberships / 37 franchises from the bootstrap; fire-force + witch-watch ruled their own IP; Burn the Witch the one universe-based membership; `franchiseMapProblems()` fails closed) + 5 tests · `assertFranchises` (93 asserted, then 0 — converges) · `series_without_franchise` 0, ruling_violation 0, no other class moved · the app reads `franchise_id` · the discovery recap groups by franchise · `franchise-recap.ts --compact` is the signing table (session-ruled until Sean signs) · I16 amended under P38.
- **Step 3 BUILT 2026-09-05 — I44 adoption + the seed writer (G52) + P39 visibility + the /discover skill, changelog §12.124.** Mechanism only: the three witness rulings are WRITTEN (Shield Hero S2-S4 as an OVERRIDE_CHAINS extension; trigun-stampede and konosuba-explosion as `series` rulings with their franchises) and the dry runs are clean, but NOTHING is minted until Sean's go on the dry-run recap (the mint rule). Findings on the way: the flags kind check was never widened (fixed); six existing entries derived staged on the first visibility run — four by ruling (pins / a grid now count as classifiers), two honestly (elemental-gelade, city-hunter: default-typed, no classifier — Sean's to publish); shounan-junai-gumi's percent-encoded afl_slug was never registered (identity_registry_gap 1); stitch.ts gained `--only <slug>` so a ruled extension applies alone; an undated announced season joins when dated (the standing practice) — §1.6 is corrected accordingly.
- **The first mint + INCIDENT-2026-09-05 + recovery (§12.125).** The three lines minted and intact; audit-titles.ts deleted six series (see the incident file); recovered the same day through the writers (source_map by rule; afg-expansion / the seed writer with restoration rulings; wiki rows; heal; the research replay from the verdict files); census clean (ruling_violation 0, 219 / 0); residues listed for Sean. Traps captured for the skills: an EVENT script runs only on its trigger, after reading it, dry-run first — and verify that a script HAS a dry-run before trusting the flag.
- **Step 4 BUILT 2026-09-05 — G60 the rankings reader, changelog §12.127.** Eight lists, the weekly fifth bundle, the seed queue (534 on the first snapshot), the product-fit score, P3 amended to every bundle. MVP metrics = the full media payload per snapshot row (ids, titles, format / status / source / country, dates, episodes, popularity / favourites / trending / scores, genres, tags, relations with the manga node's status / chapters / country); not yet used: AniList's per-media `rankings` objects, its daily trend history (our own snapshots give the deltas), staff edges (same-author), favourites- / score-weighted lists, and the two free signals we already hold (unmatched AFG / AFL index entries; MU's record of which manga have an anime).
