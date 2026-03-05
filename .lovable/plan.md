

## Plan: Three layout adjustments

### 1. Remove divider line above action buttons in edit_reader flows

Remove `border-t border-dashed pt-4 mt-4` from the div wrapping the save/cancel/delete buttons, replace with just `mt-4 flex flex-wrap ...`.

**Files & lines:**
- `src/components/library/LibraryGroupedView.tsx` line 324: `border-t border-dashed pt-4 mt-4` → `mt-4`
- `src/pages/Readers.tsx` line 634: same change

### 2. Remove divider line above action buttons in new_series flow

- `src/components/library/NewSeriesForm.tsx` line 251: remove the `<div className="border-t border-dashed pt-4 mt-4" />` entirely

### 3. Un-box the assign_to section in new/edit reader flows

Currently the assign_to section is wrapped in `<div className="border border-dashed mt-4">` with a `terminal-header` and `<div className="p-4 ...">` for content. Change to:
- Replace the outer `border border-dashed` box with just a `mt-4` spacer div (no border)
- Replace the `terminal-header` with a simple label: `<p className="text-xs text-muted-foreground mb-3">assign_to <span className="text-muted-foreground/60">// optional</span></p>`
- Remove the `p-4` wrapper so content aligns with fields above, keep `space-y-6 sm:space-y-3`

**Files & lines:**
- `src/components/library/NewReaderForm.tsx` lines 145-150, 179-180
- `src/components/library/LibraryGroupedView.tsx` lines 288-293, 322-323
- `src/pages/Readers.tsx` lines 485-490, 523-524 (new reader) and lines 593-598, 631-632 (edit reader)

Four occurrences across three files, same transformation each.

