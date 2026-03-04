

## Plan: Consistent Cards in Grouped View

### Problem
The grouped-by-reader view uses a completely different card format from the flat view. Series entries within a reader group are just small text links, not the full series cards with cover image, progress info, and reader links used in the flat view.

### Approach
Refactor the grouped view so each reader group has:
1. **A reader header row** — a lightweight styled header (not a full card) showing reader_name, reader_url, open/edit buttons, notes, and last_updated. This acts as a section divider.
2. **The same series cards** as the flat view rendered underneath each reader group header, showing cover image, title, ep/vol/ch progress, reader links, and delete button.
3. **Unassigned series** section at the bottom continues to use the same full cards.

### File Changes

**`src/components/library/LibraryGroupedView.tsx`** — Major refactor of the view-mode rendering (lines 332-399):

- Replace the current single-card-per-reader-group layout with a **reader header + series cards** pattern
- The reader header will be a bordered section header with: reader_name, open button, edit button, notes, last_updated — similar info as today but styled as a group header (e.g., a `div` with `border-b border-dashed` and terminal-style formatting)
- Below each header, render the series entries using the **same card markup** from `LibraryFlatView` — cover image, title, ep/vol/ch rows, reader links, delete button
- To render the series cards, look up each series entry's `AnimeProgress` from the `progress` prop using `anime_id`
- Keep the edit reader flow unchanged — when editing, the header transforms into the existing edit form inline
- For unassigned series (lines 403-426), also use the full series card format instead of the minimal cards

**Extract a shared `SeriesCard` component** (new file `src/components/library/SeriesCard.tsx`):
- Extract the card rendering logic from `LibraryFlatView` (lines 104-193) into a reusable component
- Props: `item: AnimeProgress`, `readerSites: ReaderSite[]`, `onRemove`, `confirmingDeleteId`, `setConfirmingDeleteId`
- Use this component in both `LibraryFlatView` and `LibraryGroupedView`

### Layout Structure (grouped view)

```text
┌─────────────────────────────────────────┐
│ [reader_name]: MangaDex  [open] [edit]  │  ← reader header div
│ notes: "main reader"                    │
│ last_updated: mar 1 2026               │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [cover] Title / ep / vol / ch / ... │ │  ← same SeriesCard as flat view
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [cover] Title / ep / vol / ch / ... │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

// unassigned_series (2)
┌─────────────────────────────────────────┐
│ [cover] Title / ep / vol / ch / ...     │  ← same SeriesCard
└─────────────────────────────────────────┘
```

### Files
| File | Action |
|------|--------|
| `src/components/library/SeriesCard.tsx` | Create — extract shared card component |
| `src/components/library/LibraryFlatView.tsx` | Refactor — use SeriesCard |
| `src/components/library/LibraryGroupedView.tsx` | Refactor — reader header + SeriesCard per entry, full cards for unassigned |

