

## Plan: Two Fixes

### 1. Add `vercel.json` for SPA fallback routing

Create a new file `vercel.json` at the project root with the standard SPA rewrite rule:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This tells Vercel to serve `index.html` for all routes, letting React Router handle them client-side. Fixes the 404-on-refresh issue.

### 2. Fix Auth.tsx redirect logic

**`src/pages/Auth.tsx`**:

- **Line 34-38**: Add `redirect` to dependency array and use `replace: true`:
  ```tsx
  useEffect(() => {
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect]);
  ```

- **Lines 68, 76, 88**: Remove the three `navigate(redirect)` calls from `authenticateUser`. The `useEffect` watching `user` will handle all navigation when auth state changes. Keep the toast messages.

