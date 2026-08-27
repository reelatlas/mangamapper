# eyeshield-21 — batch 20 wave 2 VERIFY (R24: verdict by Opus, verified by Fable 5, 2026-08-27)

Verdict: `scripts/ingest/research/batch20/out/eyeshield-21.json` (rows 22-36 + the ep-21 fence repair).
Scratch: `scratchpad/b20v2/eyeshield/` (Bandai HTML, fandom API wikitext, ja-WP wikitext, AFG chart, en-WP chapter/episode lists, MangaDex page images for chs 34/48/49/63/64/70/71/72/79/80).

## Mechanical pass — CLEAN

12 anchors (23-26, 29-36): `chapters_adapted` min/max == START/END on every row; summary's twelve `ep N = …` clauses match the rows exactly; volume == END's volume against the stored table (v7 53-61, v8 62-70, v9 71-79, v10 80-88; MangaDex confirms ch 71 = vol 9, ch 79 = vol 9, vol-10 TOC = 80-88); every continue equals the next anchored row's START (21→53=ep23, 23→61=ep24, 31→79=ep32, 32→82=ep33, 36→91=ep37); no anchor on 22/27/28; repair `old` (49 / "47-49") matches the stored row; all delivered ENDs sit inside the fence 21→49 · 37→91; the one END regression (31→81, 32→79) is annotated `rearranged`; type vocabulary is `filler` only (T27). Row identity 1:1 with ja-WP / Bandai / fandom by number + title + date (spot-checked 21, 22, 23, 32, 36, 37). No scope leakage (single 145-row entry, manga's own "Nth Down" space throughout). No content farms among the citations; en-WP episode summaries are fan-written and the verdict treats them as such.

## Findings, ranked by damage

### 1. REFUTED — the fence repair ep 21 END 49 → 48 (and chapters_adapted "47-49" → "47-48")

The repair rests on one inference: "Chapter 49 王は神へと挑む starts the Ojo vs Shinryuji spring final, which the anime skips." That is the chapter's TITLE, not its content. Page-level (MangaDex ch 49, 20 pp, `pages/ch49_p01..13.jpg`):

