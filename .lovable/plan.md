

## Plan: Update library removal styling

### Changes to `src/components/CollectionSection.tsx`

**1. Hover text color (line 446)**: Change `text-primary` to `text-destructive` on the `> remove_from(library)` span so it appears red on hover. Keep `add_to(library)` as `text-primary`.

**2. Confirm icon (line 429)**: Replace `Check` with `Trash2` icon (import from lucide-react). Keep its red hover styling as-is.

**3. Cancel X hover (line 435)**: Change from `hover:text-destructive hover:bg-destructive/10` to `hover:text-muted-foreground hover:bg-muted/50` for the grey/muted hover style.

