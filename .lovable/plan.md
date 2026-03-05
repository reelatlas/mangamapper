

## Plan

Change the reader header hover overlay from `justify-between` to `justify-center` so the button group is centered.

### Change in `src/components/library/LibraryGroupedView.tsx` (line 422)

Replace:
```tsx
<div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3 z-10">
```

With:
```tsx
<div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 z-10">
```

The expand/collapse affordance on the far right will be repositioned using `absolute right-3` so it stays pinned to the right while the action buttons (open_reader, edit, delete) are centered. Wrap the expand/collapse div (line 440) with absolute positioning:

```tsx
<div className="absolute right-3 flex items-center gap-1 font-mono text-xs text-foreground">
```

The left-side action buttons wrapper (line 423) loses its outer `<div className="flex items-center">` — the buttons sit directly in the centered flow.

