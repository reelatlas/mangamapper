// INCIDENT 2026-09-05, recovery step 1 — repair the 31 source_map rows
// audit-titles.ts flipped against a stale fixture index (the incident file:
// research/discovery/INCIDENT-2026-09-05.md). Every row is restored BY RULE,
// never from memory: a page whose series survives → active + that series'
// AniList id (the row still carries the afl_slug); a page of a deleted
// series → active + the id its AniList staging names; a per-season page of a
// stitched series → 'duplicate' (I12); the corrupted Pokémon generation pages
// → excluded as franchise-rulings.md rules them; an unmatched slug → active
// with anilist NULL (the ladder re-runs); Shounan → excluded (Sean 2026-09-05,
// intended); the four manual exclusions → unchanged. Idempotent; --dry-run
// prints every change. One-shot: moves to history/ when the recovery closes.
//   npx tsx --env-file=.env.ingest scripts/ingest/history/restore-source-map-2026-09-05.ts [--dry-run]
import { db, selectAll } from '../lib/db';

const DRY = process.argv.includes('--dry-run');
const INCIDENT = 'restored after INCIDENT 2026-09-05 (audit-titles flipped it against a stale fixture index — a false corruption verdict)';

type Fix = { disposition: 'active' | 'duplicate' | 'excluded'; anilist: number | null; note: string };
const FIX: Record<string, Fix> = {
  // pages of SURVIVING series (their series rows still carry the afl_slug)
  'ranking-kings': { disposition: 'active', anilist: 113717, note: INCIDENT },
  'cells-work': { disposition: 'active', anilist: 100977, note: INCIDENT },
  'cells-work-code-black': { disposition: 'active', anilist: 117533, note: INCIDENT },
  'seirei-tsukai-no-blade-dance': { disposition: 'active', anilist: 20663, note: INCIDENT },
  // pages of the six DELETED series (ids from their AniList staging; the pages were held — sparse / empty — before the incident and will hold again)
  'chrono-crusade': { disposition: 'active', anilist: 60, note: INCIDENT },
  'kinnikuman': { disposition: 'active', anilist: 3272, note: INCIDENT },
  'elemental-gelade': { disposition: 'active', anilist: 1250, note: INCIDENT },
  'city-hunter': { disposition: 'active', anilist: 1470, note: INCIDENT },
  'orient': { disposition: 'active', anilist: 128034, note: INCIDENT },
  'kakegurui': { disposition: 'active', anilist: 98314, note: INCIDENT },
  // per-season pages of STITCHED series — I12 duplicates
  'food-wars-second-plate-1': { disposition: 'duplicate', anilist: null, note: 'per-season page of the stitched food-wars run (I12); ' + INCIDENT },
  'food-wars-third-plate-1': { disposition: 'duplicate', anilist: null, note: 'per-season page of the stitched food-wars run (I12); ' + INCIDENT },
  'food-wars-fourth-plate': { disposition: 'duplicate', anilist: null, note: 'per-season page of the stitched food-wars run (I12); ' + INCIDENT },
  'food-wars-fifth-plate': { disposition: 'duplicate', anilist: null, note: 'per-season page of the stitched food-wars run (I12); ' + INCIDENT },
  'noragami-aragoto': { disposition: 'duplicate', anilist: null, note: 'per-season page (S2) of the stitched noragami run (I12); ' + INCIDENT },
  'bakemonogatari': { disposition: 'duplicate', anilist: null, note: 'a component page of monogatari-series (ONE series, Sean 2026-08-22; I12); ' + INCIDENT },
  'nekomonogatari-kuro': { disposition: 'duplicate', anilist: null, note: 'a component page of monogatari-series (ONE series, Sean 2026-08-22; I12); ' + INCIDENT },
  // the corrupted Pokémon generation pages — ruled (docs/franchise-rulings.md: built via node-ID recovery while AFL's generation pages stay corrupted)
  'pok%C3%A9mon-sun-and-moon': { disposition: 'excluded', anilist: null, note: "AFL's Pokémon generation pages are alias-corrupt (docs/franchise-rulings.md, Sean 2026-08-22) — re-evaluate when AFL fixes their aliases; " + INCIDENT },
  'pok%C3%A9mon-journeys': { disposition: 'excluded', anilist: null, note: "AFL's Pokémon generation pages are alias-corrupt (docs/franchise-rulings.md, Sean 2026-08-22) — re-evaluate when AFL fixes their aliases; " + INCIDENT },
  'pok%C3%A9mon-x-and-y': { disposition: 'excluded', anilist: null, note: "AFL's Pokémon generation pages are alias-corrupt (docs/franchise-rulings.md, Sean 2026-08-22) — re-evaluate when AFL fixes their aliases; " + INCIDENT },
  // unmatched slugs — active with no id; the match ladder re-runs on the next sweep and re-files their holds
  'digimon-adventure-02': { disposition: 'active', anilist: null, note: INCIDENT },
  'digimon-tamers': { disposition: 'active', anilist: null, note: INCIDENT },
  'digimon-frontier': { disposition: 'active', anilist: null, note: INCIDENT },
  'miraculous-ladybug': { disposition: 'active', anilist: null, note: INCIDENT },
  'mobile-suit-zeta-gundam': { disposition: 'active', anilist: null, note: INCIDENT },
  'mobile-suit-gundam-zz': { disposition: 'active', anilist: null, note: INCIDENT },
  // INTENDED (Sean 2026-09-05): the percent-encoded alias stays excluded; shounan-junai-gumi exists by its ruled grid (G59 C)
  'sh%C5%8Dnan-pure-love-gang': { disposition: 'excluded', anilist: null, note: "provenance corruption — a percent-encoded Drupal alias whose index title is another show's; shounan-junai-gumi exists by its ruled grid (G59 C) and does not need this page (Sean 2026-09-05)" },
};
const UNCHANGED = ['berserk-golden-age-arc', 'kizumonogatari', 'digimon-adventure-tri', 'one-pace']; // the manual exclusions — already excluded before the run

