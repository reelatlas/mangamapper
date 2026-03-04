

## Assessment

Yes, the `newlyCreatedReader` local state approach **is** the right fix and the simplest one. Here's why:

### The core problem

Radix `Select` requires its `value` to match an existing `SelectItem`. The sequence is:

1. User creates reader → `handleNewReaderCreated` sets `selectedReaderName`
2. `onSuccess()` triggers `fetchReaderSites()` (async DB call)
3. Before fetch returns, React re-renders — `distinctReaders` is derived from the **stale** `readerSites` prop
4. Radix sees `value="New Reader"` but no matching `SelectItem` exists → resets to placeholder

### Why one local state variable is the correct fix

Adding `newlyCreatedReader` to merge into `distinctReaders` is the standard pattern for this. It's just **3 lines of real logic**:

```
// 1. One new state
const [newlyCreatedReader, setNewlyCreatedReader] = useState(null);

// 2. Set it in handleNewReaderCreated
setNewlyCreatedReader({ name, url });

// 3. Merge into distinctReaders
if (newlyCreatedReader && !list.find(...)) list.push(newlyCreatedReader);
```

This is simpler than alternatives like React Query mutations with `invalidateQueries` (which would require refactoring the data fetching layer) or using `await` to block until the refetch completes (fragile and introduces loading states).

### Plan

**Single file change: `NewSeriesForm.tsx`**

1. Add state: `const [newlyCreatedReader, setNewlyCreatedReader] = useState<{name: string, url: string} | null>(null)`
2. Set it in `handleNewReaderCreated` before calling `onSuccess()`
3. After computing `distinctReaders`, append `newlyCreatedReader` if it's not already in the list (as a minimal `ReaderSite`-shaped object)

No other files need changes.

