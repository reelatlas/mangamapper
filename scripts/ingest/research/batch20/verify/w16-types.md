# Batch 20 wave 16 — TYPE MOVES under T28's sliver clause: adversarial verification

Verifier: Fable 5.1 (R24: Opus authored the verdicts). Scope: the ten `-w16.json` files named in the ask
(chrono-crusade, trigun, hajime-no-ippo-the-fighting, rosario-vampire, black-butler, zatch-bell,
detective-school-q, eyeshield-21, sailor-moon, tokyo-mew-mew). No verdict file and no DB row was edited.
Scratch (wikitext pulled through each wiki's `api.php`, AFL html, DB read-only dumps):
`/private/tmp/claude-501/-Users-sean-Projects-mangamapper/626dada3-d5b3-4dcd-b917-06bf2bdcd5e0/scratchpad/w16v/types/`.

Method per row: (1) is the source share a sliver or a story-progressing scene; (2) SOLE-ADAPTATION — is the
named "adapted properly elsewhere" episode real, checked against my own reads of the fandom episode/chapter
pages, ja-WP 各話リスト, licensor synopses (Bandai Channel), en-WP; (3) the type baseline — AFL (fetched), the
fandom, ja-WP, and whether one lineage was counted twice. Stored standing read from `episodes.type` +
`minted_by`, `chapter_anchors`, `episode_annotations` (read-only), and the T6 / A44 maps in
`scripts/ingest/lib/rulings/`.

## Verdict table (every row named, stored standing first)

| series | row | stored | verdict | verifier |
|---|---|---|---|---|
| tokyo-mew-mew | ep 21 | mixed (afl) + loose_parallel{8-9} + A44 | filler; "the briefing is a DUPLICATE of ch 9 pages already animated at ep 12" | **REFUTED premise — HOLD.** The ch-9 mew-aqua briefing is animated for the FIRST time in ep 21, not ep 12; sole-adaptation half (1) is TRUE and the beat is the series' premise device. Likely stays MIXED + partial{9} + A44 |
| black-butler | ep 37 | mixed (afl) + graft{} | filler; ch 22 pp 30-34 "DUPLICATE, adapted at ep 15" | **SOUND on type; annotation claim wrong.** No 2008-09 episode shows the tickets/parade; ch 22 pp 30-34 are first-time in ep 37 but a tease (ch 24's assignment is at ep 38) → still a sliver, filler |
| trigun | ep 6 | mixed (afl; T6 map 6:mixed Sean 2026-08-25) + partial{0,4} | filler; ch 4 opening "DUPLICATE of ep 5 / ep 7" | **SOUND on type; "duplicate" overstated.** The steamer-arrival / plant-supplies beat is in ep 6, not ep 7 (ep 7 restages the party and carries the departure + Kaite). Trivial first-time framing beat → filler + annotation |
| chrono-crusade | ep 14 | mixed (wiki; T6 map 14:mixed) + loose_parallel{22-26} | filler; Acts 22-26 = the Chicago block, nothing of the villa/fever/kiss | **SOUND, one gap named.** tropedia's `== Anime Only ==` lists the fever + kiss beats verbatim; en-WP lead "primarily original". Act 22 "Sinner" was not read by the verdict (cited MangaDex ids = Acts 21.5, 23, 24, 25, 27, 38; 22 and 26 uncited) — nor by me (MangaDex node 404). Residual, not blocking |
| chrono-crusade | ep 8 | mixed (wiki; T6 7-8:mixed) + graft{19-21 concept} | filler; anime-original Grand Central prologue; Acts 19-21 at ep 13 | **SOUND** |
| chrono-crusade | ep 17 | mixed (wiki; T6 17-21:mixed) + loose_parallel{22-26} | filler; Viede/Carv deaths + stigmata anime-only | **SOUND** |
| chrono-crusade | ep 21 | mixed (wiki) + graft{36-41…} + A44 | stays mixed (significant, sole: v6 Magdalene backstory), position-less; repair chapters → "36-42" | **SOUND** (v6 = Acts 36-42 confirmed on en-WP). Nit: the repaired chapters string drops the "extent unverified" qualifier into the note |
| hajime-no-ippo-the-fighting | ep 76 | mixed (afl) + graft{383 p.4-5} + A2 exclusion | filler; two panels, duplicate of ep 97 | **SOUND** |
| rosario-vampire | ep 14 | mixed (afl) + graft{Season II vol 1} | filler + side_source{S-II ch 1, 3} + recap + divergence; fork flagged | **SOUND on facts; type is Sean's T26 fork.** Filler is the T26-literal reading; trigun ep 18 (mixed + side_source) is the inconsistent precedent, not this row |
| zatch-bell | ep 122 | mixed (afl; T6 map 122:mixed Sean 2026-08-25) + partial{186} | filler; framing beat of ch 186, duplicate of ep 121 | **SOUND**; ja-WP 各話リスト marks 122 アニメオリジナル (uncited, stronger than what was cited) |
| detective-school-q | ep 1 | mixed (afl) + loose_parallel{45-46} | filler; anime-original prologue, ch 45-46 never adapted, no page tie | **SOUND**; licensor synopsis not reproducible by me (see row note) |
| eyeshield-21 | ep 39 | mixed (anilist; T6 39:mixed Sean 2026-08-25) + partial{89} + A44 | filler; ch 89 pp 14-15 background, ep 38 proper | **SOUND** |
| eyeshield-21 | ep 66 | mixed (anilist; T6 66:mixed) + partial{132-133} | filler; kind → loose_parallel; chs 132-133 at ep 76 | **SOUND** |
| sailor-moon | ep 36 | mixed (afl; NOT in the T6 map) + loose_parallel{11} | filler; arc-level echo, no page | **SOUND**, Sean's fork flagged; P8 tier handled by the apply design (T6 map) |
| tokyo-mew-mew | ep 19 | mixed (afl) + loose_parallel{21} + A44 | filler; fin previewed, ch 21 at ep 41 | **SOUND** (dissent: ja-WP bold + AFL Mixed; both already weighed by wave 3) |
| tokyo-mew-mew | ep 37 | mixed (afl) + partial{19} + A44 | filler; kind → loose_parallel; ch 19 pp 102-107 at ep 38 | **SOUND** |

Type moves safe to apply as delivered: **14 of 16 rows** (all except tokyo-mew-mew 21, which must be HELD;
black-butler 37 is safe on type but its ch-22 graft note must be corrected at apply). Three verdict files
carry annotation KIND changes that the apply script only honours through a hand-curated
`ANNOTATION_DELETE` list — currently EMPTY in `apply-wave16.ts` (see §3).

---

## 1. Findings, ranked by damage

### 1.1 tokyo-mew-mew ep 21 — the "duplicate" premise is false; the type move is unproven and probably wrong

File: `scripts/ingest/research/batch20/out/tokyo-mew-mew-w16.json` (annotation ep 21, type_correction ep 21,
structure note "Ep 21 ↔ chs 8-9: NOT sole — ch 8 is at ep 11 and ch 9 at ep 12").

The verdict's entire weight argument for ep 21 is: the Ryou/Keiichirou mew-aqua briefing "closes ch 9 … and
was already animated at EP 12 (stored anchor ep 12 → 9)". The stored anchor covers ch 9 as a chapter; it is not
evidence that ch 9's closing scene was animated there. Two independent sources say it was not:

- en-WP `List of Tokyo Mew Mew episodes`: ep 11 = Zakuro joins, the live-TV "Tokyo Mew Mew" introduction
  (ch 8); ep 12 = Masaya finds Ichigo transforming in the park + the five poisoned cherry trees (ch 9's
  Inohara-park beat inside an original plot); ep 13 = Quiche attacks Masaya. No briefing in any of them.
  Ep 21: "Ryou and Keiichirou explain mew aqua to the girls".
- tokyomewmewpower.fandom `Mew Aqua` (wikitext via api.php): "**It's not until episode 21 that the Mew Aqua
  and its powers are explained to the Mew Mews** … their mission is to find the larger pieces." Manga side,
  same page: "It is first introduced by Ryou in volume 2 after the Mew Mews officially become a team" — the
  vol-2 synopsis (fandom `Tokyo Mew Mew 2`, = en-WP) places that at the volume's end: "With Zakuro now a
  member of the team, Ryou and Keiichiro tell them more about the alien invasion and tell them to begin
  searching for a 'mew aqua'" = ch 9's closing beat.
- The dub page the verdict itself cites says the same thing from the other side: "Elliot **discovers** the Blue
  Aqua" (ep 21).

So the briefing in ep 21 is the FIRST and ONLY animation of ch 9's closing scene. Re-running T28:

1. SOLE ADAPTATION: TRUE (the verdict claimed FALSE).
2. LOAD-BEARING / SIGNIFICANT: the mew aqua is the manga's central device from here to the end (vol 4 Mint,
   vol 5 Pudding, vol 6 Lettuce + Zakuro, vol 7 Masaya — fandom `Mew Aqua`, manga section); the briefing is the
   scene that names it and launches the search — under the sliver clause's own words it "progresses the story
   in a meaningful way (a scene, a beat…)". It is not a cameo, a recall or a restaged closer.

That is the shape the exception exists for: an original Minto plot carrying the sole adaptation of a
premise-setting manga scene → MIXED + `partial{9}` ("the ch-9 mew-aqua briefing, first animated here;
ch 9's park beat is at ep 12"), A44 position-less unchanged (ch 9 sits behind ep 12's anchor — relocation,
A44's own clause). ja-WP's 太字 on ep 21 and AFL's "Mixed" are then both right on this row, which the verdict
had to explain away.

Provenance of the error: the stored wave-3 note already said "restates material already animated with chs
8-9 at ep 12"; wave 3's verifier checked the dub page's independence, not the ep-12 premise. Wave 16 is the
wave that turns the unverified premise into a type move — so it is the wave that must not land it.

**Recommendation:** HOLD tokyo-mew-mew ep 21 (remove it from the T6 generation for this wave). What settles
it: the ep-12 episode itself or its Japanese synopsis (the fandom's JP-version ep-12 page does not exist;
Bandai/TV Tokyo back-numbers for 2002 are not online), or Sean ruling that a premise briefing is not
"load-bearing" — in which case filler stands but the note must say "first-time, judged not load-bearing",
never "duplicate".

### 1.2 black-butler ep 37 — type SOUND, but the ch-22 graft note asserts a duplicate that does not exist

File: `black-butler-w16.json`, annotation `graft{22 (pp. 30-32, pp. 33-34)}`: "DUPLICATE, not new: ch 22 is
adapted at ep 15 (kuroshitsuji.fandom '022. The Butler, Victorious': episodes = Episode 15)".

The fandom's `episodes = Episode 15` is a chapter-level tie to the curry contest's resolution. The 2008 series
never reaches the circus: en-WP's season-1 summaries (checked all, including ep 15 "His Butler, Competing"
= the curry contest) contain no Queen's letter, no tickets, no Noah's Ark parade; the circus "first appears in
Season 3: Book of Circus (2014)". So ch 22 pp 30-34 are FIRST-TIME in ep 37, and the sole-adaptation
exception's half (1) is TRUE, not FALSE as the note states.

It does not change the type: the envelope and the parade are the arc's tease — restaged (Lau receives it
from Grey/Phipps/John) — and the arc's actual assignment (the Queen's order to investigate the missing
children) is properly adapted at ep 38 with ch 24-25 (en-WP ep 38; stored anchor 24-25). "Material the anime
adapts properly later" is the sliver clause's own definition. Filler stands; the note must be rewritten:
`weight: sliver — first-time pages, but a tease of the Circus arc whose assignment is adapted properly at
ep 38 (ch 24); no death / reveal / arc close`. Everything else in the file verified page-for-page against the
fandom's ep-37 reference list (ch 5 p.2, pp.9-11, pp.18-20; ch 22 pp.30-34; ch 23 p.2), Cedric's empty
`manga debut`, ch 5 `episodes = N/A`, ch 23 `episodes = 37 (partially)` (page `023. The Butler, Agitated`),
Toboso's script tweet, AFL "Mixed Canon/Filler" on 37 and "Manga Canon" on 38-40.

