# Verification — KONOSUBA -God's blessing on this wonderful world! × AniList 21574 (S1 OVA 「この素晴らしいチョーカーに祝福を！」) — related-works wave 3 (R24)

- Verdict under review: `/Users/sean/Projects/mangamapper/scripts/ingest/research/discovery/out/konosuba-gods-blessing-on-this-wonderful-world__21574.json` (author: the Opus research-agent; verifier: Fable 5.1, 2026-09-05)
- Contract: `/Users/sean/Projects/mangamapper/scripts/ingest/research/discovery/PROTOCOL-extras.md` (PER WORK); the owner's instrument is the LIGHT NOVEL (source_type light_novel, no manga node, no chapter space registered)
- Author's context: `/private/tmp/claude-501/-Users-sean-Projects-mangamapper/9cb5ba33-f276-45a2-b114-7209c7228d10/scratchpad/extras-w3/konosuba-gods-blessing-on-this-wonderful-world__21574.md`
- Every one of the verdict's 14 source URLs was fetched raw (fandom ×8 and ja-WP ×2 via the MediaWiki API as cited, KADOKAWA ×2, Anime Hack, animatetimes) and read as text, not through a summarizer. Beyond the verdict's citations I fetched: fandom `Konosuba_BD_1`-`BD_4`, the Japanese-language fandom's page for the OVA, en-WP `KonoSuba season 1` (API), ANN 2016-02-25, inside-games 2016-03-17, ln-news 2019-03-21, the official konosuba.com rerun notice (2018-12-10), and one Yahoo 知恵袋 thread (cross-check only). AniList was not queried. Stored values below are the context file's (its header stamp reads 2026-09-06 — a UTC stamp); the DB was not touched.

## Recap baseline — KONOSUBA -God's blessing on this wonderful world! (stored first, then the verdict, then the verifier)

