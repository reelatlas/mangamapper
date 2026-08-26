# Architecture — how mangaMapper's data system is built

Architecture facts only. Every rule this system enforces lives in the ledger
(`docs/rules.md`, generated) and is cited here by id — no rule text is
restated in this file. Operations (cadence, scripts, checklists) are in
`docs/runbook.md`; history is in `docs/changelog.md`; per-series rulings are
in `docs/franchise-rulings.md` and the typed maps under `scripts/ingest/lib/`.

Strategy was researched and ratified with Sean on 2026-08-21/22 (three-agent
source census, all claims live-verified); source choices are not re-litigated
without new evidence.

The app never calls an external API at runtime. It reads **only our Supabase
database** through the `CatalogSource` seam
([src/data/catalog/source.ts](../src/data/catalog/source.ts)); the pure
assembly step is [src/data/catalog/assemble.ts](../src/data/catalog/assemble.ts)
so scripts can render exactly what the app renders. Ingestion is a separate,
periodic concern.

---

## 1. Source roster (census verdicts 2026-08-22; roles as of 2026-08-25)

| Source | Role | What it is / what it carries |
|---|---|---|
| **animefillerlist.com** (AFL) | **Episode-type authority** | The community wiki where classifications are *authored* (376 shows, actively edited). Server-rendered Drupal 7 HTML; episode `<tr>`s carry semantic classes `manga_canon` / `mixed_canon/filler` / `filler` / `anime_canon`, 1:1 with our `EpisodeType`. Data is stated twice per page (episode table + Quick List ranges). |
| **AniList** GraphQL | Metadata backbone; naming authority | Open endpoint, no key. Titles/covers/status/scores/genres/relations/`idMal`/external links. Hard budget: **30 req/min** (degraded limit, enforced; treated as permanent). |
| **animefillerguide.com** (AFG) | Anchors (chart), continua frontiers + volume boundaries, structural cross-check, expansion + extension | Semi-independent editorial (~458 shows, 3-way taxonomy: red=filler, blue=mixed, plain=canon). Arc sections carry **manga chapter equivalents** — the only structured episode↔chapter source found anywhere. Pages also carry **between-season reading guidance** in prose ("read ch 136–143 before :re"); raw HTML is kept (`ingest_afg_pages.raw_html`). Its series/season structuring is thoughtfully curated (Sean 2026-08-23) and is consulted as evidence for stitch/franchise decisions. Where AFL is absent, AFG classifies expansion series (registry source `afg`, `afl_slug` null); where AFL lags, AFG extends the episode tail (`afg-extend`, 2026-08-24). |
| AOD 2026-27 snapshot · animeapi.my.id · arm.haglund.dev · AniList `idMal` | ID-mapping utilities | For AFL-slug ↔ AniList joins the title matcher cannot settle. |
| **MangaDex** | **ID bridge** (verified 2026-08-22) | Entries carry AniList + MAL + MangaUpdates ids together (`links.al/mal/mu`; the MU slug base36-decodes to their numeric id). The join layer for manga-side sources. Its own chapter data: unusable coverage for licensed series. |
| **MangaUpdates** (MU) | **Writer tier** — frontier anchors + `latest_known` denominator; manga-status cross-check. Scheduled since 2026-08-24 (Sean; promoted from event-only) | Public-read API; caching required by their AUP, credit requested. Supplies the `anime` coverage field (frontier pins, ~140 series), `latest_chapter` (effective-total denominator for publishing manga), `completed` + status string, `type` Manga/Manhwa/Manhua/Novel (unused yet), `licensed`, `related_series`. Full payload stages greedily. No arc-level data. Release data resolves only ~50% of chapters to volumes — not the volume source. |
| **Wikipedia** (live) | Volume boundaries (chapter-list pages); episode titles/air dates + fractional watch-order entries (episode-list pages) | "List of X chapters" pages are publisher-derived and complete; boundaries are static once printed → one ingest per manga into `volume_boundaries`, re-run on event. Read as wikitext via the MediaWiki API (three wikitext dialects handled). |
| AniraTeam/AniFiller (GitHub) | Matcher validation seed only | 182 AFL shows with `anilist_id`/`mal_id` pre-joined. No license — never shipped. |
| Jikan/MAL, Simkl, AniDB, SEO clones | **Dropped** | Jikan: boolean-only taxonomy, proven AFL copy, chronic 504s, MAL ToS forbids aggregation. Simkl: filler is website-only. AniDB: no filler concept in schema. skipthefiller.com / animefillerlist.tv etc.: derivative rewrites. |

