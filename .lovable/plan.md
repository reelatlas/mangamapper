

## Show "Welcome aboard!" toast after landing on the destination page (not before redirect)

**Problem**: Currently the toast fires on the Auth page right before `navigate()`. The user wants it to appear *after* they've landed on their destination.

**Approach**: Use `sessionStorage` to flag that a welcome toast is needed, then show it on the destination page.

1. **`src/pages/Auth.tsx`** — Remove `toast.success('Welcome aboard!')` from the `doRedirect` timeout. Instead, set `sessionStorage.setItem('pending_welcome', 'true')` before calling `navigate()`.

2. **`src/hooks/useAuth.tsx`** — In the `onAuthStateChange` listener (or in the initial session check), after setting the user, check for `sessionStorage.getItem('pending_welcome')`. If found, remove it and fire `toast.success('Welcome aboard!')`. This mirrors the existing `pending_oauth_signin` pattern already in place.