- p1 (colour spread): "TOUCHDOWN! … 20-20 … TIE-GAME!" — the Devil Bat Dive two-point conversion LANDS here (ch 48's last page, `ch48_p15/16`, is the dive in mid-air).
- p2-4: Hiruma's hose-truck stunt, "there's just 30 seconds left", "until the final second, aim for an interception".
- p5: "GAME OVER! Taiyou Sphinx 20 — Deimon Devil Bats 20". p6: "A draw…", Banba: "tying is not much different from losing".
- p7-11: Sena's twisted shoulder / the Devil Bat Dive named; Banba: "the game with the American team is yours … Deimon Devil Bats are now the Japanese representatives"; the magazine editor: "Deimon has become the representatives!"
- p13 onward: "we're off to Enoshima" — only HERE does the Ojo–Shinryuji final begin.

So ch 49 is 12 of 20 pages of Taiyo-game resolution and 8 pages of Enoshima. The anime's ep 21 ends the game: en-WP ep 21 "The match ends with a draw" (the verdict itself cites this line as evidence for 48 — it is evidence for 49: "a draw" is ch 49 p5-6); Bandai's synopsis is a "残り2分" teaser; ep 22 is Suzuna-only (Bandai 022, ja-WP 備考); ep 23 opens on the Americans accepting (ch 53). The tie, the whistle and Taiyo's concession — the episode's climax, not a trailing sliver — are ch 49 pages. AFG's "47, 48, 49" is right in substance; the stored 49 stands.

The verdict's other exclusion witness, fandom `chapters= [[48th Down]]` "alone", is not exclusion evidence: the same field lists only 53 on ep 23 (which the verdict itself anchors 53, 58-60) and only 61 on ep 24 (61-64). The field is a partial listing on this wiki.

What survives: the SECOND never-adapted range is real but smaller — ch 49 pp 13-20 + chs 50-52 (Ojo vs Shinryuji; Ikkyu's fandom debut pair 49th Down / Episode 37 holds; en-WP ep 37: "Hiruma informs them that Ojo lost to Shinryuji"; 50-51 as ep-106 flashback per the fandom ep-106 field and the stored anchor). The ep-21 continue 53 (parity) holds unchanged, as the verdict said it would.

Recommended ruling: DECLINE both repairs. If Sean wants the partial recorded, the honest afg-tier value stays END 49 with chapters_adapted "47-49 (ch 49 pp 1-12: the tie, the final whistle, Taiyo's concession; ch 49's Enoshima pages and chs 50-52 never adapted in running order — 50-51 only as ep 106's flashback)" — but that is a manual-tier enrichment, not a repair. Trap to capture: title ≠ content applies to the MANGA side too (the wave already named it for anime titles: ep 32 / ch 86). Also: a wiki `chapters=` field that is demonstrably partial on neighbouring rows cannot be read as "alone".

### 2. SOUND WITH CORRECTIONS — ep 26 END 71 (medium) and its note

The verdict describes ch 71 as "only its opening: the torn passports and the decision to fly". Pages (`ch71_p10..29.jpg`, 31 pp of which pp 2-10 are vol-9 front matter): ch 71 is the ENTIRE post-game aftermath — Sena on Panther/Shin (p14), Shin's "get stronger before the tournament" (p18), Musashi in the crowd (p22), Panther's farewell (p26), the wager falling due on both sides (p27), Hiruma shredding the passports (p28), the plane taking off "NO WAY!" (p29). The passports are the chapter's LAST pages, not its opening; ch 72 then opens already in flight (`ch72_p02`).

Bandai 027 opens: "惜しくも1点差で勝利を逃した泥門デビルバッツは、試合前の約束通り即日日本退去に。ヒル魔の強引さに呆然としつつ空路アメリカへ向かう" — the expulsion/departure is narrated as ep 27's opening situation. So the fork is real: if ep 26 carries the post-game (Shin, Panther, the wager, passports) it adapts MOST of ch 71 and END 71 is right; if ep 26 stops at the whistle, END is 70 and ch 71's beats are a canon fragment inside the filler ep 27 (a `graft`, no anchor, A1). Only witness for 71 is the fandom `chapters=` field, whose semantics are unreliable (finding 1). Keep medium; fix the note; 70 is at least as well supported. Nothing downstream moves (ep 29 starts at 72 either way). Nit: the episode title 野生のリアル is ch 70's 野生の現実 (en-WP) — same title, different rendering; the verdict quotes it as 野生のリアル.

### 3. SOUND — type corrections 22 / 27 / 28 canon → filler

Verified verbatim: ja-WP 各話リスト 備考 — row 22: `rowspan="2"|2本立て1時間スペシャル<br />22話はアニメオリジナルストーリー` (the rowspan is the special; the sentence names 22 only, 23 has no flag — correct); row 27: `rowspan="2"|アニメオリジナルストーリー` covering 28 (row 28 has no 備考 cell of its own). Fandom `Category:Anime-Original Episodes` (API categorymembers) lists Episode 22, 27, 28; all three episode pages have empty `chapters=` while 21/23/24/26/29-36 are populated. AFG chart rows: "22. … * Filler / N/A", "27. … * Filler / N/A", "28. … * Filler / N/A". AFL makes no claim on these rows (context: "AFL: —"), so the AFL=AFG one-source concern does not bite here — ja-WP and the fandom are the two independent legs, AFG is the third. Bandai 022/027/028 synopses are the Suzuna skate plot / the Cerberus-swap flight / the downtown pickup game — no chapter content. T28 met.

Ep 28 `graft {72}`: fandom Doburoku infobox = 72nd Down / Episode 28; en-WP ep 28 ends "Hiruma finally finds what he is looking for". A closing beat inside an original plot — fragment, filler stays, no anchor (T28/A1) — correct shape. Caveat: the chapter number is single-source; the same fandom page's prose says he "first appears during the Beach football match" and en-WP vol 9 reveals him as the runner-up coach AFTER the win (chs 73-74), so `{72}` may be `{72-74}`. Position-neutral either way. Ep 27's annotation says "the manga crosses the Pacific inside ch 71" — the takeoff is ch 71's last page and ch 72 opens in flight; immaterial.

### 4. SOUND — the 31 / 32 interleave is a real reorder

Page-level: ch 79 進めデビルバッツ軍! (`ch79_p02/03/13`) = distance-to-Las-Vegas 1980 km, "about 3 hours since we left", Doburoku's exhaustion check, then Kuroki/Toganou sneaking off at night and Jumonji — exactly Bandai 032 ("黒木と戸叶が逃げ出してしまったのだ… 次の日… 十文字までもが姿を消していた"). Bandai 031 = the march begins (ch 78) + "一方その頃日本では… パンサーが富士山で… 進へ勝負を挑んでいた" (ch 80); en-WP ep 31 = "Panther tries to challenge Shin and loses. Panther asks Shin if Sena would have gotten past him" (ch 81's resolution). Vol-10 TOC (`ch80_p05`) confirms 80 = The Highest Point in Japan, 81 = Shin vs Panther, 82 = 3000 Leagues in Search of Comrades. So 31 → 81 then 32 → 79 is a documented relocation (A18), not a transcription error; the fandom ep-31 field 78-82 is over-broad (82 = Suzuna's manga debut = ep 33, Bandai 033). Only nuance: ch 79's opening pages (day 1, "3 hours in") may sit in ep 31 rather than 32 — no page-level source for the anime's cut; the verdict's "day two" is loose (the desertion is that night / next day). Immaterial to END.

### 5. SOUND — the five PARITY continues

Each equals the next episode's START (mechanical pass). Unseen ranges named correctly for 23 (54-57 → ep 43), 31 (79 held), 32 (80-81 already seen), 36 (89-90 arrive at ep 38 via the stored ep-37 continue 89). The ep-21 note must be re-worded per finding 1: the never-adapted range is "ch 49 pp 13-20 + chs 50-52", not "49-52".

### 6. SOUND (medium) — ep 24 END 64

Ch 64's opening is page-verified (`ch64_p03`): "The loose ball is now in Eyeshield 21's hands! Is he going to score a touchdown all the way from there!?" under the 64th Down title; ch 63 ends on the Meteor 21 sack — "the shuttle pass has finally been stopped!" (`ch63_p19`). The episode cut rests on en-WP ep 25 opening "Trailing 14-6" (Sena's TD already scored) and Bandai 025 opening on the Sena–Panther vow (post-TD). Better supported: 64. Conservative alternative 63 if ep 24 ends on the sack cliffhanger (Bandai 024 ends at "セナはあることに気付く"). No page-level source decides the anime's cut; medium is right.

### 7. OUT-OF-RANGE A1 risk — eps 15 / 16: the claim HOLDS

ja-WP row 15: `|7月13日||15||アイシールドを探せ!||…||rowspan="2"|アニメオリジナルストーリー` — the rowspan covers row 16 (which has no 備考 cell). Fandom category lists Episode 15 and Episode 16 (both with empty `chapters=`). AFG: 15 → ch 34 with no flag, 16 "* Filler". Bandai 015 = Mamori tails Sena, chased by Deimon students and Habashira; Bandai 016 = Kurita blamed for the festival damage — nothing of ch 34. Ch 34 ファミリー·ファミリー page-checked (`ch34_p02/10/15/20`): Mamori's contact list, Monta's morning, the weight room (Ha-Ha Brothers 65 kg / Komusubi 110 kg), the bikes and the walk into City Eikou Stadium for Ojo vs Seibu — that is ep 17's material (Bandai 017: barbecue + Kid & Tetsuma). So the stored afg anchor 15 → 34 [34] is a chart artefact on a row two sources call anime-original: an A1 violation if retyped, and ch 34 would reattach to ep 17 (stored 35 [35] — a START question). ja-WP also flags 78, 126, 128 アニメオリジナルストーリー (126/128 carry the batch-17 "mixed" annotation but T6 types neither); 53 is fandom-only. Queue for T28 review, not a repair in this wave.

## Standing

- REFUTED: the fence repair (ep 21 END 49 → 48, chapters_adapted → 47-48) — decline; the stored 49 is correct at page level; the never-adapted range is ch 49 tail + 50-52.
- SOUND WITH CORRECTIONS: ep 26 END 71 (note wrong about ch 71's shape; 70/71 is Sean's fork, medium either way); the ep-21 continue note's "49-52" wording.
- SOUND: the other eleven anchors 23-25, 29-36 (titles cross-checked against en-WP's chapter list and the vol-10 TOC; Bandai synopses fetched for 021-037 and match the notes), the three type corrections, the 31/32 reorder, the five parity continues, the `graft` 28, `abridged` 23, `partial` 34/35.
- Out of range: the 15/16 A1 risk is real and should go to the T28 queue with 78/126/128/53.

Sources fetched: b-ch.com/titles/8777/{015,016,017,021-037}; eyeshield21.fandom API (Episode_15/16/21-24/26-29/31/32/37/106, Ikkyu_Hosokawa, Doburoku_Sakaki, Patrick_Spencer, Jeremy_Watt, Leonard_Apollo, Morgan, Sweeper, Natsuhiko_Taki, Suzuna_Taki, Volume_6/9/10, Category:Anime-Original_Episodes); ja.wikipedia アイシールド21 各話リスト wikitext; en.wikipedia List_of_Eyeshield_21_chapters + episodes (1-72) wikitext; animefillerguide.com/anime/eyeshield-21; api.mangadex.org (manga 30460ee1…, chapters 34/48/49/63/64/70/71/72/79/80, data-saver pages); tvguide.or.jp episode pages 21/22/26/28/31/32/37 (same text as Bandai).
