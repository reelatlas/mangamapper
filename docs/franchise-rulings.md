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

## Meta-finding

AFL page granularity agreed with community consensus in 17 of 18 franchises
evaluated (JoJo contested, SAO the one true merge). The "one AFL page = one
series" prior is strong — but the SAO case proves the evaluation step earns
its keep.
