

## Changes to `src/pages/Auth.tsx`

**1. Remove the "// check your inbox to confirm" text**
- Delete the `<div className="mb-6">` block (lines 170-174) inside the `signupPending` branch.

**2. Change re_wind behavior when in signupPending state**
- When `signupPending` is true, clicking re_wind should reset back to the signup form: set `signupPending` to `false`, `emailConfirmed` to `false`, `redirecting` to `false`, and `isLogin` to `false`.
- When not in signupPending, keep existing behavior (navigate back or to `/`).

