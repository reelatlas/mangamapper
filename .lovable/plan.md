

## Two Changes

### 1. About page — replace `Info` icon with `Fingerprint`
In `src/pages/About.tsx`, swap the `Info` import for `Fingerprint` and update the two usages (breadcrumb + `// about` section header).

### 2. Sign-out dropdown item — red hover state
In `src/components/Header.tsx`, the sign-out `DropdownMenuItem` already has `text-destructive` but inherits the default green accent hover from the theme. Add `focus:bg-destructive/15 focus:text-destructive` classes to override the hover/focus state with red styling, consistent with the cancel-button pattern used elsewhere.

