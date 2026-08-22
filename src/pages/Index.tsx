import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { Kbd } from '@/components/Kbd';
import { CatalogField } from '@/components/CatalogField';
import { useCatalogList } from '@/hooks/useCatalog';

// ⌘K on mac, ctrl K elsewhere — display only; the handler accepts both
const IS_MAC = /mac/i.test(navigator.platform || navigator.userAgent);

// The homepage IS the catalog field: every series as a title row, grep to
// narrow, click to expand in place (docs/components/catalog-field.md).
const Index = () => {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [cardOpen, setCardOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const t = setTimeout(() => setQuery(input), 200);
    return () => clearTimeout(t);
  }, [input]);

  // page hotkeys (2026-08-21): ⌘K activates search from anywhere; ←/→ with a
  // query but focus elsewhere recall the search caret (walking the list with
  // ↑/↓ keeps the search text one arrow away). Both defer to an open card.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); // browsers own ⌘K otherwise
        searchRef.current?.focus();
        return;
      }
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.metaKey || e.ctrlKey || e.altKey || cardOpen) return;
      const el = searchRef.current;
      if (!el || !el.value || document.activeElement === el) return;
      const t = e.target instanceof HTMLElement ? e.target : null;
      if (t?.closest('input, textarea, select, [contenteditable]')) return;
      e.preventDefault();
      el.focus(); // browsers restore the pre-blur caret; step it one glyph
      const pos = el.selectionStart ?? el.value.length;
      const next = Math.max(
        0,
        Math.min(el.value.length, pos + (e.key === 'ArrowRight' ? 1 : -1)),
      );
      el.setSelectionRange(next, next);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cardOpen]);

  // whole catalog, sorted A–Z by the field — grep narrows client-side while
  // the catalog is mock-scale (see contract §3 for the AniList swap)
  const listQuery = useCatalogList({ status: 'all', limit: 500, sortBy: 'popularity' });

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background font-mono">
      <Header />

      {/* lone search — 96px below the global header, 64px above the field
          (spacing ruling, 2026-08-19). Left-aligned with the series title
          column: same width formula as the field's column, plus the 2ch
          cursor gutter so the label sits flush with the title glyphs. */}
      <div className="container pb-16 pt-24 text-sm">
        {/* fontSize 18 = the field's TEXT_PX, so 52ch/2ch resolve identically
            to the title column's; the children size themselves in rem */}
        <div className="mx-auto w-[min(52ch,82%)] pl-[2ch]" style={{ fontSize: 18 }}>
          {/* THE UNDERLINE (Sean's tuning walk, 2026-08-21: full column →
              title area → **2/3 of the title area**): one fixed dashed rule
              from the title-glyph start (the 2ch gutter, via the wrapper's
              padding), spanning 2/3 of the title area. Title area = column
              minus the rows' status zone; the reserve is derived, not
              eyeballed: widest status word ("finished"/"upcoming") = 8ch at
              META_PX 12px × Plex Mono's 0.6em advance = 57.6px + the rows'
              pl-4 gap (16px) = 73.6px. The width is a formula, so the
              line's geometry is state-invariant by construction; the
              keycap hint hangs right of the line's end (empty+inactive
              only), and the input flexes inside the line. */}
          {/* active state lives on the ICON, not the line (ruling 2026-08-19) */}
          <div className="group/search flex items-center">
            <span className="flex w-[calc((100%-73.6px)*2/3)] items-center gap-[1ch] border-b border-dashed border-border pb-1">
              <Search
                aria-hidden
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-colors group-focus-within/search:text-primary"
              />
              <span className="relative flex flex-1 items-baseline">
                <input
                  id="search"
                  ref={searchRef}
                  aria-label="search series"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Escape') return;
                    // While a card is open, Esc belongs to the CARD (close
                    // it, keep the query) — decline it here and let it
                    // bubble to the window close handler. The search's own
                    // ladder only runs with no card: text → clear but stay
                    // active; empty → blur (= clicking out). Consumed then
                    // — layering rule.
                    if (cardOpen) return;
                    e.stopPropagation();
                    if (input) {
                      setInput('');
                      setQuery('');
                    } else {
                      e.currentTarget.blur();
                    }
                  }}
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full border-0 bg-transparent p-0 pr-[2ch] font-mono text-sm text-foreground [caret-color:currentColor] focus:outline-none"
                />
                {input && (
                  <button
                    aria-label="clear search"
                    onClick={() => {
                      setInput('');
                      setQuery('');
                    }}
                    className="absolute right-0 text-muted-foreground hover:text-primary"
                  >
                    x
                  </button>
                )}
              </span>
            </span>
            {!input && (
              <span
                aria-hidden
                onClick={() => searchRef.current?.focus()}
                className="ml-3 flex shrink-0 cursor-pointer select-none items-center gap-1 group-focus-within/search:hidden"
              >
                {(IS_MAC ? ['⌘', 'K'] : ['ctrl', 'K']).map((key) => (
                  <Kbd key={key} glyph={key} />
                ))}
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="min-h-0 flex-1">
        {/* the field's chrome (watermark letter, A–Z rail) aligns to the same
            content frame as the Header — container, not viewport edges. Frame
            law = fill_offset (Sean's pick, Frame Size Lab): header + search
            spacing stay fixed, ALL remaining height goes to the field. The
            traveling focus law anchors the list to the frame's top edge, so
            there is no dead space regardless of frame height. */}
        <div className="container h-full">
          <CatalogField
            series={listQuery.data ?? []}
            query={query}
            loading={listQuery.isLoading}
            onOpenChange={setCardOpen}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
