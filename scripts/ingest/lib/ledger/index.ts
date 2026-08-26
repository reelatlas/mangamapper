// The rules ledger — all families. Records live one file per family;
// this index is what gen-docs, ledger-check and (later) the audits import.
export * from './types';
import type { Rule } from './types';

import { RULES as A } from './a';
import { RULES as C } from './c';
import { RULES as T } from './t';
import { RULES as N } from './n';
import { RULES as I } from './i';
import { RULES as G } from './g';
import { RULES as V } from './v';
import { RULES as R } from './r';
import { RULES as P } from './p';

export const ALL_RULES: Rule[] = [...A, ...C, ...T, ...N, ...I, ...G, ...V, ...R, ...P];

const byIdMap = new Map<string, Rule>();
for (const r of ALL_RULES) {
  byIdMap.set(r.id, r);
  for (const a of r.aliases ?? []) byIdMap.set(a.toLowerCase(), r);
}
/** Resolve an id OR an alias (case-insensitive for aliases). */
export const rule = (idOrAlias: string): Rule | undefined =>
  byIdMap.get(idOrAlias) ?? byIdMap.get(idOrAlias.toLowerCase());
