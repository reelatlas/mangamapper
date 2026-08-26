# T4.0 — the glossary session: decisions D-9…D-13 with the evidence (prepared 2026-08-26)

Purpose: name the terms so no agent, badge or rule can say "anime only" and
mean two things. Output of the session: T-family ledger records, the
PROTOCOL/agent vocabulary (T3.2/T3.5), and the T4 build scope. Nothing is
retyped in this session; the build runs through `/add-rule` afterwards.

Success test (v2 plan §5): *a cold agent cannot use "anime only" to mean
filler, and a Madoka episode is not the same type as Black Clover 130–157.*

---

## The facts (queried 2026-08-26)

**Sources.** AniList `source` across our 343 series: MANGA 256 · ORIGINAL 37
· LIGHT_NOVEL 34 · VISUAL_NOVEL 9 · VIDEO_GAME 4 · OTHER 3. Every series is
`countryOfOrigin: JP` — no manhwa/webtoon/manhua exists in the catalog
today. **Our `series.source_type` collapses VISUAL_NOVEL, VIDEO_GAME and
OTHER into `original`** (16 series): steins-gate and clannad are visual-novel
adaptations, ace-attorney is a game adaptation — their "anime-only-canon"
rows are NOT Madoka-class, they adapt a source we do not name. That is a
source-level lie, not a naming quibble.

**`series.manga_status`:** manga/publishing 66 · manga/finished 188 ·
original/anime_only 51 · light_novel/anime_only 33 · manga/anime_only 2 ·
original/finished 2 · light_novel/publishing 1. The value `anime_only` means
"no manga to compare against" and is set for LN series too (33) — the
series-level homonym.

**`episodes.type = anime-only-canon`, 977 rows in 62 series:**
- 24 ORIGINAL-source series, ~530 rows, all "AFL anime_canon, unruled"
  (code-geass 50, psycho-pass 41, utena 34, nadia 30, bebop 27, champloo
  26, evangelion 26, kill-la-kill 25, madoka 12…). For these the anime IS
  the source: the value is doing the job `canon` should do.
- 3 VN/game-source series (ace-attorney 41, clannad 1+2, steins-gate 1) —
  studio-original material inside an ADAPTATION, mislabelled by the source
  collapse above.
- 3 LN-source singletons (durarara, 86, SAO), unruled.
- 35 MANGA-source series, ~430 rows. Ruled (T6, reasons in
  `docs/rulings.md`): boruto 221-286 (185, consensus-canon arcs),
  twin-star 21-50 (30, studio finale), black-clover 130-157 (21,
  consensus original), one-piece Sabo special (Sean), railgun originals
  (20), ajin S2 non-canon ending (13), gto mid-block + caught-up ending
  (10), naruto-shippuden 452-457 (6 — adapts the Itachi Shinden NOVEL: a
  SECOND source, "canon to what?"), sailor-moon 167-172 (6), claymore
  24-26 (3, outran the manga), chrono-crusade (3), kenshin-2023 (2),
  fairy-tail 256 (Sean), tpn 23 (Sean), beastars 44 (Sean), conan (Sean).
  Unruled AFL anime_canon: fullmetal-alchemist 27 (the 2003 divergent
  anime), beyblade-metal-fusion 32, dragon-ball-super 15, outlaw-star 13,
  soul-eater 13 (original ending), akame-ga-kill 5, and 12 singletons.

**Format facts today:** `series_components.kind` season 604 · ova 30 ·
special 13 · movie 17; `watch_order_entries.kind` null 38 · special 2 ·
recap 1. No per-episode format column; kenshin Trust & Betrayal rows are
`canon` AND OVAs — the two dimensions are independent.

**Badge strings today (`TypeBadge.tsx`):** `canon`, `mixed`, `filler`,
`manga_only`, `anime_only` — rendered literally.

---

## D-9 — the SOURCE enum and its derivation

**Decide:** the exhaustive `series.source_type` vocabulary and how it is
derived.

**Recommendation:** adopt AniList's own `source` values, lower-cased, as the
vocabulary — no invented names: `manga`, `light_novel`, `web_novel`, `novel`,
`visual_novel`, `video_game`, `game`, `doujinshi`, `original`, `other`, plus
region-qualified manga where `countryOfOrigin` says so: `manhwa` (KR),
`manhua` (CN), `webtoon` (format WEBTOON regardless of country — none exist
today; the value is reserved, not populated). Derivation = AniList source ×
countryOfOrigin × linked-manga format, with a `SOURCE_TYPE_OVERRIDES`
ruling map for the cases AniList gets wrong; an unmapped value FAILS CLOSED
(`source_type = null` + flag), never defaults to manga. Migration today is
mechanical: 9 → `visual_novel`, 4 → `video_game`, 3 → `other`; nothing else
moves.

