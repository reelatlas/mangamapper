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

- Header row: `[typed chevron] ep:337-381 (45)   vol:29-33 · ch:289-336`
  (colon-tight `ep:` — same key:value format as everywhere else in the card)
  - **interior_v1 (2026-08-21): headers carry NO type tag.** The section's
    type reads from its **band color** (`.section-band-*` — the type color
    tinted at 0.07/0.12-hover, composited over the OPAQUE card surface so
    sticky headers occlude the rows scrolling beneath) plus the colored
    chevron. manga_only wears its own `--type-manga` purple band.
  - **Marker (A3)**: the canonical SVG chevron in the section's type color,
    inside a fixed square flex-centered box (`0.8rem`), rotating right→down in
    place. Never rotate a text glyph in a tall inline box (the v5 caret bug).
  - range/coverage NUMBERS are always the normal text color, collapsed or
    open (confirmed ruling 2026-08-21 — supersedes the interior_v1 "engaged"
    brightening, where collapsed numbers sat muted); the `ep:`/`vol:`/`ch:`
    labels and the `(count)` keep the muted label color (key:value grammar).
  - Coverage: **whole volumes, no partial marking** (`vol:29-30` even when
    vol 30 flows into the next section). Filler sections show `—`.
- **Sticky**: the active section's header stays pinned at the top of the
  scroll frame (virtualizer sticky-index pattern), so deep rows never lose
  their type context.
- Default state: **all collapsed** (overview first).

## 5. Rows

Column alignment contract — row columns are **derived from header geometry**
(pad 0.3 + marker 0.8 + gap 0.6):

- `#` column starts at `pl-[1.7rem]` — exactly the header's text start — so
  the rows' `#` shares a left edge with the header's `ep:` token
  (**edge-over-edge**, 2026-08-21; supersedes the badge-era `2.15rem+1px`
  indent and the number-over-number framing that went with it).
- The `#ep` gutter is sized like an **editor line-number gutter**: width =
  `(digits of the series' max episode + 1)ch` (`#999` → 4ch, `#1122` → 5ch;
  a 5-digit run auto-fits). Mono + `tabular-nums` make every glyph exactly
  1ch, so the `#` rail and the digits' start edge are both dead vertical.
  **Left-aligned** — episode numbers are identifiers, not quantities
  (right-alignment is for magnitude comparison; identifiers keep the prefix
  rail).
- Title follows after the shared `0.6rem` flex gap, so all titles in a card
  align to one column.
- Changing the marker box size or header padding **must** update these.

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
- `state:'run'` with `ep ≤ aired` → that row is selected: `bg-muted/40` + a
  2px inset rail in the row's **own type color** (interior_v1 — never zebra,
  never the generic primary). If its section is collapsed it auto-expands; if
  the change came from the inputs or the strip the row **jumps to the top of
  the frame, directly under the sticky header** (maximum forward context) and
  pulses (`.animate-row-pulse`, **type-colored** via `--pulse-color`; amber
  only as the no-context fallback). The jump **clamps naturally**: near the
  end of the list the scroll stops at its limit and the selection sits lower
  in view; a fully-visible list never scrolls — selection only. No artificial
  overscroll space. If the change came from the list itself there is **no
  jump scroll** (click = no scroll, arrow walk = minimal "nearest" scroll).
- **Keyboard handoff by explicit intent (2026-08-21)**: ONLY a strip click
  hands the keyboard to the list — the lookup bumps a monotonic `jumpSerial`
  in `stripClick` and the list focuses its scroll frame when it changes.
  Field typing/stepping also moves the selection but NEVER steals focus.
  Intent travels as a signal from the source — never inferred from selection
  changes or `document.activeElement` sniffing.
- `state:'hatch'` (a manga_only position, typed or clicked) → the list
  orients at the **last aired episode** — the nearest value before the
  manga_only zone — selected and centered. The lookup keeps its pin/readout.
- cleared / out_of_range → no selection.

**List → strip (M1 band)**: the visible slice of the list is reported as an
episode range and drawn on the strip as the minimap band — bright neutral
fill (`foreground/45%`, retuned 2026-08-21: 18% vanished against syntax_v1's
fills and a muted grey read as dimming), **no edge lines**. Derived from the actually
rendered items (grouping-aware): an open section contributes its visible
rows; a **collapsed header contributes its whole range**. "Visible" means
**at least half the item shows in the area below the pinned sticky header**
— rows tucked behind the pinned header or 1px slivers at either edge never
widen the band. The pinned header itself counts only when its section is
collapsed (then its full range is included — it's the section's only
visible representation).

