

## Context-aware button labels for add vs edit flows

Two changes in `CollectionSection.tsx`:

### 1. Notes: add vs edit mode

Track whether notes are being added (from null) or edited (existing). Use a boolean `isAddingNotes` derived from whether `progress?.notes` was null when editing started.

- **Add mode** (notes were null): Show `+ add_notes()` button (with Plus icon), no cancel button needed (just cancel still works but the primary button changes)
  - Actually per request: just the button changes from `save()` to `+ add_notes()`. Keep cancel.
- **Edit mode** (notes existed): Keep current `save()` + `cancel` buttons

**Line 703-704**: Conditionally render button label based on whether original notes were null:
```tsx
// Add a state: isAddingNotes (true when progress?.notes is falsy at time of click)
// In startEditingNotes, capture: setIsAddingNotes(!progress?.notes)
// Button: show "+ add_notes()" with Plus icon when isAddingNotes, "save()" with Check icon when editing
```

Disable logic:
- Add mode: disabled when `!editNotesValue.trim()` (nothing typed yet)
- Edit mode: disabled when `editNotesValue === (progress?.notes ?? '')` (no change)

### 2. Readers: add vs edit mode

Track whether we entered editing from the null state (no linked readers) or from the edit button (has readers).

Add a state `isAddingReaders` set in `startEditing()` based on `linkedReaders.length === 0`.

- **Add mode**: Header says `add_readers`, button says `+ add_readers()` with Plus icon. Disabled when no reader selected.
- **Edit mode**: Header says `edit_readers`, button says `save_readers()` with Check icon. Disabled when not dirty.

**Line 440**: `{isAddingReaders ? 'add_readers' : 'edit_readers'}`
**Line 514-515**: Conditionally render button icon/label

### Changes summary (single file: `CollectionSection.tsx`)

1. Add `isAddingNotes` state, set in `startEditingNotes`
2. Add `isAddingReaders` state, set in `startEditing`
3. Update notes save button (line 703-704) to show `+ add_notes()` or `save()`
4. Update notes disable logic for add mode
5. Update reader header (line 440) and save button (line 514-515)

