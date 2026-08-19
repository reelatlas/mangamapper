# MapLookup — the anime↔manga position instrument

> **SUPERSEDED (2026-08-19)** by the inline position instrument —
> **[position-row.md](position-row.md)** is the current contract. The pure
> math and the hardened input behaviors documented here carry over unchanged;
> the CHANNEL model (ep ⇄ vol.ch toggle) and PINS described below dissolved
> when the totals row and the lookup merged (all three fields are always
> visible; driver = last field touched; filler/manga_only positions render as
> — values). Kept as the historical record of how the contract was derived.

> The AnimeCard's core interaction: type (or click) a position in one medium and
> instantly see where it lands in the other. Converged through the "MapLookup
> Synthesis" artifact explorations, 2026-08-18. This document is the behavioral
> contract — if the component and this doc disagree, one of them is a bug.

**Code layout (4 layers, no cross-contamination):**

| Layer | File | Holds |
|---|---|---|
| Pure math | [src/lib/mapping.ts](../../src/lib/mapping.ts) | canon-aware conversions, `solvePosition`, `seedStepValue`, `unitToChapter`. No React, no DOM. |
| State | [src/hooks/usePositionLookup.ts](../../src/hooks/usePositionLookup.ts) | channel/driver/pin state machine, carry, seeding, strip-click routing. No DOM. |
| Presentation | [src/components/MapLookup.tsx](../../src/components/MapLookup.tsx), [StepperInput.tsx](../../src/components/StepperInput.tsx), [MappingStrip.tsx](../../src/components/MappingStrip.tsx) | rendering only |
| Host | [src/components/AnimeCard.tsx](../../src/components/AnimeCard.tsx) | owns the hook so inputs and strip share one state |

The hook lives in the **host**, not in MapLookup, because the strip's needle and
click-to-set are part of the same instrument as the inputs.

---

## 1. Channels

Two channels, one visible at a time:

- **ep** — one input. Episode → manga vol/ch.
- **vol.ch** — two inputs (`vol`, `ch`). Manga → episode.

**Switching:** the entire label row is the switch (click anywhere on it). A `⇄`
glyph reveals on hover *of the label row only* (never on input hover/focus),
absolutely right-aligned to the input group's right edge.

**Labels** follow the PositionLabel contract (crosshair icon at 1em, label over
its own input column, 12px line box). Crosshair lights primary when the lookup
is active; only the **driver field's** label lights cyan.

## 2. Driver / derived / pin

- The field the user last typed in is the **driver** — indicated by its lit
  (cyan) label and normal-weight text. The input **border reflects keyboard
  focus only** (the details-page convention): clicking outside blurs the input
  back to its resting dashed border but **never clears state** — values, pin,
  needle, and result all persist until Esc or `// clear()`.
