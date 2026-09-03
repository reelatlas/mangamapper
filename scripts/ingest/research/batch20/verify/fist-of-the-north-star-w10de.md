# Verifier report — fist-of-the-north-star wave 10, sub-blocks D + E (eps 127-132 / 133-138, lane A2 gap block)

Verdicts: `scripts/ingest/research/batch20/out/fist-of-the-north-star-w10d.json` (127-132)
and `…/fist-of-the-north-star-w10e.json` (133-138) — two Opus research-agents on adjacent
sub-blocks; the seam between them (ch 179) is the block's one real question.
Verifier: claude-fable-5-1 (cross-model), 2026-09-02. DB untouched; verdict JSONs untouched.
Method: mechanical row / summary / monotonicity / volume scan across BOTH files; refetched
hokuto.fandom via the MediaWiki API (chapter pages 171-189 with `vol`, page count and
cast-in-order; character pages Han, Jūkei, Xie, Hyoh, Kaioh, Buron, Kosem, Chain, Rock,
Ōnyūdō, José, Gamon, Gameleo, Akashachi, Nagato, Sayaka, Kuroyasha, Kaijin, Leia, Tao,
Shachi; Filler; Tensho_Honretsu; Kaioh_Messatsu-Tai; Hokuto_no_Ken_episodes);
rq87.flyingomelette.com/HNK/1/127-138/a.html (synopsis + Manga Differences);
hokutosite.sakura.ne.jp/sakuhin/gensaku/hokuto/127-138.html (Shift-JIS → iconv; synopsis +
漫画版との違い + ep-130 総集編詳細) and the same site's manga-side narrative
`/sakuhin/gensaku/hokuto/g18_syura.html` (敗北編 / 羅将ヒョウ編); en-WP "List of Fist of
the North Star chapters" (volumes 20-22 with ISBNs) as the independent volume witness;
`scripts/ingest/lib/rulings/air-dates.ts` for the ep-126 date ruling; `docs/rules.md`
T27/T28 text. Scratchpad: `scratchpad/w10v/de/`.

## Recap baseline

Fist of the North Star — stored per the wave-10 contexts: eps 109-151 are the
anchor-gap block (NO stored anchors inside; fence ep 108 END 136 [135] → ep 152 END 210);
all twelve target rows are stored `canon` (AFL: Manga Canon on every one), no annotations.

