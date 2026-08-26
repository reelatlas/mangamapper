# /apply-batch — verdicts into data (step 5 of the cycle, `P1`)

Research produces claims. This skill is where claims become stored data,
and it is the highest-stakes step in the pipeline: a bad apply writes a
wrong number that renders to users and outlives the session that made it.
Rewritten 2026-08-26 (restructure T3.4) for the typed rulings and the
mechanical gates; the principle is unchanged.

## The curation principle (`P10`)

**The curated map decides, never the agent's field shape.** An agent
proposing `263 → 253` on a filler row is answered with a DELETION, because
`A1` forbids the anchor — not with the repair it asked for. Every curated
decision is a `RulingEntry` with its reason: for the current batch, in the
batch's apply script maps (the reasoning inline IS the record), extracted
to `scripts/ingest/lib/rulings/applied/batch-N.ts` when the batch closes
so `docs/rulings.md` can answer "why was X deleted" in one hop.

Anything an agent proposes that is not in a curated map gets REPORTED, not
applied.

## Sequence

1. **Read `docs/STATE.md`, then the verdicts — do not skim them** (`P15`).
   Mechanically scan each summary against its own rows for contradictions
   (`R25`); the verifier's findings (`R24`) are inputs to curation, not
   optional reading.
2. **Curate.** Approved decisions go in the maps with reasoning. Type
   corrections → `EPISODE_TYPE_OVERRIDES` (`T6`); air dates →
   `AIR_DATE_OVERRIDES` (`G53`); real broadcast-order deviations →
   `AIRDATE_ORDER_ACK` (`G54`); counts → `COMMUNITY_COUNT_OVERRIDES`
   (`N3`); numbering → `SOURCE_NUMBERING_SHIFTS` (`N11`) — all under
   `lib/rulings/`, never a direct row write. Deletions cite `A1`/`A6`;
   curated anchors/continues cite `A24`/`C5`; a repair on a derivation-tier
   row flips the source to manual (`P8`).
3. **Dry run** — `apply-research-batch-N.ts --dry-run`. Read the output as
   a proposal. Every line is a change you are authorising.
4. **Apply.** The script is idempotent and file-driven; re-running as later
   verdicts arrive is expected — UNLESS a verdict was written against a
   pre-renumber numbering: HOLD it (`HELD_FILES`, `P16`) or a re-run
   resurrects rows that no longer exist (the mashle lesson).
5. **Re-resolve** any series whose types or numbering changed, so
   stale-zone healing removes stranded rows.
6. **Healers** — `npm run heal` (the roster, in order: `P20`).
7. **Verify** — `npm run census` (`verify-series-display --all` must show 0
   failing; `audit-ui-truth`).
8. **Explain every census delta** (`P17`). `ruling_violation` MUST be 0
   (`P18`) — a writer bypassed a gate; fix the writer.
9. **Save point** — changelog §12.N entry, `docs/STATE.md` written last,
   commit whose message reads as the ruling record, push.

## When the batch closes

Extract the script's curated maps to `lib/rulings/applied/batch-N.ts`
(one entry per decision, reason verbatim, `ruledBy: 'Sean'` where he
ruled), add it to `lib/rulings/index.ts`, move the script to
`scripts/ingest/history/` (`P34` — never run again), `npm run ledger:docs`,
`npm run system:census`.

## Traps this pipeline has actually hit

- **Repairs on derivation-tier rows get wiped** (`P8`): a repaired value on
  `mu` / `afg` / `afg-continua` is deleted by that source's next re-derive.
  Flip the row to `manual`. Batches 15/16 forgot — 14 rows carry a
  `retiresWhen: 'P8 check…'` in `docs/rulings.md`.
- **Regime maps launder bad data** (`R29`): `REORDER_REGIMES` is a WAIVER of
  the order guard; it once turned a corrupted verdict into a "ruled"
  annotation. List a series only for verdict-documented pervasive reorder,
  and every derived annotation must match a jump the verdict describes.
- **Agents write spans as `episodes: [3, 201]` meaning 3 THROUGH 201** while
  the contract is a LIST. Check the shape.
- **Stale verdict files re-apply on every run** (`P16`): after a
  renumbering, HOLD the files written in the old space.
- **Historical apply scripts revert later rulings** (`P34`): three in
  `history/` would (fotbs span, AoT ep 87, dr-stone row 95). Never run one.
- **A missed edge deploy ships silent drift** (`P3`): any `lib/` change in
  the apply → rebuild + deploy all four; `npm run system:census` proves the
  bundles are current.
- **A repair the verifier refuted is not a repair** (`R24`): the
  saint-seiya "+2 from 50" and the rayearth 14-chapter conclusion were
  refuted before apply; curation reads the verifier first.

## The standing goal (`P30`)

Every rule applied here should end up enforced by a writer gate and
verified by an audit class — `/add-rule` (`P31`) is how. That is the
direction of travel: judgment → gate → audit.

## Next step — offer it, don't assume it

After the save point, report and ASK:

- Did this batch change a RULE's enforcement site (a gate, a lib behaviour)?
  → **`/consolidate deep`** is required (`P21`), not offered.
- Otherwise → **`/consolidate`**.
- Then **capture** (`P29`): name every learning and where it was routed —
  ledger record + gate + audit / research-agent trap / apply-batch trap /
  `RulingEntry` / skill. "Nothing learned" is a legitimate answer.

Anything still awaiting Sean goes in the report as an explicit open
decision, never a silent TODO.
