# Batch 18 — wave 3 recovery record (2026-08-26): the narrow bundles

Four bundled agents, 17 series, 24 rows; all 32 batch-18 verdicts pass
`validate.ts`. ~0.82M subagent tokens. NOT verified, NOT applied.

## Landed

| series | rows | verdict | note |
|---|---|---|---|
| one-piece | 9 | 453/454/456 MIXED (Oda's cover-page side story ch 543-560 IS the plot, T28); 213/215/499/506/775/1084 filler + ties | LOUD: cover chapters run 8-11 ahead of the main line — rows must stay anchorless; repair 455 → mixed for consistency |
| akame-ga-kill | 5 | 20/21 mixed (ch 46/51-53 repurposed — BD interview via ja-WP); 22-24 filler + divergence | Takahiro's シナリオ監修 credit considered, recommended AGAINST (his manga overwrote every outcome); flagged; 20/21 anchor-hostile (7 unseen chapters) |
| black-clover | 3 | 13 filler; **55-56 canon + side_source** (LN 暴牛の書, Jump J-Books 2016; fandom + AFG agree; ep 56 closes on ch 81-82 → partial, no anchor) | 2 repairs |
| noragami | 2 | filler, high | Adachitoka drew Rabo (character 原案), the studio wrote the arc "without stealing the manga's future"; Rabo entered the manga in 2021 as a prequel gaiden — character canon, not story adoption; flagged |
| sgt-frog | 2 | filler ×2 | NEW SOURCE: ja-WP アニメエピソード一覧 ● index (原作に沿った内容) at segment grain across all 358 rows, matched stored typing 10/10 — a cheap full re-verify later |
| girls-last-tour | 1 | canon ch 9-10 (AFL mislabel) | repair; TRAP: MangaDex EN feed omits ch 11 → runs one low from ch 11 |
| vinland-saga | 1 | filler + graft{21.5} (Ylva gaiden transplanted) | T28 clean; eps 7-8 adapt ch 1-2 AFTER 1-6 adapt 2-17 (deliberate rearrangement — monotonicity audits will flag) |
| 86-eighty-six | 1 | **canon + side_story** (LN vol 10 "Lethe" + "Fido" + vol 2 ch 2 opening) | repair from filler; ANN's "anime original" recorded as dissent |
| demon-slayer | 1 | filler + loose_parallel{53-54} (new TV episode, Rengoku's road) | |
| durarara | 1 | filler + loose_parallel (S1 OVA 天下泰平; pre-debuts vol-4 characters) | medium; STRUCTURE: components off by one from row 25 (S1 OVA uncovered, row 61 orphaned) |
| fullmetal-alchemist-brotherhood | 1 | filler | Isaac's design from Arakawa's rough — commissioned, not declared; adoption laid out, not proposed |
| high-school-of-the-dead | 1 | filler + abridged (OVA, island exists only in the OVA) | supports the N7 placement ruling |
| naruto-shippuden | 1 | 28 filler + partial{275-276 seam} | |
| steins-gate | 1 | filler (BD-9 unaired special; VN default holds) | |
| sword-art-online | 1 | **row 50 = the Ordinal Scale MOVIE, not Extra Edition** → canon + adopted{author} (Kawahara wrote story + screenplay; events folded into LN canon) | repair; STRUCTURE: row 50 has NO component; Extra Edition is not a row |
| beastars | 1 | canon; basis = **studio** (Itagaki 「本当に自由にやってください」; incorporation time-barred — manga ended 2020) | provisional marker lifts |
| rurouni-kenshin-2023 | 1 | 44 → **canon + adopted{author}** (Watsuki 脚本監修 on the Kyoto arc — official Aniplex staff page; Real Sound names the 炸裂弾 redesign and the expanded Rengoku scenes that ARE ep 44) | repair; title trap: Acts 100-102 share titles with eps 43-45 — never anchor 44 to Act 101; ep 44 has no stored title |

## Verification targets (weight-bearing)
black-clover 55-56 (novel), one-piece 453-456 (cover story canon → mixed + the 455 repair), akame 20-21, 86 ep 10 (canon on the LN), SAO 50 (premise correction + the movie's adoption), kenshin-2023 44 (author repair). The rest agree with stored typing or are single-row filler calls.

## Decisions for Sean
1. Kenshin-2023: Watsuki's 脚本監修 is a SERIES-LEVEL regime for S2's anime-original material (34, 44 today; S3 rows will arrive) — encode as a ruling with both halves (his 「自分は漫画家だから」 counterweight is in the flags).
2. SAO row 50 = Ordinal Scale: canon + adopted{author}, and the component/structure fix (I-family) — a movie numbered into the run.
3. Akame 20-21 mixed; Takahiro adoption — the ready-made basis text is in flags_for_sean; recommended against.
4. One-piece 455 → mixed (consistency with 453/454/456).
5. Structure tasks (I-family, not typing): durarara components off by one; SAO row 50 no component; 86's Special Editions / SAO Extra Edition must not be inserted without renumbering.

## Traps learned
- ja-WP アニメエピソード一覧 ● indexes (sgt-frog) — segment-grain canon flags for gag series.
- MangaDex EN feed can OMIT a chapter (girls-last-tour ch 11) — off-by-one from there.
- Title reuse across acts/episodes (kenshin Acts 100-102 vs eps 43-45) — never anchor by title.
- Cover-page side stories are canon but run AHEAD of the main line (one-piece 543-560 vs ep 452 at ch 549) — mixed rows that must stay anchorless.
- A numbered row can be a MOVIE (SAO 50 = Ordinal Scale), not the special the title suggests — check the component.
