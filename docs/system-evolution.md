# System evolution — planned changes to how we work

Changes to the *working system itself* (docs, skills, agents), as distinct
from changes to the data or the app. Written 2026-08-24, before batch 17's
second pass.

**Trigger point: after batch 17 completes, before batch 18 starts.** Batch 17
must finish on its existing `PROTOCOL.md` — the in-flight recovery references
it, and changing it mid-resume risks the recovery. Its learnings are also what
size the work below.

---

## 1. Split `docs/data-pipeline.md`

1,479 lines doing four unrelated jobs. §10 is consulted on nearly every
decision while §12 grows monotonically — today reading the rules means paging
past the log.

| new file | content | read pattern |
|---|---|---|
| `docs/architecture.md` | §1–9 sources, identity, franchise structure | rarely |
| `docs/rules.md` | §10 — the 81+ rules | constantly |
| `docs/runbook.md` | §11 — freshness map, operations | when operating |
| `docs/changelog.md` | §12 — numbered log | append-only |

Update CLAUDE.md's pointer table in the same change, or the split makes things
harder to find rather than easier.

## 2. Give §10 a third column: `rule | enforcement site | audit class`

Today it is two columns. With a third, **a rule with an empty audit-class cell
is visibly still costing model attention** — the automation backlog becomes a
column you can scan rather than something someone has to notice.

This operationalises the standing direction of travel (judgment → writer gate
→ audit class) better than any prose, and it feeds `/consolidate` step 10,
which hunts exactly these gaps.

## 3. Build `/add-rule` — the missing skill

The most important repeatable sequence in the project, currently done from
judgment each time. Building the D1 MU-conflation gate followed it exactly:

1. Write the gate in `scripts/ingest/lib/` — never inline at a call site
2. Rebuild and deploy **all four** edge functions (crons must run the same code)
3. Add the **outcome audit class** to `audit-ui-truth.ts`
4. Heal the catalog; triage every row the new gate refuses
5. Explain **every** census delta — an unexplained class move is an unshipped bug
6. Write the §10 row: rule, enforcement site, audit class
7. Commit as a ruling record; consider `/consolidate deep`

It closes the loop: consolidate detects rules with no gate → `/add-rule`
builds it → consolidate deep verifies catalog-wide. That loop currently has a
human-shaped hole in it.

**Open question:** skill vs. part of consolidate. Leaning skill (invoked at a
different moment than a consolidation pass), but decide after D4 goes through
it once.

## 4. Collapse the four `PROTOCOL.md` files

~88 lines each, largely duplicate, one per batch. Fold into the
`research-batch` skill plus short per-batch delta files.

**The real value is not deduplication — it is that merging them will surface
RULE DRIFT** between batches, where batch 15 and batch 17 encoded the same
rule differently. Reconciling those differences is the point; expect to find
some and to need Sean's ruling on which version stands.

## 5. Rework `/consolidate` and `/consolidate deep`

The skill predates the data cycle and shows it. Evaluate after batch 17:

- **Cycle integration.** It does not reference the cycle; step 10 (capture +
  gate-gap detection) was appended rather than designed in. Likely wants
  restructuring around its actual phases rather than a flat 1–10 list.
- **Sharper `deep` trigger.** "When a rule change plausibly invalidates prior
  per-series decisions" is judgment-heavy. With the §10 audit-class column,
  a sharper rule may be derivable — e.g. deep is required whenever a rule's
  enforcement site changed, cheap pass otherwise.
- **Possible split.** The writer-consistency sweep + edge deploy (steps 1–3)
  and the census triage (step 5) are different activities with different
  cadences. They may deserve separate invocations.
- **Healer roster is hardcoded** and has grown every batch. Consider deriving
  it, or at minimum a check that every idempotent healer in `scripts/ingest/`
  appears in the roster — a healer that exists but is never run is worse than
  no healer, because it looks like coverage.
- **Deep mode's permanence tiers** (locked series drop out of routine
  rescans) were designed but never implemented. Either build or drop them.

## 6. Update `research-agent` with batch 17's traps

