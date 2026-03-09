

## Fix: Disable save_changes() in edit series and edit reader until dirty

Two locations were missed in the previous implementation:

### 1. SeriesCard.tsx — Edit Series flow (line 432)

Currently: `disabled={saving}` — no dirty check.

**Fix:** Add an `initialEditSnapshot` ref or state, captured in `startEditing` (line 69-93). Compute `isEditSeriesDirty` via `useMemo` comparing current edit state to the snapshot.

Snapshot shape (set in `startEditing`):
```ts
{ episode, volume, chapter, notes, assignments: JSON.stringify(editReaderAssignments mapped to comparable form) }
```

Current state comparison in `useMemo`:
```ts
const isEditSeriesDirty = useMemo(() => {
  if (!initialSnapshot) return false;
  const current = JSON.stringify({
    episode: editWatchedEpisode,
    volume: editReadVolume,
    chapter: editReadChapter,
    notes: editNotes,
    assignments: JSON.stringify(editReaderAssignments.map(a => ({
      readerName: a.readerName, readerUrl: a.readerUrl, seriesUrl: a.seriesUrl
    })))
  });
  return current !== initialSnapshot;
}, [editWatchedEpisode, editReadVolume, editReadChapter, editNotes, editReaderAssignments, initialSnapshot]);
```

Button (line 432): `disabled={saving || !isEditSeriesDirty}`

### 2. LibraryGroupedView.tsx — Edit Reader flow (line 446)

Currently: no `disabled` prop at all.

**Fix:** Add `initialEditReaderSnapshot` state, captured in `startEditingReader` (line 126-138). Compute `isEditReaderDirty` via `useMemo`.

Snapshot shape (set in `startEditingReader`):
```ts
{ name, url, notes, assignments: JSON.stringify(seriesEntries mapped to { animeId, seriesUrl }) }
```

Button (line 446): `disabled={!isEditReaderDirty || !editSiteName.trim()}`

Clear snapshot in `cancelEditingReader`.

