

## Plan: Reorganize episode list header

Move the "episodes shown" info and the legend into a single row below the terminal header, with the count on the left and the legend on the right.

**Changes in `src/pages/AnimeDetail.tsx`:**

1. Remove the bottom "showing X of Y episodes" block (lines 187-195)
2. Replace the current legend block (lines 159-175) with a single flex row:
   - **Left side:** `// episodes_shown > {count} of {total}` (always visible, using `text-syntax-cyan` for `//`)
   - **Right side:** The existing legend badges, aligned right with `ml-auto`
3. Both sit in one `flex items-center justify-between` container below the terminal header

