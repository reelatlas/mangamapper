

## Plan

Three changes to `src/components/library/LibraryGroupedView.tsx`:

### 1. Expand/collapse on hover overlay — plain text instead of button (lines 440-445)

Replace the `Button` wrapping the expand/collapse affordance with plain `span` text. Since clicking anywhere on the card already triggers toggle, this just needs to be a visual label.

```tsx
// Replace Button with plain text
<span className="font-mono text-xs text-muted-foreground">
  {collapsedGroups.has(group.name.toLowerCase()) ? 'expand' : 'collapse'}
</span>
```

### 2. Unassigned series section — reader header card format (lines 482-497)

Replace the plain `<p>` label with a full reader-header-style card matching the existing reader headers:
- Same `border border-dashed border-muted-foreground/80 bg-primary/10 p-3` styling
- Non-hover state shows `// unassigned_series` with `(count)` and `TripleArrow` on the right (matching reader header layout)
- Click anywhere toggles expand/collapse (using a new `unassigned` key in `collapsedGroups`)
- Hover overlay shows only the plain-text expand/collapse label justified far right (no open_reader, edit, delete buttons)
- Series cards rendered below when expanded, same as reader groups

### 3. Reader header non-hover label format already correct

The existing reader headers show `reader_name: {name}` with `(#)` and `TripleArrow` — no changes needed there.

### Unassigned header detail

```tsx
<div
  className="group relative border border-dashed border-muted-foreground/80 bg-primary/10 p-3 cursor-pointer select-none overflow-hidden"
  onClick={() => toggleGroup('unassigned')}
>
  <div className="flex items-center justify-between gap-2">
    <div className="text-sm text-muted-foreground">
      <span className="text-muted-foreground/60">// </span>
      <span className="text-syntax-green">unassigned_series</span>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-muted-foreground text-sm">({unassignedProgress.length})</span>
      <TripleArrow collapsed={collapsedGroups.has('unassigned')} />
    </div>
  </div>
  {/* Hover overlay — expand/collapse text only, far right */}
  <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end p-3 z-10">
    <span className="font-mono text-xs text-muted-foreground px-3">
      {collapsedGroups.has('unassigned') ? 'expand' : 'collapse'}
    </span>
  </div>
</div>
{!collapsedGroups.has('unassigned') && (
  <div className="grid gap-3">
    {unassignedProgress.map(item => (
      <SeriesCard key={item.id} item={item} readerSites={readerSites} onRemove={removeFromLibrary} userId={userId} onSave={fetchReaderSites} />
    ))}
  </div>
)}
```

