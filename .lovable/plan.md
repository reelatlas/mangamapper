

## Add external link icons and fix "reader(null)" display

### Changes

**1. `src/components/library/SeriesCard.tsx`** — Hover overlay reader buttons (lines 525-532)
- Add `<ExternalLink>` icon after the reader name on the hover buttons (single and multiple reader cases)
- Only show the icon when a URL exists (`series_url || url`)

**2. `src/components/library/SeriesCard.tsx`** — View mode "reader(null)" text (line 490)
- Remove the `// ` prefix: change `<span className="text-syntax-cyan">//</span> reader(null)` to just `reader(null)`

**3. `src/components/library/LibraryGroupedView.tsx`** — Reader group header hover "open_reader" button (line 434-436)
- Add `<ExternalLink>` icon after "open_reader" text
- Only render this button if `group.url` is truthy

### Summary of specific line changes

| File | Location | Change |
|------|----------|--------|
| `SeriesCard.tsx:525-526` | Single reader hover button | Add `<ExternalLink className="w-3 h-3" />` after reader name |
| `SeriesCard.tsx:530-531` | Multi-reader hover buttons | Same — add `<ExternalLink>` after name |
| `SeriesCard.tsx:490` | reader(null) display | Remove `<span className="text-syntax-cyan">//</span> ` prefix |
| `LibraryGroupedView.tsx:434-436` | open_reader hover button | Add `<ExternalLink className="w-3 h-3" />` after "open_reader" |

