
Root cause confirmed from code + network behavior:

1) The details page (`CollectionSection.fetchData`) loads linked readers with:
- `.eq('anime_id', anime.id).not('series_url', 'is', null)`
So any valid assignment with `anime_id` set but `series_url = null` is excluded.

2) Your add flow can validly save `series_url = null` (empty input becomes `null`), so:
- insert succeeds
- toast says success
- details page still sees zero linked readers (`reader(null)`)

3) Duplicate prevention in details relies on `linkedReaders`; because that list is empty (due filter above), duplicate insert protection is bypassed, causing multiple rows for same reader/anime.

Implementation plan:

1. Fix assignment loading on details page
- File: `src/components/CollectionSection.tsx`
- Change linked readers query to load by `anime_id` only (remove `series_url not null` filter).
- Keep all rows where the reader is assigned to the anime, regardless of whether `series_url` is filled.

2. Make details-page display resilient to missing URL
- File: `src/components/CollectionSection.tsx`
- In linked reader rendering:
  - treat assigned reader as “linked” even if `series_url` is null
  - click target should be:
    - `series_url` if present
    - else `reader.url` if present
    - else render non-clickable/disabled reader pill
- This prevents `window.open(null)` and keeps the UI accurate.

3. Harden duplicate prevention in details save flow
- File: `src/components/CollectionSection.tsx`
- In `saveChanges`:
  - normalize reader names (`trim().toLowerCase()`)
  - block duplicates against existing linked rows (now correctly loaded)
  - also block duplicates within the same edit session payload (same reader selected twice before save)

4. Clean up already-created duplicates for this anime while saving
- File: `src/components/CollectionSection.tsx`
- During save, ensure only one row per `(user, anime_id, reader name)` is retained; delete extras.
- This resolves current polluted state (multiple `jujutsu-kaisen` under `test2`) without requiring manual cleanup.

5. Align “linked reader” semantics across app cards (consistency pass)
- Files:
  - `src/types/library.ts`
  - `src/components/library/SeriesCard.tsx`
- Update shared helper(s) so a reader is considered linked by `anime_id` assignment (not by `series_url` presence).
- Keep click behavior URL-safe as in step 2.
- This avoids inconsistent “reader(null)” messaging between details and library views.

Validation checklist (end-to-end):
1) From details page, add a reader assignment with empty `series_url`.
   - Expected: details immediately shows reader as assigned (no `reader(null)`).
2) Try adding same series to same reader again.
   - Expected: blocked (no duplicate insert).
3) Go to library grouped + flat views.
   - Expected: no extra duplicate cards for same reader/series after save cleanup.
4) Repeat with reader that has empty base URL and with reader that has a base URL.
   - Expected: both persist correctly and render safely.
