

## Hover overlay with action buttons on cards

Add hover overlays to series cards and reader group headers that show contextual action buttons over a semi-opaque backdrop.

### Series Card (view mode, lines 425-527 of SeriesCard.tsx)

**Current state**: Edit (pencil) and delete (trash) buttons sit permanently in the top-right corner. The card links to the anime detail page.

**Change**: 
- Remove the always-visible edit/delete buttons from the card layout
- Add a hover overlay `div` with `absolute inset-0` positioned over the card content
- Overlay uses `bg-background/90` (nearly opaque) with `opacity-0 group-hover:opacity-100 transition-opacity`
- The card wrapper gets `group relative` classes
- Overlay contains centered action buttons in a row:
  - **view_details** — `Link` to `/anime/${anime.id}` (replaces the card-level `<Link>` wrapper; the card itself becomes a plain `div`)
  - **edit** — calls `startEditing`
  - **delete** — calls `setConfirmingDelete(true)` (confirmation flow stays inline as-is, outside overlay)
  - **read_manga** — shown only if `getReadersForAnime()` returns entries; if single reader, opens URL directly; if multiple, could show first or a small list
- Each button: `variant="outline"` with icon + label, small size, `border-dashed` to match the aesthetic
- The outer `<Link>` wrapper is removed — navigation now happens via the explicit "view_details" button

### Reader Group Header (view mode, lines 368-406 of LibraryGroupedView.tsx)

**Current state**: Edit (pencil) and open (external link) buttons sit in the top-right. Clicking the card toggles collapse.

**Change**:
- Remove the always-visible edit/open buttons
- Add a hover overlay similar to series cards (`group relative` on the outer div)
- Overlay contains:
  - **edit** — calls `startEditingReader(group)`
  - **open** — opens `group.url` in new tab
  - **delete** — new action; triggers a confirmation flow (reuse the pattern from `confirmingDeleteReaderId` already in edit mode, but adapt for view mode)
- Collapse toggle still works: clicking the non-overlay area (or the overlay background) toggles collapse; action buttons use `stopPropagation`
- For delete: add `confirmingDeleteReaderView` state (or reuse existing state) so the delete confirmation can appear inline when not in edit mode

### Delete reader from view mode (new capability)

Currently delete only exists inside edit mode. Add:
- A `deleteReaderGroup` handler that deletes all entries for a group (same logic as in edit mode: `group.entries.forEach(entry => deleteReaderSite(entry.id))`)
- Confirmation UX: when delete is clicked from the overlay, swap the overlay buttons with confirm/cancel (Check/X icons), similar to existing patterns

### Files modified
- `src/components/library/SeriesCard.tsx` — hover overlay on view-mode card, remove Link wrapper, relocate actions
- `src/components/library/LibraryGroupedView.tsx` — hover overlay on reader header, add view-mode delete capability

