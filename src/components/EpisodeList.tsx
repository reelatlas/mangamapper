import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useVirtualizer,
  defaultRangeExtractor,
  type Range,
} from '@tanstack/react-virtual';
import { ChevronRightIcon, ListIcon } from '@/components/icons';
import { TypeBadge, type TypeBadgeKind } from '@/components/TypeBadge';
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
//   header: pad 0.3rem + marker 0.8rem + gap 0.6rem → badge col (W) → gap → range
//   rows:   # starts at the badge's first letter  = 0.3+0.8+0.6 + 1px border + 0.45rem pad
//           title starts where the header's range starts = 2.3rem + W + 0.6rem gap
//           → eno column width = W − 0.45rem − 1px
// The badge column W is ADAPTIVE: 4.2rem fits canon/mixed/filler; a list that
// contains anime_only sections widens to 5.7rem — the token text never
// shortens, the column adapts (and the row columns adapt with it).
const BADGE_COL_REM = 4.2;
const BADGE_COL_WIDE_REM = 5.7;
const ROW_INDENT = 'pl-[calc(2.15rem+1px)]';
const MARKER_BOX = 'w-[0.8rem] h-[0.8rem]';

const MARKER_COLOR: Record<EpisodeType, string> = {
  canon: 'text-accent',
  mixed: 'text-syntax-amber',
  filler: 'text-destructive',
  'anime-only-canon': 'text-syntax-purple',
};

// # symbol = disabled tone OF the section's color; the number = full color
const HASH_COLOR: Record<EpisodeType, string> = {
  canon: 'text-accent/[0.45]',
  mixed: 'text-syntax-amber/[0.45]',
  filler: 'text-destructive/[0.45]',
  'anime-only-canon': 'text-syntax-purple/[0.45]',
};
const NUM_COLOR: Record<EpisodeType, string> = MARKER_COLOR;

const badgeKindForEpisodeType = (t: EpisodeType): TypeBadgeKind =>
  t === 'anime-only-canon' ? 'anime_only' : t;

type ListItem =
  | { kind: 'header'; section: EpisodeSection }
  | { kind: 'row'; row: EpisodeRow; sectionIndex: number };

// section coverage label: whole volumes, no partial marking; — is the null.
// when the section is OPEN its numbers brighten to the normal text color
// ("engaged"); labels stay muted; collapse returns everything to muted.
const coverageLabel = (s: EpisodeSection, open: boolean) => {
  if (s.chStart === null || s.chEnd === null) {
    return <span className="text-muted-foreground/60">—</span>;
  }
  const num = open ? 'text-foreground' : undefined;
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
  interactive: boolean;      // false when the lookup is disabled (no source/mapping)
  onSelectEpisode?: (ep: number) => void; // routes into lookup.stripClick(ep)
  onVisibleRangeChange?: (range: { start: number; end: number } | null) => void;
}

