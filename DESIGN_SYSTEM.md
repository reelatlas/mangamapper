# mangaMapper Design System

> The codified version of the visual language already in the app: a terminal / code-editor aesthetic.
> Everything is monospace, near-sharp-cornered, dash-bordered, and syntax-highlighted.
> This doc is the source of truth — when a component or new layout drifts from it, either fix the component or update the doc deliberately.

**Status legend used throughout:** ✅ keep as-is · 📝 keep, needs refactor · 🧹 delete (dead code) · 🚧 rework for new concept

---

## 1. Foundations

### 1.1 Color tokens

All colors are HSL CSS custom properties in [src/index.css](src/index.css), consumed via Tailwind (`bg-background`, `text-syntax-cyan`, …). `:root` **is the dark theme** — dark is the default and only active theme. A `.light` class exists but nothing ever applies it (no theme toggle); treat light mode as unsupported until we decide otherwise.

#### Core palette (dark)

| Token | HSL | Usage rule |
|---|---|---|
| `background` | `220 13% 8%` | Page ground. Warm-dark charcoal. |
| `foreground` | `210 17% 82%` | Default body text. |
| `card` | `220 13% 11%` | Card surfaces — one step lighter than bg. |
| `popover` | `220 13% 14%` | Floating surfaces — two steps lighter. |
| `primary` | `199 89% 70%` | Terminal cyan-blue. Interactive emphasis, focus ring. |
| `accent` | `142 70% 49%` | Terminal green. Success, "active", hover-reveal color. |
| `secondary` | `220 9% 20%` | Muted gray fills. |
| `muted` | `220 9% 15%` | Subtle backgrounds (scrollbar track, wells). |
| `muted-foreground` | `210 10% 55%` | De-emphasized text: labels, hints, timestamps, `//` comments. |
| `destructive` | `0 72% 60%` | Terminal red. Delete actions, filler badge. |
| `border` | `220 9% 25%` | All borders (always paired with `border-dashed` — see 1.4). |
| `input` | `220 9% 20%` | Input borders/fills. |
| `ring` | `199 89% 70%` | Focus ring = primary. |

#### Syntax scale (the brand palette)

The five-color "syntax highlighting" scale is what makes the app feel like code. Defined in [tailwind.config.ts](tailwind.config.ts) as `syntax.*`.

| Token | HSL | Semantic role (JSON metaphor) | Current usage count |
|---|---|---|---|
| `syntax-cyan` | `185 80% 60%` | **Keys / labels** — `title:`, `status:`, section headers | ~80 uses (dominant) |
| `syntax-green` | `142 70% 60%` | **String values** — titles, names, timestamps | ~25 |
| `syntax-amber` | `36 90% 65%` | **Numbers** — ranks, counts, episode numbers | ~26 |
| `syntax-purple` | `270 70% 70%` | **Brackets / special** — anime-original badge, punctuation accents | ~12 |
| `syntax-pink` | `330 80% 70%` | **Rare accent** — use sparingly (currently 2 uses; TripleArrow) | 2 |

**Rule:** when writing any key/value UI text, color the key `syntax-cyan` or `muted-foreground`, string values `syntax-green`, numeric values `syntax-amber`. Never invent a new token name (`text-syntax-string` was a bug — fixed).

### 1.2 Typography

- **One family for everything:** `IBM Plex Mono` → `JetBrains Mono` → system mono. `sans`, `serif`, and `mono` in the Tailwind config all resolve to this stack — the monospace look is total and intentional.
- Weights loaded: 400 / 500 / 600 / 700.
- Scale in practice: `text-xs` for chrome (labels, hints, badges, terminal headers), `text-sm` for body/controls, `text-base`–`text-lg` for titles, larger only on the detail page hero.
- Tracking: `0em` (`--tracking-normal`).

### 1.3 Radius & elevation

