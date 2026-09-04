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

## Verification (R24) — DONE (verify/w1-boruto.md, Fable over Opus)
Every chain beat verified on the episode pages against the Gaiden volume page; the novel map (93 = prologue + ch 1, 94 = ch 3, 95 = ch 4) verified beat by beat, with two gaps folded (ep 95's kunai coda = the novel's ch 1 closing beat relocated; the Epilogue is unadapted). APPLY HAZARD folded: 93-95's stored side_source rows are RULING-tier (standing-annotations.ts) — the T26 healer re-upserts them every run, so the novel map lands by editing the ruling entry, never by apply (ANNOTATION_SKIP staged; abridged chapters → null). PREMISE REFUTED: both unnumbered Kishimoto extras exist on AniList as their own works — the one-shot 87175 (ONE_SHOT, sequel to Scarlet Spring) and the omake 87402 — so the verifier recommends a fourth (and fifth) chain node with colon-free labels rather than a 'Naruto Gaiden' sub-item, and ruling ep 18 with ep 39. A44 widening to [19-24, 39] concurred (AFG's live column prints 701-710 on 19-23). AFG's 706 on ep 22: a page tie, no consequence. ep 106 Manga = Naruto ch 700 re-pulled: real, queued.

## THE DECISIONS — for Sean (after the verifier)
1. **Apply the chain rows**: 19-23 / 39 annotations as delivered; A44 widened from [24] to [19, 20, 21, 22, 23, 24, 39] (another chapter space — a derivation-tier writer reading Narutopedia's or AFG's column could otherwise put 701-710 into Boruto's 1-80 space); T6 pins (confirmations) for 18 / 19-23 / 39 / 93-95.
2. **The two Kishimoto extras, ruled together** (verifier finding 2 — my earlier recommendation reversed on the AniList evidence): the one-shot 「満ちた月が照らす道」 (AniList 87175) and the omake 「ナルトが火影になった日」 (87402) are Kishimoto MANGA in the continuity with their own ids — RECOMMEND both on the chain as their own nodes, colon-free labels 'The Path Lit by the Full Moon' and 'The Day Naruto Became Hokage': chain = Naruto → The Day Naruto Became Hokage → Naruto Gaiden → The Path Lit by the Full Moon → Boruto; ep 39's label and ep 18's kind (side_source → chain_source) are STAGED that way (remove the two overlays if you keep one Gaiden label / side_source). Novels stay off the chain either way.
3. **A44 widens** from [24] to [18, 19, 20, 21, 22, 23, 24, 39] (another chapter space / no chapter number).
4. **93-95's novel map lands by editing the STANDING entry** (ruling-tier rows), with the epilogue gap noted — part of the apply on go.
5. **The licensed side-work standing** (canon + side_source on 14 Boruto rows and Black Clover 55-56 vs the one-piece-50 filler + side_source line): the standing T26 adoption sitting — one block ruling, not row by row; types untouched until then.
6. **Crumbs**: ep 106 (Narutopedia: Manga = Naruto ch 700 — a graft or a wiki slip; chain_source or nothing, never an anchor).
