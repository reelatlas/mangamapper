# Verification — demon-slayer-kimetsu-no-yaiba × AniList 178788 (Infinity Castle, Part 1: 猗窩座再来)

Verifier: Fable 5.1 (R24 — a different model than the Opus author) · 2026-09-05 · related-works programme, WAVE 1
Under review: `scripts/ingest/research/discovery/out/demon-slayer-kimetsu-no-yaiba__178788.json`
Context the author had: `scratchpad/extras-w1/demon-slayer-kimetsu-no-yaiba__178788.md` · contract: `discovery/PROTOCOL-extras.md`
Method: every one of the 14 cited URLs fetched raw (fandom + ja-WP + en-WP via the MediaWiki API, MU via the v1 API, the
official site / eiga.com / Shueisha / Realsound as HTML); fandom Chapters 139–158 fetched beyond the citations to place every
beat the plots name; `validate-extras.ts` run read-only (8 files, 0 problems). AniList not queried (disabled today) — its
facts are taken from the context artifact.

## Conclusion: SOUND WITH NOTES

No finding touches a value that will render. Standing `canon`, chapters `140-157` (157 partial), `recap: false`, position
`63.5 confirmed`, `adopted: null`, `repairs: []` all survive adversarial checking against the sources' own text. Four
low-damage notes: two on how the summary prose attributes / frames its evidence, two on the precision of flags for Sean.

## Recap baseline (stored first, then the verdict, then the verifier)

### demon-slayer-kimetsu-no-yaiba

