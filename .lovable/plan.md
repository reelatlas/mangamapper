

## Plan

CSS `border-image` with a gradient removes the dashed style, so that won't work. Instead, we can assign each border side a different syntax color from the three TripleArrow colors while keeping `border-dashed`. This creates a color-shifting effect around the border.

### Change

**File: `src/components/library/LibraryGroupedView.tsx` — line 386**

Replace:
```
className="group relative border border-dashed border-l-2 border-l-primary bg-primary/5 p-3 cursor-pointer select-none overflow-hidden"
```
With:
```
className="group relative border border-dashed border-t-syntax-cyan border-r-syntax-purple border-b-syntax-pink border-l-syntax-cyan bg-primary/5 p-3 cursor-pointer select-none overflow-hidden"
```

Each side gets one of the three TripleArrow colors (cyan, purple, pink), creating a gradient-like color shift around the dashed border. The solid left accent (`border-l-2`) is removed; all sides return to uniform width. The subtle `bg-primary/5` tint is kept.

