

## Plan: Add anime_status and manga_status to the type system and series_info display

### Type changes (`src/types/anime.ts`)

1. Replace the current `status` field with explicit types:
   - `type AnimeStatus = 'airing' | 'hiatus' | 'completed' | 'upcoming'`
   - `type MangaStatus = 'publishing' | 'hiatus' | 'finished'`
2. On `AnimeSeries`: rename `status` to `animeStatus: AnimeStatus`, add `mangaStatus: MangaStatus | null` (null when `hasManga` is false)

### Display in series_info card (`src/pages/AnimeDetail.tsx`)

Add two new key-value lines inside the series_info card, after `genres` and before `synopsis`:

```
anime_status: airing
manga_status: finished
```

Color the values contextually:
- `airing` / `publishing` → `text-accent` (green, active)
- `hiatus` → `text-syntax-amber` (yellow, paused)
- `completed` / `finished` → `text-muted-foreground` (grey, done)
- `upcoming` → `text-syntax-purple`

The cover image badge (bottom-left) stays but reads from `animeStatus` instead of `status`.

### AnimeCard (`src/components/AnimeCard.tsx`)

Update the terminal header to use `animeStatus` instead of `status`.

### Mock data (`src/data/mockAnime.ts`)

Update all entries: rename `status` → `animeStatus`, add `mangaStatus` with appropriate values per series.

### Files affected
- `src/types/anime.ts` — new types and updated interface
- `src/data/mockAnime.ts` — updated mock data
- `src/pages/AnimeDetail.tsx` — add status lines to series_info, update cover badge
- `src/components/AnimeCard.tsx` — update status reference
- `src/pages/Index.tsx` — update any status filters if present

