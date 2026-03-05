

## Two fixes in `src/components/library/SeriesCard.tsx`

### 1. Chapter field: change `type="text"` to `type="number"`
Line 245: change the chapter `Input` from `type="text"` to `type="number"` so it gets the same up/down arrows as the volume field.

### 2. Reader builder: reset-to-empty instead of removing last row
Update `removeReaderRow` (line 119-121): when there's only 1 row left, reset it to an empty state instead of removing it. When the row is empty (no reader selected), hide the trash button.

In the render (line 306-314): conditionally show the trash button only when `editReaderAssignments.length > 1 || assignment.readerName`.

