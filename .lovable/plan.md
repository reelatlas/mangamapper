

## Plan: Improve input contrast inside inline new reader form

**Problem**: The inline new reader form's inputs use `bg-muted/30` — the same as all other forms. But since the container background was changed to `bg-primary/10`, these semi-transparent inputs now blend in, reducing contrast.

**Solution**: Change the input background class inside `InlineNewReaderForm.tsx` from `bg-muted/30` to `bg-background/80`. This uses the base dark background color with slight transparency, creating a clear visual distinction against the `bg-primary/10` container — similar to how inputs in the parent forms contrast against their card backgrounds.

### File: `src/components/library/InlineNewReaderForm.tsx`

Update all three `<Input>` elements (lines 73, 85, 98):

```
bg-muted/30  →  bg-background/80
```

Three lines changed, one file modified.

