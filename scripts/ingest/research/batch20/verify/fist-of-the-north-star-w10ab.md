# Verifier report — fist-of-the-north-star wave 10, sub-blocks a + b (eps 109-120, lane A2 gap block)

Verdicts: `scripts/ingest/research/batch20/out/fist-of-the-north-star-w10a.json` (rows 109-114)
and `scripts/ingest/research/batch20/out/fist-of-the-north-star-w10b.json` (rows 115-120).
Verifier: claude-fable-5-1 (cross-model vs the two Opus research agents), 2026-09-02.
Method: mechanical row / continue / monotonicity / volume scan across BOTH files (the seam
114/115 is the point of the double dispatch); refetched hokuto.fandom via the MediaWiki API
(chapter pages 136-157 with `vol` / `page` / cast-in-order; 22 character `appearances`
fields; the Filler page; the "Hokuto no Ken episodes" page; the "HnK Chapter 136½"
redirect), RQ87 a.html for all twelve episodes plus the scene transcripts for 114, 115,
117, 119, 120, hokutosite 109-120 (Shift-JIS, iconv). Independent witness the verdicts
used only at structure level: en-WP "List of Fist of the North Star chapters" (volume
boundaries + titles). Both verdicts' anchors were also pushed through
`lib/sliver.ts#sliverStart/sliverEnd` with the neighbouring START to see what the apply
layer would move (answer: nothing). DB untouched; verdict JSONs untouched.

## Recap baseline

Fist of the North Star — stored per the wave-10 contexts: eps 109-120 sit inside the
anchor_gap_research block 109-151 (NO stored anchors inside), fence = ep 108 END 136 [135]
v16 (manual) and ep 152 END 210 (manual). Stored types: 109 filler, 110 canon, 111 filler,
112-120 canon (AFL agrees on all twelve).

