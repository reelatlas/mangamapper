

## Fix: Pass redirect path to signInWithGoogle

### Root cause
`Auth.tsx` line 183 calls `signInWithGoogle()` with no argument. The function in `useAuth.tsx` already supports a `redirectPath` parameter and builds the correct `?redirect=` URL — it's just never receiving the value.

### Changes

**`src/pages/Auth.tsx` (line 183)**

Change:
```tsx
const { error } = await signInWithGoogle();
```
To:
```tsx
const { error } = await signInWithGoogle(currentRedirect);
```

That's it — one line. The `signInWithGoogle` function already handles building the redirect URL with the path. Both `sessionStorage` (line 182) and the OAuth redirect URL will now carry the path as mutual fallbacks.