## D-10 — canon STANDING, relative to the source

**Decide:** the episode-type values and what each means *relative to
`source_type`*.

**Recommendation — four values, one holding value:**
- `canon` — adapts the source's canon. For `source_type = original` every
  story episode is canon by definition (the anime is the source); AFL's
  `anime_canon` maps straight to `canon` there. This retires the Madoka
  confusion: Madoka is `canon`, full stop.
- `mixed` — canon and non-canon in one episode (unchanged).
- `filler` — zero source standing (unchanged; the X only-ending and DSQ
  padded finale stay filler + annotation + asterisk).
- `original_canon` — made for the anime inside an ADAPTATION, with canon
  standing by author/producer/community consensus (Black Clover 130-157,
  Boruto 221-286, the Sabo special). Only ever set by a ruling (T6), never
  by a source label.
- `original_unruled` — the HOLDING value for adapted series: AFL/AFG's
  "anime canon" on a series that has a source, not yet ruled. Renders as
  anime-original with NO canon claim (`P6`); its audit class is the
  batch-18 work-list (~40 series today). Never reaches the UI as "canon".

The AFL-import rule (T4.2): `source_type = original` → `canon`; otherwise →
`original_unruled` unless an override rules it. Cross-source adaptations
(Shippuden 452-457 adapting a novel) are `original_canon` + a `side_source`
annotation naming the work — "canon to what" is answered in the annotation.

The A-7 contradictions (claymore / gto / ajin endings typed anime-only-canon
vs DSQ filler) are re-ruled per series under these definitions in batch 18,
not in this session.

## D-11 — FORMAT, orthogonal to standing

**Decide:** where the tv / ova / special / movie / recap fact lives.

**Recommendation:** a nullable `episodes.format` column, DERIVED by a healer
from the containing component's `kind` and the watch-order entry's `kind`
(season → `tv`, else the kind), with a `FORMAT_OVERRIDES` ruling map for
the rest (kenshin 95-98 → `ova`, recaps → `recap`). `watch_order_entries.kind`
is backfilled in the same pass (38 nulls). A format never changes a type.

## D-12 — the WORDS users and agents say

**Decide:** badge strings, the series-level "no source" value, the tail
label, the instrument unit.

**Recommendation:**
- Badges: `canon` · `mixed` · `filler` · `original canon` (for
  `original_canon`) · `anime-original` (for `original_unruled` — no canon
  claim) · `source only` for the unadapted tail, rendered with the source
  noun where one exists ("manga only", "novel only"). The string
  `anime only` is RETIRED everywhere — code, badges, docs, agent text.
- `series.manga_status = 'anime_only'` → `none` ("no source publication to
  compare against"); `hasSource` derives from `source_type !== 'original'`
  alone (the second check goes away with the homonym).
- Instrument unit per source: chapter (manga/manhwa/manhua/webtoon),
  volume (light_novel/novel/web_novel — the LN instrument ruling `T24`),
  none (visual_novel/video_game/game/original/other — no position
  instrument; the card shows the series as original-canon with no tail).

## D-13 — scope of the T4 build

**Decide:** D2 (multi-space entries: prisma-illya, rosario S2 graft,
rayearth, trigun) in or out; the ch-82-inside-range schema question.

**Recommendation:** OUT of the T4 build — D2 is a segment schema, not a
vocabulary; record the design note, build after batch 18. T4 build = D-9
migration (16 rows) + D-10 values (the 24 originals → `canon`
mechanically; the rest → `original_unruled` except T6-ruled rows →
`original_canon`) + D-11 column and healer + D-12 strings + the AFL-import
rule + audit classes; each step through `/add-rule`, ending in
`/consolidate deep`.

---

## What the session produces

1. Your yes/no/amend on D-9…D-13 (this file records the rulings).
2. T-family ledger records for the glossary (`/add-rule`, ids T25+).
3. The vocabulary block for `research/PROTOCOL.md` and `research-agent.md`
   (T3.2/T3.5) — so batch 18 agents ship the new words from day one.
4. The T4 build order on the board.
