

## Plan

Two concerns to address:

### 1. Match SeriesCombobox trigger styling to SelectTrigger

The SeriesCombobox trigger (a `Button`) has different styling than the `SelectTrigger` used for reader selection. Key differences:

**SeriesCombobox (current):**
- Uses `Button variant="outline"` with custom classes
- `h-10` from button defaults, but text color differs
- Chevron has `opacity-50` and `ml-2`
- Placeholder text uses `text-muted-foreground` but selected text has no special class

**SelectTrigger (reader dropdown):**
- Uses Radix SelectTrigger with `h-10`, standard input styling
- Has `data-[placeholder]:text-muted-foreground` on the trigger
- Chevron is rendered by `SelectPrimitive.Icon` with `opacity-50`
- Text uses `[&>span]:line-clamp-1`

**Changes to `SeriesCombobox.tsx`:**
- Match the trigger to look identical to `SelectTrigger`: same height, padding, border style, text alignment, and chevron positioning
- Ensure placeholder text color matches (`text-muted-foreground`)
- Ensure selected value text color matches (default foreground, not muted)
- Chevron should match: same size, same opacity, same positioning as SelectTrigger's icon

Specifically, update the Button className to align with `SelectTrigger`'s look: `h-10 px-3 py-2 text-sm` base sizing, and ensure the chevron is wrapped similarly as an icon on the right.

### 2. Remove trailing dots from placeholder text

Remove the `...` suffix from all zero-state/placeholder text across these components:

- **`SeriesCombobox.tsx`**: default placeholder `"search series..."` → `"search series"`, command input `"type to search..."` → `"type to search"`
- **`NewSeriesForm.tsx`**: placeholder passed to SeriesCombobox `"search series..."` → `"search series"`, SelectValue `"select reader..."` → `"select reader"`
- **`SeriesCard.tsx`**: SelectValue `"select reader..."` → `"select reader"`

These are the dropdown zero-state placeholders only. Other input field placeholders like `"manga.line.me/title/..."` are content hints, not zero-state text, so they stay as-is.

### Files to modify
1. `src/components/SeriesCombobox.tsx` — trigger styling + placeholder dots
2. `src/components/library/NewSeriesForm.tsx` — placeholder dots
3. `src/components/library/SeriesCard.tsx` — placeholder dots

