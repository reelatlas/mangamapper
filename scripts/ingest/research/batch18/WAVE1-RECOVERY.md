# Batch 18 — wave 1 recovery record (2026-08-26)

Standing tier (T4-GLOSSARY §6 step 5). PROTOCOL pinned (R31). All seven
verdicts in `out/` pass `validate.ts` (every target row exactly once,
vocabulary clean, adopted → basis, no self-contradiction).

## Landed (7/7, ~1.13M subagent tokens)

| target | rows | verdict | adoption proposed | repairs |
|---|---|---|---|---|
| boruto A (2-105) | 68 | ALL filler | none — argues Kodachi's blanket ストーリー監修 cannot discriminate canon from filler | 0 (7 flags) |
| boruto B (120-220) | 51 | 50 canon + adopted{author}, 155 filler | Kodachi ストーリー監修 through ep 216 (en/ja-WP + narutopedia); Time Slip 128-136 = Kishimoto's own story | 0 (ep 220 END 55 vs 56-58 flagged) |
| beyblade-metal-fusion (4-45) | 32 | ALL filler | none — 原作 is a media-mix credit; characters flowed anime → manga | ep 3 mixed → filler |
| fullmetal-alchemist 2003 (8-51) | 27 | 3 canon / 8 mixed / 15 filler | recommends filler for the Bones half (Arakawa ORDERED a different ending, Asahi 2005; no 監修); adopted{author} reading laid out | ep 37 (non-target) |
| dragon-ball-super | 15 | 13 filler / 2 mixed | none — Toriyama's outline is commissioned text; the supervised manga diverges where AFL says anime canon | 78, 91 → mixed |
| outlaw-star (1-17) | 13 | 1-2 canon (chs 1-4); 11 canon + adopted{author} | Ito is 原作者 of BOTH branches, plotted the anime since 1994, wrote ep 19 | ep 1 / ep 8 air dates (AFL typos; ep 8 = the airdate_regression queue entry) |
| soul-eater (39-51) | 13 | 39-40 mixed / 41-51 filler | none — no Ohkubo credit; studio ending (A-7 class) | 0; ep 37 flagged |

## Verification (R24, Fable, ~0.71M) — reports in `verify/`

| verdict | result |
|---|---|
| beyblade | SOUND — apply as written |
| boruto A | SOUND WITH CORRECTIONS (text) |
| boruto B | **REFUTED as filed** — Kodachi's supervision is arc-blind; 41 of 50 adoptions fail the protocol's test. Survivors: 128-136 (high), 8-9 (medium), 67-69 as repair (high), 34 at Sean's option |
| FMA 2003 | SOUND WITH CORRECTIONS (text); two extra primaries strengthen filler |
| soul-eater | SOUND WITH CORRECTIONS — ep 40 also grafts ch 44's tail; ep 37 should be a repair |
| DBS | SOUND WITH CORRECTIONS — 94-95 must match 91's standard (→ mixed) or 91 re-argued; ep 78 chapters "28 (partial)"; two 脚本 names wrong |
| outlaw-star | SOUND WITH CORRECTIONS — recommends SOURCE_TYPE_OVERRIDES → original (Sunrise official page; Yatate on the manga); eps 1-2 chapters collide with Sean's A40/G3 rulings that context.ts failed to print |

## Decisions for Sean (apply blocks on these) — sharpened by verification

1. **Boruto A vs B contradict on the same basis.** B adopts 120-220 on Kodachi's supervision; A rejects that basis for 2-105 because it also covers rows everyone calls filler. Either (a) adoption follows storyline continuity with the source (B's line: 120-220 adopted, 2-105 filler except narrow author rows 8-9 / 34 / 67-69), or (b) supervision alone is no basis (A's line: everything unruled → filler, Time Slip 128-136 adopted on Kishimoto's story). Both agents agree 221-286 is post-tenure → `community` stands, and **282-286 (Sasuke Retsuden) → side_source**. Verifier target.
2. **FMA 2003 original half**: filler (recommended) vs adopted{author}. Also eps 11-12 → canon + side_source (the Land of Sand novel, not Arakawa's) — accept spin-off-novel adaptations as side_source? Ep 13 / ep 37 must agree.
3. **Outlaw Star's identity**: 11 adopted{author} rows, or rule the SERIES `original` via SOURCE_TYPE_OVERRIDES (manga = sibling, T21 class) so every row is canon by definition — cleaner, and the agent's evidence supports it (原作 credit on both branches; both diverge by design).
4. **DBS Resurrection 'F' block (eps 18-27 stored canon)**: the manga skips it entirely → side_source (film / Toyotarou's RoF manga) or no position. Out of scope; batch-18 narrow task.
5. DBS 94-95: filler (ruled) vs mixed at ch 32 — split evidence, written up.

## Traps learned this wave (→ research-agent.md at capture)
- AFL publishes TWO contradictory lists for Boruto (32-35, 70, 104-105 differ).
- Narutopedia `boruto=Yes/No` is unreliable; only the `chapters=` field is.
- souleater.fandom asserts false anime-before-manga chronology (ch 45 shipped before ep 40); its per-chapter correspondent fields hold.
- beyblade: tankōbon numbering runs +3 from ch 9 (CoroCoro chapters split); AniList 56 = 46 + ch 0 + 8 side chapters.
- FMA: AniList's 116 includes 8 bonus chapters; the serialized space is 108.
- Kanzenshuu has no DBS episode guide; AFG no DBS table.
- sunrise.fandom ja / weblio are ja-WP mirrors — not independent.

## Outstanding
- Verification (R24, different model): boruto A + B together (the contradiction), FMA 2003, soul-eater, beyblade, DBS, outlaw-star — all six blocks per the wave plan.
- Wave 2 (A-7 endings, 8 agents) and wave 3 (narrow bundles + bases) not dispatched.
- Apply script `apply-research-batch-18.ts` not written (needs the rulings above).
