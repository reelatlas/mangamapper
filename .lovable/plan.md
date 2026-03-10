

## Rename "auth_confirmed" to "auth_success" and show auth_init immediately

**File**: `src/pages/Auth.tsx`

### Changes

1. **Show `checking` immediately on signup success**: In `authenticateUser`, set `setChecking(true)` alongside `setSignupPending(true)`.

2. **Rename label**: `// auth_checking` → `// auth_init` in `renderConfirmationView()`.

3. **Rename label**: `// auth_confirmed` → `// auth_success` in `renderConfirmationView()`.

### Flow
- Signup success → immediately shows `// auth_init...` (animated dots)
- Email confirmed + 6s → hides `auth_init`, shows `// auth_success > redirecting...`
- 6s more → redirects with "Welcome aboard!" toast

