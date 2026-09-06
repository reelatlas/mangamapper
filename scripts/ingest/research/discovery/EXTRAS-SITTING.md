# THE EXTRAS SITTING — decision record (I45, 2026-09-05)

**Status: BUILT + APPLIED at 861bffa (§12.128). The related-works ledger is data
(741 rows in `watch_order_entries`, origin `halo`, unsurfaced). STOPPED at step 4
of the cycle (RULE) — Sean decides. Nothing in §3 runs before he does.**

Regenerate the tables — never read a stale one (P5, P11); paste them into chat:

```
npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/recap.ts --scope extras --summary          # the load tables (this record's appendix)
npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/recap.ts --scope extras --limit 2000       # every work, a table per franchise, a decision column
npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/recap.ts --scope extras --owner <series>   # one owner
npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/extras-breakdown.ts                       # the held bucket by AniList source / edges; wiki-list overlap
npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/count-ledger.ts                           # the stored ledger by origin / standing / position / label
npx tsx --env-file=.env.ingest scripts/ingest/audit-discovery.ts                                           # the census classes (extra_*, related_work_stale / _violation)
```

## 0. RULED 2026-09-05 (afternoon) — all six as recommended, Cursor's build order

| decision | Sean's ruling | landed (§12.129) |
|---|---|---|
| (a) surfacing | filler-by-rule buckets ledger-only; the wiki-list label rule when N31 opens; the wiki↔halo adoption rule NOW | I46 (one row per work): 5 adoptions, 5 halo duplicates removed, `related_work_duplicate` 0 |
| (b) 150 same-instrument | build the standing map first, then films-first research waves (6-8) | the ruling layer `lib/rulings/related-works.ts` (empty until verdicts); `PROTOCOL-extras.md` + `extras-context.ts` written and proven; wave 1 (8 films) on Sean's go |
| (c) 291 held | triage per owner, top 10 first; yes → (b), no → filler with a reason | the same map; the TRIAGE shape is in `PROTOCOL-extras.md`, contexts via `extras-context.ts --targets triage` (one per owner) — a different week |
| (d) 50 other-instrument | Sean picks the run-shaped ones as step-2 mint input; the 5 one-shot tie-ins stay extras with (b) | `other-instrument-picks.ts` (appendix B): MINT 41 · tie-in 9 · hold 3 — awaiting the signature |
| (e) 5 promotional | promo bucket, ignored like music videos, census lists them, the rows dropped | I45 amended; `extra_promo` 5; three stored rows removed |
| (f) 127 undated | listed, no position, until AniList has a date; the weekly restage queued (not a ruling); NOTE the UI upcoming-schedule idea | confirmed; sidecars in STATE (restage; the UI note); node start years staged from now on |

**Second pass (afternoon, Sean with Cursor — §12.130).** GitS 1995 pulled from wave 1 (an I16 alternative,
a mint candidate — declared with Sean's reason); Heaven's Feel attributed to Fate's base, never to Prisma
Illya; Prisma Illya 2wei / 3rei registered as chain works (with JoJo's parts and Haruhi's volumes); the
mechanism behind both: the ALTERNATIVE bucket (a work no owner reached by an in-run relation sits once,
under the franchise base; 66 works). The (d) declarations: 27 entries in `lib/rulings/discovery.ts`
(the caveated seven held; one series per run). Wave 1 dispatched: Mugen Train, Legend of Crimson, Reze
Arc, Infinity Castle (Part 1), Dawn of the Deep Soul, Tanya the Movie, Goblin's Crown, The First Slam
Dunk. Wave 2 = the owner triage, a separate wave the same day. No mint this sitting.

**Third pass (afternoon — wave 1 applied, the registry, wave 2; §12.131).** Wave 1's eight verdicts verified (all
SOUND WITH NOTES) and ruled: two standings corrected to MIXED (Legend of Crimson, Tanya), Slam Dunk MIXED with the
author's credit in the note (never an adoption), two clusters re-ordered by ruling (KonoSuba 20.52; Made in Abyss
13.5 / 13.51 / 13.52). Sean's identity concern → the related-work IDENTITY REGISTRY (`related_work_external_ids`):
an external id maps into the WORK once, a collision is refused and listed, the wiki key survives a re-created row;
identity-first adoption found six title-hidden duplicates. Wave 2 (the owner triage, ten owners, 111 works)
dispatched.

**Fourth pass (wave 2 applied; §12.132).** The owner triage: ten owners, 111 works — 100 originals filler by ruling
(six naming another run), nine chapter-adapting works queued, eleven attribute repairs via the ruling layer's new
title / airDate / kind fields, the promo test extended to music videos by title. Twilight Axis, No Regrets and
Houkago no Ouji-sama sit on the (d) queue; one-shots (Excalibur, Death Game) are tie-ins. Wave 3 dispatched
(the next eight same-instrument works).

**Fifth pass (wave 3 applied; §12.133).** The first same-instrument wave: eight works, all verified SOUND WITH
NOTES, three task premises refuted on sources (the KonoSuba OVAs and Road to Hero are originals; the AoT OADs
shipped with manga volumes). Rulings: Haruhi CANON (vol 4 whole) · AoT MIXED at the licensor's 3.5 (volume 5 by
hand) · KonoSuba ×2 FILLER · Haikyu CANON (END 326 partial; the ch 327 post-credit scene is a sliver) · Road to
Hero FILLER · Kaguya CANON (ch 96 + the two Darkness 番外編, the instrument's own specials — not the GTO rule) ·
Slime FILLER ruled to 24.05 before Coleus. T26 amended with the related-works credit clause. Queued: kaguya ep 24
END 102 → 101 as a superseding curated anchor (never a silent edit). Ledger 697 halo rows, 378 pending, every
related_work_* class 0. Sean's standing request: ONE RULE-LOGIC EVALUATION of the related-works structure after
wave 4 lands and before step 2's mint writer — a generated table in chat (mechanism · gate · audit class ·
witnesses · verdict). Wave 4 = the nine yeses + the Prince of Tennis Semifinal / Final OVAs, in two P12 waves.

Gaps found while executing (queued in STATE, not rulings): SOURCE_CHAINS works carry no AniList ids
(a chain work reads as another run: Prisma Illya 2wei / 3rei, JoJo Stardust Crusaders, Haruhi's
per-volume nodes); a comicalization of a film reads as the run it adapts until node start years
are staged (GitS Arise Sleepless Eye, BSD Dead Apple). AniList's API was disabled for stability
during the sitting — every read degrades to staged facts and says so.

## 1. What Sean ruled (2026-09-05, with Cursor) — implemented

- Watch-order is the LEDGER of every related work: recap, compilation, special,
  OVA, film. Only music videos are ignored; character-only crossovers are listed,
  not fetched.
- Three layers, never collapsed: the ledger lists everything; the numbered count
  admits only counted extras (a component, N4 — a recap is never an integer row,
  N8); the series page shows only labeled rows (N31, `display_label`; surfacing
  is PARKED since 2026-08-24 — zero labeled rows before and after this sitting).
- No essential / optional / skippable axis: standing (canon | mixed | filler) +
  format (movie / ova / special / recap) is the skip guide.
- The FILMS RULING on I13 (amendable, dated): an owned series or franchise → any
  format including an original as a related work; an unowned IP with a T25
  instrument → a one-row staged series minted from AniList (step 2); an unknown
  or misc source → hold for Sean; an original with no parent stays out.
- Recaps are filler by rule; originals are filler by T25; a work adapting the
  series' own instrument is the sitting's load (standing + chapters by research).
- "Typically in watch order" = numbered by a source, on the wiki list, or ruled —
  else flagged. The manga watch table is step 3; the any-source list only on a
  miss.

## 2. The numbers (2026-09-05, after the instrument-set fix)

| | |
|---|---|
| related works | 794 over 180 owners (877 owner pairs) |
| ledger rows | 741 (127 pairs have no air date on AniList: listed, never slotted) |
| standing | 215 filler by rule · 526 pending |
| kinds | movie 296 · ova 181 · special 197 · recap 67 |
| buckets | same_instrument 150 · other_instrument 50 · held 291 · recap 64 · original 141 · crossover 90 · unstaged 8 |
| held, by cause | 207 = AniList's manga franchise tag or no source, with no edge (the DBZ / One Piece / Conan film shelves) · 25 novel-sourced with no edge · 15 VN / game / other · the rest single cases |
| held, by owner | the top 10 owners hold 128 of 291: dragon-ball 23, detective-conan 22, one-piece 20, naruto 11, fate 10, a-certain-magical-index 9, kinnikuman 9, mobile-suit-gundam 8, the-prince-of-tennis 8, ranma-1-2 8 |
| on a wiki watch-order list already | 4 pairs (MHA World Heroes' Mission; To LOVE-Ru Darkness OVA; Cardcaptor Sakura: The Movie; Golden Kamuy Sapporo Beer) |
| census | related_work_violation 0 · related_work_stale 0 · ruling_violation 0 · every UI-truth class unchanged |

The instrument-set fix (before Sean saw the table): AniList tags most franchise
films `source: MANGA` with no chapters behind them, and a novel-based series
registers no manga id — so KonoSuba's Legend of Crimson sat next to the MHA
films as "held". `adaptedNodes` reads the edges whose format the extra's OWN
source names (a novelization is never a source); `ownerInstrumentIds` is the
registered manga + chain works + a novel owner's NOVEL nodes from its own anime.
18 works moved out of held (KonoSuba ×3, Tanya, Goblin's Crown, DanMachi ×2,
Overlord ×2, Villainess ×2, DxD → same_instrument; SAO Progressive, Fate/strange
Fake, Durarara Gaiden ×2, Haruhi's Disappearance, Lost Girls, Tokyo Ghoul Hibi,
Gundam UC → other_instrument).

## 3. The decisions — Sean rules; each line below is a PROPOSAL with its capture path

### (a) Surfacing per bucket — recap / original / crossover are filler by rule

- **Facts.** Surfacing is parked (N32, the STATUS design pass; MHA's two labels
  are the only ones that ever existed). The ledger is complete either way. The
  test Sean set for "typically in watch order": numbered by a source, on the
  wiki list, or ruled. Today 4 pairs are on a wiki list; none of them is in a
  filler-by-rule bucket.
- **Proposal.** Keep the filler-by-rule buckets LEDGER-ONLY now; when the design
  pass opens surfacing, the first surfacing rule is "a ledger row a wiki
  watch-order list names surfaces with the wiki's label" (mechanical, 4 rows
  today) — every other label is a per-row ruling.
