

## Replace empty state icon in grouped view

In `src/components/library/LibraryGroupedView.tsx` (lines 253-257), swap the `BookDashed`/`BookOpenText` hover animation for the `EyeClosed`/`Eye` pair used on the Readers page.

### Changes

**`src/components/library/LibraryGroupedView.tsx`**

1. Update imports: add `EyeClosed, Eye` from lucide-react, remove `BookDashed, BookOpenText` (if unused elsewhere — they are not used elsewhere in this file besides line 255-256)
2. Replace the icon block (lines 254-256) with two side-by-side `EyeClosed`/`Eye` groups, matching the Readers page pattern:

```tsx
<div className="flex items-center justify-center gap-1 mb-3">
  <div className="group/eye1 cursor-default">
    <EyeClosed className="w-6 h-6 text-muted-foreground group-hover/eye1:hidden" />
    <Eye className="w-6 h-6 text-muted-foreground hidden group-hover/eye1:block" />
  </div>
  <div className="group/eye2 cursor-default">
    <EyeClosed className="w-6 h-6 text-muted-foreground group-hover/eye2:hidden" />
    <Eye className="w-6 h-6 text-muted-foreground hidden group-hover/eye2:block" />
  </div>
</div>
```

Each eye opens independently on hover, matching the playful interaction from the Readers page empty state.

