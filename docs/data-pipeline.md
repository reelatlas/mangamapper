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
| **MU-frontier rule** | MangaUpdates' curated anime-coverage field becomes a real anchor (source 'mu'). The field is MULTI-SEGMENT prose (MHA lists every season's endpoint; Naruto's covers three series with an EP number belonging to the Boruto clause): parse ALL Vol/Chap pairs, pick the largest inside THIS series' scope segment, trust an EP pin only in single-pair text (else pin at run end). The write sits behind FIVE gates (sibling-scope ceiling, chapter-space, airing-pin, scope-consumed, A1 episode-type) plus the pin-episode redundancy skip and curated precedence. 'mu' anchors are wiped + rebuilt every audit run — a rule fix heals all series at once | applyMuFrontier (lib/mu-frontier), shared by audit-manga-coverage / mu-backfill / refresh-mu |
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
| **Episode-type overrides** | research-ruled type corrections where a source misclasses episodes against community consensus (X eps 21-24: AFL says manga-canon, research says anime-original ending → anime-only-canon renders them truthfully, no chapter counterpart BY DESIGN). Lives in EPISODE_TYPE_OVERRIDES, re-applied inside filterEpisodeRows at EVERY episode write — a bare DB update would be clobbered by the next AFL refresh. STANDING rows are asserted by assert-type-overrides.ts (2026-08-25, the eyeshield ep-74 lesson: a ruling entering the map after a row's last write left the row stale until the audit flagged it) — run after any override addition; ruling_violation is the outcome check | EPISODE_TYPE_OVERRIDES / filterEpisodeRows (lib/resolve.ts) / assert-type-overrides.ts / audit ruling_violation |
| **Episode-type semantics (Sean 2026-08-25, ratified during batch-17 wave 1)** | `canon` = adapts manga canon. `anime-only-canon` = anime-original but CANON to the series (author/producer/community consensus). `filler` = ZERO canon content. `mixed` = canon AND non-canon in one episode (single-scene canon share = judgment call, facts presented). AFL/AFG typings are advisory starting points — the tag is determined by OUR research of the episode's actual canon correspondence, recorded via EPISODE_TYPE_OVERRIDES | research-agent definition / EPISODE_TYPE_OVERRIDES / verdict curation |
| **Continue-read regimes + re-use is true data (Sean's C3 clarification, 2026-08-25 — completes A4/C2)** | the continue point is governed by COVERAGE and KNOWN FUTURE anime coverage, never by which episode a chapter appears in. (1) Skipped/out-of-order material WILL be covered by known later episodes → PARITY: continue points at the skip, and the continue_note names any already-covered later chapter to skip on arrival (iruma ep 63: END 142, continue 143, "skip 145 when you reach it"). (2) Not known / never covered → continue = furthest-covered + 1, with the skip range annotated for reader context. (3) A chapter appearing in many episodes is listed as TRUE in every row (chapters_adapted/annotations); re-use NEVER moves position — only furthest first-time coverage does. (4) A first-time out-of-order adaptation anchors truthfully at what it adapts (zatch ep 51 → ch 22) with the reorder annotated; a RE-USE never anchors (ranma ep 130, shugo-chara ep 59). Every jump records its why so the UI pass can surface it | lib/c3.ts (single predicate) / apply-parity-continues.ts C3 pass (stamps notes, paginated) / audit continue_skip_unnoted (outcome check, 351 healed 2026-08-25) / apply-batch CURATED_CONTINUES / A4 coverageAnchor |
| **Chapter overlap never proves filler (Sean 2026-08-25, the zatch-bell lesson)** | episodes may legitimately share chapters (two episodes can both adapt key parts of ch 40); "every chapter is claimed elsewhere" is an anchoring aid, NEVER a typing proof. Overlap is discounted only when the later episode merely rehashes with nothing new. Each episode is typed on its own content: any real canon → not filler. First application: zatch-bell's 10-ep contested block re-research (the exhaustive-accounting argument alone was ruled insufficient) | research-agent definition / verdict curation |
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
| **Episode display = FIRST chapter animated (Sean 2026-08-23)** | an episode row shows where it STARTS in the manga, never its end/mid point (Oshi no Ko ep 35 displays 119, not 127). Starts are REAL SOURCE DATA, not formula output: AFG chart rows list every chapter a row adapts — deriveAnchors captures the first mainline chapter into chapter_anchors.start_chapter on EVERY refresh (baked into lib + all four edges; 3888 anchors carry it), and research anchors populate it when a batch names the span (majority rule applied at research time when a span opens with a chapter tail; ties → ruling). The mapping-layer derivation min(end(ep), end(prevCanon)+1) is the FALLBACK for end-only anchors (MU pins, unseeded research rows) — it implements the majority rule by construction. chapter_anchors.chapter stays the END-POSITION instrument (interpolation, frontier, continue-from; scan verified all 4337 anchors share that semantics). The source layer emits the real span ("119-127") so display takes the first number; section headers keep TRUE coverage (start of first row → coverage end of last). Future research batches include start_chapter with their anchors. Long-term: every chapter correlates to its episode (spans + annotations accumulate this); visually we anchor at starts | lib/afg.ts deriveAnchors / syncAnchors / chapter_anchors.start_chapter / supabaseSource toEpisodes / mapping.ts canonEpStartCh |
| **Continue-reading points (Sean 2026-08-23; UI deferred)** | where to RESUME READING after an episode is first-class data, distinct from display: default = anchor end + 1 (the end chapter itself when a partial annotation marks a mid-chapter stop); research-named exceptions (skips, grafts, mid-chapter endings) live in chapter_anchors.continue_chapter with the why in the note (9 seeded: JJK 47→138, Oshi 35→127, RAG 12→52 + 24→103, Dragon Maid 25→65, Seraph 24→42, Blue Exorcist 37→38, Food Wars 73→265, Vanitas 5→10). series.continue_from_chapter stays the series-level lever. When a point changes, update the column + note via a ruling record | chapter_anchors.continue_chapter / apply-continue-points.ts |
| **Full adaptation record (Sean 2026-08-23)** | for EVERY episode/special/movie we store everything the sources know about what it adapts: chapter_anchors.chapters_adapted = the complete chapter list IN ADAPTATION ORDER (canonical "63-64, 67" serialization — non-contiguous, non-chronological, bonus values included), alongside start_chapter / chapter(end) / continue_chapter. Captured from AFG chart rows on every refresh; research batches supply it for their anchors; higher-fidelity fills lower (full list > span > end-only), never the reverse. This is the correlation the UI can later surface ("everything in this episode") | chapter_anchors.chapters_adapted / serializeChapters (lib/afg) / syncAnchors |
| **Anchor numbering translation (2026-08-23)** | per-episode data from a source translates through SOURCE_NUMBERING_SHIFTS exactly like episode rows — anchors AND bonus annotations (translateEpisodeNumber in lib/resolve; dropped order-only entries never anchor). Closed the gap where a shift-ruled series with an AFG chart could receive anchors at untranslated numbers | translateEpisodeNumber / syncAnchors |
| **MU pin redundancy keys on the PIN EPISODE (2026-08-23, Sean's AoT 88-89 report)** | applyMuFrontier deletes + re-derives each run, so its skip-gates decide what knowledge survives. The old "non-MU anchors within 12 eps" freshness window and chapter no-progress gate deleted real run-end pins the moment research added interior anchors nearby (AoT ep-89→139, Kuroko 75→275, Naruto 220→238) — and the beyond-frontier display rule then nulled every trailing episode. A pin is redundant ONLY when a non-MU anchor covers the pin episode itself; episode-space knowledge counts even at zero chapter progress. frontier_tail_null 23→7 (better than the pre-regression 14 — the old gate had been suppressing pins all along) | lib/mu-frontier applyMuFrontier |
| **MU franchise-conflation gates (Sean's D1 ruling 2026-08-24, the batch-17 five-case class)** | MU's coverage prose is franchise-level, and a SEQUEL's endpoint sits INSIDE the manga's chapter space where the chapter-space gate can't see it (ace-ii ep52 got Season 2's ch 259; yowamushi ep38 got the season-5 end 544; gantz ep26 the Gantz:O movie's 280 on a filler row; toriko ep147 a past-frontier volume on a filler row; prisma-illya ep42 a different manga's value). Three writer gates: (1) **sibling-scope ceiling** — entries sharing `manga_anilist_id` bound each other: a pin must stay BELOW the next sibling's `manga_start_chapter` (Naruto < Shippuden's 245); implemented as a scope FILTER so the multi-segment parse still picks this entry's own labeled pair, with refusal+flag only when nothing survives. Remakes (equal starts) don't constrain each other. (2) **scope-consumed** — when non-MU anchors already reach the end of the entry's scope (min(total, ceiling−1)) but the pin episode extends beyond all research, the trailing episodes cannot adapt this scope: refuse+flag (caught dragon-ball ep153, research terminal afg ep148→194 = ceiling−1). (3) **A1 episode-type** — a pin landing on a filler/anime-only row is refused+flagged (allow-list canon/mixed, unknown types fail closed; row-less episodes pass): 14 series refused on first run, 11 standing violations healed + gantz/toriko/TPN-ep23-class prevented. Refusal flags are kind `count_mismatch` (the established withheld-frontier kind). First catalog run: mu pins 80→66, every removal triaged | applyMuFrontier (lib/mu-frontier) + audit-manga-coverage classes mu_refused_* |
| **MU_FRONTIER_SUPPRESSED (declarative suppression record, D1 2026-08-24)** | for an entry whose MU pin is wrong for a reason NO structural gate can derive, a curated suppression in the lib blocks the rewrite (the delete-at-entry still heals the standing pin). Each entry carries reasoning + the retiring condition. Sole member: prisma-illya — its seasons adapt THREE manga in ONE chapter space; MU's "Vol 2, Chap 14" is S1's first-manga completion, and the run-end assumption lands it on the 3rei!!-adapting movie ep 42 (the consumed check misses by one chapter: research ENDs stop at 13, 14 is the unadapted epilogue). Retires when the D2 split lands | MU_FRONTIER_SUPPRESSED (lib/mu-frontier), surfaced as healer class mu_suppressed |
| **Curated repairs live at the MANUAL tier (2026-08-24, the hikaru ep-75 wipe)** | a repaired value is a RESEARCHED value. Derivation-tier rows (mu / afg / afg-continua) are wipe-and-re-derive by contract — batch-17's hikaru ep75 166→148 repair sat on a mu row and the first gated frontier pass wiped it back to 166. The apply-script repair pass now flips derivation-tier sources to `manual` on application (research-tier sources keep provenance); hikaru restored manual ch148/v17, mashle ep24 re-sourced. Scan verified the other 14 repair-marked rows already sat at manual | apply-research-batch-17.ts repair pass (template for future batches) |
| **A1 outcome verification (2026-08-24)** | the audit now verifies A1 catalog-wide: an anchor from ANY source on a filler/anime-only row is class `anchor_on_noncanon_row` (loose series exempt — their borrow-maps are ruled non-linear). Each hit is a triage fork: junk anchor (delete via research, honest terminal on the last canon/mixed ep) or WRONG ROW TYPE (research deliberately anchored it — retype) — never auto-delete. First census: 49 hits (40 afg chart position-values led by one-piece 19 / dbz 7 / ranma 6; 9 manual anchors suggesting mistyped rows, e.g. cardcaptor ep7 "filler" adapting ch 7). Open review queue; whether to extend the type gate to the AFG writers is a Sean decision (D4) — it would delete ~40 chart anchors and degrade interpolation until research replaces them | audit-ui-truth.ts anchor_on_noncanon_row |
| **Ruled extensions (2026-08-23 s2)** | an override chain may be RULED to run beyond its AFL page (`ruledExtent` on stitch.ts OVERRIDE_CHAINS — the AFL-lag class: Kingdom S5/S6, Beastars Final, Black Butler Public School/Emerald Witch, Magus Bride S2, Golden Kamuy S3-Final, Rent-a-Girlfriend S4/S5, Slime S2-S4): standing candidates (every run re-asserts the ruled structure when it drifts, flag or no flag), finalize gate = the chain COVERS AFL's numbering (the ruling covers the excess), id/title stable, episode rows merge within AFL's translated range only (rows beyond — Wikipedia/AFG fills — survive), order-only extras hold null spans; `--dry-run` previews | stitch.ts ruledExtent / structureMatches |
| **Wikipedia episode-list locks (2026-08-23 s2)** | a page set merges only when its offset into OUR numbering is PROVEN, in this order: date/title votes (margin lock) → season-label component lock ("season N" = every numbered component whose LABEL names season N — two-part seasons included; positional N-th fallback when labels are silent; an airing tail is capped at the known total) → continuity lock (a set whose integer rows begin exactly at merged-max+1, fit our count, dates monotonic — Kingdom S6 on the main page) → exact-name first-segment fallback ONLY when the page's earliest air date sits within a year of our start (namesake guard: "List of Kingdom episodes" is the 2007 British drama; Slime's main page carried the Tensura Nikki spin-off). Disambiguated list forms ("List of X (Japanese TV series) episodes") are tried first. Mid-run order-only alignment evidence = fractional separators OR page top == our count (a page that numbered an insert overshoots by the inserts — Magus Bride S2) | wiki-episodes-backfill.ts lockAndMerge / datesCompatible / countAligned |
| **Frontend gate is `tsc -b` (2026-08-23 s2)** | the verifier proves assemble.ts + mapping.ts, never the browser wrapper (supabaseSource.ts) — the allBoundaries() helper vanished in a refactor and every card open threw while the verifier and the census stayed green. Before any save point: `npx tsc -b --noEmit` = 0 errors (regenerate src/integrations/supabase/types.ts after migrations so the gate stays real; `tsc -p .` on the solution tsconfig checks nothing) + `npx vite build` | consolidate skill §7 |
| **Reorder regime — formulas never bridge a reorder (Sean's MHA 107/113 report, 2026-08-23 s2)** | every anchor point is on-trend (≥ the running maximum) or inside a jumped-back block. Interpolation, the prevEnd+1 start derivation and the successor cap only operate BETWEEN points of one regime; across a boundary they returned plausible-but-wrong numbers (MHA ep 107 → 221 via the cap, ep 113 → 241 via prevEnd+1 — both rows annotated rearranged, so the verifier's exemption let formula output pass). Now: an ESTIMATE inside a reorder crossing renders null (an honest hole), an exact end-only row shows its END, and the verifier lists such rows as `hole` lines — the exact-record work-list — never failures. The AoT rule fixed AFG-derived starts; this closes the mapping-layer derivations | anchorPoints.onTrend / bridgeable / regimeAt / inReorderCrossing (src/lib/mapping.ts); verify-series-display.ts |
| **Section envelope (Sean 2026-08-23 s2)** | a section header's range is the TRUE envelope of its rows — lowest row start anywhere in the section to highest coverage end anywhere in it (MHA 106-126 = "vol 23-30 · ch 221-295", not the first→last "250-295" that hid the MVA block); volumes follow from those chapters. Supersedes the high-to-low header rendering: rows show the flow as stored, the header shows the span | buildEpisodeList sections (src/lib/mapping.ts) |
| **Sliver rule (Sean 2026-08-23 s2, MHA ep 170)** | START = the first chapter animated. A leading PARTIAL of the immediately preceding chapter IS the start unless it is scraps (≤ 5 pages, or a sliver/teaser/cold-open fragment): 429 p.3-4,14-19 (8 pages) makes ep 170 start 429, not 430. A far-earlier chapter opening an episode is a relocated graft/flashback and never the position (AoT ep 87, MHA ep 126 → 220 graft). The apply script normalizes agent records mechanically from their page counts (33 starts corrected in batch 14) so one rule governs every record | apply-research-batch-14.ts sliver rule; research protocol |
| **Running-order END normalization (2026-08-23 s2, Dagashi S1)** | an agent may report END as the last chapter in the episode's running order (a scrambled sampler: "58, 32, 15" → 15). Our END is the POSITION instrument — the furthest mainline chapter touched — so the apply script lifts it to the highest chapter in the adapted list when it sits below the start; the full list keeps the real order | apply-research-batch-14.ts |
| **Volume-boundary identity + numbering space (2026-08-23 s2)** | TEN manga carried boundaries from OTHER series' Wikipedia pages (Slime ← Cells at Work!, Made in Abyss ← Claymore, Yona ← Noragami, Wind Breaker ← Ushio & Tora, Kamisama Kiss ← 20th Century Boys, Hikaru ← Rurouni Kenshin, Gangsta ← Black Lagoon, Drifters ← Vagabond, Ajin ← Arslan, Killing Bites ← Vampire Knight, +6 more: Boarding School Juliet, Pluto, Sanda, Fist of the Blue Sky, Detective School Q, Project ARMS) — pre-08-24 search matches never healed; Dragon Ball's came from the Z list in Viz's RESTARTED numbering (Z ch 1 = original 195), three families ran past their manga's end (Cardcaptor + Clear Card, Rosario Season II, Tokyo Ghoul). Rules: the manga's own title leads the page search; a page whose parse repeats/backs up volume numbers is a franchise page and is skipped; a manga whose family no longer qualifies loses its stale rows; a FINISHED manga's rows past its total are trimmed and the last kept row closed at the total; research-tier rows (source 'research') may carry volumes a page can't (Dragon Ball v17-42, Slime v1-32) and close the last wiki row before them. Outcome-side: audit classes boundaries_wrong_page / boundaries_beyond_total (both 0 after the heal) | volumes-backfill.ts [mangaIds]; audit-ui-truth |
| **Research bookmarks: one per series (2026-08-23 s2)** | every batch agent's flags_for_sean land as ONE review bookmark per series (detail.kind_of_note = 'sean_review_bookmark', full text in the in-repo verdict JSON) — not one per note | apply-research-batch-14.ts |
| **Watch-order entries: canonical + surfaced-by-ruling (Sean 2026-08-24)** | order-only specials/OVAs/movies live as app-readable rows in `watch_order_entries` (position numeric, title, air date, kind, chapter/volume/chapters_adapted full record, note) mirrored from ingest_fractionals by sync-watch-order.ts. An entry RENDERS in the episode table only when a per-series ruling sets `display_label` (RULED_LABELS in the sync script). SURFACING IS PARKED (Sean 2026-08-24, after a brief live trial): it returns with the specials/OVAs/movies STATUS design pass. **Sean's intended v2 logic — THE REFERENCE POINT**: entries render as episode rows in the +N format (#170+1 'More', #170+1.5 'I am a hero too' for MHA) and COUNT AS UNITS — the section header envelope includes their chapters (…-431.5) and volume, section counts include them, they appear on the manga strip, are selectable/steppable like episodes, and the series episode total reads "170+1.5"; the +N format is a PER-SERIES ruling (community-derived for MHA), not a global convention. The render path (EpisodeList entries prop, geometry-exact insertion after ep N−1 / floor(position)) is built and dormant; the deeper unit integration (spans/strip/lookup) is the design-pass work. Until then every entry stays data-ready with display_label null | watch_order_entries + sync-watch-order.ts / EpisodeList entries / toAnimeSeries watchOrder |
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
| **AFG** | `afg-backfill` (`--force` after parser changes); `afg-expansion` / `afg-extend` for structure; `afg-continua-backfill` (campaign) | `refresh-afg` daily 09:20, ≤25 stalest, 13d window | anchors via shared `syncAnchors` (registry-first); **continua frontiers + volume boundaries via shared `applyContinua` (inline per refresh)**; expansion/extension structures (floored) | monotonicity, alignment ±12, **chapter-space gate** (franchise-continuous numbering withheld whole-page), **A1/D4 gate (2026-08-25): chart anchors on filler/anime-only rows dropped at the writer; continua frontier pins on them refused (`refused_episode_type`, continue-from still applies as guidance) — outcome-checked by anchor_on_noncanon_row**, **continua gates** (identity guard, self-consistency, precedence: manual/wiki kept + cross-checked), chain-confirm ±2, ruled-split skips, registry tiers, per-source numbering spaces (translateEpisodeNumber 'afg') |
| **MangaUpdates** | `mu-backfill` (universal — every manga behind a canonical series) | `refresh-mu` daily 09:50, ≤20 stalest, 7d window | `latest_known_chapters` via `bestLatestKnown` (release number → status-string chapter count, band + chapter-floor guarded), frontier anchors, status-conflict + edition-divergence + out-of-space flags — all via `lib/mu-frontier` | MangaDex-bridge-only identity, scope-segment multi-pair parse, **sibling-scope ceiling**, **chapter-space gate on pins**, **airing-pin rule**, **scope-consumed refusal**, **A1 episode-type refusal**, MU_FRONTIER_SUPPRESSED, pin-episode redundancy, curated precedence, **chapter-floor invariant on latest_known** |
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

**BATCH PROTOCOL (amended 2026-08-23 for the full-record model)** — every
anchor a research batch delivers carries the FULL shape, not just the end:

- **Agent contract**: for each anchor, agents report the complete adapted
  span/list ("adapts 119-127", "63-64, 67 pulled forward"), the episode's
  END chapter, the FIRST chapter animated (majority rule applied at
  research time when a span opens with a chapter tail), a continue-reading
  point when it differs from end+1 (skips, grafts, mid-chapter endings),
  and rearrangement/graft/partial/divergence annotations. 2+ sources with
  URLs per anchor. Numbering conversions into OUR cumulative space are the
  agent's job (per-season → cumulative; OVA-inclusive sources flagged).
- **Apply-script contract** (apply-research-batch-N.ts): anchors upsert
  chapter + start_chapter + chapters_adapted + volume; continue_chapter
  where named; annotations + asterisk_review pending; repairs of existing
  curated values are called out as REPAIRS in the script header, never
  silent. Fandom wikis fetched via api.php (HTML is Cloudflare-blocked);
  animefillerguide often shares lineage with fandom — corroborate key
  boundaries with a genuinely independent third source (episode↔chapter
  TITLE matches and Wikipedia volume boundaries are strong independents).
- **Rearranged zones (the GTO 20/21 lesson, Sean 2026-08-23)**: exact known
  per-episode adaptation ALWAYS becomes an anchor — even non-monotonic
  (as-stored rendering + the rearranged annotation make it legal). Leaving
  exact values annotation-only lets interpolation paint plausible-but-WRONG
  numbers across the zone (GTO ep 20 showed ~68 while the annotation knew
  73-74). Zone-level-only knowledge stays annotation + acknowledged
  approximation, surfaced by rearranged_zone_unanchored until researched.
  AMENDED batch 15 (2026-08-24): once research PROVES only zone-level
  knowledge exists, the annotation gains a `zone-acknowledged (batch N)`
  marker and moves to the rearranged_zone_acknowledged census class —
  an accepted approximate render, no longer an open research target
  (apply-research-batch-15.ts writes the marker AFTER annotation upserts;
  audit-ui-truth splits on it).
- **Anchored row-less episodes (the cells-at-work 12/13 lesson, 2026-08-24)**:
  an exact record proves the episode exists — AFL/wiki row sparseness must
  not hide it from the mapping layer (anchor points read
  episodes[].mangaMapping, so an anchor without an episode row was invisible
  and its crossing re-flagged as a hole DESPITE full research).
  assemble.ts toEpisodes synthesizes a canon title-pending model row for any
  integer-numbered anchor ≤ aired with no DB row; real rows always win.
- **Relocated openers are never the START (AoT ep-87 rule, re-enforced batch
  15)**: a research record whose start_chapter is a far-earlier
  relocation/graft (jjk ep 30 ch 64, shippuden ep 204 ch 419) poisons the
  PREVIOUS row's derived start through the successor-span cap
  (mapping.ts canonEpStartCh). START = first on-trend chapter; the
  relocation stays leading in chapters_adapted + the graft annotation.
  Run-end endpoints are equally load-bearing: replacing ippo's mu 558 pin
  with the honest ep-127 record flattened eps 105-123 via the coverage
  clamp — RESOLVED by Sean's A4 ruling (below).
- **Coverage = furthest adapted, finale = honest record (Sean's A4 ruling,
  2026-08-24)**: an anime may END on a relocated earlier block (Ippo 124-127
  = Post-War 400-414 aired last). The finale anchors to what it ADAPTS
  (display start per the sliver rule); COVERAGE — and continue-read =
  coverage+1 — is the max-chapter anchor across the run, never the run-end
  anchor (assemble.ts coverageAnchor; the run-end anchor stays the frontier
  EPISODE). Anchors NEVER encode resume positions (the old mu-558-as-anchor
  shape is retired); resume lives in continue_chapter. Cameo/sliver
  borrowings (Clear Card 12/14 ch-39/46, Ippo 76's 2-page ch-383 gag) are
  never anchors or position data — annotation + verdict JSON only.
- **THE POSITION & CONTINUE-READ LOGIC, AS ONE UNIT (consolidated 2026-08-25
  at Sean's direction — the four rulings below compose; read them together):**
  1. **Anchor = honest record** (A4): every anchor states what ITS episode
     adapts — first-time out-of-order adaptations anchor truthfully
     (zatch ep 51 → ch 22); RE-USE of an already-adapted chapter never
     anchors (ranma ep 130, shugo-chara ep 59) but is always LISTED as true
     data (chapters_adapted/annotations). Episodes may share chapters;
     sharing never moves position.
  2. **Series position = coverage** (A4): the furthest first-time-adapted
     chapter across the run (max anchor), never the run-end anchor — a late
     flashback or backfill never drags position down.
  3. **Continue-read = a regime choice** (C1/C2/C3): mid-chapter end → the
     straddled chapter itself (C1, re-read a few pages); skipped material
     the anime WILL cover in known later episodes → parity with the anime
     (C2), and the note names any already-covered later chapter to skip on
     arrival (C3); skips never covered / future unknown → coverage+1 with
     the skip range noted for context (C3).
  4. **Every jump explains itself**: reorder/graft/skip facts live as
     annotations + continue_notes so the UI pass surfaces WHY, never just
     the number.
- **CONTINUE-READ = ANIME PARITY (Sean's C2 ruling, 2026-08-24; migration
  20260825200000)**: where the next canon/mixed episode's start is KNOWN,
  continue_chapter = that start — the reader stays in step with the anime
  even across skips and back-jumps — with the chronological next-unseen
  value and skip facts preserved in continue_note; continue_kind ∈ parity |
  unseen (frontier/unknown future) | post_series (finale: coverage+1).
  Mid-chapter ends keep C1: continue = the straddled chapter (re-reading a
  few pages is fine; no page-level hunting). Converted catalog-wide
  (batch15/apply-parity-continues.ts: 1838/317/20); NOTHING is UI-surfaced
  yet — data-first until the continue-read design pass.
- **Count-space vs number-space: one display, one space (Sean's Tokyo Ghoul
  144/143 report, 2026-08-24)**: for a finished manga, AniList's total is a
  COUNT (mid-run specials/oneshots included) while MU's latest is the last
  chapter NUMBER; the position row's denominator deliberately shows the
  NUMBER when the two sit within the same-edition band (assemble.ts
  totalChapters). Every position instrument must live in that same space: a
  MU frontier pin landing between latest_known and total_chapters inside the
  band is a count-space value and is CONVERTED to latest_known at the writer
  (lib/mu-frontier.ts applyMuFrontier, conversion recorded in the note);
  outcome-side, audit class `anchor_beyond_display_total` flags ANY anchor
  above the band-rule display total, whatever writer produced it. Healed on
  day one: tokyo-ghoul 144→143, fire-force 305→304, prisma-illya 14→13.
  Distinct from this bug: an entry whose coverage honestly stops SHORT of
  its segment (Berserk 1997 adapts through ch 87 of its 1-94 segment;
  2016 starts at 95) is CORRECT data — the coverage-vs-segment display
  treatment is the parked segment-model pass.
- **Volume boundaries: monotonic starts, or the row is not data (Sean's
  Sailor Moon "v3: chs 10-3" report, 2026-08-24)**: every boundary's
  chapter_end is DERIVED from the next volume's chapter_start, so a single
  mis-parsed start writes an impossible row (end before start) AND mislabels
  the volume of every chapter after it. Chapter starts must strictly increase
  with volume number. Enforced in three places: parse-time gate
  (`lib/wikipedia.ts boundariesWithDrops` drops offending volumes and reports
  them; volumes-backfill flags the manga), stored-row healer
  (`heal-volume-boundaries.ts` — a max-weight increasing subsequence picks
  which row is the artifact rather than a greedy scan that evicts the good
  neighbour; research rows are never dropped; a degenerate FINAL volume can
  only be nulled; and a table whose coherent run is a minority is WIPED
  wholesale, per the Ippo v61 principle, so ratio fallback takes over
  honestly), and outcome-side audit class `boundaries_degenerate`. Healed on
  landing: 29 rows across 11 manga; Urusei Yatsura's table (12 volumes all
  claiming to start at ch 2) was wiped and flagged for research.
- **An exact record outranks any derivation (Sean's Gintama ep-35 report,
  2026-08-24)**: `MangaMapping.chapters` was ambiguous — a bare `"86"` meant
  BOTH "this episode is exactly chapter 86" and "only the end is known,
  derive the start" — so display derived where it should have obeyed, and
  inside a reorder regime the derivation walked backwards into a jumped
  block (ep 35's researched ch-86 record rendered as ch 48). MangaMapping now
  carries `start` explicitly (assemble.ts sets it from the anchor;
  null/absent = genuinely unknown). Every display site takes the record's own
  start first, a span's first number second, derivation only last.
- **A backwards-jumping successor never sets its predecessor's position
  (the AoT-87 rule, extended 2026-08-24)**: the successor-span cap exists so
  an interpolated row cannot overshoot past the next exact row's real start,
  but a successor that reaches back PAST the predecessor's own start is a
  reorder, and reorders never position their neighbours (Sailor Moon ep 73
  re-treads chs 15-17 after ep 71 reached 16, and the cap dragged the
  interpolated ep 72 down to "starts at 15" — before its predecessor).
  mapping.ts canonEpStartCh now floors the cap at the predecessor's own
  stated start; the regime check remains as the coarser first line.
- **Partial boundary tables never stand in as totals (the Ippo v61 lesson,
  2026-08-24)**: publishedVolumes (boundaries.length) substitutes for a null
  total_volumes ONLY when the boundary table is complete from the manga's
  start — a lone research row must not clamp every volume readout to v1
  (assemble.ts toAnimeSeries).
- **Post-batch**: audits re-run; batch-cleared series may surface their
  NEXT-worst stretch (>12) — that is the rolling work-list by design, not
  a failure. Every batch that adds interior anchors near a run end relies
  on the MU-pin episode-keyed redundancy rule (lib/mu-frontier) — the
  2026-08-23 regression class.
- **Start-sanity guard (the Oshi ep-4 lesson, Sean 2026-08-23)**: a chart
  row's raw min is NOT the start — stray low values (grafts, backfills,
  divider digits) poison it the same way stray highs poisoned ends before
  LNDS (Oshi ep 4 listed a stray 10 beside 17-19 → start read 10, and the
  UI displayed "10"). deriveAnchors recomputes each kept row's start as
  the lowest mainline chapter on the LNDS trend (≥ previous kept end − 1);
  off-trend values stay recorded in chapters_adapted — data, not position.
  Outcome side: audit class `anchor_start_offtrend` flags any anchor
  (manual/wiki typos included) whose start sits below the previous
  anchor's end without a rearranged/graft annotation ruling it. Its first
  run caught the stale Black Lagoon batch-10 arc-BLOCK anchors that
  pass-2's per-episode map had superseded — block-end aggregate anchors
  spanning several episodes are a deprecated shape; per-episode records
  replace them, never coexist with them.
- **Post-adjustment whole-series verification (Sean's ruling 2026-08-23:
  "data keeps getting broken every time we make adjustments")**: after ANY
  anchor/episode change to a series, run
  `npx tsx --env-file=.env.ingest scripts/ingest/verify-series-display.ts <id>`
  BEFORE reporting the change done — it renders the series through the
  app's EXACT code path (src/data/catalog/assemble.ts, the pure assembly
  split out of supabaseSource precisely so scripts can import it, + real
  buildEpisodeList) and checks every canon/mixed row: no null/NaN inside
  the frontier, starts non-decreasing except ruled rearranged/graft
  episodes. Never verify with a re-implementation — it drifts (the Oshi
  stale-harness lesson). Catalog-wide sweeps use the same verifySeries
  export. Two display rules born from its first sweep: (1) a derived
  start can never sit BELOW the previous row's end — charts double-list
  split-boundary chapters, so the derive guard requires start ≥ prevEnd
  (shared chapter = equal, legal; research-tier page-cited splits exempt);
  (2) interpolated rows adjacent to an exact row must not overshoot past
  that row's real start — canonEpStartCh caps every derived start at the
  next exact row's span start (an episode can never start after its
  successor; the one-chapter-dip class).
