

## Plan: Make `// reader(null)` more visually interactive

**Goal:** Signal to the user that `// reader(null)` is hoverable/clickable.

**Changes in `src/components/CollectionSection.tsx` (line ~540-548):**

1. Color the `//` prefix with `text-syntax-cyan` (matching the comment-style convention used elsewhere in the app)
2. Add a subtle `hover:text-foreground` transition on the whole span to hint at interactivity
3. Keep the existing hover behavior (showing `> add_reader`)

**Also update `src/components/library/SeriesCard.tsx` (line ~485)** to match the same styling for consistency — color the `reader(null)` text similarly with a cyan `//` prefix if not already present.

**Technical details:**
- Split the text into `<span className="text-syntax-cyan">//</span> reader(null)` 
- Add `transition-colors hover:text-foreground` to the parent span for a subtle hover cue

