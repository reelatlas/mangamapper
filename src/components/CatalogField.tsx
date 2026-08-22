import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'motion/react';
import { AnimeSeries } from '@/types/anime';
import { AnimeCard } from './AnimeCard';
import { StatusChip } from './StatusChip';
import { HOLD_DELAY, holdInterval } from '@/lib/hold';

// ─── lab-tuned constants — rulings, not suggestions ─────────────────────────
// flat_basis_v1 (Rolodex Lab aac0a3db) · takeover_v1 (Expand Lab 1a9ff4ed) ·
// meta/grep (Row Meta & Grep Lab 9cb009f7). Contract:
// docs/components/catalog-field.md — a change here means a new lab round.
const ROW_H = 36;
const TEXT_PX = 18;
const FADE_PCT = 24;
// THE FOCUS LOCK (Focus Law Lab c6afc733, locked 2026-08-19): the focus line
// starts AT the first row, migrates down 1:1 as rows accumulate above, and
// locks at this fraction of the frame — the end of the list scrolls up into
// it (picker convention), never the focus down into the list. Everything
// anchors to the lock: the law, the bottom runway, the watermark + rail.
// Shifting the focus (and its chrome) up/down = this one number.
const FOCUS_LOCK = 0.36; // LOCKED 2026-08-19 (trialed 0.5 → 0.1 → 0.3 → 0.36)
const FALLOFF = 8;
const OP_MIN = 0.08;
const OP_EXP = 1.5;
const TRACK_MAX = 2;
const LAG = 0.4;
const META_PX = 12;
const GLIDE_MAX = 600;
const SETTLE_MS = 320;
const OPEN_MS = 360;
const CLOSE_MS = 220;
const DIM = 0.15;
const DECODE_MS = 240;
const DECODE_ROW_DELAY = 12;
const RAIL_LINE = 18; // px per rail letter — column-wrap math needs it fixed

const CHARSET = '!<>-_\\/[]{}—=+*^?#';

const letterOf = (t: string) => {
  const m = t.match(/[a-zA-Z0-9]/);
  if (!m) return '#';
  return /[0-9]/.test(m[0]) ? '#' : m[0].toUpperCase();
};

interface Anim {
  step: (now: number) => boolean; // true = finished
}
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface CatalogFieldProps {
  series: AnimeSeries[];
  query: string;
  loading?: boolean;
  // lets the page scope its own hotkeys (⌘K, ←/→ caret recall) to the
  // field state — true while a takeover card is open
  onOpenChange?: (open: boolean) => void;
}

