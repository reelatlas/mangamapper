# Verifier report — the-seven-deadly-sins-four-knights-of-the-apocalypse wave 12, sub-blocks a–d (eps 1-23, lane A2 gap block)

Verdicts: `scripts/ingest/research/batch20/out/the-seven-deadly-sins-four-knights-of-the-apocalypse-w12a.json` (1-6),
`-w12b.json` (7-12), `-w12c.json` (13-18), `-w12d.json` (19-23); fence = the wave-9 manual anchor
`the-seven-deadly-sins-four-knights-of-the-apocalypse.json` (ep 24 → 77 [75] v9).
Verifier: claude-fable-5-1 (cross-model vs the four Opus research agents), 2026-09-02.
Method: `validate.ts` + `scan.ts` on all four files; all 24 anchors (23 + the stored ep 24) pushed
through `lib/sliver.ts#sliverStart/sliverEnd` with the neighbouring START; refetched raw via the
MediaWiki API: nanatsu-no-taizai.fandom episode pages 1-25, chapter pages 1-78 (`pages=`, `volume=`,
`wsm=`, cast order), Volume 1-10 pages, the Cant page; programming-cafe's anicomi page (both tables
parsed); the licensor's synopses at 7sins-4knights.net/story/N.html for N = 2-24 (13 fetched);
nissi0725.livedoor.blog posts for eps 2, 3, 5, 6, 7, 9, 12, 13, 14, 17, 18, 19, 21, 22, 23 (located
through the 2023-10 … 2024-01 monthly archives + the verdicts' URLs); Kodansha's product records for
ALL NINE volumes (product ids from ja-WP's 書誌情報 refs: 0000350902, 0000352557, 0000355291,
0000357966, 0000360675, 0000362782, 0000365328, 0000367978, 0000369888); ja-WP '黙示録の四騎士 (漫画)'
wikitext (各話リスト + 書誌情報). Scratch: `scratchpad/w12v/`. DB untouched; verdict JSONs untouched.

## Mechanical pass

`validate.ts`: `ok w12a: 6 targets, 6 anchors, 0 hostile, 3 continues, 8 annotations` · `ok w12b: 6/6/0/3/10` ·
`ok w12c: 6/6/0/5/12` · `ok w12d: 5/5/0/2/9` · 0 repairs, 0 type corrections in all four; `[validate] 82 verdicts, 0 failing`.
`scan.ts`: `0 items to read`. ENDs monotone across the four files: 2 3 7 10 13 17 | 20 23 26 29 31 35 | 38 40 46 50 54 58 |
61 64 68 72 75 | 77 — inside the fence (ch 1 … ep 24 → 77). Two START back-jumps, both annotated `rearranged`:
ep 19 [58] behind ep 18 END 58 (a page-level revisit, not a regression) and ep 23 [69] behind ep 22 END 72.
Every `end_chapter` is the running-order upper bound of its own `chapters_adapted` except the four A47-held
tails (ep 2 → 4 p.2-3, ep 7 → 21 p.1-2, ep 14 → 41 p.1-3, ep 17 → 55 p.1), which is the rule's shape, and
every anchor's volume is its END chapter's volume under the delivered table (checked all 23). Every
continue sits on an anchored row; the 13 continues are `parity` (12) + the stored ep-24 `post_series`.
The string `anime-only-canon` does not occur (T27); kinds used = partial / rearranged / divergence /
abridged / graft — all in the PROTOCOL vocabulary. A1: no filler row exists in 1-23 (all stored canon,
AFL canon), so no A1 exposure. Internal-contradiction class (summary vs rows vs continues vs
chapters_adapted vs volumes): NONE in any file. The four files' volume tables are identical to each other
and to the fandom Volume pages' chapter lists (v1 = 1-5, then nine per volume through v9 = 69-77).

`sliverStart/sliverEnd` on the delivered records (nothing moves): ep 1 tail `substantive 8p`; ep 2 `tail-not-end`
(already held at 3); ep 6 `substantive 6p`; ep 7 / 14 / 17 `tail-not-end` (held); ep 8 lead `scraps 1p` → 21;
ep 12 `substantive 8p`; ep 13 `substantive 15p`; ep 16 lead `scraps 4p` → 47; ep 18 `substantive 6p`
(nextStart 58 = END 58); ep 22 `next-not-on-end` (ep 23 starts on 69, not 72); ep 23 `substantive 13p`;
ep 24 `tail-not-end` (the ch-80 graft segment). The apply layer will print no moves.

## Recap baseline

The Seven Deadly Sins: Four Knights of the Apocalypse — stored per the four wave-12 contexts: no stored
anchor inside 1-23; no fence below (ch 1); fence above = ep 24 → 77 [75] v9 (manual, continue 77 post_series);
stored volume boundaries EMPTY.

| row | stored | verdict | verifier |
|---|---|---|---|
| ep 1 — stored: canon, no anchor | → w12a: END 2 [1] v1 high + C1 continue 2 + partial{2 p.2-9} | → verifier: SOUND (fandom `1, 2 {{s|p.2~9}}`; pc ep table 第1巻 1～2, reverse ch 2 → 1-1,1-2; ch 1 `pages=70`, ch 2 `pages=40`, both `volume=1`) |
| ep 2 — stored: canon, no anchor | → w12a: END 3 [2] v1 high (A47 holds the 4 p.2-3 tail) + C1 continue 4 | → verifier: SOUND (fandom `2 p.10~40, 3, 4 p.2~3`; pc ep 2 = 2～3, reverse ch 4 → 1-3 only; blog ep 2 line 原作1巻第2話〜第3話; broadcaster's post-ep tweet "パーシバルを包む光の正体は…？" = the ch-4 opening beat as the cliffhanger; ch 4 `pages=20`) |
| ep 3 — stored: canon, no anchor | → w12a: END 7 [4] v2 high | → verifier: SOUND (fandom `4 p.4~20, 5, 6, 7`; pc 4～5 / 第2巻 6～7, reverse 6, 7 → 1-3; blog 1巻第4話〜2巻第7話; ch 6 `volume=2`) |
| ep 4 — stored: canon, no anchor | → w12a: END 10 [8] v2 high | → verifier: SOUND (fandom 8, 9, 10; pc 8～10, reverse 8/9/10 → 1-4, 11 → 1-5; licensor ep 4 = Nasiens' guinea pig = ch 8 パーシバル、実験台になる) |
| ep 5 — stored: canon, no anchor | → w12a: END 13 [11] v2 high; ch-14 tag left unresolved, not in chapters_adapted | → verifier: SOUND, with ONE CORRECTION available — the C-part IS a ch-14 opening tag, now two-source (F5); END 13 unchanged under A47 |
| ep 6 — stored: canon, no anchor | → w12a: END 17 [14] v3 high (borderline A47, flagged) + C1 continue 17 | → verifier: SOUND — END 17 is the better-supported value; the verdict's own fallback (END 16) rests on counting a shared page as zero, which A47's text does not say (F4) |
| ep 7 — stored: canon, no anchor | → w12b: END 20 [17] v3 high (A47 holds 21 p.1-2) + C1 continue 21 | → verifier: SOUND (fandom `17 p.7~20 … 21 p.1~2`; pc 17～20, reverse 21 → 1-8 only; blog ep 7 = 3巻第17話〜第21話 at chapter level and its LAST section is the 『希望』 name reveal with ch 21's 扉絵 — a 2-page tail; licensor ep 8 OPENS on 魔力『希望（ホープ）』; ch 21 `pages=20`) |
| ep 8 — stored: canon, no anchor | → w12b: END 23 [21] v3 high (A10: 20 p.20 is a 1-page lead) | → verifier: SOUND (fandom `20 p.20, 21 p.3~20, 22, 23`; pc 21～23, reverse 20 → 1-7 only, 21/22/23 → 1-8; `sliverStart` = scraps 1p → 21; the ch-20 `pages=24` oddity is F7, position-neutral) |
| ep 9 — stored: canon, no anchor | → w12b: END 26 [24] v4 high + parity continue 27 + abridged{25 p.17-19} medium | → verifier: SOUND (fandom `24, 25 p.1~16,p.20, 26`; pc 第4巻 24～26, reverse 27 → 1-10; blog 4巻第24話〜第26話; the omission is F6 — one wiki, blog consistent) |
| ep 10 — stored: canon, no anchor | → w12b: END 29 [27] v4 high | → verifier: SOUND (fandom 27, 28, 29; pc 27～29; licensor ep 10 opens on Howzer reproaching Donny = ch 27 師と弟子, i.e. ep 9's title runs one chapter ahead exactly as w12b says) |
| ep 11 — stored: canon, no anchor | → w12b: END 31 [30] v4 high | → verifier: SOUND (fandom 30, 31; pc 30～31, reverse 30/31 → 1-11, 32 → 1-12; ch 30 `pages=23`, ch 31 `pages=20`; licensor ep 11 = the rampaging dragon = ch 30 吹き荒ぶ嵐) |
| ep 12 — stored: canon, no anchor | → w12b: END 35 [32] v5 high (8-page tail advances) + C1 continue 35 | → verifier: SOUND (fandom `32, 33, 34, 35 p.1~8`; pc 32 / 第5巻 33～35, reverse 35 → 1-12,1-13; blog 4巻第32話〜第35話, last section 敵の侵入 = the elder naming Ardbeg = the p.8 beat; licensor ep 12 opens on leaving Cant into the Dalflare range; ch 35 `pages=20`, 8 + 12 = 20) |
| ep 13 — stored: canon, no anchor | → w12c: END 38 [35] v5 high + C1 continue 38 | → verifier: SOUND (fandom `35 p.9~20, 36, 37, 38 p.1~15`; pc 35～38, reverse 38 → 1-13,1-14; blog 5巻第35話〜第38話 ending 長老の登場; licensor ep 14 OPENS on the elder's arrival = the 38 p.15/16 split; ch 38 `pages=21`) |
| ep 14 — stored: canon, no anchor | → w12c: END 40 [38] v5 high (A47 holds 41 p.1-3) + C1 continue 41 | → verifier: SOUND (fandom `38 p.16~21 … 41 p.1~3`; pc 38～40, reverse 41 → 1-15 only; blog 5巻第38話〜第41話 at chapter level; ch 41 `pages=20`; 6-page lead → START 38 under A10) |
| ep 15 — stored: canon, no anchor | → w12c: END 46 [41] v6 high + C1 continue 46 | → verifier: SOUND (fandom `41 p.4~20, 42-45, 46 p.1~16`; pc 41 / 第6巻 42～46, reverse 46 → 1-15 only; ch 42 `volume=6`; ch 46 `pages=20`, 16 + 4 = 20) |
| ep 16 — stored: canon, no anchor | → w12c: END 50 [47] v6 high (A10: 46 p.17-20 is a 4-page lead) | → verifier: SOUND (fandom `46 p.17~20, 47, 48, 49, 50`; pc 47～50; `sliverStart` = scraps 4p → 47; ch 50 `volume=6` = v6's last chapter) |
| ep 17 — stored: canon, no anchor | → w12c: END 54 [51] v7 high (A47 holds 55 p.1) + C1 continue 55 | → verifier: SOUND (fandom `51, 52, 53, 54, 55 p.1`; pc 第7巻 51～54, reverse 55 → 1-18 only; blog 7巻第51話〜第54話; ch 55 `pages=21`, 1 + 20 = 21) |
| ep 18 — stored: canon, no anchor | → w12c: END 58 [55] v7 high + rearranged{58 p.15-20} + C1 continue 58 (read from p.1) | → verifier: SOUND — the 18/19 un-cross-cut is real (F2); pc's 55～57 is the coarser instrument |
| ep 19 — stored: canon, no anchor | → w12d: END 61 [58] v8 high + rearranged{58} + partial{58 p.1-14} | → verifier: SOUND (F2; fandom `58 p.1-14, 59, 60, 61`; pc 58～59 / 第8巻 60～61; blog 7巻第58話〜8巻第61話; ch 60 `volume=8`, ch 61 `pages=23`) |
| ep 20 — stored: canon, no anchor | → w12d: END 64 [62] v8 high | → verifier: SOUND (fandom 62, 63, 64; pc 62～64; licensor ep 20 = the assembled Four Knights before Pellegarde = ch 62 新たなる伝説のはじまり) |
| ep 21 — stored: canon, no anchor | → w12d: END 68 [65] v8 high + divergence (recap-class cold open) | → verifier: SOUND (fandom 65, 66, 67, 68; pc 65～68, reverse 69 → 1-22; the blog header's 64〜69 bracket is loose exactly as w12d says — its body opens on 〈十戒〉 / the Chaos Apostles vs the Liones knights and closes on トリスタンvs.メラスキュラ = ch 65 → 68; licensor ep 21 opens on Galand and Melascula's arrival) |
| ep 22 — stored: canon, no anchor | → w12d: END 72 [69] v9 high + partial{69 p.1-7, 14-20} + C2 continue 69 (backwards, pp. 8-13 only) | → verifier: SOUND — the 22/23 un-cross-cut is real; the C-part is a teaser of the p.8 beat (F1) |
| ep 23 — stored: canon, no anchor | → w12d: END 75 [69] v9 high + rearranged{69 p.8-13} + C1 continue 75 | → verifier: SOUND — START 69 confirmed; pc's dissent (69 → 1-22 only, ep 23 = 73～75) REFUTED as a coarse table (F1) |
| ep 24 — stored: canon, END 77 [75] v9 (manual), continue 77 post_series | → not a target; the fence | → verifier: holds — every delivered END ≤ 75 and ep 23 ends exactly on ep 24's START (75 p.13); pc reverse 75 → 1-23,1-24 |

## Findings, ranked by damage

### F1 — the 22/23 un-cross-cut (ch 69) — SOUND; programming-cafe's dissent REFUTED as the coarser instrument
Three independent witnesses put ch 69 p.8-13 at the head of ep 23 and only a teaser of it in ep 22:
- **Fandom, exact partition.** Ep 22 `69 {{s|p.1-7 , 14-20}}, 70, 71, 72`; ep 23 `69 {{s|p.8~13}}, 73, 74, 75 {{s|p.1~13}}`;
  ch 69 `pages=20` — 7 + 6 + 7 = 20, no page counted twice or lost. Ch 69's own cast order (refetched):
  Percival > Tristan > Gawain > Anghalhad > Donny > Nasiens > **Pelliot > Golgius > Melagaland** > Chion > Jade >
  Star Visor Knight — the fusion thread sits in the MIDDLE of the chapter, exactly the p.8-13 block. Ep 23's cast list
  opens Gawain > Golgius > Pelliot > Percival > Tristan > Melagaland.
- **The blog, on the beats.** Ep 22's post opens ・拗ねたガウェイン (Gawain sulking at Tristan's strength = the post-battle
  party, 69 p.1), runs ・過剰な心配 / ・リオネス聖騎士 / ・ジェイド / ・重すぎる / ・侵入者と先手必勝 (the dungeon,
  69 p.14-20) into the Guila/Jericho chapters, and its LAST section is ・Cパート: 「メラスキュラを倒した際に落ちた
  混沌の杖が発動して･･････。というところで今週はおしまい」, with the broadcaster's post-episode tweet
  「混沌の杖が妖しく光を放ち、再び脅威が蘇る･･･!!」. Ep 23's line is the explicitly non-contiguous
  「今回のアニメ第23話の内容は原作9巻第69話、第73〜第75話の内容です」 and its FIRST section is ・メラガラン:
  「混沌の杖によって融合したガランとメラスキュラ、名はメラガラン … メラガランの誕生の仕方あんな感じだったんですな」 —
  the birth is shown in ep 23, not ep 22.
- **The licensor.** Ep 23's synopsis opens 「混沌の力によって融合し復活したガランとメラスキュラ」; ep 22's does not mention the staff.
- **The fandom's own ep-22 differences list** adds the decisive detail for the A47 reading: "In the anime, the Chaos Staff
  seems to activate by itself, rather than Chaos Melascula using it" — the C-part is a studio-restaged tease of the p.8
  beat (the staff glowing), not the block (Chaos Melascula wielding it, the fusion, the birth witnessed by Pelliot and
  Golgius), which ep 23 plays in full. So the tail is ep 23's under A47, END 72 stands, and START 69 + `rearranged` on
  ep 23 is the honest shape.
- **programming-cafe.** Its episode table prints ep 22 = 第9巻 69～72 and ep 23 = 73～75; its reverse index gives ch 69 to
  1-22 only. The page has no page column at all; it also gives ch 58 wholly to 1-19, ch 41/46/55 wholly to single
  episodes, and (as w12d notes) omits the ch-75 split its own reverse index carries. A chapter-granularity table cannot
  see a 6-page relocation; it is outvoted by two page-level readings and the licensor's own synopsis order.
The backwards C2 continue (ep 22 → 69, pp. 8-13 only, then skip to 73) follows from the same facts. Display consequence
as w12d flags: eps 22 and 23 both show 69 under A13 — intended, but worth UI copy.

### F2 — the 18/19 seam (ch 58) — SOUND; the verdict's rationale about pc is inexact but unnecessary
- Fandom: ep 18 `55 p.2-21, 56, 57, 58 {{s|p.15-20}}`, ep 19 `58 {{s|p.1-14}}, 59, 60, 61`; ch 58 `pages=20`, 14 + 6 = 20.
  Ch 58's cast order (refetched): Chion > Jade > Tristan > Gawain > Tantal > Anghalhad > Donny > Nasiens > Percival >
  Pellegarde > Pelliot > **Lancelot > Guinevere** — the Lancelot/Guinevere thread is the chapter's LAST; ep 18's cast list
  ends `Pellegarde|''Unknown Man''`, `Guinevere|''Unknown Girl''`.
- Blog ep 18 (line 7巻第55話〜第58話), last two sections: ・ガウェイン×？×？ (Bartra's prophecy imagery) and ・ｷｽ —
  「ガウェインを捜すランスロットの元に現れた謎の少女 … この少女の正体はランスロットの恋人であり、ランスロットに突然ｷｽをする」,
  quoting the MANGA line 「さっさと帰って寝な 嬢ちゃん」 against the anime's 「お嬢ちゃん」 and closing on 「あなたの恋人よ」.
  The broadcaster's post-episode tweet, embedded there: 「ランスロットの前に現れた少女は、ランスロットの恋人!?」. The scene
  is source, and it is ep 18's ending.
- Blog ep 19 (line 7巻第58話〜8巻第61話) opens ・キス 「開幕早々ﾗﾝｷﾞﾈのキスが描かれました」 — Lancelot flustered,
  「キス程度経験済みだっつ〜の」 — then ・見返り美人 (the maid arrives, she names herself Guinevere) = ch 59 手玉に取られる男's
  head, THEN ・ガウェイン捜し (the Tristan-platoon search, Chion and the white armour, Tantal, Pelliot's anime-only exchange)
  = ch 58 p.1-14. So ep 19's opening is a re-show of the kiss plus ch 59's continuation, ahead of the ch-58 search thread —
  exactly w12d's description; re-shown pages never set a START ("pages, not numbers"), and 58 p.1-14 is first-time.
- The licensor's ep-19 synopsis mentions 「ランスロットの前に現れた謎の少女は、すぐに捜している人に会えるという予言めいた言葉を残す」.
  That is the scene's continuation (ch 59's head, or the re-shown tail); it is NOT evidence that 58 p.15-20 first aired in
  ep 19 — the ep-18 broadcaster tweet, cast list and blog all place the girl's appearance and the kiss at ep 18's close.
- One inexactness in w12c: "programming-cafe … split only the near-even 35 and 38 … its consistent behaviour on every UNEVEN
  page split". Not so: pc DID split ch 17 (6/14 → 1-6,1-7), ch 2 (8/32), ch 75 (13/7) and ch 77 (7/13), yet not ch 58 (6/14)
  or ch 69 (6/14). pc's assignment is editorial, not a page threshold. The conclusion (pc is a coarse dissent, outvoted) holds;
  the sentence should not enter the trap record as a rule about pc.
Both sub-block files describe the seam identically (w12c's ep-18 rearranged note and w12d's ep-19 rearranged/partial); no
reconciliation is needed before apply.

### F3 — the v1-v9 volume table — SOUND, now publisher-confirmed for all nine (w12b's "v2, v6-v9 unchecked" is closed)
Kodansha's product records (www.kodansha.co.jp/comic/products/<id> — server-rendered, readable; the kc.kodansha.co.jp
host w12c/w12d tried is the JS shell) print a 初出 string per volume. Matched against the fandom chapter infoboxes'
`wsm=` fields:
| vol | Kodansha 初出 (WSM) | fandom wsm range | chapters | release / ISBN (Kodansha = fandom) |
|---|---|---|---|---|
| 1 | 2021 第9号～第13号 | 9-2021 … 13-2021 | 1-5 | 2021-04-16 / 9784065229828 |
| 2 | 2021 第14号～第22・23合併号 | 14-2021 … 22/23-2021 | 6-14 | 2021-06-17 / 9784065235799 |
| 3 | 2021 24号～31号、33号 | 24-2021 … 33-2021 | 15-23 | 2021-09-17 / 9784065248386 |
| 4 | 2021 第34号～第43号 | 34-2021 … 43-2021 | 24-32 | 2021-11-17 / 9784065259993 |
| 5 | 2021 第44号～第52号 | 44-2021 … 52-2021 | 33-41 | 2022-01-17 / 9784065266014 |
| 6 | 2022 第1号～第11号 | 01-2022 … 11-2022 | 42-50 | 2022-03-17 / 9784065272862 |
| 7 | 2022 第13号～第21号 | 13-2022 … 21-2022 | 51-59 | 2022-05-17 / 9784065279113 |
| 8 | 2022 第22・23合併号～第32号 | 22/23-2022 … 32-2022 (no ch in #30) | 60-68 | 2022-08-17 / 9784065286562 |
| 9 | 2022 第33号～第42号 | 33-2022 … 42-2022 | 69-77 | 2022-11-17 / 9784065294871 |
Every boundary the four verdicts deliver is the publisher's; the fandom Volume pages' explicit chapter lists, the per-chapter
`volume=` fields and pc's 単行本 column agree. The table is safe to seed the empty boundary table. Two small inaccuracies in
w12a's structure note, both boundary-irrelevant: v4 and v5 are printed "200p" (the fandom's number) — Kodansha prints
**192ページ** for both (200 only for v3); and the sentence "page counts match Kodansha's own catalog records exactly" is true
only for the three volumes w12a actually checked (v1-v3).

### F4 — the A47 / A10 page counts against the chapter pages' `pages=` — all hold; ep 6 is above the bar, not below it
Refetched `pages=`: ch 2 = 40, 4 = 20, 17 = 20, 20 = 24 (F7), 21 = 20, 25 = 20, 35 = 20, 38 = 21, 41 = 20, 46 = 20,
55 = 21, 58 = 20, 69 = 20, 75 = 20, 77 = 20. The A47 holds (ep 2: 2 pages; ep 7: 2; ep 14: 3; ep 17: 1) and the A10 leads
(ep 8: 1 page; ep 16: 4) are what the fields say; the advances (ep 1: 8; ep 12: 8; ep 13: 15; ep 15: 16 of 20; ep 18: 6 exclusive;
ep 23: 13) likewise. Exact partitions at 21, 35, 38, 41, 46, 55, 58, 69 (each sums to the chapter's page count).
**Ep 6 (ch 17 p.2-7, with ep 7 taking p.7-20):** this wiki's overlapping endpoints are a real convention, not typos — ch 75 is
split p.1-13 / p.13-20 and ch 77 p.1-7 / p.7-20, each summing to 21 on a 20-page chapter, i.e. a page split mid-page. So ep 6's
share of ch 17 is five full pages (p.2-6) plus part of p.7 (p.1 is left unassigned by the wiki, presumably the chapter's title
page). Five pages and a fraction is MORE than five, not "at most 5"; the mechanical normalizer reads the record as 6 and returns
`substantive`; the beat is the episode's cliffhanger (blog ep 6's last section ・混沌の亡者: Ironside summons the Chaos undead
over Sistana; blog ep 7 opens on the same undead attacking the townsfolk; licensor ep 7 opens on the completed ritual) — no
teaser/cold-open wording. END 17 is the better-supported value. The verdict's fallback "if p.7 is shared … A47 would demote to
16" counts a shared page as zero, which the rule's text does not say; and its precedent claim is inexact — wave-9's ch 77 p.1-7
share is six full pages plus a shared page, above the bar on any reading, so it is not "the identical shape". Sean's call
remains, but the facts favour the delivered value; the C1 continue is 17 either way.

### F5 — ep 5's C-part IS a ch-14 opening tag (NEW; corrects w12a's "unresolved") — position unaffected
w12a could not settle whether ep 5's cast list ending Anghalhad > Calden > Ironside meant a Sistana tag or the preview cast.
The blog settles it: ep 5's post (line 2巻第11話〜第13話) ends ・Cパート 「まさかのED終わりにCパートが描かれる。ちょびっとだけ
じゃなく、そこそこの長さ」 and ・シスタナの街 「シスタナの街に聳える丘に立つ屋敷。そこには多くのシスタナの街の民がやってきて
おり、家主のカルデン公が娘のアンと共にいる」, with the broadcaster's tweet 「次回はついにアンが登場!! そして話をしていた騎士は･･･!!」;
and ep 6's post opens ・冒頭 「前話同様、ナレーションとOPの前に本編がありました。内容は原作14話の冒頭部分。カルデン,アン,イロンシッドの
やり取りでした」. So ep 5 closes on a tag of ch 14's opening (the townsfolk gathered at Calden's mansion, Anne, a knight
speaking) and ep 6 plays that opening as its cold open. Under A47 the tag is ep 6's (ep 6 STARTS on 14 and re-plays the beat) —
END 13 stands, as the verdict already concluded. The correction on offer: ep 5's chapters_adapted may now carry
`14 (C-part tag of the opening, unquantified — re-played as ep 6's cold open)` with a `partial`, on two sources (the fandom
cast list + the blog); no source gives its page count, so leaving it out is also defensible. Curation's choice.

### F6 — ch 25 p.17-19 as the run's only omission — SOUND as delivered (medium, one page-level wiki)
The fandom ep-9 differences line is on the page verbatim: "In the anime, the Gouren match where Anghalhad bets on is not
shown"; the Cant location page (refetched) places the gouren tournament in ch 25 ("forcing her to recover it along Percival at
the local gouren tournament"; `manga = Chapter 25`, `anime = Episode 9`). The blog's ep-9 post is consistent though silent on
the pages: ・怒るアン (Anne storms off "to a certain place" with Percival as porter) cuts straight to ・ドニーとハウザー (the
tavern), and its only "why was this cut" complaint is Sylvan's glare; its ・勝負 section is Nasiens' drinking contest with
Howzer, not the gouren. No second page-level witness exists for this series. Position-neutral (END 26 either way); the
`abridged` + C3 clause is the right home.

### F7 — ch 20 `pages = 24` vs the ep-8 lead "p.20" — unsettled, LOW
The Chapter 20 page prints `pages = 24` (neighbours 18/19/21 = 20, 22 = 22); the ep-8 field's lead is `20 {{s|p.20}}`. If 24 is
right, "p.20" is mid-chapter and the wiki leaves p.21-24 unassigned (a gap in the wiki's partition, not in ours); if 20 is
right, the lead is the chapter's last page. K MANGA is app-only and Kodansha's record carries no per-chapter counts, so it
cannot be settled from here. Either way the lead is ONE page, `sliverStart` says scraps, pc gives ch 20 wholly to ep 7, and
START 21 stands. Worth one line in the source notes, nothing more.

### F8 — titles, dates and the wiki's date defect — CONFIRMED
ja-WP 各話リスト (refetched): 第5話 11月5日 · 第6話 11月19日 (the 11/12 break is real; the blog's ep-5 post embeds the
broadcaster's 「11月12日の放送は休止」 notice) · 第12話 2024年1月7日 · 第13話 1月14日 · 第18話 2月18日 · 第19話 2月25日 ·
第22話 3月17日 · 第23話 3月24日 · 第24話 3月31日 — all match stored. The fandom's Episode 23 page prints `airdate = March 17,
2024` (ep 22's date) — wrong, as wave 9 and w12b/w12d say; its Episode 22 page body also reads "is the 21st episode" — a second
prose defect on this wiki's episode pages. The chapter fields are unaffected. No repair arises.

### F9 — citation quality
Every URL the four verdicts cite was fetched and says what is claimed: the fandom (one wiki; sevendeadlysins.fandom is an
alias), pc (a fan-compiled bidirectional table, no page column — cross-check tier, used as such), the licensor synopses
(official; 7sins-4knights.net/story/N.html is live, 4knights-anime.com is dead as w12a says), nissi0725 (fan-tier, but a
tankobon-reading watch-along that quotes manga dialogue — a genuine independent instrument, correctly never cited alone),
Kodansha (primary for volumes). No content farm or AI summary is load-bearing. Two corrections for the source record:
(i) Kodansha's www.kodansha.co.jp/comic/products pages ARE machine-readable (w12b used three; w12c/w12d's "renders
client-side" refers to kc.kodansha.co.jp); (ii) the "pc splits only near-even shares" sentence in w12c (F2).

## Per-claim verdicts
- **(1) the two un-cross-cuts** — ep 18 → 58 [55] + rearranged, ep 19 → 61 [58] + rearranged; ep 22 → 72 [69] + backwards C2 continue 69, ep 23 → 75 [69] + rearranged: **SOUND**; pc's ch-69 dissent **REFUTED** (F1, F2).
- **(2) the v1-v9 volume table** (1-5 / 6-14 / 15-23 / 24-32 / 33-41 / 42-50 / 51-59 / 60-68 / 69-77): **SOUND**, publisher-confirmed for all nine; w12a's v4/v5 page counts (200p) are the fandom's, Kodansha says 192p — boundary-irrelevant (F3).
- **(3) six seam anchors** (6, 7, 12, 13, 18, 19) on pc + licensor + blog: **SOUND** (recap table).
- **(4) the A47/A10 calls** — ep 2 END 3, ep 7 END 20, ep 14 END 40, ep 17 END 54, ep 12 END 35, ep 8 START 21, ep 16 START 47: **SOUND**; ep 6 END 17: **SOUND** — the tail is five pages plus a shared page, above the bar; the verdict's END-16 fallback and its wave-9 precedent claim are the inexact parts (F4).
- **(5) ch 25 p.17-19** as the only omission: **SOUND** (medium, one wiki; blog consistent) (F6).
- **(6) ch 20 `pages = 24` vs "p.20"**: unsettled, position-neutral, LOW (F7).
- **(NEW) ep 5's ch-14 C-part tag**: **SOUND WITH CORRECTIONS** — the tag exists on two sources; END 13 unchanged; chapters_adapted/partial optional at curation (F5).

## Standing
**SOUND** (with three optional corrections at curation). All 23 anchors, 13 continues, 23 volumes and both un-cross-cuts
hold on independently refetched sources; the sliver normalizer moves nothing; no internal contradiction in any file;
monotone across the seam files; the fence holds. Corrections offered, none position-bearing: (1) ep 5 may carry the ch-14
C-part tag in chapters_adapted + a `partial` (F5); (2) w12a's v4/v5 "200p" → Kodansha 192p in the note that seeds the volume
table (F3); (3) strike w12c's "pc splits only near-even shares" sentence and w12c/w12d's "Kodansha unreadable" note from
anything that enters the source record (F2, F9).
