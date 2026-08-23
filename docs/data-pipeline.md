# The data pipeline — Phase 1.5 (ratified 2026-08-22)

Real data replaces the mock catalog. This document is the source of truth for
where mangaMapper's data comes from, how it is ingested, and the rules that
govern the canonical tables. Strategy was researched and ratified with Sean on
2026-08-21/22 (three-agent source census, all claims live-verified); do not
re-litigate source choices without new evidence.

The app never calls an external API at runtime. It reads **only our Supabase
database** through the `CatalogSource` seam
([src/data/catalog/source.ts](../src/data/catalog/source.ts)). Ingestion is a
separate, periodic concern.

---

## 1. Source roster (census verdicts, 2026-08-22)

| Source | Role | Why |
|---|---|---|
| **animefillerlist.com** (AFL) | **Filler authority** | The community wiki where classifications are *authored* (376 shows, actively edited). Server-rendered Drupal 7 HTML; episode `<tr>`s carry semantic classes `manga_canon` / `mixed_canon/filler` / `filler` / `anime_canon` — 1:1 with our `EpisodeType`. Data stated twice per page (episode table + Quick List ranges) → parse both, assert agreement. |
| **AniList** GraphQL | Metadata backbone | Open endpoint, no key. Titles/covers/status/scores/genres/relations/`idMal`/external links. Hard budget: **30 req/min** (degraded limit, enforced; treat as permanent). |
| **animefillerguide.com** (AFG) | Anchors + **structural cross-check** + expansion + **extension** | Semi-independent editorial (~458 shows, 3-way taxonomy: red=filler, blue=mixed, plain=canon). Arc sections carry **manga chapter equivalents** — the only structured episode↔chapter source found anywhere. AFG never overrides AFL on episode TYPE; but its **series/season structuring is thoughtfully curated** (Sean 2026-08-23) — consult it as evidence for stitch/franchise decisions even where AFL exists, and when unsure, confirm with Sean before choosing. Where AFL is absent entirely, AFG's own taxonomy classifies expansion series (provenance: registry source 'afg', afl_slug null); where AFL lags or stops short, AFG fills ONLY the missing episode numbers after the AniList chain independently confirms its numbering (afg-extend.ts, 2026-08-24). Its pages also carry **between-season reading guidance** in prose ("read ch 136–143 before :re") — raw HTML is kept greedily (`ingest_afg_pages.raw_html`) for the IA/arc phase. We don't mirror AFG's presentation (ruled splits stay split); we capture its data to evaluate (Sean 2026-08-24). |
| AOD 2026-27 snapshot · animeapi.my.id · arm.haglund.dev · AniList `idMal` | ID mapping utilities | For AFL-slug ↔ AniList joins the title matcher can't settle. |
| **MangaDex** | **ID bridge** (verified 2026-08-22) | Its entries carry AniList + MAL + MangaUpdates ids together (`links.al/mal/mu`; MU slug base36-decodes to their numeric id). The join layer for manga-side sources. Its chapter data itself: unusable coverage for licensed series. |
| **MangaUpdates** | **Frontier + denominator authority** where AFG is absent/stale; status cross-check; scheduled tier (Sean 2026-08-24, promoted from event-only) | Public-read API, caching required by their AUP, credit requested. Supplies: the `anime` coverage field (frontier anchors, ~140 series — multi-segment parse, §10), `latest_chapter` (effective-total denominator for publishing manga), explicit `completed` boolean + status string (manga_status cross-check — caught Frieren/Gangsta hiatuses, confirmed Outlaw Star complete), `type` Manga/Manhwa/Manhua/Novel (source_type validation, unused yet), `licensed`, `related_series` (future franchise cross-check). Full payload stages greedily. NO arc-level data (arcs stay AFG episode-side + wiki research manga-side). Release data resolves only ~50% of chapters to volumes — NOT the volume source. |
| **Wikipedia chapter lists** (planned) | Volume-boundary source | Per-series "List of X chapters" pages are publisher-derived and complete; volume boundaries are static once printed → one-time ingest per series into `volume_boundaries`. Enters via the new-source checklist (§11). |
| AniraTeam/AniFiller (GitHub) | Matcher validation seed only | 182 AFL shows with `anilist_id`/`mal_id` pre-joined. **No license — never ship its data**; use only to test our matcher's output. |
| Jikan/MAL, Simkl, AniDB, SEO clones | **Dropped** | Jikan: boolean-only taxonomy, proven AFL copy, chronic 504s, MAL ToS forbids aggregation. Simkl: filler is website-only (0 mentions in their API spec). AniDB: no filler concept in schema. skipthefiller.com / animefillerlist.tv etc.: derivative rewrites. |

**Reliability tiers**: authoritative sources (AFL for types, AniList for
metadata, AFG for anchors) write canonical directly through their gates;
cross-check-tier sources (MangaUpdates, MU anime-field, MAL flags if ever)
only raise flags that require manual confirmation before influencing
canonical. Naming/structure authority = AniList (Sean's ruling — official
titles verbatim, e.g. "Digimon Adventure:" keeps its colon).

## 2. Architecture: staging → resolution → canonical

**Staging is greedy; canonical is deliberate.**

- **Staging** stores every pull's complete raw payload (jsonb) plus a content
  hash and fetch metadata. Disk is free; re-pulls are not. Any future feature
  is answered from raw we already own — promotion is a migration, never a
  re-fetch.
- **Resolution rules** promote a typed subset into canonical tables:
  - Type taxonomy: AFL wins, always. Class → `EpisodeType`: `manga_canon`→`canon`,
    `mixed_canon/filler`→`mixed`, `filler`→`filler`, `anime_canon`→`anime-only-canon`.
  - AFG/other-source discrepancies never override — they file a flag.
  - Series metadata: AniList wins (titles, dates, scores, status).
  - Manga totals: AniList `chapters`/`volumes` when non-null (they are **null
    while a manga is publishing**); otherwise fall back to the latest known
    chapter from anchors, surfaced as "latest", not "total".
  - Anime→manga linkage: relations filtered strictly to `ADAPTATION` +
    `format: MANGA` (status RELEASING/FINISHED, highest popularity on ties);
    `PREQUEL`/`SEQUEL` same-format edges feed the source-scope floors
    (`mangaStartVolume`/`mangaStartChapter`). Edge cases → `source_map` manual override.
- **Canonical** is what the app queries via `SupabaseCatalogSource`. Every
  column is a commitment; tier-3 data waits in staging jsonb until a feature
  earns its promotion.

