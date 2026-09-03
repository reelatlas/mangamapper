# Verifier report — bleach wave 11, sub-blocks a + b (eps 190-202, lane A2 gap block)

Verdicts: `scripts/ingest/research/batch20/out/bleach-w11a.json` (rows 190-196)
and `scripts/ingest/research/batch20/out/bleach-w11b.json` (rows 197-202).
Verifier: claude-fable-5-1 (cross-model vs the two Opus research agents), 2026-09-02.
Method: mechanical row / continue / monotonicity / volume scan across BOTH files (the seam
196/197 is the point of the double dispatch); refetched bleach.fandom via the MediaWiki API
(Episode_167 and Episode_190-203 wikitext: `chapters` fields, summaries, Trivia, section
headers; Volume_32-35: `chapters` / `episodes` fields and every per-chapter "Episodes adapted
from this chapter" list; the Qref carriers Teatro_de_Titere, Lanzador_Verde,
Nelliel_Tu_Odelschwanck; the fight pages Nelliel vs Nnoitra, Renji & Uryu vs Szayelaporro,
Kenpachi vs Nnoitra), animefillerguide's bleach page (rows 165-206, the chapter column and
the 190 note), animefillerlist (rows 165-206), TV Tokyo's archived episodes17 back-number
page (第189-200話, UTF-8), en-WP `Bleach season 10` (wikitext) and en-WP `List of Bleach
chapters (188–423)` (volumes 32-35), bleachfiller.com (dead — see F3), one web search for any
source explaining AFL's 193 label. All 13 anchors + the ep-167 fence record were pushed
through `lib/sliver.ts#sliverStart/sliverEnd` with the neighbouring STARTs. DB untouched;
verdict JSONs untouched.

## Recap baseline

Bleach — stored per the wave-11 contexts: eps 190-202 sit inside the anchor_gap_research
block 190-202 (NO stored anchors inside), fence = ep 167 END 286 (manual, no START, no
chapters_adapted, no continue) and ep 203 END 315 v35 (manual, no START). Stored types: 190
mixed, 191-192 canon, 193 mixed, 194-203 canon, 204-205 filler (AFL agrees on all). Stored
volume table stops at v32 (279-286).

