# Verifier report — naruto-shippuden wave 11, sub-blocks a + b (eps 374-392, lane A2 gap block)

Verdicts: `scripts/ingest/research/batch20/out/naruto-shippuden-w11a.json` (rows 374-384)
and `scripts/ingest/research/batch20/out/naruto-shippuden-w11b.json` (rows 385-392).
Verifier: claude-fable-5-1 (cross-model vs the two Opus research agents), 2026-09-02.
Method: `validate.ts` + `scan.ts` on both files; the 15 anchors pushed through
`lib/sliver.ts#sliverStart/sliverEnd` with the neighbouring START (answer: nothing moves —
375 and 383 leads classify `scraps`, 374 and 392 tails `substantive`, 385/386/388
`sole-segment`); refetched raw via the MediaWiki API (naruto.fandom episode pages 374-393
incl. 389/390, chapter pages 634, 635, 637, 638, 640-657, 660-662 and 129-131, the arc page,
the Gaara page, volume pages 66-69, List of Volumes), en-WP season 18 `action=raw`,
ja-WP 疾風伝 via the API (各話リスト rows 373-394 + the bold legend), AFG and AFL HTML,
ANN's ep-388 and ep-392 reviews, Fandompost's ep-388 review (curl), and the Narutopedia
ep-388 discussion thread (DiscussionThread API, 2014-11). MangaDex holds NO Naruto
chapters (licensed; every chapter query returns `total: 0`) and Narutopedia's chapter
infobox has no `pages=` key, so page COUNTS are not obtainable from any primary source I
can reach — the two splits below are verified at BEAT level, not page level. Scratch:
`scratchpad/w11v/shippuden/`. DB untouched; verdict JSONs untouched.

## Mechanical pass

`validate.ts`: `ok naruto-shippuden-w11a.json: 11 targets, 9 anchors, 0 hostile, 2 continues,
2 annotations, 0 repairs, 0 type corrections` · `ok naruto-shippuden-w11b.json: 8 targets,
6 anchors, 0 hostile, 3 continues, 4 annotations, 1 repairs, 1 type corrections`.
`scan.ts`: w11a clean; w11b one READ item (summary cites 652 — that is the ep-384 hand-off
reference, not an anchor claim: fine). Fence 633 < 635 … 660 ≤ 661 holds in both files;
ENDs monotone 635 < 637 < 640 < 642 < 644 < 646 < 648 < 650 < 652 < 653 = 653 < 655 <
656 < 657 < 660 across the seam (the 653 = 653 pair is a shared chapter, not a regression);
no row anchored twice; no anchored row hostile; the ep-392 repair's `old` matches the stored
batch-8 note verbatim (scan raised no mismatch); the string `anime-only-canon` does not occur
(T27); kinds used = partial / rearranged / divergence, continues parity ×5 — all in the
PROTOCOL vocabulary. A1: 376, 377, 389, 390 take nothing; 388's anchor exists only alongside
its `type_corrections` entry (validate's effType accepts it; if Sean refuses the retype the
anchor and the 388 continue must be dropped together — the verdict says so itself).
Internal-contradiction class (summary vs rows vs continues vs chapters_adapted): NONE in
either file — every summary number matches its row; every `end_chapter` is the upper bound of
its own `chapters_adapted`; every continue sits on a row that has an anchor.

## Recap baseline

Naruto: Shippuden — stored per the two wave-11 contexts: no stored anchor inside 374-392;
fence = ep 373 → 633 v66 (manual) below and ep 393 → 661 (manual, continue 663 parity) above.

