# /consolidate — step 6 of the data cycle (`P1`), systematized

Rewritten 2026-08-26 (restructure T3.3) around the cycle and the mechanical
checks that now exist. The principle is unchanged: rules live in shared lib
code (`P2`); rulings are typed records (`lib/rulings/`); audits verify
OUTCOMES (`P5`); incomplete inputs degrade gracefully (`P6`); nothing
reaches Sean unresearched (`R1`). What changed: most of what used to be
judgment is now a script, and the skill says which.

Two modes:
- **`/consolidate`** — the standard pass: steps 0–8.
- **`/consolidate deep`** — adds step 9 (full-catalog rescan against current
  rules). Deep is REQUIRED — not offered — when step 0 reports that any
  ledger record's ENFORCEMENT SITE changed since the last save point
  (`P21`/`P22`): a gate change plausibly invalidates prior per-series
  decisions. Say so when it triggers.

## 0. Read STATE, run the system census

- Read `docs/STATE.md` FIRST. It is the claim to verify; the conversation
  is not.
- `npm run system:census` — ledger + citations, unpaged selects (`P32`),
  one-hop cases, rosters, rulings index, generated docs fresh, edge
  lib-hash (`P4`). **Red is blocking** during the restructure phase. A red
  here is a broken link in the reference system, not a data problem — fix
  the link (or the record), never work around it.
- Deep trigger: `git diff <last-save-point>..HEAD -- scripts/ingest/lib/`
  touching a file named in any ledger record's `enforcement` = deep.
  READ the diff before declaring deep (2026-09-07): the ruling MAPS under
  `lib/rulings/` are named as enforcement sites too, so a sitting that only
  ADDED ruling entries trips the file-name check — entries are rulings, not a
  gate change (P21 is about gate code invalidating prior decisions). Deep when
  gate CODE moved; standard when only entries did — and say which.

## 1. Writer-consistency sweep — mechanical

- `npx tsx scripts/restructure/unpaged-selects.ts` (already in step 0):
  every catalog read goes through `selectAll`.
- Every writer goes through the shared gates: episodes via
  `filterEpisodeRows` (`N13`/`T6`/`G53`), anchors via `syncAnchors` /
  `applyMuFrontier` / `applyContinua` (`A24`, `G32`, `G22`), totals via
  `applyEpisodeFloor` (`N1`). A NEW writer found without gates is wired
  through the lib, never inline (`P2`). Repairs on derivation-tier rows flip
  the source to manual (`P8`).

## 2. Lib → edges (`P3`)

If step 0's edge-hash line was red or any `scripts/ingest/lib/` file
changed: `npx tsx scripts/ingest/build-functions.ts`, deploy EVERY bundle
(refresh-afl/afg/anilist/mu/discovery — every file under `_src`). The hash proves the bundles are current; the
deploy is your step.

## 3. Staging freshness

Parser changed (`lib/afg.ts`, `lib/wikipedia.ts`, `lib/afl.ts`)? Run the
event healer named in `scripts/ingest/rosters.ts` (`afg-restage.ts` — no
refetch) so staging never holds output a current parse wouldn't produce
(`G44`).

**A cron that reports ok every hour with CONSTANT counters is a rotation stuck
on one batch** (2026-09-07, `G9` amended): refresh-afl logged fetched 20 /
unchanged 17 / flagged 3 / changed 0 every hour for ten days while 306 of 327
active pages sat at 2026-08-22 — an unchanged or held fetch never moved
`fetched_at`, so the same twenty oldest pages led the queue every hour. The run
log cannot show this; read the STAGING's `fetched_at` distribution (`afl_page_stale`
in the census is the outcome check). The same shape can hide in any
oldest-first puller: check `changed_at` vs `fetched_at` by day when a source
"never changes".

## 4. Healers — `npm run heal`

- **An EVENT roster script runs only on its trigger, after you have READ it, with `--dry-run` first where it has one — and a script with no dry-run is never assumed to have one** (INCIDENT-2026-09-05, `P40`): `audit-titles.ts` was run to apply one exclusion and deleted six series through a cascade against a stale fixture index; `afg-expansion.ts` has no dry-run and created a series when the flag was passed. `wiki-episodes-backfill.ts` HAS one since 2026-09-07 (`--dry-run`): its first catalog run refused a wrong +14 lock on re-zero that a live run would have written — use it before every event run. Never run a script for its side effect; find the ruling map its job belongs to.

Runs the HEAL roster's standard entries in order (`P20`): scopes, continua,
coverage (self-healing), volume boundaries, the coverage walk's continues (`C2` amended 2026-09-07 — heal-coverage-continues),
assert-overrides (`T6`/`G53`), watch order, relations, flag cleanup. Event
healers are listed by `npm run heal -- --list`; run one only on its trigger.
If numbering/type rulings changed: re-run `resolveSeries` for the affected
series (stale-zone healing).

