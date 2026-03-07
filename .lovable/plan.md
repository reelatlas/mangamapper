

## Fix: Sticky Nav Hidden Behind Global Header

The global `<Header>` is `sticky top-0 z-50` (height `h-14` = 3.5rem). The About page's section nav is also `sticky top-0`, so it slides behind the header.

### Changes to `src/pages/About.tsx`

1. Change the nav's sticky position from `top-0` to `top-14` (3.5rem) so it sits just below the header.
2. Update all section `scroll-mt-14` to `scroll-mt-28` (or similar) to account for both the header and the sticky nav height.

