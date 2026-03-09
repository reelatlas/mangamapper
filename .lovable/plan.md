

## Reorder and update series notes section in NewSeriesForm

Two changes to `src/components/library/NewSeriesForm.tsx`:

1. **Move the `series_notes` section** (currently lines ~267-277) to appear **before** the `assign_to` section (currently starting at line ~243).

2. **Remove the `// optional` comment** from the `series_notes` label — change from:
   ```tsx
   <span className="text-syntax-cyan">series_notes</span>
   <span className="text-muted-foreground/60"> // optional</span>
   ```
   to just:
   ```tsx
   <span className="text-syntax-cyan">series_notes</span>
   ```

Both sections keep their existing `!mt-8` spacing. Functionality remains unchanged — notes are still optional.

