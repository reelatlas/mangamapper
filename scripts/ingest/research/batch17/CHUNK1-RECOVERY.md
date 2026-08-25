# Batch 17 second pass — CHUNK 1 INTERRUPTED (2026-08-24)

**Why this file exists**: chunk 1 launched 19 research agents; a monthly
model spend limit killed 17 of them mid-flight. This is the recovery record —
what survived, what must be redone, and the leads/dead-ends the dead agents
had already established so tomorrow's run doesn't re-pay for them.

Limit hit 2026-08-24, resets 2026-08-25.

---

## 1. STATE — nothing is half-applied

- **Database: UNTOUCHED.** No apply script ran. Verified after the failures:
  7085 anchors, 66 MU pins — exactly the post-D1-gate state from §12.43.
  Agents were read-only by instruction and stayed that way.
- **Repo: clean through commit `07ed513`** (all D1 work pushed). The only
  changes this chunk produced are the 6 verdict files below + the
  `context.ts` target additions, committed alongside this file.
- **No cleanup, rollback, or repair is needed before resuming.** Chunk 1
  simply has 6 of its 19 deliverables done.

## 2. WHAT SURVIVED — 6 verdict files (KEEP, do not re-research)

| file | contents |
|---|---|
| `out/hellsing.json` | 7 anchors (eps 1/2/3/5/6/7 → chs 1, 3, 4-6, 7, 8-10, 11-12; ep 10 → ch 2 rearranged flashback), 2 type corrections (eps 7, 10 canon→mixed), 3 continue points, 7 annotations, 3 flags |
| `out2/gintama-holes.json` | 3 anchors closing the last reorder holes: ep 111 → L172 (v20), ep 120 → L187 (v22), ep 227 → 360 (v41, Sket Dance crossover special), 4 flags |
| `out2/hunter-x-hunter-a1.json` | A1: eps 2, 18 — both **junk anchors** (genuine filler bodies with 2-3 page grafts; Hunterpedia + AFL agree) |
| `out/cardcaptor-sakura.json` | A1: ep 7 — **junk anchor** (the D4 working assumption was WRONG; not a mistyped row) |
| `out/inuyasha.json` | A1: ep 79 — **junk anchor** (wholly anime-original Jaken comedy) |
| `out/slam-dunk.json` | A1: ep 92 — **junk anchor** (pure anime-original beachside comedy) |

All six are valid JSON with complete verdicts and citations.

**Verification debt — read before applying**: the four A1 files came from an
agent that *died before delivering its final summary*. Its verdicts look
complete, but they never got the agent's own closing self-check. Give them
the standard mechanical review (end-vs-chapters contradiction scan, DB
spot-check) plus one extra look before curating them into the apply maps.

**Two flags worth ruling on when applying**:
- hellsing: the agent asks where the frontier belongs — ep 7 (last
  mainline-advancing episode) vs ep 10 (last canon/mixed row, END=2 via a
  rearranged flashback). Its recommendation: frontier logic should take the
  max over anchor ENDs.
- gintama ep 227: anchored at the crossover special's tankobon slot (v41,
  floored into ruled Lesson space) — this creates a duplicate 360 position
  with ep 236, which the agent flagged with an annotation-only fallback.

## 3. EARLY D4 SIGNAL (small sample, but one-directional)

Five A1 hits are now adjudicated: **5 of 5 came back "junk anchor", zero
mistyped rows** — including cardcaptor ep 7, the case D4's write-up had
singled out as the likeliest mistyped row. If the remaining 43 hits keep
this ratio, the answer to D4 leans toward gating the AFG writers rather
than leaving it audit-only. Do NOT decide on 5 of 49; note it and re-read
after the rest land.

## 4. WHAT MUST BE REDONE — 16 tasks

Nothing partial was saved from these; each needs a fresh agent. Prompts are
in the session transcript, but they are reconstructable from
`PROTOCOL.md` + `context.ts` + the notes below.

**12 gap-series tasks**: kinnikuman, eyeshield-21, zatch-bell,
bobobo-bo-bo-bobo, sket-dance, saint-seiya-knights-of-the-zodiac,
project-arms, d-gray-man, angel-heart, fist-of-the-north-star (its task
also carries the A1 ep-109 item), hayate-the-combat-butler, trigun.

**3 A1-triage tasks (43 of the 49 hits still open)**: one-piece (19 hits) ·
dragon-ball-z (7) + dragon-ball-z-kai (2) + ranma-1-2 (6) · black-clover (3)
+ fairy-tail (2) + the-promised-neverland (1) + mashle (1) + noragami (1) +
a-certain-scientific-railgun (1).

