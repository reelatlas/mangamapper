# Batch 22 wave 3 — adversarial verification: record-of-ragnarok-w3.json (verdict-verifier, Fable 5.1; verdict by Opus, R24)

Scope: eps 14-17 (three new anchors + the ep-17 START repair) and the round-level flag. The instrument re-derived independently: every `adapted=` field fetched via api.php (including the parts after `<br>` a naive regex drops); page-closure recomputed; programming-cafe's 8 tables fetched; page histories read; `lib/sliver.ts` run on the delivered records.

**Overall: SOUND WITH CORRECTIONS (wording), and the flag is CONFIRMED — ep 22 is worse than flagged.**

## Recap baseline

Record of Ragnarok

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 13 | canon; END 22 [20] {20 (pp.17-31), 21, 22 (pp.1-13), 24 (pp.1-26)} v6; continue 22 + C3 | untouched | untouched; the continue 22 now confirmed by ep 14's START 22 |
| 14 | canon; no anchor | END 24 [22] {22 (pp.14-34), 23, 24 (pp.27-54), 25 (pp.1-3)} v6; continue 25 parity; rearranged + partial{25 pp.1-3} | **SOUND WITH CORRECTIONS** — values hold; the `why` must say programming-cafe's leading '21' is an ASSERTED claim (twice: the 対応表 row and the per-chapter table `ch 21 → 2-1,2(14)`) REFUTED ON CONTENT (ch 21 — Heracles' intro, Doyle, the scissor Völundr — is entirely inside ep 13's plot; ep 14 opens on the tattoo-price explanation = ch 22's back half), not 'a ±1 wobble'; even a few ch-21 panels would keep START 22 under A10 |
| 15 | canon; no anchor | END 26 [25] {25 (pp.4-61), 26} v7; continue 27 | **SOUND** |
| 16 | canon; no anchor | END 29 [27] {27, 28, 29 (pp.1-24)} v7; continue 29 | **SOUND** (the opening beat — Anne in Mary's room — is ch 29's opening relocated forward, fandom Differences; a far-later relocated scene is never the position) |
| 17 | canon; END 30 [20] {20-30 (Round 4 complete)} v8 — `applied/batch-12.ts:147`, section '// record-of-ragnarok — round boundaries' | REPAIR START 20 → 29, chapters_adapted → '29 (pp.25-50), 30, 32 (pp.6-8, 30-32), 33 (pp.27-60)'; END 30 / v8 stand; continue 31; rearranged{32, 33 partial} | **SOUND** — both lineages put ep 17's first chapter at 29 (fandom `29 (p. 25-50)`; p-cafe `29, 第8巻 30`, per-chapter `ch 29 → 2-4,5(17)`); frame continuity (ep 16 ends 'Jack barely starts singing and stands up'; ep 17 opens 'As Jack the Ripper stands up …'). sliverStart → lead-is-start; sliverEnd → tail-not-end, END 30 unchanged; anchor_nonmonotonic (END-only) and anchor_start_offtrend do not fire; the trailing-segment-above-END shape is precedented by the standing ep-13 row. APPLY: c3Ahead(chapters_adapted, 31) = [32, 33] → the continue_note MUST carry skip language (the verdict's `why` has 'skip' / 're-read' — write that, never a bare parity note). Fix the annotation's description of the dissent: p-cafe books ch 33 to eps 18 AND 19 (`2-6,7`), not '19 alone'; ch 32 to 19 alone. |

## The instrument
Closure against the chapter pages' own `page=`: ch 20 (52) ✓, 22 (33 — parts union 34, off by one, admitted), 24 (54) ✓, 25 (62 — union 61, admitted), 29 (50) ✓, 32 (38) ✓, 33 (60) ✓, 34 (30) ✓, **36 (40 — parts union 34: a 6-page gap, outside the zone)** → 'page-exhaustive' is fair for chs 20-34, NOT a blanket trust for future waves. Page history: the ep-14 and ep-17 `adapted=` fields were each written in ONE edit by ONE editor (Serch-9564) on 2023-01-26 / 27 and never changed — one editor's day-of-release reading; the closure is its internal check and programming-cafe the only independent lineage. Adequate here; the verdict's 'bleach-152-159 shape' overstates provenance.

## Row identity (R20) — clean
en-WP EpisodeNumber / EpisodeNumber2 13/1 … 22/10 all 2023-01-26, 23/11 2023-07-12; ja-WP 第2期 第1〜5話 same titles; the fandom `episode=14 | jname=不屈の闘神`. Each target episode carries its namesake chapter (23 不屈の闘神 / 25 怪物の誕生 / 28 最後の御業 / 30 鎮魂). No off-by-one.

## A47 on ep 14 — SOUND
The 3-page count is page-marked (`25 (p. 1-3)`); ep 15's field opens `25 (p. 4-61)`; content matches (ch 25 opens on Jack musing on Heracles' death colour and singing London Bridge = ep 14's last beat). sliverEnd(…, 25, 25) → owned-tail, END 24, 3 pp — the delivered END is the normalized value.

## Continues — SOUND
14 → 25 (C1 mid-25 = C2 ep 15 START 25); 15 → 27; 16 → 29 (mid-29 p.24/50); 17 → 31 (the next ANCHORED row is ep 22, stored START 31 — coincidentally the round's first chapter; the fandom / p-cafe give ep 18 = 31, so parity lands on 31 either way; the verdict's 'ep 18 STARTS on 31' cites an unanchored row — wording only).

## THE FLAG — CONFIRMED, and ep 22 is worse
ep 22 fandom `41, 42, 43 (p. 1-15, 22-43)`; p-cafe 第10話 崖っぷち = `41, 第11巻 42〜43`, per-chapter `ch 43 → 2-10` (ep 22 ONLY). Stored END 42 [START 31] {31-42 + ch 43 partial}: the START is a round span (real 41) AND THE END IS SUSPECT — ep 22 adapts 37 of ch 43's 43 pages (sliverEnd → substantive) → END 43 is the likely truth; the S2P1 / S2P2 seam (22 → 23) needs its own narrow ask. ep 27 fandom `52, 53, 54, 55 (p. 21-23)`; p-cafe `52, 第14巻 53〜55`: START 43 is a round span (real 52); END 54 right (a 3-page ch-55 tease, A47 holds). The whole batch-12 RoK map is round-grain (12 [1], 17 [20], 22 [31], 27 [43], 33 [55], 38 [66]) — a wave-4 ask on the same instrument (with the ch-36 caveat).

## Internal — clean
Anchors agree with their own chapters_adapted / START / END / volume (24 v6, 26 v7, 29 v7, 30 v8 on both lineages). Summary wording nit: 'union to the chapter's own page count … ch 22 (33 pp.) … ch 25 (62 pp.)' is contradicted by its own arithmetic (34, 61); the structure note owns it. The `rearranged` on ep 14 is defensible; the alternative curation is extending the standing eps 12-13 fact to [12, 13, 14] — Sean's call, not an error. fami-geki declared cross-check only; nothing rests on a content farm.
