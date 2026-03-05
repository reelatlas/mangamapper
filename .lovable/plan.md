

## Move series count to left of triple-arrow, match text size

### Change in `src/components/library/LibraryGroupedView.tsx` (lines 386-396)

Move the `({seriesEntries.length})` span out of the left text group and place it immediately before the `TripleArrow`, changing its size from `text-xs` to `text-sm` to match the reader name text.

```tsx
<div className="flex items-center justify-between gap-2">
  <div className="overflow-hidden min-w-0 text-sm flex items-center gap-1.5">
    <span className="text-syntax-cyan">reader_name</span>
    <span className="text-muted-foreground">: </span>
    <span className="text-syntax-green break-all">{group.name}</span>
  </div>
  <div className="flex items-center gap-2 flex-shrink-0">
    {seriesEntries.length > 0 && (
      <span className="text-muted-foreground text-sm">({seriesEntries.length})</span>
    )}
    <TripleArrow collapsed={collapsedGroups.has(group.name.toLowerCase())} />
  </div>
</div>
```

### File modified
- `src/components/library/LibraryGroupedView.tsx`

