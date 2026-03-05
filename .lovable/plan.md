

## Plan: Fix trailing slash in series_url when reader has no URL

**Problem**: In `handleNewReaderCreated` (SeriesCard.tsx, line 135), when a reader is created without a URL, the code does `readerUrl.endsWith('/') ? readerUrl : readerUrl + '/'`, which turns an empty string into `"/"`. This gets set as the `seriesUrl`.

**Fix**: Add a guard so `baseUrl` is empty when `readerUrl` is empty.

### File: `src/components/library/SeriesCard.tsx` (line 135)

Change:
```tsx
const baseUrl = readerUrl.endsWith('/') ? readerUrl : readerUrl + '/';
```
to:
```tsx
const baseUrl = readerUrl ? (readerUrl.endsWith('/') ? readerUrl : readerUrl + '/') : '';
```

This matches the same guard pattern already used in `handleSeriesUrlChange` (line 156).

One line changed, one file modified.

