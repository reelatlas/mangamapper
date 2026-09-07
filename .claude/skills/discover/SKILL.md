# /discover — the discovery sitting (I42 / I43 / I44 / P39; built 2026-09-05)

The catalog no longer waits for AFL or AFG to say a season or a series
exists. This skill runs the sitting where Sean rules on what the halo and the
seed engines found, and it is the ONLY path that mints a series or a
component from a discovery ruling (the I42 mint rule: the mint is an event
step, after the dry-run recap has been seen; `npm run heal` only asserts).
The design: `scripts/ingest/research/discovery/PROPOSAL.md`.

**Two checkpoints, both in chat, both GENERATED (P5):** the sitting recap
(stored → proposed → decision) and the dry-run recap (the writer's reading of
the rulings). Never point Sean at a file for either.

## 0. Read STATE; stage the halo

- `docs/STATE.md` first. If a sitting is already in flight, it says which step.
- `npx tsx --env-file=.env.ingest scripts/ingest/discovery-stage.ts` — stages
  every unowned TV-shaped story relation of an owned entry (budgeted; a
  deferral is data and leads the next run). Staging only.

## 1. Derive from disk; the sitting recap IN CHAT

- `npm run census` (or `scripts/ingest/audit-discovery.ts` alone) — the
  classes: `halo_sequel_unclaimed`, `halo_series_unclaimed`,
  `halo_extra_standing` (capped; I13 standalone by default),
  `discovery_new_since_sitting` (the trigger), `discovery_ruled_unbuilt`,
  `discovery_ruling_stale`.
- `npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/recap.ts --scope sequel,series [--airing] [--owner <id>] [--limit N]`
  — one line per candidate, a table per FRANCHISE (else per owner): stored
  state first (unowned · no ruling / ruled X), then the proposal with its
  signals (`component` — a season ordinal or a declared open-ended I15
  owner; `series` — a different manga, or a non-SEQUEL story relation;
  `ambiguous` — a new subtitle or an unrelated title on the same or an
  unknown manga), then Sean's decision column. Paste it into the message.
  Cap a sitting like a wave (P12): the airing / announced rows first.
- The proposal NEVER writes. Presence in OVERRIDE_CHAINS means nothing; same
  manga is no signal (four ruled I16 splits share one).

