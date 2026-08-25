---
name: research-batch
description: Fan out mangaMapper series research in usage-safe waves — generate contexts, dispatch research-agents under the batch protocol, land cited verdicts, and checkpoint after every wave. Use when starting or resuming a research batch (gap tier, tail tier, A1 triage, narrow record questions).
---

# Research batch — the wave protocol

Research is the dominant token cost in this project. This skill exists so a
usage limit can never cost more than one wave, and so a batch can be resumed
by any model on any account.

**The governing rule: artifacts are the handoff.** A verdict JSON on disk
survives model switches, account switches and hard stops. Conversation
context does not. Never hold batch state only in your head.

## 1. Establish the work-list from disk, never from memory

The live diff is `ls scripts/ingest/research/batchN/out/` against the TARGETS
table in that batch's `context.ts`. Recompute it every time — a prior
session's list is a claim, the filesystem is the fact.

If a `*-RECOVERY.md` exists in the batch directory, **read it first**. It
records what landed, what is outstanding, and the source traps already paid
for. Re-learning a trap someone already documented is pure waste.

## 2. Generate contexts

`npx tsx --env-file=.env.ingest scripts/ingest/research/batchN/context.ts <outdir>`

Contexts must be regenerated per session — they capture CURRENT stored state,
and stale context is how an agent silently contradicts fresh data. Write them
to the session scratchpad, never the repo.

## 3. Dispatch a wave — 6 to 8 agents, no more

Use the `research-agent` definition (it carries its own model). One agent per
target. Every prompt states:

- the protocol path and the context file path (both read in full, first)
- the exact output path for the verdict JSON
- a **per-task scratchpad subdirectory** — parallel agents collide on shared
  paths
- any known traps for that target, from the recovery file or prior verdicts

Hard cap 6–8 concurrent. This is not a performance tuning number: 19 agents
were dispatched once and a spend limit killed 17 mid-flight. A wave is the
unit of loss.

## 4. Land and checkpoint — every wave, without exception

After each wave, before dispatching the next:

1. **Validate** every new verdict parses and carries `series_id`.
2. **Contradiction scan** — mechanically compare each verdict's summary
   against its own rows. Self-consistent-but-wrong is the failure mode that
   has actually shipped here.
3. **Commit the verdicts.** They are the cited record; uncommitted research
   is research at risk.
4. **Write/refresh the recovery record** — what landed, what is outstanding,
   traps learned this wave.
5. **Report usage and stop for a decision.** Do not roll into the next wave
   automatically. The user decides whether to continue.

## 5. Verification tier

Where a verdict carries unusual weight — a whole-series structure claim, a
reorder regime, a repair contradicting stored data — run `verdict-verifier`
over it. It is deliberately a different model than the author. Cross-model
review catches correlated errors that a second pass by the same model will
not.

## When research is the wrong tool

If a question can be settled by a script — an audit class, a census delta, a
verifier run — settle it that way. Model tokens spent re-deriving what
`audit-ui-truth.ts` already asserts are wasted permanently. Research is for
what only sources can answer.
