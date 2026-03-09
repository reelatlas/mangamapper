

## Root Cause

When you switch browser tabs and return, Supabase's `onAuthStateChange` fires (token refresh). This creates a **new `user` object reference** in the AuthProvider. The `useEffect` in `useLibraryData` (line 75-79) depends on `user`, so it calls `fetchData()`, which sets `loading = true` (line 41). Back in `Library.tsx`, the loading guard (lines 69-80) **unmounts all form components**, destroying all in-progress form state.

Two problems:
1. **`useEffect` triggers on every `user` object change**, even when it's the same user (just a refreshed token)
2. **`fetchData` sets `loading = true`**, which unmounts the forms even though data is just being silently refreshed

## Fix

### 1. `src/hooks/useAuth.tsx` — Stabilize user reference
Track the user ID separately and only update the `user` state when the actual user changes (different ID or sign-out), not on every token refresh.

### 2. `src/hooks/useLibraryData.ts` — Don't show loading on refetch
- Track whether data has been fetched at least once with a `hasInitiallyLoaded` ref
- Only set `loading = true` on the **first** fetch; subsequent refetches update data silently without unmounting forms
- Use `user?.id` as the dependency instead of the full `user` object

### Changes Summary

**`useAuth.tsx`**: Use a ref to compare user IDs, only call `setUser` when the ID actually changes. This prevents downstream effects from firing on token refreshes.

**`useLibraryData.ts`**: 
- Add a `useRef` for `initialLoadDone`
- `fetchData` only sets `setLoading(true)` when `!initialLoadDone.current`
- Change `useEffect` dependency from `[user]` to `[user?.id]`

This is a minimal, non-breaking fix — no form logic or component structure needs to change.

