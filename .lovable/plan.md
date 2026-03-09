

## Fix: Separate progress line from readers/notes

The issue is that on line 479, everything (ep, vol, ch, readers, notes) is inside a single `flex-row` container. The ep/vol/ch should be inline, but readers and notes should be on separate lines below.

### Change in `src/components/library/SeriesCard.tsx` (lines 479-534)

Split the single `flex` container into:
1. **Line 1** (inline): ep + vol/ch in a `flex items-center gap-4` row (lines 479-505 stay as-is)
2. **Close that div** after the manga/no_manga block (after line 505)
3. **Readers** (lines 506-522): wrap in their own block, stacked below
4. **Notes** (lines 523-533): wrap in their own block, stacked below

Wrap all three in a vertical `flex flex-col gap-1.5 mt-2` container, with the ep/vol/ch row as the first child, readers as second, notes as third.

