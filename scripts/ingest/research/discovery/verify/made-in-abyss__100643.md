# Verification — made-in-abyss × AniList 100643 "Made in Abyss: Dawn of the Deep Soul" (related-works wave 1)

- Verdict under review: `scripts/ingest/research/discovery/out/made-in-abyss__100643.json`
- Context the author had: `scratchpad/extras-w1/made-in-abyss__100643.md`
- Contract: `scripts/ingest/research/discovery/PROTOCOL-extras.md` (PER WORK shape)
- Verifier: Fable 5.1 (R24 — a different model than authored). 2026-09-05.
- Method: every cited fandom page re-fetched via the MediaWiki API (`action=parse&prop=wikitext`), plus ch 028-031 / 033-036 which the verdict cites only in aggregate; MangaUpdates via its API; ja-Wikipedia via its API; both miabyss.com pages; the MangaDex aggregate. AniList not queried (disabled today; not needed — its facts are in the context). No DB access.

## Conclusion: SOUND WITH NOTES

Standing `canon`, chapters 26-38 with ch 26 page-split against our ep 13, `recap: false`, position 13.5 confirmed, no repairs — every one of these reproduces from the primary sources. The findings below are wording defects inside one row note (one of them a false absolute that would ship if copied verbatim into the ruling note), two disclosure gaps, and sitting-relevant facts the author could not have seen from the context file. Nothing changes the standing, the span or the position.

## Recap baseline

### made-in-abyss

| row | stored | verdict | verifier |
|---|---|---|---|
| Dawn of the Deep Soul (100643) @ 13.5 | PENDING · kind movie · chapter — · chapters_adapted — · position 13.5 (date-derived) · origin halo · no ruling | canon · [26-26 (pp 12-16, page-split with ep 13)] + [27-38] · recap false · position 13.5 confirmed · adopted null · repairs [] · confidence high | SOUND on standing, span, recap, position, repairs, confidence. Row-2 note carries a false absolute ("nothing else for every one of ch 27-38" — ch 37 also → the *Together with Papa* OVA) and a loose "vols 4-5 in full"; fix the wording at curation |
| ep 13 (touched by the seam, not by the verdict) | canon · anchor END 26 [START 23] {23-26, ch 26 pp 1-11 of 16} v4 manual · continue 26 (C1/C5) · + divergence{26} + rearranged{24} | untouched — the film starts at ch 26 p 12 | consistent: fandom Episode_13's last refs are `026|1-7`, `026|8-11`; the film page opens at `{{Ref|m|026|}}`; batch 20 wave 6 already verified this seam SOUND (`research/batch20/verify/made-in-abyss.md`). No change proposed |

## Findings, ranked by damage

### 1. Row-2 note: "the wiki's per-chapter 'Adapted To' fields name Movie 3 and nothing else for every one of ch 27-38" — FALSE for ch 37, and contradicts the verdict's own summary (low damage; would ship as a false absolute if copied into the ruling note)

- File: `out/made-in-abyss__100643.json`, `chapters_adapted[1].note`.
- Evidence: I tabulated `== Adapted To ==` for every chapter 026-039. Ch 027-036 and 038: `Movie 3: Dawn of the Deep Soul` only. **Ch 037: `Movie 3: Dawn of the Deep Soul` AND `Together with Papa OVA`.** Ch 037's Trivia: "Scenes of Prushka gifting papier-mâché whistles to Failed Umbra Hands had been given storyboards for Dawn of the Deep Soul, but were cut during the production … subsequently adapted for the Together with Papa OVA." Series Continuity (ch 37): "Though not adapted into the movie version, the scene … appears as part of the OVA, Together with Papa.{{Ref|m|037|17-18}}".
- The verdict's summary knows this ("one omission (ch 37 pp 17-18 … later animated as the OVA 'Together with Papa')"); the row note over-generalised it away. The summary's other formulation — "NO episode of either season" — is true (checked: no `{{Ep|…}}` entry on any of ch 27-38).
- Fix at curation: "…name Movie 3 and no TV episode; ch 37 pp 17-18 are additionally adapted by the 6-minute *Together with Papa* short (S2 Blu-ray vol 1, 2022-10-26)". The standing and span are unaffected (a 2-page sliver on the OVA side; T28 sliver clause).

