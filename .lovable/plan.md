

## Changes

### 1. Change `crypto_wallets` color to purple
In `src/pages/About.tsx` line 231: change `text-syntax-cyan` to `text-syntax-purple`.

### 2. Fix TripleArrow layout shift
The problem: when collapsed, arrows are horizontal (flex-row, ~3 icons wide × 1 tall). When expanded, arrows are vertical (flex-col, ~1 wide × 3 tall). This changes the component's dimensions and shifts surrounding elements.

**Fix in `src/components/TripleArrow.tsx`**: Give the container a fixed size box so it occupies the same space regardless of state. Use a fixed-size wrapper (e.g. `w-4 h-4`) with the icons absolutely positioned or centered inside, keeping layout stable.

```text
Before (collapsed):  [>>> ]  — wide, short
Before (expanded):   [v]     — narrow, tall  ← causes shift

After: fixed w-4 h-4 box, icons arranged inside with overlap
       Same bounding box in both states
```

Approach: wrap in a `relative w-4 h-4` div, use absolute positioning for the overlapping icons in both directions, so the outer dimensions never change.

