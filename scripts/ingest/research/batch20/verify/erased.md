# Verifier report — erased wave 9 (lane L-D MUPIN, the honest-terminal shape)

Verdict: `scripts/ingest/research/batch20/out/erased.json`
Verifier: claude-fable-5-1 (cross-model vs the Opus research agent), 2026-09-02.
Method: mechanical anchor/repair/continue/summary agreement scan; refetched
every cited source and read the pages the author could only summarise —
bokumachi-anime.com story/11 + story/12 (the full spoiler-gated synopses,
staff credits) and special/interview (full text, 三部×伊藤); ja-WP wikitext
(テレビアニメ paragraph + its <ref>, 概要, the 原作 plot summary 植物状態からの
覚醒 → エピローグ, the 各話リスト, 書誌情報, the Re infobox); en-WP Erased_(manga)
wikitext (ep 11/12 summaries, volume list, the Re line); bokumachi.fandom via
the MediaWiki API (Kumi Kitamaru, Yashiro's Brother, Gaku Yashiro, Airi
Katagiri, Satoru Fujinuma, List of Chapters, Episode 11/12, chapters 33-37 /
43 / 44 — all chapter pages are category stubs); MU API series 60899029545;
MangaDex manga 9c16fed0 (attributes only — the aggregate/feed are empty, no
hosted chapters); AniList's API was down (403 "temporarily disabled"); and
SEVEN witnesses the verdict did not have: the JP chapter-by-chapter blog's
35話 / 36話 / 44話 pages (xn--n8jawt8ezc7925ag2wf.com 157 / 211 / 521) and its
アニメ12話 原作との違い page (586, with 60+ reader comments), makiya22's 7巻
chapter digest, wakatake-topics' 36-44 digest, b9life's ep-12 review (quotes
the anime's final line), xckb's finale post, the ameblo/yatomibuncho note, and
the fyeahbokumachi tumblr the verdict flagged. DB untouched.

## Recap baseline

Erased (僕だけがいない街) — stored per the dispatch context: 12 rows all
`canon` (AFL blanket 'Manga Canon'); the only anchor is the MU pin ep 12 →
35 v6; no annotations; no volume boundaries; open flag #675 count_mismatch.

| row | stored | verdict | verifier |
|---|---|---|---|
| ep 11 「未来」 — stored: canon, no anchor, no annotations | → verdict: → MIXED; anchor END 35 [START 33] {33-35; 34-35 abridged; 32 cut} v6 high (the honest terminal, G56); abridged{33-35}; divergence{36-37} | → verifier: CONFIRMED — the cut-over is pinned tighter than the verdict had it: ep 11 adapts ch 33 → ch 35 up to the gossip-cameraman beat, where the manga brings Airi in (ch 35's closing page) and the anime substitutes Yashiro/西園 (F3); END 35 / START 33 / vol 6 / mixed all stand; the tumblr's "33-36" REFUTED (ch 36 has no pages here) |
| ep 12 「宝物」 — stored: canon + anchor END 35 v6 (mu) | → verdict: → FILLER; repair end_chapter 35 → null (A1 deletion, the toriko shape); anchor_hostile; divergence{36-44}; loose_parallel{42-44}; continue 35 post_series (C1) | → verifier: filler CONFIRMED as the T28 default, but the fork is STRONGER than the verdict states — the anime's last line is ch 44's line verbatim (F1); display impact of the fork is ZERO either way (A44 sliver, continue 35); deletion + hostile + continue all sound |

## Findings, ranked by damage

### F1 — the fork: the closing scene shares ch 44's DIALOGUE, not only its setting (Sean's call; no position effect either way)
The verdict rejects mixed because "the convergence is on the outline, not
the drawing" and describes the reunion as reproduced "in setting and event
but not from the page". The evidence is stronger than that. The anime's
final spoken line is 「一緒に雪やどりしてもいいですか？」 (b9life's ep-12
review, quoting the broadcast); the manga's ch 44 (『僕だけがいない街 2012.01』,
Young Ace 4月号, on sale 2016-03-04) closes on 愛梨「こんなに降るなんて反則
ですよね。一緒に、雪宿りしてもいいですか？」 (wakatake-topics' digest) at 「最後に
悟がリバイバルした場所（悟が逮捕されアイリと別れた場所）」 (the 44話 blog) — the
same 高架下, the same snow, the same line. That is setting + event + dialogue.
Everything AROUND it diverges: the manga's Sachiko-handed umbrella and the
two sets of footprints reading as 相合傘, 「雪が景色を真っ白く塗り替えていく」
as the memory metaphor, the 「Re:Re:」 MAIL from Sachiko (the anime paints
Re:Re: on the underpass wall instead — a reader comment on 586), the manga's
2012.01 vs the anime's 2010 (en-WP: "Seven years later, in 2010"), the
anime's blue butterfly (anime-only, the Revival motif), the anime's 居酒屋
reunion (「原作にはないシーン」 per two readers), and the manga's Kumi 高校合格
/ Satoru's 高卒認定 / Sachiko crying over the 文集 beats. The 586 blog's
author: 「原作では最後の高架下のシーンはもっと意味深」.
Why this does not overturn filler: T28's own text lists "a restaged closing
scene" among the fragments that leave an episode filler + annotation, and
the sole-adaptation exception is written for PAGES surfacing in an
otherwise-original episode. Here the page did not exist when the episode
was made — ch 44 went on sale 21 days before broadcast, and the interview
(published before the finale) has the director reading only 「最終回のひとつ
前まで」 — so what the anime reproduces is the ending the author DESCRIBED
and then drew; wave 7's principle "author credit does not mint
correspondence" (I40) is the same boundary. And the position instrument is
unaffected by the type: under "pages, not numbers" a first-time closing
sliver inside an original plot is A44 position-less, so even a MIXED ep 12
takes no anchor and the continue stays 35 — the verdict's own fallback line
("the continue must still be forced to 35") is right. Net: filler + the
loose_parallel is the sound default; the loose_parallel{42-44} note should
say the reunion's LINE is reproduced, so the next reader does not rediscover
this as an unexamined conflict.

### F2 — citation precision: 「第十一話の途中から」 is ja-WP's sentence, not the interview's
The verdict says ja-WP "citing the official 三部けい×伊藤智彦 interview, states
it flatly". ja-WP's テレビアニメ paragraph does carry that sentence with the
interview as its sole <ref> — verified verbatim, including the tail 「ただし
原作サイドから終わり方は伝えられており、大凡の結末は同じ」. But the interview
itself (read in full) contains no episode number and no 「途中から」; what it
says is 伊藤「なるべく外れないようにしたかったです。表現の仕方に若干違いがあっても、
着地点は同じにしたいと思っていました」, 三部「漫画のラストは特に迷いましたね。ある
程度ページ数が取れたので、新しいシチュエーションを用意して、この形になったのですが、
アニメの方は尺がないからもっと端的にやらないといけない」, and the interviewer's
「伊藤監督はこのインタビューの時点で、原作コミック連載の最終回のひとつ前まで読まれて
いる」. The mid-ep-11 location is nonetheless well supported — by the
official ep-11 synopsis against the ch-35 summary (F3) and by two
independent JP reviews (hatenablog: 「11話途中からのアニメオリジナル展開」; xckb:
「第11話からオリジナル展開」, ep 11 = 「6巻〜7巻+アニメオリジナル」, ep 12 = 「6巻〜
8巻+アニメオリジナル」). Soften the attribution; no value changes.

### F3 — where ep 11 turns original, exactly (supports END 35 partial + C1)
The 35話 blog's 概要 (Young Ace 7月号, 2015-06-04): Kumi (9歳・小4, leukaemia)
befriends Satoru; 「久美ちゃんと仲良く話している所をゴシップカメラマンから下世話な
ネタとして狙われる。そこに片桐アイリと思われる女性が颯爽と現れ、カメラマンに拳を
ぶつけて…一喝」 — that is ch 35's closing beat. The official ep-11 synopsis:
「季節は秋。悟は院内で知り合った久美という少女と友人になっていた。骨髄移植に不安を
覚える久美を励ます悟。そんな二人のもとに、あの帽子の男・西園が現れた」; the
hatenablog review, watching the broadcast: 「週刊誌の盗撮カメラマンが出てきたので、
『愛梨登場か』と思って見てたら、いきなり八代先生が出てきたので驚きました」. So the
anime adapts ch 33 (2003 awakening), ch 34/35 (Sachiko, rehab, Kayo with baby
未来, Kumi, the cameraman) and swaps Yashiro for Airi on ch 35's last beat;
everything after (西園's self-reveal, Kumi's surgery countdown, the rooftop
「八代、俺の記憶は戻っているぞ」) is original. Ch 35's Airi page is therefore
UNADAPTED — END 35 is partial, C1 → continue 35 is exactly right, and the
"April-2004 material relocated to autumn 2003" claim holds (ch 35 = 鍵
2004.04; synopsis 季節は秋 in 2003). The tumblr's ep 11 = "33-36" is
refuted: ch 36 (始まりの地点 2005.05 — the Airi conversation, the collapse,
waking 386 days later on 2005-05-11; 36話 blog + makiya22 + yamakamu) has no
pages in the anime, whose memory return is via Kayo's baby (anime-original;
the manga's runs Airi ch 36 → the station ch 39 「AIRI」). The verdict's
divergence{36-37} on ep 11 is fair; 36-39 would name the whole replaced
memory arc, cosmetic.

### F4 — ep 11 mixed vs canon under T28: SOUND
The original share is not a sliver: by the official synopsis it is the
latter half of the episode (西園's reveal → the surgery countdown → the
rooftop cliffhanger), and it carries the episode's story; the source share
(33-35) carries the first half. Two independent reviews call the block
アニメオリジナル from mid-episode. Mixed is the correct standing; the anchor
sits on a mixed row (A1 clean).

### F5 — nits (no value changes)
- loose_parallel note: "ch 42 'Target' — a kidnapping, not a sabotaged IV"
  — the manga's Kumi is LURED by a forged e-mail chain (やまぶき荘→りんどう荘)
  and DRUGGED (「久美ちゃんは水筒の中身を飲んで」, wakatake) before the bridge;
  "lured and drugged, then the burning bridge" is the accurate contrast.
  Also shared at outline level and worth listing: Yashiro's own 蜘蛛の糸
  breaking on defeat (ja-WP: 「悟に敗北した際にその糸は切れて」; the anime shows
  it in the rooftop puddle, b9life) — ch 43 territory.
- "the author only conveyed the general ending": the interview shows Ito had
  READ through ch 43 (Feb 2016 issue, on sale 2016-02-04) before the finale
  aired — after scripts were locked, so no page adaptation of 42-44 was
  possible, but the phrasing is ja-WP's, not the interview's.
- continue kind `post_series` with continue_chapter = END (35), not
  coverage+1: this is the C1 shape the 2026-08-27 amendment says wins;
  confirm the apply layer accepts an END-equal post_series value.
- Kayo's visit with 未来: ja-WP's Kayo entry ties the visit to 「加代の絵を
  描いてみた」, which the 35話 blog places in ch 35's 概要 — the visit may sit
  at the 34/35 seam rather than inside 34. Inside 33-35 either way.
- Add the anime's epilogue year (2010, en-WP) vs the manga's 2012.01 to the
  divergence{36-44} note.
- ja-WP's 各話リスト: ep 11 脚本 岸本卓 (rowspan from ep 9) / 絵コンテ 江崎慎平 /
  演出 星野真; ep 12 絵コンテ・演出 石井俊匡 — matches the official site; the
  WebFetch summary that showed 石井 as ep-12 脚本 was the summariser's error,
  not the page's.

## Per-claim verdicts (the five hunts)

1. **Ep 11 reaches ch 35 and turns original partway — SOUND (F3 sharpens
   it).** Kumi's debut: fandom |Manga = [[35. Key 2004.04]] / |Anime =
   [[Episode 11]] (verbatim); the 35話 blog's 概要 has Kumi and the
   cameraman; the official synopsis has both; MU end string "Vol 6, Chap 35".
   Turning point = ch 35's closing Airi beat, replaced by Yashiro. START 33:
   the episode opens on the 2003 awakening (synopsis 「年月は流れ、2003年…つい
   に目を醒ます」 = ch 33 目覚め 2003.08); the opening line is recap wording
   (A10). Vol 6 = 31-35 (fandom list, verbatim) — the volume field is right.
   A47: no later row starts on 35; nothing moves.
2. **Any page of 36-44 in ep 12? — SOUND WITH CORRECTIONS (F1).** No
   running-order pages: the rooftop / IV drip / wheelchair / rescue mat exist
   in no chapter (official synopsis vs ja-WP 原作: さざんかの集い, 吊り橋,
   松葉杖の演技, 川へ飛び込む — all verbatim). The closing reunion reproduces
   ch 44's final beat INCLUDING its line, with the surrounding page details
   different and the page post-dating production. Filler + loose_parallel is
   T28's default for a restaged closing scene; the sole-adaptation exception
   is Sean's to invoke, and it changes the TYPE only — the anchor is A44 and
   the continue is 35 under both readings.
3. **Ep 11 mixed vs canon — SOUND (F4).**
4. **33-35 splits and "ch 32 cut" — SOUND.** MU start string verbatim:
   "Vol 1, Chap 1 Skips/Abridges Chap 28, 29, 32, 34 and 35"; fandom
   Yashiro's Brother |Anime = Cut, Concept Character + [[Category:Manga
   Only]]; ja-WP 八代 entry: 「原作では最初に見えた人間は八代の兄であり…アニメ版では
   スパイスとの出会い以来見えるようになったとされる」 — the ch-32 backstory is
   replaced, not adapted. Ch 34/35 abridged: ch 35's Airi page dropped, the
   2004.04 material moved to autumn 2003.
