

## Plan: Add remove confirmation to in_library button

Currently clicking `[✓] in_library` immediately removes the series. We need a two-step interaction like delete confirmations used elsewhere.

### Changes to `src/components/CollectionSection.tsx`

1. **Add state**: `const [confirmRemove, setConfirmRemove] = useState(false)`

2. **Add hover text on the library button**: When `inLibrary` is true, hovering shows `> remove_from(library)` text appended to the button label (similar to the reader(null) pattern)

3. **Two-step click flow**:
   - First click on `[✓] in_library` sets `confirmRemove = true`, changing the button to show a confirmation state with a Trash2/X icon pair (matching existing delete confirmation patterns — Check icon with red destructive hover for confirm, X for cancel)
   - Confirm click calls `toggleLibrary()` to actually remove
   - Cancel click resets `confirmRemove = false`

4. **Reset confirmRemove** when entering/leaving edit mode (consistent with the existing delete-reset pattern)

### Interaction detail

- **Default state**: `[✓] in_library` button, hover shows `> remove_from(library)` 
- **After first click**: Button area becomes two small icon buttons — Check (confirm remove, red hover styling) and X (cancel) — matching the `h-7` height of the current button
- **Confirm**: Executes removal, resets state
- **Cancel**: Returns to default `[✓] in_library` view

