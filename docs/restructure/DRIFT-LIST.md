# T0 drift list — for Sean (2026-08-25)

Source: eight per-home extracts (`t0/*.json`, 1,142 entries) merged by
`scripts/restructure/t0-merge.ts` into `inventory.md`, then read for
contradictions. Sections: **A** needs your ruling · **B** stale text (loser
identified, mechanical delete in T1) · **C** duplicated mechanism (T2
engineering) · **D** log-only rules (ledger candidates) · **E** latent
defects (sidecars) · **F** script triage · **G** metrics as counted.

Headline: the inventory holds **518 rule statements** for what the ledger
will hold as roughly 120–150 rules — the rest are copies. 423 of the 518
name no audit class. 247 are bundles. 52 rules live ONLY in the change log.

---

## A. Rulings — RULED by Sean 2026-08-25 (yes to all, cross-checked by Cursor; two edges recorded)

| # | ruling |
|---|---|
| A-1 | b17 stands: the agent delivers the C2/C3 continue point; b16's "earliest not-yet-adapted" was the note-value. |
| A-2 | Two ledger rows: episode END = running order; series COVERAGE = max across the run (A4). |
| A-3 | Both, by tier: AFG-derived anchors may drop non-monotonic junk; research/manual anchors render as stored. |
| A-4 | Research never index-joins. A writer-side title-join (or refuse pages whose order ≠ ours) is `/add-rule` BACKLOG — not a T3.1 proving exercise. |
| A-5 | Re-staged content with nothing new = filler; mixed needs new canon. detective-conan 128/1000/1001 become a named re-check task (list, not vibe). |
| A-6 | Healer over the 27 seeded starts under the sliver rule; deltas listed; Sean signs. |
| A-7 | Parked to T4.0 with the evidence. Nothing retyped now. |
| A-8 | `dismissed_permanent` disposition + reason; permanent conditions leave the open queue. |
| A-9 | canon-tier creation is a standing rule; the system census finds whether the path exists — never rebuilt from the log. |
| A-10 | one-pace excluded; the note must match the apply. |

T2 edge (Cursor, accepted): `chain.ts#aggregate` may be UNIFIED with `resolve.ts`; it must not invent `source_type` values before T4.0.

### The forks as presented (kept for the record)

