

## Improve empty state for readers with no assigned series

Replace the plain `series_assigned(null)` text with a dashed border box containing an icon and actionable text, consistent with other empty states in the app.

### Change in `src/components/library/LibraryGroupedView.tsx` (lines 380-382)

Replace the current `<p>` with a dashed border container:

```tsx
{seriesEntries.length === 0 && (
  <div
    className="border border-dashed rounded-sm py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/40 transition-colors"
    onClick={() => startEditingReader(group)}
  >
    <Plus className="w-4 h-4 text-muted-foreground" />
    <p className="text-xs text-muted-foreground">
      <span className="text-muted-foreground/60">// </span>assign_series
    </p>
  </div>
)}
```

- Dashed border box with centered `Plus` icon and `assign_series` label
- Clicking it opens the edit flow for that reader (reuses `startEditingReader`)
- Hover effect subtly highlights the border (`hover:border-primary/40`)
- Matches the terminal-style aesthetic with `//` comment prefix

### File modified
- `src/components/library/LibraryGroupedView.tsx`

