

## Plan: Merge Library + Readers into Unified Library Page

### Summary

Combine the Library and Readers pages into a single Library page. The default view shows all series in a flat list. A "group by reader" filter option lets users see series grouped by reader (similar to current Readers page layout). Add a "new_series" flow as the primary entry point, with an inline "new_reader" sub-flow when needed.

### Key Changes

#### 1. Remove Readers as a Separate Page
- **Remove** `/readers` route from `App.tsx`
- **Remove** readers nav link from `Header.tsx`
- **Keep** redirect from `/readers` → `/library` for bookmarks
- The `Readers.tsx` file can be kept temporarily as reference but will be superseded

#### 2. Library Page — View Modes

**Default view (flat list):** Shows all series in the user's library (entries from `anime_progress` where `in_library=true`), sorted by the existing sort options. Each card shows the same info as today (ep, vol, ch, reader links).

**Grouped by reader view:** A toggle/filter button (e.g., `group: none | by_reader`) switches to showing series organized under their reader site headers — similar to current Readers page. Series not assigned to any reader appear in an "unassigned" group.

#### 3. New Series Flow (`> new_series` button)

A collapsible form (matching the `new_reader` pattern) with fields:
- **series** — SeriesCombobox to pick an anime (required)
- **reader** — dropdown/combobox of existing readers, plus a `+ new_reader` option (optional)
- **series_url** — text input for direct series link (optional, shown when reader selected)
- **notes** — optional text input

On submit:
- Creates/updates `anime_progress` entry with `in_library: true`
- If a reader is selected, creates a `manga_reader_sites` entry linking the anime to that reader

#### 4. Inline New Reader Sub-flow

When user selects `+ new_reader` from the reader dropdown in the new_series form:
- An inline sub-form expands with fields:
  - **reader_name** (required)
  - **reader_url** (required)  
  - **notes** (optional)
- No series/series_url fields here — those are already captured in the parent new_series form
- On save, the new reader is created and auto-selected in the parent form's reader dropdown

#### 5. Edit Reader Flow

Maintain existing edit_reader functionality accessible from:
- The grouped-by-reader view (pencil icon on reader group headers)
- This keeps the full edit form: reader_name, reader_url, notes, and series assignments

#### 6. Files to Modify

| File | Change |
|------|--------|
| `src/pages/Library.tsx` | Major rewrite — merge readers view, add view toggle, add new_series form |
| `src/components/Header.tsx` | Remove readers nav link |
| `src/App.tsx` | Remove `/readers` route, add redirect `/readers` → `/library` |
| `src/hooks/useLibraryData.ts` | Already fetches both progress + readerSites — no change needed |
| `src/pages/Readers.tsx` | Keep as reference initially, eventually delete |

#### 7. Technical Details

- Reuse `SeriesCombobox` for series selection in new_series form
- Reuse existing `sortedReaderGroups` grouping logic from Readers.tsx for grouped view
- The view mode toggle (`group: none | by_reader`) stored in localStorage for persistence
- The new_series form creates `anime_progress` with `in_library: true` via upsert (handles case where progress already exists but not in library)
- Reader selection in new_series uses a simple Select/Combobox listing existing reader names, with a special `+ new_reader` option at the bottom
- The inline new_reader sub-form only collects reader_name, reader_url, notes — series assignment handled by the parent form context

