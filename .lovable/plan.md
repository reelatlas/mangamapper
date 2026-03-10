

## Create Email Confirmation Landing Page

### 1. New file: `src/pages/AuthConfirm.tsx`

Terminal-themed confirmation page with green indicator:

- **Terminal card** matching auth aesthetic, green `■` indicator, `auth_terminal` header
- **Content**: `[✓] email_confirmed` in green syntax styling
- **Comment**: `// close this tab manually or it will attempt to close in 10 seconds ...`
- **ASCII progress bar**: 20 `▓` characters filling over 10 seconds (one every 500ms)
- **Session polling**: On mount, poll every 500ms for up to 5s via `useAuth`; if no session found, redirect to `/auth`
- **After 10s countdown**: Call `window.close()`. If blocked (tab stays open), display: `auto-close jammed → close manually at your convenience` — no redirect, page stays as-is

### 2. Update `src/hooks/useAuth.tsx`

Change `emailRedirectTo` from `${window.location.origin}/` to `${window.location.origin}/auth/confirm`

### 3. Update `src/App.tsx`

Add route: `<Route path="/auth/confirm" element={<AuthConfirm />} />`

### Manual step (you)

Add `https://www.mangamapper.com/auth/confirm` to Supabase Dashboard → Authentication → URL Configuration → Redirect URLs.

