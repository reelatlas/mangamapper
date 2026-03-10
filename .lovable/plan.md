

## Update AuthConfirm Page

### Single file change: `src/pages/AuthConfirm.tsx` — full rewrite

**Header**: Use `.terminal-header` class with green `■` indicator (matching Auth.tsx pattern but green instead of amber)

**Status text**: `[✓] email_confirmed > welcome aboard!` in green syntax

**Comment text**: `// auth_terminal will close in 10s or close it manually`

**Progress bar**: 
- Blue/primary color for `▓` blocks
- 1 tick per second, 10 blocks initially (10 seconds)
- Wraps naturally when extended

**Interactive controls** (below progress bar, styled as terminal buttons):
- `pause` / `start` toggle button — pauses/resumes the countdown
- `add_time(5s)` button — adds 5 blocks to total, works while paused
- At 60s max: button disabled, shows `add_time(max_limit)` with muted styling

**Jammed message**: `autoclose_jammed > requires(manual_intervention)`

**State management**: `totalBlocks` (starts 10, grows by 5, max 60), `paused` boolean, `filledBlocks` counter. Interval checks `paused` ref before incrementing.

**Constants**: `TICK_MS = 1000`, `INITIAL_BLOCKS = 10`, `MAX_BLOCKS = 60`, `ADD_BLOCKS = 5`

No changes to other files.

