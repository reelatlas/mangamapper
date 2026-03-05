

## Add expand/collapse to reader groups

Make each reader group header card clickable to toggle visibility of its series entries. Collapsed state shows just the header with a count badge; expanded shows the series cards below.

### State management

- Add `collapsedGroups` state as a `Set<string>` of group name keys
- Persist to `localStorage` under `mangamapper-library-collapsed-groups`
- Toggle on header card click (but not on edit/open buttons — use `stopPropagation` on those)

### Visual changes to the reader header card (lines 354-370)

- Add `cursor-pointer` and `onClick` toggle handler to the header `div`
- Add a `ChevronDown`/`ChevronRight` icon (from lucide) at the left of the header row to indicate state
- Add a series count badge next to the reader name, e.g. `(3)` in muted text
- When collapsed, hide the series entries grid below

### Collapse logic (lines 380-408)

- Wrap the empty state and the series grid in a conditional: only render when the group is **not** collapsed
- When collapsed and `seriesEntries.length > 0`, the count in the header communicates what's hidden

### Files modified
- `src/components/library/LibraryGroupedView.tsx`

