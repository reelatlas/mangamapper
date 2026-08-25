// Restage AFG from STORED raw_html — no network (the consolidate skill's
// step-3 contract, now an actual tool, 2026-08-25): after any lib/afg.ts
// parser change, staging must never hold output the current parse wouldn't
// produce. Re-parses every staged page's raw_html into raw (episodes +
// seasons + continua, preserving a previously staged continua when the
// re-parse finds none) and updates content_hash. Idempotent.
//   npx tsx --env-file=.env.ingest scripts/ingest/afg-restage.ts [--dry-run]

import { db } from './lib/db';
import { parseAfgPage, parseContinua, type AfgContinua } from './lib/afg';
import { contentHash } from './lib/hash';

const DRY = process.argv.includes('--dry-run');

async function main() {
  let changed = 0, unchanged = 0, noHtml = 0;
  for (let off = 0; ; off += 200) {
    const { data: pages } = await db
      .from('ingest_afg_pages')
      .select('slug, raw, raw_html, content_hash')
      .order('slug')
      .range(off, off + 199);
    for (const p of pages ?? []) {
      if (!p.raw_html) { noHtml++; continue; }
      const page = parseAfgPage(p.raw_html as string);
      const prevContinua = (p.raw as { continua?: AfgContinua | null } | null)?.continua ?? null;
      const continua = parseContinua(p.raw_html as string) ?? prevContinua;
      const core = { title: page.title, seasons: page.seasons, episodes: page.episodes };
      const hash = contentHash(core);
      if (p.content_hash === hash) { unchanged++; continue; }
      changed++;
      console.log(`  restage ${p.slug} (hash changed)`);
      if (!DRY) {
        const { error } = await db
          .from('ingest_afg_pages')
          .update({ raw: { ...core, continua }, content_hash: hash })
          .eq('slug', p.slug);
        if (error) throw new Error(`${p.slug}: ${error.message}`);
      }
    }
    if (!pages || pages.length < 200) break;
  }
  console.log(`[afg-restage] ${changed} restaged, ${unchanged} unchanged, ${noHtml} without raw_html${DRY ? ' — DRY RUN' : ''}`);
}
main().then(() => process.exit(0));
