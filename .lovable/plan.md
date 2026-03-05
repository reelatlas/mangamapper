

## Plan: Fix reader dropdown focus ring and width

### Problem 1: Focus ring not showing
The base `SelectTrigger` component already includes `focus:ring-2 focus:ring-ring focus:ring-offset-2`. The custom className on line 176 adds conflicting `focus-visible:ring-*` and `data-[state=open]:ring-*` classes that override the base behavior. Solution: remove all the custom ring/focus classes and let the base component handle it.

### Problem 2: Dropdown wider than trigger
The `+ new_reader` section sits outside `SelectPrimitive.Viewport` but inside `SelectPrimitive.Content`. The content div with `p-1` and the separator add to the content's natural width. Solution: add `overflow-hidden` and ensure the content has `box-border` sizing.

### File: `src/components/library/NewSeriesForm.tsx`

**Line 176** - Simplify SelectTrigger classes, remove all custom focus/ring overrides:
```tsx
<SelectTrigger className={`font-mono text-sm border-dashed bg-muted/30 ${selectedReaderKey ? 'text-syntax-green' : ''}`}>
```

**Line 180** - Add `box-border` to Content to ensure border is included in width calculation:
```tsx
<SelectPrimitive.Content className="font-mono border-dashed relative z-50 w-[var(--radix-select-trigger-width)] min-w-0 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md box-border data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=bottom]:translate-y-1" position="popper">
```

