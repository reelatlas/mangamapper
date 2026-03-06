import { useState, useEffect } from 'react';
import { AnimeSeries } from '@/types/anime';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MangaMappingDisplay } from './MangaMappingDisplay';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

interface AnimeCardProps {
  anime: AnimeSeries;
  rank?: number;
}

export const AnimeCard = ({ anime, rank }: AnimeCardProps) => {
  const currentEpisode = anime.episodes[0];
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inLibrary, setInLibrary] = useState(false);
  const [togglingLibrary, setTogglingLibrary] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoadingLibrary(true);
    supabase
      .from('anime_progress')
      .select('in_library')
      .eq('anime_id', anime.id)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setInLibrary(data?.in_library ?? false);
        setLoadingLibrary(false);
      });
  }, [user, anime.id]);

  const toggleLibrary = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setTogglingLibrary(true);

    if (inLibrary) {
      const { error } = await supabase.from('anime_progress').update({ in_library: false }).eq('anime_id', anime.id).eq('user_id', user.id);
      if (error) {
        toast.error('Failed to remove from library');
      } else {
        await supabase.from('manga_reader_sites').delete().eq('user_id', user.id).eq('anime_id', anime.id);
        toast.success('Removed from library');
        setInLibrary(false);
      }
    } else {
      const { error } = await supabase.from('anime_progress').upsert({ user_id: user.id, anime_id: anime.id, in_library: true }, { onConflict: 'user_id,anime_id' });
      if (error) {
        toast.error('Failed to add to library');
      } else {
        toast.success('Added to library');
        setInLibrary(true);
      }
    }
    setTogglingLibrary(false);
    setConfirmRemove(false);
  };

  const handleConfirmRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmRemove(true);
  };

  const handleCancelRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmRemove(false);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/anime/${anime.id}`);
  };

  return (
    <Link to={`/anime/${anime.id}`}>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:border-primary/50 cursor-pointer border-dashed">
        <div className="terminal-header flex items-center justify-between">
          <span className="flex items-center gap-2">
            {rank && <span className="text-syntax-amber">#{String(rank).padStart(2, '0')}</span>}
            {rank && <span className="text-border">|</span>}
            <span className="text-muted-foreground">series_data</span>
          </span>
          <span className="text-muted-foreground">
            {anime.status === 'airing' ? (
              <span className="text-accent">airing</span>
            ) : anime.status === 'hiatus' ? (
              <span className="text-syntax-amber">hiatus</span>
            ) : (
              <span>{anime.status}</span>
            )}
          </span>
        </div>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row sm:h-[240px]">
            {/* Cover Image */}
            <div className="relative w-full sm:w-44 h-44 sm:h-full shrink-0 overflow-hidden border-b sm:border-b-0 sm:border-r border-dashed">
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent sm:bg-gradient-to-r" />
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col font-mono">
              <div className="space-y-1 text-sm min-w-0">
                <div className="break-words">
                  <span className="text-syntax-cyan">title</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-syntax-green">{anime.title}</span>
                </div>
                <div className="break-words">
                  <span className="text-syntax-cyan">title_jp</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-syntax-green text-xs">{anime.japaneseTitle}</span>
                </div>
                <div className="flex flex-wrap">
                  <span className="text-syntax-cyan">genres</span>
                  <span className="text-muted-foreground">:&nbsp;</span>
                  {anime.genres.slice(0, 3).map((genre, i) => (
                    <span key={genre}>
                      <span className="text-syntax-amber">{genre.toLowerCase()}</span>
                      {i < Math.min(anime.genres.length, 3) - 1 && <span className="text-muted-foreground">,&nbsp;</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-2">
                {currentEpisode && (
                  <div>
                    <p className="text-[10px] text-muted-foreground tracking-wider mb-2">
                      last_episode
                    </p>
                    <MangaMappingDisplay episode={currentEpisode} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
          <div className="flex items-center font-mono text-xs">
            {/* view_details */}
            <span
              className="cursor-pointer text-primary hover:underline"
              onClick={handleViewDetails}
            >
              {'>'} view_details
            </span>

            {/* Divider + library toggle (only for logged-in users) */}
            {user && !loadingLibrary && (
              <>
                <div className="h-4 w-px bg-muted-foreground/40 mx-3" />

                {confirmRemove ? (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground mr-1">remove?</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleLibrary}
                      disabled={togglingLibrary}
                      className="h-7 w-7 p-0 hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelRemove}
                      className="h-7 w-7 p-0 hover:text-muted-foreground hover:bg-muted/50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="group/lib flex items-center">
                    <span className={`${inLibrary ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {togglingLibrary ? '...' : inLibrary ? 'in_library [✓]' : 'in_library [ ]'}
                    </span>
                    <span
                      className={`ml-2 cursor-pointer ${inLibrary ? 'text-destructive' : 'text-primary'}`}
                      onClick={inLibrary ? handleConfirmRemove : toggleLibrary}
                    >
                      {'>'} {inLibrary ? 'remove_from(library)' : 'add_to(library)'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
