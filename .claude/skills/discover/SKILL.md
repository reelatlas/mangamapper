# /discover — the discovery sitting (I42 / I43 / I44 / P39; built 2026-09-05)

The catalog no longer waits for AFL or AFG to say a season or a series
exists. This skill runs the sitting where Sean rules on what the halo and the
seed engines found, and it is the ONLY path that mints a series or a
component from a discovery ruling (the I42 mint rule: the mint is an event
step, after the dry-run recap has been seen; `npm run heal` only asserts).
The design: `scripts/ingest/research/discovery/PROPOSAL.md`.

**Two checkpoints, both in chat, both GENERATED (P5):** the sitting recap
(stored → proposed → decision) and the dry-run recap (the writer's reading of
the rulings). Never point Sean at a file for either.

## 0. Read STATE; stage the halo

- `docs/STATE.md` first. If a sitting is already in flight, it says which step.
- `npx tsx --env-file=.env.ingest scripts/ingest/discovery-stage.ts` — stages
  every unowned TV-shaped story relation of an owned entry (budgeted; a
  deferral is data and leads the next run). Staging only.

## 1. Derive from disk; the sitting recap IN CHAT

- `npm run census` (or `scripts/ingest/audit-discovery.ts` alone) — the
  classes: `halo_sequel_unclaimed`, `halo_series_unclaimed`,
  `halo_extra_standing` (capped; I13 standalone by default),
  `discovery_new_since_sitting` (the trigger), `discovery_ruled_unbuilt`,
  `discovery_ruling_stale`.
- `npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/recap.ts --scope sequel,series [--airing] [--owner <id>] [--limit N]`
  — one line per candidate, a table per FRANCHISE (else per owner): stored
  state first (unowned · no ruling / ruled X), then the proposal with its
  signals (`component` — a season ordinal or a declared open-ended I15
  owner; `series` — a different manga, or a non-SEQUEL story relation;
  `ambiguous` — a new subtitle or an unrelated title on the same or an
  unknown manga), then Sean's decision column. Paste it into the message.
  Cap a sitting like a wave (P12): the airing / announced rows first.
- The proposal NEVER writes. Presence in OVERRIDE_CHAINS means nothing; same
  manga is no signal (four ruled I16 splits share one).

- `recap.ts --scope extras` — the related-works table (I45): every recap / special / OVA / film of an owned
  series by franchise, its bucket (a rule decided it), the standing that implies, and the decision column:
  surface by label (N31), research standing + chapters (same-instrument), a series candidate (other-instrument),
  or hold. The ledger rows already exist (sync-related-works, standard heal); a sitting decides surfacing.

## 2. STOP — Sean rules

Each row gets one of: `component of <series>` · `series` (slug, relation
kind → base, franchise) · `extra` · `excluded` (reason) · `deferred` (reason,
revisit condition) · `standalone` (I13 default — no entry needed).

## 3. Write the rulings — maps, never rows

- `component` → an `OVERRIDE_CHAINS` entry (lib/rulings/override-chains.ts,
  keyed by the owner's AFL slug; `ruledExtent` carries the reasoning). An
  announced, undated season joins when it has dates (Kingdom S6 Part 2, Rent-a-
  Girlfriend S6 — the standing practice; an undated member flips the series to
  'upcoming').
- `series` → a `CANDIDATE_ENTRIES` entry in lib/rulings/discovery.ts
  (`anilist:<id>`; slug, relation, franchise, `chain` when the walk must be
  pinned) AND the franchise memberships in lib/rulings/franchises.ts (a new
  franchise needs a base member carrying the title). A relation kind AniList
  cannot express (`remake`) is a lib/rulings/relations.ts entry.
- `extra` → RULED_STRUCTURE (I39) or a watch-order ruling (N7).
- `excluded` / `deferred` → CANDIDATE_ENTRIES with the reason (retiresWhen).
- Log the sitting in `SITTINGS` (an ISO timestamp AFTER the staging run —
  `discovery_new_since_sitting` reads it).
- An owner whose every future part should join whatever its title →
  `OPEN_ENDED_ENTRIES` (a DECLARED I15 property — JoJo, Monogatari, Gintama).

## 4. The dry-run recap IN CHAT — then STOP again

- `npx tsx --env-file=.env.ingest scripts/ingest/seed.ts --dry-run` — one line
  per `series` ruling: `CREATE series <slug> ← anilist N · chain [...] · eps ·
  source · manga · franchise · relation · visibility STAGED · rows next`, or
  `HELD` (an ambiguous walk, a slug clash, a missing membership) — a held
  plan is a ruling question, never a guess.
- `npx tsx --env-file=.env.ingest scripts/ingest/stitch.ts --dry-run` — the
  ruled extensions: the chain, its aired sum vs AFL's count, the components.
- Every line is a change Sean authorises. He has not seen the writer's
  reading (the walked chain, the slug, the manga pick) at ruling time.

## 5. Apply, in order

1. `seed.ts` — the series rows (STAGED, P39), identity, components.
2. `stitch.ts` — the ruled extensions (components; AFL's rows merge).
3. `wiki-episodes-backfill.ts` for each new series / extended series — G59
   path A mints the rows (types default → `type_default_unclassified`).
4. `npm run heal` — assert-overrides (franchises, visibility), relations.ts
   (the AniList edges become series_relations), heal-format, the rest.
5. `npm run census` — `discovery_ruled_unbuilt` → 0, `ruling_violation` 0,
   `series_staged` lists the seeds, `identity_registry_gap` 0,
   `type_default_unclassified` +N (owed typing), every delta explained (P17).
6. `npm run system:census`; edges rebuilt + deployed if lib changed (P3).

## 6. Save point; what comes next

- changelog §12.N (the sitting as a ruling record: what landed, the classes),
  docs/STATE.md written last, commit, push.
- A seeded series enters the research work-list (per-episode TYPE + anchors in
  one ask — the research-batch variant) and stays STAGED until a classifier
  registers (I44 adoption) or a PUBLISHED ruling (lib/rulings/visibility.ts)
  lands. Report what is staged and why.

## Traps

- **An EVENT roster script runs only on its trigger, after you have READ it, with `--dry-run` first where it has one — and a script with no dry-run is never assumed to have one** (INCIDENT-2026-09-05, `P40`): `audit-titles.ts` was run to apply one exclusion and deleted six series through a cascade against a stale fixture index; `afg-expansion.ts` has no dry-run and created a series when the flag was passed. Never run a script for its side effect; find the ruling map its job belongs to.
- **A held plan is never forced.** An ambiguous SEQUEL walk (two sequels) is a
  `chain:` ruling on the entry, decided by Sean.
- **The mint is never a standard heal.** seed.ts and stitch.ts are event
  entries; if a map edit lands before the dry-run recap, the census lists
  `discovery_ruled_unbuilt` until the sitting applies — that is the design.
- **The sitting timestamp must postdate the staging run**, or every candidate
  reads as new again.
