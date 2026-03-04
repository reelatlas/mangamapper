import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useLibraryData } from '@/hooks/useLibraryData';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Library as LibraryIcon, List, Glasses } from 'lucide-react';
import { LibraryFlatView } from '@/components/library/LibraryFlatView';
import { LibraryGroupedView } from '@/components/library/LibraryGroupedView';
import { NewSeriesForm } from '@/components/library/NewSeriesForm';
import { NewReaderForm } from '@/components/library/NewReaderForm';

interface LocationState {
  openAddReader?: boolean;
  preSelectAnimeId?: string;
}

type ViewMode = 'flat' | 'by_reader';

const Library = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const { user, authLoading, loading, progress, readerSites, fetchProgress, fetchReaderSites, removeFromLibrary, deleteReaderSite } = useLibraryData();
  
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('mangamapper-library-view-mode');
    return saved === 'by_reader' ? 'by_reader' : 'flat';
  });
  const [showNewSeries, setShowNewSeries] = useState(false);
  const [showNewReader, setShowNewReader] = useState(false);
  const [preSelectAnimeId, setPreSelectAnimeId] = useState<string | undefined>();

  useEffect(() => {
    localStorage.setItem('mangamapper-library-view-mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Handle deep link from anime detail page
  useEffect(() => {
    if (locationState?.openAddReader) {
      setShowNewReader(true);
      if (locationState.preSelectAnimeId) {
        setPreSelectAnimeId(locationState.preSelectAnimeId);
      }
      window.history.replaceState({}, document.title);
    }
  }, [locationState]);

  const handleRefreshAll = () => {
    fetchProgress();
    fetchReaderSites();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background font-mono">
        <Header />
        <main className="container py-8">
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground text-sm">...loading</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-mono overflow-x-hidden">
      <Header />
      
      <main className="container py-8 overflow-hidden">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <LibraryIcon className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{'>'}</span>
          <span className="text-syntax-cyan">my_library</span>
        </div>

        <div className="space-y-4">
          {/* Action buttons row */}
          <div className="flex flex-wrap items-center gap-2">
            {!showNewSeries && !showNewReader && (
              <>
                <Button onClick={() => setShowNewSeries(true)} variant="outline" className="font-mono text-xs border-dashed">
                  {'>'} new_series
                </Button>
                <Button onClick={() => setShowNewReader(true)} variant="outline" className="font-mono text-xs border-dashed">
                  {'>'} new_reader
                </Button>
              </>
            )}
            
          </div>

          {/* New Series Form */}
          {showNewSeries && user && (
            <NewSeriesForm
              userId={user.id}
              readerSites={readerSites}
              onSuccess={handleRefreshAll}
              onCancel={() => setShowNewSeries(false)}
              preSelectAnimeId={preSelectAnimeId}
            />
          )}

          {/* New Reader Form */}
          {showNewReader && user && (
            <NewReaderForm
              userId={user.id}
              readerSites={readerSites}
              onSuccess={() => { handleRefreshAll(); setShowNewReader(false); }}
              onCancel={() => { setShowNewReader(false); setPreSelectAnimeId(undefined); }}
              preSelectAnimeId={preSelectAnimeId}
            />
          )}

          {/* View content */}
          {viewMode === 'flat' ? (
            <LibraryFlatView
              progress={progress}
              readerSites={readerSites}
              removeFromLibrary={removeFromLibrary}
            />
          ) : (
            <LibraryGroupedView
              userId={user!.id}
              readerSites={readerSites}
              progress={progress}
              fetchReaderSites={handleRefreshAll}
              deleteReaderSite={deleteReaderSite}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-dashed mt-16">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          <p>
            <span className="text-foreground/40">mangaMapper</span>{' '}
            <span>// find your next chapter</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Library;
