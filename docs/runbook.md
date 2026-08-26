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
| **AFL** | `backfill.ts` (full sweep / new sources via the checklist, §7) | `refresh-afl` hourly :40, ≤20 stalest, 6-day window | episode rows + types via `resolveSeries` | `G8` alias defense · `G6` table/Quick List · `G10`–`G13` diff/empty/sparse/count holds · `I11` dispositions · `N1` episode floor · `N18` per-series episode rulings (every episode writer) · `T6` type overrides · `N3` community count |
| **AniList** | staged inline by every chain walk / match | `refresh-anilist` daily 08:10 UTC, full batched sweep | series metadata + totals; stitched series via `refreshStitchedVolatile` | `I7` naming authority · `T21` derivative-manga · `I21` ownership guard · `I34` stitched-series guard · `I36` source-scope · `N1` episode floor · `N26` chapter floor |
| **AFG** | `afg-backfill` (`--force` after parser changes); `afg-expansion` / `afg-extend` for structure; `afg-continua-backfill` (campaign) | `refresh-afg` daily 09:20 UTC, ≤25 stalest, 13-day window | chart anchors via shared `syncAnchors` (registry-first); continua frontiers + volume boundaries via shared `applyContinua`; expansion/extension structures | `A20` derived monotonicity · `A21` start-sanity · `N16` ±12 alignment · `N28` chapter-space gate · `A5` D4 (A1 at the AFG writers) · `G23` continua identity guard · `A24` anchor tier precedence · `A25` curated-consistency · `I25` ±2 finalize · `I20` ruled splits · `I3` registration tiers · `N12`/`N15` per-source numbering · `V5`–`V7` boundary identity/space/absent-only · `V8` volumes-staleness event · `G26` CONTINUA_SUPPRESSED |
| **MangaUpdates** | `mu-backfill` (universal — every manga behind a canonical series) | `refresh-mu` daily 09:50 UTC, ≤20 stalest, 7-day window | `latest_known_chapters` via `bestLatestKnown`, frontier anchors, status-conflict + edition-divergence + out-of-space flags — all via `lib/mu-frontier` | `I6` MangaDex-bridge identity · `G31` MU frontier · `G32` D1 gate stack · `G33` sibling-scope ceiling · `N28` chapter-space gate · `G34` airing-pin · `G35` scope-consumed · `G36` A1 at the MU writer · `G37` MU_FRONTIER_SUPPRESSED · `A26` pin-episode redundancy · `A24` curated precedence · `N26` chapter floor · `N27` bestLatestKnown · `N23` same-edition band · `G38` mu anchors re-derived · `G39` universal targets · `G41` status cross-check · `G42` MU hash |
| **Wikipedia** | `volumes-backfill` (event: volumes-staleness flag from `syncAnchors`); `wiki-episodes-backfill` (episode titles/dates, fractionals) | none — boundaries static once printed | `volume_boundaries`; episode rows (fill-only); `ingest_fractionals` | `G43` page discovery · `V1` monotonic starts · `V5` own page · `V6` numbering space · `G44` episode-list locks · `G45` fill-only · `G46` fractional staging |

Rules: `G47` freshness map · `G49` inline upkeep · `G29` validation tier is
event-driven.

## 2. Refresh cadence (implemented 2026-08-23, ratified by Sean; re-tune freely)

The knobs are one-line cron edits plus the staleness window and batch
constant in each function.

| Function | Schedule | Batch | Window | Notes |
|---|---|---|---|---|
| `refresh-anilist` | daily 08:10 UTC | full catalog (~10 batched requests over all series + season components) | — | changed media re-resolve their series; stitched series get a volatile-field recompute only |
| `refresh-afl` | hourly at :40 | ≤20 stalest pages | > 6 days | edge wall-time limits forbid one big sweep; small batches cycle the catalog inside a weekly cadence; most runs no-op |
| `refresh-afg` | daily 09:20 UTC | ≤25 stalest pages | > 13 days | pages cycle ~biweekly, matching AFG's editorial pace; changed pages re-sync anchors via `syncAnchors`, which also fires the volumes-staleness event |
| `refresh-mu` | daily 09:50 UTC | ≤20 stalest staged MU rows (`BATCH = 20`) | > 7 days | ~1.5 s API spacing; hash-gated on acted-on fields; inline upkeep on change: latest_known (publishing only), frontier re-derivation, manga-status cross-check |

Mechanics (pg_cron → `invoke_edge_refresh` → pg_net, Vault secrets,
generated bundles) are architecture — see `docs/architecture.md` §5.

Event triggers (not scheduled): `mu-backfill` on new-series ingestion;
`volumes-backfill` on the volumes-staleness flag; the stitcher on flags after
refreshes (weekly manual or watcher until AniList stabilizes);
`audit-titles` re-audit (monthly manual); new-show discovery from AFL's
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

