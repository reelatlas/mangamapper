

## Fix EpisodeBadge dimension inconsistency

**Root cause**: The `EpisodeBadge` uses `text-[10px]` but doesn't set its own `line-height`. In the filter area, the parent has `text-xs` context. In the episode list rows, the parent `MangaMappingDisplay` has `text-sm`, which gives a larger inherited line-height, inflating the badge height from ~22px to ~26px.

**Fix**: Add `leading-tight` to the EpisodeBadge base classes so the badge always renders at the same dimensions regardless of parent context.

### Change in `src/components/EpisodeBadge.tsx` (line 30):
- Add `leading-tight` to the base className string:
  - `'font-mono text-[10px] px-2 py-0.5 rounded-full border tracking-wider transition-colors'`
  - → `'font-mono text-[10px] leading-tight px-2 py-0.5 rounded-full border tracking-wider transition-colors'`

This single change ensures both filter badges and episode list badges render at identical dimensions.

