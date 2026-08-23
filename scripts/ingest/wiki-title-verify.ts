// Title-alignment verifier (Sean's UY report 2026-08-23): for each series,
// compare stored non-empty titles against the wiki episode list at offsets
// -1/0/+1 and report per-REGION alignment — the flip point localizes
// numbering-space divergence (a special one source numbers, segment-vs-
// broadcast counting, etc.). Read-only: findings drive declared shifts.
//   npx tsx --env-file=.env.ingest scripts/ingest/wiki-title-verify.ts <ids...>

import { db } from './lib/db';
import { extractTransclusions, findEpisodePages, fetchWikitext, parseEpisodeList, type WikiEpisode } from './lib/wikipedia';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const similar = (a: string, b: string) => {
  const na = norm(a), nb = norm(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const ta = new Set(na.split(' ')), tb = new Set(nb.split(' '));
  let sh = 0;
  for (const t of ta) if (tb.has(t)) sh++;
  return sh / Math.min(ta.size, tb.size) >= 0.6;
};

async function main() {
  const ids = process.argv.slice(2);
  for (const id of ids) {
    const { data: s } = await db.from('series').select('title, title_native, aired_episodes').eq('id', id).maybeSingle();
    if (!s) { console.log(`${id}: no series`); continue; }
    const { data: rows } = await db.from('episodes').select('number, title').eq('series_id', id).order('number');
    const stored = (rows ?? []).filter((r) => String(r.title ?? '').trim());
    const pages = await findEpisodePages([s.title, s.title_native ?? ''].filter(Boolean));
    let wiki: WikiEpisode[] = [];
    for (const p of pages) {
      const wt = await fetchWikitext(p);
      if (!wt) continue;
      wiki = wiki.concat(parseEpisodeList(wt));
      for (const sub of extractTransclusions(wt).slice(0, 12)) {
        const swt = await fetchWikitext(sub);
        if (swt) wiki = wiki.concat(parseEpisodeList(swt));
        await sleep(500);
      }
      await sleep(500);
    }
    const wk = new Map(wiki.filter((w) => Number.isInteger(w.number) && w.title).map((w) => [w.number, w.title!]));
    if (!wk.size || !stored.length) { console.log(`${id}: no comparable data (wiki ${wk.size}, stored ${stored.length})`); continue; }
    // per-quarter offset tallies localize the flip
    const q = Math.max(1, Math.ceil(stored.length / 4));
    for (let seg = 0; seg < 4; seg++) {
      const slice = stored.slice(seg * q, (seg + 1) * q);
      if (!slice.length) continue;
      const tally: Record<string, number> = { '-1': 0, '0': 0, '+1': 0 };
      for (const r of slice) {
        for (const o of [-1, 0, 1]) {
          const w = wk.get(r.number + o);
          if (w && similar(String(r.title), w)) tally[o > 0 ? '+1' : String(o)]++;
        }
      }
      const lo = slice[0].number, hi = slice[slice.length - 1].number;
      console.log(`${id} eps ${lo}-${hi}: match@-1=${tally['-1']} @0=${tally['0']} @+1=${tally['+1']} (${slice.length} titled rows)`);
    }
  }
}
main().then(() => process.exit(0));
