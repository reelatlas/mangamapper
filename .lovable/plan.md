

## Plan

Increase the background contrast of the reader group header by changing `bg-primary/5` to a more visible tint. Since series cards use `bg-card` (which is `hsl(220 13% 11%)`), we want the reader header to be noticeably different — slightly lighter/brighter.

### Change

**File: `src/components/library/LibraryGroupedView.tsx` — line 386**

Replace `bg-primary/5` with `bg-primary/10` to give the header a stronger cyan-tinted background that contrasts more against the darker series entry cards.

```
className="group relative border border-dashed border-muted-foreground/80 bg-primary/10 p-3 cursor-pointer select-none overflow-hidden"
```