### 2. Row-2 note: "vols 4-5 in full" — loose; vol 4 is not in full (low damage, wording)

- Vol 4 = ch 25-32 (MangaDex aggregate `vol 4: 25-32`; fandom `Volume 04 Chapters` on ch 025-032; MU "Vol 4, Chap 25 (S1) / Vol 4, Chap 26 (Movie 3)"). Ch 25 and ch 26 pp 1-11 are ep 13's. The summary has it right ("the back of volume 4 plus the whole of volume 5"); the row note does not.
- Fix: "the rest of vol 4 (27-32) and all of vol 5 (33-38)".

### 3. MangaUpdates disagreement at the seam not disclosed (low damage; R3 disclosure)

- The verdict quotes MU's "Vol 4, Chap 26 (Movie 3)" (film start) and "Vol 5, Chap 38 (Movie 3) / Vol 10, Chap 60 (S2)" but elides the same string's **"Vol 4, Chap 25 (S1)"** — MU gives ch 26 wholly to the film, i.e. it disagrees with our stored ep-13 END of 26 at whole-chapter granularity. Fetched string, verbatim: start `Vol 1, Chap 1 (S1) / Vol 4, Chap 26 (Movie 3) / Vol 6, Chap 39 (S2) / Vol 11, Chap 61 (Movie 4)`, end `Vol 4, Chap 25 (S1) / Vol 5, Chap 38 (Movie 3) / Vol 10, Chap 60 (S2) / TBA`.
- Settled, not open: batch 20 wave 6 (verified SOUND) established ep 13 = ch 26 pp 1-11 of 16 against Takeshobo's own viewer and recorded MU's whole-chapter convention. The page-level fandom refs beat the coarse coverage string. The ruling note should still say "MU rounds the seam to whole chapters (S1 → 25, film → 26)" so the next reader does not rediscover the disagreement.

### 4. "pp 12-16" for the film's share of ch 26 is an inference presented as sourced (cosmetic)

- The film page's opening ref is `{{Ref|m|026|}}` — no page range. The split is derived: ch 26 has 16 pp (fandom infobox; Takeshobo viewer per batch 20) and ep 13's refs end at p 11, and the ch 026 synopsis's second paragraph (Garden of the Flowers of Fortitude, Lyza's supposed grave, the Umbra Hand) is exactly what the film page attributes to ch 26. The inference is right; label it "(derived: 16 − ep 13's 11)".

### 5. "one omission (ch 37 pp 17-18)" understates the wiki's manga-only list (cosmetic; argues FOR canon, not against)

