

## Change: Move "no series assigned" message outside the reader card

Currently (lines 378-380), when a reader has no series assigned, the message `// no_series_assigned` is rendered inside the card (`bg-card` border-dashed container).

**Plan:**
1. In `LibraryGroupedView.tsx`, remove the `// no_series_assigned` block from inside the card (lines 378-380).
2. Add a new line directly below the card's closing `</div>` (after line 381), outside the card, displaying `series_assigned(null)` in the same muted style used for other labels — matching the `text-xs text-muted-foreground` pattern.

The result: when `seriesEntries.length === 0`, the card shows only the reader name/notes/actions, and below it appears:
```
series_assigned(null)
```

