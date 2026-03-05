

## Plan: Style "assign_to" headers as terminal-header boxes

Currently the "assign_to" section uses a plain `<p>` with a top border. Change it to use the same `terminal-header` box pattern used for form titles like `new_reader` and `edit_reader`.

### Changes

Replace the current pattern:
```tsx
<div className="border-t border-dashed pt-4 mt-4">
  <p className="text-xs text-muted-foreground mb-3">assign_to // optional</p>
```

With a terminal-header styled box:
```tsx
<div className="border border-dashed mt-4">
  <div className="terminal-header flex items-center gap-2">
    <span className="text-muted-foreground">assign_to</span>
    <span className="text-muted-foreground/60">// optional</span>
  </div>
```

And adjust the content container below to have padding inside the box.

### Files to modify

1. **`src/components/library/NewReaderForm.tsx`** (line ~145) -- new reader flow
2. **`src/components/library/LibraryGroupedView.tsx`** (line ~288) -- edit reader flow
3. **`src/pages/Readers.tsx`** (lines ~485 and ~594) -- add and edit reader flows on Readers page

Four occurrences across three files, same transformation each time.

