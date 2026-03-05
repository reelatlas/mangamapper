

## Refine hover overlay buttons: styling, labels, and grouping

### Changes to `src/components/library/SeriesCard.tsx` (lines 504-536)

**Delete button styling**: Remove `variant="outline"` and `border-dashed`, use `variant="ghost"` instead. Keep the `hover:text-destructive hover:bg-destructive/10` classes, drop `hover:border-destructive`.

**Single reader label**: When `linkedReaders.length === 1`, show the reader's name instead of "read_manga".

**Button grouping order with horizontal padding** (using `gap-2` within groups, separated by `px-3` spacers or a `border-r` divider):

```
[view_details]  |  [reader_name / multiple readers]  |  [edit] [delete]
```

Reorder and group with `<div>` wrappers separated by horizontal space.

### Changes to `src/components/library/LibraryGroupedView.tsx` (lines 409-422)

**Delete button styling**: Same as above — `variant="ghost"`, no border, red hover.

**"open" → "open_reader"**: Change label text.

**Add expand/collapse button**: New first button showing "expand" or "collapse" based on `collapsedGroups.has(group.name.toLowerCase())`, calls `toggleGroup`.

**Button grouping order**:

```
[expand/collapse]  |  [open_reader]  |  [edit] [delete]
```

### Files modified
- `src/components/library/SeriesCard.tsx`
- `src/components/library/LibraryGroupedView.tsx`

