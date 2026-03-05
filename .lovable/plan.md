

## Plan

The card already has `onClick={() => toggleGroup(...)}` on the outer div, and hover overlay buttons use `stopPropagation()`, so clicking anywhere non-interactive already triggers expand/collapse. No change needed there.

For justifying the expand/collapse affordance (count badge + TripleArrow) to the far right, the current layout has it inside a `justify-between` flex row alongside the reader name. It's already right-aligned, but it's within the same content wrapper. To push it further right and visually separate it:

### Change: `src/components/library/LibraryGroupedView.tsx` (~line 388-400)

Restructure the header card's inner layout to use a top-level flex row that places the content (reader name, notes) on the left and the expand/collapse affordance (count + TripleArrow) on the far right as a separate column, outside the content wrapper:

```tsx
<div className="flex items-center gap-4">
  {/* Left: content */}
  <div className="space-y-1 flex-1 min-w-0">
    <div className="overflow-hidden min-w-0 text-sm flex items-center gap-1.5">
      <span className="text-syntax-cyan">reader_name</span>
      <span className="text-muted-foreground">: </span>
      <span className="text-syntax-green break-all">{group.name}</span>
    </div>
    {group.notes && (
      <div className="text-xs overflow-hidden">
        <span className="text-syntax-cyan">notes</span>
        <span className="text-muted-foreground">: </span>
        <span className="text-muted-foreground break-all">{group.notes}</span>
      </div>
    )}
  </div>
  {/* Right: expand/collapse affordance */}
  <div className="flex items-center gap-2 flex-shrink-0">
    <span className="text-muted-foreground text-sm">({seriesEntries.length})</span>
    <TripleArrow collapsed={collapsedGroups.has(group.name.toLowerCase())} />
  </div>
</div>
```

This moves the TripleArrow + count badge outside the inner `space-y-1` content wrapper and into its own column at the far right of the card, creating clear visual separation.

