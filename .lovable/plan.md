

## Fix: Reader replacement not persisting on save

**Problem**: When editing a series and replacing an existing reader with a different one, the save only updates `series_url` on the old record (via `existingSiteId`) but never changes `name` or `url`. The UI then still shows the original reader.

**Root cause**: In `handleReaderSelect` in both `CollectionSection.tsx` and `SeriesCard.tsx`, the spread `...updated[index]` preserves `existingSiteId` from the original assignment. In `saveChanges`, records with `existingSiteId` only get a `series_url` PATCH -- `name` and `url` are never updated.

**Fix**: In `handleReaderSelect`, clear `existingSiteId` when the selected reader differs from the original. This causes `saveChanges` to treat it as a new insert, and the orphaned old record gets deleted by the diff logic.

### Changes

**1. `src/components/CollectionSection.tsx` -- `handleReaderSelect` (~line 213-216)**
- Check if the newly selected reader name differs from the current `existingSiteId`'s reader name
- If different, set `existingSiteId: undefined` so save treats it as new

**2. `src/components/library/SeriesCard.tsx` -- `handleReaderSelect` (~line 117-126)**
- Same fix: clear `existingSiteId` when the reader changes

**3. `src/components/library/SeriesCard.tsx` -- `saveChanges` (~line 202-207)**
- When updating an existing site, also update `name` and `url` (belt-and-suspenders, in case `existingSiteId` is kept for a same-reader URL edit)

**4. `src/components/CollectionSection.tsx` -- `saveChanges` (~line 296-298)**
- Same: include `name` and `url` in the PATCH call for existing records

`NewSeriesForm.tsx` is not affected -- it only does inserts (no edit/replace flow).

