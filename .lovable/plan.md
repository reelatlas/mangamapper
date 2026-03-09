

## Plan: Inline episode, volume, and chapter on one line in library card

Currently the SeriesCard view mode (lines 479-499) shows:
- Line 1: `📺 ep: X`
- Line 2: `📖 vol: X · ch: X`

Change to a single line with both icons and all values, with spacing between the two groups:

```
📺 ep: X    📖 vol: X · ch: X
```

### Changes in `src/components/library/SeriesCard.tsx` (~lines 479-500)

Replace the `flex-col` container with a single `flex-row` line containing both the watched and read groups side by side, with a gap or separator between them. For series without manga, it stays as just the ep value.

```tsx
<div className="flex items-center gap-4 mt-2 text-xs flex-wrap">
  <div className="flex items-center gap-1.5">
    <Tv className={...} />
    <span>ep: {value}</span>
  </div>
  {anime.hasManga && (
    <div className="flex items-center gap-1.5">
      <BookOpen className={...} />
      <span>vol: {value}</span>
      <span>·</span>
      <span>ch: {value}</span>
    </div>
  )}
</div>
```

Single file edit, ~20 lines changed.

