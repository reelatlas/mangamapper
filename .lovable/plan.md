

## Plan: Episode list show/expand with scroll container

**Changes in `src/pages/AnimeDetail.tsx`:**

1. **Add state**: `const [showAll, setShowAll] = useState(false)` to toggle between limited (current subset) and all episodes.

2. **Update header text** (line 160-161): Change to `// show > {count} of {total}` with `//` in `text-syntax-cyan`. On hover, reveal `> show_episodes(all)` to the right. Clicking it sets `showAll = true`. When expanded, show `> show_episodes(less)` to collapse back.

3. **Wrap episode list in ScrollArea** with a fixed max-height (~500px or similar). When `showAll` is false, show current `anime.episodes`. When true, generate all episode numbers (1 to `currentEpisode`) — for ones not in the data, show placeholder rows.

4. **Remove the "full list coming soon"** footer since this replaces that functionality.

**Implementation details:**
- Use a `group` class on the left text container so the `show_episodes(all)` text appears on hover via `opacity-0 group-hover:opacity-100` transition
- Use the existing `ScrollArea` component for the scrollable container
- The hover trigger text styled as a clickable span with `cursor-pointer text-syntax-cyan`

