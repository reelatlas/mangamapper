

## Show "Welcome aboard!" toast after signup confirmation redirect

**Problem**: After signup + email confirmation, the `SIGNED_IN` event fires but the toast logic in `useAuth.tsx` only triggers for OAuth flows (checks `pending_oauth_signin`). The `signIn` function handles email/password login toasts, but signup confirmation goes through neither path.

**Fix in `src/pages/Auth.tsx`**: Add `toast.success('Welcome aboard!')` right before the `navigate()` call inside `doRedirect`, so it fires just as the user is redirected after the full checking → confirmed → redirecting sequence completes.

This is always "Welcome aboard!" (never "Welcome back!") because this code path only runs for fresh signups.

