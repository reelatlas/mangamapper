

## Fix: Library page stuck loading for non-authenticated users

**Root cause**: In `useLibraryData`, `loading` starts as `true` and only becomes `false` after `fetchData()` runs — but `fetchData()` only runs when `user` exists. So for unauthenticated users, `loading` stays `true` forever, and the Library page never gets past the `if (authLoading || loading)` check on line 65.

### Change in `src/hooks/useLibraryData.ts`

In the `useEffect` that calls `fetchData`, add an `else` branch to set `loading = false` when there's no user:

```ts
useEffect(() => {
  if (user) {
    fetchData();
  } else {
    setLoading(false);
  }
}, [user?.id]);
```

This ensures that once auth resolves with no user, `loading` becomes `false`, allowing the `!user` block in Library.tsx to render.

