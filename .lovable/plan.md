

## Plan: Remove new_reader indent and add active-state highlighting to reader dropdown

### 1. Remove indentation of inline new_reader form

In `src/components/library/NewSeriesForm.tsx`, line 211 has `<div className="pl-4">` wrapping the `InlineNewReaderForm`. Remove the `pl-4` class so the form is flush with the parent.

### 2. Add active-state highlighting to reader SelectTrigger

Currently the `SelectTrigger` for the reader dropdown (line 176) doesn't visually distinguish between "no selection" and "value selected." The `SeriesCombobox` uses text color differentiation — when no value is selected the text is `text-muted-foreground`, and when a value is selected it uses the default foreground color.

Apply the same pattern to the reader `SelectTrigger`:
- Change from: `data-[placeholder]:text-muted-foreground`
- To also include: when a value is selected, ensure the text renders in `text-foreground` (default) rather than staying muted. The `data-[placeholder]` attribute already handles the unselected state, so the key change is making the selected value text explicitly use `text-syntax-green` (matching the reader name color used in the `AddToReaderDropdown` component) to clearly indicate an active selection.

**File: `src/components/library/NewSeriesForm.tsx`**
- Line 176: Add conditional class — when `selectedReaderKey` is truthy, apply `text-syntax-green` to the trigger
- Line 211: Remove `pl-4` from the wrapper div