- **Capture.** Nothing to write if ledger-only. A surfaced row = a
  `WatchOrderRuling` entry in `lib/rulings/watch-order-labels.ts` (position +
  label, `ruledBy: 'Sean'`) — plus a small writer extension first:
  `sync-related-works` must read a label ruling BY ANILIST ID for halo rows
  (today `sync-watch-order` labels its own wiki rows only). Lib, gated, before
  the first label lands (P2).

### (b) The 150 same-instrument works

- **Facts.** Derived, not researched: AniList says the work adapts the owner's
  own manga / novel. Nothing on them reaches Sean unresearched (R1). Standing +
  chapters per work is exactly a research ask (the step-6 research-batch
  variant). Load by owner: gintama 7, kuroko 5, saint-seiya 4, sailor-moon 4,
  demon-slayer 4, then 3s and 2s; 53 owners have one.
- **Proposal.** A research wave programme in franchise order (popularity),
  6-8 works per wave (P12): per work → standing under T28's bar, chapters
  adapted, the derived position confirmed or corrected, 2+ sources (R3);
  `verdict-verifier` on a different model (R24). Films first (the ones users
  ask about: Mugen Train, Infinity Castle, THE VERY FINAL, Golden Age Arc,
  Hades chapters, Eternal / Cosmos), OVAs after.
- **Capture — build BEFORE the first wave lands.** A ruled standing has no map
  today (`extraStanding` is rule-only): add `standing` + `chapters` to the
  `WatchOrderRecord` keyed by anilist id in `watch-order-labels.ts` (the sitting's
  `origin: 'ruling'` layer), have `sync-related-works` write it and the
  derivation (`related_work_violation`) read it — an `/add-rule`-shaped change
  (ruling map → writer → audit). A protocol file
  `research/discovery/PROTOCOL-extras.md` pins the output JSON.

### (c) The 291 held

