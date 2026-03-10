

## Update timeout durations in Auth.tsx

Simple change to two timeout values in the `doRedirect` function:

- **Checking phase**: 5000ms → **6000ms**
- **Redirecting phase**: 4000ms → **6000ms**

Single file: `src/pages/Auth.tsx`

