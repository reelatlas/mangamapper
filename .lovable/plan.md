

## Fix: Update AnimeDetail.tsx status label

There's one remaining instance of `"complete"` in `src/pages/AnimeDetail.tsx` (line 66). It needs to be updated to properly display all status values.

### Change in `src/pages/AnimeDetail.tsx` (lines ~62-67)

Replace the simple airing/complete ternary with a proper status display that handles all four values (`airing`, `finished`, `hiatus`, `upcoming`), using the same styling convention as other components:

- `airing` → accent color
- `finished` → muted
- `hiatus` → yellow/warning
- `upcoming` → blue/info

Display the actual `anime.status` value as the label text (e.g. `"finished"` not `"complete"`).

