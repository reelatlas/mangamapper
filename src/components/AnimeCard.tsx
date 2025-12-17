import { AnimeSeries } from '@/types/anime';
import { Card, CardContent } from '@/components/ui/card';
import { MangaMappingDisplay } from './MangaMappingDisplay';
import { Link } from 'react-router-dom';

interface UserProgress {
  last_watched_episode: number | null;
  last_read_volume: number | null;
  last_read_chapter: string | null;
}

interface AnimeCardProps {
  anime: AnimeSeries;
  rank?: number;
  progress?: UserProgress;
}

export const AnimeCard = ({ anime, rank, progress }: AnimeCardProps) => {
  const currentEpisode = anime.episodes[0]; // Most recent episode
  
  const hasProgress = progress && (
    progress.last_watched_episode !== null || 
    progress.last_read_volume !== null || 
    progress.last_read_chapter !== null
  );

  return (
    <Link to={`/anime/${anime.id}`}>
      <Card className="group overflow-hidden transition-all duration-200 hover:border-primary/50 cursor-pointer border-dashed">
        <div className="terminal-header flex items-center justify-between">
          <span className="flex items-center gap-2">
            {rank && <span className="text-syntax-amber">#{String(rank).padStart(2, '0')}</span>}
            {rank && <span className="text-border">|</span>}
            <span className="text-muted-foreground">anime_data</span>
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              {'>'} view_all
            </span>
          </span>
          <span className="text-muted-foreground">
            {anime.status === 'airing' ? (
              <span className="text-accent">airing</span>
            ) : (
              <span>complete</span>
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
              {/* Top section - Data structure */}
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-syntax-cyan">title</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-syntax-green">{anime.title}</span>
                </div>
                <div>
                  <span className="text-syntax-cyan">title_jp</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-syntax-green text-xs">{anime.japaneseTitle}</span>
                </div>
                <div>
                  <span className="text-syntax-cyan">genres</span>
                  <span className="text-muted-foreground">: </span>
                  {anime.genres.slice(0, 3).map((genre, i) => (
                    <span key={genre}>
                      <span className="text-syntax-amber">{genre.toLowerCase()}</span>
                      {i < Math.min(anime.genres.length, 3) - 1 && <span className="text-muted-foreground">, </span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom section - Progress and episode (pushed to bottom) */}
              <div className="mt-auto pt-2 space-y-3">
                {/* User progress section */}
                {hasProgress && (
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1 tracking-wider">
                      // your_progress
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      {progress.last_watched_episode !== null && (
                        <span>
                          <span className="text-syntax-cyan">ep</span>
                          <span className="text-muted-foreground">: </span>
                          <span className="text-syntax-amber">{progress.last_watched_episode}</span>
                        </span>
                      )}
                      {(progress.last_read_volume !== null || progress.last_read_chapter !== null) && (
                        <span>
                          {progress.last_read_volume !== null && (
                            <>
                              <span className="text-syntax-cyan">vol</span>
                              <span className="text-muted-foreground">: </span>
                              <span className="text-syntax-amber">{progress.last_read_volume}</span>
                            </>
                          )}
                          {progress.last_read_volume !== null && progress.last_read_chapter !== null && (
                            <span className="text-muted-foreground">·</span>
                          )}
                          {progress.last_read_chapter !== null && (
                            <>
                              <span className="text-syntax-cyan">ch</span>
                              <span className="text-muted-foreground">: </span>
                              <span className="text-syntax-amber">{progress.last_read_chapter}</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Current episode mapping */}
                {currentEpisode && (
                  <div>
                    <p className="text-[10px] text-muted-foreground tracking-wider mb-2">
                      // last_episode
                    </p>
                    <MangaMappingDisplay episode={currentEpisode} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
