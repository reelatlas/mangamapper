

## Changes in `src/pages/Auth.tsx`

**1. Redirect text (line ~153)** — Change from `// auth_confirmed — redirecting...` to `// auth_confirmed > redirecting...`

**2. Terminal header color (line ~164)** — Make `■` green (`text-syntax-green`) when `signupPending && emailConfirmed`, yellow (`text-syntax-amber`) otherwise.

