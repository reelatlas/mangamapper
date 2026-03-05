

## Plan: Match reader buttons to library hover overlay format

### Change

In `src/components/CollectionSection.tsx` (lines 498-511), replace the current `outline`/`border-dashed` reader buttons with the `ghost` variant buttons used in SeriesCard's hover overlay, and swap the `ExternalLink` icon for the `Glasses` icon.

**Before:**
```tsx
<Button variant="outline" size="sm" className="font-mono text-xs border-dashed gap-1.5 ...">
  <span className="truncate">{reader.name}</span>
  <ExternalLink className="w-3 h-3 shrink-0" />
</Button>
```

**After:**
```tsx
<Button variant="ghost" size="sm" className="font-mono text-xs gap-1" onClick={...}>
  <Glasses className="w-3 h-3" />{reader.name}
</Button>
```

This matches the exact pattern from SeriesCard hover overlay (lines 520-527).

One file, one small change.

