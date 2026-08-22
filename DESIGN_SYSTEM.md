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

**Interior dividers ruling (2026-08-19):** dashed borders frame *containers and controls* — they are **not** used as horizontal dividers between data regions inside a card. Separation inside a card is **spacing only**, via the **card rhythm tokens** (index.css → tailwind `spacing`): `--space-loose` (1.5rem — the card header/title block → its content), `--space-region` (1rem — between content regions: legend → episode list) and `--space-tight` (0.75rem — pairs that read as one unit: positions → strip, strip → its legend). Applied as **per-seam `mt-*` utilities** (`mt-region`, `mt-tight`), not a uniform column gap. Never raw spacing numbers between card regions. **Label seams (2026-08-21) — the scale's bottom step:** `--space-label` (0.25rem, `mb-label`) between an icon+label caption and the single line it labels (anime/manga → their values); `--space-label-block` (0.5rem, `pb-label-block`) between a block label and the frame it captions (`episode_list` → the list) — a label over a whole frame earns 2×. Labels always sit closer to their content than any region seam (proximity), but never tighter than 4px.

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
| `.animate-row-pulse` | EpisodeList row highlight after a lookup/strip-driven jump (**amber @ 18%** → transparent, 0.9s ease-out; off under reduced motion). interior_v1 ruling: the flash is AMBER — the one accent with no status/focus semantics | ✅ |
| `.section-band-*` | interior_v1 banded section headers: the section's type color washed over the OPAQUE card surface (sticky headers must occlude scrolling rows — tint is composited, never transparent); manga_only wears its own purple (2026-08-21) | ✅ new |

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

5. **List entrance stagger** — rows fade + rise 8px, 250ms easeOut, delay `min(index,10) × 40ms`. *Superseded on the homepage (2026-08-19) by the CatalogField decode-in (№12); pattern remains valid for other lists.*
6. **Strip reveal** — MappingStrip scales X from 0 origin-left on scroll-into-view, 500ms easeOut, once.
7. **Terminal loading pulse** — `> fetch_series() ...` opacity 0.35↔1 mirror loop, 600ms (Index, AnimeDetail).
8. `MotionConfig reducedMotion="user"` wraps the app ([src/App.tsx](src/App.tsx)) — transforms drop, opacity stays, for reduced-motion users.
9. **Disclosure chevron rotate-in-place** — 150ms transform on a fixed square flex-centered box (EpisodeList section markers). Rule: a disclosure marker must rotate/swap inside a square centered box, never a tall inline text box (rotating the text box swings the glyph off its own center).
10. **Row pulse** — after a lookup/strip-driven jump, the landed row flashes via `.animate-row-pulse`: an absolutely-positioned overlay fading **opacity** 1→0 over 0.9s (compositor-friendly; never animate background-color for this). Off under reduced motion.

### Motion vocabulary added with the catalog field (2026-08-19; contract: docs/components/catalog-field.md)

11. **The field ramp** — one rAF pass writes opacity/tracking/weight per visible row from distance-to-focus; emphasis reads a lerped scrollTop (lag 0.4) so the highlight *chases* the focus. The loop sleeps when idle; direct DOM writes, never React state per frame.
12. **Decode-in** — on filter change and first load, visible titles scramble through terminal glyphs, 240ms with a 12ms/row cascade; the match highlight ignites on resolve. Event-scoped, never continuous (the taste line). Off under reduced motion.
13. **Glyph push** — the watermark letter re-enters via `.animate-glyph-push` (260ms rise + fade to its resting opacity-5) on letter change.
14. **Takeover choreography** — glide (distance-proportional, ≤600ms, never opens mid-motion) → settle 320ms → grow-from-row-line 360ms (close 220ms); already-focused click opens instantly; closing re-centers the opened title.
**SYNTAX_V1 — the episode-type palette (2026-08-21, supersedes forest_v1 same day — Sean returned to the terminal-syntax look after seeing forest in situ).** Dedicated `--type-*` tokens: canon `199 72% 62%` cyan · mixed `38 80% 62%` amber · filler `330 62% 64%` rose · anime `256 62% 64%` purple · manga `147 55% 36%` deep green (the hatch/band/chip hue; manga keeps its OWN token — the shares-canon ruling stays reversed). Validator-tuned from the original syntax hues, which failed raw: manga green darkened to L36 (amber↔green protan ΔE was 4.9), anime purple pulled to 256 (purple↔rose normal floor was 12.2). All 10 pairs machine-validated: worst CVD ΔE 9.6, zero warnings — beats forest_v1's 9.2 floor. DOCUMENTED DEVIATION: brighter than the dataviz lightness band (punchy strip fills are the point — standing ruling). Values sit near the syntax family but are deliberately dedicated tokens (semantic colors stay reserved: accent = airing, amber = flash fallback, destructive = error). forest_v1 (`160/22/324/204/276`) retired but recorded in the Type Palette Lab `73f5e5d2`. **Ruling: episode-type encodings use ONLY `--type-*` / `bg-type-*` / `text-type-*` — never the semantic colors** (accent = airing, amber = jump-flash, destructive = error; the old palette borrowed all three and failed protanopia). 24 candidate schemes validated in the lab; rejected finalists and verdicts recorded there.