- **Facts.** 207 are AniList's franchise tag with nothing behind it — a film
  shelf per franchise (DBZ's 13 films, Conan's 22, One Piece's 20). Most are
  anime-original; a few adapt chapters (One Piece's "Episode of" specials are
  recaps by rule already; DBZ's Bardock / History of Trunks came through as
  same_instrument / other_instrument because AniList names their one-shots).
- **Proposal.** NOT a per-work wave. A TRIAGE wave first, one ask per OWNER
  ("of these N films / OVAs, which adapt manga chapters at all? cite"), the top
  10 owners first (128 of 291); a work that adapts chapters joins the
  same-instrument programme (b); a work that does not is an original — filler
  by T25, captured as a standing ruling (b's map) so it leaves the held class.
- **Capture.** The same map as (b): a ruled standing per anilist id with its
  reason. The census class `extra_unknown` is the worklist (R27) and shrinks
  as rulings land; a ruling map entry retires when AniList adds the edge
  (`retiresWhen`).

### (d) The 50 other-instrument works — series candidates vs one-shot tie-ins

- **Facts.** 45 adapt a RUN (a manga or novel of their own: JJK 0, Gundam UC /
  The Origin / Thunderbolt, Lost Canvas, Tokyo Ghoul Jack, Blue Lock Nagi,
  Dead Apple, Koro-sensei Q, Spare Bike, Kuroko Extra Game, Magic Kaito, Wild
  Police Story, Deku & Bakugo Rising…); 5 adapt a ONE-SHOT tie-in (Strong World
  Episode 0, Romance Dawn, DB Minus via Broly, Road to Ninja, The Day Naruto
  Became Hokage). Some runs already have an owner (Prisma Illya's films reached
  us via franchise fate — a same-instrument row for `fate-kaleid-liner-prisma-illya`).
- **Proposal.** The run-shaped ones are the INPUT LIST for step 2 (films as
  entries: each becomes a one-row staged series minted from AniList — the film
  / OVA as the entry, its run as the instrument — while its halo row stays the
  parent's related work, both per the I13 ruling). Sean picks from the 45; the
  5 one-shot tie-ins ride with the same-instrument programme (b) as research
  rows, never a series.
- **Capture.** A `CANDIDATE_ENTRIES` ruling in `lib/rulings/discovery.ts`
  (`anilist:<id>` → disposition series, slug, franchise, relation) per pick —
  declarations now; the MINT is step 2's writer (the one-row film mint as a
  named G59 path; `seedCandidates` accepts MOVIE for instrumented sources), run
  only from `/discover` after the dry-run recap.

### (e) PV / trailer specials in the ledger

- **Facts.** 5 promotional entries reached the ledger because I45 ignores only
  music videos (AniList format MUSIC): BLEACH 20th Anime Anniversary Official
  Trailer (182561, same_instrument); Bakemonogatari PV (143663,
  other_instrument); Evangelion x KATE CM (125785, crossover); Jongtama PV
  (139044, crossover); Jongtama x Gintama Collab promotion (207475, crossover).
  The only signal AniList gives is the title (format SPECIAL / ONA).
- **Proposal.** Ignore them like music videos: a `promo` bucket in
  `extraBucket` (the `PROMO` title test the summary already uses), listed by the
  census (`extra_promo`, so nothing is silently absent — I42) and never written
  to the ledger; the 5 stored rows are deleted by `sync-related-works` as its
  own origin's rows (G57) on the next heal.
- **Capture.** A lib rule + census class + an I45 amendment (`retiredPhrases`
  for "only music videos are ignored"), all five bundles redeployed (P3).

### (f) The 127 pairs without an air date

- **Facts.** AniList has no start date (announced works: Infinity Castle Part
  2, Solo Leveling Beyond the System, Haikyu VS Chiisana Kyojin's siblings;
  a few old works with no date). A position cannot be derived; the ledger lists
  them without one (P6 — never a guessed slot).
- **Proposal.** Confirm: listed, unpositioned, until a date exists. SIDECAR
  found here: candidate media staged by discovery are never re-fetched, so a
  date AniList adds later never arrives — a restage of RELEASING /
  NOT_YET_RELEASED candidates belongs in `refresh-discovery` (G44-shaped,
  budgeted under G58). Queued, not a decision.

## 4. Findings logged (not decisions)

- The halo grew when the extras were staged: 16 more unclaimed sequels and 20
  new-since-sitting rows (a staged film carries the SEQUEL chain: KonoSuba 3 / 4
  via Legend of Crimson, Made in Abyss S2 via Dawn of the Deep Soul, Goblin
  Slayer II, Tanya S2, DanMachi V / VI, Undead Unluck S2) and 7 fewer seeds
  (534 → 527: those IPs are the halo's rows now, by design). They are the next
  `/discover` sitting's rows, not this one's.
- AniList splits some novels per volume (Haruhi: five NOVEL nodes on the owner,
  the Disappearance film adapts a sixth) — a link ruling when it matters.
- Multi-owner works carry one ledger row per owner (877 pairs from 794 works);
  a franchise table groups them (I43).
- `run_stuck` 1 (afl #1044, killed 03:40) — marked by `heal-stuck-runs`.

## 5. Tomorrow's resume sequence

1. Read `docs/STATE.md` (the claim to verify), then this file.
2. `recap.ts --scope extras --summary` → paste the tables into chat (the
   checkpoint is a generated table in chat, never a pointer to this file).
3. Sean rules (a)–(f). Every ruling is captured where §3 says — a ruling map
   entry with its reason, a lib gate where a mechanism is new (`/add-rule`),
   never a doc paragraph (P29).
4. Then the build order: (b)/(c)'s standing map + protocol → the first
   research wave (`/research-batch`, the extras variant) · (d) → step 2, films
   as entries · step 3, the manga watch table. Batch 23 wave 1 stays parked.

## 6. THE RULE-LOGIC EVALUATION — DRAFT (Sean's ask 2026-09-05; delivered in chat as ONE table after wave 4 lands, before step 2's mint writer)

Sean: "once we have our waves done and rules in place especially with the seed, one quick evaluation on the
strategy of the rule logic to make sure we still like how it turned out and how its structured and will be the
best way for best practice moving forward". Two layers: the GENERATED inventory (`rule-inventory.ts --md`,
regenerate before use — P5) and the judgment findings below it (E1-E11, each with a proposed change and a
cost; Sean rules each line). Wave 4's witnesses (a six-OVA bundle, an unnumbered one-shot, two recap-boundary
specials) refine E2 / E3 / E8 before the table goes to chat.

### 6.1 The inventory (generated 2026-09-05 — regenerate)

| mechanism | home | used inside home | consumed by (gates) | in an edge bundle | ledger enforcement naming it | test lines |
|---|---|---|---|---|---|---|
| `ExtraBucket` | related-works.ts | 5 | audit-discovery.ts, lib/discovery.ts, sync-related-works.ts | yes (refresh-discovery) | — | 0 |
| `IN_RUN_RELATIONS` | related-works.ts | 0 | — UNUSED | no | — | 0 |
| `STRONG_IN_RUN_RELATIONS` | related-works.ts | 1 | — (internal helper) | no | — | 0 |
| `relatedWorkOwners` | related-works.ts | 0 | lib/discovery.ts | yes (refresh-discovery) | — | 7 |
| `Standing` | related-works.ts | 3 | lib/resolve.ts, lib/rulings/applied/batch-6.ts, lib/rulings/related-works.ts, lib/rulings/standing-annotations.ts | no | — | 0 |
| `ExtraMedia` | related-works.ts | 4 | — (internal helper) | no | — | 2 |
| `PROMO` | related-works.ts | 1 | lib/discovery.ts | yes (refresh-discovery) | I45 | 0 |
| `normTitle` | related-works.ts | 2 | — (internal helper) | no | — | 0 |
| `matchRelatedTitle` | related-works.ts | 0 | audit-discovery.ts | no | I46 | 7 |
| `titleMatch` | related-works.ts | 5 | — (internal helper) | no | — | 3 |
| `AdoptionPick` | related-works.ts | 1 | — (internal helper) | no | — | 0 |
| `pickAdoption` | related-works.ts | 0 | audit-discovery.ts, sync-related-works.ts | no | — | 10 |
| `SOURCE_FORMATS` | related-works.ts | 1 | — (internal helper) | no | — | 0 |
| `NOVEL_SOURCE_TYPES` | related-works.ts | 1 | — (internal helper) | no | — | 0 |
| `AdaptedNode` | related-works.ts | 1 | — (internal helper) | no | — | 0 |
| `adaptedNodes` | related-works.ts | 1 | lib/discovery.ts, sync-related-works.ts | yes (refresh-discovery) | I45 | 3 |
| `ownerInstrumentIds` | related-works.ts | 0 | lib/discovery.ts | yes (refresh-discovery) | I45 | 3 |
| `extraBucket` | related-works.ts | 0 | lib/discovery.ts | yes (refresh-discovery) | I13, I45 | 20 |
| `extraStanding` | related-works.ts | 1 | — (internal helper) | no | I45 | 7 |
| `extraKind` | related-works.ts | 0 | audit-discovery.ts, sync-related-works.ts | no | — | 7 |
| `isoDate` | related-works.ts | 0 | audit-discovery.ts, sync-related-works.ts | no | — | 0 |
| `deriveWatchPosition` | related-works.ts | 0 | audit-discovery.ts, sync-related-works.ts | no | I45 | 7 |
| `freePosition` | related-works.ts | 0 | sync-related-works.ts | no | — | 4 |
| `ledgerWorthy` | related-works.ts | 0 | — UNUSED | no | — | 2 |
| `relatedWorkStanding` | related-works.ts | 0 | audit-discovery.ts, lib/rulings/related-works.ts, sync-related-works.ts | no | I45 | 5 |
| `RelatedWorkIdentity` | related-work-ids.ts | 5 | — (internal helper) | no | — | 0 |
| `RegisteredBy` | related-work-ids.ts | 1 | — (internal helper) | no | — | 0 |
| `wikiKey` | related-work-ids.ts | 1 | sync-related-works.ts, sync-watch-order.ts | no | — | 3 |
| `lookupRelatedWork` | related-work-ids.ts | 1 | sync-related-works.ts, sync-watch-order.ts | no | — | 2 |
| `LedgerRowIdentity` | related-work-ids.ts | 1 | — (internal helper) | no | — | 0 |
| `identityProblems` | related-work-ids.ts | 0 | audit-discovery.ts | no | I46 | 4 |

Census classes emitted by audit-discovery.ts for related works (15): extra_same_instrument, extra_other_instrument, extra_recap, extra_original, extra_crossover, extra_unknown, extra_unstaged, extra_promo, extra_alternative, related_work_duplicate, related_work_identity_gap, related_work_identity_conflict, related_work_identity_orphan, related_work_stale, related_work_violation

### 6.2 Findings (judgment layer — DRAFT)

| # | finding | evidence | proposed change | cost / timing |
|---|---|---|---|---|
| E1 | **Identity vs primary key.** `watch_order_entries` is keyed (series, position) while the identity is (series, anilist_id); the wiki identity key is `series@position` — a POSITION, i.e. a mutable attribute | the writer needs a pre-pass to move a ruled row (AoT 25.51 → 3.5); a swap could overwrite an identity until the pre-pass existed; the registry carries the join | PK → (series, anilist_id) (or a surrogate id) with position a per-series unique column; the wiki key → a stable per-row key from the wiki list itself | one migration + writer simplification + types regen; BEFORE the UI pass (the UI keys on ids — Sean's identity concern); does not block step 2 |
| E2 | **Ruled positions are raw decimals with no base reference.** A renumber of the owner's grid (N11) would leave a ruled 3.5 / 24.05 / 20.52 / 13.5x pointing at a different episode and no class would fire | AoT 3.5, Slime 24.05, KonoSuba 20.52, Made in Abyss 13.5 / 13.51 / 13.52 | cheap: an audit class `related_work_base_missing` (a positioned row whose integer base has no episode row in the owner's grid — catches derived rows too); structural only if a renumber ever hits a series with ruled extras (position as {after, order}) | the class via `/add-rule` now (P5: checkable → must be checked); the structure never unless a witness appears |
| E3 | **Buckets are AniList's CLAIM; standings are the FACT** — and the design held: three of eight wave-3 premises were refuted by research and the ruling layer holds the fact while the bucket stays as staged | KonoSuba OVAs + Road to Hero (bucket same_instrument, standing filler); AoT's dates | keep; but `extra_same_instrument: 123` still counts RULED works — it is a bucket census, not a work-list (R27). Add `related_work_unruled` = ledger rows with standing null in same / other / unknown (today 378) as the research work-list class | small; the next `/add-rule` |
| E4 | **Mechanisms no ledger record's enforcement names**: `relatedWorkOwners` (owner precedence — strong > base-ALTERNATIVE > OTHER, PARENT never a claim), `pickAdoption` (I46's adoption), `wikiKey` / `lookupRelatedWork` (the registry), `freePosition` / `extraKind` / `isoDate`; and two DEAD exports: `IN_RUN_RELATIONS` (0 uses), `ledgerWorthy` (tests only) | the inventory | amend I45 / I46 `enforcement` to name them (ledger-check keeps them honest); delete the dead exports (P24) | zero risk; this pass |
| E5 | **The ledger writer and its audit are script-tier**: `refresh-discovery` (the cron) stages the halo but never writes ledger rows; `sync-related-works.ts` runs on the standard roster (`npm run heal`) — the queued weekly restage would stage new specials the ledger receives only at the next heal | rosters.ts:47; `_src/` never imports the writer | acceptable while surfacing is parked (N31); before the UI pass either the writer joins the refresh-discovery bundle (P3, same code) or a scheduled roster run exists | flag for the UI pass; not now |
| E6 | **The ruling layer** (hand-written `RelatedWorkRuling` from verdicts; `validate-extras.ts --entries` only proposes; the census lists stored ≠ ruled) is the right tier: Sean's ruling is the record (P10) | AoT `volume: 5` by hand where the proposer emits 4; Haikyu END 326 by the last-significant rule; `related_work_violation` 0 | no change; the END rule stays at the verifier + Sean tier (A47's normalizer needs a next anchored row — a related work never has one, N4 / N8) | — |
| E7 | **T26's credit clause** (a screen-only author credit is note text, never an adoption; adoption shows up as chapters) needs no `adopted` field on the ruling | Slam Dunk, Road to Hero, KonoSuba, Slime | keep; a note is free text — the T27-style retired-string sweep is its only check (the Coleus string is queued) | — |
| E8 | **The identity GRAIN is AniList's entry**: a bundle of N OVAs under one id gets ONE standing and ONE position, while the licensor numbers the parts separately (#3.25 / #3.5 / #3.75) | the AoT OADs (ruled 3.5); wave 4a's Ranma bundle (six OVAs, three adapting) is the second witness | keep the grain (stable ids; the registry works; the note carries the parts); a `parts` display field later if the UI needs it — the (series, anilist_id) identity must not fork | Sean rules the grain when the Ranma verdict lands |
| E9 | **A work can sit in two ruling maps**: attribution / (d) declarations in `rulings/discovery.ts` (owner + bucket) and standings in `rulings/related-works.ts`; GitS 1995 is an alternative ROW under the base AND a mint declaration. After step 2 mints a declared work as a SERIES, what does its ledger row become? | GitS 1995; the 27 declarations; No Regrets / Houkago / Twilight Axis on the (d) queue | an I-rule ruled BEFORE the mint writer is written: a minted related work's row becomes a link (kind `series` → the minted series id, standing n/a) or is removed by the mint writer — Sean's call; the strongest reason this evaluation sits before step 2 | the ruling is a sentence; the writer behaviour follows it |
| E10 | **Undated works are listed, unpositioned** (ruling f); a date arriving re-derives the position on the next run | 127 undated pairs; the restage queued | keep; the UI upcoming-schedule note stands | — |
| E11 | **Tests**: 35 cases over the three lib files; `PROMO` has no direct test (it is exercised through `extraBucket`); the writer's pre-pass / swap safety is exercised only by dry runs | the inventory's test-lines column | a PROMO table test; a pure `planMoves()` extracted from the writer with a unit test on the swap shape | small; with E4's pass |

## Appendix — the generated summary (2026-09-05; regenerate before use)

### Related-works sitting summary — 794 works (generated 2026-09-05)

| bucket | works | rule |
|---|---|---|
| same_instrument | 150 | adapts the series' own instrument — standing PENDING (research: standing + chapters) |
| other_instrument | 50 | adapts another work under its own source — a series candidate (a run; step 2, the film mint) or a one-shot tie-in |
| unknown | 291 | a source naming no instrument node (a franchise tag with no chapters behind it, a novel film without its edge, a VN / game source) — HELD |
| recap | 64 | filler by rule; kind recap; never a numbered row (N8) |
| original | 141 | filler by T25 (source ORIGINAL) |
| crossover | 90 | filler; listed, not fetched (CHARACTER-only) |
| unstaged | 8 | not fetched yet — the next discovery-stage run |

undated works (no derivable position — listed, never slotted): 102

**The load per owner** (top 30 by same + other + held; 180 owners)