**1 narrow task**: rurouni-kenshin — rows 95-98 (Trust & Betrayal OVAs) +
eps 63-70 type verification.

## 5. LEADS AND DEAD ENDS THE DEAD AGENTS ESTABLISHED

Carry these into the replacement prompts — they are paid-for knowledge.

**Source traps (these cost real time to discover):**
- **eyeshield-21**: Wikipedia's chapter list mixes plain-string English
  titles (e.g. "Sky Dragon") among nihongo templates — a naive parse
  *shifts chapter numbering*. Parse line-wise.
- **saint-seiya**: episode-table row colors are ARC GROUPINGS, not filler
  flags. Do not read them as canon/filler.
- **gintama (already applied above)**: two-part episodes carry TWO Episode
  Box infoboxes; reading only the first misses the adapted Lesson entirely.
  This is the failure that created holes 111/120 — assume it generalizes to
  any two-part episode on a fandom wiki.
- **angel-heart**: the obvious fandom page is a *different character's* —
  dead end, go to ja sources.
- **d-gray-man**: ja.wikipedia has no manga columns (episode order/titles
  only) — useless for mapping; needs AFL/AFG + community statements on the
  Hallow boundaries.
- **kinnikuman**: only ~20 match pages exist on the wiki; the open question
  was whether "Chapter N" pages carry anime-episode fields.

**Good sources found:**
- **project-arms**: Kinokuniya carries the publisher's full per-volume TOC
  for all 22 volumes — the mapping spine for a thin-fandom series.
- **trigun**: the fandom episode infobox has a `|manga =` field.
- **dbz / dbz-kai / ranma**: all six checked fandom pages align with AFL
  numbering and Kanzenshuu chapters — numbering identity confirmed; the
  remaining step was the reverse cross-check via fandom *chapter* pages
  (note: the DBZ ep-39 page is missing).
- **one-piece**: wiki data is rich, and several rows typed `filler`
  **do** carry sliver adaptations — expect `mixed` verdicts here, unlike
  the 5-for-5 junk-anchor pattern elsewhere. Some infobox field regexes
  failed and need raw block extraction.
- **slam-dunk**: its AFL slug is `slam-dunk-0`.
- **hunter-x-hunter (1999)**: AFL lists pure filler as eps 2, 7, 18-20.

**Nearly-finished work (fastest wins tomorrow):**
- **rurouni-kenshin**: all four T&B seams were already scene-locked against
  the Act synopses; it needed only an Act 165/166 synopsis check plus
  external corroboration (Wikipedia EN/JA, AFL, AFG).
