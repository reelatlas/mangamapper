
Goal: make the episode-list hover text spacing visually identical to the reader hover pattern from your second screenshot.

Plan:
1. Use the reader hover snippet as the source-of-truth spacing pattern
   - Match the same visual structure used in `CollectionSection` (`reader(null) > add_reader`), especially the gap before the caret.

2. Update the episode hover row in `src/pages/AnimeDetail.tsx`
   - Keep `// show X of Y` as the base text.
   - Increase the caret hover offset from the current tighter spacing to the same spacing used in the reader row (the `ml-2` style pattern).
   - Preserve existing hover behavior (`opacity` transition) and text content (`show_episodes(all|less)`).

3. Keep everything else unchanged
   - No logic/data changes.
   - No typography/color changes.
   - Only spacing/alignment adjustments for hover consistency.

4. Validation after implementation
   - On `/anime/:id`, hover `// show ...`.
   - Confirm spacing between the final number and `>` matches the spacing in `// reader(null) > add_reader`.
   - Check both states:
     - collapsed (`show N of total`)
     - expanded (`show total of total`, hover still aligned).
   - Quick visual check on mobile width to ensure spacing still looks balanced.

Technical details (exact target):
- File: `src/pages/AnimeDetail.tsx`
- Target block: episode-list hover text row (the `group` container with `show ...` and hover `> show_episodes(...)` span).
- Primary adjustment: align caret gap with the established `ml-2` hover pattern used elsewhere.
