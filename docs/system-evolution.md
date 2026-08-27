# System evolution — planned changes to how we work

Changes to the *working system itself* (docs, skills, agents), as distinct
from changes to the data or the app. Written 2026-08-24, before batch 17's
second pass.

**Trigger point: after batch 17 completes, before batch 18 starts.** Batch 17
must finish on its existing `PROTOCOL.md` — the in-flight recovery references
it, and changing it mid-resume risks the recovery. Its learnings are also what
size the work below.

---

## 1. Split `docs/data-pipeline.md` — DONE 2026-08-26 (T1.1)

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

## 2. Give §10 a third column — DONE 2026-08-26 as the ledger's `auditClass` field (T1.2; `docs/rules.md` scoreboard)

Today it is two columns. With a third, **a rule with an empty audit-class cell
is visibly still costing model attention** — the automation backlog becomes a
column you can scan rather than something someone has to notice.

This operationalises the standing direction of travel (judgment → writer gate
→ audit class) better than any prose, and it feeds `/consolidate` step 10,
which hunts exactly these gaps.

## 3. Build `/add-rule` — the missing skill (T3.1) — DONE 2026-08-26; PROVEN by G53, G54, and after batch 19 wave 1 by A45, G56, A42's class (§12.71-§12.73)

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

## 4. Collapse the four `PROTOCOL.md` files (T3.2) — DONE 2026-08-26 (T4.5): vocabulary lives in research-agent.md; a batch PROTOCOL pins only the task shape (batch 18 standing, batch 19 anchoring)

~88 lines each, largely duplicate, one per batch. Fold into the
`research-batch` skill plus short per-batch delta files.

**The real value is not deduplication — it is that merging them will surface
RULE DRIFT** between batches, where batch 15 and batch 17 encoded the same
rule differently. Reconciling those differences is the point; expect to find
some and to need Sean's ruling on which version stands.

## 5. Rework `/consolidate` and `/consolidate deep` (T3.3) — DONE 2026-08-26 (T3.3/T3.4): steps 0-10 around the mechanical checks; deep triggered by an enforcement-site change (P21); run after wave 1 (§12.70)

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

## 6. Update `research-agent` with batch 17's traps — partly done 2026-08-25; T3.5 finishes (four CHUNK1 traps still uncaptured, DRIFT-LIST §B)

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

**Arc model (Sean, 2026-08-26 — after batch 19, not in it).** Source arcs
(chapter / volume spans) and anime arcs (own names, often different, often
divergent), plus the name mismatches between them, need their own tables and
a design pass — the same class as franchise-above-series IA. Relations
(`series_relations` + franchise-rulings), seasons / OVA / movie slots
(`series_components`, durable since I39) and episode-level divergence
(annotations) are enough until then. The UI already keeps the word "arc"
free for it.

