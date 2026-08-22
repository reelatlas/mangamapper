import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  useVirtualizer,
  defaultRangeExtractor,
  type Range,
} from '@tanstack/react-virtual';
import { ChevronRightIcon, ListIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { EpisodeType } from '@/types/anime';
import type { EpisodeRow, EpisodeSection } from '@/lib/mapping';

// ─────────────────────────────────────────────────────────────────────────────
// EpisodeList — the full aired run inside the expanded card, grouped by its
// filler/canon SECTIONS (never "arcs" — those are story arcs).
// Behavioral contract: docs/components/episode-list.md
//
// - virtualized (@tanstack/react-virtual), fixed row/header heights
// - sticky section headers: the active section's header stays pinned, so rows
//   never lose their type context (headers carry the type; rows carry none)
// - three-way sync: rows route into the lookup via onSelectEpisode (same
//   semantics as a strip click at that unit); the lookup's result drives
//   selection + scroll back in via selectedEp; scrolling reports the visible
//   episode range for the strip's minimap band
// ─────────────────────────────────────────────────────────────────────────────

// Fixed geometry — the virtualizer never measures. Header/row heights are
// forced via inline style so estimate and reality cannot drift.
const HEADER_H = 30;
const ROW_H = 28;

// COLUMN ALIGNMENT CONTRACT (derived from header geometry, not eyeballed):
//   header: pad 0.3rem + marker 0.8rem + gap 0.6rem → ep:range
//   rows:   indent 1.7rem (= 0.3+0.8+0.6) → #ep gutter → gap 0.6rem → title
// The rows' `#` shares its left edge with the header's `ep:` token
// (edge-over-edge, 2026-08-21 — supersedes the badge-era 2.15rem indent).
// The #ep gutter is sized like an editor line-number gutter: (digits of the
// series' max episode + 1)ch — mono + tabular-nums make every glyph exactly
// 1ch, so `#` forms a solid rail and the digits start dead vertical.
// Left-aligned: episode numbers are identifiers, not quantities.
const ROW_INDENT = 'pl-[1.7rem]';
const MARKER_BOX = 'w-[0.8rem] h-[0.8rem]';

const MARKER_COLOR: Record<EpisodeType, string> = {
  canon: 'text-type-canon',
  mixed: 'text-type-mixed',
  filler: 'text-type-filler',
  'anime-only-canon': 'text-type-anime',
};

// # symbol = disabled tone OF the section's color; the number = full color
const HASH_COLOR: Record<EpisodeType, string> = {
  canon: 'text-type-canon/[0.45]',
  mixed: 'text-type-mixed/[0.45]',
  filler: 'text-type-filler/[0.45]',
  'anime-only-canon': 'text-type-anime/[0.45]',
};
const NUM_COLOR: Record<EpisodeType, string> = MARKER_COLOR;

// selection rail wears the row's TYPE color (Sean's ruling 2026-08-21 —
// cohesion with the strip/tags beats the generic primary)
const RAIL_COLOR: Record<EpisodeType, string> = {
  canon: 'shadow-[inset_2px_0_0_hsl(var(--type-canon))]',
  mixed: 'shadow-[inset_2px_0_0_hsl(var(--type-mixed))]',
  filler: 'shadow-[inset_2px_0_0_hsl(var(--type-filler))]',
  'anime-only-canon': 'shadow-[inset_2px_0_0_hsl(var(--type-anime))]',
};
// …and so does the jump flash (same ruling): the pulse washes the row in its
// own type color (--pulse-color feeds .animate-row-pulse in index.css)
const PULSE_COLOR: Record<EpisodeType, string> = {
  canon: 'hsl(var(--type-canon) / 0.18)',
  mixed: 'hsl(var(--type-mixed) / 0.18)',
  filler: 'hsl(var(--type-filler) / 0.18)',
  'anime-only-canon': 'hsl(var(--type-anime) / 0.18)',
};

// interior_v1 banded section headers (index.css); manga_only wears its own
// purple band (2026-08-21, reverses the earlier shares-canon ruling)
const SECTION_BAND: Record<string, string> = {
  canon: 'section-band-canon',
  mixed: 'section-band-mixed',
  filler: 'section-band-filler',
  'anime-only-canon': 'section-band-anime',
  manga_only: 'section-band-manga',
};

type ListItem =
  | { kind: 'header'; section: EpisodeSection }
  | { kind: 'row'; row: EpisodeRow; sectionIndex: number };

// section coverage label: whole volumes, no partial marking; — is the null.
// Numbers are ALWAYS the normal text color, collapsed or open (CONFIRMED
// ruling 2026-08-21 — supersedes the interior_v1 "engaged" brightening that
// kept collapsed numbers muted); labels stay muted (key:value grammar).
const coverageLabel = (s: EpisodeSection) => {
  if (s.chStart === null || s.chEnd === null) {
    return <span className="text-muted-foreground/60">—</span>;
  }
  const num = 'text-foreground';
  const vol =
    s.volStart !== null
      ? s.volEnd !== null && s.volEnd > s.volStart
        ? `${s.volStart}-${s.volEnd}`
        : String(s.volStart)
      : null;
  const ch = s.chEnd > s.chStart ? `${s.chStart}-${s.chEnd}` : String(s.chStart);
  return (
    <span>
      {vol !== null && (
        <>
          vol:<span className={num}>{vol}</span> ·{' '}
        </>
      )}
      ch:<span className={num}>{ch}</span>
    </span>
  );
};

interface EpisodeListProps {
  rows: EpisodeRow[];
  sections: EpisodeSection[];
  selectedEp: number | null; // from the lookup result (hatch → last aired ep)
  // strip→list keyboard handoff: the lookup bumps this ONLY on a strip click
  // (never on field typing/stepping — those must keep the input's focus);
  // the list focuses its scroll frame when it changes
  jumpSerial?: number;
  // rest-position seed for reset-state walking (2026-08-21): with no
  // selection, ↑/↓ start exploring at restEp±1 instead of no-op'ing
  restEp?: number | null;
  interactive: boolean;      // false when the lookup is disabled (no source/mapping)
  onSelectEpisode?: (ep: number) => void; // routes into lookup.stripClick(ep)
  onVisibleRangeChange?: (range: { start: number; end: number } | null) => void;
}

export const EpisodeList = ({
  rows,
  sections,
  selectedEp,
  jumpSerial,
  restEp,
  interactive,
  onSelectEpisode,
  onVisibleRangeChange,
}: EpisodeListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set());
  const [pulse, setPulse] = useState<{ ep: number; n: number } | null>(null);
  // which interaction produced the next selectedEp change: rows/keys must not
  // recenter the list the user is already looking at
  const interactionRef = useRef<{ ep: number; kind: 'click' | 'key'; dir?: number } | null>(null);
  // jump placement: 'jump' = lookup/strip-driven → row lands at the TOP of
  // the frame, directly under the sticky header (via scrollPaddingStart) —
  // maximum forward context ("continue from here"). 'auto' = j/k walking →
  // minimal scroll only. (Trialing top; a scrolloff-style 3rd-position
  // variant is the fallback if top feels abrupt.)
  const pendingScrollRef = useRef<{ ep: number; align: 'jump' | 'auto'; pulse: boolean } | null>(null);

  // rows' #ep gutter — editor-gutter sizing (see the alignment contract):
  // hash + the series' max episode digits (ep numbers are 1..rows.length)
  const enoStyle = { width: `${String(Math.max(rows.length, 1)).length + 1}ch` };

  const items = useMemo<ListItem[]>(() => {
    const out: ListItem[] = [];
    for (const s of sections) {
      out.push({ kind: 'header', section: s });
      if (open.has(s.index)) {
        for (let ep = s.start; ep <= s.end; ep++) {
          out.push({ kind: 'row', row: rows[ep - 1], sectionIndex: s.index });
        }
      }
    }
    return out;
  }, [sections, rows, open]);

  const headerIndexes = useMemo(
    () => items.reduce<number[]>((acc, it, i) => (it.kind === 'header' ? (acc.push(i), acc) : acc), []),
    [items],
  );

  // sticky-header pattern: keep the active section's header mounted and pinned
  const activeStickyRef = useRef(0);
  const rangeExtractor = useCallback(
    (range: Range) => {
      activeStickyRef.current =
        [...headerIndexes].reverse().find((i) => range.startIndex >= i) ?? 0;
      return [...new Set([activeStickyRef.current, ...defaultRangeExtractor(range)])].sort(
        (a, b) => a - b,
      );
    },
    [headerIndexes],
  );

  // Jump placement clamps naturally (user ruling, 2026-08-19): a jump scrolls
  // the row to the top WHEN there is enough content below; near the end the
  // scroll stops at its natural limit and the selection simply sits lower in
  // view; a fully-visible list never scrolls — selection only. No artificial
  // overscroll space.
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (i) => (items[i].kind === 'header' ? HEADER_H : ROW_H),
    overscan: 8,
    // no scrollPaddingStart: selection scrolls are component-owned
    // (applyScroll) — the virtualizer only windows the rendering
    rangeExtractor,
  });

  // item identities shift when sections expand/collapse — drop the size cache
  useEffect(() => {
    virtualizer.measure();
  }, [items, virtualizer]);

  // a header's natural flow offset — computable exactly because geometry is
  // fixed (HEADER_H / ROW_H, no measuring); only sections ABOVE it contribute
  const headerOffset = (index: number) => {
    let y = 0;
    for (const s of sections) {
      if (s.index === index) break;
      y += HEADER_H + (open.has(s.index) ? s.count * ROW_H : 0);
    }
    return y;
  };

  const toggleSection = (index: number) => {
    // Toggling a section you're scrolled past (its header stuck or above the
    // frame) clamps scroll to the header's natural offset — the section you
    // just toggled lands at the top of the frame. Close: without this the
    // browser keeps scrollTop while the rows vanish, landing the view on
    // arbitrary later content with a DIFFERENT header suddenly pinned (the
    // iOS grouped-list / VS Code tree rule). Open: the new rows must appear
    // under the header you clicked, not above the viewport. Mid-list toggles
    // (header below the frame top) are naturally untouched by the clamp.
    const el = scrollRef.current;
    const top = headerOffset(index);
    if (el && el.scrollTop > top) el.scrollTop = top;
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };
  const setAll = (openAll: boolean) =>
    setOpen(openAll ? new Set(sections.map((s) => s.index)) : new Set());

  // SCROLL ANCHORING, reimplemented (2026-08-21): the browser's native
  // overflow-anchor keeps an anchor NODE visually still when content is
  // inserted before it — but virtualized rows (absolutely positioned
  // transforms) opt out of it, so section expansion shoves the view. We
  // supply the same rule ourselves, before paint, computed from the fixed
  // HEADER_H/ROW_H geometry (never measured):
  //   · upward-walk auto-expand → the anchor is the user's FOCUS (the
  //     outgoing selection's section): compensate by the full inserted
  //     height, even when the collapsed header was visible in-frame
  //     (expandCompRef, set with the walk's explicit direction)
  //   · any other expansion (expand_all while scrolled) → anchor insertions
  //     above the viewport top
  // Collapses never reach this: a user collapse is the toggle clamp above,
  // and removals below the viewport need no anchoring. After the pin, the
  // pending selection scroll moves minimally as usual.
  const expandCompRef = useRef<{ index: number; rows: number } | null>(null);
  const prevOpenRef = useRef<ReadonlySet<number> | null>(null);
  useLayoutEffect(() => {
    const prev = prevOpenRef.current;
    prevOpenRef.current = open;
    const req = expandCompRef.current;
    expandCompRef.current = null;
    const el = scrollRef.current;
    if (!prev || !el) return;
    let y = 0; // offsets in the PREVIOUS geometry — where insertion happens
    let delta = 0;
    for (const s of sections) {
      if (open.has(s.index) && !prev.has(s.index)) {
        if (req?.index === s.index) delta += req.rows * ROW_H;
        else if (y + HEADER_H <= el.scrollTop) delta += s.count * ROW_H;
      }
      y += HEADER_H + (prev.has(s.index) ? s.count * ROW_H : 0);
    }
    if (delta > 0) el.scrollTop += delta;
  }, [open, sections]);

  // COMPONENT-OWNED SCROLL (2026-08-21): selection scrolls set scrollTop from
  // the list's own fixed geometry, never virtualizer.scrollToIndex — the
  // virtualizer's internal offset only syncs on real scroll events, so in the
  // same frame as an anchoring compensation it is STALE and computes a wrong
  // absolute target (the expand-above jump). The virtualizer stays a pure
  // render window; scrolling is ours. 'jump' pins the row at the top under
  // the sticky header; 'auto' scrolls minimally (scroll-into-view semantics).
  const applyScroll = useCallback(
    (p: { ep: number; align: 'jump' | 'auto'; pulse: boolean }) => {
      const el = scrollRef.current;
      if (!el) return;
      const idx = items.findIndex((it) => it.kind === 'row' && it.row.ep === p.ep);
      if (idx < 0) return;
      let top = 0;
      for (let i = 0; i < idx; i++) top += items[i].kind === 'header' ? HEADER_H : ROW_H;
      const pinnedTop = top - HEADER_H; // the row must clear the pinned header
      if (p.align === 'jump' || el.scrollTop > pinnedTop) el.scrollTop = pinnedTop;
      else if (top + ROW_H > el.scrollTop + el.clientHeight)
        el.scrollTop = top + ROW_H - el.clientHeight;
      if (p.pulse) setPulse((prev) => ({ ep: p.ep, n: (prev?.n ?? 0) + 1 }));
    },
    [items],
  );

  // ── lookup → list: selection, auto-expand, scroll, pulse ──────────────────
  useEffect(() => {
    if (selectedEp === null) return;
    const ia = interactionRef.current;
    interactionRef.current = null;
    const section = sections.find((s) => selectedEp >= s.start && selectedEp <= s.end);
    if (!section) return;
    // any pending list interaction suppresses the jump scroll — even when the
    // solver resolves a clicked row to a near neighbor (anchor-shadowed rows)
    const align = ia !== null ? (ia.kind === 'key' ? ('auto' as const) : null) : ('jump' as const);
    if (align !== null) {
      pendingScrollRef.current = { ep: selectedEp, align, pulse: align === 'jump' };
    }
    if (!open.has(section.index)) {
      // Walk-driven expansion, by direction (2026-08-21, after both were
      // tried the other way):
      // · UP: the landed row is the block's LAST row — pinning the user's
      //   focus (anchoring pass, full inserted height) unfolds the whole
      //   block above the frame with ZERO extra motion. The anchor is the
      //   focus NODE, not the viewport-top pixel (native scroll-anchoring
      //   semantics; a visible collapsed header must not disable it).
      // · DOWN: the landed row is the block's FIRST row — minimal scroll
      //   only ('auto'). The rows appearing beneath it ARE the section
      //   visibly opening (same as clicking its header); forcing the unfold
      //   below the fold ('end' align) was tried and rejected — it teleports
      //   the view when crossing mid-frame.
      if (ia?.kind === 'key' && ia.dir === -1) {
        expandCompRef.current = { index: section.index, rows: section.count };
      }
      setOpen((prev) => new Set(prev).add(section.index));
    } else if (pendingScrollRef.current) {
      // section already open — items won't change, scroll now
      const p = pendingScrollRef.current;
      pendingScrollRef.current = null;
      applyScroll(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reacts to selection changes only
  }, [selectedEp]);

  // strip → list keyboard handoff (ruling 2026-08-21): ONLY an actual strip
  // click hands the keyboard over — arrows/jk walk from the landed episode
  // exactly as if the row had been clicked. Field edits in the position row
  // also move the selection but must NEVER steal focus mid-typing, so this
  // keys off the lookup's explicit jumpSerial, not the selection change.
  const lastJumpRef = useRef(jumpSerial);
  useEffect(() => {
    if (jumpSerial === undefined || jumpSerial === lastJumpRef.current) return;
    lastJumpRef.current = jumpSerial;
    scrollRef.current?.focus({ preventScroll: true });
  }, [jumpSerial]);

  // deferred scroll: runs after an auto-expanded section's rows are in items.
  // LAYOUT effect, declared after the anchoring pass above so it runs second:
  // compensation + selection scroll land in the SAME painted frame — no
  // intermediate state ever reaches the screen.
  useLayoutEffect(() => {
    const p = pendingScrollRef.current;
    if (!p) return;
    pendingScrollRef.current = null;
    applyScroll(p);
  }, [applyScroll]);

  // ── list → strip: visible episode range for the minimap band ──────────────
  // Derived from the actually-rendered items (grouping-aware): an open
  // section contributes its visible rows; a collapsed header contributes its
  // whole range; the pinned sticky header (flow position off-screen) is
  // excluded by the intersection check.
  // The range is deduped before reporting, so this can safely run after EVERY
  // render — required because the virtualizer updates its own item range one
  // render behind structural changes (expand/collapse, legend filtering).
  const lastRangeRef = useRef<{ start: number; end: number } | null>(null);
  const computeRange = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !onVisibleRangeChange) return;
    // "visible" = at least HALF the item shows in the area BELOW the pinned
    // sticky header — rows tucked behind it (or 1px slivers at either edge)
    // must not widen the band past what the user can actually read
    const top = el.scrollTop + HEADER_H;
    const bottom = el.scrollTop + el.clientHeight;
    let min: number | null = null;
    let max: number | null = null;
    const include = (a: number, b: number) => {
      min = min === null ? a : Math.min(min, a);
      max = max === null ? b : Math.max(max, b);
    };
    for (const vi of virtualizer.getVirtualItems()) {
      const overlap = Math.min(vi.end, bottom) - Math.max(vi.start, top);
      if (overlap < vi.size / 2) continue;
      const it = items[vi.index];
      if (!it) continue; // stale virtual index during a structural change
      if (it.kind === 'header') {
        include(it.section.start, open.has(it.section.index) ? it.section.start : it.section.end);
      } else {
        include(it.row.ep, it.row.ep);
      }
    }
    // the pinned header itself is real visible info; when its section is
    // COLLAPSED its rows can't represent it, so include its range explicitly
    const stickyIt = items[activeStickyRef.current];
    if (stickyIt?.kind === 'header' && !open.has(stickyIt.section.index)) {
      include(stickyIt.section.start, stickyIt.section.end);
    }
    const range = min !== null && max !== null ? { start: min, end: max } : null;
    const last = lastRangeRef.current;
    const same =
      range === null
        ? last === null
        : last !== null && last.start === range.start && last.end === range.end;
    if (same) return;
    lastRangeRef.current = range;
    onVisibleRangeChange(range);
  }, [items, open, virtualizer, onVisibleRangeChange]);

  // no dep array on purpose — see note above (the dedupe makes this converge)
  useEffect(() => {
    computeRange();
  });

  // ── keyboard: ↑/↓ (or j/k) walks episodes through the lookup — GLOBALLY ───
  // Gmail/Linear-pattern list shortcuts (ruling 2026-08-21): while a selection
  // exists, the keys walk episodes no matter where focus sits — EXCEPT inside
  // an editable control (the position-row inputs keep their own arrows for
  // stepping). With NO selection (card just opened, or after reset()), the
  // keys SEED from the rest position: rest±1 on the first press (Sean,
  // 2026-08-21 — exploration starts without touching an input/row/strip;
  // supersedes both keys-stay-native and the list-frame edge-seed, which
  // survive only as no-rest fallbacks). Walks only through VISIBLE sections
  // (the sections prop is pre-filtered by the legend filter); at the edge of
  // visible content it no-ops.
  const nextVisibleEp = useCallback(
    (cur: number, dir: number): number | null => {
      if (dir > 0) {
        for (const s of sections) {
          if (s.end <= cur) continue;
          return cur >= s.start ? cur + 1 : s.start;
        }
        return null;
      }
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s.start >= cur) continue;
        return cur <= s.end ? cur - 1 : s.end;
      }
      return null;
    },
    [sections],
  );
  useEffect(() => {
    if (!interactive || !onSelectEpisode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      let dir = 0;
      if (e.key === 'j' || e.key === 'ArrowDown') dir = 1;
      else if (e.key === 'k' || e.key === 'ArrowUp') dir = -1;
      else return;
      const t = e.target instanceof HTMLElement ? e.target : null;
      // editable targets always win — typing/stepping never walks the list
      if (t?.closest('input, textarea, select, [contenteditable]')) return;
      const inList = t !== null && (scrollRef.current?.contains(t) ?? false);
      // reset state (no selection): SEED from the REST position (Sean,
      // 2026-08-21) — the first press activates exploration at rest±1
      // (up = previous ep, down = next), no input/row/strip click needed;
      // the dim rest marker stays dim until that first press. Fallbacks
      // when no rest exists: keys keep their native meaning unless focus
      // sits in the list frame (listbox edge-seeding from the frame ends).
      if (selectedEp === null && restEp == null && !inList) return;
      e.preventDefault();
      const cur = selectedEp ?? restEp ?? (dir > 0 ? 0 : rows.length + 1);
      const next = nextVisibleEp(cur, dir);
      if (next === null) return; // directional integrity: nothing that way → no-op
      interactionRef.current = { ep: next, kind: 'key', dir };
      onSelectEpisode(next);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [interactive, onSelectEpisode, selectedEp, restEp, nextVisibleEp, rows.length]);

  const anyOpen = open.size > 0;

  return (
    <div className="font-mono">
      {/* X6 header ("hover_command", 2026-08-19): the WHOLE label is one
          control — click anywhere on icon/text/command to toggle. Hover
          reveals the single flip command as literal text in the same inline
          flow (" > expand_all" with real mono spaces — every gap exactly one
          character). No counts: the list shows its own state.
          Label metrics replicate the PositionLabel contract (1em icon, equal
          boxes) — inlined because the label here is a <button> with an
          inline command suffix. */}
      {/* block-label seam (§1.4 token): a label over a whole frame earns
          2× the inline label seam */}
      <div className="px-0.5 pb-label-block">
        <button
          type="button"
          disabled={sections.length === 0}
          onClick={() => setAll(!anyOpen)}
          aria-label={anyOpen ? 'collapse all sections' : 'expand all sections'}
          className="group/xall flex cursor-pointer items-center gap-1.5 text-xs leading-3 tracking-wider text-muted-foreground disabled:pointer-events-none"
        >
          <ListIcon className="h-3 w-3 shrink-0 text-primary" />
          <span>
            episode_list
            <span className="whitespace-pre text-primary opacity-0 transition-opacity group-hover/xall:opacity-100 motion-reduce:transition-none">
              {anyOpen ? ' > collapse_all' : ' > expand_all'}
            </span>
          </span>
        </button>
      </div>

      {sections.length === 0 && (
        <div className="px-0.5 py-2 text-xs tracking-wider text-muted-foreground/60">
          {'// filtered(0) — no sections match the legend selection'}
        </div>
      )}
      <div
        ref={scrollRef}
        tabIndex={0}
        onScroll={computeRange}
        className="relative max-h-80 overflow-y-auto tabular-nums outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-dashed focus-visible:outline-foreground/25 focus-visible:outline-offset-[-1px]"
        role="listbox"
        aria-label="episode list"
      >
        <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
          {virtualizer.getVirtualItems().map((vi) => {
            const it = items[vi.index];

            if (it.kind === 'header') {
              const s = it.section;
              const isOpen = open.has(s.index);
              const stuck = activeStickyRef.current === vi.index;
              return (
                <button
                  key={vi.key}
                  type="button"
                  onClick={() => toggleSection(s.index)}
                  className={cn(
                    // interior_v1: banded headers — the section's type color
                    // washed over the opaque surface (index.css utilities)
                    'flex w-full cursor-pointer items-center gap-[0.6rem] px-[0.3rem] text-left text-sm',
                    SECTION_BAND[s.type] ?? 'bg-card hover:bg-popover',
                  )}
                  style={
                    stuck
                      ? { position: 'sticky', top: 0, zIndex: 10, height: HEADER_H }
                      : {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: HEADER_H,
                          transform: `translateY(${vi.start}px)`,
                        }
                  }
                >
                  <span
                    className={cn(
                      MARKER_BOX,
                      'flex shrink-0 items-center justify-center transition-transform motion-reduce:transition-none',
                      isOpen && 'rotate-90',
                      MARKER_COLOR[s.type],
                    )}
                  >
                    <ChevronRightIcon className="h-[0.7rem] w-[0.7rem]" />
                  </span>
                  {/* type tag retired from headers (2026-08-21): the section
                      band color + colored marker carry the type; the range
                      now sits over the rows' #ep column */}
                  <span className="text-muted-foreground">
                    ep:
                    <span className="text-foreground">
                      {s.start}
                      {s.end > s.start && `-${s.end}`}
                    </span>
                  </span>
                  <span className="text-muted-foreground">({s.count})</span>
                  <span className="ml-auto shrink-0 text-muted-foreground">
                    {coverageLabel(s)}
                  </span>
                </button>
              );
            }

            const { row } = it;
            const selected = selectedEp === row.ep;
            const pulsing = pulse !== null && pulse.ep === row.ep;
            return (
              <div
                key={pulsing ? `${vi.key}-p${pulse.n}` : vi.key}
                data-ep={row.ep}
                onClick={
                  interactive && onSelectEpisode
                    ? () => {
                        interactionRef.current = { ep: row.ep, kind: 'click' };
                        onSelectEpisode(row.ep);
                      }
                    : undefined
                }
                className={cn(
                  'flex items-center gap-[0.6rem] pr-[0.3rem] text-sm',
                  ROW_INDENT,
                  interactive && 'cursor-pointer hover:bg-muted/50',
                  // interior_v1 selection grammar: hover = neutral bg step,
                  // selected = bg step + 2px TYPE-colored rail (never zebra)
                  selected && cn('bg-muted/40', RAIL_COLOR[row.type]),
                  pulsing && 'animate-row-pulse',
                )}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: ROW_H,
                  transform: `translateY(${vi.start}px)`,
                  ...(pulsing
                    ? ({ '--pulse-color': PULSE_COLOR[row.type] } as React.CSSProperties)
                    : {}),
                }}
                role="option"
                aria-selected={selected}
              >
                <span className={cn('shrink-0', HASH_COLOR[row.type])} style={enoStyle}>
                  #<span className={NUM_COLOR[row.type]}>{row.ep}</span>
                </span>
                {row.title !== null ? (
                  <span className="min-w-0 flex-1 truncate">{row.title}</span>
                ) : (
                  <span className="min-w-0 flex-1 truncate text-muted-foreground/60">
                    {'// title_pending'}
                  </span>
                )}
                {row.ch !== null ? (
                  <span className="shrink-0">
                    <span className="text-muted-foreground">vol:</span>
                    {row.vol ?? '—'}
                    <span className="text-muted-foreground"> · ch:</span>
                    {row.ch}
                  </span>
                ) : (
                  <span className="shrink-0 text-muted-foreground/60">—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
