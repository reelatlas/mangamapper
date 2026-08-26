# Batch 18 — wave 2 recovery record (2026-08-26): the A-7 studio-ending class

All eight verdicts pass `validate.ts`. ~1.37M subagent tokens. NOT verified,
NOT applied. The stored state for every target is T6 filler + a T26
divergence annotation (T4.3); these verdicts propose what replaces it.

## Landed (8/8)

| target | rows | verdict | adoption | repairs (vs stored) |
|---|---|---|---|---|
| twin-star-exorcists 21-50 | 30 | ALL filler | none — Sukeno's only credit is character-design 監修; no sequel carries the ending; manga ended 2024 with its own ending; Sukeno later imported the anime's Basara DESIGNS into the manga while refusing its EVENTS | 0 (ep 20 back half flagged) |
| claymore 24-26 | 3 | 24 mixed / 25 filler / 26 mixed | none (Yagi 原作 only) | 24, 26 → mixed; 21-23 loose_parallel → 1:1 Scene 57/58/59 (frontier question); "Madhouse outran the manga" premise FALSE (13 chapters unadapted) |
| gto 22-28/34/42-43 | 10 | 9 filler / 27 mixed | none (Fujisawa 原作 + a voice cameo) | 27 → mixed (adapts the Toroko Oppai side story serialized INSIDE GTO; no anchor); 25-26 borrow from Shonan Junai Gumi → side_source alternative flagged |
| ajin S2 14-26 | 13 | 4 canon / 4 mixed / 5 filler | none (Sakurai 原作 only; manga ended differently 2021) | batch-12 premise WRONG: 14-22 adapt ch 23-42 (ja-WP per-character 巻話↔第2期N話 tables); only 23-26 are the studio ending; 8 type flips + divergence rewrite + ep-13 continue 22→23 |
| chrono-crusade 22-24 | 3 | 22 mixed / 23-24 filler | none (Moriyama 原作 only; manga's own ending printed a month before ep 24) | 22 → mixed; 14-21 hold |
| sailor-moon 167-172 | 6 | 167-168 mixed / 169-172 filler | none (Takeuchi blanket credit; on record complaining) | 167, 168 → mixed (Act 38 tail, Act 44 core, the Eternal debut); no anchors (would run position backwards) |
| railgun 13, 15-24, 41-48 | 19 | 13 filler / 41 mixed / 17 canon + adopted{author} | **NEW BASIS CLASS: downstream authorial use** — Railgun manga ch 31/32 references a photo taken in ep 20; Kamachi's later novels bring back Therestina, Kurozuma/Big Spider, Haruue, Febrie | 18 repairs; Silent Party basis thin (one LN referback) |
| world-trigger 48 | 1 | filler | none | divergence → side_story (inserted interlude, nothing contradicted) |

## Verification (R24, Fable, ~0.83M) — reports in `verify/`

| verdict | result | changes to filed rows |
|---|---|---|
| twin-star | SOUND | none; ADD Sukeno's 2020 "from-ep-1 remake, not a season 2" tweet to the note |
| claymore | SOUND WITH CORRECTIONS | none (24/26 mixed, 25 filler); 21-23 narrowing accepted as annotation, frontier ruled separately |
| sailor-moon | SOUND WITH CORRECTIONS | none (167-168 mixed); loose_parallel chapters "45, 47" (not 50-51) |
| chrono-crusade | SOUND WITH CORRECTIONS | none (22 mixed); total_chapters 59 IS right (56 + 2 extras + epilogue) |
| gto | SOUND WITH CORRECTIONS | none (27 mixed + side_story, not side_source; 25-26 filler + loose_parallel) |
| railgun | SOUND WITH CORRECTIONS | drop the ep-20 cover-art graft; basis must be stated as INCORPORATION; **the class is Sean's ruling** |
| ajin | SOUND WITH CORRECTIONS | ep 22 canon → MIXED; ep 23 mixed → FILLER + loose_parallel; continue 29 not ~43 |
| world-trigger | not verified (one row, agrees with stored) | divergence → side_story |

## Decisions for Sean (after verification)

1. **Is "the author later USED it" an adoption basis?** Railgun's case is the
   only one this wave that discriminates per arc (unlike the rejected
   Kodachi credit) and it is stronger than a credit — the source's own
   author treats the anime events as having happened. If yes: 15-24 (+
   42-48 if the Silent Party referback holds) → canon + adopted{author}.
   If no: filler + divergence stands, the referbacks go in the note.
2. **Ajin re-typing** overturns a batch-12 verdict at season granularity
   (14-22 adapt manga). Verifier target; also the ep-13 continue repair
   and the series continue point (~43) are C-family calls.
3. **Claymore 21-23 → Scene 57/58/59 1:1** would move the frontier to ep 23
   → ch 59 (A3/A43/C8). Out of this batch's remit — narrow anchoring task.
4. gto 25-26: filler (recommended) or canon + side_source (Shonan Junai
   Gumi)? The prequel is Fujisawa's own work.
5. Judgment rows flagged mixed-vs-filler: claymore 26, chrono 22, ajin
   21/23, gto 28/34, sailor-moon 170/172, railgun 41 — verifier reads them.

## Traps learned (→ research-agent.md at capture)
- A season typed from a single "the ending is anime-original" claim can be
  wrong for most of the season (ajin 14-22) — the A-7 class must be typed
  row by row.
- AFL has NO page for twin-star-exorcists or world-trigger; AFG is the
  source there ("AFL: undefined" in contexts = no page).
- en-WP "original storyline not found in the manga written by Yagi" is a
  garden-path sentence — "written by Yagi" modifies the manga.
- AllYourAnime's per-article chapter header is a reading-position header,
  not an adaptation claim.
- ja-WP per-character 原作/アニメ版 tables carry 巻話 ↔ 第N期M話 pairs — a
  strong per-episode source when the episode list has no chapter column.
- Fan comparisons can pair a chapter serialized AFTER the episode (gto
  Lesson 143 vs ep 24): check dates.

## Outstanding
- Verification (R24, Fable): ajin (season overturn), railgun (the new basis
  class + 18 repairs), claymore (mixed calls + the 21-23 frontier claim),
  sailor-moon (167-168 Acts), gto (ep 27 side story; 25-26 fork), chrono
  (ep 22), twin-star (the no-adoption negative on the loud case).
  world-trigger 48 needs no verifier (one row, agrees with stored).
- Wave 3 not dispatched.
