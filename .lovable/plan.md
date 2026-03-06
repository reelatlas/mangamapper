

## About Page

Create a new `/about` page following the existing terminal/code-inspired aesthetic with dashed borders, mono fonts, and muted foreground text.

### Structure

The page will use the same layout pattern as other pages (Header + container). Content will be organized as code-style comment blocks/sections:

1. **// about** - Brief description of what mangaMapper does (track manga-to-anime adaptations, map reading progress)
2. **// built_with** - How/why it was made (tech stack mention, motivation)
3. **// feedback** - Contact info for suggestions (email or link, styled as a terminal prompt)
4. **// support** - Placeholder text about token credits / donations (just informational text for now, no payment integration)

Each section will use the dashed border card style consistent with the rest of the app.

### Changes

1. **Create `src/pages/About.tsx`** - New page component with the four sections
2. **Update `src/App.tsx`** - Add `/about` route
3. **Update `src/components/Header.tsx`** - Add "about" nav link (Info icon)