**INTERIOR_V1 (Card Interior Lab `1ce0113c`, locked 2026-08-21)** — the card's interior regions, one ruling set: **position row** — totals at full foreground (confirmed 2026-08-21, supersedes the lab's denominator dim at `/40`; the ` · ` separator keeps `/40`); **input keys (2026-08-21): Enter = confirm = click-out** (values commit live via the driver model, so confirming just blurs — underline/steppers drop, keys return to the global walker) and **Esc = UNDO to the pre-focus snapshot** (the whole exploration state driver+raw, captured on focus — may restore another field's exploration, never jumps to rest; `// reset()` stays the explicit full reset; an intent flag keeps the blur handler's empty-field reset from stomping the restore); **strip** — 18px tall (h-3 trial resolved upward), **chapter-bar layout model** (final 2026-08-21, YouTube-chapters reference): every segment ≥2px paint (nothing sub-pixel), 1px gaps between ALL segments, and interaction decoupled from paint — pointer hit-tests the painted segment and maps within its unit range (gaps snap to nearest, never targets), needle/band placed by the exact inverse so indicators sit inside paint. Two invariants added 2026-08-21 after the ep_336/382 triage: (a) the layout is **pixel-snapped** (cumulative boundaries rounded) so every gap is exactly 1 crisp device px, and (b) the 2px **indicator ticks (needle + hover ghost) clamp inside their segment's paint** (center ∈ [x+1, x+w−1] — video-player playhead rule; a segment's first/last episode centers <1px from the boundary and would otherwise bleed into the gap). The ghost previews the exact episode a click would select (pointer→unitAt→tickX), not the raw pointer px. Rejected en route: flex-gap (grid drift), in-cell borders (ate sub-pixel spans), flush-no-gaps; **TypeBadge** — TINT CHIP (trial 2026-08-21): type color over its own /0.12 wash, radius token, no border — same tint grammar as the section bands (supersedes naked tags, which superseded brackets; hidden state = fade to 40%); **section headers carry no tag** — the band color + colored marker ARE the type, and the header range aligns number-over-number with the rows' #ep column (adaptive badge column retired); **manga_only wears its own purple** (`--type-manga`, 2026-08-21 — reverses the earlier shares-canon ruling; hatch, band, and chip all draw from it); **episode list** — hover = neutral bg step, selected = bg step + 2px TYPE-colored inset rail (never zebra), section headers = type-tinted bands (`.section-band-*`), jump flash = TYPE-colored (amber only as no-context fallback); **toggle scroll clamp** (2026-08-21) — toggling a section you're scrolled past clamps `scrollTop` to the header's natural offset (iOS grouped-list / VS Code tree rule): close lands the closed header pinned at the top instead of jumping to arbitrary later content, open shows the new rows under the clicked header; mid-list toggles (header below frame top) are untouched; **scroll anchoring, reimplemented** (2026-08-21) — native overflow-anchor keeps an anchor NODE still when content inserts before it, but virtualized rows opt out, so we supply the rule, by walk direction: **UP** — the landed row is the block's LAST row, so pinning the user's focus (full inserted height compensated before paint, even when the collapsed header was visible in-frame; the walk's explicit direction marks it) unfolds the whole block above the frame with zero extra motion. **DOWN** — the landed row is the block's FIRST row; minimal scroll only, and the rows appearing beneath it ARE the section visibly opening (same as clicking its header). Forcing the down-unfold below the fold ('end' bottom-snap) was tried and REJECTED 2026-08-21 — it teleports the view on mid-frame crossings; minimal motion beats off-screen unfolding when the two conflict. Other expansions (expand_all while scrolled) anchor insertions above the viewport top; all computed from the fixed HEADER_H/ROW_H geometry, never measured; **component-owned scroll** (2026-08-21) — selection scrolls set `scrollTop` from that same geometry, NEVER `virtualizer.scrollToIndex` (the virtualizer's internal offset only syncs on scroll events, so in the frame of an anchoring compensation it is stale and computes wrong absolute targets — the root of the expand-above jump); the virtualizer is purely a render window, and its scroll listener flushSyncs the window pre-paint so direct scrollTop writes are exactly as safe as its own API; compensation + selection scroll run as consecutive layout effects → one painted frame, no intermediate state; **keyboard handoff by explicit intent** (2026-08-21) — ONLY a strip click hands the keyboard to the list (arrows/jk walk from the landed episode as if the row were clicked): the lookup bumps a monotonic `jumpSerial` in `stripClick` and the list focuses when it changes. Field typing/stepping in the position row also moves the selection but NEVER steals focus — intent travels as an explicit signal from the source, never inferred from selection changes or `document.activeElement` sniffing. **Global selection walking** (2026-08-21, Gmail/Linear list-shortcut pattern): while a selection exists, ↑/↓ (and j/k) walk episodes from a document-level listener no matter where focus sits — editable controls always win (typing/stepping never walks); with NO selection (card just opened, or after `reset()`) the first press **seeds from the rest position** — ↑ lands rest−1, ↓ lands rest+1 (`lookup.restEp`; Sean 2026-08-21 — exploration starts without touching an input/row/strip; keys-stay-native and the list-frame edge-seed survive only as no-rest fallbacks). Rejected: dot chips, reverse-video selection, strip scale-ticks, strike-through hidden state.