| owner | total | same | other | held | recap | original | crossover | unstaged |
|---|---|---|---|---|---|---|---|---|
| franchise dragon-ball | 36 | 2 | 3 | 23 | 1 | 3 | 4 | 0 |
| detective-conan | 64 | 2 | 2 | 22 | 3 | 29 | 6 | 0 |
| franchise one-piece | 48 | 1 | 4 | 20 | 8 | 12 | 3 | 0 |
| franchise fate | 20 | 0 | 5 | 10 | 0 | 1 | 4 | 0 |
| franchise naruto | 23 | 0 | 2 | 11 | 1 | 9 | 0 | 0 |
| kurokos-basketball | 14 | 5 | 1 | 5 | 3 | 0 | 0 | 0 |
| mobile-suit-gundam | 34 | 0 | 3 | 8 | 6 | 14 | 2 | 1 |
| gintama | 17 | 7 | 0 | 3 | 3 | 1 | 3 | 0 |
| franchise attack-on-titan | 12 | 3 | 1 | 6 | 2 | 0 | 0 | 0 |
| the-prince-of-tennis | 14 | 2 | 0 | 8 | 1 | 1 | 0 | 2 |
| franchise a-certain-magical-index | 10 | 0 | 0 | 9 | 0 | 1 | 0 | 0 |
| saint-seiya-knights-of-the-zodiac | 10 | 4 | 1 | 4 | 0 | 0 | 0 | 1 |
| franchise sailor-moon | 9 | 4 | 2 | 3 | 0 | 0 | 0 | 0 |
| kinnikuman | 10 | 0 | 0 | 9 | 0 | 0 | 1 | 0 |
| franchise ranma-1-2 | 10 | 0 | 0 | 8 | 0 | 0 | 1 | 1 |
| franchise sword-art-online | 10 | 0 | 1 | 6 | 0 | 1 | 2 | 0 |
| franchise fist-of-the-north-star | 8 | 0 | 0 | 7 | 1 | 0 | 0 | 0 |
| ghost-in-the-shell-stand-alone-complex | 8 | 1 | 0 | 5 | 2 | 0 | 0 | 0 |
| urusei-yatsura | 10 | 2 | 0 | 4 | 0 | 2 | 2 | 0 |
| franchise rurouni-kenshin | 6 | 1 | 0 | 5 | 0 | 0 | 0 | 0 |
| sgt-frog | 8 | 0 | 0 | 6 | 0 | 0 | 2 | 0 |
| franchise my-hero-academia | 7 | 0 | 1 | 4 | 0 | 2 | 0 | 0 |
| high-school-dxd | 5 | 1 | 0 | 4 | 0 | 0 | 0 | 0 |
| franchise bleach | 9 | 3 | 1 | 1 | 0 | 4 | 0 | 0 |
| slam-dunk | 5 | 1 | 0 | 4 | 0 | 0 | 0 | 0 |
| franchise inuyasha | 5 | 1 | 0 | 4 | 0 | 0 | 0 | 0 |
| franchise yu-gi-oh | 7 | 1 | 0 | 4 | 0 | 2 | 0 | 0 |
| franchise initial-d | 9 | 3 | 0 | 2 | 4 | 0 | 0 | 0 |
| demon-slayer-kimetsu-no-yaiba | 7 | 4 | 0 | 0 | 0 | 0 | 3 | 0 |
| franchise fullmetal-alchemist | 7 | 0 | 1 | 3 | 1 | 1 | 1 | 0 |
| 150 more owners | 352 | 102 | 22 | 83 | 28 | 58 | 56 | 3 |

**Same-instrument works — the sitting's load** (150)

