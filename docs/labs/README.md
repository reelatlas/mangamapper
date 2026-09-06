# Theme labs — the aesthetic exploration (2026-09-02)

**An aesthetic and theming exploration**, run in the `theming` worktree while
the main session was mid-wave on the data cycle. The point was to get ideas out
as working prototypes — fast, cheap, and without touching anything that ships —
so they could be judged by using them, then merged back and developed properly
when there's room.

**This is exploration, not implementation.** Nothing here is wired into the
app: no component, route or token in `src/` imports any of it, nothing is
behind a flag, and the app's theming situation is exactly as it was (`:root` is
the dark theme, `.light` is dead code). Deleting this directory changes nothing
that ships.

**See [MERGE.md](MERGE.md)** for the file-by-file manifest — what to keep, what
to delete, and the findings that should outlive the files.

Sources are kept in the repo because the session scratchpad they were authored
in does not survive. The published artifacts are the live versions; these are
what you edit to produce the next one.

## The published labs

All six URLs below are live. (A 2026-09-04 session briefly recorded them as
dead — a transient listing failure, not deleted artifacts. If `action: list`
ever returns nothing, retry before concluding anything is gone, and never
publish a replacement without the retry: doing so creates a duplicate and
orphans the URL these docs point at.)

| artifact | what it is |
|---|---|
| [Theme Lab](https://claude.ai/code/artifact/1dc4f456-f554-4b63-b0e0-3684a6c63d44) | **current** — all FIVE themes over one 343-series fixture (plain added 2026-09-04) |
| [Theme Contract](https://claude.ai/code/artifact/3813655e-ed72-4515-9776-9972c67ddeb3) | the four-layer architecture; 12 variants on one card mock |
| [Atmosphere Lab](https://claude.ai/code/artifact/97aa57fe-2562-42b8-b38f-91308ff25821) | the generation pass — 15 concepts, kept/set-aside marked |
| [Terminal Lab](https://claude.ai/code/artifact/ea224daf-2f6d-4b0d-8c7c-23499ab75fd9) | strip test per terminal variant + colour-vision simulator |
| [Descent](https://claude.ai/code/artifact/b4f21436-78a6-400c-96dd-52aaf158a7e4) | abyss standalone, before consolidation |
| [Tankōbon](https://claude.ai/code/artifact/73673c64-705d-4095-9bba-954637cec44b) | tankōbon standalone, before consolidation |

To update one: edit the file here, then publish it to **the same artifact URL**
(pass the URL as `url`), otherwise a second artifact is created.

## Layout

- `plain-block.js` — the UX-only theme (added 2026-09-04). See below.
- `theme-lab.html` — the consolidated lab. `src/*.js` are inlined into it at
  build time by hand; edit the module then re-inline, or edit in place for
  small changes. The module copies are kept because surgery on an 82KB single
  file is how mistakes happen.
- `src/fixture.js` — the 343-series synthetic catalog. Seeded, reproducible.
  **Fictional titles by choice**: a fixture showing a real work beside invented
  chapter numbers would be a false claim about a real thing.
- `tools/` — the colour work. `striptest.mjs` and `optimize.mjs` predate
  `src/lib/palette.ts` and are superseded by it; `derive.mjs` + `seed.txt`
  reproduce paper theatre's rolled law, `matrices.mjs` derives the
  `feColorMatrix` values for the vision simulator.

## The architecture these labs test

Four layers, settled 2026-09-02:

- **Layer 0 — structure.** Not themeable by anything. Strip geometry, the 2px
  paint floor, clamped indicator ticks, the meta-row baseline strut, focus
  laws, scroll anchoring. Correctness, not taste.
- **Layer 1 — theme.** The interaction model, type, motion, construction.
  Five built: `plain` is a sortable table and nothing else · `terminal` pages a
  buffer · `abyss` falls through a column · `tankobon` turns sheets on a
  right-hand spine · `paper` tracks a stage.
- **Layer 2 — variant.** Colour *and material* — glow, hatch, tone, texture,
  edge. Amended into layer 2 so a variant is a token block and nothing else.
- **Layer 3 — atmosphere.** Toggleable, lazy. **Graphics-off is the design
  target, not the degraded mode**, so the layer carries no information and
  never renders under the card interior, the strip, or the episode list.

Plus a third axis discovered along the way: **view** (layout density), which is
neither theme nor variant — tankōbon's `index` vs `visual` is the same axis as
the app's compact-row vs expanded-card.

## Plain — the control condition (2026-09-04)

Added because four themes all argued about feel and none of them established a
floor. Plain asks one question — *what is the fastest path from 343 rows to the
one number the user came for* — and spends nothing on anything else. It is the
baseline the other four should have to beat, so it is now the lab's default.

**What it does differently, and why each is a UX claim rather than a taste:**

| move | the claim |
|---|---|
| **Read from is a column** | The product question is "where do I pick up the manga". Putting the answer behind a click makes 343 clicks out of one scan. It is the largest and only accented thing in a row. |
| **A real `<table>`** | `scope="col"`, `aria-sort`, sortable headers. A screen reader gets a sorted table; a keyboard gets column sorting for free. |
| **Detail expands in place** | A modal costs the user their position in a 343-row list, which is the one thing browsing depends on. Nothing here opens `#ov`. |
| **The legend is permanent** | Colour is never the only channel carrying type. It costs one row of chrome and removes a memory task. |
| **Filters state their counts** | Each filter carries how many rows it will leave, so a dead end is visible before it is chosen. The four partition the catalog exactly. |
| **Density is a `view`, not a variant** | Comfortable vs compact is the same axis as the app's compact-row vs expanded-card — the third axis, already discovered by tankōbon. |
| **No motion at all** | `transition:none !important` scoped to the theme, by construction rather than by media query. Graphics-off is not a degraded mode here; it is the whole mode. |
| **Three honest answer states** | `ch N` / `—  fully adapted` / `—  no manga source`. `P6`: never a fabricated number, and the census confirms it — 196 / 112 / 35 of 343, every row exactly one. |

**It fixes the hatch bug rather than reproducing it.** The `source_only` tail
gets a 14px minimum painted width, so the honest-gap marker still reads as a
hatch when the gap is one or two chapters — which is the common case (see
"Open" below; the app still has this). Zone is now also *stated* on each
segment (`data-zone`, `data-type`) instead of inferred from a background
string, so the zone-owns-texture rule can be checked mechanically (`P5`).

**Its palettes were derived, not picked.** Nine hand-chosen five-hue sets were
tried first; every one failed, all on the same two collapses — tritan
canon/manga (blue vs teal) and protan canon/anime (blue vs purple). The three
that ship come from `tools/plain-palette.mjs`, which inverts the usual
objective: because plain uses every type colour as label text, the **contrast
floor is a hard constraint** and separation is what the search maximises.

| variant | ground | floor | worst ΔE2000 | vs control |
|---|---|---|---|---|
| light | `#FFFFFF` | 4.5 (AA) | 20.5 | **149%** |
| dark | `#16181C` | 4.5 (AA) | 20.4 | **147%** |
| contrast | `#FFFFFF` | 7.0 (AAA) | 16.6 | **120%** |

All three are candidates in `scripts/design/check-palette.ts`, so the numbers
above are reproducible by the gate rather than by a one-shot.

## Two rulings worth not re-deriving

**Texture belongs to zone, never to type.** The strip encodes two independent
dimensions — hue = episode type, texture + position = zone (`'run' | 'hatch' |
'out'`). The `source_only` hatch changes *behaviour*: in it there are no
episode numbers and a click drives the chapter field. Giving a type a texture
would make a hatched segment sometimes mean "I drive chapters" and sometimes
"I'm filler". One visual variable per dimension; the robust channel goes to the
higher-stakes distinction. This binds all four themes.

**Phosphor ships as a documented deviation.** One hue caps near 50% of the
shipping palette's worst-pair separation no matter how the intensities are
spaced, and its weak pair is canon/mixed under *every* vision type including
normal. Ruled 2026-09-02 to ship anyway as a deliberate monochrome. The
duotone beside it clears the bar at 108% — and the second hue must be **cold**,
because blue↔yellow is the axis dichromats retain. Amber+green scores 56%,
three phosphors 40%: worse than one.

## Open

- The zone-owns-texture rule has no id. By `P29`/`P30` it should be a ledger
  record with an audit class, not a note in a lab README.
- `MappingStrip`'s hatch has a 6px period, so a `source_only` tail narrower
  than ~12px shows fewer than two stripes and reads as flat dim colour — the
  honest-gap marker disappears exactly when the gap is smallest. Unverified
  against real data. **Still open in the app**; plain shows the fix (a minimum
  painted width) but nothing in `src/` has changed.
- Tankōbon's RTL is half-committed: panel order and turn direction are
  right-to-left, text is left-to-right. Authentic to unflipped English
  releases, but it should be a decision rather than an inheritance.
- No theming mechanism exists in the app. `:root` is still the dark theme and
  `.light` is still dead. `next-themes@0.4.6` is already a dependency (sonner
  uses it) and takes arbitrary theme values, so `[data-theme^="terminal-"]`
  gives the theme/variant inheritance in CSS for free.