| row | stored | verdict | verifier |
|---|---|---|---|
| ep 109 — stored: filler, no anchor | → verdict (a): stays filler, no anchor (A1) | → verifier: CONFIRMED on 3 sources (RQ87 "clip show … absolutely no new animation at all"; hokutosite 「完全総集編」; Filler page "109 - Clip show") |
| ep 110 — stored: canon, no anchor | → verdict (a): END 137 [137] high + divergence{137} + C1 continue 137 | → verifier: SOUND (Joe / Imperial Executioner / Mamu all "ch. 137 / ep. 110" verbatim; ch 137 cast = Toki{Mo}, Kenshiro, Raoh{Mo}, Joe{1st}{Death}, Imperial Executioner{1st}{Death}, Bat, Lin, Rihaku, Mamu{1st}, Kokuoh; RQ87 110 "In the manga … Kenshiro kills him and takes a look at one of the posters. In the anime, this scene doesn't happen" verbatim; hokutosite 112 「司刑隊隊長が、バット等の賞金があがったのを見た後にケンに葬られる場面が削除」 verbatim) |
| ep 111 — stored: filler, no anchor | → verdict (a): stays filler, no anchor (A1) | → verifier: CONFIRMED on 3 sources (RQ87 "This episode is filler, and does not happen in the manga"; hokutosite 「アニメオリジナルストーリー」「北斗の拳２では珍しい完全オリジナルの回」; Filler page "111"); Geld / Muhari / Haru have no manga index |
| ep 112 — stored: canon, no anchor | → verdict (a): END 139 [138] high + divergence{138-139}, no continue | → verifier: SOUND (Bask "ch. 138-139 / ep. 112" verbatim; ch 138 cast Rihaku, Bat, Lin, Bask{1st}, Barona{1st}, Nene, Jun{Death}, Kenshiro, Kokuoh and ch 139 Kenshiro, Kokuoh, Bask{Death}, Barona{Death}, Lin, Rihaku, Bat — exactly as quoted; ch 140 opens with Yuria{Mo} = ep 113's pearl-necklace opener, so no continue owed) |
| ep 113 — stored: canon, no anchor | → verdict (a): END 142 [140] high + divergence{140-142} + parity continue 145 | → verifier: SOUND, one nit on the note (F4) — Geira 140-142/113, Buzori 141/113, Ein 140-160/113-122 verbatim; hokutosite 113 「アインがゲイラ郡都を去った後、賞金首がアスカをねらってくるというシーン削除」 verbatim; RQ87 113 verbatim; ch 142 cast ends Goru{1st}, Kokuoh, Asuka{1st} (the cut tail) |
| ep 114 — stored: canon, no anchor | → verdict (a): END 149 [145] high + rearranged{145-149} + divergence{145-149} + parity continue 146 | → verifier: anchor SOUND (F5 observation); the CONTINUE is off by one — parity = ep 115's START = 145, not 146 (F2) |
| ep 115 — stored: canon, no anchor | → verdict (b): END 147 [145] MEDIUM + rearranged{145-149} + graft{151} + divergence{145-147} + C1 continue 147 | → verifier: SOUND, medium stands (Falco "ch. 145-165 / ep. 115-124" verbatim; Falco{1st} is ch 145's LAST cast entry = the chapter's closing pages = ep 115's first new scene; ch 147 cast Kenshiro, Kokuoh, Solia{1st}, Falco, Bat, Lin, Goru, Buzz, Ein, Gil — Falco/Bat/Lin before the brothers, as the note says; RQ87 118's Shoki-flashback line verbatim for the graft) |
| ep 116 — stored: canon, no anchor | → verdict (b): END 149 [147] high + divergence{147-149} + parity continue 143 | → verifier: SOUND (Buzz 145-148/114-116, Gil 145-160/114-116 verbatim; ch 149 = 涙枯れし猛将！; RQ87 116 "in the manga, Gill lives" verbatim; hokutosite 116 「原作ではギルは生き残るが」 verbatim) |
| ep 117 — stored: canon, no anchor | → verdict (b): END 144 [143] high + rearranged{143-144} + parity continue 150, **volume 16** | → verifier: back-jump REAL and 143 first-time (F3 checks); **volume WRONG — ch 144 is vol 17** (F1) |
| ep 118 — stored: canon, no anchor | → verdict (b): END 151 [150] high + divergence{150-153 w/ 119}, no continue | → verifier: SOUND (ch 150 cast Shoki{1st}{Death}, Jask{1st}, Jakō{1st}, Sheeno{1st}; ch 151 Sheeno{Death} + Yuria{Flash} + Shoki{Flash}; Shoki "ch. 150-151 / ep. 114-118", Sheeno "ch. 150-151", Jask "ch. 150-162" verbatim; all three RQ87 118 quotes verbatim; ep 118 ends on the thrown spear = Sheeno's death = 151's last beat; ch 152 opens with Raoh{Flash} = ep 119's nightmare opener) |
| ep 119 — stored: canon, no anchor | → verdict (b): END 153 [152] MEDIUM under A47 (ch-154 tail named in chapters_adapted) + parity continue 154, **volume 17** | → verifier: A47 hold DEFENSIBLE and strengthened (F3); **volume WRONG — ch 153 is vol 18** (F1); the A47-required `partial` annotation is missing (F3 nit) |
| ep 120 — stored: canon, no anchor | → verdict (b): END 156 [154] high + divergence{154-156}, no continue | → verifier: SOUND (Lui "ch. 156-160 / ep. 120-124" verbatim; ch 156 cast carries Lui{1st} + Jakō{Flash}; RQ87 120 transcript ends on the sisters' reunion; ch 157 "Spill Their Blood!!" is the next chapter; the fandom episodes page really does put the Lui meeting in its ep 121 summary — flag 4 verified, and the per-episode sources + Lui's own index beat the wiki prose) |

## Findings, ranked by damage

### F1 — w10b: two anchor VOLUMES contradict the file's own structure note (REFUTED on 117 and 119)
`ep 117 → 144 [143]` carries `volume: 16` and `ep 119 → 153 [152]` carries `volume: 17`.
The same file's structure note says "v16 = 135-143, v17 = 144-152 ... v18 = 153-161", and
that is right: hokuto.fandom `vol` = 17 on HnK Chapter 144 and 18 on HnK Chapter 153
(refetched); en-WP: Volume 17 = chapters 144-152 opening "A Wanted Man by Choice!",
Volume 18 = 153-161 opening "All to the Heavens!"; the stored boundary table in both
contexts reads `v17: 144-152, v18: 153-161`. The agent took the START's volume on the
only two rows in the block that straddle a volume boundary. The catalog's convention is
the END's volume — three stored straddling anchors prove it: `ep 108 → 136 [135] v16`
(135 is v15), `ep 24 → 27 [26] v4` (26 is v3), `ep 22 → 10 [6] v2` (6 is v1). Damage if
curated as-is: `apply-wave9.ts` line 96 writes `volume: a.volume` verbatim, so both wrong
volumes would render. Fix at curation: ep 117 volume 16 → **17**, ep 119 volume 17 → **18**.
The other eight volumes (110/112/113 v16; 114/115/116/118 v17; 120 v18) all check
against the fandom `vol` field and en-WP.

### F2 — the seam: w10a's ep-114 continue (146) disagrees with w10b's ep-115 START (145) — SOUND WITH CORRECTIONS
w10a set `ep 114 continue 146 (parity)` on a guess it explicitly flagged ("Depends on
ep 115's START, which is the neighbouring sub-block's row"). w10b delivered ep 115
START = 145 and the evidence supports 145, not 146:
- Falco `{1st}` is the LAST entry of ch 145's cast (Kenshiro, Ein, Buzz{1st}, Gil{1st},
  Rihaku, Falco{1st}) and the chapter is titled 金色のファルコ！ — his debut is the
  chapter's closing beat.
- Falco's index: "Manga (ch. 145-165), Anime (ep. 115-124)" (verbatim).
- RQ87's ep-115 transcript: after the recap of ep 114, the FIRST new scene is Falco
  executing the fleeing captain of an abandoned area with Gento Kōken; RQ87 a.html:
  "Falco's scene at the start happens before Solia's debut in the manga" (Solia debuts
  in ch 147, so this is 145/146 material). hokutosite 115: 「市都が、いち郡都に変更。
  伴い、市都の長官も郡都の隊長に変更」 — a restaged version of the manga scene, i.e.
  the same pages.
- The scene is the episode's first new content, not a sliver/teaser, so A10 keeps it as
  the START.
Under C2/C3 the parity continue is the NEXT episode's START, so ep 114's continue should
be **145**, with the note pointing the reader at ch 145's Falco pages (the prison /
Harn-brothers pages of 145 were already restaged in ep 114). w10a's own handoff
paragraph in `structure.notes` names 145 as the alternative and defers to the 115-120
agent; the 115-120 agent answered 145. Curate the continue to 145; nothing else in
either file moves.

### F3 — ep 119 END 153 vs 154 under A47 — SOUND (held), with what I could add
What the sources establish about the ch-154 tail:
- Rihaku is NOT in ch 153's cast (Kenshiro, Falco, Saiya{1st}, Jakō{Flash}, Myū);
  ch 154's cast OPENS with the observers (Gil Harn, Bat, Ein, Lin, Rihaku) and only then
  Falco, Kenshiro. So everything in ep 119 from Rihaku's "both stars were meant to lead
  to the same path" line onward — Falco's blast destroying the nunchaku, Kenshiro's
  counter, the aura release, "the heavens have split", Lin hearing the Emperor — is
  ch-154 material. The verdict's placement is right.
- RQ87's ep-120 transcript opens with a cold-open recap that replays those exact lines
  ("There is certainly no confusion or hesitation…", "The heavens have been split",
  "the celestial emperor is calling for me, and he's crying!") and then continues the
  duel (Gento Hakuka Dan, Shou no Rin, Jouketsukai) — the precise shape A47 was ruled
  for: the tail is the next episode's opener.
- hokutosite 120: 「衝の輪〜上血海の流れは、原作では戦いが始まって直ぐ」 and
  「前回の終わり際にその一撃を貰っているわけではない」; hokutosite 119: 「原作でリンが
  天帝の声を聞くのは戦いが始まって暫く経ってからだが、アニメでは始まってすぐ」 —
  i.e. the manga's fight moves within pages into material ep 120 plays, and the one
  weighty beat in ep 119's tail (Lin) is lifted forward from later in the chapter.
  That is consistent with a short tail, but it is still not a page count; nobody in
  this chain has one.
Verdict: holding END at 153 is defensible and the flag is honest; the alternative
(154 + C1) changes no reader instruction (continue 154 either way). One PROTOCOL nit:
A47 says "the tail stays in chapters_adapted and a `partial` names it" — w10b has no
`partial` annotation for ep 119 (its 118-119 annotation is a `divergence`). Add
`partial {154 (opening exchange — Rihaku's two-stars line, the nunchaku, the heavens
splitting, Lin hearing the Emperor)}` on ep 119 at curation.

### F4 — ep 113's continue note overstates where ch 142's tail goes — nit, value unaffected
w10a: "the rest of ch 142 … are animated later, at ep 117". Loosely true, not literally:
hokutosite 117 ties ep 117's kidnapping to the ch-142 賞金首 scene (「原作でアスカを拐おう
とした賞金首が、ベロンに雇われた賞金稼ぎに変更。原作では失敗するが、アニメでは成功する」)
and RQ87 117 says the episode's events "happen earlier in the manga — starting after
Kenshiro defeats Geira"; but the tail's literal content (Ein racing home, saving Asuka
from bandits, then meeting the army with her) is never animated — ep 117 restages the
premise with the outcome inverted. The continue value 145 is right regardless under
C2 (ch 143-144 demonstrably arrive at ep 117 — Beron "HnK Chapter 144 / ep. 117", Ren
"ch. 144 / ep. 117" verbatim), and w10b's ep-117 START 143 is right (the 142 material
is a restaged premise, not first-time pages; nothing in 114-116 touches 143 — Ein's
appearances there are anime-original stalking). Soften the note at curation.