**INTERACTION GRAMMAR (2026-08-21) — the app-wide keyboard laws.** These are laws, not per-surface choices; every new surface adopts them:
1. **Esc layering**: the innermost consumer owns Esc and `stopPropagation()`s it; each press peels ONE layer. When a takeover card is open, Esc belongs to the CARD everywhere (even inside the search input — it declines and lets it bubble; the query survives). The homepage ladder: card open → close card · search text → clear, stay active · search empty → blur · (in a card input: Esc = undo to pre-focus snapshot, then the next Esc closes the card).
2. **Enter = confirm = click-out** in live-committing inputs (driver model): confirming just blurs. On the homepage, Enter opens the focused catalog row from anywhere (rows/buttons keep their native Enter).
3. **Intent travels as explicit signals, never inference**: strip→list keyboard handoff = `jumpSerial` bumped only by `stripClick`; Esc-undo's blur = `escapingRef`; walk-direction anchoring = the key handler's own `dir`. Never sniff `document.activeElement` or infer from state diffs.
4. **One hold-pacing token** (`src/lib/hold.ts`: 400ms then 130→80→40): position steppers (pointer hold) and catalog ↑/↓ walking (own timer chain, `e.repeat` ignored) share it — keyboard and pointer holds feel identical everywhere.
5. **Global walkers defer to editables and to the layer above**: EpisodeList's ↑/↓+j/k walk from anywhere while a selection exists (editables win; `reset()` returns keys to native); CatalogField's ↑/↓/Enter walk/open while no card is open (the search input counts as walkable — its arrows have no vertical meaning); ⌘K/ctrl K activates search from anywhere; ←/→ with a query and focus elsewhere recall the search caret one glyph.

15. **Card print entrance (instrument_v1, 2026-08-20)** — inside the growing takeover, the card's regions PRINT like terminal output: `.card-print [data-line]` pops (opacity steps, NO easing/slide) at `200ms + line × 35ms`, path bar first, episode list last. One property, stepped delays — program output, not webpage animation. Off under reduced motion.

### Rules going forward

- New animation goes through **motion** (`motion/react`) and must pass the motion skill's logic checks (the global `~/.claude/skills/motion` audit) before it ships. Terminal vibe rules the aesthetic: motion should feel like a terminal rendering output — quick, precise, no bouncy overshoot.
- ~~Fix on sight: getElementById classList hover swaps · blink keyframe duplicate~~ — both verified already gone (phase-0 salvage); struck from the watchlist by the 2026-08-21 audit.

