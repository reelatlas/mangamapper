

## Plan: Persist redirect target through Google OAuth round trip

### Problem
Google OAuth redirects the user away from the app entirely, so the `?redirect=` query param is lost when Supabase redirects back to `/auth`. The `useEffect` then reads `redirect` as `"/"`.

### Fix: `src/pages/Auth.tsx`

1. **Capture redirect once on mount** using `useState` initializer, checking `sessionStorage` first (for returning OAuth users), then URL param, then defaulting to `"/"`:

```tsx
const [searchParams] = useSearchParams();
const [redirect] = useState(() => {
  const stored = sessionStorage.getItem('redirectAfterLogin');
  if (stored) {
    sessionStorage.removeItem('redirectAfterLogin');
    return stored;
  }
  return searchParams.get('redirect') || '/';
});
```

2. **Save to sessionStorage before Google sign-in** — in the Google button's `onClick`, before calling `signInWithGoogle`:

```tsx
sessionStorage.setItem('redirectAfterLogin', redirect);
```

3. **Remove the old `redirect` derived variable** (line 32) since it's now captured in state.

The `useEffect` watching `user` stays exactly as-is — it already uses `redirect` and `{ replace: true }`. No other files need changes.