- `--radius: 0.125rem` — near-sharp corners everywhere. This is a signature choice; do not round further. (`rounded-lg` = 2px, `md`/`sm` derive smaller.)
- **Shadows are nearly banned.** `2xs`/`xs` are literally `none`; the only sanctioned uses are the focused SearchBar (`shadow-md`) and floating Radix content. Depth comes from surface lightness steps (bg → card → popover) and borders, not shadows.

### 1.4 Borders — the strongest motif

`border-dashed` + `border-border` is the single most identifiable visual signature. Cards, buttons, inputs, headers, footers, empty states — all dashed. Hover/active states may switch `border-dashed → border-solid` (`.cmd-button` pattern) or recolor to `primary`/`accent`.

**Interior dividers ruling (2026-08-19):** dashed borders frame *containers and controls* — they are **not** used as horizontal dividers between data regions inside a card. Separation inside a card is **spacing only**, via the **card rhythm tokens** (index.css → tailwind `spacing`): `--space-loose` (1.5rem — the card header/title block → its content), `--space-region` (1rem — between content regions: legend → episode list) and `--space-tight` (0.75rem — pairs that read as one unit: positions → strip, strip → its legend). Applied as **per-seam `mt-*` utilities** (`mt-region`, `mt-tight`), not a uniform column gap. Never raw spacing numbers between card regions.

### 1.5 Copy & microcopy conventions

The UI copy is written *as code*:

- Buttons/actions are function calls in snake_case: `sign_in()`, `add_series()`, `save_readers()`, `delete_series()`.
- De-emphasized/system text is a comment: `// no_source`, `// data_pending`, `// anime_original`, `// something(null)`.
- Command-style headers: `> command_name()`.
- Keys end with `:` and use snake_case: `last_updated:`, `title_jp:`.
- **`—` is the universal null** for a missing value in a data position (`ep:1122/—`, a filler row's manga column, a filler section's coverage). Reserve `// comments` for system *messages*; a missing *value* is an em dash in the neutral disabled tone (`muted-foreground/60` — same as `// title_pending`).
- **Vocabulary: contiguous same-type episode spans are "sections", never "arcs"** — arcs are story/lore arcs, a section boundary is a data boundary (user ruling, 2026-08-19).

**Rule:** any new label must pick one of these three forms (function call, `// comment`, `key:`). No Title Case marketing copy inside the app UI.

**Dimmed-symbol rule:** when a symbol prefixes a colored value (`#337` in the episode list), the symbol takes the **disabled tone of the value's own color** (the type color at 0.45 alpha), not neutral muted — one hue, two intensities per token.

**Card type scale (2026-08-19):** inside a card, *labels* (`anime`, `manga`, `ep`/`vol`/`ch`, `episode_list`, the expanded/collapsed controls) are `text-xs tracking-wider`; *values/body* (`ep:1122/—`, `vol:108 · ch:1092`, lookup readout, every episode-list row and section-header line) are `text-sm tabular-nums`. One size per row — hierarchy by color, never size (the meta-row rule, generalized). Badges carry their own component scale.

### 1.6 Custom utility classes ([src/index.css](src/index.css#L163-L236))

| Class | What it does | Status |
|---|---|---|
| `.terminal-header` | Dashed bottom border + xs muted mono text | ✅ used 17× — the standard card header |
| `.terminal-window` | Dashed border + card bg | 🧹 unused — either adopt as the standard card wrapper or delete |
| `.json-key/.json-string/.json-number/.json-bracket` | Syntax colors | 🧹 unused (app uses `text-syntax-*` utilities instead) — delete |
| `.ascii-badge` | Bordered xs badge | 🧹 unused (EpisodeBadge does this in-component) — delete |
| `.cmd-button` | dashed→solid hover border | 🧹 unused — pattern lives in Button usage instead; delete |
| `.line-number` | Right-aligned muted number gutter | 🧹 unused — delete |
| `.cursor-blink` | `▌` blinking cursor via `blink` keyframe | 🧹 unused — delete or adopt for empty/loading states |
| `.scanlines` | CRT scanline overlay | 🧹 unused — delete |
| `.animate-row-pulse` | EpisodeList row highlight after a lookup/strip-driven jump (primary @ 22% → transparent, 0.9s ease-out; off under reduced motion) | ✅ new |

