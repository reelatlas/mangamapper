# EpisodeList — behavioral contract

The full aired run inside the expanded AnimeCard: every episode as a row,
grouped into its filler/canon **sections**, synced three ways with the
MapLookup instrument and the MappingStrip. Read-only, account-free.

If the component and this document disagree, one of them is a bug.

Decided across the EpisodeList Lab → Synthesis explorations (2026-08-19,
artifact `ef1935f4-…`): **S2 tint badges · C1 hierarchy · A3 typed chevron ·
M1 fill-only band**.

---

## 1. Vocabulary

- The groups are **sections** — contiguous spans of one episode type — never
  "arcs" (arcs are story/lore arcs; a section boundary is a data boundary).
  Code calls them `spans` (data) / `sections` (list model).
- **`—` is the universal null** (matches `ep:1122/—` in anime totals). It
  replaces `// no_manga` everywhere in the list: filler rows' manga column,
  filler sections' coverage label.

## 2. Layered architecture

```
lib/mapping.ts        buildEpisodeList(anime, mapping) → { rows, sections }   (pure)
components/EpisodeList.tsx   virtualized grouped list + section state         (presentation)
components/AnimeCard.tsx     owns usePositionLookup + wires all three ways    (host)
```

- `EpisodeRow { ep, type, title, vol, ch }` — one per aired episode, 1..aired.
  Confirmed episodes carry their real title + `mangaMapping` (ch may be a
  range like `"1088-1089"`); everything else is estimated via `canonEpToCh`
  with `title: null` → rendered `// title_pending`. Filler/anime-only rows
  keep `vol`/`ch` null by design.
- `EpisodeSection` mirrors `mapping.spans` 1:1 and reads its coverage
  (volStart/End, chStart/End) **from the rows**, so header ranges always agree
  with the rows revealed on expand.
- The **manga_only tail is not in the list** — it holds no episodes.

## 3. Hierarchy (C1)

Counts appear exactly once each:

- **total episodes** → anime totals (`ep:1122/—`) only.
- **type breakdown** → the TypeBadge legend **right-aligned directly BELOW
  the strip** (G4 placement, 2026-08-19: graphic first, key tucked right —
  above-the-strip crowded the position row's spacing). Badge = legend unit,
  count inside; a badge with no data doesn't render.
- **list header** → the `episode_list` label (canonical ListIcon,
  PositionLabel metrics, matching anime/manga) which is itself the
  expand/collapse-all control (§7). Zero counts of any kind.

## 4. Sections

- Header row: `[typed chevron] [TypeBadge] ep:337-381 (45)   vol:29-33 · ch:289-336`
  (colon-tight `ep:` — same key:value format as everywhere else in the card)
  - **Marker (A3)**: the canonical SVG chevron in the section's type color,
    inside a fixed square flex-centered box (`0.8rem`), rotating right→down in
    place. Never rotate a text glyph in a tall inline box (the v5 caret bug).
  - **TypeBadge** in a fixed `4.2rem` column; the header owns the type — rows
    carry **no** type marker.
  - ep range + count use the muted label color; only the badge carries
    color — except while the section is OPEN: the range/coverage NUMBERS
    (not their labels) brighten to the normal text color ("engaged"),
    returning to muted on collapse.
  - Coverage: **whole volumes, no partial marking** (`vol:29-30` even when
    vol 30 flows into the next section). Filler sections show `—`.
- **Sticky**: the active section's header stays pinned at the top of the
  scroll frame (virtualizer sticky-index pattern), so deep rows never lose
  their type context.
- Default state: **all collapsed** (overview first).

## 5. Rows

Column alignment contract — row columns are **derived from header geometry**
(pad 0.3 + marker 0.8 + gap 0.6 + badge border 1px + badge pad 0.45rem):

- `#` starts exactly at the badge's first letter → `pl-[calc(2.15rem+1px)]`
- title starts exactly where the header's ep-range starts → eno column
  `calc(W − 0.45rem − 1px)` + `0.6rem` gap, where **W is the adaptive badge
  column**: 4.2rem normally, 5.7rem when the list contains anime_only
  sections (the token text never shortens — the column adapts, and every row
  column adapts with it).
- Changing TypeBadge's padding or the marker box size **must** update these.

**Type scale** (matches the rest of the card): labels — `episode_list`, the
expanded/collapsed controls — are `text-xs tracking-wider`; all values — the
section header line, every row — are `text-sm tabular-nums`, one size per
row (hierarchy by color only). Badges carry their own component scale.

Row content: `#337 · title · vol:29 · ch:289`

- `#` = the **disabled tone of the section's own color** (type color at 0.45
  alpha); the episode number = full type color. Format `#1`, never `#0001`.
- Missing titles: `// title_pending` in the neutral disabled tone
  (`muted-foreground/60`).
- Manga column: `vol:` / `ch:` labels muted, values foreground; filler rows
  show `—` in the neutral disabled tone.

## 6. Three-way sync

