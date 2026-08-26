# Restructure phase — the plan (v2, agreed 2026-08-25)

Status: **T1 done (2026-08-26). Next: T4.0 glossary session (Sean) — agenda §5; T2/T3 may run on either side of it.** v1 was drafted from a disk survey, cross-checked
by a second model (Cursor/Grok), re-checked against the tree, and folded.
This file is the phase's tracked board: every piece has an id, a track, a
dependency and a status; the board is updated at every save point. When the
phase closes, durable content moves to its permanent homes and this file
becomes history (the `CHUNK1-RECOVERY.md` pattern).

Charter: `docs/system-evolution.md` → "Restructure-phase charter". Success
test: *a cold session can find the governing rule for any ask in one hop* —
made to FAIL CLOSED by §6 below, not checked by feel.

---

## 0. What the survey found (2026-08-25, from disk)

**Rules do not live in one place.** Defect sites (where an overlook has
already happened or can): §10's table (88 rows); §11's PROSE (~250 lines —
A4, C1–C3, the GTO lesson, sliver rule, relocated-opener rule, count-vs-
number space, start-sanity guard); `franchise-rulings.md`; five ruling maps
inside the 923-line `lib/resolve.ts`; per-series rulings scattered across
20 `apply-*.ts` scripts (the only record of many of Sean's calls, reasoning
inline); display-side rules in `src/lib` and components. The hellsing/
gintama overlook was a §11-prose rule not being found from §10 — a filing
defect, not a model lapse.