export const CatalogField = ({ series, query, loading, onOpenChange }: CatalogFieldProps) => {
  const q = query.trim().toLowerCase();
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const sorted = useMemo(
    () =>
      [...series].sort((a, b) =>
        a.title.localeCompare(b.title, 'en', { numeric: true, sensitivity: 'base' }),
      ),
    [series],
  );
  const vis = useMemo(
    () => (q ? sorted.filter((s) => s.title.toLowerCase().includes(q)) : sorted),
    [sorted, q],
  );
  const letters = useMemo(() => {
    const first: Record<string, number> = {};
    const order: string[] = [];
    vis.forEach((s, i) => {
      const L = letterOf(s.title);
      if (!(L in first)) {
        first[L] = i;
        order.push(L);
      }
    });
    return { first, order };
  }, [vis]);

  const stageRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const padTopRef = useRef<HTMLDivElement>(null);
  const padBotRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const railMapRef = useRef<Record<string, string>>({});

  // rail plan: single column always (the rail is a 1D map of the scroll
  // axis); when the alphabet outgrows the frame it ABBREVIATES iOS-style —
  // evenly sampled letters with clickable · dots covering the skipped ranges
  const [railUi, setRailUi] = useState<{
    items: { label: string; jump: string }[];
    top: number;
    h: number;
  } | null>(null);

  // takeover state — `open` renders the overlay; busyRef guards choreography
  const [open, setOpen] = useState<{ idx: number; y: number } | null>(null);
  const [closing, setClosing] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;
  const busyRef = useRef(false);
  const settleTimer = useRef(0);

  // mutable engine state — never React state, the rAF pass owns it
  const eng = useRef({
    smoothTop: 0,
    lastTop: 0,
    vel: 0,
    raf: 0,
    lastT: 0,
    prevLo: 0,
    prevHi: -1,
    letter: '',
    litKey: '',
    stageH: 0,
    lockY: 0,
    padBot: 0,
    maskTop: -1,
    maskBot: -1,
    scrolling: false,
    anims: [] as Anim[],
  }).current;

  const contentH = vis.length * ROW_H;
  const maxScroll = () => Math.max(0, contentH + eng.padBot - eng.stageH);
  const rowY = (i: number) => i * ROW_H;
  // the traveling law: focus rides the first row until enough rows sit above
  // it, then locks. focusAbs = the focused content-coordinate for a scrollTop.
  const focusY = (t: number) => Math.min(eng.lockY, ROW_H / 2 + t);
  const focusAbs = (t: number) => t + focusY(t);
  // invert focusAbs for click / rail / glide targeting (monotonic → bisection)
  const scrollForRow = (i: number) => {
    const want = rowY(i) + ROW_H / 2;
    let lo = 0;
    let hi = maxScroll();
    for (let k = 0; k < 28; k++) {
      const mid = (lo + hi) / 2;
      if (focusAbs(mid) < want) lo = mid;
      else hi = mid;
    }
    return Math.round((lo + hi) / 2);
  };

  const wake = () => {
    if (!eng.raf && scrollerRef.current) {
      eng.lastT = performance.now();
      eng.raf = requestAnimationFrame(frame);
    }
  };
  const tween = (dur: number, step: (e: number) => void, done?: () => void) => {
    if (reducedMotion || dur <= 0) {
      step(1);
      done?.();
      return;
    }
    const t0 = performance.now();
    eng.anims.push({
      step(now) {
        const t = Math.min(1, (now - t0) / dur);
        step(easeOut(t));
        if (t >= 1) {
          done?.();
          return true;
        }
        return false;
      },
    });
    wake();
  };

  const clearRow = (el: HTMLDivElement) => {
    // restore the BASE state — never browser defaults: removing the inline
    // opacity means opacity 1, and a cleared row must present dim (OP_MIN)
    el.style.opacity = String(OP_MIN);
    el.style.letterSpacing = '';
    el.style.fontWeight = '';
    el.style.color = '';
    (el.children[0] as HTMLElement).style.opacity = '';
    (el.children[2] as HTMLElement).style.opacity = '';
  };

  const styleRows = () => {
    const n = vis.length;
    if (!n) return;
    // the styled window covers the REAL viewport (plus margin) so fast
    // scrolling can never outrun it — the emphasis ramp still reads from the
    // lagged focus, which is the tuned trailing-highlight behavior
    const top = eng.lastTop;
    const centerY = focusAbs(eng.smoothTop);
    const lo = Math.max(0, Math.floor(top / ROW_H) - 3);
    const hi = Math.min(n - 1, Math.ceil((top + eng.stageH) / ROW_H) + 3);
    for (let i = eng.prevLo; i <= eng.prevHi; i++) {
      if ((i < lo || i > hi) && rowRefs.current[i]) clearRow(rowRefs.current[i]!);
    }
    eng.prevLo = lo;
    eng.prevHi = hi;
    // above the focus the ramp decays within the room that actually exists
    // (lockY), so rows finish dimming BEFORE the frame edge clips them —
    // identical to the tuned 8 rows whenever 8 rows fit (any lock ≥ ~0.35)
    const falloffAbove = Math.min(FALLOFF, Math.max(1.5, eng.lockY / ROW_H));
    for (let i = lo; i <= hi; i++) {
      const el = rowRefs.current[i];
      if (!el) continue;
      const d = (rowY(i) + ROW_H / 2 - centerY) / ROW_H;
      const a = Math.abs(d) / (d < 0 ? falloffAbove : FALLOFF);
      const f = Math.max(0, 1 - Math.pow(Math.min(1, a), OP_EXP));
      el.style.opacity = (OP_MIN + (1 - OP_MIN) * f).toFixed(3);
      el.style.letterSpacing = (TRACK_MAX * f).toFixed(2) + 'px';
      el.style.fontWeight = Math.abs(d) < 0.5 ? '600' : Math.abs(d) < 2 ? '500' : '400';
      const centered = Math.abs(d) < 0.5 && !openRef.current;
      el.style.color = centered ? 'hsl(var(--primary))' : '';
      (el.children[0] as HTMLElement).style.opacity = centered ? '1' : '0';
      (el.children[2] as HTMLElement).style.opacity = (f * f).toFixed(2); // meta reveal: center
    }
  };

  const updateWayfinding = (top: number) => {
    const n = vis.length;
    const g = glyphRef.current;
    if (!g) return;
    if (!n) {
      g.textContent = '';
      return;
    }
    const centerY = focusAbs(top);
    const ci = Math.max(0, Math.min(n - 1, Math.round((centerY - ROW_H / 2) / ROW_H)));
    const L = letterOf(vis[ci].title);
    if (L !== eng.letter) {
      eng.letter = L;
      g.textContent = L;
      if (!reducedMotion) {
        g.classList.remove('animate-glyph-push');
        void g.offsetWidth;
        g.classList.add('animate-glyph-push');
      }
      // an abbreviated rail may not show L itself — light its nearest letter
      const key = railMapRef.current[L] ?? L;
      if (key !== eng.litKey) {
        if (eng.litKey) railRefs.current[eng.litKey]?.classList.remove('text-primary');
        eng.litKey = key;
        railRefs.current[key]?.classList.add('text-primary');
      }
    }
  };

  // adaptive fade, companion to the traveling law: each zone = min(the tuned
  // 24%, the content actually beyond that edge) — full drum fade mid-list,
  // receding at the ends so it never swallows the focused row
  const updateMask = (sc: HTMLDivElement, top: number) => {
    if (openRef.current) return;
    const full = (FADE_PCT / 100) * eng.stageH;
    // the fade NEVER crosses the focus line: each zone must complete before
    // the focused row begins, whatever FOCUS_LOCK is (found at lock 0.1 —
    // the tuned 24% band swallowed the focused title)
    const topCap = Math.max(0, eng.lockY - ROW_H / 2 - 6);
    const botCap = Math.max(0, eng.stageH - eng.lockY - ROW_H / 2 - 6);
    // quantized to 4px steps: the mask re-rasterizes on every change, and
    // per-pixel growth near the list ends reads as scroll jank
    const q = (v: number) => Math.round(v / 4) * 4;
    const topPx = q(Math.min(full, topCap, Math.max(0, top)));
    const botPx = q(Math.min(full, botCap, Math.max(0, contentH - top - eng.stageH)));
    if (topPx === eng.maskTop && botPx === eng.maskBot) return;
    eng.maskTop = topPx;
    eng.maskBot = botPx;
    const m = `linear-gradient(to bottom, transparent 0, black ${topPx}px, black calc(100% - ${botPx}px), transparent 100%)`;
    sc.style.maskImage = m;
    (sc.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = m;
  };

  const frame = (now: number) => {
    const sc = scrollerRef.current;
    if (!sc) {
      eng.raf = 0;
      return;
    }
    const dt = Math.min(40, now - eng.lastT) / 1000;
    eng.lastT = now;
    const top = sc.scrollTop;
    const v = dt > 0 ? (top - eng.lastTop) / dt : 0;
    eng.lastTop = top;
    eng.vel += (v - eng.vel) * Math.min(1, dt * 12);
    // lagged emphasis: styling reads a lerped scrollTop (flat_basis_v1 LAG)
    const k = LAG > 0 && !reducedMotion ? Math.min(1, dt * (14 * (1 - LAG) + 1.5)) : 1;
    eng.smoothTop += (top - eng.smoothTop) * k;
    if (Math.abs(top - eng.smoothTop) < 0.15) eng.smoothTop = top;

    // mutation-safe queue: mid-step enqueues (chained choreography) survive
    const running = eng.anims.splice(0);
    const survivors = running.filter((a) => !a.step(now));
    eng.anims.unshift(...survivors);

    styleRows();
    updateWayfinding(top);
    updateMask(sc, top);

    const busy =
      eng.anims.length > 0 || Math.abs(top - eng.smoothTop) > 0.15 || Math.abs(eng.vel) > 2;
    eng.raf = busy || eng.scrolling ? requestAnimationFrame(frame) : 0;
  };

  // geometry + listeners; re-arms whenever the visible list changes
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    // a list remap invalidates everything in flight: a live overlay, a
    // pending settle timer, a glide whose done-callback died with the anims
    // queue. Reset ALL of it or busyRef wedges and openRow goes dead.
    clearTimeout(settleTimer.current);
    busyRef.current = false;
    if (openRef.current) {
      setOpen(null);
      setClosing(false);
    }
    const measure = () => {
      // the traveling law's geometry: no top pad (the list anchors to the
      // frame's top edge), and a bottom runway sized so the LAST row rests at
      // the focus lock — larger for short lists so the focus sweep can reach
      // their last row. Any list of 2+ rows scrolls through the focus.
      eng.stageH = sc.clientHeight;
      eng.lockY = eng.stageH * FOCUS_LOCK;
      eng.padBot = Math.max(
        0,
        Math.max(eng.stageH - eng.lockY, eng.stageH - contentH / 2) - ROW_H / 2,
      );
      if (padTopRef.current) padTopRef.current.style.height = '0px';
      if (padBotRef.current) padBotRef.current.style.height = eng.padBot + 'px';
      eng.maskTop = -1;
      eng.maskBot = -1;
      // the chrome anchors to the focus lock
      if (glyphRef.current) glyphRef.current.style.top = eng.lockY + 'px';
      // the rail never overflows the field, and EVERY letter stays surfaced
      // (ruling 2026-08-19: full alphabet beats iOS-style · abbreviation,
      // which was tried and rejected). When the alphabet outgrows the frame,
      // it overflows into additional columns — first column filled to what
      // fits, the remainder spilling over (20/7, not balanced halves).
      const order = letters.order;
      const n = order.length;
      railMapRef.current = {};
      const fit = Math.max(3, Math.floor(Math.max(RAIL_LINE, eng.stageH - 24) / RAIL_LINE));
      const railH = Math.min(n, fit) * RAIL_LINE;
      setRailUi({
        items: order.map((L) => ({ label: L, jump: L })),
        h: railH,
        top: Math.min(Math.max(eng.lockY, railH / 2 + 8), eng.stageH - railH / 2 - 8),
      });
    };
    measure();
    eng.prevLo = 0;
    eng.prevHi = -1;
    eng.letter = '';
    eng.litKey = '';
    // the active-letter class is engine-owned, not React-owned — sweep it on
    // remap or a reused button keeps a stale highlight (the "G" bug)
    Object.values(railRefs.current).forEach((b) => b?.classList.remove('text-primary'));
    eng.anims.length = 0;
    sc.scrollTop = 0;
    eng.smoothTop = 0;
    eng.lastTop = 0;
    wake();

    let scrollOff = 0;
    const onScroll = () => {
      eng.scrolling = true;
      clearTimeout(scrollOff);
      scrollOff = window.setTimeout(() => {
        eng.scrolling = false;
      }, 90);
      wake();
    };
    const onResize = () => {
      if (openRef.current) {
        setOpen(null);
        setClosing(false);
        busyRef.current = false;
      }
      measure();
      eng.prevLo = 0;
      eng.prevHi = -1;
      wake();
    };
    sc.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      sc.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearTimeout(scrollOff);
      clearTimeout(settleTimer.current);
      if (eng.raf) cancelAnimationFrame(eng.raf);
      eng.raf = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vis]);

  // mask ownership: the rAF pass paints it; an open overlay lifts it (spelled
  // here so React and the engine never fight over the same style property)
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    if (open) {
      sc.style.maskImage = 'none';
      (sc.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = 'none';
    }
    eng.maskTop = -1;
    eng.maskBot = -1;
    if (!open) wake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, vis]);

  // decode-in: every filter change (and first load) scrambles the visible
  // window into place — event-scoped, never continuous (grep ruling)
  useEffect(() => {
    if (reducedMotion || !vis.length) return;
    const coverage = Math.ceil(eng.stageH / ROW_H) + 2;
    const hi = Math.min(vis.length - 1, coverage);
    const t0 = performance.now();
    for (let i = 0; i <= hi; i++) {
      const el = rowRefs.current[i];
      if (!el) continue;
      const tEl = el.children[1] as HTMLElement;
      const finalHTML = tEl.innerHTML; // React-rendered, highlight included
      const text = vis[i].title;
      const delay = i * DECODE_ROW_DELAY;
      const res = Array.from(text, () => 0.2 + Math.random() * 0.7);
      eng.anims.push({
        step(now) {
          const p = (now - t0 - delay) / DECODE_MS;
          if (p < 0) return false;
          if (p >= 1) {
            tEl.innerHTML = finalHTML; // highlight ignites on resolve
            return true;
          }
          let out = '';
          for (let j = 0; j < text.length; j++) {
            const c = text[j];
            out += p >= res[j] || c === ' ' ? c : CHARSET[(Math.random() * CHARSET.length) | 0];
          }
          tEl.textContent = out;
          return false;
        },
      });
    }
    wake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vis]);

  // ── takeover choreography: glide → settle → grow ──────────────────────────
  const openRow = (idx: number) => {
    const sc = scrollerRef.current;
    if (!sc || busyRef.current || openRef.current || closing) return;
    busyRef.current = true;
    const target = scrollForRow(idx);
    const dist = Math.abs(target - sc.scrollTop);
    const dur = reducedMotion || dist < 2 ? 0 : Math.min(GLIDE_MAX, 120 + dist * 0.8);
    const from = sc.scrollTop;
    tween(
      dur,
      (e) => {
        sc.scrollTop = from + (target - from) * e;
      },
      () => {
        // the card never opens while the list is moving; arrive, then pause.
        // The overlay anchors on the row's actual screen line (near the list
        // ends the focus line means the row rests off-center).
        settleTimer.current = window.setTimeout(
          () => setOpen({ idx, y: rowY(idx) + ROW_H / 2 - sc.scrollTop }),
          dur === 0 || reducedMotion ? 0 : SETTLE_MS,
        );
      },
    );
  };
  const requestClose = () => {
    if (openRef.current && !closing) setClosing(true);
  };
  const finishClose = () => {
    // the field uncovers already positioned on the opened title (focus ruling)
    setOpen(null);
    setClosing(false);
    busyRef.current = false;
    eng.prevLo = 0;
    eng.prevHi = -1;
    wake();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closing]);

  useEffect(() => {
    onOpenChange?.(open !== null);
  }, [open, onOpenChange]);

  // ── keyboard walking (2026-08-21): ↑/↓ step the catalog through the focus
  // line with the stepper's hold pacing (one app-wide acceleration
  // vocabulary — imported, never forked); Enter opens the focused row. The
  // search input is the page's one editable and ↑/↓ have no vertical meaning
  // in it, so walking works while typing; other editables win. Hold pacing
  // is ours (e.repeat ignored) so keyboard and pointer holds feel identical.
  const focusedIndex = () => {
    const sc = scrollerRef.current;
    if (!sc || !vis.length) return -1;
    const centerY = focusAbs(sc.scrollTop);
    return Math.max(0, Math.min(vis.length - 1, Math.round((centerY - ROW_H / 2) / ROW_H)));
  };
  useEffect(() => {
    let timer = 0;
    let held: string | null = null;
    const end = () => {
      if (timer) window.clearTimeout(timer);
      timer = 0;
      held = null;
    };
    const stepRow = (dir: number) => {
      const sc = scrollerRef.current;
      if (!sc || openRef.current || busyRef.current) return;
      const ci = focusedIndex();
      if (ci < 0) return;
      sc.scrollTop = scrollForRow(Math.max(0, Math.min(vis.length - 1, ci + dir)));
      wake();
    };
    const onKey = (e: KeyboardEvent) => {
      if (openRef.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target instanceof HTMLElement ? e.target : null;
      if (t?.closest('textarea, select, [contenteditable]')) return;
      if (e.key === 'Enter') {
        // rows/buttons own their native Enter; anywhere else (incl. the
        // search input) Enter opens the focused row
        if (t?.closest('button, a, [role="button"]')) return;
        const ci = focusedIndex();
        if (ci < 0) return;
        e.preventDefault();
        openRow(ci);
        return;
      }
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault();
      if (e.repeat) return;
      end();
      held = e.key;
      const dir = e.key === 'ArrowUp' ? -1 : 1;
      stepRow(dir);
      let ticks = 0;
      const tick = () => {
        ticks++;
        stepRow(dir);
        timer = window.setTimeout(tick, holdInterval(ticks));
      };
      timer = window.setTimeout(tick, HOLD_DELAY);
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === held) end();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', end);
    return () => {
      end();
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vis]);

  // Titles render as ONE opaque HTML string (dangerouslySetInnerHTML), never
  // as React children: the decode churn rewrites these nodes directly, and
  // React reconciling child elements it no longer owns crashes with
  // removeChild errors (the search-clear black screen, 2026-08-19).
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const highlightHTML = (title: string) => {
    if (!q) return esc(title);
    const idx = title.toLowerCase().indexOf(q);
    if (idx < 0) return esc(title);
    return (
      esc(title.slice(0, idx)) +
      '<span class="text-primary">' +
      esc(title.slice(idx, idx + q.length)) +
      '</span>' +
      esc(title.slice(idx + q.length))
    );
  };
  // status renders through StatusChip (harmony pass 2026-08-21 — the one
  // component for every airing-status render); the row meta keeps its own
  // register (META_PX via the wrapper, no tracking, no padding), so only
  // the hue mapping is inherited
  const statusMeta = (s: AnimeSeries) => (
    <StatusChip status={s.status} className="p-0 text-[length:inherit] tracking-normal" />
  );

  return (
    <div ref={stageRef} className="relative h-full min-h-0" onClick={requestClose}>
      {/* watermark letter — centered on the field, i.e. on the focus line */}
      <div
        ref={glyphRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none font-bold leading-none text-foreground opacity-5"
        style={{ fontSize: 'clamp(90px, 18vh, 160px)' }}
      />

      <div
        ref={scrollerRef}
        className="absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ overflowY: open ? 'hidden' : 'auto' }}
      >
        <div
          className="mx-auto w-[min(52ch,82%)] transition-opacity duration-200"
          style={{
            fontSize: TEXT_PX,
            opacity: open ? DIM : undefined,
            pointerEvents: open ? 'none' : undefined,
          }}
        >
          <div ref={padTopRef} aria-hidden />
          {vis.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              role="button"
              tabIndex={0}
              className="flex cursor-pointer items-center overflow-hidden whitespace-nowrap"
              style={{
                height: ROW_H,
                opacity: OP_MIN,
                visibility: open && open.idx === i ? 'hidden' : undefined,
              }}
              onClick={(e) => {
                e.stopPropagation();
                openRow(i);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') openRow(i);
              }}
            >
              <span className="w-[2ch] shrink-0 whitespace-pre text-primary opacity-0">
                {'> '}
              </span>
              <span
                className="min-w-0 shrink overflow-hidden text-ellipsis"
                dangerouslySetInnerHTML={{ __html: highlightHTML(s.title) }}
              />
              <span
                className="ml-auto shrink-0 pl-4 tabular-nums text-muted-foreground opacity-0"
                style={{ fontSize: META_PX }}
              >
                {statusMeta(s)}
              </span>
            </div>
          ))}
          <div ref={padBotRef} aria-hidden />
        </div>
      </div>

      {/* a–z rail — anchored to the focus lock, clamped inside the frame;
          overflows into further columns when vertical space runs out */}
      {railUi && railUi.items.length > 1 && (
        <div
          className="absolute right-0 z-10 flex -translate-y-1/2 flex-col flex-wrap items-center gap-x-0.5 text-sm text-muted-foreground/60"
          style={{ top: railUi.top, height: railUi.h, lineHeight: RAIL_LINE + 'px' }}
        >
          {railUi.items.map((it, k) => (
            <button
              key={k}
              ref={(el) => {
                if (it.label !== '·') railRefs.current[it.label] = el;
              }}
              aria-label={'jump to ' + it.jump}
              className="px-1 hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                if (openRef.current) return;
                scrollerRef.current?.scrollTo({
                  top: scrollForRow(letters.first[it.jump]),
                  behavior: reducedMotion ? 'auto' : 'smooth',
                });
                wake();
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}

      {/* status lines */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          {'>'} fetch_series() ...
        </div>
      )}
      {!loading && vis.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          // no_matches
        </div>
      )}

      {open && vis[open.idx] && (
        <TakeoverOverlay
          key={vis[open.idx].id}
          anime={vis[open.idx]}
          anchorY={open.y}
          stageRef={stageRef}
          closing={closing}
          reducedMotion={reducedMotion}
          onRequestClose={requestClose}
          onOpened={() => {
            busyRef.current = false;
          }}
          onClosed={finishClose}
        />
      )}
    </div>
  );
};

// ─── the takeover overlay: grows from the row's own line, hosts the card ────
interface TakeoverOverlayProps {
  anime: AnimeSeries;
  anchorY: number;
  stageRef: React.RefObject<HTMLDivElement>;
  closing: boolean;
  reducedMotion: boolean;
  onRequestClose: () => void;
  onOpened: () => void;
  onClosed: () => void;
}

const TakeoverOverlay = ({
  anime,
  anchorY,
  stageRef,
  closing,
  reducedMotion,
  onRequestClose,
  onOpened,
  onClosed,
}: TakeoverOverlayProps) => {
  const ovlRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const geomRef = useRef({ H: 0, startTop: 0, finalTop: 0, stageH: 0 });
  const openedRef = useRef(false);

  // FOCUS OWNERSHIP (2026-08-21, Sean's repro): the overlay takes DOM focus
  // on open — otherwise focus stays wherever it was (typically the ACTIVE
  // SEARCH INPUT on an Enter-open), and the card's global walkers correctly
  // defer to the editable, so ↑/↓ go dead. Programmatic focus (tabIndex -1),
  // no visible ring. Close restores focus to whoever had it (query iteration:
  // Enter → explore → Esc → keep typing), if it still exists.
  useEffect(() => {
    const prev = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    ovlRef.current?.focus({ preventScroll: true });
    return () => {
      if (prev && prev !== document.body && prev.isConnected) {
        prev.focus({ preventScroll: true });
      }
    };
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const ovl = ovlRef.current;
    const inner = innerRef.current;
    if (!stage || !ovl || !inner) return;
    const stageH = stage.clientHeight;
    const stageW = stage.clientWidth;
    const w = Math.min(960, stageW - 32);
    ovl.style.left = (stageW - w) / 2 + 'px';
    ovl.style.width = w + 'px';
    // a tall card may borrow the headroom above the field (the search band) —
    // the takeover is an overlay, not a prisoner of the field's frame
    const HEADROOM = 132;
    const solve = () => {
      const H = Math.max(ROW_H, Math.min(stageH + HEADROOM - 24, inner.scrollHeight));
      geomRef.current = {
        H,
        startTop: anchorY - ROW_H / 2,
        finalTop: Math.max(12 - HEADROOM, Math.min(stageH - 12 - H, anchorY - H / 2)),
        stageH,
      };
    };
    solve();
    const apply = (e: number) => {
      const g = geomRef.current;
      ovl.style.top = (g.startTop + (g.finalTop - g.startTop) * e).toFixed(1) + 'px';
      ovl.style.height = (ROW_H + (g.H - ROW_H) * e).toFixed(1) + 'px';
      inner.style.opacity = (0.25 + 0.75 * e).toFixed(2);
    };
    // the card's data loads async (mapping → strip + episode list), so the
    // measured height GROWS after mount — re-solve and follow, or the first
    // open clips to the placeholder card (the "tiny card" bug, 2026-08-20)
    const ro = new ResizeObserver(() => {
      const prev = geomRef.current.H;
      solve();
      if (Math.abs(geomRef.current.H - prev) < 4) return;
      if (openedRef.current) {
        if (reducedMotion) apply(1);
        else animate(0, 1, { duration: 0.18, ease: 'easeOut', onUpdate: () => apply(1) });
      }
      // mid-grow: the running tween's next frame picks up the new geometry
    });
    ro.observe(inner);
    if (reducedMotion) {
      apply(1);
      inner.classList.add('card-in');
      openedRef.current = true;
      onOpened();
      return () => ro.disconnect();
    }
    apply(0);
    // the print entrance (instrument_v1) starts its stepped line delays now —
    // they land mid-grow (see .card-print in index.css)
    requestAnimationFrame(() => inner.classList.add('card-in'));
    const c = animate(0, 1, {
      duration: OPEN_MS / 1000,
      ease: 'easeOut',
      onUpdate: apply,
      onComplete: () => {
        openedRef.current = true;
        onOpened();
      },
    });
    return () => {
      ro.disconnect();
      c.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!closing) return;
    const ovl = ovlRef.current;
    const inner = innerRef.current;
    if (!ovl || !inner || reducedMotion) {
      onClosed();
      return;
    }
    const { H, startTop, finalTop } = geomRef.current;
    const apply = (e: number) => {
      ovl.style.top = (finalTop + (startTop - finalTop) * e).toFixed(1) + 'px';
      ovl.style.height = (H + (ROW_H - H) * e).toFixed(1) + 'px';
      inner.style.opacity = (1 - 0.75 * e).toFixed(2);
    };
    const c = animate(0, 1, {
      duration: CLOSE_MS / 1000,
      ease: 'easeOut',
      onUpdate: apply,
      onComplete: onClosed,
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  return (
    <div
      ref={ovlRef}
      tabIndex={-1}
      className="absolute z-20 overflow-hidden outline-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div ref={innerRef} className="card-print" style={{ opacity: 0.25 }}>
        <AnimeCard anime={anime} onClose={onRequestClose} />
      </div>
    </div>
  );
};
