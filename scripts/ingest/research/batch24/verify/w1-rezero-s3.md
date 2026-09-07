# Batch 24 wave 1 — verifier report: re-zero-starting-life-in-another-world (rows 51-66, season 3 / Arc 5)

Verdict: `scripts/ingest/research/batch24/out/re-zero-starting-life-in-another-world-w1a.json` (Opus research-agent).
Verifier: Fable 5.1 (R24). Scope: R23 ON — the weight-bearing claims (A-F below), not a per-row citation fetch.
Method: every page I quote was fetched by me into `scratchpad/b24-verify-rezero-s3/` and grepped there. The MediaWiki
`action=parse&format=json` URLs the verdict cites serve their wikitext `\u`-escaped, so Japanese strings cannot match the raw
JSON bytes; my greps ran on the decoded `wikitext.*` of the cited URL (the same content). The licensor, Kadokawa, syosetu
and MAL pages are UTF-8 HTML and were grepped in RAW bytes. `validate.ts` and `scan.ts` were run; the DB rows were read.

## Re:ZERO -Starting Life in Another World- — recap baseline (stored → verdict → verifier)

| ep | stored | verdict | verifier |
|---|---|---|---|
| 51 | canon (wiki-minted, tv, "Theatrical Malice", 2024-10-02, no anchor) | END 16 [16] vol 16 {v16 ch 1-5 whole volume + v17 ch 4 graft}, high; canon confirmed | SOUND. en `Volume 16 (Ch 1-Ch 5), Volume 17 (Ch 4)`, es `Volumen 16 / Volumen 17 (capítulo 4)`, ru `Том 16, главы 1-5 / Том 17, глава 4`, zh `16卷（整卷）/17卷（第四章）` all in my bytes; v16 has no prologue (en/zh ToC: ch 1-5), so "the complete volume" is exact; title = v16 ch 5 on the en ToC (`Chapter 5: Theatrical Malice`), zh (`第五章：剧场型恶意`) and the author's index (`第五章１９　『劇場型悪意』`); licensor 第51話 sentences and Kadokawa's v16 blurb grepped verbatim; ja-WP's 90分拡大版 sentence verbatim. Title + date on en-WP, ja-WP (第51話 劇場型悪意 2024年10月2日), en fandom ep page (Oct 2 2024 broadcast) and MAL. |
| 52 | canon | END 17 [17] {v17 ch 1-2}; canon confirmed | not sampled; mechanically consistent |
| 53 | canon | END 17 [17] {v17 ch 2-4}; canon confirmed | not sampled; zh's stray `18卷（第四章）` confirmed on ep 53 (identical to ep 54's) |
| 54 | canon ("Operation: Take Back the Government Office", 2024-10-23) | END 17 [17] vol 17 HELD, medium; {v17 ch 3-5, ch 5 unfinished; + single-lineage v18 ch 1 share}; partial annotation; flagged | SOUND ON THE VALUE, ONE LABEL WRONG. Hold at 17 is what A47's existence clause prescribes and the pages support it (see D). But the note/annotation say ch 5 is unfinished because "ep 55 carries its Emilia/Regulus thread": the en fandom's Arc 5 page says v17 *concludes* with the Emilia-wakes/Regulus-virgin scene — ep 54's post-credits stinger — and ep 55 opens on Regulus's reaction, which is the v18 blurb's epigraph on Kadokawa's own page. The thread of v17 ch 5 that continues into ep 55 is the rooftop/Roy → Julius → Capella-hostage sequence (licensor 第55話). Fix the wording; END/START/volume unchanged. |
| 55 | canon | END 18 [17] {v17 ch 5, v18 prologue-ch 2}; canon confirmed | value not disputed (four wikis agree; en/zh 55 in my bytes). Wording only: the row's OPENING scene is v18's opening (a relocated opener under A12, not "the continuation of v17 ch 5"); START 17 still stands on the v17 ch 5 rooftop share. |
| 56-65 | canon | END 18,18,18,19,19,19,19,20,20,20 as the map; canon confirmed | not sampled; mechanically consistent (monotone, volume = END, START ≤ END) |
| 66 | canon ("The Result of the Battle for Priestella", 2025-03-26) | END 20 [20] vol 20 {v20 ch 1, ch 6-7, ch 7 unfinished}, high; partial; canon confirmed | SOUND. en `Volume 20 (Ch 1, Ch 6-Ch 7)`, es `Volumen 20 (capítulo 1 y capítulo 6-7)`, ru `Том 20, Глава 1, Главы 6-7`; zh prints `19卷（第一章，第六章~第七章）` (the volume typo, as the verdict says). Title = v20 ch 6 on the en ToC (`Chapter 6: Results of the Battle for Priestella`), zh (`第六章：普利斯提拉攻防战结果`), syosetu parts 74-76 verbatim; v20 ch 7 exists (`Chapter 7: Leaving Behind Ripples on the Water's Surface` / `第七章：水面留下波纹`). Straddle: en 67 `Volume 20 (Ch 7), Volume 21 (Prologue-Ch 1, Interlude)`, ru 67 `Том 20 / Том 21`, zh 67 `文庫正傳20卷(第七章)`; ja-WP ends 第五章 at 第67話. Licensor 第66話 synopsis is LN content. Title + date on en-WP, ja-WP, fandom ep page, MAL. The en fandom's 攻略戦 misprint confirmed (episode page AND Season 3 table). |
| 67 | canon (title "", 2026-04-08) — NOT in this ask | (sibling w1b) END 21 [20] vol 21 {v20 ch 7 from Anastasia's proposal…, v21 prologue, ch 1, interlude} | the seam is consistent across the two verdicts (F-ii). |

## Findings, ranked by damage

1. **(wording, renders in chapters_adapted / the partial) ep 54 names the wrong continuing thread.** The verdict:
   `v17 ch 3-5 (ch 5 unfinished — ep 55 carries its Emilia/Regulus thread)` and the partial's `its Emilia/Regulus thread continues
   into ep 55`. The pages: en fandom **Arc 5** → Adaptation Differences → Volume 17 → Chapter 5: *"The volume concludes with Emilia
   waking up in a mysterious bed, naked, … she encounters Regulus Corneas, who introduces himself and proceeds to ask her if she is
   a virgin. This scene originally happens in Chapter 49 of the web novel"* (my fetch, `fd-arc5.txt`). en-WP ep 54:
   *"[[Post-credits scene|Meanwhile]], Emilia wakes up naked in a bed and is greeted by Regulus, who asks if she is a virgin."*
   Kadokawa's v18 page epigraph (raw bytes): 「――素晴らしい。君は、僕の思い描いた理想の乙女そのものだよ！」; licensor 第55話 opens:
   「何を質問されているのかわからないエミリアの様子を見て、自らが思い描いていた理想の乙女そのものであると話し、目を輝かせながら喜ぶレグルス」.
   So the Emilia/Regulus scene is v17's LAST scene (in ep 54's stinger) and its continuation is v18's OPENING (in ep 55). What
   keeps v17 ch 5 unfinished at ep 54 is the rooftop thread: licensor 第55話 「都市庁舎の屋上でクルシュと共にロイと交戦していたスバルは、
   ユリウスに戦いを託し…そこには黒竜と後ろ手に縛られた人質の少女の姿があった」 — the Arc 5 page places "Capella transforms into Emilia as
   Subaru is facing her" inside v17 ch 5. Conclusion unchanged (ch 5 unfinished, C1 continue inside v17); the thread label must
   change. Same wording slip on ep 55's START basis ("the row opens on the continuation of v17 ch 5 (Regulus and Emilia…)") — the
   opener is v18's first scene, a relocated opener (A12); START 17 stands on the rooftop share.
2. **(citation over-claim, no data effect) "All sixteen stored English titles … confirmed on four sources".** Of the four named,
   only en-WP (the G59 mint source) carries our English strings; ja-WP and the licensor carry Japanese titles (they confirm the
   row and the date, not the string); the en Re:Zero Wiki's Season 3 table uses Yen Press renderings that DIFFER from stored on
   9 of 16 (52 "Resolution of Ice and Fire", 54 "The Operation to Retake City Hall", 55 "Muddy Stream", 58, 60, 63, 65, 66
   "Results of the Battle for Priestella") and has no row text for 57. No page REFUTES a stored title, so `repairs: []` is right;
   the second source for the strings is MAL's S3 episode list (id 54857, my fetch): all 16 titles and dates match stored
   byte-for-byte ("Theatrical Malice" Oct 2 2024; "Operation: Take Back the Government Office" Oct 23 2024; "The Result of the
   Battle for Priestella" Mar 26 2025). Dates are on ≥ 3 sources (en-WP, ja-WP 第51話 2024年10月2日 / 第54話 10月23日 / 第66話
   3月26日 under the 2025年 marker, fandom ep pages, MAL); all sixteen are Wednesdays (computed).
3. **(tooling, benign) `scan.ts` flags "summary cites chapters not in any anchor: 7, 5, 6, 1, 4".** Those are the volume-internal
   units ("v20 ch 7", "v16 ch 5", "v20 ch 6", "v18 ch 1", "v17 ch 4"), all present in chapters_adapted / annotations. The scan's
   `ch N` regex is space-blind on a volume-space owner — a capture candidate for the LN class (skip `v\d+ ch` on light_novel
   owners), not a verdict defect. `validate.ts`: ok (16 targets, 16 anchors, 0 hostile, 0 continues, 7 annotations, 0 repairs,
   1 type correction, 4 flags).
4. **(landing notes for the apply — nothing wrong, checked because a ruling must LAND).** (a) `lib/sliver.ts#sliverEnd` takes the
   trailing comma segment and requires a leading digit; every tail here starts with `v` ("v18 ch 1 (…)", "v17 ch 4 (…)",
   "v20 ch 6-7 (…)") → `no-tail`, so the A47 normalizer is INERT on this vocabulary (it will neither move nor list these rows —
   the end_sliver_mismatch census cannot see LN rows). (b) `heal-anchor-volumes` skips a series with no boundary table and never
   writes null (`if (!table?.length …) continue; if (want == null …) continue;`), and `volumeAtWrite` is called only by the
   continua writer — the delivered `volume` 16..20 survives; flag 2's request for boundaries is optional for display, not for
   truth. (c) `series.total_chapters / latest_known / total_volumes` are null and `volume_boundaries` is empty (read from the DB),
   so validate's chapter-space gate is skipped — the verdict's own flag says so.

## A. The instrument / space claim — SOUND
1. Arc map. ja-WP series article (pageid 3333726) line 223, verbatim in my decoded bytes:
   `; 第五章『歴史を刻む星々』（文庫第16巻 - 第20巻、アニメ第3期 第51話 - アニメ第4期 第67話）`; the 既刊一覧 row for vol 16 carries
   `rowspan="5" |第五章`; `第六章『記憶の回廊』（文庫第21巻 - 第25巻、アニメ第4期 第68話 - ）` follows. Independent lineages of my own
   choosing: **Kadokawa's product pages** (first-party, raw bytes) label vol 16 `シリーズ紹介　第五章 決戦の水門都市プリステラ編` and vol 21
   `シリーズ紹介　第六章 喪失のプレアデス監視塔編` — the arc opens at 16 and the next arc opens at 21; **re-zero.com/books** (the
   author-side official site) prints for Re:zeropedia 2 「第四章～第六章(10巻～25巻)」 (consistent bracket, not arc-isolating); the
   en fandom volume pages say v16 "1st volume of Arc 5" and v20 "5th and final volume of Arc 5"; the zh 小说 pages say 16卷 is
   Web第五章「刻画历史的群星」的第一卷以及开头 and 20卷 …第五卷以及结尾部分. Four lineages, one map: 16 → 20.
   Per-row map (51→16, 52-54→17, 55-58→18, 59-62→19, 63-66→20): the sampled rows verified on four wikis each; the rest read
   consistent with the summary and the structure notes (programmatic check: every summary range matches the anchors).
2. No foreign space. Every `chapters_adapted` uses `vNN ch N` / `prologue` as the printed ToC numbers them (en and zh ToCs in
   my bytes agree for v16/17/18/20). Web-novel numbering appears ONLY in notes and is labelled each time ("part 19 in the
   WEB-NOVEL space"); my syosetu bytes confirm 第五章１９『劇場型悪意』 and 第五章７４-７６『プリステラ攻防戦リザルト１-３』, and that
   『都市庁舎奪還作戦』 and 『濁流』 are NOT in the web index — which is exactly why the verdict cites no web part for eps 54/55 and
   says "fourteen of the sixteen". The comicalization (『第五章 水の都と英雄の詩』, 3 vols per ja-WP) is never cited for a position.
3. Convention. Programmatic scan: START ≤ END on all 16; `volume` = END on all 16; END sequence
   16,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20 monotone; the only rows whose chapters_adapted names a volume above END are
   51 (v17 ch 4 graft) and 54 (single-lineage v18 share) — both annotated by design.

## B. type_corrections (one entry, canon on all 16, "CONFIRMED AS STORED") — SOUND; not a no-op at apply
Basis tested on 51 / 54 / 66: the title-is-an-LN-chapter-title claim holds on two wiki lineages per row (en ToC + zh 章节) and
on the author's index for 51 and 66; the content claim holds (licensor synopses for 第51/54/55/66話 are LN content; Kadokawa's
v16 blurb sentences match 第51話 almost verbatim; en-WP summaries agree). Anime Differences on the en fandom name only slivers
for 51 and 54 (grepped: training montage, Wilhelm/Reinhard flashback, Elsa phantom "has several lines of dialogue, compared to
the light novel in which she did not speak", Heinkel/Felt "not displayed in the light novel despite still occurring") and are
EMPTY for 66 — T28's faithfulness clause keeps canon. AFL: 50 rows, last ep 50, no 2024 date (my fetch) — silent, as claimed.
ja-WP's S3 table has exactly 16 numbered rows (第51話-第66話); the 総集編 split exists only in ep 51's footnote (verbatim in my
bytes). Shape: `validate.ts` accepts the entry (vocabulary, list, 15 sources). It is NOT a no-op downstream: the census class
`type_default_unclassified` retires only when `EPISODE_TYPE_OVERRIDES[series][ep] != null` or AFL lists the number
(`audit-ui-truth.ts`), and `deriveVisibility` publishes a wiki-minted series only on "a T6 pin on the series" — the batch applies
since batch 21 generate the T6 map from `type_corrections`. So this entry is the vehicle by which a confirmed default stops
being a default; without it the per-row confirmations in `structure.notes` have no mechanical landing. Keep it (Sean's call).

## C. repairs: [] — SOUND (see finding 2 for the over-claimed citation set)

## D. First / last / middle anchors — 51 SOUND, 66 SOUND, 54 HELD AT 17 IS RIGHT; END 18 [17] is NOT proven
ep 54, the fork. What the pages say: en `Volume 17 (Ch 3-Ch 5), Volume 18 (Ch 1)`; ru `Том 17, главы 3-5 / Том 18, глава 1`
(a translation of en — its Differences bullet is en's sentence rendered); es `Volumen 17 (capítulo 3-5)` and nothing else; zh
`17卷（第三章～第五章）<br>18卷（第四章）`, and zh's ep 53 carries the IDENTICAL `18卷（第四章）` — a copy artifact, and v18 ch 4 is
歴史を刻む星々 / 名流青史的繁星, ep 58's chapter. That is one lineage for a v18 share, one against, one garbled. A47's existence clause
(ledger text: "the END HOLDS at the furthest chapter two sources agree on; the single-source share stays in chapters_adapted and
its partial says so") gives END 17 with a partial — exactly what was delivered. The pages then go further than the verdict:
the only ep-54 scene a reader could take for v18 (the Emilia/Regulus stinger) is v17's closing scene per the en fandom's own
Arc 5 page, and en-WP marks it a post-credits scene (teaser wording — A47's own sliver evidence even if it were v18). END 18 [17]
therefore fails R3 twice over. Confidence medium is right; the flag is right; the reader's continue lands inside v17 either way.

## E. R25 contradiction scan — CLEAN (mechanical, my script + scan.ts)
Summary map = anchors (all five ranges); "complete at 62" = ep 62's note ("Volume 19 is COMPLETE"); "v20 NOT complete" = ep 66's
partial; 15 high + 1 medium = counts; `repairs: []`, `continue_points: []`, `anchor_hostile: []` = summary; annotation episode
lists match the rows they describe (graft 51 ↔ ep 51's chapters_adapted; partial 54 / 66; rearranged 59,60,62 ↔ the ch 6 / ch 3
fragments on those rows; rearranged 63-66 ↔ 65's step-back; divergence 51,54,55,56 and abridged 51,57,58 name the rows' own
ranges); the four flags name rows the anchors carry (54; series-level; 67; the shorts). The structure notes' END sequence string
equals the anchors. The only scan output is the space-blind chapter regex (finding 3).

## F. The two hazards — both REAL, one line each
(i) en-WP "List of Re:Zero episodes" (my bytes): `== ''Break Time'' ==` at line 132 holds a second `=== Season 3 (2024–2025) ===`
at line 512 with 16 rows numbered 37-52 whose dates are exactly our sixteen (2024-10-02 … 2025-03-26) and whose titles are the
shorts' ("Night Tales of the Sleeping Oni", "Pre-Theatrical Malice", "Emilia Party Struggles"…); our stored titles are absent from
that page's own wikitext (the TV rows are `{{#Section-h:Re:Zero season 3|…}}` transclusions) and none of the 16 stored titles is a
short's title — rows clean, hazard real.
(ii) ep 67's seam: ja-WP ends 第五章 at 第67話; en/ru/zh 67 credit v20 ch 7 then v21; w1b anchors 67 → END 21 [START 20] with
"v20 ch 7 (from Anastasia's proposal to the chapter's end)" and the en fandom ep 67 synopsis opens "at the proposal of Anastasia" —
consistent. One coarse dissent for the record: Anime Corner's "where to continue" piece says the finale "concluded Volume 20" —
a volume-grain news claim (R1 cross-check only) against three chapter-grain wikis and ja-WP; it does not refute.

## Verdict on the file
**SOUND WITH FIXES** — every anchor value, the instrument/space claim, the canon confirmation and the empty repairs stand on the
pages; the hold at 17 on ep 54 is the ledger's own delivery and the pages strengthen it. Fixes before apply: (1) ep 54's
chapters_adapted and partial annotation, and ep 55's START basis — name the rooftop/Roy → Capella-hostage thread as v17 ch 5's
continuation and record that the Emilia/Regulus stinger is v17's closing scene whose continuation is v18's opening (values
unchanged); (2) the "four sources" title claim — say en-WP + MAL for the English strings (or cite MAL); (3) tooling capture:
`scan.ts`'s chapter regex and `sliverEnd`'s digit-first tail are both blind to the `vNN ch N` vocabulary of an LN owner — no
defect today, a P30 candidate for the LN class. Token usage: ≈ 210k (from 15.00M to ≈14.79M remaining).
