

## Grey hover for inactive reader buttons + "reader_url(null)" text

### Changes

**1. `src/components/library/SeriesCard.tsx` (lines 524-533)** — Entry reader hover buttons
- For readers with no URL (`!reader.series_url && !reader.url`):
  - Add grey hover class: `text-muted-foreground hover:bg-muted/50` instead of default ghost green
  - Change button text from `{reader.name}` to `reader_url(null)`
  - Remove `ExternalLink` icon (already handled)
  - Make click a no-op (already handled by the `if (url)` guard)
- For readers with a URL: keep current behavior

**2. `src/components/library/LibraryGroupedView.tsx` (lines 431-439)** — Reader header "open_reader" button
- Currently the button is hidden entirely when `!group.url`. Instead, always show it:
  - If `group.url` exists: keep current green hover + external link icon + clickable
  - If no `group.url`: render as non-clickable button with grey hover (`text-muted-foreground hover:bg-muted/50`), text reads `reader_url(null)`, no `ExternalLink` icon

