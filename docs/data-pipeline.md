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
| **animefillerguide.com** (AFG) | Cross-check + **chapter anchors** | Semi-independent editorial (~458 shows, ~4 months behind AFL, 3-way taxonomy). Its arc sections carry **manga chapter equivalents** — the only structured episode↔chapter source found anywhere. AFG never overrides AFL on type; discrepancies raise flags. |
| AOD 2026-27 snapshot · animeapi.my.id · arm.haglund.dev · AniList `idMal` | ID mapping utilities | For AFL-slug ↔ AniList joins the title matcher can't settle. |
| AniraTeam/AniFiller (GitHub) | Matcher validation seed only | 182 AFL shows with `anilist_id`/`mal_id` pre-joined. **No license — never ship its data**; use only to test our matcher's output. |
| Jikan/MAL, Simkl, AniDB, SEO clones | **Dropped** | Jikan: boolean-only taxonomy, proven AFL copy, chronic 504s, MAL ToS forbids aggregation. Simkl: filler is website-only (0 mentions in their API spec). AniDB: no filler concept in schema. skipthefiller.com / animefillerlist.tv etc.: derivative rewrites. |

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

## 6. Schema (migration `catalog_pipeline`)

Staging: `ingest_afl_shows`, `ingest_afg_pages`, `ingest_anilist_media` — pk =
source key, `raw` jsonb, `content_hash`, `etag`/`last_modified`, `fetched_at`,
`changed_at`. Service-role only (RLS enabled, no anon policies).

Mapping: `source_map` (afl_slug pk, anilist_id, mal_id, afg_slug,
match_method, confidence, verified).

Canonical (anon `SELECT` via RLS): `series` (tier 1+2 columns incl.
`average_score`, `popularity`, `genres`, `external_links` jsonb, cover url +
`cover_color`, source-scope fields), `episodes` (pk series_id+number; `type`
check-constrained to the four tokens), `chapter_anchors` (sparse ep↔vol/ch
with `source` provenance).

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

- `parser-check.ts` — fixture regressions; run after touching the parser.
- `backfill.ts` — full AFL sweep (honors dispositions, ~65 min, resumable 24h window).
- `stitch.ts` — multi-season chains; idempotent; override chains + ruled titles live at the top.
- `merge.ts` — multi-AFL-page merges (config at top).
- `relations.ts` — rebuilds series_relations (auto + RULED pairs).
- `audit-titles.ts` — periodic corruption re-audit against a fresh index snapshot.
- `wayback-recover2.ts` — archive recovery for corruption victims.
- `pilot.ts` / `cleanup.ts` / `stabilize.ts` / `polish-ids.ts` / `fix-mismatch.ts` — historical one-shots, kept as patterns.
- Flag review: `ingest_flags` where status='open' — confirm/dismiss is the human loop; nothing suspicious ever auto-applies.

**Refresh cadence (design decided, implementation = build-order step 9):**
fully automatable — Supabase Cron triggers an Edge Function running the same
puller modules; no manual triggering needed. Cadence per §4: airing shows
AniList daily + AFL weekly; finished shows monthly verify rotation.
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
7. AFG parser (anchor candidates + cross-check flags).
8. `SupabaseCatalogSource` swap; retire `DEV_FILLER`; revisit virtualization threshold (episode-list.md §6).
9. Promote refreshers to Edge Function + Cron (backfill honors dispositions; weekly AFL tier + daily AniList tier; periodic audit-titles re-audit).

Open items: ongoing-manga denominators (MangaUpdates/MangaDex as later
enrichment); duotone cover treatment unblocks if covers are ever mirrored to
Supabase Storage (`coverImage.color` already stored); anchor coverage beyond
AFG's 458 shows is manual/wiki work, headliners first.
