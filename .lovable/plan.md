

## Smart post-login redirect using `?redirect=` query parameter

### Approach
Pass the current page path as a `redirect` query param when linking to `/auth`. After successful sign-in/sign-up, navigate to that redirect path (defaulting to `/`).

### Changes

**1. Update all `Link to="/auth"` to include redirect param:**

- **`src/components/Header.tsx`** (line 93): `to="/auth"` — no redirect param needed (default `/` is correct for global nav)
- **`src/components/CollectionSection.tsx`** (line 418): Pass current path, e.g. `` to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} ``
- **`src/pages/Library.tsx`** (line 96): `` to="/auth?redirect=/library" ``

**2. Update `src/pages/Auth.tsx`:**

- Read `redirect` from `useSearchParams` on mount
- Replace all `navigate('/')` calls with `navigate(redirect || '/')`
- Update the `useEffect` that auto-redirects logged-in users to also use the redirect param

**3. Google OAuth redirect:**
- For the non-popup OAuth flow in `useAuth.tsx`, store the redirect value in `sessionStorage` before initiating OAuth, then read it back on return. The popup flow already returns to the same page so it will work via the Auth component's redirect logic.

