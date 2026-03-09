

## Plan: Convert count parentheses to badge format with "X series" text

### Changes

**`src/components/library/LibraryGroupedView.tsx`** — Two locations:

1. **Line 332** (unassigned header): Replace `<span className="text-muted-foreground text-sm">({sortedEntries.length})</span>` with a `Badge` component using `variant="secondary"` (muted styling) displaying `"{count} series"` (e.g. "9 series", "1 series", "0 series").

2. **Line 468** (reader group header): Same replacement for `<span className="text-muted-foreground text-sm">({seriesEntries.length})</span>`.

Import `Badge` from `@/components/ui/badge` at the top of the file.

Badge markup: `<Badge variant="secondary" className="text-xs font-mono">{count} {count === 1 ? 'series' : 'series'}</Badge>`

