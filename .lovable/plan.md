

## Plan: Increase spacing for footer buttons and assign_to sections

### 1. More padding above footer buttons (all three flows)

Change `mt-4` to `mt-8` on the button container divs to create more visual separation from content above.

**Files & lines:**
- `src/components/library/NewSeriesForm.tsx` line 251: `mt-4` → `mt-8`
- `src/components/library/NewReaderForm.tsx` line 179: add `mt-8` to the `flex gap-2` div → `flex gap-2 mt-8`
- `src/components/library/LibraryGroupedView.tsx` line 321: `mt-4` → `mt-8`
- `src/pages/Readers.tsx` line 523: add `mt-8` to the `flex gap-2` div → `flex gap-2 mt-8`
- `src/pages/Readers.tsx` line 628: `mt-4` → `mt-8`

### 2. More padding above assign_to section (new/edit reader flows)

Change `mt-4` to `mt-8` on the assign_to wrapper divs.

**Files & lines:**
- `src/components/library/NewReaderForm.tsx` line 145: `mt-4` → `mt-8`
- `src/components/library/LibraryGroupedView.tsx` line 288: `mt-4` → `mt-8`
- `src/pages/Readers.tsx` line 485: `mt-4` → `mt-8`
- `src/pages/Readers.tsx` line 590: `mt-4` → `mt-8`

Nine single-class changes across four files.

