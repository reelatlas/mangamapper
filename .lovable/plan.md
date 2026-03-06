

## Plan: Interactive empty state for reader groups

### What changes

Replace the static `series_assigned(null)` card with an interactive one that:
1. On hover, highlights the card border with `border-primary/50` (matching SeriesCard's blue hover)
2. Shows `> add_series` text on hover
3. Clicking triggers `startEditingReader(group)` so the user can add series assignments

### Implementation

**File: `src/components/library/LibraryGroupedView.tsx`** (lines 446-451)

Replace the static div:
```tsx
<div className="border border-dashed rounded-sm py-4 flex items-center justify-center">
  <p className="text-xs text-muted-foreground font-mono">
    <span className="text-muted-foreground/60">// </span>series_assigned(null)
  </p>
</div>
```

With an interactive, hoverable card:
```tsx
<div
  onClick={() => startEditingReader(group)}
  className="group/empty border border-dashed rounded-sm py-4 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
>
  <p className="text-xs text-muted-foreground font-mono">
    <span className="text-muted-foreground/60">// </span>
    <span className="group-hover/empty:hidden">series_assigned(null)</span>
    <span className="hidden group-hover/empty:inline text-primary">{'>'} add_series</span>
  </p>
</div>
```

This toggles between `series_assigned(null)` and `> add_series` on hover, with the blue border highlight, and clicks into the edit reader flow.

