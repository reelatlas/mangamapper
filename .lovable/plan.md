

## Plan: Add anime and manga status enums

### Status values

| Field | Values |
|-------|--------|
| `status` (anime) | `airing`, `finished`, `hiatus`, `upcoming` |
| `mangaStatus` (new) | `publishing`, `finished`, `hiatus`, `anime_only` |

### Changes

**1. `src/types/anime.ts`**
- Add `export type AnimeStatus = 'airing' | 'finished' | 'hiatus' | 'upcoming';`
- Add `export type MangaStatus = 'publishing' | 'finished' | 'hiatus' | 'anime_only';`
- Change `status` field type from inline union to `AnimeStatus`
- Add `mangaStatus: MangaStatus` to `AnimeSeries`
- Keep `hasManga` as convenience (derived from `mangaStatus !== 'anime_only'`)

**2. `src/data/mockAnime.ts`**
- Replace all `status: 'completed'` → `status: 'finished'`
- Update `StatusFilter` type to `'all' | 'airing' | 'finished' | 'hiatus' | 'upcoming'`
- Add `mangaStatus` to every entry:
  - Airing w/ manga (One Piece, JJK, DanDaDan, Blue Lock, MHA, SPYxFAMILY, Demon Slayer, Bleach, Re:Zero): `'publishing'`
  - Airing no manga (Dragon Ball DAIMA): `'anime_only'`
  - Completed w/ manga (Black Clover, Chainsaw Man, Naruto, Solo Leveling, Frieren): `'finished'`

**3. All consumers of `'completed'`** — update to `'finished'`:
- `src/components/CollectionSection.tsx`
- `src/pages/Index.tsx`
- `src/components/AnimeCard.tsx`
- Search codebase for any other references

**4. Display `mangaStatus`** in `CollectionSection.tsx` alongside anime status.