- **Fan mapping threads are a first-class verification source**: the
  r/OshiNoKo-style episode↔chapter threads that power "instant" AI-search
  answers are the SAME sources our research agents cite — use them for
  cross-checks, but never alone: they carry judgment calls at split
  chapters and go stale at finales (that thread ended Oshi ep 35 at ch
  122; four cited sources — Wikipedia, fandom, dexerto, mystiqora — agree
  the 1-hr finale runs to mid-ch-127, which Sean confirmed). Two agreeing
  citations beat one instant answer.

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
- `stitch.ts [--dry-run]` — multi-season chains; idempotent; override chains + ruled titles live at the top; entries with `ruledExtent` are ruled extensions beyond AFL (standing candidates, §10). Follow an extension with `wiki-episodes-backfill.ts <ids>` + `verify-series-display.ts <ids>`.
- `wiki-episodes-backfill.ts [ids]` — Wikipedia episode titles/air dates, creating rows for numbers we lack (fill-only merge; evidence-locked offsets and the namesake guard, §10); also stages fractional watch-order entries into ingest_fractionals for disposition.
- `verify-series-display.ts [--print] <ids> | --all` — the whole-series verifier (§10); `--all` sweeps every anchored series and lists reorder holes (the exact-record work-list); `--print` shows rows AND section headers (envelope rule).
- `volumes-backfill.ts [mangaAnilistId ...]` — an explicit id list overrides the anchored-only default (heal a manga whose anchors are landing); identity, trim and research-aware rules in §10.
- `sync-watch-order.ts` — mirrors order-only fractionals into the canonical watch_order_entries table (labels = per-series surface rulings, fill-only); run after any fractional disposition change.
- `apply-research-batch-14.ts [--dry-run] [ids]` — the batch-14 pattern for research application: verdict JSONs live in-repo (research/batch14/out), repairs detected programmatically, type corrections only through EPISODE_TYPE_OVERRIDES, order-only dedup, sliver + running-order normalization, one bookmark per series. Future batches copy this shape.
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
