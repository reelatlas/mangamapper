import { forwardRef, type SVGProps } from 'react';

// mangaMapper's canonical watch/read glyphs (see DESIGN_SYSTEM.md).
// Both are lucide artwork optically recentered INSIDE their own 24-unit
// frame — corrected assets, not positioning hacks:
// - TvIcon: lucide `tv` shifted up 2 units (screen y5-20). The stock glyph's
//   visual mass sits ~2.5 units below box center (thin antenna, low screen),
//   which made it hang below adjacent labels.
// - BookOpenIcon: lucide `book-open` shifted down 2 units (ink y5-23). The
//   stock glyph's page mass rides high in the frame.
// Chosen via the icon fit test, 2026-08-18. Always import these two from
// here — never raw lucide Tv/BookOpen.

const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const TvIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg ref={ref} {...svgProps} {...props}>
      <rect x="2" y="5" width="20" height="15" rx="2" />
      <polyline points="17 1 12 5 7 1" />
    </svg>
  ),
);
TvIcon.displayName = 'TvIcon';

export const BookOpenIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg ref={ref} {...svgProps} {...props}>
      <path d="M2 5h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 5h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
);
BookOpenIcon.displayName = 'BookOpenIcon';

// Canonical disclosure chevrons (stroke 2.5 for legibility at ~0.7rem).
// Drawn assets, perfectly centered by construction — a disclosure marker must
// rotate/swap inside a fixed SQUARE, flex-centered box (rotating a tall inline
// text box swings the glyph around the wrong center; the v5 caret bug).
export const ChevronRightIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg ref={ref} {...svgProps} strokeWidth={2.5} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
);
ChevronRightIcon.displayName = 'ChevronRightIcon';

export const ChevronDownIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg ref={ref} {...svgProps} strokeWidth={2.5} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
);
ChevronDownIcon.displayName = 'ChevronDownIcon';

// List glyph for the episode_list label — lucide `list` with the rows
// STRETCHED from stock y6-18 to y4-20: the stock ink fills only half the
// frame's height and read optically smaller than TvIcon (ink ~1-20) and
// BookOpenIcon (ink 5-23) at the 12px PositionLabel size. Corrected asset,
// same center, matched ink height — never a per-usage size nudge.
export const ListIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg ref={ref} {...svgProps} {...props}>
      <line x1="8" y1="4" x2="21" y2="4" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="20" x2="21" y2="20" />
      <line x1="3" y1="4" x2="3.01" y2="4" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="20" x2="3.01" y2="20" />
    </svg>
  ),
);
ListIcon.displayName = 'ListIcon';