Rules: `G5` authority tiers · `T4` typing precedence · `I7` AniList naming
authority · `G41` manga-status cross-check · `G22` AFG continua source ·
`I20` AFG structuring is evidence · `I29` AFG extension merges · `I10`
AniFiller seed is a matcher fact · `G6` AFL table/Quick List agreement —
see docs/rules.md.

## 2. Staging → resolution → canonical

**Staging is greedy; canonical is deliberate.**

- **Staging** stores every pull's complete raw payload (jsonb, plus raw HTML
  or wikitext where the source is a page) with a content hash and fetch
  metadata. Disk is free; re-pulls are not. Any future feature is answered
  from raw we already own — promotion is a migration, never a re-fetch.
- **Resolution** promotes a typed subset into the canonical tables through
  the shared writers in `scripts/ingest/lib/` (`resolve.ts`, `chain.ts`,
  `anchors.ts`, `mu-frontier.ts`, `wikipedia.ts`). Scripts and edge
  functions consume the same functions.
- **Canonical** is what the app queries via `SupabaseCatalogSource` →
  `assemble.ts`. Every column is a commitment; tier-3 data waits in staging
  jsonb until a feature earns its promotion.
- Anything a writer will not commit to becomes a row in `ingest_flags` — the
  confirm queue — with enough jsonb detail to rule on without re-scraping.

Rules: `G51` staging is greedy · `G9` hash gate · `T1` episode-type
vocabulary · `T4` typing precedence · `I7` naming authority · `N24`
effective total · `N23` same-edition band · `I38` manga link selection ·
`I36` source-scope · `G1` flag rule · `G3` flag once · `G4` permanent
conditions · `P2` rules live in lib · `P3` lib → four edges — see
docs/rules.md.

## 3. Identity & matching

Canonical series id = **our own slug** (own-slug migration + identity
registry, 2026-08-22, superseding the early AFL-slug plan). External ids
(`anilist`, `mal`, `afl`, `afg`) map INTO our id via `series_external_ids`;
`afl_slug` remains a column for the AFL relationship, never the identity.
`source_map` is the AFL-specific matching ledger (match method, confidence,
disposition). Franchise splits of a shared manga are modelled in
`series_scopes` (the stitcher writes them), not per-case in `source_map`.

Rules: `I1` our slug is identity · `I2` identity registry · `I3` AFG
registration tiers · `I8` match ladder (source_map first) · `I4` ambiguity ·
`I9` one AniList id per AFL slug · `I11` dispositions · `I6` MU identity via
MangaDex · `I36` source-scope — see docs/rules.md.

## 4. Refresh model

The live cadence (four edge crons, windows, batch sizes, event triggers) is
in `docs/runbook.md`. The design constraints it runs under are ledger
records: `G47` freshness map · `G15` conditional GETs · `G9` hash gate ·
`G16` etiquette · `G29` validation tier is event-driven.

## 5. Where things run

- **Backfill + development**: local `tsx` scripts under `scripts/ingest/`
  (paced batches, 429/`retry-after` handling). A full AFL backfill ≈ 376
  pages × 10 s ≈ 65 min, run once, resumable.