### 1.3 trigun ep 6 — type SOUND; "duplicate" is overstated for one beat

`Chapter 4` (fandom): after the bounty, "after a month, the sandsteamer Flourish arrives in town … With the
arrival of the steamship came supplies to repair Voldoor's plant, so the town has a big party … The steamer
leaves the next day". `Lost July` (ep 6): "The town throws a party for Vash… The town finally is able to hire
engineers to fix their plant, and they arrive on a huge sand steamer." `B.D.N.` (ep 7): "A celebratory party is
thrown for Vash for saving the city of Inepril **again**. The following day, Vash takes the Sandsteamer out of
town" + Kaite. So ch 4's arrival-with-supplies beat is shown in ep 6 and only there; ep 7 restages a party and
carries the departure and Kaite (ch 4's substance). The chapter page's reverse index (eps 5, 7, 20) omitting
ep 6 is the wiki being coarse, not proof of duplication. Outcome unchanged — a steamer pulling in is a
transitional beat, "a trivial first-time beat stays filler + annotation" — but the note should not say
DUPLICATE. Everything else holds: Elizabeth and Kesskass anime-only (Elizabeth page: "anime-only
character"), ch 0 = 6 wordless pages with an empty anime field, AFL ep 6 "Filler" (fetched: 5 Manga Canon,
6 Filler, 7 Manga Canon, 16 Filler, 18 Mixed). The T6 map entry `6: 'mixed'` (Sean 2026-08-25, reason "adapts
the ch 0 prologue + ch 4's opening inside original framing") is exactly the fragment-tie shape the sliver
clause re-weighs; the supersession is declared, not silent.

### 1.4 chrono-crusade ep 14 — SOUND, with the unread Act named

tropedia `Chrono Crusade` wikitext, section `== Anime Only ==` (line 282ff): "Dude He's, Like, In A Coma:
Rosette kisses Chrono while he's trying to sleep off a fever", "Intimate Healing: Chrono comes down with some
sort of demon fever, and Rosette is told by a fortune teller that a folk remedy for fevers is…a kiss", "Sick
Episode". The fandom ep-14 synopsis is the same plot (Satella's limousine, the villa, the pharmacy run, the
fortune teller, Azmaria's dinner, the kiss). en-WP lead: "The remainder of the series is primarily an original
story line". Two independent legs, as the verdict says (tropedia = TV Tropes lineage, counted once).

Gap: the verdict's "Acts 22-26 are the CHICAGO block" describes Acts 23, 24, 25, 26 and 27; the MangaDex ids it
cites resolve (api.mangadex.org/chapter/…) to Acts 21.5, 23, 24, 25, 27 and 38 — Act 22 "Sinner"
(39c1744b…, 32 pages) and Act 26 (afc41cc6…) are not cited. Act 22 is the act immediately after the Marionette
Train, i.e. the one slot where a manga convalescence scene could sit. I tried to read it (MangaDex at-home
node returned 404 for every page) and could not. The type does not depend on it — tropedia's anime-only
listing is explicit about the episode's three defining beats — but the structure note's "never adapted"
claim for Act 22 is asserted, not read. Name it in the note.

### 1.5 chrono-crusade ep 21 — SOUND; a nit on the repair

Magdalene: `debut-manga = Chapter 36`, `debut-anime = Episode 21`, "In the anime the plot differs" (fandom).
v6 = Acts 36-42 (en-WP chapter list: 36 "Mary Magdalene" … 42 "To A Distant Place"). No other anime row
touches v6; the backstory is the origin of the contract and of the Order → sole + load-bearing → mixed stands;
A44 position-less for the relocation reason is the right split. Nit: the repair changes the annotation's
chapters from "36-41 (v6 flashback; extent inferred, end Act unverified)" to "36-42 (v6 — the Mary Magdalene
backstory)". The volume fix is right; moving the "extent unverified" qualifier out of the chapters field means
the field now reads as a claim the flashback spans all seven Acts, which the note immediately denies. Keep a
qualifier in the field (e.g. "36-42 (v6; extent unverified)").

### 1.6 rosario-vampire ep 14 — facts SOUND; the type is a ruling

Every factual claim checked: the Capu2-ep-01 page carries the recap gag verbatim ("that was the recap of the
show 'for any idiot who didn't watch the first season'"), the death-threat-letter plot, the welcoming ceremony,
the two delinquents, Ruby's snack-bar job, Gin's photo gag, new characters Kyōko Aono + Kokoa Shuzen, and an
empty `Adapted From` stub; `Rosario + Vampire II Chapter 003` = "smells delicious", licks his blood, attacks
Moka in class, "she's actually her little sister, Koko"; `II Chapter 001` = the return, the four-way fight,
the rosario coming off; MU 67686957603 `anime start = "Vol 1, Chap 1 Different settings"`; en-WP: "The second
season is loosely based on the Rosario + Vampire: Season II manga". AFL: 14 Mixed, 15-19 Filler, 20 Mixed,
21-23 Filler, 24 Mixed, 25-26 Filler — matches the verdict's reading that AFL's Mixed tracks Season-I grafts
(20 → ch 39, 24 → ch 37-38 stored) and that ep 14's only Season-I content is the recap.

The type: T26's own text says the standing "stays canon / mixed / filler relative to the identified source
(T25)" and side_source is an annotation naming the other work — so filler + side_source is the T26-literal
answer, and `upsertAnnotation` accepts side_source on any type (the gate only requires the work in the note).
The inconsistent row is trigun ep 18 (stored mixed + side_source with no Trigun-space content), not this one.
Recommend: apply as delivered; queue trigun 18 for the same treatment or a series-level ruling, as the verdict
asks. Apply-time: the stored `graft{Season II vol 1 (S2 chs 1-4)}` is a KIND change → must be in
ANNOTATION_DELETE (see §3).

### 1.7 sailor-moon ep 36 — SOUND; the fork is real and correctly flagged

en-WP ep 36; fandom ep-36 plot + `Changes From the Manga` ("Usagi doesn't go to a hair salon"; "The first time
Usagi sees Mamoru after being kidnapped, he introduces himself as an old friend of Motoki, named Endou"; "By
the time the brainwashed Prince Endymion awoke, Kunzite was already dead") — i.e. the fandom itself treats ep
36 as the anime's counterpart of Act 11's reunion with every scene changed; Mitsuami anime-only (first
appearance this episode); Act 10 / Act 11 pages confirm the manga's version (Beryl revives Endymion at Act 10's
close; Act 11 = Endou, the Crown control room, the Silver Crystal stolen). AFL: 35 Manga Canon, 36 Mixed,
37-41 Filler, 42 Mixed, 43 Filler, 44-46 Manga Canon — confirmed; the stored mixed is AFL-minted
(`minted_by = afl`) and the T6 map holds only 167-172, as the verdict says.

The exception question (plot point vs pages) is Sean's; the verdict's reading follows the erased-12 precedent
as recorded in changelog §12.99 ("the anime's final line is ch 44's verbatim in the same setting"), and on the
catalog's own coverage set the beat is not sole anyway (stored ep 45 → 12 [11] claims Act 11 as START). P8:
`apply-wave16.ts` writes types as T6 map entries asserted by the healer, so the retype lands at the manual
tier — confirm sailor-moon 36 is in the generated map.

### 1.8 tokyo-mew-mew ep 19 — SOUND, dissent recorded

JP-version fandom page + en-WP: original beach story (Iruka; Retasu cannot swim; the fin activates in the
rescue). fandom `Mew Aqua`: "The first physical appearance of the Mew Aqua takes place in episode 19 when it
causes Mew Lettuce to turn into a mermaid"; manga: "In the manga it's not the cause of Retasu's mermaid
transformation … due to it happening after the existence of the Mew Aqua was established" and Lettuce's
mew-aqua use is vol 6 (ch 21) → stored ep 41. A preview of a power inside an invented plot, with ch 21
adapted properly later (ep 36 history half, ep 41 red-tide half) = the clause's sliver. ja-WP 太字 on 19 and
AFL "Mixed" both dissent; wave 3's verifier already read the raw wikitext and found the marker unreliable in
both directions (verify/eyeshield-tmm-w3.md §4), and ch 11 "Cruise Control" (Pie attacks a cruise ship) is
not this story. Note in passing: on ep 19 the ja-WP bold and AFL agree with each other and disagree with us;
on ep 21 (§1.1) they turn out to be right. Treat the marker as a prompt to check, not as noise.

### 1.9 The rest — SOUND

- **chrono-crusade ep 8**: fandom ep-08 synopsis = Grand Central, Rizelle, Remington captive, the train;
  `Rizelle`: "In the anime, she vanished when she fell off the train" (her death is the train in both media),
  so ep 8 is an invented prologue to the Acts 19-21 story, which ep 13 anchors {19-21}. AFL has no
  chrono-crusade page (both slugs 404 / redirect); the stored mixed is the T6 map's "original bridge" entry
  (Sean 2026-08-24), i.e. the pre-sliver-clause reading.
- **chrono-crusade ep 17**: fandom ep-17 synopsis; `Viede`: "In the manga he dies defending Eden … In the
  anime he is the second Sinner to be killed along with his enemy Carv"; `Gurio`: "found in the anime only";
  ja-WP: 「アニメでは、ロゼットは…聖女マグダラのマリアの生まれ変わりという設定」 + the 聖痕 thread. The verdict's
  ja-WP quote ("アニメ版のみに登場する") is not the sentence I got back, but the substance is the same.
- **hajime-no-ippo ep 76**: fandom ep 76: `manga = Round 383 (p.4-5)`, "not broadcast on TV … final 25th
  DVD", "While this episode is considered filler, a small amount of panels from Round 383 were adapted",
  `Category:Filler Episodes`; `Chapter 383`: `episode = Round 21 (Season 2) (p.1-19)` on an 18-page chapter
  = our ep 97 (stored 380-383); `Sakura`: anime_debut only. AFL (slug `fighting-spirit`): 76 "Mixed
  Canon/Filler", 75/77 Manga Canon. Label disagreement, fact agreement — the clause resolves it.
- **zatch-bell ep 122**: konjikinogash ep 122: `manga_chapter = Chapter 186 (Partially)`, "this episode is
  mostly filler", new character Kaguya, five characters listed as (Flashback); ep 121 = Chapter 185 +
  186; ep 124 = Chapter 187. ja-WP 金色のガッシュベル!! 各話リスト marks 122 (and 123) **アニメオリジナル** —
  an independent Japanese witness the verdict did not use; it is stronger than the en-WP chapter-title
  argument. AFL: 116-126 all "Manga Canon" (confirmed; the block was already overruled). The "duplicate"
  wording rests on the chapter-level field, not on the panels; either way a framing shot is trivial.
  Housekeeping (pre-existing): the stored `ep 121 partial{186}` note is a copy of ep 122's note.
- **detective-school-q ep 1**: fandom `Story Arcs`: "Filler Episodes: … 1, 4-7, 15, 35, and 44-45";
  Death in Construction = ch 45-46, "The Anime doesn't adapt this Arc, but the Episode 1 is about a case
  based on the case of this Arc, with a lot of changes in the plot"; fandom `Episode 01`: Kyu sent shopping,
  collides with a man leaving a bank who is accused of theft — the verdict's synopsis opening. The dアニメ
  synopsis the verdict quotes I could not reproduce (the page returns 「現在公開中の話が存在しません」), so the
  second leg on the PLOT is the fandom's stub + the structural fact that ch 1 (the exam) is anchored at ep 2.
  ja-WP carries no per-episode marker. AFL: 25 rows, 1-3 Mixed. No page tie → no exception → filler.
- **eyeshield-21 ep 39**: Bandai 8777/039 verbatim 「ヒル魔に泥門デビルバッツ盛り上げ隊長として任命された鈴音はやる気
  満々…」 (appointed before the episode starts) + the 月刊アメフト / TV-crew chase; en-WP: "This recap episode
  reviews prior events"; ja-WP 備考 = 2本立て1時間スペシャル only; fandom ep 39 `chapters =` empty. The
  stored partial{89} pp 14-15 is wave 3's page check. Sole TRUE, load-bearing FALSE → filler. AFL has no
  eyeshield-21 page (404); AFG is the verdict's instrument.
- **eyeshield-21 ep 66**: ja-WP 備考 **アニメオリジナルストーリー** (row 66, verified); fandom ep 66
  `chapters = [[133rd Down]]` AND `Category:Anime-Original Episodes` (both verified in the wikitext);
  `132nd Down` → `episode = Episode 76`, `133rd Down` episode field empty; Bandai 8777/066 verbatim
  (勝率はほぼ0％ line + 石丸's meet); en-WP ep 76 = the kicker problem + Musashi's father. Kind change
  partial → loose_parallel is the honest record.
- **tokyo-mew-mew ep 37**: en-WP + the JP-version fandom page (Ichigo realises she has been lying to Aoyama)
  = the invented Christmas set-up; ch 19's lunch-date attack is the manga's staging; the pages the anime keeps
  (pp 102-107) are on ep 38's stored anchor. Kind change partial → loose_parallel correct.

## 2. Mechanical scan (internal contradiction / A1 / T27 / scope)

- Every `type_corrections[].episodes` set matches the file's annotations and summary; no row is typed one
  thing in the summary and another in the rows. No `anime-only-canon` or other off-vocabulary type. All
  annotation kinds are in `ANNOTATION_KINDS` (graft, partial, loose_parallel, divergence, recap, side_source).
- No anchors proposed anywhere in the ten files (A1 / A44 clean). All `anchor_hostile` rows have no stored
  anchor, so the apply's delete step is a no-op on them.
- Scope: rosario's Season-II chapters are correctly kept out of the 1-40 space (side_source, no anchor);
  trigun's ch 0 / ch 4 are in Trigun's own space. No sequel-number leakage.
- The chrono ep-21 repair touches an annotation, not an anchor; the ep-20 continue (31 / post_series) is
  untouched, as stated.

## 3. Apply-safety (what the curator must do before `apply-wave16.ts` runs)

1. **HOLD tokyo-mew-mew ep 21** — exclude it from the T6 generation; leave the stored mixed + A44; replace the
   annotation with `partial{9}` "first animated here" only after Sean rules on §1.1.
2. **ANNOTATION_DELETE is empty** in `scripts/ingest/research/batch20/apply-wave16.ts`; the dry-run's
   "stored kinds not re-delivered" report will list, and the curator must add: `rosario-vampire#14 graft`
   (→ side_source), `eyeshield-21#66 partial` (→ loose_parallel), `tokyo-mew-mew#37 partial`
   (→ loose_parallel). Trigun 6's `partial{0, 4}` is a same-kind upsert (replaced by `partial{4}`) plus a new
   `graft{0}` — no delete needed.
3. **T6 map regeneration must REPLACE, not add**: trigun 6, eyeshield-21 39 / 66, chrono-crusade 8 / 14 / 17
   and zatch-bell 122 already hold `'mixed'` in `episode-types.ts`; the new `'filler'` entries must supersede
   them (the reasons cite Sean 2026-08-24/25 — record the supersession in the entry reason). The AFL-minted
   rows (trigun 6, ippo 76, rosario 14, black-butler 37, zatch 122, dsq 1, sailor-moon 36, tmm 19 / 37) and
   the anilist-minted eyeshield rows need a map entry to survive the next re-derive (P8).
4. **Note corrections at apply** (facts, not types): black-butler 37 ch-22 graft (§1.2: first-time tease, not
   a duplicate; properly adapted at ep 38); trigun 6 ch-4 partial (§1.3: framing beats, arrival is first-time;
   substance at ep 7); chrono 14 structure note (§1.4: Act 22 unread); chrono 21 repair string (§1.5).
5. zatch-bell: consider citing ja-WP's アニメオリジナル marker in the T6 reason — it is the better witness.

## 4. What I could not check

- MangaDex page images (Chrono Crusade Acts 22 / 26): the at-home node 404'd on every page; the verdict's
  claims about Acts 23-27 rest on its own reads, which I did not reproduce either.
- dアニメストア's per-episode synopsis for Detective School Q ep 1 (returns "no episodes available").
- The TV Tokyo back-number for Eyeshield ep 39 (web.archive.org is blocked for me); Bandai's text, which the
  verdict says is verbatim identical, was read directly.
- AFL for chrono-crusade and eyeshield-21 (no pages on the site).
