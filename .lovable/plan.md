

## Fix: Trailing slash in series_url when reader has no URL

**Problem**: In `AddToReaderDropdown.tsx` (used on the detail page), when a reader has an empty URL, `handleSelectReader` computes `baseUrl` as `''` correctly via the ternary — but this same pattern in other files like `NewReaderForm.tsx` and `NewSeriesForm.tsx` could also produce a `/` if the URL is just whitespace or empty after trim. The detail page component (`AddToReaderDropdown`) line 61 looks correct (`reader.url ? ... : ''`), so the issue might be that the reader was saved with an empty string `""` which is truthy.

**Root cause**: `reader.url` is an empty string `""` — which is falsy in JS, so that ternary actually works. But wait — if `reader.url` is `" "` or some non-empty string, it would pass the check. Let me re-examine: the real issue is that `reader.url` could be a non-empty string like `""` stored in the DB. Actually `""` is falsy. The issue is the check `reader.url ?` — if url is `""` it returns `''`, which is correct. 

Let me re-read: the user says "adding a new reader with no url" on the details page. This likely means using `NewSeriesForm` or the inline flow where creating a new reader with no URL, then the series_url gets populated with `/`.

Looking at `NewSeriesForm.tsx` line 72: `const baseUrl = option.url ? (option.url.endsWith('/') ? option.url : option.url + '/') : '';` — if `option.url` is `""`, this returns `''`. But line 85: same pattern with `readerUrl`.

The issue is likely in `NewReaderForm.tsx` line 34: `const baseUrl = newSiteUrl.trim() ? (newSiteUrl.trim().endsWith('/') ? newSiteUrl.trim() : newSiteUrl.trim() + '/') : '';` — when adding a series row with empty URL, `newSiteUrl.trim()` is `""` which is falsy, so baseUrl is `''`. This seems fine.

Wait — the user says "on details page when adding a new reader." Let me check if there's an inline new reader form on the detail page that auto-populates the series URL with `/`.

Looking at `AddToReaderDropdown.tsx` — this only lets you pick an existing reader. The detail page must have another flow. Let me check `AnimeDetail.tsx`.

