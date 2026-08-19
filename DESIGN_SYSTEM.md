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

`border-dashed` + `border-border` is the single most identifiable visual signature. Cards, buttons, inputs, section dividers, headers, footers, empty states — all dashed. Hover/active states may switch `border-dashed → border-solid` (`.cmd-button` pattern) or recolor to `primary`/`accent`.

### 1.5 Copy & microcopy conventions

The UI copy is written *as code*:

- Buttons/actions are function calls in snake_case: `sign_in()`, `add_series()`, `save_readers()`, `delete_series()`.
- De-emphasized/system text is a comment: `// no_source`, `// data_pending`, `// anime_original`, `// something(null)`.
- Command-style headers: `> command_name()`.
- Keys end with `:` and use snake_case: `last_updated:`, `title_jp:`.

**Rule:** any new label must pick one of these three forms (function call, `// comment`, `key:`). No Title Case marketing copy inside the app UI.

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
8. `MotionConfig reducedMotion="user"` wraps the app ([App.tsx](src/App.tsx)) — transforms drop, opacity stays, for reduced-motion users.

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
| `AnimeCard` | 🚧 | Two variants. **Expanded = "v1 refined_pane"** (chosen from the AnimeCard Lab explorations, 2026-08-18): plain title block, PositionLabel columns (canonical Tv/BookOpen icons), MapLookup instrument, whole-story density strip + legend. **Card navigation to the details page is disabled in browse mode** (2026-08-18) — clicking will become expand/collapse when the **compact** variant lands (see "v5 row_drawer"); details-page linking returns with the library/customization phase. `continue_from` removed from UI (data stays in the model). |
| `MangaMappingDisplay` | ✅ | Episode→chapter row. The heart of the read-only content. |
| `MappingStrip` | ✅ new | **Whole-story** density strip — five states: canon (green) / mixed (amber) / filler (red) / anime_only (purple) as solid segments, plus **manga_only** (dimmed green 45° hatch) as the tail for published canon chapters the anime hasn't adapted (`mangaAheadUnits` in episode-equivalents keeps proportions honest). WAAPI scaleX reveal, optional `markerEpisode` indicator. Used in AnimeCard + AnimeDetail. |
| `MapLookup` | ✅ shipped | The anime↔manga position instrument — **full interaction spec: [docs/components/map-lookup.md](docs/components/map-lookup.md)** (channels, driver/derived/pin, canon-aware filler-skip math, seeded stepping, carry, strip semantics, keyboard). Layered: pure math in `lib/mapping.ts` → state in `usePositionLookup` → presentation in `MapLookup`/`StepperInput`/`MappingStrip`; the **host component owns the hook** so inputs and strip act as one instrument. |
| `StepperInput` | ✅ new | Numeric input in the details-page format with **component-owned steppers** (▲▼ on hover/focus, ↑/↓ + shift, wheel-when-focused, Esc) — owned so every step path routes through the seeding logic. Native spinners disabled via `.no-spinner`. Reuse for any numeric field wanting step behavior. |
| `EpisodeBadge` | ✅ | canon/mixed/filler/anime pill. Clean, tokenized. `mixed` added (amber). |
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

*Progress (2026-08-19):* MapLookup instrument shipped and hardened (canon-aware math, source-scope model, pins, seeded stepping, directional integrity — spec: [docs/components/map-lookup.md](docs/components/map-lookup.md)); shared primitives shipped (PositionLabel, StepperInput, meta-row, canonical icons); card navigation disabled for browse mode.

*Agreed build order:* **(1) episode list inside the expanded card** — full-run scrollable list, fixed height, virtualized; account-free read-only. **(2) collapsed card state** + expand/collapse interaction. **(3) UI/aesthetic/interaction polish pass** + search & browse model (motion + d3-style visuals). **(4) then phase 2:** library, save/track, auth.

