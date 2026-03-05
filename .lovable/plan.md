

## Plan: Tighten form spacing and remove optional labels

### 1. Remove "// optional" labels

**NewSeriesForm.tsx:**
- Line 172: Remove `<span className="text-muted-foreground"> // optional</span>` from reader label
- Line 241: Remove `<span className="text-muted-foreground"> // optional</span>` from notes label

**NewReaderForm.tsx:**
- Lines 139-140: Remove `<span className="text-muted-foreground"> // optional</span>` from notes label

**LibraryGroupedView.tsx:**
- Lines 283-284: Remove `<span className="text-muted-foreground"> // optional</span>` from notes label in edit reader

**Readers.tsx:**
- Lines 478-479: Remove `<span className="text-muted-foreground"> // optional</span>` from notes in new reader
- Lines 583-584: Remove same from notes in edit reader

### 2. Decrease horizontal padding between fields

The side-by-side field grids (reader_name + reader_url) use `gap-4`. Change to `gap-3`.

- **NewReaderForm.tsx** line 123: `gap-4` → `gap-3`
- **NewSeriesForm.tsx** line 150 (series + trash button): already `gap-2`, fine. Line 174 (reader + trash): already `gap-2`, fine.
- **LibraryGroupedView.tsx** line 271: `gap-4` → `gap-3`
- **Readers.tsx** line 462: `gap-4` → `gap-3` (new reader), line 567: `gap-4` → `gap-3` (edit reader)

Also the assign_to grids use `gap-4` — change those to `gap-3` too:
- **NewReaderForm.tsx** line 154: `gap-4` → `gap-3`
- **LibraryGroupedView.tsx** line 297: `gap-4` → `gap-3`
- **Readers.tsx** lines 494, 599: `gap-4` → `gap-3`

### 3. Decrease label-to-field vertical spacing

Currently main fields use `space-y-2` (0.5rem) between label and input. The assign_to section uses `mb-1.5` (0.375rem) on labels. Change all `space-y-2` field wrappers to `space-y-1.5` to match the assign_to pattern.

**NewSeriesForm.tsx:** lines 146, 169, 223, 238: `space-y-2` → `space-y-1.5`
**NewReaderForm.tsx:** lines 124, 130, 137, 149: `space-y-2` → `space-y-1.5`
**LibraryGroupedView.tsx:** lines 272, 276, 281, 292: `space-y-2` → `space-y-1.5`
**Readers.tsx:** lines 463, 469, 476, 488, 568, 574, 581, 593: `space-y-2` → `space-y-1.5`

### 4. Decrease vertical spacing between fields, keep major section gaps

Change form `space-y-4` to `space-y-3` for tighter field-to-field spacing. The `!mt-8` on assign_to and footer buttons remains untouched.

- **NewSeriesForm.tsx** line 145: `space-y-4` → `space-y-3`
- **NewReaderForm.tsx** line 122: `space-y-4` → `space-y-3`
- **LibraryGroupedView.tsx** line 270: `space-y-4` → `space-y-3`
- **Readers.tsx** line 461: `space-y-4` → `space-y-3` (new reader), line 566: `space-y-4` → `space-y-3` (edit reader)

