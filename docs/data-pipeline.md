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
| **MangaUpdates** | Cross-check tier (manual-confirm) | Public-read API, caching required by their AUP, credit requested. Release data resolves only ~50% of chapters to volumes and dies in the simulpub era — NOT the volume source. Gems: curated per-series `anime` coverage field ("Vol 112, Chap 1138 as of EP 1168") as a continue-point cross-check. |
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

Canonical series id = the **AFL slug** (kebab-case, already the app's id style
and the path-bar identity). `anilist_id` (unique) and `mal_id` are columns.
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
| **MU-frontier rule** | MangaUpdates' curated anime-coverage field ("Vol X, Chap Y as of EP Z") becomes a real anchor (source 'mu') — the adaptation frontier for series AFG doesn't anchor | audit-manga-coverage.ts |
| **Coverage audit** | every series self-classifies (anchored / synthesized / mu-frontier / honest-pending / unknown-flagged / no-source); new pending classes get RULES, never per-series fixes | audit-manga-coverage.ts |
| **Expansion guards** | AFG-only series enter through exact-match-or-flag (whitespace-insensitive full-title equality; accented queries retry ASCII-folded), sparse, and alignment gates; the dedup guard flags AFG pages of existing series rather than duplicating them. STITCH-AWARE since 2026-08-24 (Sean's go): AFG numbers franchise-continuously, so the matched entry's SEQUEL chain is walked before the alignment gate — multi-season AFG-only shows (Solo Leveling, Oshi no Ko…) create with proper season components | afg-expansion.ts |
| **Ownership guard** | a chain walk (stitch, expansion, extension) never crosses into an AniList entry another canonical series already claims — ruled splits (Bleach→TYBW, TG→:re, Naruto→Shippuden) are safe by construction, whatever a source's continuous numbering suggests | ownedAnilistIds / walkChain (lib/chain.ts) |
| **Prequel-hijack fallback** | AniList PREQUEL edges can be chronological side stories, not series heads (MONSTERS ONA → One Piece; Berserk Memorial class): when the walked-back chain lands far from target, retry forward-only from the matched entry and keep whichever numbering fits | walkChain (lib/chain.ts) |
| **AFG extension (merge, never replace)** | for REGISTERED afg pages covering more than we hold: the AniList chain must independently confirm AFG's numbering (same ±2/lag finalize gate as the stitcher); on confirm, components rebuild and AFG fills ONLY missing episode numbers — existing AFL rows stay the type authority; id/title/afl_slug never change; ruled-split pages skip by name; unconfirmed → flag | afg-extend.ts |
| **Registration tiers** | AFG↔canonical identity enters the registry by evidence strength: slug / full-title equality auto-register; prefix (subtitle-stripped) matches need INDEPENDENT episode-span agreement (±2 of our max or a component boundary); a title key two series claim is ambiguous and never auto-matches; explicit rulings live in the RULED map (Sailor Moon 90s ≠ Crystal; AFG digimon-adventure = the 1999 series) | audit-afg-structure.ts --register |
| **MU frontier targets (class B)** | any manga-linked series without chapter anchors is an MU staging target — MU's curated anime-coverage gives airing-series-with-finished-manga (TYBW class) and finished-unknown-coverage series their frontier; latest_known_chapters only ever writes for PUBLISHING manga | mu-backfill.ts |
| Dispositions | active / excluded / duplicate / merged rulings are durable data; backfill skips non-active | source_map |

**Hard-won learnings** (why some rules exist): AFL's Drupal is corrupt since
~2023 (§9); Wayback `id_` raw URLs redirect to the *nearest raw capture,
years off* — recover from rendered snapshots with count-validation against
AniList totals; sparse AFL pages are real community-coverage gaps, not bugs;
AniList `chapters/volumes` are null while publishing.

## 11. Operations runbook

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
- **Validation tier is EVENT-DRIVEN, never scheduled** (Sean's ruling
  2026-08-23): Wikipedia boundaries are static-once-printed (one-time ingest
  when a manga enters, `volumes-backfill` re-run only on flags);
  MangaUpdates/etc. are invoked to verify or cross-check when a change or
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
18. **UNRESOLVED — Sean 2026-08-24: "will not work for our model right now,
   we need to figure that out": the D-Frag tail gap.** Every anchored series
   whose manga is still PUBLISHING shows NO manga-only tail (buildMapping's
   manga-ahead math accepts only AniList `total_chapters`, null while
   publishing) while the card's denominator happily shows MU's
   latest_known (D-Frag: ep 12 → ch 36, "of 182", tail absent). This is a
   data-logic hole, not a display choice — the coverage-segment sketch
   (§ above) holds the proposed fix (tail denominator falls back to
   latest_known, labeled "as of latest published"), but it is NOT resolved
   until worked through with Sean and built. Do not close this item on a
   doc update.
19. **Remaining triage** (all understood, none urgent): LN-instrument ruling
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
