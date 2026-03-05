

## Fix: Move "+ add_another" button above InlineNewReaderForm

Currently the order is: reader rows → InlineNewReaderForm → add_another button. When the user triggers "new reader" and then clicks "add_another", the new empty row appears below the inline form. The user wants the opposite: add_another button should be above the InlineNewReaderForm so new rows appear before it.

### Change in `src/components/library/SeriesCard.tsx` (lines 376-386)

Swap the order: move the `+ add_another` button before the `showInlineNewReader` block.

```
{editReaderAssignments.map(...)}

<Button type="button" variant="outline" size="sm" onClick={addReaderRow} ...>
  <Plus />add_another
</Button>

{showInlineNewReader && userId && (
  <InlineNewReaderForm ... />
)}
```