- **Steady state**: four Supabase Edge Functions on Supabase Cron —
  `refresh-afl`, `refresh-anilist`, `refresh-afg`, `refresh-mu`. Their
  bundles are **generated** from `scripts/ingest/lib` by
  `build-functions.ts`; `supabase/functions/*/index.ts` is never edited by
  hand, so crons run the same code as scripts.
- **Cron mechanics**: pg_cron → `invoke_edge_refresh(fn)` (SECURITY DEFINER,
  reads Vault: `edge_base_url` / `edge_anon_key` / `edge_cron_secret`) →
  pg_net POST with the shared-secret header; functions verify
  `x-cron-secret`. Secrets are set via the service-role-only
  `set_vault_secret` RPC — never in the repo.
- **Secrets for scripts**: `SUPABASE_URL` + `SUPABASE_SECRET_KEY` from the
  gitignored `.env.ingest`; no AniList/AFL/AFG credentials exist at all.

Rules: `P3` lib → four edges · `P4` edge bundles carry the lib hash
(planned) · `P27` gates before commit.

## 6. Schema (migrations `catalog_pipeline` → `continue_metadata`, `supabase/migrations/`)

Staging (service-role only; RLS enabled, no anon policies unless noted):

- `ingest_afl_shows` — raw AFL show pages (parsed rows + Quick List), content hash, etag/last-modified, fetch times.
- `ingest_afg_pages` — raw AFG pages incl. `raw_html`, parsed chart + continua, content hash, fetch times.
- `ingest_anilist_media` — full AniList media payloads (anime and manga), content hash.
- `ingest_mangaupdates` — full MU series payloads keyed by MU id, hash of the acted-on fields, fetch times.
- `ingest_wikipedia_chapters` — Wikipedia chapter-list wikitext per manga (the volume-boundary source).
- `ingest_fractionals` — Wikipedia episode-list in-between entries (fractional positions) awaiting disposition; public read.

Identity:

- `series_external_ids` — THE registry: pk (source, external_id) + unique (series_id, source); every external identifier maps into our canonical id here.
- `source_map` — AFL-specific matching ledger (afl_slug pk, anilist_id, mal_id, disposition, match_method, confidence, verified).

Canonical (anon `SELECT` via RLS):

- `series` — one row per canonical series: AniList tier-1/2 metadata, cover + `cover_color`, manga link + totals, `latest_known_chapters`, `mapping_mode`, `asterisk_review`, `search_text` (every name the series answers to).
- `series_components` — every AniList entry a series is built from: season order, episode ranges in the series' continuous numbering, `kind` (season/movie/ova/special), `watch_position`, `air_date`.
- `series_relations` — typed links between canonical series (sequel/prequel/side_story/spin_off/alternative/remake).
- `series_scopes` — the range of the source manga an entry owns (chapter/volume start–end) when several series share one manga.
- `episodes` — pk (series_id, number); `type` check-constrained to the four tokens; title/air date.
- `chapter_anchors` — per-episode ep↔chapter record with `source` provenance (afg / afg-continua / mu / wiki / manual / research): `chapter` (END), `start_chapter`, `chapters_adapted`, `volume`, `note`, and the continue-read fields `continue_chapter` / `continue_kind` / `continue_note`.
- `episode_annotations` — first-class non-linear facts per episode (rearranged, graft, partial, divergence, …) with their evidence.
- `volume_boundaries` — per manga (AniList id) volume → first chapter, with source.
- `watch_order_entries` — canonical order-only entries (fractional watch positions) surfaced by ruling.

Ops:

- `ingest_runs` — per-run counters (fetched/unchanged/changed/flagged) + status.
- `ingest_flags` — kind, detail jsonb, status (open/confirmed/dismissed) — the confirm queue.

Application (pre-pipeline, user-scoped):

- `profiles` — one row per auth user.
- `anime_progress` — per-user last watched episode / last read volume+chapter per series.
- `manga_reader_sites` — per-user reader-site bookmarks.

