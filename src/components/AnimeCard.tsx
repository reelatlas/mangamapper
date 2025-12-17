import { AnimeSeries } from '@/types/anime';
import { Card, CardContent } from '@/components/ui/card';
import { MangaMappingDisplay } from './MangaMappingDisplay';
import { Play, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnimeCardProps {
  anime: AnimeSeries;
  rank?: number;
}

export const AnimeCard = ({ anime, rank }: AnimeCardProps) => {
  const currentEpisode = anime.episodes[0]; // Most recent episode

  return (
    <Link to={`/anime/${anime.id}`}>
      <Card className="group overflow-hidden transition-all duration-200 hover:border-primary/50 cursor-pointer border-dashed">
        <div className="terminal-header flex items-center justify-between">
          <span>
            {rank && <span className="text-syntax-amber">#{String(rank).padStart(2, '0')}</span>}
            {rank && <span className="mx-2 text-border">|</span>}
            <span className="text-muted-foreground">anime_data</span>
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
          <div className="flex flex-col sm:flex-row">
            {/* Cover Image */}
            <div className="relative w-full sm:w-44 h-44 sm:h-auto shrink-0 overflow-hidden border-b sm:border-b-0 sm:border-r border-dashed">
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent sm:bg-gradient-to-r" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs">
                <Play className="w-3 h-3 text-primary" />
                <span className="text-primary font-semibold">ep_{anime.currentEpisode}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col gap-3 font-mono">
              {/* Data structure */}
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

              {/* Current episode mapping */}
              {currentEpisode && (
                <div className="mt-auto pt-2 border-t border-dashed">
                  <p className="text-[10px] text-muted-foreground mb-2 tracking-wider">
                    // latest_episode
                  </p>
                  <MangaMappingDisplay episode={currentEpisode} showEpisodeNumber={false} />
                </div>
              )}

              {/* View details hint */}
              <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-muted-foreground">{'>'}</span> view_all_episodes
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
