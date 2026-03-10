

## AuthConfirm: Rename text + add speed_up button

**File**: `src/pages/AuthConfirm.tsx`

### Changes

1. **Rename status text** (line 108): Change `> welcome aboard!` to `> auth_success`.

2. **Add speed_up button**: 
   - Add a `speedMultiplier` state (starts at 1) and a corresponding ref.
   - The progress bar interval currently ticks at `TICK_MS` (1000ms). Instead of recreating the interval on speed change, use a ref-based approach: track `speedMultiplierRef` and divide `TICK_MS` by the multiplier. Since `setInterval` has a fixed delay, switch to a recursive `setTimeout` pattern so each tick reads the latest speed.
   - Add a `speed_up` button that appears only when `atMaxLimit` is true. It sits in the controls row, pushed to the far right with `ml-auto`. Each press multiplies speed by 1.05 (5% faster). No max cap.
   - Button label: `speed_up` always.

3. **Countdown comment update**: The `// auth_terminal will close in Xs` needs to reflect the accelerated speed. Since the tick rate changes but totalBlocks - filledBlocks is in "ticks" not seconds, we compute remaining time as `(totalBlocks - filledBlocks) * (TICK_MS / speedMultiplier) / 1000` and display it rounded.

### Flow
- User hits 60s max → `add_time` shows max_limit on hover, `speed_up` button appears on far right
- Each `speed_up` press: tick interval becomes 5% faster (compounding)
- Countdown comment reflects actual remaining time accounting for speed

