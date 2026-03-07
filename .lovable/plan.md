

## Replace bullets with tree-style markers on About page

In `src/pages/About.tsx`, replace all `*` bullet markers with tree-style characters:
- Use `├─` for all items except the last in each list
- Use `└─` for the last item in each list

This applies to all `<ul>` lists across all 7 sections (welcome, features, pain_points_solved, why_build, built_with, feedback, support).

### File changed
- `src/pages/About.tsx` — swap every `*` bullet span to `├─` or `└─` based on position in list

