# T4.0 — the glossary, RULED (Sean, 2026-08-26; cross-checked with Cursor; banked pre-compact, NOT executed)

This file is the ruling record for D-9…D-13. The build (T4.1–T4.5) runs
through `/add-rule` after A-11 (exercise 2), in the order in §6, and ends
in `/consolidate deep`. Nothing below has been applied yet.

Success test: *a cold agent cannot use "anime only" to mean filler, and a
Madoka episode is not the same type as Black Clover 130–157.*

---

## 1. The model (ruled)

- **Source is series identity.** `series.source_type` names what the anime
  ADAPTS. Manga is NOT a global first look: manga is the instrument only
  when THIS series' source is manga. Steins;Gate adapts a visual novel even
  though a manga exists — that manga is a sibling adaptation (a
  relation/citation), never the instrument. The derivative-manga rule
  (`T21`, Evangelion class) stands and extends.
- **Standing is exactly three values, relative to the source:** `canon`
  (adheres to the identified source), `mixed` (source and non-source in
  one episode), `filler` (zero standing in the source — including
  studio-created material that does not adhere; X / DSQ endings stay
  filler). The sliver / cameo / overlap / rehash gauges (`A2`, `A10`, `T7`,
  `T8`) apply unchanged; the first non-manga evaluation may TUNE thresholds,
  never fork a second system.
- **Community / author / studio override is an ANNOTATION, never a fourth
  type.** Type becomes canon or filler as Sean rules; the exception lives in
  `episode_annotations` (§3). Canon does not imply a chapter mapping:
  consensus-canon-not-in-the-source = `canon` + annotation + null mapping
  (honest dash, no strip units). `A1` stands: filler never anchors.
- **Totals and the strip follow the source's own units.** Anime episode
  total always. Source totals = the source's real division (manga vol/ch;
  LN volumes per `T24`; VN / game / studio-original: NO invented instrument
  until a citeable, mapped example exists — named works such as Persona
  1–4 are citations/relations, not a count pretending to be chapters).
- **hasSource ≠ hasInstrument.** hasSource = an adapted work exists.
  hasInstrument = there are units to map to (a tail, a strip). Tail math
  and `{noun} only` badges only when hasInstrument. There is no
  `studio_only` tail — on a studio original the anime IS the source.
- **Format is an independent second axis, stored now, surfaced later**
  (`episodes.format`: tv / ova / special / movie / recap). Standing is never
  inferred from format: a movie that adheres is `canon` + `movie`; a recap
  can be filler, mixed or canon + `recap`. Remake is a SERIES relation, not
  an episode format. UI stacks chips from independent fields (standing +
  format, optionally the override chip); no combined enum.

## 2. D-9 — SOURCE_KINDS, a registry not an enum (ruled)