The INVENTORY set is larger than the defect set (T0's extract list, §3).

Other facts: 69 of 88 §10 rows name no audit class (invisible — no column);
`audit-ui-truth.ts` has 32 classes; four `PROTOCOL.md` files drift
(49→97 lines, batch 17's restates rule text a third time); ~20 undated
one-off scripts from 08-22/23 look like coverage; the Supabase 1000-row cap
broke the C3 healer AND the survey query — `lib/db.ts` has no paged helper
and no walk knows when it was partial; `WIKI_NUMBERING_SHIFTS` (empty)
duplicates the numbering-shift MECHANISM at a call site (invariant 1) —
not value drift.

Schema: `episodes.type` ∈ {canon 14,859 · mixed 1,035 · filler 2,992 ·
anime-only-canon 977}; `series.source_type` ∈ {manga 256 · original 53 ·
light_novel 34}; 62 series carry anime-only-canon rows — 24 original-
source, 38 adapted. See §5 (T4.0 agenda) for the four-way homonym.

---

## 1. The architecture: five kinds, five homes, one direction of truth each

This table is the architecture; everything else in the phase is filing.
It becomes the front page of the generated `rules.md`.

| kind | what it is | home | direction of truth |
|---|---|---|---|
| **Rule** | a universal predicate (A1, sliver, ownership guard) | ledger record (TS) → lib gate → audit class → generated `docs/rules.md` | ledger → code → audit (spec first; the ledger is NEVER generated from code) |
| **Ruling** | an instance of a rule for one series/episode (X 21–24 retype, prisma-illya MU suppress, JoJo = one series) | a typed map in `lib/rulings/` → generated `docs/rulings.md` keyed by series | code map → generated index (the map is canonical) |
| **Architecture fact** | how the system is built (staging is greedy, our slug is identity) | `docs/architecture.md` | prose, rarely read |
| **Process** | how a session works (research-first, 2+ sources, wave size, PROTOCOL pin) | skill + changelog; a P-family ledger row only where an agent must cite it | skill text |
| **Trap** | a source or pipeline lie | `research-agent` definition / `apply-batch` traps section | agent/skill text |

CLAUDE.md is a **router**: stack, cycle, the eight hard invariants (kept —
the deliberately always-on subset, cited by id), the separations table, and
a family strip (id + one line). Full rule text lives only in the ledger.

---

## 2. Principles

1. **Reference structure before data work.** No taxonomy build, no backlog
   data item, until the ledger and `/add-rule` stand.
2. **One rule, one id, one row.** Grain = what a verdict would cite. Bundled
   rows (MU-frontier = five gates; the C3 row restates A4) are split.
   Re-homed ids (D1, D4) keep MACHINE-CHECKABLE aliases.
3. **Generated beats hand-maintained — for instances and for the human view.**
   `docs/rules.md` and `docs/rulings.md` are generated; the records are the
   truth. The ledger records are TS under `scripts/ingest/lib/ledger/` so
   they are in the `tsc -b` graph (a docs-only path can silently drop out).
4. **Fail closed at every boundary.** Referential check on the ledger
   (duplicate id, unknown audit class, non-resolving enforcement path, dead
   citation); unknown `source_type` never defaults; walks that cannot prove
   completeness fail.
5. **Each piece ends at a save point** — gates green, board updated, commit.
   A usage limit costs one piece.
6. **Sean rules, the session builds.** Decisions batched at track
   boundaries; the T0 drift list is the next ruling set.
7. **Delete with evidence.** Removal only when the inventory shows the
   effect is asserted elsewhere or the subject no longer exists; reasoning
   extracted BEFORE any script becomes history. Every removal listed.
8. **Cross-model check the frames, not just the data.** Repeat the pass that
   produced v2 after T4.0 — the spec-writer cannot see their own bad frame.

---

## 3. Tracks

### T0 — System inventory
Goal: one table of EVERY rule, ruling, audit class and process rule across
ALL homes, each with: kind · id-candidate/alias · statement · every place it
is stated · enforcement site · enforcement layer · audit class · witnesses
(from what we actually ruled) · bundle? · status (live / superseded /
contradicted / dead). Plus the script triage.

**Extract list (explicit — a fan-out agent stops at nothing short of this):**
1. `docs/data-pipeline.md` §10 (88 rows; mark bundles)
2. `docs/data-pipeline.md` §1–9 and §11 (prose rules; the flag rule, identity, franchise process, research tier, maintenance audits, new-source checklist, cadence)
3. `docs/data-pipeline.md` §12 (rules ratified in log entries that never reached §10)
4. `docs/franchise-rulings.md`, CLAUDE.md hard invariants, `docs/system-evolution.md` planned-not-built items
5. `scripts/ingest/lib/*.ts` — gates enforced in code (resolve, anchors, mu-frontier, chain, afg, afl, c3, match, wikipedia) and the standing maps
6. non-lib `scripts/ingest/*.ts` — standing maps by the DISCRIMINATOR below + script triage
7. `src/lib/mapping.ts`, `src/lib/supabaseSource.ts`, components (TypeBadge, EpisodeList, AnimeCard, MappingStrip) — display-side rules
8. skills, agents, the four `PROTOCOL.md`, `DECISIONS-FOR-SEAN.md` ×3, `CHUNK1-RECOVERY.md` — process rules, restated rule text (for drift), traps
9. `audit-ui-truth.ts`, `audit-manga-coverage.ts`, `audit-afg-structure.ts`, `verify-series-display.ts` — every audit class IS a rule about what wrong looks like

**Discriminator for a standing ruling map:** a declarative, per-id record
that SURVIVES a re-run (an override, cap, suppression, split, regime,
registration, exclusion with a reason). NOT: script locals (`DRY`, `ONLY`,
`KINDS`, `TYPES`), one-shot payload arrays (`ANCHORS`, `CONTINUE`), target
lists. The map count is a T0 OUTPUT, not a number fixed in advance.

**Script triage classes:** `pull` (fetches/stages) · `heal` (idempotent
rescan) · `census` (audit/verify) · `history` (one-shot apply whose rulings
are extracted) · `dead` (no effect not asserted elsewhere) · `lib-support`.
Evidence per file: what it writes, whether idempotent, who references it,
last-touched date.

Pieces: T0.1 per-home extracts (fan-out, uniform JSON) → T0.2 merged
inventory + DUPLICATES + **DRIFT list for Sean** → T0.3 script triage.
Exit: `docs/restructure/inventory.md` + drift list. T0 changes row-splits
and map counts; it must not change the architecture in §1.

### T1 — The reference architecture
- T1.1 Split `data-pipeline.md` → `architecture.md` (§1–9, rules REMOVED to
  the ledger with pointers back), `rules.md` (generated), `runbook.md`
  (§11 operations), `changelog.md` (§12, append-only). CLAUDE.md router in
  the same commit.
- T1.2 The ledger: TS records `{ id, aliases[], family, statement, ruledBy,
  ruledOn, enforcement: [{ path, symbol }], enforcementLayer: writer |
  display | both | process, auditClass?, witnesses[], status, supersedes? }`
  + `ledger-check` (referential) + `gen-docs` → `docs/rules.md` with a
  family strip on top. §11 prose becomes rows; bundles split; I-family holds
  the franchise RULES (instances go to the rulings index).
- T1.3 The §1 table as the front page; capture routing per kind.
- T1.4 Drift rulings (Sean's session, not a side-effect of T1.2): for each
  T0 drift item the standing version is chosen; losers deleted.
- T1.5 `docs/STATE.md` — phase, cycle step, next action, open decisions —
  ONLY under the loop: consolidate reads it first and writes it last; memory
  points at it.
- T1.6 One-hop cases: `cases.json` (ask → expected id → home), seeded from
  the documented batch-17 misses; the mechanical check (id live, family
  strip covers the ask) runs in the system census.

### T4.0 — Taxonomy glossary session (Sean; scheduled right after T1)
A NAMING session, not a build and not a substitute for `/add-rule`. Output:
T-family ledger rows (the glossary), PROTOCOL + agent vocabulary updated so
no agent ships the old words after the glossary exists. Agenda in §5.

### T2 — Code homes
- T2.1 `lib/rulings/` — one file per standing map (from T0's count), every
  entry a typed `RulingEntry { seriesId, ruleId, value, reason, ruledOn,
  retiresWhen? }` (a missing reason is a type error); logic files import
  them; behaviour identical.
- T2.2 `gen-docs` → `docs/rulings.md` keyed BY SERIES (one hop to "what have
  we ruled about this series").
- T2.0 **Compile-graph sidecar (found 2026-08-25 during T0 setup):** root
  `tsconfig.json` references only `src` and `vite.config.ts` — `scripts/ingest/`
  (every lib gate, all scripts, the edge sources) is type-checked by NOTHING;
  `tsx` strips types. The `tsc -b` gate is vacuous for the pipeline (the
  `-p .` lesson again). Fix: `tsconfig.scripts.json` referenced from the root,
  errors fixed, gate real — BEFORE T1.2 (the ledger check depends on it).
- T2.3 **Completeness as an outcome (sidecar — starts now, no dependency):**
  `lib/db.ts` `selectAll` (paged, `count: 'exact'`), every catalog walk
  reports `processed/total` and FAILS if short; healers no-op on a clean
  catalog (idempotency check). P-rule.
- T2.4 Three rosters — `pull.ts` / `heal.ts` / `census.ts` manifests + npm
  scripts; system census asserts every `scripts/ingest/*.ts` is on a roster,
  in `history/`, or lib-support.
- T2.5 Script triage applied (reasoning extracted first, per principle 7).
- T2.6 Edge rebuild + deploy; `build-functions.ts` stamps the lib content
  hash into each bundle; refreshes log it; census compares (invariant 2 made
  checkable — lands here, not as an add-rule exercise).
- T2.7 `npm run census -- --system`: every enforcement path/symbol resolves;
  every audit class exists; every id cited in skills/agents/PROTOCOL/maps is
  live; PROTOCOL/skills contain ids not rule prose; every script rostered;
  generated docs not stale; one-hop cases pass. Standalone; consolidate
  step 0; red = blocking during this phase.

### T3 — Skills and agents
- T3.1 `/add-rule` — gate → four edges → audit class → heal → every census
  delta explained → ledger record (with witness) → commit. **Exercise 1:
  AIR_DATE_OVERRIDES** (9 rows). **Exercise 2: a second DATA rule** (AFL
  non-episode-row audit, or T0's smallest) — the skill is not proven on one.
- T3.2 PROTOCOL collapse → `research/PROTOCOL.md` (contract citing ids) +
  per-batch delta; adds `rules_applied[]` to the verdict JSON with the
  DECIDABLE situations listed (anchor on filler/anime-only → A1; mid-chapter
  continue → C1; …) — fail closed only on those; the PROTOCOL is PINNED
  (hash) for an in-flight batch (P-rule).
- T3.3 `/consolidate` rework: phased around the cycle; rosters from T2.4;
  `deep` REQUIRED when any ledger record's enforcement site changed since
  the last pass; two-level deep designed (routine skips locked series,
  rule-change deep never does) — locks BUILT after T4.
- T3.4 `/research-batch` + `/apply-batch` on the new homes; traps sections
  seeded from the recovery/decision files.
- T3.5 `verdict-verifier`: checks wrong citations and missing decidable
  ones; runs the one-hop cold probe (~10 asks, different model).

### T4 — Source-first typing (build, after T3.1)
Through `/add-rule`, ends in `consolidate deep`. Scope: schema + derivation
rule + the 24 original-source series + witnesses + badge strings. The 38
adapted series with studio-original material are **batch-18 research under
the new rule**, never a migration script.
- T4.1 Schema: exhaustive `source_type` + check; per-episode FORMAT column
  (tv/ova/special/movie/recap) orthogonal to standing; asterisk/ending-class
  annotation kinds; `watch_order_entries.kind` backfill; types regenerated.
- T4.2 Derivation: AniList `source` + `countryOfOrigin` + linked format →
  `source_type` with a curated override map; unmapped FAILS CLOSED; the
  AFL-import rule (§5) replaces the 1:1 `anime_canon → anime-only-canon`.
- T4.3 Data under the new rule for the 24 originals; base-type padding and
  legend rules; mapping tests; audit class for the adapted-series holding
  value = the batch-18 work-list.
- T4.4 D2 (multi-space entries) designed at T4.0; built only if ruled in.
- T4.5 Badge/tag string changes with tests; representation stays UI-phase.

### T5 — Backlog routing
| item | route |
|---|---|
| AIR_DATE_OVERRIDES | T3.1 exercise 1 |
| AFL non-episode-row audit class | T3.1 exercise 2 (candidate) |
| Continua chart cross-check gate | add-rule |
| Permanence locks (15 candidates, listed by T0) | after T4 |
| AFG-expansion typing sweep | heal + census |
| ch-82-inside-range schema question, D2 | T4.0 agenda |
| watch_order_entries.kind backfill | T4.1 |
| hayate rows, iruma ep-65, konjikinogash sweep | batch 18 wave 1 |
| React-hooks findings | UI phase |

Dropped from this phase: `/plan-batch`, a DB rulings table, a rules search
UI.

---

## 4. Sequence

```
T0 inventory ─► T1 ledger+split ─► T4.0 glossary (Sean) ─► T2 code homes ─► T3 skills (+2 add-rule exercises)
      │                                                                              │
      └─ T2.3 completeness sidecar (any time)                                        ▼
                                                              T4 build ─► consolidate deep ─► batch 18 (38 adapted under the new rule)
```
T2/T3 may run on either side of T4.0 as long as no agent ships the old type
words after the glossary exists. Rough total: 8–12 sessions.

---

## 5. T4.0 agenda (parked — ruled IN that session, with T0's override-map evidence in front of Sean)

**The four-way homonym (verified on disk 2026-08-25):**
| words | where | meaning today |
|---|---|---|
| AFL `anime_canon` | `lib/afl.ts:14`, mapped 1:1 → `anime-only-canon` | AFL's own class = "not in the manga, treated as canon" — but it SPANS Madoka (the anime is the source) and Black Clover 130–157 (studio-original inside an adaptation, standing = judgment) |
| `episodes.type = anime-only-canon` | storage (977 rows, 62 series: 24 original / 38 adapted) | intended "original but canon"; used for both classes above |
| UI `anime_only` badge | `TypeBadge.tsx:20` | reads as the wild phrase, which usually means filler |
| `series.manga_status = 'anime_only'` | `lib/resolve.ts:864` | "there is no manga" — a SERIES fact wearing an EPISODE word |
| `manga_only` (render concept) | mapping | the unadapted source tail — not a stored type |

**Decisions for the session:**
- D-9 the source enum (seed: AniList `source` values; KR/CN → manhwa/manhua; webtoon by format; candidates: web novel, novel, visual novel, game, doujin, original video) + derivation/override rule; unmapped fails closed.
- D-10 standing relative to source: does `anime-only-canon` collapse into `canon` for original-source series? The studio-original-inside-adaptation classes kept DISTINCT: only-ending (X: filler + asterisk), caught-up-pad (DSQ: filler + why), contested ending (Eva: canon + annotation), consensus-original (Black Clover/Boruto class).
- D-11 format dimension (column vs annotation kind); `watch_order_entries.kind` vocabulary; asterisk classes as annotation kinds.
- D-12 badge strings that cannot be read as the wild "anime only"; "manga only" → "source only" or ruled name; `manga_status = 'anime_only'` renamed in the same session; per-source instrument unit (chapter / volume / episode).
- D-13 D2 in or out of scope; the ch-82-inside-range schema question.
- **Candidate AFL-import rule (preserves invariant 4; NOT frozen):** for `source_type = original`, AFL anime-canon → plain `canon`; for adapted series, AFL anime-canon is ADVISORY and lands as a holding value (working name `original-unruled`) that displays as anime-original with no canon claim, with an audit class that is the batch-18 work-list.
- Success test: a cold agent cannot use "anime only" to mean filler; a Madoka episode is not the same type as Black Clover 130–157.

---

## 6. Success metrics (the board's scoreboard — files existing is not a metric)

| metric | today | done |
|---|---|---|
| ledger rules with no audit class | 88 of 258 (2026-08-26 ledger v1) | falling; empty cell = visible backlog |
| PROTOCOL copies restating rule text | 4 (13/21/17/33 rule citations) | 1, ids only |
| standing ruling maps outside `lib/rulings/` | ≈30 (T0 count) | 0 |
| unrostered ingest scripts | 36 to move/delete (34 history + 2 dead); 27 to roster | 0 |
| CLAUDE.md role | router + family strip (done 2026-08-26) | router + family strip |
| one-hop cases (batch-17 misses) | 16 defined, 16 pass mechanically (2026-08-26); cold probe pending T3.5 | all pass, mechanically + cold probe |
| broken ledger citations | 0 (ledger-check --citations, 2026-08-26) | 0 (system census green) |
| walks that cannot prove completeness | 4 paging impls, 7+ unpaged selects, syncAnchors A1 hole | 0 |
| ingest files outside the `tsc -b` graph | all of `scripts/` | 0 |
| edge bundles ≠ lib hash | unchecked | 0 |
| duplicated mechanisms (DRIFT-LIST §C) | 18 | 0 |
| log-only rules | 52 (§12) + 11 (§11 prose) | 0 |

---

## 7. Decisions — RULED 2026-08-25 (Sean, after the cross-model pass)

| id | ruling |
|---|---|
| D-1 | Rule ids by family (A anchors/position · C continue · T typing · N numbering/counts/spaces · I identity/franchise · S source gates · V volumes · R research · P process); existing A1/A4/C1–C3 keep numbers; D1/D4 re-homed WITH machine-checkable aliases; grain = what a verdict cites; bundles split |
| D-2 | Docs split into architecture / rules (generated) / runbook / changelog; no rule text left in architecture; CLAUDE.md = router |
| D-3 | I-family RULES in the ledger; franchise INSTANCES in the generated rulings index |
| D-4 | Rulings index generated from typed maps; the ledger is authored, never generated from code |
| D-5 | Historical scripts move to `history/` with evidence; reasoning extracted first; delete only what is asserted elsewhere |
| D-6 | Permanence: two-level deep designed now, locks built after T4 |
| D-7 | Reference structure first; T4.0 glossary right after T1; T4 build after `/add-rule` |
| D-8 | One piece per session, save point each; Sean rules at track boundaries |

---

## 8. The board

| id | piece | depends | status |
|---|---|---|---|
| T0.1 | per-home extracts (8 readers, 15 part-files, 1,142 entries) | — | done |
| T0.2 | merged inventory + drift list (`docs/restructure/DRIFT-LIST.md`) | T0.1 | done — **§A awaits Sean** |
| T0.3 | script triage (65 files: pull 7 · heal 16 · census 4 · history 34 · lib-support 2 · dead 2) | T0.1 | done |
| T1.1 | docs split (architecture / runbook / changelog / stub) + CLAUDE.md router | T0.2 | done 2026-08-26 |
| T1.2 | ledger records (258, 9 families, S→G) + ledger-check + gen-docs → rules.md | T0.2 | done 2026-08-26 |
| T1.3 | separations front page (rules.md header + CLAUDE.md five kinds) | T1.2 | done 2026-08-26 |
| T1.4 | drift rulings (Sean) — A-1..A-10 | T0.2 | done 2026-08-25 |
| T1.5 | STATE.md; memory points at it (consolidate loop wired in T3.3) | T1.1 | done 2026-08-26 |
| T1.6 | one-hop cases (16, batch-17 misses first) + one-hop-check | T1.2 | done 2026-08-26 |
| T4.0 | glossary session (Sean) | T1.2 | planned |
| T2.1 | lib/rulings/ + RulingEntry | T1.2 | planned |
| T2.2 | rulings index by series | T2.1 | planned |
| T2.0 | compile-graph sidecar (tsconfig.scripts.json) | — | done 2026-08-26 |
| T2.3 | completeness sidecar | — | planned |
| T2.4 | three rosters | T0.3 | planned |
| T2.5 | script triage applied | T2.4 | planned |
| T2.6 | edges + lib-hash stamp | T2.1–2.5 | planned |
| T2.7 | system census | T2.4, T1.6 | planned |
| T3.1 | /add-rule + 2 exercises | T1.2, T2.1 | planned |
| T3.2 | PROTOCOL collapse + rules_applied + pin | T1.2, T4.0 | planned |
| T3.3 | consolidate rework | T2.4, T2.7 | planned |
| T3.4 | research-batch / apply-batch | T3.2 | planned |
| T3.5 | verifier + cold probe | T3.2 | planned |
| T4.1–4.5 | taxonomy build | T4.0, T3.1 | planned |
| T5.* | backlog routing | per §3 | planned |
