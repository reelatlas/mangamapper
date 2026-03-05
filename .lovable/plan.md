

## Plan: Remove indent from inline new_reader & fix Select trigger active state

### 1. Remove indent from inline new_reader in NewSeriesForm

**`src/components/library/NewSeriesForm.tsx`** line 211: Change `<div className="pl-4">` to `<div>` to remove the left indentation.

### 2. Fix Select trigger active/open state highlight

The `SelectTrigger` in the select UI component (line 20 of `select.tsx`) only has `focus:ring-2 focus:ring-ring` styles. Radix Select sets `data-[state=open]` on the trigger when the dropdown is open. Adding `data-[state=open]:ring-2 data-[state=open]:ring-ring` to the base trigger styles will show the blue ring as soon as the dropdown opens, not just after a value is selected and focus returns.

**`src/components/ui/select.tsx`** line 20: Add `data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2` to the SelectTrigger className.