- Other visible fields show **derived** values (dimmed text). Autofill is
  **one-way**: `ch` fills `vol`; `vol` never fills `ch` (typing a vol shows the
  volume's start position on the strip; ch stays empty until refined).
- A **pin** is a filler episode selected on the strip while in vol.ch channel:
  the needle plants at a real position, both inputs stay null (no manga values
  exist for filler), result reads `filler → ep:N`.

## 3. Canon-aware math (the filler-skip rule)

Chapters exist only in canon/mixed episodes. All ch↔ep conversion distributes
chapters across the canon episode count and maps through the span list, so:

- a chapter can **never** resolve to a filler episode;
- stepping a chapter hops the needle **over** red blocks;
- typing an `ep` that is filler still reports `filler (no_manga)` — that is a
  real position the user asked about.

Confirmed per-episode data (chapter ranges in `anime.episodes`) always wins
over estimates. Estimates carry no `~` — approximation is assumed. The
`manga_only` tail is sized in episode-equivalents at **canon pacing**, so the
strip, projections, and reverse lookups share one coordinate space.

**Source scope:** every conversion respects the entry's source range
(`mangaStartChapter`/`mangaStartVolume` → `totalChapters`/`totalVolumes`).
Sequels starting mid-manga (Bleach TYBW: ch 480+) map ep 1 to the scope's
start, not to ch 1; chapters/volumes before the scope answer
`// out_of_range (ch 480-686)` — they belong to the predecessor series' entry
(the Naruto/Shippuden separation rule — see DESIGN_SYSTEM). `fieldMin`
bounds stepping at the scope's start; an empty instrument seeds there too.

## 4. Result metadata (meta-row)

Tag-first, no `//` on tags, `→` after the tag. Rendered in a `.meta-row`
(baseline-aligned — see DESIGN_SYSTEM.md). **One font size for every child of
the row** — tags, values, and `// clear()` all inherit the row's `text-sm`;
hierarchy within the line is expressed by color only, never by size:

| Situation | Reads |
|---|---|
| ep-driven, canon/mixed | `canon → vol:108 · ch:1092` |
| ep-driven, filler | `filler (no_manga)` |
| ep-driven, beyond aired (in hatch) | `manga_only → vol:109 · ch:1104` |
| vol/ch-driven, animated | `canon → ep:514` (episode ONLY — inputs hold the rest) |
| vol/ch-driven, in hatch | `manga_only` |
| pinned filler | `filler → ep:332` |
| out of bounds | `// out_of_range (ep 1-1122)` / `(vol 1-110)` / `(ch 1-1130)` |

`// clear()` trails the result whenever the lookup is active.

## 5. Strip interaction

Clicks are **mode-preserving** — the channel never flips on you. The pin rule
is symmetric across channels: *a position with no value in the current
channel's unit PINS (needle stays, input null) instead of inventing a number.*

- **ep channel:** click sets the episode; clicking the **manga_only hatch
  pins** — no episode exists there, so the ep input stays null while the
  dimmed needle marks the spot and the result reads `manga_only → vol · ch`.
- **vol.ch channel:** click sets the chapter; clicking a **filler** zone pins
  (see §2); clicking the hatch sets an unadapted chapter. Canon-zone clicks use
  `chapterForEpisode` — a chapter guaranteed to resolve back to the clicked
  episode — so the needle lands under the cursor instead of drifting ±1 episode
  through the estimate roundtrip (visible on short series).

Hover shows a ghost needle. Needle states: white = real position; dimmed =
projection beyond the aired run; pegged dimmed at the bar's end = beyond the
published story.

## 6. Stepping & seeding

All step paths — ↑/↓ keys (shift = ±10), the ▲▼ steppers (visible on hover/focus, matching the details-page spinner behavior),
mousewheel (only while focused) — route through one function. **StepperInput
owns its steppers** (native spinners disabled via `.no-spinner`) precisely so
this holds.

**Stepping bounds:** stepping never leaves the valid range (typing beyond it
stays allowed — that's an intentional query). `ep` steps are clamped to the
aired run: the manga_only hatch holds **no episode numbers** (it's
episode-equivalents of unadapted chapters; episode numbering is contiguous),
so there is nothing to skip *onto* — step-up at the last aired episode is a
no-op, and step-down from a typed projection snaps to the last aired episode.
`ch` clamps to published chapters, `vol` to total volumes. If interleaved
manga_only gaps ever land in the data model they live in **chapter space**,
where the canon-aware ch↔ep conversion already skips unadapted content — ep
stepping semantics are unaffected.

**Seed rule:** stepping an **empty** field never starts at 1 — it continues
from the current selection context, in the pressed direction. From a pinned
filler ep 332: `vol↑` → 29, `ch↑` → ~288 (nearest canon episode forward),
`↓` → nearest values behind. With a vol set, an empty `ch` seeds at the
volume's start chapter. (A truly empty instrument — no pin, no value — steps
to 1.)

**Directional integrity:** seeding and stepping only ever move in the pressed
direction. If no valid value exists that way, the step is a **no-op** — it
never falls back to the other direction, never reverts to a nearer-but-wrong-
way value, never resets. Concretely: from a **manga_only pin**, `ep↓` seeds
the last aired episode but `ep↑` does nothing (every episode is below the
pin); from a filler pin at the run's very edge, stepping toward the edge does
nothing; at ep 1 / the last episode / the last published chapter, stepping
past the extreme does nothing.

## 7. Carry across channel switch

Switching channels preserves the position: the needle never leaves the strip
and the new channel's driver arrives pre-filled with the solved value
(ep↔ch round trips within ±1). Positions with no value in the destination
channel carry as **pins** (values null, needle stays): filler → into vol.ch,
manga_only → into ep. Out-of-range does not carry.

## 8. Keyboard

| Key | Effect |
|---|---|
| ↑ / ↓ | step ±1 (seeded when empty) |
| shift + ↑/↓ | step ±10 |
| Esc | clear everything (values, pin, needle) |
| wheel (focused) | step ±1 |

## 9. Empty / disabled states

- Series with no source (`sourceType === 'original'`): lookup not rendered.
- Source but no confirmed mapping yet (`latestKnown === null`): lookup not
  rendered (nothing to convert against).
- ep-driven with unavailable chapter math: `(mapping_pending)`.

## 10. Future notes

- `continue_from` presentation was deliberately cut (too noisy); typing
  `aired+1` answers it via the projection. Revisit presentation later.
- When real per-episode data lands (AniList + filler feed), estimates shrink
  to exact values with **zero component changes** — only `lib/mapping.ts`'s
  inputs improve.
- The detail page can adopt the same instrument by calling `usePositionLookup`
  and passing it to `MapLookup` + its strip.
