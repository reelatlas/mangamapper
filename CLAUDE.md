# mangaMapper

Anime↔manga chapter-mapping catalog. ~343 series. Read-only comparison first;
library/reader management later. The product promise is that a position shown
to a user is TRUE — an honest gap beats a plausible guess, always.

## Stack

Vite 8 · React 19 · TypeScript 6 · shadcn/ui · Tailwind 4 (CSS-first) ·
Motion · Supabase (`ysjnqbnbtftjdepovpkt`) · Vercel deploys from `main`.

- **npm, never bun.** Node 24 LTS, pinned in `engines` + `.nvmrc`, enforced by
  `engine-strict` in `.npmrc`. Brew relinks `node` during unrelated upgrades —
  if npm starts refusing, that is why; relink `node@24`.
- Ingest scripts: `npx tsx --env-file=.env.ingest scripts/ingest/<x>.ts` from
  the repo root.
- Gates before any commit: `npx tsc -b --noEmit` (never `-p .` — it checks
  nothing), `npm run lint`, `npm test`, `npm run build`.

## Hard invariants

These are not preferences. Breaking one is a bug even if everything is green.

1. **Rules live in shared lib code** (`scripts/ingest/lib/`) consumed
   identically by scripts and edge functions. Never inline a rule at a call
   site.
2. **Any `lib/` change → rebuild and deploy ALL FOUR edge functions**
   (`build-functions.ts`, then deploy refresh-afl/afg/anilist/mu). Crons must
   run the same code as scripts. Forgetting this has shipped silent drift.
3. **Audits verify OUTCOMES, not intentions.** A misbehaving writer must
   surface as data (`audit-ui-truth.ts`). If a rule can be checked
   mechanically, it MUST be — a model should never re-derive what a script
   can assert.
4. **Incomplete data degrades gracefully** — pending, hidden, an honest
   dash. Never NaN, never a fabricated number.
5. **Nothing reaches Sean unresearched.** 2+ independent sources with
   citations. Instant-answer boxes and content farms are cross-check only,
   never primary.
6. **A1: filler / anime-only rows never carry chapter anchors.**
7. **Repairs live at the manual tier.** A repaired value on a derivation-tier
   row (`mu`, `afg`, `afg-continua`) is deleted by that source's next
   re-derive.
8. **No one-offs, no hacks, no escape hatches that become permanent.** If a
   fix would only work for one series, it is the wrong fix. Prefer the rule.

## Where things are

| what | where |
|---|---|
| **The rules ledger** (81 rules + enforcement sites) | `docs/data-pipeline.md` §10 |
| Operations runbook / freshness map | `docs/data-pipeline.md` §11 |
| Numbered change log | `docs/data-pipeline.md` §12 |
| Franchise/identity rulings | `docs/franchise-rulings.md` |
| Position math (pure, unit-tested) | `src/lib/mapping.ts` |
| Shared ingest rules | `scripts/ingest/lib/` |

Read the ledger before proposing a rule — most questions are already ruled on.

## The data cycle — the standard process for all data work

Run these in order. Each step ends by naming the next, so the sequence does
not have to be remembered. Never skip a step because the work "seems small" —
the skipped step is where the drift enters.

| # | step | who / how |
|---|---|---|
| 1 | **Plan** | main session. Work-list recomputed FROM DISK, wave sized 6–8 |
| 2 | **Research** | `/research-batch` → `research-agent` subagents (Opus) |
| 3 | **Verify** | `verdict-verifier` — a DIFFERENT model than authored it |
| 4 | **Rule** | **Sean decides.** Curated maps encode his rulings, not a model's |
| 5 | **Apply** | `/apply-batch` — dry-run, apply, re-resolve, heal, verify, census |
| 6 | **Consolidate** | `/consolidate` (`deep` when a rule change invalidates prior per-series decisions) |
| 7 | **Capture** | fold new learnings back in — see below |

**How steps 3–4 run in practice.** The main session is typically Fable while
`research-agent` subagents are Opus — so the session model reviewing agent
output ALREADY satisfies the cross-model property. Sean works through
validation and decisions with the session model; that is the normal path, not
a compromise.

`verdict-verifier` is not a replacement for that. It is a systematic
adversarial sweep for when a wave produced many verdicts and a mechanical
contradiction hunt should run BEFORE human attention is spent. The two are
complementary: the verifier finds what is broken at scale, the session decides
what to do about it.

The one residual blind spot the session cannot cover itself: if the SPEC was
subtly wrong (agents pointed at the wrong chapter space, a mis-scoped target),
the model that wrote the spec may not see its own bad framing. That risk is
covered mechanically — the contradiction scan, the census deltas, and the
verifier — not by model choice.

Step 4 is not a formality. A verdict can be sound and still be answered with
something other than what it proposed: Toriko's honest `263 → 253` repair was
answered with a DELETION because A1 forbids an anchor on a filler row. A
model that both verifies and rules has nobody checking it.

## Capture — where a new learning goes

The cycle only compounds if learnings land somewhere durable. When something
is learned, route it — and say which route was taken:

- **A rule** → `docs/data-pipeline.md` §10 with its enforcement site, then a
  **writer gate** in `lib/`, then an **audit class** verifying the outcome.
  A rule that reaches an audit stops costing model attention forever. This is
  the direction of travel: judgment → gate → audit.
- **A source trap** (a wiki that lies, a parse that shifts numbering) → the
  `research-agent` definition, so every future agent starts knowing it.
- **A pipeline trap** (a shape that laundered bad data) → the `apply-batch`
  skill.
- **A ruling from Sean** → the curated map, with reasoning inline, AND §10 if
  it generalises beyond one series.
- **A process fix** → the relevant skill, plus a `§12` log entry.

If a learning has no durable home, it will be re-learned at full price.

## Workflows (skills — invoke, don't reconstruct)

- `/consolidate` — systematic pass: writer sweep, healers, census, docs, save
  point. `/consolidate deep` adds a full-catalog rescan.
- `/research-batch` — fan out research under the batch protocol.
- `/apply-batch` — curate verdicts, apply, verify, commit.

## Model policy

Work is tiered by judgment density, not by task type:

- **Rulings** (rule design, verdict curation, triage forks) — main session,
  strongest available model. Tiny token cost, highest stakes.
- **Research** (per-series source triangulation) — parallel subagents via the
  `research-agent` definition. This is the dominant token cost; cap
  concurrency at 6–8 so one limit event cannot cost a whole fleet.
- **Verification** — scripts first. Where a model is needed, prefer a
  DIFFERENT model than produced the work: models fail differently, and
  cross-model review catches what homogeneous review misses.

Artifacts are the handoff. A verdict JSON, a context file, a protocol — these
survive model switches and account switches; conversation context does not.