## 5. Census — `npm run census`, then triage by rule

`audit-ui-truth.ts` (every class), `verify-series-display.ts --all`,
`audit-afg-structure.ts`. Then:

- **`ruling_violation` MUST be 0** (`P18`) — a writer bypassed a gate or a
  healer has not run; fix the writer, never the data alone.
- `anchor_nonmonotonic` / `anchor_beyond_chapter_space` / `anchor_on_noncanon_row`:
  each hit is a triage fork (`A6`, `A19`/`A20`, `N28`), never left
  unexplained and never auto-deleted.
- `anchor_beyond_display_total`: count-space value in a number-space
  instrument (`N22`/`N23`) — convert, never leave standing.
- `continue_offwalk_healer` MUST be 0 (the coverage healer has not run);
  `continue_offwalk_curated` is Sean's queue — a curated continue the walk
  disagrees with (`C2` amended 2026-09-07), listed with the proposed value.
- Compare every class to the previous census and explain each delta
  (`P17`). A class that moved without an explanation is an unshipped bug.
  **Read every NON-ZERO class, not only the watched ones** (2026-09-04:
  `episode_date_off_window` stood at 1 for three days — fist-of-the-blue-sky's
  end date was the 1984 Fist of the North Star's — because the grep only
  covered the classes a wave was expected to move). A standing non-zero class
  is a finding until it is explained or queued by name.
- Review-queue classes (`special_numbered_unreviewed`, `fractional_unmodeled`,
  `asterisk_unreviewed`, `mu_pin_unverified`) are Sean's: list them,
  RESEARCH each item first (`R1`, `R3`), present verdicts with context.

## 6. Ledger and rulings

- A new RULE → `/add-rule` (`P31`), never a doc paragraph. A new RULING →
  a `RulingEntry` with its reason in the right `lib/rulings/` map (`P29`).
- `npm run ledger:docs` regenerates `docs/rules.md` and `docs/rulings.md`;
  the system census refuses stale generated docs.
- The changelog (`docs/changelog.md`) gets a numbered §12.N entry; a rule
  ratified in an entry MUST also be a record.

## 7. Frontend contract

- Episode-level display reads only the hydrated series (`P37`); incomplete
  data degrades gracefully (`P6`), never NaN.
- `npx tsc -b --noEmit` (`scripts/` is in the graph), `npm run lint`,
  `npm test`, `npm run build` (`P27`). Regenerate
  `src/integrations/supabase/types.ts` after any migration.

## 8. Save point — write STATE last

- `docs/STATE.md`: phase, track/piece, cycle step, last save point, next
  action, what awaits Sean, open sidecars. Memory points here; do not
  restate the position elsewhere.
- Commit whose message reads as the ruling record (rule ids, witnesses,
  census delta); push to main.
- Report the census delta and anything awaiting Sean as explicit open
  decisions.

## 9. Deep rescan (deep mode)

Re-evaluate existing data against CURRENT rules, ahead of drift.

- **After an amendment** (`P38`): the replaced clause is in `retiredPhrases`
  before the commit (ledger-check is the gate — no second grep here), and
  `P23`'s read-list for that rule is the RULINGS MAPS that cite its id (their
  reasons re-read against the amended statement), not a free-form sweep;
  `annotation_contradicts_row` must be 0.
- **Notes are precedence, not blindfolds** (`P23`): rulings, suppressions,
  overrides and "don't touch" notes are scanned and re-checked — no longer
  valid → bring to Sean with evidence; clear-cut under a live rule → apply,
  update the record's reason, REPORT; ambiguous → research, verdict.
- **Stale cleanup** (`P24`): dead constants, rulings pointing at rows that
  no longer exist, orphaned staging, resolved-but-lingering flags. Every
  deletion listed. `retiresWhen` conditions in `docs/rulings.md` are the
  worklist — check each.
- **Permanence tiers** (`P25`, built 2026-08-26): two-level deep. A
  routine deep SKIPS series in `lib/rulings/permanence.ts` (LOCKED —
  Sean-signed); a rule-change deep (step 0 reported an enforcement site
  changed) never skips them. Every writer still runs on locked series;
  `permanence_violation` (a locked series with anything open) is the
  outcome check and MUST be 0. `permanence_candidate` is Sean's signing
  queue — list it, never sign for him.

## 10. Close the loop — capture (`P29`)

For each finding: name its durable home — ledger record + gate + audit
(`/add-rule`), a `RulingEntry`, a research-agent trap, an apply-batch trap,
a skill fix + changelog entry. A rule cited in `docs/rules.md` with an empty
audit-class cell is still costing model attention — say which ones this
pass touched. Report the cycle position plainly: which step is next.
