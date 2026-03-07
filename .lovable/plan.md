

## Update remove-from-library confirmation icons

**File: `src/components/CollectionSection.tsx`**

Change lines 465-484 to match the SeriesCard delete confirmation pattern:

1. Replace `Trash2` icon (line 475) with `Check` icon
2. Change both buttons' default text color to `text-muted-foreground`
3. Check button: `text-muted-foreground hover:text-destructive hover:bg-destructive/10` (matches SeriesCard pattern)
4. X button: `text-muted-foreground hover:text-muted-foreground hover:bg-muted` (stays muted on hover, matches SeriesCard)

The confirm button currently has no default color class (inherits), and uses `Trash2`. The cancel button is already close but needs minor alignment. Both should match the exact classes from SeriesCard lines 411-416.