Functions: `invoke_edge_refresh`, `set_vault_secret` (see §5),
`handle_new_user`, `update_updated_at_column`.

Rules: `I2` identity registry · `T1` episode-type vocabulary · `A24` anchor
tier precedence · `A43` annotations are first-class · `C6` continue_kind
vocabulary · `N31` watch-order entries · `G46` fractional staging.

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

Rules: `T20` source_type derivation · `T22` manga_status vocabulary.

## 8. Franchise structure as a system (Sean's rulings, 2026-08-22)

A canonical series is an aggregate we own, with explicit provenance:

- `series_components` records every AniList entry a series is built from
  (season order + episode ranges in the series' continuous numbering), so
  per-season UI markers read straight off the ranges. The **stitcher**
  (`stitch.ts`) builds multi-season chains by walking AniList relations
  from a head entry; refresh never touches stitched structure.
- `series_relations` keeps AniList's relation vocabulary verbatim for future
  linking and recommendations.
- `series_scopes` records which range of a shared manga each series owns;
  an adjoining sibling scope is a continuation handoff.
- `series_external_ids` keys every source id to our slug; `afl_slug` is a
  source pointer only.
- Movies/OVAs/specials are out of v1 by disposition (Sean, 2026-08-22); the
  intended re-entry frame is a franchise "watch order" view —
  `watch_order_entries` and `series_components.watch_position` are its data.
- Structure rulings (which AFL pages merge, which stay split, ruled
  extensions beyond an AFL page) are recorded in `docs/franchise-rulings.md`
  and the ruled maps at the top of `stitch.ts`.

Rules: `I15` one story = one series · `I16` narrative shifts / remakes
separate · `I17` relation kinds · `I18` AFL pages are a hypothesis · `I19`
in-flow movies/OVAs · `I13` standalone movies/OVAs excluded · `I12`
duplicate AFL pages · `I1` our slug is identity · `I21` ownership guard ·
`I22` early-stop · `I23` prequel-hijack fallback · `I24`–`I26` stitch
candidacy / finalize / lag · `I27`–`I28` ruled extensions · `I30`–`I31`
expansion guards · `I32`–`I35` refresh vs structure · `I36` source-scope ·
`I37` continuation handoff · `N31` watch-order entries — see docs/rules.md.

## 9. AFL alias corruption (discovered 2026-08-22 — history)

AFL deleted/restructured its "Films/OVAs/Specials" collection pages and
Drupal reassigned the orphaned URL aliases across other shows — ~37 index
slugs served the wrong show entirely (`/shows/chrono-crusade` → Thus Spoke
Rohan Kishibe; `/shows/digimon-adventure-02` → Code Geass: Akito, index
anchor included). This forced own-slug identity (§3) and the permanent
page-identity defenses in `stageAfl`. The shows whose slugs were stolen
(Kakegurui, Blue Period, Bakemonogatari, Pokémon generations, City Hunter,
Zeta/ZZ Gundam…) are unreachable on AFL until it is fixed; the periodic
re-audit (`audit-titles.ts`, runbook) restores them when AFL does.

Rules: `G8` alias defense · `I14` alias-corruption victims excluded · `I1`
our slug is identity.

## Parked: the public-API eventuality (2026-08-26, Sean + Cursor + Code)

Not designed now; the foundation is already the right one. When the catalog
is trusted enough to sell: the API is a VERSIONED VIEW OF CANONICAL under
our own ids; staging (`ingest_*`) is never served and never the product;
every published field keeps provenance (anchor `source`, ruling maps with
reason + cite, `ingest_runs` for "as of"); unknown stays unknown (P6);
the schema grows additively (new columns / annotation kinds — the
anime-only-canon lesson, T27). Known gap for that pass, not before:
`episodes.type` carries no per-row provenance column (AFL vs T6 ruling is
derivable from staging + the map, not stored). Auth, rate limits, SLAs and
licensing are that pass's contract, not this phase's.

