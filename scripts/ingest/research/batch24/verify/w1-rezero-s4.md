# Batch 24 wave 1 — SCOPED verification: re-zero-starting-life-in-another-world rows 67-79 (w1b)

Verifier: Claude Fable 5.1 (R24 — the author was an Opus research-agent). Read-only. Scope per
`PROTOCOL.md § Verification` and the dispatch: (A) the instrument / space claim and the seam with
w1a, (B) the one `type_corrections` entry, (C) the one repair, (D) the first / last / one middle
anchor on the pages (67, 79, 77 by design, plus 73 as the opposite call), (E) the mechanical R25 scan.
Not a per-row citation sweep.

Files read in full: `scripts/ingest/research/batch24/PROTOCOL.md`,
`out/re-zero-starting-life-in-another-world-w1b.json` (the verdict),
`out/re-zero-starting-life-in-another-world-w1a.json` (the sibling, rows 51-66),
the author's context `b24-ctx/re-zero-starting-life-in-another-world-w1-67_79.md`, `WAVE1-RECOVERY.md`,
`docs/rules.md` records A47 / A10 / T28 / C1 / C2 / C5 / C6 / G59 / R25, `lib/wikipedia.ts#parseEpisodeList`,
`wiki-episodes-backfill.ts` (title-fill behaviour). Every quote below was grepped in bytes I fetched
myself into `/private/tmp/claude-501/-Users-sean-Projects-mangamapper/d759b216-cedf-4b38-9933-962475e63c51/scratchpad/b24-verify-rezero-s4/`
(the author's copies were consulted only to test one misquote for a page change — none).
The DB was read for the stored rows (`episodes` 66-79, `chapter_anchors` = 0 rows, `series`).

## Recap baseline — Re:ZERO -Starting Life in Another World- (`re-zero-starting-life-in-another-world`)

| ep | stored | verdict | verifier |
|---|---|---|---|
| 66 | canon (the fence, w1a's row; not in this ask) | w1a: END 20 [20] v20 {v20 ch 1, ch 6-7, ch 7 unfinished} | AGREES with w1b's seam: the fandom (en) credits ep 66 `Volume 20 (Ch 1, Ch 6-Ch 7)`; en-WP's ep-66 summary carries v20 ch 7's un-headed lead (cryosleep / Sirius to the capital) and ch 6's close (Julius forgotten). Named only to check the seam. |
| 67 | canon, title `""` (empty string — checked in the DB; not null), air 2026-04-08, minted_by wiki | END 21 [START 20] v21, high; `partial`{v20 ch 7}, `rearranged`{v21 幕間}, `divergence`; REPAIR title `""` → "The Reason I'm Taking You With Me / Gorgeous Tiger Reloaded"; canon confirmed | SOUND on three wiki lineages (en / ru / zh), the licensor's synopsis, en-WP and the title test; the repair's cause and value confirmed (see C). One wording defect in the `partial` note (its section count). |
| 71 | canon | END 22 [22] v22, high; `divergence`{added Subaru–Meili conversation}, `abridged` | Anchor not sampled (out of scope). The `divergence` note carries a 「」-quoted sentence that is NOT on the cited page — a spliced quote (finding 2). |
| 73 | canon | END 22 [22] v22, high — does NOT advance to 23 although its title is v23 ch 1's | SOUND: en `Volume 22 (Ch 6-Ch 7)`, ru `Том 22 Главы 6-7`, zh `文庫正傳22卷`; the 2020 book summary prints v22's last section 「迎えた朝」 with exactly the scene en-WP ends the episode on. |
| 77 | canon | END 23 [23] v23, MEDIUM — A47 HOLD (the closing respawn-and-vow beat = v24 ch 1's opening); `partial`{v24 ch 1}; continue 24 parity | The facts are as stated on every page, but under A47's unproven-tail convention (wave 13) the hold needs size evidence or teaser wording from a source; none exists; the existence clause does not apply (two sources credit the tail). By the letter END ADVANCES to 24 [23]. A fork for Sean that is NOT in `flags_for_sean` (finding 1). Display (A13 = START 23) and continue (24) are unchanged either way. |
| 78 | canon | END 24 [24] v24, high | Named only as the A47 precondition: the licensor's ep-78 synopsis opens on the same waking scene; the fandom gives `Volume 24 (Ch 1-Ch 2)`. Not sampled further. |
| 79 | canon | END 24 [24] v24, high; continue 24 parity ("the block's frontier") | SOUND: en `Volume 24 Chapters 2-3`, zh `文庫正傳第24卷`, the licensor's synopsis = v24 ch 2's last four sections + ch 3, KADOKAWA's cover quote is the title line. The continue is the C1 value (mid-volume stop, ch 1-3 of 6), not a post-series continue in disguise — but the sibling wrote NO continue at its fence on the same facts (finding 5). |

All thirteen rows: type CONFIRMED canon (no retype). Rows 68-70, 72, 74-76 were not sampled beyond the
mechanical scan and the volume-field cross-check in the table under A.

## Findings, ranked by damage

### 1. ep 77 — the A47 hold is a judgment the rule as written does not grant, and it is not flagged

What the pages say (all grepped):
- The book's volume 23 closes on the devouring: lanobare v23 第６章 last section 「影に飲み込まれる」 —
  「スバルとエミリアは、崩落した床から落下していき、影の中に呑まれていった。スバルは、自分を殺して、『ナツキ・スバル』を取り戻すことを決意する。」
  (https://lanobare.com/rezero-netabare-novel-23rd/). Volume 24 ch 1 opens on the waking:
  「スバルは緑部屋で目を覚まし、エミリアとベアトリスが目の前にいることに安堵する。」 and
  「エミリアとベアトリスに慰められながら、スバルはプレアデス監視塔に迫る危機を乗り越えるべく、決意に立つ。」
  (https://lanobare.com/rezero-netabare-novel-24th/).
- en-WP's ep-77 summary ends: `The miasma then devours them, killing them both. Subsequently, after respawning, Subaru vows to save everyone this time.`
  (https://en.wikipedia.org/w/api.php?action=parse&page=Re%3AZero%20season%204&prop=wikitext&format=json). "After respawning" is v24 ch 1 material by content.
- rezero.fandom ep 77: `Volume = [[Re:Zero Light Novel Volume 23|Volume 23]] (Ch 5-Ch 6)<br>[[Re:Zero Light Novel Volume 24|Volume 24]] (Ch 1)` — verbatim as the annotation quotes it.
  The zh wiki gives `文庫正傳23卷` only (its fields are volume-grain: 22卷 for ep 73, 第24卷 for ep 79); the ru page has no volume field.
- The licensor's ep-78 synopsis opens on the same scene: 「託され、信じて、赦して、願われた。エミリアたちの想いを受け取り『ナツキ・スバル』として戦う決意をしたスバルは、『死に戻り』から目覚めると真っ先に記憶喪失になったと打ち明ける。」
  (https://re-zero-anime.jp/tv/story/) — so ep 78 STARTS on v24 ch 1 (the A47 precondition holds). The licensor's ep-77 synopsis stops at ch 5's close (「…レイド・アストレアが待ち受ける。」) and says nothing about the tail — no teaser wording.

The rule: A47's UNPROVEN-TAIL CONVENTION (Sean, wave 13): "the exception needs EVIDENCE of size — a page
count of at most 5, or sliver / teaser / cold-open wording. Position language alone ('the opening of ch 90',
'ch 104's first scene') proves nothing about size, so the END ADVANCES to the furthest chapter played". The
EXISTENCE CLAUSE (wave 14) holds an END only when a SINGLE source's straddle mark credits the tail; here the
fandom's explicit mark plus en-WP's closing sentence (placed in v24 ch 1 by the book summary) are two. The
author's own anchor concedes it: "Medium, not high, because no source states the beat's length; the judgment
that it is a cour-ending teaser rather than a share rests on the licensor's synopsis for ep 78 opening on the
same scene" — that is the precondition, not the size evidence.

Verifier's reading: by the letter, ep 77 → END 24 [START 23], volume 24, confidence medium, the `partial`
kept naming v24 ch 1's opening beat. The hold is defensible only as a VOLUME-SPACE ruling ("a one-beat tail of
a 328-page volume is a sliver by construction") — which would be a rule amendment for the whole novel-owner
class (P9), not a one-row call, and the verdict's own flag 2 says `sliverEnd` will never run on these rows, so
no census class will ever revisit it. The sibling w1a put its analogous seam (ep 54) in `flags_for_sean`; w1b
did not. Impact if Sean rules "advance": one stored value (ep 77 end/volume 23 → 24); A13 display (START 23)
unchanged; continue 24 unchanged; the block's frontier (ep 79 → 24) unchanged.

Also a wording tension inside the file: the ep-77 continue's why says "the 喪失編 cour ends INSIDE volume 24"
while the anchor holds END at 23 by A47 — same facts, opposite phrasing; the value (24) is right under both
A47 ("the continue is the next START either way") and C2 (ep 78 STARTs on 24).

### 2. ep 71 `divergence` note — a 「」-quoted sentence that the cited page does not carry

The note quotes 「スバルとメィリィの新しい会話シーンが追加されたと見られます」 from
https://lanobare.com/rezero-anime4ki-cut/. Grepped in my bytes: count 0. The page carries a HEADING
「スバルとメィリィの新しい会話シーン」, a table cell 「新規会話を追加（と見られる）」 and the sentence
「物語の根幹を変えるような改変はありません。カットで生じた空白を埋める形で、スバルとメィリィの新規会話などが追加されたと見られます。」
— the quoted string is a splice of the heading and the sentence. The author's fetched copy is byte-identical
to mine (126,039 bytes), so this is not a page change. The CLAIM survives in the page's own wording (the hedge
「と見られます」 is real; the page declares 「英語圏のファン検証（Re:Zero Fandom Wiki等）を主たる手がかりとした」,
as the note says), the source is cross-check tier and the row's standing does not rest on it — but a
verbatim quote in a stored annotation note must be the page's bytes (wave 5 / 6). Fix: replace the quote with
the sentence above. The other three quotes from that page — 「物語の根幹を変えるような改変はありません」,
「幹は同じです」, 「幹を守り、枝葉を圧縮し、空白を再構成で埋める」 — all grep (count 1 each).

### 3. Volume 22's table of contents — two lineages list an eighth unit the verdict omits

The summary and `structure.notes` give v22 as seven units ending on 第七章「■■■・■■■」 and state "Every
printed unit of volumes 21, 22 and 23 is accounted for with no gap". rezero.fandom's Volume 22 page lists
`*Chapter 7: ■■■・■■■` then `*Interlude: Old Memories`
(https://rezero.fandom.com/api.php?action=parse&page=Re%3AZero%20Light%20Novel%20Volume%2022&prop=wikitext&format=json — a page the verdict cites),
and the ru wiki's Том 22 lists `Интерлюдия: Старые воспоминания`. The zh wiki's 小说:22卷 lists seven
chapters and no interlude; lanobare's v22 summary has no 幕間; the web-novel index has no 「古い記憶」 and no
幕間 inside 第六章 (90 parts) — so if the interlude exists it is a book-exclusive 幕間. No fandom page "Old
Memories" exists. Unresolved on the pages I could reach: it needs the printed 目次 (a third lineage). No
anchor moves (every END is a volume number; ep 73's END 22 is right whether or not a 幕間 follows ch 7), but
the "no gap" sentence and the seven-unit v22 list are unsupported on two of four lineages and should be
softened to "…except a possible v22 幕間 the en/ru wikis list, unadapted by any row per any source".

### 4. ep 67 `partial` note — its section count contradicts its own list

The note says ep 66 took "the chapter's first section" and ep 67 "the remaining six" ("6 of v20 ch 7's 7
sections"), then lists SEVEN headings for ep 67. lanobare's v20 第七章 body
(https://lanobare.com/rezero-netabare-novel-20th/) opens with an UN-HEADED lead (the camps' meeting;
「捕縛した大罪司教「憤怒」のシリウスについては、ラインハルトとフェルトが王都へ連行し」; Emilia freezing Lust's victims)
and then seven headed sections 「アナスタシアの提案」…「エミリア、ベアトリスと並んで歩く」. en-WP's ep-66 summary
carries exactly that lead (`They decide to have Emilia put Lust's victims into cryosleep … while the captured Sirius is to be transported to the capital`),
so the SPLIT is right — the lead is ep 66's, all seven headed sections are ep 67's — and only the arithmetic
is wrong. Wording fix: "the chapter's un-headed lead is ep 66's; ep 67 takes all seven headed sections". No
positional impact (START 20 stands under A10 either way — the seven sections are the episode's first act).

### 5. The continue convention differs between the two halves of one series

w1a delivers NO continue at ep 66 ("C1 inside v20 ch 7; the series airs; the frontier is derived from the
anchors"). w1b delivers the frontier at ep 79 as `continue 24, kind parity` and a cour-break continue at ep 77.
Both values are correct — 24 is the C1 value (ep 79 stops inside v24, ch 1-3 of 6) and ep 77's is C2 (ep 78
STARTs on 24) — and neither is a post-series continue in disguise (that would be 25 / `post_series`). But the
apply should take ONE convention for the pair (P9): either the frontier is written as a curated C1 continue
on both fences (66 → 20, 79 → 24) or on neither. Note the healer's limit: ep 79 has no next stored row, so a
continue there is curated (C7) or absent — never derived.

### 6. Nits (no change of value)

- The repair's licensor quote 「‐ 第67話 ‐ 君を連れ出す理由／ゴージャス・タイガー・リローデッド」 is not a contiguous byte string on https://re-zero-anime.jp/tv/story/ — `‐ 第67話 ‐` and `君を連れ出す理由／ゴージャス・タイガー・リローデッド` sit in separate elements (the title string itself greps twice). A rendering join, not a misquote.
- The verdict never reconciles ja-WP's 章構成 line with its own ep 67 → v21. The line reads, verbatim: 第六章『記憶の回廊』（文庫第21巻 - 第25巻、アニメ第4期 第68話 - ） and 第五章『歴史を刻む星々』（文庫第16巻 - 第20巻、アニメ第3期 第51話 - アニメ第4期 第67話） — a whole-episode arc assignment. It is coarser than the row, not contrary to it: ep 67's first title card 『君を連れ出す理由』 is web-novel 第六章４ (https://ncode.syosetu.com/n2267be/?p=5), so ep 67 straddles Arc 5's epilogue chapter (v20 ch 7) and Arc 6's opening (v21). One sentence in the summary would close it.
- "a Japanese chapter-by-chapter summary … written in 2020": lanobare's v20-v23 pages are dated 2020年12月28日-31日; the v24 page is dated 2021年1月1日.

## A. The instrument / space claim — SOUND

- Arc ↔ volume frame: ja-WP (pageid 3333726) 章構成, grepped verbatim: 第五章『歴史を刻む星々』（文庫第16巻 - 第20巻、アニメ第3期 第51話 - アニメ第4期 第67話） / 第六章『記憶の回廊』（文庫第21巻 - 第25巻、アニメ第4期 第68話 - ） / 第七章『狼の国』（文庫第26巻 - 第33巻）. 既刊一覧: row `|16||…|| rowspan="5" |第五章`, row `|21||…|| rowspan="5" |第六章`, row `|26||…|| rowspan="8" |第七章`; each row cites a kadokawa.co.jp product page (v21: 321905000195); header 「既刊65巻+4巻（本編45巻、短編集14巻、外伝6巻、円盤特典4巻）」. So 第六章 = volumes 21-25 and the block (67-79) sits in 20-24 with 25 the unaired tail — as the verdict says.
- The season shape: ja-WP (アニメ) 「第4期は全11話の「'''喪失編'''」と全8話の「'''奪還編'''」の全19話構成」, 「第4期喪失編：2026年4月8日 - 6月17日 / 第4期奪還編：2026年8月12日 -」; the licensor's ON AIR page 「喪失編(全11話)・奪還編(全8話)」, 「4月8日(水)より」 (https://re-zero-anime.jp/tv/onair/). ja-WP's 第4期 tables carry Aux0-3 = 脚本 / 絵コンテ / 演出 / 作画監督 (+ Aux5 初放送日 on other seasons); `Aux\d = 原作` count 0, `アニメオリジナル` count 0 — the verdict's "the ask's instrument does not exist" is true.
- My own independent lineage (not cited by w1b): the ru and zh Re:Zero wikis' per-episode volume fields. ru ep 67 `Том 20<br>Том 21`, ep 73 `Том 22 Главы 6-7`; zh ep 67 `文庫正傳20卷(第七章)<br>文庫正傳21卷`, ep 73 `文庫正傳22卷`, ep 77 `文庫正傳23卷`, ep 79 `文庫正傳第24卷`. Every sampled END agrees; the only divergence (zh ep 77 = v23 only) is the A47 question in finding 1. The es wiki has no pages for 67-79 (`missingtitle`).
- Space hygiene: every anchor number is an MF文庫J volume (21-24); every chapters_adapted segment is prefixed `vNN`; the web-novel space is a different numbering (『君を連れ出す理由』 = 第六章４, 『コンビニを出ると、そこは不思議の世界でした』 = 第六章３４, 『雪解けを待つあなた』 = 第六章５５ on syosetu) and none of those numbers appears in the verdict; no comicalization chapter is cited anywhere. The chapter lists the verdict prints for v21 / v23 / v24 match rezero.fandom's Volume pages and lanobare's 目次 unit for unit (v22: see finding 3).
- Convention across the 13 anchors (mechanical): ENDs 21,21,21,22,22,22,22,23,23,23,23,24,24 monotone; START ≤ END on all; volume == END on all; min volume in chapters_adapted == START on all 13 and max == END on 12 (ep 77 is the declared A47 hold). 12 high, 1 medium (77).
- THE SEAM: w1a ends ep 66 at END 20 with v20 ch 7 unfinished and says ep 67 should anchor END 21 [START 20]; w1b delivers exactly that. On the pages ep 67 finishes volume 20 AND enters 21 — not 20 alone (the licensor's 「一方、療養のためプリステラに残ったガーフィールはミミと一緒に、記憶を失った母リアラの家を訪れていた」 is v21's 幕間; en-WP's Meili recruitment is v21 ch 1; both title cards are v21's 第一章 and 幕間 per the fandom's v21 ToC `*Chapter 1: The Reason to Bring You Out` / `*Interlude: Gorgeous Tiger Reloaded`) and not 21 alone (the licensor's 「アナスタシアの提案で…プレアデス監視塔へ向かうことを決意する」 is v20 ch 7's 「アナスタシアの提案」; the Echidna reveal 「スバルは避難所の集会所に戻り、そこにいたアナスタシアに対して、お前は誰だと問い詰める」 is ch 7's 「アナスタシアの正体」; the fandom's `During their travels, Subaru confronts Anastasia` is the restaging the divergence note describes). KADOKAWA's v21 cover copy 「目覚めたとき、最初に見る顔が俺であってほしい。――それはたぶん、俺のエゴなんだよ」 greps on https://www.kinokuniya.co.jp/f/dsg-01-9784040640068.

## B. The `type_corrections` entry — SOUND as a confirmation; a no-op for the apply

One entry, episodes [67…79], type `canon`, why beginning "CONFIRMED AS STORED". Basis tested on the sampled rows: each of 67 / 73 / 77 / 79 is the novel's content on the licensor's synopsis, a wiki volume field (en + ru or zh) and the 2020 book summary, with en-WP's summary agreeing beat for beat; rezero.fandom's `==Anime Differences==` heading is present and EMPTY on 67 / 73 / 77 / 79 (grepped); animefillerlist's page (https://www.animefillerlist.com/shows/re-zero-starting-life-another-world) has exactly 50 rows, all `manga_canon` (cross-check only; no claim on 67-79). The T28 faithfulness basis is on the page: 「物語の根幹を変えるような改変はありません」 and 「幹は同じです」 grep on the cut-comparison article. Shape: validate.ts accepts a same-type entry; scan.ts and the census must treat canon → canon as a NO-OP confirmation (never a retype count) — WAVE1-RECOVERY.md already records this for w1a; w1b is the same shape. Not a shape problem, provided the apply pins rather than retypes; the flag ("delivered twice") is accurate.

## C. The row-67 repair — SOUND, and its cause is a parser class (G59 / P9), not a row

- Stored: `title: ""` (empty string — checked in `episodes`; the author's `old: ""` is exactly right), `air_date 2026-04-08`, `minted_by wiki`.
- Cause, in en-WP's wikitext (https://en.wikipedia.org/w/api.php?action=parse&page=Re%3AZero%20season%204&prop=wikitext&format=json), grepped: the ep-67 block has `NumParts = 2`, `Title_1 = The Reason I'm Taking You With Me`, `Title_2 = Gorgeous Tiger Reloaded`, `NativeTitle_1 = 君を連れ出す理由`, `NativeTitle_2 = ゴージャス・タイガー・リローデッド` and NO `| Title =`; rows 73 / 77 / 78 / 79 have a plain `Title`. `lib/wikipedia.ts` line 199: `block.match(/\|\s*Title\s*=\s*([^\n]*)/i)` — `Title_1 =` cannot match (`_1` is not `\s*=`), so the mint stored no title. The cause is exactly as the verdict says.
- Value on two independent sources in my bytes: the licensor's STORY page carries `君を連れ出す理由／ゴージャス・タイガー・リローデッド` (raw HTML, count 2); ja-WP's 第4期 table carries `| Title = 君を連れ出す理由<hr />{{nobr|ゴージャス・タイガー・リローデッド}}` verbatim; en-WP's English pair as above; rezero.fandom's `Kanji = 君を連れ出す理由／ゴージャス・タイガー・リローデッド`. The " / " join is the catalog's standing form: 242 stored titles contain " / ", and the named precedent exists (`ranking-of-kings-the-treasure-chest-of-courage` ep 1 = "Kage's Errand / The Prince and Money").
- Durability (P8): `wiki-episodes-backfill.ts` is FILL-ONLY ("Wikipedia fills '' titles and null"; it patches only when `curTitle` is empty), so a manual non-empty title survives the writer's next run. The one-row repair is therefore safe to apply as written.
- The class: 140 wiki-minted rows across the catalog carry `title ""` (kinnikuman, welcome-to-demon-school-iruma-kun, re-zero) plus 85 stitch-minted. Not all are NumParts cases, but re-zero 67 proves the shape: any `{{Episode list}}` row using `NumParts` / `Title_N` mints title-less on path A. The durable fix is in `parseEpisodeList` (read `Title_1..N`, join " / ") — a G59-path parser change and a P9 capture, with the empty-title wiki rows re-checked afterward. That is capture work for step 7, not a reason to hold the repair.
- Air date: 2026-04-08 is a Wednesday and matches ja-WP and the ON AIR page; the fandom's `November 1, 2025 (Premiere) (Lucca Comics & Games 2025)` is a convention screening and the verdict rightly did not act on it.

## D. First, last, middle — on the pages

- ep 67 (END 21 [20]) — SOUND; see A (the seam) and finding 4 (a count in the note).
- ep 73 (END 22, the opposite call) — SOUND. lanobare's v22 第７章 ends on the section 「迎えた朝」: 「緑部屋で目覚めたスバルの前には、エミリア、ベアトリス、パトラッシュがいた。」「しかし、スバルは「これは異世界転生ってやつか!?」と驚き、はしゃぐ。」 then 「次巻、第23巻の…」; en-WP's ep-73 summary ends `he does not recognize them and then excitedly realizes that he is in another world`; three wikis credit v22 only (en Ch 6-7, ru Главы 6-7, zh 22卷). The title is v23 ch 1's (fandom v23 ToC `*Chapter 1: Coming out of the Convenience Store, There Was a Wondrous World`; lanobare 第１章「コンビニを出ると、そこは不思議の世界でした」) — borrowed forward, as the verdict says; and even if a few seconds of v23 ch 1 were shown, ep 74 STARTs on it, so A47 would hold 22 either way. Correct.
- ep 77 (END 23, the A47 hold) — the facts are right, the rule reading is the fork: finding 1.
- ep 79 (END 24, the frontier) — SOUND. The licensor's synopsis 「レイド攻略の極意書としてレイド本人の『死者の書』を探しに書庫へ行く途中、調子を取り戻せずにいるユリウスと言葉を交わすスバル。…記憶の回廊で、少女がスバルを出迎える」 = lanobare v24 第２章's sections 「「タイゲタ」攻略 / ユリウスにレイド戦を預ける / レイドの書を発見 / 記憶の回廊」; en-WP's summary (Od Lagna, Louis Arneb, Rem's "stand up", the tower attacked by Lye Batenkaitos, the return) = 第３章「立ちなさい」's sections through 「監視塔プレアデスに襲いかかる「暴食」の脅威」 and 「再びの「タイゲタ」の書庫」; KADOKAWA's cover copy 「―立ちなさい！立って、立ち上がって、救ってきて、全てを！」 greps on https://www.kinokuniya.co.jp/f/dsg-01-9784040649450. The continue 24 / parity is the legitimate C1 value inside a straddled volume (v24 ch 4-6 unread; ch 4 is ep 80's title, not a row) — not a post-series continue; the pair-convention point is finding 5.

## E. The R25 mechanical scan

`validate.ts`: `ok … 13 targets, 13 anchors, 0 hostile, 2 continues, 6 annotations, 1 repairs, 1 type corrections, 7 flags`. `scan.ts` on the file as it sits on disk: `ok` with ZERO items for w1b (the summary now contains no `ch N` token at all, so the "1, 5, 7" read item recorded in WAVE1-RECOVERY.md came from an earlier revision — the file was patched five times 22:37-22:38; and yes, those were within-volume units, which on a novel owner is the convention, not a contradiction). My own pass: the summary's map `67 → v21 [v20], 68-69 → v21, 70 → v22 [v21], 71-73 → v22, 74-77 → v23, 78-79 → v24` equals the anchors; "Thirteen anchors", "one back-reach at the season fence and none inside the block" (START 20 on 67 only; every other START equals the previous END) — true; the cour line 「喪失編」 11 episodes (67-77, 2026-04-08 → 06-17) / 「奪還編」 8 (78-85, from 08-12) matches ja-WP, the licensor and the stored dates; "all thirteen stored dates are Wednesdays" — true (checked); 12 high + 1 medium, 6 annotations, 2 continues, 1 repair, 7 flags match the file (the summary states no explicit counts for the last four, so nothing to contradict). Annotation episodes vs rows: 67's three notes name v20 ch 7 / v21 幕間 (both in ep 67's chapters_adapted), 71's name v22 ch 2-4, 74's v23 ch 1, 77's v24 ch 1 — all inside the named rows' segments. chapters_adapted vs END/START: 13/13 on START, 12/13 on END with the one exception the declared A47 hold. The seven flags name only rows that exist (67) or that are correctly said NOT to exist (80, 81). No A1 / A44 / T27 issue: no filler row, no `anime-only-canon`, no adopted / side_source row.

## Verdict on the file

SOUND WITH FIXES. The instrument and the volume map are right on every lineage I could reach, the seam with
w1a is exactly as both halves state it, the repair is correct in cause and value (and safe under P8), the
type confirmation is a sourced no-op, and the mechanical scan is clean. Fixes before apply: (1) ep 77 is a
FORK for Sean, not a settled anchor — by A47 as written it advances to END 24 [23] v24 (medium, `partial` kept);
holding at 23 is a volume-space ruling that would belong to the whole novel-owner class — add it to
`flags_for_sean` and let step 4 decide; (2) strike the spliced 「」 quote in the ep-71 `divergence` note and use
the page's sentence 「カットで生じた空白を埋める形で、スバルとメィリィの新規会話などが追加されたと見られます」; (3) soften
the v22 "seven units / no gap" claim to name the 幕間「古い記憶」 that the en and ru wikis list (unresolved on
the pages, unadapted by any row); (4) fix the ep-67 `partial` note's count ("un-headed lead is ep 66's; all
seven headed sections are ep 67's"); (5) pick one continue convention for the w1a / w1b pair (frontier
continue on both fences or on neither) and align the ep-77 continue's "ends INSIDE volume 24" wording with its
own END-23 hold once (1) is ruled. Capture for step 7: the NumParts / Title_N parser gap in
`lib/wikipedia.ts#parseEpisodeList` (G59 path A; 140 wiki-minted empty-title rows to re-check after the fix).
Token usage: roughly 215k of this thread's budget was consumed by the end of the report (read off the
budget counter; no per-call meter is visible).
