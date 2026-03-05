

## Plan: Add divider lines between button groups in hover overlays

Add vertical divider lines (`|`) between each button group in both the **reader header hover** and the **series card hover** overlays, with horizontal padding around each divider for spacing.

### 1. Reader header hover (`LibraryGroupedView.tsx`, ~lines 420-440)

Between the two button groups (open_reader group and edit/delete group), insert a vertical separator:

```tsx
<div className="h-4 w-px bg-border mx-3" />
```

### 2. Series card hover (`SeriesCard.tsx`, ~lines 505-540)

Between each of the three button groups (view_details | reader buttons | edit/delete), insert the same vertical separator:

```tsx
<div className="h-4 w-px bg-border mx-3" />
```

The separators will appear conditionally — only rendered between groups that are actually visible (e.g., the reader group only shows when `linkedReaders.length > 0`).

### Files to modify
- `src/components/library/LibraryGroupedView.tsx` — add divider between open_reader and edit/delete groups
- `src/components/library/SeriesCard.tsx` — add dividers between view_details, reader, and admin groups

