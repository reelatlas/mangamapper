

## Plan: Sort reader data alphabetically by name

Three locations display reader data that should be sorted alphabetically:

### 1. `src/components/CollectionSection.tsx` (Detail page)
- **Line ~94**: After `setLinkedReaders(linkedRes.data || [])`, sort by name:
  ```ts
  setLinkedReaders((linkedRes.data || []).sort((a, b) => a.name.localeCompare(b.name)));
  ```
- **Line ~185**: After re-fetching readers on library toggle, same sort.
- **Line ~201**: `editReaderAssignments` populated from `linkedReaders` -- already sorted if source is sorted.

### 2. `src/components/library/NewSeriesForm.tsx` (Pre-populate on series select)
- **Line ~45-59**: In `handleAnimeSelect`, sort `matchingReaders` before mapping:
  ```ts
  const matchingReaders = readerSites.filter(s => s.anime_id === id)
    .sort((a, b) => a.name.localeCompare(b.name));
  ```

### 3. `src/components/library/SeriesCard.tsx` (Library card view)
- **Line ~462**: Sort `linkedReaders` after `getReadersForAnime`:
  ```ts
  const linkedReaders = getReadersForAnime(resolvedAnimeId!, readerSites)
    .sort((a, b) => a.name.localeCompare(b.name));
  ```
- **Line ~79**: Same sort in the edit-mode initialization.

All changes are simple `.sort((a, b) => a.name.localeCompare(b.name))` additions at the point where reader arrays are created or set.

