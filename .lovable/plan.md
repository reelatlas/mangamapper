

## Reduce signup pending phase timers

**File**: `src/pages/Auth.tsx`

Two changes in the `doRedirect` function:

1. **Checking phase**: Change the first `setTimeout` delay from `5000` to `4000`
2. **Redirecting phase**: Change the second `setTimeout` delay from `6000` to `5000`

