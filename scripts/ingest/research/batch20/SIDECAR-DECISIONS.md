# SIDECAR DECISIONS — RULED + APPLIED 2026-09-04 (§12.106). Historical record of the exploration; the rule text lives in T28 / A44, the data in the sidecar apply.

Read this first when the session resumes. Nothing below is applied. Sean is working through
the sliver logic with his own examples before ruling; do NOT proceed until he says go.

## The position
Batch 20 is closed (§12.78-§12.104), G58 landed (§12.105), the volume re-derive healer landed
(anchor_volume_mismatch 20 → 0), series_scopes is keyed by series_id (migration 20260903120000).
Census: ruling_violation 0, run_stuck 0, display 218/0; system census OK. Watch item: the
2026-09-04 08:10 UTC refresh-anilist run must close on its own (G58's proof in the wild).

## 1. THE SLIVER LOGIC — the open ruling (the first-time test)
Two different questions get confused because both involve a few pages of a chapter:

**Q1 — does an END advance on a trailing scrap? (A47, ruled.)** An episode adapts 86-89 in
full and shows the first pages of 90; the next episode starts on 90. The tail is the next
episode's: END 89, partial{90 (opening)}, continue 90. Refinements ruled: unproven size →
advance with a partial (wave 13); a tail only ONE source asserts → hold (wave 14).

**Q2 — does a row whose ONLY source content is a sliver carry an anchor at all? (OPEN.)**
These rows are mostly anime-original, typed mixed because a page or a scene ties them to the
manga. An anchor says "after this episode you are HERE in the manga". Cursor's test, which I
(Claude) agree with: compare the sliver's chapter to the PREVIOUS anchored row's END.
- beyond it → the sliver is FIRST-TIME coverage; it moves the frontier; the anchor is a real
  position and STANDS.
- not beyond it → a scrap of ground already covered; the row has no position of its own; NO
  anchor (the display carries the previous position forward); the partial + the type say
  what the page is. Types never change under this test (the recap clause governs types).

Applied to the four candidates (data pulled 2026-09-03):

| series | ep | previous anchored END | sliver | first-time? | → |
|---|---|---|---|---|---|
| d-gray-man | 66 | ep 65 ends inside 78 | 78 (one page) | no | mixed (T28 — was canon), NO anchor, partial stays |
| reborn | 159 | ep 157 → 231 | 232 | yes | anchor STANDS |
| reborn | 178 | ep 177 → 256 | 257 (bookends) | yes | anchor STANDS |
| reborn | 189 | ep 178 → 257 | 257 (recap) | no | mixed stays, NO anchor, partial stays |

What the user sees: the number they end up at is the same either way; what changes is whether
we claim the episode EARNED it. Why a rule: the comparison is mechanical → an A44 amendment
("the first-time test") + a census class (an anchor on a single-segment sliver ≤ ~5 pages whose
chapter ≤ the previous anchored END) so it never needs a sitting again (P30).
Cleanup riding along: the four rows' partial notes still carry A47-migration text later
reverted ("END stays 231" beside a stored 232) — rewrite in the same apply.

## 2. tsugumomo 8 — agreed by all
Not A44: anchor 19 + `side_story` on the unnumbered vol-5 extra (コミックハイ！出張版 モテモテ
フレグランス, printed between ch 29 and 30) — the Dai 61 shape but WITH a numbered chapter.
tsugumomo 1-11 (11 unanchored rows, under the gap class's > 12 threshold) → next batch's
work-list; consider a lower-tier gap class so short series get their own queue (R27).

## 3. Ranking of Kings scopes — research landed (out/ranking-of-kings-the-treasure-chest-of-courage-scope.json)
Four witnesses for the part-one/part-two seam (ja-WP 「第一部（1巻1話〜12巻155話）」; KADOKAWA's
vol-13 copy 「第二部開幕!!」; MangaDex + fandom volume pages v12 = 142-155 / v13 = 156-167).
Recommend (Cursor agrees): `ranking-of-kings` end vol 12 / ch 155 (complete, no tail);
`ranking-of-kings-the-treasure-chest-of-courage` start vol 13 / ch 156, OPEN end (owns the
ch 162 → 276 tail). The side series' ep 10 → 161 [156] is a FLOOR → continue 162 (C5), not the
batch-11 note's 165 (single research note, no cited skip; 162 re-reads at worst, 165 could skip
three adapted chapters). Rewrite ranking-of-kings ep 23's divergence note as the handoff
pointer. Record gains: ep 9A = the vol-11 描き下ろし (side_story); ep 6 vol-12 描き下ろし candidate;
ep 5C vol-7 bonus candidate (would make the stored filler wrong) — flagged.

## 4. four-knights latest_known — a derivation gap, not a ruling
MU's release-derived latest is 103 (its lag), but MU's own anime-coverage field for S2 reads
"Vol 14, Chap 120 Page 12" — MU prints 120. Recommend a general floor in `bestLatestKnown`:
latest_known ≥ max(release-derived latest, any chapter MU's coverage segments name, the volume
table's last bounded chapter, the anchor floor). Four-knights reads 120 with it (the witness);
seeding vols 10-27 from Kodansha's records becomes a research target, not a prerequisite.

## 5. Then, in order (Cursor's list, agreed)
P34 (extract the 14 batch-20 apply scripts' curated maps → lib/rulings/applied/batch-20.ts,
scripts → history/) BEFORE a new research batch or the UI pass; then orient / code-black
row-mint under G57 policy. Parked stays parked (claymore 26, L-P, the T28 six). 83 unaudited
rules: one witness at a time. MangaDex bridge: 33 of 239 manga unbridgeable (standing
match_ambiguous flags; pre-existing).

## Standing facts learned today (already captured in their homes)
- G58 (edges budgeted; structural hash; run_stuck) — ledger + lib + healer + census.
- The fandom's Dai numbering is printed through its 335 (the from-208 window was arithmetic,
  refuted on titles) — N35 entry, protocol, research-agent trap.
- A47's existence clause (R3 before A47) — A47 record + traps.
- lib/volumes.ts#volumeForChapter = the one volume derivation; heal-anchor-volumes standard.
