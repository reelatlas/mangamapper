# T1.2 — ledger drafting brief (one agent per family)

You draft the rule records for ONE family of the mangaMapper rules ledger.
You write exactly one file: `scripts/ingest/lib/ledger/<family-lower>.ts`
(e.g. `a.ts`), exporting `export const RULES: Rule[] = [...]` typed against
`scripts/ingest/lib/ledger/types.ts`. Read that file first — it is the
contract. Then read `docs/restructure-plan.md` §1–§2 and
`docs/restructure/DRIFT-LIST.md` §A (Sean's rulings — they are binding on
wording) and §B (stale text — the LOSERS must not become rules).

## Inputs

- `docs/restructure/inventory.json` — 1,142 extracted entries. Filter to
  `kind` in (rule, audit-class, process, architecture) and to your family by
  `family_candidate` AND by subject (the candidate letters were guesses —
  read statements, not just the letter; a rule filed under the wrong
  letter is still yours if its subject is yours, and note which entries you
  claimed from other letters in your final message so the merge can
  reconcile). `docs/restructure/inventory.md` §A shows the multi-home groups.
- `docs/data-pipeline.md` §10/§11 for exact wording when the extract is
  terse.

## The grain — the one thing that must be right

**One record = what a verdict, a gate or an audit would CITE.** Split
bundles (`bundle: true` entries list their parts) into separate records
when the parts are separately citable (the MU-frontier row is five gates →
five records under one `see` cluster; C3's row restates A4 → cite A4, don't
restate). Do NOT split what is one predicate stated with an example. Over-
split and the ledger is unreadable; under-split and A4 lives inside a C3
cell again. Expect your family to land at roughly: A 30–40 · C 5–8 · T 8–14
· N 15–25 · I 20–30 · S 25–40 · V 6–10 · R 15–25 · P 15–25.

## Ids

- Existing letter ids KEEP their numbers: A1 (filler/anime-only rows never
  carry anchors), A2/A3 (rearranged-zone rules, batch 15), A4 (coverage =
  furthest adapted; finale = honest record), C1 (mid-chapter straddle), C2
  (anime parity), C3 (skip notes), C4 (single-source-final — text unknown;
  record it `status: 'live'` with the best statement you can find, or
  'superseded' if you cannot, and say so). D1 (the MU gate stack) is
  re-homed into S with `aliases: ['D1']`; D4 (A1 gate at the AFG writers)
  into A with `aliases: ['D4']`. Note the collisions the merge found: "D1"
  also named kamisama ep-10 and "A1" also named a batch-15 encoding question
  — those are NOT the rule; ignore them.
- New ids: next integers in your family, in the order you list them. Use
  gaps freely (A5.. after A4; C5.. after C4).
- `aliases` = every name the corpus uses for the rule ('sliver rule', 'GTO
  lesson', 'Tokyo Ghoul 144/143 rule', 'Ryuusui lesson', 'hikaru ep-75
  wipe', hard invariant numbers as 'invariant 6'…). Aliases are how old
  citations keep resolving — be generous and exact.

## Fields

- `statement`: the predicate, present tense, no history. Sean's rulings in
  DRIFT-LIST §A override any older wording (A-1 b17 continue point; A-2 END
  = running order AND coverage = max as TWO records; A-3 monotonicity by
  tier as TWO records; A-5 rehash = filler…).
- `why`: the lesson in one line (series + failure). Keep it.
- `ruledBy` / `ruledOn` / `origin` from the extract (`ruled_by`, `ruled_on`,
  `where`). Unknown date → the earliest date the extract gives; never
  invent.
- `enforcement`: real paths and symbols from the extract's
  `enforcement_site` (format `path#symbol`). A rule with no code enforcement
  gets `layer: 'process'` and an enforcement pointing at the skill/agent
  file. A display rule points at `src/lib/mapping.ts` / `src/data/catalog/
  assemble.ts` with `layer: 'display'`.
- `auditClass`: ONLY classes that exist (the `audits` extract lists all 64;
  names like `anchor_on_noncanon_row`, `ruling_violation`,
  `boundaries_degenerate`, `continue_skip_unnoted`). Leave empty when none —
  an empty cell is the automation backlog, which is the point.
- `witnesses`: series ids / test names the corpus actually names.
- `status`: 'live' unless the extract's status_hint says planned-not-built
  ('planned') or the rule was superseded (record the successor's id in
  `supersededBy`; keep the record so old citations resolve). DRIFT-LIST §B
  losers are NOT records — they are deleted text; but a superseded RULE
  (end+1 continue default → C2) is a 'superseded' record.
- `see`: related ids inside or across families (cross-family ids you cannot
  know yet: write the alias string, e.g. 'A4', 'sliver rule' — the merge
  resolves).

## Do not

- Do not write rulings (per-series instances) — those are T2.1 maps.
- Do not write architecture facts or traps as rules. Architecture →
  skip (T1.1 handles `architecture.md`); traps → skip (they go to the
  agent/skill definitions).
- Do not invent enforcement sites, audit classes, dates or witnesses.
- Do not touch any other file. Do not commit.

## Output

The TS file, then a final message ≤10 lines: record count, ids assigned,
bundles you split, entries you claimed from other family letters, anything
you could not place. Run `npx tsc -p tsconfig.scripts.json` before
finishing — the file must typecheck.
