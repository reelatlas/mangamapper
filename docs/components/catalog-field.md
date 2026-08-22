# CatalogField — the browse instrument

The homepage's collapsed catalog: every series as a title row in a scrollable
"field" with center emphasis, and the expanded card opening **in place** via
takeover. Converged 2026-08-19 across three artifact labs:

- **Catalog Rolodex Lab** `aac0a3db` — scroll feel → **flat_basis_v1**
- **Catalog Expand Lab** `1a9ff4ed` — expand mechanic → **takeover_v1**
- **Row Meta & Grep Lab** `9cb009f7` — row metadata + filter effects
- **Frame Size Lab** `33b3131e` — frame law → **fill_offset**
- **Focus Law Lab** `c6afc733` — the traveling focus line → **the focus lock**

The lab-tuned numbers are named constants at the top of
`src/components/CatalogField.tsx`. They are **rulings, not suggestions** — a
change means a new lab round, not an inline tweak.

## 1. The field (flat_basis_v1)

A single native scroll container. Every visual is a function of one number per
row: **d = distance from viewport center, in rows** — computed in ONE rAF pass
over the ~±(viewport/2/rowH) coverage window and written as inline styles.
No per-row observers, no React state per frame, no scroll-snap.

| constant | value | meaning |
| --- | --- | --- |
| ROW_H | 36px | fixed row height (geometry is index math, never measured) |
| TEXT_PX | 18px | row title size |
| FADE_PCT | 24% | top/bottom `mask-image` fade — fades the glyphs themselves |
| FALLOFF | 8 rows | distance at which the ramp reaches minimum |
| OP_MIN / OP_EXP | 0.08 / 1.5 | opacity ramp floor and curve |
| TRACK_MAX | 2px | letter-spacing at center, ramping to 0 |
| weight ramp | 600/500/400 | \|d\|<0.5 / <2 / else |
| LAG | 0.4 | styling reads a lerped scrollTop — emphasis *chases* the focus |
| accent | primary (cyan) | focused row color + `> ` cursor prefix |
| snap | **OFF** | free momentum; the highlight follows, the list never detents |
| FOCUS_LOCK | **0.36** | fraction of frame where the focus locks (trialed 0.5→0.1→0.3→0.36) |

**THE FOCUS LOCK — the traveling focus law (Focus Law Lab `c6afc733`, locked
2026-08-19).** The vocabulary: the *focus line* is where emphasis lives; the
*focus lock* (`FOCUS_LOCK`, a fraction of the frame — **0.36**) is where it
stops migrating. The law, asymmetric by ruling:

- **Top:** no top pad — the first row anchors to the frame's top edge AND is
  the focus at rest. Zero dead space; search results populate exactly where
  the top of a full list would.
- **Migration:** the focus line moves down 1:1 with rows accumulating above
  it, until it reaches the lock. Then it locks, permanently.
- **Bottom:** the focus never travels past the lock — the end of the list
  scrolls UP into it (picker convention). The *bottom runway*
  (`max(stageH − lockY, stageH − contentH/2) − ROW_H/2`) is sized so the last
  row rests exactly at the lock; short lists get a longer runway so the focus
  sweep can reach their last row. Any list of 2+ rows scrolls through focus.
- **Adaptive fade** (companion, not a re-tune): each fade zone =
  `min(tuned 24%, content actually beyond that edge)` — full drum fade
  mid-list, receding to zero at the ends so the focused row is never eaten.
  **And the fade never crosses the focus line**: each zone is additionally
  capped to complete before the focused row begins, whatever `FOCUS_LOCK` is
  (discovered at lock 0.1, where the 24% band swallowed the focused title).
- **Targeting:** `focusAbs(t) = t + focusY(t)` is monotonic; clicks, rail
  jumps, and the takeover glide invert it by bisection.
