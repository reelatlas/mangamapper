

## Plan: Fix footer button spacing

The `mt-6` on the button containers is being overridden by the parent `<form className="space-y-4">`, since both set `margin-top` and Tailwind's `space-y` utility uses `> :not(:first-child) { margin-top }` which has higher specificity.

**Fix**: Wrap the button div in an outer div that absorbs the `space-y-4` margin, and use `pt-4` (padding) on the button container instead — padding can't be overridden by `space-y`. Alternatively, simpler: add `!mt-8` (important) to force the margin.

I'll use `!mt-8` on the button containers for clear visual separation.

### Files & changes

1. **`src/components/library/NewSeriesForm.tsx`** line 251: `mt-6` → `!mt-8`
2. **`src/components/library/NewReaderForm.tsx`** line 179: `mt-6` → `!mt-8`
3. **`src/components/library/LibraryGroupedView.tsx`** line 321: `mt-6` → `!mt-8`
4. **`src/pages/Readers.tsx`** line 523: `mt-6` → `!mt-8` (new reader)
5. **`src/pages/Readers.tsx`** — edit reader button container: same change

