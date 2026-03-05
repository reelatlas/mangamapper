

## Plan: Add trash/clear buttons for series and reader selections in NewSeriesForm

Match the existing pattern used in `NewReaderForm.tsx` — a `Trash2` ghost icon button in the same row, styled with `text-muted-foreground hover:text-destructive hover:bg-destructive/10`.

### Changes in `src/components/library/NewSeriesForm.tsx`

1. **Import `Trash2`** from lucide-react (add to existing import on line 6)

2. **Series field** (lines 146-156): Wrap `SeriesCombobox` in a flex row. When `animeId` is set, show a `Trash2` button that calls `setAnimeId('')`:
```tsx
<div className="flex gap-1 items-center">
  <div className="flex-1 min-w-0">
    <SeriesCombobox ... />
  </div>
  {animeId && (
    <Button type="button" variant="ghost" size="icon"
      onClick={() => setAnimeId('')}
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0">
      <Trash2 className="w-4 h-4" />
    </Button>
  )}
</div>
```

3. **Reader field** (lines 163-186): Wrap the `Select` in a flex row. When `selectedReaderKey` is set, show a `Trash2` button that clears all reader state (`selectedReaderKey`, `selectedReaderName`, `selectedReaderUrl`, `seriesUrl`):
```tsx
<div className="flex gap-1 items-center">
  <div className="flex-1 min-w-0">
    <Select ...>...</Select>
  </div>
  {selectedReaderKey && (
    <Button type="button" variant="ghost" size="icon"
      onClick={() => { setSelectedReaderKey(''); setSelectedReaderName(''); setSelectedReaderUrl(''); setSeriesUrl(''); }}
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0">
      <Trash2 className="w-4 h-4" />
    </Button>
  )}
</div>
```

**Single file**: `src/components/library/NewSeriesForm.tsx`

