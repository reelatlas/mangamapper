

## Updated flow: Delay confirmed state by 2s with checking animation

**Full sequence after tab becomes visible:**

1. **0-2s ("checking" phase)**: Show `// auth_checking<AnimatedDots/>` below the confirmation view. Checkbox stays unchecked, all text stays muted (default state), terminal header stays yellow. Even though `emailConfirmed` is true internally, the UI doesn't reflect it yet.
2. **After 2s ("confirmed" phase)**: Checkbox flips to checked+green, `confirm_email` turns green, `sign_in` turns white, terminal `■` turns green. Text switches to `// auth_confirmed > redirecting<AnimatedDots/>`.
3. **After 3s more**: Navigate to destination.

### Changes to `src/pages/Auth.tsx`

**New state & component:**
- Add `checking` boolean state (default false)
- Add `visuallyConfirmed` boolean state (default false) — controls when the UI flips to the confirmed look
- Add `AnimatedDots` component: cycles `.` → `..` → `...` every 400ms via `useEffect`/`setInterval`

**Update `doRedirect` (~line 61-68):**
```
setChecking(true);
checkingTimer = setTimeout(() => {
  setChecking(false);
  setVisuallyConfirmed(true);
  setRedirecting(true);
  redirectTimer = setTimeout(() => navigate(...), 3000);
}, 2000);
```

**Update `renderConfirmationView` (~lines 136-156):**
- Use `visuallyConfirmed` instead of `emailConfirmed` for checkbox, text colors
- When `checking`: show `// auth_checking<AnimatedDots/>`
- When `redirecting`: show `// auth_confirmed > redirecting<AnimatedDots/>`

**Update terminal header (~line 164):**
- Change condition from `signupPending && emailConfirmed` to `signupPending && visuallyConfirmed`

**Cleanup:** Clear both timers on unmount.

