

## Fix: Reorder InlineNewReaderForm above add_another button

The desired order is:
1. Existing reader assignment rows (from initial `editReaderAssignments`)
2. `InlineNewReaderForm` (when active)
3. Any new rows added via `+ add_another` after the form is shown
4. `+ add_another` button at the bottom

However, since all rows come from a single `editReaderAssignments` array and are rendered in one `.map()`, we can't easily split them around the inline form without tracking which rows existed before vs after.

**Simpler approach**: Revert to the order: rows → InlineNewReaderForm → add_another button. This was the original layout before the last change. The user's complaint about rows appearing "below" the form was because the button was above the form — putting the button back below the form fixes it naturally, since new rows are appended to the array and rendered in the `.map()` which is above both the form and the button.

### Change in `src/components/library/SeriesCard.tsx` (lines 376-386)

Swap back: InlineNewReaderForm first, then add_another button.

```tsx
{showInlineNewReader && userId && (
  <InlineNewReaderForm
    userId={userId}
    existingReaders={readerSites}
    onCreated={handleNewReaderCreated}
    onCancel={() => setShowInlineNewReader(false)}
  />
)}
<Button type="button" variant="outline" size="sm" onClick={addReaderRow} className="text-xs border-dashed">
  <Plus className="w-3.5 h-3.5 mr-1" />add_another
</Button>
```

### File modified
- `src/components/library/SeriesCard.tsx`