async function main() {
  const rows = await selectAll<{ afl_slug: string; disposition: string; anilist_id: number | null; note: string | null }>('source_map', 'afl_slug, disposition, anilist_id, note', (q) => q.in('afl_slug', [...Object.keys(FIX), ...UNCHANGED]));
  const by = new Map(rows.map((r) => [r.afl_slug, r]));
  let changed = 0;
  for (const [slug, fix] of Object.entries(FIX)) {
    const cur = by.get(slug);
    if (!cur) { console.log(`  ${slug}: NO ROW — inserting as ${fix.disposition}`); }
    const same = cur && cur.disposition === fix.disposition && (cur.anilist_id ?? null) === fix.anilist && cur.note === fix.note; // the note is the ruled reason — the run overwrote it with the stale-index text
    console.log(`  ${slug}: ${cur ? `${cur.disposition} / anilist ${cur.anilist_id ?? 'null'}` : 'missing'} → ${fix.disposition} / anilist ${fix.anilist ?? 'null'}${same ? ' (unchanged)' : ''}`);
    if (same) continue;
    changed++;
    if (DRY) continue;
    const { error } = await db.from('source_map').upsert({ afl_slug: slug, disposition: fix.disposition, anilist_id: fix.anilist, match_method: 'manual', confidence: 1, verified: true, note: fix.note, updated_at: new Date().toISOString() });
    if (error) throw new Error(`${slug}: ${error.message}`);
  }
  for (const slug of UNCHANGED) { const cur = by.get(slug); console.log(`  ${slug}: ${cur?.disposition ?? 'missing'} (manual exclusion — unchanged)`); }
  const all: Record<string, number> = {}; for (const r of await selectAll<{ disposition: string }>('source_map', 'disposition')) all[r.disposition] = (all[r.disposition] ?? 0) + 1;
  console.log(`[restore-source-map] ${changed} row(s) ${DRY ? 'would change — DRY RUN' : 'restored'} · dispositions now ${JSON.stringify(all)} (before the incident: active 303 · excluded 44 · duplicate 14)`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
