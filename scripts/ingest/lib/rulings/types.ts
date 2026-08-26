// Rulings — the typed record for a per-series decision (restructure T2.1,
// 2026-08-26). A RULING is an instance of a RULE (docs/rules.md) applied to
// one series / episode / franchise: an override, a cap, a suppression, a
// split, a regime, a registration, an exclusion, a curated deletion.
//
// The map is canonical; `docs/rulings.md` is GENERATED from these records
// (scripts/restructure/gen-rulings.ts), keyed by series, so "what have we
// ruled about X" is one hop. A ruling with no `reason` does not compile —
// the reason IS the documentation (the apply-batch curation principle).
//
// Consumers keep their old shapes: each map file exports the record list AND
// the derived lookup the gates read (e.g. EPISODE_TYPE_OVERRIDES as
// Record<seriesId, Record<episode, type>>), built by toRecord().

export type RuledBy = 'Sean' | 'session' | 'source-derived';

export type RulingEntry<V = unknown> = {
  /** our series id (slug); 'manga:<anilistId>' for manga-keyed rulings; '*' for a catalog-wide instance */
  seriesId: string;
  /** the rule this instance applies — a ledger id or alias (ledger-check resolves it) */
  ruleId: string;
  /** the ruled value, in the shape the consumer reads */
  value: V;
  /** WHY — the evidence and the call, in one or two sentences. Required. */
  reason: string;
  ruledBy: RuledBy;
  /** YYYY-MM-DD */
  ruledOn: string;
  /** citations (URLs, verdict paths, changelog §) */
  cite?: string[];
  /** when this ruling should be re-evaluated or falls away ('D2 lands', 'AFL classifies ≥60%', 'T4.0') */
  retiresWhen?: string;
  /** a ruling this one replaced (kept for the record; not in the derived lookup) */
  supersedes?: string;
};

/** Build the consumer-facing lookup from a record list; later entries for the same series win. */
export const toRecord = <V>(entries: RulingEntry<V>[]): Record<string, V> => {
  const out: Record<string, V> = {};
  for (const e of entries) out[e.seriesId] = e.value;
  return out;
};

export const toSet = (entries: RulingEntry<unknown>[]): Set<string> => new Set(entries.map((e) => e.seriesId));