| row | stored | verdict | verifier |
|---|---|---|---|
| ep 167 — stored: canon, END 286 (manual), no START / span / continue | → verdict (a): ADD continue 286 parity (C1) + partial{286} shared with 190 (fence-row addition, flagged) | → verifier: fact SOUND (field `284, 285, 286 (pages 1-8)` verbatim; vol-32 ch-286 reverse list = ep 167 + ep 190; AFG 167 = 284, 285, 286); scope is Sean's call (F4) |
| ep 190 — stored: mixed, no anchor | → verdict (a): END 287 [286] v33 high; RETYPE → canon (T28 recap clause) + divergence{178-286 recap} + partial{286} | → verifier: SOUND — the fandom field itself reads `Recap of Chapter 178 onwards; 286 (Pages 9-21), 287`; Trivia and AFG's 15:08 note verbatim; the summary is 286 p.9-21 + 287 only (F7) |
| ep 191 — stored: canon, no anchor | → verdict (a): END 289 [288] v33 high | → verifier: SOUND (field `288, 289`; AFG `288, 289`; vol-33 288/289 → 191; TV Tokyo 第191話 = Fornicarás + Nnoitra overpowering Ichigo) |
| ep 192 — stored: canon, no anchor | → verdict (a): END 292 [290] v33 high + partial{292} w/ 193 + C1 continue 292 | → verifier: SOUND (field `290, 291, 292 (Pages 1-8)`; Nelliel Qrefs `chapter=291\|page=14 / 17 / 17-19\|episode=192` verbatim; `sliverEnd` → 292 'substantive' 8 pp, so A47 does not bind) |
| ep 193 — stored: mixed, no anchor | → verdict (a): END 293 [292] v33 high; RETYPE → canon (faithfulness clause) + divergence{292-293} | → verifier: anchor SOUND (field `292 (Pages 9-19), 293`; Teatro Qrefs `293\|7-9 / 11 / 14-15\|193` verbatim); RETYPE defensible but the evidence is SILENCE, not a negative finding — the fandom's Anime Notes coverage stops at ep 167 in this range (F1) |
| ep 194 — stored: canon, no anchor | → verdict (a): END 295 [294] v33 high | → verifier: SOUND (field `294, 295`; vol-33 header `Episodes 190 - 194` verbatim; TV Tokyo 第194話 = the Espada-era duels and 卑怯な手段) |
| ep 195 — stored: canon, no anchor | → verdict (a): END 297 [296] v34 high | → verifier: SOUND (field `296, 297`; Lanzador Qref `296\|6-9\|195` verbatim; vol-34 header `Episodes 195 - 199`; ch 296's per-chapter list → 195 — it exists, contra w11b's note, F2) |
| ep 196 — stored: canon, no anchor | → verdict (a): END 299 [298] v34 high | → verifier: SOUND (field `298, 299`; TV Tokyo 第196話 = the captains through the stabilised Garganta, Kenpachi vs Tesra); seam clean — 197 opens on 300 |
| ep 197 — stored: canon, no anchor | → verdict (b): END 301 [300] v34 high | → verifier: SOUND (field `300, 301`; vol-34 ch 300 summary opens with Hanatarō slipping on the ice, as the note says) |
| ep 198 — stored: canon, no anchor | → verdict (b): END 303 [302] v34 high | → verifier: SOUND (field `302, 303`; TV Tokyo 第198話 = Gōkei + the voodoo dolls) |
| ep 199 — stored: canon, no anchor | → verdict (b): END 305 [304] v34 high | → verifier: SOUND (field `304, 305`; the ep-199 summary ends on the Superhuman Drug stab / "enjoy the next hundred years"; the vol-35 page's "Episode 199" under ch 306 is slop, F2) |
| ep 200 — stored: canon, no anchor | → verdict (b): END 307 [306] v35 high, A47 hold on 308 p.1-3 + partial{308} + continue 308 | → verifier: SOUND — `sliverEnd('306-307, 308 (p.1-3)', 308, 308)` itself derives 307 ('owned-tail', 3 pp); ep 201's first two paragraphs restage the eyepatch stab → hand through the chest → Hollow-hole reveal before its first new beat (F8) |
| ep 201 — stored: canon, no anchor | → verdict (b): END 310 [308] v35 high | → verifier: SOUND (field `308 (Pages 4-19), 309, 310`; summary ends on the third pair of arms, 'all six of my arms', Kenpachi coughing blood) |
| ep 202 — stored: canon, no anchor | → verdict (b): END 312 [311] v35 high + continue 313 | → verifier: SOUND (field `311, 312`; summary tail "As he collapses, Nel awakens and watches as he falls" = ch 312's close; ep 203's summary opens with the two-handed Ryōdan restaged, then ch 313's flashback) |
| ep 203 — stored: canon, END 315 v35 (manual), no START | → verdict (b): REPAIR start_chapter null → 313 (enrichment) | → verifier: SOUND (field `313, 314, 315`; AFG `313, 314, 315`; vol-35 313/314/315 → 203); nit: no chapters_adapted delivered, so the START stays census-unprovable (F5) |

## Findings, ranked by damage

### F1 — the 193 retype: SOUND WITH CAVEAT — the negative is silence, not documentation (Sean's call)
What the sources actually say: AFL `Mixed Canon/Filler` (fetched, no reason given anywhere on
the page); AFG plain `292, 293` with NO `*Mixed` marker (fetched — AFG marks 190 `*Mixed` in
the same table, so this is an independent reading, as w11a says); TV Tokyo 第193話 = clones
regenerating from liquid, Uryū spotting the tell, Renji's idea wrecking the palace, Szayelaporro's
new Fornicarás technique — pure ch 292-293; the fandom summary is wholly manga and its last
line ("Nelliel's appearance during her time as an Espada is recalled") is a recall, i.e. T8
re-use, not original story. A web search turned up no source that explains AFL's label; every
other list calls 193 canon. Under the faithfulness clause (T28, 2026-09-02) stretch and recall
inside an adapted chapter are `divergence`, never weighed toward mixed — so canon is the
ruled reading. The caveat both verdicts miss: among the fifteen episode pages fetched (167,
190-203) ONLY Episode_167 carries an `==Anime Notes==` tabber. The wiki's differences project
simply has not reached 190-203; "no Manga & Anime Differences section" (w11b) and "no source
names an original block" (w11a) are therefore an absence of documentation, not a negative
finding. That does not overturn the retype (AFG + TV Tokyo + the summary are three positive
readings of the content), but the apply note should say "no source documents one" rather than
"no source names one". Anchor unaffected either way; keep the `divergence{292-293}` annotation
under either type. The author flagged this as the weaker retype — the flag is honest.

### F2 — w11b's structure note misreads the vol-34/35 per-chapter reverse index — note-level, no value moves
w11b: "only 296 and 306 lack the field entirely — unmaintained, not a negative". Refetched:
Volume_34's ch-296 section HAS the field (`*Episode 195: Pesche's Seriousness`), and
Volume_35's ch-306 section HAS it too — listing BOTH `Episode 199` and `Episode 200`. So the
"199" the note dismisses as header slop (`|episodes = Episodes 199 - 203`) is repeated in the
per-chapter list for 306, and the note's claim that "the finer per-chapter lists are exact"
is not literally true on this chapter. The conclusion still holds on three witnesses: the
ep-199 field `304, 305`, AFG 199 = `304, 305`, and the summaries — ep 199 ends on Mayuri's
Superhuman-Drug stab, which the vol-34 ch-305 summary places at the END of 305, and ep 200
opens "in his mind, Szayelaporro wonders how many years have passed", which the vol-35 ch-306
summary gives as 306's FIRST beat. Even if ep 199 did show a page of 306, A47 would hold its
END at 305 (ep 200 STARTs on 306). Correct the sentence at curation; nothing else moves.

### F3 — bleachfiller.com is dead; w11a's "identical lists" claim is unverifiable
w11a: "AFL and its derivative bleachfiller.com print identical lists and are ONE source".
Fetched today: the domain serves a personal portfolio (`<title>Vincent D'Amico – Web Designer
and Developer`), no filler list at all. The claim may have been true from an earlier fetch,
but it cannot be checked now and should not be recorded as fact in the apply note. No
`sources` array cites bleachfiller, so nothing renders from it — citation-quality nit only.
AFL's own page (fetched) is the sole dissent on 190 and 193, unexplained on both.

### F4 — the ep-167 continue ADDITION: SOUND on the fact; scope is Sean's call
The fact: Episode_167's field is `[[Chapter 284]], [[Chapter 285]], [[Chapter 286]] (pages 1-8)`
verbatim; Volume_32's ch-286 list is `Episode 167` + `Episode 190`; AFG 167 = `284, 285, 286`;
ep 190's field opens at `286 (Pages 9-21)`. So ep 167 really ends mid-286 and the 22 Amagai
rows (AFL + AFG: all 22 filler) follow — the C1 shape ("ANY mid-chapter ending", Sean
2026-08-27). Precedent in the store: ep 127 → continue 229 across the 128-137 filler and
ep 146 → continue 247 across the 147-149 graft — both C1 continues on the last canon row
before a filler block, exactly this shape. Scope: ep 167 is a fence row, not a target; the
protocol allows a fence anchor to be REPAIRED with evidence, and a continue on the same row
on the same evidence is in the spirit of that clause but not its letter — the author flagged
it for exactly this reason. If accepted, one suggestion: also enrich the ep-167 record
(START 284, chapters_adapted `284, 285, 286 (p.1-8)`, volume 32 — fandom + AFG, two sources)
so the census can PROVE the C1 and the A47 outcome; run through `sliverEnd` with ep 190's
START 286 the record gives `substantive` (8 pp > 5) and the fence END 286 stands. Without a
span the fence row stays `start_without_span`. Optional; nothing else depends on it.

### F5 — the ep-203 START repair: SOUND, one census nit
`313` is right on three sources (field `313, 314, 315`; AFG `313, 314, 315`; vol-35 per-chapter
313/314/315 → 203) and ep 203's summary opens with the two-handed Ryōdan strike — the
vol-35 ch-312 summary's FIRST beat, i.e. a restaged close, never a START (A10) — before ch
313's Nnoitra/Nelliel flashback. The repair delivers only `start_chapter`; without a
`chapters_adapted` the START is unprovable by the census. Suggest curating the span
`313, 314, 315` alongside it.

### F6 — the ch-286 straddle vocabulary: `partial` is right; do not rename it to match ch 229
`ANNOTATION_KINDS` (lib/annotations.ts): `partial` = "adapts part of its chapters",
`rearranged` = "adapts source out of the source's order". Ch 286 is a clean partition in
running order — 8 + 13 = 21 pages, each page once, nothing out of order — the stored
218/219 {324} `partial` is the matching precedent, and every A47 tail annotation in the store
is `partial`. The stored 127/138 {229} `rearranged` is a different shape: BOTH records carry
ch 229 unqualified (ep 127 `227-229`, ep 138 `229-230, 231 (p.1-10, 19)`; the context note
says "ep 138 re-covers"), i.e. a re-adaptation across the filler, not a partition. If anything
the 229 label is the odd one; out of scope here.

### F7 — the 190 retype: SOUND under the recap clause
Trivia verbatim: "The first fifteen minutes of this episode recap the events following
Aizen's defection from Soul Society, covering chapter 178 onwards. The episode then continues
on from where episode 167 ended." AFG verbatim: "*Mixed: In this episode, we only watch from
the 15:08 mark to the end. This is where the story continues, as the first few minutes of the
episode are just a recap of previous events." The fandom field itself prints the recap as a
prefix (`Recap of Chapter 178 onwards; 286 (Pages 9-21), 287`) and the summary is 286 p.9-21
(the jump down, Grimmjow reverting and cut down by Nnoitra) + 287 (the Quinta reveal, Tesra
on Orihime, Renji's group back in the chamber) and nothing else; TV Tokyo's 第190話 synopsis
is itself an arc recap ending on Grimmjow's fall and Nnoitra standing in the way. Remainder
= pure source → canon; the `divergence{178-286 (recap)}` the clause requires is present. The
recap correctly appears in no `chapters_adapted` segment (a recap is never a position; A10's
SCRAPPY regex would refuse it as a lead anyway).

### F8 — the A47 hold on 200/201: SOUND, and the rule derives it
Fandom splits 308 `(Pages 1-3)` / `(Pages 4-19)` verbatim; AFG's `306, 307, 308` is
chapter-granular. The ep-200 summary ends on the Hollow-hole reveal; the ep-201 summary's
first two paragraphs are the eyepatch stab, the hand through Kenpachi's chest and the
Hollow-hole reveal again — a re-show — and its first new beat is Kenpachi laughing and
tossing Nnoitra's foot away. `sliverEnd('306-307, 308 (p.1-3)', 308, 308)` returns
`{end: 307, reason: 'owned-tail', pages: 3}`: had the author delivered 308, the apply layer
would have moved it to 307. `partial{308}` on 200/201 present, continue 308 = ep 201's START.

## What I checked and found SOUND

- **Row accounting**: 13 target rows, 13 anchors, no filler row in either block, no
  `anchor_hostile` needed; T27 vocabulary clean (both retypes are `canon`); annotation kinds
  `partial` / `divergence` only.
- **chapters_adapted vs the fandom fields**: 13/13 verbatim (w11b writes `300-301` for
  `300, 301` etc. — same set; the A47 parser splits on commas, and a range segment is
  `tail-not-end`, so nothing moves). Plus 167 and 203 verbatim.
- **AFG chapter column**: 190 `286, 287` · 191 `288, 289` · 192 `290, 291, 292` · 193 `292, 293`
  · 194 `294, 295` · 195 `296, 297` · 196 `298, 299` · 197 `300, 301` · 198 `302, 303` · 199
  `304, 305` · 200 `306, 307, 308` · 201 `308, 309, 310` · 202 `311, 312` · 203 `313, 314, 315`
  — the integer SET of every row, 15/15.
- **Volume pages' per-chapter reverse lists**: 287→190; 288,289→191; 290,291→192; 292→192+193;
  293→193; 294,295→194; 296,297→195; 298,299→196; 300,301→197; 302,303→198; 304,305→199;
  306→(199 slop)+200; 307→200; 308→200+201; 309,310→201; 311,312→202; 313,314,315→203.
  Headers verbatim: vol 32 `Episodes 165 - 167, 190 & 239`, vol 33 `Episodes 190 - 194`,
  vol 34 `Episodes 195 - 199`, vol 35 `Episodes 199 - 203`.
- **Qrefs**: Teatro_de_Titere `chapter=293|page=7-9|episode=193`, `page=11`, `page=14-15`;
  Lanzador_Verde `chapter=296|page=6-9|episode=195`; Nelliel `chapter=291|page=14 / 17 /
  17-19|episode=192` — all verbatim (the template is `{{qref}}`, lower-case).
- **Volumes**: en-WP `List of Bleach chapters (188–423)`: vol 33 = 287-295 (9), vol 34 =
  296-305 (10), vol 35 = 306-315 (10); the fandom `chapters` fields print the same three
  ranges with titles. All 13 anchor volumes are the END's volume (190-194 v33; 195-199 v34;
  200-202 v35), the catalog convention.
- **Monotonicity / fence**: ENDs 287 < 289 < 292 < 293 < 295 < 297 < 299 < 301 < 303 < 305 <
  307 < 310 < 312, all inside 286..315; STARTs 286 … 311 monotone; seam 196 END 299 / 197
  START 300 clean; no back-jump, so no `rearranged` owed. ep 190 START = ep 167 END (286)
  is the stored 110/111 → 186 and 146/149 → 247 shape.
- **Continues**: 192 → 292 (C1, = 193's START), 200 → 308 (= 201's START), 202 → 313 (= 203's
  proposed START), 167 → 286 (= 190's START). Rows ending on a chapter's last page (190, 191,
  193-199, 201) correctly owe none.
- **Row identity (R20)**: en-WP season-10 dates 190 = 2008-10-14 … 202 = 2009-01-13, 203 =
  2009-01-20; fandom `japair` identical; TV Tokyo 放送 dates identical for 189-200; titles match
  the context. No offset.
- **en-WP season 10**: "from the rest of the 32nd volume to the 35th volume (chapters
  286–315), with the exception of episodes 204 and 205 (filler)" — verbatim.
- **TV Tokyo**: the 2012 archive covers 第189-200話; every synopsis in 190-200 is manga
  content matching the row's chapters. 201-202 are on episodes18, not cited by w11b — its
  three sources suffice.
- **The omake corners**: section headers show Shinigami Illustrated Picture Book on 190, 200,
  201, 203 and Arrancar Encyclopedia on 193, 202 among the pages read — the ~1-minute gag
  card is on canon-typed rows too, so it cannot be AFL's mixed reason; T28 does not weigh it.
- **Citations**: primary = the fandom API, AFG, TV Tokyo's own archive, en-WP; the fight pages
  add nothing (no anime-difference text on any of the three). No content farms in any
  `sources` array.

## Verdict per claim

| claim | verdict |
|---|---|
| 190 → 287 [286] v33 + partial{286} + divergence{recap} | SOUND |
| 190 RETYPE mixed → canon (T28 recap clause) | SOUND (F7) |
| 191 → 289 [288] v33 | SOUND |
| 192 → 292 [290] v33 + C1 continue 292 + partial{292} | SOUND |
| 193 → 293 [292] v33 | SOUND |
| 193 RETYPE mixed → canon (faithfulness clause) + divergence | SOUND WITH CAVEAT — silence, not a negative; Sean's call; note wording (F1) |
| 194 → 295 [294] v33 | SOUND |
| 195 → 297 [296] v34 | SOUND |
| 196 → 299 [298] v34 | SOUND |
| 197 → 301 [300] v34 | SOUND |
| 198 → 303 [302] v34 | SOUND |
| 199 → 305 [304] v34 | SOUND (F2 on the note only) |
| 200 → 307 [306] v35, A47 hold + partial{308} + continue 308 | SOUND (F8) |
| 201 → 310 [308] v35 | SOUND |
| 202 → 312 [311] v35 + continue 313 | SOUND |
| ep 167 continue 286 (fence-row addition) | SOUND on the fact; scope Sean's call; optional span enrichment (F4) |
| ep 203 START repair null → 313 | SOUND WITH CORRECTIONS — add chapters_adapted `313, 314, 315` (F5) |
| volumes v33 = 287-295, v34 = 296-305, v35 = 306-315 | SOUND (en-WP + fandom) |
| 286 straddle labelled `partial` (vs stored 229 `rearranged`) | SOUND — keep `partial` (F6) |
| w11b "296 and 306 lack the reverse field" | REFUTED (both have it; 306 lists 199 + 200) — note-level, no value affected (F2) |
| w11a "bleachfiller.com prints AFL's exact lists" | UNVERIFIABLE — domain dead; drop from the apply note (F3) |

## Verdict on the verdicts

All 13 chapter values stand on the fandom page fields, AFG's chapter sets and the volume
pages' reverse lists, with TV Tokyo's own synopses as the official third witness on 190-200;
every START and END survives `sliverStart`/`sliverEnd` unchanged and the one A47 case (200) is
what the rule itself derives. Both retypes are the ruled reading under the 2026-09-02 clauses;
190 is clean, 193 rests on three positive content readings plus the fandom's SILENCE (its
Anime Notes coverage ends at 167 here), which the apply note should say plainly. Nothing must
be blocked. Three curation nits: the ep-203 repair should carry its span; the w11b structure
sentence about ch 296/306 is wrong and should be dropped; the bleachfiller claim is
unverifiable and should be dropped. The ep-167 continue is correct and precedented (127 → 229,
146 → 247) — whether a fence row may take an addition in lane A2 is Sean's ruling, and the
author flagged it.
