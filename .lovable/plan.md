

## Plan: Add increased vertical padding to inline new_reader footer buttons

Add `!mt-8` to the footer button container (line 101) in `InlineNewReaderForm.tsx` to match the spacing pattern used in all other form flows. Also remove the `// optional` label from notes (line 92) and tighten field spacing from `space-y-3` to `space-y-2` (line 63) for consistency with other forms.

### Changes in `src/components/library/InlineNewReaderForm.tsx`

1. **Line 63**: `space-y-3` → `space-y-2` (match other forms' field density)
2. **Line 92**: Remove `<span className="text-muted-foreground"> // optional</span>` from notes label
3. **Line 101**: `<div className="flex gap-2">` → `<div className="flex gap-2 !mt-8">` (match footer spacing)

