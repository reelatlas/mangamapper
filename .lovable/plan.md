

## Fix: Reset delete confirmation state when transitioning between view and edit modes

Currently the `confirmingDelete` state persists across view↔edit transitions. Need two resets:

1. **In `startEditing`**: add `setConfirmingDelete(false)` so entering edit mode clears any pending delete confirmation from the view card.
2. **In `cancelEditing`**: already has `setConfirmingDelete(false)` — confirmed this is covered.

This ensures bidirectional reset: view→edit and edit→view both clear the delete confirmation state.

### File: `src/components/library/SeriesCard.tsx`

In `startEditing`, add `setConfirmingDelete(false)` alongside the other state resets (around the beginning of that function body).