---

## 2. Motion & animation

Current state: **no animation library** (as of now `motion@13` is installed and is the go-to for new work). Existing motion is CSS-transition-based:

### Existing patterns worth keeping (the app's motion vocabulary)

1. **Per-letter stagger** — inline `transitionDelay: ${i * 50}ms` over `transition-colors`; logo colorizes left→right on hover ([Header.tsx](src/components/Header.tsx#L23-L33)), "← re_wind" right→left ([Auth.tsx](src/pages/Auth.tsx#L207-L217)). *Signature effect.*
2. **Hover-reveal** — `opacity-0 group-hover:opacity-100` overlays (SeriesCard action overlay, group headers).
3. **Max-width slide-in hints** — `max-w-0 opacity-0 → group-hover:max-w-[120px] opacity-100`, `duration-500 ease-out` ([About.tsx](src/pages/About.tsx#L12-L19)).
4. **Radix enter/exit** — `tailwindcss-animate` classes inside ui primitives (fade/zoom/slide, ~200ms).

Durations in use: 150 / 200 / 300 / 500ms. Keep micro-interactions ≤200ms, reveals ≤500ms.

### Motion vocabulary added in phase 1 (all audited S-tier)

5. **List entrance stagger** — rows fade + rise 8px (`opacity` + `transform` string → WAAPI), 250ms easeOut, delay `min(index,10) × 40ms` ([Index.tsx](src/pages/Index.tsx)).
6. **Strip reveal** — MappingStrip scales X from 0 origin-left on scroll-into-view, 500ms easeOut, once.
7. **Terminal loading pulse** — `> fetch_series() ...` opacity 0.35↔1 mirror loop, 600ms (Index, AnimeDetail).
8. `MotionConfig reducedMotion="user"` wraps the app ([src/App.tsx](src/App.tsx)) — transforms drop, opacity stays, for reduced-motion users.
9. **Disclosure chevron rotate-in-place** — 150ms transform on a fixed square flex-centered box (EpisodeList section markers). Rule: a disclosure marker must rotate/swap inside a square centered box, never a tall inline text box (rotating the text box swings the glyph off its own center).
10. **Row pulse** — after a lookup/strip-driven jump, the landed row flashes via `.animate-row-pulse`: an absolutely-positioned overlay fading **opacity** 1→0 over 0.9s (compositor-friendly; never animate background-color for this). Off under reduced motion.

### Rules going forward

- New animation goes through **motion** (`motion/react`) and must pass the motion skill's logic checks (the global `~/.claude/skills/motion` audit) before it ships. Terminal vibe rules the aesthetic: motion should feel like a terminal rendering output — quick, precise, no bouncy overshoot.
- **Fix on sight:** the imperative `document.getElementById().classList` hover icon-swaps in [Index.tsx](src/pages/Index.tsx#L139-L150), [LibraryFlatView.tsx](src/components/library/LibraryFlatView.tsx#L57-L68), [LibraryGroupedView.tsx](src/components/library/LibraryGroupedView.tsx#L241-L271) — replace with React state or CSS `group-hover` swaps.
- The `blink` keyframe is defined twice (config + index.css) and never used — consolidate or delete.

---

## 3. Component inventory

### 3.1 App components ([src/components/](src/components/))

| Component | Status | Notes for the new list-first concept |
|---|---|---|
| `Header` | ✅ | Signature staggered logo. Keep. |
| `SearchBar` | ✅ | Debounced, ref-exposed focus. Core to list-first UX. |
| `AnimeCard` | 🚧 | **Expanded variant: functionality-complete (2026-08-19) — see §7 for the full anatomy.** Hosts `usePositionLookup` + the filter state so InlinePositionRow, MappingStrip, and EpisodeList act as ONE instrument. **Card navigation to the details page is disabled in browse mode** — clicking will become expand/collapse when the **compact/collapsed** variant lands (the NEXT work item); details-page linking returns with the library phase. `continue_from` removed from UI (data stays in the model). |
| `MangaMappingDisplay` | ✅ | Episode→chapter row. The heart of the read-only content. |
| `MappingStrip` | ✅ new | **Whole-story** density strip — five states: canon (green) / mixed (amber) / filler (red) / anime_only (purple) as solid segments, plus **manga_only** (dimmed green 45° hatch) as the tail for published canon chapters the anime hasn't adapted (`mangaAheadUnits` in episode-equivalents keeps proportions honest). WAAPI scaleX reveal, optional `markerEpisode` indicator, optional `viewband` — the EpisodeList's visible slice as an **M1 fill-only** minimap band (`foreground/18%`, no edge lines; chosen 2026-08-19). Used in AnimeCard + AnimeDetail. |
| `TypeBadge` | ✅ new | **THE type-token treatment** ("S2 tint", chosen 2026-08-19): colored text on ~10% tint of the same hue, 1px faint border, 2px radius. Only `manga_only` (green) wears the strip's hatch — `anime_only` (purple) is a full solid tint because that content IS canon to the show (user ruling, 2026-08-19). The badge is the **legend unit** — counts render inside it (dimmed, one size down) — and the **filter affordance**: clickable badges (`onClick`/`pressed`/`dimmed` props, real `<button>` + `aria-pressed`) work **click-to-hide** — everything selected by default, clicking removes that type from view; hidden badges dim to 40%. A badge with no data does not render (empty-state rule). `px` is load-bearing for the EpisodeList column contract — see [docs/components/episode-list.md](docs/components/episode-list.md). Supersedes `EpisodeBadge` for legend/section use. |
| `EpisodeList` | ✅ new | The full aired run inside the expanded card, grouped by **sections** (never "arcs") with sticky headers, type-colored chevron markers (A3), `expanded:# · collapsed:#` controls with the hover-append `⌄ all` / `› all` hints, three-way sync (rows ⇄ lookup ⇄ strip band), legend-as-filter (excluded sections drop from the list, excluded strip zones ghost in place, lookup never filtered), j/k walking over visible sections only, `@tanstack/react-virtual` windowing. **Full behavioral contract: [docs/components/episode-list.md](docs/components/episode-list.md).** |
| `InlinePositionRow` | ✅ new | **THE position instrument** ("Q1", 2026-08-19) — the totals row and the lookup merged: the current numbers ARE the inputs, totals static after the `/`, metadata (tag + `// reset()`) in-row right of the fields. Rest = the series' present position (dim strip marker); driver = last field touched; no channels, no pins (filler/manga_only positions render as `—` values); focus-only **width lock** (fields freeze at series-max digit widths while focused). **Full contract: [docs/components/position-row.md](docs/components/position-row.md)** (map-lookup.md kept as the historical derivation). Layered: pure math in `lib/mapping.ts` → state in `usePositionLookup` → `InlinePositionRow`/`StepperInput`/`MappingStrip`; the host (AnimeCard) owns the hook so row, strip, and episode list act as one instrument. |
| `StepperInput` | ✅ | **One input component, two skins** — `variant="box"` (details-page dashed box) and `variant="inline"` (the position-row skin: data at rest, dashed underline on hover/focus — never solid/primary, steppers take zero space until focus, ch-based width, neutral caret, no select-all). Component-owned steppers (▲▼, ↑/↓ + shift, wheel-when-focused, Esc) so every step path routes through the seeding logic; **hold-to-repeat with acceleration** (400ms → 130 → 80 → 40ms). Never fork the behavior — new looks are new skins. |
| `EpisodeBadge` | 🚧 | canon/mixed/filler/anime pill (999px radius). `TypeBadge` is now the standard type-token treatment — migrate remaining `EpisodeBadge` usages to `TypeBadge`, then delete. |
| `CollectionSection` | 📝🚧 | 567 lines mixing UI + data. Belongs to the *later* bookmark/track phase; extract visual pieces now. |
| `SeriesCombobox` | 📝 | Fine UI, but reads mock data directly — data source must become injectable. |
| `TripleArrow` | ✅ | Fun signature chevron. |
| `GoogleIcon` | ✅ | Grayscale→color on hover. |
| `AddToReaderDropdown` | 🧹 | Orphan — imported nowhere. Delete. |
| `NavLink` | 🧹 | Orphan. Delete. |

### 3.2 Library components ([src/components/library/](src/components/library/))

All belong to the *phase-2* (bookmark/track/update) feature set. They work but are heavily entangled with data logic and duplicate each other:

| Component | Status | Notes |
|---|---|---|
| `LibraryFlatView` / `LibraryGroupedView` | 📝🚧 | 534-line grouped view; grouping/sorting logic should move to hooks. |
| `SeriesCard` | 📝 | 551 lines; silently drops rows whose `anime_id` isn't in mock data. |
| `NewSeriesForm` / `NewReaderForm` / `InlineNewReaderForm` | 📝 | Duplicated reader-URL and reader-option logic (see §5). |
| `ViewModeToggle` | ✅ | Small and clean. |

### 3.3 Pages

| Page | Status | Notes |
|---|---|---|
| `Index` | 🚧 | Becomes the read-only list home. Filters already persist to localStorage. |
| `AnimeDetail` | 🚧 | Read-only mapping list is the core; `CollectionSection` gets deferred to phase 2. |
| `Auth` | 📝 | Works; remove hardcoded test creds before any deploy. |
| `Library` | 🚧 | Phase-2 feature. |
| `About` | ✅ | |
| `NotFound` | 📝 | Doesn't use the design system at all — restyle to terminal look. |
| `Readers.tsx` | 🧹 | 752-line orphan, superseded. Delete. |

### 3.4 shadcn/ui primitives (50 files in [src/components/ui/](src/components/ui/))

- **Used (keep):** button, input, card, label, toggle-group, toggle, select, popover, command, dialog, collapsible, dropdown-menu, scroll-area, tooltip, sonner.
- **Delete (33 unused):** accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, calendar, carousel, chart, checkbox, context-menu, drawer, form, hover-card, input-otp, menubar, navigation-menu, pagination, progress, radio-group, resizable, separator, sheet, sidebar, skeleton, slider, switch, table, tabs, textarea, plus the duplicate `ui/use-toast.ts`.
- **Toast systems:** two are mounted ([App.tsx](src/App.tsx#L20-L21)) but all feature code uses **sonner**. Delete the shadcn toast path (`ui/toast.tsx`, `ui/toaster.tsx`, `src/hooks/use-toast.ts`, `<Toaster/>`).

---

## 4. Data & architecture facts (for context when building)

- **Stack:** Vite 5 · React 18.3 · TS 5.8 · Tailwind 3.4 · shadcn/ui · Supabase JS · react-router 6 · sonner · motion 13. Dev server port 8080, alias `@` → `src`.
- **Catalog data goes through `src/data/catalog/`:** the `CatalogSource` interface ([source.ts](src/data/catalog/source.ts)) is the swap point — today `mockCatalogSource` (15 series wrapping mockAnime.ts + full-run filler spans), later AniList + a filler feed. UI consumes it only via the React Query hooks in [useCatalog.ts](src/hooks/useCatalog.ts) (`useCatalogList/Search/Series/Mapping`). Mock latency is 150ms so loading states are real. Phase-2 library components still read mockAnime directly — migrate them during the phase-2 rework.
- **Supabase (live, project `ysjnqbnbtftjdepovpkt`):** `profiles` (trigger-populated), `anime_progress` (user progress, `UNIQUE(user_id, anime_id)`, soft-delete via `in_library`), `manga_reader_sites` (denormalized: one row per reader×series, re-grouped client-side by lowercased name). All RLS user-scoped. `anime_id` is a free-text slug with no FK.
- **TanStack Query now powers the catalog** (list/search/series/mapping, 5-min staleTime). Supabase library data (`useLibraryData`) is still manual `useEffect` — migrate during phase 2.
- Test account: `test@mangamapper.com` / `test123456` (email-confirmed manually; prefilled in Auth.tsx — remove before deploy).

---

## 5. Duplication status

| Logic | Status |
|---|---|
| `formatTimestamp` | ✅ consolidated → `src/lib/format.ts` |
| `normalizeUrl` / `isSeriesUrlDefined` | ✅ consolidated → `src/lib/urls.ts` |
| Reader-URL base+suffix rewriting (6 files) | ⏳ consolidate during phase-2 rework |
| `readerOptions` memo (CollectionSection, SeriesCard, NewSeriesForm) | ⏳ phase-2 rework |
| Reader-assignment diff-and-save (CollectionSection, SeriesCard, LibraryGroupedView) | ⏳ phase-2 rework |
| Radix Select content className string (3 files) | ⏳ phase-2 rework |

---

## 6. Product concept & roadmap

**The core job:** a user who just watched an anime episode can instantly see where that episode lands in the manga (volume/chapter) — so they can keep reading when an anime ends, stalls, or declines. Competitors (animefillerlist.com, animefillerguide.com) have the data but poor display; mangaMapper wins on presentation and speed. Read-only use requires no account.

**Phase 0 — salvage & formalize: ✅ done (2026-08-18).** Deleted ~40 dead files (orphan pages/components, 33 unused shadcn primitives, shadcn toast system, dead CSS utilities, 25 unused npm deps); consolidated `formatTimestamp` → `src/lib/format.ts` and `normalizeUrl`/`isSeriesUrlDefined` → `src/lib/urls.ts`; replaced all `getElementById` hover hacks with React state; restyled NotFound onto the terminal system; typed the two `as any` upserts with `TablesInsert<'anime_progress'>`.

**Phase 1 — read-only list-first.** The homepage is an anime list optimized for the anime↔manga *comparison* — "I'm at episode X, where am I in the manga?" — with filler visibility.

*Progress (2026-08-19, second pass):* **The expanded card's functionality is COMPLETE** (aesthetic exploration still to come). The EpisodeList shipped (virtualized, span-sections, sticky headers, three-way sync, legend-as-filter, X6 hover-command control — [docs/components/episode-list.md](docs/components/episode-list.md)); then the totals row and the lookup **merged into the InlinePositionRow** instrument (driver-field model, Q1 inline fields — [docs/components/position-row.md](docs/components/position-row.md); map-lookup.md kept as historical derivation); TypeBadge became the type-token standard; the card rhythm tokens landed (§1.4). See **§7 — the expanded card anatomy** for the region-by-region reference.

*Agreed build order:* **(1) episode list inside the expanded card ✅ done.** **(2) collapsed card state** + expand/collapse interaction ← **NEXT** (artifact exploration first, per workflow). **(3) UI/aesthetic/interaction polish pass** + search & browse model (motion + d3-style visuals). **(4) then phase 2:** library, save/track, auth.

Design constraints:
- The list row/card is comparison-first: episode position vs manga volume/chapter alignment, filler density at a glance — not a generic anime card.
- **Homepage end-state (agreed 2026-08-18):** default view is a clean *compact list* of series (AnimeCard `compact` variant); clicking a row expands it in place to the `expanded` variant. Search filters the list (later: fuzzy matching with exact matches surfaced above fuzzy ones, shown as distinct sections). Scroll presentation lives in a fixed vertical range — futuristic hacker feel. Nail expanded first, then compact + search/scroll.
- **Position formatting rules:** `Tv` icon labels anime, `BookOpen` labels manga (lucide icons only, never emoji). Values are compact with **no spaces**: `ep:1122/—`, `vol:108/110 · ch:1092/1130` — never `ep_`/`vol_` underscore style, never `ep 1122 / —` spaced style. Label is just "manga", not "manga coverage". The colon-tight rule extends everywhere a key meets a value (`ep:337-381` in section headers). The strip legend is **TypeBadges with counts inside** (right-aligned below the strip), not a text line.
- **Icon+label rows use `PositionLabel`** ([src/components/PositionLabel.tsx](src/components/PositionLabel.tsx)) — never hand-rolled. Its contract: (1) **icon size = 1em of the label type** (`w-3 h-3` = 12px beside `text-xs`) — larger icons read oversized against lowercase mono labels, whose visual mass is only the x-height band; (2) the icon box and the text line box are the **same height** (`leading-3` = 12px), so `items-center` aligns two equal boxes and alignment cannot drift; spacing is `gap-1.5`; states are `active` (text cyan + icon primary) and `iconActive` (icon primary only). No positional nudges, ever — if a glyph reads unbalanced, fix the artwork itself. **Canonical watch/read glyphs live in [src/components/icons.tsx](src/components/icons.tsx)** (chosen via icon fit test, 2026-08-18): `TvIcon` = lucide tv with art shifted up 2 units in its frame; `BookOpenIcon` = lucide book-open shifted down 2 units. Always import these from icons.tsx — never raw lucide `Tv`/`BookOpen`. Adopted across AnimeCard, AnimeDetail, CollectionSection, SeriesCard.
- **The meta-row contract (alignment rule):** any line mixing tags, values, and actions (lookup results) uses **ONE font size for every child — hierarchy inside a line is expressed by COLOR, never by size.** Size tiers exist *between* component types (labels `text-xs`, body/meta `text-sm`, strip captions 10px), never within a single line: mixing sizes in a line is what creates baseline-balancing problems in the first place. The `.meta-row` utility ([index.css](src/index.css)) enforces the rest: baseline alignment, `align-content:center`, gap-only spacing, `line-height:1` on children, plus a **baseline strut** (flex rows lack block layout's built-in font strut) as defense-in-depth so the line's position stays fixed regardless of content. Use the utility, never re-implement.
- **The position instrument** is the card's core interaction — the **InlinePositionRow**: the current numbers ARE the inputs (rest = the series' present position), driver = last field touched, full derivation, `—` for positions that don't exist, `// reset()` restores the present. No channels, no pins (both dissolved in the merge, 2026-08-19). Exploring shows **no type tag** — the strip zone, list selection, and `—` values carry it; only `// out_of_range (…)` keeps its comment prefix (system message). No `~` on estimates — approximation is assumed. Full contract: [docs/components/position-row.md](docs/components/position-row.md).
- **The strip shows the whole story, not just the anime run:** the `manga_only` hatched tail represents published canon the anime never adapted, so users see at a glance how much of the collection actually got animated. (Future data upgrade: manga_only gaps can also appear *before or between* adapted spans, not just as a tail.)
- **The source-scope rule (data modeling):** a series entry adapts a **range** of the source, never "the whole franchise." Distinct series are separate entries — Naruto (Part I: vol 1-27 / ch 1-244) and Shippuden are never lumped; Part II is NOT Naruto's manga_only tail. Seasons within one continuous run stay cohesive as one entry. Sequels starting mid-manga carry `mangaStartVolume`/`mangaStartChapter` (Bleach TYBW: vol 55 / ch 480) so estimates map correctly and pre-scope chapters answer `// out_of_range (ch 480-686)` — they belong to the predecessor's entry. All lookup math, stepping bounds, and the manga_only tail are scope-aware.
- **First-class empty states**: most series have no filler and some have no manga source. `// no_source` / no-filler must look intentional, not broken.
- **Injectable catalog data source**: build against an interface so mock data swaps for AniList API (catalog) + a periodic scrape/custom API of animefillerlist/animefillerguide (filler data) without touching components. No component imports `mockAnime.ts` directly by the end of this phase.

**Phase 2 — accounts & library.** Curate favorite series; manage manga reader sites (the pain: dead mirrors, long/nested URLs, scattered bookmarks). Interactions should feel near drag-and-drop: easy add/remove series and readers, quick vol/chapter updates, easy link swaps when a mirror dies. AniList manga lists as default readers + user custom readers. Rebuild the current manual forms (CollectionSection, New*Forms) on the documented components; consolidate the still-duplicated reader-URL rewriting, `readerOptions` memo, and assignment diff-and-save logic when these are reworked.

**Later (only after the above):** light novels and other source material.

---

## 7. The expanded card — anatomy & contracts (frozen 2026-08-19)

The functionality-complete reference for the expanded AnimeCard, top to bottom.
Every region has a contract; if a component and its doc disagree, one is a bug.
Aesthetic/UI exploration is still to come — behavior below is settled.

```
┌ terminal-header  (#rank | series_map · status)
│  [cover]  title + title_jp
│           ── loose (24px) ──
│           ⌚ anime ep:[1122]/—   ▤ manga vol:[108]/110 · ch:[1092]/1130   // reset()
│           ── tight (12px) ──                    ← InlinePositionRow (position-row.md)
│           ━━━━━━━━━━━ mapping strip (h-3) ━━━━━╪━━━▨▨▨
│           ── tight (12px) ──                    ← MappingStrip
│                          [canon 1021][mixed 3][filler 98 (9%)][manga_only +38ch]
│           ── region (16px) ──                   ← TypeBadge legend (click-to-hide filter)
│           ☰ episode_list ( > expand_all on hover)
│           ❯ [canon]  ep:1-45 (45)               vol:1-5 · ch:5-45
│              #1  title…                         vol:1 · ch:1
│           ❯ [filler] ep:46-47 (2)               —
│           …                                     ← EpisodeList (episode-list.md)
└
```

**Region contracts & where they live:**

| Region | Component | Contract doc |
|---|---|---|
| Position instrument (totals = inputs, reset, width-lock, seeding) | `InlinePositionRow` + `usePositionLookup` + `StepperInput inline` | [docs/components/position-row.md](docs/components/position-row.md) |
| Strip (spans, needle states, viewband, click rules, filter ghosting) | `MappingStrip` | position-row.md §5 + episode-list.md §6 |
| Legend (badges w/ counts, click-to-hide filter) | `TypeBadge` | episode-list.md §8 + §3.1 entry |
| Episode list (sections, sync, X6 control, j/k, band) | `EpisodeList` + `buildEpisodeList` | [docs/components/episode-list.md](docs/components/episode-list.md) |
| Pure math (canon-aware conversion, solve, seeding, scope) | `lib/mapping.ts` | map-lookup.md (historical) + code docs |

**Cross-cutting rules (quick recall):**
- **Rhythm tokens** (§1.4): `loose` 24 (header→content) / `tight` 12 (positions→strip→legend) / `region` 16 (legend→list). Never raw numbers between regions.
- **Card type scale** (§1.5): labels `text-xs tracking-wider`; values `text-sm tabular-nums`; ONE size per row, hierarchy by color.
- **Tone scale**: `foreground` (values) → `muted-foreground` (labels/keys) → `muted-foreground/60` (disabled: `—` nulls, `// title_pending`) → type-color at 0.45 (the `#` prefix in list rows). `—` is the universal null, always disabled tone.
- **Vocabulary**: "sections" never "arcs"; `manga_only` for the hatch; `anime_only` solid purple (canon to the show).
- **Focus scope**: width-lock and derived-dimming exist ONLY while a field is focused; blurred = data mode.
- **Disclosure**: chevrons rotate in fixed square boxes; hover-appended commands are literal inline text (real mono spaces), never flex-positioned.
- **Interior dividers**: none — spacing only (§1.4).

**Known open items (not blockers):**
- 4 anchor-shadowed estimated rows catalog-wide (episode-list.md §10) — real fix is anchor-aware interpolation when AniList data lands.
- `EpisodeBadge` → migrate remaining usages to `TypeBadge`, then delete.
- AnimeDetail page still uses pre-merge patterns (own totals/inputs, text legend) — reconcile with the card system in the polish pass.
- Strip double-height (`h-3`) is a trial; needle overhang & zone tint may want tuning with it.
- Aesthetic/UI exploration pass for the whole expanded card: NOT started (deliberately).
