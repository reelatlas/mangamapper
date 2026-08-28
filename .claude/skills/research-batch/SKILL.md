# /research-batch — the wave protocol (step 2 of the cycle, `P1`)

Research is the dominant token cost in this project. This skill exists so a
usage limit can never cost more than one wave (`P12`), and so a batch can be
resumed by any model on any account (`P11`). Updated 2026-08-26 (restructure
T3.4; T3.2/T3.5 landed 2026-08-26 with T4.5): rule citations by id. The
VOCABULARY lives in ONE place — the `research-agent` definition (the three
standings, the annotation kinds and bases, the materiality bar `T28`, the
traps); a batch's `PROTOCOL.md` pins only the task shape, the output JSON
and the batch-specific asks, and cites the rules by id. Batch 18's
`scripts/ingest/research/batch18/PROTOCOL.md` is the current template;
batch 17's is history.

**The governing rule: artifacts are the handoff (`P11`).** A verdict JSON on
disk survives model switches, account switches and hard stops. Conversation
context does not. Never hold batch state only in your head.

## 0. Read STATE

`docs/STATE.md` says which batch, which chunk, which wave. If it disagrees
with what you remember, STATE wins until verified.

## 1. Establish the work-list from disk, never from memory

The live diff is `ls scripts/ingest/research/batchN/out/` against the
TARGETS table in that batch's `context.ts`. Recompute it every time — a
prior session's list is a claim, the filesystem is the fact. The census
classes (`anchor_gap_research`, `frontier_tail_null`, `mu_pin_unverified`,
`asterisk_unreviewed`) are the source of targets; a queue that selects for
MISSING data never surfaces well-anchored series — an audit class must be
its own work-list (`R27`). LOCKED series (`P25`, `lib/rulings/permanence.ts`) are
excluded from every work-list unless the batch exists BECAUSE a rule
changed — then say so in the plan.

If a `*-RECOVERY.md` exists in the batch directory, **read it first**. It
records what landed, what is outstanding, and the source traps already
paid for.

## 2. Generate contexts

`npx tsx --env-file=.env.ingest scripts/ingest/research/batchN/context.ts <outdir>`

Contexts must be regenerated per session — they capture CURRENT stored
state, and stale context is how an agent silently contradicts fresh data.
Write them to the session scratchpad, never the repo.

## 3. Dispatch a wave — 6 to 8 agents, no more (`P12`)

Use the `research-agent` definition (it carries its own model and the
traps). One agent per target. Every prompt states:

- the protocol path and the context file path (both read in full, first)
- the exact output path for the verdict JSON (`R21`)
- a **per-task scratchpad subdirectory** (`R22`) — parallel agents collide
  on shared paths
- any known traps for that target, from the recovery file or prior verdicts
- **the session's effort level** — agents inherit it; a low-effort wave is a
  legitimate tradeoff only when chosen.

Pin the PROTOCOL for the batch's lifetime (`R31`): changing the contract
under a running wave is how drift re-enters.

## 4. Land and checkpoint — every wave, without exception (`P13`)

1. **Validate** every new verdict parses and carries `series_id`; then print
   the **recap baseline** (`research/batchN/baseline.ts <verdict.json>` —
   one line per named row, stored type first, then the delta; a block of
   retypes is a table) and carry it into the recovery record — Sean 2026-08-28,
   a standing process rule: no recap names a row without its stored standing.
2. **Contradiction scan** (`R25`) — mechanically compare each verdict's
   summary against its own rows. Self-consistent-but-wrong is the failure
   mode that has actually shipped.
3. **Commit the verdicts.** They are the cited record.
4. **Write/refresh the recovery record** — landed, outstanding, traps
   learned this wave.
5. **Update `docs/STATE.md`, report usage, STOP for a decision.** Never roll
   into the next wave automatically. **The stop-for-Sean recap — the chat
   message itself, not the recovery file — carries the recap baseline table
   (`ep | stored | → proposed`) for every row whose type or annotation
   changes or that he is asked to rule on; unchanged rows in the ask are one
   summary line after the table** (Sean 2026-08-28: "don't tell me to open
   the recovery file for the baseline — put it in the message"; a sentence
   like "53, 105, 113, 120 → filler" is not a substitute).

## 5. Verification tier (`R23`/`R24`)

Where a verdict carries weight — a whole-series structure claim, a reorder
regime, a repair contradicting stored data, a chapter-space claim — run
`verdict-verifier` over it on a DIFFERENT model than the author. It refuted
the saint-seiya phantom-53 and the rayearth 14-chapter claims before they
reached the data.

## When research is the wrong tool

If a question can be settled by a script — an audit class, a census delta,
`docs/rules.md` — settle it that way. Model tokens spent re-deriving what a
ledger record already states are wasted permanently (the hellsing/gintama
lesson: `A4`/`C2` re-derived from scratch). Research is for what only
sources can answer.

## Next step — offer it, don't assume it

Every recap in this section is a chat message with the baseline table in
it — the landing, the verify recap, the decisions. No table, no recap.

When a wave has landed and been checkpointed, report and ASK:

- Weight-bearing verdicts? → **step 3, Verify**.
- Otherwise → **step 4, Rule**: present the decisions Sean needs, each with
  evidence and a recommendation, then `/apply-batch`.
- More targets outstanding? → the next wave, WITH the usage report.

State which you are recommending and why. Sean should be able to say "yes"
rather than reconstruct the plan.
