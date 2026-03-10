

## Fix: Move sessionStorage cleanup to after navigation

The bug: `sessionStorage.removeItem('redirectAfterLogin')` runs during the `useState` initializer on mount. When the user first visits `/auth?redirect=/library` and clicks Google sign-in, the initializer runs, reads the stored value, and immediately deletes it. After OAuth redirects back to `/auth`, the component mounts again — but the stored value is already gone.

### Change in `src/pages/Auth.tsx`

**Lines 32-39** — Stop removing from sessionStorage on mount; just read it:

```tsx
const [redirect] = useState(() => {
  const stored = sessionStorage.getItem('redirectAfterLogin');
  return stored || searchParams.get('redirect') || '/';
});
```

**Lines 41-45** (the useEffect) — Remove from sessionStorage only after successful navigation:

```tsx
useEffect(() => {
  if (user) {
    sessionStorage.removeItem('redirectAfterLogin');
    navigate(redirect, { replace: true });
  }
}, [user, navigate, redirect]);
```

No other files change.

