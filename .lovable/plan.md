

## Differentiate First-Time vs Returning Sign-In Toasts

**Approach:** Use the Supabase `User` object's `created_at` and `last_sign_in_at` timestamps. On a first-ever sign-in (after email confirmation), these values will be very close together (within ~60 seconds). For returning users, they'll differ significantly.

**Changes in `src/hooks/useAuth.tsx`:**

1. Create a helper function:
```ts
const isFirstSignIn = (user: User): boolean => {
  const created = new Date(user.created_at).getTime();
  const lastSignIn = new Date(user.last_sign_in_at || user.created_at).getTime();
  return Math.abs(lastSignIn - created) < 60_000; // within 60 seconds
};
```

2. Update the `signIn` function toast (line ~80):
   - From: `toast.success('Welcome back!')`
   - To: check `isFirstSignIn(data.user)` → `'Welcome aboard!'` or `'Welcome back!'`
   - This requires capturing the sign-in response's `data` (currently only destructuring `error`)

3. Update the `onAuthStateChange` OAuth toast (line ~46):
   - Use the same `isFirstSignIn` check on `session.user` to show the correct message

