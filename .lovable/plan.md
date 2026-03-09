

## Set notes field max-width to match progress inputs width

The progress section (last_watched + last_read) uses `flex-wrap` with `gap-6`. The inputs are:
- Episode: `w-24` input + gap + `/47` text
- Vol: `w-24` input
- Ch: `w-24` input
- Plus labels, icons, and `gap-6` between the two groups

Rather than hardcoding a pixel value, the cleanest approach is to wrap the progress section in a container div and give the notes edit input a `max-w` that matches. Since the combined width is roughly: 3 inputs (w-24 = 6rem each) + gaps + labels ≈ ~530px, we can use `max-w-lg` (32rem / 512px) which is close. But for exact alignment, the best approach is to wrap both the progress section and notes section content in a shared max-width constraint, or simply match the notes `Input` width to the progress row.

**Simplest accurate approach**: Add `max-w-[530px]` to the notes edit container (the `space-y-3` div on line 680), which visually aligns with the progress inputs row width shown in the screenshot.

### Change in `src/components/CollectionSection.tsx`

**Line 680**: Add `max-w-[530px]` to the notes edit container div.

```tsx
// Before
<div className="space-y-3">

// After  
<div className="space-y-3 max-w-[530px]">
```

This constrains both the text input and the save/cancel buttons to match the visual width of the combined last_watched + last_read sections.

