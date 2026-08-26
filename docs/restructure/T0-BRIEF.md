# T0 — system inventory: brief for extract agents

You are one of eight readers. Each reads ONE home (below) and writes ONE
extract file. You do not change any repo file except your extract. You do
not touch the database. You do not judge whether a rule is good — you record
what is THERE, where, and how it is enforced, so the merge can find
duplicates and drift mechanically.

Plan and architecture: `docs/restructure-plan.md` §1 (the five kinds) and §3
T0 (extract list, discriminator, triage classes). Read those two sections
first.

## The five kinds (classify every entry as exactly one)

- `rule` — a universal predicate about the data (applies to any series).
- `ruling` — an instance: one series/episode/franchise decided under a rule.
- `architecture` — how the system is built (staging, identity, schema).
- `process` — how a session/batch/agent works (research-first, wave size).
- `trap` — a source or pipeline lie (a wiki that shifts numbering).
- plus `audit-class` — a census class (a rule about what wrong looks like).

## Extract format — `docs/restructure/t0/<home>.json`

```json
{
  "home": "<home key>",
  "read": ["<every file/section you actually read>"],
  "entries": [
    {
      "kind": "rule | ruling | architecture | process | trap | audit-class",
      "statement": "one or two sentences, the predicate itself — not the story around it",
      "alias": "existing id or name if the text uses one (A1, A4, C1, C2, C3, D1, D4, 'sliver rule', 'GTO lesson', 'Tokyo Ghoul rule'…), else null",
      "family_candidate": "A | C | T | N | I | S | V | R | P | null",
      "where": [{ "file": "path", "loc": "§10 row 'Anchor monotonicity' | line 123 | heading text" }],
      "enforcement_site": "path#symbol if the text names one, else null",
      "enforcement_layer": "writer | display | both | process | none-stated",
      "audit_class": "name if the text names one, else null",
      "witnesses": ["series ids the text uses as the example of this rule — ONLY what the text says"],
      "bundle": false,
      "bundle_parts": ["if bundle: each separable predicate, one line each"],
      "ruled_by": "Sean | session | source-derived | null",
      "ruled_on": "YYYY-MM-DD if stated, else null",
      "status_hint": "live | superseded | contradicted | planned-not-built | dead | unknown",
      "notes": "anything the merge needs: what it supersedes, what it contradicts, the 'why'"
    }
  ],
  "standing_maps": [
    { "file": "path", "symbol": "NAME", "shape": "Record<seriesId, …>", "entries": 12, "has_reason_per_entry": true, "consumed_by": ["path#fn"], "note": "what it rules" }
  ],
  "scripts": [
    { "file": "path", "class": "pull | heal | census | history | dead | lib-support", "writes": ["tables"], "idempotent": true, "referenced_by": ["skill/doc/script"], "last_touched": "YYYY-MM-DD", "evidence": "one line" }
  ]
}
```

`standing_maps` and `scripts` are required for the code homes (lib,
scripts, audits, client) and may be empty elsewhere.

## Rules for extraction

- **Record every predicate, even the ones that look obvious.** The merge
  deduplicates; you do not. A rule stated in three places is three `where`
  entries on ONE entry within your home — across homes the merge joins them.
- **Grain = what a verdict would cite.** If a paragraph or table row states
  several separable predicates, set `bundle: true` and list `bundle_parts`.
- **Quote the location precisely** (row label, line number, heading) — the
  merge and later the ledger cite it.
- **Discriminator for a standing map**: a declarative, per-id record that
  survives a re-run (override, cap, suppression, split, regime,
  registration, exclusion with a reason). NOT script locals (`DRY`, `ONLY`,
  `KINDS`, `TYPES`), one-shot payload arrays (`ANCHORS`, `CONTINUE`,
  `BOUNDARY_SEEDS` in a batch script — those are `history` rulings, list
  them as entries of kind `ruling` with the script as `where`), or target
  lists.
- **Witnesses only from the text.** Do not invent examples.
- **Status is a hint from the text** ("superseded by…", "NOT built", "do
  not act") — not your judgment.
- Do not summarise the home in prose; the JSON is the deliverable. Your
  final message is ≤8 lines: counts by kind, bundles found, anything you
  could not classify.

## Homes

| key | reads |
|---|---|
| `s10` | `docs/data-pipeline.md` §10 (all rows, all sub-tables) + `docs/franchise-rulings.md` + CLAUDE.md "Hard invariants" + `docs/system-evolution.md` (planned-not-built items and the taxonomy notes as `planned-not-built`) |
| `s1-9-11` | `docs/data-pipeline.md` §1–§9 and §11 (the research tier, maintenance audits, new-source checklist, refresh cadence) |
| `s12` | `docs/data-pipeline.md` §12 — every log entry; extract rules RATIFIED in the log (look for "ruling", "rule", "Sean", "MUST", "never", "always") and mark whether §10 appears to carry them (`notes`) |
| `lib` | every file in `scripts/ingest/lib/` — gates enforced in code (each guard/refusal/clamp is a rule entry with `enforcement_site` = that symbol), the standing maps, and rules stated in comments |
| `scripts` | every non-lib `scripts/ingest/*.ts` (not `research/`, not `lib/`) — standing maps by the discriminator, rules in comments, per-batch `ruling` entries from apply scripts (one entry per curated map, not per row: e.g. "batch-17 DELETIONS_APPROVED: 50 entries, reasons inline"), and the FULL script triage (`scripts` array — every file) |
| `client` | `src/lib/mapping.ts`, `src/lib/supabaseSource.ts`, `src/lib/*.ts`, `src/components/{TypeBadge,EpisodeList,AnimeCard,MappingStrip,MangaMappingDisplay,PositionLabel}.tsx`, `src/lib/*.test.ts` (each test describe = a witnessed rule) — display-side rules; `enforcement_layer: display` |
| `process` | `.claude/skills/*/SKILL.md`, `.claude/agents/*.md`, `scripts/ingest/research/batch1[4-7]/PROTOCOL.md`, `scripts/ingest/research/batch1[5-7]/DECISIONS-FOR-SEAN.md`, `scripts/ingest/research/batch17/CHUNK1-RECOVERY.md` — process rules, traps, and EVERY restated data rule (kind `rule`, with `where` = the skill/protocol; the merge uses these to find drift between copies) |
| `audits` | `scripts/ingest/audit-ui-truth.ts`, `audit-manga-coverage.ts`, `audit-afg-structure.ts`, `verify-series-display.ts`, `audit-titles.ts` — every class as an `audit-class` entry (statement = what it flags, `notes` = what rule it is the outcome check for, if the code says), plus standing maps in those files |
