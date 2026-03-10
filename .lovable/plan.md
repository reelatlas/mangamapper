

## Fix AnimatedDots cycle to include empty state

**File**: `src/pages/Auth.tsx`

The `AnimatedDots` component currently cycles: `.` → `..` → `...` → `.` (never empty).

Change it to cycle: `` → `.` → `..` → `...` → `` → `.` → etc.

Update the state logic from:
```ts
setDots(prev => prev.length >= 3 ? '.' : prev + '.');
```
to:
```ts
setDots(prev => prev.length >= 3 ? '' : prev + '.');
```

And change the initial state from `'.'` to `''`.

Single file, two-line change.

