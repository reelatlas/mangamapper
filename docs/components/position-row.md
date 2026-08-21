# InlinePositionRow — behavioral contract

The card's position instrument ("Q1", chosen 2026-08-19): the totals row and
the lookup are ONE component. The current numbers ARE the inputs; totals stay
static after the `/`. Supersedes the two-channel MapLookup instrument
([map-lookup.md](map-lookup.md)) — the math and most rules carry over; the
channel/pin machinery dissolves.

If the component and this document disagree, one of them is a bug.

```
lib/mapping.ts                solvePosition & friends (unchanged, pure)
hooks/usePositionLookup.ts    driver-field state model
components/StepperInput.tsx   ONE input component, two skins: 'box' | 'inline'
components/InlinePositionRow.tsx   the row (fields + totals + metadata)
components/AnimeCard.tsx      host — wires row ⇄ strip ⇄ episode list
```

## 1. Model

- **Rest = the series' present position** — latest aired ep + its vol/ch
  (from `latestKnown`). Airing or finished, the card always shows real values
  at rest; the strip carries a **dim marker** at the present position.
- **Driver = the last field touched.** No channels, no ⇄ toggle: all three
  fields are always visible. The other fields display **derived** values —
  dimmed **only while a field is focused** (same scope as the width lock):
  the moment focus leaves, every non-null value returns to the normal text
  color, so rest state and strip/list selections read as plain data. Nulls
  (`—`) keep the disabled tone always.
- **No pins.** A filler position is `ep:332` + `vol/ch: —`; a manga_only
  position is `ch:1100` + derived vol + `ep: —`. `—` is the universal null,
  disabled tone (`muted-foreground/60`) — everywhere, including null totals
  (`/—`).
- **Full derivation (2026-08-19):** every non-driver field derives — ch
  fills vol, and vol fills ch with the volume's **first chapter** (where the
  needle sits). The old "vol never fills ch" rule protected a typed ch from
  autofill in the two-box model; in the driver model derived display
  overwrites nothing, so it retired.
- **The key grammar (2026-08-21) — confirm / cancel / reset:**
  - **Enter = confirm = exactly a click-out.** Values commit live via the
    driver model, so confirming just blurs — underline/steppers drop and the
    keys return to the list's global walker.
  - **Esc = UNDO to the pre-focus snapshot** — `beginEdit` captures the
    whole exploration state (driver + raw) when a field gains focus;
    `cancelEdit` restores it. Esc may restore another field's exploration —
    it never jumps to rest. The restore re-enters the normal state pipeline,
    so a restored valid episode re-orients the list/strip (scroll + pulse)
    for free; a rest/null restore moves nothing. Two guards, both required:
    the input **stops Esc's propagation** (the card's window-level
    Esc-to-close must not also fire — next Esc, with focus free, closes as
    usual), and an intent flag (`escapingRef`) keeps the blur handler's
    empty-field reset from stomping the restore (Esc blurs synchronously,
    before state flushes).
  - **`// reset()`** stays the one explicit full return to the present
    position — exploring never destroys anything. The reset link appears
    only while exploring; rest shows no metadata.
- **Metadata sits IN the row**, right of the fields (third column,
  baseline-aligned via a hidden label). **No type tag** (removed 2026-08-19
  — the strip zone under the needle, the selected list row, and the `—`
  values already carry it): just `// reset()`, plus `// out_of_range
  (bounds)` when applicable.

## 2. Field chrome (the `inline` StepperInput skin)

- At rest a field reads as **pure data** — no box, no underline.
- Hover → dashed muted underline. Focus → the **same dashed underline**
  (never solid, never primary; the caret + steppers + color shifts carry the
  active state). Caret is `currentColor`. **No select-all on focus** — the
  caret lands where clicked.
- Steppers (▲▼) occupy **zero space until the field is focused** (Q1).
- All hardened behaviors, shared with the box skin by construction:
  ↑/↓ ± shift×10 (native key-repeat on hold), stepper hold-to-repeat (the
  app-wide pacing token `src/lib/hold.ts`: 400ms → 130 → 80 → 40ms — shared
  with the catalog's keyboard walking, never forked per surface),
  wheel-when-focused (non-passive), blur never clears an explored value
  (blur with an *emptied* field resets; suppressed when Esc-undo owns the
  blur), stepper press focuses the field. Totals (`/110`) render at full
  foreground (visibility trial 2026-08-21 — supersedes the interior_v1
  denominator dim at `text-foreground/40`); the ` · ` separator keeps the
  dim `/40` punctuation tone.

## 3. Width lock (focus-only)

While a field is **focused**, all three fields freeze at their series-max
digit widths (digits of aired / totalVolumes / totalChapters) — nothing
shifts under the cursor while typing, stepping, or holding, including a
derived neighbor springing from `—` to 4 digits. Blur returns every field to
its tight hug immediately. Strip clicks and blurred exploring keep the hug —
shifts are only a problem inside an input.

## 4. Stepping

- A field showing a number steps from it (derived values included), clamped
  to `fieldMin`/`fieldMax` (source scope: a sequel's ch/vol floor is its
  scope start). Typing beyond bounds stays allowed → `// out_of_range`.
- A field showing `—` **seeds** from the position context, only in the
  pressed direction (directional integrity — no valid value that way →
  no-op, never reverse):
  - manga_only position: `ep ↓` → last aired; `ep ↑` → no-op; ch/vol step
    from the position's own chapter.
  - filler position: ch/vol seed from the nearest canon episode in the
    pressed direction.

## 5. Strip + episode list sync

- **Strip clicks — one rule:** aired zone → `ep` drives (filler included;
  ep is a real value there); hatch → `ch` drives (`unitToChapter`). Ghost
  needle on hover; bright needle while exploring; dim marker at rest;
  projection positions dim; out-of-range pegs at the strip's end.
- **Episode-list rows and j/k** route through `selectEpisode(ep)` — the ep
  field drives, exact by construction (the old vol.ch-mode ±1 drift class no
  longer exists for row clicks). Selection/scroll/pulse behavior:
  [episode-list.md](episode-list.md) §6.
- The strip's minimap band is untouched by all of this.

## 6. Per-series capability

- Manga source + confirmed mapping → all three fields editable.
- Anime-original (or mapping-pending) series → **only ep is editable**;
  vol/ch render static (`—` / `// mapping_pending`). The strip, episode
  list, and ep field remain a full instrument.