5. **49 = 44 + 5; flag #675 a false alarm — SOUND.** fandom List of Chapters:
   44 numbered + a Gaiden block; ja-WP 概要 「単行本は本編が全8巻（外伝を含めると
   全9巻）」 and 「『ヤングエース』にて2016年7月号から12月号まで…短編集である外伝
   『僕だけがいない街 Re』…そのままコミックス第9巻として発売」 (verbatim); vol 9's
   contents are five stories (Re: 雛月加代 / 小林賢也 前編 / 後編 / 藤沼佐知子 /
   片桐愛梨); MangaDex attributes lastChapter 49 / lastVolume 9 (its chapter
   feed is empty, so "folds the gaiden in as 45-49" is inferred from the
   count, not seen); MU status "9 Volumes (Complete)", latest_chapter 29 =
   the release-record field. AniList's 49 could not be re-read (API down);
   the context's 49 is consistent. Vol 8 = 41-44 (en-WP volume list starts
   at 41; the 44話 blog's reader: 「８巻収録分は４話分」).

## Mechanical scan

Single anchor: END 35 ≥ START 33; chapters_adapted 33-35 agrees; volume 6
= fandom vol 6 (31-35); repair old 35 = the stored mu value; continue 35 =
END (C1, post_series); summary, anchor, repair, hostile and type blocks all
name the same rows and numbers. No back-jump; no scope leakage (one season,
one chapter space); no anchor on a filler row after the repair; no
`anime-only-canon`; no mapping on an adopted/side_source row. Citation
quality: official site, ja-WP, en-WP, fandom API, MU API primary; the
hatenablog review is listed among the ep-11 type sources — it is
cross-check tier (correctly, it is the third citation, not the load-bearing
one); the tumblr is flagged, not used.

## Verdict on the verdict

Sound in everything it renders: the terminal moves to ep 11 → 35 [33] v6,
the MU anchor on ep 12 is deleted under A1, the continue is 35 (C1), and
the two retypes (11 → mixed, 12 → filler) are the T28 readings. Three things
should change hands at curation: (1) the loose_parallel{42-44} note must
record that the reunion's LINE (「一緒に雪宿りしてもいいですか」) is ch 44's, so
Sean rules the filler-vs-mixed fork on the full evidence — position impact
zero either way; (2) attribute 「第十一話の途中から」 to ja-WP with the official
synopsis + ch-35 summary as the independent proof, not to the interview;
(3) the small note corrections in F5 (Kumi lured-and-drugged; the 2010 vs
2012 epilogue year).
