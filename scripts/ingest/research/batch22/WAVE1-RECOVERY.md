# Batch 22 — wave 1 recovery record (2026-09-04)

Wave 1 = the Boruto follow-up left by batch 21 wave 3. 2 agents (Opus), 2/2 landed, validated, scanned, committed (9e35a77 / dbf037a). Verifier (Fable over Opus) in flight → `verify/w1-boruto.md`. apply-wave1.ts staged from the batch-21 shape; nothing applied.

## Results
| rows | result |
|---|---|
| 19-23 (lane I) | canon confirmed; `chain_source{Naruto Gaiden: ch 700+N}` per row in the ruled label space (19 = 700+1, 700+2; 20 = 700+2..700+4; 21 = 700+5, 700+6; 22 = 700+7, 700+8; 23 = 700+9, 700+10), partial{700+2} shared by 19/20, divergence where the anime adds; anchors none (another chapter space). |
| 39 (lane I) | canon confirmed; the unnumbered one-shot 満ちた月が照らす道 (collected in Boruto vol 1) — delivered under the 'Naruto Gaiden' label, un-numbered: the LABEL FORK for Sean (the I41 Gaiden node is AniList 86171 = Scarlet Spring only). |
| 18 (lane C) | mixed confirmed; the first half adapts the unnumbered Kishimoto omake 「ナルトが火影になった日」 (秘伝・在の書) — side_source delivered; chain candidate flagged (a manga omake in the continuity, not a serialized work). |
| 93-95 (lane C) | canon confirmed as stored (+ side_source enriched, abridged): a straight in-order adaptation of the novel ナルト新伝 親子の日 — NOT Mitsuki's Disappearance (that arc ends at 92). No Boruto-manga page in any of the four (Narutopedia's SMW Manga Chapter index: 71 rows carry it, these do not, neighbours do). |

## Traps learned
- **Three chapter spaces on one page, no conversion**: the printed Gaiden 700+1…700+10 (Viz's citation space), Narutopedia's flattened 701-710 (volume 73), Boruto's 1-80. AFG's Boruto page is NOT a verbatim Narutopedia copy here (adds 706 to ep 22, drops 700/705 on 24) — refused under R3 on TV Tokyo's synopsis.
- **AFL's Mixed bucket on Boruto is not a type signal**: across batches 21-22 its ten rows are a cold open (1), no source (127), a status report (157), a chain row (24), four real Boruto rows (59, 192, 210-211), an omake (18), a novel (93-95).
- **AFG's chapter column carries NON-NUMERIC tokens on this page** ('OMAKE: …', 'NOVEL') and Naruto-space numbers on 19-24 / 106 — nothing has landed (the chapter-space gate + A44 hold), worth keeping as a parser fixture.
- **Ask premise slip again**: '93-95 sit in the Mitsuki's Disappearance arc' was wrong (the plan step's guess) — the agent corrected it; quote the class line, do not add arc guesses.

## THE DECISIONS — for Sean (final after the verifier)
1. **Apply the chain rows**: 19-23 / 39 annotations as delivered; A44 widened from [24] to [19, 20, 21, 22, 23, 24, 39] (another chapter space — a derivation-tier writer reading Narutopedia's or AFG's column could otherwise put 701-710 into Boruto's 1-80 space); T6 pins (confirmations) for 18 / 19-23 / 39 / 93-95.
2. **Ep 39's label**: keep 'Naruto Gaiden' and WIDEN the I41 node's note to name both Gaiden works (Scarlet Spring 700+1…+10 and the one-shot 満ちた月が照らす道) — recommended; or add a fourth chain work with its own label.
3. **Ep 18's omake**: side_source as delivered (recommended: a movie-book extra, not a serialized work on the chain) — or put the omake on the chain.
4. **The licensed side-work standing** (canon + side_source on 14 Boruto rows and Black Clover 55-56 vs the one-piece-50 filler + side_source line): the standing T26 adoption sitting — one block ruling, not row by row; types untouched until then.
5. **Crumbs**: ep 106 (Narutopedia: Manga = Naruto ch 700 — a graft or a wiki slip; chain_source or nothing, never an anchor).
