---
name: apply-batch
description: Turn landed research verdicts into stored data — curate the approval maps, dry-run, apply idempotently, re-resolve, heal, verify, and cut a save point. Use after a research wave lands, or to re-run an existing batch as later verdicts arrive.
---

# Apply batch — verdicts into data

Research produces claims. This skill is where claims become stored data, and
it is the highest-stakes step in the pipeline: a bad apply writes a wrong
number that renders to users and outlives the session that made it.

## The curation principle

**The curated map decides, never the agent's field shape.** An agent proposing
`263 → 253` on a filler row is answered with a DELETION, because A1 forbids
the anchor — not with the repair it asked for. The approval maps in
`apply-research-batch-N.ts` (`REPAIRS_APPROVED`, `DELETIONS_APPROVED`,
`BOUNDARY_SEEDS`, `CURATED_ZONE_ACK`, `CURATED_ANNOTATIONS`) are the ruling
record. Each entry carries its reasoning inline, because the entry IS the
documentation.

Anything an agent proposes that is not in a curated map gets REPORTED, not
applied.

## Sequence

1. **Read the verdicts, do not skim them.** Mechanically scan for
   contradictions between each summary and its own rows before trusting any
   of it.
2. **Curate.** Add approved decisions to the maps with reasoning. Type
   corrections go through `EPISODE_TYPE_OVERRIDES` in `lib/resolve.ts` —
   never a direct row write.
3. **Dry run** — `apply-research-batch-N.ts --dry-run`. Read the output as a
   proposal, not a formality. Every line is a change you are authorising.
4. **Apply.** The script is idempotent and file-driven; re-running as later
   verdicts arrive is expected and safe.
5. **Re-resolve** any series whose types changed, so stale-zone healing
   removes stranded rows.
6. **Healers** (all idempotent): parity continues, volume boundaries, manga
   coverage, flag cleanup.
7. **Verify** — `verify-series-display.ts --all` (expect 0 failing) and
   `audit-ui-truth.ts`.
8. **Explain every census delta.** A class that moved without explanation is
   an unshipped bug, not a rounding error. `ruling_violation` MUST be 0 —
   anything else means a writer bypassed a gate, and the fix is the writer,
   never the data alone.
9. **Save point** — docs `§12` entry, memory refresh, commit whose message
   reads as the ruling record, push.

## Traps this pipeline has actually hit

- **Repairs on derivation-tier rows get wiped.** A repaired value on `mu` /
  `afg` / `afg-continua` is deleted by that source's next re-derive. The
  repair pass must flip the row to `manual`.
- **Regime maps launder bad data.** `REORDER_REGIMES` is a WAIVER of the
  order guard: it once turned a corrupted verdict into a "ruled" annotation
  that looked legitimate. List a series only for verdict-documented pervasive
  reorder, and every derived annotation must match a jump the verdict
  describes.
- **Agents write spans as `episodes: [3, 201]` meaning 3 THROUGH 201** while
  the contract is a LIST. Check the shape.
- **A missed edge deploy ships silent drift.** Any `lib/` change in the apply
  → rebuild and deploy all four functions.

## The standing goal

Every rule applied here should end up enforced by a writer gate and verified
by an audit class. When that happens, the rule stops costing model attention
forever. That is the direction of travel: from judgment, to gate, to audit.
