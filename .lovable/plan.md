

## Plan: Disconnect library button from click, make hover text the action trigger

### Current behavior
The `[✓] in_library` button is clickable and triggers the confirm-remove flow. On hover, `> remove_from(library)` appears inline.

### Desired behavior
- The `[✓] in_library` label is static and **not clickable**
- On hover over the label area, `> remove_from(library)` appears as a separate clickable element (like the `reader(null)` pattern)
- Clicking `> remove_from(library)` triggers the confirmation flow
- Same pattern for `[ ] add_to_library`: label is static, hover reveals `> add_to(library)` which is the clickable action

### Changes to `src/components/CollectionSection.tsx` (lines 440-455)

Replace the single `<Button>` with a `<div>` wrapper approach:

1. **When `inLibrary` is true**: Render a static `<span>` for `[✓] in_library` (styled like the button but not interactive), and on hover of the container, show a clickable `> remove_from(library)` span that triggers `setConfirmRemove(true)`

2. **When `inLibrary` is false**: Render a static `<span>` for `[ ] add_to_library`, and on hover show a clickable `> add_to(library)` span that triggers `toggleLibrary()`

3. Use a wrapper `<div>` with `group/lib` class for hover detection, keeping the same visual style (font-mono, text-xs, h-7, border-dashed)

4. The confirmation flow (remove? + Check/X) stays unchanged

