# mangaMapper

Anime↔manga chapter-mapping catalog. ~343 series. Read-only comparison first;
library/reader management later. The product promise is that a position shown
to a user is TRUE — an honest gap beats a plausible guess, always.

This file is a ROUTER. Full rule text lives in the ledger (`docs/rules.md`);
every rule has an id (`A1`, `C3`, `G12`) and aliases, and that id is how you
cite it in code comments, anchor notes, verdicts and commits.

## Stack

Vite 8 · React 19 · TypeScript 6 · shadcn/ui · Tailwind 4 (CSS-first) ·
Motion · Supabase (`ysjnqbnbtftjdepovpkt`) · Vercel deploys from `main`.

- **npm, never bun.** Node 24 LTS, pinned in `engines` + `.nvmrc`, enforced by
  `engine-strict` in `.npmrc`. Brew relinks `node` during unrelated upgrades —
  if npm starts refusing, that is why; relink `node@24`.
- Ingest scripts: `npx tsx --env-file=.env.ingest scripts/ingest/<x>.ts` from
  the repo root.
- Gates before any commit (`P27`): `npx tsc -b --noEmit` (never `-p .`; the
  `scripts/` project is in the graph since 2026-08-26), `npm run lint`,
  `npm test`, `npm run build`, and `npx tsx scripts/restructure/ledger-check.ts`
  (red = blocking).

## Hard invariants (always on)

These are not preferences. Breaking one is a bug even if everything is green.
Each is a ledger record — cite the id.

1. **`P2` Rules live in shared lib code** (`scripts/ingest/lib/`) consumed
   identically by scripts and edge functions. Never inline a rule at a call
   site.
2. **`P3` Any `lib/` change → rebuild and deploy ALL FOUR edge functions**
   (`build-functions.ts`, then deploy refresh-afl/afg/anilist/mu). Crons must
   run the same code as scripts.
3. **`P5` Audits verify OUTCOMES, not intentions.** A misbehaving writer must
   surface as data (`audit-ui-truth.ts`). If a rule can be checked
   mechanically, it MUST be.
4. **`P6` Incomplete data degrades gracefully** — pending, hidden, an honest
   dash. Never NaN, never a fabricated number.
5. **`R1` Nothing reaches Sean unresearched.** 2+ independent sources with
   citations (`R3`); instant answers and content farms are cross-check only.
6. **`A1` Filler / anime-only rows never carry chapter anchors.**
7. **`P8` Repairs live at the manual tier.** A repaired value on a
   derivation-tier row (`mu`, `afg`, `afg-continua`) is deleted by that
   source's next re-derive.
8. **`P9` No one-offs, no hacks, no escape hatches that become permanent.**
   If a fix would only work for one series, it is the wrong fix.

## Where things are — the router

| what | where |
|---|---|
| **The rules ledger** — 258 rules, ids + aliases, family strip, alias index | `docs/rules.md` (GENERATED — edit the records in `scripts/ingest/lib/ledger/`, run `ledger-check`, then `gen-docs`) |
| Per-series rulings (overrides, caps, suppressions, regimes) | today: the maps in `scripts/ingest/lib/resolve.ts` + `apply-*.ts`; after T2: `scripts/ingest/lib/rulings/` → `docs/rulings.md` |
| Franchise / identity instances | `docs/franchise-rulings.md` (the principles are I-family rules) |
| How the system is built | `docs/architecture.md` |
| Operating it — freshness map, cadence, rosters, new-source checklist | `docs/runbook.md` |
| Numbered change log (append-only) | `docs/changelog.md` (§12.N numbering continues) |
| **Where we are right now** — phase, cycle step, next action, open decisions | `docs/STATE.md` (consolidate reads it first, writes it last) |
| Restructure-phase board and T4.0 agenda | `docs/restructure-plan.md` |
| Position math (pure, unit-tested) | `src/lib/mapping.ts` |
| Shared ingest rules and gates | `scripts/ingest/lib/` |

**The five kinds — where a new thing goes.** A *rule* (universal predicate) →
a ledger record + a lib gate + an audit class. A *ruling* (one series) → a
typed map entry with its reason. An *architecture fact* → `architecture.md`.
A *process* → the skill + `changelog.md`. A *trap* (a source or pipeline lie)
→ `research-agent.md` / the `apply-batch` traps. Find the governing rule by
id or alias BEFORE proposing one — most questions are already ruled on.

**Families:** A anchors & position · C continue-read · T typing & taxonomy ·
N numbering, counts & chapter spaces · I identity, franchise & structure ·
G gates & freshness (sources — not "S": season shorthand) · V volumes &
boundaries · R research protocol · P process & pipeline.

## The data cycle (`P1`) — the standard process for all data work

Run these in order. Each step ends by naming the next. Never skip a step
because the work "seems small" — the skipped step is where the drift enters.

| # | step | who / how |
|---|---|---|
| 1 | **Plan** | main session. Work-list recomputed FROM DISK (`P11`), wave sized 6–8 (`P12`) |
| 2 | **Research** | `/research-batch` → `research-agent` subagents (Opus) |
| 3 | **Verify** | `verdict-verifier` — a DIFFERENT model than authored it (`R24`) |
| 4 | **Rule** | **Sean decides.** Curated maps encode his rulings, not a model's |
| 5 | **Apply** | `/apply-batch` — dry-run, apply, re-resolve, heal, verify, census (`P15`–`P19`) |
| 6 | **Consolidate** | `/consolidate` (`deep` when a rule change invalidates prior per-series decisions, `P21`) |
| 7 | **Capture** | route every learning to its home (`P29`) — see the five kinds above |

The main session is typically Fable while `research-agent` subagents are
Opus — the session reviewing agent output already satisfies the cross-model
property; `verdict-verifier` is the systematic adversarial sweep on top of
that. Step 4 is not a formality: a verdict can be sound and still be answered
with something other than what it proposed (Toriko's `263 → 253` repair was
answered with a DELETION because `A1` forbids an anchor on a filler row).

**Capture (`P29`) — the direction of travel is judgment → gate → audit
(`P30`).** A rule that reaches an audit class stops costing model attention
forever; a learning with no durable home is re-learned at full price.

## Workflows (skills — invoke, don't reconstruct)

- `/consolidate` — systematic pass: writer sweep, healers, census, docs, save
  point. `/consolidate deep` adds a full-catalog rescan.
- `/research-batch` — fan out research under the batch protocol.
- `/apply-batch` — curate verdicts, apply, verify, commit.
- `/add-rule` — (T3.1, planned) gate → four edges → audit class → heal →
  census deltas → ledger record.

## Model policy

Work is tiered by judgment density, not by task type:

- **Rulings** (rule design, verdict curation, triage forks) — main session,
  strongest available model. Tiny token cost, highest stakes.
- **Research** (per-series source triangulation) — parallel subagents via the
  `research-agent` definition. Cap concurrency at 6–8 so one limit event
  cannot cost a whole fleet.
- **Verification** — scripts first. Where a model is needed, prefer a
  DIFFERENT model than produced the work.

Artifacts are the handoff (`P11`). A verdict JSON, a context file, a ledger
record — these survive model switches and account switches; conversation
context does not.
