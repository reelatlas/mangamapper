# Batch 21 wave 2 — adversarial verification of the flips (verdict-verifier, Fable 5.1; verdicts by Opus)

Scope: the eight ranked claims in naruto-shippuden-w2a / -w2b, the-promised-neverland-w2, black-clover-w2, dragon-ball-z-w2, dragon-ball-w2, inuyasha-w2, fairy-tail-w2, one-piece-w2 under `scripts/ingest/research/batch21/out/`. Every claim was re-read against the primary pages (Narutopedia / blackclover / fairytail / inuyasha / yakusokunoneverland fandom wikitext via api.php, Kanzenshuu, OPwiki, TV Tokyo, Bandai Channel, neverland-anime.com, ja-WP + en-WP live wikitext, AFG live HTML), the stored neighbours were queried read-only, and `mapping.ts` was read for the back-jump question. Scratch: `/private/tmp/claude-501/-Users-sean-Projects-mangamapper/626dada3-d5b3-4dcd-b917-06bf2bdcd5e0/scratchpad/b21w2v/`.

Mechanical sweep (all fifteen w2 files): `validate.ts` — 24 verdicts, 0 failing (wave 1's string `flags_for_sean` defect is gone). No `anime-only-canon` / `anime_only` / `original canon` strings; every annotation kind is in `ANNOTATION_KINDS`; every source-segment annotation carries a `weight:` phrase; every anchor's `chapters_adapted` agrees with its own END (the one START mismatch, one-piece 209, IS the proposed A10 repair); every `type_corrections.type` is canon | mixed | filler; no scope leakage. Continue records use `kind: parity` with C1 wording in the note — the catalog's vocabulary is only `parity | post_series`, so that is the right field value, not a contradiction.

## Findings, ranked by damage

### 1. naruto-shippuden ep 112 filler → MIXED + anchor 318 [317] — evidence SOUND; the anchor is honest under A8/A18 and does NOT poison neighbours, but it turns eps 113-117 into holes unless they are anchored in the same wave; the "arc close" half of the exception is the weak leg

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 56 | mixed · 318 [317] + rearranged | untouched (coverage-set witness: Konoha half only) | confirmed — Narutopedia ep 56 `chapters=317, 318`, summary = shōgi/chakra-blade/leaf training, no Deidara/Tobi |
| 71 | filler + divergence{} | filler; rearranged{316} sliver + partial{312} sliver; note repair on the 57-71 block note | SOUND (AFG row 071 prints `120, 121` — confirmed live; the stored batch-9 note reads `71 mixed` — confirmed) |
| 72 | canon · 314 [312] + rearranged | canon confirmed; recap{312} + divergence{314} | consistent (AFG 072 `10:20-14:25, 18:38-end`, `312, 313, 314` — confirmed live) |
| 73 | canon · 318 [314] + rearranged | untouched (witness) | confirmed — `chapters=314, 318`, no Deidara/Tobi in the synopsis |
| 74 | canon · 319 [318] + rearranged | untouched (witness) | confirmed — `chapters=318, 319`, no Deidara/Tobi |
| 90 | mixed · 343 [343] · cont 343/parity (manual) + divergence + rearranged{343,346,347} | continue-note repair (91-112 → 91-111 + ep-112 clause) | SOUND in substance; the verdict's `old` string omits the stored note's trailing C3 sentence — apply the substance, as the verdict itself says |
| 112 | filler | MIXED · 318 [317] {317-318 Akatsuki thread} v35; partial significant; rearranged{317-318}; cont 343/parity | SOUND on evidence (below); exception half (2) is arguable; display cost stated below |
| 113 | mixed (no anchor) | untouched | Narutopedia `chapters=343,344` — anchorable; see the hole cost |
| 118 | canon · 352 [351] · cont 239/parity | untouched | next anchored row after 112 |
| 176 / 178 / 181 | filler | filler confirmed; partial slivers (450 / 449-450 / 451) | consistent with the wave-1 ep-180 ruling; not re-fetched beyond AFG (176 `1:48-3:58` 450; 178 `18:02-end` 449, 450; 181 `18:15-end` 451 — confirmed live) |

- Evidence, re-fetched: Narutopedia ep 112 `chapters=317, 318`; its synopsis' second paragraph is the Deidara/Tobi lake sequence beat for beat (clay spiders, Tobi fails, C1 flips the turtle, two clay birds tow it). Ch 317 page: "Deidara and his new partner, Tobi, confront the Three-Tails … Tobi runs away in fright, forcing Deidara to intervene"; ch 318: "Deidara and Tobi defeated the Three-Tails and started towing it to the nearest Akatsuki base." AFG live row 112: blue, `13:38 to 17:16 … 17:46 to 19:39, here is the attempt to capture the Sanbi by Deidara and Tobi`, cell `317, 318`. TV Tokyo's archived 332話 synopsis closes 「そしてナルト達の出立の日、湖には三尾を求めてやってきた暁のデイダラとトビの姿があった…。」 — verbatim. ja-WP bolds 帰るべき場所 (legend: bold = 全編アニメオリジナル) — the over-marking the verdict describes.
- SOLE holds: eps 56 / 73 / 74 carry the chapters' Konoha halves only (their synopses contain neither Deidara nor Tobi); eps 91-111 are stored filler, AFG red/N/A; ep 113 opens on 343.
- The exception's half (2): in the source, chs 317-318's Akatsuki thread is a short B-plot (a page or two per chapter by the chapter summaries' proportions) whose "close" is a tailed beast towed away — not a death, a reveal or an arc close of the manga's own arc. The verdict's second route (plain T28 materiality: ~5.5 of ~21 minutes and the episode's climax) is the stronger argument and does not need the exception. Sean's call; the evidence for the presence and soleness is not in doubt.
- A8 / A18 — checked in `src/lib/mapping.ts`: a point below the running envelope (318 after ep 90's 343) is `onTrend=false`; `bridgeable()` refuses to interpolate 90→112 and 112→118 (one on-trend, one off). So the anchor cannot poison 113-117: `canonEpToCh` returns NULL for them (A18's "honest hole"), and `canonEpStartCh` for ep 112 itself returns null and falls back to the row's own START 317. The COST: today eps 113-117 (mixed/canon, unanchored) interpolate between ep 90 (343) and ep 118 (351) and render ≈344-350, which is about right; after the flip they render dashes and become `hole` work-list lines. The Kakashi Gaiden precedent (119-120 → 239-244 between 118's 352 and 121's 353) has NO unanchored rows on either side, so it never paid this cost — it is not a like-for-like precedent on this axis. Mitigation is the one the verdict already proposes for the continue hazard: anchor 113-117 in the same wave (Narutopedia 113 = 343,344; 118 = 351-352 stored), or accept five holes and pin ep 112's continue manually (ep 90's manual 343/parity is the proof a pinned continue survives the healer).
- A44 tension, stated: the verdict refuses ep 71's sole ch-316 shōgi scene under A44 ("acts behind an earlier anchor — ep 74 was at 319") while anchoring ep 112's 317-318 which sit behind the same ep 74. T28's sliver clause draws exactly that line by WEIGHT (a sliver never anchors; a significant beat anchors unless it relocates the reader), and the stored Kakashi Gaiden anchors are the precedent for a significant jumped-back block — so it is internally consistent, but it means Sean is again choosing "anchor significant jumped-back blocks" as the display policy.
- Shape: the ep-416 citation in the w2b file points at "Papa's Youth", which is ep 419's page; the real ep-416 page ("The Formation of Team Minato") has no `chapters` field — verified myself, harmless. The five confirmation entries share one 5-row note blob and `why` strings that end in "— " (truncated) — cosmetic.

### 2. naruto-shippuden ep 417 filler → MIXED + anchor 666 [666] — SOUND; eps 460 / 461 mixed → FILLER with the manual anchors DELETED — SOUND, provenance confirmed

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 415 | mixed · 666 [665] {665-666} (manual, no continue) | continue 666 (C1); chapters_adapted note repair | SOUND (Narutopedia ep 415 summary ends "Kakashi runs to Obito's side … remembering the old times"; AFG 415 `1:30 to 13:09`, `665, 666`) |
| 416 | filler | untouched (witness) | confirmed — Narutopedia "The Formation of Team Minato" has no `chapters` field; AFG 416 red N/A; ja-WP bold |
| 417 | filler | MIXED · 666 [666] {666 closing third} v69; partial significant; divergence (chapters null); cont 667/parity | SOUND |
| 418 | canon · 668 [667] | untouched | confirmed `chapters=667, 668`; AFG plain `667, 668` |
| 429 | filler | filler confirmed; graft{678} sliver | consistent (ja-WP bold; AFG `0:00 to 0:30` per the verdict — not re-fetched) |
| 459 | canon · 681 [679] · cont 681/parity (healer) + rearranged{679-681} | continue-note repair; group annotation narrowed to 459/462(/463) | SOUND — value 681 stays right via ep 462; the note's "ep 460 finishes it" becomes false |
| 460 | mixed · 681 [681] (manual, batch 15) · cont 681/parity + rearranged{679-681} | FILLER; anchor DELETED (A1); graft{681 frame} sliver | SOUND |
| 461 | mixed · 681 [681] (manual, batch 15) · cont 681/parity + rearranged{679-681} | FILLER; anchor DELETED; same graft | SOUND |
| 462 | mixed · 681 [681] (manual) + rearranged | untouched (the row that adapts 681's narration) | confirmed — AFG 462 blue `10:40 until the end … read manga 681` |
| 463 | canon · 683 [681] · cont 684 | untouched | closes the zone |
| 469 | mixed | FILLER | consistent (Narutopedia no chapters/arc field per the verdict; ja-WP bold confirmed; AFG red N/A confirmed) |

- 417: Narutopedia ep 417 `chapters=666`; its summary's present-day close — "Madara launches two orbs … Obito, with Kakashi's help, transports himself to the other dimension … convincing Sakura … begins transferring the tailed beasts' chakra to Naruto … Guy arrives in the nick of time" — is exactly the text of the ch-666 page AFTER its `<section end>` at "As Kakashi rallies to Obito's side". AFG live: 417 blue `16:54 until the end`, chapter cell N/A. ja-WP: 417 お前はバックアップだ unbolded, 416 結成・ミナト班 bolded. TV Tokyo 第637話 closes 「――そして舞台は戻りマダラと対峙するオビトとカカシ。二人の最後の作戦が今始まる!!」 — verbatim. Sole and load-bearing (the transfer that revives Naruto begins; Guy's arrival opens the Eight Gates run). Anchors 415 → 666, 417 → 666, 418 → 668 monotone. Safe as a block: type + anchor + partial + divergence + the 417 continue + the 415 continue/note repair.
- 460 / 461: Narutopedia's ep-460 and ep-461 summaries open on one clause of Black Zetsu narration and are otherwise entirely Tenji / Aino / Suzaku / Genbu / the Land of That / Gamamaru / Haori / the Memory Stone; the ch-681 page's own summary contains none of it (681 = Kaguya's attack, Amenotejikara, the portal, Black Zetsu covering the pair and telling how he came to be and steered shinobi history, Kaguya's hatred for her sons, the pair freeing themselves). AFG live: 459 plain `679, 680, 681`; 460 red N/A; 461 red N/A; 462 blue 681 — a discriminating column. ja-WP bolds 大筒木カグヤ and ハゴロモとハムラ, leaves はじまりのもの and 造られた過去 unbolded. TV Tokyo 第680話: 「…大筒木カグヤが天から舞い降りた。…皇であるテンジは…」 — Tenji and the 祖の国 as claimed.
- Provenance, confirmed on disk: `scripts/ingest/research/batch15/out/naruto-shippuden.json` lines 24-25 mint both anchors as "Recorded as a 681-frame anchor per the stored 459-462 stretch annotation" with sources disagreeing and confidence medium; the stored anchor notes carry that text verbatim. The verdict's account of the provenance is accurate; the deletion is a rule change (the sliver clause) applied to a pre-sliver-clause promotion, which is what the clause's own text requires.
- Post-deletion coverage: 459 → 681 [679], 462 → 681 [681], 463 → 683 [681] — nothing strands; the 459 continue value 681 stays correct (healer-owned; its note needs the verdict's rewrite). The `repairs` entry `field: "annotation (group)"` is not a real field — the apply layer must delete the 460/461 rows of the stored `rearranged{679-681}` annotation and rewrite the note on 459/462. Residual not re-checked: that ep 460's closing beat (chakra fruit → Rinne Sharingan → Infinite Tsukuyomi) duplicates ch 670-671 / eps 420-421 — it does not change the outcome (it is not ch 681 content either way).
- Safe: both deletions + both type flips + the graft annotation + the 459 note repairs, as one block.

### 3. the-promised-neverland eps 21 / 22 filler → MIXED + anchors 154 [153] / 170 [166]; 20 stays filler — SOUND on the content (third leg confirmed); one annotation REFUTED in its chapter attribution; pin both continues manually

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 15 | mixed · 50 [null] | untouched | previous anchor |
| 16-19 | mixed / mixed / canon / mixed, no anchors + divergence{compresses ch 53-181} | untouched; flagged as an interpolation zone | agreed — after ep 21 lands they interpolate 50 → 154; the verdict's unresolved (1) is real |
| 20 | filler + divergence{compresses ch 53-181} | filler confirmed; loose_parallel{143-144}, loose_parallel{151-152}, graft{154}, divergence{119,124} | SOUND (fandom `adaptation_of` 145-153 confirmed; AFG cell identical; licensor EP8 「ノーマンがラムダで実験をされていないというのは嘘だった」 confirmed) |
| 21 | filler + divergence{…} | MIXED · 154 [153] {153, 154 (opening)} v18; divergence{153,154}; rearranged{165} sliver; loose_parallel{155-159} sliver; divergence{154,161}; cont 154 (C1) | SOUND on evidence; type is Sean's; continue must be pinned manual |
| 22 | filler + divergence{…} | MIXED · 170 [166] {166-170} v19; abridged{166-170} significant; divergence{166,167}; divergence{165}; graft{171} sliver single-source; cont 171 (C1) | anchor SOUND; graft{171}'s chapter attribution UNPROVEN (below); continue must be pinned manual |
| 23 | mixed · 178 [172] {172-176, 178} + divergence{177,179-181} + rearranged | untouched | monotone with 22 → 170 |

- One-lineage premise, confirmed live: AFG's yakusoku-no-neverland table prints `20 = 145…153`, `21 = 153, 154, 159`, `22 = 165…170`, `23 = 172…178` with NO class attribute on rows 19-23 (my parse found none), and its header note reads verbatim "…the main ones being the omission of the Goldy Pond Battle Arc (chapters 75-95) and the battle against the demon queen and her nobles". The fandom's `adaptation_of` fields are token-identical. So the T4 flag's "AFG canon" side was an absence-of-class read, as the verdict says.
- Third leg, confirmed: neverland-anime.com EP9 「エマは、今からでも絶滅を止めるようノーマンを説得するが、ノーマンはエマの言葉を聞き入れない。そんなノーマンにエマは、彼の本心を見透かすように声をかける。」 = ch 153 ("Emma and Ray in unison tell Norman he's not alone … Norman finally breaks down"); EP10 = the balloon leak, Vincent's staged betrayal, the shipment, Jemima taking Emma's message, the elevator, 「グランマとなったイザベラ率いる武装した大勢のシスターとピーターに行く手を阻まれる」 = ch 166-169's spine; en-WP's per-episode summaries match. Fandom ch 153 / 154 / 166 / 167 / 168 / 169 / 170 summaries carry the beats claimed (blackout, system hack + lured guards, the triple-lock standoff, Mamas summoned, Isabella turns her gun on Peter, the Mamas' pre-planned betrayal). Ch 165's second half — Peter and Isabella on Λ-7214 rising again and the farms converted — is on the fandom's ch-165 page, so the ep-21 `rearranged{165}` sliver is supported; ch 165's first half (Isabella's confinement and promotion) is only mentioned in ep 22, so START 166 is right.
- REFUTED as stated: the ep-22 `graft{171}` note says ch 171 carries "Peter tries to trigger the Mamas' heart chips 'but the system is still down'". The fandom's ch-171 page is the Royal Capital (Leuvis, Palvus, the evil-blood truth) plus Emma behind Peter; no "chip" appears in the ch 168-171 summaries at all. So en-WP's chip line is UNPLACED on the chapter pages — the annotation should not name 171 as proven; reword to "single-source (en-WP) beat, chapter unplaced" or drop it. The anchor is unaffected (END held at 170 either way). Conversely the episode's closing beat — Emma proposing a truce to Peter — matches ch 171's last beat / ch 172's opening and IS in the fandom's ep-22 plot; holding END at 170 with the stored ep-23 START at 172 remains the conservative and consistent choice.
- Continue hazard: both continues are C1 in-chapter values (154, 171) explicitly meant NOT to skip the never-adapted 155-165 / 171. `kind: parity` is the right vocabulary, but a healer-owned parity continue on ep 21 would land on ep 22's START (166) and hand the reader a skip over chapters no episode shows. Pin both at the manual tier (the naruto ep-90 manual continue is the proof that survives the healer).
- Zone annotation: narrowing the stored `divergence{compresses ch 53-181}` from 16-22 to 16-20 is sensible once 21/22 carry anchors.

### 4. black-clover eps 85 / 88 canon → MIXED, 86 canon → FILLER with anchor + continue deleted — SOUND; the ch-133 partition holds on the character-page refs

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 67 | canon · 103 [102] (afg) | canon confirmed; page enrichment; divergence{102-103} | SOUND (AFG 067 blue `00:34 to 20:46`, `102, 103` — confirmed live) |
| 84 | canon · 133 [132] (afg) · cont 133 | untouched | holds ch 133 p.3-5 (Zora `{{Ref|ch=133|p=3-5|ep=84}}`) |
| 85 | canon · 133 [133] (afg) · cont 133/parity (healer) | MIXED; anchor confirmed {133 (p.6-9)}; partial significant; divergence{133}; continue note re-stated (next canon row = 87) | SOUND on evidence; the standing is the half-original-episode judgment |
| 86 | canon · 133 [133] (afg) · cont 133/parity (healer) | FILLER; anchor + continue DELETED; graft{133 (p.10)} sliver; divergence{133} | SOUND — deletion lossless |
| 87 | canon · 134 [133] (afg) | untouched | holds ch 133 p.10-19 + ch 134 |
| 88 | canon · 135 [135] (afg), cont 138/parity (healer) | MIXED; anchor confirmed {135 (p.1-17)}; partial significant; divergence{135}; cont 138 | SOUND on evidence; same judgment as 85 |
| 91 | canon (no anchor) | flagged (ch 136 per Mereoleona refs) — not delivered | queue item, agreed |

- Refs, re-fetched verbatim: Vanessa `{{Ref|ch=133|p=6|ep=85}}` and `p=13|ep=87`; Charmy `p=7-8|ep=85`; Magna `p=7|ep=87`, `p=10-14|ep=87`; Luck `p=7|ep=87`, `p=10-14|ep=87`, `p=15-19|ep=87`; Mereoleona `p=10-18|ep=86|ep2=87` (the shared ref, on the sentence "Mereoleona barges into the Black Bulls' base … carries off Asta, Noelle, and Luck … Zora drops in late"), `p=12-13|ep=87`, `p=16|ep=87`; Zora `p=3-5|ep=84`, `p=5|ep=87`, `p=17-19|ep=87`, `p=19|ep=87`. Ch 135's page: six inline refs all `ep=88`, infobox `episode = Episode 88` alone. Ch 133's infobox lists episodes 84 / 85 / 86 / 87 — the verdict said the chapter page has no `ep=` inline refs (true) but did not mention its infobox names ep 86; consistent with the one-minute tag, not a counter-witness.
- So ep 86's only credit is the SHARED Mereoleona ref; ep 87 holds p.10-19 on five character pages, and TV Tokyo's #87 opens on Mereoleona's arrival (「突然“黒の暴牛”団のアジトを訪れたメレオレオナ団長に連行されてしまった!?」) while #86 describes nothing but the flashback (Julius's mission, the split search, Yami meeting the bandits). Goht's infobox: `manga=` empty, `anime= Episode 86` — verbatim. AFG live: 085 blue `03:08 to 08:18` 133; 086 blue `20:40 to the end` 133; 087 plain `133, 134`; 088 blue `13:20 to the end` 135. Ep 88's fandom character list includes Fuegoleon, Leopold and Secre (Nero) — verified.
- Nothing strands: 84 END 133 [132], 85 END 133 [133], 87 END 134 [133]. Safe: ep 86 type + anchor/continue deletion + graft, with a T6 type pin so the afg writer's A1 gate blocks the re-mint; ep 85's continue-note repair; ep 88's new 138 continue. Eps 85 / 88 → mixed: evidence sound, the standing is Sean's — and it is the SAME fork as dragon-ball 34 (a story-carrying original act of comparable length beside a full chapter), so rule it once. Landing the page-enriched anchors means re-delivering afg-tier rows at the manual tier (P8).

### 5. dragon-ball-z ep 118 canon → MIXED (anchor kept) and dragon-ball ep 34 canon → MIXED — SOUND on evidence; standings are Sean's

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 107 | canon · 329 [329] (afg) · cont 329/parity (healer: "ep 118 finishes it") | untouched | Kanzenshuu ep 107 `Chapter 329 (Pages 1-4) · Partial Filler · Chapter 329 (Pages 5-10)` — confirmed |
| 118 | canon · 329 [329] (afg) | MIXED; anchor confirmed {329 (p.11-14)}; partial significant; divergence{329}; cont 330 | SOUND on evidence; exception half (2) is the fork |
| 119 | canon · 331 [330] | untouched | starts 330 — A47 clean |
| 17 | mixed · 210 [210] (afg) · cont 210 | mixed confirmed; page enrichment | consistent (AFG 017 red `*Filler` 210 — confirmed live) |
| 174 | filler | filler confirmed; graft{394 (p.7)} sliver | consistent (AFG 174 blue `21:13 to the end`, EMPTY cell — confirmed live) |

| ep (dragon-ball) | stored | → verdict | → verifier |
|---|---|---|---|
| 29 | mixed · 54 [54] | untouched | ch 54 exhausted |
| 30-33 | filler | untouched | confirmed as the anime-original block |
| 34 | canon · 56 [55] (afg) | MIXED; anchor confirmed {55, 56}; partial significant; divergence{55}; cont 57 | SOUND on evidence; the seam-episode fork |
| 35 | canon · 57 [57] | untouched | clean boundary |

- DBZ 118, verbatim: Kanzenshuu ep 118 `Corresponding: Mostly Filler – Written by Takao Koyama · Chapter 329 (Pages 11-End)`; ch 329's corresponding DBZ episodes = 107 and 118 only, Pages 01-14; dragonball.fandom Differences: "All events prior to Gohan and the others sensing Frieza's presence are exclusive to the anime."; Major Events "Vegeta returns to Earth. The warriors of Earth sense the incoming Frieza and King Cold."; AFG 118 blue `18:37 to the end` 329. Sole holds; whether "Freeza survived and is descending on Earth" is a major plot point is the exception fork the verdict names — I read it as a genuine arc-opening reveal. If declined, ep 107's continue note must be rewritten.
- DB 34, verbatim: Kanzenshuu ep 34 `Half Filler Episode – Written by Keiji Terui · Chapter 055 · Chapter 056`; ch 55 and ch 56 each correspond to ep 34 alone; fandom Differences: "The opening scenes of the episode with Colonel Silver's men searching the river for the Dragon Ball and Goku's time with the monkeys are exclusive to the anime."; AFG 034 blue `from minute 7:55 to the end` with the Silver-recognises-Goku continuity note. Trivial prose slip: the verdict says Goku finds the "Six-Star Ball"; the fandom's Major Events says the Five-Star Ball — not in any field.

### 6. inuyasha eps 147 / 148 mixed → FILLER — SOUND; ep 62 canon confirmed — SOUND, but do not apply its `unverified` entry

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 62 | canon · 198 [197] (afg) · cont 201/parity (healer) | canon confirmed (T6 pin); anchor re-delivered; divergence{198 closing} sliver; unverified{198 closing}; continue-note repair (value 201 unchanged) | type + anchor SOUND; `unverified` should NOT be applied |
| 146 | canon · 303 [301] (afg) | untouched | closes the zone |
| 147 | mixed | FILLER; recap{1-2, 65-71} + divergence (retelling) | SOUND |
| 148 | mixed | FILLER; same | SOUND |
| 149 | canon · 306 [303] (afg) | untouched | closes the zone |

- Verified: inuyasha.fandom Episode 147 and 148 infoboxes `chapter= (Anime Only)`; Shako `anime debut = 147` with no manga field; Three-Eyed Spider `anime debut = 147`, `manga =` empty; Tsubaki trivia "She places a curse on Kikyō in the anime …"; ja-WP's 各話 table gives 第147話/第148話 one rowspan with 原作 = `TVオリジナル` and 第149話-157話 = `31巻5話-33巻8話`; AFG 147 / 148 red `* Filler N/A`. Stored 146 → 303 and 149 → 306 [303] close around the pair with no gap. Safe.
- Ep 62: AFG row 62 note verbatim "* The ending was changed, in the manga Tsubaki loses the battle and Naraku's insect comes out of her eye and takes the Shikon pearl (You can watch it in manga 198)." with `197, 198` and no minute range — the parser-gate finding (blue without "Mixed"/a window = a divergence flag) is real. ja-WP 第60-62話 = `20巻4-10話`, 第63-65話 = `TVオリジナル` — verified. The stored continue note's "chs 199-200 not yet seen" is indeed false (ja-WP 第55話 = 21巻1-2話 per the verdict; not re-fetched). Vocabulary defect, same as wave 1's fairy-tail 246: `unverified` is the case where an anchor lands BECAUSE a share cannot be sized and it creates an `unverified_share` queue row; ep 62 is a canon row with a full two-chapter anchor — the divergence's length is a completeness gap, not an unverified share. Do not apply it.

### 7. fairy-tail ep 69 — NEW anchor 165 [165] {165 p.1-16} inside the 68 → 76 gap — SOUND

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 68 | canon · 164 [163] (afg) | untouched (continue → 165 downstream) | fandom `Adapted = Chapter 163 / Adapted 2 = Chapter 164` — confirmed |
| 69 | mixed (no anchor) | mixed confirmed (T6 pin); NEW anchor 165 [165] {165 (p.1-16)} v20; partial significant; divergence (anime-original second act); cont 165 | SOUND |
| 70-75 | filler | untouched | AFG red; ja-WP bolds 70-72/74-75, not 73 (verified for 73) |
| 76 | canon · 166 [165] (afg) | untouched | fandom `Adapted = Chapter 165 (from page 17) / Adapted 2 = Chapter 166` — confirmed |

- Verified verbatim: Episode 69 `Adapted=[[Chapter 165]] (to page 16)`; Episode 76 `Adapted=[[Chapter 165]] (from page 17)` + `Chapter 166`; Chapter 165 `volume=#20`, `relepisode=Episode 69 / Episode 76`, and its summary (Gemini/Aries/Scorpio, the guild's welcome, the Sky Dragon Slayer reveal, Gajeel's cat envy, Mystogan on the balcony, then "a few days later … Gildarts is back") matches the ep-69 summary's first act and hands the bells to ep 76. Bandai Channel 第69話: 「『妖精の尻尾』に久しぶりに帰ってきたナツ達。…ウェンディとシャルルも仲間に加わる事になり、盛り上がるギルド！ 数日後、…グレイが驚くべき情報をもたらす。」 — verbatim. ja-WP bolds 竜の誘い and not 虹の桜 — the dissent is real and the verdict states it. AFG 069 red `* Filler N/A`, 076 `165, 166`. Anchors 68 → 164, 69 → 165 [165], 76 → 166 [165] monotone; A47 does not bite (16 pages, the chapter's head). Safe: type pin + anchor + partial + continue.
- Shape: the `divergence` entry's `chapters` is prose ("no source chapters — anime-original second act") — apply with `chapters` null (naruto 417's divergence has the correct null shape; inuyasha 147/148's divergence has the same prose defect).

### 8. one-piece ep 209 START 306 → 307 (A10) — SOUND and mechanical

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 208 | canon · 306 [305] (afg) · cont 306/parity (healer) | untouched (keeps END 306 — owns p.1-16) | OPwiki `Episode 208 = Kapitel 305 (S. 6-19), Kapitel 306 (S. 1-16)` — confirmed |
| 209 | canon · 307 [306] (afg) | canon confirmed; START → 307; {306 (p.17-19), 307}; partial{306 p.17-19} sliver; divergence{307-308} | SOUND |
| 210 | canon · 309 [308] (afg) | canon confirmed; page enrichment | consistent |

- OPwiki `Episode 209 — Umgesetzte Kapitel: Kapitel 306 (S. 17-19), Kapitel 307` — verbatim. Three pages is under A10's ≤5-page bar; START 307. The stored row is afg-tier, so the repair must land at the manual tier (P8) or the next re-derive restores 306. Low priority, as the verdict says; the display already derives ep 209's start as prevEnd+1 = 307 from ep 208's END, so the visible effect is nil.

## What is safe to apply

- **Safe as delivered:** naruto 417 block (type + anchor + partial + divergence + cont 667 + the 415 C1 continue and note repair); naruto 460 / 461 block (types + both anchor deletions + graft + the 459 note repairs, with the 460/461 rows of the stored `rearranged{679-681}` annotation deleted rather than "narrowed" as a field); naruto 71 / 72 / 176 / 178 / 181 confirmations and slivers + the 57-71 block-note repair; inuyasha 147 / 148 → filler with both annotations; inuyasha 62 canon pin + divergence + the continue-note repair (value unchanged); fairy-tail 69 pin + anchor + partial + continue (divergence with `chapters` null); black-clover 86 → filler + anchor/continue deletion + graft + T6 type pin, the 85 continue-note repair, the 88 continue 138, and the 67 confirmation; one-piece 209 START 307 at the manual tier; TPN 20's confirmation and slivers.
- **Safe IF Sean takes the standing:** naruto 112 → mixed + 318 [317] + rearranged — ONLY as a block with eps 113-117 anchored (or the five holes accepted and the 343 continue pinned manually); black-clover 85 / 88 → mixed and dragon-ball 34 → mixed (one ruling on the half-original / seam shape covers all three); dragon-ball-z 118 → mixed under the exception (rewrite ep 107's continue note if declined); TPN 21 / 22 → mixed + anchors, with BOTH continues pinned at the manual tier and the ep-22 `graft{171}` reworded to "chapter unplaced" or dropped.
- **Do not apply as delivered:** inuyasha 62's `unverified{198}`; the prose `chapters` on the fairy-tail 69 and inuyasha 147/148 `divergence` entries (null them); TPN 22's `graft{171}` as a proven ch-171 attribution; naruto-w2b's `annotation (group)` repair as a field write.
- **Shape / apply notes:** naruto-w2a ep 90 continue-note `old` omits the stored C3 sentence — apply the substance; naruto-w2a's five confirmation entries share one note blob with truncated `why` strings (cosmetic); black-clover-w2's hostile/repair entries duplicate `reason` / `why`; enrichment of afg-tier anchors (black-clover 67/85/88, dbz 17/118, db 34, inuyasha 62, one-piece 209-219, 886) lands at the manual tier or is lost on re-derive (P8).