- Research protocol: `R1`–`R31`, R9 unassigned (research-first `R1`, 2+ sources `R3`,
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

## 5. Script list

> This list becomes the pull / heal / census rosters in T2.4
> (`docs/restructure-plan.md`); historical one-shots move to `history/`
> (`P34`). Until then it is the inventory.

- `parser-check.ts` — fixture regressions (AFL, AFG, Wikipedia); run after touching any parser.
- `backfill.ts` — full AFL sweep (honors dispositions, ~65 min, resumable 24 h window).
- `afg-backfill.ts` — AFG sweep → staging + chapter anchors (`--force` re-fetches after parser changes).
- `afg-expansion.ts` / `afg-extend.ts` — AFG-only series creation; chain-confirmed component rebuild + episode tail/gap fill for registered pages covering more than we hold (`I29`–`I31`). Run `afg-extend` after registration and whenever AFL lags an airing season.
- `afg-continua-backfill.ts` — campaign pull of AFG continua (frontiers + boundaries) via `applyContinua` (`G22`).
- `mu-backfill.ts` — universal MU pull via `lib/mu-frontier` (`G39`).
- `volumes-backfill.ts [mangaAnilistId ...]` — Wikipedia volume boundaries for anchored manga (an explicit id list overrides the anchored-only default); `V1`, `V5`, `V6`.
- `wiki-episodes-backfill.ts [ids]` — Wikipedia episode titles/air dates, creating rows for numbers we lack (`G44`, `G45`); also stages fractional watch-order entries into `ingest_fractionals` (`G46`).
- `sync-watch-order.ts` — mirrors order-only fractionals into `watch_order_entries` (`N31`); run after any fractional disposition change.
- `rederive-anchors.ts` — recompute anchors from STAGED AFG pages, no refetch (after derivation-logic changes; `G28`).
- `scopes-apply.ts` — sync curated `series_scopes` into canonical + auto-flag unscoped shared-manga series (`I36`).
- `stitch.ts [--dry-run]` — multi-season chains; idempotent; override chains, ruled titles and `ruledExtent` extensions live at the top (`I21`–`I28`). Follow an extension with `wiki-episodes-backfill.ts <ids>` + `verify-series-display.ts <ids>`.
- `verify-series-display.ts [--print] <ids> | --all` — the whole-series verifier through the app's exact code path (`P19`); `--all` sweeps every anchored series and lists reorder holes (the exact-record work-list); `--print` shows rows AND section headers (`A36`).
- `apply-research-batch-N.ts [--dry-run] [ids]` — research application in the batch-14+ shape: verdict JSONs in-repo (`research/batchN/out`), repairs detected programmatically, type corrections only through `EPISODE_TYPE_OVERRIDES`, order-only dedup, sliver + running-order normalization, one bookmark per series (`P15`, `P16`, `A10`, `A9`, `T6`).
- `merge.ts` — multi-AFL-page merges (config at top).
- `relations.ts` — rebuilds `series_relations` (auto + RULED pairs; `I17`).
- `audit-titles.ts` — periodic corruption re-audit against a fresh AFL index snapshot (`G8`, `I14`).
- `audit-afg-structure.ts` — structural cross-check of every staged AFG page vs canonical (naming / episode grouping / season hierarchy); classifies aligned vs conflict vs registry-gap; `--register` enters confident matches into the identity registry (`G30`, `I3`). AFG numbers episodes franchise-continuously, so `AFG max > ours` usually means unstitched newer seasons (afg-extend candidates) or a deliberate split of ours; `< ours` means a season-scoped page.
- `audit-ui-truth.ts` — replicates the card's exact per-series decisions (full / ch-only / pending / no-source / structure-integrity) and carries the outcome audit classes; run after any pipeline batch — a data-level audit can say "resolved" while a UI gate still blanks the display. Keep in lockstep with `src/data/catalog/assemble.ts` (`P5`).
- `audit-manga-coverage.ts` — frontier / latest_known / cross-check census; self-healing (roster class: heal).
- `reconcile-structure.ts` — episodes outrunning the component structure walk the chain to the episodes' end; confirm → structure rebuilds, no confirm → accepted-extras flag; ruled extras skipped by name (`I33`). Idempotent — run after AFL refreshes land new trailing episodes.
- `heal-volume-boundaries.ts` — stored-boundary healer (`V2`).
- `cleanup-flags.ts` — dedupe exact-duplicate open flags (keeps oldest); never dismisses unique flags.
- `wayback-recover2.ts` — archive recovery for corruption victims (rendered snapshots + count validation).
- `rebuild.ts` — **DANGER post-stitching**: re-resolves everything as single-season, clobbering stitched aggregates. Only for canonical-shape migrations; re-run `stitch` after.
- `pilot.ts` / `cleanup.ts` / `stabilize.ts` / `polish-ids.ts` / `fix-mismatch.ts` / `assisted-prep.ts` — historical one-shots, kept as patterns (→ `history/`, `P34`).

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
5. **Edges** — any `lib/` change is rebuilt into all four edge functions →
   `P3`.
6. **Docs** — the source is added to the roster in `docs/architecture.md` §1
   with its role, and to the freshness map above.
