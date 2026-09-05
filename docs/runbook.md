# Operations runbook

How the data system is operated: what pulls, what refreshes, what heals,
what audits, and how a new source enters. Rules are cited by ledger id only
(`docs/rules.md`, generated); the architecture is in `docs/architecture.md`;
history is in `docs/changelog.md`.

All scripts run as `npx tsx --env-file=.env.ingest scripts/ingest/<script>.ts`
from the repo root (`.env.ingest` = `SUPABASE_URL` + `SUPABASE_SECRET_KEY`,
gitignored; regenerate via `supabase projects api-keys`).

---

## 1. The freshness map (pull → fresh → canonical, as of 2026-08-25)

| Source | Event pull (new data enters) | Scheduled freshness | What reaches canonical | Gates on the way in (ledger ids) |
|---|---|---|---|---|
| **AFL** | `backfill.ts` (full sweep / new sources via the checklist, §7); a page for a series the catalog already holds ADOPTS it by identity behind the span gate (`I44`, `lib/adoption.ts`) | `refresh-afl` hourly :40, ≤20 stalest, 6-day window | episode rows + types via `resolveSeries` | `G8` alias defense · `G6` table/Quick List · `G10`–`G13` diff/empty/sparse/count holds · `I11` dispositions · `N1` episode floor · `N18` per-series episode rulings (every episode writer) · `T6` type overrides · `N3` community count |
| **AniList** | staged inline by every chain walk / match; `discovery-stage.ts` (event, `I42`: stages the halo — unowned TV-shaped story relations of owned entries, SEQUEL chains walked, budgeted; staging only) |
| **AniList rankings** (`G60`, 2026-09-05) | `discovery-stage.ts --rankings` (event: the eight ranked lists) | `refresh-discovery` weekly Sun 10:30 UTC — the rankings snapshot + the halo staging, budgeted | NOTHING — staging only (`ingest_anilist_rankings`, kept as history); the census reads the latest snapshot into `seed_candidate` | `G60` reader, never authority · `I21` ownership · `I42` the halo owns related titles · `R4` · `G58` budget | `refresh-anilist` daily 08:10 UTC, full batched sweep | series metadata + totals; stitched series via `refreshStitchedVolatile` | `I7` naming authority · `T21` derivative-manga · `I21` ownership guard · `I34` stitched-series guard · `I36` source-scope · `N1` episode floor · `N26` chapter floor |
| **AFG** | `afg-backfill` (`--force` after parser changes); `afg-expansion` / `afg-extend` for structure; `afg-continua-backfill` (campaign) | `refresh-afg` daily 09:20 UTC, ≤25 stalest, 13-day window | chart anchors via shared `syncAnchors` (registry-first); continua frontiers + volume boundaries via shared `applyContinua`; expansion/extension structures | `A20` derived monotonicity · `A21` start-sanity · `N16` ±12 alignment · `N28` chapter-space gate · `A5` D4 (A1 at the AFG writers) · `G23` continua identity guard · `A24` anchor tier precedence · `A25` curated-consistency · `I25` ±2 finalize · `I20` ruled splits · `I3` registration tiers · `N12`/`N15` per-source numbering · `V5`–`V7` boundary identity/space/absent-only · `V8` volumes-staleness event · `G26` CONTINUA_SUPPRESSED |
| **MangaUpdates** | `mu-backfill` (universal — every manga behind a canonical series) | `refresh-mu` daily 09:50 UTC, ≤20 stalest, 7-day window | `latest_known_chapters` via `bestLatestKnown`, frontier anchors, status-conflict + edition-divergence + out-of-space flags — all via `lib/mu-frontier` | `I6` MangaDex-bridge identity · `G31` MU frontier · `G32` D1 gate stack · `G33` sibling-scope ceiling · `N28` chapter-space gate · `G34` airing-pin · `G35` scope-consumed · `G36` A1 at the MU writer · `G37` MU_FRONTIER_SUPPRESSED · `A26` pin-episode redundancy · `A24` curated precedence · `N26` chapter floor · `N27` bestLatestKnown · `N23` same-edition band · `G38` mu anchors re-derived · `G39` universal targets · `G41` status cross-check · `G42` MU hash |
| **Wikipedia** | `volumes-backfill` (event: volumes-staleness flag from `syncAnchors`); `wiki-episodes-backfill` (episode titles/dates, fractionals) | none — boundaries static once printed | `volume_boundaries`; episode rows (fill-only); `ingest_fractionals` | `G43` page discovery · `V1` monotonic starts · `V5` own page · `V6` numbering space · `G44` episode-list locks · `G45` fill-only · `G46` fractional staging · `G55` series window (a row dated outside the series' run is refused — the namesake lesson) |

Rules: `G47` freshness map · `G49` inline upkeep · `G29` validation tier is
event-driven.

## 2. Refresh cadence (implemented 2026-08-23, ratified by Sean; re-tune freely)

The knobs are one-line cron edits plus the staleness window and batch
constant in each function.

| Function | Schedule | Batch | Window | Notes |
|---|---|---|---|---|
| `refresh-discovery` | weekly Sun 10:30 UTC | 8 ranked lists (~28 requests) + ≤150 halo candidate media | — | staging only (`G60` / `I42`); a deferred list or candidate leads the next run |
| `refresh-anilist` | daily 08:10 UTC | full catalog (~10 batched requests over all series + season components) | — | changed media re-resolve their series; stitched series get a volatile-field recompute only |
| `refresh-afl` | hourly at :40 | ≤20 stalest pages | > 6 days | edge wall-time limits forbid one big sweep; small batches cycle the catalog inside a weekly cadence; most runs no-op |
| `refresh-afg` | daily 09:20 UTC | ≤25 stalest pages | > 13 days | pages cycle ~biweekly, matching AFG's editorial pace; changed pages re-sync anchors via `syncAnchors`, which also fires the volumes-staleness event |
| `refresh-mu` | daily 09:50 UTC | ≤20 stalest staged MU rows (`BATCH = 20`) | > 7 days | ~1.5 s API spacing; hash-gated on acted-on fields; inline upkeep on change: latest_known (publishing only), frontier re-derivation, manga-status cross-check |

Mechanics (pg_cron → `invoke_edge_refresh` → pg_net, Vault secrets,
generated bundles) are architecture — see `docs/architecture.md` §5.

Event triggers (not scheduled): `mu-backfill` on new-series ingestion;
`volumes-backfill` on the volumes-staleness flag; the stitcher on flags after
refreshes (weekly manual or watcher until AniList stabilizes);
the alias-corrupt pages hold at the writer (`G8`, parse_integrity flags — `audit-titles` was RETIRED 2026-09-05, `P40`; the manual exclusions are asserted by `assert-overrides#assertDispositions`); new-show discovery from AFL's
index (`backfill.ts`, occasional — the hourly function refreshes known pages
only).

Operating constraints: `G16` etiquette (delay, UA, credit; fixed intervals,
never randomized) · `G15` conditional GETs · `G29` validation tier is
event-driven · `G28` restage from raw after a parser change · `P3` lib → four
edges.

## 3. The research tier (ruled 2026-08-23, amended 2026-08-24/25)

What reaches Sean is a cited verdict (`R1`). The workflow is the data cycle
(`P1`): `/research-batch` → `verdict-verifier` → Sean rules → `/apply-batch`
→ `/consolidate`. Curated results land as durable data — manual-tier
anchors, scope rows, `EXTRAS_ADOPTED` entries, `EPISODE_TYPE_OVERRIDES`,
annotations — all surviving refreshes.

- Research protocol: `R1`–`R31`, id R‑9 unassigned (research-first `R1`, 2+ sources `R3`,
  cross-check-only sources `R4`, fan threads `R5`, MediaWiki API `R6`, full
  record `R8`, repairs explicit `R12`, honest gap `R13`, numbering
  conversion `R18`, never index-join `R20`, verdict shape `R21`,
  verification `R23`–`R26`).
- Position & continue-read, as one unit: `A4` coverage = max · `A8` END =
  running order · `A31` re-use never anchors · `A32` anchors never encode
  resume · `A2` cameo/sliver · `C1`–`C5` continue regimes · `C6`
  continue_kind · `C7` curated continues survive.
- Rearranged zones / anchored row-less / relocated openers: `A3` exact
  adaptation anchors · `A7` zone-acknowledged · `A19` render as stored ·
  `A41` ruled reorders · `A42` row-less anchors synthesize · `A12` relocated
  openers · `A17` backwards-jumping successor · `A15`–`A16` derived starts ·
  `A18` reorder regime.
- Count-vs-number and totals: `N22` chapter-number space · `N23` same-edition
  band · `N24` effective total.
- Volume boundaries: `V1` monotonic starts · `V2` boundary heal · `V4`
  partial tables never totals.
- Exact record / start sanity: `A14` exact record outranks derivation ·
  `A13` display = first chapter · `A21` start-sanity guard · `A22` block-end
  anchors deprecated.
- Post-batch: `P19` whole-series verifier · `A26` MU pin redundancy · `A39`
  >12 canon gap = research target (the rolling work-list) · `P8` repairs at
  the manual tier · `T6` retypes via overrides · `N1` EXTRAS_ADOPTED.

## 4. Maintenance audits (run after any batch; all idempotent)

`audit-manga-coverage` (self-healing: frontiers + latest_known +
cross-checks), `reconcile-structure` (episode floor + late-airing entries),
`audit-ui-truth` (read-only: what the card actually renders),
`audit-afg-structure` (AFG cross-check + `--register`), `cleanup-flags`
(dedupe). Shared rule logic lives in `lib/` only — scripts and edge functions
consume the same functions, so a rule fix lands everywhere at once.

Rules: `P5` audits verify outcomes · `P2` rules live in lib · `P17` every
census delta explained · `P18` ruling_violation = 0 · `P20` healers
idempotent + rostered.

## 5. Script list — the rosters ARE the list

`scripts/ingest/rosters.ts` is the inventory (T2.4, `P20`/`P33`): every
script under `scripts/ingest/` is on the PULL, HEAL or CENSUS roster (with
`when: 'standard'` or an `event` trigger), in LIB_SUPPORT, or in
`history/` (`P34` — one-shots whose rulings were extracted to
`lib/rulings/applied/`, never run again). The system census refuses an
unlisted script. `npm run pull` / `npm run heal` / `npm run census` run the
standard entries in roster order; `npm run heal -- --list` prints the
event healers and their triggers.

Healers added in the restructure phase (2026-08-26), all standard:
`heal-source-kinds.ts` (`T25` — source_type re-derived from staging),
`assert-overrides.ts` (`T6` types, `T26` annotations with `origin`
reconciliation, `A44` anchor suppression, `G53` dates, `G54` order gate,
`T27` standings), `heal-format.ts` (`T29` — episodes.format), plus the event
healer `anilist-restage.ts` (any MEDIA_FIELDS change in `lib/anilist.ts`).
Research batches since batch 18 apply through the standing ruling maps and
`npm run heal` — there is no `apply-research-batch-N.ts` any more
(`scripts/ingest/research/batch18/{validate,curate}.ts` are the landing and
curation gates).

## 6. Flag review

`ingest_flags` where `status = 'open'` is the human loop: Sean confirms or
dismisses; the held change applies only on confirm. Rules: `G1` flag rule ·
`G3` recurring conditions flag once · `G4` permanent conditions leave the
queue (planned) · `R1` research first.

## 7. New-source checklist (Sean's ruling 2026-08-22)

Any new data source enters through the same repeatable mechanism or not at
all (`G50`). Each step names the rule it satisfies:

1. **Staging table** `ingest_<source>_*` — raw payload jsonb + content hash +
   fetch metadata; service-role only; store everything including raw
   HTML/source text → `G51` staging is greedy · `G9` hash gate.
2. **Identity registration FIRST** — map the source's id to our `series.id`
   in `series_external_ids` before writing any derived data; collisions
   throw → `I2` identity registry · `I1` our slug is identity.
3. **Rules layer** — decide what the source is authoritative for vs
   cross-check-only and record it as a ledger record via `/add-rule`
   (`P31`), with its writer gate and audit class → `G5` authority tiers ·
   `G1` flag rule · `P30` judgment → gate → audit.
4. **Inline upkeep** — registration and derived writes happen inside the
   source's regular puller, never a separate script someone must remember →
   `G49` inline upkeep · `G47` freshness map (one scheduled path, or an
   event trigger under `G29`).
5. **Edges** — any `lib/` change is rebuilt into every edge bundle →
   `P3`.
6. **Docs** — the source is added to the roster in `docs/architecture.md` §1
   with its role, and to the freshness map above.