### The flag rule (Sean's ruling, 2026-08-22)
**Nothing suspicious ever auto-applies.** Parse-integrity failures (table vs
Quick List disagreement), taxonomy conflicts, ambiguous matches, count
mismatches, and suspiciously large diffs are written to `ingest_flags` and the
associated change is **held** until confirmed. Flags carry enough detail
(jsonb) to rule on without re-scraping. `open` → Sean confirms or dismisses.

## 3. Identity & matching

Canonical series id = **OUR OWN slug** (stable once assigned — superseded the
early AFL-slug plan 2026-08-22; own-slug migration + identity registry).
External ids (`anilist`, `mal`, `afl`, `afg`) map INTO our id via
`series_external_ids` (registry tiers: §10). `afl_slug` remains a column for
the AFL relationship, never the identity.
Matching AFL slug → AniList id, in order of confidence:

1. AniFiller seed (182 verified pairs — validation set and bootstrap).
2. Exact title match (slug-normalized) against AniList search.
3. Synonym match via AOD-2026-27 snapshot / animeapi.my.id / arm.haglund.dev.
4. Manual override in `source_map` (`match_method='manual'`).

Anything below exact confidence files a `match_ambiguous` flag instead of
guessing. The source-scope rule (DESIGN_SYSTEM §6) governs franchise splits:
one AFL show sometimes spans what AniList models as several seasons/series —
resolution recorded per-case in `source_map`.

## 4. Refresh model

> **SUPERSEDED by the implemented freshness map (§11 top)** — kept for the
> original reasoning; the live cadences are the four edge crons + event
> triggers documented there.

- **Cadence tiers** (change likelihood drives cost):
  - `airing` series: AniList daily (aired count via `nextAiringEpisode`), AFL weekly.
  - `finished` series: ingested once; monthly re-verify rotation for community corrections.
  - Full AniList sweep is ~8 requests (50 series/page) — cheap enough to run weekly regardless.
- **Change detection before download**: conditional GETs to AFL/AFG
  (`If-None-Match`/`If-Modified-Since` → 304 = skip). GraphQL has no
  conditional fetch; the 8-request sweep doesn't need one.
- **Change detection before writing**: stable-stringify → sha256 per record;
  identical hash = no write. Changed rows update surgically; `ingest_runs`
  logs per-run counts (fetched/unchanged/changed/flagged).
- **Etiquette (non-negotiable)**: AFL's `Crawl-delay: 10` honored exactly (AFG
  gets the same courtesy); identifying User-Agent
  `mangaMapper/<ver> (contact: seanreedux@gmail.com)`; scraping only ever in
  ingestion, never on a user path. AFL + AFG get a credits line in the app footer.

## 5. Where things run

- **Backfill + development**: local `tsx` scripts (`scripts/ingest/`), konomi's
  `import-anilist.ts` pattern (429/`retry-after` handling, paced batches).
  Full AFL backfill ≈ 376 pages × 10s ≈ 65 min, run once, resumable
  (staging hashes make re-runs no-ops).
- **Steady state**: the same modules promoted to a Supabase Edge Function on
  Supabase Cron (weekly scrape tier + daily AniList tier). Promotion happens
  only after the backfill and flag-review prove the parsers.
- Secrets: scripts read `SUPABASE_SECRET_KEY` from env (gitignored `.env.ingest`);
  no AniList/AFL/AFG credentials exist at all.

## 6. Schema (migrations `catalog_pipeline` → `id_registry_search`)

Staging: `ingest_afl_shows`, `ingest_afg_pages`, `ingest_anilist_media` — pk =
source key, `raw` jsonb, `content_hash`, `etag`/`last_modified`, `fetched_at`,
`changed_at`. Service-role only (RLS enabled, no anon policies).

Identity: **`series_external_ids`** (pk (source, external_id) + unique
(series_id, source)) — THE registry; every external identifier maps into our
canonical id here, and its constraints make cross-series mixups structurally
impossible. `source_map` (afl_slug pk, anilist_id, mal_id, disposition,
match_method, confidence, verified) remains the AFL-specific matching ledger
(dispositions: active/excluded/duplicate/merged).

Canonical (anon `SELECT` via RLS): `series` (tier 1+2 columns incl.
`average_score`, `popularity`, `genres`, `external_links` jsonb, cover url +
`cover_color`, source-scope fields, `search_text` = every name the series
answers to), `episodes` (pk series_id+number; `type` check-constrained to the
four tokens), `chapter_anchors` (per-episode ep↔chapter, `source`
provenance, arc name in `note`; dense where AFG covers, sparse otherwise),
`series_components` (per-season AniList entries with episode ranges + `kind`
season/movie/ova/special), `series_relations` (typed links between canonical
series: sequel/prequel/side_story/spin_off/alternative/remake).

Ops: `ingest_runs` (per-run counters + status), `ingest_flags` (kind, detail
jsonb, status open/confirmed/dismissed) — the confirm queue.

## 7. Field tiers (AniList pull set, live-verified 2026-08-22)

- **Tier 1 (app needs now)**: id, idMal, title{romaji,english,native},
  synonyms, status, episodes, nextAiringEpisode{episode,airingAt},
  startDate/endDate, coverImage{extraLarge,color}, popularity, relations
  (ADAPTATION/PREQUEL/SEQUEL edges w/ chapters·volumes·status).
- **Tier 2 (filter-ready, same request)**: averageScore, meanScore,
  favourites, trending, genres, tags{name,rank,isMediaSpoiler}, format,
  season/seasonYear, duration, source, studios(isMain), isAdult,
  externalLinks{site,type,language,url} ("where to watch", free),
  description, bannerImage.
- **Tier 3 (staging-only until needed)**: rankings, stats, trailer,
  streamingEpisodes; paginated collections (staff, characters) cost extra
  requests — on-demand per series later, never in the sweep.

## 8. Franchise structure & identity (Sean's rulings, 2026-08-22)

- **One continuous story = ONE series**, even when AniList models it as
  multiple season entries. `series_components` records every AniList entry a
  series is built from (season order + episode ranges in the series'
  continuous numbering) — the aggregate is ours, the provenance is explicit,
  and future per-season UI markers read straight off the ranges.
- **Major narrative shifts = separate series** (Naruto → Shippuden, Dragon
  Ball → Z → GT). **Remakes/recuts are separate entries too** (DB Kai retells
  Z). `series_relations` keeps the relation vocabulary verbatim (sequel,
  prequel, side_story, spin_off, alternative…) for future linking and
  recommendations.
- **AFL's page boundaries are the starting hypothesis, not ground truth**:
  every franchise with multiple AFL pages gets a consensus evaluation
  (community treatment, cast/continuity breaks) against the Naruto/DragonBall
  baseline before its structure is finalized — rulings recorded in
  docs/franchise-rulings.md, unclear cases confirmed with Sean. AFL sometimes
  splits what are plainly seasons (Food Wars "plates").
