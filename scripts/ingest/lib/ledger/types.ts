// The rules ledger — record contract (restructure phase T1.2, 2026-08-25).
//
// A RULE is a universal predicate about the data or the process. This file
// is the ONLY shape a rule may take: `docs/rules.md` is GENERATED from these
// records (scripts/restructure/gen-docs.ts), never edited by hand, and
// `ledger-check` refuses duplicate ids/aliases, non-resolving enforcement
// paths, unknown audit classes and dead citations. Direction of truth:
// ledger → gate → audit. The ledger is never generated from code.
//
// RULINGS (per-series instances) do NOT live here — they live in typed maps
// under lib/rulings/ (T2.1) and cite a rule id.

/** Family = subject, not task type. The letter is the first character of every id. */
export type Family =
  | 'A' // anchors & position (what an anchor records; coverage; monotonicity; A1 filler rows)
  | 'C' // continue-read regimes (C1 straddle, C2 parity, C3 skip notes)
  | 'T' // typing & taxonomy (episode types, semantics, overrides, source typing)
  | 'N' // numbering, counts & chapter spaces (episode floors, community counts, shifts, count-vs-number)
  | 'I' // identity, franchise & structure (our slug, registry, ownership, stitching, components, scope)
  | 'G' // gates & freshness — sources (staging integrity, matching, refresh, flags, MU/AFG/AFL/Wikipedia writer gates). Not 'S': it collides with season shorthand (S1, S2) in every note.
  | 'V' // volumes & boundaries (monotonic starts, boundary-aware volumes, ratio fallback)
  | 'R' // research protocol (what a verdict must contain, sources, citations, confidence)
  | 'P'; // process & pipeline (the cycle, invariants, apply discipline, edges, completeness)

export const FAMILIES: Record<Family, string> = {
  A: 'Anchors & position',
  C: 'Continue-read regimes',
  T: 'Typing & taxonomy',
  N: 'Numbering, counts & chapter spaces',
  I: 'Identity, franchise & structure',
  G: 'Gates & freshness (sources)',
  V: 'Volumes & boundaries',
  R: 'Research protocol',
  P: 'Process & pipeline',
};

/** Where the rule is enforced. `process` = a skill/agent/human step, no code. */
export type Layer = 'writer' | 'display' | 'both' | 'process';

export type Status =
  | 'live' // enforced today
  | 'planned' // ruled, not built (the enforcement list names what WILL enforce it)
  | 'superseded'; // kept only so old citations resolve; `supersededBy` names the successor

export type Enforcement = {
  /** repo-relative path; ledger-check asserts it exists */
  path: string;
  /** exported/declared symbol in that file; ledger-check greps for it when given */
  symbol?: string;
};

export type Rule = {
  /** stable id: family letter + integer, e.g. 'A1', 'C3', 'N12'. Never reassigned. */
  id: string;
  /** every other name this rule has been cited by (D1, D4, 'sliver rule', 'GTO lesson'). ledger-check makes them resolve. */
  aliases?: string[];
  family: Family;
  /** ≤ 60 chars — the family-strip line */
  title: string;
  /** the predicate itself, 1–3 sentences; what a verdict or a gate would cite. No story. */
  statement: string;
  /** the lesson/evidence in one or two sentences — the series and the failure that produced the rule */
  why?: string;
  ruledBy: 'Sean' | 'session' | 'source-derived';
  /** YYYY-MM-DD of the ruling (first statement) */
  ruledOn: string;
  /** where it was first written down (e.g. 'data-pipeline §12.45', 'batch-17 CHUNK1-RECOVERY §11') */
  origin?: string;
  enforcement: Enforcement[];
  layer: Layer;
  /** audit / census classes that verify the OUTCOME. Empty = visible automation backlog. */
  auditClass?: string[];
  /** series ids or test names that prove the rule (only what a ruling actually named) */
  witnesses?: string[];
  status: Status;
  supersedes?: string[];
  supersededBy?: string;
  /** related ids worth reading together */
  see?: string[];
};

export const isRuleId = (s: string): boolean => /^[ACTNIGVRP]\d{1,3}$/.test(s);
