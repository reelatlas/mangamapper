

## Match count input heights to standard input height

The number inputs for last_watched (episode) and last_read (vol, ch) use `h-7` (28px), while the standard `Input` component uses `h-10` (40px). Change all six instances from `h-7` to `h-10`.

### Files to edit

**`src/components/CollectionSection.tsx`** — 3 inputs (lines 593, 608, 612):
- Change `h-7` → `h-10` in the className of each Input

**`src/components/library/SeriesCard.tsx`** — 3 inputs (lines 308, 332, 342):
- Change `h-7` → `h-10` in the className of each Input

