// Flag-queue hygiene (repeatable): dismiss exact-duplicate OPEN flags
// (same series_key + kind), keeping the oldest as the canonical record.
// Duplicates predate fileFlagOnce; every writer files once now, so this is
// convergent. Rulings themselves stay human — this script never dismisses a
// unique flag.
//   npx tsx --env-file=.env.ingest scripts/ingest/cleanup-flags.ts

import { db } from './lib/db';

async function main() {
  const { data } = await db
    .from('ingest_flags')
    .select('id, series_key, kind')
    .eq('status', 'open')
    .order('id');
  const seen = new Map<string, number>();
  const dupes: number[] = [];
  for (const f of data ?? []) {
    const key = `${f.series_key}::${f.kind}`;
    if (seen.has(key)) dupes.push(f.id);
    else seen.set(key, f.id);
  }
  if (dupes.length) {
    const { error } = await db
      .from('ingest_flags')
      .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
      .in('id', dupes);
    if (error) throw new Error(error.message);
  }
  console.log(`dismissed ${dupes.length} duplicate open flags (kept oldest of each): ${dupes.join(', ')}`);
  const { count } = await db.from('ingest_flags').select('*', { count: 'exact', head: true }).eq('status', 'open');
  console.log(`open flags remaining: ${count}`);
}
main().then(() => process.exit(0));