`scripts/ingest/lib/rulings/source-kinds.ts` — one declarative record per
source kind: `{ value, noun, unit: 'chapter' | 'volume' | 'none', tailBadge,
anilistSources: string[], countries?: string[] }`. Derivation = AniList
`source` × `countryOfOrigin` × `SOURCE_TYPE_OVERRIDES` (a RulingEntry map
for AniList's mistakes). An AniList value / country combination with no
record → `source_type = null` + flag — FAIL CLOSED, never default to
manga. Audit class `series_without_source_kind` must be 0. **A new source
= add one record and rule its instrument; never a migration debate.**

Seed records (values are AniList's, lower-cased — no invented names):
`manga` (chapter, "manga only") · `manhwa` (KR; chapter) · `manhua` (CN;
chapter) · `webtoon` (reserved, format WEBTOON; chapter) · `light_novel`
(volume, "novel only") · `web_novel` (volume, "novel only") · `novel`
(volume, "novel only") · `visual_novel` (none; never collapsed into novel;
"vn only" only if an instrument ever exists) · `video_game` / `game` (none;
"game only" only if an instrument ever exists) · `doujinshi` (chapter) ·
`original` (none — series label **studio original**) · `other` (none;
flag for a ruling).

Migration today: 9 → `visual_novel`, 4 → `video_game`, 3 → `other`.
Nothing else moves (all 343 series are JP-origin).

## 3. D-10 — standing migration + the override annotations (ruled)

The 977 `anime-only-canon` rows and the T6 map:
- `source_type = original` (24 series, ~530 rows): AFL `anime_canon` →
  `canon`. AFL `filler` / `mixed` on a studio original STAY as classified —
  only the "anime is the source" class becomes canon; recaps are not
  flattened.
- Ruled consensus rows → `canon` + `adopted` annotation with their existing
  reasons: boruto 221–286, black-clover 130–157, one-piece Sabo special
  (Sean), tpn 23 (Sean), beastars 44 (Sean), kenshin-2023 34 (Watsuki's own
  storyboard). Shippuden 452–457 (adapt the Itachi Shinden NOVEL): `canon`
  + `side_source` annotation naming the work; the series stays manga.
- The A-7 studio-ending class → `filler` + asterisk, ON THE REVIEW LIST:
  claymore 24–26, gto 22–28/34 + 42–43, ajin S2 14–26, chrono-crusade,
  sailor-moon 167–172, railgun originals, world-trigger 48, **and
  twin-star-exorcists 21–50 (30 eps: "the anime's own serialized finale
  that never returns to the manga" = studio ending, NOT author consensus
  — confirmed here as a review item, not a quiet demotion)**.
- Every other unruled AFL `anime_canon` on a manga / LN / VN / game series
  → `filler` (true by definition: adheres to no source). **AFL's claim is
  kept in staging** (`ingest_afl_shows.raw` is greedy) and the audit class
  `afl_anime_canon_unruled` (= stored filler where AFL said anime-canon and
  no ruling exists) IS the batch-18 work-list, derived mechanically. No
  holding type in the canonical table. LN / VN / game series: episodes that
  adapt THAT source are canon (Ace Attorney adapts the games).
- **A1 spike check in the same pass:** `anchor_on_noncanon_row` must read 0
  after the flip (these rows carry no anchors today under A1; the census
  proves it rather than heals it).
- **AFL refresh after the flip:** `filterEpisodeRows` maps AFL's
  `anime_canon` by the series' source kind (original → canon; else →
  filler) and the raw class is still staged — otherwise the audit dies on
  the next pull. The T6 map's `anime-only-canon` values migrate in the same
  script (each entry's reason already says which class it is).

**Annotation kinds added:** `adopted` — REQUIRED `basis: 'author' |
'studio' | 'community'` (Black Clover = author-supervised; Evangelion's EoE
= studio; X's only-ending = community, accepted for lack of an ending);
`retconned` — material later dropped from canon (world-trigger 49–63);
`side_source` — adapts a work other than the series' source (Shippuden
452–457). The check constraint on `episode_annotations.kind` extends
accordingly. "Community canon" is NOT a badge or a type.

## 4. D-11 — format (ruled)

Nullable `episodes.format` ∈ tv / ova / special / movie / recap, DERIVED by
a healer from the containing component's `kind` (season → tv) and the
watch-order entry's `kind`, with `FORMAT_OVERRIDES` (RulingEntry map:
kenshin 95–98 → ova, recaps → recap). `watch_order_entries.kind` backfilled
(38 nulls). A format never changes a type. Remake ≠ format.

## 5. D-12 — the words (ruled)

- **Retired everywhere** (code, badges, docs, agent text, types): `anime
  only`, `anime-only`, `anime-only-canon`, `anime_only`, `original canon`,
  `anime-original`.
- Badges: `canon` · `mixed` · `filler` · `{noun} only` for the unadapted
  tail when hasInstrument (`manga only`; `novel only` for LN / web novel /
  novel; VN never collapsed into novel). Format chips (`movie`, `ova`,
  `special`, `recap`) and the `adopted` chip are extra, from independent
  fields.
- Series label for the Madoka class: **`studio original`** (DB
  `source_type` stays `original`; the word `original` is never reused for an
  episode value).
- `series.manga_status = 'anime_only'` → **`none`** ("no source publication
  to compare against"); `hasSource` derives from the source kind alone.

## 6. D-13 — scope and ORDER of the T4 build (ruled)

D2 (multi-space entries) OUT of the build (design note stands; after batch
18). The build, each step through `/add-rule`, in THIS order — **UI strings
last, after the big unruled blocks are reviewed**:

1. ✅ (G54, 2026-08-26) A-11 (exercise 2): `airdate_regression` audit class + `AIRDATE_ORDER_ACK`
   map, then the 365-day NULL write gate; the "AFL trailing non-episode
   row" withhold is a sibling rule (project-arms 53), not the same one.
2. ✅ (T25, 2026-08-26) T4.1 SOURCE_KINDS registry + `SOURCE_TYPE_OVERRIDES` + derivation +
   `series_without_source_kind`; migrate the 16 collapsed rows (+ god-of-high-school → manhwa
   once the manga node's country was fetched); `manga_status: anime_only → none`;
   hasSource / hasInstrument split.
3. T4.2 the annotation kinds (`adopted` with basis, `retconned`,
   `side_source`) — migration + types regenerated.
4. T4.3 the standing migration (§3) with `afl_anime_canon_unruled` and the
   A1 spike check; the T6 map migrated; census deltas explained.
5. **Batch-18 review of the biggest unruled blocks BEFORE step 6** — FMA
   2003 (27), beyblade-metal-fusion (32), dragon-ball-super (15),
   outlaw-star (13), soul-eater (13), twin-star (30), the A-7 endings.
6. T4.4 `episodes.format` + healer + `FORMAT_OVERRIDES` + watch-order kinds.
7. T4.5 the words: badge strings, `{noun} only`, `studio original` label,
   `anime only` retired in agent/PROTOCOL text (T3.2 / T3.5 land here).
8. `/consolidate deep`; then the cross-model frame check (`P36`).

## 7. Open for Sean at batch 18 (recorded, not decided)

`SOURCE_TYPE_OVERRIDES` candidates surfaced by T4.1: solo-leveling and the-beginning-after-the-end derive `other` (AniList source OTHER) though each adapts a KR webtoon → `manhwa`?; ghost-in-the-shell-arise-alternative-architecture derives `other` (a re-cut of Arise — a relation, arguably `original`). ·
twin-star 21–50 adopted or filler · FMA 2003's second half (community
adopted?) · soul-eater ending · claymore / gto / ajin / chrono endings ·
which `adopted.basis` each ruled consensus row carries · the VN/game
instrument question when the first mapped example appears.