export const EpisodeList = ({
  rows,
  sections,
  selectedEp,
  interactive,
  onSelectEpisode,
  onVisibleRangeChange,
}: EpisodeListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set());
  const [pulse, setPulse] = useState<{ ep: number; n: number } | null>(null);
  // which interaction produced the next selectedEp change: rows/keys must not
  // recenter the list the user is already looking at
  const interactionRef = useRef<{ ep: number; kind: 'click' | 'key' } | null>(null);
  // jump placement: 'jump' = lookup/strip-driven → row lands at the TOP of
  // the frame, directly under the sticky header (via scrollPaddingStart) —
  // maximum forward context ("continue from here"). 'auto' = j/k walking →
  // minimal scroll only. (Trialing top; a scrolloff-style 3rd-position
  // variant is the fallback if top feels abrupt.)
  const pendingScrollRef = useRef<{ ep: number; align: 'jump' | 'auto'; pulse: boolean } | null>(null);

  // adaptive badge column: widen only when this list carries anime_only sections
  const badgeColRem = useMemo(
    () => (sections.some((s) => s.type === 'anime-only-canon') ? BADGE_COL_WIDE_REM : BADGE_COL_REM),
    [sections],
  );
  const badgeColStyle = { width: `${badgeColRem}rem` };
  const enoStyle = { width: `calc(${badgeColRem - 0.45}rem - 1px)` };

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
    scrollPaddingStart: HEADER_H, // scrollToIndex never hides a row under the pinned header
    rangeExtractor,
  });

  // item identities shift when sections expand/collapse — drop the size cache
  useEffect(() => {
    virtualizer.measure();
  }, [items, virtualizer]);

  const toggleSection = (index: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  const setAll = (openAll: boolean) =>
    setOpen(openAll ? new Set(sections.map((s) => s.index)) : new Set());

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
      setOpen((prev) => new Set(prev).add(section.index));
    } else if (pendingScrollRef.current) {
      // section already open — items won't change, scroll now
      const p = pendingScrollRef.current;
      pendingScrollRef.current = null;
      const idx = items.findIndex((it) => it.kind === 'row' && it.row.ep === p.ep);
      if (idx >= 0) {
        virtualizer.scrollToIndex(idx, { align: p.align === 'jump' ? 'start' : 'auto' });
        if (p.pulse) setPulse((prev) => ({ ep: p.ep, n: (prev?.n ?? 0) + 1 }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reacts to selection changes only
  }, [selectedEp]);

  // deferred scroll: runs after an auto-expanded section's rows are in items
  useEffect(() => {
    const p = pendingScrollRef.current;
    if (!p) return;
    pendingScrollRef.current = null;
    const idx = items.findIndex((it) => it.kind === 'row' && it.row.ep === p.ep);
    if (idx < 0) return;
    virtualizer.scrollToIndex(idx, { align: p.align === 'jump' ? 'start' : 'auto' });
    if (p.pulse) setPulse((prev) => ({ ep: p.ep, n: (prev?.n ?? 0) + 1 }));
  }, [items, virtualizer]);

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

  // ── keyboard: j/k (or ↑/↓) walks episodes through the lookup ──────────────
  // Walks only through VISIBLE sections (the sections prop is pre-filtered by
  // the legend filter); at the edge of visible content it no-ops.
  const nextVisibleEp = (cur: number, dir: number): number | null => {
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
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive || !onSelectEpisode) return;
    let dir = 0;
    if (e.key === 'j' || e.key === 'ArrowDown') dir = 1;
    else if (e.key === 'k' || e.key === 'ArrowUp') dir = -1;
    else return;
    e.preventDefault();
    const cur = selectedEp ?? (dir > 0 ? 0 : rows.length + 1);
    const next = nextVisibleEp(cur, dir);
    if (next === null) return; // directional integrity: nothing that way → no-op
    interactionRef.current = { ep: next, kind: 'key' };
    onSelectEpisode(next);
  };

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
      <div className="px-0.5 pb-1.5">
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
        onKeyDown={handleKeyDown}
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
                  className="flex w-full cursor-pointer items-center gap-[0.6rem] bg-card px-[0.3rem] text-left text-sm hover:bg-popover"
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
                  <span className="inline-flex shrink-0" style={badgeColStyle}>
                    <TypeBadge type={badgeKindForEpisodeType(s.type)} />
                  </span>
                  <span className="text-muted-foreground">
                    ep:
                    <span className={isOpen ? 'text-foreground' : undefined}>
                      {s.start}
                      {s.end > s.start && `-${s.end}`}
                    </span>
                  </span>
                  <span className="text-muted-foreground">({s.count})</span>
                  <span className="ml-auto shrink-0 text-muted-foreground">
                    {coverageLabel(s, isOpen)}
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
                  selected && 'bg-secondary/80',
                  pulsing && 'animate-row-pulse',
                )}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: ROW_H,
                  transform: `translateY(${vi.start}px)`,
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
