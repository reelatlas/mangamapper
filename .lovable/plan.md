

## Fix: Post-login redirect from all sign-in entry points

### Current State
- **Header** (global nav): `Link to="/auth"` — no redirect param, defaults to `/`
- **Library page**: `Link to="/auth?redirect=/library"` — correct
- **CollectionSection** (details page): `Link to="/auth?redirect=${location.pathname}"` — correct
- **Auth.tsx**: Reads `redirect` param, navigates there on success — correct
- **Google OAuth**: Passes redirect through `redirectTo` URL back to `/auth?redirect=...` — correct

### Problem
The **Header** sign-in link hardcodes `/auth` without a redirect param, so it always redirects to `/` regardless of what page the user is on.

### Fix

**`src/components/Header.tsx`** (line 93): Use `useLocation` to pass the current path as the redirect param:

```tsx
import { Link, useLocation } from 'react-router-dom';

// In the component:
const location = useLocation();

// Change the sign-in link from:
<Link to="/auth">{'>'} sign_in</Link>

// To:
<Link to={`/auth?redirect=${encodeURIComponent(location.pathname)}`}>{'>'} sign_in</Link>
```

This is the only change needed. The Auth page already reads the `redirect` query param and navigates there after successful sign-in (both email/password and Google OAuth).

