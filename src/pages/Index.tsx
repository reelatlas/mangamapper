import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { CatalogField } from '@/components/CatalogField';
import { useCatalogList } from '@/hooks/useCatalog';

// The homepage IS the catalog field: every series as a title row, grep to
// narrow, click to expand in place (docs/components/catalog-field.md).
const Index = () => {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQuery(input), 200);
    return () => clearTimeout(t);
  }, [input]);

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
          {/* the icon is part of the dashed line: the underline lives on the
              wrapper; icon + input sit on it as one instrument */}
          {/* active state lives on the ICON, not the line (ruling 2026-08-19) */}
          <span className="group/search inline-flex items-center gap-[1ch] border-b border-dashed border-border pb-1">
            <Search
              aria-hidden
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-colors group-focus-within/search:text-primary"
            />
            <span className="relative flex items-baseline">
              <input
                id="search"
                aria-label="search series"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="w-[22ch] border-0 bg-transparent p-0 pr-[2ch] font-mono text-sm text-foreground [caret-color:currentColor] focus:outline-none"
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
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
