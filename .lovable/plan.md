

## Fix Email Signup/Signin Flow

There are two issues here, one in Supabase config and one in the codebase:

### Issue 1: Email Confirmation (Supabase Dashboard)
By default, Supabase may have email confirmations disabled, which auto-confirms users on signup. You need to enable it in your Supabase dashboard:

**Authentication → Providers → Email → Enable email confirmations** (toggle ON)

This is at: https://supabase.com/dashboard/project/ysjnqbnbtftjdepovpkt/auth/providers

Once enabled, users must click the confirmation link in their email before they can sign in. This explains why login fails — if confirmation was recently enabled, previously unconfirmed accounts can't sign in.

### Issue 2: Misleading Toast Message (Code Fix)
In `src/pages/Auth.tsx` line 85, the signup success toast says `"Account created! You are now logged in."` — this is wrong when email confirmation is required. The user isn't logged in yet.

**Change line 85** from:
```tsx
toast.success('Account created! You are now logged in.');
```
to:
```tsx
toast.success('Account created! Check your email to confirm your account before signing in.');
```

Also update the test account auto-creation toast on line 68 similarly, since even test accounts need confirmation when the setting is on. Alternatively, consider removing the auto-signup-on-failed-login logic for the test account (lines 59-69) since it won't work with email confirmation enabled anyway.

### Summary
- **Dashboard change** (you do this): Enable email confirmations in Supabase Auth settings
- **Code change** (one line): Update the signup success toast to tell users to check their email
- **Optional cleanup**: Remove the test account auto-creation logic since it's incompatible with email confirmation