### F5 — ep 114 END 149 rests on ch 149's OPENING pages — observation, not a defect
Solia `{Death}` is the FIRST entry of ch 149's cast, so ep 114's share of 149 is the
chapter's opening (Solia's death) and the rest of 149 (Falco's dried tears, the title
event) is ep 116's. A47 does not bind — the next episode starts on 145, not 149 — and
"pages, not numbers" makes 149 a real position. The alternative (148 + partial{149})
would not remove the seam back-jump (115 → 147 either way). Solia "ch. 147-149 /
ep. 114", Mamiya "ch. 26-82, 146, 160, 237-245 / ep. 23-58, 65, 114" verbatim;
hokutosite 114's 「今回から帝都編は、原作と比べてえらくイベントの順番がかわります」 and
the three restaged events verbatim. Real reorder, not a transcription error.

### F6 — aside for the parent (P5): the A47 normalizer is a no-op on prose-style records
`trailingSegment` splits on commas outside parentheses; these ten records have no such
commas, so the whole string is one segment and `sliverEnd` reads the LEADING number as
the tail (ep 115 → tail=146, ep 119 → tail=152, both `tail-not-end`). Nothing moves —
the right outcome on this block — but the rule did not decide it; the verdicts did.
Not a verdict defect; noting it so the census `end_sliver_mismatch` class is not read
as having proven these rows.