Design constraints:
- The list row/card is comparison-first: episode position vs manga volume/chapter alignment, filler density at a glance — not a generic anime card.
- **Homepage end-state (agreed 2026-08-18):** default view is a clean *compact list* of series (AnimeCard `compact` variant); clicking a row expands it in place to the `expanded` variant. Search filters the list (later: fuzzy matching with exact matches surfaced above fuzzy ones, shown as distinct sections). Scroll presentation lives in a fixed vertical range — futuristic hacker feel. Nail expanded first, then compact + search/scroll.
- **Position formatting rules:** `Tv` icon labels anime, `BookOpen` labels manga (lucide icons only, never emoji). Values are compact with **no spaces**: `ep:1122/—`, `vol:108/110 · ch:1092/1130` — never `ep_`/`vol_` underscore style, never `ep 1122 / —` spaced style. Label is just "manga", not "manga coverage". The colon-tight rule extends to strip legends: `canon:1024 · mixed:3 · filler:95 (8%) · manga_only:+38ch`.
- **Icon+label rows use `PositionLabel`** ([src/components/PositionLabel.tsx](src/components/PositionLabel.tsx)) — never hand-rolled. Its contract: (1) **icon size = 1em of the label type** (`w-3 h-3` = 12px beside `text-xs`) — larger icons read oversized against lowercase mono labels, whose visual mass is only the x-height band; (2) the icon box and the text line box are the **same height** (`leading-3` = 12px), so `items-center` aligns two equal boxes and alignment cannot drift; spacing is `gap-1.5`; states are `active` (text cyan + icon primary) and `iconActive` (icon primary only). No positional nudges, ever — if a glyph reads unbalanced, fix the artwork itself. **Canonical watch/read glyphs live in [src/components/icons.tsx](src/components/icons.tsx)** (chosen via icon fit test, 2026-08-18): `TvIcon` = lucide tv with art shifted up 2 units in its frame; `BookOpenIcon` = lucide book-open shifted down 2 units. Always import these from icons.tsx — never raw lucide `Tv`/`BookOpen`. Adopted across AnimeCard, AnimeDetail, CollectionSection, SeriesCard.
- **The meta-row contract (alignment rule):** any line mixing tags, values, and actions (lookup results) uses **ONE font size for every child — hierarchy inside a line is expressed by COLOR, never by size.** Size tiers exist *between* component types (labels `text-xs`, body/meta `text-sm`, strip captions 10px), never within a single line: mixing sizes in a line is what creates baseline-balancing problems in the first place. The `.meta-row` utility ([index.css](src/index.css)) enforces the rest: baseline alignment, `align-content:center`, gap-only spacing, `line-height:1` on children, plus a **baseline strut** (flex rows lack block layout's built-in font strut) as defense-in-depth so the line's position stays fixed regardless of content. Use the utility, never re-implement.
- **Result metadata format:** tag-first, no `//` on position tags, `→` after the tag: `canon → vol:108 · ch:1092`. The hatch state is named `manga_only` everywhere (result tags, legends, tooltips) — one vocabulary. `// out_of_range (…)` keeps its comment prefix (system message, not a position tag). No `~` on estimates — approximation is assumed; when an episode covers multiple vols/chapters use commas + ranges (`vol:1,2 · ch:8-12,14`).
- **The position lookup** is the card's core interaction — two channels (ep ⇄ vol.ch), click-the-strip-to-set, canon-aware filler-skip conversion, seeded stepping, pin/carry. Full behavioral contract: [docs/components/map-lookup.md](docs/components/map-lookup.md).
- **The strip shows the whole story, not just the anime run:** the `manga_only` hatched tail represents published canon the anime never adapted, so users see at a glance how much of the collection actually got animated. (Future data upgrade: manga_only gaps can also appear *before or between* adapted spans, not just as a tail.)
- **The source-scope rule (data modeling):** a series entry adapts a **range** of the source, never "the whole franchise." Distinct series are separate entries — Naruto (Part I: vol 1-27 / ch 1-244) and Shippuden are never lumped; Part II is NOT Naruto's manga_only tail. Seasons within one continuous run stay cohesive as one entry. Sequels starting mid-manga carry `mangaStartVolume`/`mangaStartChapter` (Bleach TYBW: vol 55 / ch 480) so estimates map correctly and pre-scope chapters answer `// out_of_range (ch 480-686)` — they belong to the predecessor's entry. All lookup math, stepping bounds, and the manga_only tail are scope-aware.
- **First-class empty states**: most series have no filler and some have no manga source. `// no_source` / no-filler must look intentional, not broken.
- **Injectable catalog data source**: build against an interface so mock data swaps for AniList API (catalog) + a periodic scrape/custom API of animefillerlist/animefillerguide (filler data) without touching components. No component imports `mockAnime.ts` directly by the end of this phase.

**Phase 2 — accounts & library.** Curate favorite series; manage manga reader sites (the pain: dead mirrors, long/nested URLs, scattered bookmarks). Interactions should feel near drag-and-drop: easy add/remove series and readers, quick vol/chapter updates, easy link swaps when a mirror dies. AniList manga lists as default readers + user custom readers. Rebuild the current manual forms (CollectionSection, New*Forms) on the documented components; consolidate the still-duplicated reader-URL rewriting, `readerOptions` memo, and assignment diff-and-save logic when these are reworked.

**Later (only after the above):** light novels and other source material.
