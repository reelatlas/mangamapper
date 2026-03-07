

## Add Crypto Donations + Stripe Placeholder to Support Section

### Design

Expand the support section with two subsections styled in the existing terminal aesthetic:

**1. Crypto wallets** — presented as a collapsible/expandable code-block-style list. Each entry shows the ticker as a `text-syntax-purple` label and the address in `text-syntax-green` with a per-address copy button. Group them under a `> crypto_wallets` line that toggles open/closed (using Radix Collapsible), defaulting to collapsed to keep the section tidy.

```text
> crypto_wallets [click to expand]
  → btc: bc1qr3ds2qra...  [copy]
  → eth: 0xDFB385030e... [copy]
  → sol: D9XA7UNynfC... [copy]
  → doge: DLkjxfspJan... [copy]
  → ltc: ltc1qgg7yqyx... [copy]
  → xmr: 4AHSPyQM3iB... [copy]
```

Addresses will be truncated visually (first 8 + last 4 chars) but copy the full address. Each row gets its own copy button with the existing `copied` pattern (per-address tracking via `copiedAddress` state).

**2. Stripe placeholder** — a styled line below crypto:
```
> stripe_donate: coming_soon // link TBD
```

### Changes

**`src/pages/About.tsx`**:
- Import `Collapsible, CollapsibleTrigger, CollapsibleContent` from radix UI (already installed)
- Import `ChevronRight` icon for the expand indicator
- Replace the current support section content with:
  - Keep the `$$$ for ...` intro line
  - Add crypto wallets collapsible block with all 6 addresses, per-address copy state
  - Add stripe placeholder line
- Change `copied` state from `boolean` to `string | null` (tracks which address/email was copied)
- Update the feedback section's email copy to use the same `copiedAddress` pattern

