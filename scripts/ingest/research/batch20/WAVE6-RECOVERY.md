# Batch 20 — wave 6 recovery (FotNS 29-56 + L-D ×7; dispatched and landed 2026-08-28)

## Landed (all validated; committed one by one)
| verdict | lane | result |
|---|---|---|
| fist-of-the-north-star-w6.json | A2 | 25 anchors ch 36→82 (20 high / 5 medium: 37, 43, 44, 47, 54), 7 continues (5 C1 straddles), 12 annotations, 0 hostile; fence repair ep 57 → 82; retypes proposed 53 → filler, 54 → mixed; ep 58 {83} flagged out-of-range (its beat is ch 80) |
| mf-ghost.json | L-D | pin 194 was the S3 SEGMENT (season-labelled string); S1 finale = 53-57 vol 5; repairs 194→57, v17→5; continue 57 (C1; S2 restarts there); LIB GAP: ENTRY_MARKER matches /S\d+/ — a season-scoped entry needs its season tag matched (G32 gate 0) |
| shy.json | L-D | CONFIRMED 72-74 v9 (the S2 segment); C5 continue 75 + C3 note (82/83 already animated by eps 14/13); flag #771 → recommend dismiss (latest-DATED-release artifact); future block: eps 1-23 (page-split fandom data exists) |
| to-the-abandoned-sacred-beasts.json | L-D | CONFIRMED 28-30 v6 (restaging, not an original ending); C1 continue 30 (C5→31 the flagged alternative); SPACE: the real numbering is 1-87 / 15 vols — stored total 120 (AniList) unsourceable, re-base for Sean (flag #681); volume table in structure.notes |
| d-frag.json | L-D | chapter CONFIRMED, volume WRONG: MU's "Vol 4, Chap 36 (Including OVA)" mixes adaptations (vol 4 is the OAD's — it adapts the TV-skipped ch 26); repair v4→5; C5 continue 37 with skips named (8/10/11; 26 OAD-only); answers flag #541 |
| darwin-s-game.json | L-D | pin UNDERSTATED: "Chap 30 Abridged" = last COMPLETE chapter; the epilogue animates ch 31 pp 3-8 → repaired 30→31, START 29, v8; C1/C5 continue 31; fandom's "Volume 9" tag on ep 11 unsubstantiated (flag) |
| fist-of-the-blue-sky-regenesis.json | L-D | the pin is ANOTHER ADAPTATION'S: MU's 1→88 segment = the 2006 TV series (ReGenesis's MU entry: null anime field). Space = the ORIGINAL Souten no Ken, 255 chs not 260 (Coamix's index; ja-WP 全255話). ep 12 = the Nahash branch aired 先駆けて → filler + hostile, 88 deleted; honest terminal ep 9 → 254 v22 (medium); continue 255 post_series; eps 10/11 flagged anime-original (out of ask); S2 flagged as a T30-adjacent identity question (a possible SECOND parallel witness) |
| btooom.json | L-D | VERIFIED ON THE PAGES: 47-50 v9 (vol-9 scan read); C5 continue 51 (never adapted 51-125 incl. the Dark Ending); rearranged + abridged; trap: btooom.fandom's per-episode chapter field is a FLOOR (empty on 12, undercounts 11) |

## Verification (R24, in flight)
- verify/fist-of-the-blue-sky-regenesis.md — the wrong-adaptation pin, the 255-space, the ep-12 retype, the ep-9 terminal (weight-bearing)
- verify/fist-of-the-north-star-w6.md — the 25 anchors, the ep-57 fence repair (moves a stored manual anchor), the 53/54 retypes, the ep-58 flag

## Traps learned this wave
- **MU's coverage string can be SEASON-LABELLED** (`… (S1) / … (S2) / … (S3)`) and gate 0's ENTRY_MARKER matches /S\d+/, so every segment reads as "this entry's" and the max wins → a season-1-only entry inherits the final season's endpoint (mf-ghost). LIB FIX QUEUED: match the entry's own season tag.
- **MU "Chap N Abridged" = the last chapter adapted IN FULL**, not the frontier — the finale may animate pages of N+1 (darwin-s-game).
- **MU's combined "(Including OVA)" strings mix adaptations** — the volume can belong to the OVA's chapter while the chapter is the TV run's (d-frag).
- **An unlabelled 1→N segment on a sequel-entry can be the PREVIOUS series' whole run** (regenesis ← the 2006 TV series; the sequel manga's own MU entry had a null anime field).
- btooom.fandom's per-episode `manga chapters` field is a floor; hokuto.fandom HAS 245 per-chapter pages + a two-way appearances index + a Filler page (wave-3's "no episode pages" trap stands but understated the wiki); rq87.flyingomelette.com and hokutosite.sakura.ne.jp carry per-episode manga-difference lists for FotNS.

## Open for Sean (rule at curation, after the two verifies)
- regenesis: ep 12 retype + anchor deletion; the ep-9 terminal (254 v22 medium; arguably mixed); totals 260 → 255; the continue fork (255 vs 190); eps 10/11 follow-up; S2 identity (T30 candidate — research first).
- FotNS: the 53/54 retypes; the ep-57 fence repair; ep 58 {83}→{80} as a follow-up repair (out of this block's range).
- sacred-beasts: totals 120 → 87 re-base (flag #681); the C1-vs-C5 fork (30 vs 31).
- shy: flag #771 dismissal; the C1-vs-C5 fork on the omitted last panel.
- L-D remaining: 22 pins queue for wave 7 (killing-bites, shaman-king-flowers, soul-eater-not, drifters, prison-school, cobra, orange, one-piece-log, uq-holder, handa-kun, nagatoro, girls-last-tour, made-in-abyss, gangsta, erased, tsugumomo, code-black, ranking-of-kings-tcoc, orient, magi-sinbad, masamune-kun, pluto).

## Next
The two verifier reports → Sean rules → /apply-batch wave 6 → the cycle (dai 18-99 ×3 still LAST; L-D wave 7 in eights).
