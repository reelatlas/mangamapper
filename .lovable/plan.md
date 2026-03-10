

## Allow unauthenticated users to visit the Library page

Currently, the Library page redirects unauthenticated users to `/auth`. Instead, we'll show them the page with the header, title, and an `!auth_required` block matching the details page pattern.

### Change in `src/pages/Library.tsx`:

1. **Remove the redirect** — delete the `useEffect` that navigates to `/auth` when `!user` (lines 49-53).

2. **Add an unauthenticated state** — after the loading check, if `!user`, render the page shell (Header, title with `library` icon + `my_library` label) plus a centered `!auth_required` card matching the CollectionSection pattern:

```tsx
if (!user) {
  return (
    <div className="min-h-screen bg-background font-mono overflow-x-hidden">
      <Header />
      <main className="container py-8 overflow-hidden">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <LibraryIcon className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{'>'}</span>
          <span className="text-syntax-cyan">my_library</span>
        </div>
        <Card className="border-dashed">
          <div className="terminal-header">
            <span className="text-muted-foreground">library_data</span>
          </div>
          <CardContent className="py-6">
            <div className="font-mono">
              <p className="text-muted-foreground text-sm mb-4">!auth_required</p>
              <Button asChild className="border-dashed">
                <Link to="/auth" className="text-xs">{'>'} sign_in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer>...</footer>
    </div>
  );
}
```

3. **Add imports** for `Card`, `CardContent`, and `Link` (Link is already available via react-router-dom).

