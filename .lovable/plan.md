

## Plan

Add `bg-primary/5` background tint and a solid left accent border (`border-l-2 border-l-primary`) to the reader group header in `LibraryGroupedView.tsx`.

### Change

**File: `src/components/library/LibraryGroupedView.tsx` — line 386**

Change:
```
className="group relative border border-dashed p-3 cursor-pointer select-none overflow-hidden"
```
To:
```
className="group relative border border-dashed border-l-2 border-l-primary bg-primary/5 p-3 cursor-pointer select-none overflow-hidden"
```

This adds a subtle cyan-tinted background and a solid primary-colored left accent border, giving the header a distinct "section leader" feel while keeping the terminal aesthetic.

