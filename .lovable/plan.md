
Issue diagnosis:
- The reader header container uses `space-y-1` on the same parent that also contains the absolute hover overlays.
- `space-y-1` adds top margin to later children, so the overlay layer gets shifted and appears vertically off-center when the header is at minimum height (only reader name shown).

Plan:
1) In `src/components/library/LibraryGroupedView.tsx`, remove `space-y-1` from the outer header container (`className` on the `group relative ...` div).
2) Add an inner content wrapper (for normal header text rows only) with `space-y-1`, containing:
   - the existing top metadata row (`reader_name`, count, TripleArrow)
   - the optional notes row
3) Keep both hover overlays as siblings of that content wrapper so they are not affected by spacing utilities.
4) Keep current `p-3` overlay padding; no further overlay padding tweaks needed after spacing isolation.

Why this is the best straightforward fix:
- It addresses the actual layout cause (spacing utility leaking onto absolute overlay children), not just visual compensation.
- It preserves existing visual style and interactions.
- It is minimal, predictable, and easy to maintain.

Validation checklist:
- In grouped view, hover a header with only a reader name (no notes): equal top/bottom spacing around the button row.
- Hover a header with notes: overlay remains centered and unchanged.
- Confirm no regression to click-to-expand/collapse, open_reader, edit, delete actions.