| row | stored | verdict | verifier |
|---|---|---|---|
| work 178788 — Demon Slayer: Kimetsu no Yaiba Infinity Castle (劇場版「鬼滅の刃」無限城編 第一章 猗窩座再来) | position 63.5 · kind movie · standing PENDING · chapter — · chapters_adapted — · origin halo (I45 same_instrument) | canon (high) · 140–157 (157 pp. 1–6, partial; ch 139 restaging excluded as re-shown) · recap false · position confirmed 63.5 · adopted null · repairs none | canon · 140–157 (157 partial, two sources at chapter level) · 63.5 confirmed · SOUND WITH NOTES |
| ep 63 — The Hashira Unite (the position's basis; not a row the verdict changes) | canon · END 139 (context grid `?–139`) | adapts ch 137–139 — corroborates the stored END 139 | confirmed: fandom Episode 63 infobox `chapters = 137, 138, 139`; MU `Vol 16, Chap 139 (S4)`; ep 63's plot ends on ch 139's last beat (Muzan's boast / Tanjiro's vow in the fall), and ch 140 opens with Giyu catching Tanjiro — not in ep 63 |

## What I checked, and what the sources actually say

| claim in the verdict | source fetched | what it says | holds? |
|---|---|---|---|
| film infobox prints 140–157 (p. 1-6) | fandom `Demon Slayer: Kimetsu no Yaiba – Infinity Castle` (wikitext) | `\|episodes = [[Chapter 140\|140]]-[[Chapter 157\|157]] (p. 1-6)`; `\|previous = To the Hashira Training / [[Episode 63]]` | yes |
| the anime overview's films table repeats it | fandom `Kimetsu no Yaiba (Anime)` | Movies table row: `(Chapter 1) 140 - 157`; S4 row `128 - 139` | yes |
| MU segment start / end | `api.mangaupdates.com/v1/series/36271319846` (title "Kimetsu no Yaiba", 23 vols complete, latest 205) | anime.start `… / Vol 16, Chap 140  (Infinity Castle Movie 1)`; anime.end `… / Vol 16, Chap 139 (S4) / Vol 18, Chap 156 (Infinity Castle Movie 1)` | yes — verbatim (see N2 on the "in full" gloss) |
| en-WP's plot ends on ch 157's opening beats | en-WP `Demon Slayer: Kimetsu no Yaiba – The Movie: Infinity Castle` | "…reunites with Koyuki, who embraces him before accompanying him to Hell. Tanjiro and Giyu pass out … announced by the Kasugai crows. Kokushibo and Doma are disappointed by Akaza's death…" — every one of those is ch 157 per the fandom's ch 157 summary (ch 156 ends before Akaza's spirit departs) | yes |
| the closing beats en-WP also names (Nakime confusing the Ubuyashikis; Muzan's cocoon over Tamayo) are inside the span | fandom ch 144 / 146 / 147 / 158 | Tamayo's flesh cocoon = ch 146; Kiriya/Kanata mapping, Tengen + Shinjuro on guard, Urokodaki administering Tamayo's drug to Nezuko = ch 147; Yushiro's mapping = ch 144; ch 158 is Kanao vs Doma proper — absent from both plots (en-WP, fandom film Plot) | yes — nothing from 158+ |
| ch 140 is the first chapter the fandom files under the Infinity Castle Arc | fandom ch 139 / ch 140 | ch 139 `arc = Hashira Training Arc`, `anime episode = 63`; ch 140 `arc = Infinity Castle Arc`, `anime episode =` (empty) | yes |
| ep 63 adapts 137–139 and the film's ch 139 opening is re-shown | fandom Episode 63 (infobox + Plot); fandom film page Plot ¶1 | ep 63 Plot animates the Gyomei/Kagaya flashback ("Kagaya predicted that Muzan would come in five days, asking Gyomei to use him as bait … if sunlight is the only option … fight until dawn"); the film's Plot ¶1 opens on the same conversation ("Days before Muzan's arrival, Gyomei meets with Kagaya … merely beheading him may not be enough … battle Muzan until the sun rises") | yes — re-shown ch 139, correctly position-less (A44 re-shown pages; T28 recap clause) |
| the grave-visit prologue is anime-original; the other originals are flourishes; skeleton + dialogue follow the source | Realsound p.1 / p.2 | p.1: 「物語冒頭でアニメオリジナルとして描かれた岩柱・悲鳴嶼行冥の墓参りの場面」, an homage to the Mugen Train Kagaya/Amane grave scene; p.2: the fall vignettes, unnamed slayers holding the line, Murata's 「薄い水の呼吸」, Giyu's mark red vs the source's blue, and 「物語の骨格や台詞の流れには原作への深いリスペクトが感じられる」 | yes (see N1 on attribution) |
| the film's early content is ch 140 | ja-WP §制作 | 「映画冒頭の炭治郎と義勇が鬼と戦うシーン」 (the demon-horde fight = ch 140) | yes — independent corroboration the verdict did not even use |
| sequel to 柱稽古編; date; runtime | ja-WP lead + infobox; eiga.com; official site | ja-WP: 「2024年5月から6月に放送されたテレビアニメ『柱稽古編』の続編」, 公開 2025年7月18日, 上映時間 155分; eiga.com: 「無限城編」3部作の第1章 / 155分 / 劇場公開日 2025年7月18日; kimetsu.com og:title 『劇場版「鬼滅の刃」無限城編 第一章 猗窩座再来』公式サイト｜2025年7月18日(金)公開 | yes — no repair needed |
| Shueisha novelization blurb frames the start at the Ubuyashiki estate and the drop | j-books.shueisha.co.jp | 「産屋敷邸に現れた鬼舞辻無惨。…無惨の手によって謎の空間へと落とされてしまう。炭治郎たちが落下した先、それは鬼の根城≪無限城≫―」 | yes |
| vols 16–18 | fandom chapter infoboxes | 140–142 vol 16 · 143–151 vol 17 · 152–157 vol 18 | yes |
| the fandom's chapter pages carry an empty anime-episode field for 140–157 | fandom ch 140–158 | all empty; 139 = Episode 63 | yes — silence, as the verdict reads it |

Hunt order (R24): (1) internal contradiction — none: summary, `chapters_adapted` {140, 157}, position block and flags all say
the same thing; validator 0 problems. (2) anchors beyond evidence — none (above). (3) monotonicity — n/a (one contiguous span;
the film's interleaving of the three fights is a rearrangement inside the span, not a coverage claim). (4) A1 / T26 / T27 —
standing is `canon` (legal vocabulary); chapters are named on a canon work, not a filler one; no adoption question; no
side_source. (5) scope leakage — chapters are in the owner's instrument (Kimetsu no Yaiba manga, 205 ch) and inside its space;
no sequel / franchise value. (6) citation quality — no content farm, no AI summary; Realsound is an editorial analysis used
only for the secondary (original-material) claim, which is the right tier for it.

## T28 — is any studio-original material substantial enough for mixed? No.

The work's job is to adapt ch 140–157 — three fights told in the source's own order of events with the source's dialogue
(Realsound; en-WP reception: "faithful adaptation"). The originals inventoried are a short grave-visit prologue, character
vignettes during the fall, unnamed slayers, one visual effect and one colour choice: the FAITHFULNESS CLAUSE in T28 names
exactly these ("a small studio-made beat inside an adapted chapter … is NOTED, never weighed"). The restaged ch 139
conversation is a plain retelling of already-adapted material — the RECAP CLAUSE says it "counts for NOTHING in the standing;
the REMAINDER decides", and the remainder is pure source. Nothing in any fetched source describes a newly animated sequence of
significant length carrying scenes the source lacks (the RECAP BOUNDARY's trigger for weighing toward filler). Canon.

## Findings, ranked by damage (none reaches the data)

**N1 · attribution in the summary (low).** The summary credits Realsound with confirming that the film "opens on a
studio-invented scene of Gyomei visiting the Corps graves … while recalling the Kagaya conversation the TV series already
animated in ep 63 from ch 139". Realsound supports only the first half (the grave visit is anime-original, an homage). The
second half is supported by a *different* cited source — the fandom film page's Plot ¶1 (the Kagaya/Gyomei conversation) read
against ep 63's Plot (the same conversation, animated) and ch 139's summary. The fact stands; the sentence assigns it to the
wrong URL. Data impact: zero — ch 139 is adapted by ep 63 either way, so the restaging is position-less regardless of who
reports it. What would settle it beyond doubt: the film / the theatrical pamphlet; not needed for the value.

**N2 · MU presented as agreeing on 157 (low).** "MU's pin naming the last chapter adapted IN FULL, i.e. the same straddle
into 157" is the author's gloss, not MU's statement: MU's string is `Vol 18, Chap 156` with no page qualifier — and MU uses
page-level pins in the very same field when it means them (`Chap 54 Page 4 (S1)` / `Chap 54 Page 5 (S2)`). Read literally,
MU says the film ends at 156. The chapter-level 157 still rests on TWO sources — the fandom infobox (explicit `p. 1-6`) and
en-WP's plot (Koyuki accompanying Hakuji, the crows, Kokushibo's and Doma's reactions — all ch 157 content per the fandom's
own ch 157 summary). By the A47 existence-clause logic (the tail exists on two sources; only its size is single-source),
`end: 157` with the partial note is the catalog's convention, and the verdict's PAGE SPLIT flag already says the size is
single-source. Conclusion: 157 stands; the summary should say MU stops at 156 and the fandom + en-WP carry the straddle, not
that MU "agrees on the span". What would settle the size: the Blu-ray chapter list or the pamphlet's scene list.

**N3 · LABEL flag premise (low).** "AniList 178788's title is the TRILOGY name" is half right. "Demon Slayer: Kimetsu no
Yaiba Infinity Castle" is ALSO Part 1's own official international release title (en-WP: officially "… Infinity Castle –
Part 1: Akaza Returns", "commonly known as Demon Slayer: Infinity Castle"; the fandom's trailer captions carry the plain
title), and the native title in the context (第一章 猗窩座再来) is already Part-1-specific. The recommendation survives on
a different footing: Part 2's AniList title carries "Part 2" (195200, per EXTRAS-SITTING.md) while Part 1's does not, so the
pair is ambiguous in a list — a display label carrying 第一章 / Part 1 is still worth minting.

**N4 · ORDERING flag partly stale (low).** "The ledger needs an intra-position order key, or 63.5 / 63.6 / 63.7, before
Part 2 is entered — otherwise the trilogy renders in arbitrary order." Two mechanisms already exist:
`lib/related-works.ts#freePosition` resolves same-slot collisions in 0.01 steps in date order (the ledger's key is
(series, position)), and `RelatedWorkRuling.position` lets a ruling set 63.6 / 63.7 today. The real gap is narrower than
stated: Parts 2 and 3 are undated, and `sync-related-works.ts` skips an undated, unruled work
(`derived == null && !cur → unpositioned`) — they will not enter the ledger at all until dated or ruled. Sean's decision is
whether to pre-rule their positions or wait for dates; the flag's "needs an order key" premise is out of date.

**Info · FRONTIER flag.** Correctly a flag, not a claim: the context shows "max adapted by the run ?", and nothing I read
feeds a ruled `chaptersAdapted` on a ledger row into the series frontier / continue. "18 adapted chapters" = 140–157
inclusive (157 partial) — arithmetic is right. Sean's call, as the verdict says.

## Things I tried to break and could not

- A start earlier than 140 (first-time ch 139 material in the film): ep 63's plot animates every ch 139 beat the film's
  opening restages, including the Gyomei/Kagaya flashback; the film's first source content that ep 63 lacks is ch 140's
  Giyu-catches-Tanjiro / demon-horde fight (fandom ch 140; ja-WP 「映画冒頭の炭治郎と義勇が鬼と戦うシーン」).
- An end beyond 157 (Nakime, the cocoon, Nezuko/Urokodaki looked like they might be later chapters): all placed at 144 /
  146 / 147; ch 158 (Kanao vs Doma) appears in neither plot.
- A recap reading (`recap: true`): the film is a continuous first-time adaptation; the ep-63 restaging is a prologue, not a
  compilation (I45 / N8 do not apply).
- A different position: nothing airs between ep 63 (2024-06-30) and the film (2025-07-18); the film's `previous` on the
  fandom is Episode 63; ja-WP calls it the 続編 of 柱稽古編.
- Kind / date / runtime repairs: three independent sources agree with the stored row.

## Files

- Verdict: `/Users/sean/Projects/mangamapper/scripts/ingest/research/discovery/out/demon-slayer-kimetsu-no-yaiba__178788.json`
- Context: `/private/tmp/claude-501/-Users-sean-Projects-mangamapper/9cb5ba33-f276-45a2-b114-7209c7228d10/scratchpad/extras-w1/demon-slayer-kimetsu-no-yaiba__178788.md`
- Raw fetches kept for audit: `/private/tmp/claude-501/-Users-sean-Projects-mangamapper/9cb5ba33-f276-45a2-b114-7209c7228d10/scratchpad/verify-w1/`
- Mechanisms cited in N4: `/Users/sean/Projects/mangamapper/scripts/ingest/lib/related-works.ts` (`freePosition`, `deriveWatchPosition`), `/Users/sean/Projects/mangamapper/scripts/ingest/sync-related-works.ts` (the `unpositioned` skip), `/Users/sean/Projects/mangamapper/scripts/ingest/lib/rulings/related-works.ts` (`position?: number`)
