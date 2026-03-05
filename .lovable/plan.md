

## Fix view_details icon and reader name formatting in SeriesCard

Two small changes in `src/components/library/SeriesCard.tsx`:

### 1. Remove ExternalLink icon from view_details button (line 508)
Replace `<ExternalLink className="w-3 h-3" />view_details` with just `view_details` — this is an internal navigation link, not an external one.

### 2. Comma-separated reader names with default text formatting (lines 473-479)
Currently each reader name is rendered as a separate `<span>` with `text-[10px] font-mono` — hard to scan. Change to a single comma-separated string with normal text size matching the other metadata rows:

```tsx
<div className="flex items-center gap-1.5 min-h-5 flex-wrap">
  <Glasses className="w-3.5 h-3.5 shrink-0 text-primary" />
  <span className="text-xs text-muted-foreground">
    {linkedReaders.map(r => r.name).join(', ')}
  </span>
</div>
```

### File modified
- `src/components/library/SeriesCard.tsx`

