

## Plan: Add quantity icon before the limit filter group

**File: `src/pages/Index.tsx`**

Add a `Hash` icon (from lucide-react) before the 10/50/100 `ToggleGroup`. The `Hash` icon (`#`) is a natural symbol for "count" or "quantity" and fits the monospace/code aesthetic.

- Import `Hash` from `lucide-react`
- Place `<Hash className="w-3.5 h-3.5 text-muted-foreground" />` right after the vertical divider and before the limit `ToggleGroup`

