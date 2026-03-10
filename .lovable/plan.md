

## Add library link to header for non-authenticated users

In `src/components/Header.tsx`, the `else` branch (non-authenticated, lines 80-90) currently shows: home, about, sign_in.

### Change:
Add a `library` nav button between `home` and `about` in the non-authenticated section, matching the same style as the authenticated library link:

```tsx
<Button variant="ghost" size="sm" asChild className="font-mono text-xs">
  <Link to="/library" className="flex items-center gap-1.5">
    <Library className="w-3.5 h-3.5" />
    <span className="hidden sm:inline">library</span>
  </Link>
</Button>
```

This pairs with the `!auth_required` state we already added to the Library page.

