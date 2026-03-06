

## Problem

The hover group is on the outer `div` (`group/readers`), so hovering anywhere in the section (including the label) triggers the blue highlight and `> add_reader`. The user wants:

1. Only hovering over `reader(null)` triggers both the label turning blue AND `> add_reader` appearing — simultaneously
2. Hovering over just the "readers" label should do nothing

## Plan

**Move the hover group from the outer container to the `reader(null)` span**, and use that group to drive both the label color change and the `> add_reader` visibility.

Since the label is a sibling (not a child) of `reader(null)`, we can't use Tailwind's `group-hover` directly from child to sibling above. Instead:

- Remove `group/readers` from the outer div
- Add a new wrapper with `group/readernull` around just the `reader(null)` span area
- Move `cursor-pointer` and `onClick` to that wrapper only
- For the label color change: since CSS can't go "upward," we'll use a CSS peer approach — place the hoverable `reader(null)` element before the label using `flex-col-reverse` or use a different approach:

Actually, the simplest approach: **restructure so the `reader(null)` row comes first in DOM order** using `flex flex-col-reverse`, or better yet, just put the group on the `reader(null)` span and use JavaScript state (`onMouseEnter`/`onMouseLeave`) to toggle the label highlight.

**Cleanest approach**: Use a small `isReaderHovered` state:

1. Add `const [isReaderHovered, setIsReaderHovered] = useState(false)` 
2. On the `reader(null)` span: add `onMouseEnter`/`onMouseLeave` to toggle it
3. On the icon and label: use `isReaderHovered` to conditionally apply blue classes
4. Keep `> add_reader` visibility tied to the same hover state
5. Remove `group/readers` from outer div, remove `group-hover/readers:` classes
6. Keep `onClick={startEditing}` on the `reader(null)` span only

### Changes in `src/components/CollectionSection.tsx`:

- **Line 489**: Remove `group/readers` and `cursor-pointer` from outer div, remove `onClick`
- **Line 493-494**: Change icon/label classes to use `isReaderHovered` conditional instead of `group-hover/readers`
- **Lines 509-512**: Add `onMouseEnter`/`onMouseLeave` and `onClick={startEditing}` and `cursor-pointer` to the `reader(null)` span; change `> add_reader` from `group-hover` to conditional on `isReaderHovered`

