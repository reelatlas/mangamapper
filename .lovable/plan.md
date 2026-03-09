

## Group series + series_notes together with tighter spacing

Currently the series selector and series_notes are separate sections with `!mt-8` between them. We'll wrap them in a single group div with tight internal spacing, keeping the `!mt-8` gap only before the assign_to section.

### Change in `src/components/library/NewSeriesForm.tsx` (lines 279-313):

Replace the two separate `div`s (series selector at line 279 and notes at line 302) with a single wrapper:

```tsx
{/* Series group: name + notes */}
<div className="space-y-3">
  <div className="space-y-1.5">
    <Label className="text-xs">
      <span className="text-syntax-cyan">series</span>
    </Label>
    {/* ...existing combobox + clear button... */}
  </div>
  <div className="space-y-1.5">
    <Label className="text-xs">
      <span className="text-syntax-cyan">series_notes</span>
    </Label>
    <Input ... />
  </div>
</div>
```

Key change: Remove `!mt-8` from the notes div and wrap both in a parent with `space-y-3` for tight grouping — matching the `InlineNewReaderForm` pattern where name, url, and notes use `gap-3` / `space-y-2`.

