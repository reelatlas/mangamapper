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

## The recap baseline (Sean 2026-08-28 — a standing process rule)

Whenever a row is named in a recap — a landing, `WAVE*-RECOVERY.md`, THE
DECISIONS, an apply dry-run, the apply recap — every episode is ONE LINE,
stored first, then the delta:

    ep N — stored: {canon|mixed|filler} [+ annotation kinds] → proposed: {same | new type | annotation change | no type change}

The series is the table's TITLE when a table covers one series (no series
column); a table that mixes series carries a `series` column first — either
way a row is never shown without its series (Sean 2026-08-28).

A block of retypes is a TABLE, never a sentence ("12 rows → filler" is not a
recap). Unchanged rows in the ask still show their stored type once — that is
the baseline Sean reads against. Identity/date-only repairs still show the
stored type. GENERATE it: `research/batchN/baseline.ts <verdict.json>` prints
the block from the DB + the verdict (P5 — it cannot drift); paste it into the
recovery record and the decision list, and make every apply script's dry-run
line carry the stored type beside the stored value. A recovery record or a
decision list without it does not ship — **and neither does the CHAT recap
(step 4 of the cycle, the stop for Sean, the post-apply report): the table
goes in the message itself, every changed row, unchanged rows in one summary
line after it. Never point Sean at the file for the baseline.**

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
   row flips the source to manual (`P8`). Curated continue points are
   written ONLY through `lib/continues.ts#writeCuratedContinue` (`C7`,
   2026-08-27): it stamps `continue_source = 'manual'`, which is what stops
   the parity healer from converting the value on the next heal (it did, to
   three just-applied continues, before the marker existed).
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
- **A one-shot migration must be keyed PER ROW, never on a sentinel value** (`N22`, batch 20 wave 2): the saint-seiya −1 migration was guarded on v8's end, so rows applied afterwards in the old space (batch 17's 43-72) were never touched and nothing tripped for two days. Stamp a marker on every migrated row and select on its ABSENCE; prove the outcome with a census class (`anchor_volume_mismatch`: stored volume vs the boundary table's volume for the chapter).
- **File-driven apply + a curated overlay beats hand-copied maps at scale** (117 anchors in wave 2): the verdict JSON is the record set, the overlay (`ANCHOR_OVERRIDE` / `CONTINUE_OVERRIDE` / `*_REJECT` / `*_DROP`) is the ruling — every deviation from the file is a keyed entry with its reason, and the dry run prints "(overlay)" beside each one.
- **Per-episode ruling maps must MERGE entries for the same series** (`toMergedRecord`, 2026-08-27): `toRecord` was last-wins, so a batch-20 golden-kamuy title entry silently lost to batch 19's 45/46 — the tell was the healer's count ("17 ruled rows checked" where 37 were ruled). Read the assert counts as the outcome check after every map edit.
- **A renumber (N11) moves ROWS; anchors and annotations are keyed by number and must be RE-KEYED old → true in the same apply** (shugo-chara: 76 → 74 … ascending so each target is vacated first; the resort itself runs on the AFL write path, so the series is re-fetched + `resolveSeries`'d in the script, and a `resort` span makes `translateEpisodeNumber` refuse bare numbers there).
- **A renumber re-key must sweep EVERY rulings map, `applied/` included** — the wave-3 shugo-chara resort re-keyed G53 and A45 but missed `ZONE_ACKS` (the A7 bounds in `applied/batch-17.ts`); the verifier found it a wave later. Grep `lib/rulings` recursively for the series id and every key in the span before the apply.
- **A same-kind annotation upsert REPLACES the stored fact — no A45 needed** (`upsertAnnotation` keys on series + episode + kind; TMM 38's new partial/rearranged replaced the old ones). An A45 entry for a kind you re-insert would delete the new fact on every heal. A45 is for a kind that must NOT stand any more (shugo 91/92's divergence; 92's title-keyed graft).
- **A cron re-resolve rebuilds rows from AFL alone and can drop a wiki-backfilled row and re-floor the counts** (5D's 145 + 154 → 155, caught by the census's contiguity check): after any apply that inserts rows a source lacks, the ruled path is resolve → wiki backfill → heal, and `translatedMax` keeps the floor honest; row provenance on episodes is the durable fix (queued).
- **A continue on a row whose anchor the same apply deletes lands NOTHING**
  (wave 6, regenesis): `writeCuratedContinue` UPDATEs chapter_anchors by
  (series, episode) and raises no error on a missing row. Place the continue
  on the surviving terminal row — the verifier caught it pre-apply.
- **An A45 retirement can collide with a standing T26 ruling** (wave 5, 2026-08-28):
  the gate refuses the healer's own re-insert (dragon-ball-super 78
  `rearranged`). Right fix: update the STANDING_ANNOTATIONS entry to the
  ruled state; never bypass the gate, never delete the retirement.
- **Canon rows on a `parallel` series must be PINNED in T6** (T30):
  `aflAnimeCanon` is `filler` on a manga-kind series, so an unpinned lifted
  row re-derives to filler on the next resolve. The wave-5 apply pinned all
  11; check the pin whenever a parallel row's type moves.
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