| owner | n | works (anilist id · format · year) |
|---|---|---|
| gintama | 7 | Gintama: THE VERY FINAL (114129 · MOVIE · 2021); Gintama - The Movie (7472 · MOVIE · 2010); Gintama: Love Incense Arc (21588 · OVA · 2016); Gintama: Jump Festa 2008 Special (6945 · SPECIAL · 2009); Gintama: Jump Festa 2005 Special (2951 · SPECIAL · 2005); Gintama: Yorinuki Gintama-san on Theater 2D (20760 · MOVIE · 2012); Gintama the Movie 2026: Yoshiwara in Flames (197474 · MOVIE · 2026) |
| kurokos-basketball | 5 | Kuroko's Basketball: Tip Off (16916 · SPECIAL · 2013); Kuroko's Basketball OVA (19669 · OVA · 2013); Kuroko’s Basketball 2: Would You Mind Doing That Once More (20603 · OVA · 2014); Kuroko no Basket 2 NG-shuu (98703 · SPECIAL · 2014); Kuroko no Basket 3 NG-shuu (98704 · SPECIAL · 2015) |
| demon-slayer-kimetsu-no-yaiba | 4 | Demon Slayer -Kimetsu no Yaiba- The Movie: Mugen Train (112151 · MOVIE · 2020); Demon Slayer: Kimetsu no Yaiba Infinity Castle (178788 · MOVIE · 2025); Demon Slayer: Kimetsu no Yaiba Infinity Castle Part 2 (195200 · MOVIE · ?); Kimetsu no Yaiba: Mugenjou-hen Movie 3 (195201 · MOVIE · ?) |
| saint-seiya-knights-of-the-zodiac | 4 | Saint Seiya: The Hades Chapter - Sanctuary (1257 · OVA · 2002); Saint Seiya: The Hades Chapter - Inferno (1253 · OVA · 2005); Saint Seiya: The Hades Chapter - Elysion (3515 · OVA · 2008); Saint Seiya: LEGEND of SANCTUARY (10687 · MOVIE · 2014) |
| franchise sailor-moon | 4 | Pretty Guardian Sailor Moon Eternal The Movie Part 1 (103713 · MOVIE · 2021); Pretty Guardian Sailor Moon Eternal The Movie Part 2 (103712 · MOVIE · 2021); Pretty Guardian Sailor Moon Cosmos The Movie: Part 1 (148149 · MOVIE · 2023); Pretty Guardian Sailor Moon Cosmos The Movie: Part 2 (160850 · MOVIE · 2023) |
| franchise konosuba | 3 | KONOSUBA -God's blessing on this wonderful world!- Legend of Crimson (102976 · MOVIE · 2019); KONOSUBA -God's blessing on this wonderful world!: God's Blessings On This Wonderful Choker! (21574 · OVA · 2016); KONOSUBA -God's blessing on this wonderful world! 2: God's Blessings on These Wonderful Works of Art! (97996 · OVA · 2017) |
| franchise attack-on-titan | 3 | Attack on Titan OVA (18397 · OVA · 2013); Attack on Titan Part II: Wings of Freedom (20692 · MOVIE · 2015); Attack on Titan Part I: Crimson Bow and Arrow (20691 · MOVIE · 2014) |
| one-punch-man | 3 | One-Punch Man: Road to Hero (21386 · OVA · 2015); One-Punch Man OVA (21416 · OVA · 2015); One-Punch Man Season 2 OVA (108945 · OVA · 2019) |
| franchise the-seven-deadly-sins | 3 | The Seven Deadly Sins the Movie: Prisoners of the Sky (99540 · MOVIE · 2018); The Seven Deadly Sins: Cursed by Light (128740 · MOVIE · 2021); Nanatsu no Taizai: Eiyuu-tachi wa Hashagu (104175 · OVA · 2018) |
| food-wars | 3 | Food Wars! The Second Plate OVA (98702 · OVA · 2017); Food Wars! Shokugeki no Soma OVA (21691 · OVA · 2016); Food Wars! The Third Plate: Erina at Polar Star Dormitory (101924 · OVA · 2018) |
| franchise berserk | 3 | Berserk: The Golden Age Arc I - The Egg of the King (10218 · MOVIE · 2012); Berserk: The Golden Age Arc III - The Advent (12115 · MOVIE · 2013); Berserk: The Golden Age Arc II - The Battle for Doldrey (12113 · MOVIE · 2012) |
| miss-kobayashis-dragon-maid | 3 | Miss Kobayashi’s Dragon Maid S: Japanese Hospitality (The Attendant Is a Dragon) (136436 · OVA · 2022); Miss Kobayashi's Dragon Something (98502 · SPECIAL · 2017); Miss Kobayashi's Dragon Maid: A lonely dragon wants to be loved (181839 · MOVIE · 2025) |
| franchise cardcaptor-sakura | 3 | Cardcaptor Sakura the Movie 2: The Sealed Card (372 · MOVIE · 2000); Cardcaptor Sakura: The Movie (371 · MOVIE · 1999); Cardcaptor Sakura: Suteki Desu wa, Sakura-chan! Tomoyo no Cardcaptor Sakura Katsuyaku Video Nikki! (2424 · OVA · 1998) |
| franchise bleach | 3 | BURN THE WITCH #0.8 (169362 · SPECIAL · 2023); BLEACH: memories in the rain (154037 · SPECIAL · 2004); BLEACH 20th Anime Anniversary Official Trailer (182561 · SPECIAL · 2024) |
| franchise initial-d | 3 | Initial D Legend 1: Awakening (20842 · MOVIE · 2014); Initial D Legend 2: Racer (20990 · MOVIE · 2015); Initial D Legend 3: Dream (21289 · MOVIE · 2016) |
| made-in-abyss | 2 | Made in Abyss: Dawn of the Deep Soul (100643 · MOVIE · 2020); Made in Abyss: Mezameru Shinpi (160275 · MOVIE · 2026) |
| haikyu | 2 | HAIKYU!! The Dumpster Battle (153658 · MOVIE · 2024); Haikyuu!!: VS Chiisana Kyojin (174871 · MOVIE · 2027) |
| kaguya-sama-love-is-war | 2 | Kaguya-sama wa Kokurasetai: Tensaitachi no Renai Zunousen OVA (125368 · OVA · 2021); Kaguya-sama: Love Is War -Stairway to Adulthood- (194884 · SPECIAL · 2025) |
| noragami | 2 | Noragami OVA (20494 · OVA · 2014); Noragami ARAGOTO OVA (119941 · OVA · 2015) |
| franchise dragon-ball | 2 | Dragon Ball Z: Battle of Gods (14837 · MOVIE · 2013); Dragon Ball Z: The History of Trunks (985 · SPECIAL · 1993) |
| franchise danmachi | 2 | Is It Wrong to Try to Pick Up Girls in a Dungeon?: Arrow of the Orion (101166 · MOVIE · 2019); Is It Wrong to Try to Pick Up Girls in a Dungeon?: Is It Wrong to Expect a Hot Spring in a Dungeon? (21660 · OVA · 2016) |
| overlord | 2 | OVERLORD: The Sacred Kingdom (133845 · MOVIE · 2024); Overlord: Ple Ple Pleiades - Nazarick Saidai no Kiki (87489 · OVA · 2016) |
| seraph-of-the-end-vampire-reign | 2 | Seraph of the End: Vampire Reign - Owaranai Seraph (21483 · SPECIAL · 2015); Seraph of the End: Kyuuketsuki Shahal (21586 · OVA · 2016) |
| nisekoi | 2 | Nisekoi OVA (20728 · OVA · 2014); Nisekoi: OVA (119947 · OVA · 2016) |
| fairy-tail | 2 | FAIRY TAIL OVA (9982 · OVA · 2011); FAIRY TAIL (2014) OVA (150078 · OVA · 2016) |
| franchise to-love-ru | 2 | To LOVE-Ru Darkness OVA (13851 · OVA · 2012); To LOVE-Ru Darkness 2nd OVA (21853 · OVA · 2016) |
| my-next-life-as-a-villainess-all-routes-lead-to-doom | 2 | My Next Life as a Villainess: All Routes Lead to Doom! Movie (139359 · MOVIE · 2023); My Next Life as a Villainess: All Routes Lead to Doom! X - I Met My Destined One... (136829 · OVA · 2021) |
| assassination-classroom | 2 | Ansatsu Kyoushitsu: Jump Festa 2013 Special (19759 · SPECIAL · 2013); Assassination Classroom the Movie: Our Time (198373 · MOVIE · 2026) |
| franchise cells-at-work | 2 | Cells at Work!: The Common Cold (105662 · SPECIAL · 2018); Cells at Work! Specials (109085 · SPECIAL · 2018) |
| x | 2 | X (155 · MOVIE · 1996); X OVA (595 · OVA · 2001) |
| ajin-demi-human | 2 | AJIN: Demi-Human -Compel- (21212 · MOVIE · 2015); Ajin OVA (21487 · OVA · 2016) |
| detective-conan | 2 | Detective Conan: Episode "ONE" (98604 · SPECIAL · 2016); The Disappearance of Conan Edogawa: The Worst Two Days in History (20878 · SPECIAL · 2014) |
| the-prince-of-tennis | 2 | Tennis no Ouji-sama: Zenkoku Taikai-hen Semifinal (2752 · OVA · 2007); Tennis no Ouji-sama: Zenkoku Taikai-hen Final (4053 · OVA · 2008) |
| franchise ace-of-the-diamond | 2 | Ace of Diamond OVA (20861 · OVA · 2014); Ace of Diamond: Second Season OVA (98582 · OVA · 2016) |
| yowamushi-pedal | 2 | Yowamushi Pedal: SPECIAL RIDE (18177 · OVA · 2013); Yowamushi Pedal Re:RIDE (20808 · MOVIE · 2014) |
| hikaru-no-go | 2 | Hikaru no Go: Hokuto Hai e no Michi (645 · SPECIAL · 2004); Hikaru no Go Special (10765 · OVA · 2001) |
| space-adventure-cobra | 2 | Space Adventure Cobra: The Movie (2452 · MOVIE · 1982); COBRA THE ANIMATION: The Psycho-Gun (4646 · OVA · 2008) |
| urusei-yatsura | 2 | Urusei Yatsura Movie 5: The Final Chapter (1924 · MOVIE · 1988); Urusei Yatsura - OVA Series (1919 · OVA · 1985) |
| chainsaw-man | 1 | Chainsaw Man – The Movie: Reze Arc (171627 · MOVIE · 2025) |
| hellsing | 1 | Hellsing Ultimate (777 · OVA · 2006) |
| ghost-in-the-shell-stand-alone-complex | 1 | Ghost in the Shell (43 · MOVIE · 1995) |
| saga-of-tanya-the-evil | 1 | Saga of Tanya the Evil - the Movie - (100878 · MOVIE · 2019) |
| goblin-slayer | 1 | GOBLIN SLAYER -GOBLIN’S CROWN- (108623 · MOVIE · 2020) |
| that-time-i-got-reincarnated-as-a-slime | 1 | That Time I Got Reincarnated as a Slime OAD (106509 · OVA · 2019) |
| the-ancient-magus-bride | 1 | The Ancient Magus' Bride: Those Awaiting a Star (21688 · OVA · 2016) |
| blue-exorcist | 1 | Blue Exorcist: The Movie (11737 · MOVIE · 2012) |
| bungo-stray-dogs | 1 | Bungo Stray Dogs 2: Walking Alone (21791 · OVA · 2017) |
| the-future-diary | 1 | Mirai Nikki OVA (8460 · OVA · 2010) |
| franchise fruits-basket | 1 | Fruits Basket -prelude- (136192 · MOVIE · 2022) |
| high-school-dxd | 1 | High School DxD NEW OVA Oppai, Tsutsumimasu! (21103 · OVA · 2015) |
| yona-of-the-dawn | 1 | Yona of the Dawn OVA (21138 · OVA · 2015) |
| orange | 1 | Orange: Future (97669 · MOVIE · 2016) |
| masamune-kun-s-revenge | 1 | Masamune-kun's Revenge OAD (101213 · OVA · 2018) |
| slam-dunk | 1 | THE FIRST SLAM DUNK (128207 · MOVIE · 2022) |
| franchise magi | 1 | Magi: Adventure of Sinbad (OVA) (20609 · OVA · 2014) |
| jujutsu-kaisen | 1 | JUJUTSU KAISEN: Hidden Inventory / Premature Death – The Movie (192809 · MOVIE · 2025) |
| kamisama-kiss | 1 | Kamisama Hajimemashita OVA (18661 · OVA · 2013) |
| jojos-bizarre-adventure | 1 | JoJo no Kimyou na Bouken: Phantom Blood (3603 · MOVIE · 2007) |
| dorohedoro | 1 | Dorohedoro: Ma no Omake (114622 · OVA · 2020) |
| we-never-learn-bokuben | 1 | We Never Learn OVAs (109492 · OVA · 2019) |
| gantz | 1 | GANTZ:O (21496 · MOVIE · 2016) |
| kaiju-no-8 | 1 | Kaiju No.8: Hoshina's Day Off (179999 · SPECIAL · 2025) |
| solo-leveling | 1 | Solo Leveling: Beyond the System (213846 · MOVIE · ?) |
| kakegurui | 1 | Kakegurui Picture Drama (107622 · SPECIAL · 2017) |
| drifters | 1 | DRIFTERS OVA (97988 · OVA · 2017) |
| undead-unluck | 1 | Undead Unluck: Winter Arc (179930 · SPECIAL · 2025) |
| d-frag | 1 | D-Frag! OVA (20856 · OVA · 2014) |
| black-lagoon | 1 | Black Lagoon Omake (8440 · SPECIAL · 2009) |
| blood-blockade-battlefront | 1 | Blood Blockade Battlefront: King of Kings Restaurant Fit for a King (21640 · OVA · 2016) |
| franchise one-piece | 1 | One Piece: Defeat the Pirate Ganzack! (466 · OVA · 1998) |
| devilman-crybaby | 1 | Devilman: The Birth (2354 · OVA · 1987) |
| franchise yu-gi-oh | 1 | Yu☆Gi☆Oh! (Movie) (2006 · MOVIE · 1999) |
| black-clover | 1 | Black Clover: Jump Festa 2016 Special (87528 · SPECIAL · 2016) |
| franchise negima | 1 | UQ Holder! OVA (98999 · OVA · 2017) |
| franchise hunter-x-hunter | 1 | HUNTER×HUNTER Pilot-ban (10189 · OVA · 1998) |
| yu-yu-hakusho-ghostfiles | 1 | Yu Yu Hakusho OVA: "Two Shots" and "All or Nothing" (102631 · SPECIAL · 2018) |
| tsugumomo | 1 | Tsugumomo2 OVA (108267 · OVA · 2020) |
| beelzebub | 1 | Beelzebub: Hirotta Akachan wa Daimaou!? (9120 · SPECIAL · 2010) |
| franchise rurouni-kenshin | 1 | Rurouni Kenshin: New Kyoto Arc (11441 · OVA · 2011) |
| franchise inuyasha | 1 | Inuyasha: Kuroi Tessaiga (4886 · SPECIAL · 2008) |
| sket-dance | 1 | SKET DANCE: Imouto no Nayami ni Nayamu Ani ni Nayamu Imouto to Sono Nakama-tachi (16395 · OVA · 2013) |
| hayate-the-combat-butler | 1 | Hayate no Gotoku! OVA (20651 · OVA · 2014) |
| kenichi-the-mightiest-disciple | 1 | Kenichi: The Mightiest Disciple OVA Specials (101928 · SPECIAL · 2013) |
| golden-kamuy | 1 | Golden Kamuy: Sapporo Beer Koujou-hen (196115 · MOVIE · 2025) |
| city-hunter | 1 | City Hunter The Movie: Angel Dust (147189 · MOVIE · 2023) |
| toriko | 1 | Toriko: Jump Super Anime Tour 2009 Special (6941 · SPECIAL · 2009) |
| cobra-the-animation + space-adventure-cobra | 1 | Cobra Time Drive (5031 · OVA · 2009) |
| magic-knight-rayearth | 1 | Magic Knight Rayearth Pilot (155739 · SPECIAL · 1996) |

**Other-instrument works** (50) — a run is a series candidate (step 2, the film mint); a one-shot is a tie-in