- **fist-of-the-north-star**: skeleton nearly complete; wanted one more
  independent probe (Finn Clark's part-4 review) to corroborate filler
  status of eps 83/84/86 and the recap finale.
- **sket-dance**: established that ch 127's B-segments split across eps
  40 and 56; the finale, OVA, and crossover pages were still open.
- **bobobo**: the finale question is live — fandom says "last adapted 177,
  start at 178", a Yahoo Chiebukuro answer says the anime went "up to okugi
  178". Needs the tiebreak.
- **zatch-bell**: v18-v22 chapter titles correlate cleanly with the season-3
  summaries; the ep-123 / ch-191 question was still open.
- **hayate**: needed the Wikipedia chapter list (independent titles) plus
  full synopses of eps 10 and 52.

**Raw scratchpad notes** from all 19 agents (~17MB of fetched source text)
are at
`/private/tmp/claude-501/-Users-sean-Projects-mangamapper/bf3d330e-e4f1-443d-9541-af4a3fd2d3ad/scratchpad/agents/<task>/`
— they survive until the machine reboots, and the session's task transcripts
sit one level up in `tasks/`. Salvage is OPTIONAL: re-fetching is cheap and
the protocol requires fresh verification anyway. The notes above are the
part that was actually expensive to learn.

## 6. RESUME PROCEDURE (2026-08-25)

1. Regenerate contexts (the old scratchpad path is session-specific):
   `npx tsx --env-file=.env.ingest scripts/ingest/research/batch17/context.ts <new-scratchpad>/ctx`
   — 55 targets, hellsing + trigun already in the TARGETS table.
2. Launch the 16 tasks from §4. Consider a smaller concurrent fleet
   (~6-8 at a time) so a limit event can never cost 17 agents again.
3. Then the unchanged closing sequence: review discipline (mechanical
   contradiction scan + DB spot-checks) → curate the apply maps → merge
   `out2/gintama-holes.json` and `out2/hunter-x-hunter-a1.json` into their
   existing `out/` verdicts → dry-run → apply → re-resolve retyped series →
   parity healer → verify → census with delta explanations → docs + memory
   → commit + push. That is the chunk-1 save point.
4. Chunk 2 (detective-conan + 9 lighter targets) is unchanged and still
   waits behind Sean's usage check.

---

## 7. WAVE 1 LANDED (2026-08-24, resumed session) — 8 of the 16 tasks done

All 8 agents completed; 15 new verdict files, every one parsed + mechanically
scanned (series_id present, no dupes, A1-consistent with own type
corrections, END monotonicity checked):

| task | files | headline |
|---|---|---|
| rurouni T&B | `out2/rurouni-kenshin-tb.json` | eps 95-98 → Acts 165-179; 4 stale side_story annotations to DELETE; eps 63-70 confirmed filler, no change; AFG shifts by one from row 95 (95-ep vs our 100-row count) |
| fist-of-north-star | `out/fist-of-the-north-star.json` | 42 anchors 58-108; A1 ep109 = junk (terminal moved to ep108→136); 8 eps retyped; structure eps1-109=ch1-136 |
| sket-dance | `out/sket-dance.json` | 75 anchors; NON-LINEAR adaptation ruling (END non-monotonic by design); eps 26/32 retype→canon with anchors pre-staged in notes; ep77 repair 200→167 |
| bobobo | `out/bobobo-bo-bo-bobo.json` | 74 anchors; finale tiebreak RESOLVED for 178 (stored ep76→178 correct, no repair); no per-episode map exists anywhere — cross-derivation method documented |
| zatch-bell | `out/zatch-bell.json` | 105 anchors ch1-211; flag #942 resolved (ep138→211, cont 212); ch191=ep127 settled; 10-ep contested-typing block for Sean |
| A1 one-piece | `out2/one-piece-a1.json` | 18 junk + ep737 retype; AFG chapter column proven to be a reading-position conversion (plateaus on noncanon rows) |
| A1 dbz/kai/ranma | `out2/dragon-ball-z-a1.json`, `out2/dragon-ball-z-kai-a1.json`, `out2/ranma-1-2-a1.json` | 14 junk + dbz ep100 retype→mixed; RANMA: AFG table is PRODUCTION-ORDER — ~37 eps of stored anchors slid onto neighbours (needs verifier + series re-anchor) |
| A1 misc | `out2/{black-clover,fairy-tail,the-promised-neverland,mashle-magic-and-muscles,noragami,a-certain-scientific-railgun}-a1.json` | 7 junk + fairy-tail ep256 & tpn ep23 retype→mixed; railgun batch-12 claim factually false; MASHLE off-by-one (recap stored as ep7 → AFG anchors eps 8-12 one row early) |

**A1 / D4 IS NOW FULLY ADJUDICATED: 49/49 hits — 45 junk anchors, 4 mistyped
rows** (dbz 100, fairy-tail 256, tpn 23, one-piece 737). Evidence strongly
favors extending the A1 gate to the AFG writers (D1-style), with retype as a
research-tier action. Sean rules.

**Pre-checks already run against the DB** (lossless-deletion conditions):
black-clover ep129 holds ch228 ✓; railgun ep12 holds ch16 ✓; noragami ep10
has NO anchor → nulling ep12 requires a new ep10 anchor END 12 (evidence in
the noragami verdict's flags).

**New source traps this wave (route to research-agent definition at capture):**
- AFG tables can be in PRODUCTION order (ranma) — never index-join against
  aired-order rows; verify episode identity per row.
- AFG's chapter column is a reading-position conversion, not an adaptation
  claim — it plateaus on noncanon rows (one-piece duplicates prove it).
- onepiece.fandom ARC pages carry inline `{{Qref|chap|page|ep}}` page-level
  citations — better than episode infoboxes, which are inconsistently filled.
- hokuto.fandom has no per-episode pages; character-page `appearances`
  fields are the usable reverse index.
- AFL tables can be TRUNCATED (sket-dance stops at ep 54) — untyped tail
  defaults are not typing claims.
- sket-dance en-WP chapter list: English cells unreliable (empty/shifted);
  parse the Japanese cells.
- Row-count identity first: mashle rows count the recap as ep 7 (wiki calls
  it 6.5) → every AFG anchor eps 8-12 is one row early; rurouni AFG counts
  95 eps vs our 100 rows (shift from row 95).

**Verifier candidates (weight-bearing, run before apply):** ranma
production-order claim; sket-dance non-linear structure ruling; mashle
off-by-one; railgun batch-12-falsity claim.

## 8. REMAINING — wave 2 (8 tasks)

kinnikuman, eyeshield-21, saint-seiya-knights-of-the-zodiac, project-arms,
d-gray-man, angel-heart, hayate-the-combat-butler, trigun. Traps for these
are in §5 above. Contexts regenerated 2026-08-24 in the session scratchpad
(`ctx17/`); regenerate again if resuming in a new session.

## 9. SEAN'S RULING — mashle recap (2026-08-25)

In-between entries (specials/OVAs/recaps/movies) belong at FRACTIONAL
positions (6.5-style, the Crunchyroll/community convention), never absorbed
as integer rows — with the right flags/tags/annotations. This is the
existing §10 architecture (watch_order_entries + ingest_fractionals
disposition + SOURCE_NUMBERING_SHIFTS), applied.

Mashle apply plan (supersedes the verdict's shift-the-anchors reading):
1. Integer row 7 (recap) → watch_order_entries position 6.5,
   disposition excluded_recap, reasoning in note.
2. Rows 8-25 renumber to 7-24 THROUGH THE SHARED LIB (resolveSeries with
   the shift declared), never a hand UPDATE.
3. Stored AFG anchors become correct IN PLACE after renumbering (they were
   authored in the 6.5 convention) — zero anchor edits needed; verify by
   spot-check after re-resolve.
4. AFL numbers the recap as integer 7 → SOURCE_NUMBERING_SHIFTS entry for
   mashle so AFL-derived typing translates (and note the mashle verdict's
   trap flag needs rewording: AFL matches the OLD numbering, so post-fix
   it is AFL that shifts, not fandom/Wikipedia/AFG).
5. Season components: S1=1-12, S2=13-24, S3=25+.
6. Generalisation for §10 at capture: when OUR rows have absorbed an
   in-between entry that the community convention holds fractional,
   renumber to the convention — never keep the absorption.

## 10. VERIFY PASS RESULTS (2026-08-25) — 4 verifiers, all landed

| claim | verdict | what changed |
|---|---|---|
| mashle off-by-one | CONFIRMED (4/4) | repair-shape caveat: ep-7 repair formally nulls only end_chapter — expand to full null at curation. Superseded anyway by Sean's §9 fractional ruling. |
| sket-dance non-linear | CONFIRMED (5/5) | zero drift between summary and rows; ep-77 repair exact. Open: Sean's monotonicity modelling ruling. |
| railgun batch-12 falsity | CONFIRMED (4/4) | failure mode = "as-stored" confirmation-laundering (blessing an inherited pin with an invented rationale). Batch-12's researched railgun anchors are clean 3/3. NEW QUEUE: 7 other as-stored rows (iruma-kun 63-64; rosario-vampire 3,5,7,8,11). Cleanup: ep-12 continue-point note still repeats the refuted graft claim. |
| ranma production-order | PARTIALLY CONFIRMED | six nulls all stand independently (wiki manga=None + AFL + anime-only categories). Mechanism amended: AFG's row order is INCONSISTENT — production order in zones 88-90/121-135/154-156, aired order in 15-30 where OUR rows deviate (AFL numbering, non-monotonic air dates); ep 14 was correct-row-wrong-source. The verdict's proposed fix (key on wiki AIRED number) would CORRUPT eps 15-30 and 153 — join on normalized TITLE only. Verified live damage beyond the six: eps 15/89/122/155 carry wrong canon anchors NOW; eps 88/126 anchorless; ep 15's C2 parity continue point was reasoned on the bad anchor and must be reopened; ep 18 is accidentally correct (two cancelling errors) — a naive re-index would break it. |

**Amended source trap (replaces the wave-1 wording):** AFG's row order is
inconsistent — production order in some zones, aired in others — and OUR
rows are not always aired order either (ranma 15-30, 153 follow AFL). Never
index-join ANY per-episode chart; join on normalized title (or air date),
and expect zones where two errors cancel.

**New follow-up task (needs Sean's go):** ranma-1-2 series re-anchor, 37
misaligned episodes, title-keyed, reopening the ep-15/16 C2 continue point.
**New follow-up task (needs Sean's go):** batch-12 as-stored spot-check —
7 rows (iruma-kun 63-64, rosario-vampire 3,5,7,8,11).

## 11. RULINGS SESSION (2026-08-25) — Sean's calls on the wave-1 forks

RULED AND CLOSED:
- **D4: YES — extend the A1 gate to the AFG writers** (D1-style; retype
  stays research-tier). Build at apply time.
- **FotNS**: ep 109 null + terminal ep 108→136; "fandom + chapter accounting
  beats AFL alone" accepted for its 8 type corrections.
- **Retypes**: dbz 100 / fairy-tail 256 / tpn 23 / one-piece 737 → mixed.
  Confirmed they follow the ruled type semantics (see below).
- **Rurouni**: 99-100 → filler WITH reasoning stored as annotations (for
  future watch-order surfacing). 95-98 anchors apply as researched.
- **Mashle**: §9 fractional ruling stands; UI surfacing deferred to the
  specials/OVAs design pass — for now the note + correct counts/titles.
- **Sket-dance modelling**: END = max(adapted) with reorder annotations
  (per the C2/A4 architecture; the sparse-frontier alternative rejected).

RESOLVED BY EXISTING RULES (no new rule needed — A4 + C2, §10 2026-08-24):
- **Hellsing frontier**: A4 already says coverage/continue-read = MAX-chapter
  anchor across the run, never the run-end anchor (assemble.ts
  coverageAnchor). Ep 10's ch-2 flashback anchor is an honest record; the
  reader's continue point comes from coverage (ep 7 → ch 12, continue 13,
  kind post_series). The agent's "max over ENDs" recommendation was a
  rediscovery of A4. Apply as researched.
- **Gintama ep 227**: duplicate chapter positions are legitimate (episodes
  can share chapters). Keep the v41→L360 anchor + crossover annotation;
  continue metadata (C2 parity) carries where-to-read-next, not anchor
  uniqueness. The annotation-only fallback is rejected.
- **Noragami**: null ep 12; terminal anchor on ep 10 (mixed — verified in
  DB) END 12 per A4 honest record; parity healer stamps continue metadata.
  Also clean the batch-12 ep-12 continue-note that repeats the refuted
  railgun-style graft claim... (that item is railgun's — noragami's ep-12
  cleanup is just the null + annotation).

NEW RULES CODIFIED THIS SESSION (capture done):
- **Episode-type semantics** (canon / anime-only-canon = consensus-canon /
  filler = zero canon / mixed) + AFL/AFG advisory-only → §10 row +
  research-agent definition.
- **Chapter overlap never proves filler** (the zatch-bell lesson) → §10 row
  + research-agent definition trap.

REOPENED — zatch-bell 10-ep contested block (13, 51, 57, 103, 108, 117,
118, 119, 122, 123): the verdict's filler proposal rested on exhaustive
accounting, now ruled insufficient. Sean's quick cross-check (instant-answer
class — cross-check only, never primary) suggests 103/117/118/119/122/123
may be MIXED (canon from chs ~172, 179-183, 184-187 + padding) and
13/51/57 pure filler. NEW NARROW TASK: re-research the 10 under the
overlap rule — judge each episode's own content; overlap with other
episodes' chapters does not exclude canon. The 105 zatch anchors on
uncontested rows are unaffected and can apply.

HELD: wave 2 dispatch — until the open questions above are worked through
with Sean (his instruction). Follow-up tasks pending his go: ranma
title-keyed re-anchor; batch-12 as-stored spot-check (7 rows); zatch-bell
10-ep re-research (new).

## 12. APPLIED (2026-08-25) — wave 1 + narrow tasks are IN THE DATABASE

Everything above through §11 is applied (§12.45 is the ruling record):
anchor_on_noncanon_row 49 → 0, ruling_violation 0, nonmonotonic 0,
display verify 219/0. D4 gate live in all four edges. Mashle renumbered
(apply-rulings-20260825-mashle.ts). The four narrow-task files are
curated and released from HELD_FILES.

**REMAINING in chunk 1: wave 2 only** — kinnikuman, eyeshield-21,
saint-seiya-knights-of-the-zodiac, project-arms, d-gray-man, angel-heart,
hayate-the-combat-butler, trigun (traps in §5). Then chunk 2
(detective-conan + 9 lighter), then the system-evolution rework before 18.
Open Sean items listed in §12.45.

## 13. WAVE 2 LANDED (2026-08-25) — chunk-1 research COMPLETE (16 of 16 tasks)

All 8 agents completed; 8 verdict files, every one mechanically validated
(parse + series_id, no dupes, A1-consistent, monotonicity checked):

| series | anchors | headline |
|---|---|---|
| d-gray-man | 64 | full 52-102 + Hallow 104-116; Hallow = chs 165-208 EXACT; chs 159-164 never animated by either series; ep 116 repair 206→208 |
| hayate | 30 | row-count identity CLEAN (flag #829 resolved); ep 10 → filler; S1 pervasive reorder (regime needed); TABLE ONLY HAS 54 ROWS of 101 (eps 53-76, 78-100 missing — row-ingest backlog) |
| trigun | 6 | chapter space = Trigun original (ch 1-20 + ch 0); anime exhausts it by ep 15-16; latest_known=102 is TRIGUN MAXIMUM's MU value cross-contaminating (root of flag #943 + the old nonsense pin) — fix the MU association, not the number; eps 17-26 recommended hard no-anchor zone |
| eyeshield-21 | 59 | 19-ep filler proposal (Cream Puff + Death Game arcs + recap stored as canon); flag #830 resolved (no offset); ep-155 mu anchor suspected AFG row-number artifact; true anime reach ~ch 238 not 333 |
| angel-heart | 44 | archived official Yomiuri synopses + 3 chapter-title lists (13 title-identity pins); 3 provable omitted blocks; STORED VOLUME TABLE DEFECT: v6 "56-77" merges v6+v7 (true 56-66 / 67-77) — boundary seed |
| saint-seiya | 55 | PHANTOM CHAPTERS: stored 110-ch space (Wikipedia) contains phantom ch 30 (actually ep 43's TITLE) + phantom 53; Shueisha TOCs + ES/FR = 108. Delivered in STORED space; correction cost spelled out (flag #702) — Sean's chapter-space ruling |
| project-arms | 47 | chapter space rebuilt: 242 not 241 (prior pass dropped v10's first chapter, shifting v10+); "EP 53" IS A PS2 VIDEO GAME (imported AFL row) holding the sole stored anchor — delete anchor + row + counts 53→52 (Sean) |
| kinnikuman | 58 | ch 68-89 never animated by TV (went to the '84 special + Movie 2); eps 120-137 → filler proposal (1991 sequel ignores them; 120-121 stored anime-only-canon — Sean's ruling); 31 air dates wrong vs ja-WP (backlog class grows) |

**Wave-2 verifier candidates (weight-bearing):** saint-seiya phantom-chapter
space claim · project-arms 242-space rebuild + ep-53-video-game claim ·
eyeshield 19-ep filler block · kinnikuman ch-68-89 exclusion + 120-137
filler proposal. Trigun's MU cross-contamination is mechanically checkable
(registry) — script, not model.

**New traps this wave (capture to research-agent at consolidation):**
Shogakukan/Kinokuniya 出版社内容情報 blocks = publisher per-volume TOCs
(project-arms spine; can TRUNCATE — cross MangaDex) · Wikipedia chapter
lists can contain PHANTOM chapters that are actually anime episode titles
(saint-seiya) · archived official broadcaster episode pages
(web.archive.org) are a primary for thin-fandom series (angel-heart) ·
AFL can import non-episodes as rows (project-arms "PS2 Video Game") ·
MU associations can cross-contaminate sequels (trigun latest_known).

**Air-date backlog grew:** + kinnikuman ×31 (ep 38 wrong, 90-119 one week
early, 87 missing) — the AIR_DATE_OVERRIDES pass (system-evolution) now
covers ~40 rows.

**Row-ingest backlog:** hayate rows 53-76, 78-100 missing (54 of 101 rows).

**REMAINING in batch 17: chunk 2 only** (detective-conan + tokyo-mew-mew,
blade-of-the-immortal-ona, arms-alchemy, x, emma-a-victorian-romance,
detective-school-q, fist-of-the-blue-sky, magic-knight-rayearth,
space-adventure-cobra) — waits on Sean's usage check. Then the pre-18
restructuring phase.

## 14. WAVE-2 VERIFY PASS RESULTS (2026-08-25) — 4 verifiers + 1 script check

| claim | verdict | what changed |
|---|---|---|
| eyeshield 19-ep filler | CONFIRMED (all 19, per-episode) | typing-source identified: the import took AFG titles (typos + "* Filler" suffix verbatim) but never mapped the filler flag → defaulted canon; AFL has NO eyeshield page. AFG final row "155." confirmed in raw HTML → strengthens the ep-155 mu-artifact suspicion. NEW SWEEP CANDIDATE: other AFG-expansion series typed the same way. |
| project-arms 242 + ep-53 | CONFIRMED (both) | 242 triple-locked (v7=12 is the load-bearing count; AniList's 241 = the dropped-v10-chapter error; ja-WP 243 unreconstructable). Ep-53 PS2 game proven 5 ways incl. air-date inversion. DURABILITY: deleting the anchor alone gets resurrected (row typed mixed, mu re-derives) — must delete row 53 + counts 53→52. NEW AUDIT CANDIDATE: AFL trailing non-episode rows = air-date inversion, mechanically detectable. Minor: ch-44 gap needs one sentence. |
| kinnikuman ch 68-89 + 120-137 filler | CONFIRMED (both) | boundary title-verified both sides (ch68 = first excluded, ch90 ↔ ep 27B); special = "cut from broadcast" per ja-WP. 120-137: author-commissioned ≠ author-canon; sequel continuity-OVERWRITES their slot; no canon signal found. Eps 1-3 scrambled mappings verified both directions. |
| saint-seiya phantom chapters | PARTIALLY CONFIRMED — corrections matter | Phantom ch 30 PROVEN (smoking gun: en-WP preserved the anime ruby gloss "Batoru"). Phantom ch 53 REFUTED by Shueisha's own vol-15 TOC (4 chapters incl. 黄金色の鎖). TRUE COUNT = 109, ONE phantom, offset = UNIFORM −1 for stored ≥31 (the "+2 from 50" leg was back-derived from the nonexistent phantom). The verdict's correction advice ep114→65 is WRONG — true 66; ruling on it as written would have shipped an off-by-one across vols 15-28. Also: ep-31 row defect (start 25 vs adapted "24-25") — fix at curation. The 55 delivered anchors are sound in stored space (all ≤46, where only the −1 applies). |
| trigun MU cross-contamination | SCRIPT-CONFIRMED | ingest_mangaupdates maps our AniList 30703 (Trigun) to mu_series 30005048940 titled "Trigun Maximum" (latest 102) — wrong auto-association; fix the staging association, latest_known heals via the normal pass. |

## 15. CHUNK 1 CLOSED (2026-08-25)

Wave 2 verified, ruled by Sean, applied (eyeshield last after the contested
re-research + per-episode eyeball). All rule classes 0; §12.47 is the
record. THIS FILE IS NOW HISTORICAL — chunk 2's work-list lives in the gap
census + context.ts TARGETS; the pre-18 restructuring scope lives in
system-evolution.md.

## 16. CHUNK 2 WAVE 1 LANDED (2026-08-25) — 7 of 10 chunk-2 tasks

All validated (parse, series_id, dupes, A1-vs-own-corrections, monotonicity):

| series | anchors | headline |
|---|---|---|
| detective-conan | 132 (1-1205) | all 31 season boundaries both ends; file→chapter identity proven 3 ways; row identity verified across 1207 rows (flag #668 resolved); AFL 0 mis-typings; needs REORDER_REGIMES (26 ruled nonmono pairs); 11 air dates off a week (backlog) |
| x | 9 | boundary-locked only (no source maps eps→chs anywhere); divergence = ep 15 not 21; ep-20 repair 84→94/v18 (chapter INSIDE 88-95 is an estimate — Sean's ruling); trap: both X fandoms are ONE wiki and its "chapter" pages are VOLUMES |
| tokyo-mew-mew | 17 | ep-52 repair 32→27 (AniList padded-space value on a mu row); ch 11 never adapted; backfills as annotations (promotable under C3) |
| detective-school-q | 36 | MU pin REFUTED with mechanism (Chap "69" = transposed 96; vol right); ep 45 anime-original finale → A1 deletion repairs; eps 44-45 → anime-only-canon, 35 → filler |
| emma | 16 | chapter space = 52 mainline (flag #710: AniList 72 mixes Further Tales' separate numbering); eps 19-23 divergence honestly unanchored + → mixed; FULL 7-volume boundary table recovered (none stored) |
| blade-of-the-immortal-ona | 24 | full coverage in JP Act space; ep-24 mu confirmed; boundary defect: stored "v31: 198-?" is Dark Horse count leaking into the JP table → v30 198-206 |
| arms-alchemy | 26 | full coverage chs 1-83; space resolved (flag #699; MU "39" bad record); volume table recovered (none stored); ep-26 mu confirmed; no divergence (vol 10 predates finale) |

Wave usage: ~1.17M tokens (136k-189k per agent). Curation queue: 3 boundary
seeds (emma full, arms-alchemy full, blade v30 fix), REORDER_REGIMES
detective-conan, mu-tier confirmations → manual flips, repairs (x ep-20,
tmm ep-52, dsq ep-45 deletions), retypes (dsq 35/44/45, emma 19-23, dc
128/1000/1001 mixed). Sean rulings pending: x ep-20 chapter estimate,
tmm chapter-space display (27 vs stored total), emma 13-24-vs-19-23 mixed
scope, dc ep-510 split. REMAINING: wave 2 = fist-of-the-blue-sky,
magic-knight-rayearth, space-adventure-cobra.

## 17. CHUNK-2 WAVE-1 FORMAL VERIFY PASS (2026-08-25, Sean-requested) — 7/7

All seven verdicts survived; zero value-level refutations. ~424k tokens.

| verdict | result | corrections/finds |
|---|---|---|
| detective-conan | CONFIRMED values / prose defect | ZERO errors in 132 anchors, 89 vol-start claims, 80×132 continue checks. BUT the Jp/Int column labels are INVERTED in the prose — our rows = DCW's JAPANESE column (Int runs +50-60 higher); the sentence would poison a future re-derive → captured as a research-agent trap; fix prose at curation. Row count now 1212 (5 new filler rows since snapshot). |
| detective-school-q | CONFIRMED 4/4 | MU record proven SELF-contradictory (vol 13 can't hold ch 69); "transposition" downgraded to hypothesis; ep-26 Campaign-Girl tail noted |
| emma | CONFIRMED | 52/20/72 arithmetic exact; annotation span fix 37→38-46; counting trap: unnumbered final chapters make casual counts read 51/19 |
| tokyo-mew-mew | CONFIRMED 5/5 | ep-46 annotation contradicts its own correct flag (fix at curation); ep-38 ch-19 attribution softened to coin-flip |
| x | CONFIRMED / ep-20 PARTIAL | vol-18 half solid; 94 = best-supported estimate (95 overshoots); timeline sentence overstated (ch 94 postdated airdate); verifier's own sub-fetch hallucinated (raw wikitext refuted it) |
| blade-of-the-immortal-ona | CONFIRMED | ep-22 END bounded 189-191 (stored volume safe either way); total_chapters 219 vs 206-act space = pre-existing count-space item |
| arms-alchemy | CONFIRMED | ep-18 END fork surfaced (61 vs 63/64 graveyard cliffhanger); finale evidence edge 83 over 81; SCHEMA FIND: unadapted ch 82 sits inside ep-26's start/end range — exclusions live only in free text (restructuring-phase item) |

## 18. FINAL WAVE LANDED (2026-08-25) — BATCH 17 RESEARCH COMPLETE (26/26 targets + narrow tasks)

| series | anchors | headline |
|---|---|---|
| magic-knight-rayearth | 3 | D2 SPECIMEN #3: manga side = MKR I only; eps 21-49 adapt MKR II (separate numbering) — honest 3-anchor delivery, no fabricated 5/5/5 split possible (no chapter source exists); ep-49 deletion repair (wrong space AND count-space 15 in a 14-space); Tokyopop merged-volume trap on the wiki; SCOPE RULING for Sean (cap manga side at ep 20 vs add MKR II component) |
| fist-of-the-blue-sky | 26 | full coverage; MU pin ep26→88 CONFIRMED (3 legs); 22 volume boundaries recovered; component finding: "DVD episodes" (stored eps 23-26, kind ova) are really withheld TV eps (production 16/17/18/21) |
| space-adventure-cobra | 31 | chapter space resolved (flag #676): Jump serialisation 156 installments; MU's 28 is a STORY count (fr-WP's 28 "Histoires") — mechanism for the stored ep31→"14" pin; repair 14→76; 6 reorder blocks annotated; ep2 weakest (ch32 by elimination); derived volume table proposed not applied |

Final wave usage ~439k. Verify pass (standing practice) dispatched over the
three weight-bearing sets: cobra's count-vs-number repair mechanism, rayearth's
D2 space claims + deletion, fotbs's confirmation legs + component finding.

## 19. BATCH 17 CLOSED (2026-08-25). This file is history.

Final wave verified/ruled/applied (§12.51). Rayearth's 15-ruling, cobra's
story-count repair, fotbs's component demotion all in. The restructuring
phase is next; its scope lives in system-evolution.md.
