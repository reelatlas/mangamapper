

## Plan: Refine Inline New Reader Form within New Series Flow

### Changes

**1. `NewSeriesForm.tsx` — Dashed separator + indented wrapper**

- Change `<Separator className="my-1" />` in the dropdown to use `border-dashed` style (use a `div` with `border-t border-dashed` instead of `Separator` since Separator renders a solid line by default).
- Wrap the `<InlineNewReaderForm>` block in a `pl-4` (or similar indent) container to visually nest it within the parent form.

**2. `InlineNewReaderForm.tsx` — Header treatment + button rename**

- Replace the `<p className="text-xs text-muted-foreground">// new_reader</p>` with a `terminal-header` style box matching the parent card's `new_series` header (a div with the `terminal-header` class containing `new_reader` text).
- Rename button text from `create_reader()` to `add_reader()`.

**3. Auto-select after creation** — Already works. The `handleNewReaderCreated` callback in `NewSeriesForm` already calls `setSelectedReaderName(readerName)`, which auto-selects the newly created reader. No change needed here.

### Files

| File | Changes |
|------|---------|
| `NewSeriesForm.tsx` | Replace `<Separator>` with dashed `div` in dropdown; wrap `InlineNewReaderForm` in indented container |
| `InlineNewReaderForm.tsx` | Add `terminal-header` box for title; rename button to `add_reader()` |

