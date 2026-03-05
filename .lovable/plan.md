

## Plan: Always-visible progress inputs + proper section spacing

**Goal**: Remove the need to click "edit" for progress tracking. The last_watched and last_read inputs should always be visible (like they are in edit mode), while readers remain in view mode with an edit button for assignments.

### Changes to `src/components/CollectionSection.tsx`

**View mode (lines 415-507)** — restructure the `inLibrary` content into three visually separated sections:

1. **Section 1 — Library toggle** (unchanged): `[✓] in_library` button + edit button (edit now only controls reader assignments)

2. **Section 2 — Progress inputs (always editable)**: Replace the read-only progress display (lines 441-472) with the inline input fields from edit mode (lines 298-331), plus a small save button. These inputs auto-save or have a `save` button so users can update ep/vol/ch without entering a full edit mode.
   - `last_watched` with episode number input + `/total`
   - `last_read` with vol + ch inputs (if hasManga), or `anime_original; no_manga` message

3. **Section 3 — Readers** (unchanged view mode): Reader link buttons or `// no_reader_assigned`. The edit button in Row 1 opens edit mode for reader assignments only.

**Spacing**: Change `space-y-3` on the CardContent (line 421) to `space-y-5` to give proper vertical padding between the three sections, matching the spacing feel between sections elsewhere on the page.

**Save behavior**: Add a `saveProgress` function that only saves ep/vol/ch (not reader assignments). Show a small save button next to the inputs that appears when values differ from the stored progress. This keeps it lightweight — no full edit mode needed for progress.

**Edit mode**: Keep existing edit mode but only for reader assignment management. The progress inputs in edit mode can be removed since they're always visible now.

### Summary
- One file modified: `src/components/CollectionSection.tsx`
- Progress inputs always visible when in library (no edit click needed)
- Proper `space-y-5` spacing between library toggle, progress, and readers sections
- Edit button scoped to reader assignment management

