

## Fix: Read redirect inside useEffect instead of useState

The `useState` initializer captures a stale snapshot of `searchParams` at mount time. If `onAuthStateChange` fires before the component fully processes the URL, the redirect value is already locked to `"/"`.

### Change: `src/pages/Auth.tsx`

1. **Remove** the `const [redirect] = useState(...)` block (lines ~32-35)
2. **Remove** `redirect` from the `useEffect` dependency array
3. **Update the useEffect** to read fresh values inline:

```tsx
useEffect(() => {
  if (user) {
    const stored = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    const destination = stored || searchParams.get('redirect') || '/';
    navigate(destination, { replace: true });
  }
}, [user, navigate, searchParams]);
```

No other files change.

