

## Fix: Detect existing account on signup

**File**: `src/pages/Auth.tsx`

**Problem**: Supabase returns `{ error: null, data: { user: { identities: [] } } }` for duplicate signups when email confirmation is required. The current code only checks for `error`, so it proceeds to the confirmation flow.

**Fix**: In the signup `else` branch (~line 141), check if the returned user has an empty `identities` array. If so, show `toast.error('Account already exists')` and don't transition to `signupPending`.

**Also needs**: Update `useAuth.tsx` `signUp` to return the `data` object so `Auth.tsx` can inspect `data.user.identities`.

### Changes

1. **`src/hooks/useAuth.tsx`** — Change `signUp` return type to include `data`:
   ```ts
   const signUp = async (email, password) => {
     const { data, error } = await supabase.auth.signUp({ ... });
     return { data, error };
   };
   ```

2. **`src/pages/Auth.tsx`** — In `authenticateUser`, after signup succeeds (no error), check identities:
   ```ts
   const { data, error } = await signUp(userEmail, userPassword);
   if (error) {
     // existing error handling
   } else if (!data?.user?.identities?.length) {
     toast.error('Account already exists');
   } else {
     toast.success('Account created');
     setChecking(true);
     setSignupPending(true);
   }
   ```