| owner | work | adapts | shape |
|---|---|---|---|
| jujutsu-kaisen | JUJUTSU KAISEN 0 (131573 · MOVIE · 2021) | Jujutsu Kaisen 0: Tokyo Toritsu Jujutsu Koutou Senmon Gakkou (MANGA) | a run — series candidate |
| franchise my-hero-academia | My Hero Academia: Heroes Rising (108553 · MOVIE · 2019) | Deku & Bakugo: Rising (MANGA) | a run — series candidate |
| the-melancholy-of-haruhi-suzumiya | The Disappearance of Haruhi Suzumiya (7311 · MOVIE · 2010) | Suzumiya Haruhi no Shoushitsu (NOVEL) | a run — series candidate |
| franchise dragon-ball | Dragon Ball Super: Broly (101302 · MOVIE · 2018) | Dragon Ball Minus: Hanatareta Unmei no Kodomo (ONE_SHOT) | one-shot tie-in |
| franchise sword-art-online | Sword Art Online the Movie -Progressive- Aria of a Starless Night (124140 · MOVIE · 2021) | Sword Art Online: Progressive (NOVEL) | a run — series candidate |
| franchise attack-on-titan | Attack on Titan: Lost Girls (99634 · OVA · 2017) | Shingeki no Kyojin: LOST GIRLS (NOVEL) | a run — series candidate |
| bungo-stray-dogs | Bungo Stray Dogs: DEAD APPLE (98384 · MOVIE · 2018) | Bungou Stray Dogs: Dead Apple (MANGA) | a run — series candidate |
| kurokos-basketball | Kuroko's Basketball: Last Game (21377 · MOVIE · 2017) | Kuroko no Basket: Extra Game (MANGA) | a run — series candidate |
| franchise naruto | Road to Ninja: Naruto the Movie (13667 · MOVIE · 2012) | NARUTO: Road to Ninja (ONE_SHOT) | one-shot tie-in |
| franchise hunter-x-hunter | Hunter x Hunter: Phantom Rouge (13271 · MOVIE · 2013) | HUNTER×HUNTER: Kurapika Tsuioku-hen (MANGA) | a run — series candidate |
| franchise tokyo-ghoul | Tokyo Ghoul: [JACK] (21132 · OVA · 2015) | Tokyo Ghoul: Jack (MANGA) | a run — series candidate |
| franchise one-piece | ONE PIECE FAN LETTER (182469 · SPECIAL · 2024) | ONE PIECE novel Mugiwara Stories (NOVEL) | a run — series candidate |
| jojos-bizarre-adventure | Thus Spoke Rohan Kishibe (21778 · OVA · 2017) | Kishibe Rohan wa Ugokanai (MANGA), Kishibe Rohan wa Ugokanai Episode 2: Mutsukabezaka (ONE_SHOT), Kishibe Rohan wa Ugokanai Episode 16: Zangeshitsu (ONE_SHOT), Kishibe Rohan wa Ugokanai Episode 9: The Run (ONE_SHOT), Kishibe Rohan wa Ugokanai Episode 5: Fugou Mura (ONE_SHOT) | a run — series candidate |
| franchise tokyo-ghoul | Tokyo Ghoul: [PINTO] (21326 · OVA · 2015) | Tokyo Ghoul: Hibi (NOVEL) | a run — series candidate |
| franchise fate | Fate/strange Fake -Whispers of Dawn- (154966 · SPECIAL · 2023) | Fate/strange Fake (NOVEL) | a run — series candidate |
| blue-lock | BLUE LOCK THE MOVIE -EPISODE NAGI- (163147 · MOVIE · 2024) | Blue Lock: EPISODE Nagi (MANGA) | a run — series candidate |
| jojos-bizarre-adventure | JoJo's Bizarre Adventure (666 · OVA · 1993) | JoJo no Kimyou na Bouken: Stardust Crusaders (MANGA) | a run — series candidate |
| franchise dragon-ball | Dragon Ball: Episode of Bardock (12231 · SPECIAL · 2011) | Dragon Ball: Episode of Bardock (MANGA) | a run — series candidate |
| franchise fate | Fate/kaleid liner Prisma☆Illya: Vow in the Snow (97757 · MOVIE · 2017) | Fate/kaleid liner Prisma☆Illya 3rei!! (MANGA) | a run — series candidate |
| franchise naruto | Boruto: Naruto the Movie - The Day Naruto Became Hokage (21579 · SPECIAL · 2016) | BORUTO: NARUTO THE MOVIE Tokubetsu Bangai-hen - Naruto ga Hokage ni Natta Hi (ONE_SHOT) | one-shot tie-in |
| franchise fullmetal-alchemist | Fullmetal Alchemist: Brotherhood OVA Collection (6421 · OVA · 2009) | Hagane no Renkinjutsushi: 20th ANNIVERSARY BOOK (MANGA) | a run — series candidate |
| jojos-bizarre-adventure | JoJo's Bizarre Adventure (2000) (665 · OVA · 2000) | JoJo no Kimyou na Bouken: Stardust Crusaders (MANGA) | a run — series candidate |
| mobile-suit-gundam | Mobile Suit Gundam UC (6336 · OVA · 2010) | Kidou Senshi Gundam Unicorn (NOVEL) | a run — series candidate |
| mobile-suit-gundam | Mobile Suit Gundam: The Origin (10937 · OVA · 2015) | Kidou Senshi Gundam: The Origin (MANGA) | a run — series candidate |
| blue-exorcist | Ao no Exorcist: Kyoto Fujouou-hen OVA (97891 · OVA · 2017) | Ao no Exorcist: Weekend Hero (NOVEL) | a run — series candidate |
| saint-seiya-knights-of-the-zodiac | Saint Seiya: The Lost Canvas (6171 · OVA · 2009) | Saint Seiya: THE LOST CANVAS - Meiou Shinwa (MANGA) | a run — series candidate |
| franchise one-piece | ONE PIECE FILM: STRONG WORLD - EPISODE:0 (8740 · OVA · 2010) | ONE PIECE: STRONG WORLD (ONE_SHOT) | one-shot tie-in |
| durarara | Durarara!! X2: My Heart is in the Pattern of a Hot Pot (21068 · SPECIAL · 2015) | Durarara!! Gaiden!? (NOVEL) | a run — series candidate |
| ghost-in-the-shell-arise-alternative-architecture + ghost-in-the-shell-stand-alone-complex | Ghost in the Shell: Arise - Border:1 Ghost Pain (17187 · MOVIE · 2013) | Koukaku Kidoutai: Arise - Nemuranai Me no Otoko Sleepless Eye (MANGA) | a run — series candidate |
| franchise one-piece | ONE PIECE HEROINES (197178 · SPECIAL · 2026) | ONE PIECE novel HEROINES (NOVEL) | a run — series candidate |
| franchise fate | Fate/kaleid liner Prisma☆Illya: Licht Nameless Girl (118743 · MOVIE · 2021) | Fate/kaleid liner Prisma☆Illya 3rei!! (MANGA) | a run — series candidate |
| franchise to-love-ru | To LOVE-Ru: Multiplication - Mae kara Ushiro kara (100659 · OVA · 2017) | To LOVE-Ru Bangai-hen: Multiplication - Mae kara Ushiro kara (MANGA) | a run — series candidate |
| franchise one-piece | One Piece: Romance Dawn Story (5252 · OVA · 2008) | Romance Dawn (ONE_SHOT) | one-shot tie-in |
| durarara | Durarara!! X2 The Second Arc: Onoroke Chakapoko (21331 · SPECIAL · 2015) | Durarara!! Gaiden!? (NOVEL) | a run — series candidate |
| franchise fate | Fate/kaleid liner Prisma☆Illya 2wei! OVA (20862 · OVA · 2015) | Fate/kaleid liner Prisma☆Illya 2wei! (MANGA) | a run — series candidate |
| franchise dragon-ball | Dragon Ball: Yo! Son Goku and His Friends Return!! (5152 · SPECIAL · 2008) | Dragon Ball: Heya! Son Goku and His Friends Return!! (MANGA) | a run — series candidate |
| full-metal-panic | Full Metal Panic! The Second Raid: A Relatively Leisurely Day in the Life of a Fleet Captain (1015 · OVA · 2006) | Full Metal Panic! Sigma (MANGA) | a run — series candidate |
| blood-blockade-battlefront | Blood Blockade Battlefront & Beyond OVA (101695 · OVA · 2018) | Kekkai Sensen: Back 2 Back (MANGA) | a run — series candidate |
| franchise sailor-moon | Sailor Moon S Movie: Hearts in Ice (997 · MOVIE · 1994) | Bishoujo Senshi Sailor Moon: Short Stories (MANGA) | a run — series candidate |
| mobile-suit-gundam | Mobile Suit Gundam Thunderbolt: December Sky (21893 · MOVIE · 2016) | Kidou Senshi Gundam Thunderbolt (MANGA) | a run — series candidate |
| franchise fate | Fate/kaleid liner Prisma☆Illya 3rei!! Short Anime (87488 · SPECIAL · 2016) | Fate/kaleid liner Prisma☆Illya 3rei!! (MANGA) | a run — series candidate |
| x | Tokyo BABYLON (1043 · OVA · 1992) | Tokyo BABYLON (MANGA) | a run — series candidate |
| assassination-classroom | Koro-sensei Q! (21864 · MOVIE · 2016) | Koro-sensei Q! (MANGA) | a run — series candidate |
| franchise bleach | BLEACH Colorful!: Gotei Juusan Yatai Daisakusen! (100719 · OVA · 2008) | Tsurezure Nichijou Ekotoba Colourful Bleach (MANGA) | a run — series candidate |
| franchise sailor-moon | Sailor Moon SuperS Plus: Ami's First Love (1278 · SPECIAL · 1995) | Bishoujo Senshi Sailor Moon: Short Stories (MANGA) | a run — series candidate |
| monogatari-series | Bakemonogatari PV (143663 · SPECIAL · 2022) | Bakemonogatari (MANGA) | a run — series candidate |
| detective-conan | Case Closed: Conan and Kid and Crystal Mother (2514 · OVA · 2004) | Magic Kaito (MANGA) | a run — series candidate |
| code-geass-lelouch-of-the-rebellion | Code Geass: Oz the Reflection Picture Drama (17277 · OVA · 2013) | Code Geass: Soubou no Oz (MANGA) | a run — series candidate |
| yowamushi-pedal | Yowamushi Pedal: SPARE BIKE (21806 · MOVIE · 2016) | Yowamushi Pedal: Spare Bike (MANGA) | a run — series candidate |
| detective-conan | Meitantei Conan: Keisatsu Gakkou-hen - Wild Police Story CASE. Furuya Rei (166060 · SPECIAL · 2023) | Meitantei Conan: Keisatsu Gakkou-hen - Wild Police Story (MANGA) | a run — series candidate |

