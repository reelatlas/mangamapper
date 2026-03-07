

## Fix Active Tab Highlighting + Add Hover-Linked State

### Problem 1: Wrong tab highlighted on click
The `IntersectionObserver` picks `visible[0]` which may not be the topmost visible section. When multiple sections are visible, it should pick the one closest to the top of the viewport.

### Problem 2: Section hover should highlight corresponding nav tab
Add a `hoveredSection` state that sections set via `onMouseEnter`/`onMouseLeave`, and reflect it in the nav tab styling.

### Changes to `src/pages/About.tsx`

1. **Fix observer logic** (lines 48-53): Sort visible entries by their `boundingClientRect.top` ascending and pick the first one, so the topmost visible section wins.

2. **Also set `activeSection` on click**: In `scrollToSection`, immediately set `setActiveSection(id)` so the tab updates instantly without waiting for the observer.

3. **Add `hoveredSection` state**: `const [hoveredSection, setHoveredSection] = useState<string | null>(null);`

4. **Add mouse handlers to each section**: `onMouseEnter={() => setHoveredSection(id)}` and `onMouseLeave={() => setHoveredSection(null)}` on every `<section>`.

5. **Update nav tab styling**: Apply a hover-highlight class when `hoveredSection === item.id` (e.g., `text-syntax-cyan/70` or similar subtle highlight), distinct from the active `>` prefix style.

