

## Plan: Add scroll arrows to reader list and fix separator styling

**Two issues to fix in `NewSeriesForm.tsx`:**

1. **Scroll arrows**: Add `SelectScrollUpButton` and `SelectScrollDownButton` inside the viewport area (around the reader options list only, not around `+ new_reader`). Since we're using a manual `SelectPrimitive.Viewport`, we need to add the Radix scroll buttons before/after the viewport, but still within the scrollable region above the separator.

2. **Separator styling**: The `SelectSeparator` needs explicit dashed border styling. Currently `border-dashed` alone isn't enough — need `border-t border-dashed border-border` to make it visible with the dashed pattern.

**Changes in `NewSeriesForm.tsx` (lines 167-180):**

Replace the current `SelectContent` internals with:
```tsx
<SelectContent className="font-mono border-dashed p-0">
  <SelectScrollUpButton />
  <SelectPrimitive.Viewport className="max-h-[200px] overflow-y-auto p-1">
    {readerOptions.map(option => (
      <SelectItem key={option.key} value={option.key} className="text-sm">
        {option.name}
      </SelectItem>
    ))}
  </SelectPrimitive.Viewport>
  <SelectScrollDownButton />
  <div className="border-t border-dashed border-border" />
  <div className="p-1">
    <SelectItem value="__new_reader__" className="text-sm text-primary font-medium">
      + new_reader
    </SelectItem>
  </div>
</SelectContent>
```

Key details:
- Import `SelectScrollUpButton` and `SelectScrollDownButton` (already exported from `select.tsx`)
- The scroll buttons sit just outside the Viewport but above the separator, so arrows appear for the reader list only
- Replace `SelectSeparator` with a plain `div` using `border-t border-dashed border-border` for the visible dashed line pattern

**However**, since we're bypassing `SelectContent`'s default auto-wrapping (it already adds its own Viewport + scroll buttons), we should use `SelectPrimitive.Content` directly via a `SelectPrimitive.Portal` instead of `SelectContent` to avoid double-viewport nesting. Actually — looking more carefully, `SelectContent` already wraps children in a Viewport with scroll buttons. We're adding our own Viewport inside it, which means there's a nested viewport issue.

**Corrected approach**: Use raw Radix primitives directly instead of the `SelectContent` wrapper:

```tsx
<SelectPrimitive.Portal>
  <SelectPrimitive.Content className="font-mono border-dashed relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=bottom]:translate-y-1" position="popper">
    <SelectScrollUpButton />
    <SelectPrimitive.Viewport className="max-h-[200px] p-1 w-full min-w-[var(--radix-select-trigger-width)]">
      {readerOptions.map(...)}
    </SelectPrimitive.Viewport>
    <SelectScrollDownButton />
    <div className="border-t border-dashed border-border" />
    <div className="p-1">
      <SelectItem value="__new_reader__" ...>+ new_reader</SelectItem>
    </div>
  </SelectPrimitive.Content>
</SelectPrimitive.Portal>
```

This gives us full control: scroll arrows around the reader list viewport, pinned `+ new_reader` footer with a visible dashed separator, no double-nesting.

**Single file change**: `src/components/library/NewSeriesForm.tsx`