| # | the fork | versions on disk | recommendation |
|---|---|---|---|
| A-1 | **Agent's continue-point deliverable** | batch-16 PROTOCOL: skips/grafts → "earliest not-yet-adapted-but-WILL-be mainline chapter", apply layer stamps parity. batch-17 PROTOCOL: deliver PARITY (next episode's start) directly. Both headed "Sean's rulings 2026-08-24". | b17 stands (it is C2/C3 as in §10); b16 wording deleted in the PROTOCOL collapse. The apply-layer healer keeps stamping regardless. |
| A-2 | **END vs coverage** | b16/b17: END = last mainline chapter **in running order**, not the numerically largest. CHUNK1 §11 sket-dance: "END = max(adapted)". | Both true at different grains: row END = running order; series COVERAGE = max across the run (A4). The sket-dance note conflated the two. Confirm, and the ledger states them as two rows. |
| A-3 | **Derivation-time monotonicity** | §10 "Anchor monotonicity": AFG-derived anchors keep the longest non-decreasing subsequence (junk cells drop). §10 "Non-monotonic display ruling": back-jumps are legitimate; junk protection is chapter-space gates + audits, never silent drops. | Keep both, scoped: DERIVED tier (afg chart) drops non-monotonic as junk; RESEARCH/manual tier may be non-monotonic and renders as stored. Ledger: two rows, each naming its tier. |
| A-4 | **Title-join rule's scope** | §12.45: "never index-join any chart" (research-time, ranma). The AFG chart WRITER (`syncAnchors`) IS an index join behind a ±12 alignment gate — and ranma proved AFG row order can be inconsistent inside an aligned page. | Rule as written scopes to research verdicts. Whether `syncAnchors` should title-join (or at least refuse pages whose title order ≠ ours) is an `/add-rule` candidate — your call whether it goes on the T3.1 exercise list. |
| A-5 | **Rehash typing** | lib comment: zatch-bell ep 119 rehash → **filler** (overlap rule's discount clause). Same day: detective-conan 128/1000/1001 "re-staged canon content, never position" → **mixed**. | Under the overlap rule a rehash with nothing new is filler; "mixed" needs some new canon. Rule: re-staged content with nothing new = filler; if the conan episodes add new canon, mixed — else retype. Needs your confirmation; the conan rows then get re-checked. |
| A-6 | **Seeded starts under the old majority rule** | `apply-start-chapters.ts` seeded 27 START values under the 2026-08-23 MAJORITY rule (first FULL chapter unless the tail is the bulk). Batch 14 tightened it to the SLIVER rule (leading partial counts unless ≤5 pages). The 27 were never re-normalized. | A rule change that invalidates prior per-row decisions = the deep-rescan case. Recommend a healer pass over the 27 under the sliver rule, results listed for you. |
| A-7 | **Studio-original endings — one class, three types** (→ T4.0 agenda, not now) | DSQ "caught up, padded out" → filler (08-25). claymore 24-26 (Madhouse outran the manga) → anime-only-canon (08-23). gto 42-43 "caught up" → anime-only-canon (batch 11). ajin "non-canon ending" → anime-only-canon. X "only ending" → filler+asterisk. | Parked for T4.0 with this evidence; nothing retyped now. |
| A-8 | **Permanent-flag disposition** | §12.21 "keep-open-vs-dismiss ruling for permanent flags" (page-less manga on Wikipedia: Zom 100, Gachiakuta, Nagatoro, MF Ghost) is still open; no rule. | Rule: a flag whose condition is permanent gets a `dismissed_permanent` disposition with the reason, and stops counting in open-flag census. Your call. |
| A-9 | **canon-tier creation** | §12.19c2 ruled YES (manga-sourced shows with no chart anywhere are created canon-default + AFG continua + MU upkeep). Log-only; build status unclear — several witnesses later appear anchored via AFG expansion. | Confirm it is a standing rule (ledger row) and let the system census find whether the creation path exists as a rostered script. |
| A-10 | **one-pace** | `audit-titles.ts` MANUAL_EXCLUDE applies the exclusion; the note says "excluded pending Sean confirmation". | Confirm excluded (fan re-edit, not an official series) so the note stops lying. |

Closed items the process home still lists as open (confirmed ruled in §12 —
no action beyond deleting the stale "open" text): beastars ep 44 (anime-only-
canon, 08-24), MHA 104 (filler, A1 origin), x ep-20 → 94/v18, tmm total 27 +
bonus-story annotation, emma 19-23 mixed, D4 (YES, built).

---

## B. Stale text — superseded but still standing (mechanical; the loser is named)

§10 table rows:
- EXTRAS_ADOPTED row still lists eyeshield-21 155 (removed §12.49).
- Episode-type overrides row still cites X 21-24 → anime-only-canon (re-ruled FILLER §12.50).
- A1 outcome row still says D4 "is a Sean decision" (built §12.45).
- "Continue-reading points" row still says default = end+1 (superseded by C2 parity §12.37).
- Preamble still calls AFG "(future)".
- /consolidate row states the LOCKED-series clause as live (never built — system-evolution §5).

§1–9 prose:
- §1 reliability tiers list MU as cross-check-only (MU writes frontier + latest_known since 08-24); §1 Wikipedia "(planned)" (live).
- §2 "Manga totals" superseded by Effective total / same-edition band; §2 flag rule lists count mismatches among HELD changes — code: `count_mismatch` is flag-only (§10 correct).
- §3 match ladder puts manual override LAST — code (`match.ts`): `source_map` FIRST (§10 correct).
- §3 "source-scope … per-case in source_map" — stitcher/series_scopes replaced it.
- §4 wears a SUPERSEDED banner but holds live rules (conditional GETs, etiquette) — move those to the ledger/runbook.
- §6 schema inventory omits series_scopes, volume_boundaries, episode_annotations, watch_order_entries, ingest_fractionals, continue_* — stale.
- §11 refresh-mu "≤15 stalest" — code: BATCH = 20 (freshness map correct). Research-tier heading dates inverted (ruled 08-24, amended 08-23).

§12 markers: §12.11 "← next build item" (built); §12.21 remaining-triage lists x / outlaw-star / AFL-sparse keep-vs-dismiss as open (all resolved); §12 coverage-segment "NOT built" — parts 1–2 built as Effective total + Continuation handoff; §12.13 "AFG type encoding parsed" vs §12.48's finding that the import never mapped the flag (record as history). §12.16 says 38 LN series, §10 says 34.

Skills/agents/decisions: consolidate §5 calls D4 open and lists `syncAnchors` without the A1 gate; consolidate vs apply-batch healer rosters differ (afg-continua-apply missing from apply-batch); DECISIONS b15 lists beastars 44 and MHA 104 as open; DECISIONS b17 D3 "filler = outside both canons" (refined to "ZERO canon content" 08-25); four CHUNK1 traps marked "capture to research-agent" never captured (phantom chapters from source typos, sket-dance en-WP cells, archived broadcaster pages, X wiki volumes-as-chapters); the mashle HELD_FILES trap (stale verdict re-applies on every run) not in apply-batch.

Code comments: `afg.ts` header "AFL is the type authority" vs resolve.ts "AFL/AFG advisory" (08-25 stands: override > AFL > AFG); `afg.ts` "continue-1 must agree" vs anchors.ts 40-chapter tolerance (anchors.ts is the live rule); `usePositionLookup.ts` header contradicts its own vol→ch code; `chapterForEpisode` stale comment and apparently unconsumed; `EpisodeList` SECTION_BAND manga_only dead key; audit-ui-truth header names supabaseSource.ts (logic moved to assemble.ts) and carries trailing debug prints; `REVIEWED_NUMBERED_SPECIALS` stale entries (dr-stone "his ep 95 was a typo", fist-of-the-blue-sky 3864 span demoted to order-only); `stabilize.ts` SPARSE_HOLD list stale (four re-entered via canon-tier).

---

## C. Mechanism duplicated (invariant 1) — T2 engineering, no ruling

| mechanism | copies | note |
|---|---|---|
| 0.8 same-edition band | assemble.ts totalChapters · mu-frontier.ts · audit-ui-truth displayTotalOf | hand-copied constant |
| volume ratio fallback | mapping.ts chToVol (scope-aware) · assemble.ts volumeFor (not) · audit-ui-truth volumeFor | **they differ** |
| ±2 / lag finalize gate | stitch.ts · afg-extend.ts · afg-expansion.ts · reconcile-structure.ts | four call sites, no lib predicate |
| sliver / running-order normalizers | four batch apply scripts, verbatim | invariant-1 drift named by the §10 reader |
| source_type / manga_status / id derivation | resolve.ts vs chain.ts#aggregate | **aggregate lacks DOUJINSHI/ONE_SHOT, the no-source-but-edge fallback (old stitched heads become `original`), CANCELLED→publishing vs finished, no id tiebreakers** — T4-relevant defect |
| stitched volatile aggregation | resolve.ts refreshStitchedVolatile · chain.ts aggregate · merge.ts | three |
| Wikipedia title-token agreement | wikipedia.ts findChapterPages ≡ findEpisodePages · resolve.ts titlesAgree | three |
| Supabase paging | four implementations across five audit files; 7+ unpaged catalog selects; `lib/db.ts` has none | T2.3 |
| hasSource | AnimeCard/usePositionLookup (source_type only) vs buildMapping (source_type AND manga_status) | the manga_status = 'anime_only' homonym at work |
| default episode type | mapping.ts episodeTypeAt hardcodes canon vs assemble.ts buildSpans base-type padding | off-range only today |
| A1 at the client | toEpisodes nulls filler anchors, but buildMapping's frontier reads the raw anchor list with no type filter | a filler-row anchor can still set the frontier |
| what-the-card-renders | audit-ui-truth re-implements buildMapping by hand ("lockstep"); verify-series-display imports assemble.ts | opposite strategies; audit-ui-truth's latestKnown ignores the Ippo coverageAnchor ruling |
| first-chapter display | card applies it; MangaMappingDisplay (detail page) shows raw chapters string | card and detail can differ |
| vol→ch inverse | ratio-only in solvePosition vs boundaries-first chToVol | |
| numbering shifts | WIKI_NUMBERING_SHIFTS (empty) vs lib SOURCE_NUMBERING_SHIFTS | mechanism, not values |
| run-source vocabulary | ingest_runs source union lacks mangaupdates/wikipedia while flags use them | |
| healers outside the roster path | research/batch15/apply-parity-continues.ts (the C2/C3 healer); batch-11's generic aired-count healer | a healer that lives in a batch dir |
| audit-manga-coverage | classed census in docs; it WRITES (self-healing) | roster class = heal |

---

## D. Log-only rules — 52 in §12 with no §10/§11 presence (ledger candidates; full list in `inventory.md` §B and `t0/s12.json`)

Notable: CONTINUA_SUPPRESSED (standing map, no row) · mu_pin_unverified (audit class in every census, no row) · never-index-join / join-on-title · curated-first apply loop · typo-candidate floor lesson · continua-vs-chart cross-check gate (candidate) · AFG "* Filler" title-marker rule · fractional-never-integer (mashle) · canon-tier creation (A-9) · the 15-series permanence-lock candidate list · "AFL becomes validation when it returns" · "a bad pin masks a gap" (verify-pool delta) · "do not decide a gate on a small sample" · Boruto ep-219 curated-consistency (lesson named, predicate never stated — inferred from `syncAnchors`) · ~12 source traps (nisekoi continue-as-anchor, rosario series-summary line, second infobox, DC Jp/Int, MangaDex filter, storefront re-cuts, Sasuke Retsuden…).

Prose-only in §11 with zero §10 presence (same class): the GTO lesson, monotonic boundaries, start-sanity guard, exact-record-outranks-derivation, relocated openers, Ippo v61, block-end anchors deprecated, naming authority, etiquette, the A4 full text, the flag-rule umbrella.

Label collisions the ledger must alias: "D1" = kamisama ep-10 (§12.41) AND the MU gate stack (§12.43+); "A1" = a batch-15 encoding question (§12.37) AND the filler-anchor rule (§12.38+); "C4 single-source-final — RATIFIED" has no text anywhere.

---

## E. Latent defects (fix in sidecars; none is live data corruption today)

1. **FIXED 2026-08-26 (T2.0).** `scripts/` was outside the `tsc -b` graph — root tsconfig references src + vite.config only. Board T2.0.
2. **FIXED 2026-08-26 (T2.3).** `syncAnchors` typeRows was an unpaged per-series `episodes` select — one-piece and detective-conan exceed 1000 rows; episodes past the cap pass the A1 allow-list as "row-less". Census `anchor_on_noncanon_row` = 0, so latent. Board T2.3, first item.
3. **`chain.ts#aggregate` source_type drift** — a stitched series whose AniList head lacks `source` becomes `original` (the fallback exists only in resolve.ts). T2.1 dedupe; T4.2 derivation rule.
4. **Client frontier ignores episode type** — a stray filler anchor is hidden in the list but can set latestKnown. T2 dedupe (one A1 predicate for both consumers).
5. **Re-running historical apply scripts reverts later rulings**: apply-research-batch.ts recreates the fotbs 23-26 ova span (demoted 08-25b); apply-research-aot-s4p2.ts reverts ep 87 start 130→123; the dr-stone row-95 creation is contradicted by the later order-only ruling. `history/` must be non-runnable by convention AND by the roster check.
6. **Batches 15/16 did not promote repaired rows to manual** (only 17 does) — invariant 7 gap in two historical scripts; check whether any mu/afg row repaired by 15/16 still stands (a census query).
7. **FIXED 2026-08-26** — `one-pace` exclusion now carries Sean's ruling (A-10).
8. `wiki-episodes-backfill.ts:403` runs wiki-CREATED rows (already in our space) through `filterEpisodeRows(…, 'wiki')`; a series whose SOURCE_NUMBERING_SHIFTS entry declares no `spaces` would be mis-shifted on the row-less canon-tier path. Fix in T2: make `spaces` explicit on every historical shift, then unify WIKI_NUMBERING_SHIFTS into it. (Found by the T2.1 non-lib agent.)
9. 14 repairs approved in batches 15/16 never promoted the row to `manual` (P8); their rulings carry `retiresWhen: 'P8 check…'` — a census query must confirm none still stands at derivation tier.
10. 8 assisted-batch OVERRIDE_CHAINS entries have no recorded reason (UNRECORDED in docs/rulings.md) — backfill from §12/AniList when touched.

---

## F. Script triage (T0.3) — 65 files

pull 7 · heal 16 · census 4 · history 34 · lib-support 2 · dead 2 (pilot.ts → superseded by backfill.ts; wayback-recover2.ts → input is an out-of-repo scratch file). Borderline calls stated in `scripts-1.json` evidence: merge.ts (history vs heal), refix.ts (heal vs dead), canon-tier TARGETS (a standing map or a one-shot). audit-manga-coverage → heal, not census. Full table: `inventory.md` §E.

---

## G. Metrics as counted (replaces the guesses on the board)

| metric | T0 count |
|---|---|
| rule statements in inventory | 518 (≈120–150 distinct after dedupe — T1.2 decides the grain) |
| rules naming no audit class | 423 of 518 statements; 69 of 88 §10 rows |
| bundles to split | 247 statements flagged |
| audit classes | 64 (33 ui-truth · 12 coverage · 11 afg-structure · 3 verify · 2 titles · 3 other); ~33 name the rule they check |
| standing ruling maps (discriminator) | lib 10 (6 rulings + 4 vocabularies) · scripts 27 (17 non-apply + 10 in batch 15–17 apply) · audits 3 · client 4 (2 mock-era dead) → **≈30 ruling maps outside `lib/rulings/`** |
| log-only rules | 52 (§12) + 11 prose-only (§11) |
| PROTOCOL copies restating rule text | 4 (13 / 21 / 17 / 33 rule citations) |
| unrostered scripts | 34 history + 2 dead = 36 to move/delete; 16 heal + 4 census + 7 pull to roster |
| ingest files outside `tsc -b` | all of `scripts/` |
| duplicated mechanisms | 18 (§C) |
| tests as witnesses | 20 `it` blocks across 6 `describe` (client) |
