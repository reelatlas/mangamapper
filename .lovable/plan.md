

## Two changes in `src/components/AddToReaderDropdown.tsx`

### 1. Fix toast to use sonner (matching other toasts)
Replace the import `import { toast } from '@/hooks/use-toast'` with `import { toast } from 'sonner'`, and update the two toast calls:
- Error: `toast.error('Failed to add series to reader')`
- Success: `toast.success('Added to {reader.name}')`

### 2. Refresh library section after adding to reader
The upsert to `anime_progress` with `in_library: true` already exists (lines 89-92), but the `LibrarySection` component doesn't re-fetch its state. The `onSuccess` callback is already called -- it triggers `fetchLinkedReaders` in the detail page. We need to also call `onLibraryChange` from the detail page context.

Looking at the detail page, `onSuccess` maps to `fetchLinkedReaders`. We should add a second prop `onLibraryAdd` (or reuse the existing pattern) to trigger the `LibrarySection` to refresh.

**Simpler approach:** The `LibrarySection` already has `fetchLibraryStatus`. We can lift the refresh by having the detail page pass a callback that forces `LibrarySection` to re-check. But `LibrarySection` doesn't expose a refresh method.

**Simplest approach:** Add an `onLibraryChange` callback to `AddToReaderDropdown` that the detail page wires to trigger a re-render. But `LibrarySection` manages its own state internally.

**Best approach:** Have `AnimeDetail.tsx` keep a `libraryRefreshKey` counter state. When `AddToReaderDropdown.onSuccess` fires, increment it. Pass it as a `key` prop to `LibrarySection` to force remount and re-fetch.

### Files to change:
1. **`src/components/AddToReaderDropdown.tsx`** -- Switch toast import from `@/hooks/use-toast` to `sonner`, update toast calls to `toast.success()` / `toast.error()`
2. **`src/pages/AnimeDetail.tsx`** -- Add a `libraryKey` state counter, increment it in `fetchLinkedReaders` (which is called by `AddToReaderDropdown.onSuccess`), and pass it as `key` to `LibrarySection` so it remounts and re-fetches library status

