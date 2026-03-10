

## Change: Reduce checking phase delay from 6s to 5s

**File**: `src/pages/Auth.tsx`

In the `doRedirect` function, change the first `setTimeout` delay (the checking/auth_init phase) from `6000` to `5000`. The second timeout (redirecting phase) stays at `6000`.

### Change

**`src/pages/Auth.tsx`** — In the `doRedirect` function (~line 76), change:
```ts
checkingTimerRef.current = setTimeout(() => {
```
The delay argument from `6000` to `5000`.

