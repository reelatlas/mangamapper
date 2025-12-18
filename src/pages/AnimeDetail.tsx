import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { MangaMappingDisplay } from '@/components/MangaMappingDisplay';
import { EpisodeBadge } from '@/components/EpisodeBadge';
import { ProgressTracker } from '@/components/ProgressTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAnimeById } from '@/data/mockAnime';
import { Play, BookOpen, Tv, ArrowLeft } from 'lucide-react';

const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const anime = getAnimeById(id || '');

  if (!anime) {
    return (
      <div className="min-h-screen bg-background font-mono">
        <Header />
        <main className="container py-16 text-center">
          <div className="border border-dashed p-8 max-w-md mx-auto">
            <p className="text-destructive text-sm mb-4">
              <span className="text-syntax-cyan">error</span>
              <span className="text-muted-foreground">: </span>
              <span className="text-syntax-green">anime_not_found</span>
            </p>
            <Button asChild className="border-dashed text-xs">
              <Link to="/" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> back_to_home
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const canonCount = anime.episodes.filter(ep => ep.type === 'canon').length;
  const fillerCount = anime.episodes.filter(ep => ep.type === 'filler').length;
  const animeOnlyCount = anime.episodes.filter(ep => ep.type === 'anime-only-canon').length;

  return (
    <div className="min-h-screen bg-background font-mono">
      <Header />
      
      <main className="container py-8">
        {/* Hero section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Cover image */}
          <div className="w-full lg:w-64 shrink-0">
            <Card className="border-dashed overflow-hidden">
              <div className="terminal-header">
                <span className="text-muted-foreground">cover</span>
              </div>
              <div className="relative aspect-[3/4]">
                <img
                  src={anime.coverImage}
                  alt={anime.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-xs border px-2 py-1 bg-background/80 rounded-full">
                    {anime.status === 'airing' ? (
                      <span className="text-accent">airing</span>
                    ) : (
                      <span className="text-muted-foreground">complete</span>
                    )}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-4">
            <Card className="border-dashed flex-1 flex flex-col">
              <div className="terminal-header">
                <span className="text-muted-foreground">anime_info</span>
              </div>
              <CardContent className="p-4 space-y-3 text-sm flex-1">
                <div>
                  <span className="text-syntax-cyan">title</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-syntax-green text-lg">{anime.title}</span>
                </div>
                <div>
                  <span className="text-syntax-cyan">title_jp</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-syntax-green">{anime.japaneseTitle}</span>
                </div>
                <div>
                  <span className="text-syntax-cyan">genres</span>
                  <span className="text-muted-foreground">: </span>
                  {anime.genres.map((genre, i) => (
                    <span key={genre}>
                      <span className="text-syntax-amber">{genre.toLowerCase()}</span>
                      {i < anime.genres.length - 1 && <span className="text-muted-foreground">, </span>}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-dashed">
                  <span className="text-syntax-cyan">synopsis</span>
                  <span className="text-muted-foreground">: </span>
                  <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                    {anime.synopsis}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="border-dashed">
                <CardContent className="p-3 text-center">
                  <Play className="w-4 h-4 mx-auto mb-1 text-syntax-amber" />
                  <div className="text-xl font-bold text-syntax-amber">{anime.currentEpisode}</div>
                  <div className="text-[10px] text-muted-foreground">episodes</div>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="p-3 text-center">
                  <BookOpen className="w-4 h-4 mx-auto mb-1 text-accent" />
                  <div className="text-xl font-bold text-accent">{canonCount}</div>
                  <div className="text-[10px] text-muted-foreground">canon</div>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="p-3 text-center">
                  <Tv className="w-4 h-4 mx-auto mb-1 text-syntax-purple" />
                  <div className="text-xl font-bold text-syntax-purple">{animeOnlyCount}</div>
                  <div className="text-[10px] text-muted-foreground">anime only</div>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="p-3 text-center">
                  <span className="block text-xs font-bold text-destructive mb-1">ffff</span>
                  <div className="text-xl font-bold text-destructive">{fillerCount}</div>
                  <div className="text-[10px] text-muted-foreground">filler</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Progress tracker */}
        <div className="mb-6">
          <ProgressTracker anime={anime} />
        </div>

        {/* Episodes list */}
        <Card className="border-dashed">
          <div className="terminal-header">
            <span className="text-muted-foreground">episode_list</span>
          </div>
          {/* Inline legend */}
          <div className="px-4 pt-3 pb-0">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <EpisodeBadge type="canon" />
                <span>= follows manga</span>
              </div>
              <div className="flex items-center gap-1.5">
                <EpisodeBadge type="anime-only-canon" />
                <span>= anime original</span>
              </div>
              <div className="flex items-center gap-1.5">
                <EpisodeBadge type="filler" />
                <span>= fml</span>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              {anime.episodes.map((episode) => (
                <MangaMappingDisplay 
                  key={episode.number} 
                  episode={episode}
                  showEpisodeNumber={true}
                />
              ))}
            </div>
            
            {anime.episodes.length < anime.currentEpisode && (
              <p className="text-center text-xs text-muted-foreground mt-6 py-4 border-t border-dashed">
                <span className="text-syntax-cyan">// </span>
                showing {anime.episodes.length} of {anime.currentEpisode} episodes
                <br />
                <span className="text-syntax-cyan">// </span>
                full list coming soon
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-dashed mt-16">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          <p>
            <span className="text-foreground/40">mangaMapper</span>{' '}
            <span>// anime-to-manga</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AnimeDetail;
