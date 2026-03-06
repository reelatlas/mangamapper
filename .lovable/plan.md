

## Restructure About Page with New Content

Replace the current about page content with the user's reworked copy, organized into 6 sections using the existing terminal/dashed-border aesthetic.

### Sections

1. **// welcome** — Intro prose with poetic tone. "welcome traveler..." paragraph, then bullet list for the call to action ("consult your mapper"). Use `text-syntax-cyan` for key terms like `mangaMapper`, `text-syntax-green` for action phrases.

2. **// features** — Bullet list of core features. Use `text-syntax-purple` for terms like `last_watched`, `last_read`. Icon: `Sparkles` or `Zap`.

3. **// pain_points_solved** — Bullet list addressing what problems the app solves. Icon: `Target` or `ShieldCheck`.

4. **// why_build** — Personal motivation bullets. Icon: `Lightbulb` or `HelpCircle`.

5. **// built_with** — Key-value pairs for stack and tools using the existing syntax-color pattern (`text-syntax-purple` for keys, `text-syntax-green` for values). Icon: `Code`.

6. **// feedback** — Bullet list of welcome feedback types, then `send_to` styled as a terminal command with `newestArc@gmail.com`. Icon: `MessageSquare`.

7. **// support** — Short line about what support goes toward (ai tokens, api credits, hosting, sushi). Icon: `Heart`.

### Styling approach
- Same `border border-dashed p-5` card pattern per section
- Bullet points rendered as `<ul>` with custom `* ` prefix styling (or `text-muted-foreground` bullet markers)
- Sentence casing throughout (per project constraint), preserving proper names
- Footer unchanged

### File changed
- `src/pages/About.tsx` — full rewrite of the sections grid