**Minimap toggle (picked 2026-08-21, Minimap Toggle Lab `ae6bae37`)**:
the band is user-hideable — the **bare_miniature** in the legend line's
empty **left** slot (the badges stay right-aligned): a drawn miniature of
the strip alone — no chip wash, no word — so the control IS a picture of
its state (on: band shown; off: band gone, track dimmed). Glyph anatomy
(lab tuning walk): 28×6 track, band 26–64% — left-of-center, dead center
reads as a logo mark — flush height, 1px radii; invisible button padding
is the hit area. Rejected en route: `// minimap(on|off)` text (wordy), the
TypeBadge-grammar chip (read as a bandaid / fifth badge — badges hide
data, this hides view chrome, and the shared form muddied the kinds).
Preference persists in `localStorage` (`mm:minimap`), shared across cards;
off simply passes `viewband=null` to the strip — range reporting itself
keeps running.

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

## 9. Keyboard — global selection walking (2026-08-21)

Gmail/Linear-pattern list shortcuts, from a **document-level** listener:

- While a selection exists, `↑`/`↓` (and `j`/`k`) walk episodes ±1 **no
  matter where focus sits** — through the same mode-preserving path as row
  clicks; the needle and lookup track; scrolling is minimal ("nearest"),
  never recentering.
- **Editable controls always win**: typing/stepping in the position row
  never walks the list.
- `reset()` clears the selection and returns the keys to their native
  meaning. One extra case: focus IN the list frame with no selection —
  arrows seed from the first/last episode (standard listbox behavior).
- Walks only through visible (legend-filtered) sections; no-ops at the
  visible edge (directional integrity).

## 9b. Scroll behavior — the three rules (2026-08-21)

All scroll positions are computed from the fixed `HEADER_H`/`ROW_H`
geometry — never measured, never delegated:

1. **Component-owned scroll.** Selection scrolls set `scrollTop` directly;
   `virtualizer.scrollToIndex` is NEVER used (its internal offset only syncs
   on scroll events, so it computes wrong targets in the same frame as a
   compensation — the root of the expand-jump bug). The virtualizer is
   purely a render window; its scroll listener flushSyncs the window
   pre-paint, so direct `scrollTop` writes are exactly as safe as its own
   API. Compensation + selection scroll run as consecutive layout effects →
   one painted frame, no intermediate state.
2. **Toggle scroll clamp.** Toggling a section you're scrolled past clamps
   `scrollTop` to the header's natural offset (iOS grouped-list / VS Code
   tree rule): close lands the closed header pinned at the top; open shows
   the new rows under the clicked header. Mid-list toggles are untouched.
3. **Scroll anchoring, reimplemented** (native `overflow-anchor` can't act
   on absolutely-positioned virtual rows), by walk direction:
   - **UP into a collapsed section**: the landed row is the block's LAST
     row — pin the user's focus (full inserted height compensated before
     paint, marked by the walk's explicit direction) and the block unfolds
     above the frame with zero extra motion. The anchor is the focus NODE,
     not the viewport-top pixel — a visible collapsed header must not
     disable it.
   - **DOWN into a collapsed section**: the landed row is the block's FIRST
     row — minimal scroll only; the rows appearing beneath it ARE the
     section visibly opening (same as clicking its header). Forcing the
     unfold below the fold ('end' bottom-snap) was tried and REJECTED — it
     teleports the view on mid-frame crossings.
   - Other expansions (`expand_all` while scrolled) anchor insertions above
     the viewport top.

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
forced via inline style so estimate and reality cannot drift), overscan 8.
No `scrollPaddingStart` — selection scrolls are component-owned (§9b) and
the virtualizer only windows the rendering. The scroll container **hugs its
content** up to a `max-h-80` (320px) cap — never a fixed height (short
series don't get empty space), and no artificial overscroll space past the
end (jumps clamp naturally — see §6). Items = headers + rows of open
sections; the size cache is dropped (`virtualizer.measure()`) whenever the
item list changes shape.