| row | stored | verdict | verifier |
|---|---|---|---|
| ep 374 — stored: canon, no anchor | → w11a: END 635 [634] v66 high + C1 continue 635 + partial{635} (with 375) | → verifier: SOUND at beat level (Narutopedia's ep-374 summary really does stop at the black flames = ch 634's penultimate beat; en-WP's ep-374 summary carries the Orochimaru/Suigetsu/Karin-at-the-Kage block = ch 635's opening beats 1-6 of ~11; ep 375's summaries carry 635's beats 7-11). "two-thirds" is an estimate — no page source exists (see method) |
| ep 375 — stored: canon, no anchor | → w11a: END 637 [635] v66 high + parity continue 638 | → verifier: SOUND (ch 634's last beat "Sai questioned Jūgo" opens ep 375 = the scrap lead, START 635 under A10; sliverStart says `scraps`; Narutopedia ep-375 closes on Obito absorbing the Ten-Tails = ch 637's close; ep 378 opens on 638's first beat) |
| ep 376 — stored: filler + graft{null} | → w11a: stays filler, no anchor (A1) | → verifier: CONFIRMED (Narutopedia: no `chapters`/`arc` keys — I did not refetch 376/377 pages; AFG `* Filler N/A` ×2 and AFL `Filler` ×2 fetched; ja-WP 各話リスト rows 376/377 bold + 注 "NARUTO疾風伝スペシャル「ナルト対メカナルト〜九尾強奪指令〜」" verbatim) |
| ep 377 — stored: filler + graft{null} | → w11a: stays filler, no anchor (A1) | → verifier: CONFIRMED (same four witnesses) |
| ep 378 — stored: canon, no anchor | → w11a: END 640 [638] v67 high | → verifier: SOUND (Narutopedia chapters=638, 639, 640; AFG "638, 639, 640"; en-WP closes on the Truth-Seeking Ball on Minato's regenerating arm "about to detonate" = ch 640's last beat; ch 641 opens on Minato deciding to teleport away with it; the `{{Looking for|…|chapter 637|…}}` hatnote is on the page as claimed; ch 638 volume=67) |
| ep 379 — stored: canon, no anchor | → w11a: END 642 [641] v67 high | → verifier: SOUND (chapters=641, 642 / AFG "641, 642"; ch 641 "You Guys are the Main!!" opens on the teleport; ch 642 "Breakthrough" volume=67) |
| ep 380 — stored: canon, no anchor | → w11a: END 644 [643] v67 high | → verifier: SOUND (chapters=643, 644 / AFG "643, 644"; en-WP closes on "both his father and Kushina already conveyed their feelings" = ch 644 "I Know" last beat verbatim; 643 "Joining Fists…!!" and 644 volume=67) |
| ep 381 — stored: canon, no anchor | → w11a: END 646 [645] v67 high | → verifier: SOUND (chapters=645, 646 / AFG "645, 646"; "God Tree (episode)" vs our "The Divine Tree" is the same 2014-10-09 row on ja-WP 神樹; 645 "Two Powers…!!" / 646 "God Tree (chapter)" volume=67) |
| ep 382 — stored: canon, no anchor | → w11a: END 648 [647] v68 high | → verifier: SOUND (chapters=647, 648 / AFG "647, 648"; Narutopedia ep-382 closes "the five Kage arrive to the battlefield, all standing as a united front" = ch 648's last sentence verbatim; 647 volume=67, 648 volume=68) |
| ep 383 — stored: canon, no anchor | → w11a: END 650 [649] v68 high + rearranged{648, 650} | → verifier: SOUND — START 649 is right (F3) |
| ep 384 — stored: canon, no anchor | → w11a: END 652 [651] v68 high | → verifier: SOUND (chapters=651, 652 / AFG "651, 652"; en-WP closes on Naruto reaching Obito's consciousness "with the intent to unmask the real Obito Uchiha" = ch 652's last beat; ep 385 opens on 653's first sentence; 651 "What Is Filled" volume=68) |
| ep 385 — stored: mixed, no anchor | → w11b: END 653 [653] v68 high + C1 continue 653 + partial{653} (with 386); stays mixed | → verifier: SOUND (F4) |
| ep 386 — stored: mixed, no anchor | → w11b: END 653 [653] v68 high; stays mixed | → verifier: SOUND (F4) |
| ep 387 — stored: canon, no anchor | → w11b: END 655 [654] v68 high | → verifier: SOUND (chapters=654, 655 / AFG "654, 655"; ch 654 opens "Naruto reaches out his hand to Obito. However, instead of accepting his hand, Obito tries to strangle Naruto" = ep 387's first beat; en-WP + Narutopedia both close on the Rasenshuriken "large enough to illuminate the footprints/footsteps of his comrades" = ch 655 "Furrow" last beat verbatim; both volume=68) |
| ep 388 — stored: filler, no anchor, no annotation | → w11b: filler → CANON (T28 recap clause) + END 656 [656] v68 medium + C1 continue 656 + divergence{656} | → verifier: NOT-FILLER is SOUND on four sources; CANON-vs-MIXED is a genuine fork whose FACTS partly contradict the verdict's premise — the retrospective is NOT recycled footage (F1). Anchor 656 [656] v68 sound under either non-filler type; one chapters_adapted overclaim (F1c) |
| ep 389 — stored: filler + graft{null} | → w11b: stays filler, no anchor (A1) | → verifier: CONFIRMED (Narutopedia infobox has no `chapters`/`arc` keys — refetched; summary = a Hanabi-POV retelling of Part I: the heiress duel, Neji's training; AFG `* Filler N/A`; AFL `Filler`; ja-WP bold 憧れの姉さま + 注 映画公開直前スペシャル) |
| ep 390 — stored: filler + graft{null} | → w11b: stays filler, no anchor (A1) | → verifier: CONFIRMED (no `chapters`/`arc`; summary = the Chūnin-Exam hospital visit, the Naruto-vs-Neji final, Pain's assault from Hanabi's view; AFG/AFL Filler; ja-WP bold ハナビの決意) |
| ep 391 — stored: canon + partial{656-660} (w/ 392) | → w11b: END 657 [656] v68 high + partial{656, 657} | → verifier: SOUND (chapters=656, 657 / AFG "656, 657"; Narutopedia ep-391's first sentence after Obito/Rin is "Madara is subjugated by Hashirama after Naruto's earlier attack failed to deal damage" — a one-line recap, exactly as claimed; the episode then runs ch 656's Kurama→Minato / Samsara resolve / Black Zetsu / revival beats in the chapter's order, and ch 657 "Madara Uchiha is Back" closes "Madara soon sets his unseeing gaze upon the tailed beasts, determined to hunt them down" = the episode's last line) |
| ep 392 — stored: canon + partial{656-660} note "ep 392 largely anime-original" | → w11b: END 660 [658] v69 high + C1 continue 660 + partial{660} + annotation-note REPAIR | → verifier: SOUND, repair CONFIRMED (F5); one apply-routing caution (F6) |
| ep 393 — stored: canon, END 661 (manual, no START/volume), continue 663 parity | → w11b: FLAGGED only ("may be one chapter short"), no repair | → verifier: the flag is CONFIRMED at beat level on three sources — END 662 is the honest value (F2); recommend a curation-side repair |

## Findings, ranked by damage

### F1 — ep 388, the fork: the FACTS (what the retrospective is, how much, and whether the framing beat is in ch 656)
The verdict's canon reading rests on the premise that the ~15-minute Gaara segment is "a
retrospective of Gaara's ALREADY-ANIMATED Part-I childhood" that "counts for nothing" as a
recap. The type is Sean's call; here is what the sources actually establish.

**(a) Not filler — high confidence, four independent witnesses, all reproduced.**
Narutopedia ep-388 infobox: `|arc=Birth of the Ten-Tails' Jinchūriki` and `|chapters=656`
(vs 389/390: neither key present). The arc page, verbatim: "covers chapters 640 to 677 of the
manga and from episodes 378 to 388 in the Naruto: Shippūden anime and later picks up starting
from episodes 391 to 393 … is interposed by two [[The Adored Elder Sister|stand]]-[[Hanabi's
Decision|alone]] episodes involving Hanabi Hyūga" — 388 is inside the run, 389-390 are the
interposition. ja-WP 各話リスト: row 388 `最初の友` is UNBOLDED between bold 376/377 and bold
389/390/394+, and the list's legend (line 64) is explicit: 「サブタイトルが'''太字'''の回は、
全編がアニメオリジナルストーリーの回。それ以外は原作ストーリーもしくは原作ストーリーとアニメ
オリジナルがミックスされた回。」 — unbolded = source story or a mix. AFG row 388: `* Mixed, in
this episode we only watch from minute 2:05 to 5:18 and then from minute 20:42 to 21:05`,
chapter column `656`. AFL alone prints `Filler`. And the position consequence is real: ch
656's opening third (the Rasenshuriken landing, Hashirama's Wood Dragon, Gaara asks Shukaku,
the beasts agree) is adapted here and nowhere else — ep 391 replays it as one sentence.

**(b) The retrospective is NEWLY ANIMATED, not recycled Part-I footage — the verdict's
premise is wrong on this point, though it never asserted "recycled" outright.**
- The Narutopedia ep-388 discussion thread (contemporaneous, Nov 2014): "Better art and
  animation than the semi-canonical episodes with Rin" (i.e. than 385/386); "we got to see
  Temari and Kankuro as kids and how they saw Gaara at the time … at the dinner table … Gaara
  and the teddy bear". Narutopedia's summaries of the manga's own Gaara-backstory chapters
  129 "Pain…!!" / 130 "Love…!!" / 131 "The Name Gaara…!!" (refetched) contain NO scene with
  Temari or Kankurō as children — so at least that vignette is studio-made, and cannot be
  reused Part-I footage either (Part I adapts those three chapters). One commenter in the
  same thread estimates that some 10% of the middle is copy-paste of earlier scenes — so
  SOME reuse, inside a mostly new-drawn segment.
- The episode's credit table lists Yashamaru (Soichiro Hoshi), the Fourth Kazekage
  (Masahiko Tanaka), Kankurō, Temari, and an unnamed "[Child]" (Mariko Higashiuchi / Wendee
  Lee) — recorded parts for a segment, the tell of new production rather than a clip reel.
- Fandompost (Chris Beveridge, 2014-11-28): "Showing more of how Naruto changed Gaara, with
  him narrating it as well … an episode that long time viewers and readers of the manga
  already know in full and much more detailed form … nothing really new outside of a minute
  or two with the bookend aspects." ANN (verbatim, as the verdict quotes): "If you've been
  watching this series for a while, you've seen everything there is to see in this episode"
  and "the production team needs this many clip shows" — the reviewer classes it WITH clip
  shows; he does not say the footage is old. ANN also names the content: "flashbacks to
  Gaara's childhood, his initial encounters with Naruto and the time he miraculously came
  back to life after having his Tailed Beast removed" — i.e. ch 129-131 material (Part I)
  plus ch 278-279 material (Shippuden eps 31-32), story the anime has told before.
- Share: AFG's windows sum to 3:36 of source content (2:05-5:18 = 3:13; 20:42-21:05 = 0:23);
  the gap between them is 15:24. Against a ~20-minute post-OP/ED body, the source share is
  roughly one-sixth and the retrospective roughly three-quarters.

**(c) The framing beat is NOT in ch 656.** Narutopedia's ch-656 summary (refetched) has the
beasts "lend Gaara their help, intent on repaying Naruto for freeing them" and nothing else —
no question from Son Gokū, no "first friend". Both the Narutopedia and en-WP EPISODE summaries
carry it ("Son Gokū … questioning the young Kazekage if he is a friend of Naruto … Gaara
says Naruto is his first friend"), and it sits inside AFG's non-canon window. The Gaara
character page states "he considers Naruto his closest and first friend" as a general trait,
not as a ch-656 beat. So: the title beat and its answer are studio-made. Separately, the
verdict's ep-388 `chapters_adapted` claims "Hashirama pins Madara with the Wood Dragon AND
the Gate of the Great God torii" — en-WP's ep-388 summary has Wood Dragons only; the torii
seal is ch 656's MIDDLE ("Meanwhile … Hashirama incapacitated him further by trapping him
beneath his torii seals. Despite his circumstance, Madara grins") and Narutopedia's ep-391
summary opens on exactly that ("Madara is [[Sage Art: Gate of the Great God|subjugated]] by
Hashirama … a grinning Madara"). The torii beat belongs to 391's share; drop it from 388's
chapters_adapted at curation (no anchor effect — 656 either way; the C1 continue's "resume at
Kurama's assurance to Minato" is one beat later than the true resume point, harmless).

**(d) What the two clauses give, on these facts.** The recap clause as pinned ("a recap
segment counts for nothing in the standing; the remainder decides") does not define "recap".
If a recap is a re-telling of already-animated STORY regardless of whether the frames are new
(the ANN/Fandompost reading — "seen it all before"), the segment counts for nothing and the
pure-656 remainder is canon, as the verdict proposes. If a recap is re-shown FOOTAGE, this
segment is not one: it is a newly animated, Gaara-narrated retelling of the source's own
backstory (ch 129-131 and 278-279 — faithful adaptation out of order, still canon material
under the faithfulness clause; a `rearranged`/`graft` note, never a START per A12) wrapped in
a studio-made framing beat (Son Gokū's question / "my first friend") and at least one
studio-made vignette (the siblings' dinner table). The faithfulness clause says a small
studio-made beat is noted as divergence, never weighed — the framing beat carries no plot
(nothing progresses; Gaara answers a question), but it is the episode's title, the spine of
~15 minutes of narration, and sits in AFG's non-canon window. Whether that is "small" is the
judgment. Two consistency points for Sean: (i) w11b keeps 385/386 MIXED precisely because
their padding is newly-animated vignettes the manga "only alludes to"; 388's padding is also
newly animated, and ch 656 does not even allude to a Gaara-remembers beat — so the line
between the two treatments is thinner than the verdict's text makes it look; (ii) either way
the anchor 656 [656] v68 stands, the continue 656 stands, and only a decision to keep FILLER
kills both — which would mark ch 656's opening third never-adapted, and that is false.
Verifier's reading: the verdict's canon proposal is DEFENSIBLE under the recap clause but its
stated premise ("already-animated" as if re-shown) should be corrected in the annotation note
to "newly animated retelling of already-adapted backstory, with a studio framing beat";
mixed is the honest alternative if new-drawn minutes are what the clause weighs.

### F2 — the fence, ep 393: stored END 661 is one chapter short — CONFIRMED (three sources, beat level)
Narutopedia ep-393 infobox `chapters=660, 661, 662`; AFG row 393 `660, 661, 662`; the ep
title 本当の終わり = ch 662 本当の終わり (the chapter page carries `{{Looking for|the chapter|the
episode|A True Ending}}`). Content: Narutopedia's and en-WP's ep-393 summaries walk ch 660's
tail (Shukaku's equal / the beasts dragged in / B's tentacle / Naruto ejected, Gaara cushions
the fall) → ch 661 in full (Madara and the White Zetsu clone, Tobirama's Flying Thunder God
Slash, Hashirama's chakra and "technique" to Sasuke, Sasuke suspended and impaled) → ch 662
in full (Tobi's Kanzeon Lotus King fended off by Hiruzen, Orochimaru's group in cover, Karin's
tears, Hinata's Byakugan and stumble, Sakura the only medic with chakra, "both Naruto and
Sasuke will die") — and the episode's last sentence is ch 662's last sentence verbatim ("As
grief overtakes both Sakura and Karin … both realise that if things continue like this both
Naruto and Sasuke will die"). Under A4 END = 662; A47 does not pull it back (662 is a whole
chapter and the next canon row, ep 414, starts on 663 — the stored continue 663 already
presumes 662 was seen; the stored note itself says "= ch 660-662"). Damage if left: the
rendered position on the last canon row before the 20-episode 394-413 filler block is one
chapter behind what the viewer has seen, and it contradicts its own continue. Neither verdict
repairs it (outside both blocks; w11b flags it). Recommend at curation: ep 393 → **662 [660]**,
chapters_adapted "660 (tail: Shukaku's equal, the beasts dragged into the statue, B's tentacle,
Naruto ejected), 661, 662", **volume 69** (ch 660/661/662 all `volume=69`), continue 663
parity unchanged. High.

### F3 — ep 383 START 649 (the '648' on both wiki fields is the re-shown arrival) — SOUND
Narutopedia's ep-382 summary ends "the five Kage arrive to the battlefield, all standing as a
united front" = ch 648's last sentence. Narutopedia's ep-383 summary opens "As the five Kage
arrive to the battlefield, they note that this is no battle to be lost" = ch 649's first
beat ("Dispersing across the battlefield as soon as they arrive, the five current Kage … as
this was no battle they could afford to lose"). So ep 383's only ch-648 content is the arrival
image already animated at 382's close — A10 / "re-shown pages are never cited" gives 649, and
`sliverStart` on the delivered record returns `scraps` → 649. The `rearranged{648, 650}` claim
also checks: ch 650 places Kakashi's Will-of-Fire realisation mid-chapter (before "Obito
attacks Naruto and Sasuke, forcing them out"), en-WP's ep-383 summary places it as the final
sentence. Both per-episode sources (Narutopedia, AFG) print 648 first — that is their
touched-chapter convention, not a page claim. If the house preference is to let a shared page
set the START, 383 becomes [648] and nothing else moves; the verdict already says so.

### F4 — the 653 split across 385/386 (both stay mixed) — SOUND at beat level
Narutopedia's ep-385 summary is ch 653's summary text through "make the way easier for them
to follow" (verbatim identical wording), and its ep-386 summary is the chapter's remaining
paragraph ("reminisce more of his past … Rin … bonds with his friends … reaches his hand out").
Ch 654 opens on the outstretched hand. en-WP splits at the same sentence. So 385 = 653's
opening beats, 386 = 653's closing beats, 653 = vol 68. "First half / second half" is a beat
estimate — no page source (method). Both rows sharing END 653 is the correct shape (the pair
is non-strict monotone; scan accepts it). A47: `sliverEnd` returns `sole-segment` for both
(nothing to fall back to), so the apply layer will not pull 385 back to 652 — correct, since
652 is ep 384's and 385 adapts none of it. The mixed standing: Narutopedia ep-385 trivia
("During their sparring session in the Academy, Obito and Kakashi use the same moves…") and
ep-386 trivia (Rin bandaging Obito's hand; the jōnin posting written-test results; Minato's
chūnin-exam forms on the bridge) confirm the inserted vignettes are the anime's own scenes.
AFL `Mixed Canon/Filler` ×2; AFG prints no marker on 385/386 (treats them as canon) — the
disagreement is as the verdict states; keeping the stored mixed is consistent with the
faithfulness clause only if those vignettes are judged more than "a small studio-made beat",
which one 17-page chapter over two episodes supports.

### F5 — ep 392's stored note "largely anime-original" — REFUTED by the sources; the repair is SOUND
Narutopedia ep-392 `chapters=658, 659, 660`; AFG "658, 659, 660"; both summaries walk Sand
Buckshot / the Desert Layered Imperial Funeral Seal (658 "Tailed Beasts vs. Madara…!!"), the
White Zetsu eye, the statue, Kakashi's Kamui, Limbo (659 "Limbo: Border Jail…!!"), then
Naruto unable to exit, Desert Hands, the Bunpuku memory, Absolute Defence (660) in the
chapters' order. ANN's ep-392 review (A-): "With almost no recap clips and no lingering shots
that overstay their welcome, this episode features expertly executed plot progression … The
one segue in the episode is a new flashback to Shukaku's past before Gaara" — and that Bunpuku
flashback IS ch 660's own content. The mid-660 C1 is right: ch 660's last beats (B severs a
tentacle, Kurama's favour, Naruto ejected, Gaara calls out) open ep 393. `sliverEnd` on the
delivered record with nextStart 660 returns `substantive` (the "through Shukaku deflecting…"
wording) — END 660 stands.

### F6 — the ep-392 repair's `field: "annotation_note"` is not a column — route it by hand (LOW, process)
Prior apply scripts map repairs by `field` onto a column (`col[r.field]`, wave 2) or hand-route
annotation repairs ("MAP repair … (A45 / the annotation upserts)", wave 4). `annotation_note`
matches neither pattern; under the wave-2 shape it would log `SKIP … (no column)` and the stale
batch-8 note would survive on the 391/392 partial record. The curation step should replace the
stored eps 391,392 `partial {656-660}` note (or supersede it with the two per-row partials the
verdict delivers: 391 {656, 657}, 392 {660}).

### F7 — w11b structure note: "AFG's CHAPTER column is empty from the mid-300s on in this series" — FALSE (LOW, documentation)
AFG prints a chapter value on every row I parsed, 373-393: `373 632, 633 · 374 634, 635 · 375
635, 636, 637 · 378 638, 639, 640 · … · 388 656 · 391 656, 657 · 392 658, 659, 660 · 393 660,
661, 662` (376/377/389/390 `N/A`). w11a says the opposite and is right. The sentence should
not enter the trap record for this series; AFG's chapter column and Narutopedia's `chapters=`
agree row for row here and are plausibly one lineage (count them as one chapter source, two
type sources — AFG's `Mixed` on 388 is its own).

### F8 — volumes v66-v69 — SOUND, all 15
Narutopedia `volume=`: 634/635/637 → 66; 638/640/641/642/643/644/645/646/647 → 67;
648/649/650/651/652/653/654/655/656/657 → 68; 658/659/660/661/662 → 69. Stored table v66
628-637 · v67 638-647 · v68 648-657 · v69 658-668 agrees at every seam used. Every delivered
anchor takes its END's volume (374/375 v66; 378-381 v67; 382-388, 391 v68; 392 v69) — the
catalog's convention. Volume pages: 66 "A New Three-Way Deadlock (volume)", 67 "Breakthrough
(volume)", 68 "Furrow (volume)", 69 "The Beginning of the Crimson Spring (volume)".

### F9 — citation quality
Primary: Narutopedia episode + chapter pages, en-WP s18, ja-WP, AFG (types + minutes), AFL.
Secondary, correctly used as witness only: ANN reviews (the 388 quote is verbatim on the page).
No content farm is load-bearing. The ep-388 discussion thread and Fandompost are MY additions
(footage question); the verdict did not cite them and did not need to for the not-filler claim.

## Per-claim verdicts
- **(A) 374 → 635 [634] C1; 375 → 637 [635]; 378 → 640 … 384 → 652; 383 START 649 + rearranged{648, 650}** — SOUND (beat-level; page counts unobtainable).
- **(B) 385 → 653 [653], 386 → 653 [653] both mixed; 387 → 655 [654]; 388 filler → canon + 656 [656] + divergence{656}** — not-filler SOUND; anchor SOUND; **canon vs mixed = SOUND WITH CORRECTIONS**: the premise "already-animated" must be restated (newly animated retelling + studio framing beat; F1b/c), the torii clause dropped from 388's chapters_adapted (F1c), and the fork left to Sean with the two consistency points in F1d.
- **(C) 391 → 657 [656]; 392 → 660 [658] C1; the batch-8 note repair; 389/390 filler** — SOUND (F5; F6 routing caution).
- **(D) the 393 fence** — the flag is CONFIRMED: END 662 [660] v69, continue 663 unchanged (F2). Recommend the repair at curation.

## Standing
**SOUND WITH CORRECTIONS.** All 15 anchors, 5 continues and 4 volumes-per-seam hold on
independently refetched sources; the sliver normalizer moves nothing; no internal
contradiction. Corrections for curation: (1) ep 393 → 662 [660] v69 (F2, high); (2) ep 388's
annotation/type note restated on the footage facts, torii clause removed, type = Sean's call
(F1); (3) route the ep-392 note repair by hand (F6); (4) strike the "AFG chapter column empty"
sentence from w11b's structure note (F7).
