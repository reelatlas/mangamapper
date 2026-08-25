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
