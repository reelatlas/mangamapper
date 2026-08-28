# Batch 20 — wave 5 recovery record (2026-08-28)

DBS IDENTITY (Sean's go; Cursor's pin: standings + T21 direction only, NO anchors, the recap baseline on every named row). Two arc-split tasks under `batch20/PROTOCOL.md` as amended for wave 5 (lane I). Contexts: `context.ts` → `b20ctx5/dragon-ball-super-w5-1_76.md` / `-77_131.md`. **Usage ≈ 501k** (1-76: 252k · 77-131: 249k). Landing: validate 27 verdicts / 0 failing; 0 anchors delivered (as pinned).

## The identity — both verdicts, independently, the same answer

**The anime and the Toyotarou manga are two INDEPENDENT realizations of Toriyama's TEXT outline, produced 同時進行** (Kanzenshuu; ja-WP 「相互に補完する関係性」, scoped from the Champa arc; the official vol-1 Tori-Toyo Free Talk). Neither adapts the other: for 77-131 every manga chapter postdates its episode and chs 35-42 postdate the whole series (the anime ended 2018-03-25 at manga ch 34). **AniList types the anime → manga edge ALTERNATIVE, not ADAPTATION — and that is correct**; `pickManga` found no edge because there is none to find. The manga is **AniList 86508** (MAL 89734; V Jump, 24 vols / 104 chs, on hiatus) — flag #1016 closes as a MANUAL link, not a pipeline bug. AniList's chapters/volumes are null; vols 1-5 boundaries unstored.

