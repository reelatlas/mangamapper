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
   row flips the source to manual (`P8`). CONTINUES ARE DERIVED (`C2` amended
   2026-09-07, the coverage walk): after the anchors and annotations land, the
   coverage healer derives every continue from the spans
   (`lib/coverage.ts#walkContinue`); the apply writes a curated continue
   ONLY where the verdict carries page-level facts the walk cannot see, and
   only through `lib/continues.ts#writeCuratedContinue` (`C7`) with a kind
   from `hole | open | walk | post_series` and the walk's own note prepended
   — a curated value that merely restates the walk is dead weight, and one
   that disagrees with it lands in `continue_offwalk_curated` for Sean.
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

- **An EVENT roster script runs only on its trigger, after you have READ it, with `--dry-run` first where it has one — and a script with no dry-run is never assumed to have one** (INCIDENT-2026-09-05, `P40`): `audit-titles.ts` was run to apply one exclusion and deleted six series through a cascade against a stale fixture index; `afg-expansion.ts` has no dry-run and created a series when the flag was passed. Never run a script for its side effect; find the ruling map its job belongs to.
- **A confirmed default lands as a T6 PIN, never as a no-op** (batch 24 wave 1, 2026-09-07 — the S3 verifier): `type_default_unclassified` retires only on a T6 pin or an AFL number, and `deriveVisibility` publishes on the pin, so a lane-T verdict's "CONFIRMED AS STORED" entry goes into EPISODE_TYPE_OVERRIDES with the verdict as its reason — that is the class's retirement path for a season AFL never lists.
- **A curated note never leads with a healer prefix** (batch 23 apply + the curated conversion, 2026-09-08): `C7`'s outcome check (`curatedOverwritten`) reads the note's PREFIX — a manual row whose note starts with 'C2 walk (2026-09-07)' (or the old parity shapes) lists as a ruling violation. Lead a curated or converted note with its own marker ('CURATED (…)', 'CONVERTED to the walk (…)') and keep the walk's text behind it; the first conversion run put the walk prefix first and lit 179 violations.
- **The healer owns continues; the apply writes facts** (`C2` amended 2026-09-07 — supersedes the T24-landing line 'a continue equal to the END is derived'): an open END (kind open) IS stored, by the healer, from the span's page split and the next row's START; a value equal to END + 1 is never stored. The apply never restates what the walk derives — dry-run the healer on the series after the anchors land and read its lines as the continue proposal.
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
  the apply → rebuild + deploy every bundle; `npm run system:census` proves the
  bundles are current.
- **Deploy edges OFF the cron minutes** (2026-09-07): the §12.155 deploy landed at :40, the hourly refresh-afl's minute, and killed that invocation mid-run (run_stuck; heal-stuck-runs marks it). Check `supabase/migrations/*refresh_cron*` for the schedule and deploy between runs.
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

