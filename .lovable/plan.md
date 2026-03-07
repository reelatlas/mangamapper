

## Hover effect on About page section headers

Each section header (the `div` with icon + `// section_name`) gets an interactive hover effect:

**Default state** (unchanged): icon + `// section_name` in muted-foreground

**Hover state**:
- Text and icon color transitions to foreground (lights up)
- Appended to the right: `>` symbol followed by 3 instances of the section's own icon, colored in the triple-arrow gradient: `text-syntax-cyan`, `text-syntax-purple`, `text-syntax-pink`
- The extended content fades/slides in with a CSS transition

**Implementation**:
- Create a reusable `SectionHeader` component (or inline it) that takes `icon`, `label` as props
- Use Tailwind `group` + `group-hover:` utilities on the header div for the color transition
- The triple icons are hidden by default (`opacity-0`, `max-w-0`) and revealed on hover (`group-hover:opacity-100`, `group-hover:max-w-[80px]`) with `transition-all`
- Apply to all 7 section headers

**File**: `src/pages/About.tsx`

