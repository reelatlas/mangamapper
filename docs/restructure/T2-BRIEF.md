# T2.1 — rulings extraction brief (one agent per group)

Goal: every per-series RULING in the codebase becomes a typed `RulingEntry`
under `scripts/ingest/lib/rulings/`, with its reason, so `docs/rulings.md`
can be generated keyed by series. Read first: `scripts/ingest/lib/rulings/
types.ts` (the record), `docs/restructure-plan.md` §1 (rule vs ruling),
`docs/rules.md` "Family strip" + "Alias index" (to fill `ruleId`), and
`docs/restructure/DRIFT-LIST.md` §A (Sean's rulings: A-5 conan re-check,
A-6 the 27 starts, A-10 one-pace excluded).

## Two kinds of group

**Standing maps** (consumed by live code): the map keeps its EXPORT NAME and
SHAPE so consumers do not change — the file exports `ENTRIES: RulingEntry<…>[]`
AND `export const <OLD_NAME> = toRecord(ENTRIES)` (or `toSet`). The old
declaration site then RE-EXPORTS from the new file
(`export { EPISODE_TYPE_OVERRIDES } from './rulings/episode-types';`) so
every import path keeps working. Behaviour must be byte-identical: the
derived lookup must deep-equal the old literal — assert it in a quick
`npx tsx` check before finishing (import both, JSON.stringify compare, then
delete the old literal).

**Applied rulings** (one-shot maps in batch apply scripts — deletions,
repairs, curated anchors/continues/annotations, boundary seeds, series
updates, held files, zone acks): the script stays as the cited record and is
NOT modified; you write `scripts/ingest/lib/rulings/applied/batch-<N>.ts`
exporting `ENTRIES: RulingEntry[]` — one entry per curated DECISION (a
deletion of noragami ep 12 is one entry; a map of 50 deletions is 50
entries; a CURATED_ANCHORS item is one entry with the anchor as `value`).
`reason` = the inline why, verbatim or lightly trimmed; `cite` = the verdict
JSON path when the map names one; `ruledBy` = 'Sean' where the comment says
so (his rulings are marked "Sean", "SEAN-RULED", "Sean's ruling", a date +
his name), else 'session'; `ruledOn` from the script header/§12 entry.

## Rules

- `ruleId` must be a real ledger id or alias (grep docs/rules.md). Pick the
  rule the instance APPLIES (a type override → T6; a count cap → N3; a
  continua suppression → G26; a deletion of a filler-row anchor → A1/A6…).
- `reason` is REQUIRED and must say WHY, not restate the value. If the
  source has no reason at all, write `reason: 'UNRECORDED — <what the code
  does>'` so the gap is visible in the generated index.
- Series ids are OUR slugs exactly as the source uses them.
- Do not change any gate logic. Do not touch files outside your group. Do not
  commit. `npx tsc -p tsconfig.scripts.json` must be clean when you finish.
- Final message ≤8 lines: files written, entry counts, UNRECORDED count,
  anything you could not place.