Every batch has taught 2–4 source traps. They belong in the agent definition,
where every future agent starts knowing them — not in a recovery file that
must be found and read.

## 7. Evaluate after batch 17 — the questions to ask

- **D4**: did the A1 triage confirm the early signal (5 of 5 junk anchors)? If
  so, gate the AFG writers — `/add-rule`'s first real exercise.
- How many §10 rules have **no audit class**? That number sizes the
  automation backlog.
- Did the wave protocol hold? Was 6–8 the right cap? Did any wave lose work?
- Which traps recurred despite being documented — meaning the documentation
  was not reaching the agent that needed it?

## Not planned yet — deliberately

**UI-phase skills.** The homepage/series-card rework will establish design
system, motion and component conventions worth codifying. Designing that skill
now would be guessing at conventions not yet set. Wait until one page is done
and the repeating parts are visible.

## Type taxonomy — target state (Sean, 2026-08-25)

`episodes.type` is a FILTER dimension. Verified current DB state:
- `episodes.type`: exactly the 4 surfaced values — canon / mixed / filler /
  anime-only-canon ("manga only" is a render concept for beyond-anime rows,
  not a stored episode type). Text column; extensible.
- `series.source_type`: manga (256) / original (53) / light_novel (34) —
  the canon-source dimension already exists; manhwa/manhua/etc are just new
  values when they arrive.
- `watch_order_entries.kind` + `series_components.kind`: format labels
  (ova/special/movie/season) exist for non-main entries and components —
  but `watch_order_entries.kind` is under-populated (38 null / 2 special):
  BACKFILL TASK.

Design decision for the UI pass (do not improvise before it): format
(ova / special / movie / recap / tv) is ORTHOGONAL to canon standing — the
rurouni Trust & Betrayal rows are both `canon` AND OVAs; kenichi rows 51-61
likewise. Overloading `episodes.type` with format values would destroy the
canon-standing filter. Plan: a separate per-episode format dimension
(column or first-class annotation kind, chosen at the design pass), with
today's interim being annotations that record the format facts as research
lands (rurouni 95-98 OVA facts are already in the batch-17 verdict). Same
principle series-side: source_type extends by value, never by overloading.

## Pre-batch-18 backlog additions (2026-08-25)

- **Air-date override pass** (Sean's go, deferred by design): 9 known-wrong
  air dates — fist-of-the-north-star ×6 (AFL-inherited; ep 108 carries ep
  112's date), ranma-1-2 ep 153 (1992-09-04 → 1992-07-31; this artifact
  faked an "order deviation"), a-certain-scientific-railgun ep 14 (one day
  off). A bare update is clobbered by the next AFL refresh — build an
  AIR_DATE_OVERRIDES map applied in filterEpisodeRows (the type-override
  pattern), land the 9 entries with citations, add an outcome audit if the
  class grows. Route: the rules/skills/MDs restructuring phase before 18.
- **iruma ep-65 enrichment** (offered by the as-stored agent, held — not
  researched to anchor depth): full record start 141, adapted "146, 141,
  147 (partial — 147 restarts in S4 ep 1)", vol 17. Verify to anchor depth
  in a future narrow pass, then apply.
- **konjikinogash second-source sweep** (from the zatch contested verdict):
  its per-episode table resolves the base verdict's eps 66-68 split and
  adds partials at eps 1/23/55/60/70/79/102/109/114/136 — none re-verified
  yet; a future zatch pass should consume it.

## D2 case registry addition (Sean's find, 2026-08-25)

- **rosario-vampire ep 14** joins prisma-illya as a D2 case (one entry,
  multiple manga numbering spaces): Capu2's opener is mixed via a Season II
  chs 1-4 graft (Kokoa's intro), but our entry's chapter space is the
  Season I manga — an S2-space anchor cannot be written without lying, so
  the row deliberately shows no vol/ch and the batch-12 graft annotation
  holds the fact. Eps 20/24 display normally (their content is S1 chs
  37-39). When D2 (scoped/segmented entries, Clear-Card pattern) is
  designed, rosario's Capu2 grafts get real vol/ch display; until then the
  honest dash stands and annotation surfacing (UI pass) will explain it.
