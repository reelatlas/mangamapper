

## Plan: Add hover overlay to homepage AnimeCard

**What changes:**

The homepage `AnimeCard` will get a semi-opaque hover overlay matching the library `SeriesCard` pattern, with two actions:

1. **view_details** - links to `/anime/{id}` (same as clicking the card)
2. **in_library toggle** - the same `in_library [✓]/[ ]` pattern from CollectionSection, with hover prompts for add/remove and confirmation flow

**Implementation:**

### 1. Update `AnimeCard` to include hover overlay

- Add `group relative` to the Card (already has `group`)
- Add an overlay div (`absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100`) matching library SeriesCard pattern (line 507)
- Inside overlay:
  - `view_details` button as a Link to `/anime/{id}`
  - Vertical divider (`h-4 w-px bg-border mx-3`)
  - `in_library` toggle section

### 2. Add library toggle logic to AnimeCard

- Import `useAuth` and `supabase` 
- Fetch the `anime_progress` row for the current user + anime on mount to determine `inLibrary` state
- Implement `toggleLibrary` matching CollectionSection's logic (lines 153-177): upsert to add, update `in_library: false` + delete reader sites to remove
- Add `confirmRemove` state for the two-step removal confirmation (matching CollectionSection lines 419-452)
- The in_library display: static label `in_library [✓]` or `in_library [ ]`, with hover prompt `> remove_from(library)` (red) or `> add_to(library)` (blue)

### 3. Prevent navigation on overlay click

- The card is wrapped in a `<Link>`. Overlay buttons need `e.preventDefault(); e.stopPropagation()` to prevent navigation when interacting with overlay actions
- Alternatively, restructure so the Link wraps only the view_details button, not the whole card — but this changes existing behavior. Better approach: keep the Link wrapper but use stopPropagation/preventDefault on overlay interactions.

### 4. Handle unauthenticated state

- If no user is logged in, only show `view_details` in the overlay (no library toggle)
- If user is logged in, show both actions

### Files modified:
- `src/components/AnimeCard.tsx` - Add overlay with view_details + in_library toggle, fetch library state, handle toggle logic

