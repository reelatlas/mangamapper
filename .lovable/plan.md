

## Accordion-style collapsible sections on the About page

### What changes

Each of the 7 sections (welcome, features, solve_for(pain), why_build, built_with, feedback, support) becomes collapsible:

- **Default state**: All collapsed, showing only the `SectionHeader` row with a `TripleArrow` pinned to the far right.
- **Accordion behavior**: Only one section open at a time. Clicking a new section closes the currently open one.
- **Hover in collapsed state**: The existing `group/card` hover transitions (border appearing, header icon animations) still fire even when collapsed.

### Implementation

1. **Add `openSection` state** to `About` component -- a `string | null` tracking which section key is open (e.g. `'welcome'`, `'features'`, etc.). Default to `null`.

2. **Update `SectionHeader`** to:
   - Accept `isOpen`, `onToggle` props
   - Remove `mb-3` (margin handled by content visibility)
   - Add `TripleArrow` aligned far-right using `ml-auto` with `collapsed={!isOpen}`
   - Make the header row clickable (`onClick={onToggle}`, `cursor-pointer`)

3. **Wrap each section's body content** in a conditional render (`{isOpen && (...)}`) or use Radix Collapsible per section. Conditional render is simpler here since we're not animating open/close.

4. **Each `<section>`** keeps `group/card` class and hover border/transitions so hovering a collapsed section still shows the dashed border and header icon animations.

5. **Toggle logic**: `setOpenSection(prev => prev === key ? null : key)` -- clicking the open section closes it, clicking another opens it and closes the previous.

6. The existing inner `crypto_wallets` Collapsible within the support section remains independent.

### Section keys
`'welcome' | 'features' | 'pain' | 'why' | 'built' | 'feedback' | 'support'`