- **The chrome anchors to the lock:** watermark letter + 14px A–Z rail sit at
  `lockY`, container-aligned (the Header's content frame). Shifting the focus
  and its chrome up/down is the ONE token `FOCUS_LOCK`.
- **Engine invariants (nothing positioned by magic numbers):** every rule
  re-solves from `FOCUS_LOCK` + frame + real viewport. (1) The ramp *above*
  the focus decays within the room that exists (`min(FALLOFF, lockY/ROW_H)`)
  so rows finish dimming before the frame edge clips them — a no-op whenever
  8 rows fit. (2) The styled window covers the REAL viewport, not the lagged
  focus, so fast scrolling can never outrun the ramp. (3) A cleared row
  restores the BASE dim (OP_MIN), never browser-default opacity. (4) The
  adaptive fade quantizes in 4px steps (per-pixel mask growth re-rasterizes
  every frame). Each of these was a shipped bug first — treat them as part of
  the law.

Ramp, fades %, lag, type — flat_basis_v1 untouched. History: a flattening
"fits regime" and a symmetric top+bottom traveling line were both tried and
reverted before this law was specified and locked in its own lab.

**Page composition:** frame law = **fill_offset** (Frame Size Lab) — the
search line (96px under the global header, 64px above the field) stays fixed
and ALL remaining viewport height goes to the field's frame. The search line
is left-aligned with the title column (same `min(52ch,82%)` width formula at
the field's 18px so the ch-math resolves identically, plus the 2ch cursor
gutter). Its idiom: the muted **magnifier hangs LEFT of the underline in the 2ch
cursor gutter** — the same column where the rows' `> ` caret renders
(2026-08-21, supersedes icon-on-the-line: the gutter is the cursor zone in
both registers — `>` lights primary at row focus, the magnifier lights
primary at search focus), so the typed query starts flush with the title
glyphs. **The magnifier is a real control (2026-08-21): click = activate
search, same target as ⌘K** (hover steps muted → foreground, the rail
letters' pressable grammar); **the active state lights the ICON primary, never the line** — in
this system a dashed underline means *editability*, not activity. **The underline spans HALF the
title area (Sean's tuning walk, 2026-08-21: full column → title area →
2/3 → 58% → 50%):** one fixed rule from the title-glyph start, width =
`(column − META_RESERVE) × LINE_FRACTION` — both named constants
(`META_RESERVE` exported from CatalogField.tsx beside META_PX: widest
status word 8ch × Plex's 0.6em advance + the rows' pl-4 = 73.6px;
`LINE_FRACTION = 0.5` in Index.tsx), so the line and the rows share one
derivation. The width is a formula,
so the line's geometry is state-invariant by construction; the keycap
hint hangs right of the line's end (ml-3, empty+inactive only) and the
input flexes inside the line. (96/64 are a composition ruling, not
tokens yet — mint page-rhythm tokens when a second page needs them.)

**The rail is responsive by columns (ruling 2026-08-19):** every letter stays
surfaced, always — when the alphabet outgrows the frame the rail overflows
into side-by-side columns (first column filled to what fits, remainder
spilling over — 20/7, not balanced halves), and its anchor clamps inside the
frame. iOS-style `A · C · E` abbreviation was tried and rejected.

## 2. Row metadata (Row Meta & Grep Lab ruling)

`meta: status` — the series' status word, right-aligned in the row at **12px**,
tone-scale muted (airing = accent green, hiatus = amber, else muted). Renders through **`StatusChip`, unstyled** (2026-08-21): the chip's one
register (12px `text-xs`, no tracking) IS this row meta's — Sean's
max-consistency ruling made the homepage the reference and the card/detail
seats match it exactly.
**reveal = center**: meta opacity is f², so it fades in only as a row
approaches focus. The field reads as pure titles; the focused row quietly
reports. Progress/full variants were explored and rejected for v1.

## 3. Grep (filter) behavior

- Non-matching rows are **removed** (never dimmed — `dim` mode rejected).
- The matched substring is **highlighted** (primary) in every surviving title.
- On every filter change the visible window **decodes in**: rows scramble
  through terminal glyphs for **DECODE_MS = 240ms** (12ms/row cascade), and
  the highlight ignites as each title resolves. Event-scoped — never a
  continuous effect. Also runs on first data load.
- Filtering is client-side substring-on-title while the catalog is mock-scale;
  swap to `catalog.search` when AniList lands (the decode is agnostic to where
  the rows came from).

## 4. Takeover (takeover_v1) — expand in place

Click a row (or Enter when focused) →

1. **glide** — scrollTop tweens the row under the focus lock (target found by
   inverting `focusAbs` — bisection, like all targeting); duration is
   distance-proportional `min(GLIDE_MAX=600, 120 + dist·0.8)ms`, eased. The
   card NEVER opens while the list is moving.
2. **settle** — SETTLE_MS = **320ms** pause at center. (Clicking the
   already-centered row skips glide AND settle — instant open.)
3. **grow** — the field dims to DIM = **0.15** (its scroll locks, edge mask
   lifts), the clicked row ghosts, and the overlay grows from the row's OWN
   screen line (near the list ends the focus line means the row rests
   off-center; the overlay anchors where the row actually is, final position
   clamped inside the stage) — height ROW_H → card height over OPEN_MS =
   **360ms**, card fading 0.25 → 1. Overlay width `min(48rem, stage−2rem)`,
   height capped to the stage; the overlay hosts the REAL `AnimeCard`.
4. **close** (esc / `[x]` / click-away) — reverse grow, then the field
   uncovers **already centered on the title you opened**. Focus follows what
   you opened, never the pre-click scroll position.

~~Deferred to the aesthetic pass: content stagger~~ **SHIPPED with
instrument_v1 (2026-08-20):** the card's own **print entrance** (`.card-print`,
per-line choreography — Card Skin Lab №15) plays inside the growing overlay,
replacing takeover_v1's placeholder 26ms region stagger.

## 5. Reduced motion

`prefers-reduced-motion`: no lag (styling tracks scroll exactly), no decode,
no glyph push, glide/grow/close are instant jumps. The ramp itself (static
opacity/weight by position) remains — it's layout, not motion.

## 6. Architecture notes

- **Virtualization path**: geometry is index-based (`rowY = i·ROW_H`, top pad
  is zero under the law) and styling is one real-viewport windowed pass, so
  swapping the row farm to `@tanstack/react-virtual` (as EpisodeList does) is
  mechanical: virtualizer owns translateY, the rAF pass keeps owning
  opacity/weight/tracking/color. Wire it when the real catalog crosses ~500
  (the dev-filler mock is ~200 and clean).
- **DOM ownership**: titles render as ONE opaque HTML string
  (`dangerouslySetInnerHTML`) because the decode churn rewrites those nodes
  directly — letting React reconcile child elements it no longer owns crashes
  with removeChild errors (the search-clear black screen). The rail's
  active-letter class is engine-owned and swept on every list remap.
- The rAF loop **sleeps** when idle (no scroll, no tweens, lag converged) and
  wakes on scroll/tween/resize — never a perpetual loop.
- Letter-spacing and font-weight ramps are paint-level (not compositor); they
  are confined to the coverage window (~30 rows) and were clean in lab use.
  If a device shows jank, they are the first dials to sacrifice.
- The animation queue is mutation-safe (mid-step enqueues survive) — the
  takeover choreography chains tweens from completion callbacks; see the
  Expand Lab v2 bug ("blank box at top") for why this matters.

## 7. Open items

- ~~Keyboard traversal~~ **SHIPPED 2026-08-21 — the field's keyboard suite:**
  ↑/↓ walk the catalog through the focus line with the app-wide hold pacing
  (`src/lib/hold.ts` — same acceleration as the position steppers; `e.repeat`
  ignored, our timer chain owns the hold). Enter opens the focused row
  (rows/buttons keep their native Enter). Works while the search input is
  focused (its ↑/↓ have no vertical meaning); other editables win. ⌘K /
  ctrl K activates search from anywhere. The keycap hint sits **LEFT-ALIGNED
  ON the bar, where the caret will land** (2026-08-21 placement walk:
  off-line right → on-line right → on-line LEFT) — triggering reads as the
  caps dissolving into the typing position. Rendered only while the search
  is empty AND inactive; the formula-width line keeps geometry
  state-invariant. The clear `x` sits at the line's right end while text
  exists. Keycap recipe = **kbd_v4**
  ([src/components/Kbd.tsx](../../src/components/Kbd.tsx) — tonal @ md,
  `gap-1` chord gap; the recipe lives in the component + DESIGN_SYSTEM §3.1,
  never restated here). Esc in search: text → clear + stay active; empty → blur;
  consumed via stopPropagation (layering rule). **Esc from anywhere
  (2026-08-21, the ladder's blurred rung — one press = one rung):** search
  inactive but holding a query → Esc clears it AND activates the search
  (focused, blank — the field un-filters and the ladder re-enters at
  focused+empty, so one more Esc blurs); inactive and empty → Esc stays
  free. An open card still owns Esc first; other editables keep their
  native Esc. ←/→ with a query but focus
  elsewhere recall the search caret and step it one glyph (walking keeps the
  text one arrow away). All page hotkeys defer to an open card
  (`onOpenChange` prop).
- ~~Focus management for the overlay~~ **SHIPPED 2026-08-21, all three
  pieces (WAI-ARIA dialog pattern):** (1) the overlay takes DOM focus on
  open (`tabIndex -1`, programmatic, no ring) — Sean's repro: with the
  search still active, Enter-open left focus in the input and the card's
  global walkers correctly deferred to the editable, so ↑/↓ went dead;
  close restores focus to whoever had it (if still connected), so query
  iteration flows type → Enter → explore → Esc → keep typing. (2) the
  overlay is `role="dialog" aria-modal` with a Tab/Shift+Tab **trap**
  cycling the card's tabbables (the page header above is not inert — the
  trap is what keeps keyboard focus in the modal). (3) the field scroller
  + A–Z rail go **`inert`** while open (attribute-toggled; React 18 has no
  prop) — unfocusable, unclickable, hidden from assistive tech; pointer-
  events dimming alone never closed the keyboard/AT path.
- Content stagger inside the opening card (aesthetic pass).
- Server-side search + virtualization at AniList scale.
- Status filters (airing/finished) as field-level controls — the old homepage
  toggles were removed with the grid; re-introduce inside the field's idiom
  when needed.
- `DEV_FILLER` (~185 placeholder series in mockAnime.ts) comes out when
  AniList lands.
- Page-rhythm tokens for the 96/64 composition spacing, if a second page
  adopts the pattern.
