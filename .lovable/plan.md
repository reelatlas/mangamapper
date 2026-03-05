

## Plan: Match inline new reader form background to reader header cards

The reader header cards use `bg-primary/10` as their background. The `InlineNewReaderForm` currently uses `bg-muted/10`. Update the form's container background to `bg-primary/10` so it visually matches and creates better contrast when nested inside other forms.

### File: `src/components/library/InlineNewReaderForm.tsx` (line 59)

Change the container class from:
```tsx
<div className="border border-dashed bg-muted/10">
```
to:
```tsx
<div className="border border-dashed bg-primary/10">
```

One file changed, one line modified.

