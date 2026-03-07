

## Sticky Section Navigation

Make the section nav bar sticky so it remains visible while scrolling, and add an active state indicator to show which section is currently in view.

### Changes to `src/pages/About.tsx`

1. **Sticky nav**: Add `sticky top-0 z-10 bg-background` classes to the `<nav>` element so it stays fixed at the top when scrolling.

2. **Active section tracking**: Use `IntersectionObserver` to detect which section is currently in the viewport and highlight the corresponding nav link (e.g., `text-foreground` for active, default muted for others).

3. **Increase `scroll-mt`** on each section to account for the sticky nav height (e.g., `scroll-mt-16`).

This gives users a persistent frame of reference and visual feedback on where they are in the page.

