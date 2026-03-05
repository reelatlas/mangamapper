

## Plan

The expand/collapse text in the hover overlays should match the style of the old button content — specifically, include the `TripleArrow` component before the text, and use `text-foreground` (whiter) instead of `text-muted-foreground`.

### Changes in `src/components/library/LibraryGroupedView.tsx`

**Line 440-442** — Reader group hover overlay expand/collapse:
```tsx
<div className="flex items-center gap-1 font-mono text-xs text-foreground px-3">
  <TripleArrow collapsed={collapsedGroups.has(group.name.toLowerCase())} compact />
  {collapsedGroups.has(group.name.toLowerCase()) ? 'expand' : 'collapse'}
</div>
```

**Line 496-498** — Unassigned series hover overlay expand/collapse:
```tsx
<div className="flex items-center gap-1 font-mono text-xs text-foreground px-3">
  <TripleArrow collapsed={collapsedGroups.has('unassigned')} compact />
  {collapsedGroups.has('unassigned') ? 'expand' : 'collapse'}
</div>
```

Both changes: swap `span` → `div` with flex layout, add `TripleArrow` with `compact` prop, change `text-muted-foreground` → `text-foreground`.