**MOTION AUDIT (2026-08-21, Phase C — PASSED):** runtime (motionscore on the homepage) + full static sweep against §2. **Desktop: everything S** (compositor). Three **documented D-tier acceptances**, each with its named escape hatch: (1) the field ramp's letter-spacing/weight writes (№11) — the contract's own "first dials to sacrifice"; the runtime audit grades mobile `anim F` from letterSpacing, so the device pass drops the tracking/weight ramps on coarse-pointer/mobile (logged in the §6 backlog); (2) the takeover grow (№14) animates top/height by design — bounded-D (ONE element, geometry pre-solved, zero per-frame reads, 360ms one-shot); an S-tier rewrite is recorded (final-geometry overlay + translateY + clip-path inset reveal, visually identical) — take it only if profiling ever shows jank; (3) About's max-width slide-in hints (№3) — sanctioned vocabulary, tiny hover-scoped elements. **Fixed in the audit:** SearchBar's two `transition-all` narrowed to `transition-transform` / `transition-[border-color,box-shadow]` ("all" silently animates layout props). **Noted, unfixed (low):** ~3 forced style recalcs during the field engine's mount — one-time setup, not per-frame. **Reduced motion verified end-to-end:** `MotionConfig reducedMotion="user"` + per-keyframe RM blocks (card-print, row-pulse, glyph-push) + the engine's RM paths (no lag/decode/glide — contract §5) + `motion-reduce:transition-none` on hover reveals; the loading pulse deliberately stays for RM users (meaningful activity signal, opacity-only, <1 flash/s).

---

## 3. Component inventory

### 3.1 App components ([src/components/](src/components/))