- `recap.ts --scope extras --limit 2000` (`--summary` for the sitting's load tables: bucket totals, the load per owner, the same-instrument and other-instrument lists, PV / trailer suspects; the decision record lives in research/discovery/EXTRAS-SITTING.md) — the related-works table (I45): every recap / special / OVA / film of an owned
  series by franchise, its bucket (a rule decided it), the standing that implies, and the decision column:
  surface by label (N31), research standing + chapters (same-instrument), a series candidate (other-instrument),
  or hold. The ledger rows already exist (sync-related-works, standard heal); a sitting decides surfacing.

## 2. STOP — Sean rules

Each row gets one of: `component of <series>` · `series` (slug, relation
kind → base, franchise) · `extra` · `excluded` (reason) · `deferred` (reason,
revisit condition) · `standalone` (I13 default — no entry needed).

## 3. Write the rulings — maps, never rows

- `component` → an `OVERRIDE_CHAINS` entry (lib/rulings/override-chains.ts,
  keyed by the owner's AFL slug; `ruledExtent` carries the reasoning). An
  announced, undated season joins when it has dates (Kingdom S6 Part 2, Rent-a-
  Girlfriend S6 — the standing practice; an undated member flips the series to
  'upcoming').
- `series` → a `CANDIDATE_ENTRIES` entry in lib/rulings/discovery.ts
  (`anilist:<id>`; slug, relation, franchise, `chain` when the walk must be
  pinned) AND the franchise memberships in lib/rulings/franchises.ts (a new
  franchise needs a base member carrying the title). A relation kind AniList
  cannot express (`remake`) is a lib/rulings/relations.ts entry.
- `extra` → RULED_STRUCTURE (I39) or a watch-order ruling (N7).
- `excluded` / `deferred` → CANDIDATE_ENTRIES with the reason (retiresWhen).
- Log the sitting in `SITTINGS` (an ISO timestamp AFTER the staging run —
  `discovery_new_since_sitting` reads it).
- An owner whose every future part should join whatever its title →
  `OPEN_ENDED_ENTRIES` (a DECLARED I15 property — JoJo, Monogatari, Gintama).

## 4. The dry-run recap IN CHAT — then STOP again

- `npx tsx --env-file=.env.ingest scripts/ingest/seed.ts --dry-run` — one line
  per `series` ruling: `CREATE series <slug> ← anilist N · chain [...] · eps ·
  source · manga · franchise · relation · visibility STAGED · rows next`, or
  `HELD` (an ambiguous walk, a slug clash, a missing membership) — a held
  plan is a ruling question, never a guess.
- `npx tsx --env-file=.env.ingest scripts/ingest/stitch.ts --dry-run` — the
  ruled extensions: the chain, its aired sum vs AFL's count, the components.
- Every line is a change Sean authorises. He has not seen the writer's
  reading (the walked chain, the slug, the manga pick) at ruling time.

## 5. Apply, in order

1. `seed.ts` — the series rows (STAGED, P39), identity, components.
2. `stitch.ts` — the ruled extensions (components; AFL's rows merge).
3. `wiki-episodes-backfill.ts` for each new series / extended series — G59
   path A mints the rows (types default → `type_default_unclassified`).
4. `npm run heal` — assert-overrides (franchises, visibility), relations.ts
   (the AniList edges become series_relations), heal-format, the rest.
5. `npm run census` — `discovery_ruled_unbuilt` → 0, `ruling_violation` 0,
   `series_staged` lists the seeds, `identity_registry_gap` 0,
   `type_default_unclassified` +N (owed typing), every delta explained (P17).
6. `npm run system:census`; edges rebuilt + deployed if lib changed (P3).

## 6. Save point; what comes next

- changelog §12.N (the sitting as a ruling record: what landed, the classes),
  docs/STATE.md written last, commit, push.
- A seeded series enters the research work-list (per-episode TYPE + anchors in
  one ask — the research-batch variant) and stays STAGED until a classifier
  registers (I44 adoption) or a PUBLISHED ruling (lib/rulings/visibility.ts)
  lands. Report what is staged and why.

## Traps

- **A re-adaptation's manga can hang off an ALTERNATIVE edge, not ADAPTATION** (C2, 2026-09-07: Magic Knight Rayearth 2026 → the CLAMP manga 30119 labelled ALTERNATIVE; the seed dry run read 'manga none'): the I38 pick is ADAPTATION-only by rule — settle it with a `mangaAnilistId` ruling in lib/rulings/source-relations.ts (the No Regrets shape), never a wider filter. Read the `manga` field of every CREATE line against the staged edges before the mint.
- **A franchise-numbered season sub-page cannot continuity-lock on a component-scoped series** (C2: 'Ace of Diamond Act II season 2' numbers 179-191 in the franchise space; our act II tops at 52, so the lock's `pmin === top + 1` fails and the sibling page's proven offset (-126) does not carry across pages): the rows are OWED, the same class as re-zero's S3 / S4; a ruled page key (G59 B) alone will not fix it — the general fix is a family-offset carry in the wiki writer's lock, queued as engineering. The JoJo wiki numbers OVERALL, which is why Steel Ball Run's page locked (191) on the first try.
- **An announced later part WAITS on `retiresWhen`, dated to the month or not** (C2, Cursor's flip 1: Apothecary S3 Part 2, 2027-04): the Kingdom S6 Part 2 precedent is join-when-dated-to-the-day / airs, never include-now; only the season that starts inside the coming cour joins the extension.
- **An arc-titled continuation on the same manga with the same staff is a COMPONENT** (C2, Cursor's flip 2: Tougen Anki 'Nikko Kegon Falls Arc' — AniList's own synonym is 'Season 2'; the press says 'resume airing'): the recap reads a new subtitle as ambiguous by design; the ruling decides. Golden Kamuy's and Kaiju No. 8's arc-titled final seasons follow this shape when dated.
- **A seeded slug follows I1: English, else romaji — never a synonym** (C2, Cursor's flip 3: Toaru Anbu no ITEM → `toaru-anbu-no-item`; AniList's 'A Certain Dark Side's Item' is a synonym, ANN prints the romaji). Identity is ours: a later official English title does not re-slug.
- **The chibi-shorts shape is I48 (landed 2026-09-07 — a ≤ 5-min TV_SHORT / ONA spin-off routes to the ledger; the bucket still derives, a declaration is needed when the short carries no instrument edge)** (C2: nine 2-3-minute ONA / TV_SHORT spin-offs over Re:Zero, Tanya and Apothecary ruled `related_work` by hand — the Frieren precedent, four owners now): the gate = format TV_SHORT, or an ONA of at most five minutes, on a SPIN_OFF / SIDE_STORY edge of an owned series → the extras bucket. A 17-minute original short (Operation Desert Pasta) is NOT that shape — its own extra, ruled separately (Cursor's flip 4). Its date-derived seat (12.51, after the 2019 film) was release order on the watch-order key: the film's own wave-1 note already said the short is the film's 前日譚 — READ the owner's existing ledger notes before accepting a derived seat; the fix is a related-works `position` ruling on the pair (.5 = the first seat in watch order, the collider re-seated in the same apply — the Made in Abyss shape), never N7 (that is a source numbering a work INTO the run).
- **Apply a ruled extension with `stitch.ts --only <key>`, one key per ruling** (C1, 2026-09-06): the stitcher's dry run also lists every pre-existing open `count_mismatch` flag (Berserk Golden Age, 13 vs AFL 6) — those are Sean's triage, never a side effect of a sitting.
- **An owner with NO AFL page is extended by its SERIES ID** (C1: Iruma-kun, 100 Girlfriends, Polar Opposites): the chain is the ruling, nothing of AFL's merges, the rows come from the wiki writer (G59 A) or AFG. The `OVERRIDE_CHAINS` key is the AFL slug where one exists, else the series id.
- **The wiki finder's component lock needs season-ordinal labels** (C1, re-zero: "List of … episodes" with per-season tables against components labelled with the AniList title): no page locks → the rows are OWED, a RULED page key (G59 B, lib/rulings/wiki-pages.ts) is the next step. The finder's namesake refusals (air dates belonging to another show) are working — read them as evidence, not failures.
- **A series mint takes the chain's hangers-on with it** (the Tennis sitting; the Unicorn precedent): the walk re-attributes works hanging off the new series' own instruments — show the ledger moves in the dry-run recap; they are re-derivable rows, never rulings.
- **The apply's own staging shows up as `discovery_new_since_sitting`** until the next sitting log: read the members — at C1 they were the genuinely new hop-1 spin-offs the walk found only once the seasons were owned (Break Time S3 / S4, Youjo Shenki 2).

- **An EVENT roster script runs only on its trigger, after you have READ it, with `--dry-run` first where it has one — and a script with no dry-run is never assumed to have one** (INCIDENT-2026-09-05, `P40`): `audit-titles.ts` was run to apply one exclusion and deleted six series through a cascade against a stale fixture index; `afg-expansion.ts` has no dry-run and created a series when the flag was passed. Never run a script for its side effect; find the ruling map its job belongs to.
- **A held plan is never forced.** An ambiguous SEQUEL walk (two sequels) is a
  `chain:` ruling on the entry, decided by Sean.
- **The mint is never a standard heal.** seed.ts and stitch.ts are event
  entries; if a map edit lands before the dry-run recap, the census lists
  `discovery_ruled_unbuilt` until the sitting applies — that is the design.
- **The sitting timestamp must postdate the staging run**, or every candidate
  reads as new again.
