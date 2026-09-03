# Theme labs — the aesthetic exploration (2026-09-02)

Sources for the theming exploration, kept in the repo because the session
scratchpad they were authored in does not survive. The published artifacts
are the live versions; these are what you edit to produce the next one.

**Nothing here is wired into the app.** No component, route or token in
`src/` imports any of it. Deleting this directory changes nothing that ships.

## The published labs

| artifact | what it is |
|---|---|
| [Theme Lab](https://claude.ai/code/artifact/1dc4f456-f554-4b63-b0e0-3684a6c63d44) | **current** — all four themes over one 343-series fixture |
| [Theme Contract](https://claude.ai/code/artifact/3813655e-ed72-4515-9776-9972c67ddeb3) | the four-layer architecture; 12 variants on one card mock |
| [Atmosphere Lab](https://claude.ai/code/artifact/97aa57fe-2562-42b8-b38f-91308ff25821) | the generation pass — 15 concepts, kept/set-aside marked |
| [Terminal Lab](https://claude.ai/code/artifact/ea224daf-2f6d-4b0d-8c7c-23499ab75fd9) | strip test per terminal variant + colour-vision simulator |
| [Descent](https://claude.ai/code/artifact/b4f21436-78a6-400c-96dd-52aaf158a7e4) | abyss standalone, before consolidation |
| [Tankōbon](https://claude.ai/code/artifact/73673c64-705d-4095-9bba-954637cec44b) | tankōbon standalone, before consolidation |

To update one: edit the file here, then publish it to **the same artifact URL**
(pass the URL as `url`), otherwise a second artifact is created.

## Layout

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
  Four built: `terminal` pages a buffer · `abyss` falls through a column ·
  `tankobon` turns sheets on a right-hand spine · `paper` tracks a stage.
- **Layer 2 — variant.** Colour *and material* — glow, hatch, tone, texture,
  edge. Amended into layer 2 so a variant is a token block and nothing else.
- **Layer 3 — atmosphere.** Toggleable, lazy. **Graphics-off is the design
  target, not the degraded mode**, so the layer carries no information and
  never renders under the card interior, the strip, or the episode list.

Plus a third axis discovered along the way: **view** (layout density), which is
neither theme nor variant — tankōbon's `index` vs `visual` is the same axis as
the app's compact-row vs expanded-card.

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
  against real data.
- Tankōbon's RTL is half-committed: panel order and turn direction are
  right-to-left, text is left-to-right. Authentic to unflipped English
  releases, but it should be a decision rather than an inheritance.
- No theming mechanism exists in the app. `:root` is still the dark theme and
  `.light` is still dead. `next-themes@0.4.6` is already a dependency (sonner
  uses it) and takes arbitrary theme values, so `[data-theme^="terminal-"]`
  gives the theme/variant inheritance in CSS for free.
