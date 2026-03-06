

## Plan: Align anime_original label with episode input controls

The issue is that the `last_read` section for anime-original series doesn't vertically align with the `last_watched` section next to it. The `last_watched` section has a label row ("last_watched"), then sub-labels ("episode"), then the input — giving it more vertical height. The anime_original `last_read` section needs to match this structure.

### Changes in `src/components/CollectionSection.tsx` (lines 491-499)

Replace the current anime_only block with a structure that mirrors the `last_watched` column:

1. Keep the `last_read` label row (icon + text) — this already aligns with `last_watched` label row
2. Add a spacer element matching the "episode" sub-label height (`text-xs block mb-1`) so things stay vertically aligned
3. Render `anime_original, no_manga` text inside a container with `h-7` (matching the input height) and `flex items-center` so the text is vertically centered within that row

```tsx
// Replace lines 491-499 with:
<div className="space-y-2">
  <div className="flex items-center gap-1.5 text-xs">
    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
    <span className="text-muted-foreground">last_read</span>
  </div>
  <div>
    <span className="text-muted-foreground text-xs block mb-1">&nbsp;</span>
    <div className="flex items-center h-7">
      <span className="text-muted-foreground text-xs font-mono">anime_original, no_manga</span>
    </div>
  </div>
</div>
```

The invisible `&nbsp;` sub-label occupies the same vertical space as "episode" / "vol" / "ch" labels, and the `h-7` container matches the input box height — ensuring perfect vertical alignment.

