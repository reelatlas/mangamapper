

## Plan: Pin "+ new_reader" at bottom of Select dropdown

**Goal**: Keep the `+ new_reader` option always visible (pinned at the bottom) while the reader entries above it scroll when they overflow.

**Approach**: Restructure the `SelectContent` so the scrollable `Viewport` only contains the reader options, while the separator and `+ new_reader` item sit outside the viewport as a fixed footer. Radix Select supports content outside the `Viewport` — we just need to manually render the `Viewport` instead of relying on the default auto-wrapping.

**Changes in `NewSeriesForm.tsx` (lines ~166-176)**:

Replace the current `SelectContent` block with a structure where:
1. The `SelectPrimitive.Viewport` wraps only the `readerOptions.map(...)` items, with `max-h` and `overflow-y-auto` so they scroll
2. The `SelectSeparator` and `+ new_reader` `SelectItem` sit after the viewport, always visible at the bottom

This is a single-file, ~10-line change in the JSX render section. No new state or logic needed.

