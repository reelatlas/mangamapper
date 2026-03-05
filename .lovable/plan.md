

## Match delete button size to edit button in SeriesCard view mode

The edit button (line 446) uses `h-8 w-8` with a `w-3.5 h-3.5` icon. The delete trash button (line 460) and confirm buttons (lines 452, 455) use default `size="icon"` without explicit dimensions and `w-4 h-4` icons.

### Changes in `src/components/library/SeriesCard.tsx`

- **Line 452**: Add `h-8 w-8` to confirm-delete button, change icon to `w-3.5 h-3.5`
- **Line 455**: Add `h-8 w-8` to cancel-delete button, change icon to `w-3.5 h-3.5`
- **Line 460**: Add `h-8 w-8` to trash button, change icon to `w-3.5 h-3.5`

All three buttons in the delete flow will match the edit button's `h-8 w-8` container and `w-3.5 h-3.5` icon size.

