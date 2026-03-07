

## Make entire card clickable for expand/collapse

### Approach

Move the `onClick={onToggle}` from the `SectionHeader` div up to each `<section>` element. Add `e.stopPropagation()` on interactive child elements to prevent interference:

1. **Section `<section>` gets `onClick={() => toggleSection(key)}` and `cursor-pointer`** -- remove `onClick` and `cursor-pointer` from `SectionHeader`.

2. **Stop propagation on internal interactive elements:**
   - Copy buttons (email, crypto addresses) -- already have `onClick`, just add `e.stopPropagation()` 
   - `CollapsibleTrigger` for `crypto_wallets` -- add `onClick={e => e.stopPropagation()}`

3. **SectionHeader** loses its `onClick`/`onToggle` prop and `cursor-pointer` since the parent section handles it.

### Files changed
- `src/pages/About.tsx`

