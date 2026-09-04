# Merge manifest — branch `theming` (2026-09-02, amended 2026-09-04)

## What this branch was for

**An aesthetic and theming exploration, run in an isolated worktree while the
main session was mid-wave on the data cycle.** The goal was to get ideas *out*
— fast, cheap, and without touching anything that ships — so they could be
judged as working things rather than described, then merged back and developed
properly when there's room for it.

So this is deliberately **exploration, not implementation**:

- **Nothing in `src/` was changed to support themes.** No provider, no token
  restructure, no route. `:root` is still the dark theme and `.light` is still
  dead code, exactly as they were.
- **The four themes exist only as prototypes.** They are not behind a flag,
  they are not half-wired, they are not waiting on a switch. They are labs.
- **One piece of real, tested code came out of it** — the palette validator —
  because a question kept recurring and deserved a mechanical answer.
- **The findings are the actual product.** Four themes' worth of interaction
  design, a colour bar that killed three palettes, and two rulings that
  constrain all future theming work. Those are listed below and should outlive
  the files.

Merging this does not start anything. It parks the exploration somewhere
findable, with the reusable part promoted to real code, so picking the theming
work back up later starts from evidence instead of from memory.

---

Everything this branch adds, what it costs, and what breaks if you delete it.
Written so the merge decision is a five-minute read rather than archaeology.

**The whole branch is additive: 25 files, ~7,600 insertions, 0 deletions.**
Two pre-existing files are touched: `tsconfig.scripts.json` by one line, and
`scripts/design/check-palette.ts` by three added candidate palettes.

Verify before merging:

```bash
git diff --stat main...theming        # expect 0 deletions
git diff main:tsconfig.scripts.json theming:tsconfig.scripts.json
```

---

## Three tiers

### Tier 1 — keep. This is the actual work.

| file | lines | live? | what it is |
|---|---|---|---|
| `src/lib/palette.ts` | 307 | typechecked + linted, **0 bytes shipped** | Pure colour math. HSL/hex, WCAG contrast, Viénot–Brettel–Mollon dichromat simulation, ΔE76 + CIEDE2000, `judgePalette()`. |
| `src/lib/palette.test.ts` | 206 | **+25 tests** in `npm test` | Conversions, contrast, CVD, ΔE, scoring. One test **locks the control bar**. |
| `scripts/design/check-palette.ts` | 205 | runs only when invoked | The gate. Reads the live `--type-*` tokens out of `src/index.css` (`P5`). Now also carries plain's three derived palettes as candidates, so their scores are reproducible. |
| `tsconfig.scripts.json` | +1 | — | Adds `src/lib/palette.ts` to the scripts project's include list. |

**Cost if kept:** 25 tests (~10ms), one line of config, nothing in the bundle.
Nothing in `src/` imports `palette.ts`, so Vite tree-shakes it out entirely —
verified with a grep, not assumed.

