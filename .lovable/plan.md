

## Confirm: Yes, that's exactly the intended flow

Your scenario: Details page (unauthenticated) → Sign up → Confirm email → Pending flow completes → Redirect back to details page (authenticated) → **"Welcome aboard!" toast appears here**.

### The problem with the current approach

The `pending_welcome` flag is set in `Auth.tsx` line 82 right before `navigate()`. But the check for it lives in `useAuth.tsx` line 66, inside `getSession()` which only runs **once on AuthProvider mount**. Since `AuthProvider` wraps the entire app and never remounts during SPA navigation, it has already executed that check long before the flag is set. The toast never fires.

### The fix

Since this is an SPA and sonner toasts persist across React Router navigations, the simplest approach is:

1. **`src/pages/Auth.tsx`** (~line 82): Replace `sessionStorage.setItem('pending_welcome', 'true')` with `toast.success('Welcome aboard!')` directly before `navigate()`.

2. **`src/hooks/useAuth.tsx`** (~lines 66-69): Remove the dead `pending_welcome` sessionStorage check since it's no longer needed.

This is straightforward — no sessionStorage indirection, no timing issues. The toast fires in `Auth.tsx`, the navigate happens, and the toast remains visible on the destination page.

