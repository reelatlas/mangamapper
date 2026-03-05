

## Plan: Increase vertical spacing + match library reader(null) pattern

### Changes to `src/components/CollectionSection.tsx`

**1. Increase vertical spacing** — Change `space-y-5` on the view mode CardContent to `space-y-6` for more separation between the library toggle, progress inputs, reader links, and last_saved sections.

**2. Update null reader display** — Replace the plain text `// no_reader_assigned` (line 509) with the library card pattern using the Glasses icon + `reader(null)`:

```tsx
// Before:
<span className="text-xs text-muted-foreground">// no_reader_assigned</span>

// After:
<div className="flex items-center gap-1.5 text-muted-foreground">
  <Glasses className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
  <span className="text-xs">reader(null)</span>
</div>
```

This matches the `SeriesCard.tsx` pattern exactly (lines 483-486). Glasses icon is already imported.

One file modified, two small changes.

