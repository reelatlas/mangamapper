// I41 — THE SOURCE CHAIN (Sean ruled 2026-09-04): a franchise's reading chain is
// the ordered sequence of NAMED MANGA WORKS (instruments the catalog can count
// chapters in) that tell one continuous story: Rosario + Vampire Season I →
// Season II; Trigun → Trigun Maximum. An episode that adapts material from
// another work on the chain is CANON to the series, told out of order — the
// `chain_source` annotation (T26), position-less (A12 / A44; the anchor column is
// numeric in the entry's own source). Novels, games and parallel tellings are
// NEVER on the chain however the author blessed them: their canon is the
// `adopted` ruling and their record is `side_source`. The chain is what makes
// the two kinds CHECKABLE: a chain_source naming a work off the map, or a
// side_source naming a work on it, is a census mismatch (chain_source_unmapped /
// side_source_on_chain). Convention: a chain_source / side_source annotation's
// chapters field STARTS with the work's label as written here ('Season II: ch 1, 3').
import type { RulingEntry } from './types';
import { toRecord } from './types';

export type ChainWork = { label: string; anilistMangaId: number | null; note?: string };
export type SourceChain = { works: ChainWork[] };

export const ENTRIES: RulingEntry<SourceChain>[] = [
  {
    seriesId: 'rosario-vampire',
    ruleId: 'I41',
    value: { works: [
      { label: 'Season I', anilistMangaId: 30894, note: 'Rosario + Vampire (2004-07), the entry\'s instrument — 40 chapters' },
      { label: 'Season II', anilistMangaId: 33403, note: 'Rosario + Vampire Season II (2007-14; AniList 33403 / MAL 3403, 67 ch / 14 vols — registered 2026-09-05, I41) — the sequel manga; the Capu2 TV season adapts its ch 1 + 3 in ep 14 and is otherwise original' },
    ] },
    reason:
      "Batch 20 wave 16 (verified R24), Sean ruled 2026-09-04: ep 14 adapts Season II ch 1 'A Brand-New Season' + ch 3 'Superglue Girl' inside an original plot — the sequel manga is the same story by the same author, so the material is canon to the series told out of order: mixed, position-less, `chain_source`{Season II: ch 1, 3}. Whether Capu2 should be its own entry with Season II as its instrument is an identity question queued for the identity pass; this chain works either way.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/rosario-vampire-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md'],
  },
  {
    seriesId: 'trigun',
    ruleId: 'I41',
    value: { works: [
      { label: 'Trigun', anilistMangaId: 30703, note: 'Trigun (1995-97), the entry\'s instrument' },
      { label: 'Trigun Maximum', anilistMangaId: 30704, note: 'Trigun Maximum (1997-2007; AniList 30704 / MAL 704, 104 ch / 14 vols — registered 2026-09-05, I41) — the continuation; its own numbering, never convertible into Trigun\'s' },
    ] },
    reason:
      "Sean ruled 2026-09-04 (the wave-16 sitting): ep 18 adapts Trigun Maximum ch 1 'HERO REBORN' + ch 2 'LINA' — the continuation manga, canon to the series told out of order: the standing `side_source` becomes `chain_source`{Trigun Maximum: ch 1, 2} (the row stays mixed, position-less). The novel / game / parallel boundary keeps naruto-shippuden 452-457 + 484-500 (the Itachi / Sasuke / Shikamaru / Konoha Hiden novels) OFF the chain as side_source — FILLER unless an adopted{basis} act is cited (the T26 adoption sitting, 2026-09-05).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/WAVE16-RECOVERY.md'],
  },
  {
    seriesId: 'boruto-naruto-next-generations',
    ruleId: 'I41',
    value: { works: [
      { label: 'Naruto', anilistMangaId: 30011, note: 'Naruto (1999-2014), ch 1-700 — the Naruto TV / Shippuden instrument; ep 24 adapts its epilogue ch 700' },
      { label: 'Naruto Gaiden', anilistMangaId: 86171, note: 'Naruto Gaiden: The Seventh Hokage and the Scarlet Spring (2015) — its own tankōbon, printed 700+1…700+10, not inside 30011\'s 700; eps 19-23 adapt it, ep 39 its second one-shot' },
      { label: 'Boruto', anilistMangaId: 87178, note: 'Boruto: Naruto Next Generations (2016-), the entry\'s instrument — its chapter space is 1-80, never 700' },
    ] },
    reason:
      "Batch 21 wave 3 (verified R24), Sean ruled 2026-09-04 (Cursor's framing): one continuity, three instruments — Naruto → Naruto Gaiden → Boruto. Naruto TV and Shippuden share one manga and need no chain; Boruto's instrument is the Boruto manga, so ep 24 adapting Naruto ch 700 is the Rosario-14 shape: the same story in another book's numbers = chain_source, position-less in Boruto's 1-80 space (an anchor of 700 would pretend Boruto's chapters reach 700). The Gaiden is the extra named work (its own tankōbon, 700+1…+10, not inside 30011's 700). Novels stay off the chain. One annotation row per kind (the table's key is series + episode + kind), so ep 24's record names both works in one chapters field, first label checked. Follow-up: eps 19-23 / 39 (stored canon on Gaiden chapters) want chain_source annotations.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/boruto-naruto-next-generations-w3.json', 'scripts/ingest/research/batch21/verify/w3-flips.md', 'scripts/ingest/research/batch21/WAVE3-RECOVERY.md'],
  },
  // ---- the T26 adoption sitting (Sean 2026-09-05, research/batch22/T26-SITTING.md), G3: the author's own other MANGA is a chain question, never adoption
  {
    seriesId: 'gto-great-teacher-onizuka',
    ruleId: 'I41',
    value: { works: [
      { label: 'GTO', anilistMangaId: 30336, note: 'GTO: Great Teacher Onizuka (1997-2002), the entry\'s instrument — Lessons' },
      { label: 'Shonan Junai Gumi', anilistMangaId: 30445, note: 'Shonan Junai Gumi! (湘南純愛組!, 1990-96, 267 ch / 31 vols; AniList 30445 / MAL 445 — registered 2026-09-05, I41) — Fujisawa\'s prequel manga (Onizuka\'s biker youth); eps 25-26 adapt its Last Signal arc (ch 239-242) recast for the GTO cast' },
    ] },
    reason:
      "The T26 adoption sitting (Sean 2026-09-05, G3): SJG is the Trigun Maximum shape — a prequel manga, countable, already verified as the Last Signal chapters (batch 19, R24). One continuous story by the same author = a chain work; the rows are canon told out of order (chain_source, position-less A44), not a licence question. AniList id for SJG not stored here (null is allowed); GTO's id is the entry's instrument.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/batch22/T26-SITTING.md', 'scripts/ingest/research/batch19/verify/gto.md', 'https://kodansha.co.jp/comic/products/0000004454'],
  },
  {
    seriesId: 'cobra-the-animation',
    ruleId: 'I41',
    value: { works: [
      { label: 'Cobra', anilistMangaId: 31062, note: 'コブラ, the 1978-84 Weekly Shonen Jump serialization (18 vols / 156 instalments) — the entry\'s instrument' },
      { label: 'Galaxy Knights', anilistMangaId: null, note: 'COBRA ギャラクシー・ナイツ (Super Jump 1996, 6 instalments; JC Deluxe full-colour vol 4; NO AniList node — searched 2026-09-05 as ギャラクシーナイツ / Cobra Galaxy Knights / Galaxy Knights, none: the id stays null, P6) — Terasawa\'s later Cobra serial; eps 10-13 adapt it (ja-WP 各話リスト 原作エピソード rowspan-4)' },
    ] },
    reason:
      "The T26 adoption sitting (Sean 2026-09-05, G3): the weaker cousin of SJG (a later short serial rather than a prequel) but the same I41 shape as Naruto Gaiden — a named manga, its own instrument, the same continuity and author. On the chain; the batch-20 verdict's side_source on ep 13 is re-kinded to chain_source on the whole 10-13 block the verdict flagged.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/batch22/T26-SITTING.md', 'scripts/ingest/research/batch20/out/cobra-the-animation.json', 'scripts/ingest/research/batch20/WAVE7-RECOVERY.md'],
  },
  {
    seriesId: 'fate-kaleid-liner-prisma-illya',
    ruleId: 'I41',
    value: { works: [
      { label: 'Prisma Illya', anilistMangaId: 33526, note: 'Fate/kaleid liner Prisma☆Illya (2007-08, 2 vols) — the entry\'s instrument; S1' },
      { label: '2wei!', anilistMangaId: 85136, note: 'Fate/kaleid liner Prisma☆Illya 2wei! (2009-12, 5 vols) — 2wei! + 2wei Herz! adapt it' },
      { label: '3rei!!', anilistMangaId: 66131, note: 'Fate/kaleid liner Prisma☆Illya 3rei!! (2012-, releasing) — the 3rei!! season, Vow in the Snow, Licht' },
    ] },
    reason:
      "Sean 2026-09-05 (the extras rulings, decision (d) via Cursor): 2wei / 3rei are SEASONS of fate-kaleid-liner-prisma-illya (I15 open-ended; the D2 split pending), not other-instrument works and not mints — register the chain's AniList ids so a film adapting 3rei reads as the owner's own instrument (same_instrument), never a series candidate. Ids from the owned entries' ADAPTATION edges (Undoukai DE Dance → 33526; 2wei Herz! → 85136; 3rei!! → 66131).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0'],
  },
  {
    seriesId: 'jojos-bizarre-adventure',
    ruleId: 'I41',
    value: { works: [
      { label: 'Phantom Blood', anilistMangaId: 31517, note: 'Part 1 — the entry\'s registered instrument' },
      { label: 'Battle Tendency', anilistMangaId: 31630, note: 'Part 2 (Sentou Chouryuu)' },
      { label: 'Stardust Crusaders', anilistMangaId: 30872, note: 'Part 3 — the 1993 / 2000 OVAs adapt it too (alternative tellings of a chain work, not other-instrument)' },
      { label: 'Diamond Is Unbreakable', anilistMangaId: 33006, note: 'Part 4' },
      { label: 'Golden Wind', anilistMangaId: 33008, note: 'Part 5 (Ougon no Kaze)' },
      { label: 'Stone Ocean', anilistMangaId: 33009, note: 'Part 6' },
    ] },
    reason:
      "Source-derived 2026-09-05 (the same shape as Prisma Illya, Sean's decision (d) ruling): AniList splits JoJo into one manga node per part and each owned component adapts its own part — the chain is the parts in order (I15 open-ended; Steel Ball Run stays a halo candidate until owned). Without the ids the 1993 / 2000 Stardust Crusaders OVAs read as another run (other_instrument) and were proposed as mints; with them they are alternative tellings of the owner's own instrument. Ids from the owned entries' ADAPTATION edges.",
    ruledBy: 'source-derived',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0'],
    retiresWhen: 'Sean re-rules the JoJo chain (the D2 per-part split) — then the works are re-labelled to his split',
  },
  {
    seriesId: 'the-melancholy-of-haruhi-suzumiya',
    ruleId: 'I41',
    value: { works: [
      { label: 'Yuuutsu', anilistMangaId: 33083, note: 'The Melancholy of Haruhi Suzumiya (vol 1) — the entry\'s instrument; AniList lists the novel per volume' },
      { label: 'Tameiki', anilistMangaId: 145590, note: 'The Sigh (vol 2)' },
      { label: 'Taikutsu', anilistMangaId: 145591, note: 'The Boredom (vol 3)' },
      { label: 'Shoushitsu', anilistMangaId: 145592, note: 'The Disappearance (vol 4) — the 2010 film adapts it whole' },
      { label: 'Bousou', anilistMangaId: 145593, note: 'The Rampage (vol 5)' },
      { label: 'Douyou', anilistMangaId: 145594, note: 'The Wavering (vol 6)' },
    ] },
    reason:
      "Source-derived 2026-09-05 (decision (d) of the extras sitting): AniList splits the Haruhi novel into one node per volume; the 2009 TV run adapts five of them and the Disappearance film adapts the fourth alone, so without the chain the film read as another run (other_instrument) and was proposed as a mint. The volumes are one novel — the owner's own instrument (I41); the film is same_instrument.",
    ruledBy: 'source-derived',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0'],
    retiresWhen: 'Sean rules the Haruhi chain himself',
  },
];

export const SOURCE_CHAINS: Record<string, SourceChain> = toRecord(ENTRIES);

const norm = (s: string) => s.trim().toLowerCase();
/** the work label a chain_source / side_source annotation names (the text before the first ':'), or null when unlabelled */
export const annotationWorkLabel = (chapters: string | null | undefined): string | null => {
  const m = /^\s*([^:]{2,60}):/.exec(chapters ?? '');
  return m ? m[1].trim() : null;
};
/** is this label a work on the series' chain? */
export const isChainWork = (seriesId: string, label: string): boolean =>
  (SOURCE_CHAINS[seriesId]?.works ?? []).some((w) => norm(w.label) === norm(label));