| row | stored | verdict | verifier |
|---|---|---|---|
| ep 127 — stored: canon, no anchor | → verdict (D): END 173 [172] high + rearranged{173} + divergence{172-173} | → verifier: SOUND (ch 172 cast opens Akashachi; hs127 synopsis opens on Akashachi waiting; ch 173 = Leia {Flash} + Akashachi {Mo}; hs127 「原作はハンvsケンの時」 and RQ87 "shown after Shachi kills the two rags" verbatim; Han 170-177/126-129, Kaijin 171/126 reproduce; v20 = 171-179 on en-WP + fandom) |
| ep 128 — stored: canon, no anchor | → verdict (D): END 176 [174] high + C1 continue 176 + divergence{174-176} | → verifier: SOUND (Tenshō Honretsu page: "volume 20, chapter 176" verbatim; ch 174 = Jūkei {1st}{Flash}; ch 175 cast = Shachi, Lin, Kenshiro, Han, Raoh {Flash}, Kokuoh {Flash}, Akashachi {Flash} exactly; RQ87's lever/"heavens command charge" line verbatim; ch 176's cast ENDS Leia, Tao, Jūkei — the C1 straddle is real) |
| ep 129 — stored: canon, no anchor | → verdict (D): END 177 [176 cont.] MEDIUM + rearranged{177} | → verifier: SOUND, medium is right and the fork tips the verdict's way (F2b): ch 176's cast ends Leia, Tao, Jūkei and ch 177's OPENS Lin, Shachi, Kenshiro, Han {Death} — so the marsh arrival is ch 176's tail, not ch 177's head; hs129's synopsis opens on Jūkei at the marsh + Leia/Tao's visit; 「レイアやタオがイカダから降りるシーン削除」 and 「原作ではハンが死ぬ間際に…アニメでは削除」 verbatim; RQ87 "flashback … shown after Han is defeated in the manga" verbatim; Han's index closes 177/129 |
| ep 130 — stored: canon, no anchor | → verdict (D): END 178 [178] high, type LEFT canon, C1 continue 178 + divergence{178} (9m28s clip show) | → verifier: anchor SOUND (Buron 178/130, Kosem 178/130-131, Chain {1st}{Death} in ch 178 reproduce; hs130 + RQ87 confirm Kosem's death withheld; the Filler page prints "130 - From 09:03 to 18:31 is a clip show" and hs130's 総集編詳細 lists 8 shots — all verified). Type = Sean's call (F3); the verdict flagged it honestly |
| ep 131 — stored: canon, no anchor | → verdict (D): type → MIXED + partial{179}; anchor END 179 [179] high; parity continue 180 | → verifier: retype SOUND (T28 met: hs131 「シエとケンとのバトル、ハンの遺体がヒョウのところに流れ着く以外はほぼアニメオリジナル」 and RQ87 "mostly filler arc" verbatim; Xie 179/131, Hyoh 179-210/131-152, Rock/Ōnyūdō/José anime-only, all reproduce; ch 179 = Xie {1st}{Death} + Han {Corpse} + Hyoh {1st}); anchor 179 SOUND; the CONTINUE and its note are WRONG at the seam (F1) — SOUND WITH CORRECTIONS |
| ep 132 — stored: canon, no anchor | → verdict (D): type → FILLER + graft{183, 186}, NO anchor (A1) | → verifier: SOUND (three independent sources verbatim: Filler page "132 - Except for the Centipede villains", RQ87 "This episode is filler … they serve Kaioh, not Gamon", hs132 「呪龍羅斬陣が登場する以外は全てアニメオリジナル」; Gamon = Anime (ep. 132); Kaioh Messatsu-Tai in ch 183 {1st}{Death} AND ch 186 casts; the sole-adaptation exception correctly fails — ep 135 adapts ch 183's guard scene with the substituted 守王隊, hs135 verbatim) |
| ep 133 — stored: canon, no anchor | → verdict (E): type → MIXED; END 179 [179] MEDIUM + rearranged{179-180} + partial{180} + graft{181-182} + divergence{179}; parity continue 180 | → verifier: retype SOUND (hs133 「…以外は全てアニメオリジナル」 + 「北斗２No1アニオリ回」 + 「原作ではレイアとタオにだけ」 and RQ87 "Most of this episode is filler" all verbatim; the Jūkei act is sole AND load-bearing; Filler page indeed silent on 133); END 179 SOUND and better-supported than the verdict itself claims (F2a); continue 180 = ep 134's START, consistent |
| ep 134 — stored: canon, no anchor | → verdict (E): END 181 [180] high + divergence{180-181} | → verifier: SOUND (RQ87 ep 134 "Kaioh makes his debut after the scene showing Jukei leaving Leia and Tao" verbatim; hs134 synopsis opens on Jūkei/Leia/Tao above Hyoh's castle; ch 181 cast = Kaioh, Hayabusamaru, Leia, Tao, Lin, Kenshiro, Hyoh, Jūkei exactly; 「ケンvsガメレオ追加」 verbatim; Gameleo = Anime (ep. 134); v21 = 180-188 on en-WP + fandom). One wording nit (F5c) |
| ep 135 — stored: canon, no anchor | → verdict (E): END 183 [182] high + divergence{182-183}; stays canon (NOT a recap) | → verifier: SOUND — I specifically tested the ask's worry and the memory-beat attribution: ch 182 = Ryūken {Flash}, ch 183 = Kaioh Messatsu-Tai {1st}{Death} + Raoh {Flash} + Toki {Flash}; BOTH hs135 (「幼い頃の自分と…光に包まれた赤子」) and RQ87 ep 135 ("Hyoh has a memory of standing with Raoh and Toki, and Raoh passes him a child") put the Raoh-baby memory in ep 135, so the ch-183 flash IS this row's; 「仙気雷弾の奥義内容が原作と異なる」 verbatim; 2000-year tragedy = ch 183's own title 伝説の血脈 |
| ep 136 — stored: canon, no anchor | → verdict (E): END 185 [184] high + divergence{184-185} | → verifier: SOUND (ch 184 = 玉砕！無想転生！！ opens the row per hs136/RQ87; ch 185 = Jūkei {Death}; hs136's three 追加 lines verbatim). The A47 hedge on the crucifixion is well taken: ch 186's cast OPENS with Kaioh Messatsu-Tai, and g18_syura notes they are holding up the execution stand — the stand scene is ch 186's head, so END 185 is exactly right |
| ep 137 — stored: canon, no anchor | → verdict (E): END 186 [186] high + divergence{186} | → verifier: SOUND (Akashachi {Death} ch 186, index 161-186/123-138 reproduces; hs137 「レイア達が…赤鯱達に救われるまでのシーン追加」 verbatim; RQ87 "Kaioh does not sink in the manga" verbatim; Shachi's feigned-madness confession relocation confirmed by hs128 AND hs137) |
| ep 138 — stored: canon, no anchor | → verdict (E): END 187 [187] high + divergence{187} | → verifier: SOUND (ch 187 cast = Kaioh, Shachi, Akashachi {Corpse}, Kenshiro exactly, 20 pages; hs138's 追加 list and 「２分２０秒」 verbatim; ch 188 cast = Kaioh, Shachi, Kenshiro, Hyoh and g18_syura's 羅将ヒョウ編 opens on Shachi meeting Hyoh = ep 139, so the handoff at 188 holds) |

## Findings, ranked by damage

### F1 — the seam: w10d's ep-131 continue (180) and its C3 note contradict w10e and the page evidence — SOUND WITH CORRECTIONS
w10d writes, for ep 131: continue 180, "ch 179's un-animated passages — Shachi and Lin
travelling with Kenshiro, Xie's own troop and the Valley of No Return trap he dies in —
are replaced by the anime's Rock material and are never staged in any later episode",
and in its summary "ep 133 (another agent's row) opens the ch-180 Kaioh material"; its
ep-131 note also says "ch 179 is animated nowhere else".

All three statements are wrong at the seam. Ch 179's cast is Xie {1st}{Death}, Shachi,
Kenshiro, Lin, **Leia, Tao, Jūkei**, Han {Corpse}, Hyoh {1st}, **Toki {Flash}, Raoh {Flash}**
— the Jūkei/Leia/Tao pages with the boys-across-the-sea flashback are ch-179 pages, and
hs133 says the anime stages exactly that scene in ep 133 (「ジュウケイがケンとヒョウの秘密と
過去を明かすシーン」; 「原作ではレイアとタオにだけだが、アニメではロック達も居合わせる」). w10e
delivers ep 133 as START 179 on precisely those pages. So ep 131 ends MID-ch-179 with a
later episode finishing the chapter — the identical shape w10d itself handles on eps 128
(→176) and 130 (→178) with a C1 continue INSIDE the straddled chapter. By the ledger's C1
and by parity with ep 133's START, ep 131's continue is **179**, not 180, and the C3
"never staged" list must be cut back to the Xie-troop / Valley passages only. w10d's own
last flag anticipated this ("if ep 133 turns out to open earlier than ch 180, the healer's
value wins") — so this is a curation correction, not a refutation. Damage if landed as-is:
a rendered continue one chapter past a straddle, and a note telling readers the Jūkei
revelation is never animated when ep 133 is its only adaptation.

### F2 — the two forks: both resolve toward the delivered values
**(a) ep 133 END 179 vs 180.** w10e marks medium because RQ87 says the manga's telling
happens "outside Hyoh's palace" and reads that as possibly ch 180's opening. The location
does not decide the chapter, and the page-level witnesses all point to 179: (i) the
flashback of the three boys (Toki/Raoh) is tagged {Flash} in ch 179 and NOTHING is tagged
{Flash} in ch 180 — and the fandom tags flashbacks consistently across 173/174/175/177/178/
182/183/189; (ii) ch 180 opens Leia, Tao, Jūkei with Jūkei LEAVING them (RQ87 ep 134:
"Kaioh makes his debut after the scene showing Jukei leaving Leia and Tao"), i.e. ch 179
ends and ch 180 begins at the same spot outside the palace; (iii) RQ87 ep 134 also says
that in the manga Leia already tells Shachi "Kenshiro and Hyoh are brothers" when they
meet — so the revelation precedes ch 180's Shachi/Lin pages. I could not get the pages
themselves; the one residual is that the Flash pair could in principle be a caption at
Hyoh's corpse scene rather than Jūkei's narration. Keep medium; END 179 stands and the
w10d/w10e plateau at 179 is a genuine split of ch 179 (Xie + corpse in 131; Jūkei act in
133; 132 adapts nothing), correctly annotated `rearranged` on 133.
**(b) ep 129 START 176 vs 177.** Ch 176's cast ends Leia, Tao, Jūkei; ch 177's cast opens
Lin, Shachi, Kenshiro, Han {Death} with Jūkei fifth and Leia/Tao ninth/tenth. If the marsh
arrival opened ch 177, Leia/Tao/Jūkei would head ch 177's list. They don't. The verdict's
reading (176 straddles 128/129; ep 128 takes a C1 continue) is the better-supported one;
medium is the right label since page counts are unknown.

### F3 — ep 130 canon vs mixed: Sean's call, numbers verified, the verdict's lean is defensible
Verified: the Filler page's "09:03 to 18:31" (9m28s, ≈40% of the slot) and hokutosite's
8-shot 総集編詳細 (ship crossing, Falco, Shachi vs patrol, Leia's school, Shachi vs Kaiser,
the pendant, the 20-years-ago crossing, Ken vs Han) — all re-shown pages. Under T28 as
written ("what is this episode's job?"), the job is ch 178 in full and this is that
chapter's ONLY adaptation, so canon + divergence is consistent with the rule; the recap is
padding, not a second standing. The precedents cut both ways and none is on point: ep 57
went mixed because the SOURCE was the sliver; eps 41/78/109 went filler because the recap
was the whole episode. No ruled row is "majority source + a large recap block". If Sean
wants the skip advice surfaced, mixed is defensible; the value (178) and the C1 continue
are unaffected either way. I would leave canon.

### F4 — w10d's ep-126 date flag is stale (no-op)
`lib/rulings/air-dates.ts` already carries G53 `126: '1987-08-13'` (wave 4, Sean ruled
2026-08-28). hokutosite/RQ87/fandom's Aug 13 agree with the STORED value; there is nothing
to repair. Drop the flag at curation.

### F5 — nits (values unaffected)
(a) w10e cites "the same site's g18_syura.html" with no path; it is
`https://hokutosite.sakura.ne.jp/sakuhin/gensaku/hokuto/g18_syura.html` (the `/gensaku/`
root 404s). Its content is as described: 敗北編 runs from the Boro corpses to the phantom
behind Kenshiro; 羅将ヒョウ編 opens with Shachi meeting Hyoh. (b) w10e's "three of
hokutosite's nine synopsis paragraphs" — hs133 has eleven paragraphs by my split, three of
which are the Jūkei act; the share claim survives. (c) w10e's ep-134 divergence says the
manga's Leia-catches-up-with-Shachi passage is "never animated", but ep 134's own closing
beat (Shachi tells Ken that Kaioh took Lin) is that passage restaged with changed agency
(ch 182's opening cast is Shachi, Kenshiro, Leia, Tao); A47 keeps END 181 regardless
since ep 135 starts on 182 — a wording tidy-up, not a value.

## What I checked and found SOUND (the bulk of both verdicts)

- **Row accounting**: 11 anchors + ep 132 (type_corrections + a summary A1 statement) =
  all 12 targets; no anchor on any filler row; no A44 rows; T27 vocabulary clean
  (mixed / filler / mixed); no adopted / side_source rows in play.
- **Internal consistency**: every `chapters_adapted` agrees with its own `start_chapter` /
  `end_chapter`; every volume matches the chapter (127-133 → v20, 134-138 → v21); both
  summaries' END lists reproduce their rows (w10d's "hands off … ep 133 opens ch 180" is
  the one summary sentence contradicted — F1).
- **Monotonicity across the two files**: 173 → 176 → 177 → 178 → 179 → (132 none) → 179 →
  181 → 183 → 185 → 186 → 187, non-decreasing inside the fence 136 … 210; the single
  plateau (131/133 both 179) is a real chapter split, not a transcription error (F2a).
- **Volumes**: en-WP (Shueisha v20 ISBN 4-08-851680-X = 171-179; v21 4-08-851824-1 =
  180-188; v22 = 189-197) and every fandom chapter page's `vol` field agree with the
  stored boundary table exactly; the Japanese titles for 171-188 match on both.
- **Citations**: all 20 character `appearances` fields reproduce EXACTLY as quoted (Han,
  Jūkei, Xie, Hyoh, Kaioh, Buron, Kosem, Akashachi, Nagato, Sayaka, Kuroyasha, Kaijin,
  Leia, Tao, Shachi; Rock / Ōnyūdō / José / Gamon / Gameleo anime-only); every quoted
  Japanese line on hs127-138 and every quoted RQ87 sentence is verbatim; the Tenshō
  Honretsu pin and the Kaioh Messatsu-Tai substitution text are verbatim; the Filler page
  lists 111 / 130 / 132 for HnK2 and not 131 or 133, as both verdicts state. No content
  farms; the three pillars are independent of each other and of AFL/AFG.
- **Row identity**: hokutosite's 放映日 and RQ87's broadcast dates for 127-138 are the
  stored dates to the day (Thursdays 1987-08-20 … 1987-11-05); RQ87's URL space is our
  cumulative numbering (127 = HnK2 ep 18, 132 = ep 23, 137 = ep 28). No scope leakage.
- **Retypes**: 131 (mixed), 132 (filler + graft), 133 (mixed) each meet T28 on ≥ 2
  independent per-episode sources plus the fandom index; the sole-adaptation exception is
  applied correctly in all three (holds on 131 and 133, fails on 132).
- **Continues**: 128 → 176 and 130 → 178 are C1 at their own END; 133 → 180 is parity with
  ep 134's START. Only 131 → 180 is wrong (F1).
- **A47**: applied where it matters (133's ch-180 teaser; 136's crucifixion, which the ch
  186 cast confirms is the next chapter's head; 138's possible ch-188 dip).

## Verdict on the verdicts

w10d: five anchors sound, both retypes sound, ONE continue to correct at curation (ep 131
→ 179 with the C3 note trimmed, F1) and one stale flag to drop (F4); the ep-130 type is
Sean's call with the verdict's lean defensible (F3). w10e: six anchors sound, the retype
sound, the ep-133 fork honestly flagged and in fact better-supported than the author
believed (F2a); nits only (F5). Nothing in either file is REFUTED.
