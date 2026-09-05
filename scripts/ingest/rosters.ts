// The three rosters (restructure T2.4, 2026-08-26; rule P20 healers-rostered,
// P33 system census). A script under scripts/ingest/ is exactly one of:
// PULL (fetches/stages from a source), HEAL (idempotent rescan of stored
// data), CENSUS (read-only audit/verify), LIB_SUPPORT (tooling, no DB
// walk), or HISTORY (scripts/ingest/history/ — a one-shot apply whose
// rulings were extracted to lib/rulings/applied; never run). The system
// census asserts that every file is listed somewhere; an unlisted script
// is a healer nobody runs — coverage that does not exist.
//
// `when: 'standard'` runs in the listed ORDER on every `npm run heal` /
// `npm run census` / `npm run pull`; `when: 'event'` runs only on its named
// trigger, by hand, and is listed so it cannot be forgotten.

export type RosterEntry = {
  file: string; // relative to scripts/ingest/
  when: 'standard' | 'event';
  trigger?: string; // for event entries: when a human runs it
  note: string;
  args?: string[];
};

export const PULL: RosterEntry[] = [
  { file: 'backfill.ts', when: 'standard', note: 'AFL sweep honoring source_map dispositions; 24h resume window; integrity/large-diff holds (G5–G9)' },
  { file: 'afg-backfill.ts', when: 'standard', note: 'AFG sitemap sweep, hash-gated staging (G19 alignment gate at apply)' },
  { file: 'afg-continua-backfill.ts', when: 'standard', note: 'continua tables for staged AFG pages missing a parse' },
  { file: 'mu-backfill.ts', when: 'standard', note: 'MangaUpdates, universal targets, MangaDex-bridge identity (I6), frontier gate stack (G32)' },
  { file: 'volumes-backfill.ts', when: 'event', trigger: 'volumes-staleness flag (V8) or a new anchored manga', note: 'Wikipedia chapter-list ingest into volume_boundaries (V5/V6)' },
  { file: 'minted-by-backfill.ts', when: 'event', trigger: 'row_minted_by_missing census rows (G57: an unstamped episode row — nobody may delete it until its minter is inferred from the writers\' reach)', note: 'row provenance backfill by reach: afl → afg → stitch → wiki → anilist; --restamp re-infers every row' },
  { file: 'wiki-episodes-backfill.ts', when: 'event', trigger: 'title_incomplete / airdate_incomplete census rows, or a ruled extension', note: 'Wikipedia episode titles/dates under evidence-locked offsets (G41)' },
  { file: 'afg-expansion.ts', when: 'event', trigger: 'audit-afg-structure reports unregistered AFG-only pages', note: 'creates canonical series from AFG-only pages behind exact-match-or-flag (I30/I31)' },
  { file: 'discovery-stage.ts', when: 'event', trigger: 'before a /discover sitting, or when discovery_new_since_sitting lists unstaged candidates (I42)', note: 'stages the HALO — every unowned TV-shaped story relation of an owned entry, SEQUEL chains walked transitively, budgeted (G58); writes staging only, never a series or a component' },
];

