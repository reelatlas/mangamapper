

## Plan: Unify my_library + my_progress + read_manga into a single section on detail page

### Problem
The anime detail page currently has three separate cards stacked vertically: `my_library` (add/remove toggle), `my_progress` (episode/volume/chapter inputs), and `read_manga` (linked reader buttons). These should be consolidated into one unified section that mirrors the library page's SeriesCard hierarchy.

### Design approach
A single `Card` with terminal header `my_collection` that contains stacked rows, matching the library card's information hierarchy:

```text
┌─ my_collection ──────────────────────────────┐
│                                               │
│  [✓] in_library              [pencil] edit    │
│                                               │
│  🖥 ep: 5 /220    📖 vol: 3 · ch: 28         │
│                                               │
│  👓 MangaDex [↗]   MangaPlus [↗]             │
│     // or "no_reader_assigned" + dropdown     │
│     // or "anime_original; no_manga"          │
│                                               │
│  last_saved: mar 2 2026 4:30pm                │
└───────────────────────────────────────────────┘
```

When user clicks `edit`, the card transforms into an edit form (same pattern as SeriesCard's edit mode) with inline inputs for episode/volume/chapter and reader assignment rows.

### Not logged in state
Single card showing `!auth_required` with sign-in button (replaces the three separate auth prompts).

### Implementation

**Delete**: `src/components/LibrarySection.tsx` and `src/components/ProgressTracker.tsx` (their logic merges into the new component).

**Create**: `src/components/CollectionSection.tsx` — a new unified component combining:
1. Library status (in_library toggle) from LibrarySection
2. Progress display + editing (episode, volume, chapter) from ProgressTracker  
3. Reader links + AddToReaderDropdown from the read_manga section in AnimeDetail
4. An edit mode that shows inline inputs for all fields (similar to SeriesCard's edit mode) with save/cancel/reset
5. Reader assignment editing with the same select + series_url + InlineNewReaderForm pattern from SeriesCard

**Modify**: `src/pages/AnimeDetail.tsx`
- Remove the three separate sections (LibrarySection, ProgressTracker, read_manga card)
- Replace with single `<CollectionSection animeId={anime.id} anime={anime} />` 
- Remove `linkedReaders` state and `fetchLinkedReaders` from the page (moved into CollectionSection)
- Keep `libraryKey` pattern for re-fetching after reader assignment from elsewhere (if needed)

### View mode layout (not editing)
- **Row 1**: `[✓] in_library` button on left, `edit` button on right  
- **Row 2**: `ep: X /total` and (if hasManga) `vol: X · ch: X` — compact single-line display like SeriesCard view mode
- **Row 3**: Reader buttons with ExternalLink icons (if hasManga + linked), or `// no_reader_assigned`, or `// anime_original; no_manga`
- **Row 4**: `last_saved: timestamp` (if progress exists)

### Edit mode layout
Reuses the same input structure from SeriesCard's edit mode:
- Episode input, volume/chapter inputs (if hasManga)
- Reader assignment rows with select + series_url + InlineNewReaderForm
- save_changes / cancel / delete buttons

### Files affected
1. **Create** `src/components/CollectionSection.tsx` — new unified component
2. **Modify** `src/pages/AnimeDetail.tsx` — swap three sections for one
3. **Delete** `src/components/LibrarySection.tsx` — absorbed into CollectionSection  
4. **Delete** `src/components/ProgressTracker.tsx` — absorbed into CollectionSection

