# The data pipeline — SPLIT on 2026-08-26 (restructure phase T1.1)

This file was 1,717 lines doing four jobs. It is now four files; every
citation into the old sections resolves as follows:

| old section | now |
|---|---|
| §1–§9 sources, architecture, identity, franchise structure | `docs/architecture.md` |
| §10 the rules table | `docs/rules.md` — GENERATED from `scripts/ingest/lib/ledger/`; every rule has an id (`A1`, `C3`, `G12`) and its old §10 label is an alias in the alias index |
| §11 operations (freshness map, cadence, scripts, new-source checklist) | `docs/runbook.md`; the prose RULES that lived in §11 are ledger records too |
| §12 the numbered log | `docs/changelog.md` (verbatim; §12.N numbering continues) |

Where we are right now: `docs/STATE.md`. The board: `docs/restructure-plan.md`.