**C7 gap — the parity healer clobbers a just-applied curated continue (batch 19 wave 2 close, Cursor's process nit, 2026-08-27).** `heal-parity-continues.ts` converts ANY stored continue above the row's END that differs from its parity derivation — value, kind AND note — with no check for curation (only the C1 guard, ≤ END, protects a value). C7's statement ("fills only ABSENT metadata; a curated continue is never overwritten") is therefore enforced only by the writers' preservation (syncAnchors / applyContinua), not by the healer, and C7 has no audit class. Witnesses: tokyo-mew-mew 28, eyeshield-21 43, project-arms 43 (apply-wave2's curated notes replaced on the same pass's heal); probably eyeshield-21 42 / 58 and conan 584 from batch 17. The values themselves are the C2 ones and stay. The fix is an `/add-rule`-shaped amendment of C7, Sean's go: a curated marker the healer respects (continue_note carrying the research-tier tag, or a `continue_source` column set by the apply scripts), the healer skipping marked rows (stamping kind only), and an audit class `continue_curated_overwritten` (a marked row whose value ≠ the applied value). Until then: an apply that writes continues must expect the next heal to re-derive them, and the verdict's own note survives only in the apply script.

**Capture from batch 19 wave 2 (2026-08-27).** (a) A **day-of-week audit class** for fixed-slot series is the mechanical form of the "ascending-but-wrong date" trap (SMC 10, shugo 26/88, gx 134 never reached G54): derive each series' modal weekday from its dated rows, list rows off it — an `/add-rule` when a wave produces the next witness, not farmed. (b) **shugo-chara's AFL numbering defect** (73 skipped, 96 printed twice → rows 74-96 are +1; four reversed pairs 75/76, 83/84, 90/91, 107/108 sit in `airdate_regression`) is an N-family renumber (N11 shape) that moves every anchor on those rows — Sean's call, not an air-date edit. (c) **G53 now carries NULL and titles** — the "row-content transposition" class; if a third row field ever needs ruling (a Japanese title, a number), it is the same gate, not a new mechanism. (d) The **C5 "unseen" regime** is for skips the anime never covers; verdicts that deliver chronological-next-unseen values where later coverage is known are converted by the parity healer — the research-agent vocabulary now says so. (e) hells-paradise ep 25 → 94 shows the continua parser's "max of the list" reading a pull-forward SLIVER as the END (AFG's own resume is 90) — if it recurs, the frontier rule wants "the max chapter whose pages are not a parenthesised sliver ahead of the continue" (A12 in lib), a rule candidate with one witness.

**MangaBaka (Sean + Cursor, 2026-08-26 — PEEK ONLY, never a source; do not
ingest).** A library/metadata aggregator over AniList / MAL / MU (CC BY-NC-SA,
schema unstable). Its `anime.start/end` is MU's coverage prose verbatim
(Claymore: "Vol 11, Chap 59 (Original Ending EP 24-26)" — ch 59 right, the
EP 24-26 pin is exactly the filler pin G56 retired); its search ranks
bangai-hen / doujin over the main series; its relations are untyped dumps
(hundreds of parody rows, chronology unknown). Not used for: episode types,
ep↔ch maps, arcs, continue-read, totals or ids (AniList + MangaDex already
cover those). Four IDEAS to weigh at the IA / search pass, not data: (1)
language + official/native title traits for `search_text`; (2) a
`merged_with` / `state: active` identity marker (we have dispositions —
compare, don't add); (3) third-party fields nested under `source.*` (our
staging-vs-canonical split already says this); (4) never ingest an untyped
relation dump — our `series_relations` keep AniList's typed kinds.

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

## Episode-type taxonomy v2 — Sean's reference notes (2026-08-25, rule at the restructuring phase)

Sean's ruling for NOW: X eps 21-24 and detective-school-q 44-45 both classify
**filler** with rich annotations, re-evaluated when the rule lands. His
distinctions to encode later:

- **The "only ending" class (X)**: technically filler (studio-original), but
  the community accepts it BECAUSE no true ending exists (manga on indefinite
  hiatus) and prefers it over the movie's alternative ending. Needs an
  ASTERISK class so every show like this is re-evaluated once data is
  complete. Not canon, not anime-only-canon — filler + annotation + asterisk.
- **The "caught up, padded out" class (DSQ)**: anime outran the manga, studio
  padded a finale — pure filler, no canon standing anywhere; annotate WHY the
  original canon was never animated (surfaced later in UI).
- **The "contested canonical ending" class (Evangelion)**: ALL episodes canon,
  but End of Evangelion is ALSO canon and can replace/follow the last two —
  annotation on those two explaining the controversy. Different from both
  above.
- **The real anime-only-canon (Madoka class)**: the ANIME IS the source —
  story canon with no manga origin. This is what the tag SHOULD mean. Most
  sources say "anime only" meaning FILLER, which is where the confusion
  enters; a possible tag RENAME is on the table for the restructuring phase
  (candidate directions, from a cross-check-only AI reference Sean supplied:
  separate SOURCE ORIGIN from CANONICITY — e.g. anime-original vs
  manga-derived × canon vs non-canon; or intent tags like
  studio-original-ending; two-column source_type + is_canon shape). Decide
  the exact rule + naming at the restructuring phase; NOTHING renamed yet.
- **Canon-source typing beyond manga/anime-original (Sean, 2026-08-25)**: the
  taxonomy must also type the CANON SOURCE when it is neither manga nor
  anime-original — light novel, web novel, game, or any other root form.
  series.source_type already holds manga/original/light_novel; the v2 rule
  should make the canon-source dimension first-class and extensible (the LN
  instrument ruling §10 is the sibling: LN-sourced series get a volume-space
  instrument), so "canon" always answers "canon TO WHAT source".
- Standing sub-rule effective now: ANY debate about a series' final episodes
  gets annotated in the data so the UI can represent it.

## Restructure-phase charter (Sean's directive, 2026-08-25 — logged pre-compact, NOT started)

**The goal, in his framing:** every rule, skill, logic, tool (fresh-data
fetchers included), agent definition, learning, and design/data system gets
updated and applied appropriately — CREATE where missing, IMPROVE or
CONSOLIDATE where overlapping, REMOVE where dead, EXPAND where thin — so
that when a problem or ask arises we ALWAYS know exactly where to refer,
and never overlook an existing rule or learning the way parts of batch 17
did (documented instances: the hellsing/gintama forks re-derived A4/C2
rules that already existed; the first C3 healer run missed a query cap and
mis-stamped C1 straddles until the audit caught it; the eyeshield import
had taken AFG titles without its flags for months unnoticed). The end
state: a clean, repeatable, scalable reference structure — best practice,
where the SEPARATIONS (what lives in §10 vs a skill vs an agent definition
vs a lib gate vs an audit) are effective, efficient, and self-evident.
Success test: a cold session can find the governing rule for any ask in
one hop.

**Source-first typing architecture (extends the taxonomy-v2 notes above):**
- A first-class SOURCE category per series, tied to the series ID: manga,
  light novel, webtoon, manhwa, anime-studio-original — plus candidates to
  consider: web novel, traditional novel, visual novel, game, manhua,
  doujin, original video work. (series.source_type is the seed; make it
  exhaustive and first-class.)
- THEN canon / filler / mixed become relational: they describe how closely
  an episode ties to THE SOURCE's canon — the semantics are already
  implicit in our data and logic; make them explicit.
- The canonical database must ingest any source's info and derive it into
  ONE consistent, readable representation — the same instrument regardless
  of source (the LN volume-space instrument ruling is the existing sibling).
- UI/tag implications to design: the "anime only" tag needs at least a
  rename; consider additional tags; "manga_only" likely becomes something
  like "source only" so the comparison column generalizes beyond manga.

**Process note:** the phase STARTS WITH A PLANNING SESSION (Sean +
strategy: how to segment and sequence the work) — do not begin executing
items before that plan is agreed.