**PV / trailer suspects** (5) — I45 lists everything but music videos today; ignoring these is Sean's call

- franchise bleach: BLEACH 20th Anime Anniversary Official Trailer (182561 · SPECIAL · 2024) — bucket same_instrument
- monogatari-series: Bakemonogatari PV (143663 · SPECIAL · 2022) — bucket other_instrument
- neon-genesis-evangelion: Evangelion x KATE CM (125785 · SPECIAL · ?) — bucket crossover
- code-geass-lelouch-of-the-rebellion: Jongtama PV (139044 · SPECIAL · ?) — bucket crossover
- gintama: Jongtama x Gintama Collab Kettei Promotion Anime (207475 · ONA · ?) — bucket crossover

## Appendix B — the (d) picks (generated; regenerate with other-instrument-picks.ts when AniList is back for start dates)

### Other-instrument picks — 49 works adapting 48 runs (AniList UNAVAILABLE (Error: AniList 403: {) — staged edge facts only (format / status / chapters / volumes / popularity as staged; no start dates, so a run that began AFTER the work — a comicalization — cannot be flagged yet); re-run when the API is back)

| owner | work (anilist · format · year) | adapts (anilist) | run: format · status · ch/vol · pop | ours? | proposed | slug · franchise (if minted) | decision |
|---|---|---|---|---|---|---|---|
| jujutsu-kaisen | JUJUTSU KAISEN 0 (131573 · MOVIE · 2021) | Jujutsu Kaisen 0: Tokyo Toritsu Jujutsu Koutou Senmon Gakkou (105469) | MANGA · FINISHED · 4/1 · 71509 | — | MINT (step 2): a one-row staged series, this work as its anime | jujutsu-kaisen-0-tokyo-toritsu-jujutsu-koutou-senmon-gakkou · jujutsu-kaisen | |
| my-hero-academia | My Hero Academia: Heroes Rising (108553 · MOVIE · 2019) | Deku & Bakugo: Rising (114207) | MANGA · FINISHED · 2/? · 1847 | — | hold — below the threshold (no volume, < 8 chapters, finished) |  | |
| the-melancholy-of-haruhi-suzumiya | The Disappearance of Haruhi Suzumiya (7311 · MOVIE · 2010) | Suzumiya Haruhi no Shoushitsu (145592) | NOVEL · FINISHED · 8/1 · 1133 | — | MINT (step 2): a one-row staged series, this work as its anime | suzumiya-haruhi-no-shoushitsu · the-melancholy-of-haruhi-suzumiya | |
| dragon-ball | Dragon Ball Super: Broly (101302 · MOVIE · 2018) | Dragon Ball Minus: Hanatareta Unmei no Kodomo (97900) | ONE_SHOT · FINISHED · 1/? · 918 | — | tie-in — never a series; research with (b) |  | |
| sword-art-online | Sword Art Online the Movie -Progressive- Aria of a Starless Night (124140 · MOVIE · 2021) | Sword Art Online: Progressive (73921) | NOVEL · RELEASING · ?/? · 6430 | — | MINT (step 2): a one-row staged series, this work as its anime (size unverified — AniList down) | sword-art-online-progressive · sword-art-online | |
| attack-on-titan | Attack on Titan: Lost Girls (99634 · OVA · 2017) | Shingeki no Kyojin: LOST GIRLS (93313) | NOVEL · FINISHED · 3/1 · 2871 | — | MINT (step 2): a one-row staged series, this work as its anime | shingeki-no-kyojin-lost-girls · attack-on-titan | |
| bungo-stray-dogs | Bungo Stray Dogs: DEAD APPLE (98384 · MOVIE · 2018) | Bungou Stray Dogs: Dead Apple (104030) | MANGA · FINISHED · 15/4 · 3469 | — | MINT (step 2): a one-row staged series, this work as its anime | bungou-stray-dogs-dead-apple · bungo-stray-dogs | |
| kurokos-basketball | Kuroko's Basketball: Last Game (21377 · MOVIE · 2017) | Kuroko no Basket: Extra Game (85604) | MANGA · FINISHED · 9/2 · 4449 | — | MINT (step 2): a one-row staged series, this work as its anime | kuroko-no-basket-extra-game · kurokos-basketball | |
| naruto | Road to Ninja: Naruto the Movie (13667 · MOVIE · 2012) | NARUTO: Road to Ninja (70549) | ONE_SHOT · FINISHED · 1/? · 2933 | — | tie-in — never a series; research with (b) |  | |
| hunter-x-hunter | Hunter x Hunter: Phantom Rouge (13271 · MOVIE · 2013) | HUNTER×HUNTER: Kurapika Tsuioku-hen (75996) | MANGA · FINISHED · 2/? · 7958 | — | hold — below the threshold (no volume, < 8 chapters, finished) |  | |
| tokyo-ghoul | Tokyo Ghoul: [JACK] (21132 · OVA · 2015) | Tokyo Ghoul: Jack (85522) | MANGA · FINISHED · 7/1 · 10119 | — | MINT (step 2): a one-row staged series, this work as its anime | tokyo-ghoul-jack · tokyo-ghoul | |
| one-piece | ONE PIECE FAN LETTER (182469 · SPECIAL · 2024) | ONE PIECE novel Mugiwara Stories (128291) | NOVEL · FINISHED · 9/1 · 629 | — | MINT (step 2): a one-row staged series, this work as its anime | one-piece-novel-mugiwara-stories · one-piece | |
| jojos-bizarre-adventure | Thus Spoke Rohan Kishibe (21778 · OVA · 2017) | Kishibe Rohan wa Ugokanai (103029) | MANGA · RELEASING · ?/? · 6967 | — | MINT (step 2): a one-row staged series, this work as its anime (size unverified — AniList down) | kishibe-rohan-wa-ugokanai · jojos-bizarre-adventure | |
| jojos-bizarre-adventure | Thus Spoke Rohan Kishibe (21778 · OVA · 2017) | Kishibe Rohan wa Ugokanai Episode 2: Mutsukabezaka (33920) | ONE_SHOT · FINISHED · 1/? · 1200 | — | tie-in — never a series; research with (b) |  | |
| jojos-bizarre-adventure | Thus Spoke Rohan Kishibe (21778 · OVA · 2017) | Kishibe Rohan wa Ugokanai Episode 16: Zangeshitsu (105925) | ONE_SHOT · FINISHED · 1/? · 1092 | — | tie-in — never a series; research with (b) |  | |
| jojos-bizarre-adventure | Thus Spoke Rohan Kishibe (21778 · OVA · 2017) | Kishibe Rohan wa Ugokanai Episode 9: The Run (101237) | ONE_SHOT · FINISHED · 1/? · 1062 | — | tie-in — never a series; research with (b) |  | |
| jojos-bizarre-adventure | Thus Spoke Rohan Kishibe (21778 · OVA · 2017) | Kishibe Rohan wa Ugokanai Episode 5: Fugou Mura (73903) | ONE_SHOT · FINISHED · 1/? · 1027 | — | tie-in — never a series; research with (b) |  | |
| tokyo-ghoul | Tokyo Ghoul: [PINTO] (21326 · OVA · 2015) | Tokyo Ghoul: Hibi (87233) | NOVEL · FINISHED · 6/1 · 3310 | — | MINT (step 2): a one-row staged series, this work as its anime | tokyo-ghoul-hibi · tokyo-ghoul | |
| fate | Fate/strange Fake -Whispers of Dawn- (154966 · SPECIAL · 2023) | Fate/strange Fake (50006) | NOVEL · RELEASING · ?/10 · 4575 | — | MINT (step 2): a one-row staged series, this work as its anime | fate-strange-fake · fate | |
| blue-lock | BLUE LOCK THE MOVIE -EPISODE NAGI- (163147 · MOVIE · 2024) | Blue Lock: EPISODE Nagi (146203) | MANGA · FINISHED · 36/8 · 9563 | — | MINT (step 2): a one-row staged series, this work as its anime | blue-lock-episode-nagi · blue-lock | |
| jojos-bizarre-adventure | JoJo's Bizarre Adventure (666 · OVA · 1993) | JoJo no Kimyou na Bouken: Stardust Crusaders (30872) | MANGA · FINISHED · 152/16 · 35523 | — | MINT (step 2): a one-row staged series, this work as its anime | jojo-no-kimyou-na-bouken-stardust-crusaders · jojos-bizarre-adventure | |
| dragon-ball | Dragon Ball: Episode of Bardock (12231 · SPECIAL · 2011) | Dragon Ball: Episode of Bardock (56373) | MANGA · FINISHED · 3/1 · 2017 | — | MINT (step 2): a one-row staged series, this work as its anime | dragon-ball-episode-of-bardock · dragon-ball | |
| fate | Fate/kaleid liner Prisma☆Illya: Vow in the Snow (97757 · MOVIE · 2017) | Fate/kaleid liner Prisma☆Illya 3rei!! (66131) | MANGA · RELEASING · ?/? · 4416 | — | MINT (step 2): a one-row staged series, this work as its anime (size unverified — AniList down) | fate-kaleid-liner-prisma-illya-3rei · fate | |
| naruto | Boruto: Naruto the Movie - The Day Naruto Became Hokage (21579 · SPECIAL · 2016) | BORUTO: NARUTO THE MOVIE Tokubetsu Bangai-hen - Naruto ga Hokage ni Natta Hi (87402) | ONE_SHOT · FINISHED · 1/? · 1910 | — | tie-in — never a series; research with (b) |  | |
| fullmetal-alchemist | Fullmetal Alchemist: Brotherhood OVA Collection (6421 · OVA · 2009) | Hagane no Renkinjutsushi: 20th ANNIVERSARY BOOK (188032) | MANGA · FINISHED · 10/1 · 306 | — | MINT (step 2): a one-row staged series, this work as its anime | hagane-no-renkinjutsushi-20th-anniversary-book · fullmetal-alchemist | |
| jojos-bizarre-adventure | JoJo's Bizarre Adventure (2000) (665 · OVA · 2000) | JoJo no Kimyou na Bouken: Stardust Crusaders (30872) | MANGA · FINISHED · 152/16 · 35523 | — | MINT (step 2): a one-row staged series, this work as its anime | jojo-no-kimyou-na-bouken-stardust-crusaders · jojos-bizarre-adventure | |
| mobile-suit-gundam | Mobile Suit Gundam UC (6336 · OVA · 2010) | Kidou Senshi Gundam Unicorn (35177) | NOVEL · FINISHED · 31/11 · 353 | — | MINT (step 2): a one-row staged series, this work as its anime | kidou-senshi-gundam-unicorn · mobile-suit-gundam | |
| mobile-suit-gundam | Mobile Suit Gundam: The Origin (10937 · OVA · 2015) | Kidou Senshi Gundam: The Origin (30214) | MANGA · FINISHED · 112/24 · 7722 | — | MINT (step 2): a one-row staged series, this work as its anime | kidou-senshi-gundam-the-origin · mobile-suit-gundam | |
| blue-exorcist | Ao no Exorcist: Kyoto Fujouou-hen OVA (97891 · OVA · 2017) | Ao no Exorcist: Weekend Hero (58103) | NOVEL · FINISHED · 5/1 · 428 | — | MINT (step 2): a one-row staged series, this work as its anime | ao-no-exorcist-weekend-hero · blue-exorcist | |
| saint-seiya-knights-of-the-zodiac | Saint Seiya: The Lost Canvas (6171 · OVA · 2009) | Saint Seiya: THE LOST CANVAS - Meiou Shinwa (31047) | MANGA · FINISHED · 224/25 · 4231 | — | MINT (step 2): a one-row staged series, this work as its anime | saint-seiya-the-lost-canvas-meiou-shinwa · saint-seiya-knights-of-the-zodiac | |
| one-piece | ONE PIECE FILM: STRONG WORLD - EPISODE:0 (8740 · OVA · 2010) | ONE PIECE: STRONG WORLD (47152) | ONE_SHOT · FINISHED · 1/? · 3848 | — | tie-in — never a series; research with (b) |  | |
| durarara | Durarara!! X2: My Heart is in the Pattern of a Hot Pot (21068 · SPECIAL · 2015) | Durarara!! Gaiden!? (85836) | NOVEL · FINISHED · 10/1 · 333 | — | MINT (step 2): a one-row staged series, this work as its anime | durarara-gaiden · durarara | |
| ghost-in-the-shell-stand-alone-complex + ghost-in-the-shell-arise-alternative-architecture | Ghost in the Shell: Arise - Border:1 Ghost Pain (17187 · MOVIE · 2013) | Koukaku Kidoutai: Arise - Nemuranai Me no Otoko Sleepless Eye (78321) | MANGA · FINISHED · 42/7 · 551 | — | MINT (step 2): a one-row staged series, this work as its anime | koukaku-kidoutai-arise-nemuranai-me-no-otoko-sleepless-eye · ghost-in-the-shell-stand-alone-complex | |
| one-piece | ONE PIECE HEROINES (197178 · SPECIAL · 2026) | ONE PIECE novel HEROINES (113686) | NOVEL · FINISHED · 10/2 · 987 | — | MINT (step 2): a one-row staged series, this work as its anime | one-piece-novel-heroines · one-piece | |
| fate | Fate/kaleid liner Prisma☆Illya: Licht Nameless Girl (118743 · MOVIE · 2021) | Fate/kaleid liner Prisma☆Illya 3rei!! (66131) | MANGA · RELEASING · ?/? · 4416 | — | MINT (step 2): a one-row staged series, this work as its anime (size unverified — AniList down) | fate-kaleid-liner-prisma-illya-3rei · fate | |
| to-love-ru | To LOVE-Ru: Multiplication - Mae kara Ushiro kara (100659 · OVA · 2017) | To LOVE-Ru Bangai-hen: Multiplication - Mae kara Ushiro kara (121848) | MANGA · FINISHED · 2/? · 617 | — | hold — below the threshold (no volume, < 8 chapters, finished) |  | |
| one-piece | One Piece: Romance Dawn Story (5252 · OVA · 2008) | Romance Dawn (35114) | ONE_SHOT · FINISHED · 1/? · 2953 | — | tie-in — never a series; research with (b) |  | |
| durarara | Durarara!! X2 The Second Arc: Onoroke Chakapoko (21331 · SPECIAL · 2015) | Durarara!! Gaiden!? (85836) | NOVEL · FINISHED · 10/1 · 333 | — | MINT (step 2): a one-row staged series, this work as its anime | durarara-gaiden · durarara | |
| fate | Fate/kaleid liner Prisma☆Illya 2wei! OVA (20862 · OVA · 2015) | Fate/kaleid liner Prisma☆Illya 2wei! (85136) | MANGA · FINISHED · 34/5 · 3469 | — | MINT (step 2): a one-row staged series, this work as its anime | fate-kaleid-liner-prisma-illya-2wei · fate | |
| dragon-ball | Dragon Ball: Yo! Son Goku and His Friends Return!! (5152 · SPECIAL · 2008) | Dragon Ball: Heya! Son Goku and His Friends Return!! (46110) | MANGA · FINISHED · 2/1 · 832 | — | MINT (step 2): a one-row staged series, this work as its anime | dragon-ball-heya-son-goku-and-his-friends-return · dragon-ball | |
| full-metal-panic | Full Metal Panic! The Second Raid: A Relatively Leisurely Day in the Life of a Fleet Captain (1015 · OVA · 2006) | Full Metal Panic! Sigma (30895) | MANGA · FINISHED · 90/19 · 2646 | — | MINT (step 2): a one-row staged series, this work as its anime | full-metal-panic-sigma · full-metal-panic | |
| blood-blockade-battlefront | Blood Blockade Battlefront & Beyond OVA (101695 · OVA · 2018) | Kekkai Sensen: Back 2 Back (86771) | MANGA · FINISHED · 32/10 · 2363 | — | MINT (step 2): a one-row staged series, this work as its anime | kekkai-sensen-back-2-back · blood-blockade-battlefront | |
| sailor-moon | Sailor Moon S Movie: Hearts in Ice (997 · MOVIE · 1994) | Bishoujo Senshi Sailor Moon: Short Stories (38552) | MANGA · FINISHED · 10/2 · 1729 | — | MINT (step 2): a one-row staged series, this work as its anime | bishoujo-senshi-sailor-moon-short-stories · sailor-moon | |
| mobile-suit-gundam | Mobile Suit Gundam Thunderbolt: December Sky (21893 · MOVIE · 2016) | Kidou Senshi Gundam Thunderbolt (67683) | MANGA · FINISHED · 230/27 · 1815 | — | MINT (step 2): a one-row staged series, this work as its anime | kidou-senshi-gundam-thunderbolt · mobile-suit-gundam | |
| fate | Fate/kaleid liner Prisma☆Illya 3rei!! Short Anime (87488 · SPECIAL · 2016) | Fate/kaleid liner Prisma☆Illya 3rei!! (66131) | MANGA · RELEASING · ?/? · 4416 | — | MINT (step 2): a one-row staged series, this work as its anime (size unverified — AniList down) | fate-kaleid-liner-prisma-illya-3rei · fate | |
| x | Tokyo BABYLON (1043 · OVA · 1992) | Tokyo BABYLON (30133) | MANGA · FINISHED · 18/7 · 8483 | — | MINT (step 2): a one-row staged series, this work as its anime | tokyo-babylon · x | |
| assassination-classroom | Koro-sensei Q! (21864 · MOVIE · 2016) | Koro-sensei Q! (86949) | MANGA · FINISHED · 40/5 · 1233 | — | MINT (step 2): a one-row staged series, this work as its anime | koro-sensei-q · assassination-classroom | |
| bleach | BLEACH Colorful!: Gotei Juusan Yatai Daisakusen! (100719 · OVA · 2008) | Tsurezure Nichijou Ekotoba Colourful Bleach (104300) | MANGA · FINISHED · 37/1 · 1196 | — | MINT (step 2): a one-row staged series, this work as its anime | tsurezure-nichijou-ekotoba-colourful-bleach · bleach | |
| sailor-moon | Sailor Moon SuperS Plus: Ami's First Love (1278 · SPECIAL · 1995) | Bishoujo Senshi Sailor Moon: Short Stories (38552) | MANGA · FINISHED · 10/2 · 1729 | — | MINT (step 2): a one-row staged series, this work as its anime | bishoujo-senshi-sailor-moon-short-stories · sailor-moon | |
| detective-conan | Case Closed: Conan and Kid and Crystal Mother (2514 · OVA · 2004) | Magic Kaito (31804) | MANGA · RELEASING · ?/? · 2881 | — | MINT (step 2): a one-row staged series, this work as its anime (size unverified — AniList down) | magic-kaito · detective-conan | |
| code-geass-lelouch-of-the-rebellion | Code Geass: Oz the Reflection Picture Drama (17277 · OVA · 2013) | Code Geass: Soubou no Oz (72381) | MANGA · FINISHED · 24/5 · 634 | — | MINT (step 2): a one-row staged series, this work as its anime | code-geass-soubou-no-oz · code-geass-lelouch-of-the-rebellion | |
| yowamushi-pedal | Yowamushi Pedal: SPARE BIKE (21806 · MOVIE · 2016) | Yowamushi Pedal: Spare Bike (99139) | MANGA · RELEASING · ?/? · 321 | — | MINT (step 2): a one-row staged series, this work as its anime (size unverified — AniList down) | yowamushi-pedal-spare-bike · yowamushi-pedal | |
| detective-conan | Meitantei Conan: Keisatsu Gakkou-hen - Wild Police Story CASE. Furuya Rei (166060 · SPECIAL · 2023) | Meitantei Conan: Keisatsu Gakkou-hen - Wild Police Story (112094) | MANGA · FINISHED · 13/2 · 957 | — | MINT (step 2): a one-row staged series, this work as its anime | meitantei-conan-keisatsu-gakkou-hen-wild-police-story · detective-conan | |

proposed: MINT 41 · tie-in 9 · already ours 0 · hold 3