## What I checked and found SOUND

- **Row accounting**: 10 anchors + 2 A1 statements = all 12 targets, each in exactly one
  bucket. No anchor on 109/111; no `anchor_hostile` needed; T27 vocabulary clean (no
  type corrections proposed, none owed — the Filler page's HnK2 section is exactly
  "111 / 130 / 132").
- **Row identity / scope**: RQ87 prints "Hokuto no Ken 2 episode 5 / Episode 114
  overall" etc.; the fandom episodes page and hokutosite use our cumulative numbers; the
  episodes page header says HnK2 "adapts chapters 137 to 210" = the fence. All ten
  ENDs inside 136..210; 245-chapter WSJ space throughout; no sequel/sibling numbering.
- **Internal consistency**: every `chapters_adapted` agrees with its START/END (119's
  ch-154 mention is explicitly the A47-held tail). Continues: 110→137 (C1, own END),
  113→145 (= ep 114 START), 115→147 (C1 = ep 116 START), 116→143 (= ep 117 START),
  117→150 (= ep 118 START), 119→154 (= ep 120 START) all consistent; only 114→146 is
  off (F2). 112/118/120 correctly owe none (each ends on its chapter's last beat).
- **Monotonicity**: 137, 139, 142, 149, 147↓, 149, 144↓, 151, 153, 156. Both
  back-jumps are real reorders on three sources each and both carry `rearranged`
  (115/116 and 117), as does 114. hokutosite 117 prints the two running orders
  verbatim: 「原作は 全ての郡都と市都陥落 → ファルコによって北斗の軍半壊 → 中央帝都へ /
  アニメでは ファルコによって北斗の軍半壊 → ベロンの郡都おとされる → 中央帝都へ」.
- **Citations**: all 22 `appearances` fields reproduce exactly as quoted (Falco, Solia,
  Mamiya, Buzz Harn, Gil Harn, Beron, Ren, Asuka, Saiya, Lui, Ein, Geira, Buzori, Bask,
  Mamu, Joe, Shoki, Sheeno, Jask, Myū, Imperial Executioner, Jakō); every quoted
  Japanese line on hokutosite 110/112/113/114/115/116/117/118/119/120 is verbatim;
  every quoted RQ87 line is verbatim. Three genuinely independent primary sources; no
  content farms; AFG/AFL used as cross-check only.
- **w10a's 136½ caution**: "HnK Chapter 136½" exists on the fandom only as a redirect
  to "Special Episode"; not in en-WP's tankōbon list; never adapted. Caution stands.
- **w10b's flag 4**: verified — the fandom episodes page's ep 121 summary is where the
  Lui meeting appears; the per-episode transcripts and Lui's own index put it in ep 120.
- **The Jakō / Shoki / Boltz-Taiga substitutions**: Jakō "ch. 150-160 / ep. 110-122",
  Shoki "ch. 150-151 / ep. 114-118", Myū "ch. 152-161 / ep. 118-124" all verbatim and
  consistent with both files' "anime introduces X early" statements.

## Verdict per claim

| claim | verdict |
|---|---|
| 109 filler, no anchor | SOUND |
| 110 → 137 [137] + C1 continue 137 | SOUND |
| 111 filler, no anchor | SOUND |
| 112 → 139 [138] | SOUND |
| 113 → 142 [140] + parity continue 145 | SOUND (note wording, F4) |
| 114 → 149 [145] rearranged | SOUND (F5) |
| 114 continue 146 | SOUND WITH CORRECTIONS → 145 (F2) |
| 115 → 147 [145] medium + C1 continue 147 | SOUND |
| 116 → 149 [147] + parity continue 143 | SOUND |
| 117 → 144 [143] back-jump + parity continue 150 | SOUND WITH CORRECTIONS — volume 16 → 17 (F1) |
| 118 → 151 [150] | SOUND |
| 119 → 153 [152] held under A47 + continue 154 | SOUND WITH CORRECTIONS — volume 17 → 18 (F1); add the `partial{154}` annotation (F3) |
| 120 → 156 [154] | SOUND |
| volumes 16/17/18 vs the stored table | REFUTED on 117 and 119, SOUND on the other eight |

## Verdict on the verdicts

All ten chapter values stand; both filler rows stand on three sources each; the double
reorder is real and correctly annotated on both sides of the seam. Three things must
not pass curation as written: ep 117's volume (16 → 17), ep 119's volume (17 → 18), and
ep 114's continue (146 → 145, the seam the two agents were dispatched to read
independently — they disagreed by one chapter and the 115-120 side is the one the
sources support). Two nits for the apply notes: ep 119's A47 tail needs its `partial`
annotation, and ep 113's continue note should say "restaged at ep 117" rather than
"animated at ep 117" for ch 142's tail.