- **Movies, films, and OVAs are OUT of v1** (ruling 2026-08-22) — recorded as
  `source_map.disposition = 'excluded'` with notes, so re-inclusion is a
  disposition flip. **Backlog note for the re-evaluation**: a franchise
  "watch order" / "canonical order" view — a sensible entry path through a
  multi-series universe so users aren't overwhelmed — is the intended frame
  for bringing movies/OVAs back.
- **Duplicate AFL pages**: more classified episodes wins; loser =
  `disposition 'duplicate'`. Unclassified shows (0 episodes) stay out of
  canonical unless status is `upcoming`; they auto-return when AFL classifies.
- **Canonical identity is OURS**: `series.id` is our slug from the resolved
  title (stable once assigned; year → AniList id as collision tiebreakers),
  `afl_slug` is just a source pointer. Forced by the alias-corruption
  discovery below; also fixes Drupal collision slugs (BLUE LOCK at
  `blue-lock-0`) leaking into app URLs.

## 9. AFL alias corruption (discovered 2026-08-22)

AFL deleted/restructured its "Films/OVAs/Specials" collection pages and
Drupal reassigned the orphaned URL aliases across other shows — ~37 index
slugs served the wrong show entirely (`/shows/chrono-crusade` → Thus Spoke
Rohan Kishibe; `/shows/digimon-adventure-02` → Code Geass: Akito, index
anchor included). Defenses now permanent in `stageAfl`: the page's episode
links must agree with the requested slug AND the served h1 must agree with
the index anchor title — either mismatch holds the page (never stage another
show's data). Victims are excluded with notes; the shows whose slugs were
stolen (Kakegurui, Blue Period, Bakemonogatari, Pokémon generations, City
Hunter, Zeta/ZZ Gundam…) are unreachable on AFL until they fix it —
**periodic re-audit** (audit-titles.ts against a fresh index) restores them
when AFL does.

## 10. Resolution rules — the complete inventory (quick reference)

Priority of authority: **AFL** owns episode types and per-episode data; **AniList**
owns series metadata; **AFG** (future) contributes chapter anchors and
cross-checks; nothing else influences canonical. Every rule below is enforced
in code (`scripts/ingest/`), and every violation flags rather than guesses:

| Rule | Effect | Where |
|---|---|---|
| Table/QuickList integrity | AFL page's two data statements must agree, else held | afl.ts / stageAfl |
| Alias defense | page's episode-link slug AND index-anchor title must match the requested slug, else held | stageAfl |
| Hash gate | identical content hash = no write; diffs are row-scoped | stageAfl / stageAniList |
| Large-diff hold | >20% of known episode types changing in one pull = held for confirmation | stageAfl |
| Empty hold | 0 classified episodes = not published (unless status upcoming) | resolveSeries |
| **Sparse guard** | finished show with <60% of episodes classified on AFL = held, auto-returns as coverage grows (Kinnikuman was 4/137) | resolveSeries |
| Stitched-series guard | multi-component series refresh only episodes; aggregates belong to the stitcher | resolveSeries |
| Count mismatch | AFL vs AniList aired drift >12 = informational flag | resolveSeries |
| Stitch finalize gate | chain must cover AFL's numbering ±2, else flag | stitch.ts |
| **Lag rule** | chain may exceed AFL when the whole excess fits in the newest (airing) component | stitch.ts |
| Early-stop | chain walk halts once AFL's count is covered (ruled-separate sequels stay out) | stitch.ts |
| Duplicate rule | two AFL pages, one series: more classified episodes wins; per-season pages duplicating a stitched series = duplicate disposition | cleanup/stabilize |
| Match ladder | source_map → AniFiller seed → exact title → synonym (series formats preferred), else flag | match.ts |
| Identity | series.id is OURS (slugified title, stable once assigned); afl_slug is provenance only | resolveSeries |
| **Identity registry** | every external id maps into series.id via series_external_ids; writers register inline; collisions throw | registerIds (resolve.ts) |
| **Scope-audit gate** | AFL classifying MORE than the matched entry aired (>2) = mis-scope, stitch or flag — AFL cannot know unaired episodes | stitch.ts candidates |
| AFG alignment gate | AFG's numbering must match ours ±12 before anchors write; strict episode-cell parse (no digit-mashing) | afg-backfill / afg.ts |
| **Source-scope enforcement** | an entry shows ONLY its own range of the manga (Naruto = vol 1-27/ch 1-244, never the franchise); curated `series_scopes` rows applied by every writer; sequel-linked series sharing a manga without scope rows are auto-flagged | applyScope (resolve.ts) / scopes-apply.ts |
| **Anchor monotonicity** | chapters never decrease as episodes advance — junk source cells self-identify and drop (AFG's Naruto "ep 141 → ch 21"; 63 junk anchors on One Piece) | deriveAnchors (afg.ts) |
| **Tail honesty (coverage gate)** | the manga_only tail computes only when anchors reach the run's end; an unknown adaptation frontier shows NO tail rather than a fabricated one | buildMapping (supabaseSource.ts) |
| **Base-type padding** | unclassified gaps/tails pad with the series' own base type (canon for manga series, anime-only for originals) — never hardcoded canon | buildSpans (supabaseSource.ts) |
| **Legend by count** | type badges render purely from data counts, never source-type branching (mock-era branches hid real tags twice) | AnimeCard legend |
| **Derivative-manga rule** | AniList's ADAPTATION edge is directionless: a source=ORIGINAL anime never claims its linked manga (that manga adapts the ANIME — Evangelion class); a manga edge on a source-less old entry counts as source-evidence | resolveSeries / sourceType |
| **latestKnown synthesis** | a FINISHED series' coverage IS its scope end — position instrument synthesizes from totals when anchors are absent; airing-unanchored stays honestly pending | buildMapping (supabaseSource) |
| **MU-frontier rule** | MangaUpdates' curated anime-coverage field becomes a real anchor (source 'mu'). The field is MULTI-SEGMENT prose (MHA lists every season's endpoint; Naruto's covers three series with an EP number belonging to the Boruto clause): parse ALL Vol/Chap pairs, pick the largest inside THIS series' scope segment, require chapter progress beyond existing anchors (else same-stale, skip), trust an EP pin only in single-pair text (else pin at run end). 'mu' anchors are wiped + rebuilt every audit run — a rule fix heals all series at once | audit-manga-coverage.ts |
| **Coverage audit** | every series self-classifies (anchored / synthesized / mu-frontier / honest-pending / unknown-flagged / no-source); new pending classes get RULES, never per-series fixes | audit-manga-coverage.ts |
| **Expansion guards** | AFG-only series enter through exact-match-or-flag (whitespace-insensitive full-title equality; accented queries retry ASCII-folded), sparse, and alignment gates; the dedup guard flags AFG pages of existing series rather than duplicating them. STITCH-AWARE since 2026-08-24 (Sean's go): AFG numbers franchise-continuously, so the matched entry's SEQUEL chain is walked before the alignment gate — multi-season AFG-only shows (Solo Leveling, Oshi no Ko…) create with proper season components | afg-expansion.ts |
| **Ownership guard** | a chain walk (stitch, expansion, extension) never crosses into an AniList entry another canonical series already claims — ruled splits (Bleach→TYBW, TG→:re, Naruto→Shippuden) are safe by construction, whatever a source's continuous numbering suggests | ownedAnilistIds / walkChain (lib/chain.ts) |
| **Prequel-hijack fallback** | AniList PREQUEL edges can be chronological side stories, not series heads (MONSTERS ONA → One Piece; Berserk Memorial class): when the walked-back chain lands far from target, retry forward-only from the matched entry and keep whichever numbering fits | walkChain (lib/chain.ts) |
| **AFG extension (merge, never replace)** | for REGISTERED afg pages covering more than we hold: the AniList chain must independently confirm AFG's numbering (same ±2/lag finalize gate as the stitcher); on confirm, components rebuild and AFG fills ONLY missing episode numbers — existing AFL rows stay the type authority; id/title/afl_slug never change; ruled-split pages skip by name; unconfirmed → flag | afg-extend.ts |
| **Registration tiers** | AFG↔canonical identity enters the registry by evidence strength: slug / full-title equality auto-register; prefix (subtitle-stripped) matches need INDEPENDENT episode-span agreement (±2 of our max or a component boundary); a title key two series claim is ambiguous and never auto-matches; explicit rulings live in the RULED map (Sailor Moon 90s ≠ Crystal; AFG digimon-adventure = the 1999 series) | audit-afg-structure.ts --register |
| **MU targets: UNIVERSAL** | every manga-linked series is an MU staging target (Sean 2026-08-24: "MU applies to ALL series as check + validation" — the DBZ 520-vs-519 display needed MU's chapter number for a manga whose anchors were fresh, which the old absent-or-stale filter skipped); frontier anchors still apply only where anchors are absent/stale | mu-backfill.ts / refresh-mu (daily, ≤20 stalest) |
| **Episode-floor invariant** | displayed totals can NEVER be lower than our own episode numbering (Sean 2026-08-24: "how can the total ever be lower than the episode count?"). Small overshoots (≤2: recap/ep-0 numbering — a lumped page overshoots by a whole cour, so no confusion) floor automatically in EVERY totals writer; larger ones flag for research and floor only once RULED (EXTRAS_ADOPTED: angel-beats 16, rurouni-kenshin 100, eyeshield-21 155 — real broadcast content AniList doesn't count). Enforced in resolveSeries, refreshStitchedVolatile, stitch, expansion, extend, reconcile — refreshes can never revert an adopted floor | applyEpisodeFloor / EXTRAS_ADOPTED (lib/resolve.ts) |
| **In-flow extras stay in** | OVAs/movies essential to a series' flow join it (Initial D Third Stage, HxH Greed Island, Kizu, AoT Final Chapters) as kind-tagged components (season/movie/ova/special) — the UI phase surfaces the tags; where AniList has no connected entry (the EXTRAS_ADOPTED three), the totals adopt the episodes and component tagging waits for the IA phase | walkChain bridge formats / OVERRIDE extras / EXTRAS_ADOPTED |
| **Movies count ONLY when numbered** (Sean 2026-08-24) | a movie/OVA enters episode counts ONLY when the community numbering explicitly numbers it (Initial D Third Stage = AFL's ep 40, kind:movie component 40–40; AoT Final Chapters = eps 88–89, kind:special); un-numbered in-flow content holds a season_order position with NULL episode range (Kizu movies) — watch-order placement, zero effect on counts/aired/strip. UI phase: numbered movies get a kind badge on their row + distinct strip glyph; order-only ones render as interstitial watch-order dividers | series_components kind + null-vs-numbered ranges |
| **Community-count rulings** (Sean 2026-08-24 refinement) | the community-consensus episode count is the truth: specials/ep-0s the community numbers are IN (UBW's ep 0 — counts may start at 0; Boxer's Fist = Ippo's ep 76; Souten's DVD eps 23-26); large events it does NOT number are order-only (Psycho-Pass = 41 + First Inspector/films as events — AFL wrong there; K's Missing Kings; Hayate's OVA+movie; DxD's mid-run ep 0). Caps live in COMMUNITY_COUNT_OVERRIDES, enforced at every episode write + totals clamp | lib/resolve COMMUNITY_COUNT_OVERRIDES / filterEpisodeRows |
| **Numbered-specials research trigger** (Sean 2026-08-24) | ANY non-typical entry (special/OVA/movie/recap) numbered into a run by any source surfaces for evaluation against community consensus — ask Sean, record the ruling in the REVIEWED set. First sweep: 34 found, 8 session-ruled, 26 in Sean's evaluation queue | audit-ui-truth special_numbered_unreviewed |
| **AFL-range merge on refresh** | episode refreshes delete/rewrite ONLY within AFL's own numbering range (≤ aflMax) — AFG-filled tails and curated rows beyond it survive AFL page changes | resolveSeries / stitched-guard refresh (lib/resolve) |
| **Anchor freshness** | anchors count as an active frontier only when they reach near the run's end; a stale set shows its truthful-but-old "as of ep N" and files a research flag — synthesis NEVER overrides a stale anchor (a diverged anime — Soul Eater — would otherwise claim full-manga coverage) | audit-manga-coverage.ts |
| **Effective total (Sean 2026-08-24)** | while a manga publishes, AniList totals are null but MU's latest_known bounds the series from below: it is the EFFECTIVE total for tail math and the bar cutoff; the DISPLAYED count renders the em dash (AnimeSeries.totalChapters carries NO latest_known fallback — the strip gets the effective total via mangaAheadChapters); synthesis still requires real totals. AniList has NO current-chapter field at all — the frontier can only come from MU (or research) | buildMapping + toAnimeSeries (supabaseSource) |
| **Manga-status cross-check** | MU independently states publication status (`completed` boolean, first line of the status string) vs our AniList-derived manga_status — disagreement flags for review, never auto-applies (caught Frieren/Gangsta/Ahiru no Sora hiatuses; Outlaw Star confirmed complete by Sean 2026-08-24 — the standing example of the rule working) | crossCheckMangaStatus (lib/mu-frontier.ts) |
| **Chapter-number vs chapter-count spaces** | AniList `chapters` is a COUNT (mid-run specials included — AoT says 141); MU `latest_chapter` is the last chapter NUMBER (139, the space anchors live in). Tail math uses `min(totals, latest_known)`; latest_known now writes for ALL manga (the number-space end), display totals stay AniList's | buildMapping (supabaseSource) / MU writers |
| **Same-edition band (MU latest)** | MU's latest_chapter is release-record-derived: reliable for currently publishing manga, GARBAGE for old completed ones (Dragon Ball came back "149" of 519). Every latest_known writer accepts it only within 80% of AniList's count; failures write NULL (heal prior bad writes) + flag. Scope rows are the ruling lever for consensus ends (DBZ/Kai end_chapter=519 completed 2026-08-24 — the seed notes always said 195-519) | sameEditionLatest (lib/mu-frontier) / all MU writers |
| **Continuation handoff** | a same-manga sibling whose scope adjoins this entry's scope end continues the story — the residue between frontier and scope end is franchise flow (Shippuden adapted Naruto's ch 239-244), NOT a manga-only tail; suppressed in buildMapping (Naruto→Shippuden, Berserk 1997→2016). Inter-segment reading gaps (Berserk ch 88-94) surface in the universe view later | continuationStart/buildMapping (supabaseSource) |
| **Anchor numbering conversion (Sean 2026-08-23)** | research anchors arrive in EXTERNAL numbering (MAL/Wikipedia season counts) but our community-count numbering can differ — a mid-run numbered OVA/special SHIFTS every later episode (Haikyu's Riku vs Kuu OVA = our eps 61-62, so "S4 end = MAL ep 85" is OUR ep 87; recorded unconverted, eps 86-87 nulled). Convert at application time and say so in the anchor note; the frontier_tail_null audit class catches misses | apply-research scripts + audit-ui-truth |
| **Episode-type overrides** | research-ruled type corrections where a source misclasses episodes against community consensus (X eps 21-24: AFL says manga-canon, research says anime-original ending → anime-only-canon renders them truthfully, no chapter counterpart BY DESIGN). Lives in EPISODE_TYPE_OVERRIDES, re-applied inside filterEpisodeRows at EVERY episode write — a bare DB update would be clobbered by the next AFL refresh | EPISODE_TYPE_OVERRIDES / filterEpisodeRows (lib/resolve.ts) |
| **Frontier-tail triage (audit class frontier_tail_null)** | canon eps past the last anchor render null ch (beyond-frontier honesty). Every hit is exactly one of: (a) mis-numbered anchor → convert numbering (Haikyu), (b) mistyped episodes → type override (X), (c) real side-story/continuation content → research or side-story notation (Kenshin 95-98, S2-aired-since-anchor series). Never auto-fix — each needs a ruling | audit-ui-truth.ts |
| **Non-monotonic display ruling (Sean 2026-08-23)** | adaptation order may legitimately jump BACK — a later episode can adapt an earlier chapter. Confirmed anchors render AS STORED in every display (the curve keeps decreasing points; section headers render high-to-low ranges, never collapsed). Junk protection moved to WRITE time (chapter-space gates) + audits (anchor_nonmonotonic asks Sean per hit; anchor_beyond_chapter_space = junk by definition) — never silent display-side drops (the old monotonic filter hid Boruto's Naruto-space ch-710 anchors instead of surfacing them) | anchorPoints (src/lib/mapping.ts) + coverageLabel (EpisodeList) + audit-ui-truth |
| **Chapter-space gates (all anchor writers)** | an anchor chapter must fit the series' own manga space (max(total_chapters, latest_known)+10). AFG: one out-of-space anchor means the page is franchise-continuous numbering — whole page withheld + flag (Boruto ch 702-710). MU: a coverage pin past the space means partial structure (Slime held only S1) or edition mismatch — withheld + flag ('out_of_space') | syncAnchors (lib/anchors) / applyMuFrontier (lib/mu-frontier) |
| **Chapter-floor invariant (Sean 2026-08-23, symmetric to the episode floor)** | the chapter space can never be SMALLER than what confirmed anchors reach: latest_known writes reject an MU number below the non-MU anchor max (Kakegurui's "9" was a volume count against ch-55 anchors). Fallback: MU's status string often carries the real chapter count ("67 Chapters (Ongoing)") — bestLatestKnown tries release-derived first, status-parse second, both behind band + floor; failures null-heal + flag | bestLatestKnown / muStatusChapterCount (lib/mu-frontier), all three latest_known writers |
| **Boundary-aware volumes everywhere** | EVERY chapter→volume readout prefers real print boundaries (volume_boundaries), ratio only as boundary-less fallback — estimated episode rows must never contradict curated anchor volumes (Kenshin ep-29 showed ratio vol 6 beside the anchor's real vol 7). Boundaries ride on AnimeSeries.volumeBoundaries into the client curve | chToVol (src/lib/mapping.ts) + toAnimeSeries (supabaseSource) |
| **AFG continua source (Sean's full-source ruling 2026-08-23)** | every AFG page — chartless all-canon shows included — carries a structured continua-manga table: end-of-anime frontier (episode → chapter equivalence), continue-from chapter, and that volume's collected range (a real volume boundary). Parsed by parseContinua (lib/afg), staged in ingest_afg_pages.raw.continua, applied via applyContinua (lib/anchors) behind the FULL gate stack: identity guard (the heading names the series, entity-decoded + year-suffix-stripped — AFG template bugs are REAL: Cuckoos' page carried Dandadan's table → withheld + flag), sanity band (continue-from is READING GUIDANCE, not a frontier restatement — AFG legitimately says "skip ahead"/"restart earlier"; only a >40-ch gap marks the parse suspect), chapter-space gate, episode sanity. PRECEDENCE at the one-anchor-per-episode PK: manual/wiki never overwritten (continua cross-CHECKS them; >1 ch disagreement flags), chart-'afg'/mu yield to the curated continua (>2 ch disagreement still flags). Boundaries write absent-only; Wikipedia disagreement flags. Wikipedia + manual research stay CO-VERIFIERS everywhere — AFG coverage never limits the other sources (Sean, verbatim). Freshness: refresh-afg applies inline per page refresh; afg-continua-apply.ts sweeps for backfills/rule-fix healing; afg-continua-backfill.ts is the fetch campaign | parseContinua (lib/afg) / applyContinua (lib/anchors) / refresh-afg / afg-continua-* scripts |
| **Asterisk model (Sean's ruling 2026-08-23)** | non-linear adaptation facts become first-class per-episode data in `episode_annotations` (kind: divergence / partial / graft / rearranged / side_story / loose_parallel / abridged + chapters + cited note). ANY annotated episode renders an asterisk in the UI — representation is a later design pass, the data lands now. This IS the side-story notation's data model (Kenshin 95-98 = side_story 'pilot one-shots'). Research findings populate it; never guessed | episode_annotations table / apply-research batches |
| **Three-numbers model (research finding 2026-08-23)** | a finale is often non-linear, so three DIFFERENT quantities exist: the frontier (anchors), `series.max_adapted_chapter` (highest chapter touched when ≠ frontier — Kowloon reaches 82 in ep 11 while its finale sits on 79), and `series.continue_from_chapter` (where to actually resume — may skip recaps or backtrack; AFG continua parses it explicitly, refreshed daily; continua owns it only where it owns the frontier — manual rules both otherwise) | series columns + applyContinua + research batches |
| **Metadata contract (Sean 2026-08-23)** | every displayed field has EXACTLY ONE derivation path, and episode-level display data comes ONLY from the hydrated series (getById) — the shallow list item renders identity fields only (title/cover/status/counts). Incomplete inputs degrade GRACEFULLY, never garbage: junk-pattern titles ("(01).") normalize to pending at parse time (570 rows across 32 series were stored junk from AFG extension fills); the year line computes from VALID air dates only and hides when none exist (never NaN). Completeness is AUDITED: title_incomplete + airdate_incomplete are the episode-data initiative's work-lists | parseAfgPage title guard / airYears (AnimeCard) / audit-ui-truth |
| **Asterisk review workflow (Sean 2026-08-23)** | what an asterisk entails DERIVES from episode_annotations by aggregation (single source of truth — no series-level list to drift; one series can carry multiple kinds across multiple episodes). series.asterisk_review tracks the WORKFLOW: null = no annotations, 'pending' = awaiting Sean's sign-off (set automatically by writers + healed by the audit), 'approved' = signed off in the asterisk UI pass. asterisk_unreviewed audit class = the sign-off queue | episode_annotations + series.asterisk_review + audit-ui-truth |
| **Source numbering translation (Sean 2026-08-23, the Ryuusui lesson)** | every per-episode source lives in its OWN numbering space. A watch-order entry (special/OVA/movie) that a source NUMBERS but our community count holds order-only shifts every later row — titles AND types (AFL numbered Ryuusui as dr-stone ep 36; our 36-58 were +1 poisoned). SOURCE_NUMBERING_SHIFTS (lib/resolve) declares drop+shift per series, applied inside filterEpisodeRows so EVERY writer translates; merge delete-boundaries use the TRANSLATED max. Fractional wiki labels (35.5 / 0.5 — community notation for between-episodes entries) PROVE a page shares our numbering space; a mid-run order-only series whose page shows no fractional separators is withheld until verified. Ryuusui-class verification queue: k, hayate, ippo, monogatari flagged | SOURCE_NUMBERING_SHIFTS / filterEpisodeRows / wiki-episodes-backfill fractional evidence |
| **Fractional watch-order positions (design decision QUEUED for the UI phase)** | Sean 2026-08-23: consider rendering order-only entries at their community fractional positions (35.5-style) inside episode lists, or asterisk them — decided alongside arcs/watch-order/IP-umbrella UI. Data side already models them (order-only comps + annotations); wiki fractional rows are parsed and available | UI phase backlog |
| **Research-logged non-main entries (Sean 2026-08-23)** | every fractional/OVA/movie/special/recap ruling carries its REASONING in data (ingest_fractionals.note + disposition: excluded_recap / order_only / modeled; component kind + notes; REVIEWED set comments with confidence) — the UI pass decides surfacing FROM this record, never from memory | ingest_fractionals / series_components / REVIEWED_NUMBERED_SPECIALS |
| **LN instrument ruling (Sean 2026-08-23)** | light-novel-sourced series (34: the 86/Re:Zero class) get a VOLUME-space instrument — anchors/frontier/continue-from in LN volumes, same machinery; per-series behavior research logged as it lands; UI adaptation in the UI pass. Implementation = a coming batch | docs ruling; build pending |
| **/consolidate skill (Sean 2026-08-23)** | the standing consolidation directive is an invocable skill (.claude/skills/consolidate) — writer sweep, lib→edges, staging freshness, healer rescans, census with ruling_violation=0 gate, docs ledger, frontend contract, save point. Run after every significant rules change. **`deep` mode (Sean 2026-08-23)** adds a full-catalog rescan: all entries re-evaluated against current rules; notes/suppressions are scanned not skipped (invalid note → surface to Sean; clear-cut supersession → apply + update note + report, never silently); stale logic/flags/staging cleaned; FINISHED + fully-published + Sean-signed series are LOCKED and drop out of routine rescans. Deep runs often while data logic is in flux, tapers as it stabilizes | .claude/skills/consolidate/SKILL.md §9 |
| **Bonus/fractional chapters: record, never drop (Sean 2026-08-23, the Vanitas lesson + amendment)** | a NON-INTEGER chapter in a source chart is a bonus/Memoire/Entracte entry (AFG listed Vanitas ep 5 as "8, 9, 10, 15.5"; max-take scraped 15.5 — Sean caught it). The derived POSITION anchor uses the highest MAINLINE integer — but the bonus association is NEVER silently dropped: deriveBonusChapters records every one as a fill-only graft annotation (asterisk_review → pending), because we must always know what content makes up an episode (possible "everything in this episode" UI later). A research-verified fractional anchor IS legal at the manual tier — sometimes the bonus is what the episode adapts. anchor_fractional_chapter audits DERIVED fractional anchors only | lib/afg.ts deriveAnchors + deriveBonusChapters / syncAnchors / audit-ui-truth |
| **No degenerate component spans (2026-08-23, the Santen Sensou-hen lesson)** | a component with nothing aired holds a NULL episode span — never start > end (Tokyo Revengers' announced season was written 51-50). writeComponents guards; integrity_degenerate_span audits | lib/chain.ts writeComponents / audit-ui-truth |
| **anime-only-canon ≠ anchor desert (2026-08-23, the Black Clover lesson)** | episodes typed anime-only-canon have no manga counterpart BY DESIGN — they never count toward anchor_gap_research (Black Clover 130-157 adapts ZERO chapters across 28 episodes; position holds at ch 228 until ep 158). The typing itself is research-ruled per episode (EPISODE_TYPE_OVERRIDES) | audit-ui-truth gap counter / EPISODE_TYPE_OVERRIDES |
| Dispositions | active / excluded / duplicate / merged rulings are durable data; backfill skips non-active | source_map |

**Hard-won learnings** (why some rules exist): AFL's Drupal is corrupt since
~2023 (§9); Wayback `id_` raw URLs redirect to the *nearest raw capture,
years off* — recover from rendered snapshots with count-validation against
AniList totals; sparse AFL pages are real community-coverage gaps, not bugs;
AniList `chapters/volumes` are null while publishing.

## 11. Operations runbook

### The freshness map (one view of pull → fresh → canonical, 2026-08-24)

| Source | Event pull (new data enters) | Scheduled freshness | What reaches canonical | Gates on the way in |
|---|---|---|---|---|
| **AFL** | `backfill.ts` (full sweep / new sources via checklist) | `refresh-afl` hourly :40, ≤20 stalest, 6d window | episode rows + types via `resolveSeries` (episode floor applied) | alias-corruption defenses, count gates, sparse guard, dispositions, per-series rulings via filterEpisodeRows (community caps + type overrides — EVERY episode writer: resolve, stitched-guard, stitch, expansion, extend) |
| **AniList** | staged inline by every chain walk / match | `refresh-anilist` daily 08:10, full batched sweep | series metadata + totals (floored), volatile fields; stitched series via `refreshStitchedVolatile` (floored) | naming authority, derivative-manga rule, ownership guard, scope application |
| **AFG** | `afg-backfill` (`--force` after parser changes); `afg-expansion` / `afg-extend` for structure; `afg-continua-backfill` (campaign) | `refresh-afg` daily 09:20, ≤25 stalest, 13d window | anchors via shared `syncAnchors` (registry-first); **continua frontiers + volume boundaries via shared `applyContinua` (inline per refresh)**; expansion/extension structures (floored) | monotonicity, alignment ±12, **chapter-space gate** (franchise-continuous numbering withheld whole-page), **continua gates** (identity guard, self-consistency, precedence: manual/wiki kept + cross-checked), chain-confirm ±2, ruled-split skips, registry tiers |
| **MangaUpdates** | `mu-backfill` (universal — every manga behind a canonical series) | `refresh-mu` daily 09:50, ≤20 stalest, 7d window | `latest_known_chapters` via `bestLatestKnown` (release number → status-string chapter count, band + chapter-floor guarded), frontier anchors, status-conflict + edition-divergence + out-of-space flags — all via `lib/mu-frontier` | MangaDex-bridge-only identity, scope-segment multi-pair parse, chapter-progress guard, **chapter-space gate on pins**, **chapter-floor invariant on latest_known**, anchor-freshness rule |
| **Wikipedia** | `volumes-backfill` (event: volumes-staleness flag from syncAnchors) | none — boundaries static once printed | `volume_boundaries` | title-token overlap, 3 wikitext dialects, exceed-totals flag |

### The research tier (Sean 2026-08-24; AMENDED 2026-08-23)

**RESEARCH-FIRST rule (Sean's accuracy directive, 2026-08-23)**: flags and
source disagreements are NEVER presented to Sean as raw numbers. Web
research (search, wikis, community threads, AI-assisted lookups) runs
FIRST — it is cheap and usually decisive (the Beelzebub "disagreement" was
actually a cancelled-ending rearrangement neither source captured; HxH's
chart cell counted a one-scene gag reference as coverage). What reaches
Sean is a cited verdict with context he can evaluate in one read: what the
episode actually adapts, which source was right and why, links. Derived
writers (AFG chart, AFG continua, MU) can be WRONG in ways only prose
knowledge catches — partial adaptations, timeline rearrangement, gag
references — so ties and oddities escalate to research, not to a blanket
precedence rule.


When a flag survives rule resolution AND cross-source checks — the answer
verifiably exists in community knowledge but not in our structured sources —
it escalates to **deeper research**: web/wiki/community investigation
("where do I continue the manga" threads are first-class evidence), with
**≥2 corroborating sources required**, findings recorded in the flag's
verdict with URLs, and application only on Sean's sign-off. The escalation
question ("want deeper research on this?") belongs in any flag-confirmation
conversation. Curated results land as: manual anchors (source 'manual'),
scope rows, EXTRAS_ADOPTED entries, or episode-row curation — all durable,
all surviving refreshes.

**Maintenance audits** (run after any batch; all idempotent):
`audit-manga-coverage` (self-healing: frontiers + latest_known + cross-checks),
`reconcile-structure` (episode-floor invariant + late-airing entries),
`audit-ui-truth` (read-only: what the card actually renders),
`audit-afg-structure` (AFG cross-check + `--register`),
`cleanup-flags` (dedupe). Shared rule logic lives in `lib/` only — scripts and
edge functions consume the same functions (chain.ts, mu-frontier.ts,
anchors.ts, resolve.ts), so a rule fix lands everywhere at once.

All scripts run as `npx tsx --env-file=.env.ingest scripts/ingest/<script>.ts`
(`.env.ingest` = SUPABASE_URL + SUPABASE_SECRET_KEY, gitignored; regenerate
via `supabase projects api-keys`).

- `parser-check.ts` — fixture regressions (AFL, AFG, Wikipedia); run after touching any parser.
- `backfill.ts` — full AFL sweep (honors dispositions, ~65 min, resumable 24h window).
- `afg-backfill.ts` — AFG sweep → staging + chapter anchors (`--force` re-fetches after parser changes).
- `volumes-backfill.ts` — Wikipedia volume boundaries for anchored manga (one-time-ish; boundaries are static).
- `rederive-anchors.ts` — recompute anchors from STAGED AFG pages, no refetch (after derivation-logic changes).
- `scopes-apply.ts` — sync curated series_scopes into canonical + auto-flag unscoped shared-manga series.
- `stitch.ts` — multi-season chains; idempotent; override chains + ruled titles live at the top.
- `merge.ts` — multi-AFL-page merges (config at top).
- `relations.ts` — rebuilds series_relations (auto + RULED pairs).
- `audit-titles.ts` — periodic corruption re-audit against a fresh index snapshot.
- `audit-afg-structure.ts` — structural cross-check of every staged AFG page vs canonical (naming / episode-grouping / season-hierarchy); classifies aligned vs conflict vs registry-gap. With `--register`, enters confident matches into the identity registry (tiers + RULED map, §10). AFG numbers episodes franchise-continuously, so `AFG max > ours` usually means unstitched newer seasons (afg-extend candidates) or a deliberate split of ours, and `< ours` means a season-scoped page.
- `audit-ui-truth.ts` — replicates buildMapping's exact per-series decisions (what the CARD renders: full / ch-only / pending / no-source / structure-integrity); run after any pipeline batch — the data-level coverage audit can say "resolved" while a UI gate still blanks the display. Keep in lockstep with supabaseSource.ts.
- `reconcile-structure.ts` — episodes outrunning the component structure (late-airing finale specials: AoT's Final Chapters aired after the stitch, and +2 sits inside every gate's tolerance) walk the chain to the episodes' end; confirm → structure rebuilds, no confirm → accepted-extras flag; ruled extras skipped by name. Idempotent — run after AFL refreshes land new trailing episodes.
- `cleanup-flags.ts` — dedupe exact-duplicate open flags (keeps oldest); never dismisses unique flags.
- `afg-extend.ts` — for registered afg pages covering more than we hold: chain-confirmed component rebuild + episode tail/gap fill from AFG (merge semantics, §10). Run after registration; re-run any time AFL lags a currently-airing season.
- `wayback-recover2.ts` — archive recovery for corruption victims (rendered snapshots + count validation; the v1 id_-form script was deleted — id_ URLs redirect to captures years off).
- `rebuild.ts` — **DANGER post-stitching**: re-resolves everything as single-season, clobbering stitched aggregates. Only for canonical-shape migrations, and re-run stitch after.
- `pilot.ts` / `cleanup.ts` / `stabilize.ts` / `polish-ids.ts` / `fix-mismatch.ts` / `assisted-prep.ts` — historical one-shots, kept as patterns.
- Flag review: `ingest_flags` where status='open' — confirm/dismiss is the human loop; nothing suspicious ever auto-applies.

### New-source checklist (Sean's ruling 2026-08-22: no one-offs, ever)

Any new data source (MangaUpdates, Wikipedia volumes, …) enters through the
same repeatable mechanism or not at all:

1. **Staging table** (`ingest_<source>_*`): raw payload jsonb + content hash +
   fetch metadata; service-role only. Greedy — store everything, ideally
   including raw HTML/source text (AFG re-fetch lesson).
2. **Identity registration FIRST**: map the source's id to our `series.id` in
   `series_external_ids` before writing any derived data. The registry's
   constraints make cross-series mixups impossible; collisions throw.
3. **Rules layer**: what the source is authoritative for vs cross-check-only
   (§10 table gets a row); conflicts and anomalies flag, never guess.
4. **Inline upkeep**: registration and derived writes happen inside the
   source's regular puller — never a separate script someone must remember.
5. **Docs**: source added to §1 roster with its role and reliability verdict.

Reliability tiers (Sean 2026-08-22): authoritative sources write canonical;
lower-reliability sources serve as cross-checks and require manual
confirmation via flags before influencing anything. Long-term note: no single
external source covers everything we need well — mangaMapper's own curated
dataset may eventually become the better provider; track gaps accordingly.

**Refresh cadence — IMPLEMENTED 2026-08-23, RATIFIED by Sean (re-evaluate
freely as needs evolve — faster or slower per safety/usefulness; the knobs
are one-line cron edits + the staleness windows in each function):**
- `refresh-anilist` edge function, **daily 08:10 UTC**: full-catalog metadata
  sweep (~10 batched requests over all series + season components); changed
  media re-resolve their series (stitched series get a volatile-field
  recompute via `refreshStitchedVolatile` — the stitcher's structure is never
  touched by refresh).
- `refresh-afl` edge function, **hourly at :40, ≤20 stalest pages per run**
  (staleness > 6 days): edge wall-time limits forbid one big sweep, so small
  batches cycle the catalog inside the weekly cadence; most runs no-op
  instantly. Conditional GETs + the inline alias-corruption defenses apply.
- `refresh-afg` edge function, **daily 09:20 UTC, ≤25 stalest pages per run**
  (staleness > 13 days → pages cycle ~biweekly, matching AFG's slow editorial
  pace). Changed pages re-sync anchors through the shared `syncAnchors` path
  (lib/anchors.ts: monotonicity filter, alignment gate, registry, flag
  dismissal) — which also fires the **volumes-staleness event**: anchors
  advancing past the last known volume boundary flag that manga for a
  `volumes-backfill` re-run (how the event-driven validation tier gets its
  events).
- `refresh-mu` edge function, **daily 09:50 UTC, ≤15 stalest staged MU rows
  per run** (staleness > 7 days → each manga cycles ~weekly; ~1.5s API
  spacing, hash-gated on the acted-on fields only so rating churn doesn't
  fake changes). MU was PROMOTED to the scheduled tier 2026-08-24 (Sean):
  it supplies frontier anchors and the latest_known denominator — weekly-
  release data that goes stale on a wall clock. Inline upkeep on change:
  latest_known (publishing only), frontier re-derivation, manga-status
  cross-check (all via lib/mu-frontier.ts — shared with mu-backfill and
  audit-manga-coverage). Event triggers remain: mu-backfill on new-series
  ingestion.
- **Validation tier is EVENT-DRIVEN, never scheduled** (Sean's ruling
  2026-08-23; MU graduated OUT of this tier 2026-08-24): Wikipedia
  boundaries are static-once-printed (one-time ingest
  when a manga enters, `volumes-backfill` re-run only on flags);
  niche sources are invoked to verify or cross-check when a change or
  conflict warrants it — cross-check sources validate, they don't refresh.
- Mechanics: pg_cron → `invoke_edge_refresh(fn)` (SECURITY DEFINER, reads
  Vault: edge_base_url / edge_anon_key / edge_cron_secret) → pg_net POST with
  the shared-secret header; functions verify `x-cron-secret`. Secrets set via
  the service-role-only `set_vault_secret` RPC — never in the repo. Edge
  artifacts are GENERATED bundles of `scripts/ingest/lib`
  (`build-functions.ts`) — the libs remain the single source of truth; never
  edit `supabase/functions/*/index.ts`.
- Not yet cron'd (deliberately): the stitcher (runs on flags after refreshes —
  weekly manual or watcher until AniList stabilizes), audit-titles re-audit
  (monthly manual), new-show discovery from AFL's index (backfill.ts run
  occasionally; the hourly function refreshes known pages only).
**On randomized intervals to obscure footprint: deliberately NOT doing that.**
Our strategy is the opposite of stealth — an identifying User-Agent with
contact info, honored crawl-delay, conditional GETs that cost the host ~zero.
Randomized timing wouldn't hide anything from a server log (the UA identifies
us on every request) and being openly polite is what keeps scrapers welcome.
Fixed weekly is correct.

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
