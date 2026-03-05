

## Match Edit Series Fields to Details Page Format

The details page ProgressTracker uses a specific layout for progress fields:
- Compact `w-24 h-7` inputs
- Inline layout with `flex flex-wrap gap-6` (not grid)
- Icon + label header per section (`Tv` icon + `last_watched`, `BookOpen` icon + `last_read`)
- Sub-labels as plain `text-muted-foreground text-xs block mb-1` spans (not `Label` components)
- Episode shows `/{totalEpisodes}` suffix next to the input
- Vol and ch sit side by side under the `last_read` header

### Changes to `src/components/library/SeriesCard.tsx`

Replace the current `last_watched` and `last_read` grid-based layout (lines 207-253) with the ProgressTracker's flex-based layout:

**last_watched + last_read together in a single `flex flex-wrap gap-6` container:**

```tsx
<div className="flex flex-wrap gap-6">
  {/* last_watched */}
  <div className="space-y-2">
    <div className="flex items-center gap-1.5 text-xs">
      <Tv className="w-3.5 h-3.5 text-primary" />
      <span className="text-syntax-cyan">last_watched</span>
    </div>
    <div>
      <span className="text-muted-foreground text-xs block mb-1">episode</span>
      <div className="flex items-center gap-2">
        <Input ... className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7" />
        <span className="text-muted-foreground text-xs">
          /{anime.totalEpisodes || anime.currentEpisode}
        </span>
      </div>
    </div>
  </div>

  {/* last_read (if hasManga) */}
  {anime.hasManga && (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs">
        <BookOpen className="w-3.5 h-3.5 text-primary" />
        <span className="text-syntax-cyan">last_read</span>
      </div>
      <div className="flex items-center gap-2">
        <div>
          <span className="text-muted-foreground text-xs block mb-1">vol</span>
          <Input ... className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7" />
        </div>
        <div>
          <span className="text-muted-foreground text-xs block mb-1">ch</span>
          <Input ... className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7" />
        </div>
      </div>
    </div>
  )}
</div>
```

Key differences from current edit_series layout:
- Replace `Label` wrappers and `grid` layout with plain `span` sub-labels and `flex` layout
- Add `w-24 h-7` sizing to inputs (currently full-width)
- Add `Tv` and `BookOpen` icons in section headers
- Add `/{totalEpisodes}` suffix next to episode input
- Combine both sections into one `flex flex-wrap gap-6` row instead of separate blocks

Single file change: `src/components/library/SeriesCard.tsx` (lines 206-253).

