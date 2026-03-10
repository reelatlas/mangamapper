

## Change: Dynamic countdown display in AuthConfirm

**Current**: Line 113 shows `{totalBlocks}s` which is always the total (e.g., 10s, or 15s after adding time) — it never counts down.

**Fix**: Replace `{totalBlocks}` with `{totalBlocks - filledBlocks}` so the displayed seconds remaining decreases as blocks fill, and increases when the user adds time.

**File**: `src/pages/AuthConfirm.tsx`, line 113
- Change: `// auth_terminal will close in {totalBlocks}s or close it manually`
- To: `// auth_terminal will close in {totalBlocks - filledBlocks}s or close it manually`

