# Franchise rulings

How multi-entry franchises are structured in mangaMapper's canonical catalog.
Process and baseline: [data-pipeline.md](data-pipeline.md) §8 — one continuous
story = ONE series (seasons as `series_components`); major narrative shifts,
remakes, and spin-offs = separate series linked via `series_relations`.
Verdicts below come from a two-agent community-consensus research pass
(2026-08-22: MAL/AniList/Wikipedia structure + fan convention per franchise);
"final" rulings had clear consensus, "HELD" ones await Sean.

Relationship direction: newer/derived → base. Kinds: `sequel`, `side_story`
(same events, other POV — Sword Oratoria), `spin_off` (own story, shared
universe — Railgun), `remake` (superseding re-adaptation — HxH 2011),
`alternative` (mutually divergent tellings — FMA 2003 vs Brotherhood).

## Final rulings

| Franchise | Structure | Relations |
|---|---|---|
| Yu-Gi-Oh | 8 separate series (distinct protagonists/continuities) | DM→GX→5D's sequel chain; Zexal/Arc-V/VRAINS/Sevens spin_off; Go Rush sequel→Sevens |
| Digimon | 5 separate series | 02 sequel→Adventure; Tamers/Frontier alternative; 2020 alternative (reboot) |
| Sailor Moon | ONE series (200 eps, 5 seasons) | Crystal separate, remake |
| Gintama | ONE series (~369 eps; AniList's title-per-run entries = seasons) | — |
| Fairy Tail | ONE series (2009+2014+Final = seasons) | 100 Years Quest separate, sequel |
| Hunter x Hunter | 2 separate | 2011 remake→1999 |
| Fullmetal Alchemist | 2 separate | Brotherhood alternative→2003 |
| Fruits Basket | 2 separate (2019's three seasons = components) | 2019 remake→2001 |
| Shaman King | 3 separate | 2021 remake→2001; Flowers sequel→2021 |
| Rurouni Kenshin | 2 separate | 2023 remake→1996 |
| Monogatari | ONE series, novel-season components (First/Second/Final/Off&Monster) | (Kizu films excluded with movies; placement decided at re-evaluation) |
| Seven Deadly Sins | main = ONE series; Four Knights separate | Four Knights sequel→SDS |
| DanMachi | main = ONE series; Sword Oratoria separate | Sword Oratoria side_story→DanMachi |
| Sword Art Online | **MERGE** AFL's sword-art-online + sword-art-online-alicization into ONE series; Alternative GGO separate | Alt GGO spin_off→SAO |
| Index/Railgun | 2 series (each with own seasons) | Railgun spin_off→Index |
| Initial D | ONE series; Stages = sequential components; Third Stage is a **movie mid-sequence** (kept as an in-sequence component despite the movie exclusion — it carries mainline plot and AFL numbers it) | MF Ghost (future): separate, sequel |
| One Pace | excluded — fan re-edit, not an official series (Sean to confirm) | — |

## Ruled by Sean 2026-08-22 (were HELD)

1. **JoJo's Bizarre Adventure = ONE series**, parts as clearly-labeled
   components (part/season/arc labels or tags — the separation must stay
   legible in the UI).
2. **Pokémon: Ash era = ONE series** with per-generation components;
   **Horizons = separate series, sequel**. Built via node-ID recovery while
   AFL's generation pages stay corrupted; re-evaluate against fresh data when
   AFL fixes their aliases.
3. **One Pace stays excluded** (fan re-edit) — revisit later.
4. **In-flow movies/OVAs join their series** when they're strong canon in the
   series order (Initial D Third Stage, HxH 1999 Greed Island OVAs,
   Kizumonogatari inside Monogatari) — each component carries an explicit
   `kind` (season/movie/ova/special) so the UI can tag or section it clearly.
   Standalone collections stay excluded for the watch-order re-evaluation.

## Post-batch rulings

- **Higurashi (When They Cry)**: Gou (2020) stays in the SAME series (Sean
  2026-08-22) — marketed remake-style but is a direct sequel (time-loop
  framing obscures it); the lag-rule auto-stitch stands. Chain: 2006 → Kai →
  Rei OVA → Gou (Sotsu joins when AFL classifies it).

## Rulings 2026-08-24 (AFG structural cross-check session)

- **Tokyo Ghoul :re stays a SEPARATE entry** (Sean): it matches the
  Naruto→Shippuden pattern. AFG's page runs the whole story continuously
  (1–48); we don't mirror their presentation. When the IA/hierarchy rework
  lands, both may live under one franchise umbrella — not now. Same holds for
  Bleach→TYBW. Enforced structurally by the ownership guard (lib/chain.ts)
  and the RULED_SPLITS skip list (afg-extend.ts).
- **AFG as story-flow reference** (Sean): AFG's structuring — watch order,
  what constitutes filler/mixed/canon, and especially the between-season
  reading guidance ("S2 diverges from canon: read ch 136–143 before :re") —
  is more poignant and precise than most alternatives. We capture the data
  (greedy raw_html staging) and cross-reference against AniList/AFL/wikis/MU,
  without being bound to present it AFG's way.
- **AFG digimon-adventure page = the 1999 series** (romaji "Digimon
  Adventure"; the 2020 reboot is "Digimon Adventure:" per AniList naming).
- **AFG bishoujo-senshi-sailor-moon page = the 90s original**, not Crystal
  (synonym collision caught by the ambiguity rule).

## Meta-finding

AFL page granularity agreed with community consensus in 17 of 18 franchises
evaluated (JoJo contested, SAO the one true merge). The "one AFL page = one
series" prior is strong — but the SAO case proves the evaluation step earns
its keep.

## Rulings / findings 2026-08-23 (session 2, batch 14)

- **Cardcaptor Sakura: Clear Card = SEPARATE SERIES — RULED (Sean
  2026-08-24)**, the Naruto→Shippuden pattern (different manga, AniList
  87296). Built as `cardcaptor-sakura-clear-card` (AniList 97881, 22 eps in
  its own 1-22 numbering, 16 batch-14 anchors vs the Clear Card manga,
  sequel relation); `cardcaptor-sakura` = 71 (1998 TV + Prologue OVA 98554
  at ep 71 = chs 46-50; community cap 71 keeps the shared AFL page's tail
  out). The announced Clear Card sequel (163326) joins the NEW entry when
  it airs.
- **Golden Kamuy**: the Final Season (166521) ends on ch 302 (vol 30); the
  announced *Saishuushou – Bousou Ressha-hen* (210073) adapts 303-314 and
  joins the ruled chain when it airs. Sapporo Beer Koujou-hen films
  (196115) = recut of eps 50-55, excluded.
- **Kingdom**: S6 Part 2 is a separate AniList entry (204688, Zoku-hen) —
  component 7 when it airs, not an extension of 190840.
- **Arslan**: Fuujin Ranbu (21424) stitched as S2 (our 26-33, chs 72-107);
  the 1991 OVA (1762) is a separate novel adaptation, excluded.
- **My Hero Academia post-finale specials — RULED (Sean 2026-08-24)**:
  essential canon the community groups with the series; both join as
  ORDER-ONLY entries (counts stay 170). Surface positions follow the fan
  numbering: "No. 170+1: More" (204356, ch 431) at **170+1**; the Eri
  special "I am a hero too" (211711, ch 431.5) at **170+1.5** — Sean's own
  convention (no settled community number; the .5 matches the manga's
  bonus-chapter format and the special's length). Stored at
  ingest_fractionals positions 171/171.5 + OVERRIDE_CHAINS extras. The +N
  surface format is a PER-SERIES ruling recorded in data, not a global format; titles 'More' / 'I am a hero too'. SURFACING PARKED
  (Sean 2026-08-24) until the specials/OVAs/movies status design pass —
  the intended unit-level rendering (rows in the +N format, section
  envelope to 431.5, counts, strip presence, selectable, series total
  reads "170+1.5") is recorded in data-pipeline §10 as the reference
  point.
- **Rent-a-Girlfriend**: S6 (213581) announced, undated — joins when listed
  with dates.
