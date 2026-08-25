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