| Component | Status | Notes for the new list-first concept |
|---|---|---|
| `Header` | ✅ | Signature staggered logo. Keep. |
| `SearchBar` | ⚠️ | Debounced, ref-exposed focus. **No longer on the homepage** (replaced by the field's inline `grep:` input, 2026-08-19); still available for other surfaces. |
| `CatalogField` | ✅ new | **The browse instrument (2026-08-19)** — the homepage: every series as a title row under the **traveling focus law** (`FOCUS_LOCK 0.36` — focus rides the first row, migrates 1:1, locks; last row rests AT the lock; every rule — fades, falloff, runway, chrome anchor, targeting — derives from the lock, frame, and real viewport, never one-off), flat_basis_v1 treatment untouched; status meta at focus; decode grep with match highlight; watermark + overflow-column A–Z rail; takeover_v1 expand-in-place. Frame = fill_offset under the icon search line (96/64). **Full contract: [docs/components/catalog-field.md](docs/components/catalog-field.md).** |
| `AnimeCard` | 🚧 | **Expanded variant: functionality-complete (2026-08-19), skin = INSTRUMENT_V1 (2026-08-20, Card Skin Lab a3222c3b)** — see §7 for anatomy. Skin rulings: SOLID `border-strong` (dashed = list vocabulary, solid = the focused instrument; token 26% vs border 25%); surface = `--card` 10% (+2% step, Sean's retune 2026-08-21; the lab originally locked +3% = 11%, 1% trialed and rejected); NO shadow (flat, Berkeley school — separation = surface + border + dimmed field); **path bar** window chrome (`~/catalog/{id}` muted + bare `x` 13px — close finally lives IN the card); **identity BAND** (2026-08-20): 104px 2:3 bordered poster stamp left (art shown AS-IS — duotone+hover-reveal shelved until real AniList art) + glowing title (`.title-glow` @0.2, the card's ONE phosphor accent) at **18px = the field's TEXT_PX** (title-seam ruling 2026-08-21: the takeover morph keeps the title's SIZE; the hue change stays semantic — cyan = transient focus in the field, green glow = string-value content at rest) / `jp · years` beside it + `StatusChip` far right; gap ruling: stamp→titles gap = readout edge padding (`gap-4` = `p-4`); the instrument runs FULL-WIDTH below the band (left rail column deleted); print entrance (№15, lines 0–5). Hosts `usePositionLookup` + filter state as before. |
| `MangaMappingDisplay` | ✅ | Episode→chapter row (detail page). Re-skinned onto the card grammar (2026-08-21, EpisodeBadge retirement): `TypeBadge` type token, `#1` never `#0001`, muted-key/foreground-value `vol:`/`ch:`, `—` universal null for filler/anime-only manga positions. |
| `Kbd` | ✅ new | **THE keycap — kbd_v4: `tonal` (locked + confirmed 2026-08-21; Keycap Lab `ea48caa3`)**: gray-alpha fill (`muted-foreground/[0.16]`), NO border, 4px radius; **three tiers via the `tier` prop** — `lg` 22px (trigger/empty-state hints) · `md` 18px (rows/menus, DEFAULT) · `sm` 14px (footer legends). Per-glyph optical sizing inside the component (symbols +2px, word keys −1px + tracking; each size string carries its own `leading-none` — tailwind-merge deletes a leading that precedes a later `text-[..]`, the glyph-seats-low bug); 1px downward nudge; grid centering. Chord gap = `gap-1` at call sites. Runner-up recipe: vscode. Hotkey hints always use this — never restyle at a call site. Used: homepage search hint (empty+inactive only). |
| `MinimapToggle` | ✅ new | The strip viewband's on/off control — **bare_miniature** (Minimap Toggle Lab `ae6bae37`, picked 2026-08-21): drawn 28×6 track, band 26–64% left-of-center, flush height, 1px radii, no wash, no word — the control is a picture of its state (on: band; off: no band, track dimmed). Ships with `useMinimapPref` (localStorage `mm:minimap`, shared across cards, private-mode safe). Seat: the legend line's LEFT slot — view chrome, never a TypeBadge (badges hide data, this hides chrome). Contract: episode-list.md §6. |
| `StatusChip` | ✅ new | A status is a STATE (instrument_v1). **PLAIN TEXT (2026-08-21; lineage: S2 tint → dot trial → plain):** just the colored word, no wash, no dot — the tint-chip grammar belongs to the legend's interactive filters; placement (top-right of the identity band) + the status hue carry the state. airing accent / hiatus amber / terminal muted. **One register (Sean's max-consistency ruling, 2026-08-21): 12px `text-xs`, no tracking, every seat** — the homepage row meta is the reference; the card's identity band and the detail cover match it exactly (the old 10px tracked base retired). Still the one component for every airing-status render (the treatment lives here, not at call sites); seats may position, never restyle. |
| `MappingStrip` | ✅ new | **Whole-story** density strip — five states: canon (green) / mixed (amber) / filler (red) / anime_only (purple) as solid segments, plus **manga_only** (dimmed green 45° hatch) as the tail for published canon chapters the anime hasn't adapted (`mangaAheadUnits` in episode-equivalents keeps proportions honest). WAAPI scaleX reveal, optional `markerEpisode` indicator, optional `viewband` — the EpisodeList's visible slice as an **M1 fill-only** minimap band (no edge lines, chosen 2026-08-19; veil retuned 2026-08-21 to `foreground/45%` — the original 18% vanished against forest_v1's bright fills, and a muted mid-grey read as dimming; brighter won, alpha is the dial). Used in AnimeCard + AnimeDetail. |
| `TypeBadge` | ✅ new | **THE type-token treatment** — TINT CHIP (trial 2026-08-21; lineage: S2 tint boxes → brackets → naked tags → tint chip): type color over its own /0.12 wash (the section bands' tint grammar), radius token, `px-1 py-px`, no border; `manga_only` wears `--type-manga` purple. The badge is the **legend unit** — counts render inside it (dimmed, one size down) — and the **filter affordance**: clickable badges (`onClick`/`pressed`/`dimmed` props, real `<button>` + `aria-pressed`) work **click-to-hide** — everything selected by default, clicking removes that type from view; hidden badges dim to 40%. A badge with no data does not render (empty-state rule). Supersedes `EpisodeBadge` everywhere (retired + deleted 2026-08-21 — detail-page legend and MangaMappingDisplay ported). |
| `EpisodeList` | ✅ new | The full aired run inside the expanded card, grouped by **sections** (never "arcs") with sticky headers, type-colored chevron markers (A3), `expanded:# · collapsed:#` controls with the hover-append `⌄ all` / `› all` hints, three-way sync (rows ⇄ lookup ⇄ strip band), legend-as-filter (excluded sections drop from the list, excluded strip zones ghost in place, lookup never filtered), j/k walking over visible sections only, `@tanstack/react-virtual` windowing. **Full behavioral contract: [docs/components/episode-list.md](docs/components/episode-list.md).** |
| `InlinePositionRow` | ✅ new | **THE position instrument** ("Q1", 2026-08-19) — the totals row and the lookup merged: the current numbers ARE the inputs, totals static after the `/`, metadata (tag + `// reset()`) in-row right of the fields. Rest = the series' present position (dim strip marker); driver = last field touched; no channels, no pins (filler/manga_only positions render as `—` values); focus-only **width lock** (fields freeze at series-max digit widths while focused). **Full contract: [docs/components/position-row.md](docs/components/position-row.md)** (map-lookup.md kept as the historical derivation). Layered: pure math in `lib/mapping.ts` → state in `usePositionLookup` → `InlinePositionRow`/`StepperInput`/`MappingStrip`; the host (AnimeCard) owns the hook so row, strip, and episode list act as one instrument. |
| `StepperInput` | ✅ | **One input component, two skins** — `variant="box"` (details-page dashed box) and `variant="inline"` (the position-row skin: data at rest, dashed underline on hover/focus — never solid/primary, steppers take zero space until focus, ch-based width, neutral caret, no select-all). Component-owned steppers (▲▼, ↑/↓ + shift, wheel-when-focused, Esc) so every step path routes through the seeding logic; **hold-to-repeat with acceleration** (400ms → 130 → 80 → 40ms). Never fork the behavior — new looks are new skins. |
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
| `AnimeDetail` | 🚧 | Read-only mapping list is the core; `CollectionSection` gets deferred to phase 2. **Drift pass 1 ✅ (2026-08-21):** TypeBadge legend with counts + click-to-hide (mixed added; `= fml` explainers gone), stats + density header on the syntax_v1 `--type-*` tokens (pre-syntax_v1 accent/destructive/purple retired; filler stat's `ffff` placeholder → SkipForward icon), StatusChip on the cover, colon-tight `ep:1-N`, `#1` never `#0001`. Full layout rework still pending (phase-2 era page). |
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

*Agreed build order:* **(1) episode list inside the expanded card ✅ done.** **(2) collapsed catalog + expand-in-place ✅ done (2026-08-19)** — CatalogField shipped from three lab cycles (Rolodex → Expand → Row Meta & Grep); contract in docs/components/catalog-field.md. **(3) UI/aesthetic pass ← IN PROGRESS** — brief: *make the card feel like the catalog instrument*. **Phase A ✅ (2026-08-20, commit 51fef01): instrument_v1** — card surface/border-strong/no-shadow rulings, path-bar chrome, stamp identity band, StatusChip, print entrance (Card Skin Lab `a3222c3b`, 15 versions). **Phase B ⏳: interior polish** — position row / density strip / legend chips / episode list; research done (no-zebra + rail-selection consensus, GitHub strip gaps, Grafana tint-collapse chips, dim denominators, amber jump-flash) and exploration live in the **Card Interior Lab `1ce0113c`** (presets current/consensus/banded/tui; awaiting picks → interior_v1 → port). **Phase C ⏳ (opened 2026-08-21): cohesion** — EpisodeBadge retirement ✅ + AnimeDetail drift pass 1 ✅ (2026-08-21: TypeBadge legend, syntax_v1 type tokens, StatusChip, format fixes; full page rework rides with phase 2), field↔card harmony ✅ (2026-08-21: StatusChip unification in the field's row meta, contract un-staling, title-seam ruling — card title 18px = field TEXT_PX, hue change stays semantic; selection grammars documented as two deliberate registers — field = terminal cursor `> `+cyan, card list = type-colored editor rail), motion audit ✅ (2026-08-21 — audit record in §2: desktop all-S, three documented D acceptances with escape hatches, SearchBar transition-all narrowed). **PHASE C COMPLETE — the aesthetic pass (3) SHIPS.** Next: **(4) phase 2** — library, save/track, auth. **(4) then phase 2:** library, save/track, auth.

**Keycap Lab `ea48caa3` (2026-08-21, ✅ picked):** stop hand-rolling keyboard visuals — one lab to settle every key and control as a keycap. Eight presets over the full glyph inventory (modifiers/specials/arrows/letters), combo composition (per-key caps vs one-cap ⌘K vs spelled +), three size tiers, and in-context mocks (search line, command palette, card footer legend): `flat_v3` (current Kbd.tsx, Sean's Figma spec) / `tonal` (Linear·Raycast·shadcn) / `vscode` / `ledge_v1` / `bevel` (Radix classic) / `text` / `bracket` (TUI) / `inverse` (htop). Research consensus baked into its field_notes: per-key caps with plain gaps win; symbols on mac and words elsewhere, auto-swapped per platform; `⎋` is dead (write `esc`); one recipe tiered at three sizes; no press animation in chrome. **Ruling — kbd_v4 (2026-08-21, ✅ confirmed): `tonal` @ `md`, 4px gap** — gray-alpha fill (`muted-foreground/[0.16]`), NO border, 4px radius, 18px cap; glyphs 13px symbols / 11px letters / 10px tracked words, each size carrying its own `leading-none` (tailwind-merge deletes a leading class that precedes a later `text-[..]` — the lab-vs-live misalignment bug). Gap = `gap-1` at call sites (the industry chord gap). Picked after auditioning tonal/vscode/ledge_v1/bevel live on the search line with gaps dialed 6→4→2; **runner-up + first fallback: `vscode`** (alpha fill + hairline + 1px inset bottom ledge, 3px radius). Tier vocabulary for future registers: `lg` 22px/13px (trigger, empty-state hints) · `md` 18px/11px (rows, menus) · `sm` 14px/10px (footer legends, dense chrome).

**Minimap Toggle Lab `ae6bae37` (2026-08-21, ✅ picked + confirmed):** the band's on/off affordance — the first chip-miniature read as a bandaid (Sean). Sixteen candidates across five registers + a name axis (minimap/view/band/trace/viewband/lens), seatable live in a legend-line mock. **Ruling: `bare_miniature`** — the drawn strip alone in the legend's left slot, no wash, no word (sidesteps naming entirely; internal name stays minimap/viewband): on = band shown, off = band gone + track dimmed — the control is a picture of its state. Glyph anatomy (Sean's tuning walk: center → right → left+wider → proud 8px → 7px → flush): 28×6 track, band 26–64% (left-of-center — dead center reads as a logo mark), flush height, 1px radii; invisible button padding is the hit area. Rejected en route: `// minimap(on|off)` text, the TypeBadge-grammar chip (badges hide data, this hides chrome — shared form muddied the kinds). Shipped in [src/components/AnimeCard.tsx](src/components/AnimeCard.tsx).

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
- **Device/responsive pass — backlog (logged 2026-08-21, design later):** hotkey display is already OS-aware (`IS_MAC` sniff in [src/pages/Index.tsx](src/pages/Index.tsx): mac shows `⌘ K`, everything else `ctrl K` — windows/linux convention is ctrl+K; display-only, the handler accepts both modifiers). The eventual pass should also cover: touch devices (no hardware keyboard → hide keycap hints and the keyboard-walking affordances entirely), hover-dependent affordances (hover_command reveals need a touch fallback), and pointer coarseness on the strip's per-pixel hit-testing; mobile also drops the field's letter-spacing/weight ramps (2026-08-21 runtime audit: mobile `anim F` from letterSpacing — the contract's named first-sacrifice dial).

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
- **Rhythm tokens** (§1.4): `loose` 24 (header→content) / `tight` 12 (positions→strip→legend) / `region` 16 (legend→list) / `label` 4 (caption→its value line) / `label-block` 8 (block label→its frame). Never raw numbers between regions.
- **Card type scale** (§1.5): labels `text-xs tracking-wider`; values `text-sm tabular-nums`; ONE size per row, hierarchy by color.
- **Tone scale**: `foreground` (values) → `muted-foreground` (labels/keys) → `muted-foreground/60` (disabled: `—` nulls, `// title_pending`) → type-color at 0.45 (the `#` prefix in list rows). `—` is the universal null, always disabled tone.
- **Vocabulary**: "sections" never "arcs"; `manga_only` for the hatch; `anime_only` solid purple (canon to the show).
- **Focus scope**: width-lock and derived-dimming exist ONLY while a field is focused; blurred = data mode.
- **Disclosure**: chevrons rotate in fixed square boxes; hover-appended commands are literal inline text (real mono spaces), never flex-positioned.
- **Interior dividers**: none — spacing only (§1.4).

**Known open items (not blockers):**
- 4 anchor-shadowed estimated rows catalog-wide (episode-list.md §10) — real fix is anchor-aware interpolation when AniList data lands.
- AnimeDetail page still uses pre-merge patterns (own totals/inputs, text legend) — reconcile with the card system in the polish pass.
- Strip double-height (`h-3`) is a trial; needle overhang & zone tint may want tuning with it.
- Aesthetic/UI exploration pass for the whole expanded card: NOT started (deliberately).
