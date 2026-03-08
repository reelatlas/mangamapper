

## Plan: Include unassigned section in sort order + always sort entries alphabetically

### Current behavior
- `sortedReaderGroups` (lines 83-102) sorts reader group headers by the selected sort option
- `unassignedProgress` section (lines 498-536) is always rendered **after** all reader groups, regardless of sort
- Entries within each reader group are already sorted alphabetically (line 299-303), but unassigned entries (line 523) are not sorted at all

### Changes

#### 1. Unify reader groups and unassigned into one sorted list

**`src/components/library/LibraryGroupedView.tsx`** (~lines 83-108):

Create a single `sortedGroups` memo that includes both reader groups AND the unassigned group as items in the same array. Each item gets a `type` field (`'reader'` or `'unassigned'`).

For sorting purposes:
- **alpha-asc / alpha-desc**: Unassigned group uses name `"unassigned_series"` for alphabetical comparison against reader names
- **date-desc / date-asc**: Unassigned group uses the latest `updated_at` from its entries for date comparison

#### 2. Sort entries within unassigned group alphabetically

**Lines 521-534**: Sort `unassignedProgress` entries alphabetically by anime title (using `mockAnimeData` lookup), matching how reader group entries are already sorted on line 299-303.

#### 3. Render from unified sorted list

**Lines 297-536**: Replace the current two-section render (reader groups then unassigned) with a single `.map()` over the unified sorted array, rendering the appropriate card type based on `type`.

### Technical detail
- The unified array will be a discriminated union: `{ type: 'reader', ...readerGroupData } | { type: 'unassigned', entries: AnimeProgress[] }`
- The `latestUpdatedAt` for the unassigned group will be computed as `Math.max(entries.map(e => e.updated_at))`
- No other files change