**Row → lookup** (routes through `lookup.selectEpisode(ep)`): the ep field
drives — exact by construction, filler rows included (ep is a real value
there). The old vol.ch-mode translation (and its ±1 drift class) no longer
exists for row clicks; see [position-row.md](position-row.md) for the
driver-field model.

**Lookup → list** (selection follows `result`):
- `state:'run'` with `ep ≤ aired` → that row is selected. If its section is
  collapsed it auto-expands; if the change came from the inputs or the strip
  the row **jumps to the top of the frame, directly under the sticky header**
  (align `start` + `scrollPaddingStart`; maximum forward context) and pulses
  (`.animate-row-pulse`). The jump **clamps naturally**: near the end of the
  list the scroll stops at its limit and the selection sits lower in view; a
  fully-visible list never scrolls — selection only. No artificial overscroll
  space. If the change came from the list itself there is **no jump scroll**
  (click = no scroll, j/k = minimal "nearest" scroll).
- `state:'hatch'` (a manga_only position, typed or clicked) → the list
  orients at the **last aired episode** — the nearest value before the
  manga_only zone — selected and centered. The lookup keeps its pin/readout.
- cleared / out_of_range → no selection.

**List → strip (M1 band)**: the visible slice of the list is reported as an
episode range and drawn on the strip as the minimap band — brighter neutral
fill (`foreground/18%`), **no edge lines**. Derived from the actually
rendered items (grouping-aware): an open section contributes its visible
rows; a **collapsed header contributes its whole range**. "Visible" means
**at least half the item shows in the area below the pinned sticky header**
— rows tucked behind the pinned header or 1px slivers at either edge never
widen the band. The pinned header itself counts only when its section is
collapsed (then its full range is included — it's the section's only
visible representation).

## 7. expand/collapse control ("X6 hover_command", 2026-08-19)

ONE control, and it IS the list header: the whole `episode_list` label
(icon + text + revealed command) is a single button.

- **Rest**: just the label — no counts (`expanded:#/collapsed:#` retired;
  the list shows its own state), no standing chrome.
- **Hover** reveals the flip command as **literal text in the same inline
  flow**, primary color: nothing open → ` > expand_all`; anything open
  (some or all) → ` > collapse_all`. Real mono spaces (`whitespace-pre`) —
  the gap label→`>` and `>`→command are each exactly one character; the
  line reads as code continuing itself. Same type metrics as the label
  (inherit size/tracking/baseline — never a smaller "button" style).
- **Click anywhere on the label** toggles: none open → expand all;
  any open → collapse all (X2 master-toggle state machine).
- Filtered-empty list → the button is disabled (no hover, no click).

## 8. Legend-as-filter

The badge legend under the strip doubles as the type filter, **click-to-hide**:
everything is "selected" by default, and clicking a badge removes that type
from view; clicking it again restores it.

- Click `filler` → filler disappears from strip + list, everything else
  stays. Click `manga_only` too → both hidden. Re-click to restore.
- **Badges**: visible types render normally (`aria-pressed=true` — visible =
  selected); hidden types dim to 40% and stay clickable to restore. The badge
  is a real `<button>`.
- **Strip**: excluded types ghost to neutral (`bg-muted/60`) **in place** —
  strip geometry (units, needle position, click math) never changes;
  filtering is purely a view concern. The manga_only tail ghosts the same way.
- **List**: excluded sections (headers + rows) drop out entirely; the
  expanded/collapsed totals count visible sections only; the minimap band is
  derived from what actually renders, so it tracks the filtered view. If
  nothing matches: `// filtered(0) — no sections match the legend selection`.
- **The lookup is never filtered** — typing ep 332 with filler filtered out
  still resolves and pins; the list simply has no row to select. Section
  open/closed state survives filtering.
- j/k walks only through visible sections (no-op at the visible edge —
  directional integrity).

## 9. Keyboard

Focus the list (tab or click), then `j`/`↓` and `k`/`↑` walk episodes ±1
through the same mode-preserving path as row clicks; the needle and lookup
track; scrolling is minimal ("nearest"), never recentering.

## 10. Known limitation — anchor-shadowed rows

Estimated rows adjacent to confirmed data can carry a chapter estimate that
the solver resolves to a neighbor's **confirmed range** (4 rows across the
whole mock catalog: one-piece ep1117, re-zero 43-45). `chapterForEpisode`
validates candidates with the solver's exact-first resolution and picks a
resolvable neighbor chapter when one exists; when none does, the solver's
answer wins and the list moves the selection to that neighbor **without a
scroll jump**. The real fix is anchor-aware interpolation (estimating
*between* confirmed points) when AniList data lands.

## 11. Virtualization

`@tanstack/react-virtual`, fixed item heights (header 30px, row 28px —
forced via inline style so estimate and reality cannot drift), overscan 8,
`scrollPaddingStart: HEADER_H`. The scroll container **hugs its content** up
to a `max-h-80` (320px) cap — never a fixed height (short series don't get
empty space), and no artificial overscroll space past the end (jumps clamp
naturally — see §6). Items = headers + rows of open sections; the
size cache is dropped (`virtualizer.measure()`) whenever the item list
changes shape.
