

## Add stripe_donate collapsible with donation links

Replace the static "stripe_donate: coming_soon" placeholder (lines 290-295) with a collapsible section matching the `crypto_wallets` pattern.

### Changes

**`src/pages/About.tsx`**

1. **Add state**: `const [stripeOpen, setStripeOpen] = useState(false);`

2. **Add `ExternalLink` to imports** from `lucide-react`

3. **Define donation links constant**:
```ts
const STRIPE_LINKS = [
  { label: 'one_time', url: 'https://donate.stripe.com/3cIeVf1Rz9NG7CP2FycbC01' },
  { label: 'recurring_sub', url: 'https://buy.stripe.com/6oUbJ3eEl6Bue1dfskcbC02' },
];
```

4. **Replace lines 290-295** (the placeholder) with a `Collapsible` matching crypto_wallets structure:
   - Trigger: `> stripe_donate` with `TripleArrow`
   - Content: map over `STRIPE_LINKS`, each row shows:
     - `→` arrow + `label` text in `text-syntax-purple`
     - On hover: reveal `> ExternalLink icon` with expand animation (same `group-hover` + `max-w-0 → max-w-[150px]` pattern used in crypto rows)
     - Click opens URL in new tab via `window.open(url, '_blank')`

