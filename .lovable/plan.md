

## Plan: Separate notes editing from reader editing on details page

### Current state
- Notes are edited inside the `edit_series` flow alongside reader assignments (lines 460-472)
- Notes section in view mode only shows when notes exist (line 649: `inLibrary && progress?.notes`)

### Changes (all in `src/components/CollectionSection.tsx`)

#### 1. Remove notes from the edit_series (reader editing) flow
- Remove the notes textarea block (lines 460-472) and `editNotes` state usage from `saveChanges` (lines 262-276)
- Remove `editNotes` state initialization from `startEditing` (line 183)
- Rename header back from `edit_series` to `edit_readers` and save button back to `save_readers()`

#### 2. Add separate notes editing state
- Add `isEditingNotes` boolean state and `editNotesValue` string state
- Add `isNotesHovered` boolean state for hover effect

#### 3. Update view mode notes section (lines 648-656)
- Always show notes section when `inLibrary` (not just when notes exist)
- When notes exist: show notes text, on hover show `> edit_notes`, click enters notes edit mode
- When no notes: show `// notes(null)`, on hover show `> add_notes`, click enters notes edit mode

#### 4. Notes edit mode
- When `isEditingNotes` is true, render an inline edit UI in place of the notes view section:
  - Input field pre-populated with current notes
  - Save and cancel buttons (same pattern as progress save/reset)
  - Save upserts `notes` to `anime_progress`, then refetches data

