

## Move expand/collapse indicator to far right with triple-arrow styling

### Changes to `src/components/library/LibraryGroupedView.tsx`

**1. Replace the left-side chevron indicator (lines 375-388)** with a layout that puts the text on the left and a custom triple-arrow on the far right. Use `justify-between` on the row, and render three small carets stacked vertically (for expanded/down) or horizontally (for collapsed/right) with different syntax colors.

**2. Replace the hover overlay expand/collapse button icon (lines 412-418)** with the same triple-arrow component.

**3. Create a `TripleArrow` inline component** that renders three `ChevronDown` or `ChevronRight` icons stacked, each with a different color from the syntax palette:
- Arrow 1: `text-syntax-cyan`
- Arrow 2: `text-syntax-purple`  
- Arrow 3: `text-syntax-pink`

The arrows will be small (`w-2.5 h-2.5`) with tight negative spacing (`-my-1`) to create a compact stacked look.

**Header row layout change** (lines 375-388):
```tsx
<div className="flex items-center justify-between gap-2">
  <div className="overflow-hidden min-w-0 text-sm flex items-center gap-1.5">
    {/* text content only, no chevron */}
    <span className="text-syntax-cyan">reader_name</span>
    <span className="text-muted-foreground">: </span>
    <span className="text-syntax-green break-all">{group.name}</span>
    {seriesEntries.length > 0 && (
      <span className="text-muted-foreground text-xs">({seriesEntries.length})</span>
    )}
  </div>
  <TripleArrow collapsed={collapsedGroups.has(group.name.toLowerCase())} />
</div>
```

### Files modified
- `src/components/library/LibraryGroupedView.tsx`

