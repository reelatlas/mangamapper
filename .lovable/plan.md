

## Constrain series notes edit field width

The "last watched" and "last read" sections sit side by side in a `flex-wrap` row with `gap-6`. The last_watched block has a `w-24` input + episode count text, and last_read has two `w-24` inputs. Together they span roughly the full width of that row.

### Change in `src/components/CollectionSection.tsx`

**Lines 680-695** (the `isEditingNotes` block): Wrap the edit form `div` with a max-width that matches the combined width of the progress row. Since the progress row contains the last_watched and last_read sections in a flex container, the simplest aligned approach is to let the notes input fill the same container width by not going full-width.

Add `max-w-md` (28rem / ~448px) to the notes edit container. This closely matches the combined width of the progress inputs (w-24 × 3 inputs + gaps + label text ≈ 400-450px), aligning the notes field with the start and end of the last_watched through last_read sections.

```tsx
// Line 680: change
<div className="space-y-3">
// to
<div className="space-y-3 max-w-md">
```

Single line change — the `max-w-md` constrains the Input and buttons to align with the progress section width.

