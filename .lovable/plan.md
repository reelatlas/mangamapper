

## Fix: Switch Supabase auth to PKCE flow

### Problem
Supabase is using the implicit grant flow by default, which puts tokens in the URL hash (`#access_token=...`) and ignores the `redirectTo` parameter. This breaks the redirect-after-login flow entirely.

### Code change: `src/integrations/supabase/client.ts`

Add `flowType: 'pkce'` and `detectSessionInUrl: true` to the auth config:

```ts
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

### Manual step (Supabase Dashboard)
You'll need to update **Authentication → URL Configuration** in your Supabase dashboard:

- **Site URL**: `https://www.mangamapper.com`
- **Redirect URLs** whitelist must include:
  - `https://www.mangamapper.com/auth`
  - `https://www.mangamapper.com/auth?redirect=*` (wildcard for query params)
  - The Lovable preview domain equivalents if needed