- **A chapter range inside note text is not a page count** (A47's first census run, wave 8): kimi-ni-todoke's `46 — 44-45 skipped` and detective-conan's `638 (opening of the 638-640 …)` parsed as 2- and 3-page tails. The sliver parsers (`lib/sliver.ts`) count a range as pages only behind a page marker; read every new listing class's first run for false positives BEFORE reporting the backlog.
- **The END-side normalizer runs in the apply (A47)**: curated anchors go through `sliverEnd` with the next anchored row's START, and the dry run prints "(A47 normalized from N)" beside each move — a delivered END the gate moves is the ruling doing its job, not a defect in the verdict; name the tail on the row as a `partial`.
- **Row-less landings are legal by ruling (A42, wave 8)**: an anchor on a row AFL has not staged (orient's EMPTY page, one-piece-log 7-21) lands and is listed under `anchor_without_row`; the display synthesizes the row. Never mint the row from research in the apply — a row lineage is a G57 decision.

- **A row-less entry interpolates between its anchors** (wave 9, cells-at-work-code-black): landing a finale anchor plus one frontier anchor on an entry with ZERO episode rows rendered a false back-jump (`verify-series-display` FAIL: "ep 10 starts ch 10 below ep 9's 17") because the synthesized rows in between were interpolated across a reorder. On a row-less entry land the whole verified map with `rearranged` on the jump row, or nothing — never two anchors across a reorder.
- **A continue on a row whose anchor the same apply deletes lands NOTHING — move it** (`CONTINUE_MOVE`, wave 9 erased: the verdict placed the continue on ep 12, whose mu anchor was deleted under A1; the overlay moved it to the surviving terminal row 11). Read every deletion against every continue before the dry run.
- **A back-jump anchor's continue is the walk's** (shippuden 112, 2026-09-03; superseded 2026-09-07 by `C2` amended): land the anchor + `rearranged` and let heal-coverage-continues derive the continue (the first chapter not finished so far, the already-adapted stretch named in the generated note); a curated continue is for page-level facts only.
- **A retyped position-less row past the last anchor needs its A44 entry in the same apply** (erased ep 12 → mixed): `frontier_tail_null` lists a canon/mixed row past the terminal that renders null; the ruling that makes it honest is `ANCHOR_SUPPRESSED` (A44), not an anchor.

- **Derive every anchor's VOLUME from the boundary table in the apply** (waves 10-11): agents copy the START's volume or a neighbour's; the derivation caught four wrong volumes on FotNS and two on kingdom. Print "(volume derived: agent said vN)" beside each move.
- **Merge a block's sub-block files into one episode-sorted list per series before A47** (waves 10-11): the normalizer needs the NEXT anchored row's START across seams, and a fence-row repair delivered by one sub-block must ride as an overlay on the stored manual row, never as a second anchor write.

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
- **A47's hold needs evidence of size — unproven tails ADVANCE** (Dai wave 13, Sean 2026-09-02): `sliverEnd` holds only on a page-marked count ≤ 5 or teaser wording; a verdict that held an END on 'the opening of X' with no count is curated with an `END_OVERRIDE` to X plus the `partial{X (opening)}` tie (dai 23 / 25 / 28 / 29). The reverse — a verdict that advanced on a proven ≤5-page tail — is what the normalizer catches.
- **A source numbering shift is converted AT WRITE, never stored and fixed later** (Dai 349 → printed 348, wave 13): verdicts delivered in a list space land through the ruled `sourceShifts` (chapter / start / continue / every chapter number inside chapters_adapted and annotation strings), the stored volume table and any source pin are re-based FIRST so the volume derivation reads the ruled space, the note records `list N → printed M`, and the one record the shift cannot express (a slot the printed space does not number — the 番外編 at list 122) is rewritten as a `side_story` annotation, never a number. Then the healers must converge: a healer that re-clamped on every run (latest_known 349 → 348) meant an upstream writer was not reading the ruled space — fix the writer (`bestLatestKnown`), never the data.
- **A single source's straddle mark does not advance an END** (dai wave 14, Sean 2026-09-03 — the existence clause on A47): when two verifiers find the fandom alone crediting a trailing share, curate `END_OVERRIDE` back to the two-source chapter and stamp the `partial` single-source via a note suffix; the continue is unchanged. Two sub-blocks of one wave called the identical shape both ways — reconcile the fork ACROSS files before Sean sees it, as one decision.
- **A prior wave's fence rows can arrive as repairs from several sub-blocks at once** — reconcile by field across files (a python pass over `repairs[]`) before curating; the 59 START fork (A/E 214 vs B/C/D/F 213) was visible only that way.
- **Weights decide, not sizes** (T28's sliver clause, Sean 2026-09-04): a verdict's segment notes carry `weight: significant | sliver`; an anchor lands only on a `significant` segment (or an `unverified` one, which lands WITH its `unverified` annotation so the queue class lists it). A sliver-only row is position-less — no anchor, the remainder decides the type — and the census class `sliver_only_anchor` lists standing rows that still carry one (a significance call, never an auto-delete). `recap{…}` replaces the old habit of filing recap episodes as `abridged`.
- **A verdict's COMPARISON clause must never be transcribed as the row's own fact** (batch 22 wave 2, fma 37 — the transposition entered at the batch-18 apply `8f94d90`, not in research): the verdict said ep 37 adapts the Observation Diary + the Second Lieutenant and *compared* it to ep 13's Dog / Festival; the hand-written standing note carried ep 13's extras as ep 37's, and the next sitting copied the note into a new record labelled 'verified R24'. When curating an annotation note from a verdict, transcribe the row's OWN segments; a 'like ep N' / 'the same basis as' clause is a cross-reference, not content — and a record copied from a note inherits the note's provenance, not the verdict's.
- **A retype that supersedes a Sean-confirmed pin UPDATES the pin, never lifts it** (beelzebub 49 → mixed): an unpinned row on a loose AFL bucket takes AFL's label on the next resolve and re-enters `type_source_disagreement`. The verdict said 'or be lifted'; the flag said update — the flag was right.
- **On a parallel series (I40) a retype lands WITH its correspondence rows and a T6 / T30 pin** (dbs 6, 2026-09-05): `aflAnimeCanon` is filler on a manga-kind series and the T26 gate's only parallel-series tie is the correspondence row — a canon row with neither re-derives to filler on the next resolve. And the A46 arc note is healer-asserted: a clause like 'ep 6 is film-only' must be edited in the same apply or it re-asserts the refuted claim every pass.
- **A47 normalization needs the TRUE next episode** (batch 21 wave 1): a file-driven apply that walks a NON-CONTIGUOUS verdict must not compare an END with the next ROW's START — one-piece 195 was moved against ep 203. Use the delivered row for episode + 1 if present, else the stored anchor for episode + 1, else no next (the tail stands, C1).
- **A renumber (N11) re-keys LEDGER POSITIONS too** (E2, 2026-09-05): `watch_order_entries.position`, every `RelatedWorkRuling.position` and `RULED_POSITION_BY_ANILIST` value are keyed by episode number exactly like anchors and annotations — the re-key sweep includes them (old → true, ascending). `related_work_base_missing` catches only a DELETED base; a renumbered base keeps a row at that number and silently repoints the ruling, which only the sweep prevents.
- **A ruling on a WIKI-origin (adopted) row lands through the adopted-row path** (wave 6, BSD Walking Alone — the first such verdict; a ruling had landed nowhere and no class said so): the ledger writer applies the ruled FACTS (standing, chapters, note, repairs) and never the position (the fractional's position is its own ruling — a ruled position there is refused and listed); `related_work_unruled` lists adopted rows with no standing.
- **A cluster is ONE package** (wave 6, the DBZ 288.5x: Yo! 288.5 / BoG re-seated 288.51 / RoF 288.52): rule every seat in the same map edit, re-seat a ruled sibling IN PLACE — `planRuledMoves` refuses a half-applied cluster silently. The `--entries` proposer prints a cluster seat unconditionally (it now marks it); read the owner's other rows.
- **Edit an existing entry in place, never replace it** (wave 6, DanMachi 21660): the map throws on a duplicate key, and a pasted proposal would drop the fields the earlier ruling carried (the cluster position). A ruling whose (series, anilist id) no longer matches a row is `related_work_ruling_orphan` (P24) — retire it or restore the row.
- **On a PARALLEL owner, canon with no chapters is a ruling shape, not a defect** (wave 6, DBS Resurrection 'F'): the standing is from the outline (T30); the entry carries chapter null and a "no correspondence" string when the manga skipped the arc; the validator warns instead of refusing on a parallel series.
- **A recap flag on a canon row is the Gintama shape** (wave 6, Fruits Basket -prelude-): the clip show goes in the chapters string, `recap` false on the row — never a note opening "recap;".

