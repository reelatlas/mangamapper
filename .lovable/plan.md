

## Add active highlight border to new_series and new_reader forms

The edit flows (edit_series, edit_reader) use `border-primary/50` on the Card to indicate an active/editing state. The new_series and new_reader forms currently just use `border-dashed` without the highlight.

### Changes

**`src/components/library/NewSeriesForm.tsx`** (line 140)
- Change `<Card className="border-dashed">` to `<Card className="border-dashed border-primary/50">`

**`src/components/library/NewReaderForm.tsx`** (line 117)
- Change `<Card className="border-dashed">` to `<Card className="border-dashed border-primary/50">`

Two one-line changes to match the existing edit flow styling.

