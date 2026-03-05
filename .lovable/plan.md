

## Plan

Update the expand/collapse text in both hover overlays (reader headers and unassigned header) to use brighter foreground color and include the TripleArrow component, matching the previous button styling.

### Changes in `src/components/library/LibraryGroupedView.tsx`

**Line 440-441 (reader header hover overlay):**
Replace `<span className="font-mono text-xs text-muted-foreground px-3">` with a flex container containing the TripleArrow and text in `text-foreground`:

```tsx
<div className="flex items-center gap-1 font-mono text-xs text-foreground px-3">
  <TripleArrow collapsed={collapsedGroups.has(group.name.toLowerCase())} compact />
  {collapsedGroups.has(group.name.toLowerCase()) ? 'expand' : 'collapse'}
</div>
```

**Lines 496-498 (unassigned header hover overlay):**
Same treatment:

```tsx
<div className="flex items-center gap-1 font-mono text-xs text-foreground px-3">
  <TripleArrow collapsed={collapsedGroups.has('unassigned')} compact />
  {collapsedGroups.has('unassigned') ? 'expand' : 'collapse'}
</div>
```

