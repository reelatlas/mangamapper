# Verifier report — fist-of-the-north-star wave 6 (eps 29-56, lane A2 gap block)

Verdict: `scripts/ingest/research/batch20/out/fist-of-the-north-star-w6.json`
Verifier: claude-fable-5 (cross-model vs the Opus research agent), 2026-08-28.
Method: mechanical row/monotonicity scan; refetched hokuto.fandom via the
MediaWiki API (16 character pages, 27 chapter pages), RQ87 eps
29/37/43/44/47/53-58, hokutosite (Shift-JIS, iconv) eps 029/030/037/042/043/
047/053-058; independent sources the verdict did NOT lean on per-row:
en-WP "List of Fist of the North Star chapters" (volume boundaries + titles)
and ja-WP 北斗の拳(テレビアニメ) 各話リスト (episode titles/dates). DB untouched.

## Recap baseline

Fist of the North Star — stored per the wave-6 context: eps 29-56 are the
anchor-gap block (NO stored anchors inside), 26 canon/mixed targets, 38/41
filler by type; fence = ep 28 END 36 (manual, wave 3) and ep 57 END 83
(manual, batch 6).

| row | stored | verdict | verifier |
|---|---|---|---|
| ep 29 — stored: canon/mixed, no anchor | → verdict: END 38 [36] high + rearranged{36} | → verifier: CONFIRMED (Jagi ch 38-44/ep 29-32; hs029 ゴジバ line verbatim; RQ87 "fight with Gojiba happened earlier"; "pages, not numbers" applied correctly vs fence END 36) |
| ep 30 — stored: canon/mixed, no anchor | → verdict: END 39 high + graft{41} | → verifier: CONFIRMED (ch 39 cast has Yuria; hs030 組手 line verbatim; A4 graft handling matches the ep-102/ch-129 precedent) |
| ep 31 — stored: canon/mixed, no anchor | → verdict: END 41 [40] high | → verifier: CONFIRMED (Aki ch 40-41/ep 31; ch 41 cast = Ken, Aki, Mako, Ryūken, Jagi exactly as cited) |
| ep 32 — stored: canon/mixed, no anchor | → verdict: END 44 [42] high | → verifier: CONFIRMED + independent: ja-WP ep 32 title 怒拳四連弾…, en-WP ch 44 "Four Strikes of Fury!!" — title identity holds outside the verdict's sources |
| eps 33-36 — stored: canon/mixed, no anchors | → verdict: ENDs 45/47/49/51 high | → verifier: CONFIRMED (Haystack 45/33, Habu 46-48/34-35, Nevada 50/36, Amiba 45-51/33-36 — all reproduce exactly) |
| ep 37 — stored: canon/mixed, no anchor | → verdict: END 53 [52] MEDIUM + C1 continue 53 | → verifier: CONFIRMED (Zakoru ch 52/ep 37; ch 53 cast carries Yuria {Flash} + Uighur {1st} — the shelter flashback and the replaced Uighur intro are both really ch-53 pages; hs037 + RQ87 verbatim) |
| ep 38 — stored: filler | → verdict: stays filler, graft{54, 60-61 fragments} | → verifier: CONFIRMED shape (Filler page: "38 - With the exception of the scene of the Sūzan Tsūhi Ken master"; hs043 confirms that scene deleted from ep 43); fragment chapter numbers honestly marked as inference in the annotation |
| eps 39-40 — stored: canon/mixed, no anchors | → verdict: ENDs 55/57 high | → verifier: CONFIRMED (Raiga & Fuga ch 54-58/ep 39-43, Mitsu ch 55-58/ep 39, Uighur ch 53-57,59/ep 37-42; en-WP ch 54 "Open the Gate of Death!") |
| ep 41 — stored: filler | → verdict: stays filler, graft{58} | → verifier: CONFIRMED (Filler page: "41 - Clip show until Zarqa and Qasim show up at the end"; Zarqa ch 58-59/ep 41-42) |
| ep 42 — stored: canon/mixed, no anchor | → verdict: END 59 [58] high + C1 continue 59 | → verifier: CONFIRMED (hs042 「獄長が起き上がるシーンは今回は無し。次回に。」 verbatim) |
| ep 43 — stored: canon/mixed, no anchor | → verdict: END 60 MEDIUM + rearranged{59} + graft{61} + parity continue 61 | → verifier: CONFIRMED (hs043 「…原作では虎殺しの試験後」 verbatim; RQ87 ep 44 "used in the previous episode"; the 60-vs-61 fork is correctly surfaced in flags_for_sean rather than decided silently) |
| ep 44 — stored: canon/mixed, no anchor | → verdict: END 62 [61] high | → verifier: CONFIRMED, one NIT (F3): ep 44's title is 死兆星輝く!…, ch 62's is 死兆星の蒼光！ — shared keyword, not "=" as the note claims. Value unaffected (ch 61 is the only Ryūken-cast chapter in the stretch; Seeker {1st}{Death} in ch 62) |
| eps 45-46 — stored: canon/mixed, no anchors | → verdict: ENDs 63/65 high | → verifier: CONFIRMED (en-WP v8 opens "063. The Little Hero!"; Gallon 63-65/44-46, Dekai Babaa 64/46, Kokuoh 65-238/46-152) |
| ep 47 — stored: canon/mixed, no anchor | → verdict: END 68 [66] MEDIUM | → verifier: value STANDS but one cited claim is NOT in the source (F2, see findings) |
| eps 48-52 — stored: canon/mixed, no anchors | → verdict: ENDs 70/72/74/75/77 high | → verifier: CONFIRMED (ch 69 cast carries Ryūken; ch 74's fandom summary ends on the exact quoted line; Galf & Seki 73-75/50-51; Yuda opens ch 75/ep 51; Zorige anime-only ep 51; Arisa 76/52; Dagar 76-78/52-53) |
| ep 53 — stored: canon | → verdict: type_correction → FILLER + graft{78}, NO anchor (A1), would-be anchor parked in flags | → verifier: CONFIRMED, T28 met on three independent sources (Filler page "53 - Except when Yuda kills Dagarl at the end"; hs053 「…以外は全てアニメオリジナル」 verbatim; RQ87 "Most of this episode is filler") |
| ep 54 — stored: canon | → verdict: type_correction → MIXED + partial{78-79}; anchor END 79 [78] MEDIUM kept + C1 continue 79 | → verifier: CONFIRMED (hs054 names exactly the two manga scenes, verbatim; RQ87 agrees; Komaku 78-81/54-56; mixed rows take anchors) |
| ep 55 — stored: canon/mixed, no anchor | → verdict: END 81 [80] high + rearranged{80} + C1 continue 81 (with the C3 read-now note for the cut betrayal pages) | → verifier: CONFIRMED (ch 80 cast carries Raoh AND Shin — the betrayal flashback; hs055 「ユダが六聖拳の崩壊を導いたとレイが語るシーン削除」; ch 81 = the dam chapter, en-WP "The Waterfowl Flies No More!") |
| ep 56 — stored: canon/mixed, no anchor | → verdict: END 82 [81 cont.] high + C1 continue 82 | → verifier: CONFIRMED (ch 81's fandom summary carries Komaku's defeat AND the dam sealing; ch 82 cast = Yuda {Death}, Rei {Death}; hs056/RQ87 poison detail verbatim) |
| ep 57 — stored: manual anchor END 83 (type NOT STATED by the verdict) | → verdict: REPAIR end_chapter 83 → 82; continue 83 kept; no type statement | → verifier: the 83→82 EVIDENCE is verified and could not be refuted; the DISPOSITION has an unstated fork (F1, the main finding) |
| ep 58 — stored: canon/mixed? {83 partial} (batch 17) | → verdict: flag only (out of ask): the one manga sequence is ch 80's betrayal passage; likely filler-or-mixed + rearranged{80}, no ch-83 anchor | → verifier: FLAG IS RIGHT on all three sources; one caution added (F5) |

## Findings, ranked by damage

### F1 — ep 57: the repair may actually be a DELETION; the verdict never states the row's type (the one substantive finding)
The 83 → 82 evidence is solid and I could not refute it: Rei's index is
Manga ch. 26-82 / Anime ep. 23-57 (refetched); ch 82's cast carries both
deaths; ch 83 is Souther-arc (Taka {1st}, Bull {1st}, no Rei) and Taka/Bull
index at ep 59 where ch 83 is already stored; hokutosite 057
「原作のレイは、部屋に入って直ぐ扉の付近で爆死」 and RQ87 "In the manga, Rei dies
seconds after entering the house. The anime adds all of those flashback
scenes" — both verbatim. Vol 10 for ch 82 confirmed (fandom + en-WP 81-89).

BUT: the fandom Filler page lists **"57 - Clip show until Rei's death at the
end"** — the SAME list and the SAME shape as ep 41 ("Clip show until Zarqa
and Qasim show up at the end" → kept filler + graft, no anchor) and ep 53
("Except when Yuda kills Dagarl at the end" → retyped filler + graft, anchor
withheld under A1). The verdict's own repair text calls ep 57 "a clip show
whose single manga beat is Rei's death" and then MOVES the anchor instead of
asking whether the row can carry one at all. If ep 57's stored type is canon
and T28 is applied the way this same verdict applies it to eps 41/53, the
honest outcome is 57 → filler + graft{82} and A1 deletes the anchor (the
Toriko 263→253-answered-with-DELETION precedent), with ep 56 END 82 as the
stretch's terminal and the continue unchanged (inside/after ch 82 → 83). If
instead the first-time death pages make it mixed under "pages, not numbers"
(the claymore-24 / zatch-139 shape), the repaired anchor 82 stands. Both are
defensible; the verdict silently assumes the second without stating the
row's stored type or the fork. What settles it: one read of ep 57's stored
type at curation + Sean's T28 call. Damage if curated as-is and the answer
is filler: a rendered anchor on a filler row — the exact A1 class this
project treats as its worst defect.

### F2 — ep 47: one evidential sentence attributed to RQ87 is not on the page
The note says "Toki and Mamiya, in ch 68's cast, are shown nearing the
village — RQ87 notes they can see the village barrier at this episode's
end." I fetched rq87.flyingomelette.com/HNK/1/47/a.html in full: no
"barrier", no Toki/Mamiya-approach anywhere (synopsis, manga differences,
notes, errors); hokutosite 047 has nothing of the kind either. The END 68
itself still stands on real evidence — ep 47's synopsis carries the
Shinkesshu / three-days-to-live beat (ch 68 血を呼ぶ宿命; Toki and Mamiya ARE
in ch 68's cast), ch 69 is pinned to ep 48 by Ryūken's cast entry, and RQ87
calls ep 48 a near-exact adaptation. The row is already medium and its note
concedes the ch-68 boundary is "the one inference here." So: correct value,
fabricated/misremembered citation. Curate the value; strike the sentence.

### F3 — ep 44 nit: title "=" overstated
Ep 44 = 死兆星輝く!…（ja-WP）; ch 62 = 死兆星の蒼光！. Shared keyword, not
identity. Nothing else rests on it.

### F4 — air-date aside: quotes verified, tally framing shouldn't be read as settling the open wave-4 flag
hokutosite really prints ep 29 放映日:85年5月9日 and ep 30 85年5月23日
(verified). But "two-to-one for the stored values" counts only this
verdict's three sources; the wave-4 lane-B verdict
(`out/airdates/fist-of-the-north-star.json`) left ep 29 UNRESOLVED with a
stated LEAN to 05-09 (ja-WP + TheTVDB vs en-WP + AFL + RQ87's gap note).
Genuinely useful NEW datum in this aside for Sean's pending call: hokutosite
is one week early on ep 30 TOO (5/23 vs the unanimous 5/30) — a systematic
early shift, which weakens hokutosite as a 5/9 witness and mildly supports
the stored 05-16. Route this to the wave-4 flag; the verdict rightly
proposes no repair.

### F5 — ep 58 caution for the next block (the flag itself is RIGHT)
All three sources verified verbatim: hokutosite 058 「アニメオリジナルストーリー」;
RQ87 "Almost all of this episode isn't in the manga. The scene where Toki
talks about the South Star six holy fists and Yuda's betrayal were in the
manga, but this was used earlier, and Rei talks about it rather than Toki";
Filler page "58 - Mostly filler, except for the origin of the Nanto
Rokusei Ken". So the stored ep-58 {83 partial} is indeed contradicted, and
the one manga passage is ch 80's betrayal pages (ch 80's cast carries Raoh
and Shin). Caution to record: Souther's index is Manga ch. 85-97 / Anime
ep. 58-68 — ep 58 puts Souther on screen before his manga debut, so the
58-68 researcher must not read ep 58's mausoleum scenes as ch-83/85
coverage; the sources say they are anime-original staging.

## What I checked and found SOUND (the bulk of the verdict)

- **Row accounting**: 25 anchors + ep 53 (type_corrections + summary A1
  statement) = all 26 targets; filler 38/41 carry annotations only. No A1
  or A44 violation anywhere; T27 vocabulary clean; no anchor on any
  filler/graft row.
- **Monotonicity & fence**: ENDs 38→82 strictly ascending; every START =
  prior END + 1 or a marked "cont." straddle (29, 56); all inside 36..82;
  ep 56 END 82 = repaired ep 57 END 82 is the C1 straddle shape, not a
  back-jump. No reorder-vs-transcription ambiguity in the block.
- **Volumes**: every anchor's volume matches en-WP's tankōbon boundaries
  (v5 36-44, v6 45-53, v7 54-62, v8 63-71, v9 72-80, v10 81-89; 245 total)
  — an independent source the verdict used only at structure level.
- **Citations**: all 16 character `appearances` fields reproduce EXACTLY as
  quoted (Jagi, Aki, Amiba, Habu, Nevada, Zakoru, Uighur, Mitsu,
  Raiga & Fuga, Gallon, Dekai Babaa, Kokuoh, Galf, Seki, Dagar, Komaku,
  Yuda, Rei, Taka, Bull, Haystack, Arisa, Zorige — Zorige indeed anime-only).
  Every quoted Japanese line on hokutosite 029/030/037/042/043/053/054/055/
  056/057/058 is verbatim; every quoted RQ87 line is verbatim. No content
  farms; the three pillars are genuinely independent of each other and of
  AFL/AFG.
- **Medium rows** 37, 43, 54 confirmed outright; 47's value survives F2;
  44 is in fact high-grade (the verdict marked it high; its one nit is F3).
- **Continues**: all seven consistent — C1 rows continue at their own END
  (37→53, 42→59, 54→79, 55→81, 56→82), parity rows at the next START
  (43→61, 52→78). The ep-54 note's "Yuda's arrival … opens ep 55" squares
  with hokutosite 055 (anime moves the arrival to the next morning) and
  with ep 55 START 80 under the A10 sliver rule — no contradiction.
- **Retypes** (53, 54) meet the T28 bar with 2-3 independent sources each;
  the verdict correctly parked ep 53's would-be anchor in flags instead of
  anchoring a row it proposes as filler.
- **Structure/edition**: 245-chapter space confirmed (en-WP + fandom);
  flag #1047 (MU latest_chapter 71) correctly dismissed as a release-record
  artifact — nothing in the block uses MU numbering; no scope leakage.

## Verdict on the verdict

Sound in 24 of 25 anchors as written, and in the 25th (ep 47) the value is
right with one unsupported citation sentence to strike. Both retypes and
both filler confirmations hold. The ep-58 flag holds. The ONE thing that
must not pass curation as-is is the ep-57 repair's silent typing
assumption (F1): decide filler-vs-mixed for ep 57 FIRST, then either keep
the repair (mixed) or convert it to a type correction + anchor deletion
(filler). Nothing else in the file needs to change hands.
