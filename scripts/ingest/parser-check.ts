// Parser sanity check against saved fixtures — run before any live ingest:
//   npx tsx scripts/ingest/parser-check.ts
// Asserts the AFL parser reproduces known-good facts from the fixture pages.

import { readFileSync } from 'node:fs';
import { parseShowPage, parseShowsIndex } from './lib/afl';

const fail = (msg: string): never => {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
};

const naruto = parseShowPage(readFileSync('scripts/ingest/fixtures/afl-naruto.html', 'utf8'));

if (naruto.title !== 'Naruto') fail(`title: ${JSON.stringify(naruto.title)}`);
if (naruto.episodes.length !== 220) fail(`episode count: ${naruto.episodes.length}`);
if (!naruto.integrity.ok) fail(`integrity: ${naruto.integrity.mismatches.join('; ')}`);

const counts: Record<string, number> = {};
for (const e of naruto.episodes) counts[e.type] = (counts[e.type] ?? 0) + 1;
// From the fixture's own row classes: 90 filler, 74 manga canon, 56 mixed.
if (counts['filler'] !== 90) fail(`filler count: ${counts['filler']}`);
if (counts['canon'] !== 74) fail(`canon count: ${counts['canon']}`);
if (counts['mixed'] !== 56) fail(`mixed count: ${counts['mixed']}`);

const ep1 = naruto.episodes[0];
if (ep1.number !== 1 || ep1.title !== 'Enter: Naruto Uzumaki!' || ep1.type !== 'canon' || ep1.airDate !== '2002-10-03') {
  fail(`episode 1: ${JSON.stringify(ep1)}`);
}

const index = parseShowsIndex(readFileSync('scripts/ingest/fixtures/afl-shows-index.html', 'utf8'));
if (index.length < 300) fail(`index size: ${index.length}`);
if (!index.some((e) => e.slug === 'naruto' && /naruto/i.test(e.title))) fail('naruto missing from index');
const slugs = new Set(index.map((e) => e.slug));
if (slugs.size !== index.length) fail(`duplicate slugs in index: ${index.length - slugs.size}`);

console.log(`OK: naruto ${naruto.episodes.length} eps (${JSON.stringify(counts)}), integrity clean, index ${index.length} shows`);

// Regression fixtures for the two integrity-failure causes.
const another = parseShowPage(readFileSync('scripts/ingest/fixtures/afl-another.html', 'utf8'));
if (another.episodes.length !== 13) fail(`another count: ${another.episodes.length}`);
if (another.episodes[0].number !== 0) fail('another: episode 0 missing');
if (!another.integrity.ok) fail(`another integrity: ${another.integrity.mismatches.join('; ')}`);

const boruto = parseShowPage(readFileSync('scripts/ingest/fixtures/afl-boruto.html', 'utf8'));
if (boruto.episodes.length !== 292) fail(`boruto count (dup row should collapse): ${boruto.episodes.length}`);
if (!boruto.integrity.ok) fail(`boruto integrity: ${boruto.integrity.mismatches.join('; ')}`);

console.log('OK: another (ep 0) and boruto (dup row) regressions pass');
