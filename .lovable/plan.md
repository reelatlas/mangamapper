

## Update empty states for grouped and flat library views

### Grouped by Reader empty state (`LibraryGroupedView.tsx`, lines 253-267)

Replace the eye icons and single-line message with two lines of text, each with an independent hover action:

```tsx
<div className="text-center py-16 border border-dashed">
  <div className="group/series cursor-pointer mb-1" onClick={onNewSeries}>
    <p className="text-muted-foreground text-sm font-mono">
      <span>// series_assigned(null);</span>
      <span className="hidden group-hover/series:inline text-primary ml-2">{'>'} new_series</span>
    </p>
  </div>
  <div className="group/reader cursor-pointer" onClick={onNewReader}>
    <p className="text-muted-foreground text-sm font-mono">
      <span>// reader_assigned(null)</span>
      <span className="hidden group-hover/reader:inline text-primary ml-2">{'>'} new_reader</span>
    </p>
  </div>
</div>
```

This requires threading callback props (`onNewSeries`, `onNewReader`) from the Library page into `LibraryGroupedView`. The Library page will set `showNewSeries(true)` or `showNewReader(true)` respectively.

### Flat view empty state (`LibraryFlatView.tsx`, lines 61-75)

Replace the book icon and multi-line message with a single interactive line:

```tsx
<div className="text-center py-16 border border-dashed">
  <div className="group/lib cursor-pointer" onClick={onNewSeries}>
    <p className="text-muted-foreground text-sm font-mono">
      <span>// library(empty)</span>
      <span className="hidden group-hover/lib:inline text-primary ml-2">{'>'} new_series</span>
    </p>
  </div>
</div>
```

This requires adding an `onNewSeries` callback prop to `LibraryFlatView`, passed from the Library page.

### Files changed

1. **`src/components/library/LibraryGroupedView.tsx`** -- Add `onNewSeries` and `onNewReader` props to interface; replace empty state block (lines 253-267)
2. **`src/components/library/LibraryFlatView.tsx`** -- Add `onNewSeries` prop to interface; replace empty state block (lines 61-75); remove unused `BookDashed`/`BookOpenText` imports
3. **`src/pages/Library.tsx`** -- Pass `onNewSeries={() => setShowNewSeries(true)}` and `onNewReader={() => setShowNewReader(true)}` to both view components

