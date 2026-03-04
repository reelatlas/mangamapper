
Goal: make inline “new_reader” reliably auto-select after creation in NewSeriesForm.

Findings from current code:
- NewSeriesForm currently controls Select with `selectedReaderName` (display label) and tries optimistic insertion via `newlyCreatedReader`.
- This can still fail when Radix Select doesn’t find a stable matching option at the moment value changes (especially with dynamic children + async refresh timing).
- There is also a runtime warning in this flow (`Function components cannot be given refs`), indicating we should tighten Radix Select child structure and state wiring in this area.

Best-practice fix (simple, robust):
1) Switch Select control from “name label” to a stable internal option key
- Add `selectedReaderKey` state (e.g. `${name.toLowerCase()}|${url}`).
- Build `readerOptions` array from distinct readers + optimistic created reader, each with `{ key, name, url }`.
- Render SelectItem with `value={option.key}` and label `option.name`.
- Keep submit payload based on resolved selected option URL/name, not trigger text.

2) Set selection from created reader using the same key path
- In `handleNewReaderCreated`, set optimistic reader, hide inline form, compute key, set `selectedReaderKey`, set `selectedReaderName/url`, set base series URL.
- Keep `onSuccess()` for background refresh, but selection remains stable because key exists in optimistic options immediately.

3) Remove potential Radix child/ref friction in SelectContent
- Replace the raw divider element with `SelectSeparator` styled dashed (maintains Radix expected structure and avoids custom non-primitive nodes inside content collection).

4) Keep code lean
- No new hooks/libraries.
- One component change only (`NewSeriesForm.tsx`), small local refactor around options derivation and select handlers.
- Preserve all existing UX (inline form, notes, series_url prefill, dashed styling).

Implementation outline (NewSeriesForm.tsx):
- State:
  - add `selectedReaderKey` (string)
  - keep `selectedReaderName`, `selectedReaderUrl`, `newlyCreatedReader`
- Derived options:
  - distinct by lowercase name (current behavior), map to `{ key, name, url }`
  - append optimistic created option if missing
- Handlers:
  - `handleReaderChange(key)`:
    - if key is `__new_reader__`: show inline form, clear selected key/name/url
    - else resolve option by key and set selected key/name/url + seriesUrl
  - `handleNewReaderCreated(name,url)`:
    - set optimistic reader
    - set selected key/name/url
    - close inline form
    - prefill seriesUrl
    - call `onSuccess()` (background refresh)
- Render:
  - Select `value={selectedReaderKey}`
  - SelectItem values use option.key
  - dashed separator via SelectSeparator class override

Validation checklist after implementation:
- Create inline reader with unique name/url → dropdown shows that reader selected immediately (no manual re-open).
- `series_url` field appears and is auto-prefilled with trailing slash.
- Submitting new series writes selected reader name/url correctly.
- No React ref warning in console when opening/using this flow.
- Existing reader selection still works unchanged.
