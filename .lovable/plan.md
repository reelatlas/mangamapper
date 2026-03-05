

## Move InlineNewReaderForm above the "+ add_another" button

Currently the `InlineNewReaderForm` renders after the `+ add_another` button (lines 380-387). Move it to render between the reader assignment rows and the button.

### Change in `src/components/library/SeriesCard.tsx`

Move lines 380-387 (the `showInlineNewReader` block) to just before line 376 (the `+ add_another` button), so the inline form appears below the last reader entry row but above the add button.

