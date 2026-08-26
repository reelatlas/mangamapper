# /add-rule — a rule lands as gate → edges → audit → heal → ledger, never as prose

The most important repeatable sequence in the project (rule `P31`). A rule
that exists only in a doc or a skill costs model attention on every pass;
a rule with a writer gate and an outcome audit class costs nothing forever
(`P30`, judgment → gate → audit). This skill is how a new predicate — or a
ruling Sean has already made — becomes enforced. Invoke it with the rule's
one-line statement and the evidence; it ends at a committed ruling record.

**Do not use it for a ruling (one series).** A ruling is a `RulingEntry` in
the right map under `scripts/ingest/lib/rulings/` with its reason — no gate
needed, the existing rule's gate reads the map. Use `/add-rule` when the
MECHANISM is new.

## 0. Is it already ruled?

`grep -i '<key phrase>' docs/rules.md` — the alias index is exhaustive. If
a record exists, you are adding an enforcement site or an audit class to
it, not a rule; skip to step 2 and edit the record in step 7.

## 1. State the predicate and its witness

One or two sentences, present tense, universal ("every…", "never…"). Name
the series that proves it (the witness) and the failure that produced it.
If you cannot name a witness, the rule is a hunch — go research first
(`R1`).

## 2. The gate — in `scripts/ingest/lib/`, never at a call site (`P2`)

- A DECLARATIVE ruling map (if the rule needs per-series values) goes in
  `lib/rulings/<name>.ts` as `RulingEntry[]` + the derived lookup.
- The gate reads the lookup inside the shared writer path
  (`filterEpisodeRows`, `syncAnchors`, `applyMuFrontier`, `applyContinua`,
  `applyEpisodeFloor`…) so scripts AND edge functions enforce it identically.
- Fail closed: unknown → refuse + flag, never default.
- Every catalog read through `selectAll` (`P32`).

## 3. Rebuild and deploy ALL FOUR edge functions (`P3`)

`npx tsx scripts/ingest/build-functions.ts`, then deploy refresh-afl /
refresh-afg / refresh-anilist / refresh-mu. `npm run system:census` proves
the bundles carry the current lib-hash (`P4`); it cannot prove they were
deployed — that is your step, do it now, not later.

## 4. The outcome audit class (`P5`)

Add a class to `audit-ui-truth.ts` (or the right census file) that flags
the OUTCOME the rule forbids — stored data the gate should have prevented.
A ruling-map rule extends `ruling_violation` (stored row ≠ the map). Name
the class in the ledger record. A rule with no audit class is visible as
backlog in `docs/rules.md` — do not leave it there on purpose.

## 5. Heal, then triage every refusal

Run the healer that asserts the rule over STANDING rows (an override entered
after a row's last write is stale until asserted — the eyeshield ep-74
lesson, `T6`). New healers join `scripts/ingest/rosters.ts` (`P20`) —
standard if every pass should run it, event if it has a trigger. Every row
the gate now refuses is a triage fork, never an auto-delete (`A6`).

## 6. Explain every census delta (`P17`)

`npm run census` before and after. A class that moved without an
explanation is an unshipped bug. `ruling_violation` MUST be 0 (`P18`).

## 7. The ledger record — last, with everything filled in

Add the record to `scripts/ingest/lib/ledger/<family>.ts`: id (next in the
family), aliases (every name it has been called), statement, why, ruledBy /
ruledOn, `enforcement` (the gate path#symbol, the healer, the audit file),
`layer`, `auditClass`, `witnesses`. Then:

```
npm run system:census        # ledger-check + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash
npm run ledger:docs          # regenerate docs/rules.md + docs/rulings.md
```

Add a one-hop case to `docs/restructure/one-hop-cases.json` if the rule
answers an ask a cold session will face.

## 8. Commit as a ruling record; consider `/consolidate deep`

The commit message states the rule, the id, the witness and the census
delta. If the gate changed an ENFORCEMENT SITE of an existing rule, prior
per-series decisions may be invalid → `/consolidate deep` (`P21`).

## Proof of the skill

Exercises that have run through it — the skill is PROVEN (T3.1, 2026-08-26):

1. **AIR_DATE_OVERRIDES** (`G53`) — 7 ruled rows; audit 7 → heal → 0.
2. **Air-date order gate** (`G54`, A-11) — a pure lib walk shared by the
   write gate, the healer and two audit classes; a ruling map with reasons;
   12 unit tests on the shapes that ruled it; 10 standing dates withheld;
   edges rebuilt and deployed TWICE (the healer exposed a fixed-point
   requirement after the first deploy — a lib change is a redeploy, every
   time). Lessons folded into the steps above: a healer must converge in
   one run (step 5), and the audit class that names what the gate withheld
   should be derived from STAGING so nothing is re-scraped to rule it
   (step 4, `G51`).
