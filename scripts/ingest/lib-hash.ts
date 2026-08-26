// lib-hash — ONE definition of "the lib content hash" (T2.6, rule P4 /
// invariant 2 made checkable). build-functions.ts stamps it into every edge
// bundle's banner; system-census recomputes it and fails if any bundle
// carries an older hash — a lib change without a rebuild is the silent
// drift invariant 2 exists to prevent. Deploying the rebuilt bundles is
// still the P3 procedure; this proves the bundles are CURRENT. lib/ledger/
// (the rules records) is excluded: nothing runtime imports it, so a rule-text
// edit must not demand a deploy. lib/rulings/ IS included — the gates read it.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

export function libHash(root = process.cwd()): string {
  const files: string[] = [];
  const walk = (d: string) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) { if (f !== 'ledger') walk(p); } // lib/ledger is docs-as-code — no bundle imports it
      else if (f.endsWith('.ts')) files.push(p);
    }
  };
  walk(join(root, 'scripts/ingest/lib'));
  walk(join(root, 'supabase/functions/_src'));
  const h = createHash('sha256');
  for (const f of files.sort()) h.update(relative(root, f)).update('\0').update(readFileSync(f));
  return h.digest('hex');
}
