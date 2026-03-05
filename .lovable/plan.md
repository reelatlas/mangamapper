

## Revised Plan

The previous `min-h-[25px]` fix doesn't work because Radix fully unmounts `ScrollUpButton`/`ScrollDownButton` from the DOM when there's nothing to scroll — you can't reserve space on a non-existent element.

The wrapper `div` approach is the correct and standard fix: wrap each scroll button in a `<div className="h-[25px]">` that always renders, so the dropdown height stays constant.

### Changes

**`src/components/library/NewSeriesForm.tsx`**:
- Wrap `SelectScrollUpButton` in `<div className="h-[25px]">`
- Wrap `SelectScrollDownButton` in `<div className="h-[25px]">`

**`src/components/library/SeriesCard.tsx`**:
- Replace `<SelectScrollUpButton className="min-h-[25px]" />` with `<div className="h-[25px]"><SelectScrollUpButton /></div>`
- Replace `<SelectScrollDownButton className="min-h-[25px]" />` with `<div className="h-[25px]"><SelectScrollDownButton /></div>`

