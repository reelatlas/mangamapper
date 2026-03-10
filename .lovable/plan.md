

## Fix: Post-login redirect causing 404

### Root Cause

There are two issues:

1. **Google OAuth (live site)**: After completing Google sign-in, the `onAuthStateChange` handler calls `window.location.replace('/library')`. This triggers a **full server-side page load**, not a React Router navigation. If the hosting server doesn't serve `index.html` for all routes (SPA fallback), this results in a 404.

2. **Redirect logic is split across two places** — `Auth.tsx` (for email/password) and `useAuth.tsx` `onAuthStateChange` (for OAuth). This makes the flow fragile and inconsistent.

### Fix: Centralize all redirects through React Router

**`src/hooks/useAuth.tsx`**:
- Accept an optional `redirectTo` parameter in `signInWithGoogle` 
- For the non-popup OAuth flow (live site), set Supabase's `redirectTo` to `/auth?redirect=<path>` instead of just `/`. This way when Google sends the user back, they land on the Auth page which already has the redirect logic via its `useEffect`
- Remove the `post_login_redirect` sessionStorage logic and `window.location.replace` from `onAuthStateChange` entirely

**`src/pages/Auth.tsx`**:
- Pass the `redirect` value to `signInWithGoogle(redirect)` 
- Remove the `sessionStorage.setItem('post_login_redirect', redirect)` from the Google button handler — no longer needed
- The existing `useEffect` that watches `user` and calls `navigate(redirect)` handles everything

### Flow after fix

```text
User on /library (not signed in)
  → clicks "sign_in" → /auth?redirect=/library
  → signs in (email or Google)
  → Auth.tsx useEffect sees user → navigate("/library")
  → React Router client-side navigation (no server hit, no 404)
```

For Google OAuth specifically:
```text
Auth page stores redirect in ?redirect param
  → Google OAuth redirectTo = /auth?redirect=/library
  → Google flow completes → lands back on /auth?redirect=/library
  → onAuthStateChange sets user → Auth.tsx useEffect fires
  → navigate("/library") via React Router
```

### Changes Summary

| File | Change |
|------|--------|
| `src/hooks/useAuth.tsx` | Add `redirectPath` param to `signInWithGoogle`; use it in OAuth `redirectTo`; remove `post_login_redirect` sessionStorage and `window.location.replace` |
| `src/pages/Auth.tsx` | Pass `redirect` to `signInWithGoogle(redirect)`; remove `sessionStorage.setItem('post_login_redirect', ...)` |