**What it buys:** a mechanical answer to "can five episode types be told apart
on an 18px strip, for everyone." That question came up three times this session
and was re-argued from scratch each time. It's now `npx tsx
scripts/design/check-palette.ts`.

**If you delete Tier 1**, delete all four together — `check-palette.ts` imports
`palette.ts`, and the tsconfig line exists only for that import. Leaving the
line behind with the file gone breaks `tsc -b`.

**Worth doing after merge:** add `check-palette` to the `P27` gate list in
CLAUDE.md, so a `--type-*` retune that breaks a pair fails before commit rather
than in the lab.

### Tier 2 — keep while theming is live, delete when it ships.

| file | lines | what it is |
|---|---|---|
| `docs/labs/theme-lab.html` | 2,050 | The current lab. All five themes over 343 series; `plain` is the default. |
| `docs/labs/src/*.js` | 1,350 | The theme modules, inlined into the HTML by hand — including `plain-block.js`, the UX-only control theme. |
| `docs/labs/tools/plain-palette.mjs` | 120 | Derives plain's three palettes under a hard contrast floor. **Keep** — it is the only record of how they were found, and it re-runs. |
| `docs/labs/README.md` | 90 | Architecture, rulings, artifact URLs. |
| `docs/labs/MERGE.md` | — | This file. |

The module copies exist because editing an 82KB single file is how mistakes
happen. Edit `src/themes.js` etc., then re-inline.

### Tier 3 — delete freely. Superseded or one-shot.

| file | why it can go |
|---|---|
| `docs/labs/atmosphere-lab.html` | The generation pass. Historical; the artifact is live. |
| `docs/labs/theme-contract.html` | Architecture doc. Its content is summarised in README.md. |
| `docs/labs/terminal-lab.html` | Superseded by `theme-lab.html`. |
| `docs/labs/descent.html` | Superseded — abyss standalone. |
| `docs/labs/tankobon.html` | Superseded — tankōbon standalone. |
| `docs/labs/tools/striptest.mjs` | Superseded by `src/lib/palette.ts`. |
| `docs/labs/tools/optimize.mjs` | One-shot: re-derived blueprint + daylight. |
| `docs/labs/tools/tune.mjs` | One-shot: fixed paper theatre's hue collisions. |
| `docs/labs/tools/matrices.mjs` | One-shot: derived the `feColorMatrix` values. |
| `docs/labs/tools/duotone.ts` | One-shot: found the cold-second-hue result. |
| `docs/labs/tools/derive.mjs` + `seed.txt` | **Keep if paper theatre ships** — they reproduce its rolled law. Otherwise delete. |

All of `docs/` is invisible to every gate (verified below), so deleting any of
it breaks nothing.

---

## Verified: `docs/labs/` is inert

| gate | reaches `docs/`? |
|---|---|
| `tsc -b` app project | no — `include: ["src"]` |
| `tsc -b` scripts project | no — `scripts`, `supabase/functions/_src`, 4 named `src` files |
| `vite build` | no — single entry `index.html`, no `rollupOptions.input` |
| `vitest` | no — `src/**/*.test.*` + `scripts/ingest/lib/**` |
| `eslint .` | no — 214 warnings before and after, unchanged |

Nothing renders it, bundles it, typechecks it or lints it. **Deleting
`docs/labs/` entirely leaves a green tree.**

---

## Findings that must outlive the files

These cost real work to establish. If `docs/labs/` is deleted they are lost, so
they belong in `DESIGN_SYSTEM.md` or the ledger — not here.

**1. Texture encodes ZONE, never type.** The strip carries two independent
dimensions: hue = episode type, texture + position = zone
(`'run' | 'hatch' | 'out'`, `src/lib/mapping.ts:359`). `source_only` is not a
sixth type — it is the region where the episode axis stops existing, and a
click there drives the chapter field instead of the episode field
(`usePositionLookup.ts:56`). Giving a type a texture makes a hatched segment
mean two things and stops it predicting what a click does.
*Rule: one visual variable per dimension; the robust channel (texture survives
greyscale and every dichromacy) goes to the higher-stakes distinction — zone
changes behaviour, type only changes a label.* This binds every theme.
**Has no rule id. By `P29`/`P30` it should have one, plus an audit class.**

**2. Phosphor ships as a documented deviation.** One hue caps near **50%** of
the shipping palette's worst-pair separation however the intensities are
spaced, and its weak pair is canon/mixed under *every* vision type including
normal. Ruled 2026-09-02 to ship anyway as a deliberate monochrome. Recorded in
`check-palette.ts` as a `deviation` field so the number still prints every run
— a cost accepted in the open, not a check switched off.

**3. A near-monochrome's second hue must be COLD.** Amber + P1 green scores
**56%** (barely better than mono — amber↔green *is* the protan/deutan confusion
axis). Amber + cold blue-white scores **108%**. Three phosphors score **40%**,
worse than one. Blue↔yellow is the axis dichromats retain. Generalises to any
future near-monochrome variant.

**4. The bar is relative, not absolute.** `DESIGN_SYSTEM.md` records a worst
CVD ΔE of 9.6 for `syntax_v1`. That number is **not reproducible** by the
method in `palette.ts` — CIE76 puts the control at 19.9, CIEDE2000 at 13.8.
Their pipeline differed (probably a different CVD model or severity). So
`judgePalette()` scores candidates as a *percentage of the shipping palette's
own worst pair*, which stays valid whichever metric you prefer.
**Do not use 9.6 as a threshold.**

**5. Possible live bug, unverified.** `MANGA_ONLY_BACKGROUND` in
`MappingStrip.tsx` has a 6px hatch period, so any `source_only` span narrower
than ~12px shows fewer than two stripes and reads as flat dim colour. The
zone marker degrades exactly when the tail is shortest — and a series running
one or two chapters ahead of its adaptation is the common case. Worth checking
against real data; the fix would be a minimum painted width for the tail.

---

**6. A UX-only control changes what the other themes have to justify.**
`plain` (2026-09-04) is a sortable table, three honest answer states, an
always-on legend, in-place expansion and no motion. Two things came out of
building it that are not about plain:

- **The type palette is a text palette too.** Once colours label rather than
  only fill, the contrast floor becomes a hard constraint and separation
  becomes the objective under it. Nine hand-picked sets failed; the search
  under that constraint cleared the control bar three times over (149 / 147 /
  120%). *Any* future light theme inherits this — hand-picking five hues that
  are both legible on white and CVD-separable does not work.
- **Zone should be stated, not inferred.** Plain writes `data-zone` /
  `data-type` on every strip segment. That makes the zone-owns-texture rule
  mechanically checkable instead of a CSS-string grep — which is exactly the
  `P29`/`P30` direction of travel for the rule that still has no id.

## Not done, and deliberately so

**No theming mechanism exists in the app.** `:root` is still the dark theme,
`.light` is still dead code, and nothing in `src/` was changed to support
themes. Every theme lives in a lab. When you build it:

- `next-themes@0.4.6` is **already a dependency** (sonner's Toaster uses it),
  takes arbitrary theme values, and handles persistence.
- Flattening theme+variant onto one axis gives the inheritance free in CSS:
  `[data-theme^="terminal-"]` for layer 1, `[data-theme="terminal-phosphor"]`
  for layer 2.
- The riskiest part is restructuring `src/index.css`, and `check-palette.ts`
  already guards it — it reads those tokens live and fails if a pair collapses.
