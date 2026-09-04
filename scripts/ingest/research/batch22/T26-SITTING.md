# The T26 adoption sitting — decision list (2026-09-05) — RULED by Sean (Line B, D1-D7 as recommended, with Cursor's two refinements) and APPLIED (§12.117)

> **Post-ruling corrections found at apply time (below the table, §APPLY):** beelzebub 49 is the FMA-37 shape, not G1 — held out; DBS ep 6's 脚本 check FAILED (Watanabe) — the writer default makes it filler + side_source, Sean's T30 call is queued. G1 landed as **40** rows (22 + 14 + 2 + 2), plus DBS ep 6 by the writer default.

Built FROM DISK + the live rows (`side_source_unadopted`, 9 series / 57 rows).
This is a **ruling table, not research**: every row below already has a cited
verdict; what is missing is a standing rule. Sean rules; the apply follows.

## THE ONE QUESTION

Two lines Sean has ruled on different days now contradict each other on the
same shape — a canon / mixed row whose ONLY source tie is a work OUTSIDE the
reading chain (I41), with no `adopted{basis}` record:

- **Line A — a licence confers standing** (batch 18 → batch 20 wave 2, stored
  on all 57 rows): "canon relative to a licensed side source". The row is
  canon; `side_source` names the work.
- **Line B — only an ADOPTION ACT confers standing** (one-piece 50, Sean
  2026-09-04, §12.110: "an add-on in the universe, not the chain and not
  adopted canon — T26"): the row is FILLER + `side_source` unless an
  `adopted{basis}` proves the source's author / studio / community took the
  material in.

**T26's own text as written reads to line B** — "novels, games and parallel
tellings … their canon is the `adopted` ruling"; "an Itachi-novel row is canon
+ adopted + side_source, and that is correct". The Itachi rows carry NO
`adopted`. The ledger describes a state the data does not hold; that is the
gap this sitting closes.

**Recommended rule (one sentence, for the T26 amendment):**
> A LICENCE IS NOT ADOPTION. A canon or mixed standing on a row whose only
> source tie is off-chain requires an `adopted{basis}` record; without one the
> row is `filler` + `side_source{work}`. The basis is proven PER WORK by a
> specific authorial / studio / community act — never by a franchise-wide
> credit, a licence, or an illustrator's name on the cover.

*Why line B:* `episodes.type` measures the row against the series' IDENTIFIED
source (T25 / T27) — the reader of *Shippuden* is asking "is this the manga's
story?", and for eps 452-457 the answer is zero manga pages. Line A puts a
franchise-licensing fact into the column that measures manga correspondence.
The nuance does not get lost: `side_source{work}` already renders as the
honest off-source dash (T14), so the reader is told WHICH work it adapts.

**What the retype costs — measured, not assumed:**
- **0 anchors** on all 57 rows (checked live) → A1 / `anchor_on_noncanon_row`
  is a no-op; no deletion, no repair.
- **0 position change, 0 coverage change**: `mapping.ts:434` and `:563` treat
  `filler` and `offSource` IDENTICALLY, and `assemble.ts:95` already sets
  `offSource` on every `side_source` row whatever its type. The walk, the
  frontier and the continues do not move.
- What DOES change: the row's BADGE, and the canon / mixed / filler tallies on
  the card (`AnimeCard.tsx:99`). That is the whole reader-facing delta — which
  is the point: the badge is the claim, and today it overclaims.

## THE TABLE — five groups, not one flip

### G1 · Licensed PROSE novels the anime adapts — 42 rows, 5 series
Identical in kind to one-piece 50 (a licensed novelization / light novel,
prose, not a countable manga instrument).

| series | rows | the work |
|---|---|---|
| naruto-shippuden | 452-454, 456, 457 (5) | Itachi Shinden (Yano) |
| naruto-shippuden | 484-488 (5) | Sasuke Shinden: Book of Sunrise (Towada) |
| naruto-shippuden | 489-493 (5) | Shikamaru Hiden (Yano) |
| naruto-shippuden | 494-500 (7) | Konoha Hiden (Hinata) |
| boruto | 93-95 (3) | Naruto Shinden: Parent and Child Day (Miyamoto) |
| boruto | 106-111 (6) | Steam Ninja Scrolls / 湯煙忍法帖 |
| boruto | 282-286 (5) | Sasuke Retsuden |
| black-clover | 55, 56 (2) | Abareushi no Sho (Onda / ill. Tabata) |
| fullmetal-alchemist | 11, 12 (2) | The Land of Sand (Inoue / ill. Arakawa) |
| ~~beelzebub~~ | ~~49 (1)~~ | ~~ベルベル☆西遊記 (SOW / ill. Tamura)~~ — **HELD OUT at apply**: the row also carries `side_story{Tamura's vol-10 extra chapter}` (sole adaptation, weight significant) — a weight-bearing manga tie; the canon standing rests on it, not on the novel. The FMA-37 shape; the census class (kinds-only) had listed it |

**Recommended: filler + side_source, all 42** — the op-50 answer, applied
consistently. Kishimoto / Tabata / Arakawa ILLUSTRATED these; that is the
Kodachi blanket-credit shape T26 already REJECTED, not the Kamachi
incorporation shape it accepted. Adoption stays available per novel line
later, on a citation of a specific act (P8: a ruling, never a repair).

**The sharpest counter-witness, for the record:** beelzebub 49 — ja-WP's 各話
リスト footnote on this exact row reads 【小説版が原作。】 ("the novel version
is the source"). That is as strong as "the licence confers standing" ever
gets, and under the recommended rule it is STILL filler + side_source: the
novel being the episode's source says nothing about Tamura taking its events
into the manga. If Sean finds that result wrong, line A is the ruling — but
then op-50 must flip back with it, in the same pass.

### G2 · FILMS the anime re-tells — 10 rows, dragon-ball-super
eps 18-21, 23-27 = *Resurrection 'F'*; ep 6 = *Battle of Gods*.

**Recommended: adopted{author} + side_source, rows STAY canon** — the one
group whose standing survives on evidence already in the stored note:
Toriyama is credited 原作 **AND** 脚本 on Resurrection 'F' (his first sole
screenplay), and ja-WP runs the tie in both directions. "The source's author
WROTE the material" is the plainest possible reading of T26's `author` basis —
a specific act on a specific arc. T30 already fixes the record shape ("a film
adapted by the anime stays side_source, not A-E"); only the basis is owed.
**One crumb:** ep 6 / *Battle of Gods* needs its own credit check (原作 vs a
concept credit) — do not stamp it off Resurrection 'F'. If the credit is not
there, ep 6 goes to G1's answer.

### G3 · The author's OWN other MANGA — 3 rows, 2 series
| row | the work |
|---|---|
| gto 25, 26 | *Shonan Junai Gumi!* ch 234-242 (Fujisawa — GTO's prequel manga) |
| cobra-the-animation 13 | *COBRA Galaxy Knights* (Terasawa, Super Jump 1996) |

**These are not an adoption question at all — they are a CHAIN question
(I41).** Both are named, countable MANGA works by the series' own author. If
the chain covers them, the rows are `chain_source`: canon to the series told
out of order, position-less (A12 / A44), and they leave this class entirely —
the rosario-vampire 14 / trigun 18 shape exactly.
**Recommended: rule both onto the chain** (`lib/rulings/source-chains.ts`),
`side_source` → `chain_source`. The caveat is I41's "one continuous story":
*Shonan Junai Gumi* is a direct prequel (Onizuka's biker youth), so it holds;
*Galaxy Knights* is a later short serial in the same continuity — Sean's call
whether a same-character side serial is a chain work or an off-chain sibling.
If OFF the chain, both take G1's answer (filler + side_source).

### G4 · A manga OMAKE by the source's own author — 1 row
boruto 18 — Kishimoto's unnumbered special extra 『ナルトが火影になった日』,
printed in the 2015 movie book, outside the Boruto manga's ch 1-80. The row is
`mixed` and anchor-suppressed by the standing A44 ruling ([18-24, 39]).

**Recommended: adopted{author} + side_source, row stays mixed** — a chapter
the source's author WROTE AND DREW is adoption under any reading of the basis
test; the omake is simply unnumbered, which A44 already handles. Alternative:
rule the omake a chain work (G3's mechanism) — but it has no number, so the
record reads the same either way; `adopted{author}` is the cheaper, truer one.
*Known weakness, from the verifier (`verify/w1-boruto.md`):* Narutopedia's
index is SILENT on this omake — the tie rests on AFG + the movie book's own
contents. Ruling it `adopted` does not add a source claim, so this is safe.

### G5 · NOT a ruling — a cleanup, 1 row
trigun 18 carries `chain_source` **and** a leftover ruling-origin
`side_source` naming the same Trigun Maximum chapters. The 2026-09-04 re-kind
added the new record and never removed the old one. It is invisible to
`side_source_on_chain` **because its work label is null** — i.e.
`source_work_unlabelled` (52 rows) is not cosmetic: it is actively hiding a
contradiction the census was built to catch.
**Recommended: RETIRE the side_source** (`lib/rulings/retired-annotations.ts`,
A43 — the one mechanism), and treat the label backfill as part of this apply.

### Carve-out — fullmetal-alchemist 37 (and 13): the class is a proxy
The class keys off annotation KINDS, not shares. FMA 37's own note says the
third segment adapts the novel **alongside two Arakawa bonus chapters** (Dog
of the Military?, The Military Festival) — real manga, unrecorded as an
annotation — and that "the same basis ep 13 is stored canon on", while ep 13
carries no `side_source` at all. So ep 37 is NOT tied only to the outside
work, and the two rows disagree with each other.
**Recommended: hold 37 out of the block flip.** Record the bonus chapters as
`side_story` (they are outside the numbered space → position-less, A44), then
let T28 decide the standing on the manga share. Ep 13 gets the same look.
This is the sitting's one genuine research crumb; it rides with the beelzebub
/ boruto-106 narrow wave, not with the block.

## THE DECISIONS SEAN OWES

| # | decision | recommended |
|---|---|---|
| **D1** | Line A or line B — does a licence confer canon standing? | **Line B** (a licence is not adoption) |
| **D2** | G1's 42 prose-novel rows | filler + side_source (the op-50 answer) |
| **D3** | G2's DBS film rows | adopted{author} + side_source, stay canon; ep 6 credit-checked first |
| **D4** | G3 — Shonan Junai Gumi / Galaxy Knights: chain works? | both onto the chain → chain_source |
| **D5** | G4 — boruto 18's Kishimoto omake | adopted{author}, row stays mixed |
| **D6** | G5 — retire trigun 18's superseded side_source | yes (A43) |
| **D7** | FMA 37 / 13 held out for the narrow wave | yes |

## HOW IT LANDS (after D1-D7)

1. **The rule** — a T26 amendment (P38: what a grep can hold, a grep holds).
   Edit the record in `lib/ledger/t.ts`; `ledger-check`; `gen-docs`.
2. **The gate (P2, lib)** — `sideSourceStandingOk()` beside `annotationProblem`
   in `lib/annotations.ts`: canon / mixed + `side_source` + no `adopted` = a
   violation the WRITER refuses. This is the P30 direction of travel: the
   class stops being a queue and becomes `ruling_violation`-tier.
3. **The rulings** — retypes as T6 pins (`rulings/episode-types.ts`, reason +
   cite); adoptions as `STANDING_ANNOTATIONS` entries (the 93-95 novel-map
   precedent, ruling tier); chain works in `rulings/source-chains.ts`; the
   trigun retirement in `rulings/retired-annotations.ts`. No apply-script
   one-shots — every one of these rows is ruling- or research-origin and must
   survive a re-derive (P8).
4. **The label backfill** — all 43 unlabelled `side_source` rows in this set
   get `chapters = '<work label>: …'` in the same pass, or the census still
   cannot check them (G5 is the proof).
5. **P3** — a `lib/` change → rebuild + deploy ALL FOUR edge functions.
6. **Census deltas to name in the commit:** `side_source_unadopted` 9 → **0**;
   `source_work_unlabelled` 52 → ~9 (the backfill); `anchor_on_noncanon_row`
   **0 → 0** (verified: zero anchors on all 57); `ruling_violation` 0;
   coverage and display **unchanged by construction** (offSource already).
   `afl_anime_canon_unruled` should NOT move: AFL calls black-clover 55-56 and
   fma 11-12 anime-canon and the rest plain canon (checked), but every retype
   lands as a T6 pin, so no row enters the unruled queue.

**Sizing:** this is one wave, not 6-8 (P12) — G1 is a single ruling applied 42
times, and G2-G5 are four small typed entries. The narrow wave that follows
(beelzebub 15 / 26-28 / 51, boruto 106, FMA 37 / 13, DBS ep 6's credit) is the
research half, and it is the only part that needs `/research-batch`.

## APPLY (2026-09-05, §12.117) — what landed and the two corrections

**Sean ruled Line B** (with Cursor: gate the STANDING not the annotation; weight not kind; A44 stays a position ruling and is NOT a signal in the predicate).

- **The rule:** T26 amended (retiredPhrases: the 'Itachi-novel row is canon + adopted + side_source' clause, I41's 'correct Itachi-novel pattern' parenthetical, 'canon relative to a licensed side source'). Predicate `lib/side-source.ts#sideSourceStandingProblem`: canon/mixed + `side_source` + no `adopted` + no weight-bearing tie (anchor / chain_source / side_story / unverified) → filler. Three consumers: `filterEpisodeRows` (the writer default, before T6 pins, ties loaded by every episode writer), `assert-overrides#assertSideSourceStandings` (after the annotation maps and the pins — one-run convergence), `side_source_unadopted` → `ruling_violation`.
- **G1 → 40 rows** filler + side_source, T6 pins (shippuden 22, boruto 14, black-clover 2, fma 2). **beelzebub 49 HELD OUT** (above).
- **G2** Resurrection 'F' 18-21 / 23-27: `adopted{author}` (原作・脚本 鳥山明), canon. **Ep 6 / Battle of Gods: 脚本 = 渡辺雄介, Toriyama 原作・ストーリー** (Toei staff page, ja-WP) — the 脚本 check FAILS; no adoption stamped; the row is filler + side_source by the default. **Sean's open call:** T30's load-bearing test on the shared arc (A46 'Battle of Gods', shared) — is the birthday-party sequence a node the manga's telling depends on? Queued with the narrow wave.
- **G3** Shonan Junai Gumi (gto 25-26) and Galaxy Knights (cobra **10-13** — the verdict's own rowspan-4 flag, not 13 alone) onto the chain; `side_source` → `chain_source` with labels; the old keys retired (A45).
- **G4** boruto 18 `adopted{author}` (Kishimoto wrote and drew the omake), stays mixed.
- **G5** trigun 18: the ruling entry re-kinded to `chain_source{Trigun Maximum: ch 1-2}`; the side_source key retired.
- **D7** fma 37: `side_story{the two Arakawa bonus chapters}` transcribed from the standing note; type held for the T28 look with ep 13.
- **Labels:** every side_source / chain_source row in the set now starts with its work label (ruling entries edited; research-origin rows via `apply-t26.ts`).
