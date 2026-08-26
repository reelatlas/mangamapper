// unpaged-selects — the P32 mechanical check (T2.3). Lists every
// `db.from('<catalog-sized table>').select(` in scripts/ingest (lib, healers,
// audits, edge sources) that neither pages (.range / selectAll) nor bounds
// itself (.limit / .single / .maybeSingle / head:true). Per-series reads on
// `episodes` and `chapter_anchors` are included — one-piece and detective-
// conan exceed 1000 rows, so "per series" is not a bound. Historical apply
// scripts (scripts/ingest/history/, apply-research-*, apply-rulings-*) are
// skipped: they are the cited record, not runnable code.
//   npx tsx scripts/restructure/unpaged-selects.ts        → list (exit 1 if any)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BIG = new Set(['series', 'episodes', 'chapter_anchors', 'episode_annotations', 'volume_boundaries', 'series_components', 'series_external_ids', 'source_map', 'ingest_afl_shows', 'ingest_afg_pages', 'ingest_anilist_media', 'ingest_mangaupdates', 'ingest_flags', 'watch_order_entries', 'ingest_fractionals', 'series_scopes']);
// T0 triage classes history/dead (docs/restructure/t0/scripts-1.json) are skipped until T2.5 moves them to history/.
const HISTORY = new Set(["apply-continue-points.ts", "apply-rearranged-anchors-2.ts", "apply-rearranged-anchors-3.ts", "apply-rearranged-anchors.ts", "apply-research-aot-finale.ts", "apply-research-aot-s4p2.ts", "apply-research-batch-10.ts", "apply-research-batch-11.ts", "apply-research-batch-12.ts", "apply-research-batch-13.ts", "apply-research-batch-14.ts", "apply-research-batch-15.ts", "apply-research-batch-16.ts", "apply-research-batch-17.ts", "apply-research-batch-3.ts", "apply-research-batch-4.ts", "apply-research-batch-5.ts", "apply-research-batch-6.ts", "apply-research-batch-7.ts", "apply-research-batch-8.ts", "apply-research-batch-9.ts", "apply-research-batch.ts", "apply-rulings-20260824.ts", "apply-rulings-20260825-mashle.ts", "apply-rulings-20260825b.ts", "apply-start-chapters.ts", "assisted-prep.ts", "canon-tier-2.ts", "canon-tier.ts", "cleanup.ts", "fix-mismatch.ts", "merge.ts", "pilot.ts", "polish-ids.ts", "stabilize.ts", "wayback-recover2.ts"]);
const SKIP = /\/history\/|\/research\/batch1[4-7]\/context\.ts$/;

const files: string[] = [];
const walk = (p: string) => { for (const f of readdirSync(p)) { const full = join(p, f); if (statSync(full).isDirectory()) { if (!/node_modules|fixtures|out2?$/.test(f)) walk(full); } else if (full.endsWith('.ts') && !SKIP.test(full) && !HISTORY.has(f)) files.push(full); } };
walk(join(process.cwd(), 'scripts/ingest')); walk(join(process.cwd(), 'supabase/functions/_src'));

const hits: string[] = [];
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const re = /db\s*\.from\(\s*['"`]([a-z_]+)['"`]\s*\)([\s\S]{0,400}?)(?=;|\n\s*\n)/g;
  for (const m of src.matchAll(re)) {
    const table = m[1], chain = m[2];
    if (!BIG.has(table)) continue;
    if (!/\.select\(/.test(chain)) continue; // writes are not walks
    if (/\.range\(|\.limit\(|\.single\(|\.maybeSingle\(|head:\s*true|count:\s*'exact'/.test(chain)) continue;
    const line = src.slice(0, m.index).split('\n').length;
    hits.push(`${f.replace(process.cwd() + '/', '')}:${line}  ${table}`);
  }
}
for (const h of hits) console.log('  unpaged  ' + h);
console.log(hits.length ? `[unpaged-selects] ${hits.length} unbounded catalog-sized select(s) — use selectAll (P32)` : '[unpaged-selects] OK');
process.exit(hits.length ? 1 : 0);