| row | stored | → verdict | → verifier |
|---|---|---|---|
| 10.5 · AniList 21574 S1 OVA 「この素晴らしいチョーカーに祝福を！」 (ova, 2016-06-24) | **pending** (standing null; same_instrument halo) · kind ova · origin halo · chapter — · chapters_adapted — · unlabelled · note "adapts the series' own instrument … pending" | **filler** (high) · chapters_adapted [] · recap false · position confirmed 10.5 · adopted null (the author's 書きおろし credit as a note only) · repairs [] | **CONFIRMED on the sources**: no printed unit of the novel line is this story (KADOKAWA 「TVアニメでは放送されないオリジナルアニメ」/「原作者書きおろしエピソード」; the fandom's `LN volume` cell = "Anime Original"; ja-WP's 特典小説 inventory names four other vol 9 stories and mentions チョーカー nowhere in 1,832 lines; no よりみち! story matches; ANN: "penning the original anime episode"). Filler + credit-as-note is the Slam Dunk shape the protocol prescribes. Position 10.5 is the only non-inferential placement (第1期 第11話; BOX 第1話-第10話＋OVA第11話; fandom nav ep 10 → OVA → ep 11; 2019 slot order). No field changes |
| 10 · ep 10 「この理不尽な要塞に終焔を！」 (2016-03-16) | **canon** · tv · no anchor (novel owner) | named as the predecessor (the fandom infobox `Next = Konosuba OVA`) | confirmed on `Konosuba_Episode_10` (`Next = [[Konosuba OVA]]`; `Volume = BD Volume 5` — the infobox's `Volume` is the DISC, which is why the OVA's `Volume = Light Novel Volume 9` is a bundle reference, not an adaptation claim) |
| 11 · ep 11 「この不当な裁判に救援を！」 (2017-01-12, S2 ep 1) | **canon** · tv · no anchor | named as the successor ("Next = S2 Episode 1") | confirmed: the OVA page's `Next = [[Konosuba Episode 11]]` — the fandom numbers the run continuously (its own Timeline section links "Konosuba Episode 12" as "Season 2 Episode 2") |
| 12 · ep 12 「この紅魔の娘に友達を！」 (2017-01-19) | **canon** · tv · no anchor | cited in flag 3 as Yunyun's TV debut, the one in-universe pull toward 14.5 | confirmed on the fandom's Timeline Placement; this is the ONLY one of the fandom's constraints that 10.5 fails (note 1) |
| 20.51 · AniList 97996 S2 OVA 「この素晴らしい芸術に祝福を！」 (2017-07-24) | **pending** · kind ova · origin halo — and the applied Legend of Crimson ruling already names it: "the S2 OVA (2017, @20.51) precedes it" (film ruled to 20.52) | not in the ask; flag 4 says its "natural position is 20.5 … alongside the already-delivered Legend of Crimson verdict at 20.5" | the flag is stale against the APPLIED ruling (`lib/rulings/related-works.ts`: film 20.52, OVA 20.51); when the sibling is verified its landing is the stored 20.51, not "20.5 alongside" (note 3). Nothing in this verdict's own fields depends on it |

## Conclusion: SOUND WITH NOTES — apply as delivered (filler, [], 10.5 confirmed, adopted null); two ruling forks the verdict already flags are restated with what I found, plus three nits

No field of the verdict is wrong or unsupported. The refutation of the task's premise is the strongest part of the work: it rests on four independent lineages (the publisher, the trade press, the fandom's own field, ja-WP's inventory) and my own extra checks widened the negative rather than narrowing it.

## Findings, ranked by damage

**None that change a field.** I hunted in the R24 order and report each class below with what settled it.

### 1. Internal contradiction — none
- Summary ↔ fields: filler ↔ `chapters_adapted: []` ↔ `adopted: null` ↔ `recap: false` ↔ position stored 10.5 = proposed 10.5 with `verdict: confirmed`. Mechanically checked (valid JSON; all 13 protocol keys, no extras; closed vocabularies respected; `anime-only-canon` absent).
- Every number in the prose checks against its source: 24 min (context), 2016-06-24 / ISBN 9784041039533 (KADOKAWA 321510000448), 2016-07-01 / 9784041039540 (321510000449), Anime Hack dated 2016年3月20日 (in the page), animatetimes 2019-03-18 with TOKYO MX 2019-03-27 25:35 and the S2 rerun from 04-10, the S1 BOX 2018-10-24 第1話-第10話＋OVA第11話 (ja-WP anime line 729), ラン 声 - 赤﨑千夏 "OVAに登場したオリジナルキャラクター" (ja-WP anime), the fandom's vol 9 date "30 June 2016" with the STANDARD edition's ISBN 978-4-0410-3954-0.

### 2. Anchors beyond the evidence — none proposed; the negative claim is well beyond the author's own bar
The verdict proposes no chapters. Its load-bearing claim is negative ("no printed novel unit exists for this episode"). What the sources actually say, verbatim:
- KADOKAWA product 321510000448 (the publisher): 「完全受注生産！ 原作者書きおろしエピソードを完全シナリオ化！！」 and 「原作小説9巻＋TVアニメでは放送されないオリジナルアニメを収録した限定商品」 — quoted exactly as the verdict has it.
- Anime Hack (eiga.com 102232, 2016-03-20): 「収録されるアニメは原作者・暁氏による書き下ろしエピソードで…“願いがかなうチョーカー”をめぐるトラブルが巻き起こる」 — exact.
- konosuba.fandom `Anime`, the S1 table: the OVA row's `LN volume` cell is `Anime Original` and the `Manga chapter` cell is absent; the two 2025 OVA rows fill the same cell with `Detour 2 / Story 5` and `Detour 1 / Story 7`. So "Anime Original" is the fandom's OWN FIELD VALUE, not the author's inference, and the editors demonstrably cite よりみち! stories in that cell when one exists.
- konosuba.fandom `Konosuba_OVA`: no "Adapted chapters" / "Manga counterpart" / "covers …" statement anywhere (Episode 10's lead has one: "covers Chapter 5 to the Epilogue in Volume 2 … or Chapter 19 to Chapter 21 of the manga").
- ja-WP main, line 1226-1230: vol 9 紅の宿命, 特典小説 = 『とあるひよこの必殺芸』『続、アクアの水商売』『抑制する紅魔族』『たまにはこんなお約束』 — the four the verdict names; the fandom's Volume 9 page lists the same four by store (Animate / Toranoana / Gamers / e-book).
- My widening: `grep チョーカー` over the WHOLE ja-WP main article (every volume's 特典小説 column, the よりみち! section, the spin-offs) returns zero hits; the three よりみち! TOCs contain no choker story and no plot match (Y2 story 7 "Producing a Loner" is a Kazuma/Yunyun story about communication skills, not this); BD 1-5's booklets are よりみち! 1 stories 1-5 exactly as the verdict says (BD pages fetched), the BOX booklet is Y2 story 4; ANN 2016-02-25: "Light novel author Natsume Akatsuki is penning the original anime episode"; ln-news 2019-03-21: 「原作小説第9巻特装版に同梱されたオリジナルアニメーション」; en-WP `KonoSuba season 1` OVA-1 row names no source story (WrittenBy Aoi Akashiro "from the ending credits"). A novel reader on Yahoo 知恵袋 asking "原作何巻の内容ですか？ 見覚えがない" was answered 「アニメオリジナル（原作者が書いた話）」 — cross-check only, but it is the exact question the premise raised, answered the same way.
- `confidence: high` is earned under the protocol's own definition (two sources name the same standing): publisher + fandom + ANN are three lineages. Note that KADOKAWA / Anime Hack / inside-games share one press-release lineage for the 書きおろし wording; the fandom's field and ja-WP's inventory are the genuinely independent legs (R3).

### 3. Monotonicity — not applicable (no anchors; the position is a slot, tested under 5)

### 4. A1 / A44 / T26 / T27 — clean
- Filler row, `chapters_adapted: []`, no anchor of any kind (A1); no position-less claim to make (A44); no `side_source`, so the licence-is-not-adoption standing does not arise (T26); vocabulary is the closed T27 set.
- `adopted: null` with the credit in the note: this is the shape the protocol prescribes in its own words ("The author's credit on a film … is a CREDIT in the note, never an adoption: T26's adoptions put material INTO the source line … a screenplay that exists only as the film does not") and the shape the applied `slam-dunk` entry landed in. The story was never printed in the novel line by any source I can find, so nothing entered the source line. Sound. See note 2 for the one rule-text tension Sean may want to see.

### 5. Scope leakage — none
`series_id` is the S1+S2 owner (20 rows); the position is inside its grid; the sibling S2 OVA appears only in a flag, never in a field.

### 6. Citation quality — clean
14 sources: fandom via `api.php` ×8, KADOKAWA (the publisher's product records) ×2, Anime Hack ×1, ja-WP via `api.php` ×2, animatetimes ×1. No content farm, no AI summary, no HTML scrape. (For the record: a web search's AI summary during this verification asserted the OVA "was based on a short story published in the original novel" — an inference no underlying page states; it is exactly the hazard the task named and it was discarded.)

## Notes for the sitting (not defects; ranked by how much they matter to what renders)

### Note 1 — position 10.5 vs 14.5: the fork is real and already flagged; what I add is that 10.5 fails only ONE of the fandom's constraints, and the fandom's chain rests on an unargued premise
- The protocol's own example ("a film set between S1 and S2 sits after the S1 finale even if it aired during S2") lets SETTING outrank date, so a 14.5 ruling would be principled, not a departure. The verdict confirms 10.5 on official ordering and flags 14.5 — the right shape (step 4 is Sean's).
- The fandom's Timeline Placement (fetched verbatim) opens with "Being an OVA, the episode clearly doesn't take place before Season 2" — an assertion, not an argument. Of its remaining constraints, 10.5 satisfies all but one: the debt exists (it is incurred at the end of ep 10), Darkness is with the party (she leaves only in S2 ep 1-3), Vanir II is not yet at Wiz's shop. The single constraint that bites is that the party already knows Yunyun, whose TV debut is ep 12. And the fandom concedes 14.5 does not fit cleanly either ("Kazuma and Darkness should have already told Wiz about Vanir's death … this is so far the only plausible time"). So the OVA fits NO slot cleanly, and the official numbering (第1期 第11話; the S1 BOX; the fandom's own nav; the 2019 slot order S1 rerun from 01-16 → OVA 03-27 → S2 rerun 04-10, confirmed on konosuba.com and animatetimes) is the only non-inferential placement.
- User-facing consequence either way: at 10.5 a first-time viewer meets Yunyun in this gag episode before ep 12 introduces her; at 14.5 the viewer watches a "Season 1 episode 11" in the middle of Season 2. What settles it: Sean's ruling. I would apply 10.5 as delivered.

### Note 2 — `adopted: null`: the protocol and the Slam Dunk ruling say credit-not-adoption; T26's ledger text lists "wrote" among the author bases
- T26 as written: "'author' = the source's author wrote, supervised, declared, or INCORPORATED THE MATERIAL'S EVENTS into the source line — a specific act per arc". Akatsuki WROTE this episode (publisher, trade press, ANN all say so). The protocol (Sean 2026-09-05) and the applied `slam-dunk` entry narrow that for related works to material that ENTERS the source line. The verdict follows the narrower, later, specific ruling and offers the alternative wording in flag 2 — correct under the contract it was given. If Sean wants the ledger text and the protocol to say the same thing, that is a P29 capture item, not a change to this verdict.

### Note 3 — flag 4's "Legend of Crimson at 20.5" is stale against the applied ruling
`/Users/sean/Projects/mangamapper/scripts/ingest/lib/rulings/related-works.ts` already rules the film to 20.52 with the note "the S2 OVA (2017, @20.51) precedes it in the fandom's order." The sibling's landing when it is verified is the stored 20.51. Prose only; nothing in this verdict's fields is affected.

### Nits (no action)
- `title` appends "(この素晴らしいチョーカーに祝福を！)" to the stored title string; `repairs: []` correctly leaves the stored title alone, and the ruling's identity is the AniList id. If the apply step copies `title` into the entry, use the stored string.
- ja-WP's episode row prints the OVA's broadcast as 2019年3月28日 (calendar date of a 25:35 slot); animatetimes / ln-news / the verdict say 03-27 (broadcast-day convention). Not a conflict.
- The Japanese-language fandom's stub for the OVA credits 脚本=上江洲誠; ja-WP (`Aux0 = 朱白あおい`), en-WP season 1 (`WrittenBy = Aoi Akashiro`, from the ending credits) and the English fandom all say Aoi Akashiro. The verdict cites ja-WP and is right; recording this so nobody later "corrects" the credit from the stub.

## What was checked, in one place
| check | result |
|---|---|
| Does any vol 9 bonus story match the OVA? | No — four other titles on ja-WP and the fandom, identical sets |
| Does any よりみち! 1-3 story match (title or plot)? | No — all three TOCs read; BD 1-5 → Y1 stories 1-5 and BOX → Y2 story 4 confirmed on the BD pages |
| Is チョーカー printed anywhere in ja-WP's inventory of the novel line? | No — zero hits in the full 1,832-line article |
| Is "Anime Original" the fandom's field or the author's inference? | The fandom's `LN volume` cell; the 2025 OVA rows show the editors cite よりみち! stories there when one exists |
| Do the publisher and press call it an original written by the author? | Yes — KADOKAWA, Anime Hack, inside-games (one press lineage), ANN (independent, English) |
| Is filler + credit-as-note the ruled shape? | Yes — protocol text and the applied `slam-dunk` entry |
| Is 10.5 the official placement? | Yes — ja-WP 第1期 第11話, S1 BOX contents, fandom nav ep 10 → OVA → ep 11, 2019 slot order (konosuba.com + animatetimes) |
| Is 14.5 the fandom's inference, hedged? | Yes — verbatim, with an unargued first premise and a conceded inconsistency |
| Repairs (kind / date / title)? | None needed — kind ova, 2016-06-24 = KADOKAWA's 同梱版 date, ISBNs match |
| Content farms / AI summaries as primary? | None among the 14 citations |
