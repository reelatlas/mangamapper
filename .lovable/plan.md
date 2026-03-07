

## Fix: Crypto copy hover text truncation

**Problem**: The `max-w-[120px]` on the hover text span clips longer tickers like `doge_address`. The text `copy(doge_address)` needs ~140px, and `xmr_address` would too.

**Options**:

1. **Increase max-w** — Bump from `max-w-[120px]` to `max-w-[150px]`. Simple, accommodates all current tickers. Slight tradeoff: shorter tickers (btc) will have a marginally wider expansion target, but visually negligible.

2. **Use a tooltip instead** — Replace the inline expanding text with a proper Radix Tooltip on hover. Completely avoids width constraints. More complex change, different UX feel from the current inline animation.

3. **Dynamic max-w via style prop** — Calculate based on ticker length. Over-engineered for 6 static entries.

**Recommendation**: Option 1 — just change `max-w-[120px]` to `max-w-[150px]` on line 248. Minimal change, fixes the issue for all tickers.

### Change

**`src/pages/About.tsx` line 248**: Change `max-w-[120px]` to `max-w-[150px]`.

