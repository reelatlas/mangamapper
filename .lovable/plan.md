

## Post-Signup Confirmation Step in Auth Terminal

### Overview
After successful signup, instead of just showing a toast, transition the auth terminal to a "waiting for confirmation" view. Use the Page Visibility API to ensure the user sees the confirmed state before redirecting.

### Changes to `src/pages/Auth.tsx`

**1. New state: `signupPending`**
- Add `const [signupPending, setSignupPending] = useState(false)` and `const [emailConfirmed, setEmailConfirmed] = useState(false)`
- On successful signup, set `signupPending = true` instead of navigating away
- Shorten toast to just `'Account created'`

**2. Conditional rendering**
- When `signupPending` is true, replace the form content (inputs + buttons) with:
  - Same terminal header (yellow `■`, `auth_terminal`)
  - Muted text: `[ ] confirm_email to sign_in` (no checkmark, all muted)
  - When confirmed: `[✓] confirm_email` in green, `to` in muted, `sign_in` in white/foreground

**3. Listen for email confirmation via `onAuthStateChange`**
- Inside a `useEffect` that runs when `signupPending` is true, listen for `SIGNED_IN` event
- When detected, set `emailConfirmed = true`, update the checkbox display

**4. Page Visibility API + delayed redirect**
- When `emailConfirmed` becomes true:
  - If `document.visibilityState === 'visible'` → wait 3s then redirect
  - If hidden → listen for `visibilitychange`, once visible → wait 3s then redirect
- Show `// auth_confirmed — redirecting...` as muted text below the checkbox once confirmed and tab is visible

### Flow
```text
User fills form → clicks sign_up()
        ↓
Account created → toast "Account created"
        ↓
Terminal switches to: [ ] confirm_email to sign_in
        ↓
User confirms in another tab
        ↓
onAuthStateChange fires SIGNED_IN
        ↓
[✓] confirm_email  to  sign_in  (green checkbox, white sign_in)
        ↓
Wait for tab visibility → 3s delay → redirect
```

### File: `src/pages/Auth.tsx` only

