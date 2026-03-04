

## Plan: Fix Cover Image Aspect Ratio and Fallback Sizing

### Problem
`w-14` (3.5rem) with `object-cover` crops the image horizontally since anime covers are typically portrait ratio (~2:3). The fallback div also uses fixed `max-h-[5rem]` which may not match the actual rendered image height.

### Fix — `src/components/library/SeriesCard.tsx`

1. **Image**: Change from `w-14 object-cover` to `w-16 object-contain` (4rem width). `object-contain` preserves the full image without cropping. The image will scale to fit within the box while maintaining its natural aspect ratio.

2. **Fallback div**: Change from `w-14 min-h-[5rem] max-h-[5rem]` to `w-16 self-stretch` so it matches the image width and stretches to the same height as the card content (driven by `items-stretch` on the parent flex). This ensures fallback and image containers are identical in size.

Both elements keep `shrink-0` to prevent flex compression.

| Element | Before | After |
|---------|--------|-------|
| `img` | `w-14 object-cover` | `w-16 object-contain` |
| fallback div | `w-14 min-h-[5rem] max-h-[5rem]` | `w-16 self-stretch` |

