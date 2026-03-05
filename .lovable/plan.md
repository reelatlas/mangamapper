

## Plan: Sort dropdown options alphabetically

### 1. SeriesCombobox (`src/components/SeriesCombobox.tsx`, ~line 46-50)
Add `.sort()` to `filteredAnime`:
```tsx
const filteredAnime = showResults
  ? availableAnime
      .filter(anime => anime.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.title.localeCompare(b.title))
  : [];
```

### 2. NewSeriesForm reader dropdown (`src/components/library/NewSeriesForm.tsx`, ~line 43-57)
Sort `readerOptions` alphabetically by name in the `useMemo`:
```tsx
return options.sort((a, b) => a.name.localeCompare(b.name));
```

**Files**: `src/components/SeriesCombobox.tsx`, `src/components/library/NewSeriesForm.tsx`

