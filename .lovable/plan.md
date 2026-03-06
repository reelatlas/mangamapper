

## Plan: Episode type filter badges

**Changes in `src/pages/AnimeDetail.tsx`:**

1. Add state: `const [activeFilters, setActiveFilters] = useState<Set<EpisodeType>>(new Set(['canon', 'filler', 'anime-only-canon']))` — all enabled by default.

2. Add toggle handler that adds/removes a type from the set.

3. Filter logic: An episode is shown if **at least one** of its types is in `activeFilters`. Since each episode has a single `type` field, this means: show if `activeFilters.has(episode.type)`.

4. Update the episode count in the header to reflect filtered count.

5. Make the legend badges clickable — wrap each in a `cursor-pointer` div with `onClick` to toggle that filter. When a filter is inactive, pass an `inactive` prop/className to `EpisodeBadge`.

**Changes in `src/components/EpisodeBadge.tsx`:**

6. Add optional `inactive` prop. When true, override colors to muted/disabled styling: `text-muted-foreground/40 border-muted-foreground/30` (subdued, following the grayscale filter philosophy).

