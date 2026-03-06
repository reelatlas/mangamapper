

## Add back animations to library empty states

Add the icon animations above the text in each empty state, keeping the interactive text we just built.

### Flat view (`LibraryFlatView.tsx`, lines 61-68)

Add a `BookDashed`/`BookOpenText` hover animation above the `// library(empty)` text. Wrap the whole empty state in a group so hovering anywhere triggers both the book animation and the `> new_series` reveal.

```tsx
import { ArrowUpDown, BookDashed, BookOpenText } from 'lucide-react';
```

```tsx
<div className="text-center py-16 border border-dashed">
  <div className="group/lib cursor-pointer" onClick={onNewSeries}>
    <div className="flex items-center justify-center mb-3">
      <BookDashed className="w-6 h-6 text-muted-foreground group-hover/lib:hidden" />
      <BookOpenText className="w-6 h-6 text-muted-foreground hidden group-hover/lib:block" />
    </div>
    <p className="text-muted-foreground text-sm">
      <span>// library(empty)</span>
      <span className="hidden group-hover/lib:inline text-primary ml-2">{'>'} new_series</span>
    </p>
  </div>
</div>
```

### Grouped view (`LibraryGroupedView.tsx`, lines 255-267)

Add two `EyeClosed`/`Eye` icons above the two text lines (already imported). Each eye animates independently alongside its respective text line.

```tsx
<div className="text-center py-16 border border-dashed">
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
  <div className="group/series cursor-pointer mb-1" onClick={onNewSeries}>
    <p className="text-muted-foreground text-sm">
      <span>// series_assigned(null);</span>
      <span className="hidden group-hover/series:inline text-primary ml-2">{'>'} new_series</span>
    </p>
  </div>
  <div className="group/reader cursor-pointer" onClick={onNewReader}>
    <p className="text-muted-foreground text-sm">
      <span>// reader_assigned(null)</span>
      <span className="hidden group-hover/reader:inline text-primary ml-2">{'>'} new_reader</span>
    </p>
  </div>
</div>
```

### Files changed

1. **`src/components/library/LibraryFlatView.tsx`** -- Add `BookDashed, BookOpenText` imports; add book animation above text
2. **`src/components/library/LibraryGroupedView.tsx`** -- Add eye animation pair above the two text lines (icons already imported)

