

## Change timeout durations in Auth.tsx

Update the two timeout values in the `doRedirect` function:

- **Checking phase**: 2000ms → 5000ms (line ~72 in the `setTimeout` that sets `checking` to false)
- **Redirecting phase**: 3000ms → 4000ms (line ~76 in the `setTimeout` that navigates)

Single file change: `src/pages/Auth.tsx`

