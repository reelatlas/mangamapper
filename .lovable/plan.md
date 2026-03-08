

## Add library indicator to AnimeCard on home page

**Goal**: Show a small indicator on each anime card in the home list if the series is in the user's library.

### Approach

Use the terminal/mono style consistent with the app. In the card's terminal header (right side, next to the status badge), show `[✓]` in muted text when the series is in the library. Only show when logged in and the series is found in library data.

### Changes

1. **`src/pages/Index.tsx`** — Import and use `useLibraryData` (or a lighter hook) to fetch the user's library progress. Pass a `Set<string>` of library anime IDs down to each `AnimeCard`, or pass an `inLibrary` boolean prop.

2. **`src/components/AnimeCard.tsx`** — Accept an optional `inLibrary?: boolean` prop. When true, render a small `[✓]` indicator in the terminal header bar (right side, before the status text), styled as `text-muted-foreground text-xs`. This keeps it subtle and consistent with the `[✓] in_library` pattern used on the detail page.

### Layout in terminal header
```text
#01 | series_data > view_details          [✓] airing
```
The `[✓]` appears only when in library, right before the status badge, separated by a pipe or space.

