

## Plan: Improve Reader Group Spacing and Remove Indentation

### Changes — `src/components/library/LibraryGroupedView.tsx`

1. **More spacing between groups**: Change the grid container at line 254 from `gap-3` to `gap-8` so reader groups have clear visual separation.

2. **Remove series indentation**: At line 385, remove `pl-3 border-l border-dashed` from the series entries container, changing it to just `grid gap-3`.

| Line | Before | After |
|------|--------|-------|
| 254 | `className="grid gap-3"` | `className="grid gap-8"` |
| 385 | `className="grid gap-3 pl-3 border-l border-dashed"` | `className="grid gap-3"` |

