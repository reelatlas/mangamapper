# mangaMapper

Anime ↔ manga chapter-mapping catalog: for ~343 series, where an episode
sits in the source material, with the honest answer ("no exact record")
shown instead of a guess. Live at https://mangamapper.vercel.app.

The product promise is that a position shown to a user is TRUE. Most of the
repo exists to make that mechanical: a typed rules ledger, ingest scripts
that share one library with the Supabase edge functions, and audit scripts
that verify outcomes in the data rather than intentions in the code.

## Stack

Vite 8 · React 19 · TypeScript 6 (strict in `src/`) · Tailwind 4 (CSS-first)
· shadcn/ui (15 primitives, customised) · Motion · TanStack Query + Virtual ·
Supabase (Postgres, RLS on every table, 5 edge functions, pg_cron + Vault)
· Vercel from `main`.

## Run

```bash
npm install          # Node 24 (.nvmrc, engine-strict)
npm run dev
```

Browser env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env`.
Ingest scripts read `.env.ingest` (service role, never shipped):
`npm run pull`, `npm run heal`, `npm run census`.

## Gates

```bash
npx tsc -b --noEmit && npm run lint && npm test && npm run build && npm run system:census
```

`system:census` is the project's own gate: ledger integrity (every rule
points at a file, a symbol, and an audit class that exist), citation sweep,
edge-bundle hash parity, roster membership, generated-doc freshness. The
GitHub Actions workflow runs the first four on dispatch only (see "What is
deliberately not here").

## Structure

- `src/data/catalog/` — the `CatalogSource` seam (`source.ts`), the pure
  assembly of DB rows into the UI's `Episode`/`MappingSummary` shapes
  (`assemble.ts`), and the Supabase and mock implementations.
- `src/lib/mapping.ts` — position math (episode ↔ volume ↔ chapter).
- `src/components/` — `CatalogField` (the search-and-takeover instrument),
  `EpisodeList` (virtualised, hand-rolled scroll anchoring), `MappingStrip`.
  Behavioural contracts per component live in `docs/components/`.
- `scripts/ingest/lib/` — the rules and gates, consumed identically by the
  CLI scripts and the edge functions (`supabase/functions/_src/`), bundled
  by `build-functions.ts` with a lib hash the census checks.
- `scripts/ingest/lib/ledger/` — the rules as typed records; rendered to
  `docs/rules.md` by `npm run ledger:docs`.
- `scripts/restructure/` — `ledger-check`, `system-census`, doc generators.
- `supabase/migrations/` — 56 migrations: schema, RLS, cron, vault.

Docs: `CLAUDE.md` routes to everything; `docs/STATE.md` is where the
project stands; `docs/rules.md` the ledger; `docs/architecture.md`,
`docs/data-pipeline.md`, `docs/runbook.md`; `DESIGN_SYSTEM.md` the visual
system and motion intents; `docs/changelog.md` the `§12.N` history that
commits cite.

## What is deliberately not here (yet)

Personal project, one maintainer, built for speed. Each omission has a
trigger:

- **No CI on push.** Gates run locally before every push; the workflow is
  dispatch-only. The account's shared Actions minutes do not stretch to a
  job per push for a solo repo. Trigger: a second contributor.
- **No error reporting service.** A render failure hits the app's one
  `ErrorBoundary`; a failed fetch shows `FetchError`; both log to the
  console. Trigger: real traffic.
- **Scripts are not strict TypeScript.** `src/` is; `scripts/` (51k lines,
  heavy `any` at the HTTP boundaries) is typed per module behind its 300
  tests as modules are touched. Trigger: a module's next change.
- **Research transcripts are tracked** (`scripts/ingest/research/`, 15 MB):
  they are the provenance the ledger cites. Trigger for LFS: the clone
  getting slow.
