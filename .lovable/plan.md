

## Plan: Standardize border-radius across all components

### CSS variable
- `src/index.css`: `--radius: 0.125rem` → `--radius: 0.25rem`

### Change to `rounded-lg`
| File | Element | Current |
|------|---------|---------|
| `button.tsx` | base cva | `rounded-none` |
| `textarea.tsx` | textarea | `rounded-md` |
| `select.tsx` | trigger | `rounded-md` |
| `select.tsx` | content | `rounded-md` |
| `dropdown-menu.tsx` | subcontent | `rounded-md` |
| `dropdown-menu.tsx` | content | `rounded-md` |
| `popover.tsx` | content | `rounded-md` |
| `tooltip.tsx` | content | `rounded-md` |
| `tabs.tsx` | list | `rounded-md` |
| `toast.tsx` | toast | `rounded-md` |
| `toast.tsx` | action | `rounded-md` |
| `toast.tsx` | close | `rounded-md` |
| `command.tsx` | root | `rounded-md` |
| `skeleton.tsx` | div | `rounded-md` |
| `menubar.tsx` | root | `rounded-md` |
| `menubar.tsx` | content | `rounded-md` |
| `menubar.tsx` | subcontent | `rounded-md` |
| `SearchBar.tsx` | outer div | `rounded-none` |
| `input-otp.tsx` | first slot | `rounded-l-md` → `rounded-l-lg` |
| `input-otp.tsx` | last slot | `rounded-r-md` → `rounded-r-lg` |
| `NewSeriesForm.tsx` | custom select content | `rounded-md` |

Already `rounded-lg` (no change needed): card, input, dialog, alert-dialog, alert, chart tooltip, MangaMappingDisplay.

### Keep `rounded-full`
- `badge.tsx` — stays `rounded-full`
- `AnimeDetail.tsx` status badge — stays `rounded-full`

### Unchanged
- Functional shapes: avatar, switch, progress, slider thumb (`rounded-full`), resizable handle (`rounded-sm`)
- Inner item highlights: select items, dropdown items, command items, menubar items, tabs triggers, checkbox (`rounded-sm`)

~15 files, ~22 class changes total.

