

## Plan

The reader group header currently uses `bg-card` (a slightly lighter dark background), making it visually similar to the series cards below it. The `series_assigned(null)` empty state card has no background — just a transparent dashed border.

### Proposed change

Remove `bg-card` from the reader group header (line 386). This gives it a transparent background with just the dashed border outline, matching the empty state card aesthetic. The header will visually recede compared to the solid `bg-card` series cards beneath it, creating a natural hierarchy where the header frames/labels the group and the cards are the primary content.

### File to modify
- `src/components/library/LibraryGroupedView.tsx` — line 386: remove `bg-card` from the header div's className

This is a one-line class change.