export const HEAL: RosterEntry[] = [
  { file: 'heal-source-kinds.ts', when: 'standard', note: 'series.source_type re-derived from staging through SOURCE_KINDS + SOURCE_TYPE_OVERRIDES; unregistered → NULL + flag (T25)' },
  { file: 'scopes-apply.ts', when: 'standard', note: 'curated series_scopes → canonical; flags unscoped shared-manga siblings (I36)' },
  { file: 'afg-continua-apply.ts', when: 'standard', note: 'applyContinua over every staged page (G22–G26)' },
  { file: 'audit-manga-coverage.ts', when: 'standard', note: 'SELF-HEALING despite the name: MU frontier pins, latest_known, status cross-check (G31–G38); classes are a census by-product' },
  { file: 'heal-volume-boundaries.ts', when: 'standard', note: 'monotonic-start rule over stored boundaries (V1/V2)' },
  { file: 'heal-anchor-volumes.ts', when: 'standard', note: 'volume := the boundary table\'s volume for the END chapter over every anchor (lib/volumes.ts, the one derivation — anchor_volume_mismatch reads 0)' },
  { file: 'heal-parity-continues.ts', when: 'standard', note: 'C2 parity continues + C3 skip notes over every anchor (moved from research/batch15/ in T2.4)' },
  { file: 'wiki-episodes-backfill.ts', args: ['--ruled'], when: 'standard', note: 'G59 path B: the wiki writer for the RULED-page keys only (lib/rulings/wiki-pages.ts) — two fetches per heal; the full lag fill stays the event entry below' },
  { file: 'mint-grids.ts', when: 'standard', note: 'G59 path C: ruled manual grids (lib/rulings/minted-grids.ts) minted / asserted for entries AFL and the wiki cannot serve (minted_by manual)' },
  { file: 'heal-stuck-runs.ts', when: 'standard', note: "ingest runs left 'running' past the edge wall clock are marked killed (G58) — run_stuck reads as backlog, never as a live run" },
  { file: 'assert-overrides.ts', when: 'standard', note: 'EPISODE_TYPE_OVERRIDES (T6) + AIR_DATE_OVERRIDES (G53) + the air-date order gate (G54) asserted over standing rows' },
  { file: 'sync-watch-order.ts', when: 'standard', note: 'order-only fractionals → watch_order_entries (N31); kind from the matching order-only component (T29)' },
  { file: 'heal-structure.ts', when: 'standard', note: 'series_components re-planned for RULED_STRUCTURE series — numbered extras + span overrides through the one planner (I39); before heal-format' },
  { file: 'heal-format.ts', when: 'standard', note: 'episodes.format from the containing component kind + FORMAT_OVERRIDES (T29); null = format_missing queue' },
  { file: 'relations.ts', when: 'standard', note: 'series_relations from AniList edges + ruled overrides (I16)' },
  { file: 'cleanup-flags.ts', when: 'standard', note: 'dismiss exact-duplicate open flags (G3)' },
  { file: 'reconcile-structure.ts', when: 'event', trigger: 'integrity_eps_beyond_total / late-airing entries', note: 'episodes outrunning components → chain walk + rebuild (I33)' },
  { file: 'stitch.ts', when: 'event', trigger: 'count_mismatch candidates or a ruled extension', note: 'the stitcher (I24–I27)' },
  { file: 'seed.ts', when: 'event', trigger: 'from /discover ONLY, after the dry-run recap (I42 mint rule; discovery_ruled_unbuilt lists what it would create)', note: 'THE SEED WRITER (G52 rostered form): a `series` ruling → a staged series row + identity + components; no rows, no anchors' },
  { file: 'afg-extend.ts', when: 'event', trigger: 'AFG page outruns our structure (audit-afg-structure)', note: 'merge-never-replace extension (I28/I29)' },
  { file: 'afg-restage.ts', when: 'event', trigger: 'any lib/afg.ts parser change', note: 're-parse stored raw_html, no refetch (G44)' },
  { file: 'anilist-restage.ts', when: 'event', trigger: 'any change to MEDIA_FIELDS in lib/anilist.ts', note: 'refetch + hash-gated restage of every series/component media so staging carries the current query shape (G44 analogue; T4.1 added relation countryOfOrigin)' },
  { file: 'rederive-anchors.ts', when: 'event', trigger: 'any change to lib/afg deriveAnchors or lib/anchors syncAnchors', note: 're-derive AFG anchors from staging (A20/A24)' },
  { file: 'refix.ts', when: 'event', trigger: 'parse_integrity flags after an AFL page change', note: 'no-conditional re-scrape of held slugs' },
  { file: 'audit-titles.ts', when: 'event', trigger: 'title_incomplete rows; NOTE reads the static fixture index (T0 finding)', note: 'staged titles vs AFL index; MANUAL_EXCLUDE rulings (I11)' },
  { file: 'rebuild.ts', when: 'event', trigger: 'CANONICAL-SHAPE MIGRATION ONLY — wipes canonical; not idempotent; Sean-authorized', note: 'full re-resolve from staging' },
];

export const CENSUS: RosterEntry[] = [
  { file: 'audit-ui-truth.ts', when: 'standard', note: 'THE census: every rule class (P5); ruling_violation must be 0 (P18)' },
  { file: 'verify-series-display.ts', when: 'standard', args: ['--all'], note: 'whole-series render through the app path (P19)' },
  { file: 'audit-afg-structure.ts', when: 'standard', note: 'AFG page ↔ canonical structure cross-check; --register by hand (I3–I5)' },
  { file: 'audit-discovery.ts', when: 'standard', note: 'the DISCOVERY census (I42): the halo buckets, the proposals (never written), the sitting trigger, stale rulings' },
  { file: 'wiki-title-verify.ts', when: 'event', trigger: 'before declaring a wiki numbering shift', note: 'title alignment at offsets −1/0/+1' },
];

export const LIB_SUPPORT: string[] = ['build-functions.ts', 'parser-check.ts', 'rosters.ts', 'run-roster.ts', 'lib-hash.ts'];

export const ROSTERED = new Set([...PULL, ...HEAL, ...CENSUS].map((e) => e.file));
