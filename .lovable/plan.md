

## Plan

Two changes to the hover overlay on reader group headers:

### 1. Move expand/collapse button to the far right

In the hover overlay (line 422-444), restructure the flex layout so the expand/collapse button is pushed to the far right, separated from the other action buttons. Change the overlay container to `justify-between`, put `open_reader`, `edit`, and `delete` in a left group, and the expand/collapse button alone on the right.

### 2. Click-anywhere-to-toggle already works, but the overlay blocks it

The parent `div` (line 387) already has `onClick={() => toggleGroup(...)}`. The hover overlay (line 422) has `onClick={e => e.stopPropagation()}` which blocks clicks from reaching the parent. 

Change: Remove `stopPropagation` from the hover overlay wrapper, and instead add `stopPropagation` only to the individual action buttons/links that should NOT trigger expand/collapse. This way, clicking empty space in the overlay still bubbles up to the parent's toggle handler.

### File: `src/components/library/LibraryGroupedView.tsx`

**Lines 422-444** — Restructure the hover overlay:

```tsx
<div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3 z-10">
  <div className="flex items-center">
    <div className="flex items-center gap-1 px-3">
      <Button variant="ghost" size="sm" asChild className="font-mono text-xs gap-1" onClick={e => e.stopPropagation()}>
        <a href={group.url} target="_blank" rel="noopener noreferrer">
          <Glasses className="w-3 h-3" />open_reader
        </a>
      </Button>
    </div>
    <div className="flex items-center gap-1 pl-3">
      <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); startEditingReader(group); }} className="font-mono text-xs gap-1">
        <Pencil className="w-3 h-3" />edit
      </Button>
      <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setConfirmingDeleteReaderView(group.name); }} className="font-mono text-xs gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
        <Trash2 className="w-3 h-3" />delete
      </Button>
    </div>
  </div>
  <div className="flex items-center gap-1 px-3">
    <Button variant="ghost" size="sm" onClick={() => toggleGroup(group.name.toLowerCase())} className="font-mono text-xs gap-1">
      <TripleArrow collapsed={collapsedGroups.has(group.name.toLowerCase())} compact />
      {collapsedGroups.has(group.name.toLowerCase()) ? 'expand' : 'collapse'}
    </Button>
  </div>
</div>
```

Also update the confirm-delete overlay (line 412) to add `stopPropagation` on its buttons individually instead of on the wrapper, so clicking empty space there also toggles.