- Series Continuity → Manga-only Content lists **20 bullets across ch 26-38** (ch 26: 1; 27: 2; 28: 2; 30: 1; 31: 1; 32: 2; 33: 2; 34: 2; 35: 2; 37: 4; 38: 1), all one-beat cuts (a line of dialogue, a single panel, Hablog's account in Orth, a Prushka memory). The verdict names one. None weighs on the standing (T28 faithfulness clause: cuts and omissions keep the row canon) — but "one omission" is not what the source says.

### 6. Protocol shape (cosmetic)

- `summary` is ~10 sentences against the protocol's "3-6", and contains "105-minute完全新作 (fully new…)" with the Japanese run into the English. Content is fine; the curator will shorten it anyway (the ruling `note` is "a short note").

## Checked and found sound

- **Span 26-38, two independent sources agreeing on the same chapters (R3, confidence `high` earned).** Fandom film page `== Adapted From ==`: `{{VC|v=4|c=26}}` … `{{VC|v=5|c=38}}` (13 entries, contiguous); its synopsis is cited chapter-by-chapter from `{{Ref|m|026|}}` to `{{Ref|m|038|15-17}}`. MU: "Vol 4, Chap 26 (Movie 3)" → "Vol 5, Chap 38 (Movie 3)". ja-WP (anime article, 深き魂の黎明 section), verbatim: 「テレビシリーズ及び劇場版総集編の続編で、第4巻の途中から第5巻でのボンドルドとの対決が描かれる。」— consistent (vol 5 ends at ch 38: MangaDex `vol 5: 33-38`; fandom ch 038 `volume 5`, `next_chapter = ssc 1`).
- **The film stops at ch 38 pp 15-17.** Ch 038 has 17 pp; the film page's last paragraph ("Bondrewd is shown seeing them off … reciting a poem") is `{{Ref|m|038|15-17}}`; ch 038's synopsis ends on the same beat (the Altar, the White Whistle poem). Ch 039's `Adapted To` = S2 ep 1, S2 ep 2 — not the film.
- **Sole adaptation of 27-38 by any TV episode: true.** Tabulated above. Only the ch 37 OVA sliver (finding 1) breaks the "nothing else" wording.
- **Standing canon under T28.** Series Continuity → Movie-only Content → Movie 3 is exactly seven bullets (a pillar descent, a zoom on the collapsed delvers, a thrown Deceptor, a collapsing water support, Prushka watching the arrival, a vision of the Human-like Silhouette, one line of Nanachi's) — slivers, noted never weighed. The film's job is the Ido Front arc: ~277 first-time pages of the instrument in 105 minutes. Not remotely mixed.
- **`recap: false`.** ja-WP twice: 「完全新作の劇場版」 (lines 53, 476 of the wikitext); the film page has no compilation footage in its synopsis; AniList's synopsis ("continues the epic adventure") agrees.
- **Position 13.5 confirmed, four independent seams.** (a) Fandom infoboxes chain ep 13 `nextEpisode = Dawn of the Deep Soul` → film `previousEpisode = S1 ep 13 (anime)`, `nextEpisode = S2 ep 1` → S2 ep 01 `previousEpisode = Dawn of the Deep Soul`. (b) Ch 039 `Adapted To` = S2 ep 1-2; S2 ep 01 `Adapted From` = ch 39 + ch 48 (the Ganja prologue, refs `048|1-24`, `039|8-15`, `039|16-17`). (c) MU: "Vol 6, Chap 39 (S2)". (d) miabyss.com/2nd_intro.html, verbatim: 「しかし、プルシュカは形を変えリコの白笛となり、一同は深界六層「還らずの都」へと進む。」— 還らずの都 is ch 039's title (fandom `japanese = 還らずの都`). Date-derived and story-derived positions coincide; the S1 grid is 13 rows, so any post-finale work derives 13.5.
- **No repairs needed — correct.** Stored kind movie / title / 2020-01-17 all match the film page (`airDate = January 17, 2020`, `runtime = 105 minutes`) and ja-WP (2020年1月17日).
- **A1 / A44 / T26 / T27 / N4 / N8.** No anchor proposed on any episode row; no numbering proposed for the film (it stays an order-only related work); standing vocabulary is `canon` (T27); no `side_source`, no `adopted`, no retired type anywhere.
- **Scope.** Chapters are in the owner's instrument (AniList manga 86551) in the printed numbering; fandom volume fields, MangaDex and MU agree on vol 4 = 25-32 / vol 5 = 33-38 / vol 6 = 38.5 + 39-42 (flag 4 reproduces exactly). No S2 chapter number lands in any delivered field. Latest known 74 matches MU `latest_chapter: 74`.
- **Flags 2, 3, 5 reproduce.** Story Arcs lists Ido Front Arc = ch 27-38 + Movie 3 and Poison and Soul Liberation Arc = ch 19-26 + Movie 2, with the page's own caveat "Story Arcs are not officially titled or partitioned" — an arc partition, not a coverage claim, exactly as the verdict reads it. The vol-6 extra is `Made in Abyss Side Story Chapter 001` = "How Are You? Somewhere 1 - Reg" (ハウアーユードコカ レグ), vol 6, 5 pp, `previous_chapter = ch 38`, `next_chapter = ch 39` — title and placement as the verdict says (the "Reg" is Riko's childhood dog; the content is Mio's flashback). Ep 13 and ch 38 are both titled 挑む者たち — the title-collision warning is right.
- **Flag 1's ja-WP claim reproduces verbatim** (line 479): Journey's Dawn 2019-01-04 = 第1話から第7話Aパート, Wandering Twilight 2019-01-18 = 第7話Bパートから第13話, both 再編集し新規カットを追加.
- **Citation quality.** Primaries are the fandom API, the MU API, ja-WP's API, the official sites, MangaDex's API. The Google AI summary is named as cross-check only. No content farm anywhere. The MU HTML URL duplicates the API record (harmless).

## Notes for the sitting (outside the verdict's reach; not defects)

- **S2 is not yet a catalog series.** `EXTRAS-SITTING.md` §4 lists "Made in Abyss S2 via Dawn of the Deep Soul" among the unclaimed sequels queued for the next `/discover` sitting. When S2 is minted, this film is reached by it via PREQUEL and the ruling map is keyed by (owner, AniList id) — a second entry under the S2 owner (same chapters, position before its ep 1) will be needed; the curator should land the two together so they cannot drift.
- **The 13.5 collision is larger than the verdict's flag says.** The sitting table (`EXTRAS-SITTING.md` line 294) holds TWO same-instrument works for this owner: 100643 and **Mezameru Shinpi (160275, MOVIE, 2026)**. MU's fourth segment "Vol 11, Chap 61 (Movie 4) / TBA" is presumably that film — i.e. a work adapting chapters AFTER S2's ch 60 will also derive 13.5 in this 13-row grid. The verdict's proposed tiebreak (Dawn of the Deep Soul LAST at 13.5, behind the two recaps) would misorder it once 160275 lands; order the 13.5 cluster by chapter, not by date. The author could not see 160275 from the context file. The two recap films' presence at 13.5 is derivation-plausible (both aired after 2017-09-29) but unverified here — no DB access.
- **For the two recap films' own verdicts**: ja-WP says both carry 新規カット, and Series Continuity → Movie-only Content → Movie 2 lists a new scene (Bondrewd at Mitty's lamp, Prushka running in). N8 keeps them `recap` / filler; note the new footage.
- **Ch 39 pp 1-7** (the Altar's membrane, Riko rubbing the stone) are cited by neither the film page nor S2 ep 01 (whose refs start at `039|8`). A page-level gap on the S2 side, not this film's; the whole-chapter seam 38 | 39 holds.
- **Curation shape.** `RelatedWorkRuling` stores one `chapter` (number), `volume`, and `chaptersAdapted` as a string; the verdict's two-row array must be flattened. Suggested: chapter 38 (the END, A4 convention), volume 5, chaptersAdapted "26-38 (ch 26 pp 12-16 — pp 1-11 are ep 13's; ch 27-38 in full)", with findings 1-3 folded into the note.

## Evidence index (all fetched 2026-09-05)

- `https://madeinabyss.fandom.com/api.php?action=parse&page=Made_in_Abyss_Movie_3:_Dawn_of_the_Deep_Soul&prop=wikitext&format=json`
- `…page=Made_in_Abyss_Chapter_026` … `_039` (all fourteen), `…page=Made_in_Abyss_Side_Story_Chapter_001`, `…page=Made_in_Abyss:_Together_with_Papa`
- `…page=Made_in_Abyss_Episode_13`, `…page=Made_in_Abyss_Season_2_Episode_01`, `…page=Story_Arcs`, `…page=Series_Continuity`
- `https://api.mangaupdates.com/v1/series/22899415114` (anime.start / anime.end strings, latest_chapter 74)
- `https://ja.wikipedia.org/w/api.php?action=parse&page=メイドインアビス_(アニメ)&prop=wikitext` (lines 53, 476, 479, 510)
- `https://miabyss.com/2nd_intro.html`, `https://miabyss.com/movie/intro.html`
- `https://api.mangadex.org/manga/80422e14-b9ad-4fda-970f-de370d5fa4e5/aggregate?translatedLanguage[]=en`
- Repo: `scripts/ingest/research/batch20/verify/made-in-abyss.md` (the ep-13 seam, verified), `scripts/ingest/research/discovery/EXTRAS-SITTING.md` (§4; line 294), `scripts/ingest/lib/rulings/related-works.ts` (`RelatedWorkRuling`)
