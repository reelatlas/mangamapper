

## Plan: Reduce hero section horizontal gap

The hero section (cover + anime_info) uses `gap-8` (2rem) between columns, while the sections below (my_library, my_progress, read_manga) use `mb-6` (1.5rem) spacing. Change the hero gap to match.

### File: `src/pages/AnimeDetail.tsx` (line 80)

Change `gap-8` to `gap-6` on the hero flex container.

One class changed, one file modified.