| arc | our rows | manga chs | direction (T21) |
|---|---|---|---|
| Battle of Gods | 1-14 | 1-4 (a 65-page digest of the same film) | the anime ← the 2013 FILM; the manga ← the film too — siblings |
| Resurrection F | 15-27 | 未登場 | the anime ← the 2015 film; the manga skips it (batch 19's ruling untouched) |
| Universe 6 | 28-41 | 5-13 | common outline, simultaneous |
| Copy-Vegeta | 42-46 | — | anime-only (never enters the manga; no `adopted`) |
| Future Trunks | 47-67 | 14-26 | common outline, the anime AHEAD in print, the deepest divergences (Zamasu) |
| Toei interludes | 68-76 | — | anime-only |
| Universe Survival — recruitment | 77-96 | 27-32 | common outline (77-78 → 27-28; 79-81 a different match; 84-96 → 30-32) |
| Universe Survival — tournament | 97-131 | 33-42 | common outline; the manga compresses and reorders (different eliminations, Ultra Instinct, Kefla, Jiren's backstory) |

## Delivered

| task | delivered | forks |
|---|---|---|
| 1-76 (252k) | 0 anchors; **1 type correction: ep 53 → filler + `partial {17}`** (the Gowasu–Zamasu tea conversation relocated; medium; AFL says manga canon — the substitution shape of the ruled 79-81 / 91 / 94-95); 5 annotations: `divergence {1-4}` on 1-14 (minus the filler 4), `side_source {Battle of Gods film}` on ep 6 (its "exclusive" events are the FILM's — true against the manga, not anime-original), `divergence {5-13}` on 28-41, `divergence {14-26}` on 47-67, the ep-53 partial; two boilerplate traps caught in opposite directions (ep 6 true / ep 13 false — ch 4 carries the Beerus Ball exchange); honest negatives: no `adopted` (Copy-Vegeta never enters the manga; RoF's premises come from the film), no `retconned` (both versions official and parallel) | ep 53's type; `side_source {BoG film}` per row (ep 6, as delivered) vs a series-level note; vols 1-5 unstored |
| 77-131 (249k) | 0 anchors; **3 type corrections: 105, 113, 120 → filler** (the only stored-canon rows whose fandom counterpart field is empty in BOTH directions, each confirmed by ja-WP's per-character 漫画版 notes — 「漫画版には登場しない。」); 6 `divergence` annotations (the arc-wide 27-42 fact; row facts on 105 {38-40}, 113 {37}, 114-116 {37-39}, 120 {38}, 127-131 {40-42}); the arc table with five supports; AFL's tournament-block "manga canon" is a broadcast-date label, not a manga claim | **the T28 bar on seven rows (87, 88, 106, 121, 124, 125, 126)** that pass only on OUTCOME (the episode's job happens in the manga, its content does not) — the agent screened on "does the episode's JOB happen in the source at all" and did not retype them; ch 42's date 11-20 vs 11-21 |

## THE DECISION THIS WAVE POSES (Sean, before verify)

**What is dragon-ball-super's SOURCE (T25) — and therefore what "canon" means on its 131 rows?** Both agents typed RELATIVE TO THE MANGA (the stored source kind is `manga`), which the identity shows is not the anime's source in any temporal or authorial sense. Three readings:
1. **Keep `source_type = manga`, link 86508, standings relative to the manga** (the agents' reading): canon = the episode's events exist in the manga; filler = they do not (Copy-Vegeta, 68-76, 105/113/120, 53); the arc-wide `divergence` facts carry the "same outline, told differently" truth; MU/AFG positions can later anchor rows to manga chapters where the beats coincide (a reader following the manga alongside the anime gets an honest "this exists / this does not"). Cheapest, consistent with batch 19's 15-27 ruling and with every T6 entry on the series.
2. **The outline is the source** — the anime is itself a realization, so every row is canon and the manga is a `side_source` sibling: standings become nearly meaningless (only 42-46 / 68-76 filler) and the manga link carries no chapter positions. Honest about authorship, useless to a manga reader.
3. **Split the vocabulary**: a `T27`-letter for the parallel-manga era (the agent's own flag) — a fourth standing. **Not recommended** (T27: three standings, exceptions are annotations).

**Recommend 1**, with the identity recorded as a series-level `I`-family ruling (the direction table above, "manga = an ALTERNATIVE realization of the same outline; standings relative to it; the link is manual") — and the T28 bar ruled once for the seven outcome-only rows (recommend: the JOB test the agent used — a row whose content the manga does not carry is filler with a `divergence` tie even when the outcome coincides; that makes the seven filler too — Sean's call).

## RULED (Sean 2026-08-28, before verify)
**Reading 1** — the source stays the manga (AniList 86508, a manual link), standings RELATIVE TO THE MANGA. **T28 = the CONTENT test** — the seven outcome-only rows (87, 88, 106, 121, 124, 125, 126) go filler + `divergence`. **No fourth standing.** CONSTRAINT: the I-family ruling must say the manga is an **ALTERNATIVE**, not an adaptation — chapter numbers on this series are CORRESPONDENCE, never "this episode adapted ch N" (most chapters published after the episode) — and **`anchor_gap_research` must not turn 77-131 into a 93-row A2 wave** (the class needs a series-level suppression for ALTERNATIVE-source series, decided at apply). Verify on that (two tasks dispatched).

## Verification (R24, Fable verifiers, 2026-08-28) — `verify/dragon-ball-super-w5a.md` / `-w5b.md` (≈364k; wave ≈865k)

**Direction SOUND on both halves** — every support verbatim (ja-WP 同時進行 / 相互に補完 scoped 破壊神シャンパ編以降; Kanzenshuu's "separate take"; the vol-1 Free Talk "the original story you give me is text"; the V Jump interview; the dates — the anime ended 2018-03-25 at ch 34, ch 35 April 2018); no source claims adaptation either way; AniList 21175 has no ADAPTATION edge, 86508 ALTERNATIVE (its own ADAPTATION edge points at the Battle of Gods film). Nuance for the I-ruling: the anime staff consult Toyotarou's panels for composition (ja-WP §211; V Jump) — reference, not adaptation. The 77-131 counterpart map recomputed from all 16 chapter pages' `episode =` fields reproduces the verdict; the rows absent from EVERY chapter field are exactly {79, 80, 81, 90, 105, 113, 120}.

**Retypes:** 53 → filler holds (partial{16-17}; the note's "ch 18" → 18-19); 105/113/120 → filler sound (105's tie 38-39; one Borareta quote is Nigrissi's/Narirama's). **Under Sean's CONTENT test the verifier retypes the seven outcome-only rows AND four more** (99, 115, 116, 118) — roughly half the tournament block — and names seven Tier-2 rows (98, 102, 103, 104, 107, 109, 112: one scene carried, the headline fight absent) as `mixed?` — Sean's bar. Slips: the verdict's ep-106 text describes ep 119's content; the arc note contradicts itself on Blue Kaioken; ep 6's "zero pages" overstated (ch 3 carries the King Vegeta flashback).

## THE DECISIONS (step 4 — Sean)

| ep | stored | → verdict | → verifier / recommendation |
|---|---|---|---|
| 53 | canon | filler + partial{17} | filler + partial{16-17} — accept |
| 105 | canon | filler + divergence{38-40} | filler + divergence{38-39} — accept |
| 113 | canon | filler + divergence{37} | unchanged — accept |
| 120 | canon | filler + divergence{38} | unchanged — accept |
| 87 | canon | + arc divergence | filler + partial{31} (the ruled 91 shape) — accept |
| 88 | canon | + arc divergence | filler + divergence{31} — accept |
| 106 | canon | + arc divergence | filler + divergence{34} (Harmira/Prum) — accept |
| 121 | canon | + arc divergence | filler + divergence{38} — accept |
| 124 | canon | + arc divergence | filler + divergence{39-40} — accept |
| 125 | canon | + arc divergence | filler + divergence{40} — accept |
| 126 | canon | + arc divergence | filler + divergence{40} (closest call; mixed if the ch-40 aura knockback counts) — recommend filler |
| 99 | canon | + arc divergence | filler + divergence{34} — the content test, accept |
| 115 | canon | + row divergence{37-39} | filler + divergence{38-39} — accept |
| 116 | canon | + row divergence{37-39} | filler + divergence{39} — accept |
| 118 | canon | + arc divergence | filler + divergence{38-39} — accept |
| 98, 102, 103, 104, 107, 109, 112 | canon | + arc divergence | **`mixed?` — one scene carried, the headline fight absent: SEAN'S BAR** (recommend mixed + divergence: source and non-source in one episode is the T27 definition of mixed; binary filler would overstate) |
| 6 | canon | canon + side_source{BoG film} | agree under the batch-19 film precedent — accept |
| 4 | filler | no change | a film subplot — same rule as 6; stays filler (no annotation needed) — accept |
| 51 | canon | + arc divergence | mixed + divergence{14-26} (one manga beat, Trunks meets Mai) — recommend accept |
| 13 | canon | + arc divergence | no change (ja-WP records the absorption beat as a difference) — accept |

Unchanged in the ask: 1-3, 5, 7-12, 14 (canon, + arc divergence{1-4}); 28-41 (canon, + divergence{5-13}); 47-49, 54-67 (canon, + divergence{14-26}); 77-78, 82-86, 89, 92-93, 96-97, 100-101, 108, 110-111, 114, 117, 119, 122-123, 127-131 (canon/mixed, + the arc divergence{27-42}); the filler rows 4, 15-17, 22, 42-46, 50, 52, 68-76, 79-81, 90-91, 94-95; batch 19's 18-21 / 23-27 not re-opened.

**Series-level (the I-family ruling, at apply):** source = the manga, AniList 86508 linked MANUALLY (a one-hop ruling; AniList's edge is ALTERNATIVE and correct); the manga is an ALTERNATIVE realization of Toriyama's text outline — chapter numbers on this series are CORRESPONDENCE, never adaptation; the anime staff reference Toyotarou's panels for composition; **`anchor_gap_research` suppressed for ALTERNATIVE-source series** (a ruling map consulted by the audit — 77-131 is never an A2 wave; positions, if ever, are correspondence anchors ruled one by one); T28 on this series = the content test; no fourth standing.

## Traps learned (→ research-agent.md at capture)
- **AniList's ALTERNATIVE relation is a signal, not a defect**: when an anime→manga edge is ALTERNATIVE and both works cite one outline, the manga is not the source — an identity finding, not a missing link.
- **A fandom "exclusive to the anime" boilerplate can be true against the manga and still be a FILM's sequence** (DBS ep 6 — the Battle of Gods film): check the third work before typing.
- **AFL's "manga canon" on a simultaneous-production arc is a broadcast-date label** (the tournament block), not a claim about the manga's pages.
- **Per-character 漫画版 notes on ja-WP settle "does this exist in the manga at all"** (コイチアレータ 「漫画版には登場しない。」) faster than chapter-by-chapter reading.

## Next
Sean rules the identity (above) → **VERIFY (R24)**: two verifier tasks (the direction table's five supports; the four retypes; the ep-6 side_source; the seven outcome-only rows under whichever T28 bar Sean picks) → rulings → `/apply-batch` (T6 ×4 or ×11; the annotations; the manual manga link 86508 as a one-hop ruling; the I-family record) → `/consolidate`.

## Recap baseline (generated by `baseline.ts` from the DB + the verdicts — stored first, then the delta)

## dragon-ball-super — recap baseline (dragon-ball-super-w5a.json; 76 rows named)
| ep | stored | → proposed |
|---|---|---|
| 1 | mixed | + divergence{1-4} |
| 2 | mixed | + divergence{1-4} |
| 3 | canon | + divergence{1-4} |
| 4 | filler | no type change |
| 5 | canon | + divergence{1-4} |
| 6 | canon | + side_source |
| 7 | canon | + divergence{1-4} |
| 8 | canon | + divergence{1-4} |
| 9 | canon | + divergence{1-4} |
| 10 | canon | + divergence{1-4} |
| 11 | canon | + divergence{1-4} |
| 12 | canon | + divergence{1-4} |
| 13 | canon | + divergence{1-4} |
| 14 | canon | + divergence{1-4} |
| 15 | filler | no type change |
| 16 | filler | no type change |
| 17 | filler | no type change |
| 18 | canon + loose_parallel{4}, side_source | no type change |
| 19 | canon + divergence, side_source | no type change |
| 20 | canon + divergence, side_source | no type change |
| 21 | canon + divergence, side_source | no type change |
| 22 | filler | no type change |
| 23 | canon + divergence, side_source | no type change |
| 24 | canon + divergence, side_source | no type change |
| 25 | canon + divergence, side_source | no type change |
| 26 | canon + divergence, side_source | no type change |
| 27 | canon + divergence, side_source | no type change |
| 28 | canon | + divergence{5-13} |
| 29 | canon | + divergence{5-13} |
| 30 | canon | + divergence{5-13} |
| 31 | canon | + divergence{5-13} |
| 32 | canon | + divergence{5-13} |
| 33 | canon | + divergence{5-13} |
| 34 | canon | + divergence{5-13} |
| 35 | canon | + divergence{5-13} |
| 36 | canon | + divergence{5-13} |
| 37 | canon | + divergence{5-13} |
| 38 | canon | + divergence{5-13} |
| 39 | canon | + divergence{5-13} |
| 40 | canon | + divergence{5-13} |
| 41 | canon | + divergence{5-13} |
| 42 | filler | no type change |
| 43 | filler | no type change |
| 44 | filler | no type change |
| 45 | filler | no type change |
| 46 | filler | no type change |
| 47 | canon | + divergence{14-26} |
| 48 | canon | + divergence{14-26} |
| 49 | canon | + divergence{14-26} |
| 50 | filler | no type change |
| 51 | canon | + divergence{14-26} |
| 52 | filler | no type change |
| 53 | canon | filler; + partial{17 (the Gowasu-Zamasu 'are mortals worth protecting' tea conversation, relocated)} |
| 54 | canon | + divergence{14-26} |
| 55 | canon | + divergence{14-26} |
| 56 | canon | + divergence{14-26} |
| 57 | canon | + divergence{14-26} |
| 58 | canon | + divergence{14-26} |
| 59 | canon | + divergence{14-26} |
| 60 | canon | + divergence{14-26} |
| 61 | canon | + divergence{14-26} |
| 62 | canon | + divergence{14-26} |
| 63 | canon | + divergence{14-26} |
| 64 | canon | + divergence{14-26} |
| 65 | canon | + divergence{14-26} |
| 66 | canon | + divergence{14-26} |
| 67 | canon | + divergence{14-26} |
| 68 | filler | no type change |
| 69 | filler | no type change |
| 70 | filler | no type change |
| 71 | filler | no type change |
| 72 | filler | no type change |
| 73 | filler | no type change |
| 74 | filler | no type change |
| 75 | filler | no type change |
| 76 | filler | no type change |

## dragon-ball-super — recap baseline (dragon-ball-super-w5b.json; 55 rows named)
| ep | stored | → proposed |
|---|---|---|
| 77 | canon | + divergence{27-42} |
| 78 | mixed + rearranged{28} | + divergence{27-42} |
| 79 | filler + divergence | no type change |
| 80 | filler + divergence | no type change |
| 81 | filler + divergence | no type change |
| 82 | canon | + divergence{27-42} |
| 83 | canon | + divergence{27-42} |
| 84 | canon | + divergence{27-42} |
| 85 | canon | + divergence{27-42} |
| 86 | canon | + divergence{27-42} |
| 87 | canon | + divergence{27-42} |
| 88 | canon | + divergence{27-42} |
| 89 | mixed | + divergence{27-42} |
| 90 | filler | no type change |
| 91 | filler + partial{31} | no type change |
| 92 | canon | + divergence{27-42} |
| 93 | canon | + divergence{27-42} |
| 94 | filler + divergence{32}, partial{32 (one restaged scene each)} | no type change |
| 95 | filler + divergence{32}, partial{32 (one restaged scene each)} | no type change |
| 96 | canon | + divergence{27-42} |
| 97 | canon | + divergence{27-42} |
| 98 | canon | + divergence{27-42} |
| 99 | canon | + divergence{27-42} |
| 100 | canon | + divergence{27-42} |
| 101 | canon | + divergence{27-42} |
| 102 | canon | + divergence{27-42} |
| 103 | canon | + divergence{27-42} |
| 104 | canon | + divergence{27-42} |
| 105 | canon | filler; + divergence{38-40 (the manga's substituted version)} |
| 106 | canon | + divergence{27-42} |
| 107 | canon | + divergence{27-42} |
| 108 | canon | + divergence{27-42} |
| 109 | canon | + divergence{27-42} |
| 110 | canon | + divergence{27-42} |
| 111 | canon | + divergence{27-42} |
| 112 | canon | + divergence{27-42} |
| 113 | canon | filler; + divergence{37 (the manga's substituted version)} |
| 114 | canon | + divergence{27-42}, divergence{37-39} |
| 115 | canon | + divergence{27-42}, divergence{37-39} |
| 116 | canon | + divergence{27-42}, divergence{37-39} |
| 117 | canon | + divergence{27-42} |
| 118 | canon | + divergence{27-42} |
| 119 | canon | + divergence{27-42} |
| 120 | canon | filler; + divergence{38 (the manga's substituted version)} |
| 121 | canon | + divergence{27-42} |
| 122 | canon | + divergence{27-42} |
| 123 | canon | + divergence{27-42} |
| 124 | canon | + divergence{27-42} |
| 125 | canon | + divergence{27-42} |
| 126 | canon | + divergence{27-42} |
| 127 | canon | + divergence{27-42}, divergence{40-42} |
| 128 | canon | + divergence{27-42}, divergence{40-42} |
| 129 | canon | + divergence{27-42}, divergence{40-42} |
| 130 | canon | + divergence{27-42}, divergence{40-42} |
| 131 | canon · anchor 42 | + divergence{27-42}, divergence{40-42} |


## THE MODEL RULED (Sean 2026-08-28 — the DBS strategy session; built as §12.87)

The timelines: **A** manga-only from the outline (canon, chapter side) · **B** anime-only from the outline (canon) · **C** both (canon) · **D** studio padding, not the outline (filler) · **E** D with A/B/C in one episode (mixed, unless the `T28` sliver → filler). `type` answers FROM THE OUTLINE OR NOT; the compare layer (arcs + correspondence rows) answers how the two tellings sit on it. Stored: `series.source_relation = parallel` (I40; `parallel`, not `alternative` — series_relations spends that word on FMA 2003 ↔ Brotherhood), the manga link 86508 as part of the ruling, `series_arcs` (8 ruled arcs) and `episode_correspondence` (aligned | divergent | anime_only | manga_only; HELD until Sean evaluates the table below). NO anchors (the AFG-continua ep 131 → ch 42 pin was removed and listed). The wave-5 content-test conversions (22 rows → filler) are WITHDRAWN under T30; wave 5c researches 90 / 91 / 1 / 2 / 78 / 89 under the load-bearing test. Lane **L-P** (row-grain alignment, one arc per wave) populates the correspondence until `correspondence_incomplete` is empty — Sean's to fund.

## dragon-ball-super — the full evaluation table under I40 / T30 / A46 (generated 2026-08-28; stored first)

Columns: **stored** = the DB right now (type + annotations); **wave 5** = what the research verdict / verifier proposed under the content test (type corrections and row-level annotations only — the blanket arc-level `divergence{range}` stamps are NOT applied: the arc's note carries them); **→ proposed** = what the row becomes under the parallel rule (T30: from the outline or not; A46: correspondence rows instead of anchors). "row …" names the episode_correspondence row the apply would write; "pending (L-P)" = a canon row in a shared arc whose alignment is not yet researched — it renders an honest dash until lane L-P reaches its arc. Totals: 5 lifts, 6 pending w5c research, 120 rows with no type change.

### Battle of Gods — shared, eps 1-14 ↔ ch 1-4

| ep | title | stored | wave 5 | → proposed |
|---|---|---|---|---|
| 1 | The Peace Reward - Who Will Get the 100 Million Zeni? | mixed | — | **pending w5c research** (mixed under E = story + padding, or canon) |
| 2 | To the Promised Resort! Vegeta Goes on a Family Trip!? | mixed | — | **pending w5c research** (mixed under E = story + padding, or canon) |
| 3 | Where's the Rest of the Dream?! In Search of the Super Saiyan God! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 1-4) |
| 4 | Aim for the Dragon Balls! Pilaf Gang in Action! | filler | — | filler — no change (D: padding inside a shared arc) |
| 5 | The Ultimate Fight on King Kai's Planet! Goku Vs the God of Destruction Beerus | canon | — | canon — no change; row pending (L-P: arc ↔ ch 1-4) |
| 6 | Don't Anger the God of Destruction! Excitement at the Birthday Party | canon |  + side_source | canon — no change; + side_source{Battle of Gods film} (the manga has nothing here; the film does) |
| 7 | How Dare You Hurt My Bulma! Vegeta's Sudden, Angry Shift?! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 1-4) — fandom index: ch 3 |
| 8 | Goku Arrives! A Last Chance from Beerus Sama?! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 1-4) — fandom index: ch 3 |
| 9 | Sorry for the Wait, Beerus Sama. The Super Saiyan God is Finally Born! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 1-4) — fandom index: ch 4 |
| 10 | Unleash It, Goku! The Power of the Super Saiyan God!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 1-4) — fandom index: ch 4 |
| 11 | Let's Keep Going, Beerus Sama! Our Battle of Gods! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 1-4) — fandom index: ch 4 |
| 12 | The Universe Crumbles?! Clash! God of Destruction Vs. Super Saiyan God | canon | — | canon — no change; row pending (L-P: arc ↔ ch 1-4) — fandom index: ch 4 |
| 13 | Goku, Surpass the Super Saiyan God! | canon | — | canon — no change; row aligned{4} (ch 4 carries the Beerus Ball beat; the "anime-exclusive" boilerplate is false here) |
| 14 | This Is Every Ounce of Power I Have! The Battle of Gods' Conclusion! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 1-4) — fandom index: ch 4 |

### Resurrection 'F' — side_source, eps 15-27

| ep | title | stored | wave 5 | → proposed |
|---|---|---|---|---|
| 15 | Make a Miracle, Satan the Hero! A Challenge from Outer Space | filler | — | filler — no change (D: a Toei bridge inside the film arc) |
| 16 | Vegeta Becomes an Apprentice?! Winning Whis Over! | filler | — | filler — no change (D: a Toei bridge inside the film arc) |
| 17 | Pan is Born! And Goku Goes on a Training Trip?! | filler | — | filler — no change (D: a Toei bridge inside the film arc) |
| 18 | I'm Here, Too! Training Begins On Beerus' Planet! | canon + loose_parallel{4}, side_source | — | no change (batch 19: the 2015 film, side_source) |
| 19 | Despair Rises! The Emperor of Evil, Frieza, Resurrected! | canon + side_source, divergence | — | no change (batch 19: the 2015 film, side_source) |
| 20 | Jaco's Warning! Frieza and His 1000 Troops Approach | canon + divergence, side_source | — | no change (batch 19: the 2015 film, side_source) |
| 21 | The Start of Revenge! the Malice of Frieza Army Strikes Gohan! | canon + divergence, side_source | — | no change (batch 19: the 2015 film, side_source) |
| 22 | Change! an Unexpected Return! His Name Is Ginyu!! | filler | — | filler — no change (D: a Toei bridge inside the film arc) |
| 23 | The Earth! Gohan! Absolute Peril! Hurry and Get Here, Son Goku!! | canon + side_source, divergence | — | no change (batch 19: the 2015 film, side_source) |
| 24 | Clash! Frieza Vs Son Goku - This Is The Result of My Training! | canon + side_source, divergence | — | no change (batch 19: the 2015 film, side_source) |
| 25 | An All-Out Battle! The Revenge of Golden Frieza | canon + side_source, divergence | — | no change (batch 19: the 2015 film, side_source) |
| 26 | A Glint of Hope Shines Through in a Crisis! Time to Fight Back, Son Goku! | canon + side_source, divergence | — | no change (batch 19: the 2015 film, side_source) |
| 27 | The Earth Explodes?! The Deciding Kamehameha | canon + divergence, side_source | — | no change (batch 19: the 2015 film, side_source) |

### Universe 6 — shared, eps 28-41 ↔ ch 5-13

| ep | title | stored | wave 5 | → proposed |
|---|---|---|---|---|
| 28 | The God of Destruction from Universe 6 - His Name Is Champa | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 29 | The Martial Arts Match Has Been Decided! The Team Captain Is Stronger Than Goku | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 30 | A Review Before the 'Martial Arts Match' - Who Are the Last Two Members?! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 31 | Off to Zuno Sama's! Find Out Where Super Dragon Balls Are! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 32 | The Match Begins! Let's All Go to the Nameless Planet! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 33 | Behold, Universe 6! This Is the Super Saiyan? Son Goku! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 34 | Piccolo Vs. Frost - Put It All on the Special Beam Cannon! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 35 | Turn Rage into Strength! Vegeta's Full-On Battle | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 36 | An Unexpected Desperate Battle! Vegeta's Furious Explosion! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 37 | Don't Forget Your Saiyan Pride! Vegeta Vs the Saiyan of Universe 6 | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 38 | The Ultimate Warrior of Universe 6! Assassin Hit Appears!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 39 | The Advanced 'Time-Skip' Fights Back?! Will it Come Forth? Goku's New Technique! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 40 | At Last, It Comes to an End! Is the Winner Beerus? Or is it Champa? | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |
| 41 | Come, God of Dragons - And Pretty Please Grant My Wish! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 5-13) |

### Copy-Vegeta — anime_only, eps 42-46

| ep | title | stored | wave 5 | → proposed |
|---|---|---|---|---|
| 42 | Trouble at the Victory Celebration! Showdown at Last?! Monaka vs. Son Goku | filler | — | filler — no change (D, the arc) |
| 43 | Goku's 'Ki' is Out of Control?! Looking After Pan is A Lot of Trouble | filler | — | filler — no change (D, the arc) |
| 44 | Seal of Planet Potofu - Secret of the Superhuman Water is Unleashed | filler | — | filler — no change (D, the arc) |
| 45 | Vegeta Disappears?! The Threat Of Duplicated Vegeta! | filler | — | filler — no change (D, the arc) |
| 46 | Goku vs. Duplicated Vegeta! Who's Gonna Win?! | filler | — | filler — no change (D, the arc) |

### Future Trunks — shared, eps 47-67 ↔ ch 14-26

| ep | title | stored | wave 5 | → proposed |
|---|---|---|---|---|
| 47 | An SOS from the Future! A Dark New Enemy Emerges!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 48 | Hope!! Once More Awaken in the Present, Trunks | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 49 | A Message from the Future - Goku Black Strikes! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) — fandom index: ch 16 |
| 50 | Goku Vs Black! The Closed Path to the Future | filler | — | filler — no change (D: padding inside a shared arc) |
| 51 | Feelings That Travel Beyond Time - Trunks and Mai | canon | — | canon — no change (B); row divergent{16: Trunks meets Mai is the one shared beat} |
| 52 | Teacher and Student Reunited - Son Gohan and "Future" Trunks | filler | — | filler — no change (D: padding inside a shared arc) |
| 53 | Uncover Black's Identity! To the Sacred World of the Kais! | canon | → filler + partial{17} | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{16-17} |
| 54 | The One Who Inherits the Saiyan Blood - Trunk's Resolve | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) — fandom index: ch 16, 17 |
| 55 | I Want to See Son Goku - Zen-Oh Sama's Summoning! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) — fandom index: ch 17 |
| 56 | Rematch With Goku Black! Super Saiyan Rosé Appears | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 57 | The God With the Immortal Body - Zamasu Descends | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) — fandom index: ch 17 |
| 58 | Zamasu and Black - The Mystery of the Two Deepens | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 59 | Protect Supreme Kai Gowasu — Destroy Zamasu! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 60 | Back to the Future - Goku Black's Identity is Revealed!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 61 | Zamasu's Ambition — The Awful "Zero Mortal Plan" Is Revealed | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 62 | I'll Protect the World! Trunks’ Furious Super Power Explodes!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 63 | Don’t Disrespect Saiyan Cells! Vegeta’s Heroic Battle Begins!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 64 | Revere Him! Praise Him! Fusion Zamasu's Explosive Birth!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 65 | Is This the Final Judgement?! The Ultimate Power of the Absolute God | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 66 | The Climactic Battle! The Miraculous Power of a Relentless Warrior! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |
| 67 | With New Hope!! In Our Hearts - Farewell, Trunks | canon | — | canon — no change; row pending (L-P: arc ↔ ch 14-26) |

### Toei interludes — anime_only, eps 68-76

| ep | title | stored | wave 5 | → proposed |
|---|---|---|---|---|
| 68 | Come Forth, Shenron! Whose Wish Will Be Granted?! | filler | — | filler — no change (D, the arc) |
| 69 | Goku vs Arale! A Ridiculous Battle Will End The Earth?! | filler | — | filler — no change (D, the arc) |
| 70 | Champa's Challenge! This Time We Fight With Baseball! | filler | — | filler — no change (D, the arc) |
| 71 | The Death of Goku! The Guaranteed Assassination Mission | filler | — | filler — no change (D, the arc) |
| 72 | Will There Be A Counterattack?! The Invisible Killing Strike!! | filler | — | filler — no change (D, the arc) |
| 73 | Gohan's Misfortune! An Unexpected Great Saiyaman Movie?! | filler | — | filler — no change (D, the arc) |
| 74 | For the Ones He Loves! The Unbeatable Great Saiyaman!! | filler | — | filler — no change (D, the arc) |
| 75 | Goku and Krillin Back to the Old Training Grounds | filler | — | filler — no change (D, the arc) |
| 76 | Defeat These Terrifying Enemies! Krillin's Fighting Spirit Returns! | filler | — | filler — no change (D, the arc) |

### Universe Survival — shared, eps 77-131 ↔ ch 27-42

| ep | title | stored | wave 5 | → proposed |
|---|---|---|---|---|
| 77 | Let's Do it, Zen-Oh Sama! The All-Universe Martial Arts Tournament!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 27, 28 |
| 78 | The Gods of Every Universe In Shock?! Losers Erased In The Tournament Of Power | mixed + rearranged{28} | — | **pending w5c research** (mixed under E = story + padding, or canon) — fandom index: ch 28 |
| 79 | Universe 9’s Basil The Kicker VS Universe 7’s Majin Buu!! | filler + divergence | — | **lift → canon (B)**; row divergent{28-30: the manga's Zen Exhibition, a twelve-God battle royal} |
| 80 | Awaken Your Sleeping Battle Spirit! Son Gohan's Fight!! | filler + divergence | — | **lift → canon (B)**; row divergent{28-30} |
| 81 | Bergamo The Crusher VS Son Goku! Which One Wields The Limitless Power!? | filler + divergence | — | **lift → canon (B)**; row divergent{28-30} |
| 82 | Never Forgive Son Goku! Toppo The Warrior Of Justice Intrudes!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 29, 30 |
| 83 | Form the Universe 7 Representing Team! Who are the Strongest Ten?! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 30 |
| 84 | Son Goku The Recruiter Invites Krillin And No. 18 | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 31 |
| 85 | The Universes Begin To Make Their Moves Their Individual Motives | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 30, 31 |
| 86 | Fists Cross For The First Time! Android #17 Vs Son Goku!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 31 |
| 87 | Hunt the Poachers! Goku and No. 17's United Front!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{31} — fandom index: ch 31 |
| 88 | Gohan And Piccolo Teacher And Pupil Clash In Max Training! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{31} — fandom index: ch 31 |
| 89 | An Unknown Beauty Appears! The Tenshin-style Dojo's Mystery?! | mixed | — | **pending w5c research** (mixed under E = story + padding, or canon) — fandom index: ch 32 |
| 90 | See The Wall That Must Be Passed! Goku Vs Gohan | filler | — | **pending w5c research** (filler (D) unless load-bearing → canon (B)) |
| 91 | Which Universe Will Survive?! The Strongest Warriors Are Gathering!! | filler + partial{31} | — | **pending w5c research** (filler (D) unless load-bearing → canon (B)) — fandom index: ch 31 |
| 92 | Emergency Development! The Incomplete Ten Members!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 32 |
| 93 | You're The Tenth Warrior! Goku Goes To See Frieza!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 32 |
| 94 | The Emperor of Evil Returns! A Reception of Mysterious Assassins?! | filler + partial{32}, divergence{32} | — | **lift → canon (B)**; row divergent{32: Frieza's recruitment} — fandom index: ch 32 |
| 95 | The Worst! The Most Evil! Frieza's Rampage!! | filler + partial{32}, divergence{32} | — | **lift → canon (B)**; row divergent{32} — fandom index: ch 32 |
| 96 | The Time Is Here! To The World Of Void For The Fate Of The Universe!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 32, 33 |
| 97 | Survive! The Tournament Of Power Begins At Last!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 33 |
| 98 | Oh, Uncertainty! A Universe  Despairs!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{34} — fandom index: ch 34 |
| 99 | Show Them! Krillin's True Power!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{34} — fandom index: ch 34 |
| 100 | Out Of Control! The Savage Berserker Awakens!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 37, 38 |
| 101 | The Impending Warriors of Justice! The Pride Troopers!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 33, 38 |
| 102 | The Power of Love Explodes?! Universe 2's Little Witch Warriors!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{36} — fandom index: ch 36 |
| 103 | Gohan, Show No Mercy! Showdown With Universe 10!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{36, 38} — fandom index: ch 38 |
| 104 | The Ultimate High Speed Battle Begins! Goku and Hit Join Forces!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{35} — fandom index: ch 35 |
| 105 | A Desperate Battle! Master Roshi's Sacrifice!! | canon | → filler + divergence{38-40} | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{38-39} |
| 106 | Find Him! Death Match With An Invisible Attacker!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{34} — fandom index: ch 34 |
| 107 | Revenge "F"! The Cunning Trap?! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{34} — fandom index: ch 34, 39 |
| 108 | Frieza and Frost! Conjoined Malice?! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 34 |
| 109 | The Ultimate Enemy Approaches Goku! Now, Let Loose! The Killer Spirit Bomb!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{35} — fandom index: ch 35 |
| 110 | Son Goku Wakes! New Level of The Awakened!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 35 |
| 111 | The Surreal Supreme Battle! Hit vs Jiren!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 35, 38 |
| 112 | A Saiyan's Vow! Vegeta's Resoution!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{37-38} — fandom index: ch 36, 37, 38 |
| 113 | With Great Joy! The Repeat Battle-Crazy Saiyan Fight!! | canon | → filler + divergence{37} | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{37} |
| 114 | Intimidating Passion! The Birth of a New Super Warrior!! | canon |  + divergence{37-39} | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 37, 38 |
| 115 | Goku vs Kefla! Super Saiyan Blue Defeated?! | canon |  + divergence{37-39} | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{38-39} — fandom index: ch 36 |
| 116 | The Sign of a Comeback! Ultra Instinct's Huge Explosion!! | canon |  + divergence{37-39} | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{39} — fandom index: ch 39 |
| 117 | Showdown of Love! Androids vs Universe 2!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 36 |
| 118 | Accelerated Tragedy - Vanishing Universes... | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{38-39} — fandom index: ch 38, 39 |
| 119 | Unavoidable?! The Fierce Stealth Attack!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 36 |
| 120 | The Perfect Survival Tactic! Universe 3's Menacing Assassin!! | canon | → filler + divergence{38} | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{38} |
| 121 | All-Out War! The Ultimate Quadruple Merge vs Universe 7's Full-Scale Attack!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{38} — fandom index: ch 38 |
| 122 | For One's Own Pride! Vegeta's Challenge to be the Strongest!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 39, 40 |
| 123 | Body and Soul, Full Power Release! Goku and Vegeta!! | canon | — | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 39, 40 |
| 124 | The Fiercely Overwhelming Assault! Gohan's Last Stand!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{39-40} — fandom index: ch 39, 40, 42 |
| 125 | With Imposing Presence! God of Destruction Toppo Descends!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{40} — fandom index: ch 40 |
| 126 | Surpass Even a God! Vegeta's Desperate Blow!! | canon | — | canon — no change (B: the anime's telling; the wave-5 "→ filler" is withdrawn); row divergent{40} — fandom index: ch 40 |
| 127 | The Approaching Wall! The Final Barrier of Hope!! | canon |  + divergence{40-42} | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 40, 41 |
| 128 | Noble Pride to the End! Vegeta Falls!! | canon |  + divergence{40-42} | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 40, 42 |
| 129 | Limit Super Surpassed! Ultra Instinct Mastered!! | canon |  + divergence{40-42} | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 41 |
| 130 | The Greatest Showdown of All Time! The Ultimate Survival Battle!! | canon |  + divergence{40-42} | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 41, 42 |
| 131 | The Miraculous Conclusion! Farewell, Goku! Until We Meet Again!! | canon |  + divergence{40-42} | canon — no change; row pending (L-P: arc ↔ ch 27-42) — fandom index: ch 42 |

### Galactic Patrol Prisoner → Granolah → Super Hero — manga_only, ch 43-open

No episodes. The reading view's "manga only" tail (timeline A); no continue point is written on a parallel series (A46) — this arc IS the tail.

