
Goal: make section-tab clicks always land with the section title fully visible below both sticky bars (global header + About tabs), across desktop/mobile and wrapped tab rows.

Implementation plan

1) Replace fixed anchor offset with measured offset at click time
- In `src/pages/About.tsx`, stop relying only on `scrollIntoView({ block: "start" })` for tab clicks.
- Add a small helper (e.g. `scrollToSection(id)`) that:
  - finds the target section,
  - measures current sticky heights:
    - global header height (`header` element),
    - About tabs nav height (via `ref` on the tabs nav),
  - computes `top = section.getBoundingClientRect().top + window.scrollY - (headerHeight + tabsHeight + gap)`,
  - uses `window.scrollTo({ top, behavior: "smooth" })`.
- Use this helper in each tab button `onClick`.

Why: current fixed `scroll-mt-28` is static; tabs can wrap to multiple lines on smaller widths, so real sticky height becomes larger and content gets cut off.

2) Make per-section offset dynamic (not fixed Tailwind class)
- Keep section ids as-is.
- Replace hardcoded `scroll-mt-28` with inline `style={{ scrollMarginTop: computedOffsetPx }}` (or a CSS var) so browser anchor behavior and manual hash navigation also land correctly.
- Compute this offset from the same measured sticky heights above, and update on:
  - initial mount,
  - window resize,
  - nav reflow (if tab row wrapping changes).

3) Keep sticky layering correct and explicit
- Keep About tabs sticky below header (`top-14`) and ensure z-order doesn’t conflict:
  - global header remains highest (`z-50`),
  - About tabs below it (e.g. `z-40`/`z-30`).
- Ensure tabs container has solid/semi-solid background so section text never bleeds through.

4) Align active-section detection with new visual offset
- Update `IntersectionObserver` config so active tab switches based on the visible content area below sticky bars (adjust root margin to account for measured sticky stack).
- This avoids “active tab lag” where highlight changes too early/late after the offset fix.

5) Verify behavior
- Test tab click jumps for all sections at:
  - desktop width (single-row tabs),
  - narrow/mobile width (wrapped tabs).
- Confirm top line of each section is always visible below sticky bars.
- Confirm sticky tabs remain visible while scrolling and active tab updates correctly.

Files to update
- `src/pages/About.tsx` (primary: dynamic measuring, click scroll helper, dynamic scroll margin, observer tuning)
- `src/components/Header.tsx` (only if needed to add a stable selector/data-attr for reliable header height measurement)

Acceptance criteria
- Clicking any About tab never positions section content under the global header/tabs.
- Works consistently even when the tabs nav height changes (wraps).
- Sticky tabs remain visible and maintain correct active-state highlighting.
