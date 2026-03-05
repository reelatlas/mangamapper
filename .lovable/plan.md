

## Plan: Rearrange action buttons across all forms

### Current layout (all forms)
Confirm/save is on the left, cancel is to its right. Delete buttons (where present) are on the far right. Builder `+ add_another` buttons are left-aligned.

### Target layout
- **Confirm/save**: far right
- **Cancel**: immediately left of confirm/save
- **Delete** (where present): far left
- **+ add_another** (in builders): far right

### Changes

**1. `NewSeriesForm.tsx`** (line 249)
Change `flex gap-2` to `flex gap-2 justify-end` — swap button order so cancel comes first, then submit.

**2. `InlineNewReaderForm.tsx`** (line 101)
Same pattern: `flex gap-2 justify-end`, swap button order (cancel first, then add_reader).

**3. `NewReaderForm.tsx`** (lines 172, 178)
- Line 172: `+ add_another` button — wrap in a `flex justify-end` or add `ml-auto`
- Line 178: `flex gap-2 justify-end`, swap button order

**4. `SeriesCard.tsx` (edit_series)** (lines 384, 392-416)
- Line 384: `+ add_another` button — add `ml-auto` to right-align
- Lines 392-416: Restructure the action row — delete_series stays far left, cancel + save move to far right (swap order within right group)

**5. `LibraryGroupedView.tsx` (edit_reader)** (lines 347, 352-374)
- Line 347: `+ add_another` button — add `ml-auto` to right-align
- Lines 352-374: Restructure — delete_reader stays far left (already is), swap save+cancel order in the right group so cancel is left of save

