# Batch 21 — wave 3 recovery record (2026-09-04)

Read this first if the session was cut. Wave 3 = what the census exposed after the wave-2 apply (§12.111-112): the five reorder holes the shippuden ep-112 anchor opened (lane A2) and the last STRONG `type_source_disagreement` rows (lane C). 3 agents (Opus), 3/3 landed, validated (two shape defects normalized: beelzebub's `episode` → `episodes` list; boruto's type_corrections took the same rows' anchor_hostile sources), contradiction-scanned, committed (a38f3a9 / b50ca50 / e1d0d35). Verifier (Fable over Opus, R24) in flight → `verify/w3-flips.md`.

## Results
| series | rows | result |
|---|---|---|
| naruto-shippuden | 113-117 | 5/5 anchored 344 [343] / 346 [344] / 347 [346] / 348 [348] / 350 [349] — monotonic between ep 90's 343 and ep 118's 351; the A18 holes close; NO repairs (ep 90 / 112 / 118 pointers all confirmed). One flip: 113 mixed → canon (recap clause). Continues: 113 → 344 (C1), 114 → 346 (C1), 117 → 351 (C2 parity = ep 118's START, C3 note). |
| beelzebub | 17, 34, 39 | 17 → filler (ch 12 / 23 shares are slivers restaging pages eps 15-16 / 26 carry), anchor 23 + continue DELETED; 34 → mixed (a continuous ch-69 scene adapted nowhere else, ~minority of runtime), anchor 69 confirmed; 39 → filler (82-83 slivers; ja-WP: 石矢魔ランド 初出はアニメ版), anchor 83 + continue DELETED. Deletions are P8 (afg-tier rows) → manual-tier removal. |
| boruto | 1, 24, 127, 157 | 1 → filler + graft{1} (the Kawaki flash-forward cold open = a sliver of ch 1, adapted properly at ep 53); 127 → filler (zero source content); 157 → filler + graft{11} (the Katasuke report); 24 CONFIRMED mixed + chain_source{Naruto: ch 700, 700+5} + divergence. All four anchor_hostile on no-position bases (none 'behind'). |

## Traps learned this wave
- **The ask writer's premise failed twice: the census class reports OUR parsed label, not the page's colour.** The wave-3 asks said "AFG prints FILLER (red, no chapter)". Beelzebub's AFG page is the OLD format (no class attributes, `* Filler` inside the title cell, chapters printed — 17 = '12, 23', 34 = '69', 39 = '82, 83'); Boruto's four rows are BLUE `* Anime Canon` with N/A, which lib/afg.ts maps to filler. Both agents refuted the premise first (R3) and then did the work — but a wrong premise costs a re-fetch and invites a wrong frame. Rule for the plan step: quote the class line verbatim and say "our parsed label"; never translate a label into a page colour or a column state.
- **AFG's chapter column on old-format pages plateaus and runs backwards** (beelzebub rows 38-41 print 82; rows 15/16 print 23 then 21-22) — a sizing instrument only where it carries timed notes; on old-format pages it is Narutopedia/fandom-infobox lineage or worse.
- **Boruto has no source-chain entry** (`lib/rulings/source-chains.ts`): ep 24's chain_source lands as `chain_source_unmapped` until Sean rules the chain (works proposed in the verdict's flags: Naruto 30011 → Naruto Gaiden → Boruto; the one-work / two-work fork for the Gaiden). Same shape on eps 19-23 and 39 (stored canon on Naruto-space Gaiden chapters, no chain annotation) — out of ask, queued.
- **AFL's Mixed bucket on Boruto is loose** (fires on a two-minute cold open, a closing status report, an episode with no source content). Untested members: 18, 93-95 (queued, not researched).
- **Beelzebub out-of-ask crumbs**: ep 15 (ja-WP bold = anime-original, stored mixed with an anchor, AFG '23' unmarked — the one row where AFG's class and ja-WP's marker disagree), eps 26-28 (bold on ja-WP), ep 51 (half original, from wave 2).

## Generated recap baselines (baseline.ts — the DB + the verdict; P5)
### naruto-shippuden — recap baseline (naruto-shippuden-w3.json; 5 rows named)
| ep | stored | → proposed |
|---|---|---|
| 113 | mixed | canon; anchor 344 [343]; + recap{Part I material, all previously animated by the 2002 series: the Forest of Death encounter and the swallowed scroll, the Sharingan/Dragon Fire counter, the Cursed Seal of Heaven and Anko, the Yoroi Akadō match and the Lion Combo, the Chidori against Gaara, the Konoha Crush, the Third Hokage's death and the Sannin}, divergence, rearranged{343 (thread split: this episode carries the chapter's SASUKE thread — Orochimaru's body rejecting him, Kabuto leaving for medicine, Sasuke's attack — while its KONOHA thread, Team 7 at Ramen Ichiraku with Naruto's casted arm, was animated 23 episodes earlier in ep 90)} |
| 114 | canon | anchor 346 [344]; + divergence |
| 115 | mixed | anchor 347 [346]; + divergence, partial{346 (remainder only: the release of Suigetsu — the chapter's opening third is in ep 114 and its Konoha third in ep 90), 347 (Sasuke/Suigetsu thread only: the recruitment condition and the departure — the Konohamaru thread is in ep 90)} |
| 116 | canon | anchor 348 [348]; + divergence |
| 117 | canon | anchor 350 [349]; + partial{351 (opening 2-3 pages only: Sasuke's own partial cursed-seal transformation blocking Jūgo's first strike, and his line that he did not come to fight but to talk)} |
### beelzebub — recap baseline (beelzebub-w3.json; 3 rows named)
| ep | stored | → proposed |
|---|---|---|
| 17 | mixed · anchor 23 [23] | filler; anchor_hostile; + graft{12}, graft{23}; repair anchor |
| 34 | canon · anchor 69 [69] | mixed; anchor 69 [69] (was 69 [69]); + partial{69 (the festival-opening and maid-cafe pages; the pre-match tail is ep 35's)}, divergence{69} |
| 39 | canon · anchor 83 [82] | filler; anchor_hostile; + graft{82}, graft{83}, divergence{82-83}; repair anchor |
### boruto-naruto-next-generations — recap baseline (boruto-naruto-next-generations-w3.json; 4 rows named)
| ep | stored | → proposed |
|---|---|---|
| 1 | mixed | filler; anchor_hostile; + graft{1 (the opening flash-forward pages)} |
| 24 | mixed | anchor_hostile; + chain_source{Naruto: ch 700, 700+5}, divergence{Naruto: ch 700, 700+5} |
| 127 | mixed | filler; anchor_hostile |
| 157 | mixed | filler; anchor_hostile; + graft{11 (the Katasuke report — Ino's finding that a third party controlled him, and his reinstatement)} |


## THE DECISIONS — for Sean (drafted before the verifier; final after w3-flips.md)
1. **Apply the sound set**: shippuden 113-117 anchors + continues (the block closes with no repairs); beelzebub 17 / 39 → filler with anchors + continues deleted (P8 → manual tier), 34 → mixed with its anchor kept; boruto 1 / 127 / 157 → filler (A1: no anchors existed), 24 confirmed. T6 pins for all 12 rows (confirmations included).
2. **Shippuden 113 → canon** rests on a sizing at cross-check tier (fan breakdowns; AFG has no timed notes here). The recap clause is yours (T28: a recap counts for nothing, the remainder decides) — apply, or hold 113 mixed pending a licensor-grade sizing.
3. **Two anchoring calls the agent made conservatively, both reversible without research**: ep 114's START 344 keeps a two-page FIRST-TIME flashback (A10's ≤5-page exception was not applied because the pages are first-time and their extent is unproven) — or START 345; ep 117's END held at 350 (A47 + R3: the 351 credit is single-lineage) — or 351 if you read the licensor's teaser as sufficient.
4. **Beelzebub 34**: mixed (a continuous first-time ch-69 scene inside a mostly original episode) vs filler + graft{69} — the same T28 sizing fork as wave 2's seam rows; recommend mixed for consistency with bc 85 / db 34.
5. **The Boruto chain** (I41, a ruling): add `boruto-naruto-next-generations` to source-chains.ts — Naruto (30011) → Naruto Gaiden → Boruto as one chain (two works or three); then eps 19-23 / 39 get chain_source annotations in a narrow follow-up. Until ruled, ep 24's chain_source lists as chain_source_unmapped.
6. **Riding along**: beelzebub 15 / 26-28 / 51, boruto 18 / 93-95 (AFL's loose Mixed bucket), rurouni TV ep 95 (identity, from wave 2).
